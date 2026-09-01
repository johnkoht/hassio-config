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
