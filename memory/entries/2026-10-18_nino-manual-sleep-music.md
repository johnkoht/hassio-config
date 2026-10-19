# Nino sleep music: flag manual starts (#58)

**What:** `nino_sleep_music_manual_start` turns on `input_boolean.nino_sleep_music_playing` when `media_player.ninos_room` has been playing for 1 min, 19:00–07:00, house occupied.

**Why:** the flag was only set by `nino_sleep_music_on`, so music started by hand never got the "stop when he gets up" behaviour and played all night.

**Learning:** when an "ownership" flag means "only stop what we started", ask whether a manual start of the same thing should count too. Here it should. The off automation fires only on a bed `to: "off"` transition, so flagging evening music when he's not in bed is harmless.
