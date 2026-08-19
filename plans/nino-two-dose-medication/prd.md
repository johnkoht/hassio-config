# PRD: Nino Two-Dose Medication Reminder

**Slug**: `nino-two-dose-medication`
**Plan**: `plans/nino-two-dose-medication/plan.md`
**Pre-mortem**: `plans/nino-two-dose-medication/pre-mortem.md` (11 risks, 2 CRITICAL)
**Review**: `plans/nino-two-dose-medication/review.md`
**Live environment capture**: `plans/nino-two-dose-medication/build-log.md`

**Expertise profiles**: none exist for this repo (no `PROFILE.md`, no `LEARNINGS.md`, no `~/.claude/build/expertise/`).

---

## Goal

Convert Nino's single-dose medication reminder into two independently configurable doses, driven by one dose-aware automation, with an unmutable escalation backstop and restart-durable snooze behavior.

---

## ⚠️ Read This Before Writing Any YAML

### This build CANNOT validate its own output

`ha core check` is the real validation gate and **it does not exist on this machine**. It runs on the Home Assistant Yellow at `192.168.1.36`, which the build has no access to.

You **may** check that YAML parses:
```bash
python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" <file>
```

That is **lexical parsing only**. It is *not* HA schema validation. Home Assistant applies its own voluptuous schemas on top, and they reject things `yaml.safe_load` accepts happily. The review already caught exactly such a bug in an earlier draft of this plan: a templated `entity_id` inside a state trigger parses fine as YAML and fails `cv.entity_ids_or_uuids` at HA config load.

**Never write an acceptance-criteria claim of the form "config is valid".** The only honest claim is "YAML parses; HA schema validation deferred to post-merge `ha core check`."

### Verified HA facts (from `review.md`, confirmed against HA 2026.7.4 on the live host)

| Fact | Status |
|---|---|
| Automation-level `variables:` render before `conditions:` and are usable there | ✅ Precedent: `packages/alexa_actionable_notifications.yaml:50-53` |
| `trigger.id` available in that variables block; defaults to trigger **index as string** when unset | ✅ |
| `time` trigger accepts an `input_datetime` entity in `at:` | ✅ In production at `nino_daily_medication_reminder.yaml:52` |
| Inside `wait_for_trigger`, the fired trigger is `wait.trigger`, NOT `trigger` | ✅ Current code's `trigger.id == 'button_action'` is a real bug — always false |
| Templates in service-call `target: entity_id:` | ✅ Precedent: `alexa_actionable_notifications.yaml:40` |
| Templated `entity_id` in a **state trigger** | ❌ **FAILS** — `cv.entity_ids_or_uuids`, validated at config load |
| Template sensor containing `now()` re-renders each minute | ✅ |
| `today_at()` | ✅ Precedent: `packages/mudroom/garage_entry_door/garage_entry_door_auto_lock.yaml:78` |

### Anti-patterns — do NOT do these

1. **Do NOT split the consolidated package file** into one-automation-per-file. `CLAUDE.md` says one automation per file, but this package has always held several automations plus a script plus helpers, matching `packages/people/cristina/medication_reminder/`. Only the escalation (task-3) gets its own file. Splitting would create large unrequested churn and new `!include_dir_named` basename-collision surface.
2. **Do NOT add `input_boolean.speech_notifications` as an automation condition.** `script.voice_announcement` already checks it internally at `packages/announcements/voice_announcement.yaml:316`. Adding it at the automation level would also block the *push*, which is the opposite of the intent.
3. **Do NOT reintroduce `automation.turn_off` self-disabling.** Removing it is a core objective — it is what would silence dose 2 after dose 1 is taken.
4. **Do NOT edit anything under `.claude/worktrees/agent-abfe261fbe1851572/`.** Stale duplicate of the whole repo; edits there do nothing.
5. **Do NOT use `max_exceeded: silent`.** A silently dropped run is a silently missed dose.

### Execution constraint

Tasks 1 and 2 both rewrite `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`. **Run strictly sequentially.** Never dispatch parallel subagents against that file.

---

## Task 1: Package helpers + pending-dose resolver sensor

**File**: `packages/people/nino/medication_reminder/nino_daily_medication_reminder.yaml` (renamed in task-2)

**Read first**:
- `packages/people/nino/medication_reminder/nino_daily_medication_reminder.yaml` — the file being rewritten
- `packages/leak_monitoring.yaml`, `packages/outdoor_lighting.yaml` — precedent for `template:` inside a package
- `packages/mudroom/garage_entry_door/garage_entry_door_auto_lock.yaml:78` — `today_at()` usage
- `packages/CLAUDE.md` — conventions

**Description**: Replace the three single-dose helpers with paired per-dose helpers, and add the resolver template sensor. This is the declarative layer; task-2 adds the logic that consumes it.

Helpers to define:
- `input_boolean.nino_medication_1_taken` / `nino_medication_2_taken`
- `input_boolean.nino_medication_1_escalated` / `nino_medication_2_escalated` (task-3's once-per-day guard)
- `timer.nino_medication_1_timer` / `nino_medication_2_timer` — 15 min, **`restore: true`**
- `input_datetime.nino_medication_1_time` — `has_date: false`, `has_time: true`, **`initial: "07:00:00"`**
- `input_datetime.nino_medication_2_time` — same shape, `initial: "19:00:00"`

**Resolver semantics** — `sensor.nino_medication_pending_dose`, exactly this rule:

> A dose is **in play** if it is untaken AND (its scheduled time has passed today OR its snooze timer is `active`).
> Among in-play doses, return the one with the **latest scheduled time**.
> Tie → the **higher dose number**.
> No in-play doses, or any unavailable input → `"none"`.

**Embedded mitigations**:
- ⚠️ **Dose 1 `initial:` MUST be `"07:00:00"`.** Not `08:00:00` (that's the captured pre-migration value, recorded for rollback only). Not `07:30:00` (a superseded earlier draft). John changed it to 07:00 deliberately.
- ⚠️ **`restore: true` on both timers is load-bearing**, not cosmetic — it is what makes task-2's restart-durability fix work.
- ⚠️ **The sensor must never go `unknown`/`unavailable`.** `input_datetime` entities read `unknown` during HA startup, and an unguarded `today_at(states('input_datetime.…'))` raises. If this sensor breaks, the ZHA button and the wake-up deferral both stop working with no visible error. Guard every input; return the literal string `"none"` on anything unexpected.
- ⚠️ Order by **latest scheduled time**, never by timer-active. Timer-active only widens membership. Ordering by timer priority is a real bug the review caught: with dose 1 snoozing since 07:00 and dose 2 prompting at 19:00, timer-priority marks the wrong dose.

**Acceptance criteria**:
1. All 8 helper entities defined with the exact IDs listed above
2. `input_datetime.nino_medication_1_time` has `initial: "07:00:00"`; `_2_time` has `initial: "19:00:00"`
3. Both timers have `duration: "00:15:00"` and `restore: true`
4. `sensor.nino_medication_pending_dose` implements in-play / latest-time / higher-number-tiebreak
5. The sensor's template has an explicit fallback returning the literal string `"none"`, reachable when either `input_datetime` is `unknown`/`unavailable`
6. The sensor uses `today_at()` for time comparison
7. No reference to any `nino_daily_medication_*` entity remains in the file
8. YAML parses via `python3 -c "import yaml..."` — *HA schema validation deferred to post-merge `ha core check`*
9. File header comment block present, matching repo style

---

## Task 2: Dose-aware reminder automation, script, reset, button, and file rename

**File**: `packages/people/nino/medication_reminder/nino_medication_reminder.yaml` (renamed from `nino_daily_medication_reminder.yaml`)

**Read first**:
- The file as left by task-1
- `packages/alexa_actionable_notifications.yaml:40,50-53` — automation-level `variables:` with `trigger.*`, templated `target: entity_id:`
- `packages/general_notifications.yaml` — `script.general_notification` field contract
- `packages/announcements/voice_announcement.yaml` — `script.voice_announcement` contract
- `plans/nino-two-dose-medication/review.md` — the verified-claims table
- `CLAUDE.md` — modern syntax requirements

**Description**: Rewrite the three automations and the script as dose-aware, and rename the file. Automation id becomes `nino_medication_reminder` (alias "Nino Medication Reminder"). The reset and shortcut automations keep their existing ids — `nino_medication_reminder_reset` and `nino_medication_reminder_shortcut_button` — both confirmed registered on the live host, so keeping them avoids new orphans.

**Reminder automation structure**:

Triggers (5): `time` on each datetime (ids `"1"`, `"2"`) · `event` on `timer.finished` for each timer (ids `"1"`, `"2"`) · `state` on `input_select.nino_sleep_state` → `"Awake"`, `for: minutes: 5` (id `"awake"`).

Automation-level `variables:`: resolve `dose` from `trigger.id`, or from `sensor.nino_medication_pending_dose` when `trigger.id == 'awake'`; then derive `taken_boolean`, `snooze_timer`, `dose_time`, and a per-dose `tag`.

Conditions: `dose` in `["1","2"]` · dose untaken · dose's timer `idle` · `input_select.nino_sleep_state == "Awake"`.

Action sequence — **the ordering here is the CRITICAL 2 fix**:
1. `script.voice_announcement` — dose-neutral wording (not "morning")
2. **`timer.start` on the dose's timer** ← before the wait
3. `script.general_notification`, per-dose tag `nino-medication-dose-{{ dose }}`, actions Taken / Snooze
4. `wait_for_trigger`, 15-min timeout, three triggers:
   - `trigger: template`, `value_template: "{{ is_state(taken_boolean, 'on') }}"`, id `taken`
   - `trigger: event` on push `action_taken`, id `taken_push`
   - `trigger: event` on push `action_snooze`, id `snooze`
5. Branch on `wait.trigger.id`: `taken`/`taken_push` → `script.nino_medication_taken` with the dose · `snooze` → `timer.start` (restart full 15 min) · **timeout (`not wait.completed`) → no-op**

**Embedded mitigations**:
- ⚠️ **CRITICAL 2 — `timer.start` goes BEFORE `wait_for_trigger`, not after.** In the current code the timer starts only on timeout (`nino_daily_medication_reminder.yaml:152-157`), so during the 15-minute wait nothing persistent records a dose in flight. Any restart or reload in that window kills the run and the dose vanishes silently — the `time` trigger already fired, there's no timer to fire `timer.finished`, and the wake-up trigger needs an `Awake` *transition*. Starting the timer at prompt time makes it restart-durable (timers are `restore: true`).
- ⚠️ **The wait's "taken" trigger MUST be `trigger: template`, not `trigger: state`.** A state trigger's `entity_id` cannot be templated — `cv.entity_ids_or_uuids` rejects it at config load. This pattern has **no precedent in this repo** (all 13 `wait_for_trigger` uses checked); the closest proof is `action: "{{ action_taken }}"` at line 129, which shows *event* triggers render templates against enclosing variables.
- ⚠️ **Guard EVERY `timer.start` with `is_state(taken_boolean, 'off')`.** Load-bearing for three separate failure modes: the template trigger silently not firing (degrades to a spurious snooze instead of worse), a boolean flip between condition check and wait attach, and duplicate parallel runs. Do not simplify this away.
- ⚠️ **`mode: parallel`, `max: 4`. Do NOT set `max_exceeded: silent`** — leave the default `warning`.
- ⚠️ Use `wait.trigger.id`, never `trigger.id`, when branching after the wait.
- ⚠️ `script.nino_medication_taken` must **not** call `automation.turn_off`.
- ⚠️ Reset must clear **both** taken booleans, **both** escalated booleans, and cancel **both** timers — and must no longer call `automation.turn_on`.

**Acceptance criteria**:
1. File renamed to `nino_medication_reminder.yaml`; no file named `nino_daily_medication_reminder.yaml` remains
2. Reminder automation has all 5 triggers with the specified ids
3. `timer.start` appears **before** `wait_for_trigger` in the action sequence
4. The wait's taken-trigger is `trigger: template` with `value_template` referencing `taken_boolean` — **no `trigger: state` with a templated `entity_id` anywhere in the file**
5. Every `timer.start` in the file is guarded by a check that the dose's taken boolean is `off`
6. `mode: parallel` with `max: 4`; the string `max_exceeded` does not appear
7. Post-wait branching uses `wait.trigger.id`; the file contains no `trigger.id ==` comparison
8. The string `automation.turn_off` does not appear in the file
9. Reset automation clears 2 taken booleans + 2 escalated booleans + cancels 2 timers, and contains no `automation.turn_on`
10. Shortcut button automation retains device id `d98b081e7991a6e9ce1672128dad93ae` and calls the script with no `dose` argument
11. `script.nino_medication_taken` accepts an optional `dose`, falls back to the sensor, and no-ops when neither resolves
12. Reset and shortcut automation ids unchanged (`nino_medication_reminder_reset`, `nino_medication_reminder_shortcut_button`); reminder automation id is `nino_medication_reminder`
13. Modern syntax only — no bare `trigger:`, `condition:`, `action:` (singular, as a top-level automation key), or root-level `entity_id:` in actions
14. YAML parses — *HA schema validation deferred to post-merge `ha core check`*

---

## Task 3: Late-dose escalation (unmutable backstop)

**File**: `packages/people/nino/medication_reminder/nino_medication_escalation.yaml` (new)

**Read first**:
- `packages/general_notifications.yaml:206-227` — **the mute gate this task must bypass**
- `packages/ninos_room/nino_escaping/nino_escape_monitor.yaml:81` — direct-notify precedent, also for Nino
- `packages/people/cristina/medication_reminder/cristina_friday_medication_reminder.yaml:71-83` — direct notify with `interruption-level`
- The file as left by task-2 (for entity IDs)

**Description**: A backstop that fires when everything else has failed quietly. Deliberately dumb and independent of the resolver, the parallel-run limit, and the notification policy.

- **Trigger**: `time_pattern`, every 15 minutes.
- **Per-dose condition**: dose untaken AND `now() >= today_at(dose_time) + timedelta(hours=2)` AND that dose's `_escalated` boolean is `off`.
- **Action**: call `notify.ios_family` **directly** with `data.push.interruption-level: critical`, then turn on that dose's `_escalated` boolean.

**Embedded mitigations**:
- ⚠️ **CRITICAL 1 — MUST NOT route through `script.general_notification`.** That script hard-gates on `input_select.notification_level` at `packages/general_notifications.yaml:206-207`: when the select is `None` it exits silently, sending nothing and logging nothing. A backstop that shares a mute switch with the system it backs up is not a backstop. Call `notify.ios_family` directly.
- ⚠️ **Use `time_pattern`, NOT a template trigger.** A template trigger that is already true when HA starts never fires — so a restart during the escalation window would disable the net precisely when a restart caused the problem. `time_pattern` polls and is restart-proof.
- ⚠️ The `_escalated` booleans prevent a critical push every 15 minutes; they are cleared by task-2's 3am reset.
- ⚠️ Own file, per one-automation-one-job. This is the one place that convention applies here.

**Acceptance criteria**:
1. New file `nino_medication_escalation.yaml` exists in the medication_reminder package dir
2. Trigger is `time_pattern` — the file contains no `trigger: template` and no `trigger: time`
3. The string `general_notification` does **not** appear anywhere in the file
4. Notification is a direct `notify.ios_family` call with `interruption-level: critical`
5. Conditions check: dose untaken, `now()` past `dose_time + 2h` (via `today_at()`), and `_escalated` is off
6. Both doses covered
7. The dose's `_escalated` boolean is turned on after notifying
8. YAML parses — *HA schema validation deferred to post-merge `ha core check`*

---

## Task 4: Person popup dashboard

**File**: `dashboards/templates/button_cards/people/nino.yaml`

**Read first**: that file (Medications section, lines ~75-123) · `dashboards/CLAUDE.md` · the package file as left by task-2, for exact entity IDs

**Description**: Expand the Medications section from one dose to two — two boolean rows ("Dose 1" / "Dose 2"), two timer rows, and both datetime pickers ("First dose at" / "Second dose at"). Update the section description at line ~114, which currently reads singular ("What time should we remind Nino to take his medication?").

**Embedded mitigations**:
- ⚠️ Entity IDs must match task-1's exactly. A typo yields a silently blank card row, not an error.
- ⚠️ Preserve the existing `card_mod: !include` patterns and template references verbatim — do not restyle.

**Acceptance criteria**:
1. Two `input_boolean.nino_medication_{1,2}_taken` rows with existing icon/card_mod patterns preserved
2. Two `timer.nino_medication_{1,2}_timer` template-entity-rows
3. Both `input_datetime.nino_medication_{1,2}_time` pickers with distinct labels
4. No `nino_daily_medication_*` reference remains
5. Section description reads as plural/two-dose
6. All pre-existing `!include` paths unchanged
7. YAML parses

---

## Task 5: Split the notification cards

**Files**: `dashboards/kohbo/shared/notifications/nino_med_reminder_1.yaml` (new), `nino_med_reminder_2.yaml` (new), `nino_med_reminder.yaml` (delete), `dashboards/kohbo/shared/kohbo_notification_popup.yaml` (line 18)

**Read first**: `dashboards/kohbo/shared/notifications/nino_med_reminder.yaml` · `kohbo_notification_popup.yaml` · a sibling card for conditional-template precedent

**Description**: One conditional card per dose, each with snooze and mark-taken sub-buttons wired to its own dose. Mark-taken passes an explicit `dose` (unlike the ZHA button, which relies on the resolver). Each card's condition additionally requires the dose's scheduled time to have passed, so dose 2's card doesn't sit in the notifications popup from 3am onward.

**Embedded mitigations**:
- ⚠️ Register **both** new files in `kohbo_notification_popup.yaml`, replacing the single line 18 include. Missing this makes the cards silently never appear.
- ⚠️ `script.nino_medication_taken` keeps its name — the live host has Assist exposure and dashboard references to it. Do not rename.

**Acceptance criteria**:
1. Both new card files exist, each bound to its own dose's boolean and timer
2. Old `nino_med_reminder.yaml` deleted
3. `kohbo_notification_popup.yaml` includes both new files and no longer references the old one
4. Each card's mark-taken sub-button passes an explicit `dose` to `script.nino_medication_taken`
5. Each card's condition requires both "dose untaken" and "scheduled time has passed"
6. YAML parses for all three files

---

## Post-Merge Runbook — NOT part of the build

These require the live HA Yellow at `192.168.1.36` (`ssh hassio`). **No build task can satisfy them and no build agent should claim to.** Full detail in plan tasks 11–13.

### Deploy (plan task 11)
1. `ha core check` **first**. On failure: do not reload — `git revert`, re-push, re-deploy, then investigate.
2. Push to GitHub before `./deploy.sh` (deploy pulls from the remote).
3. **Prove the deploy landed.** Host git HEAD has diverged from local (`e6dab15` vs `28b243c`) — the known condition where `deploy.sh` pulls nothing and exits 0. Confirm host HEAD matches the merge commit and the new file exists on the host with expected content. **Exit code 0 is not evidence.**
4. `homeassistant.reload_all` — an automations-only reload will look successful while every new entity is missing.
5. Check the HA log for template-render warnings from the medication package.

### Verify (plan task 12) — 20 criteria, gates cleanup
Highest-value first:
- **Criterion 6** — restart HA mid-wait; timer must survive and re-prompt. *Validates CRITICAL 2.*
- **Criterion 20** — set `input_select.notification_level` to `None`, leave a dose untaken; the critical push must still arrive. *Validates CRITICAL 1.*
- **Criterion 7** — ZHA button during an open wait must complete the wait. *First real test of the unprecedented template-trigger mechanism.*
- **Criterion 9** — dose 1 snoozing + dose 2 prompting → button marks dose 2.
- **Criterion 3** — dose 1 time reads `07:00:00`.

### Cleanup (plan task 13) — only after verification passes, incl. one full both-dose day
- Delete 4 orphaned registry entries (`input_boolean.nino_daily_medication_taken`, `timer.nino_daily_medication_timer`, `input_datetime.nino_daily_medication_time`, `automation.nino_daily_medication_reminder`)
- **Fix the "UI Test" storage-mode dashboard** (`/ui-test`, sidebar-visible) — its People view has rows bound to the old boolean and timer. Lovelace UI editor only; there is no file to edit.
- **Re-expose the timer to voice assistants** — the old timer had a `cloud.google_assistant` exposure the rename orphans. Settings → Voice Assistants → Expose.
