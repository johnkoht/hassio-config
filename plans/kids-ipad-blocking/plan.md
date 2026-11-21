---
title: Kids iPad Blocking
slug: kids-ipad-blocking
status: shipped
created: 2026-11-11
has_pre_mortem: false
has_review: false
has_prd: true
---

# Kids iPad Blocking

## Problem

The only control over the kids' iPads is the whole Kids network, through the schedule shipped in #149/#150. To cut off one iPad we have to use the UniFi app, and the dashboard doesn't show whether an iPad is even online.

## Goal

The Kids WiFi popup has one row per kid. Each row has a toggle that blocks that kid's iPad from the internet while it stays on WiFi, and a line underneath showing whether the iPad is connected. Toggling the row actually cuts internet for the iPad the kid is holding today. A private WiFi address rotating later must not silently undo the block.

## Approach

**Use the existing UniFi firewall policies; don't build new ones.** The controller already has "Block Nino" and "Block Gianluca", per a live read on 11-11:

- They are UniFi 11 zone-based policies: BLOCK, from Internal to External, all protocols, with no schedule.
- They sit first in the rule order, ahead of the Kids allow rules (DNS and Jellyfin, both internal-only).
- Both are currently disabled.
- The UniFi integration exposes them as `switch.unifi_network_block_nino_2` and `switch.unifi_network_block_gianluca_2`. A switch **on** means the policy is **enabled**, which means the iPad is **blocked**. The `_2` comes from orphaned traffic-rule entities (`switch.unifi_network_block_nino`/`_gianluca`, unavailable since UniFi 11 dropped traffic rules) squatting the plain ids.

This is the "no internet, stays on WiFi" behaviour John picked. The alternative, the integration's per-client block switches, kicks the device off WiFi entirely, and the one that exists (`switch.nino_s_ipad`) already points at a dead address.

**The policies match by MAC, so the iPads need a fixed address.** Each policy lists specific client MACs: Block Nino has 3 records (2 are stale, from about 1 and 3 years ago), and Block Gianluca has 1. Both current iPads are in their lists and online on the Kids SSID. iOS "Rotating" private addresses would put a new MAC outside the list and quietly unblock the iPad. Fix it on the devices: set **Private Wi-Fi Address → Fixed** for the Kids network on each iPad (Off also works). This is a manual step for John.

**Connected status.** HA tracks clients only on the SSIDs in the UniFi integration's `ssid_filter`, which today is Kohbo and Kohbo Guests. The iPads are on **Kids**, so HA can't see them; that's why `device_tracker.ninos_ipad` reads `not_home`. John adds **Kids** to the filter in the UniFi integration options (Settings → Devices & services → UniFi Network → Configure). After that, `device_tracker.ninos_ipad` should come alive. Gianluca's iPad has only a disabled registry entry, so it may need re-enabling, or it gets a new entity. Task 2 records the real entity ids.

Adding Kids to the filter creates trackers for every Kids-SSID client. That's harmless, but it is a UI change, so it's John's.

**UI.** Add an "iPads" section to `dashboards/kohbo/home/kids_wifi_popup.yaml`, below the network and schedule card. Each kid gets one `custom:template-entity-row`, following the existing pattern in `dashboards/templates/button_cards/people/nonna.yaml`:

- **Entity:** the policy switch.
- **Toggle:** `toggle: true`.
- **Name:** "Block Nino's iPad" / "Block Gianluca's iPad". The toggle reads correctly: on = blocked.
- **Secondary line:** from the tracker, "Connected" when it's `home` and "Offline" otherwise, plus how long it has been in that state.
- **Colour:** error colour when blocked, matching the popup's other rows.
- **Description card:** one line saying blocking cuts internet but the iPad stays on WiFi, and that the Kids network schedule still applies on top.

The work is dashboard-only: no automations, no new helpers.

**Out of scope:**
- Scheduling the per-iPad blocks. The network schedule already covers nights.
- Renaming the `_2` entities by removing the orphans. That's a registry change, and per memory renames on `_2` orphans are possible but risky to callers.
- Cleaning up the stale per-client block (`switch.nino_s_ipad`, and the `block_client` option).
- The two stale MAC records in Block Nino. They're harmless, so John can drop them in UniFi if he likes.

## Tasks

1. **John's manual prerequisites** (gate; nothing ships until done):
   - (a) On each iPad: Settings → Wi-Fi → Kids → Private Wi-Fi Address → Fixed (or Off). Check that the iPad rejoins.
   - (b) In the UniFi integration options, add Kids to the tracked SSIDs.
   - (c) Optional: remove the two stale "Nino's iPad" records from the Block Nino policy in UniFi.
2. **Verify live** (homelab, read-only):
   - Both policy switches are available and `off`.
   - Each current iPad MAC is in its policy. Re-check, since a Fixed address can differ from the rotating one: if the MAC changed when switching to Fixed, John must re-add the device in the policy.
   - Record the exact tracker entity ids for both iPads, and confirm they're `home`.
3. **Popup section:** add the iPads rows to `kids_wifi_popup.yaml` as described.
   - *Test:* the YAML parses.
   - *Test:* every entity id referenced exists live (from task 2).
   - *Test:* there are no clock times in the file.
4. **Docs:** add a sentence to the Kids WiFi entry in `docs/AUTOMATIONS.md`, and a line in the Home README if it describes the popup's contents.
5. **Ship:** dashboard-only, so merge and deploy without asking (standing rule). Then:
   - John toggles "Block Nino's iPad" and confirms the iPad loses internet but stays on WiFi.
   - John toggles it back and confirms internet returns.
   - Repeat for Gianluca.
   - If toggling doesn't drop traffic, the homelab agent checks UDM flow logs and policy hit counters.

## Risks

- **A changed MAC silently unblocks.** If an iPad's address changes (Fixed set after the policy was built, a "forget network", or a new iPad), the policy no longer matches and the toggle does nothing. Mitigations:
  - Task 1a and task 2's re-check.
  - The tracker line makes it visible: a kid shown as connected and blocked who still has internet points to this.
  - A more robust fix, matching the policy by a UniFi client group, is UniFi-side and out of scope. Noted for later.
- **Toggle meaning.** On = blocked is the reverse of the per-client block switches. Mitigation: the row says "Block …", and blocked shows in the error colour.
- **The `_2` entity ids could change.** If someone removes the orphaned traffic-rule entities and renames, the popup breaks. Accepted. Popup references are one file, and memory notes `_2` renames don't break the integration.
- **Tracker lag.** UniFi `detection_time` is 300 s, so "Offline" can lag by up to 5 minutes. Accepted.
- **Kids network schedule interaction.** When the schedule turns the SSID off, every iPad shows Offline and the block toggles don't matter. That's expected, and the description card says so.
- **Public repo.** No MACs, IPs or client records go in the plan, code or PR. The policy names are already visible as entity ids.

On approval → /approve → /ship kids-ipad-blocking
