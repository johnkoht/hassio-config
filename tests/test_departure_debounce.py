"""
Regression tests for departure announcements holding through a zone flap (JK-1242).

A companion-app tracker flapping leave -> enter -> leave within seconds announced a
departure twice. Every per-person departure announcement now waits out a short hold.
Only the announcement is held; the away/home state itself is untouched.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent

FILES = sorted(
    p
    for root in ("packages/people", "automation/people")
    for p in (REPO / root).rglob("*_announce_departure.yaml")
)


def load(path):
    data = yaml.safe_load(path.read_text())
    if isinstance(data, dict) and "automation" in data:
        return data["automation"][0]
    return data


def triggers(auto):
    return auto.get("triggers") or auto.get("trigger")


def hold_seconds(trigger):
    f = trigger.get("for") or {}
    return f.get("hours", 0) * 3600 + f.get("minutes", 0) * 60 + f.get("seconds", 0)


def announcements(timeline, trigger, end):
    """Count firings of a state trigger with `to` and `for`, given [(t, state)] changes."""
    to, hold = trigger["to"], hold_seconds(trigger)
    fired = 0
    for i, (t, state) in enumerate(timeline):
        if state != to:
            continue
        nxt = timeline[i + 1][0] if i + 1 < len(timeline) else end
        if nxt - t >= hold:
            fired += 1
    return fired


def test_every_person_departure_announcement_is_covered():
    names = {p.name for p in FILES}
    expected = {f"{n}_announce_departure.yaml" for n in
                ["alex", "celi", "cristina", "jido", "joe", "john", "katia", "nonna", "nonno", "tayta"]}
    assert expected <= names


@pytest.mark.parametrize("path", FILES, ids=lambda p: p.name)
def test_departure_trigger_holds_before_announcing(path):
    ts = triggers(load(path))
    assert len(ts) == 1
    t = ts[0]
    assert t.get("to") in ("not_home", "off")  # `for` needs an explicit target state
    assert 30 <= hold_seconds(t) <= 120


@pytest.mark.parametrize("path", FILES, ids=lambda p: p.name)
def test_zone_flap_announces_once_and_a_real_departure_still_announces(path):
    t = triggers(load(path))[0]
    away, home = t["to"], ("home" if t["to"] == "not_home" else "on")
    # leave -> enter -> leave within 27 s, then stays away
    assert announcements([(0, away), (10, home), (27, away)], t, end=600) == 1
    # leave -> enter and stays home: no announcement
    assert announcements([(0, away), (10, home)], t, end=600) == 0
    # a plain departure announces once
    assert announcements([(0, away)], t, end=600) == 1
