---
title: Powder Room Mobile Page
slug: powder-room-mobile-page
status: shipped
created: 2026-10-16
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-1223
---

# Powder Room Mobile Page

## Problem

The powder room has no page on the kohbo dashboard (`dashboards/kohbo/kohbo.yaml`). Its mode, occupancy, light and fan can only be reached through more-info dialogs. It's missing from the Main Floor index and Active Rooms, and it has no room sensor, so it never shows in Home → Occupied Rooms.

Its occupancy is also broken. `input_boolean.powder_room_occupied` has been `on` since the 2026-09-30 restart, even though the light has been switched on and off many times since (recorder, 2026-10-10 → 10-16). The cause is a bug in `powder_room_not_occupied` (task 7), and John asked for it to be fixed here.

The room is small: one dimmable light, an exhaust fan with a power meter, and a door sensor that has been `unavailable` since 2026-09-30. It has no motion, occupancy, illuminance, humidity or air-quality sensor, no motion-lights automation and no room-level lighting boolean.

## Goal

A Powder Room page at `/dashboard-kohbo/rooms-powder-room` that mirrors the Mudroom Bathroom page (PR #42) and applies John's decisions from that page. It is reachable from the Main Floor index, Active Rooms and Home → Occupied Rooms. Every entity on it exists live, there are no empty template slots, and there are no red error cards. Occupancy clears again after the light goes off.

## Approach

Copy `rooms/main_floor/mudroom_bathroom.yaml` and its partial. Change the entities, give the light tile a brightness slider, and trim the popup to what this room has. The page goes on the main floor, next to the mudroom bathroom.

**Shared template decision: don't extract one; keep two plain pages.**
- The two pages differ in shape, not just in entity IDs:
  - the light tile needs a `light-brightness` feature here and must not have one on the mudroom page (`onoff` only);
  - the popup has 3 toggles here (there's no motion-lights automation) against 4 there;
  - the popup has no Sensors section here (decision 5) against 3 sensor rows there.
- decluttering-card substitutes values. It can't drop a list item, so these differences would have to be passed in as whole YAML lists (the light tile, the toggle rows, the sensor rows). That leaves a "template" that is only a shell around parts that are already templates: `room_page_top_toolbar`, `room_overview`, `section_title`, `kohbo_device_smart_plug_entity`, `kohbo_device_door_entity`, `kohbo_popup_page_title` and `room_card`. No UI logic is duplicated between the pages. The `dashboards/CLAUDE.md` rule ("if you use a pattern twice, make it a template") targets duplicated logic, and that logic already lives in those templates.
- Converting the mudroom page would also need a decluttering render harness to prove byte-equivalence, which is a lot of risk to take on a page that shipped an hour ago, for no visible gain.
- Revisit this if a third small bathroom page arrives (an `upstairs_hallway_bathroom` HA area exists, but there's no package for it yet). Record this in `dashboards/LEARNINGS.md` (task 9).

**Carried over from the mudroom bathroom:**
- **No climate card.** The only temperature entity is `sensor.powder_room_door_sensor_temperature`, which is `unavailable`. There's no humidity, CO2, VOC or PM2.5 sensor.
- **No Quick Settings section.** The room has no lighting boolean and no adaptive-lighting switch.
- **Fan entity: `fan.powder_room_fan`.** It's the template fan in `packages/powder_room/fan/powder_room_fan_entity.yaml` (`unique_id: powder_room_fan`). It wraps `light.powder_room_fan_switch`, the raw ZHA on/off switch, and is the entity `powder_room_fan_off` acts on. The raw switch is never shown.
- **Fan power sensor: `sensor.powder_room_fan_instantaneous_demand`** (W). It's on the same ZHA device as the fan switch, and there's no `_2` suffix here, unlike the mudroom.
- **No `confirmation`** on any tile, and **no `ble_presence`** (as on the mudroom bathroom, foyer and mudroom pages).

**Different from the mudroom bathroom:**
- **The light is dimmable.** `light.powder_room_main_lights` has `supported_color_modes: [brightness]`, so the tile gets `features: [light-brightness]` with `features_position: inline`, as on `main_bathroom.yaml`.
- **`number.powder_room_main_lights_on_level` stays off the page.** It's a ZHA device-config entity (the level the bulb turns on at, currently 255), not a feature toggle, so decision 4 excludes it. It's reachable from the device page.
- **`room: "powder_room"` on the room card.** Unlike the mudroom bathroom, the powder room has its own HA area (`powder_room`), and every ZHA device in the room is assigned to it. Per `dashboards/LEARNINGS.md`, `room:` is the area_id. No `sensor.<person>_room_presence` reports it today, so no people will show, which is correct.

## Occupancy detection (finding)

There is no motion or occupancy sensor. Occupancy is inferred from the **door and the light** by two automations in `packages/powder_room/modes/`:
- `powder_room_occupied`: the door closes **or** the light turns on, and the house is occupied → `input_boolean.powder_room_occupied` on.
- `powder_room_not_occupied`: the door opens, or the light turns off (immediately or for 5 min) → off, if the conditions hold.

**Why it's stuck on:**
- Every light condition in `powder_room_not_occupied` checks `state: "on"`, while the comments say "Lights off".
- The automation is triggered by the light turning **off**, so the light conditions can never be true at that moment.
- The only paths left depend on the door being `on` (open), and the door has been `unavailable` since 2026-09-30.
- So nothing has cleared occupancy since that day. Its `last_changed` is the restart's restore time (2026-09-30T01:17Z), and the recorder holds no change for it since then, while the light has cycled on and off repeatedly.
- With the fix (task 7), "lights off for 5 min" clears occupancy even while the door is dead.
- **The fix does not clear the current stuck state by itself.** It needs one light on→off cycle plus 5 minutes after the reload, or John turning the boolean off (see the post-deploy checklist).

**Popup sensors:** the room has no motion, occupancy or illuminance sensor to list. The door is already a tile on the page, and its temperature is unavailable. So the popup has **no Sensors section** (decision 5).

## Page layout

File: `dashboards/kohbo/rooms/main_floor/powder_room.yaml`. `path: rooms-powder-room`, `subview: true`, `theme: kohbo`, `layout: !include …/kohbo_page_layout.yaml`. Cards, top to bottom:

1. **Toolbar:** `room_page_top_toolbar` with `name: Powder Room`, `navigation_path: /dashboard-kohbo/rooms-main-floor` and `settings_path: '#powder_room_settings_popup'`.
2. **Overview:** `room_overview` with `occupancy: input_boolean.powder_room_occupied` and `mode: input_select.powder_room`. No `ble_presence`.
3. **Lights** (`section_title`):
   - A tile for `light.powder_room_main_lights`, named "Main Light", icon `mdi:ceiling-light`, with `features: [{type: light-brightness}]` and `features_position: inline`.
4. **Devices** (`section_title`), a 2-column grid:

   | Tile | Entity | Template | Extras |
   |---|---|---|---|
   | Fan | `fan.powder_room_fan` | `kohbo_device_smart_plug_entity` | `icon: mdi:fan`; `variables.power_sensor: sensor.powder_room_fan_instantaneous_demand` |
   | Door | `binary_sensor.powder_room_door` | `kohbo_device_door_entity` | reads "Unavailable" while the sensor is offline (decision 1) |

5. **Settings popup** (`custom:bubble-card`, `pop-up`, `hash: '#powder_room_settings_popup'`). It uses the same `styles` include and `close_by_clicking_outside` as the mudroom bathroom. `margin_top_mobile` and `margin_top_desktop` start at `calc(100vh - 425px)`, the value used by the other short popups in the repo. If the browser check shows it doesn't fit, adjust it.
   - Title: `kohbo_popup_page_title`, "Settings".
   - **Automations**, one `entities` card, each row using the `kohbo_boolean_entity_layout.yaml` card_mod, `secondary_info: last-changed` and `state_color: true`:

     | Entity | Name |
     |---|---|
     | `automation.powder_room_lights_off` | Lights Off When Empty |
     | `automation.powder_room_fan_off` | Fan Off When Empty |
     | `input_boolean.vacuum_powder_room_at_night` | Clean at Night (icon `mdi:robot-vacuum`) |

     - The automation IDs match their alias slugs live; both were checked against the snapshot.
     - The lights-off row is named "Lights Off When Empty", because decision 8 adds an unoccupied trigger.
     - Excluded on purpose (decision 4): `mode_auto`, `mode_off`, `occupied` and `not_occupied` (plumbing), `input_boolean.vacuum_powder_room` ("clean when away") and `number.powder_room_main_lights_on_level`.
   - No Sensors section (decision 5).
6. **Navbar:** `!include /config/dashboards/templates/includes/navbar.yaml`.

**Room card partial:** `dashboards/kohbo/rooms/main_floor/partials/powder_room_card.yaml`, a copy of `mudroom_bathroom_card.yaml` on `room_card`.
- Variables:
  - `mode: input_select.powder_room`
  - `occupancy: input_boolean.powder_room_occupied`
  - `room: "powder_room"`, with the comment changed to say it is the room's own HA area
  - `room_name: Powder Room`
  - `navigation_path: '/dashboard-kohbo/rooms-powder-room'`
  - `temperature: null`, `humidity: null`, `aqi: null`
  - `icon: mdi:toilet`
- `room_devices`, each using `kohbo_room_card_device`:
  - Light: `light.powder_room_main_lights`, icon `kohbo:kohbo-device-lights`, `color: auto`
  - Fan: `fan.powder_room_fan`, icon `mdi:fan`
  - Door: `binary_sensor.powder_room_door`, with the open/closed JS icon copied from the mudroom bathroom card

**Room sensor:** `packages/house/areas/first_floor/powder_room_room.yaml`, a copy of `mudroom_bathroom_room.yaml`.
- `name: "Powder Room"`, `unique_id: powder_room_room`, `default_entity_id: sensor.powder_room_room`. Without `default_entity_id`, the name alone would produce `sensor.powder_room`.
- State from `input_boolean.powder_room_occupied`, `mode` from `input_select.powder_room`, `icon: mdi:toilet`, `permalink: "/dashboard-kohbo/rooms-powder-room"`, and an empty people list.
- Added to `group.room_sensors` in `packages/house/areas/rooms_groups.yaml`, right after `sensor.mudroom_bathroom_room`.
- It's display-only: it feeds Home → Occupied Rooms and the `sensor.house` counts. `sensor.first_floor` is not touched.

## Decisions

Carried over from John's mudroom bathroom decisions (2026-10-16), applied here as defaults:

1. **Door:** show the door tile and the room-card door button while the sensor is offline. They read "Unavailable".
2. **Room sensor:** add `sensor.powder_room_room` (with `default_entity_id`) to `group.room_sensors`, in its own commit.
3. **`initial_state`:** remove it from all six `packages/powder_room/**` automations in its own commit, and change nothing else on those lines.
4. **Popup:** feature-level toggles only. Here that's Lights Off, Fan Off and Clean at Night (there's no motion-lights automation). No plumbing automations, no `vacuum_powder_room` "clean when away" boolean, no group rows and no scripts.

Standing preferences: no empty `climate_overview` slots (so no climate card here), no `confirmation` on tiles, booleans use `kohbo_boolean_entity_layout.yaml`, and automation IDs are verified live.

New for this room, proposed:

5. **No Sensors section in the popup.** The room has nothing to list beyond the door, which is already on the page (open question 1).
6. **No shared small-bathroom template** (see Approach).
7. **Fix the not-occupied bug** in its own commit, with a regression test (John asked for this).
8. **Lights off when empty (John, 2026-10-16):** add a trigger to `powder_room_lights_off` for `input_boolean.powder_room_occupied` going `"off"`. Make the conditions an `or` of "room mode is Off" and "room not occupied", keeping the light-is-on and lighting-automations checks. Use modern syntax (a `target:` block) on the lines touched. This has no effect while the door sensor is dead, because occupancy then clears only after the light has been off for 5 minutes. It starts working once the door sensor is fixed. John accepted this. Shared-template extraction is confirmed declined (decision 6).

## Tasks

All work happens in `.claude/worktrees/powder-room-mobile-page` on branch `feature/powder-room-mobile-page`. Commits go in task order.

1. **Entity re-check (read-only).** Dump live states for every entity in this plan.
   - AC: every entity exists. Only `binary_sensor.powder_room_door` (and its temperature sensor, which isn't used) is `unavailable`. Anything else that is unavailable or unknown is reported before building.
   - AC: `light.powder_room_main_lights` still lists `brightness` in `supported_color_modes`.
   - AC: `sensor.powder_room_room` and `sensor.powder_room` are absent live, and no file named `powder_room_room.yaml` exists under `packages/`. `!include_dir_named` keys by basename, so a duplicate name would silently collide.
2. **Page.** Create `dashboards/kohbo/rooms/main_floor/powder_room.yaml` as laid out above, with a 1–3 line header comment.
   - AC: `path` is exactly `rooms-powder-room`, and the popup hash matches the toolbar's `settings_path`.
   - AC: no climate card, Quick Settings section, `confirmation`, `ble_presence` or Sensors section.
   - AC: the light tile has the `light-brightness` feature.
   - AC: the popup has exactly the 3 rows listed, each with the boolean card_mod include.
   - AC: no inline CSS.
3. **Register the view.** Add `- !include /config/dashboards/kohbo/rooms/main_floor/powder_room.yaml` to `dashboards/kohbo/kohbo.yaml`, directly after `mudroom_bathroom.yaml`.
   - AC: the diff is a single line.
4. **Room card, Main Floor index and Active Rooms.**
   - Create `partials/powder_room_card.yaml` as specified.
   - Include it in `rooms/main_floor/main_floor_index.yaml`, right after the Mudroom Bathroom card.
   - Add a `conditional` on `input_boolean.powder_room_occupied` == `on` in `rooms/active_rooms.yaml`, right after the Mudroom Bathroom block.
   - AC: `room: "powder_room"`, three device buttons, and `navigation_path` equal to the page path.
   - AC: the comment-header style matches the neighbouring blocks.
   - Tasks 2–4 go in two commits, the same split as PR #42: the page, then registration plus the card.
5. **Room sensor (own commit).** Create `packages/house/areas/first_floor/powder_room_room.yaml` and add `sensor.powder_room_room` to `group.room_sensors`.
   - AC: `diff` against `mudroom_bathroom_room.yaml` shows only room-specific values changed.
   - AC: the permalink equals the page path.
6. **Remove `initial_state` (own commit, decision 3).** Delete the `initial_state: on` line from each of the six automations under `packages/powder_room/**`, and nothing else.
   - AC: `git grep -n initial_state packages/powder_room` is empty.
   - AC: the diff is exactly 6 deleted lines.
   - AC: the commit message notes that HA keeps each automation's last runtime enabled state, so nothing currently off gets re-enabled. All six are `on` live.
7. **Fix the not-occupied bug (own commit).** In `packages/powder_room/modes/powder_room_not_occupied.yaml`:
   - change the two light conditions from `state: "on"` to `state: "off"`: line 43 ("Lights off") and line 57 ("Lights off for 5 mins");
   - fix the wrong comment on line 48 ("Door closed for 5 mins" → "Door open for 5 mins"), since that condition checks `on`.
   - These lines already use modern syntax. Nothing else changes. The legacy root `entity_id` in the action is left for the backlog.
   - Add `tests/test_powder_room_regressions.py`, modelled on `test_away_mode_regressions.py`. It asserts that every `light.powder_room_main_lights` state condition in the not-occupied automation (nested `and`/`or` included) checks `off`.
   - AC: the YAML diff is 3 changed lines.
   - AC: the new test passes, and it fails if either `"off"` is reverted to `"on"` (sabotage check, recorded in the build log).
   - AC: the commit message explains the stuck `on` state, and that clearing it needs one light cycle or a manual reset after reload.
7b. **Lights off when empty (own commit, decision 8).** Edit `packages/powder_room/lights/powder_room_lights_off.yaml`.
   - AC: the existing mode-Off behaviour is unchanged.
   - AC: the new trigger is on `input_boolean.powder_room_occupied` going `"off"`.
   - AC: the action uses a `target:` block.
   - AC: a regression test in `tests/test_powder_room_regressions.py` asserts the unoccupied trigger exists. Reverting the trigger turns the test red.
   - AC: the header comment is updated (1–3 lines).

8. **Navbar: no change.** The powder room is not a frequent room.
   - AC: `navbar.yaml` is untouched.
9. **Docs (own commit).**
   - `dashboards/SITEMAP.md`: add Powder Room to the Main Floor list and the tree after Mudroom Bathroom, and bump "Last updated".
   - `dashboards/kohbo/rooms/README.md`: file tree (page and partial), Active Rooms list, Main Floor Index list.
   - `dashboards/LEARNINGS.md`, one bullet: the small-bathroom pages stay separate because they differ in shape and decluttering can't drop list items. Extract a template only if a third small bathroom page arrives.
   - AC: every new file path appears in the README tree.
10. **Validate (scripted).** Run these against the committed branch and paste the output into `plans/powder-room-mobile-page/build-log.md`, which gets its own commit:
    - `python3 /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/validate_dash.py <worktree> /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/live_states.json`, using a fresh live dump. It checks the committed dashboard changes against origin/master: includes resolve, decluttering variables match template tokens, and entities exist live.
    - `tests/run.sh` in full, because `packages/` and `tests/` are touched.
    - `yamllint -c .yamllint` on every touched YAML file.
    - A PII grep of the added lines in `git diff origin/master...HEAD`.
    - The gitleaks hook runs on each commit. If `deploy.sh --check` is used, pass `--skip-ci`. Never deploy, reload or restart.
    - AC: the validator reports 0 problems. Its only notes are `binary_sensor.powder_room_door` unavailable, in the page and the card (expected, decision 1).
    - AC: tests, yamllint and the PII grep are clean.
11. **Browser verification, after John deploys.** He reloads dashboards, automations, template entities and groups himself.
    - AC: every item in the checklist below passes.

## Risks

- **Lovelace YAML isn't covered by tests or the HA config check.** Mitigation: the validator in task 10 and the browser pass.
- **The bug fix changes live behaviour.** Occupancy will now clear 5 minutes after the light goes off, so `powder_room_fan_off` starts turning the fan off when the room is empty, which it hasn't done since 09-30. That's the intended behaviour. Mitigation: own commit, regression test, revertable.
- **The stuck `on` state outlives the fix until the next light cycle.** Until then the Active Rooms card and Home → Occupied Rooms show the powder room as occupied. Mitigation: post-deploy step 1.
- **The light drops to `unavailable` for ~30 s most days** (recorder, 10-11 → 10-14). A drop from `off` doesn't trigger `to: "off"`, so it doesn't affect occupancy. The tile may briefly read "Unavailable". Out of scope.
- **The new room sensor changes the `sensor.house` occupied counts.** The change is display-only and in its own commit.
- **Shared-file blast radius:** `kohbo.yaml`, `main_floor_index.yaml`, `active_rooms.yaml` and `rooms_groups.yaml` each get a one-block diff. Mitigation: the validator, plus rechecking the Main Floor index and Active Rooms in the browser.

## Post-deploy checklist (phone width)

1. Clear the stuck occupancy: turn the powder room light on, then off, and wait 5 minutes. `input_boolean.powder_room_occupied` goes `off`, and the Logbook shows "Powder Room Not Occupied" triggered. If it doesn't, turn the boolean off by hand and report it.
2. `/dashboard-kohbo/rooms-powder-room` renders with no red error cards.
3. The overview shows the mode and occupancy chips, with no broken person avatars.
4. The Main Light tile toggles the light, and the inline slider dims it.
5. The Fan tile shows On/Off and wattage while on, toggles from more-info, and never asks for confirmation.
6. The Door tile shows the real state ("Unavailable" while the sensor is offline).
7. The toolbar back arrow goes to the Main Floor index.
8. The settings popup opens from the toolbar, fits the screen, and lists exactly 3 toggles with friendly names and no Sensors section.
9. The Main Floor index shows the Powder Room card after Mudroom Bathroom. Tapping it opens the page, and the device buttons show the light, fan and door states.
10. Active Rooms shows the card while the room is occupied and hides it once step 1 has cleared occupancy.
11. While occupied, Home → Occupied Rooms lists Powder Room, and tapping it opens the page.
12. Recheck that the Mudroom Bathroom page, the Main Floor index and Active Rooms are unaffected.
13. JK-1217 (UI, optional): set the area of `fan.powder_room_fan` to Powder Room in the entity settings. The ID half is already done (`unique_id: powder_room_fan`).

## Open questions (John)

1. **Popup sensors:** show none (default), or add a Door row and a Door Temperature row even though both are unavailable?
2. **Lights off when empty:** resolved by decision 8.
3. **JK-1217:** is setting the fan's area in the UI enough to close it? Default: yes, after post-deploy step 13.

## Out of scope (backlog)

- **Legacy syntax in `packages/powder_room/**`:** root `entity_id` in the actions of `not_occupied`, `occupied`, `fan_off` and `lights_off`; `data.entity_id` in `mode_auto` and `mode_off`; missing header comments on `mode_auto` and `not_occupied`.
- **`powder_room_lights_off` has no unoccupied trigger** (open question 2).
- **The door sensor has been offline since 2026-09-30**, probably its battery or pairing. Its temperature sensor is offline too.
- **The main light drops to `unavailable` briefly most days** (ZHA).
- **The fan entity has no area** (JK-1217).
- **The shared small-bathroom template:** revisit if a third small bathroom page arrives.

On approval → /approve → /ship powder-room-mobile-page
