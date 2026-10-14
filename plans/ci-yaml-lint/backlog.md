# CI YAML Lint — seed notes (not a plan yet)

Raw findings from 2026-10-14. Run `/plan` in a fresh session.

## Problem

`.github/workflows/ha-check.yml` runs yamllint over the whole repo, and the HA config check only runs if lint passes (`needs: yamllint`). Lint has failed on every run: there are 0 green runs in the last 200. So **the HA config check has never run on a PR**, and the deploy's `ha core check` on the Yellow is the only real config gate. PR #23 went through on yamllint of the changed files, a local Jinja harness, and that deploy-time check.

## Size (run 38502257690, PR #23)

2,773 errors across 446 files:
- trailing-spaces: 2,339
- new-line-at-end-of-file: 268
- indentation: 102
- key-duplicates: 5
- colons: 3
- commas: 1

## Possibly real bugs: the duplicate keys

YAML keeps only the last value, so check each one is intentional:
- `automation/misc/today_is_full_moon.yml:50`: `speech_message`. This is a `.yml` file, so it's never loaded (see the auto-memory). Probably dead.
- `dashboards/templates/button_cards/people/john.yaml:74`: `entity`
- `dashboards/templates/decluttering/climate/thermostat_popup.yaml:49`: `entity`
- `dashboards/templates/decluttering/climate/kohbo_room_temperature_card.yaml:15`: `decimals`
- `dashboards/kohbo/rooms/main_floor/mudroom.yaml:175`: `entity`

## Options

1. **Decouple:** drop `needs: yamllint` so `ha-check` always runs. This is the cheapest way to get the real gate back.
2. **Lint changed files only:** pass the PR diff to yamllint instead of `.`.
3. **Mechanical cleanup:** strip trailing spaces and add final newlines in one commit (about 94% of the errors), then fix indentation and duplicates by hand. Exclude dead or legacy trees (`popup/` with Swedish-named files, `.yml` files, `button_card_templates.yaml`?) via `ignore:` in `.yamllint`.

Likely shape: do 1 now, and do 3 as a separate cleanup PR with 2 as the interim. Keep `deploy.sh`'s local lint in step (it lints `.` too).

## Related

- `tests/run.sh` hardcodes `/root/config`, so locally it validates nothing. Either make `CONFIG_ROOT` repo-relative or document it as host-only.
- The main checkout's `tests/.venv` Python symlinks to the Xcode stub, so it's broken.
