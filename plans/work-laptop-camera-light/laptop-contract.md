# Work laptop contract: camera light

Keep writing `input_boolean.john_dnd` exactly as today. Add two booleans, written with the same token and base URL.

| Entity | On | Off |
|---|---|---|
| `input_boolean.john_work_laptop_camera` | any camera is active (the mic alone doesn't count) | camera stops |
| `input_boolean.john_work_laptop_docked` | dock or external display connected | dock/display disconnected |

- Write on every change of either signal, not only during calls.
- On sleep, shutdown and script exit: turn both off.
- On wake and script start: re-send both current states (HA keeps the last value, so a missed off sticks).
- HA is deployed first. If a call fails, log it and keep running; never crash the script.

```
POST <HA base URL>/api/services/input_boolean/turn_on     (or turn_off)
Authorization: Bearer <existing token>
Content-Type: application/json

{"entity_id": "input_boolean.john_work_laptop_camera"}
```
