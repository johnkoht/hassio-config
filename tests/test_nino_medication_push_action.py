"""
Nino medication push: the quick action must have a handler (JK-1257).

The critical escalation push used to carry no actions at all, and the
reminder's ids (TAKEN_<run context>) are only heard by that run's
wait_for_trigger for 15 minutes. The escalation now sends fixed ids that a
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


def _handler_ids():
    """{event action id: dose} from every nino_medication_push_action trigger."""
    autos = _load("nino_medication_push_action.yaml")
    ids = {}
    for auto in autos:
        for t in auto["triggers"]:
            if t.get("event_type") == "mobile_app_notification_action":
                ids[t["event_data"]["action"]] = t["id"]
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
        assert handlers[action_id] == dose, "the handler marks the wrong dose"


def test_handler_marks_the_dose_taken_and_clears_the_push():
    auto = _load("nino_medication_push_action.yaml")[0]
    taken = auto["actions"][0]
    assert taken["action"] == "script.nino_medication_taken"
    assert taken["data"]["dose"] == "{{ trigger.id }}"
    clear = auto["actions"][1]["data"]
    assert clear["tag"] == "nino-medication-escalation-{{ trigger.id }}"
    for dose, data in _escalation_pushes().items():
        assert data["tag"] == f"nino-medication-escalation-{dose}"


def test_handler_has_no_conditions_so_a_late_tap_still_works():
    auto = _load("nino_medication_push_action.yaml")[0]
    assert auto.get("conditions") == []
    assert auto["mode"] == "queued"


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
