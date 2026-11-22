# PRD: Kitchen Cooking Detection

**Goal:**
- HA detects cooking from the kitchen Awair.
- It reminds us once (plus one repeat) to close an open kid's door.
- It runs the kids' purifiers at 100% until each room goes to Bedtime.

## Task 1: Calibrate (done during the build)

I checked the candidate rules against 8 days of recorder data (the recorder keeps about 8 days):

| Rule | Events in 8 days |
|---|---|
| Kitchen PM2.5 at least 8 above its 15-minute low, kitchen occupied | 10 |
| Same, plus a CO2 rise of 200 or more with PM2.5 up 4 or more | 10 (adds nothing) |

Several of the 10 were one-reading spikes (one peaked at 371).

**Chosen rule:** PM2.5 at least 8 above its 15-minute low, kitchen occupied, `delay_on` 3 min, `delay_off` 30 min. That leaves 5 sustained events, all of them real cooking, and drops the one-reading spikes. CO2 is dropped.

## Task 2: Detection sensor

**File:** `packages/kitchen/sensors/kitchen_cooking.yaml`

**Acceptance criteria:**
- A statistics `sensor.kitchen_pm2_5_15_minute_low` gives the min over 15 min, with `keep_last_sample`.
- `binary_sensor.kitchen_cooking` is on when PM2.5 minus that low is at least 8 and the kitchen is occupied, with `delay_on` 3 min and `delay_off` 30 min.
- It is unavailable while either PM2.5 input lacks a value.

## Task 3: Door reminder

**File:** `packages/kitchen/air_quality/kitchen_cooking_close_doors.yaml`

**Acceptance criteria:**
- Fires when cooking turns on, the house is occupied, and either kid's door is open.
- Makes one low-priority `voice_announcement` naming the open door or doors.
- After 10 minutes, if cooking is still on and a door is still open, it repeats once with the current doors.
- `mode: single`.

## Task 4: Purge

**Files:** `packages/air_quality/cooking/`, plus a branch in `air_quality_set_purifier_mode`

**Acceptance criteria:**
- `input_boolean.cooking_air_purge` has no `initial:`.
- It turns on when cooking turns on, the house is occupied, and either kid's room isn't in Bedtime. Both kids' purifiers are then re-run through the script.
- The script uses Manual 100% for a kid's purifier while the flag is on and that room isn't in Bedtime.
- The flag turns off when:
  - cooking turns off;
  - the flag has been on for 2 h;
  - both kids' rooms are in Bedtime;
  - or the house is empty.
- Turning off re-runs both kids' purifiers through the normal logic.

## Task 5: Tests

**Acceptance criteria:**
- Render tests for the detection template.
- The reminder's triggers and conditions, and its door wording.
- The purge's override, its yield to Bedtime, and its four off paths.
- The full suite passes.

## Task 6: Docs

Update the kitchen README and LEARNINGS, the air quality README, and `docs/AUTOMATIONS.md`.
