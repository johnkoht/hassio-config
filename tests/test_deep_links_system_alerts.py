"""
Deep links for system and radio alerts (notification-deep-links PR G).

A router fault opens the Zigbee routers popup on the Sensors page. The
coordinator and Z-Wave controller faults open the radio health popup there. The
access point and safety-watcher faults open the offline-devices list.
"""
import pytest

from test_notification_deep_links import CALLS, VIEWS, link_problem

ALERTS = "packages/system/alerts/"
EXPECTED = {
    ALERTS + "zigbee_router_unavailable.yaml": "/dashboard-kohbo/sensors#zigbee_routers_popup",
    ALERTS + "zigbee_coordinator_offline.yaml": "/dashboard-kohbo/sensors#radio_health_popup",
    ALERTS + "zwave_controller_offline.yaml": "/dashboard-kohbo/sensors#radio_health_popup",
    ALERTS + "playroom_ap_unavailable.yaml": "/dashboard-kohbo/sensors-offline",
    ALERTS + "safety_device_watcher_down.yaml": "/dashboard-kohbo/sensors-offline",
    ALERTS + "safety_device_offline_alert.yaml": "/dashboard-kohbo/sensors-offline",
}


@pytest.mark.parametrize("rel", sorted(EXPECTED))
def test_push_links_to_its_screen(rel):
    urls = [u for f, _, us in CALLS if f == rel for u in us]
    assert urls == [EXPECTED[rel]]
    assert link_problem(EXPECTED[rel], VIEWS) is None


def test_every_push_in_system_alerts_has_a_link():
    """A new alert in this folder should come with a link or an explicit decision."""
    missing = [f for f, _, us in CALLS if f.startswith(ALERTS) and not us]
    assert missing == []


UPS = "packages/system/ups/"


@pytest.mark.parametrize("name", ["ups_battery_power_activated", "ups_battery_power_restored", "ups_offline"])
def test_ups_push_opens_ups_popup(name):
    url = "/dashboard-kohbo/sensors#ups_power_popup"
    urls = [u for f, _, us in CALLS if f == f"{UPS}{name}.yaml" for u in us]
    assert urls == [url]
    assert link_problem(url, VIEWS) is None
