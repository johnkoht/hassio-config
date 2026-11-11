# Office, garage, hallway stayed Off after Bedtime ended in Quiet (PR #147)

**What:** When Bedtime ends with someone still in bed, the house resolves to Quiet. JK-1118 taught 12 room `*_mode_auto` files to accept Quiet, but the office, garage and upstairs hallway were missed. They checked the house only in a `to: "Auto"` trigger, and the JK-1118 guard test only scanned conditions. So the office sat Off until someone walked in. Walking in didn't help either: `office_lights_on` fired on occupancy alongside `office_mode_auto`, saw the old mode, and skipped. It now also triggers on the office going Auto.

**Learnings:**
- A guard test that scans only conditions misses a gate that lives in a trigger. The new test scans `*_mode_auto` triggers too.
- Two automations on the same state change race, so the second one's condition sees the old mode. Trigger on the mode change as well.
- `upstairs_hallway_lights_motion_on` checks `quiet_mode` itself, so the hallway going Auto during Quiet is safe. Garage motion lights now run during Quiet (intended).

**Follow-ups:** John to rule on the bedrooms and main bathroom, which are still Auto-only and allowlisted in the test. The test's match is exact-string and filename-scoped (BACKLOG).
