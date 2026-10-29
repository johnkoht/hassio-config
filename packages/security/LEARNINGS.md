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

## critical_announcement is still queue-gated

It enqueues at `critical` priority. `announcements/queue/processor.yaml`
holds the whole queue while `house_occupied` is off or quiet mode is on
before 9am, and critical messages are held too. Never rely on TTS alone
for an emergency.

## Snapshot the leaf lights, not the light group

`scene.create` with `snapshot_entities: light.<group>` saves the group's
single state, which is "on" if any member is on, so the restore turns every
member on. Snapshot `expand('light.<group>')` instead (2026-10-29).

## Dead entity IDs fail silently

A state trigger on a nonexistent entity never errors, it just never fires. `door_left_open` watched `front_door_status` and the porch detections watched `backyard_porch_camera_*_detected` (live: `front_door`, `backyard_porch_*_detected`). Copy IDs from the working sibling camera and check them against the registry.

## Event triggers have no `trigger.from_state`

`door_left_open` also fires on a `timer.finished` event (the re-alert after a snooze). Its messages used `trigger.from_state`, so the run errored and the re-alert never spoke or pushed. They now name the open doors from the `open_doors` variable. Templates shared across state and event triggers can't use `from_state` (2026-10-29).
