# 2026-09-23 · radio-network-offline-alerts

Three time-sensitive "offline for 3 min" pushes: the Zigbee coordinator, the Z-Wave ZWA-2 controller and the UPS (NUT).

- **The coordinator entity `sensor.texas_instruments_coordinator` is disabled by default** (`disabled_by: integration`). It has to be enabled in the UI, or the trigger never fires. The coordinator *device* also carries ZHA group entities (e.g. `light.office_lights`). Those are room light groups, not the controller, so never use them as a controller-health signal. John rejected that substitution outright.
- **The ZWA-2 controller entity is `sensor.home_assistant_connect_zwa_2_status`**, with states `ready` / `unresponsive` / `jammed`. It logged a 1s `jammed` on 09-19 and a 6s `unresponsive` on 09-20. `for: 3 min` filters these blips.
- **NUT `sensor.apc_ups_status` reports human-readable values ("Online"), not raw codes.** The raw `OL`/`OB` codes are in `sensor.apc_ups_status_data`. So `ups_battery_power_activated.yaml`, which triggers `to: "OB"`/`"OL"` on `apc_ups_status`, probably never fires. It's unfixed here and flagged to John. The NUT server is 10.0.10.60:3493.
- **Process:** a homelab agent spawned before `EnterWorktree` lost all Bash access mid-run because of the cwd/worktree mismatch. Spawn agents after entering the worktree, or run the SSH queries directly.
