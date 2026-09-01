# Working Memory — inovelli-lighting-sync

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns

*(Add: [Task N] pattern-name: description at file:line)*

- [Seed] The Office fix is the reference implementation and is already deployed and exercised in production. Read `packages/office/lights/office_lights_sync_switch_state.yaml`, `office_lights_sync_bulbs_from_switch.yaml`, `office_lights_group.yaml`, `office_lights_off.yaml` and commit `2e72108` before writing anything. Port, do not reinvent.
- [Seed] Repo convention: one automation per file, filename matches automation ID, every file opens with a header comment block. See `CLAUDE.md`.

## Active Gotchas

*(Add: [Task N] issue the next developer must know about)*

- [Seed] **Never write to `/config/.storage`.** SSH to `hassio` is read-only, for entity verification via the supervisor REST API only. ZHA bindings and Adaptive Lighting config entries are John's UI clicks and are explicitly out of scope.
- [Seed] **Never restart Home Assistant. Never run `deploy.sh --check`** — its guard tests for the docker binary rather than a running daemon and it deletes the gitignored `secrets.yaml`, which is unrecoverable. Use `--skip-ci`. The build neither pushes nor deploys.
- [Seed] **Two entities that look interchangeable are not.** `light.gianluca_ceiling_lights` is the **ZHA group** (platform=zha); `light.gianluca_bedroom_lights` is the **YAML helper group** (platform=group). Adaptive Lighting can expand an HA group but NOT a ZHA group entity, so automations and dashboards must target `light.gianluca_bedroom_lights`.
- [Seed] Unlike the Office, there is **no entity_id collision here** — do NOT rename `light.gianluca_bedroom_lights`. Renaming would orphan a working entity for no gain.
- [Seed] **Not every switch reference is a bug.** A paddle press is a legitimate presence signal, so a *trigger* on `light.gianluca_ceiling_light_switch` may be correct. The Office deliberately kept the equivalent trigger at `office_occupied.yaml:31`. Only actions and conditions that attempt load control are wrong. Evaluate each hit; do not blind-replace.
- [Seed] **Verify entity existence, always.** The Office audit found `light.office_all_lights_group` and `binary_sensor.office_aqara_motion` did not exist, silently making automations no-ops for months. Assume the same class of bug here.
- [Task 1] **Found the Gianluca equivalent bug**: `dashboards/kohbo/rooms/upper_floor/gianlucas_bedroom.yaml:27` references `sensor.gianluca_room_people_list`, which does not exist. The live entity (backed by the same template in `packages/gianluca_room/occupancy/gianluca_room_ble_presence.yaml`) is actually `sensor.gianlucas_room_people_list` (note the extra "s" — matches the `<room>_people_list` naming convention used by every other room, e.g. `sensor.ninos_room_people_list`, `sensor.office_people_list`). The YAML's `unique_id: gianluca_room_people_list` never matched the entity_id HA actually assigned. This is a dashboard fix, not a package fix — flag it for task-4 even though the PRD's line list for that file (`gianlucas_bedroom.yaml:53,148,151`) doesn't mention line 27.
- [Task 1] Confirmed no `sensor.<room>_people_list`-style naming bugs elsewhere in the file — grepped the full live entity dump for every other Gianluca reference and found zero additional drift. Treat this as an isolated one-off, not a systemic naming pattern to re-audit elsewhere in this build.

## Shared Utilities Created

*(Add: [Task N] functionName() in path/to/file)*

- [Seed] YAML validation snippet (no `ha core check` from the dev machine):
  ```python
  import yaml
  class L(yaml.SafeLoader): pass
  for t in ['!include','!include_dir_named','!include_dir_list',
            '!include_dir_merge_list','!include_dir_merge_named','!secret','!env_var']:
      L.add_constructor(t, lambda l, n: None)
  ```
- [Seed] Live entity check (read-only):
  ```bash
  ssh -o BatchMode=yes hassio 'curl -s -H "Authorization: Bearer $SUPERVISOR_TOKEN" \
    http://supervisor/core/api/states/<entity_id>'
  ```

## Context Corrections

*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Entity Inventory (task-1 output)

*(task-1 populates this: every entity referenced in packages/gianluca_room/** and the upper-floor dashboards, marked EXISTS or MISSING)*

Verified live against `hassio` (192.168.1.36) via the supervisor REST API on 2026-09-01. Method: batch `curl -H "Authorization: Bearer $SUPERVISOR_TOKEN" http://supervisor/core/api/states/<entity_id>` over one SSH session, 54 unique entities checked. Full state dump also pulled once to resolve the MISSING entity below and confirm no collisions.

### MISSING ENTITY FOUND — same bug class as the Office

**`sensor.gianluca_room_people_list`** referenced at `dashboards/kohbo/rooms/upper_floor/gianlucas_bedroom.yaml:27` (`ble_presence:` variable in the `room_overview` decluttering card) **does not exist on the live system.**

- The template sensor that was clearly meant to back this — `packages/gianluca_room/occupancy/gianluca_room_ble_presence.yaml` (name: "Gianluca's Room People List", `unique_id: gianluca_room_people_list`) — is live, but its actual entity_id is **`sensor.gianlucas_room_people_list`** (with the "s" — `gianlucas_`, not `gianluca_`), matching the sibling entities `sensor.ninos_room_people_list`, `sensor.office_people_list`, `sensor.family_room_people_list`, etc.
- Root cause: the entity_id was almost certainly assigned by HA from the `name:` field the first time this template loaded (before the file's `name:` picked up the apostrophe/possessive form used today), and the entity registry has kept that entity_id stable ever since via `unique_id`, even though the filename/unique_id string itself says `gianluca_room_people_list` (no "s"). The YAML `unique_id` and the live `entity_id` have simply diverged — this is a naming drift bug, not a missing-integration bug.
- **This is not in task-1's edit scope** (dashboards are task-4's job), but it must be fixed there. Correct replacement: **`sensor.gianlucas_bedroom.yaml:27` → `ble_presence: sensor.gianlucas_room_people_list`**. Unambiguous — the sensor exists, is live, and is clearly the intended source (confirmed via `GET /api/states` attributes: `{"people": [], "friendly_name": "Gianluca's Room People List"}`).
- Flagging for whoever runs task-4: this file is in task-4's known-hits list (`gianlucas_bedroom.yaml:53,148,151`) but line 27 was **not** called out in the PRD — it needs to be added to that task's diff.

No other MISSING entities were found. Every `light.*`, `binary_sensor.*`, `input_boolean.*`, `input_select.*`, and `sensor.*` reference in the Gianluca package and its dashboards resolves to a live entity, as does every `fan.*`, `switch.*`, `number.*`, `automation.*`, `group.*`, `input_number.*`, and `script.*` reference checked opportunistically alongside them.

### Confirmed per Acceptance Criteria

- **`light.gianluca_bedroom_lights`** — confirmed `platform=group` (YAML helper group). Live API returns `"entity_id": ["light.gianluca_ceiling_light_1", "light.gianluca_ceiling_light_2", "light.gianluca_ceiling_light_3", "light.gianluca_ceiling_light_4"]` — exactly the 4 ceiling lights, matching `packages/gianluca_room/lights/gianluca_lights_group.yaml:5-9`. Confirmed defined via `unique_id: gianluca_bedroom_lights` at `gianluca_lights_group.yaml:4`.
- **No entity_id collision** — full-state dump grep for `bedroom_lights` shows exactly one `light.gianluca_bedroom_lights` entity (friendly_name "Gianluca Bedroom Lights"); the only other neighbor is the unrelated `light.main_bedroom_lights`. Unlike the Office (`light.office_all_lights_group` colliding with a Hue-app-created group), there is no second entity fighting for this entity_id. Confirmed by direct repo grep too — `gianluca_bedroom_lights` appears in exactly 3 places in the repo (automation id, unique_id, dashboard `light_entity` variable), none of which define a second `platform: group` for it.
- **`light.gianluca_ceiling_lights`** — confirmed the separate ZHA group entity (platform=zha): live API shows a `"group_entities"` attribute (ZHA's group-attribute name, distinct from the YAML group's `"entity_id"` list attribute) containing the same 4 lights, friendly_name "Gianluca's Lights". This is the entity Adaptive Lighting cannot expand — matches the seeded gotcha.
- **No Bayesian presence sensor** — confirmed by reading every file in `packages/gianluca_room/occupancy/` (`gianluca_room_ble_presence.yaml`, `gianlucas_bedroom_presence.yaml`, `gianlucas_room_occupancy.yaml`) and grepping the whole package for "bayesian" (zero hits). Presence is 100% BLE-derived: `gianlucas_bedroom_presence.yaml` is a template sensor built from `expand('group.room_presence_devices')`, and occupancy on/off (`modes/gianlucas_room_occupied.yaml` / `gianlucas_room_not_occupied.yaml`) is driven by door sensor + bed sensor + the switch's own on/off state — no Bayesian sensor anywhere in the chain. The Office's lights-on-causes-occupied feedback loop structurally cannot occur here because there is no "lights on" automation at all (confirmed — `packages/gianluca_room/lights/` contains only `gianluca_lights_group.yaml`, `gianluca_lights_off.yaml`, and the two lamp-remote files; no `gianluca_lights_on.yaml` exists).

### Full inventory by file

`packages/gianluca_room/lights/gianluca_lights_group.yaml`
| Entity | Line | Status |
|---|---|---|
| light.gianluca_ceiling_light_1 | 6 | EXISTS |
| light.gianluca_ceiling_light_2 | 7 | EXISTS |
| light.gianluca_ceiling_light_3 | 8 | EXISTS |
| light.gianluca_ceiling_light_4 | 9 | EXISTS |
| light.gianluca_bedroom_lights (defined here, unique_id l.4) | — | EXISTS |

`packages/gianluca_room/lights/gianluca_lights_off.yaml`
| Entity | Line | Status |
|---|---|---|
| input_select.gianlucas_bedroom | 8, 28 | EXISTS |
| input_boolean.gianlucas_room_occupied | 12, 21, 32 | EXISTS |
| input_boolean.lighting_automations | 16 | EXISTS |
| light.gianluca_ceiling_light_switch | 36 | EXISTS (but load-control no-op in Smart Bulb Mode — task-2's job) |

`packages/gianluca_room/lights/gianluca_lamp_remote_brightness_cycle.yaml` / `gianluca_lamp_remote_toggle.yaml`
| Entity | Line | Status |
|---|---|---|
| light.gianluca_lamp | both files | EXISTS |

`packages/gianluca_room/gianlucas_room_state.yaml`
| Entity | Line | Status |
|---|---|---|
| input_select.gianlucas_bedroom (defined here) | — | EXISTS |

`packages/gianluca_room/modes/gianlucas_room_mode_auto.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.gianlucas_room_occupied | 10, 45 | EXISTS |
| input_select.house | 14 | EXISTS |
| input_boolean.house_occupied | 18, 33 | EXISTS |
| input_boolean.gianluca_in_bed | 22, 49 | EXISTS |
| input_boolean.bedtime | 28, 40 | EXISTS |
| input_select.gianlucas_bedroom | 37, 54 | EXISTS |

`packages/gianluca_room/modes/gianlucas_room_mode_bedtime.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.gianluca_in_bed | 10 | EXISTS |
| input_boolean.house_occupied | 15 | EXISTS |
| input_select.gianlucas_bedroom | 19, 23 | EXISTS |

`packages/gianluca_room/modes/gianlucas_room_mode_off.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.house_occupied | 10, 29 | EXISTS |
| input_select.house | 14, 33 | EXISTS |
| input_select.gianlucas_bedroom | 24, 38 | EXISTS |

`packages/gianluca_room/modes/gianlucas_room_not_occupied.yaml`
| Entity | Line | Status |
|---|---|---|
| binary_sensor.gianlucas_door_sensor_status | 8, 34 | EXISTS |
| light.gianluca_ceiling_light_switch | 14, 38 | EXISTS (trigger/condition — see gotcha, evaluate in task-2) |
| binary_sensor.gianluca_bed_occupied | 20, 42 | EXISTS |
| input_boolean.gianlucas_room_occupied | 27, 46 | EXISTS |

`packages/gianluca_room/modes/gianlucas_room_occupied.yaml`
| Entity | Line | Status |
|---|---|---|
| binary_sensor.gianlucas_door_sensor_status | 8, 27 | EXISTS |
| light.gianluca_ceiling_light_switch | 12, 31 | EXISTS (trigger — legitimate paddle-press signal per seeded gotcha) |
| binary_sensor.gianluca_bed_occupied | 16, 35 | EXISTS |
| input_boolean.gianlucas_room_occupied | 21, 39 | EXISTS |

`packages/gianluca_room/occupancy/gianluca_room_ble_presence.yaml`
| Entity | Line | Status |
|---|---|---|
| group.people_sensors | 6, 11 | EXISTS |
| sensor.gianlucas_room_people_list (defined here — see MISSING callout above for the entity_id drift) | — | EXISTS |

`packages/gianluca_room/occupancy/gianlucas_bedroom_presence.yaml`
| Entity | Line | Status |
|---|---|---|
| group.room_presence_devices | 13 | EXISTS |
| sensor.gianlucas_bedroom_presence (defined here) | — | EXISTS |

`packages/gianluca_room/occupancy/gianlucas_room_occupancy.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.gianlucas_room_occupied (defined here) | — | EXISTS |

`packages/gianluca_room/air_quality/gianluca_bedroom_turn_off_air_purifier.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.house_occupied | 14 | EXISTS |
| input_boolean.gianlucas_room_occupied | 19 | EXISTS |
| input_boolean.construction_mode | 25 | EXISTS |
| fan.gianlucas_bedroom_air_purifier | 31 | EXISTS |

`packages/gianluca_room/air_quality/gianluca_room_air_quality_detections.yaml`
| Entity | Line | Status |
|---|---|---|
| sensor.gianluca_bedroom_air_quality | 14, 36 | EXISTS |
| input_select.gianlucas_bedroom | 18, 37 | EXISTS |
| input_boolean.gianlucas_room_occupied | 23 | EXISTS |
| input_boolean.house_occupied | 28 | EXISTS |
| input_boolean.nearly_home | 32 | EXISTS |
| fan.gianlucas_bedroom_air_purifier | 35 | EXISTS |
| script.air_quality_set_air_purifier_mode | 41 | EXISTS |

`packages/gianluca_room/air_quality/gianluca_room_air_quality_sensor.yaml`
| Entity | Line | Status |
|---|---|---|
| sensor.gianluca_bedroom_awair_pm2_5 | 6 | EXISTS |
| sensor.gianluca_bedroom_awair_vocs | 7 | EXISTS |
| sensor.gianluca_bedroom_awair_carbon_dioxide | 8 | EXISTS |
| input_number.pm25_moderate / pm25_poor / pm25_hazardous | 10-12 | EXISTS |
| input_number.tvoc_moderate / tvoc_poor / tvoc_hazardous | 14-16 | EXISTS |
| input_number.co2_moderate / co2_poor / co2_hazardous | 18-20 | EXISTS |
| sensor.gianluca_bedroom_air_quality (defined here) | — | EXISTS |

`packages/gianluca_room/climate/gianluca_room_feels_like_temperature.yaml`
| Entity | Line | Status |
|---|---|---|
| sensor.gianluca_room_mean_temperature | 8 | EXISTS |
| sensor.gianluca_bedroom_awair_humidity | 9 | EXISTS |
| sensor.gianluca_room_feels_like_temperature (defined here) | — | EXISTS |

`packages/gianluca_room/climate/gianluca_room_mean_temperature.yaml`
| Entity | Line | Status |
|---|---|---|
| sensor.gianlucas_door_sensor_temperature | 8 | EXISTS |
| sensor.gianluca_bedroom_awair_temperature | 9 | EXISTS |
| sensor.gianluca_room_mean_temperature (defined here) | — | EXISTS |

`dashboards/kohbo/rooms/upper_floor/gianlucas_bedroom.yaml`
| Entity | Line | Status |
|---|---|---|
| input_boolean.gianlucas_room_occupied | 25 | EXISTS |
| input_select.gianlucas_bedroom | 26 | EXISTS |
| **sensor.gianluca_room_people_list** | **27** | **MISSING — see callout above; correct entity is `sensor.gianlucas_room_people_list`** |
| sensor.gianluca_bedroom_awair_temperature | 36 | EXISTS |
| sensor.gianluca_bedroom_awair_humidity | 37 | EXISTS |
| sensor.gianluca_bedroom_awair_carbon_dioxide | 38 | EXISTS |
| sensor.gianluca_bedroom_awair_vocs | 39 | EXISTS |
| sensor.gianluca_bedroom_awair_pm2_5 | 40 | EXISTS |
| light.gianluca_ceiling_light_switch | 53 | EXISTS (task-4 retargets this tile to `light.gianluca_bedroom_lights`) |
| light.gianluca_lamp | 68 | EXISTS |
| fan.gianlucas_bedroom_air_purifier | 92 | EXISTS |
| sensor.gianluca_bedroom_awair_score | 98 | EXISTS |
| switch.hue_smart_plug_1 | 105 | EXISTS |
| binary_sensor.gianlucas_door_sensor_status | 111 | EXISTS |
| switch.adaptive_lighting_gianluca_bedroom | 125 | EXISTS |
| switch.adaptive_lighting_sleep_mode_gianluca_bedroom | 133 | EXISTS |
| light.gianluca_bedroom_lights (light_entity) | 148 | EXISTS |
| light.gianluca_ceiling_lights (entity_id, ZHA group) | 151 | EXISTS (this is the split task-4 must resolve in favor of line 148's entity) |
| automation.gianluca_s_bedroom_air_quality_sensor_detections | 182 | EXISTS |
| automation.gianluca_heater_on | 190 | EXISTS |
| automation.gianluca_heater_turn_on_upon_arrival | 198 | EXISTS |
| automation.gianluca_room_temperature_alert | 205 | EXISTS |
| binary_sensor.gianluca_bed_occupied | 222 | EXISTS |
| sensor.gianluca_bed_left_sensor | 229 | EXISTS |
| sensor.gianluca_bed_right_sensor | 236 | EXISTS |
| number.esphome_gianluca_bed_sensor_gianluca_bed_trigger_level | 243 | EXISTS |

`dashboards/kohbo/rooms/upper_floor/partials/gianlucas_bedroom_card.yaml`
| Entity | Line | Status |
|---|---|---|
| input_select.gianlucas_bedroom | 7 | EXISTS |
| input_boolean.gianlucas_room_occupied | 8 | EXISTS |
| sensor.gianluca_bedroom_awair_temperature | 12 | EXISTS |
| sensor.gianluca_bedroom_awair_humidity | 13 | EXISTS |
| sensor.gianluca_bedroom_air_quality | 14 | EXISTS |
| light.gianluca_ceiling_light_switch | 18 | EXISTS (task-4 retargets) |
| binary_sensor.gianlucas_door_sensor_status | 24 | EXISTS |
| switch.hue_smart_plug_1 | 29 | EXISTS |
| fan.gianlucas_bedroom_air_purifier | 35 | EXISTS |

`dashboards/kohbo/rooms/partials/upper_floor_room_cards.yaml` (Gianluca section only, lines 84-120; Main Bedroom/Nino's/Upstairs Hallway sections in this same file are other rooms, out of scope)
| Entity | Line | Status |
|---|---|---|
| input_select.gianlucas_bedroom | 89 | EXISTS |
| input_boolean.gianlucas_room_occupied | 90 | EXISTS |
| sensor.gianluca_bedroom_awair_temperature | 94 | EXISTS |
| sensor.gianluca_bedroom_awair_humidity | 95 | EXISTS |
| sensor.gianluca_bedroom_air_quality | 96 | EXISTS |
| light.gianluca_ceiling_light_switch | 100 | EXISTS (task-4 known hit — retarget) |
| binary_sensor.gianlucas_door_sensor_status | 106 | EXISTS |
| switch.hue_smart_plug_1 | 111 | EXISTS |
| fan.gianlucas_bedroom_air_purifier | 117 | EXISTS |

**Totals:** 54 unique entities checked, 53 EXIST, 1 MISSING (`sensor.gianluca_room_people_list`, dashboard-only, corrected replacement identified above).

## Decision Ledger

*(Builder rulings that supersede or refine a documented rule. Ledger-worthy = an agent would later quote the old rule and be wrong — changed invariants, behaviors, standards; not micro-preferences. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`. /build drains open entries into the affected docs; /wrap warns on any left open.)*

- [2026-09-01] Scope ruling — the approved plan's Phases 2, 3 and 5 are excluded from this build (`.storage`/UI operations and a deferred spike). Only plan Phases 1 and 4 are in the PRD. — docs affected: plans/inovelli-lighting-sync/prd.md — status: folded
- [2026-08-24] Laundry Room is the third Inovelli VZM31-SN in the house but has Smart Bulb Mode **off** and no ZHA bulb group — a conventional dimmer on dumb bulbs, where the switch controlling the load is correct. Confirmed out of scope, not overlooked. — docs affected: plans/inovelli-lighting-sync/build-log.md — status: folded
