#!/bin/bash
# deploy.sh — lint, validate, deploy to Home Assistant
#
# Runs yamllint and HA config check locally before deploying.
# Use --skip-ci for rapid iteration (dashboards, quick fixes).
#
# HA_TARGET picks the host: "yellow" (HAOS, ha CLI) or "epicurus" (Docker).
# On epicurus, reloads use the REST API with a token kept only on the host
# at $HA_TOKEN_FILE (root-only, never in git).
#
# Runtime files (secrets, .storage, custom_components, certs, etc.) are
# gitignored and never touched by this script.

set -e

HA_TARGET="${HA_TARGET:-yellow}"
case $HA_TARGET in
  yellow)
    HA_HOST="${HA_HOST:-hassio}"
    HA_PATH="/homeassistant"
    ;;
  epicurus)
    HA_HOST="${HA_HOST:-epicurus}"
    HA_PATH="/root/homeassistant/config"
    HA_CONTAINER="homeassistant"
    HA_TOKEN_FILE="/root/homeassistant/.deploy_token"
    ;;
  *) echo "Unknown HA_TARGET: $HA_TARGET (yellow|epicurus)"; exit 1 ;;
esac
HA_USER="${HA_USER:-root}"
HA_VERSION=$(cat .HA_VERSION 2>/dev/null || echo "stable")
RESTART=false
RELOAD=false
DASHBOARD=false
SKIP_CI=false

usage() {
  echo "Usage: ./deploy.sh [--restart] [--reload] [--dashboard] [--check] [--skip-ci]"
  echo "  --restart    Full restart after deploy"
  echo "  --reload     Reload automations/scripts only (faster)"
  echo "  --dashboard  Reload dashboards only (instant)"
  echo "  --check      Run local validation only, no deploy"
  echo "  --skip-ci    Skip local lint/validation (fast iteration)"
  exit 1
}

for arg in "$@"; do
  case $arg in
    --restart)    RESTART=true ;;
    --reload)     RELOAD=true ;;
    --dashboard)  DASHBOARD=true ;;
    --skip-ci)    SKIP_CI=true ;;
    --check)      SKIP_CI=false; CHECK_ONLY=true ;;
    --help|-h)    usage ;;
    *)            echo "Unknown argument: $arg"; usage ;;
  esac
done

# --- Local CI ---

if ! $SKIP_CI; then
  echo "==> Linting YAML..."
  if ! command -v yamllint &>/dev/null; then
    echo "⚠️  yamllint not found. Install with: pip install yamllint"
    echo "   Skipping lint step."
  else
    yamllint -c .yamllint . || { echo "❌ Lint failed. Fix errors or use --skip-ci."; exit 1; }
    echo "    ✓ Lint passed"
  fi

  echo "==> Checking HA config (Docker, v${HA_VERSION})..."
  # secrets.yaml is human-managed and gitignored/unrecoverable — no script
  # (this one included) may write to, copy over, or delete it. Validation
  # runs against whatever secrets.yaml is already on disk.
  if ! command -v docker &>/dev/null; then
    echo "❌ Docker not found. Start Docker or use --skip-ci to bypass validation."
    exit 1
  else
    docker run --rm \
      -v "$(pwd):/config" \
      "ghcr.io/home-assistant/home-assistant:${HA_VERSION}" \
      python -m homeassistant --config /config --script check_config \
      || { echo "❌ Config check failed. Fix errors or use --skip-ci."; exit 1; }

    echo "    ✓ Config check passed"
  fi

  if [ "${CHECK_ONLY}" = true ]; then
    echo "==> Validation complete."
    exit 0
  fi
fi

# --- Deploy ---

remote() { ssh "$HA_USER@$HA_HOST" "$@"; }

# Calls an HA service on epicurus via REST, using the host-only token.
ha_service() {
  remote "curl -sf -o /dev/null -X POST \
    -H \"Authorization: Bearer \$(cat $HA_TOKEN_FILE)\" \
    http://127.0.0.1:8123/api/services/$1/$2" \
    || { echo "❌ $1.$2 failed (is $HA_TOKEN_FILE present and valid?)"; exit 1; }
}

echo "==> Pulling latest on $HA_HOST ($HA_TARGET)..."
remote "cd $HA_PATH && git pull --ff-only"

# A pull that silently does nothing (diverged checkout, no upstream) has
# shipped stale config before — fail loudly if the host isn't at our HEAD.
LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(remote "cd $HA_PATH && git rev-parse HEAD")
if [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
  echo "❌ $HA_HOST is at ${REMOTE_HEAD:0:7}, local is ${LOCAL_HEAD:0:7}. Push first, or fix the host checkout."
  exit 1
fi

echo "==> Validating config on HA..."
if [ "$HA_TARGET" = epicurus ]; then
  remote "docker exec $HA_CONTAINER python -m homeassistant --script check_config -c /config"
else
  remote "ha core check"
fi

if $RESTART; then
  echo "==> Restarting Home Assistant..."
  if [ "$HA_TARGET" = epicurus ]; then
    remote "docker restart $HA_CONTAINER"
  else
    remote "ha core restart"
  fi
  echo "==> Done. HA is restarting."
elif $RELOAD; then
  echo "==> Reloading automations and scripts..."
  if [ "$HA_TARGET" = epicurus ]; then
    ha_service automation reload
    ha_service script reload
  else
    remote "ha core reload-automations && ha core reload-scripts"
  fi
  echo "==> Done."
elif $DASHBOARD; then
  if [ "$HA_TARGET" = epicurus ]; then
    echo "==> YAML dashboards are re-read on load — refresh the browser."
  else
    echo "==> Reloading dashboards..."
    remote "ha core reload-lovelace"
    echo "==> Done."
  fi
else
  echo "==> Done. Run './deploy.sh --restart' or '--reload' to apply changes."
fi
