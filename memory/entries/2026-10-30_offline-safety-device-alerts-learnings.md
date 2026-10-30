# Offline safety device alerts (JK-1231, with JK-1094)

**What:** a time-sensitive push to John when a leak sensor or `key_sensors_safety` device has been offline for an hour or is under 30% battery. `sensor.safety_devices_attention` (trigger-based, every 5 minutes) feeds `safety_device_offline_alert` (state change by day, 09:00 daily, snooze end), a snooze action automation with a restored timer (1 day or 1 week), a watcher for a dead or stale sensor, and a red Home card. Known-issue devices still count and repeat Mondays only. One PR.

**Metrics:** 5 tasks, 48 new tests (full suite 911 passing), 20 sabotage checks all red (one first looked green because the replace hit a header comment; redone on the YAML line).

**Pre-mortem vs reality:** the pre-mortem and a live read found the real surprises: five devices offline now, not three, and a lock that has a battery. The review caught what the pre-mortem missed, all in the restart and failure paths: a watcher that cannot see a stale sensor, a rollup that turns into `str.count`, and a `choose` whose default would silently snooze a day.

**Learnings:**
- Trigger-based template entities restore only state, name, icon and picture (read in HA core on the Yellow); attributes are lost on restart.
- A state-template error makes the entity unavailable; an error in the trigger variables leaves it stale.
- Evaluating the real automation conditions with a small interpreter over the YAML (trigger, state, time, and/or, template) made the night gate, cadence and snooze testable per trigger.

**Follow-ups (backlog):** persisted offline baseline so a restart does not repeat the push; watcher repeats only once; panic button (JK-1230); room-level dashboard alerts; include the garage entry lock battery if John wants it.
