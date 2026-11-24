# Smart Climate

A mode-based controller for the HVAC and radiant zones. It runs as a dry run:
it decides what each thermostat should be, and the logbook shows what it would
write. No `climate.*` call is made for a zone until it is live
(its own switch, or the global one at migration).

## Layers and owners

| Layer | Files |
|---|---|
| Helpers (no `initial:`) | `helpers/` |
| Season, forecast and condition sensors | `sensors/` |
| Decision logic (one macro, 7 sensors) | `custom_templates/climate_control.jinja`, `sensors/climate_decisions.yaml` |
| Mode state machine (only writer of zone modes) | `modes/` |
| Wake learning and pre-wake | `modes/climate_wake_time_learn.yaml`, `precondition/` |
| Apply (per-zone queued wrapper, shared writer) | `scripts/`, `control/` |
| Override detection | `override/` |
| Dry-air push | `notify/` |

## Entity map

| Zone | Entity | Kind | Decision sensor |
|---|---|---|---|
| main_floor | `climate.nest_main_floor` | Nest | `sensor.climate_decision_main_floor` |
| second_floor | `climate.nest_2nd_floor` | Nest | `..._second_floor` |
| jr_suite | `climate.jr_suite` | radiant | `..._jr_suite` |
| main_bedroom | `climate.main_bedroom` | radiant | `..._main_bedroom` |
| ninos_bedroom | `climate.ninos_bedroom` | radiant | `..._ninos_bedroom` |
| basement | `climate.basement` | radiant | `..._basement` |
| garage | `climate.garage` | frost guard | `..._garage` |

Helpers: `input_boolean.climate_automations` (master), `climate_live_control`
(global) and `climate_live_<zone>` (seven, one per zone),
`climate_away_extended`, `climate_precondition_*`; `input_select.climate_season`
and `climate_mode_<zone>` (not the garage); `input_number` profiles and tuning;
`input_datetime.climate_<zone>_last_write`, `predicted_wake_time`;
`sensor.climate_active_season`.

## Safety model

- The master switch (`climate_automations`) stops everything when off.
- Live polarity, per zone: a zone writes only when `climate_live_control`
  (global) or its own `climate_live_<zone>` is `on`. Off, unknown, unavailable
  and missing all mean dry run, so a fresh install is safe. The macro
  `climate_live(zone)` in `custom_templates/climate_control.jinja` is the only
  reader; a static test fails on any other template or state condition that
  reads these switches.
- Radiant setpoints never exceed 71 (a constant, applied last). The garage is a
  constant 55 heat guard.
- Presets are never touched, so Eco is never set or cleared.
- Write-on-diff: a write happens only when the mode differs or the setpoint
  differs by 0.5 or more. Nest targets round to whole degrees, Ecobee to 0.5.
- Re-apply cap: a drift or hold write soon after the last one is logged as a
  fight and skipped.
- Override is value-based: the thermostat differs from the decision and HA did
  not write the zone in the last 180 s. Context can't be used (see
  `../LEARNINGS.md`).
- Ecobee hold-ended rule: if the only difference is the setpoint, the mode
  matches and the `temp` hold is gone, the zone is not Override; the next apply
  re-asserts it. A person turning an Ecobee off stays Override.

## First run

1. Deploy, then reload in this order: input_boolean, input_number,
   input_select, input_datetime, input_text, `homeassistant.reload_custom_templates`,
   then `template.reload`, `statistics.reload`, script, automation.
2. Run "Climate - Reset Smart Climate Defaults" once (dashboard: Settings,
   Smart Climate). It seeds every number and select, turns the global and every
   zone live switch off and turns the master on.
3. Leave every live switch off. The logbook starts filling.

## Trial one zone

Turn on one `climate_live_<zone>`; every other zone stays dry run. Go live
with the radiant zones and the garage only until migration: the two Nests
(main_floor, second_floor) clash with the old Eco and resume automations.

## Reading the soak

- Logbook names: "Climate dry run" (what it would write), "Climate set" (a live
  write), "Climate fight" (re-apply cap hit), "Climate override" and the
  override messages "would mark Override" and "hold ended".
- The decision sensors record long-term statistics, which outlive the 7-day
  recorder purge.
- Compare the dry-run lines against what the old automations actually set. Their
  setpoints are only kept 7 days, so compare early.

## Restart behaviour

`for:` timers drop on restart and reload. The mode resolver and
`climate_away_extended_on` re-run on start. Extended Away restarts its clock
after a restart. The drift check re-applies every zone on start, reload, master on
and any live switch on. Its 30 min tick runs only the live zones, and does
nothing when none is live.

## Inventory (from the build)

- 7 climate entities: 2 Nests (heat, cool, heat_cool, off; presets none, eco;
  50 to 90), 4 radiant Ecobees and the garage Ecobee (heat, off; presets away,
  home, sleep, away_indefinitely; 0.5 step). `docs/DEVICES.md` lists 6 Ecobees
  but only 5 exist in HA.
- Ecobee `preset_mode` reads `temp` during a temperature hold; it can't be set.
- Nest measured rates, used as lead-time defaults: main floor about 31 min per
  degree heating, 2nd floor about 10 to 12; idle drift 0.13 to 0.31 per hour.
  Radiant rates are measured during the soak.

## Known limits

- Away: the floor applies only in Heating and the ceiling only in Cooling
  (single setpoint, `heat_cool` is never used). Radiant zones are hands-off in
  Cooling.
- Dry run can't validate Nest rounding or the Ecobee hold type; check both on the
  first live day.
- The kids' space-heater automations are not part of this controller.

## Migration (plan task 10)

After the soak: delete (not disable) the old automations and scripts listed in
`plans/smart-climate-control/plan.md` task 10, turn the global live switch on, repoint the
dashboard's old Eco rows (`automation.main_floor_climate_to_eco`) in
`dashboards/kohbo/climate/_climate_settings_popup.yaml`, and update the climate
README, `../LEARNINGS.md` and `docs/AUTOMATIONS.md`.
