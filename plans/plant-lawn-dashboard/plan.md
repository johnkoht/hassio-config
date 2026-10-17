---
title: Plant and Lawn Dashboard
slug: plant-lawn-dashboard
status: approved
created: 2026-10-16
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-934 (related JK-1152, soil moisture vs weather graph)
---

# Plant and Lawn Dashboard

## Problem

The house has 15 soil sensors and no kohbo page for any of them:

- **3 indoor sensors**: Third Reality 3RSM0147Z on ZHA. Each reports soil moisture, temperature and battery, with no light or conductivity. They're only surfaced in the morning briefing (`packages/reminders/morning_update.yaml`), which already names them "the office plant", "the small kitchen plant" and "the large kitchen plant", and calls < 10% "very dry, needs water today" and < 20% "getting dry".
- **12 outdoor channels**: Ecowitt WH51 on the GW1200B gateway. They report soil moisture %, plus a battery voltage per channel. Today they appear only as a plain `entities` list and one gauge on John's old `lovelace.ui_test` dashboard (view 4). The gauge's severity is red < 40, yellow 40–70, green ≥ 70.

There are no `plant.*` entities, no plant-card / flower-card resources, and no plant config in `packages/` or `esphome/`.

**4 of the 12 outdoor channels are dead** and nothing shows it:

| Channel | Entity | Live | Since |
|---|---|---|---|
| CH2 Right Flower Bed | `sensor.ch2_right_flower_bed_soil_moisture` | `0` | 09-30 (last_reported 09-30 02:24) |
| CH3 Front Middle Flower Bed | `sensor.ch3_front_middle_flower_bed_soil_moisture` | `unavailable` | 09-30 |
| CH6 Backyard North Flower Bed | `sensor.ch6_backyard_north_flower_bed_soil_moisture` | `0` | 09-30 |
| CH9 Backyard South Fence | `sensor.ch9_backyard_south_fence_soil_moisture` | `0` | 09-30 |

They have zero state changes in the whole recorder window (10-09 → now; `purge_keep_days: 7`). A frozen `0` is how the Ecowitt integration shows a WH51 that stopped reporting. A real WH51 in soil never sits at exactly 0 for weeks.

## Goal

Two tabbed views under one Plants section, mobile-first, every entity live:

- **Indoor** (`/dashboard-kohbo/plants`): one card per plant with a 7-day moisture graph and a Moisture / Temperature / Battery status row. The colour and status make dry plants obvious, using the same thresholds as the morning briefing.
- **Outdoor** (`/dashboard-kohbo/plants-outdoor`): one 7-day moisture graph per zone, grouped Lawn / Front Flower Beds / Backyard Flower Beds. A dead channel swaps its graph for an "Offline" / "No reading" tile.
- **JK-1152 (cheap, included, own commit):** one "Lawn vs Rain" apexcharts card on the Outdoor tab. It plots the lawn moisture lines against Tempest rain intensity over 7 days.

**Dashboard-only.** No package, registry or helper changes.

## Approach

**Navigation: two tabs with a shared header, no hub.** There are only two pages, so a hub would just add a tap. This mirrors Climate (Overview / HVAC / Air) and Holidays.
- New `templates/includes/plants/plants_header.yaml` is a copy of `holiday_header.yaml`, with title "Plants" and tabs **Indoor → Outdoor**.
- The header has **no settings chip**: there are no plant automations to toggle. An `empty_column` replaces the chip so the title stays centred.
- Both views get `subview: true` and `kohbo_page_layout_tabbed_nav.yaml`.
- Entry point: navbar More → **Plants** (`mdi:sprout`, `/dashboard-kohbo/plants`), inserted above Holidays. Both views are registered in `kohbo.yaml` under a new `# Plants` block.

**Cards: installed ones only.** `mini-graph-card` and `apexcharts-card` are both registered resources and are already used in kohbo. No new HACS card is needed: flower-card / plant-card would need `plant.*` entities, which don't exist.

**New templates, each copied from an existing one:**

| New | Copied from | Why it's new |
|---|---|---|
| decluttering `plant_overview` (`templates/decluttering/plants/plant_overview.yaml`) | `climate_overview` (stack-in-card: mini-graph + horizontal stack of `kohbo_aqi_item`s) | moisture graph + plant status row |
| decluttering `soil_moisture_card` (`templates/decluttering/plants/soil_moisture_card.yaml`) | `kohbo_room_temperature_card` (mini-graph with `value_N` threshold defaults) | dry → wet palette (red / yellow / green), 7-day span, offline swap |
| button `kohbo_plant_moisture_item`, `kohbo_plant_temperature_item`, `kohbo_plant_battery_item` (`templates/button_cards/cards/plants/`) | `kohbo_aqi_humidity_item` (extends `kohbo_aqi_item`, sets `aqi_status`) | plant thresholds. The status dot reuses the AQI images (good / moderate / unhealthy) |
| button `kohbo_device_soil_offline_entity` (`templates/button_cards/cards/devices/`) | `kohbo_device_entity` + the leak template's state colouring | "Offline – 17d" / "No reading – 17d" tile in `--warning-color` |
| card_mod include `templates/includes/card_mod/apexcharts/kohbo_apexcharts_transparent.yaml` | the inline `style:` block on `climate/air_quality.yaml`'s apexcharts | so the new chart has no inline CSS. Existing charts are left alone |

**Offline swap (dashboard-only, no helper sensor).** Each card is a `vertical-stack` of two children with mutually exclusive card-level `visibility`. This is the pattern `home.yaml` and the leak page already use.
- Graph: `condition: numeric_state`, `above: 0`.
- Offline tile: `condition: state`, `state: ["0", "unavailable", "unknown"]`.
- When a dead sensor is fixed, its graph comes back with no edit.

**Thresholds:**
- **Indoor** (fixed in `kohbo_plant_moisture_item` and the `plant_overview` graph, matching the morning briefing):
  - < 10: red, "Poor" (unhealthy image), "Needs water"
  - 10–20: yellow, "Moderate"
  - ≥ 20: green, "Good"
- **Outdoor** (`soil_moisture_card` defaults, overridable per card, from John's old gauge): red from 0, yellow from 40, green from 70.
- **Temperature item:** Good 60–85 °F, Moderate 50–60 / 85–90, Poor otherwise.
- **Battery item:** Good ≥ 30%, Moderate 15–30, Poor < 15.

**Entity choice.** The ZHA devices expose `_humidity` and `_soil_moisture` with identical values. Use `_soil_moisture` only; it's the one the morning briefing reads. The WH51 battery voltages (all 1.4–1.5 V, including the dead channels, so stale) and the `gw1200b_soil_ad_*` channels (disabled) stay off the page.

**Names** follow the morning briefing indoors and the Ecowitt channel names outdoors, without the "CHn –" prefix.

## Page layout (scaffold)

Both views share the same frame:
- `type: custom:vertical-layout`, `theme: kohbo`, `subview: true`, `layout: !include …/layouts/kohbo_page_layout_tabbed_nav.yaml`
- a 1–3 line header comment
- `!include …/includes/plants/plants_header.yaml` first and `!include …/includes/navbar.yaml` last.

### Shared header: `templates/includes/plants/plants_header.yaml`

- `top_toolbar` with `empty_column` / `kohbo_header_page_title` "Plants" / `empty_column`
- `navbar-card` tabs:
  1. Indoor: `/dashboard-kohbo/plants`, `mdi:flower-tulip`
  2. Outdoor: `/dashboard-kohbo/plants-outdoor`, `mdi:grass`
- The `styles:` block is copied verbatim from `holiday_header.yaml`.

### View 1: Indoor (`kohbo/plants/indoor.yaml`, `path: plants`, title "Plants")

1. Header (tab: Indoor)
2. `plant_overview` × 3, in this order:

   | `name` | `moisture_sensor` | `temperature_sensor` | `battery_sensor` | Live today |
   |---|---|---|---|---|
   | Office Plant | `sensor.plant_moisture_sensor_soil_moisture` | `sensor.plant_moisture_sensor_temperature` | `sensor.plant_moisture_sensor_battery` | 91%, 77 °F, 91% |
   | Small Kitchen Plant | `sensor.small_plant_soil_moisture` | `sensor.small_plant_temperature` | `sensor.small_plant_battery` | 94%, 78 °F, 48% |
   | Large Kitchen Plant | `sensor.large_plant_soil_moisture` | `sensor.large_plant_temperature` | `sensor.large_plant_battery` | **16% (yellow)**, 74 °F, 100% |

   Each card is a `vertical-stack`:
   - **Online** (visible while moisture is `numeric_state above: 0`): a `stack-in-card` holding:
     - a mini-graph: `name: [[name]]`, `icon: mdi:flower`, `hours_to_show: 168`, `points_per_hour: 1`, `decimals: 0`, thresholds red 0 / yellow 10 / green 20, and `kohbo_climate_card_graph_styles.yaml`;
     - a horizontal row: `kohbo_plant_moisture_item`, `kohbo_plant_temperature_item`, `kohbo_plant_battery_item` (`kohbo_horizontal_stack_bg.yaml`).
   - **Offline** (state `0` / `unavailable` / `unknown`): `kohbo_device_soil_offline_entity` on the moisture sensor.
3. `kohbo_card_section_description`: "Yellow below 20%, red below 10%: the same levels the morning briefing uses to say a plant needs water."
4. Navbar

### View 2: Outdoor (`kohbo/plants/outdoor.yaml`, `path: plants-outdoor`, title "Outdoor Plants")

1. Header (tab: Outdoor)
2. `section_title` **Lawn**, then a `grid` (`columns: 2`, `square: false`) of `soil_moisture_card` (`icon: mdi:grass`):

   | name | entity | live |
   |---|---|---|
   | Front Lawn | `sensor.ch4_front_lawn_soil_moisture` | 71 |
   | Backyard North Corner | `sensor.ch4_backyard_north_corner_soil_moisture` (channel 5; the entity ID says ch4) | 61 |
   | Swingset | `sensor.ch7_backyard_swingset_soil_moisture` | 60 |
   | Behind Pool | `sensor.ch8_backyard_east_soil_moisture` | 81 |
   | South Fence | `sensor.ch9_backyard_south_fence_soil_moisture` | **0, No reading** |

3. `section_title` **Front Flower Beds**, grid of `soil_moisture_card` (`icon: mdi:flower`):

   | name | entity | live |
   |---|---|---|
   | Round Bed | `sensor.ch1_round_flower_bed_soil_moisture` | 12 (red) |
   | Right Bed | `sensor.ch2_right_flower_bed_soil_moisture` | **0, No reading** |
   | Middle Bed | `sensor.ch3_front_middle_flower_bed_soil_moisture` | **Offline** |
   | Left Bed (by garage) | `sensor.ch11_front_left_flower_bed_soil_moisture` | 91 |

4. `section_title` **Backyard Flower Beds**, grid of `soil_moisture_card` (`icon: mdi:flower`):

   | name | entity | live |
   |---|---|---|
   | North Bed | `sensor.ch6_backyard_north_flower_bed_soil_moisture` | **0, No reading** |
   | Middle Bed | `sensor.ch10_backyard_middle_flower_bed_soil_moisture` | 38 (red) |
   | South Bed | `sensor.ch12_backyard_south_flower_bed_soil_moisture` | 40 (yellow) |

   Three cards, so the last row is half-full. That's accepted.
5. **JK-1152, own commit:** `section_title` "Lawn vs Rain – 7 Days", then `custom:apexcharts-card`:
   - `card_mod: !include …/card_mod/apexcharts/kohbo_apexcharts_transparent.yaml`, `graph_span: 7d`, `span: end: hour`, `header: show: false`
   - `apex_config`: height 240, legend at the bottom, `stroke` smooth width 2. These are copied from air_quality.
   - `yaxis`:
     - `id: moisture`: min 0, max 100, `decimalsInFloat: 0`
     - `id: rain`: `opposite: true`, min 0, `decimalsInFloat: 2`
   - series:
     - the 5 lawn sensors: `type: line`, `yaxis_id: moisture`, `group_by: {func: avg, duration: 1h}`
     - `sensor.tempest_precipitation_intensity`: name "Rain (in/h)", `type: column`, `yaxis_id: rain`, `group_by: {func: max, duration: 1h}`
   - Why intensity and not `sensor.tempest_precipitation`: the latter is a per-report mm amount (`state_class: total`, values like 0.0006). Summing it from history undercounts, because repeated equal values collapse. Intensity's hourly max shows each rain event cleanly (10-09 and 10-15 in the current window).
6. Navbar

### Navbar (`templates/includes/navbar.yaml`)

More popup: add `- icon: mdi:sprout`, `url: /dashboard-kohbo/plants`, `label: Plants` directly above Holidays.

## Plan-review fixes (binding; they override the text below where it disagrees)

1. **Rain chart AC and checklist item 7.** Recorder history shows no rain inside the current 7-day window; the only recent event was 10-09. The AC and the post-deploy check become: "the chart renders lawn moisture lines plus a rain series; rain columns appear for any event inside the window (none expected right now)". Don't claim a specific event.
2. **Graph and offline visibility must be exact complements.** The graph shows on `numeric_state` `above: 0`. The Offline tile shows on `condition: not` wrapping that same `numeric_state` `above: 0`. That covers unavailable, unknown, `0`, `0.0` and negative values. Don't use a `state:` list for the offline side.
3. **apexcharts y-axis decimals.** Use the card-level `decimals:` key on each `yaxis` entry, or nest `decimalsInFloat` under that axis's `apex_config`, following `dashboards/kohbo/climate/air_quality.yaml:152-156`. Never put a bare `decimalsInFloat` on a card-level yaxis entry.
4. **Merge order.** A parallel sensors-dashboard PR also edits `navbar.yaml` and `kohbo.yaml`. Insert the Plants entries directly **after** the Holidays entries in both files, not above them, to reduce textual conflicts. Whichever PR merges second gets rebased by the orchestrator.
5. **Single-use include.** `kohbo_apexcharts_transparent.yaml` has one consumer. Accept that as a documented exception in LEARNINGS, or inline nothing and reuse the existing air_quality styling if one exists. Don't edit `air_quality.yaml` in this PR.
6. **Precedent.** For visibility on children inside a stack, follow `dashboards/templates/decluttering/.../room_overview.yaml:88-125`. Each grid cell stays one decluttering-card, so the grid never sees a hidden direct child.

## Decisions

**John, 2026-10-16** (these answer the open questions):
- **A. Outdoor thresholds:** use the old gauge. Red below 40, yellow 40–70, green from 70. Indoor stays at red below 10 and yellow below 20.
- **B. Lawn zones:** Backyard North Corner, Swingset, Behind Pool and South Fence are lawn. Anything not named "Flower Bed" is lawn.
- **C. JK-1152:** ship the "Lawn vs Rain" chart in this PR, in its own commit.

1. **Dashboard-only.** No packages, helpers or registry edits. The offline detection is pure card `visibility`.
2. **Tabs, not a hub.** Indoor is the default tab (`path: plants`), because it's first in the issue and the navbar points there.
3. **No settings popup or chip.** Nothing to configure.
4. **Installed cards only:** mini-graph-card and apexcharts-card. No flower-card, because there are no `plant.*` entities.
5. **Indoor thresholds equal the morning briefing's** (10 / 20), so the page and the spoken reminder never disagree.
6. **Outdoor thresholds come from John's old gauge** (40 / 70), as template defaults so one zone can be overridden later (open question 1).
7. **A frozen `0` counts as "No reading"**, not as bone-dry soil.
8. **Lawn vs beds is split by name**: anything without "Flower Bed" in its Ecowitt name is lawn (open question 2).
9. **7-day graphs.** The recorder keeps 7 days (`purge_keep_days: 7`), so 168 h is the ceiling. `points_per_hour: 1` keeps 15 history fetches light on the Yellow.
10. **JK-1152 ships here as one card in its own commit.** It's cheap: installed card, existing sensors.
11. **Standing preferences:**
    - no `confirmation` (nothing is actionable here; tiles open more-info);
    - no inline `card_mod: style:` in the new views;
    - no booleans on these pages, so `kohbo_boolean_entity_layout.yaml` isn't needed;
    - both views registered in `kohbo.yaml`;
    - no PII. Zone names are generic yard positions.

## Tasks

All work happens in `.claude/worktrees/plant-lawn-dashboard` on `feature/plant-lawn-dashboard`. Commits go in task order.

1. **Entity re-check (read-only).** With a fresh live dump, confirm all 15 moisture entities, the 6 indoor temperature/battery entities and `sensor.tempest_precipitation_intensity` exist.
   - AC: the only dead ones are CH2 / CH6 / CH9 (`0`) and CH3 (`unavailable`). Report any change before building.
2. **Templates** (one commit): `plant_overview`, `soil_moisture_card`, the 3 `kohbo_plant_*_item`s, `kohbo_device_soil_offline_entity`, and the apexcharts card_mod include.
   - AC: each template starts from its source in the Approach table, with no invented style keys.
   - AC: every `[[token]]` used by the views exists in the template.
   - AC: `soil_moisture_card` has `default:` values for `value_1..3` (0 / 40 / 70) and `icon`.
   - AC: the graph and offline children carry the exact `visibility` conditions above.
3. **Header + navbar + registration** (one commit):
   - `includes/plants/plants_header.yaml`;
   - the navbar Plants entry;
   - in `kohbo.yaml`, a `# Plants` block with `kohbo/plants/indoor.yaml` and `kohbo/plants/outdoor.yaml`, placed before `# Holidays`.
   - AC: 2 tabs, valid MDI icons, and no settings chip.
   - AC: the navbar diff is a 4-line addition.
4. **Indoor view.** `kohbo/plants/indoor.yaml` as View 1.
   - AC: `path: plants`, `subview: true`, 3 `plant_overview` cards with the entities in the table, no `_humidity` entities, and no `style:`.
5. **Outdoor view.** `kohbo/plants/outdoor.yaml` as View 2, items 1–4 and 6.
   - AC: `path: plants-outdoor`, 12 `soil_moisture_card`s in 3 sections, each entity exactly once, no `gw1200b_*` entities, and no `style:`.
6. **JK-1152 graph** (own commit). View 2, item 5.
   - AC: 6 series (5 lawn lines + rain columns), two y-axes, and the card_mod include rather than an inline style.
7. **Docs** (own commit):
   - Create `dashboards/kohbo/plants/README.md` in the holidays README format: overview, file tree, thresholds and their source, the offline-swap rule, and the dead-channel list as of today.
   - `dashboards/SITEMAP.md`: a Plants section, the tree entry and the navigation hierarchy. Bump "Last updated".
   - `dashboards/LEARNINGS.md`, one bullet: an Ecowitt WH51 that stops reporting holds its last value (often `0`) rather than going unavailable. Detect it by value, not by state.
   - AC: every new file is in the README tree and in SITEMAP.
8. **Validate (scripted).** Run against the committed branch and paste the output into `plans/plant-lawn-dashboard/build-log.md` (own commit):
   - `python3 /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/validate_dash.py /Users/johnkoht/code/hassio-config/.claude/worktrees/plant-lawn-dashboard /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/live_states.json` (with a fresh dump). It checks includes, decluttering variables against template tokens, and live entities.
   - `tests/run.sh` in full.
   - `yamllint -c .yamllint` on every touched YAML file.
   - A PII grep of the added lines (addresses, names, times).
   - gitleaks runs in the commit hook; never pass `--no-verify`. If `deploy.sh --check` is used, pass `--skip-ci` (otherwise it deletes `secrets.yaml`). Never deploy, reload or restart.
   - AC: the validator reports 0 problems. Its only `note:` line is CH3 `unavailable`.
   - AC: tests, yamllint and the PII grep are clean.
   - AC: `grep -rn "style:" dashboards/kohbo/plants/` is empty.
9. **Browser verification, after John deploys** and reloads the dashboard himself.
   - AC: every item in the checklist below passes.

## Risks

- **Lovelace YAML has no tests, and HA's config check ignores dashboards.** Mitigation: the validator plus the browser pass.
- **Visibility inside a `grid`.** If a hidden child still takes a cell, the grid shows gaps. The pattern works in `home.yaml` stacks but hasn't been tried in a grid here. Fallback: replace the grid with `horizontal-stack` pairs (same look, explicit rows).
- **15 graph cards on two pages** each fetch 7 days of history, which is slow on the Yellow. Mitigation: `points_per_hour: 1`, and only 3 cards on Indoor. If Outdoor drags, drop to `hours_to_show: 72`.
- **"0 = offline" can be wrong** if a sensor is really dry and reads 0. That's unlikely for a WH51 in soil, and the tile still shows the value's age.
- **The indoor offline swap keys on moisture only.** If temperature or battery alone goes unavailable, that item shows "unavailable" in the row. Accepted.
- **`kohbo_aqi_item` renders the "hazardous" image when `aqi_status` is undefined.** Each plant item must return a status for every numeric branch; non-numeric states fall through to it. Accepted, since the offline swap hides the row in that case.
- **Merge conflict with the parallel sensors-dashboard plan**, which likely also edits `navbar.yaml` and `kohbo.yaml`. Rebase onto master before merge, and keep each edit a pure insertion.
- **kohbo is `mode: yaml`.** HA only re-reads it when `kohbo.yaml`'s mtime changes. This PR does edit `kohbo.yaml`, but a `git pull` that leaves it untouched in a later fix wouldn't refresh. See the checklist.

## Post-deploy checklist (phone width)

1. Make sure `kohbo.yaml`'s mtime changed on the host. The deploy.sh PR adds the `touch`; until it lands, `touch /config/dashboards/kohbo/kohbo.yaml`. Then use More → Reload Dashboard.
2. More → Plants (sprout icon) opens `/dashboard-kohbo/plants` with no red cards.
3. The tabs read Indoor / Outdoor, each opens its page, and the active tab is underlined.
4. Indoor: 3 cards. Large Kitchen Plant's graph is yellow (16%) and its moisture dot is "moderate". The other two are green. The battery items read 91 / 48 / 100, and Small Kitchen Plant's battery is green (≥ 30).
5. Outdoor: Lawn shows 4 graphs plus a "No reading" tile for South Fence. Front Beds shows Round (red) and Left, plus Right "No reading" and Middle "Offline". Backyard Beds shows North "No reading", Middle (red) and South (yellow). There are no gaps in the grids.
6. Tapping a graph or tile opens more-info.
7. Lawn vs Rain: 4 coloured lawn lines plus a flat South Fence line at 0, rain columns on 10-15 on the right axis, and a legend at the bottom.
8. The page loads in a reasonable time on the phone. If not, apply the `hours_to_show` fallback in Risks.

## Open questions (John)

1. **Outdoor colour thresholds.** Default: your old gauge, red < 40 / yellow 40–70 / green ≥ 70. Today that colours Round Bed (12) and Backyard Middle (38) red. Alternative: the indoor 10 / 20.
2. **Are Backyard North Corner, Swingset, Behind Pool and South Fence lawn sensors?** Default: yes. Everything not named "Flower Bed" goes in the Lawn section and feeds the Lawn vs Rain graph.
3. **JK-1152 in this PR?** Default: yes, as one apexcharts card in its own commit (Task 6). Say no and Task 6 drops out, and JK-1152 stays open.

## Out of scope (backlog)

- **Revive the 4 dead WH51 channels** (CH2, CH3, CH6, CH9): replace batteries / re-sync with the GW1200B. This is physical work; the page will show them recovering automatically.
- **A "plants need water" helper** (count sensor + Home chip, or a notification). It's a package change. The morning briefing already covers the indoor plants.
- **Entity ID mismatch:** `sensor.ch4_backyard_north_corner_soil_moisture` is channel 5 (unique_id `…-soilmoisture5`). Renaming it is a registry edit; nothing in the repo references it.
- **CH10 Backyard Middle Flower Bed has no area** (the other 11 are `front_yard` / `backyard`).
- **Rachio watering overlay** on the moisture graphs. The zone switches (`switch.zone_*_2`) don't map 1:1 to soil channels.
- **Longer-than-7-day history** via long-term statistics (apexcharts `statistics:`). Recorder retention caps raw history at 7 days.
- **HA `plant` integration / flower-card** (thresholds, light, conductivity). These sensors don't report light or conductivity, so there's little gain.
- **Battery voltage for the WH51s** on the page. The values are stale, so they're not meaningful until the dead channels report again.
- **`dashboards/CLAUDE.md` says kohbo loads in `storage` mode**, but it is `mode: yaml`. That's a doc fix for a separate docs pass.

On approval → /approve → /ship plant-lawn-dashboard
