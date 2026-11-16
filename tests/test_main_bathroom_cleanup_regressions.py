"""
Regression tests for the main bathroom cleanup (JK-1226).

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel_path):
    return yaml.load((REPO / rel_path).read_text(), Loader=_Loader)


def test_mode_auto_time_trigger_is_7am():
    auto = load("packages/main_bathroom/mode/main_bathroom_mode_auto.yaml")
    times = [t["at"] for t in auto["automation"][0]["triggers"] if t["trigger"] == "time"]
    assert times == ["07:00:00"]


def test_bedtime_script_alias_names_the_bathroom():
    mode = load("packages/main_bathroom/mode/main_bathroom_mode_bedtime.yaml")
    script = mode["script"]["main_bathroom_activate_bedtime_lighting_mode"]
    assert "Bedroom" not in script["alias"]
    assert script["alias"].startswith("Main Bathroom")


def test_room_sensor_reads_bathroom_climate_sensors():
    area = load("packages/house/areas/upper_floor/main_bathroom.yaml")
    attrs = area["template"][0]["sensor"][0]["attributes"]
    assert "sensor.main_bathroom_temperature" in attrs["temperature"]
    assert "sensor.main_bathroom_humidity" in attrs["humidity"]


# --- Main bathroom Wake mode (JK-1226), mirroring the main bedroom's Wake ---

def _autos(rel_path):
    return load(rel_path)["automation"]


def _flat(conditions):
    for c in conditions or []:
        yield c
        yield from _flat(c.get("conditions"))


def test_select_defines_wake():
    sel = load("packages/main_bathroom/main_bathroom_state.yaml")["input_select"]["main_bathroom"]
    assert "Wake" in sel["options"]
    assert "Wake" in load("packages/main_bedroom/main_bedroom_state.yaml")["input_select"]["main_bedroom"]["options"]


def test_wake_is_set_from_bedroom_wake_only_out_of_bedtime():
    auto = _autos("packages/main_bathroom/mode/main_bathroom_mode_wake.yaml")[0]
    trig = auto["triggers"]
    assert [(t["entity_id"], t["to"]) for t in trig] == [("input_select.main_bedroom", "Wake")]
    cond = [c for c in _flat(auto["conditions"]) if c.get("entity_id") == "input_select.main_bathroom"]
    assert [c["state"] for c in cond] == ["Bedtime"]
    select = [a for a in auto["actions"] if a.get("action") == "input_select.select_option"]
    assert select[0]["data"]["option"] == "Wake"
    off = [a for a in auto["actions"] if a.get("action") == "automation.turn_off"]
    assert off[0]["target"]["entity_id"] == "automation.main_bathroom_bedtime_motion_on"


def test_wake_clears_to_auto_after_ten_minutes_and_bedroom_wake_no_longer_forces_auto():
    auto = _autos("packages/main_bathroom/mode/main_bathroom_mode_auto.yaml")[0]
    own = [t for t in auto["triggers"] if t.get("entity_id") == "input_select.main_bathroom"]
    assert [(t["to"], t["for"]) for t in own] == [("Wake", {"minutes": 10})]
    # A bedroom-Wake trigger here would race the setter and send the bathroom straight to Auto
    bedroom = [t.get("to") for t in auto["triggers"] if t.get("entity_id") == "input_select.main_bedroom"]
    assert bedroom == ["Auto"]


def test_motion_lights_run_in_wake():
    auto = _autos("packages/main_bathroom/lights/main_bathroom_lights_motion_on.yaml")[0]
    mode = [c for c in _flat(auto["conditions"]) if c.get("entity_id") == "input_select.main_bathroom"]
    assert mode[0]["state"] == ["Auto", "Wake"]
    night = _autos("packages/main_bathroom/lights/main_bathroom_bedtime_motion_on.yaml")[0]
    night_mode = [c for c in _flat(night["conditions"]) if c.get("entity_id") == "input_select.main_bathroom"]
    assert night_mode[0]["state"] == "Bedtime"
