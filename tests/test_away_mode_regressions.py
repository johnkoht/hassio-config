"""
Regression tests for away-mode / kids' bedroom fixes.

Reads repo files relative to this test, so it runs on a dev machine.
"""
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parent.parent


class _Loader(yaml.SafeLoader):
    pass


for _tag in ("!include", "!secret", "!include_dir_named", "!include_dir_list",
             "!include_dir_merge_list", "!include_dir_merge_named", "!input"):
    _Loader.add_constructor(_tag, lambda loader, node: None)


def automation(rel_path):
    content = yaml.load((REPO / rel_path).read_text(), Loader=_Loader)
    return content["automation"][0]


def state_triggers(auto, entity_id):
    return [t for t in auto["triggers"]
            if t.get("trigger") == "state" and t.get("entity_id") == entity_id]


def has_state_condition(auto, entity_id, state):
    return any(c.get("condition") == "state" and c.get("entity_id") == entity_id
               and c.get("state") == state for c in auto["conditions"])


def test_house_not_occupied_is_debounced():
    """A group reload briefly flips group.all_people; it must not mark the house empty."""
    auto = automation("packages/house/occupancy/house_not_occupied.yaml")
    (trigger,) = state_triggers(auto, "group.all_people")
    assert trigger.get("for"), "group.all_people trigger needs a for: debounce"


@pytest.mark.parametrize("path,kid", [
    ("packages/ninos_room/modes/ninos_bedroom_mode_bedtime.yaml", "nino"),
    ("packages/gianluca_room/modes/gianlucas_room_mode_bedtime.yaml", "gianluca"),
])
def test_kids_bedtime_restores_after_away(path, kid):
    """Away forces the room Off; returning with the kid in bed must restore Bedtime."""
    auto = automation(path)
    assert any(t.get("to") == "on" for t in state_triggers(auto, "input_boolean.house_occupied"))
    assert any(t.get("to") == "Auto" for t in state_triggers(auto, "input_select.house"))
    assert has_state_condition(auto, f"input_boolean.{kid}_in_bed", "on")


def test_gianluca_auto_trigger_matches_condition():
    """The occupied trigger must be satisfiable by the 'room not occupied' condition."""
    auto = automation("packages/gianluca_room/modes/gianlucas_room_mode_auto.yaml")
    for trigger in state_triggers(auto, "input_boolean.gianlucas_room_occupied"):
        assert trigger.get("to") == "off"
    assert has_state_condition(auto, "input_boolean.gianlucas_room_occupied", "off")


def test_vacation_bedtime_requires_vacation_mode():
    """The 22:00 bedtime-on must not fire for an ordinary evening out."""
    content = yaml.load((REPO / "packages/house/bedtime_mode/bedtime_mode_vacation.yaml").read_text(),
                        Loader=_Loader)
    auto = next(a for a in content["automation"] if a["id"] == "bedtime_mode_vacation_on")
    assert has_state_condition(auto, "input_boolean.vacation_mode", "on")


@pytest.mark.parametrize("path,flag", [
    ("packages/ninos_room/modes/ninos_bedroom_not_occupied.yaml", "ninos_bedroom_occupied"),
    ("packages/gianluca_room/modes/gianlucas_room_not_occupied.yaml", "gianlucas_room_occupied"),
])
def test_kids_room_occupancy_clears_when_house_empties(path, flag):
    """A stuck room-occupied flag blocks Mode Auto after Away; an empty house must clear it."""
    auto = automation(path)
    assert any(t.get("to") == "off" for t in state_triggers(auto, "input_boolean.house_occupied"))
    (either,) = [c for c in auto["conditions"] if c.get("condition") == "or"]
    assert any(c.get("entity_id") == "input_boolean.house_occupied" and c.get("state") == "off"
               for c in either["conditions"])
    assert auto["actions"][0]["target"]["entity_id"] == f"input_boolean.{flag}"


def test_gianluca_offline_door_sensor_counts_as_open():
    """An unavailable door sensor must not pin Gianluca's room occupied forever."""
    auto = automation("packages/gianluca_room/modes/gianlucas_room_not_occupied.yaml")
    (either,) = [c for c in auto["conditions"] if c.get("condition") == "or"]
    (lights_and_door,) = [c for c in either["conditions"] if c.get("condition") == "and"]
    (door,) = [c for c in lights_and_door["conditions"]
               if c.get("entity_id") == "binary_sensor.gianlucas_door_sensor_status"]
    assert "unavailable" in door["state"]


def test_kitchen_override_latch_cannot_survive_away_bedtime_off():
    """#73 intent: a manual override must not outlive Away/bedtime/Off, so kitchen motion lights
    never stay dead. Now done by the ungated reset automation, not by mode_off writing the hand flag."""
    reset = automation("packages/kitchen/lights/kitchen_lights_reset_manual_toggle.yaml")
    trig = {(t["entity_id"], t["to"]) for t in reset["triggers"]}
    assert ("input_select.kitchen", "Off") in trig
    assert ("input_boolean.house_occupied", "off") in trig
    assert ("input_boolean.kitchen_occupied", "off") in trig
    assert not reset.get("conditions")
    off = automation("packages/kitchen/modes/kitchen_mode_off.yaml")
    written = [a.get("target", {}).get("entity_id") for a in off["actions"]]
    assert "input_boolean.kitchen_lighting_automations" not in written


def test_katia_home_requires_iphone_detect():
    """A UniFi blip on a WLAN toggle marked Katia home (11-11); detect must agree."""
    auto = automation("packages/people/katia/automations/katia_is_home.yaml")
    assert has_state_condition(auto, "device_tracker.katia_iphone_detect", "home")
    assert any(t.get("to") == "home"
               for t in state_triggers(auto, "device_tracker.katia_iphone_detect"))


PARENTS = [
    ("tayta", "person.sonia_koht", "device_tracker.sonia_iphone_detect",
     "packages/people/tayta/automations/tayta_is_home.yaml",
     "packages/people/tayta/automations/tayta_announce_arrival.yaml"),
    ("jido", "person.antoun_koht", "device_tracker.antoun_iphone_detect",
     "packages/people/jido/presence/jido_is_home.yaml",
     "packages/people/jido/presence/jido_announce_arrival.yaml"),
]


@pytest.mark.parametrize("name,person,detect,is_home,announce", PARENTS)
def test_parent_home_requires_iphone_detect(name, person, detect, is_home, announce):
    """UniFi blips marked the parents home after they left (JK-1251); detect must agree."""
    auto = automation(is_home)
    assert has_state_condition(auto, detect, "home")
    assert any(t.get("to") == "home" for t in state_triggers(auto, detect))
    arrival = automation(announce)
    assert has_state_condition(arrival, detect, "home")
    (trigger,) = state_triggers(arrival, person)
    assert trigger.get("for"), "arrival must wait for detect to confirm"


def test_tayta_room_presence_unavailable_is_not_a_sighting():
    """template.reload made the sensor unavailable and marked Tayta home (JK-1251)."""
    auto = automation("packages/people/tayta/automations/tayta_is_home.yaml")
    (trigger,) = state_triggers(auto, "sensor.tayta_room_presence")
    assert {"unavailable", "unknown"} <= set(trigger["not_to"])
    tmpl = auto["conditions"][1]["conditions"][1]["value_template"]
    import jinja2
    for rp, ok in [("unavailable", False), ("unknown", False), ("not_home", False), ("kitchen", True)]:
        out = jinja2.Environment().from_string(tmpl).render(states=lambda e: rp)
        assert (out.strip() == "True") is ok


def test_katia_bluetooth_home_ignores_unavailable():
    auto = automation("packages/people/katia/automations/katie_bluetooth_detected_home.yaml")
    for tmpl in [auto["triggers"][0]["value_template"], auto["conditions"][0]["value_template"]]:
        assert "unavailable" in tmpl and "unknown" in tmpl and "not in" in tmpl


def _render(tpl, states_map, **ctx):
    import jinja2
    from types import SimpleNamespace
    env = jinja2.Environment()
    return env.from_string(tpl).render(
        is_state=lambda e, v: states_map.get(e) == v, **ctx).strip() == "True"


def test_garage_unlock_parents_need_detect_and_hold():
    auto = automation("packages/mudroom/garage_entry_door/garage_entry_door_unlock_upon_arrival.yaml")
    plain = [t for t in auto["triggers"] if t.get("trigger") == "state" and "for" not in t]
    held = [t for t in auto["triggers"] if t.get("for")]
    parents = {"person.sonia_koht", "person.antoun_koht"}
    assert parents <= set(held[0]["entity_id"])
    assert not any(parents & set(t["entity_id"]) for t in plain
                   if isinstance(t["entity_id"], list))
    tmpl = [c for c in auto["conditions"] if c.get("condition") == "template"][0]["value_template"]
    from types import SimpleNamespace
    for who, det in [("person.sonia_koht", "device_tracker.sonia_iphone_detect"),
                     ("person.antoun_koht", "device_tracker.antoun_iphone_detect")]:
        trig = SimpleNamespace(entity_id=who)
        assert _render(tmpl, {det: "home"}, trigger=trig)
        assert not _render(tmpl, {det: "not_home"}, trigger=trig)
        assert not _render(tmpl, {det: "unknown"}, trigger=trig)
    for other in ("person.john_koht", "input_boolean.house_occupied"):
        assert _render(tmpl, {}, trigger=SimpleNamespace(entity_id=other))


def test_guest_mode_ignores_unconfirmed_parent_blip():
    from types import SimpleNamespace
    content = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    assert {"device_tracker.sonia_iphone_detect", "device_tracker.antoun_iphone_detect"} <= {
        e for t in content["trigger"] for e in (t.get("entity_id") if isinstance(t.get("entity_id"), list) else [t.get("entity_id")])}
    tmpl = [c for c in content["condition"] if c.get("condition") == "template"][0]["value_template"]

    def member(e, s):
        return SimpleNamespace(entity_id=e, state=s)

    def run(members, detect):
        return _render(tmpl, detect, expand=lambda g: members)

    blip = [member("person.sonia_koht", "home")]
    assert not run(blip, {"device_tracker.sonia_iphone_detect": "not_home"})
    assert run(blip, {"device_tracker.sonia_iphone_detect": "home"})
    assert run(blip + [member("person.sylvia", "home")], {})
    assert not run([member("person.sylvia", "not_home")], {})


def test_joe_arrival_suppresses_guest_mode_announcement():
    """Joe is in extended_family -> guests, so guest_mode follows him. His
    arrival must set guest_mode_announced so guest_mode_on skips its generic
    line. The flag is set BEFORE the announcement: guest_mode_on checks it 2
    minutes after Joe counts, and the 1 minute hold would otherwise eat the margin."""
    auto = automation("packages/people/joe/automations/joe_announce_arrival.yaml")
    actions = auto["actions"]
    setter = next(i for i, a in enumerate(actions)
                  if a.get("action") == "input_boolean.turn_on"
                  and a["target"]["entity_id"] == "input_boolean.guest_mode_announced")
    announce = next(i for i, a in enumerate(actions)
                    if a.get("action") == "script.person_announcement")
    assert setter < announce
    # no gate ahead of the announcement: it must always play
    assert not any(a.get("condition") for a in actions[:announce])
    # guest_mode_on honours the flag after its delay
    on = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    tail = on["action"][-3:]
    assert any(a.get("entity_id") == "input_boolean.guest_mode_announced"
               and a.get("state") == "off" for a in tail)
    delay = next(a for a in on["action"] if "delay" in a)["delay"]
    assert delay == "00:02:00"


JOE = "person.joe_falbo"
JOE_DETECT = "device_tracker.joe_iphone_detect"


def test_joe_home_requires_iphone_detect():
    """Same UniFi blip protection as the parents (JK-1251)."""
    content = yaml.load((REPO / "automation/people/joe/joe_home.yaml").read_text(), Loader=_Loader)
    assert any(c.get("condition") == "state" and c.get("entity_id") == JOE_DETECT
               and c.get("state") == "home" for c in content["condition"])
    assert any(t.get("entity_id") == JOE_DETECT and t.get("to") == "home"
               for t in content["trigger"])


def test_joe_announce_arrival_holds_and_requires_detect():
    auto = automation("packages/people/joe/automations/joe_announce_arrival.yaml")
    assert has_state_condition(auto, JOE_DETECT, "home")
    (trigger,) = state_triggers(auto, JOE)
    assert trigger.get("for"), "arrival must wait for detect to confirm"


def test_garage_unlock_joe_needs_detect_and_hold():
    from types import SimpleNamespace
    auto = automation("packages/mudroom/garage_entry_door/garage_entry_door_unlock_upon_arrival.yaml")
    plain = [t for t in auto["triggers"] if t.get("trigger") == "state" and "for" not in t]
    held = [t for t in auto["triggers"] if t.get("for")]
    assert JOE in held[0]["entity_id"]
    assert not any(JOE in (t["entity_id"] if isinstance(t["entity_id"], list) else [t["entity_id"]])
                   for t in plain)
    tmpl = [c for c in auto["conditions"] if c.get("condition") == "template"][0]["value_template"]
    trig = SimpleNamespace(entity_id=JOE)
    assert _render(tmpl, {JOE_DETECT: "home"}, trigger=trig)
    for bad in ("not_home", "unknown", "unavailable"):
        assert not _render(tmpl, {JOE_DETECT: bad}, trigger=trig)


def test_guest_mode_counts_joe_only_with_detect():
    from types import SimpleNamespace
    on = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    triggered = {e for t in on["trigger"] for e in
                 (t.get("entity_id") if isinstance(t.get("entity_id"), list) else [t.get("entity_id")])}
    assert JOE_DETECT in triggered
    tmpl = [c for c in on["condition"] if c.get("condition") == "template"][0]["value_template"]
    joe = [SimpleNamespace(entity_id=JOE, state="home")]
    assert not _render(tmpl, {JOE_DETECT: "not_home"}, expand=lambda g: joe)
    assert not _render(tmpl, {JOE_DETECT: "unknown"}, expand=lambda g: joe)
    assert _render(tmpl, {JOE_DETECT: "home"}, expand=lambda g: joe)
    # an unconfirmed Joe does not hide a real guest
    sylvia = SimpleNamespace(entity_id="person.sylvia", state="home")
    assert _render(tmpl, {JOE_DETECT: "not_home"}, expand=lambda g: joe + [sylvia])


def test_joe_has_no_room_presence_not_home_trigger():
    """No Joe automation fires on sensor.joe_room_presence from not_home, so none
    needs the unavailable/unknown guard (it is only read by dashboards/templates)."""
    hits = []
    for path in REPO.rglob("*.yaml"):
        rel = path.relative_to(REPO).as_posix()
        if rel.startswith(("plans/", ".claude/", "dashboards/", "tests/")):
            continue
        text = path.read_text()
        if "sensor.joe_room_presence" in text and "from:" in text and "trigger" in text:
            hits.append(rel)
    assert hits == []


# ---- JK-1254: remaining false-arrival paths after JK-1251 ----

GATED = {
    "person.antoun_koht": "device_tracker.antoun_iphone_detect",
    "person.sonia_koht": "device_tracker.sonia_iphone_detect",
    "person.katia": "device_tracker.katia_iphone_detect",
    "person.joe_falbo": "device_tracker.joe_iphone_detect",
}


def _ids(trigger):
    e = trigger.get("entity_id", [])
    return e if isinstance(e, list) else [e]


def test_tayta_is_away_triggers_on_tayta_not_nonna():
    """The trigger watched person.mary_falbo (Nonna), so Tayta leaving never fired it."""
    auto = automation("packages/people/tayta/automations/tayta_is_away.yaml")
    assert state_triggers(auto, "person.sonia_koht")
    assert not state_triggers(auto, "person.mary_falbo")


def test_garage_remotes_unlock_needs_detect_and_hold():
    """A UniFi blip unlocked the garage remotes with no detect gate (JK-1254)."""
    from types import SimpleNamespace
    auto = yaml.load((REPO / "packages/garage/doors/garage_doors_lock_remotes.yaml").read_text(),
                     Loader=_Loader)["automation"][1]
    assert auto["id"] == "garage_doors_unlock_remotes"
    plain = [t for t in auto["triggers"] if t.get("trigger") == "state" and "for" not in t
             and any(i.startswith("person.") for i in _ids(t))]
    held = [t for t in auto["triggers"] if t.get("for")
            and any(i.startswith("person.") for i in _ids(t))]
    assert held and set(GATED) <= set(_ids(held[0]))
    for t in plain:
        assert not set(GATED) & set(_ids(t))
    tmpl = [c for c in auto["conditions"] if c.get("condition") == "template"][0]["value_template"]
    for who, det in GATED.items():
        trig = SimpleNamespace(entity_id=who)
        assert _render(tmpl, {det: "home"}, trigger=trig)
        for bad in ("not_home", "unknown", "unavailable"):
            assert not _render(tmpl, {det: bad}, trigger=trig)
    # non-gated people and non-person triggers (bedtime, restart) still unlock
    assert _render(tmpl, {}, trigger=SimpleNamespace(entity_id="person.john_koht"))
    assert _render(tmpl, {}, trigger=SimpleNamespace())


def test_garage_entry_door_katia_needs_detect_and_hold():
    from types import SimpleNamespace
    auto = automation("packages/mudroom/garage_entry_door/garage_entry_door_unlock_upon_arrival.yaml")
    plain = [t for t in auto["triggers"] if t.get("trigger") == "state" and "for" not in t]
    held = [t for t in auto["triggers"] if t.get("for")]
    assert "person.katia" in _ids(held[0])
    assert not any("person.katia" in _ids(t) for t in plain)
    tmpl = [c for c in auto["conditions"] if c.get("condition") == "template"][0]["value_template"]
    trig = SimpleNamespace(entity_id="person.katia")
    assert _render(tmpl, {"device_tracker.katia_iphone_detect": "home"}, trigger=trig)
    assert not _render(tmpl, {"device_tracker.katia_iphone_detect": "not_home"}, trigger=trig)


def test_guest_mode_counts_katia_only_with_detect():
    """Katia's router-tracker blip turned guest mode on (JK-1254)."""
    from types import SimpleNamespace
    on = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    tmpl = [c for c in on["condition"] if c.get("condition") == "template"][0]["value_template"]
    det = "device_tracker.katia_iphone_detect"
    katia = [SimpleNamespace(entity_id="person.katia", state="home")]
    assert not _render(tmpl, {det: "not_home"}, expand=lambda g: katia)
    assert not _render(tmpl, {det: "unknown"}, expand=lambda g: katia)
    assert _render(tmpl, {det: "home"}, expand=lambda g: katia)
    # an unconfirmed Katia does not hide a real guest
    sylvia = [SimpleNamespace(entity_id="person.sylvia", state="home")]
    assert _render(tmpl, {det: "not_home"}, expand=lambda g: katia + sylvia)


def test_guest_mode_detect_triggers_are_held_against_flaps():
    """A detect flap must not re-enable guest mode; the hold also lets UniFi
    catch up to person.* when detect leads it."""
    on = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    detect = [t for t in on["trigger"] if "device_tracker.katia_iphone_detect" in _ids(t)]
    assert len(detect) == 1 and detect[0].get("for")
    assert set(GATED.values()) <= set(_ids(detect[0]))


# ---- JK-1256: Nonna gated on iPhone detect like the parents ----

NONNA = "person.mary_falbo"
NONNA_DETECT = "device_tracker.mary_iphone_detect"


def test_nonna_home_requires_iphone_detect():
    """UniFi blips flapped nonna_home while she was away; detect must agree."""
    auto = automation("packages/people/nonna/automations/nonna_is_home.yaml")
    assert has_state_condition(auto, NONNA_DETECT, "home")
    assert any(t.get("to") == "home" for t in state_triggers(auto, NONNA_DETECT))


def test_nonna_announce_arrival_holds_and_requires_detect():
    auto = automation("packages/people/nonna/automations/nonna_announce_arrival.yaml")
    assert has_state_condition(auto, NONNA_DETECT, "home")
    (trigger,) = state_triggers(auto, NONNA)
    assert trigger.get("for"), "arrival must wait for detect to confirm"
    actions = auto["actions"]
    setter = next(i for i, a in enumerate(actions)
                  if a.get("action") == "input_boolean.turn_on"
                  and a["target"]["entity_id"] == "input_boolean.guest_mode_announced")
    announce = next(i for i, a in enumerate(actions)
                    if a.get("action") == "script.person_announcement")
    assert setter < announce
    assert not any(a.get("condition") for a in actions[:announce])


def _garage_autos():
    from types import SimpleNamespace  # noqa: F401
    remotes = yaml.load((REPO / "packages/garage/doors/garage_doors_lock_remotes.yaml").read_text(),
                        Loader=_Loader)["automation"][1]
    assert remotes["id"] == "garage_doors_unlock_remotes"
    door = automation("packages/mudroom/garage_entry_door/garage_entry_door_unlock_upon_arrival.yaml")
    return [remotes, door]


@pytest.mark.parametrize("idx", [0, 1])
def test_garage_unlock_nonna_needs_detect_and_hold(idx):
    from types import SimpleNamespace
    auto = _garage_autos()[idx]
    plain = [t for t in auto["triggers"] if t.get("trigger") == "state" and "for" not in t]
    held = [t for t in auto["triggers"] if t.get("for")
            and any(i.startswith("person.") for i in _ids(t))]
    assert NONNA in _ids(held[0])
    assert not any(NONNA in _ids(t) for t in plain)
    tmpl = [c for c in auto["conditions"] if c.get("condition") == "template"][0]["value_template"]
    trig = SimpleNamespace(entity_id=NONNA)
    assert _render(tmpl, {NONNA_DETECT: "home"}, trigger=trig)
    for bad in ("not_home", "unknown", "unavailable"):
        assert not _render(tmpl, {NONNA_DETECT: bad}, trigger=trig)


def test_guest_mode_counts_nonna_only_with_detect():
    from types import SimpleNamespace
    on = yaml.load((REPO / "automation/guests/guest_mode_on.yaml").read_text(), Loader=_Loader)
    tmpl = [c for c in on["condition"] if c.get("condition") == "template"][0]["value_template"]
    nonna = [SimpleNamespace(entity_id=NONNA, state="home")]
    assert not _render(tmpl, {NONNA_DETECT: "not_home"}, expand=lambda g: nonna)
    assert not _render(tmpl, {NONNA_DETECT: "unknown"}, expand=lambda g: nonna)
    assert _render(tmpl, {NONNA_DETECT: "home"}, expand=lambda g: nonna)
    sylvia = [SimpleNamespace(entity_id="person.sylvia", state="home")]
    assert _render(tmpl, {NONNA_DETECT: "not_home"}, expand=lambda g: nonna + sylvia)
    detect = [t for t in on["trigger"] if NONNA_DETECT in _ids(t)]
    assert len(detect) == 1 and detect[0].get("for")
