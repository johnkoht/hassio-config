---
title: Offline Safety Device Alerts
slug: offline-safety-device-alerts
status: draft
created: 2026-10-29
has_pre_mortem: false
has_review: false
has_prd: false
---

# Offline Safety Device Alerts

Linear: JK-1231 (push alert when a leak sensor or other safety device goes unavailable or low on battery), with JK-1094 (visual dashboard alerts and room-specific alerts) merged in. Trigger for the work: on 10-28 the panic button and three leak sensors were found offline for months, unnoticed (JK-1230).

## Problem

A safety device that has gone quiet is worse than no device, because the house looks protected. Today the only offline signal for leak sensors is `sensor.leak_sensors_unavailable` (`packages/leak_monitoring.yaml`), which feeds a dashboard badge and a conditional "Leak Sensors Offline" card and never pushes. Nothing watches the panic button, and nothing reports a low battery on any of them.

## Goal

A push to the family when a leak sensor, the smoke detector or the panic button has been offline for a debounced period, or its battery is low; repeated each morning until it is fixed. Dashboard visibility (JK-1094) builds on the same data and adds room-level cues. This is a protection feature: bias toward telling John, with the noise controlled by debounce and one combined message.

## What exists today

**Most of the data layer is already built** (sensors-dashboard plan, status shipped, JK-1224). `packages/system/sensor_health/README.md` says JK-1094's alerts "should build on these entities, not on lists of their own".

- `group.leak_sensors` (13 leak sensors, `leak_monitoring.yaml`) and `group.key_sensors_safety` (`binary_sensor.smoke_detector`, `lock.front_door`, `lock.garage_entry_door`, `cover.garage_door_1` to `_3`; the README also mentions both gates, the interior garage door and the glass break sensor, so the group is larger than the entities listed in the first lines of the file; check at build).
- `sensor.key_sensors_offline`: count of tracked sensors that are `unavailable` or `unknown`, attribute `entities` (ids) and `known_issues` (ids labelled `known_issue`, excluded from the count). Trigger-based, refreshed every 5 minutes, in `key_sensor_counts.yaml`.
- `sensor.key_sensors_low_battery`: count of tracked sensors whose device battery is under 20 (single constant in that file), attribute `batteries` as `{entity: level}`, and `known_issues`.
- `sensor.device_health_score` already reports Degraded when a leak or safety sensor is offline, but it is a number on a page, not a push.
- Dashboard (JK-1224, shipped): Sensors page with Overview, Offline and Low Battery tabs (`dashboards/kohbo/sensors/`); security header badge and the conditional "Leak Sensors Offline" card.
- Push helper: `script.general_notification` (devices `jk` or `all`, priority, `tag`, `actions`, honours notification level). Closest pattern for a "stays offline" alert: `packages/system/alerts/zigbee_coordinator_offline.yaml` (template trigger with `for:`, time-sensitive priority, fixed tag).
- Existing repeating alert pattern: the `alert:` integration for water leaks in `leak_monitoring.yaml` (repeat intervals, `can_acknowledge`).

**The panic button is not covered.** `packages/security/alarm/panic_button.yaml` triggers on a ZHA *device* trigger (a `device_id`), and no panic-button entity id appears anywhere in the repo, so it is not in `key_sensors_safety` and cannot be named here. Unknown: its entity ids and whether it exposes a battery entity; check live (the `homelab` agent, or Settings, Devices) and add one line to the safety group. This is the key gap and probably part of why it went unnoticed.

**Known-issue label is a blind spot for this feature.** A sensor labelled `known_issue` leaves the offline and battery counts. That is right for a dashboard score and wrong for a safety alert: a labelled leak sensor can stay broken forever. The alert must still see them (open decision 4).

## Approach

**One combined attention sensor, then one automation.** Do not alert from `sensor.key_sensors_offline` directly: it lumps in motion, climate and doors and carries no time information, and the debounce needs the time a device went offline.

1. **`sensor.safety_devices_attention`** (new, trigger-based template, every 5 minutes, at start and on `event_template_reloaded`; never a live template, per the 10-17 Yellow saturation lesson). Scope: `group.leak_sensors` plus `group.key_sensors_safety` (plus the panic button once added). State: count of devices needing attention. Attributes:
   - `offline`: members `unavailable` or `unknown` whose `last_changed` is older than the debounce (recommend 1 hour). Includes `known_issue` members, tagged separately.
   - `low_battery`: members whose device battery is under the safety threshold, using the same device-to-battery lookup as the rollup (`device_id(e)`, then the device's `sensor.*` with `device_class: battery`), reading `sensor.key_sensors_low_battery.attributes.batteries` where possible to avoid a second lookup.
   - `names`: friendly names for the message.
   Debounce is therefore per device: a new device crossing the hour changes an attribute and so re-fires the automation, instead of waiting for the next daily repeat.
2. **`safety_device_offline_alert`** (automation, `packages/system/alerts/`, unique basename). Triggers: state change of `sensor.safety_devices_attention` (any attribute), plus a time trigger each morning for the repeat. Conditions: count above 0. One push through `script.general_notification`: title "Safety device offline" or "Safety device battery low", message built from the `names` attribute, never from `trigger.entity_id` (the time trigger has none; same lesson as the door re-alert bug), `tag: safety-device-offline` so each repeat replaces the previous push, priority time-sensitive. Recipients: `all` (open decision 2).
3. **Dashboard (JK-1094).** The Offline and Low Battery tabs already list everything; remaining work is smaller:
   - A top-of-home "Safety device offline" card driven by the same sensor, a template binary sensor plus `condition: state` (Lovelace `conditional` cards reject `condition: template`).
   - Room-specific alerts: a chip or banner on a room page when a safety sensor in that room is in the attention list. Needs a room-to-sensor mapping that does not exist in the groups today (room is the device area), so this is the least-defined piece. Auto-entities with a filter on the new sensor's `offline` ids is the likely route; the README warns groups must stay old-style for `expand()` and auto-entities.
   - Retire nothing: `sensor.leak_sensors_unavailable` keeps feeding the existing badge and card.

## Recommendations

- **Debounce: 1 hour offline.** Zigbee and Z-Wave devices drop for minutes during router reboots and HA restarts, and a restart itself briefly sets everything `unavailable`. One hour clears those without leaving a leak sensor unwatched for long; a leak actually reports as `on`, not `unavailable`, so the offline watch is about silent death, not the event itself. Skip alerting for 10 minutes after HA start.
- **Daily re-notify until fixed**, at a morning time (suggest 09:00), same tag so it replaces. Not hourly: the problem is a months-long silent failure, and a daily nag is hard to ignore without being abusive. Acknowledge/snooze is not needed in v1.
- **Battery threshold for safety devices: 30%**, higher than the dashboard's 20%, so a replacement is bought before the device dies. Alert once when it crosses, then include it in the daily repeat. If the 30 vs 20 split is unwanted, use the existing constant.
- **In scope:** all `group.leak_sensors`, `binary_sensor.smoke_detector`, the panic button (once its entity is found), and the glass-break and interior garage door sensors in the safety group. **Locks and garage covers: offline only.** They have no battery to report (the front door lock exposes none) and a push about them is useful but lower priority; recommend including offline, excluding low battery for them.
- **Out of scope for v1:** motion, climate, doors and window sensors (covered by the dashboard tabs and the health score, not push), network devices, cameras.

## Tasks

1. Find the panic button's entity ids and battery entity live; add them to `group.key_sensors_safety` (and its README row). Check the full contents of the safety group.
2. `sensor.safety_devices_attention` template.
3. `safety_device_offline_alert` automation.
4. Dashboard card and room-level alert (after the open questions are answered).
5. Tests: the attention template across offline under and over the debounce, `known_issue` labelled, low battery under and over, HA-start grace; the message renders for both the state trigger and the bare time trigger; structural test that every leak sensor is in scope.
6. Docs: a "Safety alerts" section in `packages/system/sensor_health/README.md`; `dashboards/kohbo/sensors/README.md` and SITEMAP if cards are added; header comments per `packages/CLAUDE.md`.
7. Handoff for John: reload groups and template entities (not covered by `deploy.sh --reload`) and automations; physically fix the devices already known offline, otherwise the first deploy alerts about them immediately (that is the point, but warn him).

## Open decisions

1. **Combined sensor + automation, or the `alert:` integration** (the existing leak-alert pattern, with `repeat:`). `alert:` gives repeat and acknowledge for free but fires once per entity and does not notice a second device joining the list until the next repeat. Recommend the sensor + automation above.
2. **Who gets the push.** Recommend `all` (it is a family-safety item, like the leak alerts). Alternative: `jk` only, since John fixes devices.
3. **Debounce and repeat values.** 1 hour offline, daily at 09:00, 30% battery. John to confirm or change.
4. **Known-issue devices.** Recommend a safety device labelled `known_issue` still pushes, weekly instead of daily, so a label can never fully silence a leak sensor again. Alternative: honour the label completely (what the dashboard does).
5. **Panic button identity.** Which entity, and does it report a battery? Unknown until checked live. A button with no battery entity can only be watched for offline.
6. **Scope beyond leak, smoke and panic:** include garage covers and locks (offline only), glass break and interior garage door sensor?
7. **Quiet hours.** A push at any hour is fine for time-sensitive, but the daily repeat at 09:00 avoids night noise. Is a night-time first alert (e.g. a sensor drops at 03:00 and the hour passes at 04:00) acceptable, or should first alerts wait until morning?
8. **Room-specific dashboard alerts (JK-1094).** Worth doing now, or ship the push first and revisit once the alert has run for a while?

## Risks

- **Alert fatigue on day one.** Devices already offline (the three leak sensors and panic button from JK-1230, if not yet fixed) fire immediately. Mitigation: fix them first, or label them `known_issue` with the weekly rule.
- **Restart storm.** After an HA or radio restart everything is `unavailable`. Mitigation: 1 hour debounce plus start grace; tested.
- **Panic button invisible.** Until its entity is added to the group, it stays unwatched; this is the first task for that reason.
- **Template cost.** The attention sensor walks about 30 entities every 5 minutes; trigger-based on purpose.
- **Silent failure of the alert itself.** A broken template would hide the problem again. Mitigation: the automation also fires when the attention sensor itself is `unavailable` for the debounce window (a push that the watcher is down), and the existing `device_health_score` stays as a second look.
- **Privacy.** Entity ids and device names only; no addresses, room occupants or schedules.

On approval → /approve → /ship offline-safety-device-alerts
