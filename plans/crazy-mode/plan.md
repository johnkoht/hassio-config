---
title: Crazy Mode
slug: crazy-mode
status: shipped
created: 2026-11-18
has_pre_mortem: true
has_review: true
has_prd: true
---

# Crazy Mode

## Problem

The kids need a structured way to burn off energy indoors. Starting a burst of play is easy; landing it is the hard part, and when a parent has to call time it turns into a negotiation. The house should own the clock and the ramp-down, so a run always ends the same way without anyone having to enforce it.

## Goal

One tap or one Alexa phrase starts a 7-minute run on the main-floor running loop: 5 minutes of Crazy, 1 minute of Slow-mo, then 1 minute of Cool-down. Music, lights and short voice cues mark each phase. Every run ends in Cool-down, the house goes back to exactly how it was, and the mode can only run once per allowed window.

## Approach

A new package, `packages/house/crazy_mode/`, built around one script that owns the clock and a phase helper that the dashboard and guard automations read. The loop runs kitchen → family room → foyer → dining/living → back. The playroom is excluded as a running space (Lego on the floor) but its speaker plays along.

**Phases**

| Phase | Time | Music | Lights (loop rooms) | Voice |
|---|---|---|---|---|
| Crazy | 0:00–5:00 | "Crazy Mode" favorite, shuffled, base volume | Full brightness | Start: "Crazy Mode! Crazy, then slow-mo, then cool-down. Socks off!" At 4:00: "One more minute of Crazy Mode!" |
| Slow-mo | 5:00–6:00 | "Chariots Of Fire" favorite, about 70% volume, 5–10 s fade | Slow dim to about 50% across the minute | "SLOW MOTION MODE!" |
| Cool-down | 6:00–7:00 | "Sleepytime" favorite, about 45% volume, fading out at the end | Steady low, about 30%, never dark | Heavy-work prompt at 0:00 and 0:30 |
| End | 7:00 | Speakers restored | Lights restored | Fixed closing line ending "Save your world." |

**Music.** The script snapshots the four Sonos speakers (kitchen, family room, living room, playroom) with `sonos.snapshot` including groups, joins them with `media_player.join`, and plays each phase's favorite with `media_player.select_source`, since Sonos lists favorites as sources. The favorite names live in three `input_text` helpers, so a song swap is a dashboard edit, not a code change. The favorites already exist (2026-11-18) and all four speakers list them as sources: "Crazy Mode" (Spotify playlist), "Chariots Of Fire" (Slow-mo) and "Sleepytime" (Cool-down). Names must match exactly, including case. Volume changes fade over 5–10 s in small steps; nothing hard-cuts to silence. At the end, `sonos.restore` puts back grouping, volume and what was playing.

**Voice.** User-started, inside an allowed window, so announcements call `script.announcement_engine` directly with the four Sonos as explicit `media_players`, the same pattern as the doorbell. That skips the queue's time and quiet gates (which could hold an announcement) but keeps the engine's emergency gate and its 75 volume cap. Each line is one step of about 8 words.

**Heavy work.** A list in the script (wall pushes, a held wall push, carrying couch cushions, carrying a stack of books, chair push-ups, a slow bear crawl, a big squeeze hug, turtle shell). No jumping, spinning or one-foot moves. Two distinct picks per run, at 0:00 and 0:30 of Cool-down.

**Lights.** Before Crazy, `scene.create` snapshots the leaf lights of the loop rooms (the `alarm_flash_lights` pattern: expand groups so a restore doesn't switch every member on). The script turns off the Adaptive Lighting switches for kitchen, family room and foyer, remembering which were on, and sets the kitchen's `kitchen_lights_manually_toggled` latch so motion lighting doesn't fight the run. The family room, foyer and dining room have no latch; their off automations fire on occupancy off, which won't happen with kids running laps, and the final scene restore covers any drift. At the end: restore the scene, turn AL back on where it was on, and clear the kitchen latch only if the script set it.

**When it can run.** Two windows (morning and evening), set in `input_datetime` helpers on the dashboard with no times in YAML, so the family schedule stays out of the public repo. John sets the values after deploy. `input_datetime.crazy_mode_last_run` records each start; a start is refused when it's outside both windows or the last run was in the same window today. A start is also refused when the house is Bedtime, Quiet, Away or Vacation, `house_occupied` is off, or `binary_sensor.emergency_active` is on. A refusal is spoken on the kitchen speaker: "Crazy Mode is recharging — back tonight" or "back tomorrow morning", so the system answers "again!" instead of a parent.

**Stopping.** Stop jumps to Cool-down, never to Off; Cool-down always runs. The only instant stop is `binary_sensor.emergency_active` (fire, alarm triggered, emergency mode): a guard automation cancels the script, then restores lights, Sonos and AL. A parent override on the dashboard clears the once-per-window lockout.

**Starting.** `script.crazy_mode_start` is the single entry point, with no fields so Alexa can call it. John exposes it to Alexa in the HA UI (Settings → Voice assistants), and an Alexa Routine maps "Alexa, crazy mode" to it. The dashboard gets a Home button and a `#crazy_mode` popup: start, stop (to Cool-down), current phase and time left, window helpers, favorite names, base volume and the lockout override.

**State.** `input_select.crazy_mode_phase` (Off, Crazy, Slow-mo, Cool-down) and `timer.crazy_mode_phase` for time left. No `initial:` on any helper (restart rule from JK-1262). A start-up automation catches a run interrupted by a restart: if the phase isn't Off, set it Off, turn AL back on and rejoin nothing (Sonos and lights stay as they are; the snapshot is gone).

Why one script over an automation per phase: the clock, the restore and Cool-down being unskippable are easiest to guarantee in one sequential run, and `script.turn_off` from the emergency guard is a clean cancel.

## Tasks

1. Helpers — `input_select.crazy_mode_phase`, `timer.crazy_mode_phase`, window `input_datetime`s, `input_datetime.crazy_mode_last_run`, favorite `input_text`s, base volume `input_number`, and an `input_boolean` for "kitchen latch set by crazy mode". No `initial:`.
2. Allowed-window template — `binary_sensor.crazy_mode_allowed` with a `reason` attribute (outside window, already ran, house mode, emergency), so the start script, the refusal line and the dashboard share one rule.
3. Start script — gates, refusal announcement, snapshots (Sonos, lights, AL state), join speakers, then hand off to the run script.
4. Run script — the four phases with music, fades, light changes, announcements and heavy-work picks, then the restore. `mode: single`.
5. Stop and abort — `script.crazy_mode_stop` jumps to Cool-down; an automation on `binary_sensor.emergency_active` cancels the run and restores; a start-up automation cleans up after a restart mid-run.
6. Dashboard — Home button and `#crazy_mode` popup, included next to the kids WiFi popup.
7. Tests — pinned guards: Cool-down can't be skipped by stop, no `initial:` on helpers, emergency abort present, refusal outside a window and after a run in the same window, heavy-work list has no excluded moves, no times hard-coded in YAML defaults.
8. Docs — package README, `docs/` mode entry, and a LEARNINGS note on `select_source` for Sonos favorites.
9. Hand-off for John — set the window helpers, expose the script to Alexa and create the Routine, then a first supervised run.

## Risks

- Favorite name mismatch: `select_source` silently does nothing if a name doesn't match. Mitigation: the allowed sensor also checks that all three names are in the Sonos source list, and the dashboard shows a warning.
- Spotify shuffle on a favorite playlist: shuffle has to be set after the source starts, or Sonos plays in order. Accept; verify on the first run.
- Announcements over music: the engine's own snapshot and resume behaviour on a joined Sonos group needs checking, so a voice line doesn't drop the music or break the group. Mitigation: test against the joined group in the first supervised run; fall back to lowering the music volume around each line.
- Restart mid-run loses the light and Sonos snapshots. Accepted; the start-up cleanup resets the phase and AL, and the house returns to normal automations.
- Family room, foyer and dining room have no motion-lighting latch. Accepted; occupancy stays on while the kids run, and the end restore covers drift.
- Kitchen latch: a dashboard-started script may set it anyway via the manual-change automation. The script records whether it was already on so it only clears what it set.
- Announcement engine bypass: calling the engine directly skips the speech and quiet gates. Accepted because the run is user-started inside an allowed window; the start gates enforce house mode instead.

On approval → /approve → /ship crazy-mode
