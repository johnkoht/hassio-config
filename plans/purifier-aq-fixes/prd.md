# PRD: Purifier AQ Fixes

**Goal:** Room purifiers follow indoor-appropriate, dashboard-tunable thresholds, ignore Awair dropouts, don't flap, and return to the Auto preset when the air is clean.

## Task 1: Threshold helpers

**Files:** `packages/air_quality/air_quality_{pm25,tvoc,co2}_thresholds.yaml`

- Remove `initial:` from every threshold `input_number`.
- Set `min: 0` and a `max` above any plausible value.
- After deploy, set PM2.5 moderate/poor/hazardous to 15/35/55 and TVOC poor/hazardous to 1500/5000 once, with `input_number.set_value`. The commands are documented in the air quality README.

**Acceptance criteria:**
- No threshold helper has `initial:`.
- Every threshold helper has `min: 0`.

## Task 2: Dropout guard

**Files:** the six room `*_air_quality_sensor.yaml` and `*_air_quality_detections.yaml`; `packages/air_quality/air_quality_set_purifier_mode.yaml`

- Each room template has an `availability:` that requires PM2.5, VOC and CO2 to have values.
- Each AQ state trigger has `not_from` and `not_to` for `unavailable` and `unknown`.
- The script stops, without acting, when `aqi_state` isn't one of Acceptable, Moderate, Unhealthy or Hazardous.

**Acceptance criteria:**
- A rendered template with a missing reading is unavailable.
- No path maps an unknown or unavailable `aqi_state` to Off.

## Task 3: Hysteresis

**Files:** the six room templates and the detection triggers

- A room steps up as soon as any reading crosses a band's threshold.
- It steps down only when no reading is above 80% of the current band's threshold. It reads its own state through `this.state`, defaulting to Acceptable.
- The detection AQ triggers wait about 1 minute (`for:`). The office keeps its existing per-state `for:`.

**Acceptance criteria:** render tests cover:
- stepping up;
- holding while between 80% and 100% of the threshold;
- stepping down below 80%;
- a missing or unavailable `this.state`.

## Task 4: Auto/Sleep preset recovery

**File:** `air_quality_set_purifier_mode.yaml`

- After the Auto or Sleep branch, wait 15 s. If `preset_mode` doesn't match, re-send `set_preset_mode`.
- The script stays `queued` (max 20), so a re-check can't undo a newer run for the same purifier.

**Acceptance criteria:**
- The Auto and Sleep branches re-check `preset_mode` and retry.
- The script stays `queued`.

## Task 5: Tests

**File:** `tests/test_air_quality_purifier_regressions.py`

**Acceptance criteria:**
- Covers Tasks 1 to 4.
- Checks the six templates are identical apart from the room slug.
- The full suite stays green.

## Task 6: Docs

**Files:**
- `packages/air_quality/README.md` (new): thresholds, the one-time set commands, the flow, and the Winix notes.
- `LEARNINGS.md`: the dropout incident and the Winix mode cache.
- `docs/` wherever the purifier logic is described.

**Acceptance criteria:** the docs match the shipped values and behaviour.
