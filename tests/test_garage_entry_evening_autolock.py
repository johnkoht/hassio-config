"""
Regression tests for the garage entry door evening auto lock (JK-1233).

Static only: nothing here talks to Home Assistant. The conditions are
evaluated with a small interpreter over the real YAML so the daytime and
guard cases are tested against the shipped automation, not a copy.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
DIR = REPO / "packages/mudroom/garage_entry_door"
MAIN = DIR / "garage_entry_door_evening_auto_lock.yaml"
UNLOCK = DIR / "garage_entry_door_evening_auto_lock_unlock_action.yaml"
POPUP = REPO / "dashboards/kohbo/security/garage_entry_lock_popup.yaml"

SWITCH = "input_boolean.garage_entry_door_evening_auto_lock"
TIMER = "timer.garage_entry_door_evening_auto_lock_snooze"
WINDOW = "timer.garage_entry_door_evening_auto_lock_unlock_window"
PEOPLE_SENSORS = [
    "binary_sensor.driveway_front_camera_person_detected",
    "binary_sensor.garage_driveway_person_detected",
    "binary_sensor.backyard_south_person_detected",
    "binary_sensor.backyard_pool_person_detected",
    "binary_sensor.backyard_northwest_person_detected",
    "binary_sensor.backyard_porch_person_detected",
    "binary_sensor.backyard_occupied",
    "binary_sensor.garage_motion_sensor_occupancy",
    "binary_sensor.garage_ble_occupancy",
]


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(path.read_text(), Loader=_Loader)


def walk(node):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for item in node:
            yield from walk(item)


@pytest.fixture(scope="module")
def doc():
    return load(MAIN)


@pytest.fixture(scope="module")
def auto(doc):
    (a,) = doc["automation"]
    return a


def _ids(cond):
    e = cond.get("entity_id", [])
    return [e] if isinstance(e, str) else list(e)


def _state_conds(conds):
    return [c for c in walk(conds) if c.get("condition") == "state"]


# ---------------------------------------------------------------- state-machine evaluation

class World:
    """States for the safe case: night, unlocked and idle for a while."""

    def __init__(self, **over):
        self.s = {
            SWITCH: "on",
            "input_boolean.guest_mode": "off",
            "input_boolean.entertainment_mode": "off",
            "binary_sensor.emergency_active": "off",
            "input_select.notification_level": "Important",
            "sun.sun": "below_horizon",
            "lock.garage_entry_door": "unlocked",
            "binary_sensor.interior_garage_door": "off",
            "binary_sensor.somebody_just_arrived": "off",
            TIMER: "idle",
            "cover.garage_doors": "closed",
        }
        self.s.update({e: "off" for e in PEOPLE_SENSORS})
        self.s.update(over)


def passes(conds, world):
    """Evaluate state / not / and / or conditions; `for:` is treated as met."""
    for c in conds:
        kind = c["condition"]
        if kind == "state":
            want = c["state"]
            for e in _ids(c):
                if world.s.get(e) != want:
                    return False
        elif kind == "time":
            assert c["after"] == "12:00:00"
            if not world.s.get("after_noon", True):
                return False
        elif kind == "not":
            if passes(c["conditions"], world):
                return False
        elif kind == "and":
            if not passes(c["conditions"], world):
                return False
        elif kind == "or":
            if not any(passes([x], world) for x in c["conditions"]):
                return False
        else:
            raise AssertionError(f"unhandled condition {kind}")
    return True


def test_baseline_night_case_passes(auto):
    assert passes(auto["conditions"], World())


def test_morning_dark_hours_block(auto):
    """Dark before sunrise is not evening: the morning unlock must not be re-locked."""
    assert not passes(auto["conditions"], World(after_noon=False))


def test_daytime_blocks(auto):
    assert not passes(auto["conditions"], World(**{"sun.sun": "above_horizon"}))


@pytest.mark.parametrize("entity,value", [
    (SWITCH, "off"),
    ("input_boolean.guest_mode", "on"),
    ("input_boolean.entertainment_mode", "on"),
    ("binary_sensor.emergency_active", "on"),
    ("input_select.notification_level", "None"),
    ("lock.garage_entry_door", "locked"),
    ("binary_sensor.interior_garage_door", "on"),
    ("binary_sensor.somebody_just_arrived", "on"),
    (TIMER, "active"),
    ("cover.garage_doors", "open"),
])
def test_each_gate_blocks(auto, entity, value):
    assert not passes(auto["conditions"], World(**{entity: value}))


@pytest.mark.parametrize("sensor", PEOPLE_SENSORS)
def test_each_outdoor_guard_blocks(auto, sensor):
    """Driveway, back yard and garage all count as somebody outside."""
    assert not passes(auto["conditions"], World(**{sensor: "on"}))


@pytest.mark.parametrize("sensor", PEOPLE_SENSORS)
def test_unavailable_guard_fails_open(auto, sensor):
    """A dead sensor blocks the lock (door stays unlocked), never forces it."""
    assert not passes(auto["conditions"], World(**{sensor: "unavailable"}))


def test_outdoor_guards_need_five_minutes_off(auto):
    guard = [c for c in _state_conds(auto["conditions"])
             if set(PEOPLE_SENSORS) <= set(_ids(c))]
    assert guard and guard[0]["for"] == {"minutes": 5}
    cover = [c for c in _state_conds(auto["conditions"]) if c["entity_id"] == "cover.garage_doors"]
    assert cover[0]["for"] == {"minutes": 5}


def test_lock_and_door_need_the_timeout(auto):
    by = {c["entity_id"]: c for c in _state_conds(auto["conditions"]) if isinstance(c["entity_id"], str)}
    for e in ("lock.garage_entry_door", "binary_sensor.interior_garage_door"):
        assert "auto_lock_timeout" in by[e]["for"]["minutes"]


# ---------------------------------------------------------------- triggers

def test_triggers(auto):
    t = auto["triggers"]
    unlocked = next(x for x in t if x["id"] == "unlocked")
    assert unlocked["entity_id"] == "lock.garage_entry_door" and unlocked["to"] == "unlocked"
    closed = next(x for x in t if x["id"] == "door_closed")
    assert closed["entity_id"] == "binary_sensor.interior_garage_door" and closed["to"] == "off"
    sun = next(x for x in t if x["id"] == "sunset")
    assert sun["trigger"] == "sun" and sun["event"] == "sunset"
    assert sun["offset"] == "00:01:00", "sun.sun must have flipped before the below_horizon gate"


def test_no_start_or_reload_trigger(auto):
    """A reload or restart must never lock the door."""
    for t in auto["triggers"]:
        assert t["trigger"] != "homeassistant"
        assert t.get("event_type") != "automation_reloaded"


def test_retry_triggers_cover_every_blocker(auto):
    cleared = [t for t in auto["triggers"] if t["id"] == "cleared"]
    watched = set()
    for t in cleared:
        e = t["entity_id"]
        watched |= {e} if isinstance(e, str) else set(e)
        assert t["for"]["minutes"] in (5, 10)
    assert set(PEOPLE_SENSORS) <= watched
    assert {"cover.garage_doors", "binary_sensor.somebody_just_arrived"} <= watched
    snooze = next(t for t in auto["triggers"] if t["id"] == "snooze_done")
    assert snooze["event_data"]["entity_id"] == TIMER


def test_mode_single_and_initial_on(auto):
    assert auto["mode"] == "single" and auto["initial_state"] is True
    assert auto["max_exceeded"] == "silent"


def test_timeout_falls_back_when_unreadable(auto):
    """`state | int` of an unavailable helper is 0, which would lock at once."""
    texts = [t["for"]["minutes"] for t in auto["triggers"] if isinstance(t.get("for", {}).get("minutes"), str)]
    assert len(texts) == 2
    env = Environment(undefined=StrictUndefined)
    for text in texts:
        for state, want in (("15.0", "15"), ("unavailable", "15"), ("30.0", "30")):
            env.globals["states"] = lambda e, s=state: s
            assert env.from_string(text).render().strip() == want


# ---------------------------------------------------------------- actions

def _actions(auto):
    return auto["actions"]


def _warn(auto):
    return next(a for a in _actions(auto) if a.get("action") == "script.general_notification")


def test_helpers_have_no_initial(doc):
    assert doc["input_boolean"] and doc["timer"]
    for helper in list(doc["input_boolean"].values()) + list(doc["timer"].values()):
        assert "initial" not in helper
    assert "garage_entry_door_evening_auto_lock" in doc["input_boolean"]
    snooze = doc["timer"]["garage_entry_door_evening_auto_lock_snooze"]
    assert snooze["restore"] is True and snooze["duration"] == "01:00:00"
    window = doc["timer"]["garage_entry_door_evening_auto_lock_unlock_window"]
    assert window["restore"] is True and window["duration"] == "00:30:00"


def test_warning_push_is_time_sensitive_with_snooze(auto):
    data = _warn(auto)["data"]
    assert data["priority"] == "time-sensitive" and data["devices"] == "all"
    assert data["tag"] == "garage-entry-evening-lock"
    assert "2 minutes" in data["message"]
    assert "Snooze" in data["actions"][0]["title"]


@pytest.mark.parametrize("trigger", [
    {"platform": "state", "trigger": "state", "from_state": None},
    {"platform": "sun", "trigger": "sun"},
    {"platform": "event", "trigger": "event"},
])
def test_messages_render_without_from_state(auto, trigger):
    """Sun and event triggers have no from_state; the pushes must not need it."""
    env = Environment(undefined=StrictUndefined)
    for step in walk(_actions(auto)):
        if step.get("action") == "script.general_notification":
            msg = env.from_string(step["data"]["message"]).render(trigger=trigger)
            assert msg.strip()
            assert "from_state" not in step["data"]["message"]


def test_snooze_action_id_is_per_run_and_matches_wait(auto):
    variables = next(a for a in _actions(auto) if "variables" in a)["variables"]
    assert "context.id" in variables["action_snooze"]
    wait = next(a for a in _actions(auto) if "wait_for_trigger" in a)
    assert wait["wait_for_trigger"][0]["event_data"]["action"] == "{{ action_snooze }}"
    assert _warn(auto)["data"]["actions"][0]["action"] == "{{ action_snooze }}"
    assert wait["timeout"] == {"minutes": 2}


def test_snooze_branch_starts_timer_and_stops(auto):
    branch = next(a for a in _actions(auto) if "if" in a and "wait.trigger" in str(a["if"]))
    assert "wait.trigger is not none" in branch["if"][0]["value_template"]
    kinds = [list(s)[0] for s in branch["then"]]
    assert branch["then"][0]["action"] == "timer.start"
    assert branch["then"][0]["target"]["entity_id"] == TIMER
    assert kinds[-1] == "stop"


def _index(auto, pred):
    return next(i for i, a in enumerate(_actions(auto)) if pred(a))


def test_order_warn_wait_recheck_lock(auto):
    warn = _index(auto, lambda a: a.get("action") == "script.general_notification")
    wait = _index(auto, lambda a: "wait_for_trigger" in a)
    snooze = _index(auto, lambda a: "if" in a and "wait.trigger" in str(a["if"]))
    recheck = _index(auto, lambda a: a.get("condition") == "and")
    lock = _index(auto, lambda a: a.get("action") == "lock.lock")
    assert warn < wait < snooze < recheck < lock


def test_recheck_matches_the_conditions(auto):
    """Everything that can change during the warning is checked again."""
    recheck = next(a for a in _actions(auto) if a.get("condition") == "and")
    now = {e for c in _state_conds(recheck["conditions"]) for e in _ids(c)}
    first = {e for c in _state_conds(auto["conditions"]) for e in _ids(c)}
    assert now == first
    # Same polarity for each entity
    def pairs(conds):
        return {(e, c["state"]) for c in _state_conds(conds) for e in _ids(c)}
    assert pairs(recheck["conditions"]) == pairs(auto["conditions"])


def test_lock_call_does_not_loop(auto):
    lock = next(a for a in _actions(auto) if a.get("action") == "lock.lock")
    assert lock["target"]["entity_id"] == "lock.garage_entry_door"
    assert lock["continue_on_error"] is True
    assert not any("repeat" in s for s in walk(_actions(auto)))


def test_locked_push_only_when_locked(auto):
    branch = next(a for a in _actions(auto) if "if" in a and "locked" in str(a["if"]))
    assert branch["if"][0]["entity_id"] == "lock.garage_entry_door"
    assert branch["if"][0]["state"] == "locked"
    ok = next(x for x in branch["then"] if x.get("action") == "script.general_notification")["data"]
    assert ok["priority"] == "passive" and ok["tag"] == "garage-entry-evening-lock"
    assert ok["actions"][0]["action"] == "GARAGE_EVENING_LOCK_UNLOCK"
    assert ok["actions"][0]["authenticationRequired"] is True
    fail = branch["else"][0]["data"]
    # Dropped at level Important unless time-sensitive, and a failed lock matters
    assert fail["priority"] == "time-sensitive" and "actions" not in fail
    started = [x for x in branch["then"] if x.get("action") == "timer.start"]
    assert started[0]["target"]["entity_id"] == WINDOW


def test_no_alarm_or_siren_calls(auto):
    called = {s["action"] for s in walk(_actions(auto))
              if "action" in s and ("target" in s or "data" in s)}
    assert called <= {"script.general_notification", "timer.start", "lock.lock"}
    assert "lock.unlock" not in called


# ---------------------------------------------------------------- unlock handler

def _handler():
    return load(UNLOCK)["automation"][0]


def test_unlock_handler_needs_our_window_and_a_quiet_home():
    a = _handler()
    assert a["triggers"][0]["event_data"]["action"] == "GARAGE_EVENING_LOCK_UNLOCK"
    pairs = {(c["entity_id"], c["state"]) for c in a["conditions"]}
    assert pairs == {
        (WINDOW, "active"),
        ("lock.garage_entry_door", "locked"),
        ("input_boolean.house_occupied", "on"),
        ("input_boolean.bedtime", "off"),
    }
    assert [s["action"] for s in a["actions"]] == ["lock.unlock", "timer.cancel"]
    assert a["actions"][1]["target"]["entity_id"] == WINDOW
    assert a["actions"][0]["target"]["entity_id"] == "lock.garage_entry_door"
    assert a["mode"] == "single"


def test_noon_floor_in_conditions_and_recheck(auto):
    recheck = next(x for x in _actions(auto) if x.get("condition") == "and")
    for conds in (auto["conditions"], recheck["conditions"]):
        times = [c for c in conds if c.get("condition") == "time"]
        assert [c["after"] for c in times] == ["12:00:00"]


def test_only_the_evening_lock_opens_the_unlock_window(auto):
    """A later bedtime or manual lock must not leave an Unlock tap live."""
    def starters(tree):
        return [s for s in walk(tree) if s.get("action") == "timer.start"
                and s.get("target", {}).get("entity_id") == WINDOW]
    everywhere = [s for f in DIR.glob("*.yaml") for s in starters(load(f))]
    assert len(everywhere) == 1 and len(starters(_actions(auto))) == 1


def test_unlock_action_id_matches_the_push(auto):
    pushed = {s["action"] for s in walk(_actions(auto)) if str(s.get("action", "")).startswith("GARAGE_EVENING")}
    handled = _handler()["triggers"][0]["event_data"]["action"]
    assert handled in pushed


# ---------------------------------------------------------------- hygiene

def test_ids_match_filenames(auto):
    assert auto["id"] == MAIN.stem
    assert load(UNLOCK)["automation"][0]["id"] == UNLOCK.stem


def test_old_rules_are_untouched():
    old = load(DIR / "garage_entry_door_lock_if_open_too_long.yaml")["automation"][0]
    assert old["id"] == "garage_entry_door_lock_if_open_too_long"
    assert "initial_state" not in old
    evening = load(DIR / "garage_entry_door_auto_lock_in_evening.yaml")["automation"][0]
    assert evening["initial_state"] is True


def test_popup_has_the_switch_and_shared_timeout():
    text = POPUP.read_text()
    assert f"entity: {SWITCH}" in text
    assert text.count("entity: input_number.garage_entry_door_auto_lock_timeout") == 2
