# LEARNINGS — packages/main_bedroom/

## Telling a hand change from an automation change

Wall presses and device reports carry no `user_id` and no `parent_id`. Automations have a `parent_id` and no `user_id`. App and dashboard toggles have a `user_id`. Adaptive Lighting context ids contain `:al:`.
`main_bedroom_lights_manual_change` accepts a change when it isn't AL and has a user or no parent, and rejects `unavailable`/`unknown` from-states.

The brightness trigger has a stateless debounce: an on-to-on change under 10 s after an automation change is ignored. A real wall dim in that window is missed too, a known trade-off.

## The main light is a Lutron Caseta dimmer

`light.main_bedroom_main_lights` is a Caseta dimmer, not ZHA and not a group. Brightness only, no colour. Other rooms' lights may be light groups, which carry different contexts; check each room before reusing the condition.

## Lights off: vacancy now needs the hand flag

Room Off turns the lights off whatever either room flag says (the house-wide switch still applies). Vacancy, bed and bedtime turn them off only while `main_bedroom_lighting_automations` is on. Before, vacancy turned them off whatever the room flag said (the flag check was commented out). Now a room with the hand flag off keeps its lights on when vacant.

## Renaming an automation leaves a registry ghost

`main_bedroom_lights_turned_off` became `main_bedroom_lights_manual_change`. The old automation entity stays in the registry as a ghost until removed. Entity ids come from the alias, so keep alias slug and id the same.

## The latch watches only the main light

The latch ignores the lamps in the `light.main_bedroom_lights` group. The live latch may already be on at deploy; it clears at the next unoccupied or Off, so lights won't auto-on until then.

## A wall press in an unoccupied room latches until the next clear

The latch is set by any manual change, even in an empty room or while the room is Off. It stays on until the next unoccupied (30 s), Off or house-empty event, then clears. The manual-change automation is `mode: queued` because a lone state change can also fire the brightness trigger, and `single` would drop whichever run came second.
