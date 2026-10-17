# Build log: powder-room-mobile-page (JK-1223)

Validation run 2026-10-16 against the committed branch.

## Commits

```
b70c716 docs: powder room page in SITEMAP, rooms README and LEARNINGS
c1c58a5 feat(powder_room): turn the light off when the room empties
625e13b fix(powder_room): clear occupancy when the light goes off
8f7bec4 fix(powder_room): remove initial_state from the automations
2bc5b52 feat(house): add the powder room room sensor
764e1bc feat(dashboards): register the powder room page and room card
30bced4 feat(dashboards): powder room page
bb30b6f plan: powder-room-mobile-page
```

## Entity re-check (task 1, live dump 2026-10-17T00:25Z)

```
input_boolean.powder_room_occupied          on (last_changed 2026-09-30T01:17Z, stuck)
input_select.powder_room                    Auto
light.powder_room_main_lights               off, supported_color_modes ['brightness']
fan.powder_room_fan                         off
sensor.powder_room_fan_instantaneous_demand 0.0
binary_sensor.powder_room_door              unavailable (expected, decision 1)
automation.powder_room_lights_off           on (id powder_room_lights_off)
automation.powder_room_fan_off              on (id powder_room_fan_off)
input_boolean.vacuum_powder_room_at_night   off
automation.powder_room_{mode_auto,mode_off,occupied,not_occupied}  on
sensor.powder_room_room                     absent
sensor.powder_room                          absent
find packages -name powder_room_room.yaml   (none before this branch)
```

## tests/run.sh --syntax

```
collected 271 items / 164 deselected / 107 selected
===================== 107 passed, 164 deselected in 1.68s ======================
exit 0
```

## tests/run.sh (full, packages/ touched)

```
================== 262 passed, 9 skipped, 7 warnings in 8.41s ==================
```

origin/master now collects 269 tests (260 pass); the only new ones are the two in
`tests/test_powder_room_regressions.py` (collect-only diff against an archive of origin/master).

## Sabotage: not-occupied light conditions (commit 625e13b)

Fixed file copied to the scratchpad first; each revert restored from that copy.

```
## sabotage line 42 -> state: on
E           assert 'on' == 'off'
1 failed in 0.02s
## restored from scratch copy
1 passed in 0.01s
## sabotage line 56 -> state: on
E           assert 'on' == 'off'
1 failed in 0.02s
## restored from scratch copy
1 passed in 0.01s
```

## Sabotage: lights off when empty (commit c1c58a5)

```
## baseline
2 passed in 0.01s
## sabotage: unoccupied trigger (lines 9-12) deleted
E       assert False
1 failed, 1 passed in 0.02s
## restored from scratch copy
2 passed in 0.01s
```

## yamllint -c .yamllint (every touched yaml)

```
dashboards/kohbo/kohbo.yaml
dashboards/kohbo/rooms/active_rooms.yaml
dashboards/kohbo/rooms/main_floor/main_floor_index.yaml
dashboards/kohbo/rooms/main_floor/partials/powder_room_card.yaml
dashboards/kohbo/rooms/main_floor/powder_room.yaml
packages/house/areas/first_floor/powder_room_room.yaml
packages/house/areas/rooms_groups.yaml
packages/powder_room/fan/powder_room_fan_off.yaml
packages/powder_room/lights/powder_room_lights_off.yaml
packages/powder_room/modes/powder_room_mode_auto.yaml
packages/powder_room/modes/powder_room_mode_off.yaml
packages/powder_room/modes/powder_room_not_occupied.yaml
packages/powder_room/modes/powder_room_occupied.yaml
yamllint exit 0 (13 files)
git diff --check origin/master...HEAD: exit 0
```

## Dashboard validator (origin/master...HEAD)

```
note: unavailable dashboards/kohbo/rooms/main_floor/partials/powder_room_card.yaml binary_sensor.powder_room_door
note: unavailable dashboards/kohbo/rooms/main_floor/powder_room.yaml binary_sensor.powder_room_door
files 5 problems 0
exit 0
```

The door note is expected (decision 1).

## initial_state

```
$ git grep -n initial_state packages/powder_room
(no output, exit 1)
```

## PII

Grepped the added lines of `git diff origin/master...HEAD` for emails, phone numbers, street addresses, GPS-like decimals, clock times and routine keywords. Only hit was the word "work" in plan prose; nothing personal.

## Notes

- Decision 8 says to keep "the light-is-on and lighting-automations checks". `powder_room_lights_off` has a lighting-automations *trigger*, not a condition, so the trigger is kept and no condition was added. Adding one would also gate the mode-Off path, which the AC says must not change. This matches the mudroom bathroom twin.
- SITEMAP "Last updated" was already October 16, 2026, so it wasn't bumped.
- The popup's `calc(100vh - 425px)` margin is unverified until the browser pass.
