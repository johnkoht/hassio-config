# CLAUDE.md — packages/announcements/

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/announcements/`.

---

## Overview

The announcement system broadcasts TTS through Sonos in-ceiling speakers. It is room-aware (only occupied rooms), queue-based (no overlapping), and priority-ordered. Nabu Casa Cloud TTS is the speech engine; Sonos `announce` feature ducks music and resumes it after.

---

## Call Hierarchy

```
Automation
  └─▶ script.voice_announcement       (normal TTS)
  └─▶ script.critical_announcement    (emergencies; skips the queue)
        └─▶ script.announcement_engine   (priority: critical)

script.voice_announcement
  └─▶ script.announcement_queue_enqueue
        └─▶ MQTT topic: home/announcement_queue/append
              └─▶ queue processor automation
                    └─▶ script.announcement_engine   (plays chime + TTS on Sonos)

script.announcement_engine  (first step: emergency gate)
```

---

## script.voice_announcement — Parameters

Use this for all normal announcements. It handles room selection, volume, and priority automatically.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `speech_message` | string | required | The TTS message text |
| `sound` | string | `default` | Chime to play before speaking |
| `media_players` | string | `auto` | `auto` = occupied rooms, `all` = every room, or a specific `media_player.*` entity |
| `priority` | string | `low` | `critical` / `high` / `normal` / `low` |
| `expires_in` | number | priority-based | Minutes until message is discarded if unplayed |

```yaml
# Standard announcement to occupied rooms
- action: script.voice_announcement
  data:
    media_players: auto
    sound: "one-chime"
    speech_message: "The upstairs washer is done."
    priority: "low"

# High priority with person-specific intro sound
- action: script.voice_announcement
  data:
    media_players: auto
    sound: "alex"
    speech_message: "Alex just arrived home."
    priority: "normal"

# Templated message
- action: script.voice_announcement
  data:
    media_players: auto
    sound: "default"
    speech_message: >
      {% if is_state('input_boolean.bad_weather', 'on') %}
        Don't forget an umbrella today.
      {% else %}
        Have a great day!
      {% endif %}
```

---

## script.critical_announcement — Parameters

For emergencies only. Broadcasts to **all rooms**. It starts `script.announcement_engine` directly (`priority: critical`, via `script.turn_on` so callers don't wait), so the queue processor's gates (`house_occupied`, quiet before 9 AM) never hold it. It ignores time, `speech_notifications` and `bedtime`. Quiet mode halves the volume, except while `binary_sensor.emergency_active` is on.

```yaml
- action: script.critical_announcement
  data:
    media_players: all
    speech_message: "Warning! Water leak detected in the basement."
```

---

## Sound Library

| Sound | Use case |
|---|---|
| `default` | General notification |
| `one-chime` / `chime` | Subtle alerts |
| `chirp` | Quick, quiet notification |
| `fanfare` | Celebratory |
| `arcade` | Playful |
| `message-alert` | Message/reminder |
| `police-whistle` | Attention-grabbing |
| `school-bell` / `school-bell-chime` | School reminders |
| `success-trumpets` | Completion/achievement |
| `alex` / `yara` / `shawn` / `jido` / `genny` | Person-specific arrival sounds |

---

## Priority System

| Priority | Expires | Behavior |
|---|---|---|
| `critical` | Never | Skips the queue via `critical_announcement`. A critical item that still arrives through the queue (severe thunderstorm warning, extreme heat warning, hazardous air; not the tornado warning, which calls `critical_announcement`) goes first and `append.yaml` drops the other queued items |
| `high` | Never | Plays before normal/low |
| `normal` | 10 min | Discarded after 10 min if unplayed |
| `low` | 3 min | Discarded after 3 min; skips rooms with active music |

---

## Emergency Mode

`binary_sensor.emergency_active` (`packages/security/emergency/`) is on while `alarm_control_panel.alarmo` is `triggered`, `binary_sensor.smoke_detector` is on, or `input_boolean.emergency_mode` (manual/test override, auto-off after 10 min, at start and on automation reload) is on.

- The **engine** has a `priority` field and a first-step gate: non-`critical` runs stop while an emergency is active. This covers the doorbell and hourly dong, which call the engine directly. Fields have no runtime default, so the gate uses `priority | default('normal')`. It fails open if the sensor is missing or unavailable.
- The **processor** dequeues only a critical item during an emergency (non-critical items are held, not cleared), resumes on `emergency_active -> off`, and on that run drops `low` items and expired items.
- The engine waits `len/14 + 3` s after TTS, and has `max: 25` so a burst can't drop a critical call.
- Never test with the alarm, panic, fire or Noonlight scripts. Use `input_boolean.emergency_mode` and `script.critical_announcement`.

---

## Smart Behaviors (Built-in Guards)

The engine automatically respects these — **do not duplicate these checks** in the calling automation:

- Only announces between 6 AM and 11 PM
- Skips when `input_boolean.bedtime` is on
- Skips when `input_boolean.speech_notifications` is off
- Reduces volume 50% when `input_boolean.quiet_mode` is on
- Low/normal messages skip rooms actively playing music
- Each room has `input_boolean.{room}_speech_notifications` to opt out individually

---

## Queue System

The MQTT-based queue prevents overlapping announcements:

| MQTT Topic | Purpose |
|---|---|
| `home/announcement_queue/append` | Enqueue a new message |
| `home/announcement_queue/data` | Current queue state (JSON) |
| `home/announcement_queue/state` | Trigger for sensor updates |

The processor only runs when: house is occupied (and not quiet mode before 9 AM), the next item is critical if an emergency is active, queue is not empty, no announcement is currently playing, and at least one announceable room is occupied (for non-critical messages).

---

## File Structure

```
packages/announcements/
├── announcement_engine.yaml              # Core TTS + chime playback
├── voice_announcement.yaml               # Primary wrapper script
├── critical_announcement.yaml            # Emergency wrapper (starts the engine directly)
├── announceable_rooms.yaml               # binary_sensor: any occupied room with TTS on?
├── latest_voice_announcement.yaml        # input_text stores last message
├── repeat_latest_voice_announcement.yaml # Replay last message script
└── queue/
    ├── enqueue.yaml                      # script.announcement_queue_enqueue
    ├── append.yaml                       # automation: MQTT → queue array
    ├── processor.yaml                    # automation: pull next message
    ├── mqtt_sensor.yaml                  # sensor.announcement_queue
    ├── shared_config.yaml                # input_boolean.announcement_queue_running
    └── queue_cleanup.yaml                # discard low/normal when house empties
```

---

## Volume ceiling

No announcement may set a Sonos volume above **75**. The engine clamps `sound_volume` and `speech_volume` to 75 at runtime (`[value, 75] | min | int`, 30 when missing or not a number), the selectors cap at 75, `critical_announcement` is 40 (not halved during an emergency, never raised), and `tests/test_emergency_delivery_regressions.py` fails on any base volume literal above 75.
