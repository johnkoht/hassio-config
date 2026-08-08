# Climate Automation Plan

## Vision

A predictive, proactive climate system — not a reactive thermostat. The house should pre-condition rooms before they're needed, anticipate solar gain and outdoor temperature swings, and adapt setpoints to occupancy and circadian patterns. Each room is a zone with its own thermal behavior.

---

## Mental Model

- **Proactive, not reactive** — thermal mass means decisions made now affect temperature 30–60 min later. Pre-condition, don't catch up.
- **Per-zone thermal state machine** — occupied zones hold comfort targets; unoccupied zones drift within a wider tolerance band.
- **Comfort is circadian and personal** — warmer morning, cooler night, sleep ramp, exercise vs. sedentary.

---

## System Layers

```
Sensing      →  per-room temp/humidity/AQI, outdoor weather (Tempest), solar gain
Preferences  →  per-person setpoints, sleep/wake schedules, mode (home/away/sleep)
Prediction   →  thermal model per room, weather forecast, occupancy forecast
Decision     →  what mode, what setpoint, when to pre-condition
Execution    →  HVAC calls, vent control, fan coordination
```

---

## Sensors Inventory

> To be filled in after discovery pass.

### Indoor — Awair AQI Sensors (7 rooms)
Each provides: temperature, humidity, CO2, VOCs, PM2.5, AQI score

| Room | Temperature Entity |
|---|---|
| Kitchen | `sensor.kitchen_awair_temperature` |
| Office | `sensor.office_awair_temperature` |
| Jr Suite | `sensor.jr_suite_awair_temperature` |
| Playroom | `sensor.playroom_awair_temperature` |
| Main Bedroom | `sensor.main_bedroom_awair_temperature` |
| Gianluca's Bedroom | `sensor.gianluca_bedroom_awair_temperature` |
| Nino's Bedroom | `sensor.nino_bedroom_awair_temperature` |

### Indoor — Supplemental Temperature Sensors
| Room | Entity | Type |
|---|---|---|
| Main Bedroom | `sensor.main_bedroom_temperature` | Standalone |
| Nino's Bedroom | `sensor.nino_room_temperature` | Standalone |
| Nino's Bedroom (door) | `sensor.ninos_door_sensor_temperature` | Aqara door sensor |
| Gianluca's Bedroom (door) | `sensor.gianlucas_door_sensor_temperature` | Aqara door sensor |
| Nino's Bathroom | `sensor.aqara_weather_sensor_1_temperature` | Aqara weather |
| Guest Bedroom | `sensor.guest_bedroom_temperature` | Standalone |
| Mudroom | `sensor.mudroom_motion_sensor_air_temperature` | Motion sensor |
| Pool East Entry | `sensor.pool_motion_east_entry_temperature` | Motion sensor |
| Pool West | `sensor.pool_motion_west_temperature` | Motion sensor |

### Indoor — Already-Computed Aggregate Sensors
These exist and can be used directly:

| Sensor | Entity | Source |
|---|---|---|
| Average indoor temp | `sensor.average_indoor_temperature` | Mean of all floors |
| Main floor temp | `sensor.main_floor_temperature` | Mean of kitchen, office, playroom, jr_suite |
| Second floor temp | `sensor.second_floor_temperature` | Mean of main_bedroom, gianluca, nino, guest |
| Per-room feels-like | `sensor.{room}_feels_like_temperature` | All major rooms |
| Per-room mean temp | `sensor.{room}_mean_temperature` | Bedrooms (multi-source avg) |

### HVAC — Nest Thermostats (2 zones)
| Zone | Entity |
|---|---|
| Main Floor | `climate.nest_main_floor` |
| Second Floor | `climate.nest_2nd_floor` |

### Outdoor — Tempest Weather Station
| Metric | Entity |
|---|---|
| Temperature | `sensor.tempest_temperature` |
| Humidity | `sensor.tempest_humidity` |
| Illuminance (solar proxy) | `sensor.tempest_illuminance` |
| UV Index | `sensor.tempest_uv` |
| Precipitation | `sensor.tempest_precipitation` |
| Rain Rate | `sensor.tempest_rain_rate` |
| Weather entity | `weather.pirateweather` |

---

## Historical Data Review

> To be completed — review long-term recorder data for thermal patterns.

Goals:
- [ ] Thermal decay rate per room (how fast does each room drift without HVAC?)
- [ ] HVAC runtime vs. temperature delta (how long to move 1°F?)
- [ ] Solar gain patterns by room and time of day
- [ ] Outdoor temp correlation to indoor temp per room
- [ ] Humidity patterns and seasonal variation

---

## Household Schedule

- **John**: works from home full-time — main floor occupied all day
- **Cristina**: in-office 3 days/week during work hours
- **Kid 1**: school 8:45–4:00pm
- **Kid 2**: school 8:45–1:30pm
- House is never truly "away" on weekdays — John is almost always home

## Preferred Temperatures (Setpoints)

| Mode | Zone | Summer Target | Winter Target | Tolerance | Notes |
|---|---|---|---|---|---|
| Home / Day | Main floor | 75–76°F | 71–72°F | ±2°F | John WFH; outdoor-temp-shifted |
| Home / Day | 2nd floor (kids away) | drift | drift | 73–79°F ceiling | No active conditioning while at school |
| Sleep | Main bedroom | 72°F | 72°F | — | Compromise: John 71, Cristina 73 |
| Sleep | Kids' rooms | 72°F | 72°F | — | Match main bedroom |
| Away (whole house) | All | 79°F ceiling | 65°F floor | — | Rarely triggered on weekdays |

### Setpoint Seasonality
- Shift between summer/winter targets based on outdoor rolling average (Tempest), not calendar
- Crossover threshold: TBD — roughly when outdoor daily avg crosses ~60°F
- John has high tolerance for swings; setpoints are soft targets not hard triggers

## Presence & Proximity Assets

- **Proximity sensors** — per-person zone detection (home, parents, in-laws, siblings, etc.)
- **Existing proximity automations** — already triggers pre-conditioning when headed home within a few miles
- **Room presence** (input_boolean per room) — already tracking occupancy per zone
- **Cristina**: `sensor.cristina_room_presence` — currently in playroom
- **John**: `sensor.john_room_presence` — currently in basement_hub

### Proximity-Driven Climate Logic (to design)
- When Cristina leaves a known zone (office, parents, in-laws) → start 2nd floor pre-conditioning
- When either person within ~2–3 miles heading home → begin whole-house ramp to setpoint
- Kids' return times are predictable (1:30 / 4:00) → time-based pre-conditioning may be more reliable than presence for them

---

## Automation Design

### Concrete automations to build
1. **2nd floor school pre-conditioning** — 1:15pm (Kid 2 home at 1:30) and 3:45pm (Kid 1 home at 4:00), ramp 2nd floor to 72°F
2. **2nd floor daytime drift** — after 8:45am allow 2nd floor to drift; stop active conditioning until pre-condition triggers
3. **Cristina departure trigger** — when she leaves office/known zone, start 2nd floor pre-conditioning
4. **Sleep ramp (kids)** — 2nd floor at 72°F by 7:00–7:15pm
5. **Sleep ramp (adults)** — main bedroom at 72°F by predicted adult bedtime (TBD)
6. **Morning ramp** — bring main floor to daytime setpoint X min before predicted wake time

### Learning / Adaptive Behaviors
- **Dynamic wake time**: Nightly automation queries last 7 days of bedtime boolean turning OFF, trims outliers (drop high/low), stores median in `input_datetime.predicted_wake_time`. Morning ramp fires relative to that.
- **Seasonal setpoint shift**: 7-day rolling outdoor temp average (Tempest) determines summer vs. winter profile — no calendar dependency.
- **Manual override learning**: Detect Nest setpoint changes not triggered by our automations. Log delta + direction. After repeated overrides in same direction, nudge base setpoint. Start with logging only, graduate to auto-adjust.

---

## Open Questions

- What HVAC hardware? Single-zone central, multi-zone, mini-splits?
- Do any rooms lack temperature coverage?
- Smart vents (Flair/Keen) — worth adding for true per-room control?
- CO2 from Awair — use as occupancy proxy or ventilation signal?
- Preferred temperature units (°F assumed)?

---

## Status

- [x] Mental model discussion
- [x] Sensor inventory search initiated
- [ ] Sensor inventory confirmed
- [ ] Historical data reviewed
- [ ] Preferred setpoints defined
- [ ] Automation design
- [ ] Implementation
