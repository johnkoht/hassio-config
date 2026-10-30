# LEARNINGS — packages/main_bathroom/

## Manual override latch (JK-1145)

`main_bathroom_lighting_automations` is hand-only. A hand change to `light.main_bathroom_main_lights` (a light group, so the context is forwarded from the member) sets `main_bathroom_lights_manually_toggled` (`main_bathroom_lights_manual_change`); `main_bathroom_lights_reset_manual_toggle` clears it (empty 30 s, room Off, house empty). `main_bathroom_not_occupied` no longer re-enables the flag. The old `main_bathroom_lights_turned_off` (only cleared `lights_auto`) is replaced.

Gated by the latch (on-type): `main_bathroom_lights_motion_on` and the night light `main_bathroom_bedtime_motion_on`. The night light is gated too: the latch clears 30 s after the room empties, so the next visit gets its light, and a hand change during a visit is respected. `main_bathroom_lights_off`: room Off bypasses both flags, vacancy needs the hand flag.

`main_bathroom_lights_auto` is still written (the dashboard shows it).

## Auto bounce

`main_bathroom_mode_auto` triggers on occupancy off and had no `house_occupied` check. Its occupancy-off trigger now has an id and a branch that needs house occupied and house not Away/Vacation; every branch runs the new `main_bathroom_mode_turn_on_auto` script.

## Occupancy-off listeners (checked for JK-1219)

`main_bathroom_mode_off` now also turns `main_bathroom_occupied` off at house empty, Away and restart (not bedtime). Listeners: `main_bathroom_lights_off`, `main_bathroom_turn_off_outlets` (steamer and hair dryer plugs off; wanted when nobody is home), `main_bathroom_lights_reset_manual_toggle`, `main_bathroom_mode_auto` (guarded), `main_bedroom_not_occupied` (needs the bedroom occupied; `main_bedroom_mode_off` already clears that at the same times). The upper-floor sensors and the area cards only read the state.
