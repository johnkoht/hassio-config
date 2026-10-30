# Review: Medication Refill Tracking

Independent reviewer (sonnet), 2026-10-30, plan + pre-mortem. Verdict ITERATE, no structural blocker, no CRITICAL risk. All findings folded into prd.md.

| # | Tag | Finding | Resolution |
|---|-----|---------|------------|
| 1 | DEFECT | An editable doses row makes John read and type doses, against the "days only" rule | The stock row is not shown. Dashboard shows days left (read-only, "Not set" when unseeded). New `script.medication_stock_set` writes `days x 2` doses, so seeding and drift correction are typed in days. |
| 2 | DEFECT | Refill with days <= 0 (unset helper reads 0) on an unseeded stock would write 0 and fire a critical push | `medication_refilled` and `medication_stock_set` stop when days is not above 0 and write nothing. Tested with 0 and omitted days. |
| 3 | BACKLOG | A restart may re-fire the crossing trigger (sensor goes unavailable to N) | Noted for the live check after restart; the push replaces by tag. |
| 4 | BACKLOG | Alert mode | `mode: queued`. |
| 5 | BACKLOG | `notification_level` None drops the time-sensitive push | Accepted and documented; critical is not dropped. |
| 6 | BACKLOG | Unseeded display | Days row shows "Not set". |
| 7 | BACKLOG | Test gaps | Added: unseeded sensor, decrement guard, edges 6/7 and 2/3, unset critical, push clear, forbidden-strings scan, alert mode. |

Reviewer asked about collision of the +15/+30 action ids: `MEDICATION_REFILLED_NINO_*` are new and unique (grep).
