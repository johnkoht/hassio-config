# Overnight hotfixes, 2026-10-29

Small bugs found by the 10-28 investigations and the dead-entity audit, each through /hotfix and /wrap.

- **critical_announcement auto skipped the main bedroom.** The auto branch read the nonexistent `input_boolean.main_bedroom`, so the leak voice alert (`media_players: auto`) never played there. Now `main_bedroom_occupied`.

**Learning:** `tests/test_entity_references.py` would catch this whole class, but it skips without a registry snapshot. That's the cheapest route to a dead-entity CI check.
