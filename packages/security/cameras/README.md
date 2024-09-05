# Security Camera Automations
I use Unifi cameras for security, but their notifications are kind of annoying. I've disabled notifications from Unifi Protect and have created custom automations to trigger notifications via push and TTS depending on the kind of detection and various other factors.

## Camera Notifications
Camera notifications are managed through an input_boolean. When notifications are enabled, we'll get push or TTS messages for detections depending on the type, time, and other factors. If disabled, most detection notifications will be surpressed, except for select cameras. I can manually toggle them, but most of the time the notification settings are managed by automations. 

## Detection Notifications
This includes a bunch of automations to send us alerts via push or TTS. Depending on the type of detection and various factors (home/not home, bedtime mode, etc) it will send varying types of alert priorities.