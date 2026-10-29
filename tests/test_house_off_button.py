"""
Regression test for the house mode popup's "Turn Off the House" button (JK-1186).

It showed input_boolean.house_occupied but turned off input_boolean.john_dnd.
"""
from pathlib import Path

import yaml

from conftest import HomeAssistantLoader

REPO = Path(__file__).resolve().parent.parent
POPUP = REPO / "dashboards/kohbo/home/house_mode_popup.yaml"


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def test_turn_off_the_house_targets_house_occupied():
    data = yaml.load(POPUP.read_text(), Loader=HomeAssistantLoader)
    button = next(n for n in walk(data) if n.get("name") == "Turn Off the House")
    tap = button["tap_action"]
    assert tap["perform_action"] == "input_boolean.turn_off"
    assert tap["target"]["entity_id"] == button["entity"] == "input_boolean.house_occupied"
    assert button["confirmation"]["text"]
