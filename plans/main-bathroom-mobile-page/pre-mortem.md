## Pre-Mortem: Main Bathroom Mobile Page

No `.build/expertise` profiles or dashboard LEARNINGS.md exist. Context comes from `dashboards/CLAUDE.md`, `review.md` and project memory.

### Risk 1: The door template fix changes other rooms (backward compatibility)

**Problem**: `kohbo_device_door_entity` is used in 8+ places: kitchen, office, foyer, playroom, jr_suite, gianluca, main_bedroom and security/exterior_doors. Some of those pass groups. Project memory says modern `platform: group` entities may publish no `entity_id` attribute, in which case those tiles have also been stuck on "Closed". A fallback that changes how real member-listing groups behave would regress them.

**Mitigation**: Only fall back when the attribute is missing or empty (`entity.attributes.entity_id?.length ? … : [entity.entity_id]`), so groups that list members behave exactly as before. In task 1, dump the live `entity_id` attribute of every entity passed to this template, and record which ones are fixed as a side effect.

**Verification**: Run the scratch check that lists each door-template entity with its member count. In the task 10 browser pass, recheck the main bedroom and exterior doors pages.

---

### Risk 2: Decluttering variable or include typos fail silently (test complexity)

**Problem**: Lovelace YAML has no tests, and the HA config check ignores it. A misnamed variable renders as a literal `[[var]]` or an empty card.

**Mitigation**: The task 9 scratch script cross-checks `variables` keys against the `[[...]]` tokens in each template file, and resolves every `!include` (`/config/` → repo root).

**Verification**: The script exits 0, and its output is pasted into build-log.md.

---

### Risk 3: Shared-file breakage (integration)

**Problem**: `kohbo.yaml`, `navbar.yaml`, `active_rooms.yaml` and `upper_floor_index.yaml` load on many pages. One bad indent or include in them can blank the whole dashboard.

**Mitigation**: Keep the diffs to these files minimal, each added by copying a neighbouring entry. Parse every touched file with `tests/run.sh --syntax` and yamllint. Put the door fix and the Gianluca fix in separate commits so each can be reverted alone.

**Verification**: `git diff --stat` shows a few lines changed in each shared file. The include-resolution check passes.

---

### Risk 4: Entities missing or unavailable live (context gaps)

**Problem**: The adaptive-lighting sleep switches, the automation entity IDs (derived from aliases) and the room card's `room:` string are all unverified.

**Mitigation**: In task 1, take a read-only live state dump over ssh (SUPERVISOR_TOKEN API) and save it to the scratchpad. Every entity in the new files is checked against it. Drop anything missing or flag it in the report.

**Verification**: The entity check script reports 0 missing and 0 unavailable, or the build log names each exception.

---

### Risk 5: Unverifiable until John deploys (rollback and environment)

**Problem**: The real rendering test needs a deploy, which only John does, and `deploy.sh --check` without `--skip-ci` deletes secrets.yaml.

**Mitigation**: Never run a deploy or restart. If a local check is needed, use only `./deploy.sh --check --skip-ci`. The ship ends with the PR and the task 10 checklist for after John deploys. Rollback is reverting the PR, since nothing is stateful.

**Verification**: No deploy command appears in the build log.

---

### Risk 6: Privacy in a public repo

**Problem**: The new files, docs and PR text could leak routines or PII.

**Mitigation**: Use only entity IDs and room names. The gitleaks pre-commit hook runs, and the diff is grepped before push.

**Verification**: The hook passes, and grepping the diff for addresses, emails or times finds none.

## Summary

Total risks identified: 6
Categories: backward compatibility, test complexity, integration, context gaps, environment/rollback, privacy
CRITICAL risks: none. Risk 1 is HIGH and is mitigated by the guarded fallback plus the live attribute dump.
