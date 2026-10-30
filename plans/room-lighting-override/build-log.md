# Build Log - room-lighting-override

Started 2026-10-30 (session room-lighting-pr1). PR split per plan: PR 1 = Phase 0 + Phase 1 (main bedroom pilot, plus the shared test file). PR 2 kitchen, PR 3 garage, PR 4 Phase 4 (one PR, one commit per room), PR 5+ Phase 5.

- Phase 0: build log initialised; plan stamped in-progress on this branch (PR 1 carries the stamp).
- Reconcile with master (house-mode-resolver #99, kitchen hotfix #73): see pre-mortem.md "Reconciliation".

## PR 1 sabotage

Each row: break the production line, run the matching test, `git checkout` the file. All reds confirmed.

| Test | Sabotage | Red? |
|---|---|---|
| 1 flag/latch initial | add `initial: on` to the hand flag | yes |
| 1 | latch `initial: on` | yes |
| 2 no writes to hand flag | `mode_off` turns the flag on via `target:` | yes |
| 2 | `not_occupied` turns the flag on via root `entity_id` | yes |
| 3 reset shape | drop `for` on occupancy trigger | yes |
| 3 | add a `conditions:` block | yes |
| 3 | root-level `entity_id` instead of `target:` | yes |
| 4 manual change | drop the parent/user clause | yes |
| 4 | drop the `from_state.state in ['on','off']` guard | yes |
| 4 | drop the `:al:` guard (render test) | yes |
| 4 | drop the 10 s debounce (render test) | yes |
| 4 | brightness trigger gains `to:` | yes |
| 4 | `to: off` trigger removed | yes |
| 4 | alias slug differs from id | yes |
| 5 on-gating | drop latch condition from motion_on | yes |
| 5 | drop latch condition from day_on | yes |
| 5 | mode condition moved ahead of the latch | yes |
| 6 off path | latch id appears in the file | yes |
| 6 | `room_off` trigger id removed | yes |
| 6 | hand flag added as a top-level condition | yes |
| 7 ordering invariant | kitchen `mode_off` loses its flag reset | yes |
| 7 | main bedroom reset renamed and `not_occupied` writes the flag | yes |
| 8 bounce guard | drop `house_occupied` check | yes |
| 8 | drop `Vacation` from the not-list | yes |
| 8 | add `input_select.house` state `Auto` condition | yes |
| 9 duplicate basename | copy of a package file under another dir | yes |

Two first attempts were bad sabotage (edit landed in the wrong block, or kept the order sorted) and were redone; they are not counted.

## PR 1 review loop
- Final reviewer (sonnet) at 43b3ae2: ITERATE, one DEFECT (two template clauses had no failing test). Fixed: added script-run-by-user, brightness off-to-on and on-to-off cases (24 tests in the file); re-sabotaged both clauses, both red. Also `mode: queued` on manual_change and wording fixes (Off still obeys the house-wide switch).

## PR 2 sabotage

Each production line broken in place, suite run with `-x`, then restored. Baseline 623 passed, 9 skipped.

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` restored | test_flag_has_no_initial_and_latch_initial_off[kitchen] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[kitchen] |
| reset loses Off trigger | test_kitchen_override_latch_cannot_survive_away_bedtime_off |
| reset loses house_occupied trigger | test_kitchen_override_latch_cannot_survive_away_bedtime_off |
| reset gains a condition | test_kitchen_override_latch_cannot_survive_away_bedtime_off |
| kitchen_mode_off writes hand flag | test_kitchen_override_latch_cannot_survive_away_bedtime_off |
| kitchen_not_occupied writes hand flag | test_nothing_writes_the_hand_flag[kitchen] |
| to_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[kitchen] |
| to_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[kitchen] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[kitchen-kitchen_lights_motion_on] |
| day_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[kitchen-kitchen_lights_day_on] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[kitchen] |
| kitchen_mode_auto gains occupancy-off trigger | test_mode_auto_bounce_guard[kitchen] |

## PR 3 sabotage (garage)

Each production line broken in place, suite run with `-x`, then restored. Baseline 624 passed, 9 skipped; now 646 passed, 9 skipped.

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[garage] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[garage] |
| reset loses Off trigger | test_reset_automation_shape[garage] |
| reset gains a condition | test_reset_automation_shape[garage] |
| garage_not_occupied writes hand flag | test_nothing_writes_the_hand_flag[garage] |
| garage_lights_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[garage] |
| room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[garage] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[garage-garage_lights_motion_on] |
| motion_on mode condition first | test_on_automations_gated_by_flags_and_latch_before_mode[garage-garage_lights_motion_on] |
| manual_change loses parent/user clause (flapping) | test_manual_change_templates_render[automation-...-garage] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[garage] |
| motion_off loses hand flag | test_garage_motion_off_obeys_hand_flag_not_latch |
| garage_mode_off turns occupancy off | test_garage_mode_off_never_forces_occupancy_off |

## PR 4 sabotage

Each production line broken in place, suite run with `-x`, then restored. Baseline 646 passed, 9 skipped.

### playroom (670 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[playroom] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[playroom] |
| reset loses Off trigger | test_reset_automation_shape[playroom] |
| reset gains a condition | test_reset_automation_shape[playroom] |
| not_occupied writes hand flag | test_nothing_writes_the_hand_flag[playroom] |
| to_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[playroom] |
| to_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[playroom] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[playroom-playroom_lights_motion_on] |
| day_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[playroom-playroom_lights_day_on] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[playroom] |
| manual_change loses parent/user clause | test_manual_change_templates_render[automation-...-playroom] |
| playroom_mode_off loses occupancy-off | test_playroom_mode_off_forces_occupancy_off_with_target |
| playroom_mode_off occupancy-off uses root entity_id | test_playroom_mode_off_forces_occupancy_off_with_target |
| not_occupied regains delay | test_playroom_not_occupied_only_clears_occupancy |

### upstairs_hallway (694 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[upstairs_hallway] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[upstairs_hallway] |
| reset loses Off trigger | test_reset_automation_shape[upstairs_hallway] |
| reset gains a condition | test_reset_automation_shape[upstairs_hallway] |
| not_occupied writes hand flag | test_nothing_writes_the_hand_flag[upstairs_hallway] |
| to_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[upstairs_hallway] |
| to_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[upstairs_hallway] |
| to_off vacancy branch loses hand flag | test_off_path_ignores_flag_and_latch_on_room_off[upstairs_hallway] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[upstairs_hallway-upstairs_hallway_lights_motion_on] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[upstairs_hallway] |
| manual_change loses parent/user clause | test_manual_change_templates_render[automation-...-upstairs_hallway] |
| mode_off loses occupancy-off | test_upstairs_hallway_mode_off_forces_occupancy_off_with_target |
| mode_off occupancy-off uses root entity_id | test_upstairs_hallway_mode_off_forces_occupancy_off_with_target |
| not_occupied regains delay | test_upstairs_hallway_not_occupied_only_clears_occupancy |
| sleep_mode_on writes the latch | test_upstairs_hallway_sleep_mode_automations_do_not_touch_flags |

### office (728 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[office] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[office] |
| reset loses Off trigger | test_reset_automation_shape[office] |
| reset gains a condition | test_reset_automation_shape[office] |
| not_occupied writes hand flag | test_nothing_writes_the_hand_flag[office] |
| office_lights_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[office] |
| office_lights_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[office] |
| motion_on / day_on / lights_on latch check removed (3 rows) | test_on_automations_gated_by_flags_and_latch_before_mode[office-...] |
| office_lights_on drops DnD from mode block | test_office_lights_on_latch_gate_before_mode_and_dnd_still_passes |
| office_lights_day_on drops DnD from mode block | test_office_day_on_still_passes_dnd_and_motion_on_only_auto |
| scene_toggle gains latch | test_office_user_driven_light_automations_are_not_latch_gated[office_lights_scene_toggle] |
| motion_off loses hand flag | test_office_motion_off_obeys_hand_flag_not_latch |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[office] |
| manual_change loses parent/user clause | test_manual_change_templates_render[automation-...-office] |
| manual_change stops watching the bulbs | test_manual_change_also_watches_extra_lights[office-light.office_ceiling_bulbs] |
| manual_change stops watching the switch off | test_manual_change_triggers_and_alias[office] |
| office_mode_off turns occupancy off | test_office_mode_off_leaves_occupancy_alone |

### main_bathroom (753 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[main_bathroom] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[main_bathroom] |
| reset loses Off trigger | test_reset_automation_shape[main_bathroom] |
| reset gains a condition | test_reset_automation_shape[main_bathroom] |
| not_occupied writes hand flag | test_nothing_writes_the_hand_flag[main_bathroom] |
| lights_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[main_bathroom] |
| lights_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[main_bathroom] |
| lights_off vacancy branch loses hand flag | test_off_path_ignores_flag_and_latch_on_room_off[main_bathroom] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[main_bathroom-main_bathroom_lights_motion_on] |
| bedtime_motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[main_bathroom-main_bathroom_bedtime_motion_on] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[main_bathroom] |
| manual_change loses parent/user clause | test_manual_change_templates_render[automation-...-main_bathroom] |
| mode_off loses occupancy-off | test_main_bathroom_mode_off_forces_occupancy_off_with_target |
| mode_off occupancy-off uses root entity_id | test_main_bathroom_mode_off_forces_occupancy_off_with_target |
| not_occupied regains delay | test_main_bathroom_not_occupied_only_clears_occupancy |
| mode_auto guard drops house_occupied | test_mode_auto_bounce_guard[main_bathroom] |
| mode_auto guard drops Vacation | test_mode_auto_bounce_guard[main_bathroom] |
| mode_auto guard uses house == Auto | test_mode_auto_bounce_guard[main_bathroom] |
| mode_auto unoccupied trigger id removed | test_mode_auto_bounce_guard[main_bathroom] (after adding the id assert) |
| mode_auto default bypasses the script | test_main_bathroom_mode_auto_guard_covers_the_occupancy_trigger_and_sets_auto |

### laundry_room (776 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| hand flag `initial: on` back | test_flag_has_no_initial_and_latch_initial_off[laundry_room] |
| latch `initial: on` | test_flag_has_no_initial_and_latch_initial_off[laundry_room] |
| reset loses Off trigger | test_reset_automation_shape[laundry_room] |
| reset gains a condition | test_reset_automation_shape[laundry_room] |
| not_occupied writes hand flag | test_nothing_writes_the_hand_flag[laundry_room] |
| lights_off mentions latch id | test_off_path_ignores_flag_and_latch_on_room_off[laundry_room] |
| lights_off room_off branch gains flag | test_off_path_ignores_flag_and_latch_on_room_off[laundry_room] |
| lights_off vacancy branch loses hand flag | test_off_path_ignores_flag_and_latch_on_room_off[laundry_room] |
| motion_on latch check removed | test_on_automations_gated_by_flags_and_latch_before_mode[laundry_room-laundry_room_lights_motion_on] |
| motion_on room flag check removed (the old bug) | test_on_automations_gated_by_flags_and_latch_before_mode[laundry_room-laundry_room_lights_motion_on] |
| manual_change loses unavailable guard | test_manual_change_conditions_guard_context_and_unavailable[laundry_room] |
| manual_change loses parent/user clause | test_manual_change_templates_render[automation-...-laundry_room] |
| mode_off loses occupancy-off | test_laundry_mode_off_forces_occupancy_off_with_target |
| mode_off occupancy-off uses root entity_id | test_laundry_mode_off_forces_occupancy_off_with_target |
| not_occupied regains delay | test_laundry_not_occupied_only_clears_occupancy |

### dining_room (782 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off loses occupancy-off | test_mode_only_room_mode_off_forces_occupancy_off_with_target[dining_room] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[dining_room] |
| not_occupied regains the flag write | test_mode_off_ordering_invariant[dining_room] |
| lights_off references dining_room_lights_auto | test_dining_room_dead_helpers_are_gone_from_config |
| hand flag helper returns | test_mode_only_room_has_no_override_kit[dining_room] |
| latch helper added | test_mode_only_room_has_no_override_kit[dining_room] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[dining_room] |

### basement (786 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[basement] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[basement] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[basement] |

### jr_suite (790 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[jr_suite] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[jr_suite] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[jr_suite] |

### powder_room (794 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[powder_room] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[powder_room] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[powder_room] |

### mudroom_bathroom (798 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[mudroom_bathroom] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[mudroom_bathroom] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[mudroom_bathroom] |

### sunroom (802 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[sunroom] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[sunroom] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[sunroom] |

### foyer (806 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[foyer] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[foyer] |
| mode_auto gains unguarded occupancy-off trigger | test_mode_only_room_mode_auto_guard[foyer] (full-suite -x hits test_foyer_returns_to_auto_from_quiet first) |

### ninos_bedroom (812 passed, 9 skipped)

| Sabotage | First red test |
|---|---|
| mode_off occupancy-off becomes turn_on | test_mode_only_room_mode_off_forces_occupancy_off_with_target[ninos_bedroom] |
| mode_off occupancy-off uses root entity_id | test_mode_only_room_mode_off_forces_occupancy_off_with_target[ninos_bedroom] |
| mode_off bed guard flipped to bed occupied | test_kids_mode_off_only_clears_occupancy_with_empty_bed[ninos_bedroom] |
| mode_off Away gate changed | test_kids_mode_off_only_clears_occupancy_with_empty_bed[ninos_bedroom] |
| mode_auto guard loses house_occupied | test_mode_only_room_mode_auto_guard[ninos_bedroom] |
| mode_auto guard loses Vacation | test_mode_only_room_mode_auto_guard[ninos_bedroom] |
| mode_auto occupancy-off trigger loses its id | test_mode_only_room_mode_auto_guard[ninos_bedroom] |
