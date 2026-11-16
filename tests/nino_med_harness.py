"""
Shared helpers for the Nino medication tests: load the package YAML and render
its templates with stubbed Home Assistant functions (no HA needed).
"""
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
MED = REPO / "packages/people/nino/medication_reminder"
UNSET = ("unknown", "unavailable", "", None)


def load(name):
    return yaml.safe_load((MED / name).read_text())


def reminder_pkg():
    return load("nino_medication_reminder.yaml")


def reminder_auto():
    return [a for a in reminder_pkg()["automation"] if a["id"] == "nino_medication_reminder"][0]


def escalation_auto():
    return load("nino_medication_escalation.yaml")["automation"][0]


def sensor(name):
    return [s for s in reminder_pkg()["template"][0]["sensor"] if s["name"] == name][0]


def script(name):
    return reminder_pkg()["script"][name]


def walk(node):
    """Yield every dict and list nested in node."""
    yield node
    if isinstance(node, dict):
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def strings(node):
    for n in walk(node):
        if isinstance(n, str):
            yield n
        elif isinstance(n, dict):
            for v in n.values():
                if isinstance(v, str):
                    yield v


def _to_dt(value):
    return datetime.fromisoformat(value)


class Ha:
    """Stubbed HA template environment. states: {entity: state}; attrs: {entity: {attr: value}}."""

    def __init__(self, states, now, attrs=None):
        self.states, self.attrs, self.now = dict(states), attrs or {}, now
        self.env = Environment()
        e = self.env.globals
        e["states"] = lambda ent: self.states.get(ent, "unknown")
        e["is_state"] = lambda ent, st: self.states.get(ent, "unknown") == st
        e["state_attr"] = lambda ent, a: self.attrs.get(ent, {}).get(a)
        e["now"] = lambda: self.now
        e["today_at"] = self.today_at
        e["as_datetime"] = _to_dt
        e["timedelta"] = timedelta

    def today_at(self, hhmm):
        parts = [int(p) for p in hhmm.split(":")]
        parts += [0] * (3 - len(parts))
        return self.now.replace(hour=parts[0], minute=parts[1], second=parts[2], microsecond=0)

    def render(self, template, **variables):
        return self.env.from_string(template).render(**variables).strip()


def at(day, hhmm):
    """An aware datetime. day: 'sat' (2026-11-14) or 'mon' (2026-11-16)."""
    d = {"sat": 14, "mon": 16}[day]
    h, m = [int(x) for x in hhmm.split(":")]
    return datetime(2026, 11, d, h, m, tzinfo=timezone(timedelta(hours=-6)))


BASE_STATES = {
    "input_datetime.nino_medication_1_time": "07:30:00",
    "input_datetime.nino_medication_2_time": "13:00:00",
    "input_datetime.nino_medication_no_school_earliest": "00:00:00",
    "input_boolean.nino_medication_1_taken": "off",
    "input_boolean.nino_medication_2_taken": "off",
    "input_boolean.nino_medication_1_skipped": "off",
    "input_boolean.nino_medication_2_skipped": "off",
    "input_boolean.nino_medication_1_escalated": "off",
    "input_boolean.nino_medication_2_escalated": "off",
    "timer.nino_medication_1_timer": "idle",
    "timer.nino_medication_2_timer": "idle",
    "binary_sensor.nino_school_day": "on",
}
BASE_ATTRS = {"input_datetime.nino_medication_no_school_earliest": {"timestamp": 0}}


def world(day, hhmm, school_day, floor=None, **overrides):
    """Render both template sensors as HA would: effective time first, then pending."""
    states = dict(BASE_STATES)
    states["binary_sensor.nino_school_day"] = school_day
    attrs = {k: dict(v) for k, v in BASE_ATTRS.items()}
    if floor:
        states["input_datetime.nino_medication_no_school_earliest"] = floor
        attrs["input_datetime.nino_medication_no_school_earliest"] = {"timestamp": 1}
    states.update(overrides)
    ha = Ha(states, at(day, hhmm), attrs)
    avail = ha.render(sensor("Nino Medication 1 Effective Time")["availability"])
    eff = ha.render(sensor("Nino Medication 1 Effective Time")["state"]) if avail == "True" else "unavailable"
    ha.states["sensor.nino_medication_1_effective_time"] = eff
    pending = ha.render(sensor("Nino Medication Pending Dose")["state"])
    return ha, eff, pending
