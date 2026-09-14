# LEARNINGS — packages/vacuums/main_level/

Non-obvious things about how the main level vacuum package is wired (Sep 2026).

## Gotchas

**Three parallel room-selection groups, and each automation reads exactly one.** `helpers/main_level_vacuum_room_groups.yaml` defines `main_level_vacuum_room_groups` (`vacuum_<room>`), `main_level_vacuum_nightly_cleaning_group` (`vacuum_<room>_at_night`), and `main_level_vacuum_daily_empty_house_cleaning_group` (`vacuum_<room>_when_house_empty`). `clean_when_house_is_empty` reads only the plain group; `nightly_cleaning` reads only `_at_night`. Turning on `main_level_vacuum_clean_when_house_empty` with nothing in the plain group cleans nothing. To defer one schedule into another, copy the booleans across — `skip_tonight_close_out` does this with `map('replace', '_at_night', '')`, which only works because the plain and nightly groups have the same 11 room names 1:1. Keep them in parity when adding a room.

**Room-selection booleans are standing state, not one-shot flags.** `_at_night` and `_when_house_empty` booleans persist across runs; nothing clears them after a clean. Only the plain `vacuum_<room>` set is reset (by `reset_selection_when_complete` on `returning`, and by `cancel_clean_when_house_is_empty`). So a "skip" that reads the nightly group after the vacuum already ran will still see rooms selected — expect a redundant clean, not a lost one.

**The Jr. Suite door already gates every scheduled clean.** `binary_sensor.jr_suite_door_status` must be `on` (open) in `nightly_cleaning`, `evening_cleaning`, and `daily_clean_when_house_empty`, because the dock is in the Jr. Suite. A closed door is an implicit skip; `skip_tonight` covers the door-open case.

**Nightly window is `[22:00, 05:00)`, close-out is `[05:00, 22:00)`.** HA `condition: time` is `after`-inclusive, `before`-exclusive, so a 05:00:00 trigger lands in the close-out window only. Don't move either boundary without moving both.

## Design decisions

**Skip-tonight defers at 05:00, not on toggle.** Toggling on then off before bed leaves nothing scheduled. The close-out automation also triggers on HA start (gated to the daytime window) so a restart that swallows the 05:00 time trigger can't latch the flag and silently skip the *next* night — the same failure class as the gated-reset automations noted in the project memory.
