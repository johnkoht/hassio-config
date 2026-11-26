---
title: Entertainment Mode Lights
slug: entertainment-mode-lights
status: in-progress
created: 2026-11-26
has_pre_mortem: false
has_review: false
has_prd: true
---

# Entertainment Mode Lights

## Problem

Entertainment mode (JK-1166, #215) pauses Adaptive Lighting and speech in each room, but it turns no lights on. John wants the main floor lit when the mode turns on. Nothing holds the lights on either: each room's vacancy and daylight automations turn its lights off as usual, so a party room that reads empty for a few minutes goes dark.

## Goal

When entertainment mode turns on, the foyer, kitchen, family room and dining/living lights turn on, whatever the daylight. They stay on while the mode is on. When it turns off, each room's normal logic takes over again and turns off what it would have.

## Approach

Each room owns its reaction, as #215 set up. The lights go in each room's existing `<room>_entertainment_mode_on.yaml`, after the Adaptive Lighting pause, so AL can't re-adapt them on the way up. The dining room has no entertainment file yet, so it gets one.

| Room | Lights | File |
|---|---|---|
| Foyer | `light.foyer_lights` (ceiling, chandelier, coat closet, stairs light, stairs sconces) | `packages/foyer/modes/foyer_entertainment_mode_on.yaml` |
| Kitchen | `light.kitchen_lights` (main, table, island pendants) and `light.kitchen_led` | `packages/kitchen/modes/kitchen_entertainment_mode_on.yaml` |
| Family room | `light.family_room_main_lights` | `packages/family_room/modes/family_room_entertainment_mode_on.yaml` |
| Dining/living | `light.dining_room_lights` (dining ceiling, living room main) | new `packages/dining_room/modes/dining_room_entertainment_mode_on.yaml` |

The lights come on at 100%, with no lux check (John: "always"). The existing condition stays: the house must be occupied.

**Hold while the mode is on.** These off automations get an `entertainment_mode` is off condition:
- `foyer_lights_to_off` (the `Off` path only; `Away` still turns the lights off);
- `foyer_lights_day_off` and `foyer_lights_nightlight_off`;
- `kitchen_lights_to_off` and `kitchen_lights_day_off`;
- `family_room_lights_to_off`;
- `dining_room_lights_off`.

The `*_to_away` automations are untouched. An empty house already ends the mode (`entertainment_mode_house_empty_off`).

**Hand back on mode off.** The same off automations get one more trigger: `input_boolean.entertainment_mode` to `off`. Their existing conditions then decide, so a room that went vacant during the party turns its lights off, and an occupied one stays lit. This is the pattern `kitchen_lights_to_off` already uses with its `house_flag_on` trigger. Without it, a room that emptied mid-party would keep its lights on until the next vacancy. Nothing turns the lights off directly.

The chandelier isn't on a Lutron switch yet, so it isn't included. When it gets one, it goes in the dining room file.

## Tasks

1. Room on-files: add the light `turn_on` after the AL pause in the foyer, kitchen and family room files, and create the dining room file in the same shape (header, `initial_state: on`, house-occupied condition).
2. Hold and hand back: add the `entertainment_mode` off condition and the mode-off trigger to the seven off automations above. Leave the `Away` paths alone.
3. Tests in `tests/test_entertainment_mode.py`:
   - each room on-file turns on exactly its lights, after the AL pause;
   - each listed off automation has the condition and the trigger;
   - the `*_to_away` files don't;
   - sabotage: drop the condition from one file and the test goes red.
   - The full suite stays green, including `tests/test_entity_references.py`.
4. Docs: update `packages/house/entertainment/README.md` (the room table) and the foyer, kitchen, family room and dining room READMEs/LEARNINGS where they describe the off logic.

## Risks

- **Foyer `Off` is reached on vacancy.** Holding it means the foyer stays lit for the whole party, as asked. `Away` still clears it.
- **Kitchen `room_off` is also the manual Off.** Choosing Off on the kitchen dashboard during a party won't turn the lights off while the mode is on. Accepted: turn the mode off, or switch the lights by hand.
- **The mode-off trigger fires every off automation at once.** Each one re-checks its own conditions, so only vacant rooms (or bright ones, for the daylight automations) turn off. No new race: the AL resume in the room off-files only adapts lights that are on.
- **Restart mid-party.** The mode is restored, and the hold is a condition, not a trigger, so it still applies after a restart.
- **Lux and bedtime.** "Always" means the lights also come on in bright daylight. The mode already ends at bedtime (`entertainment_mode_bedtime_off`).

Deploy: `./deploy.sh --reload --skip-ci` after merge. It's automations only, so no helper or template reload is needed.

On approval → /approve → /ship entertainment-mode-lights
