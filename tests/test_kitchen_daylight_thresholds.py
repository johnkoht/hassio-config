"""Kitchen daylight on/off: the off point, minus the lights' own glow, must clear the on point."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
LIGHTS = REPO / "packages/kitchen/lights"
MAIN = "sensor.kitchen_motion_sensor_main_illuminance"
TABLE = "sensor.kitchen_motion_sensor_table_illuminance"
ON_LUX = 250
# Lux the ceiling lights add at each sensor (measured 2026-11-21: 507->217, 483->358).
GLOW = {MAIN: 290, TABLE: 125}
MARGIN = 100


class _L(yaml.SafeLoader):
    pass


_L.add_multi_constructor("!", lambda loader, suffix, node: None)


def auto(name):
    return yaml.load((LIGHTS / f"{name}.yaml").read_text(), Loader=_L)["automation"][0]


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def lux_checks(conds, key):
    return {c["entity_id"]: c[key] for c in walk(conds)
            if c.get("condition") == "numeric_state" and key in c}


def test_off_leaves_daylight_above_the_on_point():
    """Regression: off at 450 left ~220 lux of daylight, inside the 150 on-gap, so lights stayed off."""
    off = lux_checks(auto("kitchen_lights_day_off")["conditions"], "above")
    assert set(off) == {MAIN, TABLE}
    for sensor, above in off.items():
        assert above - GLOW[sensor] >= ON_LUX + MARGIN, sensor


def test_off_triggers_match_its_conditions():
    off = auto("kitchen_lights_day_off")
    want = lux_checks(off["conditions"], "above")
    got = {t["entity_id"]: t["above"] for t in off["triggers"] if t["trigger"] == "numeric_state"}
    assert got == want


def test_on_paths_use_the_darker_sensor_at_the_on_point():
    for name in ("kitchen_lights_day_on", "kitchen_lights_motion_on"):
        a = auto(name)
        ors = [c for c in a["conditions"] if c.get("condition") == "or"
               and lux_checks(c, "below")]
        assert len(ors) == 1, name
        assert lux_checks(ors[0], "below") == {MAIN: ON_LUX, TABLE: ON_LUX}, name


def test_day_on_triggers_watch_both_sensors():
    trig = [t for t in auto("kitchen_lights_day_on")["triggers"] if t["trigger"] == "numeric_state"]
    assert trig
    for t in trig:
        assert sorted(t["entity_id"]) == sorted([MAIN, TABLE])
        assert t["below"] <= ON_LUX


def test_actions_use_target():
    for name in ("kitchen_lights_day_on", "kitchen_lights_day_off", "kitchen_lights_motion_on"):
        for a in walk(auto(name)["actions"]):
            if "action" in a:
                assert "entity_id" not in a and "target" in a, (name, a["action"])
