# 2026-09-10 — doorbell-event-entity-migration

Doorbell stopped chiming. UniFi Protect moved the G4 Doorbell Pro ring from
`binary_sensor.front_door_camera_doorbell` to `event.front_door_camera_doorbell`.
Fixed the trigger and deleted the dead legacy doorbell code. Commit `af5ae9d`,
branch `fix/doorbell-event-entity`. Reviewer: APPROVED, first pass.

## What made this diagnosable

Live recorder evidence, not inference. The binary_sensor was 43h stale while the
event entity had fired the same day (12:11:02Z), and before 2026-09-08 the two
moved in lockstep — identical timestamps on 09-08 14:57, 09-04 08:03, 09-03 20:31.
That pinned the regression window precisely and ruled out "always dead."

There is no HA repair issue and no deprecation warning for the binary_sensor. The
integration still creates it and still reports it enabled. It just went quiet.
**Enabled + not-unavailable is not evidence an entity is working** — only
`last_changed` is.

## The mistake worth keeping

I told John `notify.security_detection_display_devices` was "not defined anywhere
in the repo" and framed a deletion as riskier than it was. It *is* defined — as a
package-embedded notify group whose service ID is slugified from
`name: "Security Detection Display Devices"`. Grepping the slug could never have
found it. I had the containing directory in a listing I'd already pulled and read
the filename without opening it.

Second-order lesson: I also wrongly asserted the camera proxy was probably broken,
reasoning from the same class of evidence gap (a subagent's registry grep). Both
errors were "absence in the place I looked" read as "absence." Full pattern in
`packages/security/cameras/LEARNINGS.md`.

## Scope discipline held

Three adjacent bugs surfaced and all three stayed out of the fix, per the hotfix
skill's one-bug rule:

- `house_mode_vacation.yaml:34` sets `option: Please do not disturb!`, which is not
  one of the select's six valid options — raises `ServiceValidationError` when it
  runs. Never observed firing in the 8-day log window, so "never triggered" vs
  "errored and rolled off" is undetermined.
- Backyard porch camera proxy sources a non-existent entity; silently dead.
- `doorbell_ring` is `mode: single`, so a second ring during the ~15s chime chain
  is dropped, not queued. Reviewer recommends `queued`. Pre-existing.

## Gate not run

`ha core check` needs the Yellow and validates *deployed* code, so it could not
cover this branch. Local validation was YAML-parse + structural assert + a
dangling-reference sweep. The real regression test is a live ring after deploy.
