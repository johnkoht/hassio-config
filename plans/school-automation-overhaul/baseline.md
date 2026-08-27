# Environment — verified live 2026-08-26

Captured read-only from the production Yellow (192.168.1.36) before any cutover. **This is the only record of these values.** `git revert` cannot restore any of it.

Caveat: HA's recorder had purged history older than 2026-08-22, so the firing window below is ~4 days, not 7. `last_triggered` attributes (which persist independently) cover the gap. True step-by-step traces are websocket-only and were not queryable.

---

## 1. What actually fires today

| Automation | Enabled | `last_triggered` (UTC) | Firings 08-22 → 08-26 |
|---|---|---|---|
| `automation.school_day_reminder` | on | 2026-08-26T12:15:00 | 3 — Mon/Tue/Wed 07:15 local |
| `automation.school_departure_reminder` | on | 2026-08-26T13:20:00 | 3 — Mon/Tue/Wed 08:20 local |
| `automation.nino_school_pickup_reminder` | on | 2026-08-25T20:20:00 | 2 — Mon/Tue 15:20 local |
| `automation.gianluca_school_pickup_reminder` | on | **2026-05-21T16:40:00** | **0** |

**Nino's chain is live and working.** This matters for Track C: deleting the old layer is a real cutover, not a formality.

**Gianluca's pickup reminder has not fired since 21 May 2026** — before summer break, before this school year began. Enabled, never firing. This is exactly the "zero saved traces is the tell" signature. It has been silently dead for the entire school year to date.

Contributing: `automation.gianluca_school_day_on` did not run Mon 08-24 or Tue 08-25 (only today, 06:00:01), while the primary/Nino chains ran fine those mornings. `automation.district_school_year_activate` only fired 2026-08-25T17:36 — a day *after* the primary chain was already live.

## 2. Automation enabled-state — the rollback key

Restoring these files from git does **not** restore enabled state; it lives in `.storage`. To roll back, re-enable explicitly.

**Currently `on`:** `school_day_reminder`, `school_departure_reminder`, `nino_school_day_on`, `nino_school_day_off`, `nino_school_pickup_reminder`, `primary_school_day_on`, `primary_school_day_off`, `gianluca_school_day_on`, `gianluca_school_day_off`, `gianluca_school_pickup_reminder`, `gianluca_school_reminder_notification`, `district_school_year_activate`, `district_school_year_deactivate`

**Currently `off`** (stale legacy, last fired 2024): `nino_school_day_reminder`, `nino_school_departure_reminder`, `nino_school_reminder_notification` — all deleted in Track A, correctly.

**Registered but `unavailable`** — orphan registry rows with no producing YAML: `nino_school_day_automations_on`, `nino_school_day_automations_off`, `elementary_school_day_off`, `elementary_school_day_on`, `school_reminders`. `disabled_by: None`. **Landmine:** reusing any of these automation `id`s makes HA rebind to the stale row rather than create a clean entity. None of Track A's new IDs collide. Worth deleting these rows during cutover.

## 3. `.storage` input_datetime values — restore data

| entity_id | value |
|---|---|
| `input_datetime.district_34_first_day_of_school` | `2026-08-20` |
| `input_datetime.district_34_last_day_of_school` | `2027-05-27` |
| `input_datetime.school_day_breakfast_reminder_time` | `07:15:00` |
| `input_datetime.school_day_departure_reminder` | `08:20:00` |
| `input_datetime.primary_school_pickup_reminder` | `15:20:00` |

**Three more found during the sweep that were not on the original list** and feed the same storage dashboard:

| entity_id | value | note |
|---|---|---|
| `input_datetime.district_34_school_start` | `08:45:00` | confirms the primary-band start time |
| `input_datetime.district_34_school_late_start` | `09:45:00` | confirms the Wednesday late start |
| `input_datetime.gccns_pickup_reminder` | `11:40:00` | **Gianluca's actual pickup helper** — not `primary_school_pickup_reminder` |
| `input_boolean.district_school_year_active` | `on` | |

`gccns_` is almost certainly his previous preschool. 11:40 does not match either OLPH dismissal (12:20 / 14:20), so that value is stale — further evidence his pickup path has been broken since he changed schools.

### Values to enter on the new dashboard after deploy

| New entity | Value | Source |
|---|---|---|
| `input_datetime.school_year_first_day` | 2026-08-20 | baseline |
| `input_datetime.school_year_last_day` | 2027-05-27 | baseline |
| `input_datetime.primary_school_start_time` | 08:45 | baseline + district site |
| `input_datetime.primary_school_late_start_time` | 09:45 | baseline + district site |
| `input_datetime.primary_school_dismissal_time` | 15:40 | district site |
| `input_datetime.intermediate_school_start_time` / `_late_start_time` / `_dismissal_time` | 07:45 / 08:45 / 14:40 | district site |
| `input_datetime.middle_school_start_time` / `_late_start_time` / `_dismissal_time` | 08:15 / 09:15 / 15:10 | district site |
| `input_datetime.parochial_school_start_time` | 08:05 | OLPH calendar |
| `input_datetime.parochial_school_departure_time` | 07:45 | John |
| `parochial_school_{monday,tuesday,wednesday,thursday,friday}_dismissal` | 14:20 / 12:20 / 14:20 / 12:20 / 12:20 | OLPH calendar |
| `input_datetime.school_breakfast_reminder_time` | 07:15 | baseline |
| `input_number.nino_departure_lead_minutes` | 25 | 08:45 − 08:20 baseline |
| `input_number.nino_pickup_lead_minutes` | 20 | 15:40 − 15:20 baseline |
| `input_number.gianluca_pickup_lead_minutes` | 20 | default |

Nino's leads are **confirmed by the baseline**, not guessed: departure fired at 08:20 against an 08:45 start, pickup at 15:20 against a 15:40 dismissal.

## 4. `.storage` reference sweep

All nine target entities are registered in `core.entity_registry`, none disabled.

**Voice exposure** — `homeassistant.exposed_entities` has rows for `input_boolean.primary_school_day` and `binary_sensor.gianluca_is_today_school_day`, both with `should_expose: False` for every assistant. No live Alexa/Google risk; deleting leaves cosmetic dangling rows.

**`cloud`** — zero matches for any school entity. No Alexa/Google entity-config risk.

**`automations` / `scripts` / `scenes`** — no such `.storage` files exist; all three domains are YAML-only on this host. No UI-created shadow config.

### The storage-mode school dashboard — found

`/homeassistant/.storage/lovelace.ui_test` — a dashboard titled **"UI Test"** (`url_path: ui-test`, storage mode, last modified Nov 2025). Its `views[10]` is `title: School`, `path: school` — the screenshot. Cards:

- **District** → `district_school_year_active`, `district_34_first_day_of_school`, `district_34_last_day_of_school`, `district_34_school_start`, `district_late_start_wednesday`, `district_34_school_late_start`
- **Elementary School** → `primary_school_day`, `primary_school_closed`, `school_day_breakfast_reminder_time`, `school_day_departure_reminder`, `primary_school_pickup_reminder`
- **Gianluca School** → `gianluca_school_day`, `gianluca_is_today_school_day`, `gccns_pickup_reminder`
- **Nino School** → `nino_school_day`

This is a **different dashboard** from `dashboard-kohbo`, so the new kohbo school view does not conflict with it. Track C deletions will render blank rows here — not an error, but the view becomes decorative. Decide then whether to delete `views[10]` or the whole "UI Test" dashboard.

---

## Open follow-up

Gianluca's pickup was scheduled for ~11:40 local today; the capture ran before that. Re-check `automation.gianluca_school_pickup_reminder.last_triggered` after 11:40 CDT to see whether today's run happened or whether it is still dead.
