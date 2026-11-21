# Crazy Mode v2: zones, length, skip, pause, restart (2026-11-20)

- **The timer is the clock now.** Progress comes from `finishes_at` and `duration` while the timer is active, and from `remaining` while paused, because an active timer's `remaining` stays frozen at its last start. A paused timer resumes on `timer.start` with no duration. Starting a timer whose stored duration is 0 finishes it straight away, so Resume calls `timer.start` only on a paused timer.
- **One zone config.** `sensor.crazy_mode_zone_config` holds each zone's lists, and every script reads it. If the config is missing, start refuses, and restore and cleanup wait for it, then degrade with a log warning. Nothing falls back to hard-coded lists.
- **Fired-once variables.** Variables updated from inside the loop keep the one-minute line and the second prompt from repeating across ticks and across a pause.
- **Who may cancel the run** is an allowlist: the emergency abort, Restart and the paused timeout. Every control needs the run script on, the start and restore scripts off, and no emergency.
- **Pause and restart limits.** Pause works in Crazy and Slow-mo only. A run paused for 10 minutes ends with a restore and no Cool-down. Restart isn't exposed to Alexa.
- **A new `input_number` starts at `min`.** Seed the length slider to 5 through the API after deploy.
