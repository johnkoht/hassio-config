# 2026-10-16 · sensors-dashboard (JK-1224, PRs #47–#50)

**Metrics:** #48 Sensors tabs + `packages/system/sensor_health/` (plan review ITERATE with 5 binding defects, code review APPROVED). #47 Zigbee coordinator alert fix, found while building #48. #49 Device Health score + Safety group + `known_issue` label (code review ITERATE, 1 DEFECT, fixed). #50 label-driven routers + LQI popup (code review APPROVED). Registry changes done live by John: router labels adjusted, 2 dead ZHA devices deleted.

**+ Worked:** rendering templates through `/api/template` and replaying them locally with `literal_eval`, as HA does, before writing them. Sabotage on every new test.
**− Didn't:** #49's first known-issue test was vacuous (it passed with the exclusion removed); sabotage in review caught it. A hand-kept 19-plug router group had drifted to under a third of the real routers before the device label replaced it.

**Gotchas:**
- auto-entities `options` don't apply to `filter.template` output, so emit full row objects. HA parses template results with `literal_eval`, which rejects JSON `true`/`false`/`null` and returns a string auto-entities shreds; use `1`/`0`.
- `label_entities()` / `label_devices()` return `[]` for a label that doesn't exist yet, and label changes fire no state event, so scan on a time trigger. `device_entities()` omits disabled entities.
- `config_entry_attr(..., 'state')` returns a plain string; `.value` rendered empty and made the coordinator alert always true (#47).
- `area_name(device_id)` raises on a device whose area was deleted and breaks the whole render; read `device_attr(d, 'area_id')` first.
- Entity IDs with hardware-ID suffixes (alarm-panel uptime sensors) were dropped and rewritten out of the branch history; rename them to generic IDs before re-adding.
- A recorder `*_rssi` glob would also catch the ESPHome Wi-Fi RSSI sensors, so only LQI is excluded. Recorder changes need a restart.
- Enabling a ZHA-disabled entity (the LQI sensors) reloads ZHA, so it is deferred to the HA cutover.
- kohbo YAML cache: new tabs need the `kohbo.yaml` touch, automatic since #45.
