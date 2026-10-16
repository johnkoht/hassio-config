# 2026-10-15 · main-bathroom-mobile-page (JK-1221)

**Metrics:** 7/7 tasks, 1 developer subagent (tasks 3+4), 2 reviews (plan + final, both no DEFECTs), 0 rework iterations.

**Pre-mortem:** Risk 1 (door template blast radius) materialized as a *find*: live data showed singles (Gianluca, Jr suite) open but tiles saying "Closed". Risk 4 caught every upstairs door sensor `unavailable` since 2026-09-30.

**+ Worked:** live state dump up front pinned every entity (plug power, automation IDs, `room:` = HA area_id) before any YAML. A YAML-walking validator (includes resolve, decluttering vars ∈ template `[[...]]`, entities live) sabotage-tested red then green — reuse it for JK-1222/1223 (scratchpad `validate_dash.py`).
**− Didn't:** first validator was regex-based and produced 74 false positives; parse YAML instead.

**Follow-ups:** JK-1222/1223 should build the small-bathroom decluttering template. Upstairs Zigbee door sensors need re-pairing/batteries. `automation.main_bathroom_lights_motion_on` is disabled live (JK-1226). Master CI already red on repo-wide yamllint debt.
