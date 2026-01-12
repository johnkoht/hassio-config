# Kohbo Dashboard System

> ⚠️ **Note:** This documentation was AI-generated as a first pass and will be updated in the near future to be more comprehensive and useful.

A custom Home Assistant dashboard system built with reusable templates and consistent design patterns.

---

## Overview

This dashboard system is built around a dark theme (kohbo) with modular, reusable components. The primary building blocks are:

- **Button Card Templates** - Atomic UI components with state-based logic
- **Decluttering Cards** - Composed components with variable substitution
- **Includes** - Shared CSS styles and configuration snippets

## Quick Start

### Adding a New Room Page

1. Create a new file in `kohbo/rooms/<floor>/<room_name>.yaml`
2. Use this template:

```yaml
type: custom:vertical-layout
title: Room Name
path: rooms-room-name
theme: kohbo
subview: true
layout: !include /config/dashboards/templates/includes/layouts/kohbo_page_layout.yaml
cards:
  # Toolbar
  - type: custom:decluttering-card
    template: room_page_top_toolbar
    variables:
      - name: Room Name
      - navigation_path: /dashboard-kohbo/rooms-main-floor
      - settings_path: '#room_settings_popup'

  # Climate Overview (optional)
  - type: custom:decluttering-card
    template: climate_overview
    variables:
      - temperature_sensor: sensor.room_temperature
      - humidity_sensor: sensor.room_humidity
      - carbon_dioxide_sensor: sensor.room_co2
      - vocs_sensor: sensor.room_vocs
      - pm25_sensor: sensor.room_pm25
      - room_name: Room Name
      - aqi_score_sensor: sensor.room_aqi_score
      - action_cards:
        - type: custom:button-card
          template: empty_column

  # Section: Lights
  - type: custom:button-card
    template: section_title
    name: Lights
  
  # Add your light cards here...

  # Section: Devices
  - type: custom:button-card
    template: section_title
    name: Devices
  - type: grid
    columns: 2
    square: false
    cards:
      - type: custom:button-card
        entity: binary_sensor.room_door
        name: Door
        template: kohbo_device_door_entity

  # Navbar
  - !include /config/dashboards/templates/includes/navbar.yaml
```

3. Add the view to `kohbo/kohbo.yaml`:
```yaml
- !include /config/dashboards/kohbo/rooms/<floor>/<room_name>.yaml
```

### Adding a Boolean Toggle

```yaml
- type: entities
  entities:
    - entity: input_boolean.my_toggle
      icon: mdi:bell
      card_mod: !include /config/dashboards/templates/includes/kohbo_boolean_entity_layout.yaml
      secondary_info: last-changed
      state_color: true
```

### Creating a Popup

```yaml
# At the end of your cards (before navbar)
- type: vertical-stack
  cards:
    - type: custom:bubble-card
      card_type: pop-up
      hash: '#my_popup'
      close_by_clicking_outside: true
      styles: !include /config/dashboards/templates/includes/kohbo_popup_styles.yaml
      margin_top_mobile: calc(100vh - 825px)
      margin_top_desktop: calc(100vh - 825px)
    
    - type: custom:button-card
      template: kohbo_popup_page_title
      name: My Popup

    # Add popup content here...
```

Navigate to it:
```yaml
tap_action:
  action: navigate
  navigation_path: '#my_popup'
```

---

## Folder Structure

```
dashboards/
├── kohbo/                    # Main dashboard views
│   ├── kohbo.yaml           # Entry point
│   ├── home/                # Home page
│   ├── rooms/               # Room views
│   ├── security/            # Security views
│   ├── climate/             # Climate views
│   ├── energy/              # Energy monitoring
│   └── shared/              # Shared popups
│
└── templates/               # Reusable templates
    ├── button_cards/        # Button card templates
    │   ├── base/            # Base templates
    │   ├── cards/           # Component templates
    │   └── people/          # Person templates
    ├── decluttering/        # Decluttering templates
    └── includes/            # CSS styles
```

---

## Template Reference

### Button Card Templates

Base templates (extend these):
- `kohbo_default` - Base styles for all cards
- `kohbo_entity` - Base entity card with name/state display

Device templates:
- `kohbo_device_entity` - Generic device card
- `kohbo_device_door_entity` - Door sensors
- `kohbo_device_window_entity` - Window sensors
- `kohbo_device_lock_entity` - Locks
- `kohbo_device_leak_entity` - Leak sensors
- `kohbo_device_smart_plug_entity` - Smart plugs
- `kohbo_device_air_purifier_entity` - Air purifiers
- `kohbo_thermostat_entity` - Climate/thermostats

UI components:
- `kohbo_chip_card` - Pill-shaped chip buttons
- `kohbo_header_chip_card` - Header action buttons
- `kohbo_header_page_title` - Page title in header
- `kohbo_popup_page_title` - Popup title
- `section_title` - Section headers
- `empty_column` - Spacer

People:
- `kohbo_person_entity` - Person avatar with status

### Decluttering Templates

Layout:
- `top_toolbar` - Base toolbar template
- `room_page_top_toolbar` - Room page toolbar with back/settings
- `room_page_top_toolbar_no_settings` - Toolbar without settings

Room components:
- `room_card` - Room card with occupancy
- `room_overview` - Room header with mode/occupancy
- `room_header` - Simple room header

Climate:
- `climate_overview` - Temperature graph + AQI indicators
- `thermostat_popup` - Thermostat control popup
- `thermostat_radiant_floor_popup` - Radiant floor controls

Media:
- `media_player` - Media player card
- `media_player_pop_up` - Media player popup

Security:
- `camera_card` - Camera feed card
- `camera_popup` - Camera popup with controls

---

## Custom Cards Required

Install these via HACS:

- [button-card](https://github.com/custom-cards/button-card)
- [stack-in-card](https://github.com/custom-cards/stack-in-card)
- [decluttering-card](https://github.com/custom-cards/decluttering-card)
- [lovelace-layout-card](https://github.com/thomasloven/lovelace-layout-card)
- [bubble-card](https://github.com/Clooos/Bubble-Card)
- [card-mod](https://github.com/thomasloven/lovelace-card-mod)
- [mini-graph-card](https://github.com/kalkih/mini-graph-card)
- [navbar-card](https://github.com/nicufarmache/lovelace-navbar-card)
- [mushroom](https://github.com/piitaya/lovelace-mushroom)
- [apexcharts-card](https://github.com/RomRider/apexcharts-card)
- [advanced-camera-card](https://github.com/dermotduffy/advanced-camera-card) (if using cameras)

---

## Theme

The kohbo theme (`themes/kohbo/kohbo.yaml`) defines the color palette:

### Primary Colors
| Variable | Hex | Preview |
|----------|-----|---------|
| `--primary-color` | `#59A5D8` | Blue - active states |
| `--accent-color` | `#FFD166` | Yellow - warnings |
| `--success-color` | `#06D6A0` | Green - success |
| `--error-color` | `#ED4747` | Red - errors |

### Background Colors
| Variable | Hex | Preview |
|----------|-----|---------|
| `--primary-background-color` | `#212529` | Page background |
| `--dark-primary-color` | `#343A40` | Card background |
| `--darker-primary-color` | `#2D3339` | Secondary background |

### Text Colors
| Variable | Hex | Preview |
|----------|-----|---------|
| `--primary-text-color` | `#F8F9FA` | Main text |
| `--secondary-text-color` | `#CED4DA` | Secondary text |
| `--light-grey-color` | `#ADB5BD` | Inactive/muted |

---

## Custom Icons

The dashboard uses a custom `kohbo` icon set. Icons are referenced as `kohbo:kohbo-<name>`.

Common icons:
- `kohbo:kohbo-dashboard` - Home
- `kohbo:kohbo-rooms` - Rooms
- `kohbo:kohbo-security` - Security
- `kohbo:kohbo-climate` - Climate
- `kohbo:kohbo-light` - Lights
- `kohbo:kohbo-door-open` / `kohbo:kohbo-door-closed`
- `kohbo:kohbo-window-open` / `kohbo:kohbo-window-closed`
- `kohbo:kohbo-notification` - Notifications
- `kohbo:kohbo-room-occupancy` - Occupancy

> **TODO:** Document where custom icons are stored and how to add new ones.

---

## Development Guidelines

### Template Syntax

**Button Card (JavaScript):**
```yaml
state_display: |
  [[[
    if (entity.state === 'on') return 'Active';
    return 'Inactive';
  ]]]
```

**Decluttering Card (Variables):**
```yaml
template: my_template
variables:
  - entity: sensor.temperature
  - name: Temperature
```

In template file:
```yaml
entity: '[[entity]]'
name: '[[name]]'
```

### Path Format

All `!include` paths use Home Assistant's container path:
```yaml
!include /config/dashboards/templates/includes/navbar.yaml
```

### Template Loading

Templates are loaded in `kohbo.yaml`:
```yaml
button_card_templates: !include_dir_merge_named /config/dashboards/templates/button_cards
decluttering_templates: !include_dir_merge_named /config/dashboards/templates/decluttering
```

---

## Contributing

See [SCRATCHPAD.md](./SCRATCHPAD.md) for development notes, TODOs, and decision guides.
