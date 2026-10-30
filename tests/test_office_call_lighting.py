"""
Regression tests for office call lighting (wfh-call-lighting).

Structure of the helpers and the start / end / reset automations, a real-jinja render of the AL
gate, the entertainment-mode guard, and the interplay with the manual-override latch.
"""
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
DIR = REPO / "packages" / "office" / "call_lighting"

START_F = DIR / "office_call_lighting_start.yaml"
END_F = DIR / "office_call_lighting_end.yaml"
RESET_F = DIR / "office_call_lighting_reset.yaml"
HELPERS_F = DIR / "office_call_lighting_helpers.yaml"
MANUAL_F = REPO / "packages/office/lights/office_lights_manual_change.yaml"

AL = "switch.adaptive_lighting_office"
FLAG = "input_boolean.office_call_al_paused"
ENT = "input_boolean.entertainment_mode"
BULBS = "light.office_ceiling_bulbs"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def auto(path):
    return load(path)["automation"][0]


START, END, RESET = auto(START_F), auto(END_F), auto(RESET_F)
HELPERS = load(HELPERS_F)


def as_list(v):
    return v if isinstance(v, list) else [v]


def walk(node):
    """Yield every dict nested anywhere in node."""
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def actions_of(a):
    return [s for s in walk(a["actions"]) if "action" in s]


def action_names(a):
    return [s["action"] for s in actions_of(a)]


def has_state(conds, entity, state):
    return any(c.get("condition") == "state" and c.get("entity_id") == entity and c.get("state") == state
               for c in conds)


def state_index(conds, entity, state):
    for i, c in enumerate(conds):
        if c.get("condition") == "state" and c.get("entity_id") == entity and c.get("state") == state:
            return i
    return None


def tmpl_index(conds):
    return next(i for i, c in enumerate(conds) if c.get("condition") == "template")


# helpers --------------------------------------------------------------------
def test_helper_ids_exist():
    """All four helpers are defined."""
    assert set(HELPERS["input_boolean"]) == {"office_call_lighting", "office_call_al_paused"}
    assert set(HELPERS["input_number"]) == {"office_call_color_temp", "office_call_brightness"}


def test_helper_ranges():
    """Colour temp is 2700-6500 step 100 and brightness 30-100 step 5."""
    ct = HELPERS["input_number"]["office_call_color_temp"]
    br = HELPERS["input_number"]["office_call_brightness"]
    assert (ct["min"], ct["max"], ct["step"]) == (2700, 6500, 100)
    assert (br["min"], br["max"], br["step"]) == (30, 100, 5)


def test_no_helper_has_initial():
    """`initial:` would re-apply on restart and revert dashboard edits and the latch."""
    for kind in HELPERS.values():
        for name, d in kind.items():
            assert "initial" not in d, name


# start ----------------------------------------------------------------------
def test_start_triggers_exact():
    """Start fires on DnD held 10 s, or when AL's kelvin drops below the setting."""
    assert START["triggers"] == [
        {"trigger": "state", "entity_id": "input_select.office", "to": "DnD",
         "for": {"seconds": 10}, "id": "dnd"},
        {"trigger": "numeric_state", "entity_id": AL, "attribute": "color_temp_kelvin",
         "below": "input_number.office_call_color_temp", "id": "dusk"},
    ]


@pytest.mark.parametrize("entity,state", [
    ("input_boolean.lighting_automations", "on"),
    ("input_boolean.house_occupied", "on"),
    ("input_boolean.office_lighting_automations", "on"),
    ("input_boolean.office_lights_manually_toggled", "off"),
    ("input_boolean.office_occupied", "on"),
    ("input_select.office", "DnD"),
    ("binary_sensor.john_dnd_active", "on"),
    ("input_boolean.entertainment_mode", "off"),
    ("input_boolean.office_call_lighting", "on"),
    (FLAG, "off"),
    (AL, "on"),
    ("switch.adaptive_lighting_sleep_mode_office", "off"),
])
def test_start_has_condition(entity, state):
    """Start requires each of its gating states."""
    assert has_state(START["conditions"], entity, state), (entity, state)


def test_start_house_not_bedtime():
    """Start refuses while the house is in Bedtime."""
    assert any(c.get("condition") == "not" and has_state(c["conditions"], "input_select.house", "Bedtime")
               for c in START["conditions"])


def test_start_gate_order_global_room_latch_occupancy_mode():
    """Conditions run global, then room flag, latch, occupancy, then the DnD select."""
    c = START["conditions"]
    idx = [state_index(c, "input_boolean.lighting_automations", "on"),
           state_index(c, "input_boolean.house_occupied", "on"),
           state_index(c, "input_boolean.office_lighting_automations", "on"),
           state_index(c, "input_boolean.office_lights_manually_toggled", "off"),
           state_index(c, "input_boolean.office_occupied", "on"),
           state_index(c, "input_select.office", "DnD")]
    assert None not in idx, idx
    assert idx == sorted(idx), idx


def test_start_feature_switch_before_al_gate_template():
    """The cheap feature switch is checked before the AL template."""
    c = START["conditions"]
    assert state_index(c, "input_boolean.office_call_lighting", "on") < tmpl_index(c)
    assert state_index(c, FLAG, "off") < tmpl_index(c)


def test_start_action_order():
    """Flag on first, then AL off, then the bulbs."""
    acts = [(s["action"], s["target"]["entity_id"]) for s in actions_of(START)]
    assert acts == [("input_boolean.turn_on", FLAG), ("switch.turn_off", AL), ("light.turn_on", BULBS)]


def test_start_light_turn_on_guarded_by_bulbs_on():
    """light.turn_on runs only inside an `if` on the bulbs being on, never at the top level."""
    acts = START["actions"]
    assert not [s for s in acts if s.get("action") == "light.turn_on"]
    guard = acts[2]
    assert "if" in guard and "then" in guard
    assert guard["if"] == [{"condition": "state", "entity_id": BULBS, "state": "on"}]
    assert [s["action"] for s in guard["then"]] == ["light.turn_on"]


def test_start_targets_only_ceiling_bulbs():
    """The lamp, shelf, el gato and the whole-room group are never touched."""
    text = START_F.read_text()
    for bad in ("lamp", "shelf", "el_gato", "light.office_lights"):
        assert bad not in text, bad
    lights = [s for s in actions_of(START) if s["action"] == "light.turn_on"]
    assert len(lights) == 1 and lights[0]["target"] == {"entity_id": BULBS}


def test_start_light_data_templated_from_both_numbers():
    """Colour and brightness come from the two settings."""
    data = [s for s in actions_of(START) if s["action"] == "light.turn_on"][0]["data"]
    assert "input_number.office_call_color_temp" in data["color_temp_kelvin"]
    assert "input_number.office_call_brightness" in data["brightness_pct"]


# AL gate template -----------------------------------------------------------
def _gate(kelvin="missing", bri="missing", setting_k="3000", setting_b="100"):
    tmpl = next(c for c in START["conditions"] if c.get("condition") == "template")["value_template"]
    attrs = {}
    if kelvin != "missing":
        attrs["color_temp_kelvin"] = kelvin
    if bri != "missing":
        attrs["brightness_pct"] = bri
    states = {"input_number.office_call_color_temp": setting_k,
              "input_number.office_call_brightness": setting_b}
    env = Environment()
    env.globals["state_attr"] = lambda e, a: attrs.get(a) if e == AL else None
    env.globals["states"] = lambda e: states[e]
    return env.from_string(tmpl).render().strip() == "True"


@pytest.mark.parametrize("kelvin,expected", [
    (2000, True), (2900, True), (2999, True), (3000, False), (5500, False)])
def test_gate_kelvin(kelvin, expected):
    """Kelvin below the setting passes; at or above it does not."""
    assert _gate(kelvin=kelvin, bri=100) is expected


@pytest.mark.parametrize("bri,expected", [(94, True), (95, False), (100, False)])
def test_gate_brightness(bri, expected):
    """Brightness more than 5 under the setting passes even when the colour is daylight."""
    assert _gate(kelvin=5500, bri=bri) is expected


def test_gate_missing_attributes_is_false():
    """AL with no attributes does not start a call."""
    assert _gate() is False


def test_gate_tracks_the_setting():
    """A 3500 setting passes at 3400 K."""
    assert _gate(kelvin=3400, bri=100, setting_k="3500") is True


# end / reset ----------------------------------------------------------------
def test_end_triggers():
    """End on leaving DnD for 3 min, or on the office emptying."""
    t = END["triggers"]
    assert len(t) == 2
    assert t[0]["trigger"] == "state" and t[0]["entity_id"] == "input_select.office"
    assert t[0]["to"] == ["Auto", "Off"] and t[0]["for"] == {"minutes": 3}
    assert t[1] == {"trigger": "state", "entity_id": "input_boolean.office_occupied", "to": "off",
                    "id": "vacated"}


def _guarded_resume(a):
    """Return (index of the entertainment-guarded if, index of the flag turn_off) among top-level actions."""
    acts = a["actions"]
    if_i = next(i for i, s in enumerate(acts) if "if" in s)
    off_i = next(i for i, s in enumerate(acts) if s.get("action") == "input_boolean.turn_off")
    return if_i, off_i


@pytest.mark.parametrize("a", [END, RESET], ids=["end", "reset"])
def test_resume_shape(a):
    """Guarded AL resume comes before the flag clears; the flag clear is outside the guard; no light commands."""
    if_i, off_i = _guarded_resume(a)
    assert if_i < off_i
    guard = a["actions"][if_i]
    assert has_state(guard["if"], ENT, "off")
    inner = [s["action"] for s in guard["then"]]
    assert inner == ["switch.turn_on"]
    assert guard["then"][0]["target"]["entity_id"] == AL
    assert a["actions"][off_i]["target"]["entity_id"] == FLAG
    assert not any(n.startswith("light.") for n in action_names(a))
    # the only switch.turn_on in the whole automation is the guarded one
    assert action_names(a).count("switch.turn_on") == 1


def test_end_requires_flag():
    """End only acts when the pause flag is on."""
    assert has_state(END["conditions"], FLAG, "on")


def test_reset_triggers():
    """Reset: 3 h and 12 h flag-on timers, HA start and automation reload."""
    t = RESET["triggers"]
    def find(id_):
        return next(x for x in t if x["id"] == id_)
    assert find("long") == {"trigger": "state", "entity_id": FLAG, "to": "on", "for": {"hours": 3}, "id": "long"}
    assert find("stuck") == {"trigger": "state", "entity_id": FLAG, "to": "on", "for": {"hours": 12}, "id": "stuck"}
    assert find("start")["trigger"] == "homeassistant" and find("start")["event"] == "start"
    assert find("reload")["trigger"] == "event" and find("reload")["event_type"] == "automation_reloaded"


def test_reset_conditions():
    """Reset needs the flag on, and either the 12 h cap or the office out of DnD."""
    c = RESET["conditions"]
    assert has_state(c, FLAG, "on")
    o = next(x for x in c if x.get("condition") == "or")
    assert {"condition": "trigger", "id": "stuck"} in o["conditions"]
    n = next(x for x in o["conditions"] if x.get("condition") == "not")
    assert has_state(n["conditions"], "input_select.office", "DnD")


def test_entertainment_toggles_same_al_switch():
    """The guard matters because entertainment mode also drives the office AL switch."""
    for name in ("activated", "deactivated"):
        text = (REPO / f"packages/house/entertainment/entertainment_mode_{name}.yaml").read_text()
        assert AL in text, name


# latch interplay ------------------------------------------------------------
def test_start_never_writes_manual_latch_or_room_flag():
    """Start must not touch the office hand flag or the manual-toggle latch."""
    for s in walk(START["actions"]):
        ent = str(s.get("target", {}).get("entity_id", ""))
        assert "office_lighting_automations" not in ent
        assert "office_lights_manually_toggled" not in ent


def _ctx(id_="abc", user=None, parent=None):
    return SimpleNamespace(id=id_, user_id=user, parent_id=parent)


def _st(state, ctx):
    return SimpleNamespace(state=state, context=ctx, last_updated=datetime(2026, 10, 30, 12))


def _trigger(frm, to):
    return SimpleNamespace(id="0", from_state=frm, to_state=to)


def _manual_passes(trigger):
    env = Environment()
    for c in auto(MANUAL_F)["conditions"]:
        if c.get("condition") == "template":
            if env.from_string(c["value_template"]).render(trigger=trigger).strip() != "True":
                return False
    return True


@pytest.mark.parametrize("name,ctx,expected", [
    ("our light.turn_on inside an automation", _ctx("x", parent="par"), False),
    ("adaptive lighting", _ctx("01:al:xyz"), False),
    ("a person in the app", _ctx("u", user="u1"), True),
])
def test_manual_change_reaction_to_bulb_changes(name, ctx, expected):
    """The real manual-change condition ignores automation and AL changes on the bulbs but counts a user."""
    t = _trigger(_st("on", _ctx("p")), _st("off", ctx))
    assert _manual_passes(t) is expected, name


# hygiene --------------------------------------------------------------------
def test_basenames_unique_across_packages():
    """!include_dir_named keys by basename: no other file may share these names."""
    names = {p.name for p in DIR.glob("*.yaml")}
    assert len(names) == 4
    for f in (REPO / "packages").rglob("*.yaml"):
        if f.parent != DIR:
            assert f.name not in names, f


@pytest.mark.parametrize("path,a", [(START_F, START), (END_F, END), (RESET_F, RESET)])
def test_filename_matches_id_and_header_and_modern_syntax(path, a):
    """Filename equals automation id, file opens with a comment, and uses modern keys."""
    assert path.stem == a["id"]
    assert path.read_text().startswith("# ")
    assert "triggers" in a and "trigger" not in a
    assert "actions" in a and "action" not in a
    assert "conditions" in a and "condition" not in a
    assert "service:" not in path.read_text()
    assert all("trigger" in t and "platform" not in t for t in a["triggers"])
