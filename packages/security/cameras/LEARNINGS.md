# LEARNINGS — packages/security/cameras/

## Grepping for a notify service by its slug finds nothing

`notify.security_detection_display_devices` is defined in
`detection_notifications/security_detection_notify_group.yaml`, but that
string appears nowhere in the file. The group declares:

```yaml
notify:
  - platform: group
    name: "Security Detection Display Devices"
```

HA slugifies `name:` into the service ID. So `grep -r
"security_detection_display_devices"` returns only the *callers*, never the
definition — which reads exactly like an undefined service.

Search the friendly name (`-i "security detection display"`) or grep for
`platform: group` under `notify:`. Same trap applies to ZHA light groups
(entity_id comes from `name:`, not `unique_id:`) and to any template entity
without an explicit `default_entity_id:`.

Note also that `notify:` blocks live in packages here, not only in the
top-level `notify.yaml` — HA merges every top-level `notify:` key across
packages. `notify.yaml` is not the complete list of notify targets.

## The doorbell ring is an event entity, not a binary_sensor

UniFi Protect (HA 2026.7.4 / uiprotect 15.4.3) reports G4 Doorbell Pro rings on
`event.front_door_camera_doorbell`. `binary_sensor.front_door_camera_doorbell`
still exists and still shows as enabled, but stopped receiving state around
2026-09-08 — with no repair issue and no deprecation warning. It fails silently.

Trigger on the event entity's **state** (the ring timestamp, which changes every
ring), never on `attribute: event_type`. `event_types` is `["ring"]` — a single
value — so an attribute trigger matches once and never fires again.

## camera_proxy_* entities are absent from the entity registry by design

The `platform: proxy` cameras in `detections/*/*_proxy.yaml` have no
`unique_id`, so they never appear in `.storage/core.entity_registry` and never
restore state. Absence there proves nothing — check the live state machine.
Their object_id is `camera_proxy_` + the slugified *full source entity_id*,
hence the doubled `camera_`: `camera.camera_proxy_camera_front_door_camera_high_resolution_channel`.

The platform does not error on a missing source entity — it sits at `idle`
forever and logs nothing. As of 2026-09-10 the backyard porch proxy sources
`camera.backyard_porch_camera_high_resolution_channel`, which does not exist
(the real entity is `camera.backyard_porch`), so that proxy is silently dead.
