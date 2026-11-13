"""
Lunch menu must not hold yesterday's menu on a failed fetch
(plans/healthepro-lunch-menu-migration).

Loads the real template block and renders it with Jinja2: ok today, failure
the same day (hold), failure on a later day (empty).
"""
import ast
import json
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


_Loader.add_constructor("!secret", lambda loader, node: "secret")

BLOCK = yaml.load(
    (REPO / "packages/school/primary_school/primary_school_lunch_menu.yaml").read_text(),
    Loader=_Loader,
)["template"][0]
VARS = next(a for a in BLOCK["actions"] if "variables" in a)["variables"]
SENSOR = BLOCK["sensor"][0]

DAY1 = datetime(2026, 12, 2, 7, 0)
DAY2 = datetime(2026, 12, 4, 7, 0)

DISPLAY = [
    {"type": "category", "name": "Entree"},
    {"type": "recipe", "name": "Pizza"},
    {"type": "category", "name": "Sides"},
    {"type": "recipe", "name": "Carrots"},
]

FAIL = {"status": 400, "content": ""}


def _env(now):
    env = Environment()
    env.globals["now"] = lambda: now
    env.filters["from_json"] = json.loads
    return env


def _py(val):
    try:
        return ast.literal_eval(val)
    except (ValueError, SyntaxError):
        return val


def _variables(response, now):
    ctx = {"response": response} if response is not None else {}
    resolved = {}
    for key, tpl in VARS.items():
        val = _env(now).from_string(tpl).render(**ctx, **resolved).strip()
        resolved[key] = (val == "True") if key == "ok" else _py(val) if key in (
            "day", "setting", "display", "items", "entrees"
        ) else val
    return resolved


def _sensor(response, now, prev=None):
    """Render state + attributes; prev is the prior sensor output dict."""
    v = _variables(response, now)
    prev = prev or {"state": "unknown"}
    attrs = {k: x for k, x in prev.items() if k != "state"}
    ctx = dict(v, this=SimpleNamespace(state=prev["state"], attributes=attrs))
    out = {}
    for k, tpl in {"state": SENSOR["state"], **SENSOR["attributes"]}.items():
        out[k] = _py(_env(now).from_string(tpl).render(**ctx).strip())
    return out


def _ok_response(day):
    setting = {"current_display": DISPLAY, "days_off": {"description": "Teacher Institute"}}
    return {
        "status": 200,
        "content": {"data": [{"day": day, "setting": json.dumps(setting)}]},
    }


def test_ok_today_publishes_menu():
    r = _sensor(_ok_response("2026-12-02"), DAY1)
    assert r["state"] == 2
    assert r["lunch_menu"] == ["Pizza", "Carrots"]
    assert r["entrees"] == ["Pizza"]
    assert r["menu_date"] == "2026-12-02"


def test_failure_same_day_holds_previous_values():
    prev = _sensor(_ok_response("2026-12-02"), DAY1)
    r = _sensor(FAIL, DAY1.replace(hour=13), prev=prev)
    assert r["state"] == 2
    assert r["lunch_menu"] == ["Pizza", "Carrots"]
    assert r["entrees"] == ["Pizza"]
    assert r["menu_date"] == "2026-12-02"
    assert r["day_off"] == "Teacher Institute"


def test_failure_next_day_empties_menu():
    prev = _sensor(_ok_response("2026-12-02"), DAY1)
    r = _sensor(FAIL, DAY2, prev=prev)
    assert r["state"] == 0
    assert r["lunch_menu"] == []
    assert r["entrees"] == []
    assert r["day_off"] == ""
    # menu_date keeps the date the data is actually from
    assert r["menu_date"] == "2026-12-02"


def test_failure_with_no_prior_state_is_empty():
    r = _sensor(FAIL, DAY2)
    assert r["state"] == 0
    assert r["lunch_menu"] == []


def test_undefined_response_is_failure():
    prev = _sensor(_ok_response("2026-12-02"), DAY1)
    r = _sensor(None, DAY2, prev=prev)
    assert r["lunch_menu"] == []
    assert r["state"] == 0
