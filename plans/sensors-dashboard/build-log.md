# Build log: sensors-dashboard (JK-1224)

Built 2026-10-16 on `feature/sensors-dashboard`, rebased onto origin/master `74fa59e` (#47). Nothing was pushed, deployed or reloaded. Live data was read through fresh `/api/states` dumps and read-only `POST /api/template` renders on the Yellow (HA 2026.7.4).

**Scope change mid-build** (plan Decision D): the sensor list is now every physical sensor the room pages use. The page is three tabs: Overview, Offline and Low Battery.

## Commits

- `8692ca3` feat(sensor_health): key sensor groups, network status and rollup sensors (JK-1224)
- `a0b1abb` feat(dashboards): sensor health row, summary tile, section include and tab header (JK-1224)
- `12e3a6b` feat(dashboards): Sensors Overview, Offline and Low Battery tabs, registered under More (JK-1224)
- `bf8ba71` docs: Sensors page, sensor_health README and LEARNINGS (JK-1224)
- `plan: sensors-dashboard` (this commit): plan.md (Decisions D and E) + this build log

## Task 1: entity re-check (fresh dump, 7,130 states)

- All 36 entities in the original plan exist. The offline set is unchanged: 14 sensors (7 doors and windows, 5 leak, 2 climate).
- Routers are 17/19 (plugs 1 and 17 down), Hue spots 13/14 (spot 12 down), BLE proxies 16/17.
- The ZHA entry `aca4c70dc280edb389f2148461676c66` renders `loaded`.
- **Finding:** `config_entry_attr(..., 'state')` returns a plain string on 2026.7.4, so `s.value` renders empty:
  ```
  [{{ s.value }}] [{{ s.value != 'loaded' }}] [{{ s == 'loaded' }}]  →  [] [True] [True]
  ```
  - `binary_sensor.zigbee_coordinator_online` compares `s == 'loaded'`, which is correct for both a str and a StrEnum.
  - The existing `system/alerts/zigbee_coordinator_offline.yaml` had the same `s.value` bug, which was always true. It has since been fixed on master in #47 (`74fa59e`), and this branch is rebased onto it.

## auto-entities: template items are kept as-is (installed `/config/www/community/lovelace-auto-entities/auto-entities.js`, v1.16.1)

```
v=function(t){return t?"string"==typeof t?{entity:t.trim()}:t:null}
...
this._template&&(y=y.concat(this._template.map(v)))
e._renderer=function(t){e._template="string"==typeof t?t.split(/[\s,]+/):t, ...}
```

- Non-string items pass through untouched, so `options` never applies to them. That's why the rows are full objects.
- A string result is split on whitespace and commas, which matters because of the next finding.
- **Finding:** HA turns template results into native types with `literal_eval` (`helpers/template/__init__.py` `_parse_result`). JSON `true` is not a Python literal, so a row object carrying `"show_battery": true` comes back as a *string*, and auto-entities would shred it. The rows therefore use `show_battery: 1`. Checked locally: the `true` version fails `literal_eval` with a ValueError; the `1` version parses to a list of 15.

## Derived sensor list (replaces the 36)

Script: `derive_room_sensors.py` in the scratchpad (not committed). It walks every `dashboards/kohbo/rooms/**/*.yaml`, room pages and partials alike.

**Kept:**
- `binary_sensor` motion, occupancy, presence, door, window, opening and moisture;
- `sensor` temperature, humidity, CO2, VOC, PM2.5 and illuminance;
- plus `group.leak_sensors`.

**Expanded or dropped:**
- `platform: group` and `min_max` wrappers were expanded to their members.
- Floor aggregates (`packages/house/areas`, `packages/climate`) were skipped.
- Entities without a physical device (template, group, min_max, Bermuda) were dropped, as was every `*_people_list`.
- The rest were collapsed to one entity per device. Priority: leak > door > motion > presence > climate, then temperature first. So an Awair is one row, not five.
- The Konnected wired zones (7 doors) were left out. They belong to the Konnected alarm panels (re-add after renaming the uptime entities to generic IDs), which are not on the page yet.

| # | Entity | Room page(s) | Type | Device | Battery | Live 10-16 |
|---|---|---|---|---|---|---|
| 1 | `binary_sensor.dining_room_north_motion_sensor_motion` | dining_room | motion | Dining Room North Motion Sensor | yes | OFFLINE since 09-30 |
| 2 | `binary_sensor.family_room_motion_sensor` | family_room | motion | Family Room Motion Sensor | yes (63.0%) | online |
| 3 | `binary_sensor.foyer_motion` | foyer | motion | Foyer Motion Sensor | yes (65.5%) | online |
| 4 | `binary_sensor.kitchen_motion_sensor_main_motion_detection` | kitchen | motion | Kitchen Motion Sensor Main | yes (100.0%) | online |
| 5 | `binary_sensor.kitchen_motion_sensor_table_motion_detection` | kitchen | motion | Kitchen Motion Sensor Table | yes (33.0%) | online |
| 6 | `binary_sensor.main_bedroom_motion_sensor_back_motion` | main_bedroom | motion | Main Bedroom Motion Sensor Back | yes (65.5%) | online |
| 7 | `binary_sensor.main_bedroom_motion_sensor_entry_motion` | main_bedroom | motion | Main Bedroom Motion Sensor Entry | yes (71.0%) | online |
| 8 | `binary_sensor.mudroom_bathroom_motion` | mudroom_bathroom | motion | Mudroom Bathroom Motion Sensor | yes (67.0%) | online |
| 9 | `binary_sensor.mudroom_motion_sensor_motion_detection` | main_floor_rooms, mudroom | motion | Mudroom Motion Sensor | yes (72.0%) | online |
| 10 | `binary_sensor.office_aqara_motion_sensor` | office | motion | Office Motion Sensor | yes (59.0%) | online |
| 11 | `binary_sensor.playroom_entry_motion_sensor_motion` | playroom | motion | Playroom Entry Motion Sensor | yes (73.0%) | online |
| 12 | `binary_sensor.playroom_motion_sensor_motion` | playroom | motion | Playroom Motion Sensor | yes (62.0%) | online |
| 13 | `binary_sensor.upstairs_hallway_nightlight_motion` | upstairs_hallway | motion | Upstairs Hallway Nightlight | no | online |
| 14 | `binary_sensor.gianlucas_door_sensor_status` | gianlucas_bedroom, upper_floor_rooms | doors | Gianluca's Door Sensor | yes (29.0%) | online |
| 15 | `binary_sensor.jr_suite_door_status` | jr_suite, main_floor_rooms | doors | Jr. Suite Door | yes (66.5%) | online |
| 16 | `binary_sensor.kitchen_window_sensor` | kitchen | doors | Kitchen Window Sensor | yes (77.0%) | online |
| 17 | `binary_sensor.kitchen_window_west_middle_sensor` | kitchen | doors | Kitchen Window West Middle Sensor | yes (62.5%) | online |
| 18 | `binary_sensor.main_bathroom_door_sensor_status` | main_bathroom | doors | Main Bathroom Door Sensor | yes | OFFLINE since 09-30 |
| 19 | `binary_sensor.main_bedroom_door_sensor_status` | main_bedroom, upper_floor_rooms | doors | Main Bedroom Door | yes | OFFLINE since 09-30 |
| 20 | `binary_sensor.main_level_washer_door_sensor_status` | laundry | doors | Main Level Washer Door Sensor | yes | OFFLINE since 09-30 |
| 21 | `binary_sensor.mudroom_bathroom_door` | mudroom_bathroom | doors | Mudroom Bathroom Door | yes | OFFLINE since 09-30 |
| 22 | `binary_sensor.ninos_door_sensor_status` | ninos_bedroom, upper_floor_rooms | doors | Nino's Door Sensor | yes | OFFLINE since 09-30 |
| 23 | `binary_sensor.office_door_left_status` | main_floor_rooms, office | doors | Office Door Left | yes (100.0%) | online |
| 24 | `binary_sensor.office_door_right_status` | main_floor_rooms, office | doors | Office Door Right | yes | OFFLINE since 10-09 |
| 25 | `binary_sensor.office_window_sensor` | office | doors | Office Window Sensor | yes (69.5%) | online |
| 26 | `binary_sensor.playroom_window_sensor` | playroom | doors | Playroom Window Sensor | yes | OFFLINE since 09-30 |
| 27 | `binary_sensor.playroom_window_west_left_opening` | main_floor_rooms, playroom | doors | Playroom Window West Left Sensor | yes (80.5%) | online |
| 28 | `binary_sensor.powder_room_door` | powder_room | doors | Powder Room Door | yes | OFFLINE since 09-30 |
| 29 | `binary_sensor.upstairs_washer_door_sensor_status` | laundry | doors | Upstairs Washer Door Sensor | yes (100.0%) | online |
| 30 | `binary_sensor.basement_exterior_door_leak_sensor` | (group.leak_sensors) | leak | Basement Exterior Door Leak Sensor | yes (74.0%) | online |
| 31 | `binary_sensor.basement_sum_pump_leak_sensor` | (group.leak_sensors) | leak | Basement Sum Pump Leak Sensor | yes | OFFLINE since 09-30 |
| 32 | `binary_sensor.basement_window_leak_sensor_moisture` | (group.leak_sensors) | leak | Basement Window Leak Sensor | yes (82.0%) | online |
| 33 | `binary_sensor.furnace_pan_leak_sensor_moisture` | (group.leak_sensors) | leak | Furnace Pan Leak Sensor | yes | OFFLINE since 09-30 |
| 34 | `binary_sensor.kitchen_sink_leak_sensor` | (group.leak_sensors), kitchen | leak | Kitchen Sink Leak Sensor | yes (3.5%) | online |
| 35 | `binary_sensor.laundry_room_leak_sensor` | (group.leak_sensors) | leak | Laundry Room Leak Sensor | yes (77.5%) | online |
| 36 | `binary_sensor.leak_sensor_basement_bathroom_moisture` | (group.leak_sensors) | leak | Leak Sensor Basement Bathroom | yes (70.0%) | online |
| 37 | `binary_sensor.leak_sensor_hvac_moisture` | (group.leak_sensors) | leak | Leak Sensor - HVAC | yes (74.5%) | online |
| 38 | `binary_sensor.main_bathroom_leak_sensor_moisture` | (group.leak_sensors), main_bathroom | leak | Main Bathroom Leak Sensor | yes (81.5%) | online |
| 39 | `binary_sensor.nino_s_bathroom_leak_sensor_moisture` | (group.leak_sensors), ninos_bedroom | leak | Nino’s Bathroom Leak Sensor | yes (57.0%) | online |
| 40 | `binary_sensor.storage_room_leak_sensor` | (group.leak_sensors) | leak | Storage Room Leak Sensor | yes | OFFLINE since 09-30 |
| 41 | `binary_sensor.upstairs_hallway_bathroom_leak_sensor_moisture` | (group.leak_sensors) | leak | Upstairs Hallway Bathroom Leak Sensor | yes | OFFLINE since 10-08 |
| 42 | `binary_sensor.upstairs_laundry_leak_sensor` | (group.leak_sensors) | leak | Upstairs Laundry Leak Sensor | yes | OFFLINE since 10-03 |
| 43 | `sensor.gianluca_bedroom_awair_temperature` | gianlucas_bedroom, upper_floor_rooms | climate | Gianluca’s Bedroom AQI | no | online |
| 44 | `sensor.jr_suite_awair_temperature` | jr_suite, main_floor_rooms | climate | Jr. Suite AQI | no | online |
| 45 | `sensor.kitchen_awair_temperature` | family_room, kitchen, main_floor_rooms | climate | Kitchen AQI | no | online |
| 46 | `sensor.main_bathroom_temperature` | main_bathroom | climate | Main Bathroom Weather Sensor | yes (41.0%) | online |
| 47 | `sensor.main_bedroom_awair_temperature` | main_bathroom, main_bedroom, upper_floor_rooms | climate | Main Bedroom AQI | no | online |
| 48 | `sensor.nino_bedroom_awair_temperature` | ninos_bedroom, upper_floor_rooms | climate | Nino’s Bedroom AQI | no | online |
| 49 | `sensor.nino_room_temperature` | ninos_bedroom | climate | Nino Room Climate | yes | OFFLINE since 09-30 |
| 50 | `sensor.office_awair_temperature` | main_floor_rooms, office | climate | Office  AQI | no | online |
| 51 | `sensor.playroom_temperature` | main_floor_rooms, playroom | climate | Playroom Climate | yes (41.0%) | online |
| 52 | `sensor.tempest_temperature` | ninos_bedroom, office, upstairs_hallway | climate | Tempest | yes (97.75%) | online |
| 53 | `binary_sensor.gianluca_bed_occupied` | gianlucas_bedroom | presence | Gianluca Bed Sensor | no | online |
| 54 | `binary_sensor.kitchen_presence_sensor_west` | kitchen | presence | Kitchen Presence Sensor | no | online |
| 55 | `binary_sensor.main_bathroom_motion_sensor_occupancy` | main_bathroom | presence | Main Bathroom Motion Sensor | yes (73.0%) | online |
| 56 | `binary_sensor.main_bathroom_presence_sensor_radar_target` | main_bathroom | presence | Main Bathroom Presence Sensor | no | online |
| 57 | `binary_sensor.main_bedroom_west_presence` | main_bedroom | presence | Main Bedroom West Presence Sensor | no | online |
| 58 | `binary_sensor.nino_bed_occupied` | ninos_bedroom | presence | Nino Bed Sensor | no | online |
| 59 | `binary_sensor.playroom_presence_sensor` | playroom | presence | Playroom Presence Sensor | no | online |
| 60 | `binary_sensor.screek_human_sensor_l12_73d3d8_presence` | kitchen | presence | Human Sensor L12 73d3d8 | no | online |

**60 tracked**: motion 13, doors 16, leak 13, climate 10, presence 8. Offline 15.

Low battery among tracked devices: only the kitchen sink leak sensor (3.5%). The next lowest is Gianluca's door sensor at 29%.

From the original 36, the backyard and pool gates, `sensor.main_bedroom_temperature` and `binary_sensor.john_bed_occupied` are on no room page, so they drop out.

## Live template renders (`POST /api/template`)

The new groups don't exist yet, so the harness substituted each `'group.key_sensors_*'` with its member list. `low_battery_threshold` went through the endpoint's `variables`. Network problems were rendered over the rendered network entities.

```
binary_sensor.zigbee_coordinator_online {"state": "True", "summary": "UZG-01"}
binary_sensor.zwave_controller_online {"state": "True", "summary": "Ready"}
sensor.zigbee_routers_online {"state": "17", "total": "19", "summary": "17 of 19 online"}
sensor.hue_spots_online {"state": "13", "total": "14", "summary": "13 of 14 online"}
sensor.ble_proxies_online {"state": "16", "availability": "True", "total": "17", "summary": "16 of 17 active"}
sensor.key_sensors_offline {"state": "15", "entities": "['sensor.nino_room_temperature', 'binary_sensor.upstairs_hallway_bathroom_leak_sensor_moisture', 'binary_sensor.furnace_pan_leak_sensor_moisture', 'binary_sensor.storage_room_leak_sensor', 'binary_sensor.upstairs_laundry_leak_sensor', 'binary_sensor.basement_sum_pump_leak_sensor', 'binary_sensor.powder_room_door', 'binary_sensor.playroom_window_sensor', 'binary_sensor.office_door_right_status', 'binary_sensor.ninos_door_sensor_status', 'binary_sensor.mudroom_bathroom_door', 'binary_sensor.main_level_washer_door_sensor_status', 'binary_sensor.main_bedroom_door_sensor_status', 'binary_sensor.main_bathroom_door_sensor_status', 'binary_sensor.dining_room_north_motion_sensor_motion']"}
sensor.key_sensors_low_battery {"state": "1", "batteries": "{\"binary_sensor.kitchen_sink_leak_sensor\": 3.5}"}
sensor.key_sensors_network_problems 3
  member binary_sensor.zigbee_coordinator_online on 
  member sensor.zigbee_routers_online 17 19
  member binary_sensor.zwave_controller_online on 
  member sensor.hue_spots_online 13 14
  member sensor.ble_proxies_online 16 17
```

Page templates, with the attributes above substituted, then parsed with `literal_eval` as HA does:

```
offline.yaml live rows 15 literal_eval-> list all have entity/type/template: True
   ['sensor.nino_room_temperature', 'binary_sensor.upstairs_hallway_bathroom_leak_sensor_moisture', 'binary_sensor.furnace_pan_leak_sensor_moisture', 'binary_sensor.storage_room_leak_sensor', 'binary_sensor.upstairs_laundry_leak_sensor', 'binary_sensor.basement_sum_pump_leak_sensor', 'binary_sensor.powder_room_door', 'binary_sensor.playroom_window_sensor', 'binary_sensor.office_door_right_status', 'binary_sensor.ninos_door_sensor_status', 'binary_sensor.mudroom_bathroom_door', 'binary_sensor.main_level_washer_door_sensor_status', 'binary_sensor.main_bedroom_door_sensor_status', 'binary_sensor.main_bathroom_door_sensor_status', 'binary_sensor.dining_room_north_motion_sensor_motion']
low_battery.yaml live rows 1 literal_eval-> list all have entity/type/template: True
   ['binary_sensor.kitchen_sink_leak_sensor']
low_battery.yaml ordering-test rows 3 literal_eval-> list all have entity/type/template: True
   ['binary_sensor.kitchen_sink_leak_sensor', 'binary_sensor.test_a', 'binary_sensor.test_b']
```

The ordering test injects two fake levels (7 and 12) to prove the lowest-first `dictsort`.

**Counts:**

| Measure | Value |
|---|---|
| Tracked | 60 |
| Offline | 15 |
| Low battery | 1 |
| Network problems | 3 (routers 17/19, Hue 13/14, BLE 16/17) |
| Coordinator / Z-Wave | on / on |

The row-template JS was run in node with mocked `hass`:
- the low-battery row reads `Kitchen Sink | Low battery | Kitchen · changed 3h · Battery 4%` and turns red;
- the same row without `show_battery` shows no %;
- an FP2-style dangling area id gives `changed 10m`, with no area and no "undefined";
- an entity with no registry entry falls back to its friendly name;
- a degraded mesh row reads `17 / 19`, and a full one `Online`.

## Validation

- `tests/run.sh`: 270 passed, 9 skipped, 7 warnings in 8.55s (master now carries #47's 8 new tests)
- `tests/run.sh --syntax`: 107 passed, 172 deselected in 1.63s
- `yamllint -c .yamllint` on the 12 touched YAML files: clean (exit 0)
- `validate_dash.py` (fresh dump):
```
PROBLEM entity-missing dashboards/kohbo/sensors/low_battery.yaml sensor.key_sensors_low_battery
PROBLEM entity-missing dashboards/kohbo/sensors/offline.yaml sensor.key_sensors_offline
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml binary_sensor.zigbee_coordinator_online
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml binary_sensor.zwave_controller_online
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.ble_proxies_online
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.hue_spots_online
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.key_sensors_low_battery
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.key_sensors_network_problems
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.key_sensors_offline
PROBLEM entity-missing dashboards/kohbo/sensors/sensors.yaml sensor.zigbee_routers_online
PROBLEM entity-missing dashboards/templates/button_cards/cards/devices/horizontal_device_entity_horizontal_cards/kohbo_device_sensor_health_entity.yaml sensor.key_sensors_low_battery
files 9 problems 11
```

**Expected exceptions.** None of these 8 entities exists until the package is deployed and Template entities are reloaded. They are every one of the 11 problems:

- `sensor.key_sensors_offline`: new template sensor (`key_sensor_counts.yaml`), not deployed
- `sensor.key_sensors_low_battery`: new template sensor (`key_sensor_counts.yaml`), not deployed
- `sensor.key_sensors_network_problems`: new template sensor (`key_sensor_counts.yaml`), not deployed
- `binary_sensor.zigbee_coordinator_online`: new template binary sensor (`network_status.yaml`), not deployed
- `binary_sensor.zwave_controller_online`: new template binary sensor (`network_status.yaml`), not deployed
- `sensor.zigbee_routers_online`: new template sensor (`network_status.yaml`), not deployed
- `sensor.hue_spots_online`: new template sensor (`network_status.yaml`), not deployed
- `sensor.ble_proxies_online`: new template sensor (`network_status.yaml`), not deployed

The validator doesn't check the `group.key_sensors_*` references; they also appear only after the Groups reload. There were no include or decluttering-variable problems.

`./deploy.sh --check --skip-ci` was **not run**: the engineer brief forbids running deploy.sh.

**AC greps:**

```
## threshold literal (excluding plans/)
packages/system/sensor_health/key_sensor_counts.yaml:31:          low_battery_threshold: 20
## battery comparison
packages/system/sensor_health/key_sensor_counts.yaml:39:              {% if b and states(b) | is_number and states(b) | float(0) < low_battery_threshold %}
packages/system/sensor_health/key_sensor_counts.yaml:53:                {% if b and states(b) | is_number and states(b) | float(0) < low_battery_threshold %}
## registry iteration in row template
none
## inline style / conditional / confirmation in views
none
## Hue entry id
none
## Konnected device IDs in worktree
none
## PII grep of added lines
no hits
```

- The threshold literal appears in `plans/` too, as prose. The AC applies to config, which has 1 hit.
- The PII hit is "weather station" in plan text, a false positive.

## Deviations from the plan

1. **Scope change (Decision D):**
   - 60 room-page sensors replace the 36;
   - the page is three tabs (`dashboards/kohbo/sensors/`) instead of `more/sensors.yaml`;
   - Needs Attention became the Offline and Low Battery tabs.
2. **`show_battery` row variable.** The % shows only on the Low Battery tab. Otherwise an online low-battery sensor would show its % in its type section too.
3. **`show_battery: 1`, not `true`** (the literal_eval finding above).
4. **`kohbo_sensor_health_summary_item`.** It's a thin template over `kohbo_security_item` that the three tiles share ("two uses = a template").
5. **The ZHA template compares `s == 'loaded'`, not `s.value`** (the Task 1 finding).
6. **No Hue config entry ID in the README.** The brief says none is committed; the plan had it "for reference".
7. **The shared include uses `var(--primary-text-color)`, not chores' `#F8F9FA`** (dashboards/CLAUDE.md: no hex).
8. **The Low Battery tab has no `sort:`.** auto-entities keeps the template's lowest-first order; v1.16.1 can't sort by another entity's attribute.
9. **The alarm-panel rows were dropped (John, Decision E).**
   - Their uptime entity IDs carry a device-specific suffix, so they are removed from the branch and from its history.
   - The rewrite was `git reset --soft origin/master` and re-committing; the branch had never been pushed.
   - Network is now 5 rows, and `sensor.key_sensors_network_problems` counts 5 members.
   - Re-adding them is a README backlog item: rename the entities to generic IDs first.

## Post-deploy (John)

1. Push, then `./deploy.sh --reload`.
2. Developer Tools → YAML → reload **Groups** and **Template entities**.
3. `touch /config/dashboards/kohbo/kohbo.yaml` on the host (kohbo is `mode: yaml`).
4. Never restart.

## History check

The branch was rewritten so that no commit introduces the Konnected device IDs:

```
$ git log -p origin/master..HEAD | grep -c -i 'konnected_[0-9a-f]\{6\}'
0
```
