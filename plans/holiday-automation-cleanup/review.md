# Plan Review — holiday-automation-cleanup (2026-11-13)

Reviewer subagent (sonnet), plan + orchestrator design refinements. **Verdict: PROCEED** — no structural blockers.

## DEFECTs folded into the PRD
1. `christmas_activated` had no trigger on `christmas_season_active → on`; a manual season-on in the evening did nothing until the next day. → task-1 adds the trigger.
2. Task 7a (utility_meter source) only applies on a restart and may record a one-day delta spike. → Kept in PR 1 (it is inert until John's next restart), with a live note: check `sensor.family_room_xmas_tree_daily_energy` after the restart and `utility_meter.calibrate` it if it spikes.
3. Q3 group: old-style `group:` merges fine from a package and reloads with `group.reload`. → task-3 adds a test that the popup row and the group agree.
4. New automations start enabled; list them in the live `/api/states` check. Add tests: no `initial_state` in holiday files; holiday basenames unique across `packages/`.
5. A season change while HA is down never fires `christmas_season_ended`. → task-1 gives it a startup trigger (`id: startup`) with a `christmas_season_active = off` condition.

## BACKLOG (reported, not built)
- Mutual guard so Halloween can't be hand-enabled during Christmas season (a hand-set Halloween in December would let `halloween_lights_turn_off` cut the Christmas front yard at 22:00).
- A "season skipped" indicator when the schedule group is off.
- Dry run (live step 10): restore `christmas_season_active` to off afterwards, and run it before noon so `christmas_activated` can't light the house.
