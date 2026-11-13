# Home Assistant Upgrade Report — 2026.7.4 → 2026.9.4

**Date:** 2026-10-14; host sections refreshed 2026-11-12 for the move to epicurus
**Host:** epicurus (Docker VM; image pinned in `/root/homeassistant/docker-compose.yml`). The Yellow/HAOS is retired.
**Generated with:** `.claude/skills/ha-upgrade-check`

> The release research below (breaking changes, dependency floors, HACS minimums) is from 2026-10-14 and was **not re-run**. Only the host-specific parts were rewritten for Docker. Re-run the skill before acting if a newer patch is out.

## Current state

| Component | Installed | Available |
|---|---|---|
| Core | 2026.7.4 | 2026.9.4 (latest 9.x, 2026-09-27) · 2026.10.1 (2026-10-10) |
| Python (in image) | 3.14.6 | — |
| Recorder DB | 3.0 GB SQLite on the host | — |
| Backups | HA automatic backups daily at 04:30 into `config/backups` | — |
| Sibling containers | esphome 2026.10.1, matter-server (matterjs) 1.3.3, postgres 16 | pinned separately in the same compose file |

## Verdict

**Target 2026.9.4.** It has no DB migration (schema 53 since 7.4), no Python change (3.14.2), and needs no Z-Wave JS UI bump (schema 49 floor; external Z-Wave JS UI 11.22.0 = schema 50). Do not stop on 9.0, which has a RAM-spike/reboot-loop bug fixed in 9.1. Two config changes break silently, and one HACS integration fails to load unless it is updated first.

Waiting for 10.2+ is reasonable. 10.x adds no YAML breakage for this config, only open regressions: UniFi Network setup, ZHA network-bridged coordinator stalls, and an MQTT-select crash/rollback.

---

## Blocker 0 — none on the host

The old Blocker 0 (Supervisor could not see HAOS, so OS updates were blocked) went away with the Yellow. On epicurus there is no Supervisor or HAOS: Core is a container image, and an upgrade is a compose image-tag bump. The HAOS 18.3 Bluetooth fix no longer applies, so re-test Bermuda room jumping on the new host instead of assuming the cause.

---

## Blockers — do before upgrading Core

### 1. `llama_conversation` (home-llm) 0.4.12: done on epicurus (2026-11-12)
0.4.10 **failed to load on 2026.9**: core replaced voluptuous with probatio (home-llm #393/#395). 0.4.12 needs 2026.5+ and is installed on 7.4, so this blocker is cleared.

### 2. `vivint` 2025.8.1 → 2025.8.4
2025.8.1's update platform hard-fails on 2026.9 (`via_device`, ha-vivint #218). **Not safe on 7.4** (tested on epicurus 2026-11-07): 2025.8.4 calls `device_registry.async_get_device_id_by_identifier`, which 7.4 lacks, so every platform fails. Keep 2025.8.1 on 7.4 and update it in the same window as the core upgrade.

### 3. UniFi Protect detection automations lose `event_id` (2026.8, core PR #174948)
Detection binary sensors no longer carry `event_id`/`event_score`. That metadata moves to new per-camera **Motion / Smart detection / Sound detection event entities**. **17 files** in `packages/security/cameras/detections/*/` build `/api/unifiprotect/thumbnail/{nvr}/{event_id}` from `trigger.to_state.attributes.event_id`. Alerts will still fire, but the push-notification thumbnail URL breaks; local snapshots from `proxy_camera` keep working.

- The new event entities only exist after the upgrade, so **fix this right after Core is up**: read the new `event.*` entity IDs from the registry, then switch the 17 automations to them (or trigger on the event entity). Do not guess the entity IDs ahead of time.
- Upside: the same PR moves detection to the public API to fix unreliable detections on Protect 7.x (#172164), which may be the 09-08 "event-linked fields freeze".
- NVR firmware 7.2.105 meets both minimums (7.1 in 2026.8, 7.2.105 in 2026.9).

### 4. Vacuum `battery_level` attribute removed (2026.8, xiaomi_miio)
`vacuum.main_floor_vacuum` is `xiaomi_miio`. Three uses in `dashboards/kohbo/rooms/main_floor/vacuum.yaml` (~L242–249) go blank. There's no battery sensor today, so after the upgrade find the new battery sensor entity and point the card at it. (`popup/footer/vacuum.yaml` is unreferenced legacy code.)

## Do before Core (safe, recommended)

| Item | Action |
|---|---|
| alexa_media 5.15.7 | → 5.16.2 (fixes 2026.9 `via_device` warning + KidsSensor crash) |
| variable 3.5.7 | → 3.5.17 (device-registry deprecation fixes) |
| frigate, alarmo, adaptive_lighting, winix, choreops, pirateweather, scene_presets, watersmart | minor bumps, all compatible with 7.4 |
| **browser_mod 3.2.0** | **Do NOT take 3.3.0** (requires 2026.10). On 9.x, 3.2.3 at most |
| `matter-server` container (matterjs 1.3.3) | Separate image pin in the compose file. Check the Matter client version the target core ships against the server's supported schema before bumping Core; bump the container on its own |
| `auth_header` | Repo archived; on-disk version 1.4 vs HACS v1.12 suggests a stale install. Note it; it rides on the `http:` migration below |
| **VM snapshot** | `qm snapshot <VMID> pre-<version>` on the Proxmox host (`<VMID>` is epicurus), run by John. **Rollback after 2026.8 means going back to this snapshot**: the device registry can't be downgraded. Also confirm last night's automatic backup in `config/backups`, and copy the compose file to `docker-compose.yml.bak-pre-<version>-<date>` |

## Behavior changes to watch after upgrade

1. **`http:` YAML is auto-moved into the UI (2026.8).** `configuration.yaml:130` sets `use_x_forwarded_for` + `trusted_proxies` + CORS. Confirm remote access and `auth_header` still work. There are community reports of proxy breakage through 8.3.
2. **Devices split per integration (2026.8).** There are 64 `device_id:` references, mostly ZHA plus 15 in `automations.yaml`. ZHA, Nest, ESPHome and Z-Wave JS were migrated upstream; Sonos device IDs reportedly changed. Check Repairs and run `ha core check`.
3. **LLM tool names gain a domain prefix (2026.9)** (`intent__HassTurnOn`). Voice/LLM agents on home-llm may need a prompt or model tweak. Unverified.
4. **card-mod 4.2.1 is abandoned.** On 2026.9, *all* card-mod styling dies when the active theme defines `card-mod-*-yaml` (card-mod #606/#617). `kohbo` is clean; `rounded` and `minimalist-*` aren't. Make sure no wall tablet or phone has one of those selected. Longer-term replacement: UIX (drop-in).
5. **High CPU with camera streams** (core #178556, open since 8.x, reportedly eased in 10.0). This repo has 5 proxy cameras. Watch epicurus' CPU (`sensor.system_monitor_processor_use`).
6. **ZHA motion entities sticking "on"** (core #183366, open). Watch occupancy-driven lights.
7. **Aeotec ZW096 power reporting** stops with Z-Wave JS driver ≥ 1.8.0 (#184346). That's a Z-Wave JS UI concern, not core: don't bump Z-Wave JS UI at the same time.
8. **Bermuda 0.8.7** (latest) logs a `device_registry.devices` deprecation warning (it stops working in 2027.9). Open #817: per-proxy distance sensors stop on 8.x.
9. **Private BLE Device config flow now requires the IRK (9.3).** Relevant to the remaining Bermuda enrollments.
10. **Nest** `supported_features` recomputed live (9.2) and `turn_on` made idempotent (9.3). Re-check the PR #22 Eco behavior.

## Prep for 2026.10.x later (no action now)

- State conditions combining `for:` with `attribute:`/state lists now fail check. Repo is clean (44 `for:` conditions, none in that form).
- `mqtt.publish` called by a non-admin user from the UI now needs admin (8 calls in `packages/announcements/`, all from automations/scripts). Low risk.
- Legacy auth removed; usernames are lowercased. Check Repairs.
- browser_mod → 3.3.0 *after* 10.x core.
- Deprecation runway: command_line shell-templated commands (2027.4, not used), `reload_config_entry` with `target` (2027.4, not used), custom-component device-registry APIs (2027.8–2027.10: pirateweather, choreops, bermuda have open issues). `RestoreStateData.last_states` is removed in **2026.11**, so watch custom components then.

## Recommended sequence

1. HACS "before core" bumps that are safe on 7.4: alexa_media, variable, the minor bumps. Not browser_mod 3.3, and vivint 2025.8.4 only together with the core bump (it breaks on 7.4). Restart and confirm clean on 7.4.
2. Bump the `matter-server` image separately if the target core needs it, and let it settle.
3. Snapshot the VM (`qm snapshot <VMID> pre-2026.9.4` on the Proxmox host) and copy the compose file to `docker-compose.yml.bak-pre-2026.9.4-<date>`. Confirm the 04:30 automatic backup exists.
4. **Core → 2026.9.4** directly: edit the `homeassistant` image line to the exact tag, then `docker compose pull homeassistant && docker compose up -d homeassistant` (John; a bare `docker restart` keeps the old image). The first start migrates nothing (no schema bump), but watch `docker logs -f homeassistant`.
5. HACS "after core" bumps (vivint 2025.8.4). Re-check Frigate MQTT birth (`frigate/available`) and clear any ZHA occupancy entities restored `on`.
6. Fix the 17 Protect detection automations + the vacuum battery card (needs the new entity IDs).
7. Verify: Z-Wave (Aeotec power; Z-Wave JS UI is on hermes, leave it alone), ZHA (Inovelli VZM31 bindings, motion), Bermuda/BLE, Protect detections + thumbnails, Alexa, home-llm/voice, remote access/auth_header, Nest Eco, CPU load.
8. Rollback if needed: `qm rollback <VMID> pre-2026.9.4`, then restore the compose backup.

## Sources

- 2026.8: https://www.home-assistant.io/blog/2026/08/05/release-20268/ · core PR #174948 · issue #178556
- 2026.9: https://www.home-assistant.io/blog/2026/09/02/release-20269/ · patches 9.1–9.4 · issues #181120, #183366, #184346
- 2026.10: https://www.home-assistant.io/blog/2026/10/07/release-202610/ · issues #184873, #185517, #185571
- HACS: home-llm #393/#395, ha-vivint #218, alexa_media #3551, browser_mod releases, lovelace-card-mod #606/#617, bermuda #817/#820
- Version pins: core `zwave_js`/`matter` manifests, `recorder/db_schema.py`, `const.py` at each tag; https://version.home-assistant.io/stable.json
