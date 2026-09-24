---
title: Zigbee, Z-Wave & UPS Offline Alerts
slug: radio-network-offline-alerts
status: shipped
created: 2026-09-23
has_pre_mortem: false
has_review: false
has_prd: false
---

# Zigbee, Z-Wave & UPS Offline Alerts

## Problem

Nothing watches the controllers themselves. On 2026-09-21 the UZG-01 coordinator wedged (`BUFFER_FULL: 17`), and ZHA cycled "not ready yet" retries from 14:07 to about 15:04 without anyone being told. Z-Wave has its own history: the 2026-07-26 controller wedge on hermes never recovered on its own. The UPS alerts (`packages/system/ups/`) only cover switching to battery (`OB`) and back to mains (`OL`). If HA loses contact with the UPS, you're never told, and the power-outage alert stops working without any sign.

## Goal

When the Zigbee coordinator, the Z-Wave controller, or the UPS has been unavailable for 3 minutes, a time-sensitive push reaches John's phone and says what to do. Per-device status goes on dashboard #2.

## Approach

Three automations, one per device. There are no template sensors or config-entry logic. Each triggers on the controller's own entity going to `unavailable` `for: 3 min`. The `for:` rides out restarts and reloads. When an integration fails to load, as on 09-21, its entities go unavailable too, so this one trigger covers it. The push goes through `script.general_notification` with `devices: jk`, `priority: time-sensitive` and a `tag`.

- **Zigbee:** `sensor.texas_instruments_coordinator`. The message says "power-cycle the UZG (192.168.1.91), then reload ZHA".
- **Z-Wave:** the ZWA-2 controller device's status entity. The message says "check zwave-js-ui on hermes (10.0.10.80:3000)".
- **UPS:** `sensor.apc_ups_status` (NUT). The message says "HA lost contact with the UPS, so power-outage alerts won't fire. Check the NUT connection." This alert is about losing contact. Switching to battery is already covered by `ups_battery_power_activated.yaml`, which this plan doesn't touch.

## Tasks

1. **Confirm entity ids:** confirm `sensor.texas_instruments_coordinator` is the right coordinator entity, look up the ZWA-2 controller's entity on the Yellow (don't guess it), and confirm `sensor.apc_ups_status` is live.
2. **Zigbee alert:** `packages/system/alerts/zigbee_coordinator_offline.yaml`, alias "Zigbee - Coordinator Offline". Model it on `playroom_ap_unavailable.yaml`.
3. **Z-Wave alert:** `packages/system/alerts/zwave_controller_offline.yaml`, alias "Z-Wave - Controller Offline".
4. **UPS alert:** `packages/system/ups/ups_offline.yaml`, alias "UPS - Offline". Confirm `sensor.apc_ups_status` goes `unavailable` (not `unknown`) when NUT loses the UPS, and trigger on both states if needed.
5. **Validate:** run `ha core check`, then reload automations (no restart). Test by running each of the three automations from the UI to confirm the push arrives as time-sensitive.

## Risks

- **The chosen entity doesn't go unavailable when its integration fails:** task 1 checks this against the 09-21 history in the recorder.
- **No "restored" push:** you learn it's back by the dashboard or by things working again. It's easy to add a second automation later if you want one.
- **HA itself is down, or the internet is:** no push can be sent. Out of scope, and Kuma covers HA-down.

On approval → /approve → /ship radio-network-offline-alerts
