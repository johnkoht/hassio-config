"""Laundry nightlight takes its colour from the energy price tier (JK-999)."""
from pathlib import Path

import yaml

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
    text = FILE.read_text()
    assert "Away" in text and "Vacation" in text
    assert "is_number" in text and "very_high" in text


def test_colour_map_is_rgb_not_css_and_covers_every_tier():
    action = auto()["actions"][0]
    data = action["data"]
    for tier in ("low", "normal", "high", "very_high"):
        assert f"'{tier}':" in data["rgb_color"]
    assert "var(" not in data["rgb_color"] and "color_name" not in data
    assert "[160, 40, 255]" in data["rgb_color"]
    assert "Bedtime" in data["brightness_pct"]
    assert action["target"]["entity_id"] == NIGHT
