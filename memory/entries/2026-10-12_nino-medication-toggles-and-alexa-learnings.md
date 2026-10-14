# 2026-10-12 — nino-medication-toggles-and-alexa

Master/voice/push input_booleans for Nino's medication reminder, plus "Alexa, Nino took his meds" through the existing `script.nino_medication_taken`, via a Nabu Casa scene and an Alexa Routine. 7/7 tasks done, all on the first attempt. Reviewer: APPROVED, 0 defects.

## Notes

- `tests/run.sh` hardcodes `CONFIG_ROOT=/root/config`, so on the Mac it "passes" ~100 tests against nothing. The real local gates are yamllint and a throwaway Jinja harness that pulls the template out of the YAML; CI `ha-check` is authoritative. The main checkout's `tests/.venv` python symlinks to the Xcode stub, so it's broken.
- Alexa can't pass script fields. Scripts exposed through Nabu Casa appear as scenes, so the early-dose fallback had to go into the script's `resolved_dose` (passed → pending → earliest untaken → none). There's no wrapper script. Existing callers are unaffected: the dashboard and reminder pass `dose`, and the ZHA button is gated on pending.
- The master toggle now gates the escalation backstop, which used to be unmutable. That was John's call: "off" means off. Voice/push and `notification_level` still can't mute it.
- The new booleans load `off`. John chose plain on/off over "paused" inversion and turns them on after deploy (handoff step 1).
- The harness sabotage check showed `| string` on the `states()` side is a no-op guard, because states() is always str. Only the requested-dose side needs it.
- The PRD said "model it on the neighbouring section", and that neighbour holds datetime rows, so the dev copied `entity_no_icon` onto toggles. The reviewer passed it. It was fixed at wrap: toggle rows always use `kohbo_boolean_entity_layout`. In an AC, name the row-style include instead of saying "match the neighbour".
- Confirmed live on 2026-10-14: the Alexa Routine marked dose 1 taken with no dose passed, and dose 2 stayed open. CI never ran `ha-check` on the PR because repo-wide yamllint has 2,773 existing errors; the deploy's `ha core check` was the real gate.

Handoff: `plans/nino-medication-toggles-and-alexa/handoff.md`.
