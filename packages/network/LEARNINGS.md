# LEARNINGS — packages/network/

## Kids WiFi snooze (JK-1261)

**Store the shutoff as a datetime, not a timer.** A `restore: true` timer that expired while HA was down fires `timer.finished` during startup, before automations attach their triggers, so a snooze end would be lost. The snooze is `kids_wifi_off_at` (an `input_datetime`), written as scheduled time + 15/30, with a start-up catch-up. Other restore timers in the repo share the gap (BACKLOG).

**A time trigger on a datetime helper fires when `now >= value`.** Never gate that automation on `now < off_at`. The skip rule on the original shutoff (`off_at > scheduled and now < off_at`) and the gate on the snooze path (`off_at > scheduled`) are different on purpose; tests render both at the boundary.

**Warning time is a timestamp sensor** (off time minus 10 min) rather than `offset:` on the helper; availability guards an unset helper.

**The spoken warning rides `script.voice_announcement`'s gates** (06:00-23:00, `speech_notifications`, `bedtime`). The push is not gated. The voice step has one flag (`voice_warning_enabled`) in `kids_wifi_off_warning.yaml`.
