# 2026-10-17 · Registry orphan cleanup, leak alert, evening vacuum (PR #57)

**What happened.** The entity registry held 563 "no longer provided" entries. Deleting 520 of them (keeping 43 whose integration had no live entities) exposed dead references, and two of those were real bugs:
- The away leak alert watched `binary_sensor.flood_while_away`, which never existed, so it could never fire. `leak_while_home` also went quiet when `house_occupied` was unavailable.
- The evening vacuum read `last_triggered` from a renamed automation, so it ran every night instead of every other night.

**Learnings**
- Orphans squat on entity IDs, so the live entity becomes `<id>_2`. Script callers aren't affected, because actions are named by the YAML key. After the cleanup the `_2` IDs were renamed back.
- Grepping `script.<key>` misses the definition, which is the bare key.
- `expand()` on `platform: group` entities works on HA 2026.7; the older rule is outdated.
- Reviewer finding 1 (blank leak message) was disproved by rendering the template on the host. Verify before fixing.

**Follow-ups**
- Two leak sensors were offline (basement sump pump, storage room): hardware.
- Test hardening: the occupancy and vacuum tests check text, not rendered templates.
