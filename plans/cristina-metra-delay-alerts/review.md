---
reviewer: sonnet (cross-model), verified by main agent
date: 2026-09-28
verdict: Revise
---

# Review: Cristina Metra Delay Alerts

**Type**: Plan · **Review Path**: Full · **Complexity**: Medium · **Recommended Track**: standard (pre-mortem before build)

## Must-fix

1. **`custom_components/` has no deploy path.** `deploy.sh:7-8` and `.gitignore:40` confirm custom_components is gitignored and untouched by deploy; the repo has no such directory. A hand-built `custom_components/metra_trains/` can't ship through the normal flow and needs an HA restart to load.
2. **Re-notify compares the wrong numbers.** Diffing `trigger.from_state` measures poll-to-poll change, so a 6→8→11 drift never re-notifies. Store the last *pushed* delay per train in a helper written only on notify.
3. **Poll window ends before late trains leave.** The morning update can fire at ~08:50 (07:05 + 45 + 30 + 30 min of waits, `morning_update.yaml:16-39`); train 2 delayed 20 minutes departs after polling has already stopped. Extend the window or accept the gap.
4. **`cancelled` has no defined state value.** The contract says state = delay minutes; a cancelled train needs a concrete state so the fake-state test and templates agree.

## Nice-to-have

5. `scheduled_departure` is a bare clock time; define in the contract how "today at scheduled + delay" is computed (or publish `expected_departure` as a full ISO datetime).

## Test coverage gaps

- Attribute-only change (`last_update` ticks, delay unchanged) must not re-push.
- Delay shrinking but still ≥ 5 (20 → 12): re-notify or not? Unspecified.
- unknown → number at window start.

## Strengths

- Office-day helper omits `initial:` (matches repo gotcha).
- `general_notification` / `clear_notifications` field usage verified correct.
- The pre-existing station-arrival self-disable ID mismatch was correctly kept out of scope.

## Devil's advocate

**If this fails, it will be because** the contract was frozen before anyone saw the real feed. **The worst outcome would be** a silent miss: "sensor never updated" and "on time" both render as nothing.

## Main-agent verification (2026-09-28)

- Confirmed #1 (`deploy.sh:7-8`, `.gitignore:40`, no `custom_components/` in repo).
- Yellow's HA container has `protobuf 6.32.0` on Python 3.14.6 (`ssh hassio`, `docker exec homeassistant`). That opens a git-deployable reader: a `command_line` sensor running a repo-tracked Python script with a vendored `gtfs_realtime_pb2.py`, emitting JSON. It needs no custom_components directory and no restart beyond reloading `command_line`. Gencode/runtime protobuf version compatibility is still unverified.
- `metra_api_token` is not yet in `/homeassistant/secrets.yaml` on the Yellow.
- The reviewer's suggestion to check `epicurus` is wrong: production HA is the Yellow (`hassio`).
