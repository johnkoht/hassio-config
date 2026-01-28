#!/bin/bash
#
# Home Assistant Configuration Test Suite Runner
#
# Usage:
#   ./run.sh                    # Run all tests
#   ./run.sh --quick            # Run quick tests (skip slow entity validation)
#   ./run.sh --syntax           # Run syntax tests only
#   ./run.sh --entities         # Run entity validation only
#   ./run.sh --modern           # Run modern syntax compliance tests
#   ./run.sh --schema           # Run schema validation tests
#   ./run.sh --naming           # Run naming convention tests
#   ./run.sh --duplicates       # Run duplicate detection tests
#   ./run.sh --report           # Generate summary reports
#   ./run.sh -k "pattern"       # Run tests matching pattern
#   ./run.sh -v                 # Verbose output
#   ./run.sh --help             # Show help
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    source "$VENV_DIR/bin/activate"
    pip install -q pytest pyyaml ruamel.yaml jinja2
else
    source "$VENV_DIR/bin/activate"
fi

# Run the test suite
python "$SCRIPT_DIR/run_tests.py" "$@"
exit_code=$?

deactivate 2>/dev/null
exit $exit_code
