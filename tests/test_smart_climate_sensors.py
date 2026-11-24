"""
Season and condition sensors (task-2): renders the real templates from
packages/climate/smart/sensors/ with the shared FakeHA harness.
"""
import pytest

from smart_climate_harness import FakeHA, REPO, entities, load, truthy

SENSORS = "packages/climate/smart/sensors/"
FC = "sensor.pirateweather_hourly_forecast"


def ent(name, uid=None):
    return entities(SENSORS + name + ".yaml")[uid or name][1]


# ---- statistics sensor -------------------------------------------------

def test_statistics_sensor_matches_contract():
    cfg = load(SENSORS + "outdoor_temperature_7_day_mean.yaml")["sensor"][0]
    assert cfg["platform"] == "statistics"
    assert cfg["unique_id"] == "outdoor_temperature_7_day_mean"
    assert cfg["entity_id"] == "sensor.tempest_temperature"
    assert cfg["state_characteristic"] == "mean"
    assert cfg["max_age"] == {"days": 7}
    assert cfg["sampling_size"] >= 10080
    assert cfg["precision"] == 1


def test_all_entities_have_unique_and_default_ids():
    for f in (REPO / SENSORS).glob("climate_*.yaml"):
        for uid, (domain, cfg) in entities(SENSORS + f.name).items():
            assert cfg["default_entity_id"] == f"{'sensor' if domain == 'sensor' else 'binary_sensor'}.{uid}"


def test_basenames_prefixed_and_unique():
    names = [p.name for p in (REPO / SENSORS).glob("*.yaml")]
    assert all(n.startswith(("climate_", "outdoor_")) for n in names)
    others = {p.name for p in (REPO / "packages").rglob("*.yaml")
              if SENSORS not in str(p)}
    assert not others & set(names)


# ---- season ------------------------------------------------------------

def season(mean="60", pin="Auto", prev=None, heat="58", cool="65"):
    cfg = ent("climate_active_season")
    ha = FakeHA({
        "sensor.outdoor_temperature_7_day_mean": mean,
        "input_select.climate_season": pin,
        "input_number.climate_season_heat_below": heat,
        "input_number.climate_season_cool_above": cool,
    })
    return ha.render_entity(cfg, this_state=prev)


def test_season_is_trigger_based_with_required_triggers():
    block = load(SENSORS + "climate_active_season.yaml")["template"][0]
    kinds = [t["trigger"] for t in block["triggers"]]
    assert kinds == ["state", "homeassistant", "event"]
    assert block["triggers"][0]["entity_id"] == [
        "sensor.outdoor_temperature_7_day_mean", "input_select.climate_season",
        "input_number.climate_season_heat_below", "input_number.climate_season_cool_above"]
    assert block["triggers"][2]["event_type"] == "event_template_reloaded"


@pytest.mark.parametrize("prev", [None, "unknown", "Heating", "Cooling"])
def test_season_auto_below_and_above(prev):
    assert season(mean="50", prev=prev) == "Heating"
    assert season(mean="58", prev=prev) == "Heating"
    assert season(mean="65", prev=prev) == "Cooling"
    assert season(mean="80", prev=prev) == "Cooling"


def test_season_hold_band_keeps_previous():
    assert season(mean="60", prev="Heating") == "Heating"
    assert season(mean="60", prev="Cooling") == "Cooling"
    assert season(mean="64.9", prev="Heating") == "Heating"


def test_season_hold_band_without_prior_uses_61_split():
    for prev in (None, "unknown", "unavailable"):
        assert season(mean="60", prev=prev) == "Heating"
        assert season(mean="61", prev=prev) == "Cooling"
        assert season(mean="63", prev=prev) == "Cooling"


def test_season_pinned_wins():
    assert season(mean="30", pin="Cooling", prev="Heating") == "Cooling"
    assert season(mean="90", pin="Heating", prev="Cooling") == "Heating"
    assert season(mean="unavailable", pin="Cooling") == "Cooling"


def test_season_mean_unavailable_holds_or_defaults_heating():
    assert season(mean="unavailable", prev="Cooling") == "Cooling"
    assert season(mean="unknown", prev="Heating") == "Heating"
    assert season(mean="unavailable", prev=None) == "Heating"
    assert season(mean="unavailable", prev="unknown") == "Heating"


# ---- very cold / indoor dry hysteresis --------------------------------

def hyst(name, value_entity, limit_entity, value, limit, prev):
    ha = FakeHA({value_entity: value, limit_entity: limit})
    cfg = ent(name)
    avail = truthy(ha.render_entity(cfg, "availability"))
    return avail, truthy(ha.render_entity(cfg, "state", this_state=prev))


@pytest.mark.parametrize("t,prev,expected", [
    ("9", "off", True), ("9", "on", True),
    ("10", "off", False), ("10", "on", True), ("11.9", "on", True),
    ("12", "on", False), ("30", "on", False), ("11", "off", False),
])
def test_very_cold_hysteresis(t, prev, expected):
    avail, on = hyst("climate_very_cold", "sensor.tempest_temperature",
                     "input_number.climate_radiant_cold_cutoff", t, "10", prev)
    assert avail and on is expected


@pytest.mark.parametrize("h,prev,expected", [
    ("24", "off", True), ("25", "off", False), ("25", "on", True),
    ("26.9", "on", True), ("27", "on", False),
])
def test_indoor_air_dry_hysteresis(h, prev, expected):
    avail, on = hyst("climate_indoor_air_dry", "sensor.average_indoor_humidity",
                     "input_number.climate_humidity_floor", h, "25", prev)
    assert avail and on is expected


def test_very_cold_and_dry_availability_and_delays():
    for name, src in (("climate_very_cold", "sensor.tempest_temperature"),
                      ("climate_indoor_air_dry", "sensor.average_indoor_humidity")):
        cfg = ent(name)
        assert cfg["delay_on"] == {"minutes": 30} and cfg["delay_off"] == {"minutes": 30}
        assert not truthy(FakeHA({src: "unavailable"}).render_entity(cfg, "availability"))


# ---- price offset ------------------------------------------------------

PRICE = {
    "binary_sensor.energy_prices_are_high": "on",
    "input_boolean.climate_energy_price_automations": "on",
    "input_boolean.entertainment_mode": "off",
    "binary_sensor.extreme_climate": "off",
}


def test_price_offset_requires_all_four():
    cfg = ent("climate_price_offset_active")
    assert truthy(FakeHA(PRICE).render_entity(cfg))
    flips = {"binary_sensor.energy_prices_are_high": "off",
             "input_boolean.climate_energy_price_automations": "off",
             "input_boolean.entertainment_mode": "on",
             "binary_sensor.extreme_climate": "on"}
    for k, v in flips.items():
        assert not truthy(FakeHA({**PRICE, k: v}).render_entity(cfg)), k
    assert cfg["delay_on"] == {"minutes": 15} and cfg["delay_off"] == {"minutes": 15}


# ---- forecast swings ---------------------------------------------------

def forecast(temps):
    return [{"datetime": f"h{i}", "temperature": t} for i, t in enumerate(temps)]


def swing(name, temps, now="40", lookahead="6", amount="8"):
    cfg = ent(name)
    ha = FakeHA(
        {"sensor.tempest_temperature": now,
         "input_number.climate_forecast_lookahead": lookahead,
         "input_number.climate_forecast_swing": amount, FC: "2026-11-24T07:00"},
        {FC: {"forecast": temps}})
    avail = truthy(ha.render_entity(cfg, "availability"))
    # HA never renders state while availability is false
    return avail, avail and truthy(ha.render_entity(cfg, "state"))


def test_cold_swing():
    avail, on = swing("climate_forecast_cold_swing", forecast([40, 38, 35, 32, 31, 30]))
    assert avail and on
    assert swing("climate_forecast_warm_swing", forecast([40, 38, 35, 32, 31, 30]))[1] is False


def test_warm_swing():
    avail, on = swing("climate_forecast_warm_swing", forecast([40, 42, 45, 47, 48, 49]))
    assert avail and on
    assert swing("climate_forecast_cold_swing", forecast([40, 42, 45, 47, 48, 49]))[1] is False


def test_no_swing():
    f = forecast([40, 41, 42, 39, 38, 40])
    for name in ("climate_forecast_cold_swing", "climate_forecast_warm_swing"):
        avail, on = swing(name, f)
        assert avail and not on


def test_swing_exact_threshold_counts():
    assert swing("climate_forecast_cold_swing", forecast([32]))[1]
    assert swing("climate_forecast_warm_swing", forecast([48]))[1]


def test_lookahead_limits_entries():
    f = forecast([40, 40, 40, 20])
    assert not swing("climate_forecast_cold_swing", f, lookahead="3")[1]
    assert swing("climate_forecast_cold_swing", f, lookahead="4.0")[1]


def test_empty_or_missing_forecast_unavailable():
    for name in ("climate_forecast_cold_swing", "climate_forecast_warm_swing"):
        assert swing(name, [])[0] is False
        cfg = ent(name)
        assert not truthy(FakeHA({"sensor.tempest_temperature": "40"}).render_entity(cfg, "availability"))
        assert swing(name, forecast([40]), now="unavailable")[0] is False


def test_swing_delays():
    for name in ("climate_forecast_cold_swing", "climate_forecast_warm_swing"):
        assert ent(name)["delay_off"] == {"minutes": 30}
