## Pre-Mortem: Emergency Mode (whole plan; PR 1 risks in depth)

Date: 2026-10-30. Scope of the coming build: PR 1 (P1-P5). Risks for PR 2-4 are listed briefly so they carry forward.

Checked against the code in the worktree: `announcement_engine.yaml`, `critical_announcement.yaml`, `queue/processor.yaml`, `queue/append.yaml`, `doorbell_ring.yaml`, `hourly_dong.yaml`, `leak_monitoring.yaml`, `alarm_triggered.yaml`, `fire_alarm_triggered.yaml`, `tests/test_announcement_queue_regressions.py`.

### Risk 1: The critical path loses its only voice route if the new direct call is wrong (HIGH)

**Problem**: After P3, `critical_announcement` is the one thing standing between a fire and silence, and it no longer goes through the queue. A wrong field name, a media_players value that renders as a string instead of a list, or an engine error would mean no announcement at all, with no queue to retry it. The queue path was proven in production; the direct path is new.

**Mitigation**: Tests render the real templates with Jinja2 and assert that every `data:` key passed to the engine is a field the engine declares. The `media_players` template is checked for all three modes (`all`, `auto`, a single entity) and must render to something HA's native template parsing turns into a list (or a single entity string). The `input_text` save runs first so an engine error can't skip it. A static check pins that `critical_announcement` never calls `announcement_queue_enqueue`.

**Verification**: new tests in `tests/test_emergency_mode_regressions.py`, sabotaged by pointing the call back at the enqueue script and by renaming a data key. John's post-deploy check calls `script.critical_announcement` directly with a test message.

---

### Risk 2: The `priority` field has no runtime default (HIGH)

**Problem**: HA script `fields:` defaults only pre-fill the UI. At runtime an omitted field is undefined. The doorbell, hourly dong and any future direct caller never pass `priority`. A gate written as `priority == 'critical'` would raise an undefined-variable error (or compare false) instead of treating it as `normal`. If the template errors, the script run stops with an error and the doorbell breaks even when no emergency is on.

**Mitigation**: the gate renders `(priority | default('normal')) == 'critical'`. Tests render it with the field undefined, `normal`, `critical`, and an empty string, with the emergency sensor on, off, unavailable and absent.

**Verification**: parametrised gate test; sabotage by replacing the gate expression with `priority == 'critical'` and confirming the undefined case goes red.

---

### Risk 3: Gate fails closed on a broken sensor and silences normal announcements (MEDIUM)

**Problem**: If `binary_sensor.emergency_active` is wrongly stuck `on`, every ordinary announcement, doorbell chime and dong is silenced until fixed. The derived design avoids latching, but the manual boolean can still be left on.

**Mitigation**: the gate is `not is_state('binary_sensor.emergency_active', 'on')`, so `unavailable`, `unknown` and a not-yet-created entity all pass (fail open). The manual boolean auto-offs after 10 minutes and at HA start. Deploy order is safe in either direction: before the Template reload the entity doesn't exist and the gate passes everything.

**Verification**: gate tests include `unavailable`, `unknown` and a missing entity. The auto-off test asserts both triggers (`for: 10 min` and the start event) and the `turn_off` action.

---

### Risk 4: Non-critical messages deferred by the processor can still be lost in a narrow race (MEDIUM)

**Problem**: The processor checks `emergency_active` as a condition, then calls the engine, which is `mode: queued`. If an emergency starts after the processor dequeues a normal item but while the engine is busy, the engine's own gate runs when the call finally starts, drops the item, and the processor then removes it from the queue as "played". The intent is "hold, don't clear", and this window loses one item.

**Mitigation**: accepted as residual. The window is the engine's queue wait, and the item is by definition ordinary chatter, expiring within 10 minutes anyway. Documented in the announcements LEARNINGS so nobody assumes "deferred" is airtight. No extra machinery in PR 1.

**Verification**: LEARNINGS line; reviewer to confirm they agree it's not worth fixing now.

---

### Risk 5: Emergency-clear purge of `low` items only runs on the clear trigger (MEDIUM)

**Problem**: The processor drops `low` items when it runs from the `emergency_active -> off` trigger. If that run is blocked by another condition (house empty, queue-running flag on), the low items stay and play later.

**Mitigation**: low items expire in 3 minutes by default, so the leftover case is short emergencies only. Accepted. The purge is implemented once, keyed off a trigger id, in both the `queue` variable (next item selection) and the published `updated` queue, so a purge run can never play a `low` item and can never leave one behind.

**Verification**: tests render both templates with the clear trigger and with an ordinary trigger.

---

### Risk 6: Blocking engine call makes the leak REST notifier wait for playback (MEDIUM)

**Problem**: `leak_voice_announcement` is a REST notifier POSTing to `/api/services/script/critical_announcement`, which waits for the script to finish. Before, the script just enqueued, so the call returned immediately. With a blocking engine call it now waits through the chime and TTS wait (several seconds, more with the longer wait). The REST notifier's default timeout is 10 seconds, so a leak alert could log a timeout error each time. Playback is unaffected (the script keeps running).

**Mitigation**: keep the plan's blocking call. Log noise only. Deferred follow-up: add `timeout:` to the leak notifier (a notify config change, which needs a notify reload or restart, so it doesn't belong in the PR 1 deploy). Called out in the PR body and the report.

**Verification**: noted in LEARNINGS and the PR description; John to look at the log after a leak test only if he runs one.

---

### Risk 7: A longer TTS wait slows every announcement (LOW)

**Problem**: `len/14 + 3` replaces `len/17 + 1`. A 100-character message goes from 7 s to 11 s of engine hold time, so queued bursts (morning brief plus reminders) take longer to drain. That's the accepted trade (open decision 11).

**Mitigation**: none needed beyond documenting. The formula is tested at 0, 75 and 200 characters so the clipping fix can't regress to the old estimate. The existing `int(1)` fallback becomes `int(3)`.

**Verification**: formula test against both the old and new numbers (the 75-character alarm message must wait at least 9 s, not 6 s).

---

### Risk 8: Package basenames collide under `!include_dir_named` (MEDIUM)

**Problem**: `packages/` is loaded by basename across the whole tree. A new file named like an existing one silently replaces it (see the 2026-10 loading-gotchas memory). Three new files are planned in `packages/security/emergency/`.

**Mitigation**: unique `emergency_*` basenames, checked by grep before creating them (none exist). Filename equals automation id per repo rules.

**Verification**: `tests/test_duplicates.py` / `test_naming.py` run in the full suite; a new test asserts the three basenames are unique across `packages/`.

---

### Risk 9: Docs left saying critical goes through the queue (MEDIUM)

**Problem**: At least these statements become false: `packages/announcements/CLAUDE.md` (call hierarchy, priority table "clears all other queued messages", queue conditions), `packages/announcements/README.md` ("Any critical messages will wipe the queue"), `docs/ANNOUNCEMENTS.md` (diagram, critical section "clears the queue", "When a critical message is enqueued…"), `packages/security/CLAUDE.md` and `packages/security/LEARNINGS.md` ("critical_announcement is still queue-gated").

**Mitigation**: update all of them in the same PR (decision write-back: grep every statement of the old rule). `/wrap` greps the entities touched.

**Verification**: grep for `queue-gated`, `still goes through`, `wipe the queue`, `Clears the queue` returns no stale hits.

---

### Risk 10: Static tests only; nothing can be exercised live (MEDIUM)

**Problem**: There's no way to run the alert path safely (Noonlight dispatches real services). PR 1 touches only audio, but the behaviour (deferral, direct playback overnight) isn't covered by a live test until John runs one.

**Mitigation**: John's safe test is documented: turn on `input_boolean.emergency_mode`, ring a test chime or enqueue a low message and confirm it is held, then call `script.critical_announcement` with a test message and confirm it plays. None of that touches the alarm, Noonlight or sirens. Tests render every template with real Jinja2.

**Verification**: the test recipe appears in the PR body and the report. No alarm, panic, fire or Noonlight entity is called by anything in this build.

---

### Risk 11: `critical_announcement` `auto` can resolve to no speakers (LOW, pre-existing)

**Problem**: With `media_players: auto` and no announceable room occupied (leak alert while home), the player list is empty and nobody hears it. This was already true through the queue; the direct path doesn't change it, but it is now a straight silent failure rather than a held message.

**Mitigation**: out of scope for PR 1. Flagged in the report as a backlog candidate (fall back to `all` when `auto` resolves empty). Not changed, to avoid widening the leak behaviour in an audio-gate PR.

**Verification**: noted in LEARNINGS.

---

### Carried forward (PR 2-4, not built in this run)

- PR 2: `general_notification` to `mode: parallel` changes ordering for every push caller; grep callers sending two pushes with one tag. Tornado to `critical_announcement` depends on PR 1's direct path.
- PR 3: Noonlight dispatches real emergency services. Test mode must merge and be visibly on before any end-to-end run. Alarmo `alarm_trigger` from disarmed and code need read-only verification. Panic hardware is down.
- PR 4: polish, optional.

## Summary

Total risks identified: 11 for PR 1 (plus carried-forward notes)
Categories: reimplementation/compat, test complexity, integration, documentation debt, environment/config, rollback safety, scope drift
CRITICAL risks (must address before proceeding): none

Rollback safety: every PR 1 change is config-only and revertable with a git revert plus the same reloads. Deploy order is safe either way because the gate fails open when the new entity doesn't exist yet.

---

## PR 2 refresh (critical delivery), 2026-10-30

- **Parallel mode reorders same-tag pushes (MEDIUM).** Caller audit of every `tag:` in `packages/`: the only cross-script pair is `home-security-alarm` (alarm triggered, then alarm disabled), which is meant to replace the first. Other repeats are exclusive branches. Mitigation: accepted and documented in `packages/security/CLAUDE.md`.
- **Tornado still reaching `append.yaml`'s purge (MEDIUM).** Fixed by calling `critical_announcement` (skips the queue). Severe thunderstorm warning and extreme heat warning remain queue-path criticals and still purge; hazardous air unchanged by decision 10. Reported to the owner.
- **`max: 25` on a parallel script (LOW).** Over 25 concurrent runs are dropped with a warning; a camera burst would need to exceed that before a critical push is lost.
- No CRITICAL risks. Nothing in PR 2 touches the alert scripts' structure, Noonlight, sirens, alarmo or panic.
