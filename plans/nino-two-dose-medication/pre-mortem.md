---
title: Pre-Mortem — Nino Two-Dose Medication Reminder
slug: nino-two-dose-medication
type: pre-mortem
created: 2026-08-18
critical_risks: 2
---

## Pre-Mortem: Nino Two-Dose Medication Reminder

**Expertise profiles**: none exist — no `PROFILE.md` in this repo, no `~/.claude/build/expertise/` directory, no `LEARNINGS.md` anywhere. Risk analysis draws on `CLAUDE.md`, `packages/CLAUDE.md`, `dashboards/CLAUDE.md`, and direct source reading.

**Framing**: the failure that matters here is not an automation that errors — it is a dose silently not given, or given twice. Risks below are ranked by (likelihood × blast radius), with CRITICAL reserved for paths that produce a wrong dosing outcome **with no visible signal**.

---

### Risk 1: The entire reminder system — including the safety net — can be silently muted by an unrelated toggle — **CRITICAL**

**Problem**: Every push in this design routes through `script.general_notification`, which hard-gates on `input_select.notification_level` at `packages/general_notifications.yaml:206-207`:

```yaml
- condition: template
  value_template: "{{ states.input_select.notification_level.state != 'None' }}"
```

When that select is `None`, the script exits silently — no push, no log, no error. The reminder automation's `wait_for_trigger` then sits for its full 15 minutes waiting for a response to a notification **that was never sent**, times out, snoozes, and repeats until the 3am reset. From the outside: no notifications, a boolean that never turns green, and nothing anywhere indicating why.

Worse, Task 7's escalation — the safety net whose entire job is to fire when the rest of the machinery has failed quietly — routes through the same script and is muted by the same toggle. **The backup shares a single point of failure with the thing it backs up.** A safety net that fails under the same conditions as the primary is not a safety net.

`None` is only set manually (the `notifications_activate_important_only` automation at `general_notifications.yaml:252-280` sets `Important`, never `None`), and `Important` does pass `critical` priority through. But "only reachable by hand" is not reassurance for a toggle that lives in a settings UI, and this failure mode exists in production **today** for the single-dose reminder.

**Mitigation**: Task 7's escalation must **bypass `script.general_notification` entirely** and call `notify.ios_family` directly. There is ample precedent in this repo for safety-critical alerts doing exactly this — including one for this same child (`packages/ninos_room/nino_escaping/nino_escape_monitor.yaml:81`), the front-door fingerprint unlock (`packages/security/security_unlock_front_door_by_fingerprint.yaml:44`), and Cristina's own medication reminder (`packages/people/cristina/medication_reminder/cristina_friday_medication_reminder.yaml:71`). Use `push.interruption-level: critical` in the raw payload.

Leave the *primary* reminder on `script.general_notification` — routing normal reminders through the house's notification policy is correct. It is only the backstop that must be unmutable.

**Verification**: grep Task 7's implementation for `general_notification` — it must not appear. Then set `input_select.notification_level` to `None`, leave a dose untaken past its escalation window, and confirm the critical push still arrives.

---

### Risk 2: An HA restart during the 15-minute wait silently loses the dose — **CRITICAL**

**Problem**: The snooze timer is started *after* `wait_for_trigger` times out (this is the existing structure at `packages/people/nino/medication_reminder/nino_daily_medication_reminder.yaml:152-157`, which the plan preserves). During the wait itself, no timer is running and nothing persistent records that a dose is in flight.

If HA restarts, reloads, or the automation is reloaded during that 15-minute window — a `homeassistant.reload_all`, a HACS update, a power blip, an OS update on the Yellow — the run is killed mid-wait. There is no timer to fire, the boolean is still `off`, and **nothing re-triggers**. The `time` trigger already fired. The `timer.finished` trigger has no timer. The wake-up trigger only fires on an `Awake` transition, which won't happen if he's already awake.

The dose is silently dropped. This is precisely the class of failure the whole redesign exists to eliminate, reintroduced through a different door — and the plan's Risks section doesn't mention restarts at all.

Reload frequency makes this more than theoretical: the plan's own Task 11 calls `homeassistant.reload_all`, and any future config change to this repo does the same.

**Mitigation**: **Start the snooze timer when the reminder is sent, not when the wait times out.** Restructure to:

1. Prompt (voice + push)
2. `timer.start` on the dose's timer immediately
3. `wait_for_trigger` as before
4. On "taken" → `timer.cancel` (already done by `script.nino_medication_taken`)
5. On timeout → do nothing; the already-running timer fires `timer.finished` and re-triggers the automation

This makes the reminder **restart-durable**: timers are `restore: true`, so a timer surviving a restart still fires `timer.finished` and re-prompts. It also simplifies the timeout branch to a no-op and makes the "timer is idle" condition a genuine in-flight guard rather than an approximation.

Consequence to handle: the "timer idle" condition now excludes a dose that is mid-prompt, which is correct — but the resolver must then account for it. See Risk 4's refined rule, which does.

**Verification**: prompt a dose, then restart HA during the 15-minute window (`ha core restart`). Confirm the timer survives, `timer.finished` fires, and the reminder re-prompts. This is the single most important post-deploy test.

---

### Risk 3: Task 7 is the most under-specified task in the plan, and it is the safety net — **HIGH**

**Problem**: Task 7 says "at a fixed interval past each dose's scheduled time (2 hours), if that dose is still untaken, send a `critical`-priority push." It does not say **how to trigger**, and there is no obvious right answer — you cannot do arithmetic on an `input_datetime` inside a `time` trigger's `at:`. A build subagent has at least three plausible implementations:

- `trigger: time_pattern` every N minutes + a template condition (works; slightly chatty)
- `trigger: template` on a `now() >= dose_time + 2h` expression (works; re-evaluates each minute)
- `trigger: time, at: input_datetime...` with an offset (**does not exist** — `at:` takes no offset for entity-based time triggers; this would fail `ha core check` or silently misbehave)

An under-specified safety net is worse than a well-specified ordinary feature, because nobody exercises it in normal operation — a broken one looks identical to a working one until the day it's needed.

**Mitigation**: specify the trigger mechanism explicitly in the PRD. Recommend `trigger: template` with an explicit guard, mirroring the resolver's own time handling (`today_at()`), and mandate one file per the repo's one-automation-one-job convention. Give the subagent the exact trigger block rather than prose.

**Verification**: Task 13 criterion 14 already covers the happy path. Add: confirm the automation appears in Developer Tools → Automations with a valid `last_triggered` after a deliberate test, rather than existing-but-never-firing.

---

### Risk 4: The resolver template is the correctness core and is specified in prose, not code — **HIGH**

**Problem**: `sensor.nino_medication_pending_dose` decides which dose the ZHA button marks and which dose the wake-up trigger catches up. Task 3 describes it in a sentence. Three behaviors are undefined, and each produces a wrong-dose outcome:

- **Tie**: both doses configured to the same time, both untaken and passed. "The latest scheduled time" has two answers. A Jinja `max()` over a list of tuples resolves ambiguously depending on how it's written.
- **Dose in flight but time changed**: dose 2 snoozing since 19:00, user moves dose 2 to 21:00 at 20:00. Dose 2's time has no longer "passed", so it drops out of the candidate set and the resolver returns dose 1 — while dose 2's timer is actively running. The button then marks the wrong dose.
- **Non-numeric / unavailable inputs**: covered by Task 3's availability requirement, but only if that requirement is actually implemented as stated.

**Mitigation**: refine the rule to make "in play" explicit, and hand the builder the semantics rather than the prose:

> A dose is **in play** if it is untaken AND (its scheduled time has passed today OR its snooze timer is active).
> Among in-play doses, return the one with the **latest scheduled time**.
> Tie → the higher dose number.
> No in-play doses, or any unavailable input → `"none"`.

This is a strict improvement, not a reversal of the review's fix. The review's correction was to stop letting *timer-active* take **priority** over scheduled time; this keeps latest-scheduled-time as the sole ordering and uses timer-active only to widen membership. Re-checking the review's motivating case — dose 1 snoozing since 07:30, dose 2 prompting at 19:00 — both are in play, latest time is 19:00, resolver returns `2`. Still correct. And with Risk 2's fix (timer starts at prompt), timer-active membership becomes the mechanism that keeps a mid-prompt dose in play.

**Verification**: Task 13 criterion 6 covers the primary case. Add explicit checks for the tie case and the time-changed-mid-snooze case.

---

### Risk 5: Orphan cleanup (Task 12) runs before verification (Task 13) — **HIGH**

**Problem**: The plan's task order deletes the old entity registry entries immediately after deploy, then verifies. That destroys the migration's evidence trail before confirming the replacement works. If Task 1's capture of `input_datetime.nino_daily_medication_time` was mis-read or skipped, the deleted entity's restored state was the only remaining record of Nino's real reminder time — and `.storage/core.restore_state` is where it lives, not git.

**Mitigation**: reorder — verify first, clean up last. Task 12 should be gated on Task 13's criteria passing, and specifically on **at least one full day covering both doses** running correctly. Nothing about the orphaned entities is urgent; they are cosmetic registry clutter.

**Verification**: build-log records Task 13 complete before Task 12 begins.

---

### Risk 6: The load-bearing trigger mechanism is novel in this repo and cannot be validated locally — **HIGH**

**Problem**: The plan's central mechanism is a `template` trigger inside `wait_for_trigger` reading an automation-level variable (`taken_boolean`). I grepped all 13 `wait_for_trigger` uses in `packages/` — **there is no existing template-trigger-inside-wait_for_trigger anywhere in this repo**. It is a novel pattern here, it depends on HA passing enclosing-script variables into trigger initialization, and `ha core check` does not run on this dev machine, so the build cannot validate it.

The reasoning that it works is sound (the same variable-passing is what makes `action: "{{ action_taken }}"` work at `nino_daily_medication_reminder.yaml:129` today), but "sound reasoning, unverifiable locally, no precedent, child's medication" is the exact profile that deserves a fallback rather than confidence.

**Mitigation**: two parts.

1. **Keep the degradation path intact.** If the template trigger silently never fires, the push `action_taken` event trigger still completes the wait, and the ZHA button still marks the dose via the shortcut automation. The failure then shows up only as a spurious snooze — *provided* the Task 4 snooze guard (`is_state(taken_boolean, 'off')` before every `timer.start`) is present. **That guard is load-bearing for this risk, not a nicety.** It must not be dropped or "simplified away" during build or review.
2. **Test this mechanism first** after deploy, before trusting anything else: press the ZHA button during an open wait window and confirm the wait completes rather than timing out.

**Verification**: grep the built automation for the snooze guard on every `timer.start`. Post-deploy, exercise the button-during-wait path explicitly.

---

### Risk 7: A schema-invalid config reaches the Yellow and leaves a half-migrated system — **MEDIUM**

**Problem**: `./deploy.sh` pulls the whole repo. If the package is schema-invalid but the dashboard files are fine, `ha core check` fails, the reload doesn't apply the package, and the user is left with the **old** automation running against **old** entities while the **new** dashboards reference **new** entities that don't exist — broken cards plus a reminder system in an indeterminate state.

This is loud rather than silent, which is why it's MEDIUM, but it lands on a live house.

**Mitigation**: Task 11 already orders `ha core check` before reload. Make the failure path explicit: if the check fails, do not reload — `git revert`, re-push, re-deploy, and only then investigate. Add the rollback command sequence to the task so it isn't improvised at 11pm.

**Verification**: `ha core check` output captured in the build log before any reload is issued.

---

### Risk 8: Dose times inside the 00:00–03:00 window collide with the reset — **MEDIUM**

**Problem**: Nothing constrains the configurable times. A dose set between midnight and 03:00:01 would be prompted and then have its `taken` boolean wiped by the reset automation minutes later, re-arming it as untaken. DST compounds it: a dose configured at 02:30 does not exist on spring-forward day, so `today_at("02:30:00")` constructs an invalid local time.

Both require an implausible configuration, which is why this is MEDIUM and not higher. Verified as *not* a problem in the normal case: between the 03:00 reset and the first dose time, the resolver correctly returns `"none"` (neither dose's time has passed yet), so no spurious wake-up prompt occurs.

**Mitigation**: document the supported range (03:00–23:59) in the package header comment. Optionally clamp in the dashboard time pickers. Do not add runtime validation — not worth the complexity.

**Verification**: comment present; no code change required.

---

### Risk 9: A reviewer or subagent "fixes" the intentional multi-automation package file — **LOW**

**Problem**: `CLAUDE.md` states "One automation per file. Each automation lives in its own YAML file. The filename matches the automation ID." The medication package has always violated this (3 automations plus a script plus helpers in one file), matching the Cristina package's structure. A conscientious build or review subagent reading `CLAUDE.md` could split it into five files, producing large unrequested churn and new basename-collision surface under `!include_dir_named`.

**Mitigation**: state in the PRD that the consolidated package file is **intentional and matches the existing Cristina/Nino pattern**, and that only Task 7's escalation gets its own file.

**Verification**: diff shows one package file plus one escalation file — not a five-way split.

---

### Risk 10: Two live consumers exist that no repo grep can see — **MEDIUM** *(confirmed, not hypothetical)*

**Problem**: Risk analysis originally listed "UI-created config is invisible to this repo" as an unverified blind spot. The Task 1 live pull has now **confirmed two actual references** in `.storage` on the Yellow:

- **`lovelace.ui_test`** — a storage-mode dashboard ("UI Test", `url_path: ui-test`, visible in the sidebar) with an entities card bound to `input_boolean.nino_daily_medication_taken` and `timer.nino_daily_medication_timer`. Post-rename these rows render "entity not found". There is **no file to edit** — the fix is only reachable through the Lovelace UI editor.
- **`homeassistant.exposed_entities`** — `timer.nino_daily_medication_timer` is exposed to voice assistants (`cloud.google_assistant`). The rename silently orphans the exposure.

Neither breaks HA and neither is silent-dangerous, but both are permanent small breakages if nobody knows to fix them, and neither is in the plan.

**Mitigation**: add two manual post-deploy steps to the plan, sequenced with Task 12's cleanup: repoint or remove the two rows in the "UI Test" dashboard, and re-expose the new timer entity under Settings → Voice Assistants → Expose.

**Verification**: load `/ui-test` after deploy and confirm no "entity not found" rows; confirm the new timer appears in the Assist exposure list.

---

### Risk 11: `./deploy.sh` may silently no-op — **MEDIUM** *(confirmed)*

**Problem**: The live pull confirmed the host's git HEAD (`e6dab15`) has diverged from local (`28b243c`) — the exact condition described in the `reference_deploy_and_host_topology` memory, where a diverged host with no branch tracking makes `deploy.sh` pull nothing and exit successfully. The migration would then appear deployed while the Yellow still runs the old config, and every subsequent verification step would be testing the old system.

The three files relevant to this migration are currently byte-identical between host and local, so nothing is *wrong* today — but that also means a no-op deploy would be indistinguishable from a successful one right up until the verification steps started failing confusingly.

**Mitigation**: Task 11 must confirm the deploy actually landed — check the host's git HEAD matches the merged commit, and confirm `nino_medication_reminder.yaml` exists on the host with expected content — **before** issuing the reload. Exit code 0 from `deploy.sh` is not evidence.

**Verification**: build log records the host HEAD SHA post-deploy, matching the merge commit.

---

## Summary

**Total risks identified**: 11
**Categories**: environment/config, rollback safety, dependency ordering, scope drift, integration risk, backward compatibility, context gaps

**CRITICAL (must address before proceeding)**:
1. **Notification-level toggle can silently mute everything, safety net included** → Task 7 must bypass `script.general_notification` and call `notify.ios_family` directly.
2. **HA restart mid-wait silently loses a dose** → start the snooze timer at prompt time, not at wait timeout.

**HIGH**: Task 7 trigger mechanism under-specified · resolver semantics need explicit in-play/tie rules · Task 12/13 ordering inverted · novel template-trigger mechanism needs its degradation path protected

**Confirmed by live pull (Risks 10, 11)**: two out-of-repo consumers (`lovelace.ui_test` dashboard, Assist exposure) need manual post-deploy fixes · `deploy.sh` may silently no-op against the diverged host

**Also corrected by the live pull**: dose 1's `initial:` must be **`"08:00:00"`** — the plan's placeholder `07:30:00` was wrong and would have moved Nino's reminder 30 minutes earlier with nothing to catch it.

Both CRITICAL findings share a shape worth naming: the plan's safety properties depend on machinery that is itself subject to the failures it's meant to catch. The fixes are cheap — one changes which notify service the backstop calls, the other moves a `timer.start` earlier in the sequence — but neither is discoverable from the plan as written.

**Ready to proceed with these mitigations?**
