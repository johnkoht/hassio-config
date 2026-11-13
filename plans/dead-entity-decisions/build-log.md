# Build Log: dead-entity-decisions

Started: 2026-11-13 (/ship, full mode, orchestrated by an agent on John's relayed approval; stop before merge)

- [x] Phase 0: build log created, plan status → in-progress
- [x] Phase 1.2: pre-mortem — 13 risks, 0 CRITICAL; R1 moves items 9/9a to PR B (pre-mortem.md)
- [x] Phase 1.3: review — independent agent (sonnet), APPROVE WITH SUGGESTIONS, no structural blocker; 6 MUSTs folded into prd.md (review.md)
- [x] Phase 2: memory review, PRD 5 tasks across 3 PRs, artifact commit
- [ ] Phase 3: worktrees (git worktree from the artifact commit on origin/master; native EnterWorktree would base on local master, which carries unrelated unpushed commits)
- [ ] Phase 4: build
- [ ] Phase 5: wrap

Memory review (applied in task prompts):
- Removing `initial_state` doesn't re-enable; leave `initial_state` lines alone.
- Automation entity_id comes from the alias; don't change aliases of kept automations.
- HA template type coercion: compare with `| string` where numbers render.
- Keep inline docs short: header = title + 1-3 lines; reasoning in commits.
- Worktree push needs an explicit refspec; verify `headRefOid`.
