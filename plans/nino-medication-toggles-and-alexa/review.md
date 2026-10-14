## Review: Nino Medication Toggles and Alexa

**Type**: Plan
**Review Path**: Full (architectural choices: gating the unmutable escalation backstop, changing a shared script's fallback)
**Complexity**: Medium (8 tasks, 3–5 files: reminder package, escalation, Nino person card, 2 notification cards)
**Recommended Track**: standard (/ship)

No LEARNINGS.md or PROFILE.md covers `packages/people/nino/`. Checked the adjacent ones (`packages/house`, `school`) and nothing applies. The relevant memory: `initial:` disables restore, removing `initial_state` doesn't re-enable, and the automation entity_id comes from its alias. The plan already accounts for these.

### Concerns

1. **Unsafe default (the main one)**: new input_booleans load as `off`. Master gates both the reminder *and* the escalation, so a deploy that misses the "turn them on" step silently turns off every medication alert, including the backstop built to survive silent failure. The plan's mitigation is just a human remembering a step.
   - Suggestion: make the gates fail-safe. Check `not is_state(master, 'off')` so `unknown`/`unavailable` counts as enabled. That doesn't cover a fresh helper, which loads as a real `off`, so also add a one-shot step: the deploy handoff turns the three toggles on, and a check that reads their state back. If you'd rather have it structurally safe, invert the semantics (`..._reminders_paused`, default off = active). The cost is less readable toggles in the app.

2. **Completeness – dashboard cards ignore the master**: `nino_med_reminder_1/2.yaml` show in the notifications popup whenever a dose is untaken. With reminders off (a no-meds day), the popup keeps saying "Nino's Medication" all day.
   - Suggestion: add a `condition: state` on `input_boolean.nino_medication_reminders: "on"` to both conditional cards. Conditional cards accept `state`, which is fine per memory.

3. **Completeness – the early-dose fallback has an ordering edge**: "next untaken dose today, earliest scheduled time first" picks dose 1 at, say, 21:00 when dose 1 was skipped and dose 2 was taken. That's acceptable, but spell it out in the script comment so nobody "fixes" it later. Also check that the fallback skips doses whose time is `unknown`, the same way the resolver does.

4. **Quality gates – `ha core check` isn't runnable here**: there's no local `ha` CLI. The repo has `tests/run.sh` (modern syntax, schema, entity references, duplicates) and `.github/workflows/ha-check.yml`. Per memory, `deploy.sh --check` destroys `secrets.yaml`, so use `--skip-ci`.
   - Suggestion: set task 6 to: `tests/run.sh` passes + CI `ha-check` green; reload `input_boolean`, `script` and `automation` (never restart).

5. **Test coverage – no behavioural acceptance criteria**: the code-touching tasks have no scenario checks.
   - Suggestion: add a verification matrix to run after deploy:
     - voice off + push on → push only;
     - voice on + push off → announcement only, and the snooze timer still re-prompts;
     - master off → no announcement, no push, no escalation, popup cards hidden;
     - Alexa before the dose time → marks the next dose, and the dose-time trigger then no-ops;
     - Alexa with both taken → no-op.

6. **Risk not listed – master turned back on later in the day**: if master is off at dose time and turned on afterwards, nothing re-prompts until the next wake-up trigger, and escalation picks it up at +2h. That's probably fine, but note it as accepted.

### Strengths

- Gating on input_booleans instead of automation enable/disable avoids the `initial_state` / disabled-forever trap.
- It reuses the existing script and resolver, so there's no new Alexa integration or wrapper script.
- Changing the existing fallback is backward-compatible. The dashboard and reminder always pass `dose`, and the ZHA button is gated on `pending != none`.
- Voice/push toggles never touch the escalation, so the backstop's "can't be muted" design survives.

### Devil's Advocate

**If this fails, it will be because...** the three new booleans land `off` after the reload and nobody notices. Nothing visibly breaks: the house just goes quiet about Nino's meds, and with master gating escalation, the backstop goes quiet too.

**The worst outcome would be...** a missed dose with no voice, push or critical alert, caused by a toggle default rather than a deliberate choice.

### Verdict

- [ ] Approve
- [ ] Approve with suggestions
- [x] Approve pending pre-mortem (Medium; /ship runs it) — after Changes 1, 2, 4 and 5 are folded into the plan
- [ ] Revise

### Suggested Changes

**Change 1**: Fail-safe toggle defaults
- **What's wrong**: a fresh helper defaults `off`, and that silences everything, including escalation.
- **What to do**: use gates that fail open, plus an explicit "turn on + read back" deploy step. Or, if preferred, use inverted "paused" booleans.
- **Where to fix**: Approach (toggles), Tasks 1 and 6, Risks.

**Change 2**: Hide the notification cards when master is off
- **What to do**: add a master `state` condition to `nino_med_reminder_1.yaml` / `_2.yaml`.
- **Where to fix**: Task 5.

**Change 3**: Document the fallback's ordering and skip unknown times
- **Where to fix**: Task 4.

**Change 4**: Real validation commands
- **What to do**: replace `ha core check` with `tests/run.sh` + CI `ha-check`; for deploy use `--skip-ci`; reload only, never restart.
- **Where to fix**: Task 6.

**Change 5**: Add the verification matrix as acceptance criteria
- **Where to fix**: a new "Verification" section.

### Resolution (2026-10-12)

All changes were folded into the plan. For Change 1, John chose normal on/off toggles and will turn them on after deploy; the default-off risk is accepted.
