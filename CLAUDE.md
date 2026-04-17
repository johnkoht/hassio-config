# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repo Is

A Home Assistant configuration for a fully automated smart home running on Home Assistant Yellow with Nabu Casa. The philosophy is **hundreds of small, focused automations** rather than monolithic ones — each room is an independent state machine. See `docs/` for in-depth documentation on rooms, people, presence, announcements, and devices.

---

## Validating & Applying Changes

No build system. Changes are applied by reloading or restarting Home Assistant.

```bash
ha core check              # validate YAML syntax
ha core reload-automations # reload automations without restart
ha core reload-scripts     # reload scripts
ha core restart            # full restart (use sparingly)
```

ESPHome devices are compiled/flashed separately:
```bash
esphome run esphome/<device>.yaml
```

---

## Codebase Structure

```
/homeassistant/
├── configuration.yaml        # Main entry point — loads everything via includes
├── automations.yaml          # Legacy UI-created automations
├── scripts.yaml              # Scripts (also scripts/ dir for organized ones)
├── scenes.yaml / notify.yaml
├── packages/                 # Primary automation hub — ~45 packages, loaded via !include_dir_named
│   ├── office/               # Room packages (self-contained per room)
│   ├── kitchen/
│   ├── main_bedroom/ ...     # ~15 more room packages
│   ├── house/                # House-wide modes (bedtime, entertainment, occupancy)
│   ├── people/               # Per-person presence, sleep, commute automations
│   │   ├── john/
│   │   ├── cristina/ ...
│   ├── security/             # Alarm, cameras, locks, fire
│   ├── announcements/        # TTS queue engine
│   ├── climate/              # HVAC automation
│   ├── weather/              # Bad weather detection, severe alerts
│   └── reminders/ school/ vacuums/ vehicles/ energy/ ...
├── automation/               # Additional automations loaded via !include_dir_list
├── dashboards/               # Kohbo custom Lovelace dashboard
│   ├── kohbo/                # Dashboard views (home, rooms, climate, security, energy)
│   └── templates/            # button_cards/, decluttering/, includes/
├── esphome/                  # ESPHome device configs (bed sensors, BLE proxies)
├── input_select/             # Room/house mode selectors
├── input_boolean/            # House-wide boolean flags
├── binary_sensors/           # Custom binary sensor definitions
├── sensors/                  # Template sensors
├── custom_components/        # HACS integrations (adaptive_lighting, alarmo, bermuda, frigate, etc.)
├── themes/                   # kohbo theme
└── docs/                     # Architecture documentation
```

**Configuration loading pattern:**
```yaml
packages: !include_dir_named packages/
automation: !include automations.yaml
automation mine: !include_dir_list automation/
script: !include scripts.yaml
script mine: !include_dir_named scripts/
binary_sensor: !include_dir_merge_list binary_sensors/
sensor: !include_dir_merge_list sensors/
```

---

## Modern HA Syntax (Required)

Always use modern syntax. The old syntax is deprecated. See `.cursorrules` for the full reference.

| Old (never use) | Modern (required) |
|---|---|
| `trigger:` | `triggers:` |
| `platform: state` | `trigger: state` |
| `condition:` | `conditions:` |
| `action:` | `actions:` |
| `service: light.turn_on` | `action: light.turn_on` |
| `entity_id: light.x` at root level | `target:` block with `entity_id:` |

```yaml
automation:
  - id: "example_automation"
    alias: "Example Automation"
    mode: single
    triggers:
      - trigger: state
        entity_id: binary_sensor.motion
        to: "on"
    conditions:
      - condition: state
        entity_id: input_boolean.lighting_automations
        state: "on"
    actions:
      - action: light.turn_on
        target:
          entity_id: light.office
        data:
          brightness_pct: 80
```

---

## Automation Style & Best Practices

These patterns are derived from the existing automations in this repo.

### One automation per file
Each automation lives in its own YAML file. The filename matches the automation ID.

```
packages/office/lights/office_lights_on.yaml    → id: "office_lights_on"
packages/security/alarm/alarm_arm_at_bedtime.yaml → id: "alarm_arm_at_bedtime"
```

### File header comment
Every automation file starts with a short comment block:
```yaml
# Office Lights On
#
# Turn on the lights when the office becomes occupied
# and illuminance is below threshold.
#

automation:
  - id: "office_lights_on"
```

### Naming
- IDs: `snake_case`, matching the filename (e.g. `office_lights_on`)
- Aliases: Natural language, room/feature name first (e.g. `"Office lights On"`, `"Alarm - Arm at Bedtime"`)

### Condition ordering — global → room → feature
Check the broadest/most-restrictive conditions first to fail fast:
```yaml
conditions:
  - condition: state                          # 1. house-level
    entity_id: input_boolean.house_occupied
    state: "on"
  - condition: state                          # 2. room-level
    entity_id: input_boolean.office_occupied
    state: "on"
  - condition: state                          # 3. feature-level
    entity_id: input_boolean.lighting_automations
    state: "on"
  - condition: numeric_state                  # 4. environmental
    entity_id: sensor.office_aqara_illuminance
    below: 150
```

### Use `for:` on triggers to prevent flapping
```yaml
triggers:
  - trigger: state
    entity_id: binary_sensor.office_aqara_motion_sensor
    to: "off"
    for:
      minutes: 3         # don't fire until motion has been off for 3 min
```

### Negate state with a template condition
```yaml
conditions:
  - condition: template
    value_template: "{{ not is_state('input_select.office', 'DnD') }}"
```

### Add `alias:` to complex conditions and actions
```yaml
actions:
  - if:
      - alias: "Speakers are grouped with another room"
        condition: template
        value_template: >
          {{ states.media_player.sonos_office.attributes.group_members | length > 1 }}
    then:
      - action: media_player.unjoin
        target:
          entity_id: media_player.sonos_office
```

### Modes
- `single` — default for almost all automations
- `queued` — scripts that manage shared resources (speakers, announcements)
- `restart` — when a new trigger should reset the current run (e.g. motion timers)

### Illuminance threshold
The standard lighting threshold across all rooms is **150 lux** (on below 150, off above 151).

### Secrets
Use `!secret` for all sensitive values:
```yaml
data:
  code: !secret alarmo_code
```
