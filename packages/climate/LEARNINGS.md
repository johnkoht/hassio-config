# LEARNINGS — packages/climate/

## The Nest changes HVAC mode by itself after a preset change

The Nest thermostats (Google SDM `nest` integration) sometimes switch HVAC
mode on their own a few seconds after HA sets `preset_mode` to eco or none,
for example cool to heat. HA only ever calls `climate.set_preset_mode`.

To handle this:
- `*_climate_to_eco` saves the current mode to `input_text.temperature_mode_*`.
  These are UI helpers, not YAML ones, so don't define them in YAML.
- `*_climate_to_resume` restores that saved mode once the Nest settles.
- The restore only runs if the Nest was in Eco when resume started (the
  `was_eco` check). Without that check, the 05:00 morning start would undo a
  mode change made by hand.
- If the Nest flips mode right after going into Eco, nothing corrects it
  until resume runs. A flip that comes minutes later is also not caught.
  (2026-10-13)
