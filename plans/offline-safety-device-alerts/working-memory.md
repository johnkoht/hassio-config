# Working Memory - offline-safety-device-alerts

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- Trigger-based template sensors restore only state, name, icon and picture (HA core template/entity.py); custom attributes are lost on restart.
- A state-template error makes the entity unavailable; an error in the trigger `variables` leaves it stale.
- `condition: trigger` ids and event triggers: the 09:00 and timer.finished triggers have no trigger.entity_id.

## Active Gotchas
- Garage entry lock has a battery (22% live) but the approved plan makes locks and covers offline-only.
- quiet_mode means somebody is in bed (naps included).

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-30] Restart re-push accepted as a documented limit (no attribute restore) - docs affected: packages/system/sensor_health/README.md - status: folded
