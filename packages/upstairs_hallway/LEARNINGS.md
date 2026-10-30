# LEARNINGS — packages/upstairs_hallway/

## Manual override latch (JK-1145)

`upstairs_hallway_lighting_automations` is hand-only. A hand change to `light.upstairs_hallway` sets `upstairs_hallway_lights_manually_toggled` (`upstairs_hallway_lights_manual_change`); `upstairs_hallway_lights_reset_manual_toggle` clears it (empty 30 s, room Off, house empty). `upstairs_hallway_not_occupied` no longer re-enables the flag.

On-type, gated by the latch: `upstairs_hallway_lights_motion_on` (it has no mode condition, so the gate sits after the two flags and nothing after it was reordered). Off-type: `upstairs_hallway_lights_to_off` (room Off bypasses the flag; vacancy needs it). The two sleep-mode automations (Adaptive Lighting) never touched the flag and are unchanged.

Behaviour change: before, a vacancy turned the lights off even with the flag disabled; now the vacancy branch obeys the hand flag, as in the other rooms.

## Occupancy-off listeners (checked for JK-1219)

`upstairs_hallway_mode_off` only fires when the house is empty (or at restart with the house empty), and now also turns `upstairs_hallway_occupied` off. Listeners of occupancy going off: `upstairs_hallway_lights_to_off` (already triggered by Off), the reset automation. The upper-floor area sensors only read the state. Low risk, nothing new fires.
