# 2026-10-12 — toggles-ble-dropoff-hotfix

Three /hotfix bugs in one PR (#20). Reviewer: APPROVED; its one same-bug
backlog item (embedded toggle override) folded in.

## Notes

- Toggle knob overshoot: HA's Web Awesome switch moves the thumb with the
  individual CSS `translate` property, which `transform` overrides don't
  reset. Found by grepping the live `hass_frontend` bundle on the Yellow
  (`docker exec homeassistant`) — faster than guessing from screenshots.
- Nino's "entity not found" row: ESPresense node re-flashed as an ESPHome BT
  proxy; dead entity ID only visible against the live registry.
- Gianluca's drop-off: window anchored on runtime-editable departure time
  closed before the bell after departure was moved earlier; also a 3-min
  zone hold longer than a real drop-off. Diagnosed from the recorder by a
  subagent (verified, not inferred); replay of the two misses confirmed the
  fix. Now start-anchored like Nino's.
- Privacy: removed a drop-off clock time from three comments; it remains in
  git history (rewrite not done — owner's call).
- Backlog: dedupe the two toggle overrides; template the two drop-off files;
  Gianluca has no missed-drop-off push like Nino's.
