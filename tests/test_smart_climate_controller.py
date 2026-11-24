"""
Controller (task-4): runs the real apply script / override automation through
the harness interpreter against fake states.
"""
import re

import pytest

from smart_climate_harness import FakeHA, REPO, load, run_actions

SMART = REPO / "packages" / "climate" / "smart"
ZONES = ["main_floor", "second_floor", "jr_suite", "main_bedroom", "ninos_bedroom", "basement", "garage"]
RADIANT = ["jr_suite", "main_bedroom", "ninos_bedroom", "basement"]
ENTITY = {"main_floor": "climate.nest_main_floor", "second_floor": "climate.nest_2nd_floor"}
APPLY = load("packages/climate/smart/scripts/climate_apply_zone.yaml")["script"]["climate_apply_zone"]
OVERRIDE = load("packages/climate/smart/override/climate_override_detect.yaml")["automation"][0]
DRIFT = load("packages/climate/smart/control/climate_apply_drift_check.yaml")["automation"][0]


def ent(zone):
    return ENTITY.get(zone, f"climate.{zone}")


def make(zone, live="on", master="on", zmode="Comfort", want_mode="heat", want_temp="70.0",
         cur_mode="cool", cur_temp=60.0, last_write="2026-11-24 05:00:00", preset=None, reason="Comfort"):
    s = {
        "input_boolean.climate_automations": master,
        "input_boolean.climate_live_control": live,
        f"input_select.climate_mode_{zone}": zmode,
        f"sensor.climate_decision_{zone}": want_temp,
        ent(zone): cur_mode,
        f"input_datetime.climate_{zone}_last_write": last_write,
    }
    a = {
        f"sensor.climate_decision_{zone}": {"hvac_mode": want_mode, "zone_mode": zmode, "reason": reason},
        ent(zone): {"temperature": cur_temp, "preset_mode": preset},
    }
    return FakeHA(s, a)


def apply(zone, source="decision", wait="completed", **kw):
    ha = make(zone, **kw)
    return run_actions(APPLY["sequence"], ha, {"zone": zone, "source": source}, wait=wait), ha


def climate_calls(res):
    return [a for a in res.actions if a["action"].startswith("climate.")]


# ---- dry-run proof -------------------------------------------------------

@pytest.mark.parametrize("live", ["off", "unknown", "unavailable", ""])
@pytest.mark.parametrize("zone", ZONES)
def test_dry_run_makes_zero_climate_calls(zone, live):
    for source in ("decision", "start", "drift", "hold"):
        res, _ = apply(zone, source=source, live=live, want_mode="heat", want_temp="55.0",
                       cur_mode="off", cur_temp=40.0)
        assert climate_calls(res) == [], (zone, live, source)
        assert [a["action"] for a in res.actions] == ["logbook.log"]
        rec = res.actions[0]
        assert rec["data"]["name"] == "Climate dry run"
        assert rec["data"]["entity_id"] == ent(zone)
        msg = rec["data"]["message"]
        assert zone in msg and "off" in msg and "heat" in msg and source in msg


def test_dry_run_missing_live_entity_is_dry():
    ha = make("main_floor")
    del ha.s["input_boolean.climate_live_control"]
    res = run_actions(APPLY["sequence"], ha, {"zone": "main_floor", "source": "decision"})
    assert climate_calls(res) == [] and res.names() == ["logbook.log"]


def test_dry_run_on_target_is_silent():
    res, _ = apply("main_floor", live="off", want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=70.0)
    assert res.actions == []


# ---- live ----------------------------------------------------------------

@pytest.mark.parametrize("zone", ZONES)
def test_live_setpoint_mismatch_one_set_temperature(zone):
    res, _ = apply(zone, want_mode="heat", want_temp="68.0", cur_mode="heat", cur_temp=65.0)
    calls = climate_calls(res)
    assert [c["action"] for c in calls] == ["climate.set_temperature"]
    assert calls[0]["data"] == {"temperature": 68.0}
    assert calls[0]["target"] == {"entity_id": ent(zone)}
    assert res.names()[-1] == "logbook.log"
    assert res.actions[-1]["data"]["name"] == "Climate set"


def test_live_mode_mismatch_orders_mode_wait_temperature():
    res, _ = apply("main_floor", want_mode="heat", want_temp="70.0", cur_mode="cool", cur_temp=76.0)
    trace = [t["action"] for t in res.trace]
    i = trace.index("climate.set_hvac_mode")
    assert trace[i + 1] == "wait_template"
    assert trace[i + 2] == "climate.set_temperature"
    assert res.actions[[a["action"] for a in res.actions].index("climate.set_hvac_mode")]["data"] == {"hvac_mode": "heat"}


def test_live_mode_wait_timeout_skips_temperature():
    res, _ = apply("main_floor", wait="timeout", want_mode="heat", cur_mode="cool")
    assert "climate.set_hvac_mode" in res.names()
    assert "climate.set_temperature" not in res.names()
    assert res.actions[-1]["data"]["name"] == "Climate set" and "not reached" in res.actions[-1]["data"]["message"]


def test_live_off_mode_does_not_wait_or_set_temperature():
    res, _ = apply("main_floor", want_mode="off", want_temp="unknown", cur_mode="heat", cur_temp=70.0)
    assert [c["action"] for c in climate_calls(res)] == ["climate.set_hvac_mode"]
    assert "wait_template" not in [t["action"] for t in res.trace]


def test_live_stamps_last_write_before_and_after():
    res, _ = apply("jr_suite", want_temp="68.0", cur_mode="heat", cur_temp=60.0)
    names = res.names()
    assert names[0] == "input_datetime.set_datetime"
    assert names[-2] == "input_datetime.set_datetime"
    assert res.actions[0]["target"]["entity_id"] == "input_datetime.climate_jr_suite_last_write"


def test_garage_has_no_last_write():
    res, _ = apply("garage", want_temp="55.0", cur_mode="heat", cur_temp=50.0, zmode="Override")
    assert "input_datetime.set_datetime" not in res.names()
    assert [c["action"] for c in climate_calls(res)] == ["climate.set_temperature"]  # Override exempt


@pytest.mark.parametrize("zone", ZONES)
def test_on_target_zero_actions(zone):
    res, _ = apply(zone, want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=70.0)
    assert res.actions == []
    res, _ = apply(zone, want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=70.4)  # inside 0.5
    assert res.actions == []


def test_missing_current_setpoint_writes():
    res, _ = apply("main_floor", want_mode="heat", want_temp="70.0", cur_mode="heat", cur_temp=None)
    assert [c["action"] for c in climate_calls(res)] == ["climate.set_temperature"]


@pytest.mark.parametrize("zone", RADIANT)
def test_radiant_75_is_written_as_71(zone):
    res, _ = apply(zone, want_mode="heat", want_temp="75.0", cur_mode="heat", cur_temp=60.0)
    assert climate_calls(res)[0]["data"]["temperature"] == 71.0


def test_nest_is_not_reclamped():
    res, _ = apply("main_floor", want_mode="heat", want_temp="75.0", cur_mode="heat", cur_temp=60.0)
    assert climate_calls(res)[0]["data"]["temperature"] == 75.0


@pytest.mark.parametrize("zone", ZONES[:-1])
def test_override_zone_zero_actions(zone):
    for live in ("on", "off"):
        res, _ = apply(zone, zmode="Override", live=live)
        assert res.actions == []


@pytest.mark.parametrize("zone", ZONES)
def test_master_off_zero_actions(zone):
    for live in ("on", "off"):
        res, _ = apply(zone, master="off", live=live)
        assert res.actions == []


@pytest.mark.parametrize("want", ["skip", "unknown", "None"])
def test_skip_or_bad_decision_zero_actions(want):
    res, _ = apply("main_floor", want_mode=want)
    assert res.actions == []


@pytest.mark.parametrize("cur", ["unavailable", "unknown"])
def test_unavailable_thermostat_zero_actions(cur):
    res, _ = apply("main_floor", cur_mode=cur)
    assert res.actions == []


def test_unknown_decision_temperature_never_sets_temperature():
    res, _ = apply("main_floor", want_temp="unknown", want_mode="heat", cur_mode="cool")
    assert "climate.set_temperature" not in res.names()


# ---- re-apply cap ----------------------------------------------------------

@pytest.mark.parametrize("source", ["drift", "hold"])
def test_recent_write_caps_reapply(source):
    res, _ = apply("main_floor", source=source, last_write="2026-11-24 06:50:00",
                   want_temp="70.0", cur_mode="heat", cur_temp=60.0)
    assert climate_calls(res) == []
    assert [a["action"] for a in res.actions] == ["logbook.log"]
    assert res.actions[0]["data"]["name"] == "Climate fight"


@pytest.mark.parametrize("source", ["decision", "start"])
def test_cap_does_not_apply_to_decision_or_start(source):
    res, _ = apply("main_floor", source=source, last_write="2026-11-24 06:55:00",
                   want_temp="70.0", cur_mode="heat", cur_temp=60.0)
    assert len(climate_calls(res)) == 1


def test_old_write_allows_drift():
    res, _ = apply("main_floor", source="drift", last_write="2026-11-24 06:30:00",
                   want_temp="70.0", cur_mode="heat", cur_temp=60.0)
    assert len(climate_calls(res)) == 1


def test_cap_unknown_last_write_allows():
    res, _ = apply("main_floor", source="drift", last_write="unknown",
                   want_temp="70.0", cur_mode="heat", cur_temp=60.0)
    assert len(climate_calls(res)) == 1


# ---- override detection ----------------------------------------------------

def run_override(zone, **kw):
    ha = make(zone, **kw)
    seq = OVERRIDE["actions"]
    return run_actions(seq, ha, {"trigger": {"entity_id": ent(zone)}}), ha


def past(seconds):
    from datetime import datetime, timedelta, timezone
    t = datetime(2026, 11, 24, 7, 0, tzinfo=timezone.utc) - timedelta(seconds=seconds)
    return t.strftime("%Y-%m-%d %H:%M:%S")


def test_override_automation_shape():
    assert OVERRIDE["mode"] == "queued"
    ids = OVERRIDE["triggers"][0]["entity_id"]
    assert len(ids) == 6 and "climate.garage" not in ids
    assert OVERRIDE["triggers"][0]["to"] == ["heat", "cool", "heat_cool", "off"]
    assert OVERRIDE["triggers"][1]["attribute"] == "temperature"
    assert OVERRIDE["triggers"][1]["entity_id"] == ids
    assert "conditions" not in OVERRIDE  # variables + conditions live in actions


def test_override_60s_after_write_is_ignored():
    res, _ = run_override("main_floor", live="on", want_mode="heat", want_temp="70.0",
                          cur_mode="heat", cur_temp=65.0, last_write=past(60))
    assert res.actions == []


def test_override_10_min_after_live_marks_override():
    res, _ = run_override("main_floor", live="on", want_mode="heat", want_temp="70.0",
                          cur_mode="heat", cur_temp=65.0, last_write=past(600))
    assert res.names() == ["input_select.select_option", "logbook.log"]
    assert res.actions[0]["target"] == {"entity_id": "input_select.climate_mode_main_floor"}
    assert res.actions[0]["data"] == {"option": "Override"}


@pytest.mark.parametrize("live", ["off", "unknown", "unavailable"])
def test_override_dry_run_logs_only(live):
    res, _ = run_override("main_floor", live=live, want_mode="heat", want_temp="70.0",
                          cur_mode="off", cur_temp=None, last_write=past(600))
    assert res.names() == ["logbook.log"]
    assert "would mark Override" in res.actions[0]["data"]["message"]


def test_override_equal_values_nothing():
    res, _ = run_override("main_floor", want_mode="heat", want_temp="70.0", cur_mode="heat",
                          cur_temp=70.5, last_write=past(600))
    assert res.actions == []


def test_override_one_degree_boundary():
    res, _ = run_override("main_floor", want_temp="70.0", want_mode="heat", cur_mode="heat",
                          cur_temp=69.0, last_write=past(600))
    assert "input_select.select_option" in res.names()


def test_override_unknown_last_write_is_long_ago():
    res, _ = run_override("main_floor", want_temp="70.0", want_mode="heat", cur_mode="off",
                          cur_temp=None, last_write="unknown")
    assert "input_select.select_option" in res.names()


@pytest.mark.parametrize("kw", [
    {"master": "off"}, {"zmode": "Override"}, {"zmode": "Off"}, {"want_mode": "skip"},
])
def test_override_gates(kw):
    args = dict(want_mode="heat", want_temp="70.0", cur_mode="off", cur_temp=None, last_write=past(600))
    args.update(kw)
    res, _ = run_override("main_floor", **args)
    assert res.actions == []


@pytest.mark.parametrize("zone", RADIANT)
def test_ecobee_preset_home_is_hold_ended_live(zone):
    res, _ = run_override(zone, live="on", want_temp="68.0", want_mode="heat", cur_mode="heat",
                          cur_temp=62.0, preset="home", last_write=past(600))
    assert res.names() == ["script.turn_on"]
    assert res.actions[0]["target"] == {"entity_id": f"script.climate_apply_{zone}"}
    assert res.actions[0]["data"] == {"variables": {"source": "hold"}}


def test_ecobee_preset_home_is_hold_ended_dry():
    res, _ = run_override("jr_suite", live="off", want_temp="68.0", want_mode="heat", cur_mode="heat",
                          cur_temp=62.0, preset="home", last_write=past(600))
    assert res.names() == ["logbook.log"]
    assert "hold ended" in res.actions[0]["data"]["message"]
    assert climate_calls(res) == []


def test_ecobee_active_hold_is_override():
    res, _ = run_override("jr_suite", live="on", want_temp="68.0", want_mode="heat", cur_mode="heat",
                          cur_temp=72.0, preset="temp", last_write=past(600))
    assert res.names() == ["input_select.select_option", "logbook.log"]


def test_ecobee_mode_change_is_override_not_hold():
    res, _ = run_override("jr_suite", live="on", want_temp="68.0", want_mode="heat", cur_mode="off",
                          cur_temp=None, preset="home", last_write=past(600))
    assert "input_select.select_option" in res.names()


def test_nest_never_takes_hold_path():
    res, _ = run_override("main_floor", live="on", want_temp="70.0", want_mode="heat", cur_mode="heat",
                          cur_temp=60.0, preset="home", last_write=past(600))
    assert "script.turn_on" not in res.names()


# ---- drift check -----------------------------------------------------------

def drift(trigger_id, live):
    ha = FakeHA({"input_boolean.climate_automations": "on", "input_boolean.climate_live_control": live})
    from smart_climate_harness import Interpreter
    it = Interpreter(ha, {"trigger": {"id": trigger_id}})
    return it.run(DRIFT["conditions"] + DRIFT["actions"])


def test_drift_tick_only_when_live():
    for live in ("off", "unknown", "unavailable"):
        assert drift("tick", live).actions == []
    res = drift("tick", "on")
    assert res.actions[0]["data"] == {"variables": {"source": "drift"}}
    assert len(res.actions[0]["target"]["entity_id"]) == 7


def test_drift_start_paths_run_in_dry_run():
    res = drift("start", "off")
    assert res.actions[0]["data"] == {"variables": {"source": "start"}}


def test_drift_triggers():
    trig = DRIFT["triggers"]
    assert trig[0]["trigger"] == "time_pattern" and trig[0]["minutes"] == "/30"
    kinds = {(t["trigger"], t.get("event") or t.get("event_type") or t.get("entity_id")) for t in trig}
    assert ("homeassistant", "start") in kinds
    assert ("event", "automation_reloaded") in kinds
    assert ("state", "input_boolean.climate_automations") in kinds
    assert ("state", "input_boolean.climate_live_control") in kinds


def test_decision_change_automation():
    a = load("packages/climate/smart/control/climate_apply_on_decision_change.yaml")["automation"][0]
    assert len(a["triggers"][0]["entity_id"]) == 7 and a["triggers"][0]["for"] == {"seconds": 30}
    assert a["actions"][0]["data"] == {"variables": {"source": "decision"}}


# ---- wrappers & hygiene ------------------------------------------------------

@pytest.mark.parametrize("zone", ZONES)
def test_wrapper_scripts(zone):
    f = load(f"packages/climate/smart/scripts/climate_apply_{zone}.yaml")["script"][f"climate_apply_{zone}"]
    assert f["mode"] == "queued" and f["max"] == 3 and "source" in f["fields"]
    step = f["sequence"][0]
    assert step["action"] == "script.climate_apply_zone"
    assert step["data"]["zone"] == zone


def test_apply_zone_mode():
    assert APPLY["mode"] == "parallel" and APPLY["max"] == 10 and set(APPLY["fields"]) == {"zone", "source"}


def test_no_set_preset_mode_anywhere():
    files = list(SMART.rglob("*")) + [REPO / "custom_templates" / "climate_control.jinja"]
    for f in files:
        if f.is_file():
            assert "set_preset_mode" not in f.read_text(), f


def test_apply_zone_uses_only_allowed_constructs():
    allowed = {"variables", "condition", "if", "then", "else", "stop", "wait_template", "action",
               "alias", "timeout", "continue_on_timeout", "target", "data", "entity_id",
               "value_template", "state"}
    def walk(seq):
        for st in seq:
            keys = set(st) & {"variables", "condition", "if", "stop", "wait_template", "action"}
            assert keys, st
            if "if" in st:
                walk(st["then"]); walk(st.get("else", []))
    walk(APPLY["sequence"])


def test_new_files_have_headers_and_unique_basenames():
    names = []
    for f in list((SMART / "scripts").glob("climate_apply_*.yaml")) + list((SMART / "control").glob("*.yaml")) + list((SMART / "override").glob("*.yaml")):
        text = f.read_text()
        assert text.startswith("# ") and len(text) > 100, f
        names.append(f.name)
        doc = load(str(f.relative_to(REPO)))
        item = (doc.get("automation") or [None])[0]
        if item:
            assert item["id"] == f.stem and item["alias"].startswith("Climate - ")
        else:
            (sid, cfg), = doc["script"].items()
            assert sid == f.stem and cfg["alias"].startswith("Climate - ")
    assert len(names) == len(set(names)) == 11
    for n in names:
        assert len(list((REPO / "packages").rglob(n))) == 1
