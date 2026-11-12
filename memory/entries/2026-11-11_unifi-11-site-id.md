# UniFi trackers all unavailable after UniFi Network 11.0 (no PR, host fix)

**What:** A guest arrived and wasn't announced or marked home. The cause was house-wide. UniFi Network updated overnight from 10.6.109 to 11.0.99, and the site `_id` changed from a 24-hex id to a UUID (the old one is kept as `legacy_id`). HA 2026.7.4 (aiounifi 91) looks the site up by the config entry's `unique_id`. The next entry reload failed with `KeyError: '<old id>'` in `hub.initialize`, and HA doesn't retry that error. About 200 UniFi device_trackers went unavailable. A `person` backed only by UniFi went `unknown`, so its `not_home` → `home` arrival trigger couldn't fire.

**Fix:** With HA stopped, the UniFi entry's `unique_id` in `.storage/core.config_entries` was set to the new site UUID (from `/proxy/network/api/self/sites`), then HA was started. All entities, names and options were kept. Reload and Reconfigure both fail ("site can no longer be found"). Delete and re-add would also work, but it loses the entry's options and risks entity customizations.

**Learnings:**
- A config entry that fails setup with a plain exception stays failed silently. This outage went unnoticed for six hours.
- Katia's `person` had only the UniFi tracker plus a ping tracker that doesn't exist (its file is `.DISABLED`). Her bayesian presence sensor reached 0.95 on `katia_iphone_detect` alone, below the 0.97 threshold. `device_tracker.katia_ping_tracker_2` works but nothing uses it.
- The recorder on epicurus is still SQLite (`home-assistant_v2.db`). `ha-postgres` has had no new rows since 11-07.
- HA 2026.11 enforces Verify SSL on the UniFi entry (home-assistant/core#190593). Keep it off for the UDM's self-signed cert.

**Follow-ups:** Katia presence hardening: point `katia_presence` at `katia_ping_tracker_2`, and swap the missing tracker on `person.katia` for `katia_iphone_detect`. An alert for config entries stuck in setup-error. The Postgres recorder migration is unfinished.
