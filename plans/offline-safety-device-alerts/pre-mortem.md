## Pre-Mortem: Offline Safety Device Alerts

Revised after the independent review (4 DEFECTs folded in: stale watcher, restart re-push documented, bracket access on the rollup, mode queued). Run against `plan.md` (approved 2026-10-30) plus a live read-only look at the Yellow. No expertise profiles exist in this repo (`.build/` absent); `packages/CLAUDE.md`, the sensor_health README and the emergency-mode learnings were the references.

### Risk 1: Notification level "None" silences the push

**Problem**: `script.general_notification` drops anything that is not `critical` when `input_select.notification_level` is `None`. The plan says time-sensitive. A safety push that vanishes silently recreates the months-long silent failure.

**Mitigation**: Keep time-sensitive (John's decision) and say so in the README and the PR. Do not escalate to critical. The 09:00 repeat and the dashboard card are the second look. Currently the level is `Important`, which passes time-sensitive.

**Verification**: README states the one case where the push is dropped; the PR body repeats it.

### Risk 2: The garage entry lock does have a battery (22% live)

**Problem**: The plan says locks and covers have no battery and are offline-only. Live, `lock.garage_entry_door` has `sensor.garage_entry_door_battery_level` at 22. Following the plan means that lock's low battery is never pushed.

**Mitigation**: Follow the approved plan (offline-only for lock and cover), keep the restriction to one place (the `startswith('binary_sensor.')` guard), and flag it to John with the one-line change. Not a CRITICAL: it is a scope call John already made on a wrong premise, and the dashboard Low Battery tab (threshold 20) already lists it.

**Verification**: A test pins the guard (lock and cover never reported low) so a later change is deliberate. Reported in the PR.

### Risk 3: State trigger re-fires on attribute churn

**Problem**: A trigger on the sensor with no `attribute:` fires on every attribute change, including a battery level moving from 29.5 to 29.0. That would re-push every five minutes.

**Mitigation**: The attention sensor keeps levels out of the id lists, and the automation's state path requires a device id that was not in the previous `offline` or `low_battery` lists (`from_state` to `to_state` diff). A fix, a known-issue label or a level change sends nothing.

**Verification**: Tests: new id sends; removed id, label move and level change do not.

### Risk 4: Restart storm, start grace and what a restart forgets

**Problem**: Every device is `unavailable` for a moment after an HA or radio restart. The same reset has a cost: `last_changed` restarts for every entity, so a device that was already down is forgotten and is listed again an hour later, which can re-push once ("new id"). Trigger-based template attributes are not restored (read in HA core: only state, name, icon and picture are), so the sensor cannot remember. An `unavailable` to `unknown` flip resets the clock the same way. Review finding 2 and 3.

**Mitigation**: The one-hour debounce also covers the plan's 10-minute start grace, so no separate mechanism. Accept the repeat: the tag replaces the previous push, a running snooze (restored timer) still blocks it, and restarts are now rare. Documented as a known limit and a backlog item (persisted baseline helper); not built because the helper's writes, clears and night gating cost more than a once-per-restart reminder.

**Verification**: Tests for 59 and 61 minutes and a freshly reset device; README names the limit.

### Risk 5: Night wait and the snooze must not eat a real alert

**Problem**: Three trigger paths (state change, 09:00, snooze end) with different gates. Getting one gate wrong either wakes John at 04:00 or drops the alert.

**Mitigation**: Trigger ids. 09:00 ignores quiet hours and `quiet_mode` (it is the morning). State change and snooze end require 07:00 to 21:00 and `quiet_mode` off; at night they do nothing and 09:00 sends. All three require the snooze timer idle. Known-issue-only attention sends on Mondays only (weekly).

**Verification**: A table-driven test evaluates the conditions for each trigger id across night, day, quiet mode, snooze running, known-only on Monday and Tuesday.

### Risk 6: Snooze timer and action ids

**Problem**: A timer without `restore: true` forgets a week-long snooze on restart. `timer.start` with the wrong duration format fails silently. A `wait_for_trigger` would not survive a restart.

**Mitigation**: `timer.safety_device_alert_snooze`, `restore: true`, standalone event automation, `duration: {days: 1}` and `{days: 7}`. The action ids are string constants shared by test, push and handler.

**Verification**: Tests assert both ids, both durations, `restore: true`, and that the alert's push actions match the handler's triggers.

### Risk 7: First deploy alerts about devices already dead

**Problem**: Five devices are offline now. Live read: basement sump, storage room, Nino's bathroom and upstairs laundry leak sensors, plus the backyard gate sensor. Only three were expected.

**Mitigation**: Report the exact first push to John. The label `known_issue` moves a device to the weekly cadence; snooze handles the rest. Nothing is silenced in code.

**Verification**: Live template render recorded in the PR body.

### Risk 8: The watcher itself breaks

**Problem**: A broken template leaves `sensor.safety_devices_attention` unavailable and the alerts stop with no sign.

**Mitigation**: A separate small automation, `safety_device_watcher_down`, pushes when the sensor has been unavailable for an hour (a restart refreshes it at start, so a real outage only). Separate file: one automation, one job.

**Verification**: Structural test on trigger, `for:` and message.

### Risk 9: Dashboard card cannot be verified against the live DOM

**Problem**: Past dashboard fixes (#66/#67) were reasoned from source and made things worse.

**Mitigation**: Reuse the proven conditional bubble-card button from `leak_sensor_offline.yaml` unchanged in structure (no custom CSS beyond its two colour rules), driven by a template binary sensor and `condition: state`. Placed as a normal flow card under the page header, no fixed positioning. Flag for John to eyeball after deploy.

**Verification**: Test that no `condition: template` is used; README and SITEMAP updated.

### Risk 10: Deploy reload gaps

**Problem**: `deploy.sh --reload` reloads automations but not Template entities or Timers.

**Mitigation**: PR body lists exact reloads: Template entities, Timer (new helper), Automations. No groups changed, no restart. Order: Template, Timer, then Automations.

**Verification**: Listed in the report.

### Risk 11: Test stubs diverge from HA

**Problem**: Rendering with plain Jinja can disagree with HA (`select('match')`, `is_state_attr`, `label_entities`, datetime comparison).

**Mitigation**: Stub those faithfully in the test env, render with `StrictUndefined`, parse the result as HA does, and sabotage-check each behaviour (debounce, battery guard, new-id diff, night gate, cadence). Live render of the real template against the Yellow is the cross-check.

**Verification**: Sabotage log in the PR.

### Risk 12: A silently stale watcher

**Problem**: A state-template error makes the sensor `unavailable` (HA core), but an error in the trigger's `variables` leaves it stale at its last value, and the alert stops with no sign. A `state ... for: 1h` watcher also loses its timer on restart. Review finding 1.

**Mitigation**: The watcher is a template trigger on unavailable, missing or `last_reported` older than 20 minutes (the sensor refreshes every 5), with `for: 5 minutes`. Checked live: `last_reported` renders for trigger-based sensors.

**Verification**: Structural test on the template and `for:`.

### Risk 13: quiet_mode is "somebody is in bed", not only night

**Problem**: A nap turns `quiet_mode` on at midday, so the attention and snooze-end paths wait and only 09:00 is guaranteed. Review finding 6.

**Mitigation**: This is John's approved rule (plan decision 7). Documented in the README: 09:00 is the guaranteed path. Watcher-down and notification level `None` use the same push helper.

**Verification**: A test covers quiet_mode on at 12:00.

## Summary

Total risks identified: 13
Categories: integration, test complexity, scope drift, environment/config, rollback safety
CRITICAL risks (must address before proceeding): none

Rollback: remove the files and reload Template, Timer and Automations; nothing is written to existing entities.
