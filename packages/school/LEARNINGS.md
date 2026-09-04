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

**`trigger: zone` does not accept `for:`.** The zone trigger schema is `entity_id` / `zone` / `event` only. For "in the zone for N minutes", use a `template` trigger over `state_attr('zone.x', 'persons') or []` with `for:`; the `or []` matters because `persons` is `None` when the zone is empty and `in None` raises. Keep `now()` out of that template or it re-evaluates every minute and defeats the hold.

**`condition: state` with `state: "off"` is false on `unavailable`.** A gate written that way silences whatever it guards the moment its sensor goes unavailable. When the guarded action is the thing that must happen (a medication cue), write the gate as `{{ not is_state('binary_sensor.x', 'on') }}` and give the sensor no `availability:` block.

**`tests/run_tests.py --quick` has one Yellow-only test.** `tests/conftest.py` hardcodes `CONFIG_ROOT = /root/config`, so `test_pinned_entity_ids_exist_in_registry` always fails on a laptop. `--syntax --modern` is the honest local gate.

## Design decisions

**"At school" is positive evidence, and the default is announce.** `binary_sensor.<kid>_at_school` is on only when the kid's drop-off latched today (zone or a tapped push) inside the bell window with `home_today` off. Every derivation failure reads `off`, which lets the medication voice cue play. A default-on design had six silent paths to a muted sick-day dose.

**Schools are named by grade band** (`primary` K-2, `intermediate` 3-5, `middle` 6-8), not by building — a kid changing schools is a three-line mapping edit in `kids/<kid>_school.yaml`. The high school is out of scope: different district, different calendar.

**Gianluca is calendar-driven, not date-driven.** `school_year_active` gates only the D34 bands. His school day comes from a `Gianluca School` event existing on his calendar, because his school's feed doesn't reliably mark breaks — Christmas Eve, all of winter break, and eleven days of Easter Vacation carry no "no school" string. Absence of an event is the authority.

**Closure matching is by overlap, not start date.** Multi-day all-day events are returned once, carrying their original start. `event.start[:10] == day` reads "not closed" for every day of a break but the first.

**Grade-scoped closures need a guard.** The parochial feed publishes `Grade 2 - No School`, `Grade 8 - No School`. Unguarded, those close school for a JK student. Guard rejects other-grade scopes and fails *open* into informational so nothing vanishes silently.

**Overrides must reset unconditionally.** `school_overrides_reset.yaml` has no `conditions:` block on purpose — a gated reset is how the birthday-countdown flags latched on forever.
