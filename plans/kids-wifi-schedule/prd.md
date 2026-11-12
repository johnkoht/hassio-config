# PRD: Kids WiFi Schedule

## Goal

Turn the kids network (`switch.kids_enabled`) off at night and on in the morning. Weekday times apply when either kid has school (tomorrow for the off, today for the on), and weekend times apply otherwise. Everything is configured from a new `#kids_wifi` popup opened from a Home tile. Plan: `plans/kids-wifi-schedule/plan.md`.

Done before build: entity verification. `switch.kids_enabled` is live, friendly_name "Kids Enabled"; `switch.kids_2` is an unavailable orphan.

## Constraints (all tasks)

- Modern HA syntax only (`triggers:`/`trigger:`/`conditions:`/`actions:`/`action:` + `target:`).
- One automation per file. The filename matches the id. Header comment is the title plus 1–3 lines (keep inline docs short).
- No `initial:` on any helper, because it disables restore.
- Every new basename is prefixed `kids_wifi_`, because `!include_dir_named` keys by basename globally.
- An automation's entity_id derives from its alias, not its id. Any dashboard reference to an automation must use `automation.<slug(alias)>`.
- Public repo: no clock times (`HH:MM`) in code, comments, popup text, commits, PR or memory.
- Test gate: `tests/run.sh --syntax --modern` (the honest local gate per `packages/school/LEARNINGS.md`), plus `tests/run.sh --quick`.
- Never run a bare `deploy.sh --check`. Never restart HA.

## Tasks

### task-1: Helpers and school sensors

**Files:** `packages/network/kids_wifi/kids_wifi_schedule_helpers.yaml`, `packages/network/kids_wifi/kids_wifi_school_sensors.yaml`

Define `input_boolean.kids_wifi_schedule` (`mdi:wifi-cog`) and four time-only `input_datetime`s:
- `kids_wifi_weekday_off_time`
- `kids_wifi_weekday_on_time`
- `kids_wifi_weekend_off_time`
- `kids_wifi_weekend_on_time`

Define template binary sensors `binary_sensor.kids_school_tomorrow` and `binary_sensor.kids_school_today`, using the `name` / `unique_id` / `default_entity_id` pattern from `packages/school/kids/nino_school.yaml`.

**Acceptance criteria**
- All five helpers have `has_time: true`, `has_date: false` where applicable, and no `initial:` key (`grep -rn initial packages/network/kids_wifi/` returns nothing).
- `kids_school_tomorrow` is `{{ is_state('binary_sensor.primary_school_in_session_tomorrow','on') or is_state('binary_sensor.parochial_school_in_session_tomorrow','on') }}`. `kids_school_today` is the same with the `_today` sensors.
- Neither sensor has an `availability:` block.
- The duplicates and naming tests pass. `find packages -name 'kids_wifi*'` has no basename collisions.

### task-2: Off automation

**File:** `packages/network/kids_wifi/kids_wifi_off_on_schedule.yaml`. id `kids_wifi_off_on_schedule`, alias `Kids WiFi - Off on Schedule`, `mode: single`.

**Acceptance criteria**
- There are two `trigger: time` triggers, `at: input_datetime.kids_wifi_weekday_off_time` (id `weekday_off`) and `at: input_datetime.kids_wifi_weekend_off_time` (id `weekend_off`).
- Conditions, in order:
  1. `input_boolean.kids_wifi_schedule` is `on`.
  2. `switch.kids_enabled` is `on`.
  3. An aliased template condition maps `trigger.id` → helper and checks `state_attr(helper,'timestamp') | int(0) > 0`. It does not use `trigger.entity_id`.
  4. An aliased gate: (`weekday_off` AND `kids_school_tomorrow` on) OR (`weekend_off` AND `kids_school_tomorrow` off).
- The action is `switch.turn_off` with `target: entity_id: switch.kids_enabled`.
- Case table, each case giving the expected outcome:
  - `weekday_off` × school tomorrow on → off
  - `weekday_off` × school tomorrow off → none
  - `weekend_off` × school tomorrow on → none
  - `weekend_off` × school tomorrow off → off
  - school-tomorrow source unavailable → treated as off, so the weekend trigger acts
  - helper timestamp 0 → none
  - switch already off → none
  - schedule off → none

### task-3: On automation

**File:** `packages/network/kids_wifi/kids_wifi_on_on_schedule.yaml`. id `kids_wifi_on_on_schedule`, alias `Kids WiFi - On on Schedule`, `mode: single`.

**Acceptance criteria**
- It mirrors task-2, with these differences:
  - triggers on the on helpers (ids `weekday_on`, `weekend_on`)
  - switch must be `off`
  - gating uses `binary_sensor.kids_school_today`
  - action is `switch.turn_on`
- The same 8-case table holds, with "today" in place of "tomorrow".

### task-4: Restart catch-up

**File:** `packages/network/kids_wifi/kids_wifi_on_after_restart.yaml`. id `kids_wifi_on_after_restart`, alias `Kids WiFi - On After Restart`, `mode: single`.

**Acceptance criteria**
- Triggers: `trigger: homeassistant` `event: start`, and `trigger: event` `event_type: event_template_reloaded`.
- Conditions:
  - the schedule is `on`
  - `switch.kids_enabled` is `off`
  - an aliased template that is true only when all of these hold:
    - today's on helper (weekday if `kids_school_today` on, else weekend) has timestamp > 0
    - tonight's off helper (weekday if `kids_school_tomorrow` on, else weekend) has timestamp > 0
    - `today_at(on) <= now() < today_at(off)`
- The action is `switch.turn_on` on `switch.kids_enabled`.
- Template renders on the host return:
  - False before the on time
  - True inside the window
  - False after the off time
  - False when either helper is unset

### task-5: Popup and Home entry point

**Files:** `dashboards/kohbo/home/kids_wifi_popup.yaml` (new), `dashboards/kohbo/home/home.yaml`

**Acceptance criteria**
- The popup is `custom:bubble-card`, `card_type: pop-up`, `hash: '#kids_wifi'`, `close_by_clicking_outside: true`, with the `kohbo_popup_styles.yaml` styles and a `kohbo_popup_page_title` titled "Kids WiFi".
- An entities card has `switch.kids_enabled` ("Kids WiFi") and `input_boolean.kids_wifi_schedule` ("Schedule"), each with `kohbo_boolean_entity_layout.yaml`, `secondary_info: last-changed` and `state_color: true`.
- A `type: conditional` card on `input_boolean.kids_wifi_schedule` == `on` wraps the four `input_datetime`s, using the exact `garage_entry_lock_popup.yaml` nesting (`kohbo_vertical_stack_bg` / `kohbo_entities_container` / `entity_no_icon`). The conditional uses no `condition: template`.
- A `kohbo_card_section_description` explains:
  - weekday times apply when either kid has school
  - off times must be before midnight
  - set all four times before turning the schedule on

  It contains no clock times.
- `home.yaml` includes `/config/dashboards/kohbo/home/kids_wifi_popup.yaml` after the House Mode popup include, with a `# Kids WiFi Popup` comment block.
- `home.yaml` has a Kids WiFi tile directly after the Main Floor Vacuum tile: `custom:button-card`, `template: kohbo_device_entity`, `entity: switch.kids_enabled`, `icon: mdi:wifi`, `tap_action` navigate `'#kids_wifi'` with `haptic: light`.
- No new CSS or card_mod beyond the copied includes.
- The YAML parses with a `!include`-tolerant loader. `grep "hash: '#kids_wifi'"` matches the popup, and `grep "navigation_path: '#kids_wifi'"` matches `home.yaml`.

### task-6: Docs

**Files:** `docs/AUTOMATIONS.md`, `dashboards/kohbo/home/README.md`, `dashboards/SITEMAP.md`

**Acceptance criteria**
- `docs/AUTOMATIONS.md` Miscellaneous has a "Kids WiFi schedule" entry linking `packages/network/kids_wifi`. It states the school-driven rule, the restart catch-up, and that the schedule ships off. It has no clock times.
- The `home/README.md` file tree lists `kids_wifi_popup.yaml`.
- The SITEMAP Home popups list includes "Kids WiFi Popup".

## Out of scope

- Camp (no entity exists).
- Off catch-up after restart.
- Blocking other SSIDs.
- Removing the `switch.kids_2` orphan.
- Deploying. That happens after merge; the live off/on test is John's.
