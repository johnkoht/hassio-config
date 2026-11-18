---
title: Encrypt the ESPHome Native API on the Remaining Devices
slug: esphome-api-encryption
status: draft
created: 2026-11-15
has_pre_mortem: false
has_review: true
has_prd: false
linear: [JK-1249]
depends_on: [JK-1245]
---

# Encrypt the ESPHome Native API on the Remaining Devices

## Problem

JK-1249: 21 ESPHome devices in the house accept the native API with no encryption (two more, ZWA-2 and HA Voice, are held and out of scope). Anyone on the LAN can read their state and call their services: bed occupancy, presence, garage doors, the alarm panels. The ticket says "about 17"; the live count is 21 once the Konnected panels (2), ratgdo units (3) and Screek sensors (2) are counted individually.

Done when no ESPHome device on the LAN accepts an unencrypted API connection, except the explicitly held ones (see The three lists).

## Findings (read-only, 2026-11-15)

Sources: the HA `core.config_entries` file on epicurus (whether each ESPHome entry stores a `noise_psk`), plus an unauthenticated `device_info` call from the builder container to each unencrypted entry's stored host. The probe prints names and firmware facts only. Hosts, MACs and keys never leave the remote shell.

**Counts: 32 ESPHome entries in HA. 23 unencrypted, 9 encrypted.**

Encrypted (9): Kitchen, Playroom, Main Bedroom West and Office (offline) Apollos; the Foyer proxy; the main bed sensor; the Nino bed sensor; plus 2 dead entries (the old "Nino's Bed" and the retired Atom proxy). JK-1245 owns all 9 (it rotates keys on the live ones and deletes the dead ones). **This plan does not touch them.**

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

- **None of the 21 has a working YAML today.** Gianluca's bed sensor has one in the repo under the wrong name, not proven to match what's flashed. Three stale proxy YAMLs from JK-1239 (Gazebo, Jr. Suite, Nino's Bedroom) belong to devices that now run stock firmware with no key. JK-1245's two sections disagree on exactly which three devices those YAMLs last flashed, so before deleting them this plan re-checks each against the builder's last-flash record. This plan also owns the hand-off from JK-1245 to retitle the three proxy entries that are named only by a hostname suffix (Garage, Playroom, Gazebo).
- **Stock proxies are adoptable, but the plan doesn't use the adopt wizard.** `esphome.bluetooth-proxy` ships a `dashboard_import`. Adoption writes an inline API key into a new YAML (whether it also writes an OTA password is **unverified**; the pilot checks). The builder's `/config` is the `esphome/` directory inside the host's git checkout, so an adopted YAML lands there untracked, and the next `deploy.sh` (`git pull --ff-only`) aborts when a PR adds a file at the same path. **Chosen path (JK-1245's order): the YAML is hand-written in the repo, merged, deployed, then compiled and flashed from the builder.** If John adopts anyway, he does it under a scratch name that is deleted from the host before the deploy.
- **Adopting compiles the current upstream package** (`@main`), and the live proxies run 2026.5.1 or 2026.7.4. The jump to the builder's 2026.10.1 changes firmware. Pin the package `ref:` to a commit SHA, as JK-1245 Phase 2 does for the Apollos.
- **The OTA path is also open.** The stock proxies were flashed without an OTA password, so anyone on the LAN can push firmware to them. Encrypting the API doesn't close that. See Open Questions.
- **ratgdo, Konnected and Screek are vendor firmware.** Whether each accepts a user-supplied `api: encryption: key:` (or has a published YAML to start from) is **unverified**. It is a decision gate in its batch, not an assumption.
- **Unverified claims in this plan** (checked on the pilot or the gate, not assumed): that OTA staging on ESP8266 (ratgdo) behaves like the ESP32 inactive-partition write; that a ratgdo reboot leaves the door untouched; that a node rename keeps HA's entities (JK-1245's Nino rename is the first test); that HA raises a reauth flow when a keyless entry meets an encrypted device, and that it does NOT raise one when an entry holding a key meets a plain device (the rollback step relies on the second); and whether HA's ESPHome integration can set the key itself without a pasted value, which would simplify step 7.
- **The ratgdo units are ESP8266.** Encrypted API costs RAM there, and the jump from 2024.6.2 to 2026.10.1 is large. Verify with a compile before any upload.

## Dependency on JK-1245

JK-1245 (plan in progress, John doing the builder installs) proves the loop this plan reuses: the builder CLI flash, the secrets helper (`bin/esphome_rotate_secret.py`), the HA re-key helper (`bin/esphome_rekey_ha.py`) and the health check. **Nothing in this plan flashes until JK-1245 Phase 1 is done and reports that the loop works** (re-key script correct, UI fallback understood, the health check passes for a BLE proxy, the Foyer proxy in particular).

**One thing JK-1245 does not prove.** JK-1245 changes the key on devices that are already encrypted: HA's reauth flow fires because the stored key stops working. Here the entry has **no key** and the device starts demanding one. HA should still raise a reauth flow on the "requires encryption" error, but that path is untested here. The pilot (batch 1) is the test, with the UI fallback (Settings, Devices & services, the ESPHome card needing attention, paste the key).

JK-1245 Phase 2 (pinned-firmware Apollos) is a dependency for exactly one device: the Main Bathroom Apollo (batch 6) reuses its pin-and-diff approach.

## The three lists

The audit script (`bin/esphome_api_audit.py`) holds three constants side by side. They change only by PR, and each name is a decision, not a script default.

- **Held:** ZWA-2 and HA Voice. A vendor-blocked device joins this list only when John decides (Open Question 4).
- **Dead:** the old "Nino's Bed" entry and the retired Atom proxy entry. JK-1245 deletes both; the constant goes away with them.
- **Offline-kept:** the Office Apollo (offline on purpose, owned by JK-1245).

The unreachable Screek unit is on none of them. It can only be added by John's decision, after we find out why it's unreachable. A non-listed `PLAIN` or `UNREACHABLE` entry fails close-out; a listed one is reported but doesn't.

## Per-device flow (the loop)

Rule: **one device mid-change at a time.** Order matters because the moment the device reboots with a key, HA's saved (empty) key stops working. HA's connection stays down until step 7.

1. **Generate the key.** JK-1245's `bin/esphome_rotate_secret.py` only replaces a name that already exists (it asserts exactly one match). This plan adds an `--add` mode (create a missing name, refuse an existing one) with its own test in PR A. Adding names writes the builder's `secrets.yaml`, so **it is a host write, not read-only: Claude runs it, and only after John's go for that batch.** **Secret names are never reused from before JK-1239 (#152).** `bluetooth_proxy_gazebo_api_key`, `bluetooth_proxy_jr_suite_api_key` and `bluetooth_proxy_nino_bedroom_api_key` held values that sat in public history and still exist on the builder. `--add` refuses an existing name, so those devices get NEW names (`ble_proxy_<room>_api_key` for all 12 proxies). Two mechanisms enforce the rule, each with its own test: (a) `--add` carries a hard-coded denylist of the three old names and refuses them; (b) `tests/test_esphome_no_inline_secrets.py` gains an assertion that no `esphome/*.yaml` references any of them. **The assertion ships in the stale-YAML PR (Task 3), not PR A**, because the three stale YAMLs still reference those names until that PR deletes them. That PR deletes the three names from `secrets.fake.yaml` only. Both `secrets.yaml` copies are gitignored, so the builder's copy is cleaned as a host write: `bin/esphome_rotate_secret.py --remove <name>` (a new mode, own test, asserts exactly one match, prints names only), owned by Claude, with John's go. Keys are base64 of 32 random bytes; output is names only. The repo copy `esphome/secrets.yaml` is gitignored and refreshed by `scp` afterwards. The repo never sees a value.
2. **YAML (in the repo, merged and deployed first).** `api: encryption: key: !secret ble_proxy_<room>_api_key` (for non-proxies, `<device>_api_key`). Files and nodes are named by room (see Open Questions 2 for the node-rename call, decided before the pilot PR). If the node is renamed, the upload target and HA's stored host are still the OLD `.local` name until the entry updates.
3. **Validate before touching the device.** `docker exec esphome esphome config /config/<file>.yaml >/dev/null` (its output renders secrets, so discard it), then `esphome compile`. A compile failure costs nothing.
4. **Pre-flash snapshot.** Record `sensor.bermuda_global_active_proxy_count`, the state of `lock.front_door`, and for non-proxies the device's entity list and states.
5. **Upload (CLI, as in JK-1245, builder UI closed).** John runs `docker exec esphome esphome upload /config/<file>.yaml --device <target>` from the commands Claude supplies. The target is `<current-node>.local`; for a device that doesn't advertise on mDNS, `bin/esphome_upload.py <file>` (PR A) runs on epicurus, reads the host from HA's entry in-process and runs the same CLI upload, printing only names, so the host never leaves the remote shell. John runs it. OTA writes to the inactive partition and switches only on success. **If it fails, the device keeps its old unencrypted firmware, HA never noticed, and the loop restarts at step 3.**
6. **Prove the key before HA.** `bin/esphome_api_audit.py --key-stdin <room>` (built in PR A) makes a `device_info` call with the new key, key on stdin, output names only. It confirms the device is up, encrypted and the same device (name matches), and that a plain call is now refused.
7. **Re-key HA.** `bin/esphome_rekey_ha.py` continues the reauth flow (`reauth_confirm`, `noise_psk`), or starts a reconfigure flow if no reauth is open. UI fallback if it doesn't match.
8. **Health check.** Entry `loaded`; the device's entities are available and the snapshot matches; Bermuda count is back to its pre-flash value; the Level lock isn't `unavailable`; person room-presence sensors updated since the flash. For bed sensors, a sit test.

**If something breaks:**

- *Device up but HA can't connect:* the key from step 6 already worked, so the fault is the HA entry. Re-run step 7, or paste the key in the UI.
- *Device never comes back after the upload:* wait for the device's own Wi-Fi retry, then check mDNS and the router. Nothing was changed on HA, so only this device is affected. ESPHome safe mode and the fallback AP exist; otherwise serial or USB with **John at the device**.
- *Encryption broke something and we want out:* revert the YAML, compile, and OTA it (the OTA port doesn't depend on the API key; if an OTA password was added in the same flash, the rollback needs it; **after a node rename, the rollback's `--device` is the NEW `.local` name**). **Then clear the key in HA** (reconfigure the entry with an empty key, or the UI): a client holding a key can't connect to a plain device, and HA is not expected to raise a reauth for that (unverified, see Findings). Then run the health check.
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
| 7 | **Garage doors** | ratgdo 1, 2, 3, one at a time | Physical access. **Gate:** compile with encryption on ESP8266 first. Doors closed, someone home, no door moving | Each door's state, open/close command (John operates it), the garage entry-door lock and arrival-detection inputs read as before |
| 8 | **Alarm panels** | Konnected panel 1, then 2 | Safety-critical, last. **Gates:** vendor firmware must accept a user key, and a read-only look at Alarmo's own UI-defined arming and automation settings (they aren't in the repo) shows nothing else that could arm during a window. **Each panel gets its own window.** Alarm disarmed, John home. The batch PR is deployed FIRST; then, for each window: Claude records the state of the auto-arm automations, pauses them (`automation.alarm_arm_if_john_away`, `automation.alarm_arm_when_house_is_empty`, `automation.alarm_arm_at_bedtime`, `automation.alarm_arm_away_when_vacation_mode`, and the two that toggle the first: `automation.activate_alarm_automation_if_john_away`, `automation.deactivate_alarm_automation_if_john_home`; entity_ids come from the alias, so Claude reads them from HA to confirm), then turns `input_boolean.alarm_test_mode` on and **confirms it is `on` immediately before the upload**. Test mode turns itself off after 30 minutes, at HA start and on any automation reload (`alarm_test_mode_auto_off`), and with it off Noonlight dispatches, so **no deploy, reload or HA restart during a window**; if one happens, abort the window and re-confirm. **Re-confirm test mode `on` again before any in-window rollback OTA and before John opens a sensor.** At the end Claude turns test mode off and restores the recorded automation states | Every zone reports; Alarmo disarmed and healthy; John opens a door sensor to confirm; **test mode `off` and every auto-arm automation back to its recorded state** |
| 9 | Close-out | The audit script across all entries | Done-when check | Zero plain-accepting and zero unreachable entries, except those on the three lists (held, dead, offline-kept) |

## What Claude preps and what John does

**Claude, repo only:**

- This plan, kept updated after each batch.
- YAMLs for each device in a PR per batch, validated against the secret-name guard: the 12 proxies (using the `esphome.bluetooth-proxy` package with a pinned ref), Gianluca's bed sensor (renamed from `jr-suite-bed.yaml`, node unchanged), the Main Bathroom Apollo. YAMLs for ratgdo, Konnected and Screek come after the gate check on each.
- Placeholder entries in `esphome/secrets.fake.yaml` for every new `!secret` name (the test requires them).
- `bin/esphome_api_audit.py` and its test. Reads the ESPHome entries through the host config (host values stay in memory), tries an unauthenticated `device_info` against each, and prints one line per entry: `ENCRYPTED`, `PLAIN` or `UNREACHABLE`, **by name only. It catches exceptions and prints the exception type, never the message, because connection errors embed the address.** Exits non-zero when any non-listed entry is `PLAIN` **or `UNREACHABLE`**; a name on the three lists (see The three lists) is reported but doesn't fail. The test covers each case. It runs on epicurus: the host side reads `core.config_entries` and pipes the hosts over stdin into the builder container (which has `aioesphomeapi` but can't see `.storage`). The `--key-stdin <room>` mode (step 6) is part of the same script.
- The rotate helper's `--add` mode (with the old-name denylist) and `--remove` mode, each with its own test; and `bin/esphome_upload.py` with its test. (The never-reuse assertion is in the stale-YAML PR, Task 3.)
- Deleting the three stale proxy YAMLs and their old names from `secrets.fake.yaml` (never reused, see step 1).
- Docs: `docs/` device notes and the memory entry for the loop.

**Claude, read-only on the host:** the audit run, the pre/post snapshots and the health check (recorder opened read-only).

**Claude, writes to the host or HA. Each needs John's go for that batch or window, and each has Claude as the single owner:**

- Step 1 key generation (`--add` writes the builder's `secrets.yaml`) and the `scp` refresh of the gitignored local copy.
- Removing the three old names from the builder's `secrets.yaml` (`--remove`), after the stale YAMLs are deleted.
- Step 7 HA re-key with the deploy token (token on stdin, never an argument), and the rollback's key-clearing.
- Batch 8: the `alarm_test_mode` toggles and the pause, record and restore of the auto-arm automations.
- The HA entry retitles for the Garage, Playroom and Gazebo proxies.

**John, by hand:**
- Merging each batch PR and deploying it (`./deploy.sh --reload --skip-ci`, which pulls on the host and reloads automations). **In batch 8 the deploy comes before test mode goes on**, and nothing deploys during a window.

- Every flash (the CLI upload command from step 5), and every sit test.
- The decisions in Open Questions, and the go for each batch or window.
- Operating the garage doors and alarm sensors for the verification steps.
- Physical access for any serial recovery.
- Approving each batch PR before its flash window.

## Tasks

1. **Wait for the gate.** JK-1245 Phase 1 done and reported. Re-read the helpers it merged.
2. **Prep PR A.** Contains exactly: `bin/esphome_api_audit.py` (with `--key-stdin` and the three lists), the rotate helper's `--add` (with the old-name denylist) and `--remove` modes, `bin/esphome_upload.py`, a test for each, and `secrets.fake.yaml` placeholders for batches 1 to 4. No assertion about old names (Task 3). Run the audit once to record the baseline (expect 20 plain, counting held ZWA-2, plus the unreachable ones listed separately).
3. **Stale-YAML PR (before batch 3).** First re-check, against the builder's last-flash record, which device each of `bluetooth-proxy-gazebo`, `-jr-suite` and `-nino-bedroom` last flashed (JK-1245's two sections disagree). Then delete the three YAMLs and their three names from `secrets.fake.yaml`, and add the assertion to `tests/test_esphome_no_inline_secrets.py` that no `esphome/*.yaml` references them, with its own test. After the merge and John's deploy, Claude runs `esphome_rotate_secret.py --remove` for the three names on the builder (host write, John's go). Each of those devices gets its new `ble_proxy_<room>_api_key` name in its own batch PR, never a reused one.
4. **Verify gates (read-only):** first, which proxy sits on the Level lock's BLE path (Open Question 3), which gates batches 1 and 2. Then the vendor gates: can ratgdo, Konnected and Screek firmware take a user key (published YAMLs, vendor docs, a local `esphome config` on a candidate). Record the answer on JK-1249. Find out why the second Screek is unreachable.
5. **Batches 1 to 8 per the table.** Per batch: a small PR with the YAMLs, `config` and `compile` for each, John flashes, the check runs, a one-line update on JK-1249.
6. **Held list.** Anything vendor-blocked is documented as held with the reason, and the audit script's held constant is updated in the same PR.
7. **Close-out.** Full audit, all green except the held, dead and offline-kept lists. Delete scratch files, update docs, close JK-1249.

## Risks

- **BLE coverage dips while a proxy reboots**, affecting Bermuda and possibly the Level lock's BLE path. One at a time, light check between, someone home.
- **Plain-to-encrypted re-key path untested.** Pilot first; UI fallback.
- **An adopted YAML left on the host breaks the deploy pull.** Hand-written YAMLs in the repo are the default; scratch-name adoption is deleted before deploy.
- **Adoption writes an inline key.** The guard test and gitleaks block a commit; never push before they pass.
- **Upstream `@main` drift on adopted proxies.** Pin the ref to a SHA.
- **ratgdo on ESP8266 runs out of memory or breaks on the ESPHome jump.** Compile first; hold if it doesn't fit. Reboot doesn't affect the door itself, but don't flash while a door moves.
- **Alarm panel reboot while armed raises a false alarm or tamper.** Disarmed, John present.
- **A secret value appearing in a transcript or the repo.** Never `cat` `secrets.yaml` or print `esphome config`; helpers print names only. The probe in this plan's research printed two addresses via a raw error message once; the audit script fixes that by design.
- **Repo is public.** Plans, YAMLs, PR bodies and commits use names only. New YAMLs and files are named by room, so the 12 stock proxies add no hostname suffixes. Existing files that carry suffixes are not extended. Node renames are a flash-time decision (Open Question 2).
- **Rollback is possible but needs John at the device if the firmware won't boot.**

## Open Questions for John

1. **OTA passwords.** Stock proxies take firmware pushes from anyone on the LAN. Encrypting the API doesn't close that. Add an OTA password in the same flash (a single flash for passwordless devices), or keep this to the API only?
2. **Node renames.** Live node names include a MAC-derived suffix, and the node name must appear in each YAML. The plan defaults to renaming each node to its room, so the public repo gets no new suffixes (HA matches by MAC; JK-1245's Nino rename is the first test of that). Say if you'd rather keep the names. Decide before the pilot PR.
3. **Which proxy for the pilot, and which proxy sits on the Level lock's BLE path?** Needs your coverage map.
4. **If vendor firmware can't take a key** (ratgdo, Konnected, Screek): accept as held exceptions, or isolate them with a firewall rule instead?
5. **Who writes the YAMLs?** The plan defaults to me hand-writing them in the repo so you only run the upload command (an adopted YAML on the host would break the deploy pull). Say if you want to adopt anyway.
6. **The Gianluca YAML** is named `jr-suite-bed.yaml` in the repo and its match with the flashed firmware isn't proven. OK to rename it and treat the builder-side compile as the check?
7. **Held list.** ZWA-2 and HA Voice stay held. Anything else you want to exclude up front?

On approval → /approve → /ship esphome-api-encryption
