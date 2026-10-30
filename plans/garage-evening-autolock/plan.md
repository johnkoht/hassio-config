---
title: Garage Evening Autolock
slug: garage-evening-autolock
status: in-progress
created: 2026-10-29
has_pre_mortem: true
has_review: true
has_prd: true
related: JK-1233
---

# Garage Evening Autolock

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

Linear JK-1233 (Garage door autolock improvements): "I used to have a feature that autolocks the garage door after 15 minutes but I had to turn it off because it would lock us out if we were playing on the driveway or in the yard. I'd like to add a feature/setting that re-introduces the 15 minute auto-lock but only after sundown or after 7pm."

## Problem

The 15-minute auto-lock was useful at night and a nuisance in the daytime, so it was switched off for good. With it off, nothing re-locks the garage entry door between the evening lock time and bedtime if somebody unlocks it. The fix is to bring the rule back for the evening only, behind a dashboard switch, with guards against the lockout case.

## Which "garage door"? Lock, not cover (confirmed)

"Garage door" could mean the three overhead covers (`cover.garage_door_1` to `_3`, group `cover.garage_doors`) or the entry door lock (`lock.garage_entry_door`). The evidence points to the lock:

- **The 15-minute rule is the lock's.** `input_number.garage_entry_door_auto_lock_timeout` (`initial: 15`, 0 to 120 minutes) belongs to `garage_entry_door_lock_if_open_too_long`, whose title is literally "Garage Entry Door - Lock If Open Too Long" and which was added with that 15-minute default (`70061c0`, 2025-10-26). The cover automations have no 15-minute value: `sensor.garage_doors_auto_close_timeout` starts from `input_number.garage_doors_close_when_home_timeout` (a helper with no `initial:`; the sensor falls back to 30) and shrinks when it is cold (5, 10 or 20 minutes), capped at 15 only while `climate.garage` is heating.
- **"Lock us out" is a lock failure.** A cover closing does not lock anybody out; the entry door locking while people are outside does.
- **The covers already have a working rule.** `garage_doors_close_if_open_too_long` and `garage_doors_close_when_home` run today and need nobody to switch them off. They also gate on `binary_sensor.garage_ble_occupancy` and `binary_sensor.garage_motion_sensor_occupancy`, which a driveway game does not trip.

**Resolved (John, 2026-10-30):** yes, it is the garage entry door lock. Variant B (covers) is dropped; the section stays below only as a record of the road not taken.

## Current state (verified 2026-10-29)

Repo, `packages/mudroom/garage_entry_door/`:

- `garage_entry_door_lock_if_open_too_long.yaml`: the old feature. Triggers when `lock.garage_entry_door` has been unlocked for the timeout, or when `binary_sensor.interior_garage_door` has been closed for the timeout (added 2026-05-08 in `a94f3b9`). Conditions: the lock is unlocked and the door closed for the timeout, `input_boolean.entertainment_mode` off, `binary_sensor.somebody_just_arrived` off (added 2026-05-15 in `0aae47c`, "to prevent locking someone out"). It has no time-of-day, no bedtime and no outdoor-activity check, so it fires at any hour.
- `garage_entry_door_auto_lock_in_evening.yaml`: locks once at `input_datetime.garage_entry_door_evening_lock_time` (default 19:30), and again when entertainment or guest mode turns off, or when `somebody_just_arrived` has cleared for 10 minutes. `initial_state: on`, firing normally.
- `garage_entry_door_auto_lock.yaml`: `garage_entry_door_lock_auto_lock` (house unoccupied) and `garage_entry_door_lock_auto_lock_when_home` (bedtime, or after `input_datetime.garage_entry_door_lock_time`, default 22:00). Both on.
- Dashboard: `dashboards/kohbo/security/garage_entry_lock_popup.yaml` has a "Lock If Open Too Long" toggle (`automation.garage_entry_door_lock_if_open_too_long`) and the timeout number, plus the evening lock toggle and time.

**Why it was turned off.** On the live host (`core.restore_state`), `automation.garage_entry_door_lock_if_open_too_long` is `off`, last triggered 2026-05-17, after two fix attempts in May 2026 (`a94f3b9`, `0aae47c`). `1804cc3` (2025-12-18) removed its `initial_state: on`, so it is the only one of the four entry-door automations without it; as the project memory notes, removing `initial_state` does not re-enable an automation that was switched off in the UI, so the repo cannot turn it back on. Matches John's account: a driveway or yard game, nobody counted as "just arrived", door locked behind them. No `LEARNINGS.md` exists for `packages/garage/` or `packages/mudroom/`, and no disabled-file or commented-out variant exists for the 15-minute rule (checked: `git log -S`, `*.DISABLED`, `initial_state: off`; the only `initial_state: off` garage automations are the open-upon-arrival ones from `2206b15`).

**Gap today.** Between the evening lock (19:30) and bedtime/22:00, an unlock stays unlocked. The only things that re-lock are bedtime, the 22:00 lock, the house emptying, or another evening trigger (entertainment/guest mode off, arrival cleared).

## Design

Leave the old daytime automation alone. **Resolved (John, 2026-10-30):** keep it for now; `garage_entry_door_lock_if_open_too_long` stays off with its popup toggle in place, and neither is removed by this plan. Add one new automation with one job: the same 15-minute rule, in the evening only, behind its own switch.

### New helpers (no `initial:`, so UI edits survive restarts)

- `input_boolean.garage_entry_door_evening_auto_lock`: "Garage Entry Door Evening Auto Lock". The dashboard setting. Added to the existing popup next to the other two toggles.
- `timer.garage_entry_door_evening_auto_lock_snooze`: restore-enabled snooze timer, same shape as `timer.snooze_door_left_open_automation` in `packages/security/doors_left_open.yaml`.
- Reuse `input_number.garage_entry_door_auto_lock_timeout` (15) for the minutes, so there is one timeout to tune. It is already on the popup.

### The evening window: recommend sunset

Options: (a) sunset, (b) a fixed 19:00, (c) whichever comes first.

**Recommend (a): `sun.sun` is `below_horizon`.** The failure case is children playing outside, which happens in daylight, and daylight moves by hours across the year. A fixed 19:00 is still bright daylight in midsummer, so the lockout comes back exactly when kids are outside most; sunset tracks the real condition with no helper to maintain. In midwinter sunset is already early evening, which is fine, because it is dark and nobody is out. `state: below_horizon` also covers the whole night to sunrise, avoiding the `condition: sun after: sunset` quirk of resetting at midnight. The fixed-time option adds a second helper and a seasonal gap for no gain; (c) is just (a) plus a cap that only matters in summer, and (c) is where the lockout lives. **Resolved (John, 2026-10-30):** sunset is fine, so there is no 19:00 floor and no second helper. (A floor would have been a one-line `or` with `input_datetime.garage_entry_door_evening_lock_time`.)

### Automation: `garage_entry_door_evening_auto_lock.yaml`

Id `garage_entry_door_evening_auto_lock`, `mode: single`, `initial_state: on`, one file in `packages/mudroom/garage_entry_door/` with the helpers in the same file, following the layout of the existing files.

**Triggers**
- `lock.garage_entry_door` to `unlocked` for `input_number.garage_entry_door_auto_lock_timeout` minutes.
- `binary_sensor.interior_garage_door` to `off` for the same minutes (same two triggers as the old rule).
- `sun` sunset, so a door left unlocked all afternoon is handled at dusk through the same condition ladder.
- No `automation_reloaded` or `homeassistant: start` trigger, so a reload never locks the door.

**Conditions (global, room, feature, environmental)**
1. `input_boolean.garage_entry_door_evening_auto_lock` on (the dashboard setting).
2. `lock.garage_entry_door` unlocked, and `binary_sensor.interior_garage_door` off for the timeout (door closed, not propped).
3. `sun.sun` below_horizon.
4. `input_boolean.entertainment_mode` off and `input_boolean.guest_mode` off (**Resolved (John, 2026-10-30):** skip during guest mode and also during entertainment mode; the evening lock already treats guests as a reason to leave the door alone, so this stays consistent).
5. `binary_sensor.somebody_just_arrived` off (existing guard).
6. Nobody outside or in the garage (**Resolved (John, 2026-10-30):** both the driveway camera and the back yard count as "someone outside"): `binary_sensor.driveway_front_camera_person_detected` and `binary_sensor.garage_driveway_person_detected` off for 5 minutes, the back yard off for 5 minutes (the "Backyard Occupied" bayesian sensor from `somebody_is_outside_bayesian.yaml`, plus the `binary_sensor.backyard_*_person_detected` camera sensors; confirm exact ids at build, task 1), `binary_sensor.garage_motion_sensor_occupancy` off, `binary_sensor.garage_ble_occupancy` off, `cover.garage_doors` closed. These are the same signals `garage_doors_close_if_open_too_long` and the garage flood-light automation already use. The garage covers being open means people are coming and going.
7. `timer.garage_entry_door_evening_auto_lock_snooze` idle.

Bedtime needs no condition: `garage_entry_door_lock_auto_lock_when_home` already locks at bedtime, and locking again is harmless. House occupied is also not needed; `garage_entry_door_lock_auto_lock` handles the empty house.

If a condition blocks the lock, the trigger will not retry by itself (a state trigger with `for:` fires once). Add a re-evaluation trigger on the blockers turning off for 5 minutes (person-detected sensors, garage motion, BLE, cover closed), mirroring how the evening-lock automation re-evaluates after `somebody_just_arrived` clears.

**Actions**
1. Push (below) with a snooze action, wait for the response for a 2-minute grace (**Resolved (John, 2026-10-30):** yes to the 2-minute warning with snooze).
2. If snoozed: start the timer, stop.
3. Otherwise `lock.lock` on `lock.garage_entry_door`.
4. Passive log notification that it locked, with an "Unlock" action wired to `lock.unlock` through `mobile_app_notification_action`.

### Notifications

`script.general_notification` already supports `actions:` and the snooze-and-wait pattern is in `packages/security/doors_left_open.yaml` (`mobile_app_notification_action` plus a timer; camera alerts in `camera_detection_alert.yaml` use "Snooze 15 min"). Reuse it:

- **Before:** `devices: all`, `priority: time-sensitive`, tag `garage-entry-evening-lock`, message "Locking the garage entry door in 2 minutes", actions "Snooze 1 hour" (timer 01:00:00). Recommended over after-only notification because the whole problem is being locked out; the push is the escape hatch.
- **After:** `priority: passive` log line, tag shared with the first so it replaces it, with an "Unlock" action. No TTS: it would announce into rooms while people are likely outside, and the announcement engine adds noise for a routine event.

## Build-time refinements (2026-10-30, from the pre-mortem and review)

Folded in during /ship; they supersede the matching lines above.

- **Task 1 done.** The spike ran read-only on the host: the four `binary_sensor.backyard_{south,pool,northwest,porch}_person_detected` cameras, the two driveway cameras and `binary_sensor.backyard_occupied` all fire for people outside, none is stuck on (see `pre-mortem.md`). `*_person_occupancy` never fires; unused.
- **Extra conditions** (and in the post-wait recheck): `binary_sensor.emergency_active` off, `input_select.notification_level` not `None` (the warning push is the escape hatch), and the lock `unlocked` for the timeout (not only the door closed).
- **Evening floor.** `sun.sun` below_horizon plus `time after 12:00`, so the dark hours before sunrise (morning unlock) never trigger it. No helper.
- **Triggers added:** `timer.finished` for the snooze, and a 10-minute `somebody_just_arrived` off. Sunset trigger has a 1-minute offset.
- **Post-wait recheck.** The 2-minute wait can outlive the conditions, so an action-level `condition: and` checks the live guards again before `lock.lock`.
- **Follow-up pushes.** "Could not lock" is `time-sensitive` (the `Important` level drops `active` and `passive`). The passive "Locked" push, which carries Unlock, only arrives at level `All`.
- **Unlock handler** is its own file, `garage_entry_door_evening_auto_lock_unlock_action.yaml`. It needs `timer.garage_entry_door_evening_auto_lock_unlock_window` active (30 minutes, started only by the evening auto lock after a confirmed lock), lock locked, house occupied, bedtime off, and cancels the window after one tap.
- **Dashboard:** the popup gets the switch with the shared timeout shown when on; the snooze timer is not shown.

## Variant B (only if "garage door" means the covers)

Do not add a second automation. Make `sensor.garage_doors_auto_close_timeout` return the lower of its current value and `input_number.garage_entry_door_auto_lock_timeout` (15) while the evening switch is on and `sun.sun` is below_horizon, so `garage_doors_close_if_open_too_long` picks it up with all its occupancy guards (`binary_sensor.garage_ble_occupancy`, `binary_sensor.garage_motion_sensor_occupancy`, `input_boolean.garage_override`, bedtime). Safety on an obstruction: none of the existing cover automations check for one. They call `cover.close_cover` on `cover.garage_doors` and rely on the openers (ratgdo, `docs/DEVICES.md`) to stop and reverse. That reversal behaviour is not verified from the repo; confirm it before extending any cover rule into the evening, when people are out in the dark.

## Edge cases

- **Door propped open with the lock unlocked:** condition 2 requires the interior door closed for the timeout, so a held-open door never locks.
- **Lock unavailable or `jammed`:** `lock.lock` against an unavailable entity errors. Use `continue_on_error: true` and no retry loop; the failure is already visible on the Device Health score.
- **Snooze while the HA host restarts:** `restore: true` on the timer.
- **Dusk transition:** a door unlocked at 16:00 and unlocked all afternoon locks at sunset only if no guard blocks it; the sunset trigger exists for this.
- **Guest/entertainment mode ends at night:** the evening-lock automation already locks on that edge, so the new automation does nothing extra.
- **Person detection flapping or a stuck-on camera sensor:** a sensor stuck `on` blocks the lock forever (fails open, not locked). Acceptable for this feature; bedtime and 22:00 still lock.
- **Arrival cadence:** `somebody_just_arrived` only knows household members; a guest in the yard is not covered, hence guest mode as a switch.
- **Two automations racing to lock:** harmless, locking an already-locked door is a no-op.

## Tasks

1. Spike, read-only: confirm on the host that `binary_sensor.driveway_front_camera_person_detected`, `binary_sensor.garage_driveway_person_detected` and the back yard sensors (the bayesian sensor's entity id and the `backyard_*_person_detected` cameras) actually turn on for people on the driveway (logbook around a known outdoor time). If not, the lockout guard is cosmetic and the design needs a different signal.
2. Add `garage_entry_door_evening_auto_lock.yaml` with the helpers, header comment and condition ladder above.
3. Dashboard: add the toggle (and, if wanted, the snooze timer) to `dashboards/kohbo/security/garage_entry_lock_popup.yaml`, plus a line in `dashboards/kohbo/security/README.md`. Touch `dashboards/kohbo/kohbo.yaml` on deploy.
4. Tests, `tests/test_garage_entry_evening_autolock.py` in the style of `tests/test_front_door_lock_regressions.py` and `tests/test_door_left_open_realert.py`:
   - conditions include the switch, sun below_horizon, entertainment/guest/just-arrived, the outdoor guards (driveway, garage-driveway and back yard) and the snooze timer;
   - the daytime case (sun above_horizon) blocks;
   - the message renders when the trigger is a state or sun trigger with no `from_state`;
   - helpers carry no `initial:`;
   - the full existing suite (entity references, duplicate basenames, modern syntax, schema) still passes.
5. Docs: add the feature to `docs/AUTOMATIONS.md` (Garage & Security section), mention it in `docs/ROOMS.md` if the mudroom is covered there, and add a `packages/mudroom/LEARNINGS.md` note only if the spike finds something surprising.
6. Deploy per repo rules: push first, then `./deploy.sh --reload --skip-ci`; input_boolean and timer need a reload from Developer Tools, YAML. Never a bare `--check`. Verify by turning the switch on after sunset, unlocking, and watching the push and the lock.

## Open questions for John

All six answered by John on 2026-10-30.

1. **Lock or cover?** **Resolved (John, 2026-10-30):** yes, the garage entry door lock. Variant B is dropped.
2. **Sunset or 7pm?** **Resolved (John, 2026-10-30):** sunset is fine; no 19:00 floor and no offset.
3. **Revive the old automation?** **Resolved (John, 2026-10-30):** keep the old automation for now (off, popup toggle left in place). Revisit removal later, separately.
4. **Warning push with a 2-minute grace and snooze,** or lock silently? **Resolved (John, 2026-10-30):** yes to the 2-minute warning with snooze.
5. **Outdoor guards.** **Resolved (John, 2026-10-30):** both the driveway camera and the back yard count as "someone outside". The back yard is added to condition 6. The bayesian sensor is probabilistic, so it is OR'd with the back yard person cameras, and a stuck-on sensor still fails open (see Risks).
6. **Guest mode.** **Resolved (John, 2026-10-30):** yes, skip during guest mode, and also during entertainment mode (condition 4).

## Risks

- A guard that never clears (stuck camera sensor) means the door stays unlocked until the existing bedtime/22:00 locks. Fail-open is deliberate.
- Lockout is still possible when the family is in a place no sensor covers (side yard, out front); the back yard is now covered. The warning push is the mitigation.
- Overlap with the 19:30 evening lock and the old automation; separate ids and a single helper timeout keep that predictable.
- Privacy: only generic times and entity ids; no schedules tied to people, addresses or locations.
