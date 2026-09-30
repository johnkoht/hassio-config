"""Tests for bin/metra_train.py — GTFS-RT decoder, delay math, and the CLI.

Loaded via importlib (bin/ isn't a package). A tiny protobuf encoder below
builds synthetic FeedMessage bytes for the cancellation/skip cases so those
exercise the real decoder, not just evaluate()'s dict shape.
"""
import importlib.util
import json
import subprocess
import sys
import urllib.error
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

BIN_PATH = Path(__file__).parent.parent / "bin" / "metra_train.py"
FIXTURE_PATH = Path(__file__).parent / "fixtures" / "metra_tripupdates.pb"
CHICAGO = ZoneInfo("America/Chicago")


def _load_module():
    spec = importlib.util.spec_from_file_location("metra_train", BIN_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


mt = _load_module()

# Fake fragment/stop used across the synthetic (non-fixture) tests.
FRAG = "MN9001"
STOP = "TESTSTOP"


# ---------------------------------------------------------------------------
# Tiny test-side protobuf encoder (mirrors the field numbers in bin/metra_train.py)
# ---------------------------------------------------------------------------

def _enc_varint(value):
    out = bytearray()
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            out.append(byte | 0x80)
        else:
            out.append(byte)
            return bytes(out)


def _enc_tag(field_number, wire_type):
    return _enc_varint((field_number << 3) | wire_type)


def _enc_varint_field(field_number, value):
    return _enc_tag(field_number, 0) + _enc_varint(value)


def _enc_bytes_field(field_number, data):
    return _enc_tag(field_number, 2) + _enc_varint(len(data)) + data


def _enc_string_field(field_number, text):
    return _enc_bytes_field(field_number, text.encode("utf-8"))


def _enc_stop_time_event(epoch):
    return _enc_varint_field(2, epoch)


def _enc_stop_time_update(stop_id, arrival_epoch=None, schedule_relationship=None):
    body = b""
    if arrival_epoch is not None:
        body += _enc_bytes_field(2, _enc_stop_time_event(arrival_epoch))
    body += _enc_string_field(4, stop_id)
    if schedule_relationship is not None:
        body += _enc_varint_field(5, schedule_relationship)
    return body


def _enc_trip_descriptor(trip_id, schedule_relationship=None):
    body = _enc_string_field(1, trip_id)
    if schedule_relationship is not None:
        body += _enc_varint_field(4, schedule_relationship)
    return body


def _enc_trip_update(trip_id, stops, trip_schedule_relationship=None, vehicle_label=None):
    body = _enc_bytes_field(1, _enc_trip_descriptor(trip_id, trip_schedule_relationship))
    for stop_id, arrival_epoch, stop_schedule_relationship in stops:
        body += _enc_bytes_field(2, _enc_stop_time_update(stop_id, arrival_epoch, stop_schedule_relationship))
    if vehicle_label is not None:
        body += _enc_bytes_field(3, _enc_string_field(2, vehicle_label))
    return body


def _enc_feed_entity(trip_id, stops, trip_schedule_relationship=None, vehicle_label=None):
    trip_update = _enc_trip_update(trip_id, stops, trip_schedule_relationship, vehicle_label)
    return _enc_bytes_field(3, trip_update)


def build_feed(timestamp, entities):
    """entities: list of (trip_id, stops, trip_schedule_relationship, vehicle_label)."""
    header = _enc_varint_field(3, timestamp)
    body = _enc_bytes_field(1, header)
    for trip_id, stops, trip_sr, vehicle_label in entities:
        body += _enc_bytes_field(2, _enc_feed_entity(trip_id, stops, trip_sr, vehicle_label))
    return body


# ---------------------------------------------------------------------------
# Rounding edges (AC6) — evaluate() against a hand-built feed dict
# ---------------------------------------------------------------------------

def _feed_with_single_prediction(scheduled_dt, offset_seconds):
    predicted_epoch = int((scheduled_dt + timedelta(seconds=offset_seconds)).timestamp())
    return {
        "timestamp": predicted_epoch,
        "entities": [{
            "trip_id": f"MD-N_{FRAG}_V3_A",
            "schedule_relationship": None,
            "vehicle_label": "100",
            "stops": [{
                "stop_id": STOP,
                "arrival_time": predicted_epoch,
                "departure_time": None,
                "schedule_relationship": 0,
            }],
        }],
    }


@pytest.mark.parametrize("offset_seconds,expected_delay", [
    (-93, -2),
    (90, 2),
    (150, 3),
    (-90, -1),
])
def test_rounding_edges(offset_seconds, expected_delay):
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    feed = _feed_with_single_prediction(scheduled_dt, offset_seconds)
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["delay"] == expected_delay


# ---------------------------------------------------------------------------
# Matching / missing-train
# ---------------------------------------------------------------------------

def test_not_in_feed_when_train_absent():
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    feed = {
        "timestamp": int(scheduled_dt.timestamp()),
        "entities": [{
            "trip_id": "MD-N_MN9999_V3_A",
            "schedule_relationship": None,
            "vehicle_label": None,
            "stops": [],
        }],
    }
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["status"] == "no_data"
    assert result["error"] == "not_in_feed"
    assert result["delay"] is None
    assert result["expected_departure"] is None


def test_not_in_feed_when_stop_missing():
    """The target stop already passed and dropped from the trip's remaining stops."""
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    feed = {
        "timestamp": int(scheduled_dt.timestamp()),
        "entities": [{
            "trip_id": f"MD-N_{FRAG}_V3_A",
            "schedule_relationship": None,
            "vehicle_label": "100",
            "stops": [{
                "stop_id": "SOMEWHERE_ELSE",
                "arrival_time": int(scheduled_dt.timestamp()),
                "departure_time": None,
                "schedule_relationship": 0,
            }],
        }],
    }
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["status"] == "no_data"
    assert result["error"] == "not_in_feed"


# ---------------------------------------------------------------------------
# Fixture decode (AC10 / pre-mortem Risk 4)
# ---------------------------------------------------------------------------

def test_fixture_decodes_52_entities():
    data = FIXTURE_PATH.read_bytes()
    feed = mt.decode_feed(data)
    assert len(feed["entities"]) == 52


def test_fixture_2152_at_deerfield_delay():
    """Same evening fixture trip as before, but evaluated at a different
    downstream stop on the same trip, to keep the repo from revealing
    which stop the real automation watches."""
    data = FIXTURE_PATH.read_bytes()
    feed = mt.decode_feed(data)

    match = next(e for e in feed["entities"] if e["trip_id"] and "_MN2152_" in e["trip_id"])
    assert match["trip_id"] == "MD-N_MN2152_V3_D"
    assert match["vehicle_label"] == "2152"

    deerfield = next(s for s in match["stops"] if s["stop_id"] == "DEERFIELD")
    assert deerfield["arrival_time"] == 1790640389

    # Scheduled DEERFIELD arrival for this trip, per stop_times.txt: 19:08:00.
    scheduled_dt = datetime(2026, 9, 28, 19, 8, 0, tzinfo=CHICAGO)
    result = mt.evaluate(feed, "MN2152", "DEERFIELD", scheduled_dt, scheduled_dt)
    assert result["delay"] == -2
    assert result["status"] == "on_time"
    assert result["error"] is None


# ---------------------------------------------------------------------------
# Cancellation / skip — round-tripped through the real encoder + decoder
# ---------------------------------------------------------------------------

def test_synthetic_cancelled_trip():
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    ts = int(scheduled_dt.timestamp())
    raw = build_feed(ts, [
        (f"MD-N_{FRAG}_V3_A", [(STOP, ts, 0)], mt.CANCELED, "100"),
    ])
    feed = mt.decode_feed(raw)
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["status"] == "cancelled"
    assert result["delay"] == 0
    assert result["expected_departure"] is None
    assert result["error"] is None


def test_synthetic_skipped_stop():
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    ts = int(scheduled_dt.timestamp())
    raw = build_feed(ts, [
        (f"MD-N_{FRAG}_V3_A", [(STOP, None, mt.SKIPPED)], None, "100"),
    ])
    feed = mt.decode_feed(raw)
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["status"] == "cancelled"
    assert result["delay"] == 0
    assert result["expected_departure"] is None
    assert result["error"] is None


def test_duplicate_trip_id_prefers_entity_with_target_stop():
    """A stale/duplicate entity sharing the trip fragment but missing the
    target stop_time_update must not mask a real one later in the feed."""
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    ts = int(scheduled_dt.timestamp())
    stale_epoch = ts - 3600
    real_epoch = ts + 600  # +10 min late
    raw = build_feed(ts, [
        (f"MD-N_{FRAG}_V3_A", [("SOMEWHERE_ELSE", stale_epoch, 0)], None, "stale"),
        (f"MD-N_{FRAG}_V3_A", [(STOP, real_epoch, 0)], None, "real"),
    ])
    feed = mt.decode_feed(raw)
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["delay"] == 10
    assert result["status"] == "delayed"


def test_duplicate_trip_id_both_have_stop_uses_first():
    """When two matching entities both carry the target stop, the first one
    in feed order wins (stable tie-break, not "last wins")."""
    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    ts = int(scheduled_dt.timestamp())
    raw = build_feed(ts, [
        (f"MD-N_{FRAG}_V3_A", [(STOP, ts, 0)], None, "first"),
        (f"MD-N_{FRAG}_V3_A", [(STOP, ts + 600, 0)], None, "second"),
    ])
    feed = mt.decode_feed(raw)
    result = mt.evaluate(feed, FRAG, STOP, scheduled_dt, scheduled_dt)
    assert result["delay"] == 0


def test_garbage_bytes_raise_for_decode_error_path():
    """decode_feed on garbage bytes either raises or yields unusable
    output; run() must map any failure here to a "decode" error (see the
    subprocess-level test below for the full CLI behavior)."""
    with pytest.raises(Exception):
        mt.decode_feed(b"\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff")


# ---------------------------------------------------------------------------
# CLI flow: window gating, config handling, token handling, network failures
# ---------------------------------------------------------------------------

class _FakeResponse:
    def __init__(self, data):
        self._data = data

    def read(self):
        return self._data

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        return False


GOOD_CONFIG = 'metra_trains: "MN9001@07:00,MN9002@07:15"\nmetra_stop: "TESTSTOP"\n'


@pytest.fixture
def secrets_file(tmp_path):
    def _make(body):
        path = tmp_path / "secrets.yaml"
        path.write_text(body, encoding="utf-8")
        return str(path)
    return _make


def test_outside_window_makes_no_network_call(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T05:00:00-05:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + 'metra_api_token: "should-not-be-read"\n'),
    )

    def _boom(*args, **kwargs):
        raise AssertionError("urlopen must not be called outside the window")

    monkeypatch.setattr(mt.urllib.request, "urlopen", _boom)

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "outside_window"
    assert output["delay"] is None
    assert output["expected_departure"] is None


def test_missing_token(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", secrets_file(GOOD_CONFIG))

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_token"


def test_missing_config_no_secrets_file(monkeypatch):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", "/nonexistent/secrets.yaml")

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_config"
    assert output["delay"] is None


def test_missing_config_no_metra_trains_key(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", secrets_file('metra_api_token: "sekrit"\n'))

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_config"


def test_malformed_metra_trains_missing_at(monkeypatch, secrets_file):
    body = 'metra_trains: "MN9001-0700,MN9002@07:15"\nmetra_stop: "TESTSTOP"\n'
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", secrets_file(body))

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_config"


def test_malformed_metra_trains_bad_time(monkeypatch, secrets_file):
    body = 'metra_trains: "MN9001@not-a-time"\nmetra_stop: "TESTSTOP"\n'
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", secrets_file(body))

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_config"


def test_slot_out_of_range_of_configured_trains(monkeypatch, secrets_file):
    """metra_trains only has one entry; slot 2 has no config to draw on."""
    body = 'metra_trains: "MN9001@07:00"\nmetra_stop: "TESTSTOP"\n'
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv("METRA_SECRETS", secrets_file(body))

    output = mt.run("2")
    assert output["status"] == "no_data"
    assert output["error"] == "missing_config"


def test_http_401(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + 'metra_api_token: "sekrit-token-xyz"\n'),
    )

    def _raise_401(*args, **kwargs):
        raise urllib.error.HTTPError("http://example", 401, "Unauthorized", {}, None)

    monkeypatch.setattr(mt.urllib.request, "urlopen", _raise_401)

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "http_401"


def test_timeout(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + 'metra_api_token: "sekrit-token-xyz"\n'),
    )

    def _raise_timeout(*args, **kwargs):
        raise TimeoutError("timed out")

    monkeypatch.setattr(mt.urllib.request, "urlopen", _raise_timeout)

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "timeout"


def test_garbage_bytes_from_feed_give_decode_error(monkeypatch, secrets_file):
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + 'metra_api_token: "sekrit-token-xyz"\n'),
    )

    def _fake_urlopen(*args, **kwargs):
        return _FakeResponse(b"\xff\xff\xff\xff\xff\xff\xff\xff\xff")

    monkeypatch.setattr(mt.urllib.request, "urlopen", _fake_urlopen)

    output = mt.run("1")
    assert output["status"] == "no_data"
    assert output["error"] == "decode"


def test_token_absent_from_all_outputs(monkeypatch, secrets_file):
    secret_token = "super-secret-token-should-never-leak"
    monkeypatch.setenv("METRA_NOW", "2026-09-28T07:00:00-05:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + f'metra_api_token: "{secret_token}"\n'),
    )

    scheduled_dt = datetime(2026, 9, 28, 8, 4, 0, tzinfo=CHICAGO)
    ts = int(scheduled_dt.timestamp())
    good_feed = build_feed(ts, [(f"MD-N_{FRAG}_V3_A", [(STOP, ts, 0)], None, "100")])

    def _fake_urlopen(*args, **kwargs):
        return _FakeResponse(good_feed)

    monkeypatch.setattr(mt.urllib.request, "urlopen", _fake_urlopen)

    scenarios = []

    # Happy path.
    scenarios.append(mt.run("1"))

    # HTTP error path — exception text must also be scrubbed.
    def _raise_401(*args, **kwargs):
        raise urllib.error.HTTPError(f"http://example?api_token={secret_token}", 401, "Unauthorized", {}, None)
    monkeypatch.setattr(mt.urllib.request, "urlopen", _raise_401)
    scenarios.append(mt.run("1"))

    for output in scenarios:
        serialized = json.dumps(output)
        assert secret_token not in serialized


# ---------------------------------------------------------------------------
# DST transition
# ---------------------------------------------------------------------------

def test_dst_transition_date_offset(monkeypatch, secrets_file):
    # 2026-11-01 is DST end (America/Chicago); 2026-11-02 is CST (-06:00).
    monkeypatch.setenv("METRA_NOW", "2026-11-02T07:00:00-06:00")
    monkeypatch.setenv(
        "METRA_SECRETS",
        secrets_file(GOOD_CONFIG + 'metra_api_token: "sekrit"\n'),
    )
    monkeypatch.setattr(
        mt.urllib.request, "urlopen",
        lambda *a, **k: (_ for _ in ()).throw(TimeoutError("no network in this test")),
    )

    output = mt.run("1")
    assert output["scheduled_departure"].startswith("2026-11-02T07:00:00-06:00")


def test_now_injection_respects_iso_offset():
    import os
    os.environ["METRA_NOW"] = "2026-09-28T07:30:00-05:00"
    try:
        now = mt._now()
        assert now.hour == 7
        assert now.minute == 30
        assert now.utcoffset() == timedelta(hours=-5)
    finally:
        del os.environ["METRA_NOW"]


# ---------------------------------------------------------------------------
# CLI smoke test — exactly one JSON object on stdout, exit 0
# ---------------------------------------------------------------------------

def test_cli_prints_one_json_object_and_exits_zero(monkeypatch, tmp_path):
    secrets_path = tmp_path / "secrets.yaml"
    secrets_path.write_text(GOOD_CONFIG + 'metra_api_token: "unused"\n', encoding="utf-8")

    env = dict(**{"METRA_NOW": "2026-09-28T05:00:00-05:00", "METRA_SECRETS": str(secrets_path)})
    import os
    full_env = dict(os.environ)
    full_env.update(env)

    proc = subprocess.run(
        [sys.executable, str(BIN_PATH), "1"],
        capture_output=True, text=True, timeout=15, env=full_env,
    )
    assert proc.returncode == 0
    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    assert len(lines) == 1
    payload = json.loads(lines[0])
    assert set(payload.keys()) == set(mt.OUTPUT_KEYS)
    assert payload["status"] == "no_data"
    assert payload["error"] == "outside_window"


def _run_cli(args, env_overrides):
    import os
    full_env = dict(os.environ)
    full_env.update(env_overrides)
    return subprocess.run(
        [sys.executable, str(BIN_PATH), *args],
        capture_output=True, text=True, timeout=15, env=full_env,
    )


def test_cli_malformed_metra_now_exits_zero_with_valid_json(tmp_path):
    """Regression: METRA_NOW="not-a-date" python3 bin/metra_train.py 1
    used to raise an uncaught ValueError in _now() -> exit 1."""
    secrets_path = tmp_path / "secrets.yaml"
    secrets_path.write_text(GOOD_CONFIG + 'metra_api_token: "unused"\n', encoding="utf-8")

    proc = _run_cli(["1"], {"METRA_NOW": "not-a-date", "METRA_SECRETS": str(secrets_path)})
    assert proc.returncode == 0
    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    assert len(lines) == 1
    payload = json.loads(lines[0])
    assert set(payload.keys()) == set(mt.OUTPUT_KEYS)


def test_cli_no_argv_exits_zero_with_bad_args(tmp_path):
    proc = _run_cli([], {"METRA_NOW": "2026-09-28T05:00:00-05:00"})
    assert proc.returncode == 0
    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    assert len(lines) == 1
    payload = json.loads(lines[0])
    assert payload["status"] == "no_data"
    assert payload["error"] == "bad_args"
    assert payload["delay"] is None
    assert payload["expected_departure"] is None


def test_cli_unknown_slot_exits_zero_with_bad_args(tmp_path):
    proc = _run_cli(["9999"], {"METRA_NOW": "2026-09-28T05:00:00-05:00"})
    assert proc.returncode == 0
    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    assert len(lines) == 1
    payload = json.loads(lines[0])
    assert payload["status"] == "no_data"
    assert payload["error"] == "bad_args"


def test_cli_slot_zero_exits_zero_with_bad_args(tmp_path):
    proc = _run_cli(["0"], {"METRA_NOW": "2026-09-28T05:00:00-05:00"})
    assert proc.returncode == 0
    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    payload = json.loads(lines[0])
    assert payload["status"] == "no_data"
    assert payload["error"] == "bad_args"


def test_now_with_malformed_env_falls_back_to_real_clock(monkeypatch):
    monkeypatch.setenv("METRA_NOW", "not-a-date")
    now = mt._now()
    assert now.tzinfo is not None
    real_now = datetime.now(CHICAGO)
    assert abs((now - real_now).total_seconds()) < 60


def test_main_direct_call_with_malformed_now_and_no_argv(monkeypatch, capsys):
    monkeypatch.setenv("METRA_NOW", "not-a-date")
    rc = mt.main(["metra_train.py"])
    assert rc == 0
    payload = json.loads(capsys.readouterr().out.strip())
    assert payload["status"] == "no_data"
    assert payload["error"] == "bad_args"
