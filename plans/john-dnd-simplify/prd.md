# PRD: john-dnd-simplify

Source: plan.md, pre-mortem.md, review.md. Public repo: no employer, calendar or script names in new text.

## Tasks

1. Add `binary_sensor.john_dnd_active` (template, unique_id + default_entity_id `john_dnd_active`) in `packages/people/john/do_not_disturb/sensors/john_dnd_active.yaml`: on if `input_boolean.john_dnd`, `binary_sensor.johns_mbp_2026_camera_in_use` or `binary_sensor.johns_mbp_2026_audio_input_in_use` is `on` (unavailable counts as off); `delay_on: 5s`, no delay_off. Short header.
   AC: renders off when all inputs off/unavailable.
2. Rewire to `binary_sensor.john_dnd_active`: office_dnd_on/off triggers AND conditions (`packages/office/office_dnd.yaml`, keep the 2-min `for:` on the off trigger); `office_call_lighting_start.yaml` "John is in DnD" condition; `john_daily_report.yaml` (collapse john_dnd + laptop-audio checks into one); `set_focus_mode.yaml` trigger (drop the commented john_dnd condition); dashboard DnD status JS in `dashboards/kohbo/more/people.yaml`, `dashboards/templates/button_cards/people/john.yaml` (status lines only; the toggle row stays `input_boolean.john_dnd`) and `dashboards/kohbo/home/home.yaml`.
3. `office_camera_light_on/_off` use `binary_sensor.johns_mbp_2026_camera_in_use`; off-path conditions use `not state on` so unavailable doesn't block the light turning off.
4. Delete: do_not_disturb/automations/{john_dnd_on,john_dnd_off,john_work_call_on,john_work_call_off,john_personal_time_on,john_personal_time_off,john_calendar_personal_time}.yaml; do_not_disturb/sensors/{john_laptop_camera_active,john_laptop_audio_active,john_do_not_distrub_bayesian,john_probably_in_meeting,john_personal_time,john_work_call_boolean,john_personal_time_boolean}.yaml; packages/office/modes/office_mode_dnd_off.yaml. Grep for leftovers first.
5. Tests: update tests/test_office_call_lighting.py; new tests/test_john_dnd_simplify.py — no file under packages/, dashboards/, automation/, scripts/, root *.yaml references a deleted entity or `johns_macbook_pro`; office_dnd_on/off, call lighting, focus mode, daily report reference john_dnd_active; `input_boolean.john_dnd` outside its own definition appears only in john_dnd_active and the dashboard toggle. Check tests/test_entity_references.py fixtures. Full suite green.
6. Docs: docs/PEOPLE.md, docs/ROOMS.md, packages/office/README.md, packages/office/LEARNINGS.md.
