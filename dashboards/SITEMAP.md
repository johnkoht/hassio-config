# Dashboard Sitemap / Page Map

> Complete navigation structure of the Kohbo Home Assistant dashboard

## Main Dashboard Views

The dashboard is organized into the following main sections:

### 🏠 Home
- **Home** (`home/home.yaml`)
  - Main dashboard landing page
  - Popups:
    - Front Door Camera Notification
    - Driveway Front Camera Notification
    - Vacuum Active Notification
    - House Mode Popup

### 🌡️ Climate
- **Climate** (`climate/climate.yaml`)
  - Climate control overview
  - Popups:
    - Main Floor Thermostat Popup
    - Upper Floor Thermostat Popup
    - Weather Popup

### 🔒 Security

#### Security Overview
- **Security** (`security/security.yaml`)
  - Main security dashboard

#### Security Pages
- **House Locks** (`security/pages/house_locks.yaml`)
- **Garage Doors** (`security/pages/garage_doors.yaml`)
- **Alarm Panel** (`security/pages/alarm_panel.yaml`)
- **Exterior Doors** (`security/pages/exterior_doors.yaml`)
- **Windows** (`security/pages/windows.yaml`)
- **Leak Sensors** (`security/pages/leak_sensors.yaml`)

#### Security Cameras
- **Cameras** (`security/cameras/cameras.yaml`)
  - Camera overview page
  - Individual Camera Popups:
    - Front Door Camera
    - Driveway Front Camera
    - Garage Driveway Camera
    - Backyard Pool Camera
    - Backyard Porch Camera
    - Backyard South Camera
    - Backyard Northwest Camera

#### Security Components
- Front Door Lock Component
- Garage Entry Door Lock Component
- Security Settings Popup
- House Locks Popup
- Garage Entry Lock Popup

### 🏡 Rooms

#### Room Overviews
- **Active Rooms** (`rooms/active_rooms.yaml`)
  - Shows currently occupied/active rooms

#### Main Floor
- **Main Floor Index** (`rooms/main_floor/main_floor_index.yaml`)
  - Main floor overview
- **Family Room** (`rooms/main_floor/family_room.yaml`)
- **Kitchen** (`rooms/main_floor/kitchen.yaml`)
- **Playroom** (`rooms/main_floor/playroom.yaml`)
- **Office** (`rooms/main_floor/office.yaml`)
- **Jr Suite** (`rooms/main_floor/jr_suite.yaml`)
- **Dining Room** (`rooms/main_floor/dining_room.yaml`)
- **Foyer** (`rooms/main_floor/foyer.yaml`)
- **Mudroom** (`rooms/main_floor/mudroom.yaml`)
- **Mudroom Bathroom** (`rooms/main_floor/mudroom_bathroom.yaml`)
- **Powder Room** (`rooms/main_floor/powder_room.yaml`)
- **Vacuum** (`rooms/main_floor/vacuum.yaml`)
  - Main floor vacuum control

#### Upper Floor
- **Upper Floor Index** (`rooms/upper_floor/upper_floor_index.yaml`)
  - Upper floor overview
- **Main Bedroom** (`rooms/upper_floor/main_bedroom.yaml`)
- **Main Bathroom** (`rooms/upper_floor/main_bathroom.yaml`)
- **Nino's Bedroom** (`rooms/upper_floor/ninos_bedroom.yaml`)
- **Gianluca's Bedroom** (`rooms/upper_floor/gianlucas_bedroom.yaml`)
- **Upstairs Hallway** (`rooms/upper_floor/upstairs_hallway.yaml`)

#### Laundry
- **Laundry** (`rooms/laundry/laundry.yaml`)

#### Media Players
- **Office Media Player** (`rooms/media_players/office_media_player.yaml`)

### 💡 Lighting & More

#### Exterior
- **Exterior Lighting** (`more/exterior_lighting.yaml`)

#### Interior
- **Interior Lights** (`more/interior_lights.yaml`)

#### People
- **People** (`more/people.yaml`)
  - People tracking and presence

### ⚡ Energy
- **Energy** (`energy/energy.yaml`)
  - Energy monitoring dashboard
  - Popups:
    - Today's Overview
    - Energy History
    - Settings Popup

### 🎉 Holidays

#### Holidays Overview
- **Holidays** (`holidays/holidays.yaml`)
  - Holiday dashboard overview

#### Specific Holidays
- **Christmas** (`holidays/christmas.yaml`)
- **Halloween** (`holidays/halloween.yaml`)

### 🔧 Shared Components

#### Shared Popups
- **Main Floor Vacuum Popup** (`shared/main_floor_vacuum_popup.yaml`)
- **Kohbo Notification Popup** (`shared/kohbo_notification_popup.yaml`)
- **People** (`shared/people.yaml`)

#### Shared Notifications
- Air Purifier Filter Change Notifications:
  - Gianluca's Air Purifier
  - Jr Suite Air Purifier
  - Kitchen Air Purifier
  - Main Bedroom Air Purifier
  - Nino's Air Purifier
  - Office Air Purifier
- Laundry Notifications:
  - Main Level Dryer Complete
  - Main Level Washer Complete
  - Upstairs Washer Complete
- Vacuum Notifications:
  - Main Level Vacuum Error
  - Main Level Vacuum Filter Life
  - Main Level Vacuum Sensors Dirty
  - Main Level Vacuum Water Shortage
- Other Notifications:
  - Garbage Day
  - Leak Sensor Offline
  - Nino Medication Reminder

---

## Navigation Hierarchy

```
kohbo Dashboard
│
├── 🏠 Home
│   └── [Notifications & Popups]
│
├── 🌡️ Climate
│   └── [Thermostat & Weather Popups]
│
├── 🔒 Security
│   ├── Security Overview
│   ├── House Locks
│   ├── Garage Doors
│   ├── Alarm Panel
│   ├── Exterior Doors
│   ├── Windows
│   ├── Leak Sensors
│   └── Cameras
│       └── [Individual Camera Popups]
│
├── 🏡 Rooms
│   ├── Active Rooms
│   │
│   ├── Main Floor
│   │   ├── Main Floor Index
│   │   ├── Family Room
│   │   ├── Kitchen
│   │   ├── Playroom
│   │   ├── Office
│   │   ├── Jr Suite
│   │   ├── Dining Room
│   │   ├── Foyer
│   │   ├── Mudroom
│   │   ├── Mudroom Bathroom
│   │   ├── Powder Room
│   │   └── Vacuum
│   │
│   ├── Upper Floor
│   │   ├── Upper Floor Index
│   │   ├── Main Bedroom
│   │   ├── Main Bathroom
│   │   ├── Nino's Bedroom
│   │   ├── Gianluca's Bedroom
│   │   └── Upstairs Hallway
│   │
│   ├── Laundry
│   └── Media Players
│       └── Office Media Player
│
├── 💡 More
│   ├── Exterior Lighting
│   ├── Interior Lights
│   └── People
│
├── ⚡ Energy
│   └── [Energy Monitoring & Popups]
│
└── 🎉 Holidays
    ├── Holidays Overview
    ├── Christmas
    └── Halloween
```

---

## File Structure Reference

```
dashboards/kohbo/
├── kohbo.yaml                    # Main dashboard entry point
│
├── home/
│   ├── home.yaml
│   └── [notification popups]
│
├── climate/
│   ├── climate.yaml
│   └── [thermostat & weather popups]
│
├── security/
│   ├── security.yaml
│   ├── cameras/
│   │   ├── cameras.yaml
│   │   └── [camera popups]
│   ├── pages/
│   │   └── [security pages]
│   └── components/
│       └── [security components]
│
├── rooms/
│   ├── active_rooms.yaml
│   ├── main_floor/
│   │   ├── main_floor_index.yaml
│   │   ├── [room pages]
│   │   └── partials/
│   │       └── [room card components]
│   ├── upper_floor/
│   │   ├── upper_floor_index.yaml
│   │   ├── [room pages]
│   │   └── partials/
│   │       └── [room card components]
│   ├── laundry/
│   │   └── laundry.yaml
│   ├── media_players/
│   │   └── [media player pages]
│   └── partials/
│       └── [shared room card components]
│
├── more/
│   ├── exterior_lighting.yaml
│   ├── interior_lights.yaml
│   └── people.yaml
│
├── energy/
│   ├── energy.yaml
│   └── partials/
│       └── [energy popups]
│
├── holidays/
│   ├── holidays.yaml
│   ├── christmas.yaml
│   └── halloween.yaml
│
└── shared/
    ├── [shared popups]
    └── notifications/
        └── [notification components]
```

---

## Notes

- **Popups**: Many pages have associated popup views (indicated by `_` prefix or `_popup` suffix)
- **Partials**: Reusable card components are stored in `partials/` directories
- **Templates**: Shared templates and styles are in `dashboards/templates/`
- **Disabled Views**: Some views are commented out in `kohbo.yaml` (e.g., `rooms.yaml`, `media.yaml`, `devices.yaml`)
- **Lower Floor**: Lower floor rooms are commented out but structure exists for future use

---

*Last updated: October 16, 2026*
