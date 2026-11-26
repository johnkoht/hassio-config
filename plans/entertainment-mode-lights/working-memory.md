# Working Memory — entertainment-mode-lights

Knowledge shared across tasks. Every developer reads this before starting and adds to it after finishing.

## Discovered Patterns
- `kitchen_lights_to_off` already re-checks its conditions when a flag triggers it (`house_flag_on`). Use it as the model for the mode-off trigger.

## Active Gotchas
- Several off automations use a root-level `entity_id:` on their actions. Leave them as they are unless the edit touches that action.
- `foyer_lights_nightlight_off` disables itself after it runs.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
