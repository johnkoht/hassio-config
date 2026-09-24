# Working Memory — radio-network-offline-alerts

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Plan] Push pattern to copy: packages/system/alerts/playroom_ap_unavailable.yaml (modern syntax, general_notification, jk, time-sensitive, tag)

## Active Gotchas
- `!include_dir_named` keys packages by basename across the whole tree, so a duplicate filename silently collides.
- Never run `deploy.sh --check` (it deletes secrets.yaml). Never restart HA.

## Shared Utilities Created

## Context Corrections
- [Task 1] MISSING_CONTEXT: `sensor.texas_instruments_coordinator` is disabled_by integration. The trigger stays on it, and John enables the entity in the UI. An interim substitution with ZHA light groups was rejected because they're room lights, not the controller.
- [Task 1] The Z-Wave controller entity is `sensor.home_assistant_connect_zwa_2_status` (ready/unresponsive/jammed). The trigger includes unresponsive and jammed, which are controller-level states.
- [Task 1] `sensor.apc_ups_status` normal state is "Online". It went unavailable once on 09-19 15:28 for about 1 min, and the `for: 3 min` filters that.

## Decision Ledger
