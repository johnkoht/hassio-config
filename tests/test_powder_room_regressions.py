"""
Regression tests for the powder room occupancy automations.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
LIGHT = "light.powder_room_main_lights"


def automation(rel_path):
    return yaml.safe_load((REPO / rel_path).read_text())["automation"][0]


def walk_conditions(conditions):
    """Yield every condition, descending into nested and/or/not blocks."""
    for c in conditions:
        yield c
        yield from walk_conditions(c.get("conditions", []))


def test_not_occupied_light_conditions_check_off():
    """Triggered by the light turning off, so an 'on' check can never pass (stuck since 09-30)."""
    auto = automation("packages/powder_room/modes/powder_room_not_occupied.yaml")
    light = [c for c in walk_conditions(auto["conditions"])
             if c.get("condition") == "state" and c.get("entity_id") == LIGHT]
    assert len(light) == 2
    for c in light:
        assert c.get("state") == "off", c


def test_lights_off_when_room_empties():
    """Decision 8: the light turns off when occupancy clears, not only when the room is Off."""
    auto = automation("packages/powder_room/lights/powder_room_lights_off.yaml")
    assert any(t.get("trigger") == "state" and t.get("entity_id") == "input_boolean.powder_room_occupied"
               and t.get("to") == "off" for t in auto["triggers"])
    gates = {(c.get("entity_id"), c.get("state")) for c in walk_conditions(auto["conditions"])}
    assert ("input_boolean.powder_room_occupied", "off") in gates
    assert ("input_select.powder_room", "Off") in gates
