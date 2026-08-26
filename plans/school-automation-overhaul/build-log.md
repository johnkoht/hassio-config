# Build Log: school-automation-overhaul

Started: 2026-08-25

---

## Phase 0 — Initialize Build Log

- **Status**: COMPLETE
- Build log created.
- `plan.md` frontmatter stamped `status: approved` → `status: in-progress`.
- Pre-flight: `has_pre_mortem: false` → Phase 1.2 runs. `has_review: true` → Phase 1.3 skipped (review.md exists, verdict Revise, revisions applied 2026-08-25). `has_prd: false` → Phase 2.2 runs.
- Mode: full (`lite` not passed).
- Working tree at start: clean except untracked `plans/inovelli-lighting-sync/` (unrelated, left alone) and `plans/school-automation-overhaul/`.

## Phase 1 — Pre-Build

### 1.1 Save Plan
- **Status**: COMPLETE — plan already on disk at `plans/school-automation-overhaul/plan.md`.

### 1.2 Pre-Mortem
- **Status**: COMPLETE — **4 CRITICAL risks found. SHIP PAUSED at Phase 1.2 gate.**
- `pre-mortem.md` written. 12 risks; 4 CRITICAL, 4 HIGH.
- CRITICAL: (1) verification structurally cannot run inside the worktree — this repo has no local runtime, code reaches HA only via `deploy.sh` pulling from GitHub; (2) ~6 human-only steps interleaved with automated ones, so the plan is not autonomously executable; (3) the two override booleans have no reset, reintroducing the birthday-countdown latch bug; (4) rollback does not roll back — restored automations carry `initial_state: off` and stay silently disabled.
- All four are execution-model defects, not design defects. The plan's engineering is sound post-review; its assumed repo shape is wrong.
- **GATE RESOLVED 2026-08-25** — John: "splitting makes sense. go ahead with track A and then tomorrow i will handle the second track manually."
- Plan edits applied for all 4 CRITICAL + 4 HIGH: ungated nightly override reset (task 8); ordered rollback sequence with explicit `automation.turn_on` calls; task 1 baseline extended to capture automation enabled-state (c) and a `.storage` reference sweep (d); shadow run must span a Wednesday; two-weekend landing guidance; `calendar_events_today` guard note in task 17; `deploy.sh` Docker-missing path must fail loudly (task 0); Workday integration explicitly left alone; TTS un-suppression made an explicit decision.
- `has_pre_mortem: true` stamped.
- **Scope for this ship: Track A only.** Track B (secrets round-trip, calendar re-subscribe, `.storage` deletions, schedule-value entry, all live verification) is deferred to a manual session with John.

### 2.1 Memory Review
- **Status**: COMPLETE
- `~/.claude/build/memory/collaboration.md` + project auto-memory reviewed. Actionable for the PRD:
  1. **Explicit file-reading lists in every developer prompt** — highest-impact practice on record; prevents the context gaps that cause reimplementation.
  2. **Embed pre-mortem mitigations in each task prompt**, not just in `pre-mortem.md` — when they live only in the doc, subagents don't apply them.
  3. **Sequential subagent execution only** — hard constraint, never parallel on the same codebase.
  4. **Developer subagents run on `sonnet`**; reviewer/final-gate on the session model.
  5. **Phantom-task detection first** — verify the proposed output doesn't already exist before writing.
  6. **Never restart HA**; reload specific domains. John deploys himself.
  7. **`!include_dir_named` keys by basename globally** — every new filename must be globally unique; `.yml` is never loaded.

### 1.3 Cross-Model Review
- **Status**: SKIPPED — `has_review: true`. `review.md` written 2026-08-25 (two independent adversarial passes; verdict **Revise**; all five blocking defects fixed and plan rewritten before approval).

## Phase 2 — Memory & PRD

### 2.1 Memory Review
- **Status**: PENDING

### 2.2 Convert to PRD
- **Status**: PENDING

### 2.3 Commit Artifacts
- **Status**: PENDING

## Phase 3 — Worktree Setup
- **Status**: PENDING

## Phase 4 — Build
- **Status**: PENDING

## Phase 5 — Wrap & Report
- **Status**: PENDING

## Phase 6 — Cleanup
- **Status**: PENDING

---

## Carry-forward constraints (must survive into the PRD)

1. **Plan Phase 0 (`deploy.sh` secrets fix) ships as its own commit, verified, before plan Phase 1 begins.** Explicitly confirmed by John at approval. Do not bundle it into the first build batch.
2. **Secrets must be pushed to the Yellow before any commit referencing a new `!secret` key** — a missing key is a hard config-load failure, not a degradation.
3. **No `initial:` on any schedule helper** — it disables state restoration and silently reverts dashboard edits on restart.
4. **Plan Phase 4 deletions must not land before task 17** (`morning_update.yaml` re-point), or the morning briefing raises `UndefinedError` and produces nothing.
5. **Never restart HA** — reload `input_datetime`/`input_number` before `template`, or run `reload_all` twice.
6. **Shadow-run gate after plan Phase 2** — 2-3 school days comparing new derived sensors against the still-live old booleans before proceeding.
