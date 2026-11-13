---
title: Holiday Automation Cleanup
slug: holiday-automation-cleanup
status: approved
approved: 2026-11-13
approval_note: "John approved in the parent session 2026-11-13 ('Approve any plans. Don't wait on me unless not confident or risky.') with the recommended defaults for every open question: Q1 front yard follows the trees until bedtime/away; Q2 drop confirmation on the 4 playroom plug tiles; Q3 add the 'Start and stop Christmas on its own' toggle, on by default; Q4 keep ui_test untouched; Q5 tree = plug 4, repoint the energy meter; Q6 Christmas turns Halloween off."
created: 2026-11-12
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-1229
---

# Holiday Automation Cleanup

## Problem

The Christmas automations won't start on their own this year, and they're tangled up with the Halloween ones. Five problems, each checked against the repo and live HA on epicurus on 2026-11-12:

1. **The Christmas master group contains the front yard.** `switch.christmas_lights` = trees + playroom + `switch.front_yard_holiday_decorations` (`packages/holidays/christmas/lights/christmas_lights_group.yaml:5-10`; live `entity_id` attribute confirms it). `light.christmas_lights` is a UI `switch_as_x` wrapper of that group (live config entry), so "Alexa, turn off the Christmas lights" or the group toggle turns off the Halloween inflatables.
2. **The season never auto-starts or auto-stops.** `christmas_enabled` and `christmas_disabled` have `initial_state: false` (`christmas_enabled.yaml:9`, `christmas_disabled.yaml:9`). Both are `off` live, and both last ran on 2025-01-18. Last season was switched on and off by hand. Removing `initial_state` alone won't fix it, because HA restores the last runtime state, so each one has to be turned on once. The disable window `(m==1 and d>7) or (2<m<12)` skips February (`christmas_disabled.yaml:25`).
3. **The Halloween off automation runs all year.** `halloween_lights_turn_off` (`halloween/halloween_lights.yaml:50-85`) runs at 22:00, at bedtime and at startup, and nothing checks whether it's Halloween season. Live: it last ran 2026-11-07 04:00Z, after the season had ended. In December it will turn off the Christmas front yard at 22:00. Its startup branch also depends on `switch.front_yard_holiday_decorations` reading `on` at HA start, before Z-Wave JS may have loaded the plugs. The time windows of the on and off automations don't overlap, so the only startup risk left is that stale read.
4. **Dead and dangerous leftovers.**
   - `christmas_shortcut_button` (`modes/christmas_shortcut_button.yaml`): disabled live, and its IKEA button is `unavailable`.
   - `handle_ikea_unresponsive` (`lights/christmas_lights_on.yaml:41-76`): enabled, but it has never run (`from: "unresponsive"` isn't an HA state). **Correction to the ticket:** the Tradfri plugs aren't dead. Plugs 2 and 4 are now the kitchen **Air Fryer** and **Toaster Oven** (`rooms/main_floor/kitchen.yaml:136-142`), live and `on`. If anyone "fixed" the trigger, this automation would switch the kitchen appliances on and off with Christmas. Delete it.
   - The redundant enable path: `activate_christmas_season` (`christmas_season.yaml:17-36`) does the same job as `christmas_manually_enabled`.
   - The "Christman" aliases (`christmas_enabled.yaml:38`, `christmas_disabled.yaml:38`). The registry keys entity IDs by `id`, so fixing the alias changes only the friendly name. The live IDs `automation.christman_manually_*` stay unless they're renamed in the registry.
   - Legacy root `entity_id:` under actions throughout `packages/holidays/christmas/**`, and several automations per file.
5. **The Christmas spots scene is incomplete.** `scene.front_yard_christmas` is a Hue app scene. It's `unknown` live and covers only spots 1–10, because spots 11–14 are ZHA lights. Halloween has an HA scene captured from the live lights (`scenes/holidays/halloween_front_yard_spots.yaml`). Christmas has none.

**Ticket items that are already done or were wrong:**

- **`automation.turn_on_holiday_lights` / `turn_off_holiday_lights`:** they aren't in `core.entity_registry`, `core.restore_state` or `/api/states` on epicurus. They didn't survive the cutover. The commented YAML at `packages/outdoor_lighting.yaml:485-513` can just be deleted.
- **"The xmas daily-energy sensors aren't defined anywhere":** they are, in `packages/energy/sensors/device_daily_energy_meters.yaml:62-90,135-139`, and they're live (`sensor.big_xmas_tree_daily_energy` etc.). What's actually open is a plug ID mismatch, see Q5.
- **`lovelace.ui_test`:** out of scope. John is keeping it as is (2026-11-12), so this plan leaves it untouched.

**Dashboard defects (all confirmed):**

- `kohbo_device_smart_plug_entity.yaml:6-12` renders every non-`on` state as "Off", including `unavailable`. The template is used on 17 pages.
- On the playroom page (`rooms/main_floor/playroom.yaml:121-126`), the plug 18 "Bay Window" tile uses `sensor.smart_plug_16_power`. Plug 18 doesn't meter, and the registry has no `sensor.smart_plug_18_power`. All four plug tiles there use `confirmation: true`.
- `rooms/active_rooms.yaml` is included twice in `kohbo/kohbo.yaml` (`:40` and `:44`), giving two views with path `rooms-active`. No numeric `/dashboard-kohbo/N` links exist, so removing one is safe.

## Goal

Christmas starts by itself at 02:00 on Dec 1 and stops after Jan 7. The Christmas and Halloween automations each control the front yard only in their own season. Turning off the "Christmas Lights" (switch, light wrapper or Alexa) leaves the front yard alone outside Christmas. The dead or dangerous holiday automations are gone, and the dashboard tiles show real plug states.

## Approach

**Use the season boolean as a condition instead of switching automations on and off.** Today `christmas_enable_automations` / `christmas_disable_automations` turn four automations on and off, so the real on/off lives in registry state the repo can't see. The same fragility hit `initial_state`. And the season scripts override the "Lights On in the Evening" / "Lights Off at Bedtime" toggles in the Holidays settings popup. Instead:

- `christmas_activated` and `turn_on_christmas_lights` get an `input_boolean.christmas_season_active = on` condition. The off paths stay ungated, so turning lights off always works.
- `christmas_enabled` / `christmas_disabled` only flip the season boolean on dates.
- A new `christmas_season_ended` turns `christmas_active` off, which replaces `christmas_manually_disabled`.
- The two scripts, `activate_christmas_season` and the manual enable/disable pair, are deleted.

This costs a one-time enable of six automations, versus two under the lighter fix. The lighter fix is to drop `initial_state` and keep the toggling. It works, but it keeps the hidden state.

**Split the front yard out of the master group.** `switch.christmas_lights` becomes trees + playroom. It keeps the same `unique_id`, so `light.christmas_lights` and Alexa keep working. `turn_on_christmas_lights` and `turn_off_christmas_lights` target `switch.front_yard_holiday_decorations` explicitly, next to the master group. The front yard then follows the Christmas schedule (dusk to bedtime or away) only while `christmas_active` is on.

**Give Halloween a season gate.** Add `halloween_season_active = on` to `halloween_lights_turn_off`. Drop its "any decoration on" condition, because turning off plugs that are already off does nothing, and that removes the stale read at startup. Add a "season turned off → decorations off" trigger, with a guard that skips it if Christmas season is on.

**Split the PRs by risk.** Everything that has to be live by Dec 1 goes first.

## Tasks

### PR 1: package fix (needs approval; must deploy before Nov 30)

1. **Group split.** Remove the front yard from `christmas_lights_group.yaml`. Have `turn_on_christmas_lights` / `turn_off_christmas_lights` (and the `christmas_not_activated` safety-off) also target `switch.front_yard_holiday_decorations`.
   Tests:
   - Replace `test_christmas_uses_the_group` with `test_christmas_master_group_excludes_front_yard`.
   - Add `test_christmas_lights_automations_target_front_yard`.
2. **Season gating.**
   - Remove `initial_state` from `christmas_enabled`/`christmas_disabled`, and fix the window to `not (m == 12 or (m == 1 and d <= 7))`.
   - Give those two automations the startup trigger `id: startup` (per LEARNINGS 2026-10-17).
   - Add the season conditions, add `christmas_season_ended`, and delete the scripts plus `activate_christmas_season` and the manual pair.
   Tests:
   - No `initial_state` under `packages/holidays`.
   - Render both date templates with jinja2 for one day in each month (Feb included) and Dec 1 / Jan 7 / Jan 8.
   - The on paths are gated on `christmas_season_active`.
   - Nothing in the repo references `automation.turn_on_christmas_lights` etc. via `automation.turn_on/off`.
3. **Halloween gate.** Add the season condition to `halloween_lights_turn_off`, drop the group-on condition, and add the season-off trigger with a Christmas guard. When Christmas season turns on, it turns `halloween_season_active` off (Q6 default).
   Tests: extend `test_halloween_restart_respects_time_of_day`; add `test_halloween_off_is_season_gated`.
4. **Delete the dead automations.**
   - Delete `christmas_shortcut_button.yaml` and `handle_ikea_unresponsive`.
   - Delete the commented `turn_on/off_holiday_lights` block in `outdoor_lighting.yaml`.
   Tests: no `tradfri_smart_plug` or shortcut `device_id` under `packages/holidays`, so the kitchen appliances stay out of holiday automations.
5. **Hygiene.**
   - Fix the "Christman" aliases (by deletion, where the automation goes away).
   - Use modern `target:` syntax and one automation per file in `packages/holidays/christmas/**`, with the header comments from `packages/CLAUDE.md`.
   - Keep every surviving `id` and alias, so the entity IDs and the settings popup rows stay the same.
   Test: `tests/run.sh --modern` reports no inline-`entity_id` warnings under `packages/holidays`.
6. **Docs and dashboard, in the same PR.**
   - `holidays/christmas.yaml:17-41`: drop the in-season conditional on "All Christmas Lights".
   - Holidays `README.md`: update the caveats and settings popup notes.
   - Settings popup: add a "Start and stop Christmas on its own" row for `christmas_enabled` and `christmas_disabled` (Q3 default).
   - `packages/holidays/LEARNINGS.md`: lines 6 and 8 are now resolved.
   - `docs/AUTOMATIONS.md:59`.
7a. **Family room tree meter (Q5 default).** Repoint `smart_plug_14_daily_energy` (`device_daily_energy_meters.yaml:135-139`) to `sensor.smart_plug_4_family_room_summation_delivered`. Keep the name and the entity ID.
   Test: the meter's `source` names a plug in `switch.christmas_trees`.

### Live steps after PR 1 deploys (agent via REST with John's go-ahead, or John in the UI; no restart)

7. **Reload Groups** (`group.reload`), because `--reload` skips groups. Check that the live `switch.christmas_lights` `entity_id` attribute no longer lists the front yard.
8. **Enable once:** `christmas_enabled`, `christmas_disabled`, `christmas_activated`, `christmas_not_activated`, `turn_on_christmas_lights`, `turn_off_christmas_lights`. All six are `off` live today. Then check `/api/states` shows `on`.
9. **Remove orphaned registry entries** for the deleted automations and scripts: `christmas_shortcut_button`, `handle_ikea_unresponsive`, `activate_christmas_season`, `christman_manually_*`, `script.christmas_enable/disable_automations`. Remove only entries whose YAML is gone, not ones that are just unavailable.
10. **Dry run.** Turn `christmas_season_active` on, then off. Check that the front yard plugs don't change state outside Christmas and that `christmas_active` clears. Use the Logbook, not History (memory).

### PR 2: dashboard only (auto-merge per standing rule; independent, any time)

11. `kohbo_device_smart_plug_entity`: show "Unavailable" / "Unknown" instead of "Off". Make the watts output safe when the power sensor is missing or unavailable.
12. Playroom: remove `power_sensor` from the plug 18 tile, and drop `confirmation: true` from the four plug tiles (Q2 default).
13. `kohbo.yaml`: drop the duplicate `active_rooms.yaml` include at `:44`.
    Test: add a view-path uniqueness test to `test_dashboard_*`, so a duplicate path fails.
14. Deploy, then `touch dashboards/kohbo/kohbo.yaml` on the host (`deploy.sh` does this).

### John-only steps

15. **December: capture the Christmas spot colors.** Set spots 1–14 by eye. Then an agent snapshots them into `scenes/holidays/christmas_front_yard_spots.yaml` the way the Halloween scene was done. A follow-up PR adds a `christmas_hue_scene` automation modeled on `halloween_hue_scene` (gated on season + accent lights) and points the Christmas page tile at the new scene. Spot 12 (`light.hue_spot_12_light`) is `unavailable` live, so the scene will lack it unless it's fixed first.
16. **Voice check.** After step 7, say "Alexa, turn off the Christmas lights" and confirm that the front yard stays as it was.

## Open Questions

Each question has a recommended default. Approving the plan as written accepts all of them.

1. **The front yard at 22:00 in December.** With the split, the Christmas front yard follows dusk to bedtime or away, like the trees. **Default: no 22:00 hard-off.** The front yard stays on until bedtime or away, the same as the trees, which is how Christmas has always worked.
2. **Playroom plug confirmations.** **Default: drop `confirmation: true`** from the four playroom plug tiles. They're window lights, a wrong tap costs nothing, and the Christmas page already controls the same plugs without it.
3. **A season auto-start toggle.** **Default: add it.** One "Start and stop Christmas on its own" row (`christmas_enabled` + `christmas_disabled`) in the Holidays settings popup, on by default. Once `initial_state` is gone the toggle sticks, so you can skip a season without editing YAML.
4. ~~`lovelace.ui_test`~~: answered 2026-11-12. Keep it, untouched.
5. **Which plug powers the family room tree?** `switch.christmas_trees` and the Christmas page use plug **4**. `sensor.family_room_xmas_tree_daily_energy` reads plug **14**, which the family room page calls "South Wall Outlet". **Default: plug 4 is the tree. Repoint the meter to `sensor.smart_plug_4_family_room_summation_delivered` (task 7a).** Long-term statistics in the recorder:
   - Plug 14 carried a tree in the **2024** season (peak about 200 W, 46 kWh in Dec 2024). It has drawn exactly 0 W every month since Feb 2025, including Dec 2025.
   - Plug 4 is the one the Christmas group has switched since then. Its metering read a stuck −1 W until 2026, so Dec 2025 has no usable numbers for it. It has reported real values since Sep 2026 (peak 20 W).
   - Nothing reads as a tree right now: all three tree plugs are at 0 W this week.
6. **Overlapping seasons.** **Default: yes.** When Christmas season turns on (on its own or by hand), Halloween season turns off, so only one season controls the front yard. The Christmas guard in the Halloween season-off trigger still applies.

## Risks

- **Six automations stay disabled after deploy, and Dec 1 silently does nothing.** Mitigation: step 8 is a required checklist item with a live `/api/states` check. Run steps 7–10 at least a few days before Nov 30.
- **Group membership doesn't reload with `--reload`.** Mitigation: step 7 reloads Groups and checks the live attribute.
- **Deleting automations leaves orphaned `_2`-squatting registry entries.** Mitigation: step 9 removes only orphans whose YAML is gone.
- **The playroom/Christmas group toggles assumed the front yard was in the master group.** Mitigation: the PR 1 grep step plus the new tests. The Christmas page's front yard row already targets the decorations group directly.
- **No restart.** Every step is a reload. John owns restarts.

On approval → /approve → /ship holiday-automation-cleanup
