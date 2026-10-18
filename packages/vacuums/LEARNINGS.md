# LEARNINGS — packages/vacuums/

**Read your own last run from `this`, never from another automation's entity_id (2026-10-17).** `main_level_vacuum_evening_cleaning` read `last_triggered` from `automation.vacuum_clean_dining_and_foyer_at_night`. Entity IDs come from the alias, so a rename left it reading `None`, the "every other night" check always passed, and the vacuum ran nightly for months. `this.attributes.last_triggered` is the previous run (it updates after conditions pass) and survives restarts. Compare local calendar dates, not seconds: the old `/108000` was a 30-hour day.
