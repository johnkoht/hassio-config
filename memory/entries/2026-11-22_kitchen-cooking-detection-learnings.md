# kitchen-cooking-detection — 2026-11-22

**Metrics:** 6 tasks, 22 new tests (sabotage-checked), full suite 2016 passed.

**What shipped:**
- `binary_sensor.kitchen_cooking`: a kitchen PM2.5 jump of at least 8 over its 15-minute low, with the kitchen occupied, `delay_on` 3 min and `delay_off` 30 min.
- A close-the-kids'-doors announcement, with one repeat.
- `input_boolean.cooking_air_purge`: kids' purifiers at 100% until Bedtime, applied inside the shared purifier script.

**Worked:**
- Calibrating against recorder history before writing any YAML. It showed CO2 adds nothing and that a 3-minute hold-on drops the one-reading spikes.
- Putting the purge in the shared script rather than in a separate automation, so the rooms' own AQ runs can't overwrite it.

**Gotchas:**
- The HA history API needs `end_time`, or it returns 1 day.
- A statistics sensor needs `sampling_size` above the default 20 to hold a 15-minute window of Awair readings.

**Follow-ups:**
- Check the first few real cooking events, with the logbook for `binary_sensor.kitchen_cooking`.
- Nino's purifier is broken, so the purge only helps his room after the replacement (or the playroom unit) takes over `fan.ninos_bedroom_air_purifier`.
