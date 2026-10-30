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

## Hotfix #73 is superseded by the reset automation (JK-1145)

#73 (2026-10-28) fixed a stuck `kitchen_lighting_automations` by turning it back on from `kitchen_mode_off`, because `kitchen_mode_off` forces `kitchen_occupied` off and `kitchen_not_occupied` needs it on, so the flag never reset after Off or Away. The flag was both the dashboard toggle and the manual-override latch.

The flag is now hand-only. A separate latch, `kitchen_lights_manually_toggled`, is cleared by `kitchen_lights_reset_manual_toggle` (unoccupied 30 s, kitchen Off, house empty), and no automation writes the flag. The #73 intent is kept as a test: a manual toggle can't outlive Away, bedtime or Off (`tests/test_away_mode_regressions.py`).

#73's reviewer found a second gap, now closed: an empty kitchen with the flag off that goes Off never ran `kitchen_lights_to_off`, so hand-lit lights stayed on. The Off trigger now bypasses both flags.

## Occupancy-off listeners (checked for JK-1219)

`kitchen_mode_off` already forces occupancy off at Away and bedtime. Listeners of `kitchen_occupied` going off: `kitchen_music_off`, `kitchen_speech_notifications_off`, `kitchen_mode_dim`, `kitchen_lights_to_off`, `family_room_not_occupied`, and announcement routing (`auto` reads the flag). Firing them at bedtime Off is already true today.

## Light-group context

`light.kitchen_ceiling_lights` is a light group. Its changes carry the automation's context, but some attribute-only rows had no parent in the Phase 0 capture, so the manual-change automation keeps the 10 s debounce and the `unavailable` guard (see `packages/main_bedroom/LEARNINGS.md`).

## Dim pendants latch too

`kitchen_lights_manual_change` also watches `light.kitchen_island_pendants` (a Lutron dimmer driven by Dim-mode motion on), so a hand setting there sets the latch and Dim motion doesn't re-apply over it.
Baseline before it shipped (7-day recorder read): 7 pendant changes, 3 with an automation parent, 4 with neither parent nor user. If those 4 are late Lutron reports after an automation call they would latch falsely; check the logbook for `kitchen_lights_manually_toggled` right after a Dim motion-on or `kitchen_lights_to_off`.
