"""
Guard: ESPHome device configs must not hold inline secrets (JK-1239).

The repo is public. Every `key:` / `password:` value under esphome/ must be
`!secret <name>`, and each referenced name must have a placeholder in
esphome/secrets.fake.yaml. Real values live in the gitignored esphome/secrets.yaml.
"""
import re
from pathlib import Path

import pytest

ESPHOME = Path(__file__).resolve().parent.parent / "esphome"
SKIP = {"secrets.yaml", "secrets.fake.yaml"}
CONFIGS = sorted(p for p in ESPHOME.rglob("*.yaml") if p.name not in SKIP)

CRED = re.compile(r"^\s*-?\s*(key|password|encryption_key|ap_password)\s*:\s*(.*?)\s*(#.*)?$")
B64_32 = re.compile(r"""["']?[A-Za-z0-9+/]{43}=["']?""")


def _rel(p):
    return str(p.relative_to(ESPHOME))


def test_configs_found():
    assert CONFIGS, "no esphome configs found; glob is wrong"


@pytest.mark.parametrize("path", CONFIGS, ids=_rel)
def test_no_inline_credentials(path):
    bad = []
    for n, line in enumerate(path.read_text().splitlines(), 1):
        m = CRED.match(line)
        if m and m.group(2) and not m.group(2).startswith("!secret "):
            bad.append(f"{_rel(path)}:{n} inline {m.group(1)}")
        elif B64_32.search(line) and "!secret" not in line:
            bad.append(f"{_rel(path)}:{n} base64 32-byte value")
    assert not bad, "inline secrets (use !secret): " + "; ".join(bad)


def test_every_referenced_secret_has_a_placeholder():
    fake = (ESPHOME / "secrets.fake.yaml").read_text()
    declared = set(re.findall(r"^([A-Za-z0-9_]+)\s*:", fake, re.M))
    used = set()
    for p in CONFIGS:
        used |= set(re.findall(r"!secret\s+([A-Za-z0-9_]+)", p.read_text()))
    missing = sorted(used - declared)
    assert not missing, f"add to esphome/secrets.fake.yaml: {missing}"


def test_guard_catches_a_literal():
    assert CRED.match('    key: "abc"')
    assert CRED.match("    password: hunter2")
    assert CRED.match("    key: !secret x").group(2).startswith("!secret ")
