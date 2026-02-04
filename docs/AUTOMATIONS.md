# Automations

[Back to main README](../README.md)

This document covers speech notifications and some of my favorite automations.

## Speech Notifications / TTS

Speech notifications give the house a personality. I have a bunch of Sonos Amps that power in-ceiling speakers throughout the house. Automations and home states can broadcast messages throughout the house via TTS. Speech notifications are only broadcast in rooms that are occupied. So if I'm in the Office, my wife is in the bedroom, and our kids are in the Playroom, it will announce in all three rooms. For example, when I leave the house, an automation will broadcast a voice notification to let people know. Likewise, when I arrive at work, a speech notification will trigger. Most regular guests are announced. There are a lot of other announcements as well, including:

- [Exterior lights turning on/off](https://github.com/johnkoht/hassio-config/blob/master/packages/outdoor_lighting.yaml)
- [Announce arrival and departure of family](https://github.com/johnkoht/hassio-config/blob/master/packages/people/announcements/person_announcement_script.yaml)
- [Washer or Dryer is finished](https://github.com/johnkoht/hassio-config/tree/master/packages/laundry/main_level_washer)
- [School day announcement, dropoff/pickup reminders](https://github.com/johnkoht/hassio-config/blob/master/packages/school/school_day_reminder.yaml)
- [Calendar reminder (upcoming or next day)](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders)
- [Commuting notifications (arrived at station, heading home, train five mins away)](https://github.com/johnkoht/hassio-config/tree/master/packages/people/john/commute)
- [Garbage day](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders/garbage_day)
- [Severe weather warnings](https://github.com/johnkoht/hassio-config/blob/master/packages/weather/severe_weather_alert/severe_weather_warning.yaml)
- [Morning Update for the Family](https://github.com/johnkoht/hassio-config/blob/master/packages/reminders/morning_update.yaml)
- [Garage doors open too long](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_close_when_home.yaml)

---

## Favorite Automations

Here are some of my favorite and most useful automations:

### Climate

- **[Climate Automation](https://github.com/johnkoht/hassio-config/blob/master/packages/climate/main_floor/main_floor_climate_activate_eco_when_energy_is_expensive.yaml)**: I switched to hourly pricing with ComEd and have started to automate the HVAC/AC system to turn off when prices spike and back on when they normalize.

### Lighting

- **[Outdoor Lighting](https://github.com/johnkoht/hassio-config/blob/master/packages/outdoor_lighting.yaml)**: We have a few exterior lights, most of which live on their own switch, one of which is in my garage. Turning on the exterior lights would require I walk around the entire house and I'm too lazy for that. I also have a bunch of Hue Lily Uplights around the house that have no physical switch. All exterior lights automatically turn off when it's dark outside, including if the weather is really bad and dark during the day. Certain lights stay on all night while others turn off at bedtime.

### Garage & Security

- **[Automatically close garage door when nobody is around](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_close_when_home.yaml)**: there's always a lot of people in and out of my house and the garage door always gets left open. They will now automatically close after a while if nobody is around the garage (BLE sensor, motion, cameras). It will also notify us via TTS that the garage door will be closed. Also, doors will automatically close when the house is not occupied.
- **[Lock garage door remotes](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_lock_remotes.yaml)**: when the house is empty or we go to sleep, automatically lock the garage doors so that remotes cannot open or close the doors. Just a little extra security, I think.
- **[Alarm panel automation](https://github.com/johnkoht/hassio-config/tree/master/packages/security/alarm)**: Automatically arm the house at bedtime or if we leave, disarm when we arrive or wake up. 
- **[Automatically lock/unlock doors](https://github.com/johnkoht/hassio-config/tree/master/packages/foyer/front_door_lock)**: Locks belong to rooms, e.g. foyer and mudroom, so they are not centralized automations. Different door locks have different automation triggers and conditions.
- **[Security Camera Notifications](https://github.com/johnkoht/hassio-config/tree/master/packages/security/cameras)**: Unifi notifications aren't great so I built my own. It's a bit more intuitive and useful for our needs. More details in the link. These automations take into account time of day, darkness, who's home, and more. Notifications automatically turn on and off based on various conditions. The notifications can be push, displayed on a TV, or TTS messages. They also leverage different notifications types like critical and time-sensitive based on conditions.

### House Modes

- **[Entertainment Mode](https://github.com/johnkoht/hassio-config/tree/master/packages/house/entertainment)**: my wife doesn't love automations and TTS messages when we are entertaining during holidays. I can either toggle this manually or it's automatically triggered when the house detects a bunch of BLE devices. This will stop TTS messages, adapative lighting, and other automations that might otherwise upset my wife. Gotta keep the WAF as high as possible.
- **[Bedtime Mode](https://github.com/johnkoht/hassio-config/tree/master/packages/house/bedtime_mode)**: When everybody is in bed, the house goes into Bedtime mode. This means that all of the rooms, expect bedrooms, essentially turn off. No automations will run, etc. The bedrooms all enter a Bedtime mode as well where automations vary depending on the room. But mostly it's low lighting, no TTS, etc. This will also arm the alarm panel, ensure the doors are locked, and more.

### Safety & Utilities

- **[Safety Outlets](https://github.com/johnkoht/hassio-config/blob/master/packages/main_bathroom/outlets/main_bathroom_turn_off_outlets.yaml)**: Some outlets around the house will automatically turn off when we're not home or the room is off. The best example is the hair dryer and steamer in our main bathroom. 

### Notifications & Reminders

- **[Announcing when somebody is at the grocery store](https://github.com/johnkoht/hassio-config/blob/master/packages/places/grocery_store_announcement.yaml)**: whenever somebody is at a grocery store, a TTS message will broadcast across the house to let everybody know...in case I need some more Oreos, ya know?
- **[Reminders](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders)**: Most of our calendars are integrated into HA and used for TTS reminders. For example birthdays, famliy calendar events, garbage day, robot vacuum maintenance, and much more.
- **[Morning Update for the Family](https://github.com/johnkoht/hassio-config/blob/master/packages/reminders/morning_update.yaml)**: Every morning, a TTS message is broadcast at just the right time (or pretty close). This message contains weather info, school, calendar events, and much more.
- **[John's Daily Report](https://github.com/johnkoht/hassio-config/blob/master/packages/people/john/daily_report/john_daily_report.yaml)**: every morning when I start my work day, I get a TTS notification in the office that tells me about my day, next meeting, sleep score, and more.

### Miscellaneous

- **[Vacuum my office when I drop the dog at daycare](https://github.com/johnkoht/hassio-config/blob/master/packages/vacuums/main_level/vacuums_clean_office_when_dog_is_at_daycare.yaml)**: The dog stays in my office and I'm lazy, so I send the robot vacuum to clean whenever I drop the dog off at daycare.
- **[Weather automations](https://github.com/johnkoht/hassio-config/tree/master/packages/weather)**: a bunch of weather related automations for severe weather, air quality, etc.
