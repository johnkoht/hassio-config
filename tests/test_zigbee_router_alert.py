"""The router alert covers every zigbee_router-labelled ZHA device (62 as of 2026-11-16)."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
ALERT = REPO / "packages/system/alerts/zigbee_router_unavailable.yaml"


def _watched():
    auto = yaml.safe_load(ALERT.read_text())["automation"][0]
    (trigger,) = auto["triggers"]
    assert trigger["to"] == "unavailable" and trigger["for"] == {"minutes": 15}
    return trigger["entity_id"]


# Each zigbee_router-labelled ZHA device's primary entity, from the live inventory.
# A new router needs the label, an entry in the alert and an entry here.
ROUTERS = {
    "switch.family_room_smart_plug_25",
    "switch.gazebo_smart_plug_switch",
    "switch.hsp2",
    "switch.hue_smart_plug_1",
    "switch.ikea_of_sweden_inspelning_smart_plug",
    "switch.office_office_lamp",
    "switch.smart_plug_1_switch",
    "switch.smart_plug_2_switch",
    "switch.smart_plug_3_switch",
    "switch.smart_plug_4_switch",
    "switch.smart_plug_5_switch",
    "switch.smart_plug_6_switch",
    "switch.smart_plug_7_switch",
    "switch.smart_plug_8_switch",
    "switch.smart_plug_9_switch",
    "switch.smart_plug_10_switch",
    "switch.smart_plug_11_switch",
    "switch.smart_plug_12_switch",
    "switch.smart_plug_13_switch",
    "switch.smart_plug_14_switch",
    "switch.smart_plug_15_switch",
    "switch.smart_plug_16_switch",
    "switch.smart_plug_17_switch",
    "switch.smart_plug_18_switch",
    "switch.smart_plug_19_switch",
    "switch.smart_plug_20_switch",
    "switch.smart_plug_21_switch",
    "switch.smart_plug_22_switch",
    "switch.smart_plug_23_switch",
    "switch.tradfri_smart_plug_1_switch",
    "switch.tradfri_smart_plug_2_switch",
    "switch.tradfri_smart_plug_4_switch",
    "switch.upstairs_drying_machine",
    "light.gianluca_ceiling_light_switch",
    "light.laundry_room_main_lights",
    "light.main_bathroom_toilet_light",
    "light.mudroom_bathroom_fan",
    "light.mudroom_bathroom_main_lights",
    "light.office_light_switch",
    "light.powder_room_fan_switch",
    "light.powder_room_main_lights",
    "light.driveway_flood_light",
    "light.exterior_backyard_flood_east",
    "light.exterior_backyard_flood_west",
    "light.gianluca_ceiling_light_1",
    "light.gianluca_ceiling_light_2",
    "light.gianluca_ceiling_light_3",
    "light.gianluca_ceiling_light_4",
    "light.gianluca_lamp",
    "light.hue_outdoor_spot_7",
    "light.hue_spot_11_light",
    "light.hue_spot_12_light",
    "light.hue_spot_13_light",
    "light.hue_spot_14_light",
    "light.laundry_room_nightlight",
    "light.office_light_1",
    "light.office_light_2",
    "light.office_light_3",
    "light.office_light_4",
    "light.upstairs_hallway_nightlight_light",
    "sensor.al001_wg001_z01_lqi",
    "sensor.al001_wg001_z01_lqi_2",
}


def test_alert_list_is_the_full_inventory():
    watched = _watched()
    assert len(watched) == len(set(watched))
    assert set(watched) == ROUTERS, (set(watched) ^ ROUTERS)


def test_alert_skips_a_coordinator_outage_and_pushes_per_router():
    auto = yaml.safe_load(ALERT.read_text())["automation"][0]
    assert auto["mode"] == "queued"
    assert "'loaded'" in auto["conditions"][0]["value_template"]
    data = auto["actions"][0]["data"]
    assert "trigger.entity_id" in data["tag"]
    assert "zigbee_routers_online" in data["message"]


def test_alert_covers_the_christmas_plugs():
    # Both tree plugs were missing until 2026-11-16
    groups = yaml.safe_load((REPO / "packages/holidays/christmas/lights/christmas_lights_group.yaml").read_text())
    plugs = {
        e for g in groups["switch"] if g["unique_id"] in ("christmas_trees", "christmas_playroom_lights")
        for e in g["entities"]
    }
    assert plugs and plugs <= set(_watched()), plugs - set(_watched())


def test_alert_covers_every_numbered_smart_plug_on_the_dashboards():
    import re
    text = "".join(p.read_text() for p in (REPO / "dashboards").rglob("*.yaml"))
    plugs = set(re.findall(r"switch\.(?:family_room_)?smart_plug_\d+(?:_switch)?\b", text))
    assert plugs and plugs <= set(_watched()), plugs - set(_watched())
