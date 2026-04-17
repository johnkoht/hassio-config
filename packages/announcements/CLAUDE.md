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
  └─▶ script.critical_announcement    (emergencies)
        └─▶ script.announcement_queue_enqueue
              └─▶ MQTT topic: home/announcement_queue/append
                    └─▶ queue processor automation
                          └─▶ script.announcement_engine   (plays chime + TTS on Sonos)
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

For emergencies only. Broadcasts to **all rooms**, clears the queue, ignores time/quiet restrictions.

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
| `critical` | Never | Clears all other queued messages; plays immediately |
| `high` | Never | Plays before normal/low |
| `normal` | 10 min | Discarded after 10 min if unplayed |
| `low` | 3 min | Discarded after 3 min; skips rooms with active music |

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

The processor only runs when: house is occupied, queue is not empty, no announcement is currently playing, and at least one announceable room is occupied (for non-critical messages).

---

## File Structure

```
packages/announcements/
├── announcement_engine.yaml              # Core TTS + chime playback
├── voice_announcement.yaml               # Primary wrapper script
├── critical_announcement.yaml            # Emergency wrapper
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
