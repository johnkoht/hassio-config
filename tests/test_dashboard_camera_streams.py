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
