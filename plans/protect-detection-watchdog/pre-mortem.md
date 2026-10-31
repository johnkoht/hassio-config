# Pre-mortem: protect-detection-watchdog

No CRITICAL risks. Folded into the PRD:
- HIGH: restored `last_changed` = restart time, so the sensor is blind for the threshold after a restart. Accepted; triggers on start/template reload must never set `on`.
- HIGH: wait on the seven motion sensors (wait_for_trigger), not on the 15-min template; automation trigger `to: on` with `not_from: [unavailable, unknown]`.
- HIGH: the Protect reload makes unavailable→off transitions. Check `not_from` guards on `to: "off"` triggers in the garage evening auto-lock and garage flood light; add guards if missing (the lock run during a freeze is arguably correct; document it).
- MEDIUM: reload loop. Use `this.attributes.last_triggered`, null-safe, 6 h.
- MEDIUM: threshold. Recorder (10 days): normal quiet gaps reach 4.5 h at night (3.76, 3.88, 4.53 h); the freeze was 27 h. Use 6 h, and a 60 min post-reload wait so a quiet night never sends a 3 am push.
- LOW: reload target with continue_on_error; skip unavailable sensors in the max; throttle test.
