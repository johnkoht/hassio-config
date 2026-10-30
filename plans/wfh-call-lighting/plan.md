---
title: WFH Call Lighting
slug: wfh-call-lighting
status: shipped
created: 2026-10-29
has_pre_mortem: true
has_review: true
has_prd: true
---

# WFH Call Lighting

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

Linear: JK-692. John: "In the winter around 3-5 it gets dark outside and adaptive lighting kicks in. We should turn AL off and put the lights on daytime color/brightness, then back after calls end."

## Problem

On winter afternoons the sun sets while John is still on video calls. Adaptive Lighting (AL) starts warming and dimming the office, so on camera he sits in a dim, orange room. Today nothing connects "I'm on a call" to the office lights, apart from the El Gato key light, which already follows the laptop camera (`office_camera_light_on` / `_off`).

## Goal

When a call starts in the occupied office and AL has already moved the lights away from daylight, pause AL and set the office lights to a daytime colour temperature and brightness. When the call ends (debounced), hand control back to AL so it re-adapts. Nothing changes when AL is still at or near daylight values, when the office is empty, or when something other than this automation paused AL.

## What exists today

All entity ids below were found in the repo by grep. "Unknown" means not found.

**Call signal.** There is already a chain that turns "on a call" into an office mode, so this plan listens at the end of it rather than rebuilding it:

- `binary_sensor.john_laptop_camera_active` (camera in use, 5s `delay_on`) and `binary_sensor.john_laptop_audio_active` (AirPods as the audio device), in `packages/people/john/do_not_disturb/sensors/`.
- `automation.john_dnd_on` sets `input_boolean.john_dnd` after camera on for 3s or audio on for 5s. `john_dnd_off` clears it after camera and audio are both off for 30s.
- `office_dnd_on` (`packages/office/office_dnd.yaml`) sets `input_boolean.office_dnd` when John's DnD is on **and** `sensor.john_room_presence` is `office` (or `input_boolean.office_guest_mode` is on), and the office is occupied. `office_mode_dnd` then selects `DnD` on `input_select.office`.
- `office_dnd_off` clears `office_dnd` 2 minutes after `john_dnd` goes off, immediately when `input_boolean.office_occupied` goes off or John's room presence leaves `office`.
- `input_boolean.john_work_call` (calendar-driven) exists but feeds only the Bayesian DnD sensor; not used here.

So `input_select.office` = `DnD` already means "occupied and John is on a call (or guest mode)", already debounced about 2.5 minutes on the way out.

**Office lights.** `light.office_ceiling_bulbs` (HA group of four Hue bulbs; automations target this so AL can intercept), `light.office_office_lamp`, `light.office_shelf_lights`, `light.office_el_gato_light` (camera light, leave alone). `light.office_all_lights` groups all four. `light.office_lights` is the ZHA group and must not be targeted (see `office_lights_group.yaml`).

**Adaptive Lighting switches.** AL is UI-configured (14 config entries in `.storage`, not in git). The repo references `switch.adaptive_lighting_office` (dashboard toggle in `dashboards/kohbo/rooms/main_floor/office.yaml`; and `entertainment_mode_activated` / `_deactivated`, which switch it off and on) and `switch.adaptive_lighting_sleep_mode_office`. AL also creates `adapt_brightness` and `adapt_color` switches per entry; no file references `switch.adaptive_lighting_adapt_color_office`, so those ids are unknown until checked live. Which lights the office AL entry controls is unknown from the repo (it lives in the config entry); the `homelab` agent can read it.

**Other office light automations** that must not fight this: `office_lights_on` / `office_lights_day_on` (bare `turn_on` so AL sets values), `office_lights_off`, `office_lights_motion_*`, `office_dnd_light_on` (Hue signal outside the door). Dark detection exists as `sensor.office_aqara_illuminance` with the repo-wide 150 lux threshold.

## Approach

**Pause mechanism: turn `switch.adaptive_lighting_office` off, not sleep mode, not manual control.** Justification:

- *Sleep mode* is the wrong direction: it applies AL's dim, warm sleep values, which is the opposite of what a call needs.
- *`adaptive_lighting.set_manual_control`* marks lights as manually controlled until they are reset or toggled off and on. Its flags clear in ways that are easy to trip (a light turned off and on, the AL auto-reset timer), and the per-light state is invisible on the dashboard. A call could end with AL silently still disabled, or silently resumed mid-call.
- *`adapt_color` off* alone pauses colour but leaves brightness adapting, so the room still dims.
- *The master switch* is one visible toggle (already on the office page), already scripted in this repo (entertainment mode), and a clean off/on has AL re-apply its current values when it comes back, which is exactly "resume and re-adapt". Cost: the switch is shared with entertainment mode and the dashboard toggle, so this automation must record that it paused AL and only resume what it paused (below).

**Daytime values (open decision 1):** after pausing, `light.turn_on` on the office ceiling bulbs and the lamp with `color_temp_kelvin: 3000` and `brightness_pct: 100` (**Resolved (John, 2026-10-30):** 3000K; brightness stays at the default 100%). Shelf lights and the El Gato are left alone (**Resolved (John, 2026-10-30):** the other lights don't matter, so only the ceiling bulbs and the lamp, as the plan recommended). Shelf lights are decorative and keep whatever they have. Values live in two `input_number` helpers (kelvin, brightness), no `initial:`, so John can tune from the dashboard without a code change (the `initial:` gotcha in memory). Defaults are now 3000K and 100% (John's call; warmer than the original 4000K recommendation, still tunable from the dashboard if it looks off on camera).

**Three small automations, one job each**, in a new `packages/office/call_lighting/` directory (unique basenames; `!include_dir_named` keys by basename):

1. `office_call_lighting_start` (id `office_call_lighting_start`). Trigger: `input_select.office` to `DnD` for 10 seconds. Conditions, global to feature: `input_boolean.lighting_automations` on, `input_boolean.office_lighting_automations` on, `input_boolean.office_occupied` on, `input_boolean.john_dnd` on (so guest-mode DnD does not count as a call), `input_boolean.office_call_al_paused` off, `switch.adaptive_lighting_office` on. Environmental gate: AL has actually moved the lights off daylight, read from the AL switch's own attributes (`color_temp_kelvin` below the daytime value, or `brightness_pct` below it; attribute names are an unverified assumption to check on a live render) so a bright midday call is left alone. A fallback gate on `sensor.office_aqara_illuminance` below 150 is an alternative if the attributes are not there. Actions: set `input_boolean.office_call_al_paused` on, `switch.turn_off` the AL switch, then `light.turn_on` the daytime values (only on lights that are on; a call does not switch lights on by itself).
2. `office_call_lighting_end` (id `office_call_lighting_end`). Trigger: `input_select.office` leaves `DnD` for 3 minutes, or `input_boolean.office_occupied` goes off. Condition: `office_call_al_paused` on. Actions: `switch.turn_on` the AL switch, turn the flag off. No explicit light commands; AL re-applies on turn-on. The 3 minutes sits on top of the existing 30s plus 2 minutes of DnD debounce; it is a single number to tune.
3. `office_call_lighting_reset` (id `office_call_lighting_reset`). Safety net so AL is never left off: if `office_call_al_paused` has been on for more than 3 hours, or at HA start with the flag on and `input_select.office` not `DnD`, turn AL back on and clear the flag. Cheap, and it removes the worst failure (office stuck at daytime white all evening).

Helpers (`office_call_lighting_helpers.yaml`): `input_boolean.office_call_al_paused` (no `initial:`), `input_number.office_call_color_temp` (2700 to 6500K, step 100), `input_number.office_call_brightness` (30 to 100, step 5), and a feature switch `input_boolean.office_call_lighting`, which the start automation also checks.

Dashboard: add the feature switch and the two tuning numbers under the existing Adaptive Lighting rows in `dashboards/kohbo/rooms/main_floor/office.yaml` (~line 250).

## Edge cases

- **Back-to-back calls.** `input_select.office` does not leave `DnD` if the next call starts inside the debounce, so end never fires and AL stays paused through the whole run. If it does leave and re-enter, end resumes AL and start pauses it again about 10 seconds later, a brief flicker at worst. The 3 minute end debounce is the knob.
- **Leaving the room mid-call.** `office_dnd_off` fires when John's room presence leaves `office` or the office goes unoccupied; end also triggers on `office_occupied` off. Consequence: AL resumes and the office re-adapts while he is out. If the room is empty the office light automations turn the lights off anyway.
- **Call signal (resolved).** Per John, a camera call or an audio call both trigger it. `input_select.office` = `DnD` with `john_dnd` on already covers both: `john_dnd_on` fires on camera (3s) or audio (5s). No new trigger is needed.
- **Room DnD for a non-call reason.** Guest mode sets DnD without `john_dnd`, so start requires `john_dnd` on. Manually selecting `DnD` on `input_select.office` with `john_dnd` off does nothing, which is intended.
- **Another thing paused AL** (entertainment mode, John's dashboard toggle). Start requires the AL switch on, and end resumes only when the flag says this automation paused it. If entertainment mode turns AL off mid-call, end must not turn it back on; the flag is cleared by end only after checking entertainment mode is off (build detail, tested).
- **Lights off during a call.** Start skips `light.turn_on` for lights that are off. If John turns them on mid-call with AL paused, they come on at their last values (3000K from this automation). Accepted.
- **Sleep mode / bedtime.** Start also requires `input_select.house` not `Bedtime` and `switch.adaptive_lighting_sleep_mode_office` off.
- **Illuminance gate vs AL attributes.** If neither gate is usable, fall back to a sun elevation condition. Failure direction either way is "daytime lights on a daytime call", harmless.

## Tasks

1. Verify live (via `homelab`): the office AL config entry's light list and the attribute names on `switch.adaptive_lighting_office`; whether the `adapt_color` / `adapt_brightness` switch ids exist. Decide the environmental gate from that.
2. Helpers file.
3. Start, end and reset automations (three files, ids match filenames).
4. Dashboard rows in the office page.
5. Tests, in the style of the other office regression tests: structure (triggers, conditions, flag handling), a template render of the gate for several AL attribute values, and a sabotage pass (remove the flag condition, confirm a test goes red).
6. Docs: `packages/office/README.md` section and `docs/ROOMS.md` line; header comments per `packages/CLAUDE.md`.
7. Handoff for John: reload automations; new helpers need a restart, which only John does; set the two tuning numbers from the dashboard.

## Open decisions

All resolved. John (2026-10-30): "Otherwise looks good." Specific answers below; the rest take the plan's recommendation.

1. **Daytime values.** **Resolved (John, 2026-10-30):** 3000K, brightness stays at the default 100%, both tunable from the dashboard. (Replaces the earlier 4000K recommendation.)
2. **Pause mechanism.** **Resolved (John, 2026-10-30):** the other lights don't matter, so use the recommended master AL switch off. The `set_manual_control` alternative is dropped.
3. **Which lights get the daytime values.** **Resolved (John, 2026-10-30):** ceiling bulbs and the lamp, as recommended. Shelf and El Gato are left alone.
4. **Call signal.** **Resolved (John, 2026-10-30):** trigger on a camera OR audio call. That is the recommended `input_select.office` = `DnD` with `john_dnd` on, which already includes audio-only calls (AirPods) and camera calls. The camera-only alternative is dropped.
5. **End debounce.** **Resolved (John, 2026-10-30):** yes to the debounce, 3 minutes on top of the existing DnD debounce, as recommended.
6. **When it applies.** **Resolved (John, 2026-10-30), by default:** whenever AL has moved the lights off daylight (self-selecting, no clock).
7. **Phone calls away from the laptop.** **Resolved (John, 2026-10-30), by default:** accepted for v1; the chain only sees laptop camera and audio.

## Risks

- **AL left off.** Mitigated by the reset automation and by resuming on `office_occupied` off; still the main risk, so it is tested.
- **Fighting other automations.** `office_lights_day_on` and `office_lights_on` use bare `turn_on` and would use whatever AL (off) gives; with AL paused they inherit the last values. Low risk, verify live.
- **Flicker from the 10 second start debounce and a camera that flaps.** The camera sensor already has delay_on; accepted.
- **Privacy.** No schedule or location is recorded here; "afternoon" is a season-level description only.

## Ship addendum (2026-10-30, live reads before building)

Facts read from the Yellow (read-only) that change or pin the plan. Where this contradicts the sections above, this wins.

- **AL office entry** controls `light.office_light_1` to `_4` only: the four ceiling bulbs. Options: `intercept: true`, `adapt_only_on_bare_turn_on: true`, `take_over_control: true` (`pause_all`), `detect_non_ha_changes: false`, `autoreset_control_seconds: 0`, kelvin 2000 to 5500, brightness 35 to 100.
- **The lamp is not AL and not dimmable.** `light.office_office_lamp` reports `supported_color_modes: [onoff]`. John's "ceiling bulbs and lamp only" is read as "leave shelf and El Gato alone"; the lamp gets no colour command. Start sends values to `light.office_ceiling_bulbs` only.
- **Switch ids exist:** `switch.adaptive_lighting_office`, `_sleep_mode_office`, `_adapt_color_office`, `_adapt_brightness_office`. The sleep switch is referenced by the office dashboard only; nothing in `packages/` pauses the office AL except the two entertainment files.
- **Switch attributes (live, sun down):** `brightness_pct` (38.5) and `color_temp_kelvin` (2000), plus `manual_control`. The gate reads these.
- **AL turn-on resets manual control and force-adapts** (`async_turn_on` calls `manager.reset(*lights)` then `_update_attrs_and_maybe_adapt_lights(force=True)`; turn-off also resets). An off/on cycle is a clean resume.
- **Gate is kelvin first.** The daytime brightness default is 100, so "AL brightness below setting" is almost always true. Gate: AL kelvin below the call kelvin, or AL brightness more than 5 points below the call brightness. Missing attributes mean "not below" (nothing fires).
- **Call spanning dusk.** Added a second start trigger: the AL switch's `color_temp_kelvin` attribute crossing below `input_number.office_call_color_temp`. Same conditions and actions.
- **Start conditions (final, global to feature):** `lighting_automations` on, `house_occupied` on, `office_lighting_automations` on, `office_lights_manually_toggled` off, `office_occupied` on, `input_select.office` = `DnD`, `john_dnd` on, `input_select.house` not `Bedtime`, `entertainment_mode` off, `office_call_lighting` on, `office_call_al_paused` off, AL switch on, AL sleep switch off, then the gate. The explicit DnD condition matters for the crossing trigger and also blocks a re-fire when AL turns back on at resume.
- **End:** `input_select.office` to `Auto` or `Off` for 3 minutes, or `office_occupied` off. Condition: flag on. Resume order is switch on, then flag off.
- **Reset:** flag on for 3 hours, flag on for 12 hours, HA start, `automation_reloaded`. Condition: flag on, and (the 12-hour trigger, or the office is not in `DnD`), so a long call is not interrupted at 3 hours. Reload and start paths are best effort; the 3 and 12 hour triggers are the guarantee. Both resume paths call `switch.turn_on` only when `entertainment_mode` is off and always clear the flag.
- **Latch.** Start's `light.turn_on` runs inside an automation, so its context has a parent and no user, which `office_lights_manual_change` ignores; AL's resume uses `:al:` contexts, also ignored. Residual risk: a late Hue device report after the context expires could latch (see `packages/office/LEARNINGS.md`). Handoff asks John to confirm in the logbook after the first real call that `office_lights_manually_toggled` stayed off. Fallback if it latches (backlog): ignore bulb brightness reports within N seconds of the run.
- **Accepted:** if John switches AL off by hand mid-call, end turns it back on. Entertainment ending mid-call turns AL on for the rest of that call.
- **Helpers apply by reload** (`input_boolean.reload`, `input_number.reload`); no restart. No `initial:` on any of the four. The numbers start at min (2700 / 30); the feature switch is created off, so nothing fires until John seeds 3000 / 100 and turns it on.

On approval → /approve → /ship wfh-call-lighting
