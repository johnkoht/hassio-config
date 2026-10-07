# 2026-10-07 — school-departure-warning

Voice-only 5-minute heads-up before each kid's departure reminder
(`{nino,gianluca}_departure_warning.yaml`), branch
`feature/school-departure-warning`. Reviewer: APPROVED, first pass.

## Notes

- First `trigger: time` with an `offset:` on a timestamp sensor in the repo.
  It tracks the departure sensor, so lead-minute edits move the warning too.
- `priority: normal` on purpose: `voice_announcement` defaults to `low`, which
  is skipped when music plays in the room and expires after 3 min — useless
  for a heads-up. The sibling departure reminders still default to `low`;
  worth revisiting.
- Distinct sound (`school-bell-chime`) from the departure reminder
  (`school-bell`) so the two are distinguishable.
