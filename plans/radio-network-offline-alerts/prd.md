# PRD: Zigbee, Z-Wave & UPS Offline Alerts

## Goal

Three automations. Each sends John a time-sensitive push, with the next step to take, when the Zigbee coordinator, the Z-Wave controller or the UPS entity has been `unavailable` for 3 minutes.

## Context (from memory)

- Never restart HA. Validate with `ha core check`. John deploys and reloads himself.
- Header comments are a title plus 1–3 lines. Put the reasoning in the commit, not the config.
- Enabled and not unavailable doesn't prove an entity works. Pick the trigger entity from recorder history (`last_changed`).
- Use modern syntax (`triggers:`/`trigger:`/`actions:`). Push goes through `script.general_notification` only.
- No `initial_state:`.

## Tasks

### task-1: Confirm trigger entities
Confirm the Zigbee coordinator entity, the ZWA-2 controller entity and `sensor.apc_ups_status` against the live registry and recorder on the Yellow (read-only, via the homelab agent).
- AC: Each of the three entity_ids exists and is enabled in `core.entity_registry`.
- AC: Each has a documented normal state and evidence (history, or integration behavior) that it goes `unavailable` when its integration is down. Record this in working-memory.md.
- AC: No entity_id is guessed. Anything unverified is flagged to John before task 2.

### task-2: Zigbee coordinator offline alert
**File:** `packages/system/alerts/zigbee_coordinator_offline.yaml`
- AC: The id is `zigbee_coordinator_offline` and the alias is "Zigbee - Coordinator Offline". The header comment is 1–3 lines. `mode: single`.
- AC: The trigger is `trigger: state`, the confirmed coordinator entity, `to: "unavailable"`, `for: {minutes: 3}`.
- AC: The action calls `script.general_notification` with `devices: "jk"`, `priority: "time-sensitive"` and `tag: "zigbee-coordinator-offline"`. The message says to power-cycle the UZG (192.168.1.91), then reload ZHA.

### task-3: Z-Wave controller offline alert
**File:** `packages/system/alerts/zwave_controller_offline.yaml`
- AC: The id is `zwave_controller_offline` and the alias is "Z-Wave - Controller Offline". The structure matches task-2.
- AC: The trigger is the confirmed ZWA-2 controller entity, `to: "unavailable"`, `for: 3 min`.
- AC: The push is time-sensitive, tag `zwave-controller-offline`. The message says to check zwave-js-ui on hermes (10.0.10.80:3000).

### task-4: UPS offline alert
**File:** `packages/system/ups/ups_offline.yaml`
- AC: The id is `ups_offline` and the alias is "UPS - Offline". The structure matches task-2.
- AC: The trigger is `sensor.apc_ups_status` `to: "unavailable"`, `for: 3 min`. It also triggers on `unknown` if task-1 shows NUT uses that state.
- AC: The push is time-sensitive, tag `ups-offline`. The message says HA lost contact with the UPS, so power-outage alerts won't fire.
- AC: `ups_battery_power_activated.yaml` is unchanged.

### task-5: Validate
- AC: All three files parse as YAML and use modern syntax only. There's no `service:`, `platform:` or root-level `entity_id` in actions.
- AC: The ids are unique across the repo (grep). The filename basenames don't collide under `!include_dir_named`.
- AC: The config check passes. Use the docker check locally if it's available; never run `deploy.sh --check`. HA is not restarted.
