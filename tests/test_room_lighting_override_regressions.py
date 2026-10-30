"""
Regression tests for the room manual-override kit (JK-1145).

Per room: a hand-only `<room>_lighting_automations`, a `<room>_lights_manually_toggled`
latch set by any manual change, and one reset automation that always clears it.
Static YAML checks plus a real-jinja render of the manual-change conditions.
"""
import re
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent

# Later PRs append rooms here.
MIGRATED_ROOMS = ["main_bedroom", "kitchen", "garage", "playroom", "upstairs_hallway", "office",
                  "main_bathroom", "laundry_room"]

HOUSE_FLAG = "input_boolean.lighting_automations"
TURN_SERVICES = {"input_boolean.turn_on", "input_boolean.turn_off", "input_boolean.toggle"}


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load_yaml(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def _automation_files():
    files = []
    for d in ("packages", "automation", "scripts"):
        files += sorted((REPO / d).rglob("*.yaml"))
    files += [REPO / "automations.yaml", REPO / "scripts.yaml"]
    return [f for f in files if f.exists()]


def load_all():
    """Every automation and script in the repo: id -> (path, dict). Scripts key as 'script.<name>'."""
    found = {}
    for f in _automation_files():
        doc = load_yaml(f)
        items = []
        if isinstance(doc, list):
            items = [("a", a) for a in doc]
        elif isinstance(doc, dict):
            for key in ("automation", "automation mine"):
                v = doc.get(key)
                if isinstance(v, list):
                    items += [("a", a) for a in v]
            v = doc.get("script")
            if isinstance(v, dict):
                items += [("s", (k, s)) for k, s in v.items()]
            if f.name == "scripts.yaml" or f.parent.name == "scripts":
                # scripts.yaml / scripts/ dir: top-level mapping of name -> script
                items += [("s", (k, s)) for k, s in doc.items()
                          if k != "script" and isinstance(s, dict) and "sequence" in s]
        for kind, it in items:
            if kind == "a" and isinstance(it, dict) and it.get("id"):
                found[it["id"]] = (f, it)
            elif kind == "s" and isinstance(it[1], dict):
                found[f"script.{it[0]}"] = (f, it[1])
    return found


ALL = load_all()


def auto(auto_id):
    assert auto_id in ALL, f"automation {auto_id} not found"
    return ALL[auto_id][1]


def walk(node):
    """Yield every dict nested anywhere in node."""
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def as_list(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


def action_entities(step):
    """Entity ids addressed by an action step (root, target, or data)."""
    ents = list(as_list(step.get("entity_id")))
    for key in ("target", "data"):
        if isinstance(step.get(key), dict):
            ents += as_list(step[key].get("entity_id"))
    return ents


def action_body(a):
    return a.get("actions", a.get("action", a.get("sequence", [])))


def turn_calls(node):
    """(service, entity_id, step) for every input_boolean turn_on/off/toggle under node."""
    for step in walk(node):
        if step.get("action") in TURN_SERVICES:
            for e in action_entities(step):
                yield step["action"], e, step


def conds_for(a):
    return as_list(a.get("conditions"))


def state_cond(c, entity, state):
    return (c.get("condition") == "state" and entity in as_list(c.get("entity_id"))
            and state in [str(s) for s in as_list(c.get("state"))])


def cond_index(conds, entity, state):
    for i, c in enumerate(conds):
        if isinstance(c, dict) and state_cond(c, entity, state):
            return i
    return None


# Rooms whose package directory is not named after the room (laundry_room lives in packages/laundry).
PACKAGE_DIR = {"laundry_room": "laundry", "ninos_bedroom": "ninos_room",
               "gianlucas_room": "gianluca_room"}


def room_files(room):
    return sorted((REPO / "packages" / PACKAGE_DIR.get(room, room)).rglob("*.yaml"))


def flag(room):
    return f"input_boolean.{room}_lighting_automations"


def latch(room):
    return f"input_boolean.{room}_lights_manually_toggled"


def helper_def(room, name):
    for f in room_files(room):
        doc = load_yaml(f)
        if isinstance(doc, dict) and isinstance(doc.get("input_boolean"), dict):
            if name in doc["input_boolean"]:
                return doc["input_boolean"][name] or {}
    pytest.fail(f"input_boolean.{name} not defined under packages/{room}/")


# 1 ---------------------------------------------------------------------------
@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_flag_has_no_initial_and_latch_initial_off(room):
    """The hand flag must survive restarts (no initial); the latch starts off."""
    assert "initial" not in helper_def(room, f"{room}_lighting_automations")
    assert helper_def(room, f"{room}_lights_manually_toggled").get("initial") in (False, "off")


# 2 ---------------------------------------------------------------------------
@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_nothing_writes_the_hand_flag(room):
    """No automation or script anywhere may turn_on/off/toggle the hand-only room flag."""
    offenders = []
    for aid, (path, item) in ALL.items():
        for svc, ent, _ in turn_calls(action_body(item)):
            if ent == flag(room):
                offenders.append(f"{aid} ({path.relative_to(REPO)}): {svc}")
    assert not offenders, offenders


# 3 ---------------------------------------------------------------------------
@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_reset_automation_shape(room):
    """Reset triggers on vacancy (debounced), room Off and house empty, with nothing that can block it."""
    a = auto(f"{room}_lights_reset_manual_toggle")
    trig = as_list(a["triggers"])

    def has(entity, to, need_for=False):
        return any(t.get("trigger") == "state" and t.get("entity_id") == entity
                   and t.get("to") == to and (t.get("for") or not need_for) for t in trig)

    assert has(f"input_boolean.{room}_occupied", "off", need_for=True)
    assert has(f"input_select.{room}", "Off")
    assert has("input_boolean.house_occupied", "off")
    assert not a.get("conditions")
    steps = list(walk(a["actions"]))
    assert any(latch(room) in action_entities(s) for s in steps if s.get("action"))
    for s in steps:
        if s.get("action"):
            assert "entity_id" not in s, f"root-level entity_id in {s}"
            assert "target" in s


# 4 ---------------------------------------------------------------------------
def _manual(room):
    return auto(f"{room}_lights_manual_change")


MAIN_LIGHT = {"main_bedroom": "light.main_bedroom_main_lights",
              "kitchen": "light.kitchen_ceiling_lights",
              "garage": "light.garage_lights",
              "playroom": "light.playroom_lights",
              "upstairs_hallway": "light.upstairs_hallway",
              # The wall switch (what the old detection watched); the bulbs are in EXTRA_LIGHTS.
              "office": "light.office_light_switch",
              "main_bathroom": "light.main_bathroom_main_lights",
              "laundry_room": "light.laundry_room_main_lights"}
OFF_AUTO = {"main_bedroom": "main_bedroom_lights_off", "kitchen": "kitchen_lights_to_off",
            "garage": "garage_lights_off", "playroom": "playroom_lights_to_off",
            "upstairs_hallway": "upstairs_hallway_lights_to_off",
            "office": "office_lights_off", "main_bathroom": "main_bathroom_lights_off",
            "laundry_room": "laundry_room_lights_off"}
ON_AUTOS = {"main_bedroom": ["main_bedroom_lights_motion_on", "main_bedroom_lights_day_on"],
            "kitchen": ["kitchen_lights_motion_on", "kitchen_lights_day_on"],
            "garage": ["garage_lights_motion_on"],
            "playroom": ["playroom_lights_motion_on", "playroom_lights_day_on"],
            "upstairs_hallway": ["upstairs_hallway_lights_motion_on"],
            "office": ["office_lights_motion_on", "office_lights_day_on", "office_lights_on"],
            # bedtime_motion_on is the night light: on-type, so the latch gates it too.
            "main_bathroom": ["main_bathroom_lights_motion_on", "main_bathroom_bedtime_motion_on"],
            "laundry_room": ["laundry_room_lights_motion_on"]}

# The hallway's motion-on never had a mode condition (the room has no Dim/DnD split); adding one
# would change behaviour, so its gate is checked as house flag, room flag, latch only.
NO_MODE_CONDITION = ("upstairs_hallway",)


# Other lights whose hand changes must also latch the override (Dim pendants).
EXTRA_LIGHTS = {"kitchen": ["light.kitchen_island_pendants"],
                "office": ["light.office_ceiling_bulbs"]}


def _main_light(room):
    return MAIN_LIGHT[room]


@pytest.mark.parametrize("room,light", [(r, l) for r, ls in EXTRA_LIGHTS.items() for l in ls])
def test_manual_change_also_watches_extra_lights(room, light):
    """A hand change to the Dim pendants must latch too, else Dim motion re-applies over it."""
    trig = as_list(_manual(room)["triggers"])
    for to in ("on", "off"):
        assert any(t.get("entity_id") == light and t.get("to") == to
                   and "attribute" not in t for t in trig), to
    assert any(t.get("entity_id") == light and t.get("attribute") == "brightness"
               and not {"from", "to", "not_from", "not_to"} & set(t) for t in trig)


@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_manual_change_triggers_and_alias(room):
    """Manual change fires on the light going on and off; attribute triggers carry no from/to; alias slug == id."""
    a = _manual(room)
    trig = as_list(a["triggers"])
    for to in ("on", "off"):
        assert any(t.get("trigger") == "state" and t.get("entity_id") == _main_light(room)
                   and t.get("to") == to and "attribute" not in t for t in trig), to
    for t in trig:
        if "attribute" in t:
            assert not {"from", "to", "not_from", "not_to"} & set(t), t
    slug = re.sub(r"[^a-z0-9]+", "_", a["alias"].lower()).strip("_")
    assert slug == a["id"]


@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_manual_change_conditions_guard_context_and_unavailable(room):
    """Conditions check parent_id and reject unavailable/unknown from_state."""
    text = "\n".join(c.get("value_template", "") for c in conds_for(_manual(room)))
    assert "parent_id" in text
    assert (re.search(r"state\s+in\s+\[\s*'on'\s*,\s*'off'\s*\]", text)
            or ("unavailable" in text and "unknown" in text)), "no unavailable/unknown guard"


def _ctx(id_="abc", user=None, parent=None):
    return SimpleNamespace(id=id_, user_id=user, parent_id=parent)


def _st(state, ctx, updated):
    return SimpleNamespace(state=state, context=ctx, last_updated=updated)


T0 = datetime(2026, 10, 30, 12, 0, 0)


def _passes(room, trigger):
    env = Environment()
    for c in conds_for(_manual(room)):
        if c.get("condition") != "template":
            continue
        if env.from_string(c["value_template"]).render(trigger=trigger).strip() != "True":
            return False
    return True


def _trigger(id_, frm, to):
    return SimpleNamespace(id=id_, from_state=frm, to_state=to)


@pytest.mark.parametrize("room", MIGRATED_ROOMS)
@pytest.mark.parametrize("name,trigger,expected", [
    ("wall press",
     _trigger("0", _st("off", _ctx("p"), T0), _st("on", _ctx("w"), T0)), True),
    ("app toggle",
     _trigger("0", _st("off", _ctx("p"), T0), _st("on", _ctx("a", user="u1"), T0)), True),
    ("script run by a user (user and parent)",
     _trigger("0", _st("off", _ctx("p"), T0),
              _st("on", _ctx("s", user="u1", parent="par"), T0)), True),
    ("automation",
     _trigger("0", _st("off", _ctx("p"), T0), _st("on", _ctx("x", parent="par"), T0)), False),
    ("unavailable to on",
     _trigger("0", _st("unavailable", _ctx("p"), T0), _st("on", _ctx("w"), T0)), False),
    ("adaptive lighting context",
     _trigger("0", _st("off", _ctx("p"), T0), _st("on", _ctx("01H:al:xyz"), T0)), False),
    ("no from_state",
     _trigger("0", None, _st("on", _ctx("w"), T0)), False),
    ("brightness 10 s after automation",
     _trigger("brightness", _st("on", _ctx("x", parent="par"), T0),
              _st("on", _ctx("w"), T0 + timedelta(seconds=3))), False),
    ("brightness trigger on an off to on change",
     _trigger("brightness", _st("off", _ctx("p"), T0), _st("on", _ctx("w"), T0)), False),
    ("brightness trigger on an on to off change",
     _trigger("brightness", _st("on", _ctx("p"), T0), _st("off", _ctx("w"), T0)), False),
    ("brightness 60 s after automation",
     _trigger("brightness", _st("on", _ctx("x", parent="par"), T0),
              _st("on", _ctx("w"), T0 + timedelta(seconds=60))), True),
])
def test_manual_change_templates_render(room, name, trigger, expected):
    """Real jinja render of the manual-change conditions against fake triggers."""
    assert _passes(room, trigger) is expected, name


# 5 ---------------------------------------------------------------------------
@pytest.mark.parametrize("room,auto_id", [(r, a) for r in MIGRATED_ROOMS for a in ON_AUTOS[r]])
def test_on_automations_gated_by_flags_and_latch_before_mode(room, auto_id):
    """On-type lighting automations check house flag, room flag, latch=off, in that order, before the mode."""
    conds = conds_for(auto(auto_id))
    idx = [cond_index(conds, HOUSE_FLAG, "on"), cond_index(conds, flag(room), "on"),
           cond_index(conds, latch(room), "off")]
    if room not in NO_MODE_CONDITION:
        idx.append(next((i for i, c in enumerate(conds) if f"input_select.{room}" in str(c)), None))
    assert None not in idx, idx
    assert idx == sorted(idx), idx


# 6 ---------------------------------------------------------------------------
@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_off_path_ignores_flag_and_latch_on_room_off(room):
    """Room Off turns lights off regardless of flag and latch; only the vacancy branch reads the hand flag."""
    path, a = ALL[OFF_AUTO[room]]
    assert any(t.get("id") == "room_off" and t.get("to") == "Off" for t in as_list(a["triggers"]))
    assert latch(room) not in path.read_text()
    conds = conds_for(a)
    assert cond_index(conds, HOUSE_FLAG, "on") is not None
    assert not any(flag(room) in str(c) for c in conds if c.get("condition") != "or")
    ors = [c for c in conds if c.get("condition") == "or"]
    assert ors, "no or-condition"
    first = ors[0]["conditions"][0]
    assert first == {"condition": "trigger", "id": "room_off"}
    assert flag(room) not in str(first)
    assert flag(room) in str(ors[0]["conditions"][1:]), "hand flag must gate the vacancy branch"


# 7 ---------------------------------------------------------------------------
def _mode_off_rooms():
    return {p.name[: -len("_mode_off.yaml")]: p
            for p in (REPO / "packages").rglob("*_mode_off.yaml")}


def test_ordering_invariant_sanity():
    """Room discovery from filenames finds the rooms this invariant was written for."""
    rooms = _mode_off_rooms()
    assert "main_bedroom" in rooms and "kitchen" in rooms
    forcing = [r for r, p in rooms.items() if _forces_occupancy_off(r, p)]
    assert "main_bedroom" in forcing and "kitchen" in forcing


def _forces_occupancy_off(room, path):
    doc = load_yaml(path)
    occ = f"input_boolean.{room}_occupied"
    return any(s == "input_boolean.turn_off" and e == occ
               for s, e, _ in turn_calls(doc["automation"][0]["actions"]))


@pytest.mark.parametrize("room", sorted(r for r, p in _mode_off_rooms().items()
                                        if _forces_occupancy_off(r, p)))
def test_mode_off_ordering_invariant(room):
    """If mode_off forces occupancy off, the flag is reset by a reset automation, never written by
    not_occupied, or restored by mode_off itself as a top-level action."""
    mode_off = load_yaml(_mode_off_rooms()[room])["automation"][0]
    if f"{room}_lights_reset_manual_toggle" in ALL:
        return
    not_occ = ALL.get(f"{room}_not_occupied")
    if not_occ is None or not any(e == flag(room) for _, e, _ in turn_calls(action_body(not_occ[1]))):
        return
    top_level = [s for s in as_list(mode_off["actions"])
                 if s.get("action") == "input_boolean.turn_on" and flag(room) in action_entities(s)]
    assert top_level, (f"{room}: mode_off forces occupancy off, not_occupied writes the flag, "
                       "and nothing resets it")


# 8 ---------------------------------------------------------------------------
NO_OCC_OFF_TRIGGER = ("kitchen", "garage", "playroom", "upstairs_hallway", "office",
                       "laundry_room")


@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_mode_auto_bounce_guard(room):
    """Where mode_auto turns on occupancy-off: needs house_occupied on, house not Away/Vacation, no
    house == Auto condition. Kitchen has no such trigger, so it asserts that instead."""
    a = auto(f"{room}_mode_auto")
    occ_off = [t for t in as_list(a["triggers"])
               if t.get("entity_id") == f"input_boolean.{room}_occupied" and t.get("to") == "off"]
    if not occ_off:
        # These rooms' mode_auto has no occupancy-off trigger, so there is nothing to bounce.
        assert room in NO_OCC_OFF_TRIGGER, f"{room} lost its occupancy-off trigger"
        return
    _assert_bounce_guard(a, room, occ_off)


def _assert_bounce_guard(a, room, occ_off):
    # The branch is selected by trigger id: the occupancy-off trigger must carry it.
    assert all(t.get("id") == f"{room}_unoccupied" for t in occ_off), occ_off
    branch = next(o for o in a["actions"][0]["choose"]
                  if any(c.get("condition") == "trigger" and c.get("id") == f"{room}_unoccupied"
                         for c in o["conditions"]))
    ifs = [s for s in walk(branch["sequence"]) if "if" in s]
    assert ifs
    guard = ifs[0]["if"]
    assert cond_index(guard, "input_boolean.house_occupied", "on") is not None
    nots = [c for c in guard if c.get("condition") == "not"]
    assert any("Away" in as_list(n["conditions"][0].get("state"))
               and "Vacation" in as_list(n["conditions"][0].get("state"))
               and n["conditions"][0].get("entity_id") == "input_select.house" for n in nots)
    scanned = {k: v for k, v in a.items() if k not in ("triggers", "trigger")}
    for d in walk(scanned):
        if d.get("condition") == "state" and "input_select.house" in as_list(d.get("entity_id")):
            assert "Auto" not in [str(s) for s in as_list(d.get("state"))], d


# 9 ---------------------------------------------------------------------------
def test_no_duplicate_package_basenames():
    """!include_dir_named keys packages by basename; two files with one name silently collide."""
    seen = {}
    for p in (REPO / "packages").rglob("*.yaml"):
        seen.setdefault(p.name, []).append(str(p.relative_to(REPO)))
    dups = {k: v for k, v in seen.items() if len(v) > 1}
    assert not dups, dups


# 10 garage ------------------------------------------------------------------
def test_garage_mode_off_never_forces_occupancy_off():
    """Plan task 17: garage_mode_off only runs while the garage is already unoccupied and never writes
    garage_occupied, so the ordering invariant does not apply; the latch is reset by its own automation."""
    mode_off = load_yaml(_mode_off_rooms()["garage"])["automation"][0]
    assert not any(e == "input_boolean.garage_occupied"
                   for _, e, _ in turn_calls(mode_off["actions"]))
    assert "garage_lights_reset_manual_toggle" in ALL


def test_garage_automation_off_does_not_latch():
    """Flapping fix: an automation-driven off (parent, no user) must not set the latch or disable anything."""
    off = _trigger("0", _st("on", _ctx("p"), T0), _st("off", _ctx("x", parent="par"), T0))
    assert _passes("garage", off) is False
    # ...and the same context clause is what a real wall press passes through
    wall = _trigger("0", _st("on", _ctx("p"), T0), _st("off", _ctx("w"), T0))
    assert _passes("garage", wall) is True
    assert "parent_id" in "\n".join(c.get("value_template", "") for c in conds_for(_manual("garage")))


def test_garage_motion_off_obeys_hand_flag_not_latch():
    """Vacancy-off obeys the hand flag (Open decision 6) and never reads the latch."""
    path, a = ALL["garage_lights_motion_off"]
    assert cond_index(conds_for(a), flag("garage"), "on") == 0
    assert latch("garage") not in path.read_text()


# 11 playroom ----------------------------------------------------------------
def test_playroom_mode_off_forces_occupancy_off_with_target():
    """JK-1219: Off at Away/bedtime/house-empty also clears occupancy, via a target: block."""
    steps = [s for s in walk(auto("playroom_mode_off")["actions"])
             if s.get("action") == "input_boolean.turn_off"]
    assert any(s.get("target", {}).get("entity_id") == "input_boolean.playroom_occupied"
               for s in steps)
    assert all("entity_id" not in s for s in steps)


def test_playroom_not_occupied_only_clears_occupancy():
    """not_occupied no longer re-enables the hand flag after a delay."""
    body = action_body(auto("playroom_not_occupied"))
    assert [s.get("action") for s in body] == ["input_boolean.turn_off"]
    assert not any("delay" in s for s in body)


def test_playroom_old_detection_is_gone():
    assert "playroom_lights_manually_turned_off" not in ALL


# 12 upstairs hallway --------------------------------------------------------
def test_upstairs_hallway_mode_off_forces_occupancy_off_with_target():
    """JK-1219: house-empty/restart Off also clears occupancy, via a target: block."""
    steps = [s for s in walk(auto("upstairs_hallway_mode_off")["actions"])
             if s.get("action") == "input_boolean.turn_off"]
    assert any(s.get("target", {}).get("entity_id") == "input_boolean.upstairs_hallway_occupied"
               for s in steps)
    assert all("entity_id" not in s for s in steps)


def test_upstairs_hallway_not_occupied_only_clears_occupancy():
    """not_occupied no longer re-enables the hand flag after a delay."""
    body = action_body(auto("upstairs_hallway_not_occupied"))
    assert [s.get("action") for s in body] == ["input_boolean.turn_off"]


def test_upstairs_hallway_sleep_mode_automations_do_not_touch_flags():
    for aid in ("upstairs_hallway_lights_sleep_mode_on", "upstairs_hallway_lights_sleep_mode_off"):
        text = str(auto(aid))
        assert latch("upstairs_hallway") not in text and flag("upstairs_hallway") not in text


def test_upstairs_hallway_old_detection_is_gone():
    assert "upstairs_hallway_lights_manually_turned_off" not in ALL


# 13 office ------------------------------------------------------------------
def test_office_lights_on_latch_gate_before_mode_and_dnd_still_passes():
    """DnD keeps the lights on: office_lights_on passes Auto and DnD (only), and the latch sits ahead of that."""
    conds = conds_for(auto("office_lights_on"))
    mode_i = next(i for i, c in enumerate(conds) if "input_select.office" in str(c))
    assert cond_index(conds, latch("office"), "off") < mode_i
    modes = conds[mode_i]
    assert modes["condition"] == "or"
    passing = sorted(str(s) for c in modes["conditions"] for s in as_list(c["state"]))
    assert passing == ["Auto", "DnD"]


def test_office_day_on_still_passes_dnd_and_motion_on_only_auto():
    day = next(c for c in conds_for(auto("office_lights_day_on"))
               if c.get("condition") == "or" and "input_select.office" in str(c))
    assert sorted(str(s) for c in day["conditions"] for s in as_list(c["state"])) == ["Auto", "DnD"]
    assert cond_index(conds_for(auto("office_lights_motion_on")), "input_select.office", "Auto") is not None


@pytest.mark.parametrize("aid", [
    "office_lights_scene_toggle", "office_lights_sync_bulbs_from_switch",
    "office_lights_sync_switch_state", "office_camera_light_on", "office_dnd_light_on",
    "office_shelf_lights_turn_on_deep_work_lighting"])
def test_office_user_driven_light_automations_are_not_latch_gated(aid):
    """Scene toggles, switch/bulb syncs and the DnD/camera/deep-work lights follow the user, not occupancy."""
    path, _ = ALL[aid]
    assert latch("office") not in path.read_text()


def test_office_old_detection_and_dead_flag_writers_are_gone():
    for aid in ("office_lights_manually_turned_off", "office_lighting_automation_on",
                "office_lighting_automation_off"):
        assert aid not in ALL


def test_office_motion_off_obeys_hand_flag_not_latch():
    path, a = ALL["office_lights_motion_off"]
    assert cond_index(conds_for(a), flag("office"), "on") == 0
    assert latch("office") not in path.read_text()


def test_office_manual_change_ignores_sync_driven_changes():
    """A bulb/switch change made by the sync automations carries a parent and no user."""
    sync = _trigger("0", _st("off", _ctx("p"), T0), _st("on", _ctx("s", parent="par"), T0))
    assert _passes("office", sync) is False


def test_office_mode_off_leaves_occupancy_alone():
    """JK-1219 deliberately not applied to the office (see packages/office/LEARNINGS.md); the latch is
    still cleared by the reset automation on room Off."""
    mode_off = load_yaml(_mode_off_rooms()["office"])["automation"][0]
    assert not any(e == "input_boolean.office_occupied"
                   for _, e, _ in turn_calls(mode_off["actions"]))
    assert "office_lights_reset_manual_toggle" in ALL


# 14 main bathroom -----------------------------------------------------------
def test_main_bathroom_mode_off_forces_occupancy_off_with_target():
    """JK-1219: Off at Away/house-empty/restart also clears occupancy, via a target: block."""
    steps = [s for s in walk(auto("main_bathroom_mode_off")["actions"])
             if s.get("action") == "input_boolean.turn_off"]
    assert any(s.get("target", {}).get("entity_id") == "input_boolean.main_bathroom_occupied"
               for s in steps)
    assert all("entity_id" not in s for s in steps)


def test_main_bathroom_not_occupied_only_clears_occupancy():
    """not_occupied no longer re-enables the hand flag after a delay."""
    body = action_body(auto("main_bathroom_not_occupied"))
    assert [s.get("action") for s in body] == ["input_boolean.turn_off"]


def test_main_bathroom_mode_auto_guard_covers_the_occupancy_trigger_and_sets_auto():
    """The room has an occupancy-off trigger, so it must NOT be in NO_OCC_OFF_TRIGGER; both the
    guarded branch and the default go through the one script that selects Auto."""
    assert "main_bathroom" not in NO_OCC_OFF_TRIGGER
    a = auto("main_bathroom_mode_auto")
    choose = a["actions"][0]
    assert all(s["action"] == "script.main_bathroom_mode_turn_on_auto"
               for s in walk(choose.get("default")) if "action" in s)
    assert auto("script.main_bathroom_mode_turn_on_auto")


def test_main_bathroom_old_detection_is_gone():
    assert "main_bathroom_lights_turned_off" not in ALL


# 15 laundry room ------------------------------------------------------------
def test_laundry_motion_on_reads_its_room_flag():
    """Regression: the laundry toggle did nothing because motion_on never checked it."""
    assert cond_index(conds_for(auto("laundry_room_lights_motion_on")), flag("laundry_room"), "on") is not None


def test_laundry_mode_off_forces_occupancy_off_with_target():
    """JK-1219: Off at Away/bedtime/house-empty/restart also clears occupancy, via a target: block."""
    steps = [s for s in walk(auto("laundry_room_mode_off")["actions"])
             if s.get("action") == "input_boolean.turn_off"]
    assert any(s.get("target", {}).get("entity_id") == "input_boolean.laundry_room_occupied"
               for s in steps)
    assert all("entity_id" not in s for s in steps)


def test_laundry_not_occupied_only_clears_occupancy():
    body = action_body(auto("laundry_room_not_occupied"))
    assert [s.get("action") for s in body] == ["input_boolean.turn_off"]


# 16 mode-only rooms (no lighting automations: no flags, no latch) ------------
# Only `<room>_mode_off` forcing `<room>_occupied` off (JK-1219), plus the bounce guard where
# mode_auto has an occupancy-off trigger. Not in MIGRATED_ROOMS.
# Gianluca's mode automations are named gianlucas_bedroom_* while his helpers are gianlucas_room_*.
MODE_ID = {"gianlucas_room": "gianlucas_bedroom"}
MODE_ONLY_ROOMS = ["dining_room", "basement", "jr_suite", "powder_room", "mudroom_bathroom", "sunroom", "foyer",
                  "ninos_bedroom"]


@pytest.mark.parametrize("room", MODE_ONLY_ROOMS)
def test_mode_only_room_mode_off_forces_occupancy_off_with_target(room):
    """JK-1219: Off also clears occupancy, via a target: block."""
    steps = [s for s in walk(auto(f"{MODE_ID.get(room, room)}_mode_off")["actions"])
             if s.get("action") == "input_boolean.turn_off"]
    assert any(s.get("target", {}).get("entity_id") == f"input_boolean.{room}_occupied"
               for s in steps)
    assert all("entity_id" not in s for s in steps)


@pytest.mark.parametrize("room", MODE_ONLY_ROOMS)
def test_mode_only_room_mode_auto_guard(room):
    """Where mode_auto triggers on occupancy off it needs the bounce guard; otherwise there is
    nothing to bounce and the trigger must stay absent."""
    a = auto(f"{MODE_ID.get(room, room)}_mode_auto")
    occ_off = [t for t in as_list(a["triggers"])
               if t.get("entity_id") == f"input_boolean.{room}_occupied" and t.get("to") == "off"]
    if occ_off:
        _assert_bounce_guard(a, room, occ_off)


@pytest.mark.parametrize("room", MODE_ONLY_ROOMS)
def test_mode_only_room_has_no_override_kit(room):
    assert not helper_exists(room, f"{room}_lighting_automations")
    assert not helper_exists(room, f"{room}_lights_manually_toggled")


def helper_exists(room, name):
    for f in room_files(room):
        doc = load_yaml(f)
        if isinstance(doc, dict) and name in (doc.get("input_boolean") or {}):
            return True
    return False


# 17 dining room -------------------------------------------------------------
REMOVED_DINING = ("dining_room_lighting_automations", "dining_room_lights_auto")


def test_dining_room_dead_helpers_are_gone_from_config():
    """The dining room has no lights-on automation: its hand flag and lights_auto helper were removed
    (dashboards are checked separately by the dashboard owner)."""
    hits = []
    roots = [REPO / "packages", REPO / "automation", REPO / "scripts"]
    files = [f for r in roots if r.exists() for f in r.rglob("*") if f.is_file()]
    files += [REPO / n for n in ("automations.yaml", "scripts.yaml", "scenes.yaml") if (REPO / n).exists()]
    for f in files:
        try:
            text = f.read_text()
        except UnicodeDecodeError:
            continue
        hits += [f"{f.relative_to(REPO)}: {n}" for n in REMOVED_DINING if n in text]
    assert not hits, hits


def test_dining_room_not_occupied_only_clears_occupancy():
    body = action_body(auto("dining_room_not_occupied"))
    assert [s.get("action") for s in body] == ["input_boolean.turn_off"]


# 18 kids' rooms: mode_off clears occupancy only when nobody is home and the bed is empty -------
KIDS_BED = {"ninos_bedroom": "binary_sensor.nino_bed_occupied"}


@pytest.mark.parametrize("room", sorted(KIDS_BED))
def test_kids_mode_off_only_clears_occupancy_with_empty_bed(room):
    """Off fires at house empty / Away / restart only, and a kid still in bed keeps the room
    occupied (same rule as not_occupied; the occupied automation will not re-fire on an unchanged
    bed sensor). Pins the bed guard and the house-empty-or-Away gate."""
    a = auto(f"{MODE_ID.get(room, room)}_mode_off")
    gate = next(c for c in as_list(a["conditions"]) if c.get("condition") == "or")
    gated = {(c["entity_id"], str(c["state"])) for c in gate["conditions"]}
    assert gated == {("input_boolean.house_occupied", "off"), ("input_select.house", "Away")}
    clears = [s for s in walk(a["actions"]) if s.get("action") == "input_boolean.turn_off"
              and s.get("target", {}).get("entity_id") == f"input_boolean.{room}_occupied"]
    assert len(clears) == 1
    guarded = [s for s in walk(a["actions"]) if "if" in s and clears[0] in as_list(s.get("then"))]
    assert guarded and cond_index(guarded[0]["if"], KIDS_BED[room], "off") is not None
