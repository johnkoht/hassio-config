# LEARNINGS — packages/air_quality/

## A dropout used to turn every purifier off (2026-11-21)

The Awair readings come from the cloud and blip `unavailable` for about 30 s now and then. The room templates went unavailable with them. The detection automation fired on the change, and the script's catch-all `else` (meant for room Off) turned the purifier off. That evening it happened at 6:11 and 8:11 pm.

Now the templates have `availability:`, the detection triggers use `not_to: [unavailable, unknown]`, and the script stops on any state it doesn't know. Don't use `not_from` on those triggers: the recovery from a dropout is what re-syncs a purifier whose room changed level meanwhile.

## Winix caches its mode

The Winix integration (`custom_components/winix/device_wrapper.py`, HACS, so it isn't in this repo) keeps `_auto/_manual/_sleep` flags. `async_set_mode(AUTO)` returns without sending anything when `_auto` is already set, and `turn_off` doesn't clear it. Its coordinator polls every 30 s and refreshes 4 s after an on or off.

On 11-21, Gianluca's and the main bedroom's purifiers came back from the dropout at Manual 50% instead of Auto. Two live repros on the office purifier (Auto, off, on+Auto; and Sleep, off, on+Auto) both landed on Auto, so the cause is unproven.

The script's 15 s re-check and retry is defensive. If a purifier still sticks, check the poll before blaming the automation.

## Keep the six room templates identical

The six room sensors are one template with the room slug and name substituted. `test_room_templates_are_identical_but_for_the_room` fails if one drifts. Change all six together.

## A delay in the script blocks the calling automation

The detection automations call the script with `action:`, which waits for it to finish, including the 15 s preset re-check. In `mode: single` any trigger that arrived during that wait was dropped with "already running". They are `queued` (max 5) for that reason. The re-check also bails if the purifier was turned off or construction mode came on during the wait.

The hysteresis memory (`this.state`) is lost across a dropout, a template reload or a restart. The next reading re-computes without it, which at worst shows a room one band lower until the next crossing.

## Manual speed is lost right after a mode switch (2026-11-22)

Right after the first deploy, three purifiers that had been on Sleep or Auto went to Manual 25% instead of 50% or 75%. The script's traces showed the right `set_percentage`. The Winix integration sends "manual" and then the speed back to back, and the unit keeps the low airflow that the mode switch sets. Purifiers that were already on Manual only get the speed command, and those landed correctly. Re-sending the speed alone a moment later worked, so the Manual branch now re-checks `percentage` after 15 s.
