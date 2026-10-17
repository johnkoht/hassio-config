"""
Regression tests for the Zigbee coordinator offline alert.

config_entry_attr(..., 'state') returns a plain string ("loaded"), so the
templates must compare the string itself; `.value` renders empty and made
the condition always true (false push on every start, no real alerts).
"""
from pathlib import Path

import jinja2
import pytest
import yaml

ALERT = Path(__file__).resolve().parent.parent / "packages/system/alerts/zigbee_coordinator_offline.yaml"


def templates():
    auto = yaml.safe_load(ALERT.read_text())["automation"][0]
    trigger = next(t for t in auto["triggers"] if t["trigger"] == "template")
    condition = next(a for a in auto["actions"] if a.get("condition") == "template")
    return {"trigger": trigger["value_template"], "condition": condition["value_template"]}


def render(source, state):
    env = jinja2.Environment()
    env.globals["config_entry_attr"] = lambda entry_id, attr: state
    env.globals["now"] = lambda: "now"
    return env.from_string(source).render().strip()


@pytest.mark.parametrize("which", ["trigger", "condition"])
def test_loaded_coordinator_is_not_offline(which):
    assert render(templates()[which], "loaded") == "False"


@pytest.mark.parametrize("which", ["trigger", "condition"])
@pytest.mark.parametrize("state", [None, "setup_error", "not_loaded"])
def test_unloaded_coordinator_is_offline(which, state):
    assert render(templates()[which], state) == "True"
