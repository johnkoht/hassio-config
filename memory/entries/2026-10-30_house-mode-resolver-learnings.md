# House mode resolver (JK-1118)

**What:** `input_select.house` now has one writer, `house_mode_resolve`, which derives the mode from `house_occupied`, `vacation_mode`, `bedtime` and `quiet_mode` (Vacation, Away, Bedtime, Quiet, else Auto) on every input change, start and reload. The six edge-triggered legacy automations are gone; doorbell text, speech on, away push and nap speech-off are transition automations. Bedtime ends when one home adult is up (05:00 to 12:00); 11 room Auto automations plus the foyer accept Quiet; `alarm_disarm_in_morning` is bounded to 05:00-12:00 and re-checks after its wait. One PR, 6 tasks. #87 had already shipped OD-1 (`bedtime_mode_on` on departure, `bedtime_mode_off_on_arrival`), so those were not rebuilt.

**Pre-mortem vs reality:** the pre-mortem found the alarm risk (night-time bedtime end disarming) and the transient Bedtime on arrival. The independent review found the structural fault: automation-level `variables:` and `conditions:` render at trigger time, before a queued run starts, so a queued resolver would act on stale state. It also caught that a post-wait clock re-check in the disarm would leave the house armed all day after a late wait.

**Learnings:**
- In a `mode: queued` automation, compute anything that must be fresh in an action-level `variables:` step and gate with an action-level `condition:`.
- A state trigger with `for:` is dropped by a reload and never starts after a restart, and `last_changed` resets on start. A derived-state automation needs start/reload triggers and a rule for time-held conditions.
- "Select only when different" keeps a derived-state automation from creating transitions that fire consumers.
- Static tests with a tolerant YAML loader (`!secret`) matter: a plain `safe_load` inside `except YAMLError: continue` silently skips every file that uses a secret.

- The doorbell select has no `Please do not disturb!` option (live read-only check), so the old Vacation doorbell text always errored; the transition automation uses `DO NOT DISTURB`.

**Follow-ups (backlog):** bedtime never ends via the morning triggers if the first adult is up after noon; kid-room and bathroom `*_mode_auto` triggers on `to: Auto` only skip Bedtime to Quiet (other triggers cover them); `scripts/house/house_away.yaml` is a leftover writer; the 10 s arrival debounce is untested live (observe the first night arrival); departure alarm sequence (armed_home at 1 min, force armed_away at Vacation 2 min) to be watched; daytime Quiet now re-asserts room Auto (a manual room Off/DnD is reset when a nap starts); dead `Off`/`On`/lowercase `bedtime` triggers and the mid-morning in-bed flapping remain; old automation registry ghosts to clear after deploy.
