"""
Medication times live in helpers set from the dashboard, never in config.

The repo is public, so a dose or reminder time must not be a literal in YAML:
no `at: "HH:MM"` on a medication reminder, no `initial:` on a medication
input_datetime. Reads repo files only (no HA).
"""
import re
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
MED_DIRS = [p for p in (REPO / "packages").rglob("*medication*") if p.is_dir()]
CLOCK = re.compile(r"^\d{1,2}:\d{2}(:\d{2})?$")


class _Loader(yaml.SafeLoader):
    pass


_Loader.add_multi_constructor("!", lambda loader, suffix, node: None)


def _med_files():
    files = sorted({f for d in MED_DIRS for f in d.rglob("*.yaml")})
    assert files, "no medication packages found"
    return files


def _automations():
    for f in _med_files():
        doc = yaml.load(f.read_text(), Loader=_Loader) or {}
        for auto in doc.get("automation", []) or []:
            yield f, auto


def test_medication_dirs_cover_both_people():
    names = {d.relative_to(REPO).as_posix() for d in MED_DIRS}
    assert "packages/people/nino/medication_reminder" in names
    assert "packages/people/cristina/medication_reminder" in names


def test_no_medication_reminder_has_a_literal_time_trigger():
    checked = 0
    for f, auto in _automations():
        if f.parent.name != "medication_reminder" or auto["id"].endswith("_reset"):
            continue  # refill alerts and overnight resets are system times, not a dose schedule
        for t in auto.get("triggers", []):
            if t.get("trigger") != "time":
                continue
            checked += 1
            for at in t["at"] if isinstance(t["at"], list) else [t["at"]]:
                assert not CLOCK.match(str(at)), (f.name, auto["id"], "literal time trigger")
                assert str(at).startswith(("input_datetime.", "sensor.")), (f.name, auto["id"], at)
    assert checked >= 4


def test_cristina_reminders_read_their_helpers():
    triggers = {
        auto["id"]: [t["at"] for t in auto["triggers"] if t.get("trigger") == "time"]
        for _, auto in _automations()
    }
    assert triggers["cristina_daily_medication_reminder"] == ["input_datetime.cristina_medication_morning_time"]
    assert triggers["cristina_friday_medication_reminder"] == ["input_datetime.cristina_medication_weekly_time"]


def test_no_medication_input_datetime_has_initial():
    helpers = {}
    for f in _med_files():
        doc = yaml.load(f.read_text(), Loader=_Loader) or {}
        for key, cfg in (doc.get("input_datetime") or {}).items():
            helpers[key] = cfg or {}
    for key in ("nino_medication_1_time", "nino_medication_2_time",
                "cristina_medication_morning_time", "cristina_medication_weekly_time"):
        assert key in helpers, key
    for key, cfg in helpers.items():
        assert "initial" not in cfg, key


def test_cristina_time_helpers_are_on_her_popup():
    card = (REPO / "dashboards/templates/button_cards/people/cristina.yaml").read_text()
    assert "input_datetime.cristina_medication_morning_time" in card
    assert "input_datetime.cristina_medication_weekly_time" in card


def test_preschool_hours_sensor_is_gone():
    assert not (REPO / "binary_sensors/times_of_day/preschool_hours.yaml").exists()
