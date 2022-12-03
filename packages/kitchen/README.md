# Kitchen

The Kitchen is one of the most frequently used rooms in our house. This package manages the state and automations for the Kitchen.

## Kitchen Occupancy
Just like any room in the house, the Kitchen can determine occupancy based on various sensors. At any given time the Kitchen is either occupied or not. Occupancy is defined by `input_boolean.kitchen`. These automations will simply toggle the input boolean on and off. They will not directly trigger any automations.

### Kitchen is occupied
(kicthen/modes/kitchen_occupied.yaml) This automation will determine if the Kitchen is occupied. There are a few triggers and conditions required to validate this. Might move some of this into a Bayesian sensor.

**Triggered by**
- ESPresense/BLE detection
- Aqara Motion/Occupancy
- Lights are turned on

**Conditions**
- House is occupied
- Kitchen is not occupied
- Either BLE detects people or Aqara does

### Kitchen is not occupied
(kitchen/modes/kitchen_not_occupied.yaml) This automation will determine if the Kitchen is no longer occupied.

**Trigger by**
- Bluetooth devices no longer detected in the room for 2 minutes
- No motion for 3 minutes
- Aqara sensor no longer detects occupancy

**The conditions are**
- Aqara sensor does not detect occupancy
- No Bluetooth device detected
- The Kitchen is currently marked as occupied


## Kitchen State
The Kitchen has a few states that change throughout the day. 

- **Auto**: Default state for the Kitchen when the house is occupied and we're awake. It will allow entities (lights, media, etc) to manager their own state and automations.
- **Off**: The house is occupied, but no automations should run (e.g. we're sleeping).
- **Away**: We're not home.
- **Dim**: Dim the kitchen lights and change the brightness of lighting automations.

### Auto Mode
Auto mode is the default mode during the day. 

### Dim Mode
In the evening, after the kids go to sleep, we're mostly in the family room or John's in his office. The kitchen is only used to walk through to the bathroom or for a quick snack. But since the light is off in the family room in the evenings, we want a little light in the house. Therefore, the Kitchen goes into a Dim Mode where the lights turn down to 10% as an evening light. During Dim Mode, the motion automations only turn the lights up to 40%, rather than the standard 100%. 

- Dim Mode lights can be manually overridden
- Dim Mode lighting will return to the default dimmed state after the Kitchen is no longer occupied again.