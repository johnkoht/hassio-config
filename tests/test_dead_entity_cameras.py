"""
Dead-entity decisions PR A (JK-1232): cameras_available + camera proxies.
"""
import re
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
CAM = REPO / "packages/security/cameras"
DET = CAM / "detections"

SENSORS = [
    "sensor.g4_bullet_uptime",
    "sensor.g4_bullet_uptime_2",
    "sensor.backyard_pool_uptime",
    "sensor.backyard_northwest_uptime",
    "sensor.driveway_front_camera_uptime",
    "sensor.front_door_camera_uptime",
    "sensor.g5_turret_ultra_uptime_2",
]
BAD = {"unknown", "unavailable", "none"}

ENTITY = yaml.safe_load((CAM / "cameras_available.yaml").read_text())[
    "template"
][0]["binary_sensor"][0]
TEMPLATES = {
    "state": ENTITY["state"],
    "unavailable_count": ENTITY["attributes"]["unavailable_count"],
    "unavailable_list": ENTITY["attributes"]["unavailable_list"],
}


def _render(tpl, states):
    env = Environment()

    def st(e):
        return states.get(e, "unavailable")

    env.globals["states"] = st
    env.tests["has_value"] = lambda e: st(e) not in BAD
    return env.from_string(tpl).render().strip()


def _online(**over):
    s = {e: "12345" for e in SENSORS}
    s.update(over)
    return s


def test_template_lists_exactly_the_seven_sensors():
    for name, tpl in TEMPLATES.items():
        found = re.findall(r"'(sensor\.[a-z0-9_]+)'", tpl)
        assert found == SENSORS, name
    assert ENTITY["attributes"]["total_cameras"] == 7


def test_all_online():
    assert _render(TEMPLATES["state"], _online()) == "True"
    assert _render(TEMPLATES["unavailable_count"], _online()) == "0"
    assert _render(TEMPLATES["unavailable_list"], _online()) == "[]"


@pytest.mark.parametrize("bad", ["unavailable", "unknown"])
@pytest.mark.parametrize("sensor", SENSORS)
def test_one_offline(sensor, bad):
    s = _online(**{sensor: bad})
    assert _render(TEMPLATES["state"], s) == "False"
    assert _render(TEMPLATES["unavailable_count"], s) == "1"
    assert _render(TEMPLATES["unavailable_list"], s) == f"['{sensor}']"


# --- proxies ---------------------------------------------------------------

def _slug(s):
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def _proxy_id(source):
    return "camera.camera_proxy_" + _slug(source)


def _proxies():
    out = {}
    for f in DET.rglob("*_proxy.yaml"):
        for c in yaml.safe_load(f.read_text())["camera"]:
            if c["platform"] == "proxy":
                out[_proxy_id(c["entity_id"])] = (f, c["entity_id"])
    return out


def _refs():
    refs = {}
    for f in DET.rglob("*.yaml"):
        for m in re.findall(r"camera\.camera_proxy_[a-z0-9_]+", f.read_text()):
            refs.setdefault(m, []).append(f.name)
    return refs


def test_id_rule_matches_existing_proxies():
    # the rule, proven on the truncated backyard_south source and a long one
    assert _proxy_id("camera.backyard_south_camera_high") == (
        "camera.camera_proxy_camera_backyard_south_camera_high"
    )
    assert _proxy_id("camera.front_door_camera_high_resolution_channel") == (
        "camera.camera_proxy_camera_front_door_camera_high_resolution_channel"
    )
    proxies = _proxies()
    for ref in _refs():
        if "backyard_south" in ref or "front_door" in ref:
            assert ref in proxies


def test_every_referenced_proxy_is_produced():
    proxies = _proxies()
    missing = {r: f for r, f in _refs().items() if r not in proxies}
    assert not missing, missing


def test_new_and_repointed_proxies():
    proxies = _proxies()
    for cam in ("northwest", "pool"):
        assert f"camera.camera_proxy_camera_backyard_{cam}_high_resolution_channel" in proxies
    porch = "camera.camera_proxy_camera_g5_turret_ultra_high_resolution_channel"
    assert porch in proxies
    for kind in ("person", "animal"):
        text = (DET / "backyard_porch_camera"
                / f"backyard_porch_camera_detections_{kind}.yaml").read_text()
        assert porch in text


def test_deleted_porch_entity_nowhere():
    old = "backyard_porch_camera_high_resolution_channel"
    hits = []
    for f in REPO.rglob("*"):
        rel = f.relative_to(REPO).parts
        if (not f.is_file() or rel[0] in {".git", ".claude", "plans", "memory", "tests"}
                or f.suffix not in {".yaml", ".yml", ".md", ".py", ".json"}):
            continue
        if old in f.read_text(errors="ignore"):
            hits.append(str(f.relative_to(REPO)))
    assert not hits, hits
