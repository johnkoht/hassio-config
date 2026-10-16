## Review: Main Bathroom Mobile Page

**Type**: Plan (pre-execution)
**Review Path**: Full (independent reviewer, claims verified against the repo)
**Complexity**: Small to Medium. 9 steps, 1 new page, 1 new partial, 5 edited files (`kohbo.yaml`, `upper_floor_index.yaml`, `active_rooms.yaml`, `navbar.yaml`, 2 docs plus `SITEMAP.md`). Many files, but it is all pattern-following YAML. The risk sits in runtime-only failures, not in logic.
**Recommended Track**: standard (see Verdict)

### Claim verification

| Plan claim | Result |
|---|---|
| `rooms/upper_floor/main_bedroom.yaml` exists and is a good template | Exists and the structure matches. Several parts need substitution (see Concerns 1 and 2). |
| Permalink is `/dashboard-kohbo/rooms-main-bathroom` | Confirmed at `packages/house/areas/upper_floor/main_bathroom.yaml:12` (`permalink: "/dashboard-kohbo/rooms-main-bathroom"`). `occupied_room_card.yaml:156` reads `entity.attributes.permalink`, so the Home link works once the page `path:` matches. |
| `room_page_top_toolbar` variables | `navigation_path`, `name`, `settings_path` (`dashboards/templates/decluttering/layout/room_page_top_toolbar.yaml:21,27,36`). The plan's description is correct, but it does not name the `name:` variable. Copy `main_bedroom.yaml:10-13`. |
| `room_overview` variables | `mode`, `occupancy`, `ble_presence` (`decluttering/room/room_overview.yaml:31,39,53`). Correct. |
| `room_card` variables | `mode`, `occupancy`, `room`, `room_name`, `navigation_path`, `icon`, `temperature`, `humidity`, `aqi`, `room_devices` (`decluttering/room/room_card.yaml:10-47`). The plan omits `icon` and `aqi`. |
| A climate template exists that takes temperature AND humidity | **No such template exists.** See Concern 1. |
| Gianluca navbar bug is real | **Confirmed.** `navbar.yaml:33` has `rooms-gianlucas-bedroom`. `gianlucas_bedroom.yaml:3` has `path: rooms-gianluca-bedroom`. The navbar link is dead. |
| `mudroom_card.yaml` `room: "foyer"` slip | **Confirmed** (`main_floor/partials/mudroom_card.yaml:9`). |
| `active_rooms.yaml` / index include pattern | Confirmed. `active_rooms.yaml:145-150` wraps the partial in `type: conditional` + `condition: state`, with `!include .../partials/<room>_card.yaml`. `upper_floor_index.yaml` includes the partial directly in the vertical-stack, then adds the media popups. The plan describes both correctly. |
| `kohbo.yaml` registration is missing from the docs | Confirmed. The upper-floor block is at `kohbo.yaml:57-62`, and `rooms/README.md:400+` ("Adding a New Room", steps 1-4) never mentions it. |
| Validation tooling | `.yamllint` exists at the repo root (CI uses it, `.github/workflows/ha-check.yml`). `.githooks/pre-commit` runs gitleaks. `tests/` has `test_yaml_syntax.py`, which globs all `**/*.yaml` with an include-tolerant loader (`tests/conftest.py:126-151, 231`). `test_entity_references.py` also exists. The plan hand-rolls "a loader that accepts `!include`" instead of using `tests/run.sh --syntax`. |

### Concerns

1. **No climate template takes temperature + humidity (HIGH).** `climate_overview` (`decluttering/climate/climate_overview.yaml`) *requires* `temperature_sensor`, `humidity_sensor`, `carbon_dioxide_sensor`, `vocs_sensor`, `pm25_sensor` and `room_name` (the humidity/CO2/VOC/PM2.5 button-cards sit at about lines 36-52). The main bathroom has no CO2/VOC/PM2.5 sensors. `climate_overview_linkable` and `climate_temperature_only` take only `temperature_sensor` + `room_name`. The plan's fallback ("`climate_temperature_only` plus a humidity tile") is the only workable route, but "a humidity tile" is unspecified. Two things in the plan are also unconfirmed. `sensor.main_bathroom_temperature` is not defined anywhere in the repo. It appears only in `dashboards/kohbo/climate/hvac.yaml` and `legacy.yaml` as a consumer, so it is live-only. `sensor.main_bathroom_humidity` is referenced by `packages/main_bathroom/main_bathroom_shower.yaml` but not defined here. Both need task-1 live confirmation. Decide now which humidity tile to use. `kohbo_aqi_humidity_item` already exists under `button_cards/cards/aqi/` and is the natural reuse. Creating a new one-off would violate the rule below.

2. **`kohbo_device_door_entity` is built for a group and silently misreports a bare binary_sensor (HIGH).** `button_cards/cards/devices/kohbo_device_door_entity.yaml` computes open/closed from `entity.attributes.entity_id` (a group's member list). With a plain `binary_sensor.main_bathroom_door_sensor_status`, `doorEntities` is `[]`, `openCount` is 0, and the card always reads "Closed". `main_bedroom.yaml:~118` has the same latent issue, so copying it propagates the bug. The plan says "`kohbo_device_*` button-cards for the door" without picking one. Options: use `kohbo_device_entity` with an explicit icon, or give the door template a no-group fallback (out of scope, so file separately). The right choice must be stated in the plan.

3. **No template mapping for the device types (MEDIUM).** The plan lists door, shower input_boolean, leak, steamer and hair dryer without naming templates. What exists in `button_cards/cards/devices/`:
   - Door: `kohbo_device_door_entity` (group-oriented, see 2).
   - Outlets: `kohbo_device_smart_plug_entity`. It takes `power_sensor` and `confirmation` variables (`main_bedroom.yaml:~105-111`). The plan names `switch.smart_plug_12_switch` / `_13_switch`. Power sensors `sensor.smart_plug_12_summation_delivered` / `_13_` appear in the repo, but they are energy totals, not active power. `main_bedroom` uses `sensor.smart_plug_7_active_power`. Verify `sensor.smart_plug_12_active_power` / `_13_active_power` live rather than passing the wrong sensor or none. Hair-dryer and steamer both warrant `confirmation: true` as a safety choice, which the plan doesn't state.
   - Shower input_boolean: `kohbo_device_entity`.
   - Leak: there is no `kohbo_device_leak_entity`. A `kohbo_device_leak_entity_horizontal` exists (used at `kohbo/security/pages/leak_sensors.yaml:46`) but is horizontal-layout and belongs to the horizontal cards folder. A device grid with a horizontal card will look inconsistent. Use `kohbo_device_entity` with a droplet icon, or state the choice.
   The plan should pin one template per tile.

4. **"Pattern used twice becomes a template" rule is violated by the plan's own sequencing (MEDIUM).** `dashboards/CLAUDE.md` ("Never duplicate UI logic. If you use a pattern twice, make it a template", "Template everything, two uses = a new template") and `.cursor/rules/dashboards.mdc` are explicit. The plan hand-builds a bathroom page now and defers the shared small-bathroom decluttering template to JK-1222. Hand-building one page does not itself violate the rule, but there are two compounding issues. (a) The popup and device-grid pattern copied from `main_bedroom.yaml` is already duplicated across rooms, and the plan adds another copy. (b) The Quick Settings `entities` card repeats the `card_mod: !include .../kohbo_boolean_entity_layout.yaml` block per row, and the settings popup repeats `entity_generic_styles.yaml` per row. Both are existing patterns, and the plan should state explicitly that it reuses exactly these includes (not re-inline CSS) so the later refactor is mechanical. Acknowledge the deviation and link it to JK-1222 in the plan.

5. **Popup hash convention not specified (MEDIUM).** The plan says `#main_bathroom_settings_popup` in the toolbar (right, matches `main_bedroom.yaml` `#main_bedroom_settings_popup`). But the bubble-card must be created in the same page with the identical hash, plus `kohbo_popup_styles.yaml`, `margin_top_mobile/desktop: calc(100vh - 850px)` and `kohbo_popup_page_title`. The plan only says "a bubble-card listing...". Also: `main_bedroom_media_player` hashes sit in both `main_bedroom.yaml` and `upper_floor_index.yaml`. The bathroom has no media player so this isn't needed, which is correct, and the plan is right not to add one. Say so, so the builder doesn't copy the Music section by reflex.

6. **Entity completeness and naming errors (MEDIUM).**
   - The plan says "motion, occupancy, radar presence, illuminance and humidity sensors" in the popup but gives no IDs. From the repo: `binary_sensor.main_bathroom_motion_sensor_occupancy`, `binary_sensor.main_bathroom_motion_sensor_status`, `binary_sensor.main_bathroom_presence_sensor_radar_target`, `sensor.main_bathroom_motion_sensor_illuminance`, `sensor.main_bathroom_presence`. Task 1 verifies live, but pinning the candidates in the plan makes it testable.
   - Missed in the plan: `input_boolean.main_bathroom_lights_auto` (`packages/main_bathroom/main_bathroom_lights_auto.yaml`). Decide whether it belongs in Quick Settings.
   - The plan lists lights `light.main_bathroom_vanity_lights/_ceiling_lights/_toilet_light` and the group `light.main_bathroom_lights`. All confirmed in `packages/main_bathroom/lights/main_bathroom_light_group.yaml`. A second group, `light.main_bathroom_main_lights` (vanity + ceiling), also exists and is not mentioned.
   - `switch.adaptive_lighting_sleep_mode_main_bathroom(_toilet)` are referenced at `mode/main_bathroom_mode_auto.yaml:69-70` and `mode/main_bathroom_mode_bedtime.yaml:89-90`. The plan's risk 4 is right that they are not defined here. Note `main_bedroom.yaml` also uses `switch.adaptive_lighting_main_bedroom` (non-sleep). Check whether `switch.adaptive_lighting_main_bathroom` exists and whether it belongs.
   - Automation entity IDs: the settings popup needs `automation.<slug(alias)>`, not `<id>`. The plan knows this (memory: `reference_automation_entity_id_from_alias`). Aliases in the package are inconsistent in case/format ("Main bathroom occupied", "Main Bathroom - Turn On Outlets", "Main bathroom lights motion on"), so slugs must be taken from the live registry, not derived by guess. The shower file also contains `alias: Main Bedroom - Activate Bedtime Lighting Mode` (`mode/main_bathroom_mode_bedtime.yaml:72`), which is a trap if grepping by alias prefix. Mention this.

7. **Room card `aqi` / `icon` / `temperature` handling (LOW-MEDIUM).** `room_card` takes `aqi`, and `main_bedroom_card.yaml` passes it as a JS state read. A missing `aqi` sensor reading `states['x'].state` throws in the card. Mudroom handles absence with `humidity: null`. Follow that pattern for `aqi`, or confirm how `kohbo_room_card_overview` treats an undefined variable. Also `room: "main_bathroom"` is only meaningful if `sensor.<person>_room_presence` states emit `main_bathroom`. That needs a live check (`room_card_occupancy.yaml:105-129` compares `state: "[[room]]"`). The plan warns off the foyer slip but doesn't verify the actual presence-room string. Note `sensor.main_bathroom` also exposes empty `temperature`/`humidity`/`aqi` attributes (`packages/house/areas/upper_floor/main_bathroom.yaml:12-14`), already noted as out of scope.

8. **Active Rooms / Upper Floor ordering and the media popup block (LOW).** Placement "next to Main Bedroom" is fine. Note `upper_floor_index.yaml` has hard-coded popups for room media players after the vertical-stack. The bathroom doesn't need one. Also add the bathroom to the Active Rooms chip group only if per-room counts are listed (they are floor-aggregated, so no change needed).

9. **Docs scope under-specified (LOW-MEDIUM).** The plan names `SITEMAP.md` (its `*Last updated: January 24, 2026*` footer at line 294, plus the Upper Floor list around lines 76-87) and `rooms/README.md`. Check the README's "Room Cards Displayed" list (line ~74) and its two "Upper Floor Index" bullet lists. It also says to update `dashboards/CLAUDE.md` "Adding a New Room View" steps 1-4. Fine, but the same missing step is in `rooms/README.md:400-470` ("Adding a New Room"), and `.cursor/rules/dashboards.mdc` may carry its own copy of the checklist (not fully read). Grep all three. Per repo rule "Docs travel with the change", `docs/` (rooms docs) should also be checked for a main-bathroom mention.

10. **Navbar fix mixes scope (LOW).** Fixing the Gianluca link is a legitimate drive-by in the same file but is a separate defect. Acceptable if it is its own commit (or called out in the PR body), so the bug fix can be reverted independently. Also the navbar Rooms popup currently lists only 5 rooms (no floor-bathroom entries). Adding a sixth is fine. Check the popup does not overflow at phone width, since the layout is untested.

11. **Process: worktree and no-restart.** The plan states "Work happens in a worktree" in Risks but the Tasks list never creates one. `git worktree list` shows four existing worktrees under `.claude/worktrees/`, so the convention is real. /ship handles this, but the plan should say "branch `feature/main-bathroom-mobile-page` in worktree; push with explicit refspec" (memory: `reference_worktree_push_refspec`). The plan correctly leaves deploy to John ("After John deploys"). Add one explicit line: never restart HA. A dashboard YAML change needs only a browser refresh / `lovelace_reload()` (it is a `mode: yaml` dashboard, `configuration.yaml:56-61`). `./deploy.sh --reload` isn't required for it beyond pulling the files, and `deploy.sh --check` must be run with `--skip-ci` (memory: it deletes `secrets.yaml`). The plan mentions neither.

12. **Privacy (OK, one note).** Nothing in the plan is PII. Entity names are generic. The plan references Linear IDs (JK-1221 etc.) which is fine. The new page will not add family names. The `people` display relies on person entities already used in existing templates. Keep any plan or doc text free of schedule/routine details. Gitleaks hook is the guard.

### Test Coverage Gaps

Lovelace has no tests, so validation must be concrete. Task 9 is mostly adequate in outline but not in detail:

- "YAML-parse every touched file, using a loader that accepts `!include`": **use what exists**. `tests/run.sh --syntax` (`test_yaml_syntax.py`, with `HomeAssistantLoader` in `tests/conftest.py:126-151`) already globs every `**/*.yaml` including `dashboards/`, detects duplicate keys, and tolerates `!include`. Do not write a new loader. Run `tests/run.sh --syntax` and `--naming`/`--duplicates` as applicable. Check whether `test_duplicates.py` or `test_entity_references.py` scan dashboards. If not, say so.
- "Run `yamllint` with the repo config": `.yamllint` exists. State the command (`yamllint -c .yamllint <files>`). Note CI runs it on the whole repo (`.github/workflows/ha-check.yml`), so the new files must pass there.
- Gitleaks: `.githooks/pre-commit` runs it on staged changes. The worktree needs `git config core.hooksPath .githooks` (per clone/worktree config). The plan should say so.
- "Grep every entity in the new files against the live registry": the method is unspecified. The HA MCP server failed to connect in this session, and the plan notes the Yellow is the production host. Specify how (delegate to the `homelab` agent for a read-only registry/state dump, or `ssh hassio` and read `core.entity_registry`). Note YAML-platform entities (e.g. `light.main_bathroom_lights` from `platform: group`) have no `unique_id`-registry entry unless a `unique_id` is set (this one has it), and template entities need `unique_id` to appear. Also, `.storage` registry files include disabled and ghost entities, so check live state (not registry alone). A registry hit with state `unavailable` or `unknown` must be flagged.
- Template-variable correctness: nothing catches a misnamed decluttering variable. Add an explicit step: for each `decluttering-card` the new files use, diff the `variables:` names against `[[...]]` tokens in the template definition. A short script (grep `\[\[(\w+)\]\]` in the template, compare to `- name:` keys in the new file) is cheap and catches the exact failure mode the plan flags as risk 3.
- Include path check: every `!include /config/dashboards/...` path in the new files must resolve to a file under `dashboards/`. A one-line existence check catches typos that otherwise show as a blank card.
- Browser check: "screenshot the page at phone width and click through all the entry points" is the right idea but not bounded. Enumerate: (1) Home -> Occupied Rooms -> Main Bathroom lands on the page; (2) Upper Floor index card -> page; (3) navbar Rooms popup -> page (and Gianluca link -> his page); (4) Active Rooms card appears when `input_boolean.main_bathroom_occupied` is on (toggle it via Developer Tools, a state-only change, not a restart); (5) settings popup opens at `#main_bathroom_settings_popup`; (6) back button returns to Upper Floor; (7) the leak, door and plug tiles show plausible states; (8) browser console shows no card-config errors.

### Strengths

- Clear problem statement with the root cause verified: the permalink at `packages/house/areas/upper_floor/main_bathroom.yaml:12` really does point at a missing route, and the page path is specified verbatim (`rooms-main-bathroom`).
- Correctly identifies main_bedroom as a same-floor template and names the include/registration steps (`kohbo.yaml`, index, Active Rooms, navbar, docs) that are easy to forget. The "register in `kohbo.yaml`" doc gap is real.
- Spots two real defects: the Gianluca navbar path bug and the `room: "foyer"` slip in `mudroom_card.yaml`.
- Entity-verification is made task 1, gated before any file creation, and the registry vs. alias-derived automation ID trap is acknowledged.
- Out-of-scope items are fenced and tracked elsewhere. Deploy is left to John. Risks 1-4 are real and each has a mitigation.
- Privacy-neutral content, modern-syntax rules are not at risk (dashboard YAML, not automations).

### Devil's Advocate

**If this fails, it will be because...** the plan treats the dashboard as pattern-copying but the templates have hidden assumptions. The door template silently renders "Closed" for a plain binary_sensor, `climate_overview` hard-requires five sensors the bathroom does not have, and the room-card `room:` string is compared against presence-sensor states nobody has checked. None of these raise an error. Each renders a plausible-looking but wrong or blank card, and the only test is a manual browser pass after John deploys. Entities that exist only on the live host (temperature, humidity, door, leak, plug power) are checked once up front, by an unspecified method, against a registry that includes ghost and disabled entries. A `[[var]]` typo or a wrong include path shows as a broken card on the phone, discovered after merge and deploy rather than before.

**The worst outcome would be...** a merged and deployed page where the door tile always says "Closed" (wrong safety-relevant information for a bathroom door/leak view), the humidity tile is empty or errors the whole climate card, and the Active Rooms card throws on an undefined `aqi` and takes the entire Active Rooms page, a high-traffic mobile view, down with it, since the new conditional card is included in a shared page. A secondary bad outcome is a navbar edit that breaks the Rooms popup, which is on every page. A bad `kohbo.yaml` include (the registration entry) breaks the whole dashboard load, not just this page. Because the partial is included in both `upper_floor_index.yaml` and `active_rooms.yaml`, one bad partial affects both shared pages. No test catches this before deploy.

### Verdict

**Approve with suggestions**, conditional on fixing Concerns 1-3 in the plan before /approve (they are decisions, not discoveries, and cheap to resolve now). Complexity is Small to Medium (many files, but pattern-following), the risks are real but bounded to a dashboard that is refreshed and not restarted, and every mitigation is feasible. A full pre-mortem is not needed. The plan's own Risks section covers the main failure modes, and the concerns above are template-specific and resolvable by reading, not by a pre-mortem exercise. If the author prefers to treat it as Medium, the rule would require "Approve pending pre-mortem". I'd instead fold the shared-page blast radius (Concern 7 plus the worst-outcome paragraph) into the plan's Risks.

### Recommended Track

**standard.** Express would skip the review gates that matter here (the shared-page blast radius). Full is overkill for pure dashboard YAML with no automation logic.

### Suggested Changes

1. **Pick the climate and humidity approach**
   - What's wrong: no template takes temperature + humidity. `climate_overview` requires CO2/VOC/PM2.5 sensors the bathroom lacks (`decluttering/climate/climate_overview.yaml`, humidity/CO2/VOC/PM2.5 button-cards near lines 36-52). The plan's fallback "plus a humidity tile" is vague.
   - What to do: specify `climate_temperature_only` (`temperature_sensor`, `room_name`) followed by a `custom:button-card` with `template: kohbo_aqi_humidity_item`, `entity: sensor.main_bathroom_humidity`. Delete the "use whichever template takes both" sentence. Confirm `sensor.main_bathroom_temperature` exists live (it is only a consumer in `hvac.yaml`/`legacy.yaml`).
   - Where to fix: plan.md "Climate" bullet (line 30) and Task 1.

2. **Choose the door tile template**
   - What's wrong: `kohbo_device_door_entity` reads `entity.attributes.entity_id` (a group), so a plain `binary_sensor` always shows "Closed". `main_bedroom.yaml` has the same latent bug.
   - What to do: use `kohbo_device_entity` with an explicit `icon: kohbo:kohbo-door-closed` / state-based icon (or confirm a group wraps `binary_sensor.main_bathroom_door_sensor_status`). File a separate item for the template's missing fallback.
   - Where to fix: plan.md "Devices grid" (lines 32-37).

3. **Name a template per device tile**
   - What's wrong: the grid says "`kohbo_device_*` button-cards" without choosing. No leak template matches the grid (`kohbo_device_leak_entity_horizontal` is horizontal-only).
   - What to do: door -> as in 2; shower_occupied -> `kohbo_device_entity`; leak -> `kohbo_device_entity` with a `mdi:water-alert` icon; steamer/dryer -> `kohbo_device_smart_plug_entity` with `confirmation: true` and `power_sensor` set only if `sensor.smart_plug_12_active_power` / `_13_` exist live (the repo only references `summation_delivered`, which is energy, not power).
   - Where to fix: plan.md Devices grid and Task 1.

4. **Make the validation step concrete and use existing tooling**
   - What's wrong: Task 9 proposes a bespoke include-aware loader and an unspecified registry method.
   - What to do: replace with `tests/run.sh --syntax` (and `--naming`/`--duplicates`), `yamllint -c .yamllint <touched files>`, and gitleaks via `.githooks` (`git config core.hooksPath .githooks` in the worktree). Add two scripted checks: (a) decluttering `variables` names vs the template's `[[...]]` tokens, (b) every `!include /config/dashboards/...` path exists. State the registry method (delegate a read-only live-state dump to the `homelab` agent; flag `unavailable`/`unknown`). Use `./deploy.sh --check --skip-ci` only if run, since without `--skip-ci` it deletes `secrets.yaml`.
   - Where to fix: plan.md Task 9 (lines 56-60).

5. **Enumerate the browser acceptance checks**
   - What's wrong: "click through all the entry points" is unbounded.
   - What to do: list the 8 checks in Test Coverage Gaps above (Home link, Upper Floor card, navbar link and Gianluca link, Active Rooms card by toggling `input_boolean.main_bathroom_occupied`, settings popup hash, back button, tile states, console clean). Add phone-width screenshot requirement of the navbar popup.
   - Where to fix: plan.md Task 9 and Goal (line 20).

6. **Pin the popup and settings entity list**
   - What's wrong: the popup contents are described but not listed, and the hash/styling conventions are not stated.
   - What to do: list candidate IDs (`binary_sensor.main_bathroom_motion_sensor_occupancy`, `..._motion_sensor_status`, `binary_sensor.main_bathroom_presence_sensor_radar_target`, `sensor.main_bathroom_motion_sensor_illuminance`, `sensor.main_bathroom_humidity`, `input_number.main_bathroom_initial_humidity`); decide on `input_boolean.main_bathroom_lights_auto`; require `kohbo_popup_styles.yaml`, `kohbo_popup_page_title`, the 850px margins, and the shared `kohbo_boolean_entity_layout.yaml` / `entity_generic_styles.yaml` card_mod includes (no inline CSS). Get automation entity IDs from the live registry (aliases vary in case; one file contains a "Main Bedroom - Activate Bedtime Lighting Mode" alias at `mode/main_bathroom_mode_bedtime.yaml:72`).
   - Where to fix: plan.md Settings popup bullet (line 39) and Task 1.

7. **Guard the shared-page blast radius**
   - What's wrong: the new partial is included from two shared pages (`upper_floor_index.yaml`, `active_rooms.yaml`) and `kohbo.yaml`/`navbar.yaml` are loaded everywhere. An `aqi` read of a missing sensor or a bad include breaks pages beyond the new one.
   - What to do: in `main_bathroom_card.yaml` use `aqi: null` / `humidity` like `mudroom_card.yaml:13` if no AQI sensor exists, and verify `room_card`'s overview handles null. Add a Risk entry: "shared pages depend on this partial; validate include path and variables before commit". Stage the work as commits (page+registration; partial+index+active rooms; navbar; docs) so a revert is surgical.
   - Where to fix: plan.md Risks (lines 66-72) and Task 4.

8. **Verify the `room:` value against presence states**
   - What's wrong: `room: main_bathroom` is compared to `sensor.<person>_room_presence` states (`room_card_occupancy.yaml:105-129`). The plan fixes the foyer slip but never verifies the string the Bermuda presence sensors actually emit for this room.
   - What to do: add to Task 1: read the live state of a room-presence sensor or the presence mapping and confirm the exact string.
   - Where to fix: plan.md Task 1 and Task 4.

9. **Add the process lines**
   - What's wrong: no worktree/branch step, no explicit never-restart or push-refspec note, and the navbar bug fix is bundled.
   - What to do: Task 0: create worktree/branch `feature/main-bathroom-mobile-page`. State: dashboard YAML needs no HA restart (only a dashboard reload, `configuration.yaml:56-61` `mode: yaml`), John deploys, and push with the explicit refspec. Put the Gianluca navbar fix in its own commit. Add the full docs list: `SITEMAP.md` (Upper Floor list, tree, "Last updated" footer at line 294), `rooms/README.md` (tree near line 33, Active Rooms list near line 74, Upper Floor list, "Adding a New Room" at line 400), `dashboards/CLAUDE.md` "Adding a New Room View", and grep `.cursor/rules/dashboards.mdc` and `docs/` for room checklists.
   - Where to fix: plan.md Tasks (add 0) and Task 8.

10. **Acknowledge the template-rule deviation explicitly**
    - What's wrong: `dashboards/CLAUDE.md` says "If you use a pattern twice, make it a template", and the plan defers JK-1222 without saying so.
    - What to do: add one sentence under Approach: "This page hand-builds the device grid and settings popup, matching `main_bedroom.yaml`; extraction into the small-bathroom template happens in JK-1222." Reference only existing includes so the extraction is mechanical.
    - Where to fix: plan.md Approach (lines 22-24).
