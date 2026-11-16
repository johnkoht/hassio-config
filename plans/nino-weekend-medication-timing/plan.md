---
title: Nino Weekend Medication Timing
slug: nino-weekend-medication-timing
status: in-progress
created: 2026-10-29
has_pre_mortem: false
has_review: false
has_prd: false
---

# Nino Weekend Medication Timing

Linear: JK-1168 (High), "Nino medication updates". Approved by John 2026-11-15, with one amendment: a "skip a dose" action (Task 10, section "Amendment: skip a dose"). JK-1257 (critical push quick action and deep link) ships separately, first, as PR #178; this branch builds on it.

## Problem

On weekends and other no-school days the dose 1 reminder still fires at the weekday time (<time>) and snoozes for 15 minutes. John wants dose 1 held until <time> or later and a 30 minute snooze on those days. He also floated checking for an upcoming event.

Dose 1 time is read in three places, not one, so moving only the trigger would leave the others early: the `time` trigger and the pending-dose sensor in `nino_medication_reminder.yaml`, and the "more than 2 hours late" check in `nino_medication_escalation.yaml`. Left alone, the escalation would send a critical push at <time> on a Saturday for a dose that was never due before <time>. The 15 minute snooze is hardcoded in three more places: the `timer` duration, the `wait_for_trigger` timeout, and the "Snooze 15 Minutes" push action title.

## Goal

On a no-school day, dose 1 is not prompted before a configurable time (default <time>), escalation is measured from that later time, and snoozes last 30 minutes. School days behave exactly as today. Dose 2 is untouched.

## Approach

**"No school" is `binary_sensor.nino_school_day` reading `off`.** That sensor already folds in weekends (`weekday() < 5`), calendar closures and breaks, summer (`school_year_active`), and the house-wide `school_day_override_off` holiday toggle (see `primary_school_schedule.yaml`). No new school signal. The test is a positive `is_state(..., 'off')`, not `not is_state(..., 'on')`: if the sensor is unavailable on a school morning, we keep the weekday time. That is the safe direction for a medication cue (same reasoning as the `at_school` gate in `packages/school/LEARNINGS.md`).

**One derived "dose 1 effective time" sensor, read everywhere dose 1's time is read.** A new timestamp template sensor `sensor.nino_medication_1_effective_time` is today's `nino_medication_1_time`, raised to the no-school floor when the day is a no-school day and the floor is later. The three consumers switch from the raw `input_datetime` to it:

- the dose 1 `time` trigger (`at: sensor.nino_medication_1_effective_time`; timestamp sensors are valid `at:` targets, precedent in the school reminders);
- `sensor.nino_medication_pending_dose` (its "due" test and its dose ordering);
- the dose 1 branch of the escalation (effective time + 2 hours).

Rejected: a second `time` trigger at the floor plus a gate condition (needs a no-school guard on only one trigger, and still leaves pending and escalation early); an automation that rewrites `nino_medication_1_time` each morning (clobbers dashboard edits, races reloads); a floor condition alone (the <time> run is dropped and nothing re-fires at <time>).

**Wake-up behaviour falls out for free.** The "Nino woke up" trigger resolves its dose from the pending-dose sensor. Once that sensor reads the effective time, waking at <time> on a Saturday resolves to `none` and nothing fires. At <time> the time trigger fires and prompts if he is awake. If he is still asleep at <time> the run is dropped by the existing awake condition, and the wake-up trigger prompts 5 minutes after he gets up, as today. Waking before <time> therefore waits until <time>; it does not prompt early.

**One `snooze_minutes` variable** (30 when `nino_school_day` is `off`, else 15) in the reminder's automation-level `variables:`, used for the initial re-prompt timer start, the snooze-button timer restart, the `wait_for_trigger` timeout, and the push action title. The timeout must follow the timer: if the timer is 30 minutes but the wait still times out at 15, a Snooze tap between minute 15 and 30 hits no listener. Durations are passed as `"00:{{ snooze_minutes }}:00"` to `timer.start`. The helper's own `duration: "00:15:00"` stays as the school-day default.

**Dose 2 does not shift.** It is <time>, well after any sensible floor, so it keeps `nino_medication_2_time`, its escalation, and its (now weekend-aware) snooze length. Only if someone sets the floor at or after dose 2's time does ordering matter; the pending sensor's existing latest-time tie-break already handles that, so no clamp is added.

## Tasks

1. **Floor helper** — Add `input_datetime.nino_medication_no_school_earliest` (time only) to `nino_medication_reminder.yaml`. No `initial:` (it would re-apply on every restart and revert dashboard edits; `packages/school/LEARNINGS.md`). The effective-time template falls back to <time> when the helper is unset (`timestamp | int(0) > 0` test, since an unset time helper is not null). John can set it from the dashboard.

2. **Effective-time sensor** — Add `sensor.nino_medication_1_effective_time` (`device_class: timestamp`, timezone-aware via `today_at()`). Value: `max(today_at(dose 1 time), today_at(floor))` when `binary_sensor.nino_school_day` is `off`, else `today_at(dose 1 time)`. `availability:` is false when the dose 1 helper is unknown or unavailable, which keeps today's "unavailable input means nothing fires" behaviour in every consumer.

3. **Reminder trigger and pending sensor** — Point the dose 1 `time` trigger at the new sensor. In `sensor.nino_medication_pending_dose`, build `dose_1_time` from the effective sensor (`as_datetime(...)`) and keep the existing guard that returns the literal `none` when it is unavailable. Dose 2 is unchanged. Keep the sensor from ever going unknown or unavailable.

4. **Escalation** — In `nino_medication_escalation.yaml` dose 1 branch, replace `today_at(nino_medication_1_time) + 2h` with the effective sensor + 2h, same availability guard. Dose 2 branch unchanged. Update the header comment in one line.

5. **Snooze length** — In the reminder: add `snooze_minutes` to `variables:`; use it in the pre-wait `timer.start` and the snooze-branch `timer.start` (`data: duration`), the `wait_for_trigger` `timeout`, and the push action title (`"Snooze {{ snooze_minutes }} Minutes"`). Fix the stale "15" comments and the package header line. Leave the guards on every `timer.start` as they are.

6. **Dashboard row** — In `dashboards/templates/button_cards/people/nino.yaml`, add a "No school earliest" row for the new helper under "Medication Reminder Time", same `entity_no_icon` include as the two dose rows. This is what makes the time configurable without Developer Tools. Touch `dashboards/kohbo/kohbo.yaml` mtime on deploy per CLAUDE.md.

7. **Tests** — Add `tests/test_nino_weekend_medication_regressions.py` in the style of `test_quiet_mode_regressions.py` (reads the package files relative to the test, no `/root/config`, no HA). There are no existing nino medication tests. Cases:
   - the dose 1 trigger and the dose 1 escalation branch both reference the effective sensor, and the raw `nino_medication_1_time` is no longer used for dose 1 timing in either (catches half a migration);
   - dose 2 trigger and escalation still use `nino_medication_2_time`;
   - the push snooze title, both `timer.start` durations and the `wait_for_trigger` timeout all derive from `snooze_minutes`, and none is a hardcoded 15;
   - `snooze_minutes` and the effective-time template contain the positive `'off'` test, not `not ... 'on'`;
   - a small Jinja render (stubbed `states`, `is_state`, `today_at`, `state_attr`, `now`) of the effective-time and pending-dose templates across: weekday, Saturday, Saturday with base time later than the floor, unset floor, school-day sensor unavailable, base helper unavailable, and Saturday <time> (pending = `none`) vs <time> (pending = 1).

   Run a sabotage pass: revert each edit and confirm a test goes red. Local gate is `python -m pytest` on this file plus `tests/run_tests.py --syntax --modern`; `ha core check` on the host is authoritative (the repo's yamllint noise and `/root/config` hardcodes make the quick suite weak locally).

8. **Docs** — `dashboards/SITEMAP.md` (new row); a short note in the package header comment of `nino_medication_reminder.yaml` on the no-school rule. `docs/` has no nino medication page, so nothing there. After merge, add a memory entry.

9. **Validate and deploy** — Push first (`deploy.sh` pulls from GitHub); `--skip-ci`, never a bare `--check`. Reload automations, template entities and input_datetime (no restart). Then confirm on the host: `binary_sensor.nino_school_day` reads `off` on a weekend and `on` on a school day, `sensor.nino_medication_1_effective_time` shows <time> on a no-school day, and the Logbook (not traces) shows the reminder at <time> and not before. John sets the floor helper after deploy, or leaves it unset for the <time> fallback.

## Open decisions

1. **Awake before <time> on a no-school day.** Default: wait, prompt at <time> if awake (this is the plan above, and costs nothing extra). Alternative: prompt at wake + 5 minutes whenever he gets up, which defeats "delay until 8".
2. **What "snooze 30" covers.** Default: all of it, via one variable (re-prompt timer, Snooze button, wait timeout, button title), because the timer is one thing in the package. Alternative: only the Snooze button restart, leaving the unanswered re-prompt at 15. Cheaper to say, but the button label and the timer would disagree.
3. **Which doses.** Default: 30 minute snooze on both doses on no-school days (one variable, no per-dose branch). Alternative: dose 1 only.
4. **Floor helper default.** Default: no `initial:`, template falls back to <time> when unset. Alternative: `initial: "<time>"`, simpler but reverts dashboard edits on every restart.
5. ~~Summer and breaks count as no school.~~ **Resolved (John, 2026-10-29): summer counts as no school.** `nino_school_day` is off all summer, so dose 1 starts at <time> for the whole summer, which is what John wants. Summer camps are a separate, deferred question (next section).
6. **Escalation moves with the delay.** Default: dose 1 escalates at effective time + 2 hours (<time> on a default weekend). Alternative: leave it at <time>, which would fire before the dose is even 90 minutes late. Not recommended.
7. **Dashboard Snooze button.** The popup cards `nino_med_reminder_1.yaml` and `_2.yaml` call `timer.start` with no duration, so they stay at 15 minutes on no-school days. Default: leave them (not in the issue) and call it out. Fix is extra B below.

## Deferred: summer camp tracking (revisit spring 2027)

**Status: flagged, not designed, not in v1.** Nothing in this plan depends on it.

John: "summer: yes, counts as no school. But we do have summer camps. We usually add these to the calendar. We probably need a way to track this like we do school. Flag this and we can revisit in the spring."

What it is: camp days arrive on the family calendar and should be tracked the way school days are, so the house knows "camp today" the way it knows "school today". That would eventually let camp days behave differently from a plain no-school day (for example an earlier dose 1 on a camp morning), but that is a later decision, not a requirement here.

How school days are tracked today, as the starting point for the spring discussion (all under `packages/school/`):

- **Calendar in, sensor out.** `primary_school_calendar_sensors.yaml` is a trigger-based template that runs hourly, at start and on template reload, calls `calendar.get_events` on the school's calendar (`continue_on_error: true`, one file per calendar because the service raises if its target resolves to zero entities), and classifies today's and tomorrow's events into closures and informational items.
- **Day sensor.** `kids/nino_school.yaml` defines `binary_sensor.nino_school_day` as `binary_sensor.primary_school_in_session_today`, which folds in weekends, closures, `school_year_active` (`school_year.yaml`) and the `school_overrides.yaml` holiday toggle.
- **Consumers read the day sensor**, never the calendar, so a new "camp day" signal would slot in beside it rather than inside it.

Questions for the spring, none answered or designed:

- Which calendar carries camps, and how is a camp event recognised (title convention, a dedicated calendar, a keyword)? Camps differ week to week, so this is per-event, not a fixed schedule.
- Is it one boolean ("camp today"), or does it need start and pickup times like the bell-schedule sensors?
- Does it change medication timing at all, or only feed the morning brief and reminders?
- Camp is a place and a routine tied to the child, so per the repo's privacy rules the entities stay generic and no camp name, location or schedule goes in the repo.

Until then, summer camp days behave as no-school days: dose 1 at <time> (or the floor), 30 minute snooze.

## Itemised extras (not in v1)

- **A. Check for an upcoming event** — Not trivial. Needs a decision on which calendar and what "upcoming" means (timed vs all-day, how far ahead, does it pull the floor earlier or skip the delay), then a trigger-based template sensor or `calendar.get_events` step (the school package shows it raises when its target resolves to zero entities and needs `continue_on_error`), one more entity, a feed into the effective-time sensor, and 4 or 5 more test cases. Roughly 30 to 45 lines plus tests. Recommend deferring and answering the calendar question first. Without it the failure mode is "dose 1 at <time> on a morning with an early outing", which the existing Snooze, shortcut button and Alexa phrase already cover.
- **B. Dashboard snooze at 30** — A `script.nino_medication_snooze` taking a dose, doing the weekday/weekend duration, called by both popup cards (and optionally by the reminder's snooze branch to dedupe). About 15 lines and 2 card edits. Worth taking if the dashboard Snooze button is used on weekends.
- **C. Sick day counts as no school** — Treat `input_boolean.nino_home_today` as no-school too, so a sick weekday starts at <time> with a 30 minute snooze. A 2 line change in two templates plus a test. Cheap, but it is a behaviour John did not ask for.

## Risks

- **Half-migration**: any consumer left on the raw dose 1 helper makes weekend behaviour inconsistent (early escalation, early pending). Mitigation: the structural test in Task 7 and a grep for `nino_medication_1_time` in review.
- **Time trigger on a derived sensor**: if the sensor is unavailable at <time>, nothing fires and the wake-up trigger or escalation is the only net. Same failure direction as today's unavailable helper; availability tracks the dose 1 helper only. Verify on the host that the trigger resolves to <time> on a no-school day.
- **Reload after the floor time**: a `time` trigger on a timestamp sensor that is reloaded after its time skips today (`packages/school/LEARNINGS.md`). The wake-up trigger and the escalation still cover it, but a reload between <time> and his waking would lose the <time> prompt. John only reloads on request, so accepted.
- **Toggling `school_day_override_off` mid-morning**: the sensor re-renders and the trigger reschedules. If the override is turned on after <time> on a school day, the <time> reminder has already fired; it does not retract. Accepted.
- **Summer starts at <time>** (decision 5, resolved). Intentional. A summer camp day with an early start is the same failure mode as extra A until the deferred camp tracking exists.
- **Dashboard Snooze stays 15** on no-school days until extra B (decision 7).
- **Privacy**: nothing here names a medication, dose, or any new personal detail; all times are already in the repo.

## Amendment: skip a dose (John, 2026-11-15)

**Ask.** A way to skip a dose. A skipped dose must not count as taken, must not use up supply, and must stop that dose's reminders and escalation.

### Patterns found (so this adds nothing new in kind)

- **State is a per-dose `input_boolean`** (`nino_medication_<n>_taken`, `_escalated`). Everything else is a reaction to a boolean flipping: the stock decrement triggers on `nino_medication_<n>_taken` off to on, the reminder's wait has a template trigger on it, the popup cards and dashboard rows read it. Skip follows the same shape with `nino_medication_<n>_skipped`.
- **The taken path is `script.nino_medication_taken`** (dose field, else pending, else earliest open): turn the boolean on, cancel the dose timer. Callers: popup cards, the reminder's Taken push action, the ZHA button, Alexa, and (JK-1257) the escalation push handler. A skip script mirrors it.
- **Snooze** is the dose timer (`timer.nino_medication_<n>_timer`, restored across restarts) plus a `SNOOZE_<run>` push action caught by the reminder's `wait_for_trigger`. Skip reuses both halves: cancel the timer, and add a `SKIP_<run>` action caught in the same wait.
- **Supply (JK-1196, #108)** is `input_number.nino_medication_stock` in doses; days left is stock / 2. Two automations (`nino_medication_1_stock_decrement`, `_2_`) decrement once per `_taken` off to on, only above 0. Skip never touches `_taken`, so supply is untouched by construction; no change to those files, and a test proves it.
- **Consumers of "is this dose still open?"** (all must learn skipped): the reminder's conditions and wait branches, the pending-dose sensor ("in play"), the escalation branches, `script.nino_medication_taken`'s `resolved_dose` ("open"), and the two popup cards.

### Design

Skipped is its own boolean, never a flavour of taken. Taken stays off, so the stock decrement, the "Dose n" toggle rows and any future "was it given" reader are untouched.

**Test form everywhere: `not is_state(<skipped>, 'on')`**, never `is_state(<skipped>, 'off')` and never a state condition on `off`. A missing or unavailable helper must leave the reminder and the escalation backstop firing (same direction as the `nino_school_day` rule above and `packages/school/LEARNINGS.md`). The escalation header says it must fire when everything else has failed quietly.

- **10a. Helpers.** `input_boolean.nino_medication_1_skipped` and `_2_skipped` in `nino_medication_reminder.yaml`, no `initial:`. Both cleared by the existing 03:00 reset (add them to its turn_off list).
- **10b. `script.nino_medication_skip`.** Required field `dose` (1 or 2); no pending/earliest-open fallback until a caller needs one (Alexa is later). Acts only when that dose's `_taken` is not on, and turns `_skipped` on. Callable from the dashboard and the push handler.
- **10c. `nino_medication_skipped.yaml` (one job: tidy up after a skip).** Trigger `_skipped` off to on, id = dose. Cancel that dose's timer; clear both pushes for the dose by tag (`nino-medication-dose-<n>`, `nino-medication-escalation-<n>`, `continue_on_error`). On the boolean, not in the script, so a dashboard toggle behaves exactly like the script.
- **10c2. `nino_medication_unskipped.yaml` (one job: put a dose back).** Trigger `_skipped` on to off, id = dose. If the dose is untaken, the master toggle is on, the dose is due (now is at or past its time; dose 1 uses the effective time from Task 2) and its timer is idle, start that dose's timer for 1 minute (`timer.start` with `duration`), so the existing `timer.finished` path re-prompts. Without this, un-skipping by mistake leaves nothing to re-prompt (the time trigger has passed and the timer was cancelled); only the wake-up trigger or the escalation would. Before the dose is due, un-skipping does nothing extra: the time trigger fires as normal.
- **10c3. `nino_medication_taken_clears_skip.yaml` (one job: never both).** Trigger `_taken` off to on, id = dose; turn that dose's `_skipped` off, if it is on. On the boolean, not in the script, because the "Dose n" toggle rows at `nino.yaml` flip `_taken` directly, and the toggle must not leave both on. (The un-skip automation sees this off flip: its untaken condition stops it starting a timer.)
- **10d. Stop reminders, every path.** In `nino_medication_reminder`:
  - the conditions block: `not is_state(<skipped>, 'on')` (covers the time triggers, the `timer.finished` re-prompt and the wake-up trigger);
  - every in-run "still untaken" guard, each also requiring not skipped: the voice announcement `if`, the pre-wait `timer.start` `if`, the push `if`, and the Snooze branch `timer.start` `if`. A skip can land while the run is blocked on the voice announcement, after the conditions passed; without these guards the run restarts the timer and sends a fresh push that nothing clears;
  - the `wait_for_trigger` gets a `skipped` template trigger so a run already waiting ends on a skip; the choose has no branch for it (default, no-op). The pre-wait guards cover a skip that is already on when the wait starts, which a template trigger would not catch.
- **10e. Stop escalation.** Both escalation branches add `not is_state(<skipped>, 'on')`. Skipping an already-escalated dose is fine: the escalated boolean stays on, nothing resends.
- **10f. Pending-dose sensor and taken script.** In `sensor.nino_medication_pending_dose`, a skipped dose is not in play (`dose_n_untaken` already uses the positive form; add `dose_n_not_skipped` alongside). In `script.nino_medication_taken`'s `resolved_dose`, a dose is "open" only if `_taken` is off and `_skipped` is not on; rewrite the comment that calls a skipped dose 1 "marked first", since "skipped" now means something else. An explicit `dose` still wins and `nino_medication_taken_clears_skip` (10c3) turns the skip off.
- **10g. Quick actions and dashboard.**
  - **Fixed ids on both pushes**, not per-run: the reminder push and the critical escalation push both send a Skip Dose action `NINO_MEDICATION_SKIP_<dose>`. A per-run id would be heard only by that run's wait (the failure JK-1257 fixed): if Nino is asleep when the timer finishes the next run is dropped at the Awake condition, and the old push keeps a Skip button nobody is listening for.
  - **New file `nino_medication_push_skip.yaml`** (not an edit of `nino_medication_push_action.yaml`, which stays as shipped in #178; its test gets one small edit, see 10h): triggers on the two fixed ids with trigger ids "1" and "2", calls `script.nino_medication_skip` with `dose: "{{ trigger.id }}"`. Stale-tap gate (the ids never expire): act only if that dose is the pending dose or its `_escalated` flag is on, so a tap on yesterday's push cannot skip today's not-yet-due dose.
  - The Taken action on the reminder push keeps its per-run id (unchanged; the same dead-button gap is a BACKLOG item, not in this task).
  - Popup cards `nino_med_reminder_1.yaml` and `_2.yaml`: a Skip sub-button calling `script.nino_medication_skip`, and a second condition `not skipped` (a Lovelace state condition `state_not: "on"`, which is the positive form for dashboards). `nino.yaml` gets "Dose n skipped" toggle rows using `kohbo_boolean_entity_layout`, so a skip can be set or undone from the dashboard.
- **10h. Tests** (`tests/test_nino_medication_skip.py`; no HA; `tests/test_nino_medication_push_action.py` gets only the handler-lookup edit below). Each site is pinned by name, so one edited file or block cannot satisfy it:
  - the reminder conditions block, each in-run guard (voice, pre-wait timer, push, Snooze branch) and the wait trigger all carry the positive-form not-skipped test for the right dose, and none uses `is_state(..., 'off')` on a skipped boolean;
  - both escalation branches carry it, plus a Jinja render: skipped dose 1 two hours late does not fire, unskipped does;
  - the pending sensor and `resolved_dose` render for: dose 1 skipped (pending 2 once dose 2 is due, else none), dose 2 skipped, both skipped, skipped helper unavailable (dose still in play, fail open), skipped then taken by explicit dose;
  - the stock decrement automations never reference `_skipped` and still trigger only on `_taken` off to on (supply untouched);
  - the skip script acts only when `_taken` is not on; the cleanup automation cancels the right timer and clears both tags; the un-skip automation starts a timer only for an untaken, due dose with an idle timer; the taken-clears-skip automation exists for both doses;
  - `tests/test_nino_medication_push_action.py` gets one stated edit: `_handler_ids()` reads both handler files (`nino_medication_push_action.yaml` and `nino_medication_push_skip.yaml`) and records which file handles each id, and the dose check applies per id (Taken ids to the first file, Skip ids to the second). Nothing else in it is loosened;
  - `NINO_MEDICATION_SKIP_<dose>` appears as an action on both the reminder push and the escalation push (deleting it from either goes red);
  - every action id either push sends (Taken, Snooze, the new Skip, the escalation ids) has a handler, and the skip handler is gated on pending or escalated;
  - the popup cards carry the not-skipped condition; the 03:00 reset clears both skipped booleans.
  - Sabotage pass: revert each consumer edit and confirm a test goes red.
- **10i. Docs.** `docs/PEOPLE.md` medication section (own boolean; does not count; does not use supply; stops reminders and escalation; un-skipping re-prompts after a minute if due; cleared at 03:00; marking taken clears it); `dashboards/SITEMAP.md` row; `packages/people/LEARNINGS.md` one line.

### Open decisions for the amendment

11. **Skip scope.** Default: skip applies to today only (cleared at 03:00), per dose. Alternative: "skip until tomorrow" is the same thing; "skip the rest of the week" is a different feature, not built.
12. **Skip after escalation.** Default: allowed and stops further reminders (the escalation fires once per dose anyway). The critical push is cleared by tag.
13. **Taken after skip.** Default: an explicit taken wins, counts supply, and clears skipped (10c3). The no-dose fallbacks (button, Alexa) ignore a skipped dose. Known side effect, accepted: the earliest-open fallback has no due-time test, so after a dose 1 skip an early "Nino took his meds" marks dose 2 taken (BACKLOG).
14. **Skip and supply.** Skipped doses do not use supply, so days left will read longer than the calendar by one dose per skip, which is correct (the pill is still in the bottle).

### Risks added

- **A reader of "open" missed**: a consumer that tests only `_taken` keeps nagging a skipped dose. Mitigation: the Task 10h structural test, and a grep for `nino_medication_[12]_taken` in review.
- **Escalation push ids**: this branch edits the escalation JK-1257 (#178) changed, so it must merge after #178. The skip handler is a separate file, so #178's handler stays untouched; only its test's handler lookup is widened (10h).
- **Skip toggled on an already-taken dose** from the dashboard row: allowed, nothing breaks (the stock only moves on `_taken` off to on); the row reads oddly until 03:00. Accepted.
- **Privacy**: no new personal detail; entity names are generic.

On approval → /approve → /ship nino-weekend-medication-timing
