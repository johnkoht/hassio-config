# Working Memory — nino-medication-toggles-and-alexa

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Tasks 1-3] NOTHING_NOVEL

## Active Gotchas
- [pre-build] tests/run.sh hardcodes /root/config, so local runs validate nothing. Use yamllint + CI ha-check.
- [pre-build] tests/.venv in the main checkout is broken (python → Xcode stub); a working venv is in the session scratchpad.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-10-12] Master toggle also silences the escalation backstop (previously unmutable) — docs affected: nino_medication_escalation.yaml header — status: folded
- [2026-10-12] Toggles use normal on/off and load off on first deploy; John turns them on — docs affected: handoff.md — status: folded
