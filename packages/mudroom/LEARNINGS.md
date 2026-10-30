# LEARNINGS — packages/mudroom/

## Migrated from `automation/` (JK-1145, PR 5)

The eight legacy mode and light automations and the select moved into this package in modern syntax. Ids, aliases and `initial_state` are unchanged and pinned by `tests/test_room_migration_regressions.py`.

## `mudroom_lights_to_on` is live as `automation.mudroom_mode_on_2`

The registry entry for id `mudroom_lights_to_on` was derived from a clone of `mudroom_mode_on`, so its entity id is `automation.mudroom_mode_on_2`. Don't change the id or alias: a new one would create a second entity and orphan the first.

## No Off and no Auto option

`input_select.mudroom` is `On, Motion, Away, Night Motion`. Lights run off the mode (`On`, `Motion`, `Night Motion`) plus the global lighting flag; there is no Off to force them dark and no Auto to follow the house.

`mudroom_lights_to_away` still tests `input_select.mudroom` for state `Auto`, which can never be true, so that branch is dead (only the `Away` branch works). It is a condition, not a `select_option`, and was kept verbatim.

## Override kit (JK-1145, PR 6)

The full kit, with **Away standing in for Off**: `mudroom_lights_reset_manual_toggle` triggers on the select going to `Away`, and `mudroom_lights_to_off` carries trigger id `room_off` on that trigger. There is no `lights_auto` helper, so `mudroom_lights_manual_change` only sets the latch. `mudroom_lights_to_away` is the "Away turns lights off regardless of either flag" path and never mentions them.

`input_boolean.mudroom_lighting_automations` has no `initial:`, so HA creates it **off** on first load. Turn it on once at deploy, or the on-type automations stay gated. Nothing writes it.

**JK-1219 listener audit** (`mudroom_occupied` going off): only `mudroom_lights_to_off` (vacancy branch) reads it; `first_floor_*` sensors and groups just aggregate it; the garage entry door package, announcements and vacuums don't reference it. So `mudroom_mode_away` also turns it off. No mode automation triggers on it going off, so nothing bounces (test pins that).

Backlog: `mudroom_mode_motion` triggers on house `Auto` only, not `Quiet`. Out of scope here.

## Arrival scenes bypass the gates

`scenes/house/returned_home*.yaml` turn `light.mudroom_main_lights` on without the flag or latch. A scene is an arrival action, and `mudroom_lights_manual_change` ignores it (the call has a parent id), so it never latches. Same as the other migrated rooms.

## Garage entry door evening auto lock (JK-1233)

- **Guards are real signals (spike, 2026-10-30).** Over 14 days the driveway and garage-driveway cameras, the four `backyard_{south,pool,northwest,porch}_person_detected` cameras and the bayesian `binary_sensor.backyard_occupied` all turned on in the evening, none stuck (longest run 5 minutes, bayesian 20). The `*_person_occupancy` sensors never fired; don't use them.
- **Fail open on purpose.** `unavailable` fails a `state: off` guard, so a dead sensor keeps the door unlocked until the bedtime or 22:00 lock. A silent UniFi Protect feed freeze would blind the guards and nothing here detects it; the warning push is the remaining net.
- **`general_notification` drops `active` and `passive` at level Important** (the usual night level). Only `time-sensitive` and `critical` get through, so the failure push is time-sensitive and the passive "Locked" push (with its Unlock tap) only arrives at level All. The automation also refuses to lock at level None, because the warning could not go out.
- **The Unlock tap belongs to one lock.** `..._unlock_window` (30 minutes) is started only after this automation's confirmed lock, so a stale push can't unlock after a bedtime or manual lock; one tap cancels it.
- **The 2-minute wait outlives the conditions**, so the actions re-check the live guards before `lock.lock`. A test keeps the two lists identical.
- **`time after 12:00` stops the dark morning**: `sun.sun` below_horizon alone also covers the hours before sunrise, when the morning unlock would be re-locked.
- Not changed: the 19:30 `..._auto_lock_in_evening` still locks with no outdoor guard (backlog); the old 15-minute rule stays off with its popup toggle.
- The switch and both timers have no `initial:`. HA creates the switch off, so nothing locks until John turns it on.

