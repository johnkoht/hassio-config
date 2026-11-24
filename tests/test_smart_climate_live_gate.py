"""
Per-zone live gate: the climate_live(zone) macro, every reader of it, the seed,
and the static guard that nothing else reads the live switches.
"""
import re

import pytest

from smart_climate_harness import FakeHA, Interpreter, REPO, load, run_actions
from test_smart_climate_controller import (
    APPLY, DRIFT, OVERRIDE, ZONES, RADIANT, apply, climate_calls, ent, make, run_override,
)

GLOBAL = "input_boolean.climate_live_control"
SMART = REPO / "packages" / "climate" / "smart"
MACRO = "{% from 'climate_control.jinja' import climate_live %}{{ climate_live(zone) }}"


def sw(zone):
    return f"input_boolean.climate_live_{zone}"


def live_states(glob="off", **zone_states):
    s = {GLOBAL: glob}
    s.update({sw(z): v for z, v in zone_states.items()})
    return s


# ---- macro truth table -------------------------------------------------------

@pytest.mark.parametrize("zone", ZONES)
def test_macro_global_on_is_live_everywhere(zone):
    assert FakeHA(live_states("on")).render(MACRO, zone=zone) == "True"


@pytest.mark.parametrize("zone", ZONES)
def test_macro_zone_switch_is_live_for_that_zone_only(zone):
    ha = FakeHA(live_states("off", **{zone: "on"}))
    for other in ZONES:
        assert ha.render(MACRO, zone=other) == ("True" if other == zone else "False")


@pytest.mark.parametrize("state", ["off", "unknown", "unavailable", ""])
@pytest.mark.parametrize("zone", ZONES)
def test_macro_not_on_is_false(zone, state):
    assert FakeHA(live_states(state, **{zone: state})).render(MACRO, zone=zone) == "False"


def test_macro_missing_entities_are_false():
    assert FakeHA({}).render(MACRO, zone="garage") == "False"


def test_macro_renders_exactly_true_false_parsed_as_bool():
    ha = FakeHA(live_states("off", garage="on"))
    it = Interpreter(ha, {"zone": "garage"})
    it.run([{"variables": {"a": MACRO, "b": MACRO.replace("(zone)", "('basement')")}}])
    assert it.vars["a"] is True and it.vars["b"] is False
    assert ha.render(MACRO, zone="garage") == "True"  # no padding


# ---- apply script --------------------------------------------------------------

def apply_with(zone, glob="off", zone_switch=None, **kw):
    ha = make(zone, live=glob, **kw)
    if zone_switch is not None:
        ha.s[sw(zone)] = zone_switch
    return run_actions(APPLY["sequence"], ha, {"zone": zone, "source": "decision"}), ha


def test_garage_live_writes_only_the_garage():
    for zone in ZONES:
        res, _ = apply_with(zone, zone_switch="on" if zone == "garage" else None,
                            want_mode="heat", want_temp="55.0", cur_mode="off")
        if zone == "garage":
            assert climate_calls(res), zone
        else:
            assert climate_calls(res) == [], zone
            assert [a["data"]["name"] for a in res.actions] == ["Climate dry run"], zone


@pytest.mark.parametrize("zone", ZONES)
def test_global_on_makes_every_zone_live(zone):
    res, _ = apply_with(zone, glob="on")
    assert climate_calls(res)


@pytest.mark.parametrize("state", ["unknown", "unavailable", "off"])
def test_zone_switch_not_on_with_global_off_is_dry_run(state):
    res, _ = apply_with("garage", zone_switch=state, want_mode="heat", want_temp="55.0", cur_mode="off")
    assert climate_calls(res) == []


def test_post_wait_recheck_uses_the_macro():
    # Mode change then a wait; the wait callback turns the switches off mid-run.
    def kill(zone_switch, glob):
        def on_action(rec, ha):
            if rec["action"] == "climate.set_hvac_mode":
                ha.s[GLOBAL] = glob
                ha.s[sw("garage")] = zone_switch
        return on_action

    def run(start_zone_switch, start_glob, after_zone, after_glob):
        ha = make("garage", live=start_glob, want_mode="heat", want_temp="55.0", cur_mode="off")
        ha.s[sw("garage")] = start_zone_switch
        return run_actions(APPLY["sequence"], ha, {"zone": "garage", "source": "decision"},
                           on_action=kill(after_zone, after_glob))

    # both off after the wait: setpoint skipped
    res = run("on", "off", "off", "off")
    assert [a["action"] for a in climate_calls(res)] == ["climate.set_hvac_mode"]
    assert res.stopped == "condition failed"
    # only the zone switch stays on: continues to the setpoint
    res = run("on", "off", "on", "off")
    assert [a["action"] for a in climate_calls(res)] == ["climate.set_hvac_mode", "climate.set_temperature"]
    # only the global stays on: continues
    res = run("off", "on", "off", "on")
    assert [a["action"] for a in climate_calls(res)] == ["climate.set_hvac_mode", "climate.set_temperature"]


# ---- override detect -----------------------------------------------------------

def test_override_garage_live_leaves_others_dry():
    for zone in ("main_floor", "jr_suite"):
        res, _ = run_override(zone, live="off", want_mode="heat", want_temp="70.0",
                              cur_mode="heat", cur_temp=60.0, preset="temp")
        assert [a["action"] for a in res.actions] == ["logbook.log"], zone
        assert res.actions[0]["data"]["name"] == "Climate dry run"


@pytest.mark.parametrize("zone", ["main_floor", "jr_suite", "basement"])
def test_override_zone_switch_takes_live_path(zone):
    ha = make(zone, live="off", want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=60.0,
              preset="temp")
    ha.s[sw(zone)] = "on"
    res = run_actions(OVERRIDE["actions"], ha, {"trigger": {"entity_id": ent(zone)}})
    assert res.actions[0]["action"] == "input_select.select_option"


def test_override_other_zone_switch_does_not_make_this_zone_live():
    ha = make("main_floor", live="off", want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=60.0)
    ha.s[sw("garage")] = "on"
    res = run_actions(OVERRIDE["actions"], ha, {"trigger": {"entity_id": ent("main_floor")}})
    assert res.actions[0]["data"]["name"] == "Climate dry run"


# ---- drift check ---------------------------------------------------------------

def drift(trigger_id, **states):
    ha = FakeHA({"input_boolean.climate_automations": "on", **states})
    return Interpreter(ha, {"trigger": {"id": trigger_id}}).run(DRIFT["conditions"] + DRIFT["actions"])


def test_drift_has_start_trigger_per_zone_switch():
    starts = {t["entity_id"] for t in DRIFT["triggers"]
              if t["trigger"] == "state" and t.get("to") == "on" and t["id"] == "start"}
    assert {sw(z) for z in ZONES} <= starts and GLOBAL in starts


def test_drift_tick_with_no_zone_live_makes_no_call():
    res = drift("tick", **live_states("off"))
    assert res.actions == [] and res.stopped == "condition failed"
    assert drift("tick").actions == []  # nothing exists


def test_drift_tick_with_garage_live_runs_only_garage():
    res = drift("tick", **live_states("off", garage="on"))
    assert len(res.actions) == 1
    assert res.actions[0]["target"]["entity_id"] == ["script.climate_apply_garage"]
    assert res.actions[0]["data"] == {"variables": {"source": "drift"}}


def test_drift_tick_with_global_on_runs_all_seven():
    res = drift("tick", **live_states("on"))
    assert res.actions[0]["target"]["entity_id"] == [f"script.climate_apply_{z}" for z in ZONES]


def test_drift_start_runs_all_seven_even_when_dry():
    res = drift("start", **live_states("off"))
    assert res.actions[0]["target"]["entity_id"] == [f"script.climate_apply_{z}" for z in ZONES]
    assert res.actions[0]["data"] == {"variables": {"source": "start"}}


# ---- dry-air notify ------------------------------------------------------------

DRY = load("packages/climate/smart/notify/climate_dry_air_notify.yaml")["automation"][0]


def dry_msg(**states):
    ha = FakeHA({"sensor.average_indoor_humidity": "27.5", **states})
    return ha.render(DRY["actions"][0]["data"]["message"])


@pytest.mark.parametrize("zone,dry", [("garage", True), ("main_floor", True), ("second_floor", True),
                                      ("jr_suite", False), ("main_bedroom", False),
                                      ("ninos_bedroom", False), ("basement", False)])
def test_dry_air_dry_run_unless_radiant_live(zone, dry):
    assert ("(dry run)" in dry_msg(**live_states("off", **{zone: "on"}))) is dry


def test_dry_air_global_on_and_all_off():
    assert "(dry run)" not in dry_msg(**live_states("on"))
    assert "(dry run)" in dry_msg(**live_states("off"))


# ---- seed ----------------------------------------------------------------------

def test_seed_turns_off_global_and_every_zone_switch():
    seq = load("packages/climate/smart/scripts/climate_seed_defaults.yaml")["script"]["climate_seed_defaults"]["sequence"]
    off = set()
    for st in seq:
        if st.get("action") == "input_boolean.turn_off":
            ids = st["target"]["entity_id"]
            off |= set(ids if isinstance(ids, list) else [ids])
    assert off == {GLOBAL, *(sw(z) for z in ZONES)}


# ---- helpers -------------------------------------------------------------------

def test_zone_live_helpers_exist():
    helpers = load("packages/climate/smart/helpers/climate_smart_switches.yaml")["input_boolean"]
    for z in ZONES:
        cfg = helpers[f"climate_live_{z}"]
        assert cfg["name"].startswith("Climate - Live ") and "initial" not in cfg


# ---- static guard (decision 6) ---------------------------------------------------

def _strings(node):
    if isinstance(node, str):
        yield node
    elif isinstance(node, dict):
        for v in node.values():
            yield from _strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from _strings(v)


def _conditions(node):
    if isinstance(node, dict):
        if node.get("condition") == "state":
            yield node
        for v in node.values():
            yield from _conditions(v)
    elif isinstance(node, list):
        for v in node:
            yield from _conditions(v)


def violations(data):
    """String values that read a live switch in a template, and state conditions on one."""
    out = []
    for s in _strings(data):
        if "climate_live_" in s and ("{{" in s or "{%" in s):
            out.append(f"template: {s.strip()[:80]}")
    for c in _conditions(data):
        ids = c.get("entity_id")
        ids = ids if isinstance(ids, list) else [ids]
        if any("climate_live_" in str(i) for i in ids):
            out.append(f"condition: {ids}")
    return out


def _yaml_files():
    for d in ("packages", "automation", "scripts"):
        yield from (REPO / d).rglob("*.yaml")


def test_no_direct_reads_of_the_live_switches():
    found = {}
    for f in _yaml_files():
        v = violations(load(f.relative_to(REPO)))
        if v:
            found[str(f.relative_to(REPO))] = v
    assert found == {}


def test_static_guard_catches_a_direct_read():
    bad = {"actions": [{"if": [{"condition": "template",
                                "value_template": "{{ is_state('input_boolean.climate_live_control', 'on') }}"}]}]}
    assert violations(bad)
    bad2 = {"actions": [{"condition": "state", "entity_id": "input_boolean.climate_live_garage", "state": "on"}]}
    assert violations(bad2)
    assert violations({"actions": [{"action": "input_boolean.turn_off",
                                    "target": {"entity_id": ["input_boolean.climate_live_garage"]}}]}) == []


def test_global_live_switch_not_on_dashboards():
    for f in (REPO / "dashboards").rglob("*"):
        if f.is_file() and f.suffix in (".yaml", ".yml", ".json"):
            assert "climate_live_control" not in f.read_text(), f
