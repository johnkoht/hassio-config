# 2026-09-23 · radio-network-offline-alerts

Three time-sensitive "offline for 3 min" pushes: the Zigbee coordinator, the Z-Wave ZWA-2 controller and the UPS (NUT).

- **ZHA exposes no coordinator-health entity.** `sensor.texas_instruments_coordinator` exists in the registry, but it's a stale record with no live entity. The coordinator *device* carries ZHA group entities (e.g. `light.office_lights`). Those are room light groups, not the controller, and John rejected them outright. The signal is the config entry state, read with a template trigger: `config_entry_attr('aca4c70dc280edb389f2148461676c66', 'state').value != 'loaded'`, with `now()` to force a minutely re-render because a config entry isn't an entity. Check that a registry entity is live before building on it.
- **The ZWA-2 controller entity is `sensor.home_assistant_connect_zwa_2_status`**, with states `ready` / `unresponsive` / `jammed`. It logged a 1s `jammed` on 09-19 and a 6s `unresponsive` on 09-20. `for: 3 min` filters these blips.
- **NUT `sensor.apc_ups_status` reports human-readable values ("Online"), not raw codes.** The raw `OL`/`OB` codes are in `sensor.apc_ups_status_data`. `ups_battery_power_activated.yaml` triggered `to: "OB"`/`"OL"` on `apc_ups_status`, so the power-outage push had likely never fired. It was fixed the same day by hotfix `29f912b`:
- It now uses template triggers on `'OB'`/`'OL' in states('sensor.apc_ups_status_data').split()`, since codes are compound, e.g. `OB DISCHRG`.
- "Restored" is split into `ups_battery_power_restored.yaml` and gated on the activated automation's `last_triggered` being newer than its own.
- The review caught that gating on `trigger.from_state` swallows the restored push in an `OB → unavailable → OL` outage, where the battery dies or the NUT server loses power.

`packages/security/security_score.yaml` still compares `== 'OB'` exactly, which is unfixed. The NUT server is 10.0.10.60:3493.
- **Transition triggers miss "already down at boot."** State and template triggers need a change. Each offline alert also has a `homeassistant: start` trigger that waits 6 min and then re-checks. The ZHA entry-state template treats a missing entry (`None`) as offline, so a re-created entry doesn't kill the alert silently.
- **Process:** a homelab agent spawned before `EnterWorktree` lost all Bash access mid-run because of the cwd/worktree mismatch. Spawn agents after entering the worktree, or run the SSH queries directly.
