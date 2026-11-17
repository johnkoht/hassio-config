"""The router alert covers every zigbee_router-labelled ZHA device (62 as of 2026-11-16)."""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
ALERT = REPO / "packages/system/alerts/zigbee_router_unavailable.yaml"


def _watched():
    auto = yaml.safe_load(ALERT.read_text())["automation"][0]
    (trigger,) = auto["triggers"]
    assert trigger["to"] == "unavailable" and trigger["for"] == {"minutes": 15}
    return trigger["entity_id"]


def test_alert_list_is_the_full_inventory():
    watched = _watched()
    assert len(watched) == len(set(watched)) == 62


def test_alert_covers_the_christmas_plugs():
    # Both tree plugs were missing until 2026-11-16
    groups = yaml.safe_load((REPO / "packages/holidays/christmas/lights/christmas_lights_group.yaml").read_text())
    plugs = {
        e for g in groups["switch"] if g["unique_id"] in ("christmas_trees", "christmas_playroom_lights")
        for e in g["entities"]
    }
    assert plugs and plugs <= set(_watched()), plugs - set(_watched())


def test_alert_covers_every_numbered_smart_plug_on_the_dashboards():
    import re
    text = "".join(p.read_text() for p in (REPO / "dashboards").rglob("*.yaml"))
    plugs = set(re.findall(r"switch\.(?:family_room_)?smart_plug_\d+(?:_switch)?\b", text))
    assert plugs and plugs <= set(_watched()), plugs - set(_watched())
