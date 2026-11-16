"""Custom icon sets must load before the first dashboard view renders."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def test_kohbo_icons_preloaded_via_extra_module_url():
    # As a Lovelace resource it loads after the first view, and navbar-card
    # never retries a missing icon, so the Home navbar came up blank.
    cfg = (ROOT / "configuration.yaml").read_text()
    block = re.search(r"^frontend:\n((?:[ #].*\n)+)", cfg, re.M).group(1)
    assert "/local/kohbo/kohbo_icons.js" in block
    assert (ROOT / "www/kohbo/kohbo_icons.js").exists()
