# 2026-09-23 · stale-automation-errors

I triaged the recurring errors in the HA log after the offline-alerts deploy. Three hotfixes shipped in `76c1fa5`, all reviewer-approved:

- **`weather_set_day_temperature`: deleted along with its `input_number.weather_day_high/low`.** It read `state_attr('weather.*', 'forecast')`, and HA removed that attribute in 2024.3. It errored on every NWS update, about 144 times a day. The helpers sat at 49° and −90° with zero consumers. Any other `forecast`-attribute reads are the same bug. The replacement is `weather.get_forecasts`, and kpwk is twice_daily only.
- **`nws_update_event_id_variable`: deleted.** It was a leftover from an older nws_alerts version (`attributes.event_id`) and has been superseded by `nws_alerts_update_event_id_history.yaml`, which reads `Alerts[].ID`. **Pattern:** an automation whose *later* action errors still runs its earlier actions. Its first action kept shifting the shared ID history on every update, so "it just logs errors" understated the damage.
- **Cristina's phone plugged-in/unplugged: entity fixed.** `cfalb_iphone_17_battery_level` had no `sensor.` prefix, so HA disabled both automations at load. It was also the wrong sensor: level is a percentage and never reads "Charging". It now uses `sensor.cfalb_iphone_17_battery_state`. The file still uses legacy syntax, which was intentionally left for a minimal hotfix.

**Triage method that worked:** `docker logs --since 2h homeassistant | grep ERROR` on the Yellow. Then grep the repo for consumers of whatever each broken automation writes. Zero consumers means delete, not fix.
