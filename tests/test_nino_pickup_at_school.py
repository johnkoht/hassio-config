"""JK-65: Nino's pickup reminder only announces when he is at school."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
PATH = REPO / "packages/school/reminders/nino_pickup_reminder.yaml"


def test_pickup_gated_on_at_school_and_keeps_channels():
    auto = yaml.safe_load(PATH.read_text())["automation"][0]
    assert any(c.get("condition") == "state"
               and c.get("entity_id") == "binary_sensor.nino_at_school"
               and c.get("state") == "on" for c in auto["conditions"])
    actions = [a["action"] for a in auto["actions"]]
    assert actions == ["script.voice_announcement", "script.general_notification"]
