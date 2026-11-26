# Entertainment Mode

`input_boolean.entertainment_mode` is toggled from the house mode popup. It has
no `initial:`, so a restart keeps it. Each room reacts to it on its own; there
is no central automation that does the work.

## Rooms

`packages/<room>/modes/<room>_entertainment_mode_on.yaml` and `_off.yaml` (the
main bedroom's are in `mode/`):

| Room | On | Off |
|---|---|---|
| Kitchen | Adaptive Lighting off, `light.kitchen_lights` and `light.kitchen_led` on at 100%, room speech off | Adaptive Lighting on; speech on if the room is occupied and Auto or Dim |
| Family room | Adaptive Lighting off, `light.family_room_main_lights` on at 100%, room speech off | Adaptive Lighting on; speech on if occupied and Auto |
| Foyer | Adaptive Lighting off, `light.foyer_lights` on at 100% | Adaptive Lighting on |
| Dining room | `light.dining_room_lights` on at 100% (no Adaptive Lighting, no speech switch) | nothing (no off file) |
| Playroom, office, main bedroom | Adaptive Lighting off | Adaptive Lighting on |

Lights come on whatever the daylight (no lux gate). The "on" files need the
house occupied. The "off" files have no conditions: the house emptying ends the
mode, and the rooms still have to resume.

## Light hold and hand-back

While the mode is on, the lights-off automations stand down: `foyer_lights_to_off`
(Off path only; Away still turns off), `foyer_lights_day_off`,
`foyer_lights_nightlight_off`, `kitchen_lights_to_off`, `kitchen_lights_day_off`,
`family_room_lights_to_off` and `dining_room_lights_off`. Each has an
`entertainment_mode` is `off` condition.

When the mode ends, each one also triggers (`on` to `off`) and its normal
conditions decide: an empty or Off room goes dark, any other keeps its lights
(the kitchen re-checks vacancy only, so an occupied kitchen in Off stays lit).
Nothing turns lights off directly. Occupied Auto rooms stay on until their usual
rules turn them off.

To add a room, copy a pair. Basenames must be globally unique.

## House-level

- `entertainment_mode_speech_pause` / `_resume`: the house-wide `input_boolean.speech_notifications`.
- `entertainment_mode_house_empty_off`: house empty for 2 minutes ends the mode.
- `entertainment_mode_bedtime_off`: bedtime ends the mode.

## What stands down while the mode is on

These check `input_boolean.entertainment_mode` is `off` as their first condition
(never `automation.turn_off`, which a restart would undo): `kitchen_music_off`,
`family_room_music_off`, `family_room_tv_off`, `playroom_music_off`,
`playroom_media_player_unjoin`, `kitchen_speech_notifications_on`,
`family_room_speech_notifications_on`, `house_mode_speech_on`. The family room
TV is never turned on or off by the mode.

## Music

Starts with the mode, stops with it (only what it started).

- `input_select.entertainment_music_zone`: Indoor, Outdoor or Off.
- `select.entertainment_playlist`: a dropdown of the kitchen speaker's Sonos
  favorites; it writes `input_text.entertainment_favorite`. A Spotify playlist
  works once it is saved as a Sonos favorite.
- `input_number.entertainment_volume`: set it once (it starts at 10).
- `sensor.entertainment_zone_config`: indoor is kitchen, family room, living
  room (the dining room's speaker) and playroom; outdoor is patio, pool and gazebo.
- `script.entertainment_music_start` / `_stop`, called by `entertainment_music_on`,
  `_off` and `_zone_change`. Changing the zone during a session moves the music; a
  new playlist waits for the next start.
- Start skips quietly unless the mode is on, the house is occupied, it is not
  bedtime, there is no emergency and Crazy Mode is not running. A missing favorite
  logs a warning.
- The family room Sonos (an Amp on in-ceiling speakers) always joins indoor
  music. The TV is a separate device the mode never groups, calls, turns on or off.
- Crazy Mode refuses to start while the mode is on (`sensor.crazy_mode_reason` =
  `entertainment`), so the two never share the speakers.
