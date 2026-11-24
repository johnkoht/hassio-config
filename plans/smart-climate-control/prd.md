# PRD: Smart Climate Control (dry-run build)

## Goal

Every climate zone (2 Nests, 4 radiant Ecobees, the garage frost guard) gets one explicit decision (HVAC mode + setpoint) derived from a zone mode, the season and comfort profiles. A controller writes that decision only when it differs, and never touches the Nest Eco preset. This build ships **dry-run only**: in dry-run the controller writes logbook entries and makes zero `climate.*` calls. The old Eco/resume automations keep running untouched until the post-soak migration.

## Out of scope for this build

- **Plan task 9, the dry-run soak.** It's operational: run for at least a week of mixed weather and compare logbook decisions with reality. Radiant rates are measured during the soak.
- **Plan task 10, migration.** Retiring the old automations, turning live control on and repointing `automation.main_floor_climate_to_eco` on the dashboard all happen after the soak, in a separate change.
- Kids' space heaters (John, 2026-11-24). Per-room vents. Override learning (log only).
- `docs/climate_automation_plan.md` holds household schedule details. Fixing that needs a history decision from John, so it's flagged only.

## Plan task mapping

| Plan task | Where |
|---|---|
| 1 Inventory | Done in pre-build; results recorded in `working-memory.md` and the package README (task-6) |
| 2 Helpers | task-1 |
| 5 layer-5 season + condition sensors | task-2 |
| 3 zone controller decisions, 8 price offset, 7 forecast part | task-3 |
| 4 zone controller writes + dry-run | task-4 |
| 4 override detection | task-4 |
| 3 mode state machine, 7 wake/precondition | task-5 |
| 11 dashboard, docs | task-6 |
| 9 soak, 10 migration | deferred (above) |

## Design decisions (orchestrator, from the pre-mortem; John's decisions untouched)

1. **Dry-run polarity is inverted.** `input_boolean.climate_live_control` must be `on` for any `climate.*` write. Anything else (off, unknown, unavailable) means dry-run. A fresh boolean is `off`, so the safe state is the default. This replaces the plan's `climate_dry_run`.
2. **Master switch** `input_boolean.climate_automations` starts off, so nothing runs until John turns it on (the seed script does it).
3. **Override detection is value-based.** The Nest writes every state change with a fresh context (verified in the installed source), so context can't tell HA from a person.
4. **One resolver** writes the zone modes (JK-1118 pattern), instead of one file per transition.
5. **The decision logic lives once**, in the Jinja macro `custom_templates/climate_control.jinja`, and is rendered by 7 decision sensors. Tests render the same file.
6. **Radiant cap 71°F** is a constant in the macro and is applied again in the controller script. It's never a helper.
7. **Garage frost guard is a constant 55°F heat.** It has no mode select.
8. **Radiant in the Cooling season is hands-off** (`skip`). HA sets radiant zones to `heat` when the season reads Heating; it never turns them off.
9. **Away has two stages.** First a setback (Nest: comfort ∓ `climate_away_setback`; radiant: unchanged). Then, once `input_boolean.climate_away_extended` is on (house empty past `climate_away_delay` + `climate_away_extended_delay`, or Vacation), the full Away band applies (65 floor / 79 ceiling, radiant 65).
10. **Nest targets round to whole °F; Ecobee targets round to 0.5°F.** A write happens only when the mode differs or the setpoint differs by at least 0.5°F.
11. **HVAC mode table (review fix).** Single setpoint only. `heat_cool` is never used, because it would add a mode flip on every Away transition. The Away floor applies in Heating and the Away ceiling in Cooling.

    | zone kind | zone mode | Heating | Cooling |
    |---|---|---|---|
    | nest | Comfort / Sleep / Away | `heat` + `temperature` | `cool` + `temperature` |
    | nest | Off | `off` | `off` |
    | radiant | Comfort / Sleep / Away | `heat` + `temperature` | `skip` (hands off) |
    | radiant | Off | `off` | `off` |
    | any | Override | `skip` | `skip` |
    | garage | (none) | `heat` 55 | `heat` 55 |
12. **Per-zone serialisation (review fix).** Each zone has a wrapper `script.climate_apply_<zone>` (`mode: queued`, max 3). It calls the shared `script.climate_apply_zone` (`mode: parallel`, max 10) and waits for it. Runs for the same zone never interleave. A stalled Nest can't block another zone.
13. **Re-apply cap (review fix).** Writes from the `drift` or `hold` sources are skipped when this zone was written less than 15 min ago, and a `Climate fight` logbook line is written instead. That caps a Nest-vs-HA ping-pong at 4 writes per zone per hour. Writes from a decision change are never capped.
14. **No live toggle on the dashboard (review fix).** `climate_live_control` is not in the popup in this build. Turning it on belongs to task 10.
15. **Durable soak record (review fix).** The decision sensors carry `state_class: measurement`, so long-term statistics keep hourly target means beyond the 7-day purge. The dry-run logbook writes only on a decision change or a start/master event, never on the 30-min drift tick.
16. **Season survives restarts (review fix).** `sensor.climate_active_season` is a trigger-based template sensor, so it restores its state, and its hysteresis `this.state` is valid after a restart.

## Architecture contract (exact IDs; every task uses these)

Zones (key → entity):

| key | entity | kind |
|---|---|---|
| main_floor | climate.nest_main_floor | nest |
| second_floor | climate.nest_2nd_floor | nest |
| jr_suite | climate.jr_suite | radiant |
| main_bedroom | climate.main_bedroom | radiant |
| ninos_bedroom | climate.ninos_bedroom | radiant |
| basement | climate.basement | radiant |
| garage | climate.garage | frost |

All new package files live under `packages/climate/smart/`, are `.yaml`, have basenames starting with `climate_` (or `predicted_wake_time`), and are unique across `packages/` (`!include_dir_named` keys by basename).

### Helpers (task-1)

Nothing here uses `initial:`.

- **input_boolean:**
  - `climate_automations` (master)
  - `climate_live_control`
  - `climate_away_extended`
  - `climate_precondition_main_floor`
  - `climate_precondition_second_floor`
- **input_select:**
  - `climate_mode_<zone>` for the 6 non-garage zones. Options: `Comfort, Sleep, Away, Off, Override`.
  - `climate_season`. Options: `Auto, Heating, Cooling`.
- **input_number.** Seeded by `script.climate_seed_defaults`. Units are °F unless noted. Profile numbers are step 0.5, `mode: box`.

  | id | seed | min | max |
  |---|---|---|---|
  | climate_main_floor_comfort_heat | 72 | 60 | 78 |
  | climate_main_floor_comfort_cool | 76 | 68 | 82 |
  | climate_main_floor_sleep_heat | 72 | 60 | 78 |
  | climate_main_floor_sleep_cool | 72 | 68 | 82 |
  | climate_second_floor_comfort_heat | 72 | 60 | 78 |
  | climate_second_floor_comfort_cool | 76 | 68 | 82 |
  | climate_second_floor_sleep_heat | 72 | 60 | 78 |
  | climate_second_floor_sleep_cool | 72 | 68 | 82 |
  | climate_away_heat | 65 | 55 | 70 |
  | climate_away_cool | 79 | 74 | 85 |
  | climate_away_setback | 3 | 0 | 8 |
  | climate_radiant_comfort_heat | 68 | 60 | 71 |
  | climate_radiant_sleep_heat | 68 | 60 | 71 |
  | climate_radiant_cold_heat | 70 | 60 | 71 |
  | climate_radiant_away_heat | 65 | 55 | 71 |
  | climate_radiant_cold_cutoff (outdoor) | 15 | -20 | 40 |
  | climate_humidity_floor (%) | 30 | 15 | 50 |
  | climate_season_heat_below | 58 | 40 | 70 |
  | climate_season_cool_above | 64 | 50 | 80 |
  | climate_away_delay (min) | 30 | 5 | 240 |
  | climate_away_extended_delay (h, step 0.5) | 4 | 0.5 | 24 |
  | climate_main_floor_minutes_per_degree (min/°F, step 1) | 31 | 1 | 120 |
  | climate_second_floor_minutes_per_degree | 12 | 1 | 120 |
  | climate_precondition_max_lead (min) | 120 | 0 | 240 |
  | climate_forecast_lookahead (h, step 1) | 4 | 1 | 12 |
  | climate_forecast_swing | 10 | 3 | 30 |
  | climate_forecast_boost | 1 | 0 | 3 |
  | climate_price_offset | 2 | 0 | 5 |

- **input_datetime:**
  - `predicted_wake_time` (time only)
  - `climate_<zone>_last_write` (date + time) for the 6 non-garage zones
- **input_text:** `climate_wake_history`, max 255. Comma-separated minutes after midnight, newest last, at most 7.
- **script.climate_seed_defaults:**
  - sets every number above to its seed and `climate_season` to Auto;
  - turns `climate_live_control` **off** and `climate_automations` **on**.

### Sensors (task-2)

- **`sensor.outdoor_temperature_7_day_mean`.** Statistics platform:
  - `entity_id: sensor.tempest_temperature`, `state_characteristic: mean`;
  - `max_age: {days: 7}`, `sampling_size: 20000`, `precision: 1`;
  - `unique_id: outdoor_temperature_7_day_mean`.

  This exact config passed `PLATFORM_SCHEMA` on epicurus on 2026-11-24.
- **`sensor.climate_active_season`** (trigger-based template, so it restores). State is `Heating` or `Cooling`.
  - Triggers: the mean sensor, `climate_season`, both thresholds, HA start, `event_template_reloaded`.
  - `climate_season` Heating or Cooling pins the season.
  - Auto: mean ≤ heat_below → Heating; mean ≥ cool_above → Cooling. In between, hold `this.state`.
  - With no valid previous state in the hold band, mean < 61 → Heating, else Cooling.
  - When the mean is unavailable, hold `this.state` (Heating if there is none).
- **`binary_sensor.climate_very_cold`.**
  - On when `sensor.tempest_temperature` < cutoff. Off when it's ≥ cutoff + 2; hold `this.state` in between.
  - `delay_on` and `delay_off` 30 min. `availability: has_value('sensor.tempest_temperature')`.
- **`binary_sensor.climate_indoor_air_dry`.**
  - On when `sensor.average_indoor_humidity` < floor. Off when it's ≥ floor + 2; hold in between.
  - `delay_on` and `delay_off` 30 min. Availability on the humidity sensor.
- **`binary_sensor.climate_price_offset_active`.**
  - On when all hold: `binary_sensor.energy_prices_are_high` on, `input_boolean.climate_energy_price_automations` on, `input_boolean.entertainment_mode` off, `binary_sensor.extreme_climate` off.
  - `delay_on` and `delay_off` 15 min (the PR #22 dwell).
- **`binary_sensor.climate_forecast_cold_swing` and `binary_sensor.climate_forecast_warm_swing`.**
  - They read the first `climate_forecast_lookahead` entries of `state_attr('sensor.pirateweather_hourly_forecast', 'forecast')` (the `temperature` key, °F).
  - Cold swing: the minimum ≤ tempest − swing. Warm swing: the maximum ≥ tempest + swing.
  - `delay_off` 30 min. Availability: the forecast is a non-empty list and tempest has a value.
- All template entities use `unique_id` and `default_entity_id`, as in the repo's migrated templates.

### Decisions (task-3)

The macro `climate_decision(zone)` lives in `custom_templates/climate_control.jinja`. It returns JSON `{"hvac_mode": heat|cool|off|skip, "temperature": number|null, "zone_mode": str, "reason": str}`. It uses only `states()`, `state_attr()`, `is_state()`, `has_value()` and filters (no `states.x.y`, no `now()`).

- **garage:** `heat` at 55. Reason `Frost guard`.
- **`zone_mode` (`input_select.climate_mode_<zone>`):**
  - Not a known option → `skip`.
  - `Override` → `skip`.
  - `Off` → `off`.
- **season:** `sensor.climate_active_season`. Unknown → `skip`.
- **Nest zones.** Side is heat (Heating) or cool (Cooling).
  - Comfort → `<zone>_comfort_<side>`.
  - Sleep → `<zone>_sleep_<side>`, or `<zone>_comfort_<side>` when `climate_precondition_<zone>` is on (reason says pre-wake).
  - Away → `climate_away_<side>` when `climate_away_extended` is on. Otherwise comfort − setback (heat) or comfort + setback (cool).
  - **Forecast:** Heating + cold swing, or Cooling + warm swing, in Comfort or Sleep → move toward comfort by `climate_forecast_boost` (heat +, cool −).
  - **Price:**
    - `binary_sensor.climate_price_offset_active` on, in Comfort → heat − offset, cool + offset.
    - Skipped on second_floor when `input_boolean.ninos_bedroom_occupied` or `input_boolean.gianlucas_room_occupied` is on.
  - **Clamp:** heat to [climate_away_heat, 80]; cool to [60, climate_away_cool]. Round to whole °F.
- **Radiant zones:**
  - Cooling → `skip` (hands off).
  - Comfort → radiant comfort; Sleep → radiant sleep.
  - Away → radiant away if extended, else radiant comfort (the slab holds steady).
  - **Cold bump:** `binary_sensor.climate_very_cold` on, in Comfort or Sleep:
    - if `binary_sensor.climate_indoor_air_dry` is off → max(target, radiant cold);
    - if it's on → no bump (reason says dry air).
  - **Clamp** last: min(target, **71**), max(target, 50). Round to 0.5.
- **Decision sensors.** `sensor.climate_decision_<zone>` for all 7 zones:
  - state is the temperature (unit °F, device_class temperature; unknown when null);
  - attributes: `hvac_mode`, `zone_mode`, `reason`.
  - Each renders `{% from 'climate_control.jinja' import climate_decision %}`.

### Controller (task-4)

- **`script.climate_apply_<zone>`** for all 7 zones (`mode: queued`, max 3, field `source`). Each calls `script.climate_apply_zone` with its zone and source, and waits.
- **`script.climate_apply_zone`** (fields `zone` and `source`: decision|drift|hold|start; `mode: parallel`, max 10). It only uses `variables`, `condition`, `if/then/else`, `stop`, `wait_template`, `action`, so the test interpreter can run it.
  1. **Gates:**
     - `climate_automations` is on;
     - the decision has a valid `hvac_mode` that isn't `skip`;
     - the zone mode is not Override (garage exempt);
     - the mode differs, or a heat/cool setpoint differs by at least 0.5°F (or the current setpoint is null).
  2. **Radiant zones:** the temperature is re-clamped to ≤ 71 in the script.
  3. **Re-apply cap:** in live mode, with source `drift` or `hold`, if `climate_<zone>_last_write` is under 15 min old → log `Climate fight` and `stop`.
  4. **Dry-run** (`climate_live_control` is not `on`): one `logbook.log`:
     - name `Climate dry run`;
     - entity_id is the climate entity;
     - the message has the zone, the current → wanted mode/setpoint, and the reason.

     Then `stop`. Zero `climate.*` calls.
  5. **Live:**
     - set `input_datetime.climate_<zone>_last_write` to now (not for the garage);
     - if the mode differs: `climate.set_hvac_mode`, then, unless the new mode is `off`, `wait_template` until the state equals it (60 s, `continue_on_timeout: true`); if not reached, log and `stop`;
     - then `climate.set_temperature` (`temperature` only) if still needed;
     - set `climate_<zone>_last_write` to now again, so the grace window covers the Ecobee 180 s poll after a slow write;
    - finally log `Climate set`.
  6. **Never** calls `climate.set_preset_mode`.
- **`climate_apply_on_decision_change`** (automation):
  - triggers on any change of the 7 decision sensors, `for: 30 s`;
  - master on;
  - action `script.turn_on` of `script.climate_apply_<zone>` with `source: decision` (non-blocking).
- **`climate_apply_drift_check`** (automation):
  - triggers: `time_pattern` every 30 min (fires only when live is on), HA start, `automation_reloaded`, `climate_automations` → on, `climate_live_control` → on;
  - action: `script.turn_on` of all 7 wrappers, with `source: drift` (time_pattern) or `start` (the others).
- **`climate_override_detect`** (automation, `mode: queued`):
  - **Triggers:** the 6 non-garage climate entities on hvac state change (`to:` the hvac mode list), plus `attribute: temperature`.
  - **Conditions:**
    - master on;
    - zone mode in Comfort/Sleep/Away;
    - the decision `hvac_mode` is heat/cool/off;
    - the actual value differs from the decision (mode, or setpoint ≥ 1°F);
    - more than 180 s since `climate_<zone>_last_write`.
  - **Ecobee zone whose new `preset_mode` isn't `temp`** (the hold ended):
    - live → re-apply the zone (`source: hold`, so it's capped);
    - dry-run → logbook `hold ended`.
  - **Otherwise:**
    - live → select `Override` + logbook;
    - dry-run → logbook `would mark Override` only.

### Modes (task-5)

- **`climate_mode_resolve`** (automation, `mode: queued`, variables and conditions in actions):
  - **Triggers:**
    - `input_boolean.house_occupied` on `for: 10 s`;
    - `house_occupied` off `for:` `climate_away_delay` minutes (id `empty_hold`);
    - `input_boolean.bedtime` on/off (id `event`);
    - `input_boolean.vacation_mode`, `input_boolean.guest_mode`, `input_boolean.quiet_mode` on/off (id `minor`);
    - `input_boolean.nearly_home` on;
    - HA start and `automation_reloaded` (id `restart`);
    - `climate_automations` → on (id `restart`).
  - **Resolved house mode:**
    - any input not on/off → no change;
    - empty + nearly_home → Comfort;
    - empty + vacation → Away;
    - empty + guest_mode on → treated as occupied;
    - empty past the delay (trigger `empty_hold`/`restart`, or `last_changed` age ≥ delay) → Away;
    - empty inside the delay → no change;
    - bedtime → Sleep;
    - else Comfort.
  - **Per zone:**
    - second_floor uses Sleep when `quiet_mode` is on and the result is Comfort;
    - skip zones in `Off`;
    - `Override` clears only on house events, per the plan: bedtime on/off, house occupied on (arrive), `empty_hold` (depart) and nearly_home. Those triggers carry id `event`. `vacation_mode`, `guest_mode` and `quiet_mode` toggles (id `minor`) and `restart` keep zones in `Override`;
    - select only when different.
  - On every non-restart run, turn off both precondition flags.
- **`climate_away_extended_on`:**
  - house empty `for:` delay + extended delay, or empty `for:` delay while vacation is on, or vacation → on while empty past the delay;
  - nearly_home must be off;
  - turn on.
- **`climate_away_extended_off`:** house_occupied → on, or nearly_home → on; turn off.
- **`climate_wake_time_learn`:**
  - `bedtime` on → off after at least 4 h of bedtime;
  - append minutes-after-midnight to `climate_wake_history` (keep the last 7);
  - set `input_datetime.predicted_wake_time` to the median.
- **`climate_precondition_main_floor_wake` and `climate_precondition_second_floor_wake`:**
  - template trigger: bedtime on, history ≥ 3 entries, lead > 0, and wake − lead ≤ now < wake;
  - lead = min(max_lead, ceil(delta × minutes_per_degree)), where delta is comfort_heat − sleep_heat (Heating) or sleep_cool − comfort_cool (Cooling);
  - master on, zone mode Sleep;
  - turn on `climate_precondition_<zone>`.
  - Radiant zones never pre-condition.
- **`climate_dry_air_notify`:**
  - `binary_sensor.climate_indoor_air_dry` → on, master on, last run more than 12 h ago (`this.attributes.last_triggered`);
  - `script.general_notification` to `jk`, `priority: passive`, `url: /dashboard-kohbo/climate-hvac#climate_settings_popup`;
  - the message says the radiant cold-weather bump is skipped, and says when it's dry-run.

---

## Tasks

### task-1: Helpers and seed script
**Files:** `packages/climate/smart/helpers/*.yaml`, `packages/climate/smart/scripts/climate_seed_defaults.yaml`, `tests/test_smart_climate_static.py`

**Acceptance criteria:**
- Every helper in the contract exists with the exact id, options, min, max and step. None has `initial:`.
- `script.climate_seed_defaults` sets every contract `input_number`. Each seed is inside that helper's min/max. It turns `climate_live_control` off and `climate_automations` on.
- Tests:
  - every package `input_number` is seeded, and each seed is in range;
  - no `initial:` on any new helper;
  - basenames under `packages/climate/smart/` are unique across `packages/`;
  - radiant profile helpers have max ≤ 71.
- The full suite passes.

### task-2: Season and condition sensors
**Files:** `packages/climate/smart/sensors/*.yaml`, `tests/smart_climate_harness.py` (created here: tolerant loader + FakeHA renderer), `tests/test_smart_climate_sensors.py`

**Acceptance criteria:**
- The statistics sensor matches the contract exactly. A test pins the characteristic, `max_age` and a `sampling_size` of at least 10080.
- Render tests (Jinja2 StrictUndefined, fake HA) cover:
  - season: Auto below, above and in the hold band from each prior state; pinned Heating/Cooling; mean unavailable;
  - very_cold and indoor_air_dry: hysteresis edges;
  - forecast swings: a cold swing, a warm swing, no swing, an empty forecast (unavailable).
- The price sensor requires all four inputs. It has 15-min delays.
- The full suite passes.

### task-3: Decision macro and decision sensors
**Files:** `custom_templates/climate_control.jinja`, `packages/climate/smart/sensors/climate_decisions.yaml`, `tests/smart_climate_harness.py` (extended), `tests/test_smart_climate_decisions.py`

**Acceptance criteria:**
- The macro implements the contract. The 7 sensors exist, and each calls the macro with its own zone key.
- Tests render the real `.jinja` file:
  - Comfort/Sleep/Away (setback and extended) for both seasons on a Nest zone;
  - precondition in Sleep;
  - forecast boost;
  - price offset (Comfort only; skipped on second_floor with a kid's room occupied);
  - Away-band clamps;
  - radiant Cooling → skip;
  - radiant cold bump, and the cold bump with dry air;
  - Off → off; Override → skip; unknown mode or season → skip;
  - garage = heat 55 in every state.
- A grid test covers every radiant mode × season × cold × dry combination with profile values up to 80. The temperature is never above 71.
- No `set_preset_mode` and no `eco` string in the macro.
- The full suite passes.

### task-4: Controller, apply automations, override detection
**Files:** `packages/climate/smart/scripts/climate_apply_zone.yaml`, `packages/climate/smart/scripts/climate_apply_<zone>.yaml` (×7), `packages/climate/smart/control/*.yaml`, `packages/climate/smart/override/climate_override_detect.yaml`, `tests/test_smart_climate_controller.py`

**Acceptance criteria:**
- A small interpreter in `tests/smart_climate_harness.py` executes the script's sequence (variables, condition, if/then/else, stop, wait_template, action) against fake states, and records every action.
- **Dry-run proof:** with `climate_live_control` off, unknown and unavailable, and a mismatching decision for every zone, the recorded actions include zero `climate.*` calls and exactly one `logbook.log`.
- **Live:**
  - a setpoint mismatch → one `climate.set_temperature`;
  - a mode mismatch → `set_hvac_mode`, a wait, then `set_temperature`;
  - already on target → zero actions;
  - a radiant decision of 75 → a written temperature of 71;
  - Override zone → zero actions;
  - master off → zero actions.
- No `climate.set_preset_mode` in any file under `packages/climate/smart/` or in the macro.
- Override condition render tests:
  - a mismatch 60 s after the last write → no Override;
  - a mismatch 10 min after → Override in live, logbook only in dry-run;
  - equal values → nothing;
  - Ecobee `preset_mode: home` → hold-ended path.
- The drift check's `time_pattern` path only runs when live is on.
- The full suite passes.

### task-5: Mode resolver, Away stages, wake learning, precondition, dry-air push
**Files:** `packages/climate/smart/modes/*.yaml`, `packages/climate/smart/precondition/*.yaml`, `packages/climate/smart/notify/climate_dry_air_notify.yaml`, `tests/test_smart_climate_modes.py`

**Acceptance criteria:**
- Resolver render tests cover:
  - vacation; empty past the delay; empty inside the delay (no change);
  - empty + nearly home → Comfort; empty + guest_mode → treated as occupied;
  - bedtime → Sleep; Quiet → second_floor Sleep only;
  - Override cleared on an `event` trigger and kept on `minor` and `restart`; Off untouched; select only on change;
  - unknown inputs → nothing.
- Wake learning tests: append and trim to 7, the median with odd and even counts, nothing recorded when bedtime was shorter than 4 h.
- Precondition trigger render tests: the window opens at wake − lead and closes at wake; delta ≤ 0 → never; fewer than 3 history entries → never.
- The dry-air push has a `url` that passes `test_notification_deep_links`.
- No time-of-day literals (`at: "HH:MM"`, `after:`/`before:` clock conditions) in any new file (test).
- The full suite passes.

### task-6: Dashboard controls and docs
**Files:**
- `dashboards/kohbo/climate/_climate_settings_popup.yaml`
- `packages/climate/smart/README.md`
- `packages/climate/LEARNINGS.md`
- `docs/AUTOMATIONS.md`

**Acceptance criteria:**
- The settings popup gains a "Smart Climate (dry run)" section:
  - the master toggle, the seed script (labelled as a reset to defaults, with a tap confirmation), the season select and the active season. **No live toggle**;
  - the 6 zone mode selects;
  - a "Smart Climate Setpoints" section with the 8 floor profile numbers, the 2 Away numbers and the 4 radiant numbers;
  - a description card saying live control stays off until the old automations are retired.
- The existing sections, including `automation.main_floor_climate_to_eco`, are unchanged.
- `test_dashboard_views` and the other dashboard tests pass.
- The README covers:
  - the layers, the entity map and the first-run steps (reload list, seed, dry-run);
  - how to read the soak logbook, and the restart behaviour;
  - the task-1 inventory (5 Ecobees, none 6th; hvac modes; measured Nest rates);
  - what task 10 must do.
- LEARNINGS gains the Nest-context and Ecobee hold findings. `docs/AUTOMATIONS.md` climate section mentions the new controller in dry-run.
- The full suite passes.
