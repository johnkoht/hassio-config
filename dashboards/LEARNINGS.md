# LEARNINGS — dashboards/

**Switch overrides must reset `translate`, not just `transform`.** HA's Web Awesome `ha-switch` moves its thumb with the individual CSS `translate` property (±(width−height)/2), which stacks on any `left`-based positioning. Two overrides (`kohbo_boolean_entity_layout.yaml`, `card_mod/entities/input_boolean_embedded.yaml`) hung the knob 9px off both ends until `translate: none !important` was added (2026-10-12). Change both together.

**Entity rows go "not found" silently after a device re-flash.** Nino's ESPresense node became an ESPHome BT proxy and its row kept pointing at the dead ID. Check the live entity registry, not the repo, when a row breaks.

**Toggle rows use `kohbo_boolean_entity_layout.yaml`; `entity_no_icon.yaml` is for datetime/value rows.** A new settings section copied its datetime neighbour's include onto three input_booleans, and the reviewer passed it (2026-10-12). When briefing dashboard work, name the row include explicitly.

**Grep only the registry's `entities` list.** `core.entity_registry` also carries `deleted_entities`, so a plain grep "finds" dead IDs — that shipped a second dead ID in #20.
