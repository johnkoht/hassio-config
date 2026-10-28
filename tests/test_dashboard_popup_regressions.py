"""
Regression tests for Kohbo dashboard popups.

Reads repo files relative to this test, so it runs on a dev machine.
"""
import re
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
CLIMATE = REPO / "dashboards/templates/decluttering/climate"


class _Loader(yaml.SafeLoader):
    pass


_Loader.add_constructor("!include", lambda loader, node: None)


def footer_style(name):
    template = yaml.load((CLIMATE / f"{name}.yaml").read_text(), Loader=_Loader)
    footers = [c for c in template[name]["card"]["cards"]
               if c.get("type") == "custom:stack-in-card"]
    assert len(footers) == 1
    return footers[0]["card_mod"]["style"]


@pytest.mark.parametrize("name", ["thermostat_popup", "thermostat_radiant_floor_popup"])
def test_thermostat_footer_tracks_popup_offset(name):
    """The sheet shifts by margin_top_mobile; a fixed bottom floats the footer mid-sheet on short phones."""
    style = footer_style(name)
    bottom = re.search(r"ha-card \{[^}]*\bbottom:\s*([^;]+);", style).group(1)
    assert "var(--custom-height-offset-mobile" in bottom


@pytest.mark.parametrize("name", ["thermostat_popup", "thermostat_radiant_floor_popup"])
def test_thermostat_footer_reserves_flow_space(name):
    """The absolute footer leaves the flow; the host must keep room so content scrolls clear of it."""
    host = re.search(r":host \{([^}]*)\}", footer_style(name)).group(1)
    assert re.search(r"\bheight:\s*\d+px", host)
