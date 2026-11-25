# Review: jk-1074-quick-actions (2026-11-25)

**Verdict: no structural blockers.**

Spot-checked: the `home.yaml` header and the `#notifications` pop-up, `nino_sleep_music_on`, `nino_school.yaml` (primary band), the school start sensors (unavailable on no-school days), and that `packages/house/` has no `quick_actions` basename collision. There's no `!secret` under `dashboards/` yet.

The suggestions below are folded into the PRD:

1. Drop the helper fallback for per-user rows. If `!secret` fails, fall back to a button-card JS `user_id` comparison against `person.*`.
2. Deploy prerequisite: add `john_ha_user_id` and `cristina_ha_user_id` to the host `secrets.yaml` (values never printed). Then load `lovelace/config` over websocket before calling it done.
3. Key the music row on `media_player.ninos_room == playing`, not on the flag. `_manual_start` only sets the flag inside its time window.
4. Name new files `quick_action_*`, and add a test that package basenames are unique.
5. Add a test that fails on any `!secret` under `dashboards/` other than the two allowed keys.
6. The music row's "start" case needs Nino's bed occupied, written in the sensor itself.
7. The room-row test covers `not_home`, `unknown` and `unavailable` as giving no row.
8. The kid-home sensor stays a live `now()` template on purpose, not trigger-based.
9. Wrap the ⚡ and bell chips in one nested stack, then check on the live DOM.
10. An unavailable lamp hides its row, on purpose, with a test for it.
