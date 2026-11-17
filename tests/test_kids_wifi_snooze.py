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
NOW = datetime(2026, 11, 16, 20, 25, tzinfo=TZ)
SCHED = datetime(2026, 11, 16, 20, 30, tzinfo=TZ)


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


def test_warning_voice_uses_script_explicit_speakers_and_flag():
    a = auto("kids_wifi_off_warning.yaml")
    assert "voice_warning_enabled" in a["variables"]
    calls = actions_called(a["actions"], "script.voice_announcement")
    assert len(calls) == 1
    assert calls[0]["data"]["media_players"] == ["media_player.sonos_playroom", "media_player.sonos_family_room"]


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


def test_script_window_logic_in_templates():
    s = load("kids_wifi_snooze_script.yaml")["script"]["kids_wifi_snooze"]
    branch_late, branch_short = [d for d in walk(s["sequence"]) if "choose" in d][0]["choose"]
    late = branch_late["conditions"][0]["value_template"]
    short = branch_short["conditions"][0]["value_template"]
    assert "now_ts >= off_ts" in late and "target_ts <= off_ts" in short
    assert s["variables"]["target_ts"].count("sched_ts") == 1  # scheduled + N, not now + N


def test_sensor_availability_guards_unset_helper():
    sensors = load("kids_wifi_snooze_sensors.yaml")["template"][0]["sensor"]
    for s in sensors:
        assert s["device_class"] == "timestamp"
        assert "int(0) > 0" in s["availability"]
        assert "timedelta(minutes=10)" in s["state"]
