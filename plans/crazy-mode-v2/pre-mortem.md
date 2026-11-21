## Pre-Mortem: Crazy Mode v2

Checked against: every file in packages/house/crazy_mode/, dashboards/kohbo/home/crazy_mode_popup.yaml, home.yaml, _vacuum_active_notification.yaml, shared/main_floor_vacuum_popup.yaml, the `horizontal_action_card_fixed` and `kohbo_horizontal_action_card_entity` templates, packages/announcements/announcement_engine.yaml, tests/test_crazy_mode.py, and the HA core timer entity source (`homeassistant/components/timer/entity.py`, dev branch).

Timer facts used below, from that source:
- `timer.start` truncates the start time to the whole second and sets `_end = start + _remaining`.
- With a `duration`, `timer.start` resets `_remaining` and `_running_duration`. Without one, it resumes from `_remaining`. If `_remaining` is falsy (None or 0), it falls back to the full running duration.
- `timer.pause` sets `_remaining = _end - now`, truncated to the second, and clears `_end`.
- Cancel, finish and natural expiry all clear `_end` and `_remaining` and reset the running duration to the configured duration.
- The attributes are: `duration` always; `finishes_at` only while `_end` is set (active); `remaining` whenever `_remaining` is set. So `remaining` is also present while active, but it holds the value from the last start or resume. It never counts down.

---

### Risk 1 (CRITICAL): "Keep the existing tests green" can't be done with this design

**Likelihood**: Certain. **Impact**: High. The plan's only stated mitigation for the restructure can't be met. A builder will either weaken guards to get green or stall.

**Problem**: The plan relies on the existing tests to protect Cool-down and the stop and abort rules, but these tests pin the v1 design the plan removes:
- `test_only_the_emergency_abort_turns_off_the_run` asserts that the abort is the only file with `script.turn_off` on the run. Restart and the paused timeout both need it.
- `test_every_wait_runs_to_a_deadline`, `test_clock_shape_is_pinned`, `test_no_fixed_delays_that_carry_the_clock` and `test_two_prompts_at_start_and_half_of_cooldown` pin `t0`/`s0`/`c0` deadlines, `repeat.index` ticks and `count: 5`/`count: 6`.
- `test_slowmo_dim_levels_end_near_half` and `test_music_fades_in_steps` render brightness from `repeat.index`.
- `test_speaker_lists_agree`, `test_snapshot_uses_leaf_lights_and_al_switches` and `test_handoff_is_non_blocking_and_passes_lists` (`== {"speakers","loop_lights"}`) pin the lists in script variables.
- `test_cleanup_covers_the_four_resets_and_leaves_sonos_alone` pins the AL switch ids in the cleanup.
- `test_no_times_in_yaml` allows only `00:05:00`/`00:01:00`.

The new test the plan asks for ("the run reads timer progress, never `now()`") also can't pass. Progress from `finishes_at` needs `now()`.

**Mitigation**: Before the build, change the plan to list each of these tests and the invariant its rewrite must keep:
- **Turn-off allow-list:** `script.turn_off` on the run is allowed in exactly three files: the abort, restart and the paused timeout. Stop and skip never call it.
- **Cool-down:** no Cool-down step reads `crazy_mode_stop_requested`.
- **Clock:** every wait is bounded by a tick timeout (5 s or less), and no wait derives its timeout from a stored start time.
- **Progress:** progress derives from the timer's `finishes_at` / `remaining` / `duration`. `now()` may appear only next to `finishes_at`.
- **Lists:** they come from `sensor.crazy_mode_zone_config`, and the expected main-floor values move into the zone-config test unchanged.

Rewrite each guard in the same commit as the code it covers. Run the repo's sabotage pattern (`CRAZY_MODE_DIR` on a scratch copy) on the Cool-down, stop and turn-off guards to prove they still go red.

**Verification**: The reviewer gets the list and checks that each rewritten test fails against a sabotaged copy.

---

### Risk 2: Resume at a phase boundary skips a whole phase, Cool-down included

**Likelihood**: Medium. A pause tapped in the second or two between phases, or during a phase's start-up steps. **Impact**: High. Cool-down can vanish, which breaks the one rule the feature is built on.

**Problem**: The phase timer is configured with no duration (0). Suppose the run is between phases: the old timer is idle and the next `timer.start duration:` hasn't run yet. The pause script's `timer.pause` on an idle timer does nothing. On Resume, `timer.start` without a duration starts a zero-length timer, and the tick loop sees it finish at once. If the run has already started the next phase, the paused flag is on while the timer is active, so the clock runs during a "pause". Also, pausing in the timer's last second gives `_remaining = 0`, and Resume then replays the full phase.

**Mitigation**:
- Resume calls `timer.start` (no duration) only when `is_state('timer.crazy_mode_phase', 'paused')`. Otherwise it only clears the flag.
- At each phase start, the run waits for the paused flag to clear, then calls `timer.start` with an explicit duration. The run, not the pause script, owns every `timer.start` that carries a duration.
- Each tick, the loop compares the flag with the timer. If the flag is on and the timer is active, it pauses the timer. If the flag is off and the timer is paused, it resumes it.
- Give the timer helper a non-zero `duration` (for example `00:01:00`, and add it to the allowed times) so a stray bare start can never be zero length.

**Verification**: A test checks that the pause script's `timer.start` sits behind a `paused` state condition and has no `duration`. A test checks that every run-script `timer.start` has a `duration`. Hand-off: pause during the "SLOW MOTION MODE!" line.

---

### Risk 3: The timer's more-info dialog becomes a skip button

**Likelihood**: High. Kids tap things. **Impact**: High.

**Problem**: In v1 the timer was display only. Now it is the clock. The popup shows `timer.crazy_mode_phase` as an entities row, and tapping it opens more-info with Start, Pause, Cancel and Finish. Finish or Cancel during Cool-down makes the timer idle, the loop reads that as "phase done", and Cool-down is skipped. Pause from more-info bypasses `crazy_mode_paused`, so media keeps playing and the 10-minute timeout never arms.

**Mitigation**:
- Show time left only through a `button-card` with `tap_action`, `hold_action` and `double_tap_action` all `none`. No `entities` row and no tile for the timer.
- In the loop, count "phase done" only when the timer is idle and the run's own record of elapsed active time is at least the phase length minus one tick. Keep a running sum of unpaused tick seconds in an outer-scope variable (the `variables` action updates the outer scope on HA 2025.4+). An early idle restarts the timer with the remaining seconds.

**Verification**: A test checks that the popup and banner have no `entity: timer.crazy_mode_phase` without `tap_action: none`. A test checks that the Cool-down exit condition uses the elapsed floor.

---

### Risk 4: A basement run restores a stale main-floor snapshot

**Likelihood**: High on the first basement run after any main-floor run. **Impact**: High. Main-floor lights jump to how they were hours ago, and Adaptive Lighting flips.

**Problem**: `scene.create` with an empty `snapshot_entities` logs "Empty scenes are not allowed" and returns without replacing the scene. `scene.crazy_mode_snapshot` from the last main-floor run is still in memory, and the restore's `scene.turn_on` applies it.

**Mitigation**:
- Gate `scene.create` and `scene.turn_on` on `(lights + al_switches) | length > 0` for the active zone.
- Use a per-zone scene id (`crazy_mode_snapshot_<zone>`) so zones can never apply each other's snapshot.
- Gate every `light.turn_on`, the AL `switch.turn_off`/`turn_on` and the emergency bright step with an `if` on a non-empty list. Don't rely on HA treating `entity_id: []` as a no-op; that has changed between versions.

**Verification**: A Jinja/structure test runs a zone with empty lists and checks that every light, scene and AL call sits under a length guard. A test checks that the scene id includes the zone.

---

### Risk 5: The allowed sensor still checks the four main-floor speakers

**Likelihood**: Certain. It's missing from the task list. **Impact**: Medium.

**Problem**: `sensor.crazy_mode_reason` hard-codes the four main-floor speakers for `favorite_missing`. If the basement Amp is offline, a basement start is allowed and the run plays silence. If a main-floor speaker is offline, the basement is refused. The refusal line is hard-coded to `media_player.sonos_kitchen`, so a basement refusal is spoken upstairs. The restore's emergency bright list (`light.kitchen_lights`, etc.) and the run's `kitchen` coordinator variable are also hard-coded, and the plan's "no hard-coded lists" test would flag all of them.

**Mitigation**:
- The reason sensor reads the picked zone's `speakers` from the config.
- The refusal speaks on the picked zone's coordinator.
- The run's `kitchen` variable becomes `coordinator`.
- Add `emergency_lights` as a zone key: the groups for the main floor, empty for the basement.
- Update the harness's `SPEAKERS`/`sources` fixtures per zone.

**Verification**: Harness tests: basement picked and basement source_list missing gives `favorite_missing`; basement picked and a main-floor speaker missing gives `ok`.

---

### Risk 6: The zone config isn't there when the startup cleanup runs

**Likelihood**: High after any mid-run restart. **Impact**: Medium. Adaptive Lighting stays off on the main floor until someone notices.

**Problem**: Template entities render their templates at `homeassistant_start`, and the cleanup also triggers on `start`. `state_attr('sensor.crazy_mode_zone_config', ...)` can still be `None` when the cleanup reads it, so the AL switch list comes back empty and nothing turns back on. A manual template reload mid-run also briefly removes the sensor under the restore or the abort.

**Mitigation**:
- The cleanup starts with `wait_template: "{{ state_attr('sensor.crazy_mode_zone_config', 'zones') is not none }}"` (timeout 60 s, `continue_on_timeout: false`, and log on timeout).
- The run carries the active zone's lists as variables and passes them to the restore. Only the abort and the cleanup read the sensor.
- Put the whole config in one `zones` attribute rendered as a Python literal (`{{ {'main_floor': {...}, 'basement': {...}} }}`), so HA's result parser gives native lists and dicts. Never use a string that looks like a list.

**Verification**: A test checks the cleanup's first step is that wait. Another parses the `zones` template with `ast.literal_eval` after rendering and checks that every zone has every key (`speakers`, `coordinator`, `lights`, `al_switches`, `emergency_lights`, `kitchen_latch`) with the right type.

---

### Risk 7: The active-zone copy and the picker disagree

**Likelihood**: Medium. **Impact**: High. A restore against a missing key restores nothing.

**Problem**: The select options are display names ("Main floor") and the config keys will be slugs. If `input_text.crazy_mode_active_zone` stores the label and the config keys on a slug, or someone later renames an option, every lookup returns nothing. The optional "Crazy Mode Basement" script also changes the picker even when the start refuses, and that silently changes the zone the plain "Crazy Mode" phrase uses next.

**Mitigation**:
- Store the config key (slug) in `active_zone`, worked out from the option through one mapping in the config sensor.
- Restore and the abort fail loudly (`stop` with an error, plus a persistent notification) when the key isn't found. They never quietly do nothing.
- The basement script passes `zone: basement` as a script variable (not a field, so `test_start_has_no_fields` still holds) to `script.turn_on` on the start. The start reads `zone | default(<picker>)`. The picker is never written by a script.

**Verification**: A test checks the select options and the config keys map one to one. A test checks no script writes `input_select.crazy_mode_zone`.

---

### Risk 8: Restart races the restore and the emergency abort

**Likelihood**: Medium. **Impact**: High. A new run starts with no snapshot, or during an emergency.

**Problem**:
- The abort cancels only `crazy_mode_run` and `crazy_mode_start`. If an emergency fires while `crazy_mode_restart` is between "cancel run" and "start run", the abort restores and sets phase Off. Restart then sets phase Crazy and starts a run in an emergency, against a used snapshot.
- Restart during the closing line or the restore (both inside the run script) cancels the restore halfway, then starts Crazy with the house half put back.
- If the start script is still setting up, restart's new run and the start's hand-off collide (`mode: single`, and the second is dropped).

**Mitigation**:
- The abort's `script.turn_off` list adds `script.crazy_mode_restart` and `script.crazy_mode_pause`.
- Right before it hands off, restart re-checks `binary_sensor.emergency_active` is off and phase isn't Off.
- Restart is refused while `script.crazy_mode_restore` or `script.crazy_mode_start` is on, and during the closing line. Set a `crazy_mode_finishing` marker, or check the Cool-down timer is idle.
- After `script.turn_off`, restart waits for `is_state('script.crazy_mode_run', 'off')` (timeout 5 s) before `script.turn_on`.

**Verification**: Tests on the abort's turn-off list and on restart's guards (emergency, restore off, start off).

---

### Risk 9: Restart and pause defeat the once-per-window rule

**Likelihood**: High. The Restart chip is on the home page banner, where the kids are. **Impact**: Medium. The parent gate that v1 was built around goes away.

**Problem**: Restart doesn't write `last_run` and can be pressed any number of times from any phase, so a single window can run Crazy indefinitely. Pause/resume cycles under 10 minutes also stretch a run without limit.

**Mitigation**: Add `input_number.crazy_mode_restarts` (no `initial:`). The start sets it to 0, restart increments it, and restart is refused at the cap (1 or 2, John's call). Hide the Restart chip once the cap is reached. Raise this with John as a plan decision before the build, not in review.

**Verification**: A test checks restart's guard and increment, and that the start resets the counter.

---

### Risk 10: The progress tick loop misfires one-shot effects

**Likelihood**: High if it's built naively. **Impact**: Medium. The "one more minute" line plays twice or never, and a heavy-work prompt repeats.

**Problem**: A threshold check like `progress >= x` is true on every tick after it's crossed. Script variables set inside a `repeat` don't carry over to the next iteration unless the `variables` action updates an outer-scope variable (HA 2025.4+). A "crossed in this tick" window can be missed when a tick runs long.

A `wait_template` that compares progress against `now()` is also rate-limited to re-render once a minute. The timer's attributes don't change while it's active, so nothing else triggers a re-render, and a progress-based wait can fire up to 60 s late.

**Mitigation**:
- Each one-shot effect has an outer-scope `done_*` variable declared before the loop and set with the `variables` action. Alternatively, use a bitmask input_number cleared at each phase start.
- Ticks are `wait_template` on the stop flag, the paused flag or timer idle, with `timeout: 5`. Progress is computed in a `variables` step after each wait, never inside a wait template.
- Heavy-work prompts fire at `progress >= 0` and `>= 0.5`. "One more minute" fires at `remaining_s <= 60`, computed as `duration - elapsed`.

**Verification**: A harness test renders the effect conditions across a sequence of synthetic ticks, including a long tick and a pause gap, and checks each line fires exactly once.

---

### Risk 11: Stop while paused leaves Cool-down frozen and then cancelled

**Likelihood**: Medium. **Impact**: High. No Cool-down, and the music stays paused.

**Problem**: The plan says "Stop still works" while paused. The stop flag lets the Crazy loop go to Cool-down, but `crazy_mode_paused` is still on. Cool-down's tick loop then skips its re-asserts and fades, and if it honours pause, it never advances. Ten minutes later the paused timeout cancels the run, so the run ends without Cool-down. The Goal's "Every run still ends in Cool-down" is also contradicted by the paused timeout itself.

**Mitigation**:
- Entering Cool-down always clears `crazy_mode_paused` (which also resets the timeout's `for:`) and starts its timer with an explicit duration. `select_source` restarts playback.
- Change the Goal wording: a run ends in Cool-down unless it's aborted (emergency) or abandoned (paused 10 minutes).
- The paused timeout's condition requires phase not Off and `script.crazy_mode_run` on.

**Verification**: A test checks the Cool-down entry step clears the paused flag before the phase timer starts.

---

### Risk 12: Pause during a phase start; music plays while "paused"

**Likelihood**: Medium. **Impact**: Low to medium.

**Problem**: Pause goes out while the run is between `select_source` and the 3 s shuffle delay, or while Slow-mo's parallel branch is starting its favorite. `media_pause` lands first, then `select_source` starts playback. The loop then won't re-pause, because it only skips work while paused.

**Mitigation**:
- Each phase's start-up block (select_source, shuffle, the first volume set) runs only after waiting for `crazy_mode_paused` to clear.
- Each tick, the loop calls `media_pause` again (if the coordinator is `playing`) while the flag is on.
- The pause script is gated on phase in Crazy, Slow-mo or Cool-down and on `script.crazy_mode_run` being on. The start clears `crazy_mode_paused` as well as the restore and the cleanup, so a pause pressed during the restore doesn't carry into the next run.

**Verification**: A test checks the start, restore and cleanup all clear `crazy_mode_paused`, and that the pause script has the run-on and phase guards.

---

### Risk 13: Sonos pause and play on a Spotify favorite

**Likelihood**: Medium. **Impact**: Medium.

**Problem**:
- Some Spotify favorites behave as Sonos "stations" (artist or song radio), and stations can't pause. Sonos returns UPnP 701 and HA raises, which stops the pause script unless `continue_on_error` is set, so the timer pauses but the music doesn't.
- `media_play` after a long pause can fail if the Spotify session timed out.
- If the coordinator was grouped differently (someone regrouped by hand mid-run), pause on the coordinator pauses the wrong set of speakers.
- An `announce: true` clip ("Here we go!") on a paused player plays and leaves it paused. If it plays before `media_play`, the kids hear "Here we go!" over silence.

**Mitigation**:
- `continue_on_error: true` on `media_pause`, `media_play` and `media_next_track`.
- On resume, call `media_play` first and voice the line after. Then wait up to 5 s for the coordinator to be `playing`. If it isn't, re-select the phase's favorite (shuffle again in Crazy).
- On pause, if the coordinator isn't `paused` after 3 s, `volume_set` the zone to 0 and keep the current volume in a variable for resume.
- Tell John that favorites should be playlists, not radio.

**Verification**: Hand-off step 11 includes pause and resume on each favorite type.

---

### Risk 14: The basement Amp's grouping and TV input

**Likelihood**: Medium. **Impact**: Medium.

**Problem**: "Group only when the zone has more than one speaker" can be read as "skip the unjoin too". If the Amp is a member of another group (a house-wide party group), `select_source`, `media_pause` and `media_next_track` on it act on the other group or fail. With Sonos TV autoplay on, the basement TV's audio can take back the Amp mid-run. The engine's `media_players` selector doesn't list `sonos_basement`. That's UI-only and not enforced, but anyone reading the selector gets the wrong picture.

**Mitigation**:
- Always unjoin every zone speaker, even a single one. Only the join is conditional.
- `sonos.snapshot` and `sonos.restore` with `with_group: true` as now.
- The tick loop checks the coordinator's `source` each tick in Crazy. If it's TV, it re-selects the favorite, at most once per phase.
- Add `media_player.sonos_basement` to the engine's selector `include_entities` (a docs-level change, so check with John that it's in scope; it's outside the package).

**Verification**: A test checks the unjoin isn't under the length > 1 guard.

---

### Risk 15: Queued voice lines play across restart and pause

**Likelihood**: High. **Impact**: Low.

**Problem**: The lines go out through `script.turn_on` on a `queued` engine (`max: 25`), and that queue can't be cancelled without killing doorbell and critical calls. After a restart, an old "SLOW MOTION MODE!" or a heavy-work prompt can play over the new Crazy. During a pause, a queued line still plays.

**Mitigation**: Accept, as the plan does, but don't add to it. Restart and Resume each send at most one line. Note the behaviour in the README Known gaps. Never `script.turn_off` the announcement engine.

**Verification**: A test checks that no crazy_mode file turns off `script.announcement_engine`.

---

### Risk 16: The banner overlaps the vacuum banner and the time left doesn't tick

**Likelihood**: High. **Impact**: Medium. The banner is unreadable or wrong.

**Problem**:
- `horizontal_action_card_fixed` is `position: fixed; bottom: 89px`. The vacuum banner shows whenever the vacuum is `cleaning`, `paused` or `idle`, so the two banners stack on top of each other.
- The default `kohbo_horizontal_action_card_entity` `state_display` shows "state - time since last_changed". That's time since the phase started, not time left, and it hides button-card's own timer countdown if the timer is the entity.
- A JS countdown in `[[[ ]]]` doesn't re-render each second.
- Showing Stop in Cool-down offers a button that does nothing.

**Mitigation**:
- Pass a new button-card template through the decluttering `template` variable, with `entity: timer.crazy_mode_phase`, no `state_display` (so button-card's native timer countdown runs, and freezes while paused), and the phase and Paused state in `name` with `triggers_update` on the phase select and the paused boolean.
- Offset the Crazy banner (or hide the vacuum banner while phase isn't Off). Check it against the live DOM before merge, per the dashboard CSS memory.
- Show the Stop chip only in Crazy or Slow-mo, and the Restart chip only below the cap and outside the finishing window.
- Quote `"Off"` in every condition (YAML 1.1 reads a bare `Off` as false). Use only `state`/`state_not` conditions; conditional cards reject `condition: template`.

**Verification**: Extend `test_popup_and_home_button` to cover the banner include in home.yaml, no `condition: template`, quoted `"Off"`, and chip `visibility` per the plan table. Do a live check on a phone.

---

### Risk 17: Zone tiles copied from the vacuum popup don't fit a select

**Likelihood**: Medium. **Impact**: Low.

**Problem**: The vacuum tiles are `tile` cards with `tap_action: toggle` on input_booleans. Copied onto `input_select.crazy_mode_zone`, toggle does nothing useful, and a tile has no "selected option" highlight.

**Mitigation**: Two `button-card`s with `perform-action: input_select.select_option` and the option. Highlight in `[[[ return states['input_select.crazy_mode_zone'].state === '<option>' ]]]` styles. The idle view sits under a `conditional` on phase `"Off"`, and the run view under `state_not: "Off"`.

**Verification**: A test checks each tile's option is a real select option.

---

### Risk 18: The length slider reads junk at startup or mid-change

**Likelihood**: Low. **Impact**: Medium. A 0-minute Crazy skips straight to Slow-mo.

**Problem**: `input_number` states are strings like "5.0", and `unknown` right after a restart or reload. A bare `| int` with the default gives 0.

**Mitigation**: `{{ [[states('input_number.crazy_mode_crazy_minutes') | float(5), 2] | max, 15] | min | int }}`. The start reads it once and passes `crazy_minutes` to the run. Restart reads it the same way.

**Verification**: A harness test renders the expression for "5.0", "unknown", "0" and "99".

---

### Risk 19: The paused timeout doesn't fire

**Likelihood**: Low. **Impact**: Low. The run stays paused, and the house stays in Crazy state.

**Problem**: `for: 10 min` resets when automations reload (`deploy.sh --reload` does this) and on a restart. On a restart, the cleanup clears the flag anyway.

**Mitigation**:
- Add a second trigger on `homeassistant start`/`automation_reloaded` that fires when `crazy_mode_paused` has been on for 10 minutes by `last_changed` (`as_timestamp(now()) - as_timestamp(states.input_boolean.crazy_mode_paused.last_changed) > 600`). Or accept it and document it.
- Write the timeout as `minutes: 10`, not `00:10:00`, so `test_no_times_in_yaml` stays tight.
- Add a stuck-run watchdog: phase not Off, with `script.crazy_mode_run`, `script.crazy_mode_restore` and `script.crazy_mode_start` all off for 60 s, runs the restore. This also covers a restart whose `script.turn_on` was dropped.

**Verification**: A test for the timeout automation's conditions (phase not Off, run on) and for the watchdog.

---

### Risk 20: Alexa needs a new exposure and gets the wrong zone

**Likelihood**: Medium. **Impact**: Low.

**Problem**: Nabu Casa exposes scripts as scenes, and each new script must be exposed by hand in Voice assistants with a Routine added in the Alexa app. Without the variable approach in Risk 7, the plain phrase silently follows whatever the picker last held, including a pick made by the basement script.

**Mitigation**: Risk 7's variable hand-off. Put the expose and Routine steps in the README Deploy section as John's steps. Keep the basement script's alias distinct ("Crazy Mode Basement"), and keep `script.crazy_mode_start` with no fields.

**Verification**: `test_start_has_no_fields` stays. A new test checks the basement script calls `script.turn_on` on the start with `variables.zone`.

---

### Risk 21: Privacy and filename collisions

**Likelihood**: Low. **Impact**: Medium. The repo is public, and `!include_dir_named` drops files with the same basename silently.

**Problem**: The README, LEARNINGS or PR text could describe when the kids play, or why. New files with generic names (`zone_config.yaml`, `pause.yaml`) could collide with a basename elsewhere under `packages/`.

**Mitigation**:
- Keep the windows on the dashboard as now. Docs describe mechanisms only.
- Prefix every new file `crazy_mode_`. Run `find packages -name '*.yaml' | awk -F/ '{print $NF}' | sort | uniq -d` (it must print nothing), plus a diff grep and gitleaks before the push.

**Verification**: `test_no_times_in_yaml` extended to the new files and the banner include. Add the uniq check to the wrap checklist.

---

## Summary

Total risks identified: 21
Categories: timer semantics, script concurrency, test integrity, zone data, dashboard, Sonos, voice, privacy
CRITICAL risks (must address before proceeding): 1. The plan's "keep the existing tests green" contradicts its own design. About 12 tests pin the deadline clock, the abort-only turn-off and the hard-coded lists. The plan must name the rewritten tests and the invariant each keeps.

HIGH, addressed by changes to the build:
- 2: Resume only from `paused`, and the run owns every timer start that carries a duration.
- 3: the timer isn't tappable, and Cool-down has an elapsed floor.
- 4: per-zone scene and length guards on every light step.
- 8: restart is guarded against the abort and the restore.
- 11: Cool-down clears the pause.

Plan decisions for John: a restart cap (Risk 9); the Goal wording on abandoned runs (Risk 11); the zone passed as a variable instead of the basement script writing the picker (Risk 7); adding `sonos_basement` to the engine selector (Risk 14).

Plan deviations these mitigations imply:
- Helpers: `input_number.crazy_mode_restarts`, and a non-zero `duration` on `timer.crazy_mode_phase`.
- Zone config keys: `emergency_lights` and a slug key.
- Automations and scripts: a stuck-run watchdog automation, and the abort also cancels the restart and pause scripts.
- The reason sensor and the refusal line become zone-aware.
