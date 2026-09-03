---
title: Kid At-School Detection
slug: kid-at-school-detection
status: in-progress
created: 2026-09-03
has_pre_mortem: true
has_review: true
has_prd: true
---

# Kid At-School Detection

## Problem

Nino's 13:00 medication dose announces over the Sonos every school day, when he is at school and nobody at home can act on it. The voice announcement only makes sense on weekends, no-school days, or days he is home sick. The school package already knows the first two, but nothing in the house knows whether a kid actually left for school on a given morning.

## Goal

A per-kid `binary_sensor.<kid>_at_school` that is on only when there is positive evidence the kid left for school and it is still school hours. The Nino dose-2 voice announcement is gated on it. Push notifications, escalation, and the dose-1 flow are unchanged. Gianluca gets the helpers, latch, and sensor so a future consumer has them, but no ping and no chip until something reads the sensor.

## Approach

Layer on the existing `packages/school/` derivation rather than inferring from adults' presence. "At school" requires positive evidence: the kid's school-day sensor is on, now is inside the bell window, `home_today` is off, and `dropped_off` was latched today. Silence is the thing that has to be earned. Every failure of the derivation chain, an unavailable sensor, a missed zone, a reload mid-wait, an ignored push, lands on "announce," which is the safe direction for a medication cue.

`dropped_off` latches two ways. Automatically, when John or Cristina sits in the school zone for 3 minutes around drop-off time. Manually, from an actionable push. On a school day where nothing latched by drop-off plus 30 minutes and `home_today` is off, John gets one time-sensitive push with two buttons: "At school" latches `dropped_off`, "Home today" turns on `home_today` and suppresses everything. Nonna's presence appears in the message as a hint only. Marking `home_today` in advance suppresses the ping entirely.

The push is fire-and-forget with static action IDs, and a separate always-listening handler automation turns the taps into helper writes, so a reload between send and tap cannot strand the response. This is the pattern in `camera_notification_action_handler.yaml`, not the inline `wait_for_trigger` the medication reminder uses.

The medication gate reads `{{ not is_state('binary_sensor.nino_at_school', 'on') }}` and applies only when the resolved dose is 2. Dose 1 stays exactly as it is, so editing its time can never couple it to the school schedule.

Zone triggers do not accept `for:`, so the latch uses a template trigger over the zone's `persons` attribute with a 3-minute hold. Gianluca's window anchors on `input_datetime.parochial_school_departure_time`, which his schedule file deliberately decouples from start time.

Alternatives rejected: default-on "at school" with the toggle as the only override (six silent paths end in a silenced sick-day dose); reusing `input_boolean.school_day_override_off` for sick days (house-wide, silences the other kid's reminders); inferring "Nonna drove him" from her arriving early and leaving (indistinguishable from a normal visit); a bounding-box template instead of a zone (bypasses the zone system; one circle per school is in place).

## Tasks

1. **Per-kid helpers** — Add `input_boolean.nino_home_today`, `nino_dropped_off`, `gianluca_home_today`, `gianluca_dropped_off` to `packages/school/school_overrides.yaml` alongside the existing manual controls. No `initial:`. Add all four to the 23:58 reset in `school_overrides_reset.yaml` (no conditions, per the file header).
2. **Drop-off latch automations** — `packages/school/kids/nino_dropped_off.yaml` and `gianluca_dropped_off.yaml`. Template trigger: `person.john_koht` or `person.cristina_falbo` in `state_attr('zone.lyon_school', 'persons')` (Gianluca: `zone.olph_school`) with `for: "00:03:00"`. Conditions: kid school day on, latch off, now within a window of 45 minutes before to 20 minutes after `sensor.primary_school_start_time_today` (Gianluca: 20 before to 20 after `sensor.gianluca_departure_time`). Action: turn on `<kid>_dropped_off`.
3. **At-school sensors** — Add `binary_sensor.nino_at_school` to `packages/school/kids/nino_school.yaml` and `binary_sensor.gianluca_at_school` to `gianluca_school.yaml`. State is on only when all hold: school day on, `home_today` off, `dropped_off` on with `last_changed` today, and now between the band's start-time and dismissal-time sensors. NO `availability:` block. Use `is_state()` everywhere; an unavailable input reads as off.
4. **No-drop-off ping (Nino only)** — `packages/school/kids/nino_dropoff_check.yaml`. Trigger at `sensor.nino_dropoff_check_time` (a timestamp template sensor in `nino_school.yaml`, start time plus 30 minutes, available only on school days). Conditions: school day on, `dropped_off` off, `home_today` off. Send via `script.general_notification`, `devices: jk`, `priority: time-sensitive`, tag `nino-dropoff-check`, two actions with static IDs `NINO_AT_SCHOOL` and `NINO_HOME_TODAY`, message includes whether Nonna is home from `binary_sensor.nonna_presence`.
5. **Ping action handler** — `packages/school/kids/nino_dropoff_check_handler.yaml`. Always-listening automation on `mobile_app_notification_action` for the two static IDs. `NINO_AT_SCHOOL` turns on `nino_dropped_off`; `NINO_HOME_TODAY` turns on `nino_home_today`. Follows `camera_notification_action_handler.yaml`.
6. **Medication gate** — In `nino_medication_reminder.yaml`, extend the voice-announcement `if:` with a second condition: `{{ not (dose | string == '2' and is_state('binary_sensor.nino_at_school', 'on')) }}`. Leave the conditions ladder, timer, push, and escalation untouched.
7. **Dashboard** — On `dashboards/kohbo/school/school.yaml` add a "Nino Home" chip bound to `nino_home_today` with a toggle tap action, always visible, so a sick day can be marked before any ping (verify `kohbo_chip_card` accepts a `tap_action` override; if not, use an entities row under the kid cards). In `school_settings_popup.yaml` add a "Today" block per kid in the Overrides area showing `home_today`, `dropped_off`, and `at_school`. No Gianluca chip.
8. **Validate** — `ha core check` via the fake secrets path. Confirm `zone.lyon_school` and `zone.olph_school` exist on the live instance (they are UI-defined, not in the repo) and that `automation.school_overrides_reset` has a recent `last_triggered`. Reload `input_boolean`, template entities, and automations. No restart.

## Risks

- **Silence direction**: every derivation failure (unavailable sensor, missed zone, reload mid-ping, ignored push, wrong calendar) leaves `at_school` off and the dose announces. Accepted as the safe direction. The cost is an announcement to an empty house on days nobody latched and nobody tapped.
- **Zone flapping resets the 3-minute hold**: GPS drift in a stationary car can leave and re-enter the circle. Mitigation: the window is wide enough for a second attempt; a miss only means one push, never a silenced dose.
- **Zones live in UI storage**: `ha core check` cannot validate `zone.lyon_school` or `zone.olph_school`. A typo means the latch never fires and the ping fires every school day. Mitigation: Task 8 verifies both entity IDs on the live instance before merge.
- **Nightly reset disabled**: a disabled automation stays disabled silently. Mitigation: the sensor requires `dropped_off` to have changed today, so a stale latch reads as not dropped off; Task 8 checks `last_triggered`.
- **Late-start Wednesdays shift the window**: handled, `primary_school_start_time_today` already swaps to the late-start input, and the check time derives from it.
- **Person state changes to the zone name while in the zone**: nothing in automations checks literal `not_home` for John or Cristina, and the people cards already render zone names.
- **Ping fatigue on Nonna-drives-him days**: one push per such morning, two taps to answer. If it becomes daily, the fix is a future Nonna-based inference, deliberately out of v1.
- **Push snooze loop and 15:00 escalation still run on school days**: out of scope, push behaviour is unchanged by request. Backlog.

On approval → /approve → /ship kid-at-school-detection
