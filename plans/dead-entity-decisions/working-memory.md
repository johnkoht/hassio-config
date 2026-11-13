# Working Memory — dead-entity-decisions

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Orchestrator] Tests run from `tests/` with `/Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q` (system python3 has no pytest). Baseline 1410 passed, 9 skipped.

- [Task 1] Camera proxy object_id = `camera.camera_proxy_` + slug(full source entity_id); a `_proxy.yaml` under detections/** is what produces it. `has_value` is a HA-only Jinja test: register it in any stub Env (see tests/test_dead_entity_cameras.py).
- [Task 2] A template test can load `tomorrow_is_garbage_day` via yaml + `jinja2.Environment` with stubbed `now`/`timedelta`/`state_attr` globals (tests/test_dead_entity_b.py; later PR B tasks add there). Calendar `start_time` is a "YYYY-MM-DD HH:MM:SS" string, so `start[:10]` vs tomorrow's isoformat compares dates.
- [Task 3] HA's `is_number()` is not a Jinja builtin: tests stub it (see `_render_nino` in tests/test_dead_entity_b.py). Arrival heaters use a native `numeric_state` condition (false on unavailable) plus a `trigger` condition on the status-select trigger ids; "Just Arrived" lasts 5 min (people_status_home), so the house_occupied branch uses `last_changed < 300 s`.
- [Task 4] The select-option guard (`state_refs`/`find_state_violations` in tests/test_room_select_options.py) covers `condition`/`trigger`/`platform: state` with state/to/from/not_to/not_from (scalar or list), `entity_id` and Lovelace `entity`; scans ~1295 files, ~476 refs on repo-defined selects, empty allowlist. Dashboards had no violations. Any new state check on a removed select option now fails it.

## Active Gotchas
- [Orchestrator] Three PRs on separate branches; never edit a file owned by another PR (see prd.md ownership table).
- [Orchestrator] Public repo: the work calendar's employer domain must never appear in added lines, commit messages or PR bodies. Write `<work-domain>`.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-13] Items 9 and 9a move from PR C to PR B (pre-mortem R1: guaranteed conflict in tests/test_dead_entity_regressions.py and ninos_bedroom_heater.yaml) — docs affected: plan.md Tasks — status: folded
- [Task 5] BSD sed: `sed -i -E` treats -E as the backup suffix (leaves `*-E` files); use `sed -i '' -E`. A test holding a literal that matches its own absence regex breaks once the file is tracked; build it by concatenation.
