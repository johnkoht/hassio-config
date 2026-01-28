"""
Test for duplicate definitions.

Detects:
- Duplicate automation IDs
- Duplicate script IDs  
- Duplicate unique_id values
- Duplicate entity definitions
"""
import pytest
from typing import List, Dict, Set
from collections import defaultdict

from conftest import (
    YAMLFile,
    yaml_files,
)


class TestDuplicateAutomations:
    """Test suite for duplicate automation detection."""

    def test_no_duplicate_automation_ids(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate automation IDs exist across all files."""
        automation_ids: Dict[str, List[str]] = defaultdict(list)
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for auto in automations:
                if not isinstance(auto, dict):
                    continue
                
                auto_id = auto.get("id")
                if auto_id:
                    automation_ids[str(auto_id)].append(yf.relative_path)
        
        # Find duplicates
        duplicates = {
            aid: files for aid, files in automation_ids.items()
            if len(files) > 1
        }
        
        if duplicates:
            errors = []
            for auto_id, files in sorted(duplicates.items()):
                errors.append(f"ID '{auto_id}' found in: {', '.join(files)}")
            
            pytest.fail(
                f"Found {len(duplicates)} duplicate automation ID(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_no_duplicate_automation_aliases(self, yaml_files: List[YAMLFile]):
        """Check for duplicate automation aliases (warning only)."""
        automation_aliases: Dict[str, List[str]] = defaultdict(list)
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for auto in automations:
                if not isinstance(auto, dict):
                    continue
                
                alias = auto.get("alias")
                if alias:
                    automation_aliases[str(alias).lower()].append(yf.relative_path)
        
        # Find duplicates
        duplicates = {
            alias: files for alias, files in automation_aliases.items()
            if len(files) > 1
        }
        
        if duplicates:
            print(f"\n⚠️  Found {len(duplicates)} duplicate automation alias(es):")
            for alias, files in sorted(duplicates.items())[:10]:
                print(f"    • '{alias}' in: {', '.join(files[:3])}")


class TestDuplicateScripts:
    """Test suite for duplicate script detection."""

    def test_no_duplicate_script_ids(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate script IDs exist across all files."""
        script_ids: Dict[str, List[str]] = defaultdict(list)
        
        for yf in yaml_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id in scripts.keys():
                if script_id.startswith("__"):
                    continue
                script_ids[script_id].append(yf.relative_path)
        
        # Find duplicates
        duplicates = {
            sid: files for sid, files in script_ids.items()
            if len(files) > 1
        }
        
        if duplicates:
            errors = []
            for script_id, files in sorted(duplicates.items()):
                errors.append(f"Script '{script_id}' defined in: {', '.join(files)}")
            
            pytest.fail(
                f"Found {len(duplicates)} duplicate script ID(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestDuplicateUniqueIds:
    """Test suite for duplicate unique_id detection."""

    def test_no_duplicate_unique_ids(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate unique_id values exist."""
        unique_ids: Dict[str, List[Dict]] = defaultdict(list)
        
        for yf in yaml_files:
            # Check template sensors
            self._extract_unique_ids_from_templates(yf, unique_ids)
            
            # Check automations
            self._extract_unique_ids_from_automations(yf, unique_ids)
        
        # Find duplicates
        duplicates = {
            uid: info for uid, info in unique_ids.items()
            if len(info) > 1
        }
        
        if duplicates:
            errors = []
            for uid, occurrences in sorted(duplicates.items()):
                files = [o['file'] for o in occurrences]
                errors.append(f"unique_id '{uid}' in: {', '.join(files)}")
            
            pytest.fail(
                f"Found {len(duplicates)} duplicate unique_id(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def _extract_unique_ids_from_templates(
        self,
        yf: YAMLFile,
        unique_ids: Dict[str, List[Dict]]
    ):
        """Extract unique_ids from template definitions."""
        templates = yf.content.get("template", [])
        if not isinstance(templates, list):
            templates = [templates] if templates else []
        
        for template_block in templates:
            if not isinstance(template_block, dict):
                continue
            
            # Check sensor templates
            for sensor_type in ["sensor", "binary_sensor"]:
                sensors = template_block.get(sensor_type, [])
                if not isinstance(sensors, list):
                    sensors = [sensors] if sensors else []
                
                for sensor in sensors:
                    if not isinstance(sensor, dict):
                        continue
                    
                    uid = sensor.get("unique_id")
                    if uid:
                        unique_ids[str(uid)].append({
                            "file": yf.relative_path,
                            "type": f"template_{sensor_type}",
                            "name": sensor.get("name", "unnamed")
                        })

    def _extract_unique_ids_from_automations(
        self,
        yf: YAMLFile,
        unique_ids: Dict[str, List[Dict]]
    ):
        """Extract unique_ids from automation definitions (if any)."""
        # Automations typically use 'id' not 'unique_id', but check anyway
        automations = yf.content.get("automation", [])
        if not isinstance(automations, list):
            automations = [automations] if automations else []
        
        for auto in automations:
            if not isinstance(auto, dict):
                continue
            
            uid = auto.get("unique_id")
            if uid:
                unique_ids[str(uid)].append({
                    "file": yf.relative_path,
                    "type": "automation",
                    "name": auto.get("alias", "unnamed")
                })


class TestDuplicateGroups:
    """Test suite for duplicate group detection."""

    def test_no_duplicate_group_ids(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate group IDs exist across all files."""
        group_ids: Dict[str, List[str]] = defaultdict(list)
        
        for yf in yaml_files:
            groups = yf.content.get("group", {})
            if not isinstance(groups, dict):
                continue
            
            for group_id in groups.keys():
                if group_id.startswith("__"):
                    continue
                group_ids[group_id].append(yf.relative_path)
        
        # Find duplicates
        duplicates = {
            gid: files for gid, files in group_ids.items()
            if len(files) > 1
        }
        
        if duplicates:
            errors = []
            for group_id, files in sorted(duplicates.items()):
                errors.append(f"Group '{group_id}' defined in: {', '.join(files)}")
            
            pytest.fail(
                f"Found {len(duplicates)} duplicate group ID(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestDuplicateInputHelpers:
    """Test suite for duplicate input helper detection."""

    def test_no_duplicate_input_booleans(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate input_boolean IDs exist."""
        self._test_no_duplicate_input_type(yaml_files, "input_boolean")

    def test_no_duplicate_input_selects(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate input_select IDs exist."""
        self._test_no_duplicate_input_type(yaml_files, "input_select")

    def test_no_duplicate_input_numbers(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate input_number IDs exist."""
        self._test_no_duplicate_input_type(yaml_files, "input_number")

    def test_no_duplicate_input_texts(self, yaml_files: List[YAMLFile]):
        """Verify no duplicate input_text IDs exist."""
        self._test_no_duplicate_input_type(yaml_files, "input_text")

    def _test_no_duplicate_input_type(
        self,
        yaml_files: List[YAMLFile],
        input_type: str
    ):
        """Generic duplicate input helper test."""
        input_ids: Dict[str, List[str]] = defaultdict(list)
        
        for yf in yaml_files:
            inputs = yf.content.get(input_type, {})
            if not isinstance(inputs, dict):
                continue
            
            for input_id in inputs.keys():
                if input_id.startswith("__"):
                    continue
                input_ids[input_id].append(yf.relative_path)
        
        # Find duplicates
        duplicates = {
            iid: files for iid, files in input_ids.items()
            if len(files) > 1
        }
        
        if duplicates:
            errors = []
            for input_id, files in sorted(duplicates.items()):
                errors.append(f"{input_type}.{input_id} defined in: {', '.join(files)}")
            
            pytest.fail(
                f"Found {len(duplicates)} duplicate {input_type} ID(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestDuplicateSummary:
    """Generate a summary of all definitions for duplicate checking."""

    def test_generate_definition_summary(self, yaml_files: List[YAMLFile]):
        """Generate a summary of all definitions across files."""
        stats = {
            "automations": 0,
            "scripts": 0,
            "groups": 0,
            "input_booleans": 0,
            "input_selects": 0,
            "input_numbers": 0,
            "template_sensors": 0,
        }
        
        for yf in yaml_files:
            # Count automations
            automations = yf.content.get("automation", [])
            if isinstance(automations, list):
                stats["automations"] += len(automations)
            
            # Count scripts
            scripts = yf.content.get("script", {})
            if isinstance(scripts, dict):
                stats["scripts"] += len([k for k in scripts.keys() if not k.startswith("__")])
            
            # Count groups
            groups = yf.content.get("group", {})
            if isinstance(groups, dict):
                stats["groups"] += len([k for k in groups.keys() if not k.startswith("__")])
            
            # Count input helpers
            for input_type, stat_key in [
                ("input_boolean", "input_booleans"),
                ("input_select", "input_selects"),
                ("input_number", "input_numbers"),
            ]:
                inputs = yf.content.get(input_type, {})
                if isinstance(inputs, dict):
                    stats[stat_key] += len([k for k in inputs.keys() if not k.startswith("__")])
            
            # Count template sensors
            templates = yf.content.get("template", [])
            if isinstance(templates, list):
                for tmpl in templates:
                    if isinstance(tmpl, dict):
                        sensors = tmpl.get("sensor", [])
                        if isinstance(sensors, list):
                            stats["template_sensors"] += len(sensors)
        
        print("\n" + "=" * 60)
        print("DEFINITION SUMMARY")
        print("=" * 60)
        print(f"Total automations: {stats['automations']}")
        print(f"Total scripts: {stats['scripts']}")
        print(f"Total groups: {stats['groups']}")
        print(f"Total input_booleans: {stats['input_booleans']}")
        print(f"Total input_selects: {stats['input_selects']}")
        print(f"Total input_numbers: {stats['input_numbers']}")
        print(f"Total template sensors: {stats['template_sensors']}")
        print("=" * 60)
