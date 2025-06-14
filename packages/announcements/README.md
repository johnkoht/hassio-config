# Announcements

Voice gives the house a personality! I started off with some really simple voice announcements and slowly evolved to a more complex and reusable engine with wrappers. 

## Announcement Engine
The [announcement engine](https://github.com/johnkoht/hassio-config/blob/master/packages/announcements/announcement_engine.yaml) is the underlying engine that actually boardcasts the chime and announcement. It simple accepts parameters and plays the media files (chime and TTS) without any validation or conditions. The chime is required but the TTS message is not. The chime only is useful for the doorbell, for example. I've also thought about using other chime-only notifications for things like laundry, door open, etc. 

## Voice Announcement
The voice announcement script is the primary script I call to trigger TTS broadcasts around the house. The script wraps the announcement engine script but adds some additional logic and functionality, including:

- Sounds: I have a library of chimes that I use for different types of announcements. Some family and friends have their own intro chime/music, for example. Calendar reminders and general notifications trigger different sounds based on the automation and notification. This script handles mapping the sound to the appropriate sound file. It also adjusts the sound_file_length and volume based on the chosen sound.

- Room Aware: The voice announcement can be triggered to broadcast in a specific room/media player or set to "auto." When "auto" is selected, the script will only broadcast to occupied rooms. So if I'm in the Office, my wife is in the bedroom, and our kids are in the Playroom, it will announce in all three rooms.

## Critical Announcements
The critical announcements script also wraps the announcement engine. Its functionally similar to the voice announcements but used for critical items like smoke/fire detection, alarm triggered, or leak detection. It does not care which rooms are occupied and will broadcast at much higher volumes. It includes a "nuclear" sound which is sure to get our attention!

## Announcement Queue
This is a new feature that I'm testing out. A few issues that I've run into with this system are concurrent announcements and missed announcements. The queueing system aims to solve these issues. Concurrent announcements occur when two broadcast occur at the same time, for example somebody arriving exactly when a calendar reminder triggers. This would end up in a weird race condition where we'd hear two chimes and part of one message. With the queue system, these are queued up into MQTT and a processor will pull from the queue. There is a priority level that orders the messages. Any critical messages will wipe the queue as well.


## Media Stack
My house has in-ceiling speakers throughout the house and some outdoor speakers. All speakers are managed by Sonos Amps or Ports. I use Sonos announce feature to broadcast the message. If music is playing in an occupied room, then the music volume will lower while the chime and announcement broadcast, then return back to the previous volume.

## Examples

- [Exterior lights turning on/off](https://github.com/johnkoht/hassio-config/blob/master/packages/outdoor_lighting.yaml)
- [Announce arrival and departure of family](https://github.com/johnkoht/hassio-config/blob/master/packages/people/announcements/person_announcement_script.yaml)
- [Washer or Dryer is finished](https://github.com/johnkoht/hassio-config/tree/master/packages/laundry/main_level_washer)
- [School day announcement, dropoff/pickup reminders](https://github.com/johnkoht/hassio-config/blob/master/packages/school/school_day_reminder.yaml)
- [Calendar reminder (upcoming or next day)](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders)
- [Commuting notifications (arrived at station, heading home, train five mins away)](https://github.com/johnkoht/hassio-config/tree/master/packages/people/john/commute)
- [Garbage day](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders/garbage_day)
- [Severe weather warnings](https://github.com/johnkoht/hassio-config/blob/master/packages/weather/severe_weather_alert/severe_weather_warning.yaml)
- [Morning Update for the Family](https://github.com/johnkoht/hassio-config/blob/master/packages/reminders/morning_update.yaml)
- [Garage doors topen too long](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_close_when_home.yaml)
