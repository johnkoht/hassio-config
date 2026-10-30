# LEARNINGS — packages/mudroom/

## Migrated from `automation/` (JK-1145, PR 5)

The eight legacy mode and light automations and the select moved into this package in modern syntax. Ids, aliases and `initial_state` are unchanged and pinned by `tests/test_room_migration_regressions.py`.

## `mudroom_lights_to_on` is live as `automation.mudroom_mode_on_2`

The registry entry for id `mudroom_lights_to_on` was derived from a clone of `mudroom_mode_on`, so its entity id is `automation.mudroom_mode_on_2`. Don't change the id or alias: a new one would create a second entity and orphan the first.

## No Off and no Auto option

`input_select.mudroom` is `On, Motion, Away, Night Motion`. Lights run off the mode (`On`, `Motion`, `Night Motion`) plus the global lighting flag; there is no Off to force them dark and no Auto to follow the house.

`mudroom_lights_to_away` still tests `input_select.mudroom` for state `Auto`, which can never be true, so that branch is dead (only the `Away` branch works). It is a condition, not a `select_option`, and was kept verbatim.
