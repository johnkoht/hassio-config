# Kids iPad blocking (PRs #198, #200)

**What:** The Kids WiFi popup has a block toggle per kid's iPad. Each toggle is the UniFi 11 firewall policy switch (`switch.unifi_network_block_nino` / `_gianluca`). On means the policy is enabled, so the iPad is blocked: no internet, but it stays on WiFi. The secondary line shows Connected/Offline from `device_tracker.nino_ipad` / `gianluca_ipad`. Dashboard only.

**Learnings:**
- The `_2` suffix in the plan had gone by build time because the orphans were cleaned up. Re-read live ids at build, not plan time.
- Adding an SSID to UniFi's `ssid_filter` doesn't enable existing client trackers: they stay integration-disabled with MAC-derived ids (`unifi_default_<mac>`). Enable them and rename them to generic ids before the public repo references them.
- `device_tracker.ninos_ipad` was bound to a MAC that was a year stale, so its `not_home` meant nothing. Check a tracker's MAC against the controller before trusting it.
- `template-entity-row` with `toggle: true` draws `ha-entity-toggle` in its own shadow root, so `kohbo_boolean_entity_layout`'s `hui-generic-entity-row` path misses it and the switch renders stock. Use `kohbo_template_toggle_entity_layout.yaml`.

**Follow-ups:** delete the stale `device_tracker.ninos_ipad` / `ninos_ipad_old` and `switch.nino_s_ipad`. Optionally drop the two stale MACs from Block Nino. John hasn't explicitly reported a live block/unblock test.
