#!/usr/bin/env bash
# Snapshot the live HA install (Docker on epicurus) for an upgrade check. Read-only.
# Usage: inventory.sh [out_file]   (default: stdout). Never commit the output: it contains serials.
# The host has python3 but no jq, so the JSON work is done in python.
set -euo pipefail
HOST="${HA_HOST:-epicurus}"
OUT="${1:-/dev/stdout}"

ssh -o ConnectTimeout=10 "$HOST" 'bash -s' > "$OUT" <<'REMOTE'
D=/root/homeassistant
echo "## versions"
echo "pinned: $(grep -E 'image: ghcr.io/home-assistant/home-assistant' $D/docker-compose.yml | awk '{print $2}')"
echo "running: $(docker inspect homeassistant --format '{{.Config.Image}} started {{.State.StartedAt}}')"
echo "core: $(docker exec homeassistant python -c 'import homeassistant.const as c; print(c.__version__)')"
echo "python: $(docker exec homeassistant python -V)"
echo "## other containers"
docker ps --format '{{.Names}} {{.Image}}'
echo "## db (sqlite file, bytes)"; stat -c %s $D/config/home-assistant_v2.db
echo "## backups (newest 3, HA automatic backups)"; ls -1t $D/config/backups | head -3
echo "## compose backups (newest 3)"; ls -1t $D | grep '^docker-compose.yml.bak' | head -3
python3 - <<'PY'
import json, glob
S = "/root/homeassistant/config/.storage"
def load(n):
    return json.load(open(f"{S}/{n}"))["data"]
ents = load("core.config_entries")["entries"]
print("## integrations (config-entry domains)")
print(" ".join(sorted({e["domain"] for e in ents})))
print("## zwave/matter endpoints")
for e in ents:
    if e["domain"] in ("zwave_js", "matter"):
        print(e["domain"], e.get("data", {}).get("url", ""), e.get("disabled_by") or "enabled", sep="\t")
print("## custom_components")
for m in sorted(glob.glob("/root/homeassistant/config/custom_components/*/manifest.json")):
    d = json.load(open(m))
    print(d.get("domain"), d.get("version"), sep="\t")
print("## hacs repos")
try:
    repos = load("hacs.repositories")
    for r in (repos.values() if isinstance(repos, dict) else repos):
        if r.get("installed"):
            print(r.get("full_name"), r.get("category"), r.get("version_installed") or r.get("installed_commit"), sep="\t")
except Exception as ex:
    print("hacs.repositories unreadable:", ex)
print("## open repairs")
try:
    noise = 0
    for i in load("repairs.issue_registry")["issues"]:
        if i.get("dismissed_version") is not None:
            continue
        if i["domain"] == "hacs" and i["issue_id"].startswith("restart_required"):
            noise += 1
            continue
        print(i["domain"], i["issue_id"], i.get("breaks_in_ha_version") or "", sep="\t")
    print("(hacs restart_required repairs hidden:", noise, ")")
except Exception as ex:
    print("repairs unreadable:", ex)
PY
echo "## error/critical log lines since last start"
docker logs homeassistant 2>&1 | grep -cE ' (ERROR|CRITICAL) ' || true
REMOTE
