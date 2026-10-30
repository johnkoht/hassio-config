# LEARNINGS — packages/mudroom/

## Migrated from `automation/` (JK-1145, PR 5)

The eight legacy mode and light automations and the select moved into this package in modern syntax. Ids, aliases and `initial_state` are unchanged and pinned by `tests/test_room_migration_regressions.py`.

## `mudroom_lights_to_on` is live as `automation.mudroom_mode_on_2`

The registry entry for id `mudroom_lights_to_on` was derived from a clone of `mudroom_mode_on`, so its entity id is `automation.mudroom_mode_on_2`. Don't change the id or alias: a new one would create a second entity and orphan the first.

## No Off and no Auto option

`input_select.mudroom` is `On, Motion, Away, Night Motion`. Lights run off the mode (`On`, `Motion`, `Night Motion`) plus the global lighting flag; there is no Off to force them dark and no Auto to follow the house.

`mudroom_lights_to_away` still tests `input_select.mudroom` for state `Auto`, which can never be true, so that branch is dead (only the `Away` branch works). It is a condition, not a `select_option`, and was kept verbatim.

## Override kit (JK-1145, PR 6)

The full kit, with **Away standing in for Off**: `mudroom_lights_reset_manual_toggle` triggers on the select going to `Away`, and `mudroom_lights_to_off` carries trigger id `room_off` on that trigger. There is no `lights_auto` helper, so `mudroom_lights_manual_change` only sets the latch. `mudroom_lights_to_away` is the "Away turns lights off regardless of either flag" path and never mentions them.

`input_boolean.mudroom_lighting_automations` has no `initial:`, so HA creates it **off** on first load. Turn it on once at deploy, or the on-type automations stay gated. Nothing writes it.

**JK-1219 listener audit** (`mudroom_occupied` going off): only `mudroom_lights_to_off` (vacancy branch) reads it; `first_floor_*` sensors and groups just aggregate it; the garage entry door package, announcements and vacuums don't reference it. So `mudroom_mode_away` also turns it off. No mode automation triggers on it going off, so nothing bounces (test pins that).

Backlog: `mudroom_mode_motion` triggers on house `Auto` only, not `Quiet`. Out of scope here.
