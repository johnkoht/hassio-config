# Crazy Mode

**What:** `packages/house/crazy_mode/`: one tap or Alexa phrase runs 5 min Crazy, 1 min Slow-mo, 1 min Cool-down on the main-floor loop (Sonos favorites, dimming lights, voice cues), then restores the house. Once per dashboard-set window; refused in Bedtime, Quiet, Away, Vacation, empty house, emergency.

**Learnings:**
- A running script can't be told to skip ahead: stop sets a flag that only the Crazy and Slow-mo waits read; Cool-down never does.
- Calling the announcement engine with `action:` blocks and stretches the clock; use `script.turn_on` mid-run, block only for the closing line.
- Every wait runs to a deadline from the run's start, not a fixed delay.
- `kitchen_lights_to_off` ignores the manual latch on vacancy, so the run re-asserts lights each tick.
- Reviewer found tests that stayed green under clock mutations (Cool-down stretched, Slow-mo skipped); structure tests need to pin loop counts and deadline expressions, and a Jinja harness for the allowed sensor.
- A start script that sets state then does slow setup can be raced by an abort: the abort must cancel the start script too.
- Privacy: keep health and schedule framing out of plan artifacts as well as code; fixtures use obviously synthetic times.

**Follow-ups (BACKLOG):** watchdog for a run killed by a script reload; check Sonos regroup vs critical announcement on abort; restore volume if `sonos.restore` fails; mention Crazy Mode in the packages/CLAUDE.md latch table.
