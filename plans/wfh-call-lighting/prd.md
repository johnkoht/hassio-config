# PRD: WFH Call Lighting

## Goal

When John is on a camera or audio call in the occupied office and Adaptive Lighting (AL) has moved the ceiling bulbs off daylight, pause AL and set the bulbs to 3000K at 100%; 3 minutes after the call ends, hand control back to AL. Plan: `plan.md` (including its ship addendum, which wins over the body). Review: `review.md`. Risks: `pre-mortem.md`.

## Shared constraints (all tasks)

- Modern HA syntax, one automation per file, filename == id, header comment of title + 1-3 lines, no PII.
- New files live in `packages/office/call_lighting/` with unique basenames `office_call_lighting_*`.
- Never use `initial:` on the four helpers. Never target `light.office_lights` (ZHA group), the lamp, shelf lights or El Gato.
- Never write `input_boolean.office_lighting_automations` or `office_lights_manually_toggled` from these automations.
- Tests run from `tests/`: `/Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q`. Baseline on master: 1057 passed, 9 skipped.
- Do not call HA services, ssh, deploy, or restart anything.

## Tasks

### task-1: Helpers
`packages/office/call_lighting/office_call_lighting_helpers.yaml` defines `input_boolean.office_call_lighting` (feature switch), `input_boolean.office_call_al_paused` (flag), `input_number.office_call_color_temp` (min 2700, max 6500, step 100, kelvin) and `input_number.office_call_brightness` (min 30, max 100, step 5, %).
- AC: all four exist with those ids and ranges; none has `initial:`.
- AC: header comment states the deploy seeding (3000 / 100) in at most 3 lines.

### task-2: Start automation
`office_call_lighting_start.yaml`, id `office_call_lighting_start`, mode single.
- AC: two triggers: `input_select.office` to `DnD` for 10 seconds (id `dnd`), and numeric_state on `switch.adaptive_lighting_office` attribute `color_temp_kelvin` below `input_number.office_call_color_temp` (id `dusk`).
- AC: conditions in order global to feature: `lighting_automations` on, `house_occupied` on, `office_lighting_automations` on, `office_lights_manually_toggled` off, `office_occupied` on, `input_select.office` DnD, `john_dnd` on, `input_select.house` not Bedtime, `entertainment_mode` off, `office_call_lighting` on, `office_call_al_paused` off, `switch.adaptive_lighting_office` on, `switch.adaptive_lighting_sleep_mode_office` off, and the AL gate template (kelvin attr below the setting, or brightness attr more than 5 below; missing attributes mean not below).
- AC: actions in order: `input_boolean.turn_on` the flag, `switch.turn_off` the AL switch, then `light.turn_on` on `light.office_ceiling_bulbs` only with `color_temp_kelvin` and `brightness_pct` templated from the two numbers, only when that light is on.

### task-3: End and reset automations
`office_call_lighting_end.yaml` (id `office_call_lighting_end`) and `office_call_lighting_reset.yaml` (id `office_call_lighting_reset`).
- AC end: triggers `input_select.office` to `Auto` or `Off` for 3 minutes, and `input_boolean.office_occupied` to off; condition flag on; actions: if `input_boolean.entertainment_mode` is off then `switch.turn_on` the AL switch; always turn the flag off. No light commands.
- AC reset: triggers flag on for 3 hours (id `long`), flag on for 12 hours (id `stuck`), `homeassistant` start, and event `automation_reloaded`; conditions flag on, and (trigger id `stuck`, or the office is not in DnD); same guarded resume and unconditional flag clear as end.
- AC: neither file contains a `light.` action. End's resume order is `switch.turn_on` first, then the flag off (tested).

### task-4: Dashboard and docs
- AC: `dashboards/kohbo/rooms/main_floor/office.yaml` Quick Settings gains rows for `input_boolean.office_call_lighting` (boolean layout) and the two `input_number`s, under the Adaptive Lighting rows.
- AC: `packages/office/README.md` gets a short "Call lighting" section; `docs/ROOMS.md` one line; `packages/office/LEARNINGS.md` a section (including the residual late-Hue-report latch risk and its logbook check) covering the gate, the lamp being onoff, the entertainment guard, the accepted mid-call entertainment case and the latch reasoning.

### task-5: Tests and sabotage
`tests/test_office_call_lighting.py` in the style of `test_room_lighting_override_regressions.py`.
- AC: structure tests for all of task-1 to task-3 including trigger shapes and condition order; a render test of the AL gate over kelvin 2000/2900/2999/3000/5500, missing attributes and brightness variants; tests for the DnD condition, the latch condition, house_occupied and entertainment_mode on start, the 12-hour stuck trigger and the reload trigger on reset; a render test of the real `office_lights_manual_change` condition showing an automation-parented change and an `:al:` change are both ignored; entertainment guard tests for end and reset; helper tests (no `initial:`, ranges).
- AC: a sabotage table is recorded in `working-memory.md` showing each of: remove the flag condition from start, remove the flag condition from end, drop the DnD condition from start, drop the entertainment guard from end, drop the latch condition, target the lamp, add `initial:` to a helper; each turns at least one test red and is restored.
- AC: full suite green.
