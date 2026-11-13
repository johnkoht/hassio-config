# Build Log: dead-entity-decisions

Started: 2026-11-13 (/ship, full mode, orchestrated by an agent on John's relayed approval; stop before merge)

- [x] Phase 0: build log created, plan status → in-progress
- [x] Phase 1.2: pre-mortem — 13 risks, 0 CRITICAL; R1 moves items 9/9a to PR B (pre-mortem.md)
- [x] Phase 1.3: review — independent agent (sonnet), APPROVE WITH SUGGESTIONS, no structural blocker; 6 MUSTs folded into prd.md (review.md)
- [x] Phase 2: memory review, PRD 5 tasks across 3 PRs, artifact commit
- [x] Phase 3: worktrees `.claude/worktrees/dead-entity-{a,b,c}` (branches `worktree-dead-entity-{a,b,c}` → pushed as `feature/dead-entity-decisions-{a,b,c}`), base 86656610 (artifact commit on origin/master 723106b8). git worktree used because native EnterWorktree bases on local master, which carries unrelated unpushed commits.
- [x] Phase 4: build 5/5 first-attempt (sonnet developers, sequential). Reviews: #158 APPROVED @f1159617; #161 ITERATE @bc291c59 (stale Nino doc row) → APPROVED @2be319a3; #162 ITERATE @b8237aab (stale climate README rows) → APPROVED @130a2824. Holistic: per-PR reviewers covered the PRD ACs; no orchestrator-level rework.
- [x] Phase 5: post-approval commits are plans/memory-only plus a merge of origin/master (#159/#160, no file overlap) on each branch; gates re-run green (A 1470, B 1475, C 1450 passed, 9 skipped). Working-memory notes consolidated on C; memory entry + MEMORY.md + prd.json + shipped stamp on C only. Merge gate NOT run: stop-before-merge per the orchestrator brief.

Memory review (applied in task prompts):
- Removing `initial_state` doesn't re-enable; leave `initial_state` lines alone.
- Automation entity_id comes from the alias; don't change aliases of kept automations.
- HA template type coercion: compare with `| string` where numbers render.
- Keep inline docs short: header = title + 1-3 lines; reasoning in commits.
- Worktree push needs an explicit refspec; verify `headRefOid`.
