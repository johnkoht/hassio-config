"""
Regression test (JK-709): turning the main bedroom light off in the morning,
with house bedtime still on and nobody in bed, sent the room back to Bedtime.

Renders the light-off guard condition with real Jinja2.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PATH = REPO / "packages/main_bedroom/mode/main_bedroom_mode_bedtime.yaml"
LIGHT = "light.main_bedroom_main_lights"
GUARD = "Light-off trigger needs someone in bed or laying down"

NOBODY = {
    "input_boolean.bedtime": "on",
    "input_boolean.john_is_in_bed": "off",
    "input_boolean.cristina_in_bed": "off",
    "input_select.john_sleep_state": "Just Got Up",
    "input_select.cristina_sleep_state": "Awake",
}


def _render(trigger_entity, states):
    auto = yaml.safe_load(PATH.read_text())["automation"][0]
    cond = next(c for c in auto["conditions"] if c.get("alias") == GUARD)
    env = Environment()
    env.globals["is_state"] = lambda entity, value: states.get(entity) == value
    out = env.from_string(cond["value_template"]).render(
        trigger={"entity_id": trigger_entity})
    return out.strip() == "True"


def test_light_off_with_nobody_in_bed_is_blocked():
    assert _render(LIGHT, NOBODY) is False


@pytest.mark.parametrize("entity,value", [
    ("input_boolean.john_is_in_bed", "on"),
    ("input_boolean.cristina_in_bed", "on"),
    ("input_select.john_sleep_state", "Just Laid Down"),
    ("input_select.cristina_sleep_state", "Just Laid Down"),
])
def test_light_off_with_someone_in_bed_passes(entity, value):
    assert _render(LIGHT, {**NOBODY, entity: value}) is True


def test_in_bed_trigger_is_unaffected():
    assert _render("input_boolean.john_is_in_bed", NOBODY) is True
