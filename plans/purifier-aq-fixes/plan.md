---
title: Purifier AQ Fixes
slug: purifier-aq-fixes
status: in-progress
created: 2026-11-21
has_pre_mortem: false
has_review: false
has_prd: true
---

# Purifier AQ Fixes

## Problem

The room purifiers don't respond usefully to indoor pollution, and sometimes they do the wrong thing. Here is what the recorder showed on the evening of 2026-11-21, while we were cooking:

- **The thresholds are outdoor (EPA) levels.** PM2.5 counts as Moderate only above 35 µg/m³ and Unhealthy above 55. VOC counts as Unhealthy only above 3000 ppb. Kitchen PM2.5 peaked at 17 during cooking, so it never counted.
- **The thresholds can't be tuned.** Each threshold `input_number` has `initial:`, so dashboard edits revert on every restart. Each also has `min:` equal to its current value, so it can't be lowered.
- **A sensor dropout turns purifiers off.** When the Awair cloud blips, every room's AQ template goes `unavailable`. The detection automation fires, and `air_quality_set_air_purifier_mode` falls through to its Off branch. This happened twice that evening.
- **The purifiers don't recover properly.** After the dropout, Gianluca's and the main bedroom's purifiers came back at Manual 50% instead of the Auto preset, and stayed there for hours.
- **The state flaps.** No hold time and no hysteresis, so a reading sitting near 500 ppb VOC bounced the kitchen purifier between Moderate (Manual 50%) and Acceptable (Auto) about once a minute.

## Goal

Each room's purifier follows indoor-appropriate, dashboard-tunable thresholds. It ignores sensor dropouts, doesn't flap, and returns to the Auto preset when the air is clean.

## Approach

Keep the existing shape: per-room template sensor → per-room detection automation → shared `air_quality_set_air_purifier_mode` script. Fix it in place rather than redesigning.

**Thresholds.** Drop `initial:` and widen `min`/`max` so the values are editable and survive restarts. Starting indoor values:

| Pollutant | Moderate | Unhealthy | Hazardous |
|---|---|---|---|
| PM2.5 (µg/m³) | 15 | 35 | 55 |
| TVOC (ppb) | 500 | 1500 | 5000 |
| CO2 (ppm) | 1000 | 2000 | 4500 |

The PM2.5 and TVOC bands are roughly Awair's own. CO2 is unchanged. Removing `initial:` means HA restores the old values, so the deploy step sets the new ones once over REST.

**Dropouts.** Two layers:
- Each room template gets an `availability:` that requires all three Awair readings.
- The detection triggers ignore `unavailable`/`unknown` in both directions. The script stops when `aqi_state` isn't one of its four known values, instead of falling through to Off.

**Flapping.** Each room template steps up as soon as a reading crosses a threshold, but steps down only once every reading is below 80% of the threshold for the current state. It reads its own state through `this.state`, and the detection trigger gets a short `for:`.

**Auto recovery.** First reproduce the stuck-Manual case on one purifier. Find out whether a bare `fan.set_preset_mode` (no `turn_on` first), or a short delay between the two calls, reliably lands on Auto with the Winix integration. Fix the script to match.

The six room templates are near-identical copies. I'm editing all six in place to match the existing pattern, not introducing a shared Jinja macro (the repo has no `custom_templates/`).

**Nino's purifier is broken.** If John moves the playroom unit into Nino's room, rename its entity in the registry to `fan.ninos_bedroom_air_purifier` after removing the dead one. No YAML change is needed. This is a John-side step, listed here for completeness.

## Tasks

1. **Threshold helpers.** In `packages/air_quality/air_quality_{pm25,tvoc,co2}_thresholds.yaml`, remove `initial:`, set wide `min`/`max`, and document the starting values. Note in the README the one-time REST `input_number.set_value` to apply them after deploy.
2. **Dropout guard.** In the 6 room `*_air_quality_sensor.yaml` templates, add `availability:`. In the 6 `*_air_quality_detections.yaml`, add `not_from`/`not_to` for unavailable/unknown. In the script, add a guard that stops on an unknown `aqi_state`.
3. **Hysteresis.** In the 6 room templates, step down at 80% of the current band's threshold using `this.state`. Add `for:` (about 1 min) to the detection triggers.
4. **Auto preset recovery.** Reproduce on one purifier, fix `air_quality_set_air_purifier_mode`'s Auto (and Sleep) branches, and verify live on the host.
5. **Tests.** Add `tests/test_air_quality_purifier_regressions.py`. It renders the room templates for threshold, hysteresis and unavailable cases, checks the script never maps an unknown state to Off, and checks the helpers have no `initial:`.
6. **Docs.** Air quality README/LEARNINGS (the dropout incident, Winix preset behaviour, threshold rationale), and `docs/` where the purifier logic is described.

## Risks

- **Purifiers run more often with lower PM2.5/TVOC thresholds** (more noise and filter wear). The thresholds are tunable from the dashboard now, and Bedtime still halves the speed.
- **The dashboard AQI cards colour by these same helpers**, so the colours will shift with the new values. That's expected, and the cards agree with the automation.
- **A `this.state` self-reference can misbehave on first load or reload.** Guard it with `| default('Acceptable')`, and cover it in a test.
- **The Winix cloud integration is laggy** and reports stale state for a few seconds. Verify the Auto fix over several minutes, not on the first state change.
- **The six copy-pasted templates can drift.** A test asserts they're identical apart from the room name.

On approval → /approve → /ship purifier-aq-fixes
