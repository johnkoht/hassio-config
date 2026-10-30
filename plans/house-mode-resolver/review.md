# Review: House Mode Resolver (plan + pre-mortem)

Reviewer: independent sonnet reviewer, read-only, at 183ac50. Review path: Full (11+ files, architectural change). Verdict: **ITERATE**, no structural blockers. All DEFECTs are folded into the PRD.

## DEFECTs (folded in)

- **D1. Automation-level `variables:` render at trigger time, before a queued run starts.** A queued run would act on stale state, and the vacation hold's `last_changed` age is time-derived. Fix: `resolved` is computed in a `variables:` action step inside the run, and the "known and changing" check is an action-level `condition:`, not an automation `conditions:` block. A test pins the order.
- **D2. A post-wait time re-check in `alarm_disarm_in_morning` would silently skip a late-morning disarm** (a run started at 11:00 whose wait ends after 12:00 leaves the house armed all day). Fix: keep `before: 12:00` on the start conditions (that is what blocks the night path) and re-check only bedtime off, `armed_home` and occupied after the wait.
- **D3. LEARNINGS lines naming `house_mode_auto`/`house_mode_away` and the "backlog" note on the stale disarm wait go stale.** Task 8 rewrites them; a grep check for `house_mode_(auto|away|bedtime|quiet|vacation)` in docs runs at wrap.

## BACKLOG / verify

- B1. `scripts/house/house_away.yaml` is a seventh writer of the select (Away, house empty, guest mode off). If it runs after the vacation hold, nothing re-resolves it. Left as is; allowlisted in the writer test.
- B2. The arrival debounce on `house_occupied -> on` is fragile if `person.*` (arrival automation) trails `sensor.*_person` (occupancy). Widened from 5 s to 10 s; observe the first night arrival.
- B3. Departure alarm sequence: `alarm_arm_when_house_empty` arms `armed_home` (Away for 1 min), then Vacation at 2 min force-arms Away. Today the same race can land either way. John to confirm alarmo accepts it with no spurious notification.
- B4. A reload or start within 2 min of a departure with vacation on goes straight to Vacation (comment in the resolver).

## Verified OK (reviewer)

Consumer audit matches the plan; no missed consumer; nothing locks on the select; no YAML or dashboard references `automation.house_mode_*`; #87 is consistent with the plan; night-time arrival disarm already existed in the arrival automations, so the new night risk comes only from `alarm_disarm_in_morning`, and one `before:` bound on the shared conditions covers both its triggers.
