"""JK-1163: Nino's lamp turning on marks his bedroom occupied."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
LAMP = "light.nino_bedroom_lamp"


def _auto(name):
    path = REPO / "packages/ninos_room/modes" / name
    return yaml.safe_load(path.read_text())["automation"][0]


def test_lamp_on_triggers_occupied_and_satisfies_condition():
    auto = _auto("ninos_bedroom_occupied.yaml")
    (trig,) = [t for t in auto["triggers"] if t.get("entity_id") == LAMP]
    assert trig["from"] == "off" and trig["to"] == "on"
    ors = [c for c in auto["conditions"] if c["condition"] == "or"][0]["conditions"]
    assert any(c.get("entity_id") == LAMP and c.get("state") == "on" for c in ors)


def test_lamp_never_holds_occupancy():
    """Lamp-off is a clear trigger; the clear conditions must not require the lamp off."""
    auto = _auto("ninos_bedroom_not_occupied.yaml")
    assert any(t.get("entity_id") == LAMP and t.get("to") == "off" for t in auto["triggers"])
    assert LAMP not in yaml.dump(auto["conditions"])


def test_bedtime_mode_not_driven_by_lamp():
    """A lamp on at night must not move the room out of Bedtime."""
    for name in ("ninos_bedroom_mode_bedtime.yaml", "ninos_bedroom_mode_off.yaml"):
        assert LAMP not in yaml.dump(_auto(name)["triggers"])
