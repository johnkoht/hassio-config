"""
Regression tests for emergency mode, PR 2: critical delivery (JK-1149, JK-1165).

A critical push must reach everyone whatever notification_level is, and a
burst of pushes must not drop it. A tornado warning must speak on every speaker
at any hour. Static YAML plus real Jinja2; no HA, alarm, Noonlight or siren.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
NOTIFY = REPO / "packages/general_notifications.yaml"
FIRE = REPO / "packages/security/fire_alarm/fire_alarm_triggered.yaml"
ALARM = REPO / "packages/security/alarm/alarm_triggered.yaml"
WEATHER = REPO / "packages/weather/severe_weather_alert/severe_weather_warning.yaml"
AIR = REPO / "packages/air_quality/air_quality_alert.yaml"


def load(path):
    return yaml.safe_load(Path(path).read_text())


def notification():
    return load(NOTIFY)["script"]["general_notification"]


def gates(level, priority):
    """Run the two notification-level conditions. True = the push is sent."""
    seq = notification()["sequence"]
    env = Environment(undefined=StrictUndefined)
    state = type("S", (), {"state": level})()
    states = type("St", (), {"input_select": type("D", (), {"notification_level": state})()})()

    def passes(cond):
        if cond["condition"] == "template":
            return env.from_string(cond["value_template"]).render(
                priority=priority, states=states).strip().lower() == "true"
        if cond["condition"] == "state":
            return level == cond["state"]
        if cond["condition"] == "or":
            return any(passes(c) for c in cond["conditions"])
        raise AssertionError(cond)

    return all(passes(c) for c in seq if "condition" in c)


def test_general_notification_is_parallel_with_room_for_a_burst():
    cfg = notification()
    assert cfg["mode"] == "parallel" and cfg["max"] >= 25


@pytest.mark.parametrize("level", ["All", "Important", "None"])
def test_critical_push_is_sent_at_every_level(level):
    assert gates(level, "critical") is True


def test_other_priorities_still_respect_the_level():
    assert gates("None", "time-sensitive") is False
    assert gates("None", "active") is False
    assert gates("Important", "active") is False
    assert gates("Important", "passive") is False
    assert gates("Important", "time-sensitive") is True
    assert gates("All", "active") is True
    assert gates("All", "passive") is True


def pushes(path, script_key):
    seq = load(path)["script"][script_key]["sequence"]
    par = next(s for s in seq if "parallel" in s)["parallel"]
    return [b for b in par if b.get("target", {}).get("entity_id") == "script.general_notification"]


def test_fire_and_alarm_pushes_go_to_everyone_as_critical():
    for path, key in ((FIRE, "fire_alarm_alert"), (ALARM, "security_alarm_alert")):
        (push,) = pushes(path, key)
        data = push["data"]["variables"]
        assert data["devices"] == "all" and data["priority"] == "critical", path


def tornado_branch():
    actions = load(WEATHER)["automation"][0]["actions"]
    for rep in actions:
        for step in rep["repeat"]["sequence"]:
            for item in step.get("then", []):
                if "tornado" in str(item.get("data", {}).get("speech_message", "")).lower():
                    return item
    raise AssertionError("no tornado branch")


def test_tornado_uses_critical_announcement_on_every_speaker():
    item = tornado_branch()
    assert item["action"] == "script.critical_announcement"
    assert item["data"]["media_players"] == "all"
    assert "priority" not in item["data"]  # critical_announcement sets it itself


def test_tornado_no_longer_reaches_the_queue_purge_path():
    """Only queue-path critical items trigger append.yaml's purge; the tornado
    branch must not call voice_announcement at all."""
    text = yaml.safe_dump(tornado_branch())
    assert "voice_announcement" not in text


def test_hazardous_air_stays_on_voice_announcement():
    assert "script.voice_announcement" in AIR.read_text()
    assert "critical_announcement" not in AIR.read_text()


# ---- Volume ceiling (owner rule, 2026-10-30): no announcement sets a Sonos
# volume above 75. The speakers are in-ceiling on amps. Emergency mode only
# skips the quiet-mode halving; it never raises the level.
VOLUME_CEILING = 75
ANNOUNCEMENTS = REPO / "packages/announcements"


def test_engine_volume_selectors_and_defaults_stay_at_or_under_the_ceiling():
    fields = load(ANNOUNCEMENTS / "announcement_engine.yaml")["script"]["announcement_engine"]["fields"]
    for name in ("sound_volume", "speech_volume"):
        assert fields[name]["selector"]["number"]["max"] <= VOLUME_CEILING, name
        assert fields[name]["default"] <= VOLUME_CEILING, name


def test_queue_volume_defaults_stay_at_or_under_the_ceiling():
    fields = load(ANNOUNCEMENTS / "queue/enqueue.yaml")["script"]["announcement_queue_enqueue"]["fields"]
    for name in ("sound_volume", "speech_volume"):
        assert fields[name]["default"] <= VOLUME_CEILING, name


def test_every_base_volume_literal_is_at_or_under_the_ceiling():
    """`{% set vol = N %}` bases in announcements/, plus the bare numbers the
    doorbell and hourly dong render as their chime volume."""
    import re
    found = []
    for path in ANNOUNCEMENTS.rglob("*.yaml"):
        found += [(path.name, int(n)) for n in re.findall(r"set vol = (\d+)", path.read_text())]
    for rel in ("packages/doorbell_ring.yaml", "packages/hourly_dong.yaml"):
        text = (REPO / rel).read_text()
        block = text[text.index("sound_file_volume: >-"):]
        block = block[:block.index("{% endif %}")]
        found += [(rel, int(n)) for n in re.findall(r"^\s+(\d+)\s*$", block, re.M)]
    assert len(found) >= 8, found  # the scan really found the volume bases
    assert [f for f in found if f[1] > VOLUME_CEILING] == []


def test_critical_volume_is_still_40():
    cfg = load(ANNOUNCEMENTS / "critical_announcement.yaml")["script"]["critical_announcement"]["variables"]
    for key in ("sound_file_volume", "speech_volume"):
        assert "set vol = 40" in cfg[key]


def engine_volume_templates():
    seq = load(ANNOUNCEMENTS / "announcement_engine.yaml")["script"]["announcement_engine"]["sequence"]
    plays = [s for s in seq if s.get("action") == "media_player.play_media"]
    assert len(plays) == 2
    return {"sound_volume": plays[0]["data"]["extra"]["volume"],
            "speech_volume": plays[1]["data"]["extra"]["volume"]}


@pytest.mark.parametrize("field", ["sound_volume", "speech_volume"])
@pytest.mark.parametrize("given,expected", [
    (30, 30), ("30", 30), (75, 75), (200, 75), ("90", 75), (75.5, 75), (1000000, 75),
    (27.5, 27), ("not a number", 30), (None, 30),
    # clamped at the bottom too: nothing negative, and NaN can't slip through
    (-5, 0), ("-5", 0), (-1000000, 0), ("-inf", 0), ("inf", 75), ("nan", 30), (0, 0),
])
def test_engine_clamps_runtime_volume_to_the_ceiling(field, given, expected):
    """Whatever a caller passes, the volume that reaches play_media is <= 75."""
    template = engine_volume_templates()[field]
    out = Environment(undefined=StrictUndefined).from_string(template).render(**{field: given})
    assert int(out) == expected and int(out) <= VOLUME_CEILING
    import ast
    assert type(ast.literal_eval(out.strip())) is int  # HA native typing hands play_media an int


@pytest.mark.parametrize("field", ["sound_volume", "speech_volume"])
def test_engine_volume_undefined_falls_back_and_stays_under_the_ceiling(field):
    template = engine_volume_templates()[field]
    assert int(Environment(undefined=StrictUndefined).from_string(template).render()) == 30


def test_engine_has_no_other_volume_path():
    seq = load(ANNOUNCEMENTS / "announcement_engine.yaml")["script"]["announcement_engine"]["sequence"]
    keys, actions = [], []

    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if "volume" in str(k):
                    keys.append(k)
                if k == "action":
                    actions.append(v)
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(seq)
    assert keys == ["volume", "volume"]  # the two clamped extra.volume values
    assert not [a for a in actions if "volume" in str(a)]  # no media_player.volume_set
