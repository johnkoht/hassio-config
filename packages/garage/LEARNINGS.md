# LEARNINGS — packages/garage/

## The garage flag flapped because an automation-driven off disabled it (JK-1145)

`garage_lights_turned_off` had no context check, so every automation-driven off (motion off, room Off) turned `garage_lighting_automations` off, and `garage_not_occupied` turned it back on 30 s after occupancy cleared. A 7-day recorder read showed 127 changes, all from those two automations, about 18 a day, none from a user.

The flag is hand-only now. `garage_lights_manual_change` sets the separate latch `garage_lights_manually_toggled` only for a hand change (user id set, or no parent id; see `packages/main_bedroom/LEARNINGS.md`), and `garage_lights_reset_manual_toggle` clears it. Nothing writes the flag.

## JK-1219 needs no change here

`garage_mode_off` runs on house Bedtime but only while `garage_occupied` is already off, so it never forces occupancy off and the Off option is only entered for an empty garage. `garage_mode_auto` triggers on occupancy on, so it can't bounce. A test keeps `garage_mode_off` from writing occupancy.

## Vacancy-off obeys the hand flag

`garage_lights_motion_off` and the vacancy branch of `garage_lights_off` now need the hand flag on (Open decision 6), and `garage_lights_off` checks the house-wide `lighting_automations`, which it never did. Room Off and Away (shared `room_off` trigger id) turn the lights off whatever either room flag says.

## Stale clone entity ids

Live, the old detection automation ran as `automation.main_bedroom_lights_manually_turned_off_2` and the old not-occupied write as `automation.playroom_not_occupied_2` (clone-derived ids). Nothing in the repo references either.
