# 2026-10-30 · john-dnd-simplify

- John's DnD now comes from one template sensor, `binary_sensor.john_dnd_active`: the manual or work-laptop boolean `input_boolean.john_dnd`, OR the personal Mac's camera or mic.
- The work laptop writes `john_dnd` itself over the REST API. Nothing in the repo writes it, so don't add an automation that does: it would clobber a manual DnD.
- The old laptop sensors read a retired Mac and had been dead since the swap. When a device is replaced, grep the old device slug.
- Calendar DnD is gone. Calendar focus mode is separate and stays.
