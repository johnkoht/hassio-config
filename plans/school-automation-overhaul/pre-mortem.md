# Pre-Mortem: School Automation Overhaul

**Framing**: It is late November 2026. This shipped badly. What happened?

`review.md` (verdict Revise, revisions applied) already covers: the `initial:` inversion, multi-day event matching, the incomplete delete list, the `morning_update` ordering crash, secrets push ordering, `hours: /1`, `event_template_reloaded`, `get_events` zero-entity raise, naive timestamps, the grade-scope guard, the 255-char state limit, dedup, athletics filter ordering, `reload_all` concurrency, host `kohbo.yaml` divergence, and the missing rollback/baseline sections. **Those are not re-derived here.** This pre-mortem looks for what the review missed.

No `PROFILE.md` or `LEARNINGS.md` exists in this repo, so no expertise profiles were available to load.

---

### Risk 1: Verification structurally cannot happen inside the build

**Category**: Dependency ordering / Environment
**Severity**: **CRITICAL**

**Problem**: This repo has no local runtime. Code reaches Home Assistant only via `./deploy.sh`, which makes the Yellow `git pull` **from GitHub**. Every meaningful acceptance criterion in plan task 20 — "each new sensor resolves to a real value, not `unknown`", "each `get_events` target actually resolves" — requires the code to be live on the Yellow. That cannot be checked from a worktree branch that hasn't been merged and pushed.

So the ship workflow's shape is wrong for this repo: Phase 4 (build in worktree) → Phase 5.4 (`/wrap` verify) → Phase 5.7 (merge) puts verification *before* the only thing that makes verification possible. A build that "passes" in the worktree has proven nothing except that YAML parses.

**Mitigation**: Split the ship at the merge boundary. Everything through plan Phase 3 (files written, `ha core check` green, basename-collision check clean) is worktree work and can complete in Phase 4. **Plan tasks 20, the shadow-run gate, and every manual step are post-merge and must be re-scoped as a follow-up session, not build tasks.** The PRD must mark them explicitly as `post-deploy` so `/build` does not attempt them and does not report success on them.

**Verification**: `prd.json` contains no task whose acceptance criteria require a live HA query. Grep the PRD for "resolves", "live", "verify on the Yellow" — those must all sit in a clearly-labelled post-deploy section.

---

### Risk 2: The plan has ~6 human-only steps interleaved with automated ones

**Category**: Environment / Dependency ordering
**Severity**: **CRITICAL**

**Problem**: `/ship` assumes autonomous execution. This plan cannot run autonomously. It requires John to personally: `scp` secrets down and back up (task 2, 4, 5); unsubscribe and re-subscribe a Google Calendar and rename the resulting entity (manual step); delete five `.storage` helpers via the UI; set every new schedule value through the dashboard after task 19 (they ship empty by design); and verify host `kohbo.yaml` before task 19.

A `/build` run will reach task 4 and stop — or worse, proceed and commit a `!secret` reference whose key isn't on the host yet, which is Risk 5 in `review.md` (config refuses to load; the house goes dark).

**Mitigation**: Restructure the PRD into **two tracks**. Track A (autonomous, worktree): write all YAML, no commits that reference new secrets keys, `ha core check` against a locally-present `secrets.yaml`. Track B (John, gated): the secrets round-trip, the calendar re-subscribe, the `.storage` deletions, the schedule-value entry. Track A must produce a **single explicit handoff checklist** for Track B rather than assuming it happened. The secrets push in particular becomes a hard gate: no commit referencing `!secret primary_school_calendar` may be created until John confirms the key is live on the Yellow.

**Verification**: PRD has an explicit `## Human Gates` section listing all six with a checkbox each; no autonomous task's ACs depend on a human gate having completed.

---

### Risk 3: The override booleans have no reset — the exact latch bug this project exists to kill

**Category**: Backward compatibility / Scope drift
**Severity**: **CRITICAL**

**Problem**: `review.md` correctly promoted `input_boolean.school_day_override_off` and `input_boolean.early_dismissal_today` to required. Neither the review nor the plan says **who turns them off**. They are manual latches with no nightly reset. John flips `school_day_override_off` for a snow day in January, the snow melts, and school is silently "off" for the rest of the year — no departure reminders, no pickup reminders, morning briefing says no school every day.

This is precisely the failure already recorded in memory: *"gated reset automations latch flags forever"* — the birthday countdown bug, where a flag was set and the reset never fired. The plan's entire thesis is "derive, don't latch," and then it introduces two unmanaged latches to patch the one gap deriving creates.

**Mitigation**: Both booleans get an unconditional nightly reset automation at 23:58 — **no conditions on the reset**, since a gated reset is what latched last time. Add to plan task 8. The reset must be its own file (`school_overrides_reset.yaml`) so it is visible, and it must not be gated on school-year-active, house-occupied, or anything else.

**Verification**: `school_overrides_reset.yaml` exists, its `conditions:` block is absent or empty, and a trace shows it firing on a non-school day.

---

### Risk 4: Rollback does not actually roll back

**Category**: Rollback safety
**Severity**: **CRITICAL**

**Problem**: The plan's rollback section says "revert Phase 4 (which restores the old files and their entities)." That is false for this repo. Four of the automations being restored carry `initial_state: off`, and their *enabled* state lives in `.storage`, not in the YAML. Memory entry `reference_initial_state_does_not_reenable.md`: **"HA restores last runtime enabled state; a disabled automation stays disabled silently — zero saved traces is the tell."**

So after a `git revert` of Phase 4, `school_departure_reminder` and friends come back as files but stay **disabled**, because `district_school_year_activate` — the automation that used to enable them — was itself deleted in the same phase. The rollback produces a system where the new automations are gone and the old ones exist but never fire. Nobody gets to school, and the failure is silent because there are no traces to look at.

**Mitigation**: The rollback procedure must include explicitly re-enabling the restored automations via `automation.turn_on` (they will not self-enable), and must restore `district_school_year_activate.yaml` **first**, before or with the others. Write this as an ordered command list in the plan's Rollback section, not prose. Better: before Phase 4 deletion, record the current enabled/disabled state of all eight existing school automations alongside the `.storage` helper values in task 1's Environment section.

**Verification**: Rollback section contains a numbered command sequence including `automation.turn_on` calls with explicit entity IDs. Task 1's Environment section records enabled-state per automation.

---

### Risk 5: Two departure announcements every morning where there was one

**Category**: Scope drift / Integration
**Severity**: HIGH

**Problem**: Today there is a single `school_departure_reminder` covering both kids. The plan splits it into two — Gianluca at 07:45, Nino at ~08:20 (~09:20 Wednesdays). That is a **behavior change nobody asked for and nobody has evaluated**: the house now plays a school-bell chime and a TTS announcement twice every school morning, 35 minutes apart, through `media_players: auto` into whichever rooms are occupied.

The split is justified — different kids, different times, different drivers — but the *announcement* consequence wasn't discussed. The likely 3-month outcome is that the second announcement becomes noise and gets muted, taking the useful one with it.

**Mitigation**: Ship both departure reminders **push-only** for the first week (already in plan task 14) and make the TTS enablement an explicit decision point at the end of that week rather than an automatic un-suppression. Consider routing Gianluca's 07:45 to push-only permanently, since Cristina is the only person who needs it and she's the one leaving.

**Verification**: Plan task 14 states the week-one review as a gate with a named decision, not a scheduled un-suppression.

---

### Risk 6: The shadow-run gate and the Friday-landing guidance contradict each other

**Category**: Dependency ordering
**Severity**: HIGH

**Problem**: The plan says land Phases 2–4 on a Friday evening or Saturday so the first live exercise is a watched Monday. It also says run a 2–3 school-day shadow comparison after Phase 2 before proceeding. Those cannot both hold: land Phase 2 Saturday → shadow Monday–Wednesday → Phases 3–4 land mid-week, on a live school day, which is exactly what the landing guidance exists to prevent.

**Additional trap**: late start is Wednesday-only. A 2-day shadow run starting Monday never exercises `binary_sensor.primary_school_late_start_today` — the highest-risk derived sensor in the plan, and the one replacing a mechanism that demonstrably broke before.

**Mitigation**: Restate as two weekends. Weekend 1: land Phases 1–2. Shadow-run the full following week, **which must include a Wednesday**. Weekend 2: land Phases 3–4. The plan's landing paragraph and shadow-run gate both need rewriting to say this explicitly.

**Verification**: Plan states "shadow run must span at least one Wednesday" and the phase-landing paragraph references two weekends.

---

### Risk 7: `morning_update.yaml`'s second calendar aggregation is unguarded

**Category**: Integration / Performance
**Severity**: HIGH

**Problem**: `morning_update.yaml:247-252` runs a **separate** `calendar.get_events` aggregation feeding `sensor.calendar_events_today`, distinct from the tier-classified school sensors. It is not tier-filtered. The plan fixes line 248's phantom calendar but says nothing about what may be added to that list. Adding `calendar.olph_school` there — an obvious-seeming improvement — pipes 710 events, 523 of them grade 5–8 volleyball practices, into a daily ChatGPT prompt.

**Mitigation**: Add an explicit note to plan task 17: `calendar.olph_school` and `calendar.gianluca_school` must **not** be added to the `calendar_events_today` target list; school events reach the briefing only through the tier-capped `sensor.school_events_today`. Put the reason in a YAML comment at that line so a future editor sees it.

**Verification**: Comment present at `morning_update.yaml:247`; the target list is unchanged apart from the line-248 fix.

---

### Risk 8: The config-check gate can silently be a no-op

**Category**: Environment / Test complexity
**Severity**: HIGH

**Problem**: `deploy.sh:56-58` — `if ! command -v docker &>/dev/null; then echo "⚠️ Docker not found. Skipping config check."`. The validation gate skips itself with a warning if Docker isn't running. Combined with plan task 0 rewriting that same block, there is a live possibility that this ships with **no config validation at all** and nobody notices, because the skip path prints a warning and exits 0.

**Mitigation**: Plan task 0 must make the Docker-missing path **fail loudly** (non-zero) rather than warn-and-continue, or at minimum print something that cannot be mistaken for success. Verify Docker is actually running before relying on any `--check` result during this project.

**Verification**: Run `./deploy.sh --check` with Docker stopped; confirm non-zero exit. Then with Docker running; confirm the check actually executes.

---

### Risk 9: Orphaning the Workday integration may break more than school

**Category**: Backward compatibility
**Severity**: MEDIUM

**Problem**: The plan removes the only known consumer of `binary_sensor.school_day` and lists "consider whether the Workday config entries are still needed" as a vague manual step. Three Workday-derived calendars exist on the instance (`calendar.school_day_calendar`, `calendar.preschool_days_calendar`, `calendar.workday_sensor_calendar`). If John deletes the integration on the strength of that note, anything else depending on those entities breaks — and this repo cannot see `.storage` automations, scripts or scenes that might.

**Mitigation**: Downgrade the manual step from "consider deleting" to "**leave in place**." An orphaned Workday integration costs nothing. Removing it is a separate, independently-verifiable cleanup that should not ride along with this change.

**Verification**: Manual steps say "leave the Workday entries alone" rather than "consider whether needed."

---

### Risk 10: Moving lunch-menu IDs to secrets makes the annual break harder to fix

**Category**: Documentation debt / Environment
**Severity**: MEDIUM

**Problem**: The HealthePro menu ID is per-school-year *and* per-grade-band (`menu 136529 = 26-27 Lunch K-2`) and changes every August. It currently fails soft — the sensor holds its previous value via `if ok else this.state`, so a stale menu ID produces **last year's lunch, silently, forever**. Moving the ID into `secrets.yaml` means the annual fix now requires editing an ungitignored-but-untracked file in two places (local and host) rather than a one-line repo edit, and the comment explaining what the number means is being deleted as part of the scrub.

**Mitigation**: Keep an explanatory comment at the secrets reference site that says *what* the key is and that it changes each August — just without naming the school. Add a note to the plan's manual steps that this is an annual maintenance item. Consider a staleness guard (`menu_date != today` for N days → sensor unavailable) as a follow-up, not now.

**Verification**: A comment exists at the `!secret` reference explaining the annual rotation; the school name does not appear in it.

---

### Risk 11: Entity renames may reach voice assistants and `.storage` artifacts

**Category**: Integration
**Severity**: MEDIUM

**Problem**: `review.md` names this but mitigates it only as "checked during task 20's live verification." The specific unchecked surfaces are Google/Alexa entity exposure and aliases, `scripts.yaml`/`scenes.yaml`, and UI-created automations beyond the one known `automations.yaml` entry. A renamed entity exposed to Alexa fails as an unhelpful voice error, not a log line.

**Mitigation**: Before Phase 4 deletions, have the `homelab` agent grep `.storage/` for every entity ID being deleted or renamed — `core.entity_registry`, `homeassistant.exposed_entities`, `cloud`, `automations`, `scripts`, `scenes`. This is read-only, cheap, and the only way to see these from here. Fold into task 1's baseline capture.

**Verification**: Task 1 output includes a `.storage` reference sweep per deleted entity ID.

---

### Risk 12: `ha core check` cannot see missing calendars, and neither can the worktree

**Category**: Test complexity
**Severity**: MEDIUM

**Problem**: Already named in `review.md`, but compounded by Risk 1: the mitigation was "task 20 requires a live per-entity check," and task 20 is now post-merge. Between merge and that check there is a window where a broken calendar reference is live and undetected.

**Mitigation**: Make the post-deploy check the *first* thing after deploy, not the last thing in a checklist — and specifically enumerate the four calendar entity IDs to query by hand in Developer Tools before trusting any sensor.

**Verification**: Post-deploy checklist opens with the four `calendar.get_events` calls.

---

## Summary

**Total risks identified**: 12
**Categories**: dependency ordering, environment/config, rollback safety, backward compatibility, scope drift, integration, test complexity, documentation debt

**CRITICAL risks (must address before proceeding)**:
1. **Verification cannot happen inside the build** — plan task 20, the shadow run, and all manual steps are post-merge; the PRD must not claim them
2. **~6 human-only steps interleaved with automated ones** — the plan is not autonomously executable; needs an explicit two-track split with the secrets push as a hard gate
3. **Override booleans have no reset** — reintroduces the exact latch bug (birthday countdown) this project exists to eliminate; needs an ungated nightly reset
4. **Rollback does not roll back** — restored automations carry `initial_state: off` and stay silently disabled; needs an ordered recovery sequence plus enabled-state capture in the baseline

**HIGH**: two daily departure announcements (behavior change, unevaluated); shadow-run vs Friday-landing contradiction (and no Wednesday coverage for late start); unguarded `calendar_events_today` aggregation; config check silently skippable.

The four CRITICAL items are all *process* defects rather than design defects — the plan's engineering is sound after the review revisions, but its execution model assumes a repo shape this one doesn't have. Fixing them is restructuring the PRD, not rewriting the plan.
