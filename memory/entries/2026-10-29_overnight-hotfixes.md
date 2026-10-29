# Overnight hotfixes, 2026-10-29

Small bugs found by the 10-28 investigations and the dead-entity audit, each through /hotfix and /wrap.

- **critical_announcement auto skipped the main bedroom.** The auto branch read the nonexistent `input_boolean.main_bedroom`, so the leak voice alert (`media_players: auto`) never played there. Now `main_bedroom_occupied`.
- **Front door left-open alert and porch camera detections watched nonexistent entities.** `doors_left_open` used `front_door_status` (live: `front_door`), so only the garage door could alert; porch person/animal triggers used `backyard_porch_camera_*_detected` (live: `backyard_porch_*_detected`), so they never notified. Porch alerts now arrive. Backlog: porch `proxy_camera` source is wrong; `timer.finished` re-alert lacks `trigger.from_state`.

**Learning:** `tests/test_entity_references.py` would catch this whole class, but it skips without a registry snapshot. That's the cheapest route to a dead-entity CI check.
