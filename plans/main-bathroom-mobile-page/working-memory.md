# Working Memory — main-bathroom-mobile-page

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Task 1] Live dump: $SCRATCH/live_states.json. All plan entities exist; only door sensors unavailable.
- [Task 1] room: "main_bathroom" (room_card_occupancy compares sensor.<person>_room_presence state = HA area_id; area id main_bathroom confirmed)
- [Task 1] aqi: main_bedroom_card uses "[[[ return states['sensor.main_bedroom_air_quality'].state ]]]" (live "Acceptable") — reuse for bathroom card
- [Task 1] Plug power: sensor.smart_plug_12_active_power, sensor.smart_plug_13_active_power (W, live) — pass as power_sensor
- [Task 1] Automation IDs: automation.main_bathroom_{occupied,not_occupied,mode_auto,mode_bedtime,mode_off,lights_motion_on,bedtime_motion_on,lights_off,lights_manually_turned_off,shower_occupied,shower_not_occupied,set_initial_humidity,turn_on_outlets,turn_off_outlets}
- [Task 1] Door template users: groups family_room_doors/kitchen_doors/office_doors publish 2 members (unchanged by fix); singles front_door, gianlucas_door_sensor_status (on → wrongly "Closed" today), interior_garage_door, jr_suite_door_status (on → wrongly "Closed"), main_bedroom_, ninos_, playroom_exterior_door get fixed
- [plan] climate_overview tokens: temperature_sensor, humidity_sensor, carbon_dioxide_sensor, vocs_sensor, room_name (aqi_score_sensor/action_cards only in commented blocks; pm25_sensor unused)

## Active Gotchas
- [Task 1] binary_sensor.main_bathroom_door_sensor_status (and _toilet_door_, main_bedroom, ninos door sensors) UNAVAILABLE since 2026-09-30 — keep the tile, flag to John; don't block
- [Task 1] automation.main_bathroom_lights_motion_on is DISABLED live — flag to John, not in scope
- [plan] kohbo_device_door_entity reads entity.attributes.entity_id (groups only) → single sensors always "Closed"
- [plan] script.main_bathroom_activate_bedtime_lighting_mode alias says "Main Bedroom" — give explicit name:
- [plan] mudroom_card.yaml has room: "foyer" slip — don't copy

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-15] Main bathroom page built by hand; shared small-bathroom template deferred to JK-1222 (deviation from "two uses = template") — docs affected: none-yet — status: open

- [Task 3/4] Only leak template is kohbo_device_leak_entity_horizontal (horizontal); page uses kohbo_device_entity + mdi:water-alert. Smart plug template takes `variables: confirmation: true` (not a button-card confirmation key). Pre-existing yamllint errors in kohbo.yaml (indent line 19, no EOF newline) and upper_floor_index.yaml (no EOF newline); room-card partials copy bedroom's indent style which yamllint flags.
