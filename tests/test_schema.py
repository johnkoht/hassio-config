"""
Test schema validation for Home Assistant configurations.

Validates structural requirements for:
- Automations (id, alias, triggers, actions)
- Scripts (alias, sequence)
- Template sensors (name, unique_id, state)
"""
import pytest
from typing import List, Dict, Any, Optional

from conftest import (
    YAMLFile,
    yaml_files,
    automation_files,
    script_files,
    template_files,
    ValidationResult,
)


class TestAutomationSchema:
    """Test suite for automation schema validation."""

    def test_automations_have_id(self, yaml_files: List[YAMLFile]):
        """Verify all automations have an 'id' field."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                if "id" not in auto:
                    alias = auto.get("alias", f"automation #{i+1}")
                    errors.append(f"{yf.relative_path}: '{alias}' missing 'id' field")
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) without 'id' field:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automations_have_alias(self, yaml_files: List[YAMLFile]):
        """Verify all automations have an 'alias' field."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                if "alias" not in auto:
                    auto_id = auto.get("id", f"index {i}")
                    errors.append(
                        f"{yf.relative_path}: Automation '{auto_id}' missing 'alias' field"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) without 'alias' field:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automations_have_triggers(self, yaml_files: List[YAMLFile]):
        """Verify all automations have triggers defined."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                # Check for triggers: (modern) or trigger: (deprecated)
                has_triggers = "triggers" in auto or "trigger" in auto
                
                if not has_triggers:
                    alias = auto.get("alias", auto.get("id", f"#{i+1}"))
                    errors.append(
                        f"{yf.relative_path}: '{alias}' has no triggers defined"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) without triggers:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automations_have_actions(self, yaml_files: List[YAMLFile]):
        """Verify all automations have actions defined."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                # Check for actions: (modern) or action: (deprecated)
                has_actions = "actions" in auto or "action" in auto
                
                if not has_actions:
                    alias = auto.get("alias", auto.get("id", f"#{i+1}"))
                    errors.append(
                        f"{yf.relative_path}: '{alias}' has no actions defined"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) without actions:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automation_mode_is_valid(self, yaml_files: List[YAMLFile]):
        """Verify automation 'mode' values are valid."""
        valid_modes = {"single", "restart", "queued", "parallel"}
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                mode = auto.get("mode")
                if mode and mode not in valid_modes:
                    alias = auto.get("alias", auto.get("id", f"#{i+1}"))
                    errors.append(
                        f"{yf.relative_path}: '{alias}' has invalid mode '{mode}' "
                        f"(valid: {', '.join(valid_modes)})"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) with invalid mode:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_automation_ids_are_strings(self, yaml_files: List[YAMLFile]):
        """Verify automation IDs are strings, not integers."""
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                
                auto_id = auto.get("id")
                if auto_id is not None and not isinstance(auto_id, str):
                    alias = auto.get("alias", f"#{i+1}")
                    errors.append(
                        f"{yf.relative_path}: '{alias}' has non-string id: {auto_id} "
                        f"(type: {type(auto_id).__name__})"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) with non-string ID:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestScriptSchema:
    """Test suite for script schema validation."""

    def test_scripts_have_alias(self, yaml_files: List[YAMLFile]):
        """Verify all scripts have an 'alias' field."""
        errors = []
        
        for yf in yaml_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id, script_def in scripts.items():
                if script_id.startswith("__"):
                    continue
                if not isinstance(script_def, dict):
                    continue
                
                if "alias" not in script_def:
                    errors.append(
                        f"{yf.relative_path}: Script '{script_id}' missing 'alias' field"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} script(s) without 'alias' field:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_scripts_have_sequence(self, yaml_files: List[YAMLFile]):
        """Verify all scripts have a 'sequence' field."""
        errors = []
        
        for yf in yaml_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id, script_def in scripts.items():
                if script_id.startswith("__"):
                    continue
                if not isinstance(script_def, dict):
                    continue
                
                if "sequence" not in script_def:
                    errors.append(
                        f"{yf.relative_path}: Script '{script_id}' missing 'sequence' field"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} script(s) without 'sequence' field:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_script_mode_is_valid(self, yaml_files: List[YAMLFile]):
        """Verify script 'mode' values are valid."""
        valid_modes = {"single", "restart", "queued", "parallel"}
        errors = []
        
        for yf in yaml_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id, script_def in scripts.items():
                if script_id.startswith("__"):
                    continue
                if not isinstance(script_def, dict):
                    continue
                
                mode = script_def.get("mode")
                if mode and mode not in valid_modes:
                    errors.append(
                        f"{yf.relative_path}: Script '{script_id}' has invalid mode '{mode}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} script(s) with invalid mode:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestTemplateSensorSchema:
    """Test suite for template sensor schema validation."""

    def test_template_sensors_have_name(self, yaml_files: List[YAMLFile]):
        """Verify all template sensors have a 'name' field."""
        errors = []
        
        for yf in yaml_files:
            templates = yf.content.get("template", [])
            if not isinstance(templates, list):
                templates = [templates] if templates else []
            
            for template_block in templates:
                if not isinstance(template_block, dict):
                    continue
                
                sensors = template_block.get("sensor", [])
                if not isinstance(sensors, list):
                    sensors = [sensors] if sensors else []
                
                for i, sensor in enumerate(sensors):
                    if not isinstance(sensor, dict):
                        continue
                    
                    if "name" not in sensor:
                        unique_id = sensor.get("unique_id", f"#{i+1}")
                        errors.append(
                            f"{yf.relative_path}: Template sensor '{unique_id}' "
                            f"missing 'name' field"
                        )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} template sensor(s) without 'name':\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_template_sensors_have_unique_id(self, yaml_files: List[YAMLFile]):
        """Verify all template sensors have a 'unique_id' field."""
        errors = []
        
        for yf in yaml_files:
            templates = yf.content.get("template", [])
            if not isinstance(templates, list):
                templates = [templates] if templates else []
            
            for template_block in templates:
                if not isinstance(template_block, dict):
                    continue
                
                sensors = template_block.get("sensor", [])
                if not isinstance(sensors, list):
                    sensors = [sensors] if sensors else []
                
                for i, sensor in enumerate(sensors):
                    if not isinstance(sensor, dict):
                        continue
                    
                    if "unique_id" not in sensor:
                        name = sensor.get("name", f"#{i+1}")
                        errors.append(
                            f"{yf.relative_path}: Template sensor '{name}' "
                            f"missing 'unique_id' field"
                        )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} template sensor(s) without 'unique_id':\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_template_sensors_have_state(self, yaml_files: List[YAMLFile]):
        """Verify all template sensors have a 'state' field."""
        errors = []
        
        for yf in yaml_files:
            templates = yf.content.get("template", [])
            if not isinstance(templates, list):
                templates = [templates] if templates else []
            
            for template_block in templates:
                if not isinstance(template_block, dict):
                    continue
                
                sensors = template_block.get("sensor", [])
                if not isinstance(sensors, list):
                    sensors = [sensors] if sensors else []
                
                for i, sensor in enumerate(sensors):
                    if not isinstance(sensor, dict):
                        continue
                    
                    if "state" not in sensor:
                        name = sensor.get("name", sensor.get("unique_id", f"#{i+1}"))
                        errors.append(
                            f"{yf.relative_path}: Template sensor '{name}' "
                            f"missing 'state' field"
                        )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} template sensor(s) without 'state':\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestGroupSchema:
    """Test suite for group schema validation."""

    def test_groups_have_entities(self, yaml_files: List[YAMLFile]):
        """Verify all groups have an 'entities' field."""
        errors = []
        
        for yf in yaml_files:
            groups = yf.content.get("group", {})
            if not isinstance(groups, dict):
                continue
            
            for group_id, group_def in groups.items():
                if group_id.startswith("__"):
                    continue
                if not isinstance(group_def, dict):
                    continue
                
                if "entities" not in group_def:
                    errors.append(
                        f"{yf.relative_path}: Group '{group_id}' missing 'entities' field"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} group(s) without 'entities':\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestInputHelperSchema:
    """Test suite for input helper schema validation."""

    def test_input_boolean_structure(self, yaml_files: List[YAMLFile]):
        """Verify input_boolean definitions have valid structure."""
        errors = []
        
        for yf in yaml_files:
            input_booleans = yf.content.get("input_boolean", {})
            if not isinstance(input_booleans, dict):
                continue
            
            for ib_id, ib_def in input_booleans.items():
                if ib_id.startswith("__"):
                    continue
                # input_boolean can be None (defaults) or dict
                if ib_def is not None and not isinstance(ib_def, dict):
                    errors.append(
                        f"{yf.relative_path}: input_boolean '{ib_id}' has invalid "
                        f"definition type: {type(ib_def).__name__}"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} input_boolean(s) with invalid structure:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_input_select_has_options(self, yaml_files: List[YAMLFile]):
        """Verify input_select definitions have options."""
        errors = []
        
        for yf in yaml_files:
            input_selects = yf.content.get("input_select", {})
            if not isinstance(input_selects, dict):
                continue
            
            for is_id, is_def in input_selects.items():
                if is_id.startswith("__"):
                    continue
                if not isinstance(is_def, dict):
                    continue
                
                if "options" not in is_def:
                    errors.append(
                        f"{yf.relative_path}: input_select '{is_id}' missing 'options'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} input_select(s) without options:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )
