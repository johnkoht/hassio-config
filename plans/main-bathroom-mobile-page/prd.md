# PRD: Main Bathroom Mobile Page (JK-1221)

## Goal

Add a Main Bathroom room page at `/dashboard-kohbo/rooms-main-bathroom` that follows the existing room-page pattern and is reachable from every room entry point. Fix the door tile so single-sensor doors show their real state.

## Global rules (apply to every task)

- **Worktree:** work only in `.claude/worktrees/main-bathroom-mobile-page` (branch `feature/main-bathroom-mobile-page`). Never touch the main checkout's branch.
- **No deploys:** never deploy, reload or restart HA. Use `deploy.sh --check` only with `--skip-ci`.
- **Patterns:** copy variable names from template definitions, not from memory. Use the shared includes, with no inline CSS.
- **Privacy:** this is a public repo, so put no PII in files, commits or PRs.
- **Live entity dump:** `$SCRATCH/live_states.json`, where SCRATCH=/private/tmp/claude-501/-Users-johnkoht-code-hassio-config/49791871-b2d8-47fa-a55e-1a4669dd45cf/scratchpad. Every new entity reference must exist in it.

## Tasks

### Task 1: Live entity verification

Dump live states read-only:

```
ssh hassio 'curl -s -H "Authorization: Bearer $SUPERVISOR_TOKEN" http://supervisor/core/api/states'
```

Then resolve:

- every entity in plan.md
- the automation entity IDs for the `packages/main_bathroom` aliases (`automation.<slug(alias)>`)
- whether `switch.smart_plug_12_switch` and `switch.smart_plug_13_switch` have active-power sensors
- the `room:` value that `room_card` expects (read `templates/decluttering/room/room_card.yaml` to see what it does with `[[room]]`)
- the `entity_id` attribute of every entity passed to `kohbo_device_door_entity` across `dashboards/kohbo`

**Reads:**
- plan.md
- pre-mortem.md, Risks 1 and 4
- `dashboards/templates/decluttering/room/room_card.yaml`
- `packages/main_bathroom/**`

**AC:**
- `live_states.json` exists.
- `working-memory.md` lists the pinned automation entity IDs, the missing or unavailable entities (or "none"), the plug power result, the `room:` value with evidence, and a door-template entity table (entity, member count).

### Task 2: Door template fallback

In `dashboards/templates/button_cards/cards/devices/kohbo_device_door_entity.yaml`:

```js
const members = entity.attributes.entity_id;
const doorEntities = (Array.isArray(members) && members.length) ? members : [entity.entity_id];
```

Make it its own commit.

**Reads:**
- that file
- the Task 1 door table

**AC:**
- A single binary_sensor gives total 1, so the tile shows Open or Closed from its own state.
- Groups that publish members behave exactly as before.
- The commit touches only that file.

### Task 3: Page file

Create `dashboards/kohbo/rooms/upper_floor/main_bathroom.yaml` per the plan.md layout, mirroring `main_bedroom.yaml`'s structure.

**Reads:**
- `dashboards/kohbo/rooms/upper_floor/main_bedroom.yaml`
- `dashboards/kohbo/rooms/main_floor/mudroom.yaml`
- the template defs for `room_page_top_toolbar`, `room_overview` and `climate_overview`
- the button-card defs under `templates/button_cards/cards/devices/` for door, smart plug, generic and leak

**AC:**
- `path: rooms-main-bathroom` and `subview: true`.
- 3 light tiles (vanity, ceiling, toilet), and no tile for the group.
- `climate_overview` with the bathroom temperature and humidity plus the bedroom Awair CO2 and VOCs, a YAML comment naming the source, and no `pm25_sensor`.
- A devices grid with 5 tiles using the templates in plan.md. The plugs have `confirmation: true`.
- Quick settings has 3 entities, each confirmed live.
- A settings popup with `hash: '#main_bathroom_settings_popup'` and the pinned entities. The bedtime script has an explicit `name:`.
- The navbar include is the last card.

### Task 4: Registration

**Changes:**
- Add a views entry to `dashboards/kohbo/kohbo.yaml`, in the upper-floor block.
- Create `dashboards/kohbo/rooms/upper_floor/partials/main_bathroom_card.yaml` on `room_card`.
- Include the card in `upper_floor_index.yaml`, next to Main Bedroom.
- Add a conditional block in `active_rooms.yaml` on `input_boolean.main_bathroom_occupied`.
- Add a Main Bathroom shortcut to the navbar Rooms popup.

**Reads:**
- `kohbo.yaml`
- `main_bedroom_card.yaml`, `mudroom_card.yaml` (avoid its `room: "foyer"` slip)
- `upper_floor_index.yaml`
- `active_rooms.yaml`
- `templates/includes/navbar.yaml`

**AC:**
- Each shared-file diff is a few lines that mirror a neighbouring entry.
- The card's `navigation_path` is `/dashboard-kohbo/rooms-main-bathroom`.
- `room:` is the Task 1 value.
- `aqi` uses `sensor.main_bedroom_awair_score` only if `room_card` renders it cleanly; otherwise it's omitted.

### Task 5: Gianluca navbar fix

In `navbar.yaml`, change `rooms-gianlucas-bedroom` to `rooms-gianluca-bedroom`. Make it its own commit.

**AC:**
- The path matches `gianlucas_bedroom.yaml:3`.
- A repo-wide grep finds no `rooms-gianlucas-bedroom`.

### Task 6: Docs

**Changes:**
- `dashboards/SITEMAP.md`: the Upper Floor list, the tree, and Last updated.
- `dashboards/kohbo/rooms/README.md`: the tree, the Active Rooms list, the Upper Floor list, and a "register in kohbo.yaml views" step under Adding a New Room.
- `dashboards/CLAUDE.md`: the same step under "Adding a New Room View".
- Note the door-template fallback anywhere it's documented (grep `kohbo_device_door_entity` in md and mdc files).

**AC:**
- Every listed doc mentions the main bathroom page or the new step.
- No stale claims.
- Docs stay short.

### Task 7: Validation

**Checks:**
- Run `tests/run.sh --syntax`, and compare its failures against the master baseline.
- Run `yamllint -c .yamllint` on the touched files.
- Write a scratch script in `$SCRATCH` that checks three things across the touched files:
  - every `!include` path resolves, with `/config/` mapped to the worktree root
  - every decluttering `variables` key appears as `[[key]]` in its template
  - every entity ID exists in `live_states.json` and isn't unavailable or unknown

**AC:**
- No new syntax failures compared with baseline.
- yamllint is clean on the touched files.
- The script exits 0, or each exception is justified in build-log.md.
- Its output is pasted into build-log.md.

## Post-deploy checklist (John deploys; not part of the build)

Run plan.md task 10, the 8 browser checks at phone width.
