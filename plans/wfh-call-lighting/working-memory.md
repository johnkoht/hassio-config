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
