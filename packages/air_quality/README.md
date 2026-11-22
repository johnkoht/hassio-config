# Air Quality

Each room with an Awair and a Winix purifier (kitchen, office, Jr suite, main bedroom, Gianluca, Nino) runs the same chain:

1. `sensor.<room>_air_quality` is a template in the room's package. It's the worst of PM2.5, TVOC and CO2 against the shared thresholds: Acceptable, Moderate, Unhealthy or Hazardous.
2. `<room>_air_quality_detections` runs when that state holds for 1 minute, and on the room's occupancy and Bedtime changes.
3. `script.air_quality_set_air_purifier_mode` maps the AQ state and room mode to a preset and speed:

| Room AQ | Room Auto | Room Bedtime | Room Off/other |
|---|---|---|---|
| Acceptable | Auto preset | Sleep preset | off |
| Moderate | Manual 50% | Manual 25% | Manual 50% |
| Unhealthy | Manual 75% | Manual 50% | Manual 75% |
| Hazardous | Manual 100% | Manual 75% | Manual 100% |

`air_quality_alert.yaml` is separate. It reacts to the outdoor AQI and sets every purifier at once.

## Thresholds

Thresholds are `input_number` helpers (`pm25_*`, `tvoc_*`, `co2_*`), editable from the dashboard. They have no `initial:`, so edits survive restarts. The dashboard AQI cards colour by the same helpers.

The starting values are indoor levels, roughly Awair's own bands. The EPA outdoor ones used until 2026-11 were too high to ever catch cooking.

| Pollutant | Moderate | Unhealthy (`poor`) | Hazardous |
|---|---|---|---|
| PM2.5 µg/m³ | 15 | 35 | 55 |
| TVOC ppb | 500 | 1500 | 5000 |
| CO2 ppm | 1000 | 2000 | 4500 |

Removing `initial:` made HA keep the old values, so these were set once after the deploy. To reset them, call `input_number.set_value` from Developer Tools → Actions for each helper.

## Behaviour notes

- **Hysteresis.** A room steps up as soon as any reading crosses a band's threshold. It steps down only once no reading is above 80% of the current band's threshold. With VOC sitting at 450 ppb, Moderate holds instead of flapping.
- **Dropouts.** If any of the room's three Awair readings is unavailable, the room sensor is unavailable. The detection trigger ignores a change *to* unavailable, and the script stops on any state it doesn't know, so a dropout leaves the purifier as it was. Coming back from a dropout still re-syncs.
- **Preset re-check.** The Auto and Sleep branches wait 15 s, then re-send the preset if the purifier didn't land on it. The script is `queued`, so that wait can't undo a newer run for the same purifier.
- **Missing thresholds.** A threshold helper that's missing or 0 is ignored, rather than reading every room as Hazardous.

Tests: `tests/test_air_quality_purifier_regressions.py`.
