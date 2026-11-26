# Working Memory — entertainment-mode-lights

Knowledge shared across tasks. Every developer reads this before starting and adds to it after finishing.

## Discovered Patterns
- `kitchen_lights_to_off` already re-checks its conditions when a flag triggers it (`house_flag_on`). Use it as the model for the mode-off trigger.

## Active Gotchas
- Several off automations use a root-level `entity_id:` on their actions. Leave them as they are unless the edit touches that action.
- `foyer_lights_nightlight_off` disables itself after it runs.

## Shared Utilities Created

## Context Corrections
- PRD said the foyer nightlight-off sunrise/dark_outside condition gates a mode-end trigger. It does not: `condition: sun after: sunrise` stays true until midnight, so an evening mode end (automation armed by nightlight_on, chandelier on) would have put out the chandelier. Fixed with a `not trigger entertainment_off` / `dark_outside off` or-gate.
- `foyer_lights_day_off` has no lux condition, so a mode end before 18:00 would turn the chandelier off in bad weather. Same gate with `bad_weather off`.

## Decision Ledger
- Mode-end trigger id `entertainment_off` on the kitchen/foyer files that use `condition: trigger`; kitchen `room_off` branch cannot pass on it, so vacancy decides.
- Dining room gets no off file: lights stay on and `dining_room_lights_off` takes over.
