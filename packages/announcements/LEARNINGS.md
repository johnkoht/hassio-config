# LEARNINGS — packages/announcements/

## Queue

**Never publish a queue snapshot taken before a long-running step.** `append.yaml` and `processor.yaml` both read-modify-write `home/announcement_queue/data`. The processor used to trim `queue[1:]` before `script.announcement_engine` and publish after it, wiping anything appended during playback (Oct 2026: the morning brief lost to a reminder at the same minute). Re-read the live queue after playback and drop the played item by content; position isn't stable because `append.yaml` re-sorts by priority. A millisecond race remains between the re-read and the publish; closing it needs a single writer.

## Room booleans in templates

**A missing entity in `states.x.y` fails silently.** `critical_announcement`'s `auto` branch read `input_boolean.main_bedroom`, which never existed, so the main bedroom was always skipped (Oct 2026). `states.input_boolean.missing.state` renders as undefined, which compares false, with no error. When adding a room, check the boolean against its definition; `tests/test_entity_references.py` can't catch it while it skips for lack of a registry snapshot.

## Emergency mode (JK-1149)

**Critical skips the queue, so nothing in the processor can hold it.** `critical_announcement` starts the engine with `script.turn_on`; the engine's first step drops non-critical runs while `binary_sensor.emergency_active` is on. `fields:` defaults don't apply at runtime, so an omitted `priority` is undefined: the gate uses `priority | default('normal')` and the test renders with `StrictUndefined`.

**"Held" isn't airtight.** The processor checks the emergency before it calls the engine, but the engine is `mode: queued`. If an emergency starts while the item waits for the engine, the engine drops it and the processor still removes it from the queue. The window is the engine's wait; the item is ordinary chatter.

**`auto` can resolve to no speakers.** A leak alert with no announceable room occupied renders `[]` and nobody hears it. It was already true through the queue; falling back to `all` is a backlog candidate.

**Leak notifier waits on the script.** `leak_voice_announcement` is a REST call to `script/critical_announcement` with a 10 s timeout, which is why the engine is started with `script.turn_on` and not a blocking call.
