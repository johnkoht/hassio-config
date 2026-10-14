# PRD: Nino Medication Toggles and Alexa

## Goal

Add three app-toggleable switches for Nino's medication reminder (master, voice, push), and let "Alexa, Nino took his meds" mark the outstanding (or next) dose taken through the existing `script.nino_medication_taken`.

## Rules for every task

- Modern HA syntax only (`triggers:`/`trigger:`/`conditions:`/`actions:`/`action:`/`target:`).
- Coerce with `| string` at every template comparison to `['1','2']`.
- No `initial:` on the new helpers.
- Keep inline comments short; the reasoning goes in the commit message.
- Build only these tasks: exactly 3 new entities, no new scripts, no changes to the resolver sensor (pre-mortem R7).
- Local gate: `yamllint -c .yamllint <files>`. `tests/run.sh` is host-only (it hardcodes `/root/config`), so don't cite it (R1).

## Tasks

### Task 1: Add toggle booleans
**File:** `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`

Add `nino_medication_reminders` ("Nino Medication Reminders", `mdi:pill`), `nino_medication_voice` ("Nino Medication Voice Reminder", `mdi:account-voice`) and `nino_medication_push` ("Nino Medication Push Reminder", `mdi:cellphone-message`) to the existing `input_boolean:` block, under a short "Reminder toggles" comment.

**AC:**
- All three keys exist under `input_boolean:`, and none has `initial:`.
- The file header mentions the toggles in ≤2 lines.

### Task 2: Gate the reminder automation
**File:** same file, `nino_medication_reminder`

**AC:**
- `condition: state` for `input_boolean.nino_medication_reminders` = `"on"` is the **first** item in `conditions:` (R4).
- The "Announce only if…" `if` gains `condition: state` for `input_boolean.nino_medication_voice` = `"on"`.
- The "Notify only if…" `if` gains `condition: state` for `input_boolean.nino_medication_push` = `"on"`.
- The timer start, `wait_for_trigger` and `choose` are unchanged (diff shows no edits there).

### Task 3: Gate the escalation on the master toggle
**File:** `packages/people/nino/medication_reminder/nino_medication_escalation.yaml`

**AC:**
- `conditions:` has `condition: state` for `input_boolean.nino_medication_reminders` = `"on"`, replacing `conditions: []`.
- The header names that entity as the single deliberate off switch and still says the backstop ignores `notification_level` and the voice/push toggles. Net header growth ≤3 lines (R3).

### Task 4: Early-dose fallback in `script.nino_medication_taken`
**File:** `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`

Extend `resolved_dose`: requested dose if valid → else the pending resolver if it is `1`/`2` → else the earliest-scheduled untaken dose with a valid time today → else `none`. Update the field description and the script's comment.

**AC:**
- A local Jinja harness (scratchpad, not committed) renders the template with stubbed `states`/`is_state` and gives:
  - `dose: "2"` → `2`;
  - `dose: 2` (int) → `2`;
  - no dose, pending `1` → `1`;
  - no dose, pending `none`, both untaken, dose 1 time earlier → `1`;
  - no dose, pending `none`, dose 1 taken → `2`;
  - no dose, both taken → `none`;
  - no dose, dose 1 time `unknown` and dose 2 untaken → `2`.
- All comparisons use `| string` (R2).
- A one-line comment says the earliest-first order is intentional.

### Task 5: Reminder Settings on Nino's person card
**File:** `dashboards/templates/button_cards/people/nino.yaml`

Add a section titled "Reminder Settings" inside the Medications stack, modelled on the "Medication Reminder Time" section, with the three toggles: "Reminders", "Voice", "Push".

**AC:**
- It uses the same `stack-in-card` + `kohbo_card_section_title` + entities structure as the neighbouring section.
- Every `!include` path in the new block exists on disk (R8).
- yamllint is clean.

### Task 6: Hide popup cards when reminders are off
**Files:** `dashboards/kohbo/shared/notifications/nino_med_reminder_1.yaml`, `nino_med_reminder_2.yaml`

**AC:**
- Each card's `conditions:` gains `condition: state`, `entity: input_boolean.nino_medication_reminders`, `state: "on"`.
- Each header gains ≤1 line noting it.

### Task 7: Handoff note
**File:** `plans/nino-medication-toggles-and-alexa/handoff.md`

**AC:**
- Step 1 is to turn on the 3 toggles (R5).
- It says to deploy only after merging to master, and to confirm the toggles appear in the app before testing (R6).
- It covers the Nabu Casa exposure of `script.nino_medication_taken`, "Discover devices", and the Alexa Routine steps.
- It includes the plan's verification matrix.
- No PII.

## Out of scope

- Changes to the resolver sensor.
- New Alexa integrations or confirmation scripts.
- A ZHA button change.
- A restart.
