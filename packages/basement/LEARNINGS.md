# LEARNINGS — packages/basement/

## Occupancy-off listeners (checked for JK-1219)

`basement_mode_off` now also turns `basement_occupied` off at house empty, Away, bedtime and restart. Nothing acts on occupancy going off: the `basement_main` area sensor only mirrors the state, and the room has no lights, media or purifier automations. `basement_mode_auto` has no occupancy trigger, so there is no bounce. The room is in `MODE_ONLY_ROOMS` in the regression test.
