# Crazy Mode

A timed indoor-play run in one zone (Main floor or Basement). The house owns the
clock and the ramp-down: Crazy for the length on the slider (2 to 15 minutes), 1
of Slow-mo, 1 of Cool-down, then everything goes back as it was. It runs once
per allowed window.

## Entry points

- `script.crazy_mode_start` (alias "Crazy Mode"): one optional field, `zone`.
  With none it uses the zone picker, so a dashboard button or an Alexa Routine
  can call it as is. Expose the script to Alexa in Settings, Voice assistants,
  then create the Routine in the Alexa app.
- `script.crazy_mode_start_basement` (alias "Crazy Mode Basement"): no fields;
  calls start with `zone: Basement` and never touches the picker. Expose it to
  Alexa the same way for a second phrase.
- `script.crazy_mode_stop`: asks for Cool-down now (Crazy or Slow-mo only). It
  cannot end a run; Cool-down always plays.
- `script.crazy_mode_pause` / `script.crazy_mode_resume`: Crazy and Slow-mo
  only. Pause freezes the phase timer, the music and the ramps; the lights are
  re-asserted each tick at the frozen level. Resume says "Here we go!".
- `script.crazy_mode_skip`: next song, Crazy only, not while paused.
- `script.crazy_mode_restart`: back to the top of Crazy with no new snapshot
  and no `last_run` write, so it is the same run. Dashboard only; never expose
  it to Alexa.
- `script.crazy_mode_allow_again`: clears the once-per-window lockout.
- `automation.crazy_mode_emergency_abort`: cancels the run (and the control
  scripts) when `binary_sensor.emergency_active` turns on and puts the house
  back, with the zone's lights left bright rather than as snapshotted.
- `automation.crazy_mode_paused_timeout`: a run paused for 10 minutes is
  abandoned: cancelled and restored, with no Cool-down.

Pause, resume, skip and restart run only while the run script is on, the start
and restore scripts are off and there is no emergency. Only the abort, restart
and the paused timeout may turn the run script off (a test pins the list).

## Zones

`sensor.crazy_mode_zone_config` holds one attribute per zone: `speakers`,
`coordinator`, `lights`, `al_switches`, `emergency_lights`, `kitchen_latch` and
`snapshot_scene`. Everything reads it; add a zone there and in
`input_select.crazy_mode_zone`.

- Main floor: the four speakers grouped under the kitchen, the loop's leaf
  lights, three Adaptive Lighting switches, the kitchen latch.
- Basement: `media_player.sonos_basement` (an Amp driving ceiling speakers),
  music only, no lights, no Adaptive Lighting, no latch.

Start copies its zone into `input_text.crazy_mode_active_zone`; restore, cleanup
and the controls read that copy, and an empty or unknown value means Main
floor. The picker (`input_select.crazy_mode_zone`) keeps the last choice, so
plain "Crazy Mode" on Alexa uses whatever was picked last. Starting the
basement phrase leaves the picker alone.

## How a run goes

1. Start checks the allowed rule for its zone (reason in
   `sensor.crazy_mode_reason`; the favorites are judged for the zone passed in).
   Refusals for the window reasons are spoken on the zone's coordinator; house
   mode, empty house and emergency stay silent.
2. It reads the length once, snapshots the zone's Sonos with their groups and,
   if the zone has lights, one scene of its lights and Adaptive Lighting
   switches (`scene.crazy_mode_snapshot_<zone>`).
3. Adaptive Lighting goes off, the kitchen latch is set if the zone uses it and
   it was off, every zone speaker is unjoined, and they are joined under the
   coordinator only if there is more than one.
4. `script.crazy_mode_run` plays the phases. Crazy and Slow-mo run on
   `timer.crazy_mode_phase` and tick about every 5 s; progress comes from the
   timer's `finishes_at` (active) or `remaining` (paused), so every ramp and
   one-off line freezes with a pause. Cool-down can't be paused or stopped and
   keeps its own 60 s count. Voice lines go through `script.announcement_engine`
   without blocking (the engine caps volume at 75).
5. `script.crazy_mode_restore` ends it: Sonos, the zone's scene, the latch only
   if this run set it, flags cleared, phase Off last.

## Helpers

No helper has `initial:`; values survive restarts. State is
`input_select.crazy_mode_phase`. The timer is the clock for Crazy and Slow-mo;
the dashboard shows `sensor.crazy_mode_status` (text), never the timer entity,
so its Finish and Cancel dialog can't end a phase.

| Helper | Purpose |
|---|---|
| `input_select.crazy_mode_zone` | The picker (Main floor, Basement). |
| `input_text.crazy_mode_active_zone` | The running run's zone. |
| `input_number.crazy_mode_crazy_minutes` | Crazy length, 2 to 15. Read once at start; Restart reads the current value. |
| `input_boolean.crazy_mode_paused` | On while paused. |
| `input_datetime.crazy_mode_{morning,evening}_{start,end}` | Windows. Same day, start before end. Set on the dashboard, no times in this repo. An unset window never allows a start. |
| `input_datetime.crazy_mode_last_run` | Set at each start; the window is used up once the last run is inside it. |
| `input_text.crazy_mode_favorite_{crazy,slowmo,cooldown}` | Sonos favorite names, exact and case sensitive. Empty or unknown names refuse the start (`favorite_missing`). |
| `input_number.crazy_mode_base_volume` | Crazy plays at this level; Slow-mo about 70% of it, Cool-down about 45%. |
| `input_boolean.crazy_mode_stop_requested` | The stop button's request; only the Crazy and Slow-mo ticks read it. |
| `input_boolean.crazy_mode_kitchen_latch_set` | This run set the kitchen latch, so it clears it. |

## Reasons (first match wins)

`running`, `emergency`, `house_mode` (Bedtime, Quiet, Away, Vacation),
`not_occupied`, `window_unset`, `outside_window`, `already_ran`,
`favorite_missing` (the picked zone's speakers), else `ok`. The house mode is
read, never set. `sensor.crazy_mode_favorites` lists the zones whose speakers
carry all three favorites; a missing zone config lists none, so it refuses.

## Dashboard

The home page banner (`_crazy_mode_active_notification.yaml`) shows while the
phase isn't Off and hides the vacuum banner (one fixed slot). Chips: skip in
Crazy, pause in Crazy or Slow-mo, resume while paused, restart and stop during a
run. The popup (`#crazy_mode`) shows the zone tiles, length slider and Start
when idle, and the status, a Paused banner and the same controls during a run.

## Known gaps

- Restart mid-run (HA restart): the snapshots are lost. `crazy_mode_cleanup_on_start`
  resets the phase, turns the active zone's Adaptive Lighting back on and clears
  our latch; Sonos and lights stay as they are.
- A missing zone config at restore or cleanup is logged and waited on for up to
  60 s; after that the restore puts back Sonos only (`sonos.restore` on all
  snapshotted speakers) and says so in the log.
- Only the kitchen has a manual latch, and `kitchen_lights_to_off` ignores it on
  vacancy, so the run re-sets the lights every tick, including while paused.
- A light transition already in flight finishes after a pause.
- A restore after a run puts back what the snapshot held; changes made by hand
  during the run are lost.

## Deploy

Reload input_select, input_boolean, input_text, input_number, input_datetime,
timer, template, script and automation. Then, on the dashboard (`#crazy_mode`):

- set the Crazy length slider to 5 (a new input_number starts at its minimum);
- set the windows and favorite names;
- expose `script.crazy_mode_start_basement` to Alexa and add its Routine.
