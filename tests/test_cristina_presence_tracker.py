"""
Cristina's Bayesian presence watches her current phone's UniFi tracker (JK-1250).

The old iPhone 14 tracker has been `not_home` since the phone was replaced, so the
router observation was dead weight. Weights and structure stay as they were.
"""
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parent.parent
OLD = "device_tracker.cristinas_iphone_14_unifi"
NEW = "device_tracker.cristinas_iphone_17_unifi"


def _observations():
    sensors = yaml.safe_load((REPO / "binary_sensors/cristina/cristina_presence.yaml").read_text())
    assert sensors[0]["platform"] == "bayesian"
    return sensors[0]["observations"]


def test_router_observation_uses_new_tracker_with_same_weights():
    router = [o for o in _observations() if o.get("entity_id") == NEW]
    assert len(router) == 1
    o = router[0]
    assert (o["prob_given_true"], o["prob_given_false"], o["to_state"]) == (0.5, 0.25, "home")


def test_old_tracker_is_gone_from_config():
    hits = []
    for root in ("binary_sensors", "packages", "automation", "group", "dashboards", "sensors"):
        for p in (REPO / root).rglob("*"):
            if p.is_file() and p.suffix in (".yaml", ".yml") and OLD in p.read_text():
                hits.append(str(p.relative_to(REPO)))
    assert hits == []


def test_observation_count_unchanged():
    # app, iPhone detect, router, room presence
    assert len(_observations()) == 4
