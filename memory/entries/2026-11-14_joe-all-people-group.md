# Joe missing from group.all_people

The house went Away with Joe home because `person.joe_falbo` was in no group: the July 2025 refactor of `packages/people/people_groups.yaml` rewrote `guests` and left him out. He is now listed directly under `all_people`. Putting him in `extended_family` was rejected in review: it nests into `guests`, so `guest_mode` would follow him and a second "guest mode enabled" line would play after his arrival announcement. New test `tests/test_people_groups_membership.py` checks every referenced person is in `all_people`, except the kids. Reload: groups only.
