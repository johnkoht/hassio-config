---
title: Doorbell Message (JK-82)
slug: jk-82-doorbell-message
status: draft
created: 2026-11-23
has_pre_mortem: false
has_review: false
has_prd: false
---

# Doorbell Message (JK-82)

## Problem

The doorbell screen keeps falling back to the stock "Default Message (WELCOME!)". The House Mode - Doorbell Text automation sets the message when the house mode changes, and then nothing keeps it there.

## Root cause (verified live 2026-11-23)

It is not a Protect reload or a doorbell reboot. Every message the automation sets expires on a timer.

- The automation writes through `select.front_door_camera_doorbell_text`. The Protect integration's select path calls `set_lcd_message_public` with the NVR default `reset_at`, so the NVR clears the message after its default reset timeout.
- The recorder shows the same pattern every time since at least 11-20: a message is set, and 8 to 15 minutes later the select flips back to `Default Message (WELCOME!)`. Examples: 01:50 UTC set, 02:00 UTC reverted; 14:45 set, 15:00 reverted. No integration reload in the logs.
- `text.front_door_camera_doorbell` (max 255 in HA) writes a custom message through the legacy `set_lcd_text` with `reset_at=None`, so it should never expire. This needs one live write to prove (build step 1).
- Protect's own limit is 30 characters (`uiprotect` `DoorbellText`, and `set_lcd_text` raises over 30). HA's 255 is not the real limit.
- The select only offers presets saved on the NVR, so it cannot show "Good evening!" or a holiday text anyway.
- `Entertainment` is an `input_select.house` option, but the resolver never selects it, so the old automation never had an Entertainment text. `input_boolean.entertainment_mode` is the real signal.

## Goal

The doorbell always shows a message we chose, never the stock default.

## Approach

Write through the text entity, resolve the message in one place, and re-apply whenever it drifts.

### 1. Resolver: `sensor.doorbell_message`

New file `packages/house/doorbell/doorbell_message.yaml`. A template sensor whose state is the text to show. Its `reason` attribute says which rule won, for debugging. It re-renders on its inputs, with no `initial:` and no schedule. The text is cut to 30 characters as a belt-and-braces guard.

Precedence, first match wins:

1. House mode `Away`, `Vacation` or `Bedtime`: `DO NOT DISTURB`
2. House mode `Quiet`: `SHHH…KIDS SLEEPING`
3. `input_boolean.entertainment_mode` on: `Come on in…`
4. A holiday window (date only): the holiday text
5. Sun above the horizon and rising (sunrise to solar noon): `Good morning!`
6. Sun below the horizon and setting (sunset to solar midnight): `Good evening!`
7. Otherwise: `Welcome!`

If `input_select.house` is unknown or unavailable, fall through to rules 3 to 7. Rules 1 and 2 keep today's wording (already in the repo). Time of day uses `sun.sun` only; there are no clock times.

### 2. Applier: `automation.doorbell_message_apply`

New file `packages/house/doorbell/doorbell_message_apply.yaml`, replacing `packages/house/modes/house_mode_doorbell_text.yaml` (deleted; it also carried `initial_state: on`). It calls `text.set_value` on `text.front_door_camera_doorbell` with the resolved text.

Triggers:
- `sensor.doorbell_message` changes.
- Home Assistant starts, and `automation_reloaded`.
- `text.front_door_camera_doorbell` changes (covers a Protect reload, an NVR reset, a doorbell reboot, and someone using the Protect app), held for 30 seconds.
- A `time_pattern` every 30 minutes, as a safety net for a missed event.

Conditions:
- The resolved text is not empty, unknown or unavailable.
- The text entity is available and its state differs from the resolved text.

So it writes only on a real difference and cannot loop: a write that changes nothing emits no state change. Mode `single`.

### 3. Housekeeping

- `tests/test_house_mode_resolver.py::test_doorbell_text_follows_every_option_but_entertainment` tests the deleted automation. Replace it with the new tests below.
- The old automation leaves a registry ghost after deploy. Note it for John to clear; don't script it.
- Docs: a line in `docs/AUTOMATIONS.md` next to the house mode resolver entry, and a `packages/house/LEARNINGS.md` entry (select expires, text does not; 30-char limit).

## Proposed wording (defaults for John to edit)

Standard rules (all 30 characters or fewer):

| Case | Text |
|---|---|
| Away, Vacation, Bedtime | `DO NOT DISTURB` |
| Quiet | `SHHH…KIDS SLEEPING` |
| Entertainment | `Come on in…` |
| Morning | `Good morning!` |
| Evening | `Good evening!` |
| Standard | `Welcome!` |

Holidays (date windows, all dates from the calendar, nothing household-specific):

| Holiday | Window | Text |
|---|---|---|
| New Year | Dec 31 and Jan 1 | `Happy New Year!` |
| Valentine's Day | Feb 14 | `Happy Valentine's Day!` |
| St. Patrick's Day | Mar 17 | `Happy St. Patrick's Day!` |
| Independence Day | Jul 4 | `Happy 4th of July!` |
| Halloween | Oct 25 to Oct 31 | `Happy Halloween!` |
| Thanksgiving | 4th Thursday of Nov | `Happy Thanksgiving!` |
| Christmas | Dec 20 to Dec 25 | `Merry Christmas!` |

Easter is left out of v1 (it needs a computed date). Mother's Day, Father's Day, Memorial Day and Labor Day are also left out. Birthdays are not proposed, since they would be household data in a public repo.

The holiday table lives in one dict inside the resolver template, so editing a window or a text is a one-line change.

## Tests (`tests/test_doorbell_message.py`)

Static YAML checks plus Jinja renders with stubbed `states`, `state_attr` and `now()`, the way `tests/test_house_mode_resolver.py` does it.

1. Every precedence rule, including: Entertainment beats a holiday, Quiet beats Entertainment, DND beats everything.
2. Every holiday window edge (first day, last day, day before, day after); Thanksgiving for 2026, 2027 and 2028 (4th Thursday).
3. Time of day: rising and above the horizon is morning, setting and below is evening, and the rest is `Welcome!`.
4. Unknown or unavailable house state falls through; unknown or unavailable sun falls back to `Welcome!`.
5. Every possible output is 30 characters or fewer (the length test enumerates the table).
6. Applier: triggers present (resolver, start, reload, text entity with `for`), conditions present, action targets the text entity, no `initial_state`, and no `select.front_door_camera_doorbell_text` write anywhere in the repo.
7. Old automation file is gone and no other file references `house_mode_doorbell_text`.

Run: `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`

## Build steps

1. **Live proof first (needs John's OK, one write).** Set `text.front_door_camera_doorbell` to a test string, wait past the longest observed revert (15+ minutes), confirm it is still there; then set it back to the resolved text. If it does expire, fall back to the safety-net trigger alone, tightened to every 5 minutes, and record that in LEARNINGS. Also confirm Protect keeps the case as written (mixed case vs. the old all-caps).
2. Write the tests (red), then the resolver, then the applier.
3. Delete the old automation and replace its test.
4. Docs and LEARNINGS.
5. Reviewer, `/wrap`, PR. Deploy is John's: a package reload covers the template sensor and automation; no restart needed.

## Risks

- The text entity might also expire (step 1 covers it; the safety net keeps the message anyway).
- A custom text replaces the Protect built-in "Do Not Disturb" message type. It renders as plain text, with no icon if the doorbell shows one. Check visually after deploy.
- The write goes through the NVR API, so an NVR outage makes it fail. It retries on the next trigger.
- Public repo: the plan and the config hold only generic wording and calendar dates; no schedules.

## Open questions for John

1. Wording and holiday list above okay? Anything to add or drop?
2. Should Christmas and Halloween run for the whole season (for example all of December), or only the days around the holiday as proposed?
3. Should Evening start at sunset (default), or later, at dusk?
4. OK to do the one live write in build step 1?
5. `DO NOT DISTURB` becomes a custom text instead of the built-in message type. Fine?
