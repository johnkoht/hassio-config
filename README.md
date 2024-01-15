# Home Assistant Configuration

[Home Assistant](https://home-assistant.io/) is the core of my smart home system. This repo includes all the custom packages, sensors, and automations that power my house. It's a work in progress and is constantly evolving. 

## Deployment

Home Assistant OS is deployed as a VM in my Unraid server. It has access to 6 CPU threads and up to 8 GBs of memory. I also use [Nabu Casa](https://www.nabucasa.com/) for remote access and to support the project.

## Key Software
- [Home Assistant](https://home-assistant.io/)
- [Unraid](https://unraid.net/) VM and server
- [Mosquitto](https://mosquitto.org/) for the MQTT broker

## Architecture

My Home Assistant configuration is architected a bit differently than many other configs. I was heavily influenced by [Tinkerer's](https://github.com/DubhAd/Home-AssistantConfig) configuration, which I recommend you check out. Instead of large, complex automations that do many things, my configuration is split into hundreds of smaller automations, scripts, and sensors. For example, many home assistant setups have an automation that turns offs all the lights in the house when it's not occupied. In my configuration, when the house is not occupied, an automation for each room is triggered that effectively turns that room off, including the lights, media, and anything else that shouldn't be on.

You can think of my smart home as a collection of smart rooms. Most rooms have an `input_select` that manages the state of the room. For example, [my office](https://github.com/johnkoht/hassio-config/blob/master/packages/office/office_state.yaml) has the following states:

- **Auto**: Automations are enabled, i.e., motion lighting, media, etc.
- **DnD**: Do Not Disturb turns on a red light outside my Office, turns off voice notifications, and turns off any music playing in the Office. 
- **Off**: No automations, just a regular, dumb room.

Automations within a room are determined and controlled by the room's state and available automations. The house also has state (see [house.yaml](https://github.com/johnkoht/hassio-config/blob/master/input_select/house/house.yaml)). The house also has a variety of meta properties that are controlled by `input_booleans`, for example:

- **House Occupied** (`input_boolean.house_occupied`): This boolean is triggered by people being home or away. Check out [this automation](https://github.com/johnkoht/hassio-config/blob/master/automation/house/house_occupied.yaml) for reference. A bunch of other automations are triggered by changes in this boolean. For example, the state of the house will change to `Away` when not occupied, and other rooms will also turn off.
- **Guest Mode** (`input_boolean.guest_mode`): This boolean is triggered when guests are present. Various automations check to see if guest mode is enabled to activate or modify conditions.
- **Quiet Mode** (`input_boolean.quiet_mode`): If any of the kids are sleeping, this boolean will turn on and change the house state to "Quiet." For example, this will prevent the doorbell from ringing and lower the TTS device volumes.
- **Lighting Automations** (`input_boolean.lighting_automations`): This boolean will enable or disable lighting automations across the house. If this is off, then no lighting automations should trigger. Some rooms have their own property to manage lighting automations within the room.
- **Speech Notifications** (`input_boolean.speech_notifications`): A way to globally turn on/off voice notifications throughout the house.
- **Bad Weather** (`input_boolean.bad_weather`): Triggered when the weather outside isn't great. Various rooms will react to this boolean. For example, the foyer chandelier will turn on when the weather is bad since it gets dark by the stairs. 

Some of these booleans have two automations to manage state: one that is triggered and turns the boolean on and another that turns the boolean off. For example, check out the [bad weather automations](https://github.com/johnkoht/hassio-config/tree/master/automation/weather). Some of these are only changed through the UI. For example, speech and lighting automations are rarely used but are helpful when I need to turn them off without much effort. 

## Presence Detection
Presence detection is an integral part of my home automation. There are two layers to presence: home presence and room presence. Basically, is a person home, and if so, which room are they in.

### Home Presence
For home presence, I use the [Person integration](https://www.home-assistant.io/integrations/person/) from Home Assistant to combine various device trackers. Currently, I'm using the following:

- Home Assistant [Companion App](https://companion.home-assistant.io/) for GPS-based device tracking
- [UniFi Network](https://www.home-assistant.io/integrations/unifi/) for network-based device tracking
- [Nmap Tracker](https://www.home-assistant.io/integrations/nmap_tracker) for network-based device tracking
- [iPhone Detect](https://github.com/mudape/iphonedetect)  for network-based device tracking

The companion app and iPhone Detect are usually the most accurate for my wife and me. I also have a Bayesian sensor for presence detection for us. I use the three network-based trackers for regular guests, and they work fairly accurately. These trackers will help reliably determine who is home or if the house is not occupied. 

I adopted Phil Hawthorne's methodology for [making presence detection not so binary](https://philhawthorne.com/making-home-assistants-presence-detection-not-so-binary/). Each person has an input_boolean that defines whether they are home or not, but there also is an input_select that clarifies the state as: "Home," "Away," "Just Arrived," or "Just Left." This is helpful when somebody leaves and quickly returns.

### Room Presence
I use [ESPresense](https://espresense.com/) for room presence detection. I have about 15 BLE base stations spread out throughout the house. ESPresense is a pretty great tool, but it's sometimes not the most accurate. It took a lot of tweaking to get fairly consistent results. But now that it's working correctly, it's pretty great. The main benefit of room presence is avoiding turning off the lights/room if there is no motion for a while. So if I'm sitting at the kitchen table reading something and barely moving, the kitchen won't turn off if it detects my phone.

### Zone Presence
Home Assistant has a great [Zone](https://www.home-assistant.io/integrations/zone/) integration that lets you identify zones to track. I haven't done as much as I'd like to do here, but I have some useful automations to notify the house occupants whenever somebody arrives or leaves work. I'm working on tracking school dropoffs, grocery store visits, and more.


## Anatomy of a Room
The most advanced room in my house is [my Office](https://github.com/johnkoht/hassio-config/tree/master/packages/office) (mostly because nobody complains when I experiment). As I mentioned, the Office has three states: Auto, Off, and DnD. When the Office is in Auto state, automations will be active. So when somebody walks into the room and motion is detected, the room will become occupied. If the rooms are occupied, here are some automations that can be triggered:

- If it's dark in the room, the lights will turn on
- When the room becomes bright enough, the lights will turn off
- Music will play automatically when John is working
- Music will turn off when John is on a call
- Adaptive lighting will turn on / off

The Office state can transition to DnD when John's on a call. This state will change the way the automations work, for example:

- A red light will go on outside the Office to let people know
- Speech notifications will be disabled
- The El Gato camera light will turn on (if my laptop camera is active)
- Music will turn off (if playing)

When the Office is no longer occupied, a few automations will trigger to turn off the lights and music. 

## Anatomy of a Person
I have some person-specific automations that are extremely useful, but this is an area of opportunity within my setup. Here are a few examples:

- **Sleep Presence**: I don't have a smart bed (yet), so I can't accurately observe if we're sleeping (or in bed). To address this, I have a Bayesian sensor that calculates the probability that I"m sleeping. This takes information like the time of the day, if the bedroom door is closed, lights are off, room presence is detected, and our phones are plugged in. These Bayesian sensors trigger booleans, which then trigger other house-wide automations.
- **Do Not Disturb**: I have an input_boolean that identifies if I'm in DnD mode. For example, if my laptop camera is on, my calendar is active, and some other conditions are met, my DnD boolean will turn on. Likewise, if I'm in the Office, the Office will transition to DnD state. 
- **John Home**: When I arrive home, a boolean is turned on. This boolean can trigger other scripts and automations. For example, when I arrive in my car, the garage will open, and the lights will turn on in the garage and mudroom. Also, the house will announce my arrival. Likewise, it announces my departure. 


## Speech Notifications / TTS
Speech notifications give the house a personality. I have a bunch of Sonos Amps that power in-ceiling speakers throughout the house. Automations and home states can broadcast messages throughout the house via TTS. Speech notifications are only broadcast in rooms that are occupied. So if I'm in the Office, my wife is in the bedroom, and our kids are in the Playroom, it will announce in all three rooms. For example, when I leave the house, an automation will broadcast a voice notification to let people know. Likewise, when I arrive at work, a speech notification will trigger. Most regular guests are announced. There are a lot of other announcements as well, including:

- Exterior lights turning on/off
- Quiet mode is enabled
- Announce arrival and departure of family 
- Washer or Dryer is finished
- Kitchen fridge has been open too long
- School day announcement, dropoff/pickup reminders
- Calendar reminder (upcoming or next day)
- Commuting notifications (arrived at station, heading home, train five mins away)
- Garbage day
- Severe weather warnings


## <a name="devices">Devices</a>

### <a name="menu">Menu</a>
[Hubs](#hubs) | [Lighting](#lighting) | [Climate](#climate) | [Outlet & Switches](#outlets) | [Locks](#locks) | [Garage Doors](#garage) | [Voice](#voice) | [Media](#media) | [Sensors](#sensors) | [Cameras](#cameras) | [Vacuum](#vacuum) | [Energy](#energy) | [Network](#network) | 

## <a name="hubs">Hubs</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Nortek HubZ Controller](https://a.co/d/2AWruQV) | 1 | USB | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js/) [ZHA](https://www.home-assistant.io/integrations/zha/) | Used to control all Zigbee and Z-Wave devices. |
| [Hue Hub](https://a.co/d/jhxXDpy) | 2 | Ethernet | [Philips Hue](https://www.home-assistant.io/components/hue/) | Used to control all Philip Hue products (lights, motion sensors, switches) |
| [Lutron Caseta Smart Bridge](https://a.co/d/56Hyw8D) | 2 | Ethernet | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Controls Lutron Caseta light switches, dimmers, and Pico remotes |
| [myQ Chamberlain Smart Garage Hub](https://a.co/d/3Xdt5u4) | 2 | WiFi | [MyQ](https://www.home-assistant.io/integrations/myq) | Used to control the garage doors |

## <a name="lighting">Lighting</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Philips Hue BR30 White and Color](https://a.co/d/1dCtkFU) | 14 | Hue Hub (Zigbee) | [Philips Hue Light](https://www.home-assistant.io/components/light.hue/) | Color changing smart bulbs|
| [Philips Hue White A19 LED Smart Bulb](https://a.co/d/iKgG44w) | 2 | Hue Hub (Zigbee) | [Philips Hue Light](https://www.home-assistant.io/components/light.hue/) | Bedside lamps |
| [Philips Hue White A19 LED Smart Bulb](https://a.co/d/iKgG44w) | 2 | Hue Hub (Zigbee) | [Philips Hue Light](https://www.home-assistant.io/components/light.hue/) | Bedside lamps |
| [Philips Hue Gradient Ambiance Lightstrip](https://a.co/d/6Nmw8ew) | 9 | Hue Hub (Zigbee) | [Philips Hue Light](https://www.home-assistant.io/components/light.hue/) | Office shelves lighting |
| [Lutron Caseta Wireless Dimmer](https://a.co/d/0RrGOTN) | 26 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Smart dimmer switches that do not require a neutral wire|
| [Lutron Caseta Pico Wireless Dimmer Switch](https://a.co/d/2GGVlQF) | 21 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Decora wall mountable remote (that looks like a dimmer switch). Controls various lights |
| [Lutron Caseta Wireless Lighting Switch](https://a.co/d/5Tg1Qs8) | 1 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Smart on / off light switches |
| [Enbrighten Zigbee Dimmer QuickFit 43080](https://a.co/d/ilngexF) | 2 | Zigbee | [Jasco](https://www.home-
| [Enbrighten Zigbee QuickFit 43078](https://a.co/d/boxstCr) | 2 | Zigbee | [Jasco](https://www.home-assistant.io/integrations/jasco/) | Smart on / off light switches |assistant.io/integrations/jasco/) | Smart on / off light switches |


## <a name="climate">Climate</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Google Nest Learning Thermostat](https://a.co/d/eFNSURb) | 2 | WiFi | [Google Nest](https://www.home-assistant.io/integrations/nest/) | Thermostats for main and upper levels |
| [Aqara Temperature and Humidity Sensor](https://a.co/d/b1M2cvC) | 12 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Provides-specific room temperature and humidity reporting |
| [Awair Element](https://www.getawair.com/products/element) | 2 | Local API | [Awair](https://www.home-assistant.io/integrations/awair/) | Monitors air quality |

## <a name="outlets">Outlets & Switches</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aoetec Smart Switch 7](https://a.co/d/4vYQQ3J) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Utilized to make my dumb washer (2) and dryer smart ([see Phil Hawthorne's blog post](https://philhawthorne.com/making-dumb-dishwashers-and-washing-machines-smart-alerts-when-the-dishes-and-clothes-are-cleaned/)) |
| [Aqara Smart Plug](https://a.co/d/8I8Xggp) | 8 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control various devices like space heaters, Christmas lights/tree, etc. I also have a couple of these specifically to extend the mesh network. |
| [IKEA Trådfri Smart Outlet](https://a.co/d/eOCkQjT) | 5 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control random devices, currently Christmas lights and a space heater. |
| [Wemo Mini Smart Plug](https://a.co/d/ixGGnvO) | 3 | Wi-Fi | [Belkin WeMo](https://www.home-assistant.io/components/wemo/) | Smart outlets, but I don't really use these as they haven't been very reliable for me. |
| [THIRDREALITY ZigBee Smart Plug with Energy Monitoring]([https://a.co/d/ixGGnvO](https://a.co/d/flUVOir)) | 11 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet, just trying these out |


## <a name="locks">Locks</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [August Smart Lock Pro](https://a.co/d/6bLXSqm) | 3 | Wi-Fi | [MQTT](https://www.home-assistant.io/integrations/mqtt/) | Local MQTT & dry contact control over garage doors |


## <a name="garage">Garage Doors</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [ratgdo](https://paulwieland.github.io/ratgdo/) | 1 | Cloud Push | [August](https://www.home-assistant.io/integrations/august/) | Smart lock for the front door |

## <a name="voice">Voice Assistant</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Amazon Echo Dot](https://a.co/d/40y9K6n) | 3 | Wi-Fi | [Home Assistant Cloud](https://www.home-assistant.io/cloud/) | Audio only Voice Assistant |
| [Amazon Echo Show 8](https://a.co/d/666eZqh) | 1 | Wi-Fi | [Home Assistant Cloud](https://www.home-assistant.io/cloud/) |Voice Assistant with display |

## <a name="media">Media</a>

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Sonos Amp](https://a.co/d/b4xG58W) | 6 | Ethernet | [Sonos](https://www.home-assistant.io/components/media_player.sonos/) | Audio playback and Home Assistant TTS |
| [Sonos Port](https://a.co/d/fTuZPDU) | 3 | Ethernet | [Sonos](https://www.home-assistant.io/components/media_player.sonos/) | Audio playback and Home Assistant TTS. One port controls an amp to a 5.1 speaker system in the Playroom, and the other powers the outdoor Sonance system. |
| [Sonance Patio Series 8x2](https://www.sonance.com/outdoor/patio-series) | 1 | Audio Cables | | Outdoor audio system around the pool |
| [Sonance Mariner 64](https://www.sonance.com/outdoor/rocks-mariners-extreme/mariners-medium) | 2 | Audio Cables | | Outdoor audio system in the gazebo |
| Sony Bravia SmartTV | 1 | Ethernet | [Sony Bravia TV](https://www.home-assistant.io/integrations/braviatv/) | Family room TV |
| [TCL 75-Inch Q7 QLED 4K Smart Google TV](https://a.co/d/28XUorw) | 1 | Ethernet | [Android TV Remote](https://www.home-assistant.io/integrations/androidtv_remote) | Basement TV |

The Sonos Amps are super expensive, but I found some _much_ cheaper, lightly used, or open boxes from OfferUp.

## <a name="sensors">Sensors</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Trisensor](https://a.co/d/aBDiA55) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Motion, temperature and illuminance |
| [Aqara Motion Sensor](https://a.co/d/cJdMbla) | 26 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Motion and Light Level sensor used to automate around motion events and current room brightness. |
| [Aeotec Multipurpose Sensor](https://a.co/d/4crXFL6) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Door sensor for kids bedroom, includes temperature readings. |
| [XFINITY Security Visonic ZigBee Door Window Sensor](https://www.ebay.com/itm/203254885008) | 13 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Internal door sensors used for occupancy and automations. One is used for the fridge since it doesn't beep when left open. |
| [Aqara Water Leak Sensor](https://a.co/d/fWywZmF) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors in the basement | [Aeotec Water Leak Sensor](https://a.co/d/cStIB4z) | 4 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors for the sinks and laundry room. |
| [Aeotec Water Leak Sensor](https://a.co/d/cStIB4z) | 5 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors for the sinks and laundry room. |
| [Aqara Door and Window Sensor](https://a.co/d/1vx2SIL) | 7 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Window magnetic open/close sensors |


## <a name="cameras">Cameras</a>

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi G4 Bullet](https://a.co/d/hqaAlr3) | 2 | Ethernet | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 1440p POE Camera. |
| [Ubiquiti UniFi Protect G4 Doorbell (UVC-G4-DoorBell)](https://a.co/d/1i8B5Y2) | 1 | WiFI | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | Front door doorbell camera |
| [Ubiquiti Unifi AI Pro](https://store.ui.com/us/en/pro/category/all-cameras-nvrs/products/uvc-ai-pro) | 1 | Ethernet | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 4K Camera looking down the driveway and front of the house |

## <a name="vacuum">Vacuum</a>

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Roborock S7 Vacuum and Mop](https://a.co/d/5Ka98xg) | 1 | Wi-Fi | [Xiaomi Miio](https://www.home-assistant.io/integrations/xiaomi_miio)| Smart Vacuum and Mop for the main floor |
| [Roborock Q7 Max+ Vacuum and Mop](https://a.co/d/a1rRzZ4) | 1 | Wi-Fi | [Xiaomi Miio](https://www.home-assistant.io/integrations/xiaomi_miio)| Smart Vacuum and Mop for the upper floor |

## <a name="energy">Energy</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Smart Home Energy Meter 5](https://a.co/d/giAIoJi) | 2 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | 200 Amp CT Clamps. I have one installed and the other sitting in a cabinet waiting to be installed |

## <a name="network">Network</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi Dream Machine Pro](https://a.co/d/h8PQdfZ) | 1 | Ethernet | [Unifi Network](https://www.home-assistant.io/integrations/unifi) | Unifi OS, switch and security gateway. UniFi Protect video surveillance NVR. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi Switch PoE - 48 Ports (USW-48-POE)](https://store.ui.com/us/en/collections/unifi-switching-standard-power-over-ethernet/products/usw-48-poe) | 1 | Ethernet | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Primary Network Switch. Presence detection for non-household members and devices |
| [Ubiquiti Networks UniFi Switch PRO PoE - 24 Ports (USW-Pro-24-POE)](https://a.co/d/1F1iUsA) | 1 | Ethernet | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Media Network Switch. Upgraded to a 48 so moved this to manage my media rack |
| [Ubiquiti Networks UniFi Switch Lite 8 PoE (USW-Lite-8-PoE)](https://a.co/d/600W5KJ) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switches. Mostly used for the two G4 bullet cameras and an AP. |
| [Ubiquiti Networks UniFi USW-Flex-Mini (USW-Flex-Mini-5)](https://a.co/d/0xHbnSd) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional Network Switch for Hue and Lutron smart hubs. |
| [Ubiquiti Networks Unifi Switch Flex (USW-Flex)](https://a.co/d/10XP8Mi) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switch that powers an AP and eventually more PoE cameras. |
| [Ubiquiti Networks UniFi in-Wall Access Point (UAP-IW-HD-US)](https://a.co/d/hPZd3j4) | 5 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi nanoHD (UAP-nanoHD-US)](https://a.co/d/5H1ZePB) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi Access Point AC Pro (UAP-AC-PRO-US)](https://store.ui.com/collections/unifi-network-wireless/products/uap-ac-pro) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi Access Point WiFi 6 Long-Range (U6-LR-US)](https://a.co/d/1JAJFyC) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Wireless Access Point for interior and exterior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks Unifi Mesh AP (UAP-AC-M-US)](https://a.co/d/333d9os) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wired PoE Access Point that's outside in the backyard. Presence detection for non-household members and devices. |
