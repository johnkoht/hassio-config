"""Camera cards stream through HA: no direct go2rtc, every caller passes a camera entity."""
import re
from pathlib import Path

DASH = Path(__file__).resolve().parent.parent / "dashboards"
FILES = [p for p in DASH.rglob("*.yaml")]
CALLER = re.compile(r"template:\s*camera_(card|popup)\b")
ENTITY = re.compile(r"camera_entity:\s*camera\.[a-z0-9_]+\s*$", re.M)


def test_no_direct_go2rtc_references():
    bad = [str(p) for p in FILES if re.search(r"10\.0\.10\.207|:1984|live_provider:\s*go2rtc|stream_id", p.read_text())]
    assert not bad, bad


def test_every_camera_caller_passes_camera_entity():
    callers = [p for p in FILES if CALLER.search(p.read_text())]
    assert len(callers) >= 8
    bad = [str(p) for p in callers if len(ENTITY.findall(p.read_text())) < len(CALLER.findall(p.read_text()))]
    assert not bad, bad


# Frigate's camera entities (unsuffixed); the cards must use the UniFi Protect ones.
# The porch's Protect entity is camera.g5_turret_ultra_high_resolution_channel.
FRIGATE = {"front_door", "driveway_front", "garage_driveway", "backyard_south",
           "backyard_porch", "backyard_pool", "backyard_northwest"}


def test_cards_use_protect_not_frigate_entities():
    used = {m for p in FILES for m in re.findall(r"camera_entity:\s*camera\.([a-z0-9_]+)", p.read_text())}
    assert used and not (used & FRIGATE), used & FRIGATE


TEMPLATES = DASH / "templates/decluttering/security"
EXPECTED = {
    "Front Door": "camera.front_door_camera_high_resolution_channel",
    "Driveway Front": "camera.driveway_front_camera_high",
    "Garage Driveway": "camera.garage_driveway_camera_high",
    "Backyard South": "camera.backyard_south_camera_high",
    "Backyard Porch": "camera.g5_turret_ultra_high_resolution_channel",
    "Backyard Pool": "camera.backyard_pool_high_resolution_channel",
    "Backyard Northwest": "camera.backyard_northwest_high_resolution_channel",
}
PAIR = re.compile(r"- name:\s*(.+?)\s*$(?:(?!- name:).)*?- camera_entity:\s*(camera\.[a-z0-9_]+)", re.M | re.S)


def test_templates_stream_through_ha():
    for name in ("camera_card.yaml", "camera_popup.yaml"):
        text = (TEMPLATES / name).read_text()
        assert "live_provider: ha" in text and "camera_entity: '[[camera_entity]]'" in text, name


def test_each_camera_maps_to_its_own_entity():
    cams = DASH / "kohbo/security/cameras"
    files = [cams / "cameras.yaml", *sorted(cams.glob("_*_camera_popup.yaml"))]
    seen = {}
    for f in files:
        for name, ent in PAIR.findall(f.read_text()):
            if name in EXPECTED:
                assert ent == EXPECTED[name], (f.name, name, ent)
                seen.setdefault(name, 0)
                seen[name] += 1
    assert seen == {n: 2 for n in EXPECTED}, seen
