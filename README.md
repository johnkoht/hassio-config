# Home Assistant Configuration

[Home Assistant](https://home-assistant.io/) is the core of my smart home system. This repo includes all of the custom packages, sensors, and automations that power my house. It's a work in progress and is constantly evolving. 

## Deployment

Home Assistant OS is deployed as a VM in my Unraid server. It has access to 6 CPU threads and up to 8 GBs of memory. I also use [Nabu Casa](https://www.nabucasa.com/) for remote access and to support the project.

## Key Software
- [Home Assistant](https://home-assistant.io/)
- [Unraid](https://unraid.net/) VM and server
- [Mosquitto](https://mosquitto.org/) for the MQTT broker

## Devices

## Menu
- [Hubs](#hubs)
- [Lighting](#lighting)
- [Climate](#climate)
- [Outlet & Switches](#outlets)
- [Locks](#locks)
- [Voice](#voice)
- [Media](#media)
- [Sensors](#sensors)
- [Cameras](#cameras)
- [Vacuum](#vacuum)
- [Energy](#energy)
- [Network](#network)

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
| [Lutron Caseta Wireless Dimmer](https://a.co/d/0RrGOTN) | 25 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Smart dimmer switches that do not require a neutral wire|
| [Lutron Caseta Pico Wireless Dimmer Switch](https://a.co/d/2GGVlQF) | 21 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Decora wall mountable remote (that looks like a dimmer switch). Controls various lights |
| [Lutron Caseta Wireless Lighting Switch](https://a.co/d/5Tg1Qs8) | 1 | Lutron Smart Bridge | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Smart on / off light switches |


## <a name="climate">Climate</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Google Nest Learning Thermostat](https://a.co/d/eFNSURb) | 2 | WiFi | [Google Nest](https://www.home-assistant.io/integrations/nest/) | Thermostats for main and upper levels |
| [Aqara Temperature and Humidity Sensor](https://a.co/d/b1M2cvC) | 8 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Provides-specific room temperature and humidity reporting |

## <a name="outlets">Outlets & Switches</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aoetec Smart Switch 7](https://a.co/d/4vYQQ3J) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Utilized to make my dumb washer (2) and dryer smart ([see Phil Hawthorne's blog post](https://philhawthorne.com/making-dumb-dishwashers-and-washing-machines-smart-alerts-when-the-dishes-and-clothes-are-cleaned/)) |
| [Aqara Smart Plug](https://a.co/d/8I8Xggp) | 8 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control various devices like space heaters, Christmas lights/tree, etc. I also have a couple of these specifically to extend the mesh network. |
| [IKEA Trådfri Smart Outlet](https://a.co/d/eOCkQjT) | 5 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control random devices, currently Christmas lights and a space heater. |
| [Wemo Mini Smart Plug](https://a.co/d/ixGGnvO) | 3 | Wi-Fi | [Belkin WeMo](https://www.home-assistant.io/components/wemo/) | Smart outlets, but I don't really use these as they haven't been very reliable for me. |


## <a name="locks">Locks</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [August Smart Lock Pro](https://a.co/d/6bLXSqm) | 1 | Cloud Push | [August](https://www.home-assistant.io/integrations/august/) | Smart lock for the front door |

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
| [Sonos Port](https://a.co/d/fTuZPDU) | 2 | Ethernet | [Sonos](https://www.home-assistant.io/components/media_player.sonos/) | Audio playback and Home Assistant TTS. One port controls an amp to a 5.1 speaker system in the Playroom, the other powers the outdoor Sonance system. |
| Sony Bravia SmartTV | 1 | WiFi | [Sony Bravia TV](https://www.home-assistant.io/integrations/braviatv/) | Family room TV |

The Sonos Amps are super expensive, but I was able to find some _much_ cheaper light used or open boxes from OfferUp.

## <a name="sensors">Sensors</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Trisensor](https://a.co/d/aBDiA55) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Motion, temperature and illuminance |
| [Aqara Motion Sensor](https://a.co/d/cJdMbla) | 14 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Motion and Light Level sensor used to automate around motion events and current room brightness. |
| [Aeotec Multipurpose Sensor](https://a.co/d/4crXFL6) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Door sensor for kids bedroom, includes temperature readings. |
| [XFINITY Security Visonic ZigBee Door Window Sensor](https://www.ebay.com/itm/203254885008) | 13 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Internal door sensors used for occupancy and automations. One is used for the fridge since it doesn't beep when left open. |
| [Aqara Water Leak Sensor](https://a.co/d/fWywZmF) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors in the basement | [Aeotec Water Leak Sensor](https://a.co/d/cStIB4z) | 4 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors for the sinks and laundry room. |

## <a name="cameras">Cameras</a>

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi G4 Bullet](https://a.co/d/hqaAlr3) | 2 | Ethernet | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 1440p POE Camera. |
| [Ubiquiti UniFi Protect G4 Doorbell (UVC-G4-DoorBell)](https://a.co/d/1i8B5Y2) | 1 | WiFI | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | Front door doorbell camera |

## <a name="vacuum">Vacuum</a>

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Roborock S7 Vacuum and Mop](https://a.co/d/5Ka98xg) | 1 | Wi-Fi | [Xiaomi Miio](https://www.home-assistant.io/integrations/xiaomi_miio)| Smart Vacuum and Mop |

## <a name="energy">Energy</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Smart Home Energy Meter 5](https://a.co/d/giAIoJi) | 2 | Z-Wave [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | 200 Amp CT Clamps. I have one installed and the other sitting in a cabinet waiting to be installed |

## <a name="network">Network</a>

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi Dream Machine Pro](https://a.co/d/h8PQdfZ) | 1 | Ethernet | [Unifi Network](https://www.home-assistant.io/integrations/unifi) | Unifi OS, switch and security gateway. UniFi Protect video surveillance NVR. Presence detection for non household members and devices. |
| [Ubiquiti Networks UniFi Switch PRO PoE - 24 Ports (USW-Pro-24-POE)](https://a.co/d/1F1iUsA) | 1 | Ethernet | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Primary Network Switch. Presence detection for non household members and devices |
| [Ubiquiti Networks UniFi Switch Lite 8 PoE (USW-Lite-8-PoE)](https://a.co/d/600W5KJ) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switches. Mostly used for the the two G4 bullet cameras and an AP. |
| [Ubiquiti Networks UniFi USW-Flex-Mini (USW-Flex-Mini-5)](https://a.co/d/0xHbnSd) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional Network Switch for Hue and Lutron smart hubs. |
| [Ubiquiti Networks Unifi Switch Flex (USW-Flex)](https://a.co/d/10XP8Mi) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switch that powers an AP and eventually more PoE cameras. |
| [Ubiquiti Networks UniFi in-Wall Access Point (UAP-IW-HD-US)](https://a.co/d/hPZd3j4) | 3 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non household members and devices. |
| [Ubiquiti Networks UniFi nanoHD (UAP-nanoHD-US)](https://a.co/d/5H1ZePB) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non household members and devices. |
| [Ubiquiti Networks UniFi Access Point AC Pro (UAP-AC-PRO-US)](https://store.ui.com/collections/unifi-network-wireless/products/uap-ac-pro) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non household members and devices. |
| [Ubiquiti Networks UniFi Access Point WiFi 6 Long-Range (U6-LR-US)](https://a.co/d/1JAJFyC) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Wireless Access Point for interior and exterior use. Presence detection for non household members and devices. |
| [Ubiquiti Networks Unifi Mesh AP (UAP-AC-M-US)](https://a.co/d/333d9os) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wired PoE Access Point that's outside in the backyard. Presence detection for non household members and devices. |
