## Pre-Mortem: Crazy Mode

Checked against: packages/kitchen (latch + LEARNINGS), packages/office/call_lighting, packages/announcements (engine + LEARNINGS), packages/security/fire_alarm/alarm_flash_lights.yaml, packages/security/emergency, packages/house/modes, packages/network/kids_wifi.

### Risk 1: Announcement calls stretch the run clock

**Problem**: `script.announcement_engine` blocks for chime + TTS (about 2 s chime plus 3 s plus text length / 14 s). Called with `action:` from the run script, each voice line adds 5-10 s to the run, and the engine is `mode: queued` so a backlog adds more. The 7:00 end drifts and "Cool-down always runs, one minute" is no longer true. The engine also needs `sound_file` and `sound_length` (the `delay` and chime step fail when undefined), which the plan does not mention.

**Mitigation**: The run script keeps absolute deadlines (start timestamp plus 300 / 360 / 420 s) and every wait is `wait_template` with `timeout` computed from the deadline, never a fixed delay. Voice lines go out with `script.turn_on` on the engine (the `critical_announcement` pattern) so they never block the clock. Pass the stock chime (`/local/sounds/Notification-sound.mp3`, length 2) and an explicit four-speaker `media_players` list.

**Verification**: Test pins that no step in the run script is a bare `action: script.announcement_engine`, and that every phase wait derives its timeout from a stored deadline.

---

### Risk 2: "Stop jumps to Cool-down" has no mechanism in a sequential script

**Problem**: A running script cannot be told to skip ahead. If stop just sets the phase helper, the run keeps playing Crazy. If it calls `script.turn_off`, the run dies and Cool-down never plays, the exact thing the plan forbids.

**Mitigation**: Add one helper not in the plan, `input_boolean.crazy_mode_stop_requested`. The Crazy and Slow-mo waits are `wait_template` on that boolean OR the deadline. Stop only sets the boolean (and only while the phase is Crazy or Slow-mo). Cool-down waits are deadline-only, so stop during Cool-down is a no-op. The start-up cleanup and the restore script clear the boolean. `script.turn_off` on the run script is used only by the emergency guard.

**Verification**: Test that `crazy_mode_stop` contains no `script.turn_off`, that no Cool-down wait reads the stop boolean, and that the emergency guard is the only caller of `script.turn_off` on the run script.

---

### Risk 3: Restore must run exactly once and on every exit path

**Problem**: The end of the run, the emergency abort, and the start-up cleanup all need to restore lights, Sonos, AL and the kitchen latch. Three copies drift; two runs of Sonos restore against a consumed snapshot can warn or misbehave. The AL on/off state also cannot live in script variables across the abort path.

**Mitigation**: One `script.crazy_mode_restore`, `mode: single`, called by the run script at its end and by the abort automation. It is guarded on phase not Off and sets phase Off last, so a second call is a no-op and an interrupted restore can be re-run. AL on/off state is captured in the same `scene.create` as the leaf lights (the switches are snapshot entities), so the scene restore returns AL to where it was without a separate memory helper. The Sonos restore step uses `continue_on_error`.

**Verification**: Test that the restore script is the only place that sets phase Off at end, calls `scene.turn_on` for the snapshot, calls `sonos.restore`, and that it begins with the phase-not-Off condition. Test the run script and the abort automation both reach it.

---

### Risk 4: Kitchen vacancy automation ignores the latch

**Problem**: `kitchen_lights_to_off` fires on `kitchen_occupied` off (also after 2 min) and does not read `kitchen_lights_manually_toggled`; it checks `kitchen_lighting_automations`. The latch only stops motion-on and day-on. If the kids leave the kitchen long enough for occupancy to drop, the kitchen lights go off mid-run despite the latch. The reset automation also clears the latch when the kitchen empties for 30 s, so the script's latch is not durable.

**Mitigation**: Do not rely on the latch alone. The run script re-asserts the loop lights at each phase step (Slow-mo and Cool-down already step every 10 s; Crazy re-asserts every 60 s), so a stray off is repaired within a minute and is invisible in Crazy because the loop is occupied. Record `crazy_mode_kitchen_latch_set` and clear the latch at the end only if the script set it. Never write `input_boolean.kitchen_lighting_automations`. Document this as an accepted gap.

**Verification**: Test that no crazy_mode file references `kitchen_lighting_automations` or `kitchen_occupied` as a write target, and that the latch clear is conditional on the recorded flag.

---

### Risk 5: Sonos group handling when speakers are already grouped

**Problem**: `sonos.snapshot` with groups and then `media_player.join` on speakers that belong to another group (for example the office or a house-wide group) changes that other group, and the restore must put it back. `announce: true` on a joined group makes the engine do its own snapshot per speaker.

**Mitigation**: Snapshot all four with `with_group: true`, unjoin each before joining, then join under the kitchen speaker. The plan already lists the engine-over-group check as a first-run item; keep it in the hand-off. Volume is set per speaker so joined members do not follow the master.

**Verification**: Test the snapshot precedes the join, and the restore is called with `with_group: true`. First supervised run is a manual check.

---

### Risk 6: Favorite name mismatch is silent

**Problem**: `select_source` with a name not in `source_list` does nothing, and the run would play silence for a phase.

**Mitigation**: `binary_sensor.crazy_mode_allowed` adds a `names_ok` check that all three names are in the `source_list` of all four speakers; a mismatch makes the sensor off with reason "favorite missing". An unavailable speaker (source_list missing) also refuses the start. Matching is exact and case sensitive.

**Verification**: Jinja harness test: a renamed favorite makes the sensor off; a missing speaker makes it off.

---

### Risk 7: Stuck state after a restart, and helper restore

**Problem**: A restart mid-run leaves phase non-Off, the stop boolean on, and AL off in the old state. Any `initial:` on a helper re-applies every restart (JK-1262). Helpers that gate behaviour (`last_run`, windows) must keep their values.

**Mitigation**: No `initial:` anywhere in the package. The start-up automation (HA start and `automation_reloaded`, the office pattern) sets phase Off, clears the stop boolean, turns AL back on for kitchen, family room, foyer, and clears the kitchen latch if `crazy_mode_kitchen_latch_set`. It does not touch Sonos or lights.

**Verification**: Test no `initial` key in any crazy_mode YAML; test the start-up cleanup covers the four resets.

---

### Risk 8: Privacy in a public repo

**Problem**: Window times or family schedule detail could leak through defaults, docs, tests or the PR body.

**Mitigation**: Window helpers are `input_datetime` with `has_time: true` and no `initial`. Test fixtures use obviously synthetic times (03:00-04:30). Docs describe the mechanism, not who it is for or why. Grep the diff before the push.

**Verification**: Test that no crazy_mode YAML has a time literal; diff grep before push.

---

### Risk 9: Windows that cross midnight and the "same window today" rule

**Problem**: "Last run in the same window today" is ambiguous when a window ends after midnight, and `now().date()` comparisons break across it.

**Mitigation**: Windows are same-day only (documented; start must be earlier than end, same date). The sensor treats a window as the interval [start, end) on today's date; "already ran" means `last_run` falls inside the same interval today. If start >= end the window is treated as unset. An unset window is never allowed (so a fresh deploy refuses until John sets values).

**Verification**: Jinja harness tests for inside, outside, already ran, unset, start >= end.

---

### Risk 10: Dashboard and reload mechanics

**Problem**: New template binary_sensor needs a template reload; a new input_text/timer needs an input_* and timer reload (not an automation reload). The Home button uses a navigation hash; the popup is `!include`d and the YAML dashboard caches on the root file mtime.

**Mitigation**: Deploy notes state the domains (input_select, input_boolean, input_text, input_number, input_datetime, timer, template, script, automation, light group). deploy.sh already touches kohbo.yaml. A new `light: platform: group` needs a restart or a reload of groups; use the lights through the group as plan states, and call that out as a deploy step John owns. Alternative: avoid a new group by passing the leaf list explicitly from a variable.

**Verification**: Prefer the explicit leaf list in the script `variables` (no new group, no restart). Test that the list contains only existing entity ids.

---

## Summary

Total risks identified: 10
Categories: backward compatibility, test complexity, dependency ordering, scope drift, integration, documentation debt, environment/config, rollback safety
CRITICAL risks (must address before proceeding): none

HIGH, addressed by changes to the build (not plan changes): 1 (non-blocking voice lines, deadline clock), 2 (stop-request helper), 3 (single restore script), 4 (re-assert lights; latch not durable), 10 (explicit leaf list instead of a new light group).

Plan deviations these mitigations imply: two helpers beyond the plan's list (`input_boolean.crazy_mode_stop_requested`, plus the latch record the plan already asks for), a separate `script.crazy_mode_restore`, AL state captured in the scene rather than a memory helper.
