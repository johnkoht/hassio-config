# Build Log — kids-ipad-blocking

- 2026-11-12T14:14Z — Phase 0: build log created, plan status in-progress. Mode: /ship lite (pre-mortem + review skipped).
- 2026-11-12 — Phase 2: PRD written. Gate check (task 1 prerequisites) dispatched to homelab.
- 2026-11-12 — Gate check (homelab, read-only): PAUSED at task-1.
  - Both policy switches available, off; both live iPad MACs match their policies.
  - Kids NOT in UniFi ssid_filter (still Kohbo + Kohbo Guests) → no live tracker for Gianluca's iPad; device_tracker.ninos_ipad enabled but not_home.
  - Fixed private address: unverifiable from the controller; John to confirm on each iPad.
- 2026-11-12 — Session wrapped while paused. Resume: `/ship lite kids-ipad-blocking` → re-run task-1 verification → worktree → build.
- 2026-11-20 — Gate re-check (homelab, read-only): STILL PAUSED at task-1(b).
  - Kids now in ssid_filter. Both iPad MACs match their policies.
  - Policy switches are `switch.unifi_network_block_nino` / `_gianluca` (no `_2`; the orphans were cleaned up). Both available, off.
  - Both live iPad trackers are integration-disabled and have MAC-derived ids. `device_tracker.ninos_ipad` is bound to a stale MAC.
  - Next: John enables both and renames them to `device_tracker.nino_ipad` / `device_tracker.gianluca_ipad`, then build.
- 2026-11-20 — Built + shipped: PR #198 (reviewer APPROVED, CI green), merged c8f0ab3f, deployed --reload. Awaiting John's live toggle test. Backlog: toggle styling vs kohbo_boolean_entity_layout (check live).
- 2026-11-20 — Toggle styling fix PR #200 (c0941da5) deployed. /wrap: memory entry + dashboards/LEARNINGS.md written; plan complete.
