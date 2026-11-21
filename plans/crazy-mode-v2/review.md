# Review: crazy-mode-v2 plan

Reviewer subagent, 2026-11-20. Findings folded into plan.md (see "Review fixes").

**Verdict: ITERATE.** There are no BLOCKERs: the design is sound and none of the findings below needs a redesign. But there are 12 DEFECTs, and 1 to 6 and 9 to 11 are gaps or contradictions in the plan text, so they should go into the plan before /approve.

Plan reviewed: `/Users/johnkoht/code/hassio-config/.claude/worktrees/crazy-mode-v2/plans/crazy-mode-v2/plan.md` (untracked, worktree based on 7cc5650f).
Baseline: `tests/.venv/bin/python -m pytest -q tests/test_crazy_mode.py` gives 69 passed, 0 skipped. This is the v1 baseline only, since nothing is built yet. The venv was the one from the main checkout, because the worktree has none.
Sabotage: not applicable, because this is a plan review. The sabotage targets the build must use are listed under Tests.

## Answers

**1. Is a timer-driven tick loop sound?** Yes, it can work, and it's better than v1. With the timer as the clock, a voice line can't stretch the run, which v1 needed deadline arithmetic to guarantee.
- **Loop shape:** each phase starts `timer.crazy_mode_phase` and loops with a `wait_template` that wakes on stop or on the paused flag, with a ~5 s timeout. It exits when the timer goes idle.
- **Progress:** when the timer is active, use `finishes_at` and the `duration` attribute. When it's paused, use the `remaining` string.
- **Cool-down stays unskippable** as long as it keeps ignoring `stop_requested`.
- **The abort works** if it cancels every script that can start the run again (DEFECT 3).
- **Where it breaks today:** there are holes at the edges: pause in Cool-down, Stop while paused, and Restart during setup, the restore or an emergency (DEFECTs 1 to 3).

**2. Is the template sensor the right place for zone config?** Yes, and the reason the plan doesn't give is this: `sensor.crazy_mode_reason` is a template, and it has to check the chosen zone's speakers for the favorites. A template can't call a script or read another script's variables.
- **Script variables** can't be shared between scripts, so they would mean copying the lists into each script. That's exactly what v1 did, and `test_speaker_lists_agree` was the guard against those copies drifting.
- **A script that returns the config** (a `stop:` response variable) would work for the scripts and automations, but the allowed sensor can't call it.
- **The sensor's weakness:** while template entities reload or HA is starting, its attributes are missing. Every reader has to refuse loudly or fall back. It must not quietly use empty lists (DEFECT 9).

**3. Feature coverage:** all six requested features are in the plan, but several are specified wrongly (DEFECTs 1, 2, 4, 6, 7, 10 and 11).

**4. Tasks and tests:** one task is missing (the allowed sensor, DEFECT 4). The test plan contradicts itself: it says "keep existing tests green", but several v1 tests pin the deadline structure the plan removes (DEFECT 8). Seven scenarios have no test yet.

**5. Structural blockers:** none.

## Findings

1. **[DEFECT] Pause in Cool-down contradicts the goal.** The goal says "every run still ends in Cool-down". But the Pause chip shows "while running", and a run paused for 10 minutes "ends quietly … no Cool-down". So pausing during Cool-down, then waiting, skips Cool-down. Pick one rule and write it down. The simplest is to allow pause only in Crazy and Slow-mo, since Cool-down is only 60 s. That removes the conflict and keeps Cool-down untouchable.

2. **[DEFECT] Stop while paused is not specified.** The plan says "Stop still works" when paused. But Cool-down's `timer.start duration` sets the timer active while `crazy_mode_paused` is still on and the music is paused. The run would then sit in an active Cool-down that is flagged as paused, and the 10-minute timeout could fire during it. Stop, or the Cool-down entry, has to clear the paused flag and resume playback first. Add a test for it.

3. **[DEFECT] Restart can race the setup, the restore and the abort.**
   - **During setup:** `crazy_mode_start` sets the phase to Crazy before it takes the snapshot. A Restart at that moment starts the run early, so the snapshot captures the run's 100% lights and restore later "restores" Crazy lighting.
   - **During the restore:** the run calls `script.crazy_mode_restore` (blocking, `crazy_mode_run.yaml:306`) while the phase is still Cool-down. A Restart there cancels it partway: Adaptive Lighting is already back on and the latch is cleared. Or the restore finishes and sets the phase Off under a live run.
   - **During an emergency:** the abort (`crazy_mode_emergency_abort.yaml:24-29`) turns off only the run and start scripts. A restart in flight sets Crazy again after the restore.
   - **The fix:** Restart, Pause and Skip should all require `script.crazy_mode_run` on, `script.crazy_mode_start` off, `script.crazy_mode_restore` off and `binary_sensor.emergency_active` off. The abort and the paused-timeout automation should also turn off `crazy_mode_restart` and `crazy_mode_pause`.
   - **Tests:** `test_only_the_emergency_abort_turns_off_the_run` has to become an explicit allowlist (abort, restart, paused timeout).

4. **[DEFECT] There is no task for the allowed sensor.** `crazy_mode_allowed.yaml:24` hard-codes the four main-floor speakers for the `favorite_missing` check. A Basement run would be checked against the main floor, and `sonos_basement` would never be checked. This also breaks Task 9's "no hard-coded lists" test. Add a task: check `state_attr('sensor.crazy_mode_zone_config', <selected zone>).speakers` for the zone in `input_select.crazy_mode_zone`, and extend the Jinja harness tests to cover both zones.

5. **[DEFECT] The zone config is missing keys.**
   - **Emergency lights:** `crazy_mode_restore.yaml:51-55` hard-codes four light groups for the emergency "end bright" step. The config needs an `emergency_lights` key (empty for Basement), or that step has to use the leaf lights.
   - **Refusal speaker:** the refusal line speaks on `sonos_kitchen` (`crazy_mode_start.yaml:63`). For Basement it should use the zone's coordinator.

6. **[DEFECT] A one-speaker zone still needs unjoin.** "Groups the speakers only when the zone has more than one" has to mean: always unjoin, and join only when there's more than one. If `sonos_basement` is grouped with the main floor when a run starts, the run plays through the whole group. Add a test.

7. **[DEFECT] "It's 5 when first created" is wrong.** An `input_number` with no `initial:` and no restored state starts at `min`, which is 2. The first run would be a 2-minute Crazy. Add a hand-off step that sets it to 5 once, or have the build set it through the API after deploy. A seed automation doesn't work, because it would overwrite the slider. Fix the plan text.

8. **[DEFECT] The test plan contradicts itself.** "Keep the existing tests green" can't be done. These v1 tests pin the deadline clock and the four-speaker lists the plan removes:
   - `test_every_wait_runs_to_a_deadline` (:444)
   - `test_clock_shape_is_pinned` (:659)
   - `test_no_fixed_delays_that_carry_the_clock` (:680)
   - `test_speaker_lists_agree` (:188)
   - `test_voice_lines_carry_chime_volume_and_four_speakers` (:426)
   - `test_refusal_speaks_only_for_window_reasons` (:337)
   - `test_restore_emergency_ends_with_bright_lights` (:610)
   - `test_only_the_emergency_abort_turns_off_the_run` (:568)

   List which tests are replaced, and say which invariant each replacement keeps.

   Missing tests:
   - a Jinja harness for the progress formula, active and paused, using real timer attribute shapes;
   - each one-off line (the one-minute line, prompt B) fires exactly once across ticks and across a pause and resume;
   - Stop while paused;
   - Restart refused during setup, the restore and an emergency;
   - the abort and the paused timeout cancel the restart and pause scripts;
   - the paused-timeout automation's shape;
   - an empty light list skips `scene.create` and the light calls;
   - an empty or unknown `crazy_mode_active_zone` falls back to Main floor.

   Required sabotage:
   - change the progress formula to a `now()` deadline, and the pause test must go red;
   - remove the run-script gate from Restart, and its test must go red;
   - make Cool-down read `stop_requested`, and the Cool-down test must go red.

9. **[DEFECT] An unavailable zone config must not fail silently.** Restore and the startup cleanup re-read `sensor.crazy_mode_zone_config` at the end of a run. During a template reload, or right after HA starts, the attributes can be missing. `sonos.restore` and the Adaptive Lighting turn-on would then target nothing, and the house is left in party mode with no error. They should log or notify and use the Main floor lists as a fallback, with a test.

10. **[DEFECT] "Lights stay where they are" while paused is false for the kitchen.** Per `packages/house/LEARNINGS.md:113-116`, `kitchen_lights_to_off` ignores the latch on vacancy. The run's per-tick re-assert is what holds the lights. If the loop skips re-asserts for up to 10 minutes while paused, the kitchen can go dark. While paused, keep re-asserting the frozen brightness and skip only the ramps and fades.

11. **[DEFECT] The run banner overlaps the vacuum banner.** `horizontal_action_card_fixed` puts the card at `position: fixed; bottom: 89px`, the same slot as `_vacuum_active_notification.yaml`. A Crazy Mode run while the vacuum is running stacks one banner on top of the other. Say which one wins (for example, hide the vacuum banner while the phase isn't Off), or use a different offset.

12. **[DEFECT] One-off events need a "fired" flag.** With 5 s ticks and progress thresholds, "one more minute" and prompt B need a fired-once variable, or a check that progress crossed the threshold since the last tick. Otherwise they fire on every tick past the threshold. Since HA 2025.4 the `variables` action can update outer-scope variables, so this works. Write it into Task 3 and test it (see finding 8).

13. **[BACKLOG] Split the Pause toggle into explicit pause and resume.** A stale dashboard tap flips the wrong way. The chips already know which state they want. Label: `crazy-mode`.

14. **[BACKLOG] Per-zone base volume.** The basement Amp and the main-floor Sonos speakers are unlikely to sound right at the same level. Label: `crazy-mode`.

15. **[BACKLOG] The "Crazy Mode Basement" Alexa script changes the zone for good.** After it, plain "Crazy Mode" also plays in the basement, and the zone changes even when the start is refused. State this in the README, or keep the change only for that one call. Label: `crazy-mode`.

16. **[BACKLOG] The slider is hidden mid-run.** So "Restart uses the slider's current value" really means "the value the run started with". Either drop that sentence or show the slider in the run view. Label: `crazy-mode`.

17. **[BACKLOG] A light transition already in flight keeps going during a pause.** Each Slow-mo step's `transition` finishes after Pause. That's harmless with ~5 s steps, but the docs shouldn't claim the light ramp freezes exactly. Label: `crazy-mode`.

On task order: Tasks 2 and 6 should land together, with the new allowed-sensor task between Tasks 1 and 2. The docs task should also update `dashboards/SITEMAP.md` if the popup's role changes, and the README's "Crazy 5:00" wording.

**Host and architecture impact:** none from this review. When built, the plan adds a template sensor, 4 helpers, 3 or 4 scripts and an automation. Nothing lands on the host: no cron jobs, credentials or network changes.

**Not checked:**
- Whether `sonos_basement` lists the three favorites and plays a Spotify favorite through `select_source`. That needs live state.
- Whether a Sonos `media_play` resumes in place.
- What the timer attributes look like on the running HA version.
- The full `tests/run.sh` suite. I only ran the Crazy Mode tests.
