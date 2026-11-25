# jk-82-doorbell-message — 2026-11-24

**Metrics:** 1 build pass, full suite 2410 passed, 9 skipped (was 2369 before the new tests). Reviewer pass noted in the PR. Shipped as a PR; the live test write is a post-deploy step.

**What shipped:**
- `sensor.doorbell_message` resolves the doorbell text: Away/Vacation/Bedtime, Quiet, entertainment, holiday dates, then morning/evening by the sun, else Welcome. Max 30 characters.
- `doorbell_message_apply` writes `text.front_door_camera_doorbell` only when it differs, on resolver change, start, reload, a 30 s drift, and every 30 minutes.
- Removed `house_mode_doorbell_text` (it wrote the select).

**Learnings:**
- The Protect select sends the NVR default reset time, so its messages revert 8 to 15 minutes later. The text entity sends none. Proven by history; the no-expiry claim for the text entity needs the post-deploy test.
- Protect caps custom text at 30 characters; HA's 255 is misleading.
- The resolver never selects `Entertainment`, so use `input_boolean.entertainment_mode`.

**Follow-ups (BACKLOG):**
- Clear the registry ghost of the old automation after deploy.
- Easter and other holidays were left out of v1.
