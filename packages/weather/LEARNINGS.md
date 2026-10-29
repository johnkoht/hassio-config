# LEARNINGS — packages/weather/

- **`tempest_high_uv_alert` is dead and broken, left for John.** It triggers on the nonexistent `sensor.tempest_uv` (live: `sensor.tempest_uv_index`), and its templates call `state_attr(...)` with one argument (the UV value is the state: `states(...) | float(0)`). Reviving it is a product call: three overlapping thresholds announce house-wide, up to `critical` above UV 10.
