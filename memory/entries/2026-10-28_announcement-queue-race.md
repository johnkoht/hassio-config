# Announcement queue dropped mid-playback appends (#69)

**What:** `processor.yaml` now trims the queue after `script.announcement_engine` returns, re-reading the live queue and removing only the played message (matched on speech_message/sound_file/expires_at).

**Why:** it used to trim a snapshot taken before playback and publish it afterwards, overwriting anything `append.yaml` queued meanwhile. The morning brief was silently lost on school days because it landed during the breakfast reminder scheduled for the same minute; it only "worked" when a kitchen-occupancy wait delayed it.

**Learning:** "announcement didn't play" with no errors and a script that ran to completion → suspect the queue, not the caller. Check the `Announcement Queue - Append` log line, then whether the engine ever ran for that item. My first guess (the morning brief's kitchen-occupancy wait) was wrong; the logs settled it in one pass. Residual ms-level race remains (two writers on one retained topic); a single writer would close it.
