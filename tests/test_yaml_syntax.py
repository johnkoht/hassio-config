"""
Test YAML syntax validation.

Validates that all YAML files:
- Parse without errors
- Have no duplicate keys
- Use proper encoding (UTF-8)
- Have valid indentation
"""
import pytest
import yaml
from pathlib import Path
from typing import List, Tuple

from conftest import (
    all_yaml_paths,
    ValidationResult,
    CONFIG_ROOT,
    HomeAssistantLoader,
)


class DuplicateKeyError(Exception):
    """Raised when a duplicate key is found in YAML."""
    pass


class UniqueKeyLoader(HomeAssistantLoader):
    """YAML loader that detects duplicate keys and handles HA tags."""
    pass


def construct_unique_mapping(loader, node):
    """Construct a mapping while checking for duplicate keys."""
    loader.flatten_mapping(node)
    pairs = []
    seen_keys = set()
    
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=False)
        if key in seen_keys:
            raise DuplicateKeyError(
                f"Duplicate key '{key}' at line {key_node.start_mark.line + 1}"
            )
        seen_keys.add(key)
        value = loader.construct_object(value_node, deep=False)
        pairs.append((key, value))
    
    return dict(pairs)


UniqueKeyLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    construct_unique_mapping
)


class TestYAMLSyntax:
    """Test suite for YAML syntax validation."""

    def test_yaml_parses_without_error(self, all_yaml_paths: List[Path]):
        """Verify all YAML files parse without syntax errors."""
        errors = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8")
                # Use HA-aware loader to handle !secret, !include, etc.
                yaml.load(content, Loader=HomeAssistantLoader)
            except yaml.YAMLError as e:
                rel_path = path.relative_to(CONFIG_ROOT)
                errors.append(f"{rel_path}: {e}")
            except UnicodeDecodeError as e:
                rel_path = path.relative_to(CONFIG_ROOT)
                errors.append(f"{rel_path}: Unicode decode error - {e}")
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} YAML syntax error(s):\n" + 
                "\n".join(f"  • {e}" for e in errors[:20])  # Limit output
            )

    def test_no_duplicate_keys(self, all_yaml_paths: List[Path]):
        """Verify no YAML files have duplicate keys."""
        errors = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8")
                yaml.load(content, Loader=UniqueKeyLoader)
            except DuplicateKeyError as e:
                rel_path = path.relative_to(CONFIG_ROOT)
                errors.append(f"{rel_path}: {e}")
            except yaml.YAMLError:
                # Syntax errors are caught in another test
                pass
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} file(s) with duplicate keys:\n" + 
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_utf8_encoding(self, all_yaml_paths: List[Path]):
        """Verify all YAML files use valid UTF-8 encoding."""
        errors = []
        
        for path in all_yaml_paths:
            try:
                path.read_text(encoding="utf-8")
            except UnicodeDecodeError as e:
                rel_path = path.relative_to(CONFIG_ROOT)
                errors.append(f"{rel_path}: {e}")
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} file(s) with encoding issues:\n" + 
                "\n".join(f"  • {e}" for e in errors)
            )

    def test_no_tabs_for_indentation(self, all_yaml_paths: List[Path]):
        """Verify YAML files use spaces, not tabs, for indentation."""
        errors = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8")
                lines = content.split("\n")
                
                for i, line in enumerate(lines, 1):
                    if line.startswith("\t") or "\t" in line.split("#")[0]:
                        # Check if tab is in the code portion (not in comments)
                        rel_path = path.relative_to(CONFIG_ROOT)
                        errors.append(f"{rel_path}:{i}: Contains tab character")
                        break  # Only report first occurrence per file
                        
            except UnicodeDecodeError:
                pass  # Handled in another test
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} file(s) using tabs:\n" + 
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_consistent_indentation(self, all_yaml_paths: List[Path]):
        """
        Check for inconsistent indentation patterns.
        
        Home Assistant typically uses 2-space indentation.
        """
        warnings = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8")
                lines = content.split("\n")
                
                # Track indentation levels
                odd_indents = []
                for i, line in enumerate(lines, 1):
                    if not line.strip() or line.strip().startswith("#"):
                        continue
                    
                    # Count leading spaces
                    stripped = line.lstrip()
                    indent = len(line) - len(stripped)
                    
                    # Check for odd indentation (not multiple of 2)
                    if indent % 2 != 0 and indent > 0:
                        odd_indents.append(i)
                
                if odd_indents:
                    rel_path = path.relative_to(CONFIG_ROOT)
                    warnings.append(
                        f"{rel_path}: Odd indentation at lines {odd_indents[:5]}"
                    )
                        
            except UnicodeDecodeError:
                pass
        
        if warnings:
            # This is a warning, not a failure
            print(f"\n⚠️  Found {len(warnings)} file(s) with inconsistent indentation:")
            for w in warnings[:10]:
                print(f"    • {w}")

    def test_no_empty_files(self, all_yaml_paths: List[Path]):
        """Verify no YAML files are completely empty."""
        empty_files = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8").strip()
                if not content:
                    rel_path = path.relative_to(CONFIG_ROOT)
                    empty_files.append(str(rel_path))
            except UnicodeDecodeError:
                pass
        
        if empty_files:
            pytest.fail(
                f"Found {len(empty_files)} empty YAML file(s):\n" + 
                "\n".join(f"  • {f}" for f in empty_files)
            )

    def test_files_end_with_newline(self, all_yaml_paths: List[Path]):
        """Check that YAML files end with a newline (best practice)."""
        files_without_newline = []
        
        for path in all_yaml_paths:
            try:
                content = path.read_text(encoding="utf-8")
                if content and not content.endswith("\n"):
                    rel_path = path.relative_to(CONFIG_ROOT)
                    files_without_newline.append(str(rel_path))
            except UnicodeDecodeError:
                pass
        
        if files_without_newline:
            # This is informational, not a failure
            print(f"\nℹ️  {len(files_without_newline)} file(s) don't end with newline")


# ============================================================================
# Parametrized Tests for Detailed Per-File Reporting
# ============================================================================

def get_yaml_file_ids():
    """Generate test IDs for parametrized tests."""
    from conftest import discover_yaml_files, PACKAGES_DIR
    paths = discover_yaml_files(PACKAGES_DIR)
    return [str(p.relative_to(CONFIG_ROOT)) for p in paths]


@pytest.fixture(scope="module")
def yaml_path_list():
    """Get list of YAML paths for parametrized tests."""
    from conftest import discover_yaml_files, PACKAGES_DIR
    return discover_yaml_files(PACKAGES_DIR)


class TestYAMLSyntaxPerFile:
    """Per-file YAML syntax tests for granular reporting."""

    @pytest.mark.parametrize("rel_path", get_yaml_file_ids()[:100])  # Limit for speed
    def test_individual_file_parses(self, rel_path: str):
        """Test that individual YAML file parses correctly."""
        path = CONFIG_ROOT / rel_path
        if not path.exists():
            pytest.skip(f"File not found: {rel_path}")
        
        content = path.read_text(encoding="utf-8")
        
        try:
            result = yaml.load(content, Loader=HomeAssistantLoader)
            assert result is not None or content.strip() == "", \
                f"File parsed to None but is not empty"
        except yaml.YAMLError as e:
            pytest.fail(f"YAML syntax error: {e}")
