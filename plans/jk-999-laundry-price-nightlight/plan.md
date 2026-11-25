---
title: Laundry nightlight shows the energy price
slug: jk-999-laundry-price-nightlight
status: shipped
created: 2026-11-23
linear: JK-999
has_pre_mortem: false
has_review: false
has_prd: false
---

# Laundry nightlight shows the energy price

## Problem

`light.laundry_room_nightlight` is a plain nightlight. Nothing in this repo references it, so it is off or on by hand. The ComEd price is already tiered in `sensor.energy_price_tier`, but you only see it on the energy dashboard.

## Goal

When the nightlight is on, its colour tells you the current electricity price at a glance: green cheap, blue normal, orange high, red very high.

## Findings

- The light is Zigbee, `color_temp` and `xy`. It was off on 11-23. No automation in the repo (package, `automations.yaml`, dashboards) touches it.
- `sensor.energy_price_tier` (low <=3c, normal <=6c, high <=10c, else very_high) is built from `sensor.comed_current_hour_average_price`. Its `color` attribute is CSS variables for the dashboard and is unusable for a bulb, so the mapping lives in the new automation.
- Despite the name, the "hour average" price moves every 5 minutes. On 11-23 the tier went normal, high, very_high, high, normal inside 15 minutes. Over three days about a third of tier dwells were 5 minutes. So the tier flaps and needs a debounce.
- Gotcha: the tier template uses `float(0)`, so an unavailable price renders as `low` (green). The automation must ignore unknown or unavailable states of the tier and of the price sensor.
- `binary_sensor.energy_prices_are_negative` is `sensor.energy_price < 0` (hour average, so rare).
- Room gates already in place: `input_boolean.lighting_automations`, `input_boolean.laundry_room_lighting_automations`, `input_select.laundry_room` (Auto/Off), `input_boolean.laundry_room_lights_manually_toggled`. Those gate the main lights and the nightlight should respect the same flags.
- `input_boolean.dark_outside` exists (`packages/dark_outside.yaml`). House mode is `input_select.house` (Auto, Away, Vacation, Bedtime, Quiet, Entertainment).

## Approach

New files in `packages/laundry/lights/` plus one helper file. One automation per file.

1. **Helper** `packages/laundry/laundry_room_price_nightlight.yaml`: `input_boolean.laundry_room_price_nightlight` (feature toggle, hand-only, no `initial:`, per JK-1262).
2. **`laundry_room_nightlight_price_color`**: trigger on `sensor.energy_price_tier` change (to a real tier) with `for: 00:10:00`, and on `binary_sensor.energy_prices_are_negative` (for 10 min) and on the nightlight's own `off` to `on` so it picks up the right colour when it is switched on by hand. Action: `light.turn_on` with `rgb_color` from a tier map and low `brightness_pct`. Only runs while the nightlight is already on (see open question 1).
3. **`laundry_room_nightlight_price_off`** (only if John wants it automated, question 1): turn the nightlight off when the main lights come on, or the room goes Off.

Conditions, global to room to feature: `lighting_automations` on, house occupied, house mode not Away/Vacation, `laundry_room_lighting_automations` on, `laundry_room` is Auto, feature toggle on, tier valid, `light.laundry_room_main_lights` off (the room light wins).

Tier map (RGB, tuned on the bulb after build):

| Tier | Colour | rgb_color |
|---|---|---|
| low | green | 0, 200, 60 |
| normal | blue | 40, 100, 255 |
| high | orange | 255, 120, 0 |
| very_high | red | 255, 20, 20 |
| negative (optional) | purple | 160, 40, 255 |

Brightness 15% by default. Use `rgb_color`, not `color_name`, so the xy path is used. If the bulb is in `color_temp` mode HA converts; verified in the live test.

## Tests

`tests/test_laundry_price_nightlight.py`, in the style of `test_work_laptop_camera_light.py`:
- helper exists, has no `initial`, one definition in the repo;
- the automation triggers on the tier with `for` >= 10 min, ignores unknown/unavailable, and the tier map has all four tiers with RGB lists (none a CSS variable);
- condition order and presence of the room, house and toggle gates, and the main-lights-off gate;
- no fixed clock times.
Run: `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`.

## Docs

`packages/laundry/LEARNINGS.md` (tier flapping, float(0) green trap) and a line in the laundry docs if one lists the room's automations.

## Out of scope

Changing `sensor.energy_price_tier` itself (dashboard reads it), the main lights, other rooms' nightlights.

## Risks

- Flapping colours at the hour boundary: handled by `for:` 10 min; a 5-minute dwell is dropped. Cost is up to 10 min of lag.
- Unavailable price shows green: guarded.
- Another thing (Zigbee scene, Hue-style app, a wall switch) turning the bulb on in a different colour: our colour is applied on the next tier change or when the bulb turns on.
- Deploy is `--reload` of automations plus input_boolean (helper needs a Template/helper reload or restart; John restarts HA).

## Open questions for John

1. Who turns the nightlight on and off today? Recommended default: the automation only recolours it when it is on (you or a wall switch turn it on); the colour is applied the moment it turns on. Alternative: also turn it on automatically when dark and the house is occupied, and off at Bedtime or when the main lights come on.
2. Bedtime: leave it on at the price colour, dim it, or off? Recommend dim to 5%.
3. Add purple for negative prices? Recommend yes.
4. Debounce: 10 minutes. OK, or shorter (5)?
5. Colours: green, blue, orange, red okay?
