# PRD: Offline Safety Device Alerts

**Goal:** Push John when a leak sensor or safety device is offline or low on battery, with snooze, a morning repeat and a Home card.

Source: [plan.md](plan.md). Pre-mortem: [pre-mortem.md](pre-mortem.md). Review: [review.md](review.md). Branch `feature/offline-safety-alerts`.

## task-1-attention-sensor: Safety devices attention sensor and binary sensor

**File:** packages/system/sensor_health/safety_devices_attention.yaml

- Trigger-based template (every 5 minutes, at start, on reload); no live template
- Scope is group.leak_sensors plus group.key_sensors_safety
- A device offline (unavailable or unknown) is listed only after 60 minutes; a device changed 59 minutes ago is not
- known_issue devices are still counted, listed in the *_known attributes and tagged '(known issue)' in the names
- Battery under 30 is listed for binary_sensor members only; locks and covers never report low battery
- State is the unique device count; a non-mapping rollup gives unavailable
- binary_sensor.safety_devices_need_attention is on when the count is above 0

## task-2-alert-automations: Alert, snooze timer, snooze action and watcher automations

**File:** packages/system/alerts/safety_device_*.yaml

- One push through script.general_notification, devices jk, time-sensitive, tag safety-device-offline, actions SAFETY_ALERT_SNOOZE_DAY and SAFETY_ALERT_SNOOZE_WEEK
- State-change and snooze-end triggers do nothing outside 07:00-21:00 or while quiet_mode is on; 09:00 always runs
- A state change sends only when a device id is newly listed
- A running timer.safety_device_alert_snooze blocks every path
- Unlabelled devices repeat daily at 09:00; a known-issue-only list repeats Mondays only
- The message is built from sensor attributes and renders for the state, 09:00 and timer.finished triggers
- Timer has restore: true; the day action starts it for 1 day and the week action for 7 days
- The watcher pushes when the attention sensor is unavailable, missing or stale for 20 minutes

## task-3-dashboard-card: Home page safety device card

**File:** dashboards/kohbo/home/_safety_device_notification.yaml, home.yaml

- Conditional card on binary_sensor.safety_devices_need_attention using condition: state
- Included on Home under the page header, linking to the Sensors Offline tab

## task-4-tests: Regression tests with sabotage checks

**File:** tests/test_safety_device_alerts.py

- Tests cover debounce, grace, known_issue, battery guard, unique count, night gate, new-id diff, cadence, snooze, message rendering, watcher, structural scope and dashboard card
- Each behaviour is sabotage-checked (red when reverted)
- Full suite passes

## task-5-docs: Docs

**File:** packages/system/sensor_health/README.md, dashboards READMEs and SITEMAP, docs/AUTOMATIONS.md, LEARNINGS

- Safety alerts section in the sensor_health README including the known limits
- dashboards/kohbo/home/README.md and dashboards/SITEMAP.md list the card
- docs/AUTOMATIONS.md mentions the alert
- Memory entry and index line

## Out of scope

Panic button (JK-1230), room-level dashboard alerts (JK-1094 remainder), persisted offline baseline across restarts.
