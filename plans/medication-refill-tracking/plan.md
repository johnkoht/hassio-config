---
title: Medication Refill Tracking
slug: medication-refill-tracking
status: in-progress
created: 2026-10-29
has_pre_mortem: true
has_review: true
has_prd: true
---

# Medication Refill Tracking

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

Linear: JK-1196 (High), JK-1212 (High, HACS evaluation). Revised 2026-10-29 with John's answers (see "John's answers" below).

## Problem

Nothing in the house knows how many pills are left. The reminders (Nino's two doses, Cristina's daily and Friday doses) only know "given today or not", so a refill gets noticed when the bottle is empty. Linear asks for pill-count tracking with a low-stock reminder (JK-1196, High) and points at a HACS integration as one way to get it (JK-1212, High).

## John's answers (2026-10-29)

Asked how we will know how many are left, John said: "maybe there is a UI where I input count on hand and then when it goes less than one week a reminder is set? Notifying us in the morning brief would be useful as well." That settles the design:

- **Doses on hand is a number John types in from the dashboard**, one `input_number` per medication. Nothing is inferred from bottles or fills.
- **Each confirmed dose subtracts one** (unchanged: the taken boolean is the shared confirm signal).
- **Alert threshold is one week of supply**, derived as doses per day x 7, not a count of pills. This resolves the old threshold-unit question.
- **A line in the morning brief** lists any medication that is low.
- The dashboard rows are now v1, not an extra (old E1 and E2 are promoted).

## John's answers (2026-10-30)

Approved with these decisions, which supersede earlier text where they differ.

- **Nino only for v1.** Cristina's two medications are out of v1 scope. John will ask her and follow up; her half is deferred (see "Deferred"), not dropped. Wherever the text below names Cristina's helpers, files, rows or tests, it is deferred with it.
- **Count unit: doses stored, days shown.** A 30-day fill is 60 doses taken twice daily, so **days remaining = doses on hand / 2**. Recommendation, used everywhere: the stock helper stores **doses** (one integer step per confirmed dose, so the decrement is exact and a 60-dose fill reads 60), and every number a person reads or types is **days** (days remaining on the dashboard, in the push and in the brief; refill quantities in days). The conversion is `doses_per_day = 2`, a constant in the template and the refill script ("for now", John), so a schedule change is a one-line edit. Doses beats storing days because days would need a 0.5 decrement.
- **Alerts.** Below one week of supply (`days_remaining < 7`): a time-sensitive push to `devices: "all"` and a line in the morning announcement. Below **3 days**: a **critical** push instead (daily repeat continues, same tag), still with the morning line. The critical threshold is a second shared helper, `input_number.medication_refill_critical_days` (no `initial:`; John sets 3).
- **Refilled push quick actions "+15" and "+30"**, meaning days of supply (they sometimes do not get a full 30 days). They add 30 or 60 doses. A raw number can also be added from the dashboard: `input_number.nino_medication_refill_days` plus a Refill button row calling the same script. Both paths use `script.medication_refilled` with a `days` field.
- **Mapping of John's seven numbered answers.** They arrived without the question text, so the mapping onto the open decisions below is best effort, matched on content where clear: 1 (days is better) is the unit question (old decision 2 and decision 8); 3 (morning announcement, time-sensitive push, critical under 3 days) is decision 9 and the alert design; 4 (+15/+30 and a raw dashboard number) is decision 5 and the refill design; 7 ("30 days of pills = 60 dose, twice daily, for now") is decision 8 (quantity per dose). **Unsure:** answers 2 ("yes"), 5 ("sure") and 6 ("yes") carry no content, so they were applied as agreement with the plan's default on decisions 1, 6 and 10 respectively. If those answered different questions, John should say so.

## Goal

Nino's medication has a "doses on hand" number that John sets from the dashboard and that drops by one each time a dose is marked given, a derived days-remaining figure, a time-sensitive push when supply falls below one week and a critical push below 3 days (both re-sent each morning until refilled), a line in the morning brief, and a one-tap refill action (+15 or +30 days). Refer to it generically: "Nino's medication". (Written for three medications originally; v1 builds Nino's only.) Nothing else in v1.

## Findings (what exists today)

**Nino.** Two doses, each with `input_boolean.nino_medication_{1,2}_taken` (reset to off at 03:00:01 by `nino_medication_reminder_reset`). Every path that marks a dose given ends at one of two places: `script.nino_medication_taken` (push "Taken" action, ZHA button, Alexa routine) turns the boolean on, or someone flips the boolean directly from the dashboard row. The reminder itself waits on the boolean flipping, so the boolean is the one signal all paths share. Package: `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`.

**Cristina (deferred, not in v1; kept for the follow-up).** Two independent medications, each with its own boolean and snooze timer: `input_boolean.cristina_daily_medication_taken` and `input_boolean.cristina_friday_medication_taken` (Friday is weekly). The push "Taken" action turns the boolean on from inside the reminder automation; the dashboard row flips it directly. Both reset at 03:00:01. Both Cristina reminder automations carry `initial_state: false`; per the repo's own gotcha that does not mean "disabled", but confirm live that they are on. It does not affect this plan, because the trigger below is the boolean, not the reminder.

**Skip a day.** There is no skip concept and none is needed for counting: a dose that is not given leaves its boolean off, the 03:00 reset clears it, and no pill is deducted. The existing not-given path is the skip.

**Linear's other reading of "skip a day".** If John means "stop nagging me today because the dose is intentionally skipped", that is a different feature (silence the reminder and escalation) and is itemised under Extras, not built.

## Approach

### Option A (recommended): native helpers

Per medication (v1: Nino's only): one `input_number` stock (in doses) and one derived days-remaining template sensor, plus shared thresholds and shared refill logic. Decrement is a state trigger on the existing taken boolean going `off` to `on`. Nothing in the existing reminder, escalation, or reset flows is edited, so there is no risk to the reminders themselves.

- **Maintenance:** our YAML, in git, in the repo's existing style, covered by tests.
- **Where it hooks in:** the taken boolean, which every give path already shares (see Findings). Dashboard toggles, the push action, the ZHA button and Alexa all count, with no per-path wiring.
- **Several people:** v1 is one medication (Nino's); Cristina's two would be two more small copies of the same file shape later; no config wizard.
- **Schedule shape:** days remaining is `stock / doses-per-day`, with a per-medication constant (Nino 2/day, per John). The weekly Cristina dose would need fractional handling and is deferred with her.
- **HA compatibility:** only core helpers and templates; nothing to break on the 2026.7.4 live core or the queued 2026.10 upgrade.

### Option B: vemaley/medication_tracker (HACS)

From its README (fetched 2026-10-29; I could not verify the minimum HA version or last-commit date, and its Releases section is empty): UI-only config via a setup wizard; per medication it creates `number.<name>_stock`, `sensor.<name>_days_remaining` and a low-stock binary sensor; services `take_dose` and `add_stock`; a `low_stock_alert` blueprint; threshold in days (default 7); 27 commits, 3 open issues, 1 open PR; supports automatic as well as manual deduction.

Why it loses here:

- **It still needs our wiring.** We would call `medication_tracker.take_dose` from the same boolean-trigger automation, so B saves only the stock and days entities and the alert, which are the small parts. We would also have to keep automatic deduction off, or it would deduct on schedule whether or not the dose was given.
- **Schedule model.** Days remaining is built from doses per day; a once-a-week medication needs fractional handling the README does not describe.
- **No skip or refill semantics beyond `add_stock`**, which is the same thing our script does.
- **Config lives in `.storage`, not git.** Same problem as Adaptive Lighting in this repo: UI config entries are not reproducible from the repo and not covered by tests.
- **Install needs a HA restart**, and only John restarts HA. An unreleased, thinly maintained custom integration is also the first thing to break on an upgrade, and the 2026.10 upgrade is already queued behind other blockers.
- **Reversal cost.** Choosing A and later adopting B is cheap (point the trigger at `take_dose`); the reverse means removing an integration and its registry entries.

Recommendation: Option A. JK-1212 is then answered as "evaluated, not adopted, reasons above"; close it with a comment linking this plan.

### Design (Option A)

- **Stock ("doses on hand"):** `input_number.<med>_stock`, unit "doses" (two per day for Nino, so a 30-day fill is 60), min 0, max 365, step 1, mode box, **no `initial:`** (it would reset the count on every restart and revert dashboard edits). John seeds the current counts from the dashboard rows after deploy; an unseeded helper reads 0, which the alert would read as out of stock (see Risks).
- **Decrement:** one automation per taken boolean (v1: two files, `nino_medication_1_taken` and `_2_taken`; the original four included Cristina's; one job each, ids match filenames), `trigger: state`, `from: "off"`, `to: "on"`, action `input_number.set_value` to `max(0, stock - 1)`. Placed beside each person's existing medication package, not inside the reminder files. `from: "off"` means the 03:00 reset (`to: off`) and a restart restore do not count.
- **Days remaining:** `sensor.<med>_days_remaining`, template sensor, state `stock / doses_per_day` (Nino: doses / 2) rounded down, `unavailable` when the stock is unavailable (never 0, so a bad read cannot fire a false alert). Doses-per-day is a constant in the template, not a helper.
- **Thresholds:** one week of supply, derived, plus a critical tier. The days-remaining sensor already divides by doses per day, so "below one week" is `days_remaining < 7`, which equals stock below 14 doses for Nino. Kept as a shared `input_number.medication_refill_threshold_days`, no `initial:`, John sets it to 7 once. The critical tier is `input_number.medication_refill_critical_days` (John sets 3, i.e. under 6 doses). The weekly-medication lead time (old decision 3) goes away with Cristina.
- **Alert:** one automation, `medication_refill_low_stock_alert`. Triggers: `numeric_state` on the days-remaining sensor `below` the threshold and again `below` the critical threshold (each fires once on crossing, not on restart), plus a daily time trigger (09:00) for the repeat. The daily repeat is the recommended answer to "re-fire daily or snooze-able": it needs no state, and a snooze (extra E8) only adds a timer per medication for little gain once the morning brief also mentions it. Action: for each sensor currently below the threshold (just the triggering one on a crossing, all low ones on the daily repeat), `script.general_notification` with `devices: "all"`, `priority: "time-sensitive"` (**`"critical"` when days remaining is under the critical threshold**), a per-medication `tag` (so a repeat replaces the old push, and the critical one replaces the time-sensitive one), and two Refilled actions, `MEDICATION_REFILLED_<med>_15` ("+15") and `MEDICATION_REFILLED_<med>_30` ("+30"), meaning days. Critical bypasses the `notification_level` filter only once `emergency-mode` PR 2 (P6) lands; until then a critical push can be dropped when the level is None, so the build checks that. It uses the shared notification helper, so it respects `notification_level` (this is a reminder, not a safety backstop like the escalation). Message text is generic ("Nino's medication is running low: about N days left"). The time trigger has no `trigger.entity_id` (the lesson from the door re-alert bug), so the message is built from the loop item, never from `trigger`.
- **Refill:** `script.medication_refilled` with fields `medication` and `days`; adds `days x doses_per_day` doses to stock (capped at the helper max). A separate small automation, `medication_refill_push_action`, listens for `mobile_app_notification_action` with the fixed `MEDICATION_REFILLED_<med>_15` and `_30` ids and calls the script with 15 or 30 days. The dashboard Refill button calls the same script with that medication's `input_number.<med>_refill_days` (any raw number of days). It is a standalone event automation, not a `wait_for_trigger`, because the push is answered days later and a wait would not survive a restart (the two-dose plan's lesson).
- **Drift correction:** John edits the stock `input_number` directly from the dashboard row. No separate "adjust" feature.
- **Morning brief line:** `script.morning_update_announcement` in `packages/reminders/morning_update.yaml` builds a ChatGPT prompt with `### SECTION` blocks (weather, school, train, birthdays). Add a `### MEDICATION REFILLS` block that loops the days-remaining sensors (v1: Nino's) and, for each one below the threshold, emits a generic line ("Nino's medication is running low, about N days left"). Like the train block, it says "Only mention this if a line appears below; otherwise say nothing", so a normal morning is unchanged. The brief is spoken aloud on the house speakers; John confirmed it is spoken (open decision 9).
- **Where it shows (v1):** dashboard rows, the push, and the morning brief.
  - **Nino:** a new "Medication Supply" block in the Nino popup, `dashboards/templates/button_cards/people/nino.yaml` (hash `#nino`), directly under the "Medication Reminder Time" section (~line 118). Doses-on-hand is an editable `input_number` row (`entity_no_icon.yaml` style like the dose time rows); days remaining is a read-only `template-entity-row` (`kohbo_entity_item_layout.yaml`); a raw refill-days number row and a Refill button row call `script.medication_refilled`.
  - **Cristina:** deferred (John will ask her). The Medications `entities` card in `dashboards/templates/button_cards/people/cristina.yaml` is untouched in v1.
  - The Nino rows live in the Kohbo people popup, so no new view. Touch `dashboards/kohbo/kohbo.yaml` on deploy and add the rows to `dashboards/SITEMAP.md`.

## Tasks

1. Stock helpers and days-remaining sensors — Nino's `input_number` stock (doses) and refill-days helper, the shared 7-day and 3-day thresholds, one days-remaining template sensor, in new files beside the medication package (unique filenames: `!include_dir_named` keys by basename).
2. Decrement automations — two files (Nino's two doses), one per existing taken boolean, `from: off to: on`, floor at 0.
3. Low-stock alert — one automation, crossing triggers (7 days time-sensitive, 3 days critical) plus the daily repeat, via `script.general_notification`.
4. Refill script and push-action automation — `script.medication_refilled` (days in, doses out) and `medication_refill_push_action` (+15 and +30).
5. Dashboard rows and morning brief — doses-on-hand, days-remaining, refill-days and Refill rows in the Nino popup; the `### MEDICATION REFILLS` block in `morning_update.yaml`.
6. Tests — `tests/test_medication_refill.py` (below).
7. Docs — add a short "Medication stock" section to `docs/PEOPLE.md` (it has no medication section today) listing entities and the decrement/refill flow; one line in `docs/AUTOMATIONS.md`; header comments per `packages/CLAUDE.md` (title plus 1-3 lines, reasoning in the commit). Memory entry at wrap.
8. Handoff for John (post-deploy, not done by an agent) — seed Nino's doses-on-hand count from the dashboard, set the thresholds (7 and 3 days), reload automations, scripts, and template entities (`--reload` does not reload template entities; new `input_number` helpers need a restart, which only John does). Close JK-1212 with the rationale; close JK-1196 after the live check.

## Tests

Style of `tests/test_door_left_open_realert.py`: load the package YAML, render the real templates with Jinja, assert on structure. Local gates are yamllint and these tests; CI `ha-check` and the deploy's `ha core check` are authoritative (`tests/run.sh` hardcodes `/root/config` and passes vacuously on the Mac).

- Each of the decrement automations (Nino's two) triggers on the correct taken boolean with `from: "off"` and `to: "on"`, and none triggers on `to: "off"`.
- Each decrement targets its own stock entity and floors at 0 (stock 0 stays 0; stock 14 gives 13).
- Days-remaining template, rendered: Nino 14 doses gives 7 days; 60 doses gives 30; 13 doses gives 6 (rounded down); stock `unavailable` gives `unavailable`, never 0.
- Alert message renders for both a `numeric_state` trigger and a bare time trigger (the door re-alert regression), and never references `trigger.from_state` or `trigger.entity_id` on the time path.
- Alert priority: days remaining under 7 sends time-sensitive, under 3 sends critical, 7 or more sends nothing; the repeat list is built per medication so Cristina's can be added later without changes.
- Refill: the script converts days to doses (x2) and caps at max; the action automation only matches `MEDICATION_REFILLED_<med>_15` and `_30` ids, mapping them to 15 and 30 days (30 and 60 doses); the dashboard path passes the raw refill-days helper.
- Morning brief block: with Nino's medication below the threshold the rendered prompt names exactly that one; with none low it renders the "say nothing" instruction and no medication line; an `unavailable` days sensor is never named.
- Existing suites still pass: entity references, duplicates (basename collisions), modern syntax, naming.
- Sabotage check at review: drop `from: "off"` and confirm the 03:00 reset test goes red.

## Open decisions

All resolved. Where John's seven numbered answers could not be matched to a question with certainty, the mapping is stated.

1. **Native helpers or the HACS integration.** **Resolved (John, 2026-10-30):** native (Option A). Mapped to John's answer 2 ("yes"); mapping uncertain, and it matches the plan's default.
2. ~~Threshold unit.~~ **Resolved (John, 2026-10-29, restated 2026-10-30):** one week of supply, in days; the stored count is doses and days remaining = doses / 2 (see John's answers, 2026-10-30).
3. **Weekly medication lead time.** **Resolved (John, 2026-10-30):** moot. Cristina is out of v1, and the weekly medication goes with her. Revisit in the follow-up.
4. ~~Daily repeat.~~ **Resolved:** daily at 09:00 while still low, no snooze in v1 (John, 2026-10-29, by default).
5. **Refill adds or resets.** **Resolved (John, 2026-10-30):** add. The push has "+15" and "+30" quick actions (days of supply, since they sometimes do not get a full 30 days), and a raw number of days can be added from the dashboard. Mapped to John's answer 4.
6. **Un-toggling a taken boolean.** **Resolved (John, 2026-10-30), by default:** no re-increment; fix a mistaken flip by editing stock. Mapped to John's answer 5 ("sure"); mapping uncertain, and it matches the plan's default.
7. **Who gets the push.** **Resolved (John, 2026-10-30), by default:** `devices: "all"`, same as Nino's reminder. John's answer 3 specifies the priority (time-sensitive, critical under 3 days) but not the recipients.
8. **Quantity per dose.** **Resolved (John, 2026-10-30):** two doses a day, and a 30-day fill is 60 doses. Doses-per-day is a constant of 2 "for now", so the E4 per-dose helper is not needed. Mapped to John's answer 7.
9. **Spoken in the morning brief?** **Resolved (John, 2026-10-30):** yes, include it in the morning announcement (generic "running low" line, no names of medications or doses) and send a time-sensitive push; a critical push when under 3 days remain. Mapped to John's answer 3.
10. **Seed values.** **Resolved (John, 2026-10-30), by default:** until John seeds the count, the days sensor reads `unavailable` and the alert stays silent; no alert on first deploy. Mapped to John's answer 6 ("yes"); mapping uncertain.

## Deferred

- **Cristina's two medications** (daily and Friday). John will ask her and follow up. When she agrees: two more stock helpers and days sensors, two more decrement files, dashboard rows in her popup, tests, and the weekly-lead-time question (old decision 3).

## Extras (itemised, not in v1)

All of this is beyond the ask. Each is cheap alone; none is needed for the count, the alert, or the refill to work.

- **E1, E2** Dashboard stock rows and the Refill button: promoted into v1 (John wants to enter counts from the UI). See Approach.
- **E3 Deliberate "skip today" button.** Silences that day's reminder and escalation without deducting. It adds a gate to each reminder flow, so it is the highest-risk item here; those flows were already hard to get right (see the two-dose plan).
- **E4 Pills-per-dose helper.** One `input_number` per medication feeding both the decrement and the days sensor. +3 helpers; only needed if a dose is not one pill.
- **E5 Re-increment on manual un-toggle.** Needs a guard so the 03:00 reset does not count as an un-toggle. +1 condition per boolean; fragile around the reset.
- **E6 Alexa refill phrase.** Nabu Casa scene exposure plus an Alexa Routine that John builds himself (same pattern as the "took his meds" routine). Almost no repo lines, but it needs a fixed default quantity.
- **E8 Snooze on the refill push.** A "Remind me in 3 days" action backed by a per-medication timer. Not needed while the alert repeats daily and the brief mentions it.
- **E7 Out-of-stock critical escalation.** Mostly promoted into v1: the critical push under 3 days (John, 2026-10-30) covers the window. A separate alert at exactly 0 stays out.

## Risks

- **Count drift.** A double toggle, a forgotten toggle, or a dose from a different bottle leaves the count wrong. Mitigation: stock is directly editable; the alert is a nudge, not a hard dependency. Accepted.
- **Unseeded counts.** A fresh `input_number` without `initial:` reads its minimum, 0, which looks like "out of stock". Mitigation: John seeds the counts before the alert automation is reloaded (handoff step 8); whether the days sensor can also detect a never-set helper is unknown and is a build-time question, to be tested.
- **Alert on bad data.** A restart or a read returning 0 or `unavailable` could look like out of stock. Mitigation: the days sensor is `unavailable` rather than 0 when stock is unavailable, `numeric_state` ignores non-numeric states, and it is tested.
- **Helpers not loaded.** New `input_number` helpers need a restart (John-only) and template sensors a template reload; a deploy that only reloads automations leaves triggers pointing at nothing. Mitigation: handoff step 7 and the entity-reference test.
- **Entity-id slugs.** Template sensor ids derive from `name:`, not `unique_id`; check the planned ids against the live registry before build (a stale `_2` suffix from an orphan registry entry is the known failure).
- **Schedule constant.** Days remaining uses a fixed two doses a day for Nino ("for now", John); if the schedule changes the constant needs updating. Cristina's weekly medication is deferred with her.
- **HACS reasoning rests on the README alone.** Minimum HA version and maintenance activity were not verifiable; the decision does not hinge on them (it hinges on needing our own wiring either way).
- **Privacy.** No medication names, doses, or schedules beyond what the repo already carries appear here or should appear in helper names or push text; use the existing generic naming.

On approval → /approve → /ship medication-refill-tracking
