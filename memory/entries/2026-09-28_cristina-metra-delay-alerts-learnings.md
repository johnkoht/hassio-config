# 2026-09-28 · cristina-metra-delay-alerts

Pushes Cristina when either of her two Metra MD-N trains (configured via secrets `metra_trains`/`metra_stop`) is 5+ min late or cancelled at her station, on office days only, and adds a line to the morning update. On-time trains produce nothing.

**Metrics:** 7 tasks, 7 complete. Task 1 took 2 attempts (argv/clock hardening). Task 2 needed a main-agent fix. 27 new tests.

**Pre-mortem:** Risk 2 materialized (see gotchas below); the other 9 mitigations held.

## Metra feed
- **Endpoint:** `gtfspublic.metrarr.com`, with `?api_token=`. The old API was shut down in November 2025.
- **No delay field:** `stop_time_update` has only an absolute `arrival.time`, so delay = predicted − scheduled.
- **Trips list upcoming stops only.** Her station drops out of the feed once the train has passed it.
- **Why Metra-Tracker (HACS) was rejected:**
  - it drops trains at their scheduled time;
  - it reads a delay field the feed doesn't send;
  - it doesn't handle cancellations.

## Architecture
- **The script lives in the repo** at `bin/metra_train.py` and runs as a `command_line` sensor. `custom_components/` is gitignored and `deploy.sh` doesn't ship it.
- **The protobuf decoder is written by hand, stdlib only.** The Yellow's protobuf 6.32 can't load current `gtfs-realtime-bindings` code, which needs 7.34 or newer.
- **Which trains and station to watch is config, not code:** secrets `metra_trains` (comma-separated `<trip_id_fragment>@<HH:MM>`, slot 1 = first entry) and `metra_stop`. The CLI arg is a slot number (1/2), not a train number.

## Gotchas
- **An independent implementation review caught a threshold flap** (push at ≥ 5, clear at < 5) and a silent clear of an un-cancellation. Fixed with a clear at ≤ 2 and a "back on schedule" push. Single-threshold push/clear pairs need hysteresis.
- **command_line value_template returns a string.** It goes through `render_with_context().strip()`, so returning `none` gives `"None"`, which a sensor with a unit rejects. Use `availability:` instead. While unavailable, the sensor's attributes are hidden.
- **The alert's dedup compares against the last pushed delay**, kept in `input_number`. It never uses `trigger.from_state`, so a slow drift like 6 → 8 → 11 still re-pushes.

## Follow-ups (backlog)
- Watch the calendar for a WFH event.
- A stale-data push to John.
- MD-N service alerts.
- Clear stale pushes at 03:00.
- Commit the alert and morning-update Jinja harnesses as tests.
- Separately: a pre-existing self-disable ID mismatch on Cristina's station-arrival automation (out of scope for this project).
