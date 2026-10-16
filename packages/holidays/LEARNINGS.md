# LEARNINGS — packages/holidays

- **Z-Wave re-inclusion renames plugs (2026-10-15).** Moving the front yard plugs to the ZWA-2 dropped the `_1` suffix (`switch.front_door_smart_plug_1` → `switch.front_door_smart_plug`). A multi-entity `state` condition needs *every* entity to match, so one dead ID silently blocked the Halloween automations all season. Use any-on/any-off template conditions, and check live IDs after any controller migration.
- **The front yard Hue power plugs stay out of automations.** `switch.front_yard_outdoor_front_left_hue_lights` (+ `_2`) power the Hue spots and must stay on; the spots are driven by `outdoor_lighting.yaml` and `halloween_hue_scene.yaml`.
- **Plug IDs live only in `front_yard_holiday_decorations.yaml`.** Halloween and Christmas target `switch.front_yard_holiday_decorations`; fix a rename there, nowhere else.
