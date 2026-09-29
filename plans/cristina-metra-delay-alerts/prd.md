# PRD: Cristina Metra Delay Alerts

## Goal

On office days, Cristina gets a time-sensitive push when Metra MD-N train 1 or train 2 is at least 5 minutes late or is cancelled at her station. The family morning update mentions it too. On-time trains produce nothing, and nothing depends on whether she's home.

## Context (read first)

- `plans/cristina-metra-delay-alerts/plan.md`: the approach, the sensor contract and the alert rules.
- `plans/cristina-metra-delay-alerts/pre-mortem.md`: Risks 1–10. Each mitigation is embedded in the task ACs below.
- `plans/cristina-metra-delay-alerts/working-memory.md`: read before each task and update after it.
- `CLAUDE.md` and `packages/CLAUDE.md`: modern syntax only; one automation per file; filename = id.
  - File headers are a title plus 1–3 lines. Put the reasoning in the commit.
  - The condition ladder goes global → room → feature.
- Existing patterns:
  - `packages/people/cristina/commute/*.yaml` (these use legacy syntax; **don't copy the syntax**, and don't modify these files).
  - `packages/general_notifications.yaml`: `script.general_notification` fields are `title`, `message`, `devices`, `priority`, `tag`. `script.clear_notifications` takes `devices` and `tag`.
  - `packages/reminders/morning_update.yaml`.

**Constraints from memory:**
- No `initial:` on helpers, and no `initial_state` on automations.
- New filenames must be unique repo-wide, because `!include_dir_named` keys packages by basename.
- Never restart HA, and never run `deploy.sh --check`. John deploys.
- Spawn subagents only after entering the worktree.

**Dev assets** live in the session scratchpad `/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/9639cd8c-c4c5-4bc7-ad84-806e0d26c71f/scratchpad/metra/`:
- the captured feed, `rt/tripupdates.pb` (2026-09-28 19:06 CDT);
- a venv with `gtfs-realtime-bindings`, `rt/.venv`, for a dev-only cross-check;
- the static schedule, `stop_times.txt`.

## Tasks

### Task 1: Metra feed script and tests

**Files:** `bin/metra_train.py`, `tests/test_metra_train.py`, `tests/fixtures/metra_tripupdates.pb`

A standard-library-only Python 3 script. `python3 bin/metra_train.py <slot>` prints exactly one JSON object for slot `1` or `2`, where the trip fragment and stop for each slot come from secrets (`metra_trains`, `metra_stop`).

**Acceptance Criteria**

1. **Standard library only.** It imports only stdlib modules (no `google.protobuf`, no `yaml`). `grep -E "^(import|from)" bin/metra_train.py` lists stdlib modules only.
2. **Token and config handling:**
   - It reads the token from the `metra_api_token:` line, and the train/stop config from `metra_trains:` / `metra_stop:`, in `/config/secrets.yaml`, or from the path in env `METRA_SECRETS` for tests. Surrounding quotes and whitespace are stripped, via one shared line parser.
   - `metra_trains` is a comma-separated `<trip_id_fragment>@<HH:MM>` list; slot 1 is the first entry, slot 2 is the second. Missing or malformed config → `no_data` / `missing_config`.
   - It fetches `https://gtfspublic.metrarr.com/gtfs/public/tripupdates?api_token=<token>` with an 8 s timeout.
3. **Decoder.** A hand-rolled protobuf wire decoder using these field numbers:
   - `FeedMessage`: header=1, entity=2. `FeedHeader`: timestamp=3.
   - `FeedEntity`: trip_update=3.
   - `TripUpdate`: trip=1, stop_time_update=2, vehicle=3.
   - `TripDescriptor`: trip_id=1, schedule_relationship=4.
   - `StopTimeUpdate`: arrival=2, departure=3, stop_id=4, schedule_relationship=5.
   - `StopTimeEvent`: time=2.
   - `VehicleDescriptor`: label=2.
   - Unknown fields are skipped for wire types 0, 1, 2 and 5.
4. **Matching.** A train matches when its trip_id contains `_<fragment>_` (any variant suffix), where `<fragment>` is that slot's configured trip_id fragment. The prediction is the configured stop's `arrival.time`, falling back to `departure.time`.
5. **Scheduled times** come from the `metra_trains` config, not hard-coded constants. `scheduled_departure` is today's date at that time in `ZoneInfo("America/Chicago")`.
6. **Delay.** `delay = math.floor((predicted − scheduled).total_seconds()/60 + 0.5)`. Tests check −93 s → −2, +90 s → 2, +150 s → 3, and −90 s → −1.
7. **Output keys** are exactly `delay`, `status`, `scheduled_departure`, `expected_departure`, `last_update` and `error`.
   - Timestamps are ISO 8601 with offset. `last_update` comes from the feed header timestamp.
   - **on_time:** delay < 5, `error: null`.
   - **delayed:** delay ≥ 5.
   - **cancelled:** the trip's `schedule_relationship` is `CANCELED` (3), or the configured stop's `schedule_relationship` is `SKIPPED` (1). Output `delay: 0`, `expected_departure: null`.
   - **no_data:** `delay: null`, `expected_departure: null`, and `error` is one of `outside_window`, `missing_config`, `missing_token`, `http_<code>`, `timeout`, `decode`, `not_in_feed` or `bad_args` (missing/invalid slot argument).
8. **Window.** Outside 06:45–09:00 America/Chicago it returns `no_data` / `outside_window` **without any network call**. The clock can be injected for tests, e.g. env `METRA_NOW` in ISO format.
9. **Failure handling:**
   - It always exits 0 and prints valid JSON.
   - A top-level `except Exception` maps to `no_data`.
   - Neither the token nor the URL ever appears on stdout or stderr.
10. **Fixture.** `tests/fixtures/metra_tripupdates.pb` is the scratchpad capture, copied byte-for-byte.
    - The test decodes 52 entities.
    - It finds a known evening fixture trip (vehicle label `2152`) at a downstream stop on that trip, at a fixed epoch.
    - Computing the delay against that stop's scheduled time gives −2. Use a test helper that parameterises train, stop and scheduled time, so the fixture test doesn't depend on any of the real config's fragments or times.
11. **Test cases** in `tests/test_metra_train.py` (pytest, stdlib-only helpers):
    - the rounding edges;
    - train not in feed → `not_in_feed`;
    - a synthetic CANCELED trip and a synthetic SKIPPED stop, encoded with a small test-side protobuf encoder → `cancelled`;
    - outside window with a patched `urlopen` that asserts it's never called;
    - missing config (no secrets file, and a missing/malformed `metra_trains`);
    - missing token;
    - HTTP 401;
    - timeout;
    - garbage bytes → `decode`;
    - the token string absent from all outputs;
    - a DST-transition date (2026-11-02) giving correct offsets.
12. **Dev-only cross-check.** Decode the fixture once with `rt/.venv` `gtfs-realtime-bindings` and confirm the train, stop and time tuples match the hand decoder for all MD-N entities. Record the result in working-memory; this is not a test dependency.
13. `python3 -m pytest tests/test_metra_train.py` passes, using a venv if needed.

### Task 2: Metra sensors package

**Files:** `packages/transit/metra_trains.yaml`, `secrets.fake.yaml`

**Acceptance Criteria**

1. A modern-format `command_line:` block defines two sensors:
   - names "Metra Train 1" and "Metra Train 2", so the entity IDs are `sensor.metra_train_1` and `sensor.metra_train_2`;
   - unique_ids `metra_train_1` and `metra_train_2`;
   - `command: python3 /config/bin/metra_train.py <slot>`;
   - `scan_interval: 60`, `command_timeout: 15`, `unit_of_measurement: min`;
   - `availability: "{{ value_json.delay is number }}"` and `value_template: "{{ value_json.delay }}"`. HA's command_line renders value_template to a string, so returning `none` would produce `"None"`, which a `min` sensor rejects. With no data the sensor is `unavailable`, and its attributes are hidden;
   - `json_attributes: [status, scheduled_departure, expected_departure, last_update, error]`.
2. The file has a 1–3 line header comment, and the basename is unique repo-wide (`find . -name "metra_trains.yaml"` returns one path).
3. `secrets.fake.yaml` gains `metra_api_token`, `metra_trains` and `metra_stop` placeholders. The real `secrets.yaml` is not touched.
4. `yamllint -c .yamllint packages/transit/` passes.

### Task 3: Office-day helper and resets

**Files:** `packages/people/cristina/commute/cristina_office_day_boolean.yaml`, `cristina_office_day_reset.yaml`, `cristina_train_alert_reset.yaml`

**Acceptance Criteria**

1. `input_boolean.cristina_office_day` ("Cristina Office Day", `mdi:office-building`), with **no `initial:`**.
2. The same file defines `input_number.cristina_train_1_notified_delay` and `input_number.cristina_train_2_notified_delay`:
   - min −1, max 999, step 1, `mode: box`;
   - **no `initial:`**;
   - comment: −1 = none pushed, 999 = cancellation pushed.
3. The `cristina_office_day_reset` automation, at 03:00:
   - turns the boolean on if `binary_sensor.workday_sensor` is `on`;
   - otherwise turns it off.
   Before writing it, confirm `binary_sensor.workday_sensor` is used by live automations (it's referenced at `automation/people/cristina/cristina_arrived_work.yaml`).
4. The `cristina_train_alert_reset` automation sets both helpers to −1 at **03:00 and 06:40**.
5. Modern syntax, `mode: single`, and no `initial_state` in any new file.

### Task 4: Dashboard toggle

**Files:** `dashboards/templates/button_cards/people/cristina.yaml`

**Acceptance Criteria**

1. `input_boolean.cristina_office_day` is added as a row in the existing `entities` card, directly after the `input_boolean.cristina_commuting` row (around line 85), using that row's style.
2. Its display name is "Office Day".
3. No other card changes.

### Task 5: Delay alert automation

**Files:** `packages/people/cristina/commute/cristina_train_delay_alert.yaml`

**Acceptance Criteria**

1. **Triggers** (pre-mortem Risk 5): state triggers on `sensor.metra_train_1` and `sensor.metra_train_2`, one without `attribute:` (the delay) and one with `attribute: status`, per train.
   - Nothing triggers on `last_update`.
   - Each trigger has an `id` of `"1"` or `"2"`, so the action knows which train fired.
2. `mode: queued`.
3. **Conditions, in order:**
   - `input_boolean.cristina_office_day` is `on`.
   - A template with `alias:` checks the train hasn't left: now is before `as_datetime(expected_departure)` when that's set, or before `scheduled_departure` when the status is `cancelled`. Null-safe: a missing datetime → false.
4. There is no home, zone or person condition.
5. **Action**, a `choose` over status and delay, using the helper `input_number.cristina_train_<slot>_notified_delay` (h):
   - **status `no_data`, or state `unknown` / `unavailable`:** do nothing (Risk 1).
   - **cancelled and h ≠ 999:** push "🚫 Your {{ sched_hm }} train is cancelled.", then set h = 999.
   - **delay ≥ 5 and (h == −1 or |delay − h| ≥ 5):** push "🚆 Your {{ sched_hm }} train is running <N> min late — now ~{{ exp_hm }}.", then set h = delay.
   - **status `on_time` with a numeric delay < 5 and h ≠ −1:** `script.clear_notifications` (`devices: cfalb`, `tag: metra-<slot>`), then set h = −1.
   - **otherwise:** nothing.
6. **Pushes** use `script.general_notification` with `devices: "cfalb"`, `priority: "time-sensitive"`, `tag: "metra-<slot>"` and title "Metra".
7. The helper is written **only** in those branches, never from `trigger.from_state`.
8. Every template condition and choose branch has an `alias:`. The file header is 1–3 lines.

### Task 6: Morning update hook

**Files:** `packages/reminders/morning_update.yaml`

**Acceptance Criteria**

1. **Tuesday–Thursday swap.** The `{% if now().strftime('%A') in ['Tuesday','Wednesday', "Thursday"] %}` umbrella block condition is replaced with `{% if is_state('input_boolean.cristina_office_day', 'on') %}`. The inner text is unchanged.
2. **New `### CRISTINA'S TRAIN` section**, inserted before `### BIRTHDAYS`, loops over `['1', '2']`. Each train renders a line only when all of these hold:
   - the office day is on;
   - `state_attr(sensor, 'status')` is in `['delayed', 'cancelled']`;
   - now is before the expected departure (delayed) or the scheduled departure (cancelled).
   Example lines: "Cristina's <scheduled time> train is running 12 minutes late, now expected around <new time>." / "Cristina's <scheduled time> train is cancelled."
   With no qualifying train, the section renders nothing beyond its heading, plus an instruction to mention the train only if a line is present.
3. **Null-safe** (Risk 8): every `state_attr` is guarded with `| default(none)` / `is not none` before `as_datetime`. With the sensors missing entirely, the prompt still renders.
4. **Rendering check.** The full prompt template renders without error in four cases, using a Jinja harness or Developer Tools on the Yellow:
   - (a) sensors missing;
   - (b) both on time;
   - (c) train 1 delayed 12;
   - (d) train 2 cancelled.
   The train text appears only in (c) and (d). Record the harness output in working-memory.

### Task 7: Verification and deploy handoff

**Files:** `plans/cristina-metra-delay-alerts/build-log.md` (notes only)

**Acceptance Criteria**

1. **Local checks pass:**
   - `yamllint -c .yamllint .`;
   - `tests/run_tests.py --quick` (or the equivalent pytest), including the new script tests;
   - no new modern-syntax or duplicate-filename failures attributable to new files.
2. **Alert logic walked against Task 5 rules.** A reviewer walks a fake-state matrix and records the expected outcome per row:
   - first ≥ 5 pushes;
   - +3 doesn't re-push;
   - +5 re-pushes;
   - 20 → 12 re-pushes;
   - drop to 3 (on_time) clears;
   - cancelled pushes once, and a second cancelled update doesn't;
   - delayed → unknown → delayed pushes once in total;
   - an attribute-only `last_update` change doesn't trigger;
   - office day off sends nothing;
   - after departure sends nothing.
3. **Deploy checklist for John** goes in the ship report:
   - merge and push;
   - add `metra_api_token`, `metra_trains` and `metra_stop` to `/homeassistant/secrets.yaml` on the Yellow;
   - deploy without `--check`;
   - `ls /homeassistant/bin/metra_train.py`;
   - `docker exec homeassistant python3 /config/bin/metra_train.py 1`;
   - reload `command_line` / `input_boolean` / `input_number` / automations / scripts. A restart may be needed once for the first `command_line` load (Risk 6), and that restart is John's call;
   - the Developer Tools fake-state matrix;
   - the first live weekday morning.
