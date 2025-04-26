class KohboPersonChip extends HTMLElement {
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
      // Initialize the content if it's not there yet.
      if (!this.content) {
        this.innerHTML = `
          <ha-card header="Example-card">
            <div class="card-content"></div>
          </ha-card>
        `;
        this.content = this.querySelector("div");
      }
  
      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const stateStr = state ? state.state : "unavailable";
  
      this.content.innerHTML = `
        The state of ${entityId} is ${stateStr}!
        <br><br>
        <img src="http://via.placeholder.com/350x150">
      `;
    }
  
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.entity) {
        throw new Error("You need to define an entity");
      }
      this.config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns in masonry view
    getCardSize() {
      return 3;
    }
  
    // The rules for sizing your card in the grid in sections view
    getGridOptions() {
      return {
        rows: 3,
        columns: 6,
        min_rows: 3,
        max_rows: 3,
      };
    }
  }
  
  customElements.define("kohbo-person-card", KohboPersonCard);


  // - type: custom:button-card
  //                   entity: person.john_koht
  //                   #aspect_ratio: 1/1
  //                   name: Person
  //                   show_entity_picture: true
  //                   show_name: false
  //                   tap_action:
  //                     action: navigate
  //                     navigation_path: "#john"
  //                   styles:
  //                     card:
  //                       - background-color: transparent
  //                       - border: none
  //                       #- border-radius: 50%
  //                       - width: 50px
  //                       - height: 50px
  //                       - overflow: visible
  //                     entity_picture:
  //                       - border-radius: 50%
  //                     icon:
  //                       - height: 100%
  //                       - width: 100%
  //                     custom_fields:
  //                       status:
  //                         - position: absolute
  //                         - top: -13px
  //                         - right: -13px
  //                         - width: 80%
  //                         - height: 80%
  //                         - color: |
  //                             [[[
  //                               if (states['person.john_koht'].state == 'home') {
  //                                 return "green";
  //                               } else {
  //                                 return "red"
  //                               }
  //                             ]]]
  //                   custom_fields:
  //                     status: |
  //                       [[[
  //                         return `<ha-icon icon="mdi:circle-medium"></ha-icon>`;                          
  //                       ]]]
  //                   # visibility:
  //                   #   - condition: state
  //                   #     entity: input_boolean.john_home
  //                   #     state: "on"