"""
Static checks for the smart climate helpers and seed script (task-1).
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent
SMART = REPO / "packages" / "climate" / "smart"
LIVE_ZONES = ["main_floor", "second_floor", "jr_suite", "main_bedroom", "ninos_bedroom", "basement", "garage"]
ZONES = ["main_floor", "second_floor", "jr_suite", "main_bedroom", "ninos_bedroom", "basement"]


class _Loader(yaml.SafeLoader):
    pass


_Loader.add_multi_constructor("!", lambda loader, suffix, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def walk(node):
    yield node
    if isinstance(node, dict):
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def helpers(domain):
    """All helpers of a domain under packages/climate/smart/, as {id: config}."""
    out = {}
    for f in sorted(SMART.rglob("*.yaml")):
        data = load(f) or {}
        if isinstance(data.get(domain), dict):
            out.update(data[domain])
    return out


HELPER_DOMAINS = ["input_boolean", "input_select", "input_number",
                  "input_datetime", "input_text"]


def seeds():
    script = load(SMART / "scripts" / "climate_seed_defaults.yaml")["script"]["climate_seed_defaults"]
    out = {}
    for step in script["sequence"]:
        if step.get("action") == "input_number.set_value":
            eid = step["target"]["entity_id"]
            assert eid.startswith("input_number.")
            assert eid not in out, f"{eid} seeded twice"
            out[eid.split(".", 1)[1]] = step["data"]["value"]
    return script, out


def test_every_input_number_is_seeded_in_range():
    numbers = helpers("input_number")
    _, seeded = seeds()
    assert numbers, "no input_number helpers found"
    assert set(numbers) == set(seeded)
    for key, cfg in numbers.items():
        assert cfg["min"] <= seeded[key] <= cfg["max"], key


def test_seed_script_modes_and_switches():
    script, _ = seeds()
    assert script["mode"] == "single"
    assert script["alias"] == "Climate - Reset Smart Climate Defaults"
    calls = [(s.get("action"), s.get("target", {}).get("entity_id"), s.get("data"))
             for s in script["sequence"]]
    assert ("input_select.select_option", "input_select.climate_season",
            {"option": "Auto"}) in calls
    off = [c for c in calls if c[0] == "input_boolean.turn_off"]
    assert off and set(off[0][1]) == {"input_boolean.climate_live_control",
                                      *(f"input_boolean.climate_live_{z}" for z in LIVE_ZONES)}
    assert ("input_boolean.turn_on", "input_boolean.climate_automations", None) in calls


def test_no_initial_on_helpers():
    for f in SMART.rglob("*.yaml"):
        data = load(f) or {}
        for domain in HELPER_DOMAINS:
            for key, cfg in (data.get(domain) or {}).items():
                assert "initial" not in (cfg or {}), f"{f.name}: {domain}.{key} has initial"


def test_basenames_unique_and_yaml():
    all_files = [p for p in (REPO / "packages").rglob("*") if p.is_file()]
    counts = {}
    for p in all_files:
        counts.setdefault(p.name, []).append(p)
    for p in SMART.rglob("*"):
        if p.is_file() and p.name != "README.md":
            assert p.suffix == ".yaml", f"{p} must be .yaml"
            assert len(counts[p.name]) == 1, f"duplicate basename {p.name}: {counts[p.name]}"


def test_helper_files_have_header_comment():
    for f in (SMART / "helpers").glob("*.yaml"):
        assert f.read_text().startswith("# "), f.name


def test_radiant_profile_max_at_most_71():
    radiant = {k: v for k, v in helpers("input_number").items()
               if k.startswith("climate_radiant_") and k.endswith("_heat")}
    assert len(radiant) == 4
    for key, cfg in radiant.items():
        assert cfg["max"] <= 71, key


def test_zone_selects_and_season():
    selects = helpers("input_select")
    for z in ZONES:
        assert selects[f"climate_mode_{z}"]["options"] == ["Comfort", "Sleep", "Away", "Off", "Override"]
    assert "climate_mode_garage" not in selects
    assert selects["climate_season"]["options"] == ["Auto", "Heating", "Cooling"]


def test_other_contract_helpers_exist():
    assert {"climate_automations", "climate_live_control", "climate_away_extended",
            "climate_precondition_main_floor", "climate_precondition_second_floor"} <= set(helpers("input_boolean"))
    dt = helpers("input_datetime")
    assert dt["predicted_wake_time"]["has_time"] and not dt["predicted_wake_time"]["has_date"]
    for z in ZONES:
        cfg = dt[f"climate_{z}_last_write"]
        assert cfg["has_date"] and cfg["has_time"]
    assert helpers("input_text")["climate_wake_history"]["max"] == 255


def test_sleep_heat_seeds_main_floor_70_second_floor_72():
    _, seeded = seeds()
    assert seeded["climate_main_floor_sleep_heat"] == 70
    assert seeded["climate_second_floor_sleep_heat"] == 72
