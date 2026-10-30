# PRD: Room Lighting Override

**Plan:** plans/room-lighting-override/plan.md (approved 2026-10-30; JK-1145, JK-1102, JK-1219)
**Pre-mortem:** pre-mortem.md. **Review:** review.md.

## Goal

Every room with a mode select gets the same two-flag model: a hand-only `<room>_lighting_automations` and a `<room>_lights_manually_toggled` latch that any manual change sets and one reset automation always clears. A room's Off forces occupancy off and turns its lights off regardless of either flag. This PRD covers the whole plan; PRs ship in the plan's own split and `prd.json` carries a `pr` field per task.

## PR split

| PR | Branch | Tasks |
|---|---|---|
| 1 | feature/room-lighting-pr1 | spike, main bedroom pilot, shared test file, docs |
| 2 | kitchen | Phase 2 (supersedes #73) |
| 3 | garage | Phase 3 |
| 4 | Phase 4 rooms, one PR, one commit per room | Phase 4 |
| 5 | family_room + mudroom | Phase 5 (may split into a migration PR and an adopt PR) |

Only PR 1 is built in this run.

## Tasks

### task-1 (PR 1) Context spike (plan task 1)
Record what separates manual from automated changes on `light.main_bedroom_main_lights` and the exact condition template.
- AC: A "Phase 0 result" section below states, from read-only live data, the entity type, the context fields for automation / dashboard / physical changes, whether follow-up attribute reports carry a parent_id, and the Adaptive Lighting context shape.
- AC: It states the exact `conditions:` template used by `main_bedroom_lights_manual_change`, or that brightness is dropped from v1 (plan Open decision 2) with the reason.

### task-2 (PR 1) Regression test file (plan task 7)
`tests/test_room_lighting_override_regressions.py`, parametrized over `MIGRATED_ROOMS = ["main_bedroom"]`.
- AC: Lighting flag has no `initial:`; latch has `initial: off`.
- AC: No automation or script in the repo targets a migrated room's `<room>_lighting_automations` with turn_on/turn_off/toggle (scan covers packages/, automation/, scripts/, automations.yaml, scripts.yaml, including `entity_id` at action root and in `target`).
- AC: The reset automation exists, triggers on `<room>_occupied` off (with `for`), `input_select.<room>` to Off, and `house_occupied` to off; it has no `conditions`; its action uses `target:`.
- AC: The manual-change automation has a `parent_id` context condition and, if present, a brightness trigger with `attribute:` and none of `from/to/not_from/not_to`.
- AC: Every on-type lighting automation of the room (motion on, day on) checks `lighting_automations`, `<room>_lighting_automations` and the latch, in that order, ahead of the mode check.
- AC: The Off-transition lights-off path has no condition on the room flag or the latch.
- AC: Repo-wide ordering invariant: for every `<room>_mode_off` that turns `<room>_occupied` off, the room has a reset automation, or `<room>_not_occupied` does not write `<room>_lighting_automations`, or `mode_off` itself resets the flag. Kitchen passes through the third shape until its own PR.
- AC: For migrated rooms, `<room>_mode_auto` has `house_occupied` on and a house not Away/Vacation check on the occupancy-off branch, and no `state: Auto` condition on `input_select.house` that the resolver test would reject.
- AC: Duplicate-basename check across packages/ (`!include_dir_named` collides on basename).
- AC: manual-change automation rejects `unavailable`/`unknown` from_state.
- AC: Every check is sabotage-tested (revert the fix in scratch, test goes red), recorded in build-log.md.

### task-3 (PR 1) Main bedroom: manual change detection (plan task 2)
Replace `main_bedroom_lights_turned_off` with `main_bedroom_lights_manual_change` (git mv; id == filename).
- AC: Triggers: `light.main_bedroom_main_lights` to on, to off, and (unless task-1 drops it) `attribute: brightness`.
- AC: Condition from the Phase 0 result (including the `unavailable`/`unknown` guard and brightness debounce); sets `main_bedroom_lights_manually_toggled` on and `main_bedroom_lights_auto` off; actions use `target:`.
- AC: No `main_bedroom_lights_auto` precondition. The old id no longer exists and nothing in the repo references it.

### task-4 (PR 1) Main bedroom: reset on Off (plan task 3)
- AC: `main_bedroom_lights_reset_manual_toggle` triggers on occupancy off for 30 s, `input_select.main_bedroom` to Off, `house_occupied` to off; no conditions; `target:` block; header comment (title + 1 to 3 lines).

### task-5 (PR 1) Main bedroom: hand flag, gates, Off path, bounce guard (plan tasks 4, 5, 6)
- AC: `main_bedroom_lighting_automations` has no `initial:`; the latch keeps `initial: off`.
- AC: `motion_on` and `day_on` check global, room flag, latch, then mode (order preserved or fixed).
- AC: `main_bedroom_lights_off` follows review defect 3 exactly: trigger ids room_off/vacancy/flag_on, global flag, lights on, OR(room_off; hand flag on AND existing or-block). The latch entity id does not appear in the file.
- AC: `main_bedroom_mode_auto` unoccupied branch checks `house_occupied` on and house not Away/Vacation (no house == Auto requirement); triggers unchanged.
- AC: No automation writes `main_bedroom_lighting_automations` (commented dead lines removed).

### task-6 (PR 1) Docs (plan task 27, main bedroom part)
- AC: `packages/main_bedroom/README.md` lighting section describes both flags and the reset rule; `docs/ROOMS.md` lists the latch and the pattern; `packages/CLAUDE.md` has a short "manual override latch" pattern; `packages/main_bedroom/LEARNINGS.md` exists with the first-use notes. Headers short per the repo rule.

### task-7 (PR 2) Kitchen (plan tasks 9 to 14, 11a)
Same kit; remove #73's reset line; Off lights-off regardless; add kitchen to `MIGRATED_ROOMS`.
### task-8 (PR 3) Garage (plan tasks 15 to 18)
Context check on the garage detection (stops flapping); reset; drop `initial: on`; gate motion; `garage_mode_off` forcing occupancy off.
### task-9 (PR 4) Phase 4 rooms (plan tasks 19 to 26; dashboards task 26 includes the main bedroom row)
One PR, one commit per room, same tests.
### task-10 (PR 5) family_room and mudroom migration then kit (plan tasks 28 to 31)
Behaviour-neutral migration first; repo-wide option test.

## Phase 0 result

Read-only capture from the live recorder (7 days) and logbook, by the homelab agent.

- `light.main_bedroom_main_lights` is a Lutron Caseta dimmer (not ZHA, not a group; brightness only). `light.kitchen_ceiling_lights` is a light-group platform entity.
- Automation-driven changes: `user_id` null, `parent_id` set. Dashboard/app toggle: `user_id` set, `parent_id` null. Wall/physical or device report: both null.
- Of 60 main-bedroom on rows, 10 had no parent (wall dimmer); attribute-only rows: 21 of 22 had a parent, 1 had none (kitchen group 6 of ~24). A parentless attribute-only follow-up is therefore possible; the stored attributes carry no brightness so the cause is unverified.
- Adaptive Lighting context ids contain `:al:` and carry the triggering context as parent; no AL-context rows were recorded on this dimmer in 7 days (live switch could not be read).
- The kitchen group does not pass through a fresh context; its rows carry the automation parent.

**Decision (Open decision 2, pinned):** brightness ships in v1 with a stateless debounce, so no fallback to on/off only. If the post-deploy check shows false latches, drop the brightness trigger in a hotfix. The trigger shape test checks `attribute: brightness` with no from/to/not_from/not_to; it does not need rewriting if brightness is later dropped (the test treats the brightness trigger as optional but constrained when present).

Condition (on triggers `on`/`off` state changes and `attribute: brightness`, in one automation):

```
trigger.from_state.state in ['on','off']                 # review defect 2: not unavailable/unknown
and ':al:' not in trigger.to_state.context.id
and (trigger.to_state.context.user_id is not none or trigger.to_state.context.parent_id is none)
# brightness trigger only:
and trigger.from_state.state == 'on' and trigger.to_state.state == 'on'
and not (trigger.from_state.context.parent_id is not none
         and (trigger.to_state.last_updated - trigger.from_state.last_updated).total_seconds() < 10)
```

Plus the plain parent check the plan lists (`parent_id == none`) is covered by the user/parent clause: a user_id with a parent (script run by a user) counts as manual, an automation (parent, no user) does not.

## Review defects folded in

1. Tests are per migrated room, ordering invariant has three shapes (task-2).
2. `unavailable`/`unknown` guard (task-3).
3. `main_bedroom_lights_off` rule: triggers `room_off` / `vacancy` / `flag_on`; global flag + lights on; OR of (room_off) and (hand flag on AND existing occupied-off/in-bed/bedtime block); the latch never appears in the file; dead house `Off` trigger removed. Behaviour change recorded in the PR (task-5).
4. Phase 0 contingency pinned above.
