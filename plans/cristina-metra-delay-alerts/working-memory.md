# Working Memory — cristina-metra-delay-alerts

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*
- [Task 2] `is number` is a native Jinja2 built-in test (not an HA custom one) — confirmed safe to use verbatim in the AC1 value_template exactly as specified; no fallback needed.
- [Task 2] No existing `command_line:` sensor package in this repo yet — `packages/transit/` is a new directory, first user of the modern `command_line:` list-of-`- sensor:` schema here.
- [Task 3] `packages/people/cristina/commute/*.yaml` legacy files confirmed `binary_sensor.workday_sensor` is live (used in `automation/people/cristina/cristina_arrived_work.yaml` condition) — safe to reuse in the new office-day reset per PRD Task 3 AC3.
- [Task 3] Modern if/then/else pattern reference: `packages/office/lights/office_lights_sync_switch_state.yaml`. Modern multi-target `input_number.set_value` reference: `packages/climate/main_floor/main_floor_climate_to_eco.yaml` (adapted to a `target:` block with two entity_ids for the reset).
- [Task 5] `trigger.id` is directly usable as the slot number inside both the automation's top-level template `conditions:` (before any action `variables:` exist) and inside the action's own `variables:` block — no need to parse it out of `trigger.entity_id`. Both the bare state trigger and the `attribute: status` trigger share the same `id: "1"`/`"2"`, so a single `{{ trigger.id }}` covers whichever fired.
- [Task 5] When the sensor goes `unavailable`, `state_attr(sensor, 'status')`/`expected_departure`/`scheduled_departure` are all `None` (attributes hidden per the Decision Ledger contract). The "Train hasn't left yet" condition therefore evaluates **False** for an unavailable sensor (both the cancelled-branch and non-cancelled-branch null checks fail), so the automation never reaches the action at all — it's blocked at the condition ladder, not inside the `choose`. This is behaviorally identical to hitting the choose's "No data" branch (no push/clear/write either way), so Risk 1 still holds; the `choose`'s explicit "No data" check is defense-in-depth for a live-state race under `mode: queued` (state can drift between condition-pass and action-execution), not dead code.
- [Task 5] Verified the full alert-logic Jinja (the "hasn't left" condition + the 4 choose-branch conditions, copied verbatim into a harness) against the Task 5/7 fake-state matrix using jinja2 in the test venv with stubbed `states`/`state_attr`/`as_datetime`/`now`/`is_state` and `int`/`abs` filters. All 13 rows matched the expected branch:

  ```
  1. first delay 6 (h=-1)                                 -> Late  (delay=6, h=-1, status=delayed)
  2. delay 8 (h=6)                                        -> none  (delay=8, h=6, status=delayed)
  3. delay 11 (h=6)                                       -> Late  (delay=11, h=6, status=delayed)
  4. 20 -> 12 (h=20)                                      -> Late  (delay=12, h=20, status=delayed)
  5. delay 3 on_time (h=12)                               -> Back on time  (delay=3, h=12, status=on_time)
  6. cancelled (h=-1)                                     -> Cancelled  (delay=0, h=-1, status=cancelled)
  7. cancelled again (h=999)                              -> none  (delay=0, h=999, status=cancelled)
  8a. delayed 12 -> unavailable                           -> blocked (condition 2: unavailable/no-data (attrs hidden)) [no-op]
  8b. delayed 12 again (h=12)                             -> none  (delay=12, h=12, status=delayed)
  9. office day off                                       -> blocked (condition 1: office day off)
  10. after expected departure                            -> blocked (condition 2: already departed) [no-op]
  11. on_time with h=-1                                   -> none  (delay=2, h=-1, status=on_time)
  12. delayed after cancellation (h=999, delay 7)         -> Late  (delay=7, h=999, status=delayed)
  ```

  Harness: `/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/9639cd8c-c4c5-4bc7-ad84-806e0d26c71f/scratchpad/alert_harness.py` (throwaway, not committed).
- [Task 5] `%-H:%M` (GNU/BSD strftime "no leading zero" extension) works for `sched_hm`/`exp_hm` on both the Yellow's Linux container and macOS dev — used instead of `%-I:%M` to avoid AM/PM ambiguity, safe here since both of her scheduled times are AM.
- [Task 5] Added `not_to: [unavailable, unknown]` on the bare/delay state trigger only (not on the `attribute: status` trigger) to cut noise from the unavailable<->numeric flap; doesn't lose the cancelled case since cancelled reports numeric state `0`, and the `attribute: status` trigger still independently catches a transition into/out of `unavailable` via the status attribute disappearing/reappearing.
- [Task 6] `packages/reminders/morning_update.yaml`: swapped the Tue/Wed/Thu umbrella-block condition (`now().strftime('%A') in [...]`) for `is_state('input_boolean.cristina_office_day', 'on')` (inner text untouched), and inserted a `### CRISTINA'S TRAIN` section before `### BIRTHDAYS` that loops `['1', '2']`, reusing the alert automation's null-safe "hasn't departed" logic (`status == 'cancelled' and sched is not none and now() < as_datetime(sched)` / `status == 'delayed' and sched is not none and exp is not none and now() < as_datetime(exp)`) so both consumers agree. Every `state_attr` read goes through `| default(none)` before the `is not none` guard, satisfying Risk 8. `states(sensor) | int(0)` supplies `delay` (unavailable/missing sensor -> 0, harmless since the status check already gates it out). Times use `%-H:%M` to match the alert's format.
- [Task 6] Rendering harness: `/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/9639cd8c-c4c5-4bc7-ad84-806e0d26c71f/scratchpad/morning_harness.py` (throwaway, not committed) loads the real YAML with the same HA-tag-tolerant loader as `tests/conftest.py`, extracts the `conversation.process` `text:`, and renders it with stubbed `states`/`state_attr`/`is_state`/`as_datetime`/`now` (fixed at 2026-09-29 07:40 America/Chicago, a Tuesday) plus the HA-ish filters the prompt needs (`int`, `float`, `round`, `default`, `abs`, `join`, `unique`, `selectattr`, `select`, `search`, `first`, `number` test). `states` is a dual-purpose stub: callable as `states(entity_id)` and attribute-walkable as `states.sensor.x.state`/`.attributes.y`, matching real HA template globals. Six cases rendered, all without a Jinja exception; extracted `### CRISTINA'S TRAIN` section per case:
  ```
  (a) sensors missing        -> heading + instruction line only, no train line
  (b) both on_time           -> heading + instruction line only, no train line
  (c) train 1 delayed 12     -> "Cristina's <scheduled time> train is running 12 minutes late, now expected around <new time>."
  (d) train 2 cancelled      -> "Cristina's <scheduled time> train is cancelled."
  (e) office day off + train 1 delayed -> heading + instruction line only, no train line (umbrella-gated even though train 1's status is delayed)
  (f) umbrella block         -> "Cristina commutes today" present when office day on, absent when off
  ```
  Assertions confirmed train text appears only in (c)/(d); all passed.

## Active Gotchas
- [Task 2 review] Metra sensors read `unavailable` when there's no data (outside window, not running, fetch error). Attributes (incl. `error`) disappear while unavailable — diagnose by running the script by hand.
- [Pre] Feed trips list only UPCOMING stops — a stop vanishes from a trip once passed → `not_in_feed` is normal after departure.
- [Pre] Metra feed has no `delay` field; `departure.time` almost never set. Use arrival.time.
- [Pre] HA container TZ=America/Chicago, Python 3.14.6, protobuf 6.32.0 (don't depend on it).
- [Task 1] `tests/fixtures/metra_tripupdates.pb` (evening capture, 2026-09-28 19:06 CDT) has zero entries for either of her two configured trains — only 6 MD-N trips total (2139/2143/2145/2147/2150/2152), all evening inbound. Task 1's `not_in_feed` test therefore uses a synthetic/missing trip_id, not the real fixture, and the fixture assertions target train 2152 per AC10. This is expected/normal, not a decoder bug.
- [Task 1] proto3 scalar/enum fields collapse "absent on the wire" and "explicit 0" into the same default when read via `gtfs-realtime-bindings` (always returns int 0 if unset). My hand decoder distinguishes them (`None` if the field number never appeared vs `0` if it did) — semantically equivalent (0 = SCHEDULED / not-cancelled) but don't diff them naively field-for-field against the official reader; normalize `mine or 0` first.

## Shared Utilities Created
- [Pre] Test venv (pytest, pyyaml, jinja2, yamllint): /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/9639cd8c-c4c5-4bc7-ad84-806e0d26c71f/scratchpad/testenv/bin/python — run `…/testenv/bin/python tests/run_tests.py --quick`.
- [Pre] Baseline: 63 pass / 9 skip / 1 PRE-EXISTING failure test_template_migration::test_pinned_entity_ids_exist_in_registry (not ours).
- [Task 1] `bin/metra_train.py` — stdlib-only, importable via `importlib.util.spec_from_file_location`. Pure functions for reuse in Task 2+ debugging:
  - `decode_feed(data: bytes) -> {"timestamp": int|None, "entities": [...]}` — hand-rolled protobuf wire decoder (FeedMessage/FeedHeader/FeedEntity/TripUpdate/TripDescriptor/StopTimeUpdate/StopTimeEvent/VehicleDescriptor per PRD AC3 field numbers).
  - `evaluate(feed, train, stop, scheduled_dt, now) -> {delay, status, scheduled_departure, expected_departure, last_update, error}` (datetimes, not yet stringified) — pure, no I/O; used directly by tests for rounding/matching cases without needing the encoder.
  - `run(train)` — full CLI flow (window gate → token → fetch → decode → evaluate); `main(argv)` prints one `json.dumps(...)` line and always returns 0.
  - `_now()` reads env `METRA_NOW` (ISO, tz-aware or naive-assumed-Chicago); `_read_token(path)` reads env `METRA_SECRETS` (default `/config/secrets.yaml`).
  - `OUTPUT_KEYS`, `CANCELED=3`, `SKIPPED=1` are the constants Task 2 can reference if needed; train/stop config comes from secrets (`metra_trains`, `metra_stop`), not module constants.
- [Task 1] `tests/test_metra_train.py` has a small standalone protobuf encoder (`build_feed`, `_enc_*`) for constructing synthetic FeedMessage bytes (used for the CANCELED-trip and SKIPPED-stop round-trip tests) — reusable if a future task needs more synthetic feed fixtures.

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*
- [Task 1] None — PRD AC3 field numbers matched pre-mortem Risk 4's list (Risk 4 lists a few extra fields we don't decode, e.g. `start_time`, `stop_sequence`, `delay=1` on StopTimeEvent; harmless to skip, no contradiction).

## AC12 Cross-Check (dev-only, `rt/.venv` gtfs-realtime-bindings)
- Decoded `tests/fixtures/metra_tripupdates.pb` with both the hand decoder and `google.transit.gtfs_realtime_pb2`. Both agree: 52 total entities, 6 MD-N trips (2139/2143/2145/2147/2150/2152), header timestamp 1790640391.
- Compared trip_id, schedule_relationship, vehicle_label, and every stop's (stop_id, arrival_time, departure_time, schedule_relationship) for all 6 MD-N trips after normalizing the proto3 default-vs-absent quirk noted above: **0 mismatches**.
- Train 2152 at its downstream stop: both readers report arrival epoch 1790641287, matching AC10 exactly.

## Decision Ledger
- [2026-09-28] no_data → sensor state `unavailable` (not `unknown`), via `availability: "{{ value_json.delay is number }}"`. HA command_line renders value_template to a STRING (trigger_template_entity.py render_with_context().strip()), so `none` becomes "None" and a unit=min sensor rejects it. Consequence: while unavailable, the status/error attributes are NOT exposed; consumers must treat unavailable/unknown as no-data — docs affected: prd.md Task 2 AC1, plan.md Sensor contract — status: folded
- [2026-09-28] Alert triggers on state + attribute:status only (supersedes plan's "no to:" wording) — docs affected: plan.md — status: folded
- [2026-09-28] Helper reset also at 06:40 (plan said 03:00 only) — docs affected: plan.md — status: folded
- [2026-09-28] added error code bad_args to metra_train contract — docs affected: plans/cristina-metra-delay-alerts/prd.md Task 1 AC7 — status: folded

## Task 1 Review Fixes (iteration 2)
- Hardened `_now()`: a malformed `METRA_NOW` (e.g. `"not-a-date"`) now falls back to the real clock instead of raising `ValueError` out of `main()` (was exit 1, violating AC9). Verified live: `METRA_NOW="not-a-date" python3 bin/metra_train.py 1` now exits 0 with valid JSON.
- `main()` computes `now` exactly once (via the now-safe `_now()`) and threads it into `run(slot, now=now)`; the top-level `except Exception` fallback reuses that same `now` instead of calling `_now()` again, so nothing in the fallback path can itself raise.
- Missing/invalid slot argv (no args, or a slot not `"1"`/`"2"`, e.g. `9999`) now returns `error: "bad_args"` — a new code, not reusing `"decode"` (which means "the feed didn't parse"). This is a deliberate, documented deviation from the PRD's fixed error enum (outside_window|missing_config|missing_token|http_<code>|timeout|decode|not_in_feed) — see Decision Ledger.
- `evaluate()`'s trip_id matching now tie-breaks duplicate `_<fragment>_` entities: prefers the first candidate that actually has a `stop_time_update` for the target stop, falling back to the first candidate overall if none do. Prevents a stale/duplicate entity without an update for the target stop from masking a real one later in the feed.
- [Later, privacy refactor] `bin/metra_train.py` moved train/time/stop config out of hard-coded module constants and into secrets (`metra_trains`, `metra_stop`), so the CLI arg is now a slot number (1/2) rather than a train number, and a new `missing_config` error covers missing/malformed config. Sensor/helper/file names were renamed to slot-based (`sensor.metra_train_1/2`, `packages/transit/metra_trains.yaml`, etc.) so the repo no longer reveals which trains or station she actually uses.
