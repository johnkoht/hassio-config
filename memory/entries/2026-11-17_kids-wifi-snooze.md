# Kids WiFi snooze (JK-1261)

**What:** 10 minutes before the nightly kids WiFi shutoff, a warning goes to the playroom and family room speakers and to John's phone (Snooze 15 / Snooze 30). The Kids WiFi popup shows the same buttons in that window. A snooze sets the shutoff to the scheduled time plus 15 or 30 minutes (no stacking, so at most 30 past schedule). State is two `input_datetime`s (scheduled, effective), not a timer.

**Learnings:**
- Five plan reviews (ITERATE x4) changed the design: a timer plus latched boolean could latch on and lose a snooze across a restart (a restored expired timer fires `finished` before automations attach). The datetime design is time-bounded and restart-safe.
- A time trigger on a datetime helper fires when `now >= value`; gating that automation on `now < value` makes it dead. Tests render both gates at the boundary.
- Substring tests on templates passed three sabotages; rendering the templates in a Jinja harness caught them.
- Refusal and confirmation pushes need `important: true` or the Important level swallows them.

**Follow-ups (BACKLOG):** other `restore: true` timers may lose `finished` on restart; catch-up needs the switch available at start; voice warning is dropped by `voice_announcement` gates (bedtime, 06:00-23:00) pending John's call; no speaker in the kids' bedrooms.
