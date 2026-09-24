## Review: radio-network-offline-alerts (implementation)

**Type**: Implementation
**Review Path**: Quick (requested; 3 small single-automation files)
**Complexity**: Small
**Recommended Track**: express

### Concerns

1. **Already offline at boot → no alert (all three)**: state and template triggers fire only on a *transition*. If HA restarts while the UPS link or a radio is already dead, the entity is `unavailable` or the config entry is not `loaded` from the start. There's no change, so no alert fires. This is a realistic case: a power blip reboots the Yellow while the UZG is wedged.
   - Suggestion: add `trigger: homeassistant` / `event: start` to each automation. On that path, `delay: 3 min` and then re-check the condition before notifying.
2. **Hard-coded ZHA entry id (zigbee)**: if the entry is ever re-created (a re-pair, or the Yellow → epicurus migration), `config_entry_attr` returns `None`. Then `.value` errors and the trigger goes silently dead. That's the same failure mode this plan exists to fix.
   - Suggestion: `{% set s = config_entry_attr('aca4…', 'state') %}{{ now() is not none and (s is none or s.value != 'loaded') }}`, so a missing entry counts as offline.
3. **Z-Wave `for:` resets on sub-state flapping (minor)**: `jammed` ↔ `unresponsive` flipping faster than every 3 min never satisfies `for:`. Low likelihood. Accept.

### Test Coverage Gaps

- The planned test (run each automation from the UI) proves delivery only. It never exercises a trigger. The only real trigger test is disabling the ZHA entry for more than 3 min, which drops every Zigbee device, so that's John's call.

### Strengths

- Every trigger is a controller- or integration-level signal, with no per-device heuristics. Entity ids were verified against the registry and the recorder.
- Modern syntax, one automation per file, short headers, and routed through `script.general_notification` with time-sensitive priority and unique tags.
- The existing `ups_battery_power_activated.yaml` is untouched, and its `"OB"`/`"OL"` bug is flagged separately.

### Devil's Advocate

**If this fails, it will be because...** the outage starts during or before an HA restart (concern 1). That's the scenario most likely to go unnoticed, and it's exactly when these alerts matter.
**The worst outcome would be...** the ZHA entry id changes during the epicurus migration and the Zigbee alert dies silently. Months later the coordinator wedges again with no push, and everyone assumes monitoring exists.

### Verdict

- [ ] Approve
- [x] Approve with suggestions — both folded in (startup re-check after 6 min; missing entry counts as offline)
- [ ] Approve pending pre-mortem
- [ ] Revise
