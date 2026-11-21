# PRD: Crazy Mode v2: zones, length, skip, pause, restart

## Goal

The Crazy Mode popup gains:
- a zone picker (Main floor, Basement) and a Crazy length slider (2–15 min, 1-min steps) above Start;
- during a run: Skip (Crazy only), Pause and Resume (Crazy and Slow-mo), Restart and Stop.

A home page banner shows the run state and the same controls, following the vacuum UI. Pause freezes the clock, the music and the ramps. Restart goes back to the top of Crazy without a new snapshot and without writing `last_run`. Every run that isn't abandoned ends in Cool-down and a full restore.

**Sources of truth:**
- `plans/crazy-mode-v2/plan.md`. Its "Review fixes" section wins over the Approach section.
- `pre-mortem.md` (21 risks).
- `review.md` (12 defects, all folded into the plan).

## Memory synthesis

- **Test templates by rendering them.** Render templates in a Jinja harness rather than relying on substring tests, and give every rewritten guard a sabotage run (v1 practice; JK-1251 and JK-1265 reviews).
- **No `initial:` on any new helper (JK-1262).** An `input_number` with no restored state starts at `min`, so the build sets the length slider to 5 through the API after deploy.
- **Leave the latch rules as they are.** `kitchen_lights_to_off` ignores the latch, so the run re-asserts lights every tick, including while paused. Never write `input_boolean.kitchen_lighting_automations`.
- **Alexa can't pass fields** (reference_alexa_voice_to_ha_script). Every Alexa-facing script has no fields and resolves everything itself.
- **The repo is public.** No window times or family schedules in YAML, tests or docs.
- **Deploy with a reload, never a restart.** The new helpers need the input_select, input_number, input_text, input_boolean, template, script and automation domains reloaded.

## Tasks

### task-1 Helpers and zone config
- **Helpers:** `input_select.crazy_mode_zone` (Main floor, Basement), `input_text.crazy_mode_active_zone`, `input_number.crazy_mode_crazy_minutes` (2–15, step 1, slider) and `input_boolean.crazy_mode_paused`. Give `timer.crazy_mode_phase` a non-zero default duration.
- **The config sensor:** `sensor.crazy_mode_zone_config` has one attribute per zone. Each zone has the keys `speakers`, `coordinator`, `lights`, `al_switches`, `emergency_lights`, `kitchen_latch` and `snapshot_scene`. Main floor is the v1 lists, unchanged. Basement is `sonos_basement` with empty light lists.
- **AC:**
  - no `initial:` anywhere;
  - every zone has every key;
  - Main floor matches the v1 lists exactly;
  - Basement has no lights.

### task-2 Allowed sensor is zone-aware
The favorites check uses the speakers of the selected zone (or of the zone passed in). The reason priority is unchanged.
- **AC:** the Jinja harness covers both zones and a config that's unavailable.

### task-3 Start reads the zone
- **Inputs:** an optional `zone` field; with no field it uses the picker.
- **The run's settings:** it writes `crazy_mode_active_zone` and reads the length once.
- **Speakers:** it always unjoins every zone speaker, and joins only when the zone has more than one.
- **Snapshot:** it takes the zone's own snapshot scene. Light, scene and Adaptive Lighting steps run only when their list isn't empty.
- **Refusals** are spoken on the zone's coordinator.
- **Unavailable config:** it falls back to Main floor and logs a warning.
- **The basement phrase:** `script.crazy_mode_start_basement` (no fields) calls start with `zone: Basement`.
- **AC:**
  - a single-speaker zone still unjoins;
  - an empty light list skips the scene and light calls;
  - the picker is never written by the basement script.

### task-4 Run on the phase timer
- **Clock:** each phase starts `timer.crazy_mode_phase`, then a tick loop of about 5 s runs. The `wait_template` wakes on stop or on the paused flag changing.
- **Progress:** while active it comes from `finishes_at` and `duration`, while paused from `remaining`. There are no deadlines saved at phase start.
- **Phase lengths:** Crazy uses the length from start. Slow-mo and Cool-down are 1 min.
- **One-off lines:** "One more minute" plays when 60 s of Crazy are left. It and the second heavy-work prompt each have a fired-once variable.
- **While paused:** re-assert the frozen brightness and skip the ramps and fades.
- **Stop:** jumps to Cool-down. Entering Cool-down clears the paused flag and resumes playback.
- **Cool-down** ignores `stop_requested` and keeps its own 60 s count.
- **Zones:** every list comes from the active zone, so a zone with no lights makes no light calls.
- **AC:**
  - the v1 phase behaviour holds: lines, volumes, ramps, the stop-to-Cool-down rule;
  - sabotage: a deadline saved at phase start makes the pause test go red, and Cool-down reading the stop flag makes the Cool-down test go red.

### task-5 Pause, Resume, Skip, Restart
- **Pause** (Crazy and Slow-mo only): `timer.pause`, a media pause on the coordinator, and the paused flag on.
- **Resume:** runs only while paused. It calls `timer.start` only when the timer is paused, plays the media, clears the flag and says "Here we go!".
- **Skip:** Crazy only, not paused. It calls `media_next_track` on the coordinator.
- **Restart:**
  - It cancels the run and clears the paused and stop flags.
  - It rechecks for an emergency, sets the phase to Crazy and starts the run with the active zone.
  - It takes no snapshot and doesn't write `last_run`.
  - It isn't exposed to Alexa.
- **Shared guard:** every one of these needs the run script on, the start and restore scripts off, and no emergency.
- **AC:** Restart is refused during setup, the restore and an emergency. Sabotage: removing the guard turns its test red.

### task-6 Restore, abort, cleanup, paused timeout
- **Restore:** reads the active zone (falling back to Main floor) and uses `emergency_lights`. It clears the paused flag and turns on the zone's snapshot scene only if it has lights.
- **Abort:** also turns off the restart, pause and resume scripts.
- **Paused timeout:** a new automation for when `crazy_mode_paused` has been on for 10 min. It cancels the run, restart, pause and resume scripts, then restores. There's no Cool-down.
- **Startup cleanup:** waits up to 60 s for the config, then uses the active zone.
- **AC:**
  - an explicit allowlist test of who may turn off the run (the abort, Restart, the paused timeout);
  - the shape of the paused-timeout automation.

### task-7 Dashboard
- **Home banner:** a `horizontal_action_card_fixed` banner shown while the phase isn't Off. Its chips use `visibility:` rules:
  - Skip in Crazy and not paused;
  - Pause in Crazy or Slow-mo and not paused;
  - Play while paused;
  - Restart and Stop whenever a run is going.
- **Vacuum banner:** hidden while the phase isn't Off.
- **Popup when idle:** two zone tiles, the length slider, a primary Start pill, and the red reason banner.
- **Popup during a run:** phase, time left as display-only text (never the timer entity), a Paused banner, and the same chips.
- **AC:** the dashboard YAML parses, every referenced entity or script exists, and the time left isn't the timer entity.

### task-8 Tests
- **Replaced tests:** rewrite the v1 tests listed in the plan's "Tests that change" table, each keeping its rule.
- **New tests:** add the ones the plan lists.
- **Sabotage runs:** do all three listed in the plan.
- **AC:** the full suite is green.

### task-9 Docs
- **README:** the package README covers zones, length, controls, the basement phrase, and the slider's first value.
- **SITEMAP:** update `dashboards/SITEMAP.md` if needed.
- **LEARNINGS:** a note on the timer-driven pause (progress from `finishes_at` and `remaining`, the paused-timer resume, a 0-duration start finishing at once).
- **AC:** no schedules or times.
