# Bermuda Migration — Pre-Deployment Review

_Adversarial review of branch `bermuda-migration-sweep` before house-wide rollout. 2026-07-27._

## Verdict: READY WITH CAVEATS
No blockers. Sweep vocabulary verified complete/correct vs the 39 HA area_ids for the 3
migrated people (John/Cristina/Nino). Resolve the items below before scaling house-wide.

## HIGH
- **H1 — `indoor_bluetooth_device_count` not rebuilt.** `packages/bluetooth/bluetooth_device_count.yaml:9-15`
  still sums `sensor.espresense_*_count`; consumed by entertainment-mode on/off
  (`packages/house/entertainment/entertainment_mode_turn_{on,off}.yaml`). Reads 0 once
  ESPresense is decommissioned. → Rebuild from Bermuda before Phase 4, or drop + simplify.
- **H2 — Stale group comment.** `packages/people/people_groups.yaml:62` says
  `# - sensor.nino_ipad_room_presence` — that entity was renamed to `sensor.nino_room_presence`
  this branch. Uncommenting as-is references a nonexistent entity. → Update the comment now.

## MEDIUM
- **M1 — Wrapper `not_home` conflates "away" with "home-but-untracked."** Wrapper defaults
  `not_home` when no proxy resolves an area (`john_room_presence.yaml`), instead of gating on
  `device_tracker.<device>_bermuda_tracker` as the plan intended. Impact is LOW (presence
  bayesians have 5-6 other home trackers; won't flip), but gating is strictly safer + matches
  intent. → Gate the 3 wrappers on the Bermuda device_tracker, or document the behavior.
- **M2 — Nino wrapper is orphaned + escape-monitor interaction.** `sensor.nino_room_presence`
  is in neither group; no `nino_person` exists. `nino_escape_monitor.yaml:13` fires only when
  his room reads empty — wiring a STATIONARY iPad would make his room read permanently
  occupied and **break the escape monitor**. → Only wire if the iPad travels with him.
- **M3 — Plan §9 audit claim is wrong (methodology).** §9 claims "zero bayesian `to_state`/
  `is_state` consumers of changing rooms." False — live ones exist (`john_sleeping.yaml:13`,
  `cristina_sleeping.yaml:22`, `john_in_bed_bayesian.yaml:23`, `john_do_not_distrub_bayesian.yaml:72`,
  `main_bedroom_john_night_light.yaml:19,69`, `office_dnd.yaml:110`) — but they reference
  UNCHANGED rooms (`main_bedroom`, `office`), so the sweep is correct today. → Fix the §9 text;
  future rename sweeps must audit `to_state:`/`to:`/`is_state` too, not just `selectattr`.

## LOW
- **L1 — `mudroom` → `mud_room`** deferred correctly (no proxy); fix when proxy added.
- **L2 — Sleep detection resilient** (FSR bed sensor dominates; room_presence secondary).
- **L3 — `area_id()` edge cases fine** (apostrophes/spaces resolve; None falls through). Define
  a tie-break when John's watch is enrolled (prefer phone / nearest proxy).
- **L4 — Orphaned artifacts:** delete `*.disabled` files; purge orphaned registry entries
  (`sensor.living_room_presence`, `*_room_presence_raw`, `nino_ipad_room_presence`) in Phase 4.
- **L5 — Non-migrated people pre-existing mismatch (NOT a branch regression).** ESPresense nodes
  slugify to `master`/`family`/`living`/`dining`/`basement` — never matched consumer strings; the
  normalization `if rp == "main_bedroom"` branches are effectively dead code. Unverifiable from
  static config → live check (Q6).

## Confirmed correct
Sweep complete vs 39 area_ids (only deferred `mudroom` differs); no changed room string has a
stray live consumer; living→dining rename clean; person-attr passthrough intact; dropping
`*_two`/`_bedstand` correct; home-away automations untouched; `area_id()` None-handling correct.

## Open questions (discuss)
1. **M1** — gate wrappers on Bermuda `device_tracker`, or keep + document?
2. **M2** — is Nino's iPad stationary (leave inert) or does it travel (wire in)? + fix H2.
3. **H1** — rebuild `indoor_bluetooth_device_count` from Bermuda, or drop?
4. **L3** — multi-device tie-break when watch is enrolled: prefer phone or nearest proxy?
5. **Restart** — confirm a full `ha core restart` (not reload) for cutover.
6. **Q6 live check** — dump `sensor.{antoun,sonia,tayta,katia,joe,mary}_room_presence` states
   before rollout; confirm none silently drop out of dining/basement/nino/gianluca rooms.

## Deploy checklist
- [ ] `ha core check` passes
- [ ] Fix `people_groups.yaml:62` (H2)
- [ ] Decide Nino wiring (M2) + wrapper gating (M1)
- [ ] Plan device-count rebuild before Phase 4 (H1)
- [ ] Q6 live-state check
- [ ] Full `ha core restart`
- [ ] Validate `sensor.john_room_presence` tracks room-to-room post-restart
- [ ] Phase 5 ESP-proxy hardening (gating for fleet reliability)
