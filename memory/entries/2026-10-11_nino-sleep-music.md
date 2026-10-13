# 2026-10-11 — nino-sleep-music

Bedtime playlist in Nino's room (`packages/ninos_room/media/nino_sleep_music_*`),
PR #19, plus a Sleep Music toggle in his settings popup (6213b4d, pushed
straight to master — skipped review, wrapped retroactively). Reviewer: ITERATE,
one DEFECT fixed before merge.

## Notes

- A "this automation started it" flag needs its own clear path. The reviewer
  caught that only the off automation cleared it, so a manual stop latched it
  and the next morning's stop would pause someone else's music.
  `nino_sleep_music_flag_clear` drops it once the speaker is stopped 1 min.
- Gate on `not playing`, not `idle`: the morning stop leaves the Sonos
  `paused`, and a return to bed must restart the playlist.
- Lamp "below 20%" must check `is_state(..., 'on')` first; `brightness | int(0)`
  turns an unavailable lamp into 0 and passes.
- Dashboard IDs: new automations register as `automation.<slug(alias)>`
  (`nino_s_bedroom_sleep_music_on`), but the older toggles beside it keep
  first-registration IDs that match neither alias nor id — read the live
  registry, don't infer.
