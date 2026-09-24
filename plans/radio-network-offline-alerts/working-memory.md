# Working Memory — radio-network-offline-alerts

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Plan] Push pattern to copy: packages/system/alerts/playroom_ap_unavailable.yaml (modern syntax, general_notification, jk, time-sensitive, tag)

## Active Gotchas
- `!include_dir_named` keys packages by basename across the whole tree, so a duplicate filename silently collides.
- Never run `deploy.sh --check` (it deletes secrets.yaml). Never restart HA.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
