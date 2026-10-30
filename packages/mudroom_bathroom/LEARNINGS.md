# LEARNINGS — packages/mudroom_bathroom/

## Occupancy-off listeners (checked for JK-1219)

`mudroom_bathroom_mode_off` now also turns `mudroom_bathroom_occupied` off at house empty, Away, bedtime and restart. Two automations act on occupancy going off, and both already fire on the room going Off: `mudroom_bathroom_lights_off` turns the lights off and `mudroom_bathroom_fan_off` turns the fan off (after 5 minutes on the occupancy trigger). The `mudroom_bathroom_room` area sensor only mirrors the state. `mudroom_bathroom_mode_auto` has no occupancy trigger, so there is no bounce. The room has lights_off but no hand flag, so the override Off rule does not apply. The room is in `MODE_ONLY_ROOMS` in the regression test.
