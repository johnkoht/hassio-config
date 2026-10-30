## Pre-Mortem: Room Lighting Override (whole plan; PR 1 = main bedroom pilot)

Run 2026-10-30 against plan.md at master 9d766de (after house-mode-resolver #99 and kitchen hotfix #73).

### Reconciliation with master (read before building)

- **Resolver (#99).** `input_select.house` has one writer. Room `*_mode_auto` files accept house Auto or Quiet (the main bedroom file was not among them: it triggers on house `to: Auto`, occupancy off, and Wake for 10 min). The plan's Auto-bounce guard already says "house_occupied on plus house not Away/Vacation, don't require house == Auto". That is compatible with the resolver as long as we add no `state: "Auto"` condition on the house select (a test in test_house_mode_resolver.py fails on that). PR 1 adds the guard only to the unoccupied branch and leaves the triggers alone.
- **#73 (kitchen).** Lives in kitchen files that PR 1 does not touch. The plan's repo-wide ordering invariant must therefore accept a room whose `mode_off` clears the flag itself (kitchen today) as well as a room with a reset automation, or the test is red on master. Encoded as three accepted shapes in the test.
- **Main bedroom reality vs the plan text.** `mode_off` already forces occupancy off and a reset automation already exists, so for this room the ordering rule is already satisfied. `lights_to_off` today checks only the global flag and an occupied-off/in-bed/bedtime or-block, never the room flag or the latch. That is the shape Open decision 6 wants, so the gate audit changes only the Off-transition bypass (below).
- **Live state (read-only):** `main_bedroom_lighting_automations` on, `main_bedroom_lights_manually_toggled` on, `main_bedroom_lights_auto` off. All three are YAML-owned (registry has no UI options; `editable: false`). The latch being on right now means motion lights are blocked until the room next goes unoccupied/Off; the new reset also fires on Off.

### Risk 1: A brightness trigger latches the override on automation noise (HIGH)

**Problem**: ZHA transition reports, Adaptive Lighting adjustments and group recompute can produce state changes with a fresh context (`parent_id` none). A brightness trigger would then set the latch right after the motion-on automation fires, and motion lights would be dead until the room empties.

**Mitigation**: Phase 0 spike (homelab, read-only) decides the condition before it is written. Condition checks `parent_id == none` and `user_id` shape, excludes Adaptive Lighting by context, and ignores attribute changes whose `from_state` was off or that arrive within a debounce of an automation-context change. If the spike shows noise, brightness is dropped from v1 (plan Open decision 2 fallback) and on/off ships alone. The trigger uses `attribute: brightness` with no `from`/`to`/`not_*`.

**Verification**: Spike result recorded in prd.md. Static test asserts the trigger shape and the context condition. Post-deploy recorder check lists latches held for over an hour.

### Risk 2: Widening detection makes the latch fire in more situations (MEDIUM)

**Problem**: Today the latch is set only on a manual OFF while `lights_auto` is on. After this PR any manual on, off or brightness change sets it (the `lights_auto` condition goes away). A bedtime manual light-off keeps the latch on until the room next goes unoccupied/Off, so morning motion lights may stay off until then. Same outcome as today for the common evening path, but more reachable.

**Mitigation**: Accept it (it is the approved plan: any manual change = override). Do not add extra reset triggers beyond the plan. Record it in the PR and the LEARNINGS so John can ask for a Wake/Auto reset if he sees it. Dashboard shows the latch in Phase 4.

**Verification**: Post-deploy recorder check "latch on > 1 h"; John tests a manual off then motion in the same room.

### Risk 3: Reset automation is blocked or misses a path (HIGH)

**Problem**: A latch that can't clear is the kitchen bug. The reset has `for: 30s` on occupancy off (dropped by reloads) and must also fire on the room going Off and the house going unoccupied.

**Mitigation**: Reset is ungated (no conditions, not even "latch is on"); three triggers; `initial: off` on the latch re-applies at restart. Test asserts triggers, no conditions, and target-block syntax.

**Verification**: Static test + sabotage (remove a trigger, add a condition, both go red).

### Risk 4: Renaming the detection automation leaves a registry ghost and breaks references (MEDIUM)

**Problem**: The id changes from `main_bedroom_lights_turned_off` to `main_bedroom_lights_manual_change` (filename == id). The old entity becomes a ghost until cleaned. `automation.<slug(alias)>` references would break.

**Mitigation**: Grep done: nothing references `automation.main_bedroom_lights_manually_turned_off` or `_turned_off` outside the disabled `.disabled` files. Old registry ghost is listed for the lead to clear after deploy; no automation depends on it.

**Verification**: Repo grep returns zero live references; entity-reference test stays green.

### Risk 5: `initial:` removal on the hand flag strands or flips it (MEDIUM)

**Problem**: Removing `initial: on` from `main_bedroom_lighting_automations` takes effect on an input_boolean reload, and HA then restores last state. Live is `on`, so it stays on. If John had it off it stays off (that is the point). Nothing to strand now, but it must not be set by an automation afterwards.

**Mitigation**: No automation writes the flag (test, repo-wide scan of the main-bedroom flag; the commented-out lines in `mode_auto`/`not_occupied` stay comments or are deleted). Deploy note: input_boolean reload, no restart.

**Verification**: Live read of the flag before and after the reload (lead).

### Risk 6: Off-transition bypass turns lights off in an unwanted case (LOW-MEDIUM)

**Problem**: `lights_to_off` on the room going Off will stop requiring "occupied off / in bed / bedtime". A hand-picked Off while someone is in the room turns the lights off.

**Mitigation**: That is the plan's rule ("Room Off turns the lights off unconditionally", checks only global `lighting_automations`). Only the Off trigger bypasses; the vacancy trigger keeps today's or-block. Documented in README.

**Verification**: Static test: Off path has no room-flag or latch condition; vacancy path unchanged.

### Risk 7: Bounce guard conflicts with the resolver (LOW)

**Problem**: Requiring house == Auto would stop firing when the resolver picks Quiet. A guard that is too loose lets the room flip to Auto while the house is Away/Vacation.

**Mitigation**: Guard is `house_occupied on` plus house not in Away/Vacation. No house == Auto condition, no new trigger option.

**Verification**: Test asserts the guard on the occupancy-off branch and that no `state: Auto` condition on the house select was added (the resolver test already enforces this).

### Risk 8: Tests turn the repo-wide scan into a source of false failures (MEDIUM)

**Problem**: The plan's repo-wide checks would fail on master for rooms not yet migrated (kitchen has no reset automation; main bathroom's Auto has no house_occupied check).

**Mitigation**: Per-room checks parametrize over `MIGRATED_ROOMS` (main bedroom only now). The repo-wide invariants are the ordering invariant (accepts three shapes) and the "nothing writes a migrated room's hand flag" scan. Later PRs append rooms. Each new check gets a sabotage run.

**Verification**: Full suite passes on master + PR; sabotage list in the build log.

### Risk 9: Documentation debt (LOW)

**Problem**: README lighting section is stale (mentions a global/room flag "or"), docs/ROOMS.md entity table has one row, packages/CLAUDE.md has no latch pattern, no main_bedroom LEARNINGS.

**Mitigation**: Update README, ROOMS.md, packages/CLAUDE.md (a short "manual override latch" pattern, marked as applying to migrated rooms), new main_bedroom/LEARNINGS.md, in PR 1.

**Verification**: /wrap user-docs check.

### Risk 10: Rollback safety (LOW)

**Problem**: PR 1 touches one room and a new test file. Revert is a clean git revert plus the same reloads. No data or helper is created or removed (the latch helper already exists), so a revert leaves state consistent.

## Summary

Total risks identified: 10 (plus a reconciliation note)
Categories: context gaps, backward compatibility, test complexity, integration, documentation, rollback
CRITICAL risks (must address before proceeding): none. Risk 1 is HIGH and gated by the Phase 0 spike before any brightness trigger is written.

**Ready to proceed with these mitigations?** Yes: no structural blocker inside the approved plan.

---

## PR 2 addendum (kitchen), 2026-10-30

Plan-level pre-mortem and review stand. Kitchen-specific risks, from reading master after PR 1 (#100) merged:

- **#73 intent must survive (HIGH).** A manual toggle must never leave kitchen motion lights dead after Off or Away. The hotfix did it by writing the lighting flag from `kitchen_mode_off`; PR 2 moves that to the ungated reset automation (triggers: unoccupied 30 s, kitchen Off, house empty). The old `test_kitchen_mode_off_resets_lighting_automations` is replaced by a test of the new reset triggers, so the intent stays enforced. Away/bedtime reach the reset through the house-empty and Off triggers; if the kitchen is already Off the house-empty and occupancy triggers still fire.
- **New helper (MEDIUM).** `kitchen_lights_manually_toggled` does not exist yet: needs an input_boolean reload to create it, before the automations reload or the new automations will read an unknown entity for a moment. Deploy order: input_boolean reload first, then automations. Live state of the hand flag is read before and after.
- **Light-group context (MEDIUM).** `light.kitchen_ceiling_lights` is a light group; the spike showed its changes carry the member's automation parent, but 6 of about 24 attribute-only rows had none. Same stateless debounce as PR 1; `from_state` unavailable/unknown guarded (group members drop out on reconnect).
- **Vacancy-off behaviour change (MEDIUM).** Today the kitchen flag doubles as a latch, so "flag off + occupancy off" still turns lights off. After PR 2 the flag is hand-only: hand flag off means no vacancy-off, Off always turns lights off (closes the #73 reviewer's gap: empty kitchen already at flag off, set Off, lights stay on).
- **Other readers of the flag (LOW).** `kitchen_lights_day_off` and `kitchen_mode_dim` read `kitchen_lighting_automations`; they keep reading it as the hand flag. The Dim pendant path lives inside `kitchen_lights_motion_on`, so the latch gate on that file covers it.
- **Two files folded into one, ids change (LOW).** `kitchen_lights_manually_turned_on` and `kitchen_lights_manually_turned_off` become `kitchen_lights_manual_change` (two registry ghosts). Nothing references them; the debug notification is dropped.
- **Bounce guard (LOW).** `kitchen_mode_auto` has no occupancy-off trigger, so there is nothing to bounce; the test asserts that instead of the guard.

---

## PR 3 addendum (garage), 2026-10-30

- **Plan task 17 re-derived from the live code.** `garage_mode_off` triggers on house Bedtime and only runs while `garage_occupied` is already off, so it never forces occupancy off and the Off option is entered only for an empty garage. JK-1219 therefore needs no change to `garage_mode_off`; forcing occupancy off there would fight the sensors. `garage_mode_auto` triggers on occupancy ON, so nothing can bounce it. The ordering invariant does not apply to the garage (its `mode_off` never turns occupancy off); the reset lands anyway because `garage_not_occupied` currently writes the hand flag after a 30 s delay, and that write is removed.
- **The flapping is two automations.** Live baseline (7 days, read-only): `garage_lighting_automations` changed 127 times, all automation-context, about 18 a day, alternating between `garage_lights_turned_off` (no context check, so every automation-driven off, 63 times, disables the flag) and `garage_not_occupied` (turns it back on, 63 times). Light changes: 179, 177 with an automation parent, 0 from a user, 2 with neither. No attribute-only rows on the dimmer.
- **Entity is a Lutron Caseta dimmer** (`light.garage_lights`, brightness only, not a group), like the main bedroom. Same detection template.
- **Behaviour changes (MEDIUM).** (a) `garage_lights_off` gains the house-wide `lighting_automations` check it never had, and the vacancy branch now needs the hand flag, as in the other rooms. (b) `garage_lights_motion_off` (turn lights off 2 min after motion stops while empty) is a vacancy path, so by Open decision 6 it obeys the hand flag too. Hand flag defaults on; John only sees a difference if he switches it off.
- **Hand flag stranded off (LOW).** Live it is on; the flapping left it on at last read. Removing `initial: on` takes effect on an input_boolean reload, and HA restores the last state. Read it before and after the reload.
- **Ghost entity ids.** The two flapping automations have `_2` clone-derived entity ids live (`main_bedroom_lights_manually_turned_off_2`, `playroom_not_occupied_2`). Renaming the garage detection automation retires the first; nothing in the repo references either.
- **Garage Away.** Select options are Auto/Off/Away. Away turns lights off today; kept (both Off and Away use the `room_off` trigger id).

---

## PR 4 addendum (Phase 4 rooms, one PR, one commit per room), 2026-10-30

- **Live hand flags read before building (read-only).** Every hand flag of the rooms in this PR is **on**: main bathroom, playroom, office, upstairs hallway, laundry (plus the already migrated main bedroom, kitchen, garage). The one flag that is **off** is `dining_room_lighting_automations`, which this PR removes along with its row, so nothing needs a manual switch-on after `initial:` goes. Mode-only rooms have no flag. The house-wide `lighting_automations` is on.
- **Large single PR (John's call).** One commit per room, each with its tests, so any room reverts on its own. The ordering invariant test runs over the whole PR: a room's reset automation lands in the same commit as that room's `mode_off` forcing occupancy off.
- **Kids' rooms and risky listeners (HIGH).** JK-1219 for the kids' rooms and bathrooms is done only after a per-room listener audit (music, heaters, TTS routing); if an audit finds a risky effect at the mode_off trigger times the room is left alone and deferred, and the report says so.
- **Office DnD.** DnD keeps lights on; `office_lights_on` treats DnD like Auto, so the latch gate must sit ahead of that mode-or block without changing which modes pass.
- **Disabled automations that still write the flag** (`office_lighting_automation_on` / `office_lighting_automations_off`) are deleted; they are inert today but would break the "nothing writes the hand flag" scan.
- **Laundry's toggle did nothing** (`laundry_room_lights_motion_on` never checked its flag). Adding the gate is a behaviour change for the flag's owner: with the flag on (live), nothing changes.
- **Dashboard rows.** A "Manual override" row per migrated room that has a "Lighting Automations" row (kitchen, main bedroom, main bathroom, playroom, office, upstairs hallway); the dining row goes. Garage and laundry have no such row on their pages and are not given one. Dashboard changes follow dashboards/CLAUDE.md (card_mod include, same row shape) and carry the `kohbo.yaml` touch note for deploy.
- **New helpers need an input_boolean reload before the automation reload** (five new latches).
