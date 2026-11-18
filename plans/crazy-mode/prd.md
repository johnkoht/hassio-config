# PRD: Crazy Mode

## Goal

One tap or one Alexa phrase starts a 7-minute run on the main-floor loop (Crazy 5:00, Slow-mo 1:00, Cool-down 1:00) with music, lights and voice cues. Every run ends in Cool-down, the house returns to exactly how it was, and the mode runs once per allowed window. Source of truth for design: `plans/crazy-mode/plan.md`; risk mitigations: `pre-mortem.md`; review adjustments: `review.md`.

## Memory synthesis (embedded in tasks)

- Render templates in a Jinja harness; substring tests passed three sabotages on kids_wifi.
- Restored timers can fire `finished` before automations attach; `timer.crazy_mode_phase` is display only, state lives in `input_select.crazy_mode_phase`.
- No `initial:` on any helper (JK-1262). `input_datetime` with no initial reads 1970 when never set.
- Never write `input_boolean.kitchen_lighting_automations`; the latch is `kitchen_lights_manually_toggled`, and `kitchen_lights_to_off` ignores it (pre-mortem risk 4).
- Public repo: no window times, no family schedule detail anywhere.

## Tasks

### task-1 Helpers (`packages/house/crazy_mode/crazy_mode_helpers.yaml`)
`input_select.crazy_mode_phase` (Off, Crazy, Slow-mo, Cool-down), `timer.crazy_mode_phase`, `input_datetime` for morning/evening window start+end (time only), `input_datetime.crazy_mode_last_run` (date+time), three favorite `input_text`s, base volume `input_number`, `input_boolean.crazy_mode_kitchen_latch_set`, `input_boolean.crazy_mode_stop_requested`.
- AC: no helper has an `initial` key.
- AC: window helpers have `has_time: true`, `has_date: false`; no time literal in any package YAML.
- AC: favorite names defaults are not stored in YAML as `initial`; the three names are seeded by the dashboard (documented).
- AC: base volume has min/max/step and unit `%`.

### task-2 Allowed sensor (`crazy_mode_allowed.yaml`)
`binary_sensor.crazy_mode_allowed` with `reason` attribute: running, emergency, house_mode, not_occupied, window_unset, already_ran, outside_window, favorite_missing; else `ok`.
- AC: renders off with the right reason for each case in a Jinja harness (inside window ok; outside; same-window already ran; other window ran earlier today still ok; start >= end unset; house Bedtime/Quiet/Away/Vacation; house_occupied off; emergency on; renamed favorite; missing speaker).
- AC: the sensor reads `input_select.house`, never sets it.
- AC: `reason` priority order is fixed and tested.

### task-3 Start script (`crazy_mode_start.yaml`)
`script.crazy_mode_start`, alias "Crazy Mode", no fields. Gates on the allowed sensor; on refusal speaks only for `outside_window` and `already_ran` on the kitchen speaker via the engine; otherwise silent. On pass: sets last_run, snapshots Sonos (`with_group: true`) and a scene of loop leaf lights plus the kitchen/family room/foyer AL switches, turns AL off, sets the kitchen latch (recording whether the script set it), unjoins then joins the four speakers, then `script.turn_on` of the run script.
- AC: the snapshot steps precede AL off, the latch set, and the join.
- AC: refusal wording is "Crazy Mode is recharging — back tonight / back tomorrow morning" chosen by window; no speech for other reasons.
- AC: the script never writes `input_boolean.kitchen_lighting_automations` or the room flag; sets the latch only if it was off and records it.
- AC: the script has no `fields`, so an Alexa call works.
- AC: the engine call passes `sound_file` and `sound_length` and an explicit `media_players` list of the four Sonos.

### task-4 Run script (`crazy_mode_run.yaml`)
`mode: single`. Deadlines from the start timestamp (300 / 360 / 420 s). Phases: Crazy (favorite 1, shuffle, base volume, full brightness, start line, 4:00 warning), Slow-mo (favorite 2, ~70% volume, fade, dim to ~50% in steps, line), Cool-down (favorite 3, ~45%, steady ~30%, two distinct heavy-work picks at 0:00 and 0:30, fade out at the end), then the closing line ending "Save your world." and `script.crazy_mode_restore`. Light and Sonos steps use `continue_on_error`.
- AC: no step calls `script.announcement_engine` with `action:` (all via `script.turn_on`), and every wait derives its timeout from a deadline.
- AC: Crazy and Slow-mo waits release on the stop boolean; Cool-down waits never read it.
- AC: lights are re-asserted at least every 60 s in Crazy and every step in Slow-mo/Cool-down; Cool-down brightness floor is never 0 or off.
- AC: heavy-work list has 8 entries, none containing jump, spin, hop, one-foot or balance; two distinct picks per run.
- AC: music volume changes happen in steps (no single call drops volume by more than 20 points to 0), and the run ends with `script.crazy_mode_restore`.
- AC: the closing line ends with "Save your world."

### task-5 Stop, restore, abort, cleanup (`crazy_mode_stop.yaml`, `crazy_mode_restore.yaml`, `crazy_mode_emergency_abort.yaml`, `crazy_mode_cleanup_on_start.yaml`, `crazy_mode_allow_again.yaml`)
- AC: `script.crazy_mode_stop` only sets the stop boolean while phase is Crazy or Slow-mo, and contains no `script.turn_off`.
- AC: `script.crazy_mode_restore` is `mode: single`, starts with a phase-not-Off condition, restores Sonos (`with_group: true`), the light scene (which includes the AL switches), clears the latch only if `crazy_mode_kitchen_latch_set`, clears the stop boolean, sets phase Off last.
- AC: emergency abort triggers on `binary_sensor.emergency_active` to on, calls `script.turn_off` on the run script, then the restore script, and is the only caller of `script.turn_off` on the run script.
- AC: start-up cleanup (HA start and `automation_reloaded`) sets phase Off, clears the stop boolean, turns AL on for kitchen, family room, foyer, clears the kitchen latch only if the script set it, and does not touch Sonos or lights.
- AC: `script.crazy_mode_allow_again` sets `last_run` to a fixed old timestamp.

### task-6 Dashboard (`dashboards/kohbo/home/crazy_mode_popup.yaml`, `home.yaml`)
Home button navigating to `#crazy_mode`; popup with start, stop, phase, time left, allowed reason, window helpers, favorite names, base volume, allow-again, and a warning when favorites are missing.
- AC: popup has hash `#crazy_mode` and is `!include`d next to the kids WiFi popup; the Home button navigates to it.
- AC: dashboard tests (`test_dashboard_views.py`) pass; no `type: conditional` with `condition: template`.

### task-7 Tests (`tests/test_crazy_mode.py`)
- AC: covers every pinned guard in tasks 1-5 and the Jinja harness cases for the allowed sensor and the refusal line.
- AC: sabotage proof: removing the emergency trigger, adding an `initial:`, letting stop call `script.turn_off`, or editing a heavy-work entry to "jump" each turn a test red.
- AC: no real window times or names in fixtures (synthetic times only).

### task-8 Docs
- AC: `packages/house/crazy_mode/README.md` (mechanism, helpers, entry points, deploy domains), `docs/` entry (AUTOMATIONS.md House Modes), and a `packages/house/LEARNINGS.md` note on `select_source` for Sonos favorites and the kitchen latch gap.
- AC: no times or family schedule detail in any doc.

### task-9 Hand-off notes
- AC: PR body lists reload domains and John's manual steps: set the windows, seed the favorite names and volume, expose the script to Alexa and create the Routine, supervised first run.
