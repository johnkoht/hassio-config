# Room lighting override, PR 1 of 5 (main bedroom pilot, JK-1145)

**What:** The main bedroom now follows the two-flag model: a hand-only `main_bedroom_lighting_automations` (no `initial:`, no writers) and a `main_bedroom_lights_manually_toggled` latch set by the new `main_bedroom_lights_manual_change` (replaces `..._turned_off`) on any manual on/off/brightness change, cleared by an ungated reset on unoccupied 30 s, room Off or house empty. Room Off always turns the lights off; vacancy/bed/bedtime only while the hand flag is on (a stated behaviour change). Mode Auto's unoccupied branch also refuses Away/Vacation. 21 new tests, 26 sabotage checks. Remaining PRs: kitchen, garage, Phase 4 (one PR, a commit per room), Phase 5 (family_room, mudroom).

**Pre-mortem vs reality:** the brightness-noise risk was real but small: live data shows 1 of 22 attribute-only rows on the dimmer had no parent. Shipped with a stateless 10 s debounce rather than the on/off-only fallback. The "repo-wide" test bullets would have been red on master (kitchen has no reset automation, main bathroom has no `house_occupied` check); the review caught it and scoped them.

**Learnings:**
- The main bedroom light is a Lutron Caseta dimmer. Manual = user_id set, or no parent_id; automation = parent_id set and no user; Adaptive Lighting context ids contain `:al:`. Wall presses and device reports look identical.
- Guard `from_state` unavailable/unknown, or every reconnect latches the override.
- A plan claim ("matches the main bedroom today") was wrong: `lights_to_off` never checked the hand flag. Read the file before accepting a plan's description of it.
- A trigger-id `or` branch (`condition: trigger`) is how one automation gives one path no extra gates.
- Renaming an automation id leaves a registry ghost; nothing referenced the old alias.

**Follow-ups (backlog):** plan task 17 is wrong (`garage_mode_off` forces nothing today); `kitchen/LEARNINGS.md` lacks #73; `main_bedroom_mode_auto` has no Quiet trigger; dashboard "Manual override" rows land in Phase 4; recorder check after deploy (latch held more than an hour); clear the old automation registry ghost.

## PR 2 of 5: kitchen (supersedes #73)

The kitchen has the same kit: hand-only master switch, new `kitchen_lights_manually_toggled` latch, `kitchen_lights_manual_change` (folds the two old detection files), an ungated reset, latch gate on motion and day on (covers the Dim pendants), and Off turning lights off with neither flag. #73's `kitchen_mode_off` line and the `kitchen_not_occupied` write are gone; the #73 intent is a test now. 623 tests, 13 sabotage checks.

- The old #73 test encoded the mechanism (a line in `mode_off`), not the intent. Replace a mechanism test with an intent test when the mechanism moves.
- Deploy order matters for a new helper: input_boolean reload before the automation reload.
- Kitchen `mode_auto` has no occupancy-off trigger, so the bounce-guard test asserts that instead.

## PR 3 of 5: garage (stops the flapping)

Same kit; the flapping was two automations toggling the flag (63 changes each in 7 days) because the detection automation had no context check. The plan's task 17 was wrong: `garage_mode_off` only runs while the garage is already empty, so nothing forces occupancy off and nothing needed changing there. Vacancy-off (`garage_lights_off`, `garage_lights_motion_off`) now obeys the hand flag; `garage_lights_off` gained the house-wide check it lacked. The kitchen reviewer's pendant gap is closed in its own commit. 646 tests, 13 + 1 sabotage checks.

- Re-derive a plan task from the live code before building it; a premise that was wrong here would have added a harmful occupancy write.
- Live entity ids can carry clone suffixes (`_2`) that hide which automation owns a behaviour; read the logbook, not the repo, to attribute a flapping flag.

## PR 4 of 5: Phase 4 rooms, one PR (16 commits, 8 rooms with the kit, 8 mode-only)

Kit rooms: playroom, upstairs hallway, office, main bathroom, laundry (also gained the gate its toggle never had); dining room lost its unused flag and `lights_auto`. Mode-only rooms (basement, jr_suite, powder_room, mudroom_bathroom, sunroom, foyer, Nino's and Gianluca's rooms) have `mode_off` clearing occupancy, with the kids' rooms only when the bed is empty. The office is the one room where JK-1219 was NOT applied (it would switch off the DnD switch and speech and could bounce the room to Auto); its latch still clears on room Off. Main bathroom's and the kids' `mode_auto` gained the bounce guard behind a trigger id. Dashboard: Manual Override rows. 816 tests, about 70 sabotage checks.

- A flat action list in `mode_auto` needs a `choose` with a trigger id before the guard can be tested; the generic guard test must also assert the trigger id exists, or deleting the id leaves it green.
- A test that scans `packages/` for removed ids also scans `.md`; LEARNINGS must not name the removed helpers.
- Per-room generalisation needs name maps (`PACKAGE_DIR`, `MODE_ID`): package dirs, helper ids and automation ids disagree for laundry, Nino's and Gianluca's rooms.
- Listener audits are what make JK-1219 safe: three outcomes (apply, apply behind a condition, defer).

## PR 5 of 6: family room and mudroom migration (behaviour-neutral)

Phase 5 split in two: this migration, then the kit. 10 family room and 8 mudroom automations moved from the legacy `automation/` dir into `packages/` in modern syntax (ids, aliases and `initial_state` pinned by a manifest test); both selects and the family room occupancy boolean moved with identical definitions (no option changes, so no input_select reload). The invalid `On`/`Dim` option calls sit in automations that are disabled live (last run 2022); they were repointed at `Auto` and stay disabled. A repo-wide test now checks every literal `select_option` against the select's defined options (113 calls, 49 selects, zero violations, empty ratchet allowlist). 863 tests, 31 sabotage rows.

- Preview the live facts before a "behaviour-neutral" migration: the four disabled automations, the `_2` registry entity id and the missing Off/Auto options on the mudroom all changed what neutral meant.
- Only `.yaml` counts as a definition: HA never loads `.yml`, so a parked select must not hide a bad call.
- A migrated file keeps its `id` (the registry key), not its old filename; renaming files is free, renaming ids is not.

