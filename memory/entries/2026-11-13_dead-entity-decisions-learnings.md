# Dead Entity Decisions (JK-1232) — ship learnings

Date: 2026-11-13. Plan: `plans/dead-entity-decisions/`. PRs #158 (A cameras), #161 (B dead refs + heaters + select guard), #162 (C work calendar + Tempest deletes). Approved by John 2026-11-13 (relayed); merge/deploy left to the release agent.

## Metrics
- 5 tasks across 3 PRs, all developer tasks first-attempt. Reviews: A APPROVED first pass; B and C one ITERATE each (both stale docs: a dead sensor row in `docs/climate_automation_plan.md`, deleted popup rows still listed in `dashboards/kohbo/climate/README.md`), APPROVED on re-review.
- Tests: baseline 1410 → A +20, B +25 (net, some pinned rows removed), C net 0 (6 new replace removed deep-link cases). Every fix has a sabotage check that went red.

## Pre-mortem
- R1 (cross-PR conflicts) materialized at planning: the plan's split put item 12 in B and items 9/9a in C, both editing adjacent `CASES` rows. Moved 9/9a to B. A second instance surfaced late: all three PRs appended to the same `working-memory.md` section; resolved by reverting those edits on A/B and consolidating on C.
- R2 (employer domain) held: zero added-line hits; the absence test builds its literal by concatenation so it can't match itself.
- R3 (dangling refs after deletes) partly materialized: ID/filename greps passed but display names in READMEs/docs didn't. Reviewer caught both.

## What worked / what didn't
- + Plan review found 6 MUSTs the plan missed (pinning manifest tests for deleted automations, LEARNINGS lines that become false, guard scope incl. dashboards).
- + Separate per-PR test files kept the PRs independent.
- − Absence tests keyed on entity IDs miss human-facing names (README rows, doc tables). Grep display names and aliases too when deleting.
- − Multi-PR ships from one plan: shared bookkeeping files (working-memory, build-log, prd.json) conflict; keep them on one branch from the start.

## Recommendations
- Start: when deleting an automation, grep its alias/display name as well as id and entity_id, in `dashboards/**/README.md` and `docs/`.
- Start: for a multi-PR plan, name one "bookkeeping" PR up front; others don't touch `plans/` after the artifact commit.
- Continue: sabotage per fix; new guard tests with empty allowlists.

## Follow-ups (not memory, tracked elsewhere)
- Held for John: HA restart for PR A proxies; Nino Aqara sensor re-pair; calendar UI rename at C's deploy.
- Backlog from reviews: `.DISABLED` Katia tracker file holds an IP-style value; focus-mode unknown-fallback render test; Cristina's stale UniFi observation (plan item 4).
