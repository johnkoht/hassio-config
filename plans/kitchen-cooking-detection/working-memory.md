# Working Memory — kitchen-cooking-detection

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [Task 1] The HA REST history endpoint returns 1 day unless `end_time` is passed. The recorder keeps about 8 days.
- [Recon] The kids' rooms have no speakers. `media_players: auto` only reaches occupied announceable rooms, and the queue skips while `input_boolean.bedtime` is on.

## Active Gotchas
- [Recon] The purifier script is queued, and each Auto/Sleep/Manual run waits 15 s for its re-check, so purge re-runs take a while to land.
- [Recon] Nino's purifier is broken. The purge covers his room once a working unit takes over `fan.ninos_bedroom_air_purifier`.

## Shared Utilities Created

## Context Corrections
- [Task 1] Plan said CO2 is a secondary signal; data showed it adds nothing, so it's dropped.

## Decision Ledger
- [2026-11-22] Cooking = PM2.5 jump >= 8 over the 15-min low, kitchen occupied, delay_on 3 min / delay_off 30 min; CO2 dropped — docs affected: packages/kitchen/README.md — status: folded
