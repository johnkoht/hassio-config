---
title: Notification Deep Links
slug: notification-deep-links
status: in-progress
created: 2026-10-29
has_pre_mortem: true
has_review: true
has_prd: true
linear: JK-1068
---

# Notification Deep Links

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

## Problem

Tapping a push notification should land on the screen that helps. Today most opens the app on whatever view was last used. Of roughly 108 push call sites in the repo, 21 carry a `url`, and 87 carry none. The protection notifications (leak, fire, camera detections, lock failures) are mixed: some link, some don't. Two details make it worse. `script.general_notification` only ever sends `url` (iOS), never `clickAction` (Android). And the leak `alert:` notifiers and a few direct `notify.*` calls bypass the script entirely, so they can't carry a link at all.

## Goal

Every notification that a person would act on opens the most useful dashboard view or popup. Notifications with nothing to open are listed as deliberately unlinked. A repo test fails if a `general_notification` call names a `url` that doesn't exist in the dashboard, or names none without being on the exempt list.

## Findings

### How a link reaches the phone

- `script.general_notification` (`packages/general_notifications.yaml`) has a `url` field. It defaults to `''` in the sequence (the `/dashboard-kohbo/home` default in the field block is documentation only, never applied). It sends `data.url`. It never sends `data.clickAction`.
- iOS companion app reads `url`. Android companion app reads `clickAction`. This needs a quick check against the current companion docs when we build it, because I'm working from memory of the docs here.
- Every notify target in the repo is the `ios_family` group (`notify.yaml`) or a single `mobile_app_*` device, and the group name says iOS. I found no evidence of an Android phone, so today only `url` matters. Sending both is cheap and future-proofs.
- The script sends an empty `url: ""` when none is given. Harmless today, but cleaner to omit the key when empty.
- Direct callers (`notify.ios_family`, `notify.mobile_app_*`) build `data:` by hand, so each needs its own `url`. The nino medication escalation bypasses the script on purpose (see its header) and must stay that way.
- `alert:` (leak) supports a `data:` mapping that is passed to the notifier, so a link is possible without rewriting the alerts as automations.

### Where links can point (verified in `dashboards/kohbo/`)

Dashboard base is `/dashboard-kohbo/<view path>`. A popup hash only opens if the popup is included in that same view, so a link is `<view>#<hash>` and the pair must match.

| View path | Source | Popups included in that view |
|---|---|---|
| `home` | home/home.yaml | `#notifications`, `#weather`, `#house_mode`, `#main_floor_thermostat`, `#upper_floor_thermostat`, `#front_door_camera`, `#driveway_front_camera` |
| `security` | security/security.yaml | `#front_door_lock_popup`, `#garage_entry_lock_popup` |
| `security-house-locks` | security/pages/house_locks.yaml | `#front_door_lock_popup`, `#garage_entry_lock_popup` |
| `security-garage-doors` | pages/garage_doors.yaml | `#garage_doors_settings_popup` |
| `security-alarm-panel` | pages/alarm_panel.yaml | `#alarm_panel_settings_popup` |
| `security-exterior-doors` | pages/exterior_doors.yaml | `#exterior_doors_settings_popup` |
| `security-windows` | pages/windows.yaml | `#windows_settings_popup` |
| `security-leak-sensors` | pages/leak_sensors.yaml | `#security_settings_popup` |
| `security-cameras` | security/cameras/cameras.yaml | `#front_door_camera`, `#driveway_front_camera`, `#garage_driveway_camera`, `#backyard_south_camera`, `#backyard_porch_camera`, `#backyard_pool_camera`, `#backyard_northwest_camera`, `#security_settings_popup` |
| `main-floor-vacuum` | rooms/main_floor/vacuum.yaml | `#main_floor_quick_clean_popup`, `#main_floor_vacuum_settings_popup` |
| `rooms-laundry` | rooms/laundry/laundry.yaml | none |
| `climate` | climate/climate.yaml | `#weather` |
| `climate-hvac` | climate/hvac.yaml | `#main_floor_thermostat`, `#upper_floor_thermostat`, `#jr_suite_thermostat`, `#main_bedroom_thermostat`, `#ninos_bedroom_thermostat`, `#basement_thermostat`, `#radiant_floor_heating` |
| `sensors` | sensors/sensors.yaml | `#zigbee_routers_popup` |
| `sensors-offline`, `sensors-low-battery` | sensors/ | none |
| `energy`, `school`, `chores`, `holidays`, `people` | | settings popups only |

Room views also exist (`rooms-<room>`, `rooms-main-floor`, `rooms-upper-floor`, `rooms-active`, `interior-lights`, `exterior-lighting`, plants, holiday sub-views). The hash list above was grepped from the YAML, so the first build task regenerates it as a machine-readable map rather than trusting this table.

All seven links already in the repo resolve against this map (`security-cameras#front_door_camera`, `security`, `security-house-locks`, `security-garage-doors`, `security-exterior-doors`, `security-windows`, `main-floor-vacuum`, `climate#weather`).

### Not in the dashboard today (becomes a "needs a popup first" extra)

- Fire or smoke: no fire view or popup.
- UPS or power outage: no UPS view or popup.
- Z-Wave controller, Zigbee coordinator, and AP offline: only the generic `sensors-offline` list exists, with no radio-health popup.
- A "vacuum needs attention" popup: the maintenance reminders only have the vacuum view and a quick-clean popup.

## Audit

Counted by regex over every `script.general_notification` and `notify.*` call, plus hand review of templated and indirect callers. Counts are approximate (templated actions and `script.turn_on` callers are the hard ones), so the first build task generates the authoritative list. Titles are paraphrased on purpose.

Totals: about 108 push call sites in scope (87 use the script, rest direct notifiers, alerts, templated). 21 have a link, 87 do not. Out of scope: two third-party "find my phone" popups under `popup/`, and the TV banner script (not a phone push).

### Protection (Phase 1)

| File | Notification | Today | Proposed target |
|---|---|---|---|
| packages/security/alarm/alarm_triggered.yaml (alert script) | alarm triggered | `/security` | `security-alarm-panel` (disarm is there); keep `security` as the fallback if Open decision 3 says so |
| packages/security/alarm/alarm_triggered.yaml (disabled) | alarm disabled | `/security` | `security-alarm-panel` |
| packages/security/alarm/alarm_arm_home_script.yaml, alarm_arm_if_john_away.yaml, alarm_arm_away_when_vacation_mode.yaml, alarm_disarm_in_morning.yaml, alarm_disarm_when_house_becomes_occupied.yaml | armed / disarmed status (5) | `/security` | keep `security` |
| packages/security/fire_alarm/fire_alarm_triggered.yaml (via `script.turn_on`) | smoke detected | none | `security` for now; fire popup is a needs-popup extra |
| packages/leak_monitoring.yaml `water_leak_alert_home`, `water_leak_alert_away` (alert notifiers, `ios_family`) | leak, repeats | none | `security-leak-sensors` via alert `data:` |
| packages/security/cameras/detection_notifications/camera_detection_alert.yaml (3 branches) | person, vehicle, animal detected | `/security-cameras` | `security-cameras#<camera>` derived from `notifications_boolean` (strip `input_boolean.` and `_notifications`), which matches the popup hashes |
| packages/doorbell_ring.yaml | doorbell | `security-cameras#front_door_camera` | already good |
| packages/security/cameras/camera_notifications/camera_notifications_activate.yaml, camera_notifications_deactivate.yaml | camera alerts on / off (2) | none | `security-cameras` |
| packages/security/doors_left_open.yaml | exterior door left open | `security-exterior-doors` | already good |
| packages/security/windows_left_open.yaml | window left open | `security-windows` | already good |
| packages/garage/doors/garage_doors_close_if_open_too_long.yaml, garage_doors_close_when_empty_house.yaml, garage_doors_close_when_home.yaml | garage open (3) | `security-garage-doors` | already good |
| packages/garage/doors/door_2/garage_door_2_open_upon_arrival.yaml (direct), door_3/garage_door_3_open_upon_arrival.yaml | garage door opened on arrival (2) | none | `security-garage-doors` |
| packages/foyer/front_door_lock/front_door_lock_stuck_alert.yaml, front_door_lock_with_retry.yaml | lock not responding / not locked (2) | `security-house-locks` | upgrade to `security-house-locks#front_door_lock_popup` |
| packages/security/security_unlock_front_door_by_fingerprint.yaml (direct) | fingerprint unlock | none | `security-house-locks#front_door_lock_popup` |
| packages/security/security_status_notification.yaml | shields-up status | none | `security` |
| automations.yaml (UI) | kids escaping, critical | none | exempt (decision 6: John does not use the escape alerts; left in the UI file, unlinked) |
| packages/ninos_room/nino_escaping/nino_escape_monitor.yaml (direct) | escape monitor | none | removed in PR D (decision 6); the monitor and its turn on/off helpers were push-only |
| automations.yaml (UI) | "Test Motion" debug push | none | exempt (looks like leftover debug; suggest deleting separately) |

### Home and systems (Phase 2)

| File | Notification | Today | Proposed target |
|---|---|---|---|
| packages/climate/main_floor/main_floor_climate_to_eco.yaml, main_floor_climate_to_resume.yaml | eco / resume (2) | none | `climate-hvac#main_floor_thermostat` |
| packages/climate/second_floor/second_floor_climate_to_eco.yaml, second_floor_climate_to_resume.yaml | eco / resume (2) | none | `climate-hvac#upper_floor_thermostat` |
| packages/weather/severe_weather_alert/severe_weather_warning.yaml | rain warning (1) | `climate#weather` | already good |
| same file | NWS alert (7 branches) | none | `climate#weather` |
| packages/weather/tempest_alerts/tempest_high_uv_alert.yaml, tempest_rain_amount_alert.yaml | UV, rain (2) | none | `climate#weather` |
| packages/laundry/main_level_dryer/main_level_dryer_complete.yaml, packages/upstairs_laundry/upstairs_laundry_dryer/upstairs_dryer_complete.yaml | dryer done (2) | none | `rooms-laundry` |
| packages/laundry/main_level_washer/main_level_washer_complete_alert.yaml, automation/laundry_upstairs/upstairs_washer/upstairs_washer_complete_alert.yaml (templated direct) | washer done (2) | none | `rooms-laundry`, plus recipient logic stays |
| packages/reminders/robot_vacuum/robot_vacuum_reminders.yaml, robot_vacuum_reorder_reminder.yaml | vacuum maintenance (2) | `main-floor-vacuum` | already good; popup optional (Open decision 4) |
| packages/system/alerts/zigbee_router_unavailable.yaml | router offline | none | `sensors#zigbee_routers_popup` |
| packages/system/alerts/zigbee_coordinator_offline.yaml, zwave_controller_offline.yaml, playroom_ap_unavailable.yaml | radio / AP offline (3) | none | `sensors-offline` |
| packages/system/ups/ups_battery_power_activated.yaml, ups_battery_power_restored.yaml, ups_offline.yaml | UPS (3) | none | needs a popup first; interim `energy` |
| packages/energy/sensors/energy_prices_are_negative.yaml | negative price | none | `energy` |
| packages/school/reminders (4 departure and pickup), packages/school/kids/nino_dropoff_check.yaml | school (5) | none | `school` |
| packages/house/vacation_mode/vacation_mode_turn_on.yaml, vacation_mode_turn_off.yaml | vacation mode (2) | none | `home#house_mode` |
| automation/house/modes/house_mode_away.yaml, scripts/house/house_away.yaml | away mode (2) | none | `home#house_mode` |
| packages/holidays/christmas/modes/christmas_not_activated.yaml (direct) | holiday lights not on | none | `holidays-christmas` |

### Deliberately unlinked (exempt list)

- Passive loggers: family room occupied and not occupied, kitchen and playroom and hallway lights, DnD and work-call and personal-time toggles, nearly-home on and off, arrival and returned-home, work-arrived, person-at-door announcement, party time on and off, full-moon, guest arrived and left. About 27 call sites. Nothing useful to open.
- Reminders with no screen: birthdays (2), garbage day, kids activity, neighborhood event, bedtime, morning update, daily report, daily update. 9 call sites.
- Personal reminders (medication, commute delay, find-my-phone): about 9 call sites across the script, direct, and escalation paths. No dashboard target exists and we should not invent one. The escalation notification stays a direct `notify.ios_family` call by design.
- Unused `scripts.yaml` `notify_engine` and the `popup/` find-my-phone pushes: out of scope.

## Approach

1. Fix the transport once, in `script.general_notification`: send `url` and `clickAction` from one variable, omit both when empty. No call site changes yet, so risk is small.
2. Make the map machine-readable by parsing `dashboards/kohbo/kohbo.yaml` includes (each `path:` plus every `hash:` / `popup_hash:` in that view's include tree). The test reads it, so the map can't rot.
3. Link by phase, protection first, one small PR per theme.
4. Gate with a test, with an explicit exempt list for the deliberately unlinked.

Alternatives considered. A global default of `/dashboard-kohbo/home` for every unlinked notification was rejected as the lazy version: it also lands on whatever is open, and it hides the gaps the test is meant to expose. Rewriting `alert:` into automations was rejected because `data:` already works.

## Tasks

1. Transport fix and test scaffold. `general_notification` sends `url` and `clickAction`, omits empties, and documents both in its header. Add `tests/test_notification_deep_links.py` with the dashboard-map builder. The URL check starts in report-only mode (lists violations, does not fail), so Phase 1 and 2 can land incrementally.
2. Protection PR A, alarm and fire. Alarm triggered and disabled to `security-alarm-panel`, fire to `security`, security status to `security`. Add `url` to the fire `script.turn_on` variables.
3. Protection PR B, cameras. Derive the per-camera hash in `camera_detection_alert.yaml` (3 branches, direct `ios_family`; add `clickAction`), and link camera on and off.
4. Protection PR C, leak. Add `data:` with the link to both leak alerts. Extend `test_leak_monitoring_regressions.py` to assert it.
5. Protection PR D, doors, garage, locks. Link the unlinked garage-arrival pushes and fingerprint, upgrade the lock alerts (front door, and the garage entry evening lock) to the popup hash. The kids escape push is removed instead of linked (decision 6).
6. Phase 2 PR E, climate and weather. HVAC thermostat popups, `climate#weather` on the rest.
7. Phase 2 PR F, house and everyday. Laundry, school, energy, vacation and away, holidays. Include the two direct washer callers.
8. Phase 2 PR G, system alerts. Zigbee, radio, AP to the sensor views.
9. Flip the test to enforcing, add the exempt list (`tests/fixtures/notification_url_exempt.yaml`: path plus one-line reason), and update `docs/` plus the header of `general_notifications.yaml`.
10. Needs-popup extras (dashboard-only, can follow the dashboard auto-merge rule): fire and smoke, UPS and power, radio health. Each ends with a one-line follow-up PR that swaps its interim link.
    **Status (2026-10-30): done in one PR with the link swaps, per John's approval.** `security#fire_smoke_popup` (fire alarm push), `sensors#ups_power_popup` (three UPS pushes; they were exempt, so the interim `energy` link was never applied), `sensors#radio_health_popup` (Zigbee coordinator and Z-Wave controller pushes, moved off `sensors-offline`). Deploy the dashboard before or with the automations.

Phases 1 and 2 touch automations and scripts, so each PR waits for John's go-ahead before merge and deploy. Task 10 is dashboard-only.

## Tests

`tests/test_notification_deep_links.py`:

- Build the map: every view `path` from `kohbo.yaml`, and the hashes defined in that view's include tree (resolve `/config/...` includes to the repo).
- Walk the repo for every `script.general_notification` call (including `script.turn_on` variables and the `automations.yaml` UI ones). Assert each names a `url`, that `url` starts with `/dashboard-kohbo/`, its view exists, and its hash (if any) is defined in that view.
- Calls with a Jinja `url` (camera detection) are checked by expanding the known cameras instead of skipping.
- Calls listed in the exempt fixture must not carry a stale reason: if an exempt call gains a `url`, the test says remove it from the list.
- Direct `notify.ios_family` and `notify.mobile_app_*` calls get the same check, minus the script-only fields.
- A script-level test asserts `clickAction` and `url` come from the same value.
- Existing suites (`test_modern_syntax`, `test_entity_references`) must stay green.

## Open decisions

All resolved by the plan's recommended default (John, 2026-10-30, written authorization to approve the batch; no specific answers given).

1. Android `clickAction`. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: send both `url` and `clickAction` now, since it's one line and iOS ignores `clickAction`. Alternative: skip until an Android phone exists.
2. Exempt mechanism. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: a fixture file (path plus reason). Alternative: an explicit `url: none` in each call, which is more self-documenting but touches about 45 files for no behaviour change.
3. Alarm triggered target. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: `security-alarm-panel`, because disarming is the action. Alternative: stay on `security` (the whole-house score).
4. Vacuum target. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: keep the `main-floor-vacuum` view for maintenance reminders. Use `#main_floor_quick_clean_popup` only for something like "vacuum stuck", if such a notification exists. The ticket says "vacuum popup", so John may want the popup for all of them.
5. Camera hash derivation. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: derive the hash from `notifications_boolean` (fragile if a naming pattern breaks, but the test catches it). Alternative: pass an explicit `popup_hash` field from each of the 21 detection automations.
6. Kids-escape destination. **Resolved (John, 2026-10-30): drop it.** "We can drop the escape notification as I don't use it." PR D removed the Nino escape monitor (`packages/ninos_room/nino_escaping/`: the monitor and its turn on/off helpers, whose only job was the push) instead of linking it. The UI-owned "Kids Escaping" automation in `automations.yaml` is untouched and stays on the exempt list; delete it in the UI if it is also unwanted.
7. Missing screens. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: ship interim links (`security` for fire, `energy` for UPS) and build the popups as task 10. Alternative: leave those unlinked until the popups exist.
8. Test strictness. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: report-only in task 1, enforcing in task 9. Alternative: enforce from the start, which makes every phase PR fix its own violations.
9. Stray debug push. **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: leave the "Test Motion" UI automation alone and exempt it, flagged for John to delete. It is not part of this plan.

## Push pruning (JK-1068 follow-up, John 2026-10-30)

**APPROVED by John 2026-10-30, all rows except 7** ("keep the animal detected, useful if the dog gets out": animal camera detections are unchanged). Applied in the push-pruning PR; see "Applied" below. Original ask: "can we maybe clean up some of these push notifications too? I get a lot and it's annoying. Can you propose a list to cut/turn off for now?"

Basis: the audit above (about 108 push call sites) plus a fresh grep of `packages/`, `automation/` and `scripts/` for `script.general_notification` and `notify.` (95 files). Frequency is judged from the trigger (a state flip or occupancy edge fires many times a day; an alarm or fault fires rarely), not from live counts; the `homelab` agent can pull a real count per tag from the recorder if John wants numbers before choosing. Note two files (`upstairs_dryer_complete.yml`, `today_is_full_moon.yml`) are `.yml`, which HA never loads, so they send nothing today and need no decision.

Actions: **Cut** = delete the push (the automation keeps doing its other job). **Passive** = keep the push but `priority: passive`, so it lands silently in the notification list with no sound or banner. **John-only** = change `devices: "all"` to `"jk"`. **Keep** = leave alone.

### Candidates, highest value first

| # | Action | File(s) | What it says | Reason |
|---|---|---|---|---|
| 1 | Cut | `automation/family_room/family_room_occupied.yaml`, `family_room_not_occupied.yaml` | "Family Room Logger": room is / is no longer occupied (passive, John) | Fires on every occupancy flip, many times a day. A logger, not an alert; the logbook has it. |
| 2 | Cut | `packages/kitchen/lights/kitchen_lights_manually_turned_on.yaml`, `kitchen_lights_turned_off.yaml`, `packages/playroom/lights/playroom_lights_turned_off.yaml`, `packages/upstairs_hallway/lights/upstairs_hallway_lights_manually_turned_off.yaml` | Lights turned on/off, with context parent id and user id (passive, John) | Debug text, every manual switch. The room-lighting-override plan already drops the kitchen ones. |
| 3 | Cut | `packages/people/john/do_not_disturb/automations/john_dnd_on.yaml`, `john_work_call_on.yaml`, `john_work_call_off.yaml`, `john_personal_time_on.yaml`, `john_personal_time_off.yaml` | DnD on; work call on/off; personal time on/off (passive, John) | Echoes of toggles John set or can see on the dashboard; several flips a day. |
| 4 | Cut | `packages/people/nearly_home/nearly_home_on.yaml`, `nearly_home_off.yaml` | "Nearly home automation turned on/off" (passive, John) | A status flip on every approach and arrival; no action to take. |
| 5 | Cut | `automation/people/returned_home.yaml`, `packages/people/announcements/person_announcement_script.yaml`, `automation/people/cristina/cristina_arrived_work.yaml` | "Home Arrival Mode"; "Somebody's here!" with the generated line; work-arrival log (all passive, John) | Arrival logs on every comings and goings. The spoken announcement already covers "somebody's here". The work-arrival log is also a routine in a public repo. |
| 6 | Cut one | `scripts/house/house_away.yaml` (keep `automation/house/modes/house_mode_away.yaml`) | "Nobody is home so away mode has been activated" | Same event pushed twice (script active, automation passive). Cut the active copy. |
| 7 | Cut | animal branch of `packages/security/cameras/detection_notifications/camera_detection_alert.yaml` (7 animal automations) | "An animal has been detected in <camera>" | The existing "pause to cut down on notification overload" toggle is evidence this is the noisiest source. Animals are rarely actionable. Person detections stay. |
| 8 | Passive | same file, vehicle branch (3 automations) | "A vehicle has been detected in <camera>" | Every car passing; keep for the record, drop the banner. |
| 9 | Passive | `packages/climate/main_floor/main_floor_climate_to_eco.yaml`, `main_floor_climate_to_resume.yaml`, `packages/climate/second_floor/second_floor_climate_to_eco.yaml`, `second_floor_climate_to_resume.yaml` | "Climate turned to ECO / activated, setpoint N" (time-sensitive, John) | Occupancy-driven flips, up to a few a day, each time-sensitive. Informational. |
| 10 | Passive | `packages/security/alarm/alarm_arm_home_script.yaml`, `alarm_arm_if_john_away.yaml`, `alarm_arm_away_when_vacation_mode.yaml`, `alarm_disarm_in_morning.yaml`, `alarm_disarm_when_house_becomes_occupied.yaml` | "Home is armed / disarmed ..." status (active or time-sensitive) | Routine daily confirmations from automations. The alarm-triggered push stays critical. Also move `alarm_disarm_in_morning` from everyone to John-only (action: John-only). |
| 11 | Passive | `packages/people/john/daily_report/john_daily_report.yaml`, `packages/reminders/morning_update.yaml` | "Daily Report!", "Daily Update!" (time-sensitive, John) | Long generated summaries, also spoken; a banner with sound adds nothing. |
| 12 | Passive | `packages/garage/doors/door_2/garage_door_2_open_upon_arrival.yaml`, `door_3/garage_door_3_open_upon_arrival.yaml` | "Garage door is opening upon somebody's arrival" | Fires on every arrival and is the automation doing its job. Garage open-too-long pushes stay. |
| 13 | Passive | `packages/security/security_status_notification.yaml` | "Home Security - Shields Up" status text (time-sensitive, John) | Fires each bedtime and when the house empties, up to once an hour; a status recap, not an alert. |
| 14 | Passive | `packages/house/vacation_mode/vacation_mode_turn_on.yaml`, `vacation_mode_turn_off.yaml` | Vacation mode on / off (time-sensitive, John) | John flips it himself; the confirmation does not need a banner. |
| 15 | Passive | `packages/weather/tempest_alerts/tempest_high_uv_alert.yaml`, `tempest_rain_amount_alert.yaml`, `packages/energy/sensors/energy_prices_are_negative.yaml` | UV alert; rain accumulation; negative energy price (time-sensitive, John) | Daily-ish seasonal information; nothing urgent. NWS and severe rain warnings stay. |
| 16 | John-only | `packages/security/cameras/camera_notifications/camera_notifications_activate.yaml`, `camera_notifications_deactivate.yaml` | Camera detections enabled / disabled (passive, everyone) | A toggle echo that every phone receives. |
| 17 | Passive | `packages/system/alerts/zigbee_router_unavailable.yaml`, `playroom_ap_unavailable.yaml`, `packages/system/ups/ups_battery_power_restored.yaml` | Router unavailable; AP disconnected (self power-cycling); UPS back on AC (time-sensitive, John) | Self-healing faults and an all-clear. The coordinator, Z-Wave, UPS-on-battery and UPS-offline pushes stay. |
| 18 | Cut | `packages/today_is_a_full_moon.yaml`, `packages/holidays/christmas/modes/christmas_not_activated.yaml` | "Full Moon Reminder"; "Christmas is NO longer activate" | Novelty and a mode echo. |
| 19 | Cut | `packages/playroom/party_time/playroom_activate_party_time.yaml`, `playroom_deactivate_party_time.yaml` | Party time on / off (time-sensitive, John) | John-triggered toggle echoes. |
| 20 | Passive | `packages/security/security_unlock_front_door_by_fingerprint.yaml` | "Fingerprint identified with ID N and unlocked the front door" | Every household unlock; keep as a silent record. |

**Keep (not proposed for change):** alarm triggered (critical), fire and smoke, leak alerts, person detections (including the critical-at-bedtime path), doorbell, front-door lock failures, garage open too long, exterior doors and windows left open, UPS on battery and UPS offline, Zigbee coordinator and Z-Wave controller offline, medication reminders and escalation, school departure and pickup reminders, garbage day, birthdays, kids activity and neighborhood reminders, bedtime notifications, severe weather warnings, guest arrived/left, laundry done (everyone gets these today; whether it should be John-only is Cristina's call, not proposed).

**Rough effect if all taken:** about 28 push call sites or automations cut (rows 1 to 7, 18, 19, counting the 7 animal automations), about 26 demoted to passive, 2 narrowed to John (plus one recipient change in row 10). The deep-links audit and exempt list shrink accordingly: cut rows leave the "passive loggers" exempt list, and demoted rows keep their links.

**Overlaps with the approved plans, none blocking:** row 2 overlaps `room-lighting-override`; rows 5 and 18 touch the "passive loggers" exempt list above; rows in `packages/security/alarm/` overlap the emergency-mode PRs only through shared files (merge order, not logic).

**John's pick (resolved):** which rows (or all), and whether passive means "no banner" (as above) or "cut" for rows 8 to 15. Once picked, it ships as its own PR; it is independent of the deep-links PRs and touches only automation files, so it waits for John's go-ahead before merge and deploy.

## Risks

- Popup hash may not open on a cold launch from a push. Existing links (doorbell) suggest it works, but the camera popup on a cold app start has not been confirmed. Mitigation: John taps the doorbell and one new camera link on a real phone before PR B merges, and the plan falls back to the view if the popup misbehaves.
- A hash only works on the view that includes the popup. The test checks view-plus-hash pairs, not just hashes.
- The count is a regex estimate. Templated and `script.turn_on` callers are easy to miss. Mitigation: the test is the source of truth, and task 1 prints the full list for John to skim before any link PR.
- Touching critical paths (alarm, fire, leak). The change is only a `data:` key, but a bad YAML edit silences a safety push. Mitigation: one theme per PR, existing regression tests stay green, and John deploys and triggers a test notification.
- A phone showing a stale dashboard cache after deploy. Per the repo notes, dashboard changes need the `kohbo.yaml` mtime touch. Popups added in task 10 must be deployed before their link PRs merge.
- Privacy. Notification text and the reminders are family routine. This plan paraphrases them, and the PRs must keep titles generic.

On approval → /approve → /ship notification-deep-links

### Applied (push-pruning PR)

- **Cut (push deleted, automation kept):** rows 1, 3, 4, 5 (all three), 6 (`scripts/house/house_away.yaml` only; the passive `house_mode_away_notification` stays), 18 (`packages/today_is_a_full_moon.yaml`, the file that loads; the `.yml` copy never loads, and the announcement stays; plus the Christmas mode echo), 19. No automation was push-only, so no file was deleted.
- **Passive:** rows 8 (vehicle detections get their own passive-push branch in `camera_detection_alert.yaml`; person and animal branches are unchanged), 9, 10, 11, 12, 13, 14, 15, 17, 20. Direct `notify.*` pushes (garage door 2, fingerprint) use `push.interruption-level: passive`.
- **John-only:** row 10 `alarm_disarm_in_morning` and row 16 camera toggles now use `devices: "jk"`.
- **Skipped:** row 2 (kitchen, playroom and hallway light pushes are already gone from the repo) and row 7 (John kept the animal detections).
