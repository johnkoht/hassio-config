"""
Regression test: the door left-open re-alert after a snooze never fired.

The timer.finished event trigger has no trigger.from_state, so messages built
from it failed to render. Renders both messages with real Jinja2.
"""
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PATH = REPO / "packages/security/doors_left_open.yaml"


class _Door:
    def __init__(self, name, state):
        self.name, self.state = name, state


def _templates():
    acts = yaml.safe_load(PATH.read_text())["automation"][0]["actions"]
    variables = next(a for a in acts if "variables" in a)["variables"]
    speech = next(a for a in acts if a.get("action") == "script.voice_announcement")["data"]["speech_message"]
    push = next(a for a in acts if a.get("action") == "script.general_notification")["data"]["message"]
    return variables, speech, push


def _render(trigger):
    variables, speech, push = _templates()
    doors = {"binary_sensor.interior_garage_door": _Door("Garage Door", "on"),
             "binary_sensor.front_door": _Door("Front Door", "off")}
    env = Environment()
    env.globals["expand"] = lambda *ids: [doors[i] for i in ids]
    ctx = {"trigger": trigger}
    ctx["open_doors"] = env.from_string(variables["open_doors"]).render(**ctx).strip()
    return [env.from_string(t).render(**ctx) for t in (speech, push)]


def test_messages_render_on_state_trigger():
    trig = {"platform": "state", "from_state": {"attributes": {"friendly_name": "Garage Door"}}}
    for msg in _render(trig):
        assert msg.startswith("Garage Door has been open")


def test_messages_render_on_timer_finished_event():
    # Event trigger: no from_state at all.
    for msg in _render({"platform": "event"}):
        assert msg.startswith("Garage Door has been open")


def test_no_message_references_trigger_from_state():
    _, speech, push = _templates()
    assert "from_state" not in speech and "from_state" not in push
