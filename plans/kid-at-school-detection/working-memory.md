# Working Memory — kid-at-school-detection

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*

## Active Gotchas
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
