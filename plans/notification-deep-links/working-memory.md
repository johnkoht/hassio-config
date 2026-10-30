# Working Memory: notification-deep-links

## Discovered Patterns
- [Task 1] Test loaders: plain loader returns None for HA tags; the dashboard loader follows !include with /config/ mapped to the repo root. See tests/test_notification_deep_links.py.

## Active Gotchas
- [Task 1] HA renders a `>-` data template to a dict only via literal_eval; keep values plain strings, lists and dicts.
- [Task 1] Camera detection links (PR B) are templated; the test skips `{{` links on purpose, so PR B must add an expansion test.

## Shared Utilities Created
- [Task 1] dashboard_map(), link_problem(url, views), push_calls() in tests/test_notification_deep_links.py

## Context Corrections
- [Task 1] Audit on master 204c36b: 111 push sites, 25 linked (plan said about 108 / 21). See audit.md.

## Decision Ledger
