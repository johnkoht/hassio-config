"""
Push pruning (plans/notification-deep-links, JK-1068 follow-up).

Pins a few representative outcomes so a revert or a copy-paste brings the noise back
in a visible way.
"""
from pathlib import Path

from test_notification_deep_links import CALLS, REPO, load_plain

ALERT = REPO / "packages/security/cameras/detection_notifications/camera_detection_alert.yaml"


def _blocks():
    seq = load_plain(ALERT)["script"]["camera_detection_alert"]["sequence"]
    out = []
    for step in seq:
        for opt in step.get("choose", []):
            if opt["sequence"][0].get("action") != "notify.ios_family":
                continue
            push = opt["sequence"][0]["data"]["data"]["push"]
            conds = repr(opt["conditions"])
            out.append((conds, push))
    return out


def _push_levels(*, vehicle):
    marker = "== 'vehicle'" if vehicle else "!= 'vehicle'"
    return [p for c, p in _blocks() if marker in c]


def test_vehicle_detections_are_passive_only():
    assert _push_levels(vehicle=True) == [{"interruption-level": "passive"}]


def test_person_and_animal_detections_keep_their_levels():
    levels = _push_levels(vehicle=False)
    assert len(levels) == 3  # bedtime critical, home active, away time-sensitive
    assert {"interruption-level": "active"} in levels
    assert {"interruption-level": "time-sensitive"} in levels
    assert any("sound" in p for p in levels)  # critical at bedtime


def test_animal_automations_still_call_the_alert():
    calls = list(REPO.glob("packages/security/cameras/detections/*/*_detections_animal.yaml"))
    assert len(calls) == 7
    assert all("camera_detection_alert" in f.read_text() for f in calls)


def _pushes(rel):
    return [c for c in CALLS if c[0] == rel]


def test_family_room_logger_push_is_gone_but_the_automation_remains():
    for name in ("occupied", "not_occupied"):
        rel = f"packages/family_room/occupancy/family_room_{name}.yaml"
        assert (REPO / rel).exists()
        assert _pushes(rel) == []
        assert "Family Room Logger" not in (REPO / rel).read_text()


def test_morning_disarm_push_is_passive_and_john_only():
    text = (REPO / "packages/security/alarm/alarm_disarm_in_morning.yaml").read_text()
    assert 'devices: "jk"' in text and 'priority: "passive"' in text


def test_away_mode_is_pushed_once():
    assert _pushes("scripts/house/house_away.yaml") == []
    assert len(_pushes("packages/house/modes/house_mode_away_notification.yaml")) == 1
