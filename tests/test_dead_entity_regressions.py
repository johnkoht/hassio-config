"""
Regression tests for references to entities or options that don't exist live.

Reads repo files relative to this test, so it runs on a dev machine.
"""
import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parent.parent
BDAY = "packages/reminders/birthdays/birthday_reminder/"

# (file, new name present, regex that must be absent)
CASES = [
    ("automation/people/people_reload_just_left.yaml",
     "input_select.cristina_status_dropdown", r"cristina_falbo_status_dropdown"),
    ("packages/weather/tempest_alerts/tempest_high_uv_alert.yaml",
     "sensor.tempest_uv_index", r"sensor\.tempest_uv(?!_index)"),
    ("packages/weather/severe_weather_alert/nws_alerts_active.yaml",
     "sensor.nws_alerts", r"nws_alerts_sensor"),
    (BDAY + "birthday_today_reminder.yaml", "calendar.birthdays", r"birthdays_2"),
    (BDAY + "birthday_tomorrow.yaml", "calendar.birthdays", r"birthdays_2"),
    (BDAY + "birthday_tomorrow_reminder.yaml", "calendar.birthdays", r"birthdays_2"),
    ("packages/ninos_room/ninos_bathroom_heater.yaml", "group.family", r"group\.familiy"),
    ("packages/ninos_room/ninos_bedroom_heater.yaml", "group.family", r"group\.familiy"),
    ("automation/gianlucas_room/gianluca_heater_on_upon_arrival.yaml",
     "group.family", r"group\.familiy"),
    ("packages/foyer/modes/foyer_mode_off.yaml", 'to: "Bedtime"', r'to: "bedtime"'),
]


@pytest.mark.parametrize("path,new,old", CASES)
def test_reference_uses_live_name(path, new, old):
    text = (REPO / path).read_text()
    assert new in text
    assert not re.search(old, text)


def test_no_familiy_group_anywhere_in_config():
    for d in ("packages", "automation"):
        for f in (REPO / d).rglob("*.yaml"):
            assert "group.familiy" not in f.read_text(), f
