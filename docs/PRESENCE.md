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

I use [ESPresense](https://espresense.com/) for room presence detection. I have about 15 BLE base stations spread out throughout the house. ESPresense is a pretty great tool, but it's sometimes not the most accurate. It took a lot of tweaking to get fairly consistent results. But now that it's working correctly, it's pretty great. The main benefit of room presence is avoiding turning off the lights/room if there is no motion for a while. So if I'm sitting at the kitchen table reading something and barely moving, the kitchen won't turn off if it detects my phone.

## Zone Presence

Home Assistant has a great [Zone](https://www.home-assistant.io/integrations/zone/) integration that lets you identify zones to track. I haven't done as much as I'd like to do here, but I have some useful automations to notify the house occupants whenever somebody arrives or leaves work. I'm working on tracking school dropoffs, grocery store visits, and more.
