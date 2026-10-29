"""
Regression tests for the announcement queue processor.

The processor used to publish a queue snapshot taken before playback, which
wiped anything appended while an announcement played (the morning brief,
appended mid-way through the school reminder). Renders the post-playback
`updated` template with real Jinja2 against a stubbed live queue.
"""
from datetime import datetime, timezone
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PROCESSOR = REPO / "packages/announcements/queue/processor.yaml"
NOW = datetime(2026, 1, 1, 15, 0, 10, tzinfo=timezone.utc)  # arbitrary
FUTURE = "2026-01-01T15:10:00+00:00"
PAST = "2026-01-01T14:55:00+00:00"

REMINDER = {"priority": "low", "speech_message": "Time for breakfast", "sound_file": "bell.mp3",
            "expires_at": FUTURE}
BRIEF = {"priority": "high", "speech_message": "Good morning", "sound_file": "default.mp3",
         "expires_at": FUTURE}


def actions():
    return yaml.safe_load(PROCESSOR.read_text())["automation"][0]["actions"]


def step_index(predicate):
    return next(i for i, step in enumerate(actions()) if predicate(step))


def updated_template():
    steps = [s for s in actions() if "updated" in s.get("variables", {})]
    assert len(steps) == 1
    return steps[0]["variables"]["updated"]


def render_updated(live, played):
    env = Environment()
    env.globals.update(
        now=lambda: NOW,
        state_attr=lambda e, a: live if (e, a) == ("sensor.announcement_queue", "queue") else None,
    )
    return yaml.safe_load(env.from_string(updated_template()).render(next=played).strip())


def test_queue_is_trimmed_after_playback_not_before():
    engine = step_index(lambda s: any(
        o.get("sequence", [{}])[0].get("action") == "script.announcement_engine"
        for o in s.get("choose", [])))
    trim = step_index(lambda s: "updated" in s.get("variables", {}))
    publish = step_index(lambda s: s.get("action") == "mqtt.publish"
                         and s["data"]["topic"] == "home/announcement_queue/data")
    assert engine < trim < publish


def test_message_appended_during_playback_survives():
    assert render_updated([REMINDER, BRIEF], REMINDER) == [BRIEF]


def test_played_message_removed_when_resorted_behind_higher_priority():
    assert render_updated([BRIEF, REMINDER], REMINDER) == [BRIEF]


def test_only_first_identical_message_removed():
    assert render_updated([REMINDER, REMINDER], REMINDER) == [REMINDER]


def test_expired_messages_dropped():
    stale = {**BRIEF, "expires_at": PAST}
    assert render_updated([REMINDER, stale], REMINDER) == []


def test_messages_without_expiry_kept():
    forever = {"priority": "high", "speech_message": "No expiry", "sound_file": "x.mp3"}
    assert render_updated([REMINDER, forever], REMINDER) == [forever]


def test_played_message_already_cleared_leaves_queue_alone():
    critical = {"priority": "critical", "speech_message": "Leak", "sound_file": "x.mp3"}
    assert render_updated([critical], REMINDER) == [critical]


def test_empty_or_missing_queue():
    assert render_updated([], {}) == []
    assert render_updated(None, REMINDER) == []


class _Entity:
    def __init__(self, state):
        self.state = state


class _Domain:
    """Mimics HA's `states.<domain>`: an unknown entity is None, not an error."""
    def __init__(self, entities):
        self._entities = entities

    def __getattr__(self, name):
        return self._entities.get(name)


def critical_auto_players(occupied_booleans):
    """Render critical_announcement's media_players for `auto` with the given rooms occupied."""
    script = yaml.safe_load(
        (REPO / "packages/announcements/critical_announcement.yaml").read_text()
    )["script"]["critical_announcement"]
    template = script["sequence"][0]["data"]["media_players"]
    states = type("States", (), {"input_boolean": _Domain(
        {name: _Entity("on") for name in occupied_booleans})})()
    return Environment().from_string(template).render(media_players="auto", states=states)


def test_critical_auto_reaches_occupied_main_bedroom():
    """The auto branch read the nonexistent input_boolean.main_bedroom, so the main
    bedroom never heard a critical announcement (e.g. the leak voice alert)."""
    assert "media_player.sonos_main_bedroom" in critical_auto_players(["main_bedroom_occupied"])
    assert "media_player.sonos_main_bedroom" not in critical_auto_players([])
