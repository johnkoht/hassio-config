"""
Regression tests: Nino's medication refill tracking.

Stock is stored in doses (twice a day), everything shown or typed is days.
Real templates from the package YAML are rendered with Jinja2 and a small
fake of HA's state helpers.
"""
import re
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
NINO = REPO / "packages/people/nino/medication_refill"
SHARED = REPO / "packages/reminders/medication_refill"
MORNING = REPO / "packages/reminders/morning_update.yaml"
NEW_FILES = sorted(NINO.glob("*.yaml")) + sorted(SHARED.glob("*.yaml"))

STOCK = "input_number.nino_medication_stock"
DAYS = "sensor.nino_medication_days_remaining"
THRESH = "input_number.medication_refill_threshold_days"
CRIT = "input_number.medication_refill_critical_days"
REFILL_DAYS = "input_number.nino_medication_refill_days"


def load(path):
    return yaml.safe_load(path.read_text())


def automation(path):
    return load(path)["automation"][0]


def _is_number(v):
    try:
        float(v)
        return True
    except (TypeError, ValueError):
        return False


def make_env(states, attrs=None):
    """Jinja env with the HA helpers these templates use."""
    attrs = attrs or {}
    env = Environment(undefined=StrictUndefined)
    bad = ("unavailable", "unknown", "", None)
    env.globals["states"] = lambda e: states.get(e, "unknown")
    env.globals["has_value"] = lambda e: states.get(e, "unknown") not in bad
    env.globals["state_attr"] = lambda e, a: (attrs.get(e) or {}).get(a)
    env.globals["is_state"] = lambda e, s: states.get(e) == s
    env.tests["number"] = _is_number
    env.filters["is_number"] = _is_number
    return env


def render(template, states, attrs=None, **ctx):
    return make_env(states, attrs).from_string(template).render(**ctx).strip()


# ---------------------------------------------------------------- helpers

def test_no_helper_has_initial():
    for path in NEW_FILES:
        text = path.read_text()
        assert not re.search(r"^\s*initial:", text, re.M), f"{path.name} sets initial:"


def test_stock_helper_shape():
    h = load(NINO / "nino_medication_stock.yaml")["input_number"]["nino_medication_stock"]
    assert h["min"] == -1 and h["step"] == 1 and h["unit_of_measurement"] == "doses"
    assert h["max"] >= 120


def _days_sensor():
    return load(NINO / "nino_medication_stock.yaml")["template"][0]["sensor"][0]


def _days(stock):
    s = _days_sensor()
    states = {STOCK: stock}
    if render(s["availability"], states) != "True":
        return "unavailable"
    return render(s["state"], states)


@pytest.mark.parametrize("stock,expected", [
    ("14", "7"), ("60", "30"), ("13", "6"), ("1", "0"), ("0", "0"),
])
def test_days_remaining_is_doses_over_two_rounded_down(stock, expected):
    assert _days(stock) == expected


@pytest.mark.parametrize("stock", ["-1", "unavailable", "unknown", "abc"])
def test_days_remaining_unavailable_never_zero(stock):
    # -1 is the unseeded helper (reads its min): must not look like 0 days
    assert _days(stock) == "unavailable"


def test_doses_per_day_constant_matches_everywhere():
    assert "doses_per_day = 2" in _days_sensor()["state"]
    scripts = (SHARED / "medication_refill_scripts.yaml").read_text()
    assert scripts.count("doses_per_day: 2") == 2


# ------------------------------------------------------------- decrements

@pytest.mark.parametrize("n", [1, 2])
def test_decrement_triggers_only_off_to_on(n):
    a = automation(NINO / f"nino_medication_{n}_stock_decrement.yaml")
    assert a["id"] == f"nino_medication_{n}_stock_decrement"
    assert len(a["triggers"]) == 1
    t = a["triggers"][0]
    assert t["trigger"] == "state"
    assert t["entity_id"] == f"input_boolean.nino_medication_{n}_taken"
    assert t["from"] == "off" and t["to"] == "on"


@pytest.mark.parametrize("n", [1, 2])
def test_decrement_is_atomic_and_guarded_above_zero(n):
    a = automation(NINO / f"nino_medication_{n}_stock_decrement.yaml")
    cond = a["conditions"]
    assert any(c.get("condition") == "numeric_state" and c["entity_id"] == STOCK
               and c.get("above") == 0 and "below" not in c for c in cond)
    (act,) = a["actions"]
    assert act["action"] == "input_number.decrement"
    assert act["target"]["entity_id"] == STOCK


# ------------------------------------------------------------------ alert

ALERT = automation(SHARED / "medication_refill_low_stock_alert.yaml")


def _alert_pushes(days_state, threshold="7", critical="3"):
    """Run the loop body templates; return the general_notification data or None."""
    states = {DAYS: days_state, THRESH: threshold, CRIT: critical}
    acts = ALERT["actions"]
    meds = next(a for a in acts if "variables" in a)["variables"]["medications"]
    loop = next(a for a in acts if "repeat" in a)["repeat"]["sequence"]
    env = make_env(states)
    out = []
    for item in meds:
        ctx = {"repeat": {"item": item}}
        for step in loop:
            if "variables" in step:
                for k, v in step["variables"].items():
                    ctx[k] = env.from_string(v).render(**ctx).strip()
                    # native-type coercion like HA
                    if ctx[k] in ("True", "False"):
                        ctx[k] = ctx[k] == "True"
                    elif re.fullmatch(r"-?\d+", ctx[k]):
                        ctx[k] = int(ctx[k])
                    elif re.fullmatch(r"-?\d+\.\d+", ctx[k]):
                        ctx[k] = float(ctx[k])
            else:
                if ctx["low"] is True:
                    data = step["then"][0]["data"]
                    out.append({
                        "message": env.from_string(data["message"]).render(**ctx).strip(),
                        "priority": env.from_string(data["priority"]).render(**ctx).strip(),
                        "tag": env.from_string(data["tag"]).render(**ctx).strip(),
                        "devices": data["devices"],
                        "actions": [(env.from_string(x["action"]).render(**ctx), x["title"])
                                    for x in data["actions"]],
                    })
    return out


def test_alert_mode_and_triggers():
    assert ALERT["mode"] == "queued"
    kinds = {t["id"]: t for t in ALERT["triggers"]}
    assert kinds["low"]["trigger"] == "numeric_state" and kinds["low"]["below"] == THRESH
    assert kinds["critical"]["below"] == CRIT
    assert kinds["daily"]["trigger"] == "time" and kinds["daily"]["at"] == "09:00:00"


@pytest.mark.parametrize("days", ["7", "30", "100"])
def test_no_alert_at_or_above_a_week(days):
    assert _alert_pushes(days) == []


@pytest.mark.parametrize("days,priority", [
    ("6", "time-sensitive"), ("3", "time-sensitive"),
    ("2", "critical"), ("1", "critical"), ("0", "critical"),
])
def test_alert_priority_edges(days, priority):
    (push,) = _alert_pushes(days)
    assert push["priority"] == priority
    assert push["devices"] == "all" and push["tag"] == "medication-refill-nino"
    assert push["actions"] == [("MEDICATION_REFILLED_NINO_15", "+15 days"),
                               ("MEDICATION_REFILLED_NINO_30", "+30 days")]


@pytest.mark.parametrize("days", ["unavailable", "unknown", "-1"])
def test_no_alert_when_stock_not_set(days):
    assert _alert_pushes(days) == []


def test_unset_thresholds_are_silent_and_unset_critical_is_time_sensitive():
    assert _alert_pushes("1", threshold="0", critical="0") == []
    (push,) = _alert_pushes("1", threshold="7", critical="0")
    assert push["priority"] == "time-sensitive"


def test_alert_messages():
    assert _alert_pushes("5")[0]["message"] == "Nino's medication is running low: about 5 days left."
    assert _alert_pushes("1")[0]["message"] == "Nino's medication is running low: about 1 day left."
    assert _alert_pushes("0")[0]["message"] == "Nino's medication is almost out."


def test_alert_never_reads_trigger():
    # The 09:00 trigger has no entity_id / from_state (door re-alert bug)
    text = (SHARED / "medication_refill_low_stock_alert.yaml").read_text()
    body = "\n".join(l for l in text.splitlines() if not l.lstrip().startswith("#"))
    assert "trigger." not in body


# ----------------------------------------------------------------- refill

SCRIPTS = load(SHARED / "medication_refill_scripts.yaml")["script"]


def run_script(name, stock, days_field, helper_days="0", stock_max=365):
    """Execute the script's variables/conditions/set_value; return written value or None."""
    seq = SCRIPTS[name]["sequence"]
    states = {STOCK: stock, REFILL_DAYS: helper_days}
    attrs = {STOCK: {"max": stock_max}}
    env = make_env(states, attrs)
    ctx = {"medication": "nino"}
    if days_field is not None:
        ctx["days"] = days_field
    written = []
    for step in seq:
        if "variables" in step:
            for k, v in step["variables"].items():
                if isinstance(v, dict):
                    ctx[k] = v
                    continue
                if not isinstance(v, str):
                    ctx[k] = v
                    continue
                r = env.from_string(v).render(**{**ctx, "none": None}).strip()
                ctx[k] = {"None": None}.get(r, r)
                if r not in ("None",) and re.fullmatch(r"-?\d+(\.\d+)?", r):
                    ctx[k] = float(r) if "." in r else int(r)
        elif step.get("condition") == "template":
            if env.from_string(step["value_template"]).render(**{**ctx, "none": None}).strip() != "True":
                return None, written
        elif step.get("action") == "input_number.set_value":
            assert step["target"]["entity_id"] == "{{ stock_entity }}"
            written.append(int(env.from_string(step["data"]["value"]).render(**ctx)))
    return (written[-1] if written else None), written


@pytest.mark.parametrize("days,expected", [(15, 30), (30, 60)])
def test_refill_adds_days_as_doses(days, expected):
    assert run_script("medication_refilled", "10", days)[0] == 10 + expected


def test_refill_caps_at_stock_max():
    assert run_script("medication_refilled", "350", 30)[0] == 365


def test_refill_on_unseeded_stock_treats_base_as_zero():
    assert run_script("medication_refilled", "-1", 30)[0] == 60


@pytest.mark.parametrize("days_field", [0, None])
def test_refill_with_no_days_writes_nothing_even_unseeded(days_field):
    # days omitted + refill-days helper unset (0): must not turn -1 into 0
    assert run_script("medication_refilled", "-1", days_field, helper_days="0")[1] == []
    assert run_script("medication_stock_set", "-1", days_field, helper_days="0")[1] == []


def test_refill_falls_back_to_the_helper():
    assert run_script("medication_refilled", "10", None, helper_days="20")[0] == 50


def test_stock_set_replaces_with_days_times_two():
    assert run_script("medication_stock_set", "99", 30)[0] == 60
    assert run_script("medication_stock_set", "-1", 14)[0] == 28
    assert run_script("medication_stock_set", "5", 400)[0] == 365


def test_scripts_clear_the_push():
    for name in SCRIPTS:
        steps = [s for s in SCRIPTS[name]["sequence"] if s.get("action") == "script.clear_notifications"]
        assert len(steps) == 1
        assert steps[0]["data"]["devices"] == "all"
        assert "tags" in SCRIPTS[name]["sequence"][0]["variables"]
        assert SCRIPTS[name]["sequence"][0]["variables"]["tags"]["nino"] == "medication-refill-nino"


def test_push_action_only_matches_the_two_ids():
    a = automation(SHARED / "medication_refill_push_action.yaml")
    got = {t["event_data"]["action"]: t["id"] for t in a["triggers"]}
    assert got == {"MEDICATION_REFILLED_NINO_15": "15", "MEDICATION_REFILLED_NINO_30": "30"}
    assert all(t["event_type"] == "mobile_app_notification_action" for t in a["triggers"])
    (act,) = a["actions"]
    assert act["action"] == "script.medication_refilled"
    assert act["data"]["days"] == "{{ trigger.id | int }}"


# ----------------------------------------------------------- safety scope

FORBIDDEN = ["critical_announcement", "voice_announcement", "emergency", "alarmo",
             "noonlight", "siren", "alarm_control_panel"]


def test_no_alarm_or_announcement_paths_in_new_files():
    for path in NEW_FILES:
        text = path.read_text().lower()
        for word in FORBIDDEN:
            assert word not in text, f"{path.name} mentions {word}"


def test_ids_match_filenames():
    for path in NEW_FILES:
        data = load(path)
        for a in data.get("automation", []):
            assert a["id"] == path.stem


# ---------------------------------------------------------- morning brief

def _brief_block():
    text = MORNING.read_text()
    m = re.search(r"### MEDICATION REFILLS\n(.*?)\n\s*---", text, re.S)
    assert m, "no ### MEDICATION REFILLS block"
    # dedent to the template body
    return "\n".join(l.strip() for l in m.group(1).splitlines())


def _brief(days, threshold="7", critical="3"):
    states = {DAYS: days, THRESH: threshold, CRIT: critical}
    return render(_brief_block(), states)


def test_brief_names_nino_when_low():
    out = _brief("5")
    assert "Nino's medication" in out and "5 days" in out


def test_brief_critical_adds_refill_today():
    assert "refill today" in _brief("2")
    assert "refill today" not in _brief("5")


def test_brief_silent_when_not_low():
    out = _brief("20")
    assert "Nino's medication is" not in out
    assert "otherwise say nothing" in out


@pytest.mark.parametrize("days", ["unavailable", "unknown", "-1"])
def test_brief_never_names_an_unset_stock(days):
    assert "Nino's medication is" not in _brief(days)


def test_brief_listed_in_prompt_intro():
    assert "Medication refills" in MORNING.read_text()


def test_whole_morning_prompt_still_parses():
    # A Jinja syntax error here would silence the entire morning brief
    script = load(MORNING)["script"]["morning_update_announcement"]["sequence"]
    prompt = next(s for s in script if s.get("action") == "conversation.process")["data"]["text"]
    Environment().parse(prompt)
