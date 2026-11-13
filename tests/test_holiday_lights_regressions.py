"""
Regression tests for the holiday front yard plugs after the ZWA-2 migration.

Reads repo files relative to this test, so it runs on a dev machine.
"""
import re
from datetime import datetime
from pathlib import Path

import jinja2
import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
HALLOWEEN = REPO / "packages/holidays/halloween"
HOLIDAYS = REPO / "packages/holidays"
CHRISTMAS = HOLIDAYS / "christmas"
SEASON = "input_boolean.christmas_season_active"

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


def test_christmas_master_group_excludes_front_yard():
    content = yaml.safe_load((CHRISTMAS / "lights/christmas_lights_group.yaml").read_text())
    christmas = next(g for g in content["switch"] if g["unique_id"] == "christmas_lights")
    assert sorted(christmas["entities"]) == ["switch.christmas_playroom_lights", "switch.christmas_trees"]


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


# ---------------------------------------------------------------------------
# Christmas package rewrite (JK-1229)
# ---------------------------------------------------------------------------

FRONT_YARD = "switch.front_yard_holiday_decorations"


def _christmas_auto_files():
    return sorted(p for p in CHRISTMAS.rglob("*.yaml") if "santa" not in p.parts and "automation" in yaml.safe_load(p.read_text()))


def _auto(rel):
    (auto,) = yaml.safe_load((CHRISTMAS / rel).read_text())["automation"]
    return auto


def _targets(action):
    ents = action["target"]["entity_id"]
    return ents if isinstance(ents, list) else [ents]


def _state_conds(auto):
    return {(c["entity_id"], c["state"]) for c in auto.get("conditions", []) if c.get("condition") == "state"}


def test_christmas_lights_automations_target_front_yard():
    for rel in ("lights/turn_on_christmas_lights.yaml", "lights/turn_off_christmas_lights.yaml"):
        (action,) = _auto(rel)["actions"]
        assert "switch.christmas_lights" in _targets(action)
        assert FRONT_YARD in _targets(action)
    safety = [a for a in _auto("modes/christmas_not_activated.yaml")["actions"] if a.get("action") == "switch.turn_off"]
    (safety,) = safety
    assert sorted(_targets(safety)) == sorted(
        ["switch.christmas_lights", "switch.christmas_trees", "switch.christmas_playroom_lights", FRONT_YARD]
    )
    light_off = [a for a in _auto("modes/christmas_not_activated.yaml")["actions"] if a.get("action") == "light.turn_off"]
    assert [_targets(a) for a in light_off] == [["light.christmas_lights"]]


def test_christmas_not_activated_safety_off_is_unconditional():
    auto = _auto("modes/christmas_not_activated.yaml")
    assert not any(a for a in auto["actions"] if "if" in a or "choose" in a)


def test_no_initial_state_in_holidays():
    for path in HOLIDAYS.rglob("*.yaml"):
        assert "initial_state" not in path.read_text(), path


def _render(rel, day):
    auto = _auto(rel)
    (tpl,) = [c["value_template"] for c in auto["conditions"] if c["condition"] == "template"]
    return jinja2.Template(tpl).render(now=lambda: day).strip() == "True"


DATES = [datetime(2026, m, 15) for m in range(1, 13)] + [
    datetime(2026, 12, 1), datetime(2026, 12, 31), datetime(2027, 1, 1), datetime(2027, 1, 7), datetime(2027, 1, 8),
]


@pytest.mark.parametrize("day", DATES, ids=lambda d: d.strftime("%b-%d"))
def test_christmas_season_windows(day):
    in_season = day.month == 12 or (day.month == 1 and day.day <= 7)
    assert _render("christmas_enabled.yaml", day) is in_season
    assert _render("christmas_disabled.yaml", day) is (not in_season)


def test_christmas_season_gating():
    for rel in ("modes/christmas_activated.yaml", "lights/turn_on_christmas_lights.yaml"):
        assert (SEASON, "on") in _state_conds(_auto(rel)), rel
    for rel in ("lights/turn_off_christmas_lights.yaml", "modes/christmas_not_activated.yaml"):
        assert SEASON not in {e for e, _ in _state_conds(_auto(rel))}, rel
    # house -> season -> feature order
    conds = _auto("modes/christmas_activated.yaml")["conditions"]
    assert [c["entity_id"] for c in conds[:2]] == ["input_boolean.house_occupied", SEASON]


def test_christmas_season_triggers_and_handover():
    activated = _auto("modes/christmas_activated.yaml")
    assert {"trigger": "state", "entity_id": SEASON, "to": "on"} in activated["triggers"]
    ended = _auto("christmas_season_ended.yaml")
    assert {"trigger": "homeassistant", "event": "start", "id": "startup"} in ended["triggers"]
    assert (SEASON, "off") in _state_conds(ended)
    assert ("input_boolean.christmas_active", "on") in _state_conds(ended)
    started = _auto("christmas_season_started.yaml")
    (action,) = started["actions"]
    assert action["action"] == "input_boolean.turn_off"
    assert _targets(action) == ["input_boolean.halloween_season_active"]
    assert {"trigger": "state", "entity_id": SEASON, "to": "on"} in started["triggers"]


@pytest.mark.parametrize("rel", ["christmas_enabled.yaml", "christmas_disabled.yaml"])
def test_christmas_enable_disable_are_date_only(rel):
    data = yaml.safe_load((CHRISTMAS / rel).read_text())
    assert "script" not in data
    auto = _auto(rel)
    assert {"trigger": "homeassistant", "event": "start", "id": "startup"} in auto["triggers"]
    assert {"trigger": "time", "at": "02:00:00"} in auto["triggers"]
    (action,) = auto["actions"]
    assert _targets(action) == [SEASON]


def test_no_automation_toggling_or_christmas_scripts():
    for path in HOLIDAYS.rglob("*.yaml"):
        text = path.read_text()
        assert "automation.turn_on" not in text and "automation.turn_off" not in text, path
        assert "script.christmas_" not in text, path
        assert "tradfri_smart_plug" not in text, path
        assert "device_id:" not in text, path


def test_no_misspelled_christmas_outside_plans():
    for path in REPO.rglob("*"):
        rel = path.relative_to(REPO)
        if (
            not path.is_file()
            or rel.parts[0] in {".git", "plans", "memory", ".claude", "node_modules", ".venv", "venv"}
            or path == Path(__file__)
            or path.suffix in {".pyc", ".png", ".jpg", ".db", ".gz", ".zip"}
        ):
            continue
        try:
            text = path.read_text()
        except (UnicodeDecodeError, OSError):
            continue
        assert "Christman" not in text, rel


def test_christmas_automation_files_are_one_per_file_and_named_by_id():
    files = _christmas_auto_files()
    assert files
    for path in files:
        autos = yaml.safe_load(path.read_text())["automation"]
        assert len(autos) == 1, path
        assert autos[0]["id"] == path.stem, path


def test_surviving_christmas_ids_and_aliases_are_pinned():
    pinned = {
        "christmas_enabled.yaml": ("christmas_enabled", "Christmas Enabled"),
        "christmas_disabled.yaml": ("christmas_disabled", "Christmas Disabled"),
        "modes/christmas_activated.yaml": ("christmas_activated", "Christmas Activated"),
        "modes/christmas_not_activated.yaml": ("christmas_not_activated", "Christmas NOT Activated"),
        "lights/turn_on_christmas_lights.yaml": ("turn_on_christmas_lights", "Turn ON Christmas Lights"),
        "lights/turn_off_christmas_lights.yaml": ("turn_off_christmas_lights", "Turn OFF Christmas Lights"),
        "christmas_season_started.yaml": ("christmas_season_started", "Christmas Season Started"),
        "christmas_season_ended.yaml": ("christmas_season_ended", "Christmas Season Ended"),
    }
    for rel, (auto_id, alias) in pinned.items():
        auto = _auto(rel)
        assert (auto["id"], auto["alias"]) == (auto_id, alias), rel


def test_christmas_files_use_target_syntax():
    """Same regex as test_modern_syntax.test_target_syntax_for_entities, but enforced here."""
    pattern = re.compile(r"^\s*(action|service):\s*[a-z_]+\.[a-z_]+\s*\n\s*entity_id:", re.MULTILINE)
    for path in CHRISTMAS.rglob("*.yaml"):
        if "santa" in path.parts:
            continue
        assert not pattern.search(path.read_text()), path


def test_holiday_yaml_basenames_are_unique_across_packages():
    """!include_dir_named keys by basename; a duplicate silently drops a file."""
    seen = {}
    for path in (REPO / "packages").rglob("*.yaml"):
        seen.setdefault(path.name, []).append(path)
    for path in HOLIDAYS.rglob("*.yaml"):
        assert len(seen[path.name]) == 1, seen[path.name]


def test_outdoor_lighting_has_no_commented_holiday_block():
    text = (REPO / "packages/outdoor_lighting.yaml").read_text()
    assert "turn_on_holiday_lights" not in text and "turn_off_holiday_lights" not in text
