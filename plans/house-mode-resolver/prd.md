# PRD: House Mode Resolver

Plan: plans/house-mode-resolver/plan.md. Pre-mortem and review folded in (D1-D3 required, B1-B4 noted). Single PR.

## Goal

input_select.house is always derived from current state by one resolver; bedtime ending with quiet on lands in Quiet, Vacation is never overwritten by Bedtime, an arriving adult who isn't in bed ends bedtime, and the night path can never disarm the house.

## Reconciled with master

PR #87 already shipped OD-1: `bedtime_mode_on` triggers on `person.*` leaving home and `bedtime_mode_off_on_arrival` exists (plan Task 6). Neither is recreated.

## Tasks

### task-1: Resolver, side-effect automations, delete legacy writers (plan Tasks 1-3)

One commit: add packages/house/modes/house_mode_resolve.yaml plus the four transition automations, and delete automation/house/modes/*.yaml so there is never a window with two writers.

Acceptance criteria:
- house_mode_resolve is mode queued with max 10, initial_state on, and its run computes `resolved` in a variables ACTION step (not automation-level variables) and gates on a template condition ACTION step before input_select.select_option
- Priority Vacation (empty AND vacation on AND (trigger empty_hold/restart OR house_occupied off >= 120 s)), Away (empty), Bedtime, Quiet, else Auto; `resolved` is empty when any of the four inputs is not on/off, and the run does nothing when resolved is empty, equals the current option, or the select is unknown/unavailable
- Triggers: house_occupied to off (immediate), to on for 10 s, to off for 2 min (id empty_hold); vacation_mode/bedtime/quiet_mode to on/off; homeassistant start and automation_reloaded (id restart); it never triggers on input_select.house
- house_mode_doorbell_text maps Auto WELCOME!, Away/Bedtime DO NOT DISTURB, Quiet SHHH…KIDS SLEEPING, Vacation Please do not disturb! (identical strings); house_mode_speech_on, house_mode_away_notification, house_mode_quiet_speech_off keep the old actions and the 12:00-15:00 nap window
- automation/house/modes/ no longer exists; the only writers of input_select.house are the resolver and scripts/house/house_away.yaml; no file named house_mode_* collides in packages/
- Modern syntax, one automation per file, filename == id, header title + 1-3 lines

### task-2: Rewrite bedtime_mode_off (plan Task 4)

Per-person triggers, before-noon bound, any home adult awake or no adult home.

Acceptance criteria:
- Triggers: john_is_in_bed/cristina_in_bed to off, the two is_awake to on, 06:30, sunrise; binary_sensor.everybody_in_bed is no longer a trigger
- Time condition 05:00 to 12:00; template passes when an adult whose person is home is awake, or when neither adult is home (both known); unknown/unavailable persons never count as away
- Uses target:, modern syntax, initial_state on kept

### task-3: Room Auto accepts Quiet (plan Task 5 + OD-9)

The 10 packages room Auto files and the legacy family room file trigger on and require [Auto, Quiet]; foyer_mode_auto triggers on [Auto, Quiet]. The family room file is modernized (id and alias unchanged).

Acceptance criteria:
- Each of the 11 files has exactly two input_select.house references, both [Auto, Quiet]
- Grep shows the only remaining automation that requires house == Auto is packages/hourly_dong.yaml
- foyer_mode_auto triggers on [Auto, Quiet]; upstairs_hallway_mode_auto untouched (OD-9)

### task-4: Alarm guard + arrival header (plan Tasks 6-7, review D2)

Bound alarm_disarm_in_morning to the morning and re-check after its wait. Update the bedtime_mode_off_on_arrival header (no longer says Auto). Do not recreate that automation.

Acceptance criteria:
- alarm_disarm_in_morning start conditions include time 05:00 to 12:00
- Between the wait and alarmo.disarm there are state conditions: bedtime off, alarm armed_home, house_occupied on; no time re-check after the wait
- bedtime_mode_off_on_arrival keeps its triggers, conditions and action; only the header comment changes

### task-5: Docs and LEARNINGS (plan Task 8)

packages/house/LEARNINGS.md (rewrite stale house_mode_auto/away text, state-derived mode, don't hard-code input_select.house options, stale alarm paragraph), packages/security/LEARNINGS.md, docs/PEOPLE.md, docs/ROOMS.md, docs/AUTOMATIONS.md, packages/CLAUDE.md house-mode line, dashboards README if it names the old automations.

Acceptance criteria:
- grep for house_mode_(auto|away|bedtime|quiet|vacation) outside plans/ and tests finds nothing stale
- PEOPLE.md says bedtime ends when one home adult is up; ROOMS.md says Quiet counts as Auto for room Auto; AUTOMATIONS.md House Modes has one line on the resolver
- No PII in any added text

### task-6: Tests, sabotage, live drift check (plan Task 9)

tests/test_house_mode_resolver.py covers priority, restart, unknown inputs, queued-run ordering, side effects, bedtime off, alarm, rooms, single writer. Sabotage each guard. Read-only live comparison.

Acceptance criteria:
- Full suite passes from tests/
- Each sabotage (resolver priority swap, remove restart clause, automation-level variables, alarm before:, post-wait re-checks, room Quiet revert, bedtime_off away branch) turns a test red
- Live select vs computed value recorded in the build log; no HA service called
