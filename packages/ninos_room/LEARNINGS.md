# LEARNINGS — packages/ninos_room/

## Occupancy-off listeners (checked for JK-1219)

`ninos_bedroom_mode_off` fires only at house empty, Away or restart while one of those holds, never mid-night, and now also turns `ninos_bedroom_occupied` off when the bed is empty (same rule as `ninos_bedroom_not_occupied`). A kid still in bed keeps the flag: `ninos_bedroom_occupied` would not re-fire on an unchanged bed sensor after return.

Listeners of occupancy going off: bedroom heater off, and purifier off (30 min) are wanted when nobody is home. `nino_nightlight_turn_off` (1 h) and the nap-ended automation need the house occupied. Sleep music, white noise and the nightlight do not read the flag. `ninos_bedroom_lights_off` already fires on Off. Bedtime restore after Away keys on `nino_in_bed`, not on the flag. The area sensors, `kids_sleeping` and the second-floor aggregate only mirror it.

`ninos_bedroom_mode_auto` triggers on occupancy off, so that trigger has id `ninos_bedroom_unoccupied` and a branch needing house occupied and house not Away/Vacation (otherwise Off would bounce to Auto after Away). The room's helpers are `ninos_bedroom_*`; the test table uses that id and `PACKAGE_DIR` maps it to this directory.

## Lamp as an occupancy signal (JK-1163)

`light.nino_bedroom_lamp` off to on (never from unavailable) marks the room occupied, and the lamp is an OR branch of the occupied condition. It is deliberately NOT in the not-occupied conditions: a lamp or nightlight left on overnight must not hold occupancy; lamp off 5 min is only an extra trigger to clear. Bedtime mode keys on `nino_in_bed` and is untouched. The 22:00 nightlight needs the lamp already on, so it cannot create occupancy by itself.

`nino_sleep_music_start` / `_stop` are shared with the Home quick actions pop-up. `nino_sleep_music_on` calls the start script, so change the playlist there only.
