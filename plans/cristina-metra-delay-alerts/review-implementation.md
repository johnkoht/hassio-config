---
reviewer: opus (independent, cross-model from the sonnet builders)
date: 2026-09-28
scope: git diff 3029d96..HEAD
verdict: Approve with suggestions (1 must-fix)
---

# Review: Cristina Metra Delay Alerts (Implementation)

**Type**: Implementation · **Review Path**: Full · **Complexity**: Large

## Must-fix — resolved

1. **The alert flapped at the 5-minute line.** The push fired at ≥ 5 and the clear at < 5, so a prediction wobbling between 4 and 5 re-pushed a time-sensitive alert each time.
   - **Fixed:** the clear now happens only at ≤ 2. At 3–4 the existing push stays, and the `|delay − h| ≥ 5` rule governs re-pushes.
   - **Harness:** 5→4→5 gives one push; 5→2→5 gives push, clear, push.

## Also resolved: protection, not polish

4. **An un-cancellation cleared silently.** A train going cancelled → on_time removed the "cancelled" push without telling her. If she had already read it, she'd still think the train was cancelled.
   - **Fixed:** a new "Un-cancelled" branch pushes "✅ Your {{ sched_hm }} train is back on schedule." The harness row U1 covers it.

## Deferred (backlog)

2. **A restart or reload mid-morning misses a delay that was already showing** until its value next changes. Low risk, because predictions change often.
3. **Stale notifications are never cleared.** Yesterday's push, or one left after departure, stays in the notification center. A 03:00 `clear_notifications` for both tags would fix it.
5. **The `error` attribute is never visible.** HA hides attributes while the sensor is unavailable. Consider dropping it from `json_attributes`; it's already documented in `packages/transit/LEARNINGS.md`.
7. **The script runs every 60 s all day**, mostly to report `outside_window`. That's about 2,880 short python3 runs a day; acceptable, but a gated `homeassistant.update_entity` would avoid it.

## Test gaps noted

- There's no test of the status threshold itself (delay 4 → on_time, 5 → delayed), or of the window edges (06:45:00, 09:00:00, 09:00:01).
- The alert and morning-update Jinja harnesses are throwaway scratchpad files, not committed tests. Candidate for backlog: host them under `tests/`.

## Confirmed against the HA 2026.7 source

- With `not_to`, attribute-only `last_update` changes don't fire the delay trigger. The status-attribute trigger ignores other attributes.
- Dedup holds when two triggers fire for one update under `mode: queued`.
- When the sensor flips back to available, its attributes are rebuilt before the state write.
- `status` renders as a native `None`, so the null checks work.

## Devil's advocate

The most likely failure was wobble-driven push spam; that's fixed. The worst outcome was a silently deleted cancellation notice; that's fixed too.
