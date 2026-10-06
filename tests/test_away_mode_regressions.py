"""
Regression tests for away-mode / kids' bedroom fixes.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def automation(rel_path):
    content = yaml.load((REPO / rel_path).read_text(), Loader=_Loader)
    return content["automation"][0]


def state_triggers(auto, entity_id):
    return [t for t in auto["triggers"]
            if t.get("trigger") == "state" and t.get("entity_id") == entity_id]


def has_state_condition(auto, entity_id, state):
    return any(c.get("condition") == "state" and c.get("entity_id") == entity_id
               and c.get("state") == state for c in auto["conditions"])


def test_house_not_occupied_is_debounced():
    """A group reload briefly flips group.all_people; it must not mark the house empty."""
    auto = automation("packages/house/occupancy/house_not_occupied.yaml")
    (trigger,) = state_triggers(auto, "group.all_people")
    assert trigger.get("for"), "group.all_people trigger needs a for: debounce"


@pytest.mark.parametrize("path,kid", [
    ("packages/ninos_room/modes/ninos_bedroom_mode_bedtime.yaml", "nino"),
    ("packages/gianluca_room/modes/gianlucas_room_mode_bedtime.yaml", "gianluca"),
])
def test_kids_bedtime_restores_after_away(path, kid):
    """Away forces the room Off; returning with the kid in bed must restore Bedtime."""
    auto = automation(path)
    assert any(t.get("to") == "on" for t in state_triggers(auto, "input_boolean.house_occupied"))
    assert any(t.get("to") == "Auto" for t in state_triggers(auto, "input_select.house"))
    assert has_state_condition(auto, f"input_boolean.{kid}_in_bed", "on")


def test_gianluca_auto_trigger_matches_condition():
    """The occupied trigger must be satisfiable by the 'room not occupied' condition."""
    auto = automation("packages/gianluca_room/modes/gianlucas_room_mode_auto.yaml")
    for trigger in state_triggers(auto, "input_boolean.gianlucas_room_occupied"):
        assert trigger.get("to") == "off"
    assert has_state_condition(auto, "input_boolean.gianlucas_room_occupied", "off")


def test_vacation_bedtime_requires_vacation_mode():
    """The 22:00 bedtime-on must not fire for an ordinary evening out."""
    content = yaml.load((REPO / "packages/house/bedtime_mode/bedtime_mode_vacation.yaml").read_text(),
                        Loader=_Loader)
    auto = next(a for a in content["automation"] if a["id"] == "bedtime_mode_vacation_on")
    assert has_state_condition(auto, "input_boolean.vacation_mode", "on")
