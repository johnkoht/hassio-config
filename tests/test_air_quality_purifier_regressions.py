"""Room purifiers: indoor thresholds, no Off on an Awair dropout, hysteresis, preset re-check.

On 2026-11-21 an Awair cloud blip made every room sensor unavailable and the shared script's
else-branch turned the purifiers off; near a threshold the kitchen flapped about once a minute.
"""
from pathlib import Path
from types import SimpleNamespace

import jinja2
import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
AQ = REPO / "packages/air_quality"
ROOMS = {
    "kitchen": "packages/kitchen/air_quality/kitchen_air_quality",
    "gianluca_bedroom": "packages/gianluca_room/air_quality/gianluca_room_air_quality",
    "nino_bedroom": "packages/ninos_room/air_quality/nino_bedroom_air_quality",
    "main_bedroom": "packages/main_bedroom/air_quality/main_bedroom_air_quality",
    "jr_suite": "packages/jr_suite/air_quality/jr_suite_air_quality",
    "office": "packages/office/air_quality/office_air_quality",
}
# Starting values the README tells you to set once after deploy.
THRESHOLDS = {"pm25_moderate": 15, "pm25_poor": 35, "pm25_hazardous": 55,
              "tvoc_moderate": 500, "tvoc_poor": 1500, "tvoc_hazardous": 5000,
              "co2_moderate": 1000, "co2_poor": 2000, "co2_hazardous": 4500}
UNAVAILABLE = ("unavailable", "unknown")


class _L(yaml.SafeLoader):
    pass


_L.add_multi_constructor("!", lambda loader, suffix, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_L)


def sensor(slug):
    return load(REPO / f"{ROOMS[slug]}_sensor.yaml")["template"][0]["sensor"][0]


def _float(value, default=None):
    try:
        return float(value)
    except (TypeError, ValueError):
        if default is None:
            raise
        return default


def render(tpl, values, this_state=None):
    env = jinja2.Environment()
    env.filters["float"] = _float

    def states(eid):
        return str(values.get(eid, "unavailable"))

    def has_value(eid):
        return states(eid) not in UNAVAILABLE

    ctx = dict(states=states, has_value=has_value, this=SimpleNamespace(state=this_state))
    return env.from_string(tpl).render(**ctx).strip()


def readings(slug, pm25=2, voc=200, co2=600):
    vals = {f"input_number.{k}": v for k, v in THRESHOLDS.items()}
    vals.update({f"sensor.{slug}_awair_pm2_5": pm25, f"sensor.{slug}_awair_vocs": voc,
                 f"sensor.{slug}_awair_carbon_dioxide": co2})
    return vals


def state(slug, this=None, **kw):
    return render(sensor(slug)["state"], readings(slug, **kw), this)


# --- Task 1: thresholds are tunable and survive restarts ---------------------------------

@pytest.mark.parametrize("pollutant", ["pm25", "tvoc", "co2"])
def test_threshold_helpers_have_no_initial_and_no_floor(pollutant):
    helpers = load(AQ / f"air_quality_{pollutant}_thresholds.yaml")["input_number"]
    assert len(helpers) == 4
    for name, cfg in helpers.items():
        assert "initial" not in cfg, name
        assert cfg["min"] == 0, name
    for k, v in THRESHOLDS.items():
        if k.startswith(pollutant):
            assert helpers[k]["max"] >= v, k


# --- Task 2: a dropout never turns a purifier off ----------------------------------------

@pytest.mark.parametrize("slug", ROOMS)
def test_template_unavailable_when_a_reading_is_missing(slug):
    avail = sensor(slug)["availability"]
    assert render(avail, readings(slug)) == "True"
    for key in ("pm2_5", "vocs", "carbon_dioxide"):
        vals = readings(slug)
        vals[f"sensor.{slug}_awair_{key}"] = "unavailable"
        assert render(avail, vals) == "False", key


@pytest.mark.parametrize("slug", [s for s in ROOMS if s != "office"])
def test_detection_ignores_a_drop_to_unavailable(slug):
    auto = load(REPO / f"{ROOMS[slug]}_detections.yaml")["automation"][0]
    trig = [t for t in auto["triggers"] if t["entity_id"] == f"sensor.{slug}_air_quality"]
    assert len(trig) == 1
    assert set(trig[0]["not_to"]) == set(UNAVAILABLE)
    # Coming back from a dropout must still resync, so no not_from.
    assert "not_from" not in trig[0]
    assert trig[0]["for"] == {"minutes": 1}


def test_office_triggers_only_fire_on_known_states():
    auto = load(REPO / f"{ROOMS['office']}_detections.yaml")["automation"][0]
    for t in auto["triggers"]:
        if t["entity_id"] == "sensor.office_air_quality":
            assert t["to"] in ("Acceptable", "Moderate", "Unhealthy", "Hazardous")


def _script():
    return load(AQ / "air_quality_set_purifier_mode.yaml")["script"]["air_quality_set_air_purifier_mode"]


def test_script_stops_on_unknown_state_before_choosing():
    seq = _script()["sequence"]
    choose_at = next(i for i, s in enumerate(seq) if "choose" in s)
    guards = [s for s in seq[:choose_at] if s.get("condition") == "template"]
    assert len(guards) == 1
    env = jinja2.Environment()
    for aqi, ok in (("Acceptable", True), ("Hazardous", True), ("unavailable", False),
                    ("unknown", False), ("", False)):
        assert env.from_string(guards[0]["value_template"]).render(aqi_state=aqi).strip() == str(ok)


# --- Task 3: hysteresis ----------------------------------------------------------------

@pytest.mark.parametrize("slug", ROOMS)
@pytest.mark.parametrize("kw,this,want", [
    ({}, None, "Acceptable"),
    ({"pm25": 16}, "Acceptable", "Moderate"),          # steps up at the threshold
    ({"voc": 1600}, "Acceptable", "Unhealthy"),        # jumps straight to the band
    ({"co2": 4600}, "Moderate", "Hazardous"),
    ({"voc": 450}, "Moderate", "Moderate"),            # between 80% and 100%: holds
    ({"voc": 390}, "Moderate", "Acceptable"),          # below 80%: steps down
    ({"pm25": 30}, "Unhealthy", "Unhealthy"),          # 30 > 0.8 * 35: holds
    ({"pm25": 20}, "Unhealthy", "Moderate"),           # below 80% of poor, above moderate
    ({"pm25": 2}, "Hazardous", "Acceptable"),
    ({"voc": 450}, "unavailable", "Acceptable"),       # no usable this.state
    ({"voc": 450}, None, "Acceptable"),
])
def test_hysteresis(slug, kw, this, want):
    assert state(slug, this, **kw) == want


@pytest.mark.parametrize("slug", ROOMS)
def test_missing_threshold_helper_does_not_read_as_hazardous(slug):
    vals = readings(slug)
    for k in THRESHOLDS:
        vals.pop(f"input_number.{k}")
    assert render(sensor(slug)["state"], vals, "Acceptable") == "Acceptable"


def test_room_templates_are_identical_but_for_the_room():
    def norm(slug):
        text = (REPO / f"{ROOMS[slug]}_sensor.yaml").read_text()
        name = sensor(slug)["name"].removesuffix(" Air Quality")
        return text.replace(slug, "ROOM").replace(name, "NAME")
    base = norm("kitchen")
    for slug in ROOMS:
        assert norm(slug) == base, slug


# --- Task 4: preset re-check -----------------------------------------------------------

def _branch(mode):
    choose = next(s for s in _script()["sequence"] if "choose" in s)["choose"]
    return next(c["sequence"] for c in choose if f"'{mode}'" in c["conditions"])


@pytest.mark.parametrize("mode", ["Auto", "Sleep"])
def test_auto_and_sleep_recheck_the_preset(mode):
    seq = _branch(mode)
    delay = next(i for i, s in enumerate(seq) if "delay" in s)
    assert seq[delay]["delay"] == {"seconds": 15}
    retry = seq[delay + 1]
    assert f"!= '{mode}'" in retry["if"][0]["value_template"]
    assert retry["then"][0]["action"] == "fan.set_preset_mode"
    assert retry["then"][0]["data"]["preset_mode"] == mode


def test_script_stays_queued():
    """Parallel runs would let an Auto re-check undo a newer Manual run on the same purifier."""
    assert _script()["mode"] == "queued"


@pytest.mark.parametrize("mode", ["Auto", "Sleep"])
def test_recheck_never_powers_a_turned_off_purifier_back_on(mode):
    retry = next(s for s in _branch(mode) if "if" in s)
    conds = retry["if"]
    assert any("is_state(purifier, 'on')" in c.get("value_template", "") for c in conds)
    assert any(c.get("entity_id") == "input_boolean.construction_mode" and c["state"] == "off"
               for c in conds)


@pytest.mark.parametrize("slug", ROOMS)
def test_detection_is_queued_so_triggers_during_the_recheck_are_not_dropped(slug):
    """The script call waits out the 15 s re-check; mode: single would drop triggers meanwhile."""
    auto = load(REPO / f"{ROOMS[slug]}_detections.yaml")["automation"][0]
    assert auto["mode"] == "queued"
