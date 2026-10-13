---
title: Nino Medication Toggles and Alexa
slug: nino-medication-toggles-and-alexa
status: in-progress
created: 2026-10-12
has_pre_mortem: true
has_review: true
has_prd: true
---

# Nino Medication Toggles and Alexa

## Problem

Nino's medication reminder (`packages/people/nino/medication_reminder/nino_medication_reminder.yaml`) always does both a voice announcement and a push notification, and you can't change that from the app. The only way to turn it off is to disable the automation itself, which is fragile: a disabled automation stays disabled across restarts with no visible sign, and the automation entity_id comes from its alias. Marking a dose taken also means using the phone, the dashboard or the ZHA button. You can't do it by voice.

## Goal

Three toggles in the app: reminders on/off (master), voice on/off and push on/off. Any combination works. Saying "Alexa, Nino took his meds" marks the outstanding dose taken, which also ends the reminder loop and clears the dashboard card. Alexa confirms out loud.

## Approach

**Toggles are input_booleans, not automation enable/disable.** Add three helpers next to the existing ones in the package: `input_boolean.nino_medication_reminders` (master), `input_boolean.nino_medication_voice` and `input_boolean.nino_medication_push`. None of them get `initial:`, so changes made in the app survive restarts. Then gate the reminder automation:
- Master is a top-level condition, checked first (global → feature order). When it's off, nothing runs: no timer and no re-prompts.
- Voice adds a condition to the existing "Announce only if this dose is still untaken" `if`.
- Push adds a condition to the existing "Notify only if this dose is still untaken" `if`.
- The snooze timer and `wait_for_trigger` stay as they are. Re-prompting keeps working whichever channel is on, and the taken-boolean trigger still catches the dashboard, the ZHA button and Alexa.

**Escalation backstop:** the master toggle also gates `nino_medication_escalation` (confirmed). The voice and push toggles don't. That keeps the backstop's "can't be muted by notification policy" design: muting a channel never silences the critical push, but "turn the whole thing off" really means off. I'll update the header comment to say so.

**Alexa: an Alexa Routine that runs the existing script.** The repo has no `alexa:`/`cloud:` YAML, so Alexa runs through Nabu Casa and the exposed entities are set in the UI. Scripts exposed through Nabu Casa show up in Alexa as scenes, and an Alexa Routine with a custom phrase can trigger a scene. When Alexa runs `script.nino_medication_taken`, it passes no `dose`, so the script falls back to the pending-dose resolver. No new script is needed.

**Early-dose fallback goes into the existing script (confirmed).** The script's `resolved_dose` fallback is extended: use the passed dose, else the pending-dose resolver, else the next untaken dose today (earliest scheduled time first), else `none`. This is safe for the existing callers. The dashboard cards and the reminder automation always pass `dose`, and the ZHA shortcut button is gated on `pending != none`, so it never reaches the new branch.

Manual steps for you, which I can't do from the repo: expose `script.nino_medication_taken` in HA → Settings → Voice assistants → Alexa (rename its Alexa alias there if you like). Then in the Alexa app, create a Routine: *When you say* "Nino took his meds" → *Smart Home* → that scene → *Alexa Says* "Got it, marked Nino's meds as taken."

## Tasks

1. Add the three toggle booleans in `nino_medication_reminder.yaml`: master, voice and push, with no `initial:`. They load `off` on first deploy, and you turn them on in the app (confirmed: normal on/off semantics, no "paused" inversion).
2. Gate the reminder automation. Master is the first condition, voice goes on the announce `if`, push on the notify `if`.
3. Gate the escalation automation on master and update its header comment.
4. Extend `script.nino_medication_taken`'s `resolved_dose` fallback: passed dose → pending resolver → earliest-scheduled untaken dose today → `none`. Skip doses whose time is `unknown`/`unavailable`, as the resolver does. Add a one-line comment saying that the earliest-first order is intentional.
5. Dashboard:
   - Add a "Reminder Settings" section with the three toggles to `dashboards/templates/button_cards/people/nino.yaml`, using `kohbo_boolean_entity_layout.yaml` like the existing dose rows.
   - Add a master `condition: state` to `dashboards/kohbo/shared/notifications/nino_med_reminder_1.yaml` and `_2.yaml`, so the popup cards hide when reminders are off.
6. Validate: `yamllint -c .yamllint` clean on changed files; a local Jinja harness renders the new fallback across the scenario matrix; CI `ha-check` green on the PR. `tests/run.sh` is host-only (`/root/config`), so it's not a local gate. Deploy with `--skip-ci` (never `--check`). Reload `input_boolean`, `script`, `automation`; no restart.
7. Write a handoff note covering the steps you do by hand:
   - turn the three toggles on;
   - expose `script.nino_medication_taken` to Alexa via Nabu Casa and run "Discover devices";
   - create the Alexa Routine.
8. Run a reviewer subagent covering modern syntax, condition order and consistency with the package.

## Verification

Run after deploy, with the toggles on unless stated:
- Voice off, push on → push only, no announcement.
- Voice on, push off → announcement only; the snooze timer still re-prompts after 15 min.
- Master off → no announcement, no push, no escalation, and the popup cards are hidden.
- "Alexa, Nino took his meds" before the dose time → the next dose is marked taken, and the dose-time trigger then no-ops.
- Alexa with both doses taken → no-op.
- The dashboard Taken buttons and the ZHA button still mark the right dose (regression).

## Risks

- **New booleans start `off` after the first load**, which silences all reminders, including escalation, until they're turned on. Accepted (confirmed): you turn them on in the app after deploy, and it's the first item in the handoff.
- **Alexa says "Nino took his meds" when no dose is due**, so a stray or misheard phrase marks a dose taken. Accepted (confirmed): the fallback only marks an untaken dose today, and the dashboard shows it so you can toggle it back.
- **Nabu Casa script exposure or scene naming varies.** Alexa can need a "Discover devices" round before the scene shows up. That's a manual step, noted in the handoff.
- **Master gating the escalation weakens the backstop.** Accepted (confirmed): master is a deliberate "off", unlike a notification-level mute.
- **Master turned back on after a dose time has passed** → no re-prompt until Nino's next wake-up trigger. Escalation still fires at +2h. Accepted.
- **Fallback order:** at night, with dose 1 skipped and dose 2 taken, Alexa marks dose 1. Intentional; it's in the comment.

On approval → /approve → /ship nino-medication-toggles-and-alexa
