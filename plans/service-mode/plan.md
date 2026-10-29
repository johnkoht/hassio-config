---
title: Service Mode
slug: service-mode
status: draft
created: 2026-10-28
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-1179
related: JK-1186
---

# Service Mode

> **Parked 2026-10-28 by John (not a priority).** Status stays `draft` until it's picked up again. The JK-1186 button fix (PR 1) can still be pulled out on its own if wanted.

## Problem

When the family is away and someone comes to look after the dog, John lets them in by hand: he turns `input_boolean.house_occupied` on, turns `input_boolean.guest_mode` on, then unlocks the front door or opens a garage door. The front lock (Level, HomeKit over Bluetooth) is unreliable, so it is usually the garage. That takes several taps across different screens, and it isn't safe.

The manual state doesn't hold, because nothing tells the house that the "occupied" flag was set on purpose:

- **Every deploy reload or HA restart puts the house back to empty.** `packages/house/occupancy/house_not_occupied.yaml` triggers on `automation_reloaded` and `homeassistant: start`. If `group.all_people` is `not_home`, it turns `house_occupied` off. Then `house_mode_away` sets the house to Away, and `alarm_arm_when_house_empty` arms one minute later with the sitter inside. If a door or motion sensor trips after that, the alarm can lead to a monitoring dispatch.
- **A restart also turns guest mode off.** `automation/guests/guest_mode_off.yaml` triggers on HA start and turns `guest_mode` off when `group.guests` is `not_home`, so camera person alerts start up again.
- **On vacation there are timed arm paths.** `bedtime_mode_vacation_on` turns on bedtime at 22:00 when the house is unoccupied, and `alarm_arm_at_bedtime` follows. `alarm_arm_if_john_away` arms at 21:30 while John is away and announces it over TTS. Either one can catch an evening visit.
- **Opening the garage isn't enough to get in.** `lock.garage_entry_door` (garage → mudroom) has its own lock. `garage_entry_door_auto_unlock` only fires when the interior door is opened from the inside.

## Goal

The House Mode popup gets one button. It turns service mode on: the alarm is disarmed, the chosen entry opens, and the house stays occupied and quiet. Reloads, restarts and timed arm paths can't undo that while it's on. Turning it off, or letting it expire, hands the house back to the existing away chain, which locks the doors, closes the garage and arms the alarm. John gets a push for each step.

## Approach

**Recommended: "occupied, guarded" (the proposed design, made smaller).** Service mode turns `house_occupied` on, as John already does by hand. That way the existing automations do most of the work. Room lights respond to the sitter, garage mode goes to Auto, and the cameras stay quiet through guest mode. When it ends, the script turns `house_occupied` off, and the away chain that already runs when the house empties takes over: `front_door_auto_lock`, `garage_entry_door_auto_lock`, `garage_mode_away` → `garage_doors_close_when_empty_house`, then `house_mode_away`/`house_mode_vacation` → alarm arm. Climate goes to eco after 30 minutes. The "off" script never sends lock or cover commands of its own, so the unreliable Bluetooth lock isn't asked to do the same job twice. The new code is a flag, two scripts, a timer, and a few one-line guard conditions.

**Lighter alternative, compared and not recommended: "empty, disarmed".** Here service mode leaves `house_occupied` off. It only disarms, opens the entry and blocks auto-arm, so lights and climate stay in away. It looks lighter, but it needs more code, not less:

| | Occupied, guarded (rec.) | Empty, disarmed |
|---|---|---|
| Guards needed | `house_not_occupied`, arm script, `guest_mode_off`, garage close-when-empty, plus optional climate/speech | all of those, plus `alarm_arm_when_house_empty` zone/distance triggers, `bedtime_mode_vacation_on`, the empty-house vacuum, and room lights that stay off for the sitter |
| Turning it off | flip `house_occupied` off, and the existing chain locks, closes and arms | no state change, so the script has to lock, close and arm on its own and duplicate the away chain |
| Sitter experience | lights work, no camera alerts | dark house unless lights are switched by hand; any reload while garage mode is Away closes the garage on them |
| Matches today | yes, it automates what John already does | no |

**Even lighter v1 (fallback if John wants the smallest PR first):** only guard 1 below (the `service_mode` condition on `house_not_occupied`), plus a plain `input_boolean.service_mode` toggle in the popup. That fixes the dangerous reload path and leaves the manual steps manual. It would be a safety patch, not the shortcut JK-1179 asks for, so it isn't the recommendation.

### Behaviour

**`script.service_mode_on`** (mode `single`). Order matters:
1. Turn `input_boolean.service_mode` on first, so every guard is active before anything else changes.
2. Turn `input_boolean.guest_mode` on.
3. If the alarm isn't `disarmed`: `alarmo.disarm` on `alarm_control_panel.alarmo` with `code: !secret alarmo_code`, then `wait_template` until it is `disarmed` (timeout 30s). On timeout, send a time-sensitive push to John ("Service mode: alarm didn't disarm, entry NOT opened") and stop. **Nothing opens before the alarm reports disarmed.**
4. Turn `input_boolean.house_occupied` on. `house_mode_auto`, `garage_mode_auto` and the room automations follow. `alarm_disarm_when_house_becomes_occupied` doesn't fire, because the alarm is already disarmed.
5. Turn `input_boolean.speech_notifications` off (see D4). `house_mode_auto` would turn it back on, so it gets a guard.
6. Open the entry (see D2). Garage default: `lock.unlock` `lock.garage_entry_door`, then `cover.open_cover` on the chosen garage door. Front-door option: a single `lock.unlock lock.front_door` attempt.
7. Start `timer.service_mode`.
8. Push to John (`script.general_notification`, `devices: "jk"`, tag `service-mode`): "Service mode on. Alarm disarmed, <entry> open, ends at <time>."

**`script.service_mode_off`** (mode `single`):
1. Cancel `timer.service_mode`. Turn `speech_notifications` on.
2. Turn `input_boolean.service_mode` off **before** the house is marked empty, otherwise the arm guard would block the re-arm.
3. Turn `guest_mode` off, only if `group.guests` is `not_home`.
4. If `group.all_people` is `not_home`, turn `house_occupied` off. The existing away chain does the locking, closing and arming (see D6).
5. Wait about 3 minutes, then check `lock.front_door`, `lock.garage_entry_door`, `cover.garage_doors` and `alarm_control_panel.alarmo`. Send one push: "Service mode off. All locked, closed and armed." If anything isn't, send a time-sensitive push naming what's still open. The script only checks here; it doesn't retry.

**Expiry and arrival:**
- `service_mode_expired`: `timer.finished` on `timer.service_mode` runs `script.service_mode_off` and says in the push that the timer ended it.
- `service_mode_end_on_family_arrival`: when `group.family` goes to `home`, clear service mode without locking or arming. It cancels the timer, restores speech, turns `service_mode` off and leaves `house_occupied` on.

### Guards (each a `service_mode: off` state condition)

| # | Where | Why |
|---|---|---|
| G1 | `packages/house/occupancy/house_not_occupied.yaml` | The reload/restart path that empties the house. **This is the critical one.** |
| G2 | `script.alarm_arm_home` (`packages/security/alarm/alarm_arm_home_script.yaml`), plus a push saying arming was skipped | One guard covers `alarm_arm_when_house_empty`, `alarm_arm_at_bedtime` and `alarm_arm_if_john_away`. `alarm_arm_away_when_vacation_mode` calls `alarmo.arm` directly, but it needs `house_occupied` off, so G1 covers it. Manual arming from the alarm panel still works. |
| G3 | `automation/guests/guest_mode_off.yaml` | Stops a restart from turning guest mode off. |
| G4 | `automation/house/modes/house_mode_auto.yaml`, on the `speech_notifications` re-enable step only | Keeps the house quiet (if D4 = mute). |
| G5 | `main_floor_climate_resume` and `second_floor_climate_resume` | Keeps climate in eco (if D3 = stay eco). |
| G6 | `packages/garage/doors/garage_doors_close_when_empty_house.yaml` | It fires on every reload while garage mode is Away. On vacation, `house_mode_auto` picks Vacation rather than Auto, so `garage_mode_auto`'s house→Auto trigger never fires and the garage can stay Away with the door open for the sitter. |

These don't need a guard, because they only fire when `house_occupied` goes off: the empty-house vacuum, `front_door_auto_lock`, `garage_entry_door_auto_lock`, `bedtime_mode_vacation_on`, and climate eco (gated on `guest_mode` too). `garage_doors_close_if_open_too_long` stays active on purpose (see D2).

### Dashboard

Add a card to `dashboards/kohbo/home/house_mode_popup.yaml` after the mode-toggle `entities` card (about lines 94-140) and before the Danger Zone (about line 145). Copy the danger-zone `stack-in-card` exactly: a title from `kohbo_card_section_title`, explanatory text from `kohbo_card_section_description`, and a pill `button-card`. Swap `--error-color` for `--orange-color` (`#E36001`) on the border and the button. `--warning-color` is `--accent-color` (`#FFD166`), and the house-mode card already uses it for Away, so it would read as "away" rather than "caution".
- The button is bound to `input_boolean.service_mode`. Its label and `tap_action` flip with the state: when off it reads "Start Service Mode" and calls `script.service_mode_on`; when on it reads "End Service Mode · ends HH:MM" and calls `script.service_mode_off`. It has a `confirmation:` text either way.
- Description text, with no names or times: "For a dog sitter or service visit while we're away. Disarms the alarm, opens the <entry>, and keeps the house in guest mode so reloads don't re-arm it. It ends on its own after <N> hours, or when someone in the family gets home."
- Check the CSS against the live popup DOM at phone width before merging (memory: verify dashboard CSS live). After deploy, `touch /config/dashboards/kohbo/kohbo.yaml` (deploy.sh does this).

## Open decisions

Each one has a recommended default, which the plan uses unless John says otherwise.

- **D1 – Shape.** Occupied-guarded, empty-disarmed, or the guard-only patch. **Rec: occupied-guarded.** It's the smallest change that is actually safe, and it matches what John already does.
- **D2 – Entry point.** **Rec: garage.** The plan unlocks `lock.garage_entry_door` and opens one garage door. John names the door; the build uses a placeholder until then. The front door is supported only as a single unlock attempt, because of the Bluetooth timeouts. The `garage_doors_close_if_open_too_long` timeout stays on, so a forgotten door still closes. The downside is that a sitter who steps out with the dog for longer than the timeout could find the door shut. **Sub-decision:** keep the auto-close (rec), or turn on `input_boolean.garage_override` for the length of service mode.
- **D3 – Climate.** **Rec: stay in eco** (G5). Visits are short, and every eco↔resume toggle on the SDM Nest risks the mode flip in memory (`reference_nest_eco_flips_hvac_mode`). An overnight sitter would want resume, which can be added later.
- **D4 – Announcements.** **Rec: mute everything below critical** by turning `speech_notifications` off (G4). `script.critical_announcement` (fire/smoke) still plays. A per-priority filter would mean touching the announcement engine, which isn't worth it for v1.
- **D5 – Auto-expire.** **Rec: a 3-hour `timer.service_mode` (`restore: true`) that runs `service_mode_off` and pushes to John.** A service mode that's forgotten leaves the house disarmed indefinitely, which is the worse failure. A duration picker is deferred.
- **D6 – Re-arm when it ends.** **Rec: reuse the existing chain; don't add an explicit `arm away`.** In normal mode, `alarm_arm_when_house_empty` → `script.alarm_arm_home` arms **home**, not away. With `vacation_mode` on, `house_mode_vacation` → `alarm_arm_away_when_vacation_mode` arms away. Home mode is probably deliberate when there's a dog indoors (interior motion), so John should confirm before anything arms away with the dog inside.
- **D7 – Admin-only button.** **Rec: no.** There's no visibility-by-user pattern in the dashboards. A `user` condition needs HA user IDs, which the privacy rules say must not be committed (account IDs). The `confirmation:` dialog and John's push on every on/off are the control. If he wants it later, check first whether the YAML dashboard accepts `!secret` for the user IDs.
- **D8 – Family arrival ends it.** **Rec: yes**, clearing flags only, with no lock or arm.
- **D9 – Fold in JK-1186.** **Rec: yes, as a separate PR** (see below).

## JK-1186: "Turn Off the House" button

The button (about lines 177-185) shows `entity: input_boolean.house_occupied`, but its `tap_action` calls `input_boolean.turn_off` on `input_boolean.john_dnd`. Pressing it has never turned the house off. All it does is quietly clear John's DnD.

Git history: the button was added that way in `d7ef783` ("dashboard updates", 2025-10-23) in `dashboards/kohbo/home/home.yaml`. It moved verbatim into the popup the same evening in `a1ac6ce` ("update morning announcement prompt and some dashboard updates"), and since then the only change is whitespace (`5684b71`, #35). No commit message, comment, doc or README calls it a stub or a safety placeholder. `john_dnd` is the toggle on John's person card (`dashboards/templates/button_cards/people/john.yaml`), so it reads as a copy-paste placeholder that was never swapped. That's an inference, not proof: **John should confirm it wasn't deliberate.**

Fix: target `input_boolean.house_occupied` with `input_boolean.turn_off` and keep the confirmation. Be aware that this turns a button that did nothing into a live one. Pressing it with people home starts the full away chain (Away, lights off, doors locked, garage closed, alarm armed home after 1 minute), and `house_occupied` stays off until a person sensor changes. The description text already promises that. Even though it's dashboard-only, it shouldn't go through the dashboard auto-merge flow, because it changes an alarm path. It needs John's go-ahead.

## Tasks

**PR 1, JK-1186 (dashboard only, needs John's go-ahead):**
1. Fix the Turn Off the House target — `house_mode_popup.yaml`: `john_dnd` → `house_occupied`. Add a test asserting that the button's `perform_action` target matches its `entity`.

**PR 2, JK-1179 service mode (scripts and automations, needs John's go-ahead and a live dry run):**

2. Helpers — `packages/house/service_mode/service_mode.yaml`: `input_boolean.service_mode` (**no `initial:`**, so it survives a restart) and `timer.service_mode` (3h, `restore: true`). Every filename gets a `service_mode_` prefix, because `!include_dir_named` keys packages by basename across the whole tree.
3. On script — `packages/house/service_mode/service_mode_on.yaml`, with the ordering above and `!secret alarmo_code`.
4. Off script — `packages/house/service_mode/service_mode_off.yaml`, with the ordering above and the check-only confirmation push.
5. Expiry and arrival — `service_mode_expired.yaml` and `service_mode_end_on_family_arrival.yaml`, one automation per file.
6. Guards G1–G6 — one condition each. For G3, G4 and G5, `guest_mode_off`, `house_mode_auto` and the climate resume files are in legacy syntax (`trigger:`/`service:`/`platform:`). Convert each file you touch to modern syntax in the same change, and change nothing else in them. Note that `house_not_occupied.yaml` still has a root-level `entity_id` in its action; fix that while you're in the file.
7. Dashboard card — the orange service-mode card, as described under Dashboard.
8. Tests — `tests/test_service_mode_regressions.py`, modelled on `test_away_mode_regressions.py`. It checks:
   - each of G1–G6 is present;
   - in `service_mode_on`, the `service_mode` turn-on comes before disarm, and the disarm wait comes before any `lock.unlock` or `cover.open_cover`;
   - in `service_mode_off`, `service_mode` turns off before `house_occupied` does;
   - the code comes only from `!secret`;
   - the boolean has no `initial:`;
   - there's no new `alarmo.arm` call site that bypasses `script.alarm_arm_home`, apart from the vacation automation, which needs `house_occupied` off.
9. Docs — the arm/disarm table in `packages/security/CLAUDE.md`, the House Mode Popup section in `dashboards/kohbo/home/README.md`, and a short service-mode paragraph in `docs/PEOPLE.md` next to guest mode. Use neutral wording throughout ("a dog sitter"), with no names, times or entry details beyond the entity.
10. Validate and dry run — run `./deploy.sh --check --skip-ci` (never a bare `--check`) and the test suite, then push and `--reload --skip-ci`. **John runs the dry run, at home:**
    - service mode on from the popup;
    - confirm the alarm shows disarmed before the entry opens;
    - confirm the entry opens and the push arrives;
    - do an automation reload while it's on and confirm nothing re-arms or closes;
    - service mode off;
    - confirm the lock/close/arm push.

    Because John is home, `group.all_people` isn't `not_home`. So the dry run can't exercise the real empty-house reload path (G1 with the house empty) or the re-arm on off. Those two are covered by the tests and by condition checks in Developer Tools. John should watch his phone during the first real use.

## Risks

- **The entry opens before the alarm is disarmed, leading to a dispatch.** Mitigation: the `wait_template` on `disarmed` gates every unlock or open, it aborts on timeout and pushes, and a test enforces the ordering.
- **A guard gets missed and something re-arms with the sitter inside.** Mitigation: guard the shared `script.alarm_arm_home` rather than each caller, and have a test fail on any new direct `alarmo.arm`. The dry run includes a reload while service mode is on.
- **Re-arm is blocked when service mode ends.** Mitigation: `service_mode` turns off before `house_occupied`, a test checks it, and the off script's push reports the actual alarm state.
- **Service mode is forgotten.** Mitigation: the 3h expiry, auto-close on garage open-too-long, and the end-on-family-arrival automation.
- **The front lock times out on Bluetooth.** Mitigation: garage is the default entry. The front door gets one attempt, and the off-check push reports the outcome. No duplicate lock commands in the off path.
- **Vacation-mode side paths** (house picks Vacation rather than Auto, faux-home lights, the 22:00 bedtime). Mitigation: G1 keeps `house_occupied` on, which disables `bedtime_mode_vacation_on`, and G6 covers the garage that stays in Away. Re-check during review that nothing else keys off `input_select.house == Vacation` while the house is occupied.
- **Arming away with the dog indoors could false-trigger interior motion.** Mitigation: D6 keeps the existing home-mode arm.
- **Changes to legacy-syntax files.** Mitigation: convert only the files that get touched, with no behaviour change beyond the guard, and the modern-syntax test covers them.
- **Dashboard CSS looks right in YAML and wrong on the phone.** Mitigation: inspect the live DOM at phone width before merge, and treat John's screenshot as the acceptance test.
- **The JK-1186 fix makes a no-op button live.** Mitigation: separate PR, confirmation kept, and John signs off.
- **Privacy (public repo).** Mitigation: no codes (only `!secret alarmo_code`), no sitter names, visit times or door details in config, docs, tests, commits or PR text. Grep the diff before pushing; gitleaks runs in hooks and CI.
- **Restarts.** Only John restarts HA, so none are needed. Everything here loads with `--reload` (automations and scripts). Input booleans and timers reload from Developer Tools → YAML, so the first deploy needs a helper reload, which John does.

On approval → /approve → /ship service-mode
