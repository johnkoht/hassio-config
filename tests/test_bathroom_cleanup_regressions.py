"""
Behavioural regression tests for the powder room and mudroom bathroom
automations (JK-1227, JK-1228).

A small condition evaluator runs the real automation conditions against a
state table, so a wrong gate combination (an `or` turned into an `and`, a
dropped lighting_automations check) fails here, not just a structure check.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
ROOMS = ("powder_room", "mudroom_bathroom")


def load(rel):
    return yaml.safe_load((REPO / rel).read_text())


def automation(rel):
    return load(rel)["automation"][0]


class S:
    """State table: entity -> state or (state, age_seconds). Templates come from `tpl`."""

    def __init__(self, states, tpl=None):
        self.states = states
        self.tpl = tpl or {}

    def get(self, eid):
        v = self.states.get(eid, "unavailable")
        return v if isinstance(v, tuple) else (v, 10**6)


def passes(cond, s):
    kind = cond["condition"]
    if kind == "and":
        return all(passes(c, s) for c in cond["conditions"])
    if kind == "or":
        return any(passes(c, s) for c in cond["conditions"])
    if kind == "not":
        return not any(passes(c, s) for c in cond["conditions"])
    if kind == "state":
        state, age = s.get(cond["entity_id"])
        want = cond["state"] if isinstance(cond["state"], list) else [cond["state"]]
        if state not in want:
            return False
        minutes = cond.get("for", {}).get("minutes")
        return minutes is None or age >= minutes * 60
    if kind == "numeric_state":
        state, _ = s.get(cond["entity_id"])
        try:
            val = float(state)
        except ValueError:
            return False
        return val < cond["below"] if "below" in cond else val > cond["above"]
    if kind == "template":
        return s.tpl[cond["value_template"]]
    raise AssertionError(f"unsupported condition {kind}")


def fires(auto, s):
    return all(passes(c, s) for c in auto["conditions"])


# ---------------------------------------------------------------- lights off

LIGHT = {r: f"light.{r}_main_lights" for r in ROOMS}


def lights_off_states(room, mode="Auto", occupied="off", lighting="on", light="on"):
    return S({
        f"input_select.{room}": mode,
        f"input_boolean.{room}_occupied": occupied,
        "input_boolean.lighting_automations": lighting,
        LIGHT[room]: light,
    })


@pytest.mark.parametrize("room", ROOMS)
@pytest.mark.parametrize("mode,occupied,lighting,light,expected", [
    ("Auto", "off", "on", "on", True),    # room emptied
    ("Off", "on", "on", "on", True),      # room Off
    ("Off", "off", "on", "on", True),
    ("Auto", "on", "on", "on", False),    # still occupied
    ("Auto", "off", "off", "on", False),  # lighting automations disabled
    ("Off", "off", "off", "on", False),
    ("Auto", "off", "on", "off", False),  # light already off
])
def test_lights_off_gate(room, mode, occupied, lighting, light, expected):
    auto = automation(f"packages/{room}/lights/{room}_lights_off.yaml")
    assert fires(auto, lights_off_states(room, mode, occupied, lighting, light)) is expected


@pytest.mark.parametrize("room", ROOMS)
def test_lights_off_still_triggers_on_lighting_automations_on(room):
    """Re-enabling lighting automations sweeps lights left on in an empty room."""
    auto = automation(f"packages/{room}/lights/{room}_lights_off.yaml")
    assert any(t.get("entity_id") == "input_boolean.lighting_automations" and t.get("to") == "on"
               for t in auto["triggers"])


# ------------------------------------------------------------ mudroom motion

def motion_states(house="on", mode="Auto", lighting="on", lux="100", light="off"):
    return S({
        "input_boolean.house_occupied": house,
        "input_select.mudroom_bathroom": mode,
        "input_boolean.lighting_automations": lighting,
        "sensor.mudroom_bathroom_illuminance": lux,
        "light.mudroom_bathroom_main_lights": light,
    })


@pytest.mark.parametrize("kwargs,expected", [
    ({}, True),
    ({"house": "off"}, False),
    ({"mode": "Off"}, False),
    ({"lighting": "off"}, False),
    ({"lux": "149"}, True),
    ({"lux": "150"}, False),   # standard threshold is 150, not 200
    ({"lux": "180"}, False),
    ({"light": "on"}, False),
])
def test_mudroom_motion_on_gate(kwargs, expected):
    auto = automation("packages/mudroom_bathroom/lights/mudroom_bathroom_lights_motion_on.yaml")
    assert fires(auto, motion_states(**kwargs)) is expected


# ------------------------------------------------------ mudroom not occupied

DOOR_RECENT = "{{ (as_timestamp(now()) - as_timestamp(states.binary_sensor.mudroom_bathroom_door.last_changed)) | int < 180 }}"


def not_occ_states(occupied="on", motion=("off", 600), occupancy="on", door=("on", 600), door_recent=False):
    return S({
        "input_boolean.mudroom_bathroom_occupied": occupied,
        "binary_sensor.mudroom_bathroom_motion": motion,
        "binary_sensor.mudroom_bathroom_occupancy": occupancy,
        "binary_sensor.mudroom_bathroom_door": door,
    }, {DOOR_RECENT: door_recent})


def test_mudroom_not_occupied_has_single_motion_off_trigger():
    auto = automation("packages/mudroom_bathroom/modes/mudroom_bathroom_not_occupied.yaml")
    motion = [t for t in auto["triggers"] if t["entity_id"] == "binary_sensor.mudroom_bathroom_motion"]
    assert len(motion) == 1 and motion[0]["for"] == {"minutes": 5}


@pytest.mark.parametrize("kwargs,expected", [
    ({"occupied": "off", "occupancy": "off"}, False),              # not occupied: nothing to clear
    ({"occupancy": "off"}, True),                                   # Aqara occupancy cleared
    ({"occupancy": "off", "motion": "on"}, True),
    ({"door": ("on", 600)}, True),                                  # 5 min no motion, door open
    ({"door": ("unavailable", 600)}, True),                         # door sensor offline must not stick
    ({"door": ("off", 600)}, False),                                # door closed: someone is inside
    ({"door": ("on", 600), "motion": ("off", 120)}, False),         # only 2 min of no motion
    ({"door": ("on", 600), "motion": ("on", 600)}, False),
    ({"door": ("off", 60), "motion": ("off", 120), "door_recent": True}, True),  # left via door just now
    ({"door": ("off", 60), "motion": ("on", 5), "door_recent": True}, False),
])
def test_mudroom_not_occupied_gate(kwargs, expected):
    auto = automation("packages/mudroom_bathroom/modes/mudroom_bathroom_not_occupied.yaml")
    assert fires(auto, not_occ_states(**kwargs)) is expected


# --------------------------------------------------------- syntax and headers

def room_files(room):
    return sorted((REPO / "packages" / room).rglob("*.yaml"))


def test_files_found():
    assert len(room_files("powder_room")) == 9 and len(room_files("mudroom_bathroom")) == 10


@pytest.mark.parametrize("room", ROOMS)
def test_every_file_has_header_comment(room):
    for f in room_files(room):
        assert f.read_text().lstrip().startswith("#"), f"{f} has no header comment"


@pytest.mark.parametrize("room", ROOMS)
def test_actions_use_target_blocks(room):
    for f in room_files(room):
        for auto in (yaml.safe_load(f.read_text()) or {}).get("automation", []):
            for act in auto["actions"]:
                assert "entity_id" not in act, f"{f}: root entity_id in action"
                assert "entity_id" not in (act.get("data") or {}), f"{f}: data.entity_id in action"


def test_no_bathoom_typo_left():
    for room in ROOMS:
        for f in room_files(room):
            assert "bathoom" not in f.read_text().lower(), f


# ------------------------------------------------------------- related fixes

def test_mudroom_bathroom_in_first_floor_occupancy():
    text = (REPO / "packages/house/areas/first_floor/first_floor.yaml").read_text()
    data = yaml.safe_load(text)
    assert "input_boolean.mudroom_bathroom_occupied" in data["group"]["first_floor_areas"]["entities"]
    occupied = next(s for s in data["template"][0]["binary_sensor"] if s["unique_id"] == "first_floor_occupied")
    assert "input_boolean.mudroom_bathroom_occupied" in occupied["state"]


def test_mudroom_presence_uses_area_id():
    sensor = load("packages/mudroom/occupancy/mudroom_presence.yaml")["template"][0]["sensor"][0]
    assert "'mud_room'" in sensor["state"] and "'mudroom'" not in sensor["state"]


def test_mudroom_card_room_is_area_id():
    card = load("dashboards/kohbo/rooms/main_floor/partials/mudroom_card.yaml")
    assert {"room": "mud_room"} in card["variables"]
