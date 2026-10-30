# Review: wfh-call-lighting (plan + pre-mortem)

Reviewer: independent sonnet `reviewer` subagent, 2026-10-30. Verdict round 1: **ITERATE**, no structural blocker.

| # | Finding | Tag | Disposition |
|---|---------|-----|-------------|
| 1 | Ship addendum missing from `plan.md` (replace had not matched) | DEFECT | Fixed: addendum appended, PRD generated from it |
| 2 | Start gate lacked `input_select.office` = DnD (matters for the dusk-crossing trigger) | DEFECT | Fixed: explicit condition |
| 3 | Start ignored the manual latch, `house_occupied`, entertainment mode | DEFECT | Fixed: all three added in gate order |
| 4 | No-latch claim rests on synthetic contexts; late Hue reports could latch | DEFECT | Handoff logbook check + backlog fallback; documented in LEARNINGS |
| 5 | Reload/restart loses `for:` timers; `automation_reloaded` unverified | DEFECT | Reload and start paths documented best effort; 3 h and 12 h triggers are the guarantee; trigger shape tested |
| 6 | Attribute trigger could re-fire on AL resume | DEFECT | DnD condition blocks it; resume order (switch on, then flag off) pinned by a test |
| 7 | 3 h reset during a live call causes flicker | BACKLOG | Taken: reset needs "not in DnD", plus a 12 h unconditional trigger |
| 8 | End overrides a manual AL off mid-call | BACKLOG | Accepted, documented |
| 9 | Plan/pre-mortem claimed a sleep-mode pauser exists | BACKLOG | Corrected |

Checks that held: entertainment guards, detector ignores automation and `:al:` contexts on paper, `to: [Auto, Off]` is complete (the select has three options).

Round 2 (re-review of the corrected plan): see bottom.
