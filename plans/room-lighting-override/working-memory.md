# Working Memory — room-lighting-override

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- Main bedroom light is a Lutron Caseta dimmer; wall presses and device reports have no user and no parent_id; automations have a parent and no user; app toggles have a user. Condition lives in prd.md "Phase 0 result".
- Tests use a tolerant YAML loader (see tests/test_away_mode_regressions.py); a plain safe_load silently skips files with `!secret`.
- Resolver (#99): never add `state: "Auto"` on `input_select.house`; guard with not in [Away, Vacation].

## Active Gotchas
- `!include_dir_named` keys packages by basename; keep filenames unique.
- Entity ids of automations come from the alias, not the id. Keep alias slug == id.
- Live latch `main_bedroom_lights_manually_toggled` is on now; do not set it from anything.
- Never call HA services, never touch alarm/siren/Noonlight.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-30] Vacancy-off in main_bedroom_lights_off obeys the hand flag; Off transition obeys neither flag (review defect 3, plan Open decision 6) — docs affected: plan.md (folded), main_bedroom README, LEARNINGS — status: folded (packages/main_bedroom/README.md, packages/main_bedroom/LEARNINGS.md, docs/ROOMS.md, packages/CLAUDE.md)

## Task 3-5 notes
- Wall dim within 10s of an automation change is debounced away (stateless debounce, known trade-off). Rendered the manual-change templates with jinja2 against 10 fake triggers; all behave as pinned.
- `trigger.from_state` can be none on first state; the condition guards it.

## Task 2 notes (tests)
- Lightly-edited sabotage can miss: a `str.replace` on a repeated line may land in `conditions:` instead of `actions:`; confirm the sabotage parses and hits the intended block.
- Ordering invariant (test 7) parametrizes only over rooms whose `*_mode_off` turns occupancy off (found by filename); the others are not collected, so no skips.
- Duplicate-basename check passes repo-wide on master; no restriction to room prefixes was needed.

## PR 2 (kitchen) notes
- `kitchen_lights_motion_on` mode check is an `or` (Auto/Dim), so the on-gate test finds the mode by "first condition mentioning input_select.<room>", not by state Auto.
- Kitchen test fixtures differ per room: main light `light.kitchen_ceiling_lights`, off automation `kitchen_lights_to_off`; kept in MAIN_LIGHT / OFF_AUTO / ON_AUTOS dicts in the regression test.
- Deploy order: input_boolean reload before automations (new helper `kitchen_lights_manually_toggled`).

## PR 3 (garage) notes
- Garage `mode_off` never turns occupancy off, so the generic ordering-invariant test does not collect it; `test_garage_mode_off_never_forces_occupancy_off` covers it instead.
- `garage_lights_off` had no lights-on condition before and still has none; Off and Away share the `room_off` trigger id.
- Deploy order: input_boolean reload before automations (new helper `garage_lights_manually_toggled`); read the hand flag before and after the reload (initial removed).
- Ghost: `garage_lights_turned_off` entity is retired by the delete; reset flag state is whatever HA restores.

## PR 4 notes (developer A)
- Playroom: `playroom_lights_off` and `playroom_lights_motion_off` are disabled legacy twins; left untouched (no flag writes, no gate added). Enabled off automation is `playroom_lights_to_off`.
- Playroom `mode_auto` has no occupancy-off trigger; the bounce-guard test now uses a NO_OCC_OFF_TRIGGER tuple instead of a hardcoded kitchen/garage pair.
- Deploy order: input_boolean reload before automations (new helper `playroom_lights_manually_toggled`).
- Upstairs hallway: `motion_on` has no mode condition, so the on-gate test skips the mode index for rooms in NO_MODE_CONDITION; no mode condition added (behaviour). `to_off` had no hand-flag check before; the vacancy branch now needs it (kit item 6). New helper `upstairs_hallway_lights_manually_toggled` (input_boolean reload first).

- Office: JK-1219 NOT applied (Echo DnD, speech notifications and the DnD-off to mode_auto chain make Bedtime risky); mode_off left alone, test pins it. Manual detection watches the wall switch plus the ceiling bulbs group (EXTRA_LIGHTS). Deleted ids: `office_lighting_automation_on`, `office_lighting_automation_off` (file `office_lighting_automations_off.yaml`), `office_lights_manually_turned_off`. New helper `office_lights_manually_toggled` (input_boolean reload first). Live hand flag was on, so removing `initial:` changes nothing at restart.

## PR 4 notes (developer B)
- Main bathroom: `mode_auto` had a flat action list, so the occupancy-off branch needed a `choose` plus a new script `main_bathroom_mode_turn_on_auto`. The generic bounce test only found the branch by the condition id, so it now also asserts the occupancy-off trigger carries `<room>_unoccupied` (sabotage-proven).
- Main bathroom `lights_off` used to require occupancy off on the Off trigger too; room_off now passes alone (mode_off clears occupancy anyway). `main_bathroom_lights_auto` is still written because the dashboard shows it. `automation.main_bathroom_lights_motion_on` is toggled by mode_auto/mode_bedtime (automation.turn_on/off), so live "disabled" gets re-enabled at the next Auto.
- Deploy order: input_boolean reload before automations/scripts (new helper `main_bathroom_lights_manually_toggled`). Deleted id: `main_bathroom_lights_turned_off`.
- Laundry: room id `laundry_room`, package dir `laundry`; tests got a PACKAGE_DIR map for helper lookups. `laundry_room_lights_auto` has no reader, so manual_change only sets the latch. `lights_off` gained a house-flag condition (was only a trigger). Deploy order: input_boolean reload first (new helper `laundry_room_lights_manually_toggled`). `laundry_room_occupied` watches `switch.laundry_room_main_lights` (likely nonexistent); not touched.
- Dining room: created `MODE_ONLY_ROOMS` (test section 16) and `_assert_bounce_guard` (shared by the migrated-room and mode-only tests; it now also asserts the occupancy-off trigger carries id `<room>_unoccupied`). Other mode-only rooms append to the list; no kit, no MIGRATED_ROOMS. Dashboard row that must go: dashboards/kohbo/rooms/main_floor/dining_room.yaml line ~120 (`input_boolean.dining_room_lighting_automations`, "Lighting Automations"). Removed ids: `dining_room_lighting_automations`, `dining_room_lights_auto` (helper files deleted).
- Developer C mode-only rooms (basement, jr_suite, powder_room, mudroom_bathroom): all four listener audits clean, none deferred. None has a `mode_auto` occupancy-off trigger. jr_suite's occupied helper has no writer (hand/dashboard only), so mode_off is the only thing that clears it. powder_room and mudroom_bathroom have lights_off/fan_off that follow occupancy, but both already fire on Off. Also fixed a red dining_room test: its LEARNINGS named the removed helper ids and the dead-helper test scans packages/*.md (keep removed ids out of prose).
