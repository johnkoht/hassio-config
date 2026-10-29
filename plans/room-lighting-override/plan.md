---
title: Room Lighting Override
slug: room-lighting-override
status: draft
created: 2026-10-28
issues: [JK-1145, JK-1102, JK-1219]
related: [house-mode-resolver]
has_pre_mortem: false
has_review: false
has_prd: false
---

# Room Lighting Override

## Problem

Rooms use two conflicting models for "someone took manual control of the lights".

- **Main bedroom (the model John wants).** `main_bedroom_lighting_automations` is left to the user. A separate `main_bedroom_lights_manually_toggled` flag blocks motion lights, and `main_bedroom_lights_reset_manual_toggle` clears it 30s after occupancy goes off. Gaps: the flag is set only on a manual OFF of the main lights (not manual on or brightness), the reset doesn't listen for room Off, and the lighting flag has `initial: on`.
- **Kitchen, playroom, upstairs_hallway, garage, office.** The lighting flag itself is the manual-override latch. A manual change turns `<room>_lighting_automations` off, and only the sensor-driven `<room>_not_occupied` turns it back on. The dashboard "Lighting Automations" toggle and the latch are the same entity, so John can't tell a hand-disable from an override.

Concrete bugs that follow:

- **Kitchen stuck flag.** `kitchen_mode_off` forces `kitchen_occupied` off, and `kitchen_not_occupied` requires occupied = on, so after a room Off the flag never resets. Hotfix #73 (shipped 10-28) added a flag reset to `kitchen_mode_off`; this plan supersedes it. The #73 reviewer found a second gap: if the flag is off and the kitchen is already empty when it goes Off, `kitchen_lights_to_off` doesn't run, so lights someone turned on by hand stay on.
- **Garage flapping.** `garage_lights_turned_off` has no context check, so every automation-driven off (motion off, room Off) disables garage lighting automations. Live, it flaps all day.
- **Office.** Manual-off detection is disabled (`initial_state: off`), and two disabled automations (`office_lighting_automation_on/off`) still write the flag.
- **`initial: on` on every lighting flag** re-applies at each restart, silently undoing a hand-disable (see memory: `initial:` disables restore).
- **JK-1219.** Room occupancy should go off when the room goes Off. Only the kitchen and main bedroom do it today.

Live impact is moderate. At bedtime the common rooms cleared on their own sensors within 1–15 minutes, so the stuck flag mostly self-heals, except where occupancy is forced off first (kitchen).

## Goal

Every room that has a mode `input_select` follows one pattern (decided by John, 10-28: all rooms with state, not a subset). Every room with lighting automations has the same two flags with clear jobs: a hand-only `<room>_lighting_automations` that gates all lighting automations, and a `<room>_lights_manually_toggled` latch that is set by any manual change and is always cleared, by one dedicated reset automation, when the room goes Off or unoccupied. A room's Off forces its occupancy off and turns its lights off regardless of either flag, without bouncing the room back to Auto or stranding a flag.

## Approach

Converge on the main bedroom model, generalized into a small per-room kit, and roll it out room by room behind a pilot.

**Per-room kit (target state):**

| Entity | Role | Written by |
|---|---|---|
| `input_boolean.<room>_lighting_automations` | Master switch, no `initial:` | John only (dashboard). No automation writes it. |
| `input_boolean.<room>_lights_manually_toggled` | Override latch, `initial: off` | `<room>_lights_manual_change` (on), `<room>_lights_reset_manual_toggle` (off) |
| `input_boolean.<room>_lights_auto` | Existing "automation turned these on" marker | unchanged |

- **`<room>_lights_manual_change`** (new, or the existing `*_turned_off` / `*_manually_turned_on` files folded into one). Triggers on the room's main light going `on`, going `off`, and `attribute: brightness` (no `from`/`to`, or attribute changes won't fire; see memory). Condition: `trigger.to_state.context.parent_id == none` and the context isn't Adaptive Lighting's. Action: turn the manual flag on, clear `lights_auto`.
- **`<room>_lights_reset_manual_toggle`** (existing in main bedroom, generalized). Triggers: `<room>_occupied` → off for 30s, `input_select.<room>` → Off, `input_boolean.house_occupied` → off. Ungated on purpose: no lighting-flag or mode conditions.
- **Every on-type lighting automation** (motion on, day on, lights on) checks, in the order global → room → feature: `lighting_automations`, `<room>_lighting_automations`, `<room>_lights_manually_toggled` off, room mode.
- **Room Off turns the lights off unconditionally.** The `<room>_lights_to_off` path for the Off transition checks only the global `lighting_automations`, never the room flag or the latch. This closes the #73 gap, where an empty room going Off with the flag off left manually-on lights burning.
- **`<room>_not_occupied`** stops touching the lighting flag. **`<room>_mode_off`** forces `<room>_occupied` off (JK-1219), but only in the same change that lands the reset automation for that room.
- **Auto bounce guard.** Every `<room>_mode_auto` that triggers on its occupancy going off gets `house_occupied` on plus `input_select.house` not in Away/Vacation. That deliberately doesn't require house == Auto, so it holds if `house-mode-resolver` makes the house Quiet after bedtime. The existing Auto automations that do require house == Auto are left alone here, and that dependency is flagged in the resolver plan.

**Why this over the alternative.** The alternative is to keep the latch-on-the-flag model and just fix the reset paths. It is smaller, but it keeps the dashboard toggle ambiguous and keeps automations writing a user setting, which is the root of JK-1145. The kit costs one boolean and one reset automation per room and follows a model already running in the main bedroom.

**Ordering rule (the one thing that must be right).** In any room, the reset automation lands, in the same PR or earlier, before `mode_off` forces occupancy off. Otherwise the kitchen's stuck-flag bug spreads to every room. A regression test enforces it.

**Scope: every room with a mode select** (John, 10-28). Pilot first, then one room per small PR:

- **Pilot and early rooms (protection):** main bedroom, kitchen (supersedes #73), garage (live flapping).
- **Rooms with motion or day lighting:** the full kit (both flags, manual-change detection, reset automation, Off forces occupancy off, Off turns lights off).
- **Rooms with a mode but no lighting automations** (basement, jr_suite, powder_room, mudroom_bathroom, sunroom, foyer, Nino's and Gianluca's rooms): only Off forces occupancy off, plus the Auto-bounce guard. No flags are added where nothing would read them.
- **family_room and mudroom:** now in scope. They first get a migration phase (modern syntax, `packages/` layout, fix the invalid `On`/`Dim` options), then the kit.

Protection items (stuck or flapping flags) are still labelled separately from polish (consistency, dashboards, cleanup).

## Tasks

### Phase 0 — Verify the detection signal (main bedroom, read-only)

1. **Context capture spike** — using the homelab agent / recorder (read-only), capture state contexts on `light.main_bedroom_main_lights` and `light.kitchen_ceiling_lights` for: motion-on with transition, Adaptive Lighting adjustment, wall switch on/off/dim, dashboard toggle. Confirm what separates manual from automated: `parent_id`, `user_id`, and the AL context-id prefix. Confirm light-group entities carry the member's context, and whether ZHA transition reports arrive with a fresh context (false "manual" brightness). Output: the exact condition template, recorded in the plan/PRD. If brightness turns out noisy, fall back per Open decision 2.

### Phase 1 — Pilot: main bedroom (v1, protection)

2. **Widen manual detection** — replace `main_bedroom_lights_turned_off` logic with `main_bedroom_lights_manual_change` (on/off/brightness + context check). Keep the alias stable if anything references `automation.main_bedroom_lights_manually_turned_off` (entity_id comes from alias; grep dashboards and `automation.turn_*` calls).
3. **Reset on Off** — add the `input_select.main_bedroom` → Off and `house_occupied` → off triggers to `main_bedroom_lights_reset_manual_toggle`; add a header comment; fix its root-level `entity_id` to a `target:` block.
4. **Drop `initial: on`** from `main_bedroom_lighting_automations`; keep `initial: off` on the manual flag.
5. **Gate audit** — confirm motion_on, day_on and any other on-type automation check both flags; lights_to_off follows Open decision 6.
6. **Bounce guard** — main bedroom Auto already checks `house_occupied` on its unoccupied branch; add the house-not-Away/Vacation check there.
7. **Tests** — add `tests/test_room_lighting_override_regressions.py` (see Tests below), parametrized over a `MIGRATED_ROOMS` table that starts with the main bedroom.
8. **Deploy + live check** — after John's reload, run the recorder check (below) over a few days of normal use before Phase 2.

### Phase 2 — Kitchen (v1, protection; supersedes the hotfix)

9. **Add `kitchen_lights_manually_toggled`** (`initial: off`) and `kitchen_lights_reset_manual_toggle`.
10. **Fold detection** — `kitchen_lights_manually_turned_on` + `kitchen_lights_manually_turned_off` become `kitchen_lights_manual_change`, setting the manual flag instead of turning the lighting flag off. Drop the passive debug notification, or keep it behind the manual flag only (polish, John's call).
11a. **Off turns the lights off regardless** — on the Off transition, `kitchen_lights_to_off` checks only `lighting_automations` (closes the #73 gap). Add a test.
11. **Stop automations writing `kitchen_lighting_automations`** — remove the turn_on from `kitchen_not_occupied`, and remove the hotfix's reset line from `kitchen_mode_off` (the reset automation owns it now). `kitchen_mode_off` keeps forcing occupancy off.
12. **Gate** `kitchen_lights_motion_on`, `kitchen_lights_day_on` and the Dim-mode pendant path on the manual flag. Drop `initial: on` from the lighting flag.
13. **Side-effect check** — list the listeners of `kitchen_occupied` → off (music off, air purifier, announcement routing) and confirm firing them at bedtime Off is wanted. Already true today, so it's documentation only.
14. **Tests + deploy + live check.** Add the kitchen to `MIGRATED_ROOMS`.

### Phase 3 — Garage (v1, protection)

15. **Context check** on `garage_lights_turned_off`, which becomes `garage_lights_manual_change` setting `garage_lights_manually_toggled`. This alone stops the flapping.
16. **Reset automation**, remove the turn_on from `garage_not_occupied`, gate `garage_lights_motion_on`, drop `initial: on`. Note `garage_override` and leave it alone (unrelated).
17. **JK-1219 for the garage** — `garage_mode_off` (house → Bedtime) forces `garage_occupied` off. Check `garage_mode_auto`, which triggers on occupancy *on*, so it doesn't bounce.
18. **Tests + deploy + live check.**

### Phase 4 — Rollout to every remaining room with a mode (each room is its own small PR, same kit, same tests)

Protection (a flag that sticks or misfires today):

19. **Playroom** — latch room. Migrate, then JK-1219 on `playroom_mode_off` (bedtime).
20. **Upstairs hallway** — latch room. Migrate; `upstairs_hallway_mode_off` triggers only on house empty/restart, so JK-1219 there is low-risk.
21. **Office** — migrate, re-enable manual detection, and delete `office_lighting_automation_on` / `office_lighting_automations_off` (disabled, but they write the flag). Office DnD keeps lights on: confirm `office_lights_on` treats DnD like Auto for the manual flag.
22. **Main bathroom** — no manual detection today. Add the kit, and add the bounce guard to `main_bathroom_mode_auto`, which triggers on occupancy off and has no `house_occupied` check. JK-1219 on `main_bathroom_mode_off`.
23. **JK-1219 for rooms with no lighting automations** — basement, jr_suite, powder_room, mudroom_bathroom, sunroom, foyer, Nino's and Gianluca's rooms: force occupancy off in `mode_off`. The kids' Auto automations already check `house_occupied`; add the house-not-Away/Vacation check. Audit occupancy-off side effects per room (heaters, sleep music, TTS routing) before each one.

Polish (consistency and cleanup):

24. **Laundry** — `laundry_room_lights_motion_on` never checks `laundry_room_lighting_automations`, so the toggle does nothing. Add the gate, then the kit.
25. **Dining room** — no lights-on automation. Remove `dining_room_lighting_automations` (and the unused `dining_room_lights_auto`), its turn_on in `dining_room_not_occupied`, and its dashboard row.
26. **Dashboards** — the existing "Lighting Automations" rows (kitchen, main bedroom, main bathroom, playroom, office, upstairs hallway, dining room) keep working and become hand-only. Add a "Manual override" row per migrated room showing `<room>_lights_manually_toggled` (tap to clear). Remove the dining row (task 25).
27. **Docs** — `docs/ROOMS.md` entity table, the room-package section in `packages/CLAUDE.md`, and any room README: describe the two flags and the reset rule in a few lines.

### Phase 5 — family_room and mudroom (migrate, then adopt)

28. **Migrate family_room** — move its automations from legacy `automation/` into `packages/family_room/` with modern syntax (one automation per file; keep aliases where `automation.<slug>` is referenced). Fix `family_room_mode_on` and `familiy_room_arrival`, which select "On"/"Dim", neither of which is an option in `input_select/rooms/family_room.yaml`: either add the options or point them at existing ones (decide from what the rooms actually do). Behaviour-neutral PR, with tests asserting every selected option exists.
29. **Migrate mudroom** — same treatment.
30. **Adopt the kit** in both rooms, as in Phase 4.
31. **Repo-wide option test** — every `input_select.select_option` targeting a room select uses an option that select defines. This would have caught the family room bug and the foyer's lowercase "bedtime".

### Tests (`tests/test_room_lighting_override_regressions.py`)

Static YAML checks in the style of `tests/test_away_mode_regressions.py`, parametrized over `MIGRATED_ROOMS`:

- The lighting flag has no `initial:`; the manual flag has `initial: off`.
- No automation or script anywhere targets `input_boolean.<room>_lighting_automations` with turn_on/turn_off/toggle (repo-wide scan).
- The reset automation exists, triggers on occupancy off, room Off and house unoccupied, and has no conditions that could block it.
- The manual-change automation has a `parent_id` context condition and a brightness trigger with `attribute:` and no `from`/`to`/`not_from`/`not_to`.
- Every on-type lighting automation in the room checks both flags.
- The Off-transition lights-off path doesn't check the room flag or the latch.
- **Ordering invariant (repo-wide, not just migrated rooms):** if `<room>_mode_off` turns `<room>_occupied` off, then either the room has a reset automation or nothing resets its lighting flag from `<room>_not_occupied`.
- Every `*_mode_auto` with an occupancy → off trigger checks `house_occupied` on.
- Garage: the manual-change automation has the context check (regression for the flapping).

### Live recorder check (after each phase, via homelab, read-only)

Over the days after the deploy, for each migrated room:

- `<room>_lighting_automations` changes only with a user context (no `parent_id`). Expect zero automation-context writes.
- Every `<room>_lights_manually_toggled` → on is followed by → off within ~1 minute of the room's next Off or unoccupied event. List any that stay on more than an hour.
- After each room Off, `<room>_occupied` is off and the room doesn't flip back to Auto while the house is empty or Away.
- Garage: count of flag changes per day before and after (expect near zero).

Reuse the shape of the investigation's q4/q5/q6 queries. Results go in the PR description with neutral wording, and no times tied to people.

## Open decisions (recommended defaults)

1. **Hand-only lighting flag in every room with motion lights?** Recommend **yes**. One meaning for the dashboard toggle everywhere.
2. **Does a manual brightness change set the manual flag?** Recommend **yes for on, off and brightness**, not for Adaptive Lighting colour or temperature (excluded via the context check). Fallback if Phase 0 shows ZHA transition reports look manual: v1 ships on/off only, and brightness follows once a debounce is proven (ignore brightness changes within ~10s of an automation-context change on the same light).
3. **Force occupancy off on Off in every room that goes Off?** Recommend **yes**, but only room by room, and only after that room's reset automation lands (the ordering rule).
4. **Drop `initial:` on the lighting flags?** Recommend **yes**, and keep `initial: off` on the manual flags so a restart always starts clean.
5. **Dining room:** recommend **removing** the unused flag (and `dining_room_lights_auto`) rather than migrating it.
6. **Does the manual flag block the vacancy-off automations (`*_lights_to_off` / `*_lights_off`)?** Recommend **no**. The latch blocks on-type automations only, and the off-when-empty path obeys only the hand flag. Otherwise a manually-on light stays on after everyone leaves, because the reset fires after the off trigger has passed. This matches the main bedroom today.
7. **Scope:** **decided 10-28 (John): every room with a mode select.** Main bedroom, kitchen and garage go first as pilots; then Phase 4; then Phase 5 for family_room and mudroom. Open: do Phase 4 rooms ship one per PR (recommended) or batched by floor?
8. **Alias stability:** recommend **keeping existing aliases** on renamed or folded automations wherever `automation.<slug>` is referenced (dashboards, `automation.turn_on/off`), and choosing new aliases whose slug matches the id.

## Risks

- **Stuck flag spreads** if occupancy-off-on-Off lands before a room's reset: enforced by the ordering rule and the repo-wide invariant test.
- **False "manual" detections** (ZHA transition reports, Adaptive Lighting, light-group recompute arriving with a fresh context) would latch the override and kill motion lights until the room empties: Phase 0 spike first, the Open decision 2 fallback, and the recorder check that lists latches held for over an hour. The worst case self-heals at the next unoccupied/Off.
- **Removing `initial: on` strands a flag that's off now.** The old latch may have left a room's flag off, and after the change it restores off forever. Mitigation: after each deploy, read the live flag state and ask John to switch it on once (one dashboard tap). Never set it from an automation.
- **Auto bounce** (main bathroom, kids' rooms, main bedroom) when Off forces occupancy off: the house-occupied + not-Away/Vacation guard ships in the same PR as each room's JK-1219 change, plus a test.
- **Early occupancy-off side effects at bedtime** (music, purifier, heaters, TTS routing): a per-room listener audit before each JK-1219 change. Rooms with risky side effects (kids' rooms) come last.
- **Conflict with the in-flight kitchen hotfix:** Phase 2 starts from master after the hotfix merges, and removes its reset line explicitly (task 11). Don't touch kitchen files until then.
- **Coupling to `house-mode-resolver`:** if it makes the house Quiet after bedtime, Auto automations requiring house == Auto stop firing. This plan's guard uses not-Away/Vacation to stay independent. Whichever plan ships second rechecks the `*_mode_auto` conditions.
- **Renamed automations break references** (entity_id comes from alias): grep for `automation.<slug>` before folding files; Open decision 8.
- **Reload isn't restart:** `initial:` changes and new input_booleans need an input_boolean reload (not covered by `deploy.sh --reload`), done by John. No restart is needed.
- **Privacy:** recorder findings and PR text stay generic. No routines, times tied to people, or places.

On approval → /approve → /ship room-lighting-override
