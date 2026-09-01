# PRD — Inovelli Lighting Sync: Gianluca Bedroom (repo changes)

## Goal

Port the verified-working Office lighting fix (`2e72108`) to Gianluca's bedroom: retarget every automation and dashboard reference from the Inovelli switch entity to the Hue bulb group, and add the two guarded state-sync automations. This is a port of already-deployed, exercised code — not a new design.

## Scope Boundary — READ FIRST

The approved plan has five phases. **This PRD covers only plan Phase 1 (audit) and plan Phase 4 (repo changes).**

**The build MUST NEVER write to `/config/.storage` on the Home Assistant host, and MUST NOT attempt any of the following:**

| Excluded | Why |
|---|---|
| Plan Phase 2 (tasks 5–9) — ZHA unbind, remove-from-group, group-bind | Physical device + `.storage` operations via the HA UI. John's clicks. |
| Plan Phase 3 (tasks 10–12) — Adaptive Lighting reconfiguration | `.storage` config entry. John's clicks. |
| Plan Phase 5 (tasks 19–24) — LED bar indicator | Deferred. Begins with a spike that may collapse the phase. |
| Plan task 17 — rename `switch.inovelli_vzm31_sn_*` | Cosmetic polish AND a `.storage` entity-registry rename. John's click. Flag only. |

SSH to `hassio` is permitted and expected — but **read-only**, for verifying entity existence via the supervisor REST API. Never mutate host state.

The build must **not deploy**. It produces a commit; John pushes and deploys himself.

## Verified Facts (given — do not re-derive)

Confirmed live 2026-08-24 / 2026-09-01 via SSH to `hassio`:

- `light.gianluca_ceiling_lights` is the **ZHA group entity** (platform=zha), not a YAML group.
- `light.gianluca_bedroom_lights` is the **YAML helper group** (platform=group) containing `light.gianluca_ceiling_light_1` through `_4`. **There is no entity_id collision** — unlike the Office, this group does NOT need renaming. Confirm, then leave it alone.
- Gianluca's room has **no Bayesian presence sensor**. Presence is a template sensor derived from BLE at `packages/gianluca_room/occupancy/gianlucas_bedroom_presence.yaml`. The Office's lights-on feedback loop does not exist here — out of scope.
- Gianluca's room has **no "lights on" automation**, only a lights-off. Do NOT add one. Flag it for John.
- Laundry Room is the third Inovelli VZM31-SN in the house but has Smart Bulb Mode **off** and no ZHA bulb group. It is a conventional dimmer on dumb bulbs — correctly out of scope.

## Reference Implementation — read before writing anything

These are already deployed and confirmed working in production. Port the pattern; do not reinvent it.

- `packages/office/lights/office_lights_group.yaml`
- `packages/office/lights/office_lights_sync_switch_state.yaml`
- `packages/office/lights/office_lights_sync_bulbs_from_switch.yaml`
- `packages/office/lights/office_lights_off.yaml`
- Commit `2e72108`

## Constraints

- **Never restart Home Assistant.** Reload specific domains only; John reloads himself.
- **Never run `deploy.sh --check`** — its guard tests for the docker binary rather than a running daemon, and it destroys the gitignored `secrets.yaml`, which is unrecoverable. Use `--skip-ci`.
- `deploy.sh` pulls from GitHub, so changes must be pushed before deploying. The build does neither.
- Modern HA syntax is mandatory per `CLAUDE.md`: `triggers:` / `conditions:` / `actions:` / `action:` / `target:`. The entire `gianluca_room` package is currently legacy `trigger:` / `platform:` / `service:` syntax.

---

## Tasks

### task-1 — Audit: verify every referenced entity exists on the live system

**Files:** `packages/gianluca_room/**`, `dashboards/kohbo/rooms/upper_floor/**`, `dashboards/kohbo/rooms/partials/upper_floor_room_cards.yaml`

Grep the Gianluca package and dashboards for every `light.*`, `binary_sensor.*`, `input_boolean.*` and `input_select.*` reference, then verify each one exists on the live system before any edit.

This is non-negotiable and is the single highest-value step. The Office work found two nonexistent entities — `light.office_all_lights_group` and `binary_sensor.office_aqara_motion` — that had silently reduced automations to no-ops for months. Assume the same class of bug is present here until proven otherwise.

Verification method (read-only), the same one used for the Office:
```bash
ssh -o BatchMode=yes hassio 'curl -s -H "Authorization: Bearer $SUPERVISOR_TOKEN" \
  http://supervisor/core/api/states/<entity_id>'
```

**Acceptance Criteria**
- A written inventory exists in `plans/inovelli-lighting-sync/working-memory.md` listing every entity referenced in the Gianluca package and its upper-floor dashboards, each marked EXISTS or MISSING against the live API.
- Any MISSING entity is reported explicitly and corrected in the relevant task, or escalated if the correct entity is ambiguous.
- `light.gianluca_bedroom_lights` is confirmed to be platform=group containing `light.gianluca_ceiling_light_1..4`, and confirmed to have no entity_id collision.
- The absence of a Bayesian presence sensor is confirmed, not assumed.

### task-2 — Retarget Gianluca automations from the switch to the bulbs

**Files:** `packages/gianluca_room/lights/gianluca_lights_off.yaml`, `packages/gianluca_room/modes/gianlucas_room_occupied.yaml`, `packages/gianluca_room/modes/gianlucas_room_not_occupied.yaml`

Replace `light.gianluca_ceiling_light_switch` with `light.gianluca_bedroom_lights` in every action and condition. Known hits: `gianluca_lights_off.yaml:36`, `gianlucas_room_occupied.yaml:12,31`, `gianlucas_room_not_occupied.yaml:14,38`.

In Smart Bulb Mode the switch entity cannot control the load, so these calls are currently no-ops — the same defect that made the Office's lights-off do nothing.

Judgment call required on the `gianlucas_room_occupied.yaml:12` **trigger**: a paddle press is still a legitimate presence signal, so that trigger may be correct as-is pointing at the switch. Evaluate each hit as trigger vs action/condition rather than blind-replacing, and record the reasoning. The Office kept the equivalent trigger (`office_occupied.yaml:31`) pointing at the switch.

Turn-on calls must be **bare** `light.turn_on` with no `brightness`/`color_temp` so Adaptive Lighting can intercept and adapt them.

**Acceptance Criteria**
- No action or condition in the Gianluca package targets `light.gianluca_ceiling_light_switch` for load control.
- Any retained switch reference is a trigger, with a comment explaining why it is intentional.
- All three files use modern syntax: `triggers:`/`conditions:`/`actions:`, `action:` not `service:`, and `target:` blocks rather than root-level `entity_id:`.
- Every turn-on action is a bare `light.turn_on` with no brightness or color data.
- Each file retains or gains a header comment block per `CLAUDE.md`.

### task-3 — Add the two guarded state-sync automations

**Files (new):** `packages/gianluca_room/lights/gianluca_lights_sync_switch_state.yaml`, `packages/gianluca_room/lights/gianluca_lights_sync_bulbs_from_switch.yaml`

Port `office_lights_sync_switch_state.yaml` and `office_lights_sync_bulbs_from_switch.yaml`, substituting Gianluca's entities. Read both Office originals first.

Direction one (bulbs → switch): mirrors bulb group state onto `light.gianluca_ceiling_light_switch` so the LED bar tracks. Safe because Smart Bulb Mode decouples the switch's internal state from the load.

Direction two (switch → bulbs): makes the paddle authoritative in HA.

**Acceptance Criteria**
- Both automations use `mode: single` and `max_exceeded: silent`.
- Both carry a template condition that fires only when the two states actually differ — this is what prevents the pair from ping-ponging. Missing this guard is a build failure.
- IDs match filenames per repo convention (`gianluca_lights_sync_switch_state`, `gianluca_lights_sync_bulbs_from_switch`).
- Each file opens with a header comment explaining the Smart Bulb Mode decoupling and naming its counterpart file.
- Modern syntax throughout.

### task-4 — Fix dashboard entity references

**Files:** `dashboards/kohbo/rooms/upper_floor/gianlucas_bedroom.yaml`, `dashboards/kohbo/rooms/upper_floor/partials/gianlucas_bedroom_card.yaml`, `dashboards/kohbo/rooms/partials/upper_floor_room_cards.yaml`

Point the room cards, tile and light popup consistently at `light.gianluca_bedroom_lights`. Known hits: `gianlucas_bedroom.yaml:53,148,151`, `gianlucas_bedroom_card.yaml:18`, `upper_floor_room_cards.yaml:100`.

Line 148 currently uses `light.gianluca_bedroom_lights` for `light_entity` while line 151 uses `light.gianluca_ceiling_lights` (the ZHA group) for `entity_id` — resolve that split in favour of the helper group, since Adaptive Lighting can expand an HA group but not a ZHA group entity.

**Acceptance Criteria**
- No dashboard file under `dashboards/` references `light.gianluca_ceiling_light_switch` for control.
- The light popup uses the same entity for both `light_entity` and `entity_id`.
- A comment records why `light.gianluca_ceiling_lights` (ZHA group) is deliberately not used by the dashboard.

### task-5 — Validate and commit

**Files:** all changed

Validate before handing off. There is no `ha core check` available from the dev machine, so parse locally with HA's custom tags stubbed:

```python
import yaml
class L(yaml.SafeLoader): pass
for t in ['!include','!include_dir_named','!include_dir_list',
          '!include_dir_merge_list','!include_dir_merge_named','!secret','!env_var']:
    L.add_constructor(t, lambda l, n: None)
```

**Acceptance Criteria**
- Every changed YAML file parses without error under the stubbed loader.
- Every entity_id in every changed file is re-verified to EXIST on the live system (repeat of task-1's method, run against the final diff rather than the starting state).
- `git status` shows only intended files changed — no stray edits to `packages/office/**` or unrelated packages.
- A single commit is created with a descriptive message following the repo's convention (see `2e72108`), documenting root causes rather than just listing file changes.
- **Nothing is pushed and nothing is deployed.**
- Two items are surfaced in the completion report rather than actioned: (a) the room has no "lights on" automation, (b) the `switch.inovelli_vzm31_sn_*` rename is available as optional polish.

---

## Out of Scope — hand back to John

After this build lands, these remain and are John's:

1. **ZHA rebinding** (plan Phase 2) — remove the Inovelli EP2 from ZHA group 3, reload ZHA, then group-bind OnOff `0x0006` EP2 + LevelControl `0x0008` EP2. Never EP3. Leaves the paddle dead in between, so warn Gianluca first.
2. **Adaptive Lighting** (plan Phase 3) — the entry currently targets `light.texas_instruments_cc2652_gianluca_ceiling_light_group`, which does not exist. Repoint at `light.gianluca_ceiling_light_1..4` and mirror the Office's corrected settings.
3. **Optional polish** — rename `switch.inovelli_vzm31_sn_*` → `switch.gianluca_ceiling_light_switch_*`.
4. **Deferred** — LED bar indicator (plan Phase 5), starting with the task-19 spike.
