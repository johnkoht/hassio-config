# Working Memory — house-mode-resolver

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- Automation-level `variables:` and `conditions:` run at trigger time, before a queued run starts. Anything that must be fresh in a queued automation goes in the action list.
- Tests render real templates with Jinja2 `StrictUndefined` and fake `states`/`is_state`/`now`.

## Active Gotchas
- `!include_dir_named` keys packages by basename: all new files are `house_mode_*`; nothing else has that prefix.
- Never run a bare `./deploy.sh --check`. Never restart HA. No HA service calls.

## Shared Utilities Created
*(none yet)*

## Context Corrections
*(none yet)*

## Decision Ledger
- [2026-10-30] Arrival debounce on `house_occupied -> on` is 10 s (review B2) — docs affected: packages/house/LEARNINGS.md — status: open
- [2026-10-30] `alarm_disarm_in_morning` re-checks bedtime, armed_home, occupied after the wait, not the clock (review D2) — docs affected: packages/security/LEARNINGS.md, packages/house/LEARNINGS.md — status: open
