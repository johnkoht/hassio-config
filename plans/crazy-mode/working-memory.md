# Working Memory — crazy-mode

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- [setup] Loop leaf lights: kitchen_main_light_switch, kitchen_table_light_switch, kitchen_island_pendants, family_room_main_lights, foyer_ceiling_lights, foyer_chandelier, foyer_coat_closet, stairs_light, stairs_sconces, dining_room_main_lights, living_room_main_lights. All brightness-only (live check 2026-11-17).
- [setup] Engine needs sound_file + sound_length; use /local/sounds/Notification-sound.mp3, length 2.

## Active Gotchas
- [setup] kitchen_lights_to_off ignores the latch; re-assert lights each step.
- [setup] Restored timers can fire finished before automations attach; timer is display only.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-17] Added stop-request helper, separate restore script, AL state captured in the snapshot scene, explicit leaf list instead of a new light group, silent refusal for non-window reasons — docs affected: plan.md (hand-off notes in PR), packages/house/crazy_mode/README.md — status: folded
- [2026-11-17] Reviewer pass 1: abort also cancels the start script; start clears a stale latch record; run exits unless phase is Crazy — docs affected: packages/house/crazy_mode/README.md (no change needed) — status: folded
