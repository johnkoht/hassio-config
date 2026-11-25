# Working Memory - jk-1166-entertainment-mode-refactor

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
- Dining room speaker is media_player.sonos_living_room (dashboard dining_room.yaml, announcements).

## Active Gotchas
- Basenames must be globally unique (!include_dir_named).
- Crazy Mode tests render the reason template with jinja; reason order matters.

## Shared Utilities Created

## Context Corrections

## Decision Ledger
- [2026-11-25] Crazy Mode and entertainment music are mutually exclusive both ways; Crazy refuses (silent, reason entertainment) while the mode is on - docs affected: packages/house/crazy_mode/README.md, packages/house/entertainment/README.md - status: folded
- [2026-11-25] The family room Sonos is an Amp on in-ceiling speakers, separate from the TV: it always joins indoor music; the mode never groups, calls, turns on or turns off the TV - docs affected: plan.md Decisions, packages/house/entertainment/README.md, packages/house/LEARNINGS.md, memory entry - status: folded
