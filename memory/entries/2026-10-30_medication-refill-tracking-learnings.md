# Medication refill tracking, Nino only (JK-1196, JK-1212)

**What:** Nino's medication has a supply count. Stock is stored in doses (twice daily), everything shown or typed is days (doses / 2). Each confirmed dose subtracts one; under 7 days a time-sensitive push repeats daily at 09:00, under 3 days it is a critical phone push, and the morning announcement gets a line. The push has +15 and +30 day buttons; the Nino popup has "Days to enter", "Add days to supply", "Set days left" and the two thresholds. JK-1212 answered: native helpers, HACS integration not adopted. Cristina deferred. One PR, 7 tasks.

**Metrics:** 7 tasks, 51 new tests (full suite 1057 passing), 8 sabotage checks all red.

**Pre-mortem vs reality:** the pre-mortem's live read found `input_number.reload` exists, so no restart is needed, and settled the plan's open question about unseeded helpers (a helper with no `initial:` reads its minimum, so stock got `min: -1` as "not set"). The review caught two real faults: the plan had John typing doses on the dashboard, against "days only", and a Refill with 0 days on an unseeded stock would turn -1 into 0 and fire a critical push.

**Learnings:**
- "Unset" needs its own value when a helper has no `initial:`: a sentinel below the real minimum, with the derived sensor `unavailable` there.
- Every write path must refuse a zero input before touching a sentinel state.
- `input_number.decrement` is atomic; pair it with a guard because min is the sentinel.
- Seeding and correcting in days (Set days left) beats exposing the raw stock.

**Follow-ups (backlog):** Cristina's two medications; a restart may re-fire the crossing trigger once (check on the first restart); the tap_action on the two template-entity-rows is untested live; `notification_level` None drops the time-sensitive push (critical still passes).
