# Review: School Automation Overhaul

**Type**: Plan
**Review Path**: Full
**Complexity**: Large (17 tasks, ~30 new entities, entity renames, destructive secrets step, live school week)
**Recommended Track**: `full` — /ship with multi-phase
**Reviewers**: two independent adversarial passes (HA technical correctness; plan structure and scope), plus direct verification of the two headline claims

No `LEARNINGS.md` or `PROFILE.md` exist in this repo, so no profile injection was available. That gap is itself worth closing at `/wrap` (scoped to `packages/school/`).

---

## Blocking defects

### 1. The `initial:` premise is inverted — this invalidates the plan's central design reversal

The Approach asserts that `initial:` values "apply only on first creation." **That is backwards.** In HA 2026.7.4, `input_datetime`, `input_number` and `input_boolean` all short-circuit state restoration when `initial:` is set:

- `input_datetime.async_added_to_hass` — `# Priority 1: Initial value` then `if self.state is not None: return`, skipping restore entirely
- `input_boolean.async_added_to_hass` — `# Don't restore if we got an initial value.` / `if self._config.get(CONF_INITIAL) is not None: return`
- `input_number` — same shape

**Setting `initial:` means every dashboard edit to the bell schedule is silently reverted on the next HA restart.** Reloads are safe (`async_update_config` doesn't touch the value); restarts are not.

This matters more than an ordinary bug because the plan reversed a prior architectural decision *on this premise* — "a deliberate reversal of the earlier 'hardcode the bell schedule' call." The reversal has to be re-decided, not patched. And the Risks bullet describes the cost as "a restore from git comes up with defaults," when the real cost is that *the running system* comes up with stale defaults months later, unprompted. The stated mitigation — "keep accurate `initial:` values" — is the thing that causes the bug.

**Fix, which makes the design strictly better:** omit `initial:` entirely. Real times go in a header comment only; values get set once via `input_datetime.set_datetime`. Restoration then works, dashboard edits persist, and a from-scratch rebuild comes up *empty* rather than plausibly-wrong — the derived timestamp sensors go `unknown`, the time triggers never fire, and you get a loud absence instead of a quiet misfire.

Latent in the repo already: `packages/people/nino/medication_reminder/nino_medication_reminder.yaml:58,64` has the same bug on user-editable dose times.

### 2. Multi-day closures would read "not closed" on every day but the first

The plan fetches a today+tomorrow window per calendar and partitions with `event.start[:10] == today`. Multi-day all-day events are returned as a single event carrying the *original* start date, not clipped to the window and not expanded per day.

**Verified empirically against the live feeds:**

| Feed | All-day events | Multi-day |
|---|---|---|
| District 34 | 45 | **0** |
| Lyon | — | 0 |
| OLPH feed 3 | 119 | **9** |

D34 and Lyon serialize every break as separate per-day events, so they're unaffected — but OLPH does not. Concretely broken: `NO SCHOOL - Thanksgiving` (2026-11-25 → 11-28), `Easter Vacation` (2027-03-25 → 04-05, 11 days), `Parent Teacher Conferences` (2 days, twice), `NO BUS SERVICE` (3 days, twice).

Gianluca's school would read *open* for all of Thanksgiving break except the first day.

This is a **regression** — the existing code queries a one-day window and never partitions, so it gets multi-day events right today. The "one call, partition in Jinja" optimization introduces it.

**Fix:** test overlap, not equality. All-day is end-exclusive: `event.start[:10] <= day and day < event.end[:10]`. Timed: `event.start[:10] <= day <= event.end[:10]`. Detect all-day with `event.start | length == 10`.

### 3. The delete list is materially incomplete, and one omission is a guaranteed unique_id collision

Verified by direct check — these exist and appear **nowhere** in the plan:

| File | Consequence of not deleting |
|---|---|
| `primary_school_closed_tomorrow.yaml` | **`unique_id: primary_school_closed_tomorrow` collides with task 7's sensor.** HA drops one or suffixes the new one `_2`, silently breaking every downstream reference in tasks 8 and 14 |
| `primary_school_closed.yaml` | Same collision risk on `primary_school_closed` |
| `nino_school_departure_reminder.yaml` | The Problem statement says "three of Nino's automations trigger off phantom calendars"; task 5 deletes two. This is the third |
| `district_school_year_{activate,deactivate,active_boolean}.yaml` | Task 6 says it "replaces the activate/deactivate pair" but nothing deletes them. `activate` calls `automation.turn_on` on deleted automations and triggers on `automation_reloaded` — **so it errors on every reload, which is the deploy path** |
| `school_departure_reminder.yaml`, `nino_school_pickup_reminder.yaml`, `gianluca_school_pickup_reminder.yaml` | Tasks 11–13 say "rewrite"/"rebuild" but never "delete the old file" — four unhandled renames, four orphans |

### 4. Task ordering has a hard failure: deleting before task 15 kills the morning briefing

`morning_update.yaml` reads `input_boolean.primary_school_day` (`:116`) and `binary_sensor.gianluca_is_today_school_day` (`:150`) via the `states.<domain>.<object>.state` form. On a missing entity that raises `UndefinedError` — the entire `conversation.process` prompt fails to render and the briefing produces **nothing**. It does not degrade gracefully.

The plan states "tasks 1–5 are independently shippable." They are not. Shipping 1–5 alone silently kills the morning update for the remaining duration of the project — every morning.

**Fix:** split task 5 into `5a` (zero remaining consumers — safe to land first) and `5b` (everything whose consumer is rewritten later), and move `5b` after task 15. Convert those three reads to `is_state()` while re-pointing so a future rename degrades instead of exploding.

### 5. Secrets are pushed last; a missing `!secret` key is a hard config-load failure

Task 1(b) pulls secrets down, tasks 3–4 add four keys locally, task 17 pushes back. But `deploy.sh` makes the Yellow `git pull` from GitHub. The moment a commit referencing `!secret primary_school_calendar` lands without the key present on the host, config load **aborts entirely** — the house is down, not degraded.

**Fix:** push `secrets.yaml` to the Yellow *before* the first commit that references a new key.

---

## Technical corrections (accepted, non-blocking)

| # | Finding | Fix |
|---|---|---|
| 6 | `hours: 1` in a `time_pattern` means **once daily at 01:00**, not hourly. Four existing files have this bug (`primary_school_closed.yaml:10`, `primary_school_closed_tomorrow.yaml:10`, `district_late_start_tomorrow.yaml:10`, `gianluca_is_today_school_day.yaml:4`) — those sensors update once a day. The plan says "hourly" | Write `hours: /1` |
| 7 | `homeassistant start` does **not** fire on reload, so newly-created trigger-based template sensors sit `unknown` until the next tick. Task 17's verification would look like a failure for up to an hour — and any timestamp trigger whose time passes in that window silently never fires (`trigger_dt > utcnow()` is strict: no listener, no log) | Add `- trigger: event / event_type: event_template_reloaded` to every trigger-based block |
| 8 | Zero-entity resolution on a response-returning service **raises**, aborting the whole action sequence. Four `get_events` calls in one block = one bad calendar reference kills every closure sensor. Live risk given `calendar.olph_school` is about to be re-subscribed and may come back `_2`-suffixed | `continue_on_error: true` per call, `\| default({})` on each response var, prefer one template block per calendar |
| 9 | A naive datetime doesn't just fail the trigger — `SensorEntity.state` raises `ValueError` under `device_class: timestamp` and the entity errors out | Build with `today_at('00:00') + timedelta(seconds=state_attr(...,'timestamp'))`, never `as_datetime` on a concatenated string. Gate with `availability:` rather than an empty state |
| 10 | Grade-scope guard misses non-numeric scopes — `Kindergarten - No School`, `Grades K-2`, `Preschool`, `EC` would all falsely close Gianluca's school. Given he's in an Early Childhood section, these are the *likeliest* next variants | Widen to word-scopes; make an unrecognized scoped closure fail **open** into Tier 2 (visible) rather than silently closing |
| 11 | `state:` has a 255-char limit; a joined event list will be rejected | Follow existing convention — `state: "{{ now().isoformat() }}"`, payload in attributes |
| 12 | No dedup: `District Closed \| No School` appears on both district and Lyon feeds, so the evening announcement says it twice | Dedup on `(summary, start)` |
| 13 | Athletics regex runs *first*, so it can eat a Tier 1 event containing `- Game`/`- Practice` | Test Tier 1 first, then drop athletics from the remainder |
| 14 | `reload_all` runs all domain reloads **concurrently** — `template` may reload before `input_datetime` creates the helpers, and trigger-based templates don't self-heal | Run twice, or reload `input_datetime`/`input_number` first and `template` second |
| 15 | `!secret` in a template `action:` block **works** — the loader resolves it at load time everywhere, including under `!include_dir_named` | Drop that mitigation; reallocate the budget to verifying each `get_events` target resolves |
| 16 | `pickup_nino()` is *called* at `templates/speech/briefing.yaml:57`, so task 5's "unused macro" rationale is wrong. Verified: `templates/` is not referenced in `configuration.yaml` at all | Delete the whole file, not the macro. Half a cleanup is worse than none |
| 17 | `morning_update.yaml:248` targets `calendar.ninos_school` — the phantom calendar. Likely already breaking `sensor.calendar_events_today`, which feeds the birthdays *and* calendar blocks | One-line fix, in a file task 15 already edits |
| 18 | Risks references "task 14" for morning_update (it's 15) and "task 15" for the dashboard (it's 16) — the section is stale against the current numbering, which means the cut-line sentence is also unverified | Re-derive after reordering |

---

## Scope and process findings

**19. The high-school stub fails the plan's own acceptance criterion.** Task 17 requires "every new sensor resolves to a real value rather than `unknown`." The high-school band ships with blank values and ~9 permanently-`unknown` entities. It also belongs to **D225** — different district, different calendar, different closure feed — so the D34 grade-band abstraction doesn't actually hold for the one band it was extended to cover.

**20. Verification is one sentence, against a stricter house precedent.** `plans/nino-two-dose-medication/plan.md` task 12 is a 22-row acceptance table for roughly half this size, plus "Exit code 0 is not evidence." This plan creates ~30 entities across three new layers with a single verification task at the very end.

**21. Rollback is entirely absent, and three state changes `git revert` cannot reach:** `secrets.yaml` is gitignored; the `.storage` helper deletions are irreversible *and their current values are unrecorded* (delete `school_day_departure_reminder` and today's departure time is simply gone); orphaned entity-registry rows cause `_2` suffixing on re-creation.

**22. No live baseline.** The plan never establishes what fires *today*. `school_departure_reminder` has `initial_state: off`, but `district_school_year_activate` turns it on at HA start and on `automation_reloaded` — so it may or may not be running, depending on `.storage` this repo can't see. There's a memory entry about exactly this trap ("zero saved traces is the tell"). Pull 7 days of traces before deleting anything: it gives a baseline, the `.storage` values for rollback, and possibly the finding that nothing fires today — which would de-risk the whole cutover.

**23. Snow days are handled only by an *optional* item.** `input_boolean.school_day_override_off` is the **only manual control in the entire system** — "derive, don't latch" removes every override by construction. Illinois closures arrive by robocall and text, never on the Google calendar. The plan's current answer to "it's snowing" is "edit a calendar."

**24. Mid-year ship.** School started 2026-08-20. Every build day is a live school day, with no freeze window and no landing-day guidance.

**25. `dashboard-kohbo` is YAML mode**, so the Problem statement's claim that the school view "lives only in storage mode" cannot be true *for that URL* — HA can't serve a storage view inside a YAML dashboard. The screenshot is from the separate default storage dashboard. More importantly: host divergence is the likelier explanation for any mismatch, and given this repo's history of the Yellow's git diverging, **task 16 could clobber whatever is live**. Verify before writing.

**26. Task 16 is not cuttable.** The Approach makes the dashboard the *sole* editing surface for every schedule input, and YAML-declared `input_datetime` entities are `editable: false` — they don't appear as editable helpers in Settings. Cut task 16 and the only way to change a school start time is Developer Tools → Actions. Combined with defect 1, "ship 1–15" gives values that live in `.storage`, get wiped on restart, and have no UI. The *scope* of task 16 is cuttable (ship Today + JK pickers, defer Calendar and Lunch); task 16 itself is not.

**27. Unrequested scope, itemized:**
- **Task 1(a) `deploy.sh`** — real footgun, real fix, but it modifies the repo's only validation gate *in flight*, immediately before a 17-task change that needs that gate working. ~10 min. Ship it as its own commit, first, and resolve the `secrets.fake.yaml` question there.
- **Tier 2 informational** — Tier 3 is fully justified (73% noise removal). Tier 2 exists to add one sentence to a ChatGPT prompt: ~30 lines plus a permanent tuning surface for "the briefing mentions book fair."
- **`school_notable_event_tomorrow_reminder`** — an evening TTS that tomorrow is picture day. Not requested; the push covers it. ~25 lines.
- **Task 3 secrets** — be honest that this is obfuscation, not security. The secret's value is an HA entity_id, visible in the UI, logs, traces and the dashboard YAML this plan also writes. The *actual* leak (Gianluca's Google calendar ID) is closed by task 2 alone.

---

## Strengths

- The calendar-vocabulary work is real research against real data — 62 + 77 + 710 live events, not assumptions. The 73% athletics filter and the grade-scoped-closure discovery are both findings no amount of reasoning would have produced.
- "Derive, don't latch" is the correct thesis, and it's grounded in a specific prior failure in this repo rather than general principle.
- The phantom-calendar root cause (`google_calendars.yaml` being dead legacy config) explains a whole class of existing breakage and would not have been found without checking the live instance.
- `### Optional — priced separately, cut freely` is a genuinely good invention — better than the other plans in this repo — and directly reflects prior feedback about bundling polish with protection.

---

## Devil's Advocate

**If this fails, it will be because** the schedule inputs silently reverted to their `initial:` values on a routine HA restart in November, and nobody noticed until a kid was late — the exact class of quiet-wrong failure this project exists to eliminate, reintroduced by the mechanism chosen to prevent it.

**The worst outcome would be** pushing a commit that references a `!secret` key not yet present on the Yellow. That isn't a school automation breaking; it's HA refusing to load config at all — no lights, no locks, no alarm, no climate — at whatever hour the deploy ran.

---

## Verdict

**Revise**, then `/pre-mortem` before `/approve`.

The analysis underneath this plan is strong and the thesis is correct. But it reverses an architectural decision on an inverted fact, its delete list guarantees a unique_id collision, its task ordering breaks the morning briefing for the project's duration, and it has no rollback for three pieces of state `git revert` cannot reach. Defects 1–5 are must-fix. At this size (`has_pre_mortem: false` on a 17-task, ~30-entity, live-school-week change) a pre-mortem is required by the house rubric, not optional.

---

## Decisions for John

These are judgment calls the reviewers split on or that contradict an earlier instruction — they need a call rather than a fix:

1. **Bell schedule: inputs or YAML constants?** Defect 1 removes the premise for the reversal. Omitting `initial:` makes inputs work correctly and preserves the agent-updates-without-a-deploy goal, so the recommendation is to keep inputs — but the decision was made on bad information and deserves a second look.
2. **Which grade bands ship?** Reviewer says cut `middle` and `high`; John said "might as well while we're here." Recommendation: keep `primary`, `intermediate`, `middle` (all D34, all known, all cheap), **cut `high`** — different district, unknown hours, and it's what breaks the acceptance criterion.
3. **Tier 2 informational — keep or collapse to two tiers?** Recommendation: keep, but cap the list at 5 before it reaches the ChatGPT prompt.
4. **Split `deploy.sh` (task 1a) into its own commit shipped first?** Recommendation: yes.
