# Board pass on John's answers, 2026-10-29

John's answers on the Linear batch, shipped one /hotfix each.

- **Commute flag dwell 2 min → 90 s (JK-1134).** `*_is_commuting` waited 2 min at a station before setting the flag; John asked for ~90 s. The only place the value lived.
- **Camera alerts muted every morning (JK-1123).** `camera_notifications_deactivate` muted at sunrise+15 and after 30 min in Auto, so most days the cameras went quiet with nobody outside. Removed those clock triggers; activity (doors, garage, arrivals, occupied) still mutes. Enable/disable pushes now `passive` (dropped entirely at notification level "Important").
- **"Turn Off the House" button cleared John's DnD (JK-1186).** It showed `house_occupied` but turned off `john_dnd`. Now a toggle on `house_occupied`, label and confirmation templated by state (the off warning names the siren/monitoring risk with people home). It's the only dashboard control for `house_occupied`, hence the toggle. Backlog: turning back on during bedtime leaves the house in Away (`house_mode_auto` requires bedtime off).
