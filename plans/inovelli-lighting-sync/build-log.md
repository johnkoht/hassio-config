# Build Log — inovelli-lighting-sync

Started: 2026-09-01
Mode: `/ship lite` (pre-mortem + cross-model review skipped)

## Scope decision (Phase 0)

The approved plan spans five phases, but only two are machine-buildable. Recording the split here so the PRD scope is unambiguous:

| Plan phase | Buildable? | Disposition |
|---|---|---|
| 1 — Audit (read-only) | Yes | In PRD |
| 2 — ZHA unbind/regroup/rebind | **No** — `.storage` + physical device | Handed to John, gated before deploy |
| 3 — Adaptive Lighting reconfig | **No** — `.storage` config entry | Handed to John, gated before deploy |
| 4 — Repo changes | Yes | In PRD |
| 5 — LED bar indicator | Deferred | Starts with a spike that may collapse the phase; not this pass |

Ordering note: the Phase 4 repo changes are safe to deploy **before** the Phase 2 ZHA work. Retargeting the automations from `light.gianluca_ceiling_light_switch` to `light.gianluca_bedroom_lights` makes them command the bulbs over HA directly, which is strictly better than today's no-op against the switch. There is no hard dependency forcing the ZHA work first.

## Phase 2.1 — Memory review findings

Applied from `~/.claude/build/memory/collaboration.md` corrections:

- **"Audit ALL instances before changing one"** — enumerated every Inovelli device in the house before scoping. Three VZM31-SN switches exist: Office (fixed, `2e72108`), Gianluca Ceiling (this PRD), and **Laundry Room**. Laundry has Smart Bulb Mode **off** and no ZHA bulb group — it is a conventional dimmer driving dumb bulbs, where the switch controlling the load is correct behavior. Confirmed out of scope rather than assumed.
- **"Separate polish from protection"** — plan task 17 (renaming `switch.inovelli_vzm31_sn_*` → `switch.gianluca_ceiling_light_switch_*`) is cosmetic consistency, not a fix. Itemized separately in the PRD so it can be cut on its own without touching the corrective work.
- **"Use the build-os execution flow"** — `/plan-to-prd` → `/build` → `/wrap`, no hand-rolled orchestration.
- **Project has no `memory/entries/`, `memory/MEMORY.md`, or `LEARNINGS.md`.** Phase 5.1/5.2 will need to create the structure rather than append to it.

## Phase Progress

- [x] Phase 0 — Build log initialized, status stamped `in-progress`
- [ ] Phase 1 — Pre-build (1.2 pre-mortem SKIPPED, 1.3 review SKIPPED — lite mode)
- [ ] Phase 2 — Memory & PRD
- [ ] Phase 3 — Worktree setup
- [ ] Phase 4 — Build
- [ ] Phase 5 — Wrap & report
- [ ] Phase 6 — Cleanup

## Session Log

### 2026-09-01 — Session 1

- Pre-flight: plan `status: approved`, working tree clean except the `/approve` stamp, branch `master`, `origin/master` in sync, `2e72108` (Office fix) confirmed in history.
- Roles resolved: orchestrator=`sonnet`, gitboss=`haiku`.
- Phase 0 complete.

### 2026-09-01 — Session 1 (cont.)

All 5 tasks complete, reviewer verdict READY on first pass, 0 rework rounds.

| Task | Commit | Note |
|---|---|---|
| task-1 audit | `a871c45` | Found 1 missing entity; **location was wrong**, corrected by orchestrator |
| task-2 retarget | `131a54a` | 1 action + 2 conditions retargeted; 2 triggers correctly kept on the switch |
| task-3 sync automations | `45b2ea7` | Verbatim port of the Office pair; ping-pong guard verified by hand |
| task-4 dashboards + typo | `d7067df` | Plus `bff12c9` tracking commit |
| task-5 validate | `bcdea70` | Full-diff sweep found **4 more** broken entity refs |

**Key finding — the audit's scope was wrong, not its method.** Task-1 covered `packages/gianluca_room/**` + dashboards and reported "1 MISSING, all else clean." The final full-diff entity check found 4 more, all in house-level files the room-scoped audit never looked at: three dead climate sensors in `packages/house/areas/upper_floor/gianlucas_bedroom.yaml` (his room card has been showing no climate data) and the Inovelli switch sitting in the Upper Floor Lights group in `packages/lights/upper_floor_lights.yaml`.

Phase 4.2 reviewer independently verified the "no lights-on automation" premise across the whole repo (including the six previously-unexamined files in `automation/gianlucas_room/`) and confirmed all remaining switch references there are `platform: state` triggers, not actions. Orchestrator re-verified that claim directly.

- [x] Phase 1 — SKIPPED per lite mode (1.2 pre-mortem, 1.3 review)
- [x] Phase 2 — Memory & PRD (`d392dd8`)
- [x] Phase 3 — Worktree `worktree-inovelli-lighting-sync`
- [x] Phase 4 — Build + holistic review (READY)
- [x] Phase 5 — Wrap: memory entry, prd.json reconciled, plan stamped `shipped`
- [ ] Phase 6 — Cleanup
