"""
JK-1269: the school-morning breakfast announcement was removed.

Guards against the automation, its time helper, or any reference to either
coming back. Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parent.parent
ROOTS = ("packages", "automation", "dashboards", "scripts", "input_datetime", "docs")
GONE = (
    "school_morning_reminder",
    "school_breakfast_reminder_time",
)


def _config_files():
    for root in ROOTS:
        for p in (REPO / root).rglob("*"):
            if p.is_file() and p.suffix in (".yaml", ".md"):
                yield p
    for name in ("automations.yaml", "scripts.yaml", "configuration.yaml"):
        p = REPO / name
        if p.exists():
            yield p


def test_reminder_file_is_deleted():
    assert not (REPO / "packages/school/reminders/school_morning_reminder.yaml").exists()


@pytest.mark.parametrize("needle", GONE)
def test_nothing_references_removed_reminder(needle):
    hits = [str(p.relative_to(REPO)) for p in _config_files() if needle in p.read_text()]
    assert not hits, hits


def test_other_school_reminders_remain():
    remaining = {p.stem for p in (REPO / "packages/school/reminders").glob("*.yaml")}
    assert {"nino_departure_reminder", "gianluca_pickup_reminder"} <= remaining
