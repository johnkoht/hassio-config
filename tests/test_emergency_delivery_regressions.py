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
