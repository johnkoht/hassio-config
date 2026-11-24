# PRD: Smart Climate Trial Tweaks

Plan: `plans/smart-climate-trial-tweaks/plan.md` (approved). Builds on the smart climate controller (PR #209), which is live in dry-run.

## Goal

Let each smart-climate zone go live on its own (starting with the garage frost guard) while every other zone stays dry-run, seed main-floor Sleep heat at 70, and keep guests at Comfort on the main floor overnight.

## Decisions (binding for every task)

1. **One live definition.** A macro `climate_live(zone)` in `custom_templates/climate_control.jinja` renders exactly `True` or `False` (no whitespace) so HA's native-type parsing yields a bool. It is `True` only when `input_boolean.climate_live_control` is `on` OR `input_boolean.climate_live_<zone>` is `on`. Any other state (off, unknown, unavailable, missing) is `False`. Callers import it with `{% from 'climate_control.jinja' import climate_live %}`.
2. **Zones:** `main_floor`, `second_floor`, `jr_suite`, `main_bedroom`, `ninos_bedroom`, `basement`, `garage` (as in `scripts/climate_apply_zone.yaml`). New helpers: `input_boolean.climate_live_<zone>` for all seven, no `initial:`, in `packages/climate/smart/helpers/climate_smart_switches.yaml`.
3. **Readers switched to the macro:** apply script (`live` variable and the post-wait re-check, which is a `condition: state` on the global today), override detection (`live` variable, per trigger zone), drift check (tick gate) and the dry-air notify `(dry run)` suffix.
4. **Drift check:** triggers also fire on any per-zone live switch turning `on` (id `start`). The 30 min tick acts only when at least one zone is live, and on a tick only the live zones' apply scripts run (so dry-run zones don't add a logbook line every 30 min). Start/reload/master-on/live-on still run every zone.
5. **Dry-air notify:** the cold bump only affects radiant zones, so the message says `(dry run)` unless at least one radiant zone (`jr_suite`, `main_bedroom`, `ninos_bedroom`, `basement`) is live.
6. **Static guard:** outside the macro file, `climate_live_` (global or per-zone) may appear only as a helper definition, a seed `turn_off` target, a drift-check trigger `entity_id`, or a dashboard `entity:` row. No template (`{{`/`{%`) and no `condition: state` outside the macro reads it. The global switch never appears in `dashboards/`.
7. **Guests:** in the Nest Sleep branch, when `zone == 'main_floor'` and `input_boolean.guest_mode` is `on` and pre-wake is off, use the Comfort setpoint for the active side (heat or cool) and a reason starting `Guests` (for example `Guests: Comfort heat 72`). Pre-wake is checked first and still wins. The zone mode stays Sleep, so the price offset (Comfort only) still doesn't apply; the forecast boost (Comfort and Sleep) still does. Second floor and radiant zones unchanged.
8. **Test harness:** scripts now import a custom template, so the harness Jinja env must resolve `climate_control.jinja` when no loader is passed (default to a `FileSystemLoader` on `custom_templates/`), keeping explicit loaders working.

## Tasks

### task-1: Per-zone live gate
Add the seven helpers, the `climate_live(zone)` macro, switch every reader (decision 3, 4, 5) to it, make the seed script turn off the global and all seven zone switches, update the harness (decision 8) and `packages/climate/smart/README.md` (helpers, safety model, first run, a "trial one zone" note: radiant zones and the garage only until migration, because the Nests clash with the old Eco/resume automations).

**Files:** `custom_templates/climate_control.jinja`, `packages/climate/smart/helpers/climate_smart_switches.yaml`, `packages/climate/smart/scripts/climate_apply_zone.yaml`, `packages/climate/smart/scripts/climate_seed_defaults.yaml`, `packages/climate/smart/override/climate_override_detect.yaml`, `packages/climate/smart/control/climate_apply_drift_check.yaml`, `packages/climate/smart/notify/climate_dry_air_notify.yaml`, `packages/climate/smart/README.md`, `tests/smart_climate_harness.py`, `tests/test_smart_climate_*.py`.

**Acceptance criteria:**
- Macro truth table tested: global on → True for every zone; zone switch on with global off → True for that zone only; off/unknown/unavailable/missing for both → False; renders exactly `True`/`False`.
- Apply script, garage switch on and global off: the garage makes its climate call(s); every other zone only logs "Climate dry run" with zero `climate.*` calls.
- Apply script: the post-wait re-check stops the run when the zone is no longer live (both global and zone switch off), and continues when only the zone switch is on.
- Global on (zone switches off) → every zone live (existing live tests still pass).
- Unknown/unavailable on the zone switch with global off → dry run.
- Override detect: garage-only live leaves other zones on the "would mark Override" / "hold ended" dry-run path; a zone with its own switch on takes the live path.
- Drift check: has a `to: "on"` trigger for each of the seven zone switches; the tick with no zone live does nothing; the tick with only the garage live runs only `script.climate_apply_garage`; a start trigger runs all seven.
- Dry-air notify renders `(dry run)` unless a radiant zone is live (garage-only live still says dry run).
- Seed script turns off `climate_live_control` and all seven `climate_live_<zone>`.
- Static test per decision 6 passes and would fail on a direct `is_state('input_boolean.climate_live_control', ...)` in any package file.
- No `initial:` on the new helpers (existing static test covers it).
- README updated as above.

### task-2: Main-floor Sleep seed
Change the seed for `input_number.climate_main_floor_sleep_heat` from 72 to 70 and update any README defaults that state it.

**Files:** `packages/climate/smart/scripts/climate_seed_defaults.yaml`, `packages/climate/smart/README.md`, `tests/test_smart_climate_static.py`.

**Acceptance criteria:**
- A test asserts the seeded main-floor sleep heat is 70 and second-floor sleep heat is still 72.
- The value is within the helper's min/max (existing test).

### task-3: Guest Sleep rule
Add the branch in the macro per decision 7 and a README line.

**Files:** `custom_templates/climate_control.jinja`, `packages/climate/smart/README.md`, `tests/test_smart_climate_decisions.py`.

**Acceptance criteria:**
- Main floor, Sleep, Heating, guest on → temperature equals main-floor comfort heat; reason contains `Guests`.
- Same in Cooling → comfort cool.
- Guest on with pre-wake on → reason `Pre-wake` (pre-wake wins).
- Guest off → main-floor sleep heat (70 in the test baseline); guest `unknown`/`unavailable` → treated as off.
- Second floor and every radiant zone: decision identical with guest on and off, in Sleep.
- Main floor in Comfort or Away: identical with guest on and off.

### task-4: Dashboard live toggles
Add per-zone live toggles to the Smart Climate section of `dashboards/kohbo/climate/_climate_settings_popup.yaml`, matching the existing entity-row pattern (`kohbo_boolean_entity_layout.yaml` card_mod). Nest zone rows (main floor, 2nd floor) carry a warning in the name that they clash with the old Eco automations until migration. Update the section's dry-run description text to describe per-zone live. Do not add the global switch.

**Files:** `dashboards/kohbo/climate/_climate_settings_popup.yaml`, tests as needed.

**Acceptance criteria:**
- Seven toggle rows, one per `input_boolean.climate_live_<zone>`, using the existing row pattern.
- The two Nest rows' names warn about the Eco clash.
- `input_boolean.climate_live_control` does not appear anywhere under `dashboards/`.
- The popup YAML parses (existing dashboard tests pass).

## Out of scope
Migration (deleting old Eco/resume automations), turning any zone live, deploys.
