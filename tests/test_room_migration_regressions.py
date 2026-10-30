"""
Regression pins for the Phase 5 migration of the family room and mudroom (JK-1145, PR 5).

Both rooms' legacy automations moved from `automation/` into `packages/` in modern syntax.
The registry keys on `id`, so id, alias and `initial_state` must not drift: four family room
automations are disabled live and must stay disabled, and `mudroom_lights_to_on` is live as
`automation.mudroom_mode_on_2`. Select option lists are pinned to the live lists.
"""
from pathlib import Path

import pytest
import yaml

from test_room_select_options import _Loader

REPO = Path(__file__).resolve().parent.parent

# (id, alias, initial_state) taken from the legacy files before the move.
MANIFEST = {
    "family_room": [
        ("family_room_not_occupied", "Family room not occupied", "on"),
        ("family_room_occupied", "Family room occupied", "on"),
        ("family_room_lights_to_away", "Family room lights to away", "on"),
        ("family_room_lights_to_off", "Family room lights to off", "on"),
        ("family_room_lights_to_on", "Family room lights to On", "off"),
        ("family_room_arrival", "Family room arrival", "off"),
        ("family_room_mode_away", "Family room mode away", "off"),
        ("family_room_mode_auto", "Family Room Mode Auto", "on"),
        ("family_room_mode_off", "Family Room Mode Off", "on"),
        ("family_room_mode_on", "Family room mode on", "off"),
    ],
    "mudroom": [
        ("mudroom_lights_to_away", "Mudroom lights to away", "on"),
        ("mudroom_lights_to_dim", "Mudroom lights to dim", "on"),
        ("mudroom_lights_to_off", "Mudroom lights to off", "on"),
        ("mudroom_lights_to_on", "Mudroom lights to on", "on"),
        ("mudroom_mode_away", "Mudroom mode away", "on"),
        ("mudroom_mode_motion", "Mudroom mode motion", "on"),
        ("mudroom_mode_night_motion", "Mudroom mode night motion", "on"),
        ("mudroom_mode_on", "Mudroom mode on", "on"),
    ],
}
ALL = [(room, *row) for room, rows in MANIFEST.items() for row in rows]

LIVE_OPTIONS = {
    "family_room": ["Auto", "Away", "Off"],
    "mudroom": ["On", "Motion", "Away", "Night Motion"],
}


def _state(v):
    return {True: "on", False: "off"}.get(v, str(v).lower())


def _find(auto_id):
    """Every (path, automation) with this id under packages/ or automation/."""
    hits = []
    for root in ("packages", "automation"):
        for p in (REPO / root).rglob("*.yaml"):
            if auto_id not in p.read_text():
                continue
            doc = yaml.load(p.read_text(), Loader=_Loader)
            autos = doc.get("automation") if isinstance(doc, dict) else doc
            if isinstance(doc, dict) and "id" in doc:
                autos = [doc]
            for a in autos if isinstance(autos, list) else []:
                if isinstance(a, dict) and a.get("id") == auto_id:
                    hits.append((p, a))
    return hits


@pytest.mark.parametrize("room,auto_id,alias,initial", ALL)
def test_automation_pinned_and_in_packages_once(room, auto_id, alias, initial):
    hits = _find(auto_id)
    assert len(hits) == 1, [str(p) for p, _ in hits]
    path, a = hits[0]
    rel = path.relative_to(REPO).parts
    assert rel[0] == "packages" and rel[1] == room, rel
    assert path.stem == auto_id
    assert a["alias"] == alias
    assert _state(a["initial_state"]) == initial


@pytest.mark.parametrize("room,auto_id,alias,initial", ALL)
def test_migrated_automation_uses_modern_keys(room, auto_id, alias, initial):
    (_, a), = _find(auto_id)
    for old in ("trigger", "condition", "action"):
        assert old not in a, f"{auto_id} uses legacy top-level '{old}:'"
    for key in ("triggers", "conditions", "actions"):
        assert isinstance(a.get(key), list), key

    def walk(n):
        if isinstance(n, dict):
            yield n
            for v in n.values():
                yield from walk(v)
        elif isinstance(n, list):
            for v in n:
                yield from walk(v)

    for d in walk(a):
        assert "platform" not in d and "service" not in d, d
    for t in a["triggers"]:
        assert "trigger" in t, t
    for step in walk(a["actions"]):
        if "action" in step:
            assert "entity_id" not in step, f"{auto_id}: entity_id must sit under target:"


def test_legacy_directories_are_gone():
    assert not (REPO / "automation/family_room").exists()
    assert not (REPO / "automation/mudroom").exists()


@pytest.mark.parametrize("room", sorted(LIVE_OPTIONS))
def test_select_options_equal_the_live_list(room):
    doc = yaml.load((REPO / "packages" / room / f"{room}_state.yaml").read_text(), Loader=_Loader)
    assert doc["input_select"][room]["options"] == LIVE_OPTIONS[room]
    assert "initial" not in doc["input_select"][room]
    assert not (REPO / "input_select/rooms" / f"{room}.yaml").exists()


def test_family_room_occupied_boolean_has_no_initial():
    doc = yaml.load((REPO / "packages/family_room/family_room_occupancy.yaml").read_text(), Loader=_Loader)
    b = doc["input_boolean"]["family_room_occupied"]
    assert b["name"] == "Family room" and b["icon"] == "mdi:sofa" and "initial" not in b
    assert not (REPO / "input_boolean/rooms/family_room_occupied.yaml").exists()


def test_disabled_family_room_automations_point_at_defined_options():
    for auto_id in ("family_room_mode_on", "family_room_arrival"):
        (_, a), = _find(auto_id)
        assert a["actions"][0]["data"]["option"] in LIVE_OPTIONS["family_room"]
    (_, a), = _find("family_room_lights_to_on")
    assert a["actions"][0]["action"] == "light.turn_on"
