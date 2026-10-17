"""
Regression tests for sensor.zigbee_routers_online and the routers popup.

The `scan` variable (network_status.yaml) and the popup's filter.template are
rendered with jinja2 and stubbed registry functions, then parsed with
literal_eval the way HA does.
"""
import ast
import json
import re
from pathlib import Path

import jinja2
import yaml

ROOT = Path(__file__).resolve().parent.parent
PACKAGE = ROOT / "packages/system/sensor_health/network_status.yaml"
POPUP = ROOT / "dashboards/kohbo/sensors/zigbee_routers_popup.yaml"

# device_id: (name_by_user, area_id, [entity_ids in registry order])
DEVICES = {
    "plug": ("Smart Plug 18", "playroom",
             ["switch.smart_plug_18_disable_led", "switch.smart_plug_18_child_lock",
              "switch.smart_plug_18_switch", "button.smart_plug_18_identify"]),
    "dimmer": ("Office Light Switch", "office",
               ["switch.office_light_switch_smart_bulb_mode", "light.office_light_switch",
                "switch.office_light_switch_local_protection", "sensor.office_light_switch_lqi"]),
    "extender": ("Range Extender 1", "family_room",
                 ["sensor.range_extender_1_rssi", "sensor.range_extender_1_lqi",
                  "update.range_extender_1_firmware", "button.range_extender_1_identify"]),
    "coordinator_router": ("UZG Router", "deleted_area",
                           ["button.uzg_router_identify", "number.uzg_router_transmit_power"]),
    "bulb": ("Gianluca Ceiling Light 1", "gianlucas_room", ["light.gianluca_ceiling_light_1"]),
    "fan": ("Mudroom Bathroom Fan", "mud_room", ["light.mudroom_bathroom_fan"]),
    "loose": ("Night Light", None, ["light.night_light"]),
    "empty": ("Ghost Plug", "office", []),
}
AREAS = {"playroom": "Playroom", "office": "Office", "family_room": "Family Room",
         "gianlucas_room": "Gianluca's room", "mud_room": "Mud Room"}
STATES = {
    "switch.smart_plug_18_disable_led": "off", "switch.smart_plug_18_child_lock": "off",
    "switch.smart_plug_18_switch": "on", "button.smart_plug_18_identify": "unknown",
    "switch.office_light_switch_smart_bulb_mode": "off", "light.office_light_switch": "on",
    "switch.office_light_switch_local_protection": "off", "sensor.office_light_switch_lqi": "150",
    "sensor.range_extender_1_rssi": "-60", "sensor.range_extender_1_lqi": "90",
    "update.range_extender_1_firmware": "off", "button.range_extender_1_identify": "unknown",
    "button.uzg_router_identify": "unavailable", "number.uzg_router_transmit_power": "unavailable",
    "light.gianluca_ceiling_light_1": "off", "light.mudroom_bathroom_fan": "unavailable",
    "light.night_light": "off",
}


def env(states):
    e = jinja2.Environment()
    e.tests["search"] = lambda v, pat: re.search(pat, str(v)) is not None
    e.filters["regex_replace"] = lambda v, find, repl: re.sub(find, repl, str(v))
    e.filters["int"] = lambda v, default=0: int(v) if str(v).lstrip("-").isdigit() else default
    owner = {ent: d for d, (_, _, ents) in DEVICES.items() for ent in ents}
    e.globals.update(
        label_devices=lambda label: list(DEVICES) if label == "zigbee_router" else [],
        device_entities=lambda d: list(DEVICES.get(d, (None, None, []))[2]),
        device_attr=lambda d, a: {"name_by_user": DEVICES[d][0], "name": None, "area_id": DEVICES[d][1]}[a],
        area_name=lambda a: AREAS.get(a),
        expand=lambda e_: [e_] if e_ in states else [],
        states=lambda e_: states.get(e_, "unknown"),
        device_id=lambda e_: owner.get(e_),
    )
    return e


def scan(states=STATES):
    tpl = yaml.safe_load(PACKAGE.read_text())["template"]
    block = next(b for b in tpl if "triggers" in b)
    out = env(states).from_string(block["actions"][0]["variables"]["scan"]).render().strip()
    return ast.literal_eval(out)


def test_primary_entity_skips_config_and_diagnostic():
    routers = scan()["routers"]
    assert set(routers) == {
        "switch.smart_plug_18_switch",       # not disable_led / child_lock
        "light.office_light_switch",          # Inovelli: config switches skipped, light wins
        "sensor.range_extender_1_lqi",        # nothing else: falls back to LQI, not RSSI
        "number.uzg_router_transmit_power",   # never the identify button
        "light.gianluca_ceiling_light_1",
        "light.mudroom_bathroom_fan",
        "light.night_light",
    }


def test_names_area_prefix_rules():
    r = scan()["routers"]
    assert r["switch.smart_plug_18_switch"] == "Playroom Smart Plug 18"
    assert r["light.office_light_switch"] == "Office Light Switch"           # already starts with area
    assert r["light.gianluca_ceiling_light_1"] == "Gianluca Ceiling Light 1"  # possessive first word
    assert r["light.mudroom_bathroom_fan"] == "Mudroom Bathroom Fan"          # "Mud Room" == "Mudroom"
    assert r["light.night_light"] == "Night Light"                            # no area
    assert r["number.uzg_router_transmit_power"] == "UZG Router"              # deleted area


def test_counts_and_offline():
    s = scan()
    # total is every labelled device; the one with no enabled entity counts as offline
    assert s["total"] == 8
    assert s["offline"] == ["Mudroom Bathroom Fan", "Office Ghost Plug", "UZG Router"]
    sensor = next(b for b in yaml.safe_load(PACKAGE.read_text())["template"] if "triggers" in b)["sensor"][0]
    state = jinja2.Environment().from_string(sensor["state"]).render(scan=s)
    assert (state, sensor["unique_id"]) == ("5", "zigbee_routers_online")
    assert set(sensor["attributes"]) >= {"total", "summary", "offline", "routers"}


def test_popup_sort_offline_then_lqi_then_name():
    s = scan()
    loader = type("L", (yaml.SafeLoader,), {})
    loader.add_constructor("!include", lambda l, n: None)
    card = next(c for c in yaml.load(POPUP.read_text(), Loader=loader)["cards"] if c["type"] == "custom:auto-entities")
    e = env(STATES)
    e.globals["state_attr"] = lambda ent, attr: s["routers"] if (ent, attr) == ("sensor.zigbee_routers_online", "routers") else None
    out = e.from_string(card["filter"]["template"]).render().strip()
    rows = ast.literal_eval(out)  # HA parses with literal_eval: no JSON true/false/null allowed
    assert "true" not in out and "false" not in out and "null" not in out
    assert [r["variables"]["router_name"] for r in rows] == [
        "Mudroom Bathroom Fan", "UZG Router",                    # offline, by name
        "Family Room Range Extender 1", "Office Light Switch",             # LQI 90, 150
        "Gianluca Ceiling Light 1", "Night Light", "Playroom Smart Plug 18",  # no LQI, by name
    ]
    assert rows[3]["variables"]["lqi_entity"] == "sensor.office_light_switch_lqi"
    assert all(r["template"] == "kohbo_zigbee_router_entity" for r in rows)
    json.dumps(rows)


def test_router_row_never_toggles():
    path = ROOT / "dashboards/templates/button_cards/cards/devices/horizontal_device_entity_horizontal_cards/kohbo_zigbee_router_entity.yaml"
    t = yaml.safe_load(path.read_text())["kohbo_zigbee_router_entity"]
    assert t["tap_action"] == {"action": "more-info"}
    assert t["hold_action"] == {"action": "none"}
    assert t["double_tap_action"] == {"action": "none"}


def test_router_group_is_gone():
    assert "key_sensors_zigbee_routers" not in (PACKAGE.parent / "key_sensor_groups.yaml").read_text()
    assert "key_sensors_zigbee_routers" not in (ROOT / "dashboards/kohbo/sensors/sensors.yaml").read_text()
