# Handoff — School dashboard UI work

The school automation layer shipped 2026-08-28 and is running correctly. What's left is UI polish. This is what a fresh session needs.

## Surface map

| File | Owns |
|---|---|
| `dashboards/kohbo/school/school.yaml` | the whole view, path `school`, reached from `navbar.yaml:73` |
| `dashboards/kohbo/school/components/school_settings_popup.yaml` | `#school_settings_popup` — band enable toggles + intermediate/middle pickers |
| `dashboards/kohbo/kohbo.yaml` | the `!include` that registers the view |

Sections in `school.yaml`, in order: **Today** (per-kid state, leave/start/pickup, late-start badge, closures, both override toggles) · **School Year** · **Schools** (primary only — intermediate and middle are in the popup) · **Junior Kindergarten** · **Reminders** · **Calendar** · **Lunch**.

## Conventions this view follows

- `type: custom:vertical-layout`, `theme: kohbo`, layout `kohbo_page_layout.yaml` — matches `more/people.yaml` and `energy.yaml`, not the tabbed `climate.yaml`
- Editable `input_datetime` / `input_number` rows use a plain `type: entities` card wrapped in the `stack-in-card` + `kohbo_vertical_stack_bg` + `kohbo_entities_container` + `entity_no_icon` card_mod chain — copied from `security/pages/alarm_panel.yaml`, which already does this for `input_datetime.alarm_john_away_arm_time`
- Read-only booleans use `kohbo_boolean_entity_layout.yaml`
- Section headers use the `section_title` button-card template; popup uses `kohbo_popup_page_title`
- Popup is `custom:bubble-card` / `card_type: pop-up` with a `hash:` anchor — pattern from `security/components/security_settings_popup.yaml`

**`type: conditional` does not support `condition: template`** — only state/numeric_state/screen/user/location/time/and/or/not. The band visibility uses `condition: state` on `input_boolean.intermediate_school_enabled` / `middle_school_enabled`.

## Known rough edges

- Never visually reviewed. It renders and the pickers work, but the layout was written blind against the conventions above.
- The Calendar and Lunch sections were built last and got the least attention.
- Event lists use native `type: markdown` cards rendering `state_attr(...)` lists — no decluttering template exists for list output. Fine, but inconsistent with the rest.
- Intermediate/middle time pickers are unset (`00:00:00`), so their `_start_time_today` / `_dismissal_time_today` sensors read `unavailable` by design. Not a bug — the `timestamp > 0` availability guard.

## Entities worth knowing

Per kid: `binary_sensor.<kid>_school_day`, `sensor.<kid>_departure_time`, `sensor.<kid>_pickup_time`.
Per band: `binary_sensor.<band>_school_{in_session_today,in_session_tomorrow,late_start_today,late_start_tomorrow}`, `sensor.<band>_school_{start_time_today,dismissal_time_today}`.
Bands are `primary_school`, `intermediate_school`, `middle_school`, `parochial_school`.
Closures: `binary_sensor.<scope>_closed_{today,tomorrow}`; events: `sensor.<scope>_events_{today,tomorrow}` with `actionable` / `informational` list attributes.

Gianluca's entities are `parochial_school_*`; only display names say "Junior Kindergarten" (he ages out of the grade, not the school).

## Deploying

`./deploy.sh --skip-ci` (the Yellow pulls from GitHub). Dashboard changes need a browser refresh, not a reload. `deploy.sh` now **fails hard** if Docker isn't running rather than skipping validation — `--skip-ci` bypasses it.

Read `packages/school/LEARNINGS.md` before touching anything in `packages/school/`.
