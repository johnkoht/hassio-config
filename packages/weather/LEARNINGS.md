# LEARNINGS — packages/weather/

- **`tempest_high_uv_alert` templates are still broken.** They call `state_attr('sensor.tempest_uv_index')` with one argument; the UV value is the state, so use `states(...) | float(0)`. The trigger was fixed to the live entity, so the action will now error when it fires.
