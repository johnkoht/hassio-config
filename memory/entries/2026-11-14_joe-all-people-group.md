# Joe missing from group.all_people

The house went Away with Joe home because `person.joe_falbo` was in no group: the July 2025 refactor to `packages/people/people_groups.yaml` rewrote `guests` and left him out. He is now in `extended_family` (nests into `guests` and `all_people`), restoring the old guests membership. Side effect: `guest_mode` turns on while Joe is home. New test `tests/test_people_groups_membership.py` checks every referenced person is in `all_people`, except the kids. Reload: groups only.
