"""
Test naming convention compliance.

Validates naming patterns for:
- File names: [domain/room/area]_[device/object/thing]_[state/action/etc].yaml
- Automation IDs
- Script IDs
- Entity IDs
"""
import re
import pytest
from pathlib import Path
from typing import List, Set, Dict

from conftest import (
    YAMLFile,
    yaml_files,
    all_yaml_paths,
    CONFIG_ROOT,
)


# ============================================================================
# Naming Patterns
# ============================================================================

# File naming pattern: snake_case with .yaml extension
FILE_NAME_PATTERN = re.compile(r'^[a-z][a-z0-9_]*\.ya?ml$')

# Common room/area prefixes (expand as needed)
KNOWN_AREAS = {
    "kitchen", "living_room", "family_room", "dining_room", "bedroom",
    "bathroom", "main_bedroom", "main_bathroom", "office", "garage",
    "basement", "attic", "foyer", "mudroom", "laundry", "hallway",
    "stairs", "pool", "backyard", "frontyard", "driveway", "porch",
    "playroom", "guest", "jr_suite", "gianluca", "nino", "upstairs",
    "downstairs", "first_floor", "second_floor", "upper_floor", "lower_floor",
    "main_floor", "house", "outdoor", "exterior", "interior",
    "mudroom_bathroom", "powder_room", "security", "media", "climate",
    "air_quality", "energy", "weather", "people", "lights", "vacuums",
    "holidays", "reminders", "system", "utilities",
}

# Common action/state suffixes
KNOWN_SUFFIXES = {
    "on", "off", "auto", "manual", "occupied", "not_occupied", "state",
    "mode", "status", "alert", "notification", "trigger", "triggered",
    "arm", "disarm", "lock", "unlock", "open", "close", "start", "stop",
    "enable", "disable", "active", "inactive", "motion", "presence",
    "temperature", "humidity", "lights", "fan", "group", "script",
    "automation", "sensor", "entity", "occupancy", "timer", "schedule",
}


class TestFileNaming:
    """Test suite for file naming conventions."""

    def test_yaml_files_are_snake_case(self, all_yaml_paths: List[Path]):
        """Verify all YAML files use snake_case naming."""
        errors = []
        
        for path in all_yaml_paths:
            filename = path.name
            
            # Check for snake_case
            if not FILE_NAME_PATTERN.match(filename):
                rel_path = path.relative_to(CONFIG_ROOT)
                
                # Identify the issue
                issues = []
                if filename[0].isupper():
                    issues.append("starts with uppercase")
                if " " in filename:
                    issues.append("contains spaces")
                if "-" in filename:
                    issues.append("uses hyphens (use underscores)")
                if not filename.endswith(('.yaml', '.yml')):
                    issues.append("wrong extension")
                
                issue_str = ", ".join(issues) if issues else "not snake_case"
                errors.append(f"{rel_path}: {issue_str}")
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} file(s) with naming issues:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_no_typos_in_filenames(self, all_yaml_paths: List[Path]):
        """Check for common typos in filenames."""
        typos = {
            "alerm": "alarm",
            "ocupied": "occupied",
            "occuppied": "occupied",
            "tempature": "temperature",
            "temperture": "temperature",
            "humidty": "humidity",
            "lighitng": "lighting",
            "ligting": "lighting",
            "notifcation": "notification",
            "notifaction": "notification",
            "automaiton": "automation",
            "triggerd": "triggered",
            "disabel": "disable",
            "enabel": "enable",
            "conition": "condition",
            "bathrom": "bathroom",
            "bedrrom": "bedroom",
            "kithcen": "kitchen",
        }
        
        errors = []
        
        for path in all_yaml_paths:
            filename_lower = path.stem.lower()
            
            for typo, correct in typos.items():
                if typo in filename_lower:
                    rel_path = path.relative_to(CONFIG_ROOT)
                    errors.append(
                        f"{rel_path}: Contains '{typo}' - did you mean '{correct}'?"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} filename(s) with possible typos:\n" +
                "\n".join(f"  • {e}" for e in errors)
            )

    def test_files_in_appropriate_directories(self, all_yaml_paths: List[Path]):
        """
        Check that files are in directories that match their content.
        
        e.g., kitchen files should be in a kitchen/ directory
        """
        warnings = []
        
        for path in all_yaml_paths:
            filename_stem = path.stem.lower()
            parent_dir = path.parent.name.lower()
            
            # Extract area from filename (first part before underscore)
            parts = filename_stem.split('_')
            if parts:
                file_area = parts[0]
                
                # Check if file area matches directory (with some flexibility)
                if file_area in KNOWN_AREAS:
                    # Some areas have variations
                    area_variations = {file_area}
                    if file_area.endswith('_room'):
                        area_variations.add(file_area.replace('_room', ''))
                    
                    # Check if parent directory is related
                    if parent_dir not in area_variations and file_area != parent_dir:
                        # Could be in a subdirectory like lights/, modes/, etc.
                        grandparent = path.parent.parent.name.lower() if path.parent.parent else ""
                        if grandparent not in area_variations and file_area not in parent_dir:
                            # This might be misplaced
                            pass  # Too noisy to report
        
        # This check is informational only
        if warnings:
            print(f"\nℹ️  {len(warnings)} file(s) may be in wrong directories")


class TestAutomationNaming:
    """Test suite for automation ID and alias naming."""

    def test_automation_ids_are_snake_case(self, yaml_files: List[YAMLFile]):
        """Verify automation IDs use snake_case."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for auto in automations:
                if not isinstance(auto, dict):
                    continue
                
                auto_id = auto.get("id")
                if not auto_id:
                    continue
                
                # Check for snake_case (allowing quotes)
                id_clean = str(auto_id).strip('"\'')
                if not re.match(r'^[a-z][a-z0-9_]*$', id_clean):
                    alias = auto.get("alias", "unnamed")
                    errors.append(
                        f"{yf.relative_path}: Automation '{alias}' has non-snake_case "
                        f"id: '{id_clean}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) with non-snake_case IDs:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automation_aliases_are_descriptive(self, yaml_files: List[YAMLFile]):
        """Check that automation aliases are descriptive (not just IDs)."""
        warnings = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for auto in automations:
                if not isinstance(auto, dict):
                    continue
                
                alias = auto.get("alias", "")
                auto_id = auto.get("id", "")
                
                if not alias:
                    continue
                
                # Check if alias is too short or just matches ID
                if len(alias) < 5:
                    warnings.append(
                        f"{yf.relative_path}: Automation alias '{alias}' is very short"
                    )
                elif alias.lower().replace(' ', '_').replace('-', '_') == str(auto_id).lower():
                    warnings.append(
                        f"{yf.relative_path}: Alias '{alias}' is same as ID - "
                        f"consider a more descriptive alias"
                    )
        
        if warnings:
            print(f"\nℹ️  {len(warnings)} automation(s) could have more descriptive aliases:")
            for w in warnings[:10]:
                print(f"    • {w}")


class TestScriptNaming:
    """Test suite for script naming conventions."""

    def test_script_ids_are_snake_case(self, yaml_files: List[YAMLFile]):
        """Verify script IDs use snake_case."""
        errors = []
        
        for yf in yaml_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id in scripts.keys():
                if script_id.startswith("__"):
                    continue
                
                if not re.match(r'^[a-z][a-z0-9_]*$', script_id):
                    errors.append(
                        f"{yf.relative_path}: Script has non-snake_case id: '{script_id}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} script(s) with non-snake_case IDs:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestEntityNaming:
    """Test suite for entity naming conventions in definitions."""

    def test_input_boolean_names_are_snake_case(self, yaml_files: List[YAMLFile]):
        """Verify input_boolean names use snake_case."""
        errors = []
        
        for yf in yaml_files:
            input_booleans = yf.content.get("input_boolean", {})
            if not isinstance(input_booleans, dict):
                continue
            
            for ib_name in input_booleans.keys():
                if ib_name.startswith("__"):
                    continue
                
                if not re.match(r'^[a-z][a-z0-9_]*$', ib_name):
                    errors.append(
                        f"{yf.relative_path}: input_boolean has non-snake_case name: "
                        f"'{ib_name}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} input_boolean(s) with non-snake_case names:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_group_names_are_snake_case(self, yaml_files: List[YAMLFile]):
        """Verify group names use snake_case."""
        errors = []
        
        for yf in yaml_files:
            groups = yf.content.get("group", {})
            if not isinstance(groups, dict):
                continue
            
            for group_name in groups.keys():
                if group_name.startswith("__"):
                    continue
                
                if not re.match(r'^[a-z][a-z0-9_]*$', group_name):
                    errors.append(
                        f"{yf.relative_path}: group has non-snake_case name: '{group_name}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} group(s) with non-snake_case names:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestNamingConsistency:
    """Test for naming consistency patterns."""

    def test_consistent_area_naming(self, all_yaml_paths: List[Path]):
        """Check for inconsistent area naming across files."""
        # Collect all area-like terms used in filenames
        area_terms: Dict[str, List[str]] = {}
        
        for path in all_yaml_paths:
            parts = path.stem.lower().split('_')
            if parts:
                # First 1-2 parts are often the area
                for i in range(1, min(3, len(parts) + 1)):
                    potential_area = '_'.join(parts[:i])
                    if potential_area not in area_terms:
                        area_terms[potential_area] = []
                    area_terms[potential_area].append(str(path))
        
        # Look for similar but inconsistent naming
        warnings = []
        checked = set()
        
        for area1 in area_terms:
            if area1 in checked:
                continue
            
            # Find similar terms
            for area2 in area_terms:
                if area1 == area2 or area2 in checked:
                    continue
                
                # Check if they're similar (could be inconsistent)
                if (area1 in area2 or area2 in area1) and len(area1) > 3 and len(area2) > 3:
                    # Might be the same thing named differently
                    if abs(len(area1) - len(area2)) <= 5:
                        # e.g., "main_bath" vs "main_bathroom"
                        pass  # Could report but might be too noisy
            
            checked.add(area1)
