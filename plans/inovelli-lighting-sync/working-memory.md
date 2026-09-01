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

## Decision Ledger

*(Builder rulings that supersede or refine a documented rule. Ledger-worthy = an agent would later quote the old rule and be wrong — changed invariants, behaviors, standards; not micro-preferences. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`. /build drains open entries into the affected docs; /wrap warns on any left open.)*

- [2026-09-01] Scope ruling — the approved plan's Phases 2, 3 and 5 are excluded from this build (`.storage`/UI operations and a deferred spike). Only plan Phases 1 and 4 are in the PRD. — docs affected: plans/inovelli-lighting-sync/prd.md — status: folded
- [2026-08-24] Laundry Room is the third Inovelli VZM31-SN in the house but has Smart Bulb Mode **off** and no ZHA bulb group — a conventional dimmer on dumb bulbs, where the switch controlling the load is correct. Confirmed out of scope, not overlooked. — docs affected: plans/inovelli-lighting-sync/build-log.md — status: folded
