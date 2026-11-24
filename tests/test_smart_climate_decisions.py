"""
Decision macro and sensors (task-3): renders the real
custom_templates/climate_control.jinja and the real sensor templates.
"""
import itertools
import re
import json

import pytest
from jinja2 import FileSystemLoader

from smart_climate_harness import FakeHA, REPO, entities

MACRO = REPO / "custom_templates" / "climate_control.jinja"
LOADER = FileSystemLoader(str(REPO / "custom_templates"))
SENSORS = "packages/climate/smart/sensors/climate_decisions.yaml"
ZONES = ["main_floor", "second_floor", "jr_suite", "main_bedroom", "ninos_bedroom", "basement", "garage"]
NEST = ["main_floor", "second_floor"]
RADIANT = ["jr_suite", "main_bedroom", "ninos_bedroom", "basement"]

NORMAL = {
    "input_number.climate_main_floor_comfort_heat": "72.0",
    "input_number.climate_main_floor_comfort_cool": "76.0",
    "input_number.climate_main_floor_sleep_heat": "70.0",
    "input_number.climate_main_floor_sleep_cool": "72.0",
    "input_number.climate_second_floor_comfort_heat": "71.0",
    "input_number.climate_second_floor_comfort_cool": "76.0",
    "input_number.climate_second_floor_sleep_heat": "68.0",
    "input_number.climate_second_floor_sleep_cool": "72.0",
    "input_number.climate_away_heat": "65.0",
    "input_number.climate_away_cool": "79.0",
    "input_number.climate_away_setback": "3.0",
    "input_number.climate_radiant_comfort_heat": "68.0",
    "input_number.climate_radiant_sleep_heat": "67.0",
    "input_number.climate_radiant_cold_heat": "70.0",
    "input_number.climate_radiant_away_heat": "65.0",
    "input_number.climate_forecast_boost": "1.0",
    "input_number.climate_price_offset": "2.0",
    "sensor.climate_active_season": "Heating",
    "input_boolean.climate_away_extended": "off",
    "input_boolean.climate_precondition_main_floor": "off",
    "input_boolean.climate_precondition_second_floor": "off",
    "binary_sensor.climate_forecast_cold_swing": "off",
    "binary_sensor.climate_forecast_warm_swing": "off",
    "binary_sensor.climate_price_offset_active": "off",
    "binary_sensor.climate_very_cold": "off",
    "binary_sensor.climate_indoor_air_dry": "off",
    "input_boolean.ninos_bedroom_occupied": "off",
    "input_boolean.gianlucas_room_occupied": "off",
}
for z in ZONES[:-1]:
    NORMAL[f"input_select.climate_mode_{z}"] = "Comfort"

CALL = "{% from 'climate_control.jinja' import climate_decision %}{{ climate_decision(zone) }}"


def decide(zone, **over):
    st = dict(NORMAL)
    st.update(over)
    out = FakeHA(st).render(CALL, loader=LOADER, zone=zone)
    return json.loads(out)


def mode(zone, m, **over):
    return decide(zone, **{f"input_select.climate_mode_{zone}": m}, **over)


def S(**kw):
    return {k.replace("__", "."): v for k, v in kw.items()}


# ---- Nest ----------------------------------------------------------------

@pytest.mark.parametrize("zone", NEST)
def test_comfort_heat_and_cool(zone):
    d = decide(zone)
    assert (d["hvac_mode"], d["temperature"]) == ("heat", {"main_floor": 72, "second_floor": 71}[zone])
    assert d["reason"] == f"Comfort heat {d['temperature']}"
    d = decide(zone, **{"sensor.climate_active_season": "Cooling"})
    assert (d["hvac_mode"], d["temperature"]) == ("cool", 76)


def test_sleep_and_precondition():
    assert mode("main_floor", "Sleep")["temperature"] == 70
    assert mode("main_floor", "Sleep", **{"sensor.climate_active_season": "Cooling"})["temperature"] == 72
    d = mode("main_floor", "Sleep", **{"input_boolean.climate_precondition_main_floor": "on"})
    assert d["temperature"] == 72 and "pre-wake" in d["reason"].lower()
    # precondition for the other zone does not leak
    assert mode("main_floor", "Sleep", **{"input_boolean.climate_precondition_second_floor": "on"})["temperature"] == 70


def test_away_setback_and_extended():
    d = mode("main_floor", "Away")
    assert (d["hvac_mode"], d["temperature"]) == ("heat", 69)
    d = mode("main_floor", "Away", **{"sensor.climate_active_season": "Cooling"})
    assert (d["hvac_mode"], d["temperature"]) == ("cool", 79)
    d = mode("main_floor", "Away", **{"input_boolean.climate_away_extended": "on"})
    assert d["temperature"] == 65 and "extended" in d["reason"]
    d = mode("main_floor", "Away", **{"input_boolean.climate_away_extended": "on", "sensor.climate_active_season": "Cooling"})
    assert d["temperature"] == 79


def test_away_band_clamps():
    # setback pushes below the away floor -> clamped to climate_away_heat
    d = mode("main_floor", "Away", **{"input_number.climate_away_setback": "8.0"})
    assert d["temperature"] == 65
    # cool + setback above the ceiling -> clamped to climate_away_cool
    d = mode("main_floor", "Away", **{"sensor.climate_active_season": "Cooling", "input_number.climate_away_setback": "8.0"})
    assert d["temperature"] == 79
    # absolute heat cap 80, cool floor 60
    assert decide("main_floor", **{"input_number.climate_main_floor_comfort_heat": "90.0"})["temperature"] == 80
    d = decide("main_floor", **{"sensor.climate_active_season": "Cooling", "input_number.climate_main_floor_comfort_cool": "50.0"})
    assert d["temperature"] == 60


def test_forecast_boost():
    d = decide("main_floor", **{"binary_sensor.climate_forecast_cold_swing": "on"})
    assert d["temperature"] == 73 and "Forecast cold swing +1" in d["reason"]
    d = decide("main_floor", **{"sensor.climate_active_season": "Cooling", "binary_sensor.climate_forecast_warm_swing": "on"})
    assert d["temperature"] == 75
    # wrong swing for the season: no boost
    assert decide("main_floor", **{"binary_sensor.climate_forecast_warm_swing": "on"})["temperature"] == 72
    # Sleep gets it, Away does not
    assert mode("main_floor", "Sleep", **{"binary_sensor.climate_forecast_cold_swing": "on"})["temperature"] == 71
    assert mode("main_floor", "Away", **{"binary_sensor.climate_forecast_cold_swing": "on"})["temperature"] == 69


def test_price_offset_comfort_only():
    on = {"binary_sensor.climate_price_offset_active": "on"}
    d = decide("main_floor", **on)
    assert d["temperature"] == 70 and "Price offset -2" in d["reason"]
    assert decide("main_floor", **on, **{"sensor.climate_active_season": "Cooling"})["temperature"] == 78
    assert mode("main_floor", "Sleep", **on)["temperature"] == 70  # sleep heat 70, no offset
    assert mode("main_floor", "Away", **on)["temperature"] == 69


def test_price_offset_second_floor_kid_rooms():
    on = {"binary_sensor.climate_price_offset_active": "on"}
    assert decide("second_floor", **on)["temperature"] == 69
    for e in ("input_boolean.ninos_bedroom_occupied", "input_boolean.gianlucas_room_occupied"):
        assert decide("second_floor", **on, **{e: "on"})["temperature"] == 71
    # main floor unaffected by kid rooms
    assert decide("main_floor", **on, **{"input_boolean.ninos_bedroom_occupied": "on"})["temperature"] == 70


def test_nest_rounds_to_whole_degrees():
    d = decide("main_floor", **{"input_number.climate_main_floor_comfort_heat": "71.5"})
    assert d["temperature"] == int(d["temperature"])
    assert isinstance(d["temperature"], int)


def test_off_override_unknown():
    for z in NEST + RADIANT:
        d = mode(z, "Off")
        assert (d["hvac_mode"], d["temperature"]) == ("off", None)
        d = mode(z, "Override")
        assert (d["hvac_mode"], d["temperature"]) == ("skip", None) and "Override" in d["reason"]
        assert mode(z, "unknown")["hvac_mode"] == "skip"
        assert mode(z, "Bogus")["hvac_mode"] == "skip"
        assert decide(z, **{"sensor.climate_active_season": "unknown"})["hvac_mode"] == "skip"
        assert decide(z, **{"sensor.climate_active_season": "unavailable"})["hvac_mode"] == "skip"


def test_unavailable_helpers_fall_back_safely():
    bad = {k: "unavailable" for k in NORMAL if k.startswith("input_number.")}
    d = decide("main_floor", **bad)
    assert d["hvac_mode"] == "heat" and 60 <= d["temperature"] <= 80
    d = decide("main_floor", **bad, **{"sensor.climate_active_season": "Cooling"})
    assert d["hvac_mode"] == "cool" and 60 <= d["temperature"] <= 85
    for z in RADIANT:
        d = decide(z, **bad)
        assert d["hvac_mode"] == "heat" and d["temperature"] == 65


# ---- radiant ---------------------------------------------------------------

@pytest.mark.parametrize("zone", RADIANT)
def test_radiant_cooling_skips(zone):
    for m in ("Comfort", "Sleep", "Away"):
        d = mode(zone, m, **{"sensor.climate_active_season": "Cooling"})
        assert d["hvac_mode"] == "skip" and d["temperature"] is None
        assert "Cooling season: radiant hands off" in d["reason"]
    assert mode(zone, "Off", **{"sensor.climate_active_season": "Cooling"})["hvac_mode"] == "off"


def test_radiant_profiles():
    assert decide("jr_suite")["temperature"] == 68
    assert mode("jr_suite", "Sleep")["temperature"] == 67
    assert mode("jr_suite", "Away")["temperature"] == 68  # slab holds
    d = mode("jr_suite", "Away", **{"input_boolean.climate_away_extended": "on"})
    assert d["temperature"] == 65 and d["hvac_mode"] == "heat"


def test_radiant_cold_bump_and_dry_air():
    cold = {"binary_sensor.climate_very_cold": "on"}
    d = decide("basement", **cold)
    assert d["temperature"] == 70 and "Cold bump" in d["reason"]
    assert mode("basement", "Sleep", **cold)["temperature"] == 70
    d = decide("basement", **cold, **{"binary_sensor.climate_indoor_air_dry": "on"})
    assert d["temperature"] == 68 and "Cold bump (dry air: skipped)" in d["reason"]
    # bump never lowers a higher comfort setting
    assert decide("basement", **cold, **{"input_number.climate_radiant_comfort_heat": "71.0",
                                          "input_number.climate_radiant_cold_heat": "69.0"})["temperature"] == 71
    # no bump in Away
    assert mode("basement", "Away", **cold)["temperature"] == 68


def test_radiant_rounds_half_degrees():
    d = decide("basement", **{"input_number.climate_radiant_comfort_heat": "68.3"})
    assert d["temperature"] == 68.5


def test_radiant_cap_grid():
    vals_sets = [
        {k: "80.0" for k in NORMAL if k.startswith("input_number.climate_radiant")},
        {},
        {k: "500" for k in NORMAL if k.startswith("input_number.climate_radiant")},
    ]
    seen = 0
    for zone, m, season, vc, dry, ext, vals in itertools.product(
            RADIANT, ["Comfort", "Sleep", "Away", "Off", "Override"], ["Heating", "Cooling", "unknown"],
            ["on", "off"], ["on", "off"], ["on", "off"], vals_sets):
        d = mode(zone, m, **vals, **{"sensor.climate_active_season": season,
                                     "binary_sensor.climate_very_cold": vc,
                                     "binary_sensor.climate_indoor_air_dry": dry,
                                     "input_boolean.climate_away_extended": ext})
        seen += 1
        if d["temperature"] is not None:
            assert 50 <= d["temperature"] <= 71, (zone, m, season, vc, dry, ext, d)
    assert seen == 4 * 5 * 3 * 8 * 3


# ---- garage -----------------------------------------------------------------

def test_garage_constant():
    for season, extra in itertools.product(["Heating", "Cooling", "unknown", "unavailable"],
                                           [{}, {"binary_sensor.climate_very_cold": "on"},
                                            {"input_boolean.climate_away_extended": "on"},
                                            {"input_number.climate_away_heat": "unavailable"}]):
        d = decide("garage", **{"sensor.climate_active_season": season}, **extra)
        assert (d["hvac_mode"], d["temperature"], d["reason"]) == ("heat", 55, "Frost guard")


# ---- no eco / preset ---------------------------------------------------------

def test_macro_has_no_eco_or_preset():
    text = MACRO.read_text().lower()
    assert not re.search(r"\beco\b", text) and "preset" not in text


# ---- sensors -----------------------------------------------------------------

def test_sensors_exist_and_call_own_zone():
    ents = entities(SENSORS)
    assert set(ents) == {f"climate_decision_{z}" for z in ZONES}
    for z in ZONES:
        domain, cfg = ents[f"climate_decision_{z}"]
        assert domain == "sensor"
        assert cfg["default_entity_id"] == f"sensor.climate_decision_{z}"
        assert cfg["unit_of_measurement"] == "°F"
        assert cfg["device_class"] == "temperature"
        assert cfg["state_class"] == "measurement"
        assert set(cfg["attributes"]) == {"hvac_mode", "zone_mode", "reason"}
        for tpl in [cfg["state"], *cfg["attributes"].values()]:
            assert f"climate_decision('{z}')" in tpl
            assert "from 'climate_control.jinja' import climate_decision" in tpl


@pytest.mark.parametrize("zone", ZONES)
def test_sensor_templates_match_macro(zone):
    cfg = entities(SENSORS)[f"climate_decision_{zone}"][1]
    st = dict(NORMAL)
    ha = FakeHA(st)
    d = decide(zone)
    assert ha.render(cfg["state"], loader=LOADER) == str(d["temperature"])
    for k in ("hvac_mode", "zone_mode", "reason"):
        assert ha.render(cfg["attributes"][k], loader=LOADER) == str(d[k])


def test_sensor_null_temperature_is_unknown():
    """`{{ none }}` renders "None", which HA parses to None -> state unknown, silently.
    Rendering the string 'unknown' would log a non-numeric ERROR on every render."""
    cfg = entities(SENSORS)["climate_decision_main_floor"][1]
    ha = FakeHA({**NORMAL, "input_select.climate_mode_main_floor": "Override"})
    assert ha.render(cfg["state"], loader=LOADER) == "None"
    assert "'unknown'" not in cfg["state"]
    assert ha.render(cfg["attributes"]["hvac_mode"], loader=LOADER) == "skip"


# ---- Review fix: rounding before clamping (half-degree Away bounds) -------

@pytest.mark.parametrize("zone", NEST)
@pytest.mark.parametrize("away_heat,away_cool", [("64.5", "79.5"), ("65.5", "78.5"), ("65.0", "79.0")])
def test_nest_never_leaves_away_band_with_half_degree_bounds(zone, away_heat, away_cool):
    over = {"input_number.climate_away_heat": away_heat, "input_number.climate_away_cool": away_cool,
            "input_select.climate_mode_" + zone: "Away", "input_boolean.climate_away_extended": "on"}
    h = decide(zone, **over)
    c = decide(zone, **over, **{"sensor.climate_active_season": "Cooling"})
    assert h["temperature"] >= float(away_heat)
    assert c["temperature"] <= float(away_cool)
    assert isinstance(h["temperature"], int) and isinstance(c["temperature"], int)


@pytest.mark.parametrize("value,expected", [("71.5", 72), ("68.5", 69), ("72.4", 72), ("72.6", 73)])
def test_nest_rounds_half_up(value, expected):
    d = decide("main_floor", **{"input_number.climate_main_floor_comfort_heat": value})
    assert d["temperature"] == expected


@pytest.mark.parametrize("value,expected", [("67.25", 67.5), ("67.74", 67.5), ("67.75", 68.0)])
def test_radiant_rounds_half_up_to_half_degree(value, expected):
    d = decide("jr_suite", **{"input_number.climate_radiant_comfort_heat": value})
    assert d["temperature"] == expected
