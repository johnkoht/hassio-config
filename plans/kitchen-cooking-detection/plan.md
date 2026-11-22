---
title: Kitchen Cooking Detection
slug: kitchen-cooking-detection
status: approved
created: 2026-11-21
has_pre_mortem: false
has_review: false
has_prd: false
depends_on: purifier-aq-fixes
---

# Kitchen Cooking Detection

## Problem

Cooking fumes spread through the house. On 2026-11-21, VOC in every bedroom jumped from about 300 to 700–800 ppb within the same 10 minutes as the kitchen did, probably carried by the furnace fan. The kids' bedroom doors were open.

Nothing in HA knows we're cooking, so nothing reminds us to close their doors or clears their rooms before bed. The range is gas and has no smart switch, so there's no electrical signal either.

## Goal

- HA detects cooking from the kitchen's air.
- If either kid's door is open, it reminds us once to close it.
- It runs the kids' purifiers at 100% until each room goes to Bedtime.

## Approach

**Detection.** Add `binary_sensor.kitchen_cooking`, a template built on the kitchen Awair.

The main signal is a PM2.5 jump. Two statistics sensors give the 15-minute minimum of `sensor.kitchen_awair_pm2_5` and `sensor.kitchen_awair_carbon_dioxide`. The sensor turns on when:
- PM2.5 is at least 8 above its 15-minute minimum and the kitchen is occupied. On 11-21 it went from 1 to 16.
- Or, as a secondary signal, CO2 is at least 200 above its minimum and PM2.5 is at least 4 above its own. Gas burners give off CO2, but so do people, which is why the CO2 rule needs PM2.5 as well.

A `delay_off` of about 30 minutes holds it on after the air settles. Absolute jumps work better than fixed levels because the baseline drifts.

Task 1 checks these numbers against recorder history before anything is wired up. The Awair is cloud-polled, so detection lags by a few minutes. That's acceptable, because the reminder doesn't need to be instant.

**Door reminder.** When `kitchen_cooking` turns on and `binary_sensor.ninos_door_sensor_status` or `binary_sensor.gianlucas_door_sensor_status` is open:
- Make one `script.voice_announcement` (`media_players: auto`, low priority) naming which door(s) are open.
- Repeat once after 10 minutes if a door is still open and cooking continues.

`voice_announcement` already handles speech gating.

**Purge.** Add `input_boolean.cooking_air_purge`, with no `initial:`. Cooking turns it on.

`air_quality_set_air_purifier_mode` checks it. For the kids' purifiers (`fan.ninos_bedroom_air_purifier`, `fan.gianlucas_bedroom_air_purifier`), it sets Manual 100% while the flag is on and the room isn't in Bedtime.

When a room goes to Bedtime, its detection automation re-runs and the normal Bedtime logic takes back over. The flag clears when both kids' rooms are in Bedtime, when cooking has been off for 30 minutes, or after a 2-hour cap.

Centralising the check in the script stops the per-room detection automations from overwriting the purge on their next AQ change.

Nino's purifier is broken right now. The purge covers his room once a replacement, or the playroom unit, takes over the `fan.ninos_bedroom_air_purifier` entity.

## Tasks

1. **Calibrate from history.** Pull the last 14 days of kitchen PM2.5 and CO2 from the recorder. Count how often each candidate rule would have fired, and how many of those line up with real cooking times (John to sanity-check a handful). Pick the thresholds.
2. **Detection sensor.** Add `packages/kitchen/sensors/kitchen_cooking.yaml`: two statistics sensors plus the template binary sensor, with `availability:` tied to the Awair readings.
3. **Door reminder.** Add `packages/kitchen/air_quality/kitchen_cooking_close_doors.yaml`: one announcement, one repeat after 10 minutes, door names in the message, `mode: single`.
4. **Purge flag and script hook.** Add the `input_boolean`, the on/off automations (cooking on; both rooms Bedtime, cooking off 30 minutes, or 2-hour cap), and the purge branch in `air_quality_set_air_purifier_mode`.
5. **Tests.** Cover the detection thresholds, the reminder only firing when a door is open, the purge yielding to Bedtime, and the flag clearing on each of its three paths.
6. **Docs.** Update the kitchen README/LEARNINGS, the air quality README, and `docs/ROOMS.md`.

## Risks

- **False positives** from toast, candles, vacuuming or a crowd in the kitchen. The occupancy gate plus history calibration help, and one low-priority announcement is cheap. The thresholds can become helpers if they need tuning.
- **Detection lag** from the cloud polling. Awair updates every few minutes, so the reminder may come a little after the burner goes on. If it proves too slow, Awair's local API is a later improvement.
- **Noise at 100%** while the kids are winding down. The purge only runs before Bedtime and yields as soon as each room switches.
- **It depends on purifier-aq-fixes.** That plan adds the script's unknown-state guard and the Auto recovery, so the purge's end state is reliable. Ship it first.

On approval → /approve → /ship kitchen-cooking-detection
