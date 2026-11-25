# jk-999-laundry-price-nightlight — 2026-11-24

**Metrics:** lite ship, one automation, one helper, 5 new tests; full suite 2374 passed, 9 skipped. Shipped as a PR.

**What shipped:**
- `laundry_room_nightlight_price_color` recolours `light.laundry_room_nightlight` by `sensor.energy_price_tier`: green, blue, orange, red; purple when prices are negative. 15% brightness, 5% at Bedtime.
- It runs only while the nightlight is already on, the main lights are off, the room is Auto and the new hand-only toggle `input_boolean.laundry_room_price_nightlight` is on.

**Learnings:**
- "Current hour average" price updates every 5 minutes, so the tier flaps; a 10 minute `for:` on the tier and negative triggers is the debounce.
- `energy_price_tier` uses `float(0)`, so an unavailable price reads `low` (green). Gate on the price being a number.
- The tier's `color` attribute is CSS variables for the dashboard; a bulb needs its own RGB map.

**Follow-ups (BACKLOG):**
- Fix the `float(0)` green-on-unavailable in the tier sensor itself.
- Optional: turn the nightlight on automatically when dark (not built; John chose recolour-only).
