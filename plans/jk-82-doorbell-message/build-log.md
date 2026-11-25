# Build log: jk-82-doorbell-message

- 2026-11-24 Plan approved by John via the coordinator, with the plan's default wording and holiday list.
- `/plan-to-prd` was skipped on purpose for this small, single-PR change: there is no `prd.md` or `prd.json`, so `has_prd: false`. Nothing was backfilled.
- Built directly: resolver sensor, applier automation, tests, docs, LEARNINGS, memory entry.
- Reviewer (one pass, pinned `41545f9b` before rebase): APPROVED, 2 BACKLOG (real-HA render; post-deploy check).
- Deviations from the plan: no `reason` attribute on the sensor (avoids duplicating the logic); holiday table is a list of tuples.
- Decision ledger: none (no working-memory.md).
- Open for John after deploy: the live test write on `text.front_door_camera_doorbell`, then clear the old automation's registry ghost.
