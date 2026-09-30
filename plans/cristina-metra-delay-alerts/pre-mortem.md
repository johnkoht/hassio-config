## Pre-Mortem: Cristina Metra Delay Alerts

Checked facts that ground these risks:
- The Yellow HA container runs with `TZ=America/Chicago`, Python 3.14.6 and protobuf 6.32.0, and `/config/secrets.yaml` is present.
- `bin/` and `tests/fixtures/` are not gitignored.
- The entity-registry tests skip locally, because there is no `.storage` directory.
- In the captured feed, trips list **only upcoming stops**. For example, 2145 had only PRAIRIEXNG and GRAYSLAKE left.

Nothing here is CRITICAL. Risks 1–5 are HIGH, the silent-miss and noise class; they must be embedded in the task prompts.

### Risk 1: A feed hiccup clears a real delay alert, then re-pushes it (HIGH, silent-miss and noise)

**Problem**: `unknown` / `no_data` shows up in three situations: the fetch fails, the train hasn't started, or the train has already passed her station (that stop drops out of the feed). If the alert treats `unknown` as "below 5", it clears Cristina's notification and resets the helper. The next good poll then pushes again: a double buzz, or a delay that looks like it vanished.

**Mitigation**:
- In the alert automation, `no_data` / `unknown` / `unavailable` is a **no-op**: no push, no clear, no helper write.
- A clear happens only on a *numeric* delay below 5 with status `on_time`.

**Verification**: Fake-state test: delayed 12 → unknown → delayed 12. Expect exactly one push, no clear, and the helper stays at 12.

### Risk 2: The numeric sensor errors on a null state (HIGH, silent miss)

**Problem**: A `command_line` sensor with `unit_of_measurement: min` rejects non-numeric states. If `value_template` renders `None`, `''` or `'unknown'` as a string, HA logs an error and the sensor goes `unavailable`, or keeps a stale value.

**Mitigation**:
- Use `value_template: "{{ value_json.delay if value_json.delay is number else none }}"`, then confirm on the Yellow that null gives `unknown`, not an error.
- If it still errors, drop `unit_of_measurement` and keep the delay numeric only.

**Verification**: After deploy, outside the window, the sensor state is `unknown`, and `ha core logs | grep metra` shows no errors.

### Risk 3: The script crashes or hangs instead of reporting `no_data` (HIGH, silent miss)

**Problem**: A non-zero exit, a traceback on stdout, or a network hang longer than `command_timeout` all leave the sensor stale or `unavailable`. Nothing surfaces the reason.

**Mitigation**:
- The script **always** exits 0 and prints valid JSON.
- Every failure maps to `status: no_data` with an `error` attribute: `missing_config`, `missing_token`, `http_<code>`, `timeout`, `decode` or `not_in_feed`.
- The URL fetch timeout is 8 s, less than `command_timeout: 15`.
- Exceptions are caught at the top level; the message never includes the URL or the token.

**Verification**: Unit tests cover a missing token, an HTTP 401, a timeout (patched urlopen), garbage bytes, and a train that isn't in the feed. Each gives exit 0, valid JSON, the right `error`, and no token substring.

### Risk 4: The hand-rolled decoder mis-parses the feed (HIGH)

**Problem**: A wrong field number or wire-type handling bug silently yields "train not found" every day.

**Mitigation**: Put the exact GTFS-RT field numbers in the task prompt:
- `FeedMessage`: header=1, entity=2. `FeedHeader`: timestamp=3.
- `FeedEntity`: id=1, trip_update=3.
- `TripUpdate`: trip=1, stop_time_update=2, vehicle=3.
- `TripDescriptor`: trip_id=1, start_time=2, start_date=3, schedule_relationship=4 (CANCELED=3), route_id=5.
- `StopTimeUpdate`: stop_sequence=1, arrival=2, departure=3, stop_id=4, schedule_relationship=5 (SKIPPED=1, NO_DATA=2).
- `StopTimeEvent`: delay=1, time=2 (int64 varint).
- `VehicleDescriptor`: id=1, label=2.

Skip unknown fields by wire type (0, 1, 2 and 5). Copy the 2026-09-28 capture from `scratchpad/metra/rt/tripupdates.pb` into `tests/fixtures/metra_tripupdates.pb`.

**Verification**: A test asserts the fixture decodes to 52 entities, with a known evening trip (vehicle label `2152`) at a downstream stop on that trip, at a fixed epoch, giving roughly −2 min against that stop's scheduled time. Cross-check once against `gtfs-realtime-bindings` in the scratch venv. That's a dev-only check, not a runtime dependency.

### Risk 5: The alert fires every minute on the `last_update` attribute (HIGH, noise)

**Problem**: A bare state trigger with no `to:` fires on *any* attribute change, and `last_update` changes on every poll. That's about 270 runs a day in the logbook and traces, and each run could double-push if the dedup logic has a gap.

**Mitigation**: Trigger explicitly on the sensor state (the delay) plus `attribute: status`. Don't trigger on `last_update`. The plan's "no `to:`" wording is superseded by this.

**Verification**: A fake-state test changes only `last_update` and expects no automation run.

### Risk 6: A new `command_line` domain can't be hot-reloaded (MEDIUM)

**Problem**: The repo has never configured `command_line`. When an integration isn't loaded yet, its YAML reload service may not exist, so the first load may need a restart. John restarts; Claude never restarts on its own.

**Mitigation**: The build notes and ship report tell John a restart may be needed once for the first `command_line` load. Try `command_line.reload` first.

**Verification**: After deploy, `sensor.metra_train_1` exists.

### Risk 7: The dedup helper sticks across days (MEDIUM, silent miss)

**Problem**: If the 03:00 reset doesn't run (HA down, or the automation disabled), a helper left at 999 suppresses the next day's cancellation push. The repo has history of silently disabled automations (see `reference_initial_state_does_not_reenable`).

**Mitigation**:
- The helper reset runs at **06:40**, right before the window, and also at 03:00 with the office-day sync.
- There's no `initial_state` on any new automation.

**Verification**: Both reset triggers are present in the YAML, and grep confirms there's no `initial_state` in the new files.

### Risk 8: A morning-update prompt edit breaks the whole briefing (MEDIUM)

**Problem**: A Jinja error in the new block fails `conversation.process` for the entire family briefing, not just the train line.

**Mitigation**:
- Every value in the block is guarded (`state_attr(...) | default`, `is_state`), and the datetimes are parsed with `as_datetime(...)` behind an `is not none` check.
- Keep the block self-contained, placed before `### BIRTHDAYS`.

**Verification**: Render the whole prompt template in Developer Tools → Template with fake delayed, on-time and unknown sensors. It has no errors, and the train text appears only in the delayed case.

### Risk 9: Time math drifts at DST or rounding (MEDIUM)

**Problem**: A naive datetime or Python's banker's rounding shifts the delay or the window. For example, −1.5 would round to −2 while 2.5 rounds to 2.

**Mitigation**:
- Build `scheduled_departure` with `zoneinfo.ZoneInfo("America/Chicago")` for today's date.
- delay_min = `math.floor(seconds/60 + 0.5)`.
- The window uses the same timezone-aware now.

**Verification**: Unit tests cover the rounding edges (±90 s, 150 s) and a DST-transition date.

### Risk 10: The deploy silently doesn't land (MEDIUM)

**Problem**: `deploy.sh` pulls from GitHub, so it needs a push first. The host's git has diverged before, which made deploys silent no-ops. The secrets config is also missing from the Yellow's `secrets.yaml`.

**Mitigation**: The ship report gives John a checklist:
- merge and push;
- add the token and train/stop config on the Yellow;
- deploy without `--check`;
- `ls /homeassistant/bin/metra_train.py`;
- `docker exec homeassistant python3 /config/bin/metra_train.py 1`.

**Verification**: John runs the checklist. A missing token shows as `error: missing_token`, not as silence; a missing train/stop config shows as `error: missing_config`.

### Risk 11: Decisions left for John stall the build (LOW)

**Problem**: Task 4 (dashboard placement) and task 7 (the Tuesday–Thursday swap) are both marked "John's call".

**Mitigation**: Ask both before the PRD is written, so the build runs unattended.

## Summary

Total risks identified: 11
Categories: integration, silent-miss/error handling, test complexity, scope/AC wording, environment/config, rollback (all changes are additive; revert = delete files and revert one prompt block)
CRITICAL risks: none
