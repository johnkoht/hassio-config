# 2026-11-15: nino-weekend-medication-timing (JK-1168) and JK-1257

Weekend dose 1 floor (08:00 unless set), 30 minute snooze on no-school days, and a skip-a-dose action. Separate PR for the critical push Taken quick action and the Home notifications link (JK-1257).

## Notes

- The critical escalation push had no actions at all, so no quick action could work. The reminder's `TAKEN_<run>` ids are heard only by that run's wait for one snooze. Fixed-id actions need a stale-tap gate (the escalated flag, or pending dose), because the ids never expire.
- Dose 1's time is read in three places (trigger, pending sensor, escalation); all use `sensor.nino_medication_1_effective_time`.
- Skip is a separate boolean so supply and "taken" readers are untouched. Fail-open test form: `not is_state(..., 'on')`.
- Reviewers caught: in-run guards missing the skip, a skip handler id that broke the other PR's test, and un-skip leaving nothing to re-prompt.
