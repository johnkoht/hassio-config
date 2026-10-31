# Security Camera Automations
I use Unifi cameras for security, but their notifications are kind of annoying. I've disabled notifications from Unifi Protect and have created custom automations to trigger notifications via push and TTS depending on the kind of detection and various other factors.

## Camera Notifications
Camera notifications are managed through an input_boolean. When notifications are enabled, we'll get push or TTS messages for detections depending on the type, time, and other factors. If disabled, most detection notifications will be surpressed, except for select cameras. I can manually toggle them, but most of the time the notification settings are managed by automations. 

## Detection Notifications
This includes a bunch of automations to send us alerts via push or TTS. Depending on the type of detection and various factors (home/not home, bedtime mode, etc) it will send varying types of alert priorities.

## Protect Detection Watchdog
UniFi Protect's event-linked sensors have frozen silently twice (2026-09-08, 2026-10-28): the integration stays loaded but no motion, person or vehicle sensor changes. `binary_sensor.protect_detections_stale` (`protect_watchdog/`) is on when none of the seven camera motion sensors has changed in 6 hours. It re-checks every 15 minutes, and it is blind for 6 hours after an HA restart.

`protect_detection_watchdog` reloads the Protect config entry when the sensor turns on, at most once per 6 hours. It then waits up to an hour for a motion sensor to change. If one does, John gets a passive push; if not, a time-sensitive push to check the NVR. The Detections row at the top of Security -> Cameras shows the sensor and the newest motion time.
