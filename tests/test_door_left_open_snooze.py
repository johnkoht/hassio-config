"""Regression test: the door left-open snooze is 10 minutes, not 30."""
from pathlib import Path

import yaml

PATH = Path(__file__).resolve().parent.parent / "packages/security/doors_left_open.yaml"


def test_snooze_timer_is_10_minutes():
    cfg = yaml.safe_load(PATH.read_text())
    timer = cfg["timer"]["snooze_door_left_open_automation"]
    assert timer["duration"] == "00:10:00"
    assert timer["icon"] == "mdi:rewind-10"


def test_snooze_action_title_says_10_minutes():
    acts = yaml.safe_load(PATH.read_text())["automation"][0]["actions"]
    titles = []

    def walk(n):
        if isinstance(n, dict):
            if "title" in n and "action" in n:
                titles.append(n["title"])
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(acts)
    assert "Snooze 10 Minutes" in titles
    assert not any("30" in t for t in titles)
