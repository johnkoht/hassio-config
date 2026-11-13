---
name: ha-upgrade-check
description: Pre-upgrade review for Home Assistant Core on epicurus (Docker). Snapshots the live install, researches every release between installed and target (breaking changes, patch regressions, dependency floors, HACS compatibility), greps this repo for real impact, and writes plans/YYYY-MM-ha-upgrade-report.md. Use when asked "should I upgrade HA", "check the upgrade path", or when a new HA release is out.
---

# HA upgrade check

Production HA runs as a Docker container on **epicurus** (`ssh epicurus`, a Proxmox VM).
Config is `/root/homeassistant/config`; the image is pinned in `/root/homeassistant/docker-compose.yml`.
There is no Supervisor, HAOS or `ha` CLI. The old Yellow is retired (rollback-only until its window closes).

Read-only until the report is written. **Never** pull the new image, edit the compose file, restart
the container, snapshot the VM, or update HACS yourself: John does those. Prior reports in
`plans/*-ha-upgrade-report.md` are the template; read the latest one first for open carry-overs.

## 1. Snapshot the live install

```bash
.claude/skills/ha-upgrade-check/inventory.sh "$SCRATCH/inventory.txt"
```
The output has serials, so keep it in the scratchpad and never commit it. It covers: the pinned and running image,
Core and Python versions, sibling containers, DB size, recent HA backups, config-entry domains, Z-Wave/Matter
endpoints, custom_components, HACS repos, open repairs and the count of error lines since the last start.
(The host has python3 but no jq, so the script reads the `.storage` files with python.)

**Sanity-check the snapshot before researching:**
- `pinned` and `running` must match. A mismatch means someone edited the compose file without recreating the container (or the reverse).
- Newest HA backup should be under a day old. A missing or stale backup means a manual backup step before the upgrade.
- Open repairs with a `breaks_in_ha_version` at or below the target are blockers.
- Stale `hassio` repairs and `restart_required_*` HACS repairs are leftovers, not signal. The script hides the HACS ones.

## 2. Research: one subagent per minor release, in parallel

Pick the target: the latest patch of the last minor release that has had at least two patches. **Never** stop on `.0`/`.1`.
Spawn one `general-purpose` agent per minor release between installed and target, plus one for the
newest release (prep and the deprecation runway), plus one for HACS and the sibling containers. Give each the inventory path.
Each agent must:
- read the release blog's **Backward-incompatible changes** section, **from raw source**, not a WebFetch summary. A summary once invented four breaking changes.
- grep the repo for each change (both `.yaml` and `.yml`; exclude `.claude/worktrees`) and report paths, counts and IMPACT yes/no/maybe;
- read dependency floors from the core source at the release tags:
  - `recorder/db_schema.py` (schema -> DB migration; the DB is several GB, and the migration runs on first start);
  - `const.py` (Python; the Docker image ships its own, so this only matters for custom components);
  - `zwave_js/manifest.json` together with zwave-js-server-python `MIN_SERVER_SCHEMA_VERSION` (Z-Wave JS UI runs on hermes, not here);
  - the `matter` manifest against the `matter-server` container image (a separate pin in the same compose file);
- list patch regressions, which patch fixed each one, and what's still open.

The HACS agent: for each custom integration, record the latest release, its `hacs.json` `homeassistant` minimum, and
open issues on the target releases. Classify each as **before core**, **AFTER core** (its minimum is above the installed version), or fine.

## 3. Verify the claims that matter on the live box

Don't trust "maybe" items. Check the registries and the container:
- which platform an entity is on (`ssh epicurus` then python over `/root/homeassistant/config/.storage/core.entity_registry`);
- device firmware, models and bindings (device registry);
- which theme uses card-mod;
- the running container's own view: `docker exec homeassistant python -m homeassistant --script check_config -c /config`.

Use `gh issue view` to read the primary source of any issue that would change the verdict.

## 4. Write the report

Write `plans/<YYYY-MM>-ha-upgrade-report.md` with these sections:
- Current state
- Verdict + target
- Blockers before Core
- Do before Core
- Watch after upgrade
- Prep for next minor
- Recommended sequence
- Sources

This repo is **public**: no serials, addresses, or routines; IPs only where already in the repo.
Update the memory entry for the upgrade.

## Standing lessons (from past upgrades)

- Order: snapshot the VM -> HACS "before core" items -> compose image bump -> recreate container -> HACS "after core" items -> post-upgrade entity fixes.
- **Rollback is a VM snapshot, not a backup restore.** Since 2026.8 the device registry can't be downgraded, so the only way back is the pre-upgrade state. The recipe is:
  1. On the Proxmox host, as John: `qm snapshot <VMID> pre-<version>` (`<VMID>` is epicurus). The 04:30 HA automatic backup in `/root/homeassistant/config/backups` is the second line, and a PBS backup of the VM is the third.
  2. Back up the compose file next to itself: `cp docker-compose.yml docker-compose.yml.bak-pre-<version>-<date>`.
  3. Roll back with `qm rollback <VMID> pre-<version>` (or restore the compose backup and the config backup if the registries were not touched yet).
- **The upgrade is an image-tag bump**, not an in-place update. Edit the `homeassistant` image line in `/root/homeassistant/docker-compose.yml`, then `docker compose pull homeassistant && docker compose up -d homeassistant`. Always pin an exact version, never `stable` or `latest`. A bare `docker restart` does not pick up a new tag.
- The compose file also pins `esphome` and `matter-server`; bump those separately, not in the same window as Core. Z-Wave JS UI and Z2M live on hermes.
- The recorder DB is a 3 GB SQLite file on the host. A schema bump migrates it on first start and can take minutes with the UI down; check the `db_schema.py` floor and free disk first.
- Some HACS updates need the *newer* core: Bermuda 0.8.7 in July, browser_mod 3.1+/3.3. Check the minimum before saying "update first".
- Removed YAML syntax can fail *silently*: zero entities plus a Repairs issue, with no config-check error. Grep for it; don't trust `check_config` alone.
- After a restart, ZHA Aqara occupancy entities that were `on` are restored `on` with no timer; they clear on the next motion.
- After restarts, Frigate MQTT can stick `offline` (a retained last-will). Republish `frigate/available online -r` or restart Frigate.
- Attribute removals (`event_id`, `battery_level`) only surface in templates and dashboards, so grep `attributes.<name>` and `state_attr(..., '<name>')`.
- Don't bump Z-Wave JS UI in the same window as Core.
- `deploy.sh --reload` only reloads automations, scripts and rest_command over REST. An image bump is a full container recreate, so say so and let John pick the moment (a restart drops the whole house).
