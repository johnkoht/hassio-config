# Announcements

Voice gives the house a personality! I started off with some really simple voice announcements and slowly evolved to a more complex and reusable engine with wrappers. 

## Announcement Engine
The [announcement engine](https://github.com/johnkoht/hassio-config/blob/master/packages/announcements/announcement_engine.yaml) is the underlying engine that actually boardcasts the chime and announcement. It simple accepts parameters and plays the media files (chime and TTS) without any validation or conditions. The chime is required but the TTS message is not. The chime only is useful for the doorbell, for example. I've also thought about using other chime-only notifications for things like laundry, door open, etc. 

## 

Speech notifications give the house a personality. 

I have a bunch of Sonos Amps that power in-ceiling speakers throughout the house. Automations and home states can broadcast messages throughout the house via TTS. Speech notifications are only broadcast in rooms that are occupied. So if I'm in the Office, my wife is in the bedroom, and our kids are in the Playroom, it will announce in all three rooms. For example, when I leave the house, an automation will broadcast a voice notification to let people know. Likewise, when I arrive at work, a speech notification will trigger. Most regular guests are announced. There are a lot of other announcements as well, including:

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
