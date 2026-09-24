# Memory Index

One line per entry. Detail lives in the linked file, never inline here.

- 2026-09-03 · [kid-at-school-detection](entries/2026-09-03_kid-at-school-detection-learnings.md) — positive-evidence at-school sensor gating Nino's dose-2 voice cue; pre-mortem + review both caught the default-on polarity flaw before code
- 2026-09-01 · [inovelli-lighting-sync](entries/2026-09-01_inovelli-lighting-sync-learnings.md) — ported the Office Smart Bulb Mode fix to Gianluca's bedroom; room-scoped entity audits missed 4 of 5 broken refs living in house-level files
- 2026-09-10 · [doorbell-event-entity-migration](entries/2026-09-10_doorbell-event-entity-migration.md) — Protect moved the doorbell ring to an event entity; enabled-and-not-unavailable is not evidence an entity works, only last_changed is
- 2026-09-13 · [vacuum-skip-tonight](entries/2026-09-13_vacuum-skip-tonight.md) — one-tap skip for the nightly vacuum, deferred to the next empty-house clean; the defer had to copy booleans because each vacuum schedule reads its own room-selection group
- 2026-09-23 · [stale-automation-errors](entries/2026-09-23_stale-automation-errors.md) — deleted forecast-attribute weather automation + legacy NWS event-id automation (its earlier action still corrupted shared history); fixed Cristina's unprefixed battery entity
- 2026-09-23 · [radio-network-offline-alerts](entries/2026-09-23_radio-network-offline-alerts-learnings.md) — Zigbee/Z-Wave/UPS offline pushes; ZHA has no coordinator entity so the trigger reads the config entry state (light groups are NOT a controller signal); NUT apc_ups_status is "Online" not "OL" — battery alerts fixed by hotfix (raw status_data codes, last_triggered gating)
