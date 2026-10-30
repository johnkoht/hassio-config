# LEARNINGS — packages/laundry/

## Manual override latch (JK-1145)

`laundry_room_lights_motion_on` never checked `laundry_room_lighting_automations`, so the toggle did nothing; it now does (live value was on, so no change at deploy). The flag is hand-only. A hand change to `light.laundry_room_main_lights` sets `laundry_room_lights_manually_toggled` (`laundry_room_lights_manual_change`); `laundry_room_lights_reset_manual_toggle` clears it (empty 30 s, room Off, house empty). `laundry_room_not_occupied` no longer re-enables the flag.

Gated by the latch (on-type): `laundry_room_lights_motion_on`. `laundry_room_lights_off`: room Off bypasses both flags; vacancy needs the hand flag, and the house flag is now a condition (it was only a trigger). The room id is `laundry_room`; the package directory is `laundry`.

`laundry_room_lights_auto` is written by motion_on and lights_off but read nowhere, so manual_change does not touch it.

Left alone: `laundry_room_occupied` triggers on `switch.laundry_room_main_lights`, which may not exist (the lights are `light.`); not part of this change.

## Occupancy-off listeners (checked for JK-1219)

`laundry_room_mode_off` now also turns `laundry_room_occupied` off at house empty, Away, bedtime and restart. Listeners of occupancy going off: `laundry_room_lights_off` (lights already go off on the Off mode at those times), `laundry_room_lights_reset_manual_toggle`. The first-floor area sensors only read the state; washer/dryer automations do not use it.
