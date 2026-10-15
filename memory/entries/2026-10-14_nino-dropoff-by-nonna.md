# 2026-10-14 — nino-dropoff-by-nonna

Nonna drove Nino to school; the drop-off latch never fired. Reviewer: APPROVED,
all findings BACKLOG.

## Notes

- Root cause was two-deep: the zone trigger only listed John/Cristina, and
  Nonna has no GPS tracker at all (person = ping + iPhone-detect only), so
  adding her to the zone trigger would have done nothing. Checked the live
  person store on the Yellow before proposing a fix.
- Fix infers from her departure: person home → not_home inside start −45/+10
  with the latch still off. Validated against the recorder: today's departure
  fell inside the window. Trigger on the person, not the ping tracker — the
  ping tracker flaps every few minutes all night.
- Backlog: an informational "assumed Nonna took Nino — tap if wrong" push
  (a false latch also suppresses the start+30 check push); a Gianluca
  equivalent needs a rule for which kid she took when windows overlap.
