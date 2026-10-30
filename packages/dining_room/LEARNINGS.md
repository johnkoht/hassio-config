# LEARNINGS — packages/dining_room/

## Override kit not applied (JK-1145)

The dining room has no lights-on automation, so it has no hand flag and no latch. `dining_room_lighting_automations` (a flag nothing read, only `dining_room_not_occupied` re-enabled it) and the unused `dining_room_lights_auto` are removed. `dining_room_lights_off` follows the room mode only (Off, or the house flag coming on while Off). Lights come on by hand or with the living room group.

## Occupancy-off listeners (checked for JK-1219)

`dining_room_mode_off` now also turns `dining_room_occupied` off at house empty, Away, bedtime and restart. Nothing acts on occupancy going off: the first-floor area sensors, announcement routing, doorbell and hourly dong only read the state. `dining_room_mode_auto` triggers on occupancy on, so there is no bounce. The room is in `MODE_ONLY_ROOMS` in the regression test.
