# PRD — Kid At-School Detection

Plan: `plans/kid-at-school-detection/plan.md` · Pre-mortem: `pre-mortem.md` · Review: `review.md`

## Goal

Add a per-kid `binary_sensor.<kid>_at_school` that is on only with positive evidence the kid left for school and it is still school hours, and gate the Nino dose-2 voice announcement on it. Every failure in the derivation chain must land on "announce".

## Global constraints (apply to every task)

- **Read first, every task**: `CLAUDE.md`, `packages/school/LEARNINGS.md`, `plans/kid-at-school-detection/plan.md`, `plans/kid-at-school-detection/working-memory.md`, plus the task's own read list.
- **Phantom-task check before writing**: `grep -rn "<entity or id you are about to create>" packages/ dashboards/` must return nothing. If it exists, stop and record it in working-memory.md.
- **Modern HA syntax only**: `triggers:` / `trigger:` / `conditions:` / `actions:` / `action:` / `target:`. No `platform:`, no `service:`, no root-level `entity_id:` in actions.
- **Condition ordering** global → room → feature (house/kid-level state before feature-level toggles).
- **Header comments short**: title line + 1-3 lines. Reasoning goes in the commit message, not the file.
- **No `initial:`** on any helper (disables state restoration, see LEARNINGS).
- **Entity IDs derive from `alias:`/`name:`**, not `id:`/`unique_id:`. Use `default_entity_id:` on template entities as the neighbouring files do.
- **Zones are UI-defined** (`zone.lyon_school`, `zone.olph_school`) and do not appear in the repo. Do not add them to `configuration.yaml`.
- **Scope discipline**: build exactly what the task says. Gianluca gets helpers + latch + sensor only. No Gianluca ping, handler, or chip. No unrequested polish.
- **Validation**: `ha core check` does not exist on this machine. Local validation is `tests/.venv/bin/python tests/run_tests.py --syntax --modern` (fallback: `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" <file>` for files without custom tags). Never claim "config is valid"; the honest AC is "YAML parses and the modern-syntax test passes; HA schema validation deferred to post-merge `ha core check` on the Yellow". Never run `deploy.sh --check` (it deletes `secrets.yaml`). Never restart HA.
- **Sequential subagents only.** One developer at a time in the worktree.

---

## Task 1: Per-kid helpers and nightly reset

**Files:** `packages/school/school_overrides.yaml`, `packages/school/school_overrides_reset.yaml`

**Read first:** both target files; `packages/school/school_year.yaml` (the "no initial:" precedent the overrides header cites).

Add four `input_boolean`s to `school_overrides.yaml` under the existing two: `nino_home_today` (name "Nino Home Today", icon `mdi:home-heart`), `nino_dropped_off` (name "Nino Dropped Off", icon `mdi:car-arrow-right`), `gianluca_home_today`, `gianluca_dropped_off` (same names/icons with the kid swapped). Update the header comment's "only two manual controls" wording to reflect six. Add all four entity IDs to the `input_boolean.turn_off` target in `school_overrides_reset.yaml`. Do not add `conditions:` or `initial_state:` to the reset (the header forbids it).

**Acceptance criteria:**
1. `school_overrides.yaml` declares exactly six `input_boolean`s: the two existing plus the four new; none has `initial:`.
2. `school_overrides_reset.yaml` turns off all six at 23:58 and still has no `conditions:` block and no `initial_state:`.
3. Header comment of `school_overrides.yaml` no longer says "only two manual controls".
4. `grep -rn "nino_home_today\|nino_dropped_off\|gianluca_home_today\|gianluca_dropped_off" packages/ dashboards/` before the edit returned nothing (phantom check recorded in working-memory.md).
5. YAML parses and `tests/run_tests.py --syntax --modern` passes for the two files; HA schema validation deferred to post-merge `ha core check`.

---

## Task 2: Drop-off latch automations (both kids)

**Files:** `packages/school/kids/nino_dropped_off.yaml` (new), `packages/school/kids/gianluca_dropped_off.yaml` (new)

**Read first:** `packages/school/reminders/nino_departure_reminder.yaml` and `gianluca_departure_reminder.yaml` (condition style, kid-level gating); `packages/school/kids/nino_school.yaml` and `gianluca_school.yaml` (which timestamp sensors exist); `packages/school/schools/parochial_school_schedule.yaml` header (why Gianluca's departure is decoupled from start).

**Pre-mortem mitigations embedded here:**
- `trigger: zone` does NOT accept `for:`. Use a `template` trigger over the zone's `persons` attribute with `for: "00:03:00"`. Example shape:
  ```yaml
  triggers:
    - trigger: template
      value_template: >-
        {{ 'person.john_koht' in (state_attr('zone.lyon_school', 'persons') or [])
           or 'person.cristina_falbo' in (state_attr('zone.lyon_school', 'persons') or []) }}
      for: "00:03:00"
  ```
  The `or []` guard matters: `persons` is `None` when the zone is empty and `in None` raises.
- Do not check person state against the zone friendly name (name coupling, see LEARNINGS "entity IDs derive from alias").
- Nino's window: 45 min before to 20 min after `sensor.primary_school_start_time_today`. Gianluca's window: 20 min before to 20 min after `sensor.gianluca_departure_time` (NOT his start time). Both sensors are unavailable on non-school days; guard with `states(...) not in ['unknown','unavailable','none','']` before `as_datetime`.
- Conditions, in order: kid school day on → latch off → inside the window.

`id` and `alias`: `nino_dropped_off` / "Nino Dropped Off" and `gianluca_dropped_off` / "Gianluca Dropped Off". `mode: single`. Action: `input_boolean.turn_on` the kid's `dropped_off`.

**Acceptance criteria:**
1. Both files exist, one automation each, id matches filename, modern syntax throughout.
2. Trigger is `trigger: template` with `for: "00:03:00"` and the `or []` guard; no `trigger: zone` anywhere in either file.
3. Nino references `zone.lyon_school` and `sensor.primary_school_start_time_today` with the -45/+20 window; Gianluca references `zone.olph_school` and `sensor.gianluca_departure_time` with the -20/+20 window.
4. Conditions ordered school-day → latch-off → window, and the window template guards against an unavailable timestamp sensor.
5. Header comment is title + at most 3 lines.
6. YAML parses and `tests/run_tests.py --syntax --modern` passes; HA schema validation deferred to post-merge `ha core check`.

---

## Task 3: At-school sensors and the Nino check-time sensor

**Files:** `packages/school/kids/nino_school.yaml`, `packages/school/kids/gianluca_school.yaml`

**Read first:** both target files in full; `packages/school/schools/primary_school_schedule.yaml` and `parochial_school_schedule.yaml` (start/dismissal sensor IDs and their availability blocks).

**Pre-mortem mitigations embedded here:**
- `binary_sensor.<kid>_at_school` gets **NO `availability:` block**. It must be a clean `on`/`off` at all times. The neighbouring timestamp *sensors* use `availability:` that is false on non-school days; do not copy that idiom onto this binary_sensor. Model it on `binary_sensor.<kid>_school_started` instead.
- Positive evidence: state is `on` only when ALL hold: `is_state('binary_sensor.<kid>_school_day','on')`, `is_state('input_boolean.<kid>_home_today','off')`, `is_state('input_boolean.<kid>_dropped_off','on')`, `dropped_off` `last_changed >= today_at('00:00')`, and `now()` is between the band's start-time and dismissal-time sensors (both guarded for unavailable, in which case the sensor reads `off`).
- Use `is_state()` and `states()` only; never `states.x.y.state` (raises on missing entity).
- `sensor.nino_dropoff_check_time` (Nino only): `device_class: timestamp`, `availability:` true only when `binary_sensor.nino_school_day` is on and `sensor.primary_school_start_time_today` is available; state = start time + 30 minutes, built from `as_datetime(...)` so it stays tz-aware. Pattern: `sensor.nino_departure_time` in the same file.

Names: "Nino At School" / `unique_id: nino_at_school` / `default_entity_id: binary_sensor.nino_at_school`, icon `mdi:school`; same for Gianluca. "Nino Dropoff Check Time" / `unique_id: nino_dropoff_check_time` / `default_entity_id: sensor.nino_dropoff_check_time`, icon `mdi:account-question`.

**Acceptance criteria:**
1. `binary_sensor.nino_at_school` and `binary_sensor.gianluca_at_school` exist in their kid files with no `availability:` key.
2. Each at-school template references exactly: the kid's school_day, home_today, dropped_off (state AND last_changed-today), and the band's start-time and dismissal-time sensors; nothing else.
3. With any of those inputs `unavailable`/`unknown`, the template evaluates to `off` (reviewer verifies by reading the template; no `raise`-capable expressions).
4. `sensor.nino_dropoff_check_time` exists, is a tz-aware timestamp = start + 30 min, and is unavailable on non-school days. No Gianluca equivalent.
5. YAML parses and `tests/run_tests.py --syntax --modern` passes; HA schema validation deferred to post-merge `ha core check`.

---

## Task 4: No-drop-off ping and its action handler (Nino only)

**Files:** `packages/school/kids/nino_dropoff_check.yaml` (new), `packages/school/kids/nino_dropoff_check_handler.yaml` (new)

**Read first:** `packages/general_notifications.yaml` (fields: `devices`, `priority`, `tag`, `actions` list shape; `devices: jk` routes to John only); `packages/security/cameras/camera_notifications/camera_notification_action_handler.yaml` (the standing-handler pattern to copy); `packages/people/nino/medication_reminder/nino_medication_reminder.yaml` lines 225-300 (how `actions:` are passed to the script; do NOT copy its inline `wait_for_trigger`); `packages/people/nonna/nonna_presence.yaml` (entity id of the Nonna sensor).

**Pre-mortem mitigations embedded here:**
- Fire-and-forget. No `wait_for_trigger` in the ping automation; a reload between send and tap must not strand the response.
- Static action IDs: `NINO_AT_SCHOOL` and `NINO_HOME_TODAY`. Not `context.id`-suffixed.
- The handler is a separate always-listening automation (`mode: parallel`, trigger `mobile_app_notification_action`, condition on the action being one of the two IDs), like the camera handler.
- Ping conditions, in order: `binary_sensor.nino_school_day` on → `input_boolean.nino_home_today` off → `input_boolean.nino_dropped_off` off. A pre-marked sick day means no push.

Ping automation: `id`/`alias` `nino_dropoff_check` / "Nino Dropoff Check", `mode: single`, trigger `trigger: time` `at: sensor.nino_dropoff_check_time`. Action: `script.general_notification` with `devices: "jk"`, `priority: time-sensitive`, `tag: nino-dropoff-check`, title "Nino drop-off", message built from Nonna's state: "Nobody dropped Nino off this morning. Nonna is home." / "... Nonna is not home." (read `binary_sensor.nonna_presence`), and `actions:` list of two entries `{action: NINO_AT_SCHOOL, title: "At school"}` and `{action: NINO_HOME_TODAY, title: "Home today"}` in whatever shape the script's `actions` field expects (check how the medication reminder passes them).

Handler: `id`/`alias` `nino_dropoff_check_handler` / "Nino Dropoff Check - Action Handler". `NINO_AT_SCHOOL` → `input_boolean.turn_on` `nino_dropped_off`; `NINO_HOME_TODAY` → `input_boolean.turn_on` `nino_home_today`.

**Acceptance criteria:**
1. Both files exist, one automation each, ids match filenames, modern syntax.
2. Ping automation contains no `wait_for_trigger` and no `context.id`; its two action IDs are the literal strings `NINO_AT_SCHOOL` and `NINO_HOME_TODAY`.
3. Ping sends via `script.general_notification` with `devices: "jk"`, `priority: time-sensitive`, `tag: nino-dropoff-check`, and the message states Nonna's home/away.
4. Ping conditions are school_day on, home_today off, dropped_off off, in that order.
5. Handler triggers on `mobile_app_notification_action`, conditions on the two IDs, and turns on the correct boolean for each.
6. No Gianluca ping or handler exists.
7. YAML parses and `tests/run_tests.py --syntax --modern` passes; HA schema validation deferred to post-merge `ha core check`.

---

## Task 5: Medication voice gate (dose 2 only)

**Files:** `packages/people/nino/medication_reminder/nino_medication_reminder.yaml`

**Read first:** the whole file; `plans/nino-two-dose-medication/pre-mortem.md` (the taken-boolean guard on the voice block is load-bearing; do not restructure it).

**Pre-mortem mitigations embedded here:**
- Gate negatively so `unknown`/`unavailable` cannot silence: `{{ not is_state('binary_sensor.nino_at_school', 'on') }}`.
- Scope to dose 2 using the existing `dose` variable, so dose 1 is never coupled to the school schedule.
- Touch only the voice-announcement `if:` block. Do not change `conditions:`, `variables:`, the timer, the push, or anything in `nino_medication_escalation.yaml`.

Add a second condition to the existing `if:` list under "Announce only if this dose is still untaken":
```yaml
          - alias: "Skip the voice cue for dose 2 while Nino is at school"
            condition: template
            value_template: "{{ not (dose | string == '2' and is_state('binary_sensor.nino_at_school', 'on')) }}"
```
Update the comment above the block by at most two lines.

**Acceptance criteria:**
1. The diff for this file touches only the voice `if:` block and its comment; `git diff --stat` shows one file and the hunk is inside the "Voice Announcement" section.
2. The new condition uses `not (...)` with `is_state(..., 'on')` and `dose | string == '2'`; it never compares against `'off'`.
3. The existing taken-boolean condition remains first in the `if:` list, unchanged.
4. Push, timer, escalation, reset, and shortcut automations are byte-identical to before.
5. YAML parses and `tests/run_tests.py --syntax --modern` passes; HA schema validation deferred to post-merge `ha core check`.

---

## Task 6: Dashboard surfaces

**Files:** `dashboards/kohbo/school/school.yaml`, `dashboards/kohbo/school/components/school_settings_popup.yaml`

**Read first:** both files in full; `dashboards/templates/button_cards/cards/shared/kohbo_chip_card.yaml` (template default `tap_action: more-info`, which instances override, e.g. `tap_action: action: none` in school.yaml); the `.claude` memory note that `page_chip_layout_wrap.yaml` is already in use on this view (no layout change needed).

On `school.yaml`, in the STATUS PILLS row, add an always-visible `kohbo_chip_card` for `input_boolean.nino_home_today`, name "Nino Home", icon `mdi:home-heart`, `tap_action: action: toggle`, `state_display` "Home" when on and "School" when off using the same `[[[ ... ]]]` style as the School Day chip, and icon color `var(--warning-color)` when on. Place it after the Override conditional chip. Do not add a Gianluca chip.

In `school_settings_popup.yaml`, inside the Primary (K-2) stack after the "Closed Tomorrow" entities row, add an `entities` card titled via the existing button-card section style "Nino Today" listing `input_boolean.nino_home_today` (Home Today), `input_boolean.nino_dropped_off` (Dropped Off), `binary_sensor.nino_at_school` (At School). Inside the Junior Kindergarten stack after its "Closed Tomorrow" row, the same three for Gianluca titled "Gianluca Today". Match the indentation and `secondary_info` conventions of the neighbouring rows.

**Acceptance criteria:**
1. `school.yaml` has exactly one new chip, bound to `input_boolean.nino_home_today`, with `tap_action: action: toggle`, always visible (not wrapped in `type: conditional`).
2. No Gianluca chip and no chip for `dropped_off` or `at_school` on `school.yaml`.
3. `school_settings_popup.yaml` shows the three Nino entities under the Primary stack and the three Gianluca entities under the Junior Kindergarten stack, six new `- entity:` rows total.
4. No other dashboard file changed; no layout include changed.
5. YAML parses (`python3 -c "import yaml..."` with the HA-aware loader from `tests/`).

---

## Task 7: Validation and live pre-merge checks

**Files:** none new. Writes results to `plans/kid-at-school-detection/working-memory.md`.

**Read first:** `plans/kid-at-school-detection/pre-mortem.md` (HIGH 5 and HIGH 6); `CLAUDE.md` section "Infrastructure Access — the homelab agent"; memory note `reference_deploy_and_host_topology.md` (production HA is the Yellow at 192.168.1.36, ssh `hassio`, NOT epicurus).

Run the full local suite: `tests/.venv/bin/python tests/run_tests.py --quick` and paste the summary line into working-memory.md. Then dispatch the `homelab` agent (read-only) to confirm on the live Yellow: (a) `zone.lyon_school` and `zone.olph_school` exist with their radii; (b) `automation.school_overrides_reset` has a `last_triggered` within the last 48 h; (c) the entity ids `notify.mobile_app_jk_2`, `binary_sensor.nonna_presence`, `sensor.primary_school_start_time_today`, `sensor.primary_school_dismissal_time_today`, `sensor.gianluca_departure_time`, `sensor.parochial_school_start_time_today`, `sensor.parochial_school_dismissal_time_today` all exist. Record each answer. Do NOT reload, restart, or deploy; John does that.

Write the post-merge runbook into working-memory.md: push to GitHub, `./deploy.sh --skip-ci` on the Yellow, then `ha core check`, then reload `input_boolean`, template entities, and automations in that order. Watch one school morning in Logbook for the latch and one Nonna-drives day for the ping.

**Acceptance criteria:**
1. `tests/run_tests.py --quick` passes (or every failure is pre-existing and listed with file:line in working-memory.md).
2. All seven live entity checks recorded with a yes/no and, for zones, the radius; any "no" halts the ship with a note.
3. `automation.school_overrides_reset` last_triggered recorded; if older than 48 h, flagged as a blocker.
4. No remote mutation performed; the runbook is written for John.

---

## Verification (holistic reviewer)

- Every new entity has at least one consumer or is explicitly listed as Gianluca's "inert by request" set (his `home_today`, `dropped_off`, `at_school`).
- Every failure path in the at-school derivation resolves to `off` → announce. Reviewer walks: sensor unavailable, zone missing, no tap, reload mid-morning, wrong calendar, latch from yesterday.
- Dose 1 flow unchanged. Push/escalation unchanged.
- Modern syntax across all new/changed files; `run_tests.py --modern` clean.
