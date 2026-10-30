"""DnD comes only from camera/mic: one derived sensor, calendar pieces gone."""
import re
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
SENSOR = "binary_sensor.john_dnd_active"
ROOTS = [REPO / d for d in ("packages", "dashboards", "automation", "scripts")]
FILES = [f for r in ROOTS if r.exists() for ext in ("yaml", "yml") for f in r.rglob(f"*.{ext}")]
FILES += list(REPO.glob("*.yaml"))

DELETED = [
    "john_laptop_camera_active", "john_laptop_audio_active", "john_do_not_disturb",
    "john_probably_in_meeting", "john_personal_time", "john_work_call",
    "john_calendar_personal_time", "johns_macbook_pro", "office_mode_dnd_off",
]


class _L(yaml.SafeLoader):
    pass


_L.add_multi_constructor("!", lambda loader, suffix, node: None)


def load(rel):
    return yaml.load((REPO / rel).read_text(), Loader=_L)


def test_no_reference_to_deleted_entities():
    pat = re.compile("|".join(DELETED))
    hits = [f"{f.relative_to(REPO)}: {m}" for f in FILES
            for m in pat.findall(f.read_text())]
    assert not hits, hits


def test_deleted_files_gone():
    d = REPO / "packages/people/john/do_not_disturb"
    for n in ("john_dnd_on", "john_dnd_off", "john_work_call_on", "john_work_call_off",
              "john_personal_time_on", "john_personal_time_off", "john_calendar_personal_time"):
        assert not (d / "automations" / f"{n}.yaml").exists()
    assert not (REPO / "packages/office/modes/office_mode_dnd_off.yaml").exists()


def test_john_dnd_boolean_used_only_by_sensor_and_toggle():
    users = {str(f.relative_to(REPO)) for f in FILES if "input_boolean.john_dnd" in f.read_text()}
    assert users == {
        "packages/people/john/do_not_disturb/sensors/john_dnd_active.yaml",
        "dashboards/templates/button_cards/people/john.yaml",
    }


def test_sensor_definition():
    s = load("packages/people/john/do_not_disturb/sensors/john_dnd_active.yaml")["template"][0]["binary_sensor"][0]
    assert s["unique_id"] == "john_dnd_active"
    assert s["default_entity_id"] == SENSOR
    assert "delay_off" not in s and s["delay_on"]
    for e in ("input_boolean.john_dnd", "binary_sensor.johns_mbp_2026_camera_in_use",
              "binary_sensor.johns_mbp_2026_audio_input_in_use"):
        assert e in s["state"]


def test_consumers_read_derived_sensor():
    for rel in ("packages/office/office_dnd.yaml",
                "packages/office/call_lighting/office_call_lighting_start.yaml",
                "packages/people/john/focus_mode/set_focus_mode.yaml",
                "packages/people/john/daily_report/john_daily_report.yaml"):
        assert SENSOR in (REPO / rel).read_text(), rel


def test_office_dnd_triggers_and_conditions_both_moved():
    autos = {a["id"]: a for a in load("packages/office/office_dnd.yaml")["automation"]}
    for aid in ("office_dnd_on", "office_dnd_off"):
        a = autos[aid]
        assert any(t.get("entity_id") == SENSOR for t in a["triggers"]), aid
        assert SENSOR in yaml.dump(a["conditions"]), aid
    off = next(t for t in autos["office_dnd_off"]["triggers"] if t.get("entity_id") == SENSOR)
    assert off["for"] == {"minutes": 2}


def test_camera_light_uses_mac_sensor_and_off_tolerates_unavailable():
    cam = "binary_sensor.johns_mbp_2026_camera_in_use"
    off = load("packages/office/lights/office_camera_light_off.yaml")["automation"][0]
    assert not any(c.get("state") == "off" and c.get("entity_id") == cam for c in off["conditions"])
    assert any(c.get("condition") == "not" for c in off["conditions"])
    assert cam in yaml.dump(off["triggers"])
    assert cam in (REPO / "packages/office/lights/office_camera_light_on.yaml").read_text()
