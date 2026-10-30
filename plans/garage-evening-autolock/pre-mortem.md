# Pre-Mortem: Garage Evening Autolock

Run 2026-10-30 against `plan.md`. Live facts below come from read-only state reads and a read-only recorder query on the production host (14-day window).

## Spike result (plan task 1)

The guards are real signals, not cosmetic:

| Sensor | On-transitions (14 d) | Longest single run | Notes |
|---|---|---|---|
| `binary_sensor.driveway_front_camera_person_detected` | 104 | 1.4 min | active in the evening |
| `binary_sensor.garage_driveway_person_detected` | 583 | 3.6 min | active 16:00 to 18:00 local |
| `binary_sensor.backyard_south_person_detected` | 77 | 1.1 min | |
| `binary_sensor.backyard_pool_person_detected` | 8 | 0.4 min | |
| `binary_sensor.backyard_northwest_person_detected` | 29 | 0.4 min | |
| `binary_sensor.backyard_porch_person_detected` | 395 | 5.0 min | active through the evening |
| `binary_sensor.backyard_occupied` (bayesian) | 392 | 20.1 min | mostly daylight; rarely on after dark |

- Back yard ids confirmed: four `binary_sensor.backyard_{south,pool,northwest,porch}_person_detected` plus the bayesian `binary_sensor.backyard_occupied`. The plan's "camera_motion" names are not needed.
- No sensor is stuck on (longest run 5 min, bayesian 20 min), so a stuck guard is not happening today.
- `*_person_occupancy` (Frigate-style) never went on in 14 days: do not use them.
- Live now: `lock.garage_entry_door` locked, `binary_sensor.interior_garage_door` off (closed), `cover.garage_doors` closed, `sun.sun` below_horizon, `binary_sensor.emergency_active` exists (off), `input_select.notification_level` Important, timeout helper 15.

## Risks

### Risk 1: The lockout the old rule caused comes back (HIGH)
**Problem**: Somebody is out where no sensor looks (side yard, out front, a neighbour's) when the door locks.
**Mitigation**: Guards on six cameras, the bayesian sensor, garage motion, garage BLE and the garage covers (all must be off for 5 minutes), the lock-must-be-unlocked-for-the-timeout rule, plus the 2-minute time-sensitive warning with a 1-hour snooze and an Unlock action on the follow-up push. Residual risk is accepted by John.
**Verification**: Tests pin every guard entity in the conditions and in the post-wait recheck.

### Risk 2: The warning push is never delivered, so the door locks silently (HIGH)
**Problem**: `script.general_notification` drops the push when `input_select.notification_level` is `None`; `devices: all` goes to `notify.ios_family`. The push is the escape hatch.
**Mitigation**: Add `notification_level != None` to the conditions and the recheck: if the warning cannot go out, do not lock (fail open; bedtime and 22:00 still lock). The warning is `time-sensitive`, which passes `Important`.
**Verification**: Test for the condition in both places.

### Risk 3: Locking during an emergency (HIGH)
**Problem**: A fire or alarm lets nobody in or out confidently; auto-locking in the middle of it is wrong.
**Mitigation**: Add `binary_sensor.emergency_active` off to the conditions and the recheck. The entity exists (PR 1 of the emergency work).
**Verification**: Test; entity-reference test.

### Risk 4: Stale Unlock tap unlocks the house (HIGH)
**Problem**: The "Unlock" action sits in the notification centre; tapped hours later it would unlock the garage entry door at night.
**Mitigation**: The handler is a standalone event automation (the `safety_device_alert_snooze_action` pattern) that only unlocks when the lock is `locked` and changed less than 30 minutes ago.
**Verification**: Test pins both conditions; sabotage removes the age window.

### Risk 5: Condition drift between the trigger-time conditions and the post-wait recheck (MEDIUM)
**Problem**: The conditions render at trigger time; the run then waits 2 minutes, so state can change (door opened, a person appears, a mode switches).
**Mitigation**: Recheck the live guards in an action-level `condition` after the wait. The `for:` guards become plain "off now" checks.
**Verification**: A parity test: every guard entity in the conditions appears in the recheck.

### Risk 6: Trigger and restart behaviour (MEDIUM)
**Problem**: `for:` triggers are dropped on reload and restart; a run in its 2-minute wait is lost; `mode: single` drops triggers during the wait; a sunset trigger can fire a moment before `sun.sun` flips.
**Mitigation**: No start or reload trigger (a reload must never lock the door); a lost run fails open (nothing locks), and bedtime/22:00/house-empty still lock. Sunset trigger with a 1-minute offset so the `below_horizon` condition holds. `max_exceeded: silent`. Retry triggers re-evaluate when a blocker clears.
**Verification**: Tests on trigger set (no start/reload trigger), offset, and mode.

### Risk 7: Guards blind or stuck (MEDIUM)
**Problem**: A UniFi Protect event feed freeze (seen fleet-wide on 2026-09-08) leaves person sensors `off` while people are outside; an `unavailable` sensor makes `condition: state off` false, which blocks the lock forever.
**Mitigation**: Unavailable blocks (fail open) by design. A silent freeze cannot be detected here; the warning push is the remaining mitigation. Documented in LEARNINGS.
**Verification**: Documented; not testable statically.

### Risk 8: Timeout helper is `unavailable` or 0 (LOW)
**Problem**: `states.input_number...state | int` returns 0, so the lock would fire the moment the door is unlocked.
**Mitigation**: Use `states('input_number.garage_entry_door_auto_lock_timeout') | int(15)` in the triggers and conditions (an unreadable value falls back to 15). 0 stays valid for the user who wants it.
**Verification**: Test.

### Risk 9: The lock call fails or the follow-up lies (MEDIUM)
**Problem**: Z-Wave lock unavailable or jammed; a "locked" push after a failed lock would be wrong.
**Mitigation**: `continue_on_error: true`, no retry loop, then wait up to 30 s for `locked`; send the passive "locked" push only if it is, else an active "could not lock" push.
**Verification**: Test that the success push is behind the locked check.

### Risk 10: Deploy order and the new helper (MEDIUM)
**Problem**: `deploy.sh --reload` reloads automations but not the input_boolean or timer. An automation that reloads before the helpers exist errors its conditions. A new input_boolean is created `off`.
**Mitigation**: No `initial:` on the switch (the restore note). Order at deploy: helpers first (Developer Tools, YAML: Input Boolean, Timer), then automations. The switch starting off is the safe state: nothing locks until John turns it on, so no seed is needed unless he wants it on at once.
**Verification**: Report states the order; test that the helpers have no `initial:`.

### Risk 11: Documentation debt (LOW)
`docs/AUTOMATIONS.md` (Garage & Security), `dashboards/kohbo/security/README.md`, `packages/mudroom/LEARNINGS.md`, memory entry and index.

### Risk 12: Reimplementation / drift from the existing rules (LOW)
The old rule `garage_entry_door_lock_if_open_too_long` and the 19:30 `..._auto_lock_in_evening` stay as they are. The 19:30 rule locks with no outdoor guard (pre-existing, not changed here; backlog). Not gating on `input_select.house`: an empty house should still lock, and Quiet behaves like Auto anyway, so there is nothing to special-case.

## Summary

Total risks identified: 12. CRITICAL: none. Three plan refinements adopted (emergency guard, notification-level guard, Unlock-tap age window) plus the post-wait recheck.
