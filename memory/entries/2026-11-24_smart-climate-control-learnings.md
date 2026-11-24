# smart-climate-control — 2026-11-24

**Metrics:** 6 build tasks, plus 2 deferred (the soak, and migration after it). 1 iteration (task-3 had a rounding DEFECT). Orchestrator fixes: live re-check before the setpoint write, and the extended-Away hours unit. About 260 new tests; the full suite is 2275 passed. Shipped as a PR, dry-run only.

**What shipped:**
- Each zone (2 Nests, 4 radiant Ecobees, the garage) has one decision sensor, driven by a Jinja macro in `custom_templates/climate_control.jinja`.
- Per-zone queued controller scripts write only on a diff, and never use Eco. `climate_live_control` must be `on` for any `climate.*` call.
- A mode resolver, two-stage Away, a learned wake time with a pre-wake flag, value-based override detection, and a dry-air push.

**Pre-mortem vs reality:**
- The plan's two biggest faults were found before any code: context-based override detection can't work on the Nest, and a fresh `climate_dry_run` boolean starts off, which would mean live.
- The review caught controller concurrency and the missing hvac-mode table.
- The reviewers missed the hours/minutes unit bug; the orchestrator found it while checking a README claim.

**Learnings:**
- Nest SDM writes state only from Pub/Sub, with a fresh context. Ecobee writes in the caller's context, then polls with a fresh one. Override detection has to compare values against HA's own decision.
- Make the safe state the default. A boolean with no `initial:` starts off, so name it so that off is safe (`live_control`, not `dry_run`).
- A numeric template sensor must render `none`, not `'unknown'`, or HA logs an error on every render.
- Jinja `round` is half-to-even. Round half-up, then clamp to whole-degree bounds.
- Helper units travel badly. Test the unit conversion, not only the template output: the test used a minutes-shaped value for an hours helper and passed.
- Unquoted `Off` in YAML options parses as `False`.

**Follow-ups:**
- Soak (plan task 9). Compare the logbook (`Climate dry run`, `would mark Override`, `hold ended`) with reality inside the 7-day purge.
- Migration (task 10).
- A supervised live canary first (the garage is the lowest-risk zone).
- John to confirm: main floor Sleep at 72, radiant Away 65 and Sleep 68, guest mode treated as occupied, and that the Away floor/ceiling are one-sided per season.
- `docs/climate_automation_plan.md` still exposes schedule details. Needs John's call on a history rewrite.
