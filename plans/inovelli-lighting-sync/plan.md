---
title: Inovelli Lighting Sync — Gianluca Bedroom + LED Bar Indicator
slug: inovelli-lighting-sync
status: in-progress
created: 2026-08-24
has_pre_mortem: false
has_review: false
has_prd: true
---

# Inovelli Lighting Sync — Gianluca Bedroom + LED Bar Indicator

## Problem

Gianluca's bedroom runs the identical hardware pattern the Office just had fixed — an Inovelli VZM31-SN in Smart Bulb Mode driving four ZHA-paired Hue bulbs — and it carries every one of the same defects, plus one the Office did not have.

Verified live on 2026-08-24 via SSH to `hassio`:

**The Zigbee binding does not exist.** ZHA group 3 "Gianluca Ceiling Light Group" contains the four Hue bulbs on EP11 *and* the Inovelli's EP2 as a **member**. Group membership is not a binding — EP2's OnOff/LevelControl are client (out) clusters, so it is a sender, not a receiver. The paddle has never been driving the bulbs directly. This is the exact defect found in the Office.

**Adaptive Lighting is pointed at an entity that does not exist.** The Gianluca Bedroom AL config entry targets `light.texas_instruments_cc2652_gianluca_ceiling_light_group`, which returns 404 from the API. AL has been completely inert for his ceiling — only `light.gianluca_lamp` (a Hue-bridge bulb) has been adapting. The entry also carries the same misconfiguration the Office had: `only_once: True`, `adapt_only_on_bare_turn_on: False`, `detect_non_ha_changes: True`.

**Every automation targets the switch, not the bulbs.** `gianluca_lights_off.yaml`, `gianlucas_room_occupied.yaml` and `gianlucas_room_not_occupied.yaml` all reference `light.gianluca_ceiling_light_switch`. In Smart Bulb Mode that entity cannot control the load, so those turn-offs are no-ops — the same class of bug that made the Office's `office_lights_off` do nothing for months.

**The dashboard is split across three different entities.** Room cards point at the switch; the light popup uses `light.gianluca_bedroom_lights` for `light_entity` but `light.gianluca_ceiling_lights` (the ZHA group) for `entity_id`.

Separately, the Office fix left one thing unfinished. `office_lights_sync_switch_state.yaml` mirrors only on/off onto the switch, so the LED bar's fill height does not track bulb brightness — the switch sits at 100% while Adaptive Lighting holds the bulbs at 40%. In Smart Bulb Mode the switch's level is cosmetic, but the bar is a physical indicator John reads from across the room.

## Goal

Gianluca's bedroom reaches the same verified-correct state the Office is in: paddle drives bulbs over a real Zigbee binding, Adaptive Lighting actually adapts, automations and dashboard target the bulbs, and HA's entity state stays truthful in both directions. Then, as a separate later phase, the Inovelli LED bar in both rooms tracks actual bulb brightness without writing to EP1's LevelControl.

## Approach

Workstream A mirrors commit `2e72108` and the files under `packages/office/lights/`. That implementation is already deployed, exercised, and confirmed working — this is a port, not a design exercise, which is why A is the priority and should ship on its own.

The one structural difference worth confirming rather than assuming: the Office needed its YAML helper group renamed because `name: Office Lights` collided with the ZHA group entity's slug and silently became `light.office_lights_2`. Gianluca's helper group is named "Gianluca Bedroom Lights" → `light.gianluca_bedroom_lights`, while the ZHA group is `light.gianluca_ceiling_lights`. No collision. Verify this before touching the group file, then leave it alone — renaming it would orphan a working entity for no gain.

Gianluca's room also has **no Bayesian presence sensor** — presence is a template sensor derived from BLE room presence. So the lights-on feedback loop that plagued the Office does not exist here and that work drops out of scope. Confirm during the audit rather than assuming.

Physical/ZHA-UI steps and repo edits are deliberately separated into different phases. The ZHA work (unbind, remove from group, rebind) and the Adaptive Lighting reconfiguration are `.storage` config-entry changes — John's clicks, not file edits — and must not be attempted by editing files. Each phase ends with an explicit verification step, because the Office work surfaced three separate bugs that were only visible against the live system.

Workstream B is a genuine design problem, not a port, and carries a real unknown that should be spiked before committing to an approach. Details in Phase 5.

## Tasks

### Phase 1 — Audit (read-only, no changes)

1. **Sweep the Gianluca package** — grep `packages/gianluca_room/` and `dashboards/` for every reference to `light.gianluca_ceiling_light_switch`, `light.gianluca_ceiling_lights`, and `light.gianluca_bedroom_lights`. Known hits: `lights/gianluca_lights_off.yaml:36`, `modes/gianlucas_room_occupied.yaml:12,31`, `modes/gianlucas_room_not_occupied.yaml:14,38`, `dashboards/kohbo/rooms/upper_floor/gianlucas_bedroom.yaml:53,148,151`, `dashboards/kohbo/rooms/upper_floor/partials/gianlucas_bedroom_card.yaml:18`, `dashboards/kohbo/rooms/partials/upper_floor_room_cards.yaml:100`.
2. **Verify every entity referenced actually exists** — query each against the live API. This is what caught `light.office_all_lights_group` (nonexistent, making an automation a silent no-op) and `binary_sensor.office_aqara_motion` (nonexistent, killing a 0.85-weight Bayesian observation) in the Office. Do not skip it.
3. **Confirm no entity_id collision** on `light.gianluca_bedroom_lights`, and confirm the presence sensor is template-only with no lights-on observation.
4. **Note that the room has no "lights on" automation at all** — only a lights-off. Decide with John whether that is intentional before adding one; it is out of scope unless he asks.

### Phase 2 — ZHA / physical (John's clicks, in order)

5. **Remove the Inovelli EP2 from ZHA group 3** — Settings → Zigbee → Groups → "Gianluca Ceiling Light Group" → check "Inovelli VZM31-SN" → Remove devices. Group should drop from 5 devices to 4. The group will not appear as a binding target while the switch is still a member of it.
6. **Reload the ZHA integration.**
7. **Create the group binding** — device `Inovelli VZM31-SN` (ieee `f0:44:d3:ff:fe:6d:9a:a1`) → Manage Zigbee Device → Bindings → **Group binding** section (not Device binding) → select "Gianluca Ceiling Light Group" → check **OnOff `0x0006` EP2** and **LevelControl `0x0008` EP2** only → Bind group. Never EP3 — that is the config button.
8. **Leave `switch.inovelli_vzm31_sn_binding_off_to_on_sync_level` OFF.** It pushes the switch's level onto the bulbs on a bound turn-on, which would slam them to 100% on every paddle press and stomp Adaptive Lighting.
9. **Verify** — press the paddle. Bulbs must respond effectively instantly. Any lag measured in seconds means the bind did not take.

### Phase 3 — Adaptive Lighting reconfiguration (John's clicks)

10. **Fix the Gianluca Bedroom AL entry** — replace the dead `light.texas_instruments_cc2652_gianluca_ceiling_light_group` with `light.gianluca_ceiling_light_1` through `_4`. Do not add the ZHA group entity (AL cannot expand it) and do not add the switch. Keep `light.gianluca_lamp` if he wants the lamp adapting too.
11. **Match the Office's corrected settings** — `only_once: false`, `adapt_only_on_bare_turn_on: true`, `detect_non_ha_changes: false`, `take_over_control: true`, `take_over_control_mode: pause_all`, `autoreset_control_seconds: 0`, `interval: 90`.
12. **Verify** — re-read the config entry from `.storage/core.config_entries` over SSH and confirm every value landed, then confirm bulb brightness begins moving on the 90s interval.

### Phase 4 — Repo changes (files)

13. **Retarget all automations** from `light.gianluca_ceiling_light_switch` to `light.gianluca_bedroom_lights` — `gianluca_lights_off.yaml`, `gianlucas_room_occupied.yaml`, `gianlucas_room_not_occupied.yaml`. Use bare `light.turn_on` with no brightness/color so AL intercepts.
14. **Add the two sync automations**, ported from the Office: `gianluca_lights_sync_switch_state.yaml` (bulbs → switch LED bar) and `gianluca_lights_sync_bulbs_from_switch.yaml` (paddle → bulbs). Both guarded on a state mismatch so they cannot ping-pong.
15. **Fix the dashboard** — point the room cards, tile and light popup consistently at `light.gianluca_bedroom_lights`. Resolve the `light_entity` / `entity_id` split in the popup.
16. **Modernize touched files** to `triggers:`/`conditions:`/`actions:`/`target:` per CLAUDE.md. Files in this package are all legacy syntax.
17. **Rename the switch's config entities** from `switch.inovelli_vzm31_sn_*` to `switch.gianluca_ceiling_light_switch_*` for consistency with the Office. Cosmetic; drop it if it risks breaking references — grep first.
18. **Validate** — parse every changed YAML file locally before handing off.

### Phase 5 — LED bar indicator (later, both rooms)

19. **Spike the open question first.** The premise of this phase is that writing EP1's LevelControl might cause EP2 to emit a bound LevelControl command and bounce the bulbs. That has not been tested — bindings generally fire on local paddle events, not hub-driven attribute writes. Test it directly: set the switch's brightness from Developer Tools while watching the bulbs. **If the bulbs do not move, this entire phase collapses into "add `brightness` to the existing sync automation with a throttle"** — dramatically simpler than what follows. Do this before building anything.
20. **If the spike shows a bounce**, drive the LED bar via the manufacturer cluster instead. Confirmed available on 2026.7.4: `zha.issue_zigbee_cluster_command` and `zha.set_zigbee_cluster_attribute` are both present; `zha_toolkit` is **not** installed, so use native services only. On cluster `0xfc31` (64561) the quirk defines `led_effect` (command `0x01`, schema `led_effect`/`led_color`/`led_level`/`led_duration`) and `individual_led_effect` (command `0x03`, adds `led_number`), plus attributes `led_color_when_on` / `led_intensity_when_on`.
21. **Decide fill-height vs intensity — these are different things.** `led_effect` with a solid effect sets the *intensity* of the whole bar, not how much of it is lit. A true fill indicator needs `individual_led_effect` addressing LEDs 0–6 individually, i.e. light N of 7 to represent brightness. Pick one deliberately; the second is more faithful and more code.
22. **Account for the override cost.** The LED bar natively displays EP1's level. Because this phase deliberately avoids writing EP1, the only way to change the bar is to put it into effect/notification mode — which **overrides** the native indicator until explicitly cleared, and will collide with any other Inovelli LED notification use. This is the real price of the approach and should be weighed against the spike result.
23. **Throttle.** AL adapts every 90 seconds. Without rate-limiting this means a Zigbee write every 90s per switch and a visibly twitching bar. Only update on meaningful deltas.
24. **Define off-state behavior and a rollback path** — what the bar shows when the bulbs are off, and how to clear the effect and restore native behavior in one step if this is abandoned.

## Risks

- **Removing EP2 from the group before rebinding leaves the paddle dead.** Between task 5 and task 7 the switch controls nothing. Mitigation: do Phase 2 in one sitting, and tell Gianluca first — this is his bedroom, not an unoccupied room.
- **Binding EP3 instead of EP2.** EP3 is the config button. Binding it would dim the bulbs *and* fire any config-button automation on the same press. Mitigation: EP2 is stated explicitly in task 7; verify the endpoint column before clicking Bind.
- **`binding_off_to_on_sync_level` getting switched on.** Would push the switch's stale level onto the bulbs on every paddle-on and silently undo the Adaptive Lighting fix. Mitigation: called out in task 8; re-verify in Phase 3 validation.
- **Editing `.storage` directly instead of using the UI.** AL config entries and entity renames live in `.storage`. Hand-editing risks corrupting the config-entry store. Mitigation: Phases 2 and 3 are explicitly John's clicks; the build must never write to `.storage`.
- **Deploying without pushing.** `deploy.sh` pulls from GitHub, and the host's git has diverged with no branch tracking before, producing silent no-op deploys. Mitigation: push first, then verify post-deploy that the new entities and automations actually exist on the live system — as was done for the Office.
- **`deploy.sh --check` destroys `secrets.yaml`.** Its guard tests for the docker binary rather than a running daemon, and `secrets.yaml` is gitignored so the loss is unrecoverable. Mitigation: use `--skip-ci`. Never `--check`.
- **Never restart Home Assistant.** Reload the specific domains. The new YAML light group needs `homeassistant.reload_all`, not a restart, and a restart drops the whole house. John reloads himself.
- **Phase 5 may be unnecessary work.** Task 19 exists precisely to find that out cheaply. Do not build the manufacturer-cluster path before the spike answers the question.

On approval → /approve → /ship inovelli-lighting-sync
