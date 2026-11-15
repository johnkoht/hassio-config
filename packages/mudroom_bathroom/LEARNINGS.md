# LEARNINGS — packages/mudroom_bathroom/

## Occupancy-off listeners (checked for JK-1219)

`mudroom_bathroom_mode_off` now also turns `mudroom_bathroom_occupied` off at house empty, Away, bedtime and restart. Two automations act on occupancy going off, and both already fire on the room going Off: `mudroom_bathroom_lights_off` turns the lights off and `mudroom_bathroom_fan_off` turns the fan off (after 5 minutes on the occupancy trigger). The `mudroom_bathroom_room` area sensor only mirrors the state. `mudroom_bathroom_mode_auto` has no occupancy trigger, so there is no bounce. The room has lights_off but no hand flag, so the override Off rule does not apply. The room is in `MODE_ONLY_ROOMS` in the regression test.

## Lights-off gating and occupancy (JK-1227, JK-1228)

`mudroom_bathroom_lights_off` now requires `input_boolean.lighting_automations` to be on, including the mode-Off path. `mudroom_bathroom_motion_on` checks `house_occupied` and uses the standard 150 lux. `mudroom_bathroom_not_occupied` has one 5-minute motion-off trigger plus the Aqara occupancy-off trigger; the 5-minute branch accepts any door state except closed, so the unavailable door sensor cannot hold the room occupied. The room is in `group.first_floor_areas` and the `First Floor Occupied` sensor. Aliases are unchanged, so automation entity_ids are unchanged. Follow-up: there is still no fan-on automation.
