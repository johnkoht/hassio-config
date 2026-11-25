# Working Memory — jk-1074-quick-actions

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns

- **[Orchestrator] Area to room-view map** (live area registry, 2026-11-25). Areas with no room view get no row.

  | Area | Room view |
  |---|---|
  | `dining_room` | `rooms-dining-room` |
  | `family_room` | `rooms-family-room` |
  | `foyer` | `rooms-foyer` |
  | `gianlucas_room` | `rooms-gianluca-bedroom` |
  | `jr_suite` | `rooms-jr-suite` |
  | `kitchen` | `rooms-kitchen` |
  | `laundry_room` | `rooms-laundry` |
  | `main_bathroom` | `rooms-main-bathroom` |
  | `main_bedroom` | `rooms-main-bedroom` |
  | `mud_room` | `rooms-mudroom` |
  | `nino_room` | `rooms-ninos-bedroom` |
  | `office` | `rooms-office` |
  | `playroom` | `rooms-playroom` |
  | `powder_room` | `rooms-powder-room` |
  | `upstairs_hallway` | `rooms-upstairs-hallway` |

- **[Orchestrator] Every plan entity exists live** (2026-11-25). `light.hue_ambiance_lamp_1_2` (Cristina's lamp) is currently unavailable, so its row hides by design.
- **[Orchestrator] Nino and Gianluca map to different schools.** Nino uses `sensor.primary_school_start_time_today`. Gianluca uses `sensor.parochial_school_start_time_today`. Both are device_class timestamp and unavailable on no-school days.

## Active Gotchas

- **Package filenames are keyed by basename across the whole tree** (`!include_dir_named`). Prefix new files `quick_action_*`. `.yml` files are never loaded.
- **Conditional cards reject `condition: template`.** Use state, user, and/or not.
- **button-card `custom_fields` render as HTML.**
- **Numeric template results become int.** Coerce with `| string` before comparing.
- **No `initial:` on helpers.**
- **kohbo caches on the `kohbo.yaml` mtime.** `deploy.sh` touches it.
- **Verify dashboard CSS on the live DOM.** Don't reason it out from the Bubble bundle.
- **Public repo:** no user ids, schedules or times in files.
- **Never run a bare `./deploy.sh --check`**, never restart HA, never `--no-verify`.
- **Tests:** `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`

## Shared Utilities Created

## Context Corrections

## Decision Ledger
