"""
Regression tests for quiet mode turning off.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
BEDS = [
    "binary_sensor.nino_bed_occupied",
    "binary_sensor.gianluca_bed_occupied",
    "binary_sensor.john_bed_occupied",
    "binary_sensor.cristina_bed_occupied",
]


def _auto():
    path = REPO / "packages/house/quiet_mode/quiet_mode_turn_off.yaml"
    return yaml.safe_load(path.read_text())["automation"][0]


def _as_list(value):
    return value if isinstance(value, list) else [value]


def test_quiet_mode_off_retriggers_when_a_bed_empties():
    """A bed still occupied when everybody_awake flips on must retry when it empties."""
    auto = _auto()
    triggered = {e for t in auto["triggers"] if t.get("to") == "off"
                 for e in _as_list(t["entity_id"])}
    assert set(BEDS) <= triggered


def test_quiet_mode_off_still_requires_everybody_awake_and_empty_beds():
    auto = _auto()
    conds = [(tuple(_as_list(c["entity_id"])), c["state"])
             for c in auto["conditions"] if c.get("condition") == "state"]
    assert (("binary_sensor.everybody_awake",), "on") in conds
    assert (tuple(BEDS), "off") in conds
