"""
Nino medication: skip a dose (JK-1168 amendment).

A skipped dose is not taken, uses no supply, and stops that dose's reminders and
escalation. Every reader of "is this dose open?" is pinned by name so a half
migration goes red. Reads repo files only (no HA).
"""
import re
import sys
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))

from nino_med_harness import (  # noqa: E402
    MED, REPO, Ha, at, escalation_auto, load, reminder_auto, reminder_pkg,
    script, sensor, strings, walk, world,
)

POSITIVE = "not is_state({b}, 'on')"


def _text(name):
    return "\n".join(l for l in (MED / name).read_text().splitlines() if not l.strip().startswith("#"))


# --- every reader is migrated, in the fail-open form -------------------------

def test_no_skipped_check_uses_the_fail_closed_off_form():
    bad = []
    for f in list(MED.glob("*.yaml")) + [REPO / "dashboards/templates/button_cards/people/nino.yaml"]:
        text = f.read_text()
        for m in re.finditer(r"is_state\([^)]*_skipped[^)]*,\s*'off'\)", text):
            bad.append((f.name, m.group(0)))
    assert not bad, bad
    for n in "12":
        card = (REPO / f"dashboards/kohbo/shared/notifications/nino_med_reminder_{n}.yaml").read_text()
        assert f"input_boolean.nino_medication_{n}_skipped\n    state_not: \"on\"" in card


def test_reminder_conditions_and_every_in_run_guard_require_not_skipped():
    auto = reminder_auto()
    cond_templates = [c.get("value_template", "") for c in auto["conditions"]]
    assert any(POSITIVE.format(b="skipped_boolean") in t for t in cond_templates)
    # every `if:` that guards on the taken boolean (voice, pre-wait timer, push, Snooze branch)
    guards = [n["if"] for n in walk(auto["actions"])
              if isinstance(n, dict) and "if" in n
              and any("is_state(taken_boolean, 'off')" in str(c) for c in n["if"])]
    assert len(guards) == 4
    for g in guards:
        assert any(POSITIVE.format(b="skipped_boolean") in str(c) for c in g), g


def test_reminder_wait_ends_on_a_skip():
    wait = [n for n in walk(reminder_auto()["actions"]) if isinstance(n, dict) and "wait_for_trigger" in n][0]
    skipped = [t for t in wait["wait_for_trigger"] if t.get("id") == "skipped"]
    assert skipped and "is_state(skipped_boolean, 'on')" in skipped[0]["value_template"]


def test_skipped_boolean_variable_names_the_right_dose():
    assert reminder_auto()["variables"]["skipped_boolean"] == "input_boolean.nino_medication_{{ dose }}_skipped"


def test_both_escalation_branches_require_not_skipped():
    branches = escalation_auto()["actions"]
    for n, branch in zip("12", branches):
        t = branch["if"][0]["value_template"]
        assert POSITIVE.format(b=f"'input_boolean.nino_medication_{n}_skipped'") in t


def test_taken_script_fallback_ignores_a_skipped_dose():
    t = script("nino_medication_taken")["variables"]["resolved_dose"]
    for n in "12":
        assert f"not is_state('input_boolean.nino_medication_{n}_skipped', 'on')" in t


def test_pending_sensor_and_the_reset_know_about_skips():
    t = sensor("Nino Medication Pending Dose")["state"]
    for n in "12":
        assert f"not is_state('input_boolean.nino_medication_{n}_skipped', 'on')" in t
    reset = [a for a in reminder_pkg()["automation"] if a["id"] == "nino_medication_reminder_reset"][0]
    cleared = {e for act in reset["actions"] if act.get("action") == "input_boolean.turn_off"
               for e in act["target"]["entity_id"]}
    assert {"input_boolean.nino_medication_1_skipped", "input_boolean.nino_medication_2_skipped"} <= cleared


def test_skipped_helpers_have_no_initial():
    for n in "12":
        h = reminder_pkg()["input_boolean"][f"nino_medication_{n}_skipped"]
        assert "initial" not in h


# --- behaviour ---------------------------------------------------------------

SK1 = {"input_boolean.nino_medication_1_skipped": "on"}
SK2 = {"input_boolean.nino_medication_2_skipped": "on"}


def test_pending_dose_ignores_a_skipped_dose():
    assert world("mon", "<time>", "on", **SK1)[2] == "none"       # dose 1 skipped, dose 2 not due
    assert world("mon", "<time>", "on", **SK1)[2] == "2"
    assert world("mon", "<time>", "on", **SK2)[2] == "1"          # dose 2 skipped, dose 1 still open
    assert world("mon", "<time>", "on", **SK1, **SK2)[2] == "none"
    # taken is not skipped: a taken dose 1 leaves dose 2 pending
    assert world("mon", "<time>", "on", **{"input_boolean.nino_medication_1_taken": "on"})[2] == "2"


def test_a_snoozing_skipped_dose_is_not_in_play():
    assert world("mon", "<time>", "on", **SK1, **{"timer.nino_medication_1_timer": "active"})[2] == "none"


def test_fail_open_when_the_skipped_helper_is_unavailable():
    un = {"input_boolean.nino_medication_1_skipped": "unavailable"}
    assert world("mon", "<time>", "on", **un)[2] == "1"
    ha = Ha({"input_boolean.nino_medication_1_skipped": "unavailable"}, at("mon", "<time>"))
    cond = [c for c in reminder_auto()["conditions"] if "skipped_boolean" in c.get("value_template", "")][0]
    assert ha.render(cond["value_template"], skipped_boolean="input_boolean.nino_medication_1_skipped") == "True"


def _resolved(dose, now_day, hhmm, **overrides):
    ha, _, pending = world(now_day, hhmm, "on", **overrides)
    ha.states["sensor.nino_medication_pending_dose"] = pending
    return ha.render(script("nino_medication_taken")["variables"]["resolved_dose"], dose=dose)


def test_taken_fallback_never_picks_a_skipped_dose_but_an_explicit_dose_wins():
    assert _resolved("", "mon", "<time>", **SK1) == "2"            # dose 2 due: dose 1 skipped is passed over
    assert _resolved("", "mon", "06:00", **SK1, **SK2) == "none"
    assert _resolved("1", "mon", "06:00", **SK1) == "1"           # explicit taken still wins


def _esc(n, day, hhmm, **overrides):
    ha, _, _ = world(day, hhmm, "on", **overrides)
    return ha.render(escalation_auto()["actions"][int(n) - 1]["if"][0]["value_template"]) == "True"


def test_escalation_does_not_fire_for_a_skipped_dose():
    assert _esc(1, "mon", "<time>")
    assert not _esc(1, "mon", "<time>", **SK1)
    assert _esc(2, "mon", "<time>")
    assert not _esc(2, "mon", "<time>", **SK2)


def test_skip_script_only_acts_on_a_dose_not_taken():
    s = script("nino_medication_skip")
    cond = s["sequence"][0]["value_template"]
    ha = Ha({"input_boolean.nino_medication_1_taken": "off", "input_boolean.nino_medication_2_taken": "on"},
            at("mon", "<time>"))
    assert ha.render(cond, dose="1") == "True"
    assert ha.render(cond, dose="2") == "False"
    assert ha.render(cond, dose="3") == "False"
    assert s["sequence"][1]["action"] == "input_boolean.turn_on"
    assert s["fields"]["dose"]["required"] is True


# --- supply is untouched -----------------------------------------------------

@pytest.mark.parametrize("n", ["1", "2"])
def test_stock_decrement_ignores_skips(n):
    path = REPO / f"packages/people/nino/medication_refill/nino_medication_{n}_stock_decrement.yaml"
    assert "skipped" not in path.read_text()
    trig = yaml.safe_load(path.read_text())["automation"][0]["triggers"][0]
    assert trig["entity_id"] == f"input_boolean.nino_medication_{n}_taken"
    assert (trig["from"], trig["to"]) == ("off", "on")


def test_no_stock_file_reads_skipped():
    for f in (REPO / "packages").rglob("*.yaml"):
        if "medication_refill" in str(f):
            assert "skipped" not in f.read_text(), f


# --- the helper automations --------------------------------------------------

def _auto(name):
    return load(name)["automation"][0]


def test_cleanup_cancels_the_timer_and_clears_both_pushes():
    a = _auto("nino_medication_skipped.yaml")
    assert {(t["entity_id"], t["id"]) for t in a["triggers"]} == {
        ("input_boolean.nino_medication_1_skipped", "1"), ("input_boolean.nino_medication_2_skipped", "2")}
    assert all((t["from"], t["to"]) == ("off", "on") for t in a["triggers"])
    acts = a["actions"]
    assert acts[0]["action"] == "timer.cancel"
    assert acts[0]["target"]["entity_id"] == "timer.nino_medication_{{ trigger.id }}_timer"
    tags = {x["data"]["tag"] for x in acts if x["action"] == "script.clear_notifications"}
    assert tags == {"nino-medication-dose-{{ trigger.id }}", "nino-medication-escalation-{{ trigger.id }}"}


def test_taken_clears_skip_for_both_doses():
    a = _auto("nino_medication_taken_clears_skip.yaml")
    assert {(t["entity_id"], t["id"]) for t in a["triggers"]} == {
        ("input_boolean.nino_medication_1_taken", "1"), ("input_boolean.nino_medication_2_taken", "2")}
    assert all((t["from"], t["to"]) == ("off", "on") for t in a["triggers"])
    assert a["actions"][0]["action"] == "input_boolean.turn_off"
    assert a["actions"][0]["target"]["entity_id"] == "input_boolean.nino_medication_{{ trigger.id }}_skipped"


def _unskip_passes(dose, hhmm, **states):
    a = _auto("nino_medication_unskipped.yaml")
    ha, _, _ = world("mon", hhmm, "on", **states)
    ha.states.setdefault("input_boolean.nino_medication_reminders", "on")
    for c in a["conditions"]:
        if c["condition"] == "state":
            if ha.states.get(c["entity_id"]) != c["state"]:
                return False
        elif ha.render(c["value_template"], trigger={"id": dose}) != "True":
            return False
    return True


def test_unskip_restarts_only_a_due_untaken_idle_dose():
    base = {"input_boolean.nino_medication_reminders": "on"}
    assert _unskip_passes("1", "<time>", **base)
    assert not _unskip_passes("1", "<time>", **base)                                    # not due yet
    assert not _unskip_passes("1", "<time>", **base, **{"input_boolean.nino_medication_1_taken": "on"})
    assert not _unskip_passes("1", "<time>", **base, **{"timer.nino_medication_1_timer": "active"})
    assert not _unskip_passes("1", "<time>", **{"input_boolean.nino_medication_reminders": "off"})
    assert _unskip_passes("2", "<time>", **base)
    assert not _unskip_passes("2", "<time>", **base)
    a = _auto("nino_medication_unskipped.yaml")
    assert a["actions"][0]["action"] == "timer.start" and a["actions"][0]["data"]["duration"] == "00:01:00"


def _skip_gate(dose, **states):
    a = _auto("nino_medication_push_skip.yaml")
    ha, _, pending = world("mon", "<time>", "on", **states)
    ha.states["sensor.nino_medication_pending_dose"] = pending
    return ha.render(a["conditions"][0]["value_template"], trigger={"id": dose}) == "True"


def test_push_skip_acts_only_on_an_outstanding_dose():
    assert _skip_gate("1")                                   # dose 1 pending at <time>
    assert not _skip_gate("2")                               # dose 2 not due: yesterday's push
    assert _skip_gate("2", **{"input_boolean.nino_medication_2_escalated": "on"})
    a = _auto("nino_medication_push_skip.yaml")
    assert a["actions"][0]["action"] == "script.nino_medication_skip"
    assert a["actions"][0]["data"]["dose"] == "{{ trigger.id }}"


# --- the pushes and their handlers ------------------------------------------

def test_both_pushes_offer_skip_with_a_fixed_id_and_the_ids_have_handlers():
    handlers = {}
    for name in ("nino_medication_push_action.yaml", "nino_medication_push_skip.yaml"):
        for t in _auto(name)["triggers"]:
            assert t["event_data"]["action"] not in handlers, "an action id has two handlers"
            handlers[t["event_data"]["action"]] = (name, t["id"])
    # reminder push
    acts = [a for n in walk(reminder_auto()["actions"]) if isinstance(n, dict)
            and n.get("action") == "script.general_notification" for a in n["data"]["actions"]]
    skip = [a for a in acts if a["title"] == "Skip Dose"]
    assert skip and skip[0]["action"] == "{{ action_skip }}"
    assert reminder_auto()["actions"] and any(
        v == "NINO_MEDICATION_SKIP_{{ dose }}" for n in walk(reminder_auto()["actions"])
        if isinstance(n, dict) and "variables" in n for v in n["variables"].values())
    # escalation pushes
    for n, branch in zip("12", escalation_auto()["actions"]):
        ids = [a["action"] for a in branch["then"][0]["data"]["data"]["actions"]]
        assert f"NINO_MEDICATION_SKIP_{n}" in ids and f"NINO_MEDICATION_TAKEN_{n}" in ids
        for i in ids:
            file, dose = handlers[i]
            assert dose == n
            assert file == ("nino_medication_push_skip.yaml" if "SKIP" in i else "nino_medication_push_action.yaml")


def test_popup_cards_hide_a_skipped_dose_and_offer_skip():
    for n in "12":
        card = yaml.safe_load((REPO / f"dashboards/kohbo/shared/notifications/nino_med_reminder_{n}.yaml").read_text())
        assert {"condition": "state", "entity": f"input_boolean.nino_medication_{n}_skipped", "state_not": "on"} in card["conditions"]
        subs = card["card"]["sub_button"]
        assert any(s["tap_action"].get("perform_action") == "script.nino_medication_skip"
                   and s["tap_action"]["data"]["dose"] == n for s in subs)


# --- JK-1259: an early Alexa phrase after a dose 1 skip must not mark dose 2 ----

def test_taken_fallback_waits_for_dose_2_to_be_due():
    assert _resolved("", "mon", "06:00", **SK1) == "none"         # nothing due, dose 1 skipped
    assert _resolved("", "mon", "<time>", **SK1) == "none"         # dose 2 not due yet
    assert _resolved("", "mon", "<time>", **SK1) == "2"            # dose 2 due
    assert _resolved("", "mon", "<time>", **SK1, **{"timer.nino_medication_2_timer": "active"}) == "2"  # snoozing = pending
    assert _resolved("", "mon", "06:00") == "1"                   # an early dose 1 is still marked first
    assert _resolved("", "mon", "<time>", **{"input_boolean.nino_medication_1_taken": "on"}) == "2"  # dose 1 given: an early dose 2 still counts
