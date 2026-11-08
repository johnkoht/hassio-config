"""
Regression test for the announcement engine's TTS URL.

The engine pasted the raw message into media-source://tts/cloud?message=...,
so an "&" in a generated brief ("Shop & Support") split the query and cloud
TTS rejected the rest as "Invalid options found". Renders the real template.
"""
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
ENGINE = REPO / "packages/announcements/announcement_engine.yaml"


def tts_template():
    sequence = yaml.safe_load(ENGINE.read_text())["script"]["announcement_engine"]["sequence"]
    ids = [s["data"]["media_content_id"] for s in sequence
           if s.get("action") == "media_player.play_media"
           and "tts" in str(s["data"].get("media_content_id", ""))]
    assert len(ids) == 1
    return ids[0]


@pytest.mark.parametrize("message", [
    "Sip, Shop & Support event later today.",
    "It's \"Taco Tuesday\" — question? Room #2, 50% chance, a+b=c.",
    "Plain message with no punctuation",
])
def test_message_survives_url_round_trip(message):
    url = Environment(undefined=StrictUndefined).from_string(tts_template()).render(speech_message=message)
    query = parse_qs(urlsplit(url).query, keep_blank_values=True)
    assert set(query) == {"message", "language", "gender"}
    assert query["message"] == [message]
