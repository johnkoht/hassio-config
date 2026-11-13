# Working Memory — dead-entity-decisions

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Orchestrator] Tests run from `tests/` with `/Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q` (system python3 has no pytest). Baseline 1410 passed, 9 skipped.

## Active Gotchas
- [Orchestrator] Three PRs on separate branches; never edit a file owned by another PR (see prd.md ownership table).
- [Orchestrator] Public repo: the work calendar's employer domain must never appear in added lines, commit messages or PR bodies. Write `<work-domain>`.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-13] Items 9 and 9a move from PR C to PR B (pre-mortem R1: guaranteed conflict in tests/test_dead_entity_regressions.py and ninos_bedroom_heater.yaml) — docs affected: plan.md Tasks — status: folded
- [Task 2] A template test can load `tomorrow_is_garbage_day` via yaml + `jinja2.Environment` with stubbed `now`/`timedelta`/`state_attr` globals (tests/test_dead_entity_b.py; later PR B tasks add there). Calendar `start_time` is a "YYYY-MM-DD HH:MM:SS" string, so `start[:10]` vs tomorrow's isoformat compares dates.
