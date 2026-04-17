# CLAUDE.md — dashboards/

This file provides guidance to Claude Code (claude.ai/code) when working in the `dashboards/` directory.

---

## Overview

The Kohbo dashboard is a custom Lovelace system built on reusable templates with a dark-first design, optimized for mobile and wall-mounted tablets. It is loaded in `storage` mode via `configuration.yaml` with the entry point at `dashboards/kohbo/kohbo.yaml`.

---

## Three-Layer Template Architecture

```
Dashboard Views  (kohbo/home/, kohbo/rooms/, kohbo/climate/, etc.)
       ↓  uses
Decluttering Templates  (templates/decluttering/)
       ↓  uses
Button Card Templates  (templates/button_cards/)
       ↓  uses
Shared Styles / Includes  (templates/includes/)
```

**Never duplicate UI logic.** If you use a pattern twice, make it a template. Compose complex views from simple, tested components.

---

## Directory Structure

```
dashboards/
├── kohbo/
│   ├── kohbo.yaml               # Entry point — loads all template files
│   ├── home/                    # Main landing view
│   ├── rooms/                   # Room views organized by floor
│   │   ├── main_floor/
│   │   ├── upper_floor/
│   │   └── lower_floor/
│   ├── climate/                 # Thermostat + air quality views
│   ├── security/                # Cameras, locks, alarm, doors, sensors
│   ├── energy/                  # Power monitoring
│   └── more/                    # People, settings
└── templates/
    ├── button_cards/            # Atomic UI components (button-card based)
    ├── decluttering/            # Composed components (decluttering-card based)
    └── includes/                # Shared CSS/style snippets
```

---

## Template Types

### Button Card Templates (`templates/button_cards/`)

Atomic components built with [button-card](https://github.com/custom-cards/button-card). They use JavaScript for state-based styling and interaction logic.

Key templates:
- `kohbo_device_entity` — standard device row with state and icon
- `kohbo_chip_card` — small status chip
- `kohbo_thermostat_entity` — thermostat control row

Reference in a card:
```yaml
type: custom:button-card
template: kohbo_device_entity
entity: light.office_lights
```

### Decluttering Templates (`templates/decluttering/`)

Composed page-level components built with [decluttering-card](https://github.com/custom-cards/decluttering-card). Accept variables for customization.

Key templates:
- `room_card` — room status card with occupancy, mode, climate, devices
- `climate_overview` — thermostat + graph combo
- `thermostat_popup` — popup with full thermostat controls

Reference in a view:
```yaml
type: custom:decluttering-card
template: room_card
variables:
  - room: office
  - room_name: Office
  - occupied_entity: input_boolean.office_occupied
  - mode_entity: input_select.office
```

---

## Required HACS Components

All of these must be installed for the dashboard to render correctly:

| Component | Purpose |
|---|---|
| [button-card](https://github.com/custom-cards/button-card) | Primary building block for all custom cards |
| [decluttering-card](https://github.com/custom-cards/decluttering-card) | Template instantiation with variables |
| [card-mod](https://github.com/thomasloven/lovelace-card-mod) | CSS overrides on standard cards |
| [lovelace-layout-card](https://github.com/thomasloven/lovelace-layout-card) | Custom page layouts |
| [mushroom](https://github.com/piitaya/lovelace-mushroom) | Chip layout utilities |
| [apexcharts-card](https://github.com/RomRider/apexcharts-card) | Charts and graphs |
| [mini-graph-card](https://github.com/kalkih/mini-graph-card) | Sensor history graphs |
| [bubble-card](https://github.com/Clooos/Bubble-Card) | Slide-up panels and popups |
| [browser-mod](https://github.com/thomasloven/hass-browser_mod) | Browser control and popup navigation |
| [navbar-card](https://github.com/joseluis9595/lovelace-navbar-card) | Bottom navigation bar |
| [swipe-card](https://github.com/bramkragten/swipe-card) | Swipeable carousels |
| [stack-in-card](https://github.com/custom-cards/stack-in-card) | Card composition without visual gaps |
| [scene-presets](https://github.com/hypfer/hass-scene_presets) | Hue-like lighting scenes |
| [mediocre-media-player](https://github.com/antontanderup/mediocre-hass-media-player-cards) | Media player cards |
| [advanced-camera-card](https://github.com/dermotduffy/advanced-camera-card) | Camera feeds |
| [template-entity-row](https://github.com/thomasloven/lovelace-template-entity-row) | Custom entity rows |
| [horizon-card](https://github.com/rejuvenate/lovelace-horizon-card) | Sun position display |

---

## Theme

The dashboard uses the `kohbo` dark theme defined in `themes/kohbo/kohbo.yaml`.

| Role | CSS Variable | Value |
|---|---|---|
| Primary accent | `--primary-color` | Blue |
| Warning / highlight | `--accent-color` | Yellow |
| Success | `--success-color` | Green |
| Error / alert | `--error-color` | Red |
| Background | — | Dark grays (`#212529` → `#343A40`) |
| Primary text | — | `#F8F9FA` |
| Secondary text | — | `#CED4DA` |

Use these CSS variables in `card-mod` styling — don't hardcode hex values.

---

## Custom Icon Set

Icons are referenced as `kohbo:kohbo-<name>`. Common icons:

`dashboard`, `rooms`, `security`, `climate`, `light`, `door-open`, `door-closed`, `window-open`, `window-closed`, `notification`, `room-occupancy`

---

## Design Principles

- **State-driven styling** — visual feedback must reflect entity state (color, opacity, icon)
- **Template everything** — two uses = a new template
- **Mobile-first** — test at phone viewport; tablets and desktop get the same layout
- **Dark-first** — all new components must look correct on dark background before light

---

## Adding a New Room View

1. Create `kohbo/rooms/{floor}/{room_name}.yaml`
2. Use the `room_card` decluttering template as the base
3. Add a navigation entry in the rooms floor index view
4. Add any room-specific popups using `bubble-card` or `browser-mod`

See existing room views (e.g. `kohbo/rooms/main_floor/kitchen.yaml`) as the reference pattern.
