# Chores View

Parent-facing surface for ChoreOps. Its job is approvals — the kids' surface is
the mudroom family board, not this page.

## Files

| File | Purpose |
|---|---|
| `chores.yaml` | The view (`path: chores`) |
| `components/chores_settings_popup.yaml` | Pause toggle + point adjustments, behind the gear |
| `../../templates/button_cards/chores/kohbo_chore_approval_card.yaml` | One pending claim, with Approve / Needs Work |
| `../../templates/button_cards/chores/kohbo_chore_kid_card.yaml` | Per-kid balance, rank, today's progress |
| `../../templates/button_cards/chores/kohbo_chore_points_button.yaml` | One manual emerald adjustment |
| `../../templates/decluttering/chores/chore_day_list.yaml` | One kid's full chore list |
| `../../../packages/chores/chores_dashboard_sensors.yaml` | The pending count behind the chip |

Registered in `../kohbo.yaml` (view) and `../../templates/includes/navbar.yaml`
(More menu) — `kiosk_mode` hides HA's own tabs, so without the navbar entry the
page is reachable only by typing the URL.

## Entity seams

Everything reads ChoreOps' per-kid roll-up, `sensor.<kid>_choreops_ui_dashboard_helper`:
`chores[]`, `rewards[]`, `pending_approvals{chores,rewards}`, `badges[]`, `core_sensors`.

The approvals list does **not** hardcode chore slugs. `auto-entities` filters
`sensor.*_choreops_chore_status_*` on `state: claimed`, and the card derives both
button targets from the sensor's own entity_id:

```
sensor.nino_choreops_chore_status_homework
button.nino_choreops_approve_chore_homework
button.nino_choreops_disapprove_chore_homework
```

Add, rename, or delete a chore in ChoreOps and this page follows with no edit here.

## Gotchas

- **Chore names are the primary key in ChoreOps.** Renaming a chore is delete +
  create, which mints new entity_ids. The derivation above survives that; a
  hardcoded list would not.
- **Don't reference the stale entities.** The recorder's `states_meta` carries 41
  orphaned rows from deleted test chores and the old ±1/±2 emerald buttons. Only
  the 191 in `core.entity_registry` are real.
- **Needs Approval is deliberately not gated on a template sensor.** Its title
  lives on the entities card, so auto-entities' `show_empty` hides header and
  rows together. A separate gate would be a second source of truth that can
  fail hidden while real claims wait — the failure mode in
  `packages/school/LEARNINGS.md` where `condition: state` goes false on
  `unavailable`.
- Approval also happens from the push notification (Approve / Needs Work /
  Remind in 30). This page is the fallback for a missed notification, not the
  only path.
- **Display names come from `chore_name` / `reward_name`, never `friendly_name`** —
  HA's is `Nino (ChoreOps) Chore Status - Homework`.
