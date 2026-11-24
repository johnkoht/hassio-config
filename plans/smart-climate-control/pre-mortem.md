## Pre-Mortem: Smart Climate Control (build scope: dry-run deliverable)

Scope of this build: layers 1-6 plus the energy-price offset and the dashboard controls, all shipping in dry-run. Task 9 (soak) is operational and task 10 (migration) happens after the soak; neither is built here. The old Eco/resume automations stay untouched.

Live facts used below were read from HA on epicurus (2026.7.4) on 2026-11-24, read-only.

---

### Risk 1: Context-based override detection cannot work on the Nests

**Problem**: The plan's layer 4 marks a zone Override when a climate change arrives "with no automation in its HA context". The installed Nest integration never writes state inside a service call: the new state only arrives through the Pub/Sub callback, with a fresh context (`user_id` and `parent_id` both None). So the controller's own writes, a person on the Nest app, the Nest's own mode flips, the dashboard and the old Eco automations all look identical. As written, every controller write would flip its own zone to Override. Ecobee is the opposite: a set call writes state inside the caller's context, but the next 180 s poll writes with a fresh one.

**Mitigation**: Detect overrides by value, not by context. Each zone has a decision sensor holding what HA wants (mode, setpoint). A change on the climate entity is an Override only when (a) the new value differs from the decision, and (b) it lands outside a grace window after this zone's last controller write (`input_datetime.climate_<zone>_last_write`, 180 s). Inside the grace window the change is treated as the Nest settling or fighting, and the periodic drift check re-applies. This also resolves the plan's own contradiction (layer 4 says an outside change sets Override; the first risk says an outside change triggers a re-apply).

**Verification**: Tests render the override condition with a fake state: a write 60 s ago plus a mismatch means no Override; a mismatch 10 min after the last write means Override; a value equal to the decision means nothing.

---

### Risk 2: A fresh `climate_dry_run` boolean starts `off`, which means live

**Problem**: Helpers carry no `initial:` (repo rule). A new `input_boolean` is created `off`. With the plan's polarity (`climate_dry_run` on = log only), the very first reload would run the controller live, with the old Eco automations still active.

**Mitigation**: Invert the polarity. `input_boolean.climate_live_control` is on for live writes; anything other than `on` (off, unknown, unavailable) is dry-run. The master `input_boolean.climate_automations` also starts off, so nothing runs at all until John turns it on. `climate_live_control` stays off until task 10.

**Verification**: A script-interpreter test runs `script.climate_apply_zone` with `climate_live_control` off, unknown and unavailable, and asserts zero `climate.*` calls and one `logbook.log` call.

---

### Risk 3: Unseeded `input_number` helpers start at their minimum

**Problem**: With no `initial:`, every profile and tuning number starts at `min` on creation, for example a cool setpoint at 60°F. The decision sensors would compute nonsense until each helper is set by hand, and there are about 25 of them.

**Mitigation**: `script.climate_seed_defaults` sets every helper to its decided starting value in one run. It is the single source for the defaults. John runs it once after the first reload, then turns on `climate_automations`. The decision sensors also clamp every Nest target inside the Away band and every radiant target to 50-71°F, so even an unseeded value can't produce an extreme setpoint.

**Verification**: A test asserts the seed script sets every `input_number` the package defines, and that each seeded value lies within that helper's min/max.

---

### Risk 4: The radiant hard cap leaks through one path

**Problem**: The radiant target can come from the comfort, sleep, cold-weather or away profile, all editable helpers. If any path skips the clamp, a floor can run hotter than 71°F and dry the air or damage the wood floors.

**Mitigation**: The cap is a constant (71) in the decision macro, not a helper, and is applied last. The controller script applies it again before every radiant `climate.set_temperature`.

**Verification**: A grid test renders the radiant decision across every mode, season, cold flag, humidity flag and helper values up to 80, and asserts the temperature never exceeds 71. A second test asserts the script's radiant branch contains the clamp.

---

### Risk 5: The Nest applies the setpoint to the wrong side after a mode change

**Problem**: Nest `set_temperature` calls `set_heat` or `set_cool` based on the entity's current `hvac_mode`, which updates only on the next Pub/Sub event. Changing cool to heat and then setting 72 straight away can write 72 as a cool setpoint.

**Mitigation**: When the mode changes, the controller calls `climate.set_hvac_mode`, waits for the entity state to equal the new mode (timeout 60 s, then stop and log), and only then calls `climate.set_temperature`.

**Verification**: A test asserts a `wait_template` sits between the mode and temperature calls in the script.

---

### Risk 6: Too many Google SDM API calls

**Problem**: The SDM API is rate-limited. Re-applying on every helper or sensor change would spend calls.

**Mitigation**: Write only when the target differs from the current value (mode differs, or the setpoint differs by at least 0.5°F). Debounce re-apply triggers with `for: 30 s`. The drift check every 30 min only reads, and writes only on a mismatch. Fast-moving inputs (outdoor temperature, forecast, humidity, price) reach the decisions only through debounced binary sensors with `delay_on`/`delay_off`.

**Verification**: Script interpreter test: with the climate already at its target, zero calls in live mode.

---

### Risk 7: Ecobee hold expiry is read as a person's override

**Problem**: Ecobee `set_temperature` creates a hold whose type comes from each thermostat's own hold-action setting. That setting isn't readable through HA. If it's "until next transition", the hold can end and the zone falls back to its comfort setting, and value-based detection would call that an Override.

**Mitigation**: An Ecobee change whose new `preset_mode` isn't `temp` (the hold state) means the hold ended, not a person, so it's re-applied, not flagged. A person's change on an Ecobee creates a `temp` hold. Log both cases during the soak.

**Verification**: Test: radiant mismatch with `preset_mode: home` outside grace means no Override; with `preset_mode: temp` it means Override.

---

### Risk 8: Package filename collisions silently drop files

**Problem**: `!include_dir_named packages/` keys by basename across the whole tree (see memory), so a new `climate_season.yaml` next to any existing file of the same name silently replaces one of them. A `.yml` file is never loaded.

**Mitigation**: Every new file is prefixed `climate_` and checked for basename uniqueness across `packages/`. All are `.yaml`.

**Verification**: A test asserts no basename under `packages/climate/smart/` appears anywhere else under `packages/`.

---

### Risk 9: The statistics sensor is silently dropped or truncated

**Problem**: HA drops a statistics sensor at setup with a bad characteristic name, and the CI config check still passes (kitchen-cooking 11-22). Tempest reports about every 71 s, so 7 days is about 8,500 samples, far above the default `sampling_size` of 20. The recorder keeps 7 days, so after a restart the mean is rebuilt from at most 7 days of history.

**Mitigation**: `state_characteristic: mean`, `max_age: 7 days`, `sampling_size: 20000`. The exact config was validated against the installed `PLATFORM_SCHEMA` on epicurus (PASS, 2026-11-24). The season sensor holds its last value while the mean is unavailable.

**Verification**: A test pins the characteristic, max_age and a sampling_size of at least 10080.

---

### Risk 10: The season flaps near the crossover

**Problem**: A single threshold on a rolling mean can still cross back and forth over a few days in spring and fall, switching Nest modes and radiant zones each time.

**Mitigation**: Two thresholds (Heating at 58°F or below, Cooling at 64°F or above) with hold-last-state in between via `this.state`, on a 7-day mean.

**Verification**: Render tests for each band, including the hold band starting from both seasons.

---

### Risk 11: The old automations and the new controller fight once live

**Problem**: The old Eco/resume/morning-start automations keep running. If live control were turned on before task 10, both systems would write the Nests, and the new override detection would read every Eco toggle as an Override.

**Mitigation**: This build ships dry-run only. The README, the dashboard description and the PR say `climate_live_control` stays off until the migration retires the old automations. In dry-run, override detection only writes logbook entries and never changes a mode.

**Verification**: Test: the override automation's mode-change action sits behind the live-control check.

---

### Risk 12: The mode state machine structure differs from the plan text

**Problem**: The plan suggests one automation file per transition. The repo's newer pattern (JK-1118, `house_mode_resolve`) is one resolver that derives the mode from state and is the only writer. Per-transition files across 6 zones would duplicate the priority rules (Vacation > Away > Sleep > Comfort) and drift.

**Mitigation**: One resolver automation (`climate_mode_resolve`), the only writer of the zone mode selects apart from override detection (which only ever writes Override). Its variables live in actions, as in JK-1118. It clears Override on every house event and never touches a zone in Off.

**Verification**: Resolver render tests: vacation, empty past the delay, empty inside the delay (no change), bedtime, Quiet on the 2nd floor only, nearly home, Override cleared on an event and kept on a restart, Off untouched.

---

### Risk 13: Privacy (schedules in a public repo)

**Problem**: The learned wake time, the precondition and the old docs touch household timing.

**Mitigation**: No time-of-day literals in any new file. The wake time is learned at runtime into `input_datetime.predicted_wake_time` and `input_text.climate_wake_history`; neither is committed. Grep the diff before each push. `docs/climate_automation_plan.md` already exposes schedule details. That's out of scope; it's flagged in the PR, not edited (history rewrite needs John).

**Verification**: A test asserts no `at: "HH:MM"` or `after:`/`before:` time conditions in new files; pre-push diff grep.

---

### Risk 14: Restarts drop `for:` timers

**Problem**: The Away-after-delay and Away-extended triggers use `for:`; a restart or reload drops them.

**Mitigation**: The resolver re-runs on `homeassistant` start and `automation_reloaded`. `climate_away_extended` is a restored boolean, so once set it survives a restart. After a restart mid-absence, extended Away starts again from the restart time, which errs warmer. Documented.

**Verification**: Resolver triggers include start and reload; README notes the restart behaviour.

---

### Risk 15: Main floor Sleep at 72°F heats an empty floor overnight

**Problem**: John set Sleep at 72°F. Applied to the main floor too, the house heats the main floor overnight, where the old system set Eco.

**Mitigation**: Sleep profiles are per zone group, and the seed applies the decided 72°F to both floors. Flagged in the PR for John to tune during the soak. Not changed here, because it's John's decision.

**Verification**: Called out in the PR body.

---

## Summary

Total risks identified: 15
Categories: integration (1, 5, 7, 11), environment/config (2, 3, 9, 14), safety (4), performance (6), structure (8, 12), scope (10, 15), privacy (13)
CRITICAL risks (must address before proceeding): none. Risks 1 and 2 would have been critical as written in the plan. Both have engineering fixes that keep John's decisions intact, folded into the PRD.
