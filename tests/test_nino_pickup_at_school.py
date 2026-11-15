"""JK-65: Nino's pickup reminder only announces when his drop-off latched today."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
PATH = REPO / "packages/school/reminders/nino_pickup_reminder.yaml"


def _auto():
    return yaml.safe_load(PATH.read_text())["automation"][0]


def test_pickup_gated_on_dropoff_latch_and_keeps_channels():
    auto = _auto()
    gate = [c for c in auto["conditions"] if c.get("condition") == "template"]
    assert len(gate) == 1
    tpl = gate[0]["value_template"]
    assert "input_boolean.nino_dropped_off" in tpl and "today_at('00:00')" in tpl
    actions = [a["action"] for a in auto["actions"]]
    assert actions == ["script.voice_announcement", "script.general_notification"]


def test_gate_does_not_depend_on_dismissal_window():
    """at_school ends at dismissal; with a 0 lead the gate must not race it."""
    text = yaml.dump(_auto()["conditions"])
    assert "nino_at_school" not in text and "dismissal" not in text
