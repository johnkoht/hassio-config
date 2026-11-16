---
title: Encrypt the ESPHome Native API on the Remaining Devices
slug: esphome-api-encryption
status: draft
created: 2026-11-15
has_pre_mortem: false
has_review: false
has_prd: false
linear: [JK-1249]
depends_on: [JK-1245]
---

# Encrypt the ESPHome Native API on the Remaining Devices

## Problem

JK-1249: 21 ESPHome devices in the house accept the native API with no encryption (two more, ZWA-2 and HA Voice, are held and out of scope). Anyone on the LAN can read their state and call their services: bed occupancy, presence, garage doors, the alarm panels. The ticket says "about 17"; the live count is 21 once the Konnected panels (2), ratgdo units (3) and Screek sensors (2) are counted individually.

Done when no ESPHome device on the LAN accepts an unencrypted API connection, except explicitly held ones.

## Findings (read-only, 2026-11-15)

Sources: the HA `core.config_entries` file on epicurus (whether each ESPHome entry stores a `noise_psk`), plus an unauthenticated `device_info` call from the builder container to each unencrypted entry's stored host. The probe prints names and firmware facts only. Hosts, MACs and keys never leave the remote shell.

**Counts: 32 ESPHome entries in HA. 23 unencrypted, 9 encrypted.**

Encrypted (9): Kitchen, Playroom, Main Bedroom West and Office (offline) Apollos; the Foyer proxy; the main bed sensor; the Nino bed sensor; plus 2 dead entries (the old "Nino's Bed" and the retired "aceb64" proxy). JK-1245 owns all 9 (it rotates keys on the live ones and deletes the dead ones). **This plan does not touch them.**

Unencrypted (23), grouped by how they would be encrypted:

| Group | Devices | Firmware seen by the probe | Probe result |
|---|---|---|---|
| Stock BLE proxies (12) | Basement Hub, Basement Main, Family Room 2, Office, Kitchen 2, Main Bedroom Bedside, Jr. Suite, Nino's Bedroom, Gazebo, Garage, Playroom, Main Bathroom | `esphome.bluetooth-proxy`; 10 on ESPHome 2026.5.1 (`esp32dev`), Main Bathroom and Playroom on 2026.7.4 (`esp32`) | all 12 accept plain |
| Bed sensor (1) | Gianluca's bed sensor | `esphome.web` dev firmware, ESPHome 2025.6.1. Its YAML already exists in the repo, misnamed `jr-suite-bed.yaml` (node `esphome-gianluca-bed-sensor`) | accepts plain |
| Apollo (1) | Main Bathroom MSR-2 | `ApolloAutomation.MSR-2_Factory` 25.8.6.1 on ESPHome 2025.7.5 | accepts plain |
| Screek L12 presence (2) | two units | `Screek.Human_Presence_Sensor` L12 on ESPHome 2024.7.3 (ESP32-C3) | one accepts plain; **the other refused the connection** (offline, or its API is closed) |
| ratgdo (3) | Garage Doors 1, 2, 3 | `ratgdo.esphome` 2.5i on ESPHome 2024.6.2, **ESP8266** (`d1_mini`) | all 3 accept plain |
| Konnected (2) | Alarm Panel Pro 1, 2 | `konnected.alarm-panel-pro-ethernet` 1.2.2 on ESPHome 2025.12.0 | both accept plain |
| **Held** (2) | ZWA-2 (serves zwave-js on hermes, **never adopt**); HA Voice (held by John) | n/a | ZWA-2 accepts plain; Voice refused the connection. Both stay as they are. |

**In scope: 21 devices.** 19 are confirmed to accept plain today; the second Screek is unreachable and needs a look before it is planned.

Other facts that shape the plan:

- **None of the 21 has a YAML in the builder today.** The only exception is Gianluca's bed sensor, whose YAML sits in the repo under the wrong name and isn't proven to match what's flashed. The three stale proxy YAMLs from JK-1239 (Gazebo, Jr. Suite, Nino's Bedroom) belong to devices that now run stock firmware with no key (JK-1245's findings), so they are replaced by this plan.
- **Stock proxies are adoptable.** `esphome.bluetooth-proxy` ships a `dashboard_import`, so the builder can adopt them. **Adoption writes a key and an OTA password inline into the YAML.** Both must be moved to `!secret` before anything is committed, or `tests/test_esphome_no_inline_secrets.py` and gitleaks stop it. This is a hand step the plan names explicitly.
- **Adopting compiles the current upstream package** (`@main`), and the live proxies run 2026.5.1 or 2026.7.4. The jump to the builder's 2026.10.1 changes firmware. Pin the package `ref:` to a commit SHA, as JK-1245 Phase 2 does for the Apollos.
- **The OTA path is also open.** The stock proxies were flashed without an OTA password, so anyone on the LAN can push firmware to them. Encrypting the API doesn't close that. See Open Questions.
- **ratgdo, Konnected and Screek are vendor firmware.** Whether each accepts a user-supplied `api: encryption: key:` (or has a published YAML to start from) is **unverified**. It is a decision gate in its batch, not an assumption.
- **The ratgdo units are ESP8266.** Encrypted API costs RAM there, and the jump from 2024.6.2 to 2026.10.1 is large. Verify with a compile before any upload.

## Dependency on JK-1245

JK-1245 (plan in progress, John doing the builder installs) proves the loop this plan reuses: the builder CLI flash, the secrets helper (`bin/esphome_rotate_secret.py`), the HA re-key helper (`bin/esphome_rekey_ha.py`) and the health check. **Nothing in this plan flashes until JK-1245 Phase 1 is done and reports that the loop works** (re-key script correct, UI fallback understood, the health check passes for a BLE proxy, the Foyer proxy in particular).

**One thing JK-1245 does not prove.** JK-1245 changes the key on devices that are already encrypted: HA's reauth flow fires because the stored key stops working. Here the entry has **no key** and the device starts demanding one. HA should still raise a reauth flow on the "requires encryption" error, but that path is untested here. The pilot (batch 1) is the test, with the UI fallback (Settings, Devices & services, the ESPHome card needing attention, paste the key).

JK-1245 Phase 2 (pinned-firmware Apollos) is a dependency for exactly one device: the Main Bathroom Apollo (batch 6) reuses its pin-and-diff approach.

## Per-device flow (the loop)

Rule: **one device mid-change at a time.** Order matters because the moment the device reboots with a key, HA's saved (empty) key stops working. HA's connection stays down until step 7.

1. **Generate the key.** The helper adds `<name>_api_key` (base64 of 32 random bytes) to the builder's `secrets.yaml` on epicurus and prints names only. The repo copy `esphome/secrets.yaml` is gitignored and refreshed by `scp` afterwards. The repo never sees a value.
2. **YAML.** Add `api: encryption: key: !secret <name>_api_key`. For adopted devices, replace the inline key and OTA password that adoption wrote with `!secret` references. Keep the node name unchanged (see Open Questions on renaming).
3. **Validate before touching the device.** `docker exec esphome esphome config /config/<file>.yaml >/dev/null` (its output renders secrets, so discard it), then `esphome compile`. A compile failure costs nothing.
4. **Pre-flash snapshot.** Record `sensor.bermuda_global_active_proxy_count`, the state of `lock.front_door`, and for non-proxies the device's entity list and states.
5. **Upload.** From the builder, Install, Wirelessly (or `esphome upload --device <node>.local`). OTA writes to the inactive partition and switches only on success. **If it fails, the device keeps its old unencrypted firmware, HA never noticed, and the loop restarts at step 3.**
6. **Prove the key before HA.** A read-only `device_info` call with the new key (helper from the builder container, key via stdin, output names only) confirms the device is up, encrypted, and the same device (name matches). A plain call must now be refused.
7. **Re-key HA.** `bin/esphome_rekey_ha.py` continues the reauth flow (`reauth_confirm`, `noise_psk`), or starts a reconfigure flow if no reauth is open. UI fallback if it doesn't match.
8. **Health check.** Entry `loaded`; the device's entities are available and the snapshot matches; Bermuda count is back to its pre-flash value; the Level lock isn't `unavailable`; person room-presence sensors updated since the flash. For bed sensors, a sit test.

**If something breaks:**

- *Device up but HA can't connect:* the key from step 6 already worked, so the fault is the HA entry. Re-run step 7, or paste the key in the UI.
- *Device never comes back after the upload:* wait for the device's own Wi-Fi retry, then check mDNS and the router. Nothing was changed on HA, so only this device is affected. ESPHome safe mode and the fallback AP exist; otherwise serial or USB with **John at the device**.
- *Encryption broke something and we want out:* revert the YAML change, compile, and OTA it. The OTA port doesn't depend on the API key, so the device can go back to unencrypted without a key.
- *A device can't be encrypted* (vendor firmware, ESP8266 memory): mark it **held** with the reason in the ticket. Don't retry in a loop.

## Batches

Order is least critical first. **Proxies are flashed one at a time with a light check between each** (entry loaded, Bermuda count), and the **full check after each batch**. Don't flash two proxies that cover the same room back to back.

| # | Batch | Devices | Why here | Check after the batch |
|---|---|---|---|---|
| 0 | Gate | JK-1245 Phase 1 reported working; builder image and healthcheck known | The loop is proven | n/a |
| 1 | **Pilot proxy** | One stock proxy in the least-used area (suggest Basement Hub; John confirms from the Bermuda coverage map) | Proves the plain-to-encrypted path (see Dependency) | Full check; John reads the diff of the committed YAML |
| 2 | Proxies, living areas | Basement Main, Family Room 2, Office, Kitchen 2 | Overlapping coverage; room-presence has neighbours | Full check; presence sensors for each room |
| 3 | Proxies, outdoors and utility | Gazebo, Garage, Playroom, Main Bathroom | Outliers; Garage matters for arrival logic, so someone home | Full check |
| 4 | Proxies, bedrooms | Jr. Suite, Nino's Bedroom, Main Bedroom Bedside | Sleep and bedtime automations read these; daytime only, nobody in bed | Full check; confirm bed presence unaffected |
| 5 | Bed sensor | Gianluca's bed sensor | After the proxies. JK-1245 already proved the bed-sensor loop on two others. Daytime sit test | Occupied/vacated sit test; bedtime and sleep helpers unchanged |
| 6 | Presence | Main Bathroom Apollo (pinned ref, entity diff, as JK-1245 Phase 2); both Screek units | Presence sensors drive lights. After Phase 2 of JK-1245. **Gate:** Screek firmware must accept a key; the unreachable unit is found first | Entity diff; lights react in each room |
| 7 | **Garage doors** | ratgdo 1, 2, 3, one at a time | Physical access. **Gate:** compile with encryption on ESP8266 first. Doors closed, someone home, no door moving | Each door's state, open/close command (John operates it), `garage-evening-autolock` inputs unchanged |
| 8 | **Alarm panels** | Konnected panel 1, then 2 | Safety-critical, last. **Gate:** vendor firmware must accept a user key. Alarm disarmed, John home | Every zone reports; Alarmo disarmed and healthy; John opens a door sensor to confirm |
| 9 | Close-out | The audit script across all entries | Done-when check | Zero plain-accepting entries except the held list |

## What Claude preps and what John does

**Claude (repo only, no devices):**

- This plan, kept updated after each batch.
- YAMLs for each device in a PR per batch, validated against the secret-name guard: the 12 proxies (using the `esphome.bluetooth-proxy` package with a pinned ref), Gianluca's bed sensor (renamed from `jr-suite-bed.yaml`, node unchanged), the Main Bathroom Apollo. YAMLs for ratgdo, Konnected and Screek come after the gate check on each.
- Placeholder entries in `esphome/secrets.fake.yaml` for every new `!secret` name (the test requires them).
- `bin/esphome_api_audit.py` and its test. Reads the ESPHome entries through the host config (host values stay in memory), tries an unauthenticated `device_info` against each, and prints one line per entry: `ENCRYPTED`, `PLAIN` or `UNREACHABLE`, **by name only. It catches exceptions and prints the exception type, never the message, because connection errors embed the address.** Exits non-zero when any non-held entry is `PLAIN`. A constant lists the held names.
- Deleting the three stale proxy YAMLs and their secret names once their devices have new ones.
- Docs: `docs/` device notes and the memory entry for the loop.
- The read-only host work: key generation through the helper, and the audit run. **Host writes (the helper adding secrets to the builder file) wait for John's go.**

**John (by hand):**

- Every flash, from the builder UI or CLI, and every adopt or sit test.
- The decisions in Open Questions.
- Operating the garage doors and alarm sensors for the verification steps.
- Physical access for any serial recovery.
- Approving each batch PR before its flash window.

## Tasks

1. **Wait for the gate.** JK-1245 Phase 1 done and reported. Re-read the helpers it merged.
2. **Prep PR A: audit script and test**, plus `secrets.fake.yaml` placeholders for batches 1 to 4. Run the audit once to record the baseline (expect 19 or 20 plain).
3. **Verify vendor gates (read-only):** can ratgdo, Konnected and Screek firmware take a user key (published YAMLs, vendor docs, a local `esphome config` on a candidate). Record the answer on JK-1249. Find out why the second Screek is unreachable.
4. **Batches 1 to 8 per the table.** Per batch: a small PR with the YAMLs, `config` and `compile` for each, John flashes, the check runs, a one-line update on JK-1249.
5. **Held list.** Anything vendor-blocked is documented as held with the reason, and the audit script's held constant is updated in the same PR.
6. **Close-out.** Full audit, all green except the held list. Delete scratch files and the stale proxy YAMLs, update docs, close JK-1249.

## Risks

- **BLE coverage dips while a proxy reboots**, affecting Bermuda and possibly the Level lock's BLE path. One at a time, light check between, someone home.
- **Plain-to-encrypted re-key path untested.** Pilot first; UI fallback.
- **Adoption writes inline secrets.** The guard test and gitleaks will block a commit; the step is named so it isn't a surprise. Never push before they pass.
- **Upstream `@main` drift on adopted proxies.** Pin the ref to a SHA.
- **ratgdo on ESP8266 runs out of memory or breaks on the ESPHome jump.** Compile first; hold if it doesn't fit. Reboot doesn't affect the door itself, but don't flash while a door moves.
- **Alarm panel reboot while armed raises a false alarm or tamper.** Disarmed, John present.
- **A secret value appearing in a transcript or the repo.** Never `cat` `secrets.yaml` or print `esphome config`; helpers print names only. The probe in this plan's research printed two addresses via a raw error message once; the audit script fixes that by design.
- **Repo is public.** Plans, YAMLs, PR bodies and commits use names only. Node names carry the device's 6-character hostname suffix as existing YAMLs do; see Open Questions.
- **Rollback is possible but needs John at the device if the firmware won't boot.**

## Open Questions for John

1. **OTA passwords.** Stock proxies take firmware pushes from anyone on the LAN. Encrypting the API doesn't close that. Add an OTA password in the same flash (a single flash for passwordless devices), or keep this to the API only?
2. **Node renames.** Live node names include a MAC-derived suffix (for example `esp32-bluetooth-proxy-xxxxxx`), which is then committed in each YAML. Rename each node to its room (HA matches by MAC and keeps entities, per JK-1245's findings), or keep names?
3. **Which proxy for the pilot, and which proxy sits on the Level lock's BLE path?** Needs your coverage map.
4. **If vendor firmware can't take a key** (ratgdo, Konnected, Screek): accept as held exceptions, or isolate them with a firewall rule instead?
5. **Who adopts?** Adopt from the builder yourself (it writes inline keys I then move to `!secret`), or do you want me to hand-write all YAMLs so you only press Install?
6. **The Gianluca YAML** is named `jr-suite-bed.yaml` in the repo and its match with the flashed firmware isn't proven. OK to rename it and treat the builder-side compile as the check?
7. **Held list.** ZWA-2 and HA Voice stay held. Anything else you want to exclude up front?

On approval → /approve → /ship esphome-api-encryption
