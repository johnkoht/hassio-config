# PRD: Holiday Automation Cleanup (JK-1229)

Source: `plans/holiday-automation-cleanup/plan.md` (approved 2026-11-13, all open-question defaults). Risks: `pre-mortem.md`. Plan review: `review.md`.

## Problem

Christmas won't start on its own on Dec 1, the Christmas master group contains the Halloween front yard plugs, the Halloween off automation runs all year, and dead/dangerous automations remain (one would switch the kitchen Air Fryer and Toaster Oven if "fixed"). Dashboard plug tiles show "Off" for unavailable plugs.

## Goal

Christmas starts at 02:00 Dec 1 and stops after Jan 7. Each season's automations touch `switch.front_yard_holiday_decorations` only in that season. Turning off "Christmas Lights" (switch, `light.christmas_lights` wrapper, Alexa) leaves the front yard alone. Dead holiday automations are gone. Dashboard plug tiles show real states.

## Design decisions (orchestrator, within the approved plan)

- **Season boolean as a condition.** `christmas_activated` and `turn_on_christmas_lights` require `input_boolean.christmas_season_active = on`. Off paths (`christmas_not_activated`, `turn_off_christmas_lights`) stay ungated. No automation calls `automation.turn_on/off` any more.
- **`christmas_enabled` / `christmas_disabled`** only turn the season boolean on/off on dates. No `initial_state`. Start trigger gets `id: startup`. Enable window `m == 12 or (m == 1 and d <= 7)`; disable window `not (that)`.
- **New `christmas_season_started`** (alias "Christmas Season Started"): season on → `halloween_season_active` off (Q6).
- **New `christmas_season_ended`** (alias "Christmas Season Ended"): triggers on season → off and on HA start (`id: startup`); condition season = off; action `christmas_active` off (replaces `christmas_manually_disabled`; the start trigger covers a season change while HA was down, review D5).
- **New `halloween_season_ended`** (alias "Halloween Season Ended"): `halloween_season_active` → off, condition `christmas_season_active = off`, action turn off the front yard group. Separate automation because a season-on condition on `halloween_lights_turn_off` would block a season-off trigger there.
- **Q3 toggle:** old-style group `group.christmas_season_schedule` (name "Christmas Season Schedule") of `automation.christmas_enabled` + `automation.christmas_disabled`, one row "Start and stop Christmas on its own" in the settings popup. Automations are enabled by default, so the row is on by default.
- **Front yard (Q1):** follows `christmas_active` (dusk → bedtime/away) via `turn_on_christmas_lights` / `turn_off_christmas_lights` / the `christmas_not_activated` safety-off, which target it explicitly next to `switch.christmas_lights`.

## Tasks

### PR 1 — packages + docs (branch `feature/holiday-automation-cleanup`)

**task-1 — Christmas package rewrite** (plan tasks 1, 2, 4, 5)
- `christmas_lights_group.yaml`: `switch.christmas_lights` = `switch.christmas_trees` + `switch.christmas_playroom_lights` only; same `unique_id`.
- Split `lights/christmas_lights_on.yaml` into `lights/turn_on_christmas_lights.yaml` and `lights/turn_off_christmas_lights.yaml`; delete `handle_ikea_unresponsive`. Both target `switch.christmas_lights` + `switch.front_yard_holiday_decorations` with `target:`. Turn-on gets the season condition after `house_occupied`.
- `christmas_activated`: add the season condition (house → season → feature order) and a trigger on `christmas_season_active` to `on` (review D1).
- `christmas_not_activated`: safety-off becomes unconditional `switch.turn_off` on `switch.christmas_lights`, `switch.christmas_trees`, `switch.christmas_playroom_lights`, `switch.front_yard_holiday_decorations` plus `light.turn_off` on `light.christmas_lights`; no multi-entity `state` gate.
- `christmas_enabled.yaml` / `christmas_disabled.yaml`: one automation each, no script, no `initial_state`, startup trigger `id: startup`, date windows above, action `input_boolean.turn_on/turn_off` the season boolean.
- `christmas_season.yaml`: keep only the `input_boolean`; delete `activate_christmas_season`. Add `christmas_season_started.yaml` and `christmas_season_ended.yaml`.
- Delete `modes/christmas_shortcut_button.yaml`, the manual enable/disable pair, both scripts, and the commented `turn_on/off_holiday_lights` block in `packages/outdoor_lighting.yaml`.
- Every file under `packages/holidays/christmas/` (not `santa/`, scripts there are out of scope) gets the header comment and modern `target:` syntax.

ACs:
- `switch.christmas_lights` entities == {christmas_trees, christmas_playroom_lights}; unique_id `christmas_lights`.
- Each automation file under `packages/holidays/christmas/` (excluding `santa/`) defines exactly one automation; filename == id.
- Surviving ids and aliases unchanged: `christmas_enabled` "Christmas Enabled", `christmas_disabled` "Christmas Disabled", `christmas_activated` "Christmas Activated", `christmas_not_activated` "Christmas NOT Activated", `turn_on_christmas_lights` "Turn ON Christmas Lights", `turn_off_christmas_lights` "Turn OFF Christmas Lights".
- No `initial_state` under `packages/holidays`; no `script:` key in `christmas_enabled.yaml` / `christmas_disabled.yaml`; no `automation.turn_on`/`automation.turn_off` action anywhere in `packages/holidays`; no `Christman` anywhere in the repo outside `plans/`.
- Date templates rendered with jinja2 (a stub `now()`): enable true exactly for Dec 1–31 and Jan 1–7; disable true for Jan 8 and the 15th of every month Feb–Nov, false on Dec 1, Dec 31, Jan 1, Jan 7.
- `christmas_activated` and `turn_on_christmas_lights` have a `christmas_season_active = on` condition; `turn_off_christmas_lights` and `christmas_not_activated` don't.
- Turn-on, turn-off and the not-activated safety-off all target `switch.front_yard_holiday_decorations`.
- No `tradfri_smart_plug` and no `device_id:` under `packages/holidays`.
- No inline `entity_id` right after an `action:` under `packages/holidays/christmas` (same regex as `tests/test_modern_syntax.py:219`), santa excluded.
- `packages/outdoor_lighting.yaml` no longer contains `turn_on_holiday_lights` / `turn_off_holiday_lights`.
- `christmas_activated` has a trigger on `christmas_season_active` to `on`; `christmas_season_ended` has a `homeassistant` start trigger with `id: startup` and a season-off condition.
- Every YAML basename under `packages/holidays` is unique across `packages/` (test).
- `test_christmas_uses_the_group` replaced by `test_christmas_master_group_excludes_front_yard`; full suite green.

**task-2 — Halloween season gate + season handover** (plan task 3, Q6)
- `halloween_lights_turn_off`: add `halloween_season_active = on` condition first; remove the "decorations on" condition; keep the startup gate.
- New `packages/holidays/halloween/halloween_season_ended.yaml` (above).
- `christmas_season_started` exists from task-1; verify the handover.

ACs:
- `test_halloween_off_is_season_gated`: off automation has the season condition and no `switch.front_yard_holiday_decorations` state condition.
- `test_halloween_restart_respects_time_of_day` still passes (extended to assert the season condition sits outside the startup `or`).
- `halloween_season_ended` triggers on `halloween_season_active` to `off`, is conditioned on `christmas_season_active = off`, and turns off `switch.front_yard_holiday_decorations` via `target:`.
- `christmas_season_started` triggers on `christmas_season_active` to `on` and turns off `input_boolean.halloween_season_active`.

**task-3 — energy meter, Q3 toggle, docs and Christmas dashboard** (plan tasks 6, 7a)
- `device_daily_energy_meters.yaml`: `smart_plug_14_daily_energy.source` → `sensor.smart_plug_4_family_room_summation_delivered`; key and name unchanged; comment notes plug 4.
- New `packages/holidays/christmas/christmas_season_schedule.yaml`: `group.christmas_season_schedule`.
- `dashboards/kohbo/holidays/christmas.yaml`: drop the in-season conditional on "All Christmas Lights" (card shown always); update the Season description line.
- `_holidays_settings_popup.yaml`: add the "Start and stop Christmas on its own" row for `group.christmas_season_schedule`; update the description text (the season toggle no longer flips these rows).
- Docs: holidays dashboard README (settings table, key entities, the master-group caveat bullet only; leave the "unavailable plug reads Off" bullet for PR 2), `packages/holidays/LEARNINGS.md` (lines 6 and 8 resolved; new line on season-boolean gating), `docs/AUTOMATIONS.md:59`, `dashboards/kohbo/home/README.md` if it describes the master group, `dashboards/SITEMAP.md:139`.

ACs:
- The meter's `source` names plug 4, which is a member of `switch.christmas_trees` (test).
- `group.christmas_season_schedule` entities == [automation.christmas_enabled, automation.christmas_disabled]; a test loads the popup and asserts a row references exactly that group id (review D3).
- No doc in the repo (outside `plans/`, `memory/`) still says the Christmas master group includes the front yard, or mentions the deleted automations/scripts as live.
- Full suite green.

### PR 2 — dashboard only (branch `feature/holiday-dashboard-plug-tiles`, from origin/master)

**task-4 — plug tiles and duplicate view** (plan tasks 11–13)
- `kohbo_device_smart_plug_entity`: `unavailable` → "Unavailable", `unknown` → "Unknown"; "On" shows watts only when the power sensor exists and is numeric, else falls back to last-changed.
- Playroom page: plug 18 tile has no `power_sensor`; no `confirmation: true` on the four plug tiles.
- `kohbo.yaml`: remove the second `rooms/active_rooms.yaml` include.
- Test: every view `path` in `kohbo/kohbo.yaml` includes is unique.
- Docs: holidays README "An unavailable plug reads Off" caveat removed; playroom/rooms README updated if it mentions confirmation.

ACs: template returns the right text for on/off/unavailable/unknown (rendered-JS logic reviewed; YAML test that the template handles the four states by string); view-path uniqueness test fails on a duplicate (sabotage check); full suite green.

## Live steps (release agent, after PR 1 deploys)

See the ship report.
