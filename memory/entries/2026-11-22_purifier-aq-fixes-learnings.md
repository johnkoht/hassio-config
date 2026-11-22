# purifier-aq-fixes — 2026-11-22

**Metrics:** 6 tasks, one review round (ITERATE: one defect, then fixed), 100 new tests, full suite 1993 passed.

**What shipped:**
- Indoor thresholds (PM2.5 15/35/55, TVOC 500/1500/5000) on helpers with no `initial:` and `min: 0`.
- Room AQ templates with `availability:` and hysteresis (step down below 80%, via `this.state`).
- Detection triggers with `not_to` unavailable and `for:` 1 min, in `mode: queued`.
- The shared script stops on unknown states, and its Auto/Sleep branches re-check the preset after 15 s.

**Worked:**
- Reading the Winix integration source on the host before designing the fix.
- Generating the six identical room templates from one script, with a test that they stay identical.
- Committing before sabotage checks, so restoring a file can't lose uncommitted work. The kitchen hotfix earlier the same night lost an edit that way.

**Didn't:**
- The 11-21 "stuck at Manual 50% after a dropout" never reproduced in two live tries. The re-check is defensive, not a proven root-cause fix.
- I first used `not_from` on the triggers. That would have stopped a purifier from re-syncing after a dropout, and I caught it myself.
- The reviewer caught that a `delay` inside a called script blocks a `mode: single` caller.

**Gotchas:**
- The HA REST `/api/history/period/<start>` returns only 1 day unless `end_time` is passed.
- The recorder keeps about 8 days.

**Follow-ups:**
- Rooms are serialised through the queued script (up to about 90 s after a house-wide dropout). A per-purifier lock is the fix if that ever matters.
- Confirm whether a purifier still sticks on Manual after a real dropout.
