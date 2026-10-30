"""
Regression tests for emergency mode, PR 3: alarm lifecycle (JK-1149, JK-1165).

STATIC ONLY. Nothing here runs a script, calls Home Assistant, or touches
Noonlight, the sirens, alarmo or the panic button. Noonlight dispatches real
emergency services and switching it off does not cancel, so these tests read
the YAML and render Jinja2 only.
"""
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
ALARM = REPO / "packages/security/alarm/alarm_triggered.yaml"
FIRE = REPO / "packages/security/fire_alarm/fire_alarm_triggered.yaml"
PANIC = REPO / "packages/security/alarm/panic_button.yaml"
ALARM_DIR = REPO / "packages/security/alarm"
NOONLIGHT = "switch.noonlight_alarm"
TEST_MODE = "input_boolean.alarm_test_mode"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def parallel(path, script):
    return load(path)["script"][script]["sequence"][0]["parallel"]


def gated_noonlight(branches):
    """The `if` branch that guards the Noonlight call."""
    (branch,) = [b for b in branches if "if" in b]
    return branch


SCRIPTS = [(ALARM, "security_alarm_alert"), (FIRE, "fire_alarm_alert")]


def dispatches(branch, test_mode_state):
    """Evaluate the guard the way HA would: a state condition on a missing or
    non-`on` helper is false, so the `else` (the dispatch) runs."""
    (cond,) = branch["if"]
    assert cond == {"condition": "state", "entity_id": TEST_MODE, "state": "on"}
    chosen = branch["then"] if test_mode_state == "on" else branch["else"]
    return any(a.get("action") == "switch.turn_on" and a["target"]["entity_id"] == NOONLIGHT
               for a in chosen)


@pytest.mark.parametrize("path,script", SCRIPTS)
def test_noonlight_is_skipped_only_when_test_mode_is_explicitly_on(path, script):
    branch = gated_noonlight(parallel(path, script))
    assert dispatches(branch, "on") is False
    for state in ("off", "unknown", "unavailable", None):  # None = helper missing
        assert dispatches(branch, state) is True, state


@pytest.mark.parametrize("path,script", SCRIPTS)
def test_noonlight_branch_cannot_hold_up_the_alert(path, script):
    branches = parallel(path, script)
    (call,) = [a for a in gated_noonlight(branches)["else"]]
    assert call["continue_on_error"] is True
    # the sirens/announcement/flash/push branches are still siblings in the same parallel
    entities = str(branches)
    assert "script.critical_announcement" in entities
    assert "script.alarm_flash_lights" in entities
    assert "script.general_notification" in entities


def test_noonlight_is_only_ever_called_from_the_two_gated_else_branches():
    """No other file (and no ungated step) may dispatch Noonlight."""
    hits = []

    def walk(node, path, in_else):
        if isinstance(node, dict):
            for k, v in node.items():
                if k == "action" and (str(v).startswith("noonlight.")
                                      or (v == "switch.turn_on" and NOONLIGHT in str(node))):
                    hits.append((path, in_else))
                walk(v, path, in_else or k == "else")
        elif isinstance(node, list):
            for v in node:
                walk(v, path, in_else)

    for p in (REPO / "packages").rglob("*.yaml"):
        text = p.read_text()
        if "noonlight" not in text:
            continue
        walk(load(p), p.name, False)
    assert sorted(hits) == [("alarm_triggered.yaml", True), ("fire_alarm_triggered.yaml", True)]


def test_fire_alert_text_names_the_cancel_path_and_test_mode():
    branches = parallel(FIRE, "fire_alarm_alert")
    push = next(b for b in branches if b.get("target", {}).get("entity_id") == "script.general_notification")
    template = push["data"]["variables"]["message"]
    env = Environment(undefined=StrictUndefined)
    for state, expect in (("on", "NOT notified"), ("off", "cancel")):
        env.globals["is_state"] = lambda e, s, st=state: (e, s) == (TEST_MODE, st)
        text = env.from_string(template).render()
        assert expect in text
        assert "get to safety" in text.lower()
    env.globals["is_state"] = lambda e, s: False
    text = env.from_string(template).render()
    assert "Noonlight app" in text and "dispatcher" in text and "cannot cancel" in text


def test_test_mode_helper_resets_and_expires():
    cfg = load(ALARM_DIR / "alarm_test_mode.yaml")["input_boolean"]["alarm_test_mode"]
    assert cfg["initial"] is False  # deliberate: it must come back off after a restart
    auto = load(ALARM_DIR / "alarm_test_mode_auto_off.yaml")["automation"][0]
    state = next(t for t in auto["triggers"] if t["trigger"] == "state")
    assert state["entity_id"] == TEST_MODE and state["to"] == "on" and state["for"] == {"minutes": 30}
    assert any(t["trigger"] == "homeassistant" for t in auto["triggers"])
    assert any(t.get("event_type") == "automation_reloaded" for t in auto["triggers"])
    assert auto["actions"][0]["action"] == "input_boolean.turn_off"


def test_test_mode_notification_follows_the_helper():
    on = load(ALARM_DIR / "alarm_test_mode_notify_on.yaml")["automation"][0]
    off = load(ALARM_DIR / "alarm_test_mode_notify_off.yaml")["automation"][0]
    assert on["triggers"][0]["to"] == "on" and off["triggers"][0]["to"] == "off"
    assert on["actions"][0]["action"] == "persistent_notification.create"
    assert off["actions"][0]["action"] == "persistent_notification.dismiss"
    assert (on["actions"][0]["data"]["notification_id"]
            == off["actions"][0]["data"]["notification_id"])
    assert "NOT notify Noonlight" in on["actions"][0]["data"]["message"]


def test_alarm_test_mode_files_have_unique_basenames_and_matching_ids():
    for name in ("alarm_test_mode", "alarm_test_mode_auto_off",
                 "alarm_test_mode_notify_on", "alarm_test_mode_notify_off"):
        hits = [p for p in (REPO / "packages").rglob(f"{name}.*") if p.is_file()]
        assert len(hits) == 1, hits
        if name != "alarm_test_mode":
            assert load(hits[0])["automation"][0]["id"] == name


def test_disarm_off_path_fires_on_any_exit_from_triggered():
    auto = next(a for a in load(ALARM)["automation"] if a["id"] == "security_alarm_disabled")
    (trigger,) = auto["triggers"]
    assert trigger["entity_id"] == "alarm_control_panel.alarmo"
    assert trigger["from"] == "triggered"
    assert "to" not in trigger  # not just `disarmed`: trigger time ending goes back to an armed state
    assert set(trigger["not_to"]) == {"unavailable", "unknown"}


def test_panic_triggers_alarmo_and_keeps_its_device_trigger():
    auto = load(PANIC)["automation"][0]
    (trig,) = auto["triggers"]
    assert trig["domain"] == "zha" and trig["trigger"] == "device"
    assert trig["subtype"] == "remote_button_short_press" and trig["type"] == "remote_button_short_press"
    assert trig["device_id"] == "7bc8344290f9b88df35fe372e93be11e"  # do not change: re-pairing keeps the id
    (step,) = auto["actions"]
    (trigger_call,) = step["else"]
    assert trigger_call["action"] == "alarm_control_panel.alarm_trigger"
    assert trigger_call["target"]["entity_id"] == "alarm_control_panel.alarmo"
    assert "code" not in str(trigger_call)  # alarmo needs no code to trigger (verified read-only on 1.10.18)


def test_panic_falls_back_to_the_alert_only_when_alarmo_is_down():
    step = load(PANIC)["automation"][0]["actions"][0]
    (cond,) = step["if"]
    assert cond["entity_id"] == "alarm_control_panel.alarmo"
    assert set(cond["state"]) == {"unavailable", "unknown"}
    assert [a["action"] for a in step["then"]] == ["script.security_alarm_alert"]
    assert "security_alarm_alert" not in yaml.safe_dump(step["else"])


def test_noonlight_is_mentioned_nowhere_else_in_the_config():
    """Widened scan: no automation, script, dashboard or esphome file may name
    Noonlight outside the two alert scripts (and the one switch.turn_off)."""
    roots = ["automation", "scripts", "automations.yaml", "scripts.yaml", "scenes.yaml",
             "dashboards", "esphome", "blueprints", "custom_templates", "configuration.yaml", "packages"]
    # the test-mode files only mention it in comments and the notification text
    allowed = {"alarm_triggered.yaml", "fire_alarm_triggered.yaml", "alarm_test_mode.yaml",
               "alarm_test_mode_notify_on.yaml"}
    offenders = []
    for root in roots:
        base = REPO / root
        files = [base] if base.is_file() else list(base.rglob("*")) if base.exists() else []
        for f in files:
            if f.is_file() and f.suffix in {".yaml", ".yml", ".json", ".py", ".j2"} and f.name not in allowed:
                if "noonlight" in f.read_text(errors="ignore").lower():
                    offenders.append(str(f.relative_to(REPO)))
    assert offenders == []
