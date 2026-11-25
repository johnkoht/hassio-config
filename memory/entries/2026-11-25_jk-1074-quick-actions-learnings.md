# jk-1074-quick-actions — 2026-11-25

**Metrics:**
- 4 tasks, all approved on the first review.
- Full ship: one pre-mortem, which found one CRITICAL risk, overturned with evidence from the live host. One cross-model review found no blockers.
- 26 new tests; the full suite is 2520 passed, 9 skipped (was 2494).

**What shipped:**
- A ⚡ chip in the Home header. It opens a `#quick_actions` pop-up with one block of rows per signed-in person (`condition: user` plus `!secret` user ids).
- The rows: room link, own bedside lamp off, Nino's and Gianluca's nightlights, Nino's music start and stop, John's DnD, camera alerts, and kid "home today" (school days, within 60 minutes either side of that school's start).
- Each row is a `conditional` on a live template binary_sensor in `packages/house/quick_actions/`. The badge comes from a per-person count sensor.
- Nino's sleep-music start actions moved into `script.nino_sleep_music_start`, and `script.nino_sleep_music_stop` was added.

**Learnings:**
- YAML-mode Lovelace does resolve `!secret`, including in included files. The proof is `lovelace/dashboard.py`, which passes `Secrets` to `load_yaml_dict`.
  - The pre-mortem's "unsupported" claim was wrong, so check claims like this on the installed source.
  - The real risk is the opposite: a key missing from the host `secrets.yaml` fails the whole dashboard. Add the key before deploying.
- Test loaders for dashboards need a `!secret` constructor. `test_dashboard_views.py` crashed on the first one.
- A music row keyed on the "playing" flag misses music started by hand outside the automation's window. Key it on the media_player state.
- The test harness has no `as_datetime`. Use `as_timestamp(x, none)`, which works on live HA too and returns `None` for `unavailable`.

**Follow-ups (BACKLOG):**
- Header balance and badge placement have not been checked on the live DOM yet. Check them on a phone after deploy.
- The room-link rows and the two person blocks are duplicated. A test guards the area list against drift, but a template would remove the duplication.
- A user who is neither John nor Cristina sees an off-centre header.
- Cristina's lamp was unavailable on 2026-11-25, so her bedside row stays hidden until it's back.
