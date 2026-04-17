# CLAUDE.md — packages/people/

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/people/`.

---

## Overview

Each person in the household has a rich set of template sensors, input selects, and automations that track presence, sleep state, commute, and DnD status. People packages drive many house-wide automations (bedtime mode, occupancy, arrival/departure announcements).

---

## Person Sensor

Every person has a `sensor.{name}_person` template sensor that extends the base HA `person` entity with additional attributes:

```yaml
template:
  - sensor:
      - name: "John Person"
        unique_id: john_person
        state: "{{ states.person.john_koht.state }}"
        attributes:
          unlock_privilege: "{{ states.input_boolean.john_unlock_privilege.state }}"
          fingerprint_id: !secret john_fingerprint_id
          avatar: "{{ states.person.john_koht.attributes.entity_picture }}"
          room_presence: "{{ states.sensor.john_room_presence.state }}"
```

---

## Presence States

Each person has an `input_select.{name}_status` with these states (Phil Hawthorne methodology — prevents false triggers from brief departures like taking out trash):

| State | Meaning |
|---|---|
| `Home` | Confirmed home for 5+ minutes |
| `Just Arrived` | Detected home, transitional (→ Home after ~5 min) |
| `Just Left` | Detected away, transitional (→ Away after ~5 min) |
| `Away` | Confirmed away |

Automations that react to arrivals/departures should trigger on `Just Arrived` / `Just Left`, not `Home` / `Away`, to fire immediately.

---

## Sleep States

Each person has an `input_select.{name}_sleep_status`:

| State | Trigger |
|---|---|
| `Awake` | Default; set when they get out of bed |
| `Just Laid Down` | Bed FSR sensor detects occupancy |
| `Sleep` | Set after being in bed for N minutes |
| `Just Got Up` | Bed FSR sensor clears |

House-level aggregates:
- `sensor.anybody_sleeping` — true if any person is in Sleep / Just Laid Down
- `sensor.everybody_sleeping` — true if all tracked persons are sleeping
- `sensor.everybody_awake` — true if all tracked persons are awake

These drive `input_select.house` transitions to/from Bedtime mode.

---

## Per-Person Package Structure

```
packages/people/{name}/
├── presence/
│   ├── {name}_person.yaml          # sensor.{name}_person template
│   └── {name}_status.yaml          # input_select for home/away states
├── sleep/
│   ├── {name}_sleep_status.yaml    # input_select for sleep states
│   ├── {name}_just_laid_down.yaml  # automation: bed occupied → Just Laid Down
│   └── {name}_just_got_up.yaml     # automation: bed vacant → Just Got Up
├── commute/
│   ├── {name}_left_home.yaml
│   ├── {name}_arrived_home.yaml
│   ├── {name}_left_work.yaml
│   └── {name}_arrived_work.yaml
└── input_boolean/
    ├── {name}_home_boolean.yaml    # simple home flag
    └── {name}_dnd.yaml             # DnD toggle (drives office DnD mode for john)
```

---

## Presence Detection Stack

Home presence combines multiple trackers into the HA Person integration:
1. **iOS Companion App** — GPS-based (most reliable for John & Cristina)
2. **UniFi Network** — WiFi device tracking
3. **Nmap Tracker** — network scan
4. **iPhone Detect** — iOS-specific network detection

Room presence uses **ESPresense** BLE base stations (~15 stations throughout the house). `sensor.{name}_room_presence` reflects current room.

---

## Arrival / Departure Automations

```yaml
# Pattern for arrival announcement
automation:
  - id: "john_arrived_home"
    alias: "John Presence - Arrived Home"
    mode: single
    triggers:
      - trigger: state
        entity_id: input_select.john_status
        to: "Just Arrived"
    actions:
      - action: input_boolean.turn_on
        target:
          entity_id: input_boolean.john_home
      - action: script.voice_announcement
        data:
          media_players: auto
          sound: "default"
          speech_message: "John just arrived home."
          priority: "normal"
```

---

## Adding a New Person

1. Create `packages/people/{name}/` with the standard subdirectory structure
2. Add `sensor.{name}_person` template sensor in `presence/{name}_person.yaml`
3. Add `input_select.{name}_status` in `presence/{name}_status.yaml`
4. Add `input_select.{name}_sleep_status` in `sleep/{name}_sleep_status.yaml`
5. Wire bed sensor entity into the sleep automations
6. Add person to the `sensor.everybody_sleeping` / `sensor.everybody_awake` templates in `packages/house/`
