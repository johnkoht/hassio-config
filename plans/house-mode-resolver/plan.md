---
title: House Mode Resolver
slug: house-mode-resolver
status: approved
created: 2026-10-28
has_pre_mortem: false
has_review: false
has_prd: false
---

# House Mode Resolver

> Approved by John 2026-10-30 (written authorization to approve the batch; answers folded in below).

Linear: JK-1118 (follow-up to PR #71). Sibling plan: `room-lighting-override` (room-level lighting and occupancy; not yet written in `plans/`).

## Problem

`input_select.house` (Auto / Away / Vacation / Bedtime / Quiet / Entertainment) is written by six edge-triggered automations in `automation/house/modes/` (legacy syntax). Each one hard-codes the option it selects, from `house_occupied`, `bedtime`, `vacation_mode` and `quiet_mode`. Nothing ever recomputes the mode from current state, so whichever edge fired last wins, even when it contradicts the booleans.

PR #71 stopped a departure from starting bedtime; John reversed that on 2026-10-29 (departure → Bedtime + arm, arrival ends it; see OD-1). Still broken:

1. **An arrival never re-evaluates bedtime or quiet.** `house_mode_auto` runs on `house_occupied → on` but is blocked while `bedtime` is on, so arriving into a house with bedtime on leaves the select at **Away** while people are home. Arriving with `quiet_mode` on goes to Auto.
2. **Bedtime ending goes to Auto even with quiet mode on.** `house_mode_auto` never checks `quiet_mode`, so speech notifications come back on and the doorbell reads WELCOME while people are still asleep. The recorder confirms this on three recent mornings.
3. **Bedtime overwrites Vacation.** `house_mode_bedtime` has no conditions. During a vacation, `bedtime_mode_vacation_on` turns bedtime on at night, the select becomes Bedtime, and the morning `bedtime → off` can't restore Vacation because `house_mode_auto` requires an occupied house. The select stays Bedtime for the rest of the trip.
4. **`bedtime_mode_off` is still wired to the old bug class.** It triggers on `binary_sensor.everybody_in_bed → off`, which is a home-filtered aggregate (it flips on departure). Its time condition is "after 05:00" with no upper bound. The "both adults" logic is an OR of ORs: any one adult being *away* satisfies it, so a fixed morning trigger can end bedtime while the only adult at home is still asleep.
5. **Morning flapping** of the per-person in-bed booleans turns bedtime on and off repeatedly. This is a person-level sensor issue and is out of scope (follow-up).

Two more races found during exploration, both fixed for free by a state-derived resolver:

6. **Departure race.** `house_mode_away` and `house_mode_vacation` both trigger on `house_occupied → off`, and `house_mode_away` has no conditions. Which option the select ends on depends on run order.
7. **Return race.** On return, `house_mode_auto` and `vacation_mode_turn_off` both trigger on `house_occupied → on`. If `house_mode_auto` runs first it sees vacation still on and selects Vacation, and nothing re-runs when `vacation_mode` turns off, so the house can sit in Vacation while the family is home.

## Goal

The house mode is always derived from current state: any change to an input, plus HA start and automation reload, recomputes it with one fixed priority. Bedtime ending with quiet on lands in Quiet, Vacation is never overwritten by Bedtime, an arriving adult who isn't in bed ends bedtime, and the common rooms still return to Auto when the house is in Quiet.

## Approach

### Design: one resolver automation, not a script plus six callers

The investigation proposed `script.house_mode_resolve`, called by the existing mode automations instead of hard-coding an option. Challenge: every caller would then just be "trigger → call script". The triggers are the only thing those six automations would contribute, so the lighter and clearer version is **one automation, `house_mode_resolve`**, whose triggers are all the inputs and whose action computes and selects the mode. No script is needed: the new arrival automation ends bedtime by turning the boolean off, and that change triggers the resolver. (A script can be added later if a dashboard "re-sync" button is ever wanted.)

Priority (first match wins):

| Mode | When |
|---|---|
| Vacation | `vacation_mode` on and `house_occupied` off for 2+ min (see OD-7) |
| Away | `house_occupied` off |
| Bedtime | `bedtime` on |
| Quiet | `quiet_mode` on |
| Auto | otherwise |

Entertainment is left out of the resolver (OD-6). The resolver selects only when the computed value differs from the current one, so no-op runs don't create transitions. It uses `mode: queued` (small `max`) and reads state at run time, so it converges whatever order inputs change in.

Triggers: `house_occupied` (any change, plus `off` held for the Vacation threshold), `vacation_mode`, `bedtime`, `quiet_mode`, `homeassistant: start`, `event: automation_reloaded`.

### Side effects move off the mode automations and onto transitions

Today the doorbell text, speech-on, away push and nap-window speech-off sit inside whichever automation happened to pick the option. They become small automations under `packages/house/modes/` that trigger on `input_select.house` changing to a given option. Option strings and behaviour stay identical:

- `house_mode_doorbell_text`: Auto → `WELCOME!`, Away/Bedtime → `DO NOT DISTURB`, Quiet → `SHHH…KIDS SLEEPING`, Vacation → `Please do not disturb!`.
- `house_mode_speech_on`: house → Auto turns `speech_notifications` on (today it does this on every `house_mode_auto` run).
- `house_mode_away_notification`: house → Away sends the existing passive push.
- `house_mode_quiet_speech_off`: house → Quiet inside the existing afternoon window turns speech off (logic moved unchanged from `house_mode_quiet`).

`house_mode_quiet_off` is already `initial_state: "off"` (disabled). The resolver replaces it, so it is deleted rather than migrated.

### Bedtime off: rewrite `bedtime_mode_off`

- Triggers: replace `everybody_in_bed → off` with the adults' per-person in-bed booleans going off (`input_boolean.john_is_in_bed`, `input_boolean.cristina_in_bed`). Keep the `*_is_awake → on`, fixed-morning and sunrise triggers.
- Time: after 05:00 **and before 12:00** (OD-4).
- Who: any adult who is *home* is awake. Drop the "adult is away" branches, which are what let an absent adult end bedtime. Keep one fallback: if **no** adult is home (for example a sitter overnight), the morning triggers still end bedtime. That is the only legitimate job the away branches did.
- Use `target:` and modern syntax throughout; keep `initial_state: on`.

### Arrival: new `bedtime_mode_off_on_arrival`

When a family adult arrives home while `bedtime` is on and that adult's in-bed boolean is off, turn `bedtime` off. The resolver then lands on Quiet (somebody is in bed) or Auto. When that adult goes to bed, `bedtime_mode_on` (triggers on the per-person in-bed booleans since #71) turns bedtime back on. Who counts as "arriving" is OD-8.

### Rooms: accept Quiet as an Auto-equivalent house state

With "bedtime off → Quiet", the 11 room Mode Auto automations that require the house to be exactly Auto would leave common rooms Off all morning. Daytime Quiet (naps) already leaves rooms in Auto, because nothing turns rooms Off on Quiet, so treating Quiet like Auto for room Auto is consistent with current behaviour.

Change (two lines each): trigger `input_select.house` `to: ["Auto", "Quiet"]` and condition `state: ["Auto", "Quiet"]`:

- packages: `basement_mode_auto`, `dining_room_mode_auto`, `jr_suite_mode_auto`, `kitchen_mode_auto`, `laundry_room_mode_auto`, `mudroom_bathroom_mode_auto`, `playroom_mode_auto`, `pool_mode_auto`, `powder_room_mode_auto`, `sunroom_mode_auto`
- legacy: `automation/family_room/modes/family_room_mode_auto.yaml` (editing it means modernizing that one file; aliases unchanged).

This is small, so it is owned here. Hand-off to `room-lighting-override`: "room Auto must treat house Quiet as Auto; any new room-mode logic must not require house == Auto exactly". Rooms that only re-enter Auto on house → Auto, and have no occupancy trigger to recover, are listed under OD-9.

### Migration and loading

New files live in `packages/house/modes/` with modern syntax, one automation per file, short headers (title plus 1–3 lines). `automation/house/modes/` is deleted.

- Basenames are checked: nothing in `packages/` is named `house_mode_*` today, so `!include_dir_named` won't collide.
- Nothing in YAML or the dashboards references `automation.house_mode_*`. Old aliases ("House mode auto", etc.) will leave `id: None` registry ghosts. Remove them after deploy (stdlib ws on the Yellow) or accept them as cosmetic.
- All new automations set `initial_state: on`. Removing `initial_state` would not re-enable a disabled automation.

## Transition consumer audit

Everything that triggers on `input_select.house` transitions, and what the resolver changes for it.

**Changed behaviour (intended):**

| Consumer | Today | After |
|---|---|---|
| 11 room `*_mode_auto` (listed above) | blocked unless house == Auto | accept Quiet (Task 5) |
| `camera_notifications_deactivate` | no longer keyed on the house mode (JK-1123 dropped its Auto-30 min and sunrise triggers, 2026-10-29) | unaffected; door, garage and arrival triggers still apply. |
| `christmas_activated` (→ Auto) | | Quiet delays this trigger only; its other triggers and time window cover it. Accept. |
| Bedtime-keyed consumers during vacation (`garage_mode_off`, `office_mode_off`, `mudroom_mode_night_motion`, `upstairs_hallway_mode_bedtime`, `christmas_not_activated`) | fired nightly because Bedtime overwrote Vacation | no longer fire from the select during vacation. All but `garage_mode_off` also trigger on the `bedtime` boolean; garage is already Away/Off with the house empty. Accept. |
| Away-keyed consumers on arrival-with-bedtime | select stuck at Away while home | select leaves Away correctly |

**Unaffected (also trigger on the `bedtime` boolean, or tolerate Quiet):** `alarm_disarm_in_morning` (also triggers on `bedtime → off`; see Risk R2), `second_floor_climate_resume` (already handles Quiet), `foyer_mode_dim` (disabled, and also triggers on `bedtime → off`), `gianlucas/ninos_bedroom_mode_auto` (trigger on `bedtime → off`), `main_bedroom_mode_auto`, `main_bathroom_mode_auto`, `garage_mode_auto`, `office_mode_auto` (occupancy triggers recover them), `mudroom_mode_motion` (motion-off trigger recovers it), all Away consumers on a normal departure (`*_mode_off`, `*_lights_to_away`, `garage_mode_away`, `alarm_arm_when_house_empty`, `camera_notifications_activate`, `windows_left_open`), `alarm_arm_away_when_vacation_mode`.

**Dead triggers found (not fixed here, listed for the backlog):** `foyer_mode_off` triggers on `to: "bedtime"` (lowercase, never matches; it also has a boolean trigger). `family_lights_to_off/on`, `garage_lights_to_off`, `main_bedroom_lights_to_off` and `foyer_lights_to_off` reference house states `Off`/`On`, which aren't options.

## Tasks

1. **Resolver** — `packages/house/modes/house_mode_resolve.yaml`: the priority table above, the triggers listed, select only on change, `mode: queued`.
2. **Side-effect automations** — `house_mode_doorbell_text`, `house_mode_speech_on`, `house_mode_away_notification`, `house_mode_quiet_speech_off` under `packages/house/modes/`, behaviour copied verbatim.
3. **Delete legacy** — remove the six `automation/house/modes/*.yaml` files in the same commit as Tasks 1–2, so there is never a window with two writers.
4. **Bedtime off rewrite** — `packages/house/bedtime_mode/bedtime_mode_off.yaml`: per-person triggers, the before-noon bound, "any home adult awake, or no adult home".
5. **Room Auto accepts Quiet** — the 11 files above (modernize the family room file while in it).
6. **Arrival ends bedtime** — `packages/house/bedtime_mode/bedtime_mode_off_on_arrival.yaml` (scope per OD-8).
7. **Alarm guard (protection, required by Task 6)** — add a `before: "12:00:00"` bound to `alarm_disarm_in_morning`'s time condition (R2).
8. **Docs** — `packages/house/LEARNINGS.md` (state-derived mode; don't hard-code `input_select.house` options in new automations); `docs/PEOPLE.md` (bedtime ends when one home adult is up, not both); `docs/ROOMS.md` "Linking to House State" (Quiet counts as Auto for room Auto); `docs/AUTOMATIONS.md` House Modes blurb (one line).
9. **Verify** — `./deploy.sh --skip-ci` reload (never a bare `--check`). In the Logbook (not History or Traces), confirm a resolve run on reload, and walk scenarios against current state: bedtime off with quiet on → Quiet; vacation night → stays Vacation; arrival with bedtime on → Quiet/Auto. Before deploying, compare the live select with what the resolver would compute, because the first reload corrects any drift and fires that transition's consumers once.

### Beyond the ask, itemized

**Protection** (backstops for silent failures):

- P1. Race fixes 6 and 7. No extra code; they come with the resolver.
- P2. The `bedtime_mode_off` away-branch fix (an absent adult ending bedtime). Part of Task 4.
- P3. The alarm disarm upper bound (Task 7). Without it, the new night-time arrival path would let `alarm_disarm_in_morning` disarm at night.
- P4. Resolve on start and reload: self-heals a drifted select. Part of Task 1.

**Polish** (cut freely):

- X1. Splitting side effects into transition automations, instead of putting a `choose` in the resolver. This costs about 3 extra small files. The cheaper alternative is one `choose` block at the end of the resolver, run only when the mode changed.
- X2. Removing the registry ghosts after deploy.
- X3. Fixing the dead `Off`/`On`/lowercase `bedtime` triggers. Backlog only, not in this plan.
- X4. Making the dashboard popup toggle the booleans instead of the select (OD-5). Backlog only.

### Lighter alternative (considered)

Patch in place: add a quiet check to `house_mode_auto`, vacation guards to `house_mode_bedtime` and `house_mode_away`, plus Tasks 4–7. That is about the same line count, because every touched legacy file must be modernized anyway. It keeps two writers per edge, so races 6 and 7 and the "never recomputed" class stay. Not recommended. The resolver is the smaller long-term surface.

## Open decisions

Each has a recommended default. The plan above assumes the defaults. **Resolved (John, 2026-10-30):** OD-1 was already decided by John (2026-10-29); OD-2 to OD-10 take the plan's recommended default, marked on each line.

- **OD-1. The last awake adult leaves at night (others in bed).** **Resolved (John, 2026-10-29): Bedtime, and arm.** Shipped as a hotfix: `bedtime_mode_on` triggers on `person.*` leaving home again, and `bedtime_mode_off_on_arrival` (Task 6) already exists, so this plan only adjusts its landing state (Quiet vs Auto, OD-2) and scope (OD-8).
- **OD-2. Bedtime ends while quiet mode is still on.** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **Quiet.** This needs Task 5, or the common rooms stay Off.
- **OD-3. The "house becomes occupied → Auto" trigger.** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **replace it with the resolver.** Arrival selects whatever the state says (Bedtime, Quiet or Auto), never a hard-coded Auto.
- **OD-4. Does one adult getting up end bedtime?** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **yes, but only before noon.** One home adult awake is enough, and a no-adult-home fallback is kept. This matches today's effective OR, now bounded and without the away loophole.
- **OD-5. Manual selects from the dashboard** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** (for example, picking Bedtime or Entertainment by hand). Default: **accept that the next resolve overwrites them.** Today the next edge overwrites them too. The select becomes a derived display; to change behaviour, toggle the booleans. A popup change is backlog (X4).
- **OD-6. Entertainment in the resolver.** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **leave it out.** Nothing consumes house == Entertainment, and `entertainment_mode` (the boolean) runs its own side effects. Alternative: map the boolean to Entertainment between Bedtime and Quiet. It is cheap, but it adds transitions with no consumer.
- **OD-7. How Vacation enters.** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **Vacation requires the house to be empty for 2+ min.** The house passes through Away first, so the Away-keyed consumers (room Off, lights to away, alarm, cameras, windows) still fire when vacation mode was turned on before leaving. The normal path is already Away first, because `vacation_mode_turn_on` requires an empty house. Also: **occupied + vacation_mode on (a sitter) resolves to the normal modes, not Vacation.** That changes today's `house_mode_auto`, which picks Vacation. It gives a keyholder a working house, and the vacation alarm and faux-home logic keep their own gating.
- **OD-8. Who triggers "arrival ends bedtime".** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **family adults only** (those with in-bed booleans: John, Cristina). An unlock-privileged guest arriving at night would end bedtime, and nothing would restore it (they have no in-bed boolean to trigger `bedtime_mode_on`), so the alarm wouldn't re-arm. Alternative: any unlock-privileged person, plus a re-arm path. More scope.
- **OD-9. Rooms that re-enter Auto only on house → Auto, with no occupancy recovery** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** (`foyer_mode_auto`, `upstairs_hallway_mode_auto`). Default: **add Quiet to the foyer trigger. Leave the upstairs hallway in Bedtime until Quiet clears,** since the kids' rooms are on that hall. Alternatively, leave both and hand them to `room-lighting-override`.
- **OD-10. Morning in-bed flapping.** **Resolved (John, 2026-10-30), by default (the plan's recommendation stands):** Default: **a separate issue** (person-level sensors). The resolver makes it less harmful (Bedtime↔Quiet instead of Bedtime↔Auto), but the `bedtime` boolean and its consumers still flap.

## Risks

- **R1. First reload changes the live select and fires that transition's consumers once** (for example → Auto turns speech on and sets WELCOME, → Away turns rooms Off). Mitigation: in Task 9, compare the live select with the computed value before deploying, and deploy at a quiet time of day.
- **R2. A night-time `bedtime → off` (the new arrival path) triggers `alarm_disarm_in_morning`.** Its "after 05:00" condition is true until midnight, so it would wait for first-floor occupancy and disarm. Mitigation: Task 7 adds the upper bound in the same PR.
- **R3. Bedtime → Quiet leaves rooms Off** if Task 5 misses a file. Mitigation: Task 5's list comes from a grep of `state: "Auto"` conditions on `input_select.house`; re-grep before merge (audit all instances).
- **R4. Old automation aliases disappear.** The entity_ids are derived from the alias, so they go `unavailable`. No references were found in YAML or the dashboards. Mitigation: grep again at build time; remove the ghosts (X2).
- **R5. Resolver feedback loops.** It only writes `input_select.house` and never triggers on it, so it can't loop. The side-effect automations never write any resolver input. Mitigation: the reviewer checks this invariant.
- **R6. The sitter case changes** (OD-7): occupied + vacation now resolves to Auto/Bedtime/Quiet, so room automations run for a keyholder. Accept if the default is approved.
- **R7. Sign-off needs real nights.** The bedtime/quiet/arrival paths can only be verified overnight. Mitigation: confirm via the Logbook over the following mornings, and keep the PR revertable as a single unit.
- **R8. Privacy.** No routines, times tied to people or places in config, plan, commits or PR. The existing fixed triggers stay as they are and aren't restated in prose.

On approval → /approve → /ship house-mode-resolver
