"""JK-1272: climate dashboard devices (basement/datacenter Awair, garage heat, AQI cards)."""
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CLIMATE = ROOT / "dashboards/kohbo/climate"
AQI_TPL = ROOT / "dashboards/templates/decluttering/climate/kohbo_room_aqi_card.yaml"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!include_dir_list", "!include_dir_merge_list",
             "!include_dir_named", "!include_dir_merge_named"):
    _Loader.add_constructor(_tag, lambda loader, node: loader.construct_scalar(node))


def _load(path):
    return yaml.load(path.read_text(), Loader=_Loader)


def _walk(node, out):
    if isinstance(node, dict):
        out.append(node)
        for v in node.values():
            _walk(v, out)
    elif isinstance(node, list):
        for v in node:
            _walk(v, out)
    return out


def _vars(card):
    merged = {}
    for item in card.get("variables", []):
        merged.update(item)
    return merged


def _decluttered(page, template):
    return [_vars(n) for n in _walk(page, []) if n.get("template") == template
            and n.get("type") == "custom:decluttering-card"]


def test_hvac_room_temps_use_basement_and_datacenter_awair():
    temps = {v["name"]: v["entity"] for v in
             _decluttered(_load(CLIMATE / "hvac.yaml"), "kohbo_room_temperature_card")}
    assert temps["Basement"] == "sensor.awair_element_basement_temperature"
    assert temps["Datacenter"] == "sensor.awair_element_basement_datacenter_temperature"


def test_hvac_shows_garage_heat_outside_the_radiant_conditional():
    page = _load(CLIMATE / "hvac.yaml")
    top_level = [n for c in page["cards"] if isinstance(c, dict)
                 for n in _walk(c, []) if c.get("type") != "conditional"]
    assert any(n.get("entity") == "climate.garage"
               and n.get("template") == "kohbo_thermostat_entity" for n in top_level)
    popups = {v["hash"]: v for v in
              _decluttered(page, "thermostat_radiant_floor_popup")}
    assert popups["#garage_thermostat"]["entity"] == "climate.garage"
    # The old basement popup sensor had a doubled domain prefix.
    assert popups["#basement_thermostat"]["temperature_sensor"] == \
        "sensor.awair_element_basement_temperature"


def test_air_rooms_use_aqi_card_on_awair_scores():
    page = _load(CLIMATE / "air_quality.yaml")
    rooms = _decluttered(page, "kohbo_room_aqi_card")
    entities = {v["entity"] for v in rooms}
    assert "sensor.awair_element_basement_score" in entities
    assert "sensor.awair_element_basement_datacenter_score" in entities
    assert len(rooms) == 8 and all(e.endswith("_score") for e in entities)
    # No score is drawn with the temperature palette any more.
    assert not [v for v in _decluttered(page, "kohbo_room_temperature_card")
                if v["entity"].endswith("_score")]


def test_aqi_card_overrides_percent_and_uses_aqi_bands():
    card = _load(AQI_TPL)["kohbo_room_aqi_card"]["card"]
    assert card["unit"] == "AQI"
    bands = [(t["value"], t["color"].upper()) for t in card["color_thresholds"]]
    assert bands == [(0, "#6155F5"), (20, "#ED4747"), (40, "#E36001"),
                     (60, "#FFD166"), (80, "#06D6A0")]
