# Working Memory — main-bathroom-mobile-page

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [plan] climate_overview tokens: temperature_sensor, humidity_sensor, carbon_dioxide_sensor, vocs_sensor, room_name (aqi_score_sensor/action_cards only in commented blocks; pm25_sensor unused)

## Active Gotchas
- [plan] kohbo_device_door_entity reads entity.attributes.entity_id (groups only) → single sensors always "Closed"
- [plan] script.main_bathroom_activate_bedtime_lighting_mode alias says "Main Bedroom" — give explicit name:
- [plan] mudroom_card.yaml has room: "foyer" slip — don't copy

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-15] Main bathroom page built by hand; shared small-bathroom template deferred to JK-1222 (deviation from "two uses = template") — docs affected: none-yet — status: open
