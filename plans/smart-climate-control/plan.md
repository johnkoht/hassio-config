---
title: Smart Climate Control
slug: smart-climate-control
status: shipped
created: 2026-10-14
has_pre_mortem: true
has_review: true
has_prd: true
---

# Smart Climate Control

## Problem

Climate automation today is one move: switch the two Nests between the Eco preset and normal, based on occupancy, bedtime and energy prices. Nothing sets temperatures, nothing adapts to the season or the forecast, and the 5 radiant floor zones (Ecobee) have no automation at all. The house doesn't spread heat and cooling evenly, so whole-floor on/off control leaves rooms uncomfortable.

The Eco approach is also unreliable. On 2026-10-13/14 we found that the Nest (Google SDM) changes its own HVAC mode, often to heat, within seconds of HA turning the Eco preset on or off. PR #22 works around this by saving the mode before Eco and restoring it on resume, but that is a patch on a mechanism we shouldn't depend on.

This plan rebuilds a design that was drafted earlier and lost (only a summary survived), folded together with the older `docs/climate_automation_plan.md` and the Eco finding.

## Goal

Every climate zone (2 Nests + 5 radiant) is driven by a single mode state machine that sets HVAC mode and setpoints explicitly from comfort profiles. The setpoints follow the season automatically and you can change them from the dashboard. A manual change is respected until the next house event. The house starts heating or cooling ahead of time when the forecast calls for it. The old Eco/resume and energy-price automations are retired.

## Approach

Six layers, each one file group under `packages/climate/`, each one job:

1. **Comfort profiles (helpers).** `input_number` setpoints for each profile (Comfort / Sleep / Away), each side (heat / cool) and each zone group (main floor, 2nd floor, radiant). Heat-only for the radiant zones. No `initial:`, so dashboard edits survive restarts. A master `input_boolean.climate_automations` kill switch.
2. **Mode state machine.** One `input_select.climate_mode_<zone>` per zone (Comfort / Sleep / Away / Off / Override). Mode changes are driven by existing house signals: `house_occupied`, `bedtime`, `nearly_home`, `vacation_mode`, `guest_mode`, room occupancy, and in-bed/awake. Only the state machine writes the mode. Everything else reads it.
3. **Zone controllers.** One `script.climate_apply_zone` takes a zone and runs whenever that zone's mode, the season or a profile setpoint changes. It reads the zone's mode, season and profile, then calls `climate.set_hvac_mode` and `climate.set_temperature` explicitly. **It never uses the Nest Eco preset.** Away becomes a wide setpoint band, not Eco. It only writes when the target differs from the current value, which keeps calls to the Nest API down. Radiant zones get a longer lead time because of slab thermal mass.
4. **Override detection.** A state change on a climate entity with no automation in its HA context, made by a person or by the Nest itself, sets that zone's mode to Override. An Override clears on the next house event (bedtime on/off, wake, arrive, depart), not on a timer. At the start it only logs repeated overrides; it doesn't learn from them yet.
5. **Seasonal switching.** A `statistics` sensor gives the 7-day rolling mean of `sensor.tempest_temperature`. `input_select.climate_season` (Auto / Heating / Cooling) sits on top of it, with hysteresis at the crossover so the season doesn't flap. Auto follows the sensor. Picking Heating or Cooling pins it.
6. **Predictive pre-conditioning (moderate).** Use the existing Pirate Weather hourly forecast sensor to look 3–4h ahead. If a big swing is coming, start the next mode's setpoint early, before wake-up, an expected arrival, or the evening temperature drop. Thresholds go in `input_number`s, not hard-coded.

Energy prices stop toggling Eco. Instead they shift the active setpoint by a few degrees in the cheaper direction while prices are high, with the 15-min dwell kept from PR #22. Before any of this replaces the old system, every new automation runs in parallel in **log-only mode** (a `climate_dry_run` boolean), so the decisions can be compared with what the old automations do on real days.

**Why this over the alternatives:**
- **Better Thermostat or Versatile Thermostat (HACS):** they are built for single valve or room control and don't model house modes. That's more moving parts and still needs the mode layer.
- **Keep the Eco preset and harden the restore:** treats the symptom and can't drive the radiant zones.
- **Per-room smart vents:** a separate decision, out of scope here.

**Decisions (John, 2026-11-24):**
- **Starting setpoints.**
  - Main floor and 2nd floor: heat 72–73°F, cool 75–76°F.
  - Away: a 65°F floor and a 79°F ceiling.
  - Sleep: 72°F.
- **Radiant zones use temperature holds.** The Ecobees have no schedule of their own, so HA is the only writer.
- **Radiant comfort is 67–68°F.**
  - When it's very cold outside, the target rises to 69–71°F. The cutoff is an outdoor-temperature helper, starting at 15°F.
  - Every radiant target is clamped to a **hard cap of 71°F**, whatever the mode, profile, forecast or price. Hotter floors dry the air out and damage the wood floors.
  - The radiant slabs hold steady and don't do fast swings. Fast changes (arrivals, price shifts, short pre-heats) go to the Nests.
- **Humidity guard.**
  - When `sensor.average_indoor_humidity` drops below 30% (a helper), the radiant zones skip the cold-weather bump and stay at comfort, and John gets a push.
- **Garage: frost guard at a fixed 55°F.** It has no Comfort, Sleep or Away modes.
- **The kids' space heaters are out of v1.** They're logged during the soak.
- **Turning the radiant zones on.** They're off now. HA turns them to `heat` the first time the season reads Heating, and John may also turn them on by hand before that.

**Privacy:** the repo is public. Timing comes from live signals (bedtime, wake, presence) and a learned wake time, never from a household schedule written into YAML, plans or docs.

## Tasks

1. **Inventory and data pull.** Confirm the 5 radiant zones (`climate.jr_suite`, `main_bedroom`, `ninos_bedroom`, `basement`, `garage`) and whether a 6th Ecobee exists (DEVICES.md lists 6). The Nest rates can be measured now. The radiant zones were off as of 2026-11-24, so their rates get measured in their first week or two of running, within the dry-run soak. Check the supported `hvac_modes` and presets on the Nest and Ecobee. Ask `homelab` to pull from the recorder each zone's thermal drift and the minutes it takes to move 1°F, so lead times are based on real numbers.
2. **Helpers (layer 1).** Profile setpoints, `climate_automations`, `climate_dry_run`, per-zone mode selects and season select, with dashboard-friendly names. Starting values come from the setpoint table in `docs/climate_automation_plan.md`.
3. **Mode state machine (layer 2).** One automation file per transition (e.g. `climate_mode_sleep_on_bedtime.yaml`), following the existing room-mode pattern (`*_mode_auto` / `*_mode_off`), with the condition order global → room → feature.
4. **Zone controller (layer 3).** `script.climate_apply_zone`, which is idempotent, uses explicit mode and setpoint, writes nothing when nothing changed, and does nothing in dry-run except write a logbook entry. Regression tests in `tests/` like `test_nest_eco_regressions.py`, including "never calls `set_preset_mode: eco`".
5. **Override detection and resume (layer 4).** Context-based detection, plus an event-based resume automation for each house event.
6. **Seasonal switching (layer 5).** The statistics sensor, the season select with hysteresis, and a re-apply when the season changes.
7. **Predictive pre-conditioning (layer 6).** Read the hourly forecast, compute the lead time from task 1's data, fire the pre-condition, and keep a learned wake time in `input_datetime.predicted_wake_time` (median of the last 7 days).
8. **Energy-price setpoint offset.** Replace the four Eco automations with an offset inside the zone controller.
9. **Dry-run soak.** Run in parallel with the old automations for at least a week of mixed weather. Compare logbook decisions with what actually happened, then tune.
10. **Migration.**
    - Turn off `climate_dry_run`, then retire the old automations and scripts: `automation/house/climate/*`, `packages/climate/*/*_eco*`, `*_resume*`, `*_morning_start`, `second_floor_resume_before_bed`, and the legacy `climate_away` script.
    - Delete them rather than relying on `initial_state` (removing `initial_state` doesn't re-enable a disabled automation).
    - Update `dashboards/kohbo/climate/_climate_settings_popup.yaml`, which points at `automation.main_floor_climate_to_eco`, plus the climate README and `packages/climate/LEARNINGS.md`.
11. **Dashboard controls.** A per-zone mode chip, a season override, a profile setpoint editor, and the master and dry-run toggles in the climate settings popup.

## Risks

- **The Nest changes HVAC mode on its own anyway**, not just around Eco: the zone controller re-applies whenever a climate entity changes outside our context and the mode isn't Override. Watch for fights between the Nest and HA during the soak.
- **Override detection confuses the Nest's own changes with a person's**, since both arrive with no HA context: accept for v1, because both should be respected until the next event. Log both kinds and review during the soak.
- **Too many Google SDM API calls**, which are rate-limited: write only when the target differs, and debounce re-applies.
- **Radiant slab lag makes reactive control overshoot**: lead times come from the recorder data (task 1), and radiant zones only change at mode changes, never in a short loop.
- **Kids' space-heater automations** (Nino, Gianluca) **fight the radiant zones**: leave them out of v1, but log both in the soak and decide whether to bring them in.
- **Big-bang cutover breaks comfort**: dry-run soak first, the master kill switch, and the old automations stay in git so they can be brought back.
- **PII leaks into the public repo**: no schedules in config, plans or commits. Grep the diff before each push.
- **Existing exposure:** `docs/climate_automation_plan.md` already holds household schedule details in a public repo. Fix it separately, and ask before rewriting history.

## Build corrections (pre-mortem + review, 2026-11-24)

The pre-mortem and review found engineering faults in the layer text above. John's decisions are unchanged. `prd.md` supersedes the layer text wherever they differ:

- **Dry-run polarity is inverted.**
  - `input_boolean.climate_live_control` must be on for any `climate.*` write. Anything else is dry-run. A fresh boolean is off, so that's safe.
  - It replaces `climate_dry_run`.
  - The master `climate_automations` also starts off.
  - The live toggle is not on the dashboard in this build.
- **Override detection is value-based, not context-based.**
  - The Nest writes every state change with a fresh context (verified in the installed integration), so context can't tell HA from a person.
  - Override = differs from HA's decision and lands more than 180 s after HA's last write.
  - An Ecobee hold ending (preset leaves `temp`) is re-applied, not flagged.
- **One mode resolver** (the `house_mode_resolve` pattern) instead of one file per transition.
- **A seed script** sets the starting values from the Decisions block only. Helpers have no `initial:`, so they start at their minimum.
- **Single-setpoint control.**
  - Heating → `heat`, Cooling → `cool`; the Away floor applies in Heating and the ceiling in Cooling.
  - No `heat_cool`, and never the Eco preset.
  - Radiant zones are hands-off in Cooling.
- **Per-zone serialised controller.** A re-apply cap (no drift or hold re-write within 15 min of the last write) stops a Nest-vs-HA ping-pong.
- **Two-stage Away.** First a setback; the full Away band only after the house has been empty past a configurable delay, or on Vacation. Covers the measured main floor recovery of about 3.5 h.
- **Scope.** Task 9 (soak) is operational and task 10 (migration) runs after it. Neither is built in this change, and the old automations stay untouched.

On approval → /approve → /ship smart-climate-control
