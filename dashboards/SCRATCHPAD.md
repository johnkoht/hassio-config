# Dashboard Development Scratchpad

> This is a working document for capturing nuances, patterns, and ideas during dashboard development. 
> Items here may eventually be promoted to the README or rules file.

---

## Current Working Items

> 🚧 **Temporary section** - Items parked from the current working session.  
> Clear this section when the feature/session is complete.

### Parked Tasks (from Energy Dashboard Review - Jan 2026)

1. **Fix `sensor.whole_home_energy_trend` and `sensor.whole_home_energy_trend_percent`**
   - Location: `packages/energy/sensors/energy_consumption.yaml` (lines 73-100)
   - Problem: These sensors use `sensor.whole_home_daily_energy_stats` which is broken
   - The statistics sensor averages intermediate utility meter values (0, 1, 2...17 kWh throughout the day) instead of final daily totals, resulting in ~50% of the actual average
   - Fix: Update to use `sensor.energy_expected_full_day` (sum of hourly baselines) instead
   - Status: parked

2. **Energy History comparison labels** ✅ DONE
   - Location: `dashboards/kohbo/energy/partials/energy_history.yaml` (lines 47-68)
   - Fixed: Changed weekly/monthly labels from "vs last" to "vs expected" to match calculation
   - Status: completed

3. **Future: Implement true "vs last" comparisons using utility meter `last_period` attribute**
   - Utility meters store the previous period's final value in `last_period` attribute:
     - `state_attr('sensor.whole_home_energy_daily_usage', 'last_period')` = yesterday's total
     - `state_attr('sensor.whole_home_energy_weekly_usage', 'last_period')` = last week's total  
     - `state_attr('sensor.whole_home_energy_monthly_usage', 'last_period')` = last month's total
   - To implement: Update `kohbo_energy_stat_comparison` template to optionally use these attributes
   - Could add a `comparison_mode` variable: 'expected' (current) vs 'last_period' (new)
   - Status: parked (for future enhancement)

4. **Orphaned energy sensors (keeping for now)**
   - Location: `packages/energy/sensors/energy_consumption.yaml`
   - These sensors are defined but not currently used in dashboards:
     - `sensor.energy_today_estimated`
     - `sensor.energy_yesterday_total`
     - `sensor.energy_daily_change_percent`
     - `sensor.energy_this_week_projected`
     - `sensor.energy_last_week_total`
     - `sensor.energy_weekly_change_percent`
     - `sensor.energy_this_month_projected`
     - `sensor.energy_last_month_total`
     - `sensor.energy_monthly_change_percent`
   - Note: These use the broken `whole_home_daily_energy_stats` sensor - if we want to use them, they need to be fixed first
   - Decision: Keep for now, may be useful for automations or future dashboard features
   - Status: parked

5. **Broken statistics sensors (need fixing before use)**
   - `sensor.whole_home_daily_energy_stats` - averages intermediate values instead of final daily totals
   - `sensor.energy_last_month_avg` - same issue
   - These could be fixed by using the utility meter `last_period` approach instead
   - Status: parked

---

## Unused Components Audit

> 🔍 **Component Usage Analysis** - Tracking unused components for periodic review.
> Last audit: **January 2026**

### Cleanup Completed (Jan 2026)

The following unused components were **deleted**:

#### Deleted Button Card Templates (9)
- `kohbo_aqi_ozone_item` - Ozone displayed via different template
- `kohbo_aqi_index_item` - Individual AQI items used instead
- `kohbo_pill` - Replaced by `kohbo_chip_card`
- `kohbo_device_door_entity_wide` - Standard variant used instead
- `kohbo_room_card_header` - `kohbo_room_card_overview` used instead
- `kohbo_popup_title` - `kohbo_popup_page_title` used instead
- `kohbo_settings_row` - Unused
- `kohbo_page_back_button` - Navigation handled differently
- `kohbo_nested_page_title` - `kohbo_header_page_title` used instead

#### Deleted Decluttering Templates (1)
- `room_header` - Was entirely commented out

#### Deleted Include Files (6)
- `header_chip_card_mod.yaml` - No usage found
- `kohbo_room_chip_card_mod_occupancy.yaml` - No usage found
- `kohbo_entity_row_occupancy_state_display.yaml` - No usage found
- `kohbo_entity_layout.yaml` - No usage found
- `kohbo_header_layout.yaml` - No usage found
- `kohbo_person_battery_icon_color.yaml` - No usage found

#### Deleted .DISABLED Files (5)
- `kohbo_climate_overview.yaml.DISABLED`
- `thermostat_popup_temperature_item.yaml.DISABLED`
- `office_all_lights_scenes_button.yaml.DISABLED`
- `office_ceiling_lights_scenes_button.yaml.DISABLED`
- `kohbo_scene_button_card.yaml.DISABLED`

---

### Remaining: Components Only Used in Commented Code

These components are referenced only in commented-out sections. Review these to determine if the commented code should be removed or re-enabled.

#### Button Card Templates

1. **`kohbo_card_wide`**
   - Location: `templates/button_cards/cards/shared/kohbo_card_wide.yaml`
   - Usage: Only in commented code in `kohbo/security/security.yaml` (line 949)

2. **`kohbo_alarm_action_card`**
   - Location: `templates/button_cards/cards/devices/kohbo_alarm_action_card.yaml`
   - Usage: Only in commented code in `kohbo/security/pages/alarm_panel.yaml` (lines 35, 56, 77)
   - Note: Extends `kohbo_horizontal_action_card_entity` which is used

3. **`security_overview_item`**
   - Location: `templates/button_cards/cards/security/security_overview_item.yaml`
   - Usage: Only in commented code in `kohbo/security/security.yaml` (lines 855, 874, 887, 903, 918, 933)

4. **`security_alarm_action_button`**
   - Location: `templates/button_cards/cards/security/security_alarm_action_button.yaml`
   - Usage: Only in commented code in `kohbo/security/security.yaml` (lines 1067, 1083, 1097)

5. **`kohbo_horizontal_action_card_aqi_entity`**
   - Location: `templates/button_cards/cards/devices/horizontal_action_card_entities/`
   - Usage: Only in commented code in `templates/decluttering/climate/climate_overview.yaml` (line 63)

#### Include Files

6. **`kohbo_horizontal_stack_buttons_bg.yaml`**
   - Location: `includes/card_mod/base/`
   - Usage: Only in commented code in `security/security.yaml` (line 1056)

7. **`entity_button_styles.yaml`**
   - Location: `includes/card_mod/entities/`
   - Usage: Only in commented code in `rooms/main_floor/vacuum.yaml` (lines 364, 371, 378, 384)

8. **`kohbo_people_stack_mod_card_styles.yaml`**
   - Location: `includes/people/`
   - Usage: Only in commented code in `room_overview.yaml` and `room_card_occupancy.yaml`

9. **`kohbo_person_battery_icon.yaml`**
   - Location: `includes/people/`
   - Usage: Only in commented code in `templates/button_cards/people/cristina.yaml` (line 177)

10. **`kohbo_room_occupancy_icon_color.yaml`**
    - Location: `includes/rooms/`
    - Usage: Only in commented code in `room_overview.yaml` (line 413)

11. **`kohbo_room_state_icon_color.yaml`**
    - Location: `includes/rooms/`
    - Usage: Only in commented code in `room_overview.yaml` (line 402)

12. **`kohbo_room_state_icon.yaml`**
    - Location: `includes/rooms/`
    - Usage: Only in commented code in `room_overview.yaml` (line 401)

13. **`kohbo_chip_card_mod_occupancy.yaml`**
    - Location: `includes/`
    - Usage: Only in commented code in `room_overview.yaml` (line 409)

14. **`kohbo_homepage_layout.yaml`**
    - Location: `includes/layouts/`
    - Usage: Only in commented code in `kohbo/home/home.yaml` (line 6)

### Next Steps

1. Review the commented code sections to determine if they should be:
   - **Re-enabled** (if features are being worked on)
   - **Removed along with templates** (if features are abandoned)
   - **Documented** (if they're experimental/planned)

2. Decision needed on each commented-code template:
   - Security templates (alarm_action_card, security_overview_item, security_alarm_action_button) - Related to alarm panel redesign?
   - Room/occupancy templates - Related to room presence features?
   - Homepage layout - Alternative layout being considered?

---

## Decision Guide: When to Use What

### Button Card Templates vs Decluttering Cards

**Use Button Card Templates when:**
- Creating reusable UI components with state-based logic
- Need JavaScript template literals (`[[[  ]]]`) for dynamic content
- Building atomic UI elements (chips, device cards, person avatars)
- Template inheritance is needed (e.g., `kohbo_device_entity` extends `kohbo_entity`)
- The component is primarily a single card with styling variations

**Use Decluttering Cards when:**
- Composing multiple cards together into a reusable unit
- Need variable substitution for entities/config (`[[variable]]` syntax)
- Building page-level components (toolbars, popups, room overviews)
- The component includes conditional cards, stacks, or complex layouts
- Variables are primarily entity IDs or simple strings (not complex logic)

**Examples:**
| Component | Type | Why |
|-----------|------|-----|
| `kohbo_chip_card` | Button Card Template | Single card, state-based colors, JS logic |
| `kohbo_device_entity` | Button Card Template | Extends base template, dynamic state display |
| `camera_popup` | Decluttering Card | Composes bubble-card + camera + entities |
| `room_page_top_toolbar` | Decluttering Card | Composes multiple button cards |
| `climate_overview` | Decluttering Card | Combines mini-graph + AQI items |

---

## Custom Boolean Toggle Pattern

The custom boolean toggle (`kohbo_boolean_entity_layout.yaml`) creates iOS-style switches.
Used with `type: entities` card and `card_mod`:

```yaml
- type: entities
  entities:
    - entity: input_boolean.speech_notifications
      icon: kohbo:kohbo-announcement
      card_mod: !include /config/dashboards/templates/includes/kohbo_boolean_entity_layout.yaml
      secondary_info: last-changed
      state_color: true
```

**Key styling features:**
- Custom switch track (32px height, 50px width)
- Custom thumb (28px circular)
- Active color: `#59A5D8` (primary-color)
- Inactive color: `#484C51` (darker grey)
- Entity row padding adjustments

---

## Popup Pattern (Bubble Card)

Standard popup structure using bubble-card:

```yaml
- type: vertical-stack
  cards:
    # 1. Bubble card config (always first)
    - type: custom:bubble-card
      card_type: pop-up
      hash: '#popup_name'
      close_by_clicking_outside: true
      styles: !include /config/dashboards/templates/includes/kohbo_popup_styles.yaml
      margin_top_mobile: calc(100vh - 825px)
      margin_top_desktop: calc(100vh - 825px)
    
    # 2. Title (usually second)
    - type: custom:button-card
      template: kohbo_popup_page_title
      name: Popup Title
    
    # 3. Content cards...
```

**Navigation to popup:**
```yaml
tap_action:
  action: navigate
  navigation_path: '#popup_name'
```

---

## Section Titles Pattern

Use `section_title` template for consistent section headers:

```yaml
- type: custom:button-card
  template: section_title
  name: Lights
```

This provides:
- Consistent font size/weight
- Proper spacing
- Left-aligned text

---

## View/Page Structure

Standard room page structure:

```yaml
type: custom:vertical-layout
title: Room Name
path: rooms-room-name
theme: kohbo
subview: true  # For sub-pages, not main nav items
layout: !include /config/dashboards/templates/includes/layouts/kohbo_page_layout.yaml
cards:
  # 1. Top toolbar
  - type: custom:decluttering-card
    template: room_page_top_toolbar
    variables:
      - name: Room Name
      - navigation_path: /dashboard-kohbo/parent-page
      - settings_path: '#room_settings_popup'

  # 2. Room overview (occupancy, BLE presence)
  - type: custom:decluttering-card
    template: room_overview
    variables:
      - occupancy: input_boolean.room_occupied
      - mode: input_select.room
      - ble_presence: sensor.room_people_list

  # 3. Climate section (if applicable)
  - type: custom:decluttering-card
    template: climate_overview
    # ...

  # 4. Section: Lights
  - type: custom:button-card
    template: section_title
    name: Lights
  # Light cards...

  # 5. Section: Devices
  - type: custom:button-card
    template: section_title
    name: Devices
  - type: grid
    columns: 2
    square: false
    cards:
      # Device cards using kohbo_device_* templates

  # 6. Section: Quick Settings
  - type: custom:button-card
    template: section_title
    name: Quick Settings
  - type: entities
    entities:
      # Boolean toggles...

  # 7. Popups (at the end)
  - # Settings popup...
  - # Media player popup...

  # 8. Navbar (always last visible element)
  - !include /config/dashboards/templates/includes/navbar.yaml
```

---

## Device Card Templates

Available device entity templates (extend `kohbo_device_entity`):
- `kohbo_device_entity` - Generic device card
- `kohbo_device_air_purifier_entity` - Air purifier with filter info
- `kohbo_device_smart_plug_entity` - Smart plugs
- `kohbo_device_door_entity` - Door sensors
- `kohbo_device_window_entity` - Window sensors
- `kohbo_device_leak_entity` - Leak sensors
- `kohbo_device_lock_entity` - Lock devices
- `kohbo_thermostat_entity` - Climate/thermostat cards

---

## TODOs and Ideas

### Cleanup & Audit TODOs
- [ ] **Review entire dashboard for orphan files** - Audit all files/components and remove any unused or orphaned files
- [ ] **Remove `.DISABLED` files** - These are deprecated/disabled templates. Review and delete them entirely
- [ ] **Review `kohbo_` namespace** - Decide whether to keep or remove the prefix. If removing, document the migration process (find/replace, update all references, test)
- [ ] **Audit HACS custom cards** - Review installed custom cards and remove unused ones (e.g., horseshoe graph)
- [ ] **Clarify kohbo/ file organization** - Review `dashboards/kohbo/` and ensure clear distinction between:
  - Pages (main views in nav)
  - Subviews (room pages, detail pages)
  - Popups (hash-based overlays)
  - Partials/components (reusable card collections)
- [ ] **Review `utils/` folder** - Currently only contains `empty_column.yaml`. May not need a separate folder; consider moving to `shared/` or keeping flat
- [ ] **Document `visibility` conditions** - Add to rules file as a common pattern

### Documentation TODOs
- [ ] Document custom `kohbo:kohbo-*` icon set (where they live, how to add new ones)
- [ ] Document theme variables and color palette
- [ ] Add visual examples/screenshots to README
- [ ] Document the `kohbo_person_entity` and people patterns

### Organization/Migration TODOs
- [ ] Move `kohbo_energy_stat_bar.yaml`, `kohbo_energy_stat_card.yaml`, `kohbo_energy_stat_comparison.yaml` from `cards/` root to `cards/energy/`
- [ ] Consider renaming `cards/shared/` to `cards/components/` for clarity
- [ ] Audit other root-level cards for potential folder organization
- [ ] **Reorganize Security Dashboard file structure** - See "Security Dashboard File Structure" section below

### Future Improvements
- [ ] Consider creating a `room_template` that combines common room patterns
- [ ] Standardize popup heights across different popup types
- [ ] Create a button card template for tile-style light controls
- [ ] Refactor weather popup card headers to use `kohbo_card_header` template
- [ ] **Revisit mini graphs for Today's Overview stats** - Explore better visualization options (sparklines, mini gauges, or improved deviation charts) for Real Time, Price, and Forecast stat cards

---

## Security Dashboard File Structure

**Status:** 🚧 Needs reorganization

**Location:** `dashboards/kohbo/security/`

### Current Issues

The security dashboard file structure has several organizational inconsistencies:

1. **Inconsistent popup organization:**
   - Lock popups in root: `front_door_lock_popup.yaml`, `garage_entry_lock_popup.yaml`, `house_locks_popup.yaml`
   - Settings popup in `components/`: `security_settings_popup.yaml`
   - Camera popups in `cameras/` with underscore prefix: `_front_door_camera_popup.yaml`, etc.

2. **Naming inconsistency:**
   - Camera popups use underscore prefix (`_front_door_camera_popup.yaml`)
   - Lock popups don't use prefix (`front_door_lock_popup.yaml`)
   - No clear naming convention

3. **Components folder mixing concerns:**
   - Contains actual reusable components (`front_door_lock_component.yaml`, `garage_entry_door_lock_component.yaml`)
   - Also contains a popup (`security_settings_popup.yaml`) which doesn't belong with components

4. **Root level clutter:**
   - Main page (`security.yaml`) is fine
   - But 3 popup files in root should be organized

### Proposed Structure

```
security/
├── README.md                                    # Documentation
├── security.yaml                                # Main security dashboard page
├── components/                                  # Reusable components (not popups)
│   ├── front_door_lock_component.yaml
│   └── garage_entry_door_lock_component.yaml
├── popups/                                      # All popups organized by category
│   ├── locks/                                  # Lock-related popups
│   │   ├── front_door_lock_popup.yaml
│   │   ├── garage_entry_lock_popup.yaml
│   │   └── house_locks_popup.yaml
│   ├── settings/                               # Settings popups
│   │   └── security_settings_popup.yaml
│   └── cameras/                                 # Camera popups (move from cameras/)
│       ├── front_door_camera_popup.yaml
│       ├── driveway_front_camera_popup.yaml
│       ├── garage_driveway_camera_popup.yaml
│       ├── backyard_south_camera_popup.yaml
│       ├── backyard_porch_camera_popup.yaml
│       ├── backyard_pool_camera_popup.yaml
│       └── backyard_northwest_camera_popup.yaml
├── pages/                                       # Detail pages (keep as-is)
│   ├── house_locks.yaml
│   ├── garage_doors.yaml
│   ├── alarm_panel.yaml
│   ├── exterior_doors.yaml
│   ├── windows.yaml
│   └── leak_sensors.yaml
└── cameras/                                     # Camera overview page (keep)
    └── cameras.yaml                             # Main cameras page
```

### Alternative Structure (Simpler)

If subcategorizing popups feels too complex, a simpler approach:

```
security/
├── README.md
├── security.yaml
├── components/                                  # Reusable components only
│   ├── front_door_lock_component.yaml
│   └── garage_entry_door_lock_component.yaml
├── popups/                                      # All popups in one folder
│   ├── front_door_lock_popup.yaml
│   ├── garage_entry_lock_popup.yaml
│   ├── house_locks_popup.yaml
│   ├── security_settings_popup.yaml
│   ├── front_door_camera_popup.yaml
│   ├── driveway_front_camera_popup.yaml
│   ├── garage_driveway_camera_popup.yaml
│   ├── backyard_south_camera_popup.yaml
│   ├── backyard_porch_camera_popup.yaml
│   ├── backyard_pool_camera_popup.yaml
│   └── backyard_northwest_camera_popup.yaml
├── pages/                                       # Detail pages
│   └── [same as current]
└── cameras/                                     # Camera overview page
    └── cameras.yaml
```

### Benefits of Reorganization

1. **Clear separation of concerns:**
   - Components = reusable card collections
   - Popups = hash-based overlays
   - Pages = full detail views
   - Cameras = camera-specific content

2. **Consistent naming:**
   - Remove underscore prefix from camera popups (or apply consistently)
   - All popups in one location

3. **Easier maintenance:**
   - Find popups quickly
   - Clear where new files should go
   - Matches patterns from other dashboards

4. **Better scalability:**
   - Easy to add new popups without cluttering root
   - Clear organization as security features grow

### Migration Steps

1. Create `popups/` directory
2. Move lock popups from root to `popups/locks/` (or `popups/`)
3. Move `security_settings_popup.yaml` from `components/` to `popups/settings/` (or `popups/`)
4. Move camera popups from `cameras/` to `popups/cameras/` (or `popups/`)
5. Remove underscore prefix from camera popup filenames
6. Update all `!include` references to new paths
7. Update hash references if filenames changed
8. Update README.md file structure documentation

### Questions to Resolve

- Should popups be subcategorized (locks/settings/cameras) or flat?
- Should camera popups keep underscore prefix or remove it?
- Should `cameras/cameras.yaml` stay in `cameras/` or move to `pages/`?

### Notes for AI Assistant
- The `kohbo_` prefix indicates custom templates specific to this dashboard
- Templates without prefix (like `section_title`, `empty_column`) are generic
- `!include` paths use `/config/` prefix (Home Assistant container path)
- JavaScript in button cards uses `[[[  ]]]` syntax
- Decluttering uses `[[variable]]` syntax

---

## README Refactoring Plan

**Goal:** Break down the dashboard README into clear, organized sections for better documentation and onboarding.

### Proposed Structure

#### 1. Overview
- **Theme**: kohbo theme philosophy and design language
- **Philosophy**: Design principles, UX approach, user experience goals
- **Design Patterns**: Common patterns used throughout (e.g., popups, navigation, card composition)
- **UX Guidelines**: User experience decisions and rationale

**Content to include:**
- Theme color palette and usage
- Design system approach
- Accessibility considerations
- Mobile vs desktop patterns

#### 2. Architecture (Folder Structure)
- **Overview**: High-level folder organization
- **Templates/Views**: How templates and views are organized
- **File Naming Conventions**: `kohbo_` prefix, naming patterns
- **Include Patterns**: How `!include` is used, partials vs templates
- **Custom Cards**: Inventory of custom cards used and their purposes

**Content to include:**
- `dashboards/kohbo/` structure (pages, subviews, popups, partials)
- `dashboards/templates/` organization (button_cards, decluttering)
- `dashboards/templates/includes/` shared components
- Relationship between templates, views, and partials

#### 3. Primary Dashboards
- **Screenshots**: Visual examples of each primary dashboard
- **Overview**: Purpose and key features of each dashboard
- **Navigation**: How users navigate to/from each dashboard

**Dashboards to document:**
- Home dashboard
- Energy dashboard
- Security dashboard
- Climate dashboard
- (Any other primary dashboards)

**For each dashboard, include:**
- Screenshot
- Purpose/use case
- Key components/sections
- Navigation paths

#### 4. Room Structure
- **Anatomy of a Room**: Standard structure and components
- **Room Page Template**: Standard room page layout
- **Room Components**: Common components used in rooms
- **Room Patterns**: Reusable patterns (overview, climate, lights, devices, settings)

**Content to include:**
- Standard room page structure (see "View/Page Structure" section above)
- Room overview components (occupancy, BLE presence, mode)
- Climate integration in rooms
- Device organization in rooms
- Room-specific popups (settings, media player, etc.)

#### 5. Components
- **Component Library**: Comprehensive list of reusable components
- **Usage Examples**: Code examples for each component
- **Component Categories**: Organized by type/function

**Components to document:**

**Basic UI Elements:**
- Pill/Chip (`kohbo_chip_card`)
- Section Title (`section_title`)

**Climate Components:**
- Climate Overview (`climate_overview`)
- Climate Card (`kohbo_room_temperature_card`)
- Thermostat (`kohbo_thermostat_entity`)

**Device Components:**
- Device Card (`kohbo_device_entity` and variants)
- Device Card Variants (air purifier, smart plug, door, window, leak, lock)

**Room Components:**
- Room Card (room navigation cards)
- Room Overview (`room_overview`)

**Media Components:**
- Media Player
- Popup Player

**Settings Components:**
- Settings Popup
- Boolean Toggle (`kohbo_boolean_entity_layout`)

**Other Components:**
- Person Entity (`kohbo_person_entity`)
- Energy Components (stat cards, comparison cards, etc.)

**For each component, include:**
- Purpose/description
- Template name/location
- Usage example (YAML)
- Configuration options
- Visual example (screenshot if applicable)

### Implementation Notes
- Consider creating separate markdown files for each major section
- Use screenshots liberally for visual documentation
- Include code examples with proper syntax highlighting
- Cross-reference related components and patterns
- Keep examples up-to-date with current implementation

### Questions to Resolve
- Should this be one large README or multiple files?
- Where should screenshots be stored?
- How detailed should component documentation be?
- Should we include migration guides for deprecated patterns?

---

## Future Rules Considerations

Things observed during initial review that may warrant rules/documentation later:

### "shared" Folder Clarification
There are two "shared" locations with different purposes:
- `kohbo/shared/` → **View-level shared components** - Popups and views that can be embedded in multiple pages (e.g., main floor vacuum popup)
- `templates/button_cards/cards/shared/` → **Template-level generic components** - Reusable button card templates (chips, headers, etc.)

Consider renaming template-level to `components/` for clarity.

### Layout Card Guidance (To Discuss)
Current mental model:
- `type: grid` → Modifying/arranging existing components within a card
- `type: horizontal-stack` / `type: vertical-stack` → Simple, straightforward stacking
- `custom:stack-in-card` → Advanced customization, removes card wrapper, allows complex compositions
- `custom:layout-card` → Advanced grid layouts with precise control
- `custom:mod-card` → When you need to apply card_mod styles to a stack/group

**TODO:** Formalize this into rules after discussion.

### Visibility Conditions Pattern
Heavy use of `visibility:` for conditional rendering. Pattern to document:
```yaml
visibility:
  - condition: state
    entity: input_boolean.something
    state: "on"
```

### Partials Pattern
`kohbo/rooms/partials/` contains **reusable card collections** (not full views). These are `!include`d into room pages to avoid duplication.

Example: `main_floor_room_cards.yaml` contains room card definitions that can be included in multiple views.

Use partials when:
- Same cards appear in multiple views
- Cards are complex and you want single source of truth
- Not suitable as a template (too specific to certain entities)

### ⚠️ Partial File Format (IMPORTANT)

When a partial is included as a **list item** in the parent file, the partial should **NOT** start with `-`:

**Parent file (energy.yaml):**
```yaml
cards:
  - !include /config/dashboards/kohbo/energy/partials/todays_overview.yaml
```

**Partial file (todays_overview.yaml) - CORRECT:**
```yaml
# No leading dash - the parent provides the list item marker
type: custom:stack-in-card
cards:
  - type: custom:button-card
    # ...
```

**Partial file - WRONG:**
```yaml
# ❌ DON'T do this - the dash is already in the parent
- type: custom:stack-in-card
  cards:
    - type: custom:button-card
      # ...
```

**Why?** When you write `- !include path.yaml`, the `-` makes the included content a list item. If the partial also starts with `-`, you get invalid YAML (a list item containing a list item with no key).

---

## Theme Color Reference

Quick reference for kohbo theme colors:

| Variable | Hex | Usage |
|----------|-----|-------|
| `--primary-color` | `#59A5D8` | Main accent, active states |
| `--light-primary-color` | `#ADD2EB` | Info, light accent |
| `--dark-primary-color` | `#343A40` | Card backgrounds |
| `--darker-primary-color` | `#2D3339` | Secondary backgrounds |
| `--accent-color` | `#FFD166` | Warning, highlights |
| `--success-color` | `#06D6A0` | Success states |
| `--error-color` / `--red-color` | `#ED4747` | Errors, alerts |
| `--orange-color` | `#E36001` | Medium warnings |
| `--primary-text-color` | `#F8F9FA` | Main text |
| `--secondary-text-color` | `#CED4DA` | Secondary text |
| `--light-grey-color` | `#ADB5BD` | Inactive states, icons |
| `--divider-color` | `#495057` | Borders, dividers |

---

## Custom Cards Inventory

Most frequently used custom cards (by count):
1. **custom:button-card** (644) - Primary card for everything
2. **custom:decluttering-card** (244) - Template instances
3. **custom:stack-in-card** (88) - Card composition
4. **custom:bubble-card** (69) - Popups and special UI
5. **custom:template-entity-row** (43) - Custom entity rows
6. **custom:mod-card** (40) - CSS modifications
7. **custom:vertical-layout** (34) - Page layouts

Less common but important:
- **custom:mini-graph-card** - Temperature/climate graphs
- **custom:navbar-card** - Bottom navigation
- **custom:advanced-camera-card** - Camera feeds
- **custom:mushroom-chips-card** - Chip-style buttons
- **custom:apexcharts-card** - Energy/data charts

---

## mini-graph-card CSS Variables Limitation

**IMPORTANT:** `mini-graph-card` does **NOT** support CSS variables in `color_thresholds`.

**Issue:** CSS variables (e.g., `var(--success-color)`) in `color_thresholds` render as black bars in mini-graph-card v0.13.0+.

**GitHub Issue:** https://github.com/kalkih/mini-graph-card/issues/1259

**Workaround:** Use hardcoded hex values instead of CSS variables in `color_thresholds`.

**Pattern:**
```yaml
color_thresholds:
  # Use hardcoded hex values (not CSS variables)
  - color: "#06D6A0"  # var(--success-color)
    value: 100
  - color: "#FFD166"  # var(--accent-color)
    value: 500
  - color: "#E36001"  # var(--orange-color)
    value: 1000
  - color: "#ED4747"  # var(--error-color)
    value: 2000
```

**Note:** Include comments indicating the CSS variable name for reference. When the bug is fixed, we can update to use CSS variables.

**Reference theme values:** See `themes/kohbo/kohbo.yaml` for hex values that match CSS variables.
