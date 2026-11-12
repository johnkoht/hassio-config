---
title: Kids WiFi Schedule
slug: kids-wifi-schedule
status: shipped
created: 2026-11-11
has_pre_mortem: true
has_review: true
has_prd: true
---

# Kids WiFi Schedule

## Problem

The kids network is turned off and on by hand in the UniFi app. We want it off at night and back on in the morning, with an earlier cutoff when there is school the next day, and the times set from the Kohbo dashboard rather than in YAML.

## Goal

The kids network goes off at the school-night time when either kid has school tomorrow, and at the weekend time otherwise. It comes back on at the weekday time on a school morning and the weekend time otherwise. The schedule toggle and all four times live in their own `#kids_wifi` popup, opened from a Kids WiFi tile on Home. A manual turn-on after the off time sticks until the next scheduled off. If HA restarts through the morning on time, the network still comes back on.

## Approach

**Switch.** The network is the UniFi WLAN switch, believed to be `switch.kids_enabled`. UniFi recreated every WLAN switch at 01:16 UTC on 11-11 during the site-id fix. The old `switch.kids_2` is probably an orphan. Live state is unverified, so confirming it is task 1.

**Package.** Everything lives in `packages/network/kids_wifi/`. All basenames are prefixed `kids_wifi_`, because `!include_dir_named` keys packages by basename across the whole tree.

**Helpers** (no `initial:`, so dashboard edits survive restarts, and no times committed to the public repo):

- `input_boolean.kids_wifi_schedule`, the master switch. It is a condition on every automation, never a trigger. Ships off.
- `input_datetime.kids_wifi_weekday_off_time`
- `input_datetime.kids_wifi_weekday_on_time`
- `input_datetime.kids_wifi_weekend_off_time`
- `input_datetime.kids_wifi_weekend_on_time`

**School signal.** The package has two plain template binary sensors, so the automations reference one entity each and a kid changing grade band, or adding camp later, is a one-line edit:

- `binary_sensor.kids_school_tomorrow` is on when `binary_sensor.primary_school_in_session_tomorrow` or `binary_sensor.parochial_school_in_session_tomorrow` is `on`.
- `binary_sensor.kids_school_today` is on when `binary_sensor.primary_school_in_session_today` or `binary_sensor.parochial_school_in_session_today` is `on`.
- Both use `is_state(..., 'on')`, so unavailable reads as no school. They have no `availability:` block, so they are always `on` or `off`.

**Semantics** (verified against `packages/school/`):

- The `*_tomorrow` sensors ignore `school_day_override_off`. That override means "no school today", and it resets at 23:58. Off times are before midnight, so an override can't leak into the evening decision.
- The `*_today` sensors honour the override. If a sick day or snow day is set before the morning on time, the network gets the weekend on time. That is the intended behaviour.
- The parochial sensors are calendar-driven and can be briefly unavailable. That reads as no school for one decision, which means a later time. This is accepted.

**Automations** (one job each):

- `kids_wifi_off_on_schedule` has time triggers on both off helpers (ids `weekday_off`, `weekend_off`). Conditions, in order:
  - the schedule is on
  - `switch.kids_enabled` is `on`
  - the helper that fired is set. A `trigger.id` → helper map checks `timestamp | int(0) > 0`, because an unset time helper reads 00:00 and would fire at midnight.
  - `weekday_off` requires `kids_school_tomorrow` on; `weekend_off` requires it off.

  Normally exactly one fires per night. If a closure lands between the two times, both can pass, but the switch-state condition makes the second a no-op.
- `kids_wifi_on_on_schedule` is the same shape, with on helpers (ids `weekday_on`, `weekend_on`), the switch `off`, and gating on `kids_school_today`.
- `kids_wifi_on_after_restart` triggers on the `homeassistant` start event and on `event_template_reloaded`. Conditions: the schedule is on, the switch is `off`, and now is inside today's on window. That window runs from today's on time (weekday or weekend by `kids_school_today`) to tonight's off time (by `kids_school_tomorrow`), and both helpers must be set. Action: turn the switch on. A manual daytime turn-off that spans a restart gets undone. This is accepted, because a skipped "on" is worse than a skipped "off".

**Override.** It needs no extra logic. Each time trigger fires once, so a manual turn-on after the off time sticks until the next off time.

**UI.**

- A new `dashboards/kohbo/home/kids_wifi_popup.yaml` with `hash: '#kids_wifi'`, built from the `garage_entry_lock_popup.yaml` pattern. It contains:
  - a title
  - an entities card with `switch.kids_enabled` and `input_boolean.kids_wifi_schedule` (`kohbo_boolean_entity_layout.yaml`, `secondary_info: last-changed`)
  - a `conditional` card on the schedule being on, wrapping the four times (`kohbo_vertical_stack_bg` / `kohbo_entities_container` / `entity_no_icon`)
  - a `kohbo_card_section_description` explaining the rules, with no example times
- Home gets the include after the House Mode popup include (`home.yaml` ~568).
- Home also gets a Kids WiFi tile (`kohbo_device_entity`, `entity: switch.kids_enabled`, `mdi:wifi`, `navigation_path: '#kids_wifi'`) directly after the Main Floor Vacuum tile (~`home.yaml:418`).
- No new CSS. The popup margin and the grid placement are checked in the live DOM after deploy.

## Tasks

1. **Verify entity.** Confirm live `switch.kids_enabled` is `on`/`off` with a "kids" friendly name, that `switch.kids_2` is dead, and the current state of the four school sensors (homelab). Stop if the switch isn't live.
2. **Helpers + school sensors.** Create `kids_wifi_schedule_helpers.yaml` and `kids_wifi_school_sensors.yaml`.
   - *Test:* `tests/run.sh --syntax --modern` passes.
   - *Test:* `grep -r "initial" packages/network/kids_wifi/` is empty.
   - *Test:* the new basenames are unique (duplicates test).
3. **Off automation.** Create `kids_wifi_off_on_schedule.yaml`.
   - *Test:* the reviewer walks the case table: trigger weekday/weekend × school tomorrow on/off/unavailable; unset helper; switch already off; schedule off.
4. **On automation.** Create `kids_wifi_on_on_schedule.yaml`, then do the same case walk.
5. **Restart catch-up.** Create `kids_wifi_on_after_restart.yaml`.
   - *Test:* render the window template on the host for before/inside/after the window and for unset helpers.
6. **Popup + Home.** Create the popup, add the include, and add the tile.
   - *Test:* the YAML parses.
   - *Test:* `hash: '#kids_wifi'` appears in the popup, and `navigation_path: '#kids_wifi'` and the popup include appear in `home.yaml`.
   - *Test:* after deploy, `/dashboard-kohbo/home#kids_wifi` opens with both toggles, and the four times show when the schedule is on.
7. **Docs.**
   - `docs/AUTOMATIONS.md` entry.
   - `dashboards/kohbo/home/README.md` file tree.
   - `dashboards/SITEMAP.md` Home popups list ("Kids WiFi Popup").
8. **Gates + deploy.**
   - Run the full quick suite.
   - Grep the diff for `\d\d:\d\d` (none allowed in new text).
   - Deploy with `--skip-ci --reload`, then reload `input_boolean`, `input_datetime` and template entities.
   - Confirm `input_boolean.kids_wifi_schedule` is `off`.
   - The live off/on test is John's to run: set an off time a couple of minutes ahead, confirm the network drops, then restore.

## Risks

- **Wrong or dead switch entity.** The registry churned today, so the automation could target an orphan and silently do nothing. Mitigation: task 1 gates everything, plus the live test after deploy.
- **Off times after midnight.** The "tomorrow" sensors are computed from `now()`, so a 00:30 off time evaluates the following day's school status. Accepted: the popup description says off times must be before midnight.
- **Unset helpers.** An unset helper reads 00:00. Mitigation: the `trigger.id` → timestamp guard.
- **School sensor unavailable.** It fails toward the later weekend time for one decision. Accepted, since this is not a safety control.
- **HA down at the off time.** That night's off is skipped. Accepted. A skipped "on" is caught up by `kids_wifi_on_after_restart`.
- **Kids reconnecting via another SSID.** This depends on UniFi, not HA. Out of scope.
- **Public repo.** Times are runtime helpers. Commits, the PR and memory use "off time", never actual times.

On approval → /approve → /ship kids-wifi-schedule
