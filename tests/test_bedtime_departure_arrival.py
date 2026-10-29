"""
Regression tests for bedtime starting on a departure and ending on an arrival (JK-1118).

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
ADULTS = ["person.john_koht", "person.cristina_falbo"]


def automation(rel_path):
    return yaml.safe_load((REPO / rel_path).read_text())["automation"][0]


def test_bedtime_starts_when_an_adult_leaves():
    """An adult leaving while everybody else home is in bed starts bedtime (and so arms)."""
    auto = automation("packages/house/bedtime_mode/bedtime_mode_on.yaml")
    departures = [t for t in auto["triggers"] if t.get("entity_id") == ADULTS]
    assert len(departures) == 1
    t = departures[0]
    assert t["from"] == "home"
    assert "unavailable" in t["not_to"]
    assert t["for"]
    # The aggregates still gate it, so a departure alone never starts bedtime
    gates = auto["conditions"][1]["conditions"]
    assert {c["entity_id"] for c in gates} == {
        "binary_sensor.everybody_in_bed", "binary_sensor.adults_in_bed"}


def test_arrival_ends_bedtime():
    auto = automation("packages/house/bedtime_mode/bedtime_mode_off_on_arrival.yaml")
    assert {t["entity_id"] for t in auto["triggers"]} == set(ADULTS)
    for t in auto["triggers"]:
        assert t["to"] == "home"
        assert "unavailable" in t["not_from"]
    assert auto["actions"] == [{"action": "input_boolean.turn_off",
                                "target": {"entity_id": "input_boolean.bedtime"}}]


def _render_in_bed_condition(trigger_id, states):
    auto = automation("packages/house/bedtime_mode/bedtime_mode_off_on_arrival.yaml")
    template = next(c for c in auto["conditions"] if c["condition"] == "template")
    env = Environment()
    env.globals["is_state"] = lambda e, s: states.get(e) == s
    out = env.from_string(template["value_template"]).render(trigger={"id": trigger_id})
    return out.strip() == "True"


def test_arrival_only_ends_bedtime_for_someone_not_in_bed():
    """A GPS blip on an adult who is in bed must not end bedtime."""
    assert _render_in_bed_condition("john", {"input_boolean.john_is_in_bed": "off"})
    assert not _render_in_bed_condition("john", {"input_boolean.john_is_in_bed": "on"})
    assert _render_in_bed_condition("cristina", {"input_boolean.cristina_in_bed": "off"})
    assert not _render_in_bed_condition("cristina", {"input_boolean.cristina_in_bed": "on"})
