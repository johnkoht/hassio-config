# 2026-10-30 · protect-detection-watchdog

- `binary_sensor.protect_detections_stale` is on when no camera motion sensor has changed in 6 h. `protect_detection_watchdog` reloads Protect once per 6 h, waits up to an hour, then pushes: passive if motion came back, time-sensitive if not.
- The plan said 3 h; the recorder showed quiet nights up to 4.5 h, so it shipped at 6 h with a 60 min wait. Check normal gaps in the recorder before picking a silence threshold.
- A Protect reload takes sensors unavailable then back. The wait ignores those transitions (`not_from`/`not_to`), or the reload would count as recovery.
- The garage evening auto-lock and flood-light off fire on that unavailable->off, and were left unguarded: they re-check every condition, and a guard would strand a door after a stuck-on freeze.
- Restored sensors start fresh, so the stale sensor is blind for 6 h after an HA restart.
- Follow-up: the 19:30 evening lock still has no outdoor guard (existing backlog).
