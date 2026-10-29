"""Regression test (JK-876): severe_rain_incoming must not fire on snow or sleet.

Renders the precipitation-type condition with real Jinja2 for both triggers.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PATH = REPO / "packages/weather/severe_weather_alert/severe_weather_warning.yaml"


def _template():
    autos = yaml.safe_load(PATH.read_text())["automation"]
    auto = next(a for a in autos if a.get("id") == "severe_rain_incoming")
    cond = next(c for c in auto["conditions"] if c.get("alias") == "Precipitation is not snow or sleet")
    return cond["value_template"]


def _passes(sensors, trigger_id):
    env = Environment()
    env.globals["states"] = lambda e: sensors.get(e, "unknown")
    out = env.from_string(_template()).render(trigger={"entity_id": trigger_id})
    return out.strip() == "True"


@pytest.mark.parametrize("hour", ["0h", "1h"])
@pytest.mark.parametrize("kind", ["intensity", "accumulation"])
@pytest.mark.parametrize("ptype,expected", [
    ("snow", False), ("sleet", False), ("rain", True), ("none", True),
    ("unknown", True), ("unavailable", True),
])
def test_precip_type_gate(hour, kind, ptype, expected):
    sensors = {f"sensor.pirateweather_precip_{hour}": ptype}
    assert _passes(sensors, f"sensor.pirateweather_precip_{kind}_{hour}") is expected


def test_only_the_triggering_hour_is_checked():
    sensors = {"sensor.pirateweather_precip_0h": "snow", "sensor.pirateweather_precip_1h": "rain"}
    assert _passes(sensors, "sensor.pirateweather_precip_intensity_1h") is True
    assert _passes(sensors, "sensor.pirateweather_precip_intensity_0h") is False
