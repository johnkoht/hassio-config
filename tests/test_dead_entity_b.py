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


# ---- Task 3: heaters ----

NINO = REPO / "packages/ninos_room/ninos_bedroom_heater.yaml"
GIAN = REPO / "automation/gianlucas_room/gianluca_heater_on_upon_arrival.yaml"


def _nino(id_):
    return next(a for a in _load(NINO)["automation"] if a["id"] == id_)


def _arrival_autos():
    return [
        _load(GIAN),
        _nino("ninos_bedroom_heater_turn_on_upon_arrival"),
    ]


def test_bathroom_heater_file_removed():
    assert not (REPO / "packages/ninos_room/ninos_bathroom_heater.yaml").exists()


@pytest.mark.parametrize("auto", _arrival_autos(), ids=["gianluca", "nino"])
def test_arrival_triggers_use_status_selects(auto):
    trigs = auto["triggers"]
    ents = {t["entity_id"]: t for t in trigs}
    for sel in ("input_select.john_status", "input_select.cristina_status_dropdown"):
        assert ents[sel]["to"] == "Just Arrived"
        assert ents[sel]["id"]
    assert ents["input_boolean.house_occupied"]["to"] == "on"
    for t in trigs:
        e = t["entity_id"]
        assert not e.startswith("person.") and e != "group.family"


@pytest.mark.parametrize("auto", _arrival_autos(), ids=["gianluca", "nino"])
def test_arrival_conditions_shape(auto):
    conds = auto["conditions"]
    assert conds[0]["condition"] == "or"
    kinds = [c["condition"] for c in conds[0]["conditions"]]
    assert "trigger" in kinds
    temp = next(c for c in conds if c.get("condition") == "numeric_state")
    assert temp["below"] in (69, 71.5)
    assert any(c["condition"] == "time" and c["after"] == "18:30:00" for c in conds)
    assert any(c["condition"] == "state" and c["state"] == "off"
               and c["entity_id"].startswith("switch.") for c in conds)
    assert "group.family" not in str(auto) and "person." not in str(auto)


def _render_nino(tpl, state):
    env = Environment()
    env.globals["states"] = lambda e: state
    env.globals["is_number"] = lambda v: (
        v not in ("unavailable", "unknown", None, "")
        and _isfloat(v))
    return env.from_string(tpl).render().strip()


def _isfloat(v):
    try:
        float(v)
        return True
    except (TypeError, ValueError):
        return False


def _nino_on_templates():
    on = _nino("nino_bedroom_heater_on")
    out = [t["value_template"] for t in on["triggers"] if t.get("trigger") == "template"]
    for c in on["conditions"]:
        if c["condition"] == "template":
            out.append(c["value_template"])
    return out


@pytest.mark.parametrize("tpl", _nino_on_templates())
def test_nino_on_path_templates_guarded(tpl):
    assert "| float" not in tpl.replace("states('sensor.nino_room_temperature') | float", "")
    assert "float(0)" not in tpl and ".state" not in tpl
    for bad in ("unavailable", "unknown"):
        assert _render_nino(tpl, bad) == "False"
    assert _render_nino(tpl, "68") == "True"


def test_nino_off_path_reaches_occupancy_branches():
    off = _nino("nino_bedroom_heater_off")
    for t in off["triggers"]:
        if t.get("trigger") == "template":
            assert _render_nino(t["value_template"], "unavailable") == "False"
    branches = off["conditions"][0]["conditions"]
    tpl = branches[0]["value_template"]
    assert _render_nino(tpl, "unavailable") == "False"
    assert _render_nino(tpl, "73") == "True"
    entities = [b.get("entity_id") for b in branches[1:]]
    assert entities == ["input_boolean.house_occupied", "input_boolean.ninos_bedroom_occupied"]


def test_dead_aqara_weather_sensor_not_referenced():
    import subprocess

    files = subprocess.run(
        ["git", "ls-files"], cwd=REPO, capture_output=True, text=True, check=True
    ).stdout.splitlines()
    hits = []
    for f in files:
        if f.startswith(("plans/", "memory/")) or f == "tests/test_dead_entity_b.py":
            continue
        p = REPO / f
        if p.is_file() and "aqara_weather_sensor_1" in p.read_text(errors="ignore"):
            hits.append(f)
    assert not hits
