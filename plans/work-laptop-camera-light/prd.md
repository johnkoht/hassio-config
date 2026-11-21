# PRD: Work Laptop Camera Light

## Goal

The El Gato key light (`light.office_el_gato_light`) also follows the work laptop: on when its camera is on and it is docked, off when no camera is on at the desk. DnD (`input_boolean.john_dnd`) is unchanged.

## Constraints (from memory)

- Off-path conditions use `not ... on`, never `state: off` (laptop/Mac sources go unavailable or stale).
- New helpers have no `initial:`.
- Leave `initial_state: on` on the existing automations.
- The on-automation re-checks every condition; never trust the trigger alone.
- Modern syntax: `target:` block on actions; short header comments.

## Tasks

### Task 1: Helpers
**File:** `packages/people/john/do_not_disturb/sensors/john_work_laptop_camera_boolean.yaml`, `packages/people/john/do_not_disturb/sensors/john_work_laptop_docked_boolean.yaml`

Add `input_boolean.john_work_laptop_camera` (icon `mdi:webcam`) and `input_boolean.john_work_laptop_docked` (icon `mdi:laptop-account` or similar), same shape as `john_work_laptop_active_boolean.yaml`.

- AC1: Both files define exactly one `input_boolean` each with `name` and `icon`, no `initial:`.
- AC2: Basenames are unique across `packages/` (`find packages -name <basename>` returns one hit).

### Task 2: On automation
**File:** `packages/office/lights/office_camera_light_on.yaml`

- AC1: New triggers: `input_boolean.john_work_laptop_camera` to `on` with `for: {seconds: 2}`, and `input_boolean.john_work_laptop_docked` to `on`. Existing triggers kept.
- AC2: Conditions keep office occupied, room presence = office, El Gato off; the Mac-camera condition becomes an `or` of (Mac camera on) and (work camera on AND docked on), with an `alias:`.
- AC3: Action uses `target: entity_id: light.office_el_gato_light`; `initial_state: on`, `id`, `alias` unchanged.
- AC4: No reference to `input_boolean.john_dnd`.

### Task 3: Off automation
**File:** `packages/office/lights/office_camera_light_off.yaml`

- AC1: New triggers: work camera to `off` with `for: {seconds: 4}`, docked to `off`. Existing triggers kept.
- AC2: Conditions: Mac camera `not ... on` (unchanged), plus a `not` over (work camera on AND docked on), plus El Gato on. No `state: "off"` condition on any source.
- AC3: Action uses a `target:` block; `initial_state`, `id`, `alias` unchanged. Header gets a 1–2 line description.
- AC4: No reference to `input_boolean.john_dnd`.

### Task 4: Tests
**File:** `tests/test_work_laptop_camera_light.py`

- AC1: Asserts both new helpers exist with no `initial`.
- AC2: Asserts on-automation triggers include both new entities, conditions reference both, and an `or` contains the Mac camera.
- AC3: Asserts off-automation triggers include both new entities, has no `state: off` condition on any source, and has a `not` covering the work-laptop pair.
- AC4: Asserts neither camera-light file references `john_dnd` and both actions use `target:`.
- AC5: `pytest tests/` passes, including `test_john_dnd_simplify.py` and `test_room_lighting_override_regressions.py`.

### Task 5: Docs
**File:** `docs/ROOMS.md`, `packages/office/README.md`, `packages/office/LEARNINGS.md`, `docs/PEOPLE.md`

- AC1: ROOMS.md El Gato line names the personal Mac camera or the work laptop camera while docked.
- AC2: README.md and LEARNINGS.md (camera-light row, DnD-source notes) describe the two new booleans and that `john_dnd` does not drive the light.
- AC3: PEOPLE.md file tree lists the two new helper files.
- AC4: Docs contain no schedules, locations or other PII.

### Task 6: Laptop contract handoff
**File:** `plans/work-laptop-camera-light/laptop-contract.md`

- AC1: Contract lists both entity ids, on/off semantics, off on sleep/shutdown/script exit, re-sync on wake/start, REST call shape with token/URL placeholders only. <!-- inferred from plan -->
- AC2: States that HA deploys first and failed calls must not crash the script. <!-- inferred from plan -->
