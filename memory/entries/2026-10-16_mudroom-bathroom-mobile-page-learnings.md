# 2026-10-16 · mudroom-bathroom-mobile-page (JK-1222)

**Metrics:** PR #42, 7 commits. Plan review + code review both APPROVED, no DEFECTs, 0 rework iterations.

**+ Worked:** cloning the main bathroom page (#37) and reusing its YAML-walking dashboard validator; it flagged only the expected unavailable door sensor. Adding `sensor.mudroom_bathroom_room` to `group.room_sensors` is what puts a room on Home → Occupied Rooms. A live check that the new entity ID didn't already exist ran before writing it.
**− Didn't:** the plan expected a shared small-bathroom decluttering template; the two pages differ in shape (brightness feature, toggle count, Sensors section) and decluttering-card can't drop list items, so it was deferred until a third page.

**Gotchas:**
- `room_card`'s `room:` is an HA area_id. A room without its own area gets a value that never matches, not the parent area's (which would show that area's people).
- Removing `initial_state` from automations doesn't re-enable a disabled one; HA restores the last runtime state.
- kohbo is `mode: yaml` and caches on the root file's mtime, so a page added only through includes stays invisible until `kohbo.yaml` is touched (first hit on #44). `deploy.sh` does it since #45.
