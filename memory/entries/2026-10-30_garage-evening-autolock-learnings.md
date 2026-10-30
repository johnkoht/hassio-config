# Garage entry door evening auto lock (JK-1233)

**What:** one switch on the garage entry lock popup re-introduces the 15-minute auto lock after sunset only. A 2-minute time-sensitive warning with a 1-hour snooze, then the lock; waits while the driveway, back yard or garage show somebody, and skips guest and entertainment mode. A follow-up push offers Unlock for 30 minutes. The old daytime rule stays off. One PR, 6 tasks.

**Metrics:** 6 tasks, 56 new tests (full suite 1005 passing), 18 sabotage checks all red.

**Pre-mortem vs reality:** the pre-mortem's live spike proved the outdoor guards fire and found no stuck sensor, and added the emergency, notification-level and unlock-tap-age guards. The review (not the pre-mortem) caught two real faults: `active`/`passive` pushes are dropped at the usual night notification level, and an age window on `last_changed` lets a stale Unlock tap work after any later lock. It also caught the dark-morning re-lock.

**Learnings:**
- Check how the notification script filters priority before choosing one: only `time-sensitive` and `critical` pass level Important.
- A wait inside an automation outlives its trigger-time conditions; re-check in the actions.
- Tie a "tap to undo" window to the exact event that created it (own timer), not to the entity's last change.
- Evaluating the real YAML conditions with a small interpreter made every gate and the morning case testable.

**Follow-ups (backlog):** the 19:30 evening lock has no outdoor guard; a Protect feed freeze blinds the guards silently; the snooze timer is not shown on the popup; the old daytime rule and its popup toggle can be removed once John is happy with this one.
