---
title: Zigbee router alert follows the label
slug: jk-1263
status: approved
created: 2026-11-17
has_pre_mortem: false
has_review: false
has_prd: false
---

# Zigbee router alert follows the label (JK-1263)

## Problem

`zigbee_router_unavailable.yaml` watches 62 hard-coded entities. A newly labelled `zigbee_router` device is counted by `sensor.zigbee_routers_online` but never alerts.

## Design

One automation, `time_pattern` every minute, no entity list.

- Candidates come from the sensor's `routers` attribute (`{entity: name}`), read live, so a new label is covered once the sensor's next refresh (up to 5 min) lists it.
- A router alerts on the run where its state has been `unavailable` for 15 to 16 minutes, from the live `last_changed`. That is the per-device 15-minute delay, and the one-minute window means one push per outage, with no stored state.
- Condition: ZHA config entry is `loaded`. A radio outage fails it, so nothing pushes (`zigbee_coordinator_offline` covers that).
- Actions: `repeat: for_each` over the candidates; one `script.general_notification` each, tag `zigbee-router-<entity>`, name from `routers`.
- Kept: `mode: queued`, `max_exceeded: silent`.

Why not the alternatives: a template trigger fires only false to true, so a second router dropping while the first is still down never fires. A trigger on the sensor attribute changes only when the offline set changes, and the 15 minutes would still need last_changed. A polling trigger is re-evaluated by construction after the sensor refreshes and after any reload, with no state to lose.

Restart: HA resets `last_changed` at boot, which would re-push every dead router 15 minutes after each restart. The automation's own `this.last_changed` is its load time (HA start or reload), and a router only counts if it went unavailable after that. An outage that began before a restart or reload therefore never pushes (same as the old state trigger).

Run volume: `due` is an automation-level variable and a condition requires it non-empty, so the automation only triggers when it pushes.

Known limits: a run missed inside a router's one-minute window (HA stopped or reloading, or ZHA reloading) loses that push; a radio that is broken while ZHA still reads loaded can still push per router (same as before).

## Tests

Render the candidate template with stubbed `states`/`now`: window edges, a router not in the label map, available/unknown not alerting, unavailable shorter than 15 min, per-entity tag/name, coordinator gate, mode queued, no hard-coded entity list. Sabotage: widen/remove the window or gate, confirm red.

## Docs

sensor_health README: replace the hand-kept list paragraph.
