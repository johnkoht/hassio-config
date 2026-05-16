# Scratchpad

## Dev Lifecycle (CI/CD)

Improve the development workflow with proper validation and deployment pipeline.

- `.yamllint` — YAML linting config tuned for HA style
- `secrets.fake.yaml` — stub secrets for CI validation
- `.pre-commit-config.yaml` — yamllint hook runs before every commit
- `.github/workflows/ha-check.yml` — GitHub Actions CI (yamllint + frenck/action-home-assistant)
- Auto-deploy on merge (optional, requires Tailscale or webhook)
- `deploy.sh` enhancements — add `--dashboard` flag for fast Lovelace reloads

## Local Development

Run HA locally in Docker for rapid iteration, especially dashboards.

- `docker-compose.dev.yml` — local HA instance mounting config dir
- Dev entities package (`packages/dev/`) with stub states (gitignored)
- Possibly use `demo` integration for fake entity population
- Dashboard hot-reload on browser refresh (no deploy needed)
- Hybrid workflow: local Docker for visual work, deploy.sh for automation testing
