"""
Render and shape tests for the PR B dead-entity fixes (JK-1232).

Reads repo files relative to this test, so it runs on a dev machine.
"""
import datetime as dt
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
GARBAGE = REPO / "packages/reminders/garbage_day"


def _load(path):
    return yaml.safe_load(path.read_text())


def _tomorrow_template():
    doc = _load(GARBAGE / "tomorrow_is_garbage_day.yaml")
    return doc["template"][0]["binary_sensor"][0]["state"]


def _render_tomorrow(today, attrs):
    env = Environment()
    env.globals["now"] = lambda: dt.datetime.combine(today, dt.time(18, 0))
    env.globals["timedelta"] = dt.timedelta
    env.globals["state_attr"] = lambda ent, a: attrs.get(a) if ent == "calendar.house_chores" else None
    return env.from_string(_tomorrow_template()).render().strip()


NOV13 = dt.date(2026, 11, 13)


@pytest.mark.parametrize("today,attrs,expected", [
    (NOV13, {"message": "Garbage Day", "start_time": "2026-11-14 00:00:00"}, "True"),
    (dt.date(2026, 11, 30), {"message": "Garbage day", "start_time": "2026-12-01 00:00:00"}, "True"),
    (NOV13, {"message": "Take out GARBAGE", "start_time": "2026-11-14 07:00:00"}, "True"),
    (NOV13, {"message": "Vacuum", "start_time": "2026-11-14 00:00:00"}, "False"),
    (NOV13, {"message": "Garbage Day"}, "False"),
    (NOV13, {"message": "Garbage Day", "start_time": None}, "False"),
    (NOV13, {"message": "Garbage Day", "start_time": "2026-11-13 00:00:00"}, "False"),
    (NOV13, {"start_time": "2026-11-14 00:00:00"}, "False"),
])
def test_tomorrow_is_garbage_day_render(today, attrs, expected):
    assert _render_tomorrow(today, attrs) == expected


@pytest.mark.parametrize("name", ["garbage_day_on", "garbage_day_off"])
def test_garbage_triggers_filter_on_summary(name):
    auto = _load(GARBAGE / f"automations/{name}.yaml")["automation"][0]
    assert auto["triggers"][0]["entity_id"] == "calendar.house_chores"
    env = Environment()
    tpls = [c["value_template"] for c in auto["conditions"] if c["condition"] == "template"]
    assert len(tpls) == 1

    def render(summary):
        return env.from_string(tpls[0]).render(
            trigger={"calendar_event": {"summary": summary}}).strip()

    assert render("Garbage Day") == "True"
    assert render("GARBAGE pickup") == "True"
    assert render("Clean bathrooms") == "False"


@pytest.mark.parametrize("name", ["garbage_day_on", "garbage_day_off"])
def test_garbage_actions_use_target(name):
    auto = _load(GARBAGE / f"automations/{name}.yaml")["automation"][0]
    for act in auto["actions"]:
        assert "entity_id" not in act
        assert "entity_id" in act["target"]
