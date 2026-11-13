"""Dashboard views: unique paths, and plug tiles that show their real state."""
from collections import Counter
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DASH = ROOT / "dashboards"


class _Loader(yaml.SafeLoader):
    pass


# Keep every !include tag as its path string; nothing is resolved while loading.
for _tag in ("!include", "!include_dir_list", "!include_dir_merge_list",
             "!include_dir_named", "!include_dir_merge_named"):
    _Loader.add_constructor(_tag, lambda loader, node: loader.construct_scalar(node))


def _load(path):
    return yaml.load(path.read_text(), Loader=_Loader)


def _repo_path(ref):
    return ROOT / ref.replace("/config/", "", 1)


def test_every_view_path_is_unique():
    views = _load(DASH / "kohbo" / "kohbo.yaml")["views"]
    paths = []
    for v in views:
        view = _load(_repo_path(v)) if isinstance(v, str) else v
        paths.append((view["path"], v if isinstance(v, str) else "<inline>"))
    assert len(paths) > 20
    dupes = {p for p, n in Counter(p for p, _ in paths).items() if n > 1}
    assert not dupes, [x for x in paths if x[0] in dupes]


def test_plug_template_shows_unavailable_and_unknown():
    tpl = _load(DASH / "templates/button_cards/cards/devices/kohbo_device_smart_plug_entity.yaml")
    display = tpl["kohbo_device_smart_plug_entity"]["state_display"].lower()
    assert "unavailable" in display and "unknown" in display


def _playroom_plug_tiles():
    page = _load(DASH / "kohbo/rooms/main_floor/playroom.yaml")
    found = []

    def walk(n):
        if isinstance(n, dict):
            if n.get("template") == "kohbo_device_smart_plug_entity":
                found.append(n)
            for x in n.values():
                walk(x)
        elif isinstance(n, list):
            for x in n:
                walk(x)

    walk(page)
    return found


def test_playroom_plug_tiles_have_no_confirmation():
    tiles = _playroom_plug_tiles()
    assert len(tiles) == 4
    bad = [t["entity"] for t in tiles if (t.get("variables") or {}).get("confirmation")]
    assert not bad, bad


def test_bay_window_plug_has_no_power_sensor():
    tile = next(t for t in _playroom_plug_tiles() if t["entity"] == "switch.smart_plug_18_switch")
    assert "power_sensor" not in (tile.get("variables") or {})
