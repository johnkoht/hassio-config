# LEARNINGS — front_door_lock

- **`continue_on_error` can't catch the Level lock's timeouts.** The lock is HomeKit over Bluetooth through an ESPHome proxy. A stalled link raises an aioesphomeapi `TimeoutAPIError` after 30s, which isn't a `HomeAssistantError`, so HA re-raises it and the run ends. Retry by starting each attempt with `script.turn_on` (runs in the background, errors stay in the child) and `wait_template` on `locked`. See `front_door_lock_with_retry.yaml`. (2026-10-23)
- **A lock stuck at `locking`/`unlocking` means the Bluetooth link failed mid-command**, not that the door is mid-motion. HA keeps the guess until its next successful connection. The 2026-10-23 cause was year-old foyer proxy firmware; check the proxy's ESPHome version first. (2026-10-23)
- `front_door_lock_toggle_switch.yaml` still calls `lock.lock` directly (manual use; the stuck alert covers it).
