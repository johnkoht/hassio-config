# Backlog — school system

Open items not worth a plan of their own yet. Newest first.

---

## Wire up Early Dismissal (needs a decision)

`input_boolean.early_dismissal_today` is declared in
`packages/school/school_overrides.yaml` and reset nightly at 23:58 by
`automation.school_overrides_reset` — and read by **nothing else**. Repo-wide
grep returns three hits: the declaration, the reset, and the dashboard.

Flipping it currently changes no sensor, no reminder, and no announcement.

It's on the school dashboard labeled `Early Dismissal Today (inactive)`, with
the section description saying so. Deliberately given no status pill — a chip
would advertise an effect that doesn't exist.

**The decision needed:** where does the early dismissal *time* come from?

1. **A per-school `input_datetime`** — `primary_school_early_dismissal_time`,
   `parochial_school_early_dismissal_time`. Most accurate, most helpers to
   maintain, and the parochial band already carries five per-weekday dismissal
   pickers.
2. **A fixed offset off normal dismissal** — one
   `input_number.early_dismissal_offset_minutes` for the house. Cheapest. Real
   early dismissals aren't reliably a fixed offset.
3. **Read it off the calendar** — the Tier-1 `actionable` classifier in the
   `*_calendar_sensors.yaml` files already detects "dismissal" in event
   summaries. Would make the boolean derived rather than manual, but ICS
   summaries rarely carry a parseable time.

Whichever way it goes, `sensor.<band>_school_dismissal_time_today` is the place
to branch — every downstream pickup sensor and reminder derives from it, so
nothing else needs to change.

**Also decide:** if it stays manual, does it belong per-kid rather than
house-wide? The two schools have independent calendars and close independently.

---

## Verify the district band renders

`binary_sensor.district_school_events_today` and the Intermediate / Middle
events card on the school dashboard have never been seen — both bands are off
(no kid in grades 3-8), so the conditional never fires. The band-enabled check
is baked into the sensor rather than the card condition. Worth a smoke test by
temporarily flipping `input_boolean.intermediate_school_enabled` before anyone
actually ages into that band.

---

## Tomorrow card fires every Tuesday

`binary_sensor.school_notable_tomorrow` ORs in
`binary_sensor.primary_school_late_start_tomorrow`, which is true every Tuesday
of the school year (Wednesday late start). Kept deliberately — a late start is
genuinely actionable — but it means the section is weekly furniture rather than
an exception. Drop the late-start term from the rollup if it stops earning its
place.
