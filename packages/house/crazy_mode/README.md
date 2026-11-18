# Crazy Mode

A timed indoor-play run on the main-floor loop. The house owns the clock and
the ramp-down: 5 minutes of Crazy, 1 of Slow-mo, 1 of Cool-down, then
everything goes back as it was. It runs once per allowed window.

## Entry points

- `script.crazy_mode_start` (alias "Crazy Mode"): no fields, so a dashboard
  button or an Alexa Routine can call it. Expose the script to Alexa in
  Settings, Voice assistants, then create the Routine in the Alexa app.
- `script.crazy_mode_stop`: asks for Cool-down now. It cannot end a run;
  Cool-down always plays. During Cool-down it does nothing.
- `script.crazy_mode_allow_again`: clears the once-per-window lockout.
- `automation.crazy_mode_emergency_abort`: cancels the run when
  `binary_sensor.emergency_active` turns on and puts the house back, with the
  loop lights left bright rather than as snapshotted.

## How a run goes

1. Start checks `binary_sensor.crazy_mode_allowed` (reason in
   `sensor.crazy_mode_reason`). Refusals for the window reasons are spoken on
   the kitchen speaker; house mode, empty house and emergency stay silent.
2. Snapshots: the four Sonos speakers with their groups (`sonos.snapshot`),
   and one scene (`scene.crazy_mode_snapshot`) of the loop's leaf lights plus
   the kitchen, family room and foyer Adaptive Lighting switches.
3. Adaptive Lighting goes off for those three rooms, the kitchen manual latch
   (`kitchen_lights_manually_toggled`) is set if it was off, the speakers join
   under the kitchen.
4. `script.crazy_mode_run` plays the phases on deadlines from its own start
   time. Voice lines go through `script.announcement_engine` without blocking,
   so they cannot stretch the clock (the engine caps volume at 75).
5. `script.crazy_mode_restore` ends it: Sonos, the scene (which returns
   Adaptive Lighting), the latch only if this run set it, phase Off last.

## Helpers

No helper has `initial:`; values survive restarts. State is
`input_select.crazy_mode_phase`; `timer.crazy_mode_phase` is only the display.

| Helper | Purpose |
|---|---|
| `input_datetime.crazy_mode_{morning,evening}_{start,end}` | Windows. Same day, start before end. Set on the dashboard, no times in this repo. An unset window never allows a start. |
| `input_datetime.crazy_mode_last_run` | Set at each start; the window is used up once the last run is inside it. |
| `input_text.crazy_mode_favorite_{crazy,slowmo,cooldown}` | Sonos favorite names, exact and case sensitive. Empty or unknown names refuse the start (`favorite_missing`). |
| `input_number.crazy_mode_base_volume` | Crazy plays at this level; Slow-mo about 70% of it, Cool-down about 45%. |
| `input_boolean.crazy_mode_stop_requested` | The stop button's request; only the Crazy and Slow-mo waits read it. |
| `input_boolean.crazy_mode_kitchen_latch_set` | This run set the kitchen latch, so it clears it. |

## Reasons (first match wins)

`running`, `emergency`, `house_mode` (Bedtime, Quiet, Away, Vacation),
`not_occupied`, `window_unset`, `outside_window`, `already_ran`,
`favorite_missing`, else `ok`. The house mode is read, never set.

## Known gaps

- Restart mid-run: the snapshots are lost. `crazy_mode_cleanup_on_start` resets
  the phase, turns Adaptive Lighting back on and clears our latch; Sonos and
  lights stay as they are.
- Only the kitchen has a manual latch, and `kitchen_lights_to_off` ignores it
  on vacancy, so the run re-sets the lights every tick instead.
- A restore after a run puts back what the snapshot held; changes made by hand
  during the run are lost.

## Deploy

Reload input_select, input_boolean, input_text, input_number, input_datetime,
timer, template, script and automation. Then set the helpers on the dashboard
(`#crazy_mode`).
