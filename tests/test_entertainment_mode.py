"""
Regression tests for the entertainment mode refactor (JK-1166).

Phase 1: each room reacts to input_boolean.entertainment_mode itself, the
automations that would undo the mode check it as a condition, and nothing is
armed at runtime (JK-1262). Static only.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
PKG = REPO / "packages"
ENT_DIR = PKG / "house" / "entertainment"
ENT = "input_boolean.entertainment_mode"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def auto(path):
    return load(path)["automation"][0]


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def targets(a):
    """Every (action, entity) pair in an automation's actions."""
    out = []
    for s in walk(a["actions"]):
        act = s.get("action")
        if not act:
            continue
        ent = (s.get("target") or {}).get("entity_id", s.get("entity_id"))
        for e in ent if isinstance(ent, list) else [ent]:
            out.append((act, e))
    return out


# room key -> (dir, adaptive lighting suffix, speech boolean or None)
ROOMS = {
    "kitchen": ("kitchen/modes", "kitchen", "input_boolean.kitchen_speech_notifications"),
    "family_room": ("family_room/modes", "family_room", "input_boolean.family_room_speech_notifications"),
    "playroom": ("playroom/modes", "playroom", None),
    "foyer": ("foyer/modes", "foyer", None),
    "office": ("office/modes", "office", None),
    "main_bedroom": ("main_bedroom/mode", "main_bedroom", None),
}


def room_auto(room, which):
    d = ROOMS[room][0]
    return auto(PKG / d / f"{room}_entertainment_mode_{which}.yaml")


# ---- the helper and the removed central automations -------------------------
def test_boolean_has_no_initial():
    cfg = load(ENT_DIR / "entertainment_mode.yaml")["input_boolean"]["entertainment_mode"]
    assert "initial" not in cfg


def test_central_automations_are_gone():
    assert not (ENT_DIR / "entertainment_mode_activated.yaml").exists()
    assert not (ENT_DIR / "entertainment_mode_deactivated.yaml").exists()


def test_no_entertainment_file_arms_automations_or_reads_a_stale_flag():
    files = list(ENT_DIR.glob("*.yaml"))
    for room, (d, _, _) in ROOMS.items():
        files += [PKG / d / f"{room}_entertainment_mode_{w}.yaml" for w in ("on", "off")]
    assert len(files) >= 16
    for f in files:
        text = f.read_text()
        assert "automation.turn_on" not in text and "automation.turn_off" not in text, f.name
        assert "automation.toggle" not in text, f.name
        # initial_state is allowed only on automations nothing toggles; none is armed here
        for a in load(f).get("automation", []):
            assert a["id"] == f.stem, f.name


# ---- per-room pairs ---------------------------------------------------------
@pytest.mark.parametrize("room", ROOMS)
def test_room_on_pauses_adaptive_lighting(room):
    a = room_auto(room, "on")
    t = a["triggers"][0]
    assert (t["trigger"], t["entity_id"], t["from"], t["to"]) == ("state", ENT, "off", "on")
    assert ("switch.turn_off", f"switch.adaptive_lighting_{ROOMS[room][1]}") in targets(a)
    assert a["conditions"][0] == {"condition": "state", "entity_id": "input_boolean.house_occupied", "state": "on"}


@pytest.mark.parametrize("room", ROOMS)
def test_room_off_resumes_adaptive_lighting_with_no_house_gate(room):
    a = room_auto(room, "off")
    t = a["triggers"][0]
    assert (t["trigger"], t["entity_id"], t["from"], t["to"]) == ("state", ENT, "on", "off")
    assert ("switch.turn_on", f"switch.adaptive_lighting_{ROOMS[room][1]}") in targets(a)
    # the house emptying ends the mode, so the resume must run with nobody home
    assert "conditions" not in a


@pytest.mark.parametrize("room", [r for r in ROOMS if ROOMS[r][2]])
def test_room_speech_switch_pauses_and_resumes_only_when_in_use(room):
    sw = ROOMS[room][2]
    assert ("input_boolean.turn_off", sw) in targets(room_auto(room, "on"))
    off = room_auto(room, "off")
    iff = next(s for s in walk(off["actions"]) if "if" in s)
    conds = iff["if"]
    assert any(c.get("entity_id") == f"input_boolean.{room}_occupied" and c["state"] == "on" for c in conds)
    assert any(c["condition"] in ("or", "state") and f"input_select.{room}" in str(c) for c in conds)
    assert ("input_boolean.turn_on", sw) in [(s["action"], s["target"]["entity_id"]) for s in walk(iff["then"]) if "action" in s]


@pytest.mark.parametrize("room", [r for r in ROOMS if not ROOMS[r][2]])
def test_rooms_without_a_speech_switch_touch_no_speech_boolean(room):
    for w in ("on", "off"):
        assert not [e for _, e in targets(room_auto(room, w)) if "speech" in str(e)]


def test_kitchen_resume_matches_the_speech_on_automation():
    on = auto(PKG / "kitchen/media/kitchen_speech_notifications_on.yaml")
    modes = next(c for c in on["conditions"] if c.get("condition") == "or")
    want = {c["state"] for c in modes["conditions"]}
    off = room_auto("kitchen", "off")
    iff = next(s for s in walk(off["actions"]) if "if" in s)
    got = {c["state"] for c in next(c for c in iff["if"] if c["condition"] == "or")["conditions"]}
    assert want == got == {"Auto", "Dim"}


def test_dining_room_has_no_entertainment_pause():
    # nothing to pause, so only an on-file (lights) and never an off-file
    found = sorted(p.name for p in (PKG / "dining_room").rglob("*entertainment*"))
    assert found == ["dining_room_entertainment_mode_on.yaml"]


# ---- the lights ---------------------------------------------------------------
ON_LIGHTS = {
    "foyer": ["light.foyer_lights"],
    "kitchen": ["light.kitchen_lights", "light.kitchen_led"],
    "family_room": ["light.family_room_main_lights"],
}


def turn_ons(a):
    return [s for s in walk(a["actions"]) if s.get("action") == "light.turn_on"]


def action_order(a):
    return [s["action"] for s in a["actions"]]


@pytest.mark.parametrize("room", ON_LIGHTS)
def test_room_on_turns_on_its_lights_after_the_adaptive_lighting_pause(room):
    a = room_auto(room, "on")
    ons = turn_ons(a)
    assert len(ons) == 1
    ent = ons[0]["target"]["entity_id"]
    assert (ent if isinstance(ent, list) else [ent]) == ON_LIGHTS[room]
    assert ons[0]["data"] == {"brightness_pct": 100}
    order = action_order(a)
    assert order.index("switch.turn_off") < order.index("light.turn_on")
    # no lux gate, and the house-occupied gate is the only condition
    assert a["conditions"] == [{"condition": "state", "entity_id": "input_boolean.house_occupied", "state": "on"}]


def test_dining_room_on_file():
    f = PKG / "dining_room/modes/dining_room_entertainment_mode_on.yaml"
    a = auto(f)
    assert a["id"] == f.stem == "dining_room_entertainment_mode_on"
    assert a["alias"] == "Dining Room - Entertainment Mode On"
    assert a["initial_state"] in (True, "on")
    t = a["triggers"][0]
    assert (t["trigger"], t["entity_id"], t["from"], t["to"]) == ("state", ENT, "off", "on")
    assert a["conditions"] == [{"condition": "state", "entity_id": "input_boolean.house_occupied", "state": "on"}]
    ons = turn_ons(a)
    assert len(ons) == 1 and ons[0]["target"]["entity_id"] == "light.dining_room_lights"
    assert ons[0]["data"] == {"brightness_pct": 100}
    assert [x for x in action_order(a)] == ["light.turn_on"]


# ---- hold while on, hand back on off ----------------------------------------
OFF_AUTOS = [
    "foyer/lights/foyer_lights_to_off.yaml",
    "foyer/lights/foyer_lights_day_off.yaml",
    "foyer/lights/foyer_lights_nightlight_off.yaml",
    "kitchen/lights/kitchen_lights_to_off.yaml",
    "kitchen/lights/kitchen_lights_day_off.yaml",
    "family_room/lights/family_room_lights_to_off.yaml",
    "dining_room/lights/dining_room_lights_off.yaml",
]
MODE_OFF_COND = {"condition": "state", "entity_id": ENT, "state": "off"}


def mode_off_triggers(a):
    return [t for t in a["triggers"] if t.get("entity_id") == ENT]


@pytest.mark.parametrize("rel", OFF_AUTOS)
def test_off_automation_has_the_mode_off_trigger(rel):
    ts = mode_off_triggers(auto(PKG / rel))
    assert len(ts) == 1
    assert (ts[0]["trigger"], ts[0]["from"], ts[0]["to"]) == ("state", "on", "off")


@pytest.mark.parametrize("rel", [r for r in OFF_AUTOS if "foyer_lights_to_off" not in r])
def test_off_automation_holds_while_the_mode_is_on(rel):
    assert MODE_OFF_COND in auto(PKG / rel)["conditions"]


@pytest.mark.parametrize("rel", OFF_AUTOS)
def test_off_automations_add_no_turn_off_for_the_mode(rel):
    # the hand-back is the existing conditions deciding, never a direct turn_off
    assert ENT not in str([s for s in walk(auto(PKG / rel)["actions"])])


def test_foyer_to_off_holds_the_off_path_but_not_away():
    a = auto(PKG / "foyer/lights/foyer_lights_to_off.yaml")
    assert MODE_OFF_COND not in a["conditions"]
    hold = next(c for c in a["conditions"]
                if c.get("condition") == "or" and MODE_OFF_COND in c["conditions"])
    away = {"condition": "state", "entity_id": "input_select.foyer", "state": "Away"}
    assert away in hold["conditions"]
    # Away is still a trigger, and still an accepted state
    assert any(t.get("entity_id") == "input_select.foyer" and t["to"] == "Away" for t in a["triggers"])


def test_kitchen_to_off_mode_end_defers_to_the_vacancy_branch():
    a = auto(PKG / "kitchen/lights/kitchen_lights_to_off.yaml")
    t = mode_off_triggers(a)[0]
    assert t["id"] not in ("room_off",)
    # the room_off branch is gated by trigger id, so mode end can only pass via vacancy
    branch = next(c for c in a["conditions"] if c.get("condition") == "or")
    assert {"condition": "trigger", "id": "room_off"} in branch["conditions"]
    assert {"condition": "state", "entity_id": "input_boolean.kitchen_occupied", "state": "off"} in \
        next(c for c in branch["conditions"] if c["condition"] == "and")["conditions"]


def test_foyer_nightlight_off_cannot_fire_at_night_on_mode_end():
    # the sun condition stays true all evening, so mode end also needs dark_outside off
    a = auto(PKG / "foyer/lights/foyer_lights_nightlight_off.yaml")
    t = mode_off_triggers(a)[0]
    gate = next(c for c in a["conditions"]
                if c.get("condition") == "or" and any(x.get("condition") == "not" for x in c["conditions"]))
    assert {"condition": "trigger", "id": t["id"]} in gate["conditions"][0]["conditions"]
    assert {"condition": "state", "entity_id": "input_boolean.dark_outside", "state": "off"} in gate["conditions"]


def test_foyer_day_off_mode_end_needs_good_weather():
    a = auto(PKG / "foyer/lights/foyer_lights_day_off.yaml")
    t = mode_off_triggers(a)[0]
    gate = next(c for c in a["conditions"]
                if c.get("condition") == "or" and any(x.get("condition") == "not" for x in c["conditions"]))
    assert {"condition": "trigger", "id": t["id"]} in gate["conditions"][0]["conditions"]
    assert {"condition": "state", "entity_id": "input_boolean.bad_weather", "state": "off"} in gate["conditions"]


def test_every_to_away_file_ignores_the_mode():
    files = list(PKG.rglob("*_to_away.yaml"))
    assert {f.name for f in files} >= {"kitchen_lights_to_away.yaml", "family_room_lights_to_away.yaml"}
    for f in files:
        assert "entertainment" not in f.read_text(), f.name


# ---- house-level pieces -----------------------------------------------------
def test_house_empty_off_waits_two_minutes_and_needs_the_mode_on():
    a = auto(ENT_DIR / "entertainment_mode_house_empty_off.yaml")
    t = a["triggers"][0]
    assert t["entity_id"] == "input_boolean.house_occupied" and t["to"] == "off"
    assert t["for"] == {"minutes": 2}
    assert a["conditions"] == [{"condition": "state", "entity_id": ENT, "state": "on"}]
    assert targets(a) == [("input_boolean.turn_off", ENT)]


def test_bedtime_off_turns_the_mode_off():
    a = auto(ENT_DIR / "entertainment_mode_bedtime_off.yaml")
    assert a["triggers"][0]["entity_id"] == "input_boolean.bedtime" and a["triggers"][0]["to"] == "on"
    assert a["conditions"] == [{"condition": "state", "entity_id": ENT, "state": "on"}]
    assert targets(a) == [("input_boolean.turn_off", ENT)]


def test_master_speech_pause_and_resume():
    p = auto(ENT_DIR / "entertainment_mode_speech_pause.yaml")
    r = auto(ENT_DIR / "entertainment_mode_speech_resume.yaml")
    assert targets(p) == [("input_boolean.turn_off", "input_boolean.speech_notifications")]
    assert targets(r) == [("input_boolean.turn_on", "input_boolean.speech_notifications")]
    assert p["triggers"][0]["to"] == "on" and r["triggers"][0]["to"] == "off"
    assert "conditions" not in r


# ---- the automations that would undo the mode -------------------------------
GATED = [
    "kitchen/media/kitchen_music_off.yaml",
    "family_room/media/family_room_music_off.yaml",
    "family_room/media/family_room_tv_off.yaml",
    "playroom/media/playroom_music_off.yaml",
    "playroom/media/playroom_media_player_unjoin.yaml",
    "kitchen/media/kitchen_speech_notifications_on.yaml",
    "family_room/media/family_room_speech_notifications_on.yaml",
    "house/modes/house_mode_speech_on.yaml",
]


@pytest.mark.parametrize("rel", GATED)
def test_gated_automation_checks_the_mode_first(rel):
    a = auto(PKG / rel)
    assert a["conditions"][0] == {"condition": "state", "entity_id": ENT, "state": "off"}


def test_tv_is_never_turned_on_by_the_mode():
    for f in list(ENT_DIR.glob("*.yaml")) + list((PKG / "family_room").rglob("*entertainment*")):
        # the TV is a separate device: no entertainment file reads, groups, calls or toggles it
        assert "sony_bravia_tv" not in f.read_text(), f.name


def test_speech_off_automations_stay_ungated():
    # turning a room's switch off when the room empties is fine during the mode
    for rel in ("kitchen/media/kitchen_speech_notifications_off.yaml",
                "family_room/media/familyi_room_speech_notifications_off.yaml"):
        assert "conditions" not in auto(PKG / rel)
