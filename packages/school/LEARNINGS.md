# LEARNINGS — packages/school/

Non-obvious things discovered building the school layer (Aug 2026). Most apply repo-wide, not just here.

## HA gotchas that cost real time

**`initial:` disables state restoration.** On `input_datetime` / `input_number` / `input_boolean`, setting `initial:` makes HA skip restore and re-apply that value on every restart — silently reverting any dashboard edit. Omit it on anything a human edits; put the real value in a header comment instead.

**An unset helper is not null.** An unset *time* `input_datetime` returns `timestamp: 0`, and an unset *date* one returns **today's date**. So `is not none` and `not in ['unknown','unavailable','none','']` both pass for an unconfigured helper. Test `| int(0) > 0` for times; for dates there is no clean sentinel — validate the range instead. Both variants shipped bugs here.

**`hours: 1` in a `time_pattern` fires once daily at 01:00**, not hourly. Hourly is `hours: /1`. Four sensors in this repo had it wrong for years.

**`homeassistant` start does not fire on reload.** A trigger-based template sensor reloaded mid-day sits at `unknown` until its next tick. Add `- trigger: event / event_type: event_template_reloaded` alongside the start trigger.

**`states.<domain>.<object>.state` raises `UndefinedError` on a missing entity** and kills the *entire* template render — in `morning_update.yaml` that means no briefing at all, silently. Use `is_state()`.

**`calendar.get_events` raises when its target resolves to zero entities**, aborting the whole action sequence. One template block per calendar, plus `continue_on_error: true`, so one bad reference can't take out every closure sensor.

**Entity IDs derive from `alias:`, not `id:`.** `alias: "Nino Pickup Reminder"` → `automation.nino_pickup_reminder`, regardless of the `id`. Cost an afternoon chasing "missing" automations that were registered all along.

**Timestamp sensors must be timezone-aware.** Build as `today_at('00:00') + timedelta(seconds=state_attr(...,'timestamp') | int(0))`. A naive datetime makes `SensorEntity.state` *raise* under `device_class: timestamp` — the entity errors out entirely, it doesn't just fail a trigger. HA does re-render templates using `now()`/`today_at()` on time boundaries, so midnight rollover works.

## Design decisions

**Schools are named by grade band** (`primary` K-2, `intermediate` 3-5, `middle` 6-8), not by building — a kid changing schools is a three-line mapping edit in `kids/<kid>_school.yaml`. Glenbrook South is out of scope: different district, different calendar.

**Gianluca is calendar-driven, not date-driven.** `school_year_active` gates only the D34 bands. His school day comes from a `Gianluca School` event existing on his calendar, because his school's feed doesn't reliably mark breaks — Christmas Eve, all of winter break, and eleven days of Easter Vacation carry no "no school" string. Absence of an event is the authority.

**Closure matching is by overlap, not start date.** Multi-day all-day events are returned once, carrying their original start. `event.start[:10] == day` reads "not closed" for every day of a break but the first.

**Grade-scoped closures need a guard.** The parochial feed publishes `Grade 2 - No School`, `Grade 8 - No School`. Unguarded, those close school for a JK student. Guard rejects other-grade scopes and fails *open* into informational so nothing vanishes silently.

**Overrides must reset unconditionally.** `school_overrides_reset.yaml` has no `conditions:` block on purpose — a gated reset is how the birthday-countdown flags latched on forever.
