# Devices

[Back to main README](../README.md)

This document contains all the hardware devices used in my Home Assistant setup.

## Menu

[Hubs](#hubs) | [Lighting](#lighting) | [Climate & Weather](#climate) | [Outlet, Switches, & Repeaters](#outlets) | [Locks](#locks) | [Garage Doors](#garage) | [Voice](#voice) | [Media](#media) | [Sensors](#sensors) | [Cameras](#cameras) | [Vacuum](#vacuum) | [Energy](#energy) | [Lawn & Garden](#lawn) | [Security](#security) | [Network](#network) | [Servers](#servers) |

## Hubs

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [HUSBZB-1](https://a.co/d/2AWruQV) | 1 | USB | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js/) | Used to control Z-Wave devices. |
| [ZWA-2](https://www.home-assistant.io/connect/zwa-2/) | 1 | USB-C | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js/) | Slowly migrating to ZWA-2. Z-Wave JS UI is hosted on a different VM |
| [ZigStar UZG-01](https://uzg.zig-star.com/product/) | 1 | Ethernet / POE | [ZHA](https://www.home-assistant.io/integrations/zha/) | Used to control Zigbee devices. |
| [Hue Hub](https://a.co/d/jhxXDpy) | 1 | Ethernet | [Philips Hue](https://www.home-assistant.io/components/hue/) | Used to control all Philip Hue products (lights, motion sensors, switches) - slowly deprecating |
| [Lutron Caseta Smart Bridge](https://a.co/d/56Hyw8D) | 2 | Ethernet | [Lutron Caséta](https://www.home-assistant.io/integrations/lutron_caseta) | Controls Lutron Caseta light switches, dimmers, and Pico remotes |

## Lighting

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
| [Enbrighten Zigbee Dimmer QuickFit 43080](https://a.co/d/ilngexF) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/)  | Smart on / off light switches |
| [Enbrighten Zigbee QuickFit 43078](https://a.co/d/boxstCr) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/)  | Smart on / off light switches |
| [Inovelli Blue Series Smart Dimmer](https://inovelli.com/collections/inovelli-blue-series/products/zigbee-matter-blue-series-smart-2-1-on-off-dimmer-switch) | 1 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart Dimmer Switch |


## Climate & Weather

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Google Nest Learning Thermostat](https://a.co/d/eFNSURb) | 2 | WiFi | [Google Nest](https://www.home-assistant.io/integrations/nest/) | Thermostats for main and upper levels |
| [Aqara Temperature and Humidity Sensor](https://a.co/d/b1M2cvC) | 12 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Provides-specific room temperature and humidity reporting |
| [Awair Element](https://www.getawair.com/products/element) | 7 | Local API | [Awair](https://www.home-assistant.io/integrations/awair/) | Monitors air quality |
| [Tempest Weather Station](https://tempest.earth/tempest-home-weather-system/) | 1 | Local | [WeatherFlow](https://www.home-assistant.io/integrations/weatherflow/) | Local weather station |
| [Ecobee Essential](https://www.ecobee.com/en-us/smart-thermostats/smart-thermostat-essential/) | 6 | WiFi | [Ecobee](https://www.home-assistant.io/integrations/ecobee) | Radiant floor heating thermostat |
| [Winix Air Purifier C545](https://www.winixamerica.com/product/certified-refurbished-c545-air-purifier/) | 4 | WiFi | [Winix (HACS)](https://github.com/iprak/winix) | Air Purifiers |
| [Winix Air Purifier C610](https://www.winixamerica.com/product/c610-refurbished/) | 3 | WiFi | [Winix (HACS)](https://github.com/iprak/winix) | Air Purifiers |


## Outlets, Switches, & Repeaters

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aoetec Smart Switch 7](https://a.co/d/4vYQQ3J) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Utilized to make my dumb washer (2) and dryer smart ([see Phil Hawthorne's blog post](https://philhawthorne.com/making-dumb-dishwashers-and-washing-machines-smart-alerts-when-the-dishes-and-clothes-are-cleaned/)) |
| [Aqara Smart Plug](https://a.co/d/8I8Xggp) | 8 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control various devices like space heaters, Christmas lights/tree, etc. I also have a couple of these specifically to extend the mesh network. |
| [IKEA Trådfri Smart Outlet](https://a.co/d/eOCkQjT) | 5 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet used to control random devices, currently Christmas lights and a space heater. |
| [THIRDREALITY ZigBee Smart Plug with Energy Monitoring](https://a.co/d/flUVOir) | 12 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Smart outlet, just trying these out |
| [Aeotec Range Extender Zi](https://aeotec.com/products/aeotec-range-extender-zi/) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Zigbee range extender to help stabilize my network. |


## Locks

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Level Lock](https://level.co/) | 1 | Bluetooth | [Bluetooth Proxy](https://www.home-assistant.io/integrations/bluetooth/) | Replaced my August with this. It works okay. |
| [Yale Assure Lever Lock with Z-Wave](https://a.co/d/j12OMGb) | 1 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Garage door entry lock |

## Garage Doors

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [ratgdo](https://paulwieland.github.io/ratgdo/) | 3 | Wi-Fi | [MQTT](https://www.home-assistant.io/integrations/mqtt/) | Local MQTT & dry contact control over garage doors |

## Voice Assistant

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Amazon Echo Dot](https://a.co/d/40y9K6n) | 3 | Wi-Fi | [Home Assistant Cloud](https://www.home-assistant.io/cloud/) | Audio only Voice Assistant |
| [Amazon Echo Show 8](https://a.co/d/666eZqh) | 1 | Wi-Fi | [Home Assistant Cloud](https://www.home-assistant.io/cloud/) |Voice Assistant with display |
| [Home Assistant Voice Preview](https://www.home-assistant.io/voice-pe/) | 2 | Wi-FI | [Home Assistant Cloud](https://www.home-assistant.io/cloud/) | Currently just experimenting with this, but looks promising |

## Media

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Sonos Amp](https://a.co/d/b4xG58W) | 6 | Ethernet | [Sonos](https://www.home-assistant.io/components/media_player.sonos/) | Audio playback and Home Assistant TTS |
| [Sonos Port](https://a.co/d/fTuZPDU) | 3 | Ethernet | [Sonos](https://www.home-assistant.io/components/media_player.sonos/) | Audio playback and Home Assistant TTS. One port controls an amp to a 5.1 speaker system in the Playroom, and the other powers the outdoor Sonance system. |
| [Sonance Patio Series 8x2](https://www.sonance.com/outdoor/patio-series) | 1 | Audio Cables | | Outdoor audio system around the pool |
| [Sonance Mariner 64](https://www.sonance.com/outdoor/rocks-mariners-extreme/mariners-medium) | 2 | Audio Cables | | Outdoor audio system in the gazebo |
| Sony Bravia SmartTV | 1 | Ethernet | [Sony Bravia TV](https://www.home-assistant.io/integrations/braviatv/) | Family room TV |
| [TCL 75-Inch Q7 QLED 4K Smart Google TV](https://a.co/d/28XUorw) | 1 | Ethernet | [Android TV Remote](https://www.home-assistant.io/integrations/androidtv_remote) | Basement TV |

The Sonos Amps are super expensive, but I found some _much_ cheaper, lightly used, or open boxes from OfferUp and FB marketplace.

## Sensors

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Trisensor](https://a.co/d/aBDiA55) | 3 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | Motion, temperature and illuminance |
| [Aqara Motion Sensor](https://a.co/d/cJdMbla) | 26 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Motion and Light Level sensor used to automate around motion events and current room brightness. |
| [Aeotec Multipurpose Sensor](https://a.co/d/4crXFL6) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Door sensor for kids bedroom, includes temperature readings. |
| [XFINITY Security Visonic ZigBee Door Window Sensor](https://www.ebay.com/itm/203254885008) | 13 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Internal door sensors used for occupancy and automations. One is used for the fridge since it doesn't beep when left open. |
| [Aqara Water Leak Sensor](https://a.co/d/fWywZmF) | 2 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors in the basement |
| [Aeotec Water Leak Sensor](https://a.co/d/cStIB4z) | 5 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Water sensors for the sinks and laundry room. |
| [Aqara Door and Window Sensor](https://a.co/d/1vx2SIL) | 7 | Zigbee | [ZHA](https://www.home-assistant.io/integrations/zha/) | Window magnetic open/close sensors |
| [Aqara FP2](https://www.aqara.com/us/product/presence-sensor-fp2/) | 3 | Homekit | [Homekit bridge](https://www.home-assistant.io/integrations/homekit/) | mmWave presence detection |
| [Everything Presence Lite](https://shop.everythingsmart.io/en-us/products/everything-presence-lite) | 2 | ESPHome | [ESPHome](https://www.home-assistant.io/integrations/esphome/) | mmWave presence detection |
| [Bed Occupancy Sensor](https://community.home-assistant.io/t/fsr-the-best-bed-occupancy-sensor/365795) | 3 | ESPHome | [ESPHome](https://www.home-assistant.io/integrations/esphome/) | Force sensitive resistor sensor to detect bed occupancy |
| [Lafaer Wireless Human Presence Sensor](https://lafaer.co/products/human-presence-sensor-lwr01) | 2 | Matter | [Matter](https://www.home-assistant.io/integrations/matter) | Testing these out |

## Cameras

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi G4 Bullet](https://a.co/d/hqaAlr3) | 4 | Ethernet/PoE | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 1440p PoE cameras around the house |
| [Ubiquiti UniFi Protect G4 Doorbell Pro PoE](https://a.co/d/1i8B5Y2) | 1 | Ethernet/PoE | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | Front door doorbell camera |
| [Ubiquiti Unifi AI Pro](https://store.ui.com/us/en/pro/category/all-cameras-nvrs/products/uvc-ai-pro) | 1 | Ethernet/PoE | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 4K Camera looking down the driveway and front of the house |
| [Ubiquiti Unifi G5 Turret Ultra](https://store.ui.com/us/en/category/cameras-dome-turret/products/uvc-g5-turret-ultra) | 1 | Ethernet/PoE | [Unifi Protect](https://www.home-assistant.io/integrations/unifiprotect/) | 2K Camera in the backyard |

## Vacuum

| [Go to Menu](#menu) | 

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Roborock S7 Vacuum and Mop](https://a.co/d/5Ka98xg) | 1 | Wi-Fi | [Xiaomi Miio](https://www.home-assistant.io/integrations/xiaomi_miio)| Smart Vacuum and Mop for the main floor |
| [Roborock Q7 Max+ Vacuum and Mop](https://a.co/d/a1rRzZ4) | 1 | Wi-Fi | [Xiaomi Miio](https://www.home-assistant.io/integrations/xiaomi_miio)| Smart Vacuum and Mop for the upper floor |

## Energy

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Aeotec Smart Home Energy Meter 5](https://a.co/d/giAIoJi) | 2 | Z-Wave | [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) | 200 Amp CT Clamps |



## Lawn & Garden
| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Rachio 3 Smart Sprinkler System](https://rachio.com/products/rachio-3/) | 1 | Cloud Push | [Rachio Integration](https://rachio.com/products/rachio-3/) | Smart sprinkler system |
| [Ecowitt Wh51 Soil Moisture Sensor](https://shop.ecowitt.com/products/wh51) | 12 | Local Push | [Ecowitt](https://www.home-assistant.io/integrations/ecowitt) | Soil moisture sensors around the yard and flower beds |

## Security
| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Konnected Smart Alarm Panel Pro](https://konnected.io/products/konnected-alarm-panel-pro-12-zone-kit) | 2 | WiFi | [ESPHome](https://www.home-assistant.io/integrations/esphome/) | Monitor hardwired security sensors |


## Network

| [Go to Menu](#menu) |

| Device  | Quantity | Connection | Home Assistant | Notes |
| ------------- | :---: | ------------- | ------------- | ------------- |
| [Ubiquiti Unifi Dream Machine Pro](https://a.co/d/h8PQdfZ) | 1 | SFP (2.5g) | [Unifi Network](https://www.home-assistant.io/integrations/unifi) | Unifi OS, switch and security gateway. UniFi Protect video surveillance NVR. Presence detection for non-household members and devices. |
| [Ubiquiti Unifi Aggregation Switch](https://store.ui.com/us/en/category/switching-aggregation/products/usw-aggregation) | 1 | SFP | [Unifi Network](https://www.home-assistant.io/integrations/unifi) | Aggregation switch for SFP connections |
| [Ubiquiti Network Video Recorder (NVR)](https://store.ui.com/us/en/category/cameras-nvr/products/unvr) | 1 | SFP | [Unifi Network](https://www.home-assistant.io/integrations/unifi) | Network Video Recorder for all cameras |
| [Ubiquiti Networks UniFi Switch PoE - 48 Ports (USW-48-POE)](https://store.ui.com/us/en/collections/unifi-switching-standard-power-over-ethernet/products/usw-48-poe) | 1 | Ethernet | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Switch that connects to all room ethernet runs (non-critical devices) |
| [Ubiquiti Networks Unifi Switch 24 Enterprise PoE](https://store.ui.com/us/en/category/switching-professional/products/usw-enterprise-24-poe) | 1 | SFP | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Primary swiitch for Home Lab, network, and cameras |
| [Ubiquiti Networks UniFi Switch PRO PoE - 24 Ports (USW-Pro-24-POE)](https://a.co/d/1F1iUsA) | 1 | Ethernet | [Ubiquiti Unifi WAP](https://www.home-assistant.io/components/device_tracker.unifi/)| Media Network Switch. Upgraded to a 48 so moved this to manage my media rack |
| [Ubiquiti Networks UniFi Switch Lite 8 PoE (USW-Lite-8-PoE)](https://a.co/d/600W5KJ) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switches. Mostly used for the two G4 bullet cameras and an AP. |
| [Ubiquiti Networks UniFi USW-Flex-Mini (USW-Flex-Mini-5)](https://a.co/d/0xHbnSd) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional Network Switch for Hue and Lutron smart hubs. |
| [Ubiquiti Networks Unifi Switch Flex (USW-Flex)](https://a.co/d/10XP8Mi) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Additional PoE Network Switch that powers an AP and eventually more PoE cameras. |
| [Ubiquiti Networks UniFi in-Wall Access Point (UAP-IW-HD-US)](https://a.co/d/hPZd3j4) | 5 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi nanoHD (UAP-nanoHD-US)](https://a.co/d/5H1ZePB) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi Access Point AC Pro (UAP-AC-PRO-US)](https://store.ui.com/collections/unifi-network-wireless/products/uap-ac-pro) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wireless Access Point for interior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks UniFi Access Point WiFi 6 Long-Range (U6-LR-US)](https://a.co/d/1JAJFyC) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/)| Wireless Access Point for interior and exterior use. Presence detection for non-household members and devices. |
| [Ubiquiti Networks Unifi Mesh AP (UAP-AC-M-US)](https://a.co/d/333d9os) | 1 | Ethernet | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wired PoE Access Point that's outside in the backyard. Presence detection for non-household members and devices. |
| [Ubiquiti Networks Unifi Access Point U6 In-Wall](https://store.ui.com/us/en/category/all-wifi/products/u6-iw) | 2 | Ethernet/PoE | [Ubiquiti Unifi](https://www.home-assistant.io/components/device_tracker.unifi/) | Wired PoE Access Point |


## Servers

| [Go to Menu](#menu) |

| Hardware | Compute | Memory | Storage | Description |
| ------------- | :---: | :---: | ------------- | ------------- |
| Supermicro SCE826 12 Bay 2U Server | 24 Cores / 48 Threads | 192 GB | 6 x 12TB HDDs, 1 x 256 GB NVMe SSDs, 2 x 1TB NVMe SSDs | Runs proxmox with TrueNAS and a bunch of VMs (Paperless NGX, Immich, Grafana, Gramps, Hoarder, etc) |
| Supermicro 6018-TRTP+ 1U Server | 26 Cores / 52 Threads | 256 GB | 2 x 1.92 TB SSDs | AI stack (Ollama, Open WebUI, etc), Media Server, Authentik, Caddy External, Minecraft Server |
| Supermicro X11SSQ 1U Server (in a BSI chassis) | 4 Cores / 4 Threads | 48 GB | 2 x 1 TB NVMe SSDs (mirror), 256 GB NVMe boot SSD | New proxmox server that I'm migrating some of my smart home services |
| Supermicro X11SSQ 1U Server (in a BSI chassis) | 4 Cores / 4 Threads | 32 GB | 2 x 8 TB HDDs (mirror), 128 GB NVMe boot SSD | Proxmox Backup Server (PBS) |
