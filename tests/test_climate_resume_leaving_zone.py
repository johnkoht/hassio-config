"""Climate resumes when an adult leaves a zone carrying the climate_trigger label (JK-1194)."""
import re
from pathlib import Path
from types import SimpleNamespace

import jinja2
import yaml

REPO = Path(__file__).resolve().parent.parent
FILE = REPO / "packages/climate/climate_resume_when_leaving_labelled_zone.yaml"
LABELLED = {"zone.place_a": "Place A", "zone.place_b": "Place B", "light.not_a_zone": "Lamp"}
OTHER_ZONE = {"zone.place_c": "Place C"}


def _auto():
    return yaml.safe_load(FILE.read_text())["automation"][0]


def _tpl_conditions():
    return [c for c in _auto()["conditions"] if c["condition"] == "template"]


def _render(tpl, frm, to, labelled=LABELLED):
    names = {**labelled, **OTHER_ZONE}
    env = jinja2.Environment(extensions=["jinja2.ext.do"])
    out = env.from_string(tpl).render(
        label_entities=lambda label: list(labelled) if label == "climate_trigger" else [],
        state_attr=lambda e, a: names.get(e) if a == "friendly_name" else None,
        trigger=SimpleNamespace(from_state=SimpleNamespace(state=frm), to_state=SimpleNamespace(state=to)),
    )
    return out.strip() == "True"


def _leave(frm, to, labelled=LABELLED):
    (cond,) = _tpl_conditions()
    return _render(cond["value_template"], frm, to, labelled)


def _preset(value):
    env = jinja2.Environment()
    f = lambda e, a: value
    return lambda tpl: env.from_string(tpl).render(state_attr=f, none=None).strip() == "True"


def test_leaving_a_labelled_zone_for_not_home_passes():
    assert _leave("Place A", "not_home")
    assert _leave("Place B", "Place C")


def test_leaving_an_unlabelled_zone_fails():
    assert not _leave("Place C", "not_home")
    assert not _leave("not_home", "Place A")


def test_moving_to_labelled_zone_home_or_unavailable_fails():
    for to in ("Place B", "home", "unavailable", "unknown"):
        assert not _leave("Place A", to), to


def test_newly_labelled_zone_works_without_a_yaml_edit():
    assert not _leave("Place C", "not_home")
    assert _leave("Place C", "not_home", {**LABELLED, "zone.place_c": "Place C"})


def test_non_zone_entities_with_the_label_are_ignored():
    assert not _leave("Lamp", "not_home")


def test_trigger_shape():
    t = _auto()["triggers"]
    assert len(t) == 1 and t[0]["trigger"] == "state"
    assert t[0]["entity_id"] == ["person.john_koht", "person.cristina_falbo"]
    assert t[0]["for"] == {"minutes": 3}
    # a state filter keeps GPS attribute updates from resetting the wait
    assert set(t[0]["not_to"]) == {"unavailable", "unknown"}


def test_house_must_be_empty_and_comes_first():
    first = _auto()["conditions"][0]
    assert first["entity_id"] == "input_boolean.house_occupied" and first["state"] == "off"


def test_nest_preset_guard_per_floor():
    auto = _auto()
    guard = {c["value_template"] for c in auto["conditions"][-1]["conditions"]}
    assert len(guard) == 2
    for tpl in guard:
        assert _preset("eco")(tpl)
        assert not _preset("none")(tpl)
        assert not _preset(None)(tpl)
    ifs = {a["then"][0]["action"]: a["if"][0]["value_template"] for a in auto["actions"]}
    assert set(ifs) == {"script.main_floor_climate_to_resume", "script.second_floor_climate_to_resume"}
    for tpl in ifs.values():
        assert _preset("eco")(tpl) and not _preset("none")(tpl)


def test_file_conventions_and_privacy():
    text = FILE.read_text()
    data = yaml.safe_load(text)
    assert list(data) == ["automation"] and len(data["automation"]) == 1
    assert data["automation"][0]["id"] == FILE.stem
    assert text.startswith("#")
    assert not re.search(r"^\s*(initial|initial_state):", text, re.M)
    assert not re.search(r"^\s*(trigger|condition|action|service|platform):\s*$", text, re.M)
    # only the label names a place; no zone entity ids and no zone names
    assert not re.search(r"\bzone\.(?!['\"])\w+", text.replace("startswith('zone.')", ""))
    assert "label_entities('climate_trigger')" in text
