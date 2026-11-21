# LEARNINGS — packages/office/

## Manual override latch (JK-1145)

`office_lighting_automations` is hand-only (no `initial:`). A hand change sets `office_lights_manually_toggled` (`office_lights_manual_change`); `office_lights_reset_manual_toggle` clears it (empty 30 s, room Off, house empty). Nothing writes the flag now: `office_not_occupied` no longer re-enables it, and the two disabled `office_lighting_automation_on/off` files are deleted.

The old detection (`office_lights_manually_turned_off`, `initial_state: off`) is replaced and enabled. It watched `light.office_light_switch`; the new one watches that and `light.office_ceiling_bulbs`, which is what the on-type automations turn on. The switch/bulb sync automations carry a parent and no user, so their changes are ignored. The bulbs are a Hue group: if a late device report latches falsely, check the logbook for the latch right after a motion-on.

Decisions per automation:

| Automation | Decision |
|---|---|
| `office_lights_motion_on`, `office_lights_day_on`, `office_lights_on` | on-type from occupancy/motion/illuminance: latch gate after the room flag, before the mode check |
| `office_lights_off` | room Off bypasses both flags; vacancy needs the hand flag (house flag added) |
| `office_lights_day_off`, `office_lights_motion_off` | off-type: hand flag only (motion_off gained it) |
| `office_lights_sync_*`, `office_lights_scene_toggle` | mirror or follow the user's switch/button: not gated |
| `office_dnd_light_*`, `office_camera_light_*`, deep-work shelf lights | follow DnD, the Mac or docked work-laptop camera, or focus mode, not occupancy: not gated |

DnD keeps the lights on: `office_lights_on` and `office_lights_day_on` pass Auto and DnD; `office_lights_motion_on` only Auto. The latch gate sits ahead of that mode block and passes the same modes.

## JK-1219 deliberately not applied

`office_mode_off` still does not turn `office_occupied` off. It runs at house empty, Away and Bedtime. Listeners of occupancy going off: `office_music_off`, `office_speech_notifications_off`, `office_dnd_off` (clears office DnD, which re-runs `office_mode_auto`), `office_camera_light_off`, `turn_off_office_shelf_lights`, the air-quality detections, announcement routing. At Bedtime, with John still working in the office, forcing occupancy off would drop his speech notifications and can bounce the room back through DnD off, so the room is left alone. The latch is still cleared by the reset on room Off.

## Call lighting (JK-692)

- The office AL entry controls only the four ceiling bulbs (`light.office_light_1..4`). The lamp is onoff-only and gets no colour.
- Gate: AL kelvin below the setting, or AL brightness more than 5 below it. Brightness alone is near-always true at the 100 default.
- End also fires on `john_dnd_active` off for 30 s, so AL is back ~30 s after the call, not ~3 min. Office DnD still lingers 2 min, so a new call in that window never re-enters DnD: start therefore also triggers on `john_dnd_active` on (10 s). The flag-off condition keeps the two start triggers from double-running.
- Start's own `light.turn_on` has an automation parent context, so `office_lights_manual_change` ignores it; AL resume uses `:al:` contexts.
- Residual risk: a late Hue device report could latch `office_lights_manually_toggled`. Check the logbook after the first real call.
- Start requires the manual latch off, the hand flag on, and the DnD select.
- End and reset call `switch.turn_on` only when `entertainment_mode` is off, and always clear the flag.
- Accepted cases: entertainment ending mid-call turns AL on for the rest of that call; a manual AL off mid-call is overridden at call end; reset on HA start/reload is best effort (3 h when not in DnD, 12 h hard cap are the guarantee).
- The numbers and flags have no `initial:`, so they start off / at min. The feature switch gates everything until John seeds 3000 / 100.

## DnD source

- DnD comes only from camera/mic: `binary_sensor.john_dnd_active` = `input_boolean.john_dnd` (manual toggle, or an external work-laptop writer) or the personal Mac camera/mic sensors. 5 s `delay_on`, no `delay_off`; `office_dnd_off` waits 2 min.
- Mac sensors go unavailable when it sleeps, so camera-light off conditions use `not ... on`.
- The El Gato follows `input_boolean.john_work_laptop_camera` AND `_docked`, not `john_dnd`: the laptop can't tell the El Gato camera from the built-in one, and `john_dnd` also fires on mic-only calls. HA's `not` fails if any child passes, so the work pair is wrapped in an `and` inside the `not`. On-triggers wait 8 s: plugging into the dock blips the camera ~4.4 s (measured 2026-11-20). The office-vacant trigger (`id: office_vacant`) bypasses the work pair, so a laptop that crashed with both booleans on can't hold the light on; the on side re-checks on occupancy returning.
- The calendar DnD pieces (work call, personal time, Bayesian sensor) were deleted; their registry entries are ghosts.
