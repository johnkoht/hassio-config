---
title: Cristina Metra Delay Alerts
slug: cristina-metra-delay-alerts
status: shipped
created: 2026-09-28
has_pre_mortem: true
has_review: true
has_prd: true
---

# Cristina Metra Delay Alerts

## Problem

Cristina takes the Metra MD-N from her station to Union Station on office days, on either train 1 or train 2. Nothing in the house tells her when her train is late or cancelled, so she finds out on the platform. The repo has no transit data. Nothing records whether a given weekday is an office day. The only commute signal in the morning update is a hard-coded Tuesday–Thursday block, which no longer matches her Monday–Friday schedule.

## Goal

On office days, Cristina gets a push when train 1 or train 2 is at least 5 minutes late or is cancelled. The family morning update mentions it too. When the trains are on time, nothing is said anywhere. The alert does not depend on whether she's home.

## Approach

### Verified feed facts (curl, 2026-09-28)

- **Endpoint and auth:** `https://gtfspublic.metrarr.com/gtfs/public/tripupdates?api_token=…` returns GTFS-RT protobuf (about 14 KB covering the whole network).
- **No delay field:** `stop_time_update` carries only an absolute `arrival.time`. There is no `delay` field, and `departure.time` is essentially never set. So **delay = predicted arrival − scheduled time**.
- **Trip IDs match the static schedule** (`MD-N_MN2152_V3_D`), and `vehicle.label` is the train number. We match on a configured trip_id fragment per train (see the sensor contract below) and ignore the service-variant suffix.
- **Trains only appear once they're running.** Each of her two trains starts showing a prediction only once it's actually running; before that, the sensor has no prediction.
- **Scheduled times** are read from configuration (secrets), not hard-coded, since the feed carries no delay field of its own to fall back on.
- **The `/alerts` feed** currently holds only MD-N construction notices, so it stays out of scope.

### Data layer: a script in the repo, run by a `command_line` sensor

- **Rejected alternatives:**
  - `custom_components/` is gitignored and not touched by `deploy.sh`, so it has no deploy path.
  - Metra-Tracker (HACS):
    - It drops a train at its *scheduled* time, so a late train disappears exactly when it was supposed to leave.
    - It reads the `delay` field the feed doesn't send.
    - It has no cancellation handling and no way to watch a specific train.
    - It loads the full static schedule into memory (about 358 MB measured on a Mac).
  - ha-sb-metra is two weeks old and has a single author.
- **Script location:** `bin/metra_train.py`, tracked in git. `deploy.sh` pulls it onto the Yellow, where the container sees it as `/config/bin/metra_train.py`.
- **Invocation:** `python3 /config/bin/metra_train.py <slot>` prints one JSON object on stdout, where `<slot>` is `1` or `2`.
- **Decoder:** the script decodes the protobuf wire format itself, using only the standard library.
  - The Yellow's HA container has protobuf 6.32.0 on Python 3.14.6.
  - The current `gtfs-realtime-bindings` code needs protobuf 7.34 or newer.
  - A self-contained decoder has no dependency, so it survives HA upgrades.
- **Token and config:** the script reads `metra_api_token`, `metra_trains` and `metra_stop` from `/config/secrets.yaml`, because `!secret` can't be spliced into a command string. `metra_trains` is a comma-separated `<trip_id_fragment>@<HH:MM>` list (slot 1 = first entry, slot 2 = second), so which trains and times it watches is configuration, not code. The token is never printed or logged, and error output is scrubbed of the URL.
- **Polling window:** 06:45–09:00 local time. Outside the window the script returns no-data at once, without any network call.
  - The window's close covers her later train delayed by roughly half an hour. It also covers the morning update, which can fire as late as about 08:50.
  - HA polls with `scan_interval: 60`, so each train gets one fetch per minute inside the window.

### Sensor contract

The sensors are `sensor.metra_train_1` and `sensor.metra_train_2`. They are defined in `packages/transit/metra_trains.yaml`, deliberately apart from Cristina's package because this is transit data, not person logic.

- **state:** delay in whole minutes, rounded, which can be negative when early. `unit_of_measurement: min`.
  - The state is `unavailable` when there's no prediction (outside the window, train not running yet, or fetch failed). The attributes, including `error`, are hidden while unavailable; run the script by hand to diagnose.
  - The state is `0` when `status` is `cancelled`.
- **attributes:**
  - `status`: `on_time`, `delayed` (≥ 5), `cancelled` or `no_data`. `cancelled` means the trip's `schedule_relationship` is `CANCELED`, or her station's stop is `SKIPPED`.
  - `scheduled_departure`: full ISO datetime for today, computed from the configured time in `metra_trains`.
  - `expected_departure`: full ISO datetime, or null when cancelled or no data.
  - `last_update`: the feed timestamp as an ISO datetime.

### Office-day signal

`input_boolean.cristina_office_day` has no `initial:`, so dashboard edits survive restarts. At 03:00 it is set to match `binary_sensor.workday_sensor`, the existing UI Workday integration. Cristina turns it off by hand on work-from-home days.

### Alert

`packages/people/cristina/commute/cristina_train_delay_alert.yaml` triggers on each sensor's state (the delay) and on its `status` attribute, so a flip to `cancelled` fires it but the per-minute `last_update` tick does not.

**Conditions, in order:**
- The office-day boolean is on.
- That train hasn't left yet: now is before `expected_departure`, or before `scheduled_departure` when it's cancelled.

There is no home or zone check, because she may have left early.

**Dedup:** each train has a helper, `input_number.cristina_train_1_notified_delay` and `…_train_2_…`. Its range is −1 to 999: −1 means nothing has been pushed, and 999 means a cancellation has been pushed. The helper is written only when a push is sent or cleared, never from `trigger.from_state`. A reset automation sets it back to −1 at 03:00 and again at 06:40, just before the polling window.

**Rules:**
- **Push** when the status is `cancelled` and the helper isn't 999. Also push when the delay is at least 5 and either the helper is −1 or |delay − helper| ≥ 5. That covers both a delay that grows (6 → 11) and one that shrinks but is still late (20 → 12); either gets one updated push.
- **Clear** when the delay drops below 5 and the helper isn't −1. This calls `script.clear_notifications` for that train's tag and resets the helper to −1. No "on time" message is sent.
- **Push delivery:** `script.general_notification` with `devices: cfalb`, `priority: time-sensitive` and tag `metra-<slot>`, so each new push replaces the last. Example: "🚆 Your {{ sched_hm }} train is running 12 min late — now ~{{ exp_hm }}." Or: "🚫 Your {{ sched_hm }} train is cancelled."

### Morning update

Add a `### CRISTINA'S TRAIN` block to the prompt in `packages/reminders/morning_update.yaml`.

**It renders only when** the office day is on and a train's status is `delayed` or `cancelled`, and that train hasn't left yet. On-time trains, or trains without data, give the model no text, so it can't mention them. The block also tells the model to mention the train only when that data is present.

## Tasks

1. **Feed decoder script.** Write `bin/metra_train.py`: token and config read from secrets, fetch, wire-format decoder, match train and stop (both from config), cancellation detection, window gating, and JSON output exactly as in the contract.
   - Save tonight's captured feed as a test fixture, `tests/fixtures/metra_tripupdates.pb`. It contains no secrets.
   - Add `tests/test_metra_train.py`, covering:
     - the delay calculation (a fixture trip predicted a couple minutes ahead of its scheduled stop time gives −2 after rounding; state the rounding rule);
     - no-data for a train that's missing;
     - a synthetic cancelled trip;
     - an outside-window run that makes no network call;
     - the token never appearing in any output.
2. **Metra sensors.** Add `packages/transit/metra_trains.yaml` with two `command_line` sensors (`scan_interval: 60`, `value_template` from `value_json.delay`, `json_attributes` for the rest, `command_timeout` about 15 s).
   - Add `metra_api_token`, `metra_trains` and `metra_stop` placeholders to `secrets.fake.yaml`.
3. **Office-day helper and reset.** Add `packages/people/cristina/commute/cristina_office_day_boolean.yaml`, which defines the office-day boolean and the two notified-delay `input_number`s.
   - Add `cristina_office_day_reset.yaml`, which at 03:00 syncs the boolean to `binary_sensor.workday_sensor` and resets both helpers to −1.
4. **Dashboard toggle.** Put `input_boolean.cristina_office_day` where Cristina will actually flip it. Candidates are `dashboards/templates/button_cards/people/cristina.yaml` and `dashboards/kohbo/more/people.yaml`; confirm with John during the build.
5. **Delay alert automation.** Add `cristina_train_delay_alert.yaml` following the rules above. Use modern syntax, one automation, `mode: queued` so the two trains' updates don't drop each other.
6. **Morning update hook.** Add the `### CRISTINA'S TRAIN` prompt block described above.
7. *(Related change, John's call.)* Replace the hard-coded Tuesday–Thursday umbrella block in the same prompt with `input_boolean.cristina_office_day`. It's a one-line change.
8. **Verification**
   - **Local checks:** `yamllint`, the `tests/` suite (including the new script tests) and `ha core check`.
   - **Script on the Yellow:** after John deploys, run `docker exec homeassistant python3 /config/bin/metra_train.py 1` to confirm the script works on the Yellow's Python.
   - **Reloads:** `command_line`, `input_boolean`, `input_number`, automations and scripts. No restart.
   - **Alert logic with fake states:** in Developer Tools → States, set fake states on the two sensors and helpers, then check each of these:
     - first push at 5 minutes late;
     - growth of less than 5 doesn't re-push;
     - growth of 5 or more re-pushes;
     - 20 → 12 re-pushes;
     - drop below 5 clears the notification;
     - cancelled pushes once;
     - an attribute-only `last_update` change doesn't re-push;
     - unknown → a number at the start of the window;
     - office day off sends nothing;
     - after departure sends nothing;
     - the rendered morning-update prompt text for a delayed train and an on-time train.
   - **Live morning (workday):** both sensors populate once each train starts running per the feed, and on-time trains send nothing.

**Deferred (backlog, not this plan)**

- Watch `calendar.kohbocal` for a "Cristina WFH" event and have the 03:00 reset honor it.
- MD-N service alerts from `/alerts`. They're currently construction noise and would need filtering.
- A stale-data safeguard: push John when the sensors are `no_data` on an office morning after 07:35. This protects against a silent miss; it was offered and not yet chosen.

**Deploy prerequisites (John)**

- Add `metra_api_token`, `metra_trains` and `metra_stop` to `/homeassistant/secrets.yaml` on the Yellow. They are currently only in the local copy.
- Deploy with `--skip-ci` or the normal flow. Never use `--check`, which deletes `secrets.yaml`.

## Risks

- **Silent miss:** a stale feed, a script error or a Metra outage all read as "nothing to say". Accepted for now, with the stale-data safeguard deferred. `status: no_data` makes the condition detectable later.
- **The hand-rolled decoder mis-parses a field.** Mitigation: the fixture tests run against a real captured feed, and the decoder reads only the handful of fields we need (trip_id, schedule_relationship, stop_id, arrival.time, vehicle.label). Unknown fields are skipped by wire type.
- **Metra changes a train's schedule.** Then the delay is computed against the wrong time. Mitigation: the times live in secrets (`metra_trains`), not hard-coded, so updating them is a config edit, not a code change.
- **She's already on train 1 and train 2 is late**, so she gets an irrelevant push. Accepted; boarding detection isn't reliable.
- **Forgotten WFH toggle, or the workday sensor missing a company holiday**, means a push on a home day. Low cost, and the calendar follow-up addresses it.
- **The `command_line` sensor runs every 60 s all day**, and outside the window it exits without a network call. The cost is negligible.
- **The entity-reference tests may flag the new entity IDs** before they exist in the registry. Confirm how `tests/test_entity_references.py` treats entities defined in the repo, and adjust if needed; don't skip it.
- **Existing commute files use legacy syntax.** They aren't touched. The pre-existing self-disable ID mismatch on Cristina's station-arrival automation is a separate hotfix, out of scope here.

On approval → /approve → /ship cristina-metra-delay-alerts
