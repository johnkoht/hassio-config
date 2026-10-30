# Notification deep links, PR 1: transport and test scaffold (JK-1068)

**What:** `script.general_notification` now sends `url` (iOS) and `clickAction` (Android) from one value and omits both when no url is given. Before, it always sent `url: ""`. `tests/test_notification_deep_links.py` builds the dashboard map (view path to popup hashes) by following `!include` from `kohbo.yaml`, finds every phone push, and fails on a declared link that opens no view or popup. Pushes with no link are only counted (warning) until the plan's enforcing PR. Followed by 9 items (A alarm and fire, B cameras, C leak, D doors/locks/kids escape, E climate and weather, F house and everyday, G system alerts, enforce plus exempt list, popup extras). No call site was changed.

**Audit vs the plan:** 110 push sites, 25 linked (plan said about 108 and 21). New since the plan: garage evening autolock (3, linked to the lock view, can take the popup hash), safety-device offline (linked), watcher down (unlinked), medication low stock (unlinked, exempt). Full list in `plans/notification-deep-links/audit.md`.

**Learnings:**
- Android reads `clickAction`, iOS reads `url`; confirmed in the companion docs. Both take a dashboard path.
- Optional keys in a service payload: build a `link` dict variable (empty when no url) and `combine` it into a data template, so the key is absent rather than empty.
- The old `priority` variable was a multi-line template that returned literal quotes when priority was absent and relied on a second parse; it is now one line. The independent review found that gap because every test passed a priority.
- A finder test needs its own guard (known views and popups exist, bad links are rejected), or an empty map passes everything. It also needs `service_template`, and must skip the transport script's own notify templates.
- Declared links are enforced from now; templated links (camera PR B) are skipped on purpose and need an expansion test where they are added.

**Metrics:** 36 new tests, full suite 1141 passing; 9 sabotage checks, all red. Pre-mortem: 9 risks, none critical. Review: approve with suggestions, 2 defects, both fixed.

**Deploy:** script reload (`deploy.sh --reload`). First live check is John's: tap a push that has a link and one that has none.
