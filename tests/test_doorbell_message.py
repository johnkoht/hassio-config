"""
Regression tests for the doorbell message (JK-82).

The Protect select expires after the NVR reset timeout, so the message is
resolved by sensor.doorbell_message and written to the text entity by
doorbell_message_apply. Templates are rendered with Jinja2 (StrictUndefined).
"""
from datetime import datetime
from pathlib import Path

import pytest
import yaml
from jinja2 import Environment, StrictUndefined

REPO = Path(__file__).resolve().parent.parent
DIR = "packages/house/doorbell"
LIMIT = 30  # Protect's DoorbellText max length


class Loader(yaml.SafeLoader):
    """SafeLoader that tolerates HA's !secret/!include tags."""


Loader.add_multi_constructor("!", lambda loader, suffix, node: f"!{suffix}")


def load(rel):
    return yaml.load((REPO / rel).read_text(), Loader=Loader)


RESOLVER = load(f"{DIR}/doorbell_message.yaml")["template"][0]["sensor"][0]["state"]
APPLY = load(f"{DIR}/doorbell_message_apply.yaml")["automation"][0]


def render(day, house="Auto", entertainment="off", sun="above_horizon", rising=True):
    """Render the resolver on a date (a datetime) with the given inputs."""
    states = {
        "input_select.house": house,
        "input_boolean.entertainment_mode": entertainment,
        "sun.sun": sun,
    }
    env = Environment(undefined=StrictUndefined)
    env.globals.update(
        now=lambda: day,
        states=lambda e: states.get(e, "unknown"),
        is_state=lambda e, s: states.get(e) == s,
        state_attr=lambda e, a: rising if (e, a) == ("sun.sun", "rising") else None,
    )
    return env.from_string(RESOLVER).render().strip()


def on(month, day, year=2026):
    return datetime(year, month, day, 12, 0)


PLAIN = on(5, 6)  # no holiday


@pytest.mark.parametrize("house", ["Away", "Vacation", "Bedtime"])
def test_dnd_modes_beat_everything(house):
    xmas = on(12, 25)
    assert render(xmas, house=house, entertainment="on") == "DO NOT DISTURB"


def test_quiet_beats_entertainment_and_holiday():
    assert render(on(12, 25), house="Quiet", entertainment="on") == "SHHH…KIDS SLEEPING"


def test_entertainment_beats_holiday():
    assert render(on(12, 25), entertainment="on") == "Come on in…"


def test_holiday_beats_time_of_day():
    assert render(on(12, 25)) == "Merry Christmas!"
    assert render(on(12, 25), sun="below_horizon", rising=False) == "Merry Christmas!"


@pytest.mark.parametrize("sun,rising,text", [
    ("above_horizon", True, "Good morning!"),
    ("above_horizon", False, "Welcome!"),
    ("below_horizon", False, "Good evening!"),
    ("below_horizon", True, "Welcome!"),
    ("unknown", None, "Welcome!"),
])
def test_time_of_day_follows_the_sun(sun, rising, text):
    assert render(PLAIN, sun=sun, rising=rising) == text


@pytest.mark.parametrize("house", ["unknown", "unavailable", "Auto", "Entertainment"])
def test_other_house_states_fall_through(house):
    assert render(PLAIN, house=house) == "Good morning!"
    assert render(PLAIN, house=house, entertainment="on") == "Come on in…"


@pytest.mark.parametrize("day,text", [
    ((12, 31), "Happy New Year!"), ((1, 1), "Happy New Year!"),
    ((2, 14), "Happy Valentine's Day!"), ((3, 17), "Happy St. Patrick's Day!"),
    ((7, 4), "Happy 4th of July!"),
    ((10, 25), "Happy Halloween!"), ((10, 31), "Happy Halloween!"),
    ((12, 20), "Merry Christmas!"), ((12, 25), "Merry Christmas!"),
])
def test_holiday_windows_include_their_edges(day, text):
    assert render(on(*day)) == text


@pytest.mark.parametrize("day", [(10, 24), (11, 1), (12, 19), (12, 26), (12, 30),
                                 (1, 2), (2, 13), (2, 15), (7, 3), (7, 5)])
def test_days_outside_windows_are_plain(day):
    assert render(on(*day)) == "Good morning!"


@pytest.mark.parametrize("year,day", [(2026, 26), (2027, 25), (2028, 23)])
def test_thanksgiving_is_the_fourth_thursday(year, day):
    assert render(on(11, day, year)) == "Happy Thanksgiving!"
    assert render(on(11, day - 7, year)) == "Good morning!"  # 3rd Thursday
    assert render(on(11, day + 1, year)) == "Good morning!"


def test_every_output_fits_protect():
    outputs = {render(on(m, d), house=h, entertainment=e, sun=s, rising=r)
               for m in range(1, 13) for d in range(1, 29)
               for h in ("Auto", "Away", "Quiet")
               for e in ("on", "off")
               for s, r in (("above_horizon", True), ("below_horizon", False))}
    assert len(outputs) >= 10
    assert all(0 < len(o) <= LIMIT for o in outputs), [o for o in outputs if len(o) > LIMIT]


def test_apply_triggers_cover_every_way_the_text_drifts():
    triggers = APPLY["triggers"]
    state = {t["entity_id"]: t for t in triggers if t["trigger"] == "state"}
    assert "sensor.doorbell_message" in state
    assert state["text.front_door_camera_doorbell"]["for"] == {"seconds": 30}
    assert {"time_pattern", "homeassistant"} <= {t["trigger"] for t in triggers}
    assert any(t.get("event_type") == "automation_reloaded" for t in triggers)


def test_apply_writes_only_on_a_real_difference_to_the_text_entity():
    cond = " ".join(c["value_template"] for c in APPLY["conditions"])
    assert "!=" in cond and "unavailable" in cond
    (action,) = APPLY["actions"]
    assert action["action"] == "text.set_value"
    assert action["target"]["entity_id"] == "text.front_door_camera_doorbell"


def test_nothing_uses_initial_and_the_expiring_select_is_unused():
    for rel in ("doorbell_message", "doorbell_message_apply"):
        text = (REPO / DIR / f"{rel}.yaml").read_text()
        assert "initial" not in text
    for path in (REPO / "packages").rglob("*.yaml"):
        assert "select.front_door_camera_doorbell_text" not in path.read_text(), path


def test_old_automation_is_gone():
    assert not (REPO / "packages/house/modes/house_mode_doorbell_text.yaml").exists()
