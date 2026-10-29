# LEARNINGS — packages/house/

## A group reload makes `group.all_people` read not_home for a moment

`group.all_people` is built from other groups (`family`, `extended_family`,
`guests` in `packages/people/people_groups.yaml`). Reloading groups tears
them all down and rebuilds them, and for a moment `all_people` reads
`not_home` while everyone is home.

`occupancy/house_not_occupied.yaml` had no `for:` on that trigger, so every
group reload turned off `house_occupied`. `house_mode_away` then set the
house to Away. Nothing turns occupancy back on until a person sensor changes
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

Without that check, any evening out after 22:00 turned `bedtime` on. That
blocks `house_mode_auto`, so the house stayed in Away when everyone got
home.

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
adult who isn't in bed gets home, and `house_mode_auto` then selects Auto. Both
skip `unknown`/`unavailable` so a restart can't end bedtime. A night-time
bedtime off also arms `alarm_disarm_in_morning` (its "after 05:00" holds until
midnight), which disarms on first-floor occupancy, the same thing the arrival
disarm already did. It checks `armed_home` only before its 2.5 h
wait, so a run started this way could disarm a re-armed house if nobody hits
the first floor until after bed (unlikely; backlog).
