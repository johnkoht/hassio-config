"""
Test Jinja2 template validation.

Validates that all Jinja2 templates:
- Have valid syntax
- Have balanced braces
- Use proper filters
"""
import re
import pytest
from typing import List, Set, Dict, Tuple

try:
    from jinja2 import Environment, TemplateSyntaxError, UndefinedError
    from jinja2.sandbox import SandboxedEnvironment
    JINJA2_AVAILABLE = True
except ImportError:
    JINJA2_AVAILABLE = False

from conftest import (
    YAMLFile,
    yaml_files,
)


# Common Home Assistant Jinja2 filters/functions
HA_JINJA_GLOBALS = {
    # State functions
    "states": lambda x=None: "on",
    "is_state": lambda e, s: True,
    "is_state_attr": lambda e, a, v: True,
    "state_attr": lambda e, a: "value",
    "has_value": lambda e: True,
    
    # Time functions
    "now": lambda: None,
    "utcnow": lambda: None,
    "today_at": lambda t=None: None,
    "as_timestamp": lambda x: 0,
    "as_datetime": lambda x: None,
    "as_local": lambda x: None,
    "as_timedelta": lambda x: None,
    "strptime": lambda s, f: None,
    "relative_time": lambda t: "1 minute ago",
    "timedelta": lambda **kwargs: None,
    
    # Math functions
    "float": float,
    "int": int,
    "round": round,
    "min": min,
    "max": max,
    "log": lambda x, b=None: 0,
    "sin": lambda x: 0,
    "cos": lambda x: 0,
    "tan": lambda x: 0,
    "sqrt": lambda x: 0,
    "e": 2.718,
    "pi": 3.14159,
    
    # String functions
    "slugify": lambda x: x,
    "urlencode": lambda x: x,
    
    # List/dict functions
    "expand": lambda x: [],
    "device_entities": lambda x: [],
    "device_attr": lambda d, a: "value",
    "area_id": lambda x: "area",
    "area_name": lambda x: "Area Name",
    "area_entities": lambda x: [],
    "area_devices": lambda x: [],
    "integration_entities": lambda x: [],
    
    # Other HA functions
    "iif": lambda c, t, f=None: t if c else f,
    "distance": lambda *args: 0,
    "closest": lambda *args: None,
}


class TestJinja2Syntax:
    """Test suite for Jinja2 template syntax validation."""

    def test_templates_have_balanced_braces(self, yaml_files: List[YAMLFile]):
        """Verify all templates have balanced {{ }} braces."""
        errors = []
        
        for yf in yaml_files:
            content = yf.raw_content
            
            # Count braces
            open_count = content.count("{{")
            close_count = content.count("}}")
            
            if open_count != close_count:
                errors.append(
                    f"{yf.relative_path}: Unbalanced braces - "
                    f"found {open_count} '{{{{' and {close_count} '}}}}'"
                )
            
            # Also check for statement braces
            stmt_open = content.count("{%")
            stmt_close = content.count("%}")
            
            if stmt_open != stmt_close:
                errors.append(
                    f"{yf.relative_path}: Unbalanced statement braces - "
                    f"found {stmt_open} '{{%' and {stmt_close} '%}}'"
                )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} file(s) with unbalanced braces:\n" +
                "\n".join(f"  • {e}" for e in errors[:20])
            )

    @pytest.mark.skipif(not JINJA2_AVAILABLE, reason="Jinja2 not installed")
    def test_templates_parse_successfully(self, yaml_files: List[YAMLFile]):
        """Verify all Jinja2 templates can be parsed."""
        errors = []
        
        # Create a sandboxed environment with HA functions
        env = SandboxedEnvironment()
        env.globals.update(HA_JINJA_GLOBALS)
        
        # Pattern to find templates
        template_pattern = re.compile(r'\{\{(.+?)\}\}', re.DOTALL)
        statement_pattern = re.compile(r'\{%(.+?)%\}', re.DOTALL)
        
        for yf in yaml_files:
            # Find all templates in the file
            templates = template_pattern.findall(yf.raw_content)
            statements = statement_pattern.findall(yf.raw_content)
            
            for tmpl in templates + statements:
                # Wrap in proper template syntax for parsing
                try:
                    if tmpl.strip():
                        env.parse("{{ " + tmpl + " }}")
                except TemplateSyntaxError as e:
                    # Find line number
                    line_num = self._find_template_line(yf.raw_content, tmpl)
                    errors.append(
                        f"{yf.relative_path}:{line_num}: Template syntax error: {e.message}"
                    )
        
        if errors:
            pytest.fail(
                f"Found {len(errors)} Jinja2 syntax error(s):\n" +
                "\n".join(f"  • {e}" for e in errors[:30])
            )

    def _find_template_line(self, content: str, template: str) -> int:
        """Find the line number where a template appears."""
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            if template[:20] in line:  # Check first 20 chars
                return i
        return 0


class TestTemplatePatterns:
    """Test for common template issues and patterns."""

    def test_no_deprecated_template_syntax(self, yaml_files: List[YAMLFile]):
        """Check for deprecated template patterns."""
        deprecated_patterns = [
            # states.entity_id.state is deprecated
            (r'states\.[a-z_]+\.[a-z0-9_]+\.state\b', 
             "Use states('entity.id') instead of states.entity.id.state"),
        ]
        
        warnings = []
        
        for yf in yaml_files:
            for pattern, message in deprecated_patterns:
                matches = re.findall(pattern, yf.raw_content, re.IGNORECASE)
                if matches:
                    warnings.append(f"{yf.relative_path}: {message}")
        
        if warnings:
            print(f"\nℹ️  Found {len(warnings)} deprecated template pattern(s):")
            for w in warnings[:10]:
                print(f"    • {w}")

    def test_template_filters_are_valid(self, yaml_files: List[YAMLFile]):
        """Check that common filters are used correctly."""
        # Common filter patterns and their expected usage
        filter_checks = [
            # float filter should have default
            (r'\|\s*float\s*(?!\()', 
             "Consider using float(default=0) for safety"),
            # int filter should have default  
            (r'\|\s*int\s*(?!\()',
             "Consider using int(default=0) for safety"),
        ]
        
        warnings = []
        
        for yf in yaml_files:
            for pattern, message in filter_checks:
                if re.search(pattern, yf.raw_content):
                    warnings.append(f"{yf.relative_path}: {message}")
        
        # This is informational only
        if warnings:
            print(f"\nℹ️  Template filter suggestions:")
            for w in set(warnings)[:5]:
                print(f"    • {w}")

    def test_no_undefined_variables_in_common_patterns(self, yaml_files: List[YAMLFile]):
        """Check for potentially undefined variables in templates."""
        # Common patterns that might indicate undefined variables
        undefined_patterns = [
            # trigger.xxx outside of automation context
            (r'trigger\.[a-z_]+', ['automation']),
            # this.xxx outside of template sensor
            (r'this\.[a-z_]+', ['template']),
        ]
        
        warnings = []
        
        for yf in yaml_files:
            content = yf.content
            
            for pattern, required_contexts in undefined_patterns:
                if re.search(pattern, yf.raw_content):
                    # Check if proper context exists
                    has_context = any(ctx in content for ctx in required_contexts)
                    if not has_context:
                        match = re.search(pattern, yf.raw_content)
                        if match:
                            warnings.append(
                                f"{yf.relative_path}: Uses '{match.group()}' but "
                                f"no {'/'.join(required_contexts)} context found"
                            )
        
        # Just informational - might have false positives
        if warnings:
            print(f"\nℹ️  Potential undefined variable usage:")
            for w in warnings[:5]:
                print(f"    • {w}")


class TestTemplateComplexity:
    """Test for overly complex templates."""

    def test_template_line_length(self, yaml_files: List[YAMLFile]):
        """Check for very long template lines that might be hard to read."""
        long_templates = []
        
        for yf in yaml_files:
            lines = yf.raw_content.split('\n')
            for i, line in enumerate(lines, 1):
                # Check for long template expressions
                if '{{' in line and '}}' in line:
                    # Extract template portion
                    template_match = re.search(r'\{\{.+?\}\}', line)
                    if template_match and len(template_match.group()) > 200:
                        long_templates.append(
                            f"{yf.relative_path}:{i}: Template expression is "
                            f"{len(template_match.group())} chars - consider using multiline"
                        )
        
        if long_templates:
            print(f"\nℹ️  Found {len(long_templates)} very long template(s):")
            for t in long_templates[:5]:
                print(f"    • {t}")

    def test_nested_template_depth(self, yaml_files: List[YAMLFile]):
        """Check for deeply nested template expressions."""
        deep_nesting = []
        
        for yf in yaml_files:
            # Find templates
            templates = re.findall(r'\{\{(.+?)\}\}', yf.raw_content, re.DOTALL)
            
            for tmpl in templates:
                # Count nesting level by parentheses
                max_depth = 0
                current_depth = 0
                for char in tmpl:
                    if char == '(':
                        current_depth += 1
                        max_depth = max(max_depth, current_depth)
                    elif char == ')':
                        current_depth -= 1
                
                if max_depth > 5:
                    deep_nesting.append(
                        f"{yf.relative_path}: Template with nesting depth {max_depth}"
                    )
        
        if deep_nesting:
            print(f"\nℹ️  Found {len(deep_nesting)} deeply nested template(s):")
            for t in set(deep_nesting)[:5]:
                print(f"    • {t}")
