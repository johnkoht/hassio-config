# LEARNINGS — packages/family_room/

## Migrated from `automation/` (JK-1145, PR 5)

The ten legacy automations and the select and occupancy boolean moved into this package in modern syntax. Ids, aliases and `initial_state` are unchanged and pinned by `tests/test_room_migration_regressions.py`.

## The select has three options: Auto, Away, Off

Live `input_select.family_room` is `Auto, Away, Off`. `On` and `Dim` were commented out long ago, but four automations still pointed at them. They are all `initial_state: off` and disabled live (last run 2022):

- `family_room_mode_on` and `family_room_arrival`: `select_option` was `On` / `Dim`, which HA rejects. Repointed to `Auto`.
- `family_room_lights_to_on`: triggers on `On`, so its room branch never fires; its `switch.turn_on` on a light entity became `light.turn_on`.
- `family_room_mode_away`: valid option, just disabled.

They stay disabled; reviving them is John's call. Adding an option means an input_select reload, which can reset the value, so PR 5 left the list alone. `tests/test_room_select_options.py` fails on any new `select_option` to an option that isn't defined.

## No enabled lights-on automation

With `family_room_lights_to_on` disabled, nothing turns the family room lights on automatically. It is a mode-only room for the override work, not a kit room, unless that automation is revived.

## `family_room_mode_off` clears occupancy (JK-1219, PR 6)

Audit of `family_room_occupied` going off at the Off triggers (house empty, Away, bedtime on, HA start, automation reload): music pause, TV off and lights off already fire on the select going Off, so nothing new there; speech notifications off and the announcement room lists (`announceable_rooms`, voice/critical/doorbell/hourly speech) just stop targeting the room, which is wanted at those times. The start/reload triggers are gated by the same conditions, so forcing it off there only happens when the room is already going Off. `family_room_mode_auto` triggers on occupancy ON only, so nothing bounces (test pins it). Mode-only room: no hand flag, no latch.
