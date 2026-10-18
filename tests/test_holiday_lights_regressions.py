"""
Regression tests for the holiday front yard plugs after the ZWA-2 migration.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
HALLOWEEN = REPO / "packages/holidays/halloween"

INFLATABLE_PLUGS = [
    "switch.front_door_smart_plug",
    "switch.front_door_smart_plug_2",
    "switch.front_left_smart_plug",
    "switch.front_left_smart_plug_2",
]
# Always-on power for the Hue spots; the lights themselves are automated.
HUE_POWER_PLUGS = [
    "switch.front_yard_outdoor_front_left_hue_lights",
    "switch.front_yard_outdoor_front_left_hue_lights_2",
]


def automations(path):
    return {a["id"]: a for a in yaml.safe_load(path.read_text())["automation"]}


def test_no_pre_migration_plug_ids():
    """Re-inclusion on the ZWA-2 dropped the _1 suffix; a dead ID blocks state conditions."""
    for path in (REPO / "packages/holidays").rglob("*.yaml"):
        assert "switch.front_door_smart_plug_1" not in path.read_text(), path


GROUP = "switch.front_yard_holiday_decorations"


def test_decorations_group_is_the_four_plugs():
    content = yaml.safe_load((REPO / "packages/holidays/front_yard_holiday_decorations.yaml").read_text())
    (group,) = content["switch"]
    assert sorted(group["entities"]) == sorted(INFLATABLE_PLUGS)


def test_plug_ids_only_live_in_the_group():
    """One place to fix the next rename; the Hue power plugs stay out of holiday files."""
    for path in (REPO / "packages/holidays").rglob("*.yaml"):
        text = path.read_text()
        for plug in HUE_POWER_PLUGS:
            assert plug not in text, path
        if path.name != "front_yard_holiday_decorations.yaml":
            for plug in INFLATABLE_PLUGS:
                assert f"{plug}\n" not in text and f"{plug} " not in text, (path, plug)


def test_christmas_uses_the_group():
    content = yaml.safe_load((REPO / "packages/holidays/christmas/lights/christmas_lights_group.yaml").read_text())
    christmas = next(g for g in content["switch"] if g["unique_id"] == "christmas_lights")
    assert GROUP in christmas["entities"]


@pytest.mark.parametrize("auto_id", ["halloween_lights_turn_on", "halloween_lights_turn_off"])
def test_halloween_lights_target_the_group(auto_id):
    auto = automations(HALLOWEEN / "halloween_lights.yaml")[auto_id]
    (action,) = auto["actions"]
    assert action["target"]["entity_id"] == GROUP


def test_halloween_hue_scene_only_when_accent_lights_on():
    """A Hue scene turns lights on, so it must not fire in daylight when the season starts."""
    auto = automations(HALLOWEEN / "halloween_hue_scene.yaml")["halloween_hue_scene"]
    gated = {(c["entity_id"], c["state"]) for c in auto["conditions"] if c["condition"] == "state"}
    assert ("input_boolean.halloween_season_active", "on") in gated
    assert ("input_boolean.exterior_accent_lights", "on") in gated
    assert auto["actions"][-1]["target"]["entity_id"] == "scene.halloween_front_yard_spots"


def test_halloween_scene_only_drives_hue_spots():
    """The scene must never touch the Hue power plugs; they stay on."""
    scene = yaml.safe_load((REPO / "scenes/holidays/halloween_front_yard_spots.yaml").read_text())
    assert scene["id"] == "halloween_front_yard_spots"
    assert all(e.startswith("light.") for e in scene["entities"])


def _startup_gate(auto):
    """The or-condition that lets non-startup triggers through and gates the startup one."""
    (gate,) = [c for c in auto["conditions"] if c["condition"] == "or"]
    first = gate["conditions"][0]
    assert first == {"condition": "not", "conditions": [{"condition": "trigger", "id": "startup"}]}
    return gate["conditions"][1:]


def test_halloween_restart_respects_time_of_day():
    """A daytime restart turned the decorations off (2026-10-17); a restart must re-apply, not toggle."""
    autos = automations(HALLOWEEN / "halloween_lights.yaml")
    for auto in autos.values():
        start = [t for t in auto["triggers"] if t["trigger"] == "homeassistant"]
        assert start and all(t.get("id") == "startup" for t in start)

    off = _startup_gate(autos["halloween_lights_turn_off"])
    assert {"condition": "time", "after": "22:00:00", "before": "08:00:00"} in off
    assert {"condition": "state", "entity_id": "input_boolean.bedtime", "state": "on"} in off

    (on,) = _startup_gate(autos["halloween_lights_turn_on"])
    assert {"condition": "time", "after": "08:00:00", "before": "22:00:00"} in on["conditions"]
    assert {"condition": "state", "entity_id": "input_boolean.bedtime", "state": "off"} in on["conditions"]
