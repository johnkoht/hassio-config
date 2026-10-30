# LEARNINGS — packages/weather/

- **`tempest_high_uv_alert` is dead and broken, left for John.** It triggers on the nonexistent `sensor.tempest_uv` (live: `sensor.tempest_uv_index`), and its templates call `state_attr(...)` with one argument (the UV value is the state: `states(...) | float(0)`). Reviving it is a product call: three overlapping thresholds announce house-wide, up to `critical` above UV 10.

## Tornado warning uses critical_announcement (JK-1149, PR 2)

The tornado branch of `severe_weather_warning` calls `script.critical_announcement` (all speakers, skips the queue) instead of `voice_announcement` at `critical` priority, which was silent overnight (speech_notifications, the 06:00-23:00 window, bedtime) and went through `append.yaml`'s critical purge. The severe thunderstorm and extreme heat warnings are still `voice_announcement` + `critical`, so they still take that path; hazardous air (`air_quality_alert`) is deliberately unchanged.
