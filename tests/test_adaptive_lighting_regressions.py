"""
Regression tests for Adaptive Lighting sleep mode in the kitchen and family room.

Sleep mode used to stay on until 07:00 (or sunrise), so anyone up early on a
winter morning got 15% night lighting. It must also end when bedtime mode
turns off in the morning, but not when someone gets up at night.
"""
from datetime import time
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent

SLEEP_MODE_OFF = [
    "packages/kitchen/lights/kitchen_lights_sleep_mode_off.yaml",
    "packages/family_room/lights/family_room_sleep_mode_off.yaml",
]


def automation(rel_path):
    return yaml.safe_load((REPO / rel_path).read_text())["automation"][0]


def _t(value):
    return time.fromisoformat(value)


def passes(cond, trigger_id, now, sun_up):
    """Evaluate the subset of condition types these automations use."""
    kind = cond["condition"]
    if kind == "or":
        return any(passes(c, trigger_id, now, sun_up) for c in cond["conditions"])
    if kind == "and":
        return all(passes(c, trigger_id, now, sun_up) for c in cond["conditions"])
    if kind == "not":
        return not any(passes(c, trigger_id, now, sun_up) for c in cond["conditions"])
    if kind == "trigger":
        return trigger_id == cond["id"]
    if kind == "sun":
        return sun_up
    if kind == "time":
        after = _t(cond["after"]) if "after" in cond else time.min
        before = _t(cond["before"]) if "before" in cond else time.max
        return after <= now < before
    if kind == "state":
        return True  # lighting_automations assumed on
    raise AssertionError(f"unhandled condition {kind}")


def fires(auto, trigger_id, now, sun_up=False):
    return all(passes(c, trigger_id, now, sun_up) for c in auto["conditions"])


@pytest.mark.parametrize("path", SLEEP_MODE_OFF)
def test_bedtime_off_trigger_exists(path):
    auto = automation(path)
    (trigger,) = [t for t in auto["triggers"] if t.get("id") == "bedtime_off"]
    assert trigger["entity_id"] == "input_boolean.bedtime"
    assert trigger["to"] == "off"


@pytest.mark.parametrize("path", SLEEP_MODE_OFF)
def test_winter_morning_wake_ends_sleep_mode(path):
    """Up at 06:00, before sunrise: sleep mode must end."""
    assert fires(automation(path), "bedtime_off", time(6, 0))


@pytest.mark.parametrize("path", SLEEP_MODE_OFF)
@pytest.mark.parametrize("now", [time(22, 30), time(2, 0), time(4, 59)])
def test_night_wake_keeps_sleep_mode(path, now):
    """Out of bed at night: sleep mode must stay on."""
    assert not fires(automation(path), "bedtime_off", now)


@pytest.mark.parametrize("path", SLEEP_MODE_OFF)
def test_7am_fallback_still_fires(path):
    assert fires(automation(path), None, time(7, 0))
