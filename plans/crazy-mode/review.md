# Review: Crazy Mode plan (with pre-mortem)

**Review Path**: Full (9 tasks, 15+ new files, a dashboard change, several integration seams).
**Type**: Plan. Reviewer was the same model as the planner, so the checks below are grounded in the repo files and the live state read on epicurus, not in the plan's own claims.

Expertise profiles: none in this repo (`.build/expertise` absent). LEARNINGS read: packages/house, packages/kitchen, packages/announcements.

## Checklist

| Concern | Result |
|---|---|
| Scope | Right-sized. One script owning the clock is the correct call; per-phase automations could not guarantee Cool-down. |
| Risks | Pre-mortem covers the real ones. Two more found below (refusal speech at the wrong time; fixed-date windows). |
| Dependencies | Helpers, then allowed sensor, then scripts, then guards, then dashboard, then tests, then docs. Correct; tests can be written alongside each task. |
| Patterns | Follows `alarm_flash_lights` (snapshot leaf lights), office call lighting (AL pause and reset on start), kids_wifi (input_datetime), doorbell (engine direct). |
| Backward compatibility | No existing file is edited except `dashboards/kohbo/home/home.yaml` (button + include) and docs. No existing automation is changed. |
| Test coverage | Task 7 lists guards; add Jinja-harness tests for the allowed sensor and the refusal line, as the kids_wifi tests do. |
| Quality gates | `tests/run.sh` full suite. |

## Verified against the repo and live state

- Loop lights are brightness-only: live `supported_color_modes` is `['brightness']` for every member.
- Group membership: `light.kitchen_lights` = main, table, island pendants; `light.dining_room_lights` = dining_room_main_lights + living_room_main_lights; `light.foyer_lights` = ceiling, chandelier, coat closet, stairs light, stairs sconces (so the stairs are in the loop; accepted). `light.family_room_main_lights` is a single entity.
- Adaptive Lighting switches for kitchen, family room, foyer, playroom exist. Family room and kitchen also have sleep-mode switches that read on in the morning; the plan does not touch sleep mode, and the scene restore returns them untouched.
- Sonos: all four speakers list the three favorites. The kitchen and family room are already a group in the live state, which confirms the grouping risk is real.
- `binary_sensor.emergency_active` is a template sensor on alarm triggered, smoke, or manual emergency mode.
- The announcement engine needs `sound_file` and `sound_length` (its delay step has no default), and clamps both volumes to 75.
- `kitchen_lights_manual_change` ignores changes whose context has a `parent_id` and no `user_id`, so script-driven changes do not set the latch themselves; the script sets it deliberately.

## Findings

1. **Refusal speech at the wrong time** (suggestion). The plan speaks every refusal on the kitchen speaker. A refusal for house mode Bedtime or Quiet, or an empty house, must stay silent (that is the reason the mode is refused). Speak only for "outside window" and "already ran". Surface every reason on the dashboard.
2. **Windows are same-day only** (suggestion). Say so in the docs; treat start >= end as unset; an unset window refuses (a fresh deploy is safe until John sets values).
3. **Lockout override mechanism** (suggestion). `input_datetime` with date and time and no `initial` reads 1970 when never set, so "never ran" needs no special case. The override script sets `last_run` back to a fixed old timestamp.
4. **Entertainment house mode** is not refused by the plan. Kept as planned; mention in the hand-off that John can add it.
5. **Reload domains** (suggestion). Prefer an explicit leaf list in the script over a new `light` group (a group needs a restart or YAML reload). Adopted from the pre-mortem.
6. **Alexa naming** (note). Nabu Casa exposes scripts as scenes; the script's `alias` is the spoken name, so alias it "Crazy Mode".

## Devil's advocate

**If this fails, it will be because** the Sonos behaviour is not what the plan assumes: `select_source` on a Spotify favorite starts the playlist but the shuffle or the announce-over-a-joined-group step misbehaves, and the first run sounds wrong. Nothing in the repo can prove that; it is the first supervised run's job, and the plan says so.

**The worst outcome would be** a run that cannot end: the run script dies (restart, error in a step) between starting the music and the restore, leaving the kitchen lights latched and the house on Cool-down music. The mitigations are the restore script being idempotent, the start-up cleanup, and `continue_on_error` on every Sonos and light step so one failed call cannot kill the sequence before restore.

## Verdict

**Approve with suggestions.** No structural blocker. All suggestions are folded into the build; none changes the plan's goal. Deviations to report: the stop-request helper, a separate restore script, AL state captured in the scene, explicit leaf list instead of a new group, silent refusal for non-window reasons.
