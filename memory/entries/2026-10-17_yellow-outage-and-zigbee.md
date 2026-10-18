# 2026-10-17 · Yellow outage, sensor_health throttle, Zigbee send failures

## What happened
- **Morning outage.** The watchdog restarted Core 3 times (07:49–08:14), because the event loop was pinned at 100% of one core. The cause was the sensor_health rollups from #48–#50: live templates that walked about 70 devices re-rendered on every referenced state change. #53 rebuilt them as one trigger-based pass every 5 minutes. CPU went from 33% to 7–13%.
- **Router false positive.** A range extender's only primary entity is its LQI sensor, which reads `unknown` until ZHA pushes a value. #54 counts a router offline only when its entity is `unavailable`. #54 also removed the decommissioned Tradfri plugs 3 and 5.
- **Halloween off at restart.** Both Halloween automations had an ungated `homeassistant start` trigger, so the daytime restarts turned the decorations off. In #54 a restart now only re-applies the state that fits the time of day.
- **"Coordinator is disconnected", twice.**
  - 10:28: every send was failing. A ZHA reload fixed it; a UZG power-cycle didn't.
  - 20:07: only a handful of devices failed, the ones that had rejoined (Hue LCT002 bulbs, some plugs). The coordinator was healthy. A per-device Reconfigure fixed each one, and a ZHA reload cleared the rest.

## Learnings
- **Check CPU, not just the recorder.** Before and after merging template-heavy work, compare `sensor.system_monitor_processor_use`. I cleared #48–#50 on recorder grounds alone, and that was wrong.
- **Two tests guard the throttle.** `test_sensor_health_is_throttled` checks that every `time_pattern` is `/5` and that the rollups stay one block. Sabotage tests guard #54's changes.
- **The radio is TI, not Silicon Labs.** It's a CC2652 running Z-Stack 20250321 (`radio_type: znp`, from ZHA diagnostics). An earlier note assumed EFR32/EZSP.
- **"Coordinator is disconnected" can mean one stale device.** Count send failures by destination before choosing a fix.

## Follow-ups
- Christmas `christmas_activated.yaml` has the same ungated startup trigger (JK-1229).
- Hue Spot 12 is still offline. The Elgato light needs a power-cycle.
