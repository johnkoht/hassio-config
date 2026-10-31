---
title: Freezing Night Car Reminder
slug: freezing-night-car-reminder
status: shipped
created: 2026-10-29
has_pre_mortem: false
has_review: false
has_prd: false
---

# Freezing Night Car Reminder

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

Linear JK-1083 (High): "Reminder to put car in garage if it's cold and overnight will be freezing."

## Problem

A car left in the driveway on a freezing night means ice on the glass and a cold start in the morning. Nothing in the house notices. The pieces exist (a forecast, cameras that see cars, a notification script) but nothing joins them.

## Goal

On an evening when the overnight low is at or below a tunable threshold and a car is detected outside, send one push reminder to put it in the garage. It stays quiet when nobody is home, the house is in bedtime, or the reminder already went out tonight. Protection first: this is a nudge, not a car-state dashboard.

## What the house knows today (verified read-only on the live host, 2026-10-29)

**There is no reliable "car is in the garage" signal.** What exists:

- `sensor.audi_presence` and `sensor.bmw_presence`: `mqtt_room` BLE sensors from `packages/vehicles/{audi,bmw}/`. States are a room name or `not_home`, with a `distance` attribute. `sensor.audi_location` and `sensor.bmw_location` map that to Not Home / Driveway / Garage (distance over 8 = Driveway). `input_boolean.audi_home` and `input_boolean.bmw_home` are derived. Both presence sensors read `not_home` with `distance: None` right now, and both flipped at the same instant as the last HA restart. That pattern looks like a sensor that reset on restart and has not heard a BLE packet since, not two cars that left together. I could not confirm either way: the history API returned nothing for these entities, and they have no `unique_id`. Treat the BLE legs as unproven until Task 1.
- Camera car detections from the Frigate-style integration: `binary_sensor.garage_driveway_car_occupancy`, `binary_sensor.driveway_front_car_occupancy`, `binary_sensor.driveway_car_occupancy`, `binary_sensor.front_door_car_occupancy`, plus per-camera `sensor.*_car_count` and `sensor.*_car_active_count` (all currently off/0). This is a positive "a car is outside" signal and needs no car identity.
- Garage doors: `cover.garage_door_1`, `_2`, `_3` and the group `cover.garage_doors` (all closed). `binary_sensor.garage_ble_occupancy` is people, not cars. There is no bay sensor and no car-in-bay camera zone.
- No vehicle integration, no car `device_tracker`. The only trackers are network devices and `person.*`.

**Proxy accepted (John, 2026-10-30):** John accepts the camera-only signal and the risk of an occasional miss ("the cameras are pretty good at seeing the cars"). Invert the question. Detect "a car is outside" with the driveway camera car-occupancy sensors (any on, sustained), optionally OR'd with the BLE legs once proven. Failure modes: a visitor's or neighbor's car trips it (a false reminder, harmless), a parked car the camera misses at night (a silent miss), and BLE sensors that go stale and say `not_home` (a silent miss, so never use "not in garage" as the trigger).

**Forecast sources:**

- `weather.pirateweather`: `supported_features: 7`, so hourly, daily and twice_daily all work. Units are degF. Primary source.
- `weather.kpwk` (NWS): `supported_features: 6`, hourly and twice_daily only, no `daily`. Hourly fallback.
- `weather.tomorrow_io_home_daily` and `weather.forecast_home`: `supported_features: 3`, daily plus hourly. Possible second fallback, not needed for v1.
- `weather.get_forecasts` is registered on the host. `sensor.pirateweather_hourly_forecast` only holds the next 20 hours and polls the API every minute, so don't build on it. Call the service directly in a trigger-based template.

**Notifications:** `script.general_notification` (`devices: all` maps to `notify.ios_family`; priorities active, passive, time-sensitive, critical; supports `actions:` and `tag:`). `script.voice_announcement` exists but `input_boolean.quiet_mode` (on now) and `input_select.house` = Bedtime are the right gates. House flags: `input_boolean.house_occupied`, `input_boolean.bedtime`, `input_boolean.speech_notifications`, `input_boolean.quiet_mode`.

**Which car, whose phone:** the camera path cannot say which car, so the message is generic ("A car is parked outside"). Whose phone: everyone (`devices: all`), since either adult can move a car. If the BLE legs prove out, the message can name the car; that is polish. No new notify targets are needed.

## Approach

Three small pieces, one job each, in a new `packages/vehicles/freezing_car/` directory. Filenames are unique across the whole `packages/` tree, because `!include_dir_named` keys by basename.

1. **Freezing forecast sensor** (trigger-based template, `freezing_car_forecast.yaml`). Triggers: hourly at minute 5, HA start, and `event_template_reloaded`. Action: `weather.get_forecasts` (hourly) on `weather.pirateweather`, with `continue_on_error`, and a fallback to `weather.kpwk` if the response is empty. Sensor `sensor.overnight_low_forecast` is the minimum `temperature` between now and 08:00 local; datetimes come back in UTC, so convert with `as_local`. A binary sensor `binary_sensor.freezing_night_expected` is on when that minimum is at or below `input_number.freezing_car_threshold`. It is unavailable, never on, when no forecast came back. Mirror the guard from the cadence note: trigger-based, no live templates.
2. **Car-outside sensor** (`car_outside.yaml`): `binary_sensor.car_outside`. Updated 2026-10-30: the Frigate `*_occupancy` sensors never fire (Frigate MQTT points at the wrong broker, JK-1234), so the signal is the UniFi Protect `binary_sensor.driveway_front_camera_vehicle_detected` and `binary_sensor.garage_driveway_vehicle_detected`. Protect detections are momentary, so a `delay_on` cannot work; instead a trigger-based binary sensor latches on at a detection and clears when `cover.garage_doors` closes or at 08:00. The BLE legs are left out of v1 (see Open decisions).
3. **Reminder automation** (`freezing_car_reminder.yaml`, id `freezing_car_reminder`). Triggers: a time trigger at `input_datetime.freezing_car_reminder_time`, and `binary_sensor.car_outside` turning on (covers a car that arrives after the reminder time). Conditions, global to feature: `house_occupied` on, `bedtime` off, `input_select.house` not Bedtime, `input_boolean.freezing_car_reminder` on, `binary_sensor.freezing_night_expected` on, `binary_sensor.car_outside` on, and a don't-repeat-tonight guard (`this.attributes.last_triggered` more than 12 hours ago or null). Because the forecast and car checks are conditions rather than in the action body, `last_triggered` only moves when a reminder really goes out. Action: `script.general_notification`, priority `time-sensitive` (John, 2026-10-30: it must break through iOS "Important" focus), tag `freezing-car`, url to the driveway camera popup, title "Freezing tonight", message with the forecast low, and a "Got it" action that is not waited on (the guard already prevents repeats).

Helpers (`freezing_car_helpers.yaml`), none with `initial:` so dashboard edits survive restarts (the `initial:` memory note):

- `input_number.freezing_car_threshold`, degF, min 28, max 40, step 1. With no `initial:` it comes up at the minimum, 28, until John sets it (suggest 34). That default errs toward fewer reminders, which is the safe direction for a nudge.
- `input_datetime.freezing_car_reminder_time` (time only). Unset reads midnight, so the time trigger would fire at 00:00 and be stopped by the bedtime gate. Task 4 sets 20:00 once through the UI.
- `input_boolean.freezing_car_reminder`, the feature switch.

Lighter version considered and rejected: one automation that fetches the forecast inline. It is fewer files, but it moves `last_triggered` on every non-reminder run, which breaks the don't-repeat guard and makes the forecast untestable on its own.

## Tasks

1. Spike, read-only, no repo edits — confirm the signal: from the host logbook or a Frigate view, check that the driveway car-occupancy sensors actually turn on when a car is parked outside overnight. The BLE sensors are out of v1 (John, 2026-10-30), so they need no check. Write the result into the PR for the build.
2. Forecast sensors — `freezing_car_forecast.yaml` with `sensor.overnight_low_forecast` and `binary_sensor.freezing_night_expected`, trigger-based, primary pirateweather, fallback kpwk.
3. Car-outside sensor — `car_outside.yaml` with `delay_on: 10 minutes`.
4. Helpers — `freezing_car_helpers.yaml` as above. After deploy, John sets the threshold and the reminder time once in the UI.
5. Reminder automation — `freezing_car_reminder.yaml` following the one-automation-per-file header and condition-ordering rules in `CLAUDE.md`.
6. Tests — `tests/test_freezing_car_reminder.py`, same style as `tests/test_door_left_open_realert.py` (load the YAML, render the templates with real Jinja2):
   - overnight low takes the minimum across a UTC hourly list, honours the 08:00 local cutoff, and ignores hours already past;
   - an empty or errored forecast yields unavailable, not freezing;
   - threshold boundary: low equal to the threshold counts as freezing, one degree above does not;
   - fallback to the second entity when the first returns nothing;
   - automation conditions include the house-occupied, bedtime, enabled and freezing and car-outside gates, with `last_triggered` null passing and 11 hours ago blocking;
   - the notification message renders when the trigger is a time trigger (no `from_state`), the failure from the door re-alert fix;
   - helper definitions carry no `initial:`;
   - the full existing suite still passes (entity references, duplicate basenames, modern syntax, schema).
7. Docs — add the feature to `docs/AUTOMATIONS.md`, note the car-outside signal and its limits in `docs/PRESENCE.md` (vehicles are covered there and in the packages), and add a short README line under `packages/vehicles/` describing the new directory. Add a `packages/vehicles/LEARNINGS.md` note only if the spike finds something surprising.
8. Deploy per repo rules: push first, then `./deploy.sh --reload --skip-ci`. Template entities are not reloaded by `--reload`; reload them from Developer Tools, YAML. Never a bare `--check` (it can delete `secrets.yaml`). Verify by reading `sensor.overnight_low_forecast` against the weather card, then temporarily set the threshold high to see the notification once.

## Open decisions

All resolved (John, 2026-10-30). John's answer: "I'm okay with the risk of missing it, but the cameras are pretty good at seeing the cars." That accepts decision 1's camera-only signal; the rest take the plan's defaults.

1. **Car-outside signal.** **Resolved (John, 2026-10-30):** driveway camera car-occupancy only. The BLE legs are out of v1; John accepts the risk of a missed reminder. The message stays generic ("A car is parked outside").
2. **Reminder channel.** **Resolved (John, 2026-10-30), by default:** push only.
3. **Trigger shape.** **Resolved (John, 2026-10-30), by default:** one fixed evening time (20:00) plus "car appears outside" (10 minutes sustained), one reminder per night; no snooze second nudge.
4. **Threshold.** **Resolved (John, 2026-10-30), by default:** 34 degF, set via the helper after deploy (the helper minimum is 28 if left unset).
5. **Forecast window.** **Resolved (John, 2026-10-30), by default:** hourly minimum from now until 08:00 local.
6. **Recipients.** **Resolved (John, 2026-10-30), by default:** `devices: all`.
7. **Fallback source.** **Resolved (John, 2026-10-30), by default:** `weather.kpwk` hourly.

## Risks

- **No true "in garage" signal.** The reminder fires on "a car is outside", so a missed detection means a silent miss. Mitigation: Task 1 spike; BLE is out of v1 and was never an exclusion; John accepted the camera-only risk (2026-10-30). The feature is protection-adjacent, not safety-critical.
- **False positives from visitor or neighbor cars.** Mitigation: 10 minute `delay_on` and one reminder per night; accept the rest.
- **Forecast failure.** Mitigation: `continue_on_error`, fallback entity, and unavailable (not on) when nothing comes back, so a broken API never produces a false alarm or a stuck "freezing" state.
- **Unset helpers after first deploy.** Mitigation: defaults err toward quiet; Task 4 sets them once. No `initial:` so the values survive restarts.
- **Template cadence.** Hourly trigger-based refresh, not a live template, so no load concern on the Yellow (see the live-templates note).
- **UTC vs local in forecast datetimes.** The classic bug; covered by the tests above.
- **Privacy.** No addresses, schedules, plates or VINs. The reminder time is a generic evening default; keep any real schedule in the UI, not the repo.
- **Entity names.** Everything listed above exists on the live host as of 2026-10-29; the new entities are created by this plan.

On approval → /approve → /ship freezing-night-car-reminder
