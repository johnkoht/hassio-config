---
title: Kids WiFi Snooze
slug: kids-wifi-snooze
status: iterate-pending-john
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

- **Snoozed means `off_at > scheduled and now < off_at`.** That is the skip rule in `kids_wifi_off_on_schedule` and a condition on `kids_wifi_off_at`. Unsnoozed nights keep the single existing shutoff path, so an off-time edit after the warning still works and the two automations never double-fire. Test: edit to an earlier time inside the warning window; sabotage: drop the `off_at > scheduled` check.
- **Refused taps answer.** A tap after the shutoff, or a shorter one than the current snooze, sends a push with the same tag giving the reason (already off, or already snoozed until the stored time). The shutoff clears the warning push by tag.
- Compare times as timestamps (`state_attr(..., 'timestamp')` vs `now().timestamp()`); write helpers with `input_datetime.set_datetime` and `timestamp:`.
- School choice is therefore made at the original shutoff on unsnoozed nights; only a snoozed night is locked in at the warning.

## Decisions

**Warning.** `kids_wifi_off_warning`: offset time trigger (`at: {entity_id: <off helper>, offset: "-00:10:00"}`) on the weekday and weekend helpers, with the shutoff's own gates (schedule on, network on, helper set, school match for that helper). Fires only on nights the shutoff runs. No times in the repo. **Build gate:** the repo has only used `offset:` on timestamp sensors, never on an `input_datetime`. John must see the first warning in the Logbook; the fallback is a template timestamp sensor of `off - 10 min` (the pattern in `packages/school`).

**Voice.** `script.voice_announcement`, priority `high`, `expires_in: 5`, chime `school-bell-chime`, explicit speakers `media_player.sonos_playroom` and `media_player.sonos_family_room`. Not `auto`, which only reaches occupied rooms among the adult-heavy list and misses a kid's bedroom. `media_player.ninos_room` was dropped: it is not verified to exist or to take `announce`, and one bad entity can fail the whole call. Gianluca's room and Nino's room have no confirmed speaker, a BACKLOG item. **Known limitation (settled by the brief, flagged for John):** the script itself drops announcements before 06:00 / after 23:00, with `speech_notifications` off, or while `bedtime` is on, and the documented rule is not to duplicate or bypass these. The push still goes out. If John wants the kids' warning to ignore `bedtime`, that is a separate decision to route through the engine.

**Push.** With the warning, to John only (`devices: jk`), `time-sensitive`, tag `kids_wifi_off_warning`, `url: /dashboard-kohbo/home#kids_wifi`. Actions `KIDS_WIFI_SNOOZE_15` and `KIDS_WIFI_SNOOZE_30` (no `SNOOZE_`/`PAUSE_` prefix, so the camera handler ignores them). After a successful snooze a confirmation push replaces it (same tag), with the new time rendered at runtime.

**Options: 15 and 30 only.** John named 15 and 30 for the push; a 10-minute snooze is the same as the warning lead and barely moves anything. The script's field is a select of 15/30, so adding 10 later is one option and one button.

**Who can snooze.** John via push, or anyone on the dashboard. The popup already lets anyone there flip `switch.kids_enabled`, so no new exposure.

**School logic and hard limits.** The school-night choice is made at the original shutoff and not re-evaluated, so a snooze across midnight cannot flip to weekend logic. A snooze never reaches the morning on-time: off times must be before midnight and the maximum push is 30 minutes. Nothing here overrides school logic.

## Files (one automation per file, unique basenames)

New, in `packages/network/kids_wifi/`:
- `kids_wifi_snooze_helpers.yaml`: the two `input_datetime`s.
- `kids_wifi_snooze_sensors.yaml`: `binary_sensor.kids_wifi_snooze_available` (network on and `now() < off_at`) and `binary_sensor.kids_wifi_snoozed` (available and `off_at > scheduled`). They use `now()`, so they re-render once a minute only.
- `kids_wifi_off_warning.yaml`: warning automation.
- `kids_wifi_snooze_script.yaml`: `script.kids_wifi_snooze`, field `minutes` (select 15/30). Needs the available sensor on and a later target; sets `off_at`; sends the confirmation. Shared by the push handler and dashboard.
- `kids_wifi_snooze_action_handler.yaml`: routes the two action ids to the script.
- `kids_wifi_off_at.yaml`: trigger on `input_datetime.kids_wifi_off_at`, gated on schedule on, network on; turns the network off (the snooze path).
- `kids_wifi_off_catch_up.yaml`: on HA start, the one-hour catch-up described above. Known edge: a manual turn-on after the shutoff, followed by a restart inside that hour, gets cut again.

Changed:
- `kids_wifi_off_on_schedule.yaml`: skip when `off_at` is more than a minute in the future (a snooze is in force). Unset or past `off_at` does not block.
- `dashboards/kohbo/home/kids_wifi_popup.yaml`: a block shown when the available sensor is on: Snooze 15 and Snooze 30 buttons calling `script.kids_wifi_snooze`; when the snoozed sensor is on, a row showing the new shutoff time (`input_datetime.kids_wifi_off_at`).
- `docs/AUTOMATIONS.md` (Kids WiFi entry), `dashboards/kohbo/home/README.md` if it lists popup contents, `packages/network` LEARNINGS.

Both shutoff automations may fire at the same instant on an unsnoozed night; `switch.turn_off` is idempotent and the second run's "network on" gate fails.

## Tests (`tests/test_kids_wifi_snooze.py`)

- YAML parses; triggers as designed; warning uses offset `-00:10:00` on both helpers and the shutoff's gates.
- Off automation skips while snoozed (condition present and rendered with a Jinja harness for before, after and unset).
- Script harness: target is scheduled plus N; a shorter target is ignored; stale `off_at` is rejected.
- Push actions are `KIDS_WIFI_SNOOZE_15`/`_30`, none start with `SNOOZE_`/`PAUSE_`; the handler maps each to 15 and 30.
- Voice call uses `script.voice_announcement` and an explicit speaker list.
- New entities the popup uses are defined in the package; no `HH:MM` clock times in the new files or popup.
- `tests/test_notification_deep_links.py` stays green.
- Sabotage 1: remove the snooze-in-force condition from a scratch copy of the off automation; test goes red. Sabotage 2: remove the `now < off_at` gate from the script; red. Sabotage 3: remove the catch-up's one-hour bound; red.

## Hand steps for John after merge

Reload YAML for Input datetimes, Template entities, Scripts and Automations (Developer Tools, YAML). No restart. New helpers start unset. Watch the first warning night in the Logbook (offset trigger gate).

## Out of scope / BACKLOG

- A second warning when a snooze ends.
- Speakers in the kids' bedrooms.
- Snoozing earlier than 10 minutes before the shutoff, or reviving the network after it goes off.

## Risks

- Voice warning dropped by the script's own gates (time window, `speech_notifications`, `bedtime`). Mitigated by the push.
- Editing an off time to under 10 minutes from now skips that night's warning and snooze.
