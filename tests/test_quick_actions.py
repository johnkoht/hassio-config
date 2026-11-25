"""
JK-1074 quick actions: Nino's sleep music start/stop scripts.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
MEDIA = REPO / "packages/ninos_room/media"

START_ACTIONS = [
    {"action": "media_player.shuffle_set",
     "target": {"entity_id": "media_player.ninos_room"},
     "data": {"shuffle": True}},
    {"action": "media_player.repeat_set",
     "target": {"entity_id": "media_player.ninos_room"},
     "data": {"repeat": "all"}},
    {"action": "media_player.play_media",
     "target": {"entity_id": "media_player.ninos_room"},
     "data": {"media_content_type": "playlist",
              "media_content_id": "spotify:playlist:0Aip39YSo3rqFim2uiRCc6",
              "enqueue": "replace"}},
    {"action": "input_boolean.turn_on",
     "target": {"entity_id": "input_boolean.nino_sleep_music_playing"}},
]


def load(name):
    return yaml.safe_load((MEDIA / f"{name}.yaml").read_text())


def test_start_script_has_the_original_actions_in_order():
    seq = load("nino_sleep_music_start")["script"]["nino_sleep_music_start"]["sequence"]
    assert seq == START_ACTIONS


def test_stop_script_mirrors_off_automation_actions():
    seq = load("nino_sleep_music_stop")["script"]["nino_sleep_music_stop"]["sequence"]
    off = load("nino_sleep_music_off")["automation"][0]["actions"]
    assert seq == off
    assert [s["action"] for s in seq] == ["media_player.media_pause", "input_boolean.turn_off"]
    assert all(s["target"]["entity_id"] in
               ("media_player.ninos_room", "input_boolean.nino_sleep_music_playing") for s in seq)


def test_on_automation_calls_start_script_and_keeps_its_gates():
    auto = load("nino_sleep_music_on")["automation"][0]
    assert auto["actions"] == [{"action": "script.nino_sleep_music_start"}]
    assert auto["id"] == "nino_sleep_music_on"
    assert auto["alias"] == "Nino's Bedroom - Sleep Music On"
    assert auto["mode"] == "single"
    assert len(auto["triggers"]) == 3
    assert len(auto["conditions"]) == 7
    assert auto["triggers"][0]["entity_id"] == "binary_sensor.nino_bed_occupied"


def test_script_basenames_are_unique_in_packages():
    for name in ("nino_sleep_music_start", "nino_sleep_music_stop"):
        assert len(list((REPO / "packages").rglob(f"{name}.yaml"))) == 1


# ---- Task 2: visibility template sensors ------------------------------------

from datetime import datetime, timedelta, timezone

import pytest

from smart_climate_harness import FakeHA, entities, truthy

QA = "packages/house/quick_actions"
NOW = datetime(2026, 11, 24, 7, 0, tzinfo=timezone.utc)
AREAS = ["dining_room", "family_room", "foyer", "gianlucas_room", "jr_suite", "kitchen",
         "laundry_room", "main_bathroom", "main_bedroom", "mud_room", "nino_room",
         "office", "playroom", "powder_room", "upstairs_hallway"]


def cfg(name):
    ents = entities(f"{QA}/quick_action_{name}.yaml")
    assert len(ents) == 1
    uid, (_, c) = next(iter(ents.items()))
    return uid, c


def on(name, states):
    _, c = cfg(name)
    return truthy(FakeHA(states, now=NOW).render_entity(c))


def test_every_new_file_has_unique_id_default_entity_id_and_unique_basename():
    files = sorted((REPO / QA).glob("*.yaml"))
    assert len(files) == 11
    for f in files:
        assert f.name.startswith("quick_action_")
        assert len(list((REPO / "packages").rglob(f.name))) == 1
        (uid, (domain, c)), = entities(f"{QA}/{f.name}").items()
        assert c["default_entity_id"] == f"{domain}.{uid}"
        assert "initial" not in f.read_text() and "trigger" not in c


@pytest.mark.parametrize("who,lamp,pres,bed", [
    ("john", "light.hue_ambiance_lamp_1", "sensor.john_room_presence", "input_boolean.john_is_in_bed"),
    ("cristina", "light.hue_ambiance_lamp_1_2", "sensor.cristina_room_presence", "input_boolean.cristina_in_bed"),
])
def test_bedside_lamp(who, lamp, pres, bed):
    ok = {lamp: "on", pres: "main_bedroom", bed: "on"}
    assert on(f"{who}_bedside_lamp", ok)
    for k, v in [(lamp, "off"), (lamp, "unavailable"), (lamp, "unknown"),
                 (pres, "kitchen"), (pres, "not_home"), (pres, "unavailable"),
                 (bed, "off"), (bed, "unavailable")]:
        assert not on(f"{who}_bedside_lamp", {**ok, k: v}), (k, v)


@pytest.mark.parametrize("kid,lamp", [("nino", "light.nino_bedroom_lamp"),
                                      ("gianluca", "light.gianluca_lamp")])
def test_nightlight(kid, lamp):
    n = f"{kid}_nightlight"
    assert on(n, {"sun.sun": "below_horizon", lamp: "off"})
    assert on(n, {"sun.sun": "above_horizon", lamp: "on"})
    assert not on(n, {"sun.sun": "above_horizon", lamp: "off"})
    for bad in ("unavailable", "unknown"):
        assert not on(n, {"sun.sun": "below_horizon", lamp: bad})
        assert not on(n, {"sun.sun": "above_horizon", lamp: bad})


def test_nino_music():
    base = {"media_player.ninos_room": "idle", "sun.sun": "below_horizon",
            "input_select.ninos_bedroom": "Auto", "binary_sensor.nino_bed_occupied": "on"}
    assert on("nino_music", base)
    assert on("nino_music", {**base, "media_player.ninos_room": "playing", "sun.sun": "above_horizon",
                             "input_select.ninos_bedroom": "Off", "binary_sensor.nino_bed_occupied": "off"})
    for k, v in [("sun.sun", "above_horizon"), ("input_select.ninos_bedroom", "Off"),
                 ("binary_sensor.nino_bed_occupied", "off"),
                 ("media_player.ninos_room", "unavailable"), ("media_player.ninos_room", "unknown")]:
        assert not on("nino_music", {**base, k: v}), (k, v)


def start_at(delta_min):
    return (NOW + timedelta(minutes=delta_min)).isoformat()


@pytest.mark.parametrize("kid,sched", [("nino", "primary"), ("gianluca", "parochial")])
def test_home_today(kid, sched):
    n = f"{kid}_home_today"
    ht, day, st = f"input_boolean.{kid}_home_today", f"binary_sensor.{kid}_school_day", \
        f"sensor.{sched}_school_start_time_today"
    base = {ht: "off", day: "on"}
    for d in (-59, -60, 59, 60, 0):
        assert on(n, {**base, st: start_at(d)}), d
    for d in (-61, 61, -600, 600):
        assert not on(n, {**base, st: start_at(d)}), d
    assert not on(n, {**base, day: "off", st: start_at(0)})
    for bad in ("unavailable", "unknown", "garbage", ""):
        assert not on(n, {**base, st: bad})
    assert not on(n, base)  # sensor missing entirely
    for bad in ("unavailable", "unknown", "garbage"):
        assert on(n, {ht: "on", day: "off", st: bad})
    assert on(n, {ht: "on", day: "on", st: start_at(500)})


def test_header_says_live_now_template():
    for kid in ("nino", "gianluca"):
        text = (REPO / QA / f"quick_action_{kid}_home_today.yaml").read_text()
        assert "live now()" in text and "not trigger-based" in text


@pytest.mark.parametrize("who", ["john", "cristina"])
def test_room_sensor(who):
    pres = f"sensor.{who}_room_presence"
    for a in AREAS:
        assert on(f"{who}_room", {pres: a}), a
    for a in ("not_home", "unknown", "unavailable", "garage", "", "kitchen_2"):
        assert not on(f"{who}_room", {pres: a}), a
    assert not on(f"{who}_room", {})


@pytest.mark.parametrize("who", ["john", "cristina"])
def test_count_sensor(who):
    _, c = cfg(f"{who}_count")
    rows = [f"binary_sensor.quick_action_{x}" for x in
            (f"{who}_room", f"{who}_bedside_lamp", "nino_nightlight", "gianluca_nightlight",
             "nino_music", "nino_home_today", "gianluca_home_today")]
    other = "cristina" if who == "john" else "john"
    noise = {f"binary_sensor.quick_action_{other}_room": "on",
             f"binary_sensor.quick_action_{other}_bedside_lamp": "on"}

    def count(on_rows):
        s = {r: ("on" if r in on_rows else "off") for r in rows}
        out = FakeHA({**s, **noise}, now=NOW).render_entity(c)
        assert out.isdigit()
        return int(out)

    assert count([]) == 0
    assert count(rows) == 7
    for i in range(1, 8):
        assert count(rows[:i]) == i
    s = {r: "unavailable" for r in rows}
    assert int(FakeHA(s, now=NOW).render_entity(c)) == 0
