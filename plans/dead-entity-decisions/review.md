# Review: Dead Entity Decisions

Date: 2026-11-13. Reviewer: independent agent (sonnet), full path, read-only against HEAD f1701b87.

**Verdict: APPROVE WITH SUGGESTIONS.** No structural blockers. The plan still matches HEAD; only #151 (Katia detect gate, untouched lines) and #154 landed in the target area since e6cd8454. The pre-mortem R1 re-split (items 9 and 9a move to PR B) is sound.

## MUST (folded into prd.md)

1. Deleting `family_room_lights_to_on` / `family_room_mode_on` breaks pinning tests the plan didn't name: `test_room_migration_regressions.py` MANIFEST rows, `test_disabled_family_room_automations_point_at_defined_options`, its docstring; `test_room_lighting_override_regressions.py` `test_family_room_disabled_automations_stay_disabled` and a comment. `packages/family_room/LEARNINGS.md` describes both files.
2. `packages/mudroom/LEARNINGS.md` says the mudroom `Auto` branch is dead and kept verbatim; false after Auto→Motion.
3. The select-option guard must walk `condition: state` / `trigger: state` / legacy `platform: state` with `to`/`from`/`not_to`/`not_from`/`state` and list values; scan `dashboards/**` too. Keep the sabotage check.
4. `cameras_available.yaml` repeats the list three times; the test must cover all copies and render with `jinja2` + stubbed `states()`; one `unavailable` → off, count 1.
5. The employer-domain absence test must scan all tracked text, with a pattern that doesn't match the personal `calendar.john_koht`.
6. Don't delete the station data rows in `docs/climate_automation_plan.md`; correct `tempest_uv` → `tempest_uv_index` and fix the rain row. Scope the grep to alert file names and automation IDs.

## SHOULD (applied)

- Separate new test files per PR; only B edits `test_dead_entity_regressions.py`.
- Item 9a: current bare `| float` raises on `unavailable`, so the on-path already can't fire; the guard is log cleanup plus defence against a later `float(0)`.
- Item 12: use trigger ids for the `or`; keep ids/aliases.
- Item 8: `garbage_day_is_today_reminder` becomes reachable again too; guard `strptime(None)`.
- Item 6: deploy and rename back-to-back; `calendar.get_events` on a missing entity aborts the daily report.
- Item 2: porch detections point at a proxy that exists only after a restart; old target was dead, so no regression.
- `docs/PRESENCE.md` doesn't name the backup ping; no doc edit expected.
- Plan's "rebase after #151" note is obsolete (#151 merged 11-12).
