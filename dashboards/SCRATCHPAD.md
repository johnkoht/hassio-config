# Dashboard Development Scratchpad

> This is a working document for capturing nuances, patterns, and ideas during dashboard development. 
> Items here may eventually be promoted to the README or rules file.

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

### Future Improvements
- [ ] Consider creating a `room_template` that combines common room patterns
- [ ] Standardize popup heights across different popup types
- [ ] Create a button card template for tile-style light controls

### Notes for AI Assistant
- The `kohbo_` prefix indicates custom templates specific to this dashboard
- Templates without prefix (like `section_title`, `empty_column`) are generic
- `!include` paths use `/config/` prefix (Home Assistant container path)
- JavaScript in button cards uses `[[[  ]]]` syntax
- Decluttering uses `[[variable]]` syntax

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
