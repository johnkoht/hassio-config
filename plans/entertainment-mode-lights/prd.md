# PRD: Entertainment Mode Lights

## Goal

When entertainment mode turns on, the main-floor lights turn on whatever the daylight: foyer, kitchen, family room and dining/living. They stay on while the mode is on. When the mode ends, each room goes back to its normal logic.

## Task 1: Room on-files turn the lights on

In each room's entertainment on-file, add a `light.turn_on` (`brightness_pct: 100`, with a `target:` block) after the Adaptive Lighting pause. The dining room has no on-file yet, so create one.

**Acceptance criteria**
- `foyer_entertainment_mode_on` turns on `light.foyer_lights`.
- `kitchen_entertainment_mode_on` turns on `light.kitchen_lights` and `light.kitchen_led`.
- `family_room_entertainment_mode_on` turns on `light.family_room_main_lights`.
- The new `packages/dining_room/modes/dining_room_entertainment_mode_on.yaml` turns on `light.dining_room_lights`. It has:
  - id `dining_room_entertainment_mode_on`;
  - alias `Dining Room - Entertainment Mode On`;
  - `initial_state: on`;
  - the same trigger and house-occupied condition as the other rooms.
- In each existing file, the light action comes after the `switch.adaptive_lighting_*` turn_off.
- There's no lux condition, and the house-occupied condition is unchanged.

## Task 2: Hold while on, hand back on off

**Acceptance criteria**
- Seven automations get a condition that `input_boolean.entertainment_mode` is `off`:
  - `foyer_lights_to_off`
  - `foyer_lights_day_off`
  - `foyer_lights_nightlight_off`
  - `kitchen_lights_to_off`
  - `kitchen_lights_day_off`
  - `family_room_lights_to_off`
  - `dining_room_lights_off`
- `foyer_lights_to_off` still turns the lights off for `Away` while the mode is on. The hold covers the `Off` path only.
- Each of the seven also gets a trigger: `input_boolean.entertainment_mode` from `on` to `off`.
  - The automation's existing conditions decide what happens.
  - No direct `light.turn_off` is added anywhere.
- `foyer_lights_nightlight_off` turns itself off after it runs (`automation.turn_off`). The new trigger must not make it turn the chandelier off at night; its sunrise/dark_outside condition still gates it.
- The `*_to_away` automations are unchanged.
- Out of scope: actions that use a root-level `entity_id:`. Leave them as they are unless the edit touches that action.

## Task 3: Tests

**Acceptance criteria**
- `tests/test_entertainment_mode.py` checks that:
  - each room on-file turns on exactly its lights, after the AL pause;
  - the dining file exists with the right id, alias, trigger and condition;
  - each of the seven off automations has the mode-off condition and the mode-off trigger;
  - `foyer_lights_to_off` still turns the lights off for Away during the mode;
  - the `*_to_away` files don't reference the mode.
- Sabotage check: removing the condition from one off automation makes a test fail. Verify this in scratch and don't commit it.
- The full suite passes: `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`. This uses the main checkout's venv.

## Task 4: Docs

**Acceptance criteria**
- The room table in `packages/house/entertainment/README.md` lists:
  - the lights each room turns on;
  - the hold;
  - the hand-back.
- Where these docs describe the off logic, they mention the hold in one or two lines:
  - `packages/kitchen/README.md`;
  - the foyer, kitchen, family room and dining room LEARNINGS.md files.
