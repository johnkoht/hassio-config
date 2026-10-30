# LEARNINGS — packages/ninos_room/

## Occupancy-off listeners (checked for JK-1219)

`ninos_bedroom_mode_off` fires only at house empty, Away or restart while one of those holds, never mid-night, and now also turns `ninos_bedroom_occupied` off when the bed is empty (same rule as `ninos_bedroom_not_occupied`). A kid still in bed keeps the flag: `ninos_bedroom_occupied` would not re-fire on an unchanged bed sensor after return.

Listeners of occupancy going off: bedroom and bathroom heater off, purifier off (30 min) and the escape monitor off are wanted when nobody is home. `nino_nightlight_turn_off` (1 h) and the nap-ended automation need the house occupied. Sleep music, white noise and the nightlight do not read the flag. `ninos_bedroom_lights_off` already fires on Off. Bedtime restore after Away keys on `nino_in_bed`, not on the flag. The area sensors, `kids_sleeping` and the second-floor aggregate only mirror it.

`ninos_bedroom_mode_auto` triggers on occupancy off, so that trigger has id `ninos_bedroom_unoccupied` and a branch needing house occupied and house not Away/Vacation (otherwise Off would bounce to Auto after Away). The room's helpers are `ninos_bedroom_*`; the test table uses that id and `PACKAGE_DIR` maps it to this directory.
