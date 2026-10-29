# LEARNINGS — packages/announcements/

## Queue

**Never publish a queue snapshot taken before a long-running step.** `append.yaml` and `processor.yaml` both read-modify-write `home/announcement_queue/data`. The processor used to trim `queue[1:]` before `script.announcement_engine` and publish after it, wiping anything appended during playback (Oct 2026: the morning brief lost to a reminder at the same minute). Re-read the live queue after playback and drop the played item by content; position isn't stable because `append.yaml` re-sorts by priority. A millisecond race remains between the re-read and the publish; closing it needs a single writer.

## Room booleans in templates

**A missing entity in `states.x.y` fails silently.** `critical_announcement`'s `auto` branch read `input_boolean.main_bedroom`, which never existed, so the main bedroom was always skipped (Oct 2026). `states.input_boolean.missing.state` renders as undefined, which compares false, with no error. When adding a room, check the boolean against its definition; `tests/test_entity_references.py` can't catch it while it skips for lack of a registry snapshot.
