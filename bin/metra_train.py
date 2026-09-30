#!/usr/bin/env python3
"""Metra train delay/cancellation status for a configured train slot.

Fetches the Metra GTFS-RT TripUpdates feed, decodes it with a hand-rolled
protobuf wire-format reader (no protobuf dependency), and prints one JSON
status object for the requested train slot (1 or 2). The trip fragment,
scheduled time, and stop are read from the secrets file (metra_trains /
metra_stop) rather than hard-coded. Always exits 0.
"""

import json
import math
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

CHICAGO = ZoneInfo("America/Chicago")
FEED_URL_TEMPLATE = "https://gtfspublic.metrarr.com/gtfs/public/tripupdates?api_token={token}"
SECRETS_PATH_DEFAULT = "/config/secrets.yaml"
REQUEST_TIMEOUT = 8

VALID_SLOTS = ("1", "2")

WINDOW_START = (6, 45)
WINDOW_END = (9, 0)

CANCELED = 3   # TripDescriptor.schedule_relationship
SKIPPED = 1    # StopTimeUpdate.schedule_relationship

OUTPUT_KEYS = ("delay", "status", "scheduled_departure", "expected_departure", "last_update", "error")


# ---------------------------------------------------------------------------
# Protobuf wire-format decoder (GTFS-RT FeedMessage subset)
# ---------------------------------------------------------------------------

def _read_varint(buf, pos):
    result = 0
    shift = 0
    length = len(buf)
    while True:
        if pos >= length:
            raise ValueError("truncated varint")
        byte = buf[pos]
        pos += 1
        result |= (byte & 0x7F) << shift
        if not (byte & 0x80):
            return result, pos
        shift += 7
        if shift > 70:
            raise ValueError("varint too long")


def _parse_fields(buf):
    """Parse one protobuf message into {field_number: [raw_values]}."""
    fields = {}
    pos = 0
    length = len(buf)
    while pos < length:
        key, pos = _read_varint(buf, pos)
        field_number = key >> 3
        wire_type = key & 0x07
        if wire_type == 0:
            value, pos = _read_varint(buf, pos)
        elif wire_type == 1:
            value = buf[pos:pos + 8]
            pos += 8
        elif wire_type == 2:
            vlen, pos = _read_varint(buf, pos)
            value = buf[pos:pos + vlen]
            pos += vlen
        elif wire_type == 5:
            value = buf[pos:pos + 4]
            pos += 4
        else:
            raise ValueError(f"unsupported wire type {wire_type}")
        if pos > length:
            raise ValueError("field overruns message")
        fields.setdefault(field_number, []).append(value)
    return fields


def _first(fields, number):
    values = fields.get(number)
    return values[0] if values else None


def _decode_str(raw):
    return raw.decode("utf-8", "replace") if raw is not None else None


def decode_feed(data):
    """Decode a GTFS-RT FeedMessage into a plain dict structure.

    Returns {"timestamp": int|None, "entities": [entity, ...]}, where each
    entity is {"trip_id", "schedule_relationship", "vehicle_label", "stops"}
    and each stop is {"stop_id", "arrival_time", "departure_time",
    "schedule_relationship"}.
    """
    top = _parse_fields(data)

    timestamp = None
    header_bytes = _first(top, 1)
    if header_bytes is not None:
        header_fields = _parse_fields(header_bytes)
        timestamp = _first(header_fields, 3)

    entities = []
    for entity_bytes in top.get(2, []):
        entity_fields = _parse_fields(entity_bytes)
        trip_update_bytes = _first(entity_fields, 3)

        entity = {
            "trip_id": None,
            "schedule_relationship": None,
            "vehicle_label": None,
            "stops": [],
        }

        if trip_update_bytes is not None:
            tu_fields = _parse_fields(trip_update_bytes)

            trip_bytes = _first(tu_fields, 1)
            if trip_bytes is not None:
                trip_fields = _parse_fields(trip_bytes)
                entity["trip_id"] = _decode_str(_first(trip_fields, 1))
                entity["schedule_relationship"] = _first(trip_fields, 4)

            vehicle_bytes = _first(tu_fields, 3)
            if vehicle_bytes is not None:
                vehicle_fields = _parse_fields(vehicle_bytes)
                entity["vehicle_label"] = _decode_str(_first(vehicle_fields, 2))

            stops = []
            for stu_bytes in tu_fields.get(2, []):
                stu_fields = _parse_fields(stu_bytes)

                arrival_time = None
                arrival_bytes = _first(stu_fields, 2)
                if arrival_bytes is not None:
                    arrival_fields = _parse_fields(arrival_bytes)
                    arrival_time = _first(arrival_fields, 2)

                departure_time = None
                departure_bytes = _first(stu_fields, 3)
                if departure_bytes is not None:
                    departure_fields = _parse_fields(departure_bytes)
                    departure_time = _first(departure_fields, 2)

                stops.append({
                    "stop_id": _decode_str(_first(stu_fields, 4)),
                    "arrival_time": arrival_time,
                    "departure_time": departure_time,
                    "schedule_relationship": _first(stu_fields, 5),
                })
            entity["stops"] = stops

        entities.append(entity)

    return {"timestamp": timestamp, "entities": entities}


# ---------------------------------------------------------------------------
# Evaluation (pure — no I/O)
# ---------------------------------------------------------------------------

def evaluate(feed, fragment, stop, scheduled_dt, now):
    """Evaluate a train's status against a decoded feed.

    `fragment` is the configured trip_id fragment for this slot (matched as
    `_<fragment>_` inside the trip_id); `stop` is the configured stop_id.
    `now` is accepted for symmetry with the CLI flow (which uses it for
    window-gating before this is ever called); it does not affect the
    delay/status computation itself.
    """
    last_update = None
    if feed.get("timestamp") is not None:
        last_update = datetime.fromtimestamp(feed["timestamp"], tz=CHICAGO)

    needle = f"_{fragment}_"
    candidates = [
        entity for entity in feed.get("entities", [])
        if entity.get("trip_id") and needle in entity.get("trip_id")
    ]
    # Tie-break for duplicate/stale entities sharing the same trip fragment:
    # prefer the first candidate that actually carries a stop_time_update
    # for the target stop, so a stale variant without the stop doesn't mask
    # a real one further down the list. If none carry the stop, fall back
    # to the first candidate (so the "stop missing" no_data path below still
    # fires, rather than silently picking a later duplicate).
    match = next(
        (e for e in candidates if any(s.get("stop_id") == stop for s in e.get("stops", []))),
        candidates[0] if candidates else None,
    )

    if match is None:
        return {
            "delay": None, "status": "no_data",
            "scheduled_departure": scheduled_dt, "expected_departure": None,
            "last_update": last_update, "error": "not_in_feed",
        }

    if match.get("schedule_relationship") == CANCELED:
        return {
            "delay": 0, "status": "cancelled",
            "scheduled_departure": scheduled_dt, "expected_departure": None,
            "last_update": last_update, "error": None,
        }

    stop_match = None
    for candidate in match.get("stops", []):
        if candidate.get("stop_id") == stop:
            stop_match = candidate
            break

    if stop_match is None:
        return {
            "delay": None, "status": "no_data",
            "scheduled_departure": scheduled_dt, "expected_departure": None,
            "last_update": last_update, "error": "not_in_feed",
        }

    if stop_match.get("schedule_relationship") == SKIPPED:
        return {
            "delay": 0, "status": "cancelled",
            "scheduled_departure": scheduled_dt, "expected_departure": None,
            "last_update": last_update, "error": None,
        }

    predicted_epoch = stop_match.get("arrival_time")
    if predicted_epoch is None:
        predicted_epoch = stop_match.get("departure_time")

    if predicted_epoch is None:
        return {
            "delay": None, "status": "no_data",
            "scheduled_departure": scheduled_dt, "expected_departure": None,
            "last_update": last_update, "error": "not_in_feed",
        }

    predicted_dt = datetime.fromtimestamp(predicted_epoch, tz=CHICAGO)
    delay = math.floor((predicted_dt - scheduled_dt).total_seconds() / 60 + 0.5)
    status = "delayed" if delay >= 5 else "on_time"

    return {
        "delay": delay, "status": status,
        "scheduled_departure": scheduled_dt, "expected_departure": predicted_dt,
        "last_update": last_update, "error": None,
    }


# ---------------------------------------------------------------------------
# I/O helpers
# ---------------------------------------------------------------------------

def _now():
    """Current time, or the injected METRA_NOW override.

    Always returns a valid tz-aware datetime — a malformed override falls
    back to the real clock rather than raising, so callers never need to
    guard against this (AC9: the script always exits 0 with valid JSON).
    """
    raw = os.environ.get("METRA_NOW")
    if raw:
        try:
            dt = datetime.fromisoformat(raw)
        except (ValueError, TypeError):
            return datetime.now(CHICAGO)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=CHICAGO)
        return dt.astimezone(CHICAGO)
    return datetime.now(CHICAGO)


def _in_window(now):
    start = now.replace(hour=WINDOW_START[0], minute=WINDOW_START[1], second=0, microsecond=0)
    end = now.replace(hour=WINDOW_END[0], minute=WINDOW_END[1], second=0, microsecond=0)
    return start <= now <= end


def _read_secret(secrets_path, key):
    """Return the raw value for `key: value` in the secrets file, or None.

    Shared line parser for every key this script reads out of the secrets
    file (token, train config, stop) — strips a matching pair of quotes,
    same as the rest of this repo's `!secret` values.
    """
    try:
        with open(secrets_path, "r", encoding="utf-8") as handle:
            prefix = f"{key}:"
            for line in handle:
                stripped = line.strip()
                if stripped.startswith(prefix):
                    _, _, value = stripped.partition(":")
                    value = value.strip()
                    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                        value = value[1:-1]
                    value = value.strip()
                    return value or None
    except OSError:
        return None
    return None


def _read_token(secrets_path):
    return _read_secret(secrets_path, "metra_api_token")


def _parse_trains_config(secrets_path):
    """Parse `metra_trains` / `metra_stop` out of the secrets file.

    `metra_trains` is a comma-separated list of `<trip_id_fragment>@<HH:MM>`
    entries, e.g. "FRAG1@07:00,FRAG2@07:30"; slot 1 is the first entry, slot
    2 is the second. Returns (trains, stop), where `trains` is a list of
    (fragment, hour, minute) tuples in slot order. Returns (None, None) on
    any missing or malformed value.
    """
    raw_trains = _read_secret(secrets_path, "metra_trains")
    stop = _read_secret(secrets_path, "metra_stop")
    if not raw_trains or not stop:
        return None, None

    trains = []
    for entry in raw_trains.split(","):
        entry = entry.strip()
        if not entry or "@" not in entry:
            return None, None
        fragment, _, time_part = entry.partition("@")
        fragment = fragment.strip()
        time_part = time_part.strip()
        if not fragment or ":" not in time_part:
            return None, None
        hour_str, _, minute_str = time_part.partition(":")
        try:
            hour = int(hour_str)
            minute = int(minute_str)
        except ValueError:
            return None, None
        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            return None, None
        trains.append((fragment, hour, minute))

    if not trains:
        return None, None
    return trains, stop


def _fetch_feed(token):
    url = FEED_URL_TEMPLATE.format(token=urllib.parse.quote(token, safe=""))
    request = urllib.request.Request(url)
    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
        return response.read()


def _no_data(scheduled_dt, error, last_update=None):
    return {
        "delay": None, "status": "no_data",
        "scheduled_departure": scheduled_dt, "expected_departure": None,
        "last_update": last_update, "error": error,
    }


def _to_json(result):
    out = {}
    for key in OUTPUT_KEYS:
        value = result.get(key)
        if isinstance(value, datetime):
            value = value.isoformat()
        out[key] = value
    return out


def run(slot, now=None):
    """Full flow for one train slot: config, window gate, token, fetch,
    decode, evaluate.

    `now` may be passed in (main() computes it once, up front); if omitted,
    it's read via _now() — kept for direct callers/tests.
    """
    if now is None:
        now = _now()

    secrets_path = os.environ.get("METRA_SECRETS", SECRETS_PATH_DEFAULT)
    trains, stop = _parse_trains_config(secrets_path)

    try:
        slot_index = int(slot) - 1
    except (TypeError, ValueError):
        return _to_json(_no_data(now, "missing_config"))

    if trains is None or slot_index < 0 or slot_index >= len(trains):
        return _to_json(_no_data(now, "missing_config"))

    fragment, hour, minute = trains[slot_index]
    scheduled_dt = now.replace(hour=hour, minute=minute, second=0, microsecond=0)

    if not _in_window(now):
        return _to_json(_no_data(scheduled_dt, "outside_window"))

    token = _read_token(secrets_path)
    if not token:
        return _to_json(_no_data(scheduled_dt, "missing_token"))

    try:
        raw = _fetch_feed(token)
    except urllib.error.HTTPError as exc:
        return _to_json(_no_data(scheduled_dt, f"http_{exc.code}"))
    except (urllib.error.URLError, OSError):
        # Covers connect/read timeouts (socket.timeout is a TimeoutError
        # alias) and any other network failure; there's no dedicated error
        # bucket for those beyond "timeout".
        return _to_json(_no_data(scheduled_dt, "timeout"))

    try:
        feed = decode_feed(raw)
    except Exception:
        return _to_json(_no_data(scheduled_dt, "decode"))

    result = evaluate(feed, fragment, stop, scheduled_dt, now)
    return _to_json(result)


def main(argv):
    now = _now()  # computed once, up front; _now() itself never raises.
    slot = argv[1] if len(argv) > 1 else None
    if slot not in VALID_SLOTS:
        # Missing/unknown slot argument. Not in the PRD's error enum
        # (outside_window/missing_token/http_<code>/timeout/decode/
        # not_in_feed/missing_config) — added as its own code rather than
        # overloading "decode", which means "the feed didn't parse".
        output = _to_json(_no_data(now, "bad_args"))
    else:
        try:
            output = run(slot, now=now)
        except Exception:
            # Top-level safety net: never crash, never leak the token/URL.
            # Reuses the already-computed `now` — nothing here can raise.
            output = _to_json(_no_data(now, "decode"))
    print(json.dumps(output))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
