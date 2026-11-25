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

## Smart climate controller: thermostat write behaviour (2026-11-24)

- **Nest state arrives only via Pub/Sub, in a fresh context.** The SDM
  integration writes no optimistic state, so the context can't tell HA's
  writes from a person's. Override detection compares values instead and
  allows a 180 s grace after HA's own write.
- **Nest `set_temperature` applies to the current mode.** Wait for the mode to
  change before setting the temperature.
- **Ecobee writes state in the caller's context, then polls every 180 s** with a
  fresh one. `preset_mode: temp` means a hold is active; it's not a preset to
  set. The hold ending is the "hold ended" rule in override detection.
- **Numeric template sensors must render `none`**, not the string `'unknown'`;
  the string logs an error on every render.
- **Macros in `custom_templates/` need `homeassistant.reload_custom_templates`
  before `template.reload`**, or the sensors keep the old macro.
- **A boolean macro must render exactly `True` or `False` (2026-11-24).** A
  macro's output is a string; HA's native parsing turns only `True`/`False`
  into a bool. Lowercase or padded output stays a non-empty string, so
  `{{ not live }}` would go False and a dry-run zone would write. In Jinja,
  compare it as a string (`climate_live(z) == 'True'`). Scripts and automations
  that import a custom template also need `reload_custom_templates` first.
