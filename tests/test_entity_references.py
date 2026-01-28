"""
Test entity reference validation.

Validates that all entity IDs referenced in YAML files:
- Exist in the Home Assistant entity registry
- Are spelled correctly (catches typos like 'house_ocupied')
- Follow expected domain patterns
"""
import re
import pytest
from pathlib import Path
from typing import List, Set, Dict, Tuple, Optional
from difflib import get_close_matches

from conftest import (
    YAMLFile,
    yaml_files,
    EntityRegistry,
    entity_registry,
    ValidationResult,
    CONFIG_ROOT,
    extract_entity_references,
    ENTITY_DOMAINS,
)


# Entity ID regex pattern
ENTITY_ID_REGEX = re.compile(
    r'\b(' + '|'.join(ENTITY_DOMAINS) + r')\.([a-z0-9_]+)\b',
    re.IGNORECASE
)

# Entities that are dynamically created or don't appear in registry
KNOWN_DYNAMIC_ENTITIES = {
    # Sun entity is always available
    "sun.sun",
    # These are created by automations/scripts and may not be in registry
    "automation.current_automation",
    "script.current_script",
}

# Patterns that look like entity IDs but aren't
FALSE_POSITIVE_PATTERNS = [
    r'trigger\.\w+',      # Trigger variables
    r'context\.\w+',      # Context variables  
    r'state_attr\.\w+',   # Not an entity
    r'this\.\w+',         # this reference
]


class TestEntityReferences:
    """Test suite for entity reference validation."""

    def test_all_entities_exist(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Verify all referenced entities exist in the HA registry."""
        if not entity_registry.entity_ids:
            pytest.skip("Entity registry not available or empty")
        
        missing_entities: Dict[str, List[str]] = {}  # entity_id -> list of files
        
        for yf in yaml_files:
            refs = extract_entity_references(yf.raw_content)
            
            for entity_id in refs:
                entity_id_lower = entity_id.lower()
                
                # Skip known dynamic entities
                if entity_id_lower in KNOWN_DYNAMIC_ENTITIES:
                    continue
                
                # Skip false positives
                if any(re.match(p, entity_id_lower) for p in FALSE_POSITIVE_PATTERNS):
                    continue
                
                # Check if entity exists
                if not entity_registry.exists(entity_id_lower):
                    if entity_id_lower not in missing_entities:
                        missing_entities[entity_id_lower] = []
                    missing_entities[entity_id_lower].append(yf.relative_path)
        
        if missing_entities:
            # Build detailed error message with suggestions
            errors = []
            for entity_id, files in sorted(missing_entities.items())[:30]:
                # Find similar entities for suggestions
                domain = entity_id.split('.')[0]
                similar = self._find_similar_entities(
                    entity_id, entity_registry, domain
                )
                
                file_list = ", ".join(files[:3])
                if len(files) > 3:
                    file_list += f" (+{len(files)-3} more)"
                
                error = f"'{entity_id}' referenced in: {file_list}"
                if similar:
                    error += f"\n      💡 Did you mean: {', '.join(similar[:3])}?"
                errors.append(error)
            
            pytest.fail(
                f"Found {len(missing_entities)} entity reference(s) not in registry:\n\n" +
                "\n".join(f"  • {e}" for e in errors)
            )

    def _find_similar_entities(
        self,
        entity_id: str,
        registry: EntityRegistry,
        domain: str = None
    ) -> List[str]:
        """Find similar entity IDs for typo suggestions."""
        # Get entities from the same domain
        if domain:
            candidates = [e for e in registry.entity_ids if e.startswith(f"{domain}.")]
        else:
            candidates = list(registry.entity_ids)
        
        # Use difflib to find close matches
        matches = get_close_matches(entity_id, candidates, n=5, cutoff=0.6)
        return matches

    def test_entity_domain_validity(self, yaml_files: List[YAMLFile]):
        """Verify all entity references use valid domains."""
        invalid_domains = []
        valid_domain_set = set(ENTITY_DOMAINS)
        
        for yf in yaml_files:
            # Find all potential entity references
            matches = ENTITY_ID_REGEX.findall(yf.raw_content)
            
            for domain, entity_name in matches:
                domain_lower = domain.lower()
                if domain_lower not in valid_domain_set:
                    invalid_domains.append(
                        f"{yf.relative_path}: Unknown domain '{domain}' in "
                        f"'{domain}.{entity_name}'"
                    )
        
        if invalid_domains:
            pytest.fail(
                f"Found {len(invalid_domains)} entity reference(s) with invalid domains:\n" +
                "\n".join(f"  • {e}" for e in invalid_domains[:20])
            )

    def test_no_typos_in_common_entities(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """
        Check for common typos in frequently used entities.
        
        This test specifically looks for patterns that suggest typos.
        """
        if not entity_registry.entity_ids:
            pytest.skip("Entity registry not available")
        
        typo_candidates = []
        
        for yf in yaml_files:
            refs = extract_entity_references(yf.raw_content)
            
            for entity_id in refs:
                entity_id_lower = entity_id.lower()
                
                # Skip if it exists
                if entity_registry.exists(entity_id_lower):
                    continue
                
                # Skip known dynamic entities
                if entity_id_lower in KNOWN_DYNAMIC_ENTITIES:
                    continue
                
                # Check if there's a very similar entity (likely typo)
                domain = entity_id_lower.split('.')[0]
                similar = get_close_matches(
                    entity_id_lower,
                    [e for e in entity_registry.entity_ids if e.startswith(f"{domain}.")],
                    n=1,
                    cutoff=0.85  # High threshold = likely typo
                )
                
                if similar:
                    typo_candidates.append({
                        "file": yf.relative_path,
                        "typo": entity_id_lower,
                        "suggestion": similar[0],
                    })
        
        if typo_candidates:
            errors = []
            for t in typo_candidates[:20]:
                errors.append(
                    f"{t['file']}: '{t['typo']}' -> did you mean '{t['suggestion']}'?"
                )
            
            pytest.fail(
                f"Found {len(typo_candidates)} likely typo(s) in entity references:\n\n" +
                "\n".join(f"  • {e}" for e in errors)
            )


class TestEntityReferencesByDomain:
    """Domain-specific entity reference tests."""

    def test_input_boolean_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Validate all input_boolean references."""
        self._test_domain_references(
            yaml_files, entity_registry, "input_boolean"
        )

    def test_input_select_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Validate all input_select references."""
        self._test_domain_references(
            yaml_files, entity_registry, "input_select"
        )

    def test_script_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Validate all script references."""
        self._test_domain_references(
            yaml_files, entity_registry, "script"
        )

    def test_automation_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Validate all automation references."""
        self._test_domain_references(
            yaml_files, entity_registry, "automation"
        )

    def test_group_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Validate all group references."""
        self._test_domain_references(
            yaml_files, entity_registry, "group"
        )

    def _test_domain_references(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry,
        domain: str
    ):
        """Generic domain reference test."""
        if not entity_registry.entity_ids:
            pytest.skip("Entity registry not available")
        
        pattern = re.compile(rf'\b{domain}\.([a-z0-9_]+)\b', re.IGNORECASE)
        missing = []
        
        for yf in yaml_files:
            matches = pattern.findall(yf.raw_content)
            for entity_name in matches:
                entity_id = f"{domain}.{entity_name}".lower()
                
                if entity_id in KNOWN_DYNAMIC_ENTITIES:
                    continue
                
                if not entity_registry.exists(entity_id):
                    # Find suggestions
                    similar = get_close_matches(
                        entity_id,
                        [e for e in entity_registry.entity_ids if e.startswith(f"{domain}.")],
                        n=2,
                        cutoff=0.6
                    )
                    
                    error = f"{yf.relative_path}: {entity_id}"
                    if similar:
                        error += f" (similar: {', '.join(similar)})"
                    missing.append(error)
        
        if missing:
            # Deduplicate
            missing = list(set(missing))[:20]
            pytest.fail(
                f"Found {len(missing)} missing {domain} reference(s):\n" +
                "\n".join(f"  • {e}" for e in missing)
            )


class TestEntityUsagePatterns:
    """Test for entity usage patterns and potential issues."""

    def test_no_hardcoded_device_ids(self, yaml_files: List[YAMLFile]):
        """
        Check for hardcoded device IDs that might break.
        
        Device IDs are UUIDs that can change - prefer entity_id or area_id.
        """
        warnings = []
        
        # Pattern for device IDs (UUID-like strings in device_id context)
        device_id_pattern = re.compile(
            r'device_id:\s*["\']?([a-f0-9]{32}|[a-f0-9-]{36})["\']?',
            re.IGNORECASE
        )
        
        for yf in yaml_files:
            matches = device_id_pattern.findall(yf.raw_content)
            if matches:
                warnings.append(
                    f"{yf.relative_path}: Contains {len(matches)} hardcoded device_id(s) - "
                    f"consider using entity_id instead"
                )
        
        if warnings:
            print(f"\n⚠️  Found {len(warnings)} file(s) with hardcoded device IDs:")
            for w in warnings[:10]:
                print(f"    • {w}")

    def test_entity_references_in_templates(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """
        Validate entity references within Jinja2 templates.
        
        Looks for patterns like:
        - states('entity.id')
        - is_state('entity.id', 'on')
        - state_attr('entity.id', 'attr')
        """
        if not entity_registry.entity_ids:
            pytest.skip("Entity registry not available")
        
        # Patterns for entity references in templates
        template_patterns = [
            re.compile(r"states\(['\"](" + '|'.join(ENTITY_DOMAINS) + r")\.([a-z0-9_]+)['\"]\)", re.I),
            re.compile(r"is_state\(['\"](" + '|'.join(ENTITY_DOMAINS) + r")\.([a-z0-9_]+)['\"]", re.I),
            re.compile(r"state_attr\(['\"](" + '|'.join(ENTITY_DOMAINS) + r")\.([a-z0-9_]+)['\"]", re.I),
            re.compile(r"states\.(" + '|'.join(ENTITY_DOMAINS) + r")\.([a-z0-9_]+)", re.I),
        ]
        
        missing = []
        
        for yf in yaml_files:
            for pattern in template_patterns:
                for match in pattern.finditer(yf.raw_content):
                    domain = match.group(1).lower()
                    name = match.group(2).lower()
                    entity_id = f"{domain}.{name}"
                    
                    if entity_id in KNOWN_DYNAMIC_ENTITIES:
                        continue
                    
                    if not entity_registry.exists(entity_id):
                        # Calculate line number
                        line_num = yf.raw_content[:match.start()].count('\n') + 1
                        missing.append(f"{yf.relative_path}:{line_num}: {entity_id}")
        
        if missing:
            # Deduplicate and limit
            missing = sorted(set(missing))[:30]
            pytest.fail(
                f"Found {len(missing)} missing entity reference(s) in templates:\n" +
                "\n".join(f"  • {e}" for e in missing)
            )


class TestEntityReport:
    """Generate entity reference reports."""

    def test_generate_entity_report(
        self,
        yaml_files: List[YAMLFile],
        entity_registry: EntityRegistry
    ):
        """Generate a summary report of entity references."""
        if not entity_registry.entity_ids:
            print("\n⚠️  Entity registry not available - skipping report")
            return
        
        all_refs: Dict[str, Set[str]] = {}  # entity_id -> set of files
        missing_refs: Dict[str, Set[str]] = {}
        
        for yf in yaml_files:
            refs = extract_entity_references(yf.raw_content)
            for entity_id in refs:
                entity_id_lower = entity_id.lower()
                
                if entity_id_lower not in all_refs:
                    all_refs[entity_id_lower] = set()
                all_refs[entity_id_lower].add(yf.relative_path)
                
                if not entity_registry.exists(entity_id_lower):
                    if entity_id_lower not in KNOWN_DYNAMIC_ENTITIES:
                        if entity_id_lower not in missing_refs:
                            missing_refs[entity_id_lower] = set()
                        missing_refs[entity_id_lower].add(yf.relative_path)
        
        # Count by domain
        domain_counts = {}
        for entity_id in all_refs:
            domain = entity_id.split('.')[0]
            domain_counts[domain] = domain_counts.get(domain, 0) + 1
        
        print("\n" + "=" * 60)
        print("ENTITY REFERENCE REPORT")
        print("=" * 60)
        print(f"Total unique entities referenced: {len(all_refs)}")
        print(f"Total entities in registry: {len(entity_registry.entity_ids)}")
        print(f"Missing entity references: {len(missing_refs)}")
        print()
        print("References by domain:")
        for domain in sorted(domain_counts, key=domain_counts.get, reverse=True)[:15]:
            print(f"  • {domain}: {domain_counts[domain]}")
        print("=" * 60)
