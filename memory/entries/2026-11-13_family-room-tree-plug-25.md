# JK-1252 family room tree on a new plug

The small tree moved to `switch.family_room_smart_plug_25`. Changed the Christmas Trees group, the Small Tree tile on the Christmas page, the tree daily energy meter source, and the pinned test. Plug 4 stays as the family room North Wall Outlet and a Zigbee router, so its dashboard tile and router alert are untouched. The new plug's energy is a separate total_increasing series, so the tree meter restarts at zero. Reload: Groups (Developer Tools, YAML) for the group switch; utility_meter needs its own reload or a restart.
