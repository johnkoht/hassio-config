"""
Nino medication push: the quick action must have a handler (JK-1257).

The critical escalation push used to carry no actions at all, and the
reminder's ids (TAKEN_<run context>) were only heard by that run's
wait_for_trigger for 15 minutes (JK-1259). Both pushes now send fixed ids that a
standalone automation always listens for. Reads repo files only.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
MED = REPO / "packages/people/nino/medication_reminder"
LINK = "/dashboard-kohbo/home#notifications"


def _load(name):
    return yaml.safe_load((MED / name).read_text())["automation"]


def _escalation_pushes():
    """{dose: notify data} for each escalation branch that sends a push."""
    out = {}
    for auto in _load("nino_medication_escalation.yaml"):
        for step in auto["actions"]:
            for act in step.get("then", []):
                if act.get("action") == "notify.ios_family":
                    dose = "1" if "Dose 1" in act["data"]["message"] else "2"
                    out[dose] = act["data"]["data"]
    return out


HANDLER_FILES = ("nino_medication_push_action.yaml", "nino_medication_push_skip.yaml")


def _handler_ids():
    """{event action id: (handler file, dose)}; an id handled twice is an error."""
    ids = {}
    for name in HANDLER_FILES:
        for auto in _load(name):
            for t in auto["triggers"]:
                if t.get("event_type") == "mobile_app_notification_action":
                    action_id = t["event_data"]["action"]
                    assert action_id not in ids, f"{action_id} is handled by two automations"
                    ids[action_id] = (name, t["id"])
    return ids


@pytest.mark.parametrize("dose", ["1", "2"])
def test_critical_push_carries_a_taken_action_with_a_handler(dose):
    """The mismatch behind JK-1257: an action id nobody listens for does nothing."""
    data = _escalation_pushes()[dose]
    assert data["push"]["interruption-level"] == "critical"
    ids = [a["action"] for a in data.get("actions", [])]
    assert ids, "the critical push has no quick action to tap"
    handlers = _handler_ids()
    for action_id in ids:
        assert action_id in handlers, f"{action_id} is sent but no automation handles it"
        file, handled_dose = handlers[action_id]
        assert handled_dose == dose, "the handler marks the wrong dose"
        # Taken ids belong to the taken handler, Skip ids to the skip handler
        want = HANDLER_FILES[1] if "SKIP" in action_id else HANDLER_FILES[0]
        assert file == want, f"{action_id} is wired to {file}, not {want}"


def test_handler_marks_the_dose_taken_and_clears_the_push():
    auto = _load("nino_medication_push_action.yaml")[0]
    taken = auto["actions"][0]
    assert taken["action"] == "script.nino_medication_taken"
    assert taken["data"]["dose"] == "{{ trigger.id }}"
    clear = auto["actions"][1]["data"]
    assert clear["tag"] == "nino-medication-escalation-{{ trigger.id }}"
    for dose, data in _escalation_pushes().items():
        assert data["tag"] == f"nino-medication-escalation-{dose}"


def test_handler_ignores_a_tap_on_a_previous_days_push():
    """The ids never expire, so the handler gates on today's escalated flag (cleared at 3am)."""
    auto = _load("nino_medication_push_action.yaml")[0]
    assert auto["mode"] == "queued"
    (cond,) = auto["conditions"]
    assert "input_boolean.nino_medication_' ~ trigger.id ~ '_escalated" in cond["value_template"]
    assert "'on'" in cond["value_template"]
    reset = [a for a in _load("nino_medication_reminder.yaml") if a["id"] == "nino_medication_reminder_reset"][0]
    cleared = [e for act in reset["actions"] if act.get("action") == "input_boolean.turn_off"
               for e in act["target"]["entity_id"]]
    assert {"input_boolean.nino_medication_1_escalated",
            "input_boolean.nino_medication_2_escalated"} <= set(cleared)


@pytest.mark.parametrize("dose", ["1", "2"])
def test_critical_push_opens_home_notifications(dose):
    data = _escalation_pushes()[dose]
    assert data["url"] == LINK and data["clickAction"] == LINK


def test_reminder_push_opens_home_notifications():
    auto = [a for a in _load("nino_medication_reminder.yaml") if a["id"] == "nino_medication_reminder"][0]
    pushes = []

    def walk(node):
        if isinstance(node, dict):
            if node.get("action") == "script.general_notification":
                pushes.append(node["data"])
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(auto["actions"])
    assert pushes and all(p["url"] == LINK for p in pushes)


def test_the_escalation_still_bypasses_the_notification_level():
    """Staying a direct notify call is deliberate (see its header)."""
    text = (MED / "nino_medication_escalation.yaml").read_text()
    assert "script.general_notification" not in text.replace("# ", "").split("automation:")[1]


# --- JK-1259: the reminder's Taken button no longer expires ------------------

import sys  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parent))
from nino_med_harness import reminder_auto, walk, world  # noqa: E402


def test_reminder_taken_id_is_fixed_per_dose_and_handled():
    variables = {k: v for n in walk(reminder_auto()["actions"]) if isinstance(n, dict) and "variables" in n
                 for k, v in n["variables"].items()}
    assert variables["action_taken"] == "NINO_MEDICATION_TAKEN_{{ dose }}"
    assert "context" not in variables["action_taken"]
    assert {"NINO_MEDICATION_TAKEN_1", "NINO_MEDICATION_TAKEN_2"} <= set(_handler_ids())


def test_reminder_wait_no_longer_listens_for_a_per_run_taken_id():
    wait = [n for n in walk(reminder_auto()["actions"]) if isinstance(n, dict) and "wait_for_trigger" in n][0]
    assert [t["id"] for t in wait["wait_for_trigger"]] == ["taken", "snooze", "skipped"]


def _gate(dose, hhmm="08:00", **states):
    a = _load("nino_medication_push_action.yaml")[0]
    ha, _, pending = world("mon", hhmm, "on", **states)
    ha.states["sensor.nino_medication_pending_dose"] = pending
    return ha.render(a["conditions"][0]["value_template"], trigger={"id": dose}) == "True"


def test_handler_acts_on_a_pending_dose_from_a_reminder_tap():
    assert _gate("1")                                        # dose 1 pending, never escalated
    assert not _gate("2")                                    # dose 2 not due: yesterday's push


def test_handler_acts_on_an_escalated_dose_even_when_not_pending():
    assert _gate("2", **{"input_boolean.nino_medication_2_escalated": "on"})


def test_handler_ignores_a_taken_or_skipped_dose():
    assert not _gate("1", **{"input_boolean.nino_medication_1_taken": "on"})
    assert not _gate("1", **{"input_boolean.nino_medication_1_skipped": "on"})
    esc = "input_boolean.nino_medication_1_escalated"
    assert not _gate("1", **{esc: "on", "input_boolean.nino_medication_1_taken": "on"})
    assert not _gate("1", **{esc: "on", "input_boolean.nino_medication_1_skipped": "on"})


def test_handler_ignores_a_tap_before_the_dose_is_due():
    assert not _gate("1", "06:00")


def test_handler_clears_the_reminder_push_too():
    tags = {a["data"]["tag"] for a in _load("nino_medication_push_action.yaml")[0]["actions"]
            if a.get("action") == "script.clear_notifications"}
    assert tags == {"nino-medication-escalation-{{ trigger.id }}", "nino-medication-dose-{{ trigger.id }}"}
