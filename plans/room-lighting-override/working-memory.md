# Working Memory — room-lighting-override

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- Main bedroom light is a Lutron Caseta dimmer; wall presses and device reports have no user and no parent_id; automations have a parent and no user; app toggles have a user. Condition lives in prd.md "Phase 0 result".
- Tests use a tolerant YAML loader (see tests/test_away_mode_regressions.py); a plain safe_load silently skips files with `!secret`.
- Resolver (#99): never add `state: "Auto"` on `input_select.house`; guard with not in [Away, Vacation].

## Active Gotchas
- `!include_dir_named` keys packages by basename; keep filenames unique.
- Entity ids of automations come from the alias, not the id. Keep alias slug == id.
- Live latch `main_bedroom_lights_manually_toggled` is on now; do not set it from anything.
- Never call HA services, never touch alarm/siren/Noonlight.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-30] Vacancy-off in main_bedroom_lights_off obeys the hand flag; Off transition obeys neither flag (review defect 3, plan Open decision 6) — docs affected: plan.md (folded), main_bedroom README, LEARNINGS — status: open
