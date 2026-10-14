## Pre-Mortem: Nino Medication Toggles and Alexa

No PROFILE.md or LEARNINGS.md covers `packages/people/nino/` or the kohbo dashboards. Inputs: the plan, `review.md`, the auto-memory entries (`initial:` disables restore; template type coercion; `deploy.sh --check` destroys secrets; deploy pulls from GitHub; never restart), and collaboration.md (in particular "separate polish from protection", from the original two-dose ship).

### Risk 1: Validation gap, since the local tests don't test this repo checkout

**Problem**: `tests/conftest.py` hardcodes `CONFIG_ROOT = /root/config`, so `tests/run.sh` on the Mac validates nothing: 101 tests "pass" against an empty tree. The plan's task 6 would then be a false green. Templated entity IDs (`input_boolean.nino_medication_{{ dose }}_taken`) and new fallback Jinja can only fail at runtime.

**Mitigation**: the local gate is `yamllint -c .yamllint` on the changed files, plus a Jinja render check of the new `resolved_dose` template against a scenario matrix: a local Jinja harness with stubbed `states`/`is_state`/`today_at`/`now`. The authoritative gate is CI `ha-check` (frenck/action-home-assistant) on the PR, which must be green before merge. Don't cite `tests/run.sh` as evidence.

**Verification**: yamllint output is clean; the harness output covers ≥5 scenarios; the PR checks show `ha-check` passing.

---

### Risk 2: Type coercion in the fallback comparison

**Problem**: HA templates that render "1" return int `1`. A new fallback that compares `x in ['1','2']` without `| string` silently returns False, so Alexa no-ops (memory: template type coercion).

**Mitigation**: coerce with `| string` at every comparison site in the new fallback, matching the existing `resolved_dose | string in ['1','2']`. Have the fallback emit the string forms only.

**Verification**: the reviewer greps the diff and finds no bare `in ['1', '2']` without `| string`. The harness renders int and str inputs.

---

### Risk 3: The master gate on escalation contradicts its own header

**Problem**: `nino_medication_escalation.yaml` has a long header arguing it must be independent of every mute. Adding a master condition without editing that header leaves the documentation saying the opposite of the code, and a future agent may "fix" it back.

**Mitigation**: rewrite the relevant header lines. The backstop stays independent of `notification_level` and the voice/push toggles, and only the deliberate master off silences it. Keep it short (memory: keep inline docs short; reasoning goes in the commit).

**Verification**: the header mentions the master toggle by entity ID, and the reviewer confirms it's consistent with the code.

---

### Risk 4: Condition placement in the reminder automation

**Problem**: the reminder resolves `dose` in `variables:` and gates on templates. If the master condition goes after the `dose` checks it's harmless, but the house convention is global → feature. If the voice/push gates are put at the top level instead of inside each `if`, voice-off would also kill the push, which is the opposite of the requirement.

**Mitigation**: master is the **first** entry in `conditions:` (`condition: state`). Voice is an extra `condition: state` inside the "Announce…" `if`; push is one inside the "Notify…" `if`. The timer start and `wait_for_trigger` stay ungated by voice/push.

**Verification**: the reviewer confirms placement, and the post-deploy matrix's voice-off and push-off rows pass.

---

### Risk 5: Default-off silent outage (accepted)

**Problem**: new booleans load `off`. Until John turns them on, there's no reminder, no push and no escalation. John accepted this.

**Mitigation**: the handoff's first line is "turn on the 3 toggles". The ship report repeats it. Nothing else is needed.

**Verification**: the handoff and ship report both lead with it.

---

### Risk 6: Deploy silently doesn't land

**Problem**: per memory, `./deploy.sh` pulls from GitHub on the Yellow. Host git divergence or a missing branch tracking setting means a silent no-op, so John could test against old config and conclude the feature is broken, or that it works.

**Mitigation**: the handoff says to deploy only after merge to master, and to confirm the toggles exist in the app (their existence proves the new config loaded) before running the matrix.

**Verification**: the handoff includes that check.

---

### Risk 7: Scope creep (the original two-dose lesson)

**Problem**: the original two-dose ship bundled unrequested polish. Here the only addition beyond the ask is hiding the popup cards when master is off. It came from the review and was approved inside the plan.

**Mitigation**: build exactly the plan's tasks: no extra entities, no Alexa confirmation scripts, and no changes to the resolver sensor. The popup gate is two lines per card.

**Verification**: the diff touches only reminder.yaml, escalation.yaml, people/nino.yaml and the two notification cards, and adds exactly three new entities.

---

### Risk 8: Dashboard include and layout breakage

**Problem**: `people/nino.yaml` is a nested stack-in-card with card_mod includes. A wrong include path or indentation breaks the whole person card, not just the new section. CI `ha-check` doesn't validate Lovelace YAML.

**Mitigation**: copy the existing "Medication Reminder Time" section's structure verbatim (stack-in-card + `kohbo_card_section_title` + entities with `kohbo_boolean_entity_layout.yaml`), and verify every `!include` path exists in the repo.

**Verification**: an `ls` of each include path; yamllint on the file; John eyeballs it after deploy.

---

## Summary

Total risks identified: 8
Categories: test complexity, integration, documentation debt, scope drift, environment/config, backward compatibility
CRITICAL risks: none. Risk 1 is HIGH: the plan's stated gate was a false green, so it's replaced with yamllint + Jinja harness + CI.
