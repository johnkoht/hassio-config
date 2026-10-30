# Build Log: house-mode-resolver

Branch: worktree-house-mode-resolver (pushed as feature/house-mode-resolver). Worktree: .claude/worktrees/house-mode-resolver.
Single PR.

## 2026-10-30 Session 1
- Phase 0: build log created, plan.md stamped in-progress.
- Reconcile with master: #87 already shipped OD-1 (`bedtime_mode_on` person triggers, `bedtime_mode_off_on_arrival` = Task 6). Task 6 is not recreated; only its header/landing note changes. `camera_notifications_deactivate` is already unkeyed on the select.
- Live read-only check (Task 9): select Quiet, quiet_mode on, bedtime off, occupied on, vacation off -> resolver computes Quiet. No drift, so the first reload makes no transition.
- Phase 1.2: pre-mortem written (10 risks, none CRITICAL) -> pre-mortem.md
- Phase 1.3: independent review (sonnet reviewer): ITERATE, no structural blockers; D1 (queued variables render at trigger time), D2 (no post-wait time re-check), D3 (LEARNINGS stale text) folded in; debounce widened to 10 s -> review.md
- Phase 2: prd.md / prd.json (6 tasks, single PR), working-memory.md
- Phase 4 (single PR, tasks 1-6): c90e185 resolver + side effects + legacy removed; f53a1dc bedtime off; 374868b rooms/foyer; 1bed18f alarm guard; 192a2a1 tests; f341aa7 docs/memory. 579 passed (+54).
- Sabotage (revert -> red): bedtime/away priority, restart hold clause, known-input check, mode single, arrival debounce 0, quiet priority, no change check, vacation hold bypass, alarm `before:` dropped, each of the three post-wait re-checks dropped, bedtime re-check wrong state, armed_home|disarmed loosening, bedtime-off away branch, bedtime-off no upper bound, aggregate trigger back, room Auto revert, foyer revert, doorbell text, speech-on guard, a restored legacy writer. All red.
- Live read-only: rendered the resolver, its gate and the bedtime-off condition on the host via /api/template: resolved Quiet, gate false (select already Quiet), bedtime-off condition true. Found the doorbell select has no `Please do not disturb!` option; Vacation text changed to DO NOT DISTURB.
- Phase 4.2: independent final review (sonnet) at f341aa7: APPROVED; 4 BACKLOG (exact armed_home assertion -> fixed; bedtime never ends after noon if the first adult is up after noon; Auto-only `to:` triggers in kid-room/bathroom autos skip Bedtime->Quiet but have other triggers; manual Entertainment is overwritten).
- Phase 5: wrap run; plan.md stamped shipped, prd.json reconciled.
