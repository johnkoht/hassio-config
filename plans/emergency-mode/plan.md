---
title: Emergency Mode
slug: emergency-mode
status: draft
created: 2026-10-28
has_pre_mortem: false
has_review: false
has_prd: false
issues: [JK-1149, JK-1165]
depends_on: JK-1165 hotfixes #72 (fire trigger + parallel alerts) and #75 (flash restore), both shipped 2026-10-28/29
---

# Emergency Mode

## Problem

During a panic or alarm, the critical voice message can get cut off by ordinary announcements, and on some paths it never plays at all (JK-1149). The alarm/fire `parallel:` hotfix fixed how the alert actions are sequenced. It didn't touch the audio path or the gates in front of it (JK-1165 remainder).

What the code shows, assuming the hotfix has landed (fire triggers on `binary_sensor.smoke_detector`, and both alert scripts run their actions in one `parallel:` block with Noonlight and Nest on `continue_on_error`):

**Why critical messages get cut off**

- `script.announcement_engine` waits `len/17 + 1` seconds after starting TTS. That's an estimate, not the real playback length. It doesn't allow for cloud TTS fetch time, so the next item can start over the tail of a critical message. For the alarm message (about 75 characters), the wait is 6 s.
- `doorbell_ring` (`script.activate_doorbell_chime`, which loops up to 3 times) and `hourly_dong` call `script.announcement_engine` directly. They bypass the queue and the processor's `announcement_queue_running` lock. The doorbell checks `house_occupied` and `bedtime`, but not `speech_notifications`. The engine is `mode: queued`, so calls run one after another, not on top of each other. A doorbell press or the hourly dong during an alarm still plays straight after the critical message, and the short wait above lets it clip the critical message's tail.
- A critical message doesn't pre-empt one that's already playing. Person-arrival chimes alone run 11–22 s.
- `queue/append.yaml` is still `mode: single`; PR #69 changed `processor.yaml`, not append. If two appends arrive close together, the second is dropped with an "already running" warning. During an alarm, a door-open or arrival announcement can land in the same instant as the critical one, and either could be the one dropped. `queued` alone wouldn't close the race: each run reads `sensor.announcement_queue`, which updates through an MQTT round-trip (see the 2026-10-28 queue-race entry: "a single writer would close it").
- A critical append already throws away every queued non-critical message (`[new_item] + critical_msgs`). Today's behaviour is "drop", not "defer".

**Gates on the critical path (the bigger protection gap)**

- The processor requires `house_occupied`, and blocks everything, critical included, when `quiet_mode` is on before 9 am. `quiet_mode` turns on as soon as anyone is in bed (`quiet_mode_turn_on`). So **a fire or alarm overnight produces no voice announcement until 9 am.** This is the worst finding.
- `general_notification` stops at `notification_level == None` before it looks at priority, so a critical push is silently dropped. It's also `mode: queued` with the default `max` of 10. A burst of camera pushes during a break-in can fill the queue, and the alarm push gets dropped.
- The fire push goes to `devices: "jk"` only.
- Tornado warnings go through `voice_announcement` with `priority: critical`. That still passes `speech_notifications`, the 06:00–23:00 window and `bedtime`, so **a tornado warning at night is silent**. (`sound: nuclear` isn't in voice_announcement's sound map either, so it falls back to the default chime.) Hazardous air has the same gating.

**Alarm lifecycle**

- `panic_button.yaml` calls `script.security_alarm_alert` directly and never touches alarmo. A panic therefore has no off path: `security_alarm_disabled` only fires on alarmo `triggered → disarmed`. Even for a real alarmo trigger, the investigation found disarm doesn't fire it reliably, and alarmo can leave `triggered` for an armed state when its trigger time runs out, which `to: disarmed` misses.
- `switch.noonlight_alarm` off doesn't cancel a dispatch, because the component only flips its state. **Every end-to-end test of `security_alarm_alert` dispatches emergency services.** There's no test mode today.
- `binary_sensor.panic_button` is unavailable live (hardware). The automation uses a ZHA device trigger, so the button must be repaired and re-paired before any panic-path verification.

**Rejected shortcut:** turning `speech_notifications` off for 2–10 minutes. `house_mode_auto` turns it back on whenever house mode changes. It's also a gate on the critical path itself (voice_announcement checks it), and the doorbell ignores it. Using it as the emergency gate would silence the wrong things and still miss the doorbell.

**Name collision:** `input_boolean.alert_mode` already exists as a UI helper. Legacy `scripts.yaml` (the Alexa speech path) uses it to mean "bypass quiet mode once" and turns it off after each use. Reusing it would get it cleared by an unrelated Alexa announcement.

## Goal

While a security alarm or fire is active, the critical message plays in full, on every speaker, at any hour, and nothing non-critical plays over or after it until the emergency ends. Critical pushes always reach everyone. Every path can be tested without dispatching Noonlight.

## Approach

### Challenge to the investigation's design

The investigation proposed a latched `input_boolean.emergency_mode` plus a 10-minute `timer`, which the alert scripts turn on and disarm or the timer clears, with a reset at HA start. It's sound, but heavier than v1 needs, and a latched flag has its own failure modes: it can stick on after a restart, or clear while the sirens are still going. Changes from that design:

1. **Derive the emergency from real state rather than latching it.** A template `binary_sensor.emergency_active` is on while `alarm_control_panel.alarmo` is `triggered`, OR `binary_sensor.smoke_detector` is `on`, OR a manual `input_boolean.emergency_mode` is on. It clears itself when the alarm or smoke clears, can't get stuck across a restart, and needs no wiring in the alert scripts. The manual boolean is kept as a small override. It lets panic (until PR 3), tests and dashboard use set the gate without any alarm entity, and an automation turns it off after 10 minutes and at HA start.
2. **Send critical messages straight to `script.announcement_engine`, skipping the MQTT queue.** `critical_announcement` calls the engine itself, so the processor gates (`house_occupied`, quiet before 9 am, `announcement_queue_running`) and the `append.yaml` drop race no longer apply to critical messages. That removes three of the gate fixes outright. The queue's job is holding messages until someone's home, which is the opposite of what a critical message needs. The engine's `mode: queued` still serialises playback, so at most one in-flight message plays ahead of it.
3. **Put the gate in the engine, the one choke point.** The engine gets a `priority` field (default `normal`) and a first-step condition: `emergency_active` is off, or priority is `critical`. That covers the processor, doorbell, hourly dong and any future direct caller, without editing each one. The processor adds the same check as a condition, so non-critical messages wait in the queue (deferred) instead of reaching the engine and being dropped, and it adds an `emergency_active → off` trigger so the queue resumes afterwards.
4. **Leave leak alerts out of emergency mode.** Leak alerts go through `alert:` with a REST notifier and repeat hourly. A leak isn't a life-safety event that should mute the house for minutes. With change 2 its critical announcements already get the direct path.
5. **Move tornado to `critical_announcement`, but not hazardous air.** Hazardous outdoor air at 3 am isn't something to wake the house for; the morning announcement and push cover it. That's an open decision.
6. **Don't pause `lighting_automations` in v1.** Turning a global flag off and on is the latched-state risk again, and keeping lights on is the real need. That moves to polish (PR 4) as "leave lights on after flashing", which is lighter.

### Protection vs polish, priced

Size: S = one or two files and a small diff; M = several files or a behaviour change that needs careful testing; L = cross-cutting change or something that needs live verification first.

| # | Item | Class | Size | Notes |
|---|---|---|---|---|
| P1 | `binary_sensor.emergency_active` + `input_boolean.emergency_mode` (auto-off 10 min, off at start) | Protection | S | template entity, so it needs a Template reload, not `--reload` |
| P2 | Engine `priority` field + emergency gate | Protection | S | covers doorbell and dong for free |
| P3 | `critical_announcement` calls the engine directly | Protection | S | fixes overnight silence, the append drop and the house_occupied gate in one go |
| P4 | Processor defers non-critical while emergency is on, resumes on clear | Protection | S | |
| P5 | Conservative TTS wait in the engine | Protection | S | stops next-item clipping; slightly longer gaps for every announcement |
| P6 | `general_notification`: critical bypasses `None`; `mode: parallel` (max 25) | Protection | S | touches every push caller's execution mode |
| P7 | Fire push to `all` | Protection | S | one line in a file the hotfix just touched |
| P8 | Tornado → `critical_announcement` | Protection | S | all speakers, overnight |
| P9 | Alarm test mode (Noonlight skipped while on) | Protection, safety | S | prerequisite for any E2E test of P10–P11 |
| P10 | `security_alarm_disabled` fires on any exit from `triggered` | Protection | S | sirens and flashing stop on disarm or trigger-time expiry |
| P11 | Panic → alarmo `alarm_control_panel.alarm_trigger` | Protection | M | needs live verification that alarmo triggers from disarmed; hardware precondition |
| X1 | Sirens on fire | Polish/policy | S | John's call |
| P12 | Noonlight on fire | Protection | S | decided 10-28 (John: yes); its own `continue_on_error` branch, respects test mode |
| X3 | Intruder alarm: keep lights on until disarm instead of restoring | Polish | S | restore is now the default and works (#75) |
| X4 | Critical pre-empts a playing message (`media_stop` on targets) | Polish | M | Sonos announce behaviour needs testing |
| X5 | Real playback length (wait on Sonos state, not an estimate) | Polish | M/L | announce mode doesn't reliably change state; P5 is the pragmatic version |
| X6 | Hazardous air → critical | Polish | S | not recommended |
| X7 | Pause room lights-off automations during emergency | Polish | M | only if X3 proves insufficient |
| X8 | Single-writer queue (close the append race for non-critical) | Polish | M | P3 removes the critical exposure |

### Phasing (small PRs)

- **PR 1, audio gate (P1–P5).** JK-1149 core. Testable without any alarm entity: turn on `input_boolean.emergency_mode`, ring a test chime or enqueue a low message, confirm it's deferred, then call `script.critical_announcement` directly with a test message and confirm it plays overnight in quiet mode.
- **PR 2, critical delivery (P6–P8).** Push and tornado paths. Testable with a test push and a direct critical_announcement call.
- **PR 3, alarm lifecycle (P9–P12).** Test mode lands first in the PR, and no E2E run happens without it on. Panic is gated on the button working again.
- **PR 4, polish (X1, X3, X4 as decided).** Optional. Can wait until v1 has lived through a real test.

## Tasks

1. **PR 1: emergency sensor.** New `packages/security/emergency/` (or `packages/house/emergency/`, see the open decisions). It holds `input_boolean.emergency_mode` (no `initial:`), the template `binary_sensor.emergency_active` (alarmo `triggered` OR `binary_sensor.smoke_detector` on OR the boolean on), and an `emergency_mode_auto_off` automation: boolean on for 10 min, and `homeassistant` start → off. One automation per file, header comments, modern syntax.
2. **PR 1: engine gate.** `announcement_engine.yaml`: add a `priority` field (default `normal`). First step: `condition: template`, `not is_state('binary_sensor.emergency_active','on') or priority == 'critical'`. Replace the TTS wait with a conservative formula, for example `len/14 + 3` (see the open decisions).
3. **PR 1: critical direct path.** `critical_announcement.yaml`: call `script.announcement_engine` (blocking) with `priority: critical` instead of `announcement_queue_enqueue`. Keep the volume and quiet-halving logic. Keep saving `input_text.latest_voice_announcement`. Fix the `auto` branch, which reads `input_boolean.main_bedroom` instead of `main_bedroom_occupied` (only if it's in scope; flag it otherwise).
4. **PR 1: processor hold.** `processor.yaml`: pass `priority: "{{ next.priority }}"` to the engine. Add a condition that `emergency_active` is off or `q[0].priority == 'critical'`, so nothing non-critical is dequeued during an emergency. Add a trigger on `binary_sensor.emergency_active` → `off`; on that run, drop expired items (the normal expiry check) and drop `low` priority items outright before playing anything. Leave the existing house_occupied and quiet gates in place for non-critical messages. This replaces `append.yaml`'s critical-append purge (`[new_item] + critical_msgs`), which stops running once P3 sends critical messages straight to the engine; leave that purge in place for any critical item that still arrives through the queue, and add a test that both paths agree.
5. **PR 1: tests and docs.** Extend `tests/test_announcement_queue_regressions.py` (or add `test_emergency_mode_regressions.py`): the engine gate is the first step; critical_announcement doesn't call enqueue; the processor passes priority; doorbell and dong still go through the engine. Update `packages/announcements/CLAUDE.md`, `README.md` and `LEARNINGS.md`, and `docs/ANNOUNCEMENTS.md` (the critical path no longer uses the queue, the emergency gate, the corrected "clears the queue" claim). Update `packages/security/CLAUDE.md`, whose hotfix text says critical "still goes through the queue".
6. **PR 2: critical push.** `general_notifications.yaml`: let `priority == 'critical'` through regardless of `notification_level`, and change to `mode: parallel` with `max: 25`. `fire_alarm_triggered.yaml`: push to `devices: "all"`. `severe_weather_warning.yaml`: the tornado branch calls `script.critical_announcement` with `media_players: all`. Add regression tests, and update `docs/` and the security CLAUDE.md.
7. **PR 3: alarm test mode.** `input_boolean.alarm_test_mode` with `initial: false`, which is deliberate here: it must come back off after a restart, unlike the user-editable helpers in the `initial:` memory entry. Auto-off after 30 min, plus a persistent notification while it's on. In `security_alarm_alert`, wrap the Noonlight branch so it runs unless test mode is `on`; unknown or unavailable still dispatches. Add a regression test that the Noonlight branch carries the condition and that an absent boolean doesn't block dispatch.
8. **PR 3: disarm off-path.** `security_alarm_disabled` triggers on `from: "triggered"` to any state except `unavailable`/`unknown`. Add a test.
9. **PR 3: Noonlight on fire (P12).** `fire_alarm_alert` gets a Noonlight branch with `continue_on_error: true`, gated by test mode exactly like the intruder branch. Before building, read the Noonlight component (on the host, read-only) and Noonlight's docs for how a false alarm is cancelled. The component's switch-off doesn't cancel, so the cancel path is Noonlight's own (app or callback). Put that cancel path in the fire push text so whoever gets it knows how to stand the dispatch down. Add a regression test for the branch and its gate.
10. **PR 3: panic via alarmo.** First, have the `homelab` agent read the live alarmo version and code (read-only) to confirm `alarm_control_panel.alarm_trigger` works from `disarmed`, what state alarmo goes to after trigger time, and whether it needs a code (if so, `!secret alarmo_code`). Then `panic_button.yaml` calls `alarm_control_panel.alarm_trigger` on `alarm_control_panel.alarmo` instead of the alert script. Verify only after the button is repaired, and only with test mode on.
11. **PR 4 (optional): polish.** X1 per John's decision. X3, if chosen: the intruder path passes a flag so `alarm_flash_lights` skips its restore, and `security_alarm_disabled` restores the snapshot on disarm (the fire path keeps restoring right away). X4 only if a real test shows a pre-emption problem.

## Open decisions

1. **New flag, or reuse `alert_mode`?** Recommended: **new `input_boolean.emergency_mode`**, as only a manual/test override, with the real gate being the derived `binary_sensor.emergency_active`. `alert_mode` means "bypass quiet once" to the legacy Alexa script, which clears it after each use.
2. **Derived sensor, or the investigation's latched boolean + timer?** Recommended: **derived sensor**. It can't stick and needs no wiring in the alert scripts. Trade-off: the gate lifts the moment the alarm is disarmed or the smoke clears, with no grace period. If John wants a tail, add `delay_off: 60s` to the template sensor.
3. **Drop or defer non-critical announcements during an emergency?** **Decided 10-28: hold, don't clear.** John asked whether to clear the queue or hold announcements until `emergency_active` is off. Hold: nothing non-critical is dequeued while the emergency is on, and direct engine callers (doorbell, dong) are dropped, not queued. When it clears, expired items are dropped (low 3 min, normal 10 min) and so is anything `low`, since stale chit-chat after an alarm is noise; normal and high reminders that are still valid then play. Clearing the whole queue at the start was rejected because a time-sensitive normal reminder can still matter once the emergency ends. The hold replaces the old critical-append purge, which no longer runs once critical skips the queue (task 4).
4. **Auto-clear?** Recommended: the manual boolean auto-clears at **10 min** and at HA start. The derived sensor clears on disarm, trigger-time expiry, or smoke clearing.
5. **Critical bypasses the MQTT queue?** Recommended: **yes** (P3). Alternative: keep critical in the queue and patch each processor gate plus the append race. That's more edits and still leaves the MQTT round-trip in the critical path.
6. **Panic through alarmo?** Recommended: **yes**, provided alarmo triggers from disarmed (task 9 verifies). If it doesn't, fallback: panic turns on `input_boolean.emergency_mode` and calls the alert script, and disarming the boolean runs `security_alarm_disabled`.
7. **Sirens on fire?** Recommended: **yes**. Smoke detectors sound locally, but the sirens reach the whole house.
8. **Noonlight on fire?** **Decided 10-28 (John): yes.** See P12 and task 9. The false-alarm risk (cooking) is handled by Noonlight's own cancel path, which goes in the fire push.
9. **Lights after flashing.** Reframed 10-29. John expects his scene back, and the restore was broken (it snapshotted the light group, so every light came on); #75 fixed it, so **restore is the default**. Open: for an intruder alarm only, keep the lights on until disarm (X3)? Recommended: **restore on fire and tests, keep lights on until disarm for an intruder.**
10. **Tornado and hazardous air?** Recommended: move **tornado only** to critical_announcement; leave hazardous air on voice_announcement.
11. **TTS wait formula.** Recommended: **`len/14 + 3` s for every priority**. Simple, and it fixes clipping at the cost of slightly longer gaps between queued messages. Alternative: lengthen the wait only for critical.
12. **Package location.** Recommended: `packages/security/emergency/`, since alarm and fire own the trigger states. Alternative: `packages/house/`, next to the other house modes.

## Risks

- **Noonlight on fire dispatches on a cooking false alarm.** Mitigation: the smoke detector is the only fire trigger, the cancel path is in the push (task 9), and test mode covers every fire test.
- **A real Noonlight dispatch during testing.** Mitigation: never run `security_alarm_alert`, the panic button or alarmo trigger until P9 test mode is merged, deployed and visibly on. Verify PR 1 and PR 2 only by calling `script.critical_announcement`, turning on `input_boolean.emergency_mode`, and sending test pushes. Static regression tests check the alert scripts' structure without running them.
- **Test mode left on during a real event.** Mitigation: `initial: false`, 30-min auto-off, a persistent notification, and the condition fails safe (only an explicit `on` skips Noonlight).
- **The engine gate silently blocks something important.** Every non-critical caller is blocked while `emergency_active` is on. If the template errors to `unavailable`, `not is_state(...,'on')` passes everything, so it fails open, which is the right direction for chatter. Mitigation: a test that the gate expression is fail-open.
- **The critical direct path loses the queue's buffering.** If nobody's home, the message plays to an empty house; acceptable for an intruder (deterrent) or fire. Critical messages in quick succession (leak repeats, a tornado during an alarm) serialise in the engine's queued mode. Check the engine's `max` (default 10).
- **`general_notification` → `mode: parallel` changes ordering for every push caller.** A follow-up push with the same tag could arrive before the first. That's low impact, but grep callers that send two pushes with one tag in quick succession.
- **Alarmo `alarm_trigger` may not work from disarmed, or may need a code.** Mitigation: verify with the read-only homelab agent before task 9, with the fallback in open decision 6.
- **Template entities don't reload with `deploy.sh --reload`.** Mitigation: the PR 1 deploy step includes a Template reload (Developer Tools → YAML, or the supervisor API). Never restart HA unprompted; pass `--skip-ci` and never run a bare `--check`.
- **Panic hardware is down.** P11 can merge, but it can't be verified end to end until `binary_sensor.panic_button` is back and re-paired. Track that as a precondition, not a task.
- **Privacy.** Plans, tests, commits and PR bodies use entity names and `!secret` names only: no codes, no schedules, no places.

On approval → /approve → /ship emergency-mode
