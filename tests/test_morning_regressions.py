"""
Regression tests for the morning brief and Gianluca's departure.

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


def brief_prompt():
    content = yaml.load((REPO / "packages/reminders/morning_update.yaml").read_text(), Loader=_Loader)
    steps = content["script"]["morning_update_announcement"]["sequence"]
    return next(st for st in steps if st.get("action") == "conversation.process")["data"]["text"]


def brief_section(title):
    text = brief_prompt()
    start = text.index(f"### {title}")
    return text[start:text.index("---", start)]


def render(template, home=("cristina", "john"), states=None, holidays=None, today="2027-05-09"):
    env = Environment(extensions=["jinja2.ext.loopcontrols"])
    env.filters["float"] = lambda v, d=0: float(v) if str(v).replace(".", "", 1).isdigit() else d
    env.tests["search"] = lambda v, pat: re.search(pat, str(v)) is not None
    states = states or {}
    env.globals.update(
        now=lambda: datetime.fromisoformat(today),
        is_state=lambda e, s: s == "on" and any(e == f"input_boolean.{p}_home" for p in home),
        has_value=lambda e: states.get(e) not in (None, "unknown", "unavailable"),
        states=lambda e: states.get(e, "unknown"),
    )
    ctx = {} if holidays is None else {"holidays": {"calendar.holidays_in_united_states": {"events": holidays}}}
    return " ".join(env.from_string(template).render(**ctx).split())


def test_morning_brief_gates_cristina_lines_on_home():
    text = brief_prompt()
    office_gates = re.findall(r"{% if is_state\('input_boolean\.cristina_office_day'.*?%}", text)
    assert len(office_gates) == 2
    for gate in office_gates:
        assert "input_boolean.cristina_home" in gate


@pytest.mark.parametrize("home,expected", [
    (("cristina", "john"), True),
    (("john",), False),
])
def test_mothers_day_from_calendar_needs_cristina_home(home, expected):
    out = render(brief_section("HOLIDAY PERSONALITY"), home=home,
                 holidays=[{"summary": "Mother's Day", "start": "2027-05-09"}])
    assert ("Mother's Day" in out) is expected


def test_holidays_come_from_calendar_not_hardcoded_dates():
    section = brief_section("HOLIDAY PERSONALITY")
    out = render(section, today="2026-11-26",
                 holidays=[{"summary": "Thanksgiving Day", "start": "2026-11-26"},
                           {"summary": "Juneteenth (substitute)", "start": "2026-11-26"},
                           {"summary": "Halloween", "start": "2026-10-31"}])
    assert "Thanksgiving" in out
    assert "substitute" not in out and "Halloween" not in out
    assert "11-28" not in section
    # Calendar call failed: no holiday lines, no crash
    assert render(section, today="2026-11-26").strip() == "### HOLIDAY PERSONALITY"


def test_plants_flag_dry_soil_only():
    out = render(brief_section("PLANTS"), states={
        "sensor.plant_moisture_sensor_soil_moisture": "8.2",
        "sensor.small_plant_soil_moisture": "95",
        "sensor.large_plant_soil_moisture": "17.75",
    })
    assert "the plant with the moisture sensor is very dry at 8 percent" in out
    assert "the large plant is getting dry at 18 percent" in out
    assert "small plant" not in out
    assert "dry" not in render(brief_section("PLANTS"), states={
        "sensor.large_plant_soil_moisture": "unavailable"})
