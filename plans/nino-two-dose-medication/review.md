---
title: Review — Nino Two-Dose Medication Reminder
slug: nino-two-dose-medication
type: plan-review
reviewed: 2026-08-18
verdict: revise
---

## Review: Nino Two-Dose Medication Reminder

**Type**: Plan
**Review Path**: Full
**Complexity**: Large (11 tasks, 6 files touched, entity rename + migration)
**Recommended Track**: `full` — /ship, pre-mortem required before approval

**Expertise profiles loaded**: none found (`find . -name PROFILE.md` → empty).
**LEARNINGS.md scanned**: none exist in this repo. Repo conventions taken from `CLAUDE.md`, `packages/CLAUDE.md`, `dashboards/CLAUDE.md`, and the `reference_yml_vs_yaml_loading` memory.

---

## Verification of the plan's technical claims

The plan rests on six specific claims about Home Assistant behavior. Five hold; one does not.

| Claim | Verdict | Evidence |
|---|---|---|
| Automation-level `variables:` render before `conditions:` and are usable there | ✅ Correct | HA renders automation `variables:` after the trigger fires and before conditions. Repo precedent: `packages/alexa_actionable_notifications.yaml:50-53`. |
| `trigger.id` is available in that variables block | ✅ Correct | Same precedent reads `trigger.event.data.*` in `variables:`. Note: when `id` is not set explicitly, it defaults to the trigger's **index as a string** (`"0"`, `"1"`, …). All five triggers get explicit ids, so no ambiguity — but see Concern 4. |
| `time` trigger accepts an `input_datetime` in `at:` | ✅ Correct | Already in production at `nino_daily_medication_reminder.yaml:52`. |
| Current `trigger.id` inside `wait_for_trigger` is a bug | ✅ Confirmed | `nino_daily_medication_reminder.yaml:166` tests `trigger.id == 'button_action'`. `trigger` is the *automation's* trigger, whose id defaults to `"0"`/`"1"`; the ids `push_action`/`button_action` exist only on the wait's triggers, reachable as `wait.trigger.id`. The comparison is **always false**. The plan's diagnosis is right. |
| Template sensor with `now()` re-evaluates every minute | ✅ Correct | HA re-renders templates containing `now()` at each minute boundary. Implication the plan doesn't state: the sensor can lag the true dose time by up to 59s. Harmless — the automation's `time` trigger is the primary path and the sensor only serves the button, the wake-up trigger, and the cards. |
| Templated `entity_id` works in trigger definitions | ❌ **WRONG** | See Concern 1. This one breaks the plan's Task 3. |

Templated `entity_id` in a **service call `target:`** is fine and has repo precedent (`packages/alexa_actionable_notifications.yaml:40`, `packages/security/cameras/detection_notifications/camera_detection_alert.yaml:72`). The failure is specific to trigger configs.

---

## Concerns

### 1. MUST FIX — Templated `entity_id` in a state trigger will fail `ha core check`

**Task 3**, "Wait on the taken-boolean, not the button", specifies a state trigger on `input_boolean.nino_medication_{{ dose }}_taken`. State-trigger `entity_id` is validated by `cv.entity_ids_or_uuids` at **config-load time**, before any template rendering. A string containing `{{ }}` fails `valid_entity_id()` and the automation will not load.

This is caught by `ha core check` rather than shipping silently, so it costs a build cycle rather than a missed dose — but it invalidates the mechanism the plan uses to dissolve the `trigger.id` bug, so it has to be resolved before build, not during.

**Why the confusion is understandable**: templates *do* work in some triggers inside `wait_for_trigger`. `async_initialize_triggers` is called with `variables=self._variables`, so trigger platforms that render templates can see script/automation variables. The **event** trigger renders `event_type` and `event_data` (`cv.template_complex`) — which is exactly why `action: "{{ action_taken }}"` at `nino_daily_medication_reminder.yaml:129` works in production today. The **state** trigger does not; its `entity_id` is a hard-validated schema field.

- **Suggestion (preferred)**: use a **template trigger**, which is templatable by construction and receives the same variables:
  ```yaml
  - trigger: template
    id: "taken"
    value_template: "{{ is_state(taken_boolean, 'on') }}"
  ```
  Keeps the plan's intent exactly — every path that marks a dose taken flips that boolean and completes the wait — and stays dose-correct. Template triggers fire on a false→true transition; the boolean is guaranteed `off` at that point by the automation's own condition, so it will fire. (But see Concern 5 for the narrow window where it won't.)
- **Alternative**: list both booleans literally in a state trigger and disambiguate afterward via `wait.trigger.entity_id == taken_boolean`. Works, but re-introduces the "wrong dose completed my wait" branch the template trigger avoids.

### 2. MUST FIX — The resolver picks the wrong dose in the exact window that matters most

**Task 2's** rule is "prefer a dose whose snooze timer is `active`; otherwise the earliest untaken dose whose scheduled time has passed."

During the 15-minute `wait_for_trigger` — the window immediately after a notification, when the ZHA button is most likely to be pressed — **the snooze timer is idle**. The timer only becomes `active` after the wait times out. So the resolver's primary signal is absent precisely while a dose is being actively prompted, and its fallback ("earliest") then points at the wrong dose.

**Concrete failure**, with dose 1 at 07:30 and dose 2 at 19:00:

| Time | State | `sensor.nino_medication_pending_dose` |
|---|---|---|
| 07:30 | Dose 1 prompts, no response | — |
| 07:45 | Timer 1 starts (snoozing all day) | `1` ✅ |
| 19:00 | Dose 2 prompts; timer 2 **idle** (in wait); timer 1 still active | `1` ❌ |
| 19:01 | Nino presses the ZHA button | Marks **dose 1** taken, cancels timer 1 |

Dose 2 remains untaken while its reminder is on the phone, and dose 1's genuinely outstanding reminder is silently cleared. Both doses end the day mis-recorded. This is the plan's only *silent* failure mode — nothing logs an error.

- **Suggestion**: replace the rule with **"among untaken doses whose scheduled time has passed today, return the one with the LATEST scheduled time; otherwise `none`."** Drop the active-timer preference entirely — latest-due subsumes it (a snoozing dose is by definition untaken and past due). Re-walking the table above: at 19:01 both doses are untaken and both times have passed → returns `2`. ✅
- Bonus: latest-due is **time-ordered, not number-ordered**, so it stays correct if dose 2 is configured earlier than dose 1 — which nothing in the plan prevents.
- Use `today_at()` for the comparison; repo precedent at `packages/mudroom/garage_entry_door/garage_entry_door_auto_lock.yaml:78`.

### 3. MUST FIX — Nino's currently-configured reminder time is silently discarded

`input_datetime.nino_daily_medication_time` holds a **restored, user-chosen value** — whatever time John actually set in the dashboard. Task 1 creates `nino_medication_1_time` with `initial: "07:30:00"`, and `initial:` applies because the new entity has no restored state. If his real setting isn't 07:30, dose 1 silently moves.

The plan has no capture step. This is a data-migration gap, not a code bug, so no validation will catch it.

- **Suggestion**: add a pre-deploy step to read the live value of `input_datetime.nino_daily_medication_time` (Developer Tools → States, or via the `homelab` agent against the Yellow) and set `initial:` for dose 1 to that value. Add "dose 1 time matches the pre-migration value" to the verification task.

### 4. MUST FIX — `max_exceeded: silent` turns a dropped run into a silently missed dose

Task 3 specifies `mode: parallel`, `max: 2`, `max_exceeded: silent`. With five triggers — two time, two `timer.finished`, one wake-up — three concurrent runs are reachable (dose 1 in its wait, dose 2 time fires, wake-up fires). At `max: 2` the third is dropped, and `silent` means **no log line, no reminder, no evidence it happened**.

Given the stakes, no failure in this system should be unobservable.

- **Suggestion**: `max: 4`, and remove `max_exceeded: silent` so it falls back to the default `warning`. The cost of a warning in the log is nil; the cost of an invisible dropped dose is not.

### 5. SHOULD FIX — Race between the condition check and the wait attaching

If the taken-boolean flips between the automation's condition evaluation and `wait_for_trigger` attaching — e.g. the ZHA button is pressed during the voice announcement, which takes seconds — the template trigger from Concern 1 is *already true* when it attaches and therefore never fires (template triggers need a false→true transition). The wait then runs its full 15 minutes and falls into the not-`wait.completed` branch, starting a snooze timer for a dose that was already taken.

- **Suggestion**: guard every snooze path with `is_state(taken_boolean, 'off')` before `timer.start`. Makes the whole automation idempotent and costs one condition. Worth doing regardless of Concern 1's resolution.

### 6. SHOULD FIX — The resolver sensor is a single point of failure with no stated availability contract

Three consumers depend on `sensor.nino_medication_pending_dose`. `input_datetime` entities are `unknown` during startup, and an unguarded `today_at(states('input_datetime.…'))` raises — the sensor goes `unavailable` and the ZHA button and wake-up deferral both stop working with no visible error.

The plan names this in Risks but Task 2 carries no corresponding requirement, and per John's own build-os correction, mitigations that live only in the risks section don't get implemented.

- **Suggestion**: move it into Task 2 as an explicit requirement — the sensor returns the literal string `"none"` for any unknown/unavailable/unparseable input and never `unknown`/`unavailable`. Add a verification step that exercises it (restart HA, confirm the sensor reads `none` rather than `unavailable`).

### 7. SHOULD FIX — The wake-up trigger only catches up one dose

With the corrected latest-due rule, if Nino sleeps through *both* doses (illness, long nap), the wake-up trigger resolves to dose 2 and dose 1 is never re-reminded — its only remaining surface is the dashboard card.

This is inherent to one sensor answering two different questions: the button asks "which dose am I responding to?" (wants most-recent) while the wake-up asks "what did I miss?" (wants earliest, or all).

- **Suggestion**: flag for John's call. Cheapest resolution is to accept it and document it — doses are hours apart and sleeping through both is rare. If he wants it covered, the wake-up branch iterates all overdue doses rather than reading the sensor, which is a modest addition to Task 3.

### 8. SHOULD FIX — Task 10's orphan cleanup is incomplete

It lists the three `nino_daily_medication_*` helpers. `automation.nino_daily_medication_reminder` is also renamed (Task 6 renames the file; the automation `id` changes with it) and will linger in the registry too.

- **Suggestion**: add the automation entity to Task 10.

### 9. SHOULD FIX — Consumer verification is repo-only and cannot see UI-created config

I independently verified the plan's "only 3 files" claim across `packages/`, `automation/`, `automations.yaml`, `scripts/`, `scripts.yaml`, `sensors/`, `binary_sensors/`, `input_boolean/`, `input_select/`, and `dashboards/`. **The claim holds** — `dashboards/templates/button_cards/people/nino.yaml`, `dashboards/kohbo/shared/notifications/nino_med_reminder.yaml`, and the package itself.

But `.storage` is not in this repo, so UI-created automations, scenes, scripts, helpers, and any storage-mode dashboard config are invisible to every grep available here. `dashboards/CLAUDE.md` explicitly describes the Kohbo dashboard as loaded in storage mode, which makes this a live question rather than a theoretical one.

- **Suggestion**: add a pre-deploy step — check Settings → Devices & Services → Entities → each old entity → "Related", or have the `homelab` agent grep `.storage` on the Yellow. Cheap; closes the only blind spot in the impact analysis.

### 10. SHOULD FIX — Verification criteria are not bounded or specific

Task 11 is the plan's only quality gate and reads as a prose list ("fires at its configured time", "snoozes on no response"). No pass/fail thresholds, no stated method, and no coverage of the failure paths that concerns 2, 5, and 6 introduce.

- **Suggestion**: rewrite Task 11 as explicit ACs (see the AC table below).

---

## AC Validation Issues

| Task | Current AC | Issue | Suggested Fix |
|---|---|---|---|
| 11 | "fires at its configured time" | Not bounded — no method | "Set dose 2 to now+2min; push arrives within 60s; `sensor.nino_medication_pending_dose` reads `2`" |
| 11 | "snoozes on no response and re-fires 15 minutes later" | Untestable as written (15-min wait) | "Ignore the push; confirm `timer.nino_medication_2_timer` goes `active` with 15:00 remaining; confirm re-fire on `timer.finished`" |
| 11 | "ZHA button marks the pending dose" | Doesn't cover the Concern 2 case | "With dose 1 snoozing AND dose 2 prompting, the button marks **dose 2**" |
| 11 | "a dose scheduled while he's asleep fires ~5 min after he wakes" | "~5 min" unbounded | "Set sleep state to Sleep, set dose time to now-5min, set to Awake; reminder fires 5–6 min later and not before" |
| 2 | *(none — availability is only in Risks)* | Missing entirely | "Sensor returns `none` (never `unknown`/`unavailable`) when input_datetimes are unavailable; verified by restarting HA" |
| 1 | *(none)* | No migration AC | "Dose 1 time after deploy equals the pre-migration value of `input_datetime.nino_daily_medication_time`" |
| 9 | "`ha core check`" | Good — keep | Add: "no `Invalid config` or template-render warnings for the medication package in the HA log after reload" |

## Test Coverage Gaps

This repo has no automated test harness — verification is manual, which raises rather than lowers the bar on AC specificity. Beyond the table above, three paths have no verification step at all:

- **Task 4** rewrites `script.nino_medication_taken` with a fallback and a no-op branch. Nothing tests calling it with no `dose` while nothing is pending — it must do nothing rather than error or mark dose 1.
- **Task 5** changes the 3am reset to clear both doses. Nothing verifies it; the window is easy to test by triggering the automation manually.
- **Task 8** adds template conditions to the notification cards. Nothing verifies dose 2's card is absent before its scheduled time — the specific improvement the task claims.

---

## Strengths

- **The three problems in the Problem section are real and correctly diagnosed.** I verified the `trigger.id` bug independently; the analysis is exactly right, including the subtle part — that it only *appears* to work because the shortcut automation catches the same button press and then races the parent's snooze branch.
- **Rejecting the Cristina copy-paste pattern is the right call**, and the plan says why rather than just asserting it.
- **Waiting on the taken-boolean instead of the device is genuinely better design** — it dissolves a class of bug instead of patching one instance. The mechanism needs fixing (Concern 1), the idea does not.
- **Numbered doses over morning/evening** is correctly justified by configurability, and turns out to matter more than the plan realized: it's what makes the corrected latest-due resolver robust to out-of-order times.
- **Out of Scope is explicit and correctly scoped** — the unbounded snooze loop is properly identified as pre-existing, and Cristina's package is named as a separate change rather than quietly bundled.
- One thing the plan gets right by omission, worth stating so a builder doesn't "helpfully" add it: `CLAUDE.md`'s quality standard says automations affecting sound must check `input_boolean.speech_notifications`. **Do not add it as an automation condition** — `script.voice_announcement` already checks it internally (`packages/announcements/voice_announcement.yaml:316`), and a condition at the automation level would block the *push* notification too, which is the opposite of what's wanted.

---

## Devil's Advocate

**If this fails, it will be because the resolver marks the wrong dose.**
Concern 1 fails loudly at `ha core check`. Concerns 3–6 fail visibly or degrade obviously. Concern 2 fails *silently and plausibly* — the button gets pressed, a checkbox turns green, the notification clears, and nothing anywhere indicates the wrong dose was recorded. The system's entire correctness claim reduces to a single template's ordering rule, exercised at the one moment its primary signal is unavailable. That template deserves the most scrutiny in the build and the most explicit AC.

**The worst outcome would be a dose that is never reminded and never noticed.**
Three independent paths currently lead there: the resolver clearing the wrong dose's state (Concern 2), a dropped parallel run with `max_exceeded: silent` (Concern 4), and the pending-dose sensor going `unavailable` on a template error and taking the button and wake-up deferral with it (Concern 6). Each is individually unlikely; all three are silent; and the subject is a child's medication.

That pattern — several low-probability, zero-observability failures converging on one high-stakes outcome — is the argument for a safety net the plan doesn't have. **Recommend adding**: a check some fixed interval after each dose time (say 2 hours) that escalates to a `critical` push if the dose is still untaken. It's roughly 20 lines, it's independent of every mechanism above, and it converts the worst case from "nobody finds out" to "someone finds out late." This is a stronger candidate for scope than several items currently in the plan, and I'd argue it belongs in this change rather than the backlog.

---

## Verdict

- [ ] Approve
- [ ] Approve with suggestions
- [ ] Approve pending pre-mortem
- [x] **Revise**

Four must-fixes, one of which (Concern 1) would fail `ha core check` on first build and one of which (Concern 2) would ship a silent wrong-dose bug. The plan's structure, decisions, and problem analysis are sound — this is a revision of specific mechanisms, not a rethink.

Complexity is **Large** (11 tasks, 6 files, entity rename with data migration), so once revised this is `Approve pending pre-mortem` — a pre-mortem is required before `/approve`, not optional.

---

## Suggested Changes

**Change 1 — Trigger mechanism** *(Task 3)*
- **What's wrong**: state-trigger `entity_id` is not templatable; `input_boolean.nino_medication_{{ dose }}_taken` fails schema validation at config load.
- **What to do**: use `trigger: template` with `value_template: "{{ is_state(taken_boolean, 'on') }}"` inside `wait_for_trigger`. Note in the task that event and template triggers render against script variables but state triggers do not — with `nino_daily_medication_reminder.yaml:129` cited as the working precedent.
- **Where**: `plans/nino-two-dose-medication/plan.md`, Task 3 and the "Wait on the taken-boolean" paragraph in Approach.

**Change 2 — Resolver rule** *(Task 2, Approach)*
- **What's wrong**: "prefer active timer, else earliest due" selects the wrong dose whenever one dose is snoozing and another is mid-prompt, because the prompting dose's timer is idle.
- **What to do**: change to "among untaken doses whose scheduled time has passed today, return the one with the latest scheduled time; else `none`". Drop the active-timer clause. Use `today_at()`. Add the 07:30-snoozing / 19:00-prompting walkthrough to the plan so the builder implements against the case that motivated it.
- **Where**: Approach ("A pending-dose template sensor…") and Task 2.

**Change 3 — Time migration** *(Task 1)*
- **What's wrong**: no capture of the live `input_datetime.nino_daily_medication_time` value; `initial: "07:30:00"` silently overrides John's actual setting.
- **What to do**: add a pre-deploy capture step and set dose 1's `initial:` to the captured value. Add the matching AC.
- **Where**: Task 1, plus a new AC in Task 11.

**Change 4 — Parallel-run observability** *(Task 3)*
- **What's wrong**: `max: 2` with `max_exceeded: silent` can drop a reminder with no trace.
- **What to do**: `max: 4`, remove `max_exceeded: silent` (default `warning`).
- **Where**: Task 3.

**Change 5 — Idempotent snooze guard** *(Task 3)*
- **What's wrong**: a taken-boolean flip between condition evaluation and wait attachment leaves the template trigger already-true, so the wait times out and snoozes an already-taken dose.
- **What to do**: guard every `timer.start` with `is_state(taken_boolean, 'off')`.
- **Where**: Task 3.

**Change 6 — Sensor availability contract** *(Task 2)*
- **What's wrong**: availability requirement lives only in Risks, where it won't get implemented.
- **What to do**: promote to an explicit Task 2 requirement plus a restart-based verification step.
- **Where**: Task 2 and Task 11.

**Change 7 — Cleanup and blind-spot closure** *(Tasks 9, 10)*
- **What to do**: add `automation.nino_daily_medication_reminder` to the orphan cleanup list; add a pre-deploy live check of the old entities' "Related" panel (or a `homelab` grep of `.storage` on the Yellow) to cover UI-created config this repo cannot see.
- **Where**: Tasks 9 and 10.

**Change 8 — Verification rewrite** *(Task 11)*
- **What to do**: replace the prose list with the bounded ACs in the AC table above, adding coverage for the script's no-pending no-op, the 3am both-dose reset, and dose 2's card being hidden before its time.
- **Where**: Task 11.

**Change 9 — Escalation safety net** *(new task, for John's decision)*
- **What to do**: decide whether to add a per-dose late check (e.g. 2 hours past the scheduled time, still untaken → `critical` push). Recommended in scope; see Devil's Advocate.
- **Where**: new task, or move the related note out of Out of Scope.

**Open question for John** *(Concern 7)*: if Nino sleeps through both doses, the wake-up trigger only catches the later one. Accept and document, or have the wake-up branch handle all overdue doses?
