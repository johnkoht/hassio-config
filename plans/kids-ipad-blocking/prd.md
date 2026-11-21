# PRD — Kids iPad Blocking

## Goal

Add one row per kid to the Kids WiFi popup: a toggle that blocks that kid's iPad from the internet (it stays on WiFi), with a Connected/Offline line from the iPad's tracker.

## Tasks

### task-1: Prerequisites (John) + live verification

John sets each iPad's Private Wi-Fi Address to Fixed on the Kids network and adds Kids to the UniFi integration's tracked SSIDs. Homelab then verifies live, read-only.

**Acceptance Criteria**
- `switch.unifi_network_block_nino_2` and `switch.unifi_network_block_gianluca_2` are available and `off`.
- Each iPad's current MAC is in its block policy's client list (reported as match/no match; no MACs written anywhere).
- The UniFi integration's tracked SSIDs include Kids.
- Each iPad has an enabled `device_tracker` entity whose exact id is recorded in working-memory.md, currently `home`.

### task-2: iPads section in the popup

**File:** `dashboards/kohbo/home/kids_wifi_popup.yaml`

**Acceptance Criteria**
- A `section_title` "iPads" card, then an entities card with two `custom:template-entity-row` rows (pattern: `dashboards/templates/button_cards/people/nonna.yaml`): entity = the policy switch, `toggle: true`, name "Block Nino's iPad" / "Block Gianluca's iPad", icon `mdi:tablet`.
- `secondary` renders "Connected" when the tracker is `home`, else "Offline", followed by " · <relative_time> ago" from the tracker's last_changed.
- `color` is `var(--error-color)` when the switch is `on`, `var(--light-grey-color)` otherwise.
- Existing description card gains one sentence: blocking cuts internet but the iPad stays on WiFi; the network schedule still applies.
- Header comment updated to mention the iPad rows.
- Tests: the file parses as YAML (with `!include` tags allowed); every entity id in it exists live (task-1 list); `grep -E '[0-9]{1,2}:[0-9]{2}'` finds no clock times; no MACs/IPs.

### task-3: Docs

**Files:** `docs/AUTOMATIONS.md`, `dashboards/kohbo/home/README.md` (only if it describes popup contents)

**Acceptance Criteria**
- The Kids WiFi entry in `docs/AUTOMATIONS.md` gains one sentence on the per-iPad block toggles and that they need a Fixed private address.

### task-4: Ship

Dashboard-only: merge and deploy without asking (standing rule). John live-tests each toggle.

**Acceptance Criteria**
- Deployed with `./deploy.sh --skip-ci --reload` from the merge commit.
- John confirms toggling blocks internet without dropping WiFi, and toggling back restores it.
