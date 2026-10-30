# PRD: Garage Evening Autolock

**Goal**: After sunset, re-lock the garage entry door once unlocked past the timeout, behind a dashboard switch, with a 2-minute warning, snooze, and guards against locking people out (JK-1233).

Plan: plan.md. Pre-mortem: pre-mortem.md. Review: review.md.

## task-1: Spike: confirm the outdoor guards are real signals

Read-only recorder and state reads on the host for the driveway, back yard and garage sensors.

Acceptance criteria:
- Back yard entity ids are confirmed from live state and listed in pre-mortem.md
- Each guard sensor has on-transitions in the last 14 days and no run longer than 20 minutes

## task-2: Evening auto lock automation and helpers

packages/mudroom/garage_entry_door/garage_entry_door_evening_auto_lock.yaml with the switch, snooze timer and unlock-window timer.

Acceptance criteria:
- Helpers have no initial:
- Conditions: switch, guest/entertainment, emergency, notification level, sun below_horizon, time after 12:00, lock and door for the timeout, just arrived, snooze idle, all outdoor guards for 5 minutes, cover closed
- Warn (time-sensitive, snooze), wait 2 minutes, snooze stops, recheck, lock with continue_on_error, locked-or-failed push
- No start or reload trigger; sunset offset 1 minute

## task-3: Unlock action handler

Standalone event automation for the Unlock tap on the Locked push.

Acceptance criteria:
- Needs unlock-window timer active, lock locked, house occupied, bedtime off
- Cancels the window after one unlock

## task-4: Dashboard switch and README

Add the switch and shared timeout to the garage entry lock popup; README line.

Acceptance criteria:
- Popup has input_boolean.garage_entry_door_evening_auto_lock and the timeout row when on
- dashboards/kohbo/security/README.md mentions it

## task-5: Regression tests with sabotage checks

tests/test_garage_entry_evening_autolock.py

Acceptance criteria:
- Each gate, guard, daytime and morning case blocks
- Trigger set, recheck parity, push priorities, unlock handler pinned
- Full suite passes; sabotage checks go red

## task-6: Docs, LEARNINGS and memory

docs/AUTOMATIONS.md, packages/mudroom/LEARNINGS.md, memory entry and index.

Acceptance criteria:
- Each is updated in this branch

