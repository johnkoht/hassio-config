# Working Memory — smart-climate-trial-tweaks

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Memory review] Carried over from `plans/smart-climate-control/working-memory.md` and `memory/entries/2026-11-24_smart-climate-control-learnings.md`:
  - Make the safe state the default: a boolean with no `initial:` starts off, and off must mean dry run.
  - Macro tests render with `FileSystemLoader` on `custom_templates/` and `{% from 'climate_control.jinja' import climate_decision %}`; `tests/test_smart_climate_decisions.py` has `decide(zone, **over)` and a `NORMAL` baseline.
  - The controller tests run the real script/automation YAML through `tests/smart_climate_harness.py` `run_actions` (HA-like native parsing via `ast.literal_eval`).
  - Harness `float`/`int` raise without a default, like HA. `input_number` states render as `5.0`; use `| float(0) | int`.
  - Unquoted `Off` in YAML parses as False.
  - Queued automations keep variables/conditions in `actions:` so they read fresh state (override detect, mode resolve).

## Active Gotchas
- [PRD] A macro returns a string. It must render exactly `True`/`False`: HA native types turn that into a bool, but `true`/`false` (lowercase) or padded output stays a non-empty string, and `{{ not live }}` would then be False for a dry-run zone (it would write).
*(Add: [Task N] issue the next developer must know about)*

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
*(Builder rulings that supersede or refine a documented rule. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`.)*
- [2026-11-24] Live control is per zone: global on OR zone switch on (supersedes PR #209's single switch) — docs affected: packages/climate/smart/README.md — status: open (task-1)
