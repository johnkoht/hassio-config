# PRD: Emergency Mode

**Goal**: While a security alarm or fire is active, the critical voice message plays in full, on every speaker, at any hour, and nothing non-critical plays over or after it until the emergency ends. Delivered as 4 PRs; this run builds PR 1 (tasks 1-5).

Source plan: `plans/emergency-mode/plan.md` (approved 2026-10-30). Issues JK-1149, JK-1165. Pre-mortem: `pre-mortem.md`. Review: `review.md`.

## Delivery

| PR | Scope | Tasks | Branch |
|---|---|---|---|
| 1 | Audio gate (P1-P5) | task-1..task-5 | feature/emergency-mode-pr1 |
| 2 | Critical delivery (P6-P8) | task-6 | later |
| 3 | Alarm lifecycle (P9-P12) | task-7..task-10 | later |
| 4 | Polish (optional) | task-11 | later |

Tasks marked **PR 1** are built in this run. Later PRs get their own pre-mortem refresh before building.

## Out of scope for PR 1

- Any change to `security_alarm_alert`, `fire_alarm_alert`, panic, alarmo, Noonlight or sirens.
- `general_notification`, tornado, fire push (PR 2).
- Notify REST timeout on the leak notifier (backlog; needs a notify reload).
- Falling back to `all` speakers when `auto` resolves to none (backlog).
- Closing the queue's append race for non-critical items (X8).

## Deploy notes (PR 1)

Reload Template entities and Input Boolean (neither is covered by deploy.sh --reload; Developer Tools -> YAML, or the supervisor API), then `./deploy.sh --reload --skip-ci` for automations and scripts. No restart. The gate fails open, so reload order doesn't matter.

## Tasks

### task-1 **PR 1**: emergency sensor and manual override

New packages/security/emergency/ with three files (unique basenames): emergency_mode.yaml (input_boolean.emergency_mode, no initial:), emergency_active.yaml (template binary_sensor.emergency_active), emergency_mode_auto_off.yaml (automation). Files: packages/security/emergency/*.yaml

Acceptance criteria:
- input_boolean.emergency_mode is defined with no `initial:` key
- binary_sensor.emergency_active (unique_id and default_entity_id set, state built with is_state()) renders on when alarm_control_panel.alarmo is `triggered`, OR binary_sensor.smoke_detector is `on`, OR input_boolean.emergency_mode is `on`; renders off in every other case, including all three entities missing (test renders with real Jinja2)
- emergency_mode_auto_off has id == filename, mode single, a state trigger on input_boolean.emergency_mode to `on` for 10 minutes, a homeassistant `start` trigger, and an `automation_reloaded` event trigger (a reload loses the pending `for:` timer); its action turns the boolean off via target:
- The three file basenames are unique across packages/ (include_dir_named collision guard)
- Each file has a title + 1-3 line header comment; modern syntax; no PII

### task-2 **PR 1**: engine priority gate and conservative TTS wait

announcement_engine.yaml: add a `priority` field (documented, default normal in the UI). First sequence step is a template condition: pass when binary_sensor.emergency_active is not `on`, or priority is `critical`. Treat an undefined priority as normal (fields have no runtime default). Replace the TTS wait with len/14 + 3. Set max: 25 and continue_on_error on the chime step (review D4, B3). File: packages/announcements/announcement_engine.yaml

Acceptance criteria:
- The first step of the engine sequence is the gate condition (before the chime play_media)
- Gate renders true for: emergency off/unavailable/unknown/missing with any priority; emergency on with priority critical; and false for emergency on with priority normal/low/high/undefined/empty (test renders with real Jinja2)
- TTS wait renders ceil(len/14)+3 seconds as an int: 75 chars -> 9, 0 chars -> 3, 200 chars -> 18; an unparseable length falls back to 3
- The chime-only path (no speech_message) still stops after the chime delay
- The engine declares an explicit max: 25 so a burst cannot drop a queued critical call
- The chime play_media step has continue_on_error: true so a chime failure cannot skip the TTS
- doorbell_ring.yaml and hourly_dong.yaml still call script.announcement_engine directly (unchanged, asserted by test) so they pick up the gate

### task-3 **PR 1**: critical_announcement calls the engine directly

critical_announcement.yaml: replace announcement_queue_enqueue with a NON-blocking script.turn_on of script.announcement_engine (variables: carrying priority critical). Review D1: the leak REST notifier waits for the script and has a 10 s timeout, and the engine is already mode queued so FIFO order holds. Keep volume and quiet-halving logic. Save input_text.latest_voice_announcement first, using a target: block. The auto branch already reads main_bedroom_occupied (fixed 10-29); keep the existing regression test green. File: packages/announcements/critical_announcement.yaml

Acceptance criteria:
- critical_announcement does not reference script.announcement_queue_enqueue or any MQTT topic
- It starts script.announcement_engine via script.turn_on with variables priority: critical and keys speech_message, sound_file, sound_length, sound_volume, speech_volume, media_players; every key is a field declared by the engine
- media_players renders to the 8-speaker list for `all`, the occupied-room list for `auto`, and the entity string for a single entity (test renders with real Jinja2)
- Quiet mode halves both volumes (20) when binary_sensor.emergency_active is off; while an emergency is active the volume stays 40 even in quiet mode (review D3; test)
- input_text.latest_voice_announcement is set before the engine call, via target:
- tests/test_announcement_queue_regressions.py::test_critical_auto_reaches_occupied_main_bedroom passes against the new structure

### task-4 **PR 1**: processor holds non-critical items during an emergency

queue/processor.yaml: pass priority to the engine; add a condition so only a critical item is dequeued while emergency_active is on; add a trigger on binary_sensor.emergency_active -> off (with a trigger id); on that run drop low-priority items outright in both the next-item selection and the published queue. append.yaml's critical-append purge stays. File: packages/announcements/queue/processor.yaml

Acceptance criteria:
- The engine call passes priority from the dequeued item, defaulting to normal when absent
- A new condition looks at the first NON-EXPIRED item (matching how `next` is chosen): false when emergency_active is on and that item is not critical; true when it is critical; false-safe when the queue is empty; true when emergency is off/unavailable (test renders with real Jinja2)
- A state trigger on binary_sensor.emergency_active to `off` exists with an id; existing triggers are unchanged
- On the clear trigger, low-priority items are absent from both the selected queue and the `updated` queue; expired items are dropped as before; on any other trigger low items are kept
- The existing house_occupied, quiet-before-9, queue-running and announceable-room conditions are unchanged
- append.yaml's critical purge is unchanged (plan task 4; recorded in the report: a queue-path critical item such as tornado until PR 2 still purges queued items) and a test asserts that a critical item arriving via the queue still plays during an emergency (processor condition passes it, the engine gate passes it)

### task-5 **PR 1**: regression tests and docs

Add tests/test_emergency_mode_regressions.py (static YAML plus Jinja2 rendering; no HA service calls). Update packages/announcements/{CLAUDE.md,README.md,LEARNINGS.md}, docs/ANNOUNCEMENTS.md, packages/security/{CLAUDE.md,LEARNINGS.md}. Files: tests/test_emergency_mode_regressions.py, docs

Acceptance criteria:
- Every AC of tasks 1-4 has a test; each new test is sabotage-checked (revert the change, confirm red) and the result is recorded in build-log.md
- Full suite passes: python -m pytest -q from tests/
- grep for `queue-gated`, `still goes through`, `wipe the queue`, `Clears the queue`, `clears all other queued` finds no stale statement in packages/ and docs/
- Docs describe: critical skips the queue, the emergency gate, hold-not-clear, the TTS wait formula, the new package, the known deferral race, the leak notifier timeout caveat
- No PII; gitleaks pre-commit passes without --no-verify

### task-6 **PR 2**: critical push delivery

general_notifications.yaml: priority critical passes regardless of notification_level; mode parallel, max 25. fire_alarm_triggered.yaml: push to devices all. severe_weather_warning.yaml: tornado branch calls script.critical_announcement with media_players all. Grep push callers that send two pushes with one tag in quick succession. Add regression tests; update docs and security CLAUDE.md.

Acceptance criteria:
- A critical general_notification is delivered when notification_level is None
- general_notification is mode: parallel with max: 25
- Fire push devices is all
- Tornado warning calls script.critical_announcement with media_players all; hazardous air unchanged
- Caller grep for same-tag back-to-back pushes recorded in the build log

### task-7 **PR 3**: alarm test mode

input_boolean.alarm_test_mode with initial: false (deliberate), 30-minute auto-off, persistent notification while on. security_alarm_alert Noonlight branch runs unless test mode is `on` (unknown/unavailable still dispatches).

Acceptance criteria:
- Noonlight branch carries the gate condition
- An absent or unavailable boolean does not block dispatch
- Auto-off after 30 min and at start
- Persistent notification created while on and dismissed on off

### task-8 **PR 3**: disarm off-path

security_alarm_disabled triggers on from: triggered to any state except unavailable/unknown.

Acceptance criteria:
- Trigger is from triggered with not_to unavailable/unknown
- Test asserts the trigger shape

### task-9 **PR 3**: Noonlight on fire (P12)

fire_alarm_alert gets a Noonlight branch with continue_on_error true, gated by test mode like the intruder branch. Read the Noonlight component and docs read-only first for the false-alarm cancel path and put that in the fire push text.

Acceptance criteria:
- Fire alert has a Noonlight branch with continue_on_error true
- Branch is skipped only when alarm test mode is on
- Fire push text names the cancel path
- Regression test covers branch and gate

### task-10 **PR 3**: panic via alarmo

After the homelab agent confirms alarmo alarm_trigger from disarmed (and code need), panic_button.yaml calls alarm_control_panel.alarm_trigger on alarmo instead of the alert script. Verify only after the button is repaired and with test mode on.

Acceptance criteria:
- Read-only alarmo verification recorded
- panic_button.yaml no longer calls script.security_alarm_alert directly
- Code via !secret if required
- Fallback per decision 6 if alarmo does not trigger from disarmed

### task-11 **PR 4**: polish

X1 sirens on fire (yes). X3 intruder path keeps lights on until disarm via a flag to alarm_flash_lights; security_alarm_disabled restores the snapshot; fire path still restores right away. X4 only if a real test shows a pre-emption problem.

Acceptance criteria:
- Fire alert includes sirens
- Intruder path skips the flash restore and disarm restores the snapshot
- Fire path restore unchanged
