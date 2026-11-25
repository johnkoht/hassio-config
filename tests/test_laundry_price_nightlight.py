"""Laundry nightlight takes its colour from the energy price tier (JK-999)."""
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PKG = REPO / "packages/laundry"
FILE = PKG / "lights/laundry_room_nightlight_price_color.yaml"
NIGHT = "light.laundry_room_nightlight"
MAIN = "light.laundry_room_main_lights"
TOGGLE = "input_boolean.laundry_room_price_nightlight"


def auto():
    return yaml.safe_load(FILE.read_text())["automation"][0]


def test_toggle_helper_has_no_initial_and_is_defined_once():
    helper = yaml.safe_load((PKG / "laundry_room_price_nightlight.yaml").read_text())
    h = helper["input_boolean"]["laundry_room_price_nightlight"]
    assert "initial" not in h and h["name"] and h["icon"]
    assert len(list((REPO / "packages").rglob("laundry_room_price_nightlight.yaml"))) == 1


def test_automation_has_no_initial_state_and_matches_filename():
    a = auto()
    assert a["id"] == FILE.stem and "initial_state" not in a


def test_tier_and_negative_triggers_are_debounced_and_ignore_bad_states():
    trig = {t["entity_id"]: t for t in auto()["triggers"]}
    tier = trig["sensor.energy_price_tier"]
    assert tier["for"]["minutes"] >= 10
    assert sorted(tier["to"]) == ["high", "low", "normal", "very_high"]
    neg = trig["binary_sensor.energy_prices_are_negative"]
    assert neg["for"]["minutes"] >= 10 and sorted(neg["to"]) == ["off", "on"]
    assert trig[NIGHT]["from"] == "off" and trig[NIGHT]["to"] == "on"
    assert "input_select.house" in trig
    assert not any(t["trigger"] == "time" for t in auto()["triggers"])


def test_condition_ladder_order_and_gates():
    conds = auto()["conditions"]
    ids = [c.get("entity_id") for c in conds]
    assert ids == ["input_boolean.lighting_automations", "input_boolean.house_occupied", None,
                   "input_boolean.laundry_room_lighting_automations", "input_select.laundry_room",
                   TOGGLE, NIGHT, MAIN, None]
    by = {c["entity_id"]: c for c in conds if c.get("entity_id")}
    assert by[NIGHT]["state"] == "on" and by[MAIN]["state"] == "off"
    assert by[TOGGLE]["state"] == "on" and by["input_select.laundry_room"]["state"] == "Auto"
    assert "Away" in conds[2]["value_template"] and "Vacation" in conds[2]["value_template"]
    assert conds[-1]["condition"] == "template"


def _env(states_map):
    env = Environment()
    env.filters["is_number"] = lambda v: isinstance(v, (int, float)) or _isnum(v)
    return env, (lambda eid: states_map.get(eid, "unknown")), (
        lambda eid, st: states_map.get(eid, "unknown") == st)


def _isnum(v):
    try:
        float(v)
        return True
    except (TypeError, ValueError):
        return False


def _render(tpl, states_map):
    env, states, is_state = _env(states_map)
    a = auto()
    out = env.from_string(tpl).render(
        states=states, is_state=is_state, tier_colors=a["variables"]["tier_colors"],
        negative_color=a["variables"]["negative_color"])
    return out.strip()


def _valid(tier, price):
    tpl = auto()["conditions"][-1]["value_template"]
    return _render(tpl, {"sensor.energy_price_tier": tier,
                         "sensor.comed_current_hour_average_price": price}) == "True"


def test_validity_condition_passes_real_tier_and_price():
    for tier in ("low", "normal", "high", "very_high"):
        assert _valid(tier, "4.2") and _valid(tier, "-1.5")


def test_validity_condition_rejects_bad_feed_or_unknown_tier():
    for tier in ("unknown", "unavailable", "extreme", ""):
        assert not _valid(tier, "4.2"), tier
    for price in ("unknown", "unavailable", "abc", ""):
        assert not _valid("low", price), price


def test_colour_map_is_rgb_and_renders_each_tier_and_negative():
    action = auto()["actions"][0]
    data = action["data"]
    assert auto()["variables"]["tier_colors"].keys() == {"low", "normal", "high", "very_high"}
    assert "var(" not in str(auto()["variables"]) and "color_name" not in data
    for tier, rgb in auto()["variables"]["tier_colors"].items():
        assert len(rgb) == 3 and all(0 <= c <= 255 for c in rgb)
        out = _render(data["rgb_color"], {"sensor.energy_price_tier": tier})
        assert out == str(rgb), tier
    neg = _render(data["rgb_color"], {"sensor.energy_price_tier": "low",
                                      "binary_sensor.energy_prices_are_negative": "on"})
    assert neg == "[160, 40, 255]"
    assert "Bedtime" in data["brightness_pct"]
    assert action["target"]["entity_id"] == NIGHT
