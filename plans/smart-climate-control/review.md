## Review: Smart Climate Control (dry-run build scope)

**Type**: Plan (with pre-mortem)
**Review Path**: Full (11 tasks, 6 layers, 5+ files, architectural decisions)
**Complexity**: Large
**Recommended Track**: full (one PRD, built in layers: helpers and decision sensors, resolver, controller script, override detection, season and forecast, dashboard)

Method note: the Decisions block is treated as binding. The pre-mortem's corrections are assessed on whether they serve it. Verified against the repo: `house_mode_resolve.yaml` and `tests/test_house_mode_resolver.py` (resolver precedent and harness exist), `packages/climate/LEARNINGS.md`, the kitchen statistics gotcha, and the existing climate files.

### Concerns

**BLOCKERS**

1. **[Plan vs pre-mortem drift]**: The plan still describes the superseded design: `climate_dry_run` polarity, context-based override detection, per-transition mode files, task 2 seeding "from the setpoint table in `docs/climate_automation_plan.md`". The pre-mortem corrects all of these, but `has_pre_mortem`/`has_review` are false and nothing reconciles the two. A PRD built from the plan text would reintroduce Risks 1, 2 and 12.
   - Suggestion: Before plan-to-prd, patch the plan (or make the PRD explicitly supersede it): `climate_live_control` (off = dry-run), value-based override, resolver, `climate_seed_defaults`. Seed values come from the Decisions block only. That doc also holds household schedule detail (the plan already flags it), so it must not be a data source.

2. **[Controller script concurrency]**: The plan has one `script.climate_apply_zone` taking a zone argument. Pre-mortem Risk 5 adds a wait of up to 60 s between the Nest mode and temperature calls. With `mode: queued` (repo precedent for shared resources), one stalled Nest blocks every other zone behind it, and `queued` has a max. With `mode: parallel` or `single`, two triggers for the same zone interleave or get dropped. This makes the controller unbuildable as specified.
   - Suggestion: Decide it in the PRD. Either a thin per-zone wrapper script calling a shared sequence (each wrapper `mode: restart`/`single`), or `parallel` with a per-zone in-flight guard keyed on the zone's `last_write` helper. Add a test that two zones apply concurrently.

3. **[Nest "Away = wide band" needs heat_cool, which neither document specifies]**: The decided Away is a 65 floor and 79 ceiling. On a Nest that is `heat_cool` with `target_temp_low`/`target_temp_high`. Comfort and Sleep use one setpoint, in `heat` or `cool` per season. Nothing defines the hvac_mode per (season x mode), what happens in the hold band, or how the season pin (Heating/Cooling) interacts with Away. Risk 5's "mode then `set_temperature`" is also wrong for heat_cool, which needs low and high together. The decision sensor and the diff test can't be written without this.
   - Suggestion: Engineering call, but write it down as a table in the PRD (mode x season -> hvac_mode, which data keys). Test every cell, including that the 0.5°F diff check compares low and high separately.

**SHOULD-FIX**

4. **[Dry-run cannot validate the riskiest assumptions]**: The soak (even if built perfectly) validates decisions only. Never exercised in dry-run: whether a Nest set lands on the right side, Nest C-to-F rounding, the Ecobee hold type (the plan says it is unknown), `preset_mode: temp` behaviour, Nest fighting the controller, grace-window length. Value-based override also depends on these. In dry-run `last_write` never updates, so override detection can't be tuned either, and any mismatch (including old Eco toggles) reads as a would-be Override.
   - Suggestion: State in the PRD and PR that live-write behaviour is untested until migration. Pre-mortem 1 and 7 verifications are render tests only. Add a tolerance to the value comparison (about 1°F, for Nest rounding). Propose a supervised single-zone canary (see Needs John).

5. **[Fighting loop has no breaker]**: The drift check and re-apply triggers re-apply on mismatch. If the Nest flips mode on its own (documented in LEARNINGS), controller and Nest can ping-pong, burning SDM quota every cycle. The pre-mortem has debounce only.
   - Suggestion: Cap re-applies per zone per hour (counter or the last_write helper), then stop, log, and push once. Test it.

6. **[Soak evidence is purged]**: Recorder `purge_keep_days` is 7, and logbook and states age out with it. A "at least a week" soak loses its first day's evidence, and decisions are only comparable with old-automation behaviour while both are still in the recorder. Dry-run logbook entries on every re-evaluation would also spam.
   - Suggestion: Log only on decision change, in one structured line (zone, mode, season, target, current, would-write yes/no). Emit it to a durable, gitignored sink (file notify, or similar) so the soak review isn't racing purge. Note in PR that soak review should happen mid-week.

7. **[Statistics sensor needs a restart; hysteresis state is not restored]**: A new `statistics` sensor under `sensor:` is not picked up by `--reload`, and only John restarts HA. Until then the season stays unavailable. Separately, a `this.state` template does not survive a restart (template sensors aren't restored, unless trigger-based). The "hold in between" band then falls back to a default after every restart.
   - Suggestion: Keep the last resolved season in a restored helper (`input_select` Heating/Cooling, written by one automation on the sensor's crossings), not in `this.state`. Make Auto with the sensor unavailable use that helper. List in the PR which domains John must reload (input_*, template) and that the statistics sensor needs a restart. Dry-run must tolerate its absence.

8. **[Live toggle is one tap from a fight]**: Task 11 puts `climate_live_control` on the dashboard while the old Eco automations are active (they stay untouched in this build). Risk 11 mitigates with documentation only. One mistaken tap makes two systems write the Nests.
   - Suggestion: Don't expose the live toggle on the dashboard in this build, or add a hard interlock in the script's live branch (a second `climate_legacy_retired` boolean, or a check that the legacy Eco automations are off). Resolve the entity IDs by alias, per the memory note (entity_id comes from alias, not id).

9. **[Radiant Sleep/Away/Vacation values are undecided]**: Decisions give radiant Comfort 67-68, a cold-weather 69-71, a 71 cap, a humidity guard, and "slabs hold steady". Layer 1 and Risk 4 still define Sleep/Away radiant profiles, and Away/Vacation for the five zones is not specified (the garage is a separate 55 guard). The range values (67-68, 72-73, 75-76) also need a single seed value each.
   - Suggestion: Engineering default in the PRD: radiant ignores Sleep (stays Comfort), and Away/Vacation drops to a modest floor. Flag the seed values in the PR. See Needs John for Away.

10. **[Energy offset is unspecified in the pre-mortem]**: Task 8 and the plan's offset (shift a few degrees toward cheaper while price is high, 15 min dwell) has no risk entry. Open points: the sign flips between heating and cooling; the offset must still be clamped to the Away band and, for radiant, the 71 cap (Decisions say price shifts go to the Nests only, so radiant should take zero offset); it must not turn into a mode flip; the price source and its unavailable state.
    - Suggestion: Add to the PRD: offset applies to the two Nests only, applies before clamps, is 0 when the price sensor is unavailable. Render tests for sign by season.

11. **[Humidity guard dedupe]**: A push each time `average_indoor_humidity` dips below 30 will flap around the threshold (and when the sensor is unavailable). The guard only skips the bump, so it is safe, but noisy.
    - Suggestion: `delay_on`/`delay_off` binary sensor with hysteresis (a couple of points), push on the on-edge only, once per day. Treat unavailable as not-low and as no bump.

12. **[Garage seasonal behaviour]**: Garage is a fixed 55 frost guard with no modes, but the garage is not in `radiant_floor_heating_group` and the plan doesn't say whether it follows the season (heat vs off in summer), or the 71 clamp (irrelevant, fine). Resolver must keep the garage out of the mode machine.
    - Suggestion: PRD: garage holds 55 in `heat` only while season is Heating or outdoor temp is below a helper threshold; otherwise leave it alone. Do not give it a mode select.

13. **[Resolver specifics beyond the pre-mortem]**: Risk 12 covers the resolver, but the plan's guest_mode, Off, and Override semantics need rules. What does guest_mode change? Override is a value in the same select as the mode, so the underlying mode is lost while overridden; the resolver "clears Override on an event" must recompute, not restore. The per-zone selects need an explicit rule for Quiet (2nd floor only) vs radiant. `automation_reloaded` rerun is correct; also run at start of each decision, not only for `for:` timers.
    - Suggestion: Define guest_mode as "treat as occupied, no Away" (or ask), and make the resolver pure state -> mode (as `house_mode_resolve` is). The existing `test_house_mode_resolver.py` is the harness to extend.

14. **[Seed script semantics]**: Seeding once is right, but "John runs it once" is a trap: a re-run later silently resets dashboard edits. Also seeded values must satisfy each helper's min/max (pre-mortem tests this).
    - Suggestion: Make the seed script refuse when `climate_automations` is on, or only set helpers still equal to their min. Test that it's idempotent in the first case.

**SUGGESTIONS**

15. **[Plan mismatch: the plan says 5 radiant zones + maybe a 6th]**: Task 1's check on a 6th Ecobee is still open; the pre-mortem assumes 5. Verify before the zone list is hard-coded (the existing group also omits the garage and main_bedroom/basement membership should be checked).
    - Suggestion: Zone list in one place (a variables block or helper) so adding a zone is one edit.

16. **[Risk 9 sampling_size]**: 20000 is fine for 7 days of about 71 s reports (about 8,500), but the existing mean is lost to the purge window on restart. Also pin `precision` and treat `unavailable` as "hold".
    - Suggestion: As in the pre-mortem. Add an explicit test that the season sensor's entity ID is referenced by exactly one consumer.

17. **[Privacy]**: The pre-mortem handles time literals well. Also grep that the dry-run log sink, dashboard labels and README don't name anyone's room schedule. Radiant bedroom names are in entity IDs already (acceptable, existing).

18. **[Test harness reuse]**: Several existing tests interpret templates/scripts (`test_house_mode_resolver.py`, `test_crazy_mode.py`). Reuse that approach rather than inventing a new interpreter; a new `tests/test_climate_*` is expected.

### AC Validation Issues

The plan has no acceptance criteria, only tasks, so the PRD must supply them. The pre-mortem's "Verification" lines are the right form (specific, testable). Gaps:

| Task | AC | Issue | Suggested Fix |
|------|-----|-------|---------------|
| 3 | "Resolver derives mode" | No test list for guest_mode, Off, Override recompute, Quiet scope | Add cases (concern 13) |
| 4 | "Idempotent, writes nothing when unchanged" | "Unchanged" undefined for Nest rounding and heat_cool low/high | 0.5°F per field, rounded; test low/high |
| 5 | Override "clears on next house event" | Which events, per zone? Dry-run never sets it | Enumerate events; test in render only |
| 6 | "Hysteresis" | Hold-band state source | Restored helper (concern 7) |
| 7 | "Compute lead time from task 1 data" | Radiant rates are unmeasured; lead time source when absent | Helper defaults + clamp (max lead), documented |
| 8 | "Offset in the controller" | No sign/clamp ACs | Concern 10 |
| 11 | "Dashboard controls" | No test expectation | Extend `test_dashboard_views`; live toggle decision (concern 8) |

### Test Coverage Gaps

- Task 3: no tests in the plan (the pre-mortem adds resolver render tests, good).
- Task 5: override detection and event resume have no tests in the plan; pre-mortem Risks 1 and 7 supply them.
- Task 6: season crossover tests only in the pre-mortem. Add restart-with-sensor-unavailable.
- Task 7: forecast pre-conditioning has no test. Needs: forecast attribute missing/short, lead time clamped, no fire when mode is Override or Off, no fire when `climate_live_control` is not on (dry-run logs only).
- Task 8: none.
- Re-apply rate cap (concern 5), concurrency (concern 2), dry-run log dedupe (concern 6): none.

### Strengths

- The pre-mortem found two real design faults (context detection on Nest, dry-run polarity) and fixed them with live facts, not guesses. Value-based detection with a grace window is sound and is the right fix; the Ecobee `preset_mode: temp` discrimination is a good, cheap addition.
- Inverting to `climate_live_control` (fail-safe on unknown/unavailable) plus a master boolean that starts off is correct.
- The resolver-as-single-writer follows the `house_mode_resolve` precedent; the 71°F cap as a constant applied twice is the right safety shape.
- The hard cap, humidity and radiant decisions are all encoded as tests rather than prose.
- Dry-run-only scope with old automations untouched keeps blast radius small.

### Devil's Advocate

**If this fails, it will be because...** the dry-run soak "passes" on decisions while the real write path (Nest side selection and rounding, heat_cool low/high, Ecobee hold type, the Nest changing mode on its own) behaves differently once live. Value-based override and the grace window rest on those behaviours, none of which dry-run exercises, and the first live exposure is the migration, with the old automations deleted. The build can look complete and still have its riskiest half unproven.

**The worst outcome would be...** a live controller fighting the Nests (or the old Eco automations) in a loop on a cold night: mode flip-flop with no rate cap, burning the SDM quota and leaving the main floor (about 31 min/°F, 3.5 h to recover from Away) cold, or a radiant zone on an uncapped path drying and damaging the floors. The live toggle on the dashboard before migration, and no re-apply breaker, are the shortest paths to it.

### Verdict

- [ ] Approve
- [ ] Approve with suggestions
- [ ] Approve pending pre-mortem
- [x] Revise

Revise means fold the pre-mortem corrections into the plan/PRD and resolve blockers 1-3, then proceed. The approach itself is sound; no decision needs reopening.

### Suggested Changes

**Change 1**: Plan reconciliation
- **What's wrong**: Plan text contradicts the pre-mortem corrections.
- **What to do**: Update layers 3-4, tasks 2-5, and the dry-run description to the pre-mortem design; set `has_pre_mortem: true`; seed from Decisions only.
- **Where to fix**: `plans/smart-climate-control/plan.md` (or the PRD, stated as superseding).

**Change 2**: Controller concurrency and hvac_mode table
- **What's wrong**: One shared script with a 60 s wait; no mode x season -> hvac_mode/data table.
- **What to do**: Per-zone wrapper or parallel with an in-flight guard; add the table; re-apply cap per zone per hour.
- **Where to fix**: PRD, controller task; `packages/climate/smart/`.

**Change 3**: Fail-safe around live control
- **What's wrong**: Live toggle exposed on the dashboard beside active legacy automations.
- **What to do**: Omit the toggle in this build or add an interlock; document in README and PR.
- **Where to fix**: Task 11, controller live branch.

**Change 4**: Durable, deduped dry-run log
- **What's wrong**: 7-day purge erases soak evidence; per-evaluation logging spams.
- **What to do**: Log on decision change, structured, to a gitignored durable sink.
- **Where to fix**: Controller dry-run branch.

**Change 5**: Season persistence
- **What's wrong**: `this.state` hysteresis lost on restart; statistics sensor needs a restart.
- **What to do**: Restored helper for last season; reload/restart note in the PR.
- **Where to fix**: Task 6, PR body.

### Needs John (human decisions) vs engineering calls

Needs John:
- **Away recovery expectation**: With Away at a 65 floor, main floor recovery is about 3.5 h. `nearly_home` fires too late to cover it, so arrival comfort on the main floor lags unless pre-conditioning keys on something earlier. Confirm that is acceptable (or raise the main floor Away floor).
- **Radiant Away/Vacation setpoint** (and whether Sleep differs from Comfort): not in Decisions.
- **First live write**: whether to do a supervised canary on one zone (the garage frost guard is the lowest risk) before migration, to measure Ecobee hold type and Nest rounding. This is the only way to validate the live write path before task 10.
- **Guest mode meaning** for climate, if it is more than "occupied".
- Already flagged: main floor Sleep at 72 (pre-mortem 15); `docs/climate_automation_plan.md` history rewrite.

Engineering calls (decide in the PRD, tell John in the PR): heat_cool table, per-zone script concurrency, tolerances and rate cap, seed values within the decided ranges, restored season helper, offset sign and clamp, garage seasonal rule, dry-run log sink, dashboard live toggle omission.

## Re-review (2026-11-24)

Read: plan.md "Build corrections", prd.md design decisions 11-16 and the Controller, Sensors, Modes sections.

**Blockers**
1. Plan vs pre-mortem drift: **resolved.** The "Build corrections" section states the PRD supersedes the layer text, and the PRD carries the inverted polarity, value-based override, resolver and seed script. (Cosmetic: the plan's older layer text and `has_pre_mortem: false` frontmatter are still stale; update the frontmatter.)
2. Controller concurrency: **resolved.** Per-zone `queued` wrapper over a shared `parallel` script (decision 12) means one stalled Nest cannot block another zone, and same-zone runs cannot interleave.
3. hvac_mode table: **resolved.** Decision 11 gives a single-setpoint table, no `heat_cool`, and no preset use. Residual trade-off: the Away floor only exists in Heating and the ceiling only in Cooling, so there is no cold-side floor in Cooling season. In dry-run this is acceptable; mention it to John.

**Changes 3-5**
- Change 3 (live toggle): **resolved for the dashboard** (decision 14). The helper still exists in the HA UI, so there is no hard interlock; acceptable for dry-run.
- Change 4 (durable soak log): **resolved.** `state_class: measurement` on the decision sensors keeps hourly targets in long-term statistics, and the logbook writes only on decision change. Gap (SUGGESTION): the old automations' actual setpoints are not kept beyond 7 days, so the comparison must use mid-week snapshots.
- Change 5 (season persistence): **resolved**, with the trigger-based template sensor restoring state, and `statistics.reload` removes the restart need. Verify on the host that `this.state` is populated after a restart.

**New blockers in the PRD**: none.

**New SHOULD-FIX (build-time, not blocking)**
- `custom_templates/climate_control.jinja` has no precedent in this repo (the directory does not exist). Render the real macro on the host before relying on it. New or edited macro files need `homeassistant.reload_custom_templates`, so add that to the deploy notes. Until it runs the 7 decision sensors error, and in dry-run they must fail safe (`skip`/unknown).
- Controller step 5 sets `last_write` before the writes, but `set_temperature` can follow up to 60 s later. The 180 s grace then has about 120 s left, which is under the Ecobee 180 s poll. Set `last_write` again after the final write, or use a grace of 300 s for Ecobee.
- Resolver also clears Override on `quiet_mode` and `guest_mode` toggles. Intended house events are bedtime, wake, arrive and depart; confirm this is wanted.
- The seed script is labelled "reset to defaults" in the popup, so a tap overwrites tuned helpers. Add a confirmation, or have it skip helpers already changed.

### Updated Verdict

- [ ] Approve
- [x] Approve with suggestions
- [ ] Approve pending pre-mortem
- [ ] Revise

All three original blockers are resolved. No unresolved blocker.
