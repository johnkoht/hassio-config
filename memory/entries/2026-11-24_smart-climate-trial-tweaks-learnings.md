# smart-climate-trial-tweaks — 2026-11-24

**Metrics:** 4 tasks, all approved on the first review (lite ship: no pre-mortem, no cross-model review). 0 iterations. 94 new tests; the full suite is 2369 passed, 9 skipped (was 2275). Holistic review READY. Shipped as a PR, still dry run.

**What shipped:**
- Seven `input_boolean.climate_live_<zone>` switches. A zone is live when the global `climate_live_control` or its own switch is on; anything else is dry run.
- One definition, `climate_live(zone)` in `custom_templates/climate_control.jinja`, used by the apply script (both checks), override detection, the drift check and the dry-air push. A static test fails on any other template or state-condition read of the switches.
- The drift tick runs only the live zones and does nothing when none is live, so dry-run zones don't log every tick.
- Main-floor Sleep heat seeds at 70. With guest mode on, the main floor in Sleep holds Comfort (reason "Guests"); pre-wake still wins.
- Per-zone toggles on the climate settings popup; the Nest rows warn about the old Eco automations. The global switch stays off the dashboard.

**Learnings:**
- A macro returns a string. A boolean macro must render exactly `True`/`False` so HA's native parsing gives a bool; `true` or padded output stays a non-empty string and `{{ not live }}` goes False, so a dry-run zone would write. A sabotage test (lowercase output) turns 11 tests red.
- Inside Jinja, compare the macro's output as a string (`climate_live(z) == 'True'`).
- Scripts and automations that import a custom template need `homeassistant.reload_custom_templates` before their own reload.
- The test harness now defaults its Jinja loader to `custom_templates/`, so script and automation tests can run macro imports.

**Follow-ups (BACKLOG):**
- The main-floor pre-wake lead still uses the Sleep setpoint, so with guests on it starts early. Harmless, since the target is Comfort anyway.
- Nothing pins that `input_boolean.guest_mode` exists (it is UI-defined). A rename would quietly read as off.
- Trial the garage first, then the radiant zones; keep the Nests dry run until the old Eco/resume automations are deleted at migration.
