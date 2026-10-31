"""
Freezing night car reminder (plans/freezing-night-car-reminder).

Loads the YAML and renders the templates with real Jinja2.
"""
import ast
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PKG = REPO / "packages/vehicles/freezing_car"
LOCAL = timezone(timedelta(hours=-6))
NOW = datetime(2026, 11, 3, 20, 0, tzinfo=LOCAL)  # 20:00 local


def _load(name):
    return yaml.safe_load((PKG / name).read_text())


FORECAST = _load("freezing_car_forecast.yaml")["template"][0]
REMINDER = _load("freezing_car_reminder.yaml")["automation"][0]


def _env(now=NOW, states=None):
    env = Environment()
    env.globals.update(
        now=lambda: now,
        timedelta=timedelta,
        as_datetime=lambda s: datetime.fromisoformat(s),
        as_local=lambda d: d.astimezone(LOCAL),
        states=lambda e: (states or {}).get(e, "unknown"),
    )
    env.filters["float"] = lambda v, d=0: _float(v, d)
    env.filters["round"] = lambda v, p=0: round(v, p)
    return env


def _float(v, d=0):
    try:
        return float(v)
    except (TypeError, ValueError):
        return d


def _vars():
    acts = FORECAST["actions"]
    return next(a for a in acts if "variables" in a)["variables"]


def _hour(local_hour_offset, temp, day=3):
    """Hourly entry at NOW + offset hours, expressed in UTC like the API."""
    at = (NOW + timedelta(hours=local_hour_offset)).astimezone(timezone.utc)
    return {"datetime": at.isoformat(), "temperature": temp}


def _low(hours, now=NOW):
    return _env(now).from_string(_vars()["low"]).render(hours=hours).strip()


def _pick(primary, fallback):
    out = _env().from_string(_vars()["hours"]).render(primary=primary, fallback=fallback)
    return ast.literal_eval(out.strip())


# --- overnight low -------------------------------------------------------
def test_low_is_minimum_over_utc_list():
    hours = [_hour(0, 40), _hour(3, 31), _hour(6, 35)]
    assert _low(hours) == "31"


def test_cutoff_is_0800_local():
    # 08:00 local is +12h; 07:00 is included, 08:00 and later are not
    hours = [_hour(0, 40), _hour(11, 33), _hour(12, 20), _hour(14, 10)]
    assert _low(hours) == "33"


def test_hours_already_past_are_ignored():
    hours = [_hour(-5, 10), _hour(-2, 5), _hour(1, 36)]
    assert _low(hours) == "36"


def test_cutoff_rolls_to_next_morning_after_0800():
    now = datetime(2026, 11, 3, 9, 0, tzinfo=LOCAL)
    hours = [{"datetime": (now + timedelta(hours=h)).astimezone(timezone.utc).isoformat(),
              "temperature": t} for h, t in [(1, 30), (22, 25), (23, 20)]]
    assert _low(hours, now) == "25"  # 08:00 next day excluded


def test_empty_forecast_is_none_and_unavailable():
    assert _low([]) == "none"
    sensor = FORECAST["sensor"][0]
    out = _env().from_string(sensor["availability"])
    # availability is `low is number`; the string 'none' is not a number
    assert "is number" in sensor["availability"]
    assert out.render(low="none") == "False"
    assert out.render(low=31) == "True"


def test_missing_temperature_is_skipped():
    assert _low([{"datetime": _hour(1, 0)["datetime"], "temperature": None}, _hour(2, 33)]) == "33"


# --- fallback ------------------------------------------------------------
def test_fallback_when_primary_empty_or_missing():
    fb = [_hour(1, 30)]
    resp_empty = {"weather.pirateweather": {"forecast": []}}
    resp_fb = {"weather.kpwk": {"forecast": fb}}
    assert _pick(resp_empty, resp_fb) == fb
    assert _pick(None, resp_fb) == fb
    assert _pick({}, {}) == []


def test_primary_wins_when_present():
    pr = [_hour(1, 20)]
    got = _pick({"weather.pirateweather": {"forecast": pr}},
                {"weather.kpwk": {"forecast": [_hour(1, 1)]}})
    assert got == pr


def test_forecast_calls_continue_on_error():
    calls = [a for a in FORECAST["actions"] if a.get("action") == "weather.get_forecasts"]
    assert len(calls) == 2 and all(c["continue_on_error"] for c in calls)


# --- threshold -----------------------------------------------------------
def _freezing(low, threshold):
    t = FORECAST["binary_sensor"][0]["state"]
    env = _env(states={"input_number.freezing_car_threshold": str(threshold)})
    return env.from_string(t).render(low=low).strip() == "True"


def test_threshold_boundary():
    assert _freezing(34, 34) is True
    assert _freezing(35, 34) is False
    assert _freezing(33, 34) is True


def test_binary_sensor_unavailable_without_forecast():
    assert FORECAST["binary_sensor"][0]["availability"] == "{{ low is number }}"
    assert _freezing("none", 34) is False  # even if rendered, never freezing


# --- automation gates ----------------------------------------------------
def _cond_states():
    return {c["entity_id"]: c["state"] for c in REMINDER["conditions"]
            if c.get("condition") == "state"}


def test_automation_state_gates():
    s = _cond_states()
    assert s["input_boolean.house_occupied"] == "on"
    assert s["input_boolean.bedtime"] == "off"
    assert s["input_boolean.freezing_car_reminder"] == "on"
    assert s["binary_sensor.freezing_night_expected"] == "on"
    assert s["binary_sensor.car_outside"] == "on"


def test_not_house_bedtime_gate():
    c = next(c for c in REMINDER["conditions"] if c.get("condition") == "not")
    inner = c["conditions"][0]
    assert inner["entity_id"] == "input_select.house" and inner["state"] == "Bedtime"


def _guard(last):
    c = next(c for c in REMINDER["conditions"] if c.get("alias") == "Not already reminded tonight")
    env = Environment()
    env.globals["now"] = lambda: NOW
    return env.from_string(c["value_template"]).render(this={"attributes": {"last_triggered": last}}).strip()


def test_no_repeat_guard():
    assert _guard(None) == "True"
    assert _guard(NOW - timedelta(hours=11)) == "False"
    assert _guard(NOW - timedelta(hours=13)) == "True"


def test_triggers():
    kinds = [(t["trigger"], t.get("at") or t.get("entity_id")) for t in REMINDER["triggers"]]
    assert ("time", "input_datetime.freezing_car_reminder_time") in kinds
    assert ("state", "binary_sensor.car_outside") in kinds


def test_car_outside_trigger_is_debounced():
    t = next(t for t in REMINDER["triggers"] if t.get("entity_id") == "binary_sensor.car_outside")
    assert t["for"] == "00:10:00"
    assert "for" not in next(t for t in REMINDER["triggers"] if t["trigger"] == "time")


def test_time_window_condition():
    c = next(c for c in REMINDER["conditions"] if c.get("condition") == "time")
    assert c["after"] == "input_datetime.freezing_car_reminder_time"
    assert c["before"] == "08:00:00"


# --- notification --------------------------------------------------------
def _push():
    return next(a for a in REMINDER["actions"] if a.get("action") == "script.general_notification")["data"]


def test_push_is_time_sensitive_with_link():
    d = _push()
    assert d["priority"] == "time-sensitive"
    assert d["devices"] == "all" and d["tag"] == "freezing-car"
    assert d["url"].startswith("/dashboard-kohbo/")


def test_message_renders_on_time_trigger_without_from_state():
    msg = _push()["message"]
    assert "trigger" not in msg
    out = _env(states={"sensor.overnight_low_forecast": "31.0"}).from_string(msg).render()
    assert "31" in out and "garage" in out


# --- helpers & signal ----------------------------------------------------
def test_helpers_have_no_initial():
    text = (PKG / "freezing_car_helpers.yaml").read_text()
    data = yaml.safe_load(text)
    for domain in ("input_boolean", "input_number", "input_datetime"):
        for cfg in data[domain].values():
            assert "initial" not in cfg


def test_car_outside_uses_protect_vehicle_sensors():
    t = _load("car_outside.yaml")["template"][0]
    seen = next(x for x in t["triggers"] if x["id"] == "seen")
    assert set(seen["entity_id"]) == {
        "binary_sensor.driveway_front_camera_vehicle_detected",
        "binary_sensor.garage_driveway_vehicle_detected",
    }
    assert {x["id"] for x in t["triggers"]} == {"seen", "cleared"}
    cleared = [x for x in t["triggers"] if x["id"] == "cleared"]
    door = next(x for x in cleared if x["trigger"] == "state")
    assert door["entity_id"] == "cover.garage_doors" and door["to"] == "closed"
    assert any(x["trigger"] == "time" and x["at"] == "08:00:00" for x in cleared)
    state = t["binary_sensor"][0]["state"]
    env = Environment()
    assert env.from_string(state).render(trigger={"id": "seen"}) == "True"
    assert env.from_string(state).render(trigger={"id": "cleared"}) == "False"
