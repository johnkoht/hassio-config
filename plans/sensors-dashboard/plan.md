---
title: Sensors Dashboard
slug: sensors-dashboard
status: shipped
created: 2026-10-16
has_pre_mortem: false
has_review: true
has_prd: false
linear: JK-1224 (follow-up JK-1094; related JK-1056, JK-78, JK-1028)
---

# Sensors Dashboard

## Problem

Nothing shows which of the sensors the house depends on have stopped reporting. Today you find out when an automation misbehaves. In the live snapshot (2026-10-16, 7,130 entities):

- **14 of the 36 sensors chosen below are offline**, all of them on Zigbee:
  - 7 of 9 doors, windows and gates: the main bedroom, Nino's and main bathroom doors, the mudroom bathroom and powder room doors, the playroom window and the backyard gate;
  - 5 of 13 leak sensors;
  - 2 of 4 climate sensors.
- Most read `last_changed` 2026-09-30 01:17–01:19 UTC, which is **the last HA restart**: they haven't reported since then. Several were already dark on 09-23 (`plans/monitoring-dashboards/backlog.md`). Across ZHA, 47 of 149 devices are dark.
- **The mesh:** Zigbee routers are 17 of 19 online (`switch.smart_plug_1_switch` and `switch.smart_plug_17_switch` are down). Hue outdoor spots are 13 of 14 (`light.hue_spot_12_light` is down). BLE proxies are 16 of 17 (`sensor.bermuda_global_active_proxy_count`).
- **1 key sensor is below 20% battery:** the kitchen sink leak sensor, at 4%.
- The only existing health signal is `sensor.leak_sensors_unavailable`, which covers leak sensors only. ZHA has no coordinator entity, so no dashboard can show Zigbee status without a template entity.

## Goal

One mobile-first kohbo page, **More → Sensors** (`/dashboard-kohbo/sensors`), that answers "is anything broken?" in one glance. Following John's instruction, it doesn't show "too many random sensors and battery devices":

- **Summary:** Offline, Low Battery, Network.
- **Needs Attention** first: offline key sensors, oldest outage first, plus any key sensor with a low battery. This is the only place a battery % appears.
- **Network:** 5 fixed rows: the Zigbee coordinator, "Zigbee routers: N of 19 online", the Z-Wave controller, "Hue spots: N of 14 online" and "BLE proxies: N of 17". The alarm-panel rows were dropped (Decision E). The individual plugs and spots are never listed.
- **Type sections** (Motion & Occupancy, Doors & Windows, Leak, Climate & Air, Presence). Each row shows the name, Online/Offline, area and time since the last change. A section with nothing online hides itself, title included.

There are 36 curated sensors. The package `packages/system/sensor_health/` was approved by John on 2026-10-16. It holds groups and template entities, no automations, and becomes JK-1094's source of truth.

## Decisions (John, 2026-10-16)

- **A. Package: approved.** Keep `packages/system/sensor_health/`. It isn't dashboard-only.
- **B. Low battery means below 20%.** It's defined once, as the entity-level `variables: {low_battery_threshold: 20}` on `sensor.key_sensors_low_battery`. Both its state and its attribute templates read it. HA 2026.x state-based template entities accept `variables:` (`components/template/schemas.py:95`, `template_entity.py:180`, checked in the container). The row JS never compares against a threshold. It only reads that sensor's `batteries` map, which contains low sensors only, so there's no second copy of 20.
- **C. "For sensors don't show too many random sensors and battery devices"** (this overrides the earlier "mesh only when offline"):
  - the list is cut to 36 sensors John would act on (dropped table below);
  - no battery % on normal rows, only on low ones in Needs Attention;
  - the router plugs and Hue spots are never listed individually: one N-of-total row each in Network, and tapping opens more-info on its group.
- **D. Scope change, mid-build (2026-10-16): track what the room pages use, on three tabs.** John: "add all devices that are used in the rooms… a page for disconnected devices and another section/page for low battery." This overrides C's 36-sensor list and the single-page layout below.
  - **The list** is derived from `dashboards/kohbo/rooms/**`:
    - physical-device sensors only, one entity per device;
    - group and min_max wrappers expanded, floor aggregates skipped;
    - wired alarm-panel zones left to the Network rows;
    - plus `group.leak_sensors`.
  - That gives 60 devices. The table is in `build-log.md`. Sensors on no room page stay out.
  - **New room-page sensors must be added to the package groups** (README + LEARNINGS).
  - **The pages** are tabs under a shared header, like Plants:
    - **Overview** (`/sensors`): tiles (Offline and Low Battery open their tabs), the Network rows, online sensors by type;
    - **Offline** (`/sensors-offline`): oldest outage first;
    - **Low Battery** (`/sensors-low-battery`): lowest first, with the %.
  - Needs Attention is replaced by the two tabs.
- **E. Alarm-panel rows dropped (2026-10-16).** The two Konnected uptime entity IDs carry a device-specific suffix, so the Network section has 5 rows until John renames them to generic IDs and they're re-added (package README backlog).

## Approach

### (b) + (c): groups in a package, rendered with auto-entities

- **(b) Groups and template entities in a package.** One list, which the dashboard and JK-1094 share. This follows `packages/leak_monitoring.yaml` (`group.leak_sensors` + `sensor.leak_sensors_unavailable`).
- **(c) auto-entities.** v1.16.1 (HACS) is registered in `lovelace_resources` and already used on `chores/chores.yaml` and `security/security.yaml`. It renders the type sections and Needs Attention from those groups and sensors.
- **(a) A hand-curated list** was rejected. It would be written three times, and it can't show Zigbee status at all.
- **The groups must be old-style `group:`.** `expand()` and auto-entities' `group:` filter read the `entity_id` attribute, which `platform: group` doesn't publish (memory: expand() is empty on group-platform entities).

### Grouping by type, area on every row

- The types fail and matter differently: a leak is urgent, motion isn't. JK-1094 will alert per type.
- The kohbo security pages already split by type.
- Every row's label carries the area, so the current spatial pattern (upstairs plus far rooms) still shows in Needs Attention.

### auto-entities mechanics (checked in the installed `auto-entities.js`)

- **`filter.include` rules get `options` merged; `filter.template` output does not.** `update_entities` maps each template item with `t => typeof t == "string" ? {entity: t} : t` and appends it as-is.
  - So **Needs Attention's template emits full row objects**: a list of `{"entity": id, "type": "custom:button-card", "template": "kohbo_device_sensor_health_entity"}` built with `namespace` and output with `| tojson`.
  - HA's render_template turns that into a list, and the renderer keeps non-strings as-is.
  - **Type sections use `include` rules with `options`**, where the merge does apply.
- **Empty sections hide** with the `chores.yaml:111` pattern: the title sits on the auto-entities card's inner `entities` card, plus `show_empty: false`. When nothing matches, the title and the rows disappear together. Doors is 2 online of 9 today, so a fully offline section is realistic.
  - The inline style chores uses becomes **one new shared include**, `templates/includes/card_mod/entities/kohbo_auto_entities_section.yaml`: a transparent card, a section-title header and an 8px row gap. There's no inline CSS in the view. Moving chores onto the include is backlog.
- **Problems first, each sensor once:**
  - type sections `exclude` `unavailable`/`unknown`, so offline rows move up to Needs Attention and come back when they recover;
  - Needs Attention sorts by `last_changed`, oldest first;
  - its `else:` shows a "Needs Attention" title with "All key sensors are online and no batteries are low."

### Row template: O(1) lookups only

`kohbo_device_sensor_health_entity` lives in `templates/button_cards/cards/devices/horizontal_device_entity_horizontal_cards/` and extends `kohbo_device_entity_horizontal`.

- **No scans, every lookup O(1) and null-guarded:**
  - `reg = hass.entities?.[entity.entity_id]`; YAML entities without a `unique_id` have no entry.
  - `dev = hass.devices?.[reg?.device_id]`.
  - `area = hass.areas?.[reg?.area_id ?? dev?.area_id]?.name ?? ''`. The FP2 devices point at a missing area id, and any other dangling id shows no area.
  - `name = (dev?.name_by_user ?? dev?.name ?? entity.attributes.friendly_name)`, with `variables.strip` (a regex string) removed. A card-level `name:` overrides it.
  - `battery = states['sensor.key_sensors_low_battery']?.attributes?.batteries?.[entity.entity_id]`. It's present only when the battery is low.
  - The Jinja side does the device→battery lookup. `device_class` comes from `states[x].attributes`; `hass.entities` doesn't carry it.
- **States, in this order:**
  - `Offline`, or `No data` for `unknown`, when the state is `unavailable`/`unknown` or a connectivity `binary_sensor` is `off`;
  - `N / total` when the entity has a `total` attribute and its state is below it (the mesh rows);
  - `Low battery`;
  - otherwise `Online`.
  - Colours: offline and degraded `--warning-color`, low battery `--error-color`, online `--success-color`.
  - The state column widens from 60px to `90px` so "Low battery" and "No data" fit.
- **Label:**
  - `<area> · changed <rel>`, or `<area> · offline <rel>` for offline rows;
  - plus ` · Battery 4%` only when a battery value is present;
  - network rows use their `summary` attribute in place of the area.
  - `<rel>` uses the `m`/`h`/`d` format of `kohbo_horizontal_action_card_entity`.
- **Actions:** `tap_action: more-info`, `hold_action: none`. button-card's default would toggle switches.

### "Last seen" = `last_changed`

- **Offline rows:** `last_changed` is when the sensor went unavailable, or the 09-30 restart if it never came back.
- **Why not `last_updated`:** the ZHA reload at 10-16 21:15 UTC bumped `last_updated` on 685 entities, but left `last_changed` at 09-30 on the dead ones.
- **Online rows:** it's the last real event, or the last new reading. The label says "changed", not "seen".
- **Why not `last_reported`:** it would be the true last-seen time, but HA's compressed state feed sends the frontend only `lc` and `lu` (`homeassistant/const.py` `COMPRESSED_STATE_LAST_*`).
- **Caveat:** reloads and restarts reset `last_changed` on sensors that come back.

### Package: `packages/system/sensor_health/` (3 YAML files and a README; basenames unique repo-wide)

1. **`key_sensor_groups.yaml`** (old-style `group:`):
   - `key_sensors_motion` (5), `key_sensors_doors` (9), `key_sensors_climate` (4), `key_sensors_presence` (5): the members are in the tables below.
   - `key_sensors_network` (5).
   - `key_sensors_zigbee_routers` (19): `switch.smart_plug_1_switch` … `_18_switch` and `switch.gazebo_smart_plug_switch`. These are the routers in `zigbee_router_unavailable.yaml`, minus the 5 dead Tradfri.
   - `key_sensors_hue_spots` (14): the `light.exterior_accent_lights` members, `light.exterior_hue_outdoor_spot_1`–`_3`, `light.hue_outdoor_spot_4`–`_10` and `light.hue_spot_11_light`–`_14_light`.
   - Leak reuses the existing `group.leak_sensors` (13), untouched.
2. **`key_sensor_counts.yaml`** (template sensors with `unique_id`, `default_entity_id`, no `initial:`, no unit):
   - **`sensor.key_sensors_offline`**: members of the motion, doors, leak, climate and presence groups in `unavailable`/`unknown`. The state is the count; the `entities` attribute holds the IDs.
   - **`sensor.key_sensors_low_battery`**: `variables: {low_battery_threshold: 20}`.
     - The `batteries` attribute is a dict `{sensor_id: level}`, for members whose device battery is below the threshold.
     - The lookup: `{% set d = device_id(e) %}{% if d %}` → `device_entities(d) | select('match', 'sensor\\.') | select('is_state_attr', 'device_class', 'battery') | first | default(none)`.
     - The comparison: `{% if b and states(b) | is_number and states(b) | float(0) < low_battery_threshold %}`.
     - The `device_id()` guard matters: `device_entities(None)` passes `None` into `async_entries_for_device` (`helpers/template/extensions/devices.py`).
     - The state is the count, from the same loop. Output the dict with `| tojson` so it stays a dict.
   - **`sensor.key_sensors_network_problems`**: `key_sensors_network` members that are `off`, `unavailable` or `unknown`, or whose `total` attribute is above their state.
3. **`network_status.yaml`**:
   - **`binary_sensor.zigbee_coordinator_online`** (connectivity): `config_entry_attr('aca4c70dc280edb389f2148461676c66', 'state')` is `loaded`, guarded for `none`, with `now()` so it re-renders each minute. The same entry and trick as `zigbee_coordinator_offline.yaml`. Summary: "UZG-01".
   - **`binary_sensor.zwave_controller_online`** (connectivity): `sensor.home_assistant_connect_zwa_2_status` is `ready`. The summary is the status.
   - **`sensor.zigbee_routers_online`**: the count of available `key_sensors_zigbee_routers` members, with `total: 19` taken from the group size (not a literal) and a summary of "17 of 19 online".
   - **`sensor.hue_spots_online`**: the same shape on `key_sensors_hue_spots` (13 of 14). It uses no Hue config entry ID: when the bridge drops, the spots go unavailable, so the count covers it. The README records the Hue entry ID (`0ab8a214235e9a3867fdbc2dc1358cb0`) for reference only.
   - **`sensor.ble_proxies_online`**: the state is `bermuda_global_active_proxy_count`, `total` is `_total_proxy_count`, and the summary is "16 of 17 active".

### Where it lives

- **More → Sensors** in `navbar.yaml`, after Plants, with `mdi:access-point-network` (checked in the container's MDI `iconList.json`).
- The view is `dashboards/kohbo/more/sensors.yaml`, registered in `kohbo.yaml` after `# More` / `people.yaml`.
- It's a top-level More page like Energy and Chores, not a Security tab: the security header has no room for a fourth tab at phone width.
- **No settings popup** until JK-1094 brings alert toggles; John's popups hold feature toggles only.

## Page layout (scaffold)

`more/sensors.yaml`: `type: custom:vertical-layout`, `title: Sensors`, `path: sensors`, `theme: kohbo`, `layout: !include …/layouts/kohbo_page_layout.yaml`, a 1–3 line header comment.

1. **Header:** `top_toolbar` with `empty_column`, `kohbo_header_page_title` "Sensors", `empty_column`.
2. **Summary:** `custom:stack-in-card` + `kohbo_horizontal_stack_bg.yaml` include + a `horizontal-stack` of 3 `kohbo_security_item` cards (the Security overview pattern), `tap_action: none`:

   | Card | Entity | Icon | Today |
   |---|---|---|---|
   | Offline | `sensor.key_sensors_offline` | `mdi:lan-disconnect` | 14 (red) / "None" (green) |
   | Low Battery | `sensor.key_sensors_low_battery` | `mdi:battery-alert` | 1 / "None" |
   | Network | `sensor.key_sensors_network_problems` | `mdi:access-point-network` | "3 Issues" / "OK" |

3. **Needs Attention:** `custom:auto-entities`:
   - `card: {type: entities, title: Needs Attention, card_mod: !include …/kohbo_auto_entities_section.yaml}`
   - `show_empty: false`
   - `filter.template`: one object per ID in `(state_attr('sensor.key_sensors_offline','entities') or [])` and `((state_attr('sensor.key_sensors_low_battery','batteries') or {}) | list)`, each with `type` and `template` set, output with `| tojson`
   - `sort: {method: last_changed}`
   - `else`: a `vertical-stack` of `section_title` "Needs Attention" and `kohbo_card_section_description` "All key sensors are online and no batteries are low."
   - Today: 14 offline rows, plus the kitchen sink leak at "Battery 4%".
4. **Network:** `section_title` "Network", then 5 **static** `custom:button-card` rows with `template: kohbo_device_sensor_health_entity` and explicit `name:`:

   | Row | Entity | Tap (more-info) | Today |
   |---|---|---|---|
   | Zigbee Coordinator | `binary_sensor.zigbee_coordinator_online` | itself | Online |
   | Zigbee Routers | `sensor.zigbee_routers_online` | `group.key_sensors_zigbee_routers` | 17 / 19 |
   | Z-Wave Controller | `binary_sensor.zwave_controller_online` | itself | Online |
   | Hue Spots | `sensor.hue_spots_online` | `group.key_sensors_hue_spots` | 13 / 14 |
   | BLE Proxies | `sensor.ble_proxies_online` | itself | 16 / 17 |

   The group more-info lists each member with its state, which shows which plug or spot is down. That's simpler than building a popup. The rows are static because two of them tap a different entity than they display, which auto-entities `options` can't vary per row.
5. **Motion & Occupancy:** auto-entities:
   - `card: {type: entities, title: Motion & Occupancy, card_mod: !include …/kohbo_auto_entities_section.yaml}`, `show_empty: false`
   - `filter.include: [{group: group.key_sensors_motion, options: {type: custom:button-card, template: kohbo_device_sensor_health_entity, variables: {strip: ' ?(Motion Sensor|Motion Detector|Motion)'}}}]`
   - `exclude: [{state: unavailable}, {state: unknown}]`, `sort: {method: entity_id}`
6. **Doors & Windows:** the same, on `group.key_sensors_doors`, `strip: ' Sensor$'`.
7. **Leak:** `group.leak_sensors`, `strip: ' ?Leak Sensor( - )?'`.
8. **Climate & Air:** `group.key_sensors_climate`, `strip: ' (Climate|Weather Sensor|AQI)$'`.
9. **Presence:** `group.key_sensors_presence`, `strip: ' (Presence Sensor|Sensor)$'`.
10. **Navbar** include.

There's no `conditional` card (so the `condition: template` gotcha doesn't apply) and no `confirmation`.

### The curated sensors (36, all verified in the 10-16 live dump)

"Shown as" is the device name after `strip`.

**Motion & Occupancy (`group.key_sensors_motion`, 5):** the main living rooms and bedrooms.

| Entity | Shown as | Area | Live 10-16 |
|---|---|---|---|
| `binary_sensor.family_room_motion_sensor` | Family Room | Family Room | online |
| `binary_sensor.kitchen_motion_sensor_main_motion_detection` | Kitchen Main | Kitchen | online |
| `binary_sensor.office_aqara_motion_sensor` | Office | Office | online |
| `binary_sensor.playroom_motion_sensor_motion` | Playroom | Playroom | online |
| `binary_sensor.main_bedroom_motion_sensor_entry_motion` | Main Bedroom Entry | Main Bedroom | online |

**Doors & Windows (`group.key_sensors_doors`, 9):** the wireless exterior windows and gates, plus the five interior doors that drive occupancy and that John flagged. The wired exterior doors belong to the Konnected alarm panels (re-add after renaming the uptime entities to generic IDs).

| Entity | Shown as | Area | Live 10-16 |
|---|---|---|---|
| `binary_sensor.main_bedroom_door_sensor_status` | Main Bedroom Door | Main Bedroom | OFFLINE since 09-30 |
| `binary_sensor.ninos_door_sensor_status` | Nino's Door | Nino's Room | OFFLINE since 09-30 |
| `binary_sensor.main_bathroom_door_sensor_status` | Main Bathroom Door | Main Bathroom | OFFLINE since 09-30 |
| `binary_sensor.mudroom_bathroom_door` | Mudroom Bathroom Door | Mud Room | OFFLINE since 09-30 |
| `binary_sensor.powder_room_door` | Powder Room Door | Powder Room | OFFLINE since 09-30 |
| `binary_sensor.kitchen_window_sensor` | Kitchen Window | Kitchen | online |
| `binary_sensor.playroom_window_sensor` | Playroom Window | Playroom | OFFLINE since 09-30 |
| `binary_sensor.backyard_main_entry_gate_opening` | Backyard Main Entry Gate | Backyard | OFFLINE since 09-30 |
| `binary_sensor.pool_main_gate_opening` | Pool Main Entry Gate | Pool | online |

**Leak (existing `group.leak_sensors`, 13):** all of them, because every leak sensor is actionable.

| Entity | Shown as | Area | Live 10-16 |
|---|---|---|---|
| `binary_sensor.kitchen_sink_leak_sensor` | Kitchen Sink | Kitchen | online, **battery 4%** |
| `binary_sensor.laundry_room_leak_sensor` | Laundry Room | Laundry Room | online |
| `binary_sensor.basement_sum_pump_leak_sensor` | Basement Sum Pump | Sum Pump Room | OFFLINE since 09-30 |
| `binary_sensor.upstairs_laundry_leak_sensor` | Upstairs Laundry | Upstairs Laundry Room | OFFLINE since 10-03 |
| `binary_sensor.storage_room_leak_sensor` | Storage Room | Unfinished Storage Room | OFFLINE since 09-30 |
| `binary_sensor.basement_exterior_door_leak_sensor` | Basement Exterior Door | Basement Main | online |
| `binary_sensor.basement_window_leak_sensor_moisture` | Basement Window | Basement Main | online |
| `binary_sensor.furnace_pan_leak_sensor_moisture` | Furnace Pan | Attic | OFFLINE since 09-30 |
| `binary_sensor.leak_sensor_hvac_moisture` | HVAC | Utility Room | online |
| `binary_sensor.leak_sensor_basement_bathroom_moisture` | Basement Bathroom | Basement Main | online |
| `binary_sensor.main_bathroom_leak_sensor_moisture` | Main Bathroom | Main Bathroom | online |
| `binary_sensor.nino_s_bathroom_leak_sensor_moisture` | Nino’s Bathroom | Nino's Room | online |
| `binary_sensor.upstairs_hallway_bathroom_leak_sensor_moisture` | Upstairs Hallway Bathroom | Upstairs Hallway Bathroom | OFFLINE since 10-08 |

**Climate & Air (`group.key_sensors_climate`, 4):** the sensors the climate and shower automations read most.

| Entity | Shown as | Area | Live 10-16 |
|---|---|---|---|
| `sensor.kitchen_awair_temperature` | Kitchen | Kitchen | online |
| `sensor.main_bedroom_temperature` | Main Bedroom | Main Bedroom | OFFLINE since 09-30 |
| `sensor.nino_room_temperature` | Nino Room | Nino's Room | OFFLINE since 09-30 |
| `sensor.main_bathroom_humidity` | Main Bathroom | Main Bathroom | online |

**Presence (`group.key_sensors_presence`, 5):** one room-presence proxy per room.

| Entity | Shown as | Area | Live 10-16 |
|---|---|---|---|
| `binary_sensor.kitchen_presence_sensor_west` | Kitchen | Kitchen | online |
| `binary_sensor.playroom_presence_sensor` | Playroom | Playroom | online |
| `binary_sensor.john_bed_occupied` | Main Bedroom Bed | Main Bedroom | online |
| `binary_sensor.nino_bed_occupied` | Nino Bed | Nino's Room | online |
| `binary_sensor.gianluca_bed_occupied` | Gianluca Bed | Gianluca's room | online |

### Dropped from the first draft (John can veto any line)

| Dropped | Why |
|---|---|
| Motion: Foyer, Dining Room North, Mudroom, Mudroom Bathroom, Laundry, Garage, Sunroom, Stairs Down/Up, Main Bathroom, Upstairs Hallway N/S, Kitchen Table, Main Bedroom Back, Playroom Entry, Pool East/West | Not main living rooms or bedrooms, or a second sensor in the same room |
| Motion: Vivint Basement West/East | Vivint panel extras (basement west is at 4% battery; see Out of scope) |
| Doors: Main Bathroom Toilet, Gianluca's, Jr. Suite, Office Left/Right, Kitchen Fridge, Main Level Washer | Secondary interior or appliance doors. The toilet door isn't read by any automation |
| Windows: Kitchen West Middle, Playroom West Left, Office | A second window in the same room. Office window is the lowest-use of the five (1 automation reference) |
| Climate: Kitchen, Playroom, Office, Guest Bedroom (Aqara); Tempest; 5 other Awairs | Duplicates of a room already covered, a weather station (on the climate pages), or a low-use room |
| Presence: Main Bathroom radar target, Main Bedroom West, the Kitchen Screek | Secondary radar targets or duplicate per-room radars |
| Presence: FP2 Basement North/South | Per-zone FP2 sub-sensors |
| Presence: ESPresense ×3 | Being replaced by Bermuda. BLE health is the BLE Proxies row |
| Office Apollo MSR-2, Nino's room Screek, Nino Bed OLD, Voice PE | Old or unused devices (see Out of scope) |
| 19 router plugs and 14 Hue spots as rows | Replaced by the two N-of-total Network rows |

## Decisions

1. **(b) + (c):** package groups and template entities, rendered with installed auto-entities (Decision A).
2. **Grouped by type**, with the area on every row.
3. **Problems first:** offline rows sit only in Needs Attention. Low-battery rows appear there too, and are the only place a battery shows.
4. **`last_changed`** is "last seen" (reasons above).
5. **Names come from device names** with a per-section `strip`. The Network rows use explicit names.
6. **The battery lookup lives in Jinja** (`device_id` → `device_entities` → `device_class: battery`). The row reads one dict key. The threshold is a single `variables:` value (Decision B).
7. **`unknown` counts as offline** ("No data").
8. **Mesh as counts:** `sensor.zigbee_routers_online` / `sensor.hue_spots_online` / `sensor.ble_proxies_online` carry a count plus `total`, not an all-or-nothing boolean. Tapping opens the group's more-info.
9. **More → Sensors**, no settings popup until JK-1094.
10. **Standing preferences:**
    - no `confirmation`;
    - mobile-first full-width rows;
    - shared card_mod includes only (one new include);
    - every view registered in `kohbo.yaml`;
    - modern syntax;
    - no PII: the device names used are already in the repo, and there are no routines and no new IPs.

## Tasks

All work happens in `.claude/worktrees/sensors-dashboard` on `feature/sensors-dashboard`, rebased on `origin/master` with Plants #46 in. Commits go in task order.

1. **Entity re-check (read-only).** Using a fresh live dump, re-run the 36 sensors and the mesh lists.
   - AC: every entity exists. Report before building if the offline set has changed.
   - AC: the ZHA entry `aca4c70dc280edb389f2148461676c66` is `loaded`.
2. **Groups:** `key_sensor_groups.yaml` with old-style `group:`.
   - AC: 8 groups with exactly the members above (5 / 9 / 4 / 5 / 5 / 19 / 14).
   - AC: `group.leak_sensors` is untouched.
3. **Network entities:** `network_status.yaml`.
   - AC: 2 connectivity binary sensors and 3 count sensors, each with a `total` and a `summary` attribute (the binary sensors have a `summary` only).
   - AC: the ZHA template guards `config_entry_attr(...)` returning `none` and includes `now()`.
   - AC: rendered live (Developer Tools → Template, or `POST /api/template`, ask first) they give on / on / 17 / 13 / 16, or the re-check's values.
4. **Count sensors:** `key_sensor_counts.yaml`.
   - AC: `low_battery_threshold: 20` appears **once** in the repo (`grep -rn "low_battery_threshold: 20"` → 1 hit), and no other `20` threshold appears in the package or the row template.
   - AC: the battery comparison is exactly `states(b) | is_number and states(b) | float(0) < low_battery_threshold`, inside the `{% if d %}` device guard.
   - AC: `batteries` renders as a dict (`| tojson`).
   - AC: the live render gives 14 / 1 (`{binary_sensor.kitchen_sink_leak_sensor: 3.5}`) / 3.
5. **Shared include:** `templates/includes/card_mod/entities/kohbo_auto_entities_section.yaml`, built from the `chores.yaml` inline style (transparent card, title header, 8px row gap).
   - AC: the view has no inline `style:`.
6. **Row template:** `kohbo_device_sensor_health_entity.yaml`.
   - AC: it extends `kohbo_device_entity_horizontal` and has a 90px state column.
   - AC: `tap_action: more-info` and `hold_action: none`.
   - AC: there's no `Object.keys(hass.entities)`, `Object.values(hass.entities)` or other iteration over `hass.entities`/`hass.states` (grep). Every lookup is a direct key read.
   - AC: every `hass.entities[...]`, `hass.devices[...]` and `hass.areas[...]` access uses optional chaining, and a missing area renders as no area, not "undefined". Check it on an FP2 entity in the browser console with `hass.areas['basement_sum_pump_room']` undefined.
   - AC: the state precedence and colours are as specified.
7. **The view:** `dashboards/kohbo/more/sensors.yaml` as scaffolded.
   - AC: `path: sensors` and the 10 blocks in order.
   - AC: the Needs Attention template outputs objects, each with `entity`, `type` and `template` set. This works because `update_entities` in the installed `www/community/lovelace-auto-entities/auto-entities.js` keeps non-string template items as-is: quote that line in the build log. With a temporary offline-only filter in the browser, the rows render as button-cards, not as an error card.
   - AC: every type section has its title on the inner `entities` card and `show_empty: false`. In the browser, a test with a temporary `exclude` of everything hides the title.
   - AC: the Network rows are static, and the router and Hue rows tap more-info on their groups.
   - AC: no `confirmation`, no `conditional`.
8. **Register and navigate:**
   - Add `- !include /config/dashboards/kohbo/more/sensors.yaml` after `more/people.yaml` in `kohbo.yaml`.
   - Add More → Sensors after Plants in `navbar.yaml`.
   - AC: a two-hunk diff on top of the post-#46 files.
9. **Docs (own commit):**
   - `packages/system/sensor_health/README.md`:
     - the groups and entities;
     - adding a sensor is one group line;
     - the threshold's single home;
     - the ZHA and Hue config entry IDs (Hue is for reference, not used);
     - JK-1094 should alert from these.
   - `dashboards/SITEMAP.md`: Sensors under More, plus the tree and the file structure.
   - `dashboards/CLAUDE.md`:
     - add `auto-entities` to the HACS table (it's missing);
     - kohbo is `mode: yaml`, not storage.
   - `dashboards/LEARNINGS.md`, three bullets:
     - the frontend never sees `last_reported`, so use `last_changed` for "offline since";
     - auto-entities `options` don't apply to `filter.template` output, so emit full objects;
     - auto-entities' `group:` needs old-style groups.
   - `docs/DEVICES.md`: one line pointing to the page.
10. **Validate (scripted).** Run against the committed branch and paste the output into `plans/sensors-dashboard/build-log.md`:
    - `python3 /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/validate_dash.py /Users/johnkoht/code/hassio-config/.claude/worktrees/sensors-dashboard /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/live_states.json` (with a fresh dump).
    - `tests/run.sh` in full.
    - `yamllint -c .yamllint` on every touched file.
    - `./deploy.sh --check --skip-ci`, never without `--skip-ci`.
    - A PII grep of the added lines.
    - gitleaks runs in the commit hook; never pass `--no-verify`. Never deploy, reload or restart.
    - AC: the validator's only problems are `entity-missing` for the 8 new template entities, which don't exist until deploy. Its notes are only the offline sensors in the tables.
    - AC: tests, yamllint, the config check and the PII grep are clean.
11. **Browser verification, after John deploys:**
    - AC: every checklist item passes.

## Risks

- **Reloads.** `deploy.sh --reload` reloads only automations, scripts and rest_command. **Groups** and **Template entities** need Developer Tools → YAML reloads, or the page renders empty. Never restart.
- **The Yellow → epicurus cutover this weekend.** The ZHA entry ID is hard-coded, as in `zigbee_coordinator_offline.yaml`. A backup restore keeps it. Re-check after the cutover; it's listed in the README.
- **The template filter re-renders on every member change.** That's cheap: 36 entities plus 2 attributes.
- **The `batteries` dict on a recorded sensor:** at most a few entries, and the recorder dedupes attributes.
- **Sort is by `entity_id`, not the displayed name.** v1.16.1 has no device or area sort. Accepted.
- **`last_changed` resets on reload**, so online rows can read "changed 6h". Accepted, and worded "changed".
- **Device renames in the UI rename rows.** That's intended.
- **Lovelace YAML has no tests.** Mitigation: the validator, the template renders and the browser pass.

## Post-deploy checklist (phone width)

1. Push, `./deploy.sh --reload`, then Developer Tools → YAML → reload **Groups** and **Template entities**. `touch` `kohbo.yaml` on the host, since kohbo is `mode: yaml` and HA re-reads it only when that file's mtime changes. A separate PR is adding this step to `deploy.sh`.
2. More → Sensors shows the access-point icon and opens `/dashboard-kohbo/sensors` with no red cards.
3. The summary reads Offline 14, Low Battery 1, Network 3 Issues (or the deploy-day values), and the counts match the rows.
4. Needs Attention lists the 14 offline rows, oldest first, each reading "offline 16d"-style with its area, and the kitchen sink leak with "Battery 4%". No other row anywhere shows a battery.
5. Network:
   - Zigbee Routers reads 17 / 19 and tapping it lists plugs 1 and 17 as unavailable;
   - Hue Spots reads 13 / 14 and tapping it shows spot 12;
   - BLE Proxies reads 16 / 17.
6. Doors & Windows shows only the 2 online rows. A section with nothing online has no title. The FP2-style missing-area case renders without "undefined".
7. Tapping a row opens more-info; nothing toggles.
8. The page scrolls smoothly on the phone, with no lag on state updates.

## Out of scope (backlog)

- **JK-1094 alerts:**
  - build them on `sensor.key_sensors_offline`, `sensor.key_sensors_network_problems` and the groups;
  - leak alerts are urgent;
  - use a `for:` that survives reloads;
  - this is where the settings popup gets added.
- **Zigbee routers alerting:** alert on a count or threshold from `sensor.zigbee_routers_online`, not all-or-nothing. Then trim or retire `zigbee_router_unavailable.yaml`, which still watches the 5 dead Tradfri and uses legacy syntax.
- **The Zigbee outage itself** goes to the homelab agent / John. 47 of 149 ZHA devices are dark, 11 of the 15 URC4460 door sensors among them, and most have been silent since 09-30.
- **Replace batteries:** the kitchen sink leak sensor (4%), plus the Vivint basement west motion detector (4%), which isn't on the page.
- **Dead or unreferenced devices to fix or delete:**
  - the Office Apollo MSR-2;
  - the Nino's room Screek;
  - the old Family Room Atom BLE proxy (the missing Bermuda proxy);
  - "Nino Bed OLD";
  - the Voice PE;
  - ESPresense Office (no data).
- **`binary_sensor.zigbee2mqtt_bridge_connection_state` has been off since 10-16.** Clear its MQTT discovery if Z2M isn't in use yet.
- **FP2 Basement North hasn't changed since 09-30.** It may be stuck. The FP2s also point at a missing area id.
- **Move `chores.yaml`'s inline auto-entities style** onto the new shared include.
- **Related dashboards:** the full battery list is JK-78, all devices JK-1056, hardware JK-1028.
- **`rooms/active_rooms.yaml` is included twice** in `kohbo.yaml`.

On approval → /approve → /ship sensors-dashboard
