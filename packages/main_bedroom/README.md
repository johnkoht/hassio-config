# Main Bedroom

This package manages the Main Bedroom. This includes all of the sensors and automations.

## Main Bedroom Occupancy
Just like any room in the house, the Main Bedroom can determine occupancy based on various sensors. At any given time the Main Bedroom is either occupied or not. Occupancy is defined by `input_boolean.main_bedroom`. These automations will simply toggle the input boolean on and off. They will not directly trigger any automations.

### Main Bedroom is occupied
This automation will determine if the Main Bedroom is occupied. There are a few triggers and conditions required to validate this. Might move some of this into a Bayesian sensor.

**Triggered by**
- We're sleeping (based on a Bayesian sensor)
- Bluetooth presence detected
- Motion detected
- Aqara senses occupancy
- The door is closed
- HA restart/reload

**The conditions are**
- The house is occupied
- A bluetooth device is detected
- Aqara senses occupancy
- Main Bedroom is not already occupied

### Main Bedroom is not occupied
This automation will determine if the Main Bedroom is no longer occupied. Since the Main Bathroom is inside the Main Bedroom and manages it's own state and occupancy, the occupancy of the bedroom is also condtional on the bathroom being unoccupied.

**Trigger by**
- Bluetooth devices no longer detected in the room
- Aqara sensor no longer detects occupancy for 5 minutes
- The house is no longer occupied
- Bedtime is disabled
- Main Bathroom no longer occupied

**The conditions are**
- Neither of us are detected via Bluetooth
- Aqara sensor does not detect occupancy
- It's between 5am and 9pm
- It's not Bedtime
- Main Bathroom is not occupied

## Main Bedroom State
The Main Bedroom has a few states

- **Auto**: Default state for the Main Bedroom when the house is occupied. It will allow any entities (lights, media, etc) manage their own state and automations.
- **Off**: The house is occupied, but the Main Bedroom is not in use.
- **Bedtime**: The house is occupied, the bedroom is occupied and we're sleeping
- **Wake**: We've just woken up

## Motion Activated Lighting
The main bedrooms has motion activated lighting when it's in the Auto state. Lights will automatically turn on only when the global lighting automation boolean is enabled or the `main_bedroom_lighting_automation` boolean is enabled.

**The conditions are**
- Motion