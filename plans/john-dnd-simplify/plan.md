---
title: John DnD Simplify
slug: john-dnd-simplify
status: in-progress
created: 2026-10-30
has_pre_mortem: true
has_review: true
has_prd: false
---

# John DnD Simplify

## Problem

John's DnD grew out of calendar triggers and a Bayesian sensor, and most of it no longer works. The repo's camera and mic sensors (`binary_sensor.john_laptop_camera_active`, `_audio_active`) read the retired MacBook (`sensor.johns_macbook_pro_*`), so `john_dnd_on`/`john_dnd_off` and the El Gato camera light never fire. The calendar pieces (work call, personal time, the Bayesian `binary_sensor.john_do_not_disturb`, `john_probably_in_meeting`) are dead or unused. What does work is the work laptop's own script, which sets `input_boolean.john_dnd` over a long-lived token when its camera or mic is on. Calls on the new personal Mac are not detected at all.

## Goal

DnD comes only from camera/mic use (work laptop script or the new personal Mac) or the manual toggle. One derived sensor feeds every consumer, and all calendar-driven DnD pieces are gone.

## Approach

Keep `input_boolean.john_dnd` as the shared "work laptop or manual" input. The work-laptop script keeps writing it and the dashboard toggle stays on it, so no change is needed on the work laptop.

Add one template `binary_sensor.john_dnd_active` = `john_dnd` on, OR `binary_sensor.johns_mbp_2026_camera_in_use` on, OR `binary_sensor.johns_mbp_2026_audio_input_in_use` on, with `delay_on: 5s` and no `delay_off`. `office_dnd_off` already waits 2 minutes, which covers mute gaps and keeps the call-lighting end logic stable. Using a new entity id avoids colliding with the Bayesian's old `binary_sensor.john_do_not_disturb` registry entry (`_2` suffix risk).

Rejected: having the repo write `john_dnd` from the Mac sensors. Ending a Mac call would then clear a manual DnD the user set.

Known trade-off: the work-laptop path and the manual toggle share one boolean, so the work script turning DnD off at a call's end also clears a manual DnD set during the call. This is already true today.

## Tasks

1. **Derived sensor.** Add `binary_sensor.john_dnd_active` in `packages/people/john/do_not_disturb/sensors/`, with a unique_id. Confirm the two `johns_mbp_2026_*` entity ids live on the Yellow before writing.
2. **Rewire consumers** from `input_boolean.john_dnd` or the old laptop sensors to `binary_sensor.john_dnd_active`:
   - `office_dnd_on`/`office_dnd_off` (`packages/office/office_dnd.yaml`);
   - the call-lighting "John is in DnD" condition;
   - `john_daily_report` (the DnD and laptop-audio checks become a single check);
   - the DnD state text in `dashboards/kohbo/more/people.yaml`, `dashboards/templates/button_cards/people/john.yaml` and `dashboards/kohbo/home/home.yaml`.

   The toggle row at `john.yaml:99` stays on `input_boolean.john_dnd`.
3. **Camera light.** `office_camera_light_on`/`_off` switch to `binary_sensor.johns_mbp_2026_camera_in_use`. The work laptop only reports a combined DnD signal, so the El Gato reacts to the personal Mac's camera only.
4. **Delete the dead pieces:**
   - automations `john_dnd_on`, `john_dnd_off`, `john_work_call_on`/`_off`, `john_personal_time_on`/`_off` (the last has id `john_person_time_on`), and the disabled `office_mode_dnd_off`;
   - sensors `john_calendar_personal_time`, `john_laptop_camera_active`, `john_laptop_audio_active`, the Bayesian `john_do_not_disturb`, `john_probably_in_meeting` and `john_personal_time`;
   - booleans `input_boolean.john_work_call` and `input_boolean.john_personal_time`.

   Before deleting, grep each id and name-derived id across `packages/`, `dashboards/`, `automations.yaml` and `scripts/`.

   Keep: `john_dnd`, `john_work_laptop_active`, `john_computer_active`, `office_dnd`, `office_guest_mode`, `input_select.office` DnD, the Hue DnD scene and Inovelli LED, and the speech gate.
5. **Tests:**
   - update `tests/test_office_call_lighting.py`;
   - add a test that no YAML references a deleted entity or the old `johns_macbook_pro_*` sensors;
   - add a test that office DnD and call lighting read `binary_sensor.john_dnd_active`;
   - full suite passes.
6. **Docs.** Update `docs/PEOPLE.md`, `docs/ROOMS.md`, `packages/office/README.md` and `packages/office/LEARNINGS.md`, keeping the external work-laptop writer generic (no employer or script names).
7. **Deploy and verify.** Run `./deploy.sh --reload --skip-ci`, then reload Template entities and input_boolean via the supervisor API. No restart. Check that `binary_sensor.john_dnd_active` mirrors `john_dnd` on the next work call. John starts a FaceTime or Zoom call on the personal Mac to confirm the camera and mic path.

## Risks

- **Personal Mac sensors never seen on:** in the last 7 days, `johns_mbp_2026_camera_in_use` and `_audio_input_in_use` never turned on. They may be disabled in the companion app. Mitigation: John checks the macOS companion app's sensor settings; task 7 verifies. The work-laptop path is unaffected either way.
- **Deleted automations leave registry ghosts**, which is already a backlog item. Acceptance: note the new ghosts in the PR, and don't clean the registry here.
- **Consumers missed by the rewire:** office DnD has about 12 downstream readers of `input_select.office`. Those don't change, because only the inputs to `office_dnd` move. The task 5 grep test catches any stragglers.
- **Out of scope; open for John:**
  - `office_music_on` is disabled (`initial_state: off`, last ran 2023) and references `binary_sensor.john_computer_actives`; left alone.
  - The Echo DnD switch automations (`office_echo_dnd_on`/`_off`) target an unavailable switch. Keep or delete?
  - `set_focus_mode` is driven by the calendar-based `sensor.john_calendar_focus_mode`. Is that part of "all the calendar stuff" or a separate feature?

On approval → /approve → /ship john-dnd-simplify
