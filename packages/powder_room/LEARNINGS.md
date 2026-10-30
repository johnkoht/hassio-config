# LEARNINGS — packages/powder_room/

## Occupancy-off listeners (checked for JK-1219)

`powder_room_mode_off` now also turns `powder_room_occupied` off at house empty, Away, bedtime and restart. Two automations act on occupancy going off, and both already fire on the room going Off: `powder_room_lights_off` turns the lights off and `powder_room_fan_off` turns the fan off (after 5 minutes on the occupancy trigger). The `powder_room_room` area sensor only mirrors the state. `powder_room_mode_auto` has no occupancy trigger, so there is no bounce. The room has lights_off but no hand flag, so the override Off rule does not apply. The room is in `MODE_ONLY_ROOMS` in the regression test.
