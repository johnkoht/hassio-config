"""
Regression tests for state that reset on an HA restart (JK-1262).

Static only. `initial:` on a helper and `initial_state:` on an automation both
re-apply on every restart and discard the restored value, so anything a
runtime action (another automation, the dashboard, a person) can change must
not carry them.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel):
    return yaml.load((REPO / rel).read_text(), Loader=_Loader)


def automation(rel, auto_id):
    doc = load(rel)
    autos = doc["automation"] if isinstance(doc, dict) else doc
    return next(a for a in autos if a["id"] == auto_id)


# Automations that another automation arms or disarms with automation.turn_on/off.
ARMED_AT_RUNTIME = [
    ("packages/family_room/lights/family_room_sleep_mode_off.yaml", "family_room_lights_sleep_mode_off"),
    ("packages/kitchen/lights/kitchen_lights_sleep_mode_off.yaml", "kitchen_lights_sleep_mode_off"),
    ("packages/office/lights/office_lights_motion_off.yaml", "office_lights_motion_off"),
    ("packages/main_bathroom/lights/main_bathroom_lights_motion_on.yaml", "main_bathroom_lights_motion_on"),
    ("packages/main_bathroom/lights/main_bathroom_bedtime_motion_on.yaml", "main_bathroom_bedtime_motion_on"),
    ("packages/people/nearly_home/nearly_home_off.yaml", "nearly_home_off"),
]


@pytest.mark.parametrize("rel,auto_id", ARMED_AT_RUNTIME)
def test_runtime_armed_automation_has_no_initial_state(rel, auto_id):
    assert "initial_state" not in automation(rel, auto_id)


# (file, section, key) of helpers whose value is runtime state.
HELPERS = [
    ("packages/garage/garage_lights_auto.yaml", "input_boolean", "garage_lights_auto"),
    ("packages/main_bedroom/lights/main_bedroom_lights_manually_toggled_boolean.yaml",
     "input_boolean", "main_bedroom_lights_manually_toggled"),
    ("packages/people/john/do_not_disturb/sensors/john_work_laptop_active_boolean.yaml",
     "input_boolean", "john_work_laptop_active"),
    ("packages/main_bathroom/main_bathroom_shower.yaml", "input_number", "main_bathroom_initial_humidity"),
    ("packages/people/john/focus_mode/john_focus_mode.yaml", "input_select", "john_focus_mode"),
    ("packages/laundry/main_level_washer/main_level_washer_status.yaml",
     "input_select", "main_level_washer_status"),
]


@pytest.mark.parametrize("rel,section,key", HELPERS)
def test_runtime_helper_has_no_initial(rel, section, key):
    assert "initial" not in load(rel)[section][key]


def test_upstairs_washer_status_has_no_initial():
    cfg = load("input_select/appliances/upstairs_washer_status.yaml")
    assert "initial" not in cfg
    assert cfg["options"] == ["Idle", "Running", "Finishing", "Clean"]


def test_initial_humidity_is_still_recorded_on_occupancy():
    """With no initial the value is restored, and this automation refreshes it."""
    a = automation("packages/main_bathroom/main_bathroom_shower.yaml", "main_bathroom_set_initial_humidity")
    assert a["triggers"][0]["entity_id"] == "input_boolean.main_bathroom_occupied"


# Garage remotes: a restart or reload during bedtime must leave them locked.
LOCKS = "packages/garage/doors/garage_doors_lock_remotes.yaml"


def test_lock_remotes_still_relocks_on_restart_during_bedtime():
    a = automation(LOCKS, "garage_doors_lock_remotes")
    assert {"trigger": "homeassistant", "event": "start"} in a["triggers"]
    assert a["conditions"] == [
        {"condition": "state", "entity_id": "input_boolean.bedtime", "state": "on"}
    ]


def test_unlock_remotes_does_not_unlock_on_restart_during_bedtime():
    a = automation(LOCKS, "garage_doors_unlock_remotes")
    restart = [t for t in a["triggers"]
               if t.get("event") == "start" or t.get("event_type") == "automation_reloaded"]
    assert len(restart) == 2 and all(t.get("id") == "restart" for t in restart)
    gate = a["conditions"][0]
    assert gate["condition"] == "or"
    kinds = gate["conditions"]
    assert {"condition": "state", "entity_id": "input_boolean.bedtime", "state": "off"} in kinds
    assert {"condition": "not",
            "conditions": [{"condition": "trigger", "id": "restart"}]} in kinds


def test_unlock_remotes_keeps_bedtime_off_and_arrival_triggers():
    a = automation(LOCKS, "garage_doors_unlock_remotes")
    plain = [t for t in a["triggers"] if t["trigger"] == "state"]
    # bedtime-off, immediate arrivals, and held arrivals (JK-1254); none may carry the restart id
    assert len(plain) == 3 and all("id" not in t for t in plain)


# Generic guard: nothing new may be armed by another automation AND forced by initial_state.
# These still do it and are tracked as a follow-up (BACKLOG on JK-1262).
KNOWN_REMAINING = {
    "alarm_arm_if_john_away", "bedtime_mode_vacation_off", "bedtime_mode_vacation_on",
    "cristina_commute_arrived_home_station", "cristina_commute_departed_city_station",
    "cristina_commute_passing_midway_station", "cristina_daily_medication_reminder",
    "cristina_is_not_commuting", "entertainment_mode_deactivated", "foyer_lights_nightlight_off",
    "garage_doors_close_when_home", "garbage_day_is_today_reminder",
    "john_arrived_home_station", "john_departed_city_station", "john_is_not_commuting",
    "john_passing_midway_station", "full_moon_notification", "ninos_bathroom_heater_on",
    "playroom_lights_motion_off", "vacation_mode_turn_off",
}


def _slug(s):
    import re
    return re.sub(r"[^a-z0-9]+", "_", str(s).lower()).strip("_")


def _walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from _walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from _walk(v)


def test_no_new_runtime_armed_automation_forces_initial_state():
    files = [p for root in ("packages", "automation") for p in (REPO / root).rglob("*.yaml")]
    files.append(REPO / "automations.yaml")
    armed, autos = set(), {}
    for p in files:
        try:
            doc = yaml.load(p.read_text(), Loader=_Loader)
        except yaml.YAMLError:
            continue
        for d in _walk(doc):
            act = d.get("action") or d.get("service")
            if act in ("automation.turn_on", "automation.turn_off", "automation.toggle"):
                ent = d.get("entity_id") or (d.get("target") or {}).get("entity_id")
                for e in ent if isinstance(ent, list) else [ent]:
                    if isinstance(e, str):
                        armed.add(e)
            if "alias" in d and "id" in d and ("triggers" in d or "trigger" in d):
                autos["automation." + _slug(d["alias"])] = d
    offenders = {
        e.split(".", 1)[1]: autos[e].get("id")
        for e in armed if e in autos and "initial_state" in autos[e]
    }
    ids = {v for v in offenders.values()}
    assert ids <= KNOWN_REMAINING, sorted(ids - KNOWN_REMAINING)
