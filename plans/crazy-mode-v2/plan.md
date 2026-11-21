---
title: Crazy Mode v2 - zones, length, skip, pause, restart
slug: crazy-mode-v2
status: shipped
created: 2026-11-20
has_pre_mortem: true
has_review: true
has_prd: true
---

# Crazy Mode v2 - zones, length, skip, pause, restart

## Problem

Crazy Mode (plans/crazy-mode, #193) only runs on the main-floor loop, but the kids also play it in the basement. Once a run starts it can only be stopped into Cool-down. Crazy is always 5 minutes. There's no way to skip a song the kids don't like, pause for an interruption, or start over.

## Goal

The popup has a zone picker (Main floor or Basement) and a Crazy length above Start. While a run is going it shows Skip song, Pause / Resume and Restart. A pause freezes the clock, the music and the light ramp. Restart goes back to the top of Crazy without re-snapshotting the house. Every run that isn't abandoned still ends in Cool-down and a full restore. A run left paused for 10 minutes counts as abandoned: it ends with the restore only.

## Approach

**Zones.**
- `input_select.crazy_mode_zone` (Main floor, Basement) is the picker. It has no `initial:`, so it keeps the last choice, and the Alexa phrase uses whatever was picked last.
- One template sensor, `sensor.crazy_mode_zone_config`, holds each zone's lists as attributes: speakers, the coordinator speaker, leaf lights, Adaptive Lighting switches and whether to set the kitchen latch. Start, run, restore and the restart cleanup all read it, so a zone is defined in one place.
- Main floor is today's lists, unchanged.
- Basement is music only: `media_player.sonos_basement` (the Amp driving the ceiling speakers; alone, no group), with no lights, no Adaptive Lighting and no latch. The basement has no smart lights, so every light step in the run, the snapshot and the restore skips an empty list.
- Start copies the chosen zone into `input_text.crazy_mode_active_zone`. Restore and the cleanup read that copy, so changing the picker mid-run can't restore the wrong rooms. The dashboard hides the picker while a run is going.
- Adding a zone later means one more entry in the sensor and one more option in the select.

**Crazy length.**
- `input_number.crazy_mode_crazy_minutes` (2–15, step 1, slider on the popup) sets how long Crazy runs. It has no `initial:`, and it's 5 when first created.
- Slow-mo and Cool-down stay at 1 minute each.
- "One more minute of Crazy Mode!" plays when one minute of Crazy is left, whatever the length.
- Start reads the length once, so moving the slider mid-run changes nothing. Restart uses the slider's current value.

**Clock on the phase timer.**
- The run script stops counting wall-clock deadlines. Each phase starts `timer.crazy_mode_phase` and loops on short ticks (about 5 s) until the timer finishes or Stop is pressed.
- Every timed effect is worked out from the phase's progress (elapsed ÷ duration, read from the timer's `finishes_at`/`remaining`), not from the time the step started:
  - the Slow-mo dim from 100% to 50%;
  - the volume fades;
  - the "one more minute" line;
  - the two heavy-work prompts;
  - the final fade.
- A paused timer stops the progress, so every effect freezes with it, and Resume carries on from the same spot.
- This is the one structural change. Phases, durations, lines, the stop-to-Cool-down rule and the emergency abort keep their current behaviour.

**Pause / Resume.**
- `script.crazy_mode_pause` toggles `input_boolean.crazy_mode_paused`.
- **Pause:** `timer.pause` and `media_player.media_pause` on the coordinator. Lights stay where they are.
- **Resume:** `timer.start` (a paused timer resumes) and `media_play`.
- **While paused:** the tick loop skips its re-asserts and fades, and Stop still works.
- **Left paused:** a run paused longer than 10 minutes ends quietly with a restore, no Cool-down, because nobody is there.
- **Voice:** none on pause; a short "Here we go!" on resume.

**Skip song.** `script.crazy_mode_skip` calls `media_player.media_next_track` on the coordinator. It only works in Crazy, because that's the only phase playing a playlist; Slow-mo and Cool-down are single tracks.

**Restart.**
- `script.crazy_mode_restart` cancels the run script and clears the paused and stop flags.
- It sets the phase back to Crazy, then starts the run script again with the active zone's lists.
- It doesn't re-snapshot, so the original snapshot still restores the house at the end. It doesn't touch `crazy_mode_last_run`, so a restart is the same run for the once-per-window rule.
- It works from any phase except Off, including while paused.

**Dashboard.** It borrows the vacuum UI: controls show and hide depending on the run state.
- **Home page banner while a run is going.** This copies `_vacuum_active_notification.yaml`: a `horizontal_action_card_fixed` banner, shown by a `conditional` only while the phase isn't Off. It has the phase and time left, a tap that opens `#crazy_mode`, and `kohbo_chip_icon_action_card` chips. Each chip has `visibility:` on the phase and paused state:
  - **Skip** only in Crazy and not paused;
  - **Pause** while running;
  - **Play** (resume) while paused;
  - **Restart** and **Stop** whenever a run is going.
- **Popup when idle.** This copies the quick-clean popup:
  - a two-tile grid for the zone, Main floor and Basement, with the selected one highlighted;
  - the Crazy length slider;
  - a full-width primary Start pill.
  - The allowed / recharging reason shows as the red banner the vacuum popup uses for "scheduled".
- **Popup during a run:** the zone tiles, slider and Start hide. It shows the phase, the time left (frozen while paused), a "Paused" banner when paused, and the same control chips as the home banner.

**Alexa.**
- The no-field "Crazy Mode" script keeps working, using the last zone picked.
- Optionally, a second script "Crazy Mode Basement" sets the zone and calls start, giving a separate Alexa phrase. It's cheap, and it's in the tasks unless you'd rather not.

## Review fixes (pre-mortem + review, 2026-11-20)

These come from `pre-mortem.md` and `review.md`. Where one conflicts with the Approach above, this section wins.

**Decisions**
- **Pause only in Crazy and Slow-mo.** Cool-down is 60 s and stays untouchable.
- **Two scripts instead of a toggle:** `crazy_mode_pause` and `crazy_mode_resume`, so a stale tap can't flip the wrong way.
  - **Resume** calls `timer.start` only when the timer is actually paused.
  - **Entering Cool-down** (from a Stop while paused) clears the paused flag and resumes playback first.
- **No restart cap.** Restart is a parent control on the dashboard only and is never exposed to Alexa.
- **The basement Alexa phrase.** `script.crazy_mode_start` gains an optional `zone` field. `script.crazy_mode_start_basement` (no fields) calls it with `zone: Basement`, so the picker is never changed. A start with no field uses the picker.
- **The home page has one fixed-banner slot.** The vacuum banner hides while the Crazy phase isn't Off.
- **Time left is display only.** It's a text that ignores taps, never the timer entity, so the timer's Finish or Cancel dialog can't end a phase.

**Build rules**
- **The zone config has the full set of keys:**
  - `speakers`, `coordinator` (the refusal and transport speaker), `lights`, `al_switches`, `emergency_lights`, `kitchen_latch` and `snapshot_scene`.
  - `snapshot_scene` is a separate scene per zone (`crazy_mode_snapshot_main_floor`, `crazy_mode_snapshot_basement`).
  - Every light, scene and Adaptive Lighting step is wrapped in a non-empty check.
- **An unavailable config falls back to Main floor and logs it.**
  - The config can be missing while templates reload or HA starts. Then `crazy_mode_active_zone` is read, and an empty or unknown value is treated as Main floor.
  - Readers fall back to the Main floor lists and write a `system_log` warning, never silently using empty lists.
  - The startup cleanup waits for the config, up to 60 s, before it acts.
- **The allowed sensor is zone-aware.** It checks the favorites against the selected zone's speakers. It gets its own task, between Tasks 1 and 2.
- **Speaker grouping:** always unjoin every zone speaker; join only when the zone has more than one.
- **Guards and who can cancel the run:**
  - Restart, Pause, Resume and Skip run only while the run script is on, the start and restore scripts are off, and `binary_sensor.emergency_active` is off.
  - Restart rechecks for an emergency before it starts the new run and waits for the old run to stop.
  - The emergency abort and the paused timeout also turn off the restart, pause and resume scripts.
  - Only the abort, Restart and the paused timeout may turn off the run (an explicit allowlist test).
- **Pause keeps the lights up.** While paused, keep re-asserting the frozen brightness each tick, since the kitchen vacancy automation ignores the latch. Skip only the ramps and fades.
- **One-off lines fire once.** The one-minute line and the second heavy-work prompt each have a fired-once variable, so they fire exactly once across ticks and across a pause and resume.
- **Progress comes from the timer.** While active: `finishes_at` and `duration`. While paused: `remaining`. This uses `now()` only through `finishes_at`, never a deadline saved at phase start. The timer helper keeps a non-zero default duration. Cool-down also keeps its own 60 s count and ignores the timer going idle early.
- **The Crazy length slider starts at `min` (2) on first creation.** The build sets it to 5 through the API after deploy. That's a hand-off step, not YAML.

**Tests that change.** Each v1 test below is replaced, and the new test must enforce the same rule:

| v1 test | Rule the replacement keeps |
|---|---|
| `test_every_wait_runs_to_a_deadline`, `test_no_fixed_delays_that_carry_the_clock`, `test_clock_shape_is_pinned` | Phase lengths come from the helper and the timer: Crazy uses the slider, Slow-mo and Cool-down are 1 min. No fixed delay carries the clock. |
| `test_speaker_lists_agree` | No speaker or light list outside the zone config. |
| `test_voice_lines_carry_chime_volume_and_four_speakers` | Every voice line has the chime and volume, and targets the zone's speakers. |
| `test_refusal_speaks_only_for_window_reasons` | Same rule, on the zone's coordinator. |
| `test_restore_emergency_ends_with_bright_lights` | Uses the zone's `emergency_lights`. |
| `test_only_the_emergency_abort_turns_off_the_run` | Allowlist: abort, Restart, the paused timeout. |

**New tests:**
- a Jinja harness for progress, active and paused, with real timer attribute shapes;
- one-off lines fire once;
- Stop while paused;
- Restart refused during setup, the restore and an emergency;
- the abort and the paused timeout cancel the restart, pause and resume scripts;
- the shape of the paused-timeout automation;
- an empty light list skips the scene and light calls;
- an unknown active zone falls back to Main floor;
- a single-speaker zone still unjoins;
- the allowed sensor is zone-aware.

**Sabotage, each must go red:**
- progress replaced by a deadline saved at phase start;
- the run-script guard removed from Restart;
- Cool-down reading `stop_requested`.

## Tasks

1. **Zone and length helpers and config:**
   - `input_select.crazy_mode_zone`, `input_text.crazy_mode_active_zone`, `input_number.crazy_mode_crazy_minutes` and `input_boolean.crazy_mode_paused`, with no `initial:`.
   - `sensor.crazy_mode_zone_config` with a test that every zone has every key.
2. **Start reads the zone:** lists come from the config, it records the active zone, and it groups the speakers only when the zone has more than one.
3. **Run on the phase timer:** restructure into a progress-driven tick loop that honours pause, take Crazy's length from the slider, and keep the current phase behaviour.
4. **Pause / Resume script,** plus the 10-minute paused timeout (an automation on the paused boolean, `for: 10 min`, that cancels the run and restores).
5. **Skip and Restart scripts.**
6. **Restore, emergency abort and restart cleanup** read the active zone's lists instead of hard-coded ones, and clear the paused flag.
7. **Dashboard:**
   - the home page run banner with state-driven chips, modelled on `_vacuum_active_notification.yaml`;
   - the popup's idle view (zone tiles, length slider, Start pill) and run view (phase, time left, Paused banner, chips), modelled on the quick-clean popup.
8. **`script.crazy_mode_start_basement`** for a second Alexa phrase; it passes `zone: Basement`.
9. **Tests:**
   - every zone config complete;
   - no hard-coded speaker or light lists outside the config;
   - the Crazy timer and the one-minute line follow the length helper;
   - a zone with no lights runs without light calls;
   - pause freezes the clock (the run reads timer progress, never `now()` deadlines);
   - restart doesn't write `last_run` or re-snapshot;
   - Cool-down still can't be skipped by Stop;
   - Skip only in Crazy;
   - no `initial:` on any new helper.
10. **Docs:** package README, the plan link, and a LEARNINGS note on timer-driven pause.
11. **Hand-off:** a supervised basement run, then one pause and one restart on the main floor.

## Risks

- **The basement is music only.** It has no smart lights, so the phases there are told apart by music and voice alone. Accept.
- **Timer progress resolution:** `remaining` only updates on state changes, so progress has to come from `finishes_at` while active and `remaining` while paused. Ticks are about 5 s, so the ramps step every 5 s instead of smoothly. Accept; the lights' own `transition` smooths it.
- **Sonos pause on a Spotify favorite:** `media_pause`/`media_play` should resume in place. Check it on the first run. If play restarts the playlist, accept it for Crazy (shuffled anyway) and re-select the source for single-track phases.
- **The basement Sonos is an Amp driving the ceiling speakers.** It has a TV input, so if the basement TV is playing through it, a run takes over that audio and the snapshot puts it back at the end. Accept.
- **Restart race:** cancelling the run script mid-announcement can leave a voice line playing over the restart. Acceptable; the announcement engine runs on its own.
- **Restructuring the run script risks regressions in a feature that works.** Mitigation: keep the existing tests green, add the pause tests, and do a supervised run before calling it done.

On approval → /approve → /ship crazy-mode-v2
