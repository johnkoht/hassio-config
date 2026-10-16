"""
Regression tests for the commute station automations.

Station zones are private (the repo is public), so every zone the commute
packages reference must come from !secret, and the turn_on/turn_off chains
must point at automations that exist under their alias-derived entity ids.
"""
import re
from pathlib import Path

import pytest
import yaml

from conftest import HomeAssistantLoader

REPO = Path(__file__).resolve().parent.parent
COMMUTE_DIRS = [
    REPO / "packages/people/john/commute",
    REPO / "packages/people/cristina/commute",
]
SECRET = re.compile(r"^__SECRET:commute_(home|midway|city)_station_zone__$")


def commute_automations():
    for d in COMMUTE_DIRS:
        for path in sorted(d.glob("*.yaml")):
            data = yaml.load(path.read_text(), Loader=HomeAssistantLoader) or {}
            for auto in data.get("automation", []):
                yield path, auto


def slugify(alias):
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", alias.lower())).strip("_")


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


AUTOS = list(commute_automations())


@pytest.mark.parametrize("path,auto", AUTOS, ids=[a["id"] for _, a in AUTOS])
def test_zones_come_from_secrets(path, auto):
    for node in walk(auto):
        if node.get("trigger") == "zone" or node.get("condition") == "zone":
            zones = node["zone"] if isinstance(node["zone"], list) else [node["zone"]]
            for z in zones:
                assert SECRET.match(z), f"{path.name}: zone {z!r} must be a commute !secret"


@pytest.mark.parametrize("path,auto", AUTOS, ids=[a["id"] for _, a in AUTOS])
def test_no_literal_zone_or_station_state(path, auto):
    text = path.read_text()
    assert not re.search(r"(?<!trigger\.)zone\.[a-z]", text), f"{path.name}: literal zone entity id"
    for node in walk(auto):
        if node.get("condition") == "state" and str(node.get("entity_id", "")).startswith("person."):
            pytest.fail(f"{path.name}: person state match on a zone name; use condition: zone")


def test_automation_references_resolve():
    entity_ids = {f"automation.{slugify(a['alias'])}" for _, a in AUTOS}
    for path, auto in AUTOS:
        for node in walk(auto.get("actions", [])):
            if str(node.get("action", "")).startswith("automation."):
                targets = node["target"]["entity_id"]
                for t in targets if isinstance(targets, list) else [targets]:
                    assert t in entity_ids, f"{path.name}: {t} matches no commute automation alias"
