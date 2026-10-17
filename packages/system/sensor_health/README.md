# Sensor Health

Groups and template entities behind kohbo More → Sensors (`dashboards/kohbo/sensors/`), including the Device Health score. There are no automations here. JK-1094's offline and battery alerts should build on these entities, not on lists of their own.

## What's tracked

70 entities: the 60 physical sensors the room pages (`dashboards/kohbo/rooms/**`) use, one entity per device, including every leak sensor (`group.leak_sensors`, defined in `packages/leak_monitoring.yaml`), plus 10 safety and security devices. The room-page list was derived on 2026-10-16:

- group and min_max wrappers were expanded to their members;
- floor-level aggregates were skipped;
- helpers and template-only entities were dropped;
- the wired alarm-panel zones were left out. They belong to the Konnected alarm panels (re-add after renaming the uptime entities to generic IDs). The Konnected exterior door zones stay out; the Security page tracks them.

The Safety group was picked by John: the smoke detector, both door locks, the three garage door covers, both gates, and the interior garage door and glass break sensors (the current Vivint entities, not the stale `*_old_2` / `*_new_old` copies). A lock or cover counts as offline only when it's unavailable; whether it's locked or open is the Security page's business. The front door lock exposes no battery entity, so it never shows as low.

| Group | Type |
|---|---|
| `group.key_sensors_motion` | Motion |
| `group.key_sensors_doors` | Doors & windows |
| `group.leak_sensors` | Leak (existing group) |
| `group.key_sensors_climate` | Temperature / air (one entity per Awair or climate sensor) |
| `group.key_sensors_presence` | Occupancy, mmWave, bed sensors |
| `group.key_sensors_safety` | Smoke, locks, garage covers, gates, garage door and glass break |
| `group.key_sensors_network` | The 5 Network rows |
| `group.key_sensors_hue_spots` | Hue outdoor spots |

**To add a sensor to a room page, add one line to the matching group in `key_sensor_groups.yaml`.** Otherwise the Sensors page won't notice when it goes offline. The groups must stay old-style `group:`, because `expand()` and auto-entities read their `entity_id` attribute.

## Entities

| Entity | State | Attributes |
|---|---|---|
| `sensor.device_health_score` | 0–100, see below | `radios`, `sensors`, `batteries` (component points), `outage`, `critical_offline` |
| `sensor.device_health_status` | `Healthy` / `Degraded` / `Down` | `icon`, `color` |
| `sensor.key_sensors_offline` | count of tracked sensors that are `unavailable`/`unknown`, minus known issues | `entities` (IDs), `known_issues` (IDs) |
| `sensor.key_sensors_low_battery` | count of tracked sensors whose device battery is low, minus known issues | `batteries` and `known_issues` (`{sensor_id: level}`, low ones only) |
| `sensor.key_sensors_network_problems` | network rows that are off, unavailable, or below their `total` | |
| `binary_sensor.zigbee_coordinator_online` | ZHA config entry is loaded | `summary` |
| `binary_sensor.zwave_controller_online` | ZWA-2 status is `ready` | `summary` |
| `sensor.zigbee_routers_online` | labelled routers whose primary entity isn't `unavailable`/`unknown` | `total` (labelled devices), `summary`, `offline` (names), `routers` (`{primary entity: "<Area> <Device>"}`) |
| `sensor.hue_spots_online` | members not unavailable | `total` (group size), `summary` |
| `sensor.ble_proxies_online` | Bermuda active proxies | `total`, `summary` |

**The low-battery threshold** has one home: `variables:` on `sensor.key_sensors_low_battery`. Both its state and its `batteries` attribute read it. The dashboard only reads `batteries`, so changing that one value changes the whole page.

**Battery lookup:** `device_id(sensor)` → that device's `sensor.*` entity with `device_class: battery`. It's guarded for entities with no device.

## Zigbee routers

Routers come from the **`zigbee_router` device label** ("Zigbee Router"), not a group. **A new router needs that label** (Settings → Devices → the device → Labels), or it won't be counted or listed. `sensor.zigbee_routers_online` scans `label_devices('zigbee_router')` once a minute (trigger-based, so plug power readings don't re-render it):

- **Primary entity:** the first enabled switch, light, fan, then sensor, skipping config and diagnostic ones (LQI, RSSI, LED, child lock, Inovelli options). A device with none falls back to its LQI sensor (range extenders), then number/select/update (the UZG router). A labelled device with no enabled entity counts as offline.
- **Name:** "<Area> <Device>", without the area when the device name already contains it or starts with its first word (Gianluca's room → "Gianluca Ceiling Light 1"). No area, or an area that no longer exists, gives the device name alone.

The Network row opens `#zigbee_routers_popup` (`dashboards/kohbo/sensors/zigbee_routers_popup.yaml`): every router, offline first, then weakest LQI, then name. LQI shows when the device has an enabled `_lqi` sensor (red under 100, amber to 180); otherwise "LQI —". LQI sensors are excluded from the recorder (RSSI is not, so ESPHome Wi-Fi RSSI keeps its history).

## Device Health score

`device_health_score.yaml`, a trigger-based template. It runs every minute, on start and template reload, and whenever a radio or rollup sensor changes. One pass of `variables` feeds both sensors, and the weights and thresholds are named at the top of that file. It reads the rollups and group membership lists only, so nothing iterates all states.

| Component | Points | How |
|---|---|---|
| Zigbee coordinator online | 15 | all or nothing |
| Z-Wave controller online | 10 | all or nothing |
| BLE proxies | 10 | × online / total |
| Zigbee routers | 10 | × online / total |
| Hue spots | 5 | × online / total |
| Sensors | 35 | × weighted share online. Weights: safety 2, leak 2, doors 2, motion 1, presence 1, climate 0.5 |
| Batteries | 15 | minus 3 per low tracked device (6 for a leak sensor), floor 0 |

**Status:**
- **Down** if the Zigbee coordinator or the Z-Wave controller is down (the score is then capped at 25), or if the score is under 50.
- **Degraded** from 50 to 84, or whenever a leak or safety sensor is offline.
- **Healthy** at 85 and above.

A total of 0 (for example, Bermuda unavailable) scores that row 0 instead of dividing by zero.

## Known issue label

To stop a sensor you know is broken from dragging the counts and the score down, label it:

1. Settings → Entities → select the entity → **Add label** → "Known issue" (create the label the first time; its ID must be `known_issue`).
2. Within a minute it leaves the Offline and Low Battery counts, the Sensors tile and the score. It moves to the **Known issues** section at the bottom of the Offline or Low Battery tab.
3. Remove the label once it's fixed.

`label_entities('known_issue')` returns `[]` while the label doesn't exist, so nothing changes until it's created. The rollups reference `now()` so a label change shows up within a minute, even when the sensor's own state doesn't change.

## Config entry IDs

- **ZHA:** `aca4c70dc280edb389f2148461676c66`. This is the same entry `system/alerts/zigbee_coordinator_offline.yaml` reads. Re-check it after a migration or restore.
- **Hue:** none is used. When the bridge drops, every spot goes unavailable, so `sensor.hue_spots_online` already covers it.

## Backlog

- Rename the Konnected uptime sensors to generic IDs (e.g. sensor.alarm_panel_1_uptime) in HA, then re-add the Alarm Panel rows.

## Reloads

New or changed groups need Developer Tools → YAML → **Groups**, and template entities need **Template entities**. `deploy.sh --reload` reloads neither.
