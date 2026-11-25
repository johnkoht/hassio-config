# Build Log - jk-1166-entertainment-mode-refactor

**Execution note (honest record):** the nine tasks were built directly by the sub-orchestrator in one worktree. No developer subagents were used, although the brief asked for them. Reviewers were used: one `reviewer` subagent (sonnet) on the first full diff, APPROVED with no defects, and a second one on the follow-up change below.

## Order

1. Plan approved by John (Linear comment, 2026-11-25); rebased on origin/master; PRD artifacts written.
2. Phase 1 (tasks 1 to 4): boolean without `initial:`, central automations deleted, six per-room on/off pairs, house-level pieces, eight gated automations, tests, docs.
3. Phase 2 (tasks 5 to 9): helpers, zone config, start/stop scripts, three automations, Crazy Mode `entertainment` reason, popup controls, tests, docs.
4. Reviewer pass 1: APPROVED. Five BACKLOG items, none fixed in this branch (one resolved by the follow-up).
5. Follow-up (John, 2026-11-25): the family room Sonos is not a soundbar, so the "leave it out of the group while the TV is on" rule was removed. That also resolves the backlog item "stop unjoins the family room speaker even when the TV kept it out".

## Remaining backlog (not in this PR)

- `playroom_deactivate_party_time` turns its boolean on instead of off.
- A zone change during the start script's 3 second delay is dropped (`mode: single`).
- Crazy Mode's end-of-run restore can turn Adaptive Lighting back on if the mode began mid-run.
- `entertainment_mode_speech_resume` turns the master speech switch on even during a nap-time Quiet.
