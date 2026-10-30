# PRD: Medication Refill Tracking (Nino, v1)

Plan: plan.md. Pre-mortem: pre-mortem.md. Review: review.md.

## Goal

Track how many doses of Nino's medication are left. John types the count into the dashboard, each confirmed dose subtracts one, and a time-sensitive push (under 7 days), a critical phone push (under 3 days), and a line in the morning announcement say when to refill. A Refill action adds 15 or 30 days from the push, or any number of days from the dashboard.

Design rules (from the plan, plus the pre-mortem): stock stored in doses, everything a person reads or types in days (days = doses / 2, `doses_per_day = 2` constant); no `initial:` on any editable helper; stock `min: -1` means "not set yet" (days sensor `unavailable`, alert silent); medication alerts are phone pushes through `script.general_notification` only, never `critical_announcement`, the emergency path, alarmo, or Noonlight; generic wording ("Nino's medication"), no new health details.

## Tasks

### task-1: Stock helpers and days-remaining sensor
Files: `packages/people/nino/medication_refill/nino_medication_stock.yaml`, `packages/reminders/medication_refill/medication_refill_thresholds.yaml`.
- `input_number.nino_medication_stock`: unit doses, min -1, max 365, step 1, box, no `initial:`.
- `input_number.nino_medication_refill_days`: min 0, max 90, step 1, box, unit days, no `initial:`.
- `input_number.medication_refill_threshold_days` and `input_number.medication_refill_critical_days`: min 0, max 60 / 30, no `initial:`.
- Dashboard never shows the raw doses: the stock row is not displayed (review finding 1).
- `sensor.nino_medication_days_remaining`: floor(stock / 2); `unavailable` when stock is unavailable, unknown or below 0; unit days; never 0 because of a bad read.
AC: files parse; no `initial:`; stock 14 renders 7, 60 renders 30, 13 renders 6, 0 renders 0, -1 and `unavailable` render `unavailable`.

### task-2: Decrement automations
Files: `packages/people/nino/medication_refill/nino_medication_1_stock_decrement.yaml`, `..._2_...`.
- State trigger on the matching taken boolean, `from: "off"`, `to: "on"` only; condition stock above 0; action `input_number.decrement` on `input_number.nino_medication_stock`.
AC: no `to: "off"` trigger; each targets the shared Nino stock; a stock of 0 or -1 is not touched; ids equal filenames.

### task-3: Refill script and push action
Files: `packages/reminders/medication_refill/medication_refilled.yaml`, `packages/reminders/medication_refill/medication_refill_push_action.yaml`.
- `script.medication_stock_set` (fields `medication`, `days`; `days` omitted reads the refill-days helper): sets stock to `days * 2` doses (capped at max). Stops without writing when days is not above 0. This is how John seeds and corrects the count, in days.
- `script.medication_refilled` (fields `medication`, `days`; `days` omitted means read that medication's refill-days helper); adds `days * 2` doses to `max(stock, 0)`, capped at the helper max; ignores unknown medications; stops without writing when days is not above 0 (unset helper reads 0); then clears the push by tag.
- `medication_refill_push_action`: event triggers for `MEDICATION_REFILLED_NINO_15` and `_30`, calls the script with 15 or 30.
AC: days 0 or omitted-with-helper-0 writes nothing, even on an unseeded (-1) stock; stock_set 30 days writes 60 doses; 15 gives 30 doses, 30 gives 60, cap respected, unseeded base treated as 0, only the two ids match.

### task-4: Low-stock alert
File: `packages/reminders/medication_refill/medication_refill_low_stock_alert.yaml`.
- `mode: queued`. Triggers: numeric_state below the 7-day helper, below the 3-day helper, daily 09:00. Loops a local medication list; never reads `trigger`.
- For each medication with days < threshold (threshold above 0): `script.general_notification`, `devices: "all"`, `time-sensitive`, `critical` when days < critical (critical above 0), tag `medication-refill-nino`, actions "+15 days" and "+30 days".
AC: 7+ days sends nothing; 6 time-sensitive; 2 critical; `unavailable` and unset thresholds send nothing; renders with no trigger object; no `critical_announcement`, `voice_announcement`, emergency, alarmo or Noonlight reference.

### task-5: Dashboard rows and morning brief
Files: `dashboards/templates/button_cards/people/nino.yaml`, `dashboards/SITEMAP.md`, `packages/reminders/morning_update.yaml`.
- "Medication Supply" block under "Medication Reminder Time": days left (read-only, "Not set" when the sensor is unavailable), days-to-enter row (refill-days helper), "Add days to supply" row (tap calls `script.medication_refilled`, `medication: nino`), "Set days left" row (tap calls `script.medication_stock_set`). No doses shown. Thresholds editable in a small Refill Alerts block.
- `### MEDICATION REFILLS` block: names Nino's medication only when days < threshold; otherwise says nothing; `unavailable` never named.
AC: every `!include` path resolves; entities exist; block renders for low, not-low and unavailable; morning prompt still parses as Jinja.

### task-6: Tests
File: `tests/test_medication_refill.py`.
AC: covers every task's ACs; unseeded sensor, decrement guard, edges 6/7 and 2/3, unset critical gives time-sensitive only, push clear via `script.clear_notifications` (all devices, same tag), forbidden-strings scan over every new file, alert mode queued; sabotage checks (drop `from: "off"`, drop the stock-above-0 guard, swap critical for time-sensitive, drop the sentinel) each turn a test red; full suite green.

### task-7: Docs
Files: `docs/PEOPLE.md`, `docs/AUTOMATIONS.md`, `packages/people/LEARNINGS.md`, `dashboards/LEARNINGS.md`.
AC: entities, flows and the seed steps documented; no new health details.
