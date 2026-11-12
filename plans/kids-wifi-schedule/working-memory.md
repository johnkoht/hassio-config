# Working Memory — kids-wifi-schedule

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [plan] Template binary sensor pattern: name/unique_id/default_entity_id at packages/school/kids/nino_school.yaml:30-36
- [plan] Popup pattern: dashboards/kohbo/security/garage_entry_lock_popup.yaml (conditional times block ~lines 74-88)
- [plan] Home tile pattern: Main Floor Vacuum tile, dashboards/kohbo/home/home.yaml ~418-427; popup includes at the bottom (~568)

## Active Gotchas
- [plan] Unset time input_datetime reads 00:00 / timestamp 0; a time trigger on it fires at midnight. Guard via trigger.id -> helper map.
- [plan] condition: state "off" is false on unavailable; use is_state(...,'on') / not is_state(...,'on').
- [plan] The garage-lock popup helper HAS initial:. Do not copy that.
- [task-4] The restart catch-up reads binary_sensor.kids_school_today/tomorrow at HA start. They are state-based template sensors chained on other state-based sensors, so they render at setup and re-render on input change; a stale read falls back to weekend times (is_state on unknown is false). Accepted, no delay.
- [plan] Prototype from before the plan (day-of-week rules) is in the session scratchpad only. Don't resurrect its gating.

- [task-1] NOTHING_NOVEL — task-1
- [task-2] NOTHING_NOVEL — task-2
- [task-3] NOTHING_NOVEL — task-3
- [task-4] Startup-ordering finding recorded under Active Gotchas

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-11] School-night = either kid has school tomorrow (school sensors), not day-of-week; camp skipped — docs affected: docs/AUTOMATIONS.md — status: open
