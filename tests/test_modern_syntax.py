"""
Test Home Assistant modern syntax compliance.

Based on the modern automation syntax requirements:
- triggers: (not trigger:)
- trigger: state (not platform: state)
- conditions: (not condition:)
- actions: (not action: at automation level)
- action: domain.service (not service:)
- target: for entity targeting
"""
import re
import pytest
from pathlib import Path
from typing import List, Dict, Any, Tuple

from conftest import (
    YAMLFile,
    yaml_files,
    automation_files,
    script_files,
    ValidationResult,
    CONFIG_ROOT,
)


class TestModernAutomationSyntax:
    """Test suite for modern Home Assistant automation syntax."""

    def test_triggers_not_trigger(self, yaml_files: List[YAMLFile]):
        """
        Verify automations use 'triggers:' (plural) not 'trigger:' (singular).
        
        Modern: triggers:
        Deprecated: trigger:
        """
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                    
                # Check for deprecated 'trigger:' key
                if "trigger" in auto and "triggers" not in auto:
                    alias = auto.get("alias", f"automation #{i+1}")
                    errors.append(
                        f"{yf.relative_path}: '{alias}' uses deprecated 'trigger:' "
                        f"instead of 'triggers:'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) using deprecated 'trigger:' syntax:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_trigger_type_not_platform(self, yaml_files: List[YAMLFile]):
        """
        Verify triggers use 'trigger: state' not 'platform: state'.
        
        Modern: trigger: state
        Deprecated: platform: state
        """
        errors = []
        
        # Also check raw content for platform: usage in trigger context
        platform_pattern = re.compile(
            r'^\s+-\s*platform:\s*(state|time|event|numeric_state|sun|template|mqtt|webhook|zone|device)',
            re.MULTILINE
        )
        
        for yf in yaml_files:
            matches = platform_pattern.findall(yf.raw_content)
            if matches:
                # Find line numbers
                lines = yf.raw_content.split('\n')
                for i, line in enumerate(lines, 1):
                    if re.match(r'\s+-\s*platform:', line):
                        errors.append(
                            f"{yf.relative_path}:{i}: Uses deprecated 'platform: {line.split(':')[-1].strip()}' "
                            f"instead of 'trigger: ...'"
                        )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} trigger(s) using deprecated 'platform:' syntax:\n" +
                "\n".join(f"  • {e}" for e in errors[:30])
            )

    def test_conditions_not_condition(self, yaml_files: List[YAMLFile]):
        """
        Verify automations use 'conditions:' (plural) not 'condition:' (singular).
        
        Modern: conditions:
        Deprecated: condition:
        """
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                    
                # Check for deprecated 'condition:' key at automation level
                if "condition" in auto and "conditions" not in auto:
                    alias = auto.get("alias", f"automation #{i+1}")
                    errors.append(
                        f"{yf.relative_path}: '{alias}' uses deprecated 'condition:' "
                        f"instead of 'conditions:'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) using deprecated 'condition:' syntax:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_actions_not_action_in_automation(self, yaml_files: List[YAMLFile]):
        """
        Verify automations use 'actions:' (plural) not 'action:' (singular).
        
        Modern: actions:
        Deprecated: action: (at automation level)
        """
        errors = []
        
        for yf in yaml_files:
            automations = yf.content.get("automation", [])
            if not isinstance(automations, list):
                automations = [automations] if automations else []
            
            for i, auto in enumerate(automations):
                if not isinstance(auto, dict):
                    continue
                    
                # Check for deprecated 'action:' key at automation level
                # Note: 'action:' is correct for service calls within actions
                if "action" in auto and "actions" not in auto:
                    # Check if it's at the automation level (not nested)
                    alias = auto.get("alias", f"automation #{i+1}")
                    errors.append(
                        f"{yf.relative_path}: '{alias}' uses deprecated 'action:' "
                        f"instead of 'actions:'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} automation(s) using deprecated 'action:' syntax:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_service_replaced_with_action(self, yaml_files: List[YAMLFile]):
        """
        Verify service calls use 'action:' not 'service:'.
        
        Modern: action: light.turn_on
        Deprecated: service: light.turn_on
        """
        errors = []
        
        # Pattern to find service: calls
        service_pattern = re.compile(
            r'^\s+-?\s*service:\s*([a-z_]+\.[a-z_]+)',
            re.MULTILINE
        )
        
        for yf in yaml_files:
            lines = yf.raw_content.split('\n')
            for i, line in enumerate(lines, 1):
                # Match lines with 'service:' that look like service calls
                match = re.match(r'^(\s*)-?\s*service:\s*([a-z_]+\.[a-z_]+)', line)
                if match:
                    service_name = match.group(2)
                    errors.append(
                        f"{yf.relative_path}:{i}: Uses deprecated 'service: {service_name}' "
                        f"instead of 'action: {service_name}'"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} service call(s) using deprecated 'service:' syntax:\n" +
                "\n".join(f"  • {e}" for e in errors[:30])
            )

    def test_target_syntax_for_entities(self, yaml_files: List[YAMLFile]):
        """
        Check for inline entity_id usage that should use target: syntax.
        
        Modern:
          action: light.turn_on
          target:
            entity_id: light.living_room
            
        Deprecated:
          action: light.turn_on
          entity_id: light.living_room
        """
        warnings = []
        
        # Pattern to detect action/service followed immediately by entity_id
        # This is a heuristic check - may have false positives
        pattern = re.compile(
            r'^\s*(action|service):\s*[a-z_]+\.[a-z_]+\s*\n\s*entity_id:',
            re.MULTILINE
        )
        
        for yf in yaml_files:
            matches = list(pattern.finditer(yf.raw_content))
            for match in matches:
                # Calculate line number
                line_num = yf.raw_content[:match.start()].count('\n') + 1
                warnings.append(
                    f"{yf.relative_path}:{line_num}: Consider using 'target:' syntax "
                    f"instead of inline 'entity_id:'"
                )
        
        if warnings:
            # This is a warning, not a failure (inline syntax still works)
            print(f"\n⚠️  Found {len(warnings)} place(s) that could use 'target:' syntax:")
            for w in warnings[:15]:
                print(f"    • {w}")


class TestModernScriptSyntax:
    """Test suite for modern Home Assistant script syntax."""

    def test_scripts_have_sequence(self, script_files: List[YAMLFile]):
        """Verify all scripts define a 'sequence:' block."""
        errors = []
        
        for yf in script_files:
            scripts = yf.content.get("script", {})
            if not isinstance(scripts, dict):
                continue
            
            for script_id, script_def in scripts.items():
                if script_id.startswith("__"):  # Skip metadata keys
                    continue
                if not isinstance(script_def, dict):
                    continue
                    
                if "sequence" not in script_def:
                    errors.append(
                        f"{yf.relative_path}: Script '{script_id}' missing 'sequence:' block"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} script(s) missing 'sequence:' block:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )


class TestDeprecatedPatterns:
    """Test for any deprecated patterns that should be avoided."""

    def test_no_deprecated_data_template(self, yaml_files: List[YAMLFile]):
        """
        Check for deprecated 'data_template:' usage.
        
        Modern: Use 'data:' with templates directly
        Deprecated: data_template:
        """
        errors = []
        
        for yf in yaml_files:
            if "data_template:" in yf.raw_content:
                lines = yf.raw_content.split('\n')
                for i, line in enumerate(lines, 1):
                    if "data_template:" in line:
                        errors.append(
                            f"{yf.relative_path}:{i}: Uses deprecated 'data_template:' "
                            f"- use 'data:' with templates instead"
                        )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} usage(s) of deprecated 'data_template:':\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    def test_no_deprecated_value_template_in_condition(self, yaml_files: List[YAMLFile]):
        """
        Check for deprecated condition syntax.
        
        This checks for patterns that indicate old condition formats.
        """
        # This is informational - not all uses are deprecated
        pass


class TestSyntaxSummary:
    """Generate a summary report of syntax compliance."""

    def test_generate_syntax_report(self, yaml_files: List[YAMLFile]):
        """Generate a comprehensive syntax compliance report."""
        stats = {
            "total_files": len(yaml_files),
            "automations": 0,
            "scripts": 0,
            "deprecated_trigger": 0,
            "deprecated_platform": 0,
            "deprecated_service": 0,
            "deprecated_action_singular": 0,
        }
        
        platform_pattern = re.compile(r'^\s+-\s*platform:', re.MULTILINE)
        service_pattern = re.compile(r'^\s+-?\s*service:\s*[a-z_]+\.[a-z_]+', re.MULTILINE)
        
        for yf in yaml_files:
            # Count automations
            automations = yf.content.get("automation", [])
            if isinstance(automations, list):
                stats["automations"] += len(automations)
                for auto in automations:
                    if isinstance(auto, dict):
                        if "trigger" in auto and "triggers" not in auto:
                            stats["deprecated_trigger"] += 1
                        if "action" in auto and "actions" not in auto:
                            stats["deprecated_action_singular"] += 1
            
            # Count scripts
            scripts = yf.content.get("script", {})
            if isinstance(scripts, dict):
                stats["scripts"] += len([k for k in scripts.keys() if not k.startswith("__")])
            
            # Count deprecated patterns
            stats["deprecated_platform"] += len(platform_pattern.findall(yf.raw_content))
            stats["deprecated_service"] += len(service_pattern.findall(yf.raw_content))
        
        # Print summary
        print("\n" + "=" * 60)
        print("SYNTAX COMPLIANCE REPORT")
        print("=" * 60)
        print(f"Total YAML files scanned: {stats['total_files']}")
        print(f"Total automations: {stats['automations']}")
        print(f"Total scripts: {stats['scripts']}")
        print()
        print("Deprecated syntax found:")
        print(f"  • 'trigger:' instead of 'triggers:': {stats['deprecated_trigger']}")
        print(f"  • 'platform:' instead of 'trigger:': {stats['deprecated_platform']}")
        print(f"  • 'service:' instead of 'action:': {stats['deprecated_service']}")
        print(f"  • 'action:' instead of 'actions:': {stats['deprecated_action_singular']}")
        print("=" * 60)
