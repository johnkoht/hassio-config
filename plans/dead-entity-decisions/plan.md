---
title: Dead Entity Decisions
slug: dead-entity-decisions
status: approved
approved: 2026-11-13
approval_note: "John, 2026-11-13 (relayed): approve with the plan's recommendations — 10 rain delete, 11 UV delete, 12 heater arrival fix yes, 6 rename to calendar.john_work + disable _2 (no history rewrite), 9a add guard (re-pair held for John), 9 delete bathroom heater, 13 mudroom Auto→Motion, 8 calendar.house_chores, 5 delete Katia observation, 4 Cristina cleanup, select-option fixes + guard test. Held: anything needing a restart to take effect (PR A proxies) and the Nino sensor re-pair."
created: 2026-11-12
issues: [JK-1232]
related: [room-lighting-override, monitoring-dashboards]
has_pre_mortem: false
has_review: false
has_prd: false
---

# Dead Entity Decisions

## Problem

The 10-29 audit compared every entity reference in the repo with the live Yellow. PRs #77–#79 fixed the high-confidence items. JK-1232 holds the leftovers, where the right entity was ambiguous or reviving an automation is a product call. HA has since moved to epicurus (11-07), so the Yellow findings are stale. Some are now fixed, one has changed, and re-checking turned up two new problems in the same area.

## Goal

Every JK-1232 item gets a verified status on epicurus and a recommended answer, so John can approve it in one pass. After approval, the fixes ship in three small PRs, each pinned by a regression test.

## How this was verified (2026-11-12, read-only)

- Took a snapshot of `/api/states`, `core.entity_registry`, `core.device_registry`, `core.area_registry` and `core.config_entries` from epicurus, and pulled recorder history through `/api/history` (epicurus history starts 11-07).
- Requested a snapshot (GET) from each `platform: proxy` camera with `/api/camera_proxy/<entity>`.
- Read the HA log for template errors from the last 24h.
- Checked the repo at `master` (e6cd8454) plus open PR #151.

**What the tests cover today.** `tests/test_dead_entity_regressions.py` pins only the #79 renames (Cristina's reload, NWS, birthdays, `group.familiy`, foyer `Bedtime`). `tests/test_entity_references.py` needs `.storage/core.entity_registry`, and it isn't on a dev machine, so it **skips** locally and in CI. `tests/test_room_select_options.py` checks only `input_select.select_option` calls (its `KNOWN_VIOLATIONS` is empty now). It does not check state conditions or triggers, so none of the select-option items below are covered.

## Item-by-item status and recommendation

### Security / safety

**1. `binary_sensor.cameras_available`: still broken.**
- The `_3` and `_4` uptime sensors don't exist. The template also filters entity ID strings, not their states, so it always reports 0 offline (it's `on` right now).
- There are 7 Protect cameras live, and each has an uptime sensor:
  - Garage Driveway: `sensor.g4_bullet_uptime`
  - Backyard South: `_2`
  - Backyard Pool: `sensor.backyard_pool_uptime`
  - Backyard Northwest: `sensor.backyard_northwest_uptime`
  - Driveway Front: `sensor.driveway_front_camera_uptime`
  - Front Door: `sensor.front_door_camera_uptime`
  - Backyard Porch: `sensor.g5_turret_ultra_uptime_2`

  `_3`/`_4` map to Pool and Northwest (the device registry puts the `g4_bullet_*_3/_4` siblings on those two cameras).
- Nothing in the repo uses the sensor. Only `plans/monitoring-dashboards/backlog.md` refers to it.
- **Recommendation:** use the two live sensors in place of `_3`/`_4`. Define the list once and map it to states (`select('is_state', 'unavailable')` or `expand | selectattr('state', 'in', [...])`). Keep `total_cameras: 7`.

**2. Porch proxy camera: still broken (confirmed).**
- `backyard_porch_camera_proxy.yaml` proxies `camera.backyard_porch_camera_high_resolution_channel`, which is in the deleted-entities list. A snapshot request returns **HTTP 500**.
- Front door, south, driveway and garage return 200. They also sit at `idle`, which is normal for proxies, so `idle` alone doesn't mean a proxy is broken.
- The Protect entity for the porch is `camera.g5_turret_ultra_high_resolution_channel` (device "Backyard Porch", area Backyard). `camera.backyard_porch` is the Frigate one.
- **Recommendation:** point the proxy at the Protect entity, like the other six do. This renames the proxy entity to `camera.camera_proxy_camera_g5_turret_ultra_high_resolution_channel`, so update the porch person/animal detection files to match. Fix the "real entity is `camera.backyard_porch`" line in `packages/security/cameras/LEARNINGS.md`.

**3. Northwest and pool proxy cameras: still missing.**
- The detection files already reference `camera.camera_proxy_camera_backyard_{northwest,pool}_high_resolution_channel`, but no proxy file creates them.
- Both Protect sources are live (`recording`).
- **Recommendation:** add `backyard_northwest_camera_proxy.yaml` and `backyard_pool_camera_proxy.yaml` with `entity_id: camera.backyard_{northwest,pool}_high_resolution_channel`. The derived IDs then match what the detection files already use, so no other edits are needed.

### Presence

**4. Cristina: already fixed.**
- `fd36fd1b` (10-14) commented out every `cfalb_iphone_17_nmap` observation, because nmap can't see phones from the Servers VLAN.
- Neither candidate would help. `cfalb_nmap` and `cfalb_iphone_14_nmap` are both nmap trackers and both read `not_home` while she's home.
- **Recommendation:** no change to presence logic. Delete the commented-out nmap blocks in `binary_sensors/cristina/cristina_presence.yaml` as cleanup.
- **New finding, flagged only:** her Bayesian sensor still has a `cristinas_iphone_14_unifi` observation. That's her old phone, and it reads `not_home` while she's home. Her presence stays `on` because the app, detect and room observations outweigh it. There's no UniFi tracker for the new phone. This goes to a follow-up, not this plan.

**5. Katia: still broken. Delete the observation; don't repoint it.**
- `device_tracker.katia_backup_ping_tracker` doesn't exist. It came from the `.DISABLED` ping file and pinged a second, now-gone device.
- `katia_ping_tracker_2` is live, but it pings **the same IP** as `device_tracker.katia_iphone_15`, the UniFi observation that's already in the sensor. Adding it would count one phone twice. `docs/PRESENCE.md` also says ping is unreliable for sleeping iPhones.
- Worked numbers (prior 0.58, threshold 0.97). With UniFi home + detect home + ping `not_home`, the posterior is ≈ **0.9703**, a hair over the threshold, so she would flap.
- A missing entity is ignored by the Bayesian sensor, so deleting the observation changes nothing live.
- PR #151 (open) gates `katia_is_home` on `katia_iphone_detect`. It touches different lines and doesn't conflict. With #151, the Bayesian sensor matters only as a trigger and for the away logic.
- **Recommendation:** delete the observation.

### Calendars

**6. Work calendar: changed, no longer broken. A privacy item remains.**
- On epicurus, both `calendar.john_koht_<work-domain>_com` and `..._2` are live. They have the same next event and both have `message`/`start_time`.
  - The unsuffixed one belongs to a dedicated Google config entry for the work account.
  - `_2` comes from the personal Google entry, where the work calendar is shared.
- So the repo reference works again, and nothing needs to be repointed.
- The privacy problem stands. The entity ID contains the employer's domain, in 4 references across `packages/people/john/focus_mode/calendar_focus_mode_sensor.yaml` and `packages/people/john/daily_report/john_calendar_events_today.yaml`. It has been in public history for a long time.
- **Recommendation:**
  1. John renames the unsuffixed entity in the UI to a generic `calendar.john_work`.
  2. The PR updates both files in the same deploy.
  3. Optionally, disable the duplicate `_2`.
  4. Rewriting history is John's call. The guidance on rewriting history before merge is for fresh slips; this one is old and spread across many commits, so the recommendation is to leave history alone.

**7. Personal-time calendars: already fixed.** `5e2bd211` ("DnD from camera/mic only, drop calendar DnD") deleted every reference to the `block`/`ooo`/`gsd` calendars. Nothing to do.

**8. Garbage day: still broken. Clear replacement found.**
- `calendar.garbage_day` doesn't exist, and `binary_sensor.tomorrow_is_garbage_day` is `unavailable`.
- `calendar.house_chores` is live. From October through December, all 13 of its events are titled "Garbage Day".
- **Recommendation:** use `calendar.house_chores` in its 3 references (`garbage_day_on`, `garbage_day_off`, `tomorrow_is_garbage_day`). Modernize the root-level `entity_id` actions in the files we touch.
- **Side effect John should know about:** the "garbage day tomorrow" reminder starts firing again. That's the intent, but it will be new to the house.

### Climate / weather

**9. Nino bathroom heater: still broken. The bathroom package is superseded.**
- `sensor.aqara_weather_sensor_1_temperature` is gone. The likely successor is the Aqara device renamed "Nino's Bathroom Climate" (`sensor.nino_s_bathroom_climate_temperature`, renamed 04-27), but it's `unavailable` too.
- More important, the bathroom package and `ninos_bedroom_heater.yaml` drive **the same plug** (`switch.smart_plug_2_switch`, friendly name "Nino's Heater").
- The bathroom package's enabler and its on automation last fired in December 2022, and its arrival automation in December 2023. The bedroom heater is the one actually in use (last run 2025-09).
- **Recommendation:** delete `packages/ninos_room/ninos_bathroom_heater.yaml`, then remove its `CASES` row from `test_dead_entity_regressions.py` and add a "file is gone" test.

**9a. New finding: the Nino bedroom heater is dead too.**
- It reads `sensor.nino_room_temperature` (Aqara "Nino Room Climate"), which has been `unavailable` since at least the cutover. The HA log shows `float got invalid input 'unavailable'` errors from `nino_bedroom_heater_on/off` today.
- Both Nino Aqara weather sensors are offline. That looks like a device or mesh problem (battery or rejoin), not a repo problem.
- **Recommendation:** John checks or re-pairs the two Nino Aqara sensors (homelab can confirm from ZHA). In the repo, make the bedroom heater fail safe: a `float(none)` / `is_number` guard so an unavailable sensor never satisfies `< 69.5` (a bare `float(0)` would turn the heater **on**).
- Don't switch it to `sensor.nino_room_mean_temperature`. That's a `min_max` helper over the Aqara, the door sensor (reads warm, ~73°F) and the Awair. The heater thresholds were tuned against the Aqara alone.

**10. Tempest rain alert: still broken. The live sensors can drive it, but only through a derived accumulation sensor.**

John asked whether there are updated sensors. Live rain entities from the local `weatherflow` integration (the only WeatherFlow config entry):

| Entity | Unit | state_class | What it is |
|---|---|---|---|
| `sensor.tempest_precipitation` | mm | `total` | Rain in the **last 1-minute report**. It drops back to 0 every minute, so it isn't a running total |
| `sensor.tempest_precipitation_intensity` | in/h | `measurement` | That same minute scaled to an hourly rate (1.595 mm/min × 60 ÷ 25.4 = 3.77 in/h) |
| `sensor.tempest_precipitation_type` | enum | none | `none` / `rain` / … |
| `event.tempest_precipitation_start` | — | — | Fires when rain starts |

- There's **no daily or rolling accumulation sensor** in the local integration (the cloud integration isn't installed). The old `tempest_rain_amount`/`_rate` IDs have no successor.
- The only accumulation sensors are PirateWeather's, and they're forecast, not measured (`pirateweather_precip_accumulation_0h…`, in inches). `severe_rain_incoming` already uses them.
- The 11-10 event in full: 19:38–19:41 UTC, three one-minute reports of 0.057 / 1.595 / 0.137 mm. That's **≈1.8 mm ≈ 0.07 in in total**, but the intensity peaked at **3.77 in/h**. Any trigger on the rate alone would have announced house-wide over 0.07 in of rain.

**Proposal, if John wants measured rain:**
1. `sensor.tempest_rain_total` (inches): an `integration` (Riemann sum) sensor over `sensor.tempest_precipitation_intensity`, with `unit_time: h`, `method: left` and `max_sub_interval: 00:01:00`. It integrates the rate over time, so steady rain that holds the same value minute after minute still counts.
   - Don't use a `statistics` `sum` over `tempest_precipitation`. HA writes no state change when the value repeats, so steady rain would be undercounted.
2. `sensor.tempest_rain_last_hour`: `statistics`, `characteristic: change`, `max_age: 01:00:00`, over `tempest_rain_total`.
3. `sensor.tempest_rain_today`: a `utility_meter` with `cycle: daily` over `tempest_rain_total`.
4. Rewrite the alert to trigger on accumulation, not rate:
   - `tempest_rain_last_hour` above **0.5 in**: "heavy rain, check the basement", `high`.
   - `tempest_rain_today` above **1.0 in**: `normal`.
   - Above **2.0 in**: `high`.
   - Gate on `house_occupied`, and hold each trigger with `for: 00:05:00`.

   The 11-10 shower (0.07 in) stays far below every threshold, so the 3.77 in/h spike can't announce. Fix the one-argument `state_attr()` templates (`states(...) | float(0)`).
- Cost: three new YAML sensors. `integration` and `utility_meter` from YAML need a **restart** (John's call), or they can be made as UI helpers.
- **Recommendation:** still **delete**, because the forecast alert plus the basement leak sensors already cover the risk. If John wants rain measured at the house, take the proposal above as its own PR (PR D).

**11. UV alert: still dead. A good live sensor exists.**

John asked whether there's an updated sensor. Live UV index sensors, with daily maxima since 11-07:

| Entity | Source | Updates | Daily max 11-08 → 11-12 |
|---|---|---|---|
| `sensor.tempest_uv_index` | Tempest, measured at the house | every minute (~1,500 rows) | 2.93, 2.95, 2.83, 2.12, 2.43 |
| `sensor.pirateweather_uv_index` | PirateWeather, current conditions (forecast model) | hourly | 2.46, 2.36, 3.13, 2.04, 1.82 |
| `sensor.tomorrow_io_home_uv_index` | Tomorrow.io, whole numbers | sparse (21 rows) | 2, 3, 2, 2, 1 |

- `sensor.openweathermap_uv_index` exists but its integration is disabled. OpenUV isn't installed.
- All three live sensors agree, and they're sane for November in the Midwest (a peak of about 2–3).
- **Best sensor:** `sensor.tempest_uv_index`, a direct replacement for the dead `sensor.tempest_uv` (measured, fine-grained, same device as the rest of the alert).

**If kept, the rewrite would be:**
- One `numeric_state` trigger above **8** with `for: 00:10:00`, so a passing break in the clouds doesn't fire it.
- Fire at most once a day.
- A passive push only, with no house-wide voice.
- Templates read `states('sensor.tempest_uv_index') | float(0)`.

It would essentially never fire from October to March.

- **Recommendation:** delete `tempest_high_uv_alert.yaml` and its settings-popup row, then update `packages/weather/LEARNINGS.md`. A UV alert announced house-wide isn't something the house needs. If John wants it anyway, take the passive-push rewrite above.

### Heater arrival automations

**12. Heater arrival: the "Just Arrived" path is broken for certain. Only the "house just became occupied" path can work.**

The three automations are `gianluca_heater_on_upon_arrival`, `ninos_bedroom_heater_turn_on_upon_arrival`, and the bathroom one (deleted under item 9).

**What the states actually are (logbook since 11-07):**
- `person.john_koht` and `person.cristina_falbo` only take `home`, `not_home`, or a named zone. They never take "Just Arrived".
- "Just Arrived" lives only on `input_select.john_status` and `input_select.cristina_status_dropdown`. `mark_person_as_just_arrived` sets it on each arrival and returns it to `Home` 5 minutes later. Since 11-07 that happened on roughly 8 arrivals.
- So the `person.* → "Just Arrived"` trigger can never fire.

**Why the arrival branch could never pass even with a working trigger:**
- It's a state condition listing both people, so it needs **both** to be "Just Arrived" at the same moment. A single arrival can't satisfy it.
- `group.family` going `not_home → home` does fire (the trigger works), but it then hits that same impossible condition.

**Did they run?**
- None of the three ran in the window. The logbook shows only the 11-07 cutover reload.
- `last_triggered`: Gianluca 2026-03-29, Nino bedroom 2025-05-03, Nino bathroom 2023-12-22.
- The house-occupied branch fired as a trigger on each return (11-08, 11-09, 11-10, 11-11, 11-12), but every return was before **18:30** local, so the time condition stopped it.

**Plain answer:**
- Today, a heater comes on at arrival **only** when the house was empty (`house_occupied` off → on) **and** the return is after 18:30 **and** the room is cold.
- One parent arriving while someone is already home (say, the kids with a sitter) does nothing.
- Nino's version can't run at all right now, because its temperature condition reads the offline Aqara (item 9a).

**Fix (replaces the earlier "delete the branch" recommendation):**
- Trigger on `input_select.john_status` / `input_select.cristina_status_dropdown` with `to: "Just Arrived"`.
- Replace the both-people condition with an **or**: the trigger was the status change, or `house_occupied` changed in the last 5 minutes.
- Drop the `person.*` and `group.family` triggers, since the status selects already cover them.
- Keep the 18:30, temperature and plug conditions.

This gives John what the automation always meant: warm the kid's room when a parent comes home in the evening, even if the house was already occupied.

- Note: `input_boolean.house_occupied` covers a fully empty house, so the two triggers can both fire on one arrival. `mode: single` and the plug-off condition make the second one a no-op.
- `gianluca_heater_on_upon_arrival.yaml` still uses legacy syntax (`trigger:`/`platform:`/`service:`), so modernize it while it's open.
- Tests: the trigger names the status selects with `to: "Just Arrived"`, and the arrival condition is an `or`, not a multi-entity state condition.

### Select options (JK-1145 Phase 5 fold-in)

**13. 10 references in 7 files: still broken. Room-lighting-override didn't touch these.**
- It shipped with a `select_option` ratchet. Every one below is a state condition or trigger, which that ratchet doesn't check.
- The issue said 16 in 10 files. Main bedroom no longer appears, and the garage now does.
- Live options:
  - `input_select.house`: Auto/Away/Vacation/Bedtime/Quiet/Entertainment (no `Off`/`On`)
  - `family_room`: Auto/Away/Off (no `On`)
  - `mudroom`: On/Motion/Away/Night Motion (no `Auto`)
  - `main_bathroom`: Auto/Bedtime/Motion/Off (no `Wake`)

| File | Bad reference | Live | Recommendation |
|---|---|---|---|
| `packages/foyer/lights/foyer_lights_to_off.yaml` | house `Off` (and-branch) | enabled | Delete the dead branch |
| `packages/family_room/lights/family_room_lights_to_off.yaml` | house `Off` trigger + and-branch | enabled | Delete the trigger + branch |
| `packages/mudroom/lights/mudroom_lights_to_away.yaml` | mudroom `Auto` | enabled | Change to `Motion`, the mudroom's default (live state now). Revives "lights off when the house goes Away", as intended; the mudroom LEARNINGS already calls this out |
| `packages/main_bathroom/mode/main_bathroom_mode_auto.yaml` | main_bathroom `Wake` trigger | enabled | Delete the trigger (the main bedroom `Wake` trigger covers waking) |
| `packages/family_room/lights/family_room_lights_to_on.yaml` | family_room `On`, house `On` | disabled since 2022 | Delete the file |
| `packages/family_room/modes/family_room_mode_on.yaml` | family_room `On` | disabled since 2022 | Delete the file |
| `automation/garage/lights/garage_lights_to_off.yaml` | house `Off` | disabled since 2022 | Delete the file |

**Guard:** extend `test_room_select_options.py`, or add a sibling test, so that `state`/`to`/`from` values on `input_select.*` must be defined options, ignoring `unknown`/`unavailable`. The scan in this plan is the prototype. Templated `entity_id` targets (`people_status_*`) are false positives to skip.

## Grouping for approval

**Safe to fix with the recommendation (no product change):** 1, 2, 3, 4 (cleanup), 5, 8, 13.

**Needs John's choice:** 6 (rename + history), 9a (fix the device, then confirm the guard), 10 (delete vs. a measured-accumulation rewrite), 11 (delete vs. a passive push from `tempest_uv_index`), 12 (repoint arrival to the status selects: recommended, and a small behaviour change because heaters will now come on when one parent arrives after 18:30 while the house is already occupied).

**Delete:** 9 (bathroom heater package), 10 and 11 (if he takes the recommendations), and the three disabled select-option files in 13.

**Already fixed, close out:** 4 (presence logic), 7.

## Approach

Repo edits only, plus two live actions John does himself: the calendar rename and the Nino sensor check. Each fix gets a row in `test_dead_entity_regressions.py` (new name present, old one absent) or a file-absent assertion, so a revert goes red. The cameras get a behavioural test: the cameras list has 7 live IDs and the template maps them to states. No restart is needed. Templates, automations and the `camera` platform need a reload, but the new proxy cameras (a YAML platform) **do need a restart**. That's John's call, so PR A tells him and doesn't restart.

## Tasks

1. **PR A: security cameras (items 1–3).**
   - Fix the `cameras_available` list and states mapping.
   - Repoint the porch proxy and update its two detection files.
   - Add the northwest and pool proxy files.
   - Fix the camera LEARNINGS line.
   - Tests: the camera list matches the 7 live uptime IDs, and every `proxy_camera:` in `detections/**` has a matching proxy source file.
2. **PR B: dead references (items 4 cleanup, 5, 8, 12, 13). Item 12 is the only behaviour change and ships once John approves it.**
   - Delete Katia's dead observation and the commented-out Cristina nmap blocks.
   - Use `calendar.house_chores` for garbage day.
   - Repoint the heater arrival triggers to the status selects, turn the both-people condition into an `or`, and modernize the Gianluca file.
   - Fix the select options per the table and delete the three disabled files.
   - Add the select-option state guard test.
   - Update `docs/PRESENCE.md`/package READMEs where they name the removed inputs.
   - Rebase after #151 merges (the Katia files are adjacent).
3. **PR C: decisions (items 6, 9, 9a, 10, 11), after John answers.** If John keeps measured rain, the three accumulation sensors and the rewritten alert go in a separate PR D, because they need a restart.
   - Generic work calendar ID in the two files, deployed with the UI rename.
   - Delete the bathroom heater package.
   - Bedroom heater unavailable guard.
   - Delete or rewrite the rain and UV alerts, plus their settings-popup rows.
   - Update `packages/weather/LEARNINGS.md`.
4. **Close JK-1232.** Note items 4 and 7 as fixed by earlier commits, and open a follow-up for Cristina's stale UniFi observation (new finding in 4).

## Risks

- **Reviving dormant behaviour** (garbage reminder, mudroom-away lights off, NW/pool snapshots): each is the stated intent of its automation. They're called out above so John isn't surprised.
- **The proxy rename breaks a hidden consumer:** grep found only the two porch detection files. Dashboards use the Frigate/Protect entities, not proxies.
- **New proxies need a restart:** say so in the PR, and don't restart (John restarts).
- **Calendar rename and deploy out of order:** the focus-mode sensor falls back cleanly when the calendar is `unknown`. The daily report would miss work events until both land, so deploy in the same window.
- **The Bayesian sensor shifts after removing Katia's observation:** none, because a missing entity is already ignored. Verify `binary_sensor.katia_presence` doesn't change after the reload.
- **The bedroom heater guard hides a dead sensor:** pair it with the device fix. Optionally, a later follow-up adds the Nino sensors to the offline-device alerts.
- **Public repo:** this plan and the PRs refer to the work calendar only as `<work-domain>`. No IPs, MACs or addresses.

On approval → /approve → /ship dead-entity-decisions
