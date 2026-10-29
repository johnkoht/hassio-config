---
title: Medication Refill Tracking
slug: medication-refill-tracking
status: draft
created: 2026-10-29
has_pre_mortem: false
has_review: false
has_prd: false
---

# Medication Refill Tracking

## Problem

Nothing in the house knows how many pills are left. The reminders (Nino's two doses, Cristina's daily and Friday doses) only know "given today or not", so a refill gets noticed when the bottle is empty. Linear asks for pill-count tracking with a low-stock reminder (JK-1196, High) and points at a HACS integration as one way to get it (JK-1212, High).

## Goal

Each tracked medication has a pill count that drops by one each time a dose is marked given, a derived days-remaining figure, one push when days remaining falls below a threshold (with a daily repeat until refilled), and a one-tap refill action from that push. Refer to them generically throughout: "Nino's medication", "Cristina's daily medication", "Cristina's Friday medication". Nothing else in v1.

## Findings (what exists today)

**Nino.** Two doses, each with `input_boolean.nino_medication_{1,2}_taken` (reset to off at 03:00:01 by `nino_medication_reminder_reset`). Every path that marks a dose given ends at one of two places: `script.nino_medication_taken` (push "Taken" action, ZHA button, Alexa routine) turns the boolean on, or someone flips the boolean directly from the dashboard row. The reminder itself waits on the boolean flipping, so the boolean is the one signal all paths share. Package: `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`.

**Cristina.** Two independent medications, each with its own boolean and snooze timer: `input_boolean.cristina_daily_medication_taken` and `input_boolean.cristina_friday_medication_taken` (Friday is weekly). The push "Taken" action turns the boolean on from inside the reminder automation; the dashboard row flips it directly. Both reset at 03:00:01. Both Cristina reminder automations carry `initial_state: false`; per the repo's own gotcha that does not mean "disabled", but confirm live that they are on. It does not affect this plan, because the trigger below is the boolean, not the reminder.

**Skip a day.** There is no skip concept and none is needed for counting: a dose that is not given leaves its boolean off, the 03:00 reset clears it, and no pill is deducted. The existing not-given path is the skip.

**Linear's other reading of "skip a day".** If John means "stop nagging me today because the dose is intentionally skipped", that is a different feature (silence the reminder and escalation) and is itemised under Extras, not built.

## Approach

### Option A (recommended): native helpers

Per medication: one `input_number` stock and one derived days-remaining template sensor, plus a shared threshold and shared refill logic. Decrement is a state trigger on the existing taken boolean going `off` to `on`. Nothing in the existing reminder, escalation, or reset flows is edited, so there is no risk to the reminders themselves.

- **Maintenance:** our YAML, in git, in the repo's existing style, covered by tests.
- **Where it hooks in:** the taken boolean, which every give path already shares (see Findings). Dashboard toggles, the push action, the ZHA button and Alexa all count, with no per-path wiring.
- **Several people:** three medications are three small copies of the same file shape; no config wizard.
- **Schedule shape:** days remaining is `stock / pills-per-day`, with a per-medication constant (Nino 2/day, Cristina daily 1/day, Cristina Friday 1 per 7 days). This models the weekly dose properly.
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

- **Stock:** `input_number.<med>_stock`, min 0, step 1, mode box, **no `initial:`** (it would reset the count on every restart). John seeds the current counts once after deploy.
- **Decrement:** one automation per taken boolean (four files, one job each, ids match filenames), `trigger: state`, `from: "off"`, `to: "on"`, action `input_number.set_value` to `max(0, stock - 1)`. Placed beside each person's existing medication package, not inside the reminder files. `from: "off"` means the 03:00 reset (`to: off`) and a restart restore do not count.
- **Days remaining:** `sensor.<med>_days_remaining`, template sensor, state `stock / pills_per_day` rounded down, `unavailable` when the stock is unavailable (never 0, so a bad read cannot fire a false alert). Pills-per-day is a constant in the template, not a helper.
- **Threshold:** one shared `input_number.medication_refill_threshold_days`, no `initial:`; John sets it after deploy (suggest 7, matching the integration's default).
- **Alert:** one automation, `medication_refill_low_stock_alert`. Triggers: `numeric_state` on each days-remaining sensor `below` the threshold (fires once on crossing, not on restart), plus a daily time trigger (09:00) for the repeat. Action: for each sensor currently below the threshold (just the triggering one on a crossing, all low ones on the daily repeat), `script.general_notification` with `devices: "all"`, `priority: "time-sensitive"`, a per-medication `tag` (so a repeat replaces the old push), and a Refilled action id `MEDICATION_REFILLED_<med>`. It uses the shared notification helper, so it respects `notification_level` (this is a reminder, not a safety backstop like the escalation). Message text is generic ("Nino's medication is running low: about N days left"). The time trigger has no `trigger.entity_id` (the lesson from the door re-alert bug), so the message is built from the loop item, never from `trigger`.
- **Refill:** `script.medication_refilled` with fields `medication` and `quantity`; adds `quantity` to stock (capped at the helper max). A separate small automation, `medication_refill_push_action`, listens for `mobile_app_notification_action` with the fixed `MEDICATION_REFILLED_<med>` ids and calls the script with that medication's `input_number.<med>_refill_quantity`. It is a standalone event automation, not a `wait_for_trigger`, because the push is answered days later and a wait would not survive a restart (the two-dose plan's lesson).
- **Drift correction:** John can edit any stock `input_number` directly (Settings, Entities, or a dashboard row once added). No separate "adjust" feature.
- **Where it shows:** v1 shows only in the push text and the HA entity list; dashboard rows are Extra E1/E2.

## Tasks

1. Stock helpers and days-remaining sensors — `input_number` stock and refill-quantity per medication, one shared threshold, three template sensors, in new files beside each person's medication package (unique filenames: `!include_dir_named` keys by basename).
2. Decrement automations — four files, one per existing taken boolean, `from: off to: on`, floor at 0.
3. Low-stock alert — one automation, crossing trigger plus daily repeat, via `script.general_notification`.
4. Refill script and push-action automation — `script.medication_refilled` and `medication_refill_push_action`.
5. Tests — `tests/test_medication_refill.py` (below).
6. Docs — add a short "Medication stock" section to `docs/PEOPLE.md` (it has no medication section today) listing entities and the decrement/refill flow; one line in `docs/AUTOMATIONS.md`; header comments per `packages/CLAUDE.md` (title plus 1-3 lines, reasoning in the commit). Memory entry at wrap.
7. Handoff for John (post-deploy, not done by an agent) — seed the three stock counts, set the threshold and refill quantities, reload automations, scripts, and template entities (`--reload` does not reload template entities; new `input_number` helpers need a restart, which only John does). Close JK-1212 with the rationale; close JK-1196 after the live check.

## Tests

Style of `tests/test_door_left_open_realert.py`: load the package YAML, render the real templates with Jinja, assert on structure. Local gates are yamllint and these tests; CI `ha-check` and the deploy's `ha core check` are authoritative (`tests/run.sh` hardcodes `/root/config` and passes vacuously on the Mac).

- Each of the four decrement automations triggers on the correct taken boolean with `from: "off"` and `to: "on"`, and none triggers on `to: "off"`.
- Each decrement targets its own stock entity and floors at 0 (stock 0 stays 0; stock 14 gives 13).
- Days-remaining template, rendered: Nino 14 pills gives 7; Cristina daily 7 gives 7; Cristina Friday 3 gives 21; stock `unavailable` gives `unavailable`, never 0.
- Alert message renders for both a `numeric_state` trigger and a bare time trigger (the door re-alert regression), and never references `trigger.from_state` or `trigger.entity_id` on the time path.
- Alert builds the repeat list correctly: with two of three sensors low it names exactly those two; with none low it sends nothing.
- Refill: script adds quantity and caps at max; the action automation only matches `MEDICATION_REFILLED_<med>` ids and maps each id to its own medication and quantity helper.
- Existing suites still pass: entity references, duplicates (basename collisions), modern syntax, naming.
- Sabotage check at review: drop `from: "off"` and confirm the 03:00 reset test goes red.

## Open decisions

1. **Native helpers or the HACS integration.** Default: native (Option A). Price of B: a restart, an external dependency with no releases, and we still write the same trigger wiring.
2. **Threshold unit.** Default: days (matches the integration and gives a consistent alert across daily and weekly medications). JK-1196 says "number of pills"; switching is structurally trivial (compare stock, not days) but a shared pill threshold alerts far too early or too late for the weekly medication.
3. **One shared threshold or one per medication.** Default: shared. Per-medication is +2 `input_number`s and a template change.
4. **Daily repeat.** Default: include, daily at 09:00 while still low, because a single swiped-away push is how the bottle still ends up empty (protection, not polish). Dropping it removes one trigger and one test.
5. **Refill adds or resets.** Default: add the fill quantity to the current count so leftover pills are not lost; "reset to quantity" is a one-line change if John prefers the literal wording.
6. **Un-toggling a taken boolean.** Default: no re-increment, so a dashboard flip off and on (correcting a mistake) over-counts by one; fix by editing stock. Auto-increment is Extra E5.
7. **Who gets the push.** Default: everyone (`devices: "all"`, same as Nino's reminder). `"jk"` only is a one-word change.
8. **Quantity per dose.** Default: one pill per dose, hard-coded. If any medication differs, tell me before build; a helper is Extra E4.

## Extras (itemised, not in v1)

All of this is beyond the ask. Each is cheap alone; none is needed for the count, the alert, or the refill to work.

- **E1 Dashboard stock rows.** Stock and days-remaining rows on the Nino and Cristina person cards (`dashboards/templates/button_cards/people/nino.yaml` and `cristina.yaml`; editable rows use `kohbo_boolean_entity_layout.yaml`'s style, read-only rows `kohbo_entity_item_layout.yaml`). About 6 rows across 2 files. Without it, stock is visible only in the HA entity list and the push text.
- **E2 Dashboard Refill button.** A button row calling `script.medication_refilled`. About 3 rows. Without it, refill is the push action, or the script from Developer Tools.
- **E3 Deliberate "skip today" button.** Silences that day's reminder and escalation without deducting. It adds a gate to each reminder flow, so it is the highest-risk item here; those flows were already hard to get right (see the two-dose plan).
- **E4 Pills-per-dose helper.** One `input_number` per medication feeding both the decrement and the days sensor. +3 helpers; only needed if a dose is not one pill.
- **E5 Re-increment on manual un-toggle.** Needs a guard so the 03:00 reset does not count as an un-toggle. +1 condition per boolean; fragile around the reset.
- **E6 Alexa refill phrase.** Nabu Casa scene exposure plus an Alexa Routine that John builds himself (same pattern as the "took his meds" routine). Almost no repo lines, but it needs a fixed default quantity.
- **E7 Out-of-stock critical escalation.** Stock reaches 0 while doses are still due. Another automation; the days alert plus its daily repeat already cover the same window.

## Risks

- **Count drift.** A double toggle, a forgotten toggle, or a dose from a different bottle leaves the count wrong. Mitigation: stock is directly editable; the alert is a nudge, not a hard dependency. Accepted.
- **Alert on bad data.** A restart or a read returning 0 or `unavailable` could look like out of stock. Mitigation: the days sensor is `unavailable` rather than 0 when stock is unavailable, `numeric_state` ignores non-numeric states, and it is tested.
- **Helpers not loaded.** New `input_number` helpers need a restart (John-only) and template sensors a template reload; a deploy that only reloads automations leaves triggers pointing at nothing. Mitigation: handoff step 7 and the entity-reference test.
- **Entity-id slugs.** Template sensor ids derive from `name:`, not `unique_id`; check the planned ids against the live registry before build (a stale `_2` suffix from an orphan registry entry is the known failure).
- **Weekly medication.** Days remaining treats Cristina's Friday dose as one pill per 7 days; if that schedule changes the constant needs updating. Accepted.
- **HACS reasoning rests on the README alone.** Minimum HA version and maintenance activity were not verifiable; the decision does not hinge on them (it hinges on needing our own wiring either way).
- **Privacy.** No medication names, doses, or schedules beyond what the repo already carries appear here or should appear in helper names or push text; use the existing generic naming.

On approval → /approve → /ship medication-refill-tracking
