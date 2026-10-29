# Board pass on John's answers, 2026-10-29

John's answers on the Linear batch, shipped one /hotfix each.

- **Commute flag dwell 2 min → 90 s (JK-1134).** `*_is_commuting` waited 2 min at a station before setting the flag; John asked for ~90 s. The only place the value lived.
- **Camera alerts muted every morning (JK-1123).** `camera_notifications_deactivate` muted at sunrise+15 and after 30 min in Auto, so most days the cameras went quiet with nobody outside. Removed those clock triggers; activity (doors, garage, arrivals, occupied) still mutes. Enable/disable pushes now `passive` (dropped entirely at notification level "Important").
