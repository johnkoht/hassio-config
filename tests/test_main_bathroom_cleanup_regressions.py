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
