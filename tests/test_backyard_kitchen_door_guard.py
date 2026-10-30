"""
Backyard camera alerts hold off while a kitchen door is open or moved in the last 10 min.

The old guard read state_attr(..., 'last_changed'), which is always None, so it never held.
"""
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import jinja2
import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
DET = REPO / "packages/security/cameras/detections"
FILES = sorted(DET / f"backyard_{cam}_camera/backyard_{cam}_camera_detections_{kind}.yaml"
               for cam in ("porch", "pool", "northwest") for kind in ("person", "animal"))
NOW = datetime(2026, 10, 30, 18, 0, tzinfo=timezone.utc)


def guard(path):
    auto = yaml.safe_load(path.read_text())["automation"][0]
    for c in auto["conditions"]:
        for sub in c.get("conditions", []):
            for t in sub.get("conditions", []):
                if "kitchen_doors" in t.get("value_template", ""):
                    return t["value_template"]
    raise AssertionError(f"no kitchen door guard in {path.name}")


def render(tpl, door):
    env = jinja2.Environment()
    states = SimpleNamespace(binary_sensor=SimpleNamespace(kitchen_doors=door))
    out = env.from_string(tpl).render(states=states, now=lambda: NOW, timedelta=timedelta)
    return out.strip() == "True"


def test_all_six_backyard_detections_have_the_guard():
    assert len(FILES) == 6
    for f in FILES:
        assert "state_attr('binary_sensor.kitchen_doors'" not in f.read_text()


@pytest.mark.parametrize("path", FILES, ids=lambda p: p.stem)
@pytest.mark.parametrize("state,minutes,alerts", [
    ("on", 60, False),   # door open
    ("off", 2, False),   # just closed
    ("off", 11, True),   # closed a while
])
def test_guard(path, state, minutes, alerts):
    door = SimpleNamespace(state=state, last_changed=NOW - timedelta(minutes=minutes))
    assert render(guard(path), door) is alerts


@pytest.mark.parametrize("path", FILES, ids=lambda p: p.stem)
def test_missing_door_sensor_fails_open(path):
    assert render(guard(path), None) is True
