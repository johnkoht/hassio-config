# Review: Garage Evening Autolock

Independent reviewer (sonnet), full path, 2026-10-30, over `plan.md`, `pre-mortem.md` and the draft YAML.

**Verdict: Revise (small). No structural blocker.** The plan is buildable as written; two BLOCKER-tagged findings were fixable design faults, and both are fixed.

| # | Finding | Resolution |
|---|---|---|
| 1 | `active` and `passive` pushes are dropped at notification level `Important` (live level), so the failure push and the Unlock follow-up vanished. | "Could not lock" is now `time-sensitive`. The passive "Locked" push is kept as the plan says; documented that Unlock needs level `All`. Test pins the priority. |
| 2 | Unlock tap valid after any later lock (bedtime, manual); 30 minutes since `last_changed` is not specific to this automation. | Own restore timer `..._unlock_window`, started only after this automation's confirmed lock; handler also needs house occupied, bedtime off, and cancels the window after one tap. Tests pin all of it and that only one place starts the timer. |
| 3 | `below_horizon` also covers the dark morning; the morning unlock would be re-locked. | `time after 12:00` in the conditions and the recheck. Test `test_morning_dark_hours_block`. |
| 4 | Plan text lacked the unlocked-for condition, `timer.finished` trigger and pre-mortem refinements. | Folded into `plan.md` ("Build-time refinements"). |
| 5-8 | Recheck parity, HA semantics, thin test list, housekeeping. | Parity test; semantics confirmed (templated `for:`, `wait.trigger is not none`, `int(15)`, sunset offset); tests added for each. |

Devil's advocate (kept): guards are blind to the side yard and front, and a Protect feed freeze leaves person sensors `off`; the warning push is the only net. Worst outcome: someone locked out overnight, or a stale Unlock tap.
