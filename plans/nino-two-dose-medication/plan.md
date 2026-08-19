---
title: Nino Two-Dose Medication Reminder
slug: nino-two-dose-medication
status: in-progress
created: 2026-08-18
has_pre_mortem: true
has_review: true
---

# Nino Two-Dose Medication Reminder

## Problem

Nino now takes his medication twice a day, but `packages/people/nino/medication_reminder/nino_daily_medication_reminder.yaml` models exactly one dose: one `input_boolean`, one snooze `timer`, one `input_datetime`, one reminder automation.

Four properties of the current design actively block a second dose or silently lose one:

**The automation disables itself.** `script.nino_medication_taken` calls `automation.turn_off` on the reminder automation, and the 3:00am reset turns it back on. Taking dose 1 would silence dose 2 for the rest of the day. (Confirmed live: `automation.nino_daily_medication_reminder` is currently `off` for exactly this reason.) The per-dose "not taken" condition already does this job correctly, so the self-disable is redundant as well as harmful.

**A missed window is a lost dose.** The `input_select.nino_sleep_state == "Awake"` condition exists to stop the reminder firing before he's actually up — a weekend where the reminder is set for 07:00 but he sleeps until 07:30. But a failed condition drops the run entirely: no push, no snooze, no retry. The reminder doesn't fire late, it never fires.

**A restart mid-wait loses the dose entirely.** The snooze timer starts only *after* `wait_for_trigger` times out (lines 152-157), so during the 15-minute wait nothing persistent records that a dose is in flight. Any restart or reload in that window kills the run: the `time` trigger already fired, there is no timer to fire `timer.finished`, and the wake-up trigger needs an `Awake` *transition* that won't come if he's already up. The dose vanishes with no signal.

**The physical button's "taken" branch is broken.** Line ~166 tests `{{ trigger.id == 'button_action' }}`, but inside `wait_for_trigger` the matched trigger is exposed as `wait.trigger.id` — `trigger` still refers to the automation's original trigger, whose `id` defaults to its index (`"0"`, `"1"`). The comparison is always false, so a button press during the wait falls through to the snooze branch. It only appears to work because the separate shortcut automation catches the same press; the parent then races it by starting the snooze timer anyway.

Secondary gaps: the notification `tag` is a single hardcoded `nino-morning-medication` (a shared tag would make dose 2 silently replace dose 1's notification), the 3am reset only clears one boolean and one timer, and the file still uses legacy `trigger:` / bare `entity_id:` syntax throughout.

## Goal

Nino has two independently configurable medication times per day. Each dose reminds, snoozes, and is marked taken on its own, via push, voice, the ZHA button, or the dashboard. A dose whose scheduled time passes while he's still asleep is deferred until he wakes rather than dropped; a dose interrupted by a restart resumes; and a dose that goes unanswered for hours escalates through a channel that cannot be muted. All of it runs through one dose-aware automation rather than two copies of the same logic.

## Approach

**One dose-aware automation, parameterized by dose number.** Dose identity comes from `trigger.id` (`"1"` / `"2"`), resolved in an automation-level `variables:` block into per-dose entity IDs (`input_boolean.nino_medication_{{ dose }}_taken`, `timer.nino_medication_{{ dose }}_timer`, `input_datetime.nino_medication_{{ dose }}_time`) and a per-dose notification tag. Automation-level variables render after the trigger fires and before `conditions:`, so conditions reference the resolved entities directly — repo precedent at `packages/alexa_actionable_notifications.yaml:50-53`.

The rejected alternative is the existing Cristina pattern (`cristina_daily_*` + `cristina_friday_*`), which duplicates ~150 lines of identical wait/snooze/choose logic. Every bug fixed above would have to be fixed twice, forever.

**The snooze timer starts when the reminder is sent, not when the wait times out.** This is the fix for the restart-loses-the-dose failure. Timers are `restore: true`, so a timer that survives a restart still fires `timer.finished` and re-prompts. It also makes the wait's timeout branch a pure no-op — the timer owns re-prompting — and turns the "timer is idle" condition into a genuine in-flight guard rather than an approximation.

**A pending-dose template sensor as the single resolver.** `sensor.nino_medication_pending_dose` answers "which dose is outstanding right now?" and returns `"1"`, `"2"`, or `"none"`. Three consumers need exactly this answer: the wake-up trigger, `script.nino_medication_taken` when called with no argument (the ZHA button and the dashboard mark-taken button), and the dashboard notification cards.

The rule:

> A dose is **in play** if it is untaken AND (its scheduled time has passed today OR its snooze timer is active).
> Among in-play doses, return the one with the **latest scheduled time**.
> Tie → the higher dose number.
> No in-play doses, or any unavailable input → `"none"`.

Ordering by latest scheduled time — rather than by which timer is active — is what makes this correct. Consider dose 1 at 07:00 snoozing unanswered all day and dose 2 prompting at 19:00: a timer-priority rule marks **dose 1** when the button is pressed at 19:01, clearing a genuinely outstanding reminder while leaving dose 2 untaken. Latest-scheduled-time returns `2`. Timer-active only widens *membership* (so a dose mid-prompt stays in play, and so a dose whose time is edited mid-snooze doesn't silently drop out); it never reorders.

Latest-scheduled-time is also **time-ordered rather than number-ordered**, so it stays correct if dose 2 is ever configured earlier in the day than dose 1 — which nothing prevents.

**Catching up at most one dose is intended, not a limitation.** If Nino sleeps until noon, the wake-up trigger fires for the morning dose and that is the only dose it catches up — doses are never stacked to make up for missed ones. This is why the resolver returns a single dose rather than a list, and it is a clinical decision, not a simplification.

**Defer instead of skip on sleep.** Keep the `Awake` condition, and add a trigger on `input_select.nino_sleep_state` → `"Awake"` with `for: minutes: 5`. When he gets up, the pending-dose sensor names the overdue dose and the reminder fires then. The 5-minute debounce keeps nap-driven flapping from re-triggering, and the timer-idle condition suppresses a re-fire while a snooze is counting down.

**Wait on the taken-boolean, not the button — via a template trigger.** Every path that marks a dose taken (push action, ZHA button, dashboard button, script) flips that dose's boolean, so watching the boolean covers all of them with one trigger. This dissolves the `trigger.id` bug rather than patching it.

The mechanism must be a **template** trigger, not a state trigger: state-trigger `entity_id` is validated by `cv.entity_ids_or_uuids` at config-load time and is **not templatable**, so `entity_id: "input_boolean.nino_medication_{{ dose }}_taken"` fails `ha core check`.

This pattern has **no precedent in this repo** — all 13 existing `wait_for_trigger` uses were checked. What *is* proven here is that *event* triggers render templates against enclosing variables (`action: "{{ action_taken }}"` at `nino_daily_medication_reminder.yaml:129` works in production), which is strong but not identical evidence. So the design keeps a deliberate degradation path: if the template trigger silently never fires, the push `action_taken` event trigger still completes the wait and the ZHA button still marks the dose via the shortcut automation, leaving only a spurious snooze — **which the snooze guard below absorbs.**

**The snooze guard is load-bearing.** Every `timer.start` is guarded by `is_state(taken_boolean, 'off')`. This covers three separate failure modes at once: the template trigger silently not firing, a boolean flip between the condition check and the wait attaching, and duplicate parallel runs for the same dose. It is not defensive polish and must not be simplified away.

**The safety net must not share a failure mode with the thing it backs up.** Every push in this system routes through `script.general_notification`, which hard-gates on `input_select.notification_level` at `packages/general_notifications.yaml:206-207` — when that select is `None`, the script exits silently, sending nothing and logging nothing. So the escalation deliberately **bypasses `script.general_notification` and calls `notify.ios_family` directly**. Repo precedent for safety-critical alerts doing exactly this: `packages/ninos_room/nino_escaping/nino_escape_monitor.yaml:81` (also for Nino), `packages/security/security_unlock_front_door_by_fingerprint.yaml:44`, and `packages/people/cristina/medication_reminder/cristina_friday_medication_reminder.yaml:71`. Ordinary reminders stay on `general_notification` — routing normal traffic through the house's notification policy is correct. Only the backstop is unmutable.

The escalation also uses a **`time_pattern` trigger rather than a template trigger**, deliberately choosing the dumb, restart-proof mechanism: a template trigger that is already true when HA starts does not fire, which would mean a restart during the escalation window disables the very net meant to catch it. Per-dose `_escalated` booleans keep it to one alert per dose per day.

**Entity naming.** Numbered doses (`nino_medication_1_*` / `nino_medication_2_*`) rather than morning/evening, because both times are user-configurable and "evening" would be wrong the moment dose 2 moves to 2pm.

**No silent failures.** This system reminds a child to take medication. Every failure path must leave evidence: no `max_exceeded: silent`, a resolver that degrades to `"none"` rather than `unavailable`, an escalation that cannot be muted, and a deploy step that proves it actually landed.

## Environment (verified live, 2026-08-18)

Confirmed against the HA Yellow at `192.168.1.36` (`ssh hassio`) before build. Full detail in `build-log.md`.

- **HA core 2026.7.4** — modern `triggers:`/`conditions:`/`actions:` syntax, `today_at()`, and `wait.trigger.*` all supported.
- **Pre-migration reminder time: `08:00:00`** (from `.storage/core.restore_state`; absent from the recorder DB entirely). Recorded for rollback. **John is changing it to `07:00:00` as part of this work** — dose 1's `initial:` is the new value, not the captured one.
- **All 7 proposed new entity IDs are free** in `core.entity_registry`.
- **Two live consumers exist that no repo grep can see** — see Task 13.
- **Host git HEAD has diverged from local** (`e6dab15` vs `28b243c`), the known condition where `deploy.sh` pulls nothing and exits 0. Relevant files are currently byte-identical, so nothing is wrong today — but a no-op deploy would be indistinguishable from a successful one. See Task 11.

## Tasks

1. **Capture the live config** — ✅ **COMPLETE** (homelab agent, 2026-08-18, read-only). Results in the Environment section above and in `build-log.md`. Pre-migration time was `08:00:00`; the `.storage` sweep surfaced two out-of-repo consumers now handled in Task 13.

2. **Rewrite the package helpers** — In `packages/people/nino/medication_reminder/`, replace the three single-dose helpers with:
   - `input_boolean.nino_medication_1_taken` / `_2_taken`
   - `timer.nino_medication_1_timer` / `_2_timer` (15 min, `restore: true` — the restore flag is what makes Task 4's restart durability work)
   - `input_datetime.nino_medication_1_time` (**`initial: "07:00:00"`**) / `_2_time` (`initial: "19:00:00"`)
   - `input_boolean.nino_medication_1_escalated` / `_2_escalated` (Task 7's once-per-day guard)

   Both datetimes need an `initial:`; without one a fresh `input_datetime` is `00:00` and would fire at midnight.

3. **Add `sensor.nino_medication_pending_dose`** — Template sensor in the same package file (`template:` inside a package is established here — see `packages/leak_monitoring.yaml`, `packages/outdoor_lighting.yaml`). Implement the in-play / latest-scheduled-time / higher-number-tiebreak rule from the Approach, using `today_at()` (repo precedent: `packages/mudroom/garage_entry_door/garage_entry_door_auto_lock.yaml:78`).

   **Availability is a hard requirement**: the sensor returns the literal string `"none"` for any unknown, unavailable, or unparseable input, and must never itself go `unknown`/`unavailable`. `input_datetime` entities read `unknown` during startup, and an unguarded `today_at(states(...))` raises — which would take the ZHA button and the wake-up deferral down together with no visible error.

4. **Rewrite the reminder automation as dose-aware** — New id `nino_medication_reminder`, alias "Nino Medication Reminder". Five triggers: two `time` on the datetimes (ids `"1"`/`"2"`), two `timer.finished` events (ids `"1"`/`"2"`), one `state` on `input_select.nino_sleep_state` → `"Awake"` `for: minutes: 5` (id `"awake"`). Automation-level `variables:` resolve `dose` (from `trigger.id`, or from the pending-dose sensor when the trigger is `"awake"`) plus the per-dose entity IDs and tag. Conditions: dose resolves to `"1"` or `"2"`, dose untaken, dose's timer idle, Nino awake.

   Action sequence — **note the timer placement, which is the restart fix**:
   1. `script.voice_announcement` (dose-neutral wording)
   2. **`timer.start` on the dose's timer** — before the wait, not after
   3. `script.general_notification` with per-dose tag (`nino-medication-dose-1` / `-2`)
   4. `wait_for_trigger`, 15-minute timeout:
      - `trigger: template`, `value_template: "{{ is_state(taken_boolean, 'on') }}"`, id `taken`
      - `trigger: event` on the push `action_taken`, id `taken_push`
      - `trigger: event` on the push `action_snooze`, id `snooze`
   5. Branches: `taken`/`taken_push` → `script.nino_medication_taken` (cancels the timer) · `snooze` → `timer.start` to restart the full 15 minutes · **timeout → no-op**, with a comment stating the timer owns re-prompting

   **Guard every `timer.start` with `is_state(taken_boolean, 'off')`** — load-bearing per the Approach, not optional.

   `mode: parallel`, `max: 4`, and **do not set `max_exceeded: silent`** — leave the default `warning`. A silently dropped run is a silently missed dose.

   Modern syntax throughout: `triggers:` / `conditions:` / `actions:` / `action:` / `target:`.

5. **Rework `script.nino_medication_taken`** — Add an optional `dose` field defaulting to empty; fall back to `sensor.nino_medication_pending_dose` when not supplied, and no-op cleanly if neither resolves to `"1"` or `"2"`. Turn on the resolved dose's boolean, cancel its timer. **Delete the `automation.turn_off` call.** `mode: queued`. Keep the script name — the dashboard and the live Assist config reference it.

6. **Update the reset and button automations** — Reset at `03:00:01` clears **both** taken booleans, **both** escalated booleans, and cancels **both** timers; drop the `automation.turn_on`. The ZHA shortcut button (device `d98b081e7991a6e9ce1672128dad93ae`, unchanged) conditions on the pending-dose sensor resolving to a real dose, then calls the script with no argument. Both automations keep their existing ids (`nino_medication_reminder_reset`, `nino_medication_reminder_shortcut_button`) — confirmed registered live, so no new orphans.

7. **Add the late-dose escalation** — Own file, per one-automation-one-job. This is the backstop; build it dumb and independent.
   - **Trigger**: `time_pattern` every 15 minutes. Deliberately *not* a template trigger — one that is already true at HA startup never fires, which would disable the net exactly when a restart caused the problem.
   - **Per-dose condition**: dose untaken AND `now() >= today_at(dose_time) + timedelta(hours=2)` AND that dose's `_escalated` boolean is off.
   - **Action**: call `notify.ios_family` **directly** with `push.interruption-level: critical` — **must not** route through `script.general_notification`, which is silently muted when `input_select.notification_level` is `None`. Then set that dose's `_escalated` boolean.
   - Cleared daily by Task 6's reset.

8. **Rename the package file** — `nino_daily_medication_reminder.yaml` → `nino_medication_reminder.yaml`. Verified free of basename collisions (`!include_dir_named` keys packages by basename globally — see the `reference_yml_vs_yaml_loading` memory).

9. **Update the person popup dashboard** — `dashboards/templates/button_cards/people/nino.yaml`: two boolean rows ("Dose 1" / "Dose 2"), two timer rows, both datetime pickers ("First dose at" / "Second dose at"). Update the singular section description copy.

10. **Split the notification card** — Replace `dashboards/kohbo/shared/notifications/nino_med_reminder.yaml` with `nino_med_reminder_1.yaml` and `nino_med_reminder_2.yaml`, each with snooze and mark-taken sub-buttons wired to its dose (mark-taken passes an explicit `dose`). Register both in `dashboards/kohbo/shared/kohbo_notification_popup.yaml` (currently line 18). Each card's condition is a template that also requires the dose's scheduled time to have passed, so dose 2's card doesn't sit in the popup from 3am onward.

11. **Validate and deploy** — `ha core check` **first**. If it fails, do not reload: `git revert`, re-push, re-deploy, then investigate.

    Push to GitHub before `./deploy.sh` (deploy pulls from the remote). **Then prove the deploy landed** — the host's git HEAD has diverged from local, the known condition where `deploy.sh` pulls nothing and exits 0. Confirm the host HEAD matches the merge commit and that `nino_medication_reminder.yaml` exists on the host with expected content. Exit code 0 is not evidence.

    Then `homeassistant.reload_all` — new `input_boolean` / `timer` / `input_datetime` / `template` entities won't appear from an automations-only reload, and that reload will *look* successful while every new entity is missing. Check the HA log for template-render warnings from the medication package.

12. **Verify against explicit criteria** — Manual; every check observed, not assumed. **This task gates Task 13 — do not clean up until these pass.**

    | # | Criterion |
    |---|---|
    | 1 | `ha core check` passes; no `Invalid config` or template-render warnings for the package after reload |
    | 2 | Host git HEAD matches the merge commit; deployed file content matches the repo |
    | 3 | Dose 1's configured time reads **`07:00:00`** |
    | 4 | Set dose 2 to now+2min → push arrives within 60s, `sensor.nino_medication_pending_dose` reads `2`, and the dose's timer goes `active` **immediately on prompt** (not 15 min later) |
    | 5 | Ignore that push → `timer.finished` fires at 15:00 and the reminder re-prompts |
    | 6 | **Restart HA mid-wait** (`ha core restart` during the 15-min window) → the timer survives, fires, and the reminder re-prompts. *The single most important check — this is CRITICAL 2.* |
    | 7 | **ZHA button pressed during an open wait** completes the wait rather than timing out. *Exercises the unprecedented template-trigger mechanism.* |
    | 8 | Push "Medication Taken" marks the correct dose and cancels only that dose's timer |
    | 9 | **With dose 1 snoozing AND dose 2 prompting, the ZHA button marks dose 2** |
    | 10 | Both doses set to the same time → resolver returns dose 2 (higher-number tiebreak), no error |
    | 11 | Dose time edited mid-snooze → that dose stays in play via timer-active, resolver doesn't silently switch doses |
    | 12 | Dashboard mark-taken works from each card and marks its own dose |
    | 13 | Taking dose 1 does not suppress dose 2 |
    | 14 | Sleep → Sleep, dose time set to now−5min, sleep → Awake: reminder fires 5–6 min later, **and not before** |
    | 15 | `script.nino_medication_taken` with no `dose` while nothing is pending does nothing — no error, no dose marked |
    | 16 | Triggering the 3am reset manually clears both taken booleans, both escalated booleans, both timers |
    | 17 | Dose 2's notification card is absent before its scheduled time, present after |
    | 18 | Restart HA → `sensor.nino_medication_pending_dose` reads `none`, never `unavailable` |
    | 19 | Escalation fires: leave a dose untaken past its window → `critical` push arrives, `_escalated` sets, no repeat |
    | 20 | **Escalation survives muting**: set `input_select.notification_level` to `None`, leave a dose untaken → the critical push **still arrives**. *This is CRITICAL 1.* |

13. **Post-verification cleanup** — Only after Task 12 passes, including at least one full day covering both doses. Nothing here is urgent, and running it early destroys the rollback trail.
    - Delete 4 orphaned registry entries: `input_boolean.nino_daily_medication_taken`, `timer.nino_daily_medication_timer`, `input_datetime.nino_daily_medication_time`, `automation.nino_daily_medication_reminder`.
    - **Fix the "UI Test" dashboard** (`/ui-test`, storage-mode, sidebar-visible): its People view has rows bound to the old boolean and timer that will read "entity not found". Repoint or remove them — **Lovelace UI editor only, there is no file to edit.**
    - **Re-expose the timer to voice assistants**: the old `timer.nino_daily_medication_timer` had a `cloud.google_assistant` exposure entry that the rename orphans. Settings → Voice Assistants → Expose.

## Risks

- **Recorder history resets on the renamed boolean** — Accepted. It's a daily checkbox; the history has no analytical value. Pre-migration time value is recorded in `build-log.md` for rollback.
- **The resolver is the one component that can fail silently** — Every other failure path either fails `ha core check` or logs. A wrong resolver result marks a checkbox green and clears a notification with no error anywhere. Mitigated by criteria 9–11 and by Task 7's escalation catching the downstream consequence. Still deserves the most scrutiny during build.
- **The template trigger is unprecedented in this repo and unverifiable before deploy** — Mitigated by the deliberate degradation path (push event triggers + snooze guard) and by criterion 7 exercising it first. Worst case is a spurious snooze, not a lost dose.
- **Concurrent runs for the same dose** — Reachable if he transitions to Awake and holds it 5 minutes inside an open wait window. Produces a duplicate push (same tag, so it replaces) and two waits on the same boolean. Absorbed by the snooze guard. Accepted rather than solved; eliminating it means decomposing `wait_for_trigger` into a separate response-listener automation.
- **Dose times inside 00:00–03:00 collide with the reset** — A dose set before the 3am reset would be prompted then wiped. Requires an implausible config; documented in the package header rather than guarded. Verified safe in the normal case: between the reset and the first dose time the resolver correctly returns `"none"`.
- **Two doses landing close together after a very late wake-up** — If he slept until 6pm, the deferred morning dose fires then and dose 2 follows at 19:00. Outside the case John described ("he won't sleep through both"); known behavior, not guarded.
- **Reload scope** — An automations-only reload appears to succeed while the new helper entities don't exist. Task 11 specifies `homeassistant.reload_all`.

## Out of Scope

- **Unbounded snooze loop** (pre-existing): if nobody responds, the timer restarts until the 3am reset. Task 7's escalation now surfaces this rather than fixing it; a max-snooze count is a separate change.
- **The actionable-notification response is only handled inside `wait_for_trigger`** — a restart mid-wait means a later push-button tap does nothing. Task 4's timer fix makes the *reminder* restart-durable, but a fully durable response path needs a separate always-on listener automation. Noted as the deeper fix; not in this change.
- **`input_boolean.nino_daily_task_take_medicine`** in `packages/people/nino/daily_tasks/nino_daily_tasks.yaml` is the morning-routine checklist, unrelated. Leaving it alone.
- **Cristina's medication package** has the same `automation.turn_off` and legacy-syntax issues, plus the same notification-mute exposure. Separate change.
- **HA 2026.8.2 upgrade** is available; not part of this work.

## Notes for the Builder

- **Do not add `input_boolean.speech_notifications` as an automation condition.** `CLAUDE.md`'s quality standard says automations affecting sound must check the house-wide booleans, but `script.voice_announcement` already checks it internally (`packages/announcements/voice_announcement.yaml:316`). Adding it at the automation level would block the *push* too.
- **The consolidated package file is intentional.** `CLAUDE.md` says one automation per file; this package has always held several plus a script and helpers, matching Cristina's. Do not split it — only Task 7's escalation gets its own file.
- **A stale worktree copy exists** at `.claude/worktrees/agent-abfe261fbe1851572/` containing a full duplicate of these files. Edits there do nothing.

On approval → /approve → /ship nino-two-dose-medication
