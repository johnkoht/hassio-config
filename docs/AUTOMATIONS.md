# Automations

[Back to main README](../README.md)

This document covers speech notifications and some of my favorite automations.

## Speech Notifications / TTS

Speech notifications give the house a personality. I have a bunch of Sonos Amps that power in-ceiling speakers throughout the house. Automations and home states can broadcast messages throughout the house via TTS. Speech notifications are only broadcast in rooms that are occupied. So if I'm in the Office, my wife is in the bedroom, and our kids are in the Playroom, it will announce in all three rooms. For example, when I leave the house, an automation will broadcast a voice notification to let people know. Likewise, when I arrive at work, a speech notification will trigger. Most regular guests are announced. There are a lot of other announcements as well, including:

- [Exterior lights turning on/off](https://github.com/johnkoht/hassio-config/blob/master/packages/outdoor_lighting.yaml)
- [Announce arrival and departure of family](https://github.com/johnkoht/hassio-config/blob/master/packages/people/announcements/person_announcement_script.yaml)
- [Washer or Dryer is finished](https://github.com/johnkoht/hassio-config/tree/master/packages/laundry/main_level_washer)
- [School day announcement, five-minute departure warning, dropoff/pickup reminders (skipped when a kid is home sick)](https://github.com/johnkoht/hassio-config/tree/master/packages/school/reminders)
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

- **[Climate Automation](https://github.com/johnkoht/hassio-config/blob/master/packages/climate/main_floor/main_floor_climate_activate_eco_when_energy_is_expensive.yaml)**: I switched to hourly pricing with ComEd and have started to automate the HVAC/AC system to switch the Nests to Eco when prices spike and resume when they normalize. Resume restores the heat/cool mode saved before Eco, since the Nest sometimes flips it on its own.

### Lighting

- **[Outdoor Lighting](https://github.com/johnkoht/hassio-config/blob/master/packages/outdoor_lighting.yaml)**: We have a few exterior lights, most of which live on their own switch, one of which is in my garage. Turning on the exterior lights would require I walk around the entire house and I'm too lazy for that. I also have a bunch of Hue Lily Uplights around the house that have no physical switch. All exterior lights automatically turn off when it's dark outside, including if the weather is really bad and dark during the day. Certain lights stay on all night while others turn off at bedtime.

### Garage & Security

- **[Automatically close garage door when nobody is around](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_close_when_home.yaml)**: there's always a lot of people in and out of my house and the garage door always gets left open. They will now automatically close after a while if nobody is around the garage (BLE sensor, motion, cameras). It will also notify us via TTS that the garage door will be closed. Also, doors will automatically close when the house is not occupied.
- **[Lock garage door remotes](https://github.com/johnkoht/hassio-config/blob/master/packages/garage/doors/garage_doors_lock_remotes.yaml)**: when the house is empty or we go to sleep, automatically lock the garage doors so that remotes cannot open or close the doors. Just a little extra security, I think.
- **[Garage entry door evening auto lock](https://github.com/johnkoht/hassio-config/blob/master/packages/mudroom/garage_entry_door/garage_entry_door_evening_auto_lock.yaml)**: the old "lock it after 15 minutes" rule locked us out when we were playing outside, so it stays off. This is the same rule for the evening only, behind a switch on the lock's dashboard popup. After sunset, once the door has been unlocked for the timeout, it pushes "Locking in 2 minutes" (tap to snooze an hour) and then locks. It waits while the driveway, back yard or garage show somebody, and skips guest mode, entertainment mode, an emergency, or when notifications are off. A follow-up push offers Unlock for 30 minutes (needs a Face ID or passcode check, and only arrives at notification level All). The switch starts off after a deploy.
- **[Alarm panel automation](https://github.com/johnkoht/hassio-config/tree/master/packages/security/alarm)**: Automatically arm the house at bedtime or if we leave, disarm when we arrive or wake up. 
- **[Automatically lock/unlock doors](https://github.com/johnkoht/hassio-config/tree/master/packages/foyer/front_door_lock)**: Locks belong to rooms, e.g. foyer and mudroom, so they are not centralized automations. Different door locks have different automation triggers and conditions.
- **[Security Camera Notifications](https://github.com/johnkoht/hassio-config/tree/master/packages/security/cameras)**: Unifi notifications aren't great so I built my own. It's a bit more intuitive and useful for our needs. More details in the link. These automations take into account time of day, darkness, who's home, and more. Notifications automatically turn on and off based on various conditions. The notifications can be push, displayed on a TV, or TTS messages. They also leverage different notifications types like critical and time-sensitive based on conditions.

### House Modes

- **[House mode resolver](https://github.com/johnkoht/hassio-config/tree/master/packages/house/modes)**: `input_select.house` is derived from state by one automation (Vacation, Away, Bedtime, Quiet, else Auto) every time an input changes, instead of being set by whichever event fired last. Toggle the booleans to change it; a manual pick lasts until the next change.
- **[Entertainment Mode](https://github.com/johnkoht/hassio-config/tree/master/packages/house/entertainment)**: my wife doesn't love automations and TTS messages when we are entertaining during holidays. I can either toggle this manually or it's automatically triggered when the house detects a bunch of BLE devices. This will stop TTS messages, adapative lighting, and other automations that might otherwise upset my wife. Gotta keep the WAF as high as possible.
- **[Bedtime Mode](https://github.com/johnkoht/hassio-config/tree/master/packages/house/bedtime_mode)**: When everybody at home is in bed, either because the last person got into bed or because an adult left, the house goes into Bedtime mode. When an adult who isn't in bed comes home, bedtime ends and the house goes to Quiet or Auto. One adult at home getting up ends it in the morning. This means that all of the rooms, expect bedrooms, essentially turn off. No automations will run, etc. The bedrooms all enter a Bedtime mode as well where automations vary depending on the room. But mostly it's low lighting, no TTS, etc. This will also arm the alarm panel, ensure the doors are locked, and more.

### Safety & Utilities

- **[Safety Outlets](https://github.com/johnkoht/hassio-config/blob/master/packages/main_bathroom/outlets/main_bathroom_turn_off_outlets.yaml)**: Some outlets around the house will automatically turn off when we're not home or the room is off. The best example is the hair dryer and steamer in our main bathroom. 
- **[Radio & UPS offline alerts](https://github.com/johnkoht/hassio-config/tree/master/packages/system)**: a push when the Zigbee coordinator, Z-Wave controller or UPS drops offline (re-checked after HA starts), plus a critical push when the UPS goes on battery and another when line power is back.
- **[Safety device alerts](https://github.com/johnkoht/hassio-config/tree/master/packages/system/sensor_health)**: a time-sensitive push to John when a leak sensor, the smoke detector or another safety device has been offline for an hour or is under 30% battery. It repeats each morning at 09:00 until fixed, can be snoozed for a day or a week from the push, and also shows as a red card on Home.

### Holidays

- **[Holiday decorations](https://github.com/johnkoht/hassio-config/tree/master/packages/holidays)**: in season, the front yard decorations (`switch.front_yard_holiday_decorations`, one group of four outdoor plugs shared by Halloween and Christmas) run on a schedule: Halloween from morning to night, Christmas from evening to bedtime. Also, the Halloween colors (`scene.halloween_front_yard_spots`) go onto the front yard Hue spots when the accent lights come on. The plugs that power the Hue spots are never automated. Notes in [LEARNINGS](../packages/holidays/LEARNINGS.md).

### Notifications & Reminders

- **[Announcing when somebody is at the grocery store](https://github.com/johnkoht/hassio-config/blob/master/packages/places/grocery_store_announcement.yaml)**: whenever somebody is at a grocery store, a TTS message will broadcast across the house to let everybody know...in case I need some more Oreos, ya know?
- **[Reminders](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders)**: Most of our calendars are integrated into HA and used for TTS reminders. For example birthdays, famliy calendar events, garbage day, robot vacuum maintenance, and much more.
- **[Morning Update for the Family](https://github.com/johnkoht/hassio-config/blob/master/packages/reminders/morning_update.yaml)**: Every morning, a TTS message is broadcast at just the right time (or pretty close). This message contains weather info, school, calendar events, and much more.
- **[Push notification links](https://github.com/johnkoht/hassio-config/blob/master/packages/general_notifications.yaml)**: tapping a push should open the screen that helps. `script.general_notification` takes a `url` (a Kohbo path such as a view, or a view plus a popup) and sends it to iPhones as `url` and to Android as `clickAction`; with no url it sends neither. A test (`tests/test_notification_deep_links.py`) reads the dashboard and fails if a push links to a view or popup that does not exist. Every push either carries a link or is on a short exempt list with a reason (`tests/fixtures/notification_url_exempt.yaml`), and the test fails on a new push that is neither. `plans/notification-deep-links/audit.md` lists them.
- **[Medication refill alerts](https://github.com/johnkoht/hassio-config/tree/master/packages/reminders/medication_refill)**: Nino's medication supply is counted down by each confirmed dose. Under a week left, a time-sensitive push repeats each morning and the morning announcement mentions it; under 3 days it becomes a critical phone push. The push has +15 and +30 day refill buttons. See [People](PEOPLE.md#medication-stock).
- **[Train delay alerts](https://github.com/johnkoht/hassio-config/blob/master/packages/people/cristina/commute/cristina_train_delay_alert.yaml)**: a push when a commute train is running 5+ minutes late or is cancelled, once per train, cleared when it's back on time.
- **[John's Daily Report](https://github.com/johnkoht/hassio-config/blob/master/packages/people/john/daily_report/john_daily_report.yaml)**: every morning when I start my work day, I get a TTS notification in the office that tells me about my day, next meeting, sleep score, and more.

### Miscellaneous

- **[Vacuum my office when I drop the dog at daycare](https://github.com/johnkoht/hassio-config/blob/master/packages/vacuums/main_level/vacuums_clean_office_when_dog_is_at_daycare.yaml)**: The dog stays in my office and I'm lazy, so I send the robot vacuum to clean whenever I drop the dog off at daycare.
- **[Sleep music](https://github.com/johnkoht/hassio-config/tree/master/packages/ninos_room/media)**: once Nino is in bed with the lights down, his speaker starts a sleep playlist on shuffle. It stops when he gets up, but only if the automation started it. There's a toggle on his bedroom dashboard.
- **[Weather automations](https://github.com/johnkoht/hassio-config/tree/master/packages/weather)**: a bunch of weather related automations for severe weather, air quality, etc.
