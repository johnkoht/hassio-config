# Kids WiFi schedule (packages/network/kids_wifi)

**What:** `switch.kids_enabled` (UniFi WLAN) now goes off at night and on in the morning. Weekday times apply when either kid has school, using two package-local sensors that wrap the grade-band school sensors: `binary_sensor.kids_school_tomorrow` for the off and `kids_school_today` for the on. Weekend times apply otherwise. A catch-up turns the network back on after a restart or template reload inside the on window. The controls are a `#kids_wifi` popup opened from a Home tile. 6 tasks, each on its first attempt, with no ITERATEs.

**Learnings:**
- The first pass was built straight to code in a hand-made worktree, with no plan. John called it out. The real flow (plan, pre-mortem, independent review) changed the design:
  - school sensors replaced day-of-week rules
  - a midnight guard was added for unset time helpers
  - a restart catch-up was added for a skipped "on"
  - the popup got its own hash
- An unset time `input_datetime` fires its time trigger at midnight. Guard each trigger by mapping `trigger.id` to its helper and checking `timestamp | int(0) > 0`. Don't rely on `trigger.entity_id`.
- No repo test exercises automation logic. A flipped gate stayed green in the sabotage check. A Jinja harness that loads the template straight from the YAML did catch helper swaps.
- UniFi 11's site-id change recreated the WLAN switches as `switch.<ssid>_enabled`. The old ids are `_2` orphans.

**Follow-ups (BACKLOG):**
- The startup catch-up can choose weekend times if the school sensors aren't ready at start.
- The harness has no exact-boundary cases.
- `packages/CLAUDE.md` listing doesn't mention `network/`.
- Camp isn't a school signal yet. It would be one more `or` in `kids_wifi_school_sensors.yaml`.
