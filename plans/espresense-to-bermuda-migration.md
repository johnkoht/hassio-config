# ESPresense → Bermuda Migration — Action Plan

_Status: Draft for collaboration. Date: 2026-07-23. Do not build yet._

## Goal

Retire ESPresense (MQTT `mqtt_room`) and make **Bermuda** the source of BLE room
presence, while **consolidating** the current multi-layer per-person sensor stack and
keeping the ~70 downstream consumers working.

---

## Decisions (locked — updated 2026-07-27)

1. **Architecture: Option B (area-native).** Retire the ESPresense string vocabulary; HA's
   area registry is the single source of truth. Each person's `sensor.<name>_room_presence`
   emits the **HA `area_id`** via `area_id(states('sensor.<device>_area'))`. Downstream
   presence filters move from ESPresense strings to area_ids (see Execution Spec §9). No
   REMAP, no sub-zone lists; the old quirks get fixed as part of the sweep.
2. **Scope: only IRK-enrolled devices** — **John (iPhone), Cristina (iPhone), Nino (iPad)**.
   Everyone else stays on ESPresense untouched and is migrated later via the
   `add-presence-person` skill as they're enrolled. → Backlog.
3. **Basement:** match `['basement_main', 'basement_hub']` (the only basement areas with
   proxies), not the whole floor.
4. **Living/Dining:** living + dining were physically merged into one dining room. Rename
   `sensor.living_room_presence` → `dining_room_presence` (no external consumers — safe),
   repoint dining occupancy to `dining_room`. Other non-presence `living_room` refs → Backlog.
5. **Mudroom/Laundry:** no BT proxy there yet — **leave all `mudroom` references untouched**;
   add a proxy + wire presence later. → Backlog.
6. **Nino Fitbit: DROP** (no IRK; iPad only).
7. **`indoor_bluetooth_device_count`: REBUILD from Bermuda.**
8. **Gianluca canonical = `gianlucas_room`** (the real HA area_id); the two old strings
   (`gianluca_room`, `gianluca_bedroom`) both map to it.
9. **Reusable tool:** `.claude/skills/add-presence-person/` scaffolds future people
   (wrapper + group wiring + validation). Adding a person needs zero room-side changes.

## Backlog (high priority, post-migration)

- **Living room cleanup:** rename remaining non-presence `living_room` refs (doorbell,
  announcements, hourly_dong, dining lights group, device_count) to `dining_room`.
- **Mudroom/Laundry proxy:** add a BT proxy, then wire `laundry`/`mudroom` presence.
- **Migrate remaining people** (Tayta/Sonia, Katia, Joe, Nonna/Mary, Antoun, Elise, Yara,
  Roscoe) via the skill as IRK-enrolled; then decommission ESPresense.
- _(Mirrored in scratchpad `backlog.md`.)_

---

## 1. How Bermuda works (confirmed)

Bermuda does BLE trilateration over HA-native **bluetooth proxies** (ESPHome
`bluetooth_proxy` nodes / Shelly). For every tracked device it creates:

| Entity | State / meaning |
|---|---|
| `sensor.{device}_area` | Current **HA Area** name, e.g. `Office` (title-case friendly name) |
| `sensor.{device}_area_last_seen` | Last area; **holds** the last room when the device goes out of range |
| `sensor.{device}_distance` | Distance to nearest proxy |
| `sensor.{device}_floor` | Floor name, e.g. `Main Floor` |
| `device_tracker.{device}` | `home` / `not_home` |
| +~28 disabled | per-proxy distances, area id, MAC, etc. |

Entity IDs are slugified from the device name: **"John's iPhone" → `sensor.john_s_iphone_area`**.

**Critical: iPhones/Apple Watches must be enrolled via HA's [Private BLE Device](https://www.home-assistant.io/integrations/private_ble_device/) integration using each device's IRK.**
iPhones broadcast rotating private MACs; without the IRK, Bermuda sees ephemeral
addresses and can't track them — **this is almost certainly why "most phones aren't
tracked properly."** Once a device is added to Private BLE Device with its IRK, Bermuda
auto-creates the sensors above. IRK capture: read it from macOS Keychain (same iCloud
account) or flash Derek Seaman's ESP32 "IRK Capture" ESPHome package and pair the device.

**Areas:** each BT proxy is assigned to an HA **Area**; `sensor.{device}_area` reports
that Area's friendly name. So Bermuda's vocabulary = your HA Area names (title-case),
**not** ESPresense's lowercase node names. Reconciling these is the core work (§4).

**Tuning (Bermuda → Configure, global + per-scanner):** reference power (rssi ref level),
environmental attenuation, max tracking radius, per-scanner RSSI offsets, away/nothome
timeout. Confirm exact option names in the UI during setup.

Sources: [agittins/bermuda](https://github.com/agittins/bermuda) ·
[IRK wiki](https://github.com/agittins/bermuda/wiki/How-to-get-the-IRK-(Identity-Resolving-Keys)-for-iOS,-Android-etc) ·
[Private BLE Device](https://www.home-assistant.io/integrations/private_ble_device/) ·
[Derek Seaman walkthrough](https://www.derekseaman.com/2025/12/home-assistant-track-whos-in-each-room-with-esphome-bermuda-ble.html)

---

## 2. Current architecture (what we're consolidating)

Everything funnels through **one seam**: `sensor.{name}_room_presence`, whose state is a
**lowercase room string** (`office`, `main_bedroom`, `not_home`). Today that seam is fed
by a 3–4 layer stack per person:

```
mqtt_room raw sensor  →  normalization template  →  sensor.{name}_room_presence  ─┐
(espresense/*)           (collapses *_two/_bedstand)      (THE SEAM)               │
                                                                                   ├─► group.room_presence_devices  (by .state == '<room>')
sensor.{name}_person.attributes.room_presence = seam ──────────────────────────────┤        → room display sensors, *_ble_occupancy, occupancy automations,
                                                                                   │          media, child-safety
                                                                                   └─► group.people_sensors (by .attributes.room_presence)
                                                                                            → *_people_list → sensor.{room} (house/areas) → dashboards
```

**Consolidation opportunity (per John's note):** Bermuda already emits one clean
per-person `sensor.X_area`, so we delete the `mqtt_room` raw sensors **and** the
per-person normalization/combination logic (John iPhone+Watch, Nino Fitbit+iPad). The
stack collapses from 3–4 layers to **1 thin template per person**.

---

## 3. Two target architectures — pick one (Open Decision #1)

### Option A — Keep the string seam, collapse the source (RECOMMENDED)
Replace the mqtt_room + normalization pair with **one template** per person that maps
Bermuda's Area → the existing lowercase string, gated on the device_tracker for away.
- **Downstream (~70 files): untouched.**
- Blast radius: ~13 source templates + a few cleanup items. Reversible, per-person testable.
- Keeps `sensor.{name}_person` (still needed for `group.people_sensors` + other attrs).

**Big simplification from the live data:** your HA **area_id slugs already equal the
ESPresense strings** (`office`, `kitchen`, `family_room`, `main_bedroom`, `jr_suite`,
`playroom`, `garage`, `sunroom`…). HA's `area_id()` template function converts Bermuda's
friendly Area name → slug for free, so we **don't need a 39-row map** — just a 5-entry
override dict (`REMAP`) for the areas whose slug ≠ the legacy consumer string (§4a).

```yaml
# packages/people/john/john_room_presence.yaml  (Bermuda-sourced, replaces raw+normalize)
template:
  - sensor:
      - name: "John Room Presence"
        unique_id: john_room_presence     # keep entity_id stable → 70 consumers unaffected
        state: >-
          {% if not is_state('device_tracker.john_s_iphone_bermuda_tracker', 'home') %}
            not_home
          {% else %}
            {% set slug = area_id(states('sensor.john_s_iphone_area')) %}
            {% set REMAP = {
              'nino_room': 'nino_bedroom',
              'gianlucas_room': 'gianluca_room',
              'basement_main': 'basement',
              'dining_room': 'living_room',
              'mud_room': 'mudroom'
            } %}
            {{ REMAP.get(slug, slug) if slug else 'not_home' }}
          {% endif %}
```
The `REMAP` dict is the DRY macro shared by all 13 files (define once, `!include`/macro).
`area_id()` on a title-case Area name returns the slug; `slug` is falsy if the area can't
resolve → `not_home`.

### Option B — Go Area-native, retire the string vocabulary (clean end-state, big change)
Put `sensor.X_area` straight into the groups and change every downstream
`equalto '<lowercase>'` to the title-case Area name (or match on HA area membership).
- Eliminates the mapping entirely; single vocabulary (HA Areas).
- **Touches ~70 files** + must reconcile every quirk (§4). Higher risk, do incrementally later.

**Recommendation:** ship **Option A** now (fast, safe, delivers the consolidation John
wants at the source), keep **Option B** as an optional future cleanup once Bermuda is
proven stable.

---

## 4. Reconciliation — the hard part (action items)

### 4a. Area→string — RESOLVED via `area_id()` + 5-entry REMAP  ✅
Live HA has **39 areas**. Their **area_id slugs already equal the ESPresense strings** for
almost everything, so `area_id(bermuda_area_name)` gives the legacy string directly. Only
these slugs differ from what consumers expect — the entire `REMAP` dict:

| Bermuda area (friendly) | `area_id()` slug | Consumer expects | Reason |
|---|---|---|---|
| Nino's Room | `nino_room` | `nino_bedroom` | consumers use `nino_bedroom` |
| Gianluca's room | `gianlucas_room` | `gianluca_room` | `gianlucas`≠`gianluca` (decision #2: canonical `gianluca_room`) |
| Basement Main | `basement_main` | `basement` | occupancy uses `basement` |
| Dining Room | `dining_room` | `living_room` | `dining_room_occupied` quirk |
| Mud Room | `mud_room` | `mudroom` | `laundry_not_occupied` quirk |

Everything else passes straight through: `office`, `kitchen`, `family_room`, `main_bedroom`,
`main_bathroom`, `jr_suite`, `playroom`, `garage`, `sunroom`, `foyer`, `laundry_room`,
`upstairs_hallway`, etc. `gazebo` and `pool` are **separate** areas — `gazebo`→`gazebo`
works; `pool`→`pool` is unconsumed today (pool_occupied matches `gazebo`), leave it.
_(Full 39-area list + floor assignments captured in the fetch report; not repeated here.)_

### 4b. Device / person enrollment tracker — LIVE STATUS (2026-07-24)
**Only 3 devices are IRK-enrolled in Private BLE Device today** (John iPhone, Cristina
iPhone, Nino iPad) — confirming "most phones aren't tracked." Everyone else needs
enrollment. This is the bulk of Phase 0.

| Person | Device | Bermuda entity | Private BLE (IRK) | Live state | Action |
|---|---|---|---|---|---|
| John | iPhone | `sensor.john_s_iphone_area` | ✅ `..._f5272e` | **`Office`, home** ✅ | none — reference device |
| Cristina | iPhone | `sensor.cristina_s_iphone_area` | ✅ `..._b596b2` | `unknown` / not_home | ⬜ validate on-site (was `main_bedroom` in ESPresense — see note) |
| Nino | iPad | `sensor.nino_s_ipad_area` | ✅ `..._c31079` | `unknown` / not_home | ⬜ validate on-site |
| Katia | iPhone | — | ⬜ | not enrolled | ⬜ capture IRK → Private BLE Device |
| Joe | iPhone | — | ⬜ | not enrolled | ⬜ enroll |
| Sonia/Tayta | iPhone | — | ⬜ | not enrolled | ⬜ enroll ONE device (decision #5: drop dupe) |
| Nonna/Mary | beacon | — | ⬜ | not enrolled | ⬜ enroll (IRK) or add fixed-MAC beacon in Bermuda |
| Antoun (Jido) | Apple | — | ⬜ | not enrolled | ⬜ enroll |
| Elise | iPhone | — | ⬜ | not enrolled | ⬜ enroll (confirm wanted in group) |
| Yara | iPhone | — | ⬜ | not enrolled | ⬜ enroll (confirm wanted in group) |
| John | Apple Watch | — | ⬜ | not enrolled | ⬜ optional — iPhone likely enough |
| Roscoe (dog) | iBeacon | — | n/a fixed MAC | not_home | ⬜ add directly in Bermuda (no IRK) |
| ~~Nino~~ | ~~Fitbit~~ | — | — | — | **DROP (decision #3)** — remove Fitbit sensor |
| BMW (car) | BLE | `sensor.bmw_area` | n/a | tracked, not_home | already in Bermuda; not a person |

**Note (Cristina/Nino read `unknown`):** consistent with being away right now (their other
trackers also say not_home), so it doesn't prove broken enrollment — but validate each
device resolves a real room *on-site* before cutting that person over. Cristina is the one
mismatch to watch: ESPresense currently says `main_bedroom` while Bermuda says not_home.

### 4c. Remaining cleanups (decisions locked; execution notes)
- **Sonia == Tayta** (`apple:1007:11-6`): keep one Bermuda device + one `_room_presence`
  sensor, delete the other (decision #5).
- **Gianluca:** canonical `gianluca_room` via REMAP (decision #2); `gianlucas_bedroom_presence`
  display sensor goes stale → Backlog.
- **Quirks** (`living_room`/`mudroom`) absorbed into REMAP (decision #2) → Backlog.
- ⬜ **`group.room_presence_devices`** (`packages/people/people_groups.yaml`): decide final
  membership as each person is enrolled (Elise/Yara/Watch/Roscoe currently absent/commented).
- Sub-room precision (bedstand, `_two`) lost — acceptable (already collapsed today).

---

## 5. Phased action plan (checklist)

### Phase 0 — Bermuda enrollment & recon (no repo changes)
- ⬜ Verify BT-proxy coverage matches the ~11 ESPresense nodes; reflash any ESPresense-only
  ESP32s as ESPHome `bluetooth_proxy`. Assign each proxy to the correct HA **Area**.
- ⬜ For every iPhone/Watch: capture IRK → add to **Private BLE Device** → confirm Bermuda
  auto-creates `sensor.{device}_area`. Fill 4b.
- ⬜ Add fixed-MAC beacons (Roscoe, any non-RPA) directly in Bermuda.
- ⬜ Dump HA Area list + real Bermuda `*_area` entity_ids/states; finalize 4a map + 4c decisions.
- ⬜ Tune reference power / attenuation / max radius / per-scanner offsets until area
  detection is stable per device.

### Phase 1 — Reconcile vocabulary (small edits)
- ⬜ Apply 4c decisions (gianluca, quirks, Sonia/Tayta consolidation, group membership).

### Phase 2 — Rewrite source sensors, one person at a time (Option A)
Replace each `mqtt_room` raw + normalization with the §3 shim (keep entity_id/unique_id):
- ⬜ **John first** (`packages/people/john/john_room_presence.yaml`) → `ha core check` →
  reload → validate `sensor.john_room_presence` tracks rooms; check WhereIsJohn intent,
  `john_sleeping`, `john_presence`, office/kitchen occupancy.
- ⬜ Cristina (`packages/people/cristina/cristina_room_presence.yaml`)
- ⬜ Katia · Joe · Sonia/Tayta (consolidate) · Nino (iPad; decide Fitbit) · Nonna/Mary
- ⬜ Convert the raw-only `sensors/people/*_bt.yaml` (Antoun, Sonia, Elise, Yara,
  John-Watch, Roscoe) to the same shim template.
- ⬜ Delete leftover `_raw`/`mqtt_room` definitions and any now-dead person combine logic.

### Phase 3 — Off-seam consumers
- ⬜ **`packages/bluetooth/bluetooth_device_count.yaml`** (uses `sensor.espresense_*_count`):
  **rebuild** from Bermuda — e.g. count tracked devices whose `*_area` is a real indoor
  area, or drop it. (Open Decision #4)
- ⬜ Dashboards: replace `binary_sensor.espresense_{office,main_bedroom,nino_bedroom}`
  "BLE Base Station" tiles with Bermuda proxy availability, or remove
  (`dashboards/kohbo/rooms/main_floor/office.yaml`, `.../upper_floor/main_bedroom.yaml`,
  `.../ninos_bedroom.yaml`).

### Phase 4 — Decommission ESPresense
- ⬜ After all persons stable for a few days: remove ESPresense add-on/Companion, delete
  `espresense/config.yaml`, delete `sensor.espresense_*` entities.
- ⬜ Update docs: `packages/people/CLAUDE.md` ("Room presence uses ESPresense … ~15
  stations") and `packages/CLAUDE.md` ("BLE presence (ESPresense)") → Bermuda.

### Phase 5 — ESP proxy security hardening (FAST-FOLLOW / final step)
Bermuda relies entirely on the ESPHome bluetooth-proxy fleet, so harden it. During the
Nino's Bedroom reflash we hit a proxy running the **native API in plaintext** (`Noise
encryption: NO`), which HA rejected once a key was expected. Bring every proxy/ESP to a
consistent, encrypted, reliably-adopted state.

- ⬜ **Enable Noise API encryption on every plaintext ESP.** Known offenders:
  - `bluetooth-proxy-nino-bedroom` (add-on-managed) — currently connected **plaintext**;
    add `api: encryption: key:` and reflash. _(Temporarily added to HA with a blank key to
    unblock; revisit here.)_
  - `esphome/jr-suite-bed.yaml` — local audit shows **no `encryption:`** block.
  - ⬜ **Audit the rest**: every device in the ESPHome add-on + `esphome/*.yaml`. Local
    copies mostly have encryption; confirm the **add-on-managed** ones (which aren't in the
    repo) do too. Any with `Noise encryption: NO` in their boot log → add a key + reflash.
- ⬜ **Compile off the HA host.** ESPHome builder on HA Yellow (CM4) OOM-crashes HA while
  compiling. Use local `esphome run esphome/<device>.yaml` from the Mac (`pipx install
  esphome`) so builds never touch HA resources. Track add-on-only YAMLs (e.g. the Nino
  proxy) into `esphome/` so they build locally too. Requires `esphome/secrets.yaml`
  (`wifi_ssid`, `wifi_password`, per-device api keys).
- ⬜ **DHCP reservations** for every BT proxy MAC (esp. IoT-VLAN ones) — the Nino proxy
  drifted `192.168.2.198`→`.144` mid-debug and HA lost it. Static IPs stop that.
- ⬜ **Reconcile HA device-registry / MAC duplicates.** Nino showed two boards
  (`c688c0` vs `c683c8`) — ensure only the real board per room is registered; delete
  strays so HA isn't half-connected to a ghost. Old ESPresense firmware also merged onto
  the same device entry, leaving ESPresense-named entities (`absorption`, `max_distance`,
  `enroll`…) — a clean delete + re-adopt gives correct `esp32_bluetooth_proxy_*` names.
- ⬜ **Standardize the fleet:** same WiFi SSID/VLAN policy, encryption key in `!secret`,
  consistent naming. Clear retained ESPresense MQTT discovery for any reflashed node
  (`homeassistant/*/espresense-<node>/#`, `espresense/*/<node>/#`) so stale entities don't
  return.

---

## 6. Files touched (Option A)
- **Rewrite (13):** 7 × `packages/people/*/…_room_presence.yaml` + 6 × `sensors/people/*_bt.yaml`.
- **Edit (1):** `packages/people/people_groups.yaml` (group membership).
- **Rebuild/drop (1):** `packages/bluetooth/bluetooth_device_count.yaml`.
- **Dashboards (3):** espresense base-station tiles.
- **Docs (2):** two `CLAUDE.md`.
- **Delete later:** `espresense/config.yaml`.
- **Untouched:** ~70 aggregation/automation/dashboard files on the seam.

## 7. Risks & mitigations
- **IRK enrollment is the gating dependency** — if a device has no IRK / won't resolve
  (Fitbit), that person can't be tracked. Do all of Phase 0 before touching the repo.
- **Away semantics:** gate the shim on `device_tracker.{device}` (`home`/`not_home`), not
  the Area sensor's away value, to preserve the `!= 'not_home'` logic that
  katia/nonna/tayta home-away and the presence bayesians rely on. `Area Last Seen` holds
  stale rooms — don't use it for presence.
- **Area typos fall through to `not_home`** — validate every mapped Area string.
- **Accuracy/latency differ from ESPresense** — migrate John first, tune, then roll out.
- **Sub-room loss** (bedstand/_two) — acceptable; already collapsed today.

## 8. Open decisions
All resolved — see **Decisions (locked — updated 2026-07-27)** at top.

---

## 9. Execution Spec (Option B sweep) — audited, definitive

Audit (corrected 2026-07-27): direct consumers via bayesian `to_state:` and
`is_state('sensor.*_room_presence', …)` DO exist (`john_sleeping`, `cristina_sleeping`,
`john_in_bed_bayesian`, `john_do_not_distrub_bayesian`, `main_bedroom_john_night_light`,
`office_dnd`) — but every one references an **unchanged** room (`main_bedroom`, `office`),
so the sweep needs no edits there. The **changing** rooms are consumed only via the
`group.room_presence_devices | selectattr('state', …)` and
`group.people_sensors | selectattr('attributes.room_presence', …)` patterns.
⚠️ Future rename sweeps MUST also audit `to_state:`/`to:`/`is_state` consumers, not just
`selectattr`. Scope: **2 wrapper rewrites (John, Cristina; Nino deferred)** + 19 one-line
edits / 15 files + 1 cleanup.

### A. Wholesale rewrites (3) — replace mqtt_room+normalization with the area_id wrapper
- `packages/people/john/john_room_presence.yaml` — devices: `sensor.john_s_iphone_area` (+ watch when enrolled)
- `packages/people/cristina/cristina_room_presence.yaml` — `sensor.cristina_s_iphone_area`
- `packages/people/nino/nino_room_presence.yaml` — `sensor.nino_s_ipad_area` (drop Fitbit block)

Use the wrapper from `.claude/skills/add-presence-person/templates/room_presence.yaml.tmpl`;
keep each `unique_id` unchanged. Gate away on the device area resolving (→ `not_home`).

### B. Vocabulary edits (19 occurrences / 15 files) — exact before→after
| File | Line | Change |
|---|---|---|
| `packages/ninos_room/nino_escaping/nino_escape_monitor.yaml` | 13 | `['nino_bedroom']` → `['nino_room']` |
| `packages/ninos_room/occupancy/ninos_room_ble_presence.yaml` | 7, 12 | `'nino_bedroom'` → `'nino_room'` |
| `sensors/rooms/ninos_bedroom_presence.yaml` | 7 | `'nino_bedroom'` → `'nino_room'` |
| `packages/gianluca_room/occupancy/gianluca_room_ble_presence.yaml` | 7, 12 | `'gianluca_room'` → `'gianlucas_room'` |
| `sensors/rooms/gianlucas_bedroom_presence.yaml` | 7 | `'gianluca_bedroom'` → `'gianlucas_room'` |
| `packages/house/areas/upper_floor/upper_floor.yaml` | 34 | `'gianluca_bedroom','ninos_bedroom'` → `'gianlucas_room','nino_room'` (in the list) |
| `packages/dining_room/modes/dining_room_not_occupied.yaml` | 13, 70 | `'living_room'` → `'dining_room'` |
| `packages/dining_room/modes/dining_room_occupied.yaml` | 33 | `'living_room'` → `'dining_room'` |
| `sensors/rooms/living_room_presence.yaml` | 7 | `'living_room'` → `'dining_room'` (+ rename file/sensor → `dining_room_presence`) |
| `packages/basement/modes/basement_not_occupied.yaml` | 13, 70 | `'eq', 'basement'` → `'in', ['basement_main','basement_hub']` |
| `packages/basement/modes/basement_occupied.yaml` | 29 | `'eq', 'basement'` → `'in', ['basement_main','basement_hub']` |
| `packages/main_bedroom/sensors/main_bedroom_ble_occupancy.yaml` | 14 | `['main_bedroom','main_bedroom_bedstand']` → `['main_bedroom']` |
| `packages/main_bedroom/main_bedroom_presence.yaml` | 11 | `['main_bedroom','main_bedroom_bedstand']` → `['main_bedroom']` |
| `packages/family_room/sensors/family_room_ble_occupancy.yaml` | 14 | `['family_room','family_room_two']` → `['family_room']` |
| `packages/kitchen/sensors/kitchen_ble_occupancy.yaml` | 14 | `['kitchen','kitchen_two']` → `['kitchen']` |

### C. Cleanup (delete dead commented ESPresense blocks)
- `packages/main_bedroom/mode/main_bedroom_occupied.yaml` L53 (commented BLE block)
- (optional) commented refs in `binary_sensors/rooms/family_room_occupancy.yml` L8/10

### D. Leave as-is
- 4 non-migrated people files (tayta/katia/joe/nonna `*_room_presence.yaml`) — emit matching
  collapsed strings; migrate later via skill.
- All `mudroom` refs (4, deferred). All non-changing rooms (office/kitchen/etc.).

### E. Verify after sweep
```bash
ha core check
# prove no retired strings remain in LIVE presence filters:
grep -rnE "selectattr\('(state|attributes.room_presence)'" packages/ sensors/ binary_sensors/ \
  | grep -vE ':[0-9]+:\s*#' \
  | grep -E "nino_bedroom|ninos_bedroom|living_room|gianluca_room|gianluca_bedroom|_two|_bedstand|'basement'"
# → expect NO output
```
Then reload and validate `sensor.john_room_presence` tracks John room-to-room (reference device).
