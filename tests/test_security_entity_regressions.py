"""
Regression tests for security automations that watched nonexistent entities.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
PORCH = "packages/security/cameras/detections/backyard_porch_camera/"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel_path):
    return yaml.load((REPO / rel_path).read_text(), Loader=_Loader)


def test_door_left_open_watches_live_front_door():
    """front_door_status doesn't exist, so only the garage door could alert."""
    path = "packages/security/doors_left_open.yaml"
    auto = load(path)["automation"][0]
    state_triggers = [t for t in auto["triggers"] if t["trigger"] == "state"]
    assert state_triggers
    for trig in state_triggers:
        assert "binary_sensor.front_door" in trig["entity_id"]
    assert "front_door_status" not in (REPO / path).read_text()


def _porch_trigger(kind):
    auto = load(f"{PORCH}backyard_porch_camera_detections_{kind}.yaml")["automation"][0]
    return auto["triggers"][0]["entity_id"]


def test_porch_person_trigger_uses_live_entity():
    assert _porch_trigger("person") == "binary_sensor.backyard_porch_person_detected"


def test_porch_animal_trigger_uses_live_entity():
    assert _porch_trigger("animal") == "binary_sensor.backyard_porch_animal_detected"
