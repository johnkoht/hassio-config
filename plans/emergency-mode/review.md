## Review: Emergency Mode (PR 1 scope, plan reviewed as a whole)

Independent reviewer subagent (sonnet), Full review, 2026-10-30. **Verdict: Revise, no structural blockers.** All findings fit inside the approved plan's intent; they are folded into the PRD.

### Findings and dispositions

| # | Finding | Disposition |
|---|---|---|
| D1 | Blocking engine call makes the leak REST notifier (10 s timeout) wait through playback; a client disconnect may cancel the handler | Fixed in PRD: `critical_announcement` starts the engine with `script.turn_on` (non-blocking). The engine is `mode: queued`, so order is kept. Supersedes pre-mortem Risk 6. |
| D2 | append.yaml critical purge contradicts "hold, don't clear" for queue-path criticals (tornado until PR 2) | Kept as the plan's task 4 says; surfaced to John in the report. PR 2 moves tornado to the direct path. |
| D3 | Quiet-mode volume halving contradicts "plays in full at any hour" | Halving skipped while `emergency_active` is on; a leak at night stays halved. Surfaced to John. |
| D4 | Engine `max` unresolved; the 11th queued call could drop a critical one | `max: 25` on the engine, tested. |
| D5 | Existing test reads `sequence[0]`; processor tests lack `trigger` | Tests locate steps by action; `updated` guards `trigger is defined`. |
| D6 | Deploy also needs an Input Boolean reload; template needs `unique_id`/`default_entity_id`; basename-uniqueness test | In PRD and PR body. |
| D7 | `for: 10 min` timer lost on `automation.reload` | Extra `automation_reloaded` trigger on the auto-off. |
| Processor | Condition used raw `q[0]`; `next` is the first non-expired item | Condition uses the first non-expired item. |
| B1 | Deferral race can lose one item | Accepted residual, documented (pre-mortem Risk 4). |
| B2 | Stuck smoke sensor mutes ordinary audio; no override | Backlog (decision 2 allows `delay_off`; no escape hatch in v1). |
| B3 | Chime failure skips TTS | Added `continue_on_error` on the chime step. |
| B4 | In-flight message plays before a critical one | Backlog (X4). |
| B5 | Dates: artifacts 10-30, today 10-29 | Plan authorizes 2026-10-30; kept. |
| B6 | Security CLAUDE/LEARNINGS stale text | In task 5. |

### Required sabotage checks (adopted)
Revert the engine gate; break `default('normal')`; point `critical_announcement` back at enqueue. Each must turn its test red.

### Verdict
- [x] Approve with the above folded in (no blockers; proceed to build)
