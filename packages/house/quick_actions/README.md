# Quick Actions

Visibility sensors for the Home quick actions pop-up (`#quick_actions`, see the [home README](../../../dashboards/kohbo/home/README.md)).

- `binary_sensor.quick_action_*` - one per contextual row; on when the row applies.
- `sensor.quick_actions_<person>_count` - rows showing, for the header chip badge. DnD and camera rows aren't counted.
- The room sensors hold the area list inline; keep it in step with the pop-up's "Go to" rows (a test checks).
