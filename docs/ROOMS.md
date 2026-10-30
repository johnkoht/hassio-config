# Rooms

[Back to main README](../README.md)

This document explains how rooms work in my Home Assistant configuration.

## Overview

Every room in my smart home is treated as an independent unit with its own state machine. Rooms have:
- An `input_select` that manages the current **mode** (Auto, Off, etc.)
- An `input_boolean` that tracks **occupancy**
- Automations that respond to mode and occupancy changes

This approach allows for granular control and avoids complex, monolithic automations.

---

## Room Modes

| Mode | Description |
|------|-------------|
| **Auto** | Automations are fully enabled. Motion triggers occupancy, lights respond to brightness, etc. |
| **Off** | No automations run. The room behaves like a "dumb" room with manual control only. |
| **Away** | Room/house is unoccupied. Lights off, media off, climate adjusted. Used by common areas. |
| **Bedtime** | Sleep mode with reduced lighting, no TTS, quiet automations. Used by bedrooms. |
| **Wake** | Morning transition with gradual lighting increase. Used by main bedroom. |
| **DnD** | Do Not Disturb. Disables TTS, shows busy indicator, pauses non-essential automations. Used by the Office. |

---

## Room Occupancy

Each room has an `input_boolean.{room}_occupied` that indicates whether someone is currently in the room. Occupancy is the key driver for most automations.

### What Triggers Occupancy

Rooms become occupied when any of these are detected:

- **Motion sensors** - Primary trigger for most rooms
- **Presence sensors** - mmWave/PIR sensors that detect stationary presence
- **BLE room presence** - Bermuda tracking phones/watches
- **Door sensors** - Door closed often means occupied (bedrooms)
- **Bed sensors** - FSR sensors detect bed occupancy
- **Lights on** - Manual light activation implies presence
- **Media playing** - TV or speakers active

### What Happens When Occupied

- Lights turn on if it's dark (below illuminance threshold)
- Music can auto-play based on conditions
- TTS announcements route to this room
- Room appears in "Active Rooms" dashboard

### What Happens When Unoccupied

- Lights turn off (after a short delay)
- Music stops
- Room disappears from "Active Rooms" dashboard

---

## Anatomy of a Room: The Office

The Office is the most advanced room in my house (mostly because nobody complains when I experiment). It demonstrates the full lifecycle of a smart room.

### The Setup

| Entity | Purpose |
|--------|---------|
| `input_select.office` | Mode: Auto, Off, DnD |
| `input_boolean.office_occupied` | Is someone in the office? |
| `binary_sensor.office_aqara_motion_sensor` | Motion detection |
| `binary_sensor.office_presence` | Bayesian presence (combines multiple signals) |

### A Day in the Life

**Morning - The Office Wakes Up**

I walk into the office. The motion sensor triggers, and `input_boolean.office_occupied` turns on. The room is in **Auto** mode, so automations kick in:

- It's still a bit dark → ceiling lights turn on
- The Office detects John is present and working → music starts playing softly
- Adaptive lighting adjusts color temperature for morning focus

**A Call Comes In**

My calendar shows a meeting starting. My laptop camera turns on. The Office detects I'm on a call and transitions to **DnD** mode:

- Music stops immediately
- A red light turns on outside the office door → family knows not to interrupt
- TTS notifications are disabled → no "John, dinner's ready!" mid-presentation
- The El Gato camera light turns on (synced with my laptop camera)

**Back to Work**

The call ends. My laptop camera turns off. The Office transitions back to **Auto** mode:

- The red light outside turns off
- Music resumes
- TTS notifications are re-enabled

**Lunch Break**

I leave for lunch. After a few minutes with no motion or presence detected, `input_boolean.office_occupied` turns off:

- Lights turn off
- Music stops
- The room waits patiently for my return

**Back Again**

Motion detected. Occupied again. The cycle continues.

### The Office Automations

Here's what's happening behind the scenes:

| Automation | Trigger | Action |
|------------|---------|--------|
| Office occupied | Motion, presence, lights on | Turn on `input_boolean.office_occupied` |
| Office not occupied | No motion/presence for 3 min | Turn off `input_boolean.office_occupied` |
| Lights on when dark | Occupied + illuminance < 150 lux | Turn on ceiling lights |
| Music auto-play | Occupied + John present + working hours | Start music playback |
| Enter DnD | Camera on + calendar active | Change mode to DnD |
| Exit DnD | Camera off | Change mode to Auto |
| DnD indicator | DnD mode active | Turn on red light outside |
| Disable TTS | DnD mode active | Block TTS to office speakers |
| Call lighting | Camera or audio call, AL warmer or dimmer than the setting | Pause AL, hold ceiling bulbs at the set colour/brightness (see `packages/office/README.md`) |

### File Structure

```
packages/office/
├── office_state.yaml              # input_select with modes
├── office_occupancy.yaml          # input_boolean for occupancy
├── modes/
│   ├── office_occupied.yaml       # Triggers occupancy on
│   ├── office_not_occupied.yaml   # Triggers occupancy off
│   ├── office_mode_auto.yaml      # Auto mode behaviors
│   ├── office_mode_dnd.yaml       # DnD mode behaviors
│   └── office_mode_off.yaml       # Off mode behaviors
├── lights/
│   ├── office_lights_on.yaml      # Turn on when dark + occupied
│   └── office_lights_off.yaml     # Turn off when unoccupied
└── media/
    └── office_music_on.yaml       # Auto-play music logic
```

---

## Customization Patterns

### Room-Specific Booleans

Some rooms have additional `input_boolean` entities for granular control:

| Boolean | Purpose |
|---------|---------|
| `input_boolean.{room}_occupied` | Track occupancy state |
| `input_boolean.{room}_lighting_automations` | Enable/disable lighting automations (hand-only in migrated rooms: no `initial:`, nothing writes it) |
| `input_boolean.{room}_lights_manually_toggled` | Manual override latch: set by a hand change, cleared on vacancy, Off or house empty |

Migrated rooms use two flags: the hand-only room flag says whether automation may run at all, and the latch says someone took over the lights. Motion/day-on automations require the flag on and the latch off. The latch is cleared by a reset automation (room unoccupied 30 s, room goes Off, house empties), and the room going Off turns the lights off whatever either room flag says (the house-wide switch still applies).

The model is in place in every room that needs it. Every room with lighting automations uses it (main bedroom, kitchen, garage, playroom, upstairs hallway, office, main bathroom, laundry, mudroom). The mudroom has no Off option, so Away plays that role and its hand flag is `mudroom_lighting_automations`. Rooms with a mode but no enabled lighting automations (including the family room) have no flags: their `mode_off` just forces occupancy off (the office keeps its own rule, see its LEARNINGS). The dashboard shows a tap-to-clear Manual Override row under each Lighting Automations toggle.

### Linking to House State

Room modes respond to house-level changes:

- When `input_boolean.house_occupied` turns off → Rooms transition to Away
- When everyone is sleeping → Bedrooms transition to Bedtime
- When the house is **Quiet** (kids asleep or napping, e.g. bedtime has ended but someone is still in bed) → common rooms treat it like **Auto**; room Auto automations accept both. Any new room-mode logic must not require the house to be exactly Auto.
- When the house comes back from Away with a kid still in bed → that kid's bedroom returns to Bedtime
- When `input_boolean.guest_mode` is on → Some automations are modified

---

## Small Bathrooms

The powder room and mudroom bathroom have no climate sensors and simpler state machines than the Office.

| Room | Occupied when | Empty when | When empty |
|------|---------------|------------|------------|
| Mudroom Bathroom | Motion, or the light turns on | No motion for a few minutes after the door opens, or the Aqara occupancy sensor clears | Light off; fan off after 5 min |
| Powder Room | The light turns on, or the door closes (no motion sensor) | The light has been off for 5 min, or the door is open with the light off | Light off; fan off after 5 min |

Both rooms going to **Off** mode also turn the light and fan off. Their automations carry no `initial_state`, so the dashboard toggles survive a restart. While the powder room's door sensor is offline, its occupancy follows the light alone. See `packages/powder_room/` and `packages/mudroom_bathroom/`.

---

## Dashboard

![Room Details](../dashboards/kohbo/assets/room-details.jpg)

The Kohbo dashboard provides full visibility and control over room states. Each room has a detail page with climate, lights, music, devices, and quick settings.

A room shows up in Home → Occupied Rooms through its `sensor.{room}_room` template sensor (`packages/house/areas/`), listed in `group.room_sensors`. Every page and route is in the [sitemap](../dashboards/SITEMAP.md).

See [Dashboard Documentation](../dashboards/README.md) for details.
