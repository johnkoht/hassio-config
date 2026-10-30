## Pre-Mortem: Notification deep links (PR 1 in detail, whole plan in outline)

Run 2026-10-30 against master 204c36b. Scope of this run: whole plan, PR 1 (transport fix and test scaffold) built now.

### Risk 1: The transport change silences or corrupts every push

**Problem**: `general_notification` carries all phone pushes, including fire, alarm and leak. The fix replaces the inner `data:` mapping with one rendered template. A Jinja slip, or a value that renders to a non-dict, would drop `tag`, `image`, `actions` or the interruption level on every push, or fail the call.
**Mitigation**: Keep the template minimal: same six keys, `combine(link)` for the optional pair. Render it in tests the way HA does (StrictUndefined, `literal_eval`) for: url set, url empty, url absent, actions list, actions absent, critical priority. Assert every non-link key is identical with and without a link. Sabotage each assertion.
**Verification**: tests named for each case; sabotage runs go red. Severity: HIGH (blast radius is large, change is small and tested).

### Risk 2: An empty url reaches the phone

**Problem**: Today `url: ""` is always sent. The owner rule is that an empty url is never sent, on either key.
**Mitigation**: `link` is `{}` when `url | length == 0`; `combine` adds nothing. Tests for url `""` and url absent assert neither `url` nor `clickAction` is a key.
**Verification**: `test_empty_url_sends_neither_key`, sabotage S3.

### Risk 3: Existing callers change behaviour

**Problem**: 86 call sites pass no url; 25 pass one. Callers that pass `actions` as a list, or numeric tags, could render differently.
**Mitigation**: No caller file is touched. `actions | default('')` preserves the undefined case. The `tag` variable is natively parsed before it reaches the data template, so a numeric tag is the same type as before.
**Verification**: full suite green; diff touches one package file. Review follow-up: the `priority` variable is now a one-line template (the old multi-line form returned literal quotes when priority was absent and relied on a second parse); a test covers absent and empty priority.

### Risk 4: The test passes while checking nothing

**Problem**: A map builder that finds no views or hashes would accept or reject everything.
**Mitigation**: Guard tests assert known views and popups exist; a negative test proves bad links are caught (missing view, missing popup, popup on the wrong view, non-dashboard path). Sabotage the hash collector and a wrong-view link.
**Verification**: S4, S5, S6 red.

### Risk 5: Popup hash opens only when the view includes it

**Problem**: The plan's map is grepped by hand and may rot. A hash defined in a shared popup but not included in a view would pass a hash-only check.
**Mitigation**: The test builds the map from `kohbo.yaml` by following `!include`, and checks view-plus-hash pairs.
**Verification**: `security#front_door_camera` is rejected in a test.

### Risk 6: Report-only mode hides gaps

**Problem**: Unlinked pushes only warn, so they could be forgotten.
**Mitigation**: A generated `audit.md` lists all 110 sites; the test emits a count warning; PR 9 of the plan flips enforcement. Declared links are enforced from now.
**Verification**: audit.md in the PR.

### Risk 7: Android key is wrong

**Problem**: The plan worked from memory of the companion docs.
**Mitigation**: Checked 2026-10-30 against the companion docs: iOS reads `url`, Android reads `clickAction`, both take dashboard paths. Both are sent from one value.
**Verification**: noted in LEARNINGS; test asserts the two are equal.

### Risk 8: Deploy and reload

**Problem**: Script changes need a script reload; a stale script keeps the old payload.
**Mitigation**: `deploy.sh --reload` reloads scripts. Nothing else needs a reload. John deploys.
**Verification**: deploy note in the PR.

### Risk 9: Privacy

**Problem**: Public repo; audit lists paths of family automations.
**Mitigation**: Paths only, no titles or messages, and the paths already exist in the repo. Memory and docs use generic wording.
**Verification**: grep the diff before push; gitleaks hook runs on commit.

### Later PRs (outline, no CRITICAL)

- PR D (doors, locks, kids escape) is blocked on decision 6 (which sensors). Not built.
- Camera PR B: the templated per-camera hash must be tested by expanding all cameras; the test already skips templated links on purpose, so PR B must add the expansion.
- Popup-before-link ordering for task 10 extras.

## Summary

Total risks identified: 9 (plus outline). Categories: backward compatibility, test complexity, integration, environment, documentation, privacy.
CRITICAL risks (must address before proceeding): none
