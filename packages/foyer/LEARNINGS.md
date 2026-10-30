# LEARNINGS — packages/foyer/

## Occupancy-off listeners (checked for JK-1219)

`foyer_mode_off` now also turns `foyer_occupied` off at Bedtime (it has no house-empty trigger; `foyer_mode_away` handles that and is unchanged). Nothing acts on occupancy going off: every foyer light automation keys on `input_select.foyer`, the sun, illuminance or `somebody_in_bed`, not on the occupied flag. The `foyer_room` area sensor and the first-floor occupied template only mirror it, and motion sets it again. `foyer_mode_auto` has no occupancy trigger, so there is no bounce.

The foyer has no hand flag of its own: its lights obey the house-wide `lighting_automations`, so it is mode-only here (`MODE_ONLY_ROOMS`). The foyer light automations keep their current behaviour.
