"""Kids WiFi snooze (JK-1261): structure checks plus a Jinja harness for the gates."""
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml
from jinja2 import Environment

KW = Path(__file__).resolve().parent.parent / "packages/network/kids_wifi"
POPUP = Path(__file__).resolve().parent.parent / "dashboards/kohbo/home/kids_wifi_popup.yaml"
TAG = "kids_wifi_off_warning"


class _L(yaml.SafeLoader):
    pass


for _t in ("!include", "!secret", "!include_dir_named", "!include_dir_list", "!include_dir_merge_list"):
    _L.add_constructor(_t, lambda loader, node: None)


def load(name):
    return yaml.load((KW / name).read_text(), Loader=_L)


def auto(name):
    return load(name)["automation"][0]


def walk(n):
    if isinstance(n, dict):
        yield n
        for v in n.values():
            yield from walk(v)
    elif isinstance(n, list):
        for v in n:
            yield from walk(v)


def actions_called(n, name):
    return [d for d in walk(n) if d.get("action") == name]


def tmpl_condition(auto_cfg, alias_prefix):
    for d in walk(auto_cfg.get("conditions", [])):
        if str(d.get("alias", "")).startswith(alias_prefix):
            return d["value_template"]
    raise AssertionError(alias_prefix)


# ---- Jinja harness ---------------------------------------------------------
TZ = timezone(timedelta(hours=-6))
NOW = datetime(2026, 1, 5, 4, 5, tzinfo=TZ)
SCHED = datetime(2026, 1, 5, 4, 10, tzinfo=TZ)


def render(template, off_at, scheduled=SCHED, now=NOW, switch="on"):
    attrs = {
        "input_datetime.kids_wifi_off_at": off_at,
        "input_datetime.kids_wifi_off_scheduled": scheduled,
    }
    env = Environment()
    env.globals.update(
        now=lambda: now,
        timedelta=timedelta,
        state_attr=lambda e, a: attrs[e].timestamp() if a == "timestamp" and attrs.get(e) else 0,
        is_state=lambda e, s: switch == s if e == "switch.kids_enabled" else False,
    )
    env.filters["timestamp_custom"] = lambda ts, fmt: datetime.fromtimestamp(ts, TZ).strftime("%I:%M %p")
    return env.from_string(template).render().strip()


def render_ctx(template, ctx=None, states=None, now=NOW, attrs=None):
    """Render with arbitrary variables (trigger, minutes, ...) and fake states."""
    states = states or {}
    attrs = attrs or {}
    env = Environment()

    def today_at(v):
        h, m, sec = (int(x) for x in v.split(":"))
        return now.replace(hour=h, minute=m, second=sec, microsecond=0)

    env.globals.update(
        now=lambda: now, timedelta=timedelta, today_at=today_at,
        states=lambda e: states[e],
        state_attr=lambda e, a: attrs[e].timestamp() if a == "timestamp" and attrs.get(e) else 0,
        is_state=lambda e, s: states.get(e) == s,
    )
    env.filters["timestamp_custom"] = lambda ts, fmt: datetime.fromtimestamp(ts, TZ).strftime("%H:%M")
    return env.from_string(template).render(**(ctx or {})).strip()


# ---- structure ---------------------------------------------------------------
def test_all_new_files_parse():
    for f in KW.glob("kids_wifi_*.yaml"):
        assert load(f.name)


def test_warning_triggers_on_sensors_and_has_shutoff_gates():
    a = auto("kids_wifi_off_warning.yaml")
    ats = {t["at"] for t in a["triggers"]}
    assert ats == {"sensor.kids_wifi_weekday_warning_time", "sensor.kids_wifi_weekend_warning_time"}
    cond = yaml.dump(a["conditions"])
    for needle in ("kids_wifi_schedule", "switch.kids_enabled", "kids_school_tomorrow"):
        assert needle in cond


def test_warning_voice_uses_script_auto_rooms_and_flag():
    a = auto("kids_wifi_off_warning.yaml")
    assert "voice_warning_enabled" in a["variables"]
    calls = actions_called(a["actions"], "script.voice_announcement")
    assert len(calls) == 1
    assert calls[0]["data"]["media_players"] == "auto"
    assert calls[0]["data"]["priority"] == "high"


def test_warning_push_actions_url_and_tag():
    a = auto("kids_wifi_off_warning.yaml")
    push = actions_called(a["actions"], "script.general_notification")[0]["data"]
    assert [x["action"] for x in push["actions"]] == ["KIDS_WIFI_SNOOZE_15", "KIDS_WIFI_SNOOZE_30"]
    assert push["url"].startswith("/dashboard-kohbo/home#kids_wifi") and push["tag"] == TAG
    assert not any(x["action"].startswith(("SNOOZE_", "PAUSE_")) for x in push["actions"])


def test_handler_only_handles_its_two_ids():
    a = auto("kids_wifi_snooze_action_handler.yaml")
    cond = a["conditions"][0]["value_template"]
    assert "KIDS_WIFI_SNOOZE_15" in cond and "KIDS_WIFI_SNOOZE_30" in cond
    assert actions_called(a["actions"], "script.kids_wifi_snooze")


def test_script_refusals_push_with_tag_and_url():
    s = load("kids_wifi_snooze_script.yaml")["script"]["kids_wifi_snooze"]
    options = [o for o in s["fields"]["minutes"]["selector"]["select"]["options"]]
    assert options == ["15", "30"]
    choose = [d for d in walk(s["sequence"]) if "choose" in d][0]["choose"]
    assert len(choose) == 2
    for branch in choose:
        push = actions_called(branch["sequence"], "script.general_notification")[0]["data"]
        assert push["tag"] == TAG and push["url"]


def test_every_shutoff_path_clears_the_warning_push():
    for name in ("kids_wifi_off_on_schedule.yaml", "kids_wifi_off_at.yaml", "kids_wifi_off_catch_up.yaml"):
        calls = actions_called(auto(name)["actions"], "script.clear_notifications")
        assert calls and calls[0]["data"]["tag"] == TAG, name


def test_no_clock_times_in_new_files_or_popup():
    pat = re.compile(r"(?<![\d.])([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?(?!\d)")
    files = [f for f in KW.glob("kids_wifi_*.yaml")] + [POPUP]
    for f in files:
        text = "\n".join(l for l in f.read_text().splitlines() if not l.strip().startswith("#"))
        text = text.replace("%-I:%M %p", "")
        assert not pat.search(text), f.name


def test_popup_buttons_call_the_script_and_entities_exist():
    cfg = POPUP.read_text()
    assert cfg.count("script.kids_wifi_snooze") == 2
    helpers = load("kids_wifi_snooze_helpers.yaml")["input_datetime"]
    sensors = load("kids_wifi_snooze_sensors.yaml")["template"][1]["binary_sensor"]
    assert "kids_wifi_off_at" in helpers
    names = {s["default_entity_id"] for s in sensors}
    for e in re.findall(r"binary_sensor\.kids_wifi_[a-z_]+", cfg):
        assert e in names


# ---- gates -------------------------------------------------------------------
def test_off_at_gate_passes_when_it_fires_and_not_when_unsnoozed():
    cond = tmpl_condition(auto("kids_wifi_off_at.yaml"), "A snooze moved")
    snoozed = SCHED + timedelta(minutes=15)
    assert render(cond, snoozed, now=snoozed) == "True"
    assert render(cond, snoozed, now=snoozed + timedelta(seconds=1)) == "True"
    assert render(cond, SCHED, now=SCHED) == "False"


def test_off_on_schedule_skips_only_while_snoozed():
    cond = tmpl_condition(auto("kids_wifi_off_on_schedule.yaml"), "Not snoozed")
    snoozed = SCHED + timedelta(minutes=15)
    # snoozed, inside the window: skip
    assert render(cond, snoozed, now=SCHED) == "False"
    # unsnoozed night (off_at == scheduled), including after an edit to an earlier time
    early = NOW + timedelta(minutes=2)
    assert render(cond, SCHED, now=early) == "True"
    # stale value from yesterday never blocks
    assert render(cond, SCHED - timedelta(days=1), scheduled=SCHED - timedelta(days=1), now=NOW) == "True"


def test_catch_up_is_bounded_to_one_hour():
    cond = tmpl_condition(auto("kids_wifi_off_catch_up.yaml"), "The shutoff passed")
    off = SCHED
    assert render(cond, off, now=off + timedelta(minutes=30)) == "True"
    assert render(cond, off, now=off + timedelta(hours=2)) == "False"
    assert render(cond, off, now=off - timedelta(minutes=5)) == "False"


def _script_eval(minutes, off_at, scheduled=SCHED, now=NOW, switch="on"):
    """Run the script's variables and both refusal conditions; return the branch taken."""
    s = load("kids_wifi_snooze_script.yaml")["script"]["kids_wifi_snooze"]
    attrs = {"input_datetime.kids_wifi_off_at": off_at, "input_datetime.kids_wifi_off_scheduled": scheduled}
    ctx = {"minutes": minutes}
    for k, v in s["variables"].items():
        out = render_ctx(v, ctx, {"switch.kids_enabled": switch}, now, attrs)
        ctx[k] = float(out)
    late, short = [d for d in walk(s["sequence"]) if "choose" in d][0]["choose"]
    for name, branch in (("late", late), ("short", short)):
        if render_ctx(branch["conditions"][0]["value_template"], ctx, {"switch.kids_enabled": switch}, now, attrs) == "True":
            return name, ctx
    return "snooze", ctx


def test_script_target_is_scheduled_plus_n_not_now_plus_n():
    branch, ctx = _script_eval("15", off_at=SCHED)
    assert branch == "snooze"
    assert ctx["target_ts"] == (SCHED + timedelta(minutes=15)).timestamp()
    assert _script_eval("30", off_at=SCHED, now=NOW + timedelta(minutes=3))[1]["target_ts"] == (SCHED + timedelta(minutes=30)).timestamp()


def test_script_ignores_a_shorter_snooze_and_a_closed_window():
    assert _script_eval("15", off_at=SCHED + timedelta(minutes=30))[0] == "short"
    assert _script_eval("30", off_at=SCHED + timedelta(minutes=30))[0] == "short"
    assert _script_eval("15", off_at=SCHED, now=SCHED + timedelta(minutes=1))[0] == "late"
    assert _script_eval("15", off_at=SCHED, switch="off")[0] == "late"
    # stale yesterday value
    old = SCHED - timedelta(days=1)
    assert _script_eval("15", off_at=old, scheduled=old)[0] == "late"


def test_script_pushes_are_important_and_queued():
    s = load("kids_wifi_snooze_script.yaml")["script"]["kids_wifi_snooze"]
    assert s["mode"] == "queued"
    pushes = actions_called(s["sequence"], "script.general_notification")
    assert len(pushes) == 3 and all(p["data"].get("important") is True for p in pushes)


def test_handler_maps_each_action_to_its_minutes():
    a = auto("kids_wifi_snooze_action_handler.yaml")
    tpl = actions_called(a["actions"], "script.kids_wifi_snooze")[0]["data"]["minutes"]
    for action, mins in (("KIDS_WIFI_SNOOZE_15", "15"), ("KIDS_WIFI_SNOOZE_30", "30")):
        assert render_ctx(tpl, {"trigger": {"event": {"data": {"action": action}}}}) == mins


def test_warning_sensors_render_off_time_minus_ten_minutes():
    sensors = load("kids_wifi_snooze_sensors.yaml")["template"][0]["sensor"]
    for s in sensors:
        helper = re.search(r"input_datetime\.kids_wifi_\w+_off_time", s["state"]).group(0)
        out = render_ctx(s["state"], states={helper: "04:30:00"})
        assert out == str(NOW.replace(hour=4, minute=20, second=0))


def test_warning_picks_the_helper_for_its_trigger():
    a = auto("kids_wifi_off_warning.yaml")
    for tid, helper in (("weekday_off", "input_datetime.kids_wifi_weekday_off_time"),
                        ("weekend_off", "input_datetime.kids_wifi_weekend_off_time")):
        assert render_ctx(a["variables"]["off_helper"], {"trigger": {"id": tid}}) == helper


def test_sensor_availability_guards_unset_helper():
    sensors = load("kids_wifi_snooze_sensors.yaml")["template"][0]["sensor"]
    for s in sensors:
        assert s["device_class"] == "timestamp"
        assert "int(0) > 0" in s["availability"]
        assert "timedelta(minutes=10)" in s["state"]


def test_snooze_sensor_states():
    sensors = load("kids_wifi_snooze_sensors.yaml")["template"][1]["binary_sensor"]
    avail = [s for s in sensors if s["unique_id"] == "kids_wifi_snooze_available"][0]["state"]
    attrs = {"input_datetime.kids_wifi_off_at": SCHED}
    on = {"switch.kids_enabled": "on"}
    assert render_ctx(avail, states=on, attrs=attrs) == "True"
    assert render_ctx(avail, states=on, attrs=attrs, now=SCHED + timedelta(minutes=1)) == "False"
    assert render_ctx(avail, states={"switch.kids_enabled": "off"}, attrs=attrs) == "False"
