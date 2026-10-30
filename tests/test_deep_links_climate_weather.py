"""
Deep links for climate and weather pushes (notification-deep-links PR E).

Eco and resume pushes open the thermostat popup for their floor; every weather
push (NWS alerts, rain, UV) opens the weather popup.
"""
import pytest

from test_notification_deep_links import CALLS, VIEWS, link_problem

HVAC = "/dashboard-kohbo/climate-hvac#"
WEATHER = "/dashboard-kohbo/climate#weather"
CLIMATE = "packages/climate/"

EXPECTED = {
    f"{CLIMATE}main_floor/main_floor_climate_to_eco.yaml": [HVAC + "main_floor_thermostat"],
    f"{CLIMATE}main_floor/main_floor_climate_to_resume.yaml": [HVAC + "main_floor_thermostat"],
    f"{CLIMATE}second_floor/second_floor_climate_to_eco.yaml": [HVAC + "upper_floor_thermostat"],
    f"{CLIMATE}second_floor/second_floor_climate_to_resume.yaml": [HVAC + "upper_floor_thermostat"],
    "packages/weather/tempest_alerts/tempest_high_uv_alert.yaml": [WEATHER],
    "packages/weather/tempest_alerts/tempest_rain_amount_alert.yaml": [WEATHER],
    # eight calls: one rain warning and seven NWS branches (six per-alert, one heavy-rain)
    "packages/weather/severe_weather_alert/severe_weather_warning.yaml": [WEATHER] * 8,
}


def calls_in(rel):
    return [(urls) for f, _, urls in CALLS if f == rel]


@pytest.mark.parametrize("rel", sorted(EXPECTED))
def test_push_links_to_its_screen(rel):
    assert sorted(u for urls in calls_in(rel) for u in urls) == EXPECTED[rel]
    assert all(link_problem(u, VIEWS) is None for u in EXPECTED[rel])


@pytest.mark.parametrize("rel", sorted(EXPECTED))
def test_every_push_in_the_file_has_a_link(rel):
    """Adding a branch without a link would slip past the count above."""
    assert all(len(urls) == 1 for urls in calls_in(rel))
