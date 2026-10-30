"""
Deep links for camera pushes (notification-deep-links PR B).

A detection push opens the popup of the camera that saw it. The hash is derived
from the camera's notifications boolean, so this test expands every boolean the
detection automations pass and checks each result opens a real popup.
"""
import re
from pathlib import Path

import pytest
from jinja2 import Environment, StrictUndefined

from test_notification_deep_links import CALLS, REPO, VIEWS, link_problem, load_plain

ALERT = "packages/security/cameras/detection_notifications/camera_detection_alert.yaml"
DETECTIONS = REPO / "packages/security/cameras/detections"


def camera_link_template():
    return load_plain(REPO / ALERT)["script"]["camera_detection_alert"]["variables"]["camera_link"]


def expand(boolean):
    return Environment(undefined=StrictUndefined).from_string(camera_link_template()).render(
        notifications_boolean=boolean).strip()


def caller_booleans():
    found = set()
    for path in sorted(DETECTIONS.rglob("*.yaml")):
        found |= set(re.findall(r"notifications_boolean:\s*(input_boolean\.\w+)", path.read_text()))
    return sorted(found)


def test_every_camera_boolean_was_found():
    assert len(caller_booleans()) == 7


@pytest.mark.parametrize("boolean", caller_booleans())
def test_each_camera_links_to_its_own_popup(boolean):
    url = expand(boolean)
    camera = boolean.removeprefix("input_boolean.").removesuffix("_notifications")
    assert url == f"/dashboard-kohbo/security-cameras#{camera}"
    assert link_problem(url, VIEWS) is None


def test_all_four_pushes_carry_the_same_link_on_both_keys():
    text = (REPO / ALERT).read_text()
    assert text.count('url: "{{ camera_link }}"') == 4
    assert text.count('clickAction: "{{ camera_link }}"') == 4


def test_camera_toggle_pushes_open_the_cameras_page():
    for name in ("activate", "deactivate"):
        rel = f"packages/security/cameras/camera_notifications/camera_notifications_{name}.yaml"
        urls = [u for f, _, us in CALLS if f == rel for u in us]
        assert urls == ["/dashboard-kohbo/security-cameras"]
