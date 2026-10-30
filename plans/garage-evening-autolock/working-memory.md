# Working Memory — garage-evening-autolock

## Discovered Patterns
- [Task 2] Standalone event handler for late taps: `packages/system/alerts/safety_device_alert_snooze_action.yaml`.
- [Task 5] Condition interpreter over real YAML in `tests/test_garage_entry_evening_autolock.py`.

## Active Gotchas
- [Task 2] `general_notification` drops `active`/`passive` at level Important.
- [Task 2] The 2-minute wait outlives trigger-time conditions: recheck in actions.

## Shared Utilities Created
NOTHING_NOVEL

## Context Corrections
- [Task 1] Plan's `backyard_*_camera_motion` ids are not the guards; use `backyard_*_person_detected` plus `binary_sensor.backyard_occupied`.

## Decision Ledger
- [2026-10-30] Noon floor, emergency and notification-level guards, own unlock-window timer — docs affected: plan.md — status: folded
