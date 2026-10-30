# Pre-mortem: john-dnd-simplify

No CRITICAL risks.

- HIGH: office_dnd_on/off must move triggers AND conditions to binary_sensor.john_dnd_active together; test it.
- HIGH: set_focus_mode triggers on john_dnd -> off; move to john_dnd_active -> off.
- HIGH: johns_mbp_2026_* go unavailable when the Mac sleeps; camera-light off conditions must use `not ... on`, not `state: off`.
- MEDIUM: personal-Mac sensors have never been seen on; done is gated on John's live call test.
- MEDIUM: confirm binary_sensor.john_dnd_active is not already in the registry.
- LOW: dashboard JS string references; grep after edit.
