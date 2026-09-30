# LEARNINGS — packages/transit/

- **The sensors are `unavailable` when there's no data**, meaning outside 06:45–09:00, the train not running yet, or a fetch error. Their attributes, including `error`, are hidden then; run `docker exec homeassistant python3 /config/bin/metra_train.py 1` to see why.
  - This is because `command_line` renders `value_template` to a string, so `none` would become `"None"`.
- **Metra's feed has no `delay` field**, so `bin/metra_train.py` computes delay as predicted arrival minus the scheduled time. Both come from the secrets `metra_trains` / `metra_stop` config, not hard-coded — edit secrets to change trains, times, or stop.
- **The configured stop drops out of a trip once the train passes it**, so `not_in_feed` after departure is normal.
