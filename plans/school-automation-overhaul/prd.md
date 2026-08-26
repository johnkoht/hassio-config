# PRD: School Automation Overhaul — Track A

**Plan**: `plans/school-automation-overhaul/plan.md`
**Review**: `review.md` (verdict Revise → revisions applied)
**Pre-mortem**: `pre-mortem.md` (4 CRITICAL → all addressed)

---

## Goal

Build the complete new school-automation layer — district / school-by-grade-band / kid — as **additive** files that run alongside the existing system, so it can be shadow-run for a week before anything live is removed. Track A is everything achievable in a worktree with no live Home Assistant instance and no human in the loop.

---

## Track boundaries

This repo has **no local runtime**. Code reaches Home Assistant only when `deploy.sh` makes the Yellow `git pull` from GitHub. No acceptance criterion requiring a live HA query can be satisfied here, so none appears below.

**Track A (this build)** — write every new YAML file, delete only what has no live consumer, re-point `morning_update.yaml`, build the dashboard view, validate statically.

**Track B (Human Gates, below)** — everything requiring John, a live instance, or both.

**Track C (deferred, after the shadow-run week)** — the Phase 4 deletions from the plan. Deliberately *not* in Track A: keeping the old layer alive is what makes the shadow run possible, and the plan's whole cutover safety argument depends on both systems coexisting for one school week including a Wednesday.

### Two deviations from the plan, and why

1. **The `!secret` migration is deferred to Track B.** Writing `!secret district_calendar` now would fail `ha core check`, because the key exists in neither the local nor the host `secrets.yaml`, and adding it locally requires John's `scp` round-trip first (local is missing 4 keys that a naive push would delete on the Yellow). Track A therefore uses inline entity IDs — **introducing no new leak**, since `calendar.lyon_school` already appears in this repo at `primary_school_closed.yaml:18`, `primary_school_closed_tomorrow.yaml:18` and `primary_school_events_today.yaml:17`. The real exposure, `google_calendars.yaml` with Gianluca's Google calendar ID, *is* deleted in Track A (task 2). Same reasoning defers the lunch-menu identifier scrub.
2. **Plan task 1 (live baseline capture) moves to Track B.** It is entirely a live-instance query.

---

## Tasks

### task-1: Take `deploy.sh` out of the secrets business — own commit, first

**File**: `deploy.sh`

Remove every line where the script writes to or deletes `secrets.yaml`, and make the validation gate fail loudly instead of silently skipping.

**Acceptance criteria**
- `cp secrets.fake.yaml secrets.yaml` (line ~60), the `rm -f secrets.yaml` in the `check_config` failure branch (line ~66), and the trailing `rm -f secrets.yaml` (line ~68) are all removed.
- No remaining line in `deploy.sh` writes to, copies over, or deletes `secrets.yaml`. Verify: `grep -n "secrets.yaml" deploy.sh` shows only read-only or comment references.
- The Docker-missing branch (line ~56) exits non-zero rather than printing a warning and continuing, so the repo's only validation gate cannot silently no-op.
- A comment above the `check_config` block states that `secrets.yaml` is human-managed and no script may modify it.
- The decision on whether `secrets.fake.yaml` is retained or retired is recorded in `working-memory.md` under Decision Ledger.
- This lands as its **own commit**, separate from every other task.

### task-2: Delete `google_calendars.yaml`

**File**: `google_calendars.yaml` (delete)

Dead legacy config for a Google integration format HA no longer reads, and the repo's single largest privacy exposure.

**Acceptance criteria**
- `google_calendars.yaml` is deleted.
- `grep -rn "google_calendars" .` (excluding `plans/`) returns no hits.
- `configuration.yaml` contains no `google:` block — confirm before deleting, so the deletion is provably inert.

### task-3: Delete dead files with no live consumer

> **Amended mid-build.** `packages/school/district/district_late_start_wednesday_boolean.yaml` was originally listed here and is **wrong** — it defines `input_boolean.district_late_start_wednesday`, which has four live references across `primary_school_day_on.yaml:47`, `primary_school_day_off.yaml:34,39` and `school_day_reminder.yaml:39`. That last one reads it via `states.input_boolean.….state`, so deleting it would raise `UndefinedError` and kill the morning reminder during the shadow-run week. **Deferred to Track C**, where it is deleted alongside its consumers. Caught by the task-3 developer, who correctly refused to delete it.

**Files** (delete): `packages/school/district/district_late_start_tomorrow.yaml`, `packages/school/primary_school/primary_school_events_today.yaml`, `packages/school/nino_school/automations/nino_school_day_reminder.yaml`, `packages/school/nino_school/automations/nino_school_reminder_notification.yaml`, `packages/school/nino_school/automations/nino_school_departure_reminder.yaml`, `packages/school/gianluca_school/automations/gianluca_school_reminder_notification.yaml`, `packages/school/nino_school/binary_sensors/nino_is_today_school_day.yaml`, `templates/speech/briefing.yaml`

Also remove the legacy `Nino Pickup` automation (`id: '1646884521741'`) from `automations.yaml`.

**Acceptance criteria**
- Every listed file is deleted, and `templates/speech/briefing.yaml` is deleted **in full** — not just its `pickup_nino()` macro, whose call site at line 57 would otherwise remain. Confirm `templates/` is unreferenced in `configuration.yaml` before deleting.
- The `Nino Pickup` block is removed from `automations.yaml` and the file still parses as valid YAML.
- **Phantom-check before deleting each**: `grep -rn "<entity_id>" . --exclude-dir=plans` confirms no remaining consumer. `binary_sensor.nino_is_today_school_day` is referenced only in a comment at `nino_school_day_on.yaml:5`.
- Nothing in this task deletes an entity that `packages/reminders/morning_update.yaml` reads — those are Track C.

### task-4: `school_year.yaml`

**File**: `packages/school/school_year.yaml` (new)

Year-bound inputs plus the derived active sensor.

**Acceptance criteria**
- Declares `input_datetime.school_year_first_day` and `input_datetime.school_year_last_day`, both `has_date: true`, `has_time: false`.
- **Neither carries `initial:`.** Setting it disables state restoration and silently reverts dashboard edits on every restart. Real dates (2026-08-20, 2027-05-27) appear in a header comment only.
- Defines `binary_sensor.school_year_active`, true when today falls within the two dates inclusive, with an `availability:` guard for when either input is unset.
- Header comment records Glenbrook South as out of scope (District 225, separate calendar, hours TBD).
- Uses modern syntax throughout (`triggers:`/`conditions:`/`actions:`, `trigger:`/`action:` keys).

### task-5: Override booleans and their ungated nightly reset

**Files**: `packages/school/school_overrides.yaml` (new), `packages/school/school_overrides_reset.yaml` (new)

The only manual controls in a derived system, plus the reset that stops them latching.

**Acceptance criteria**
- `school_overrides.yaml` declares `input_boolean.school_day_override_off` and `input_boolean.early_dismissal_today`, neither with `initial:`.
- `school_overrides_reset.yaml` contains one automation triggering at `23:58:00` that turns **both** off.
- **The reset has no `conditions:` block at all** — not an empty one, not one gated on school-year-active or house-occupied. A gated reset is precisely how the birthday-countdown flags latched forever; this is a hard requirement, not a style preference.
- The reset lives in its own file so it is visible rather than buried in the overrides file.
- Header comment explains why the reset is ungated, citing the prior latch failure.

### task-6: Calendar sensors — one template block per calendar

**Files**: `packages/school/district_calendar_sensors.yaml`, `packages/school/primary_school_calendar_sensors.yaml`, `packages/school/parochial_school_calendar_sensors.yaml` (all new)

Three independent trigger-based template blocks. **Separate files, not one shared block** — a response-returning service that resolves to zero entities *raises*, and four calls in one action sequence means one bad calendar reference kills every closure sensor at once.

**Acceptance criteria**
- Each file is an independent `template:` block with **three triggers**: `time_pattern` with `hours: /1`, `homeassistant` `event: start`, and `event` `event_type: event_template_reloaded`. **`hours: /1`, never `hours: 1`** — the latter fires once daily at 01:00 and is the existing bug in four files being replaced.
- Each `calendar.get_events` call carries `continue_on_error: true`, and every response variable is dereferenced with `| default({})`.
- Responses are iterated as `.values() | map(attribute='events') | sum(start=[])` — no calendar entity ID appears inside Jinja.
- Entity IDs are inline in the `target:` block (`calendar.district_34_events`, `calendar.lyon_school`, `calendar.gianluca_school`, `calendar.olph_school`). A `# TODO(track-b)` comment marks each for the `!secret` migration.
- Window spans today 00:00:00 through tomorrow 23:59:59 in one call per calendar.
- **Day matching is by overlap, not start-date equality**: all-day events use `event.start[:10] <= day and day < event.end[:10]` (end-exclusive); timed events use `event.start[:10] <= day <= event.end[:10]`; all-day is detected via `event.start | length == 10`. Verified necessary: 9 of OLPH's 119 all-day events span multiple days, including `NO SCHOOL - Thanksgiving` (2026-11-25 → 11-28) and an 11-day `Easter Vacation`.
- Closure test is `'no school' in summary | lower`. The `'District Closed'` clause from the existing code is **not** carried over.
- **Grade-scope guard**: a closure is rejected when the summary matches `grade[s]?\s*[K0-9]`, `\d(st|nd|rd|th)\s+grade`, or the word-scopes `kindergarten` / `preschool` / `\bEC\b`, unless it also names the kid's own band (`JK`, `junior kindergarten`). Unrecognized scoped closures fail **open** — not closed, but surfaced as Tier 2.
- Tier 1 is tested **before** the athletics filter, so a Tier 1 event containing `- Game` isn't eaten.
- Athletics filter matches `' - Practice'` / `' - Game'` (removes 523 of OLPH's 710 events).
- Events are deduped on `(summary, start)` — `District Closed | No School` appears on both the district and Lyon feeds.
- Emits `binary_sensor.<scope>_closed_today` / `_tomorrow` and `sensor.<scope>_events_today` / `_tomorrow`.
- Event payloads live in **attributes**; `state:` is `"{{ now().isoformat() }}"`. A joined summary list would exceed the 255-character state limit.
- No `unique_id` collides with an existing sensor. Specifically, the new closure sensors must not reuse `primary_school_closed` or `primary_school_closed_tomorrow`, which still exist until Track C.

### task-7: The three D34 grade-band schedules

**Files**: `packages/school/schools/primary_school_schedule.yaml`, `intermediate_school_schedule.yaml`, `middle_school_schedule.yaml` (all new)

**Acceptance criteria**
- Each declares `input_datetime.<band>_school_start_time`, `_late_start_time`, `_dismissal_time` — **none with `initial:`**, real times in a header comment (primary 8:45 / 9:45 / 15:40; intermediate 7:45 / 8:45 / 14:40; middle 8:15 / 9:15 / 15:10).
- Each defines `sensor.<band>_school_start_time_today` and `sensor.<band>_school_dismissal_time_today` with `device_class: timestamp`.
- Timestamps are built as `today_at('00:00') + timedelta(seconds=state_attr('input_datetime.x','timestamp'))`, **never** `as_datetime()` on a concatenated string — a naive value makes `SensorEntity.state` raise under `device_class: timestamp` and errors the entity outright. This is also what makes it DST-safe across 2026-11-01 and 2027-03-08.
- Each timestamp sensor has an `availability:` template rather than rendering an empty state, so it reads `unavailable` not `"None"`.
- Each defines `binary_sensor.<band>_school_late_start_today` / `_late_start_tomorrow` / `_in_session_today` / `_in_session_tomorrow`.
- Late start is derived (`weekday == 2 and in_session`), never latched.
- `in_session` requires school-year-active AND weekday AND not closed AND `input_boolean.school_day_override_off` is off.
- **No Glenbrook South / high-school file is created.**

### task-8: Parochial (Junior Kindergarten) schedule

**File**: `packages/school/schools/parochial_school_schedule.yaml` (new)

**Acceptance criteria**
- Declares `input_datetime.parochial_school_start_time`, `parochial_school_departure_time`, and five per-weekday dismissals (`parochial_school_monday_dismissal` … `_friday_dismissal`) — none with `initial:`. Header comment records 8:05 start, 7:45 departure, and Mon 14:20 / Tue 12:20 / Wed 14:20 / Thu 12:20 / Fri 12:20.
- Departure is an absolute input, **not** a lead-minutes subtraction — drop-off opens 7:45 and it clears Cristina's 8:03/8:23 train.
- `sensor.parochial_school_dismissal_time_today` selects the correct weekday input, `device_class: timestamp`, same construction and availability rules as task 7.
- `binary_sensor.parochial_school_in_session_today` requires a `Gianluca School` event present on the schedule calendar AND no `no school` marker AND the override off.
- Entity IDs use `parochial_school_*`; only friendly names and the dashboard heading say "Junior Kindergarten" (JK is a grade Gianluca ages out of).

### task-9: The kid layer

**Files**: `packages/school/kids/nino_school.yaml`, `packages/school/kids/gianluca_school.yaml` (new)

**Acceptance criteria**
- **Filename uniqueness verified first**: `find packages -name 'nino_school.yaml' -o -name 'gianluca_school.yaml'` returns only these. `!include_dir_named` keys packages by basename globally, so a collision is silent.
- `nino_school.yaml` maps Nino to the primary band; `gianluca_school.yaml` maps Gianluca to parochial. The mapping is a single referenced entity per kid, so a band change is a one-line edit.
- Each defines `binary_sensor.<kid>_school_day`, `sensor.<kid>_departure_time`, `sensor.<kid>_pickup_time` (the latter two `device_class: timestamp`, built and gated per task 7's rules).
- Nino gets `input_number.nino_departure_lead_minutes` and `input_number.nino_pickup_lead_minutes`; Gianluca gets `input_number.gianluca_pickup_lead_minutes` only — his departure reads the fixed input from task 8. **No `initial:` on any of them**; defaults (25 / 20 / 20) in header comments.
- Every `<kid>_school_day` sensor honours `input_boolean.school_day_override_off`.
- New sensor names must not collide with the still-live `input_boolean.nino_school_day` / `input_boolean.gianluca_school_day`, which survive until Track C — use `binary_sensor.` domain and confirm no `unique_id` overlap.

### task-10: Morning reminder

**File**: `packages/school/reminders/school_morning_reminder.yaml` (new)

**Acceptance criteria**
- Declares `input_datetime.school_breakfast_reminder_time` (no `initial:`) and one automation triggering on it.
- Conditions: `input_boolean.house_occupied` on, and either kid's new `binary_sensor.<kid>_school_day` on.
- Calls `script.voice_announcement` with `media_players: auto`, `sound: "school-bell-chime"`, preserving the existing random-line message style and the both-kids / Nino-only / Gianluca-only branches.
- The late-start branch reads `binary_sensor.primary_school_late_start_today`, not the old `input_boolean.district_late_start_wednesday`.
- Does **not** duplicate the gating already inside `script.voice_announcement` (`speech_notifications`, time window, bedtime).

### task-11: Per-kid departure reminders

**Files**: `packages/school/reminders/nino_departure_reminder.yaml`, `gianluca_departure_reminder.yaml` (new)

**Acceptance criteria**
- Each triggers via `trigger: time` / `at: sensor.<kid>_departure_time`.
- Nino's pushes to `devices: jk`; Gianluca's to `devices: cfalb` — matching who drives whom.
- **Both ship push-only: `script.general_notification` only, with the `script.voice_announcement` call present but commented out**, and a header comment stating that enabling TTS is an explicit decision after one week, not a scheduled un-suppression. This split turns one daily school-bell announcement into two 35 minutes apart, a behavior change that hasn't been lived with.
- Each conditions on the corresponding `binary_sensor.<kid>_school_day`.
- Both files carry a comment noting the trigger only schedules when the sensor's time is in the future, so a mid-morning reload can silently skip the day.

### task-12: Per-kid pickup reminders

**Files**: `packages/school/reminders/nino_pickup_reminder.yaml`, `gianluca_pickup_reminder.yaml` (new)

**Acceptance criteria**
- Each triggers via `trigger: time` / `at: sensor.<kid>_pickup_time`.
- Both use `script.general_notification` — Gianluca's raw `notify.ios_family` call from the old file is **not** carried over.
- Pushes route to the parent doing that pickup.
- Existing tag typo `nino_school_pikcup` is corrected to `nino_school_pickup`.
- New filenames must not collide with the still-live originals in `packages/school/{nino,gianluca}_school/automations/` — use the `packages/school/reminders/` path and confirm basenames are unique.

### task-13: Evening announcements

**Files**: `packages/school/reminders/school_closed_tomorrow_reminder.yaml`, `school_late_start_tomorrow_reminder.yaml` (new)

**Acceptance criteria**
- Each fires in the evening off the `_tomorrow` sensors from tasks 6 and 7, finally consuming a closed-tomorrow signal nothing reads today.
- Both call `script.voice_announcement` and condition on `input_boolean.house_occupied`.
- Late-start-tomorrow reads `binary_sensor.primary_school_late_start_tomorrow`.
- No `school_notable_event_tomorrow_reminder` is created — dropped as unrequested; the Tier 1 push already covers picture day.

### task-14: Re-point `morning_update.yaml`

**File**: `packages/reminders/morning_update.yaml`

**Acceptance criteria**
- Lines 114, 116, 150 read the new sensors and are converted from `states.<domain>.<object>.state` to **`is_state()`**, so a missing entity degrades instead of raising `UndefinedError` and killing the entire prompt render.
- Line 248's phantom `calendar.ninos_school` target is removed from the `calendar_events_today` `get_events` call.
- The `calendar_events_today` target list is **otherwise unchanged**, with a comment at line ~247 stating that `calendar.olph_school` and `calendar.gianluca_school` must not be added there because that aggregation is not tier-filtered — adding OLPH would pipe 710 events, 523 of them grade 5–8 volleyball practices, into a daily LLM prompt.
- The Tier 2 informational list is added to the prompt, **capped at 5 entries**.
- After this task, `morning_update.yaml` references no entity that Track C will delete.

### task-15: School dashboard view

**Files**: `dashboards/kohbo/school/school.yaml` (new), `dashboards/kohbo/kohbo.yaml` (edit)

**Acceptance criteria**
- New view at path `school`, included in `kohbo.yaml`, resolving the dead `/dashboard-kohbo/school` link at `dashboards/templates/includes/navbar.yaml:73`.
- Card conventions match an existing view — read `dashboards/kohbo/climate/climate.yaml` or a room view first and follow its structure, decluttering templates and `button_card_templates` usage.
- Sections: **Today** (per-kid school-day state, leave / start / pickup times, late-start badge, closures, and both override toggles), **Schools** (per-band time pickers), **Junior Kindergarten** (start, departure, five per-weekday dismissals), **Calendar** (actionable + informational), **Lunch**.
- Every schedule `input_datetime` from tasks 4, 7, 8 is editable from this view — it is the sole editing surface, since YAML-declared helpers are `editable: false` and never appear in Settings → Helpers.
- Header comment warns that the Yellow's `kohbo.yaml` must be verified against this repo before deploying, since host git divergence would make this a clobber.

### task-16: Static validation

**Acceptance criteria**
- `ha core check` (or `./deploy.sh --check` with Docker confirmed running) passes.
- Basename-uniqueness check is clean: `find packages -name '*.yaml' | xargs -n1 basename | sort | uniq -d` returns nothing.
- No new file uses a `.yml` extension — `!include_dir_named` never loads those.
- `grep -rn "platform: state\|service:\|^\s*trigger:$\|^\s*condition:$\|^\s*action:$" packages/school/` finds no legacy syntax in newly created files.
- No new file contains `initial:` on any `input_datetime`, `input_number` or `input_boolean`: `grep -rn "initial:" packages/school/` returns nothing.
- No new template block uses `hours: 1`: `grep -rn "hours: 1$" packages/school/` returns nothing.
- Every new trigger-based template contains `event_template_reloaded`.

---

## Human Gates — Track B (John, next session)

None of these can run in a worktree. **No Track A acceptance criterion depends on any of them.**

- [ ] **Capture the live baseline** (plan task 1) — 7 days of traces for the four existing school automations; current values of the five `.storage` helpers; enabled/disabled state of all eight school automations; a `.storage` reference sweep for every entity being renamed or deleted. This is the only rollback data that will exist.
- [ ] **Back up `secrets.yaml` outside the repo**, then `scp hassio:/homeassistant/secrets.yaml ./secrets.yaml` — local is missing `john_irk`, `john_state_topic`, `wifi_ssid`, `wifi_password`, and a naive push would delete them on the Yellow.
- [ ] **Migrate calendar IDs + lunch-menu identifiers to `!secret`**, then push `secrets.yaml` to the Yellow **before** committing anything that references a new key. A missing `!secret` is a hard config-load failure — the house goes down, not degrades.
- [ ] **Re-subscribe `calendar.olph_school` to Blackbaud feed 3** (`z=AOU3bxaz…`, 710 events). Drop the currently-subscribed empty feed 1. Delete the stale registry entry *first*, then rename the new entity back to `calendar.olph_school`.
- [ ] **Deploy and set every schedule value** through the new dashboard — they ship empty by design.
- [ ] **Live verification**, starting with the four `calendar.get_events` calls by hand in Developer Tools, then per-entity state checks. `ha core check` cannot see a missing calendar reference; that is exactly how the phantom-calendar bug survived.
- [ ] **Shadow-run a full school week including a Wednesday**, comparing new derived sensors against the still-live old booleans. Late start is Wednesday-only.
- [ ] **Then Track C**: the Phase 4 deletions, per the plan's ordered list.
- [ ] Fix Gianluca's calendar recurrence (currently runs to 2027-07-01).
- [ ] Leave the Workday integration alone.

---

## Out of scope

Glenbrook South / high-school band. OLPH feed 2 and the `(EC)` day-marker source-of-truth change. Per-band closure sensors for intermediate and middle. `input_boolean.late_start_cancelled`. The `initial:` bug in `nino_medication_reminder.yaml:58,64` (real, live, but a separate fix).
