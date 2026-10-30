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
  purpose. A new `state: "Auto"` condition on the select fails a test.
- Bedtime ends (`bedtime_mode_off`) when any home adult is awake, or no adult
  is home, between 05:00 and 12:00. The old version also passed when an adult
  was away, which let an absent adult end it.
- `alarm_disarm_in_morning` starts only 05:00 to 12:00, and after its wait
  re-checks bedtime off, `armed_home` and occupied. A night-time bedtime end
  can no longer disarm, and a house re-armed during the wait stays armed. A
  wait that outlasts noon still disarms.
