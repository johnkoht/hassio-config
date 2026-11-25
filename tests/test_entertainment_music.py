"""
Phase 2 of JK-1166: the music that starts with entertainment mode.

Static structure plus real-jinja renders of the zone config, the speaker
filter (TV on) and the volume clamp. Crazy Mode and this never share the
speakers; both directions are pinned here.
"""
import ast
from pathlib import Path

import yaml
from jinja2 import Environment

REPO = Path(__file__).resolve().parent.parent
PKG = REPO / "packages"
ENT_DIR = PKG / "house" / "entertainment"
ENT = "input_boolean.entertainment_mode"


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def load(path):
    return yaml.load(Path(path).read_text(), Loader=_Loader)


def auto(name):
    return load(ENT_DIR / name)["automation"][0]


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


HELPERS = load(ENT_DIR / "entertainment_helpers.yaml")
START = load(ENT_DIR / "entertainment_music_start.yaml")["script"]["entertainment_music_start"]
STOP = load(ENT_DIR / "entertainment_music_stop.yaml")["script"]["entertainment_music_stop"]
ZONE_SENSOR = load(ENT_DIR / "entertainment_zone_config.yaml")["template"][0]["sensor"][0]


def render(tpl, **ctx):
    return Environment().from_string(tpl).render(**ctx).strip()


def zone(key):
    return ast.literal_eval(render(ZONE_SENSOR["attributes"][key]))


# ---- helpers ----------------------------------------------------------------
def test_no_helper_has_initial():
    for section in ("input_select", "input_text", "input_number", "input_boolean"):
        for key, cfg in HELPERS[section].items():
            assert "initial" not in cfg, (section, key)


def test_zone_select_options_and_volume_bounds():
    assert HELPERS["input_select"]["entertainment_music_zone"]["options"] == ["Indoor", "Outdoor", "Off"]
    v = HELPERS["input_number"]["entertainment_volume"]
    assert v["min"] <= 30 <= v["max"] and v["step"] == 5


def test_playlist_select_writes_the_favorite_and_reads_the_sonos_source_list():
    sel = HELPERS["template"][0]["select"][0]
    assert "source_list" in sel["options"]
    call = sel["select_option"][0]
    assert call["action"] == "input_text.set_value"
    assert call["target"]["entity_id"] == "input_text.entertainment_favorite"
    assert call["data"]["value"] == "{{ option }}"
    assert sel["state"] == "{{ states('input_text.entertainment_favorite') }}"


# ---- zones ------------------------------------------------------------------
def test_indoor_zone_is_the_four_indoor_speakers_with_the_dining_room_speaker():
    z = zone("indoor")
    assert z["speakers"] == ["media_player.sonos_kitchen", "media_player.sonos_family_room",
                             "media_player.sonos_living_room", "media_player.sonos_playroom"]
    assert z["coordinator"] == "media_player.sonos_kitchen"


def test_outdoor_zone_is_patio_pool_gazebo():
    z = zone("outdoor")
    assert z["speakers"] == ["media_player.sonos_patio", "media_player.sonos_pool", "media_player.sonos_gazebo"]
    assert z["coordinator"] in z["speakers"]


def test_the_tv_is_in_no_zone_and_music_never_calls_it():
    assert "bravia" not in (ENT_DIR / "entertainment_zone_config.yaml").read_text()
    for s in walk(START["sequence"]):
        assert "bravia" not in str(s.get("target", "")) + str(s.get("entity_id", ""))
    assert "bravia" not in str(STOP)


# ---- start ------------------------------------------------------------------
def guards():
    out = []
    for s in START["sequence"]:
        if s.get("condition"):
            out.append(s)
        else:
            break
    return out


def test_start_guards_in_order_global_to_feature():
    g = guards()
    assert [x.get("entity_id") for x in g] == [
        ENT, "input_boolean.house_occupied", "input_boolean.bedtime",
        "binary_sensor.emergency_active", "input_select.crazy_mode_phase", None]
    assert [x["state"] for x in g[:5]] == ["on", "on", "off", "off", "Off"]
    assert "cfg is mapping" in g[5]["value_template"]


def test_missing_favorite_logs_and_stops():
    step = next(s for s in START["sequence"] if "if" in s and "source_list" in str(s["if"]))
    assert any(x.get("action") == "system_log.write" for x in step["then"])
    assert any("stop" in x for x in step["then"])
    assert "favorite == ''" in step["if"][0]["value_template"]


def _var(name):
    return next(s for s in START["sequence"] if s.get("variables") and name in s["variables"])["variables"][name]


def test_family_room_speaker_leaves_the_group_only_with_tv_on_indoors():
    tpl = _var("speakers")
    fr = "media_player.sonos_family_room"
    on = ast.literal_eval(render(tpl, cfg=zone("indoor"), zone_key="indoor", tv_on=True))
    off = ast.literal_eval(render(tpl, cfg=zone("indoor"), zone_key="indoor", tv_on=False))
    out = ast.literal_eval(render(tpl, cfg=zone("outdoor"), zone_key="outdoor", tv_on=True))
    assert fr not in on and len(on) == 3
    assert fr in off and len(off) == 4
    assert out == zone("outdoor")["speakers"]


def test_volume_is_thirty_percent_at_thirty_and_clamped():
    def r(v):
        env = Environment()
        env.globals["states"] = lambda e: str(v)
        return float(env.from_string(_var("volume")).render())

    assert r(30) == 0.3
    assert r(5) == 0.1 and r(100) == 0.7


def test_start_order_flag_ungroup_join_volume_source_shuffle():
    seq = START["sequence"]

    def idx(pred):
        return next(i for i, s in enumerate(seq) if pred(s))

    flag = idx(lambda s: s.get("action") == "input_boolean.turn_on")
    ungroup = idx(lambda s: "repeat" in s)
    join = idx(lambda s: "if" in s and "join" in str(s))
    vol = idx(lambda s: s.get("action") == "media_player.volume_set")
    src = idx(lambda s: s.get("action") == "media_player.select_source")
    delay = idx(lambda s: "delay" in s)
    shuffle = idx(lambda s: s.get("action") == "media_player.shuffle_set")
    assert flag < ungroup < join < vol < src < delay < shuffle
    assert seq[shuffle]["data"]["shuffle"] is True


# ---- stop -------------------------------------------------------------------
def test_stop_only_runs_for_a_flagged_start_and_clears_it():
    first = STOP["sequence"][0]
    assert first["condition"] == "state"
    assert first["entity_id"] == "input_boolean.entertainment_music_started" and first["state"] == "on"
    assert "input_boolean.turn_off" in [s.get("action") for s in STOP["sequence"]]
    pauses = [s for s in walk(STOP["sequence"]) if s.get("action") == "media_player.media_pause"]
    assert pauses and pauses[0]["target"]["entity_id"] == "{{ cfg.coordinator }}"


# ---- wiring -----------------------------------------------------------------
def test_music_automations_wiring():
    on, off, zc = (auto(f"entertainment_music_{n}.yaml") for n in ("on", "off", "zone_change"))
    assert on["triggers"][0]["to"] == "on"
    assert [s["action"] for s in on["actions"]] == ["script.entertainment_music_start"]
    assert off["triggers"][0]["to"] == "off"
    assert [s["action"] for s in off["actions"]] == ["script.entertainment_music_stop"]
    assert off["conditions"] == [{"condition": "state",
                                  "entity_id": "input_boolean.entertainment_music_started", "state": "on"}]
    assert zc["conditions"] == [{"condition": "state", "entity_id": ENT, "state": "on"}]
    assert [s["action"] for s in zc["actions"]] == ["script.entertainment_music_stop",
                                                    "script.entertainment_music_start"]
    for a in (on, off, zc):
        text = str(a)
        assert "automation.turn" not in text


# ---- Crazy Mode and entertainment never share the speakers ------------------
def test_crazy_mode_refuses_while_the_mode_is_on():
    text = (PKG / "house/crazy_mode/crazy_mode_allowed.yaml").read_text()
    assert "is_state('input_boolean.entertainment_mode', 'on') %}entertainment" in text


def test_music_start_waits_out_a_crazy_run():
    g = next(x for x in guards() if x.get("entity_id") == "input_select.crazy_mode_phase")
    assert g["state"] == "Off"


def test_popup_shows_the_music_controls():
    text = (REPO / "dashboards/kohbo/home/house_mode_popup.yaml").read_text()
    for e in ("input_select.entertainment_music_zone", "select.entertainment_playlist",
              "input_number.entertainment_volume"):
        assert f"entity: {e}" in text
