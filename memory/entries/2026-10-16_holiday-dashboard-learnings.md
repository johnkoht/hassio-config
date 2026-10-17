# 2026-10-16 · holiday-dashboard (JK-947, JK-1053, JK-1054)

**Metrics:** PR #44 (pages), plus #33 (plug repoint and Hue scene automation) and #41 (`scene.halloween_front_yard_spots`). #44: 9 commits, plan review + code review both APPROVED, no DEFECTs.

**+ Worked:** one shared settings popup for all three tabs, and in-season Home tiles as `conditional` cards on the season booleans (state conditions only; conditional cards reject `condition: template`). Front yard plug IDs live only in the `switch.front_yard_holiday_decorations` group, so the next controller migration is a one-file fix.
**− Didn't:** after deploy the pages didn't appear at all. kohbo is `mode: yaml` and HA re-reads it only when the root `kohbo.yaml` mtime changes; a manual `touch` fixed it, and #45 made `deploy.sh` do it after every pull.

**Gotchas:**
- An empty view include loads as `{}`: the view has no `path` and is only reachable by numeric index.
- A multi-entity `state` condition needs every entity to match, so one renamed plug silently blocked the Halloween automations (#33). Use any-on/any-off templates.
- `switch.christmas_lights` contains the front yard group, so it reads On in Halloween; the page hides it out of season, the group is unfixed.
- `deploy.sh --reload` reloads neither Groups nor Scenes; new ones need Developer Tools → YAML.
