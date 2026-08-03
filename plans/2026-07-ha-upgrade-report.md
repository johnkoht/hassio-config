# Home Assistant Upgrade Report — 2026.4.3 → 2026.7.4

**Status update (2026-08-02):**
- ✅ **Blocker 1 DONE** — all 73 legacy template files migrated to modern `template:` syntax (77 entities). Entity IDs preserved via `default_entity_id` + `unique_id`. The 15 files that lived in the merged `sensors/`/`binary_sensors/` dirs were relocated into their room/person packages (each room's `occupancy/` subfolder, each person's `sleep/` subfolder; gazebo → new `packages/gazebo/`, sun_elevation → `packages/weather/`) — no top-level `template/` dir; nothing added to configuration.yaml. Validated with `hass --script check_config` under both 2026.4.3 and 2026.7.4: zero template errors, error set identical to pre-migration baseline. NOTE: on 2026.7.4 the legacy syntax does NOT hard-fail — it silently creates zero entities + a Repairs issue, so this migration prevented a silent wipe of all 77 entities. Awaiting review/merge of PR #6 + deploy.
- ✅ **Blocker 2 DONE** — external Z-Wave JS UI upgraded to 11.22.0 (≥11.19.1 required).
- ⏳ **Blocker 3** — HACS updates being done in UI (bermuda ≥0.8.7, alexa_media ≥5.15.6, variable ≥3.5.7, home-llm 0.4.10, frigate 5.15.4, alarmo 1.10.18, adaptive_lighting 1.31.0; browser_mod 3.x only AFTER core).
- ✅ **Item 4 resolved** — extended_openai_conversation + rag_openai_conversation have NO config entries and no YAML references (orphaned folders); uninstall both via HACS. Pipelines use core openai_conversation/ollama.
- ✅ **Add-on errors resolved** — ESPHome Device Builder was a stale crash; started cleanly. Core Terminal & SSH left stopped (redundant with Advanced SSH & Web Terminal; would port-conflict) — can be uninstalled.
- 🐛 **Pre-existing bugs found during migration (not fixed, out of scope):** (1) `upstairs_dryer_running`, `main_level_dryer_running`, `main_level_washer_running` templates reference `states.<name>_status.state` without the `sensor.` domain — likely always false; (2) leak_monitoring alert references nonexistent `binary_sensor.flood_while_away` (sensor is `leak_while_away`); (3) `packages/people/nonna/nonna_ble_device_tracker.yaml` fails config check (missing `platform` key, null mac).

**Date:** 2026-07-30
**Device:** Home Assistant Yellow (CM4, aarch64, Samsung 970 EVO Plus NVMe)

## Current state

| Component | Current | Available |
|---|---|---|
| Core | 2026.4.3 | 2026.7.4 |
| HAOS | 17.2 | 18.1 (18.2 released 2026-07-30) |
| Backups | Daily to NAS, latest 2026-07-30 09:58 UTC | — |
| Disk | 347 GB free of 457 GB | — |

Add-ons in `error` state before any upgrade: **Terminal & SSH** (core_ssh — redundant; Advanced SSH & Web Terminal is the one running) and **ESPHome Device Builder**. Investigate/restart these first so post-upgrade triage isn't muddied.

## Verdict

The upgrade is safe **but not click-and-go**. One hard config migration (legacy template entities), one external dependency (Z-Wave JS UI server), and a batch of HACS updates must land before core moves. 2026.5 is clean for this install; 2026.6 and 2026.7 each have items that directly affect this config.

---

## Blockers — must be done BEFORE upgrading core

### 1. Migrate 75 legacy `platform: template` files (2026.6 removes the syntax)

The pre-2021 template entity syntax (`- platform: template` + `sensors:`/`switches:` dict) is **removed in 2026.6** — those entities fail to load. Verified count in this repo: **75 files** (Bayesian observations and old-style automation triggers excluded — those are different schemas and unaffected). Heaviest dirs: `sensors/rooms/` (11), `packages/people/john/do_not_disturb/sensors/` (5), `packages/house/bedtime_mode/` (4), plus feels-like-temperature files across room packages, laundry, leak monitoring, announcements.

Migrate to modern `template:` syntax, then validate with `./deploy.sh --check` after bumping `.HA_VERSION` to `2026.7.4` so the Docker config check runs against the target image.

### 2. Upgrade the external Z-Wave JS UI server at `ws://10.0.10.80:3000`

- 2026.6 requires server API schema 47; **2026.7 requires zwave-js-server ≥ 3.9.0 (schema 49)** — Z-Wave JS UI ≥ 11.19.1.
- The active config entry points at an external Z-Wave JS UI instance (not the HA add-on). **835 Z-Wave entities** ride on this. If the server isn't updated first, the integration fails with "Invalid server version" after the core upgrade.

### 3. Update HACS components (all safe on 2026.4, so do them now)

| Component | Installed | Needed | Why |
|---|---|---|---|
| bermuda | 0.8.5 | **≥ 0.8.7** | 0.8.7 fixes device_tracker updates for 2026.7 — your room presence depends on this |
| alexa_media | 5.15.0 | **≥ 5.15.6** | 2026.7 hard-requires 5.15.5+ (blocking-call fix + alexapy 1.29.25) |
| variable | 3.5.5 | **≥ 3.5.6** (3.5.7 latest) | 3.5.6 fixes `tojson` wrapper-type breakage on 2026.x |
| llama_conversation | 0.4.7 | ≥ 0.4.9 (0.4.10 latest) | Relaxed dep pins to avoid conflicts with HA internals |
| frigate | 5.15.2 | 5.15.4 | 5.15.3+ required for HA ≥ 2026.3 go2rtc proxy change |
| alarmo | 1.10.16 | 1.10.18 | Frontend fixes for 2026.5 UI |
| adaptive_lighting | 1.30.1 | 1.31.0 | Latest; one unconfirmed "not loaded on 2026.7.4" forum report (looks like an install issue, not API) — keep current and watch logs |
| **browser_mod** | 2.10.2 | **3.1.0+/3.2.0 — AFTER core** | 3.1.0 requires HA 2026.7 (config-panel top bar); upgrading it early breaks it on 2026.4 |

### 4. Risk flag: `extended_openai_conversation` 2.0.0

Lightly maintained; open unresolved issue where setup fails on HA 2026.x due to an `openai~=2.15.0` pin conflicting with HA's bundled openai. No confirmed-working version for 2026.7. Test after upgrade; have a fallback conversation agent ready (core `openai_conversation` and `ollama` are both configured).

---

## Verified NON-issues

- **Konnected removal (2026.6)** — both config entries are `source: ignore` (discovered-then-dismissed), **zero Konnected entities** in the registry. No impact.
- **2026.5 breaking changes** — repo greps clean for all six (no purpose-specific person/tracker triggers, no `hassio.*` actions, no YAML webhook `local_only`).
- **No recorder/database schema migration and no Python bump** flagged in any of the three releases.
- Purpose-specific trigger renames (2026.7) — repo uses classic `trigger: state` everywhere; classic syntax is explicitly not deprecated.

## Behavior changes to watch after upgrade

1. **Bluetooth scanning defaults to "Auto" (2026.6)** — core adapter and ESPHome BLE proxies auto-migrate from Active to Auto. If Bermuda room presence gets laggy or loses RSSI cadence, set affected proxies (ESPHome device options) or the Yellow adapter back to **Active**.
2. **Person/zone semantics rework (2026.7)** —
   - Persons located by scanner trackers (nmap, iphonedetect, unifi) no longer expose lat/long; zone membership comes from the new `in_zones` attribute. Repo greps found **no** templates reading person coordinates or `zone.home` person counts, so low risk.
   - Known bug: trackers updated via `device_tracker.see` don't populate `in_zones` (fix lands 2026.7.5/2026.8). **Katia and Nonna presence uses `device_tracker.see`** — their person states (home/not_home) still work, but they won't count toward `zone.*` person counts until the fix. No repo automation appears to depend on zone counts.
3. **Yellow + Hue rollback report (unresolved)** — one Yellow/CM4 user's 2026.7.x update rolls back due to a Hue `TypeError` at startup. If the update rolls back, check core logs for Hue color-temp errors before retrying.
4. Template engine is ~40% faster and traces now include template errors — expect new (useful) noise in traces.
5. Logbook is rebuilt as an activity timeline; ZHA device page is a new full-page UI; "Update all" button appears.

## HAOS 17.2 → 18.x

- Kernel 6.12 → 6.18, Docker 29.5.3. 18.0 was pulled from stable (Pi 5/old-bootloader issue); **18.1 fixes it** and 18.2 is out as of today.
- **Yellow/CM4-specific:** the new RPi firmware-update mechanism does not apply to CM4 (known cosmetic `unsupported_boot_device` report); the CM5 firmware-first warning does **not** apply. No NVMe regressions reported. Multiple smooth headless upgrades reported.
- Do it **after** core (community-standard order); it reboots the host.

## Recommended sequence

1. Fix/clear the two error-state add-ons (esp. anything SSH — deploys depend on it).
2. Migrate the 75 legacy template files; bump `.HA_VERSION` → validate via `./deploy.sh --check` against the 2026.7.4 image.
3. Update HACS components (everything except browser_mod), restart, confirm clean on 2026.4.3.
4. Upgrade Z-Wave JS UI at 10.0.10.80 to ≥ 11.19.1.
5. Fresh full backup (auto-backup-on-update also applies), confirm it landed on NAS.
6. **Core → 2026.7.4** directly (never .0/.1 — cffi breakage broke Google/Roborock/custom integrations, fixed in .2). Cautious alternative: step through 2026.6.4 for a day first, then 2026.7.4.
7. Update browser_mod → 3.2.0.
8. Verify: Z-Wave (835 entities), Bermuda/BLE room presence, Alexa media, Katia/Nonna presence, Frigate, conversation agents.
9. **HAOS → 18.1/18.2** last.
10. Watch for a week: Bermuda quality (Active-scan fallback), extended_openai_conversation load status, Hue.

## Sources

- 2026.5: https://www.home-assistant.io/blog/2026/05/06/release-20265/
- 2026.6: https://www.home-assistant.io/blog/2026/06/03/release-20266/
- 2026.7: https://www.home-assistant.io/blog/2026/07/01/release-20267/
- HAOS 18.0/18.1: https://github.com/home-assistant/operating-system/releases
- cffi regression: https://community.home-assistant.io/t/cffi-errors-after-updating-to-2026-7-1/1016507
- `device_tracker.see` / in_zones bug: https://github.com/home-assistant/core/issues/175376
- Yellow+Hue rollback: https://community.home-assistant.io/t/home-assistant-core-2026-7-x-update-issue-on-ha-yellow/1018566
- HACS component releases: respective GitHub repos (alexa_media #3503, bermuda 0.8.7, browser_mod 3.1.0, hass-variables 3.5.6, home-llm 0.4.9)
