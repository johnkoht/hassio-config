---
title: Protect Detection Watchdog
slug: protect-detection-watchdog
status: in-progress
created: 2026-10-30
has_pre_mortem: true
has_review: true
has_prd: true
---

# Protect Detection Watchdog

## Problem

UniFi Protect's event-linked sensors froze silently twice: Sep 8 and Oct 28 (JK-1234). The frozen sensors were every camera's motion, person, vehicle and animal `binary_sensor`. The integration stayed "loaded", the doorbell event kept firing, and nothing logged an error. The Oct 28 freeze was found about 33 h later, by accident. While frozen, camera alerts don't fire and the garage evening auto-lock's "someone's outside" guard is blind. A reload of the integration fixes it.

## Goal

Within a few hours of a freeze, HA reloads the Protect integration on its own. If that doesn't recover it, John gets a push. Either way it is recorded, so a third occurrence is visible.

## Approach

Signal: the camera motion sensors. Recorder, Oct 29: `binary_sensor.backyard_pool_motion_2` and `binary_sensor.backyard_northwest_motion_2` change about 75 times an hour, around the clock, and every camera's motion went silent together during the freeze. "No camera motion sensor has changed in 3 hours" is therefore a strong freeze signal with little false-positive risk. Person/vehicle sensors are too sparse to use.

1. Add a trigger-based template `binary_sensor.protect_detections_stale`. It re-evaluates every 15 min, not as a live template, because live templates saturate the Yellow. It is on when the newest `last_changed` across the seven camera motion sensors is more than 3 h old:
   - `binary_sensor.front_door_camera_motion`
   - `binary_sensor.driveway_front_camera_motion`
   - `binary_sensor.garage_driveway_camera_motion`
   - `binary_sensor.backyard_south_camera_motion`
   - `binary_sensor.backyard_porch_motion_2`
   - `binary_sensor.backyard_pool_motion_2`
   - `binary_sensor.backyard_northwest_motion_2`

   It ignores HA's first 3 h after start, since `last_changed` resets on restart. It is unavailable, not on, if the sensors are missing.
2. Add the automation `protect_detection_watchdog`, triggered by stale turning on:
   1. Reload the Protect config entry (`homeassistant.reload_config_entry` targeting a Protect entity).
   2. Wait up to 20 min for any motion sensor to change.
   3. If it recovers, send a passive push to John: "Camera detections had frozen; reloaded UniFi Protect and they're back."
   4. If it doesn't, send a time-sensitive push: "Camera detections are frozen and a reload didn't fix them". It links to the security cameras page.
   5. Allow at most one auto-reload per 6 h, through a `last_triggered` guard, so a real outage doesn't loop reloads.
3. Add a "Detections" row on the Security → Cameras page showing the stale sensor and the newest motion time.
4. Tests:
   - the template's staleness maths (fresh, 2 h, 4 h, missing sensors, just-started HA);
   - the reload-once guard;
   - push priorities and the deep link;
   - the trigger-based (`time_pattern` /15) template, not a live one.
5. Docs: `packages/security/cameras/README.md`, `packages/security/LEARNINGS.md`, and the Protect memory note.

Rejected:
- Alerting on person/vehicle silence. Too sparse: a quiet night looks like a freeze.
- Pushing without auto-reload. The fix is always the same reload, so do it.
- Polling the Protect API from a command_line sensor. More moving parts for the same answer.

## Tasks

1. Stale sensor (`packages/security/cameras/protect_watchdog/protect_detections_stale.yaml`).
2. Watchdog automation with the reload-once guard and the two pushes.
3. Dashboard row on Security → Cameras.
4. Tests.
5. Docs.

## Risks

- **Pool/northwest motion gets tuned down or a camera is removed, so a false stale reading.** Mitigation: the 3 h window across all seven cameras, and the reload is harmless (cameras reconnect in seconds). The push only fires after a reload fails to restore motion.
- **A reload during an event drops one detection.** Accepted. It happens at most once per 6 h, and only when detections are already dead.
- **The freeze takes motion's `last_changed` with it, but the `restored`/unavailable path differs after a restart.** Mitigation: the just-started guard, plus a test for missing sensors.
- **Frigate isn't a fallback** until JK-1234's MQTT broker fix lands; this plan doesn't depend on it.

On approval → /approve → /ship protect-detection-watchdog
