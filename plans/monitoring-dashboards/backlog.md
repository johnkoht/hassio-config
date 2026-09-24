# Monitoring Dashboards — seed notes (not a plan yet)

These are raw findings from the 2026-09-23 session, gathered from `.storage` and the recorder on the Yellow and not live-polled. Run `/plan` for each dashboard in a fresh session. The goal is three dashboards: network, Zigbee/Z-Wave health, and battery. Per-device status belongs here, not in push alerts.

## Network
- **Speedtest:** `sensor.speedtest_download`, `_upload`, `_ping`
- **UDM:**
  - `sensor.kohbo_udm_state`, `_clients`, `_uptime_2`, `_cpu_utilization_2`, `_memory_utilization_2`
  - Dual-WAN latency: `sensor.kohbo_udm_{cloudflare,google,microsoft}_wan_latency` and `_wan2_latency`
  - There's no WAN up/down binary_sensor.
- **Per AP/switch:** `sensor.<device>_{clients,state,uptime,cpu_utilization,memory_utilization}`
- **Duplicate UniFi config entry:** "Default" and "default (192.168.1.1)". Worth a look.
- **Cameras:** UniFi Protect `camera.g4_doorbell_*`. NVR HDD health is `binary_sensor.network_video_recorder_hdd_3/4` and `binary_sensor.video_recorder_hdd_1/2`. Frigate is at 10.0.10.207.
- **Bug:** `binary_sensor.cameras_available` always reports 0 offline. It filters entity-id strings, not states (`packages/security/cameras/cameras_available.yaml`).
- **Yellow host health:** `sensor.system_monitor_{memory_free,processor_use,load_*,disk_free_config,processor_temperature,swap_use}`. Relevant after the 08-31 out-of-memory stall.

## Zigbee / Z-Wave
- **Controller signals** already exist from the offline alerts: the ZHA config entry state (`aca4c70dc280edb389f2148461676c66`) and `sensor.home_assistant_connect_zwa_2_status`. ZHA has no coordinator entity.
- **Coordinator counters:** `sensor.silicon_labs_ezsp_*` (tx_unicast_failed, broadcast_table_full, ash_overrun_error, …). These are an early warning for BUFFER_FULL.
- **Z-Wave nodes:** `sensor.<name>_node_status` (alive/asleep/dead) and `_last_seen`. Nodes 31, 34, 39 and 43 are ghosts to prune in zwave-js-ui.
- **Dark devices:** about 20 Zigbee devices were dark as of 09-23, including the panic button, 4 leak sensors (sump, furnace pan, storage room, upstairs laundry), about 9 door sensors and several motion sensors.
- **Flapping:** Philips SML002 `00:17:88:01:06:44:ae:01` re-initialises repeatedly.
- **`zigbee_router_unavailable.yaml`:** a hard-coded 24-plug alert in legacy syntax. Decide whether to retire it.

## Battery
- **146 battery entities:** zha 61, mobile_app 18, vivint 13, ecowitt 12, homekit 11, zwave_js 9, hue 7, nut 5, smartthings 4, and a few others. Exclude phones, laptops and the UPS.
- **Lows as of 09-23:**
  - `sensor.upstairs_hallway_bathroom_leak_sensor_battery` at **0%**
  - `sensor.kitchen_sink_leak_sensor_battery` at 22.5%
  - `sensor.gianlucas_door_sensor_battery` at 29%
- **Idea:** a weekly "batteries to replace" push alongside the dashboard.

## Also open
- `packages/security/security_score.yaml:90-96` exact-matches `== 'OB'` on `sensor.apc_ups_status_data`, so compound codes like `OB DISCHRG` are missed.
- The REST token in secrets.yaml returns 401. Regenerate it so live `/api/states` checks are possible.
