# Working Memory — emergency-mode

Cross-task knowledge. Every developer reads this before starting and updates it after completing.

## Discovered Patterns
*(Add: [Task N] pattern-name: description at file:line)*

## Active Gotchas
- [Setup] Script `fields:` defaults do NOT apply at runtime. The engine gate must use `(priority | default('normal'))`.
- [Setup] A failed first-step `condition:` in a called script stops only that script; the caller continues.
- [Setup] `!include_dir_named packages/` keys by basename across the whole tree: new files need unique basenames (`emergency_*`).
- [Setup] Never run or trigger security_alarm_alert, fire_alarm_alert, Noonlight, sirens, panic or alarmo. Tests are static: YAML structure and Jinja2 rendering.

## Shared Utilities Created
*(Add: [Task N] functionName() in path/to/file)*

## Context Corrections
*(Add: [Task N] MISSING_CONTEXT: what was missing and where to find it)*

## Decision Ledger
*(Builder rulings that supersede or refine a documented rule. Entry: `[YYYY-MM-DD] ruling — docs affected: <paths or none-yet> — status: open|folded`.)*
