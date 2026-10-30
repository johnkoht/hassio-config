# LEARNINGS — packages/jr_suite/

## Occupancy-off listeners (checked for JK-1219)

`jr_suite_mode_off` now also turns `jr_suite_occupied` off at house empty, Away, bedtime and restart. No automation writes this helper (it is set by hand or the dashboard), so Off is the only thing that clears it. Nothing acts on it going off: the `jr_suite_room` and first-floor area sensors only mirror it. The purifier and lights-off automations key on the room mode, not occupancy. `jr_suite_mode_auto` has no occupancy trigger, so there is no bounce. The room is in `MODE_ONLY_ROOMS` in the regression test.
