# Home Dashboard

![Home Dashboard](./../assets/home-dashboard.jpg)

The main landing page providing quick access to key controls, house status, and navigation to all major dashboard sections.

---

## Overview

The Home dashboard serves as the central hub for my smart home, offering:

- **Quick Status Overview** - House mode, energy usage, and who's currently home
- **Security Overview** - Current state of house security and custom security score
- **Climate Monitoring** - Whole house climate and AQI overview
- **Room Status** - See which rooms are currently occupied
- **Quick Actions** - Fast access to lights, HVAC, doors, windows, and other devices
- **Navigation** - Easy access to all major dashboard sections

---

## File Structure

```
home/
├── home.yaml                                 # Main dashboard page
├── README.md                                 # This file
├── house_mode_popup.yaml                     # House mode selector popup
├── _vacuum_active_notification.yaml          # Vacuum running notification
├── _front_door_camera_notification.yaml      # Front door camera motion alert
└── _driveway_front_camera_notification.yaml  # Driveway camera motion alert
```

---

## Page Layout

### Header Section

The top header contains:

- **Page Title** - "Home" centered
- **Notifications Button** - Bell icon linking to `#notifications` popup
- **House Mode Chip** - Current house mode (Auto, Away, Quiet, Bedtime, Entertainment, Vacation) with color-coded icons (opens house mode popup)
- **Energy Usage Chip** - Real-time power consumption with color-coded status (links to [energy dashboard](../energy/README.md))
- **People Avatars** - Shows people currently at home (John, Cristina, Nonna, Katia) with status indicators (sleeping, DND)

### Security Overview

Security overview that provides visibility into the current state of the house's security. 

- Security score
- Alarm panel state
- Door locks status
- Garage doors status


### Climate Overview

Indoor climate monitoring with:
- **Temperature** - Average indoor temperature
- **Humidity** - Average indoor humidity
- **Air Quality** - PM2.5, CO2, TVOC sensors
- **Quick Navigation** - Link to full Climate dashboard

### Occupied Rooms

Horizontal scrolling list of currently occupied rooms:
- Shows count: "X Rooms Occupied"
- Displays room cards for rooms with active occupancy sensors
- Sorted by most recently occupied (last changed)
- Uses `occupied_room_card` template

### Overview Section

2-column grid of key device groups:

| Device | Entity | Icon | Navigation |
|--------|--------|------|------------|
| **Interior Lights** | `light.interior_lights` | `kohbo:kohbo-light` | Native More Info |
| **Exterior Lights** | `light.exterior_lights` | `kohbo:kohbo-lamp` | `/dashboard-kohbo/exterior-lighting` |
| **Main Floor HVAC** | `climate.nest_main_floor` | Thermostat | `#main_floor_thermostat` popup |
| **Upper Floor HVAC** | `climate.nest_2nd_floor` | Thermostat | `#upper_floor_thermostat` popup |
| **Exterior Doors** | `binary_sensor.exterior_doors` | Door (open/closed) | `/dashboard-kohbo/security-exterior-doors` |
| **Windows** | `binary_sensor.windows` | Window (open/closed) | `/dashboard-kohbo/security-windows` |
| **Main Floor Vacuum** | `vacuum.main_floor_vacuum` | `mdi:robot-vacuum` | `/dashboard-kohbo/main-floor-vacuum` |

### Quick Settings

Toggle switches for automation controls:

- **Speech Notifications** - `input_boolean.speech_notifications`
- **Lighting Automations** - `input_boolean.lighting_automations`
- **Camera Notifications** - `input_boolean.camera_notifications`

Each shows last-changed time and state color coding.

---

## Popups & Notifications

### House Mode Popup

Accessed via the House Mode chip in the header. Allows selection of:
- **Auto** - Automatic mode based on presence and time
- **Away** - House is unoccupied
- **Quiet** - Reduced notifications and automations
- **Bedtime** - Night mode settings
- **Entertainment** - Optimized for media/entertainment
- **Vacation** - Extended away mode

### Thermostat Popups

- **Main Floor Thermostat** (`#main_floor_thermostat`) - Full climate control for main floor
- **Upper Floor Thermostat** (`#upper_floor_thermostat`) - Full climate control for upper floor

### Camera Notifications

If certain cameras detect a person or vehicle, a little alert message will pop up at the bottom of the screen. If clicked, a camera popup will open with access to the live feed and more options.

### Vacuum Notification

Shows when main floor vacuum is actively running. It's displayed as a sticky device banner at the bottom of the screen so you can quickly pause or stop the vacuum.

### Notifications Popup

Central notification center (`#notifications`) accessible from header bell icon. Displays:
- Air purifier filter change reminders
- Laundry completion alerts
- Vacuum status and errors
- Leak sensor alerts
- Garbage day reminders
- Medication reminders
- And more...

---

## Components Used

### Button Card Templates

- `kohbo_header_page_title` - Page title in header
- `kohbo_header_chip_card` - Header action buttons (notifications)
- `kohbo_chip_card` - Status chips (house mode, energy)
- `kohbo_person_entity` - People avatars with status
- `kohbo_device_entity` - Device control cards
- `kohbo_thermostat_entity` - HVAC control cards
- `occupied_room_card` - Room occupancy cards
- `section_title` - Section headers
- `kohbo_card_small_header` - Small section headers

### Decluttering Templates

- `climate_overview` - Climate monitoring section
- `kohbo_security_overview` - Security status overview

### Layout Components

- `custom:vertical-layout` - Main page container
- `custom:layout-card` with `grid-layout` - Grid layouts
- `custom:stack-in-card` - Stacked card sections
- `custom:auto-entities` - Dynamic room card generation

---

## Navigation

The Home dashboard provides quick navigation to:

- **Rooms** - `/dashboard-kohbo/rooms` (via room cards)
- **Climate** - `/dashboard-kohbo/climate` (via climate overview)
- **Security** - `/dashboard-kohbo/security` (via security overview)
- **Energy** - `/dashboard-kohbo/energy` (via energy chip)
- **Exterior Lighting** - `/dashboard-kohbo/exterior-lighting`
- **Security Sub-pages** - Exterior doors, windows
- **Vacuum** - `/dashboard-kohbo/main-floor-vacuum`

Bottom navigation bar provides access to all major sections.

---

## Customization

### Adding a New Person

To add a person avatar to the header:

```yaml
- type: custom:button-card
  entity: person.your_person
  template: kohbo_person_entity
  tap_action:
    action: navigate
    navigation_path: '#your_person'
    haptic: light
```

### Adding a Quick Action

Add to the Overview grid section:

```yaml
- type: custom:button-card
  entity: your.entity
  name: Your Device
  template: kohbo_device_entity
  icon: mdi:your-icon
  tap_action:
    action: navigate
    navigation_path: '/dashboard-kohbo/your-page'
    haptic: light
```

### Adding a Quick Setting

Add to the Quick Settings section:

```yaml
- entity: input_boolean.your_setting
  icon: mdi:your-icon
  card_mod: !include /config/dashboards/templates/includes/kohbo_boolean_entity_layout.yaml
  secondary_info: last-changed
  state_color: true
```

---

## Example YAML

See [`home.yaml`](./home.yaml) for the complete dashboard configuration.

### Key Snippets

**House Mode Chip:**
```yaml
- type: custom:button-card
  template: kohbo_chip_card
  entity: input_select.house
  state:
    - value: "Auto"
      icon: kohbo:kohbo-house-auto
      color: var(--primary-color)
  tap_action:
    action: navigate
    navigation_path: '#house_mode'
```

**Occupied Rooms Section:**
```yaml
- type: custom:auto-entities
  card:
    type: entities
  filter:
    include:
      - group: group.room_sensors
        state: "on"
        options:
          type: custom:button-card
          template: occupied_room_card
```

**Climate Overview:**
```yaml
- type: custom:decluttering-card
  template: climate_overview
  variables:
    - room_name: Indoor
    - temperature_sensor: sensor.average_indoor_temperature
    - humidity_sensor: sensor.average_indoor_humidity
```

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md)
