"""
Notification deep links (plans/notification-deep-links).

Builds a map of the Kohbo dashboard (view path -> popup hashes) from the YAML,
finds every phone push in the repo, and checks that each link it carries opens
something that exists. A push with no link must be on the exempt list
(tests/fixtures/notification_url_exempt.yaml), with a reason.

Run `python tests/test_notification_deep_links.py` for the full audit table.
"""
import ast
import re
import sys
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
DASH_ROOT = REPO / "dashboards" / "kohbo" / "kohbo.yaml"
BASE = "/dashboard-kohbo/"

_TAGS = ("!secret", "!input", "!env_var")


# ---------------------------------------------------------------------------
# Plain loader for automations and scripts (includes ignored)
# ---------------------------------------------------------------------------
class _Plain(yaml.SafeLoader):
    pass


for _t in _TAGS + ("!include", "!include_dir_named", "!include_dir_list",
                   "!include_dir_merge_list", "!include_dir_merge_named"):
    _Plain.add_constructor(_t, lambda loader, node: None)


def load_plain(path):
    return yaml.load(Path(path).read_text(), Loader=_Plain)


# ---------------------------------------------------------------------------
# Dashboard loader: follows !include, /config/ maps to the repo root
# ---------------------------------------------------------------------------
def _resolve(raw, base):
    raw = raw.strip()
    if raw.startswith("/config/"):
        return REPO / raw[len("/config/"):]
    return (base / raw).resolve()


def _make_dash_loader(base_dir):
    class _Dash(yaml.SafeLoader):
        pass

    def include(loader, node):
        return load_dash(_resolve(loader.construct_scalar(node), base_dir))

    def include_dir(merge_kind):
        def ctor(loader, node):
            d = _resolve(loader.construct_scalar(node), base_dir)
            out = {} if merge_kind == "dict" else []
            for f in sorted(d.rglob("*.yaml")) if d.is_dir() else []:
                data = load_dash(f)
                if merge_kind == "dict" and isinstance(data, dict):
                    out.update(data)
                elif isinstance(data, list):
                    out.extend(data)
                elif data is not None:
                    out.append(data)
            return out
        return ctor

    _Dash.add_constructor("!include", include)
    _Dash.add_constructor("!include_dir_named", include_dir("dict"))
    _Dash.add_constructor("!include_dir_merge_named", include_dir("dict"))
    _Dash.add_constructor("!include_dir_list", include_dir("list"))
    _Dash.add_constructor("!include_dir_merge_list", include_dir("list"))
    for t in _TAGS:
        _Dash.add_constructor(t, lambda loader, node: None)
    return _Dash


_dash_cache = {}


def load_dash(path):
    path = Path(path)
    if path not in _dash_cache:
        if not path.exists():
            raise FileNotFoundError(f"dashboard include missing: {path}")
        _dash_cache[path] = None  # break include cycles
        _dash_cache[path] = yaml.load(path.read_text(), Loader=_make_dash_loader(path.parent))
    return _dash_cache[path]


def _collect_hashes(node, out):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ("hash", "popup_hash") and isinstance(v, str) and v.startswith("#"):
                out.add(v[1:])
            _collect_hashes(v, out)
    elif isinstance(node, list):
        for v in node:
            _collect_hashes(v, out)


def dashboard_map():
    """{view path: {popup hashes defined in that view's include tree}}"""
    root = load_dash(DASH_ROOT)
    views = {}
    for view in root["views"]:
        if isinstance(view, dict) and view.get("path"):
            hashes = set()
            _collect_hashes(view, hashes)
            views[view["path"]] = hashes
    return views


def link_problem(url, views):
    """None if the link opens an existing view (and popup); else why not."""
    if not url.startswith(BASE):
        return f"does not start with {BASE}"
    path, _, frag = url[len(BASE):].partition("#")
    if path not in views:
        return f"view '{path}' is not in kohbo.yaml"
    if frag and frag not in views[path]:
        return f"popup '#{frag}' is not included in view '{path}'"
    return None


# ---------------------------------------------------------------------------
# Finding phone pushes
# ---------------------------------------------------------------------------
_DIRECT = re.compile(r"notify\.(ios_family|mobile_app_\w+)")
_SCAN_DIRS = ("packages", "automation", "scripts")
_SCAN_FILES = ("automations.yaml", "scripts.yaml")
TRANSPORT = REPO / "packages" / "general_notifications.yaml"


def _urls(node):
    """Every literal or templated value of a `url`/`clickAction` key under node."""
    found = []
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ("url", "clickAction") and isinstance(v, str):
                found.append(v)
            else:
                found.extend(_urls(v))
    elif isinstance(node, list):
        for v in node:
            found.extend(_urls(v))
    return found


def _walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from _walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from _walk(v)


def _kind(step):
    action = step.get("action") or step.get("service") or step.get("service_template")
    if not isinstance(action, str):
        return None
    if action.strip() == "script.general_notification":
        return "script"
    if _DIRECT.search(action):
        return "direct"
    if action.strip() == "script.turn_on" and "general_notification" in repr(step.get("target")):
        return "turn_on"
    return None


def push_calls():
    """[(relative file, kind, [urls])] for every phone push call site."""
    files = [p for d in _SCAN_DIRS for p in sorted((REPO / d).rglob("*.yaml"))]
    files += [REPO / f for f in _SCAN_FILES if (REPO / f).exists()]
    files = [f for f in files if f != TRANSPORT]  # the script's own notify templates are not callers
    calls = []
    for path in files:
        rel = str(path.relative_to(REPO))
        data = load_plain(path)
        for node in _walk(data):
            kind = _kind(node)
            if kind:
                calls.append((rel, kind, _urls(node)))
        # `alert:` notifiers send through a data: mapping on the alert itself
        if isinstance(data, dict) and isinstance(data.get("alert"), dict):
            for name, alert in data["alert"].items():
                if isinstance(alert, dict) and any(
                        _DIRECT.search(f"notify.{n}") for n in alert.get("notifiers", [])):
                    calls.append((f"{rel}::{name}", "alert", _urls(alert.get("data"))))
    return calls


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
VIEWS = dashboard_map()
CALLS = push_calls()
LINKED = [(f, k, u) for f, k, u in CALLS if u]
UNLINKED = [(f, k) for f, k, u in CALLS if not u]


def test_dashboard_map_reads_views_and_popups():
    """Guards the map builder itself: a loader that finds nothing would pass every link."""
    assert len(VIEWS) > 20
    assert "front_door_camera" in VIEWS["security-cameras"]
    assert "weather" in VIEWS["climate"]
    assert "zigbee_routers_popup" in VIEWS["sensors"]
    assert "front_door_lock_popup" in VIEWS["security-house-locks"]


def test_push_finder_sees_every_kind():
    kinds = {k for _, k, _ in CALLS}
    assert {"script", "direct", "alert"} <= kinds
    assert len(CALLS) > 80
    # service_template callers are real pushes (this one sends through a templated service name)
    assert any(f.endswith("upstairs_washer_complete_alert.yaml") for f, _, _ in CALLS)
    # the transport script's own notify templates are not callers
    assert not any(f.startswith("packages/general_notifications.yaml") for f, _, _ in CALLS)


@pytest.mark.parametrize("file,kind,urls", LINKED, ids=[f"{f}:{k}" for f, k, _ in LINKED])
def test_every_declared_link_opens_something(file, kind, urls):
    """A link to a missing view or a popup the view doesn't include opens the wrong screen."""
    for url in urls:
        if "{{" in url or "{%" in url:
            continue  # templated links are checked by expanding them, where they are added
        assert link_problem(url, VIEWS) is None, f"{file}: {url}: {link_problem(url, VIEWS)}"


def test_bad_links_are_caught():
    assert link_problem("/dashboard-kohbo/nope", VIEWS)
    assert link_problem("/dashboard-kohbo/security-cameras#nope", VIEWS)
    assert link_problem("/dashboard-kohbo/security#front_door_camera", VIEWS)  # popup is on another view
    assert link_problem("/lovelace/home", VIEWS)
    assert link_problem("/dashboard-kohbo/security-cameras#front_door_camera", VIEWS) is None


EXEMPT_FILE = REPO / "tests" / "fixtures" / "notification_url_exempt.yaml"


def load_exempt():
    return {e["path"]: e["reason"] for e in yaml.safe_load(EXEMPT_FILE.read_text())}


EXEMPT = load_exempt()


def test_exempt_entries_have_a_path_and_a_reason():
    entries = yaml.safe_load(EXEMPT_FILE.read_text())
    assert len(entries) == len(EXEMPT), "duplicate path in the exempt list"
    assert all(e.get("reason", "").strip() for e in entries)


def test_every_push_has_a_link_or_is_exempt():
    """A push nobody can tap through to the right screen needs a decision, written down."""
    missing = sorted({f for f, _ in UNLINKED if f not in EXEMPT})
    assert not missing, (
        "These pushes carry no url. Link them to a dashboard view, or add the file to "
        f"tests/fixtures/notification_url_exempt.yaml with a reason:\n  " + "\n  ".join(missing))


def test_exempt_entries_are_not_stale():
    by_file = {}
    for f, _, urls in CALLS:
        by_file.setdefault(f, []).append(bool(urls))
    stale = []
    for path in sorted(EXEMPT):
        flags = by_file.get(path)
        if flags is None:
            stale.append(f"{path}: sends no push any more, remove it from the exempt list")
        elif all(flags):
            stale.append(f"{path}: every push now carries a url, remove it from the exempt list")
    assert not stale, "\n".join(stale)


def test_lock_and_garage_pushes_open_their_popups():
    """Door and lock pushes land on the popup that has the controls, not just the view."""
    want = {
        "packages/foyer/front_door_lock/front_door_lock_stuck_alert.yaml":
            "/dashboard-kohbo/security-house-locks#front_door_lock_popup",
        "packages/security/security_unlock_front_door_by_fingerprint.yaml":
            "/dashboard-kohbo/security-house-locks#front_door_lock_popup",
        "packages/mudroom/garage_entry_door/garage_entry_door_evening_auto_lock.yaml":
            "/dashboard-kohbo/security-house-locks#garage_entry_lock_popup",
        "packages/garage/doors/door_2/garage_door_2_open_upon_arrival.yaml":
            "/dashboard-kohbo/security-garage-doors",
        "packages/garage/doors/door_3/garage_door_3_open_upon_arrival.yaml":
            "/dashboard-kohbo/security-garage-doors",
    }
    for file, url in want.items():
        urls = {u for f, _, us in CALLS if f == file for u in us}
        assert urls == {url}, f"{file}: {urls}"


def test_nino_escape_push_stays_removed():
    """John dropped the escape alert (decision 6); nothing may re-add a push under that package."""
    assert not (REPO / "packages" / "ninos_room" / "nino_escaping").exists()


# --- script.general_notification transport ---------------------------------
def _script():
    return load_plain(REPO / "packages" / "general_notifications.yaml")["script"]["general_notification"]


def _render(payload):
    """Run the script's variables and notify data the way HA renders them."""
    seq = _script()["sequence"]
    env = Environment(undefined=StrictUndefined)
    env.filters["combine"] = lambda a, *others: {**a, **{k: v for o in others for k, v in o.items()}}
    env.globals["now"] = lambda: type("N", (), {"timestamp": lambda self: 1.0})()

    def parse(text):
        text = text.strip()
        try:
            return ast.literal_eval(text)
        except (ValueError, SyntaxError):
            return text

    ctx = dict(payload)
    variables = next(s["variables"] for s in seq if "variables" in s)
    for name, tpl in variables.items():
        ctx[name] = parse(env.from_string(tpl).render(**ctx))
    send = next(s for s in seq if "action" in s)
    return parse(env.from_string(send["data"]["data"]).render(**ctx))


BASE_PAYLOAD = {"message": "m", "title": "t", "devices": "all", "priority": "active"}


def test_url_is_sent_as_both_ios_and_android_keys():
    data = _render({**BASE_PAYLOAD, "url": "/dashboard-kohbo/security#x"})
    assert data["url"] == data["clickAction"] == "/dashboard-kohbo/security#x"


@pytest.mark.parametrize("extra", [{}, {"url": ""}])
def test_empty_url_sends_neither_key(extra):
    data = _render({**BASE_PAYLOAD, **extra})
    assert "url" not in data and "clickAction" not in data


def test_other_fields_are_unchanged_by_a_link():
    plain = _render({**BASE_PAYLOAD, "tag": "t1", "image": "i", "entity_id": "camera.x"})
    linked = _render({**BASE_PAYLOAD, "tag": "t1", "image": "i", "entity_id": "camera.x",
                      "url": "/dashboard-kohbo/security"})
    for key in ("url", "clickAction"):
        linked.pop(key)
    assert plain == linked
    assert plain["tag"] == "t1" and plain["image"] == "i" and plain["entity_id"] == "camera.x"
    assert plain["push"] == {"interruption-level": "active"}


def test_actions_pass_through_as_a_list_and_default_to_empty():
    acts = [{"action": "A", "title": "Do it"}]
    assert _render({**BASE_PAYLOAD, "actions": acts})["actions"] == acts
    assert _render(BASE_PAYLOAD)["actions"] == ""


def test_missing_or_empty_priority_defaults_to_active_without_quotes():
    no_prio = {k: v for k, v in BASE_PAYLOAD.items() if k != "priority"}
    assert _render(no_prio)["push"] == {"interruption-level": "active"}
    assert _render({**no_prio, "priority": ""})["push"] == {"interruption-level": "active"}


def test_priority_still_reaches_the_push():
    assert _render({**BASE_PAYLOAD, "priority": "critical"})["push"] == {"interruption-level": "critical"}


# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print(f"{len(CALLS)} push call sites; {len(LINKED)} linked, {len(UNLINKED)} not\n")
    print("| file | kind | link |\n|---|---|---|")
    for f, k, u in CALLS:
        print(f"| {f} | {k} | {', '.join(sorted(set(u))) or '-'} |")
    sys.exit(0)
