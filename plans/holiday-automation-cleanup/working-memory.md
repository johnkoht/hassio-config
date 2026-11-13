# Working Memory — holiday-automation-cleanup

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [orchestrator] Startup gating pattern: `id: startup` on the `homeassistant` start trigger plus `or: [not trigger startup, <window>]` (`packages/holidays/halloween/halloween_lights.yaml:15-40`).
- [orchestrator] File header pattern: `# Title`, `#`, 1-3 lines, `#`, blank line, then the domain key (`packages/holidays/front_yard_holiday_decorations.yaml:1-6`). Keep headers short (memory: keep inline docs short).

## Active Gotchas
- [orchestrator] `!include_dir_named packages/` keys by file BASENAME across the whole tree; a duplicate basename silently drops a file. Check `find packages -name <name>.yaml` before creating one.
- [orchestrator] Automation entity IDs come from the alias at first registration. Keep every surviving `id` and `alias` byte-identical; new automations get an alias whose slug equals the id.
- [orchestrator] A multi-entity `state` condition requires ALL entities to match (LEARNINGS line 3).
- [orchestrator] Do NOT touch `packages/playroom/lights/playroom_lights_off.yaml` (its `swtich.` typo is a product call for John).
- [orchestrator] Never run `./deploy.sh --check` (it can delete secrets.yaml). Gate is `tests/run.sh` (full suite; baseline 1410 passed, 9 skipped on 723106b8).

## Shared Utilities Created
- [task-1] `tests/test_holiday_lights_regressions.py` now has `_auto(rel)`, `_targets(action)`, `_state_conds(auto)`, `_render(rel, day)` (jinja2 date-template renderer with stubbed `now`) for later tasks to reuse.

## Context Corrections
- [task-1] `dashboards/kohbo/holidays/README.md:59` still names the deleted automations (`activate_christmas_season`, manual pair, `initial_state: false`); task-3 docs must rewrite it. Deleted automations (shortcut button, manual pair, activate_christmas_season, handle_ikea_unresponsive) leave registry ghosts on the host (release step).

## Decision Ledger
