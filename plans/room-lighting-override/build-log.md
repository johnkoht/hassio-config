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
