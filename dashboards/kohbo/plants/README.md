# Plants Dashboard

Soil moisture for the 3 indoor plants (Third Reality sensors on ZHA) and the 12 outdoor Ecowitt WH51 channels on the GW1200B gateway, plus a Lawn vs Rain chart.

## Overview

The Plants section is a tabbed group of two views (the Climate and Holidays pattern):

- **Indoor** - One card per plant: a 7-day moisture graph and a Moisture / Temperature / Battery row
- **Outdoor** - One 7-day moisture graph per zone, grouped Lawn / Front Flower Beds / Backyard Flower Beds, then the Lawn vs Rain chart (JK-1152)

Entry point: bottom navbar → More → Plants (`/dashboard-kohbo/plants`). There's no settings popup: no automations act on these sensors.

## File Structure

```
plants/
├── README.md       # This file
├── indoor.yaml     # Indoor tab (path: plants)
└── outdoor.yaml    # Outdoor tab (path: plants-outdoor)
```

Shared templates:

```
templates/
├── includes/plants/plants_header.yaml                          # Title + Indoor / Outdoor tabs
├── includes/card_mod/apexcharts/kohbo_apexcharts_transparent.yaml  # Lawn vs Rain chart styling
├── decluttering/plants/plant_overview.yaml                     # Indoor plant card
├── decluttering/plants/soil_moisture_card.yaml                 # Outdoor zone card
├── button_cards/cards/plants/kohbo_plant_moisture_item.yaml    # Indoor status row items
├── button_cards/cards/plants/kohbo_plant_temperature_item.yaml
├── button_cards/cards/plants/kohbo_plant_battery_item.yaml
└── button_cards/cards/devices/kohbo_device_soil_offline_entity.yaml  # Offline / No reading tile
```

Both views use `kohbo_page_layout_tabbed_nav.yaml` and `subview: true`.

## Thresholds

| Where | Red | Yellow | Green | Source |
|---|---|---|---|---|
| Indoor moisture (graph + Moisture item) | < 10% | 10-20% | ≥ 20% | Morning briefing (`packages/reminders/morning_update.yaml`): < 10 "needs water today", < 20 "getting dry" |
| Outdoor moisture (`soil_moisture_card` defaults `value_1..3`) | < 40% | 40-70% | ≥ 70% | The old `ui_test` gauge |
| Indoor temperature | Poor otherwise | 50-60 / 85-90 °F | 60-85 °F | Plan default |
| Indoor battery | < 15% | 15-30% | ≥ 30% | Plan default |

The status dots reuse the AQI images (good / moderate / unhealthy). Pass `value_1..3` to one `soil_moisture_card` to override a single zone.

## Offline Swap

Each card is a `vertical-stack` of two children with complementary `visibility`:

- **Graph**: `numeric_state` `above: 0`
- **Offline tile**: `condition: not` around that same `numeric_state`, so `unavailable`, `unknown`, `0` and negatives all show the tile

The tile reads "Offline" when the sensor is `unavailable` / `unknown` and "No reading" when it's stuck at `0`, plus the age of the last change. A WH51 that stops reporting holds its last value (usually `0`) instead of going unavailable. When a sensor is fixed, its graph comes back with no edit.

## Outdoor Zones

| Section | Name | Entity |
|---|---|---|
| Lawn | Front Lawn | `sensor.ch4_front_lawn_soil_moisture` |
| Lawn | Backyard North Corner | `sensor.ch4_backyard_north_corner_soil_moisture` (channel 5) |
| Lawn | Swingset | `sensor.ch7_backyard_swingset_soil_moisture` |
| Lawn | Behind Pool | `sensor.ch8_backyard_east_soil_moisture` |
| Lawn | South Fence | `sensor.ch9_backyard_south_fence_soil_moisture` |
| Front Flower Beds | Round Bed | `sensor.ch1_round_flower_bed_soil_moisture` |
| Front Flower Beds | Right Bed | `sensor.ch2_right_flower_bed_soil_moisture` |
| Front Flower Beds | Middle Bed | `sensor.ch3_front_middle_flower_bed_soil_moisture` |
| Front Flower Beds | Left Bed (by garage) | `sensor.ch11_front_left_flower_bed_soil_moisture` |
| Backyard Flower Beds | North Bed | `sensor.ch6_backyard_north_flower_bed_soil_moisture` |
| Backyard Flower Beds | Middle Bed | `sensor.ch10_backyard_middle_flower_bed_soil_moisture` |
| Backyard Flower Beds | South Bed | `sensor.ch12_backyard_south_flower_bed_soil_moisture` |

Anything without "Flower Bed" in its Ecowitt name counts as lawn.

**Dead channels (2026-10-16):** CH2 Right Bed, CH6 Backyard North Bed and CH9 South Fence are stuck at `0`, and CH3 Middle Bed is `unavailable`, all since 2026-09-30.

## Lawn vs Rain (JK-1152)

`custom:apexcharts-card` over 7 days: the five lawn sensors as hourly-average lines on a 0-100 `moisture` axis, and `sensor.tempest_precipitation_intensity` as hourly-max columns on the right `rain` axis. Intensity is used rather than `sensor.tempest_precipitation`, a per-report amount that undercounts when summed from history.

## Caveats

- **7 days is the ceiling.** The recorder keeps 7 days (`purge_keep_days: 7`). If the Outdoor tab loads slowly on the phone, drop `hours_to_show` to 72.
- **The indoor swap keys on moisture only.** If temperature or battery alone goes unavailable, that item shows NaN in the row.
- **`_humidity` duplicates are left off.** The ZHA plant sensors expose `_humidity` and `_soil_moisture` with the same value; the page uses `_soil_moisture`, as the morning briefing does.
- **WH51 battery voltages and `gw1200b_soil_ad_*` aren't shown.** The voltages are stale while the dead channels are down, and the AD channels are disabled.

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md)
