# Energy Dashboard

Real-time energy monitoring with dynamic forecasting based on historical usage patterns.

---

## Top Cards

| Card | Sensor | Meaning |
|------|--------|---------|
| **Actual** | `sensor.whole_home_energy_daily_usage` | Energy used so far today |
| **Expected** | `sensor.energy_expected_full_day` | Typical full-day usage (sum of 24 hourly baselines) |
| **Forecast** | `sensor.energy_forecast_end_of_day` | Predicted end-of-day total (actual + adjusted remaining) |

**Trend arrows:** Compare current values to expected. Green ↓ = below expected, Red ↑ = above expected.

---

## Chart Series

| Series | Type | Y-Axis | What it shows |
|--------|------|--------|---------------|
| **Actual** | Bars | Left (kWh) | Hourly energy consumption today |
| **Forecast** | Line | Left (kWh) | Predicted hourly usage (adjusted for today's pace) |
| **Price** | Line | Right (¢) | ComEd real-time electricity price |

---

## How Forecasting Works

The forecast dynamically adjusts based on how today compares to historical patterns:

```
adjustment_factor = actual_so_far / expected_so_far
hourly_forecast = baseline[hour] × adjustment_factor
```

- **Baselines**: 30-day rolling average per hour (weekday/weekend split)
- **Adjustment**: If you're 20% above baseline by noon, afternoon predictions adjust +20%
- **Clamping**: Factor bounded between 0.5x and 2.0x to prevent wild swings early in the day
- **Updates**: Recalculates as `sensor.energy_expected_so_far` and actual usage change

---

## Key Sensors

| Sensor | Purpose |
|--------|---------|
| `sensor.energy_hourly_forecast_json` | Array of 24 adjusted hourly predictions |
| `sensor.energy_expected_so_far` | Expected usage up to current hour |
| `sensor.energy_expected_remaining` | Expected usage for remaining hours |
| `sensor.energy_forecast_end_of_day` | Actual + remaining = EOD prediction |
| `sensor.energy_expected_full_day` | Sum of all 24 baselines (static daily expectation) |
| `sensor.energy_trend_percent` | % difference from expected |
| `sensor.baseline_weekday_h00` - `h23` | 30-day avg per hour (weekdays) |
| `sensor.baseline_weekend_h00` - `h23` | 30-day avg per hour (weekends) |

