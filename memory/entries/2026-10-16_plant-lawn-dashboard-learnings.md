# 2026-10-16 · plant-lawn-dashboard (JK-934, JK-1152)

**Metrics:** PR #46, 8 commits. Plan review ITERATE (3 plan-text fixes applied as binding), code review APPROVED with no DEFECTs.

**+ Worked:** two decluttering templates (`plant_overview`, `soil_moisture_card`) whose graph and Offline tiles use exactly complementary visibility conditions, verified by a script rather than by eye. A one-consumer card_mod include keeps inline `style:` out of the Lawn vs Rain view.
**− Didn't:** the plan's task order committed view registrations before the views existed, so one intermediate commit wasn't deployable on its own.

**Gotchas:**
- An Ecowitt WH51 that stops reporting holds its last value (often `0`) instead of going unavailable; detect dead channels by value (`numeric_state above: 0`).
- apexcharts `labels.format: 'HH'` copied from a 24-hour chart shows only hours across a 7-day span; use the default datetime labels.
- Needs the kohbo `kohbo.yaml` touch after deploy (automatic since #45).
