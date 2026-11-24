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
                            as `loader` so `{% from 'x.jinja' import m %}` works.
      .render_entity(config, field="state", this_state=None) renders a template entity field
  make_env(ha, loader=None) same as FakeHA.env, standalone.
  Missing entities read as "unknown", like HA. Bool-like output: use truthy(s).
"""
import json
from datetime import datetime, time, timedelta, timezone
from pathlib import Path

import yaml
from jinja2 import Environment, StrictUndefined

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
        return self._states(entity) not in ("unknown", "unavailable", "none", None, "")

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
    return env


def truthy(rendered):
    return rendered.strip().lower() in ("true", "on", "yes")
