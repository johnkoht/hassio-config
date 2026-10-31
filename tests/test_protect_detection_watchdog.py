"""
Protect detection watchdog: the stale sensor's maths, the throttled triggers, the reload-once
guard, the wait, the two pushes, and the unavailable->off behaviour of the Protect consumers.

The templates are rendered with jinja2 and stubbed HA functions over the shipped YAML.
"""
import ast
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import jinja2
import pytest
import yaml

from test_notification_deep_links import CALLS, VIEWS, link_problem

REPO = Path(__file__).resolve().parent.parent
DIR = REPO / "packages/security/cameras/protect_watchdog"
STALE = DIR / "protect_detections_stale.yaml"
WATCHDOG = DIR / "protect_detection_watchdog.yaml"
NOW = datetime(2026, 10, 30, 12, 0, tzinfo=timezone.utc)
MOTION = [
    "binary_sensor.front_door_camera_motion",
    "binary_sensor.driveway_front_camera_motion",
    "binary_sensor.garage_driveway_camera_motion",
    "binary_sensor.backyard_south_camera_motion",
    "binary_sensor.backyard_porch_motion_2",
    "binary_sensor.backyard_pool_motion_2",
    "binary_sensor.backyard_northwest_motion_2",
]


def stale_block():
    return yaml.safe_load(STALE.read_text())["template"][0]


def watchdog():
    return yaml.safe_load(WATCHDOG.read_text())["automation"][0]


def render(house):
    """house: {entity_id: (state, age_hours)}. Returns (state, available, newest_motion)."""
    env = jinja2.Environment()
    env.globals["now"] = lambda: NOW
    env.globals["expand"] = lambda *ids: [
        SimpleNamespace(entity_id=e, state=house[e][0], last_changed=NOW - timedelta(hours=house[e][1]))
        for e in ids if e in house
    ]
    env.filters["as_timestamp"] = lambda v: v.timestamp()
    env.filters["timestamp_local"] = lambda v: datetime.fromtimestamp(v, timezone.utc).isoformat()

    def native(tpl, ctx):
        out = env.from_string(tpl).render(**ctx).strip()
        try:
            return ast.literal_eval(out)
        except (ValueError, SyntaxError):
            return out

    block = stale_block()
    ctx = {}
    for key, value in block["actions"][0]["variables"].items():
        ctx[key] = native(value, ctx) if isinstance(value, str) and "{" in value else value
    sensor = block["binary_sensor"][0]
    return (native(sensor["state"], ctx), native(sensor["availability"], ctx),
            native(sensor["attributes"]["newest_motion"], ctx))


def house(ages, state="off"):
    return {e: (state, a) for e, a in zip(MOTION, ages)}


def test_fresh_is_off():
    assert render(house([0.1, 3, 9, 20, 30, 30, 30]))[0] is False


def test_newest_at_5h_is_off():
    assert render(house([5, 8, 9, 20, 30, 30, 30]))[0] is False


def test_newest_at_7h_is_on():
    state, available, newest = render(house([7, 8, 9, 20, 30, 30, 30]))
    assert (state, available) == (True, True)
    assert newest.startswith("2026-10-30T05:00:00")


def test_one_fresh_sensor_among_old_ones_keeps_it_off():
    assert render(house([40, 40, 40, 40, 40, 0.5, 40]))[0] is False


def test_unavailable_and_unknown_are_skipped():
    h = house([0.1, 0.1, 7, 8, 9, 20, 30])
    h[MOTION[0]] = ("unavailable", 0.1)
    h[MOTION[1]] = ("unknown", 0.1)
    assert render(h)[0] is True  # the fresh-looking ones are skipped, 7 h is the newest left


def test_all_missing_is_unavailable_not_on():
    h = house([9] * 7, state="unavailable")
    state, available, newest = render(h)
    assert available is False and state is False and newest is None
    assert render({})[1] is False


def test_start_or_reload_with_restored_sensors_never_reads_on():
    """After a restart every sensor's last_changed is the restart time."""
    assert render(house([0] * 7))[0] is False


def test_threshold_is_six_hours():
    assert stale_block()["actions"][0]["variables"]["stale_after_hours"] == 6


def test_stale_template_is_throttled_and_trigger_based():
    """Live templates saturated the Yellow (2026-10-17): one trigger-based block, 15 min or slower."""
    blocks = yaml.safe_load(STALE.read_text())["template"]
    assert len(blocks) == 1 and "triggers" in blocks[0]
    triggers = blocks[0]["triggers"]
    assert [t["trigger"] for t in triggers] == ["time_pattern", "homeassistant", "event"]
    assert triggers[0]["minutes"] == "/15"
    assert triggers[1]["event"] == "start"
    assert triggers[2]["event_type"] == "event_template_reloaded"
    sensor = blocks[0]["binary_sensor"][0]
    assert sensor["unique_id"] == "protect_detections_stale"
    assert sensor["default_entity_id"] == "binary_sensor.protect_detections_stale"


def test_stale_template_watches_all_seven_motion_sensors():
    text = stale_block()["actions"][0]["variables"]["newest"]
    assert all(f"'{e}'" in text for e in MOTION)
    assert text.count("binary_sensor.") == 7


# ---- the automation -------------------------------------------------------

def test_trigger_is_stale_turning_on_not_from_unavailable():
    (trig,) = watchdog()["triggers"]
    assert trig["entity_id"] == "binary_sensor.protect_detections_stale"
    assert trig["to"] == "on"
    assert set(trig["not_from"]) == {"unavailable", "unknown"}


def guard(last):
    env = jinja2.Environment()
    env.globals["now"] = lambda: NOW
    env.globals["timedelta"] = timedelta
    tpl = watchdog()["conditions"][0]["value_template"]
    out = env.from_string(tpl).render(this=SimpleNamespace(attributes={"last_triggered": last})).strip()
    return out == "True"


@pytest.mark.parametrize("last,expected", [
    (None, True),
    (NOW - timedelta(hours=7), True),
    (NOW - timedelta(hours=5), False),
    (NOW - timedelta(minutes=1), False),
])
def test_reload_once_per_six_hours(last, expected):
    assert guard(last) is expected


def test_guard_reads_its_own_last_triggered():
    tpl = watchdog()["conditions"][0]["value_template"]
    assert "this.attributes.last_triggered" in tpl and "automation." not in tpl


def actions():
    return {a["alias"]: a for a in watchdog()["actions"]}


def test_reload_targets_a_protect_entity_and_survives_failure():
    reload_ = watchdog()["actions"][0]
    assert reload_["action"] == "homeassistant.reload_config_entry"
    assert reload_["target"]["entity_id"] in MOTION
    assert reload_["continue_on_error"] is True


def test_wait_covers_the_seven_sensors_for_an_hour_and_ignores_reload_flicker():
    wait = watchdog()["actions"][1]
    (trig,) = wait["wait_for_trigger"]
    assert sorted(trig["entity_id"]) == sorted(MOTION)
    # unavailable->off during the reload itself must not count as recovery
    assert set(trig["not_from"]) == {"unavailable", "unknown"}
    assert set(trig["not_to"]) == {"unavailable", "unknown"}
    assert wait["timeout"] == {"minutes": 60}
    assert wait["continue_on_timeout"] is True


def test_pushes_recovered_passive_and_failed_time_sensitive():
    step = watchdog()["actions"][2]
    assert "wait.trigger is not none" in step["if"][0]["value_template"]
    ok, bad = step["then"][0]["data"], step["else"][0]["data"]
    assert (ok["priority"], bad["priority"]) == ("passive", "time-sensitive")
    assert "back" in ok["message"] and "Check the NVR" in bad["message"]
    for data in (ok, bad):
        assert data["devices"] == "jk" and data["tag"] == "protect-watchdog"
        assert data["url"] == "/dashboard-kohbo/security-cameras"


def test_push_deep_link_opens_the_cameras_page():
    rel = "packages/security/cameras/protect_watchdog/protect_detection_watchdog.yaml"
    urls = [u for f, _, us in CALLS if f == rel for u in us]
    assert urls == ["/dashboard-kohbo/security-cameras"] * 2
    assert link_problem(urls[0], VIEWS) is None


def test_dashboard_row_shows_the_stale_sensor_and_its_attribute():
    text = (REPO / "dashboards/kohbo/security/cameras/cameras.yaml").read_text()
    assert "binary_sensor.protect_detections_stale" in text
    assert "attribute: newest_motion" in text


# ---- unavailable->off consumers (the reload's side effect) ----------------

LOCK = REPO / "packages/mudroom/garage_entry_door/garage_entry_door_evening_auto_lock.yaml"
FLOOD = REPO / "packages/security/lighting/garage_flood/security_lighting_garage_flood_motion_off.yaml"


class _Loader(yaml.SafeLoader):
    pass


_Loader.add_constructor("!secret", lambda loader, node: None)


def _auto(path):
    return yaml.load(path.read_text(), Loader=_Loader)["automation"][0]


def test_lock_reevaluation_after_a_reload_is_safe_without_a_not_from_guard():
    """
    A Protect reload takes the person sensors unavailable -> off. The "cleared" trigger then fires
    after 5 min, which is correct (a sensor stuck on during a freeze is released) and safe: the
    conditions still require every outdoor sensor off for 5 min, and the 2 minute warning push
    with its snooze still goes out first. A not_from guard would leave a door unlocked after a
    stuck-on freeze, so none is added on purpose.
    """
    auto = _auto(LOCK)
    cleared = [t for t in auto["triggers"] if t.get("id") == "cleared" and isinstance(t.get("entity_id"), list)]
    assert cleared and all(t["for"] == {"minutes": 5} and "not_from" not in t for t in cleared)
    cond = [c for c in auto["conditions"] if c.get("state") == "off" and "binary_sensor.backyard_occupied" in c.get("entity_id", [])]
    assert cond and cond[0]["for"] == {"minutes": 5}
    assert auto["actions"][0]["variables"] and auto["actions"][1]["action"] == "script.general_notification"


def test_flood_off_after_a_reload_still_requires_all_detections_off():
    auto = _auto(FLOOD)
    off = [t for t in auto["triggers"] if t.get("to") == "off" and t["entity_id"] != "light.driveway_flood_light"]
    assert off and all(t["for"]["minutes"] >= 3 for t in off)
    assert auto["conditions"][0]["state"] == "off"
    assert "binary_sensor.driveway_front_camera_person_detected" in auto["conditions"][0]["entity_id"]
