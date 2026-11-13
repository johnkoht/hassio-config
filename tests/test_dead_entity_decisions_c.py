"""Dead-entity decisions PR C: generic work calendar, Tempest alerts removed."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JOHN_FILES = [
    "packages/people/john/focus_mode/calendar_focus_mode_sensor.yaml",
    "packages/people/john/daily_report/john_calendar_events_today.yaml",
]
WORK_CAL = re.compile(r"calendar\.john_koht_[a-z0-9]+_com")
DEAD = (
    "tempest_rain_amount",
    "tempest_high_uv_alert",
    "tempest_rain_alert",
    "Tempest Rain Alert",
    "High UV Alert",
)
THIS = "tests/test_dead_entity_decisions_c.py"


def tracked_text():
    out = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True).stdout
    for rel in out.decode().split("\0"):
        p = ROOT / rel
        if not rel or not p.is_file():
            continue
        data = p.read_bytes()
        if b"\0" in data:
            continue
        yield rel, data.decode("utf-8", "ignore")


def test_work_calendar_generic_in_both_files():
    for rel in JOHN_FILES:
        assert "calendar.john_work" in (ROOT / rel).read_text(), rel


def test_personal_calendar_kept():
    assert "calendar.john_koht\n" in (ROOT / JOHN_FILES[1]).read_text()


def test_regex_does_not_match_personal_calendar():
    for ok in ("calendar.john_koht", "calendar.john_koht_2", "calendar.john_work"):
        assert not WORK_CAL.search(ok)
    assert WORK_CAL.search("calendar.john_koht_" + "example_com")


def test_no_work_domain_calendar_in_tracked_files():
    hits = [rel for rel, text in tracked_text() if WORK_CAL.search(text)]
    assert not hits, hits


def test_tempest_alerts_removed():
    assert not (ROOT / "packages/weather/tempest_alerts").exists()
    popup = (ROOT / "dashboards/kohbo/climate/_climate_settings_popup.yaml").read_text()
    assert "automation.tempest_rain_alert" not in popup
    assert "automation.tempest_high_uv_alert" not in popup


def test_dead_tempest_names_absent_outside_plans_and_memory():
    hits = [
        (rel, name)
        for rel, text in tracked_text()
        if not rel.startswith(("plans/", "memory/")) and rel != THIS
        for name in DEAD
        if name in text
    ]
    assert not hits, hits
