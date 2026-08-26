# Working Memory — school-automation-overhaul

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Seeded context — read before any task

**Repo shape**: the repo root IS the Home Assistant config dir. There is no `homeassistant/` subdirectory. Packages live at `packages/`.

**Hard constraints, verified this session — violating any of these is a build failure, not a style nit:**

1. **Never `initial:`** on an `input_datetime` / `input_number` / `input_boolean` that a human is meant to edit. It disables state restoration (`# Don't restore if we got an initial value.`), so every dashboard edit silently reverts on the next HA restart. Real values go in header comments.
2. **`hours: /1`, never `hours: 1`.** `hours: 1` in a `time_pattern` matches hour == 1, i.e. fires once daily at 01:00. Four existing files have this bug.
3. **Every trigger-based template needs `event_template_reloaded`** alongside `homeassistant` start — HA-start does not fire on reload, so a reloaded sensor sits at `unknown` until the next tick.
4. **Filenames must be globally unique.** `!include_dir_named` keys packages by basename across the whole tree; duplicates collide silently.
5. **`.yml` is never loaded** — always `.yaml`.
6. **Modern syntax only**: `triggers:` / `conditions:` / `actions:`, `trigger:` / `action:` keys, `target:` blocks. No `platform:`, no `service:`, no root-level `entity_id:`.
7. **Timestamp sensors must be timezone-aware**: `today_at('00:00') + timedelta(seconds=state_attr('input_datetime.x','timestamp'))`. `as_datetime()` on a concatenated string yields naive, which makes `SensorEntity.state` raise under `device_class: timestamp`.
8. **Never restart HA.** Reload specific domains. John deploys himself.

**Track A is additive.** The old school system stays live so it can be shadow-run against the new one. Do not delete anything still referenced by `packages/reminders/morning_update.yaml` or by a surviving automation — those deletions are Track C.

**No `!secret` in Track A.** Calendar entity IDs go inline with a `# TODO(track-b)` marker. The keys don't exist locally or on the host yet, so `!secret` would fail `ha core check`.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*

- [seed] Trigger-based template + `calendar.get_events` + `response_variable`: existing reference at `packages/school/primary_school/primary_school_closed.yaml` (note: copy the shape, not the `hours: 1` bug or the `'District Closed'` clause).
- [seed] TTS entry point is `script.voice_announcement` (`packages/announcements/voice_announcement.yaml`); push is `script.general_notification` (`packages/general_notifications.yaml`, devices `all` | `jk` | `cfalb`). Gating for speech (`speech_notifications`, time window, bedtime) is inside the script — do not duplicate it in callers.
- [seed] Sensor-with-payload convention: `state: "{{ now().isoformat() }}"` plus attributes, to stay under the 255-char state limit. Reference: `primary_school_lunch_menu.yaml`.

## Active Gotchas
*(Add: [Task N] issue the next developer must know about)*

- [seed] `calendar.ninos_school` and `calendar.nino_school_reminder` **do not exist** on the live instance. Never reference them.
- [seed] Real calendar entities: `calendar.district_34_events`, `calendar.lyon_school`, `calendar.gianluca_school`, `calendar.olph_school` (currently empty — pointed at the wrong Blackbaud feed, fixed in Track B).
- [seed] `calendar.get_events` on a target resolving to zero entities **raises** and aborts the whole action sequence. Hence one template block per calendar plus `continue_on_error: true`.
- [seed] OLPH publishes grade-scoped closures (`Grade 2 - No School`) and multi-day all-day events (`NO SCHOOL - Thanksgiving`, 11-day `Easter Vacation`). Both break naive matching.
- [seed] `states.<domain>.<object>.state` raises `UndefinedError` on a missing entity and kills the entire template render. Use `is_state()`.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
*(Builder rulings that supersede or refine a documented rule.)*

- [2026-08-25] Bell schedules are runtime-editable `input_datetime` helpers, not YAML constants — enables dashboard and future-agent edits without a deploy. Requires the no-`initial:` rule above. — docs affected: none-yet — status: open
- [2026-08-25] Schools are named by **grade band** (`primary`/`intermediate`/`middle`), not by building. Glenbrook South is out of scope (District 225). — docs affected: none-yet — status: open
- [2026-08-25] Gianluca's entities are `parochial_school_*`; "Junior Kindergarten" is a display label only, since JK is a grade he ages out of. — docs affected: none-yet — status: open
- [2026-08-25] `secrets.yaml` is human-managed; no script may write to or delete it. `deploy.sh` no longer copies `secrets.fake.yaml` over it or deletes it — `check_config` now validates against whatever real `secrets.yaml` is already on disk. **Recommendation: retain `secrets.fake.yaml`.** It's no longer consumed automatically by `deploy.sh`, but it still has two uses: (1) a template of the required `!secret` keys for bootstrapping a fresh clone/worktree — this exact worktree has no `secrets.yaml` at all (gitignored, per-checkout), so a developer running `--check` here needs to manually `cp secrets.fake.yaml secrets.yaml` first or `check_config` will fail loud (acceptable — no longer silent); (2) a documented reference of the secrets schema independent of the untracked real file. Retiring it would remove that bootstrap path with no replacement. Not deleted in this task per instruction — this is a recommendation only. — docs affected: `deploy.sh` — status: folded
