"""Custom icon sets must load before the first dashboard view renders."""
from pathlib import Path

from conftest import load_yaml_ha

ROOT = Path(__file__).resolve().parent.parent


def test_kohbo_icons_preloaded_via_extra_module_url():
    # As a Lovelace resource it loads after the first view, and navbar-card
    # never retries a missing icon, so the Home navbar came up blank.
    cfg = load_yaml_ha((ROOT / "configuration.yaml").read_text())
    urls = [u.split("?")[0] for u in cfg["frontend"]["extra_module_url"]]
    assert "/local/kohbo/kohbo_icons.js" in urls
    assert (ROOT / "www/kohbo/kohbo_icons.js").exists()
