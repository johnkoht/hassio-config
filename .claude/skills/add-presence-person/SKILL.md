---
name: add-presence-person
description: Add a new person (or device) to Bermuda BLE room-presence tracking. Scaffolds the per-person room_presence wrapper sensor, wires it into the presence groups, and validates. Use when a person's BLE device has been IRK-enrolled in Private BLE Device and you want their room presence to drive room occupancy/automations.
---

# Add a Bermuda room-presence person

Scaffolds everything needed to bring one person's Bermuda BLE presence into the config.
Because presence is **area-native (Option B)**, adding a person requires NO room-side
changes — the new person just flows into the existing per-room filters (which match on HA
`area_id`). This is: one wrapper sensor + two group memberships + a person attribute.

## Architecture recap (so the scaffold is correct)

- Bermuda emits per-DEVICE `sensor.<device>_area` (state = HA Area friendly name, e.g.
  "Office") once the device is IRK-enrolled in the **Private BLE Device** integration.
- We wrap that into a stable per-PERSON `sensor.<slug>_room_presence` whose state is the
  **area_id** (e.g. `office`) or `not_home`. Downstream (~room occupancy, people lists,
  bayesians) reads this via `group.room_presence_devices` and `group.people_sensors`.
- Keeping the per-person wrapper (vs. using the raw Bermuda entity) buys: away→`not_home`
  normalization, multi-device-per-person merge, insulation from device renames, and
  area_id normalization. See `plans/espresense-to-bermuda-migration.md`.

## Step 0 — PREREQUISITE: device must be IRK-enrolled (manual, do first)

Bermuda can only track a phone/watch if it's enrolled in HA's **Private BLE Device**
integration with its IRK. Verify BEFORE scaffolding:

1. Capture the device's IRK (macOS Keychain with the same iCloud account, or an ESP32
   "IRK capture" flash).
2. HA → Settings → Devices & Services → Add Integration → **Private BLE Device** → paste
   the IRK. The device must be on/broadcasting in range to validate.
3. Confirm Bermuda then created `sensor.<device>_area` and
   `device_tracker.<device>_bermuda_tracker`. Check its state resolves to a real area when
   the person is home (not `unknown`).

If these entities don't exist yet, STOP and finish enrollment — do not scaffold.

## Step 1 — Gather inputs (ask the user)

- **slug** — person key, snake_case (e.g. `katia`). Matches `packages/people/<slug>/`.
- **friendly** — display name (e.g. `Katia`).
- **person_entity** — the HA person entity (e.g. `person.katia`).
- **area_sensors** — one or more Bermuda area sensors for this person's device(s), e.g.
  `sensor.katia_s_iphone_area` (add a watch/tablet if they have one). Get exact entity_ids
  from Developer Tools → States (filter `_area`).

To confirm the live area sensor entity_ids and current states, you can query HA (a token +
REST access is documented in `~/code/kohbo-dashboard/CLAUDE.md`); filter `/api/states` for
`_area`. Do not guess entity_ids.

## Step 2 — Create the wrapper sensor

Copy `templates/room_presence.yaml.tmpl` to
`packages/people/<slug>/<slug>_room_presence.yaml` and substitute:
- `{{FRIENDLY}}` → friendly name
- `{{SLUG}}` → slug
- `{{AREA_SENSORS}}` → comma-separated quoted list, e.g. `'sensor.katia_s_iphone_area'`
  (or `'sensor.john_s_iphone_area', 'sensor.john_s_watch_area'` for multi-device)

If an old ESPresense `<slug>_room_presence.yaml` exists (mqtt_room + normalization),
replace its contents entirely with the wrapper — keep the SAME `unique_id`
(`<slug>_room_presence`) so the entity_id and all downstream consumers stay stable.

## Step 3 — Ensure the person sensor exposes room presence

Confirm `packages/people/<slug>/presence/<slug>_person.yaml` exists and its `attributes`
include:
```yaml
room_presence: "{{ states('sensor.<slug>_room_presence') }}"
```
Create the person sensor if missing (mirror an existing one, e.g. `john_person.yaml`).

## Step 4 — Wire into the groups

In `packages/people/people_groups.yaml`:
- add `sensor.<slug>_room_presence` to `group.room_presence_devices`
- add `sensor.<slug>_person` to `group.people_sensors`

## Step 5 — Validate

```bash
ha core check                 # YAML/config valid
ha core reload-core-config    # or restart if template sensors don't hot-reload
```
Then in Developer Tools → States confirm `sensor.<slug>_room_presence`:
- reads a real area_id (e.g. `office`) when the person is home in a proxied room,
- reads `not_home` when away.
Walk the person through 1–2 rooms and confirm the value tracks. If it stays `not_home`
while home, re-check Bermuda proxy coverage / the device's `_area` sensor.

## Notes

- No room files change — that's the payoff of the area-native design.
- If the person's area isn't a proxied room, the wrapper returns `not_home` (expected).
- New HA areas need no map update — `area_id()` resolves them automatically.
