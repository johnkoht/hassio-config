---
title: Work Laptop Camera Light
slug: work-laptop-camera-light
status: in-progress
created: 2026-11-20
has_pre_mortem: false
has_review: false
has_prd: true
---

# Work Laptop Camera Light

## Problem

The El Gato key light (`light.office_el_gato_light`) follows only the personal Mac's camera (`binary_sensor.johns_mbp_2026_camera_in_use`), via `office_camera_light_on` / `_off`. The work laptop has no HA install. Its script writes `input_boolean.john_dnd` over a long-lived token when the camera **or** mic is active, so using that for the light would turn it on for mic-only calls, and also when John is on the laptop in the office chair, where the light is no use. The laptop can't tell which camera is in use (built-in vs. the El Gato), so "El Gato camera active" isn't available as a signal.

## Goal

The El Gato turns on when the work laptop's camera is on **and** the laptop is docked at the desk. It turns off when neither computer's camera is on at the desk. Mic-only calls and undocked calls leave it alone. `john_dnd` and all DnD behaviour are unchanged.

## Approach

The laptop script gains two raw signals, written with the same token it already uses for `john_dnd`. HA combines them, so the laptop stays a dumb reporter and the "at desk" logic lives in one place.

**Laptop contract** (implemented by John / the work computer agent):

| Entity | On | Off |
|---|---|---|
| `input_boolean.john_work_laptop_camera` | any camera active (not the mic) | camera stops; also on sleep, shutdown and script exit |
| `input_boolean.john_work_laptop_docked` | dock or external display connected | dock/display disconnected; also on sleep, shutdown and script exit |

- Write the state on every change, and re-sync both on wake and on script start (HA keeps the last value across restarts, so a missed off leaves it stuck on).
- Writes are `input_boolean.turn_on` / `turn_off` via the REST API, same as `john_dnd` today.

**HA side:**
- Two new helpers next to `john_work_laptop_active_boolean.yaml`, with no `initial:` so state restores across restarts.
- `office_camera_light_on`: add triggers for the work camera going on (`for: 2s`, same as the Mac) and for docked going on (camera already on when he docks mid-call). Conditions become an `or` of the two sources: Mac camera on, or (work camera on and docked on). Keep office occupied, John's room presence = office, and El Gato off.
- `office_camera_light_off`: add triggers for the work camera going off (`for: 4s`) and docked going off. Conditions: Mac camera not on, and not (work camera on and docked on), using `not ... on` like the existing Mac condition. Keep the El Gato-on check and the existing occupancy / `john_computer_active` triggers.
- Fix the root-level `entity_id` on both actions to a `target:` block while the files are open. Leave `initial_state: on` alone, because removing it doesn't re-enable anything.

## Tasks

1. Helpers: add `john_work_laptop_camera_boolean.yaml` and `john_work_laptop_docked_boolean.yaml` under `packages/people/john/do_not_disturb/sensors/` (unique basenames, so no `!include_dir_named` collision).
2. On automation: work-camera and docked triggers, an `or` source condition, and `target:`.
3. Off automation: work-camera and docked triggers, `not` conditions for both sources, and `target:`.
4. Tests: extend `tests/test_john_dnd_simplify.py` (or a new `tests/test_work_laptop_camera_light.py`) to assert that both new entities appear in on/off triggers and conditions, that off uses `not`, and that `john_dnd` is not referenced by either camera-light file. Make sure the existing camera-light and latch-gating tests still pass.
5. Docs: `docs/ROOMS.md` (the El Gato line), `packages/office/README.md`, `packages/office/LEARNINGS.md` (the camera-light row and the DnD-source notes), and the `docs/PEOPLE.md` file tree.
6. Laptop handoff: give John the contract table above to pass to the work computer agent. Deploy the HA side first, since the helpers must exist before the laptop writes them.

## Risks

- **Laptop misses an off (sleep, crash, lost network), so the camera boolean sticks on.** The office-vacant off trigger bypasses the laptop pair (review fix), so the light goes off when the office empties; `john_computer_active` is no help since the same laptop writes it. The laptop re-sends state every 5 minutes and on wake/start. Accepted, with no HA-side timeout.
- **Docked while in the chair** (e.g. laptop on a dock cable that reaches the chair): the light comes on. Accepted, because dock = desk is the agreed proxy.
- **Bermuda room presence lags or misreads**, so the on-condition `john_room_presence = office` blocks the light. This is the same behaviour as the Mac path today; it stays as is for consistency, and the room-presence trigger re-fires once presence catches up.
- **The laptop writes before the helpers exist** and the REST call fails. Ship HA first (task 6 ordering).

On approval → /approve → /ship work-laptop-camera-light
