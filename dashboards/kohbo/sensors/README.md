# Sensors Dashboard

Which of the tracked sensors are offline or low on battery, the Device Health score, and the radio networks. The data (groups, rollups, score, labels) lives in [`packages/system/sensor_health/`](../../../packages/system/sensor_health/README.md); this page only reads it.

## Overview

A tabbed group of three views (the Plants and Holidays pattern):

- **Overview** - Device Health card (status, score ring, Networks / Sensors / Batteries tiles), 5 Network rows, 4 Power rows (UPS status, charge, runtime, load), then online sensors by type, Safety & Security first
- **Offline** - Tracked sensors that are unavailable or unknown, oldest outage first; "Known issue" ones in their own section
- **Low Battery** - Tracked sensors below the battery threshold, lowest first; "Known issue" ones in their own section
- **Zigbee Routers popup** - Opened from the routers row: every `zigbee_router`-labelled device, offline first, then weakest LQI

Entry point: bottom navbar → More → Sensors (`/dashboard-kohbo/sensors`). There's no settings popup: no automations act on these entities.

## File Structure

```
sensors/
├── README.md                   # This file
├── sensors.yaml                # Overview tab (path: sensors)
├── offline.yaml                # Offline tab (path: sensors-offline)
├── low_battery.yaml            # Low Battery tab (path: sensors-low-battery)
└── zigbee_routers_popup.yaml   # #zigbee_routers_popup
```

Shared: `templates/includes/sensors/sensors_header.yaml` (title + tabs) and `templates/includes/sensors/device_health_overview.yaml` (the Device Health card).

## Notes

- **A sensor added to a room page must also go in its `key_sensor_groups.yaml` group**, or this page never sees it go offline.
- **"Offline since" reads `last_changed`.** The frontend never receives `last_reported`. See [dashboards LEARNINGS](../../LEARNINGS.md).
- The lists are auto-entities `filter.template` rows; see LEARNINGS for why they emit full row objects and avoid JSON `true`/`false`.

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md)
