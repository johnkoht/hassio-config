# Energy Dashboard

Real-time energy monitoring with dynamic forecasting based on historical usage patterns.

![Energy Dashboard](./../assets/energy-dashboard.jpg)

---

## File Structure

```
energy/
├── energy.yaml              # Main dashboard page (includes partials + hardcoded sections)
├── README.md                # This file
└── partials/                # Reusable card sections
    ├── todays_overview.yaml    # Hero card, stats, 24h chart
    ├── energy_history.yaml     # Period comparisons, timeframe tabs, history charts
    └── settings_popup.yaml     # Settings and automation toggles
```

### Partials

Partials are card collections that are `!include`d into the main page. They're organized by section:

- **todays_overview.yaml** - Today's energy overview with real-time stats, forecast, and 24h chart
- **energy_history.yaml** - Historical comparisons with timeframe selector (week/30 days/weekly/monthly)
- **settings_popup.yaml** - Energy-related automation toggles

### Hardcoded Sections

Some sections are defined directly in `energy.yaml` rather than as partials:

- **Device Energy Usage** - Grid of individual device energy cards showing 24h power consumption graphs (uses `kohbo_device_energy_card` template)

---

## Stat Cards

| Card | Sensor | Unit | Meaning |
|------|--------|------|---------|
| **Real Time** | `sensor.energy_current_consumption` | W / kW | Current power draw (switches to kW above 1000W) |
| **Price** | `sensor.comed_current_hour_average_price` | ¢/kWh | ComEd real-time electricity price |
| **Forecast** | `sensor.energy_forecast_end_of_day` | kWh | Predicted end-of-day total |

### Progress Bars

Each stat card has a 10-segment progress bar with color-coded status:

| Card | Bar Fill Logic | Color Logic |
|------|---------------|-------------|
| **Real Time** | `watts / 3000 × 100` | Green <1000W (0-33%), Yellow <2000W (33-66%), Orange <2500W (66-83%), Red ≥2500W (83%+) |
| **Price** | `price / 12 × 100` | Green <3¢ (0-25%), Yellow <6¢ (25-50%), Orange <9¢ (50-75%), Red ≥9¢ (75%+) |
| **Forecast** | `forecast / expected_full_day × 100` | Based on `forecast / expected_full_day` ratio |

**Color thresholds for Forecast:**
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
| `sensor.comed_current_hour_average_price` | ComEd real-time electricity price (¢/kWh) |
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

Three comparison cards displayed above the history chart showing current usage with percentage differences:

| Card | Sensor | Comparison Label | Description |
|------|--------|------------------|-------------|
| **Today** | `sensor.whole_home_energy_daily_usage` | "vs avg" | Today's usage (kWh) with percentage difference vs expected daily baseline |
| **This Week** | `sensor.whole_home_energy_weekly_usage` | "vs expected" | This week's total (kWh) with percentage difference vs expected for elapsed days |
| **This Month** | `sensor.whole_home_energy_monthly_usage` | "vs expected" | This month's total (kWh) with percentage difference vs expected for elapsed days |

Each card displays:
- **Value**: kWh (daily shows 1 decimal, weekly/monthly rounded to whole number)
- **Comparison**: Percentage with arrow indicator (↑/↓/→) and color coding:
  - 🟢 Green: >10% under expected
  - ⚪ Grey: Within ±10% of expected
  - 🔴 Red: >10% over expected

### Progress Bars

Week and Month totals with 10-segment progress bars:
- Weekly target: ~100 kWh (14 kWh/day × 7)
- Monthly target: ~450 kWh (15 kWh/day × 30)

---

## Templates

### `kohbo_energy_stat_bar`

Stat cards with progress bars. Used in the "Today's Overview" section. Uses `bar_mode` variable:
- `realtime` - Power consumption thresholds (Real Time card)
- `price` - Price display (Price card)
- `forecast` - Forecast vs expected comparison (Forecast card)

### `kohbo_energy_stat_comparison`

Comparison cards showing value and percentage difference. Used in the "Energy History" section. Uses `comparison_type` variable:
- `daily` - Today vs expected daily average
- `weekly` - This week vs expected weekly usage
- `monthly` - This month vs expected monthly usage

### `kohbo_device_energy_card`

Mini-graph cards for individual devices showing 24h power consumption. Used in the "Device Energy Usage" grid section. Displays:
- Device name and icon
- 24-hour bar graph of power consumption (W)
- Color-coded thresholds (green/yellow/orange/red based on power level)

---

## Dashboard Navigation

[🏠 Home](../home/README.md) | [🏡 Rooms](../rooms/README.md) | [🌡️ Climate](../climate/README.md) | [🔒 Security](../security/README.md) | [⚡ Energy](../energy/README.md) | [👥 People](../more/PEOPLE_README.md)

📖 [Main Dashboard README](../../README.md)
