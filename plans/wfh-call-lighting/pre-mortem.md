## Pre-Mortem: WFH Call Lighting

Run 2026-10-30 against `plan.md` including its ship addendum (live reads).

### Risk 1: Tripping the manual-change latch (HIGH)

**Problem**: `office_lights_manual_change` watches `light.office_ceiling_bulbs` on/off/brightness. Our `light.turn_on` and AL's resume could latch `office_lights_manually_toggled`, which silences every on-type automation until the room empties.

**Mitigation**: Read the condition: a change counts as manual only if `user_id` is set or there is no `parent_id`, and `:al:` contexts are ignored. An action inside an automation run carries the run's context as parent, so the start `light.turn_on` is ignored. AL's turn-on uses `create_context(...)` ids containing `:al:`. No extra context plumbing is needed; tests pin the two facts (the automation uses `light.turn_on` from an automation action; the detector keeps both guards) and render the detector template with an automation context.

**Verification**: A template-render test of the detector's real condition against an automation-parented state and an `:al:` state, both expected to be ignored.

---

### Risk 2: The lamp cannot take colour or brightness (HIGH, plan premise wrong)

**Problem**: The plan says ceiling bulbs and lamp get 3000K at 100%. `light.office_office_lamp` is `onoff` only and is not in the AL entry. A colour command to it is meaningless.

**Mitigation**: Target the ceiling bulbs only, document why, and tell the lead. Nothing is lost: the lamp is already a fixed white source and AL never changes it.

**Verification**: Test asserts start targets `light.office_ceiling_bulbs` and not the lamp, shelf, El Gato, or the ZHA group `light.office_lights`.

---

### Risk 3: Unseeded numbers fire the feature at 2700K / 30% (HIGH)

**Problem**: New `input_number`s without `initial:` start at their minimum. If the automations deploy before John seeds them, a call would set the office to 2700K at 30%, worse than AL.

**Mitigation**: A feature switch `office_call_lighting`, no `initial:` so it is created off, gates start. Deploy order: reload helpers, seed numbers, then turn the switch on. The deploy notes say this explicitly.

**Verification**: Test asserts start requires the feature switch, and that none of the four helpers uses `initial:`.

---

### Risk 4: AL left off (HIGH, the main risk)

**Problem**: Flag set and AL off, then the end condition never fires (DnD to Auto to Off re-arm, HA restart during a call, `for:` timers lost on automation reload).

**Mitigation**: Start sets the flag first, then turns AL off (a failure between leaves AL on and a stale flag, which is harmless). End triggers on `Auto` or `Off` for 3 minutes (both targets, so a hop re-arms) and on occupancy off. Reset: flag on for 3 hours (only when the room is not in DnD), flag on for 12 hours (unconditional), at HA start and on automation reload (both only when the room is not in DnD; best effort). Reset and end both respect entertainment mode (do not turn AL on while it is on), but always clear the flag.

**Verification**: Structure tests on all three files; a test that the two resume paths guard on `input_boolean.entertainment_mode`; sabotage by removing the flag condition on end.

---

### Risk 5: Entertainment mode and a manual AL toggle (MEDIUM)

**Problem**: Entertainment turns the same switch off and on. Start must not run when entertainment already turned AL off, and end must not turn AL on while entertainment is active. Entertainment ending mid-call turns AL on while we are still "paused".

**Mitigation**: Start requires the AL switch on. End and reset call `switch.turn_on` only inside an `if` on `entertainment_mode` off, and always clear the flag. The mid-call case degrades to AL adapting for the rest of that call; accepted and documented.

**Verification**: Tests for the guards; LEARNINGS notes the accepted case.

---

### Risk 6: A call that starts in daylight and runs past dusk (MEDIUM, plan gap)

**Problem**: The plan gates once, at call start. The reported complaint is a call that spans the transition.

**Mitigation**: Second start trigger on the AL switch's `color_temp_kelvin` attribute crossing below `input_number.office_call_color_temp`. Same conditions and actions. It is one trigger, easy to remove.

**Verification**: Test for the trigger shape (attribute, entity limit) and the shared gate template.

---

### Risk 7: Gate renders wrong (MEDIUM)

**Problem**: Missing or non-numeric AL attributes, or a bright midday call being "corrected".

**Mitigation**: Gate template: kelvin `| float(99999)` below the setting, or brightness `| float(100)` more than 5 below the setting. Missing attributes fall to "not below", so nothing fires (fail quiet; the plan's alternative of failing toward daytime lights is also harmless but this avoids pausing AL on bad data).

**Verification**: Template render test across AL kelvin 2000, 2900, 3000, 5500, missing, and brightness variants.

---

### Risk 8: Reimplementation and file collisions (LOW)

**Problem**: `!include_dir_named` keys by basename globally; `test_naming` and `test_duplicates` check ids, aliases, filenames.

**Mitigation**: Unique basenames `office_call_lighting_*`, files in `packages/office/call_lighting/`, filename equals id, one automation per file. Nothing already pauses the office AL on calls (grep of packages/: the only office AL switch writers are the two entertainment files; the sleep switch is referenced by the dashboard only).

**Verification**: Full suite stays green.

---

### Risk 9: Documentation debt (LOW)

**Problem**: `packages/office/README.md`, `packages/office/LEARNINGS.md`, `docs/ROOMS.md`, dashboard rows.

**Mitigation**: Updated in the same PR, plus the memory entry.

**Verification**: `/wrap` docs check.

---

### Risk 10: Rollback and performance (LOW)

Rollback is turning `input_boolean.office_call_lighting` off, or reverting the PR; the reset and end automations still run and resume AL. No templates re-render on many entities; triggers are on four entities. No performance impact.

---

## Summary

Total risks identified: 10
Categories: integration, backward compatibility, scope drift, test complexity, environment/config, rollback
CRITICAL risks (must address before proceeding): none. Two plan premises were wrong or incomplete (the lamp is on/off only; call-spanning-dusk), both handled in the addendum without needing a decision from John.
