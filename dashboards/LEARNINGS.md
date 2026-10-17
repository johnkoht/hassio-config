# LEARNINGS — dashboards

- **No tests cover Lovelace YAML (2026-10-15).** `tests/` only scans `packages/` and HA's config check ignores dashboards. Before deploy: resolve every `!include`, check decluttering `variables` keys against the template's `[[...]]` tokens, and check entities against a live state dump.
- **`kohbo_device_door_entity` handles groups and single sensors.** It counts open members from the group's `entity_id` attribute and falls back to the entity itself; until 2026-10-15 single sensors always read "Closed".
- **Register new pages in `kohbo/kohbo.yaml` `views:`**, or the route doesn't exist. `room_card`'s `room:` is an HA area_id (compared to `sensor.<person>_room_presence`); a room with no HA area of its own (mudroom bathroom) gets a value that never matches, rather than the parent area's id, which would show that area's people.
- **Rooms with no temperature or air sensors omit the climate card** rather than leaving `climate_overview` slots empty or graphing an unavailable sensor (mudroom bathroom, 2026-10-16).
