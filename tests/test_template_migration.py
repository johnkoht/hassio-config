"""
Template entity migration tests.

Guards the 2026.6 migration that converted legacy `platform: template`
entities to modern `template:` syntax (see plans/2026-07-ha-upgrade-report.md).

Two layers:

1. TestNoLegacyTemplateSyntax (static, runs anywhere)
   Fails if any legacy `- platform: template` entity definition reappears in a
   LOADED file. On HA 2026.6+ that syntax silently creates ZERO entities, so
   this is a hard regression guard, not a style nit. Only scans `.yaml` — HA's
   include dirs ignore `.yml`, which this repo uses to park disabled files.

2. TestMigratedEntityIdsPreserved (live, needs the HA entity registry)
   Every migrated entity pins its id with `default_entity_id`. This checks
   each pinned id actually exists in the running registry — catching the two
   real failure modes: an entity that never got created, or one that landed
   under a suffixed id (e.g. sensor.office_presence_2) because the pin was
   not honored. Skips cleanly when run off-host (no registry available).
"""
from pathlib import Path
from typing import Dict, List

import pytest

from conftest import (
    CONFIG_ROOT,
    EntityRegistry,
    entity_registry,
    load_yaml_file,
)

# Directories that can hold entity definitions in this repo.
_SCAN_DIRS = ["packages", "sensors", "binary_sensors", "switch", "template"]

# Top-level keys whose list items carry a `platform:` (legacy platform form).
_PLATFORM_DOMAINS = (
    "sensor", "binary_sensor", "switch", "cover", "fan", "light", "lock", "vacuum"
)


def _iter_config_yaml() -> List[Path]:
    # HA's !include_dir_* directives only glob `*.yaml` — `.yml` files are never
    # loaded (this repo uses `.yml` as a "parked/disabled" marker), so legacy
    # syntax inside a `.yml` is harmless and must NOT be flagged. Scan `.yaml`.
    paths: List[Path] = []
    for d in _SCAN_DIRS:
        root = CONFIG_ROOT / d
        if not root.exists():
            continue
        paths.extend(root.glob("**/*.yaml"))
    return sorted(p for p in paths if "archive" not in str(p).lower())


def _legacy_template_entities(content) -> bool:
    """True if `content` defines a legacy `platform: template` entity.

    Matches the legacy entity form only (a sensor:/binary_sensor:/... list with
    an item `platform: template`). Does NOT match bayesian observations (those
    are `platform: bayesian` with nested template observations) nor modern
    `template:` blocks.
    """
    if not isinstance(content, dict):
        # Merge-list files load as a list of platform dicts.
        items = content if isinstance(content, list) else []
        return any(
            isinstance(i, dict) and i.get("platform") == "template" and
            any(k in i for k in ("sensors", "switches", "covers", "fans",
                                 "lights", "locks", "vacuums"))
            for i in items
        )
    for domain in _PLATFORM_DOMAINS:
        block = content.get(domain)
        if isinstance(block, list):
            for item in block:
                if isinstance(item, dict) and item.get("platform") == "template":
                    return True
    return False


def _collect_default_entity_ids() -> Dict[str, List[str]]:
    """Map default_entity_id -> [files that declare it] across template blocks."""
    found: Dict[str, List[str]] = {}
    for path in _iter_config_yaml():
        yf = load_yaml_file(path)
        content = yf.content
        if not isinstance(content, dict):
            continue
        blocks = content.get("template")
        if blocks is None:
            continue
        if isinstance(blocks, dict):
            blocks = [blocks]
        for block in blocks:
            if not isinstance(block, dict):
                continue
            for domain, entities in block.items():
                if not isinstance(entities, list):
                    continue
                for ent in entities:
                    if isinstance(ent, dict) and ent.get("default_entity_id"):
                        found.setdefault(ent["default_entity_id"], []).append(
                            yf.relative_path
                        )
    return found


class TestNoLegacyTemplateSyntax:
    """Legacy `platform: template` entity syntax must never reappear."""

    def test_no_legacy_template_platform_entities(self):
        offenders = [
            str(p.relative_to(CONFIG_ROOT))
            for p in _iter_config_yaml()
            if _legacy_template_entities(load_yaml_file(p).content)
        ]
        if offenders:
            pytest.fail(
                "Legacy `platform: template` entity syntax found (creates ZERO "
                f"entities on HA 2026.6+). Convert to a modern `template:` block:\n"
                + "\n".join(f"  • {o}" for o in offenders)
            )


class TestMigratedEntityIdsPreserved:
    """Each pinned default_entity_id must resolve to a real registry entity."""

    def test_default_entity_ids_are_unique(self):
        dupes = {
            eid: files
            for eid, files in _collect_default_entity_ids().items()
            if len(files) > 1
        }
        if dupes:
            pytest.fail(
                "default_entity_id declared in more than one file:\n"
                + "\n".join(f"  • {eid}: {', '.join(f)}" for eid, f in dupes.items())
            )

    def test_pinned_entity_ids_exist_in_registry(self, entity_registry: EntityRegistry):
        pinned = _collect_default_entity_ids()
        assert pinned, "no template entities with default_entity_id were found"

        if not entity_registry.entity_ids:
            pytest.skip(
                "entity registry unavailable (run on the HA host after deploy)"
            )

        missing = sorted(eid for eid in pinned if not entity_registry.exists(eid))
        if missing:
            # Surface any suffixed near-miss to make the diagnosis obvious.
            details = []
            for eid in missing:
                near = entity_registry.search(f"^{eid}(_[0-9]+)?$")
                hint = f" (found instead: {', '.join(near)})" if near else ""
                details.append(f"  • {eid}{hint}")
            pytest.fail(
                f"{len(missing)} pinned entity id(s) missing from the registry — "
                "either not created, or landed under a suffixed id:\n"
                + "\n".join(details)
            )
