# Holiday automation cleanup (JK-1229, PR #159 + dashboard PR)

**What:** Christmas now starts itself at 02:00 Dec 1 and stops after Jan 7. `switch.christmas_lights` no longer contains the front yard, and the Christmas automations target `switch.front_yard_holiday_decorations` explicitly. Season is a condition (`christmas_season_active`) on the on-paths instead of scripts that switch automations on and off. Halloween's off path is season-gated, with a separate `halloween_season_ended` guarded on Christmas. Dead automations deleted (incl. `handle_ikea_unresponsive`, whose plugs are now kitchen appliances). 4 tasks, each first attempt; plan review found 5 defects folded into the PRD, PR review APPROVED with no ITERATE.

**Learnings:**
- Toggling automations from scripts hides the real on/off in the registry, and `initial_state: false` silently kept the season automations off for a year. A season boolean as a condition is visible in the repo and testable.
- A season-on condition and a season-off trigger can't share one automation; split them.
- Plan review caught a missing trigger: gating `christmas_activated` on the season without a season-on trigger meant a manual evening start did nothing until the next day.
- `utility_meter` YAML (source change) applies only on a restart; check for a one-day delta spike after it.

**Follow-ups (BACKLOG):**
- `christmas_disabled` reverts a manual November start at 02:00 (window covers Nov). Product call for John.
- Hand-enabling Halloween in December would let its 22:00 off cut the Christmas front yard; a mutual guard would close it.
- `packages/playroom/lights/playroom_lights_off.yaml:50` targets `swtich.christmas_playroom_lights` (typo); fixing it changes behaviour, so John decides.
- Christmas spot scene capture in December (plan step 15).
