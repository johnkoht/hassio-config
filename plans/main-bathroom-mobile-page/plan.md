---
title: Main Bathroom Mobile Page
slug: main-bathroom-mobile-page
status: in-progress
created: 2026-10-15
has_pre_mortem: true
has_review: true
has_prd: true
linear: JK-1221
---

# Main Bathroom Mobile Page

## Problem

The main bathroom has no page on the kohbo dashboard (`dashboards/kohbo/kohbo.yaml`, the mobile dashboard). The backend already points at a page that doesn't exist. `sensor.main_bathroom` sets `permalink: /dashboard-kohbo/rooms-main-bathroom` and is in `group.room_sensors`, so tapping the main bathroom in Home → Occupied Rooms goes to a blank route. The room also doesn't appear on the Upper Floor index or in Active Rooms.

The review also found a bug the new page would inherit. `kohbo_device_door_entity` counts open doors from `entity.attributes.entity_id`, which only exists on groups. On a single door sensor it always reads "Closed", and the main bedroom page has this bug today.

## Goal

A Main Bathroom page at `/dashboard-kohbo/rooms-main-bathroom` that follows the existing room-page pattern. It is reachable from the Upper Floor index, Active Rooms, the navbar Rooms popup and the Home occupied-rooms card. Every entity on it exists and is live in the registry. Single-sensor door tiles show their real state, on this page and on the main bedroom page.

## Approach

Build the page by hand from `dashboards/kohbo/rooms/upper_floor/main_bedroom.yaml`. This knowingly departs from the `dashboards/CLAUDE.md` rule that a pattern used twice becomes a template. The main bathroom's shape (four lights, shower, outlets, BLE) doesn't match the other two bathrooms, and JK-1222 will add the shared small-bathroom decluttering template that the mudroom bathroom and powder room both use. Use the shared includes (`kohbo_page_layout`, `kohbo_popup_styles`, `kohbo_boolean_entity_layout`, the `card_mod` includes) and bubble-card popup conventions, with no inline CSS. Copy variable names from the template definitions, not from memory.

Page layout, top to bottom:

- **Toolbar:** `room_page_top_toolbar` with a back link to `/dashboard-kohbo/rooms-upper-floor` and `settings_path: '#main_bathroom_settings_popup'`.
- **Overview:** `room_overview` with `occupancy: input_boolean.main_bathroom_occupied`, `mode: input_select.main_bathroom` and `ble_presence: sensor.main_bathroom_people_list`.
- **Climate:** `climate_overview`. It takes `temperature_sensor`, `humidity_sensor`, `carbon_dioxide_sensor`, `vocs_sensor` and `room_name`; it ignores `pm25_sensor`, so leave that out.
  - Temperature and humidity are the bathroom's own: `sensor.main_bathroom_temperature` and `sensor.main_bathroom_humidity`.
  - CO2 and VOCs come from the adjacent main bedroom Awair: `sensor.main_bedroom_awair_carbon_dioxide` and `sensor.main_bedroom_awair_vocs`. Awair calls VOCs "Chemicals".
  - All six sensors were confirmed live on 2026-10-15. Add a YAML comment noting the air quality comes from the bedroom.
- **Lights:** tiles for `light.main_bathroom_vanity_lights`, `light.main_bathroom_ceiling_lights` and `light.main_bathroom_toilet_light`. The group `light.main_bathroom_lights` is not tiled; it goes on the room card.
- **Devices grid:**

  | Entity | Template |
  |---|---|
  | Door, `binary_sensor.main_bathroom_door_sensor_status` | `kohbo_device_door_entity`, after the fix in task 2 |
  | Shower occupied, `input_boolean.main_bathroom_shower_occupied` | `kohbo_device_entity` |
  | Leak, `binary_sensor.main_bathroom_leak_sensor_moisture` | The existing leak template if a vertical one exists, otherwise `kohbo_device_entity` with a water icon. Pick from `templates/button_cards/cards/devices/`; don't invent one. |
  | Steamer, `switch.smart_plug_12_switch` | `kohbo_device_smart_plug_entity`, with `confirmation: true` |
  | Hair dryer, `switch.smart_plug_13_switch` | `kohbo_device_smart_plug_entity`, with `confirmation: true` |

  The plugs have no live power sensor, since the only power sensors in the repo are energy totals (`summation_delivered`), so don't pass `power_sensor` unless task 1 finds a real active-power entity.
- **Quick settings:** `input_boolean.main_bathroom_lighting_automations`, `switch.adaptive_lighting_sleep_mode_main_bathroom` and `switch.adaptive_lighting_sleep_mode_main_bathroom_toilet`.
- **Settings popup** (`#main_bathroom_settings_popup`), with entities pinned in task 1:
  - Automations: the room's automations as `automation.*` entity IDs, looked up from the live registry.
  - Sensors and helpers:
    - `binary_sensor.main_bathroom_motion_sensor_occupancy`
    - `binary_sensor.main_bathroom_presence_sensor_radar_target`
    - `sensor.main_bathroom_motion_sensor_illuminance`
    - `sensor.main_bathroom_humidity`
    - `input_number.main_bathroom_initial_humidity`
    - `input_boolean.main_bathroom_lights_auto`
    - `light.main_bathroom_main_lights`
  - `script.main_bathroom_activate_bedtime_lighting_mode` has a wrong "Main Bedroom" alias (JK-1226), so give it an explicit `name:`.
- **Navbar:** `navbar.yaml`.

## Tasks

1. **Worktree and entity check.**
   - Create a worktree at `.claude/worktrees/main-bathroom-mobile-page` on a new branch. Never switch the main checkout's branch. Push with an explicit refspec.
   - Read-only, on the Yellow, dump live states for every entity in this plan and in the new files. Flag any that are missing, `unavailable` or `unknown`. Look up automation entity IDs by their alias slug.
   - Check whether the smart plugs have an active-power sensor.
   - Check what `room:` value the room card's presence logic expects, by comparing `room_card` usage with the `sensor.main_bathroom` / presence attributes.
2. **Door template fix.** In `templates/button_cards/cards/devices/kohbo_device_door_entity.yaml`, fall back to the entity itself when it has no `entity_id` attribute: `entity.attributes.entity_id || [entity.entity_id]`. This fixes the main bedroom page too. Make it its own commit.
3. **Page.** Create `dashboards/kohbo/rooms/upper_floor/main_bathroom.yaml` with `path: rooms-main-bathroom` (exactly the permalink) and `subview: true`, laid out as above.
4. **Register the view.** Add the page to the upper-floor block of `dashboards/kohbo/kohbo.yaml`.
5. **Room card.** Create `dashboards/kohbo/rooms/upper_floor/partials/main_bathroom_card.yaml` on `room_card`.
   - Set `navigation_path: /dashboard-kohbo/rooms-main-bathroom`, `room` to the value verified in task 1, `room_name`, `icon`, `temperature` and `humidity`.
   - Add a `light.main_bathroom_lights` device button.
   - Pass `aqi` as the bedroom Awair score (`sensor.main_bedroom_awair_score`) only if `room_card` handles it cleanly; otherwise leave it out.
   - Don't copy `mudroom_card.yaml`'s `room: "foyer"` slip.
6. **Upper Floor index and Active Rooms.**
   - Include the card in `rooms/upper_floor/upper_floor_index.yaml`, next to Main Bedroom.
   - Add a conditional on `input_boolean.main_bathroom_occupied` in `rooms/active_rooms.yaml`.
7. **Navbar.**
   - Add a Main Bathroom shortcut to the Rooms popup in `templates/includes/navbar.yaml`.
   - In a separate commit, fix the Gianluca link: `rooms-gianlucas-bedroom` becomes `rooms-gianluca-bedroom`.
8. **Docs.**
   - Update `dashboards/SITEMAP.md` (Upper Floor list, tree, Last updated) and `dashboards/kohbo/rooms/README.md` (tree, Active Rooms list, Upper Floor list).
   - Add the missing "register in `kohbo.yaml` views" step to "Adding a New Room" in both `rooms/README.md` and `dashboards/CLAUDE.md`.
   - Note the door-template fallback anywhere that template is documented, including `.cursor/rules/dashboards.mdc` if it's listed there.
9. **Validate (scripted).**
   - Run `tests/run.sh --syntax`, which has an `!include`-aware loader, and `yamllint` with the repo `.yamllint` on every touched file. The gitleaks pre-commit hook runs on each commit.
   - Write a scratch script, not committed, that:
     - checks every `!include` path in the touched files resolves under the repo (mapping `/config/` to the repo root)
     - checks every decluttering `variables` key matches a `[[...]]` token in that template's definition
     - checks every entity ID in the touched files against the task-1 live state dump
   - If `deploy.sh --check` is used, always pass `--skip-ci`, because without it the check deletes `secrets.yaml`. Never restart HA.
10. **Browser verification, after John deploys** (he reloads; I don't). At phone width:
    1. `/dashboard-kohbo/rooms-main-bathroom` renders with no red error cards.
    2. The climate card shows bathroom temperature and humidity, plus bedroom CO2 and VOCs.
    3. The three light tiles toggle.
    4. The door tile shows the real Open/Closed state. Also recheck the main bedroom page's door tile.
    5. The steamer and hair dryer tiles ask for confirmation.
    6. The settings popup opens from the toolbar and lists the pinned entities.
    7. The Upper Floor index card navigates to the page.
    8. Active Rooms shows the card while the bathroom is occupied; the Home occupied-rooms card links to it; the navbar Rooms shortcut and the fixed Gianluca link both navigate correctly.

Out of scope:
- **Main bathroom automation bugs** (JK-1226).
- **The powder room occupancy bug**, to be fixed in JK-1223.
- **The unused `rooms/partials/*_room_cards.yaml` files.** Leave them alone.

## Risks

- **No dashboard tests, and the HA config check doesn't validate Lovelace YAML:** template mistakes fail silently at runtime. Mitigation: the scripted checks in task 9, plus the enumerated browser pass in task 10.
- **Shared-file blast radius:** `kohbo.yaml` and `navbar.yaml` load on every page, the new card is included on two shared pages, and the door template is used on other rooms. A bad include path or template change can break pages beyond this one. Mitigation: the include-resolution check, a minimal diff to shared files, the door fix in its own revertable commit, and rechecking the main bedroom and Active Rooms pages in task 10.
- **Path drift:** if the path doesn't match the permalink, the Home link stays broken. Mitigation: use `rooms-main-bathroom` verbatim and check it in task 10.
- **Cross-room air quality could mislead:** CO2 and VOCs come from the bedroom Awair. Mitigation: you asked for this explicitly, and it's noted with a YAML comment. If it reads confusingly on the page, retitle the card to make the source clear.
- **Adaptive-lighting sleep switches or plug power may not exist live:** task 1 checks them and drops anything missing.

On approval → /approve → /ship main-bathroom-mobile-page
