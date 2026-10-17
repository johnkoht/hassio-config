# Holidays Dashboard

Seasonal decorations and lighting: the Halloween and Christmas season switches, the front yard decorations, the Christmas trees and playroom window lights, and the front yard Hue spots.

## Overview

The Holidays section is a tabbed group of three views (the Climate and Rooms pattern):

- **Overview** - One card per season with its season toggle and a link to the season page
- **Halloween** - Season toggle, front yard decorations, Accent Lights, Outdoor Spots and the Halloween Colors scene
- **Christmas** - Season toggle, trees, playroom window lights, front yard and the Christmas Colors scene
- **Settings Popup** - The feature-level holiday automations, shared by all three tabs

Entry point: bottom navbar → More → Holidays (`/dashboard-kohbo/holidays`). In season, Home → Overview also shows a tile for the active season.

## File Structure

```
holidays/
├── README.md                        # This file
├── holidays.yaml                    # Overview tab (path: holidays)
├── halloween.yaml                   # Halloween tab (path: holidays-halloween)
├── christmas.yaml                   # Christmas tab (path: holidays-christmas)
└── _holidays_settings_popup.yaml    # Shared settings popup (#holidays_settings_popup)
```

The header and tabs live in `templates/includes/holidays/holiday_header.yaml`. All three views use `kohbo_page_layout_tabbed_nav.yaml` and `subview: true`.

## Page Structure

### Overview

Two `horizontal_action_card`s (Halloween, Christmas), each with a `card_boolean_component` season toggle and a `kohbo_chip_icon_action_card` chevron. Tapping the card or the chevron opens the season page.

### Halloween

1. **Season** - `input_boolean.halloween_season_active`
2. **Front Yard Decorations** - `switch.front_yard_holiday_decorations` group toggle, then a 2-column grid of its 4 outlets (Front Door 1/2, Front Left 1/2)
3. **Front Yard Spots** - the Accent Lights boolean, the Outdoor Spots `hue-like-light-card` (14 spots) and a Halloween Colors tile that applies `scene.halloween_front_yard_spots`

### Christmas

1. **All Christmas Lights** - `switch.christmas_lights`, shown only while `input_boolean.christmas_season_active` is on (see caveat below)
2. **Season** - `input_boolean.christmas_season_active`
3. **Trees** - `switch.christmas_trees` group toggle, then Main Tree and Small Tree plug tiles with wattage
4. **Playroom** - `switch.christmas_playroom_lights` group toggle, then Window Lights 1, 2 & 3, 4 and 5
5. **Front Yard** - `switch.front_yard_holiday_decorations`, the Accent Lights boolean, the Outdoor Spots card and a Christmas Colors tile that applies the Hue app scene `scene.front_yard_christmas` (spots 1-10 only)

### Settings Popup

| Section | Automation | Row name |
|---|---|---|
| Halloween | `automation.halloween_lights_turn_on` | Decorations On in the Morning |
| Halloween | `automation.halloween_lights_turn_off` | Decorations Off at Night |
| Halloween | `automation.halloween_front_yard_hue_scene` | Halloween Colors on the Spots |
| Christmas | `automation.christmas_activated` | Lights On in the Evening |
| Christmas | `automation.christmas_not_activated` | Lights Off at Bedtime or Away |

Plumbing automations (`turn_on/off_christmas_lights`, `activate_christmas_season`, the manual enable/disable pair) and `christmas_enabled` / `christmas_disabled` (`initial_state: false`, so a toggle would be reset on every restart) are left out on purpose.

## Key Entities

| Entity | Purpose |
|---|---|
| `input_boolean.halloween_season_active` | Halloween season switch |
| `input_boolean.christmas_season_active` | Christmas season switch; turning it on/off enables/disables the nightly Christmas automations |
| `input_boolean.christmas_active` | Nightly "Christmas lights are on now" flag, set at dusk and cleared at bedtime/away. Plumbing; not on the page |
| `switch.front_yard_holiday_decorations` | Group of the 4 front yard Z-Wave outlets (Halloween inflatables or Christmas decorations) |
| `switch.christmas_trees` | Group of the two tree plugs |
| `switch.christmas_playroom_lights` | Group of the four playroom window plugs |
| `switch.christmas_lights` | Master group: trees + playroom + front yard decorations |
| `input_boolean.exterior_accent_lights` | Feature switch for the Hue spots (driven by `outdoor_lighting.yaml`) |

## Caveats

- **The Christmas master group includes the front yard plugs**, so `switch.christmas_lights` reads On during Halloween and turning it off would turn off the Halloween decorations. The page hides "All Christmas Lights" out of season until the group is fixed in the package.
- **The Outdoor Spots card bypasses the Accent Lights boolean.** Spots switched on from the card aren't turned off by the bedtime automation, which acts on `input_boolean.exterior_accent_lights`. Use the Accent Lights row above the card as the main control.
- **The Hue power plugs are never on this dashboard.** The two front-left Hue power switches feed the spots and must stay on.
- **An unavailable plug reads "Off"** in `kohbo_device_smart_plug_entity` (Window Lights 5 today).

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md)
