---
title: Kids WiFi Snooze
slug: kids-wifi-snooze
status: in-progress
created: 2026-11-16
issue: JK-1261
has_pre_mortem: false
has_review: true
has_prd: false
---

# Kids WiFi Snooze

## Goal

Ten minutes before the nightly kids WiFi shutoff, the kids hear a wind-down warning and John gets a push with Snooze 15 / Snooze 30. The Kids WiFi popup shows the same two buttons. A snooze moves that night's shutoff to the scheduled time plus 15 or 30 minutes; the schedule itself is untouched.

Review pass 1 (ITERATE) found the first design (a timer plus a latched "pending" boolean) could latch on, could lose a snooze across a restart, and gave a snooze that was measured from "now". This revision replaces it.

## Design: one stored shutoff time

Two `input_datetime` helpers (date and time, no `initial`):
- `kids_wifi_off_scheduled`: the shutoff the warning is for.
- `kids_wifi_off_at`: the effective shutoff. Equal to scheduled until someone snoozes.

The warning writes both (`today_at()` of the helper that fired). A snooze writes `off_at = scheduled + N`, where N is 15 or 30. So:
- **Cap by construction:** at most 30 minutes past the scheduled time; taps do not chain. The script takes only 15 or 30, no free "minutes" field.
- **No shortening:** a tap whose target is not later than the current `off_at` is ignored (30 then 15 keeps 30).
- **Time-bounded, no latch:** a snooze is valid only while `now < off_at` and the network is on. Yesterday's value is in the past, so nothing can be snoozed at 3pm, and a stale value can never turn the network off at an odd time.
- **Survives restarts:** the state is a datetime, so no timer event has to be caught. A catch-up on HA start turns the network off if `off_at` passed within the last hour and the network is still on, the schedule is on.

## Pass-2 fixes (ITERATE, not yet re-reviewed)

- **Snoozed means `off_at > scheduled and now < off_at`.** That full rule is the skip rule in `kids_wifi_off_on_schedule`. `kids_wifi_off_at` gates only on `off_at > scheduled` (it runs when `now >= off_at`, so it must never test `now < off_at`). Unsnoozed nights keep the single existing shutoff path, so an off-time edit after the warning still works and the two automations never double-fire. Test: edit to an earlier time inside the warning window; sabotage: drop the `off_at > scheduled` check.
- **Refused taps answer.** A tap after the shutoff, or a shorter one than the current snooze, sends a push with the same tag giving the reason (already off, or already snoozed until the stored time). The shutoff clears the warning push by tag.
- Compare times as timestamps (`state_attr(..., 'timestamp')` vs `now().timestamp()`); write helpers with `input_datetime.set_datetime` and `timestamp:`.
- School choice is therefore made at the original shutoff on unsnoozed nights; only a snoozed night is locked in at the warning.

## Decisions

**Warning.** `kids_wifi_off_warning` triggers `at:` two timestamp sensors (`sensor.kids_wifi_weekday_warning_time`, `sensor.kids_wifi_weekend_warning_time`), each `today_at(<off helper time>) - 10 minutes`, `device_class: timestamp`, timezone-aware (packages/school/LEARNINGS.md), with an `availability:` template (helper `timestamp | int(0) > 0`) so an unset helper reads unavailable, not a wrong or `none` value. Support for `offset:` on an `input_datetime` could not be confirmed from the repo docs or tests (only timestamp sensors are proven), so the sensor pattern is used from the start and there is no build gate. Gates are the shutoff's own: schedule on, network on, helper set, school match for that helper. Fires only on nights the shutoff runs. No times in the repo.

**Voice.** `script.voice_announcement`, priority `high`, `expires_in: 5`, chime `school-bell-chime`, `media_players: auto` (occupied rooms, John's call). It follows the script's normal gates, decided by John: nothing plays before 06:00 or after 23:00, with `speech_notifications` off, or while `bedtime` is on. The warning may stay silent at bedtime; the push still goes out. One flag, `voice_warning_enabled`, switches the spoken step off. Rooms with no speaker (the kids' bedrooms) are not reached; that is a BACKLOG item.

**Push.** With the warning, to John only (`devices: jk`), `time-sensitive`, tag `kids_wifi_off_warning`, `url: /dashboard-kohbo/home#kids_wifi`. Actions `KIDS_WIFI_SNOOZE_15` and `KIDS_WIFI_SNOOZE_30` (no `SNOOZE_`/`PAUSE_` prefix, so the camera handler ignores them). After a successful snooze a confirmation push replaces it (same tag), with the new time rendered at runtime.

**Options: 15 and 30 only.** John named 15 and 30 for the push; a 10-minute snooze is the same as the warning lead and barely moves anything. The script's field is a select of 15/30, so adding 10 later is one option and one button.

**Who can snooze.** John via push, or anyone on the dashboard. The popup already lets anyone there flip `switch.kids_enabled`, so no new exposure.

**School logic and hard limits.** The school-night choice is made at the original shutoff and not re-evaluated, so a snooze across midnight cannot flip to weekend logic. A snooze never reaches the morning on-time: off times must be before midnight and the maximum push is 30 minutes. Nothing here overrides school logic.

## Files (one automation per file, unique basenames)

New, in `packages/network/kids_wifi/`:
- `kids_wifi_snooze_helpers.yaml`: the two `input_datetime`s.
- `kids_wifi_snooze_sensors.yaml`: the two warning-time timestamp sensors, plus `binary_sensor.kids_wifi_snooze_available` (network on and `now() < off_at`) and `binary_sensor.kids_wifi_snoozed` (available and `off_at > scheduled`). They use `now()`, so they re-render once a minute only.
- `kids_wifi_off_warning.yaml`: warning automation. The voice step sits behind one `variables:` flag so the spoken step can be switched off in one line.
- `kids_wifi_snooze_script.yaml`: `script.kids_wifi_snooze`, field `minutes` (select 15/30). Checks `now < off_at` directly (timestamps) and network on, not the minute-granular sensor. Refusal branches each send a push, tag `kids_wifi_off_warning`, with `url`: "already off" and "already snoozed until <stored time>" (target not later than `off_at`). Success sets `off_at` and sends the confirmation. Shared by the push handler and dashboard.
- `kids_wifi_snooze_action_handler.yaml`: routes the two action ids to the script.
- `kids_wifi_off_at.yaml`: trigger on `input_datetime.kids_wifi_off_at`, gated on schedule on, network on and `off_at > scheduled` only. It must NOT gate on `now < off_at` or on `binary_sensor.kids_wifi_snoozed`: when the trigger fires `now >= off_at`. Turns the network off (the snooze path) and sends the same `clear_notification`.
- `kids_wifi_off_catch_up.yaml`: on HA start (also sends the `clear_notification`), the one-hour catch-up described above. Known edge: a manual turn-on after the shutoff, followed by a restart inside that hour, gets cut again.

Changed:
- `kids_wifi_off_on_schedule.yaml`: skip when snoozed, meaning `off_at > scheduled and now < off_at` (timestamps). On an unsnoozed night `off_at == scheduled`, so the original path always runs and off-time edits still work; a stale `off_at` (past) or unset one never blocks. Also sends `clear_notification` (tag `kids_wifi_off_warning`, `devices: jk`) when it turns the network off.
- `dashboards/kohbo/home/kids_wifi_popup.yaml`: a block shown when the available sensor is on: Snooze 15 and Snooze 30 buttons calling `script.kids_wifi_snooze`; when the snoozed sensor is on, a row showing the new shutoff time (`input_datetime.kids_wifi_off_at`).
- `docs/AUTOMATIONS.md` (Kids WiFi entry), `dashboards/kohbo/home/README.md` if it lists popup contents, `packages/network` LEARNINGS.

The two shutoff automations are mutually exclusive: `kids_wifi_off_at` needs `off_at > scheduled`, the original path skips only while snoozed.

## Tests (`tests/test_kids_wifi_snooze.py`)

- YAML parses; triggers as designed; warning triggers on the two warning-time sensors, which render helper time minus 10 minutes (harness, incl. unset) and the shutoff's gates.
- Off automation skips while snoozed (condition present and rendered with a Jinja harness for before, after and unset).
- Script harness: target is scheduled plus N; a shorter target is ignored; stale `off_at` is rejected.
- Push actions are `KIDS_WIFI_SNOOZE_15`/`_30`, none start with `SNOOZE_`/`PAUSE_`; the handler maps each to 15 and 30.
- Voice call uses `script.voice_announcement` with `media_players: auto`.
- New entities the popup uses are defined in the package; no `HH:MM` clock times in the new files or popup.
- `tests/test_notification_deep_links.py` stays green.
- Condition renders: `kids_wifi_off_at` gate passes at `now == off_at` and `off_at + 1s` (and fails when `off_at == scheduled`); the off-on-schedule skip passes through when `off_at == scheduled` even after an edit to an earlier time inside the warning window, and skips when snoozed.
- Script has refusal branches for "already off" and "not later", each sending a push with tag `kids_wifi_off_warning` and a `url`; each of the three shutoff files sends `clear_notification` with that tag.
- Sabotage 5: add `now < off_at` to a scratch copy of the `kids_wifi_off_at` gate; the gate-render test goes red.
- Sabotage 0: drop `off_at > scheduled` from the skip rule; red. Sabotage 4: remove a refusal branch; red.
- Sabotage 1: remove the snooze-in-force condition from a scratch copy of the off automation; test goes red. Sabotage 2: remove the `now < off_at` gate from the script; red. Sabotage 3: remove the catch-up's one-hour bound; red.

## Hand steps for John after merge

Reload YAML for Input datetimes, Template entities, Scripts and Automations (Developer Tools, YAML). No restart. New helpers start unset. Watch the first warning night in the Logbook.

## Out of scope / BACKLOG

- A second warning when a snooze ends.
- Speakers in the kids' bedrooms.
- Snoozing earlier than 10 minutes before the shutoff, or reviving the network after it goes off.

## Risks

- Catch-up edge: on an unsnoozed night where the off time was edited later after the warning, an HA restart between the old `off_at` and the new time cuts the network at the old time.

- Voice warning dropped by the script's own gates (time window, `speech_notifications`, `bedtime`). Mitigated by the push.
- Editing an off time to under 10 minutes from now, or a template reload after the warning time, skips that night's warning and snooze. Fails safe: the scheduled shutoff does not depend on the warning.
