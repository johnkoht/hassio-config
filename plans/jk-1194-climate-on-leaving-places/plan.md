---
title: Resume climate when we leave certain places
slug: jk-1194-climate-on-leaving-places
status: approved
created: 2026-11-23
has_pre_mortem: false
has_review: false
has_prd: false
---

# Resume climate when we leave certain places (JK-1194)

## Problem

The Nests go to Eco when the house has been empty for 30 minutes. They come back only at `nearly_home` (under 5 miles away, heading towards home), so we can walk into a cold or hot house after a visit to family or friends.

Some places we visit are a known drive from home. Leaving them should start the climate early.

## Goal

When an adult leaves a "climate trigger" place while the house is empty and a floor is in Eco, resume that floor. Adding a place later is a UI change, not a YAML edit.

Zone names and people's names stay out of the repo, tests, commits and PRs. Everything refers to "labelled zones".

## Approach

**The group is an HA label.** John puts a label (proposed name `climate_trigger`) on each zone in Settings. The automation reads it with `label_entities('climate_trigger')`, the same pattern as the `zigbee_router` label in JK-1263. No place is named anywhere in the repo.

**One automation, `packages/climate/climate_resume_when_leaving_labelled_zone.yaml`.**

Trigger: a state trigger on `person.john_koht` and `person.cristina_falbo`, with `for: 3 minutes`. A short GPS blip out and back never completes the wait, so it never fires.

Why not `trigger: zone`: its `zone:` field takes one fixed entity id, not a template or a label, so it can't follow a label. A state trigger plus a template condition can, and the label is read fresh at trigger time.

Conditions, global to feature:
1. `input_boolean.house_occupied` is off. This also covers "another adult is home", since `house_occupied` goes off only when `group.all_people` is not home.
2. Template: the zone the person left is labelled. `trigger.from_state.state` (a person's state is the zone's friendly name) is in the names of the `label_entities('climate_trigger')` zones.
3. Template: they did not move to another labelled zone, to `home`, or to `unavailable` / `unknown`.
4. At least one Nest is out of `none` (the same Eco check the existing resume automations use).

Actions: two `if` blocks, one per floor, each guarded by that floor's own preset check, calling `script.main_floor_climate_to_resume` / `script.second_floor_climate_to_resume`. The guard stops the resume script's "climate activated" push from firing for a floor that wasn't in Eco. One automation, not two, because the trigger and label logic would otherwise be duplicated.

Nothing else changes. The resume scripts are reused as they are, including the saved-mode restore. When we later reach `nearly_home`, the existing resume automations see preset `none` and do nothing.

**Why not a template sensor for "adults in labelled zones":** it can look stale. HA re-renders it only when a tracked state changes, so labelling a zone someone is already in, then having them leave, would show no change. Reading the label at trigger time has no such gap.

## Known gap (not fixed in v1)

The leave only helps once a floor is already in Eco. `main_floor_climate_to_eco` fires at 30 and 60 minutes of empty house.
- Leave before minute 30: no Eco yet, so nothing to resume. The Nests still go to Eco at minute 30 while we are on the road, and `nearly_home` resumes them later, as today.
- Resume between minutes 30 and 60: the 60-minute trigger can put the floor back in Eco.

A fix needs the Eco automations to respect an "arrival expected" flag. That belongs to the smart climate plan, so it is a question, not scope. See Q3.

## Smart climate plan

`plans/smart-climate-control/plan.md` replaces Eco and resume with a mode state machine whose inputs include `nearly_home`. Conditions 2 and 3 above, plus the 3-minute `for:`, are exactly an "arrival expected" input. When that plan lands, the state machine takes this trigger as an input and this automation's actions become a mode change. The label lookup lives in one template condition, so it lifts cleanly into a binary_sensor then.

## Update 2026-11-24

John approved with the defaults. The `climate_trigger` label is live on four UI-created zones. The smart climate controller has merged and runs as a dry run alongside the old Eco and resume automations, which still drive the Nests, so this design stays: it calls the existing floor resume scripts. After the smart-climate migration this trigger becomes an input to `packages/climate/smart/modes/climate_mode_resolve.yaml` (like `nearly_home`) and this automation is removed. That part is not built here.

## Tests

`tests/test_climate_resume_leaving_zone.py`, in the style of `tests/test_zigbee_router_alert.py` (render the condition templates with jinja against fake states):
- Leaving a labelled zone to `not_home` passes; leaving an unlabelled zone fails.
- Moving between two labelled zones, to `home`, or to `unavailable` fails.
- A newly labelled zone (just a longer `label_entities` result) passes with no YAML edit.
- Trigger shape: both adults, `for` is set, no zone entity ids in the file.
- `house_occupied` on blocks it.
- Per-floor guard: a floor not in Eco is not resumed.
- Modern syntax, one automation, id equals filename, no `initial:`.
- Privacy: no zone or place name in the file or the test. The label name is the only identifier.

Run: `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`. No `deploy.sh --check`, no deploy.

## Docs

- `docs/AUTOMATIONS.md`: one line on the label.
- `packages/climate/LEARNINGS.md`: `trigger: zone` can't follow a label; a person's state is the zone name; the 30/60 minute Eco gap.

## Needs from John (UI, not code)

- Create the `climate_trigger` label and put it on the two friends' zones and the grandparents' zones.
- Check the grandparents' zones are UI-created. Zones from `configuration.yaml` have no registry entry and can't take a label. If they are YAML zones, they need to move to the UI.
- Reload automations after merge (no restart).

## Open questions

1. Label name `climate_trigger` OK?
2. Either adult leaving (proposed), or only when the last adult at the place leaves? With the proposed default, if one of us leaves while the other stays, the house resumes.
3. Add an "arrival expected" hold so the Eco automations don't re-Eco while we are on the way (closes the known gap)? Proposed: not now, fold it into the smart climate plan.
4. Resume both floors (proposed), or only the main floor?
5. 3 minutes of `for:` for GPS blips OK?
6. Skip while `input_boolean.bedtime` is on? Proposed: no extra limit, since the house-empty condition already covers it.
