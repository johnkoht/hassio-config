# Office

This package manages the Office in my house. This includes all of the sensors and automations.

## Office Occupancy
Just like any room in the house, the Office can determine occupancy based on various sensors. At any given time the Office is either occupied or not. Occupancy is defined by `input_boolean.office`. These automations will simply toggle the input boolean on and off. They will not directly trigger any automations.

### Office is occupied
(office/automations/office_occupied.yaml) This automation will determine if the Office is occupied. There are a few triggers and conditions required to validate this. Might move some of this into a Bayesian sensor.

**Triggered by**
- Office presence Bayesian sensor
- Aqara senses occupancy
- Bluetooth presence detected

**The conditions are**
- The house is occupied
- Office is not already occupied
- A bluetooth device is detected
- OR Aqara senses occupancy
- TODO: it's not the dog

### Office is not occupied
(office/automations/office_not_occupied.yaml) This automation will determine if the Office is no longer occupied.

**Trigger by**
- Bluetooth devices no longer detected in the room
- Aqara sensor no longer detects occupancy for 5 minutes
- The house is no longer occupied

**The conditions are**
- Aqara sensor does not detect occupancy
- No Bluetooth device detected
- The Office is currently marked as occupied


## Office State
The office only has two states: Auto and Off. 

- **Auto**: Default state for the Office when the house is occupied. It will allow any entities (lights, media, etc) manage their own state and automations.
- **Off**: The house is occupied, but the Office is not in use.
- **Away**: ?
- **DnD**: Do Not Disturb mode when I'm in the office and on a call, this will silence speech notifications, illuminate the DnD light, and quiet the room.

### Auto Mode
Auto mode is the default mode during the day. When the Office is in Auto mode, automations are enabled and will run based on the various rules of those automations. 

**Triggered by**
- House changing to Auto mode
- Office becomes occupied

**Automations**
When Auto mode is enabled, there are a variety of automations that are enabled.

- **Lights on when lighting is poor**: the Office lights will automatically turn on when the lighting in the office is dull.
- **Lights off when lighting is good**: when there is plenty of light in the Office, the lights will turn off automatically.
- **Motion activated**: whenever the Office is not occupied but detects motion, the lights will turn for convenient.
- **Music on**: turn the music on in the Office when I'm working in there but not in a meeting.
- **Music off**: automatically turn the music off when the Office becomes occupied or I'm on a call.
- **Music resume**: reesume the music after my call ends or I return into the office.

### Off Mode
Off mode is enabled when we're not home or everybody is asleep. When the Office is Off, none of the automation will trigger and everything will stay off.

### DnD Mode
The Office goes into Do Not Disturb (DnD) mode when I'm on a call. This will disabled speech notifications and turn on the red light outside my office. 

**Triggered by**
- John DnD mode `input_boolean.john_dnd`
- Office becomes occupied

**The conditions are**
- John DnD mode is on
- Office is occupied

Eventually, this could also include Cristina or a guest. One thing to note, there is a state of DnD on John as well as the Office. The reason is that I might be in DnD mode but not in the office. Sometimes I take calls on the patio or the kitchen. 
