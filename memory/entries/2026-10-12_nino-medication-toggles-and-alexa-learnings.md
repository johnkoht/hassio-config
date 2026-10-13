# 2026-10-12 — nino-medication-toggles-and-alexa

Master/voice/push input_booleans for Nino's medication reminder, plus "Alexa, Nino took his meds" through the existing `script.nino_medication_taken`, via a Nabu Casa scene and an Alexa Routine. 7/7 tasks done, all on the first attempt. Reviewer: APPROVED, 0 defects.

## Notes

- `tests/run.sh` hardcodes `CONFIG_ROOT=/root/config`, so on the Mac it "passes" ~100 tests against nothing. The real local gates are yamllint and a throwaway Jinja harness that pulls the template out of the YAML; CI `ha-check` is authoritative. The main checkout's `tests/.venv` python symlinks to the Xcode stub, so it's broken.
- Alexa can't pass script fields. Scripts exposed through Nabu Casa appear as scenes, so the early-dose fallback had to go into the script's `resolved_dose` (passed → pending → earliest untaken → none). There's no wrapper script. Existing callers are unaffected: the dashboard and reminder pass `dose`, and the ZHA button is gated on pending.
- The master toggle now gates the escalation backstop, which used to be unmutable. That was John's call: "off" means off. Voice/push and `notification_level` still can't mute it.
- The new booleans load `off`. John chose plain on/off over "paused" inversion and turns them on after deploy (handoff step 1).
- The harness sabotage check showed `| string` on the `states()` side is a no-op guard, because states() is always str. Only the requested-dose side needs it.

Handoff: `plans/nino-medication-toggles-and-alexa/handoff.md`.
