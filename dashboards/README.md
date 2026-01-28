# Kohbo Dashboard

![Dashboard Overview](./kohbo/assets/dashboard-overview.jpg)

A custom Home Assistant dashboard system built with reusable templates and consistent design patterns.

> **Note:** This dashboard was designed for my specific home and needs. It's not intended to be a general-purpose theme or drop-in solution—but feel free to use it as inspiration or adapt components for your own setup.

## Overview

### Philosophy

I wanted a mobile dashboard that was intuitive, well-thought out, and didn't feel like a cluster of sensors and buttons. The focus was simplicity and usability. Rather than stack everything possible within the viewport, create a natural user flow to go from high-level to more detailed information, sensors, and actions. I wanted to build something that my wife and kids can without requiring consistent tech support. I'm still in the early alpha phase and WAF/SAF is unknown, so you've been warned.

The Kohbo dashboard prioritizes:

- **Consistency** — Every screen follows the same visual language and interaction patterns
- **Modularity** — Components are built as reusable templates that can be composed together
- **Information density** — Show relevant information at a glance without overwhelming
- **Dark-first design** — Optimized for wall-mounted tablets and low-light viewing

### Design Principles

1. **Template everything** — If you use it twice, make it a template
2. **Compose, don't duplicate** — Build complex UIs from simple, tested components
3. **State-driven styling** — Visual feedback should reflect device/entity state
4. **Mobile-friendly** — Works on phones, tablets, and desktop browsers

## Architecture

The dashboard uses a layered template system:

```
┌─────────────────────────────────────────────────────────┐
│                     Dashboard Views                      │
│              (home.yaml, climate.yaml, etc.)            │
├─────────────────────────────────────────────────────────┤
│                  Decluttering Templates                  │
│         Composed components with variable substitution   │
│            (room_card, climate_overview, etc.)          │
├─────────────────────────────────────────────────────────┤
│                  Button Card Templates                   │
│         Atomic UI components with state-based logic      │
│       (kohbo_device_entity, kohbo_chip_card, etc.)      │
├─────────────────────────────────────────────────────────┤
│                    Includes (Styles)                     │
│              Shared CSS and layout snippets              │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure

```
dashboards/
├── kohbo/                    # Dashboard views
│   ├── kohbo.yaml           # Entry point (loads templates)
│   ├── home/                # Home dashboard
│   ├── rooms/               # Room views by floor
│   ├── climate/             # Climate controls
│   ├── security/            # Security & cameras
│   ├── energy/              # Energy monitoring
│   └── more/                # People, settings
│
└── templates/               # Reusable components
    ├── button_cards/        # Atomic UI templates
    ├── decluttering/        # Composed templates
    └── includes/            # Styles & snippets
```

## Dashboard Sections

| Section | Description | Documentation |
|---------|-------------|---------------|
| 🏠 **Home** | Main landing page with quick access to key controls, room status, and notifications | [README](./kohbo/home/README.md) |
| 🏡 **Rooms** | Room-by-room control organized by floor, with detail pages for each room | [README](./kohbo/rooms/README.md) |
| 🌡️ **Climate** | Thermostat controls, temperature graphs, and air quality monitoring | [README](./kohbo/climate/README.md) |
| 🔒 **Security** | Cameras, locks, doors, windows, leak sensors, and alarm controls | [README](./kohbo/security/README.md) |
| ⚡ **Energy** | Real-time energy monitoring and usage statistics | [README](./kohbo/energy/README.md) |
| 👥 **People** | Presence tracking and location for household members | [README](./kohbo/more/PEOPLE_README.md) |

## Third-Party Components

These custom cards are required (install via [HACS](https://hacs.xyz/)):

| Component | Purpose |
|-----------|---------|
| [apexcharts-card](https://github.com/RomRider/apexcharts-card) | Data visualization charts |
| [advanced-camera-card](https://github.com/dermotduffy/advanced-camera-card) | Camera feeds (optional) |
| [browser-mod](https://github.com/thomasloven/hass-browser_mod) | Browser control and popups |
| [bubble-card](https://github.com/Clooos/Bubble-Card) | Popups and slide-up panels |
| [button-card](https://github.com/custom-cards/button-card) | Primary UI component for all custom cards |
| [card-mod](https://github.com/thomasloven/lovelace-card-mod) | CSS styling for cards |
| [decluttering-card](https://github.com/custom-cards/decluttering-card) | Template instantiation with variables |
| [horizon-card](https://github.com/rejuvenate/lovelace-horizon-card) | Sun position visualization |
| [lovelace-layout-card](https://github.com/thomasloven/lovelace-layout-card) | Custom page layouts |
| [mediocre-media-player](https://github.com/antontanderup/mediocre-hass-media-player-cards) | Media player cards |
| [mini-graph-card](https://github.com/kalkih/mini-graph-card) | Temperature and sensor graphs |
| [mushroom](https://github.com/piitaya/lovelace-mushroom) | Chip layouts and utilities |
| [navbar-card](https://github.com/nicufarmache/lovelace-navbar-card) | Bottom navigation bar |
| [scene-presets](https://github.com/hypfer/hass-scene_presets) | Hue-like scene presets for lights |
| [stack-in-card](https://github.com/custom-cards/stack-in-card) | Compose cards without extra styling |
| [swipe-card](https://github.com/bramkragten/swipe-card) | Swipeable card carousels |
| [template-entity-row](https://github.com/thomasloven/lovelace-template-entity-row) | Custom entity rows with templates |


## Custom Components

The dashboard is built on two types of custom templates:

### Button Card Templates

Atomic UI components with JavaScript-based state logic. These handle styling, state display, and interactions for individual elements.

**Examples:** `kohbo_device_entity`, `kohbo_chip_card`, `kohbo_thermostat_entity`

### Decluttering Templates

Composed components that combine multiple cards with variable substitution. These create reusable page-level elements.

**Examples:** `room_card`, `climate_overview`, `thermostat_popup`

📖 **Full component documentation:** [templates/README.md](./templates/README.md) *(coming soon)*

## Theme

The dashboard uses a custom dark theme (`kohbo`) with a consistent color palette:

| Color | Variable | Usage |
|-------|----------|-------|
| 🔵 Blue | `--primary-color` | Active states, primary accent |
| 🟡 Yellow | `--accent-color` | Warnings, highlights |
| 🟢 Green | `--success-color` | Success states |
| 🔴 Red | `--error-color` | Errors, alerts |

**Background:** Dark grays (`#212529` → `#343A40`)  
**Text:** Light grays (`#F8F9FA` primary, `#CED4DA` secondary)

Full theme definition: [`themes/kohbo/kohbo.yaml`](/config/themes/kohbo/kohbo.yaml)

## Custom Icons

The dashboard uses a custom `kohbo` icon set, referenced as `kohbo:kohbo-<name>`.

Common icons include: `dashboard`, `rooms`, `security`, `climate`, `light`, `door-open`, `door-closed`, `window-open`, `window-closed`, `notification`, `room-occupancy`

## Resources

- 🗺️ [SITEMAP.md](./SITEMAP.md) — Full navigation map of all views and popups
- 📝 [SCRATCHPAD.md](./SCRATCHPAD.md) — Development notes and TODOs
- 📋 [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md) — Documentation roadmap

## Contributing

This is a personal project, but if you find it useful or have questions, feel free to open an issue or reach out.
