# El Gato follows the docked work laptop camera

**What:** The work laptop (no HA install) now writes `input_boolean.john_work_laptop_camera` (camera only) and `input_boolean.john_work_laptop_docked` over its token. `office_camera_light_on/_off` take (work camera AND docked) as a second source beside the personal Mac camera. `john_dnd` (camera OR mic) is not used, so mic-only and chair calls leave the light off. The laptop can't tell the El Gato camera from the built-in one, so docked stands in for "at the desk".

**Metrics:** 6 tasks, 1 review iteration (1 DEFECT), 4 tests added, sabotage checks red/green on both fixes.

**Learnings:**
- HA `not` fails if ANY child passes (NOR). To negate an AND, wrap the pair in `and` inside `not`; caught before review, now tested.
- Any booleans an external script writes go stale when it crashes. An off-gate that requires them to be not-on blocks every off trigger, including vacancy. Give vacancy a trigger `id` and bypass the external gate on it. `john_computer_active` is no backstop here, since the same laptop writes it.
- `condition: trigger` inside an `or` is safe: triggers without an id get their index as id.

**Follow-ups (BACKLOG):** HA-side staleness (treat the pair as off when `last_updated` > ~15 min); `office_dnd_light_*` still use root `entity_id`; a bare `pytest tests` needs `PYTHONPATH=tests`.

**Hotfix (same day):** Plugging into the dock blipped the Mac camera ~4.4 s, past the 2 s on-wait, so the El Gato flashed; camera and dock on-triggers now wait 8 s. Call-lighting AL resumed ~3 min after a call; `office_call_lighting_end` now also fires on `john_dnd_active` off 30 s, and start fires on `john_dnd_active` on so a back-to-back call inside office DnD's 2-minute tail re-pauses AL.
