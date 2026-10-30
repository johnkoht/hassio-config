"""
Deep links for the alarm, fire and security-status pushes (notification-deep-links PR A).

The alarm pushes open the alarm panel (disarm is there); fire and the shields-up
status open the security overview. Whether each link opens a real view and popup
is checked repo-wide in test_notification_deep_links.py.
"""
import pytest

from test_notification_deep_links import CALLS, VIEWS, link_problem

EXPECTED = {
    "packages/security/alarm/alarm_triggered.yaml": ["/dashboard-kohbo/security-alarm-panel"] * 2,
    "packages/security/fire_alarm/fire_alarm_triggered.yaml": ["/dashboard-kohbo/security"],
    "packages/security/security_status_notification.yaml": ["/dashboard-kohbo/security"],
}


def urls_in(rel):
    return sorted(u for f, _, urls in CALLS if f == rel for u in urls)


@pytest.mark.parametrize("rel", sorted(EXPECTED))
def test_push_links_to_its_screen(rel):
    assert urls_in(rel) == EXPECTED[rel]
    assert all(link_problem(u, VIEWS) is None for u in EXPECTED[rel])


def test_alarm_panel_view_has_the_disarm_screen():
    assert "security-alarm-panel" in VIEWS
