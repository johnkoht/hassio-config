# Energy Meter Recovery — corrupted monthly total, Z-Wave flooding & helper cleanup

**Diagnosed:** 2026-08-04
**Status:** root cause fixed in repo ✅ · junk helpers deleted ✅ · monthly reset + Z-Wave params pending

## Symptom

`sensor.whole_home_energy_monthly_usage` read **~22,198 kWh** for the month — impossible,
since the two Aeotec meters' *combined lifetime* total is only ~11,153 kWh. The dashboard's
`+7036% vs expected` was the same bad number as a percentage.

## Root cause (one cause behind the corrupt monthly value AND the Z-Wave flooding)

Two Aeotec Home Energy Meter Gen5 nodes were reporting every 30 s across **three redundant
report groups**, flooding the Z-Wave mesh. Under congestion a meter intermittently reports
`unavailable`. Two things then compounded:

1. **In-repo bug** — `packages/energy/sensors/energy_current_consumption.yaml`,
   `total_energy_meter_combined` summed the two meters with `| float(0)`. That turned an
   `unavailable` meter into **0**, so the combined total plunged (e.g. 11,154 → 2,602) and
   snapped back. Downstream `total_increasing` utility meters counted the recovery as a
   **false ~10k kWh reset**.
2. The clean panel lineage (`panel_1/2_energy_meter` → `daily_energy_consumption`) reads the
   raw meters directly, where `utility_meter` *ignores* `unavailable` — which is why it never
   glitched (90-day max 208 kWh/day).

Recorder history of the monthly meter shows the exact false jumps, each ≈ one meter's lifetime
value: +20,490 (Jul 26 07:00), +10,266/+10,278 (Jul 26), +10,598 (Jul 29), reset to 3 (Aug 1
rollover), +10,980/+10,984 (Aug 2) → stuck at ~22,028.

**Real usage:** daily median ~81 / recent avg ~104 (`energy_expected_full_day`) / p90 ~147 /
max ~208 kWh; normal months ~2,500–3,800 kWh (Jun 2,502 · Jul 3,809); real-time ~3.4 kW
typical, ~13 kW peaks.

## Data lineage (two parallel whole-home pipelines — same meters, different helpers)

- 🟢 **CLEAN:** meter1/2 Whole kWh → `panel_1/2_energy_meter` (+weekly/monthly) →
  `sensor.daily_energy_consumption` (YAML). Used by the **history charts**.
- 🔴 **CORRUPT-PRONE (now guarded):** meter1/2 Whole kWh → `total_energy_meter_combined`
  (YAML) → `.storage` UI meters `whole_home_energy_daily/weekly/monthly/hourly_usage`. Used by
  the **tiles, comparison cards, progress bars, 24h chart**.

Nothing anywhere uses per-clamp / voltage / current / kVar / production — every consumer reads
**Whole-HEM kWh or Power** only.

## Fixes

### ✅ 1. Repo template hardened (done)
`total_energy_meter_combined` now uses an `availability:` guard (`has_value(...)` on both
meters) instead of `| float(0)`, so it goes `unavailable` during a blip rather than dropping to
a wrong number. This stops the false-reset corruption at the source. **Needs deploy + HA reload
to go live.**

### ✅ 2. Junk helpers deleted (done, via API 2026-08-04)
Removed 4 unused/broken `.storage` helpers (all unreferenced in repo + Energy dashboard):
- `sensor.home_energy_usage_sum` (integration) — broken; integrated a kWh total → `kkWhd`
- `sensor.energy_meter_combined` (min_max) — duplicate of `total_energy_meter_combined`
- `sensor.home_energy_usage` (min_max) — duplicate; only fed the broken sum
- `sensor.panel_2_energy_meter_daily_new` (utility_meter) — duplicate of `panel_2_energy_meter`

### ⏳ 3. Reset the monthly meter (after fix #1 is deployed & reloaded)
`sensor.whole_home_energy_monthly_usage` still reads ~22k. Once the hardened template is live,
`utility_meter.calibrate` it to the true month-to-date = `panel_1_energy_meter_monthly` +
`panel_2_energy_meter_monthly` (~242 kWh at diagnosis). Doing it before the fix is live just
re-corrupts on the next blip.

### ⏳ 4. Z-Wave reporting — Z-Wave JS UI @ `10.0.10.80:3000` (external, not in repo)
Per node (both Home Energy Meters):
- Param 3 Selective Reporting = ON ✓ · Params 4/5/6 = 50 W ✓ · Params 8/9/10 = 10% ✓ ·
  Param 111 = 300 s ✓ (already set)
- **Param 101 (Group 1):** confirm **kWh (Whole HEM)** + **Power (Whole HEM)** are ON.
- **Params 102 & 103 (Groups 2 & 3):** turn **every** bitmask toggle OFF. Groups 2/3 were
  re-broadcasting the same kWh+Power (whole + per-clamp) — 3× redundant traffic = the flood.

### Optional future work (deferred — "stabilize only" chosen 2026-08-04)
Collapse the dashboard onto a single git-defined lineage: define daily/weekly/monthly/hourly
utility meters in YAML on the hardened `total_energy_meter_combined` (the repo already has
unused `energy_combined_daily`/`_monthly` at `energy_current_consumption.yaml`), repoint all
tiles + charts to them, and retire the `.storage` `whole_home_energy_*` meters. Also dedup the
two unused trend sensors (`whole_home_energy_trend_percent`, `energy_trend_percent`).

## Related dashboard changes (already applied, in-repo)

- Chart/tile color thresholds recalibrated to real usage (~100 kWh/day) and made adaptive to
  `energy_expected_full_day`.
- Large numbers format as `22.2k` / `3,000`; runaway `%` falls back to an absolute `kWh` delta.
- Fixed the malformed Monthly `color_threshold` and the history-chart collapse on non-default tabs.

## Live-data access
HA token in `~/code/kohbo-dashboards/.env` (`HA_TOKEN`); `ws://192.168.1.36:8123`. Delete a UI
helper via `DELETE /api/config/config_entries/entry/{entry_id}` (the WS `config_entries/delete`
is gone in 2026.7). Recorder stats via WS `recorder/statistics_during_period`.
