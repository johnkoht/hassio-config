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
