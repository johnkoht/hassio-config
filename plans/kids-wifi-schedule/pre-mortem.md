## Pre-Mortem: Kids WiFi Schedule

No `.build/expertise/` profiles exist in this repo. Risks below draw on `packages/school/LEARNINGS.md`, `dashboards/LEARNINGS.md` and project memory.

### Risk 1: Automation targets a dead switch (HIGH)

**Problem**: UniFi recreated every WLAN switch at 01:16 UTC on 11-11. `switch.kids_enabled` is the registry's best guess, and `switch.kids_2` is the old-id orphan. If it's wrong, `switch.turn_off` succeeds against nothing and the network never goes off. Nothing shows the failure.

**Mitigation**: Plan task 1 gates the build. Homelab must confirm live `on`/`off` state for `switch.kids_enabled` and a "kids" friendly name. The state condition (`switch.kids_enabled` is `on` before turning it off) also makes an unavailable switch a no-op rather than an error.

**Verification**: Homelab result in build-log before Phase 4. After deploy, a live test toggles the real network.

---

### Risk 2: Unset time helper fires at midnight (HIGH)

**Problem**: Per `packages/school/LEARNINGS.md`, an unset time `input_datetime` reads `00:00:00` (`timestamp: 0`), and a time trigger on it fires at midnight. If John turns the schedule on before setting all four times, the kids network goes off (or on) at 00:00. The midnight off would also evaluate "tomorrow" against the wrong day.

**Mitigation**: Each automation adds a condition that the triggering helper is set: `state_attr(<helper mapped from trigger.id>, 'timestamp') | int(0) > 0` (review #1: no reliance on trigger.entity_id). The popup description says to set all four times before turning the schedule on.

**Verification**: The automation YAML contains the guard. Reviewer checks it reads the helper that fired, not a hard-coded one.

---

### Risk 3: Mutually exclusive gating gets inverted (HIGH)

**Problem**: Off logic says the weekday trigger needs school tomorrow and the weekend trigger needs no school tomorrow. A flipped `not`, or using `state: "off"` (false on unavailable, per school LEARNINGS), gives zero or two firings per night.

**Mitigation**:
- "No school" is written as `not (A on or B on)` with `is_state(..., 'on')`, never `state: "off"`.
- Only `on` counts as school, so unavailable means no school, which gives weekend times (as accepted in the plan).
- Gating sits in two `choose`-free `or`/`and` blocks keyed on `trigger.id`, mirroring the prototype shape.

**Verification**: The reviewer walks the 4 cases (school tomorrow yes/no × weekday/weekend trigger) and confirms exactly one off fires per night. Same for mornings.

---

### Risk 4: Parochial sensor unavailable more often than expected (MEDIUM)

**Problem**: `binary_sensor.parochial_school_in_session_tomorrow` has an `availability:` that goes unavailable while `parochial_school_has_event_tomorrow` is unknown, for example right after a reload. Gianluca's school day is calendar-driven.

**Mitigation**: Already covered by "only `on` counts", so the primary sensor still decides on its own. Accepted: the failure mode is one late night.

**Verification**: Homelab reports current states of all four school sensors (task 1 brief includes them).

---

### Risk 5: Popup not reachable or deep-link test breaks (MEDIUM)

**Problem**: Home popups are `!include`d at the bottom of `dashboards/kohbo/home/home.yaml`. A popup not included there has no route. `tests/test_notification_deep_links.py` maps hashes per view. Also, YAML-mode dashboards only refresh on the root `kohbo.yaml` mtime (memory), and popup CSS fixes reasoned from bundles have failed before (memory: verify against the live DOM).

**Mitigation**:
- Include `kids_wifi_popup.yaml` next to `house_mode_popup.yaml` in `home.yaml`.
- Copy the garage-lock popup structure exactly; add no new CSS.
- The entry point reuses an existing Home button/chip template.
- `deploy.sh` touches `kohbo.yaml`.
- Check the result live after deploy.

**Verification**: Deep-link test passes. After deploy, opening `/dashboard-kohbo/home#kids_wifi` renders the popup.

---

### Risk 6: Filename collision under `!include_dir_named` (LOW)

**Problem**: Packages are keyed by basename globally (memory). A duplicate basename silently drops one file.

**Mitigation**: All new files are prefixed `kids_wifi_`. Grep confirms they're unique.

**Verification**: `find packages -name 'kids_wifi*'` shows no duplicates; the existing duplicates test passes.

---

### Risk 7: `initial:` sneaks onto helpers (LOW)

**Problem**: `initial:` disables restore and reverts dashboard edits every restart (memory, school LEARNINGS). The garage-lock pattern being copied *has* `initial:`.

**Mitigation**: No `initial:` on any helper. Note this in the PRD AC.

**Verification**: `grep initial packages/network/kids_wifi/` is empty.

---

### Risk 8: Private routine leaks into the public repo (MEDIUM)

**Problem**: The actual cutoff times are a family routine. They could land in a commit message, PR body, memory entry or a test fixture.

**Mitigation**: Times live only in runtime helpers. Commits and PR use "off time". The live test uses "a couple of minutes ahead", with no real values written anywhere. gitleaks runs on commit.

**Verification**: Grep the final diff for `HH:MM` patterns before push.

---

### Risk 9: Docs drift (LOW)

**Problem**: New package and new popup hash need `docs/AUTOMATIONS.md`, `dashboards/kohbo/home/README.md` and possibly `dashboards/SITEMAP.md`.

**Mitigation**: Plan task 6. Check whether SITEMAP lists popup hashes (house_mode isn't listed, so follow whatever convention it actually uses).

**Verification**: `/wrap` docs check.

---

### Risk 10: Rollback (LOW)

**Problem**: A bad schedule could cut WiFi at the wrong time.

**Mitigation**: The schedule ships turned off (no `initial:`, new boolean defaults off). Rollback is flipping the toggle, or turning the switch on from the popup or the UniFi app. There's no data migration.

**Verification**: After deploy, `input_boolean.kids_wifi_schedule` is `off`.

## Summary

Total risks identified: 10
Categories: integration, environment/config, test complexity, scope/AC precision, backward compat (dashboard), documentation, privacy, rollback
CRITICAL risks (must address before proceeding): none. Risk 1 is HIGH and already gated by task 1.
