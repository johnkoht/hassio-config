# LEARNINGS — packages/kitchen/

## Sleep-mode-off: guard the bedtime trigger by id

`lights/kitchen_lights_sleep_mode_off.yaml` and its twin
`packages/family_room/lights/family_room_sleep_mode_off.yaml` end Adaptive
Lighting sleep mode at 07:00 / sunrise+15, or when `input_boolean.bedtime`
turns off between 05:00 and noon (2026-10-20, for winter mornings).

`condition: time` with only `after: "07:00:00"` is true until midnight, so
a bedtime-off at 22:30 would pass it too. The sun/07:00 branch is wrapped in
`not trigger bedtime_off` for that reason. Keep it if you add triggers, and
change both files together. Tests: `tests/test_adaptive_lighting_regressions.py`.
