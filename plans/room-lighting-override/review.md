# Review: Room Lighting Override (PR 1 scope)

Independent reviewer (sonnet), 2026-10-30, against master 9d766de. Type: Plan + pre-mortem. Review path: Full. Complexity: Large (whole plan), PR 1 is Medium.

**Verdict: Approve with suggestions.** No structural blocker; no CRITICAL pre-mortem miss. Four DEFECTs fold into the PRD/plan before build; none changes the approved scope.

## Findings

1. **[DEFECT] Plan "Tests" bullets read repo-wide** for the bounce guard and a loose ordering invariant; both would be red on master (main bathroom has no `house_occupied` in its Auto; kitchen has no reset automation). Fix: ordering invariant accepts three shapes (reset automation; `not_occupied` doesn't write the flag; `mode_off` itself resets the flag unconditionally in its action list, which is kitchen via #73). Bounce guard is per migrated room and asserted on the `main_bedroom_unoccupied` branch, not file-wide. Fixed in plan.md and prd.md.
2. **[DEFECT] Manual-change spec lacked a guard for `unavailable`/`unknown`.** An integration reconnect or restart produces on/off changes with no parent_id and would set the latch falsely. Fix: require `from_state.state in ['on','off']` and a test.
3. **[DEFECT] `lights_to_off` rule under-specified.** Plan claims the vacancy path "obeys only the hand flag" and "matches the main bedroom today"; the file never checks the hand flag today (check commented out). Adopted rule: trigger ids `room_off` / `vacancy` / `flag_on`; global flag + lights-on always; then OR of (A) trigger `room_off` with nothing else, (B) hand flag on AND the existing occupied-off / in-bed / bedtime block. The latch entity does not appear in the file. This is a real behaviour change (hand flag off now stops vacancy-off); recorded in the PR text, not "matches today". Dead `input_select.house` to `Off` trigger removed.
4. **[DEFECT] PRD must pin the Phase 0 contingency** so tests don't need rewriting. Done in prd.md "Phase 0 result": brightness ships with a stateless debounce; test asserts the trigger shape and the debounce text.

## Backlog

- Bounce-guard test asserts on the specific branch, not file-wide (adopted).
- README/LEARNINGS note that the latch watches `light.main_bedroom_main_lights` only, not the lamps in the group (adopted).
- Plan task 17 is wrong: `garage_mode_off` requires `garage_occupied` already off and does not force anything. Re-derive in the garage PR (note added to plan.md).
- Live latch is on now; first latch after deploy is not a false positive. Deploy note.
- Duplicate-basename check (`!include_dir_named`) in the test file pre-flight (adopted).
- `kitchen/LEARNINGS.md` lacks #73; add in the kitchen PR.
- `main_bedroom_mode_auto` has no Quiet trigger (`to: Auto` only); out of PR 1 scope, resolver backlog.

## Devil's advocate (reviewer)

Fails most likely through false-manual latching on a parentless device report (the spike's remaining 1-in-22 attr-only rows), killing motion lights until the room empties; self-heals at the next Off/unoccupied. Worst outcome: the latch silently sticks for hours in the bedroom. Mitigated by the recorder check.
