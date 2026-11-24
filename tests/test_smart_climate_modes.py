"""
Smart climate modes (task-5): resolver, Away stages, wake learning,
precondition triggers, dry-air push, and the no-clock-literal rule.
Renders the real templates from the real files.
"""
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from smart_climate_harness import FakeHA, Interpreter, REPO, load, make_env

SMART = REPO / "packages" / "climate" / "smart"
ZONES = ["main_floor", "second_floor", "jr_suite", "main_bedroom", "ninos_bedroom", "basement"]
NOW = datetime(2026, 11, 24, 7, 0, tzinfo=timezone.utc)


def auto(rel):
    return load(rel)["automation"][0]


class _Dom:
    def __init__(self, ha, domain):
        self.ha, self.domain = ha, domain

    def __getattr__(self, name):
        ha, ent = self.ha, f"{self.domain}.{name}"

        class E:
            state = ha._states(ent)
            last_changed = ha.changed.get(ent, ha.t - timedelta(hours=1))
        return E


class _States:
    def __init__(self, ha):
        self.ha = ha

    def __call__(self, e):
        return self.ha._states(e)

    def __getattr__(self, domain):
        return _Dom(self.ha, domain)


def ha_with(states, changed=None, now=NOW):
    ha = FakeHA(states, now=now)
    ha.changed = changed or {}
    return ha


def run(rel_actions, ha, trigger):
    it = Interpreter(ha, {"trigger": trigger})
    it.env.globals["states"] = _States(ha)
    return it.run(rel_actions)


# ---------------------------------------------------------------- resolver
RES = "packages/climate/smart/modes/climate_mode_resolve.yaml"


def base(**over):
    s = {
        "input_boolean.climate_automations": "on",
        "input_boolean.house_occupied": "on",
        "input_boolean.vacation_mode": "off",
        "input_boolean.guest_mode": "off",
        "input_boolean.quiet_mode": "off",
        "input_boolean.bedtime": "off",
        "input_boolean.nearly_home": "off",
        "input_boolean.climate_precondition_main_floor": "off",
        "input_boolean.climate_precondition_second_floor": "off",
        "input_number.climate_away_delay": "30.0",
    }
    for z in ZONES:
        s[f"input_select.climate_mode_{z}"] = "Comfort"
    s.update(over)
    return s


def resolve(tid="event", changed=None, **over):
    ha = ha_with(base(**over), changed)
    res = run(auto(RES)["actions"], ha, {"id": tid})
    return res


def selects(res):
    return {a["target"]["entity_id"].replace("input_select.climate_mode_", ""): a["data"]["option"]
            for a in res.actions if a["action"] == "input_select.select_option"}


def all_mode(mode, **over):
    return {f"input_select.climate_mode_{z}": mode for z in ZONES} | over


def test_resolver_shape():
    a = auto(RES)
    assert a["mode"] == "queued" and a["max"] == 10
    assert "variables" not in a and "conditions" not in a
    ids = {t.get("id") for t in a["triggers"]}
    assert ids == {"event", "empty_hold", "minor", "restart"}
    hold = [t for t in a["triggers"] if t.get("id") == "empty_hold"][0]
    assert "climate_away_delay" in hold["for"]["minutes"]
    assert "climate." not in RES_TEXT()


def RES_TEXT():
    return (REPO / RES).read_text().replace("input_", "")


def test_vacation_empty_goes_away():
    r = resolve(**{"input_boolean.house_occupied": "off", "input_boolean.vacation_mode": "on"},
                changed={"input_boolean.house_occupied": NOW - timedelta(minutes=1)})
    assert selects(r) == {z: "Away" for z in ZONES} | {}


def test_empty_past_delay_by_age_goes_away():
    r = resolve(tid="minor", **{"input_boolean.house_occupied": "off"},
                changed={"input_boolean.house_occupied": NOW - timedelta(minutes=31)})
    assert set(selects(r).values()) == {"Away"} and len(selects(r)) == 6


@pytest.mark.parametrize("tid", ["empty_hold", "restart"])
def test_empty_hold_or_restart_trusts_the_timer(tid):
    r = resolve(tid=tid, **{"input_boolean.house_occupied": "off"},
                changed={"input_boolean.house_occupied": NOW - timedelta(minutes=1)})
    assert set(selects(r).values()) == {"Away"}


def test_empty_inside_delay_no_change():
    r = resolve(tid="minor", **{"input_boolean.house_occupied": "off"},
                changed={"input_boolean.house_occupied": NOW - timedelta(minutes=5)})
    assert selects(r) == {}


def test_empty_nearly_home_is_comfort():
    r = resolve(**all_mode("Away", **{"input_boolean.house_occupied": "off", "input_boolean.nearly_home": "on"}))
    assert set(selects(r).values()) == {"Comfort"} and len(selects(r)) == 6


def test_empty_guest_mode_treated_as_occupied():
    r = resolve(tid="empty_hold", **all_mode("Comfort", **{"input_boolean.house_occupied": "off",
                                                          "input_boolean.guest_mode": "on",
                                                          "input_boolean.bedtime": "on"}))
    assert set(selects(r).values()) == {"Sleep"}


def test_bedtime_is_sleep():
    r = resolve(**{"input_boolean.bedtime": "on"})
    assert selects(r) == {z: "Sleep" for z in ZONES}


def test_quiet_sleeps_second_floor_only():
    r = resolve(tid="minor", **{"input_boolean.quiet_mode": "on"})
    assert selects(r) == {"second_floor": "Sleep"}


def test_quiet_does_not_override_away():
    r = resolve(tid="empty_hold", **{"input_boolean.house_occupied": "off", "input_boolean.quiet_mode": "on"})
    assert set(selects(r).values()) == {"Away"}


@pytest.mark.parametrize("tid,cleared", [("event", True), ("empty_hold", True), ("minor", False), ("restart", False)])
def test_override_clears_only_on_events(tid, cleared):
    over = all_mode("Override", **{"input_boolean.house_occupied": "off"} if tid == "empty_hold" else {})
    r = resolve(tid=tid, **over)
    assert bool(selects(r)) is cleared


def test_off_untouched():
    r = resolve(**all_mode("Off", **{"input_boolean.bedtime": "on"}))
    assert selects(r) == {}


def test_select_only_when_different():
    assert selects(resolve()) == {}
    r = resolve(**{"input_boolean.bedtime": "on", "input_select.climate_mode_basement": "Sleep"})
    assert "basement" not in selects(r) and len(selects(r)) == 5


@pytest.mark.parametrize("entity", ["house_occupied", "vacation_mode", "guest_mode", "bedtime",
                                    "quiet_mode", "nearly_home"])
@pytest.mark.parametrize("bad", ["unknown", "unavailable"])
def test_unknown_inputs_do_nothing(entity, bad):
    r = resolve(**{f"input_boolean.{entity}": bad}, **{})
    assert selects(r) == {}


def test_master_off_stops_everything():
    r = resolve(**{"input_boolean.climate_automations": "off", "input_boolean.bedtime": "on",
                   "input_boolean.climate_precondition_main_floor": "on"})
    assert r.actions == []


def test_precondition_flags_off_on_non_restart_only_if_on():
    r = resolve(**{"input_boolean.climate_precondition_main_floor": "on"})
    offs = [a["target"]["entity_id"] for a in r.actions if a["action"] == "input_boolean.turn_off"]
    assert offs == ["input_boolean.climate_precondition_main_floor"]
    r = resolve(tid="restart", **{"input_boolean.climate_precondition_main_floor": "on",
                                  "input_boolean.climate_precondition_second_floor": "on"})
    assert [a for a in r.actions if a["action"] == "input_boolean.turn_off"] == []
    assert resolve().actions == []


# ------------------------------------------------------------ away stages
EXT_ON = "packages/climate/smart/modes/climate_away_extended_on.yaml"
EXT_OFF = "packages/climate/smart/modes/climate_away_extended_off.yaml"


def ext_cond(tid, minutes_empty, **over):
    s = {"input_boolean.house_occupied": "off", "input_number.climate_away_delay": "30.0",
         "input_number.climate_away_extended_delay": "120.0", "input_boolean.vacation_mode": "off"}
    s.update(over)
    ha = ha_with(s, {"input_boolean.house_occupied": NOW - timedelta(minutes=minutes_empty)})
    a = auto(EXT_ON)
    tpl = [c for c in a["conditions"] if c.get("condition") == "template"][0]["value_template"]
    it = Interpreter(ha, {"trigger": {"id": tid}})
    it.env.globals["states"] = _States(ha)
    return it.truthy(tpl)


def test_extended_on_timers():
    a = auto(EXT_ON)
    mins = [t["for"]["minutes"] for t in a["triggers"] if "for" in t]
    ha = ha_with({"input_number.climate_away_delay": "30.0", "input_number.climate_away_extended_delay": "120.0"})
    assert make_env(ha).from_string(mins[0]).render().strip() == "150"
    assert make_env(ha).from_string(mins[1]).render().strip() == "30"
    nh = [c for c in a["conditions"] if c.get("entity_id") == "input_boolean.nearly_home"][0]
    assert nh["state"] == "off"


def test_extended_on_paths():
    assert ext_cond("extended", 150)
    assert not ext_cond("vacation_hold", 30)
    assert ext_cond("vacation_hold", 30, **{"input_boolean.vacation_mode": "on"})
    assert not ext_cond("vacation_on", 10, **{"input_boolean.vacation_mode": "on"})
    assert ext_cond("vacation_on", 31, **{"input_boolean.vacation_mode": "on"})
    assert ext_cond("restart", 151)
    assert not ext_cond("restart", 100)
    assert ext_cond("restart", 40, **{"input_boolean.vacation_mode": "on"})


def test_extended_off():
    a = auto(EXT_OFF)
    ids = {t["entity_id"] for t in a["triggers"]}
    assert ids == {"input_boolean.house_occupied", "input_boolean.nearly_home"}
    assert all(t["to"] == "on" for t in a["triggers"])
    assert a["actions"][0]["action"] == "input_boolean.turn_off"


# ------------------------------------------------------------ wake learning
LEARN = "packages/climate/smart/modes/climate_wake_time_learn.yaml"


def learn(history, hours, hh=7, mm=0):
    now = datetime(2026, 11, 24, hh, mm, tzinfo=timezone.utc)
    ha = ha_with({"input_text.climate_wake_history": history}, now=now)

    class From:
        last_changed = now - timedelta(hours=hours)
    return run(auto(LEARN)["actions"], ha, {"from_state": From})


def csv(v):
    """The harness parses "1,2" into a tuple (HA's wrapper stringifies to the original)."""
    return ",".join(str(x) for x in v) if isinstance(v, (tuple, list)) else str(v)


def calls(res):
    hist = [a for a in res.actions if a["action"] == "input_text.set_value"]
    wake = [a for a in res.actions if a["action"] == "input_datetime.set_datetime"]
    return hist, wake


def test_learn_short_bedtime_records_nothing():
    assert learn("400,410,420", 3.9).actions == []


def test_learn_appends_and_median_odd():
    hist, wake = calls(learn("400,410", 8, 7, 0))   # 420 appended
    assert csv(hist[0]["data"]["value"]) == "400,410,420"
    assert wake[0]["data"]["time"] == "06:50:00"        # median of 400,410,420 = 410


def test_learn_median_even_rounds_to_minute():
    hist, wake = calls(learn("400,411,430", 8, 7, 0))   # 420 appended -> 400,411,420,430
    assert wake[0]["data"]["time"] == "06:56:00"        # (411+420)/2 = 415.5 -> 416


def test_learn_trims_to_seven():
    hist, wake = calls(learn("1,2,3,4,5,6,7", 8, 7, 0))
    assert csv(hist[0]["data"]["value"]) == "2,3,4,5,6,7,420"


def test_learn_first_entry_and_garbage_history():
    for raw in ("", "unknown", "abc,,x", "99999,-5"):
        hist, wake = calls(learn(raw, 8, 7, 0))
        assert csv(hist[0]["data"]["value"]) == "420"
        assert wake[0]["data"]["time"] == "07:00:00"
    hist, _ = calls(learn("x,300,,310", 8, 7, 0))
    assert csv(hist[0]["data"]["value"]) == "300,310,420"


# ------------------------------------------------------------ precondition
def pre_ha(zone, minutes_before_wake, hist="400,410,420", season="Heating", **over):
    wake = NOW + timedelta(minutes=minutes_before_wake)
    s = {
        "input_boolean.bedtime": "on",
        "input_datetime.predicted_wake_time": f"{wake.hour:02d}:{wake.minute:02d}:00",
        "input_text.climate_wake_history": hist,
        "sensor.climate_active_season": season,
        f"input_number.climate_{zone}_comfort_heat": "70.0",
        f"input_number.climate_{zone}_sleep_heat": "66.0",
        f"input_number.climate_{zone}_comfort_cool": "74.0",
        f"input_number.climate_{zone}_sleep_cool": "77.0",
        f"input_number.climate_{zone}_minutes_per_degree": "10.0",
        "input_number.climate_precondition_max_lead": "120.0",
    }
    s.update(over)
    return ha_with(s)


def pre_fire(zone, minutes_before_wake, **kw):
    a = auto(f"packages/climate/smart/precondition/climate_precondition_{zone}_wake.yaml")
    ha = pre_ha(zone, minutes_before_wake, **kw)
    return make_env(ha).from_string(a["triggers"][0]["value_template"]).render().strip() == "True"


@pytest.mark.parametrize("zone", ["main_floor", "second_floor"])
def test_precondition_window(zone):
    # delta 4 x 10 min = 40 min lead
    assert not pre_fire(zone, 41)
    assert pre_fire(zone, 40)
    assert pre_fire(zone, 1)
    assert not pre_fire(zone, 0)      # window closes at wake
    assert not pre_fire(zone, -5)


@pytest.mark.parametrize("zone", ["main_floor", "second_floor"])
def test_precondition_lead_capped_and_cooling(zone):
    cap = {"input_number.climate_precondition_max_lead": "60.0",
           f"input_number.climate_{zone}_minutes_per_degree": "20.0"}   # uncapped 80
    assert not pre_fire(zone, 61, **cap)
    assert pre_fire(zone, 60, **cap)
    # Cooling: sleep_cool - comfort_cool = 3 -> 30 min
    assert pre_fire(zone, 30, season="Cooling") and not pre_fire(zone, 31, season="Cooling")


@pytest.mark.parametrize("zone", ["main_floor", "second_floor"])
def test_precondition_ceil_lead(zone):
    # delta 4 x 10.5 = 42 ; delta 3.5 x 10 = 35 -> ceil on fractions
    assert pre_fire(zone, 42, **{f"input_number.climate_{zone}_minutes_per_degree": "10.3"})  # 41.2 -> 42
    assert not pre_fire(zone, 43, **{f"input_number.climate_{zone}_minutes_per_degree": "10.3"})


@pytest.mark.parametrize("zone", ["main_floor", "second_floor"])
def test_precondition_never_cases(zone):
    flat = {f"input_number.climate_{zone}_sleep_heat": "70.0"}
    assert not pre_fire(zone, 10, **flat)                       # delta 0
    assert not pre_fire(zone, 10, **{f"input_number.climate_{zone}_sleep_heat": "72.0"})  # delta < 0
    assert not pre_fire(zone, 10, hist="400,410")               # < 3 entries
    assert not pre_fire(zone, 10, hist="400,x,,410")            # garbage doesn't count
    assert not pre_fire(zone, 10, **{"input_boolean.bedtime": "off"})
    assert not pre_fire(zone, 10, **{"input_datetime.predicted_wake_time": "unknown"})
    assert not pre_fire(zone, 10, **{"input_number.climate_precondition_max_lead": "0.0"})
    assert not pre_fire(zone, 10, **{f"input_number.climate_{zone}_minutes_per_degree": "0.0"})


@pytest.mark.parametrize("zone", ["main_floor", "second_floor"])
def test_precondition_conditions_and_action(zone):
    a = auto(f"packages/climate/smart/precondition/climate_precondition_{zone}_wake.yaml")
    conds = {(c["entity_id"], c["state"]) for c in a["conditions"]}
    assert conds == {("input_boolean.climate_automations", "on"),
                     (f"input_select.climate_mode_{zone}", "Sleep"),
                     (f"input_boolean.climate_precondition_{zone}", "off")}
    assert a["actions"][0]["action"] == "input_boolean.turn_on"
    assert a["actions"][0]["target"]["entity_id"] == f"input_boolean.climate_precondition_{zone}"


# ------------------------------------------------------------ dry-air push
DRY = "packages/climate/smart/notify/climate_dry_air_notify.yaml"


def dry_ha(live="on"):
    return ha_with({"input_boolean.climate_live_control": live, "sensor.average_indoor_humidity": "27.5"})


def test_dry_air_shape_and_url():
    a = auto(DRY)
    assert a["triggers"][0]["entity_id"] == "binary_sensor.climate_indoor_air_dry"
    act = a["actions"][0]
    assert act["action"] == "script.general_notification"
    d = act["data"]
    assert d["devices"] == "jk" and d["priority"] == "passive"
    assert d["url"] == "/dashboard-kohbo/climate-hvac#climate_settings_popup"


@pytest.mark.parametrize("live,dry", [("on", False), ("off", True), ("unknown", True)])
def test_dry_air_message(live, dry):
    msg = make_env(dry_ha(live)).from_string(auto(DRY)["actions"][0]["data"]["message"]).render().strip()
    assert "27.5" in msg and "radiant" in msg and "skipped" in msg
    assert ("(dry run)" in msg) is dry


def test_dry_air_rate_limit():
    a = auto(DRY)
    tpl = [c for c in a["conditions"] if c.get("condition") == "template"][0]["value_template"]
    ha = dry_ha()
    r = lambda last: ha.render(tpl, this_attrs={"last_triggered": last})
    assert r(None) == "True"
    assert r(NOW - timedelta(hours=13)) == "True"
    assert r(NOW - timedelta(hours=11)) == "False"


# ------------------------------------------------------------ no clock literals
CLOCK = re.compile(r"""(at|after|before)\s*:\s*["']?\d{1,2}:\d{2}|today_at\(\s*["']\d{1,2}:\d{2}""")


def test_no_time_of_day_literals_in_smart_climate():
    files = sorted(SMART.rglob("*.yaml"))
    assert len(files) > 20
    bad = [f"{p.relative_to(REPO)}:{i}" for p in files
           for i, line in enumerate(p.read_text().splitlines(), 1) if CLOCK.search(line)]
    assert bad == []


def test_clock_regex_catches_literals():
    for s in ['at: "06:30:00"', "after: '22:00'", "before: 07:15", "today_at('06:30')", 'today_at("6:30")']:
        assert CLOCK.search(s), s
    assert not CLOCK.search("today_at(wake_s)")
