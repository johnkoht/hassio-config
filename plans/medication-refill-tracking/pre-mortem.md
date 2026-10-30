# Pre-mortem: Medication Refill Tracking

Run 2026-10-30 against plan.md. No CRITICAL risks. Live read-only checks done on the Yellow.

## Live facts

- `input_boolean.nino_medication_{1,2}_taken` flip off to on once a day each (the dose, from the dashboard, the push, the ZHA button or the script) and off at the 03:00:01 reset. History shows exactly that shape.
- None of the planned entities exist yet (`input_number.nino_medication_stock`, `sensor.nino_medication_days_remaining`, the two shared thresholds): no `_2` suffix risk from orphans.
- `input_number.reload` and `template.reload` both exist as services. **No restart is needed** for new input_number helpers (the plan's task 8 assumed one).
- `input_select.notification_level` is "Important" right now; `general_notification` is parallel and lets `critical` through (emergency-mode PR 2 landed), so the build check in the plan's Alert section is satisfied.

## Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | An unseeded `input_number` (no `initial:`) reads its minimum. With min 0 that is a real-looking "0 doses, out of stock", and the plan's "stays silent until seeded" would be false. The plan left this as a build-time question. | High | Stock helper `min: -1`. The days sensor is `unavailable` for any stock below 0, so unseeded is distinguishable from a seeded 0. Decrement never runs below 1 and refill treats a negative base as 0. Tested. |
| 2 | Shared thresholds unset (no `initial:`) read their minimum; if min were above the real value the alert would fire wrongly, and if 0 the alert is silent forever. | Medium | Min 0 on both, so unset means silent (fail-quiet, never a false alarm). The handoff lists them as required seeds: 7 and 3. |
| 3 | Double or false decrements: restart restore, the 03:00 reset, a repeated `turn_on` on a boolean already on. | Medium | `from: "off"`, `to: "on"` only; `input_number.decrement` is atomic (no read-modify-write race) and guarded by stock above 0. A manual un-toggle then re-toggle double-counts (plan decision 6, accepted; fix by editing stock). |
| 4 | The alert message built from `trigger.*` breaks on the time trigger (the door re-alert bug). | High if repeated | The alert loops a local list of medications and never reads `trigger`. Test renders the message with no trigger at all. |
| 5 | A stale "+30" push tapped twice adds 60 days twice. | Medium | The refill script clears the push (same tag) on every device after a refill, so there is nothing left to re-tap. A stale copy on an offline phone remains possible; accepted, correctable via the stock row. |
| 6 | Editing `morning_update.yaml` with a Jinja error would silence the whole morning brief. | High impact | The new block is plain, defaults every lookup, is rendered in a test with the real file text, and sits as one self-contained block. |
| 7 | A medication alert routed through `critical_announcement` or the emergency path (siren-class). | Would be severe | Uses `script.general_notification` with `priority: critical` only (a phone alert). A test forbids `critical_announcement`, `emergency`, alarmo and `voice_announcement` in the new files. |
| 8 | `numeric_state` crossing semantics on restart or on seeding: seeding a low value may or may not fire the crossing trigger. | Low | The 09:00 daily repeat covers both. At worst one extra push, which replaces by tag. |
| 9 | `!include_dir_named` keys packages by basename: new filenames colliding with existing ones. | Medium | Unique `medication_refill_*` / `nino_medication_*` names; `test_duplicates` runs. |
| 10 | The Nino popup rows cannot be tested offline (no Lovelace tests). | Medium | Reuse the exact row shapes already in that file; resolve includes and entity ids by script; John checks it visually after deploy (`kohbo.yaml` touch). |
| 11 | Morning-brief and push text names health details. | Medium | Only "Nino's medication", already the repo's phrase. No drug name, dose or schedule. |
| 12 | Days sensor floors (13 doses reads 6 days), so 14 doses is the first "7 days". | Low | Matches the plan's rounded-down rule; tested at both edges. |
| 13 | Refill pressed before seeding. | Low | Base is treated as 0, so the first refill of 30 days seeds 60 doses. |

## Verdict

Proceed. Nothing CRITICAL, no structural blocker. Risk 1 (sentinel -1) is the one design change versus the plan text.
