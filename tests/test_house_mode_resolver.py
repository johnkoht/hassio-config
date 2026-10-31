"""
Regression tests for the house mode resolver (JK-1118).

input_select.house is written by one automation that derives the mode from
state. These tests render the real templates with Jinja2 (StrictUndefined)
and read the real files, so they run on a dev machine.
"""
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
MODES = "packages/house/modes"


class Loader(yaml.SafeLoader):
    """SafeLoader that tolerates HA's !secret/!include tags."""


Loader.add_multi_constructor("!", lambda loader, suffix, node: f"!{suffix}")


def parse(text):
    return yaml.load(text, Loader=Loader)


def load(rel):
    return parse((REPO / rel).read_text())


def automation(rel):
    data = load(rel)
    return data["automation"][0] if "automation" in data else data


class FakeHA:
    """Just enough of HA's template namespace for these templates."""

    def __init__(self, states, now=None, occupied_since=None):
        self.s = states
        self.t = now or datetime(2026, 10, 30, 7, 0, tzinfo=timezone.utc)
        self.since = occupied_since

    def render(self, template, trigger_id=None, **extra):
        env = Environment(undefined=StrictUndefined)
        env.globals["states"] = self._states()
        env.globals["is_state"] = lambda e, v: self.s.get(e) == v
        env.globals["now"] = lambda: self.t
        trig = {} if trigger_id is None else {"id": trigger_id}
        return env.from_string(template).render(trigger=trig, **extra).strip()

    def _states(self):
        ha = self

        class States:
            def __call__(self, entity):
                return ha.s.get(entity, "unknown")

            @property
            def input_boolean(self):
                class Dom:
                    class house_occupied:
                        last_changed = ha.since or ha.t - timedelta(hours=1)
                return Dom

        return States()


def base(**over):
    s = {
        "input_boolean.house_occupied": "on",
        "input_boolean.vacation_mode": "off",
        "input_boolean.bedtime": "off",
        "input_boolean.quiet_mode": "off",
        "input_select.house": "Auto",
    }
    s.update(over)
    return s


def resolve(states, trigger_id="changed", **kw):
    auto = automation(f"{MODES}/house_mode_resolve.yaml")
    ha = FakeHA(states, **kw)
    return ha.render(auto["actions"][0]["variables"]["resolved"], trigger_id)


O, B, Q, V = ("input_boolean.house_occupied", "input_boolean.bedtime",
              "input_boolean.quiet_mode", "input_boolean.vacation_mode")


@pytest.mark.parametrize("states,expected", [
    (base(), "Auto"),
    (base(**{Q: "on"}), "Quiet"),
    (base(**{B: "on"}), "Bedtime"),
    (base(**{B: "on", Q: "on"}), "Bedtime"),
    (base(**{O: "off"}), "Away"),
    (base(**{O: "off", B: "on", Q: "on"}), "Away"),
    # Vacation while occupied (a sitter) resolves to the normal modes
    (base(**{V: "on"}), "Auto"),
    (base(**{V: "on", Q: "on"}), "Quiet"),
    (base(**{V: "on", B: "on"}), "Bedtime"),
    # Vacation is never overwritten by the nightly bedtime
    (base(**{O: "off", V: "on", B: "on"}), "Vacation"),
    (base(**{O: "off", V: "on"}), "Vacation"),
])
def test_priority(states, expected):
    assert resolve(states) == expected


def test_vacation_needs_the_house_empty_for_two_minutes():
    s = base(**{O: "off", V: "on"})
    t = datetime(2026, 10, 30, 7, 0, tzinfo=timezone.utc)
    assert resolve(s, now=t, occupied_since=t - timedelta(seconds=30)) == "Away"
    assert resolve(s, now=t, occupied_since=t - timedelta(seconds=119)) == "Away"
    assert resolve(s, now=t, occupied_since=t - timedelta(seconds=120)) == "Vacation"


@pytest.mark.parametrize("trigger_id", ["empty_hold", "restart"])
def test_hold_trigger_and_restart_count_as_held(trigger_id):
    s = base(**{O: "off", V: "on"})
    t = datetime(2026, 10, 30, 7, 0, tzinfo=timezone.utc)
    assert resolve(s, trigger_id, now=t, occupied_since=t - timedelta(seconds=5)) == "Vacation"


def test_manual_run_has_no_trigger_id():
    """automation.trigger runs have no trigger.id."""
    s = base(**{O: "off", V: "on"})
    assert resolve(s, trigger_id=None) == "Vacation"  # empty for an hour in the fixture


@pytest.mark.parametrize("entity", [O, V, B, Q])
@pytest.mark.parametrize("bad", ["unknown", "unavailable"])
def test_unknown_input_never_guesses(entity, bad):
    assert resolve(base(**{entity: bad})) == ""


def test_selects_only_when_changing_and_known():
    auto = automation(f"{MODES}/house_mode_resolve.yaml")
    cond = auto["actions"][1]["value_template"]
    def run(select, resolved):
        ha = FakeHA({"input_select.house": select})
        return ha.render(cond, resolved=resolved) == "True"
    assert run("Away", "Auto")
    assert not run("Auto", "Auto")
    assert not run("Auto", "")
    assert not run("unavailable", "Auto")
    assert not run("unknown", "Auto")


def test_resolver_shape():
    auto = automation(f"{MODES}/house_mode_resolve.yaml")
    assert auto["mode"] == "queued"
    assert auto["initial_state"] is True or auto["initial_state"] == "on"
    trig = auto["triggers"]
    occ = [t for t in trig if t.get("entity_id") == "input_boolean.house_occupied"]
    # off is immediate, on is debounced so an arrival can end bedtime first
    off_now = [t for t in occ if t["to"] == "off" and "for" not in t]
    on_wait = [t for t in occ if t["to"] == "on"]
    hold = [t for t in occ if t["to"] == "off" and "for" in t]
    assert len(off_now) == 1 and len(hold) == 1 and len(on_wait) == 1
    assert on_wait[0]["for"]["seconds"] >= 10
    assert hold[0]["for"]["minutes"] == 2
    kinds = {t["trigger"] for t in trig}
    assert {"homeassistant", "event"} <= kinds
    assert next(t for t in trig if t["trigger"] == "event")["event_type"] == "automation_reloaded"
    # R5: it never triggers on the select it writes
    assert all("input_select.house" not in str(t.get("entity_id")) for t in trig)


def test_resolver_computes_and_gates_inside_the_run():
    """Automation-level variables/conditions render at trigger time, before a
    queued run starts, so a queued run would act on stale state (review D1)."""
    auto = automation(f"{MODES}/house_mode_resolve.yaml")
    assert "variables" not in auto and "conditions" not in auto
    first, gate, write = auto["actions"]
    assert "resolved" in first["variables"]
    assert gate["condition"] == "template"
    assert write["action"] == "input_select.select_option"
    assert write["target"]["entity_id"] == "input_select.house"


def test_resolver_is_the_only_writer_of_the_house_select():
    """Two writers is the bug this resolver exists to remove."""
    writers = []
    for path in list((REPO / "packages").rglob("*.yaml")) + list((REPO / "automation").rglob("*.yaml")) \
            + list((REPO / "scripts").rglob("*.yaml")) + [REPO / "automations.yaml", REPO / "scripts.yaml"]:
        text = path.read_text()
        if "input_select.select_option" not in text and "input_select.set_options" not in text:
            continue
        try:
            doc = parse(text)
        except yaml.YAMLError:
            continue
        if _writes_house(doc):
            writers.append(str(path.relative_to(REPO)))
    assert sorted(writers) == [
        "packages/house/modes/house_mode_resolve.yaml",
        "scripts/house/house_away.yaml",
    ]
    assert not (REPO / "automation/house/modes").exists()


def _writes_house(node):
    if isinstance(node, dict):
        act = node.get("action") or node.get("service")
        if act == "input_select.select_option":
            tgt = (node.get("target") or {}).get("entity_id") or (node.get("data") or {}).get("entity_id") \
                or node.get("entity_id")
            if tgt == "input_select.house":
                return True
        return any(_writes_house(v) for v in node.values())
    if isinstance(node, list):
        return any(_writes_house(v) for v in node)
    return False


# --- side effects -----------------------------------------------------------

DOORBELL = {
    "Auto": "WELCOME!",
    "Away": "DO NOT DISTURB",
    "Bedtime": "DO NOT DISTURB",
    "Quiet": "SHHH…KIDS SLEEPING",
    "Vacation": "DO NOT DISTURB",  # "Please do not disturb!" is not a live option
}


def test_doorbell_text_follows_every_option_but_entertainment():
    auto = automation(f"{MODES}/house_mode_doorbell_text.yaml")
    assert set(auto["triggers"][0]["to"]) == set(DOORBELL)
    option = auto["actions"][0]["data"]["option"]
    for mode, text in DOORBELL.items():
        class To:  # trigger.to_state.state
            state = mode
        env = Environment(undefined=StrictUndefined)
        out = env.from_string(option).render(trigger={"to_state": To}).strip()
        assert out == text


def test_speech_on_only_for_auto_and_only_if_off():
    auto = automation(f"{MODES}/house_mode_speech_on.yaml")
    assert auto["triggers"][0]["to"] == "Auto"
    assert "unavailable" in auto["triggers"][0]["not_from"]
    assert auto["conditions"][0]["state"] == "off"
    assert auto["actions"][0]["action"] == "input_boolean.turn_on"


def test_away_push_waits_for_the_alarm_and_is_audible():
    """One normal-priority push after the alarm arms (John, 2026-10-30); skipped if someone's back."""
    auto = automation(f"{MODES}/house_mode_away_notification.yaml")
    assert auto["triggers"][0]["to"] == "Away"
    assert auto["mode"] == "restart"
    wait, still, push = auto["actions"]
    assert "alarmo" in wait["wait_template"] and wait["continue_on_timeout"] is True
    assert (still["entity_id"], still["state"]) == ("input_select.house", "Away")
    data = push["data"]
    assert (data["priority"], data["tag"], data["devices"]) == ("active", "house-mode-away", "jk")
    assert "isn't armed" in data["message"] and "is armed" in data["message"]
    assert data["important"] is True  # gets through the Important level, still "active"


def _gate_passes(level, priority, important=None):
    """Render the Important-level branch of general_notification's gate."""
    script = load("packages/general_notifications.yaml")["script"]["general_notification"]
    cond = next(c for c in script["sequence"] if c.get("condition") == "or")
    tmpl = cond["conditions"][2]["value_template"]
    env = Environment(undefined=StrictUndefined)
    ctx = {"priority": priority}
    if important is not None:
        ctx["important"] = important
    ctx["states"] = type("S", (), {"input_select": type("I", (), {
        "notification_level": type("L", (), {"state": level})()})()})()
    return env.from_string(tmpl).render(**ctx).strip() == "true"


def test_general_notification_declares_important_field():
    script = load("packages/general_notifications.yaml")["script"]["general_notification"]
    field = script["fields"]["important"]
    assert field["default"] is False and "boolean" in field["selector"]
    cond = next(c for c in script["sequence"] if c.get("condition") == "or")
    assert "important" in cond["conditions"][2]["value_template"]


@pytest.mark.parametrize("level,priority,important,expected", [
    ("Important", "active", None, False),
    ("Important", "active", False, False),
    ("Important", "active", True, True),
    ("Important", "time-sensitive", None, True),
    ("Important", "critical", None, True),
    ("None", "active", True, False),
    ("None", "time-sensitive", True, False),
])
def test_important_level_gate_truth_table(level, priority, important, expected):
    assert _gate_passes(level, priority, important) is expected


def test_quiet_speech_off_only_in_the_nap_window():
    auto = automation(f"{MODES}/house_mode_quiet_speech_off.yaml")
    assert auto["triggers"][0]["to"] == "Quiet"
    cond = auto["conditions"][0]
    assert (cond["after"], cond["before"]) == ("12:00:00", "15:00:00")
    assert auto["actions"][0]["action"] == "input_boolean.turn_off"


# --- bedtime off ------------------------------------------------------------

def _bedtime_off_ok(states):
    auto = automation("packages/house/bedtime_mode/bedtime_mode_off.yaml")
    tmpl = next(c for c in auto["conditions"] if c.get("condition") == "template")
    ha = FakeHA(states)
    return ha.render(tmpl["value_template"]) == "True"


J, C = "person.john_koht", "person.cristina_falbo"
JA, CA = "input_boolean.john_is_awake", "input_boolean.cristina_is_awake"


@pytest.mark.parametrize("states,expected", [
    ({J: "home", C: "home", JA: "on", CA: "off"}, True),   # one home adult up is enough
    ({J: "home", C: "home", JA: "off", CA: "off"}, False),
    ({J: "not_home", C: "home", JA: "on", CA: "off"}, False),  # the awake one is away
    ({J: "not_home", C: "home", JA: "off", CA: "on"}, True),
    ({J: "not_home", C: "not_home", JA: "off", CA: "off"}, True),  # sitter: nobody home
    ({J: "unavailable", C: "unavailable", JA: "off", CA: "off"}, False),
    ({J: "unknown", C: "not_home", JA: "off", CA: "off"}, False),
])
def test_bedtime_off_who(states, expected):
    assert _bedtime_off_ok(states) is expected


def test_bedtime_off_triggers_and_time_window():
    auto = automation("packages/house/bedtime_mode/bedtime_mode_off.yaml")
    ids = [t.get("entity_id") for t in auto["triggers"]]
    assert "binary_sensor.everybody_in_bed" not in str(ids)  # home-filtered aggregate
    assert ["input_boolean.john_is_in_bed", "input_boolean.cristina_in_bed"] in ids
    window = next(c for c in auto["conditions"] if c.get("condition") == "time")
    assert (window["after"], window["before"]) == ("05:00:00", "12:00:00")


# --- alarm ------------------------------------------------------------------

def test_alarm_disarm_in_morning_is_bounded_and_rechecked_after_the_wait():
    auto = automation("packages/security/alarm/alarm_disarm_in_morning.yaml")
    window = next(c for c in auto["conditions"] if c.get("condition") == "time")
    assert (window["after"], window["before"]) == ("05:00:00", "12:00:00")

    actions = auto["actions"]
    wait = next(i for i, a in enumerate(actions) if "wait_template" in a)
    disarm = next(i for i, a in enumerate(actions) if a.get("action") == "alarmo.disarm")
    between = actions[wait + 1:disarm]
    text = yaml.safe_dump(between)
    assert "input_boolean.bedtime" in text          # bedtime still off
    assert "armed_home" in text                      # still armed home
    assert "input_boolean.house_occupied" in text    # still occupied
    assert between, "no re-check between the wait and the disarm"
    assert all(a.get("condition") for a in between)  # every step is a gate
    # No clock re-check: a late-morning wait must still disarm (review D2)
    assert "time" not in {a["condition"] for a in between}
    assert actions[wait]["continue_on_timeout"] is False


def test_the_wait_cannot_be_the_only_gate():
    """The bedtime recheck must be a state condition on 'off'."""
    auto = automation("packages/security/alarm/alarm_disarm_in_morning.yaml")
    actions = auto["actions"]
    wait = next(i for i, a in enumerate(actions) if "wait_template" in a)
    gates = [a for a in actions[wait + 1:] if a.get("condition") == "state"]
    bed = [g for g in gates if g["entity_id"] == "input_boolean.bedtime"]
    assert bed and bed[0]["state"] == "off"
    panel = [g for g in gates if g["entity_id"] == "alarm_control_panel.alarmo"]
    assert panel and panel[0]["state"] == "armed_home"
    occupied = [g for g in gates if g["entity_id"] == "input_boolean.house_occupied"]
    assert occupied and occupied[0]["state"] == "on"


# --- rooms accept Quiet -------------------------------------------------------

ROOM_AUTOS = [
    "packages/basement/modes/basement_mode_auto.yaml",
    "packages/dining_room/modes/dining_room_mode_auto.yaml",
    "packages/jr_suite/modes/jr_suite_mode_auto.yaml",
    "packages/kitchen/modes/kitchen_mode_auto.yaml",
    "packages/laundry/modes/laundry_room_mode_auto.yaml",
    "packages/mudroom_bathroom/modes/mudroom_bathroom_mode_auto.yaml",
    "packages/playroom/modes/playroom_mode_auto.yaml",
    "packages/pool/modes/pool_mode_auto.yaml",
    "packages/powder_room/modes/powder_room_mode_auto.yaml",
    "packages/sunroom/modes/sunroom_mode_auto.yaml",
    "packages/family_room/modes/family_room_mode_auto.yaml",
]


def _house_refs(node, out):
    if isinstance(node, dict):
        if node.get("entity_id") == "input_select.house":
            out.append(node)
        for v in node.values():
            _house_refs(v, out)
    elif isinstance(node, list):
        for v in node:
            _house_refs(v, out)


@pytest.mark.parametrize("rel", ROOM_AUTOS)
def test_room_auto_accepts_quiet(rel):
    refs = []
    _house_refs(automation(rel), refs)
    assert len(refs) == 2  # one trigger, one condition
    for ref in refs:
        assert ref.get("to", ref.get("state")) == ["Auto", "Quiet"]


def test_no_room_requires_the_house_to_be_exactly_auto():
    """A new room-mode file that insists on house == Auto leaves the room Off after Bedtime."""
    exact = []
    for path in list((REPO / "packages").rglob("*.yaml")) + list((REPO / "automation").rglob("*.yaml")):
        try:
            doc = parse(path.read_text())
        except yaml.YAMLError:
            continue
        autos = doc.get("automation", [doc]) if isinstance(doc, dict) else []
        for auto in autos:
            if not isinstance(auto, dict):
                continue
            conds = auto.get("conditions") or auto.get("condition") or []
            refs = []
            _house_refs(conds, refs)
            if any(r.get("state") == "Auto" for r in refs):
                exact.append(str(path.relative_to(REPO)))
    # Only the hourly chime (quiet means no chime) may insist on Auto
    assert exact == ["packages/hourly_dong.yaml"]


def test_foyer_returns_to_auto_from_quiet():
    auto = automation("packages/foyer/modes/foyer_mode_auto.yaml")
    assert auto["triggers"][0]["to"] == ["Auto", "Quiet"]
