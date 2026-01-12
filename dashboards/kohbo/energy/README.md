# Energy Dashboard

Real-time energy monitoring with dynamic forecasting based on historical usage patterns.

---

## File Structure

```
energy/
├── energy.yaml              # Main dashboard page (includes partials)
├── README.md                # This file
└── partials/                # Reusable card sections
    ├── todays_overview.yaml    # Hero card, stats, 24h chart
    ├── energy_history.yaml     # Period comparisons, timeframe tabs, history charts
    ├── active_devices.yaml     # Devices currently using power
    ├── top_consumers.yaml      # Daily energy usage by device
    └── settings_popup.yaml     # Settings and automation toggles
```

### Partials

Partials are card collections that are `!include`d into the main page. They're organized by section:

- **todays_overview.yaml** - Today's energy overview with real-time stats, forecast, and 24h chart
- **energy_history.yaml** - Historical comparisons with timeframe selector (week/30 days/weekly/monthly)
- **active_devices.yaml** - Live view of devices currently drawing power (>5W threshold)
- **top_consumers.yaml** - Devices ranked by daily energy consumption
- **settings_popup.yaml** - Energy-related automation toggles

---

## Stat Cards

| Card | Sensor | Unit | Meaning |
|------|--------|------|---------|
| **Real Time** | `sensor.energy_current_consumption` | W / kW | Current power draw (switches to kW above 1000W) |
| **Today** | `sensor.whole_home_energy_daily_usage` | kWh | Energy used so far today |
| **Forecast** | `sensor.energy_forecast_end_of_day` | kWh | Predicted end-of-day total |

### Progress Bars

Each stat card has a 10-segment progress bar with color-coded status:

| Card | Bar Fill Logic | Color Logic |
|------|---------------|-------------|
| **Real Time** | `watts / 3000 × 100` | Green <1000W (0-33%), Yellow <2000W (33-66%), Orange <2500W (66-83%), Red ≥2500W (83%+) |
| **Today** | `actual / expected_full_day × 100` | Based on `actual / expected_so_far` ratio |
| **Forecast** | `forecast / expected_full_day × 100` | Based on `forecast / expected_full_day` ratio |

**Color thresholds for Today/Forecast:**
- 🟢 Green: ratio < 0.9 (under budget)
- 🟡 Yellow: ratio ≤ 1.1 (on track)
- 🟠 Orange: ratio ≤ 1.3 (slightly over)
- 🔴 Red: ratio > 1.3 (over budget)

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
| `sensor.energy_current_consumption` | Real-time power draw (watts) |
| `sensor.whole_home_energy_daily_usage` | Today's cumulative energy usage |
| `sensor.energy_hourly_forecast_json` | Array of 24 adjusted hourly predictions |
| `sensor.energy_expected_so_far` | Expected usage up to current hour |
| `sensor.energy_expected_remaining` | Expected usage for remaining hours |
| `sensor.energy_forecast_end_of_day` | Actual + remaining = EOD prediction |
| `sensor.energy_expected_full_day` | Sum of all 24 baselines (static daily expectation) |
| `sensor.energy_trend_percent` | % difference from expected |
| `sensor.baseline_weekday_h00` - `h23` | 30-day avg per hour (weekdays) |
| `sensor.baseline_weekend_h00` - `h23` | 30-day avg per hour (weekends) |

---

## History Section

Interactive history view with time range selector.

### Time Ranges

Controlled by `input_select.energy_history_timeframe`:

| Option | Graph Span | Period | Color Thresholds (kWh) |
|--------|------------|--------|------------------------|
| **This Week** | 7 days | Daily | 0-10 🟢, 10-15 🟡, 15-20 🟠, 20+ 🔴 |
| **Past 30 Days** | 30 days | Daily | 0-10 🟢, 10-15 🟡, 15-20 🟠, 20+ 🔴 |
| **Weekly** | 12 weeks | Weekly | 0-70 🟢, 70-105 🟡, 105-140 🟠, 140+ 🔴 |
| **Monthly** | 12 months | Monthly | 0-300 🟢, 300-450 🟡, 450-600 🟠, 600+ 🔴 |

### Summary Stats

| Stat | Sensor | Description |
|------|--------|-------------|
| **This Period** | `sensor.whole_home_energy_weekly_usage` or `monthly` | Total for selected period |
| **Daily Avg** | `sensor.whole_home_daily_energy_stats` | 30-day rolling average |
| **vs Expected** | `sensor.energy_trend_percent` | % difference from expected |

### Progress Bars

Week and Month totals with 10-segment progress bars:
- Weekly target: ~100 kWh (14 kWh/day × 7)
- Monthly target: ~450 kWh (15 kWh/day × 30)

---

## Templates

### `kohbo_energy_stat_bar`

Stat cards with progress bars. Uses `bar_mode` variable:
- `realtime` - Power consumption thresholds
- `today` - Actual vs expected comparison  
- `forecast` - Forecast vs expected comparison
