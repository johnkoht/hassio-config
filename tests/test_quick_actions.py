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
