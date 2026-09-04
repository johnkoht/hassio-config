---
title: Pre-Mortem — Kid At-School Detection
slug: kid-at-school-detection
type: pre-mortem
created: 2026-09-03
critical_risks: 3
---

## Pre-Mortem: Kid At-School Detection

**Framing**: it is early December 2026. This shipped in September and it failed. The failure that matters is not a broken sensor — it is **a 13:00 dose of Nino's medication that nobody was reminded about, on a day he was home**. That is the exact outcome this feature is supposed to preserve, and the design as written has several paths to it. Risks are ranked by (likelihood × blast radius), with CRITICAL reserved for paths that end in **silence with no visible signal**.

**Expertise sources**: `packages/school/LEARNINGS.md`, the two prior pre-mortems in `plans/`, and direct reading of `packages/school/`, `packages/people/nino/medication_reminder/`, `packages/general_notifications.yaml`, `packages/announcements/voice_announcement.yaml`, and `dashboards/kohbo/school/`.

---

### Risk 1: The gate defaults to "at school", and the only path back to "home" is a single push nobody has to tap — **CRITICAL**

**Problem**: Task 3 defines `binary_sensor.nino_at_school` as *school day on, `home_today` off, and now inside the bell window*. Note what is **not** in that expression: `dropped_off`. The latch is used only to suppress the ping (Task 4). It contributes nothing to the gate.

So the sensor's semantics are **"assume he is at school unless a human has told us otherwise."** The only mechanisms that can tell us otherwise are (a) John pre-flipping `home_today` on the dashboard, or (b) John tapping *Yes* on one push at start+30.

Now run the sick-day case, which is the case the feature exists for. Nino is home with a fever. Nobody flips the chip in advance. `dropped_off` never latches, so the ping fires at ~08:30. John is on a call, or the phone is face-down, or he swipes the notification away. `wait_for_trigger` times out. `home_today` stays **off**. `binary_sensor.nino_at_school` stays **on** through the whole bell window — and at 13:00 the voice announcement is suppressed on a Sonos in a house where a sick child is sitting on the couch needing his medication.

The plan's Risks section reasons about a *sensor* failing and correctly concludes that failing to `off` is safe. It never reasons about the sensor failing to `on`, which is the failure this architecture produces by default. Worse, the mode of failure is a **non-event** — no error, no log, no push, no visible difference from a normal school day.

**Mitigation**: invert the sensor to require **positive evidence**, and make the un-tapped push fail toward announcing:

1. `binary_sensor.<kid>_at_school` state becomes: school day on **AND** `home_today` off **AND** `<kid>_dropped_off` **on** **AND** now inside the bell window. Absence of evidence is then "not at school" → the announcement plays, which is exactly today's behaviour and therefore strictly safe.
2. Give the Task 4 push **two** actions instead of one: *"He's home"* → `input_boolean.turn_on` on `home_today`; *"He's at school"* → `input_boolean.turn_on` on `dropped_off`. This restores the Nonna-drove-him and bus cases that the latch cannot see, and it does so through the same positive-evidence door.
3. Timeout branch does nothing. No tap → no `dropped_off` → announcement plays.

The cost of this inversion is that a missed GPS latch produces one unnecessary Sonos announcement. The cost of *not* inverting it is a missed dose. Those are not comparable.

**Verification**: with `dropped_off` off, `home_today` off, and school day on, confirm `binary_sensor.nino_at_school` reads `off` at 13:00 and the announcement plays. Then flip `dropped_off` on by hand and confirm it reads `on` and the announcement is suppressed.

---

### Risk 2: `trigger: zone` does not accept `for:` — the plan's central mechanism is config-invalid — **CRITICAL**

**Problem**: Task 2 specifies "Zone trigger on `person.john_koht` and `person.cristina_falbo` entering the school zone, with `for: 3 minutes`." Home Assistant's zone trigger schema is `entity_id` / `zone` / `event` only. There is no `for:` option — `for:` exists on `state`, `numeric_state`, and `template` triggers. A zone trigger with `for:` fails schema validation ("extra keys not allowed") and, depending on where it lands, takes the whole package down.

This is not a detail a build subagent will catch: `grep -rn "trigger: zone" packages/` returns **zero hits**. There is no zone trigger anywhere in this repo and no `condition: zone` either. This is an entirely novel pattern here, specified in prose, and `ha core check` is the only thing that would catch it — after the builder has already written both files against the wrong shape.

**Mitigation**: specify the trigger block literally in the PRD. Use a **template trigger over the zone's `persons` attribute**, which supports `for:` and does not couple to a zone's friendly name (per `LEARNINGS.md`: entity IDs and state strings derive from `alias`/`name`, not `id`):

```yaml
triggers:
  - trigger: template
    value_template: >-
      {%- set z = state_attr('zone.primary_school', 'persons') or [] -%}
      {{ 'person.john_koht' in z or 'person.cristina_falbo' in z }}
    for: "00:03:00"
```

Adding a second circle is then one more `state_attr(...)` union in the same template — which preserves the plan's "zone list so a second circle can be added without touching logic" intent. Do **not** use `person.<x>` state-string comparison against a zone's friendly name.

**Verification**: `ha core check` green, and the automation shows a `last_triggered` after a real school morning. Zero `last_triggered` after a week of school days means the template never fired — check `state_attr('zone.primary_school','persons')` in Developer Tools → Template before assuming GPS is the problem.

---

### Risk 3: The gate condition inverts on `unknown` — the plan's stated safe-failure direction is backwards — **CRITICAL**

**Problem**: the plan's Risks section asserts: *"Dismissal-time sensor unavailable: the at-school sensor falls to off, which means announcements play. Failing loud is the safer direction for medication."* That reasoning is right and the implementation it implies is wrong.

`sensor.primary_school_dismissal_time_today` and `sensor.primary_school_start_time_today` both carry an `availability:` template that is **false on every non-school day and whenever the backing `input_datetime` is unset** (`state_attr(...,'timestamp') | int(0) > 0`). They go `unavailable` routinely, not exceptionally. If the at-school template's own guards let a bad value through, `as_datetime('unavailable')` returns `None`, `now() >= None` raises `TypeError`, and the binary sensor goes **`unavailable`** — not `off`.

Task 5 then says "add `binary_sensor.nino_at_school` is off to the voice-announcement `if:` block." The natural way to write that is:

```yaml
- condition: state
  entity_id: binary_sensor.nino_at_school
  state: "off"
```

`unavailable` is not `off`. The condition returns **false**, the `if:` does not fire, and **the announcement is suppressed** — the exact opposite of the plan's stated intent, produced by the exact failure the plan anticipated. The same applies during the window between HA start and first template render.

**Mitigation**: two parts, both required.

1. Write the gate as a template that treats anything-but-`on` as permission to announce:
   ```yaml
   - condition: template
     value_template: "{{ not is_state('binary_sensor.nino_at_school', 'on') }}"
   ```
   `not is_state(...)` is the repo's existing idiom for exactly this (see `nino_medication_reminder.yaml`'s taken-boolean guards and `CLAUDE.md`'s negation pattern). It is `unknown`-safe and `unavailable`-safe by construction.
2. Do **not** give `binary_sensor.<kid>_at_school` an `availability:` template. An always-available sensor that renders `false` cannot go `unavailable` and cannot invert a `state:` condition later if someone rewrites it. Keep every guard inside the `state:` expression, following `binary_sensor.nino_school_started` in the same file.

**Verification**: set `input_datetime.primary_school_dismissal_time` to unset (or force `school_day_override_off` on), confirm `binary_sensor.nino_at_school` is `off` and not `unavailable`, and confirm the 13:00 announcement still plays.

---

### Risk 4: The ping's `wait_for_trigger` does not survive a reload, and the tap then does nothing — **HIGH**

**Problem**: Task 4 borrows the medication reminder's `context.id` pattern: the action IDs are minted per run (`'YES_' ~ context.id`) and only the live `wait_for_trigger` inside that run is listening for them. That works there because it is a 15-minute wait. Here the window between "push sent at 08:30" and "John finally looks at his phone" is measured in hours.

Anything that kills the run — `ha core restart`, `automation.reload`, a HACS update, a `./deploy.sh --reload` for an unrelated change, a power blip on the Yellow — leaves the notification sitting on John's lock screen with buttons that are now wired to nothing. He taps *Yes*, iOS fires `mobile_app_notification_action` with an action ID no listener recognises, and `home_today` never flips. He believes he has answered. The house believes he never did.

This repo has already paid for this lesson once: it is Risk 2 of `plans/nino-two-dose-medication/pre-mortem.md`, and the fix there (start the timer before the wait) does not transfer, because there is no timer here.

**Mitigation**: do not use `wait_for_trigger` for a question with an open-ended answer window. Split into two automations, following the existing precedent at `packages/security/cameras/camera_notifications/camera_notification_action_handler.yaml`:

- **The ping** (`<kid>_dropoff_check.yaml`) sends the push with **static** action IDs — `NINO_HOME_TODAY`, `NINO_AT_SCHOOL` — and ends. No wait.
- **A standing handler** (`<kid>_dropoff_response.yaml`) triggers on `mobile_app_notification_action` with those literal `event_data.action` values and flips the corresponding boolean. It is always listening, is restart-durable by definition, and is testable by hand.

Static IDs are safe here because there is exactly one outstanding question per kid per day, and the 23:58 reset closes the day.

**Verification**: send the ping, run `ha core restart`, then tap the notification action on the phone. `input_boolean.nino_home_today` must flip.

---

### Risk 5: A latched `dropped_off` silences the announcement forever if the nightly reset is disabled — **HIGH**

**Problem**: once Risk 1's mitigation puts `dropped_off` **inside** the gate, the 23:58 reset stops being hygiene and becomes safety-critical. `school_overrides_reset.yaml`'s own header explains why: *"a gated reset is how the birthday countdown flag latched on forever."*

The reset automation is correct as written, but two things can still strand a latched boolean:

- `LEARNINGS.md` / memory: **removing `initial_state` does not re-enable an automation.** HA restores the last runtime enabled state, and a disabled automation stays disabled with no error — zero saved traces is the only tell. If `automation.school_overrides_reset` is disabled in the registry today (nothing in this repo can see that), the four new booleans will never reset.
- Task 7 reloads "template entities plus automations". If the four new `input_boolean` entities are not reloaded too (see Risk 9), `input_boolean.turn_off` on a nonexistent entity fails and the reset run aborts partway.

Result: `nino_dropped_off` stuck on → `at_school` on every school day inside the window → the 13:00 voice announcement never plays again, indefinitely, with no signal.

**Mitigation**: belt and braces.

1. Before build, confirm `automation.school_overrides_reset` has a recent `last_triggered` (delegate to `homelab` — this cannot be seen from the repo). If it is disabled, re-enable it and note it as a hard gate.
2. Make a failed reset harmless by requiring the latch to be **today's**, not merely on:
   ```jinja
   {%- set latched = states.input_boolean.nino_dropped_off -%}
   {{ is_state('input_boolean.nino_dropped_off', 'on')
      and latched is not none
      and latched.last_changed >= today_at('00:00') }}
   ```
   A stale latch then reads as "not dropped off", and the gate opens — the safe direction per Risk 1.

**Verification**: turn `nino_dropped_off` on, wind the clock past midnight (or leave it a day), and confirm `binary_sensor.nino_at_school` reads `off` the following morning even if the reset did not run.

---

### Risk 6: The two school zones do not exist in this repo and cannot be validated before deploy — **HIGH**

**Problem**: `configuration.yaml` defines exactly one zone — `zone.home`. `zone.primary_school` and `zone.parochial_school` are UI-created and live in `.storage`, invisible to this repo, invisible to `ha core check`, and invisible to any grep the builder can run. Their **entity IDs derive from the name they were created with**, and per `LEARNINGS.md` that mapping has burned this repo before ("cost an afternoon chasing 'missing' automations").

If either ID is wrong — `zone.primary`, `zone.parochial`, `zone.parochial_school_2` — `state_attr()` returns `None`, the template trigger's `or []` fallback keeps it from raising, and the latch simply **never fires**, forever, silently. With Risk 1's mitigation applied, that means the announcement plays every day (benign but the feature does nothing) and John gets a ping every single school morning (loud, and he will turn it off).

**Mitigation**: make the zone IDs a **pre-build gate**. Delegate to the `homelab` agent: enumerate every `zone.*` entity on the Yellow with its `latitude`/`longitude`/`radius`, and paste the exact IDs and radii into the PRD before any file is written. Also confirm `person.john_koht` and `person.cristina_falbo` actually report GPS (a router/BLE-only tracker never enters a remote zone at all).

**Verification**: PRD contains the two literal zone entity IDs copied from a live query, not inferred from the plan text.

---

### Risk 7: The ping shares a mute switch with everything else, and a muted ping means a silenced dose — **HIGH**

**Problem**: Task 4 routes the push through `script.general_notification`, which hard-gates on `input_select.notification_level` (`packages/general_notifications.yaml:205-207`):

```yaml
- condition: template
  value_template: "{{ states.input_select.notification_level.state != 'None' }}"
```

At `None` the script exits silently — no push, no log. `time-sensitive` does pass the `Important` level, and `notifications_activate_important_only` only ever sets `Important`, so `None` is manual-only. But this is now a chain: **notification level muted → no ping → `home_today` never flips → medication voice announcement silenced.** An unrelated toggle in a settings UI now has a medication consequence, which it did not have before this feature.

This is structurally the same finding as Risk 1 of `plans/nino-two-dose-medication/pre-mortem.md`, arriving through a new door.

**Mitigation**: Risk 1's inversion already neutralises most of this — with positive-evidence semantics, a swallowed ping leaves `dropped_off` off and the announcement plays. **That is the primary mitigation and it must be stated as such in the PRD**, so nobody "simplifies" the sensor back to negative evidence later without understanding what it costs.

Secondarily: make the missed-ping condition visible rather than invisible. The Task 6 settings block already shows `home_today` / `dropped_off` / `at_school` per kid — add `last-changed` as `secondary_info` on each (the school dashboard already uses this idiom on the override booleans) so "nothing happened this morning" is legible at a glance.

**Verification**: set `notification_level` to `None`, run a school morning with no latch, confirm the 13:00 announcement still plays.

---

### Risk 8: The `now()` short-circuit can leave the sensor without a minute-tick listener — **MEDIUM**

**Problem**: HA re-renders a template on the minute boundary only if `now()` was actually **evaluated** during the render. Jinja's `and` short-circuits. A gate written in the plan's stated order —

```jinja
{{ is_state('binary_sensor.nino_school_day','on')
   and is_state('input_boolean.nino_home_today','off')
   and is_state('input_boolean.nino_dropped_off','on')
   and start not in ['unknown','unavailable','none','']
   and now() >= as_datetime(start) and now() <= as_datetime(dismissal) }}
```

— never reaches `now()` on any render where an earlier clause is false. On those renders the time listener is not registered, and the sensor then only updates when one of the referenced entities changes. The practical bite: `dropped_off` latches at 07:50, the render short-circuits at the window check... and the sensor sits until the next entity change rather than flipping at the bell.

`binary_sensor.nino_school_started` in the same file has the same latent shape; it survives because `school_day` is true all day when it matters. The new sensor has three booleans ahead of `now()`, so it is materially more exposed.

**Mitigation**: hoist the clock read to the top of the template so it is always evaluated:

```jinja
{%- set n = now() -%}
{%- set start = states('sensor.primary_school_start_time_today') -%}
{%- set end   = states('sensor.primary_school_dismissal_time_today') -%}
{{ ... and start not in ['unknown','unavailable','none','']
       and end   not in ['unknown','unavailable','none','']
       and n >= as_datetime(start) and n <= as_datetime(end) }}
```

**Verification**: on a school day with `dropped_off` on, confirm the sensor flips within a minute of the bell time, not on the next unrelated state change.

---

### Risk 9: The reload set in Task 7 is incomplete — new `input_boolean` helpers are not covered — **MEDIUM**

**Problem**: Task 7 says "reload template entities plus automations (no restart)." The four new helpers are YAML-declared `input_boolean` entities in a new package file. Neither `template.reload` nor `automation.reload` creates them. Until `input_boolean.reload` (or `homeassistant.reload_all`) runs, every reference — the latch automations, the ping, the reset, the dashboard chips — points at entities that do not exist. The automations load fine and then fail at runtime; the dashboard shows "Entity not found".

The memory entry *never restart HA unprompted* is the right instinct here; the fix is a **more complete** reload list, not a restart.

**Mitigation**: PRD deploy step specifies the exact ordered reload set: `input_boolean.reload` → `template.reload` → `automation.reload`. Helpers first, because both the templates and the automations reference them. Confirm each of the four helpers resolves in Developer Tools → States before touching anything else.

**Verification**: build log records all three reload calls and a States query showing the four booleans present.

---

### Risk 10: Only John gets the ping, and Cristina is usually the one who did the drop-off — **MEDIUM**

**Problem**: Task 4 specifies `devices: jk`. Per `general_notifications.yaml` that resolves to `notify.mobile_app_jk_2` alone. But the parochial drop-off is Cristina's (the `parochial_school_departure_time` header calls out "Cristina's 07:45 drop-off"), and she is the person who actually knows whether Gianluca went in. If John is in a meeting at 08:30, the only person who can answer the question does not receive it.

**Mitigation**: use `devices: all` (→ `notify.ios_family`) for the ping. Sending both parents one question a morning that a latch will usually suppress anyway is not notification spam; a question routed to the wrong parent is a dead end.

**Verification**: the ping arrives on both phones on a morning with no latch.

---

### Risk 11: Gianluca's window is anchored to the wrong sensor — **MEDIUM**

**Problem**: Task 2 anchors both kids' latch windows on `sensor.<band>_start_time_today`. For Nino that is right. For Gianluca it is not: `parochial_school_schedule.yaml`'s header states explicitly that **departure is a fixed clock time, not start-minus-lead** — precisely so that editing the start time cannot drift Cristina's 07:45 drop-off. His drop-off is governed by `input_datetime.parochial_school_departure_time`, and the two values are independent by design.

If JK start is 08:15, the plan's start−45 window opens at 07:30 and 07:45 lands inside — today. Nudge the start time to 08:45 in the settings popup (which is exactly what that popup is for) and the window silently slides to 08:00–09:05, and a 07:45 drop-off stops latching. The failure is a config edit two months from now that nobody connects to this feature.

**Mitigation**: anchor Gianluca's window on his departure time, built the same DST-safe way the rest of the package does (`today_at('00:00') + timedelta(seconds=state_attr(...,'timestamp')|int(0))`, per `LEARNINGS.md` — never naive parsing), with a window of departure−15 to departure+45. Guard on `| int(0) > 0` because an unset time `input_datetime` returns `timestamp: 0`, not null.

**Verification**: change `parochial_school_start_time` by an hour and confirm Gianluca's latch window does not move.

---

### Risk 12: Unguarded `as_datetime` on a routinely-`unavailable` sensor raises inside the latch conditions — **MEDIUM**

**Problem**: distinct from Risk 3 (which is about the gate). The Task 2 latch conditions and the Task 4 ping-time computation both read `sensor.<band>_start_time_today`. That sensor is `unavailable` on every non-school day and whenever its backing `input_datetime` is unset. `as_datetime('unavailable')` returns `None`; comparing `now()` to `None` raises, and a raising template **condition** evaluates false while a raising template **action** aborts the remaining sequence (this repo already ate that once — `states.<domain>.<object>.state` killing the whole `morning_update` briefing, per `LEARNINGS.md`).

**Mitigation**: mandate the `not in ['unknown','unavailable','none','']` guard on **every** read of these sensors, in both the latch conditions and the ping, matching the neighbouring sensors in `nino_school.yaml`. Order the conditions global → room → feature per `CLAUDE.md`: school-day boolean first, latch-off second, availability guard third, time window last.

**Verification**: force `input_boolean.school_day_override_off` on and confirm no template errors appear in the HA log from any of the four new automations.

---

### Risk 13: Dose 1 gets a silent behaviour change that the plan describes in one clause — **MEDIUM**

**Problem**: Task 5 gates the voice announcement unconditionally rather than per-dose, and the plan justifies it in a sentence: *"a dose-1 snooze that re-fires after he has left is muted, which is the right outcome."*

Read the consequence concretely. `input_datetime.nino_medication_1_time` currently carries `initial: "07:30:00"`. School start is somewhere around 08:00. Dose 1 is prompted at 07:30 — voice plays. Nobody taps. The snooze timer (started before the wait, per the current file) fires at 07:45 — voice plays. It fires again at 08:00 — and if `at_school` has flipped on by then, **every subsequent re-prompt is push-only for the rest of the day**. On a normal school morning, the escalating voice reminder for a dose that has *not* been given goes quiet exactly when the family is most distracted.

That may still be the right call. But it is a behaviour change to the dose-1 path that Task 5 describes as "leave the conditions ladder, timer, push, and escalation untouched," which reads as though nothing about dose 1 changes.

**Mitigation**: make the decision explicit rather than incidental. Either (a) state in the PRD and in the file's header comment that dose-1 re-prompts intentionally go push-only after the bell, or (b) scope the gate to dose 2 with `{{ dose | string == '2' and not is_state('binary_sensor.nino_at_school','on') }}`. Option (a) is defensible; what is not defensible is a builder discovering the change from a Sonos that stopped talking.

**Verification**: the chosen behaviour is written in `nino_medication_reminder.yaml`'s header comment, and one dose-1 snooze cycle spanning the bell is observed in Logbook.

---

### Risk 14: The chip-clipping risk in the plan is already solved, and the chip template may not accept a toggle — **LOW**

**Problem**: the plan lists chip-row clipping as a risk with "use the wrap layout template rather than the fixed 45 px one" as the mitigation. `dashboards/kohbo/school/school.yaml` **already** uses `page_chip_layout_wrap.yaml`, with a comment explaining why. A builder acting on the plan may "fix" something that is not broken.

The real unknown is different: `dashboards/templates/button_cards/cards/shared/kohbo_chip_card.yaml` defines its own `tap_action`, and there is no existing `template: kohbo_chip_card` in this repo with a toggle tap action. Whether a per-card `tap_action: {action: toggle}` overrides the template's or is merged into it is unverified.

**Mitigation**: leave the wrap layout alone. Prototype one chip's toggle on the school view first; if the template's `tap_action` wins, use `kohbo_chip_button_card` or fall back to the settings-popup entities row (Task 6's second surface) as the sole edit surface — the popup is already the established edit surface for every other school helper.

**Verification**: tapping the "Nino Home" chip flips `input_boolean.nino_home_today` in Developer Tools → States.

---

### Risk 15: `CLAUDE.md` and `deploy.sh` disagree about which host is production — **LOW**

**Problem**: `CLAUDE.md` states Home Assistant runs on **epicurus (10.0.10.85)** and instructs delegating live queries there. `deploy.sh` targets `HA_HOST="${HA_HOST:-hassio}"`, and the `reference_deploy_and_host_topology` memory records production as the **Yellow at 192.168.1.36 (`ssh hassio`)**, with epicurus explicitly not-ready. Risks 5 and 6 above both require a live query. A `homelab` delegation that follows `CLAUDE.md` will read zone entities and automation states off the wrong box and report confidently wrong answers.

The related memory footgun (`deploy.sh --check` deleting `secrets.yaml`) appears to be **fixed** — the current script comments say secrets are human-managed and untouched — but Task 7's "`ha core check` via the fake secrets path" should still be spelled out as an exact command rather than improvised.

**Mitigation**: PRD names `hassio` / 192.168.1.36 explicitly in every live-verification step. Confirm the host's git HEAD matches the merge commit after deploy — `deploy.sh` exiting 0 is not evidence it pulled anything (the diverged-host no-op from the same memory entry).

**Verification**: build log records the host HEAD SHA post-deploy.

---

### Risk 16: `binary_sensor.nonna_presence` is a Bayesian sensor at a 0.97 threshold — **LOW**

**Problem**: Task 4 puts Nonna's presence in the ping message as a hint. That is fine. The risk is drift: `packages/people/nonna/nonna_presence.yaml` is a Bayesian sensor with `probability_threshold: 0.97` over router, NMAP, and iPhone-detect trackers. It is a good *hint* and a poor *fact* — it lags arrivals and can sit off while she is in the house. The plan is right to keep it out of the logic in v1.

**Mitigation**: note in the file header that the Nonna reference is message text only and must not graduate into a condition without re-evaluating the sensor's reliability. Cheap insurance against a future "we already have this signal, let's use it."

**Verification**: `grep nonna` in the built files returns hits only inside `message:`.

---

## Summary

**Total risks identified**: 16
**By severity**: CRITICAL 3 · HIGH 4 · MEDIUM 6 · LOW 3
**Categories**: silent-failure direction, config validity, restart durability, dependency ordering, environment/context gaps, scope drift

**CRITICAL (must address before proceeding)**:

1. **The gate defaults to "at school" and only a tapped push can say otherwise** — an unanswered ping on a sick day silences Nino's 13:00 announcement all day with no signal. Fix: put `dropped_off` **inside** the at-school sensor so it requires positive evidence, and give the push two actions ("He's home" / "He's at school") so no-tap fails toward announcing.
2. **`trigger: zone` does not accept `for:`** — the plan's central mechanism is schema-invalid, and there is no zone trigger anywhere in this repo to pattern-match against. Fix: a `template` trigger over `state_attr('zone.<x>','persons')` with `for: "00:03:00"`, specified literally in the PRD.
3. **The gate condition inverts on `unknown`/`unavailable`** — `condition: state ... state: "off"` suppresses the announcement rather than allowing it, which is the reverse of what the plan's Risks section claims. Fix: `{{ not is_state('binary_sensor.nino_at_school','on') }}`, and give the sensor no `availability:` template.

**HIGH**: the ping's `context.id` + `wait_for_trigger` dies on any reload and the tap silently does nothing (split into a standing handler with static action IDs) · a latched `dropped_off` silences the dose forever if the 23:58 reset is disabled (verify it is enabled; add a `last_changed >= today_at('00:00')` guard) · `zone.primary_school` / `zone.parochial_school` exist only in `.storage` and cannot be validated pre-deploy (make the live zone IDs a pre-build gate) · the ping shares `input_select.notification_level` with everything else, and a muted ping now has a medication consequence (Risk 1's inversion is the mitigation, and must be stated as such).

**MEDIUM**: `now()` short-circuit can drop the minute-tick listener · Task 7's reload set omits `input_boolean.reload` · the ping goes only to John while Cristina does the drop-offs · Gianluca's window is anchored to start time instead of his fixed departure time · unguarded `as_datetime` on routinely-`unavailable` schedule sensors · dose 1 gets an undocumented behaviour change.

**LOW**: the chip-clipping risk is already solved (and `kohbo_chip_card`'s own `tap_action` is the real unknown) · `CLAUDE.md` points live verification at the wrong host · Nonna's Bayesian sensor must stay message-only.

The three CRITICALs share one shape, and it is worth naming: **the plan reasons carefully about the sensor failing and not at all about the sensor succeeding wrongly.** Every guard it specifies protects against a value going missing; none protects against the default assumption ("he's at school") being wrong. For a gate in front of a child's medication reminder, the default must be to speak. Two of the three fixes are one clause each — add `dropped_off` to the state template, and write the gate as `not is_state(...)`.

**Ready to proceed with these mitigations?**
