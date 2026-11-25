---
title: Entertainment Mode Refactor
slug: jk-1166-entertainment-mode-refactor
status: complete
created: 2026-11-23
has_pre_mortem: false
has_review: true
has_prd: true
linear: JK-1166
---

# Entertainment Mode Refactor

## Problem

Entertainment mode is one boolean, `input_boolean.entertainment_mode`, and two central automations that do all the work (`packages/house/entertainment/`):

- `entertainment_mode_activated` turns off five Adaptive Lighting switches (foyer, kitchen, office, family room, main bedroom) and the house-wide `input_boolean.speech_notifications`, then arms the deactivate automation with `automation.turn_on`.
- `entertainment_mode_deactivated` (`initial_state: off`) undoes that when the mode turns off or the house empties, then disarms itself.

Three things are wrong:

1. **The rooms don't own their behaviour.** A new room means editing the central files. The first-floor rooms the issue names are barely covered: the playroom Adaptive Lighting switch is missed, and the dining room has nothing.
2. **Nothing stops the room automations that fight the mode.** The "music off when unoccupied" automations still fire, so music pauses when people drift out of a room. `kitchen_speech_notifications_on` and `family_room_speech_notifications_on` turn their room switches back on as people move around. `house_mode_speech_on` turns the master switch back on when the house returns to Auto.
3. **It breaks across a restart (the JK-1262 rule).** `entertainment_mode` has `initial: off`, so a restart silently ends the mode in the UI while the lights stay as they were. `entertainment_mode_deactivated` has `initial_state: off` and is armed and disarmed by another automation, which is exactly the pattern the rule forbids. It is on the `KNOWN_REMAINING` list in `tests/test_restart_restore_regressions.py`. After a restart during a party, nobody disarms or arms anything correctly.

The issue also asks for music: a playlist (Sonos favourite or Spotify) at about 30% on the indoor speakers, or the outdoor ones in summer.

## Goal

Each first-floor room reacts to the boolean itself: mode on pauses that room's Adaptive Lighting, speech notifications and the music-off automations; mode off puts them back. State survives a restart. Phase 2 adds music with a zone choice (Indoor / Outdoor / Off), a playlist and a volume.

## What I verified in the repo

- **Boolean readers (all keep working, unchanged):** `packages/general_notifications.yaml` (important-only trigger), front and garage auto-locks (`front_door_lock_if_open_too_long`, `garage_entry_door_lock_if_open_too_long`, `garage_entry_door_auto_lock_in_evening`, `garage_entry_door_evening_auto_lock`), vacuums (`main_level_vacuum_evening_cleaning`, which reads `last_changed`, and `vacuums_clean_kitchen_during_nap`), office call lighting (start/end/reset), `turn_off_office_shelf_lights`, `main_floor_climate_activate_eco_when_energy_is_expensive`, and the dashboard (`house_mode_popup.yaml:118`, `more/people.yaml:81`). The house mode resolver never outputs Entertainment (resolved 2026-10-30, `plans/house-mode-resolver`); nothing here changes that.
- **Tests that pin the old files:** `tests/test_office_call_lighting.py::test_entertainment_toggles_same_al_switch` reads `entertainment_mode_{activated,deactivated}.yaml` and asserts the office AL switch is in them. `tests/test_restart_restore_regressions.py` lists `entertainment_mode_deactivated` in `KNOWN_REMAINING`. Both need updating.
- **Adaptive Lighting switches that exist:** `switch.adaptive_lighting_{kitchen,family_room,playroom,foyer,office,main_bedroom}`. The dining room has none (its lights are not under Adaptive Lighting). AL is UI-configured, so I can't see the switch list from git; the dashboard references the playroom one (`rooms/main_floor/playroom.yaml:178`).
- **Room speech switches:** `input_boolean.kitchen_speech_notifications`, `family_room_speech_notifications`, `office_...`, `main_bedroom_...` exist. The playroom and dining room have none. `script.voice_announcement` (`packages/announcements/voice_announcement.yaml:350-380`) checks the room switch for office, family room, kitchen and main bedroom; the playroom is included whenever it is occupied; the dining room is never targeted. So a dining-room or playroom speech switch would be either unused or a behaviour change.
- **Music-off automations (all gated by `initial_state: on`, none armed at runtime):** `kitchen_music_off`, `family_room_music_off`, `family_room_tv_off`, `playroom_music_off`. A fifth one I found that the issue did not name: **`playroom_media_player_unjoin`** also unjoins the playroom speaker when the room empties or the player has paused 10 or 30 minutes. It would pull the playroom out of an entertainment group, so it must be gated the same way.
- **Speakers:** indoor `sonos_kitchen`, `sonos_family_room`, `sonos_living_room` (the dining room's speaker), `sonos_playroom`; outdoor `sonos_patio`, `sonos_pool`, `sonos_gazebo`. Nothing in the repo today stops outdoor music; `sunroom_not_occupied` only reads `sonos_patio` to clear its own flag.
- **Crazy Mode is the model for music** (`packages/house/crazy_mode/`): a template sensor holds the zone's speaker lists (`sensor.crazy_mode_zone_config`), favourites are Sonos favourite names in `input_text` helpers played with `media_player.select_source`, the volume is an `input_number`, and nothing carries `initial:`. Its main-floor zone has the same four indoor speakers.
- **Party Time** (`packages/playroom/party_time/`) plays a hard-coded Spotify playlist with `media_player.play_media`. It is a playroom button, not a mode, and I leave it alone. It has a bug (below).

## Decisions (John, Linear comment 2026-11-25; counts as /approve for both phases)

All ten questions are answered yes, and the defaults above stand. Q3 reads "if it's on, yes": the family room TV stays on if it was already on, and the mode never turns it on. Q4: no new playroom or dining room speech switches. Q5: Sonos favourites for now.

Additions from his comment:

- **Dining room speaker.** The dining room is sometimes called the living room (it was once one room with the dining space). Its Sonos is `media_player.sonos_living_room`, confirmed in the repo: `dashboards/kohbo/rooms/main_floor/dining_room.yaml` shows the "Dining Room" music card on that player, and `announcement_engine`, `doorbell_ring` and `hourly_dong` target it. No `sonos_dining_room` exists anywhere. No host check was needed.
- **The TV is not part of the music grouping.** `media_player.sony_bravia_tv` is never in a zone list and music never calls it. The TV stays on through the mode via the `family_room_tv_off` gate. **Correction (John, 2026-11-25):** there is no soundbar. The family room TV and the family room Sonos are different devices (the Sonos is an Amp powering in-ceiling speakers), so `media_player.sonos_family_room` always joins indoor music. I had first left that speaker out of the group while the TV was on; that rule is removed, and nothing in the entertainment files reads or calls the TV.
- **Crazy Mode and entertainment music are mutually exclusive, both ways.**
  - Entertainment music skips its start while `input_select.crazy_mode_phase` is not `Off` (as planned).
  - Reverse: `sensor.crazy_mode_reason` gets a new `entertainment` reason (after `emergency`, before `house_mode`) that refuses a Crazy Mode start while `input_boolean.entertainment_mode` is on. It is silent, like the house-mode and emergency refusals; only the window reasons are spoken. This keeps Crazy Mode from snapshotting, regrouping and restoring the speakers under an entertainment session.
  - A mode that turns on in the middle of a Crazy run starts no music (the Crazy guard); the run finishes and restores as usual.
- **Party Time bug.** `playroom_deactivate_party_time` is not touched by this work, so the `turn_on` that should be `turn_off` stays a BACKLOG item.

## Approach

**Rooms gate on the boolean with conditions, not with `automation.turn_on/off`.** Turning the music-off automations off and on from another automation is the pattern JK-1262 removed (a restart or reload leaves them in the wrong state). A condition on `input_boolean.entertainment_mode` is read live, so it is correct after any restart and nothing has to be armed or remembered.

**Restore is stateless.** The boolean is a restored helper (no `initial:`). The per-room "on" and "off" automations are edge-triggered and idempotent, so a restart in the middle of a party does nothing. Adaptive Lighting and the room speech switches are restored by HA like every other helper. No new automation uses `automation.turn_on/off`, and none is armed by another.

### Phase 1: per-room refactor and restart safety (no music)

New files in each room's package, one automation per file, filename equals id (basenames must be globally unique, because `!include_dir_named` keys packages by basename):

| Room | Mode on | Mode off |
|---|---|---|
| Kitchen | AL kitchen off; `kitchen_speech_notifications` off | AL kitchen on; speech switch on only if the room is occupied and in Auto or Dim (the same test as `kitchen_speech_notifications_on`) |
| Family room | AL family room off; `family_room_speech_notifications` off | AL on; speech switch on if occupied and Auto |
| Playroom | AL playroom off | AL playroom on |
| Dining room | nothing to pause today (no AL, no speech switch, no music-off) | nothing |
| Foyer, office, main bedroom (see Q1) | AL off, as today | AL on, as today |

Files: `packages/<room>/modes/<room>_entertainment_mode_on.yaml` and `..._off.yaml` for kitchen, family_room, playroom, foyer, office, main_bedroom. Conditions: global (`house_occupied` on for the "on" automation, as the old one required) then feature. Triggers are `input_boolean.entertainment_mode` to on, and to off.

House-level pieces (these are not room behaviour, so they stay in `packages/house/entertainment/`):

- `entertainment_mode_house_empty_off.yaml`: `house_occupied` off turns the boolean off. This replaces the old "or the house empties" trigger, and then every room's "off" automation fires from the boolean. Needs `for:` (house_occupied flips briefly on group reloads; see `packages/house/LEARNINGS.md`), say 2 minutes.
- `entertainment_mode_speech_pause.yaml` and `entertainment_mode_speech_resume.yaml`: the master `input_boolean.speech_notifications` (house-wide, so it is not any one room's). Resume turns it on unconditionally, as today.
- `entertainment_mode_bedtime_off.yaml` (see Q8): bedtime on turns the mode off.

Gating the automations that fight the mode (add one condition, first in the list, `input_boolean.entertainment_mode` is `off`):

- `kitchen_music_off`, `family_room_music_off`, `family_room_tv_off` (Q3), `playroom_music_off`, `playroom_media_player_unjoin`.
- `kitchen_speech_notifications_on`, `family_room_speech_notifications_on` (so moving between rooms doesn't turn them back on), and `house_mode_speech_on` (so the house returning to Auto doesn't turn the master switch back on). `house_mode_quiet_speech_off` needs nothing.
- The `_off` speech automations (`kitchen_speech_notifications_off`, ...) are left alone: turning a room's switch off when the room empties is fine during the mode.

Restart safety:

- Remove `initial: off` from `entertainment_mode.yaml`.
- Delete `entertainment_mode_activated.yaml` and `entertainment_mode_deactivated.yaml`. This also drops the `initial_state` + `automation.turn_on/off` pairing; remove `entertainment_mode_deactivated` from `KNOWN_REMAINING`.
- Add `entertainment_mode` to `HELPERS` in `tests/test_restart_restore_regressions.py`.
- Note: once `initial: off` is gone, a restart no longer clears a mode someone forgot. That is the reason for the bedtime and house-empty automations above.

Tests (new file `tests/test_entertainment_mode.py`, plus edits to two existing ones):

- every per-room pair exists, triggers on the boolean with the right `to`, and the "on" file turns that room's switches off while the "off" file turns them on;
- the old central automations are gone; no entertainment file uses `automation.turn_on/off` or `initial_state`; the helper has no `initial`;
- each gated automation has the boolean condition and it is the first condition;
- the room speech "off" restore keeps its occupied and mode conditions;
- structure and trigger-shape checks for the house-level pieces (`for:` on house-empty);
- sabotage list for the reviewer: drop the gate from each of the seven gated automations, drop the occupied guard from the kitchen resume, remove `for:` from house-empty, put `initial: off` back;
- `test_office_call_lighting.py::test_entertainment_toggles_same_al_switch` is repointed at `office_entertainment_mode_{on,off}.yaml`.

Docs: `packages/house/entertainment/README.md` (new, short: the pattern, how to add a room), `packages/house/LEARNINGS.md` (the gate-by-condition rule and the fifth music automation), `docs/AUTOMATIONS.md` line 48, `docs/ROOMS.md` if rooms list modes, and a line in `packages/CLAUDE.md` Restart-surviving state.

### Phase 2: music

Helpers in `packages/house/entertainment/entertainment_helpers.yaml`, none with `initial:`:

- `input_select.entertainment_music_zone`: `Indoor`, `Outdoor`, `Off` (the first option is the value on first creation, so Indoor is the default).
- `input_text.entertainment_favorite`: the chosen Sonos favourite name, exactly. A Spotify playlist works if it is saved as a Sonos favourite (one step in the Sonos app).
- `select.entertainment_playlist` (a template `select`): its options come from `state_attr('media_player.sonos_kitchen', 'source_list')` and choosing one writes `input_text.entertainment_favorite`. The popup gets a real dropdown with no typing. Fallback if this turns out not to render (to check on the host): type the name into the `input_text`, as Crazy Mode does.
- `input_number.entertainment_volume`: 10 to 70, step 5. First creation lands on the minimum, so set it to 30 once on the dashboard (same one-time step Crazy Mode needed).
- `input_boolean.entertainment_music_started`: on when this mode started the music, so the stop only touches what it started.
- `sensor.entertainment_zone_config` (template sensor, same shape as Crazy Mode's): `indoor` = kitchen, family room, living room (dining), playroom with the kitchen as coordinator; `outdoor` = patio, pool, gazebo with the patio as coordinator. Its own lists, not a read of Crazy Mode's, so the two can change independently.

Automations (one per file):

- `entertainment_music_start`: mode on. Conditions global to feature: `house_occupied` on, bedtime off, no emergency (`binary_sensor.emergency_active` off), `crazy_mode_phase` is `Off`, zone is not `Off`, favourite is in the first speaker's `source_list`. Actions: set the started flag, unjoin every zone speaker, join them under the coordinator, set the volume on the speakers, `select_source` the favourite on the coordinator, shuffle on after a 3 second delay (the Crazy Mode order). A missing favourite logs a warning and does not start music.
- `entertainment_music_stop`: mode off. Condition: started flag on. Pauses the coordinator, unjoins the speakers and clears the flag.
- `entertainment_music_zone_change`: zone changes while the mode is on and the flag is on. Stops the old zone, starts the new one (Q6).

The dashboard `house_mode_popup.yaml` gets the zone select, playlist select and volume next to the Entertainment toggle. This is dashboard-only; per John's standing rule it can be merged and deployed together with the phase.

Tests: zone config shapes for both zones, start conditions and order, the stop touches only a flagged start, no `initial:` on any helper, volume maths (30% is 0.3), and sabotage (drop the Crazy Mode guard, drop the started-flag condition on stop).

Phase 2 depends on phase 1 only for the boolean. It can ship separately.

## Questions (all answered yes by John, 2026-11-25; defaults in bold)

1. **Foyer, office and main bedroom today pause Adaptive Lighting with the mode.** Keep that as small per-room files (**yes, no behaviour change**) or drop it and leave only kitchen, family room and playroom?
2. **Master speech switch.** It is house-wide, so I keep one small pause/resume pair for it in `house/entertainment/` (**yes**). Room switches are handled per room. OK?
3. **Family room TV off when the room empties.** Gate it too, so the TV stays on during the mode (**yes**).
4. **Playroom and dining room speech switches.** No new helpers (**none**): the dining room is never announced to, and the playroom isn't gated by a room switch today (the master pause covers it). Add them anyway?
5. **Playlist source.** Sonos favourites dropdown, which includes Spotify playlists saved as Sonos favourites (**yes**) or hard-coded playlists like Party Time?
6. **Changing the zone mid-party moves the music** (**yes**), but changing the playlist waits for the next start. OK?
7. **Volume.** One slider for indoor and outdoor, 30% (**one slider**) or a second slider for outdoor?
8. **Auto-off.** The mode turns off when the house empties (as today). Since a restart no longer clears a forgotten mode, also turn it off when bedtime starts (**yes**)? A fixed time cap instead or as well?
9. **Mode off stops the music we started** (**yes**) rather than leaving it playing.
10. **Crazy Mode overlap.** Entertainment music doesn't start while a Crazy Mode run is active (**yes**). **Resolved:** Crazy Mode also refuses to start while the mode is on (see Decisions).

## Risks and checks at build time

- **Mode on while someone is in the room with music already playing:** phase 1 doesn't touch it; phase 2 replaces it. Say so in the popup text.
- **Exit leaves music in an empty room (phase 1 only):** the music-off gate means nothing pauses music when the mode turns off. Today nothing does either, and phase 2's stop covers started music. The unoccupied rooms self-correct on their next occupancy change.
- **Outdoor speakers:** `pool_should_doorbell_chime` reads `sonos_pool` playing, and `doorbell_ring` adds the pool speaker when it is playing, so outdoor music changes where doorbell chimes sound. Confirm that is wanted before merge.
- **Entity references:** `tests/test_entity_references.py` must see every new helper defined; confirm `switch.adaptive_lighting_playroom` is a live entity on the host with the homelab agent before relying on it (AL is UI config).
- **Mirror and migration:** no secrets or personal data; nothing here needs `secrets.yaml`. The old central automations are deleted; the registry will keep two orphaned automation entities until cleaned in the UI.

## BACKLOG candidates (not in this work)

- `playroom_deactivate_party_time` calls `input_boolean.turn_on` on `playroom_party_time_boolean` where it should turn it off (`packages/playroom/party_time/playroom_deactivate_party_time.yaml`), so the boolean never clears.
- `plans/bermuda-migration-review.md` still refers to `entertainment_mode_turn_{on,off}.yaml` summing ESPresense counts. Those files no longer exist; the note is stale.

## Verification

`PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`. No `./deploy.sh --check`, no deploy. After merge John deploys with `--reload --skip-ci`; helpers need a Helpers/Template/Group reload from Developer Tools, not an automation reload.
