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

## Resume when leaving a labelled zone (JK-1194)

`climate_resume_when_leaving_labelled_zone` resumes the Nests when an adult
leaves a zone carrying the `climate_trigger` label, with the house empty.

- `trigger: zone` takes fixed entity ids and can't follow a label. The
  automation triggers on the persons' state and reads
  `label_entities('climate_trigger')` in a condition, so a newly labelled zone
  works with no YAML edit. Only UI-created zones can take a label.
- A person's state is the zone's friendly name, so the condition compares
  names. `not_to` on the trigger makes it ignore GPS attribute updates, which
  would otherwise reset the 3-minute `for:`.
- It only helps once a floor is in Eco (Eco starts after 30 minutes empty). A
  leave before that does nothing, and a resume between minute 30 and 60 can be
  re-Eco'd by the 60-minute trigger of `*_climate_to_eco`.
- After the smart-climate migration this trigger becomes an input to
  `smart/modes/climate_mode_resolve.yaml` (an "arrival expected" signal) and
  this automation goes away.
