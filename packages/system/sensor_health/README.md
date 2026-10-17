# Sensor Health

Groups and template entities behind kohbo More → Sensors (`dashboards/kohbo/sensors/`). There are no automations here. JK-1094's offline and battery alerts should build on these entities, not on lists of their own.

## What's tracked

The physical sensors the room pages (`dashboards/kohbo/rooms/**`) use, one entity per device, plus every leak sensor (`group.leak_sensors`, defined in `packages/leak_monitoring.yaml`). The list was derived on 2026-10-16:

- group and min_max wrappers were expanded to their members;
- floor-level aggregates were skipped;
- helpers and template-only entities were dropped;
- the wired alarm-panel zones were left out. They belong to the Konnected alarm panels (re-add after renaming the uptime entities to generic IDs).

| Group | Type |
|---|---|
| `group.key_sensors_motion` | Motion |
| `group.key_sensors_doors` | Doors & windows |
| `group.leak_sensors` | Leak (existing group) |
| `group.key_sensors_climate` | Temperature / air (one entity per Awair or climate sensor) |
| `group.key_sensors_presence` | Occupancy, mmWave, bed sensors |
| `group.key_sensors_network` | The 5 Network rows |
| `group.key_sensors_zigbee_routers` | Mains-powered Zigbee plugs (routers) |
| `group.key_sensors_hue_spots` | Hue outdoor spots |

**To add a sensor to a room page, add one line to the matching group in `key_sensor_groups.yaml`.** Otherwise the Sensors page won't notice when it goes offline. The groups must stay old-style `group:`, because `expand()` and auto-entities read their `entity_id` attribute.

## Entities

| Entity | State | Attributes |
|---|---|---|
| `sensor.key_sensors_offline` | count of tracked sensors that are `unavailable`/`unknown` | `entities` (IDs) |
| `sensor.key_sensors_low_battery` | count of tracked sensors whose device battery is low | `batteries` (`{sensor_id: level}`, low ones only) |
| `sensor.key_sensors_network_problems` | network rows that are off, unavailable, or below their `total` | |
| `binary_sensor.zigbee_coordinator_online` | ZHA config entry is loaded | `summary` |
| `binary_sensor.zwave_controller_online` | ZWA-2 status is `ready` | `summary` |
| `sensor.zigbee_routers_online` / `sensor.hue_spots_online` | members not unavailable | `total` (group size), `summary` |
| `sensor.ble_proxies_online` | Bermuda active proxies | `total`, `summary` |

**The low-battery threshold** has one home: `variables:` on `sensor.key_sensors_low_battery`. Both its state and its `batteries` attribute read it. The dashboard only reads `batteries`, so changing that one value changes the whole page.

**Battery lookup:** `device_id(sensor)` → that device's `sensor.*` entity with `device_class: battery`. It's guarded for entities with no device.

## Config entry IDs

- **ZHA:** `aca4c70dc280edb389f2148461676c66`. This is the same entry `system/alerts/zigbee_coordinator_offline.yaml` reads. Re-check it after a migration or restore.
- **Hue:** none is used. When the bridge drops, every spot goes unavailable, so `sensor.hue_spots_online` already covers it.

## Backlog

- Rename the Konnected uptime sensors to generic IDs (e.g. sensor.alarm_panel_1_uptime) in HA, then re-add the Alarm Panel rows.

## Reloads

New or changed groups need Developer Tools → YAML → **Groups**, and template entities need **Template entities**. `deploy.sh --reload` reloads neither.
