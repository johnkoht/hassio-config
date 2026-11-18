"""The router alert follows the zigbee_router label via sensor.zigbee_routers_online (JK-1263)."""
import ast
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jinja2
import yaml

REPO = Path(__file__).resolve().parent.parent
ALERT = REPO / "packages/system/alerts/zigbee_router_unavailable.yaml"
NOW = datetime(2026, 11, 17, 12, 0, tzinfo=timezone.utc)
ROUTERS = {"switch.plug_a": "Office Plug A", "light.bulb_b": "Bulb B", "sensor.ext_lqi": "Extender"}


def _auto():
    return yaml.safe_load(ALERT.read_text())["automation"][0]


class _S:
    def __init__(self, state, minutes):
        self.state = state
        self.last_changed = NOW - timedelta(seconds=minutes * 60)


def _due(states, routers=ROUTERS):
    tpl = _auto()["actions"][0]["variables"]["due"]
    env = jinja2.Environment(extensions=["jinja2.ext.do"])
    states_obj = type("St", (), {"__getitem__": lambda self, k: states.get(k)})()
    out = env.from_string(tpl).render(
        states=states_obj, now=lambda: NOW,
        state_attr=lambda e, a: routers if (e, a) == ("sensor.zigbee_routers_online", "routers") else None,
    )
    return ast.literal_eval(out.strip())


def test_trigger_is_a_one_minute_poll_with_no_entity_list():
    auto = _auto()
    (trigger,) = auto["triggers"]
    assert trigger["trigger"] == "time_pattern" and trigger["minutes"] == "/1"
    assert not re.search(r"\b(switch|light|sensor)\.(?!zigbee_routers_online)\w+", str(auto["triggers"]))
    # the only entity the automation names is the label-driven sensor
    named = set(re.findall(r"\b(?:switch|light|sensor|binary_sensor)\.\w+", ALERT.read_text().split("automation:")[1]))
    assert named == {"sensor.zigbee_routers_online"}


def test_alerts_once_when_the_streak_crosses_15_minutes():
    s = {"switch.plug_a": _S("unavailable", 15.5), "light.bulb_b": _S("unavailable", 14.9)}
    assert _due(s) == ["switch.plug_a"]


def test_window_edges_one_push_per_outage():
    for minutes, expected in ((14.99, []), (15, ["switch.plug_a"]), (15.99, ["switch.plug_a"]), (16, []), (90, [])):
        assert _due({"switch.plug_a": _S("unavailable", minutes)}) == expected, minutes


def test_only_unavailable_counts():
    s = {"switch.plug_a": _S("on", 15.5), "light.bulb_b": _S("unknown", 15.5), "sensor.ext_lqi": _S("unavailable", 15.5)}
    assert _due(s) == ["sensor.ext_lqi"]


def test_newly_labelled_router_alerts_without_a_yaml_edit():
    routers = {**ROUTERS, "switch.brand_new_plug": "Brand New Plug"}
    s = {"switch.brand_new_plug": _S("unavailable", 15.2)}
    assert _due(s, routers) == ["switch.brand_new_plug"]


def test_router_without_a_state_is_skipped():
    assert _due({}) == []


def test_two_routers_dropping_together_both_alert():
    s = {"switch.plug_a": _S("unavailable", 15.1), "light.bulb_b": _S("unavailable", 15.4)}
    assert _due(s) == ["switch.plug_a", "light.bulb_b"]


def test_coordinator_gate_mode_and_per_router_push():
    auto = _auto()
    (cond,) = auto["conditions"]
    assert cond["condition"] == "template"
    assert "config_entry_attr('aca4c70dc280edb389f2148461676c66', 'state') == 'loaded'" in cond["value_template"]
    assert auto["mode"] == "queued" and auto["max_exceeded"] == "silent"
    rep = auto["actions"][1]["repeat"]
    assert "due" in rep["for_each"]
    data = rep["sequence"][0]["data"]
    assert rep["sequence"][0]["action"] == "script.general_notification"
    assert data["tag"] == "zigbee-router-{{ repeat.item }}"
    assert "routers" in data["message"] and "repeat.item" in data["message"]


def test_zha_outage_pushes_nothing():
    # The gate is evaluated before the action: a non-loaded entry stops the run, so even
    # a full set of routers inside the window cannot push.
    auto = _auto()
    gate = jinja2.Environment().from_string(auto["conditions"][0]["value_template"])
    for state, passes in (("loaded", True), ("setup_retry", False), ("not_loaded", False), (None, False)):
        out = gate.render(config_entry_attr=lambda *_a, st=state: st).strip()
        assert (out == "True") is passes, state
