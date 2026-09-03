# Working Memory — kid-at-school-detection

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*
- NOTHING_NOVEL — Task 1

## Phantom Check Log
- [Task 1] `grep -rn "nino_home_today\|nino_dropped_off\|gianluca_home_today\|gianluca_dropped_off" packages/ dashboards/` returned nothing (exit 1) before the edit, confirming these entity IDs were not already referenced anywhere.

## Active Gotchas
- [Setup] `tests/.venv` is broken (points at a missing Xcode python). Run the suite with `/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/237d088d-be45-4b72-accc-bbb73f9fe025/scratchpad/venv/bin/python tests/run_tests.py --syntax --modern`. Baseline before any change: 7 passed, 1 skipped.
- [Plan] `trigger: zone` does not accept `for:`; use a template trigger over `state_attr('zone.x','persons') or []`.
- [Plan] `condition: state / state: "off"` is FALSE on unavailable. Gate the medication voice with `not is_state(..., 'on')`.
- [Plan] `ha core check` does not run on this machine. Local gate is `tests/.venv/bin/python tests/run_tests.py --syntax --modern`. Never `deploy.sh --check`.
- [Plan] Zones `zone.lyon_school` (122 m) and `zone.olph_school` are UI-defined; they are not in the repo and must not be added to configuration.yaml.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
- [2026-09-03] at_school polarity is POSITIVE evidence (dropped_off required); default is "announce". Supersedes the original plan draft's default-on design. — docs affected: plan.md (folded) — status: folded
- [2026-09-03] Gianluca gets helpers + latch + sensor only; no ping, no handler, no chip until a consumer exists. — docs affected: plan.md (folded) — status: folded
- [2026-09-03] Voice gate scoped to dose 2 only via the existing `dose` variable. — docs affected: plan.md (folded) — status: folded
