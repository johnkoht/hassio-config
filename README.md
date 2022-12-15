# Home Assistant Configuration

[Home Assistant](https://home-assistant.io/) is the core of my smart home system. This repo includes all of the custom packages, sensors, and automations that power my house. It's a work in progress and is constantly evolving. 

## Deployment

Home Assistant OS is deployed as a VM in my Unraid server. It has access to 6 CPU threads and up to 8 GBs of memory. I also use [Nabu Casa](https://www.nabucasa.com/) for remote access and to support the project.

## Key Software
- [Home Assistant](https://home-assistant.io/)
- [Unraid](https://unraid.net/) VM and server
- [Mosquitto](https://mosquitto.org/) for the MQTT broker

## Devices

## Zigbee and Z-Wave
I use [ZHA](https://www.home-assistant.io/integrations/zha/) for Zigbee and [Z-Wave JS](https://www.home-assistant.io/integrations/zwave_js) for Z-Wave. Most of my devices are Zigbee as I've had much more success buiding out a Zigbee mesh network. 

## Lighting
- [Hue BR32 Recessed Bulbs](https://www.philips-hue.com/en-us/p/hue-white-and-color-ambiance-br30---e26-smart-bulb/046677577957) I have a few of these throughout the house like the playroom, my office, and one of my kids room. Each bulb is a device in Home Assistant and can be automated separately (if one so desired)
- [Lutron Caseta Dimmer Switches](https://www.amazon.com/Lutron-Wireless-Wallplate-Incandescent-PDW-6WCL-WH/dp/B07SJJBTYY) I have a bunch of Lutron Caseta dimmer switchecs and Picos throughout the house, mostly the main floor. 

## Media
- [Sonos Amps and Ports](https://www.sonos.com/en-us/shop/wireless-stereo-components) to power the in-ceiling speakers throughout the house.
- Amazon Echo Devices like [Echo Dot](https://www.amazon.com/gp/product/B07XJ8C8F5/ref=ppx_yo_dt_b_search_asin_image?ie=UTF8&psc=1)[Echo Show 8](https://www.amazon.com/gp/product/B07PF1Y28C/ref=ppx_yo_dt_b_search_asin_image?ie=UTF8&psc=1)
- [Spotify Integration](https://www.home-assistant.io/integrations/spotify/)