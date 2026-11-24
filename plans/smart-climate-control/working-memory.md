# Working Memory — smart-climate-control

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Live facts (verified read-only on epicurus, HA 2026.7.4, 2026-11-24)
- 7 climate entities. Nest: `climate.nest_main_floor`, `climate.nest_2nd_floor` (hvac heat/cool/heat_cool/off, presets none/eco, min 50 / max 90). Ecobee radiant: `climate.jr_suite`, `climate.main_bedroom`, `climate.ninos_bedroom`, `climate.basement`, plus `climate.garage` (hvac heat/off, presets away/home/sleep/away_indefinitely, step 0.5, min 44.6 / max 95). No 6th Ecobee in HA, even though DEVICES.md says 6.
- Ecobee `preset_mode` reads `temp` while a temperature hold is active. `temp` is not in `preset_modes`; never set it.
- Nest writes no optimistic state. A new state arrives only via Pub/Sub, with a fresh context, so context can't identify HA's own writes.
- Nest `set_temperature` in heat mode calls `set_heat`, in cool mode `set_cool`. It uses the entity's *current* mode, so wait for the mode before setting the temperature.
- Ecobee `set_temperature` writes state inside the caller's context. Later polls (180 s throttle) use a fresh context. In heat mode it sets cool = heat. The hold type follows the device's holdAction (unknown).
- `sensor.tempest_temperature` updates about every 71 s (about 8.5k samples per 7 days). Recorder `purge_keep_days` is 7. The statistics config in the PRD passed `PLATFORM_SCHEMA`. `statistics.reload` exists.
- `sensor.pirateweather_hourly_forecast` has `forecast` = 20 hourly dicts with `datetime` and `temperature` (°F). `weather.pirateweather` has no forecast attribute.
- `input_boolean.guest_mode`, `vacation_mode` and `quiet_mode` are UI helpers (exist; not in repo YAML). `input_boolean.ninos_bedroom_occupied` and `gianlucas_room_occupied` are YAML. `sensor.average_indoor_humidity` exists (min_max).
- `/config/custom_templates` doesn't exist on the host yet. It's created by git pull. Use `homeassistant.reload_custom_templates`, then `template.reload`.
- Services exist: `logbook.log` and the reloads for input_*, template and statistics.
- Nest rates (task 1):
  - main floor about 31 min/°F heating; 2nd floor about 10–12 min/°F;
  - idle drift 0.13–0.31 °F/h;
  - main floor recovery from Away 65 to 72 about 3.5 h;
  - no cooling data yet. Radiant rates come during the soak.

## Memory synthesis (from memory/ entries)
- JK-1118: in a `mode: queued` automation, compute fresh values in action-level `variables:` and gate with action-level conditions. Automation-level variables render at trigger time.
- `for:` timers drop on reload and restart, and `last_changed` resets on start. Add HA start and `automation_reloaded` triggers, plus a rule for time-held conditions.
- Select only when the value differs, so derived-state writers don't create spurious transitions.
- Statistics: numeric sources use `mean`/`value_min` (not `min`). A bad characteristic is silently dropped and CI still passes. Validate on the host.
- A `delay`/`wait` inside a called script blocks a `mode: single` caller. Use `script.turn_on` for fire-and-forget.
- A state trigger with `to:`/`from:` ignores attribute-only changes. Use `attribute: temperature` for setpoint changes.
- `automation.<slug(alias)>` is the entity id, not `<id>`.
- `!include_dir_named` keys packages by basename across the whole tree. A `.yml` is never loaded.
- Tests: use a tolerant YAML loader (`!secret`/`!include`). The FakeHA + Jinja2 StrictUndefined pattern is in tests/test_house_mode_resolver.py.
- Every phone push needs a `url` that opens a view or popup (test_notification_deep_links).

## Discovered Patterns
- [Task 2] Trigger-based hysteresis: `climate_active_season.yaml` reads `this.state` guarded by `this is defined and this.state in [...]`; plain binaries (very_cold, indoor_air_dry) hold with `this.state == 'on'` in the band.
*(Add: [Task N] pattern-name: description at file:line)*

## Active Gotchas
- [Task 1] YAML 1.1: an unquoted `Off` option parses as boolean False. All select options in packages/climate/smart/helpers/climate_zone_modes.yaml are quoted; quote `Off`/`On`/`Yes`/`No` in any new option list, and test options against the parsed YAML (tests/test_smart_climate_static.py).
- [Task 2] `input_number` states render as `5.0`: `| int(0)` on them gives 0 in HA. Use `| float(0) | int` (climate_forecast_*_swing.yaml).
- [Task 2] Jinja has no `is list` test; check forecasts with `x is iterable and x is not string and x | count > 0`.
*(Add: [Task N] issue the next developer must know about)*

## Shared Utilities Created
- [Task 1] tests/test_smart_climate_static.py has a tolerant loader (`add_multi_constructor("!", ...)`) and `helpers(domain)` returning every helper of a domain under packages/climate/smart/. Seed values live only in packages/climate/smart/scripts/climate_seed_defaults.yaml.
- [Task 2] tests/smart_climate_harness.py: `load(rel)`, `entities(rel)` ({unique_id: (domain, cfg)}), `FakeHA(states, attrs, now).render(tpl, this_state=..., loader=...)` / `.render_entity(cfg, field)`, `make_env(ha, loader)`, `truthy()`. Pass a `jinja2.FileSystemLoader` on custom_templates/ for task-3 macro imports. Missing entities read `unknown`.
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
- [2026-11-24] Dry-run is `input_boolean.climate_live_control` off (inverted from the plan's `climate_dry_run`). Docs affected: plan.md Build corrections, prd.md. Status: folded.
- [2026-11-24] Override detection is value-based plus a 180 s grace window, not context-based. Docs affected: plan.md, prd.md, packages/climate/LEARNINGS.md (task-6). Status: open.
