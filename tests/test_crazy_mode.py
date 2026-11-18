"""Crazy Mode: structure checks for the guards the plan pins, plus a Jinja
harness that renders the allowed-window sensor. Times here are synthetic.

Set CRAZY_MODE_DIR to point the tests at a scratch copy of the package (used
to prove each guard goes red when sabotaged).
"""
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
HOME = ROOT / "dashboards/kohbo/home/home.yaml"

SPEAKERS = [
    "media_player.sonos_kitchen",
    "media_player.sonos_family_room",
    "media_player.sonos_living_room",
    "media_player.sonos_playroom",
]
RUN = "script.crazy_mode_run"


class _L(yaml.SafeLoader):
    pass


for _t in ("!include", "!secret", "!include_dir_named", "!include_dir_list", "!include_dir_merge_list"):
    _L.add_constructor(_t, lambda loader, node: None)


def load(name):
    return yaml.load((PKG / name).read_text(), Loader=_L)


def walk(n):
    if isinstance(n, dict):
        yield n
        for v in n.values():
            yield from walk(v)
    elif isinstance(n, list):
        for v in n:
            yield from walk(v)


def called(n, name):
    return [d for d in walk(n) if d.get("action") == name]


def script(name):
    return load(f"{name}.yaml")["script"][name]


def seq(name):
    return script(name)["sequence"]


# ---- Harness for the allowed sensor ---------------------------------------
TZ = timezone(timedelta(hours=-6))
NOW = datetime(2026, 1, 5, 3, 10, tzinfo=TZ)  # synthetic
MID = NOW.replace(hour=0, minute=0, second=0, microsecond=0)


def secs(hhmm):
    h, m = (int(x) for x in hhmm.split(":"))
    return h * 3600 + m * 60


GOOD_SOURCES = ["Alpha", "Beta", "Gamma", "Other"]
BASE = {
    "input_select.crazy_mode_phase": "Off",
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


def render(template, now=NOW, states=None, attrs=None, sources=None):
    st = dict(BASE)
    st.update(states or {})
    at = dict(WINDOWS)
    at["input_datetime.crazy_mode_last_run"] = 0
    at.update(attrs or {})
    src = {sp: GOOD_SOURCES for sp in SPEAKERS}
    src.update(sources or {})
    env = Environment()
    mid = now.replace(hour=0, minute=0, second=0, microsecond=0)

    def state_attr(e, a):
        if a == "timestamp":
            v = at.get(e)
            return v
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
    assert len(files) >= 9
    for f in files:
        assert load(f.name), f.name


def test_no_initial_on_any_helper():
    for f in PKG.glob("*.yaml"):
        for d in walk(load(f.name)):
            assert "initial" not in d, f"{f.name} has initial:"
            assert "initial_state" not in d, f"{f.name} has initial_state:"


def test_no_times_in_yaml():
    # Only the timer durations and midnight may appear; window times are dashboard-set.
    allowed = {"00:00", "00:05:00", "00:01:00"}
    for f in [*PKG.glob("*.yaml"), POPUP]:
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
    assert "crazy_mode_phase" in hh["timer"]
    assert set(hh["input_text"]) == {
        "crazy_mode_favorite_crazy", "crazy_mode_favorite_slowmo", "crazy_mode_favorite_cooldown"}
    v = hh["input_number"]["crazy_mode_base_volume"]
    assert v["unit_of_measurement"] == "%" and v["min"] < v["max"]


def test_speaker_lists_agree():
    start = script("crazy_mode_start")["variables"]["speakers"]
    restore = script("crazy_mode_restore")["variables"]["speakers"]
    assert start == restore == SPEAKERS
    assert all(sp in sensor_cfg()["state"] for sp in SPEAKERS)


def test_no_package_file_writes_the_room_flag():
    for f in PKG.glob("*.yaml"):
        text = f.read_text()
        assert "kitchen_lighting_automations" not in text, f.name
        assert "kitchen_occupied" not in text, f.name


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


def step_index(steps, pred):
    for i, s in enumerate(steps):
        if pred(s):
            return i
    raise AssertionError("step not found")


def test_start_has_no_fields():
    assert "fields" not in script("crazy_mode_start")
    assert script("crazy_mode_start")["alias"] == "Crazy Mode"


def test_start_gates_on_allowed_sensor_and_stops():
    first = start_steps()[0]
    assert "binary_sensor.crazy_mode_allowed" in yaml.dump(first["if"])
    assert any("stop" in d for d in walk(first["then"]))


def test_refusal_speaks_only_for_window_reasons():
    first = start_steps()[0]
    cond = [d for d in walk(first["then"]) if "value_template" in d][0]["value_template"]
    assert "outside_window" in cond and "already_ran" in cond
    for silent in ("house_mode", "emergency", "not_occupied", "running"):
        assert silent not in cond
    call = called(first["then"], "script.turn_on")[0]
    msg = call["data"]["variables"]["speech_message"]
    assert "Crazy Mode is recharging" in msg and "retry" in msg
    assert call["data"]["variables"]["media_players"] == ["media_player.sonos_kitchen"]
    assert call["data"]["variables"]["sound_file"] and call["data"]["variables"]["sound_length"]


def test_refusal_line_renders():
    first = start_steps()[0]
    call = called(first["then"], "script.turn_on")[0]
    out = render(call["data"]["variables"]["speech_message"].replace(
        "state_attr('sensor.crazy_mode_reason', 'retry')", "'tonight'"))
    assert out == "Crazy Mode is recharging — back tonight"


def test_snapshots_come_before_any_change():
    steps = start_steps()
    snap_sonos = step_index(steps, lambda s: s.get("action") == "sonos.snapshot")
    snap_lights = step_index(steps, lambda s: s.get("action") == "scene.create")
    al_off = step_index(steps, lambda s: s.get("action") == "switch.turn_off")
    latch = step_index(steps, lambda s: "kitchen_lights_manually_toggled" in yaml.dump(s))
    unjoin = step_index(steps, lambda s: "media_player.unjoin" in yaml.dump(s))
    join = step_index(steps, lambda s: s.get("action") == "media_player.join")
    handoff = step_index(steps, lambda s: s.get("action") == "script.turn_on" and RUN in yaml.dump(s))
    assert max(snap_sonos, snap_lights) < min(al_off, latch, unjoin, join) < handoff
    assert steps[snap_sonos]["data"]["with_group"] is True
    assert steps[snap_lights]["data"]["scene_id"] == "crazy_mode_snapshot"


def test_snapshot_uses_leaf_lights_and_al_switches():
    v = script("crazy_mode_start")["variables"]
    assert not any(e in v["loop_lights"] for e in (
        "light.kitchen_lights", "light.foyer_lights", "light.dining_room_lights",
        "light.kitchen_ceiling_lights"))
    assert all(e.startswith("light.") for e in v["loop_lights"])
    assert v["al_switches"] == [
        "switch.adaptive_lighting_kitchen", "switch.adaptive_lighting_family_room",
        "switch.adaptive_lighting_foyer"]


def test_latch_is_set_only_when_it_was_off_and_recorded():
    steps = start_steps()
    s = [x for x in steps if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    assert s["if"][0]["entity_id"] == "input_boolean.kitchen_lights_manually_toggled"
    assert s["if"][0]["state"] == "off"
    targets = [c["target"]["entity_id"] for c in called(s["then"], "input_boolean.turn_on")]
    assert targets == ["input_boolean.crazy_mode_kitchen_latch_set", "input_boolean.kitchen_lights_manually_toggled"]


def test_start_records_last_run_and_takes_the_phase():
    steps = start_steps()
    assert "input_datetime.crazy_mode_last_run" in yaml.dump(steps)
    phase = step_index(steps, lambda s: s.get("action") == "input_select.select_option")
    assert steps[phase]["data"]["option"] == "Crazy"
    assert steps[phase]["target"]["entity_id"] == "input_select.crazy_mode_phase"
    assert phase < step_index(steps, lambda s: s.get("action") == "sonos.snapshot")


def test_start_forgets_a_stale_latch_record_when_someone_else_holds_the_latch():
    s = [x for x in start_steps() if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    off = called(s["else"], "input_boolean.turn_off")[0]
    assert off["target"]["entity_id"] == "input_boolean.crazy_mode_kitchen_latch_set"


def test_handoff_is_non_blocking_and_passes_lists():
    last = start_steps()[-1]
    assert last["action"] == "script.turn_on"
    assert last["target"]["entity_id"] == RUN
    assert set(last["data"]["variables"]) == {"speakers", "loop_lights"}


# ---- run script -------------------------------------------------------------
def run_steps():
    return seq("crazy_mode_run")


def test_run_refuses_to_start_after_an_abort():
    steps = run_steps()
    guard = [x for x in steps[:3] if x.get("entity_id") == "input_select.crazy_mode_phase"]
    assert guard and guard[0]["state"] == "Crazy"


def test_voice_lines_never_block_except_the_closing_line():
    blocking = [d for d in walk(run_steps()) if d.get("action") == "script.announcement_engine"]
    assert len(blocking) == 1
    assert "Save your world." in blocking[0]["data"]["speech_message"]
    assert blocking[0]["data"]["speech_message"].endswith("Save your world.")
    # and it is the second-to-last step, right before the restore
    assert run_steps()[-2] == [s for s in run_steps() if s.get("action") == "script.announcement_engine"][0]
    assert run_steps()[-1]["action"] == "script.crazy_mode_restore"


def test_voice_lines_carry_chime_volume_and_four_speakers():
    for d in walk(run_steps()):
        if d.get("action") == "script.turn_on" and d["target"]["entity_id"] == "script.announcement_engine":
            v = d["data"]["variables"]
            assert v["sound_file"] and v["sound_length"] and v["speech_message"]
            assert v["media_players"] == "{{ speakers }}"
            assert "75" in v["speech_volume"] or "speech_vol" in v["speech_volume"]


def test_speech_volume_is_capped_at_75():
    t = [s for s in run_steps() if "variables" in s and "speech_vol" in s["variables"]][0]["variables"]["speech_vol"]
    for base in (20, 40, 70, 500):
        env = Environment()
        env.globals["states"] = lambda e, b=base: str(b)
        env.filters["float"] = lambda v, d=0: float(v)
        assert int(env.from_string(t).render()) <= 75


def test_every_wait_runs_to_a_deadline():
    waits = [d for d in walk(run_steps()) if "wait_template" in d]
    assert waits
    for w in waits:
        assert re.search(r"\b(t0|s0|c0)\b", w["timeout"]) and "now().timestamp()" in w["timeout"]
    # delays that carry the clock also derive from a deadline
    for d in walk(run_steps()):
        if "delay" in d and isinstance(d["delay"], str):
            assert re.search(r"\b(t0|s0|c0)\b", d["delay"]), d["delay"]


def test_phases_in_order_and_sources():
    text = yaml.dump(run_steps())
    order = [text.index(f"option: {p}") for p in ("Crazy", "Slow-mo", "Cool-down")]
    assert order == sorted(order)
    for fav in ("fav_crazy", "fav_slowmo", "fav_cooldown"):
        assert fav in text
    assert called(run_steps(), "media_player.shuffle_set")[0]["data"]["shuffle"] is True


def cooldown_tail():
    steps = run_steps()
    i = step_index(steps, lambda s: "variables" in s and "c0" in s["variables"])
    return steps[i + 1:]


def test_cooldown_never_reads_the_stop_button():
    tail = cooldown_tail()
    # the first tail step clears the flag; nothing after waits on it or gates on it
    assert tail[0]["action"] == "input_boolean.turn_off"
    for d in walk(tail[1:]):
        assert "wait_template" not in d
        assert "crazy_mode_stop_requested" not in yaml.dump(d)


def test_slowmo_and_crazy_do_read_the_stop_button():
    steps = run_steps()
    i = step_index(steps, lambda s: "variables" in s and "c0" in s["variables"])
    assert "crazy_mode_stop_requested" in yaml.dump(steps[:i])


def test_lights_never_go_dark_and_are_reasserted():
    levels = []
    for d in walk(run_steps()):
        if d.get("action") == "light.turn_on":
            b = d["data"]["brightness_pct"]
            levels.append(b)
    assert levels and all(str(b).startswith("{{") or b >= 30 for b in levels)
    assert not any(d.get("action") == "light.turn_off" for d in walk(run_steps()))
    # Crazy: re-asserted inside the tick loop
    crazy_loop = [s for s in run_steps() if "repeat" in s and s["repeat"].get("count") == 5][0]
    assert called(crazy_loop, "light.turn_on")
    # Cool-down: re-asserted in the tick loop, steady 30
    tail_calls = called(cooldown_tail(), "light.turn_on")
    assert tail_calls and all(c["data"]["brightness_pct"] == 30 for c in tail_calls)


def test_slowmo_dim_levels_end_near_half():
    t = [d for d in walk(run_steps()) if d.get("action") == "light.turn_on"
         and isinstance(d["data"]["brightness_pct"], str)][0]["data"]["brightness_pct"]
    levels = []
    for i in range(1, 7):
        env = Environment()
        env.globals["repeat"] = type("R", (), {"index": i})()
        levels.append(int(env.from_string(t).render()))
    assert levels == sorted(levels, reverse=True)
    assert levels[0] < 100 and levels[-1] == 50


def test_music_fades_in_steps():
    fades = [d for d in walk(run_steps()) if d.get("action") == "media_player.volume_set"
             and "repeat.index" in str(d["data"]["volume_level"])]
    assert len(fades) == 3  # slow-mo in, cool-down in, cool-down out
    for d in walk(run_steps()):
        if "repeat" in d and called(d["repeat"].get("sequence"), "media_player.volume_set"):
            assert d["repeat"]["count"] >= 5


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


def test_two_prompts_at_start_and_half_of_cooldown():
    tail = yaml.dump(cooldown_tail())
    assert "heavy_work[pick_a | int]" in tail and "heavy_work[pick_b | int]" in tail
    assert "repeat.index == 3" in tail  # tick 3 of 10 s


# ---- stop, restore, abort, cleanup ------------------------------------------
def test_stop_never_cancels_the_run():
    text = (PKG / "crazy_mode_stop.yaml").read_text()
    assert "script.turn_off" not in text and "script.crazy_mode_run" not in text
    s = seq("crazy_mode_stop")
    assert s[0]["state"] == ["Crazy", "Slow-mo"]  # not Cool-down, not Off
    assert s[1]["action"] == "input_boolean.turn_on"
    assert s[1]["target"]["entity_id"] == "input_boolean.crazy_mode_stop_requested"


def test_only_the_emergency_abort_turns_off_the_run():
    hits = []
    for f in (ROOT / "packages").rglob("*.yaml"):
        text = f.read_text()
        if "script.turn_off" in text and "crazy_mode_run" in text:
            hits.append(f.name)
    assert hits == ["crazy_mode_emergency_abort.yaml"]


def test_emergency_abort_trigger_and_steps():
    a = load("crazy_mode_emergency_abort.yaml")["automation"][0]
    t = a["triggers"][0]
    assert t["entity_id"] == "binary_sensor.emergency_active" and t["to"] == "on"
    assert a["actions"][0]["action"] == "script.turn_off"
    assert a["actions"][0]["target"]["entity_id"] == [RUN, "script.crazy_mode_start"]
    assert a["conditions"][0]["condition"] == "not"
    assert a["conditions"][0]["conditions"][0]["entity_id"] == "input_select.crazy_mode_phase"
    assert a["conditions"][0]["conditions"][0]["state"] == "Off"
    assert a["actions"][1]["action"] == "script.crazy_mode_restore"
    assert a["actions"][1]["data"]["emergency"] is True


def test_restore_is_idempotent_and_complete():
    s = script("crazy_mode_restore")
    assert s["mode"] == "single"
    first = s["sequence"][0]
    assert first["condition"] == "not" and first["conditions"][0]["state"] == "Off"
    acts = [x.get("action") for x in s["sequence"]]
    assert acts[1:3] == ["sonos.restore", "scene.turn_on"]
    assert s["sequence"][2]["target"]["entity_id"] == "scene.crazy_mode_snapshot"
    assert called(s["sequence"], "sonos.restore")[0]["data"]["with_group"] is True
    last = s["sequence"][-1]
    assert last["action"] == "input_select.select_option" and last["data"]["option"] == "Off"


def test_restore_clears_the_latch_only_if_we_set_it():
    s = script("crazy_mode_restore")["sequence"]
    step = [x for x in s if "kitchen_lights_manually_toggled" in yaml.dump(x)][0]
    assert step["if"][0]["entity_id"] == "input_boolean.crazy_mode_kitchen_latch_set"
    assert step["if"][0]["state"] == "on"


def test_restore_emergency_ends_with_bright_lights():
    s = script("crazy_mode_restore")["sequence"]
    step = [x for x in s if "emergency" in yaml.dump(x) and "brightness_pct" in yaml.dump(x)][0]
    assert called(step["then"], "light.turn_on")[0]["data"]["brightness_pct"] == 100


def test_cleanup_covers_the_four_resets_and_leaves_sonos_alone():
    a = load("crazy_mode_cleanup_on_start.yaml")["automation"][0]
    assert a["triggers"][0]["event"] == "start"
    text = yaml.dump(a["actions"])
    for needle in ("switch.adaptive_lighting_kitchen", "switch.adaptive_lighting_family_room",
                   "switch.adaptive_lighting_foyer", "crazy_mode_kitchen_latch_set",
                   "crazy_mode_stop_requested", "timer.cancel"):
        assert needle in text
    assert a["actions"][-1]["data"]["option"] == "Off"
    assert "sonos" not in text and "scene." not in text and "light.turn" not in text


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


# ---- dashboard --------------------------------------------------------------
def test_popup_and_home_button():
    p = yaml.load(POPUP.read_text(), Loader=_L)
    assert p["hash"] == "#crazy_mode"
    text = POPUP.read_text()
    for needle in ("script.crazy_mode_start", "script.crazy_mode_stop", "script.crazy_mode_allow_again",
                   "input_datetime.crazy_mode_morning_start", "input_number.crazy_mode_base_volume",
                   "timer.crazy_mode_phase"):
        assert needle in text
    assert "condition: template" not in text
    home = HOME.read_text()
    assert "navigation_path: '#crazy_mode'" in home
    assert "crazy_mode_popup.yaml" in home


# ---- the clock --------------------------------------------------------------
def test_clock_shape_is_pinned():
    steps = run_steps()
    crazy = [x for x in steps if "repeat" in x and x["repeat"].get("count") == 5
             and any("wait_template" in d for d in walk(x))][0]
    w = [d for d in walk(crazy) if "wait_template" in d][0]
    assert "t0 + 60 * repeat.index" in w["timeout"]
    slow = [d for d in walk(steps) if "parallel" in d][0]
    lights = [b for b in slow["parallel"] if "repeat" in b][0]["repeat"]
    assert lights["count"] == 6
    assert "s0 + 10 * repeat.index" in yaml.dump(lights)
    gate = [x for x in steps if "if" in x and "s0" in yaml.dump(x)][0]
    assert gate["if"][0]["entity_id"] == "input_boolean.crazy_mode_stop_requested"
    assert gate["if"][0]["state"] == "off"
    tail = cooldown_tail()
    ticks = [x for x in tail if "repeat" in x and x["repeat"].get("count") == 5
             and "c0 + 10 * repeat.index" in yaml.dump(x)]
    assert len(ticks) == 1
    fade = [x for x in tail if "repeat" in x and "c0 + 50 + 2 * repeat.index" in yaml.dump(x)][0]
    assert fade["repeat"]["count"] == 5  # 50 + 5 * 2 = 60 s


def test_no_fixed_delays_that_carry_the_clock():
    # Only the short settle after select_source and the 2 s fade steps may be integers
    for d in walk(run_steps()):
        if "delay" in d and not isinstance(d["delay"], str):
            assert d["delay"] in (2, 3), d


def test_slowmo_plays_when_stop_is_off():
    steps = run_steps()
    gate = [x for x in steps if "if" in x and "Slow-mo" in yaml.dump(x)][0]
    assert gate["if"][0]["state"] == "off"
    assert "Slow-mo" in yaml.dump(gate["then"])
