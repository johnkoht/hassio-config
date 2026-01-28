#!/usr/bin/env python3
"""
Home Assistant Configuration Test Suite Runner

Usage:
    ./run_tests.py                         # Run all tests
    ./run_tests.py --quick                 # Run quick tests only (skip entity validation)
    ./run_tests.py --syntax                # Run syntax tests only
    ./run_tests.py --entities              # Run entity validation only
    ./run_tests.py --modern                # Run modern syntax checks only
    ./run_tests.py --report                # Generate reports only
    ./run_tests.py -k "test_name"          # Run specific test
    ./run_tests.py -v                      # Verbose output
    ./run_tests.py --help                  # Show help
    
Alternatively, use the shell wrapper:
    /root/config/tests/run.sh              # Run all tests
    /root/config/tests/run.sh --quick      # Run quick tests
"""
import sys
import os
import argparse
from pathlib import Path

# Add tests directory to path
TESTS_DIR = Path(__file__).parent
sys.path.insert(0, str(TESTS_DIR))


def main():
    parser = argparse.ArgumentParser(
        description="Home Assistant Configuration Test Suite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                     Run all tests
  %(prog)s --quick             Run quick tests (skip slow entity validation)
  %(prog)s --syntax            Run only syntax validation tests
  %(prog)s --entities          Run only entity reference tests
  %(prog)s --schema            Run only schema validation tests
  %(prog)s --naming            Run only naming convention tests
  %(prog)s --duplicates        Run only duplicate detection tests
  %(prog)s --report            Generate summary reports
  %(prog)s -k test_yaml        Run tests matching 'test_yaml'
  %(prog)s -v                  Verbose output
  %(prog)s --tb=short          Short tracebacks
  %(prog)s -x                  Stop on first failure
        """
    )
    
    # Test selection options
    test_group = parser.add_argument_group("Test Selection")
    test_group.add_argument(
        "--quick", "-q",
        action="store_true",
        help="Run quick tests only (skip slow entity validation)"
    )
    test_group.add_argument(
        "--syntax",
        action="store_true",
        help="Run only syntax validation tests"
    )
    test_group.add_argument(
        "--entities",
        action="store_true",
        help="Run only entity reference validation tests"
    )
    test_group.add_argument(
        "--schema",
        action="store_true",
        help="Run only schema validation tests"
    )
    test_group.add_argument(
        "--naming",
        action="store_true",
        help="Run only naming convention tests"
    )
    test_group.add_argument(
        "--duplicates",
        action="store_true",
        help="Run only duplicate detection tests"
    )
    test_group.add_argument(
        "--templates",
        action="store_true",
        help="Run only template validation tests"
    )
    test_group.add_argument(
        "--modern",
        action="store_true",
        help="Run only modern syntax compliance tests"
    )
    test_group.add_argument(
        "--report",
        action="store_true",
        help="Generate summary reports only"
    )
    
    # Pytest passthrough options
    pytest_group = parser.add_argument_group("Pytest Options")
    pytest_group.add_argument(
        "-k",
        dest="keyword",
        help="Only run tests matching the given keyword expression"
    )
    pytest_group.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Increase verbosity"
    )
    pytest_group.add_argument(
        "-x", "--exitfirst",
        action="store_true",
        help="Exit on first failure"
    )
    pytest_group.add_argument(
        "--tb",
        choices=["auto", "long", "short", "line", "native", "no"],
        default="short",
        help="Traceback print mode (default: short)"
    )
    pytest_group.add_argument(
        "-n",
        dest="workers",
        type=int,
        help="Number of parallel workers (requires pytest-xdist)"
    )
    
    # Output options
    output_group = parser.add_argument_group("Output Options")
    output_group.add_argument(
        "--no-color",
        action="store_true",
        help="Disable colored output"
    )
    output_group.add_argument(
        "--json",
        action="store_true",
        help="Output results as JSON"
    )
    
    args = parser.parse_args()
    
    # Build pytest arguments
    pytest_args = [str(TESTS_DIR)]
    
    # Handle test selection
    if args.syntax:
        pytest_args.extend(["-k", "yaml_syntax or YAMLSyntax"])
    elif args.entities:
        pytest_args.extend(["-k", "entity or Entity"])
    elif args.schema:
        pytest_args.extend(["-k", "schema or Schema"])
    elif args.naming:
        pytest_args.extend(["-k", "naming or Naming"])
    elif args.duplicates:
        pytest_args.extend(["-k", "duplicate or Duplicate"])
    elif args.templates:
        pytest_args.extend(["-k", "template or Template or jinja"])
    elif args.modern:
        pytest_args.extend(["-k", "modern or Modern or deprecated"])
    elif args.report:
        pytest_args.extend(["-k", "report or summary"])
    elif args.quick:
        pytest_args.extend(["-m", "not entity_validation", "-m", "not slow"])
    
    # Handle keyword filter
    if args.keyword:
        pytest_args.extend(["-k", args.keyword])
    
    # Handle verbosity
    if args.verbose:
        pytest_args.append("-v")
    
    # Handle exit on first failure
    if args.exitfirst:
        pytest_args.append("-x")
    
    # Handle traceback mode
    pytest_args.extend(["--tb", args.tb])
    
    # Handle parallel workers
    if args.workers:
        pytest_args.extend(["-n", str(args.workers)])
    
    # Handle color
    if args.no_color:
        pytest_args.append("--color=no")
    else:
        pytest_args.append("--color=yes")
    
    # Print header
    print("=" * 60)
    print("HOME ASSISTANT CONFIGURATION TEST SUITE")
    print("=" * 60)
    print()
    
    # Check for pytest
    try:
        import pytest
    except ImportError:
        print("ERROR: pytest not installed!")
        print("Install with: pip install -r tests/requirements.txt")
        return 1
    
    # Run pytest
    return pytest.main(pytest_args)


def quick_check():
    """
    Run a quick syntax check without pytest.
    Useful for rapid feedback during development.
    """
    import yaml
    from pathlib import Path
    
    config_root = Path("/root/config")
    packages_dir = config_root / "packages"
    
    print("Quick YAML Syntax Check")
    print("-" * 40)
    
    errors = []
    file_count = 0
    
    for yaml_file in packages_dir.rglob("*.yaml"):
        file_count += 1
        try:
            content = yaml_file.read_text(encoding="utf-8")
            yaml.safe_load(content)
        except yaml.YAMLError as e:
            rel_path = yaml_file.relative_to(config_root)
            errors.append(f"{rel_path}: {e}")
        except Exception as e:
            rel_path = yaml_file.relative_to(config_root)
            errors.append(f"{rel_path}: {e}")
    
    print(f"Checked {file_count} files")
    
    if errors:
        print(f"\nFound {len(errors)} error(s):")
        for error in errors[:20]:
            print(f"  ❌ {error}")
        return 1
    else:
        print("✅ All files passed syntax check!")
        return 0


if __name__ == "__main__":
    # Check if quick mode requested via environment
    if os.environ.get("HA_TEST_QUICK"):
        sys.exit(quick_check())
    else:
        sys.exit(main())
