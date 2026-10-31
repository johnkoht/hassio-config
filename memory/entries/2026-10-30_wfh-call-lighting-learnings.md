# WFH call lighting (JK-692)

**What:** On a camera or audio call in the office (`input_select.office` = DnD, John's DnD on), once Adaptive Lighting has warmed or dimmed the ceiling bulbs, pause the office AL switch and set the bulbs to 3000K at 100% (two dashboard-tunable numbers); resume AL 3 minutes after the call ends (cut to 1 minute on 2026-10-30, #127, at John's request; with the 2-minute office DnD debounce that is about 3 minutes in total). Four helper files, three automations in `packages/office/call_lighting/`, dashboard rows, README / ROOMS / LEARNINGS, 48 tests, 12 sabotage rows. Suite 1057 to 1105.

**Metrics:** 5 tasks built sequentially by 5 sonnet developers; plan review ITERATE then APPROVED; final review ITERATE (one vacuous guard test) then fixed. No CRITICAL pre-mortem risk.

**Pre-mortem vs reality:** the real risks were plan premises, not mechanics. The lamp is onoff-only and not in the AL entry, so "ceiling bulbs and lamp" became bulbs only. The plan gated once at call start, which misses the reported case of a call that runs past dusk; a second trigger on the AL kelvin attribute crossing fixed that. The latch worry (our `light.turn_on` tripping `office_lights_manual_change`) was a non-issue on paper (automation parent context, `:al:` ids) but a late Hue report can still latch; the handoff asks for a logbook check after the first real call.

**Learnings:**
- Read the AL entry from `core.config_entries` before assuming which lights it controls: here four bulbs of the room's seven lights.
- AL's `async_turn_on` resets manual control and force-adapts, so an off/on cycle is the whole resume; no light commands needed.
- AL brightness at the 100 default is almost always below the setting, so the "AL moved off daylight" gate is kelvin first, brightness only with a 5-point margin.
- A feature switch with no `initial:` is the deploy safety for new `input_number`s that start at min: nothing fires until the numbers are seeded.
- A plan edit by string replace silently missed (an arrow character); the reviewer caught that the addendum was not in the file. Grep after every scripted edit.
- A guard inside an `if` needs its own test; a structure test that only checks action order leaves `state: "off"` green.

**Follow-ups (backlog):** a short `office_occupied` flap mid-call resumes AL and nothing re-pauses until the next crossing; a mid-call HA restart loses the `for:` backstops; if the late-report latch shows up, ignore bulb brightness reports shortly after the run.
