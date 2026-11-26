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


# ---------------------------------------------------------------------------
# Task 3: dashboard pop-up and header chip
# ---------------------------------------------------------------------------
import re  # noqa: E402

DASH = REPO / "dashboards"
HOME = DASH / "kohbo/home/home.yaml"
POPUP = DASH / "kohbo/home/_quick_actions_popup.yaml"
ALLOWED_SECRETS = {"john_ha_user_id", "cristina_ha_user_id"}


class _Secret(str):
    pass


def _loader(base):
    class L(yaml.SafeLoader):
        pass

    def res(raw):
        raw = raw.strip()
        return REPO / raw[len("/config/"):] if raw.startswith("/config/") else (base / raw)

    def inc(loader, node):
        return _load_dash(res(loader.construct_scalar(node)))

    def inc_dir(loader, node):
        d = res(loader.construct_scalar(node))
        return [_load_dash(f) for f in sorted(d.rglob("*.yaml"))]

    for t in ("!include",):
        L.add_constructor(t, inc)
    for t in ("!include_dir_named", "!include_dir_merge_named", "!include_dir_list",
              "!include_dir_merge_list"):
        L.add_constructor(t, inc_dir)
    L.add_constructor("!secret", lambda l, n: _Secret(l.construct_scalar(n)))
    return L


def _load_dash(path):
    return yaml.load(Path(path).read_text(), Loader=_loader(Path(path).parent))


def _walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from _walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from _walk(v)


def _popup():
    return _load_dash(POPUP)


def _person_blocks():
    """{secret key: the person's top-level conditional card}"""
    out = {}
    for c in _popup()["cards"]:
        if c.get("type") == "conditional":
            cond = c["conditions"][0]
            assert cond["condition"] == "user"
            out[str(cond["users"][0])] = c
    return out


def _conditions(node):
    """Every condition dict under any conditional card or visibility list."""
    found = []
    for n in _walk(node):
        if n.get("type") == "conditional":
            found += n["conditions"]
        if isinstance(n.get("visibility"), list):
            found += n["visibility"]
    return found


def _kinds(conds):
    for c in conds:
        yield c["condition"]
        if "conditions" in c:
            yield from _kinds(c["conditions"])


def test_popup_is_included_and_chip_hash_matches():
    assert "_quick_actions_popup.yaml" in HOME.read_text()
    home = _load_dash(HOME)
    popup = [n for n in _walk(home) if n.get("hash") == "#quick_actions"]
    assert len(popup) == 1 and popup[0]["card_type"] == "pop-up"
    chips = [n for n in _walk(home["cards"][0])
             if n.get("icon") == "mdi:lightning-bolt"]
    assert len(chips) == 2
    for chip in chips:
        assert chip["tap_action"]["navigation_path"] == "#quick_actions"
        assert chip["entity"] in ("sensor.quick_actions_john_count",
                                  "sensor.quick_actions_cristina_count")
        assert chip["custom_fields"]["badge"].strip() == "[[[ return entity.state; ]]]"
    assert {c["entity"] for c in chips} == {"sensor.quick_actions_john_count",
                                            "sensor.quick_actions_cristina_count"}


def test_header_keeps_three_slots():
    toolbar = _load_dash(HOME)["cards"][0]["card"]
    assert len(toolbar["cards"]) == 3


def test_conditionals_use_only_state_user_and_or_not():
    conds = _conditions(_popup()) + _conditions(_load_dash(HOME)["cards"][0])
    assert conds
    assert set(_kinds(conds)) <= {"state", "user", "and", "or", "not"}


def test_conditional_cards_never_use_template_condition():
    assert "condition: template" not in POPUP.read_text()


def _room_sensor_areas(person):
    text = (REPO / f"packages/house/quick_actions/quick_action_{person}_room.yaml").read_text()
    return re.findall(r"'([a-z_]+)',", text)


def _dashboard_rooms(block):
    rows = []
    for n in _walk(block):
        if n.get("type") == "conditional":
            c = n["conditions"][0]
            if c.get("entity", "").endswith("_room_presence"):
                rows.append((c["state"], n["card"]["tap_action"]["navigation_path"]))
    return rows


def test_room_rows_match_the_room_sensors_and_views():
    root = _load_dash(DASH / "kohbo/kohbo.yaml")
    views = {v["path"] for v in root["views"] if isinstance(v, dict) and v.get("path")}
    blocks = _person_blocks()
    assert set(blocks) == ALLOWED_SECRETS
    for person in ("john", "cristina"):
        sensor_areas = _room_sensor_areas(person)
        rows = _dashboard_rooms(blocks[f"{person}_ha_user_id"])
        areas = [a for a, _ in rows]
        assert len(sensor_areas) == 15
        assert len(areas) == len(set(areas)) == 15
        assert set(areas) == set(sensor_areas)
        for area, path in rows:
            assert path.startswith("/dashboard-kohbo/")
            assert path[len("/dashboard-kohbo/"):] in views, path
        for n in _walk(blocks[f"{person}_ha_user_id"]):
            if n.get("type") == "conditional" and n["conditions"][0].get("entity", "").endswith("_room_presence"):
                assert f"sensor.{person}_room_presence" == n["conditions"][0]["entity"]


def test_cristina_has_no_dnd_and_john_does():
    blocks = _person_blocks()
    cristina = yaml.safe_dump(_strip(blocks["cristina_ha_user_id"]))
    john = yaml.safe_dump(_strip(blocks["john_ha_user_id"]))
    assert "john_dnd" not in cristina
    assert "input_boolean.john_dnd" in john and "binary_sensor.john_dnd_active" in john


def _strip(node):
    if isinstance(node, _Secret):
        return str(node)
    if isinstance(node, dict):
        return {k: _strip(v) for k, v in node.items()}
    if isinstance(node, list):
        return [_strip(v) for v in node]
    return node


def test_each_person_sees_own_lamp_only_and_the_shared_rows():
    blocks = _person_blocks()
    for person, lamp, other in (("john", "light.hue_ambiance_lamp_1", "light.hue_ambiance_lamp_1_2"),
                                ("cristina", "light.hue_ambiance_lamp_1_2", None)):
        text = yaml.safe_dump(_strip(blocks[f"{person}_ha_user_id"]))
        assert f"entity: {lamp}\n" in text
        assert f"binary_sensor.quick_action_{person}_bedside_lamp" in text
        other_person = "cristina" if person == "john" else "john"
        assert f"quick_action_{other_person}_bedside_lamp" not in text
        for needle in ("quick_action_nino_nightlight", "quick_action_gianluca_nightlight",
                       "script.nino_sleep_music_start", "script.nino_sleep_music_stop",
                       "input_boolean.camera_notifications", "input_boolean.nino_home_today",
                       "input_boolean.gianluca_home_today", f"sensor.quick_actions_{person}_count"):
            assert needle in text, (person, needle)
    # John's lamp id is a prefix of Cristina's, so John must not see hers
    assert "light.hue_ambiance_lamp_1_2" not in yaml.safe_dump(
        _strip(blocks["john_ha_user_id"]))


def test_only_the_two_user_id_secrets_are_used_under_dashboards():
    used = set()
    for f in DASH.rglob("*.yaml"):
        used |= set(re.findall(r"!secret\s+(\S+)", f.read_text()))
    assert used == ALLOWED_SECRETS
    fake = yaml.safe_load((REPO / "secrets.fake.yaml").read_text())
    assert ALLOWED_SECRETS <= set(fake)


def test_button_card_custom_fields_interpolate_only_entity_state():
    scopes = [_popup(), _load_dash(HOME)["cards"][0]]  # pop-up and header only
    for scope in scopes:
        for n in _walk(scope):
            if n.get("type") == "custom:button-card" and "custom_fields" in n:
                for v in n["custom_fields"].values():
                    assert isinstance(v, str)
                    assert v.strip() == "[[[ return entity.state; ]]]", v
