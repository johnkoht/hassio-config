"""Crazy Mode: structure checks for the guards the plan pins, plus Jinja
harnesses that render the allowed-window sensor, the zone config, the phase
timer progress and the length clamp. Times here are synthetic.

Set CRAZY_MODE_DIR to point the tests at a scratch copy of the package (used
to prove each guard goes red when sabotaged).
"""
import ast
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

ROOT = Path(__file__).resolve().parent.parent
PKG = Path(os.environ.get("CRAZY_MODE_DIR", ROOT / "packages/house/crazy_mode"))
POPUP = ROOT / "dashboards/kohbo/home/crazy_mode_popup.yaml"
BANNER = ROOT / "dashboards/kohbo/home/_crazy_mode_active_notification.yaml"
VACUUM_BANNER = ROOT / "dashboards/kohbo/home/_vacuum_active_notification.yaml"
HOME = ROOT / "dashboards/kohbo/home/home.yaml"

# The v1 main-floor lists, pinned: Main floor must keep them exactly.
V1_SPEAKERS = [
    "media_player.sonos_kitchen",
    "media_player.sonos_family_room",
    "media_player.sonos_living_room",
    "media_player.sonos_playroom",
]
V1_LIGHTS = [
    "light.kitchen_main_light_switch",
    "light.kitchen_table_light_switch",
    "light.kitchen_island_pendants",
    "light.family_room_main_lights",
    "light.foyer_ceiling_lights",
    "light.foyer_chandelier",
    "light.foyer_coat_closet",
    "light.stairs_light",
    "light.stairs_sconces",
    "light.dining_room_main_lights",
    "light.living_room_main_lights",
]
V1_AL = [
    "switch.adaptive_lighting_kitchen",
    "switch.adaptive_lighting_family_room",
    "switch.adaptive_lighting_foyer",
]
V1_EMERGENCY = [
    "light.kitchen_lights",
    "light.family_room_main_lights",
    "light.foyer_lights",
    "light.dining_room_lights",
]
SPEAKERS = V1_SPEAKERS + ["media_player.sonos_basement"]
ZONE_KEYS = {"speakers", "coordinator", "lights", "al_switches", "emergency_lights",
             "kitchen_latch", "snapshot_scene"}
RUN = "script.crazy_mode_run"
CONTROLS = ["script.crazy_mode_restart", "script.crazy_mode_pause", "script.crazy_mode_resume"]


class _L(yaml.SafeLoader):
    pass


for _t in ("!include", "!secret", "!include_dir_named", "!include_dir_list", "!include_dir_merge_list"):
    _L.add_constructor(_t, lambda loader, node: None)


def load(name):
    return yaml.load((PKG / name).read_text(), Loader=_L)


def load_path(path):
    return yaml.load(Path(path).read_text(), Loader=_L)


def walk(n):
    if isinstance(n, dict):
        yield n
        for v in n.values():
            yield from walk(v)
    elif isinstance(n, list):
        for v in n:
            yield from walk(v)


def walk_anc(n, anc=()):
    """Yield (node, ancestors) so a test can ask what guards a call sits under."""
    if isinstance(n, dict):
        yield n, anc
        for v in n.values():
            yield from walk_anc(v, anc + (n,))
    elif isinstance(n, list):
        for v in n:
            yield from walk_anc(v, anc)


def called(n, name):
    return [d for d in walk(n) if d.get("action") == name]


def script(name):
    return load(f"{name}.yaml")["script"][name]


def seq(name):
    return script(name)["sequence"]


def step_index(steps, pred):
    for i, s in enumerate(steps):
        if pred(s):
            return i
    raise AssertionError("step not found")


def render_plain(template, **ctx):
    return Environment().from_string(template).render(**ctx).strip()


# ---- Harness for the zone config and the allowed sensor ---------------------
TZ = timezone(timedelta(hours=-6))
NOW = datetime(2026, 1, 5, 3, 10, tzinfo=TZ)  # synthetic
MID = NOW.replace(hour=0, minute=0, second=0, microsecond=0)


def secs(hhmm):
    h, m = (int(x) for x in hhmm.split(":"))
    return h * 3600 + m * 60


def zone_cfg():
    attrs = load("crazy_mode_zone_config.yaml")["template"][0]["sensor"][0]["attributes"]
    return {k: ast.literal_eval(render_plain(v)) for k, v in attrs.items()}


ZONES = zone_cfg()
GOOD_SOURCES = ["Alpha", "Beta", "Gamma", "Other"]
BASE = {
    "input_select.crazy_mode_phase": "Off",
    "input_select.crazy_mode_zone": "Main floor",
    "binary_sensor.emergency_active": "off",
    "input_select.house": "Auto",
    "input_boolean.house_occupied": "on",
    "input_text.crazy_mode_favorite_crazy": "Alpha",
    "input_text.crazy_mode_favorite_slowmo": "Beta",
    "input_text.crazy_mode_favorite_cooldown": "Gamma",
}
# synthetic windows: 03:00-03:30 and 04:00-04:30
WINDOWS = {
    "input_datetime.crazy_mode_morning_start": secs("03:00"),
    "input_datetime.crazy_mode_morning_end": secs("03:30"),
    "input_datetime.crazy_mode_evening_start": secs("04:00"),
    "input_datetime.crazy_mode_evening_end": secs("04:30"),
}


def sensor_cfg():
    return load("crazy_mode_allowed.yaml")["template"][0]["sensor"][0]


def favorites_cfg():
    return load("crazy_mode_allowed.yaml")["template"][2]["sensor"][0]


def make_env(now, st, at, src, zones):
    env = Environment()
    mid = now.replace(hour=0, minute=0, second=0, microsecond=0)

    def state_attr(e, a):
        if e == "sensor.crazy_mode_zone_config":
            return zones.get(a) if zones is not None else None
        if a == "timestamp":
            return at.get(e)
        if a == "source_list":
            return src.get(e)
        return None

    env.globals.update(
        now=lambda: now,
        today_at=lambda v: mid.replace(hour=int(v.split(":")[0]), minute=int(v.split(":")[1])),
        states=lambda e: st.get(e, "unknown"),
        state_attr=state_attr,
        is_state=lambda e, s: st.get(e) == s,
    )
    return env, state_attr


def render(template, now=NOW, states=None, attrs=None, sources=None, zones="default", ok_zones=None):
    st = dict(BASE)
    st.update(states or {})
    at = dict(WINDOWS)
    at["input_datetime.crazy_mode_last_run"] = 0
    at.update(attrs or {})
    src = {sp: GOOD_SOURCES for sp in SPEAKERS}
    src.update(sources or {})
    zn = ZONES if zones == "default" else zones
    env, base_attr = make_env(now, st, at, src, zn)
    if ok_zones is None:
        fav = favorites_cfg()["attributes"]["ok_zones"]
        ok_zones = ast.literal_eval(env.from_string(fav).render().strip())

    def state_attr(e, a):
        if e == "sensor.crazy_mode_favorites" and a == "ok_zones":
            return ok_zones
        return base_attr(e, a)

    env.globals["state_attr"] = state_attr
    return env.from_string(template).render().strip()


def reason(**kw):
    kw.setdefault("sources", None)
    return render(sensor_cfg()["state"], **kw)


def retry(**kw):
    return render(sensor_cfg()["attributes"]["retry"], **kw)


def last_run_at(hhmm, now=NOW):
    mid = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return {"input_datetime.crazy_mode_last_run": mid.timestamp() + secs(hhmm)}


def at(hhmm):
    h, m = (int(x) for x in hhmm.split(":"))
    return NOW.replace(hour=h, minute=m)


# ---- files and helpers ------------------------------------------------------
def test_all_files_parse():
    files = sorted(PKG.glob("crazy_mode_*.yaml"))
    assert len(files) >= 17
    for f in files:
        assert load(f.name), f.name


def test_no_initial_on_any_helper():
    for f in PKG.glob("*.yaml"):
        for d in walk(load(f.name)):
            assert "initial" not in d, f"{f.name} has initial:"
            assert "initial_state" not in d, f"{f.name} has initial_state:"


def test_no_times_in_yaml():
    # Only the one-minute timer duration and midnight may appear; window times are dashboard-set.
    allowed = {"00:00", "00:01:00"}
    for f in [*PKG.glob("*.yaml"), POPUP, BANNER]:
        # Comments describe run lengths ("5:00 of Crazy"), so only code lines count
        code = "\n".join(l.split(" #")[0] for l in f.read_text().splitlines() if not l.lstrip().startswith("#"))
        for m in re.finditer(r"(?<![\d:])\d{1,2}:\d{2}(?::\d{2})?(?![\d:])", code):
            assert m.group(0) in allowed, f"{f.name}: {m.group(0)}"


def test_window_helpers_are_time_only_and_last_run_has_date():
    h = load("crazy_mode_helpers.yaml")["input_datetime"]
    for k in ("morning_start", "morning_end", "evening_start", "evening_end"):
        assert h[f"crazy_mode_{k}"]["has_time"] is True and h[f"crazy_mode_{k}"]["has_date"] is False
    assert h["crazy_mode_last_run"]["has_date"] and h["crazy_mode_last_run"]["has_time"]


def test_phase_options_and_helpers_exist():
    hh = load("crazy_mode_helpers.yaml")
    assert hh["input_select"]["crazy_mode_phase"]["options"] == ["Off", "Crazy", "Slow-mo", "Cool-down"]
    assert hh["input_select"]["crazy_mode_zone"]["options"] == ["Main floor", "Basement"]
    assert "crazy_mode_phase" in hh["timer"]
    assert set(hh["input_text"]) == {
        "crazy_mode_favorite_crazy", "crazy_mode_favorite_slowmo", "crazy_mode_favorite_cooldown",
        "crazy_mode_active_zone"}
    v = hh["input_number"]["crazy_mode_base_volume"]
    assert v["unit_of_measurement"] == "%" and v["min"] < v["max"]
    assert "crazy_mode_paused" in hh["input_boolean"]


def test_length_slider_is_two_to_fifteen_in_one_minute_steps():
    n = load("crazy_mode_helpers.yaml")["input_number"]["crazy_mode_crazy_minutes"]
    assert (n["min"], n["max"], n["step"], n["mode"]) == (2, 15, 1, "slider")


def test_timer_has_a_nonzero_default_duration():
    t = load("crazy_mode_helpers.yaml")["timer"]["crazy_mode_phase"]
    assert t["duration"] == "00:01:00"


def test_every_timer_start_in_the_run_has_a_duration():
    for d in called(seq("crazy_mode_run"), "timer.start"):
        assert d["data"]["duration"]


def test_no_package_file_writes_the_room_flag():
    for f in PKG.glob("*.yaml"):
        text = f.read_text()
        assert "kitchen_lighting_automations" not in text, f.name
        assert "kitchen_occupied" not in text, f.name


# ---- zone config ------------------------------------------------------------
def test_every_zone_has_every_key():
    assert set(ZONES) == {"main_floor", "basement"}
    for name, z in ZONES.items():
        assert set(z) == ZONE_KEYS, name


def test_main_floor_matches_the_v1_lists_exactly():
    z = ZONES["main_floor"]
    assert z["speakers"] == V1_SPEAKERS
    assert z["coordinator"] == "media_player.sonos_kitchen"
    assert z["lights"] == V1_LIGHTS
    assert z["al_switches"] == V1_AL
    assert z["emergency_lights"] == V1_EMERGENCY
    assert z["kitchen_latch"] is True
    assert z["snapshot_scene"] == "crazy_mode_snapshot_main_floor"


def test_basement_is_music_only():
    z = ZONES["basement"]
    assert z["speakers"] == ["media_player.sonos_basement"]
    assert z["coordinator"] == "media_player.sonos_basement"
    assert z["lights"] == [] and z["al_switches"] == [] and z["emergency_lights"] == []
    assert z["kitchen_latch"] is False
    assert z["snapshot_scene"] == "crazy_mode_snapshot_basement"


def test_every_coordinator_is_one_of_its_speakers_and_scenes_differ():
    for z in ZONES.values():
        assert z["coordinator"] in z["speakers"]
    assert len({z["snapshot_scene"] for z in ZONES.values()}) == len(ZONES)


def test_no_speaker_or_light_list_outside_the_zone_config():
    for f in PKG.glob("*.yaml"):
        if f.name == "crazy_mode_zone_config.yaml":
            continue
        text = "\n".join(l for l in f.read_text().splitlines() if not l.lstrip().startswith("#"))
        # entity ids only: `action: light.turn_on` is a service, not a list member
        text = re.sub(r"action: \S+", "", text)
        for needle in (r"media_player\.sonos_", r"\blight\.[a-z_]+", r"switch\.adaptive_lighting"):
            assert not re.search(needle, text), f"{f.name} hard-codes {needle}"


def test_zone_names_in_templates_match_the_config_and_the_select():
    assert set(ZONES) == {"main_floor", "basement"}
    fav = favorites_cfg()["attributes"]["ok_zones"]
    assert all(f"'{k}'" in fav for k in ZONES)
    opts = load("crazy_mode_helpers.yaml")["input_select"]["crazy_mode_zone"]["options"]
    assert [o.lower().replace(" ", "_") for o in opts] == list(ZONES)


# ---- allowed sensor (rendered) ---------------------------------------------
def test_ok_inside_morning_window():
    assert reason() == "ok"


def test_ok_inside_evening_window():
    assert reason(now=at("04:15")) == "ok"


def test_outside_window():
    assert reason(now=at("03:45")) == "outside_window"
    assert reason(now=at("03:30")) == "outside_window"  # end is exclusive


def test_window_start_is_inclusive():
    assert reason(now=at("03:00")) == "ok"


def test_already_ran_in_same_window():
    assert reason(attrs=last_run_at("03:10")) == "already_ran"


def test_run_in_other_window_does_not_block():
    assert reason(now=at("04:15"), attrs=last_run_at("03:10")) == "ok"


def test_yesterdays_run_does_not_block():
    yesterday = (NOW - timedelta(days=1)).replace(hour=3, minute=10).timestamp()
    assert reason(attrs={"input_datetime.crazy_mode_last_run": yesterday}) == "ok"


def test_unset_windows_refuse():
    zero = {k: 0 for k in WINDOWS}
    assert reason(attrs=zero) == "window_unset"


def test_start_after_end_is_unset():
    bad = dict(WINDOWS)
    bad["input_datetime.crazy_mode_morning_start"] = secs("03:40")
    bad["input_datetime.crazy_mode_evening_start"] = secs("04:40")
    assert reason(attrs=bad) == "window_unset"


@pytest.mark.parametrize("mode", ["Bedtime", "Quiet", "Away", "Vacation"])
def test_house_modes_refuse(mode):
    assert reason(states={"input_select.house": mode}) == "house_mode"


@pytest.mark.parametrize("mode", ["Auto", "Entertainment"])
def test_other_house_modes_pass(mode):
    assert reason(states={"input_select.house": mode}) == "ok"


def test_empty_house_refuses():
    assert reason(states={"input_boolean.house_occupied": "off"}) == "not_occupied"


def test_emergency_refuses_and_outranks_house_mode():
    assert reason(states={"binary_sensor.emergency_active": "on"}) == "emergency"
    assert reason(states={"binary_sensor.emergency_active": "on", "input_select.house": "Quiet"}) == "emergency"


def test_entertainment_mode_refuses_and_ranks_between_emergency_and_house_mode():
    ent = {"input_boolean.entertainment_mode": "on"}
    assert reason(states=ent) == "entertainment"
    assert reason(states={**ent, "input_select.house": "Quiet"}) == "entertainment"
    assert reason(states={**ent, "input_boolean.house_occupied": "off"}) == "entertainment"
    assert reason(states={**ent, "binary_sensor.emergency_active": "on"}) == "emergency"
    assert reason(states={**ent, "input_select.crazy_mode_phase": "Crazy"}) == "running"
    assert reason(states={"input_boolean.entertainment_mode": "off"}) == "ok"


def test_running_phase_refuses_first():
    assert reason(states={"input_select.crazy_mode_phase": "Crazy",
                          "binary_sensor.emergency_active": "on"}) == "running"


def test_renamed_favorite_refuses():
    assert reason(states={"input_text.crazy_mode_favorite_slowmo": "Beta "}) == "favorite_missing"


def test_empty_favorite_refuses():
    assert reason(states={"input_text.crazy_mode_favorite_crazy": ""}) == "favorite_missing"


def test_favorite_names_are_case_sensitive():
    assert reason(states={"input_text.crazy_mode_favorite_crazy": "alpha"}) == "favorite_missing"


def test_missing_speaker_refuses():
    assert reason(sources={"media_player.sonos_playroom": None}) == "favorite_missing"
    assert reason(sources={"media_player.sonos_living_room": ["Alpha"]}) == "favorite_missing"


# the allowed sensor is zone-aware
BASEMENT = {"input_select.crazy_mode_zone": "Basement"}


def test_basement_picked_checks_the_basement_speaker():
    assert reason(states=BASEMENT) == "ok"
    assert reason(states=BASEMENT, sources={"media_player.sonos_basement": ["Alpha"]}) == "favorite_missing"
    assert reason(states=BASEMENT, sources={"media_player.sonos_basement": None}) == "favorite_missing"


def test_main_floor_speakers_do_not_matter_for_the_basement():
    assert reason(states=BASEMENT, sources={"media_player.sonos_playroom": None}) == "ok"


def test_basement_speaker_does_not_matter_for_the_main_floor():
    assert reason(sources={"media_player.sonos_basement": None}) == "ok"


def test_favorites_sensor_lists_the_zones_that_pass():
    fav = favorites_cfg()["attributes"]["ok_zones"]
    env, _ = make_env(NOW, dict(BASE), {}, {sp: GOOD_SOURCES for sp in SPEAKERS}, ZONES)
    assert ast.literal_eval(env.from_string(fav).render().strip()) == ["main_floor", "basement"]
    env, _ = make_env(NOW, dict(BASE), {}, {**{sp: GOOD_SOURCES for sp in SPEAKERS},
                                           "media_player.sonos_basement": None}, ZONES)
    assert ast.literal_eval(env.from_string(fav).render().strip()) == ["main_floor"]


def test_unavailable_zone_config_refuses_for_either_zone():
    assert reason(zones=None) == "favorite_missing"
    assert reason(zones=None, states=BASEMENT) == "favorite_missing"
    fav = favorites_cfg()["attributes"]["ok_zones"]
    env, _ = make_env(NOW, dict(BASE), {}, {sp: GOOD_SOURCES for sp in SPEAKERS}, None)
    assert ast.literal_eval(env.from_string(fav).render().strip()) == []


def test_binary_sensor_follows_reason():
    b = load("crazy_mode_allowed.yaml")["template"][1]["binary_sensor"][0]
    assert "sensor.crazy_mode_reason" in b["state"] and "'ok'" in b["state"]
    assert b["attributes"]["reason"] == "{{ states('sensor.crazy_mode_reason') }}"


def test_sensor_never_writes_house_mode():
    assert "input_select.select_option" not in (PKG / "crazy_mode_allowed.yaml").read_text()


# ---- retry wording ----------------------------------------------------------
def test_retry_wording():
    assert retry(now=at("02:00")) == "this morning"
    assert retry(now=at("03:10")) == "tonight"      # ran in the morning
    assert retry(now=at("03:45")) == "tonight"      # between windows
    assert retry(now=at("04:15")) == "tomorrow morning"
    assert retry(now=at("05:00")) == "tomorrow morning"


# ---- start script -----------------------------------------------------------
def start_steps():
    return seq("crazy_mode_start")


def start_vars():
    return script("crazy_mode_start")["variables"]


def start_env(zone=None, picker="Main floor", reason_state="ok", ok_zones=("main_floor", "basement"),
              zones=ZONES, **extra):
    """Render the start script's variables in order, as HA does."""
    st = {"input_select.crazy_mode_zone": picker, "sensor.crazy_mode_reason": reason_state}
    env = Environment()

    def state_attr(e, a):
        if e == "sensor.crazy_mode_zone_config":
            return zones.get(a) if zones else None
        if e == "sensor.crazy_mode_favorites":
            return list(ok_zones)
        return None

    env.globals.update(states=lambda e: st.get(e, "unknown"), state_attr=state_attr)
    ctx = dict(extra)
    if zone is not None:
        ctx["zone"] = zone
    for k, t in start_vars().items():
        out = env.from_string(t).render(**ctx).strip()
        try:
            ctx[k] = ast.literal_eval(out)
        except Exception:
            ctx[k] = out
    return ctx


def test_start_has_one_optional_zone_field_and_keeps_its_alias():
    s = script("crazy_mode_start")
    assert set(s["fields"]) == {"zone"} and s["fields"]["zone"]["required"] is False
    assert s["alias"] == "Crazy Mode"


def test_start_uses_the_field_else_the_picker_and_anything_else_is_main_floor():
    assert start_env(picker="Basement")["zone_name"] == "Basement"
    assert start_env(picker="Main floor")["zone_name"] == "Main floor"
    assert start_env(picker="Main floor", zone="Basement")["zone_name"] == "Basement"
    assert start_env(picker="Basement", zone="Main floor")["zone_name"] == "Main floor"
    assert start_env(picker="Garage")["zone_name"] == "Main floor"
    assert start_env(picker="unknown")["zone_key"] == "main_floor"


def test_start_judges_the_favorites_of_the_zone_it_was_given():
    # picker on Main floor says favorite_missing (its own zone is bad); the basement is fine
    assert start_env(zone="Basement", reason_state="favorite_missing", ok_zones=["basement"])["reason"] == "ok"
    assert start_env(zone="Basement", reason_state="ok", ok_zones=["main_floor"])["reason"] == "favorite_missing"
    # every other reason passes through untouched
    assert start_env(zone="Basement", reason_state="outside_window")["reason"] == "outside_window"
    assert start_env(zone="Basement", reason_state="emergency", ok_zones=["basement"])["reason"] == "emergency"


def test_start_gates_on_the_reason_and_stops():
    first = start_steps()[0]
    assert first["if"][0]["value_template"] == "{{ reason != 'ok' }}"
    assert any("stop" in d for d in walk(first["then"]))


def test_refusal_speaks_only_for_window_reasons_on_the_zone_coordinator():
    first = start_steps()[0]
    speak = first["then"][0]
    cond = speak["if"][0]["value_template"]
    assert "outside_window" in cond and "already_ran" in cond
    for silent in ("house_mode", "emergency", "entertainment", "not_occupied", "running", "favorite_missing"):
        assert silent not in cond
    call = called(speak["then"], "script.turn_on")[0]
    v = call["data"]["variables"]
    assert "Crazy Mode is recharging" in v["speech_message"] and "retry" in v["speech_message"]
    assert v["media_players"] == "{{ [cfg.coordinator] }}"
    assert v["sound_file"] and v["sound_length"]
    out = render_plain(v["media_players"], cfg=ZONES["basement"])
    assert ast.literal_eval(out) == ["media_player.sonos_basement"]


def test_refusal_line_renders():
    first = start_steps()[0]
    call = called(first["then"], "script.turn_on")[0]
    out = render(call["data"]["variables"]["speech_message"].replace(
        "state_attr('sensor.crazy_mode_reason', 'retry')", "'tonight'"))
    assert out == "Crazy Mode is recharging — back tonight"


def test_missing_config_at_start_is_logged_not_silent():
    first = start_steps()[0]
    logs = called(first["then"], "system_log.write")
    assert logs and logs[0]["data"]["level"] == "warning"


def test_snapshots_come_before_any_change():
    steps = start_steps()
    snap_sonos = step_index(steps, lambda s: s.get("action") == "sonos.snapshot")
    snap_lights = step_index(steps, lambda s: "scene.create" in yaml.dump(s))
    al_off = step_index(steps, lambda s: "switch.turn_off" in yaml.dump(s))
    latch = step_index(steps, lambda s: "kitchen_lights_manually_toggled" in yaml.dump(s))
    unjoin = step_index(steps, lambda s: "media_player.unjoin" in yaml.dump(s))
    join = step_index(steps, lambda s: "media_player.join" in yaml.dump(s))
    handoff = step_index(steps, lambda s: s.get("action") == "script.turn_on" and RUN in yaml.dump(s))
    assert max(snap_sonos, snap_lights) < min(al_off, latch, unjoin, join) < handoff
    assert steps[snap_sonos]["data"]["with_group"] is True
    create = called(steps[snap_lights], "scene.create")[0]
    assert create["data"]["scene_id"] == "{{ cfg.snapshot_scene }}"
    assert create["data"]["snapshot_entities"] == "{{ lights + al_switches }}"


def test_empty_light_list_skips_the_scene_and_every_light_call():
    # every scene or light call in the package sits under a check on the lights list
    for f in sorted(PKG.glob("crazy_mode_*.yaml")):
        for d, anc in walk_anc(load(f.name)):
            if d.get("action") in ("scene.create", "scene.turn_on", "light.turn_on"):
                guards = " ".join(" ".join(yaml.dump(a.get("if", "")).split()) for a in anc if "if" in a)
                assert re.search(r"has_lights|lights \| length > 0|cfg\.lights", guards), (f.name, d)
    # and the guard really is false for the basement
    assert render_plain("{{ lights | length > 0 }}", lights=ZONES["basement"]["lights"]) == "False"
    assert render_plain("{{ lights | length > 0 }}", lights=ZONES["main_floor"]["lights"]) == "True"
    assert render_plain("{{ cfg_ok and cfg.lights | length > 0 }}", cfg=ZONES["basement"], cfg_ok=True) == "False"


def test_latch_is_set_only_when_this_zone_uses_it_it_was_off_and_recorded():
    steps = start_steps()
    s = [x for x in steps if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    assert "cfg.kitchen_latch" in yaml.dump(s["if"])
    assert any(c.get("entity_id") == "input_boolean.kitchen_lights_manually_toggled" and c["state"] == "off"
               for c in s["if"])
    targets = [c["target"]["entity_id"] for c in called(s["then"], "input_boolean.turn_on")]
    assert targets == ["input_boolean.crazy_mode_kitchen_latch_set", "input_boolean.kitchen_lights_manually_toggled"]


def test_start_forgets_a_stale_latch_record_when_someone_else_holds_the_latch():
    s = [x for x in start_steps() if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    off = called(s["else"], "input_boolean.turn_off")[0]
    assert off["target"]["entity_id"] == "input_boolean.crazy_mode_kitchen_latch_set"


def test_start_records_last_run_the_zone_and_takes_the_phase():
    steps = start_steps()
    assert "input_datetime.crazy_mode_last_run" in yaml.dump(steps)
    phase = step_index(steps, lambda s: s.get("action") == "input_select.select_option")
    assert steps[phase]["data"]["option"] == "Crazy"
    assert steps[phase]["target"]["entity_id"] == "input_select.crazy_mode_phase"
    assert phase < step_index(steps, lambda s: s.get("action") == "sonos.snapshot")
    zone = [s for s in steps if s.get("action") == "input_text.set_value"][0]
    assert zone["target"]["entity_id"] == "input_text.crazy_mode_active_zone"
    assert zone["data"]["value"] == "{{ zone_name }}"
    assert steps.index(zone) < phase


def test_start_resets_stop_and_pause_flags():
    off = [s for s in start_steps() if s.get("action") == "input_boolean.turn_off"][0]
    assert set(off["target"]["entity_id"]) == {"input_boolean.crazy_mode_stop_requested",
                                              "input_boolean.crazy_mode_paused"}


def test_a_single_speaker_zone_still_unjoins_and_joins_only_a_group():
    steps = start_steps()
    unjoin = [s for s in steps if "media_player.unjoin" in yaml.dump(s)][0]
    assert "repeat" in unjoin and unjoin["repeat"]["for_each"] == "{{ speakers }}"
    assert "if" not in unjoin  # unconditional
    join = [s for s in steps if "media_player.join" in yaml.dump(s)][0]
    assert join["if"][0]["value_template"] == "{{ speakers | length > 1 }}"
    members = called(join["then"], "media_player.join")[0]["data"]["group_members"]
    main = ast.literal_eval(render_plain(members, speakers=V1_SPEAKERS, coordinator=V1_SPEAKERS[0]))
    assert main == V1_SPEAKERS[1:]
    assert render_plain("{{ speakers | length > 1 }}", speakers=ZONES["basement"]["speakers"]) == "False"


def test_start_reads_the_length_once_and_clamps_it():
    steps = start_steps()
    s = [x for x in steps if "variables" in x and "crazy_minutes" in x["variables"]][0]
    assert steps.index(s) < step_index(steps, lambda x: x.get("action") == "sonos.snapshot")
    assert yaml.dump(steps).count("input_number.crazy_mode_crazy_minutes") == 1


CLAMP = "[[states('input_number.crazy_mode_crazy_minutes') | float(5), 2] | max, 15] | min | int"


@pytest.mark.parametrize("raw,want", [("5.0", 5), ("unknown", 5), ("0", 2), ("99", 15), ("15.0", 15), ("2.0", 2)])
def test_length_clamp_renders(raw, want):
    start, restart, _ = clamp_templates()
    for expr in (start, restart):
        assert render_plain(expr, states=lambda e, raw=raw: raw) == str(want)
    run = [s for s in run_steps() if "variables" in s and "crazy_s" in s["variables"]][0]["variables"]["crazy_s"]
    assert render_plain(run, crazy_minutes=raw) == str(want * 60)


def clamp_templates():
    start = [x for x in start_steps() if "variables" in x and "crazy_minutes" in x["variables"]][0]
    restart = called(seq("crazy_mode_restart"), "script.turn_on")[0]["data"]["variables"]["crazy_minutes"]
    return [start["variables"]["crazy_minutes"], restart, CLAMP]


def test_the_clamp_is_the_same_expression_in_start_restart_and_run():
    start = [x for x in start_steps() if "variables" in x and "crazy_minutes" in x["variables"]][0]
    restart = called(seq("crazy_mode_restart"), "script.turn_on")[0]["data"]["variables"]["crazy_minutes"]
    assert CLAMP in start["variables"]["crazy_minutes"] and CLAMP in restart
    run = [s for s in run_steps() if "variables" in s and "crazy_s" in s["variables"]][0]
    assert "[[crazy_minutes | float(5), 2] | max, 15] | min | int" in run["variables"]["crazy_s"]


def test_crazy_length_follows_the_slider_in_the_timer():
    run = [s for s in run_steps() if "variables" in s and "crazy_s" in s["variables"]][0]
    assert render_plain(run["variables"]["crazy_s"], crazy_minutes=7) == "420"
    first_timer = called(run_steps(), "timer.start")[0]
    assert first_timer["data"]["duration"] == "{{ crazy_s }}"
    others = [d["data"]["duration"] for d in called(run_steps(), "timer.start")[1:]]
    assert others == ["00:01:00", "00:01:00"]  # Slow-mo and Cool-down are one minute


def test_handoff_is_non_blocking_and_passes_the_length_only():
    last = start_steps()[-1]
    assert last["action"] == "script.turn_on"
    assert last["target"]["entity_id"] == RUN
    assert set(last["data"]["variables"]) == {"crazy_minutes"}


def test_basement_phrase_has_no_fields_and_never_writes_the_picker():
    s = script("crazy_mode_start_basement")
    assert "fields" not in s and s["alias"] == "Crazy Mode Basement"
    call = s["sequence"][0]
    assert call["action"] == "script.crazy_mode_start" and call["data"] == {"zone": "Basement"}
    assert "crazy_mode_zone" not in yaml.dump(s) and "select_option" not in yaml.dump(s)
    # and nothing else in the package writes the picker
    for f in PKG.glob("*.yaml"):
        for d in walk(load(f.name)):
            if d.get("action") == "input_select.select_option":
                assert d["target"]["entity_id"] != "input_select.crazy_mode_zone", f.name


# ---- run script -------------------------------------------------------------
def run_steps():
    return seq("crazy_mode_run")


def cooldown_index():
    steps = run_steps()
    return step_index(steps, lambda s: "variables" in s and "c0" in s["variables"])


def cooldown_tail():
    return run_steps()[cooldown_index() + 1:]


def live_steps():
    """Crazy and Slow-mo: everything before the Cool-down variables."""
    return run_steps()[:cooldown_index()]


def test_run_refuses_to_start_after_an_abort():
    steps = run_steps()
    guard = [x for x in steps[:3] if x.get("entity_id") == "input_select.crazy_mode_phase"]
    assert guard and guard[0]["state"] == "Crazy"
    assert "crazy_minutes is defined" in steps[0]["value_template"]


def test_voice_lines_never_block_except_the_closing_line():
    blocking = [d for d in walk(run_steps()) if d.get("action") == "script.announcement_engine"]
    assert len(blocking) == 1
    assert blocking[0]["data"]["speech_message"].endswith("Save your world.")
    # and it is the second-to-last step, right before the restore
    assert run_steps()[-2] == [s for s in run_steps() if s.get("action") == "script.announcement_engine"][0]
    assert run_steps()[-1]["action"] == "script.crazy_mode_restore"


def test_every_voice_line_carries_chime_and_volume_and_targets_the_zone():
    seen = 0
    for f in PKG.glob("*.yaml"):
        for d in walk(load(f.name)):
            if d.get("action") == "script.turn_on" and \
                    d.get("target", {}).get("entity_id") == "script.announcement_engine":
                v = d["data"]["variables"]
                seen += 1
                assert v["sound_file"] and v["sound_length"] and v["speech_message"], f.name
                assert v["media_players"] in ("{{ speakers }}", "{{ [cfg.coordinator] }}"), f.name
                assert "speech_vol" in str(v["speech_volume"]) or v["speech_volume"] == 45, f.name
    assert seen >= 7
    closing = [d for d in walk(run_steps()) if d.get("action") == "script.announcement_engine"][0]
    assert closing["data"]["media_players"] == "{{ speakers }}"


def test_speech_volume_is_capped_at_75():
    runv = [s for s in run_steps() if "variables" in s and "speech_vol" in s["variables"]][0]["variables"]
    resumev = script("crazy_mode_resume")["variables"]
    for t in (runv["speech_vol"], resumev["speech_vol"]):
        for base in (20, 40, 70, 500):
            env = Environment()
            env.globals["states"] = lambda e, b=base: str(b)
            assert int(env.from_string(t).render()) <= 75


def test_phases_in_order_and_sources():
    text = yaml.dump(run_steps())
    order = [text.index(f"option: {p}") for p in ("Slow-mo", "Cool-down")]
    assert order == sorted(order)
    for fav in ("fav_crazy", "fav_slowmo", "fav_cooldown"):
        assert fav in text
    assert called(run_steps(), "media_player.shuffle_set")[0]["data"]["shuffle"] is True
    # music is always steered through the coordinator
    for d in called(run_steps(), "media_player.select_source"):
        assert d["target"]["entity_id"] == "{{ coordinator }}"


def test_run_lists_come_from_the_zone_config():
    steps = run_steps()
    cfg_step = [s for s in steps if "variables" in s and "speakers" in s["variables"]][0]["variables"]
    for k in ("speakers", "coordinator", "lights"):
        assert cfg_step[k] == "{{ cfg.%s }}" % k
    assert "sensor.crazy_mode_zone_config" in yaml.dump(steps)


def test_a_missing_config_ends_the_run_loudly_with_a_restore():
    steps = run_steps()
    i = step_index(steps, lambda s: "if" in s and "cfg is not mapping" in yaml.dump(s["if"]))
    then = steps[i]["then"]
    assert called(then, "system_log.write") and called(then, "script.crazy_mode_restore")
    assert any("stop" in d for d in then)


# ---- the clock: progress comes from the phase timer --------------------------
def progress_step():
    steps = live_steps()
    for d in walk(steps):
        if "variables" in d and isinstance(d["variables"].get("left"), str):
            return d["variables"]
    raise AssertionError("no progress step")


def timer_env(state, attrs, now):
    env = Environment()
    env.globals.update(
        states=lambda e: state,
        state_attr=lambda e, a: attrs.get(a),
        as_timestamp=lambda v, default=None: datetime.fromisoformat(v).timestamp() if v else default,
        now=lambda: now,
    )
    return env


def timer_progress(state, attrs, now=NOW):
    """Render left, dur, elapsed and progress the way the run's tick does."""
    env = timer_env(state, attrs, now)
    pv = progress_step()
    left = float(env.from_string(pv["left"]).render().strip())
    dur = float(env.from_string(pv["dur"]).render().strip())
    second = [d for d in walk(live_steps()) if "variables" in d and isinstance(d["variables"].get("elapsed"), str)][0]["variables"]
    env2 = Environment()
    ctx = {"left": left, "dur": dur}
    elapsed = float(env2.from_string(second["elapsed"]).render(**ctx).strip())
    prog = float(env2.from_string(second["progress"]).render(elapsed=elapsed, **ctx).strip())
    return left, dur, elapsed, prog


ACTIVE_ATTRS = {"duration": "0:05:00", "remaining": "0:05:00",
                "finishes_at": (NOW + timedelta(seconds=192)).isoformat()}
PAUSED_ATTRS = {"duration": "0:05:00", "remaining": "0:03:12"}


def test_active_progress_comes_from_finishes_at_not_the_frozen_remaining():
    # HA freezes `remaining` at the last start while active
    left, dur, elapsed, prog = timer_progress("active", ACTIVE_ATTRS)
    assert (left, dur, elapsed) == (192, 300, 108)
    assert prog == pytest.approx(0.36)


def test_paused_progress_comes_from_remaining_and_does_not_move_with_the_clock():
    a = timer_progress("paused", PAUSED_ATTRS, NOW)
    b = timer_progress("paused", PAUSED_ATTRS, NOW + timedelta(minutes=9))
    assert a == b and a[0] == 192 and a[3] == pytest.approx(0.36)


def test_active_progress_moves_with_the_clock():
    a = timer_progress("active", ACTIVE_ATTRS, NOW)
    b = timer_progress("active", ACTIVE_ATTRS, NOW + timedelta(seconds=30))
    assert b[2] - a[2] == 30


def test_idle_or_odd_timers_read_as_finished_not_as_an_error():
    assert timer_progress("idle", {"duration": "0:05:00"})[0] == 0
    left, dur, elapsed, prog = timer_progress("idle", {})
    assert (left, dur, prog) == (0, 0, 1)
    assert timer_progress("active", {"duration": "0:01:00"})[0] == 0  # no finishes_at


def test_pause_freezes_the_clock_the_run_never_keeps_a_deadline():
    # In Crazy and Slow-mo, now() is only read through finishes_at; no deadline is saved at phase start
    for d in walk(live_steps()):
        for k, v in d.items():
            if isinstance(v, str) and "now()" in v:
                assert "finishes_at" in v, (k, v)
    text = yaml.dump(live_steps())
    assert not re.search(r"\b(t0|s0)\b", text)
    lefts = [d["variables"]["left"] for d in walk(live_steps())
             if "variables" in d and isinstance(d["variables"].get("left"), str)]
    assert len(lefts) == 2 and all("finishes_at" in t for t in lefts)  # the Crazy and Slow-mo loops


def test_ticks_wake_on_stop_the_timer_ending_and_a_pause_change():
    waits = [d for d in walk(live_steps()) if "wait_template" in d and d.get("timeout") == "{{ tick }}"]
    assert len(waits) == 2
    for w in waits:
        t = w["wait_template"]
        assert "crazy_mode_stop_requested" in t and "timer.crazy_mode_phase" in t and "crazy_mode_paused" in t
    assert script("crazy_mode_run")["variables"]["tick"] == 5


def test_one_minute_line_fires_once_across_ticks_and_a_pause():
    step = [d for d, _ in walk_anc(live_steps()) if d.get("alias") == "A minute left, once"][0]
    cond = step["if"][0]["value_template"]
    assert called(step["then"], "script.turn_on")
    assert step["then"][0]["variables"] == {"one_min_fired": True}
    fired, count = False, 0
    # ticks of a 3-minute Crazy: a pause begins at 62 s left and ends 10 ticks later; one long tick
    lefts = [180, 175, 170, 90, 85, 80, 62, 62, 62, 62, 62, 57, 52, 40, 20, 4]
    paused = [False] * 7 + [True] * 4 + [False] * 5
    for left, p in zip(lefts, paused):
        if p:
            continue  # the paused branch never reaches the line
        if render_plain(cond, left=left, one_min_fired=fired) == "True":
            count += 1
            fired = True
    assert count == 1


def test_one_minute_line_is_only_in_the_running_branch():
    pause_if = [d for d, _ in walk_anc(live_steps()) if d.get("alias", "").startswith("Paused: keep the music paused. Running: the one")][0]
    assert "one_min_fired" in yaml.dump(pause_if["else"]) and "one_min_fired" not in yaml.dump(pause_if["then"])


def test_stop_is_checked_before_the_effects_and_the_loops_end_on_it():
    for loop in [d for d in walk(live_steps()) if "repeat" in d and "while" in d["repeat"]]:
        w = yaml.dump(loop["repeat"]["while"])
        assert "crazy_mode_stop_requested" in w and "active" in w and "paused" in w


def test_slowmo_waits_for_a_pause_to_clear_before_its_timer_and_a_stop_releases_it():
    steps = live_steps()
    gate = [x for x in steps if "if" in x and "Slow-mo" in yaml.dump(x["then"])][0]
    assert gate["if"][0]["state"] == "off"
    inner = gate["then"]
    wait = step_index(inner, lambda s: "wait_template" in s)
    start = step_index(inner, lambda s: "if" in s and "timer.start" in yaml.dump(s))
    assert wait < start
    assert "crazy_mode_paused" in inner[wait]["wait_template"] and "crazy_mode_stop_requested" in inner[wait]["wait_template"]


def test_slowmo_dim_levels_end_at_half_and_hold_while_paused():
    t = [d for d in walk(live_steps()) if d.get("action") == "light.turn_on"
         and isinstance(d["data"]["brightness_pct"], str)][0]["data"]
    levels = [int(render_plain(t["brightness_pct"], progress=p / 6)) for p in range(0, 7)]
    assert levels == sorted(levels, reverse=True) and levels[0] == 100 and levels[-1] == 50
    # paused: the same level, no ramp
    assert render_plain(t["transition"], now_paused=True, tick=5) == "0"
    assert render_plain(t["transition"], now_paused=False, tick=5) == "5"


def test_lights_are_reasserted_every_tick_even_while_paused():
    crazy_loop = [d for d in walk(live_steps()) if "repeat" in d and "while" in d["repeat"]][0]
    cond_step = [s for s in crazy_loop["repeat"]["sequence"] if "if" in s][0]
    first = cond_step["then"][0]
    assert called(first, "light.turn_on")  # before the paused/running split
    assert "now_paused" not in yaml.dump(first["if"])


def test_paused_ticks_repause_playing_music_and_skip_the_fades():
    for step, _ in walk_anc(live_steps()):
        if step.get("alias", "").startswith("Paused: keep the music paused"):
            assert called(step["then"], "media_player.media_pause")
            assert not called(step["then"], "media_player.volume_set")
            assert not called(step["then"], "script.turn_on")


def test_slowmo_music_fades_in_the_first_ten_seconds():
    vol = [d for d in called(live_steps(), "media_player.volume_set") if "elapsed" in str(d["data"])][0]
    t = vol["data"]["volume_level"]
    levels = [float(render_plain(t, base=0.4, elapsed=e)) for e in (0, 5, 10, 14)]
    assert levels[0] == pytest.approx(0.4) and levels[2] == pytest.approx(0.28) and levels[3] == pytest.approx(0.28)
    assert levels == sorted(levels, reverse=True)


# ---- cool-down ----------------------------------------------------------------
def test_cooldown_never_reads_the_stop_button():
    tail = cooldown_tail()
    # the first tail step clears the flag; nothing after waits on it or gates on it
    assert tail[0]["action"] == "input_boolean.turn_off"
    assert tail[0]["target"]["entity_id"] == "input_boolean.crazy_mode_stop_requested"
    for d in walk(tail[1:]):
        assert "wait_template" not in d
        assert "crazy_mode_stop_requested" not in yaml.dump(d)


def test_cooldown_ignores_the_timer_and_keeps_its_own_sixty_second_count():
    tail = cooldown_tail()
    loop = [x for x in tail if "repeat" in x][0]
    assert loop["repeat"]["while"] == "{{ now().timestamp() - c0 < 60 }}"
    assert "timer.crazy_mode_phase" not in yaml.dump(loop)


def test_slowmo_and_crazy_do_read_the_stop_button():
    assert "crazy_mode_stop_requested" in yaml.dump(live_steps())


def test_entering_cooldown_clears_the_pause_and_resumes_music_before_the_timer():
    tail = cooldown_tail()
    cleared = step_index(tail, lambda s: s.get("action") == "input_boolean.turn_off"
                         and s["target"]["entity_id"] == "input_boolean.crazy_mode_paused")
    play = step_index(tail, lambda s: "media_player.media_play" in yaml.dump(s))
    phase = step_index(tail, lambda s: s.get("action") == "input_select.select_option")
    timer = step_index(tail, lambda s: s.get("action") == "timer.start")
    assert cleared < play < phase < timer


def test_stop_while_paused_reaches_cooldown_with_no_pause_left():
    # the Crazy loop ends on the stop flag even when the timer is paused, and Slow-mo is skipped
    crazy_loop = [d for d in walk(live_steps()) if "repeat" in d and "while" in d["repeat"]][0]
    assert "crazy_mode_stop_requested" in yaml.dump(crazy_loop["repeat"]["while"])
    slow = [x for x in live_steps() if "if" in x and "Slow-mo" in yaml.dump(x["then"])][0]
    assert slow["if"][0]["state"] == "off"
    # a pause that slips in at the boundary is undone inside the Cool-down loop too
    loop = [x for x in cooldown_tail() if "repeat" in x][0]
    assert "crazy_mode_paused" in yaml.dump(loop) and "media_play" in yaml.dump(loop)


def test_lights_never_go_dark():
    levels = [d["data"]["brightness_pct"] for d in walk(run_steps()) if d.get("action") == "light.turn_on"]
    assert levels and all(str(b).startswith("{{") or b >= 30 for b in levels)
    assert not any(d.get("action") == "light.turn_off" for d in walk(run_steps()))
    tail_calls = called(cooldown_tail(), "light.turn_on")
    assert tail_calls and all(c["data"]["brightness_pct"] == 30 for c in tail_calls)


def test_cooldown_music_fades_in_then_out_and_never_cuts():
    vol = called(cooldown_tail(), "media_player.volume_set")[0]
    t = vol["data"]["volume_level"]
    kw = dict(v0=0.4, cool_vol=0.18)
    f = lambda e: float(render_plain(t, e=e, **kw))
    assert f(0) == pytest.approx(0.4) and f(10) == pytest.approx(0.18) and f(30) == pytest.approx(0.18)
    assert f(50) == pytest.approx(0.18) and f(55) == pytest.approx(0.09) and f(60) == 0
    cond = [d for d in walk(cooldown_tail()) if d.get("value_template") == "{{ e <= 12 or e >= 48 }}"]
    assert cond


HEAVY_BAN = re.compile(r"jump|spin|hop|leap|skip|one[- ]foot|one leg|balance|twirl|flip|bounce", re.I)


def heavy():
    return script("crazy_mode_run")["variables"]["heavy_work"]


def test_heavy_work_list_has_no_excluded_moves():
    h = heavy()
    assert len(h) == 8
    for line in h:
        assert not HEAVY_BAN.search(line), line


def test_heavy_work_picks_are_distinct_for_every_roll():
    v = script("crazy_mode_run")["variables"]
    for a in range(8):
        for r in range(7):
            env = Environment()
            env.filters["random"] = lambda seq, r=r, a=a: a if len(list(seq)) == 8 else r
            env.globals["range"] = range
            pick_a = int(env.from_string(v["pick_a"]).render())
            env2 = Environment()
            env2.globals["pick_a"] = pick_a
            env2.globals["range"] = range
            env2.filters["random"] = lambda seq, r=r: r
            pick_b = int(env2.from_string(v["pick_b"]).render())
            assert pick_a != pick_b and 0 <= pick_b < 8


def test_two_prompts_at_start_and_half_of_cooldown_each_once():
    tail = yaml.dump(cooldown_tail())
    assert "heavy_work[pick_a | int]" in tail and "heavy_work[pick_b | int]" in tail
    step = [d for d, _ in walk_anc(cooldown_tail()) if d.get("alias") == "Second prompt at half way, once"][0]
    cond = step["if"][0]["value_template"]
    assert step["then"][0]["variables"] == {"prompt_b_fired": True}
    fired, count = False, 0
    for e in [5, 10, 15, 20, 25, 28, 33, 38, 43, 48, 53, 58, 60]:  # one long tick across 30
        if render_plain(cond, e=e, prompt_b_fired=fired) == "True":
            count += 1
            fired = True
    assert count == 1


# ---- pause, resume, skip, restart ------------------------------------------
GUARD = [("script.crazy_mode_run", "on"), ("script.crazy_mode_start", "off"),
         ("script.crazy_mode_restore", "off"), ("binary_sensor.emergency_active", "off")]


def guard_of(name):
    step = seq(name)[0]
    assert step["condition"] == "and"
    return [(c["entity_id"], c["state"]) for c in step["conditions"]]


@pytest.mark.parametrize("name", ["crazy_mode_pause", "crazy_mode_resume", "crazy_mode_skip", "crazy_mode_restart"])
def test_every_control_needs_the_run_on_setup_and_restore_off_and_no_emergency(name):
    assert guard_of(name) == GUARD


def test_pause_only_in_crazy_and_slowmo_and_only_once():
    s = seq("crazy_mode_pause")
    cond = s[1]["conditions"]
    assert cond[0]["state"] == ["Crazy", "Slow-mo"]
    assert cond[1]["entity_id"] == "input_boolean.crazy_mode_paused" and cond[1]["state"] == "off"
    acts = [d["action"] for d in walk(s) if "action" in d]
    assert acts == ["timer.pause", "media_player.media_pause", "input_boolean.turn_on"]


def test_resume_only_while_paused_and_restarts_the_timer_only_if_paused():
    s = seq("crazy_mode_resume")
    assert s[1]["entity_id"] == "input_boolean.crazy_mode_paused" and s[1]["state"] == "on"
    start = [x for x in s if "if" in x and "timer.start" in yaml.dump(x)][0]
    assert start["if"][0]["entity_id"] == "timer.crazy_mode_phase" and start["if"][0]["state"] == "paused"
    call = called(start["then"], "timer.start")[0]
    assert "data" not in call  # a bare start resumes; a duration would restart
    assert called(s, "media_player.media_play")
    say = called(s, "script.turn_on")[0]["data"]["variables"]
    assert say["speech_message"] == "Here we go!" and say["media_players"] == "{{ speakers }}"
    assert s.index(start) < [x.get("action") for x in s].index("input_boolean.turn_off")


def test_skip_only_in_crazy_and_not_paused():
    s = seq("crazy_mode_skip")
    cond = s[1]["conditions"]
    assert cond[0]["state"] == "Crazy" and cond[1]["state"] == "off"
    assert [d["action"] for d in called(s, "media_player.media_next_track")] == ["media_player.media_next_track"]
    assert called(s, "media_player.media_next_track")[0]["target"]["entity_id"] == "{{ coordinator }}"


def test_controls_read_the_coordinator_from_the_active_zone_and_fall_back_to_main_floor():
    for name in ("crazy_mode_pause", "crazy_mode_resume", "crazy_mode_skip"):
        v = script(name)["variables"]
        env = Environment()
        for zone, want in (("Basement", "media_player.sonos_basement"), ("Main floor", "media_player.sonos_kitchen"),
                           ("", "media_player.sonos_kitchen"), ("unknown", "media_player.sonos_kitchen")):
            env.globals.update(
                is_state=lambda e, s, zone=zone: zone == s,
                state_attr=lambda e, a: ZONES["basement" if zone == "Basement" else "main_floor"],
            )
            ctx = {}
            for k in ("zone_key", "cfg", "coordinator"):
                ctx[k] = env.from_string(v[k]).render(**ctx).strip()
                if k == "cfg":
                    ctx[k] = ZONES["basement" if zone == "Basement" else "main_floor"]
            assert ctx["coordinator"] == want, (name, zone)


@pytest.mark.parametrize("zone,key", [("Basement", "basement"), ("Main floor", "main_floor"),
                                      ("", "main_floor"), ("unknown", "main_floor"), ("Garage", "main_floor")])
def test_an_unknown_active_zone_falls_back_to_main_floor_everywhere(zone, key):
    readers = [script("crazy_mode_run")["variables"]["zone_key"],
               script("crazy_mode_restore")["variables"]["zone_key"],
               script("crazy_mode_pause")["variables"]["zone_key"]]
    cleanup = load("crazy_mode_cleanup_on_start.yaml")["automation"][0]["actions"][0]["wait_template"]
    for t in readers:
        env = Environment()
        env.globals["is_state"] = lambda e, s, zone=zone: zone == s
        assert env.from_string(t).render().strip() == key
    assert "'basement' if is_state('input_text.crazy_mode_active_zone', 'Basement') else 'main_floor'" in cleanup


def test_restart_cancels_resets_rechecks_and_starts_from_crazy_without_a_new_snapshot():
    s = seq("crazy_mode_restart")
    text = yaml.dump(s)
    acts = [d["action"] for d in walk(s) if "action" in d]
    assert acts == ["script.turn_off", "input_boolean.turn_off", "input_select.select_option", "script.turn_on"]
    assert called(s, "script.turn_off")[0]["target"]["entity_id"] == RUN
    cleared = called(s, "input_boolean.turn_off")[0]["target"]["entity_id"]
    assert set(cleared) == {"input_boolean.crazy_mode_paused", "input_boolean.crazy_mode_stop_requested"}
    # waits for the old run, then rechecks the emergency before it starts the new one
    wait = step_index(s, lambda x: "wait_template" in x)
    emer = step_index(s, lambda x: x.get("entity_id") == "binary_sensor.emergency_active")
    turn_on = step_index(s, lambda x: x.get("action") == "script.turn_on")
    assert wait < emer < turn_on
    assert called(s, "script.turn_on")[0]["target"]["entity_id"] == RUN
    assert called(s, "input_select.select_option")[0]["data"]["option"] == "Crazy"
    for banned in ("sonos.snapshot", "scene.create", "crazy_mode_last_run", "set_datetime"):
        assert banned not in text, banned


def test_restart_is_not_exposed_to_alexa_by_any_phrase_script():
    # The phrase scripts are the start scripts; nothing may call restart but the dashboard
    for f in PKG.glob("*.yaml"):
        if f.name != "crazy_mode_restart.yaml":
            assert "script.crazy_mode_restart" not in "\n".join(
                l for l in f.read_text().splitlines() if "turn_on" in l or "action:" in l), f.name
    assert "fields" not in script("crazy_mode_restart")


def test_stop_never_cancels_the_run():
    text = (PKG / "crazy_mode_stop.yaml").read_text()
    assert "script.turn_off" not in text and "script.crazy_mode_run" not in text
    s = seq("crazy_mode_stop")
    assert s[0]["state"] == ["Crazy", "Slow-mo"]  # not Cool-down, not Off
    assert s[1]["action"] == "input_boolean.turn_on"
    assert s[1]["target"]["entity_id"] == "input_boolean.crazy_mode_stop_requested"


# ---- who may turn off the run --------------------------------------------------
def test_only_the_abort_restart_and_paused_timeout_turn_off_the_run():
    hits = []
    for f in (ROOT / "packages").rglob("*.yaml"):
        text = f.read_text()
        if "script.turn_off" in text and "crazy_mode_run" in text:
            hits.append(f.name)
    assert sorted(hits) == ["crazy_mode_emergency_abort.yaml", "crazy_mode_paused_timeout.yaml",
                            "crazy_mode_restart.yaml"]


def test_emergency_abort_trigger_and_steps():
    a = load("crazy_mode_emergency_abort.yaml")["automation"][0]
    t = a["triggers"][0]
    assert t["entity_id"] == "binary_sensor.emergency_active" and t["to"] == "on"
    assert a["actions"][0]["action"] == "script.turn_off"
    assert a["actions"][0]["target"]["entity_id"] == [RUN, "script.crazy_mode_start", *CONTROLS]
    assert a["conditions"][0]["condition"] == "not"
    assert a["conditions"][0]["conditions"][0]["entity_id"] == "input_select.crazy_mode_phase"
    assert a["conditions"][0]["conditions"][0]["state"] == "Off"
    assert a["actions"][1]["action"] == "script.crazy_mode_restore"
    assert a["actions"][1]["data"]["emergency"] is True


def test_paused_timeout_shape():
    a = load("crazy_mode_paused_timeout.yaml")["automation"][0]
    assert a["id"] == "crazy_mode_paused_timeout" and a["mode"] == "single"
    t = a["triggers"][0]
    assert t["entity_id"] == "input_boolean.crazy_mode_paused" and t["to"] == "on" and t["for"] == {"minutes": 10}
    conds = yaml.dump(a["conditions"])
    assert "crazy_mode_phase" in conds and "Off" in conds and "script.crazy_mode_run" in conds
    assert a["conditions"][1]["state"] == "on"
    off = a["actions"][0]
    assert off["action"] == "script.turn_off" and off["target"]["entity_id"] == [RUN, *CONTROLS]
    assert a["actions"][1]["action"] == "script.crazy_mode_restore"
    assert "data" not in a["actions"][1]  # a restore, not an emergency
    # abandoned: no Cool-down is played
    assert "Cool-down" not in yaml.dump(a["actions"])
    assert len(a["actions"]) == 2


# ---- restore, cleanup --------------------------------------------------------
def test_restore_is_idempotent_and_complete():
    s = script("crazy_mode_restore")
    assert s["mode"] == "single"
    first = s["sequence"][0]
    assert first["condition"] == "not" and first["conditions"][0]["state"] == "Off"
    sonos = step_index(s["sequence"], lambda x: x.get("action") == "sonos.restore")
    scene = step_index(s["sequence"], lambda x: "scene.turn_on" in yaml.dump(x))
    assert sonos < scene
    assert called(s["sequence"], "sonos.restore")[0]["data"]["with_group"] is True
    turn_on = called(s["sequence"], "scene.turn_on")[0]
    assert turn_on["target"]["entity_id"] == "scene.{{ cfg.snapshot_scene }}"
    last = s["sequence"][-1]
    assert last["action"] == "input_select.select_option" and last["data"]["option"] == "Off"
    # flags and the timer are cleared before the phase goes Off
    flags = called(s["sequence"], "input_boolean.turn_off")[-1]["target"]["entity_id"]
    assert "input_boolean.crazy_mode_paused" in flags and "input_boolean.crazy_mode_stop_requested" in flags
    assert called(s["sequence"], "timer.cancel")


def test_restore_scene_only_when_the_zone_has_lights():
    step = [x for x in script("crazy_mode_restore")["sequence"] if "scene.turn_on" in yaml.dump(x)][0]
    cond = step["if"][0]["value_template"]
    assert render_plain(cond, cfg=ZONES["basement"], cfg_ok=True) == "False"
    assert render_plain(cond, cfg=ZONES["main_floor"], cfg_ok=True) == "True"


def test_restore_without_a_config_logs_and_restores_all_sonos():
    s = script("crazy_mode_restore")["sequence"]
    assert called(s, "system_log.write")[0]["data"]["level"] == "warning"
    sonos = called(s, "sonos.restore")[0]["data"]["entity_id"]
    assert render_plain(sonos, cfg_ok=False, cfg=None) == "all"
    assert ast.literal_eval(render_plain(sonos, cfg_ok=True, cfg=ZONES["basement"])) == ["media_player.sonos_basement"]
    wait = [x for x in s if "wait_template" in x][0]
    assert wait["timeout"] == 60


def test_restore_clears_the_latch_only_if_we_set_it():
    s = script("crazy_mode_restore")["sequence"]
    step = [x for x in s if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    assert step["if"][0]["entity_id"] == "input_boolean.crazy_mode_kitchen_latch_set"
    assert step["if"][0]["state"] == "on"


def test_restore_emergency_ends_with_the_zones_emergency_lights_bright():
    s = script("crazy_mode_restore")["sequence"]
    step = [x for x in s if "emergency" in yaml.dump(x) and "brightness_pct" in yaml.dump(x)][0]
    call = called(step["then"], "light.turn_on")[0]
    assert call["data"]["brightness_pct"] == 100
    assert call["target"]["entity_id"] == "{{ cfg.emergency_lights }}"
    cond = step["if"][0]["value_template"]
    assert render_plain(cond, emergency=True, cfg_ok=True, cfg=ZONES["main_floor"]) == "True"
    assert render_plain(cond, emergency=True, cfg_ok=True, cfg=ZONES["basement"]) == "False"
    assert render_plain(cond, emergency=False, cfg_ok=True, cfg=ZONES["main_floor"]) == "False"


def test_cleanup_covers_the_resets_reads_the_zone_and_leaves_sonos_alone():
    a = load("crazy_mode_cleanup_on_start.yaml")["automation"][0]
    assert a["triggers"][0]["event"] == "start"
    text = yaml.dump(a["actions"])
    for needle in ("cfg.al_switches", "crazy_mode_kitchen_latch_set", "crazy_mode_stop_requested",
                   "crazy_mode_paused", "timer.cancel", "crazy_mode_zone_config"):
        assert needle in text
    wait = a["actions"][0]
    assert wait["timeout"] == 60 and wait["continue_on_timeout"] is True
    assert a["actions"][-1]["data"]["option"] == "Off"
    assert "sonos" not in text and "scene." not in text and "light.turn" not in text
    assert called(a["actions"], "system_log.write")


def test_allow_again_resets_last_run_to_the_past():
    s = seq("crazy_mode_allow_again")[0]
    assert s["target"]["entity_id"] == "input_datetime.crazy_mode_last_run"
    assert s["data"]["timestamp"] < 10 * 86400


def test_nothing_in_the_package_sets_the_house_mode():
    for f in PKG.glob("*.yaml"):
        assert "input_select.house" not in "".join(
            l for l in f.read_text().splitlines() if "select_option" in l)
        for d in walk(load(f.name)):
            if d.get("action") == "input_select.select_option":
                assert d["target"]["entity_id"] == "input_select.crazy_mode_phase"


def test_no_package_file_turns_off_the_announcement_engine():
    for f in PKG.glob("*.yaml"):
        assert "announcement_engine" not in "".join(
            l for l in f.read_text().splitlines() if "turn_off" in l), f.name


# ---- status text -------------------------------------------------------------
def status(phase, st, attrs, paused=False, now=NOW):
    t = load("crazy_mode_status.yaml")["template"][0]["sensor"][0]["state"]
    env = timer_env(st, attrs, now)
    env.globals["states"] = lambda e: phase if e == "input_select.crazy_mode_phase" else st
    env.globals["is_state"] = lambda e, s: (e == "input_boolean.crazy_mode_paused" and paused and s == "on")
    return " ".join(env.from_string(t).render().split())


def test_status_text_shows_phase_and_whole_minutes_and_freezes_when_paused():
    assert status("Off", "idle", {}) == "Off"
    assert status("Crazy", "active", ACTIVE_ATTRS) == "Crazy, 4 min left"
    assert status("Slow-mo", "paused", PAUSED_ATTRS, paused=True) == "Paused, Slow-mo, 4 min left"
    later = NOW + timedelta(minutes=8)
    assert status("Slow-mo", "paused", PAUSED_ATTRS, paused=True, now=later) == "Paused, Slow-mo, 4 min left"
    assert status("Cool-down", "idle", {}) == "Cool-down, finishing"


# ---- dashboard --------------------------------------------------------------
def dash(path):
    return yaml.load(Path(path).read_text(), Loader=_L)


def defined_entities():
    found = set()
    for f in PKG.glob("*.yaml"):
        d = load(f.name)
        for dom in ("input_select", "input_text", "input_number", "input_boolean", "input_datetime", "timer"):
            for k in d.get(dom, {}) or {}:
                found.add(f"{dom}.{k}")
        for k in d.get("script", {}) or {}:
            found.add(f"script.{k}")
        for blk in d.get("template", []) or []:
            for dom in ("sensor", "binary_sensor"):
                for e in blk.get(dom, []):
                    found.add(e["default_entity_id"])
    return found


def test_popup_banner_and_home_wiring():
    p = dash(POPUP)
    assert p["hash"] == "#crazy_mode"
    home = HOME.read_text()
    assert "navigation_path: '#crazy_mode'" in home
    assert "crazy_mode_popup.yaml" in home and "_crazy_mode_active_notification.yaml" in home
    assert BANNER.read_text().count("navigation_path: '#crazy_mode'") == 1
    text = POPUP.read_text() + BANNER.read_text()
    assert "condition: template" not in text


def test_every_crazy_mode_entity_the_dashboard_uses_exists():
    have = defined_entities()
    for path in (POPUP, BANNER, VACUUM_BANNER):
        for m in set(re.findall(r"\b((?:script|input_\w+|sensor|binary_sensor|timer)\.crazy_mode_\w+)", path.read_text())):
            assert m in have, (path.name, m)


def test_time_left_is_text_never_the_timer_entity():
    for path in (POPUP, BANNER):
        assert "timer.crazy_mode_phase" not in path.read_text(), path.name
    assert "sensor.crazy_mode_status" in POPUP.read_text() and "sensor.crazy_mode_status" in BANNER.read_text()
    # the popup's display card ignores every tap
    card = [d for d in walk(dash(POPUP)) if d.get("entity") == "sensor.crazy_mode_status"][0]
    assert card["tap_action"] == {"action": "none"} and card["hold_action"] == {"action": "none"} \
        and card["double_tap_action"] == {"action": "none"}


def chips(path):
    out = {}
    for d in walk(dash(path)):
        if d.get("type") == "custom:button-card" and "visibility" in d:
            out[d["tap_action"]["perform_action"]] = d["visibility"]
    return out


def vis(entity, **kw):
    return {"condition": "state", "entity": entity, **kw}


PH, PA = "input_select.crazy_mode_phase", "input_boolean.crazy_mode_paused"
CHIP_RULES = {
    "script.crazy_mode_skip": [vis(PH, state="Crazy"), vis(PA, state="off")],
    "script.crazy_mode_pause": [vis(PH, state=["Crazy", "Slow-mo"]), vis(PA, state="off")],
    "script.crazy_mode_resume": [vis(PA, state="on")],
    "script.crazy_mode_restart": [vis(PH, state_not="Off")],
    "script.crazy_mode_stop": [vis(PH, state_not="Off")],
}


def test_banner_chips_show_by_phase_and_pause():
    assert chips(BANNER) == CHIP_RULES


def test_popup_run_buttons_follow_the_same_rules():
    assert chips(POPUP) == CHIP_RULES


def test_off_is_quoted_so_yaml_does_not_read_it_as_false():
    for path in (POPUP, BANNER, VACUUM_BANNER):
        for d in walk(dash(path)):
            for k in ("state", "state_not"):
                if k in d and ("entity" in d or "condition" in d):
                    vals = d[k] if isinstance(d[k], list) else [d[k]]
                    assert all(isinstance(v, str) for v in vals), (path.name, d)


def test_banner_shows_while_a_run_goes_and_the_vacuum_banner_yields():
    b = dash(BANNER)
    assert b["type"] == "conditional"
    assert b["conditions"] == [{"condition": "state", "entity": PH, "state_not": "Off"}]
    v = dash(VACUUM_BANNER)
    assert {"condition": "state", "entity": PH, "state": "Off"} in v["conditions"]
    assert any(c.get("entity") == "vacuum.main_floor_vacuum" for c in v["conditions"])


def test_popup_idle_view_has_zone_tiles_slider_and_start_and_run_view_the_rest():
    p = dash(POPUP)
    idle, run = p["cards"][1], p["cards"][2]
    assert idle["conditions"][0]["state"] == "Off" and run["conditions"][0]["state_not"] == "Off"
    idle_text = yaml.dump(idle)
    for needle in ("input_number.crazy_mode_crazy_minutes", "script.crazy_mode_start", "sensor.crazy_mode_reason"):
        assert needle in idle_text
    assert "script.crazy_mode_pause" not in idle_text
    run_text = yaml.dump(run)
    assert "script.crazy_mode_start'" not in run_text and "input_number.crazy_mode_crazy_minutes" not in run_text
    # the zone tiles pick real select options
    opts = load("crazy_mode_helpers.yaml")["input_select"]["crazy_mode_zone"]["options"]
    picked = [d["data"]["option"] for d in walk(idle) if d.get("perform_action") == "input_select.select_option"]
    assert picked == opts
    # a Paused banner exists in the run view
    assert any(d.get("name") == "Paused" for d in walk(run))


def test_popup_keeps_the_settings_cards():
    text = POPUP.read_text()
    for needle in ("script.crazy_mode_allow_again", "input_datetime.crazy_mode_morning_start",
                   "input_number.crazy_mode_base_volume"):
        assert needle in text
