# LEARNINGS — packages/security/

## Alert scripts are one `parallel:` block (JK-1165)

`security_alarm_alert` and `fire_alarm_alert` run every action as its own
branch of a single `parallel:` block. Cloud calls (Noonlight, Nest) get
`continue_on_error: true`. Don't put anything in sequence ahead of the
sirens or the announcement.

`continue_on_error` only swallows `HomeAssistantError`. A timeout still
raises, but HA's parallel step (`asyncio.gather(return_exceptions=True)`
in `helpers/script.py`) lets every sibling branch finish first, so it
can't cancel the sirens. It only marks the run as errored.

The fire trigger is `binary_sensor.smoke_detector` (Vivint). It used to
point at a nonexistent `_2` entity, so it could never fire.

## critical_announcement skips the queue (JK-1149)

Since the emergency-mode work (2026-10-30) it starts the engine directly, so `house_occupied` and quiet-before-9am no longer hold a fire or alarm voice message; before that, an overnight fire produced no voice until 9 am. It still relies on Sonos being reachable, so never rely on TTS alone for an emergency.

## Snapshot the leaf lights, not the light group

`scene.create` with `snapshot_entities: light.<group>` saves the group's
single state, which is "on" if any member is on, so the restore turns every
member on. Snapshot `expand('light.<group>')` instead (2026-10-29).

## Dead entity IDs fail silently

A state trigger on a nonexistent entity never errors, it just never fires. `door_left_open` watched `front_door_status` and the porch detections watched `backyard_porch_camera_*_detected` (live: `front_door`, `backyard_porch_*_detected`). Copy IDs from the working sibling camera and check them against the registry.

## Event triggers have no `trigger.from_state`

`door_left_open` also fires on a `timer.finished` event (the re-alert after a snooze). Its messages used `trigger.from_state`, so the run errored and the re-alert never spoke or pushed. They now name the open doors from the `open_doors` variable. Templates shared across state and event triggers can't use `from_state` (2026-10-29).

## Camera alerts mute on activity, not a clock

`camera_notifications_deactivate` used to mute alerts at sunrise+15 and after
30 min in Auto, so a quiet morning with nobody outside had no camera alerts.
Since 2026-10-29 (JK-1123) only an exterior door, the garage, an arrival or
the house becoming occupied mutes them; the activate side (Away, sunset, 22:00,
bedtime, doors closed 45 min) is unchanged. Both flip pushes are `passive`.

## Critical pushes bypass the notification level (JK-1149, PR 2)

`general_notification` used to stop at `notification_level == None` before it read the priority, and was `mode: queued` (max 10), so a camera burst could push the alarm out. Critical now always passes and the script is `mode: parallel` (max 25). The fire push goes to `all`. Same-tag pushes can now race (see `packages/security/CLAUDE.md`). Caller audit (2026-10-30): the only same-tag pair across scripts is `home-security-alarm` (alarm triggered, then alarm disabled), which is meant to replace the first.

## Alarm lifecycle (JK-1149, PR 3)

**Gate on `state`, not a template.** The Noonlight branch is `if: state alarm_test_mode on` / `then: log` / `else: dispatch`. A state condition on a missing or unavailable helper is false and never raises, so the dispatch runs. A template condition that errors would be treated as false and could skip the dispatch.

**Noonlight sends police only.** The switch always requests `police`, even for the fire branch; the `noonlight.create_alarm` service can request `fire`. Left as is (decision 8 said "Noonlight on fire", not which service); the dispatcher decides after calling. Noonlight cancel isn't in the component.

**Alarmo leaves `triggered` for an armed state when the trigger time ends** (`disarm_after_trigger` is off), so `security_alarm_disabled` watches `from: triggered`, not `to: disarmed`. A trigger from `disarmed` ends in `disarmed` (3600 s).

**The panic button hardware is dead (JK-1230).** The alarmo path is verified statically and by reading alarmo's source only.

## Lights, sirens and panic (JK-1149, PR 4)

**Intruder keeps the lights on; fire restores.** `alarm_flash_lights` takes `keep_lights_on` (intruder passes true); with it the final restore is skipped, the 10 toggles end with the lights on, and `security_alarm_disabled` restores the snapshot (`scene.turn_on`, `continue_on_error`: the scene is runtime-only and is gone after a restart). The fire path and tests restore at the end of the flash.

**Fire sirens need their own off path.** `security_alarm_disabled` only runs on an alarmo exit from `triggered`, which fire never causes, so `fire_alarm_cleared` turns the sirens off a minute after the smoke detector reads `off` (also from `unavailable`; skipped while alarmo is triggered). The reverse is guarded too: disarming the intruder alarm leaves the sirens on while smoke is still detected. Alarm test mode does not silence the sirens, only Noonlight.

**Fall back on anything unknown.** Panic takes the alarmo path only in a known-good alarmo state, because a state condition on a missing entity is false and would otherwise skip the alert. The engine clamp tests NaN explicitly (`float('nan')` parses, and `min`/`max` with NaN are order-dependent).
