"""
Shared test harness for the smart climate tasks.

API
  load(rel)                 parse a repo-relative YAML file (!secret/!include tolerated)
  entities(rel)             {unique_id: (domain, config)} for every template entity in a file
  FakeHA(states, attrs=None, now=None)
      .render(template, this_state=None, this_attrs=None, loader=None, **extra) -> str
      .env(loader=None)     Jinja2 Environment (StrictUndefined) with states(), is_state(),
                            state_attr(), has_value(), now(), today_at(), timedelta, from_json,
                            to_json. Pass a jinja2.FileSystemLoader (e.g. on custom_templates/)
                            as `loader` to override the default (a FileSystemLoader on custom_templates/, so
                            `{% from 'climate_control.jinja' import m %}` works).
      .render_entity(config, field="state", this_state=None) renders a template entity field
  make_env(ha, loader=None) same as FakeHA.env, standalone.
  Missing entities read as "unknown", like HA. Bool-like output: use truthy(s).
"""
import ast
import json
from datetime import datetime, time, timedelta, timezone
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

REPO = Path(__file__).resolve().parent.parent


class Loader(yaml.SafeLoader):
    """SafeLoader that tolerates HA's !secret/!include tags."""


Loader.add_multi_constructor("!", lambda loader, suffix, node: f"!{suffix}")


def load(rel):
    return yaml.load((REPO / rel).read_text(), Loader=Loader)


def entities(rel):
    """Template entities in a file as {unique_id: (domain, config)}."""
    out = {}
    for block in (load(rel) or {}).get("template", []):
        for domain in ("sensor", "binary_sensor"):
            for cfg in block.get(domain, []):
                out[cfg["unique_id"]] = (domain, cfg)
    return out


class This:
    def __init__(self, state="unknown", attributes=None):
        self.state = state
        self.attributes = attributes or {}


class FakeHA:
    def __init__(self, states=None, attrs=None, now=None):
        self.s = dict(states or {})
        self.a = dict(attrs or {})
        self.t = now or datetime(2026, 11, 24, 7, 0, tzinfo=timezone.utc)

    def _states(self, entity):
        return self.s.get(entity, "unknown")

    def _has_value(self, entity):
        # HA: the entity exists and its state is neither unknown nor unavailable
        return entity in self.s and self.s[entity] not in ("unknown", "unavailable")

    def _attr(self, entity, name):
        return self.a.get(entity, {}).get(name)

    def _today_at(self, hhmm="00:00"):
        h, m = (int(x) for x in str(hhmm).split(":")[:2])
        return datetime.combine(self.t.date(), time(h, m), tzinfo=self.t.tzinfo)

    def env(self, loader=None):
        return make_env(self, loader)

    def render(self, template, this_state=None, this_attrs=None, loader=None, **extra):
        env = self.env(loader)
        if this_state is not None or this_attrs is not None:
            extra["this"] = This(this_state if this_state is not None else "unknown", this_attrs)
        else:
            extra.setdefault("this", This())
        return env.from_string(template).render(**extra).strip()

    def render_entity(self, config, field="state", this_state=None, **kw):
        return self.render(config[field], this_state=this_state, **kw)


def make_env(ha, loader=None):
    if loader is None:
        loader = FileSystemLoader(str(REPO / "custom_templates"))
    env = Environment(undefined=StrictUndefined, loader=loader)
    env.globals.update(
        states=ha._states,
        is_state=lambda e, v: ha._states(e) == v,
        state_attr=ha._attr,
        has_value=ha._has_value,
        now=lambda: ha.t,
        today_at=ha._today_at,
        timedelta=timedelta,
    )
    env.filters["from_json"] = json.loads
    env.filters["to_json"] = json.dumps
    env.filters["float"] = ha_float
    env.filters["int"] = ha_int
    env.globals["float"] = ha_float
    env.globals["int"] = ha_int
    env.globals["as_timestamp"] = lambda v, default=_NO_DEFAULT: ha_as_timestamp(ha, v, default)
    return env


_NO_DEFAULT = object()


def ha_float(value, default=_NO_DEFAULT):
    """HA's float: raises when it can't convert and no default was given."""
    try:
        return float(value)
    except (ValueError, TypeError):
        if default is _NO_DEFAULT:
            raise ValueError(f"Template error: float got invalid input {value!r} and no default was specified")
        return default


def ha_int(value, default=_NO_DEFAULT, base=10):
    """HA's int: strings go through int(value, base) only ("5.0" is NOT an int)."""
    try:
        if isinstance(value, str):
            return int(value, base)
        return int(value)
    except (ValueError, TypeError):
        if default is _NO_DEFAULT:
            raise ValueError(f"Template error: int got invalid input {value!r} and no default was specified")
        return default


def ha_as_timestamp(ha, value, default=_NO_DEFAULT):
    try:
        if isinstance(value, datetime):
            return value.timestamp()
        text = str(value).strip().replace("T", " ")
        dt = datetime.fromisoformat(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=ha.t.tzinfo)
        return dt.timestamp()
    except (ValueError, TypeError):
        if default is _NO_DEFAULT:
            raise ValueError(f"Template error: as_timestamp got invalid input {value!r}")
        return default


def truthy(rendered):
    return rendered.strip().lower() in ("true", "on", "yes")


# ---- script / automation action interpreter ---------------------------------

class StopRun(Exception):
    pass


class RunResult:
    """actions: recorded service calls; trace: actions plus wait_template/stop markers."""

    def __init__(self):
        self.actions = []
        self.trace = []
        self.stopped = None

    def names(self):
        return [a["action"] for a in self.actions]


def native(text):
    """Parse a rendered string like HA's native templates do (numbers, None, lists...)."""
    t = text.strip()
    try:
        return ast.literal_eval(t)
    except (ValueError, SyntaxError):
        return t


def _is_template(v):
    return isinstance(v, str) and ("{{" in v or "{%" in v)


class Interpreter:
    def __init__(self, ha, variables=None, wait="completed", loader=None, on_action=None):
        self.ha = ha
        self.vars = dict(variables or {})
        self.wait = wait  # what a wait_template does when its template is not yet true
        self.env = make_env(ha, loader)
        self.on_action = on_action
        self.res = RunResult()

    def render(self, value):
        if isinstance(value, dict):
            return {k: self.render(v) for k, v in value.items()}
        if isinstance(value, list):
            return [self.render(v) for v in value]
        if _is_template(value):
            return native(self.env.from_string(value).render(**self.vars, this=This()))
        return value

    def truthy(self, tpl):
        out = self.env.from_string(tpl).render(**self.vars, this=This()).strip().lower()
        return out in ("true", "on", "yes", "1")

    def cond(self, c):
        if isinstance(c, str):
            return self.truthy(c)
        kind = c.get("condition")
        if kind == "template":
            return self.truthy(c["value_template"])
        if kind == "state":
            ents = c["entity_id"] if isinstance(c["entity_id"], list) else [c["entity_id"]]
            want = c["state"] if isinstance(c["state"], list) else [c["state"]]
            return all(self.ha._states(e) in [str(w) for w in want] for e in ents)
        if kind == "and":
            return all(self.cond(x) for x in c["conditions"])
        if kind == "or":
            return any(self.cond(x) for x in c["conditions"])
        if kind == "not":
            return not any(self.cond(x) for x in c["conditions"])
        raise NotImplementedError(f"condition {c!r}")

    def conds(self, cs):
        cs = cs if isinstance(cs, list) else [cs]
        return all(self.cond(c) for c in cs)

    def run(self, seq):
        try:
            self.steps(seq)
        except StopRun as e:
            self.res.stopped = str(e)
        return self.res

    def steps(self, seq):
        for step in seq if isinstance(seq, list) else [seq]:
            self.step(step)

    def step(self, st):
        if "variables" in st:
            for k, v in st["variables"].items():
                self.vars[k] = self.render(v)
        elif "condition" in st:
            if not self.cond(st):
                raise StopRun("condition failed")
        elif "if" in st:
            if self.conds(st["if"]):
                self.steps(st["then"])
            elif "else" in st:
                self.steps(st["else"])
        elif "choose" in st:
            for ch in st["choose"]:
                if self.conds(ch["conditions"]):
                    self.steps(ch["sequence"])
                    return
            if "default" in st:
                self.steps(st["default"])
        elif "stop" in st:
            self.res.trace.append({"action": "stop", "reason": self.render(st["stop"])})
            raise StopRun(self.render(st["stop"]))
        elif "wait_template" in st:
            done = self.truthy(st["wait_template"]) or self.wait == "completed"
            self.vars["wait"] = {"completed": done, "remaining": 0 if not done else st.get("timeout")}
            self.res.trace.append({"action": "wait_template", "completed": done})
            if not done and not st.get("continue_on_timeout", True):
                raise StopRun("wait timeout")
        elif "delay" in st:
            self.res.trace.append({"action": "delay"})
        elif "action" in st:
            rec = {
                "action": self.render(st["action"]),
                "target": self.render(st.get("target", {})),
                "data": self.render(st.get("data", {})),
            }
            self.res.actions.append(rec)
            self.res.trace.append(rec)
            if self.on_action:
                self.on_action(rec, self.ha)
        else:
            raise NotImplementedError(f"step {st!r}")


def run_actions(seq, ha, variables=None, **kw):
    """Run a script `sequence` / automation `actions` list; returns a RunResult."""
    return Interpreter(ha, variables, **kw).run(seq)
