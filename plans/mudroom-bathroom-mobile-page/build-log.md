# Build log: mudroom-bathroom-mobile-page (JK-1222)

Validation run 2026-10-16 against the committed branch.

## Commits

```
432ce7a docs: mudroom bathroom page in SITEMAP, rooms README and LEARNINGS
02a7f75 fix(mudroom_bathroom): remove initial_state from the automations
6b1f5bb feat(house): add the mudroom bathroom room sensor
285c9cd feat(dashboards): register the mudroom bathroom page and room card
a4b4f9b feat(dashboards): mudroom bathroom room page
f8db5a5 plan: mudroom-bathroom-mobile-page
```

## tests/run.sh --syntax

```
collected 268 items / 161 deselected / 107 selected
===================== 107 passed, 161 deselected in 1.82s ======================
exit 0
```

## tests/run.sh (full, packages/ touched)

```
================== 259 passed, 9 skipped, 7 warnings in 8.64s ==================
```

## yamllint -c .yamllint (every touched yaml)

```
dashboards/kohbo/kohbo.yaml
dashboards/kohbo/rooms/active_rooms.yaml
dashboards/kohbo/rooms/main_floor/main_floor_index.yaml
dashboards/kohbo/rooms/main_floor/mudroom_bathroom.yaml
dashboards/kohbo/rooms/main_floor/partials/mudroom_bathroom_card.yaml
packages/house/areas/first_floor/mudroom_bathroom_room.yaml
packages/house/areas/rooms_groups.yaml
packages/mudroom_bathroom/fan/mudroom_bathroom_fan_off.yaml
packages/mudroom_bathroom/lights/mudroom_bathroom_lights_motion_on.yaml
packages/mudroom_bathroom/lights/mudroom_bathroom_lights_off.yaml
packages/mudroom_bathroom/modes/mudroom_bathroom_mode_auto.yaml
packages/mudroom_bathroom/modes/mudroom_bathroom_mode_off.yaml
packages/mudroom_bathroom/modes/mudroom_bathroom_not_occupied.yaml
packages/mudroom_bathroom/modes/mudroom_bathroom_occupied.yaml
yamllint exit 0 (14 files)
```

## Dashboard validator (origin/master...HEAD)

```
note: unavailable dashboards/kohbo/rooms/main_floor/mudroom_bathroom.yaml binary_sensor.mudroom_bathroom_door
note: unavailable dashboards/kohbo/rooms/main_floor/partials/mudroom_bathroom_card.yaml binary_sensor.mudroom_bathroom_door
files 5 problems 0
exit 0
```

The door note is expected (decision 1).

## Entity ID collision

```
sensor.mudroom_bathroom_room absent from live states
sensor.mudroom_bathroom absent from live states
```

## initial_state

```
$ git grep -n initial_state packages/mudroom_bathroom
(no output, exit 1)
```

## PII

Grepped the added lines of `git diff origin/master...HEAD` for emails, phone numbers, street addresses, GPS-like decimals, clock times and routine keywords. Only hits were the word "work" in plan prose; nothing personal.
