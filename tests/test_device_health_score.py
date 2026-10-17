"""
Regression tests for sensor.device_health_score / sensor.device_health_status.

The score is a chain of trigger-template variables. Each step is rendered with
jinja2 and stubbed HA functions, then parsed with literal_eval the way HA does,
so the weights, caps and status rules are checked as they would run.
"""
import ast
from pathlib import Path

import jinja2
import pytest
import yaml

PACKAGE = Path(__file__).resolve().parent.parent / "packages/system/sensor_health/device_health_score.yaml"

GROUPS = {
    "group.key_sensors_safety": [f"lock.safety_{i}" for i in range(10)],
    "group.leak_sensors": [f"binary_sensor.leak_{i}" for i in range(13)],
    "group.key_sensors_doors": [f"binary_sensor.door_{i}" for i in range(16)],
    "group.key_sensors_motion": [f"binary_sensor.motion_{i}" for i in range(13)],
    "group.key_sensors_presence": [f"binary_sensor.presence_{i}" for i in range(8)],
    "group.key_sensors_climate": [f"sensor.climate_{i}" for i in range(10)],
}


def variables():
    block = yaml.safe_load(PACKAGE.read_text())["template"][0]
    return block["actions"][0]["variables"]


def healthy_house():
    return {
        "states": {
            "binary_sensor.zigbee_coordinator_online": "on",
            "binary_sensor.zwave_controller_online": "on",
            "sensor.ble_proxies_online": "17",
            "sensor.zigbee_routers_online": "19",
            "sensor.hue_spots_online": "14",
        },
        "attrs": {
            "sensor.ble_proxies_online": {"total": 17},
            "sensor.zigbee_routers_online": {"total": 19},
            "sensor.hue_spots_online": {"total": 14},
            "sensor.key_sensors_offline": {"entities": []},
            "sensor.key_sensors_low_battery": {"batteries": {}},
            **{g: {"entity_id": tuple(m)} for g, m in GROUPS.items()},
        },
        "known": [],
    }


def run(house):
    env = jinja2.Environment()
    env.globals["states"] = lambda e: house["states"].get(e, "unknown")
    env.globals["is_state"] = lambda e, s: house["states"].get(e) == s
    env.globals["state_attr"] = lambda e, a: house["attrs"].get(e, {}).get(a)
    env.globals["label_entities"] = lambda label: list(house["known"]) if label == "known_issue" else []
    ctx = {}
    for key, value in variables().items():
        if isinstance(value, str) and "{" in value:
            out = env.from_string(value).render(**ctx).strip()
            try:
                value = ast.literal_eval(out)
            except (ValueError, SyntaxError):
                value = out
        ctx[key] = value
    return ctx


def test_weights_and_caps():
    v = variables()
    assert v["sensor_weights"] == {
        "group.key_sensors_safety": 2,
        "group.leak_sensors": 2,
        "group.key_sensors_doors": 2,
        "group.key_sensors_motion": 1,
        "group.key_sensors_presence": 1,
        "group.key_sensors_climate": 0.5,
    }
    radios = (v["zigbee_coordinator_points"] + v["zwave_controller_points"] + v["ble_proxies_points"]
              + v["zigbee_routers_points"] + v["hue_spots_points"])
    assert (radios, v["sensors_points"], v["batteries_points"]) == (50, 35, 15)
    assert (v["outage_cap"], v["down_below"], v["healthy_from"]) == (25, 50, 85)
    assert (v["low_battery_penalty"], v["low_battery_leak_penalty"]) == (3, 6)


def test_everything_online_is_100_healthy():
    ctx = run(healthy_house())
    assert (ctx["score"], ctx["status"]) == (100, "Healthy")


@pytest.mark.parametrize("radio", ["binary_sensor.zigbee_coordinator_online", "binary_sensor.zwave_controller_online"])
def test_controller_down_caps_at_25_and_is_down(radio):
    house = healthy_house()
    house["states"][radio] = "off"
    ctx = run(house)
    assert ctx["outage"] is True
    assert ctx["score"] <= 25
    assert ctx["status"] == "Down"


def test_mesh_ratios():
    house = healthy_house()
    house["states"]["sensor.zigbee_routers_online"] = "17"
    house["states"]["sensor.hue_spots_online"] = "13"
    house["states"]["sensor.ble_proxies_online"] = "16"
    ctx = run(house)
    assert ctx["radios_score"] == round(25 + 10 * 16 / 17 + 10 * 17 / 19 + 5 * 13 / 14, 1)


def test_zero_totals_do_not_divide_by_zero():
    house = healthy_house()
    for e in ["sensor.ble_proxies_online", "sensor.zigbee_routers_online", "sensor.hue_spots_online"]:
        house["attrs"][e] = {"total": 0}
        house["states"][e] = "unavailable"
    for g in GROUPS:
        house["attrs"][g] = {"entity_id": ()}
    ctx = run(house)
    assert ctx["radios_score"] == 25
    assert ctx["sensors_score"] == 35


@pytest.mark.parametrize("group", ["group.leak_sensors", "group.key_sensors_safety"])
def test_critical_sensor_offline_forces_degraded(group):
    house = healthy_house()
    house["attrs"]["sensor.key_sensors_offline"]["entities"] = [GROUPS[group][0]]
    ctx = run(house)
    assert ctx["score"] >= 85
    assert ctx["status"] == "Degraded"


def test_sensor_weights_apply():
    house = healthy_house()
    house["attrs"]["sensor.key_sensors_offline"]["entities"] = GROUPS["group.key_sensors_climate"][:2]
    ctx = run(house)
    total = 2 * 10 + 2 * 13 + 2 * 16 + 13 + 8 + 0.5 * 10
    assert ctx["sensors_score"] == round(35 * (total - 1) / total, 1)
    assert ctx["status"] == "Healthy"


def test_battery_penalties_and_floor():
    house = healthy_house()
    house["attrs"]["sensor.key_sensors_low_battery"]["batteries"] = {GROUPS["group.leak_sensors"][0]: 4.0}
    assert run(house)["batteries_score"] == 9
    house["attrs"]["sensor.key_sensors_low_battery"]["batteries"] = {GROUPS["group.key_sensors_doors"][0]: 10.0}
    assert run(house)["batteries_score"] == 12
    house["attrs"]["sensor.key_sensors_low_battery"]["batteries"] = {e: 5.0 for e in GROUPS["group.leak_sensors"][:3]}
    assert run(house)["batteries_score"] == 0


def test_known_issue_leaves_both_sides_of_the_ratio():
    house = healthy_house()
    # Known-issue doors are offline too, but key_sensors_offline drops them; the score must
    # drop them from the members as well, not count them as online.
    house["known"] = list(GROUPS["group.key_sensors_doors"])
    house["attrs"]["sensor.key_sensors_offline"]["entities"] = GROUPS["group.key_sensors_motion"][:4]
    ctx = run(house)
    total = 2 * 10 + 2 * 13 + 13 + 8 + 0.5 * 10  # doors excluded
    assert ctx["sensors_score"] == round(35 * (total - 4) / total, 1)  # 33.1; counting doors as online gives 33.7


def test_rollups_exclude_known_issues():
    block = yaml.safe_load((PACKAGE.parent / "key_sensor_counts.yaml").read_text())["template"][0]
    rollup = block["actions"][0]["variables"]["rollup"]
    assert "label_entities('known_issue')" in rollup
    assert "'group.key_sensors_safety'" in rollup


def test_sensor_health_is_throttled():
    """Live templates here saturated the Yellow's event loop (2026-10-17): every pass is timed, 5 min or slower."""
    for f in ["key_sensor_counts.yaml", "network_status.yaml", "device_health_score.yaml"]:
        for block in yaml.safe_load((PACKAGE.parent / f).read_text())["template"]:
            for trig in block.get("triggers", []):
                if trig["trigger"] == "time_pattern":
                    assert trig["minutes"] == "/5", (f, trig)
    counts = yaml.safe_load((PACKAGE.parent / "key_sensor_counts.yaml").read_text())["template"]
    assert len(counts) == 1 and "triggers" in counts[0], "rollups must stay one trigger-based block"
