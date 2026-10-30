# LEARNINGS — packages/sunroom/

## Occupancy-off listeners (checked for JK-1219)

`sunroom_mode_off` now also turns `sunroom_occupied` off at house empty, bedtime and restart. Nothing acts on occupancy going off: no lights, media or purifier automation reads it (only `sunroom_not_occupied`, which writes it). `sunroom_mode_auto` has no occupancy-off trigger, so there is no bounce. The room is in `MODE_ONLY_ROOMS` in the regression test.
