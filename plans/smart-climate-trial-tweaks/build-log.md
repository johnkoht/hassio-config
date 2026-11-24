# Build log: smart-climate-trial-tweaks

Started 2026-11-24. Worktree `.claude/worktrees/climate-decisions`, branch `feature/smart-climate-trial-tweaks` (from origin/master 8c408ede, after PR #209). LITE mode (no pre-mortem, no cross-model review). Stops at an open PR (no merge, no deploy).

- [x] Phase 0: build log, status in-progress
- [x] Phase 2: memory review (carried into working-memory.md), PRD (4 tasks), artifacts commit
- [x] Phase 4: build (tasks 1-4; reviewer APPROVED each on the first pass; orchestrator tidy df67d1ad for the task-4 cosmetic BACKLOG; holistic review READY)
- [x] Phase 5: memory entry, LEARNINGS, wrap (suite 2369 passed, 9 skipped), finalize (status shipped, prd.json reconciled), PR — stop before merge/deploy

## Recon (build phase 0)
| Task | Status | Evidence |
|---|---|---|
| task-1..4 | CONFIRMED | no `climate_live_<zone>` helpers, no `climate_live` macro, seed wrote 72, no guest branch in the macro, no live rows on the popup |

## Reviewer BACKLOG (not fixed here)
- Main-floor pre-wake lead uses the Sleep setpoint, so with guests it starts early (target is Comfort anyway).
- Nothing pins that the UI-defined `input_boolean.guest_mode` exists.
- Override garage-only test checks the dry-run logbook name, not the "would mark Override"/"hold ended" text.
- `docs/climate_automation_plan.md` (old plan) has 72 Sleep rows for other rooms; not main floor.
