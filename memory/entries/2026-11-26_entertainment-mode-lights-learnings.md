# Entertainment mode lights: learnings (2026-11-26)

Shipped with `/ship lite`. There were 4 tasks, done in one developer pass. The reviewer approved it on the first review, and all 2549 tests pass.

## What changed
- The room on-files turn the main-floor lights on at 100%: the foyer, the kitchen and its LED, the family room, and dining/living (in a new dining on-file).
- Seven lights-off automations now need the mode to be off. Each also triggers when the mode ends, so its own conditions decide again.

## Learnings
- `condition: sun after: sunrise` with no `before` stays true until midnight. It does not mean "daytime".
- `foyer_lights_day_off` has no lux condition. A new trigger inherits every gap in an automation's conditions, so check the conditions against each trigger.
- To gate a single trigger path, use `or: [not: [trigger id X], <state check>]`. A `not` with one child is a plain negation.
- The PRD made a wrong claim about the nightlight gate. The developer checked the shipped code rather than following the PRD. Keep the "AC contradicts code → stop and report" line in developer prompts.

## Follow-ups
- No automation ever turns `light.kitchen_led` off.
- Choosing a playlist while the mode is on doesn't start the music. That is a separate fix, waiting on a go-ahead.
