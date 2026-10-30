# PRD: Notification deep links

## Goal

Every push a person would act on opens the most useful dashboard view or popup. A repo test fails on a link that opens nothing and, once enforcing, on a push with no link that is not on the exempt list. Source: plan.md (deep links only; the push-pruning section is an unapproved proposal and is out of scope).

Delivery: one PR per task, safety first. PR 1 is task-1. Task-5 (PR D) is blocked on decision 6.

## task-1: Transport fix and test scaffold (PR 1)

script.general_notification sends url and clickAction from one value and omits both when empty; tests/test_notification_deep_links.py builds the dashboard map from kohbo.yaml and checks declared links; missing links report-only.

Acceptance criteria:
- With a url, the rendered push data holds url and clickAction with the same value
- With url '' or absent, neither key is in the rendered data
- tag, image, entity_id, push.interruption-level and actions render identically with and without a url (actions absent renders '')
- The dashboard map is built by following !include from kohbo.yaml; known pairs (security-cameras#front_door_camera, climate#weather, sensors#zigbee_routers_popup) resolve and security#front_door_camera does not
- Every declared dashboard link in packages/, automation/, scripts/, automations.yaml resolves to a view and popup in the map; a broken link fails the test
- Pushes with no link produce one warning with the count and do not fail
- No call site file is changed; full suite green; every new test has a sabotage run that goes red

## task-2: Protection PR A: alarm and fire

Alarm triggered and disabled to security-alarm-panel; fire to security (url in the script.turn_on variables); shields-up status to security.

Acceptance criteria:
- Each named push carries the stated link and the declared-link test passes
- Critical priority and recipients of these pushes are unchanged
- Alarm and fire regression suites stay green

## task-3: Protection PR B: cameras

Derive the per-camera popup hash in camera_detection_alert.yaml (3 branches) from notifications_boolean; add camera on/off links.

Acceptance criteria:
- The test expands every camera's derived link and each resolves to security-cameras#<camera>
- Camera on and off pushes link to security-cameras

## task-4: Protection PR C: leak

Add data: with a link to both leak alerts; extend test_leak_monitoring_regressions.py.

Acceptance criteria:
- Both alerts carry url and clickAction pointing at security-leak-sensors
- Leak regression tests assert the link

## task-5: Protection PR D: doors, garage, locks, kids escape (BLOCKED on decision 6)

Link the unlinked door and garage pushes, upgrade lock alerts (including the garage evening autolock pushes) to the popup hash, link fingerprint, kids escape.

Acceptance criteria:
- Blocked until John confirms which sensors the kids-escape alerts use
- Each linked push resolves in the test

## task-6: Phase 2 PR E: climate and weather

HVAC thermostat popups for eco/resume; climate#weather for NWS, UV and rain.

Acceptance criteria:
- Each push carries its stated link and resolves

## task-7: Phase 2 PR F: house and everyday

Laundry (including both direct washer callers), school, energy, vacation and away, holidays.

Acceptance criteria:
- Each push carries its stated link and resolves
- Washer recipient logic unchanged

## task-8: Phase 2 PR G: system alerts

Zigbee router popup, radio/AP/watcher-down to sensors-offline.

Acceptance criteria:
- Each push carries its stated link and resolves

## task-9: Enforce the test and exempt list

Flip missing-link to a failure; add tests/fixtures/notification_url_exempt.yaml (path plus reason); stale-reason check; docs.

Acceptance criteria:
- An unlinked call not on the exempt list fails
- An exempt call that gains a url fails with a remove-from-list message

## task-10: Needs-popup extras (dashboard-only)

Fire/smoke, UPS/power and radio health popups, each followed by a one-line PR swapping its interim link.

Acceptance criteria:
- Each popup hash is in the view its link names and the test passes

