---
title: Mudroom Bathroom Mobile Page
slug: mudroom-bathroom-mobile-page
status: shipped
created: 2026-10-16
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-1222
---

# Mudroom Bathroom Mobile Page

## Problem

The mudroom bathroom has no page on the kohbo dashboard (`dashboards/kohbo/kohbo.yaml`). Its mode, occupancy, light and fan can only be reached through more-info dialogs or the HA UI. It's missing from the Main Floor index and from Active Rooms. Unlike the main bathroom, it also has no room sensor (`sensor.mudroom_bathroom_room`), so it never shows up in Home → Occupied Rooms.

The room is much smaller than the main bathroom: one on/off light, an exhaust fan, a motion/occupancy sensor and a door sensor. It has no temperature, humidity or air-quality sensor, no BLE presence, no adaptive-lighting switch and no room-level lighting boolean.

## Goal

A Mudroom Bathroom page at `/dashboard-kohbo/rooms-mudroom-bathroom` that follows the main bathroom pattern and applies John's feedback on that page from the start. It is reachable from the Main Floor index, Active Rooms and Home → Occupied Rooms. Every entity on it exists live, there are no empty template slots, and there are no red error cards.

## Approach

Copy the main bathroom page (`rooms/upper_floor/main_bathroom.yaml`) and drop the sections this room can't fill. Put it on the **main floor**: all of its ZHA devices sit in the `mud_room` area, and the mudroom page lives in `rooms/main_floor/`.

**Shared template decision: copy now, and extract the small-bathroom template in JK-1223.**
- The main bathroom plan said JK-1222 would add the template. This plan moves that work to JK-1223.
- The `dashboards/CLAUDE.md` rule is "two uses = a template". The powder room is the second use, so JK-1223 is the point where the rule applies.
- John hasn't reviewed this page on his phone yet. A template built before that review would probably need reworking afterwards.
- The powder room's live entities have the same shape (mode, occupied, main light, template fan plus a raw fan switch, fan power, door, the same six automations), with one difference: `number.powder_room_main_lights_on_level` suggests a dimmable light. Extracting at JK-1223 can absorb that, and refactoring this page onto the template there is a small diff.
- `media_player_pop_up` shows that a bubble-card pop-up inside a decluttering template works in this repo, so the extraction is feasible.

**Choices driven by John's feedback:**
- **No climate card.** The room's only temperature entity is the door sensor's `sensor.mudroom_bathroom_door_temperature`, which is `unavailable`, and there's no humidity or air quality. `climate_overview` would render error slots. `climate_temperature_only` would graph an unavailable sensor.
- **No Quick Settings section.** The room has no lighting boolean and no adaptive-lighting switch, and the house-wide `input_boolean.lighting_automations` doesn't belong on a room page. `jr_suite.yaml` sets the precedent: its Quick Settings section is commented out.
- **Fan entity: `fan.mudroom_bathroom_fan`.** It's the template fan defined in `packages/mudroom_bathroom/fan/mudroom_bathroom_fan_entity.yaml`, with `unique_id: mudroom_bathroom_fan`. It's the entity the fan-off automation uses, and it wraps `light.mudroom_bathroom_fan`, the raw ZHA on/off switch. The raw light is never shown.
- **No `confirmation`** on any device tile.
- **Short settings popup:** feature toggles and a few sensors only, with no mode/occupancy plumbing, light groups or scripts.
- **No BLE presence.** `room_overview` is used without `ble_presence`, as on `mudroom.yaml` and `foyer.yaml`. No `sensor.mudroom_bathroom_people_list` exists, and no HA area is named after this room.

## Page layout

File: `dashboards/kohbo/rooms/main_floor/mudroom_bathroom.yaml`. `path: rooms-mudroom-bathroom`, `subview: true`, `theme: kohbo`, `layout: !include …/kohbo_page_layout.yaml`. Cards, top to bottom:

1. **Toolbar:** `room_page_top_toolbar` with `name: Mudroom Bathroom`, `navigation_path: /dashboard-kohbo/rooms-main-floor` and `settings_path: '#mudroom_bathroom_settings_popup'`.
2. **Overview:** `room_overview` with `occupancy: input_boolean.mudroom_bathroom_occupied` and `mode: input_select.mudroom_bathroom`. No `ble_presence`.
3. **Lights** (`section_title`):
   - A tile for `light.mudroom_bathroom_main_lights`, named "Main Light", icon `mdi:ceiling-light`.
   - It is on/off only (`supported_color_modes: [onoff]`), so the tile gets no `light-brightness` feature.
4. **Devices** (`section_title`), a 2-column grid:

   | Tile | Entity | Template | Extras |
   |---|---|---|---|
   | Fan | `fan.mudroom_bathroom_fan` | `kohbo_device_smart_plug_entity` | `icon: mdi:fan`; `variables.power_sensor: sensor.mudroom_bathroom_fan_instantaneous_demand_2`; no `confirmation` |
   | Door | `binary_sensor.mudroom_bathroom_door` | `kohbo_device_door_entity` | Currently **unavailable**; the template renders "Unavailable" (decision 1) |

5. **Settings popup:** `custom:bubble-card` pop-up with `hash: '#mudroom_bathroom_settings_popup'`, the `kohbo_popup_styles` include and `kohbo_popup_page_title` "Settings". Start `margin_top_*` at `calc(100vh - 650px)` and tune it in the browser.
   - **Automations**, each row using the `kohbo_boolean_entity_layout.yaml` card_mod:

     | Entity | Name |
     |---|---|
     | `automation.mudroom_bathroom_lights_motion_on` | Motion Lights |
     | `automation.mudroom_bathroom_lights_off` | Lights Off When Empty |
     | `automation.mudroom_bathroom_fan_fan_off` | Fan Off When Empty |
     | `input_boolean.vacuum_mudroom_bathroom_at_night` | Clean at Night (icon `mdi:robot-vacuum`, as on the mudroom page) |

     The fan-off entity ID is `…_fan_fan_off`, not the alias slug `…_fan_off`; that's registry drift, and the live ID is what counts. Excluded on purpose: `mode_auto`, `mode_off`, `occupied`, `not_occupied` (plumbing) and `input_boolean.vacuum_mudroom_bathroom` (the mudroom and Jr. Suite pages show only "at night").
   - **Sensors**, each row using the `card_mod/entities/entity_generic_styles.yaml` card_mod:

     | Entity | Name |
     |---|---|
     | `binary_sensor.mudroom_bathroom_motion` | Motion Sensor (`mdi:motion-sensor`) |
     | `binary_sensor.mudroom_bathroom_occupancy` | Occupancy Sensor (`kohbo:kohbo-room-occupancy`) |
     | `sensor.mudroom_bathroom_illuminance` | Illuminance |

6. **Navbar:** `!include /config/dashboards/templates/includes/navbar.yaml`.

**Room card partial:** `dashboards/kohbo/rooms/main_floor/partials/mudroom_bathroom_card.yaml`, on `room_card`.
- Variables:
  - `mode: input_select.mudroom_bathroom`
  - `occupancy: input_boolean.mudroom_bathroom_occupied`
  - `room: "mudroom_bathroom"`
  - `room_name: Mudroom Bathroom`
  - `navigation_path: '/dashboard-kohbo/rooms-mudroom-bathroom'`
  - `temperature: null`, `humidity: null`, `aqi: null` (as `mudroom_card.yaml` does)
  - `icon: mdi:toilet`
- On `room`: no HA area is named after this room, so it never matches a `sensor.<person>_room_presence` value, which is the right outcome. Using `mud_room` would show people in the mudroom on the bathroom card.
- `room_devices`, each using `kohbo_room_card_device`:
  - Light: `light.mudroom_bathroom_main_lights`, icon `kohbo:kohbo-device-lights`, `color: auto`
  - Fan: `fan.mudroom_bathroom_fan`, icon `mdi:fan`
  - Door: `binary_sensor.mudroom_bathroom_door`, with the open/closed JS icon copied from `mudroom_card.yaml`

**Room sensor:** `packages/house/areas/first_floor/mudroom_bathroom_room.yaml`, a copy of `mudroom_room.yaml`.
- `name: "Mudroom Bathroom"`, `unique_id: mudroom_bathroom_room`, `default_entity_id: sensor.mudroom_bathroom_room`.
- State from `input_boolean.mudroom_bathroom_occupied`. `mode` comes from `input_select.mudroom_bathroom`.
- `icon: mdi:toilet` and `permalink: "/dashboard-kohbo/rooms-mudroom-bathroom"`.
- People empty.
- Added to `group.room_sensors` in `packages/house/areas/rooms_groups.yaml` under First Floor.
- It only feeds Home → Occupied Rooms and the `sensor.house` counts, which are display-only. Floor occupancy (`sensor.first_floor`) is not touched.

## Decisions (John, 2026-10-16)

1. **Door:** show the door tile and the room-card door button while the sensor is offline. They read "Unavailable", so the dead sensor stays visible.
2. **Room sensor:** yes. Add `sensor.mudroom_bathroom_room` to `group.room_sensors` so the room appears in Home → Occupied Rooms. It goes in its own commit.
3. **`initial_state`:** fix it in this PR. Remove `initial_state` from all seven `packages/mudroom_bathroom/**` automations, in a separate commit, so the popup toggles survive restarts. Change nothing else in those files.
4. **Popup:** keep the four toggles (Motion Lights, Lights Off When Empty, Fan Off When Empty, Clean at Night) and the three sensors. Don't add `input_boolean.vacuum_mudroom_bathroom`.

## Tasks

1. **Entity re-check (read-only).** In the worktree `.claude/worktrees/mudroom-bathroom-mobile-page` on branch `feature/mudroom-bathroom-mobile-page`:
   - Dump live states for every entity listed above.
   - AC: every entity exists. Only `binary_sensor.mudroom_bathroom_door` is unavailable; anything else that is unavailable or unknown is reported before building.
   - AC: `sensor.mudroom_bathroom_room` does **not** exist yet, and no file named `mudroom_bathroom_room.yaml` exists anywhere under `packages/`. `!include_dir_named` keys by basename, so a duplicate name would silently collide.
2. **Page.** Create `dashboards/kohbo/rooms/main_floor/mudroom_bathroom.yaml` as laid out above, with a 1–3 line header comment.
   - AC: `path` is exactly `rooms-mudroom-bathroom`.
   - AC: no climate card, no Quick Settings section, no `confirmation`, and no `ble_presence`.
   - AC: the popup has exactly the 4 automation rows and 3 sensor rows listed, with the specified card_mod includes.
   - AC: modern syntax, no inline CSS.
3. **Register the view.** Add `- !include /config/dashboards/kohbo/rooms/main_floor/mudroom_bathroom.yaml` to `dashboards/kohbo/kohbo.yaml`, directly after `mudroom.yaml`.
   - AC: the diff is a single line.
4. **Room card.** Create `dashboards/kohbo/rooms/main_floor/partials/mudroom_bathroom_card.yaml` as specified.
   - AC: `room: "mudroom_bathroom"`.
   - AC: there are three device buttons.
   - AC: `navigation_path` matches the page path.
5. **Main Floor index and Active Rooms.**
   - Include the card in `rooms/main_floor/main_floor_index.yaml`, right after the Mudroom card.
   - Add a `conditional` on `input_boolean.mudroom_bathroom_occupied` == `on` in `rooms/active_rooms.yaml`, right after the Mudroom block.
   - AC: both use the same comment-header style as their neighbours.
6. **Room sensor.** Create `packages/house/areas/first_floor/mudroom_bathroom_room.yaml` and add `sensor.mudroom_bathroom_room` to `group.room_sensors`.
   - AC: it is a copy of `mudroom_room.yaml` with only the room-specific values changed, plus `default_entity_id: sensor.mudroom_bathroom_room` (needed because the name alone would produce `sensor.mudroom_bathroom`). Task 9 verifies that `sensor.mudroom_bathroom_room` is not already taken live.
   - AC: the permalink equals the page path.
   - AC: it is in its own commit, since it is the only backend change.
7. **Navbar: no change.** The Rooms popup holds the frequent rooms, and a half-bath doesn't qualify.
   - AC: `navbar.yaml` is untouched.
7b. **Remove `initial_state` (decision 3).** Delete the `initial_state:` line from each automation under `packages/mudroom_bathroom/**`, and nothing else.
   - AC: `git grep -n initial_state packages/mudroom_bathroom` is empty.
   - AC: the diff only removes those lines.
   - AC: `tests/run.sh --syntax` still passes.
   - The commit message notes that HA keeps each automation's last runtime enabled state, so nothing currently off gets re-enabled.

8. **Docs.**
   - `dashboards/SITEMAP.md`: add Mudroom Bathroom to the Main Floor list and the tree, and bump "Last updated".
   - `dashboards/kohbo/rooms/README.md`: file tree (page and partial), Active Rooms list, Main Floor Index list.
   - `dashboards/LEARNINGS.md`, two bullets:
     - Rooms without temperature or air sensors omit the climate card rather than leaving `climate_overview` slots empty.
     - A room with no HA area of its own gets a `room:` value that never matches presence.
   - `dashboards/CLAUDE.md`: no change, unless the build finds that a rule is wrong.
   - AC: every new file path appears in the README tree.
9. **Validate (scripted).**
   - Run `tests/run.sh` in full, because task 6 touches `packages/`.
   - Run `yamllint` with the repo `.yamllint` on every touched file.
   - Write a scratch script, not committed, that checks:
     - every `!include` in the touched files resolves, with `/config/` mapped to the repo root;
     - every decluttering `variables` key matches a `[[...]]` token in that template (`room_page_top_toolbar`, `room_overview`, `room_card`);
     - every entity ID in the touched files exists in a fresh live state dump.
   - The gitleaks hook runs on each commit. If `deploy.sh --check` is used, pass `--skip-ci`. Never reload or restart HA.
   - AC: all checks pass, with the output pasted into the build log.
10. **Browser verification, after John deploys.** He reloads dashboards, template entities and groups himself.
    - AC: every item in the checklist below passes.

## Risks

- **Lovelace YAML isn't validated by tests or the HA config check.** Mitigation: the scripted checks in task 9 and the browser pass.
- **`room_overview` without `ble_presence` leaves `[[ble_presence]]` unresolved.** `mudroom.yaml` and `foyer.yaml` already do this and render. Mitigation: browser check item 2. If it errors here, fall back to the mudroom page's exact variable set.
- **The `initial_state: on` setting on every mudroom_bathroom automation re-enables them on each HA restart.** A Motion Lights or Fan Off toggle switched off in the popup silently comes back on after a restart. The page works, but the toggles don't persist across restarts. Mitigation: fixed in this PR (decision 3).
- **The door tile reads "Unavailable".** The door sensor is offline; its battery or pairing is likely the cause. Mitigation: this is honest state; see decision 1.
- **The new room sensor changes `sensor.house` occupied counts on Home.** The change is display-only and expected. Mitigation: the backend change is in its own revertable commit, and it needs a template and group reload, which John does.
- **Shared-file blast radius:** `kohbo.yaml`, `main_floor_index.yaml` and `active_rooms.yaml` each get a one-block diff. Mitigation: include-resolution check, and recheck the Main Floor index and Active Rooms pages in the browser.

## Post-deploy browser checklist (phone width)

1. `/dashboard-kohbo/rooms-mudroom-bathroom` renders with no red error cards.
2. The overview shows the mode and occupancy chips, with no broken person avatars.
3. The Main Light tile toggles the light.
4. The Fan tile shows On/Off and wattage while on, toggles from more-info, and never asks for confirmation.
5. The Door tile shows the real state ("Unavailable" while the sensor is offline).
6. The toolbar back arrow goes to the Main Floor index.
7. The settings popup opens from the toolbar, fits the screen, and lists exactly 4 toggles and 3 sensors with friendly names.
8. The Main Floor index shows the Mudroom Bathroom card after the Mudroom card. Tapping it opens the page. The device buttons show the light, fan and door states.
9. Active Rooms shows the card while the bathroom is occupied and hides it when it's empty.
10. While occupied, Home → Occupied Rooms lists Mudroom Bathroom, and tapping it opens the page.
11. Recheck that the Mudroom page and Active Rooms are unaffected.

## Out of scope (backlog)

- **Legacy syntax in `packages/mudroom_bathroom/**`.** (`initial_state` is fixed in this PR.) See the report.
- **The mudroom card's `room: "foyer"` slip.** The area_id is `mud_room`.
- **`sensor.mudroom_presence`**, which compares against `mudroom`, not `mud_room`.
- **The fan's area and its entity-ID drift** (JK-1217).
- **The shared small-bathroom template** (JK-1223).

On approval → /approve → /ship mudroom-bathroom-mobile-page
