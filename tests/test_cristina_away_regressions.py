"""
Regression tests for the Cristina-away morning fixes.

Renders Gianluca's departure template with real Jinja2 and stubbed HA
helpers, and checks the morning brief gates person-directed lines on home.
"""
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
MIDNIGHT = datetime(2026, 10, 15, tzinfo=timezone.utc)
NORMAL = 10 * 3600  # arbitrary fixture times, not the real schedule
LATE = 11 * 3600


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def departure_template():
    content = yaml.load((REPO / "packages/school/kids/gianluca_school.yaml").read_text(), Loader=_Loader)
    sensors = content["template"][0]["sensor"]
    return next(s for s in sensors if s["unique_id"] == "gianluca_departure_time")["state"]


def render_departure(home_state, last_changed, late_secs=LATE):
    attrs = {
        "input_datetime.parochial_school_departure_time": NORMAL,
        "input_datetime.parochial_school_late_departure_time": late_secs,
    }
    env = Environment()
    env.globals.update(
        today_at=lambda t="00:00": MIDNIGHT,
        timedelta=timedelta,
        state_attr=lambda e, a: attrs.get(e),
        states=SimpleNamespace(input_boolean=SimpleNamespace(
            cristina_home=SimpleNamespace(state=home_state, last_changed=last_changed))),
    )
    return env.from_string(departure_template()).render().strip()


def at(secs):
    return (MIDNIGHT + timedelta(seconds=secs)).isoformat()


@pytest.mark.parametrize("home_state,last_changed,late_secs,expected", [
    # Home: normal departure
    ("on", MIDNIGHT - timedelta(days=1), LATE, NORMAL),
    # Out of town: late time
    ("off", MIDNIGHT - timedelta(days=2), LATE, LATE),
    # Out of town but late time never set: fall back to normal
    ("off", MIDNIGHT - timedelta(days=2), 0, NORMAL),
    # She just left with him: must not re-arm the reminders at the late time
    ("off", MIDNIGHT + timedelta(seconds=NORMAL - 120), LATE, NORMAL),
])
def test_gianluca_departure_follows_cristina_home(home_state, last_changed, late_secs, expected):
    assert render_departure(home_state, last_changed, late_secs) == at(expected)


def test_morning_brief_gates_cristina_lines_on_home():
    text = (REPO / "packages/reminders/morning_update.yaml").read_text()
    office_gates = re.findall(r"{% if is_state\('input_boolean\.cristina_office_day'.*?%}", text)
    assert len(office_gates) == 2
    for gate in office_gates:
        assert "input_boolean.cristina_home" in gate
    assert re.search(r"today == '05-12' and is_state\('input_boolean\.cristina_home', 'on'\)", text)
    assert re.search(r"today == '06-16' and is_state\('input_boolean\.john_home', 'on'\)", text)
