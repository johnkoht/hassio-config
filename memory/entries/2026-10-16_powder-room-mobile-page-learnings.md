# 2026-10-16 · powder-room-mobile-page (JK-1223)

**Metrics:** PR #43, 9 commits. Plan review + code review both APPROVED, no DEFECTs. Two regression tests, each sabotage-checked by the engineer and again by the reviewer.

**+ Worked:** a live entity dump first showed `input_boolean.powder_room_occupied` stuck `on` since the door sensor died, which turned a page build into an occupancy fix: clear occupancy when the light goes off, and turn the light off when the room empties. Reverting each fix in scratch and watching its test go red proved the tests bite.
**− Didn't:** the plan's "keep the lighting-automations check" assumed a condition that is really a trigger; adding one would also have gated the Off-mode path, so it was left as is.

**Gotchas:**
- A room with no motion sensor needs a fallback occupancy signal (here the light) for when its only sensor (the door) is offline, or it latches occupied.
- Rooms without climate sensors omit the climate card instead of graphing an unavailable entity.
- The kohbo mtime cache applies here too; `deploy.sh` touches `kohbo.yaml` since #45.
