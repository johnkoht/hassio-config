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
