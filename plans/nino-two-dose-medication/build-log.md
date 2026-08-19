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
- [ ] 2.1 Memory review
- [ ] 2.2 `/plan-to-prd`
- [ ] 2.3 Commit artifacts

## Phase 3 — Worktree Setup
- [ ] 3.1 EnterWorktree
- [ ] 3.2 Verify worktree active

## Phase 4 — Build (worktree branch)
- [ ] 4.1 Execute PRD via /build
- [ ] 4.2 Final review (orchestrator: sonnet)

## Phase 5 — Wrap & Report
- [ ] 5.1 Memory entry
- [ ] 5.2 LEARNINGS.md
- [ ] 5.3 Commit implementation
- [ ] 5.4 /wrap
- [ ] 5.5 Finalize status (shipped + prd.json reconcile)
- [ ] 5.6 Ship report
- [ ] 5.7 Merge gate (gitboss)

## Phase 6 — Cleanup
- [ ] 6.1 ExitWorktree

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
