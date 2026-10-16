# LEARNINGS — packages/people/

- **Commute station zones are private.** Reference them only as `!secret commute_{home,midway,city}_station_zone` and keep file names, ids and aliases generic. Speak the real name at runtime with `trigger.zone.attributes.friendly_name`. `tests/test_commute_regressions.py` enforces this.
- **Don't match a person's state against a zone's friendly name.** That puts the name in the repo. Use `condition: zone` (it takes a list and ORs it). To keep a "held for N minutes" trigger, use `trigger: state` with `to: ~` plus `for:`, then check the zone in the conditions.
- **The turn_on/turn_off chains target alias-derived entity ids**, e.g. `automation.john_arrived_at_home_station`, not the `id`. Renaming an alias breaks the chain, and the test catches it.
