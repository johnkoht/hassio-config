# LEARNINGS — dashboards

## Loading and validation

- **kohbo is `mode: yaml` and caches on the root file's mtime only (2026-10-16).** HA re-reads the dashboard only when `kohbo/kohbo.yaml` itself changes, so a deploy that touches only included pages stays stale however often you refresh. `deploy.sh` touches `kohbo.yaml` after every pull (#45); by hand: `touch /config/dashboards/kohbo/kohbo.yaml` on the host.
- **No tests cover Lovelace YAML (2026-10-15).** `tests/` only scans `packages/` and HA's config check ignores dashboards. Before deploy: resolve every `!include`, check decluttering `variables` keys against the template's `[[...]]` tokens, and check entities against a live state dump.
- **Register new pages in `kohbo/kohbo.yaml` `views:`**, or the route doesn't exist. **Never leave a view include empty (holidays, 2026-10-16):** HA loads a 0-byte include as `{}`, so the view has no path and only exists at its numeric index (`/dashboard-kohbo/42`); links to the path it was meant to have are dead.
- **Whole-card includes go under `templates/includes/`, not `button_cards/` (device health, 2026-10-16).** `button_cards/` is loaded with `!include_dir_merge_named`, so a card file there (`kohbo_security_overview.yaml`) turns its `type:` and `cards:` keys into two junk button-card templates. `includes/sensors/device_health_overview.yaml` is the right shape.
- **The frontend never sees `last_reported` (sensors, 2026-10-16).** HA's compressed state feed sends only `lc` and `lu`, and reloads bump `last_updated` on everything, so "offline since" reads `last_changed`.

## Camera streams go through HA, not go2rtc direct (2026-10-30)

- `camera_card` and `camera_popup` use `advanced-camera-card` with `camera_entity` + `live_provider: ha` (HA's built-in go2rtc/WebRTC). The old `live_provider: go2rtc` pointed at the Frigate host's go2rtc by LAN IP; that port was moved to loopback for security, and plain http to a LAN IP is mixed content on the https Nabu Casa URL anyway, so every stream broke. Never point a card at a LAN go2rtc, and don't ask to reopen the port.
- The entities are UniFi Protect's (the unsuffixed `camera.*` are Frigate's; the porch's Protect entity is `camera.g5_turret_ultra_high_resolution_channel`). With a Protect entity the card has no Frigate engine, so the popup's event thumbnails were removed; events are in the Protect app. Grid and popup both use the high-resolution channel; `lazy_load` keeps off-screen cards idle.
- Callers pass `camera_entity` (a UniFi Protect high-channel camera), not a `stream_id`. Unsuffixed `camera.front_door` etc. are the Frigate integration's. `tests/test_dashboard_camera_streams.py` guards both.

## Room pages

- **`room_card`'s `room:` is an HA area_id** (compared to `sensor.<person>_room_presence`). A room with no HA area of its own (mudroom bathroom) gets a value that never matches, rather than the parent area's id, which would show that area's people.
- **`kohbo_device_door_entity` handles groups and single sensors.** It counts open members from the group's `entity_id` attribute and falls back to the entity itself; until 2026-10-15 single sensors always read "Closed".
- **Small bathrooms (2026-10-16).** Rooms with no temperature or air sensors omit the climate card rather than leaving `climate_overview` slots empty or graphing an unavailable sensor. The Mudroom Bathroom and Powder Room pages stay separate: they differ in shape (brightness feature, toggle count, Sensors section), and decluttering-card can't drop list items, so a shared template would only wrap existing ones. Extract one if a third small bathroom page arrives.

## Plants

- **An Ecowitt WH51 that stops reporting holds its last value, often `0`, instead of going unavailable (2026-10-16).** Detect a dead channel by value: the plant cards show the graph on `numeric_state above: 0` and the Offline tile on `not` of that same condition, so the two are exact complements.
- **`kohbo_apexcharts_transparent.yaml` has one consumer (Lawn vs Rain, 2026-10-16).** It's a documented exception to "two uses = a template": it keeps inline `style:` out of the new view. The older apexcharts cards (`air_quality.yaml`) still carry the same block inline; switch them over when they're next edited.

## Sensors and auto-entities

- **auto-entities `options` don't apply to `filter.template` output (2026-10-16).** Template items are used as-is, so emit full row objects (`entity`, `type`, `template`) through `| tojson`. Keep JSON `true`/`false`/`null` out of them: HA parses template results with `literal_eval`, which rejects those and hands auto-entities a string that it splits on whitespace. Use `1`/`0`.
- **Group membership reads the `entity_id` attribute (2026-10-16; updated 2026-10-17).** auto-entities' `group:` filter and `expand()` both read it. Before HA 2026.7, `platform: group` entities didn't publish it, so these groups were built old-style. On 2026.7.4 they do (`cover.garage_doors`, `binary_sensor.leak_sensors` both expand), so either style works now. The Sensors page groups (`packages/system/sensor_health/key_sensor_groups.yaml`) were derived from `kohbo/rooms/**`, one entity per device: when you add a sensor to a room page, add it to the matching group too, or the Sensors page won't see it go offline.
- **Prefer a device label to a hand-kept group for "every X" membership (zigbee routers, 2026-10-16).** The 19-plug group had drifted to under a third of the 65 routers. `label_devices()` + `device_entities()` picks it up from the registry, but templates have no entity_category, so the primary entity is chosen by domain order plus a config-name skip list. Gotchas: `device_entities()` omits disabled entities; `area_name(device_id)` raises (AssertionError) on a device whose area was deleted, so resolve `device_attr(d, 'area_id')` first; label changes fire no state event, so scan on a time trigger.

## NUT UPS status is compound

`sensor.apc_ups_status` is human-readable and compound ("Online Charging" after
an outage), so don't colour on `=== 'Online'`. Split `sensor.apc_ups_status_data`
on spaces and look for `OL` (plus no `RB`/`OVER`/`BYPASS`), as the UPS
automations do. Sensors page Power section, 2026-10-29.

## Manual Override rows (2026-10-30)

- Each migrated room's page has a `Manual Override` entity row (`<room>_lights_manually_toggled`) under its `Lighting Automations` row. The latter is hand-only now; the former is set by a hand change to the lights and cleared by tapping it or by the room's reset automation. Garage and laundry have no such row on their pages, so they have none. The new latches only exist after an input_boolean reload.
- The mudroom page had no lighting rows, so it got both `Lighting Automations` (`mudroom_lighting_automations`) and `Manual Override` at the top of Quick Settings (PR 6). Its hand flag is created off by HA; the deploy turns it on once.


## Medication Supply rows (2026-10-30)

- The Nino popup shows days, never doses. The stock helper is not on the dashboard; "Days left" reads "Not set" while the sensor is `unavailable`. "Add days to supply" and "Set days left" are `template-entity-row`s with a `perform-action` tap that call the scripts with no `days`, so the scripts read "Days to enter" themselves. The tap_action on a template-entity-row was copied from other cards and is untested live: check it after deploy.

## Push notification links (2026-10-30)

- A push opens `/dashboard-kohbo/<view path>` or `<view path>#<popup hash>`. The hash only opens if that view's include tree defines the popup, so renaming a view `path:` or moving a popup breaks links in `packages/`. `tests/test_notification_deep_links.py` builds the view and popup map from `kohbo.yaml` and fails on any declared link that no longer resolves. Run it after dashboard changes.
- A new push with no `url` fails the same test unless its file is in `tests/fixtures/notification_url_exempt.yaml`. Add a link first; exempt only when there is no screen to open, and give the reason. The test also fails on an exempt entry that has since gained a link.
