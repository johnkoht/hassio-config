# Build log — holiday-dashboard

Branch `feature/holiday-dashboard`, validated 2026-10-16 against the committed branch (HEAD `cb1df90`).

## Commits

```
cb1df90 docs(dashboards): holidays README, sitemap, HACS table, learnings (JK-947)
10a80f9 feat(dashboards): in-season holiday tiles on Home (JK-947)
f595abb fix(dashboards): navbar Holidays icon (JK-947)
7331dff feat(dashboards): Christmas tab (JK-1054)
37ae7af feat(dashboards): Halloween tab (JK-1053)
e16cb06 feat(dashboards): holidays overview tab (JK-947)
80f11b2 feat(dashboards): holidays header tabs + shared settings popup (JK-947)
6199cb5 plan: holiday-dashboard
```

## Task 1 — entity re-check

Live state dump taken 2026-10-16 20:34. Every entity in the plan exists. Unavailable: `switch.smart_plug_17_switch`, `sensor.smart_plug_17_power`, `light.hue_spot_12_light` (expected). `switch.front_yard_holiday_decorations` = exactly the 4 outlets (`front_door_smart_plug`, `_2`, `front_left_smart_plug`, `_2`).

Scenes (validator skips `scene.`; checked by hand): `scene.halloween_front_yard_spots` exists (state `unknown`, never activated since restart), `scene.front_yard_christmas` exists (`unknown`). Icons `calendar-star`, `halloween`, `pine-tree`, `string-lights`, `chevron-right` are in the frontend's `iconList.json`; `holidays` is not.

## tests/run.sh

```
================== 262 passed, 9 skipped, 7 warnings in 8.76s ==================
```

## tests/run.sh --syntax

```
===================== 107 passed, 164 deselected in 1.64s ======================
```

## yamllint -c .yamllint (7 touched YAML files)

```
(no output, exit 0)
```

## validate_dash.py

```
note: unavailable dashboards/kohbo/holidays/christmas.yaml light.hue_spot_12_light
note: unavailable dashboards/kohbo/holidays/christmas.yaml sensor.smart_plug_17_power
note: unavailable dashboards/kohbo/holidays/christmas.yaml switch.smart_plug_17_switch
note: unavailable dashboards/kohbo/holidays/halloween.yaml light.hue_spot_12_light
files 7 problems 0
```

## Grep ACs

```
git diff origin/master...HEAD -- dashboards | grep -c front_left_hue_lights   -> 0
grep -rn "style:" dashboards/kohbo/holidays/                                    -> (empty)
confirmation / christmas_active / script. / light.christmas_ in holiday views   -> 0 / 0 / 0 / 0
scene.front_yard_halloween in dashboards/kohbo/holidays/                        -> 0
kohbo.yaml diff                                                                 -> untouched
navbar.yaml diff                                                                -> 1 insertion, 1 deletion
conditional conditions (holiday views + home.yaml)                              -> condition: state only
hue-like-light-card entities (halloween / christmas)                            -> 14 unique / 14 unique
Christmas plug tiles                                                            -> 6, names + sensors per plan (plug 18 has none)
popup rows                                                                      -> 5, all kohbo_boolean_entity_layout, hash #holidays_settings_popup
```

## Routes

Header tabs: `/dashboard-kohbo/holidays`, `/dashboard-kohbo/holidays-halloween`, `/dashboard-kohbo/holidays-christmas`. View paths: `holidays`, `holidays-halloween`, `holidays-christmas`. Home tiles navigate to `holidays-halloween` / `holidays-christmas`. Overview cards and chevrons navigate to the same two. All match.

## PII

Grep of added lines and commit messages for child names, Santa, schools, stations, trains, clock times, emails, phone numbers: the only hits are the plan's own wording ("no Santa scripts"), which names no person or routine. gitleaks ran in the commit hook on every commit.

## Browser check

Pending: John deploys and reloads, then runs the plan's post-deploy checklist.
