# LEARNINGS — packages/playroom/

## Manual override latch (JK-1145)

`playroom_lighting_automations` is hand-only. A hand change to `light.playroom_lights` sets `playroom_lights_manually_toggled` (`playroom_lights_manual_change`); `playroom_lights_reset_manual_toggle` clears it (empty 30 s, room Off, house empty). `playroom_not_occupied` no longer re-enables the flag.

Gated by the latch (on-type): `playroom_lights_motion_on`, `playroom_lights_day_on`. Hand flag only (off-type): `playroom_lights_day_off`, `playroom_lights_to_off` (room Off bypasses both).

Left alone: `playroom_lights_off` and `playroom_lights_motion_off` are disabled (`initial_state: off`, motion_off also disables itself); they never wrote the flag. `playroom_lights_off` has a `swtich.` typo that would bite if it were revived.

## Occupancy-off listeners (checked for JK-1219)

`playroom_mode_off` now also turns `playroom_occupied` off at Away, bedtime, house empty and restart. Listeners of occupancy going off: `playroom_music_off` and `playroom_media_player_unjoin` (pause/unjoin the playroom Sonos; both already fire on the room going Off), `playroom_lights_to_off`, the reset automation. Announcement routing, hourly dong, doorbell and the first-floor area only read the state. Nothing new fires at bedtime that Off didn't already do.
