#!/bin/bash
# deploy.sh — lint, validate, deploy to hassio
#
# Runs yamllint and HA config check locally before deploying.
# Use --skip-ci for rapid iteration (dashboards, quick fixes).
#
# Runtime files (secrets, .storage, custom_components, certs, etc.) are
# gitignored and never touched by this script.

set -e

HA_HOST="${HA_HOST:-hassio}"
HA_USER="${HA_USER:-root}"
HA_PATH="/homeassistant"
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
  if ! command -v docker &>/dev/null; then
    echo "⚠️  Docker not found. Skipping config check."
  else
    # Copy fake secrets into place for validation
    cp secrets.fake.yaml secrets.yaml 2>/dev/null || true

    docker run --rm \
      -v "$(pwd):/config" \
      "ghcr.io/home-assistant/home-assistant:${HA_VERSION}" \
      python -m homeassistant --config /config --script check_config \
      || { rm -f secrets.yaml; echo "❌ Config check failed. Fix errors or use --skip-ci."; exit 1; }

    rm -f secrets.yaml
    echo "    ✓ Config check passed"
  fi

  if [ "${CHECK_ONLY}" = true ]; then
    echo "==> Validation complete."
    exit 0
  fi
fi

# --- Deploy ---

echo "==> Pulling latest on $HA_HOST..."
ssh "$HA_USER@$HA_HOST" "cd $HA_PATH && git pull"

echo "==> Validating config on HA..."
ssh "$HA_USER@$HA_HOST" "ha core check"

if $RESTART; then
  echo "==> Restarting Home Assistant..."
  ssh "$HA_USER@$HA_HOST" "ha core restart"
  echo "==> Done. HA is restarting."
elif $RELOAD; then
  echo "==> Reloading automations and scripts..."
  ssh "$HA_USER@$HA_HOST" "ha core reload-automations && ha core reload-scripts"
  echo "==> Done."
elif $DASHBOARD; then
  echo "==> Reloading dashboards..."
  ssh "$HA_USER@$HA_HOST" "ha core reload-lovelace"
  echo "==> Done."
else
  echo "==> Done. Run './deploy.sh --restart' or '--reload' to apply changes."
fi
