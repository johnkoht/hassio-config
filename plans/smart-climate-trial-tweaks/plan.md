---
title: Smart Climate Trial Tweaks
slug: smart-climate-trial-tweaks
status: in-progress
created: 2026-11-24
has_pre_mortem: false
has_review: false
has_prd: true
---

# Smart Climate Trial Tweaks

## Problem

The smart climate controller (PR #209) is live in dry-run, and three of John's follow-up decisions (2026-11-24) aren't in the code yet:

1. **Live control is all-or-nothing.** One `input_boolean.climate_live_control` covers every zone. John wants to trial one zone live, starting with the garage frost guard, before the migration. The radiant zones have no old automation to clash with; only the two Nests clash with the old Eco/resume automations.
2. **Main-floor Sleep.** It should be 70°F (2nd floor stays 72). The live helper was set to 70 by hand on 2026-11-24, but the seed script still writes 72.
3. **Guests.** When `input_boolean.guest_mode` is on, the main floor's Sleep should use its Comfort setpoint instead, so guests aren't set back overnight.

## Goal

- Each zone can be put live on its own, while every other zone stays dry-run.
- The seed script writes 70 for main-floor Sleep heat.
- With guest mode on, the main floor in Sleep targets its Comfort heat and cool setpoints. The logbook reason says "Guests".

## Approach

- **Per-zone live switches.** Add one `input_boolean.climate_live_<zone>` per zone, with no `initial:`.
  - A zone is live only when the global `climate_live_control` is on, or when its own switch is on.
  - Anything else, including unknown or unavailable, means dry-run. This keeps the PR #209 inversion.
  - The check goes through one shared definition used by the apply script, the drift check, override detection and the dry-air message, so the paths can't disagree.
  - The seed script turns every live switch off.
  - The switches go in the climate settings popup next to the global one. The global switch stays off the dashboard.
- **Main-floor Sleep.** Change the seed value to 70.
- **Guests.** Add the branch in the `custom_templates/climate_control.jinja` Sleep step:
  - when the zone is `main_floor` and `guest_mode` is on, use the Comfort setpoint;
  - pre-wake still wins over it;
  - the radiant zones and the 2nd floor are unchanged.

## Tasks

1. **Per-zone live gate.** Add the helpers, the shared live check, and the switch to it at every current `climate_live_control` reader. Update the seed script and the README.
   - Tests:
     - The garage switch on with the global switch off writes only the garage.
     - Every other zone still only logs.
     - Unknown counts as dry-run.
     - The global switch on makes every zone live.
2. **Main-floor Sleep seed.** Change the seed value from 72 to 70 and update the README's defaults table.
   - Test: the seed value.
3. **Guest Sleep rule.** Add the macro branch, the "Guests" reason text and a README line.
   - Tests:
     - Guest on in Sleep gives Comfort for the main floor.
     - The 2nd floor and radiant zones are unchanged.
     - Guest off gives 70.
4. **Dashboard.** Add the per-zone live toggles to `dashboards/kohbo/climate/_climate_settings_popup.yaml`.

## Risks

- **A Nest zone goes live while the old Eco automations still run, and they fight.** The README says to trial only the radiant zones and the garage until the migration, and a Nest zone's switch is labelled to warn.
- **The live check drifts between code paths.** Use one shared definition, plus a static test that no file reads `climate_live_control` directly.
- **Old commits referenced by this plan move in the history rewrite.** The plan cites PR numbers only, not commit SHAs.

On approval → /approve → /ship smart-climate-trial-tweaks
