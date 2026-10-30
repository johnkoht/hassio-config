"""
Regression tests for the offline / low-battery safety device alert.

The attention sensor's rollup is rendered with jinja2 and stubbed HA functions
(StrictUndefined, results parsed as JSON the way HA does). The alert automation's
conditions are evaluated by a small interpreter over the real YAML, so the
night gate, the new-device rule, the cadence and the snooze are checked as
they are written, for each trigger.
"""
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jinja2
import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
SENSOR = REPO / "packages/system/sensor_health/safety_devices_attention.yaml"
ALERTS = REPO / "packages/system/alerts"
ALERT = ALERTS / "safety_device_offline_alert.yaml"
SNOOZE = ALERTS / "safety_device_alert_snooze_action.yaml"
TIMER = ALERTS / "safety_device_alert_snooze_timer.yaml"
WATCHER = ALERTS / "safety_device_watcher_down.yaml"
CARD = REPO / "dashboards/kohbo/home/_safety_device_notification.yaml"

NOW = datetime(2026, 11, 2, 12, 0, tzinfo=timezone.utc)  # a Monday
SAT = "sensor.safety_devices_attention"


class _Loader(yaml.SafeLoader):
    """SafeLoader that tolerates HA tags such as !secret."""


_Loader.add_multi_constructor("!", lambda loader, suffix, node: loader.construct_scalar(node))


def load(path):
    return yaml.load(path.read_text(), Loader=_Loader)


# --------------------------------------------------------------------------
# Sensor rollup
# --------------------------------------------------------------------------
class St:
    def __init__(self, entity_id, state, minutes_ago=600, name=None):
        self.entity_id, self.state = entity_id, state
        self.last_changed = NOW - timedelta(minutes=minutes_ago)
        self.name = name or entity_id.split(".")[1].replace("_", " ").title()


def sensor_block():
    return load(SENSOR)["template"][0]


def rollup(members, batteries=None, known=(), now=NOW):
    """Render the real rollup. batteries: {entity_id: level-or-state}; every member with a battery gets a device."""
    batteries = batteries or {}
    groups = {"group.leak_sensors": [m for m in members if "leak" in m.entity_id],
              "group.key_sensors_safety": [m for m in members if "leak" not in m.entity_id]}
    env = jinja2.Environment(undefined=jinja2.StrictUndefined)
    env.tests["match"] = lambda v, pat: __import__("re").match(pat, v) is not None
    env.tests["is_state_attr"] = lambda e, a, v: (a == "device_class" and v == "battery" and e.endswith("_battery"))
    env.filters["is_number"] = lambda v: str(v).replace(".", "", 1).lstrip("-").isdigit()
    env.globals.update(
        now=lambda: now, timedelta=timedelta,
        label_entities=lambda l: list(known) if l == "known_issue" else [],
        expand=lambda *g: [m for x in g for m in groups[x]],
        device_id=lambda e: ("dev_" + e) if e in batteries else None,
        device_entities=lambda d: ["sensor.x_temperature", d[4:].replace("binary_sensor.", "sensor.").replace("lock.", "sensor.") + "_battery"],
        states=lambda e: str(batteries.get(e.replace("sensor.", "binary_sensor.", 1).removesuffix("_battery"), batteries.get(e.replace("sensor.", "lock.", 1).removesuffix("_battery"), "unavailable"))),
    )
    v = sensor_block()["actions"][0]["variables"]
    ctx = {"debounce_minutes": v["debounce_minutes"], "low_battery_threshold": v["low_battery_threshold"]}
    out = env.from_string(v["rollup"]).render(**ctx).strip()
    return json.loads(out)


LEAK = "binary_sensor.kitchen_sink_leak_sensor"
LEAK2 = "binary_sensor.laundry_room_leak_sensor"
LOCK = "lock.garage_entry_door"


def test_scope_and_cadence_constants():
    v = sensor_block()["actions"][0]["variables"]
    assert (v["debounce_minutes"], v["low_battery_threshold"]) == (60, 30)
    text = v["rollup"]
    assert "expand('group.leak_sensors', 'group.key_sensors_safety')" in text


def test_sensor_is_trigger_based():
    trig = sensor_block()["triggers"]
    assert {"trigger": "time_pattern", "minutes": "/5"} in trig
    assert {"trigger": "homeassistant", "event": "start"} in trig
    assert any(t.get("event_type") == "event_template_reloaded" for t in trig)


@pytest.mark.parametrize("minutes,listed", [(59, False), (61, True), (5, False), (900, True)])
def test_offline_debounce_and_start_grace(minutes, listed):
    r = rollup([St(LEAK, "unavailable", minutes)])
    assert (r["offline"] == [LEAK]) is listed
    assert r["count"] == (1 if listed else 0)


def test_unknown_counts_as_offline():
    assert rollup([St(LEAK, "unknown")])["offline"] == [LEAK]


def test_online_device_is_ignored():
    assert rollup([St(LEAK, "off")])["count"] == 0


def test_known_issue_is_counted_and_tagged_not_dropped():
    r = rollup([St(LEAK, "unavailable", name="Sump"), St(LEAK2, "unavailable", name="Storage")], known=[LEAK])
    assert r["offline"] == [LEAK2] and r["offline_known"] == [LEAK]
    assert r["count"] == 2
    assert r["names_offline"] == ["Sump (known issue)", "Storage"]


@pytest.mark.parametrize("level,low", [("29", True), ("29.5", True), ("30", False), ("85", False), ("unavailable", False)])
def test_low_battery_threshold(level, low):
    r = rollup([St(LEAK, "off")], batteries={LEAK: level})
    assert (LEAK in r["low"]) is low


def test_low_battery_known_issue_and_names():
    r = rollup([St(LEAK, "off", name="Sump")], batteries={LEAK: "22.0"}, known=[LEAK])
    assert r["low_known"] == {LEAK: 22.0} and r["low"] == {}
    assert r["names_low"] == ["Sump (22%) (known issue)"]


def test_locks_and_covers_never_report_low_battery():
    r = rollup([St(LOCK, "locked")], batteries={LOCK: "5"})
    assert r["low"] == {} and r["count"] == 0


def test_offline_lock_is_still_offline_only():
    r = rollup([St(LOCK, "unavailable")], batteries={LOCK: "5"})
    assert r["offline"] == [LOCK] and r["low"] == {}


def test_count_is_unique_per_device():
    r = rollup([St(LEAK, "unavailable")], batteries={LEAK: "10"})
    assert r["offline"] == [LEAK] and r["low"] == {LEAK: 10.0}
    assert r["count"] == 1


def test_names_with_quotes_survive_the_json_round_trip():
    r = rollup([St(LEAK, "unavailable", name='Kid\'s "Bath" Sensor')])
    assert r["names_offline"] == ['Kid\'s "Bath" Sensor']


def test_state_guards_a_rollup_that_is_not_a_mapping():
    sensor = sensor_block()["sensor"][0]
    assert "rollup is mapping" in sensor["state"] and "rollup['count']" in sensor["state"]
    assert "rollup.count" not in SENSOR.read_text()  # str.count would shadow the key


def test_binary_sensor_is_for_a_state_condition_card():
    b = sensor_block()["binary_sensor"][0]
    assert b["unique_id"] == "safety_devices_need_attention"
    assert "rollup['count'] > 0" in b["state"]


def test_every_leak_sensor_and_safety_member_is_in_scope():
    groups = load(REPO / "packages/leak_monitoring.yaml")["group"]["leak_sensors"]["entities"]
    assert len(groups) == 13
    safety = load(REPO / "packages/system/sensor_health/key_sensor_groups.yaml")["group"]["key_sensors_safety"]["entities"]
    assert "binary_sensor.smoke_detector" in safety and "binary_sensor.garage_glass_break" in safety
    assert "group.leak_sensors" in sensor_block()["actions"][0]["variables"]["rollup"]


# --------------------------------------------------------------------------
# Alert automation: conditions per trigger
# --------------------------------------------------------------------------
def alert():
    return load(ALERT)["automation"][0]


def attrs(offline=(), low=None, off_known=(), low_known=None):
    return {"offline": list(offline), "low_battery": dict(low or {}), "offline_known": list(off_known),
            "low_battery_known": dict(low_known or {}),
            "offline_names": [i.split(".")[1] for i in [*offline, *off_known]],
            "low_battery_names": [f"{i.split('.')[1]} ({int(v)}%)" for i, v in {**(low or {}), **(low_known or {})}.items()]}


class Obj:
    def __init__(self, state, attributes):
        self.state, self.attributes = state, attributes


def world(trig, hour=12, quiet="off", timer="idle", cur=None, prev="same", weekday=1):
    cur = cur if cur is not None else attrs([LEAK])
    count = len(set(cur["offline"]) | set(cur["low_battery"]) | set(cur["offline_known"]) | set(cur["low_battery_known"]))
    prev_attrs = cur if prev == "same" else prev
    return {
        "trigger_id": trig, "hour": hour, "weekday": weekday, "quiet": quiet, "timer": timer,
        "cur": cur, "count": count,
        "to": Obj(str(count), cur), "from": None if prev is None else Obj("0", prev_attrs),
    }


def jenv(w):
    env = jinja2.Environment(undefined=jinja2.StrictUndefined)
    env.globals.update(
        states=lambda e: str(w["count"]) if e == SAT else "unknown",
        state_attr=lambda e, a: w["cur"].get(a) if e == SAT else None,
        now=lambda: type("N", (), {"isoweekday": lambda self: w["weekday"]})(),
    )
    trig = {"id": w["trigger_id"]}
    if w["trigger_id"] == "attention":
        trig.update(to_state=w["to"], from_state=w["from"], entity_id=SAT)
    return env, {"trigger": trig}


def holds(cond, w):
    kind = cond["condition"]
    if kind == "trigger":
        ids = cond["id"] if isinstance(cond["id"], list) else [cond["id"]]
        return w["trigger_id"] in ids
    if kind == "state":
        actual = {"timer.safety_device_alert_snooze": w["timer"], "input_boolean.quiet_mode": w["quiet"]}[cond["entity_id"]]
        return actual == cond["state"]
    if kind == "time":
        return int(cond["after"][:2]) <= w["hour"] < int(cond["before"][:2])
    if kind == "and":
        return all(holds(c, w) for c in cond["conditions"])
    if kind == "or":
        return any(holds(c, w) for c in cond["conditions"])
    if kind == "template":
        env, ctx = jenv(w)
        return env.from_string(cond["value_template"]).render(**ctx).strip() == "True"
    raise AssertionError(kind)


def sends(**kw):
    w = world(**kw)
    return all(holds(c, w) for c in alert()["conditions"])


def test_triggers():
    a = alert()
    assert a["mode"] == "queued"
    ids = {t["id"]: t for t in a["triggers"]}
    assert ids["morning"]["at"] == "09:00:00"
    assert ids["snooze_end"]["event_data"]["entity_id"] == "timer.safety_device_alert_snooze"
    assert ids["attention"]["entity_id"] == SAT and "attribute" not in ids["attention"]


def test_daytime_state_change_with_new_device_sends():
    assert sends(trig="attention", hour=12, prev=attrs([]))


@pytest.mark.parametrize("hour", [0, 4, 6, 21, 23])
def test_state_change_at_night_waits_for_morning(hour):
    assert not sends(trig="attention", hour=hour, prev=attrs([]))


def test_morning_run_sends_a_device_that_crossed_overnight():
    assert sends(trig="morning", hour=9, prev=None)
    assert sends(trig="morning", hour=9, quiet="on")


@pytest.mark.parametrize("trig", ["attention", "snooze_end"])
def test_quiet_mode_holds_non_morning_paths(trig):
    assert not sends(trig=trig, hour=12, quiet="on", prev=attrs([]))


def test_snooze_running_blocks_every_path():
    for trig in ["attention", "morning", "snooze_end"]:
        assert not sends(trig=trig, timer="active", prev=attrs([]))
        assert not sends(trig=trig, timer="paused", prev=attrs([]))


def test_nothing_to_report_sends_nothing():
    for trig in ["attention", "morning", "snooze_end"]:
        assert not sends(trig=trig, cur=attrs([]), prev=attrs([LEAK]))


def test_state_change_needs_a_newly_listed_device():
    assert not sends(trig="attention", cur=attrs([LEAK]), prev=attrs([LEAK, LEAK2]))  # one fixed
    assert not sends(trig="attention", cur=attrs([LEAK]), prev=attrs([LEAK]))  # same set
    assert not sends(trig="attention", cur=attrs([], off_known=[LEAK]), prev=attrs([LEAK]))  # labelled known
    assert not sends(trig="attention", cur=attrs([LEAK], low={LEAK2: 28}), prev=attrs([LEAK], low={LEAK2: 29}))  # level moved
    assert sends(trig="attention", cur=attrs([LEAK, LEAK2]), prev=attrs([LEAK]))  # new device
    assert sends(trig="attention", cur=attrs([LEAK], low={LEAK2: 28}), prev=attrs([LEAK]))  # new low battery


def test_state_change_from_no_baseline_counts_everything_as_new():
    assert sends(trig="attention", cur=attrs([LEAK]), prev=None)
    assert sends(trig="attention", cur=attrs([LEAK]), prev={})


@pytest.mark.parametrize("trig", ["morning", "snooze_end"])
def test_cadence_daily_for_unlabelled_weekly_for_known_issues(trig):
    known_only = attrs([], off_known=[LEAK])
    for day in range(2, 8):  # Tue..Sun
        assert sends(trig=trig, cur=attrs([LEAK]), weekday=day, prev=None, hour=9)
        assert not sends(trig=trig, cur=known_only, weekday=day, prev=None, hour=9)
    assert sends(trig=trig, cur=known_only, weekday=1, prev=None, hour=9)  # Monday


# --------------------------------------------------------------------------
# Message and snooze wiring
# --------------------------------------------------------------------------
def push_action():
    return next(a for a in alert()["actions"] if a.get("action") == "script.general_notification")


def render_push(trig, cur):
    w = world(trig, cur=cur)
    env, ctx = jenv(w)
    variables = next(a for a in alert()["actions"] if "variables" in a)["variables"]
    for k, t in variables.items():
        ctx[k] = env.from_string(t).render(**ctx).strip()
        ctx[k] = eval(ctx[k], {}, {})  # python list literal, as HA's native render would give
    data = push_action()["data"]
    return [env.from_string(data[k]).render(**ctx).strip() for k in ("title", "message")]


@pytest.mark.parametrize("trig", ["attention", "morning", "snooze_end"])
def test_message_renders_for_every_trigger_without_an_entity_id(trig):
    title, msg = render_push(trig, attrs([LEAK, LEAK2], low={"binary_sensor.x": 22}, off_known=["binary_sensor.k"]))
    assert title == "Safety device offline"
    assert msg == "Offline: kitchen_sink_leak_sensor, laundry_room_leak_sensor, k. Low battery: x (22%)."


def test_battery_only_title_and_message():
    title, msg = render_push("morning", attrs([], low={"binary_sensor.x": 22}))
    assert title == "Safety device battery low" and msg == "Low battery: x (22%)."


def test_message_never_reads_the_trigger_entity():
    body = str(alert()["actions"])  # the header comment mentions it; the actions must not use it
    assert "trigger.entity_id" not in body and "trigger.to_state.name" not in body
    assert "from_state" not in body


def test_push_parameters():
    d = push_action()["data"]
    assert (d["devices"], d["priority"], d["tag"]) == ("jk", "time-sensitive", "safety-device-offline")
    assert [a["action"] for a in d["actions"]] == ["SAFETY_ALERT_SNOOZE_DAY", "SAFETY_ALERT_SNOOZE_WEEK"]
    assert [a["title"] for a in d["actions"]] == ["Snooze 1 day", "Snooze 1 week"]


def test_snooze_actions_start_the_timer_with_the_right_duration():
    a = load(SNOOZE)["automation"][0]
    pushed = [x["action"] for x in push_action()["data"]["actions"]]
    by_id = {t["id"]: t["event_data"]["action"] for t in a["triggers"]}
    assert by_id == {"day": pushed[0], "week": pushed[1]}
    branches = {b["conditions"][0]["id"]: b["sequence"][0] for b in a["actions"][0]["choose"]}
    assert set(branches) == {"day", "week"} and "default" not in a["actions"][0]
    assert branches["day"]["data"]["duration"] == {"days": 1}
    assert branches["week"]["data"]["duration"] == {"days": 7}
    for step in branches.values():
        assert step["action"] == "timer.start"
        assert step["target"]["entity_id"] == "timer.safety_device_alert_snooze"
    assert "wait_for_trigger" not in str(a["actions"])


def test_snooze_timer_survives_a_restart():
    t = load(TIMER)["timer"]["safety_device_alert_snooze"]
    assert t["restore"] is True


def test_watcher_covers_unavailable_missing_and_stale():
    t = load(WATCHER)["automation"][0]["triggers"][0]
    tpl = t["value_template"]
    assert t["trigger"] == "template" and t["for"] == {"minutes": 5}
    env = jinja2.Environment()

    def run(state, age):
        s = None if state is None else type("S", (), {"state": state, "last_reported": NOW - timedelta(seconds=age)})()
        env.globals.update(now=lambda: NOW, states=type("St", (), {"sensor": type("X", (), {"safety_devices_attention": s})()})())
        return env.from_string(tpl).render().strip()

    assert run("3", 100) == "False"
    assert run("unavailable", 0) == "True"
    assert run(None, 0) == "True"
    assert run("3", 1300) == "True"  # stale: a render error in the trigger variables


# --------------------------------------------------------------------------
# Dashboard card
# --------------------------------------------------------------------------
def test_home_card_is_a_state_conditional():
    c = load(CARD)
    assert c["type"] == "conditional"
    assert all(x["condition"] == "state" for x in c["conditions"])
    assert c["conditions"][0]["entity"] == "binary_sensor.safety_devices_need_attention"
    assert "safety_device_notification" in (REPO / "dashboards/kohbo/home/home.yaml").read_text()
