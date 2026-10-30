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

# Later PRs append rooms here (garage, ...).
MIGRATED_ROOMS = ["main_bedroom", "kitchen"]

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


def room_files(room):
    return sorted((REPO / "packages" / room).rglob("*.yaml"))


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
              "kitchen": "light.kitchen_ceiling_lights"}
OFF_AUTO = {"main_bedroom": "main_bedroom_lights_off", "kitchen": "kitchen_lights_to_off"}
ON_AUTOS = {"main_bedroom": ["main_bedroom_lights_motion_on", "main_bedroom_lights_day_on"],
            "kitchen": ["kitchen_lights_motion_on", "kitchen_lights_day_on"]}


def _main_light(room):
    return MAIN_LIGHT[room]


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
           cond_index(conds, latch(room), "off"),
           next((i for i, c in enumerate(conds) if f"input_select.{room}" in str(c)), None)]
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
@pytest.mark.parametrize("room", MIGRATED_ROOMS)
def test_mode_auto_bounce_guard(room):
    """Where mode_auto turns on occupancy-off: needs house_occupied on, house not Away/Vacation, no
    house == Auto condition. Kitchen has no such trigger, so it asserts that instead."""
    a = auto(f"{room}_mode_auto")
    occ_off = [t for t in as_list(a["triggers"])
               if t.get("entity_id") == f"input_boolean.{room}_occupied" and t.get("to") == "off"]
    if not occ_off:
        # Kitchen: mode_auto has no occupancy-off trigger, so there is nothing to bounce.
        assert room == "kitchen", f"{room} lost its occupancy-off trigger"
        return
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
