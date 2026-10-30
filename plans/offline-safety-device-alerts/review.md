## Review: Offline Safety Device Alerts (plan + pre-mortem + draft sensor)

Independent reviewer (sonnet, read-only). Round 1 verdict: **ITERATE**. No structural blocker, no CRITICAL risk; four DEFECTs and several BACKLOG items.

| # | Tag | Finding | Disposition |
|---|-----|---------|-------------|
| 1 | DEFECT | Watcher on `unavailable for 1h` misses a stale sensor (variables error leaves old state; `for:` lost on restart) | Fixed: template trigger on unavailable, missing or `last_reported` > 20 min, `for: 5 min` (pre-mortem risk 12) |
| 2 | DEFECT | New-id diff re-pushes about an hour after every restart; a restart under an hour apart hides outages | Accepted and documented. HA core restores only state, name, icon and picture for trigger-based sensors, so the sensor cannot remember. Tag replaces, restored snooze still blocks, 09:00 is the net. Persisted-baseline helper is backlog (risk 4) |
| 3 | DEFECT | `unavailable` to `unknown` flip resets the clock | Same cause and disposition as 2 (risk 4) |
| 4 | DEFECT | `rollup.count` falls through to `str.count` if the JSON does not parse | Fixed: bracket access, `rollup is mapping` guard, test with quote and apostrophe names |
| 5 | DEFECT | `mode: single` drops overlapping triggers | Already `queued`, max 5 |
| 6 | DEFECT | `quiet_mode` is on now; attention path may never fire | It is "somebody in bed" (naps too). Plan decision 7 as approved; README says 09:00 is the guaranteed path; test covers quiet_mode at noon (risk 13) |
| 7-12 | BACKLOG | timer.finished across restart (09:00 covers), dict durations (verified: `cv.time_period` in HA core), clear push after snooze, new device during snooze waits (John's rule), level None applies to watcher too (README), first-battery-sensor lookup | Recorded |
