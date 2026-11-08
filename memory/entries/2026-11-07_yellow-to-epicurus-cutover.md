# 2026-11-07 · HA Yellow → epicurus cutover

## What happened
- **Shadow restore, then cold cutover, in one day.** The 11:24Z automatic backup was restored onto epicurus, which was pinned to 2026.7.4. It ran in shadow mode with 75+ entries held and every automation off, while a state diff against the Yellow came back clean. Then the Yellow was powered off at 23:02Z, the held entries were re-enabled in order, helpers and automations were synced from a Yellow snapshot, and `hassio.kohbo.com` was repointed. The plan and the cutover log are in the homelab repo, `plans/ha-yellow-cutover/`.
- **Repo PRs:** #140 (the Yellow's uncommitted UI edit), #141 (removed `auth_header` and untracked the go2rtc creds), #142 (epicurus is the default deploy target; nmap is out of the Bayesian sensors), #143 (real-deploy test), #144 (gitignore `backups/`).
- **The security gate found two live exposures on the Yellow.**
  - `auth_header` trusted `X-authentik-username` from all of 192.168.1.0/24, so any LAN device could log in as admin with no password.
  - The `webrtc` component's go2rtc password was public in git.

  Both are fixed. `trusted_proxies` is now Pi Caddy only.

## Learnings
- **`initial_state: on` defeats a `.storage` automation disable.** 333 files set it, including `front_door_auto_lock`. For a shadow instance, rewrite `initial_state` to `off` in the working tree AND set every `automation.*` to `off` in `core.restore_state`. Then gate on zero automations on before anything else.
- **A restored second HA rotates production's cloud tokens.** Vivint broke on the Yellow because epicurus refreshed its copy of the token. Hold `vivint`, `ecobee`, `spotify`, `withings`, `winix`, `nest` (shared Pub/Sub) and `alexa_media` until the old host is off.
- **Alarmo restores its own stored arm state, not the snapshot's.** It came up `armed_home` from the 05:24 backup. Check and disarm it before enabling Noonlight.
- **Helpers freeze at backup time.** Sync input_*/counter from the old host's last snapshot before turning automations on. A stale `dark_outside` made a reload flash the exterior lights.
- **HAOS→Docker leftovers.** Point the Matter entry at the container URL and set `use_addon: false`, with HA stopped; otherwise it crashes looking for the Supervisor. `internal_url` held the old IP, which TTS media URLs use. `.storage/esphome.dashboard` held the add-on port.
- **`check_config` run standalone reports ZHA device triggers as "no config entry"**, because ZHA isn't loaded in that check. It's an artifact, not an error.
- **`vivint` 2025.8.4 does not run on core 2026.7.4.** The October upgrade report was wrong about that.

## Follow-ups
JK-1236–JK-1244 (re-auth, Zigbee recheck plus LQI, ESPHome keys in the repo, go2rtc history, cleanup, departure debounce, the Matter Thread sensor, the core upgrade). HMLB-29–HMLB-32 (decommission on 11-14, ha-postgres bind, credential rotation, homelab close-out).
