# jk-1194-climate-on-leaving-places — 2026-11-25

**Metrics:** 1 automation, 9 new tests (sabotage-checked by the reviewer), 1 reviewer pass (APPROVED).

**What shipped:**
- `climate_resume_when_leaving_labelled_zone`: when an adult leaves a zone labelled `climate_trigger` while the house is empty, the Nests that are in Eco resume, through the existing per-floor resume scripts.
- Adding a place is a label change in the UI, no YAML edit.

**Worked:**
- Reading the label in a template condition at trigger time. `trigger: zone` takes fixed entity ids, and a template sensor would go stale if a zone were labelled while someone was in it.
- `not_to: [unavailable, unknown]` on the state trigger, so GPS attribute updates don't reset the `for:` wait.

**Process note:** this run skipped `/plan-to-prd` and `/build`. The change was one file, built directly after the plan, with one reviewer pass. There is no PRD for it, on purpose.

**Gotchas:**
- Only UI-created zones can take a label.
- It only helps once a floor is in Eco (Eco starts after 30 minutes empty); the 60-minute Eco trigger can undo a resume.

**Follow-ups:**
- After the smart-climate migration this becomes an input to `climate_mode_resolve` and the automation is removed.
- Check the first real leave in the logbook for `automation.climate_resume_when_leaving_a_labelled_zone`.
