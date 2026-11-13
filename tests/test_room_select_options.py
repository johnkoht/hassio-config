"""
Every literal `input_select.select_option` call must name an option the select defines.

HA rejects an unknown option at runtime, so a mode automation that selects a
removed option fails silently (the family room had four such, all disabled).

Definitions come from `packages/**` (`input_select:` blocks) and `input_select/**`
(`!include_dir_named`: file basename is the key). Only `.yaml` files count: HA never
loads `.yml`, so a parked `.yml` select must not vouch for a call. Selects that exist
only as UI helpers are not in the repo; calls to them can't be checked and are skipped.

Pre-existing violations in other rooms live in KNOWN_VIOLATIONS. It is a ratchet: a new
violation fails, and a listed one that no longer exists fails too, so fixing one must
shrink the list.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
SELECT_ACTIONS = {"input_select.select_option"}

# (file relative to repo, entity_id, option) -> why it is tolerated
KNOWN_VIOLATIONS = {}


class _Loader(yaml.SafeLoader):
    pass


def _tag(loader, suffix, node):
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node, deep=True)
    return loader.construct_mapping(node, deep=True)


_Loader.add_multi_constructor("!", _tag)


def _load(path):
    try:
        return yaml.load(path.read_text(), Loader=_Loader)
    except Exception:
        return None


def _rel(path):
    return str(path.relative_to(REPO))


def _yaml_files(*roots):
    out = []
    for r in roots:
        p = REPO / r
        if p.is_file():
            out.append(p)
        elif p.is_dir():
            out.extend(sorted(p.rglob("*.yaml")))
    return out


def collect_options():
    """entity_id -> list of options, from every loaded select definition."""
    options = {}
    for path in _yaml_files("packages"):
        doc = _load(path)
        block = doc.get("input_select") if isinstance(doc, dict) else None
        if isinstance(block, dict):
            for key, d in block.items():
                if isinstance(d, dict) and isinstance(d.get("options"), list):
                    options[f"input_select.{key}"] = [str(o) for o in d["options"]]
    for path in _yaml_files("input_select"):
        doc = _load(path)
        if isinstance(doc, dict) and isinstance(doc.get("options"), list):
            options[f"input_select.{path.stem}"] = [str(o) for o in doc["options"]]
    return options


def _as_list(v):
    if v is None:
        return []
    if isinstance(v, str):
        return [s.strip() for s in v.split(",")] if "{{" not in v else [v]
    return list(v) if isinstance(v, list) else [v]


def _walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from _walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from _walk(v)


def select_calls(doc):
    """Yield (entity_id, option) for each literal select_option action in a parsed document."""
    for d in _walk(doc):
        if not any(isinstance(d.get(k), str) and d[k] in SELECT_ACTIONS for k in ("action", "service")):
            continue
        target = d.get("target") if isinstance(d.get("target"), dict) else {}
        data = d.get("data") if isinstance(d.get("data"), dict) else {}
        ents = []
        for src in (target, data, d):
            ents += _as_list(src.get("entity_id"))
        option = data.get("option", d.get("option"))
        if not isinstance(option, str) or "{{" in option or "{%" in option:
            continue
        for e in ents:
            if isinstance(e, str) and e.startswith("input_select.") and "{" not in e:
                yield e, option


def find_violations(options):
    found = set()
    for path in _yaml_files("packages", "automation", "scripts", "scripts.yaml", "automations.yaml"):
        doc = _load(path)
        if doc is None:
            continue
        for entity, option in select_calls(doc):
            if entity in options and option not in options[entity]:
                found.add((_rel(path), entity, option))
    return found


def test_every_select_option_call_uses_a_defined_option():
    found = find_violations(collect_options())
    new = sorted(found - set(KNOWN_VIOLATIONS))
    assert not new, "select_option to an option the select does not define:\n" + "\n".join(map(str, new))


def test_known_violations_are_all_still_real():
    found = find_violations(collect_options())
    stale = sorted(set(KNOWN_VIOLATIONS) - found)
    assert not stale, "fixed, so remove from KNOWN_VIOLATIONS:\n" + "\n".join(map(str, stale))


@pytest.mark.parametrize("room", ["family_room", "mudroom"])
def test_migrated_rooms_have_no_violations(room):
    entity = f"input_select.{room}"
    assert entity in collect_options()
    assert not [v for v in find_violations(collect_options()) if v[1] == entity]


def test_checker_catches_a_bad_call_in_every_call_style():
    doc = [
        {"action": "input_select.select_option", "target": {"entity_id": "input_select.x"}, "data": {"option": "Bad"}},
        {"service": "input_select.select_option", "data": {"entity_id": "input_select.x", "option": "Bad2"}},
        {"service": "input_select.select_option", "entity_id": ["input_select.x"], "data": {"option": "Bad3"}},
        {"action": "input_select.select_option", "target": {"entity_id": "input_select.x"},
         "data": {"option": "{{ foo }}"}},
    ]
    assert [o for _, o in select_calls(doc)] == ["Bad", "Bad2", "Bad3"]


# --- State conditions and triggers (JK-1232) ---------------------------------------------
# `select_option` isn't the only way to name an option: a state condition or trigger on an
# option that was removed never matches, silently. Same definitions, same empty allowlist.
STATE_KEYS = ("state", "to", "from", "not_to", "not_from")
STATE_SCAN_ROOTS = ("packages", "automation", "scripts", "scripts.yaml", "automations.yaml", "dashboards")
IGNORED_STATES = {"unknown", "unavailable"}


def state_refs(doc):
    """Yield (entity_id, option) for literal state values on state conditions/triggers."""
    for d in _walk(doc):
        if "state" not in (d.get("condition"), d.get("trigger"), d.get("platform")):
            continue
        # entity_id for automations, entity for Lovelace conditions
        ents = _as_list(d.get("entity_id")) + _as_list(d.get("entity"))
        for e in ents:
            if not (isinstance(e, str) and e.startswith("input_select.") and "{" not in e):
                continue
            for key in STATE_KEYS:
                for v in _as_list(d.get(key)) if key in d else []:
                    if isinstance(v, str) and "{" not in v and v not in IGNORED_STATES:
                        yield e, v


def find_state_violations(options, stats=None):
    found = set()
    for path in _yaml_files(*STATE_SCAN_ROOTS):
        doc = _load(path)
        if doc is None:
            continue
        if stats is not None:
            stats["files"] += 1
        for entity, option in state_refs(doc):
            if entity in options:
                if stats is not None:
                    stats["refs"] += 1
                if option not in options[entity]:
                    found.add((_rel(path), entity, option))
    return found


def test_every_state_condition_and_trigger_uses_a_defined_option():
    found = find_state_violations(collect_options())
    assert not found, "state/to/from on an option the select does not define:\n" + "\n".join(map(str, sorted(found)))


def test_state_guard_scans_a_real_surface():
    stats = {"files": 0, "refs": 0}
    find_state_violations(collect_options(), stats)
    assert stats["files"] > 300 and stats["refs"] > 100, stats


def test_state_checker_catches_every_form():
    doc = [
        {"condition": "state", "entity_id": "input_select.x", "state": "Bad"},
        {"condition": "state", "entity_id": ["input_select.x"], "state": ["Ok", "Bad2"]},
        {"trigger": "state", "entity_id": "input_select.x", "to": "Bad3", "from": "Bad4",
         "not_to": ["Bad5"], "not_from": "Bad6"},
        {"platform": "state", "entity_id": "input_select.x", "to": "Bad7"},
        {"type": "conditional", "conditions": [{"condition": "state", "entity": "input_select.x", "state": "Bad8"}]},
        # skipped: templated entity, unknown/unavailable, templated value, other domain, not a state dict
        {"condition": "state", "entity_id": "input_select.{{ r }}", "state": "Skip"},
        {"trigger": "state", "entity_id": "input_select.x", "to": "unavailable", "from": "unknown"},
        {"condition": "state", "entity_id": "input_select.x", "state": "{{ foo }}"},
        {"condition": "state", "entity_id": "input_boolean.x", "state": "on"},
        {"condition": "template", "entity_id": "input_select.x", "state": "Skip2"},
    ]
    assert [o for _, o in state_refs(doc)] == [
        "Bad", "Ok", "Bad2", "Bad3", "Bad4", "Bad5", "Bad6", "Bad7", "Bad8"]
