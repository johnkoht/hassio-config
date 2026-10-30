## Pre-Mortem: House Mode Resolver

Date: 2026-10-30. Single PR. Checked against the worktree at origin/master 183ac50: `automation/house/modes/*`, `packages/house/{bedtime_mode,occupancy,vacation_mode,quiet_mode}`, `packages/security/alarm/*`, the 11 room `*_mode_auto` files plus foyer/hallway, every `input_select.house` consumer (grep), and the emergency-mode learnings (announcements are keyed on the `quiet_mode`/`bedtime` booleans, not the select, so emergency mode is unaffected).

Live read-only check (Task 9): select Quiet, `quiet_mode` on, `bedtime` off, `house_occupied` on, `vacation_mode` off. The resolver computes Quiet, so the first reload makes no transition.

### Risk 1: A bedtime-to-off run of `alarm_disarm_in_morning` disarms the house at night, or disarms a re-armed house (HIGH, alarm)

**Problem**: Its only time gate is "after 05:00", true until midnight. The new arrival path (and the existing #87 one) turns `bedtime` off at night, which starts the run; it waits up to 2.5 h for first-floor occupancy and then disarms. It checks `armed_home` and bedtime only before the wait, so if bedtime came back on and the house re-armed meanwhile, it still disarms. That leaves the house disarmed overnight.

**Mitigation**: Add `before: "12:00:00"` to the start condition. After the wait, re-check in sequence: bedtime off, panel `armed_home`, house occupied, time 05:00 to 12:00. Any failure ends the run with the panel untouched (fail armed).

**Verification**: Structural tests on the file (the bound, and the four re-checks sitting between the wait and `alarmo.disarm`), sabotaged by deleting the `before:` and by deleting each re-check.

### Risk 2: Transient Bedtime when someone arrives into a bedtime house (MEDIUM)

**Problem**: On arrival `house_occupied` turns on and the arrival automation turns `bedtime` off at about the same moment. If the resolver runs first it sees occupied + bedtime on and selects Bedtime for a second. The select goes Away to Bedtime to Quiet/Auto, firing Bedtime consumers (`office_mode_off`, `garage_mode_off`, `mudroom_mode_night_motion`) for no reason.

**Mitigation**: The `house_occupied to on` trigger carries `for: 5 s`, so the arrival automation ends bedtime first. `to off` stays immediate (Away must not wait), and `bedtime`/`quiet_mode`/`vacation_mode` changes stay immediate.

**Verification**: Test pins the debounced trigger and the immediate off trigger. Live: the Logbook shows no Bedtime blip on the next night arrival.

### Risk 3: Vacation hold is lost across a restart or reload (MEDIUM)

**Problem**: Vacation needs the house empty for 2+ min. A state trigger with `for:` is dropped by an automation reload and does not start after a restart, and `last_changed` resets on start. An empty vacation house would sit in Away forever.

**Mitigation**: The hold counts as met when the run comes from the start/reload triggers, or when `house_occupied` has been off for 120 s or more by `last_changed`. Verified by rendering the real template for each combination.

**Verification**: Table-driven Jinja test; sabotaged by removing the restart clause.

### Risk 4: Unknown inputs make the resolver guess (MEDIUM)

**Problem**: At start or after an entity reload an input can read `unknown`/`unavailable`. A template that treats "not on" as off would select Auto or Away (Away arms the house and turns rooms off).

**Mitigation**: The target is empty unless all four inputs are exactly `on`/`off`, and the automation does nothing when the target is empty or the select itself is unavailable. Triggers use `to: [on, off]`.

**Verification**: Test cases for each input unavailable and unknown.

### Risk 5: Bedtime ending with Quiet leaves rooms Off (MEDIUM, R3 of the plan)

**Problem**: Room Auto automations require house exactly Auto. A file missed means a common room stays Off all morning.

**Mitigation**: Re-grep `input_select.house` conditions and triggers at build time; edit the 11 listed files plus the foyer trigger (OD-9). `hourly_dong` also requires Auto: Quiet correctly keeps it silent. A test scans every automation that requires the house to be exactly Auto and checks the allowlisted exceptions.

**Verification**: Scan test with a named allowlist of Auto-only consumers; sabotaged by reverting one room.

### Risk 6: Side effects change on the move (MEDIUM)

**Problem**: Speech-on, doorbell text, away push and nap speech-off now key on select transitions instead of running on each edge. Differences: speech turns on only when the select changes to Auto (not on a repeat edge while already Auto); bedtime ending into Quiet no longer turns speech on (intended: Quiet); doorbell text follows Quiet instead of staying WELCOME.

**Mitigation**: Strings copied verbatim; mapping covered by a test rendering the template for every option. Away push and speech-on ignore transitions from `unknown`/`unavailable` so a helper reload does not spam. The doorbell text does not, so it self-corrects.

**Verification**: Tests plus the explicit deploy note below.

### Risk 7: Two writers during the cut-over (LOW)

**Problem**: If the legacy files and the resolver coexist, both write the select.

**Mitigation**: The six legacy files are deleted in the same commit that adds the resolver. A test asserts `automation/house/modes/` is gone and that no other file writes `input_select.house` except the dashboard-driven `house_away` script (departure only, unchanged).

**Verification**: Test; grep.

### Risk 8: Old automation entity ids go unavailable (LOW)

**Problem**: The six old entity ids derive from their aliases and become registry ghosts. Re-grep shows no YAML or dashboard references.

**Mitigation**: Cosmetic; clean up after deploy (plan X2). Not part of this PR.

**Verification**: grep for `automation.house_mode_` returns nothing outside docs and tests.

### Risk 9: `bedtime_mode_off` rewrite ends bedtime too eagerly or never (MEDIUM)

**Problem**: New rules: any home adult awake ends bedtime, no adult home also ends it (sitter), only 05:00 to 12:00. Danger: the per-person in-bed triggers fire in the evening (now excluded by the time bound), and an empty home would end bedtime at the fixed morning time.

**Mitigation**: Rendered condition test over the cases (one home adult awake, one awake but away, none home, in-bed flap at night, in-bed flap at 10:00). Mode single, no `initial_state` change.

**Verification**: Test; sabotage by restoring the old away branch.

### Risk 10: Docs go stale (LOW)

**Problem**: LEARNINGS says `house_mode_auto` selects Auto; PEOPLE.md says both adults.

**Mitigation**: Update the four docs in the plan, plus the `bedtime_mode_off_on_arrival` header ("returns to Auto") and the `packages/CLAUDE.md` house-mode line.

**Verification**: grep for `house_mode_auto` and "both" in docs.

## Summary

Total risks identified: 10
Categories: alarm safety, integration, restart/reload, backward compatibility, test complexity, documentation
CRITICAL risks (must address before proceeding): none. Risk 1 is the highest and has an in-scope fix (Task 7 plus the post-wait re-check).
