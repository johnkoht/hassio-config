# LEARNINGS — packages/weather/

## Tornado warning uses critical_announcement (JK-1149, PR 2)

The tornado branch of `severe_weather_warning` calls `script.critical_announcement` (all speakers, skips the queue) instead of `voice_announcement` at `critical` priority, which was silent overnight (speech_notifications, the 06:00-23:00 window, bedtime) and went through `append.yaml`'s critical purge. The severe thunderstorm and extreme heat warnings are still `voice_announcement` + `critical`, so they still take that path; hazardous air (`air_quality_alert`) is deliberately unchanged.

## Tempest rain/UV alerts removed (JK-1232)

Both were dead (nonexistent sensors, one-arg `state_attr`) and deleted rather than rewritten. Live station sensors: `sensor.tempest_uv_index`, `sensor.tempest_precipitation`, `sensor.tempest_precipitation_intensity`.
