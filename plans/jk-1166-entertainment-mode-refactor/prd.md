# PRD: JK-1166 Entertainment Mode Refactor

## Goal

Each first-floor room reacts to entertainment mode itself, the mode survives a restart, and phase 2 plays music in a chosen zone. Plan: `plan.md` (approved by John, 2026-11-25).

## Tasks

### task-1: Restart-safe boolean and house-level pieces

Drop initial from entertainment_mode, delete the two central automations, add house-empty off (with for), bedtime off, master speech pause/resume.

- AC: input_boolean.entertainment_mode has no initial
- AC: entertainment_mode_activated and _deactivated files are gone
- AC: house-empty off triggers on house_occupied off for 2 minutes and turns the boolean off only when it is on
- AC: bedtime off turns the boolean off; speech pause/resume turn input_boolean.speech_notifications off/on on the boolean edges
- AC: no entertainment file uses automation.turn_on/off or initial_state

### task-2: Per-room on/off pairs

Kitchen, family room, playroom, foyer, office, main bedroom each get <room>_entertainment_mode_on/_off in packages/<room>/modes/.

- AC: on files turn the room's AL switch off (and kitchen/family room speech boolean off)
- AC: off files turn the AL switch on; kitchen and family room speech back on only if occupied and in the same modes as the room's speech_on automation
- AC: dining room has no file
- AC: filename equals id; header comment; modern syntax; conditions global to feature

### task-3: Gate the automations that fight the mode

Add entertainment_mode off as the first condition on kitchen/family_room/playroom music off, family_room_tv_off, playroom_media_player_unjoin, kitchen/family_room speech_notifications_on, house_mode_speech_on.

- AC: each of the 8 has the condition first in conditions
- AC: TV never turned on by the mode

### task-4: Phase 1 tests and docs

tests/test_entertainment_mode.py; update test_office_call_lighting and test_restart_restore_regressions; README, LEARNINGS, AUTOMATIONS.md.

- AC: new tests pass and each sabotage in the plan goes red
- AC: existing tests updated, KNOWN_REMAINING drops entertainment_mode_deactivated, HELPERS has the boolean
- AC: full suite green

### task-5: Music helpers and zone config

input_select zone, input_text favourite, template select playlist, input_number volume, started flag, sensor.entertainment_zone_config (indoor via sonos_living_room as dining, outdoor).

- AC: no helper has initial
- AC: indoor speakers are kitchen, family_room, living_room, playroom; coordinator kitchen
- AC: outdoor speakers are patio, pool, gazebo; coordinator patio
- AC: no TV entity in any list

### task-6: Music start, stop and zone-change automations

Start on mode on with guards, stop on mode off when started flag set, move on zone change.

- AC: start guards: house_occupied, bedtime off, no emergency, crazy phase Off, zone not Off, favourite in source_list
- AC: volume set from helper/100 on speakers; family room speaker left out when the TV is on
- AC: stop only when flag on; clears flag
- AC: zone change only while mode and flag on

### task-7: Crazy Mode mutual exclusion

Add an entertainment reason to sensor.crazy_mode_reason.

- AC: reason is entertainment when the mode is on (after emergency, before house_mode)
- AC: start refusal is silent for it
- AC: existing crazy tests stay green

### task-8: Dashboard popup controls

House mode popup gets zone, playlist and volume next to the Entertainment toggle.

- AC: only existing and new helper entities are referenced
- AC: dashboard tests green

### task-9: Phase 2 tests and docs

Tests for zone config, start/stop, crazy reason, helpers; README/LEARNINGS.

- AC: sabotage: drop crazy guard, drop started-flag condition on stop
- AC: full suite green

