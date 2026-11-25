---
title: Home Quick Actions
slug: jk-1074-quick-actions
status: draft
created: 2026-11-23
revised: 2026-11-24
linear: JK-1074
has_pre_mortem: false
has_review: false
has_prd: false
related: [notification-deep-links, room-lighting-override, kid-at-school-detection]
---

# Home Quick Actions

> Revised after John's answers: phones only, a flyout menu, and his own action list (Linear comment on JK-1074). The first draft's notification count, bed-light-group and vacuum chips are dropped; none maps onto his list.

## Problem

The things John does by hand several times a day are scattered: a lamp is two taps into a room page, Do Not Disturb is on the People page, camera notifications are on the security page, "Nino stays home today" is on the School page. He wants one place, on the Home view, that offers only what makes sense right now.

## Goal

A quick actions flyout on Home. It lists only the actions that apply to the person holding the phone at this moment, each one tap. Per-person: John's menu is not Cristina's.

## John's list, and what exists

| # | Action | Verdict |
|---|---|---|
| 1 | Link to the room you're in | Buildable. Needs the live area-to-view map. |
| 2 | Turn off my bedside nightlight | Buildable. Entities exist. |
| 3 | Toggle Nino's / Gianluca's nightlights | Buildable. Entities exist. |
| 4 | Toggle Nino's bedtime music | Needs one new script (the start sequence is inline in an automation). |
| 5 | Toggle DnD for me | Buildable for John. Cristina has no DnD helper. |
| 6 | Pause camera notifications | Buildable, with one catch (below). |
| 7 | Toggle kid home from school | Buildable. Helpers and school-day sensors exist. |

## Where the flyout opens from

**Recommendation: a ⚡ chip in the Home header, next to the bell, opening a `#quick_actions` bubble-card pop-up with a badge count.**

Why, against the fixed-banner finding:
- The bottom area is already contested. `horizontal_action_card_fixed` pins every banner at `bottom: 89px` (just above the navbar). The vacuum and Crazy Mode banners already take turns in that slot and the camera banners can also show. A floating bottom button would sit on or under whichever banner is up, on exactly the phones this is for.
- The header is free of that conflict and has a precedent: the bell opens `#notifications` the same way, from the same row, as a pop-up in `home.yaml`. Same component, same styles (`kohbo_popup_styles.yaml`), nothing new to learn or to break.
- The thumb-reach argument for a bottom button is real but weaker than a button that is covered by a banner some of the time.

Header layout: the header is three chips (safety alert on the left holding its slot so the title stays centred, title, bell). Adding a ⚡ means two chips on the right, so the left needs a matching pair or spacer or the title shifts. I'll confirm the fix on the live DOM, per the earlier lesson that reasoning about this CSS from source made it worse.

Badge: the number of contextual actions available right now (items 1 to 4, 6 and 7 below when they show; the always-there toggles do not count, otherwise it never reads zero). It comes from a per-person count sensor.

Inside the pop-up: one row per action, each a `conditional` on a binary_sensor (`condition: state`; conditional cards reject `condition: template`). Rows with no applicable action do not render. The pop-up with nothing to show says "Nothing right now".

## Per-user visibility

- Phones only, so each phone is signed in as its person. Rows carry `visibility` with `condition: user`, using the HA user id read through `!secret` (`john_ha_user_id`, `cristina_ha_user_id`; placeholders in `secrets.fake.yaml`). The repo is public, so no real ids go in.
- Not yet proven: that `!secret` is accepted inside a `users:` list in dashboard YAML. First thing the build checks, on a render. If it is not, the fallback is a person-name helper per user, set from the companion app, with `condition: state`.
- John's ids: `sensor.john_room_presence`, `binary_sensor.john_bed_occupied`, `input_boolean.john_is_in_bed`. Cristina's: `sensor.cristina_room_presence`, `binary_sensor.cristina_bed_occupied`, `input_boolean.cristina_in_bed`.

## The actions

Every "shows when" rule is a template binary_sensor in `packages/house/quick_actions/` (one file each). No clock times are hard-coded in new code: day and hour come from existing sensors. `unavailable` and `unknown` inputs always resolve to hidden.

### 1. Room you're in

- **Entities:** `sensor.<person>_room_presence` (state is an HA `area_id`; also `not_home`, `unknown`). Views are `rooms-<slug>`.
- **Shows when:** the person's presence is an area that has a mapped room page.
- **Tap:** navigate to `/dashboard-kohbo/rooms-<slug>`.
- **Visibility:** each person sees their own.
- **Build note:** one row per mapped area (about 19), each a `conditional` on `state` of the presence sensor. No JS, no helper. The area ids in the repo are inconsistent with the view slugs (`nino_room`, `mud_room` and `mudroom` all appear), and the area registry is not in the repo, so the map is read from the live registry (homelab agent, read-only) before writing. A test asserts every mapped path is a real view.

### 2. Turn off my bedside nightlight

- **Entities (found):** John's lamp `light.hue_ambiance_lamp_1`, Cristina's `light.hue_ambiance_lamp_1_2` (labelled "John's Lamp" and "Cristina's Lamp" on the bedroom page). Both belong to the `light.main_bedroom_lights` group. `main_bedroom_john_night_light` turns John's lamp on at night; `main_bedroom_john_night_light_off` turns both off 10 minutes after he is in bed, or 10 minutes after the lamp came on.
- **Shows when:** the person's lamp is on, and the person's `room_presence` is `main_bedroom`, and the person is in bed (`input_boolean.<person>_is_in_bed` / `_in_bed`). Optionally relax "in bed" to "bed occupied" if the helper lags (to decide at build against a recorder sample).
- **Tap:** `light.turn_off` on that person's lamp only.
- **Visibility:** each person sees only their own lamp.
- **Notes:** the existing automation already switches it off after about 10 minutes in bed, so this row mostly covers the first 10 minutes and the cases where lighting automations or the room mode block that automation. It turns off a lamp entity, not `light.main_bedroom_main_lights`, so it does not trip the manual-override latch.

### 3. Toggle Nino's and Gianluca's nightlights

- **Entities (found):** `light.nino_bedroom_lamp`, `light.gianluca_lamp`. Nino's lamp has its own on and off automations (`nino_nightlight_turn_on`, `nino_nightlight_turn_off`). Gianluca's lamp has remote-toggle automations only, no schedule.
- **Shows when:** it is dark (`sun.sun` below horizon), or the lamp is currently on (so a lit lamp can always be switched off). Hidden in daylight when off.
- **Tap:** `light.toggle` on that lamp. Row label shows on/off from the entity.
- **Visibility:** John and Cristina.
- **Notes:** "nightlight" is taken to mean the bedroom lamp. Nino's 07:00 off automation will still turn his lamp off later, which is fine.

### 4. Toggle Nino's bedtime music

- **Entities (found):** `media_player.ninos_room`; flag `input_boolean.nino_sleep_music_playing`; `binary_sensor.nino_bed_occupied`. Automations: `nino_sleep_music_on` (starts after 3 minutes in bed, ceiling off, lamp under 20%), `_off`, `_flag_clear`, `_manual_start`, `_playing`.
- **Missing:** a start script. The start sequence (shuffle on, repeat all, play the playlist, set the flag) is inline in `nino_sleep_music_on`. Plan: extract it to `script.nino_sleep_music_start` and have the automation call it, so there is one copy. Stopping reuses what `nino_sleep_music_off` does (pause and clear the flag), as a short `script.nino_sleep_music_stop`.
- **Shows when:** dark (`sun.sun` below horizon) and Nino's room is not in mode Off (`input_select.ninos_bedroom`), or the music is currently playing (so it can always be stopped). "Makes sense": also require that Nino's bed is occupied to start it, so it can't blast an empty room.
- **Tap:** `script.nino_sleep_music_start` or `_stop`, depending on state.
- **Visibility:** John and Cristina.
- **Notes:** the existing automation hard-codes 19:00 to 07:00 in its conditions; I am not copying that, and I leave the existing automation's window alone (out of scope). The existing `_manual_start` automation sets the flag if the speaker is started by hand, so the toggle stays consistent either way.

### 5. Toggle DnD for me

- **Entities (found):** `input_boolean.john_dnd` (manual DnD), read by `binary_sensor.john_dnd_active`, which is also on while the Mac camera or mic is in use. `set_focus_mode` and the office call lighting also touch it.
- **Shows when:** always, for John, with state. Not counted in the badge.
- **Tap:** `input_boolean.toggle` on `john_dnd`.
- **Visibility:** John only.
- **Missing for Cristina:** there is no `cristina_dnd`. Her menu simply has no DnD row. If she wants one, that is a new helper and a separate decision.
- **Note:** when `john_dnd_active` is on because of the camera or mic, toggling the boolean off will not clear it. The row label should read from `john_dnd_active` and say which source holds it, or the tap looks broken.

### 6. Pause camera notifications

- **Entities (found):** global `input_boolean.camera_notifications`, plus one per camera (`<camera>_camera_notifications`). `camera_notifications_activate` turns the global on in Away mode (and at bedtime); `camera_notifications_deactivate` turns it off when someone is home, a door opens, someone arrives or a garage door opens.
- **Catch:** the global is automation-driven. A manual "pause" while it is on will be undone the next time an activation trigger fires, and a manual "resume" while someone is home will be undone by the deactivate rules. There is no timed-snooze helper (the repo has one for door-left-open and Kids WiFi, not for cameras).
- **Plan:** toggle the global boolean, and show its true state, plus the row is labelled "Camera alerts: on/off". I do not propose a timed snooze in v1. If John wants "pause for an hour", that needs a new helper and a change to the two automations, which is a separate plan. John chose the plain toggle (2026-11-25).
- **Shows when:** always, with state. Not counted in the badge.
- **Tap:** `input_boolean.toggle` on `camera_notifications`.
- **Visibility:** John and Cristina.

### 7. Toggle kid home from school

- **Entities (found):** `input_boolean.nino_home_today`, `input_boolean.gianluca_home_today` ("stays home today": suppresses drop-off pings and pickup, departure and medication reminders). Cleared by `school_overrides_reset` at the end of the day. School-day sensors: `binary_sensor.nino_school_day`, `binary_sensor.gianluca_school_day`. End-of-day: `sensor.primary_school_dismissal_time_today`, `sensor.parochial_school_dismissal_time_today`.
- **Shows when:** the kid's school-day sensor is on and now is within 60 minutes either side of that school's start time today (`sensor.primary_school_start_time_today` for Nino, `sensor.parochial_school_start_time_today` for Gianluca), or the kid's `home_today` is already on (so it can be undone). The start sensors already account for holidays and late starts, and are unavailable on no-school days, so the row stays hidden then. No fixed days or hours in the YAML.
- **Tap:** `input_boolean.toggle` on that kid's `home_today`. Label reads "Nino: home today" with on/off.
- **Visibility:** John and Cristina.
- **Meaning (John, 2026-11-25):** "staying home today", the existing `home_today` flag.

## Files (expected)

- `packages/house/quick_actions/`: one binary_sensor file per rule (bedside lamp per person, nightlights, music, kid home, room link helpers if needed), a per-person count sensor, and `LEARNINGS.md` once there is a lesson.
- `packages/ninos_room/media/`: new `nino_sleep_music_start.yaml` and `nino_sleep_music_stop.yaml` scripts; `nino_sleep_music_on.yaml` changed to call the start script (the only edit to an existing automation).
- `dashboards/kohbo/home/_quick_actions_popup.yaml` (new pop-up), one `!include` and the ⚡ header chip in `home.yaml`.
- `secrets.fake.yaml`: two placeholder user ids.
- Docs: `dashboards/kohbo/home/README.md`, `dashboards/SITEMAP.md`, the Nino room README if one lists the sleep music automations.
- `tests/test_quick_actions.py` (new).

## Test plan

Command: `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`.

1. Template render per rule: shown and hidden cases, and `unavailable` inputs giving hidden. Bedside lamp needs all three of lamp on, in the room, in bed. Nightlight rows show in the dark or when on. Music row hides with Nino's room in Off. Kid-home row shows inside the ±60 min start window, hides outside it and when the start sensor is unavailable, and stays while `home_today` is on.
2. Sleep music refactor: `nino_sleep_music_on` still ends with the same play sequence and flag-set (call the script), and the start and stop scripts carry the same calls the automation had. Sabotage: break the script and see it fail.
3. Every area in the room-link rows has a view path in `kohbo.yaml`; no area listed twice.
4. Pop-up shape: rows use `condition: state` only (no `template`), the pop-up is included in `home.yaml`, the hash `#quick_actions` matches the header chip's navigate.
5. Public repo hygiene: no real user id or address in committed files (gitleaks hook runs on commit); fixtures synthetic.
6. Existing suites stay green: `test_modern_syntax`, `test_yaml_syntax`, `test_naming`, `test_entity_references`, `test_dashboard_views`, the school and Nino medication tests.

Manual after deploy (John): the header chip and badge on a phone, no title shift, the pop-up clears when empty. Deploy needs a Template reload and a Scripts reload (`--reload` covers scripts and automations but not template entities), then the dashboard cache refreshes on the `kohbo.yaml` mtime, which `deploy.sh` touches. No HA restart.

## Risks

- **`!secret` inside a `users:` list.** Unproven; the fallback is described above. Checked first in the build.
- **Wrong area ids** would silently hide a room row. Mitigated by reading the live registry and the view-path test.
- **Camera pause fights its own automations.** Surfaced honestly in the label, not hidden.
- **Header layout.** Verified on the live DOM, not from source.
- **Kids' music and lamps are touched by existing automations.** The toggles act the same way a hand would, and the existing flag-clear and off automations keep working.

## Decisions (John, 2026-11-25)

1. **Kid row:** "staying home today" (`home_today`). Shown only on school days, from an hour before to an hour after that school's start.
2. **Camera pause:** a plain toggle that shows the true state. No timed pause.
3. **Cristina's menu:** rows 1, 2 (her lamp), 3, 4, 6, 7; no DnD row.

## Out of scope

The notification count, bed-light group and vacuum chips; per-room contextual panels; a timed camera snooze; a Cristina DnD helper; the older `/dashboard-kohbo/<room>` links in `rooms/partials/main_floor_room_cards.yaml` that don't match the registered `rooms-<slug>` views (BACKLOG candidate; unconfirmed).
