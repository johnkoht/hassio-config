## Review: Kids WiFi Schedule

**Type**: Plan · **Review Path**: Full · **Complexity**: Medium · **Recommended Track**: standard (full /ship)
**Reviewer**: independent agent (different model), read-only, verified claims against the code.

### Verdict

**Approve with suggestions**, with no structural blocker. The items marked MUST were wrong or unbuildable as written, and were fixed in plan.md before the PRD.

### Concerns and resolution

| # | Concern | Severity | Resolution |
|---|---|---|---|
| 1 | Pre-mortem guard used `trigger.entity_id`, which the repo never uses with time triggers | MUST | Use a `trigger.id` → helper map |
| 2 | Plan didn't state the school-sensor asymmetries (tomorrow ignores the override; parochial has `availability:`; overrides reset at 23:58) | suggestion | Added a Semantics section |
| 3 | Binding to grade-band sensors duplicates the per-kid mapping | suggestion | Added package-local `binary_sensor.kids_school_tomorrow` / `kids_school_today` |
| 4 | "Exactly one off per night" only holds approximately: a closure posted between the two off times passes both triggers, but the second is a no-op | suggestion | Claim softened; the switch-state condition makes it idempotent |
| 5 | Plan pointed at a prototype worktree that no longer exists | MUST | Removed; file layout fully specified |
| 6 | UI entry point vague | MUST | Kids WiFi `kohbo_device_entity` tile after the Main Floor Vacuum tile; popup include after the House Mode include |
| 7 | The deep-link test only checks push URLs, so "the hash must resolve" tested nothing | MUST | Replaced with a hash/include grep plus a live open |
| 8 | Popup pattern detail: the conditional times block, plus margin for a tall popup | suggestion | Reuse the garage-lock conditional block; verify margin live |
| 9 | Master toggle is a condition, not a trigger | suggestion | Stated in the plan |
| 10 | A dead entity silently no-ops forever | suggestion | Task 1 gate plus a live off/on test after deploy |
| 11 | Docs list incomplete | suggestion | SITEMAP Home popups list, home/README file tree, AUTOMATIONS |
| 12 | Privacy: popup text and examples must not carry times | suggestion | AC: no `HH:MM` anywhere in the diff |
| DA | A skipped "on" after an HA restart leaves the kids offline all day, which is worse than a skipped "off" | MUST | Added `kids_wifi_on_after_restart` catch-up |

### Devil's advocate

**If this fails, it will be because** the switch entity is wrong or churns again, and the `switch is on` condition swallows it silently.
**The worst outcome would be** the network staying off through a school day after a restart. That is now covered by the catch-up.
