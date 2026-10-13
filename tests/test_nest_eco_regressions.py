"""
Regression tests for the Nest Eco / HVAC-mode flip hotfix.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
FLOORS = [("main_floor", "climate.nest_main_floor", "input_text.temperature_mode_main_floor"),
          ("second_floor", "climate.nest_2nd_floor", "input_text.temperature_mode_2nd_floor")]


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(rel_path):
    return yaml.load((REPO / rel_path).read_text(), Loader=_Loader)


def walk(node):
    yield node
    if isinstance(node, dict):
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def test_bedtime_eco_has_no_unconditional_fallback():
    """A morning back-to-bed must not send the main floor to Eco (old choose default did)."""
    auto = load("automation/house/climate/main_floor/main_floor_climate_to_eco.yaml")
    assert not any(isinstance(n, dict) and "default" in n for n in walk(auto["actions"]))
    guard = [c for c in auto["conditions"] if c.get("condition") == "or"]
    assert guard, "bedtime trigger needs a time-window guard"
    times = [c for c in guard[0]["conditions"] if c.get("condition") == "time"]
    assert times and times[0]["before"] == "04:00:00"


@pytest.mark.parametrize("floor,climate,helper", FLOORS)
def test_eco_saves_hvac_mode(floor, climate, helper):
    script = load(f"packages/climate/{floor}/{floor}_climate_to_eco.yaml")["script"]
    (body,) = script.values()
    saves = [n for n in walk(body["sequence"]) if isinstance(n, dict)
             and n.get("action") == "input_text.set_value"
             and n.get("target", {}).get("entity_id") == helper]
    assert saves, f"{floor} Eco must save the HVAC mode to {helper}"


@pytest.mark.parametrize("floor,climate,helper", FLOORS)
def test_resume_restores_hvac_mode(floor, climate, helper):
    script = load(f"packages/climate/{floor}/{floor}_climate_to_resume.yaml")["script"]
    (body,) = script.values()
    restores = [n for n in walk(body["sequence"]) if isinstance(n, dict)
                and n.get("action") == "climate.set_hvac_mode"]
    assert restores and helper in restores[0]["data"]["hvac_mode"]


@pytest.mark.parametrize("floor", ["main_floor", "second_floor"])
@pytest.mark.parametrize("name", ["activate_eco_when_energy_is_expensive",
                                  "resume_when_energy_prices_fall"])
def test_energy_price_triggers_are_debounced(floor, name):
    auto = load(f"packages/climate/{floor}/{floor}_climate_{name}.yaml")["automation"][0]
    (trigger,) = auto["triggers"]
    assert trigger.get("for"), "energy price trigger needs a for: dwell"
