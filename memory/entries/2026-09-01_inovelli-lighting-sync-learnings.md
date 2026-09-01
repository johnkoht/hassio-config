# 2026-09-01 — inovelli-lighting-sync

Ported the Office lighting fix (`2e72108`) to Gianluca's bedroom: Inovelli VZM31-SN in Smart Bulb Mode driving 4 ZHA Hue bulbs.

## Metrics

| | |
|---|---|
| Tasks | 5/5 complete |
| First-attempt pass rate | 5/5 (0 rework rounds) |
| Commits | 7 (incl. 1 orchestrator fix commit) |
| Reviewer verdict | READY, first pass |
| Entities audited | 54 by task-1, 61 by the final full-diff sweep |
| Broken entity refs found | **5** (1 by the audit, 4 by the final sweep) |

## Pre-mortem effectiveness

Ran in compact form (lite mode). The two highest-rated risks both materialized and both were caught by their mitigations:

- **"Not every switch reference is a bug"** — task-2 correctly kept 2 triggers on the switch and retargeted 1 action + 2 conditions, then explicitly flagged the conditions as a judgment call rather than asserting correctness. Blind-replacing would have destroyed the paddle-press presence signal.
- **"Verify entity existence, always"** — produced every real finding in this build. Nothing else came close in value per minute.

## What worked

- **Porting a deployed, exercised implementation.** Pointing every developer at `packages/office/lights/` and `git show 2e72108` produced near-verbatim ports with zero design drift and zero rework rounds. Reference-implementation-as-spec beats prose specs for this kind of work.
- **Explicit "this AC may be wrong, escalate rather than comply" instruction.** Task-2 hit a genuine semantic tension between the literal AC and the underlying principle, and surfaced it instead of silently picking one. That escalation is what led to finding the occupancy deadlock.
- **Verifying subagent claims instead of accepting reports.** Task-1 reported a real missing entity but attributed it to the wrong file. Accepting the report would have sent task-4 to edit a file that was already correct while leaving the actual bug in place.

## What didn't

- **Room-scoped audits systematically miss house-level files.** Task-1's scope was `packages/gianluca_room/**` + dashboards. But Gianluca's room is also referenced from `packages/house/areas/upper_floor/` and `packages/lights/upper_floor_lights.yaml`, and **4 of the 5 broken references lived in those two files** — including three that had left his room card showing no climate data at all. The audit reported "1 MISSING, all else clean" and was wrong by 4x.
- **Basename collisions defeat careful agents.** Two files are named `gianlucas_bedroom.yaml` (`dashboards/kohbo/rooms/upper_floor/` and `packages/house/areas/upper_floor/`). Task-1 conflated them. This repo already has a documented basename hazard via `!include_dir_named`; it bites paths too, not just package keys.

## Recommendations

- **Continue**: reference-implementation-as-spec; verifying agent claims before acting on them; itemizing folded-in bug fixes separately from requested scope.
- **Start**: scope entity audits by *entity prefix across the whole repo*, not by room directory. The correct query is "every file mentioning `gianluca`", not "every file under `packages/gianluca_room/`". Add a full-diff entity re-check as a standing final gate — it caught 4 of 5 findings here.
- **Stop**: trusting a room package to contain all of a room's references.

## Follow-ups

Deliberately not fixed — all reported to John:

1. **Occupancy deadlock (Gianluca).** `gianlucas_room_not_occupied` requires bulbs OFF to clear occupancy; `gianluca_bedroom_lights_off` requires NOT-occupied to turn bulbs off. Leave with lights on → room never goes unoccupied → lights never turn off. Identical to the Office symptom. Needs an occupancy-logic decision.
2. **Two undefined `people_list` sensors.** `sensor.dining_room_people_list` and `sensor.upstairs_hallway_people_list` are referenced but no template defines them anywhere. Missing feature, not a typo.
3. **Re-run the house-level sweep against the Office.** The Office fix had the same room-scoped blind spot; `packages/house/areas/main_floor/` was never checked.
4. **`automation/gianlucas_room/`** — six files still on legacy syntax. No entity bugs, outside this PRD's directory scope.
5. **`gianluca_heater_on_upon_arrival.yaml`** — pre-existing typo `group.familiy` (should be `family`). Unrelated bug class.
6. **`gianluca_lights_off.yaml`** — automation id `gianluca_bedroom_lights_off` doesn't match its filename. Pre-existing convention drift.
