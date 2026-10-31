# Presence Detection

[Back to main README](../README.md)

Presence detection is an integral part of my home automation. There are two layers to presence: home presence and room presence. Basically, is a person home, and if so, which room are they in.

## Home Presence

For home presence, I use the [Person integration](https://www.home-assistant.io/integrations/person/) from Home Assistant to combine various device trackers. Currently, I'm using the following:

- Home Assistant [Companion App](https://companion.home-assistant.io/) for GPS-based device tracking
- [UniFi Network](https://www.home-assistant.io/integrations/unifi/) for network-based device tracking
- [Nmap Tracker](https://www.home-assistant.io/integrations/nmap_tracker) for network-based device tracking
- [iPhone Detect](https://github.com/mudape/iphonedetect)  for network-based device tracking

The companion app and iPhone Detect are usually the most accurate for my wife and me. I also have a Bayesian sensor for presence detection for us. I use the three network-based trackers for regular guests, and they work fairly accurately. These trackers will help reliably determine who is home or if the house is not occupied. 

I adopted Phil Hawthorne's methodology for [making presence detection not so binary](https://philhawthorne.com/making-home-assistants-presence-detection-not-so-binary/). Each person has an input_boolean that defines whether they are home or not, but there also is an input_select that clarifies the state as: "Home," "Away," "Just Arrived," or "Just Left." This is helpful when somebody leaves and quickly returns.

## Room Presence

I use [Bermuda](https://github.com/agittins/bermuda) for room presence detection, fed by ESPHome Bluetooth proxies around the house. I moved off [ESPresense](https://espresense.com/), which always took a lot of tweaking to get consistent results. Each person gets a `sensor.{name}_room_presence` whose state is the Home Assistant area they're in (e.g. `office`) or `not_home`. John, Cristina and Nonna are on Bermuda so far; a few older guest sensors still read the old ESPresense MQTT topic until their phones are enrolled. The main benefit of room presence is avoiding turning off the lights/room if there is no motion for a while. So if I'm sitting at the kitchen table reading something and barely moving, the kitchen won't turn off if it detects my phone.

## Zone Presence

Home Assistant has a great [Zone](https://www.home-assistant.io/integrations/zone/) integration that lets you identify zones to track. I haven't done as much as I'd like to do here, but I have some useful automations to notify the house occupants whenever somebody arrives or leaves work. School drop-offs are tracked too, including inferring a drop-off when a family member without a GPS tracker leaves home in the drop-off window. Grocery store visits get announced.

## Car Outside

`binary_sensor.car_outside` says a car is parked outside, for the freezing-night reminder. There is no "car in the garage" signal, so it works the other way round: a UniFi Protect vehicle detection on a driveway camera turns it on, and it clears when the garage doors close or at 08:00. It needs no car identity, so a visitor's car counts. Limits: a car the camera never detected gives no reminder, and a car that left without the doors cycling can stay on until 08:00. Any garage-door cycle also clears it, even with a car still outside, which means a missed reminder. The BLE car sensors (`sensor.audi_presence`, `sensor.bmw_presence`) are not used because they go stale as `not_home`.
