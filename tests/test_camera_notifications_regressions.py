"""
Regression tests for when camera notifications mute (JK-1123).

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
DIR = REPO / "packages/security/cameras/camera_notifications"


def automation(name):
    return yaml.safe_load((DIR / f"{name}.yaml").read_text())["automation"][0]


def test_alerts_do_not_mute_on_a_clock():
    """Only activity outside mutes alerts; sunrise and 'Auto for 30 min' did it every morning."""
    auto = automation("camera_notifications_deactivate")
    kinds = {t["trigger"] for t in auto["triggers"]}
    assert "sun" not in kinds and "time" not in kinds
    assert not any(t.get("entity_id") == "input_select.house" for t in auto["triggers"])
    watched = {e for t in auto["triggers"] for e in
               ([t["entity_id"]] if isinstance(t.get("entity_id"), str) else t.get("entity_id", []))}
    assert {"binary_sensor.exterior_doors", "cover.garage_doors"} <= watched


def test_flip_pushes_are_passive():
    for name in ("camera_notifications_activate", "camera_notifications_deactivate"):
        pushes = [a for a in automation(name)["actions"]
                  if a.get("action") == "script.general_notification"]
        assert pushes and all(p["data"]["priority"] == "passive" for p in pushes)
