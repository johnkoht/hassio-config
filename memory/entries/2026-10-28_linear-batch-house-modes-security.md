# Linear batch: house modes, room-off, security (#71–#73)

**What:** a triage pass over JK-1118, the room-off cluster (JK-1219/1145/1102/1002/1085) and the security alerts (JK-1165/1149/1179/1137/1123). Three hotfixes shipped and four plans were drafted.
- #71: `bedtime_mode_on` triggers on the per-person in-bed booleans. The aggregates (`everybody_in_bed`, `adults_in_bed`) are only conditions now.
- #72: the fire alarm watched `binary_sensor.smoke_detector_2`, which doesn't exist, so it never fired. Both alert scripts are now a single `parallel:` block, and the cloud calls (Noonlight, Nest) can't delay the sirens or the TTS.
- #73: `kitchen_mode_off` resets the kitchen lighting flag. `kitchen_not_occupied` can't do it once Off has forced occupancy off.
- Draft plans: `house-mode-resolver`, `room-lighting-override`, `emergency-mode` and `service-mode`.

**Learning:**
- **Missing entities.** This is the second dead safety automation found watching a nonexistent entity (after the away leak alert, #57). Renames break triggers silently, and a dead trigger leaves no trace. The tell is `last_triggered: None`.
- **Home-filtered aggregates.** Sensors that only count people who are home flip on a departure. Use them as conditions, never as triggers for a mode change.
- **Critical TTS.** It's still held by the queue processor while quiet mode is on before 9am, which covers any night when someone's in bed. Don't rely on TTS alone for an emergency until `emergency-mode` ships.
- **Noonlight.** Turning `switch.noonlight_alarm` off doesn't cancel a dispatch. Never run `security_alarm_alert` end to end as a test.
- **Vivint.** It still supplies the only smoke detector and both basement motion sensors, so it can't be removed yet (JK-1137).
