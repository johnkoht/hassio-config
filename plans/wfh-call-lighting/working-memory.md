# Working Memory — wfh-call-lighting

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*

## Active Gotchas
- [setup] The office AL entry controls `light.office_light_1..4` (the ceiling bulbs) only. `light.office_office_lamp` is onoff-only and not AL; never send it colour or brightness.
- [setup] `office_lights_manual_change` ignores a change when the new state's context has a `parent_id` and no `user_id`, or an `:al:` id. Our `light.turn_on` inside an automation is therefore ignored; do not add context plumbing.
- [setup] AL `async_turn_on` resets manual control and force-adapts; the resume needs no light commands.
- [setup] Entertainment mode toggles the same AL switch: end and reset must call `switch.turn_on` only when `input_boolean.entertainment_mode` is off, and always clear the flag.
- [setup] Test loader pattern: `tests/test_room_lighting_override_regressions.py` (`ALL`, `auto()`, `conds_for`, `_ctx`, `_st`, `_trigger`) is the style to copy.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
- [setup] MISSING_CONTEXT in plan: the lamp is not dimmable (see Active Gotchas); call-spanning-dusk needs a second start trigger. Both are in the plan's ship addendum.

## Decision Ledger
*(Builder rulings that supersede or refine a documented rule. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`.)*
- [Task 1] NOTHING_NOVEL - Task 1
- [Task 2] NOTHING_NOVEL - Task 2
- [Task 3] NOTHING_NOVEL - Task 3
- [Task 4] NOTHING_NOVEL - Task 4

## Sabotage results (task-5)
Each edit was made, `tests/test_office_call_lighting.py` run, then the file restored with `git checkout`.

| # | Sabotage | Tests that went red |
|---|---|---|
| 1 | remove `office_call_al_paused` condition from start | `test_start_has_condition[input_boolean.office_call_al_paused-off]`, `test_start_feature_switch_before_al_gate_template` |
| 2 | remove flag condition from end | `test_end_requires_flag` |
| 3 | unguarded `switch.turn_on` in end | `test_resume_shape[end]` |
| 4 | remove DnD condition from start | `test_start_has_condition[input_select.office-DnD]`, `test_start_gate_order_global_room_latch_occupancy_mode` |
| 5 | remove `office_lights_manually_toggled` condition from start | `test_start_has_condition[input_boolean.office_lights_manually_toggled-off]`, `test_start_gate_order_global_room_latch_occupancy_mode` |
| 6 | add `light.office_office_lamp` to the start target | `test_start_action_order`, `test_start_targets_only_ceiling_bulbs` |
| 7 | `initial: false` on `office_call_lighting` | `test_no_helper_has_initial` |
| 8 | end clears the flag before AL turn_on | `test_resume_shape[end]` |
| 9 | remove the 12 h `stuck` trigger from reset | `test_reset_triggers` |
| 10 | unguarded `switch.turn_on` in reset | `test_resume_shape[reset]` |

All ten went red; none stayed green.
