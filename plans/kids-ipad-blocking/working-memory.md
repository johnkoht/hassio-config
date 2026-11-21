# Working Memory — kids-ipad-blocking

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*
- [Task 2] template-entity-row toggle styling: dashboards/templates/includes/kohbo_template_toggle_entity_layout.yaml (PR #200). Folded into dashboards/LEARNINGS.md.

## Active Gotchas
- [Plan] Policy switch on = policy enabled = iPad BLOCKED (inverse of per-client block switches).
- [Plan] Public repo: no MACs, IPs or client records anywhere.
- [2026-11-20] Policy switches are now UNSUFFIXED: switch.unifi_network_block_nino / switch.unifi_network_block_gianluca (plan/PRD `_2` is out of date).
- [Task 1] switch.unifi_network_block_gianluca friendly_name has a trailing space (from the controller policy name) — always set `name:` explicitly on the row.
- [2026-11-20] device_tracker.ninos_ipad is a STALE MAC, don't use it. The live trackers are disabled `unifi_default_<mac>` entries, so they must be renamed (MAC ids can't go in the public repo). Target ids: device_tracker.nino_ipad / device_tracker.gianluca_ipad.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
*(Builder rulings that supersede or refine a documented rule. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`.)*
