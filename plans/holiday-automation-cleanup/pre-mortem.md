## Pre-Mortem: Holiday Automation Cleanup (JK-1229)

No `.build/expertise` profiles exist in this repo; risks are drawn from `packages/holidays/LEARNINGS.md`, `memory/MEMORY.md` and a read of every file the plan touches (2026-11-13).

### Risk 1: Dec 1 silently does nothing because six automations stay disabled
**Problem**: Removing `initial_state` doesn't re-enable an automation; HA restores its last runtime state (memory: `reference_initial_state_does_not_reenable`). All six Christmas automations are `off` live.
**Mitigation**: Live step 8 is a required item in the hand-off report, with an `/api/states` check, and must run before Nov 30. The two new automations (`christmas_season_started`, `christmas_season_ended`) and `halloween_season_ended` are new entities, so they start enabled; the report still lists them in the check.
**Verification**: Hand-off report lists all six by entity ID with the check command.

### Risk 2: `!include_dir_named` basename collisions
**Problem**: Packages are keyed by file basename globally; a duplicate basename silently drops one file (memory: `reference_yml_vs_yaml_loading`).
**Mitigation**: New files are checked for collisions before creation: `turn_on_christmas_lights.yaml`, `turn_off_christmas_lights.yaml`, `christmas_season_started.yaml`, `christmas_season_ended.yaml`, `christmas_season_schedule.yaml`, `halloween_season_ended.yaml` have no existing namesake (checked 2026-11-13). `test_duplicates.py` runs in the suite.
**Verification**: `find packages -name <basename>.yaml` returns one file each; full suite green.

### Risk 3: Multi-entity `state` condition needs every entity on
**Problem**: The `christmas_not_activated` safety-off `if` lists four entities with `state: "on"`, so it only fires when all are on (LEARNINGS line 3). Adding the front yard to that list would make it rarer still.
**Mitigation**: Drop the `if` and turn the groups off unconditionally; turning off something already off does nothing.
**Verification**: Test asserts the safety-off action targets the front yard and has no all-entities `state` gate.

### Risk 4: The Halloween season gate blocks its own season-ended trigger
**Problem**: Adding `halloween_season_active = on` as a condition to `halloween_lights_turn_off` and also a "season turned off" trigger to the same automation means the new trigger can never pass. The existing `_startup_gate` test helper also assumes a single `or` condition.
**Mitigation**: Put "season turned off → decorations off (unless Christmas season is on)" in its own automation, `halloween_season_ended`. One automation, one job; `halloween_lights_turn_off` gets the plain season gate.
**Verification**: Tests cover both automations.

### Risk 5: Season handover order (Q6)
**Problem**: When Christmas season turns on, Halloween season must turn off without `halloween_season_ended` killing the front yard. The guard reads `christmas_season_active`, which must already be `on`.
**Mitigation**: `christmas_season_started` triggers on `christmas_season_active → on`, so by the time it turns Halloween off, the Christmas boolean is already on and the guard holds.
**Verification**: Test asserts `halloween_season_ended` has the `christmas_season_active = off` condition and `christmas_season_started` triggers on the Christmas boolean turning on.

### Risk 6: Manual early start in November is undone at 02:00
**Problem**: Once `christmas_disabled` is enabled, its window `not (m == 12 or (m == 1 and d <= 7))` includes November, so a manual season start before Dec 1 (e.g. Thanksgiving weekend) is reverted at the next 02:00 or restart. Last year it wasn't, because `christmas_disabled` was disabled.
**Mitigation**: Build to the approved window. Flag it to John with the workaround (switch "Start and stop Christmas on its own" off after starting early, back on before Jan 7) and the alternative (narrow the stop window). Not a Dec 1 blocker.
**Verification**: Listed under "for John" in the ship report.

### Risk 7: Repointing the tree's utility meter spikes its daily value
**Problem**: `utility_meter` YAML isn't reloadable, so the source change applies only on John's next restart. On that restart the meter may compute its first delta against the old plug 14 reading and record one bad day.
**Mitigation**: Hand-off notes the change is restart-only and to check `sensor.family_room_xmas_tree_daily_energy` after the next restart, fixing a spike with `utility_meter.calibrate` to 0.
**Verification**: Line in the live-steps section of the report.

### Risk 8: Entity IDs or popup rows change by accident
**Problem**: Automation entity IDs are slugified from the alias at first registration (memory: `reference_automation_entity_id_from_alias`). The settings popup and the Q3 group point at `automation.christmas_activated`, `automation.christmas_not_activated`, `automation.christmas_enabled`, `automation.christmas_disabled`.
**Mitigation**: Every surviving automation keeps its `id` and alias exactly. New automations get aliases whose slug equals the id. A test pins surviving ids.
**Verification**: Test asserts the surviving ids and aliases.

### Risk 9: Group changes don't apply on `--reload`
**Problem**: `switch.christmas_lights` membership and the new `group.christmas_season_schedule` need `group.reload` (LEARNINGS line 7).
**Mitigation**: Live step 7 reloads Groups and checks both entities.
**Verification**: Report includes the check.

### Risk 10: PII in a public repo
**Problem**: Plans and docs could pick up family routines.
**Mitigation**: Nothing here is schedule- or location-specific beyond season dates that are already in the repo. gitleaks hook runs on commit.
**Verification**: Grep the diff before push.

### Risk 11: Out-of-scope playroom bug tempts a fix
**Problem**: `packages/playroom/lights/playroom_lights_off.yaml:50` targets `swtich.christmas_playroom_lights` (typo). Fixing it would turn off the Christmas window lights whenever the playroom empties, a product change.
**Mitigation**: Leave it; list it for John.
**Verification**: File untouched in the diff.

## Summary
Total risks identified: 11
Categories: rollout/state, config loading, logic, ordering, scope, data, docs, privacy
CRITICAL risks: none. Risk 6 is a product follow-up for John, not a blocker.
