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

