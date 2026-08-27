---
title: School Automation Overhaul
slug: school-automation-overhaul
status: in-progress
created: 2026-08-25
has_pre_mortem: true
has_review: true
has_prd: true
---

# School Automation Overhaul

## Problem

The school package collapses three distinct concepts — **district**, **school**, and **kid** — into one chain of booleans, and most of that chain is broken.

**The calendar layer is built on entities that don't exist.** `google_calendars.yaml` is the *legacy* Google Calendar YAML format. The live instance (2026.7.4) runs the modern OAuth config entry, which ignores that file entirely; the `search:`/`offset:` sub-calendar feature it depends on was removed years ago. There is no `google:` block in `configuration.yaml`. Consequence: `calendar.ninos_school` and `calendar.nino_school_reminder` **do not exist on the Yellow** — confirmed against all 23 registered calendar entities. `binary_sensor.nino_is_today_school_day` calls `strptime()` on `None` on every state update, and three of Nino's automations trigger off phantom calendars. The file also lists the district calendar as `5tiq75cl…` while the live registry says `d35sd4tk…`, so it has been out of sync for a long time.

**Late start is detected from a calendar that no longer publishes it.** `binary_sensor.district_late_start_tomorrow` greps for `'Late Start Wednesday'`; the live feed contains zero such events. The working signal is `input_boolean.district_late_start_wednesday`, latched on by `primary_school_day_on` at 02:00 and off by `primary_school_day_off` at 23:59 — the same two-automation latch pattern that silently broke the birthday countdowns.

**Sensors that appear hourly update once a day.** `primary_school_closed.yaml:10`, `primary_school_closed_tomorrow.yaml:10`, `district_late_start_tomorrow.yaml:10` and `gianluca_is_today_school_day.yaml:4` all use `time_pattern` with `hours: 1`, which fires at 01:00 daily — not every hour. Only the lunch-menu sensor gets it right with `hours: /1`.

**A pile of dead and contradictory code.** `nino_school_day_reminder`, `nino_school_departure_reminder`, and `nino_school_reminder_notification` all carry `initial_state: off` and nothing ever enables them. `gianluca_school_day_on` enables `automation.gianluca_school_day_reminder` and `automation.gianluca_school_departure_reminder`, neither of which exists. `primary_school_day_off` calls `automation.turn_on` under a comment reading "Turn OFF." `sensor.primary_school_events_today` polls the calendar every 60 seconds and nothing reads it. `automations.yaml:241` holds a legacy "Nino Pickup" duplicate gated on `condition: time before 00:00:00`, which is never true. `primary_school_day_on` hard-depends on `binary_sensor.school_day`, a Workday helper in `.storage` invisible to git and to `ha core check`. `morning_update.yaml:248` still targets the phantom `calendar.ninos_school`, which likely breaks `sensor.calendar_events_today` and with it the briefing's birthday and calendar blocks.

**The naming is wrong and about to get worse.** `primary_school` is really Lyon, and `district_late_start_wednesday` is really a school bell-schedule fact, not a district one. When Nino moves to Pleasant Ridge, every `primary_school_*` entity would silently refer to the wrong building.

**The repo is public and leaks more than the school name.** `google_calendars.yaml` carries raw Google calendar IDs including Gianluca's `0014d514…@group.calendar.google.com`; if that calendar is publicly shared, the ID alone exposes a five-year-old's daily arrival and pickup schedule for the entire year.

Finally, the school view **is not in this repo**. `dashboards/templates/includes/navbar.yaml:73` links to `/dashboard-kohbo/school`, but `kohbo.yaml` has no such include and git history has never contained one — so that link is dead. The view in the screenshot is on the separate default storage-mode dashboard, not inside `dashboard-kohbo` (which is YAML mode and could not serve a storage view).

## Goal

Three clean layers — district, school (by grade band), kid — where late start is derived rather than latched, closures and events come from the calendars through one filter that distinguishes actionable from noise, each kid's departure and pickup times are computed from their own school's bell schedule, and the whole thing is visible and editable in a version-controlled dashboard. No entity in the finished system depends on a calendar that doesn't exist.

## Approach

**Derive, don't latch.** Every "is it a school day / is it late start" fact becomes a template `binary_sensor` computed from the school year bounds, the weekday, and the calendars. This deletes `input_boolean.primary_school_day`, `input_boolean.nino_school_day`, `input_boolean.gianluca_school_day`, `input_boolean.district_late_start_wednesday`, the `binary_sensor.school_day` Workday dependency, and the six on/off automations that maintain them. A derived sensor cannot desync from its source the way the birthday flags did.

Because deriving removes every manual override by construction, two override booleans ship as **required**, not optional: `input_boolean.school_day_override_off` (snow day, sick day, anything announced by robocall or text rather than calendar) and `input_boolean.early_dismissal_today`. Illinois closures do not arrive on a Google calendar. Without these, the system's answer to "it's snowing" is "go edit a calendar."

**Name schools by grade band, not by building.** `primary` (K–2), `intermediate` (3–5), `middle` (6–8) — the district's own vocabulary, per its calendar ("Primary Schools Curriculum Night," "Intermediate Schools Curriculum Night"). Kids point at a band through a single mapping, so Nino moving buildings is a one-line change rather than a rename sweep. Generic naming is a side benefit, not the justification. **Glenbrook South is deliberately out of scope** — it's District 225, with a different calendar, different closure feed and unknown hours, so the D34 band abstraction doesn't hold for it. Its times get a comment in `school_year.yaml` when known, not a stub package full of permanently-`unknown` entities.

**Schedule config is declared in YAML, owned at runtime, and must not set `initial:`.** Every school time — year bounds, per-band start / late-start / dismissal, Gianluca's per-weekday dismissals — is a YAML-declared `input_datetime`. The YAML declares the *entity* (structure git-tracked, validated by `ha core check`) while the *value* lives in `.storage`, editable from the dashboard and writable by a future home/life agent through the HA API with no repo access.

**`initial:` must be omitted from every one of these.** In HA 2026.7.4, `input_datetime`, `input_number` and `input_boolean` all skip state restoration when `initial:` is set (`# Don't restore if we got an initial value.` / `if self.state is not None: return`). Setting it means every dashboard edit silently reverts to the YAML default on the next restart — the exact class of quiet-wrong failure this project exists to eliminate. Real times go in a header comment; values are set once via `input_datetime.set_datetime`. A from-scratch rebuild then comes up *empty* rather than plausibly-wrong: the derived timestamp sensors go `unknown`, the time triggers never fire, and the failure is a loud absence instead of a silent misfire. (`packages/people/nino/medication_reminder/nino_medication_reminder.yaml:58,64` has this same latent bug on dose times — worth fixing while the mechanism is understood, but out of scope here.)

Only derived values stay as template sensors: `sensor.<kid>_departure_time` and `sensor.<kid>_pickup_time` compose the inputs with today's date and the late-start rule.

**Timestamp sensors replace `input_datetime` sprawl for triggering.** Each kid gets `sensor.<kid>_departure_time` and `sensor.<kid>_pickup_time` with `device_class: timestamp`, and automations trigger via `trigger: time` / `at: sensor.<kid>_departure_time`. On a non-school day the sensor is `unavailable` and the trigger never fires — gating is structural rather than conditional.

Two hard requirements. The state must be **timezone-aware**: build it as `today_at('00:00') + timedelta(seconds=state_attr('input_datetime.x','timestamp'))`, never `as_datetime()` on a concatenated string, which yields a naive value that makes `SensorEntity.state` raise under `device_class: timestamp` and errors the entity outright. This is also what makes it DST-safe across the two transitions inside the school year (2026-11-01, 2027-03-08). And gate with an `availability:` template rather than rendering an empty state, so the sensor reads `unavailable` rather than the string `"None"`.

The time trigger only schedules when `trigger_dt > utcnow()` — strictly, with no listener and no log entry if the time has already passed. So a sensor that settles on today's departure time *after* that time has passed silently never fires. This is why every trigger-based template needs a reload trigger (below).

**Every trigger-based template gets three triggers.** `time_pattern` with `hours: /1` (not `hours: 1`, which is 01:00 daily and is the bug in four existing files), `homeassistant` start, and `event: event_template_reloaded`. Without the third, `reload_all` leaves newly-created sensors `unknown` until the next hourly tick — verification looks like a failure for up to an hour, and any timestamp trigger whose time passes inside that window is lost for the day.

**One template block per calendar, not one block for all four.** A service call that returns response data **raises** when it resolves to zero entities, aborting the entire action sequence. Four `get_events` calls in one block means one bad calendar reference kills every closure and event sensor at once — a live risk given `calendar.olph_school` is about to be re-subscribed and may come back `_2`-suffixed. Separate blocks fail independently, plus `continue_on_error: true` per call and `| default({})` on each response variable. Each call targets `entity_id: !secret <name>` and iterates `.values() | map(attribute='events')`, so no school calendar ID appears in the repo, in YAML or in Jinja.

**Closure rule, verified against live data — with a grade-scope guard.** `'no school' in summary | lower` correctly classifies all 62 district events and all 77 Lyon events with zero false positives — it catches `District Closed | No School`, `Institute Day | No School`, `Winter Break | No School`, `No School - Family Teacher Conferences`, `No School - Spring Break`, and Gianluca's `GIANLUCA - NO SCHOOL`, while correctly ignoring `Last Day of School: Students` and `Preschool Screening Day - NO Preschool Student Attendance`. The current extra `'District Closed' in summary` clause is dropped: it matches the district's bare office-closure markers and is a latent false-positive.

**OLPH breaks that rule, and the guard must cover word-scopes as well as numeric ones.** Its calendar carries *grade-scoped* closures — `Grade 2 - No School`, `Grade 8 - No School`, `Grades 6 & 7 - No School`. A bare `'no school'` match would mark Gianluca's school closed on three days he's actually attending. The guard rejects `grade[s]?\s*[K0-9]`, `\d(st|nd|rd|th)\s+grade`, and the word-scopes `kindergarten`, `preschool`, `\bEC\b` — the last three matter precisely because he's in an Early Childhood section, making `Kindergarten - No School` and `Grades K-2` the likeliest next variants. An unrecognized scoped closure fails **open**: not closed for this kid, but surfaced as Tier 2 so it's visible rather than silently wrong. D34's feeds have no grade-scoped closures, so the guard costs nothing there.

**Multi-day events must be matched by overlap, not by start date.** OLPH returns multi-day all-day events as a single event carrying the original start date, unclipped and unexpanded — verified: 9 of its 119 all-day events span more than one day, including `NO SCHOOL - Thanksgiving` (2026-11-25 → 11-28) and `Easter Vacation` (11 days). Testing `event.start[:10] == day` would read Gianluca's school *open* for all of Thanksgiving break except the first day. Test overlap instead: all-day is end-exclusive, so `event.start[:10] <= day and day < event.end[:10]`; timed uses `event.start[:10] <= day <= event.end[:10]`. Detect all-day with `event.start | length == 10`. D34 and Lyon serialize breaks as separate per-day events and are unaffected, but the overlap test is correct for both.

**Events get three tiers, not a boolean.** Tier lists are built from the real vocabulary of all three feeds (62 district + 77 Lyon + 710 OLPH events). **Tier 1 is tested first**, then athletics is dropped from the remainder — running the athletics filter first risks eating a Tier 1 event whose summary happens to contain `- Game`.

- **Tier 1, actionable** (announce + push): `no school` (grade-guarded), any `dismissal` / `early dismissal` (`Fun Fair - 11:00 AM Dismissal`, `Last Day of School - 11:00 AM Dismissal`, `School Picnic - 1:00 PM Dismissal`), picture day and retakes (`Picture Day`, `Picture Retake Day`, `K - 8 School Pictures`), `Vision and Hearing`, `Parent Teacher Conferences`, first/last day, `School Resumes` / `Classes Resume`.
- **Tier 2, informational** (morning-update mention only, **capped at 5** before it reaches the LLM prompt): `Book Fair`, `International Night`, field trips, `Open House`, concerts and sings, prayer services scoped to the kid's own grade, `No Bus Service`, and anything unrecognized.
- **Tier 3, ignored**: board and committee meetings, `Curriculum Night`, `Partners in Learning`, `Preschool Screening`, `Last Day of School: Staff`, PTA operational events, and **all athletics**.

Athletics is the single biggest filter: `' - Practice'` / `' - Game'` matches **523 of OLPH's 710 events (73%)**, entirely grade 5–8 sport irrelevant to a JK student. Results are deduped on `(summary, start)` — `District Closed | No School` appears on both the district and Lyon feeds and would otherwise be announced twice.

**Gianluca: calendar answers *whether*, inputs answer *when*.** His shared Google calendar stays the authority for whether he has school — 189 timed `Gianluca School` events plus `GIANLUCA - NO SCHOOL` markers, already expanded per-day by Google, no rrule parsing needed. The *times* move to inputs because his schedule shifts through the year and shouldn't require editing 189 events. Live data confirms the split is exactly per-weekday: Mon 14:20, Tue 12:20, Wed 14:20, Thu 12:20, Fri 12:20, start always 08:05.

His departure is a fixed time, not a computed lead: drop-off opens at 07:45 and Cristina's train is 8:03 or 8:23, so `input_datetime.parochial_school_departure_time` is simply 07:45.

`calendar.olph_school` is his equivalent of `calendar.lyon_school` — closures and picture-day alerts — and needs re-pointing at the correct Blackbaud feed first (see Manual Steps).

**Naming note on "Junior Kindergarten."** Entity IDs stay `parochial_school_*`; the dashboard heading reads "Junior Kindergarten." JK is a *grade* Gianluca ages out of in a year while staying at the same parochial school — naming entities after it walks back into the trap we avoided with `primary_school`.

### Target structure

```
packages/school/
├── school_year.yaml                    # year-bound inputs + binary_sensor.school_year_active
├── school_overrides.yaml               # override + early-dismissal booleans
├── district_calendar_sensors.yaml      # one template block per calendar, not one for all
├── primary_school_calendar_sensors.yaml
├── parochial_school_calendar_sensors.yaml
├── schools/
│   ├── primary_school_schedule.yaml    # K-2   8:45 / 9:45 Wed / 3:40
│   ├── intermediate_school_schedule.yaml # 3-5 7:45 / 8:45 Wed / 2:40
│   ├── middle_school_schedule.yaml     # 6-8   8:15 / 9:15 Wed / 3:10
│   └── parochial_school_schedule.yaml  # "Junior Kindergarten" - 8:05 + per-weekday dismissals
├── kids/
│   ├── nino_school.yaml                # -> primary band
│   └── gianluca_school.yaml            # -> parochial
├── reminders/
│   ├── school_morning_reminder.yaml
│   ├── nino_departure_reminder.yaml
│   ├── gianluca_departure_reminder.yaml
│   ├── nino_pickup_reminder.yaml
│   ├── gianluca_pickup_reminder.yaml
│   ├── school_closed_tomorrow_reminder.yaml
│   └── school_late_start_tomorrow_reminder.yaml
└── primary_school_lunch_menu.yaml      # kept, identifiers moved to secrets
```

Every filename is globally unique. `!include_dir_named` keys packages by **basename across the whole tree**, so `schools/lyon/schedule.yaml` would silently collide with any other `schedule.yaml`. Note `nino_school.yaml` and `gianluca_school.yaml` must be checked against `packages/people/nino/` and `packages/people/gianluca/` before use.

## Tasks

### Phase 0 — ship separately, first

0. **Take `deploy.sh` out of the secrets business.** Delete the `cp secrets.fake.yaml secrets.yaml` at line 60, the `rm -f secrets.yaml` in the failure branch at line 66, and the `rm -f secrets.yaml` at line 68. No script writes to or deletes that file again. Decide explicitly what `check_config` runs against — the real `secrets.yaml` present locally, or skip the step — and whether `secrets.fake.yaml` still has a purpose or can be retired. **Also make the Docker-missing path fail loudly.** Line 56–58 currently prints `⚠️ Docker not found. Skipping config check.` and continues with exit 0, so the repo's only validation gate can silently be a no-op — a real possibility while this very task is rewriting that block. Make it non-zero, or at minimum print something that cannot be mistaken for success. **This is its own commit, shipped and verified before Phase 1 begins.** Verify both paths: run `./deploy.sh --check` with Docker stopped (expect non-zero), then with Docker running (expect the check to actually execute).

### Phase 1 — baseline, secrets, safe cleanup

1. **Capture a live baseline before deleting anything.** Via the `homelab` agent, recorded in an `## Environment (verified live)` section — this is the *only* rollback data that will exist:
   - (a) Automation traces / logbook for the last 7 school days for `school_day_reminder`, `school_departure_reminder`, `nino_school_pickup_reminder`, `gianluca_school_pickup_reminder`. Establishes what actually fires today, which is genuinely unknown given `initial_state: off` plus `district_school_year_activate`. If nothing fires, the entire cutover de-risks.
   - (b) The current **values** of the five `.storage` helpers slated for deletion (`district_34_first_day_of_school`, `district_34_last_day_of_school`, `school_day_breakfast_reminder_time`, `school_day_departure_reminder`, `primary_school_pickup_reminder`).
   - (c) The current **enabled/disabled state of all eight existing school automations.** Required for rollback: restored files do not restore enabled state, which lives in `.storage`.
   - (d) A **`.storage` reference sweep** for every entity ID being deleted or renamed — `core.entity_registry`, `homeassistant.exposed_entities`, `cloud`, `automations`, `scripts`, `scenes`. Renames can reach Google/Alexa voice exposure and UI-created automations that this repo cannot see, and those fail as unhelpful voice errors rather than log lines.
2. **Sync `secrets.yaml` down from the Yellow.** Drift is confirmed and one-directional: remote 53 keys, local 49, local a strict subset. Missing locally: `john_irk`, `john_state_topic`, `wifi_ssid`, `wifi_password`. A straight `scp hassio:/homeassistant/secrets.yaml ./secrets.yaml` is safe and needs no merge. **Back the file up outside the repo first** — it's gitignored, so `git revert` cannot restore it. Doing this before adding keys matters: pushing the current local file back would delete those four on the Yellow, taking John's BLE presence tracking with them.
3. **Delete `google_calendars.yaml`** — dead legacy config, the repo's largest privacy leak, and the source of the phantom-calendar confusion. Nothing references it.
4. **Move calendar IDs to secrets, and push to the Yellow before the referencing commit.** Keys: `district_calendar`, `primary_school_calendar` (`calendar.lyon_school`), `parochial_school_calendar` (`calendar.gianluca_school`), `parochial_school_events_calendar` (`calendar.olph_school`). **`scp` the updated `secrets.yaml` to the host *before* committing anything that references a new key** — a missing `!secret` is a hard config-load failure, so the house goes down entirely rather than degrading. Label this honestly in the commit: the secret's value is an HA entity_id, visible in the UI, logs and traces, so this is obfuscation of the school name, not security. The real leak closed by task 3.
5. **Scrub lunch-menu identifiers** — HealthePro org / site / menu IDs into secrets, drop the `site 18853 = Lyon Elementary` comment. Same push-before-commit rule.
6. **Safe deletions (no remaining consumers).** `district_late_start_tomorrow.yaml`, `district_late_start_wednesday_boolean.yaml`, `primary_school_events_today.yaml` (the 60s poller), `nino_school_day_reminder.yaml`, `nino_school_reminder_notification.yaml`, `nino_school_departure_reminder.yaml`, `gianluca_school_reminder_notification.yaml`, `nino_is_today_school_day.yaml`, the `Nino Pickup` automation at `automations.yaml:241` (`id: '1646884521741'`), and **`templates/speech/briefing.yaml` in its entirety** — `templates/` is not referenced in `configuration.yaml` at all, so the whole file is dead; deleting only the `pickup_nino()` macro would leave its call site at `:57` behind.

### Phase 2 — the new layers

7. **`school_year.yaml`** — `input_datetime.school_year_first_day` / `school_year_last_day` (date mode, **no `initial:`**, real dates in a header comment) plus `binary_sensor.school_year_active`. Also carries a commented reference block for Glenbrook South's hours when known.
8. **`school_overrides.yaml` + `school_overrides_reset.yaml`** — `input_boolean.school_day_override_off` and `input_boolean.early_dismissal_today`, the only manual controls in a derived system; every school-day sensor and departure reminder honours them. **Both get an unconditional nightly reset at 23:58, in its own file, with an empty `conditions:` block.** This is not optional and the reset must not be gated on anything — school-year-active, house-occupied, nothing. A manual latch with no reset is exactly the birthday-countdown failure (flag set, gated reset never fires, flag latches forever); introducing two of them to patch the one gap that deriving creates would reintroduce the bug this project exists to eliminate.
9. **The three calendar sensor blocks** — one file per calendar (district, primary, parochial), each an independent trigger-based template with all three triggers, `continue_on_error: true`, and `| default({})`. Emitting `binary_sensor.<scope>_closed_{today,tomorrow}` and `sensor.<scope>_events_{today,tomorrow}`. Overlap matching, grade-scope guard, Tier-1-before-athletics ordering, dedup on `(summary, start)`. Event payloads go in **attributes**, with `state: "{{ now().isoformat() }}"` — a joined summary list would blow the 255-char state limit.
10. **The three D34 band schedules** — per band, three `input_datetime` helpers (`<band>_school_{start_time,late_start_time,dismissal_time}`, no `initial:`), plus derived `sensor.<band>_school_{start,dismissal}_time_today` (`device_class: timestamp`, late-start aware, `availability:`-gated) and `binary_sensor.<band>_school_{late_start_today,late_start_tomorrow,in_session_today,in_session_tomorrow}`. Late start is `weekday == 2 and in_session` — derived, so nothing can latch. `late_start_tomorrow` replaces the broken calendar-grep sensor and feeds the evening announcement.
11. **`parochial_school_schedule.yaml`** — `parochial_school_start_time` (08:05), `parochial_school_departure_time` (07:45, fixed), and five per-weekday dismissal inputs. Derived `sensor.parochial_school_dismissal_time_today` picks by weekday. `binary_sensor.parochial_school_in_session_today` requires a `Gianluca School` event *and* no `no school` marker *and* no override.
12. **The kid layer** — `nino_school.yaml` maps Nino to primary, `gianluca_school.yaml` maps GL to parochial. Each defines `binary_sensor.<kid>_school_day`, `sensor.<kid>_departure_time`, `sensor.<kid>_pickup_time`. Nino gets `input_number.nino_{departure,pickup}_lead_minutes` (25 / 20); Gianluca's departure reads the fixed input and his pickup gets its own lead input (20).

**Shadow-run gate.** Because Phase 4's deletions are deferred, the old booleans are still live here. Before proceeding, compare `binary_sensor.nino_school_day` against `input_boolean.nino_school_day` and `sensor.nino_departure_time` against the old `input_datetime`. This is free, it's the only real integration test available, and it directly falsifies the timestamp-trigger risk. **The run must span a full school week including a Wednesday** — late start is Wednesday-only, so a two-day run would leave `binary_sensor.primary_school_late_start_today` completely unvalidated, and that is the highest-risk derived sensor in the plan, replacing a mechanism that demonstrably broke before.

### Phase 3 — reminders

13. **`school_morning_reminder`** — household breakfast nudge on a YAML-declared `input_datetime.school_breakfast_reminder_time`, preserving the random-line style. Late-start branch re-points at `binary_sensor.primary_school_late_start_today`.
14. **Departure, split per kid** — `nino_departure_reminder` on `sensor.nino_departure_time`, TTS plus a push to **John** (`devices: jk`); `gianluca_departure_reminder` on `sensor.gianluca_departure_time` (07:45), TTS plus a push to **Cristina** (`devices: cfalb`). Times separate cleanly, so no collision handling needed. **Ship push-only for the first week with TTS suppressed** — a wrong time then notifies a parent instead of announcing a wrong time to the whole house. Enabling TTS at the end of that week is an **explicit decision, not a scheduled un-suppression**: this split turns one daily school-bell announcement into two, 35 minutes apart, through `media_players: auto` into whichever rooms are occupied. That behavior change wasn't requested and hasn't been lived with. Gianluca's 07:45 may be better left push-only permanently, since Cristina is the only person who needs it and she's the one leaving.
15. **Pickup reminders rebuilt** — re-pointed at the new timestamp sensors, each push routed to the parent doing that pickup, and Gianluca's raw `notify.ios_family` standardized onto `script.general_notification`.
16. **Evening announcements** — `school_closed_tomorrow_reminder` and `school_late_start_tomorrow_reminder`, firing off the `_tomorrow` sensors. **This is the cut line** — the sensors ship in tasks 9–10 regardless, so these two automations are the clean fast-follow if scope needs trimming. (`school_notable_event_tomorrow_reminder` is dropped as unrequested; the Tier 1 push already covers picture day.)

### Phase 4 — cutover

17. **Update `packages/reminders/morning_update.yaml` — before any Phase 4 deletion.** Re-point lines 114, 116, 150 at the new sensors, **converting `states.<entity>.state` to `is_state()`** so a future rename degrades instead of raising `UndefinedError` and killing the whole prompt. Fix line 248's phantom `calendar.ninos_school` target. Add the Tier 2 list (capped at 5) to the prompt. **Leave the `calendar_events_today` target list otherwise unchanged, and add a YAML comment at line 247 saying so:** that aggregation is *not* tier-filtered, so adding `calendar.olph_school` there — an obvious-seeming improvement — would pipe 710 events, 523 of them grade 5–8 volleyball practices, into a daily LLM prompt. School events reach the briefing only through the tier-capped `sensor.school_events_today`.
18. **Deletions whose consumers are now rewritten.** `primary_school_closed.yaml` and **`primary_school_closed_tomorrow.yaml`** (the latter's `unique_id` collides directly with task 9's sensor — leaving it causes HA to drop one or `_2`-suffix the other, silently breaking tasks 10 and 16), `primary_school_day_{on,off,boolean}.yaml`, `nino_school_day_{on,off}.yaml`, `nino_school_day.yaml`, `gianluca_school_day_{on,off}.yaml`, `gianluca_school_day.yaml`, `gianluca_is_today_school_day.yaml`, `district_school_year_{activate,deactivate,active_boolean}.yaml` (activate calls `automation.turn_on` on now-deleted automations and triggers on `automation_reloaded`, so it would error on **every deploy**), and the four renamed originals: `school_day_reminder.yaml`, `school_departure_reminder.yaml`, `nino_school_pickup_reminder.yaml`, `gianluca_school_pickup_reminder.yaml`.
19. **Dashboard** — `dashboards/kohbo/school/school.yaml` plus the include in `kohbo.yaml`, fixing the dead navbar link. **Verify the Yellow's `kohbo.yaml` matches this repo before writing** — host git divergence has bitten before, and a deploy would clobber whatever is live. Sections: Today (who has school, leave/start/pickup, late-start badge, closures, override toggles), Schools (per-band time pickers), Junior Kindergarten (start, departure, five dismissals), Calendar, Lunch. **Not cuttable** — YAML-declared `input_datetime` entities are `editable: false` and don't appear as helpers in Settings, so without this view the only way to change a school start time is Developer Tools → Actions. The *scope* is cuttable: ship Today + the pickers, defer Calendar and Lunch.

### Phase 5 — verify

20. **Validate and verify against explicit criteria.** `ha core check`, then reload `input_datetime` and `input_number` **before** `template` (`reload_all` runs domains concurrently and trigger-based templates don't self-heal against not-yet-created entities) — or simply run `reload_all` twice. Do **not** restart. Then a per-entity acceptance table in the style of `plans/nino-two-dose-medication/plan.md:12`, asserting each new sensor resolves to a real value, not `unknown`. Plus: `find packages -name '*.yaml' | xargs -n1 basename | sort | uniq -d` to catch the `!include_dir_named` collision the plan warns about but never tests for, and a live check that each `get_events` target actually resolves — the failure mode that hid the phantom-calendar bug for years. Exit code 0 is not evidence.

### Rollback

**`git revert` alone does not restore working automations.** The four restored automations carry `initial_state: off`, and HA restores their last *runtime* enabled state from `.storage` — not from the YAML. The automation that used to enable them (`district_school_year_activate`) is deleted in the same phase. So a naive revert produces a system where the new automations are gone and the old ones exist but are silently **disabled**, with zero traces to reveal it. Nobody gets to school and nothing looks broken.

Ordered recovery from a bad Phase 4 cutover:

1. `git revert` the Phase 4 commit(s). Leave Phases 1–3 in place — the new layer runs in parallel and doesn't interfere once Phase 4 is undone.
2. Deploy (`./deploy.sh --skip-ci`) and reload.
3. Restore `district_school_year_activate.yaml` **first** and confirm it loaded.
4. Explicitly `automation.turn_on` each restored automation — they will **not** self-enable: `automation.school_day_reminder`, `automation.school_departure_reminder`, `automation.nino_school_pickup_reminder`, `automation.gianluca_school_pickup_reminder`, `automation.primary_school_day_on`, `automation.primary_school_day_off`, `automation.nino_school_day_on`, `automation.nino_school_day_off`.
5. Cross-check each against the enabled-state baseline from task 1(c) — some may have been legitimately disabled before this project started.
6. Confirm by trace, not by state: a saved trace on the next school morning is the only proof. Zero traces is the tell.

Three things `git revert` cannot reach at all: **`secrets.yaml`** (gitignored — the task 2 backup is the only copy), **the five `.storage` helper values** (captured in task 1(b) and nowhere else), and **orphaned entity-registry rows** for deleted template sensors, which persist and cause `_2` suffixing on re-creation — purge them before re-creating anything with the same `unique_id`.

### Landing guidance

School started 2026-08-20, so every build day is a live school day and there is no freeze window. This needs **two weekends**, not one — the shadow-run gate and a single Friday landing are incompatible, since shadowing after a Saturday landing would push Phases 3–4 into the middle of a live school week.

- **Weekend 1** — land Phases 1–2.
- **The following full school week** — shadow run, including a Wednesday.
- **Weekend 2** — land Phases 3–4.

Each landing is on a Friday evening or Saturday so the first live exercise is a Monday morning someone is watching.

### Manual steps for John

- **Re-subscribe `calendar.olph_school` to the right Blackbaud feed.** Of OLPH's three, the currently subscribed one is empty (`HTTP 200`, zero `VEVENT`s). Verified by direct fetch: **feed 1** (`z=rmujZ6Vp…`) 0 events — drop it; **feed 2** (`z=d%2f1WW8gY…`) 549 events, Gianluca's JK2 class schedule — leave alone unless the optional item below is taken; **feed 3** (`z=AOU3bxaz…`) 710 events, the school-wide events calendar — **this is the one to subscribe.**
  - *Entity-ID gotcha:* Google can't edit a subscription URL, so this is unsubscribe-then-subscribe and HA registers a **new** entity (likely `calendar.olph_school_2`) while the old lingers orphaned. Delete the stale registry entry **first**, then rename the new one to `calendar.olph_school` so the secrets key stays stable.
  - *Google-side noise:* 523 of feed 3's 710 events are grade 5–8 athletics. The classifier hides them from HA but not from Google Calendar on a phone — untick its visibility there if annoying; HA keeps reading it.
- Delete the stale `.storage` helpers **after** task 1 has recorded their values: `input_datetime.district_34_first_day_of_school`, `district_34_last_day_of_school`, `school_day_breakfast_reminder_time`, `school_day_departure_reminder`, `primary_school_pickup_reminder`.
- Set the new schedule values once via the dashboard after task 19 (they ship empty by design — no `initial:`).
- Fix Gianluca's calendar recurrence — it runs to **2027-07-01**, which looks like an uncapped rule for a JK year ending in late May or June.
- **Leave the Workday integration alone.** This project removes the only known consumer of `binary_sensor.school_day`, but three Workday-derived calendars exist on the instance (`calendar.school_day_calendar`, `calendar.preschool_days_calendar`, `calendar.workday_sensor_calendar`) and this repo cannot see `.storage` automations, scripts or scenes that might use them. An orphaned integration costs nothing; removing it is a separate, independently-verifiable cleanup that should not ride along with this change.
- Rotating Gianluca's Google calendar ID is the only real remediation for the 16 commits of history that already contain it.

### Optional — priced separately, cut freely

- **`input_boolean.late_start_cancelled`** (~10 lines, 1 entity). Covers the district cancelling a late start mid-year. *Polish* — has never happened, and the morning reminder saying "late start" on a normal Wednesday is an annoyance, not a failure.
- **Per-band closure sensors for intermediate / middle** (~20 lines, 4 entities). No kid attends these yet and only the district calendar covers them. *Polish* — the schedule sensors from task 10 already give the start/end times and in-session state that were asked for.
- **Subscribe OLPH feed 2 and drive Gianluca's school day off its `(EC)` day markers** (~20 lines, 1 calendar + 2 entities). Feed 2 emits an all-day `Monday (EC)` … `Friday (EC)` marker on exactly the 211 days JK2 is in session — a school-authoritative signal that would **retire the hand-maintained `calendar.gianluca_school` entirely**. Worth doing, but separated because it's a source-of-truth change, not part of the restructure. **It cannot supply his times** — feed 2's homeroom events run 07:50→14:20 on all five weekdays, the section's full available day, not the extended-day options he's enrolled in. Which confirms the per-weekday dismissal inputs are necessary regardless.

## Risks

- **`initial:` on any schedule helper silently reverts dashboard edits at the next restart.** The single highest-impact defect found in review, and the reason the reversal to inputs was nearly made on a false premise. Mitigation: `initial:` is banned from every schedule helper in tasks 7, 10, 11, 12; values are set once via `set_datetime` and the real times live in header comments. Verify by restarting a test instance, not by reloading — reloads don't exhibit the bug.
- **Multi-day OLPH closures read "not closed" if matched by start date.** Verified: 9 of OLPH's 119 all-day events span multiple days, including Thanksgiving and an 11-day Easter Vacation. Mitigation: overlap matching in task 9, with those 9 events as concrete test cases.
- **`primary_school_closed_tomorrow.yaml` collides on `unique_id` with task 9's sensor.** Mitigation: task 18 deletes it, and task 20's basename/uniqueness checks catch a miss.
- **Deleting before task 17 kills the morning briefing entirely.** `states.<entity>.state` raises `UndefinedError` on a missing entity, so the whole `conversation.process` prompt fails to render — no briefing at all, not a degraded one. Mitigation: task ordering puts every risky deletion in Phase 4 after task 17, and task 17 converts those reads to `is_state()`.
- **A missing `!secret` key is a hard config-load failure, not a warning.** The house goes down, not degrades. Mitigation: tasks 4 and 5 push `secrets.yaml` to the Yellow *before* the referencing commit.
- **Zero-entity resolution on a response-returning service raises and aborts the sequence.** Mitigation: one template block per calendar plus `continue_on_error: true`, so a bad reference costs one sensor rather than all of them.
- **`reload_all` leaves new trigger-based sensors `unknown` for up to an hour**, and a timestamp trigger whose time passes in that window is silently lost. Mitigation: `event_template_reloaded` on every block; reload `input_*` before `template`.
- **Grade-scoped closures could still slip through on an unanticipated word-scope.** Mitigation: the guard covers numeric and word scopes and fails *open* into Tier 2, so an unrecognized scope surfaces visibly rather than closing school silently.
- **Snow days and text-announced closures have no calendar signal at all.** Mitigation: `school_day_override_off` is a required task, not optional.
- **`ha core check` cannot validate calendar entity references.** Precisely how the phantom-calendar bug survived. Mitigation: task 20 requires a live per-entity check.
- **Task 19 could clobber a diverged `kohbo.yaml` on the host.** Mitigation: task 19 verifies host against repo before writing.
- **Entity renames may reach `.storage` artifacts this repo can't see** — scripts, scenes, UI automations, voice-assistant exposure and Google/Alexa aliases. Mitigation: the storage dashboard is being replaced; the rest is checked during task 20's live verification.
- **Mid-year ship, every build day a live school day.** Mitigation: Friday/Saturday landing, push-only first week, and the Phase 2 shadow-run gate.
- **Scope remains large.** Mitigation: Phase 0 ships alone; Phase 1 is independently shippable; Phases 2–3 are the core; task 16 is the clean trim point. Task 19 is *not* cuttable — only its scope is.

On approval → /approve → /ship school-automation-overhaul
