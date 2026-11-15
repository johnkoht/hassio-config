"""
Regression tests for the latest-announcement helper overflow (JK-1246).

input_text.latest_voice_announcement defaulted to max 100, so every long
announcement (the morning brief) logged "Invalid value ... (length range 0 - 100)".
The helper now allows HA's 255 limit and every writer truncates to fit.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
ANN = REPO / "packages/announcements"
ENTITY = "input_text.latest_voice_announcement"


def helper():
    return yaml.safe_load((ANN / "latest_voice_announcement.yaml").read_text())[
        "input_text"]["latest_voice_announcement"]


def writers():
    out = []
    for path in sorted(ANN.glob("*.yaml")):
        text = path.read_text()
        if "input_text.set_value" not in text:
            continue
        data = yaml.safe_load(text)

        def walk(node):
            if isinstance(node, dict):
                if node.get("action") == "input_text.set_value":
                    target = (node.get("target") or {}).get("entity_id") or node.get("entity_id")
                    if target == ENTITY:
                        out.append((path.name, node))
                for v in node.values():
                    walk(v)
            elif isinstance(node, list):
                for v in node:
                    walk(v)

        walk(data)
    return out


def test_helper_max_is_the_ha_limit():
    assert helper()["max"] == 255


def test_both_engines_write_the_helper():
    assert {n for n, _ in writers()} == {"voice_announcement.yaml", "critical_announcement.yaml"}


@pytest.mark.parametrize("name,node", writers(), ids=lambda x: x if isinstance(x, str) else "")
@pytest.mark.parametrize("message", ["", "Short one.", "x" * 255, "y" * 256, "Good morning. " * 200])
def test_written_value_always_fits(name, node, message):
    rendered = Environment().from_string(node["data"]["value"]).render(speech_message=message)
    assert len(rendered) <= helper()["max"]
    if len(message) <= 255:
        assert rendered == message
    else:
        assert rendered.endswith("...") and rendered.startswith(message[:20])
