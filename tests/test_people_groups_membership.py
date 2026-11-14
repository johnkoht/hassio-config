"""
Every household person must be inside group.all_people.

group.all_people drives house_not_occupied (and so Away mode and the alarm).
Joe was dropped from every group in the July 2025 refactor, so the house went
Away at the moment the last grouped person left while he was home.
"""
import re
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
GROUPS_FILE = REPO / "packages/people/people_groups.yaml"

# Intentionally not in all_people: the kids have no trackers (state stays
# unknown) and are always with a parent, so they must not hold the house
# "occupied" on their own.
EXCLUDED = {"person.nino", "person.gianluca"}

SCAN = ["packages", "automation", "scripts", "binary_sensors", "sensors",
        "dashboards"]
SCAN_FILES = ["scripts.yaml", "automations.yaml"]
# Not preceded by a word char or dot, so JS like `variables.person.replace`
# is not mistaken for an entity.
PERSON_RE = re.compile(r"(?<![\w.])person\.[a-z0-9_]+")
# Look-alikes in the scan that are not household persons
NOT_PERSONS = {"person.replace"}


def _groups():
    return yaml.safe_load(GROUPS_FILE.read_text())["group"]


def _members(name, groups, seen=None):
    """Resolve a group's person members through nested groups."""
    seen = seen if seen is not None else set()
    if name in seen:
        return set()
    seen.add(name)
    out = set()
    for entity in groups[name]["entities"]:
        if entity.startswith("group."):
            out |= _members(entity.split(".", 1)[1], groups, seen)
        else:
            out.add(entity)
    return out


def _referenced_persons():
    files = [REPO / f for f in SCAN_FILES]
    for root in SCAN:
        files += sorted((REPO / root).rglob("*.yaml"))
    found = set()
    for f in files:
        for line in f.read_text().splitlines():
            for m in PERSON_RE.findall(line.split("#")[0]):
                found.add(m)
    return found - NOT_PERSONS


def test_nested_resolution_includes_extended_family_and_guests():
    all_people = _members("all_people", _groups())
    assert _members("family", _groups()) <= all_people
    assert _members("extended_family", _groups()) <= all_people
    assert _members("guests", _groups()) <= all_people


def test_joe_is_in_extended_family():
    """Joe counted as extended family before the July 2025 refactor dropped him.

    extended_family nests into guests and all_people, so he is in both; guest
    mode follows him, and his arrival announcement suppresses the generic line
    (see test_joe_arrival_suppresses_guest_mode_announcement).
    """
    groups = _groups()
    assert "person.joe_falbo" in groups["extended_family"]["entities"]
    assert "person.joe_falbo" not in groups["all_people"]["entities"]
    assert "person.joe_falbo" in _members("guests", groups)
    assert "person.joe_falbo" in _members("all_people", groups)


def test_every_referenced_person_is_in_all_people():
    all_people = _members("all_people", _groups())
    missing = sorted(_referenced_persons() - all_people - EXCLUDED)
    assert not missing, (
        f"{missing} are referenced but not in group.all_people; add them to "
        "family/extended_family/guests, or to EXCLUDED here with a reason")


def test_excluded_people_stay_excluded():
    """Keep the allow list honest: an excluded person must really be out."""
    all_people = _members("all_people", _groups())
    assert not (EXCLUDED & all_people)
    assert EXCLUDED <= _referenced_persons(), "stale EXCLUDED entry"
