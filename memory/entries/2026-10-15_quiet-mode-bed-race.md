# 2026-10-15 — quiet-mode-bed-race

Quiet mode sometimes stayed on after everyone was up. Reviewer: APPROVED,
all findings BACKLOG.

## Notes

- `quiet_mode_turn_off` fired only on `everybody_awake` → on, and also required
  all four raw `*_bed_occupied` sensors off at that instant. The adults'
  `*_in_bed` booleans drop the same second their bed empties, so a bed still
  physically occupied by someone no boolean tracks (a child in a parent's spot)
  failed the condition, and nothing re-triggered. Confirmed in the recorder:
  it only happened when the main bedroom was last up.
- Fix: also trigger on each bed sensor → off and move `everybody_awake` into
  conditions. Pattern: when a condition can lag its trigger, trigger on the
  condition's entities too.
- Any occupied bed keeps quiet mode on, whoever is in it (owner's call).
- Backlog: bed sensors have no `delayed_off`; the sibling `quiet_mode_turn_on`
  still uses root-level `entity_id:` on its action.
