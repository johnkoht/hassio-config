# People Dashboard

![People Dashboard](./../assets/people-dashboard.jpg)

Track people, presence, and related modes throughout the house. Monitor who's home, their locations, device status, and control people-related automations.

## Overview

The People dashboard provides:

- **People Home Count** - Real-time count of people currently at home
- **Mode Controls** - Guest mode and entertainment mode toggles
- **Person Cards** - Visual cards showing presence, location, and status for family members
- **Person Entity Rows** - List view for extended family and guests
- **Person Popups** - Detailed information for each person including location, device status, sleep tracking, and automations
- **People Settings** - Configuration for people-related automations

## File Structure

```
more/
├── PEOPLE_README.md                        # This file
└── people.yaml                             # Main people dashboard page
```

The people dashboard also uses shared components:
- `dashboards/kohbo/shared/people.yaml` - Shared person button cards
- `dashboards/templates/button_cards/people/*.yaml` - Individual person popup definitions

## Page Structure

### Page Header

Standard toolbar with:
- **Page Title** - "People"
- **Settings Button** - Opens people settings popup (`#people_settings_popup`)

Uses `top_toolbar` decluttering template.

### Overview Chips

Horizontal chip layout showing:

1. **People Home Count**
   - Entity: `sensor.people_home_count`
   - Displays count with proper pluralization ("1 person", "X people", or "Empty")
   - Color-coded:
     - 0: Light grey
     - > 6: Success color (green)
     - Default: Primary color

2. **Guest Mode**
   - Entity: `input_boolean.guest_mode`
   - Toggle for guest mode
   - Shows "Guest Mode On" or "Guest Mode Off"

3. **Entertainment Mode**
   - Entity: `input_boolean.entertainment_mode`
   - Toggle for entertainment mode

### Family Section

Grid layout (2 columns) displaying person cards for immediate family members.

**Person Cards:**
- Use `kohbo_person_card` button card template
- Display person's profile picture
- Show presence status (Home/Away)
- Display location when home (room presence)
- Show special status indicators:
  - Sleeping status
  - Do Not Disturb status
- Display proximity (distance from home)
- Show device battery level
- Tap action navigates to person's popup (e.g., `#person_name`)

**Person Card Variables:**
- `status` - Special status (sleeping, dnd, etc.)
- `battery_level` - Device battery percentage
- `proximity` - Distance from home

**State Display Logic:**
- When home: Shows "Home - [Room]" or "Home - Sleeping" or "Home - Do Not Disturb"
- When away: Shows "Away" or "Away - [Location]"

### Extended Family Section

Entity rows list for extended family members.

**Features:**
- Uses `custom:template-entity-row` for each person
- Shows person name and entity
- Displays state (Home/Away)
- Shows last changed time as relative time
- Custom styling via `person_entity_row.yaml` card_mod
- Tap action navigates to person's popup

**State Logic:**
- For some family members, shows sleep state (Sleeping/Awake) instead of Home/Away
- Displays last changed time for sleep state

### Guests Section

Entity rows list for guests and other people.

**Features:**
- Same structure as Extended Family section
- Uses entity rows with person entities
- Shows Home/Away status
- Last changed time display
- Navigation to individual popups

### People Button Cards

Shared component section that includes person button cards.

**Structure:**
- Uses `!include` to load shared people cards
- Located at `dashboards/kohbo/shared/people.yaml`
- Contains individual person button card definitions
- Each person has their own YAML file in `templates/button_cards/people/`

## Person Popups

Each person has a dedicated popup accessible via hash navigation (e.g., `#person_name`). The popup structure is defined in individual YAML files located in `dashboards/templates/button_cards/people/`.

My spouse and my popup cards are much more robust then the others. Ours exposes phone sensor data, sleep sensors, and various other attributes we track. For most extended family, the popup simply tracks:

- Occupancy (home/away)
- Room Location
- Unlock Privileges (whether the house automatically unlocks for them)
- Automations (announce arrival or departure, etc)

### Popup Structure

**Standard popup sections include:**

1. **Profile Picture**
   - Large profile picture with status indicator overlay
   - Uses `people_profile_picture` template
   - Shows special status (sleeping, dnd) as overlay

2. **Person Heading**
   - Person's name
   - Current location/status display
   - Uses `kohbo_person_heading` template

3. **Location Details**
   - Person entity (current location)
   - Room presence sensor
   - Proximity/distance from home
   - Steps (if available)
   - Commuting status

4. **Work/Focus Details**
   - Do Not Disturb toggle
   - Focus mode selector

5. **Sleep Details**
   - Sleep status (Awake, Sleep, Just Laid Down, etc.)
   - Bed occupancy sensor
   - Sleep score (if available)

6. **Device Details**
   - Phone battery level
   - Watch battery level
   - WiFi network (SSID)

7. **Automations**
   - Person-specific automation toggles
   - Examples: Announce Arrival, Announce Departure, Set Focus Mode, Daily Report

**Popup Navigation:**
- Each popup uses a hash-based navigation path (e.g., `#john`, `#cristina`)
- Popups are defined using `custom:bubble-card` with `card_type: pop-up`
- Standard popup styles applied via `kohbo_popup_styles.yaml`

_Note: See screenshot below for detailed popup layout and structure._

## Components Used

### Decluttering Templates

- **`top_toolbar`** - Page header with title and settings button
- **`people_profile_picture`** - Profile picture with status overlay
- **`kohbo_person_heading`** - Person name and location heading

### Button Card Templates

- **`kohbo_person_card`** - Main person card for family section
- **`kohbo_person_entity`** - Person entity button card
- **`kohbo_chip_card`** - Chip cards for overview section
- **`kohbo_header_page_title`** - Page title in header
- **`kohbo_header_chip_card`** - Settings button in header
- **`section_title`** - Section header cards

### Include Templates

- **`person_entity_row.yaml`** - Card mod for person entity rows
- **`kohbo_person_entities_layout.yaml`** - Layout styling for person entity sections
- **`kohbo_boolean_entity_layout.yaml`** - Boolean toggle layout
- **`kohbo_entity_item_layout.yaml`** - Generic entity item layout

### Shared Components

- **`dashboards/kohbo/shared/people.yaml`** - Shared person button cards
- Individual person popup files in `templates/button_cards/people/`

## Key Entities

### Overview
- `sensor.people_home_count` - Count of people at home
- `input_boolean.guest_mode` - Guest mode toggle
- `input_boolean.entertainment_mode` - Entertainment mode toggle

### Person Entities
- `person.*` - Person entities for each tracked person
- `sensor.*_room_presence` - Room presence sensors
- `sensor.home_*_distance` - Distance from home sensors
- `input_select.*_sleep_state` - Sleep state selectors
- `input_boolean.*_dnd` - Do Not Disturb toggles
- `input_select.*_focus_mode` - Focus mode selectors

### Device Sensors
- `sensor.*_battery_level` - Phone battery levels
- `sensor.*_watch_battery` - Watch battery levels
- `sensor.*_ssid` - WiFi network names
- `sensor.*_steps` - Step counts

### Sleep Tracking
- `binary_sensor.*_bed_occupied` - Bed occupancy sensors
- `sensor.withings_sleep_score` - Sleep score (if available)

### Automations
- `automation.*_announce_arrival` - Arrival announcement automations
- `automation.*_announce_departure` - Departure announcement automations
- `automation.*_set_focus_mode` - Focus mode automations
- `automation.*_daily_report` - Daily report automations

## Example YAML

### Person Card

```yaml
- type: custom:button-card
  entity: person.person_name
  name: Person Name
  template: kohbo_person_card
  show_entity_picture: true
  show_icon: false
  variables:
    status: >
      [[[
        if (states['input_select.person_sleep_state'].state == "Sleep") {
          return "sleeping";
        } else if (states['input_boolean.person_dnd'].state == "on") {
          return "dnd";
        }
      ]]]
    battery_level: >
      [[[
        return states['sensor.person_phone_battery_level'].state + '%';
      ]]]
    proximity: >
      [[[
        const distance = parseFloat(states['sensor.home_person_distance'].state);
        return Math.round((distance + Number.EPSILON) * 100) / 100 + 'mi';
      ]]]
  state_display: >
    [[[
      if (states['person.person_name'].state == "home") {
        if (states['input_select.person_sleep_state'].state == "Sleep") {
          return "Home - Sleeping"
        } else {
          var location = states['sensor.person_room_presence'].state.replace('_', ' ');
          location = location.charAt(0).toUpperCase() + location.slice(1);
          return "Home - " + location;
        }
      } else {
        return "Away";
      }
    ]]]
  tap_action:
    haptic: light
    action: navigate
    navigation_path: '#person_name'
```

### Person Entity Row

```yaml
- type: custom:template-entity-row
  name: Person Name
  entity: person.person_name
  state: >
    {% if states[config.entity].state == "home" %}
      Home
    {% else %}
      Away
    {% endif %}
  secondary: "{{ states[config.entity].last_changed | relative_time }} ago"
  card_mod: !include /config/dashboards/templates/includes/people/person_entity_row.yaml
  color: !include /config/dashboards/templates/includes/kohbo_entities_entity_icon_color.yaml
  tap_action:
    haptic: light
    action: navigate
    navigation_path: '#person_name'
```

### Overview Chip

```yaml
- type: custom:button-card
  template: kohbo_chip_card
  entity: sensor.people_home_count
  name: People Home Count
  icon: mdi:home-account
  state_display: >
    [[[
      if (states['sensor.people_home_count'].state == 1) {
        return "1 person";
      } else if (states['sensor.people_home_count'].state == 0) {
        return "Empty";
      } else {
        return states['sensor.people_home_count'].state + ' people';
      }
    ]]]
  state:
    - value: 0
      color: var(--light-grey-color)
    - operator: >
      value: 6
      color: var(--success-color)
    - operator: default
      color: var(--primary-color)
```

## Navigation

The people dashboard uses the following navigation paths:

- `/dashboard-kohbo/people` - Main people dashboard page
- `#people_settings_popup` - People settings popup
- `#person_name` - Individual person popups (hash-based navigation)

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md) | 🗺️ [Sitemap](../../SITEMAP.md)
