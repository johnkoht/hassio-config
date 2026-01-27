# Dashboard Documentation Plan

## Recommended Structure

### Option 1: Distributed READMEs (Recommended ✅)

**Structure:**
```
dashboards/
├── README.md                    # Main overview, philosophy, quick start, links
├── SITEMAP.md                   # Navigation map (already created)
│
├── kohbo/
│   ├── home/
│   │   ├── README.md            # Home dashboard docs
│   │   └── home.yaml
│   │
│   ├── rooms/
│   │   ├── README.md            # Rooms overview, room cards, tabs
│   │   ├── main_floor/
│   │   │   └── office.yaml      # Individual room (no README needed)
│   │   └── upper_floor/
│   │
│   ├── climate/
│   │   ├── README.md            # Climate dashboard docs
│   │   └── climate.yaml
│   │
│   ├── security/
│   │   ├── README.md            # Security overview + sub-pages
│   │   └── pages/
│   │
│   ├── energy/
│   │   ├── README.md            # ✅ Already exists, great example!
│   │   └── energy.yaml
│   │
│   └── more/
│       ├── README.md            # People dashboard docs
│       └── people.yaml
│
└── templates/
    └── README.md                # Components documentation
```

**Pros:**
- ✅ Docs live next to code (easier to maintain)
- ✅ Follows pattern already established (energy/README.md)
- ✅ Easy to find relevant docs
- ✅ Can be more detailed without bloating main README
- ✅ Each section owner can maintain their own docs

**Cons:**
- ⚠️ Need to navigate multiple files
- ⚠️ Main README needs good linking

---

### Option 2: Centralized Docs Folder

**Structure:**
```
dashboards/
├── README.md                    # Main overview + links
├── docs/
│   ├── home.md
│   ├── rooms.md
│   ├── room-details.md
│   ├── climate.md
│   ├── security.md
│   ├── energy.md
│   ├── people.md
│   └── components.md
└── kohbo/
    └── [dashboard files]
```

**Pros:**
- ✅ All docs in one place
- ✅ Easy to browse all documentation

**Cons:**
- ⚠️ Docs separated from code
- ⚠️ Harder to maintain (need to remember to update)
- ⚠️ Doesn't match existing pattern (energy/README.md)

---

## Recommendation: **Option 1 (Distributed READMEs)**

Use distributed READMEs because:
1. **Already established pattern** - Energy dashboard already uses this
2. **Better maintainability** - Docs live with code
3. **Easier discovery** - When working on a section, docs are right there
4. **Scalability** - Each section can grow without bloating main README

---

## Documentation Outline

### 1. Main README (`dashboards/README.md`)

**Sections:**
- **Overview**
  - What is the Kohbo dashboard system
  - Philosophy & design principles
  - Screenshots (2-3 key screenshots)
  - Theme overview (link to theme details)
  
- **Quick Start**
  - Prerequisites (custom cards, theme)
  - Basic setup
  - Adding a room
  
- **Dashboard Sections** (with links)
  - 🏠 [Home](./kohbo/home/README.md)
  - 🏡 [Rooms](./kohbo/rooms/README.md)
  - 🌡️ [Climate](./kohbo/climate/README.md)
  - 🔒 [Security](./kohbo/security/README.md)
  - ⚡ [Energy](./kohbo/energy/README.md)
  - 👥 [People](./kohbo/more/PEOPLE_README.md)
  - 🎉 [Holidays](./kohbo/holidays/README.md)
  
- **Components**
  - Link to [Components Documentation](./templates/README.md)
  - Quick reference table
  
- **Resources**
  - [Sitemap](./SITEMAP.md)
  - [Development Notes](./SCRATCHPAD.md)
  - Custom cards required
  - Theme reference

---

### 2. Home Dashboard (`kohbo/home/README.md`) ✅ COMPLETE

**Sections:**
- **Overview**
  - Purpose: Main landing page, quick access to key controls
  - Screenshots (full page + key sections)
  
- **Features**
  - Quick actions
  - Room status overview
  - Notifications
  - Camera feeds
  - House mode controls
  
- **Components Used**
  - Room cards
  - Camera cards
  - Notification popups
  - Mode selectors
  
- **Example YAML**
  - Link to `home.yaml`
  - Key snippets

---

### 3. Rooms Dashboard (`kohbo/rooms/README.md`) ✅ COMPLETE

**Sections:**
- **Overview**
  - Purpose: Room-by-room control and monitoring
  - Screenshots (index page, room detail page)
  
- **Structure**
  - Active Rooms view
  - Floor indexes (Main Floor, Upper Floor)
  - Individual room pages
  
- **Room Cards**
  - How room cards work
  - Occupancy detection
  - Quick actions
  - Screenshot examples
  
- **Room Detail Pages**
  - Standard layout
  - Toolbar (back button, settings)
  - Room overview section
  - Climate overview
  - Device sections
  - Example: [Office](./main_floor/office.yaml)
  
- **Components Used**
  - `room_card` decluttering template
  - `room_overview` decluttering template
  - `room_page_top_toolbar` decluttering template
  - Device button card templates
  
- **Adding a New Room**
  - Step-by-step guide
  - Template code
  - Required entities

---

### 4. Climate Dashboard (`kohbo/climate/README.md`) ✅ COMPLETE

**Sections:**
- **Overview**
  - Purpose: Climate control and monitoring
  - Screenshots
  
- **Features**
  - Thermostat controls
  - Temperature graphs
  - AQI monitoring
  - Weather integration
  
- **Components Used**
  - `climate_overview` decluttering template
  - `thermostat_popup` decluttering template
  - Thermostat button card templates
  
- **Example YAML**
  - Link to `climate.yaml`

---

### 5. Security Dashboard (`kohbo/security/README.md`) ✅ COMPLETE

**Sections:**
- **Overview**
  - Purpose: Security monitoring and control
  - Screenshots (main page, sub-pages, cameras)
  
- **Main Security Page**
  - Overview cards
  - Security score gauge (with link to sensor definition)
  - Quick status items
  - Motion detections
  
- **Sub-Pages**
  - [House Locks](./pages/house_locks.yaml)
  - [Garage Doors](./pages/garage_doors.yaml)
  - [Alarm Panel](./pages/alarm_panel.yaml)
  - [Exterior Doors](./pages/exterior_doors.yaml)
  - [Windows](./pages/windows.yaml)
  - [Leak Sensors](./pages/leak_sensors.yaml)
  
- **Cameras**
  - Camera overview
  - Individual camera popups
  - Camera card component
  
- **Components Used**
  - `camera_card` decluttering template
  - `camera_popup` decluttering template
  - Security device button cards
  
- **Example YAML**
  - Links to key files

---

### 6. People Dashboard (`kohbo/more/PEOPLE_README.md`) ✅ COMPLETE

**Sections:**
- **Overview**
  - Purpose: People tracking and presence
  - Screenshots (popup screenshot placeholder)
  
- **Features**
  - Person cards (family section)
  - Person entity rows (extended family, guests)
  - Presence indicators
  - Location tracking
  - Person popups structure
  
- **Components Used**
  - Person button card templates
  - People-specific components
  - Person popup structure
  
- **Example YAML**
  - Person card example
  - Entity row example
  - Overview chip example

---

### 7. Components Documentation (`templates/README.md`)

**Structure:**
- **Overview**
  - Component architecture
  - Button cards vs Decluttering cards
  - Template system
  
- **Button Card Templates**
  - Base Templates
    - `kohbo_default`
    - `kohbo_entity`
  - Device Templates
    - `kohbo_device_entity`
    - `kohbo_device_door_entity`
    - `kohbo_device_window_entity`
    - `kohbo_device_lock_entity`
    - `kohbo_device_leak_entity`
    - `kohbo_device_smart_plug_entity`
    - `kohbo_device_air_purifier_entity`
    - `kohbo_thermostat_entity`
  - UI Components
    - `kohbo_chip_card`
    - `kohbo_header_chip_card`
    - `kohbo_header_page_title`
    - `kohbo_popup_page_title`
    - `section_title`
  - Room Components
    - `kohbo_room_card_device`
    - `occupied_room_card`
  - People Components
    - `kohbo_person_entity`
    - `kohbo_person_card`
  
- **Decluttering Templates**
  - Layout Templates
    - `room_page_top_toolbar`
    - `top_toolbar`
  - Room Templates
    - `room_card` (composition of button cards)
    - `room_overview` (composition)
    - `room_header`
  - Climate Templates
    - `climate_overview` (composition)
    - `thermostat_popup` (composition)
  - Security Templates
    - `camera_card` (composition)
    - `camera_popup` (composition)
  - Energy Templates
    - `kohbo_device_energy_card`
  
- **For Each Component:**
  - Purpose/description
  - Variables/parameters
  - Example usage
  - YAML snippet
  - Where it's used

---

## Screenshot Strategy

**Where to store screenshots:**
```
dashboards/
├── assets/
│   ├── screenshots/
│   │   ├── home/
│   │   │   ├── home-full.png
│   │   │   └── home-sections.png
│   │   ├── rooms/
│   │   │   ├── rooms-index.png
│   │   │   ├── room-card.png
│   │   │   └── room-detail.png
│   │   ├── climate/
│   │   ├── security/
│   │   └── ...
```

**Screenshots needed:**
- Home: Full page, key sections
- Rooms: Index page, room card close-up, room detail page
- Climate: Main page, thermostat popup
- Security: Main page, sub-page example, camera popup
- Energy: Main page (already have energy-dashboard.jpg)
- People: Main page

---

## Implementation Priority

1. **Phase 1: Main README** (foundation)
   - Overview, philosophy, screenshots
   - Links structure
   - Quick start

2. **Phase 2: Section READMEs** (in order of complexity/importance)
   - ✅ Energy (already done, use as template)
   - ✅ Rooms (most complex, most used)
   - ✅ Home (entry point)
   - ✅ Security (many sub-pages)
   - ✅ Climate
   - ✅ People

3. **Phase 3: Components Documentation**
   - Button card templates
   - Decluttering templates
   - Usage examples

---

## Questions to Consider

1. **Screenshots**: Do you have screenshots ready, or should we add placeholders?
2. **Detail level**: How technical should each README be? (User-focused vs developer-focused)
3. **Examples**: Should we include full YAML examples or just snippets?
4. **Maintenance**: Who will maintain these? (affects how detailed we make them)

---

## Next Steps

1. ✅ Review this plan
2. ✅ Decide on structure (Option 1 - Distributed READMEs)
3. ✅ Create section READMEs:
   - ✅ Home Dashboard
   - ✅ Rooms Dashboard
   - ✅ Climate Dashboard
   - ✅ Security Dashboard
   - ✅ People Dashboard
4. ⏳ **Next: Main README** - Create main overview and navigation hub
   - Overview and philosophy
   - Quick start guide
   - Links to all section READMEs
   - Screenshots and theme overview
5. ⏳ Components Documentation - Document all templates and components
   - Button card templates
   - Decluttering templates
   - Usage examples
