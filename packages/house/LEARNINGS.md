# LEARNINGS — packages/house/

## A group reload makes `group.all_people` read not_home for a moment

`group.all_people` is built from other groups (`family`, `extended_family`,
`guests` in `packages/people/people_groups.yaml`). Reloading groups tears
them all down and rebuilds them, and for a moment `all_people` reads
`not_home` while everyone is home.

`occupancy/house_not_occupied.yaml` had no `for:` on that trigger, so every
group reload turned off `house_occupied`. The old Away automation then set
the house to Away. Nothing turns occupancy back on until a person sensor changes
to home, so the house stayed Away.

Keep a `for:` on any trigger watching a group made of groups. Adding
`not_from: [unavailable, unknown]` doesn't help, because the flip can go
straight from `home` to `not_home`. The user chose to keep the nested groups
(2026-10-05), so the delay is the fix rather than flattening them.

## Vacation bedtime runs on every restart

`bedtime_mode/bedtime_mode_vacation.yaml` is meant to be enabled and
disabled by the vacation automations. Its `initial_state: on` re-enables it
on every restart, so it can't rely on that alone. It checks
`input_boolean.vacation_mode` itself.

Without that check, any evening out after 22:00 turned `bedtime` on, and
the house stayed in Away when everyone got home (the old Auto automation
refused to run while bedtime was on).

## A stuck room-occupied flag keeps a kid's room Off after Away

Away sets every bedroom to Off, and each room's Mode Auto puts it back when
the house is occupied again. Mode Auto also needs the room's occupied flag
to be off. If the flag is still on (door left closed, or Gianluca's door
sensor offline, which never matched "open"), Auto fails at that moment, and
its only other trigger is the flag going off, which nobody is home to do.

Both kids' `*_not_occupied` automations now clear the flag when the house
has been empty for 2 min (bed permitting), and Gianluca's treats an offline
door sensor as open (2026-10-27).

## Home-filtered aggregate sensors flip on departure

`everybody_in_bed` and `adults_in_bed` count only adults who are home, so
one adult leaving while the other is in bed turns them on. Home-filtered
aggregate sensors flip on departure, so don't trigger mode changes off
them. `bedtime_mode_on` triggers on the per-person in-bed booleans and
checks the aggregates as conditions (2026-10-28).

John's ruling (2026-10-29): an adult leaving while everybody else home is in
bed *should* start bedtime and arm. So `bedtime_mode_on` also triggers on
`person.*` leaving home (2 min). `bedtime_mode_off_on_arrival` ends it when an
adult who isn't in bed gets home, and the resolver then lands on Quiet or
Auto. Both skip `unknown`/`unavailable` so a restart can't end bedtime.

## The house mode is derived, not set (JK-1118)

`input_select.house` has one writer, `modes/house_mode_resolve.yaml`. It
computes the mode from `house_occupied`, `vacation_mode`, `bedtime` and
`quiet_mode` (Vacation, Away, Bedtime, Quiet, else Auto) on any change, on
start and on reload, and selects only when the value differs. To change the
mode, toggle the booleans. A manual pick from the dashboard lasts until the
next input change. Don't hard-code a house option in a new automation: edge
triggers like that were the bug (an arrival into a bedtime house left Away
selected; bedtime ending with quiet on went to Auto; Bedtime overwrote
Vacation). `scripts/house/house_away.yaml` is the one leftover writer.

- Variables and conditions are action steps, not automation-level, because a
  queued run would otherwise use state from trigger time.
- Vacation needs the house empty for 2 min, so it passes through Away first
  (alarm, rooms, cameras still run). An occupied house with vacation on (a
  sitter) resolves to the normal modes. A start or reload counts the hold as
  met, since its timer is lost.
- Arrival is debounced 10 s (`house_occupied` to on) so the arrival
  automation can end bedtime before the resolver runs, avoiding a one-second
  Bedtime that would fire `office_mode_off` and friends. Departure is not.
- The doorbell select has no `Please do not disturb!` option (live options: `WELCOME!`, `DO NOT DISTURB`, `SHHH…KIDS SLEEPING`, ...), so the old Vacation text always errored; Vacation now uses `DO NOT DISTURB`.
- Side effects (doorbell text, speech on at Auto, away push, nap speech off)
  are transition automations in `modes/`. Speech comes back on only at Auto, so
  a morning that ends in Quiet keeps it off until quiet mode ends.
- Room `*_mode_auto` automations accept Auto or Quiet. Anything new that needs
  the house "up" should accept Quiet too; `hourly_dong` still requires Auto on
  purpose. A new `state: "Auto"` condition on the select fails a test, and so
  does a `*_mode_auto` trigger on exactly `to: "Auto"`. The office, garage and
  hallway had only the trigger, so JK-1118 missed them (2026-11-11). Bedrooms
  and the main bathroom are still Auto-only and allowlisted, awaiting John.
- A room's lights-on automation that triggers on occupancy races the room's
  mode-auto on the same change, and sees the old mode. Give it a trigger on the
  room going Auto too (`office_lights_on`).
- Bedtime ends (`bedtime_mode_off`) when any home adult is awake, or no adult
  is home, between 05:00 and 12:00. The old version also passed when an adult
  was away, which let an absent adult end it.
- `alarm_disarm_in_morning` starts only 05:00 to 12:00, and after its wait
  re-checks bedtime off, `armed_home` and occupied. A night-time bedtime end
  can no longer disarm, and a house re-armed during the wait stays armed. A
  wait that outlasts noon still disarms.

## Crazy Mode: Sonos favorites, the clock and the kitchen latch (2026-11)

- Sonos lists favorites as `source_list` entries, so `media_player.select_source`
  plays one by name. A name that doesn't match does nothing and raises nothing;
  the allowed sensor checks all three names against all four speakers and refuses
  with `favorite_missing`. Call it on the group coordinator (the kitchen); volume
  is still per speaker. Set shuffle a few seconds after the source starts.
- A run script can't be told to skip ahead. The stop button sets a flag that only
  the Crazy and Slow-mo waits read, so Cool-down can't be skipped, and
  `script.turn_off` on the run is left to the emergency abort.
- Calling `script.announcement_engine` with `action:` blocks for the chime, the
  TTS and a 3 s tail, which would stretch the clock. Mid-run lines use
  `script.turn_on` (not blocking); only the closing line blocks, after the clock.
  The engine needs `sound_file` and `sound_length` even for speech.
- `kitchen_lights_to_off` fires on vacancy and does not read
  `kitchen_lights_manually_toggled` (only `kitchen_lighting_automations`), so the
  latch doesn't hold the lights through a vacancy. The run re-asserts the lights
  every tick; a script must never write the room flag.
- Scene snapshots can carry Adaptive Lighting switches, so one `scene.create`
  before the run and one `scene.turn_on` after puts the lights and AL back
  together (take it before turning AL off).

## Crazy Mode v2: a pause driven by the phase timer (2026-11)

- A running `timer` freezes `remaining` at its last start; only `finishes_at`
  moves. Progress while active is `finishes_at - now()`, while paused it is
  `remaining` (the timer clears `finishes_at`). A deadline saved at phase start
  keeps running through a pause, so nothing in Crazy or Slow-mo may save one.
- `timer.start` with no duration resumes a paused timer, but on an idle timer
  it starts the stored default; a stored 0 finishes at once. So Resume calls it
  only when the timer is paused, every run-owned start passes a duration, and the
  helper keeps a non-zero default.
- A tick loop with 5 s steps needs a fired-once variable (declared before the
  loop, set with the `variables` action) for each one-off line, or a threshold
  such as "a minute left" repeats on every later tick.
- A paused run still re-asserts its lights each tick: `kitchen_lights_to_off`
  ignores the latch, so skipping the re-assert for a long pause would leave the
  kitchen dark. Only ramps and fades stop.
- Template sensors can't hand lists to scripts through variables, so a zone's
  lists live as attributes of one template sensor and every reader falls back
  loudly when it is missing during a reload.
- An `input_number` with no `initial:` and no restored state starts at `min`.


## The doorbell message expires through the Protect select (JK-82)

`select.front_door_camera_doorbell_text` writes with the NVR's default reset timeout, so every message set through it reverted to `Default Message (WELCOME!)` 8 to 15 minutes later (recorder, 11-20 onward; no Protect reload involved). `text.front_door_camera_doorbell` writes with no reset time, and is the only way to show free text. Protect's limit is 30 characters, not HA's 255.

`doorbell/doorbell_message.yaml` resolves the text and `doorbell_message_apply.yaml` writes it, only when it differs. Nothing should write the select. The resolver never selects `Entertainment` on `input_select.house`, so Entertainment text keys off `input_boolean.entertainment_mode`.
