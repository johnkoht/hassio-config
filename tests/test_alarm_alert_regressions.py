"""
Regression tests for the fire and intruder alert paths (JK-1165).

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel_path):
    return yaml.load((REPO / rel_path).read_text(), Loader=_Loader)


def first_parallel(script):
    first = script["sequence"][0]
    assert "parallel" in first, "alert must start with a parallel block"
    return first["parallel"]


def find_branch(branches, action, entity):
    for branch in branches:
        if branch.get("action") != action:
            continue
        ids = branch.get("target", {}).get("entity_id")
        ids = ids if isinstance(ids, list) else [ids]
        if entity in ids:
            return branch
    raise AssertionError(f"no {action} branch for {entity}")


def test_fire_alarm_triggers_on_live_smoke_detector():
    """smoke_detector_2 doesn't exist, so the fire alarm could never fire."""
    auto = load("packages/security/fire_alarm/fire_alarm_triggered.yaml")["automation"][0]
    assert [t["entity_id"] for t in auto["triggers"]] == ["binary_sensor.smoke_detector"]


def test_fire_alert_runs_in_parallel_with_hvac_isolated():
    """A Nest cloud call must not delay or abort the announcement."""
    script = load("packages/security/fire_alarm/fire_alarm_triggered.yaml")["script"]["fire_alarm_alert"]
    branches = first_parallel(script)
    find_branch(branches, "script.turn_on", "script.critical_announcement")
    find_branch(branches, "script.turn_on", "script.alarm_flash_lights")
    find_branch(branches, "script.turn_on", "script.general_notification")
    assert find_branch(branches, "climate.turn_off", "climate.nest_main_floor").get("continue_on_error") is True


def test_intruder_alert_sirens_do_not_wait_on_noonlight():
    """Noonlight is a cloud call; it must not hold up or abort the sirens."""
    script = load("packages/security/alarm/alarm_triggered.yaml")["script"]["security_alarm_alert"]
    branches = first_parallel(script)
    sirens = find_branch(branches, "switch.turn_on", "switch.alarm_siren_1")
    assert "switch.alarm_siren_2" in sirens["target"]["entity_id"]
    assert "switch.noonlight_alarm" not in sirens["target"]["entity_id"]
    find_branch(branches, "script.turn_on", "script.critical_announcement")
    find_branch(branches, "script.turn_on", "script.alarm_flash_lights")
    find_branch(branches, "script.turn_on", "script.general_notification")
    noonlight = next(b for b in branches if "if" in b)["else"][0]  # gated on alarm test mode
    assert noonlight["target"]["entity_id"] == "switch.noonlight_alarm"
    assert noonlight.get("continue_on_error") is True


def test_flash_lights_snapshots_each_light_not_the_group():
    """A group snapshot restores every member to the group's any-on state."""
    script = load("packages/security/fire_alarm/alarm_flash_lights.yaml")["script"]["alarm_flash_lights"]
    snapshot = script["sequence"][0]
    assert snapshot["action"] == "scene.create"
    entities = snapshot["data"]["snapshot_entities"]
    assert entities != "light.emergency_light_group"
    assert "expand('light.emergency_light_group')" in entities
    # restart would let a second call snapshot the flashing lights
    assert script["mode"] == "single"


def test_alarm_disabled_stops_the_flash_and_restores_the_lights():
    """The intruder alarm keeps the lights on until disarm (X3); disarm then puts
    back the snapshot the flash took. The snapshot may be missing (restart)."""
    script = load("packages/security/alarm/alarm_triggered.yaml")["script"]["security_alarm_disabled"]
    seq = script["sequence"]
    (stop,) = [s for s in seq if "if" in s]
    assert stop["if"][0]["entity_id"] == "script.alarm_flash_lights"
    assert [a["action"] for a in stop["then"]] == ["script.turn_off"]
    restore = next(s for s in seq if s.get("action") == "scene.turn_on")
    assert restore["target"]["entity_id"] == "scene.alarm_flash_lights_initial_state"
    assert seq.index(restore) > seq.index(stop)  # stop the flash first, then restore
    # a failed restore must not skip the notification
    assert restore.get("continue_on_error") is True
