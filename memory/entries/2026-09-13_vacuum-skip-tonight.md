# 2026-09-13 — vacuum-skip-tonight

One-tap skip for the nightly main level vacuum, for when someone is sleeping
in the Jr. Suite (where the dock is) with the door open. Skipped rooms are
deferred to the next empty-house clean rather than lost. Commits `47d6d99`,
`9decabb`, branch `feature/vacuum-skip-tonight`. Ran via /hotfix by John's
choice (feature, not bug — wanted the review + docs + wrap gates without a
plan). Reviewer: APPROVED, first pass; one style note applied.

## What shaped the design

Reading the consumer before the producer. `clean_when_house_is_empty` reads
`group.main_level_vacuum_room_groups` (plain `vacuum_<room>`), not the nightly
`_at_night` group. "Just flip the flag" would have cleaned nothing. The defer
copies booleans across, which only works because both groups carry the same
11 room names 1:1 — now documented in `packages/vacuums/main_level/LEARNINGS.md`.

Defer at the 05:00 close-out, not on toggle: toggle-on-then-off before bed
leaves nothing scheduled, and reset + defer collapse into one automation.
Added an HA-start trigger gated to `[05:00, 22:00)` so a restart that swallows
the time trigger can't latch the flag — same class as the gated-reset lesson
already in project memory.

## Ideas parked

- Skip-until date (`input_datetime`) for multi-night guests — guest mode
  already covers this; the `guest_mode` condition in `nightly_cleaning` is
  commented out and could just be re-enabled.
- Auto-skip from Jr. Suite occupancy / bed sensor — held until it's confirmed
  which bed sensor is physically in that room. `esphome/jr-suite-bed.yaml`
  publishes `binary_sensor.gianluca_bed_occupied`, which drives
  `packages/gianluca_room/`, so either the filename or the placement is stale.

## Local gates

`tests/.venv` is checked in and built on the Yellow (`/homeassistant/...`
interpreter) — dead on a laptop. A scratchpad venv with
`pytest pyyaml ruamel.yaml jinja2` runs `tests/run_tests.py --syntax --modern`
fine. Quick suite: 63 pass, 1 fail (the known Yellow-only registry test).
