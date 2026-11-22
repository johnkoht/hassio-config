# Working Memory — purifier-aq-fixes

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Recon] Winix integration (`custom_components/winix/device_wrapper.py` on the host) caches `_auto/_manual/_sleep`; `async_set_mode(AUTO)` returns early when `_auto` is already cached true, and `turn_off` does not clear it. The coordinator polls every 30 s and refreshes 4 s after on/off.

## Active Gotchas
- [Recon] Two live repros on the office purifier (Auto→off→on+Auto, Sleep→off→on+Auto) both landed on Auto, so the 11-21 stuck-Manual-50 was not reproduced. The fix is a defensive re-check and retry, not a proven root-cause fix.
- [Recon] Removing `initial:` makes HA restore the old helper values; new thresholds need a one-time `input_number.set_value` after deploy.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-22] Indoor thresholds replace the EPA outdoor ones (PM2.5 15/35/55, TVOC 500/1500/5000) — docs affected: packages/air_quality/README.md — status: folded
