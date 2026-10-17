# Build Log: plant-lawn-dashboard (JK-934, JK-1152)

Built 2026-10-16 on `feature/plant-lawn-dashboard`. Dashboard-only; nothing deployed, reloaded or restarted.

## Task 1: entity re-check

Live state dump taken 2026-10-16 21:04 (local). All 15 moisture entities, the 6 indoor temperature / battery entities and `sensor.tempest_precipitation_intensity` exist. Dead set unchanged from the plan: CH2 / CH6 / CH9 at `0` and CH3 `unavailable`, all last changed 2026-09-30.

## Commits

- `0e81a72` feat(dashboards): plant and soil moisture templates (JK-934)
- `29c2355` feat(dashboards): Plants header, navbar entry and view registration (JK-934)
- `77edcb9` feat(dashboards): Plants Indoor tab (JK-934)
- `4e65c05` feat(dashboards): Plants Outdoor tab (JK-934)
- `c29d250` feat(dashboards): Lawn vs Rain chart on the Outdoor tab (JK-1152)
- `d4150c7` docs(dashboards): Plants README, sitemap and learnings (JK-934)

## Validation

### validate_dash.py (committed diff vs origin/master)

```
note: unavailable dashboards/kohbo/plants/outdoor.yaml sensor.ch3_front_middle_flower_bed_soil_moisture
files 12 problems 0
exit 0
```

The only note is CH3 `unavailable`, as expected.

### tests/run.sh (full)

```
================== 262 passed, 9 skipped, 7 warnings in 8.81s ==================
```

### tests/run.sh --syntax

```
===================== 107 passed, 164 deselected in 1.63s ======================
```

### yamllint -c .yamllint (every touched YAML file)

```
yamllint exit 0
```

### Visibility complements, apexcharts yaxis, routes

```
complement soil_moisture_card: graph=[{'condition': 'numeric_state', 'entity': '[[entity]]', 'above': 0}] offline=[{'condition': 'not', 'conditions': [{'condition': 'numeric_state', 'entity': '[[entity]]', 'above': 0}]}] -> OK
complement plant_overview: graph=[{'condition': 'numeric_state', 'entity': '[[moisture_sensor]]', 'above': 0}] offline=[{'condition': 'not', 'conditions': [{'condition': 'numeric_state', 'entity': '[[moisture_sensor]]', 'above': 0}]}] -> OK
kohbo/plants/indoor.yaml: 3 soil cards, all via complement templates; 'visibility' in view: False; 'style:' in view: False
kohbo/plants/outdoor.yaml: 12 soil cards, all via complement templates; 'visibility' in view: False; 'style:' in view: False
apex yaxis moisture: keys=['decimals', 'id', 'max', 'min'] -> OK
apex yaxis rain: keys=['decimals', 'id', 'min', 'opposite'] -> OK
routes: tabs=['/dashboard-kohbo/plants', '/dashboard-kohbo/plants-outdoor'] view paths=['/dashboard-kohbo/plants', '/dashboard-kohbo/plants-outdoor'] navbar->/dashboard-kohbo/plants=True registered=True -> OK
ALL OK
```

### No inline style, PII

```
PII grep, added lines in 8a632df..HEAD (build commits):
  none
inline style: in build commits (expect only the shared card_mod include):
+++ b/dashboards/templates/includes/card_mod/apexcharts/kohbo_apexcharts_transparent.yaml
+style: |
grep -rn "style:" dashboards/kohbo/plants/  -> empty
```

gitleaks ran in the commit hook on every commit; no `--no-verify`.

## Deviations

- **Registration placement:** `kohbo.yaml` and `navbar.yaml` get the Plants entries after Holidays (binding fix 4), not before as Task 3 says.
- **Navbar diff is 5 lines**, not 4: the 4-line entry plus the blank separator the other entries use.
- **Graph colour bands are `color_thresholds_transition: hard`**, not the source template's `smooth`, so a 16% plant reads yellow rather than a yellow-green blend and matches its status dot.
- **Lawn vs Rain x-axis** drops air_quality's `labels.format: 'HH'`, which would show only hours across a 7-day span; apexcharts' default datetime labels are used.
- **LEARNINGS gets two bullets:** the WH51 one from Task 7 and the single-use include exception that binding fix 5 asks for.
- **Task 3 commits views that don't exist until Tasks 4-5.** Plan task order was kept; the intermediate commit isn't deployable on its own.
