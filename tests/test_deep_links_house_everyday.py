"""
Deep links for laundry, school, energy, vacation, away and holiday pushes
(notification-deep-links PR F).

Both washer pushes are direct notifier calls that pick their recipient with a
template; the link goes in their data and the recipient logic stays as it was.
"""
import pytest

from test_notification_deep_links import CALLS, REPO, VIEWS, link_problem, load_plain

LAUNDRY = "/dashboard-kohbo/rooms-laundry"
MODE = "/dashboard-kohbo/home#house_mode"
SCHOOL = "/dashboard-kohbo/school"

EXPECTED = {
    "packages/laundry/main_level_dryer/main_level_dryer_complete.yaml": LAUNDRY,
    "packages/upstairs_laundry/upstairs_laundry_dryer/upstairs_dryer_complete.yaml": LAUNDRY,
    "packages/laundry/main_level_washer/main_level_washer_complete_alert.yaml": LAUNDRY,
    "automation/laundry_upstairs/upstairs_washer/upstairs_washer_complete_alert.yaml": LAUNDRY,
    "packages/energy/sensors/energy_prices_are_negative.yaml": "/dashboard-kohbo/energy",
    "packages/school/kids/nino_dropoff_check.yaml": SCHOOL,
    "packages/school/reminders/gianluca_departure_reminder.yaml": SCHOOL,
    "packages/school/reminders/gianluca_pickup_reminder.yaml": SCHOOL,
    "packages/school/reminders/nino_departure_reminder.yaml": SCHOOL,
    "packages/school/reminders/nino_pickup_reminder.yaml": SCHOOL,
    "packages/house/vacation_mode/vacation_mode_turn_on.yaml": MODE,
    "packages/house/vacation_mode/vacation_mode_turn_off.yaml": MODE,
    "packages/house/modes/house_mode_away_notification.yaml": "/dashboard-kohbo/security-alarm-panel",
}


def urls_in(rel):
    return [u for f, _, urls in CALLS if f == rel for u in urls]


@pytest.mark.parametrize("rel", sorted(EXPECTED))
def test_push_links_to_its_screen(rel):
    assert set(urls_in(rel)) == {EXPECTED[rel]}
    assert link_problem(EXPECTED[rel], VIEWS) is None


@pytest.mark.parametrize("rel", [
    "packages/laundry/main_level_washer/main_level_washer_complete_alert.yaml",
    "automation/laundry_upstairs/upstairs_washer/upstairs_washer_complete_alert.yaml",
])
def test_direct_notifier_pushes_send_both_keys(rel):
    """Direct callers build data: by hand, so they need url (iOS) and clickAction (Android)."""
    text = (REPO / rel).read_text()
    assert f"url: {EXPECTED[rel]}" in text and f"clickAction: {EXPECTED[rel]}" in text


def test_washer_pushes_still_pick_the_recipient_from_who_is_home():
    for rel, step_key in (("packages/laundry/main_level_washer/main_level_washer_complete_alert.yaml", "action"),
                          ("automation/laundry_upstairs/upstairs_washer/upstairs_washer_complete_alert.yaml", "service_template")):
        data = load_plain(REPO / rel)
        steps = data["automation"][0]["actions"] if "automation" in data else data["action"]
        (step,) = [s for s in steps if "notify.ios_family" in str(s.get(step_key, ""))]
        for target in ("notify.ios_family", "notify.mobile_app_jk_2", "notify.mobile_app_cfalb"):
            assert target in step[step_key]
