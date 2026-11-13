# PRD: Dead Entity Decisions (JK-1232)

## Goal

Fix or retire every JK-1232 dead reference John approved on 2026-11-13, in three independent PRs, each pinned by regression tests so a revert goes red. No HA restart, no live changes by agents.

## PR split and file ownership

The plan's split, with one packaging change from the pre-mortem (R1): **items 9 and 9a move from PR C to PR B**, so every heater file and `tests/test_dead_entity_regressions.py` belong to one PR. No file is edited by two PRs.

| PR | Branch | Items | Owns |
|---|---|---|---|
| A | `feature/dead-entity-decisions-a` | 1, 2, 3 | `packages/security/cameras/**`, a new camera test file |
| B | `feature/dead-entity-decisions-b` | 4 (cleanup), 5, 8, 9, 9a, 12, 13 | Katia/Cristina presence, `packages/reminders/garbage_day/**`, heater files, the item-13 files, `tests/test_dead_entity_regressions.py`, `tests/test_room_select_options.py` (or a sibling), the room-migration/room-lighting manifest tests, `docs/PRESENCE.md`, Nino rows of `docs/climate_automation_plan.md`, `packages/ninos_room/LEARNINGS.md` |
| C | `feature/dead-entity-decisions-c` | 6, 10, 11 | John's calendar files, `packages/weather/tempest_alerts/**`, the climate settings popup, `tests/test_deep_links_climate_weather.py`, `packages/weather/LEARNINGS.md`, Tempest rows of `docs/climate_automation_plan.md` |

All three branch from the plan-artifact commit on `origin/master`. Merge order doesn't matter. New tests go in **new per-PR test files** (`tests/test_dead_entity_cameras.py`, `tests/test_dead_entity_b.py`, `tests/test_dead_entity_decisions_c.py`); only PR B edits the existing `tests/test_dead_entity_regressions.py`.

**Before deleting or editing any automation, grep `tests/` for its id and alias** (review devil's advocate: the likeliest failure is a pinning test nobody grepped for).

## Quality gates (every task)

- `cd <worktree>/tests && /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q` — all pass (baseline 1410 passed, 9 skipped). System `python3` has no pytest; use that venv. Must be run from the `tests/` directory.
- `yamllint -c .yamllint .` from the worktree root — exit 0.
- gitleaks runs in the commit hook. Never `--no-verify`.
- HA `check_config` runs in CI on the PR (`.github/workflows/ha-check.yml`). Never run `deploy.sh`.
- Privacy: no employer domain, routines, IPs or addresses in added lines, commit messages or PR bodies. Write `<work-domain>`.

## Tasks

### Task 1 (PR A): Security cameras — items 1, 2, 3

**Description:** Fix `binary_sensor.cameras_available`, repoint the porch proxy, add the missing northwest and pool proxies, fix the camera LEARNINGS line.

**Acceptance criteria:**
- `packages/security/cameras/cameras_available.yaml` lists exactly these 7 uptime sensors. Today the list is repeated three times (state, `unavailable_count`, `unavailable_list`); either define it once (YAML anchor, if the repo's loaders accept it) or keep one `{% set %}` per template — the test checks every copy, and the state and both attributes are computed from the sensors' **states**, not their IDs: `sensor.g4_bullet_uptime`, `sensor.g4_bullet_uptime_2`, `sensor.backyard_pool_uptime`, `sensor.backyard_northwest_uptime`, `sensor.driveway_front_camera_uptime`, `sensor.front_door_camera_uptime`, `sensor.g5_turret_ultra_uptime_2`. `total_cameras: 7` stays. Neither `sensor.g4_bullet_uptime_3` nor `_4` appears.
- A test renders all three templates with `jinja2` and a stubbed `states()` and shows: all 7 online → `True`/count 0; one `unavailable` → `False`, `unavailable_count` 1 and that ID in `unavailable_list`. Sabotage: reverting to filtering IDs makes it go red.
- `backyard_porch_camera_proxy.yaml` proxies `camera.g5_turret_ultra_high_resolution_channel`; the old `camera.backyard_porch_camera_high_resolution_channel` appears nowhere in the repo outside `plans/`/`memory/`.
- The porch person and animal detection files reference `camera.camera_proxy_camera_g5_turret_ultra_high_resolution_channel`; every other reference to the old porch proxy entity ID in the repo (dashboards included) is updated.
- New `backyard_northwest_camera_proxy.yaml` and `backyard_pool_camera_proxy.yaml`, modelled on the existing proxy files, with `entity_id: camera.backyard_{northwest,pool}_high_resolution_channel`.
- A test asserts every `camera.camera_proxy_*` entity referenced under `packages/security/cameras/detections/**` is produced by a `platform: proxy` file (derive the expected ID as `camera.camera_proxy_` + slug of the source entity ID, and prove the rule against the existing proxies, including the truncated `backyard_south` source, rather than assume it), and no proxy source is the deleted porch entity.
- `packages/security/cameras/LEARNINGS.md` no longer says the porch's real entity is `camera.backyard_porch`; it names the Protect entity and notes `camera.backyard_porch` is Frigate's. Proxy cameras need a restart to appear (one line).

### Task 2 (PR B): Presence and garbage day — items 4 (cleanup), 5, 8

**Description:** Delete Katia's dead backup-ping observation and Cristina's commented-out nmap blocks; point garbage day at `calendar.house_chores` with a garbage filter.

**Acceptance criteria:**
- `packages/people/katia/katia_presence.yaml` has no `katia_backup_ping_tracker` observation; nothing else in that Bayesian sensor changes (prior, threshold, other observations).
- `binary_sensors/cristina/cristina_presence.yaml` has no `cfalb_iphone_17_nmap` lines (the commented nmap blocks around lines 19-24 and 50-60 are gone); other commented blocks stay; no live observation changes.
- `garbage_day_on`, `garbage_day_off` and `tomorrow_is_garbage_day` use `calendar.house_chores`; `calendar.garbage_day` appears nowhere outside `plans/`/`memory/`.
- Both calendar-trigger automations only act when the event summary contains "garbage" (case-insensitive), via a condition on `trigger.calendar_event.summary`.
- `tomorrow_is_garbage_day` is on only when the calendar's next event `message` contains "garbage" and its start **date** equals tomorrow's date (no `day + 1` arithmetic; correct across month ends), and renders `false` (not an error) when `start_time` is missing (today it calls `strptime(None)`).
- Root-level `entity_id` in the touched files' actions moves into `target:`. Aliases and ids unchanged.
- Tests: rows in `tests/test_dead_entity_regressions.py` (new name present, old absent) for each file; a Jinja render test of `tomorrow_is_garbage_day` for: tomorrow garbage → true; Nov 30 → Dec 1 → true; tomorrow non-garbage event → false; missing start_time → false.
- Reviewer found `docs/PRESENCE.md` doesn't name the backup ping, so no doc edit is expected; confirm with a grep and say so. PR body notes that both the "garbage tomorrow" and "garbage today" reminders become reachable again.

### Task 3 (PR B): Heaters — items 9, 9a, 12

**Description:** Delete the superseded Nino bathroom heater package, guard the Nino bedroom heater against an unavailable sensor, and repoint both arrival automations to the status selects.

**Acceptance criteria:**
- `packages/ninos_room/ninos_bathroom_heater.yaml` is deleted; its `CASES` row is removed and a test asserts the file is absent. `packages/ninos_room/LEARNINGS.md` and `docs/climate_automation_plan.md` (Nino rows only) stop describing the bathroom heater/sensor.
- `nino_bedroom_heater_on`, `nino_bedroom_heater_off`: no template reads `sensor.nino_room_temperature` with a bare `| float` (no default). Today bare `float` raises on `unavailable`, so the on-path already can't fire; the guard removes the log errors and defends against a later `float(0)`. On-path templates are false when the state isn't a number (`is_number`/`has_value` guard, or `numeric_state`). Never `float(0)` on an on-path. The off-path keeps reaching its `house_occupied`/room-occupied branches. Test renders each on-path template with `unavailable` → false and with `68` → true; sabotage with `float(0)` goes red.
- `gianluca_heater_turn_on_upon_arrival` and `ninos_bedroom_heater_turn_on_upon_arrival`:
  - Triggers: `input_select.john_status` and `input_select.cristina_status_dropdown` `to: "Just Arrived"`, plus `input_boolean.house_occupied` `to: "on"`. No `person.*` or `group.family` trigger.
  - The arrival condition is an `or` (use trigger ids): the trigger was a status select, or `house_occupied` changed within 5 minutes. No multi-entity state condition requiring both people.
  - Temperature condition is unavailable-safe (`condition: numeric_state` below the existing threshold, or an `is_number` guard); thresholds unchanged (Gianluca 69, Nino 71.5). The 18:30 time condition stays. A "plug is off" condition is added (plan: makes a second trigger a no-op).
  - Gianluca file is modern syntax (`triggers`/`trigger:`/`conditions`/`actions`/`action:`/`target:`); id, alias and `initial_state` unchanged.
  - The `CASES` rows asserting `group.family` in these two files are replaced by assertions on the new triggers. Tests: triggers name both status selects with `to: "Just Arrived"`; no `person.` trigger; arrival condition is an `or`.
- Status-select entity IDs verified against their definitions in the repo (`input_select/people/cristina_status_dropdown.yaml`, `packages/people/john/input_select/john_status.yaml`) and that "Just Arrived" is a defined option of each.

### Task 4 (PR B): Select options — item 13, plus the guard test

**Description:** Fix the 10 bad `input_select` state references in 7 files per the plan's table, and add a guard so `state`/`to`/`from` values on `input_select.*` must be defined options.

**Acceptance criteria:**
- Foyer: delete the house-`Off` and-branch. Family room lights-to-off: delete the house-`Off` trigger and branch. Mudroom lights-to-away: mudroom `Auto` → `Motion`. Main bathroom mode auto: delete the `Wake` trigger. Delete `family_room_lights_to_on.yaml`, `family_room_mode_on.yaml`, `automation/garage/lights/garage_lights_to_off.yaml`.
- Tests pinning the deleted automations are updated deliberately: `test_room_migration_regressions.py` MANIFEST rows (~:25, :30), `test_disabled_family_room_automations_point_at_defined_options` (~:131-135, keep the `family_room_arrival` check) and the docstring (~:3-8); `test_room_lighting_override_regressions.py` `test_family_room_disabled_automations_stay_disabled` (~:840, keep arrival/away checks) and the comment at ~:830. A file-absent assertion is added. `packages/family_room/LEARNINGS.md` (~:11-12, 19) and `packages/mudroom/LEARNINGS.md` (~:15, the "Auto branch is dead, kept verbatim" line) are rewritten to match.
- New guard (extend `tests/test_room_select_options.py` or a sibling): every literal `state:`/`to:`/`from:`/`not_to:`/`not_from:` value (scalars and lists) in a `condition: state`, `trigger: state` or legacy `platform: state` dict whose entity is a repo-defined `input_select.*` must be a defined option. Scan `packages`, `automation`, `scripts`, `scripts.yaml`, `automations.yaml` **and `dashboards/**`**. Skip templated entity IDs, UI-only selects and `unknown`/`unavailable`. Reuses the existing loader and option-definition helpers. Empty allowlist. Sabotage: restoring mudroom `Auto` makes it red.
- Aliases and ids of kept automations unchanged.

### Task 5 (PR C): Decisions — items 6, 10, 11

**Description:** Switch John's work calendar references to the generic `calendar.john_work`; delete the Tempest rain and UV alerts and every reference to them.

**Acceptance criteria:**
- `calendar_focus_mode_sensor.yaml` and `john_calendar_events_today.yaml` use `calendar.john_work`; no `calendar.john_koht_<work-domain>_com` reference remains anywhere in tracked files. The focus-mode `unknown` fallback still works with the new ID.
- A test asserts `calendar.john_work` is present in both files and that **no tracked text file anywhere in the repo** (`git ls-files`, excluding binaries) matches `calendar\.john_koht_[a-z0-9]+_com` (pattern written so the domain literal never appears; it must not match the personal `calendar.john_koht`).
- `packages/weather/tempest_alerts/` is deleted (both files). The two settings-popup rows (`automation.tempest_rain_alert`, `automation.tempest_high_uv_alert`) are removed from `dashboards/kohbo/climate/_climate_settings_popup.yaml`. `tests/test_deep_links_climate_weather.py` drops both entries. `packages/weather/LEARNINGS.md` (~:3) and the test's docstring ("rain, UV") are updated. In `docs/climate_automation_plan.md` (~:82-84) **don't delete the station data rows**: correct `sensor.tempest_uv` → `sensor.tempest_uv_index` and fix or drop `sensor.tempest_rain_rate` (the live rain sensors are `sensor.tempest_precipitation_intensity`/`sensor.tempest_precipitation`).
- `git grep` for `tempest_rain_amount`, `tempest_high_uv_alert`, `tempest_rain_alert`, `tempest_rain_amount_alert` returns nothing outside `plans/` and `memory/`. A test asserts the directory is absent and the popup has neither row.
- No employer domain in added lines, commit message or PR body.

## Live steps (for the release agent, not for builders)

- A: reload template entities (cameras_available). Proxy cameras need a **restart** → held for John.
- B: reload automations, template entities, and Bayesian/binary_sensor (presence) — see per-PR report.
- C: deploy, reload automations + template entities, then rename the work calendar in the UI **immediately** and disable `_2`; then reload template entities once more. Between deploy and rename, `calendar.get_events` on a missing entity aborts the whole daily-report action (personal events drop out too), so keep the window short.
