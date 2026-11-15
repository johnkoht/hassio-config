"""
Focus-mode sensor when the work calendar is `unknown` (JK-1250).

With no calendar the sensor must skip the calendar attributes and fall back to
time of day: Deep Work before 2pm on a workday, Tinkering from 7pm, else Task Mode.
Renders the real template with Jinja2 against stubbed HA helpers.
"""
from datetime import datetime, timezone
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
SENSOR = REPO / "packages/people/john/focus_mode/calendar_focus_mode_sensor.yaml"
TEMPLATE = yaml.safe_load(SENSOR.read_text())["template"][0]["sensor"][0]["state"]


def render(calendar, hour, workday, attrs=None):
    now = datetime(2026, 1, 7, hour, 30, tzinfo=timezone.utc)
    attrs = attrs or {}
    states = {"calendar.john_work": calendar,
              "binary_sensor.workday_sensor": "on" if workday else "off"}
    return " ".join(Environment().from_string(TEMPLATE).render(
        now=lambda: now,
        states=lambda e: states.get(e, "unknown"),
        state_attr=lambda e, a: attrs.get(a),
        is_state=lambda e, s: states.get(e) == s,
        as_timestamp=lambda d: d.timestamp() if hasattr(d, "timestamp") else 0,
    ).split())


@pytest.mark.parametrize("hour,workday,expected", [
    (9, True, "Deep Work"),
    (9, False, "Task Mode"),
    (13, True, "Deep Work"),
    (14, True, "Task Mode"),
    (16, False, "Task Mode"),
    (19, True, "Tinkering"),
    (22, False, "Tinkering"),
])
def test_unknown_calendar_falls_back_to_time_of_day(hour, workday, expected):
    assert render("unknown", hour, workday) == expected


def test_unknown_calendar_ignores_stale_attributes():
    # A stale message/start_time must not be read while the calendar is unknown.
    stale = {"message": "GSD block", "start_time": "2026-01-07 10:00:00"}
    assert render("unknown", 15, True, stale) == "Task Mode"
    assert render("unknown", 9, True, stale) == "Deep Work"


def test_active_gsd_event_still_wins_over_fallback():
    assert render("on", 9, False, {"message": "GSD block"}) == "Deep Work"
