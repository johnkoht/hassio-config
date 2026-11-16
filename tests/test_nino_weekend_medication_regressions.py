"""
Nino weekend medication timing (JK-1168, plans/nino-weekend-medication-timing).

On a no-school day dose 1 waits for a floor time (08:00 unless set), escalation
counts from it, and snoozes are 30 minutes. Reads repo files only (no HA).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from nino_med_harness import (
    MED, REPO, Ha, at, escalation_auto, load, reminder_auto, reminder_pkg,
    sensor, strings, walk, world,
)


def _comment_free(path):
    return "\n".join(l for l in path.read_text().splitlines() if not l.strip().startswith("#"))


# --- structure: no half-migration -------------------------------------------

def test_dose_1_trigger_uses_the_effective_sensor_and_dose_2_the_helper():
    triggers = {t["id"]: t for t in reminder_auto()["triggers"] if t["trigger"] == "time"}
    assert triggers["1"]["at"] == "sensor.nino_medication_1_effective_time"
    assert triggers["2"]["at"] == "input_datetime.nino_medication_2_time"


def test_pending_sensor_and_escalation_dose_1_read_the_effective_sensor():
    pending = sensor("Nino Medication Pending Dose")["state"]
    assert "sensor.nino_medication_1_effective_time" in pending
    assert "input_datetime.nino_medication_1_time" not in pending
    esc = _comment_free(MED / "nino_medication_escalation.yaml")
    assert "sensor.nino_medication_1_effective_time" in esc
    assert "input_datetime.nino_medication_1_time" not in esc


def test_dose_2_still_uses_its_own_time():
    assert "input_datetime.nino_medication_2_time" in sensor("Nino Medication Pending Dose")["state"]
    assert "input_datetime.nino_medication_2_time" in _comment_free(MED / "nino_medication_escalation.yaml")


def test_only_the_effective_sensor_reads_the_raw_dose_1_time():
    """Anything else reading the raw helper for dose-1 timing would fire early on a no-school day."""
    readers = []
    for f in MED.glob("*.yaml"):
        text = _comment_free(f)
        if "input_datetime.nino_medication_1_time" in text:
            readers.append(f.name)
    # the helper definition, the effective sensor and the taken script's fallback ordering
    assert readers == ["nino_medication_reminder.yaml"]
    pending = sensor("Nino Medication Pending Dose")["state"]
    assert "input_datetime.nino_medication_1_time" not in pending
    assert "input_datetime.nino_medication_1_time" in sensor("Nino Medication 1 Effective Time")["state"]


def test_floor_helper_has_no_initial():
    helper = reminder_pkg()["input_datetime"]["nino_medication_no_school_earliest"]
    assert "initial" not in helper and helper["has_time"] and not helper["has_date"]


def test_effective_sensor_is_a_timestamp_and_uses_the_positive_off_test():
    s = sensor("Nino Medication 1 Effective Time")
    assert s["device_class"] == "timestamp"
    assert "is_state('binary_sensor.nino_school_day', 'off')" in s["state"]
    assert "not is_state('binary_sensor.nino_school_day'" not in s["state"]


def test_snooze_minutes_is_positive_off_and_drives_every_snooze_length():
    auto = reminder_auto()
    var = auto["variables"]["snooze_minutes"]
    assert "is_state('binary_sensor.nino_school_day', 'off')" in var
    assert "not is_state" not in var
    starts = [n for n in walk(auto["actions"]) if isinstance(n, dict) and n.get("action") == "timer.start"]
    assert len(starts) == 2
    for st in starts:
        assert "snooze_minutes" in st["data"]["duration"] and "15" not in st["data"]["duration"]
    wait = [n for n in walk(auto["actions"]) if isinstance(n, dict) and "wait_for_trigger" in n][0]
    assert "snooze_minutes" in str(wait["timeout"]) and "15" not in str(wait["timeout"])
    titles = [n["title"] for n in walk(auto["actions"]) if isinstance(n, dict) and str(n.get("title", "")).startswith("Snooze")]
    assert titles == ["Snooze {{ snooze_minutes }} Minutes"]


# --- behaviour: render the templates ----------------------------------------

def test_effective_time_across_days():
    cases = [
        # (day, school_day, floor, expected effective time-of-day)
        ("mon", "on", None, "07:30"),          # school day: unchanged
        ("sat", "off", None, "08:00"),         # no school, unset floor: 08:00
        ("sat", "off", "08:30:00", "08:30"),   # no school, configured floor
        ("sat", "off", "07:00:00", "07:30"),   # floor earlier than dose 1: dose 1 wins
        ("sat", "unavailable", None, "07:30"), # unavailable school sensor: weekday time
    ]
    for day, school, floor, want in cases:
        _, eff, _ = world(day, "06:00", school, floor)
        assert eff[11:16] == want, (day, school, floor, eff)


def test_effective_time_with_a_base_later_than_the_floor():
    _, eff, _ = world("sat", "06:00", "off", None, **{"input_datetime.nino_medication_1_time": "09:15:00"})
    assert eff[11:16] == "09:15"


def test_effective_time_is_unavailable_when_dose_1_helper_is():
    _, eff, pending = world("sat", "09:00", "off", None, **{"input_datetime.nino_medication_1_time": "unavailable"})
    assert eff == "unavailable" and pending == "none"


def test_pending_dose_on_a_no_school_morning():
    awake_early = world("sat", "06:50", "off")[2]
    after_floor = world("sat", "08:01", "off")[2]
    assert awake_early == "none"      # the wake-up trigger resolves to nothing before 08:00
    assert after_floor == "1"
    assert world("mon", "07:31", "on")[2] == "1"   # school day unchanged
    assert world("mon", "07:29", "on")[2] == "none"


def test_pending_dose_two_still_resolves_after_its_time():
    assert world("sat", "13:01", "off", **{"input_boolean.nino_medication_1_taken": "on"})[2] == "2"


def test_snooze_minutes_renders():
    var = reminder_auto()["variables"]["snooze_minutes"]
    for school, want in (("off", "30"), ("on", "15"), ("unavailable", "15")):
        ha = Ha({"binary_sensor.nino_school_day": school}, at("sat", "08:00"))
        assert ha.render(var) == want


def _escalation_fires(day, hhmm, school):
    ha, eff, _ = world(day, hhmm, school)
    cond = escalation_auto()["actions"][0]["if"][0]["value_template"]
    return ha.render(cond) == "True"


def test_dose_1_escalation_counts_from_the_effective_time():
    assert not _escalation_fires("sat", "09:59", "off")
    assert _escalation_fires("sat", "10:01", "off")
    assert _escalation_fires("mon", "09:31", "on")       # school day: 07:30 + 2h
    assert not _escalation_fires("mon", "09:29", "on")
