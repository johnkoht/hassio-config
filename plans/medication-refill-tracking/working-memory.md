# Working Memory — medication-refill-tracking

## Discovered Patterns
- Unseeded input_number reads min; stock min -1 is the "not set" sentinel.
- Push-action handler pattern: packages/mudroom/garage_entry_door/garage_entry_door_evening_auto_lock_unlock_action.yaml
## Active Gotchas
- input_number.reload and template.reload exist: no restart needed.
- Never read `trigger` in the alert (time trigger has none).
## Shared Utilities Created
## Context Corrections
## Decision Ledger
