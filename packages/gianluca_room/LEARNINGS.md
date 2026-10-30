# LEARNINGS — packages/gianluca_room/

## Occupancy-off listeners (checked for JK-1219)

`gianlucas_bedroom_mode_off` fires only at house empty, Away or restart while one of those holds, never mid-night, and now also turns `gianlucas_room_occupied` off when the bed is empty (same rule as `gianlucas_room_not_occupied`). A kid still in bed keeps the flag: it would not re-fire on an unchanged bed sensor after return.

Listeners of occupancy going off: the heater off and the purifier off (30 min) are wanted when nobody is home. The nap-ended automation needs the house occupied (and is disabled). `gianluca_bedroom_lights_off` already fires on Off. Bedtime restore after Away keys on `gianluca_in_bed`, not on the flag. The area sensors, `kids_sleeping` and the second-floor aggregate only mirror it.

`gianlucas_bedroom_mode_auto` triggers on occupancy off, so that trigger has id `gianlucas_room_unoccupied` and a branch needing house occupied and house not Away/Vacation (otherwise Off would bounce to Auto after Away). The mode automations are named `gianlucas_bedroom_*` but the helpers `gianlucas_room_*`; the test table uses the room key `gianlucas_room` with `MODE_ID` for the automation ids.
