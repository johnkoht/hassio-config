"""
Regression tests for the front door lock Bluetooth timeouts.

The Level lock's lock.lock can raise a non-HomeAssistantError timeout,
which continue_on_error can't catch. Reads repo files relative to this
test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
LOCK_DIR = REPO / "packages/foyer/front_door_lock"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(path.read_text(), Loader=_Loader)


def walk(node):
    """Yield every dict in a nested action/sequence structure."""
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for item in node:
            yield from walk(item)


def actions_called(steps):
    return [step["action"] for step in walk(steps) if "action" in step]


@pytest.mark.parametrize("name", [
    "front_door_auto_lock.yaml",
    "front_door_lock_if_open_too_long.yaml",
])
def test_lock_automations_use_retry_script(name):
    """A single lock.lock that times out ends the run with the door unlocked."""
    auto = load(LOCK_DIR / name)["automation"][0]
    called = actions_called(auto["actions"])
    assert "script.front_door_lock_with_retry" in called
    assert "lock.lock" not in called


def test_retry_script_runs_attempts_in_background():
    """Calling lock.lock inline would let a Bluetooth timeout abort the retry loop."""
    scripts = load(LOCK_DIR / "front_door_lock_with_retry.yaml")["script"]
    retry = scripts["front_door_lock_with_retry"]["sequence"]
    assert "lock.lock" not in actions_called(retry)

    turn_ons = [step for step in walk(retry) if step.get("action") == "script.turn_on"]
    assert [s["target"]["entity_id"] for s in turn_ons] == ["script.front_door_lock_attempt"]
    assert any("repeat" in step for step in retry), "retry script must loop"
    assert "script.general_notification" in actions_called(retry)

    attempt = scripts["front_door_lock_attempt"]["sequence"]
    (step,) = attempt
    assert step["action"] == "lock.lock"
    assert step["target"]["entity_id"] == "lock.front_door"


def test_stuck_lock_alert_triggers_on_transitional_states():
    auto = load(LOCK_DIR / "front_door_lock_stuck_alert.yaml")["automation"][0]
    (trigger,) = auto["triggers"]
    assert trigger["entity_id"] == "lock.front_door"
    assert set(trigger["to"]) == {"locking", "unlocking"}
    assert trigger.get("for"), "needs a for: so normal 1-2s transitions don't alert"


@pytest.mark.parametrize("path", sorted((REPO / "esphome").glob("*.yaml")))
def test_esphome_configs_avoid_removed_proxy_path(path):
    """esphome/firmware no longer ships bluetooth-proxy/; builds fail on that path."""
    assert "esphome/firmware/bluetooth-proxy/" not in path.read_text()
