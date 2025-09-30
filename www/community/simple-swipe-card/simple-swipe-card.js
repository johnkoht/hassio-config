const t="2.5.12",i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",swipe_behavior:"single",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:"single",cards_visible:2.5,card_min_width:200},e=8,s=300,n=.3,o="_simpleSwipeEditorRegistry",a="_simpleSwipeCardEditors",r={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!1,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0},h=new Map,d=(t,...i)=>{if(!1===r[t])return;const e=`${t}:${i[0]}`,s=Date.now();if(h.has(e)){if(s-h.get(e)<5e3)return}(["AUTO","SWIPE","VISIBILITY"].includes(t)||["Setting hass","Visible cards updated","Auto-swipe","Updating slider"].some(t=>i[0]&&i[0].toString().includes(t)))&&h.set(e,s)},l=globalThis,c=l.ShadowRoot&&(void 0===l.ShadyCSS||l.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,p=Symbol(),u=new WeakMap;let g=class t{constructor(t,i,e){if(this.i=!0,e!==p)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(c&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=u.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&u.set(i,t))}return t}toString(){return this.cssText}};const m=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1],t[0]);return new g(e,t,p)},f=c?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new g("string"==typeof t?t:t+"",void 0,p))(i)})(t):t,{is:v,defineProperty:w,getOwnPropertyDescriptor:b,getOwnPropertyNames:x,getOwnPropertySymbols:y,getPrototypeOf:E}=Object,I=globalThis,S=I.trustedTypes,T=S?S.emptyScript:"",C=I.reactiveElementPolyfillSupport,$=(t,i)=>t,_={toAttribute(t,i){switch(i){case Boolean:t=t?T:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},O=(t,i)=>!v(t,i),N={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:O};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;let k=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=N){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&w(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=b(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??N}static m(){if(this.hasOwnProperty($("elementProperties")))return;const t=E(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this.m(),this.hasOwnProperty($("properties"))){const t=this.properties,i=[...x(t),...y(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(f(t))}else void 0!==t&&i.push(f(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._=null,this.N()}N(){this.D=new Promise(t=>this.enableUpdating=t),this.R=new Map,this.M(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.A??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.A?.delete(t)}M(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(c)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),s=l.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.A?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.A?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:_).toAttribute(i,e.type);this._=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this._!==s){const t=e.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.V?.get(s)??o,this._=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??O)(n,i)||e.useDefault&&e.reflect&&n===this.V?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.D=this.W())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.V??=new Map).has(t)&&(this.V.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.R.has(t)||(this.hasUpdated||e||(i=void 0),this.R.set(t,i)),!0===s&&this._!==t&&(this.F??=new Set).add(t))}async W(){this.isUpdatePending=!0;try{await this.D}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.R.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.R;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.A?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.U()}catch(i){throw t=!1,this.U(),i}t&&this.B(i)}willUpdate(t){}B(t){this.A?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this.R=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.D}shouldUpdate(t){return!0}update(t){this.F&&=this.F.forEach(t=>this.P(t,this[t])),this.U()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[$("elementProperties")]=new Map,k[$("finalized")]=new Map,C?.({ReactiveElement:k}),(I.reactiveElementVersions??=[]).push("2.1.1");const D=globalThis,R=D.trustedTypes,M=R?R.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+L,z=`<${P}>`,V=document,W=()=>V.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,B="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,j=/>/g,J=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,X=/"/g,q=/^(?:script|style|textarea|title)$/i,Z=(t=>(i,...e)=>({H:t,strings:i,values:e}))(1),K=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),tt=new WeakMap,it=V.createTreeWalker(V,129);function et(t,i){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(i):i}const st=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?"<svg>":3===i?"<math>":"",a=H;for(let i=0;i<e;i++){const e=t[i];let r,h,d=-1,l=0;for(;l<e.length&&(a.lastIndex=l,h=a.exec(e),null!==h);)l=a.lastIndex,a===H?"!--"===h[1]?a=Y:void 0!==h[1]?a=j:void 0!==h[2]?(q.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=J):void 0!==h[3]&&(a=J):a===J?">"===h[0]?(a=n??H,d=-1):void 0===h[1]?d=-2:(d=a.lastIndex-h[2].length,r=h[1],a=void 0===h[3]?J:'"'===h[3]?X:G):a===X||a===G?a=J:a===Y||a===j?a=H:(a=J,n=void 0);const c=a===J&&t[i+1].startsWith("/>")?" ":"";o+=a===H?e+z:d>=0?(s.push(r),e.slice(0,d)+A+e.slice(d)+L+c):e+L+(-2===d?i:c)}return[et(t,o+(t[e]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),s]};class nt{constructor({strings:t,H:i},e){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[h,d]=st(t,i);if(this.el=nt.createElement(h,e),it.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=it.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const i=d[o++],e=s.getAttribute(t).split(L),a=/([.?@])?(.*)/.exec(i);r.push({type:1,index:n,name:a[2],strings:e,ctor:"."===a[1]?dt:"?"===a[1]?lt:"@"===a[1]?ct:ht}),s.removeAttribute(t)}else t.startsWith(L)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(L),i=t.length-1;if(i>0){s.textContent=R?R.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],W()),it.nextNode(),r.push({type:2,index:++n});s.append(t[i],W())}}}else if(8===s.nodeType)if(s.data===P)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(L,t+1));)r.push({type:7,index:n}),t+=L.length-1}n++}}static createElement(t,i){const e=V.createElement("template");return e.innerHTML=t,e}}function ot(t,i,e=t,s){if(i===K)return i;let n=void 0!==s?e.Y?.[s]:e.J;const o=F(i)?void 0:i.G;return n?.constructor!==o&&(n?.X?.(!1),void 0===o?n=void 0:(n=new o(t),n.q(t,e,s)),void 0!==s?(e.Y??=[])[s]=n:e.J=n),void 0!==n&&(i=ot(t,n.Z(t,i.values),n,s)),i}class at{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??V).importNode(i,!0);it.currentNode=s;let n=it.nextNode(),o=0,a=0,r=e[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new rt(n,n.nextSibling,this,t):1===r.type?i=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(i=new pt(n,this,t)),this.K.push(i),r=e[++a]}o!==r?.index&&(n=it.nextNode(),o++)}return it.currentNode=V,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class rt{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=Q,this.tt=void 0,this.ht=t,this.dt=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.ht.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.ht}get endNode(){return this.dt}nt(t,i=this){t=ot(this,t,i),F(t)?t===Q||null==t||""===t?(this.rt!==Q&&this.lt(),this.rt=Q):t!==this.rt&&t!==K&&this.ct(t):void 0!==t.H?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this.ct(t)}O(t){return this.ht.parentNode.insertBefore(t,this.dt)}T(t){this.rt!==t&&(this.lt(),this.rt=this.O(t))}ct(t){this.rt!==Q&&F(this.rt)?this.ht.nextSibling.data=t:this.T(V.createTextNode(t)),this.rt=t}$(t){const{values:i,H:e}=t,s="number"==typeof e?this.ut(t):(void 0===e.el&&(e.el=nt.createElement(et(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new at(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=tt.get(t.strings);return void 0===i&&tt.set(t.strings,i=new nt(t)),i}k(t){U(this.rt)||(this.rt=[],this.lt());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new rt(this.O(W()),this.O(W()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.lt(e&&e.dt.nextSibling,s),i.length=s)}lt(t=this.ht.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.dt;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class ht{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=Q,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=Q}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=ot(this,t,i,0),o=!F(t)||t!==this.rt&&t!==K,o&&(this.rt=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=ot(this,s[e+a],i,a),r===K&&(r=this.rt[a]),o||=!F(r)||r!==this.rt[a],r===Q?t=Q:t!==Q&&(t+=(r??"")+n[a+1]),this.rt[a]=r}o&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class dt extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class lt extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class ct extends ht{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=ot(this,t,i,0)??Q)===K)return;const e=this.rt,s=t===Q&&e!==Q||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==Q&&(e===Q||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){"function"==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class pt{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){ot(this,t)}}const ut=D.litHtmlPolyfillSupport;ut?.(nt,rt),(D.litHtmlVersions??=[]).push("3.3.1");const gt=globalThis;class mt extends k{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.vt;if(void 0===n){const t=e?.renderBefore??null;s.vt=n=new rt(i.insertBefore(W(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return K}}mt.wt=!0,mt.finalized=!0,gt.litElementHydrateSupport?.({LitElement:mt});const ft=gt.litElementPolyfillSupport;ft?.({LitElement:mt}),(gt.litElementVersions??=[]).push("4.2.1");function vt(){return window.loadCardHelpers&&"function"==typeof window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith("custom:")){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement("div");return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement("div");return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement("div");return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function wt(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return function(t,i){if(!t||"object"!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case"state":{if(!s||!i.states[s])return d("VISIBILITY",`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return d("VISIBILITY",`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return d("VISIBILITY",`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case"numeric_state":{if(!s||!i.states[s])return d("VISIBILITY",`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),d("VISIBILITY",`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return d("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return d("VISIBILITY",`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return d("VISIBILITY",`Unknown condition type: ${e}`),!0}}(t,i)}catch(i){return d("VISIBILITY","Error evaluating condition:",t,i),!0}}):(d("VISIBILITY","No hass object available for condition evaluation"),!0))}class bt{constructor(t){this.card=t,this.bt=!1,this.xt=0,this.yt=0,this.Et=0,this.It=0,this.St=0,this.Tt=0,this.Ct=!1,this.$t=!1,this._t=0,this.Ot=0,this.Nt=!1,this.kt=e,this.Dt=null,this.Rt=!1,this.Mt=s,this.At=0,this.Lt=n,this.Pt=this.zt.bind(this),this.Vt=this.Wt.bind(this),this.Ft=this.Ut.bind(this),this.Bt=this.Wt.bind(this),this.Ht=this.Ut.bind(this),this.Yt=this.jt.bind(this),this.Jt=this.Gt.bind(this)}removeGestures(){d("SWIPE","Removing swipe gesture listeners"),this.card.cardContainer&&(this.card.cardContainer.removeEventListener("touchstart",this.Pt,{passive:!0}),this.card.cardContainer.removeEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.removeEventListener("touchend",this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener("touchcancel",this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener("mousedown",this.Pt,{passive:!1}),this.card.cardContainer.removeEventListener("click",this.Yt,{capture:!0}),this.card.cardContainer.removeEventListener("pointerdown",this.Jt,{capture:!0}),this.card.cardContainer.removeEventListener("pointerup",this.Jt,{capture:!0}),d("SWIPE","Removed swipe listeners from cardContainer.")),window.removeEventListener("mousemove",this.Bt,{passive:!1}),window.removeEventListener("mouseup",this.Ht,{passive:!0}),d("SWIPE","Removed potential swipe listeners from window."),this.bt=!1,this.Ct=!1,this.Dt&&(clearTimeout(this.Dt),this.Dt=null,this.Rt=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?d("SWIPE","Skipping addSwiperGesture",{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(d("SWIPE","Adding swipe listeners with click prevention."),this.card.cardContainer.addEventListener("touchstart",this.Pt,{passive:!0}),this.card.cardContainer.addEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.addEventListener("touchend",this.Ft,{passive:!0}),this.card.cardContainer.addEventListener("touchcancel",this.Ft,{passive:!0}),this.card.cardContainer.addEventListener("mousedown",this.Pt,{passive:!1}),this.card.cardContainer.addEventListener("click",this.Yt,{capture:!0}),this.card.cardContainer.addEventListener("pointerdown",this.Jt,{capture:!0}),this.card.cardContainer.addEventListener("pointerup",this.Jt,{capture:!0}),this.Xt())}jt(t){if(this.Rt||this.bt)return d("SWIPE","Click prevented during/after swipe gesture"),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}Gt(t){if(this.bt&&this.Nt)return t.preventDefault(),t.stopPropagation(),!1}qt(t=this.Mt){this.Rt=!0,this.At=Date.now(),this.Dt&&clearTimeout(this.Dt),this.Dt=setTimeout(()=>{this.Rt=!1,this.Dt=null,d("SWIPE","Click blocking period ended")},t),d("SWIPE",`Blocking clicks for ${t}ms`)}zt(t){if(d("SWIPE","Swipe Start:",t.type),this.card.pagination?.showPagination(),this.bt||"mousedown"===t.type&&0!==t.button)return void d("SWIPE","Swipe Start ignored (already dragging or wrong button)");const i=this.Zt(t);if(this.Kt(i))return void d("SWIPE","Swipe Start ignored (interactive element):",i);this.bt=!0,this.Ct=!1,this.Nt=!1,this.Ot=0,this._t=Date.now(),this.$t=!0;const e="touchstart"===t.type?t.touches[0]:t;if(this.xt=e.clientX,this.yt=e.clientY,this.Et=this.xt,this.It=this.yt,this.Tt=this._t,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.St=i.m41,"vertical"===this.card.Qt&&(this.St=i.m42),this.card.sliderElement.style.transition=this.card.ti(!1),this.card.sliderElement.style.cursor="grabbing"}"mousedown"===t.type&&(d("SWIPE","Attaching mousemove/mouseup listeners to window"),t.preventDefault(),window.addEventListener("mousemove",this.Bt,{passive:!1}),window.addEventListener("mouseup",this.Ht,{passive:!0})),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}Wt(t){if(!this.bt)return;const i="touchmove"===t.type,e=i?t.touches[0]:t,s=e.clientX,n=e.clientY,o=s-this.xt,a=n-this.yt,r=Date.now(),h=Math.sqrt(o*o+a*a);this.Ot=Math.max(this.Ot,h);const l="horizontal"===this.card.Qt,c=l?o:a,p=l?a:o;if(!this.Ct&&Math.abs(p)>Math.abs(c)&&Math.abs(p)>10&&(d("SWIPE",`${l?"Vertical":"Horizontal"} scroll detected, cancelling ${l?"horizontal":"vertical"} drag.`),this.Ct=!0,this.$t=!1),h>this.kt&&(this.Nt=!0),!this.Ct&&Math.abs(c)>this.kt){d("SWIPE",(l?"Horizontal":"Vertical")+" move detected"),i||t.preventDefault(),l?this.Et=s:this.It=n;let e=c;if(!(!0===this.card.ii.enable_loopback)){const t=0===this.card.currentIndex,i=this.card.currentIndex===this.card.visibleCardIndices.length-1;if(t&&e>0||i&&e<0){e*=.5*(.3+.7/(1+Math.abs(e)/(l?this.card.slideWidth:this.card.slideHeight)*.5))}}const o=this.St+e;this.card.sliderElement&&(this.card.sliderElement.style.transform=l?`translateX(${o}px)`:`translateY(${o}px)`,this.ei(o)),this.Tt=r}}Ut(t){if(d("SWIPE","Swipe End:",t.type),!this.bt)return void d("SWIPE","Swipe End ignored (not dragging)");this.card.si&&d("SWIPE","WARNING: Swipe end during seamless jump - this might indicate a stuck flag"),"mouseup"===t.type&&(d("SWIPE","Removing mousemove/mouseup listeners from window"),window.removeEventListener("mousemove",this.Bt),window.removeEventListener("mouseup",this.Ht));const i=this.Nt&&this.Ot>this.kt,e=Date.now()-this._t,s=e<200,n="horizontal"===this.card.Qt,o=n?this.Et-this.xt:this.It-this.yt,a=Date.now()-this.Tt,r=a>10?Math.abs(o)/a:0,h=r>this.Lt;(i||s&&h)&&(this.qt(h?400:300),d("SWIPE","Prevented clicks after swipe gesture",{movement:this.Ot,velocity:r,gestureTime:e,eventType:t.type})),this.$t=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.ti(!0),this.card.sliderElement.style.cursor="",!i)return void d("SWIPE","Swipe End: Not dragging or already processed.");if(this.Ct||"touchcancel"===t.type)return d("SWIPE","Swipe End: Scrolling or Cancelled - Snapping back."),this.card.updateSlider(),void(this.Ct=!1);const e=Math.max(1,Date.now()-this._t),s=Math.abs(o)/e,a=n?this.card.slideWidth:this.card.slideHeight,r=this.card.ii.view_mode||"single";let h;if("carousel"===r){const t=this.card.ii.cards_visible||2.5,i=(t-1)*(Math.max(0,parseInt(this.card.ii.card_spacing))||0);h=.2*((this.card.slideWidth-i)/t)}else h=.2*a;let l=this.card.currentIndex;const c=this.card.ii.loop_mode||"none",p=this.card.visibleCardIndices.length,u=this.card.ii.swipe_behavior||"single";let g=1;if(Math.abs(o)>h||Math.abs(s)>this.Lt){d("SWIPE","Swipe threshold crossed:",{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:p,loopMode:c,swipeBehavior:u}),g=this.card.swipeBehavior.calculateSkipCount(s,Math.abs(o),p,u);const t=o>0?g:-g;l=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,t),d("SWIPE",`Swipe resulted in navigation: ${this.card.currentIndex} → ${l} (${c} mode, ${u} behavior, skip: ${g})`)}else d("SWIPE","Swipe threshold NOT crossed:",{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,viewMode:r,swipeBehavior:u});l!==this.card.currentIndex?(d("SWIPE",`Swipe resulted in index change to ${l}`),"infinite"===this.card.ii.loop_mode?this.card.ni=this.card.loopMode.getWrappedIndexForPagination(this.card.currentIndex):this.card.ni=this.card.currentIndex,this.card.goToSlide(l,g),setTimeout(()=>{this.card.isConnected&&!this.card.oi&&this.card.resetAfter?.startTimer()},100)):(d("SWIPE","Swipe did not cross threshold or velocity, snapping back."),this.card.updateSlider())}),setTimeout(()=>{this.card.pagination?.showAndStartTimer()},100)}ei(t){if(!this.card.pagination?.paginationElement||this.card.visibleCardIndices.length<=1)return;const i="horizontal"===this.card.Qt,e=this.card.ii.view_mode||"single",s=Math.max(0,parseInt(this.card.ii.card_spacing))||0,n=t-this.St;let o;if("carousel"===e){const t=this.card.ii.cards_visible||this.card.ai(),i=(t-1)*s,e=(this.card.slideWidth-i)/t+s;o=Math.round(-n/e)}else{const t=(i?this.card.slideWidth:this.card.slideHeight)+s;o=Math.round(-n/t)}const a=this.card.currentIndex+o;this.card.pagination.updateDuringSwipe(a)}Kt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase();if("svg"===i||"canvas"===i)return d("SWIPE","Allowing swipe on chart element:",i),!1;const e=t.className&&"string"==typeof t.className?t.className:t.className?.toString()||"",s=t.id||"",n=t.getAttribute("role");if(e.includes("slider")||s.includes("slider")||"slider"===n||"range"===n)return d("SWIPE","_isInteractiveOrScrollable: Found slider element:",t),!0;try{const i=window.getComputedStyle(t);if(i.touchAction&&i.touchAction.includes("pan-y"))return d("SWIPE","_isInteractiveOrScrollable: Found touch-action pan-y element:",t),!0}catch(t){}if(["input","textarea","select","a","audio"].includes(i))return d("SWIPE","_isInteractiveOrScrollable: Found basic interactive element:",i),!0;if(n&&["checkbox","switch","slider","link","menuitem","textbox","combobox","option","range"].includes(n))return d("SWIPE","_isInteractiveOrScrollable: Found interactive role:",n),!0;let o=t,a=0;for(;o&&o!==this.card.sliderElement&&o!==this.card.cardContainer&&a<10;){if(o.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(o),i=("auto"===t.overflowY||"scroll"===t.overflowY)&&o.scrollHeight>o.clientHeight+1,e=("auto"===t.overflowX||"scroll"===t.overflowX)&&o.scrollWidth>o.clientWidth+1;if(i||e)return d("SWIPE","_isInteractiveOrScrollable: Found scrollable ancestor:",o),!0;const s=o.className&&"string"==typeof o.className?o.className:o.className?.toString()||"",n=o.id||"";if(s.includes("slider")||n.includes("slider"))return d("SWIPE","_isInteractiveOrScrollable: Found slider-like ancestor:",o),!0}catch(t){d("ERROR","Error accessing style/scroll properties for:",o,t)}o=o.assignedSlot||o.parentNode||(o.getRootNode()instanceof ShadowRoot?o.getRootNode().host:null),a++}return!1}Zt(t){if(t.composedPath&&"function"==typeof t.composedPath){const i=t.composedPath();if(i&&i.length>0){const t=i[0];if(t&&t.nodeType===Node.ELEMENT_NODE)return t}}return t.target}Xt(){if(!this.card.ii.show_pagination||!this.card.ii.auto_hide_pagination)return;const t=this.card.cardContainer;t&&(t.addEventListener("mouseenter",this.ri.bind(this),{passive:!0}),t.addEventListener("mouseleave",this.hi.bind(this),{passive:!0}),t.addEventListener("touchstart",this.di.bind(this),{passive:!0}),t.addEventListener("touchend",this.li.bind(this),{passive:!0}))}ri(){this.card.pagination?.showPagination()}hi(){this.bt||this.card.pagination?.showAndStartTimer()}di(){this.card.pagination?.showPagination()}li(){setTimeout(()=>{this.bt||this.card.pagination?.showAndStartTimer()},50)}}class xt{constructor(t){this.card=t,this.ci=null,this.pi=!1,this.ui=null,this.oi=!1,this.gi=1,this.mi=0,this.fi=this.wi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(d("AUTO","Starting auto-swipe with interval:",this.card.ii.auto_swipe_interval),this.start()))}start(){this.ci&&this.stop(),this.gi=1,this.pi=!1,this.ci=setInterval(this.fi,this.card.ii.auto_swipe_interval),d("AUTO","Auto-swipe timer started with interval:",this.card.ii.auto_swipe_interval)}stop(){this.ci&&(clearInterval(this.ci),this.ci=null,d("AUTO","Auto-swipe timer stopped")),this.ui&&(clearTimeout(this.ui),this.ui=null)}pause(t=5e3){this.card.ii.enable_auto_swipe&&(d("AUTO",`Auto-swipe paused for ${t}ms`),this.pi=!0,this.ui&&clearTimeout(this.ui),this.ui=setTimeout(()=>{this.pi=!1,d("AUTO","Auto-swipe pause ended"),this.card.isConnected&&this.card.ii.enable_auto_swipe&&this.start()},t))}wi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.ci&&(d("AUTO","Stopping auto-swipe, conditions not met or insufficient visible cards."),this.stop()));if(this.pi){const t=Date.now();return void(t-this.mi>5e3&&(d("AUTO","Skipping auto-swipe: currently paused"),this.mi=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.mi>5e3&&(d("AUTO","Skipping auto-swipe: currently dragging"),this.mi=t))}const i=Date.now();let e=i-this.mi>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.gi),n=s.nextIndex;s.shouldChangeDirection&&(this.gi=-this.gi,e=!0);const o=this.card.loopMode.getMode();("infinite"===o&&n>=t||"loopback"===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(d("AUTO",`Auto-swipe: ${this.card.currentIndex} → ${n} (${"none"===o?this.gi>0?"forward":"backward":o} mode)`),this.mi=i),this.oi=!0,this.card.goToSlide(n),this.oi=!1}get isInProgress(){return this.oi}}class yt{constructor(t){this.card=t,this.bi=null,this.xi=0,this.yi=!1,this.Ei=null,this.Ii=this.Si.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1?d("RESET","Reset-after feature enabled with timeout:",this.card.ii.reset_after_timeout):d("RESET","Reset-after feature disabled",{enabled:this.card.ii.enable_reset_after,autoSwipeDisabled:!this.card.ii.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.ii.enable_reset_after||this.card.ii.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.xi=Date.now(),d("RESET",`Starting reset-after timer: ${this.card.ii.reset_after_timeout}ms`),this.bi=setTimeout(this.Ii,this.card.ii.reset_after_timeout))}stopTimer(){this.bi&&(clearTimeout(this.bi),this.bi=null,d("RESET","Reset-after timer stopped"))}preserveState(){if(this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe)if(this.bi){const t=this.card.ii.reset_after_timeout-(Date.now()-this.xi);t>1e3?(this.Ei={remainingTime:Math.max(1e3,t),targetCard:this.card.ii.reset_target_card,wasActive:!0},d("RESET","Preserved reset-after state:",this.Ei)):this.Ei=null}else this.Ei=null;else this.Ei=null}restoreState(){this.Ei&&this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe?(this.Ei.wasActive&&this.card.visibleCardIndices.length>1&&(d("RESET","Restoring reset-after timer with remaining time:",this.Ei.remainingTime),this.xi=Date.now()-(this.card.ii.reset_after_timeout-this.Ei.remainingTime),this.bi=setTimeout(this.Ii,this.Ei.remainingTime)),this.Ei=null):this.Ei=null}Si(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void d("RESET","Reset-after skipped: conditions not met");let i=(parseInt(this.card.ii.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,d("RESET",`Target card ${this.card.ii.reset_target_card} is visible at position ${i}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,d("RESET",`Target card ${this.card.ii.reset_target_card} not visible, using closest visible card at position ${i}`)}i>=t&&(i=0,d("RESET","Target index out of range, using first visible card")),this.card.currentIndex!==i?(d("RESET",`Performing reset: current=${this.card.currentIndex}, target=${i}, timeout=${this.card.ii.reset_after_timeout}ms`),this.yi=!0,this.card.goToSlide(i),this.yi=!1):d("RESET","Reset-after skipped: already at target card")}get isInProgress(){return this.yi}}class Et{constructor(t){this.card=t,this.paginationElement=null,this.Ti=null,this.Ci=!1,this.$i=!0}create(){this.remove();if(!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1){if(d("INIT","Creating pagination for",this.card.visibleCardIndices.length,"visible cards"),!this.card.shadowRoot)return void d("ERROR","Cannot create pagination without shadowRoot");this.paginationElement=document.createElement("div"),this.paginationElement.className=`pagination ${this.card.Qt}`,this._i();const t=this.card.ii.state_entity&&this.card.Oi;for(let i=0;i<this.card.visibleCardIndices.length;i++){const e=document.createElement("div");e.className="pagination-dot",t||i!==this.Ni()||e.classList.add("active"),e.addEventListener("click",t=>{t.stopPropagation(),this.card.goToSlide(i),this.showPagination(),this.startAutoHideTimer()}),this.paginationElement.appendChild(e)}if(!this.card.shadowRoot)return void d("ERROR","shadowRoot became null while creating pagination");this.card.shadowRoot.appendChild(this.paginationElement),this.card.ki&&this.card.Di()}this.Ri()}_i(){this.paginationElement&&requestAnimationFrame(()=>{const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||""===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,""));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n("--simple-swipe-card-pagination-dot-active-size")||n("--simple-swipe-card-pagination-dot-size")||8,a=n("--simple-swipe-card-pagination-dot-size")||8,r=Math.max(o,a),h=i.getPropertyValue("--simple-swipe-card-pagination-padding").trim()||"4px 8px",l=h.split(" "),c=2*(s(l[0])||4),p=r+c;if("horizontal"===this.card.Qt)this.paginationElement.style.height=`${p}px`,this.paginationElement.style.minHeight="unset";else{const t=r+2*(s(l[1]||l[0])||8);this.paginationElement.style.width=`${t}px`,this.paginationElement.style.minWidth="unset"}d("INIT","Set FIXED pagination dimensions:",{activeDotSize:o,inactiveDotSize:a,maxDotSize:r,totalVerticalPadding:c,fixedDimension:`${p}px`,direction:this.card.Qt,paddingValue:h})})}Ni(){const t=this.card.visibleCardIndices.length;return 0===t?0:"infinite"===this.card.ii.loop_mode?(this.card.currentIndex%t+t)%t:Math.max(0,Math.min(this.card.currentIndex,t-1))}update(t=!0){if(!this.paginationElement)return;const i=this.Ni(),e=this.paginationElement.querySelectorAll(".pagination-dot");t||(e.forEach(t=>{t.style.transition="none"}),this.paginationElement.offsetHeight),e.forEach((t,e)=>{t.classList.toggle("active",e===i)}),t||requestAnimationFrame(()=>{e.forEach(t=>{t.style.transition=""})}),d("PAGINATION",`Updated dots: active dot ${i}${t?" (animated)":" (instant)"}`)}updateDuringSwipe(t){if(!this.paginationElement)return;const i=this.card.visibleCardIndices.length;if(0===i)return;let e;e="infinite"===this.card.ii.loop_mode?(t%i+i)%i:Math.max(0,Math.min(t,i-1));this.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===e)})}updateLayout(){!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display="flex":this.create():this.paginationElement&&(this.paginationElement.style.display="none")}remove(){this.cleanupAutoHide(),this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}Ri(){this.Ci=this.card.ii.show_pagination&&this.card.ii.auto_hide_pagination>0,this.Ci&&(d("PAGINATION","Auto-hide enabled with timeout:",this.card.ii.auto_hide_pagination),this.$i=!0,this.Mi(),this.startAutoHideTimer())}Mi(){if(!this.paginationElement)return;if("fade"===(getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-type").trim().replace(/['"]/g,"")||"fade"))this.paginationElement.style.transition="opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)",this.paginationElement.style.opacity="1";else{const t=this.paginationElement.querySelectorAll(".pagination-dot"),i=getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-fade-duration").trim()||"600ms",e=getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-easing").trim()||"ease-out";t.forEach(t=>{t.style.transition=`opacity ${i} ${e}`,t.style.opacity="1"}),this.paginationElement.style.transition="none",this.paginationElement.style.opacity="1"}}startAutoHideTimer(){if(!this.Ci||!this.paginationElement)return;this.stopAutoHideTimer();const t=this.card.ii.auto_hide_pagination;d("PAGINATION","Starting auto-hide timer:",t+"ms"),this.Ti=setTimeout(()=>{this.hidePagination(),this.Ti=null},t)}stopAutoHideTimer(){this.Ti&&(clearTimeout(this.Ti),this.Ti=null,d("PAGINATION","Auto-hide timer stopped"))}hidePagination(){if(this.Ci&&this.paginationElement&&this.$i){d("PAGINATION","Hiding pagination");"fade"===(getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-type").trim().replace(/['"]/g,"")||"fade")?this.paginationElement.style.opacity="0":this.Ai(),this.$i=!1}}showPagination(){if(this.Ci&&this.paginationElement){if(!this.$i){d("PAGINATION","Showing pagination");"fade"===(getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-type").trim().replace(/['"]/g,"")||"fade")?this.paginationElement.style.opacity="1":this.Li(),this.$i=!0}this.stopAutoHideTimer()}}Ai(){const t=this.paginationElement.querySelectorAll(".pagination-dot"),i=getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-type").trim().replace(/['"]/g,"")||"fade",e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-delay").trim().replace("ms",""))||50,s=this.Pi(t.length,i,e);t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity="0"},s[i])})}Li(){const t=this.paginationElement.querySelectorAll(".pagination-dot"),i=getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-type").trim().replace(/['"]/g,"")||"fade",e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue("--simple-swipe-card-pagination-animation-delay").trim().replace("ms",""))||50,s=this.zi(i),n=this.Pi(t.length,s,e);t.forEach(t=>{t.style.opacity="0"}),t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity="1"},n[i])})}Pi(t,i,e){const s=[];switch(i){case"left-to-right":for(let i=0;i<t;i++)s[i]=i*e;break;case"right-to-left":for(let i=0;i<t;i++)s[i]=(t-1-i)*e;break;case"center-out":{const i=Math.floor(t/2);for(let n=0;n<t;n++){const t=Math.abs(n-i);s[n]=t*e}break}case"edges-in":for(let i=0;i<t;i++){const n=Math.min(i,t-1-i);s[i]=n*e}break;case"random":{const i=Array.from({length:t},(t,i)=>i).sort(()=>Math.random()-.5);i.forEach((t,i)=>{s[t]=i*e});break}default:for(let i=0;i<t;i++)s[i]=0}return s}zi(t){return{"left-to-right":"right-to-left","right-to-left":"left-to-right","center-out":"edges-in","edges-in":"center-out",random:"random",fade:"fade"}[t]||"fade"}showAndStartTimer(){this.Ci&&(this.showPagination(),this.startAutoHideTimer())}cleanupAutoHide(){this.stopAutoHideTimer()}}const It=()=>m`
  .card-config {
    /* Let HA handle padding */
  }

  .info-panel {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0 24px 0;
    background-color: var(--primary-background-color);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--info-color, #2196f3);
    color: white;
    margin-right: 12px;
    flex-shrink: 0;
    font-size: 14px;
  }

  .info-text {
    flex-grow: 1;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  /* MAIN SECTION STYLES */
  .section {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
  }

  .section-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  .option-row {
    display: flex;
    align-items: anchor-center;
    justify-content: space-between;
    padding: 6px 0;
    min-height: 36px;
  }

  .option-left {
    flex: 1;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
  }

  .option-label {
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0 0 2px 0;
    line-height: 1.2;
  }

  .option-help {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.3;
    margin: 0;
    max-width: 100%;
    margin-top: 8px;
  }

  .option-control {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 2px; /* Small offset to align with label baseline */
  }

  .option-row:not(:last-of-type) {
    margin-bottom: 4px;
  }

  .option-row + .help-text {
    margin-top: -8px; /* Small negative margin for close spacing */
    margin-bottom: 16px;
    margin-left: 0;
  }

  .help-text + .option-row {
    margin-top: 10px;
  }

  .option-label {
    flex: 1;
    margin-right: 12px;
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0;
  }

  .help-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .help-text:last-child {
    margin-bottom: 4px; /* Even smaller for last help text */
  }

  .pagination-option {
    margin-bottom: -12px !important;
  }

  /* ADVANCED OPTIONS - COLLAPSIBLE SECTION */
  .collapsible-section {
    margin: 16px 0;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
    overflow: visible;
    position: relative;
  }

  .collapsible-section .section-content {
    overflow: visible; /* Allow dropdowns to overflow */
    position: relative;
  }

  /* Ensure ha-select dropdowns can overflow the collapsible container */
  .collapsible-section ha-select {
    position: relative;
    z-index: 100; /* Ensure dropdown appears above other content */
  }

  /* Make sure the dropdown menu itself has proper z-index */
  .collapsible-section ha-select mwc-menu {
    z-index: 1000;
  }

  .collapsible-section .section-toggle {
    padding: 16px;
    margin: 0;
    background-color: inherit;
  }

  .collapsible-section .section-toggle:hover {
    background-color: var(--secondary-background-color);
  }

  .collapsible-section .section-content.expanded::before {
    content: "";
    display: block;
    height: 1px;
    background-color: var(--divider-color);
    margin: 0 -16px 16px -16px;
  }

  .collapsible-section .section-content.expanded {
    padding: 0 16px 16px 16px;
    background-color: inherit;
  }

  .section-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 12px;
    user-select: none;
  }

  .section-toggle:hover {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
  }

  .section-toggle.expanded {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
  }

  .section-toggle-icon {
    margin-right: 8px;
    transition: transform 0.2s ease;
    color: var(--secondary-text-color);
  }

  .section-toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .section-toggle-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-text-color);
    flex-grow: 1;
  }

  .section-toggle-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
    margin-left: 8px;
  }

  .section-toggle-badge.blocked-status {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
  }

  .section-toggle-badge.mixed-status {
    background-color: var(--info-color, #2196f3);
    color: var(--text-primary-color);
    font-size: 10px;
  }

  .section-toggle-badge.blocked-only {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
    margin-left: 4px; /* Small gap between badges */
  }

  .section-content {
    overflow: hidden;
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease;
  }

  .section-content.collapsed {
    max-height: 0;
    opacity: 0;
  }

  .section-content.expanded {
    max-height: 500px;
    opacity: 1;
    overflow: visible;
  }

  .compact-options .option-row {
    padding: 8px 0;
    min-height: 20px;
  }

  .compact-options .option-row + .help-text {
    margin-top: -8px; /* Same small negative margin */
    margin-bottom: 12px;
  }

  .compact-options ha-textfield + .help-text {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .compact-options .help-text + ha-textfield {
    margin-top: 10px;
  }

  /* CARDS SECTION */
  .card-list {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
  }

  .card-row.hidden-card {
    opacity: 0.5;
    border-style: dashed;
  }

  .card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .card-index {
    font-weight: bold;
    margin-right: 10px;
    color: var(--secondary-text-color);
  }

  .card-type {
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picture-elements-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .visibility-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--warning-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .card-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .card-actions ha-icon-button {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .hidden-icon {
    color: var(--error-color);
    margin-right: 8px;
    font-size: 18px;
  }

  .no-cards {
    text-align: center;
    color: var(--secondary-text-color);
    padding: 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 16px;
  }

  /* NESTED CARDS */
  .nested-cards-container {
    margin-left: 24px;
    margin-top: 4px;
    margin-bottom: 8px;
    border-left: 2px solid var(--divider-color);
    padding-left: 12px;
  }

  .nested-card-row {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
    opacity: 0.85;
  }

  .nested-card-row:hover {
    opacity: 1;
  }

  .nested-card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .nested-card-index {
    font-weight: normal;
    margin-right: 10px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }

  .nested-card-type {
    font-size: 13px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-name {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .nested-card-actions ha-icon-button {
    --mdc-icon-button-size: 32px;
    color: var(--secondary-text-color);
  }

  .nested-card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  /* FORM CONTROLS */
  ha-textfield {
    width: 100%;
  }

  ha-select {
    width: 185px;
    max-width: 185px;
    --ha-select-height: 40px;
  }

  .direction-icon {
    width: 32px;
    height: 32px;
    margin-left: 8px;
    color: var(--primary-color);
  }

  /* FOOTER */
  #card-picker-container {
    display: block;
    margin-top: 16px;
    margin-bottom: 20px;
    padding-top: 16px;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
    margin-left: auto;
  }

  .entity-picker-help {
    margin-top: 4px !important;
  }

  /* VIEW MODE SECTION */
  .view-mode-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .view-mode-label {
    font-size: 14px;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  /* VIEW MODE SECTION */
  .section-header-with-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-header-with-controls.carousel-mode {
    margin-bottom: 16px; /* Keep margin for carousel mode (has input below) */
  }

  .section-header-with-controls.single-mode {
    margin-bottom: 0; /* Remove margin for single mode */
  }

  .section-header-with-controls .section-header {
    margin-bottom: 0;
  }

  .radio-group {
    display: flex;
    gap: 16px;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 16px;
    color: var(--primary-text-color);
  }

  .radio-option input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }

  .radio-option:hover {
    color: var(--primary-color);
  }

  /* INFO MESSAGE STYLING */
  .option-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: rgba(33, 150, 243, 0.4);
    color: var(--text-primary-color, white);
    border-radius: 4px;
    margin: 8px 0;
    font-size: 13px;
  }

  .option-info {
    background-color: color-mix(
      in srgb,
      var(--info-color, #2196f3) 40%,
      transparent
    );
  }

  .option-info.warning {
    background-color: color-mix(
      in srgb,
      var(--warning-color, #ff9800) 40%,
      transparent
    );
  }

  @supports not (background-color: color-mix(in srgb, blue 40%, transparent)) {
    .option-info {
      background-color: rgba(33, 150, 243, 0.4);
    }
  }

  .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #24292e;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .github-badge:hover {
    background-color: #444d56;
  }

  .github-badge ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* AUTO-HIDE PAGINATION CONTROL */
  .auto-hide-control {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .auto-hide-value {
    min-width: 50px;
    text-align: right;
    font-weight: 500;
    color: var(--primary-color);
    font-size: 14px;
    flex-shrink: 0;
  }

  .auto-hide-control ha-slider {
    flex: 1;
    --paper-slider-knob-color: var(--primary-color);
    --paper-slider-active-color: var(--primary-color);
    --paper-slider-pin-color: var(--primary-color);
    margin-right: -10px;
  }

  .info-text {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-style: italic;
    margin-top: 4px;
    line-height: 1.3;
  }
`;function St(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){d("ERROR","Failed to fire HA event:",i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function Tt(t,i="Map"){return window[t]||(window[t]="Set"===i?new Set:new Map),window[t]}class Ct{constructor(t){this.card=t}async build(){if(this.card.building)return void d("INIT","Build already in progress, skipping.");if(!this.card.ii||!this.card.ii.cards||!this.card.isConnected)return void d("INIT","Build skipped (no config/cards or not connected).");this.card.building=!0,d("INIT","Starting build..."),this.card.resetAfter?.preserveState(),this.card.cards=[];this.card.currentIndex;if(this.card.ii.state_entity&&this.card.Oi||(this.card.currentIndex=0),this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),!this.card.shadowRoot)return d("INIT","Waiting for LitElement to create shadowRoot..."),setTimeout(()=>{this.card.isConnected&&this.build()},10),void(this.card.building=!1);this.card.shadowRoot&&(this.card.shadowRoot.innerHTML="");const t=this.card.shadowRoot;d("INIT","Building with shadowRoot:",!!t);const i=await vt();if(!i)return console.error("SimpleSwipeCard: Card helpers not loaded."),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,void(this.card.initialized=!1);const e=document.createElement("style");if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) {\n       height: 250px; /* Set a reasonable default height for the whole card */\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {\n       height: 100%;\n       min-height: 100%;\n       max-height: 100%;\n       flex: 0 0 100%;\n     } \n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n     }\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n     }\n\n     .slider.dropdown-fix-active {\n        transform: none !important;\n        will-change: auto !important;\n        transition: none !important;\n     }\n\n     /* Immediately hide all slides except the current one during dropdown fix */\n     .slider.dropdown-fix-active-hide-adjacent .slide {\n       display: none !important;\n     }\n\n     /* Show only the current slide during dropdown fix */\n     .slider.dropdown-fix-active-hide-adjacent .slide.current-active {\n       display: flex !important;\n     }     \n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n        height: 100%;\n        max-height: 100%;\n        overflow: visible; /* Allow transforms to move content outside */\n        flex-wrap: nowrap;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: hidden;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement("div"),this.card.cardContainer.className="card-container",this.card.sliderElement=document.createElement("div"),this.card.sliderElement.className="slider",this.card.sliderElement.setAttribute("data-swipe-direction",this.card.Qt),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.Vi(),0===this.card.ii.cards.length){d("INIT","Building preview state.");const i=function(t,i){const e=document.createElement("div");e.className="preview-container";const s=document.createElement("div");s.className="preview-icon-container";const n=document.createElement("ha-icon");n.icon="horizontal"===t?"mdi:gesture-swipe-horizontal":"mdi:gesture-swipe-vertical",s.appendChild(n);const o=document.createElement("div");o.className="preview-text-container";const a=document.createElement("div");a.className="preview-title",a.textContent="Simple Swipe Card";const r=document.createElement("div");r.className="preview-description",r.textContent=`Create a swipeable container with multiple cards. Swipe ${"horizontal"===t?"horizontally":"vertically"} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const h=document.createElement("div");h.className="preview-actions";const d=document.createElement("ha-button");return d.raised=!0,d.textContent="EDIT CARD",d.setAttribute("aria-label","Edit Card"),d.addEventListener("click",i),h.appendChild(d),e.appendChild(s),e.appendChild(o),e.appendChild(h),e}(this.card.Qt,t=>function(t,i){t.stopPropagation(),d("EDITOR","Edit button clicked, firing show-edit-card event"),St(i,"show-edit-card",{element:i})}(t,this.card));return t.innerHTML="",t.appendChild(e),t.appendChild(i),this.card.initialized=!0,void(this.card.building=!1)}if(0===this.card.visibleCardIndices.length)return d("INIT","No visible cards, hiding entire card."),this.card.style.display="none",t.innerHTML="",this.card.initialized=!0,void(this.card.building=!1);this.card.style.display="block",this.card.loopMode.initialize();const s=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.ii.cards);this.card.loopMode.isInfiniteMode,d("INIT","Building cards:",{totalVisible:this.card.visibleCardIndices.length,totalToLoad:s.length,infiniteMode:this.card.loopMode.isInfiniteMode});const n=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate));if(await Promise.allSettled(n),this.card.ii.state_entity&&this.card.Oi){const t=this.Wi();t!==this.card.currentIndex&&(d("STATE","Setting initial index from state sync:",t),this.card.currentIndex=t)}this.card.cards.forEach(t=>{t.slide&&t.slide.parentElement!==this.card.sliderElement&&this.card.sliderElement.appendChild(t.slide)}),this.card.pagination.create(),d("INIT","All cards initialized."),this.card.initialized||(this.card.initialized=!0),requestAnimationFrame(()=>{this.finishBuildLayout()}),this.card.building=!1,d("INIT","Build completed successfully")}preloadAdjacentCards(){d("INIT","preloadAdjacentCards called but all cards already loaded")}async createCard(t,i,e,s,n=!1){const o=function(){const t=document.createElement("div");return t.className="slide",t}();let a;const r={visibleIndex:i,originalIndex:e,slide:o,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{a=await s.createCardElement(t),this.card.Oi&&(a.hass=this.card.Oi,d("INIT",`Set hass immediately after creation for card ${i} (type: ${t.type})`)),r.element=a,"picture-elements"===t.type&&(a.setAttribute("data-swipe-card-picture-elements","true"),o.setAttribute("data-has-picture-elements","true")),requestAnimationFrame(()=>{try{if("todo-list"===t.type){const t=a.shadowRoot?.querySelector("ha-textfield"),i=t?.shadowRoot?.querySelector("input");i&&(i.enterKeyHint="done")}}catch(t){console.warn("Error applying post-creation logic:",t)}}),o.appendChild(a)}catch(n){d("ERROR",`Error creating card ${i} (original ${e}):`,t,n),r.error=!0;const a=await s.createErrorCardElement({type:"error",error:`Failed to create card: ${n.message}`,origConfig:t},this.card.Oi);r.element=a,o.appendChild(a)}this.card.cards.push(r)}Fi(t,i){d("VISIBILITY",`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.Ui()}finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void d("INIT","_finishBuildLayout skipped",{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});d("INIT","Finishing build layout...");const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;if(t<=0||i<=0)return null===this.card.offsetParent?void d("INIT","Layout calculation skipped, element is hidden."):(d("INIT","Container dimensions are 0, retrying layout..."),this.card.Bi=(this.card.Bi||0)+1,void(this.card.Bi<5?setTimeout(()=>requestAnimationFrame(()=>this.finishBuildLayout()),100):(console.error("SimpleSwipeCard: Failed to get container dimensions."),this.card.Bi=0)));this.card.Bi=0,this.card.slideWidth=t,this.card.slideHeight=i;const e=this.card.ii.view_mode||"single";"carousel"===e&&this.Hi(t,i);const s=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),function(t,i){const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer),this.card.updateSlider(!1),this.card.Yi(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),d("INIT","Layout finished, slideWidth:",this.card.slideWidth,"slideHeight:",this.card.slideHeight,"currentIndex:",this.card.currentIndex,"visible cards:",s,"view mode:",e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage(),this.card.ki?(d("CARD_MOD","Applying card-mod styles in finishBuildLayout"),this.card.Di(),this.card.ji()):d("CARD_MOD","No card-mod config found in finishBuildLayout")}Wi(){if(!this.card.ii.state_entity||!this.card.Oi)return this.card.currentIndex;const t=this.card.ii.state_entity,i=this.card.Oi.states[t];if(!i)return d("STATE","State entity not found during build:",t),this.card.currentIndex;const e=i.state;let s=null;if(t.startsWith("input_select.")){if(!i.attributes.options||!Array.isArray(i.attributes.options))return this.card.currentIndex;const t=i.attributes.options.indexOf(e);-1!==t&&t<this.card.visibleCardIndices.length&&(s=t)}else if(t.startsWith("input_number.")){const t=parseInt(e);if(!isNaN(t)){const i=t-1;i>=0&&i<this.card.visibleCardIndices.length&&(s=i)}}return null!==s?(d("STATE",`State sync initial index determined during build: ${s} from entity state: ${e}`),s):this.card.currentIndex}Hi(t){let i;const e=Math.max(0,parseInt(this.card.ii.card_spacing))||0;if(void 0!==this.card.ii.cards_visible)i=this.card.ii.cards_visible,d("INIT","Carousel layout using legacy cards_visible approach:",i);else{const s=this.card.ii.card_min_width||200,n=(t+e)/(s+e);i=Math.max(1.1,Math.round(10*n)/10),d("INIT","Carousel layout using responsive approach:",{minWidth:s,containerWidth:t,cardSpacing:e,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const s=(i-1)*e,n=(t-s)/i;d("INIT","Carousel layout setup:",{containerWidth:t,cardsVisible:i.toFixed(2),cardSpacing:e,totalSpacing:s,cardWidth:n.toFixed(2)}),this.card.style.setProperty("--carousel-card-width",`${n}px`),this.card.sliderElement.setAttribute("data-view-mode","carousel"),this.card.cardContainer.setAttribute("data-view-mode","carousel"),this.card.cards.forEach(t=>{t&&t.slide&&t.slide.classList.add("carousel-mode")})}}class $t{constructor(t){this.card=t,this.Ji=null,this.Gi=null,this.Xi=null,this.qi=!1,this.Zi=null,this.Ki=this.Qi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.state_entity&&this.card.Oi?(this.Ji=this.card.ii.state_entity,this.te()?(d("STATE","State synchronization enabled for entity:",this.Ji),this.ie()):(d("STATE","Invalid or missing entity:",this.Ji),this.Ji=null)):d("STATE","State synchronization disabled",{hasEntity:!!this.card.ii.state_entity,hasHass:!!this.card.Oi}))}stop(){this.Zi&&(clearTimeout(this.Zi),this.Zi=null),this.Ji=null,this.Gi=null,this.Xi=null,this.qi=!1}onCardNavigate(t){if(!this.Ji||!this.card.Oi||this.qi)return;const i=this.ee(t);if(null===i)return;const e=this.card.Oi.states[this.Ji];if(e&&e.state===i)d("STATE","Entity already at correct state:",i);else{d("STATE",`Updating entity ${this.Ji} to:`,i),this.qi=!0;try{"input_select"===this.Gi?this.card.Oi.callService("input_select","select_option",{entity_id:this.Ji,option:i}):"input_number"===this.Gi&&this.card.Oi.callService("input_number","set_value",{entity_id:this.Ji,value:i}),this.Xi=i,setTimeout(()=>{this.qi=!1},500)}catch(t){d("ERROR","Failed to update entity:",t),this.qi=!1}}}te(){if(!this.card.Oi||!this.Ji)return!1;const t=this.card.Oi.states[this.Ji];if(!t)return d("STATE","Entity not found:",this.Ji),!1;if(this.Ji.startsWith("input_select.")){if(this.Gi="input_select",!t.attributes.options||!Array.isArray(t.attributes.options))return d("STATE","input_select entity has no options:",this.Ji),!1}else{if(!this.Ji.startsWith("input_number."))return d("STATE","Entity is not input_select or input_number:",this.Ji),!1;this.Gi="input_number"}return!0}ie(){if(!this.card.Oi||!this.Ji)return;const t=this.card.Oi.states[this.Ji];if(!t)return;this.Xi=t.state;const i=this.se(t.state);null===i||i!==this.card.currentIndex?null!==i&&i!==this.card.currentIndex&&(d("STATE",`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i,1,!1)):d("STATE",`Initial sync: card already at correct position ${i}, skipping initial positioning`)}Qi(){if(!this.card.Oi||!this.Ji||this.qi)return;const t=this.card.Oi.states[this.Ji];if(!t)return;const i=t.state;if(i===this.Xi)return;d("STATE",`Entity ${this.Ji} changed from "${this.Xi}" to "${i}"`),this.Xi=i;const e=this.se(i);null!==e&&e!==this.card.currentIndex&&(d("STATE",`Navigating to card index ${e} from entity change`),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}se(t){if("input_select"===this.Gi){const i=this.card.Oi.states[this.Ji];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(d("STATE",`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(d("STATE",`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if("input_number"===this.Gi){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(d("STATE",`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}ee(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if("input_select"===this.Gi){const i=this.card.Oi.states[this.Ji];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(d("STATE",`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return"input_number"===this.Gi?t+1:null}onHassChange(t,i){if(!this.Ji||!i)return;const e=t?.states[this.Ji],s=i.states[this.Ji];if(!s)return d("STATE","Configured entity no longer exists:",this.Ji),void this.stop();e&&e.state===s.state||(this.Zi&&clearTimeout(this.Zi),this.Zi=setTimeout(()=>{this.Qi(),this.Zi=null},100))}}class _t{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;let i;const e=this.card.cardContainer.offsetWidth,s=Math.max(0,parseInt(this.card.ii.card_spacing))||0;if(void 0!==this.card.ii.cards_visible)i=this.card.ii.cards_visible,d("SWIPE","Using legacy cards_visible approach:",i);else{const t=this.card.ii.card_min_width||200,n=(e+s)/(t+s);i=Math.max(1.1,Math.round(10*n)/10),d("SWIPE","Using responsive approach:",{minWidth:t,containerWidth:e,cardSpacing:s,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const n=this.card.visibleCardIndices.length,o=this.card.ii.loop_mode||"none";if(n<=Math.floor(i)&&"infinite"!==this.card.ii.loop_mode)return d("SWIPE","Insufficient cards for carousel transform, staying at position 0"),0;let a;if("infinite"===o&&n>1){const i=this.card.loopMode.getDuplicateCount();a=t+i,d("SWIPE","Carousel infinite mode: logical index",t,"-> DOM position",a,"duplicateCount:",i)}else a=Math.min(t,Math.max(0,n-1));const r=(e-(i-1)*s)/i,h=r+s,l=a*h;return d("SWIPE","Carousel transform calculation:",{targetIndex:t,domPosition:a,totalCards:n,cardsVisible:i.toFixed(2),cardWidth:r.toFixed(2),cardSpacing:s,moveDistance:h.toFixed(2),transform:l.toFixed(2),loopMode:o}),l}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);if(i&&"free"===this.card.ii.swipe_behavior&&this.card.ne>1){const t=this.card.swipeBehavior.calculateAnimationDuration(this.card.ne),i=this.card.swipeBehavior.getEasingFunction(this.card.ne);this.card.sliderElement.style.transition=`transform ${t}ms ${i}`,d("SWIPE",`Carousel multi-card animation: ${this.card.ne} cards, ${t}ms duration, easing: ${i}`)}else this.card.sliderElement.style.transition=this.card.ti(i);this.card.sliderElement.style.transform=`translateX(-${e}px)`,d("SWIPE",`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}oe(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class Ot{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this.ae=null,this.re=null}getMode(){return this.card.ii.loop_mode||"none"}isInfinite(){return"infinite"===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){if(this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode)d("LOOP","Infinite loop mode initialized for",this.card.visibleCardIndices.length,"visible cards");else{this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0;"infinite"===this.getMode()&&d("LOOP","Infinite loop mode disabled - only",this.card.visibleCardIndices.length,"visible card(s)")}}getDuplicateCount(){if(!this.isInfiniteMode)return 0;if(this.card.visibleCardIndices.length<=1)return 0;const t=this.card.ii.view_mode||"single",i=this.card.ii.swipe_behavior||"single";if("single"===t)return"free"===i?4:1;{const t=this.card.ii.cards_visible||this.card.ai(),e=Math.max(5,Math.ceil(2*t));if("free"===i){return e+Math.min(5,Math.ceil(t))}return e}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const a=o-s;let r;r=a<0?(a%n+n)%n:a%n;const h=t[r];e.push({config:i[h],visibleIndex:o-s,originalIndex:h,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o%n];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;if(0===i)return 0;return this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){if(!this.isInfiniteMode)return t;if(0===this.card.visibleCardIndices.length)return 0;return t-this.getDuplicateCount()}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();if(t<e){return e+i-(e-t)}return e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;return t<0||t>=i}scheduleSeamlessJump(t,i=null){if(this.he(),!this.shouldPerformSeamlessJump(t))return void d("LOOP",`Seamless jump not needed for target index ${t}`);let e;if(null!==i)e=i;else try{const t=this.card.ti(!0);d("LOOP","DEBUG: transitionStyle =",t);const i=t.match(/transform\s+([\d.]+)([a-z]*)\s/);if(d("LOOP","DEBUG: regex match =",i),i){const t=parseFloat(i[1]),s=i[2]||"s";d("LOOP","DEBUG: parsed duration =",t,"unit =",s),e="s"===s?1e3*t:"ms"===s?t:400,d("LOOP","DEBUG: final transitionDuration =",e)}else d("LOOP","DEBUG: regex match failed, using fallback"),e=400}catch(t){d("LOOP","Error reading CSS transition duration:",t),e=400}d("LOOP",`Scheduling seamless jump for target index ${t} after ${e}ms animation`);let s=!1;const n=()=>{if(!s){if(s=!0,this.ae&&(clearTimeout(this.ae),this.ae=null),!this.card.isConnected||this.card.building)return d("LOOP","Seamless jump cancelled - card disconnected or building"),void(this.card.si=!1);requestAnimationFrame(()=>{try{const i=this.card.currentIndex;if(d("LOOP",`Seamless jump executing: target was ${t}, actual current is ${i}`),!this.shouldPerformSeamlessJump(i))return d("LOOP",`Seamless jump cancelled - conditions changed (target: ${t}, actual: ${i})`),void(this.card.si=!1);const e=this.card.visibleCardIndices.length;let s;if(i<0)s=e+i%e,s>=e&&(s=e-1);else{if(!(i>=e))return d("LOOP",`Seamless jump not needed - already in valid position (${i})`),void(this.card.si=!1);s=i%e}d("LOOP",`Performing seamless jump: virtual ${i} → real ${s}`),this.card.si=!0,this.card.sliderElement&&(this.card.sliderElement.style.transition="none",this.card.sliderElement.offsetHeight),this.card.currentIndex=s,this.card.updateSlider(!1),requestAnimationFrame(()=>{try{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.ti(!0)),d("LOOP",`Seamless jump completed - now at real position ${s}, ready for continued scrolling`)}catch(t){d("ERROR","Error in seamless jump transition restoration:",t)}finally{this.card.si=!1}})}catch(t){d("ERROR","Error during seamless jump execution:",t),this.card.si=!1}})}},o=t=>{t.target!==this.card.sliderElement||"transform"!==t.propertyName||s||(d("LOOP","Transform transition ended, executing seamless jump"),this.card.sliderElement.removeEventListener("transitionend",o),this.re=null,setTimeout(n,10))};this.card.sliderElement&&e>0&&(this.re=o,this.card.sliderElement.addEventListener("transitionend",o));const a=e+Math.min(100,.1*e);this.ae=setTimeout(()=>{this.re&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener("transitionend",this.re),this.re=null),s||(d("LOOP","Executing seamless jump via timeout fallback"),n())},a)}he(){this.ae&&(clearTimeout(this.ae),this.ae=null,this.card.si&&(d("LOOP","Clearing seamless jump flag during cancellation"),this.card.si=!1),this.re&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener("transitionend",this.re),this.re=null),d("LOOP","Cancelled pending seamless jump and cleaned up event listeners"))}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return t;if(!("loopback"===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return{nextIndex:t+1,shouldChangeDirection:!1};if("loopback"===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?(n=t-Math.abs(i),n<0&&("none"!==e&&s>1?"infinite"===e||(n=s+n,n<0&&(n=s-1)):n=0)):i<0&&(n=t+Math.abs(i),n>=s&&("none"!==e&&s>1?"infinite"===e||(n-=s,n>=s&&(n=0)):n=s-1)),d("LOOP","Swipe navigation:",{currentIndex:t,skipCount:i,mode:e,totalVisibleCards:s,nextIndex:n}),n}}class Nt{constructor(t){this.card=t}getBehavior(){return this.card.ii.swipe_behavior||"single"}calculateSkipCount(t,i,e,s){if("single"===s)return 1;let n;if("carousel"===(this.card.ii.view_mode||"single")){const t=this.card.ii.cards_visible||this.card.ai(),i=(t-1)*(Math.max(0,parseInt(this.card.ii.card_spacing))||0);n=(this.card.slideWidth-i)/t}else n="horizontal"===this.card.Qt?this.card.slideWidth:this.card.slideHeight;const o=Math.max(1,Math.round(i/n));if(t>.8){let s=1;t>.8&&(s=2),t>1.5&&(s=3),t>2.5&&(s=4);const a=Math.max(s,o);return d("SWIPE","Quick swipe detected:",{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),velocityBasedSkip:s,distanceBasedSkip:o,result:a}),Math.min(a,Math.min(4,e-1))}return d("SWIPE","Controlled drag detected:",{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),distanceBasedSkip:o}),Math.min(o,e-1)}calculateAnimationDuration(t){const i=this.card.visibleCardIndices.length;if(i<=3){const i=800,e=500*(t-1),s=Math.min(i+e,2400);return d("SWIPE","Animation duration (few cards):",t,"cards,",s+"ms"),s}const e=200*(t-1),s=Math.min(1200+50*i,2e3),n=Math.min(600+e,s);return d("SWIPE","Animation duration (many cards):",{skipCount:t,totalCards:i,baseDuration:600,extraDuration:e,maxDuration:s,finalDuration:n+"ms"}),n}getEasingFunction(t){return 1===t?"ease-out":"cubic-bezier(0.25, 0.46, 0.45, 0.94)"}}class SimpleSwipeCard extends mt{constructor(){super(),d("INIT","SimpleSwipeCard Constructor invoked."),this.ii={},this.Oi=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.Qt="horizontal",this.ni=void 0,this.de=void 0,this.ki=null,this.le=null,this.swipeGestures=new bt(this),this.autoSwipe=new xt(this),this.resetAfter=new yt(this),this.pagination=new Et(this),this.cardBuilder=new Ct(this),this.stateSynchronization=new $t(this),this.carouselView=new _t(this),this.loopMode=new Ot(this),this.swipeBehavior=new Nt(this),this.ce=!1,this.pe=!1,this.ue=null,this.ge=null,window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[]),this.me=this.me.bind(this),d("INIT","SimpleSwipeCard Constructor completed successfully.")}firstUpdated(t){d("LIFECYCLE","firstUpdated called for wrapper card"),!this.initialized&&this.ii?.cards&&(d("INIT","firstUpdated: Initializing build."),this.cardBuilder.build().then(()=>{this.isConnected&&(d("LIFECYCLE","Build finished in firstUpdated, setting up features"),this.fe())}).catch(t=>{console.error("SimpleSwipeCard: Build failed in firstUpdated:",t),d("ERROR","Build failed, card may not function properly")}))}static async getConfigElement(){return d("SYSTEM","SimpleSwipeCard.getConfigElement called"),await customElements.whenDefined("simple-swipe-card-editor"),document.createElement("simple-swipe-card-editor")}static getStubConfig(){return d("SYSTEM","SimpleSwipeCard.getStubConfig called"),{type:"custom:simple-swipe-card",cards:[]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(d("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.ii=JSON.parse(JSON.stringify(t)),Array.isArray(this.ii.cards)||(this.ii.cards=[]),void 0===this.ii.show_pagination&&(this.ii.show_pagination=!0),void 0===this.ii.auto_hide_pagination)this.ii.auto_hide_pagination=0;else{const t=parseInt(this.ii.auto_hide_pagination);isNaN(t)||t<0?this.ii.auto_hide_pagination=0:this.ii.auto_hide_pagination=Math.min(t,3e4)}if(void 0===this.ii.card_spacing)this.ii.card_spacing=15;else{const t=parseInt(this.ii.card_spacing);this.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.ii.enable_loopback&&void 0===this.ii.loop_mode&&(this.ii.loop_mode=this.ii.enable_loopback?"loopback":"none",delete this.ii.enable_loopback,d("CONFIG","Migrated enable_loopback to loop_mode:",this.ii.loop_mode)),void 0===this.ii.loop_mode&&(this.ii.loop_mode="none"),["none","loopback","infinite"].includes(this.ii.loop_mode)||(d("CONFIG","Invalid loop_mode, defaulting to 'none':",this.ii.loop_mode),this.ii.loop_mode="none"),this.loopMode?.initialize(),void 0!==this.ii.swipe_direction&&["horizontal","vertical"].includes(this.ii.swipe_direction)||(this.ii.swipe_direction="horizontal"),"vertical"!==this.ii.swipe_direction||t.grid_options?this.removeAttribute("data-vertical-no-grid"):this.setAttribute("data-vertical-no-grid",""),this.closest("hui-card-preview")||this.closest("hui-card-element-editor")?this.setAttribute("data-editor-mode",""):this.removeAttribute("data-editor-mode"),void 0===this.ii.swipe_behavior&&(this.ii.swipe_behavior="single"),["single","free"].includes(this.ii.swipe_behavior)?"free"===this.ii.swipe_behavior&&"infinite"!==this.ii.loop_mode&&(this.ii.swipe_behavior="single",d("CONFIG","Free swipe behavior requires infinite loop mode, defaulting to single")):this.ii.swipe_behavior="single",void 0===this.ii.enable_auto_swipe&&(this.ii.enable_auto_swipe=!1),void 0===this.ii.auto_swipe_interval?this.ii.auto_swipe_interval=2e3:(this.ii.auto_swipe_interval=parseInt(this.ii.auto_swipe_interval),(isNaN(this.ii.auto_swipe_interval)||this.ii.auto_swipe_interval<500)&&(this.ii.auto_swipe_interval=2e3)),void 0===this.ii.enable_reset_after&&(this.ii.enable_reset_after=!1),void 0===this.ii.reset_after_timeout?this.ii.reset_after_timeout=3e4:(this.ii.reset_after_timeout=parseInt(this.ii.reset_after_timeout),(isNaN(this.ii.reset_after_timeout)||this.ii.reset_after_timeout<5e3)&&(this.ii.reset_after_timeout=3e4)),void 0===this.ii.reset_target_card?this.ii.reset_target_card=1:this.ii.reset_target_card=Math.max(1,parseInt(this.ii.reset_target_card)),void 0===this.ii.view_mode&&(this.ii.view_mode="single"),["single","carousel"].includes(this.ii.view_mode)||(this.ii.view_mode="single"),"carousel"===this.ii.view_mode){if(void 0===this.ii.card_min_width)this.ii.card_min_width=200;else{const t=parseInt(this.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.ii.card_min_width=200)}if(void 0!==this.ii.cards_visible){const t=parseFloat(this.ii.cards_visible);isNaN(t)||t<1.1||t>8?this.ii.cards_visible=2.5:this.ii.cards_visible=Math.round(10*t)/10}}t.card_mod?(d("CARD_MOD","Card-mod configuration detected",t.card_mod),this.ki=JSON.parse(JSON.stringify(t.card_mod))):this.ki=null,this.Qt=this.ii.swipe_direction,this.ve=this.ii.view_mode||"single",delete this.ii.title}ai(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth;if(t<=0)return d("LOOP","Container width not available, using default cards_visible: 2.5"),2.5;const i=this.ii.card_min_width||200,e=Math.max(0,parseInt(this.ii.card_spacing))||0,s=(t+e)/(i+e);return Math.max(1.1,Math.round(10*s)/10)}Ui(){d("VISIBILITY","Handling conditional card visibility change"),this.we&&clearTimeout(this.we),this.we=setTimeout(()=>{this.be(),this.we=null},150)}be(){if(!this.ii?.cards||!this.Oi){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||d("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=wt(t.visibility,this.Oi);let s=!0;if("conditional"===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(d("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.xe(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Vi(){if(!this.ii?.cards||!this.Oi){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||d("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=wt(t.visibility,this.Oi);let s=!0;"conditional"===t.type&&t.conditions&&(s=this.ye(t.conditions));e&&s&&this.visibleCardIndices.push(i)});if(JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)){if(d("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.xe(t),this.building||!this.initialized)return void d("VISIBILITY","Skipping visibility rebuild during initial setup to prevent flicker");this.Ee()}}ye(t){return!t||!Array.isArray(t)||0===t.length||(!this.Oi||t.every(t=>{try{return this.Ie(t)}catch(i){return d("VISIBILITY","Error evaluating conditional card condition:",t,i),!0}}))}Ie(t){if(!t||"object"!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:a}=t,r=i||(!e||void 0===s&&void 0===n?null:"state")||(!e||void 0===o&&void 0===a?null:"numeric_state");switch(r){case"state":{if(!e||!this.Oi.states[e])return d("VISIBILITY",`Entity ${e} not found for conditional card state condition`),!1;const t=this.Oi.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return d("VISIBILITY",`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return d("VISIBILITY",`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case"numeric_state":{if(!e||!this.Oi.states[e])return d("VISIBILITY",`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.Oi.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==a&&(i=i&&t<parseFloat(a)),d("VISIBILITY",`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return d("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const i=this.Oi.user;if(i&&i.id){const e=t.users.includes(i.id);return d("VISIBILITY",`User condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(d("VISIBILITY","Unknown or invalid conditional card condition:",t),!1):(d("VISIBILITY",`Unknown condition type: ${r}`),!0)}}Ee(){this.Se&&clearTimeout(this.Se),this.Se=setTimeout(()=>{this.initialized&&this.isConnected&&!this.building&&(d("VISIBILITY","Performing debounced rebuild due to visibility changes"),this.cardBuilder.build()),this.Se=null},300)}xe(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=t[this.currentIndex],e=this.visibleCardIndices.indexOf(i);if(-1!==e)this.currentIndex=e,d("VISIBILITY",`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,d("VISIBILITY",`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),d("VISIBILITY",`Adjusted to maintain relative position: ${this.currentIndex}`))}}Te(){this.Ce&&clearTimeout(this.Ce),this.Ce=setTimeout(()=>{this.Vi(),this.Ce=null},200)}$e(t){d("ERROR",`${t}`),this.ii={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}_e(){d("CONFIG","Updating child card configs"),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.ii.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){d("CONFIG","Updating config for visible card",i,"original index",t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}Oe(){if(d("CONFIG","Updating layout options (pagination, spacing, direction)"),this.Qt!==this.ii.swipe_direction)return this.Qt=this.ii.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.ki&&this.Di()}set hass(t){if(!t)return;const i=this.Oi;if(i===t)return;const e=!i||i.states!==t.states,s=!i||i.user!==t.user,n=!i||JSON.stringify(i.config)!==JSON.stringify(t.config);if(e||s||n){if(d("INIT","Setting hass (changed)"),this.Oi=t,this.stateSynchronization?.onHassChange(i,t),this.si)return d("LOOP","Skipping hass-triggered visibility update during seamless jump"),void this.Ne(t);if(this.building)return d("VISIBILITY","Skipping visibility update during build to prevent rebuild flicker"),void this.Ne(t);e&&(this.Ce&&(clearTimeout(this.Ce),this.Ce=null),this.Vi()),this.Ne(t)}else this.Ne(t)}Ne(t){this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}})}connectedCallback(){super.connectedCallback(),d("LIFECYCLE","connectedCallback - simplified for wrapper card"),this.si&&(d("INIT","Clearing stuck seamless jump flag on connect"),this.si=!1),this.addEventListener("config-changed",this.me.bind(this));this.cards&&this.cards.length>0&&!this.cardContainer&&this.ii?(d("LIFECYCLE","Detected reconnection scenario - rebuilding card"),this.cardBuilder.build().then(()=>{this.isConnected&&(d("LIFECYCLE","Reconnection build completed"),this.fe())}).catch(t=>{console.error("SimpleSwipeCard: Reconnection build failed:",t),d("ERROR","Reconnection build failed, swipe may not work")})):this.initialized&&this.cardContainer&&(d("LIFECYCLE","connectedCallback: Handling reconnection with intact DOM"),this.Yi(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.ki&&(this.Di(),this.ji()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage(),d("LIFECYCLE","About to call _handleDropdownOverflow (reconnection)"),this.fe()),d("LIFECYCLE","connectedCallback finished")}disconnectedCallback(){super.disconnectedCallback(),d("INIT","disconnectedCallback - Enhanced cleanup starting"),this.ke&&(clearTimeout(this.ke),this.ke=null),this.De&&this.cardContainer&&(this.cardContainer.removeEventListener("click",this.De,{capture:!0}),this.De=null),this.Re&&(clearTimeout(this.Re),this.Re=null),this.ce&&this.Me(),this.ue&&window.removeEventListener("pointerdown",this.ue,{capture:!0}),this.pe=!1,this.removeEventListener("config-changed",this.me.bind(this));try{this.Ae(),this.Le(),this.Pe(),this.ze(),this.Ve()}catch(t){console.warn("Error during cleanup:",t)}this.initialized=!1,d("INIT","disconnectedCallback - Enhanced cleanup completed")}Ae(){["_visibilityRebuildTimeout","_conditionalVisibilityTimeout","_visibilityUpdateTimeout","_layoutRetryCount"].forEach(t=>{this[t]&&(clearTimeout(this[t]),this[t]=null,d("INIT",`Cleared timeout: ${t}`))})}Le(){try{this.resizeObserver&&(this.resizeObserver.cleanup(),this.resizeObserver=null),this.swipeGestures&&(this.swipeGestures.removeGestures(),this.swipeGestures.bt=!1,this.swipeGestures.Ct=!1),this.autoSwipe&&(this.autoSwipe.stop(),this.autoSwipe.ci=null,this.autoSwipe.ui=null),this.resetAfter&&(this.resetAfter.stopTimer(),this.resetAfter.bi=null),this.stateSynchronization&&this.stateSynchronization.stop(),d("INIT","Feature managers cleaned up (state preserved)")}catch(t){console.warn("Error cleaning up feature managers:",t)}}Pe(){this.cardContainer=null,this.sliderElement=null,this.pagination&&this.pagination.paginationElement&&(this.pagination.paginationElement=null),d("INIT","DOM references and observers cleaned up (cards preserved)")}ze(){if(this.le)try{this.le.disconnect(),this.le=null,d("CARD_MOD","Card-mod observer cleaned up")}catch(t){console.warn("Error cleaning up card-mod observer:",t)}}Ve(){this.swipeGestures&&this.swipeGestures.Dt&&(clearTimeout(this.swipeGestures.Dt),this.swipeGestures.Dt=null,this.swipeGestures.Rt=!1),this.loopMode&&this.loopMode.ae&&(clearTimeout(this.loopMode.ae),this.loopMode.ae=null,this.si=!1),d("INIT","Remaining event listeners cleared")}me(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.We||(d("EVENT","Root element received config-changed event:",t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&d("ELEMENT","Caught element editor event, allowing normal propagation"))}Yi(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;d("INIT","Setting up resize observer.");let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(d("INIT","Resize detected, recalculating layout.",{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i(s,o))},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{d("INIT","Removing resize observer."),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,(t,i)=>{(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(d("INIT","Resize detected, recalculating layout.",{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.cardBuilder.finishBuildLayout())}))}ti(t){return function(t,i=null){if(!t)return"none";let e="0.3s",s="ease-out";if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue("--simple-swipe-card-transition-speed").trim(),o=t.getPropertyValue("--simple-swipe-card-transition-easing").trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}Di(){!function(t,i,e,s,n){if(t&&i){if(t.style){d("CARD_MOD","Applying card-mod styles");const o=document.createElement("style");o.setAttribute("id","card-mod-styles"),o.textContent=t.style;const a=i.querySelector("#card-mod-styles");if(a)try{i.removeChild(a)}catch(t){d("CARD_MOD","Error removing existing style:",t)}try{if(!i||!i.appendChild)return void d("ERROR","shadowRoot is invalid for appendChild operation");i.appendChild(o)}catch(t){return void d("ERROR","Failed to append card-mod styles:",t)}if(e){d("CARD_MOD","Forwarding CSS variables from host to shadow DOM");try{const t=window.getComputedStyle(e),o=[i.querySelector(".card-container"),s,n].filter(Boolean),a=["--simple-swipe-card-pagination-dot-inactive-color","--simple-swipe-card-pagination-dot-active-color","--simple-swipe-card-pagination-dot-inactive-opacity","--simple-swipe-card-pagination-dot-active-opacity","--simple-swipe-card-pagination-dot-size","--simple-swipe-card-pagination-dot-active-size","--simple-swipe-card-pagination-border-radius","--simple-swipe-card-pagination-dot-spacing","--simple-swipe-card-pagination-background","--simple-swipe-card-pagination-padding","--simple-swipe-card-pagination-bottom","--simple-swipe-card-pagination-right","--simple-swipe-card-transition-speed","--simple-swipe-card-transition-easing","--simple-swipe-card-pagination-fade-duration","--simple-swipe-card-pagination-animation-type","--simple-swipe-card-pagination-animation-delay","--simple-swipe-card-pagination-animation-easing"];o.forEach(i=>{i&&a.forEach(e=>{try{const s=t.getPropertyValue(e);s&&(d("CARD_MOD",`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))}catch(t){d("CARD_MOD",`Error forwarding ${e}:`,t)}})})}catch(t){d("ERROR","Error forwarding CSS variables:",t)}}}}else d("CARD_MOD","No card-mod config or shadow root, skipping style application")}(this.ki,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}ji(){this.le&&(this.le.disconnect(),this.le=null),this.le=function(t,i){const e=new MutationObserver(t=>{t.some(t=>"attributes"===t.type&&("style"===t.attributeName||t.attributeName.includes("style")))&&(d("CARD_MOD","Host style attribute changed, reapplying card-mod styles"),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:["style"]}),d("CARD_MOD","Set up mutation observer for style changes")),e}(this.shadowRoot,()=>{this.Di()})}goToSlide(t,i=1,e=!0){this.ne=i;const s=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===s||!this.initialized||this.building)return void d("SWIPE","goToSlide skipped",{totalVisible:s,initialized:this.initialized,building:this.building});const n=this.ii.view_mode||"single",o=this.ii.loop_mode||"none";t=this.loopMode.handleNavigation(t,"carousel"===n),this.currentIndex=t,d("SWIPE",`Going to visible slide ${this.currentIndex} (${n} mode)`);const a="infinite"===o?(this.currentIndex%s+s)%s:this.currentIndex;this.stateSynchronization?.onCardNavigate(a),this.updateSlider(e),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.ii.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){this.cardContainer&&(this.slideWidth=this.cardContainer.offsetWidth,this.slideHeight=this.cardContainer.offsetHeight);const i=this.visibleCardIndices.length;if(d("SWIPE",`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.ii.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void d("SWIPE","updateSlider skipped",{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.ii.card_spacing))||0,s=this.ii.view_mode||"single",n=this.ii.loop_mode||"none";if("carousel"===s&&this.carouselView){this.sliderElement.style.gap=`${e}px`;let i=t?null:0;if(t&&"free"===this.ii.swipe_behavior&&this.ne>1){i=this.swipeBehavior.calculateAnimationDuration(this.ne);const t=this.swipeBehavior.getEasingFunction(this.ne);this.sliderElement.style.transition=`transform ${i}ms ${t}`,d("SWIPE",`Carousel multi-card animation: ${this.ne} cards, ${i}ms duration, easing: ${t}`)}return this.carouselView.updateSliderPosition(this.currentIndex,t),this.pagination.update(t),this.ne=1,void(t&&i>0&&this.loopMode.scheduleSeamlessJump(this.currentIndex,i))}const o="horizontal"===this.Qt;let a=this.currentIndex;if("infinite"===n&&i>1){const t=this.loopMode.getDuplicateCount();a=this.currentIndex+t,d("SWIPE",`Infinite mode: logical index ${this.currentIndex} -> DOM position ${a}`)}else"none"!==n&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),a=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let r=0;r=o?a*(this.slideWidth+e):a*(this.slideHeight+e);let h=null;if(t&&"free"===this.ii.swipe_behavior&&this.ne>1){h=this.swipeBehavior.calculateAnimationDuration(this.ne);const t=this.swipeBehavior.getEasingFunction(this.ne);this.sliderElement.style.transition=`transform ${h}ms ${t}`,d("SWIPE",`Multi-card animation: ${this.ne} cards, ${h}ms duration, easing: ${t}`)}else this.sliderElement.style.transition=this.ti(t);this.sliderElement.style.transform=o?`translateX(-${r}px)`:`translateY(-${r}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight="0px",t.slide.style.marginLeft="0px",t.slide.style.marginTop="0px",t.slide.style.marginBottom="0px")}),this.pagination.update(t),this.ne=1,d("SWIPE",`Slider updated, DOM position: ${a}, transform: -${r}px along ${o?"X":"Y"} axis`),t&&(h>0||null===h)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,h)}Fe(t){if(this.pagination.paginationElement){this.pagination.paginationElement.querySelectorAll(".pagination-dot").forEach((i,e)=>{i.classList.toggle("active",e===t)})}}getCardSize(){if(0===this.visibleCardIndices.length)return 3;let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&"function"==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn("Error getting card size from current element:",i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return d("CONFIG","Calculated card size:",t),Math.max(3,t)}fe(){this.cardContainer&&!this.pe&&(this.pe=!0,this.ue=this.Me.bind(this),this.cardContainer.addEventListener("pointerdown",t=>{if(this.ce)return;const i=Date.now();if(this.ge&&i-this.ge<100)return;this.ge=i;const e=this.Zt(t);if(this.Ue(e)){if(d("SYSTEM","Dropdown trigger detected. Applying layout fix with click-controlled restoration."),this.ce=!0,this.ke&&(clearTimeout(this.ke),this.ke=null),this.swipeGestures.removeGestures(),this.sliderElement&&this.cardContainer){const t=this.cardContainer.getBoundingClientRect(),i=this.sliderElement.getBoundingClientRect();this.Be={containerHeight:t.height,sliderWidth:i.width},this.cardContainer.style.height=`${this.Be.containerHeight}px`,this.He=this.sliderElement.style.transform;const e=this.currentIndex;let s=e;if("infinite"===this.ii.loop_mode&&this.visibleCardIndices.length>1){const t=this.loopMode.getDuplicateCount();s=e+t}this.sliderElement.classList.add("dropdown-fix-active"),this.sliderElement.classList.add("dropdown-fix-active-hide-adjacent"),this.sliderElement.style.transform="none";this.sliderElement.querySelectorAll(".slide").forEach((t,i)=>{i===s?t.classList.add("current-active"):t.classList.remove("current-active")}),this.sliderElement.style.position="absolute",this.sliderElement.style.width=`${this.Be.sliderWidth}px`,this.sliderElement.style.left="0px",this.sliderElement.style.top="0px"}this.shadowRoot.host.style.overflow="visible",this.cardContainer.style.overflow="visible",this.Re=setTimeout(()=>{this.ce&&this.isConnected&&(this.Ye(),d("SYSTEM","Click restoration listener added. Will restore after next click."))},300),d("SYSTEM","Layout fix applied. Click listener will be added in 300ms.")}},{capture:!0}))}Ye(){if(!this.cardContainer)return;const t=i=>{d("SYSTEM","Click detected, restoring layout in 200ms (allowing selection to complete)"),this.cardContainer.removeEventListener("click",t,{capture:!0}),this.ke=setTimeout(()=>{d("SYSTEM","Click processing complete, restoring layout now"),this.Me()},200)};this.cardContainer.addEventListener("click",t,{capture:!0}),this.De=t}Me(){if(this.ce){if(this.ce=!1,d("SYSTEM","Restoring layout and card visibility."),this.ke&&(clearTimeout(this.ke),this.ke=null),this.De&&this.cardContainer&&(this.cardContainer.removeEventListener("click",this.De,{capture:!0}),this.De=null),this.sliderElement&&this.cardContainer){const t=this.sliderElement.style.transition;this.sliderElement.style.transition="none",this.sliderElement.classList.remove("dropdown-fix-active"),this.sliderElement.classList.remove("dropdown-fix-active-hide-adjacent");this.sliderElement.querySelectorAll(".slide").forEach(t=>{t.classList.remove("current-active")}),this.sliderElement.style.position="",this.sliderElement.style.left="",this.sliderElement.style.top="",this.sliderElement.style.width="",this.cardContainer.style.height="",this.Be=null,void 0!==this.He&&(this.sliderElement.style.transform=this.He,this.He=void 0),setTimeout(()=>{this.sliderElement&&(this.sliderElement.style.transition=t||"")},10)}this.shadowRoot.host.style.overflow="",this.cardContainer&&(this.cardContainer.style.overflow=""),setTimeout(()=>{this.isConnected&&this.visibleCardIndices.length>1&&this.swipeGestures.addGestures(),this.ge=null},150)}}Ue(t){if(!t)return!1;let i=t;for(let t=0;t<8&&i&&i!==this.cardContainer;t++){const t=i.tagName?.toLowerCase(),e=i.className||"",s=i.getAttribute&&i.getAttribute("role");if("ha-select"===t||"mwc-select"===t||"mushroom-select"===t||"mushroom-select-card"===t)return!0;if("combobox"===s)return!0;if(i.classList?.contains("mdc-select"))return!0;if("string"==typeof e&&(e.includes("mushroom-select")||e.includes("mushroom-card")||e.includes("mdc-menu")||e.includes("mdc-list-item")||e.includes("mdc-select__anchor")||e.includes("mdc-select__selected-text")))return!0;if(i.hasAttribute&&(i.hasAttribute("data-mdc-select")||i.hasAttribute("aria-haspopup")))return!0;i=i.parentElement}let e=t;for(;e&&e!==this.cardContainer;){if("mushroom-select-card"===e.tagName?.toLowerCase())return!0;e=e.parentElement}return!1}Zt(t){return t.composedPath&&t.composedPath().length?t.composedPath()[0]:t.target}}class kt{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0},this.je=null,this.Je=null}cleanup(){this.je&&(clearTimeout(this.je),this.je=null),this.Je&&(clearTimeout(this.Je),this.Je=null),d("EDITOR","EditorUIManager cleanup completed")}async initializeEditor(){this.editor.We=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.Ge=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.Xe=this.editor.eventHandling.qe.bind(this.editor.eventHandling),this.editor.Ze=new Set,this.editor.Ke=null,this.editor.Qe=!1,this.editor.ts={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null};Tt(o).set(this.editor.We,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;if(!customElements.get("hui-card-picker"))for(;!customElements.get("hui-card-picker")&&t<10;){try{if(await this.loadCustomElements(),customElements.get("hui-card-picker"))return}catch(t){}await new Promise(t=>setTimeout(t,100)),t++}}async loadCustomElements(){if(!customElements.get("hui-card-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-conditional-card")?.getConfigElement?.(),()=>customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),()=>customElements.get("hui-horizontal-stack-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("hui-card-picker"))break}catch(t){}}catch(t){}}ensureCardPickerLoaded(){this.editor.shadowRoot&&(this.je&&clearTimeout(this.je),this.je=setTimeout(()=>{this.es(),this.je=null},100))}es(){d("EDITOR","_ensureCardPickerLoaded called");const t=this.editor.shadowRoot.querySelector("#card-picker-container");if(t){t.style.display="block",t.hasAttribute("event-barrier-applied")||(t.setAttribute("event-barrier-applied","true"),t.addEventListener("config-changed",t=>{this.ss(t)},{capture:!0,passive:!1}));const i=t.querySelector("hui-card-picker");i&&(i.style.display="block",i.requestUpdate&&!i.ns&&(i.requestUpdate(),i.ns=!0))}this.rs()}ss(t){if(d("EDITOR","Intercepted config-changed at container level:",t.detail?.config?.type),t.target&&t.target.tagName&&"hui-card-picker"===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(d("EDITOR","Processing card selection:",i.type),this.editor.ii){const t=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[];t.push(i),this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.rs()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1}rs(){this.Je||(this.Je=setTimeout(()=>{this.editor.requestUpdate(),this.Je=null},50))}}class Dt{constructor(t){this.editor=t,this.Je=null}setConfig(t){if(!t)throw new Error("Invalid configuration");if(d("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.editor.ii=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.ii.cards)||(this.editor.ii.cards=[]),void 0===this.editor.ii.show_pagination&&(this.editor.ii.show_pagination=!0),void 0===this.editor.ii.auto_hide_pagination)this.editor.ii.auto_hide_pagination=0;else{const t=parseInt(this.editor.ii.auto_hide_pagination);isNaN(t)||t<0?this.editor.ii.auto_hide_pagination=0:this.editor.ii.auto_hide_pagination=Math.min(t,3e4)}if(void 0===this.editor.ii.card_spacing)this.editor.ii.card_spacing=15;else{const t=parseInt(this.editor.ii.card_spacing);this.editor.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.ii.enable_loopback&&void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode=this.editor.ii.enable_loopback?"loopback":"none",delete this.editor.ii.enable_loopback,d("CONFIG","Migrated enable_loopback to loop_mode:",this.editor.ii.loop_mode)),void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode="none"),["none","loopback","infinite"].includes(this.editor.ii.loop_mode)||(d("CONFIG","Invalid loop_mode, defaulting to 'none':",this.editor.ii.loop_mode),this.editor.ii.loop_mode="none"),void 0!==this.editor.ii.swipe_direction&&["horizontal","vertical"].includes(this.editor.ii.swipe_direction)||(this.editor.ii.swipe_direction="horizontal"),void 0===this.editor.ii.swipe_behavior&&(this.editor.ii.swipe_behavior="single"),["single","free"].includes(this.editor.ii.swipe_behavior)?"free"===this.editor.ii.swipe_behavior&&"infinite"!==this.editor.ii.loop_mode&&(this.editor.ii.swipe_behavior="single",d("CONFIG","Free swipe behavior requires infinite loop mode, defaulting to single")):this.editor.ii.swipe_behavior="single",void 0===this.editor.ii.enable_auto_swipe&&(this.editor.ii.enable_auto_swipe=!1),void 0===this.editor.ii.auto_swipe_interval?this.editor.ii.auto_swipe_interval=2e3:(this.editor.ii.auto_swipe_interval=parseInt(this.editor.ii.auto_swipe_interval),(isNaN(this.editor.ii.auto_swipe_interval)||this.editor.ii.auto_swipe_interval<500)&&(this.editor.ii.auto_swipe_interval=2e3)),void 0===this.editor.ii.enable_reset_after&&(this.editor.ii.enable_reset_after=!1),void 0===this.editor.ii.reset_after_timeout?this.editor.ii.reset_after_timeout=3e4:(this.editor.ii.reset_after_timeout=parseInt(this.editor.ii.reset_after_timeout),(isNaN(this.editor.ii.reset_after_timeout)||this.editor.ii.reset_after_timeout<5e3)&&(this.editor.ii.reset_after_timeout=3e4)),void 0===this.editor.ii.reset_target_card?this.editor.ii.reset_target_card=1:this.editor.ii.reset_target_card=Math.max(1,parseInt(this.editor.ii.reset_target_card)),void 0===this.editor.ii.view_mode&&(this.editor.ii.view_mode="single"),["single","carousel"].includes(this.editor.ii.view_mode)||(this.editor.ii.view_mode="single"),"carousel"===this.editor.ii.view_mode){if(void 0===this.editor.ii.card_min_width)this.editor.ii.card_min_width=200;else{const t=parseInt(this.editor.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.ii.card_min_width=200)}if(void 0!==this.editor.ii.cards_visible){const t=parseFloat(this.editor.ii.cards_visible);isNaN(t)||t<1.1||t>8?this.editor.ii.cards_visible=2.5:this.editor.ii.cards_visible=Math.round(10*t)/10}}delete this.editor.ii.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.ii||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute("data-option"),s=i.parentElement?.configValue||i.parentElement?.getAttribute("data-option"),n=e||s;if(!n)return;let o;if("ha-entity-picker"===i.localName&&"value-changed"===t.type?o=t.detail.value||null:"ha-switch"===i.localName?o=i.checked:"ha-slider"===i.localName?(o=i.value,null==o&&(o=t.detail?.value||0)):"ha-textfield"===i.localName&&"number"===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o="card_spacing"===n?15:"auto_swipe_interval"===n?2e3:"reset_after_timeout"===n?3e4:"cards_visible"===n?2.5:0)):o=i.value,"auto_hide_pagination"===n&&(o=1e3*parseFloat(o),isNaN(o)||o<0?o=0:o>3e4&&(o=3e4),d("EDITOR",`Auto-hide pagination: ${o/1e3}s = ${o}ms`)),this.editor.ii[n]!==o){if("view_mode"===n){d("EDITOR",`View mode changing from ${this.editor.ii[n]} to ${o}`);const t={...this.editor.ii,[n]:o};return"carousel"===o?(delete t.swipe_direction,t.cards_visible||t.card_min_width||(t.card_min_width=200),d("EDITOR","Cleaned config for carousel mode:",Object.keys(t))):"single"===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction="horizontal"),d("EDITOR","Cleaned config for single mode:",Object.keys(t))),this.editor.ii=t,this.fireConfigChanged(),void this.rs()}if("card_min_width"===n){if(d("EDITOR",`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.ii.cards_visible){const t={...this.editor.ii};delete t.cards_visible,t.card_min_width=o,this.editor.ii=t,d("EDITOR","Migrated from cards_visible to card_min_width")}else this.editor.ii={...this.editor.ii,[n]:o};return this.fireConfigChanged(),void this.rs()}d("EDITOR",`Value changed for ${n}:`,o),this.editor.ii={...this.editor.ii,[n]:o},this.fireConfigChanged(),this.rs()}}rs(){this.Je||(this.Je=setTimeout(()=>{this.editor.requestUpdate(),this.Je=null},50))}handleTimeoutChange(t){const i=parseInt(t.target.value);if(!isNaN(i)&&i>=5){const t=1e3*i;this.editor.ii={...this.editor.ii,reset_after_timeout:t},this.fireConfigChanged()}}handleTargetChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.editor.ii={...this.editor.ii,reset_target_card:i},this.fireConfigChanged())}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&"single"!==t.view_mode&&(i.view_mode=t.view_mode),"carousel"===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",swipe_behavior:"single",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};["card_spacing","swipe_direction","swipe_behavior","show_pagination","auto_hide_pagination"].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),["loop_mode","enable_auto_swipe","auto_swipe_interval","enable_reset_after","reset_after_timeout","reset_target_card","state_entity"].forEach(s=>{"state_entity"===s?t.state_entity&&null!==t.state_entity&&""!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards);return["grid_options","layout_options","view_layout"].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.ii);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent("config-changed",{detail:{config:i,...e},bubbles:s,composed:!0});d("EVENT","Firing config-changed event",{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.We,fromSwipeCardEditor:!0,...t})}cleanup(){this.Je&&(clearTimeout(this.Je),this.Je=null),d("EDITOR","EditorConfigManager cleanup completed")}}class Rt{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:"Unknown",name:"",isPictureElements:!1};const i=t.type.startsWith("custom:")?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ");return{typeName:e,name:t.title||t.name||"",isPictureElements:"picture-elements"===i}}hasNestedCards(t){return!("custom:actions-card"!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&"picture-elements"===t.type}moveCard(t,i){if(!this.editor.ii?.cards)return;const e=[...this.editor.ii.cards],s=t+i;s<0||s>=e.length||(d("EDITOR",`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.ii?.cards||t<0||t>=this.editor.ii.cards.length)return;d("EDITOR",`Removing card at index ${t}`);const i=this.editor.ii.cards.filter((i,e)=>e!==t);this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const s=this.editor.ii.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;d("EDITOR",`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const a=[...this.editor.ii.cards];a[t]={...s,card:n},this.editor.ii={...this.editor.ii,cards:a},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const e=this.editor.ii.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;d("EDITOR",`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.ii.cards];n[t]={...e,card:s},this.editor.ii={...this.editor.ii,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(d("EDITOR",`_editCard called for index ${t}`),!this.editor.ii||!this.editor.ii.cards||t<0||t>=this.editor.ii.cards.length)return void d("ERROR","SimpleSwipeCardEditor: Invalid index for card editing:",t);const i=this.editor.ii.cards[t],e=this.editor.hass,s=document.querySelector("home-assistant");if(e&&s)try{await customElements.whenDefined("hui-dialog-edit-card");const n=document.createElement("hui-dialog-edit-card");n.hass=e,document.body.appendChild(n),this.editor.Ze.add(n),n.hs=this.editor.We,this.isPictureElementsCard(i)&&(n.setAttribute("data-editing-picture-elements","true"),n.ds=!0),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),a=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener("config-changed",o,{capture:!0}),n.addEventListener("show-dialog",a,{capture:!0}),n.addEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",t=>{d("ELEMENT","Element updated event on dialog",t.detail),n.ls=!0,this.editor.eventHandling.ts.active=!0,this.editor.eventHandling.ts.timestamp=Date.now()},{capture:!0}),n.addEventListener("show-edit-element",t=>{d("ELEMENT","Show edit element event on dialog",t.detail),n.ls=!0,this.editor.eventHandling.ts.active=!0,this.editor.eventHandling.ts.timestamp=Date.now()},{capture:!0})),"custom:actions-card"===i.type&&(n.cs=!0);const r=()=>{if(d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener("dialog-closed",r),n.removeEventListener("config-changed",o,{capture:!0}),n.removeEventListener("show-dialog",a,{capture:!0}),n.removeEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener("element-updated",h,{capture:!0}),n.removeEventListener("show-edit-element",l,{capture:!0})),this.editor.Ze.delete(n),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.Ze.size}`),n.ls&&(d("ELEMENT","Element edit session reset due to dialog close"),setTimeout(()=>{this.editor.eventHandling.ts.active&&Date.now()-this.editor.eventHandling.ts.timestamp>500&&(this.editor.eventHandling.ts.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener("dialog-closed",r);const h=t=>{d("ELEMENT","Element updated event on dialog",t.detail),n.ls=!0,this.editor.eventHandling.ts.active=!0,this.editor.eventHandling.ts.timestamp=Date.now()},l=t=>{d("ELEMENT","Show edit element event on dialog",t.detail),n.ls=!0,this.editor.eventHandling.ts.active=!0,this.editor.eventHandling.ts.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",h,{capture:!0}),n.addEventListener("show-edit-element",l,{capture:!0}));const c={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(d("EDITOR",`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n.ps||n.ls){if(d("ELEMENT",`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n.ps=!1,this.editor.eventHandling.ts.timestamp=Date.now(),i){d("ELEMENT","Silently updating config with element changes");const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.us&&!i)return d("ELEMENT",`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.us=null);if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};d("EDITOR",`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(c),d("EDITOR",`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){d("ERROR","SimpleSwipeCardEditor: Error opening edit dialog:",e),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved_fallback"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else d("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}async editNestedCard(t,i){if(d("EDITOR",`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.ii?.cards||!this.editor.ii.cards[t]||!this.hasNestedCards(this.editor.ii.cards[t]))return void d("ERROR","SimpleSwipeCardEditor: Invalid indices for nested card editing:",t,i);const e=this.editor.ii.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,a=document.querySelector("home-assistant");if(o&&a)try{await customElements.whenDefined("hui-dialog-edit-card");const r=document.createElement("hui-dialog-edit-card");r.hass=o,document.body.appendChild(r),this.editor.Ze.add(r),r.hs=this.editor.We,this.isPictureElementsCard(n)&&(r.setAttribute("data-editing-picture-elements","true"),r.ds=!0),r.addEventListener("config-changed",t=>{if(this.editor.eventHandling.gs(t))return d("ELEMENT","Nested card: Detected element editor event, allowing natural propagation"),r.ls=!0,this.editor.eventHandling.ts.active=!0,this.editor.eventHandling.ts.timestamp=Date.now(),void(t.detail&&t.detail.config&&(r.us=JSON.parse(JSON.stringify(t.detail.config)),r.ps=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(d("EDITOR","Marking nested event as already handled in _editNestedCard's dialog"),t.fs=!0)},!0);const h=()=>{if(r.removeEventListener("dialog-closed",h),r.ls&&(d("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.editor.eventHandling.ts.active=!1),this.editor.Ze.delete(r),r.parentNode===document.body)try{document.body.removeChild(r)}catch(t){console.warn("Error removing nested card dialog:",t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};r.addEventListener("dialog-closed",h);const l={cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(r.ps||r.ls){if(d("ELEMENT","Nested card: Save detected from element editor, preserving dialog state"),r.ps=!1,this.editor.eventHandling.ts.timestamp=Date.now(),n){d("ELEMENT","Silently updating nested card config with element changes");const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(r.us&&!n)return d("ELEMENT","Nested card: Element editor cancel detected, restoring previous config"),void(r.us=null);if(!n)return;d("EDITOR",`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const a={...e,card:o},h=[...this.editor.ii.cards];h[t]=a,this.editor.ii={...this.editor.ii,cards:h},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await r.showDialog(l)}catch(o){d("ERROR","SimpleSwipeCardEditor: Error opening edit dialog for nested card:",o),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else d("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}safelyAddCard(t){if(t&&this.editor.ii)try{const i=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],e={...this.editor.ii,cards:[...i,t]};this.editor.ii=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),d("EDITOR","Safely added card:",t.type)}catch(t){d("ERROR","Failed to safely add card:",t)}}handleCardPicked(t){if(d("EDITOR","Fallback _handleCardPicked called:",t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;d("EDITOR","Adding card in fallback handler:",i.type);const e=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],s={...this.editor.ii,cards:[...e,i]};this.editor.ii=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class Mt{constructor(t){this.editor=t,this.Xe=this.qe.bind(this),this.ts={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},this.vs=0,this.ws=1e3}setupEventListeners(){document.addEventListener("config-changed",this.Xe,{capture:!0}),this.bs=t=>{if(this.gs(t)){if(d("ELEMENT","Config-changed event from element editor, allowing propagation"),t.target&&t.target.closest("hui-dialog-edit-card")){const i=t.target.closest("hui-dialog-edit-card");i&&(i.ls=!0,this.ts.active=!0,this.ts.parentDialogId=i.hs||null,this.ts.timestamp=Date.now())}}else if("config-changed"===t.type&&t.detail?.config){const i="custom:actions-card"===t.detail?.config?.type;if("hui-card-picker"===t.target?.tagName?.toLowerCase()){if((t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(d("EDITOR","Card picker selection captured by global handler:",t.detail.config.type),i&&!this.editor.Qe))return this.editor.Ke={time:Date.now(),config:t.detail.config},this.editor.Qe=!0,this.editor.xs(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}}},document.addEventListener("config-changed",this.bs,{capture:!0}),this.ys=t=>{if(t.Es)return d("EVENT","Intercepted iron-select event already processed by actions card editor"),void t.stopPropagation()},document.addEventListener("iron-select",this.ys,{capture:!0}),this.Is=t=>{if(t.target&&"HUI-DIALOG-EDIT-CARD"===t.target.tagName){const i=t.target;d("EDITOR","A HUI-DIALOG-EDIT-CARD closed",{tracked:this.editor.Ze?.has(i)||!1,isActions:this.Ss(i),handlingElementEdit:i.ls}),i.ls&&(d("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.ts.active=!1,i.us&&(d("ELEMENT","Preserving element config on dialog close"),this.ts.savedState=i.us,i.us=null)),this.editor.Ze?.has(i)&&(this.editor.Ze.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&("HUI-DIALOG-EDIT-ELEMENT"===t.target.tagName||"HUI-DIALOG"===t.target.tagName&&this.gs(t))&&(d("ELEMENT","Element editor dialog closed"),setTimeout(()=>{this.ts.active&&Date.now()-this.ts.timestamp>500&&(d("ELEMENT","Resetting element edit session after timeout"),this.ts.active=!1)},500))},document.addEventListener("dialog-closed",this.Is,{capture:!0}),this.Ts=t=>{"element-updated"!==t.type&&"show-edit-element"!==t.type||this.ts.active||(d("ELEMENT",`Capturing ${t.type} event, starting element edit session`),this.ts.active=!0,this.ts.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.ts.elementId=t.detail.elementId))},document.addEventListener("element-updated",this.Ts,{capture:!0}),document.addEventListener("show-edit-element",this.Ts,{capture:!0})}removeEventListeners(){document.removeEventListener("config-changed",this.bs,{capture:!0}),document.removeEventListener("iron-select",this.ys,{capture:!0}),document.removeEventListener("config-changed",this.Xe,{capture:!0}),document.removeEventListener("dialog-closed",this.Is,{capture:!0}),document.removeEventListener("element-updated",this.Ts,{capture:!0}),document.removeEventListener("show-edit-element",this.Ts,{capture:!0})}gs(t){if(!t)return!1;const i=Date.now(),e=i-this.vs>this.ws;if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return e&&(d("ELEMENT","Element editor detected through event detail"),this.vs=i),!0;const s=t.composedPath?t.composedPath():[];for(const t of s)if(t&&t.localName){if("hui-element-editor"===t.localName||"hui-dialog-edit-element"===t.localName||"hui-card-element-editor"===t.localName||t.localName.includes("element-editor"))return e&&(d("ELEMENT","Element editor detected through path node localName:",t.localName),this.vs=i),!0;if(t.Cs||t.$s||t.getAttribute&&(t.getAttribute("element-id")||t.getAttribute("data-element-id"))||t.classList&&t.classList.contains("element-editor"))return d("ELEMENT","Element editor detected through specialized attributes"),!0;if("HUI-DIALOG"===t.tagName&&(t.querySelector(".element-editor")||t._s&&"string"==typeof t._s&&t._s.toLowerCase().includes("element")))return d("ELEMENT","Element editor detected through hui-dialog with element editor content"),!0}return"element-updated"===t.type||"config-changed"===t.type&&t.target&&("hui-element-editor"===t.target.localName||t.target.closest("hui-element-editor"))?(d("ELEMENT","Element editor detected through event characteristics"),!0):!!(this.ts.active&&Date.now()-this.ts.timestamp<5e3)&&(d("ELEMENT","Element editor event detected through active editing session"),!0)}Ss(t){if(!t)return!1;if(t.cs)return!0;try{const i=t.cardConfig;return i&&"custom:actions-card"===i.type}catch(t){return!1}}qe(t,i){let e,s;if(t&&"function"==typeof t.preventDefault?(e=t,s=null):(s=t,e=i),!e)return;if(s&&"auto_hide_pagination"===s.option)return;if(e.detail&&(e.detail.fromSwipeCardEditor||e.detail.fromElementEditor||e.detail.elementEditorEvent||e.detail.maintainEditorState))return void d("ELEMENT","Skipping our own generated event to prevent loop");if(this.gs(e)){d("ELEMENT","Detected element editor event in _handleNestedCardEvents");if(e.composedPath&&this.editor.Ze&&e.composedPath().some(t=>this.editor.Ze.has(t)||t.hs&&t.hs===this.editor.We))return void d("ELEMENT","Element editor event is related to our dialog stack, handling specially")}if(e.Os||!e.detail?.fromActionCardEditor)return;const n=e.target.closest("[data-index]");if(!n||!this.editor.ii?.cards)return;const o=parseInt(n.getAttribute("data-index"));if(!(isNaN(o)||o<0||o>=this.editor.ii.cards.length)){if(d("EVENT",`Handling nested card event from actions card at index ${o}`,e.detail),e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.detail.maintainEditorState){d("EVENT","Event marked to maintain editor state, preventing propagation");const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type,maintainEditorState:!0})}else{const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type})}e.Os=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(" > "):"No path",i=e.detail?JSON.stringify(e.detail,null,2):"{}";d("EVENT","Config change event details:",{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.gs(e)){if(d("ELEMENT",`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.ls=!0,this.ts.active=!0,this.ts.timestamp=Date.now(),e.detail&&e.detail.config&&(i.us=JSON.parse(JSON.stringify(e.detail.config)),i.ps=!0,i.ds))try{d("ELEMENT","Silently updating picture-elements config");const i=[...this.editor.ii.cards];i[t]=e.detail.config,this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){d("ERROR","Error silently updating config:",t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;d("EDITOR",`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.ii.cards];s[t]=i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:"child_dialog_update_"+(e.detail.fromActionCardEditor?"action_card":"generic")}),this.editor.requestUpdate(),d("EDITOR",`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else d("EDITOR",`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&("hui-dialog-edit-element"===i.detail.dialogTag||i.detail.dialogTag.includes("element-editor"))||i.detail.elementToEdit)){d("ELEMENT",`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.ls=!0),this.ts.active=!0,this.ts.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.ts.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):"{}";d("EDITOR",`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),d("EDITOR",`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),St(this.editor,i.type,i.detail)}}function At(t,i,e,s,n,o,a,r){const h=t.loop_mode||"none",d=!0===t.enable_auto_swipe,l=t.auto_swipe_interval??2e3,c=!0===t.enable_reset_after,p=t.reset_after_timeout??3e4,u=t.reset_target_card??1,g=t.state_entity||"";let m=0,f=0;"none"!==h&&m++,d&&m++,c&&!d&&m++,c&&d&&f++,g&&m++;let v="",w="";return m>0&&(v=`${m} active`),f>0&&(w=`${f} blocked`),Z`
    <div class="collapsible-section">
      <div
        class="section-toggle ${i.advanced?"expanded":""}"
        @click=${()=>s("advanced")}
      >
        <ha-icon
          class="section-toggle-icon ${i.advanced?"expanded":""}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${v?Z`<div class="section-toggle-badge">${v}</div>`:""}
        ${w?Z`<div class="section-toggle-badge blocked-only">
              ${w}
            </div>`:""}
      </div>

      <div
        class="section-content compact-options ${i.advanced?"expanded":"collapsed"}"
      >
        ${function(t,i){return Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${"none"===t?"Stop at first/last card (no looping)":"loopback"===t?"Jump back to first/last card":"Continuous loop navigation"}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t}
          data-option="loop_mode"
          @change=${i}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${"none"}> No looping </ha-list-item>
          <ha-list-item .value=${"loopback"}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${"infinite"}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
    </div>
  `}(h,e)}
        ${function(t,i,e){return Z`
    <div class="option-row">
      <div class="option-label">Enable auto-swipe</div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_auto_swipe"
          @change=${e}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">Automatically cycle through cards</div>

    ${t?Z`
          <ha-textfield
            label="Auto-swipe interval (ms)"
            .value=${i.toString()}
            data-option="auto_swipe_interval"
            type="number"
            min="500"
            suffix="ms"
            @change=${e}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">Time between swipes (min. 500ms).</div>
        `:""}
  `}(d,l,e)}
        ${function(t,i,e,s,n,o,a,r){return Z`
    <div class="option-row">
      <div class="option-label">Enable reset after timeout</div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_reset_after"
          @change=${o}
          ?disabled=${i}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      ${i?"Disabled when auto-swipe is on":"Auto-return after inactivity"}
    </div>

    ${t&&!i?Z`
          <ha-textfield
            label="Reset timeout (seconds)"
            .value=${Math.round(e/1e3).toString()}
            type="number"
            min="5"
            max="3600"
            suffix="sec"
            @change=${a}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Time of inactivity before resetting (5s to 1h)
          </div>

          <ha-textfield
            label="Target card (1-based)"
            .value=${s.toString()}
            type="number"
            min="1"
            max=${(Math.max(0,n.length-1)+1).toString()}
            @change=${r}
            ?disabled=${0===n.length}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Which card to return to
            ${0===n.length?"Add cards first to set a target.":`(current range: 1-${n.length})`}
          </div>
        `:""}
  `}(c,d,p,u,n,e,o,a)}
        ${function(t,i,e){const s=Object.keys(i.states||{}).filter(t=>t.startsWith("input_select.")||t.startsWith("input_number.")).sort().map(t=>({entityId:t,friendlyName:i.states[t].attributes.friendly_name||t.replace(/^(input_select\.|input_number\.)/,"").replace(/_/g," ")}));return Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t||""}
          data-option="state_entity"
          @change=${e}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${""}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${s.map(t=>Z`
              <ha-list-item .value=${t.entityId}>
                ${t.friendlyName}
                <span
                  style="color: var(--secondary-text-color); font-size: 0.9em; margin-left: 8px;"
                >
                  (${t.entityId})
                </span>
              </ha-list-item>
            `)}
        </ha-select>
      </div>
    </div>
  `}(g,r,e)}
      </div>
    </div>
  `}function Lt(t,i,e,s,n,o,a,r,h,d,l,c){return Z`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?Z`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((p,u)=>function(t,i,e,s,n,o,a,r,h,d,l,c,p,u){const g=r(t),m=h(t),f=m?d(t):[],v=l(t),w=!s||wt(t.visibility,s);return Z`
    <div
      class="card-row ${w?"":"hidden-card"}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${g.typeName}</span>
        ${g.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:""}
        ${v&&w?Z`<span class="visibility-badge">Conditional</span>`:""}
        ${g.name?Z`<span class="card-name">(${g.name})</span>`:""}
      </div>
      <div class="card-actions">
        ${v&&!w?Z`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:""}
        <ha-icon-button
          label="Move Up"
          ?disabled=${0===i}
          path="M7,15L12,10L17,15H7Z"
          @click=${()=>n(i,-1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Move Down"
          ?disabled=${i===e-1}
          path="M7,9L12,14L17,9H7Z"
          @click=${()=>n(i,1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Edit Card"
          path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
          @click=${()=>o(i)}
        ></ha-icon-button>
        <ha-icon-button
          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
          @click=${()=>a(i)}
          style="color: var(--error-color);"
        ></ha-icon-button>
      </div>
    </div>
    ${m?function(t,i,e,s,n,o){return Z`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const h=e(a);return Z`
          <div
            class="nested-card-row"
            data-parent-index=${i}
            data-nested-index=${r}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${i+1}.${r+1}</span
              >
              <span class="nested-card-type">${h.typeName}</span>
              ${h.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:""}
              ${h.name?Z`<span class="nested-card-name"
                    >(${h.name})</span
                  >`:""}
            </div>
            <div class="nested-card-actions">
              <ha-icon-button
                label="Move Up"
                ?disabled=${0===r}
                path="M7,15L12,10L17,15H7Z"
                @click=${()=>s(i,r,-1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Move Down"
                ?disabled=${r===t.length-1}
                path="M7,9L12,14L17,9H7Z"
                @click=${()=>s(i,r,1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Edit Card"
                path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                @click=${()=>n(i,r)}
              ></ha-icon-button>
              <ha-icon-button
                label="Delete Card"
                path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                @click=${()=>o(i,r)}
                style="color: var(--error-color);"
              ></ha-icon-button>
            </div>
          </div>
        `})}
    </div>
  `}(f,i,r,c,p,u):""}
  `}(p,u,t.length,i,e,s,n,o,a,r,h,d,l,c))}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends mt{static get properties(){return{hass:{type:Object},ii:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return It()}constructor(){super(),d("EDITOR","SimpleSwipeCardEditor Constructor invoked."),d("EDITOR","Editor styles method available:",!!this.constructor.styles),this.uiManager=new kt(this),this.configManager=new Dt(this),this.cardManagement=new Rt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor()}gs(t){return this.eventHandling.gs(t)}Ss(t){return this.eventHandling.Ss(t)}Ns(t){return this.cardManagement.isPictureElementsCard(t)}ks(t){return this.cardManagement.hasVisibilityConditions(t)}Ds(t){this.uiManager.toggleSection(t)}Rs(t){return this.cardManagement.hasNestedCards(t)}Ms(t){return this.cardManagement.getNestedCards(t)}As(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}Ls(t,i){this.cardManagement.removeNestedCard(t,i)}async Ps(t,i){await this.cardManagement.editNestedCard(t,i)}async zs(t){await this.cardManagement.editCard(t)}Vs(t){this.cardManagement.handleCardPicked(t)}Ws(t){return this.cardManagement.getCardDescriptor(t)}Fs(t,i){this.cardManagement.moveCard(t,i)}Us(t){this.cardManagement.removeCard(t)}xs(t){this.cardManagement.safelyAddCard(t)}Bs(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager||(d("EDITOR","Reinitializing managers in setConfig"),this.uiManager=new kt(this),this.configManager=new Dt(this),this.cardManagement=new Rt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor()),this.configManager.setConfig(t)}Hs(t){this.configManager.handleValueChanged(t)}Ys(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.ii)return Z`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;if(!this.uiManager||!this.configManager||!this.cardManagement)return Z`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.ii.cards||[];try{return Z`
        <div class="card-config">
          ${Z`
    <div class="info-panel">
      <div class="info-icon">
        <ha-icon icon="mdi:information"></ha-icon>
      </div>
      <div class="info-text">
        Add cards using the picker below. Edit and reorder them in the Cards
        section. Use Advanced Options for auto-swipe, reset timers, and loopback
        features.
      </div>
    </div>
  `}
          ${function(t,i){const e=t.view_mode||"single";return Z`
    <div class="section">
      <div
        class="section-header-with-controls ${"single"===e?"single-mode":"carousel-mode"}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${"single"===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Single</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="carousel"
              .checked=${"carousel"===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${"carousel"===e?Z`
            ${void 0!==t.cards_visible?Z`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${t.cards_visible}</span
                    >
                  </div>
                `:""}

            <ha-textfield
              label="Minimum Card Width (px)"
              .value=${(t.card_min_width||200).toString()}
              data-option="card_min_width"
              type="number"
              min="50"
              max="500"
              step="10"
              suffix="px"
              @change=${i}
              @keydown=${t=>{"Enter"===t.key&&(t.preventDefault(),t.stopPropagation(),t.target.blur())}}
              @input=${t=>{const i=parseFloat(t.target.value);i<50||i>500||isNaN(i)?t.target.style.borderColor="var(--error-color, #f44336)":t.target.style.borderColor=""}}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${void 0!==t.cards_visible?"Changing this value will switch to responsive mode and remove the cards_visible setting":"Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size."}
            </div>
          `:""}
    </div>
  `}(this.ii,this.Hs.bind(this))}
          ${function(t,i){const e=!1!==t.show_pagination,s=t.card_spacing??15,n=t.swipe_direction||"horizontal",o=t.swipe_behavior||"single",a=t.view_mode||"single";return Z`
    <div class="section">
      <div class="section-header">Display Options</div>

      <ha-textfield
        label="Card Spacing (px)"
        .value=${s.toString()}
        data-option="card_spacing"
        type="number"
        min="0"
        max="100"
        suffix="px"
        @change=${i}
        autoValidate
        pattern="[0-9]+"
        required
      ></ha-textfield>
      <div class="help-text">Visual gap between cards</div>

      ${"single"===a?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${n}
                  data-option="swipe_direction"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${"horizontal"}>
                    Horizontal
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-horizontal"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"vertical"}>
                    Vertical
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-vertical"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
          `:Z`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${"single"!==a||"vertical"!==n||t.grid_options?"":Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Vertical swiping without grid_options configured will use a
                default height of 250px. For better control, configure
                grid_options in the Layout tab or add it to your YAML.
              </span>
            </div>
          `}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${"infinite"===t.loop_mode?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${o}
                  data-option="swipe_behavior"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${"single"}>
                    Single card
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:numeric-1-circle"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"free"}>
                    Free swipe
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
          `:Z`
            <!-- Show info when not in infinite mode -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span
                >Free swipe behavior is only available with infinite loop
                mode</span
              >
            </div>
          `}

      <div class="option-row pagination-option">
        <div class="option-label">Show pagination dots</div>
        <div class="option-control">
          <ha-switch
            .checked=${e}
            data-option="show_pagination"
            @change=${i}
          ></ha-switch>
        </div>
      </div>

      ${e?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-help">
                  Hide pagination dots after inactivity
                </div>
              </div>
              <div class="option-control">
                <div class="auto-hide-control">
                  <div class="auto-hide-value">
                    ${0===(t.auto_hide_pagination||0)?"Never":(t.auto_hide_pagination||0)/1e3+"s"}
                  </div>
                  <ha-slider
                    .value=${(t.auto_hide_pagination||0)/1e3}
                    .min=${0}
                    .max=${10}
                    .step=${.5}
                    data-option="auto_hide_pagination"
                    @input=${i}
                    @change=${i}
                    pin
                  ></ha-slider>
                </div>
              </div>
            </div>
          `:""}
    </div>
  `}(this.ii,this.Hs.bind(this))}
          ${At(this.ii,this.uiManager.getCollapsibleState(),this.Hs.bind(this),this.Ds.bind(this),i,this.js.bind(this),this.Js.bind(this),this.hass)}
          ${Lt(i,this.hass,this.Fs.bind(this),this.zs.bind(this),this.Us.bind(this),this.Ws.bind(this),this.Rs.bind(this),this.Ms.bind(this),this.ks.bind(this),this.As.bind(this),this.Ps.bind(this),this.Ls.bind(this))}
          ${e=this.hass,s=this.lovelace,n=this.Ge,Z`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
          ${function(){const i=document.createElement("div");i.className="version-display";const e=document.createElement("div");e.className="version-text",e.textContent="Simple Swipe Card";const s=document.createElement("div");s.className="version-badges";const n=document.createElement("div");n.className="version-badge",n.textContent=`v${t}`;const o=document.createElement("a");o.href="https://github.com/nutteloost/simple-swipe-card",o.target="_blank",o.rel="noopener noreferrer",o.className="github-badge";const a=document.createElement("ha-icon");a.icon="mdi:github";const r=document.createElement("span");return r.textContent="GitHub",o.appendChild(a),o.appendChild(r),s.appendChild(n),s.appendChild(o),i.appendChild(e),i.appendChild(s),i}()}
        </div>
      `}catch(t){return console.error("Simple Swipe Card Editor render error:",t),Z`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${t.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`}var e,s,n}js(t){this.configManager.handleTimeoutChange(t)}Js(t){this.configManager.handleTargetChange(t)}Gs(t){const i=1e3*parseFloat(t.target.value);this.ii={...this.ii,auto_hide_pagination:i},this.Xs()}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),d("EDITOR","SimpleSwipeCardEditor connectedCallback");try{this.uiManager||(d("EDITOR","Reinitializing managers after reconnection"),this.uiManager=new kt(this),this.configManager=new Dt(this),this.cardManagement=new Rt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor());Tt(a,"Set").add(this);try{await this.uiManager.ensureComponentsLoaded()}catch(t){d("EDITOR","Warning: Could not load all components")}this.eventHandling?.setupEventListeners&&this.eventHandling.setupEventListeners(),setTimeout(()=>{this.uiManager?.ensureCardPickerLoaded&&this.uiManager.ensureCardPickerLoaded()},50),this.requestUpdate()}catch(t){console.error("Error during editor setup:",t),this.requestUpdate()}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),d("EDITOR","SimpleSwipeCardEditor disconnectedCallback");try{this.uiManager&&(this.uiManager.cleanup(),this.uiManager=null),this.configManager&&(this.configManager.cleanup(),this.configManager=null),this.cardManagement=null,this.eventHandling=null,this.eventHandling?.removeEventListeners(),this.Ze&&this.Ze.clear(),this.We=null}catch(t){console.warn("Error during editor cleanup:",t)}try{Tt(a,"Set").delete(this);const t=Tt(o);this.We&&t.delete(this.We)}catch(t){console.warn("Error unregistering editor:",t)}d("EDITOR","SimpleSwipeCardEditor cleanup completed")}}async function Pt(){try{await async function(){return d("SYSTEM","Using bundled LitElement dependencies"),!0}(),d("SYSTEM","Dependencies loaded, registering components"),customElements.get("simple-swipe-card")||(customElements.define("simple-swipe-card",SimpleSwipeCard),d("SYSTEM","SimpleSwipeCard component registered")),customElements.get("simple-swipe-card-editor")||(customElements.define("simple-swipe-card-editor",SimpleSwipeCardEditor),d("SYSTEM","SimpleSwipeCardEditor component registered")),zt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;")}catch(t){console.error("SimpleSwipeCard: Failed to initialize:",t)}}function zt(){const t={type:"simple-swipe-card",name:"Simple Swipe Card",preview:!0,description:"A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout."};window.customCards&&!window.customCards.some(t=>"simple-swipe-card"===t.type)&&(window.customCards.push(t),d("SYSTEM","Card registered with Home Assistant customCards registry"))}vt()?vt().then(()=>{zt(),Pt()}).catch(t=>{console.error("SimpleSwipeCard: Error waiting for Card Helpers:",t),Pt()}):window.customCards?(zt(),Pt()):"loading"===document.readyState?window.addEventListener("load",()=>{zt(),Pt()},{once:!0}):setTimeout(()=>{zt(),Pt()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};
