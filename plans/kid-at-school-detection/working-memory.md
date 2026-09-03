# Working Memory — kid-at-school-detection

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*
- NOTHING_NOVEL — Task 1
- [Task 2] template-trigger-over-zone-persons: replaces the invalid `trigger: zone` + `for:` combo. `trigger: template` on `'person.x' in (state_attr('zone.y', 'persons') or [])`, with `for: "00:03:00"` doing the debounce the zone trigger can't. See `packages/school/kids/nino_dropped_off.yaml:11-15` and `packages/school/kids/gianluca_dropped_off.yaml:11-15`.
- [Task 3] none-guarded-last_changed: to read `last_changed` on an `input_boolean` without risking `UndefinedError` on a missing entity, grab the state object once (`{%- set dropped = states.input_boolean.x -%}`) then short-circuit with `dropped is not none and dropped.last_changed >= today_at('00:00')` — Jinja's `and` short-circuits left-to-right so the attribute access never runs against `none`. This is the one sanctioned exception to the repo's `is_state()`/`states()`-only rule (`states.x.y.state` still raises and must never be used). See `packages/school/kids/nino_school.yaml` and `gianluca_school.yaml`, the `*_at_school` binary_sensor state templates.
- [Task 4] fire-and-forget-actionable-push: to make a push notification's action buttons survive a reload between send and tap, don't `wait_for_trigger` inline in the sending automation — send with static (non-`context.id`-suffixed) action IDs and let a separate always-on `mode: parallel` handler automation (triggered on `event_type: mobile_app_notification_action`, gated by `trigger.event.data.action in [...]`) pick up the tap whenever it arrives. See `packages/school/kids/nino_dropoff_check.yaml` (sender) and `packages/school/kids/nino_dropoff_check_handler.yaml` (handler), modeled on the standing `packages/security/cameras/camera_notifications/camera_notification_action_handler.yaml` pattern. Contrast with `nino_medication_reminder.yaml`'s per-dose `context.id`-suffixed actions + inline `wait_for_trigger`, which is correct there because that automation actively times the dose window, but wrong for a fire-and-forget informational ping.
- NOTHING_NOVEL — Task 5

## Phantom Check Log
- [Task 1] `grep -rn "nino_home_today\|nino_dropped_off\|gianluca_home_today\|gianluca_dropped_off" packages/ dashboards/` returned nothing (exit 1) before the edit, confirming these entity IDs were not already referenced anywhere.

## Active Gotchas
- [Setup] `tests/.venv` is broken (points at a missing Xcode python). Run the suite with `/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/237d088d-be45-4b72-accc-bbb73f9fe025/scratchpad/venv/bin/python tests/run_tests.py --syntax --modern`. Baseline before any change: 7 passed, 1 skipped.
- [Plan] `trigger: zone` does not accept `for:`; use a template trigger over `state_attr('zone.x','persons') or []`.
- [Plan] `condition: state / state: "off"` is FALSE on unavailable. Gate the medication voice with `not is_state(..., 'on')`.
- [Plan] `ha core check` does not run on this machine. Local gate is `tests/.venv/bin/python tests/run_tests.py --syntax --modern`. Never `deploy.sh --check`.
- [Plan] Zones `zone.lyon_school` (122 m) and `zone.olph_school` are UI-defined; they are not in the repo and must not be added to configuration.yaml.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
- [2026-09-03] at_school polarity is POSITIVE evidence (dropped_off required); default is "announce". Supersedes the original plan draft's default-on design. — docs affected: plan.md (folded) — status: folded
- [2026-09-03] Gianluca gets helpers + latch + sensor only; no ping, no handler, no chip until a consumer exists. — docs affected: plan.md (folded) — status: folded
- [2026-09-03] Voice gate scoped to dose 2 only via the existing `dose` variable. — docs affected: plan.md (folded) — status: folded
