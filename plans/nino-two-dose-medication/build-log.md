# Build Log: nino-two-dose-medication

Started: 2026-08-18 23:12 CDT
Mode: `/ship` (full workflow)

Pre-flight: `status: approved` → `in-progress`. `has_review: true` (Phase 1.3 skipped — review completed 2026-08-18, verdict Revise, all 9 changes folded into the plan). `has_pre_mortem: false` (Phase 1.2 runs). `has_prd: false` (Phase 2.2 runs).

---

## Phase 0 — Initialize Build Log
- [x] build-log.md created
- [x] plan.md `status: approved` → `in-progress`

## Phase 1 — Pre-Build (master)
- [x] 1.1 Plan saved at `plans/nino-two-dose-medication/plan.md`
- [x] 1.2 Pre-mortem → `pre-mortem.md`. 2 CRITICAL + 4 HIGH + 2 confirmed-live risks. Gate tripped → paused → **builder approved folding in all of them (2026-08-18). Mitigations now in plan Tasks 2/3/4/6/7/11/12/13 and Approach. Gate CLEARED.**
  - Builder also changed dose 1's time from the captured `08:00:00` to **`07:00:00`** — this is a new intended value, not the pre-migration one. Task 12 criterion 3 asserts `07:00:00`.
- [x] 1.3 Cross-model review — SKIPPED (`has_review: true`)

## Phase 2 — Memory & PRD (master)
- [x] 2.1 Memory review — no `memory/entries/` in this repo; project memory at `~/.claude/projects/-Users-johnkoht-code-hassio-config/memory/`. Relevant: `reference_deploy_and_host_topology` (deploy no-op risk) and `reference_yml_vs_yaml_loading` (basename collision) — both folded into plan Tasks 8/11. Collaboration practices applied: explicit read-lists + inline per-task mitigations in the PRD, sequential-only execution.
- [x] 2.2 `/plan-to-prd` → prd.md + prd.json (5 tasks) + working-memory.md. Plan tasks 2-8 collapsed into 2 sequential PRD tasks at the data/logic seam — 6 agents rewriting one file would clobber. Plan tasks 1/11/12/13 excluded from prd.json as non-buildable; captured as a post-merge runbook.
- [x] 2.3 Artifacts committed — `b374ad9`

## Phase 3 — Worktree Setup
- [x] 3.1 EnterWorktree → `.claude/worktrees/nino-two-dose-medication`, branch `worktree-nino-two-dose-medication`
- [x] 3.2 Guard passed; artifact commit `b374ad9` present in worktree

## Phase 4 — Build (worktree branch)
- [x] 4.1 Execute PRD via /build — **5/5 tasks complete**
  - task-1 helpers + resolver sensor — APPROVED first pass
  - task-2 reminder automation — **ITERATE ×1**, then approved. Reviewer caught that the automation would never fire; diagnosis (block-scalar whitespace) was wrong and its proposed fix would not have worked. Real cause: HA `_parse_result` runs `literal_eval` on the rendered result, so `"1"` returns int `1` and `dose in ['1','2']` is False. Fixed with `| string` at both comparison sites (`:170`, `:403`), verified by porting HA's `_parse_result` and simulating render→strip→parse. Also added announcement/notification guards (2 → 5 total).
  - task-3 escalation backstop — APPROVED. Orchestrator restored a mute-gate citation the agent had deleted purely to pass AC3's substring grep.
  - task-4 person popup dashboard — APPROVED. Agent correctly challenged an AC: plain `yaml.safe_load` fails on ALL dashboard files (`!include` tag), pre-existing; tag-tolerant loader used instead.
  - task-5 notification card split — APPROVED. First live use of `condition: template` in a Lovelace conditional card in this repo (all 15 siblings use `condition: state`) — flagged for post-merge.
- [x] 4.2 Holistic review — **NEEDS_REWORK → resolved.** Found (a) merge-blocking: Lovelace conditional cards do not support `condition: template` (orchestrator independently verified against live HA docs); fixed with per-dose `_due` template binary sensors + `condition: state`. (b) silent spec deviation: script `mode: "single"` vs PRD's `queued` — no AC covered it; fixed. (c) fabricated citation in working-memory ("supported since 2024.4") — corrected, along with two wrong supporting facts (17 cards not 15; 8 use `numeric_state`). Post-merge criteria 20 → 24, later 24 → 22 after the scope correction.

## Phase 5 — Wrap & Report
- [x] 5.1 Learnings → `learnings.md`; 2 durable memories written to project auto-memory + MEMORY.md index
- [x] 5.2 No `LEARNINGS.md` exists in this repo; equivalent captured in `learnings.md` + auto-memory
- [x] 5.3 Committed
- [x] 5.4 /wrap — all checks ✅ (working tree clean, 0 open ledger entries, no stale refs, both CRITICAL mitigations confirmed present in final tree, all 9 dashboard entities resolve)
- [x] 5.5 plan.md → `shipped`; prd.json reconciled 5/5 on-branch
- [x] 5.6 Ship report delivered
- [x] 5.7 Merge — **builder approved and merged** to master as `83ca747` (--no-ff). Builder is running deploy + verification.

## Phase 6 — Cleanup
- [x] 6.1 Worktree removed after merge

---

## Session Notes

**2026-08-18 23:12** — Ship started. `build-config role orchestrator` → `sonnet`. `worktree.baseRef: head` confirmed in `~/.claude/settings.json:40`.

**Verification-boundary note (carried from plan, affects Phase 4 gating).** This repo is YAML config for a remote Home Assistant instance. Two consequences for the build:

1. `ha core check` is the plan's primary validation gate and **cannot run on this Mac** — there is no HA CLI here; it runs on the Yellow (`ssh hassio`). The build can validate YAML *parseability* locally (Python yaml/ruamel) but cannot validate HA *schema*. The templated-state-trigger failure the review caught (Concern 1) is exactly a schema-level error, so local parse-success must not be reported as validation.
2. Plan Tasks 1 (capture live `input_datetime` value), 11 (deploy), 12 (orphan cleanup), and 13 (14 runtime criteria) require the live system. Task 1 is a **prerequisite input** to Task 2 — it gates correctness of the written config, not just verification.

These are recorded here so Phase 4 does not claim completion on work it structurally cannot perform. Raised with the builder before worktree creation.

**2026-08-18 23:14** — Phase 1.2 pre-mortem returned 2 CRITICAL risks. Paused per gate rules. Awaiting builder decision.

---

## Task 1 Capture — Live State (homelab agent, read-only, 2026-08-18)

Source: HA Yellow at 192.168.1.36 (`ssh hassio`), HA core **2026.7.4**. Data from `/config/.storage/core.restore_state` and the recorder DB.

### The critical value

```
input_datetime.nino_daily_medication_time = "08:00:00"
last_changed: 2026-08-03T04:20:19Z
```

**Nino's configured reminder time is 08:00, not 07:30.** The plan's placeholder `initial: "07:30:00"` for dose 1 would have silently moved his reminder 30 minutes earlier. This entity appears **nowhere in the recorder DB** — `restore_state` is its only live record, exactly as Task 1 anticipated. Deleting the orphan before capturing this would have destroyed the only copy.

Dose 1 `initial:` **must be `"08:00:00"`**. Dose 2's `19:00:00` remains an unconfirmed default for John to set.

### Other live state

| Entity | State | Note |
|---|---|---|
| `input_boolean.nino_daily_medication_taken` | `on` | taken today |
| `timer.nino_daily_medication_timer` | `idle` | `last_transition: finished` |
| `input_select.nino_sleep_state` | `Awake` | |
| `automation.nino_daily_medication_reminder` | `off` | self-disabled by `script.nino_medication_taken` — the exact anti-pattern this plan removes |

### Out-of-repo consumers — the "only 3 files" claim was repo-complete but live-incomplete

`automations.yaml` (UI-managed) has zero matches, but the `.storage` grep found **two references invisible to any repo grep**:

1. **`/config/.storage/lovelace.ui_test`** — a storage-mode dashboard "UI Test" (`url_path: ui-test`, shown in sidebar, no git counterpart) with an entities card referencing `input_boolean.nino_daily_medication_taken` and `timer.nino_daily_medication_timer`. After the rename these rows show "entity not found". **Manual fix via Lovelace UI editor only — no file to edit.**
2. **`/config/.storage/homeassistant.exposed_entities`** — `timer.nino_daily_medication_timer` has a voice-assistant exposure entry (`cloud.google_assistant`). Renaming silently orphans it. **Manual re-expose: Settings → Voice Assistants → Expose.**

Both are new post-deploy manual steps not currently in the plan.

`trace.saved_traces` matched 95 lines (historical execution traces — harmless). `core.entity_registry` confirms 7 enabled entities for this feature; 4 become orphans under the plan (the reset and shortcut automations and `script.nino_medication_taken` keep their IDs).

### Name-collision check — all clear

All 7 proposed new entity IDs are free in `core.entity_registry`.

### Deploy risk confirmed

Host git HEAD `e6dab15` vs local `28b243c` — the divergence described in the `reference_deploy_and_host_topology` memory ("host git diverged + no branch tracking = silent deploy no-ops"). The three files relevant to this migration diffed byte-identical, so no drift affects correctness, **but `./deploy.sh` may silently no-op.** Task 11 must verify the deployed file actually changed on the host, not just that deploy exited 0.

### Agent claim NOT accepted

The agent reported that "template-trigger-inside-`wait_for_trigger` variable access" is "proven working on this exact version," citing `wait.trigger.event.data.action == action_taken` in the existing automation. **That conflates two mechanisms.** Line 129 proves *event* triggers render `event_data` templates against automation variables; line 175 proves `wait.trigger` is populated in choose conditions. Neither exercises a `trigger: template` whose `value_template` reads an automation-level variable inside `wait_for_trigger` — the novel, unprecedented-in-this-repo mechanism. **Pre-mortem Risk 6 stands unchanged.**

### Informational

Supervisor reports the Terminal & SSH add-on in `state: error` (agent connected via OS-level root SSH instead). Unrelated. HA 2026.8.2 available; 2026.7.4 installed.

---

## Scope correction — post-build, pre-merge (2026-08-19)

Builder flagged the solution as more complex than the ask warranted. Assessed and agreed: ~78 lines of real YAML and 4 of 8 helper entities were additions not requested.

**Cut**: card time-gating and the two `_due` binary sensors. Cards reverted to `condition: state` on their own dose's taken boolean — the previous single card's behavior. This also removed the only piece of the change that needed a template condition in a Lovelace card, which was the holistic review's sole merge blocker. Post-merge criteria 24 → 22.

**Kept**: the escalation backstop, after arguing the case explicitly — every notification in this house dies silently when `input_select.notification_level` is `None`, a hole that predates this change and that nothing else detects.

Notable: the unrequested feature generated its own merge blocker, its own rework round, and a share of the review burden. Cutting it removed more than its line count.
