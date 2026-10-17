---
title: Holiday Dashboard
slug: holiday-dashboard
status: approved
created: 2026-10-16
has_pre_mortem: false
has_review: false
has_prd: false
linear: JK-947 (children JK-1053 Halloween, JK-1054 Christmas)
---

# Holiday Dashboard

## Problem

The kohbo dashboard has a Holidays section that is only a shell:

- `holidays/holidays.yaml` (`path: holidays`) is a header plus the navbar, with no content.
- `holidays/christmas.yaml` (`path: holidays-christmas`) is the same shell with three TODO comments.
- `holidays/halloween.yaml` is **0 bytes** but is still in `kohbo.yaml` `views:`. HA's YAML loader turns an empty `!include` into `{}` (checked in `annotatedyaml.loader._include_yaml` on the host: `if loaded_yaml is None: loaded_yaml = NodeDictClass()`). So the views list gets a blank view with no title, no path and no cards, at index 42 (`/dashboard-kohbo/42`). `/dashboard-kohbo/holidays-halloween` doesn't exist, so the header's Halloween tab is a dead link.
- The navbar's More → Holidays entry uses `mdi:holidays`, which isn't an MDI icon (it's missing from the frontend's `iconList.json` on the host), so it renders blank.

Today the season booleans, decorations, trees and Hue scenes can only be reached through more-info dialogs or John's old UI dashboard (`lovelace.ui_test`). That dashboard has useful content but also dead entities (`switch.front_door_smart_plug_1`, `switch.z_wave_outdoor_smart_plug`, `update.z_wave_js_to_mqtt_update`).

## Goal

Three working views under one tabbed Holidays section, mobile-first, every entity live, no red cards:

- **Overview** (`/dashboard-kohbo/holidays`): one card per season with its toggle, linking to the season page.
- **Halloween** (`/dashboard-kohbo/holidays-halloween`), JK-1053: season toggle, decorations toggle, Halloween Hue scene, front-yard spots.
- **Christmas** (`/dashboard-kohbo/holidays-christmas`), JK-1054: season toggle, trees, playroom window lights, front yard, all Christmas lights.

Plus a shared, short settings popup with the feature-level holiday automations only.

**Dashboard-only.** No package changes. The package problems found while planning are in Out of scope.

**Project note:** the Linear issues sit in the "New Tablet Dashboard" project, but this plan builds on kohbo (mobile), where the holiday views already live. Re-file the issues or build a tablet version later.

## Approach

**Navigation: keep the tabbed section.** The holiday views already use `kohbo_page_layout_tabbed_nav.yaml` and `includes/holidays/holiday_header.yaml`, the pattern Climate (Overview / HVAC / Air) and Rooms (Active / Main / Upper) use. Tabs beat a hub with back arrows here: there are only two seasons, and the tabs let you move between them in one tap.
- Header tabs become **Overview → Halloween → Christmas** (calendar order; Overview is new).
- All three views get `subview: true`, as the climate tabs have. With the kiosk header hidden, this only keeps them out of HA's own tab strip.
- Entry point: the navbar's More → Holidays (`/dashboard-kohbo/holidays`); its icon becomes `mdi:calendar-star`.

**Settings popup: one shared file**, `holidays/_holidays_settings_popup.yaml`, included at the bottom of all three views. This is the `_climate_settings_popup.yaml` pattern, and the shared header always opens `#holidays_settings_popup`. It has a Halloween section and a Christmas section.

**Card vocabulary (existing templates only, no inline CSS):**
- Season and group controls: `horizontal_action_card`, with `card_boolean_component` as the action card, as "All Exterior Lights" on `more/exterior_lighting.yaml` does. Pass only `entity` to `card_boolean_component`; its only token is `[[entity]]`, and the validator flags extra variables.
- Hub links: `horizontal_action_card` with a `kohbo_chip_icon_action_card` chevron, as the Security hub does.
- Individual plugs: `kohbo_device_smart_plug_entity` in a 2-column grid, with `variables.power_sensor` where a sensor exists. **No `confirmation`** (the playroom page sets it; this page doesn't).
- Scene buttons: a `tile` with `tap_action` and `icon_tap_action` both set to `perform-action: scene.turn_on`. The repo has no HA-scene button template; `scene_button` is for scene_presets images.
- Popup rows: `entities` with `kohbo_boolean_entity_layout.yaml`, `secondary_info: last-changed` and `state_color: true`.
- Front-yard spots: **`custom:hue-like-light-card`**, the card from John's old dashboard ("13 lights are on", brightness slider, live colour gradient). It is installed (HACS, `www/community/lovelace-hue-like-light-card`, v1.11.0) and registered as a storage-mode resource, which applies to every dashboard including YAML-mode kohbo. Fallback if John rejects it: a `tile` on `light.exterior_accent_lights` with `features: [light-brightness]` (open question 3).

**Names** come from John's old dashboard: Main Tree, Small Tree, Window Lights 1 / 2 & 3 / 4 / 5.

**HARD RULE:** `switch.front_yard_outdoor_front_left_hue_lights` and `_2` power the Hue spots. They appear nowhere: no tile, no group, no action, and not in the hue-like card's entity list.

### Findings that shape the layout

1. **`switch.christmas_lights` reads ON all October.** It's a group of `switch.christmas_trees`, `switch.christmas_playroom_lights` and `switch.front_yard_holiday_decorations`, and the front-yard plugs are running the Halloween inflatables. `light.christmas_lights` is a `switch_as_x` wrapper of it, exposed to Alexa, so "Alexa, turn off the Christmas lights" in October turns off the Halloween decorations too. **Page workaround (this PR):** show the "All Christmas Lights" card only while `input_boolean.christmas_season_active` is on (a `conditional` with a `state` condition). Out of season, the per-group cards still work. The real fix, taking the front yard out of the master group and targeting it in the two Christmas automations, is a package change (open question 1).
2. **`christmas_season_active` vs `christmas_active`.**
   - `christmas_season_active` is the season switch. Turning it on or off runs `script.christmas_enable_automations` / `christmas_disable_automations` through `christman_manually_enabled` / `_disabled` (the alias typo is live) and `activate_christmas_season`. Those scripts turn the nightly automations on or off.
   - `christmas_active` is the nightly "lights are on now" flag. `christmas_activated` sets it at dusk or 4pm while the house is occupied; `christmas_not_activated` clears it at bedtime, when the house goes Away or when nobody is home. `turn_on/off_christmas_lights` follow it.
   - So the page shows `christmas_season_active`. `christmas_active` is plumbing and stays off the page. The old dashboard listed both.
3. **`christmas_enabled` / `christmas_disabled` (auto start Dec 1, auto end after Jan 7) have `initial_state: false`.** Every restart turns them off, so a popup toggle would lie, and they stay off the popup. They're off live today.
4. **The two `unavailable` holiday automations are registry ghosts.** `automation.turn_on_holiday_lights` and `turn_off_holiday_lights` have entries in `core.entity_registry` (unique_ids `turn_on_holiday_lights` / `turn_off_holiday_lights`, platform automation, not orphaned) and `restored: true` live. Their YAML has been commented out in `packages/outdoor_lighting.yaml` (lines 486–515, targeting a `switch.main_tree` that no longer exists) since the first commit. Nothing on the dashboard references them. Removing them is a UI registry delete (backlog).
5. **Plug 17 (Window Lights 5) is `unavailable`**, and so is its power sensor. `kohbo_device_smart_plug_entity`'s `state_display` only special-cases `on`, so an unavailable plug reads "Off – …" instead of "Unavailable" (risk; template fix in backlog).
6. **Plug 18 has no power sensor** (only child lock and LED entities). Its tile omits `power_sensor` and reads "On – <time>". The playroom page points plug 18's tile at plug 16's sensor (backlog).
7. **The Hue power plugs** (see HARD RULE) are not in `switch.front_yard_holiday_decorations`. Verified: the group is exactly the 4 Z-Wave outlets.
8. **`scene.front_yard_christmas` is a Hue app scene** for the Hue "Front Yard" room. Per `packages/holidays/LEARNINGS.md`, that room doesn't include spots 11–14, the gap the HA scene `scene.halloween_front_yard_spots` (PR #41) closed for Halloween. Building a Christmas HA scene means capturing colours from the live lights in December (backlog).

## Page layout (scaffold)

Every view has the same frame: `type: custom:vertical-layout`, `theme: kohbo`, `subview: true`, `layout: !include …/layouts/kohbo_page_layout_tabbed_nav.yaml`, a 1–3 line header comment, `!include …/includes/holidays/holiday_header.yaml` first, then `!include /config/dashboards/kohbo/holidays/_holidays_settings_popup.yaml` and `!include …/includes/navbar.yaml` last.

### Shared header: `templates/includes/holidays/holiday_header.yaml`

- Title "Holidays" and the settings chip → `#holidays_settings_popup` (unchanged).
- Tabs (`navbar-card` routes), in order:
  1. Overview: `/dashboard-kohbo/holidays`, `mdi:calendar-star`
  2. Halloween: `/dashboard-kohbo/holidays-halloween`, `mdi:halloween`
  3. Christmas: `/dashboard-kohbo/holidays-christmas`, `mdi:pine-tree`
- The `styles:` block is untouched (it's the shared header include, the same as the climate and rooms headers).

### View 1: Overview (`holidays/holidays.yaml`, `path: holidays`)

1. Header (tab: Overview)
2. **Halloween card:** `horizontal_action_card`
   - `entity: input_boolean.halloween_season_active`, `name: Halloween`, `icon: mdi:halloween`, `template: kohbo_horizontal_action_card_entity`
   - `tap_action: navigate`, `navigation_path: /dashboard-kohbo/holidays-halloween`
   - `action_cards`: `card_boolean_component` (season toggle) + `kohbo_chip_icon_action_card` `mdi:chevron-right` → the Halloween page
3. **Christmas card:** the same, on `input_boolean.christmas_season_active`, `name: Christmas`, `icon: mdi:pine-tree`, linking to `/dashboard-kohbo/holidays-christmas`
4. Settings popup include
5. Navbar

Order is fixed (calendar order). The state line ("On – 3d" / "Off – 9mo") shows which season is active. There's no reordering by active season: that would need each card twice under `conditional`s.

### View 2: Halloween (`holidays/halloween.yaml`, `path: holidays-halloween`), filling the empty file

1. Header (tab: Halloween)
2. **Season:** `section_title` "Season", then `entities` with one row:
   - `input_boolean.halloween_season_active`, name "Halloween Season", `mdi:halloween`, boolean layout
   - `kohbo_card_section_description`: "Turns the Halloween decorations and colours on and off with the season."
3. **Decorations** (the JK-1053 "lights toggle"):
   - `horizontal_action_card` on `switch.front_yard_holiday_decorations`, name "Front Yard Decorations", `template: kohbo_horizontal_action_card_light_entity`, `tap_action: nothing`, `navigation_path: ""`, action card `card_boolean_component`
   - 2-column grid, `kohbo_device_smart_plug_entity`, no power sensors (the 4 outlets have none):

     | Name | Entity |
     |---|---|
     | Front Door 1 | `switch.front_door_smart_plug` |
     | Front Door 2 | `switch.front_door_smart_plug_2` |
     | Front Left 1 | `switch.front_left_smart_plug` |
     | Front Left 2 | `switch.front_left_smart_plug_2` |

4. **Front Yard Spots:** `section_title` "Front Yard Spots"
   - `entities` row `input_boolean.exterior_accent_lights`, name "Accent Lights", boolean layout. This is the feature switch: turning it on fires `turn_on_exterior_accent_lights` and, in season, `halloween_front_yard_hue_scene`.
   - `custom:hue-like-light-card`, `title: Outdoor Spots`, `entities:` the 14 spots in the same order as the `light.exterior_accent_lights` members (`exterior_hue_outdoor_spot_1..3`, `hue_outdoor_spot_4..10`, `hue_spot_11..14_light`), each listed **once**. The old card listed spot 9 four times. Spot 12 is unavailable and is shown anyway.
   - Scene tile: `scene.halloween_front_yard_spots`, name "Halloween Colors", `icon: mdi:halloween`, `tap_action` and `icon_tap_action` → `perform-action` `scene.turn_on`, target the scene.
   - `scene.front_yard_halloween` (the superseded Hue app scene) is **not** shown.
5. Settings popup include
6. Navbar

### View 3: Christmas (`holidays/christmas.yaml`, `path: holidays-christmas`), a rewrite

1. Header (tab: Christmas)
2. **All Christmas Lights:** a `conditional` (`condition: state`, `entity: input_boolean.christmas_season_active`, `state: "on"`) wrapping a `horizontal_action_card` on `switch.christmas_lights`, name "All Christmas Lights", `template: kohbo_horizontal_action_card_light_entity`, action card `card_boolean_component`. Hidden out of season (finding 1).
3. **Season:** `section_title` "Season", `entities` row `input_boolean.christmas_season_active`, name "Christmas Season", `mdi:pine-tree`, boolean layout
   - Description: "Turns the nightly Christmas light automations on for the season."
4. **Trees:**
   - `horizontal_action_card` on `switch.christmas_trees`, name "Christmas Trees", `card_boolean_component`
   - 2-column grid, `kohbo_device_smart_plug_entity`:

     | Name | Entity | `power_sensor` |
     |---|---|---|
     | Main Tree | `switch.smart_plug_9_switch` | `sensor.smart_plug_9_active_power` |
     | Small Tree | `switch.smart_plug_4_switch` | `sensor.smart_plug_4_family_room_power` |

5. **Playroom:**
   - `horizontal_action_card` on `switch.christmas_playroom_lights`, name "Playroom Lights", `card_boolean_component`
   - 2-column grid, `kohbo_device_smart_plug_entity`:

     | Name | Entity | `power_sensor` |
     |---|---|---|
     | Window Lights 1 | `switch.smart_plug_15_switch` | `sensor.smart_plug_15_power` |
     | Window Lights 2 & 3 | `switch.smart_plug_18_switch` | none (finding 6) |
     | Window Lights 4 | `switch.smart_plug_16_switch` | `sensor.smart_plug_16_power` |
     | Window Lights 5 | `switch.smart_plug_17_switch` | `sensor.smart_plug_17_power` (unavailable, finding 5) |

6. **Front Yard:**
   - `horizontal_action_card` on `switch.front_yard_holiday_decorations`, name "Front Yard Decorations", `card_boolean_component`. There's no plug grid here; the 4 outlets are on the Halloween page.
   - `entities` row `input_boolean.exterior_accent_lights`, "Accent Lights", boolean layout
   - `custom:hue-like-light-card`, "Outdoor Spots", the same 14-entity list as Halloween
   - Scene tile: `scene.front_yard_christmas`, name "Christmas Colors", `mdi:pine-tree`, `perform-action` `scene.turn_on` (spots 1–10 only, finding 8)
7. Settings popup include
8. Navbar

Not on the page: `light.christmas_lights` and `light.christmas_playroom_lights` (switch_as_x duplicates), `input_boolean.christmas_active` (plumbing), the tree and playroom daily-energy sensors (no ask; they're not defined in this repo), all scripts including the Santa announcement scripts (privacy, plus John's no-scripts rule), and the dead `switch.z_wave_outdoor_smart_plug` / `switch.front_door_smart_plug_1`.

### Shared popup: `holidays/_holidays_settings_popup.yaml`

`custom:bubble-card`, `card_type: pop-up`, `hash: '#holidays_settings_popup'`, `close_by_clicking_outside: true`, `styles: !include …/kohbo_popup_styles.yaml`. `margin_top_mobile` and `margin_top_desktop` start at `calc(100vh - 600px)`; adjust them in the browser check.

1. `kohbo_popup_page_title` "Settings"
2. `section_title` "Halloween", `entities`:

   | Entity | Name |
   |---|---|
   | `automation.halloween_lights_turn_on` | Decorations On in the Morning |
   | `automation.halloween_lights_turn_off` | Decorations Off at Night |
   | `automation.halloween_front_yard_hue_scene` | Halloween Colors on the Spots |

3. `section_title` "Christmas", `entities`:

   | Entity | Name |
   |---|---|
   | `automation.christmas_activated` | Lights On in the Evening |
   | `automation.christmas_not_activated` | Lights Off at Bedtime or Away |

   - Description: "The season toggle turns these on and off; switch one off to skip it for the rest of the season."

Excluded on purpose: `turn_on/off_christmas_lights`, `activate_christmas_season` and `christman_manually_*` (plumbing); `christmas_enabled` / `_disabled` (finding 3); `christmas_shortcut_button` (`initial_state: off`, and its IKEA button is unavailable); `handle_ikea_unresponsive` (it targets 4 dead Tradfri plugs); scripts; groups.

### Home (optional, own commit; open question 2)

`home/home.yaml` → Overview grid, after Main Floor Vacuum:
- `conditional` on `input_boolean.halloween_season_active` == `on` → `kohbo_device_entity` on `switch.front_yard_holiday_decorations`, name "Halloween", `icon: mdi:halloween`, `tap_action: navigate` → `/dashboard-kohbo/holidays-halloween`, `haptic: light`
- `conditional` on `input_boolean.christmas_season_active` == `on` → `kohbo_device_entity` on `switch.christmas_lights`, name "Christmas", `icon: mdi:pine-tree`, navigating to `/dashboard-kohbo/holidays-christmas`

Use `condition: state` only; conditional cards reject `condition: template`. In season the grid has 7 cells, so one row is half-full.

## Decisions

**John, 2026-10-16:**
- **A. Christmas master group:** hide "All Christmas Lights" out of season (the conditional in View 3). The proper group fix, taking the front yard out of `switch.christmas_lights`, is a separate follow-up package PR and not in this one.
- **B. Home tile:** yes. Build the optional Home task, with one conditional tile per season, in its own commit.
- **C. Spots card:** yes, reuse `custom:hue-like-light-card` with each spot listed once.

1. **Dashboard-only.** No package, scene or registry changes in this PR.
2. **Tabbed section, not a hub with back arrows**, with tabs ordered Overview, Halloween, Christmas. It matches Climate and Rooms.
3. **One shared settings popup** with Halloween and Christmas sections (the climate pattern), feature-level automations only (5 rows).
4. **Fill `halloween.yaml`** rather than delete it. The route is already in the header and the file is already registered.
5. **Group controls as section headers, members as plug tiles.** John asked for "turn on trees" and "playroom lights" as well as the individual trees and window lights. Each group's toggle heads its section (`horizontal_action_card`) instead of sitting as a duplicate tile among its members. The front-yard group on the Christmas page has no member grid.
6. **"All Christmas Lights" is hidden out of season** (finding 1) until the group is fixed.
7. **The hue-like-light-card for the spots**, fed the 14 spot entities, not the group, so it keeps the per-spot colour gradient. The 14 spots never appear as separate tiles.
8. **The season toggle is `christmas_season_active`.** `christmas_active` stays off the page.
9. **Fix the navbar icon** (`mdi:holidays` → `mdi:calendar-star`). It's a one-line dashboard fix in the route this PR builds.
10. Standing preferences: no `confirmation`, boolean layout include on every row, every view registered in `kohbo.yaml`, no inline CSS, no PII (no Santa scripts, no child names, no person-tied times).

## Tasks

All work happens in `.claude/worktrees/holiday-dashboard` on `feature/holiday-dashboard`. Commits go in task order.

1. **Entity re-check (read-only).** Using a fresh live dump, confirm every entity in this plan exists. Check `scene.*` by hand, because the validator's regex skips the `scene` domain.
   - AC: the only `unavailable` entities are `switch.smart_plug_17_switch`, `sensor.smart_plug_17_power` and `light.hue_spot_12_light`. Anything else is reported before building.
   - AC: `switch.front_yard_holiday_decorations` members are exactly the 4 outlets, and neither Hue power plug is in any entity list in the diff (`git diff origin/master...HEAD -- dashboards | grep -c front_left_hue_lights` prints 0, on the final diff).
2. **Header + popup** (one commit).
   - Edit `holiday_header.yaml` routes as specified.
   - Create `holidays/_holidays_settings_popup.yaml`.
   - AC: 3 tabs in order, with valid MDI icons.
   - AC: the popup has exactly the 5 rows listed, each with the boolean include, and the hash matches the header's chip.
3. **Overview view.** Rewrite `holidays.yaml` as View 1.
   - AC: `path: holidays`, `subview: true`, two `horizontal_action_card`s, and the popup include.
4. **Halloween view.** Write `halloween.yaml` as View 2.
   - AC: `path: holidays-halloween`, and the file is no longer empty.
   - AC: no `scene.front_yard_halloween`, no Hue power plugs, and the hue-like card lists 14 unique entities.
5. **Christmas view.** Rewrite `christmas.yaml` as View 3.
   - AC: `path: holidays-christmas`, and the All card sits inside a `conditional` on `christmas_season_active`.
   - AC: 6 plug tiles with the names and sensors in the tables.
   - AC: no `confirmation`, `christmas_active`, script or `light.christmas_*`.
   - AC: no inline `card_mod: style:` in any of the three views (`grep -rn "style:" dashboards/kohbo/holidays/` is empty; this covers the view files only, since templates carry their own card_mod).
6. **Navbar icon.** In `templates/includes/navbar.yaml`, change `mdi:holidays` → `mdi:calendar-star`.
   - AC: a one-line diff.
   - `kohbo.yaml` needs no change: all three views are already registered. AC: `kohbo.yaml` is untouched.
7. **Home tiles (optional, own commit; skip if John says no).** Add the two conditionals to `home/home.yaml` as specified.
   - AC: `condition: state` only.
8. **Docs (own commit).**
   - `dashboards/SITEMAP.md`: replace the Holidays section with the 3 views and the shared popup, add the popup to the tree, and bump "Last updated".
   - Create `dashboards/kohbo/holidays/README.md` in the format of the sibling READMEs (overview, file structure, the season boolean vs `christmas_active` distinction, and the master-group caveat). `DOCUMENTATION_PLAN.md` already links it.
   - Add `hue-like-light-card` to the HACS table in `dashboards/CLAUDE.md`.
   - `dashboards/LEARNINGS.md`, one bullet: an empty `!include` in `views:` becomes a blank `{}` view at its numeric index, and the path it was meant to have doesn't exist.
   - AC: every new file appears in the README tree and in SITEMAP.
9. **Validate (scripted).** Run against the committed branch and paste the output into `plans/holiday-dashboard/build-log.md` (own commit):
   - `python3 /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/validate_dash.py /Users/johnkoht/code/hassio-config/.claude/worktrees/holiday-dashboard /private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad/live_states.json` (with a fresh dump). It checks includes, decluttering variables against template tokens, and live entities.
   - `tests/run.sh` in full.
   - `yamllint -c .yamllint` on every touched YAML file.
   - A PII grep of the added lines (child names, Santa, times tied to people, station or school names).
   - gitleaks runs in the commit hook. Never pass `--no-verify`. If `deploy.sh --check` is used, pass `--skip-ci` (it deletes `secrets.yaml` otherwise). Never deploy, reload or restart.
   - AC: the validator reports 0 problems. Its only notes are plug 17, its power sensor and spot 12.
   - AC: tests, yamllint and the PII grep are clean.
   - AC: the scene IDs are hand-checked live.
10. **Browser verification, after John deploys** and reloads the dashboard himself.
    - AC: every item in the checklist below passes.

## Risks

- **Lovelace YAML has no test coverage, and HA's config check ignores dashboards.** Mitigation: the validator, the hand check of scene IDs, and the browser pass.
- **The hue-like card's on/off bypasses `input_boolean.exterior_accent_lights`.** Spots switched on from the card aren't turned off by the bedtime automation, which acts on the boolean. Mitigation: the Accent Lights boolean row sits directly above the card as the main control. Note it in the README.
- **The hue-like card has its own styling**, which may not match the kohbo theme. Fallback: a tile with brightness (open question 3).
- **The scene buttons turn the spots on**, even in daylight. That's intended for a manual button.
- **An unavailable plug reads "Off"** in `kohbo_device_smart_plug_entity` (finding 5). Window Lights 5 will look off, not offline. Template fix in backlog.
- **The conditional "All Christmas Lights" card leaves the Christmas page without a master toggle out of season.** Accepted; the per-group toggles cover it.
- **The shared header and popup are on three views.** One bad include breaks all three. The validator covers includes.

## Post-deploy checklist (phone width)

1. More → Holidays shows the calendar-star icon and opens `/dashboard-kohbo/holidays` with no red cards.
2. The tabs read Overview / Halloween / Christmas, each opens its page, and the active tab is underlined.
3. Overview: the Halloween card reads On, Christmas reads Off, the toggles work, and the chevron and card tap open each page.
4. Halloween: the season row, the decorations toggle (all 4 outlets follow), the 4 plug tiles, the Accent Lights row, the Outdoor Spots card (count, brightness slider, gradient), and "Halloween Colors" applies the HA scene.
5. Christmas (out of season): no "All Christmas Lights" card. The Trees, Playroom and Front Yard group toggles work, the 6 plug tiles show their wattage while on, and Window Lights 5 reads Off (known, finding 5). "Christmas Colors" applies the Hue scene. Flip the season on briefly to see the All card appear, then turn it back off. That also runs the enable/disable scripts, which is harmless out of season.
6. The settings chip opens the same popup on all 3 tabs: 5 rows, friendly names, and it fits the screen.
7. `/dashboard-kohbo/42` no longer shows a blank view (it's now a real page or a different index).
8. Home (if task 7 ships): the Halloween tile shows in the Overview grid now and opens the Halloween page; no Christmas tile.
9. The Hue spots stay powered throughout. `switch.front_yard_outdoor_front_left_hue_lights` and `_2` are still on.

## Open questions (John)

1. **The Christmas master group** includes the front-yard plugs, so it reads ON during Halloween (and Alexa's "Christmas lights" controls the Halloween inflatables). Default: the page hides "All Christmas Lights" out of season now. A follow-up package PR takes the front yard out of `switch.christmas_lights` and targets it in `turn_on/off_christmas_lights` and `christmas_not_activated`.
2. **A Home tile for the active season?** Default: yes. Task 7 adds one conditional tile per season in Home → Overview, in its own commit.
3. **`hue-like-light-card` on kohbo**, a new card type for this dashboard with its own look? Default: yes, since John liked it on the old dashboard. Fallback: a brightness tile on `light.exterior_accent_lights`.

## Out of scope (backlog)

- **The Christmas master group fix** (open question 1). It's a package change and changes Alexa exposure.
- **`christmas_enabled` / `christmas_disabled` have `initial_state: false`**, so the Dec 1 and Jan 7 auto start/stop never run. `christmas_disabled`'s month test (`d.month > 2`) also skips February.
- **`halloween_lights_turn_off` fires on HA start with no time or season check.** A midday restart turns the decorations off while `halloween_lights_turn_on` (also on start) turns them on: a race. It also runs at 10pm and bedtime all year, so it turns off Christmas front-yard decorations too.
- **Registry ghosts** `automation.turn_on_holiday_lights` / `turn_off_holiday_lights` (delete in the UI), plus the commented-out YAML in `packages/outdoor_lighting.yaml`.
- **`christmas_shortcut_button`** (`initial_state: off`, its IKEA button is unavailable) and **`handle_ikea_unresponsive`** (it targets 4 unavailable Tradfri plugs).
- **"Christman" alias typos** (renaming changes the entity IDs).
- **Legacy syntax across `packages/holidays/christmas/**`** (root `entity_id` in actions, `script.turn_on` with root `entity_id`).
- **An HA Christmas scene for the spots** like `halloween_front_yard_spots`, covering spots 11–14. Capture the colours in December.
- **`kohbo_device_smart_plug_entity` shows "Off" for unavailable plugs.**
- **Playroom page:** plug 18 ("Bay Window") uses plug 16's power sensor, and its plug tiles use `confirmation: true`.
- **`rooms/active_rooms.yaml` is included twice** in `kohbo.yaml` `views:` (duplicate `rooms-active` path).
- **The xmas daily-energy sensors** aren't defined in this repo (source unknown; not on the page).
- **John's old `lovelace.ui_test` dashboard:** retire it once this ships.
- **Linear:** JK-947/1053/1054 are in "New Tablet Dashboard" but are built on kohbo. Move them or open tablet follow-ups.

On approval → /approve → /ship holiday-dashboard
