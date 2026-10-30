"""
Regression tests for emergency mode, PR 1 (JK-1149, JK-1165).

Static YAML checks plus real Jinja2 rendering. Nothing here calls Home
Assistant, an alarm, Noonlight or a siren.

A critical announcement must play in full at any hour; nothing else may play
while binary_sensor.emergency_active is on.
"""
import ast
from datetime import datetime, timezone
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
EMERGENCY = REPO / "packages/security/emergency"
ENGINE = REPO / "packages/announcements/announcement_engine.yaml"
CRITICAL = REPO / "packages/announcements/critical_announcement.yaml"
PROCESSOR = REPO / "packages/announcements/queue/processor.yaml"
APPEND = REPO / "packages/announcements/queue/append.yaml"
NOW = datetime(2026, 1, 1, 3, 0, 0, tzinfo=timezone.utc)
FUTURE = "2026-01-01T03:10:00+00:00"
PAST = "2026-01-01T02:50:00+00:00"


def load(path):
    return yaml.safe_load(Path(path).read_text())


def native(text):
    """Mimic HA's native template typing: literal_eval the rendered text."""
    text = text.strip()
    try:
        return ast.literal_eval(text)
    except (ValueError, SyntaxError):
        return text


def render(template, states=None, attrs=None, **ctx):
    states = states or {}
    attrs = attrs or {}
    # Strict, so a template that relies on a missing variable fails here
    env = Environment(undefined=StrictUndefined)
    env.globals.update(
        now=lambda: NOW,
        is_state=lambda e, s: states.get(e) == s,
        states=lambda e: states.get(e, "unknown"),
        state_attr=lambda e, a: attrs.get((e, a)),
    )
    return native(env.from_string(template).render(**ctx))


# ---------------------------------------------------------------- task 1

def test_emergency_files_have_unique_basenames_and_matching_ids():
    names = {"emergency_mode", "emergency_active", "emergency_mode_auto_off"}
    for name in names:
        assert (EMERGENCY / f"{name}.yaml").exists()
        # !include_dir_named keys packages by basename across the whole tree
        hits = [p for p in (REPO / "packages").rglob(f"{name}.*") if p.is_file()]
        assert len(hits) == 1, hits
    assert load(EMERGENCY / "emergency_mode_auto_off.yaml")["automation"][0]["id"] == "emergency_mode_auto_off"


def test_manual_override_has_no_initial():
    cfg = load(EMERGENCY / "emergency_mode.yaml")["input_boolean"]["emergency_mode"]
    assert "initial" not in cfg


def sensor_state(**states):
    sensor = load(EMERGENCY / "emergency_active.yaml")["template"][0]["binary_sensor"][0]
    return render(sensor["state"], states=states)


@pytest.mark.parametrize("states,expected", [
    ({"alarm_control_panel.alarmo": "triggered"}, True),
    ({"binary_sensor.smoke_detector": "on"}, True),
    ({"input_boolean.emergency_mode": "on"}, True),
    ({"alarm_control_panel.alarmo": "armed_away", "binary_sensor.smoke_detector": "off",
      "input_boolean.emergency_mode": "off"}, False),
    ({"alarm_control_panel.alarmo": "pending"}, False),
    ({}, False),  # every source missing
    ({"alarm_control_panel.alarmo": "unavailable", "binary_sensor.smoke_detector": "unavailable"}, False),
])
def test_emergency_active_truth_table(states, expected):
    assert sensor_state(**states) is expected


def test_emergency_sensor_has_unique_and_default_entity_id():
    sensor = load(EMERGENCY / "emergency_active.yaml")["template"][0]["binary_sensor"][0]
    assert sensor["unique_id"] == "emergency_active"
    assert sensor["default_entity_id"] == "binary_sensor.emergency_active"


def test_auto_off_triggers_and_action():
    auto = load(EMERGENCY / "emergency_mode_auto_off.yaml")["automation"][0]
    state = [t for t in auto["triggers"] if t["trigger"] == "state"]
    assert len(state) == 1 and state[0]["entity_id"] == "input_boolean.emergency_mode"
    assert state[0]["to"] == "on" and state[0]["for"] == {"minutes": 10}
    assert any(t["trigger"] == "homeassistant" and t["event"] == "start" for t in auto["triggers"])
    # a reload loses the pending for: timer
    assert any(t["trigger"] == "event" and t["event_type"] == "automation_reloaded" for t in auto["triggers"])
    (action,) = auto["actions"]
    assert action["action"] == "input_boolean.turn_off"
    assert action["target"]["entity_id"] == "input_boolean.emergency_mode"


# ---------------------------------------------------------------- task 2

def engine():
    return load(ENGINE)["script"]["announcement_engine"]


def gate(emergency, **ctx):
    step = engine()["sequence"][0]
    assert step["condition"] == "template"
    states = {} if emergency is None else {"binary_sensor.emergency_active": emergency}
    return render(step["value_template"], states=states, **ctx)


def test_gate_is_the_first_engine_step():
    assert engine()["sequence"][0]["condition"] == "template"
    assert engine()["sequence"][1]["action"] == "media_player.play_media"


@pytest.mark.parametrize("emergency", ["off", "unavailable", "unknown", None])
@pytest.mark.parametrize("ctx", [{}, {"priority": "normal"}, {"priority": "low"}])
def test_gate_fails_open_without_an_active_emergency(emergency, ctx):
    assert gate(emergency, **ctx) is True


def test_gate_passes_only_critical_during_an_emergency():
    assert gate("on", priority="critical") is True
    for ctx in ({}, {"priority": "normal"}, {"priority": "high"}, {"priority": "low"}, {"priority": ""}):
        assert gate("on", **ctx) is False, ctx


def test_priority_field_declared_and_burst_does_not_drop_critical():
    cfg = engine()
    assert "priority" in cfg["fields"]
    assert cfg["mode"] == "queued" and cfg["max"] >= 25
    assert cfg["sequence"][1]["continue_on_error"] is True  # a chime failure can't skip the TTS


def tts_wait(message):
    step = next(s for s in engine()["sequence"] if "Wait for TTS" in s.get("alias", ""))
    return render(step["delay"], speech_message=message)


def test_tts_wait_is_conservative():
    assert tts_wait("") == 3
    assert tts_wait("x" * 75) == 9      # the alarm message waited 6 s before
    assert tts_wait("x" * 200) == 18


def test_chime_only_path_still_stops_without_a_message():
    step = next(s for s in engine()["sequence"] if "TTS message" in s.get("alias", ""))
    assert render(step["value_template"]) is False
    assert render(step["value_template"], speech_message="hi") is True


@pytest.mark.parametrize("path", ["packages/doorbell_ring.yaml", "packages/hourly_dong.yaml"])
def test_doorbell_and_dong_still_call_the_engine_directly(path):
    assert "action: script.announcement_engine" in (REPO / path).read_text()


# ---------------------------------------------------------------- task 3

def critical():
    return load(CRITICAL)["script"]["critical_announcement"]


def engine_call():
    return next(s for s in critical()["sequence"] if s.get("action") == "script.turn_on")


def test_critical_bypasses_the_queue():
    text = yaml.safe_dump(critical()["sequence"])  # comments excluded
    assert "announcement_queue_enqueue" not in text and "mqtt" not in text.lower()
    call = engine_call()
    assert call["target"]["entity_id"] == "script.announcement_engine"


def test_critical_engine_call_sends_declared_fields_with_critical_priority():
    sent = engine_call()["data"]["variables"]
    assert sent["priority"] == "critical"
    assert set(sent) == {"priority", "speech_message", "sound_file", "sound_length",
                         "sound_volume", "speech_volume", "media_players"}
    assert set(sent) <= set(engine()["fields"]), set(sent) - set(engine()["fields"])


def test_critical_saves_message_before_the_engine_call():
    seq = critical()["sequence"]
    save = next(i for i, s in enumerate(seq) if s.get("action") == "input_text.set_value")
    call = next(i for i, s in enumerate(seq) if s.get("action") == "script.turn_on")
    assert save < call
    assert seq[save]["target"]["entity_id"] == "input_text.latest_voice_announcement"


class _Entity:
    def __init__(self, state):
        self.state = state


class _Domain:
    def __init__(self, entities):
        self._entities = entities

    def __getattr__(self, name):
        return self._entities.get(name)


def players(mode, occupied=()):
    states = type("S", (), {"input_boolean": _Domain({n: _Entity("on") for n in occupied})})()
    template = critical()["variables"]["target_players"]
    return native(Environment().from_string(template).render(media_players=mode, states=states))


def test_critical_players_all_auto_and_single():
    assert len(players("all")) == 8 and "media_player.sonos_basement" in players("all")
    assert players("auto", ["kitchen_occupied"]) == ["media_player.sonos_kitchen"]
    assert players("media_player.sonos_office") == "media_player.sonos_office"


def volumes(quiet, emergency):
    states = {}
    if quiet:
        states["input_boolean.quiet_mode"] = "on"
    if emergency:
        states["binary_sensor.emergency_active"] = "on"
    ent = type("S", (), {"input_boolean": _Domain({"quiet_mode": _Entity("on" if quiet else "off")})})()
    out = {}
    for key in ("sound_file_volume", "speech_volume"):
        env = Environment()
        env.globals.update(is_state=lambda e, s: states.get(e) == s)
        out[key] = native(env.from_string(critical()["variables"][key]).render(states=ent))
    return out


def test_critical_quiet_halving_skipped_during_an_emergency():
    assert volumes(False, False) == {"sound_file_volume": 40, "speech_volume": 40}
    assert volumes(True, False) == {"sound_file_volume": 20, "speech_volume": 20}   # a leak at night
    assert volumes(True, True) == {"sound_file_volume": 40, "speech_volume": 40}    # fire or alarm


# ---------------------------------------------------------------- task 4

def processor():
    return load(PROCESSOR)["automation"][0]


def hold_condition():
    return next(c for c in processor()["conditions"] if "emergency" in c.get("alias", ""))


def hold(emergency, queue):
    states = {} if emergency is None else {"binary_sensor.emergency_active": emergency}
    return render(hold_condition()["value_template"], states=states,
                  attrs={("sensor.announcement_queue", "queue"): queue})


def item(priority, expires_at=None):
    msg = {"priority": priority, "speech_message": priority}
    if expires_at:
        msg["expires_at"] = expires_at
    return msg


def test_processor_holds_non_critical_during_an_emergency():
    assert hold("on", [item("normal")]) is False
    assert hold("on", [item("high"), item("critical")]) is False
    assert hold("on", [item("critical"), item("normal")]) is True
    # an expired critical item is not what `next` will be
    assert hold("on", [item("critical", PAST), item("normal")]) is False
    assert hold("on", [item("critical", PAST), item("critical", FUTURE)]) is True


@pytest.mark.parametrize("emergency", ["off", "unavailable", None])
def test_processor_unchanged_without_an_emergency(emergency):
    assert hold(emergency, [item("normal")]) is True


def test_processor_resumes_when_the_emergency_clears():
    trig = [t for t in processor()["triggers"] if t.get("entity_id") == "binary_sensor.emergency_active"]
    assert len(trig) == 1 and trig[0]["to"] == "off" and trig[0]["id"] == "emergency_cleared"


def test_processor_keeps_its_existing_gates():
    text = PROCESSOR.read_text()
    for needle in ("input_boolean.house_occupied", "input_boolean.quiet_mode", "hour < 9",
                   "input_boolean.announcement_queue_running", "binary_sensor.announceable_rooms_occupied"):
        assert needle in text


def engine_step():
    for step in processor()["actions"]:
        for opt in step.get("choose", []):
            first = opt["sequence"][0]
            if first.get("action") == "script.announcement_engine":
                return first
    raise AssertionError("no engine call")


def test_processor_passes_priority_to_the_engine():
    prio = engine_step()["data"]["priority"]
    assert render(prio, next={"priority": "high"}) == "high"
    assert render(prio, next={}) == "normal"
    assert "priority" in engine()["fields"]


def variables(name):
    for step in processor()["actions"]:
        if name in step.get("variables", {}):
            return step["variables"]
    raise AssertionError(name)


def render_queue_and_updated(live, trigger_id):
    class T:  # mimics trigger context
        id = trigger_id
    ctx = dict(trigger=T)
    purge = render(variables("purge_low")["purge_low"], **ctx)
    base = variables("raw_queue")
    queue = render(base["queue"], attrs={("sensor.announcement_queue", "queue"): live},
                   raw_queue=live, purge_low=purge)
    upd = render(variables("updated")["updated"], attrs={("sensor.announcement_queue", "queue"): live},
                 purge_low=purge, next={})
    return queue, upd


def test_low_items_dropped_only_when_the_emergency_clears():
    live = [item("high", FUTURE), item("low", FUTURE), item("normal", FUTURE)]
    for_clear = render_queue_and_updated(live, "emergency_cleared")
    assert [m["priority"] for m in for_clear[0]] == ["high", "normal"]
    assert [m["priority"] for m in for_clear[1]] == ["high", "normal"]
    other = render_queue_and_updated(live, "something_else")
    assert [m["priority"] for m in other[0]] == ["high", "low", "normal"]
    assert [m["priority"] for m in other[1]] == ["high", "low", "normal"]


def test_expired_items_dropped_on_clear_as_before():
    live = [item("normal", PAST), item("high", FUTURE)]
    assert [m["priority"] for m in render_queue_and_updated(live, "emergency_cleared")[0]] == ["high"]


def test_critical_via_the_queue_plays_during_an_emergency():
    """append.yaml keeps its purge (a queue-path critical item still goes first and
    drops other queued items); the processor and the engine gate both let it through."""
    updated = next(s for s in load(APPEND)["automation"][0]["actions"] if "updated" in s.get("variables", {}))
    assert "new_item.priority == 'critical'" in updated["variables"]["updated"]
    assert hold("on", [item("critical"), item("normal")]) is True
    assert gate("on", priority="critical") is True
