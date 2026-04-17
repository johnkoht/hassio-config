# CLAUDE.md — packages/

This file provides guidance to Claude Code (claude.ai/code) when working in the `packages/` directory.

---

## What Packages Are

Every YAML file inside `packages/` is loaded by Home Assistant via `!include_dir_named packages/` in `configuration.yaml`. Each subdirectory is a self-contained "package" — it can define automations, scripts, sensors, input helpers, and binary sensors all in one place.

---

## Directory Organization

```
packages/
├── {room}/                  # One directory per room
│   ├── {room}_state.yaml    # input_select defining room modes
│   ├── {room}_occupancy.yaml # input_boolean for occupancy
│   ├── lights/              # Lighting automations
│   ├── modes/               # State/mode transition automations
│   ├── occupancy/           # Occupancy on/off automations
│   ├── climate/             # HVAC automations
│   └── media/               # Speaker/media automations
├── people/
│   └── {name}/              # One directory per person
│       ├── presence/
│       ├── sleep/
│       └── commute/
├── house/                   # House-wide modes and occupancy
├── security/                # Alarm, cameras, locks
├── announcements/           # TTS queue engine
├── climate/                 # Central HVAC
├── weather/                 # Weather detection and alerts
└── reminders/ school/ vacuums/ energy/ ...
```

---

## Room Architecture

Every room is a state machine with two core entities:

### 1. Mode selector — `input_select.{room}`

Controls what automations are allowed to run. Common options:

| Mode | Behavior |
|---|---|
| `Auto` | Fully automated — motion, lighting, media respond normally |
| `Off` | No automations; manual control only |
| `Away` | Lights off, media off, climate adjusted |
| `DnD` | Do Not Disturb — TTS blocked, visual indicator on |
| `Bedtime` | Dimmed lighting, no TTS, quiet |

### 2. Occupancy boolean — `input_boolean.{room}_occupied`

The primary driver for room automations. Set `on` when any occupancy signal is detected; set `off` after all signals clear (with a delay).

**What sets it on:** motion sensor, BLE presence (ESPresense), Bayesian presence sensor, door closed, bed sensor, lights turned on manually, media playing.

**What sets it off:** all signals cleared for 1–5 minutes (use `for:` on the trigger).

### Room package file structure

```
packages/office/
├── office_state.yaml              # input_select: Auto, Off, DnD
├── office_occupancy.yaml          # input_boolean.office_occupied
├── modes/
│   ├── office_occupied.yaml       # sets occupied on
│   ├── office_not_occupied.yaml   # sets occupied off
│   ├── office_mode_auto.yaml      # transitions to Auto
│   ├── office_mode_dnd.yaml       # transitions to DnD
│   └── office_mode_off.yaml       # transitions to Off
├── lights/
│   ├── office_lights_on.yaml      # on when occupied + dark
│   └── office_lights_off.yaml     # off when unoccupied
└── media/
    └── office_music_on.yaml
```

---

## House-Wide Booleans

Always check these in conditions before taking action. Order: house-level → room-level → feature-level.

| Entity | When to check |
|---|---|
| `input_boolean.house_occupied` | Any automation that should stop when nobody is home |
| `input_boolean.lighting_automations` | All lighting automations |
| `input_boolean.speech_notifications` | Any TTS/announcement action |
| `input_boolean.quiet_mode` | Automations that would make noise |
| `input_boolean.guest_mode` | Automations that would be disruptive to guests |
| `input_boolean.bad_weather` | Outdoor/foyer lighting, weather-reactive automations |

House mode: `input_select.house` — options: Auto / Away / Vacation / Bedtime / Quiet / Entertainment

---

## Standard Automation Patterns

### Occupancy ON automation
```yaml
# Office Occupied
#
# Mark the office as occupied when any presence signal fires.
#

automation:
  - id: "office_occupied"
    alias: "Office occupied"
    mode: single
    triggers:
      - trigger: state
        entity_id: binary_sensor.office_presence
        to: "on"
      - trigger: state
        entity_id: binary_sensor.office_aqara_motion_sensor
        to: "on"
      - trigger: state
        entity_id: light.office_lights
        to: "on"
    conditions:
      - condition: state
        entity_id: input_boolean.house_occupied
        state: "on"
      - condition: state
        entity_id: input_boolean.office_occupied
        state: "off"
    actions:
      - action: input_boolean.turn_on
        target:
          entity_id: input_boolean.office_occupied
```

### Occupancy OFF automation
```yaml
# Office Not Occupied
#
# Clear occupancy when motion and BLE presence have both been
# absent for at least 3 minutes.
#

automation:
  - id: "office_not_occupied"
    alias: "Office not occupied"
    mode: single
    triggers:
      - trigger: state
        entity_id: binary_sensor.office_aqara_motion_sensor
        to: "off"
        for:
          minutes: 3
    conditions:
      - condition: state
        entity_id: input_boolean.office_occupied
        state: "on"
      - condition: state
        entity_id: binary_sensor.office_presence
        state: "off"
    actions:
      - action: input_boolean.turn_off
        target:
          entity_id: input_boolean.office_occupied
```

### Lighting ON automation
```yaml
# Office Lights On
#
# Turn on lights when occupied and illuminance is below threshold.
#

automation:
  - id: "office_lights_on"
    alias: "Office lights On"
    mode: single
    triggers:
      - trigger: state
        entity_id: input_boolean.office_occupied
        to: "on"
      - trigger: sun
        event: sunset
        offset: "00:15:00"
    conditions:
      - condition: state
        entity_id: input_boolean.lighting_automations
        state: "on"
      - condition: state
        entity_id: input_boolean.office_lighting_automations
        state: "on"
      - condition: state
        entity_id: input_boolean.office_occupied
        state: "on"
      - condition: or
        conditions:
          - condition: state
            entity_id: input_select.office
            state: "Auto"
          - condition: state
            entity_id: input_select.office
            state: "DnD"
      - condition: numeric_state
        entity_id: sensor.office_aqara_illuminance
        below: 150
      - condition: state
        entity_id: light.office_lights
        state: "off"
    actions:
      - action: light.turn_on
        target:
          entity_id: light.office_lights
```

### Mode transition automation
```yaml
automation:
  - id: "office_mode_auto"
    alias: "Office Mode Auto"
    mode: single
    triggers:
      - trigger: state
        entity_id: input_boolean.office_occupied
        to: "on"
    conditions:
      - condition: state
        entity_id: input_boolean.house_occupied
        state: "on"
      - condition: template
        value_template: "{{ not is_state('input_select.office', 'Auto') }}"
    actions:
      - action: input_select.select_option
        target:
          entity_id: input_select.office
        data:
          option: "Auto"
```

---

## Voice Announcements

Call `script.voice_announcement` for normal TTS, `script.critical_announcement` for emergencies. See `packages/announcements/CLAUDE.md` for full details.

```yaml
actions:
  - action: script.voice_announcement
    data:
      media_players: auto          # auto = occupied rooms only
      sound: "one-chime"
      speech_message: "The washer is done."
      priority: "low"
```
