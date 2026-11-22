"""Kitchen cooking detection: PM2.5-jump sensor, close-the-kids'-doors reminder, kids' purifier purge.

Calibrated 2026-11-22 on 8 days of recorder data: PM2.5 >= 8 over its 15-min low with the
kitchen occupied, held 3 min, caught the five sustained cooking events and none of the
one-reading spikes. Gas range, so there's no power signal.
"""
from pathlib import Path

import jinja2
import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
SENSOR = REPO / "packages/kitchen/sensors/kitchen_cooking.yaml"
DOORS = REPO / "packages/kitchen/air_quality/kitchen_cooking_close_doors.yaml"
COOK = REPO / "packages/air_quality/cooking"
SCRIPT = REPO / "packages/air_quality/air_quality_set_purifier_mode.yaml"
KIDS = ["fan.ninos_bedroom_air_purifier", "fan.gianlucas_bedroom_air_purifier"]
NINO_DOOR, GL_DOOR = "binary_sensor.ninos_door_sensor_status", "binary_sensor.gianlucas_door_sensor_status"


class _L(yaml.SafeLoader):
    pass


_L.add_multi_constructor("!", lambda loader, suffix, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_L)


def _float(value, default=None):
    try:
        return float(value)
    except (TypeError, ValueError):
        if default is None:
            raise
        return default


def render(tpl, values=None, **ctx):
    values = values or {}
    env = jinja2.Environment(extensions=["jinja2.ext.do"])
    env.filters["float"] = _float

    def states(eid):
        return str(values.get(eid, "unavailable"))

    ctx.setdefault("states", states)
    ctx.setdefault("is_state", lambda eid, s: states(eid) == s)
    ctx.setdefault("has_value", lambda eid: states(eid) not in ("unavailable", "unknown"))
    return env.from_string(tpl).render(**ctx).strip()


# --- Detection sensor --------------------------------------------------------------------

def _cooking():
    return load(SENSOR)["template"][0]["binary_sensor"][0]


def test_statistics_low_is_a_15_minute_min_of_kitchen_pm25():
    stat = load(SENSOR)["sensor"][0]
    assert stat["platform"] == "statistics"
    assert stat["entity_id"] == "sensor.kitchen_awair_pm2_5"
    # Numeric sources take value_min; plain "min" fails the schema and HA silently drops the sensor.
    assert stat["state_characteristic"] == "value_min"
    assert stat["max_age"] == {"minutes": 15}
    assert stat["keep_last_sample"] is True
    # 15 min of ~1/min Awair updates must fit; the default of 20 would cut the window short.
    assert stat["sampling_size"] >= 60


@pytest.mark.parametrize("pm,low,occ,want", [
    (16, 1, "on", "True"),     # a real cooking jump
    (9, 1, "on", "True"),      # exactly 8 over
    (8, 1, "on", "False"),     # 7 over
    (40, 35, "on", "False"),   # high but steady
    (16, 1, "off", "False"),   # kitchen empty
])
def test_cooking_state(pm, low, occ, want):
    vals = {"sensor.kitchen_awair_pm2_5": pm, "sensor.kitchen_pm2_5_15_minute_low": low,
            "input_boolean.kitchen_occupied": occ}
    assert render(_cooking()["state"], vals) == want


def test_cooking_holds_and_filters_spikes():
    c = _cooking()
    assert c["delay_on"] == {"minutes": 3}
    assert c["delay_off"] == {"minutes": 30}
    vals = {"sensor.kitchen_awair_pm2_5": 5}
    assert render(c["availability"], vals) == "False"
    vals["sensor.kitchen_pm2_5_15_minute_low"] = 1
    assert render(c["availability"], vals) == "True"


# --- Door reminder -------------------------------------------------------------------------

def _doors():
    return load(DOORS)["automation"][0]


def test_reminder_only_when_cooking_starts_with_a_door_open():
    a = _doors()
    assert a["mode"] == "single"
    assert a["triggers"] == [{"trigger": "state", "entity_id": "binary_sensor.kitchen_cooking",
                              "from": "off", "to": "on"}]
    conds = a["conditions"]
    assert conds[0] == {"condition": "state", "entity_id": "input_boolean.house_occupied", "state": "on"}
    door_or = conds[1]
    assert door_or["condition"] == "or"
    assert {c["entity_id"] for c in door_or["conditions"]} == {NINO_DOOR, GL_DOOR}


def test_reminder_repeats_once_and_rechecks_doors():
    rep = _doors()["actions"][0]["repeat"]
    assert rep["count"] == 2
    seq = rep["sequence"]
    names = seq[0]["variables"]["doors"]
    guard = seq[1]
    assert "doors != ''" in guard["value_template"]
    assert "is_state('binary_sensor.kitchen_cooking', 'on')" in guard["value_template"]
    assert seq[2]["action"] == "script.voice_announcement"
    assert seq[2]["data"]["media_players"] == "auto"
    assert seq[-1] == {"delay": {"minutes": 10}}

    msg = seq[2]["data"]["speech_message"]
    for nino, gl, want_doors, want in [
        ("on", "off", "Nino's", "Nino's door"),
        ("off", "on", "Gianluca's", "Gianluca's door"),
        ("on", "on", "Nino's and Gianluca's", "Nino's and Gianluca's doors"),
        ("off", "off", "", None),
    ]:
        doors = render(names, {NINO_DOOR: nino, GL_DOOR: gl})
        assert doors == want_doors
        if want:
            assert want in " ".join(render(msg, doors=doors).split())


# --- Purge ---------------------------------------------------------------------------------

def _vars():
    return load(SCRIPT)["script"]["air_quality_set_air_purifier_mode"]["variables"]


def _mode_speed(purifier, aqi, room, purge_on):
    v = _vars()
    vals = {"input_boolean.cooking_air_purge": "on" if purge_on else "off"}
    purge = render(v["purge"], vals, purifier=purifier, room_state=room) == "True"
    ctx = dict(purge=purge, aqi_state=aqi, room_state=room)
    return render(v["set_mode"], **ctx), render(v["set_speed"], **ctx)


@pytest.mark.parametrize("fan", KIDS)
def test_purge_runs_kids_purifiers_at_100(fan):
    assert _mode_speed(fan, "Acceptable", "Auto", True) == ("Manual", "100")
    assert _mode_speed(fan, "Moderate", "Auto", True) == ("Manual", "100")


@pytest.mark.parametrize("room", ["Bedtime", "Off"])
def test_purge_yields_to_bedtime_and_off(room):
    want_mode = "Sleep" if room == "Bedtime" else "Off"
    assert _mode_speed(KIDS[0], "Acceptable", room, True)[0] == want_mode


def test_purge_leaves_other_purifiers_alone():
    assert _mode_speed("fan.kitchen_air_purifier", "Acceptable", "Auto", True) == ("Auto", "0")
    assert _mode_speed("fan.main_bedroom_air_purifier", "Moderate", "Auto", True) == ("Manual", "50")


def test_no_purge_keeps_normal_logic():
    assert _mode_speed(KIDS[1], "Acceptable", "Auto", False) == ("Auto", "0")


def test_purge_flag_has_no_initial():
    flag = load(COOK / "cooking_air_purge_boolean.yaml")["input_boolean"]["cooking_air_purge"]
    assert "initial" not in flag


def test_purge_on_starts_with_cooking_and_reapplies():
    a = load(COOK / "cooking_air_purge_on.yaml")["automation"][0]
    assert a["triggers"][0]["entity_id"] == "binary_sensor.kitchen_cooking"
    assert a["triggers"][0]["to"] == "on"
    assert [x["action"] for x in a["actions"]] == ["input_boolean.turn_on", "script.cooking_air_purge_apply"]


def test_purge_off_has_four_paths_and_reapplies():
    a = load(COOK / "cooking_air_purge_off.yaml")["automation"][0]
    trig = a["triggers"]
    assert {"trigger": "state", "entity_id": "binary_sensor.kitchen_cooking", "to": "off"} in trig
    assert any(t["entity_id"] == "input_boolean.cooking_air_purge" and t.get("for") == {"hours": 2} for t in trig)
    assert any(t["entity_id"] == ["input_select.ninos_bedroom", "input_select.gianlucas_bedroom"]
               and t["to"] == "Bedtime" for t in trig)
    assert any(t["entity_id"] == "input_boolean.house_occupied" and t["to"] == "off" for t in trig)
    assert a["actions"][0]["action"] == "input_boolean.turn_off"
    assert a["actions"][1]["then"][0]["action"] == "script.cooking_air_purge_apply"


@pytest.mark.parametrize("trigger_eid,nino,gl,ends", [
    ("input_select.ninos_bedroom", "Bedtime", "Auto", False),   # one kid down: keep purging the other
    ("input_select.gianlucas_bedroom", "Bedtime", "Bedtime", True),
    ("binary_sensor.kitchen_cooking", "Auto", "Auto", True),
])
def test_purge_off_bedtime_needs_both_rooms(trigger_eid, nino, gl, ends):
    a = load(COOK / "cooking_air_purge_off.yaml")["automation"][0]
    tpl = a["conditions"][1]["value_template"]
    vals = {"input_select.ninos_bedroom": nino, "input_select.gianlucas_bedroom": gl}
    from types import SimpleNamespace
    assert render(tpl, vals, trigger=SimpleNamespace(entity_id=trigger_eid)) == str(ends)


def test_apply_reruns_both_kids_purifiers():
    seq = load(COOK / "cooking_air_purge_apply.yaml")["script"]["cooking_air_purge_apply"]["sequence"]
    assert sorted(s["data"]["purifier"] for s in seq) == sorted(KIDS)
    assert all(s["action"] == "script.air_quality_set_air_purifier_mode" for s in seq)
