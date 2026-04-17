# CLAUDE.md — packages/security/

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/security/`.

---

## Overview

The security package covers the alarm panel (Alarmo), Unifi camera detection/notifications, door/window sensors, locks, and fire alarms. Security automations are more conservative than room automations — prefer explicit conditions over implicit ones, and always use `!secret` for codes and credentials.

---

## Directory Structure

```
packages/security/
├── alarm/                            # Alarmo alarm panel automations
│   ├── alarm_arm_at_bedtime.yaml
│   ├── alarm_arm_when_house_empty.yaml
│   ├── alarm_arm_if_john_away.yaml
│   ├── alarm_arm_away_when_vacation_mode.yaml
│   ├── alarm_disarm_when_house_becomes_occupied.yaml
│   ├── alarm_disarm_when_somebody_arrives_and_house_occupied.yaml
│   ├── alarm_disarm_in_morning.yaml
│   ├── alarm_arm_home_script.yaml
│   ├── alerm_triggered.yaml          # alarm triggered response
│   └── panic_button.yaml
├── cameras/
│   ├── camera_notifications/         # global on/off for camera notifications
│   ├── detections/                   # per-camera detection automations
│   │   ├── front_door_camera/
│   │   ├── driveway_front_camera/
│   │   ├── garage_driveway_camera/
│   │   ├── backyard_south_camera/
│   │   ├── backyard_porch_camera/
│   │   ├── backyard_northwest_camera/
│   │   └── backyard_pool_camera/
│   └── detection_notifications/      # how detections become notifications
├── sensors/
│   ├── exterior_door_group.yaml
│   ├── window_group.yaml
│   └── house_locks.yaml
├── lighting/                         # Security lighting (garage flood, etc.)
├── fire_alarm/                       # Smoke/fire detection and response
├── doors_left_open.yaml
├── windows_left_open.yaml
├── security_unlock_front_door_by_fingerprint.yaml
├── security_status.yaml              # sensor.security_status
└── security_score.yaml               # sensor.security_score
```

---

## Alarm Panel (Alarmo)

The alarm uses the `alarmo` custom integration. Always use `!secret` for the code.

```yaml
# Arm away (house empty)
- action: alarmo.arm
  data:
    mode: away
    code: !secret alarmo_code

# Arm home (bedtime)
- action: script.alarm_arm_home

# Disarm
- action: alarmo.disarm
  target:
    entity_id: alarm_control_panel.alarmo
  data:
    code: !secret alarmo_code
```

### Arm/disarm triggers

| Scenario | Arm/Disarm | Automation |
|---|---|---|
| House becomes unoccupied | Arm away | `alarm_arm_when_house_empty.yaml` |
| Bedtime mode activates | Arm home | `alarm_arm_at_bedtime.yaml` |
| John leaves (others still home) | Arm home | `alarm_arm_if_john_away.yaml` |
| Vacation mode | Arm away | `alarm_arm_away_when_vacation_mode.yaml` |
| Someone arrives (was empty) | Disarm | `alarm_disarm_when_house_becomes_occupied.yaml` |
| Morning / everyone wakes up | Disarm | `alarm_disarm_in_morning.yaml` |

### Alarm triggered response

When the alarm triggers (`alerm_triggered.yaml`), the standard response is:
1. Flash lights throughout the house
2. Play critical TTS announcement
3. Send push notification

---

## Camera Detection System

Each camera has its own detection directory with three types of files:

```
detections/{camera_name}/
├── {camera}_proxy.yaml               # template sensor bridging Unifi → HA event
├── {camera}_detections_person.yaml   # automation: person detected
├── {camera}_detections_vehicle.yaml  # automation: vehicle detected
├── {camera}_detections_animal.yaml   # automation: animal detected
└── {camera}_notifications.yaml       # input_boolean: notifications on/off for this camera
```

### Detection → Notification flow

1. Unifi Protect fires an event
2. The `_proxy.yaml` template sensor translates it to an HA state
3. The `_detections_*.yaml` automation fires, calls `script.camera_detection_alert`
4. `camera_detection_alert.yaml` decides notification type based on conditions:
   - Time of day
   - `input_boolean.house_occupied`
   - Whether the detection type warrants critical vs normal notification
   - `somebody_is_outside_bayesian` sensor state

### Camera notification conditions

Detection automations check multiple conditions before notifying:
- Per-camera `input_boolean.{camera}_notifications` — must be on
- Global `input_boolean.camera_notifications` — must be on
- Time-of-day and occupancy context shape notification urgency

---

## Locks

Locks belong to the room they're in (e.g. front door lock → `packages/foyer/`, mudroom lock → `packages/mudroom/`), not centralized in security. The security package only has `sensors/house_locks.yaml` which creates a group sensor for overall lock status.

Lock unlock by fingerprint is in `security_unlock_front_door_by_fingerprint.yaml` because it's a security concern, not a room concern.

---

## Security Status Score

`sensor.security_score` aggregates the state of all security-relevant entities (locks, doors, windows, alarm) into a single score used on the dashboard security view.

---

## Fire Alarm

`fire_alarm/fire_alarm_triggered.yaml` responds to smoke/CO detector events:
1. Call `script.critical_announcement` — broadcasts to all rooms immediately
2. Flash all lights
3. Send critical push notification

Always use `script.critical_announcement` (not `voice_announcement`) for fire/smoke — it bypasses the queue and quiet mode.
