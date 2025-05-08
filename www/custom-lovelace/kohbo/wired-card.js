// import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
// import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
// import {
//   LitElement,
//   html,
//   css,
// } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

// function loadCSS(url) {
//   const link = document.createElement("link");
//   link.type = "text/css";
//   link.rel = "stylesheet";
//   link.href = url;
//   document.head.appendChild(link);
// }

// loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

// class WiredToggleCard extends LitElement {
//   static get properties() {
//     return {
//       hass: {},
//       config: {},
//     };
//   }

//   render() {
//     return html`
//       <wired-card elevation="2">
//         <h1> TESTERSON</h1>
//         ${this.config.entities.map((ent) => {
//           const stateObj = this.hass.states[ent];
//           return stateObj
//             ? html`
//                 <div class="state">
//                   TEST: ${stateObj.attributes.friendly_name}
//                   <wired-toggle
//                     .checked="${stateObj.state === "on"}"
//                     @change="${(ev) => this._toggle(stateObj)}"
//                   ></wired-toggle>
//                 </div>
//               `
//             : html` <div class="not-found">Entity ${ent} not found.</div> `;
//         })}
//       </wired-card>
//     `;
//   }

//   setConfig(config) {
//     if (!config.entities) {
//       throw new Error("You need to define entities");
//     }
//     this.config = config;
//   }

//   // The height of your card. Home Assistant uses this to automatically
//   // distribute all cards over the available columns.
//   getCardSize() {
//     return this.config.entities.length + 1;
//   }

//   _toggle(state) {
//     this.hass.callService("homeassistant", "toggle", {
//       entity_id: state.entity_id,
//     });
//   }

//   static get styles() {
//     return css`
//       :host {
//         font-family: "Gloria Hallelujah", cursive;
//       }
//       wired-card {
//         background-color: white;
//         padding: 16px;
//         display: block;
//         font-size: 18px;
//       }
//       .state {
//         display: flex;
//         justify-content: space-between;
//         padding: 8px;
//         align-items: center;
//       }
//       .not-found {
//         background-color: yellow;
//         font-family: sans-serif;
//         font-size: 14px;
//         padding: 8px;
//       }
//       wired-toggle {
//         margin-left: 8px;
//       }
//     `;
//   }
// }
// customElements.define("wired-toggle-card", WiredToggleCard);









import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

class WiredToggleCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    return html`
      <h1>Test2222</h1>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
  }


}
customElements.define("wired-toggle-card", WiredToggleCard);


