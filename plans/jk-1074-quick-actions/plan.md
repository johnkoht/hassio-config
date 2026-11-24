---
title: Home Quick Actions
slug: jk-1074-quick-actions
status: draft
created: 2026-11-23
linear: JK-1074
has_pre_mortem: false
has_review: false
has_prd: false
related: [notification-deep-links, room-lighting-override, crazy-mode-v2]
---

# Home Quick Actions

## Problem

The Home view shows everything all the time. The things you would act on right now ("the light is still on and I'm in bed", "the vacuum is running") live in different places: a bell in the header, a banner at the bottom, a room page two taps away. JK-1074 asks for one contextual row that offers only the actions that make sense at this moment.

## Goal

A "Suggested actions" row on Home. Each suggestion appears only while it applies, does its job in one tap, and disappears when it no longer applies. With nothing to suggest, the row takes no space.

## Findings (verified in this tree)

- **Home banners are fixed to the screen, not in the page.** `horizontal_action_card_fixed` sets `position: fixed; bottom: 89px` (`dashboards/templates/decluttering/cards/horizontal_action_card_fixed.yaml`). Two banners that show together would draw on top of each other. The vacuum banner and Crazy Mode banner already share one slot by design (the vacuum banner requires `crazy_mode_phase` = Off). The new row must therefore be an in-page row, not a fourth fixed banner.
- **The vacuum case already exists.** `home/_vacuum_active_notification.yaml` shows pause, play and "return to base" for `vacuum.main_floor_vacuum` while it is `cleaning`, `paused` or `idle`. Return to base is one tap. John's "robot just started, stop and dock" is, in practice, already built. I would not duplicate it (see Q1).
- **Notifications have no count.** `#notifications` (`shared/kohbo_notification_popup.yaml`) is a list of 20 `conditional` cards. Each shows or hides by its own state or numeric condition. Nothing aggregates them, and nothing is "unread": they are live conditions that clear when the problem clears. So the honest feature is "N things need attention", not "unread".
- **Room presence works, the link target does not map 1:1.** `sensor.<person>_room_presence` is an HA `area_id` (e.g. `main_bedroom`; `not_home` and `unknown` are also possible). Dashboard room views are `rooms-<slug>` (19 views, listed in `kohbo.yaml`). Area ids in the repo are inconsistent with those slugs in places (`nino_room`, `mud_room` and `mudroom` all appear in presence code), and the area registry is not in the repo. The area to path map must be built from the live registry, not guessed.
- **Existing stale links.** `rooms/partials/main_floor_room_cards.yaml` navigates to `/dashboard-kohbo/office`, `/family-room` and others, while the views are registered as `rooms-office`, `rooms-family-room`. This looks like a bug but is out of scope; I will confirm on the live dashboard and file a BACKLOG item if so.
- **Bed and light signals exist.** `binary_sensor.john_bed_occupied`, `binary_sensor.cristina_bed_occupied`, `input_boolean.john_is_in_bed` (and one per person), `binary_sensor.somebody_in_bed`. Bedroom lights: `light.main_bedroom_lights` (ceiling plus two Hue lamps, group), `light.main_bedroom_all_lights` (adds the bathroom). `light.main_bedroom_main_lights` is the ceiling only and is the entity the manual-override automation watches.
- **A manual off from the dashboard sets the room's manual latch.** `main_bedroom_lights_manual_change` treats a user-initiated change on `light.main_bedroom_main_lights` as a hand change. That is the intended behaviour for "I turned them off myself", so the chip should turn off the group and let that existing logic run. No new latch.
- **No per-user pattern in the repo yet.** There is no `condition: user` or `hass.user` use anywhere in `dashboards/`. HA user ids are identifiers, so in this public repo they go through `!secret`, not inline.
- **Tests.** Dashboard YAML tests parse with `!include` kept as strings (`tests/test_dashboard_views.py`); template rendering tests use a small jinja harness (`tests/test_kitchen_cooking_detection.py`). Both patterns fit here.

## Proposed design

### Shape: template binary_sensor per suggestion, chip per sensor

Each suggestion is a trigger-free `template` binary_sensor that says "this applies now". Logic lives in one place and is testable. The dashboard only maps sensor to chip.

- File per suggestion under `packages/house/quick_actions/` (one job per file, per repo style), plus one `quick_actions_any` binary_sensor (OR of the others, per person where needed).
- Row on Home: one `conditional` (`condition: state` on `quick_actions_any`, because conditional cards reject `condition: template`) wrapping a `custom:mod-card` using `page_chip_layout_wrap.yaml` (the plain `page_chip_layout` pins height 45px and would clip). Inside it, each chip is its own `conditional` on its sensor. The outer conditional is what keeps the empty row from leaving a 45px gap.
- Placement: in-flow, directly under the Quick Overview block and above Security Overview. Banners stay as they are.
- Chip look: the existing `kohbo_chip_card` template. Icon plus short label. Tap does the action with `haptic: medium`, matching the banners.
- button-card renders `custom_fields` as HTML, so labels are static text. No entity text is interpolated into a chip.

### Per person

Two people drive the bed and room suggestions. Approach:

1. Per-person sensors with generic names (`binary_sensor.john_suggest_bed_light_off`, `binary_sensor.cristina_suggest_bed_light_off`, and so on).
2. Each person's chips carry `visibility: condition: user` with their HA user id from `!secret` (`john_ha_user_id`, `cristina_ha_user_id`; placeholders in `secrets.fake.yaml`).
3. A device with no matching user (a shared wall tablet logged in as a family account) sees only the house-wide suggestions. See Q3.

I considered a single sensor with a list attribute rendered by one button-card JS block. It is less YAML but untestable in pytest and hides logic in JS. Rejected.

### v1 suggestions

| # | Suggestion | Shows when | Tap | Notes |
|---|---|---|---|---|
| 1 | Turn off bedroom lights | person's `*_bed_occupied` on for 2 min, and `light.main_bedroom_lights` on | `light.turn_off` on the group | The 2-min `for:` stops flapping while getting into bed. Only the person in bed sees it. If both are in bed, both see it (Q2). |
| 2 | Go to your room | person's `room_presence` is a mapped area | navigate to `rooms-<slug>` | Mapped areas only. Hidden for `not_home`, `unknown` and unmapped areas. |
| 3 | N notifications | count of active notification conditions is above 0 | navigate `#notifications` | Needs the new count sensor, below. Label "3 need attention", not "unread". |
| 4 | Vacuum | covered by the existing banner | n/a | Dropped from v1 unless John wants the banner replaced (Q1). |

Note on #2: Home is not a room page, so "not the room you are already on" is moot there. The chip shows whenever the person is in a mapped room. It is a Home-view feature only in v1.

### Area to room map (suggestion 2)

A Lovelace card cannot look up a path from an entity state without JS, so there are two options:

- (a) one chip per mapped room, each a conditional on `room_presence == <area>`. About 19 small chips per person, written once, static and readable. Condition `state` on `sensor.<person>_room_presence` works directly with no helper sensor.
- (b) one chip with a button-card JS `tap_action` that builds the path from the sensor state. Smaller YAML, needs JS testing in the live DOM.

Default: (a). It is dull but needs no new sensors, no JS, and fails safe (an unmapped area shows nothing). The map becomes a test: every area in the list must have a registered view path.

### Notification count (suggestion 3)

New `sensor.notifications_active_count` in `packages/house/quick_actions/`. It re-expresses each of the 20 popup conditions in one template. That is a second copy of the rules, so drift is the real risk. Mitigation is a parity test: parse every file in `dashboards/kohbo/shared/notifications/` and assert that the set of entities its conditions reference equals the set the count sensor references (minus an explicit, commented exempt list, e.g. the commented-out water shortage card). A new popup card without a count entry fails the test.

Alternative considered: put a badge on the header bell instead of a chip. It is the more natural spot and could come later using the same sensor.

### Not in v1

No automation acts on its own. These are buttons only. No new popups. Header bell stays.

## Ranked extra ideas (from real entities in the repo)

Each is "show only when relevant, one tap". Ranked by value for effort, using entities already present.

1. **Close the garage** ("garage open at night"): `cover.garage_doors` open after sunset or in Bedtime mode. Tap closes. Existing `garage_doors_auto_close_timeout` automation handles the timeout; this is the manual shortcut.
2. **Lock the front door**: `lock.front_door` unlocked, house mode Bedtime or Away. One tap `lock.lock`. Pairs with the security overview.
3. **Arm the alarm for the night**: `alarm_control_panel.alarmo` disarmed and `binary_sensor.somebody_in_bed` on. One tap runs the existing arm-at-bedtime path (confirm which script).
4. **Nino medication given**: when the dose reminder is active (`input_boolean.nino_medication_1_taken` / `_2_taken` off inside the dose window), chip calls `script.nino_medication_taken`. The notification popup already has these two cards; this puts them one tap from Home. Highest daily value, but touches a medical flow, so I would ship it after v1 and keep its behaviour identical to the existing buttons.
5. **Move laundry along**: `input_select.main_level_washer_status` / `_dryer_status` / `upstairs_washer_status` reads "done" -> chip "Laundry ready" linking to the laundry room view.
6. **Turn off the house**: the "Turn Off the House" button exists in `house_mode_popup.yaml`; surface it when leaving (everyone's room is `not_home` but lights are on).
7. **Kids bedtime check**: lights on in the kids' rooms while `input_select.house` is Bedtime; one tap turns them off.
8. **Do Not Disturb**: `input_boolean.john_dnd` is on when a call is detected; offer "Clear DnD" when the call has ended and DnD is still on. Needs a look at the current DnD sources first.
9. **Crazy Mode quick stop**: already in its own banner; no action.

## Files (expected)

- `packages/house/quick_actions/` (new): `bed_light_off_john.yaml`, `bed_light_off_cristina.yaml`, `notifications_active_count.yaml`, `quick_actions_any.yaml` (+ `LEARNINGS.md` once there is a lesson).
- `dashboards/kohbo/home/_quick_actions.yaml` (new row) and one `!include` in `home/home.yaml`.
- `secrets.fake.yaml`: two placeholder user ids. Real ids go in the gitignored `secrets.yaml` by John (or via the homelab agent).
- `docs/`: update `dashboards/kohbo/home/README.md` file tree and `dashboards/SITEMAP.md`.
- `tests/test_quick_actions.py` (new).

## Test plan

Run with `PYTHONPATH=tests /Users/johnkoht/code/hassio-config/tests/.venv/bin/python -m pytest -q tests`.

1. Template rendering for the bed-light sensor: bed off or lights off gives off; both on gives on; `unavailable` bed sensor gives off (no suggestion on missing data).
2. Notification parity test (above). Plus a sabotage check: add a fake card in a temp dir copy and see it fail.
3. Room links: every area in the chip list has a view in `kohbo.yaml`; no duplicate chip for an area.
4. Row shape: outer `conditional` uses `condition: state` only (no `template`), row uses `page_chip_layout_wrap`, and the file is included from `home.yaml`.
5. No real user id, address or area-identifying value in committed files (gitleaks hook runs on commit).
6. Syntax: existing `test_modern_syntax`, `test_yaml_syntax`, `test_naming`, `test_entity_references`, `test_dashboard_views` stay green.

Manual checks after deploy (John or the homelab agent, read-only for me): the row appears and collapses to nothing when empty; the chip row does not clip at phone width; the dashboard cache is refreshed by touching the root `kohbo.yaml` (deploy does this). Dashboard-only changes, so no HA restart. The new template sensors need a Template reload (`--reload` does not reload them), which John does.

## Risks

- **Two copies of the notification rules** (mitigated by the parity test).
- **Wrong area ids** make a room chip silently never show. Mitigation: build the map from the live area registry via the `homelab` agent before writing it.
- **User ids in a public repo.** Mitigation: `!secret` only, placeholders in `secrets.fake.yaml`. If `!secret` is not accepted inside a visibility `users:` list in dashboard YAML, fall back to person-based sensors and drop the per-user chip filter (Q3). I will verify this in the build phase on a render, not assume it.
- **Chip row height.** Using the wrap layout and an outer conditional, verified against the live DOM per John's earlier lesson on dashboard CSS, not reasoned from the source.
- **Hue lamps** in the bedroom group can be offline; `light.turn_off` on a group with an unavailable member still works for the rest.

## Open questions for John

1. **Vacuum.** The banner already offers pause, play and "return to base". Keep it as is and skip the vacuum chip? (Default: yes.)
2. **Who sees "turn off bedroom lights"?** Default: only the person whose bed sensor is on. If the other person is still reading, they may not want it. Alternative: show to both, or require both beds occupied.
3. **How do you open the dashboard?** Per person on a phone (user filter works), or on a shared wall tablet? A shared tablet cannot be "John" or "Cristina". Default: per-user chips on phones, house-wide chips for any device.
4. **"Your room" chip.** Default is the Home view only. Do you also want it as a chip in the header, or on every room page ("jump to where I am")?
5. **Notifications.** OK with "N need attention" instead of "unread"? And badge on the bell later?
6. **Extra ideas.** Which of the ranked list do you want in v1 (default: none beyond the four, add garage close, lock front door, and the Nino medication chip as a v2)?

## Out of scope

Automations that act without a tap; per-room contextual panels on room pages; Android widgets; changing the notification popup; the stale `/dashboard-kohbo/office`-style links (BACKLOG candidate).
