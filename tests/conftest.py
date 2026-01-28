"""
Pytest configuration and shared fixtures for Home Assistant config tests.
"""
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Set, Optional
from dataclasses import dataclass, field

import pytest
import yaml
from ruamel.yaml import YAML

# ============================================================================
# Path Configuration
# ============================================================================

# Base paths - adjust these if your setup differs
CONFIG_ROOT = Path("/root/config")
HA_STORAGE_ROOT = Path("/homeassistant/.storage")
PACKAGES_DIR = CONFIG_ROOT / "packages"
ENTITY_REGISTRY_PATH = HA_STORAGE_ROOT / "core.entity_registry"


# ============================================================================
# Data Classes
# ============================================================================

@dataclass
class YAMLFile:
    """Represents a parsed YAML file with metadata."""
    path: Path
    content: Dict[str, Any]
    raw_content: str
    relative_path: str
    
    @property
    def filename(self) -> str:
        return self.path.name
    
    @property
    def stem(self) -> str:
        return self.path.stem


@dataclass
class EntityRegistry:
    """Home Assistant entity registry wrapper."""
    entities: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    entity_ids: Set[str] = field(default_factory=set)
    
    @classmethod
    def load(cls, path: Path = ENTITY_REGISTRY_PATH) -> "EntityRegistry":
        """Load entity registry from HA storage."""
        if not path.exists():
            return cls()
        
        with open(path, "r") as f:
            data = json.load(f)
        
        entities = {}
        entity_ids = set()
        
        for entity in data.get("data", {}).get("entities", []):
            entity_id = entity.get("entity_id")
            if entity_id:
                entities[entity_id] = entity
                entity_ids.add(entity_id)
        
        return cls(entities=entities, entity_ids=entity_ids)
    
    def exists(self, entity_id: str) -> bool:
        """Check if an entity exists in the registry."""
        return entity_id in self.entity_ids
    
    def get(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """Get entity details by ID."""
        return self.entities.get(entity_id)
    
    def search(self, pattern: str) -> List[str]:
        """Search for entities matching a pattern."""
        import re
        regex = re.compile(pattern, re.IGNORECASE)
        return [eid for eid in self.entity_ids if regex.search(eid)]


@dataclass
class ValidationResult:
    """Result of a validation check."""
    passed: bool
    file_path: str
    message: str
    line_number: Optional[int] = None
    severity: str = "error"  # error, warning, info
    context: Optional[str] = None
    suggestion: Optional[str] = None


# ============================================================================
# YAML Loading Utilities
# ============================================================================

class HomeAssistantLoader(yaml.SafeLoader):
    """
    YAML loader that handles Home Assistant specific tags.
    
    Handles:
    - !secret
    - !include
    - !include_dir_list
    - !include_dir_merge_list
    - !include_dir_named
    - !include_dir_merge_named
    - !env_var
    - !input
    """
    pass


def _secret_constructor(loader, node):
    """Handle !secret tags by returning a placeholder."""
    return f"__SECRET:{loader.construct_scalar(node)}__"


def _include_constructor(loader, node):
    """Handle !include tags by returning a placeholder."""
    return f"__INCLUDE:{loader.construct_scalar(node)}__"


def _generic_constructor(loader, tag_suffix, node):
    """Handle any unknown tags gracefully."""
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    elif isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    elif isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node)
    return None


def _input_constructor(loader, node):
    """Handle !input tags (for blueprints)."""
    return f"__INPUT:{loader.construct_scalar(node)}__"


# Register HA-specific tag handlers
HomeAssistantLoader.add_constructor('!secret', _secret_constructor)
HomeAssistantLoader.add_constructor('!include', _include_constructor)
HomeAssistantLoader.add_constructor('!include_dir_list', _include_constructor)
HomeAssistantLoader.add_constructor('!include_dir_merge_list', _include_constructor)
HomeAssistantLoader.add_constructor('!include_dir_named', _include_constructor)
HomeAssistantLoader.add_constructor('!include_dir_merge_named', _include_constructor)
HomeAssistantLoader.add_constructor('!env_var', _secret_constructor)
HomeAssistantLoader.add_constructor('!input', _input_constructor)

# Handle any other unknown tags gracefully
HomeAssistantLoader.add_multi_constructor('', _generic_constructor)


class SafeLineLoader(HomeAssistantLoader):
    """YAML loader that tracks line numbers and handles HA tags."""
    pass


def construct_mapping(loader, node):
    """Custom constructor to add line numbers to mappings."""
    loader.flatten_mapping(node)
    pairs = loader.construct_pairs(node)
    mapping = dict(pairs)
    mapping['__line__'] = node.start_mark.line + 1
    return mapping


SafeLineLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    construct_mapping
)


def load_yaml_with_lines(content: str) -> Dict[str, Any]:
    """Load YAML content with line number tracking."""
    try:
        return yaml.load(content, Loader=SafeLineLoader) or {}
    except yaml.YAMLError:
        # Fall back to regular loading if line tracking fails
        return load_yaml_ha(content)


def load_yaml_ha(content: str) -> Dict[str, Any]:
    """Load YAML content with Home Assistant tag support."""
    try:
        return yaml.load(content, Loader=HomeAssistantLoader) or {}
    except yaml.YAMLError:
        return {}


def load_yaml_safe(content: str) -> Dict[str, Any]:
    """Safely load YAML content, returning empty dict on error."""
    try:
        return yaml.load(content, Loader=HomeAssistantLoader) or {}
    except yaml.YAMLError:
        return {}


# ============================================================================
# File Discovery
# ============================================================================

def discover_yaml_files(
    directory: Path = PACKAGES_DIR,
    exclude_patterns: List[str] = None
) -> List[Path]:
    """
    Discover all YAML files in the given directory.
    
    Args:
        directory: Root directory to search
        exclude_patterns: List of glob patterns to exclude
        
    Returns:
        List of Path objects for YAML files
    """
    exclude_patterns = exclude_patterns or [
        "*.DISABLED",
        "**/archive/**",
        "**/.git/**",
    ]
    
    yaml_files = []
    for pattern in ["**/*.yaml", "**/*.yml"]:
        yaml_files.extend(directory.glob(pattern))
    
    # Filter out excluded patterns
    def should_include(path: Path) -> bool:
        path_str = str(path)
        for pattern in exclude_patterns:
            if path.match(pattern):
                return False
            # Also check if any part of path matches
            if "archive" in path_str.lower():
                return False
        return True
    
    return sorted([f for f in yaml_files if should_include(f)])


def load_yaml_file(path: Path) -> YAMLFile:
    """Load a single YAML file with metadata."""
    raw_content = path.read_text(encoding="utf-8")
    try:
        content = yaml.load(raw_content, Loader=HomeAssistantLoader) or {}
    except yaml.YAMLError as e:
        content = {"__parse_error__": str(e)}
    
    return YAMLFile(
        path=path,
        content=content,
        raw_content=raw_content,
        relative_path=str(path.relative_to(CONFIG_ROOT))
    )


# ============================================================================
# Entity Reference Extraction
# ============================================================================

# Patterns for entity IDs
ENTITY_DOMAINS = [
    "alarm_control_panel", "automation", "binary_sensor", "button",
    "calendar", "camera", "climate", "cover", "device_tracker",
    "fan", "group", "humidifier", "input_boolean", "input_button",
    "input_datetime", "input_number", "input_select", "input_text",
    "light", "lock", "media_player", "notify", "number", "person",
    "remote", "scene", "script", "select", "sensor", "siren",
    "sun", "switch", "timer", "tts", "update", "vacuum",
    "water_heater", "weather", "zone"
]

ENTITY_ID_PATTERN = r'\b(' + '|'.join(ENTITY_DOMAINS) + r')\.[a-z0-9_]+\b'


def extract_entity_references(content: str) -> Set[str]:
    """Extract all entity ID references from YAML content."""
    import re
    
    # Find all entity_id patterns
    matches = re.findall(ENTITY_ID_PATTERN, content, re.IGNORECASE)
    
    # Also find explicit entity_id references
    entity_refs = set()
    
    # Pattern for entity_id: value or entity_id: [list]
    full_pattern = r'(' + '|'.join(ENTITY_DOMAINS) + r')\.[a-z0-9_]+'
    entity_refs.update(re.findall(full_pattern, content, re.IGNORECASE))
    
    # Reconstruct full entity IDs
    full_refs = set()
    for match in re.finditer(full_pattern, content, re.IGNORECASE):
        full_refs.add(match.group(0).lower())
    
    return full_refs


# ============================================================================
# Pytest Fixtures
# ============================================================================

@pytest.fixture(scope="session")
def config_root() -> Path:
    """Return the config root path."""
    return CONFIG_ROOT


@pytest.fixture(scope="session")
def packages_dir() -> Path:
    """Return the packages directory path."""
    return PACKAGES_DIR


@pytest.fixture(scope="session")
def entity_registry() -> EntityRegistry:
    """Load and cache the entity registry."""
    return EntityRegistry.load()


@pytest.fixture(scope="session")
def yaml_files(packages_dir) -> List[YAMLFile]:
    """Load all YAML files from packages directory."""
    paths = discover_yaml_files(packages_dir)
    return [load_yaml_file(p) for p in paths]


@pytest.fixture(scope="session")
def all_yaml_paths(packages_dir) -> List[Path]:
    """Return paths to all YAML files."""
    return discover_yaml_files(packages_dir)


@pytest.fixture(scope="session")
def automation_files(yaml_files) -> List[YAMLFile]:
    """Filter to only files containing automations."""
    return [f for f in yaml_files if "automation" in f.content]


@pytest.fixture(scope="session")
def script_files(yaml_files) -> List[YAMLFile]:
    """Filter to only files containing scripts."""
    return [f for f in yaml_files if "script" in f.content]


@pytest.fixture(scope="session")
def template_files(yaml_files) -> List[YAMLFile]:
    """Filter to only files containing templates."""
    return [f for f in yaml_files if "template" in f.content]


# ============================================================================
# Pytest Configuration
# ============================================================================

def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "entity_validation: tests that validate entity references"
    )
    config.addinivalue_line(
        "markers", "syntax: tests that validate syntax"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test collection based on markers."""
    # Add slow marker to entity validation tests by default
    for item in items:
        if "entity" in item.nodeid.lower():
            item.add_marker(pytest.mark.entity_validation)


# ============================================================================
# Helper Functions for Tests
# ============================================================================

def format_validation_results(results: List[ValidationResult]) -> str:
    """Format validation results for display."""
    if not results:
        return "All checks passed!"
    
    output = []
    for r in results:
        severity_icon = {"error": "❌", "warning": "⚠️", "info": "ℹ️"}.get(r.severity, "•")
        line_info = f":{r.line_number}" if r.line_number else ""
        output.append(f"{severity_icon} {r.file_path}{line_info}: {r.message}")
        if r.suggestion:
            output.append(f"   💡 Suggestion: {r.suggestion}")
    
    return "\n".join(output)
