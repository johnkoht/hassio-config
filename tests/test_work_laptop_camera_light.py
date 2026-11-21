"""El Gato follows the personal Mac camera, or the work laptop camera while docked."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
LIGHTS = REPO / "packages/office/lights"
SENSORS = REPO / "packages/people/john/do_not_disturb/sensors"
MAC = "binary_sensor.johns_mbp_2026_camera_in_use"
CAM = "input_boolean.john_work_laptop_camera"
DOCK = "input_boolean.john_work_laptop_docked"
EL_GATO = "light.office_el_gato_light"


def load(path):
    return yaml.safe_load(path.read_text())


def auto(name):
    return load(LIGHTS / f"{name}.yaml")["automation"][0]


def states(conds):
    """Flatten nested conditions into (entity_id, state) pairs."""
    out = []
    for c in conds:
        if "entity_id" in c:
            out.append((c["entity_id"], c.get("state")))
        out += states(c.get("conditions", []))
    return out


def test_helpers_exist_without_initial():
    for name, eid in (("john_work_laptop_camera", CAM), ("john_work_laptop_docked", DOCK)):
        helper = load(SENSORS / f"{name}_boolean.yaml")["input_boolean"][name]
        assert "initial" not in helper, eid
        assert helper["name"] and helper["icon"]
        assert len(list((REPO / "packages").rglob(f"{name}_boolean.yaml"))) == 1


def test_on_fires_for_work_camera_or_dock_and_requires_both():
    on = auto("office_camera_light_on")
    trig = {t["entity_id"]: t for t in on["triggers"]}
    assert trig[CAM]["to"] == "on" and trig[CAM]["for"] == {"seconds": 2}
    assert trig[DOCK]["to"] == "on"
    assert trig["input_boolean.office_occupied"]["to"] == "on"
    assert MAC in trig
    source = next(c for c in on["conditions"] if c.get("condition") == "or")
    mac, pair = source["conditions"]
    assert (mac["entity_id"], mac["state"]) == (MAC, "on")
    assert pair["condition"] == "and"
    assert sorted(states(pair["conditions"])) == [(CAM, "on"), (DOCK, "on")]


def test_off_fires_for_work_camera_or_undock_and_tolerates_stale_sources():
    off = auto("office_camera_light_off")
    trig = {t["entity_id"]: t for t in off["triggers"]}
    assert trig[CAM]["to"] == "off" and trig[CAM]["for"] == {"seconds": 4}
    assert trig[DOCK]["to"] == "off"
    # No source is required to be "off": unavailable/stale must still let it turn off
    assert not [e for e, s in states(off["conditions"]) if s == "off" and e in (MAC, CAM, DOCK)]
    gate = next(c for c in off["conditions"] if c.get("condition") == "or" and CAM in str(c))
    vacant, pair = gate["conditions"]
    # The office emptying overrides stale laptop booleans
    assert vacant == {"condition": "trigger", "id": "office_vacant"}
    assert trig["input_boolean.office_occupied"]["id"] == "office_vacant"
    # HA's `not` fails if ANY child passes, so the pair must sit inside one `and`
    assert pair["condition"] == "not"
    assert len(pair["conditions"]) == 1 and pair["conditions"][0]["condition"] == "and"
    assert sorted(states(pair["conditions"])) == [(CAM, "on"), (DOCK, "on")]


def test_camera_light_ignores_dnd_and_uses_target():
    for name in ("office_camera_light_on", "office_camera_light_off"):
        path = LIGHTS / f"{name}.yaml"
        assert "john_dnd" not in path.read_text(), name
        a = auto(name)
        assert a["actions"][0]["target"]["entity_id"] == EL_GATO
        assert "entity_id" not in a["actions"][0]
        assert a["initial_state"] is True
