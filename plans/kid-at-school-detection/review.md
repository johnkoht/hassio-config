---
title: Review — Kid At-School Detection
slug: kid-at-school-detection
type: plan-review
reviewed: 2026-09-03
verdict: revise
---

## Review: Kid At-School Detection

**Type**: Plan
**Review Path**: Full
**Complexity**: Medium-Large (7 tasks, ~11 new entities, 6 new files, 2 dashboard surfaces, 1 edit to a medication automation)
**Recommended Track**: `full` — pre-mortem required before approval, on stakes rather than size

**Expertise profiles loaded**: none found (`find . -name PROFILE.md` → empty).
**LEARNINGS.md scanned**: `packages/school/LEARNINGS.md` (read in full — see Concern 12).
**Config read**: the whole of `packages/school/`, `packages/people/nino/medication_reminder/` (both files), `packages/general_notifications.yaml`, `packages/announcements/voice_announcement.yaml`, `packages/people/nonna/nonna_presence.yaml`, `dashboards/kohbo/school/school.yaml`, `dashboards/kohbo/school/components/school_settings_popup.yaml`, `dashboards/templates/button_cards/people/nino.yaml`, `configuration.yaml`.

---

## Verification of the plan's technical claims

| Claim | Verdict | Evidence |
|---|---|---|
| `binary_sensor.<kid>_school_started` "never turns off before the nightly rollover" | ✅ Correct | `kids/nino_school.yaml` — `state: {{ school_day and now() >= start }}`. Monotonic within the day. Bounding on dismissal instead is right. |
| `primary_school_start_time_today` already swaps to the late-start input on Wednesdays | ✅ Correct | `schools/primary_school_schedule.yaml`, both `availability:` and `state:` select `late_start_time` when `late_start_today` is on. |
| Nothing in automations checks literal `not_home` on John/Cristina | ✅ Correct | Confirmed across `packages/`, `automation/`, `dashboards/`. |
| `zone.primary_school` is 122 m; `zone.parochial_school` exists | ⚠️ **Unverifiable here, and no task creates them** | `configuration.yaml:63` defines exactly one zone (`Home`). Every other zone in use (`zone.john_s_work`, `zone.union_station`, …) lives in `.storage`, which is not in this repo. See Concern 3. |
| Dose 1 is at 07:30, so the gate can't touch it | ⚠️ **Assumption, not a property** | `input_datetime.nino_medication_1_time` is user-editable from `dashboards/templates/button_cards/people/nino.yaml:126`. `input_datetime.primary_school_start_time` is user-editable from `school_settings_popup.yaml`. Nothing couples them. See Concern 4. |
| "the school view chip row is a fixed-height horizontal stack" (Risks) | ❌ **Stale** | `dashboards/kohbo/school/school.yaml:43-46` already uses `page_chip_layout_wrap.yaml`, with a comment saying exactly why. The risk was fixed before this plan was written. |
| "Dismissal-time sensor unavailable → sensor falls to off → announcements play … failing loud is the safer direction" | ❌ **Wrong, and it is the plan's only stated failure-direction analysis** | See Concern 1. The dominant failure direction of this design is silence, not noise. |

---

## Concerns

### 1. BLOCKER — An `unavailable` at-school sensor silences the announcement; the plan believes the opposite

Task 5 says to add "`binary_sensor.nino_at_school` is off" to the voice `if:` block. Written the obvious way that is:

```yaml
- condition: state
  entity_id: binary_sensor.nino_at_school
  state: "off"
```

A `condition: state` with `state: "off"` is **false** when the entity is `unavailable` or `unknown`. So any state other than a clean `off` suppresses the announcement. The plan's Risks section asserts the reverse:

> **Dismissal-time sensor unavailable**: the at-school sensor falls to off, which means announcements play. Failing loud is the safer direction for medication.

That is only true if the at-school sensor never itself goes unavailable — and Task 3 pushes the builder straight at the trap. It says to put the sensor in `kids/nino_school.yaml` and use "the same `not in ['unknown', ...]` guards as the neighbouring sensors." The neighbouring **sensors** in that file do not guard inline; they use an `availability:` block that is deliberately false on non-school days:

```yaml
availability: >-
  {{ states('sensor.primary_school_dismissal_time_today') not in ['unknown', 'unavailable', 'none', '']
     and is_state('binary_sensor.nino_school_day', 'on') }}
```

A builder copying the file's dominant idiom gives `binary_sensor.nino_at_school` an `availability:` block that is false on weekends and holidays → the sensor is `unavailable` → `state: "off"` is false → **the voice announcement is suppressed on exactly the days the entire feature exists to preserve.** The feature would ship inverted and nothing would error.

- **Fix, two parts, both required in the plan text**:
  1. Task 3 gets an explicit contract: *`binary_sensor.<kid>_at_school` has no `availability:` block and is always `on` or `off`; all unknown/unavailable inputs resolve to `off` inside the state template.* The neighbouring **binary_sensors** (`nino_school_started`) already do it this way — cite that one, not the timestamp sensors.
  2. Task 5 gates negatively, so an unexpected state still announces:
     ```yaml
     - condition: template
       value_template: "{{ not is_state('binary_sensor.nino_at_school', 'on') }}"
     ```
- Add an AC: with the template entity removed/renamed, the 13:00 announcement still plays.

### 2. BLOCKER — Every input failure fails toward silence, on a medication reminder

`home_today` defaults **off**. `school_day` is derived from a calendar feed. So on any day the feed says "in session," `at_school` is **on** unless a human or a GPS latch intervened. Walking the failure table:

| Failure | Direction | Observable? |
|---|---|---|
| Calendar feed wrong / grade-scoped closure guard "fails open into informational" (LEARNINGS) → `school_day` on when it isn't | **silenced while home** | no |
| Nobody taps the chip, ping missed, phone asleep, `wait_for_trigger` already timed out | **silenced while home** | no |
| False latch (Concern 5) suppresses the ping entirely | **silenced while home** | no |
| Ping's time trigger skipped by a reload (`nino_departure_reminder.yaml` header documents this) | **silenced while home** | no |
| At-school sensor errors → `unavailable` | **silenced** (Concern 1) | no |
| Start/dismissal sensor unavailable, sensor correctly resolves `off` | announces | yes |

Six of seven paths silence a medication cue, none of them log anything, and the plan's Risks section characterises the design using only the seventh. This is the same shape of finding as Concern 2 in the `nino-two-dose-medication` review — a chain of low-probability, zero-observability failures converging on one high-stakes outcome — and this plan adds three new derived layers to that chain.

The two honest resolutions:

- **(a) Invert the polarity.** Gate on *evidence he left*, not *absence of evidence he stayed*: `at_school` requires `dropped_off` on (or an explicit "he's at school" toggle). Then every failure mode above resolves to "the announcement plays," which is the loud, safe direction. The cost is that a genuinely-at-school day with a missed latch produces a pointless announcement — which is the status quo, i.e. no regression.
- **(b) Shrink the surface** so there is only one input to fail: cut the latch, the ping, and the window (Concern 6), leaving `school_day AND NOT home_today`. One hand toggle, one derived sensor, no GPS.

I recommend (b) for v1 and (a) if the window/latch survive. What the plan must not do is ship the current polarity while telling the reader it fails loud.

### 3. MAJOR — Neither school zone exists in this repo, and no task creates one

`configuration.yaml:63` defines a single YAML zone:

```yaml
zone:
  - name: Home
    latitude: !secret home_latitude
```

Every other zone the repo references (`zone.john_s_work`, `zone.union_station`, `zone.cristina_s_work`, `zone.north_shore_k9`) is UI-created and lives in `.storage`, invisible from here. `zone.primary_school` and `zone.parochial_school` appear nowhere in `packages/`, `dashboards/`, `automation/`, or `configuration.yaml`. The plan states their radii as fact but has no task to create them and no verification step that they resolve.

This matters because it fails silently in both directions: a `trigger: zone` referencing a nonexistent zone passes `ha core check` (entity-id *format* is validated, not existence) and simply never fires — which per Concern 2 lands on "silenced while home."

Also worth deciding deliberately: these would be the first *school* zones. Zone entry on `person.john_koht` will now render "Primary School" as his person state on the people cards and in every arrival/departure automation's `from`/`to` view. The plan checked that nothing tests literal `not_home` (good) — but it did not check `packages/people/john/` arrival/departure automations for `to: home` / `from: home` transitions that a new intermediate zone could reorder.

- **Fix**: add an explicit task — create both zones (YAML in `configuration.yaml` alongside Home with `!secret` lat/lon, matching how Home is done, since this repo is public), and add "person state renders correctly and no arrival/departure automation misfires" to verification.

### 4. MAJOR — Dose 1's safety rests on an unguarded coupling between two independently-editable helpers

The plan's central justification for not special-casing dose 2:

> The sensor is only on during school hours, so dose 1 at 07:30 is unaffected.

Both sides of that inequality are user-editable, from two different dashboards, with no relationship between them:

- `input_datetime.nino_medication_1_time` — edited at `dashboards/templates/button_cards/people/nino.yaml:126` ("First dose at").
- `input_datetime.primary_school_start_time` — edited in `school_settings_popup.yaml`.

Set dose 1 to 08:15, or move Nino up a band (`intermediate_school_start_time` is a different value entirely, and the LEARNINGS design decision explicitly anticipates band changes), and dose 1's voice announcement silently disappears forever. Nothing logs it. Nothing on any dashboard shows that the announcement is being gated.

The plan is reasoning about *today's* configured values as if they were invariants. "Dose 1 is at 07:30" is a fact about `.storage`, not about the config.

Two aggravating details:
- `nino_medication_reminder.yaml` sets `initial: "07:30:00"` on both dose times. Per `packages/school/LEARNINGS.md`, `initial:` **disables state restoration** — so a restart silently reverts whatever John set. That's a pre-existing bug, but it means the live value and the file value can disagree and the plan has read neither.
- The gate applies to dose 1's *snooze re-fires* too. The plan calls that "the right outcome," and on the morning side it is conservative — the kid departs at `start − lead`, so he is already gone by `start`. Fine. But it should be stated as a deliberate choice with the boundary named, not asserted.

- **Fix**: either special-case the gate to dose 2 (`{{ dose | string == '2' }}` and-ed into the voice condition — the automation already has `dose` in `variables:`), or add an explicit AC: *with dose 1 set to a time inside school hours, the plan's chosen behaviour is X*, and surface the gate state somewhere visible.

### 5. MAJOR — The drop-off latch's false-positive silences the exact case it exists to detect

`nino_dropped_off` latches when John **or** Cristina sits in `zone.primary_school` for 3 minutes between start−45 and start+20. That window is 65 minutes wide on a weekday morning. Any reason to be near Nino's school in that window latches it: dropping the other kid at a school on the same street, a parked car waiting for someone, a coffee stop inside a 122 m circle, GPS drift from an adjacent road.

The consequence chain is:

> false latch → ping suppressed → `home_today` stays off → `at_school` on → the 13:00 announcement is silenced for a kid who is home sick

That is the precise outcome the feature was built to prevent, produced by the machinery built to prevent it. And it is silent.

The reverse is just as bad in the other direction: if Nino ever walks, bikes, buses, or gets a ride from Nonna, the latch never fires and **the ping arrives at start+30 every single school day**, asking a question whose answer is "no" 179 days out of 180. That is textbook alert fatigue on a notification whose Yes button silences a medication cue.

The plan does not say how Nino gets to school. `nino_departure_lead_minutes` + a departure reminder implies driving, but "implies" is not a design input.

- **Fix**: cut the latch from v1 (Concern 6), or add a `dropped_off` reset when the parent *leaves* the zone and a same-day sanity check. At minimum, the plan must state the transport assumption and what happens when it's violated.

### 6. MAJOR — For the only consumer, `at_school` is exactly `school_day AND NOT home_today`; the rest is dead weight

Reduce the sensor at the one moment it is ever read, 13:00:

```
at_school = school_day AND NOT home_today AND (start <= now <= dismissal)
```

Both bell schedules put 13:00 strictly between start and dismissal on every in-session day — `primary_school_dismissal_time` is a single configured value (~15:00), and the parochial per-weekday dismissals are all afternoon. So the third clause is **constant true** at 13:00. `at_school` ≡ `school_day AND NOT home_today`.

Which means, for v1:
- the **time window** contributes nothing (it would only matter for a genuine early-dismissal day — and `input_datetime.primary_school_dismissal_time` is a static setting nobody edits per-day, so the window can't see one anyway);
- the **latch** contributes nothing except suppressing the ping;
- the **ping** contributes nothing except setting `home_today`;
- `home_today` is the whole feature.

So the plan is 7 tasks, ~11 entities, 6 files, a GPS geofence, an actionable notification, and two dashboard surfaces — to deliver one boolean and one condition.

**The v1 I would ship instead** (2 files, ~15 lines, one hour):

1. `input_boolean.nino_home_today` in `packages/school/school_overrides.yaml`, added to the 23:58 unconditional reset.
2. Gate the voice block:
   ```yaml
   - condition: template
     value_template: >-
       {{ not (is_state('binary_sensor.nino_school_day', 'on')
               and is_state('input_boolean.nino_home_today', 'off')) }}
   ```
   (or the same expression as `binary_sensor.nino_at_school` if the named abstraction is wanted — that part is cheap and I'd keep it.)
3. One row in the existing **Overrides** section of `school.yaml`, next to "No School Today."

That solves the stated problem completely and leaves the failure surface at one toggle a human owns. Tasks 2, 4, and the whole of Gianluca become a follow-on plan if and when a second consumer appears.

**The extra sensor is justified** — a named `binary_sensor.<kid>_at_school` is a better contract than an inline template in a medication automation, it's greppable, and it renders on a card. That part of the abstraction is right. It's the *derivation chain behind it* that isn't earning its keep.

### 7. MAJOR — Gianluca's half is unused surface, and this repo has already written down why that's bad

Gianluca has no medication reminder and nothing else reads `binary_sensor.gianluca_at_school`. The plan's justification — "so a future use has them ready" — is exactly the pattern `dashboards/kohbo/school/school.yaml:96-99` calls out by name:

```yaml
# No early-dismissal chip: input_boolean.early_dismissal_today is
# read by nothing in the package, so a chip would advertise an
# effect that doesn't exist.
```

and again at line 305:

```yaml
name: "No School Today cancels every kid's schedule for today. Early Dismissal is not
       wired up yet — nothing in the school package reads it."
```

`input_boolean.early_dismissal_today` has been sitting unread since the school package shipped. The plan proposes to add **four** more entities in that category, plus a "Gianluca Home" chip on the dashboard — i.e. a control that advertises an effect that doesn't exist, on the same view that documents why not to do that.

The user asked for it, so this is a flag rather than a veto. But the cost is not symmetric: an unread `at_school` sensor is inert, whereas a **tappable "Gianluca Home" chip** is a promise. Someone taps it on a sick day, nothing happens, and the next time they need it they don't trust the Nino one either.

- **Recommendation**: build Gianluca's `input_boolean.gianluca_home_today` and `binary_sensor.gianluca_at_school` if John wants the symmetry (inert, harmless, three lines), but **no Gianluca dashboard chip and no Gianluca latch/ping automations** until something reads them. If a chip does ship, follow the existing convention and label it the way `early_dismissal_today` is labelled: "(inactive)".

### 8. MAJOR — `wait_for_trigger` + `context.id` is the wrong pattern for a once-a-day confirmation

Task 4 borrows the `context.id` action-ID pattern from `nino_medication_reminder.yaml`:

```yaml
- variables:
    action_taken: "{{ 'TAKEN_' ~ context.id }}"
```

That pattern is correct **there** because the ID must be unique per run (a dose can be prompted many times a day, and stale buttons must not resolve a newer prompt), and because the medication automation has three independent backstops if the wait dies: a `restore: true` timer, a template trigger on the taken boolean, and `nino_medication_escalation.yaml` polling every 15 minutes.

The drop-off ping has none of that. It fires **once per kid per day**, and the wait is the only handler:

- Reload automations, restart HA, or `ha core check` a config change during the wait → the run dies, the notification stays on the lock screen, John taps "Yes," and **nothing happens**. No log, no error, no second chance until tomorrow.
- The plan says "with a timeout" and doesn't say how long. Tap after the timeout → same silent no-op.
- The automation is presumably `mode: single`; a stale run blocks nothing here, but there's no re-arm either.

The repo already has the right pattern for this shape: `packages/security/cameras/camera_notifications/camera_notification_action_handler.yaml` — a separate, always-listening automation on `mobile_app_notification_action` with **stable, decodable action IDs**. Uniqueness isn't needed when there's one prompt per day.

- **Fix**: split Task 4 into (a) the ping automation, which just sends `NINO_HOME_TODAY_YES` and exits, and (b) a handler automation triggered on `mobile_app_notification_action` that flips `home_today`. Reload-durable, testable in isolation, and it makes the button work whenever it's tapped.

Second problem with the same task: **there is only a Yes button.** The prompt asks "is the kid home?" and offers one affordance, which happens to be the one that requires action. Not answering means "at school," which is Concern 2's default. If the ping is kept, it needs both buttons — and the *No* button should be the one that latches (`dropped_off` on), so a deliberate answer is recorded either way.

### 9. MAJOR — The ping goes only to John, but Cristina does the drop-off the plan can't see

Task 4 specifies `devices: jk`. From `packages/school/schools/parochial_school_schedule.yaml`:

> Departure is a fixed clock time, not start-minus-lead-minutes — a runtime-edited start time must not drift **Cristina's 07:45 drop-off**.

Cristina drives Gianluca. `general_notification` supports `devices: "all"` (→ `notify.ios_family`), which is what every other school reminder in the package uses (`nino_departure_reminder.yaml`, `nino_pickup_reminder.yaml`, both `devices: "all"`). Asking only John whether a kid is home, when Cristina is the one who knows, is a design error, not a preference.

- **Fix**: `devices: "all"`, matching the rest of the package.

### 10. MAJOR — Gating the *voice action* leaves the pointless part of the 13:00 reminder running

The plan explicitly leaves push and escalation untouched. Trace a normal school day with the plan shipped:

- 13:00 — voice suppressed ✅. Push fires to all devices, `time-sensitive`. Snooze timer starts.
- 13:15 — `timer.finished` re-triggers the automation. Voice suppressed. **Push again.**
- 13:30, 13:45, 14:00 … the loop is unbounded; the only exit is `nino_medication_2_taken` going on.
- 15:00 — `nino_medication_escalation.yaml` sends a **critical iOS push**, deliberately routed around `input_select.notification_level` so it cannot be muted.

If the school nurse administers dose 2 and nobody at home marks it taken, that sequence runs **every school day**. The plan makes it slightly worse, not better: the Sonos announcement was the cue that prompted someone to open the app and mark it taken. Silencing it removes the feedback loop while leaving the buzzing.

This suggests the gate may be at the wrong layer entirely. If Nino takes dose 2 at school, the question isn't "should we announce?" but "should this dose be tracked at home at all on a school day?" — which points at a `conditions:` entry on the automation plus an auto-mark, not an `if:` around one action.

- **Fix**: this is a product question for John and the plan should ask it explicitly rather than assume. Minimum: state what is expected to happen to the push loop and the 15:00 critical escalation on a school day, and add it to verification.

### 11. MINOR — File placement and naming break three of the school package's own conventions

- **Automations in `kids/`.** Every automation in `packages/school/` lives in `reminders/`. `kids/` currently holds only template/helper definitions (`nino_school.yaml`, `gianluca_school.yaml`). Task 2 and Task 4 put four automations in `kids/`.
- **A shared two-kid helper file.** `kids/kid_presence_helpers.yaml` holds both kids' booleans, while every other file in `kids/` is per-kid. This directly erodes the LEARNINGS design decision: *"a kid changing schools is a three-line mapping edit in `kids/<kid>_school.yaml`."* After this plan, moving Nino up a band means editing `kids/nino_school.yaml` **and** `nino_dropped_off.yaml` **and** `nino_dropoff_check.yaml` (both hardcode `sensor.primary_school_start_time_today` and a zone) — five files, three of them not named for the band.
- **Manual booleans outside `school_overrides.yaml`.** That file's header reads *"The only two manual controls in the otherwise fully-derived school system."* This plan doubles the manual surface and puts the new controls somewhere else, leaving the header wrong and the controls scattered.

- **Fix**: `home_today` into `school_overrides.yaml` (and its header updated); any automations into `reminders/`; band-specific references confined to `kids/<kid>_school.yaml` by deriving the ping/latch off the already-per-kid `sensor.<kid>_departure_time` rather than the band's start sensor.

### 12. MINOR — Dashboard placement fights the established convention

- **The chip row is read-only.** All three existing chips in `school.yaml` set `tap_action: action: none`. A toggle chip would be the first tappable one, in a row otherwise reserved for status.
- **There is already a home for this.** `school.yaml:296-320` has an "Overrides" section with a section title, an explanatory description, and an `entities` card with `secondary_info: last-changed`. `home_today` is an override. It belongs there, and it gets last-changed for free — which matters for auditing a silenced dose.
- **The chip-clipping risk is stale.** The plan's mitigation ("use the wrap layout template rather than the fixed 45 px one") was already implemented; `school.yaml:43` uses `page_chip_layout_wrap.yaml`. Harmless, but it signals the dashboard was read from memory rather than from the file.
- The settings-popup "Today" block (Task 6b) is a genuinely good idea and should survive any scope cut — it is the only place the derived state becomes inspectable.

### 13. MINOR — The start+30 trigger mechanism is unspecified and inherits a documented silent-skip

Task 4 says "fire at start time plus 30 minutes" without saying how. `sensor.primary_school_start_time_today` is `device_class: timestamp`, so the modern form is:

```yaml
- trigger: time
  at:
    entity_id: sensor.primary_school_start_time_today
    offset: "00:30:00"
```

Supported on 2026.7.4, but there is **no precedent for the offset form anywhere in this repo** — every existing `trigger: time` on a sensor is bare (`at: sensor.nino_departure_time`), which is why the departure reminders pre-compute their offsets into dedicated sensors. Worth naming so the builder doesn't invent a `time_pattern` + template instead.

It also inherits the caveat the package already documented in `nino_departure_reminder.yaml`:

> `trigger: time` only fires if the sensor's timestamp is still in the future when HA evaluates it — a reload after today's time has already passed silently skips today.

Per Concern 2, a skipped ping fails toward silence.

### 14. NIT — Small things

- **Aliases are unspecified.** LEARNINGS: *"Entity IDs derive from `alias:`, not `id:`."* The plan names files and IDs but no aliases; a builder guessing gets `automation.nino_dropped_off` from `alias: "Nino Dropped Off"` but nothing guarantees it.
- **Dismissal is the wrong home-again boundary.** `at_school` turns off at the bell, but Nino is in the car until ~dismissal+15 (there is a `nino_pickup_lead_minutes`). Irrelevant for a 13:00 dose; would matter if a dose ever lands near 15:00.
- **`now()` gives up to 59 s of lag** on the window edges. Harmless here; worth one line in the file header so nobody debugs it later.
- **Header comments**: `packages/school/` headers are 3-6 lines. Task 3's sensor has three inputs and a non-obvious never-unavailable contract — that contract is the one thing that belongs in the header (per the memory note: reasoning goes in the commit, the contract goes in the file).

---

## AC Validation Issues

Task 7 is the plan's only quality gate and reads as prose. "Watch one school morning in Logbook for the latch and one for the ping" is a two-day feedback loop for the two mechanisms most likely to be wrong.

| Task | Current AC | Issue | Suggested AC |
|---|---|---|---|
| 3 | *(none)* | Concern 1 is untested | "With `sensor.primary_school_dismissal_time_today` unavailable, `binary_sensor.nino_at_school` reads `off` — never `unknown`/`unavailable`. Verified by toggling `school_day_override_off`." |
| 5 | *(none)* | The whole point, untested | "On a non-school day at the dose-2 time, the announcement plays. On a school day, it does not, and the push still fires." |
| 5 | *(none)* | Concern 1's inverted-ship case | "Rename `binary_sensor.nino_at_school` out of existence and confirm the announcement still plays." |
| 2 | "Watch one school morning in Logbook" | 24 h loop, unbounded | "Set the latch window to now±20 min; move `person.john_koht` into the zone via `device_tracker.see`; `input_boolean.nino_dropped_off` goes on after 3 min and not before." |
| 4 | "Watch one school morning" | Doesn't test the durable-handler failure | "Send the ping, run `ha core reload-automations`, then tap Yes; `home_today` turns on." (Fails today — this is Concern 8's test.) |
| 4 | *(none)* | Silent no-op after timeout | "Tap Yes after the timeout has elapsed; either it works, or something is logged." |
| 1 | *(none)* | Reset untested | "Turn all four booleans on, trigger `automation.school_overrides_reset` manually, all four are off." |
| 7 | "confirm every referenced entity exists in the repo or the UI" | Not a check, and `.storage` isn't greppable from here | "`zone.primary_school` and `zone.parochial_school` resolve in Developer Tools → States with a stated radius; both zone triggers appear in the automation's trace." |

**Test coverage gaps beyond the table**: nothing verifies that the new person-in-zone state doesn't disturb John's or Cristina's arrival/departure automations (Concern 3), and nothing verifies the push-loop behaviour on a school day (Concern 10).

---

## Strengths

- **The problem is real and correctly located.** Dose 2 at 13:00 on a school day genuinely announces into an empty-of-Nino house, and `script.voice_announcement` with `media_players: auto` will happily route it to whichever room Cristina or Nonna is in. Worth fixing.
- **Layering on `packages/school/` rather than inferring from adult presence is the right call**, and the plan says why. Nonna's arrival being indistinguishable from a normal visit is exactly right — `binary_sensor.nonna_presence` is a Bayesian sensor at `probability_threshold: 0.97` and has no business deciding a medication gate.
- **Using dismissal rather than `<kid>_school_started`** is correct and correctly reasoned; `school_started` really is monotonic within the day.
- **A named `binary_sensor.<kid>_at_school`** is a better contract than an inline template buried in a medication automation — greppable, renderable, and it survives the medication package being rewritten. Keep the name even if the derivation shrinks.
- **Reset at 23:58 with the other overrides, unconditionally**, correctly cites and follows the LEARNINGS rule that a gated reset is how flags latch forever.
- **The rejected-alternatives list is real reasoning**, not decoration — the `school_day_override_off` rejection ("house-wide, silences the other kid's reminders") is exactly right and is the reason a per-kid boolean is warranted at all.
- **Gating only the voice `if:` block, not the automation `conditions:`**, is the correct surgical instinct — the same distinction the previous review flagged about `speech_notifications`. Push must survive.

---

## Devil's Advocate

**If this ships as written and fails, it will fail by staying quiet.**

Every mechanism in the plan pushes in the same direction. `home_today` defaults off. A missing zone doesn't fire. A dead `wait_for_trigger` doesn't fire. A skipped time trigger doesn't fire. An `unavailable` sensor reads as not-`off`. Six independent silent paths, all landing on "the medication cue was suppressed for a child who was home." Meanwhile the plan's Risks section names one failure — the dismissal sensor going unavailable — and uses it to conclude the design "fails loud." It doesn't. It fails quiet, by default, in the common case.

**The thing being protected is not worth what's being spent.**
`at_school` at 13:00 is `school_day AND NOT home_today`. The window is constant-true; the latch only suppresses the ping; the ping only sets `home_today`. Four of the seven tasks exist to save a parent one tap on a day their kid is home sick — a day on which that parent is already home, already awake, already handling it, and already holding the phone the ping would arrive on. The GPS latch is machinery built to avoid an interaction that costs less than the machinery's own failure modes.

**And the ratio is bad in the other direction too.** The thing being saved is one Sonos announcement per school day. The thing being risked is a suppressed medication cue with no log line. This repo has an escalation backstop precisely because someone already reasoned that a silent miss is unacceptable — `nino_medication_escalation.yaml`'s header is emphatic:

> A backstop that shares a mute switch with the system it backs up is not a backstop.

This plan adds a mute switch upstream of the announcement, driven by a calendar feed, a GPS geofence, and a notification tap. The escalation backstop still covers the worst case (2 h late → critical push), which is the only reason this isn't a hard no — but the plan should say so, because that backstop is currently doing more safety work than anything the plan adds.

**What I'd actually ship**: Concern 6's v1 — one boolean, one condition, one dashboard row, in the Overrides section where every other manual school control already lives. Then watch it for a month. If John finds himself forgetting the toggle, that's the evidence that justifies a latch, and by then he'll know whether the false-positive rate on a 122 m circle is tolerable. Building the latch first means building it against a guess.

**The unasked question**: what actually happens to dose 2 on a school day? If the school administers it, the entire dose-2-at-home flow — push, 15-minute snooze loop, 15:00 critical escalation — is noise, and gating the voice is treating the quietest symptom. That question should be answered before any of this is built, because the answer might make the whole feature unnecessary.

---

## Verdict

- [ ] Approve
- [ ] Approve with suggestions
- [ ] Approve pending pre-mortem
- [x] **Revise**

Two blockers, both about failure direction on a medication cue, one of which (Concern 1) would ship the feature **inverted** — silencing weekends and holidays — while passing `ha core check`. Seven majors, of which Concern 6 argues most of the plan should be cut rather than fixed.

The problem statement and the decision to layer on `packages/school/` are right. The abstraction (`binary_sensor.<kid>_at_school`) is right. The derivation chain behind it, the GPS latch, the ping, and Gianluca's half are not earned by the single consumer this serves.

Once revised — whether to the small v1 or the full version with inverted polarity — this is `Approve pending pre-mortem`. Not on size, on stakes: the failure mode is a suppressed medication reminder with no log line.

---

## Suggested Changes

**Change 1 — Never-unavailable contract on the at-school sensor** *(Tasks 3, 5)* — BLOCKER
- **What's wrong**: Task 3 points the builder at the `availability:` idiom used by the *timestamp sensors* in `kids/nino_school.yaml`, which is false on non-school days. Combined with a `condition: state / state: "off"` gate, that silences the announcement on exactly the days it should play.
- **What to do**: Task 3 states the contract explicitly — no `availability:` block, always `on`/`off`, all bad inputs resolve to `off` inside `state:`; cite `binary_sensor.nino_school_started` (a binary_sensor) as the pattern, not the timestamp sensors. Task 5 gates negatively: `{{ not is_state('binary_sensor.nino_at_school', 'on') }}`.
- **Where**: Tasks 3 and 5; add both ACs from the table.

**Change 2 — Fix the failure direction, or shrink the surface** *(Approach, Risks, Tasks 2/3/4)* — BLOCKER
- **What's wrong**: `home_today` defaults off and six independent silent paths land on "silenced while home." The Risks section claims the design fails loud, citing the one case that does.
- **What to do**: pick (a) invert — `at_school` requires positive evidence he left; or (b) shrink to `school_day AND NOT home_today` and drop the latch/ping/window. Rewrite the Risks section with the actual failure table (Concern 2).
- **Where**: Approach, Risks, and whichever tasks survive.

**Change 3 — Cut to v1** *(Tasks 2, 4, and Gianluca throughout)* — MAJOR, recommended
- **What to do**: v1 = `input_boolean.nino_home_today` in `school_overrides.yaml` + `binary_sensor.nino_at_school` + the Task 5 gate + one row in the Overrides section + the settings-popup "Today" block. Move the latch, the ping, and Gianluca's automations to a follow-on plan gated on a real second consumer.
- **Where**: Tasks 2, 4, 6; Goal ("Gianluca gets the same sensors and latch so a future use has them ready").

**Change 4 — Create the zones** *(new task, before Task 2)* — MAJOR
- **What's wrong**: `zone.primary_school` / `zone.parochial_school` exist nowhere in this repo; a zone trigger on a nonexistent zone loads clean and never fires.
- **What to do**: add a task creating both (YAML alongside `zone: Home` in `configuration.yaml` with `!secret` coordinates, since the repo is public), plus verification that they resolve and that no arrival/departure automation on John or Cristina is disturbed by the new intermediate zone.
- **Where**: new task; Task 7 verification.

**Change 5 — Dose-1 coupling** *(Task 5, Approach)* — MAJOR
- **What's wrong**: "dose 1 at 07:30 is unaffected" is a fact about `.storage`, not the config; both times are independently user-editable, and `initial: "07:30:00"` means the live and file values can already disagree.
- **What to do**: either scope the gate to dose 2 explicitly (`dose | string == '2'` — `dose` is already in `variables:`), or state the coupling as a known hazard with an AC covering a dose 1 set inside school hours.
- **Where**: Approach paragraph 4, Task 5.

**Change 6 — Split the ping into send + always-listening handler** *(Task 4)* — MAJOR, if the ping survives
- **What's wrong**: `wait_for_trigger` + `context.id` doesn't survive a reload and silently no-ops after timeout; the medication automation gets away with it because it has three backstops and this has none.
- **What to do**: ping automation sends a **stable** action ID and exits; a separate always-listening automation on `mobile_app_notification_action` flips `home_today` — the `camera_notification_action_handler.yaml` pattern. Add a **No** button, and have No latch `dropped_off`.
- **Where**: Task 4.

**Change 7 — Notify both parents** *(Task 4)* — MAJOR, if the ping survives
- **What to do**: `devices: "all"`, matching every other school reminder. Cristina does the parochial drop-off (`parochial_school_schedule.yaml` header).
- **Where**: Task 4.

**Change 8 — File placement** *(Tasks 1, 2, 4)* — MINOR
- **What to do**: `home_today` into `school_overrides.yaml` (update its "only two manual controls" header); any surviving automations into `reminders/`, not `kids/`; keep band-specific entity references confined to `kids/<kid>_school.yaml` so the "three-line band change" property holds. Specify `alias:` for every new automation.
- **Where**: Tasks 1, 2, 4.

**Change 9 — Dashboard placement** *(Task 6)* — MINOR
- **What to do**: `home_today` goes in the existing **Overrides** entities card (gets `secondary_info: last-changed`, which matters for auditing a silenced dose), not the chip row — every chip there is `tap_action: none`. Drop the stale chip-clipping risk; `school.yaml:43` already uses `page_chip_layout_wrap.yaml`. Keep the settings-popup "Today" block; it's the best part of Task 6. If a Gianluca control ships with nothing reading it, label it "(inactive)" the way `early_dismissal_today` is.
- **Where**: Task 6, Risks.

**Change 10 — Trigger mechanism and verification** *(Tasks 4, 7)* — MINOR
- **What to do**: name the `at: {entity_id:, offset:}` form for start+30 (no repo precedent — say so), note the reload-skips-today caveat from `nino_departure_reminder.yaml`, and replace Task 7's prose with the AC table above.
- **Where**: Tasks 4 and 7.

**Open question for John** *(Concern 10)*: on a school day, does dose 2 get administered at school? If so, the push loop and the 15:00 critical escalation fire every school day and gating only the voice treats the quietest symptom — the gate may belong on the automation's `conditions:` (with an auto-mark) rather than around one action. Worth answering before building anything.
