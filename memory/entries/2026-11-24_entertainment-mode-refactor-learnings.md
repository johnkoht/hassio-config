# entertainment-mode-refactor — 2026-11-24 (JK-1166)

**Metrics:** 9 tasks in 2 phases, ~110 new tests, full suite 2423 passed.

**What shipped:**
- Each room (kitchen, family room, playroom, foyer, office, main bedroom) has its own entertainment on/off pair; the two central automations are gone.
- Eight automations that would undo the mode (music off x4 incl. the playroom unjoin, speech on x2, TV off, house speech on) check the boolean as a first condition.
- The boolean has no `initial:`; house empty for 2 minutes or bedtime ends the mode.
- Music: zone (Indoor, Outdoor, Off), a Sonos favorites dropdown, a volume slider, start/stop scripts, popup controls.
- Crazy Mode refuses while the mode is on; the music start skips while Crazy runs.

**Worked:**
- Gating by condition, not `automation.turn_on/off`: nothing is armed, so a restart can't leave it wrong.
- Reusing Crazy Mode's pattern (zone config sensor, `select_source` by favorite name).

**Gotchas:**
- There was a fifth "music off" automation (`playroom_media_player_unjoin`) nobody had listed.
- The dining room's speaker is `sonos_living_room`.
- I guessed the family room Sonos was the TV's soundbar and dropped it from the group while the TV was on; John said they are separate devices (an Amp on in-ceiling speakers), so it always joins. Ask before encoding a guess about hardware.
- The old docs claimed a BLE auto trigger that no longer exists.

**Follow-ups:**
- Post-deploy: set the volume slider to 30 once; pick a favorite; confirm the template select lists favorites.
- Backlog: `playroom_deactivate_party_time` turns its boolean on instead of off.
