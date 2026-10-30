"""
Regression tests for leak alerts and the evening vacuum cadence.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel_path):
    return yaml.load((REPO / rel_path).read_text(), Loader=_Loader)


LEAK = load("packages/leak_monitoring.yaml")


def leak_binary_sensor_ids():
    ids = set()
    for block in LEAK["template"]:
        for sensor in block.get("binary_sensor", []):
            ids.add(sensor["default_entity_id"])
    return ids


@pytest.mark.parametrize("name", sorted(LEAK["alert"]))
def test_leak_alerts_watch_sensors_defined_here(name):
    """An alert on a nonexistent entity never fires (it watched flood_while_away for years)."""
    assert LEAK["alert"][name]["entity_id"] in leak_binary_sensor_ids()


def test_leak_member_lists_match():
    group = LEAK["group"]["leak_sensors"]["entities"]
    (binary,) = [b for b in LEAK["binary_sensor"] if b.get("platform") == "group"]
    assert sorted(group) == sorted(binary["entities"])


def test_unknown_occupancy_still_alerts():
    """Exactly one of away/home must cover any house_occupied state, including unavailable."""
    states = {s["default_entity_id"]: s["state"] for b in LEAK["template"] for s in b.get("binary_sensor", [])}
    assert "is_state('input_boolean.house_occupied','off')" in states["binary_sensor.leak_while_away"]
    assert "not is_state('input_boolean.house_occupied','off')" in states["binary_sensor.leak_while_home"]


def test_evening_vacuum_reads_its_own_last_run():
    """It read last_triggered from a renamed automation, so it ran every night."""
    auto = load("packages/vacuums/main_level/main_level_vacuum_evening_cleaning.yaml")["automation"][0]
    text = yaml.dump(auto["conditions"])
    assert "this.attributes.last_triggered" in text
    assert "state_attr('automation." not in text


LEAK_LINK = "/dashboard-kohbo/security-leak-sensors"


@pytest.mark.parametrize("name", sorted(LEAK["alert"]))
def test_leak_pushes_open_the_leak_sensors_page(name):
    """Both alerts carry the link on the iOS and Android keys, and it opens a real view."""
    from test_notification_deep_links import VIEWS, link_problem
    data = LEAK["alert"][name]["data"]
    assert data == {"url": LEAK_LINK, "clickAction": LEAK_LINK}
    assert link_problem(LEAK_LINK, VIEWS) is None


def test_leak_alerts_still_notify_phones_and_the_voice_path():
    """The link rides on data:; the notifier lists (a safety path) must not change."""
    assert LEAK["alert"]["water_leak_alert_home"]["notifiers"] == ["ios_family", "leak_voice_announcement"]
    assert LEAK["alert"]["water_leak_alert_away"]["notifiers"] == ["ios_family"]
