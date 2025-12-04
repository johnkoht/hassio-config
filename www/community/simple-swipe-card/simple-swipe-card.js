const t='2.7.0',i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:'single',cards_visible:2.5,card_min_width:200,auto_height:!1,enable_backdrop_filter:!1},e='_simpleSwipeEditorRegistry',s='_simpleSwipeCardEditors',n={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!1,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0,AUTO_HEIGHT:!0},o=new Map,a=(t,...i)=>{if(!1===n[t])return;const e=`${t}:${i[0]}`,s=Date.now();o.has(e)&&s-o.get(e)<5e3||(['AUTO','SWIPE','VISIBILITY'].includes(t)||['Setting hass','Visible cards updated','Auto-swipe','Updating slider'].some(t=>i[0]&&i[0].toString().includes(t)))&&o.set(e,s)},r=globalThis,d=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&'adoptedStyleSheets'in Document.prototype&&'replace'in CSSStyleSheet.prototype,h=Symbol(),l=new WeakMap;let c=class t{constructor(t,i,e){if(this.i=!0,e!==h)throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(d&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=l.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&l.set(i,t))}return t}toString(){return this.cssText}};const u=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if('number'==typeof t)return t;throw Error('Value passed to \'css\' function must be a \'css\' function result: '+t+'. Use \'unsafeCSS\' to pass non-literal values, but take care to ensure page security.')})(e)+t[s+1],t[0]);return new c(e,t,h)},p=d?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i='';for(const e of t.cssRules)i+=e.cssText;return(t=>new c('string'==typeof t?t:t+'',void 0,h))(i)})(t):t,{is:m,defineProperty:g,getOwnPropertyDescriptor:f,getOwnPropertyNames:v,getOwnPropertySymbols:w,getPrototypeOf:b}=Object,I=globalThis,y=I.trustedTypes,E=y?y.emptyScript:'',S=I.reactiveElementPolyfillSupport,x=(t,i)=>t,T={toAttribute(t,i){switch(i){case Boolean:t=t?E:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},C=(t,i)=>!m(t,i),$={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:C};Symbol.metadata??=Symbol('metadata'),I.litPropertyMetadata??=new WeakMap;let O=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=$){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&g(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=f(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static m(){if(this.hasOwnProperty(x('elementProperties')))return;const t=b(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x('finalized')))return;if(this.finalized=!0,this.m(),this.hasOwnProperty(x('properties'))){const t=this.properties,i=[...v(t),...w(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(p(t))}else void 0!==t&&i.push(p(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:'string'==typeof e?e:'string'==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.N=null,this._()}_(){this.M=new Promise(t=>this.enableUpdating=t),this.R=new Map,this.D(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.A??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.A?.delete(t)}D(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(d)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement('style'),s=r.litNonce;void 0!==s&&i.setAttribute('nonce',s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.A?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.A?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:T).toAttribute(i,e.type);this.N=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this.N=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this.N!==s){const t=e.getPropertyOptions(s),n='function'==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:T;this.N=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.U?.get(s)??o,this.N=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??C)(n,i)||e.useDefault&&e.reflect&&n===this.U?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.M=this.H())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.U??=new Map).has(t)&&(this.U.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.R.has(t)||(this.hasUpdated||e||(i=void 0),this.R.set(t,i)),!0===s&&this.N!==t&&(this.V??=new Set).add(t))}async H(){this.isUpdatePending=!0;try{await this.M}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.R.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.R;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.A?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.F()}catch(i){throw t=!1,this.F(),i}t&&this.B(i)}willUpdate(t){}B(t){this.A?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}F(){this.R=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.M}shouldUpdate(t){return!0}update(t){this.V&&=this.V.forEach(t=>this.P(t,this[t])),this.F()}updated(t){}firstUpdated(t){}};O.elementStyles=[],O.shadowRootOptions={mode:'open'},O[x('elementProperties')]=new Map,O[x('finalized')]=new Map,S?.({ReactiveElement:O}),(I.reactiveElementVersions??=[]).push('2.1.1');const N=globalThis,_=N.trustedTypes,M=_?_.createPolicy('lit-html',{createHTML:t=>t}):void 0,R='$lit$',D=`lit$${Math.random().toFixed(9).slice(2)}$`,A='?'+D,k=`<${A}>`,L=document,P=()=>L.createComment(''),z=t=>null===t||'object'!=typeof t&&'function'!=typeof t,U=Array.isArray,H='[ \t\n\f\r]',V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,B=/>/g,W=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,'g'),Y=/'/g,G=/"/g,j=/^(?:script|style|textarea|title)$/i,J=(t,...i)=>({W:1,strings:t,values:i}),X=Symbol.for('lit-noChange'),q=Symbol.for('lit-nothing'),Z=new WeakMap,K=L.createTreeWalker(L,129);function Q(t,i){if(!U(t)||!t.hasOwnProperty('raw'))throw Error('invalid template strings array');return void 0!==M?M.createHTML(i):i}const tt=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?'<svg>':3===i?'<math>':'',a=V;for(let i=0;i<e;i++){const e=t[i];let r,d,h=-1,l=0;for(;l<e.length&&(a.lastIndex=l,d=a.exec(e),null!==d);)l=a.lastIndex,a===V?'!--'===d[1]?a=F:void 0!==d[1]?a=B:void 0!==d[2]?(j.test(d[2])&&(n=RegExp('</'+d[2],'g')),a=W):void 0!==d[3]&&(a=W):a===W?'>'===d[0]?(a=n??V,h=-1):void 0===d[1]?h=-2:(h=a.lastIndex-d[2].length,r=d[1],a=void 0===d[3]?W:'"'===d[3]?G:Y):a===G||a===Y?a=W:a===F||a===B?a=V:(a=W,n=void 0);const c=a===W&&t[i+1].startsWith('/>')?' ':'';o+=a===V?e+k:h>=0?(s.push(r),e.slice(0,h)+R+e.slice(h)+D+c):e+D+(-2===h?i:c)}return[Q(t,o+(t[e]||'<?>')+(2===i?'</svg>':3===i?'</math>':'')),s]};class it{constructor({strings:t,W:i},e){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[d,h]=tt(t,i);if(this.el=it.createElement(d,e),K.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(R)){const i=h[o++],e=s.getAttribute(t).split(D),a=/([.?@])?(.*)/.exec(i);r.push({type:1,index:n,name:a[2],strings:e,ctor:'.'===a[1]?at:'?'===a[1]?rt:'@'===a[1]?dt:ot}),s.removeAttribute(t)}else t.startsWith(D)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(D),i=t.length-1;if(i>0){s.textContent=_?_.emptyScript:'';for(let e=0;e<i;e++)s.append(t[e],P()),K.nextNode(),r.push({type:2,index:++n});s.append(t[i],P())}}}else if(8===s.nodeType)if(s.data===A)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(D,t+1));)r.push({type:7,index:n}),t+=D.length-1}n++}}static createElement(t,i){const e=L.createElement('template');return e.innerHTML=t,e}}function et(t,i,e=t,s){if(i===X)return i;let n=void 0!==s?e.Y?.[s]:e.G;const o=z(i)?void 0:i.J;return n?.constructor!==o&&(n?.X?.(!1),void 0===o?n=void 0:(n=new o(t),n.q(t,e,s)),void 0!==s?(e.Y??=[])[s]=n:e.G=n),void 0!==n&&(i=et(t,n.Z(t,i.values),n,s)),i}class st{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??L).importNode(i,!0);K.currentNode=s;let n=K.nextNode(),o=0,a=0,r=e[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new nt(n,n.nextSibling,this,t):1===r.type?i=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(i=new ht(n,this,t)),this.K.push(i),r=e[++a]}o!==r?.index&&(n=K.nextNode(),o++)}return K.currentNode=L,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class nt{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=q,this.tt=void 0,this.dt=t,this.ht=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.dt.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.dt}get endNode(){return this.ht}nt(t,i=this){t=et(this,t,i),z(t)?t===q||null==t||''===t?(this.rt!==q&&this.lt(),this.rt=q):t!==this.rt&&t!==X&&this.ct(t):void 0!==t.W?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||'function'==typeof t?.[Symbol.iterator])(t)?this.k(t):this.ct(t)}O(t){return this.dt.parentNode.insertBefore(t,this.ht)}T(t){this.rt!==t&&(this.lt(),this.rt=this.O(t))}ct(t){this.rt!==q&&z(this.rt)?this.dt.nextSibling.data=t:this.T(L.createTextNode(t)),this.rt=t}$(t){const{values:i,W:e}=t,s='number'==typeof e?this.ut(t):(void 0===e.el&&(e.el=it.createElement(Q(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new st(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=Z.get(t.strings);return void 0===i&&Z.set(t.strings,i=new it(t)),i}k(t){U(this.rt)||(this.rt=[],this.lt());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new nt(this.O(P()),this.O(P()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.lt(e&&e.ht.nextSibling,s),i.length=s)}lt(t=this.dt.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.ht;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class ot{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=q,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||''!==e[0]||''!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=q}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=et(this,t,i,0),o=!z(t)||t!==this.rt&&t!==X,o&&(this.rt=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=et(this,s[e+a],i,a),r===X&&(r=this.rt[a]),o||=!z(r)||r!==this.rt[a],r===q?t=q:t!==q&&(t+=(r??'')+n[a+1]),this.rt[a]=r}o&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??'')}}class at extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class rt extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class dt extends ot{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=et(this,t,i,0)??q)===X)return;const e=this.rt,s=t===q&&e!==q||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==q&&(e===q||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){'function'==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class ht{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){et(this,t)}}const lt=N.litHtmlPolyfillSupport;lt?.(it,nt),(N.litHtmlVersions??=[]).push('3.3.1');const ct=globalThis;class ut extends O{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.vt;if(void 0===n){const t=e?.renderBefore??null;s.vt=n=new nt(i.insertBefore(P(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return X}}ut.wt=!0,ut.finalized=!0,ct.litElementHydrateSupport?.({LitElement:ut});const pt=ct.litElementPolyfillSupport;function mt(){return window.loadCardHelpers&&'function'==typeof window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith('custom:')){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement('div');return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement('div');return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement('div');return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function gt(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating condition:',t,i),!0}}):(a('VISIBILITY','No hass object available for condition evaluation'),!0))}function ft(t,i){if(!t||'object'!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','AND condition has empty \'conditions\' array'),!0;const e=t.conditions.every(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating nested AND condition:',t,i),!1}});return a('VISIBILITY',`AND condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','OR condition has empty \'conditions\' array'),!1;const e=t.conditions.some(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating nested OR condition:',t,i),!1}});return a('VISIBILITY',`OR condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'not':if(!t.condition)return a('VISIBILITY','NOT condition missing \'condition\' property'),!1;try{const e=ft(t.condition,i),s=!e;return a('VISIBILITY',`NOT condition result: ${s} (nested was ${e})`),s}catch(i){return a('VISIBILITY','Error evaluating nested NOT condition:',t.condition,i),!1}case'state':{if(!s||!i.states[s])return a('VISIBILITY',`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return a('VISIBILITY',`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return a('VISIBILITY',`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case'numeric_state':{if(!s||!i.states[s])return a('VISIBILITY',`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),a('VISIBILITY',`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return a('VISIBILITY',`Screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return a('VISIBILITY',`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return a('VISIBILITY',`Unknown condition type: ${e}`),!0}}pt?.({LitElement:ut}),(ct.litElementVersions??=[]).push('4.2.1');class vt{constructor(t){this.card=t,this.bt=!1,this.It=0,this.yt=0,this.Et=0,this.St=0,this.xt=0,this.Tt=0,this.Ct=!1,this.$t=!1,this.Ot=0,this.Nt=0,this._t=!1,this.Mt=8,this.Rt=null,this.Dt=!1,this.At=300,this.kt=0,this.Lt=.3,this.Pt=this.zt.bind(this),this.Ut=this.Ht.bind(this),this.Vt=this.Ft.bind(this),this.Bt=this.Ht.bind(this),this.Wt=this.Ft.bind(this),this.Yt=this.Gt.bind(this),this.jt=this.Jt.bind(this)}removeGestures(){a('SWIPE','Removing swipe gesture listeners'),this.card.cardContainer&&(this.card.cardContainer.removeEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.removeEventListener('touchmove',this.Ut,{passive:!1}),this.card.cardContainer.removeEventListener('touchend',this.Vt,{passive:!0}),this.card.cardContainer.removeEventListener('touchcancel',this.Vt,{passive:!0}),this.card.cardContainer.removeEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.removeEventListener('click',this.Yt,{capture:!0}),this.card.cardContainer.removeEventListener('pointerdown',this.jt,{capture:!0}),this.card.cardContainer.removeEventListener('pointerup',this.jt,{capture:!0}),a('SWIPE','Removed swipe listeners from cardContainer.')),window.removeEventListener('mousemove',this.Bt,{passive:!1}),window.removeEventListener('mouseup',this.Wt,{passive:!0}),a('SWIPE','Removed potential swipe listeners from window.'),this.bt=!1,this.Ct=!1,this.Rt&&(clearTimeout(this.Rt),this.Rt=null,this.Dt=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?a('SWIPE','Skipping addSwiperGesture',{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(a('SWIPE','Adding swipe listeners with click prevention.'),this.card.cardContainer.addEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.addEventListener('touchmove',this.Ut,{passive:!1}),this.card.cardContainer.addEventListener('touchend',this.Vt,{passive:!0}),this.card.cardContainer.addEventListener('touchcancel',this.Vt,{passive:!0}),this.card.cardContainer.addEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.addEventListener('click',this.Yt,{capture:!0}),this.card.cardContainer.addEventListener('pointerdown',this.jt,{capture:!0}),this.card.cardContainer.addEventListener('pointerup',this.jt,{capture:!0}),this.Xt())}Gt(t){if(this.Dt||this.bt)return a('SWIPE','Click prevented during/after swipe gesture'),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1;if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),e=['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','a','input','select','textarea'];for(let t=0;t<Math.min(10,i.length);t++){const s=i[t];if(s===this.card.cardContainer||s===this.card.sliderElement)break;if(s.nodeType===Node.ELEMENT_NODE){const t=s.localName?.toLowerCase(),i=s.getAttribute?.('role');if(e.includes(t)||'button'===i)return void a('SWIPE','Allowing click - button found in path:',t||i)}}}}Jt(t){if(this.bt&&this._t)return t.preventDefault(),t.stopPropagation(),!1;if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),e=['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','a','input','select','textarea'];for(let t=0;t<Math.min(10,i.length);t++){const s=i[t];if(s===this.card.cardContainer||s===this.card.sliderElement)break;if(s.nodeType===Node.ELEMENT_NODE){const t=s.localName?.toLowerCase(),i=s.getAttribute?.('role');if(e.includes(t)||'button'===i)return void a('SWIPE','Allowing pointer event - button found in path:',t||i)}}}}qt(t=this.At){this.Dt=!0,this.kt=Date.now(),this.Rt&&clearTimeout(this.Rt),this.Rt=setTimeout(()=>{this.Dt=!1,this.Rt=null,a('SWIPE','Click blocking period ended')},t),a('SWIPE',`Blocking clicks for ${t}ms`)}zt(t){if(a('SWIPE','Swipe Start:',t.type),this.card.pagination?.showPagination(),this.bt||'mousedown'===t.type&&0!==t.button)return void a('SWIPE','Swipe Start ignored (already dragging or wrong button)');if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();for(let t=0;t<Math.min(15,i.length);t++){const e=i[t];if(e===this.card.cardContainer||e===this.card.sliderElement)break;if(e.nodeType===Node.ELEMENT_NODE&&this.Zt(e))return void a('SWIPE','Swipe Start ignored - found interactive element in path:',e.localName)}}else{const i=this.Kt(t);if(this.Zt(i))return void a('SWIPE','Swipe Start ignored (interactive element):',i)}this.bt=!0,this.Ct=!1,this._t=!1,this.Nt=0,this.Ot=Date.now(),this.$t=!0;const i='touchstart'===t.type?t.touches[0]:t;if(this.It=i.clientX,this.yt=i.clientY,this.Et=this.It,this.St=this.yt,this.Tt=this.Ot,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.xt=i.m41,'vertical'===this.card.Qt&&(this.xt=i.m42),this.card.sliderElement.style.transition=this.card.ti(!1),this.card.sliderElement.style.cursor='grabbing'}'mousedown'===t.type&&(a('SWIPE','Attaching mousemove/mouseup listeners to window'),t.preventDefault(),window.addEventListener('mousemove',this.Bt,{passive:!1}),window.addEventListener('mouseup',this.Wt,{passive:!0})),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}Ht(t){if(!this.bt)return;const i='touchmove'===t.type,e=i?t.touches[0]:t,s=e.clientX,n=e.clientY,o=s-this.It,r=n-this.yt,d=Date.now(),h=Math.sqrt(o*o+r*r);this.Nt=Math.max(this.Nt,h);const l='horizontal'===this.card.Qt,c=l?o:r,u=l?r:o;if(!this.Ct&&Math.abs(u)>Math.abs(c)&&Math.abs(u)>10&&(a('SWIPE',`${l?'Vertical':'Horizontal'} scroll detected, cancelling ${l?'horizontal':'vertical'} drag.`),this.Ct=!0,this.$t=!1),h>this.Mt&&(this._t=!0),!this.Ct&&Math.abs(c)>this.Mt){a('SWIPE',(l?'Horizontal':'Vertical')+' move detected'),i||t.preventDefault(),l?this.Et=s:this.St=n;let e=c;!0!==this.card.ii.enable_loopback&&(0===this.card.currentIndex&&e>0||this.card.currentIndex===this.card.visibleCardIndices.length-1&&e<0)&&(e*=.5*(.3+.7/(1+Math.abs(e)/(l?this.card.slideWidth:this.card.slideHeight)*.5)));const o=this.xt+e;this.card.sliderElement&&(this.card.sliderElement.style.transform=l?`translateX(${o}px)`:`translateY(${o}px)`,this.ei(o)),this.Tt=d}}Ft(t){if(a('SWIPE','Swipe End:',t.type),!this.bt)return void a('SWIPE','Swipe End ignored (not dragging)');this.card.si&&a('SWIPE','WARNING: Swipe end during seamless jump - this might indicate a stuck flag'),'mouseup'===t.type&&(a('SWIPE','Removing mousemove/mouseup listeners from window'),window.removeEventListener('mousemove',this.Bt),window.removeEventListener('mouseup',this.Wt));const i=this._t&&this.Nt>this.Mt,e=Date.now()-this.Ot,s=e<200,n='horizontal'===this.card.Qt,o=n?this.Et-this.It:this.St-this.yt,r=Date.now()-this.Tt,d=r>10?Math.abs(o)/r:0,h=d>this.Lt;(i||s&&h)&&(this.qt(h?400:300),a('SWIPE','Prevented clicks after swipe gesture',{movement:this.Nt,velocity:d,gestureTime:e,eventType:t.type})),this.$t=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.ti(!0),this.card.sliderElement.style.cursor='',!i)return void a('SWIPE','Swipe End: Not dragging or already processed.');if(this.Ct||'touchcancel'===t.type)return a('SWIPE','Swipe End: Scrolling or Cancelled - Snapping back.'),this.card.updateSlider(),void(this.Ct=!1);const e=Math.max(1,Date.now()-this.Ot),s=Math.abs(o)/e,r=n?this.card.slideWidth:this.card.slideHeight,d=this.card.ii.view_mode||'single';let h;if('carousel'===d){const t=this.card.ii.cards_visible||2.5,i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;h=(this.card.slideWidth-(t-1)*i)/t*.2}else h=.2*r;let l=this.card.currentIndex;const c=this.card.ii.loop_mode||'none',u=this.card.visibleCardIndices.length,p=this.card.ii.swipe_behavior||'single';let m=1;Math.abs(o)>h||Math.abs(s)>this.Lt?(a('SWIPE','Swipe threshold crossed:',{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:u,loopMode:c,swipeBehavior:p}),m=this.card.swipeBehavior.calculateSkipCount(s,Math.abs(o),u,p),l=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,o>0?m:-m),a('SWIPE',`Swipe resulted in navigation: ${this.card.currentIndex} → ${l} (${c} mode, ${p} behavior, skip: ${m})`)):a('SWIPE','Swipe threshold NOT crossed:',{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,viewMode:d,swipeBehavior:p}),l!==this.card.currentIndex?(a('SWIPE',`Swipe resulted in index change to ${l}`),this.card.ni='infinite'===this.card.ii.loop_mode?this.card.loopMode.getWrappedIndexForPagination(this.card.currentIndex):this.card.currentIndex,this.card.goToSlide(l,m),setTimeout(()=>{this.card.isConnected&&!this.card.oi&&this.card.resetAfter?.startTimer()},100)):(a('SWIPE','Swipe did not cross threshold or velocity, snapping back.'),this.card.updateSlider())}),setTimeout(()=>{this.card.pagination?.showAndStartTimer()},100)}ei(t){if(!this.card.pagination?.paginationElement||this.card.visibleCardIndices.length<=1)return;const i='horizontal'===this.card.Qt,e=this.card.ii.view_mode||'single',s=Math.max(0,parseInt(this.card.ii.card_spacing))||0,n=t-this.xt;let o;if('carousel'===e){const t=this.card.ii.cards_visible||this.card.ai();o=Math.round(-n/((this.card.slideWidth-(t-1)*s)/t+s))}else o=Math.round(-n/((i?this.card.slideWidth:this.card.slideHeight)+s));this.card.pagination.updateDuringSwipe(this.card.currentIndex+o)}Zt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute('role');if('svg'===i||'canvas'===i)return a('SWIPE','Allowing swipe on chart element:',i),!1;if(['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','ha-cover-controls'].includes(i))return a('SWIPE','Blocking swipe on button/icon element:',i),!0;const s=t.className&&'string'==typeof t.className?t.className:t.className?.toString()||'',n=t.id||'';if(s.includes('slider')||n.includes('slider')||'slider'===e||'range'===e)return a('SWIPE','_isInteractiveOrScrollable: Found slider element:',t),!0;try{const i=window.getComputedStyle(t).touchAction,e='horizontal'===this.card.Qt;if(i){if(e&&i.includes('pan-x'))return a('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-x for horizontal swipe:',t),!0;if(!e&&i.includes('pan-y'))return a('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-y for vertical swipe:',t),!0}}catch(t){}if(['input','textarea','select','a','audio'].includes(i))return a('SWIPE','_isInteractiveOrScrollable: Found basic interactive element:',i),!0;if(e&&['checkbox','switch','slider','link','menuitem','textbox','combobox','option','range'].includes(e))return a('SWIPE','_isInteractiveOrScrollable: Found interactive role:',e),!0;let o=t,r=0;for(;o&&o!==this.card.sliderElement&&o!==this.card.cardContainer&&r<10;){if(o.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(o);if(('auto'===t.overflowY||'scroll'===t.overflowY)&&o.scrollHeight>o.clientHeight+1||('auto'===t.overflowX||'scroll'===t.overflowX)&&o.scrollWidth>o.clientWidth+1)return a('SWIPE','_isInteractiveOrScrollable: Found scrollable ancestor:',o),!0;const i=o.className&&'string'==typeof o.className?o.className:o.className?.toString()||'',e=o.id||'';if(i.includes('slider')||e.includes('slider'))return a('SWIPE','_isInteractiveOrScrollable: Found slider-like ancestor:',o),!0}catch(t){a('ERROR','Error accessing style/scroll properties:',o,t)}o=o.assignedSlot||o.parentNode||(o.getRootNode()instanceof ShadowRoot?o.getRootNode().host:null),r++}return!1}Kt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();if(i&&i.length>0){const t=i[0];if(t&&t.nodeType===Node.ELEMENT_NODE)return t}}return t.target}Xt(){if(!this.card.ii.show_pagination||!this.card.ii.auto_hide_pagination)return;const t=this.card.cardContainer;t&&(t.addEventListener('mouseenter',this.ri.bind(this),{passive:!0}),t.addEventListener('mouseleave',this.di.bind(this),{passive:!0}),t.addEventListener('touchstart',this.hi.bind(this),{passive:!0}),t.addEventListener('touchend',this.li.bind(this),{passive:!0}))}ri(){this.card.pagination?.showPagination()}di(){this.bt||this.card.pagination?.showAndStartTimer()}hi(){this.card.pagination?.showPagination()}li(){setTimeout(()=>{this.bt||this.card.pagination?.showAndStartTimer()},50)}}class wt{constructor(t){this.card=t,this.ci=null,this.ui=!1,this.pi=null,this.oi=!1,this.mi=1,this.gi=0,this.fi=this.wi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(a('AUTO','Starting auto-swipe with interval:',this.card.ii.auto_swipe_interval),this.start()))}start(){this.ci&&this.stop(),this.mi=1,this.ui=!1,this.ci=setInterval(this.fi,this.card.ii.auto_swipe_interval),a('AUTO','Auto-swipe timer started with interval:',this.card.ii.auto_swipe_interval)}stop(){this.ci&&(clearInterval(this.ci),this.ci=null,a('AUTO','Auto-swipe timer stopped')),this.pi&&(clearTimeout(this.pi),this.pi=null)}pause(t=5e3){this.card.ii.enable_auto_swipe&&(a('AUTO',`Auto-swipe paused for ${t}ms`),this.ui=!0,this.pi&&clearTimeout(this.pi),this.pi=setTimeout(()=>{this.ui=!1,a('AUTO','Auto-swipe pause ended'),this.card.isConnected&&this.card.ii.enable_auto_swipe&&this.start()},t))}wi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.ci&&(a('AUTO','Stopping auto-swipe, conditions not met or insufficient visible cards.'),this.stop()));if(this.ui){const t=Date.now();return void(t-this.gi>5e3&&(a('AUTO','Skipping auto-swipe: currently paused'),this.gi=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.gi>5e3&&(a('AUTO','Skipping auto-swipe: currently dragging'),this.gi=t))}const i=Date.now();let e=i-this.gi>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.mi),n=s.nextIndex;s.shouldChangeDirection&&(this.mi=-this.mi,e=!0);const o=this.card.loopMode.getMode();('infinite'===o&&n>=t||'loopback'===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(a('AUTO',`Auto-swipe: ${this.card.currentIndex} → ${n} (${'none'===o?this.mi>0?'forward':'backward':o} mode)`),this.gi=i),this.oi=!0,this.card.goToSlide(n),this.oi=!1}get isInProgress(){return this.oi}}class bt{constructor(t){this.card=t,this.bi=null,this.Ii=0,this.yi=!1,this.Ei=null,this.Si=this.xi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1?a('RESET','Reset-after feature enabled with timeout:',this.card.ii.reset_after_timeout):a('RESET','Reset-after feature disabled',{enabled:this.card.ii.enable_reset_after,autoSwipeDisabled:!this.card.ii.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.ii.enable_reset_after||this.card.ii.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.Ii=Date.now(),a('RESET',`Starting reset-after timer: ${this.card.ii.reset_after_timeout}ms`),this.bi=setTimeout(this.Si,this.card.ii.reset_after_timeout))}stopTimer(){this.bi&&(clearTimeout(this.bi),this.bi=null,a('RESET','Reset-after timer stopped'))}preserveState(){if(this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe)if(this.bi){const t=this.card.ii.reset_after_timeout-(Date.now()-this.Ii);t>1e3?(this.Ei={remainingTime:Math.max(1e3,t),targetCard:this.card.ii.reset_target_card,wasActive:!0},a('RESET','Preserved reset-after state:',this.Ei)):this.Ei=null}else this.Ei=null;else this.Ei=null}restoreState(){this.Ei&&this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe?(this.Ei.wasActive&&this.card.visibleCardIndices.length>1&&(a('RESET','Restoring reset-after timer with remaining time:',this.Ei.remainingTime),this.Ii=Date.now()-(this.card.ii.reset_after_timeout-this.Ei.remainingTime),this.bi=setTimeout(this.Si,this.Ei.remainingTime)),this.Ei=null):this.Ei=null}xi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void a('RESET','Reset-after skipped: conditions not met');const i=this.card.getEvaluatedConfigValue('reset_target_card',1);let e=(parseInt(i)||1)-1;a('RESET',`Reset target card: configured=${this.card.ii.reset_target_card}, evaluated=${i}, index=${e}`);const s=e,n=this.card.visibleCardIndices.indexOf(s);if(-1!==n)e=n,a('RESET',`Target card ${i} is visible at position ${e}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=s){t=i;break}e=t,a('RESET',`Target card ${i} not visible, using closest visible card at position ${e}`)}e>=t&&(e=0,a('RESET','Target index out of range, using first visible card')),this.card.currentIndex!==e?(a('RESET',`Performing reset: current=${this.card.currentIndex}, target=${e}, timeout=${this.card.ii.reset_after_timeout}ms`),this.yi=!0,this.card.goToSlide(e),this.yi=!1):a('RESET','Reset-after skipped: already at target card')}get isInProgress(){return this.yi}}class It{constructor(t){this.card=t,this.paginationElement=null,this.Ti=null,this.Ci=!1,this.$i=!0}create(){if(this.paginationElement&&this.remove(),!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1){if(a('INIT','Creating pagination for',this.card.visibleCardIndices.length,'visible cards'),!this.card.shadowRoot)return void a('ERROR','Cannot create pagination without shadowRoot');if(!this.card.shadowRoot.host||!this.card.shadowRoot.host.isConnected)return a('PAGINATION','shadowRoot host is not connected, deferring pagination creation'),void requestAnimationFrame(()=>{this.card.isConnected&&this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected&&(a('PAGINATION','Retrying pagination creation after deferral'),this.create())});this.paginationElement=document.createElement('div'),this.paginationElement.className=`pagination ${this.card.Qt}`,this.Oi();const t=this.card.ii.state_entity&&this.card.Ni;for(let i=0;i<this.card.visibleCardIndices.length;i++){const e=document.createElement('div');e.className='pagination-dot',t||i!==this._i()||e.classList.add('active'),e.addEventListener('click',t=>{t.stopPropagation(),this.card.goToSlide(i),this.showPagination(),this.startAutoHideTimer()}),this.paginationElement.appendChild(e)}if(!(this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected))return a('ERROR','shadowRoot became null or disconnected while creating pagination'),void(this.paginationElement=null);this.card.shadowRoot.appendChild(this.paginationElement),a('PAGINATION','Successfully appended pagination to shadowRoot',{dotCount:this.card.visibleCardIndices.length,direction:this.card.Qt}),this.card.Mi&&this.card.Ri()}this.Di()}Oi(){this.paginationElement&&requestAnimationFrame(()=>{if(!this.paginationElement||!this.paginationElement.isConnected)return void a('PAGINATION','Pagination element no longer exists, skipping dimension setup');const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||''===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,''));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n('--simple-swipe-card-pagination-dot-active-size')||n('--simple-swipe-card-pagination-dot-size')||8,r=n('--simple-swipe-card-pagination-dot-size')||8,d=Math.max(o,r),h=i.getPropertyValue('--simple-swipe-card-pagination-padding').trim()||'4px 8px',l=h.split(' '),c=2*(s(l[0])||4),u=d+c;if('horizontal'===this.card.Qt)this.paginationElement.style.height=`${u}px`,this.paginationElement.style.minHeight='unset';else{const t=s(l[1]||l[0])||8;this.paginationElement.style.width=`${d+2*t}px`,this.paginationElement.style.minWidth='unset'}a('INIT','Set FIXED pagination dimensions:',{activeDotSize:o,inactiveDotSize:r,maxDotSize:d,totalVerticalPadding:c,fixedDimension:`${u}px`,direction:this.card.Qt,paddingValue:h})})}_i(){const t=this.card.visibleCardIndices.length;return 0===t?0:'infinite'===this.card.ii.loop_mode?(this.card.currentIndex%t+t)%t:Math.max(0,Math.min(this.card.currentIndex,t-1))}update(t=!0){if(!this.paginationElement)return;const i=this._i(),e=this.paginationElement.querySelectorAll('.pagination-dot');t||e.forEach(t=>{t.style.transition='none'}),e.forEach((t,e)=>{t.classList.toggle('active',e===i)}),t||requestAnimationFrame(()=>{e.forEach(t=>{t.style.transition=''})}),a('PAGINATION',`Updated dots: active dot ${i}${t?' (animated)':' (instant)'}`)}updateDuringSwipe(t){if(!this.paginationElement)return;const i=this.card.visibleCardIndices.length;if(0===i)return;let e;e='infinite'===this.card.ii.loop_mode?(t%i+i)%i:Math.max(0,Math.min(t,i-1)),this.paginationElement.querySelectorAll('.pagination-dot').forEach((t,i)=>{t.classList.toggle('active',i===e)})}updateLayout(){!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display='flex':this.create():this.paginationElement&&(this.paginationElement.style.display='none')}remove(){this.cleanupAutoHide(),this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}Di(){this.Ci=this.card.ii.show_pagination&&this.card.ii.auto_hide_pagination>0,this.Ci&&(a('PAGINATION','Auto-hide enabled with timeout:',this.card.ii.auto_hide_pagination),this.$i=!0,this.Ai(),this.startAutoHideTimer())}Ai(){if(this.paginationElement&&this.paginationElement.isConnected){if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return this.paginationElement.style.transition='none',this.paginationElement.style.opacity='1',void this.paginationElement.querySelectorAll('.pagination-dot').forEach(t=>{t.style.transition='none',t.style.opacity='1'});if('fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade'))this.paginationElement.style.transition='opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)',this.paginationElement.style.opacity='1';else{const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-fade-duration').trim()||'600ms',e=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-easing').trim()||'ease-out';t.forEach(t=>{t.style.transition=`opacity ${i} ${e}`,t.style.opacity='1'}),this.paginationElement.style.transition='none',this.paginationElement.style.opacity='1'}}}startAutoHideTimer(){if(!this.Ci||!this.paginationElement)return;this.stopAutoHideTimer();const t=this.card.ii.auto_hide_pagination;a('PAGINATION','Starting auto-hide timer:',t+'ms'),this.Ti=setTimeout(()=>{this.hidePagination(),this.Ti=null},t)}stopAutoHideTimer(){this.Ti&&(clearTimeout(this.Ti),this.Ti=null,a('PAGINATION','Auto-hide timer stopped'))}hidePagination(){this.Ci&&this.paginationElement&&this.paginationElement.isConnected&&this.$i&&(a('PAGINATION','Hiding pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='0':this.ki(),this.$i=!1)}showPagination(){this.Ci&&this.paginationElement&&this.paginationElement.isConnected&&(this.$i||(a('PAGINATION','Showing pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='1':this.Li(),this.$i=!0),this.stopAutoHideTimer())}ki(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.Pi(t.length,i,e);t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='0'},s[i])})}Li(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.zi(i),n=this.Pi(t.length,s,e);t.forEach(t=>{t.style.opacity='0'}),t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='1'},n[i])})}Pi(t,i,e){const s=[];switch(i){case'left-to-right':for(let i=0;i<t;i++)s[i]=i*e;break;case'right-to-left':for(let i=0;i<t;i++)s[i]=(t-1-i)*e;break;case'center-out':{const i=Math.floor(t/2);for(let n=0;n<t;n++){const t=Math.abs(n-i);s[n]=t*e}break}case'edges-in':for(let i=0;i<t;i++){const n=Math.min(i,t-1-i);s[i]=n*e}break;case'random':{const i=Array.from({length:t},(t,i)=>i).sort(()=>Math.random()-.5);i.forEach((t,i)=>{s[t]=i*e});break}default:for(let i=0;i<t;i++)s[i]=0}return s}zi(t){return{'left-to-right':'right-to-left','right-to-left':'left-to-right','center-out':'edges-in','edges-in':'center-out',random:'random',fade:'fade'}[t]||'fade'}showAndStartTimer(){this.Ci&&(this.showPagination(),this.startAutoHideTimer())}cleanupAutoHide(){this.stopAutoHideTimer()}}function yt(){const t=document.createElement('div');return t.className='slide',t}const Et=()=>u`
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
    max-height: 2000px;
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

  .option-info .info-icon {
    background: none;
    border-radius: 0;
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

  /* Reduced Motion Support - Disable editor animations when user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .section-toggle-icon {
      transition: none !important;
    }

    .section-content {
      transition: none !important;
    }

    .github-badge {
      transition: none !important;
    }
  }
`;function St(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){a('ERROR','Failed to fire HA event:',i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function xt(t,i='Map'){return window[t]||(window[t]='Set'===i?new Set:new Map),window[t]}class Tt{constructor(t){this.card=t}async build(){if(this.card.building)return a('INIT','Build already in progress, skipping.'),!1;if(!this.card.ii||!this.card.ii.cards||!this.card.isConnected)return a('INIT','Build skipped (no config/cards or not connected).'),!1;this.card.building=!0,a('INIT','Starting build...');const t=Date.now();if(this.card.Ui=t,a('INIT',`Build timestamp set: ${t}`),this.card.Hi=null,this.card.Vi=null,a('INIT','Cleared cached carousel dimensions'),this.card.resetAfter?.preserveState(),this.card.Fi(),this.card.cards=[],!this.card.ii.state_entity||!this.card.Ni)if(this.card.ii.enable_reset_after&&this.card.ii.reset_target_card){const t=this.card.getEvaluatedConfigValue('reset_target_card',1);this.card.currentIndex=Math.max(0,parseInt(t)-1||0),a('INIT',`Reset-after enabled: Setting initial index to ${this.card.currentIndex} (target card ${t})`)}else this.card.currentIndex=0;if(this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),!this.card.shadowRoot)return a('INIT','Waiting for LitElement to create shadowRoot...'),setTimeout(()=>{this.card.isConnected&&this.build()},10),this.card.building=!1,!1;this.card.shadowRoot&&(this.card.shadowRoot.innerHTML='');const i=this.card.shadowRoot;a('INIT','Building with shadowRoot:',!!i);const e=await mt();if(!e)return console.error('SimpleSwipeCard: Card helpers not loaded.'),i.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,this.card.initialized=!1,!1;const s=document.createElement('style');if(s.textContent='\n     :host {\n        display: block;\n        /* Default: overflow hidden prevents scrollbars and works with expander-card */\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n        /* Prevent horizontal scrolling on touch devices while allowing vertical scrolling */\n        touch-action: pan-y pinch-zoom;\n        /* Ensure dropdowns appear above cards positioned below this one */\n        z-index: 1;\n     }\n\n     /* When dropdown is open: switch to visible overflow with clip-path\n        to allow vertical dropdown overflow while still clipping horizontally */\n     :host(.dropdown-open) {\n        overflow: visible;\n        z-index: 100;\n     }\n\n     :host(.dropdown-open:not([data-enable-backdrop-filter])) {\n        clip-path: polygon(\n          0 -100vh,\n          100% -100vh,\n          100% calc(100% + 100vh),\n          0 calc(100% + 100vh)\n        );\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) {\n       height: 250px; /* Set a reasonable default height for the whole card */\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {\n       height: 100%;\n       min-height: 100%;\n       max-height: 100%;\n       flex: 0 0 100%;\n     } \n\n     /* Auto Height Mode */\n     :host([data-auto-height]:not([data-editor-mode])) .card-container {\n       height: auto;\n       transition: height 0.2s ease-out;\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] {\n       height: auto;\n       align-items: flex-start; /* prevents flex from stretching children */\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] .slide {\n       height: auto;\n       min-height: 0;\n       max-height: none;\n       flex-basis: auto;\n     }\n\n     /* Override child card heights */\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > ha-card,\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > .card-content {\n       height: auto;\n     } \n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border-radius: inherit;\n        background: transparent;\n        will-change: contents; /* Hint browser for optimization */\n        isolation: isolate; /* Create stacking context for proper z-index behavior */\n        /* Prevent horizontal scrolling while allowing vertical */\n        touch-action: pan-y pinch-zoom;\n     }\n\n     /* Horizontal swipe: Clip horizontally but allow vertical overflow for dropdowns */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="horizontal"]) {\n        clip-path: polygon(\n          0 -100vh,                    /* top-left, extended upward */\n          100% -100vh,                 /* top-right, extended upward */\n          100% calc(100% + 100vh),     /* bottom-right, extended downward */\n          0 calc(100% + 100vh)         /* bottom-left, extended downward */\n        );\n     }\n\n     /* Vertical swipe: No container clipping by default - we apply selective clipping to inactive slides */\n     /* But during animations, we temporarily enable container clipping via .animating class */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"]) {\n        clip-path: none;\n     }\n\n     /* Vertical swipe DURING ANIMATION: Use container clipping to show only viewport */\n     /* This prevents both slides from being visible during the transition */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"].animating) {\n        clip-path: polygon(\n          -100vw 0,                    /* top-left, extended leftward for dropdown overflow */\n          calc(100% + 100vw) 0,        /* top-right, extended rightward */\n          calc(100% + 100vw) 100%,     /* bottom-right, clip at container bottom */\n          -100vw 100%                  /* bottom-left, clip at container bottom */\n        );\n     }\n\n    /* Carousel mode: clip horizontally at container boundaries, allow vertical overflow */\n    /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n    :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-view-mode="carousel"]) {\n      clip-path: polygon(\n        0 -100vh,                    /* top-left, clip at edge but extend upward */\n        100% -100vh,                 /* top-right, clip at edge but extend upward */\n        100% calc(100% + 100vh),     /* bottom-right, clip at edge but extend downward */\n        0 calc(100% + 100vh)         /* bottom-left, clip at edge but extend downward */\n      );\n    }\n\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n        backface-visibility: hidden; /* Reduce repaints */\n        z-index: 2; /* Above pagination - transform creates stacking context */\n        pointer-events: none;\n     }\n\n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n        height: 100%;\n        max-height: 100%;\n        overflow: visible; /* Allow transforms to move content outside */\n        flex-wrap: nowrap;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: visible;\n        background: transparent;\n        z-index: 2; /* Above pagination (z-index: 1) */\n        transform: translateZ(0); /* Force GPU acceleration for better iOS/Safari rendering */\n        -webkit-transform: translateZ(0);\n        pointer-events: none; /* Allow clicks to pass through to elements below/behind */\n     }\n\n     /* Vertical mode: Clip inactive slides to hide adjacent cards */\n     /* BUT: During animation, disable per-slide clipping to show smooth transition */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide:not(.active-slide) {\n        /* Clip to zero height - makes slide invisible while keeping it in DOM */\n        clip-path: inset(0 0 100% 0);\n     }\n\n     /* Vertical mode DURING ANIMATION: All slides visible (no per-slide clipping) */\n     /* Container clipping handles viewport boundaries */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"].animating .slide {\n        clip-path: none;\n     }\n\n     /* Vertical mode AFTER ANIMATION: Active slide has no clipping, allowing dropdowns to overflow */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide.active-slide {\n        clip-path: none;\n     }\n\n     /* ========== BACKDROP FILTER MODE ========== */\n     /* When backdrop-filter is enabled, use overflow: hidden to clip adjacent cards */\n     /* Note: overflow: hidden may conflict with backdrop-filter in some browsers, */\n     /* but it\'s the only option that doesn\'t completely break the functionality */\n\n     :host([data-enable-backdrop-filter]) .card-container {\n        overflow: hidden;\n     }\n\n     /* ========== END BACKDROP FILTER MODE ========== */\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: visible;\n      position: relative;\n    }\n\n    /* Z-INDEX HIERARCHY (within .card-container stacking context):\n    * 1. pagination (z-index: 1) - Bottom layer, behind all slide content\n    * 2. .slider (z-index: 2) - Above pagination (transform creates stacking context)\n    *    -> .slide (z-index: 2) - Within slider\'s stacking context\n    *       -> .slide > *:first-child (z-index: 3) - Ensures dropdowns appear above everything\n    *\n    * This hierarchy fixes:\n    * - Android: Dropdowns now appear above pagination dots and other cards\n    * - iOS: Hardware acceleration (translateZ) improves rendering\n    */\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1; /* Lowest layer - behind slides and dropdowns */\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n        overflow: visible !important;\n        position: relative;\n        z-index: 3; /* Above slides and pagination - ensures dropdowns are on top */\n        pointer-events: auto; /* Re-enable pointer events for card content */\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n        overflow: visible !important;\n        position: relative;\n        z-index: 3; /* Same as parent - maintains stacking for dropdowns */\n     }\n\n     /* Mushroom-select dropdown positioning fix */\n     /* Note: The fixedMenuPosition property is disabled via JavaScript in CardBuilder.js */\n     /* This ensures dropdowns work correctly with CSS transforms applied to slides */\n     /* For vertical mode: Active slide has no clip-path, allowing dropdown overflow */\n     /* Inactive slides are clipped to hide adjacent cards */\n\n     /* Reduced Motion Support - Automatically disable animations when user prefers reduced motion */\n     @media (prefers-reduced-motion: reduce) {\n        /* Disable slide transitions */\n        .slider {\n           transition: none !important;\n        }\n\n        /* Disable auto-height transitions */\n        :host([data-auto-height]:not([data-editor-mode])) .card-container {\n           transition: none !important;\n        }\n\n        /* Disable pagination transitions */\n        .pagination {\n           transition: none !important;\n        }\n\n        .pagination-dot {\n           transition: none !important;\n        }\n     }\n   ',i.appendChild(s),this.card.cardContainer=document.createElement('div'),this.card.cardContainer.className='card-container',this.card.sliderElement=document.createElement('div'),this.card.sliderElement.className='slider',this.card.sliderElement.setAttribute('data-swipe-direction',this.card.Qt),this.card.sliderElement.style.opacity='0',a('INIT','Slider hidden during build to prevent layout flash'),this.card.cardContainer.appendChild(this.card.sliderElement),i.appendChild(this.card.cardContainer),this.card.Bi(),0===this.card.ii.cards.length){a('INIT','Building preview state.');const t=function(t,i){const e=document.createElement('div');e.className='preview-container';const s=document.createElement('div');s.className='preview-icon-container';const n=document.createElement('ha-icon');n.icon='horizontal'===t?'mdi:gesture-swipe-horizontal':'mdi:gesture-swipe-vertical',s.appendChild(n);const o=document.createElement('div');o.className='preview-text-container';const a=document.createElement('div');a.className='preview-title',a.textContent='Simple Swipe Card';const r=document.createElement('div');r.className='preview-description',r.textContent=`Create a swipeable container with multiple cards. Swipe ${'horizontal'===t?'horizontally':'vertically'} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const d=document.createElement('div');d.className='preview-actions';const h=document.createElement('ha-button');return h.raised=!0,h.textContent='EDIT CARD',h.setAttribute('aria-label','Edit Card'),h.addEventListener('click',i),d.appendChild(h),e.appendChild(s),e.appendChild(o),e.appendChild(d),e}(this.card.Qt,t=>function(t,i){t.stopPropagation(),a('EDITOR','Edit button clicked, firing show-edit-card event'),St(i,'show-edit-card',{element:i})}(t,this.card));return i.innerHTML='',i.appendChild(s),i.appendChild(t),this.card.initialized=!0,this.card.building=!1,!0}if(0===this.card.visibleCardIndices.length)return a('INIT','No visible cards, hiding entire card.'),this.card.style.display='none',i.innerHTML='',this.card.initialized=!0,this.card.building=!1,!0;this.card.style.display='block',this.card.loopMode.initialize();const n=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.ii.cards);a('INIT','Building cards:',{totalVisible:this.card.visibleCardIndices.length,totalToLoad:n.length,infiniteMode:this.card.loopMode.isInfiniteMode});const o=this.card.ii.view_mode||'single';if(this.Wi()){const t=this.card.getAttribute('data-in-layout-container')||'unknown';a('INIT',`${t} detected - using synchronous loading for compatibility`);const i=this.card.Ui,s=n.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,e,t.isDuplicate,i).catch(i=>(console.warn(`Card ${t.visibleIndex} failed to load:`,i),null)));return await Promise.allSettled(s),this.card.Ui!==i?(a('INIT','Build superseded by newer build, aborting this one',{thisBuild:i,currentBuild:this.card.Ui}),this.card.cards=[],!1):this.card.isConnected&&this.card.sliderElement?(this.Yi(),a('INIT','All cards loaded synchronously for layout-card'),this.card.initialized||(this.card.initialized=!0),requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer&&this.finishBuildLayout(i)}),this.card.building=!1,a('INIT','Build completed successfully (layout-card mode)'),!0):(a('INIT','Card disconnected during build, aborting and cleaning up',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement}),this.card.cards=[],this.card.building=!1,this.card.initialized=!1,!1)}if('carousel'===o){a('INIT','Carousel mode detected - creating DOM structure for layout, loading content progressively'),n.forEach(t=>{const i=yt();i.setAttribute('data-index',t.originalIndex),i.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&i.setAttribute('data-duplicate','true'),t.config?.type&&i.setAttribute('data-card-type',t.config.type),this.card.cards.push({visibleIndex:t.visibleIndex,originalIndex:t.originalIndex,slide:i,config:JSON.parse(JSON.stringify(t.config)),error:!1,isDuplicate:t.isDuplicate,element:null,contentLoaded:!1}),this.card.sliderElement.appendChild(i),this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(i,t.visibleIndex)}),this.card.cards.sort((t,i)=>t.visibleIndex-i.visibleIndex),a('INIT','Carousel DOM structure created, now loading content progressively');const i=this.Gi(n),s=i[0]||[];s.length>0&&await this.ji(s,e,'priority',t);for(let s=1;s<i.length;s++){const n=i[s];setTimeout(async()=>{this.card.isConnected&&await this.ji(n,e,`batch-${s+1}`,t)},150*s)}}else{const i=this.Gi(n);a('INIT','Single mode stagger loading strategy:',{totalBatches:i.length,batchSizes:i.map(t=>t.length),firstBatchCards:i[0]?.map(t=>`${t.visibleIndex}(${t.originalIndex})`)||[]});const s=i[0]||[];if(s.length>0){a('INIT','Loading priority batch immediately:',s.length);const i=s.map(i=>this.createCard(i.config,i.visibleIndex,i.originalIndex,e,i.isDuplicate,t).catch(t=>(console.warn(`Priority card ${i.visibleIndex} failed to load:`,t),null)));await Promise.allSettled(i),this.Yi(),a('INIT','Priority batch loaded and displayed')}for(let s=1;s<i.length;s++){const n=i[s],o=200*s;setTimeout(async()=>{if(!this.card.isConnected)return;a('INIT',`Loading batch ${s+1}/${i.length} after ${o}ms`);const r=n.map(i=>this.createCard(i.config,i.visibleIndex,i.originalIndex,e,i.isDuplicate,t).catch(t=>(console.warn(`Background card ${i.visibleIndex} failed to load:`,t),null)));await Promise.allSettled(r),this.Yi(),a('INIT',`Batch ${s+1} completed`)},o)}if(!this.card.isConnected||!this.card.sliderElement)return a('INIT','Card disconnected before inserting priority cards'),this.card.cards=[],this.card.building=!1,this.card.initialized=!1,!1;this.Yi()}if(this.card.ii.state_entity&&this.card.Ni){const t=this.Ji();t!==this.card.currentIndex&&(a('STATE','Setting initial index from state sync:',t),this.card.currentIndex=t)}return this.card.pagination.create(),a('INIT','All cards initialized.'),this.card.initialized?requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout(t):a('INIT','Card disconnected before finishBuildLayout (rebuild)')}):(this.card.initialized=!0,requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout(t):a('INIT','Card disconnected before finishBuildLayout')})),this.card.building=!1,a('INIT','Build completed successfully'),this.card.Xi(),!0}async createCard(t,i,e,s,n=!1,o=null){const r=yt();let d;const h={visibleIndex:i,originalIndex:e,slide:r,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{if(d=await s.createCardElement(t),o&&this.card.Ui!==o)return void a('INIT',`Discarding card ${i} from stale build`,{cardBuild:o,currentBuild:this.card.Ui});if(this.card.Ni&&(d.hass=this.card.Ni,a('INIT',`Set hass immediately after creation for card ${i} (type: ${t.type})`)),h.element=d,'picture-elements'===t.type&&(d.setAttribute('data-swipe-card-picture-elements','true'),r.setAttribute('data-has-picture-elements','true')),r.appendChild(d),await new Promise(t=>{requestAnimationFrame(()=>{setTimeout(t,30)})}),o&&this.card.Ui!==o)return void a('INIT',`Discarding card ${i} from stale build (after card-mod wait)`,{cardBuild:o,currentBuild:this.card.Ui});requestAnimationFrame(()=>{try{if('todo-list'===t.type){const t=d.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}})}catch(n){if(a('ERROR',`Error creating card ${i} (original ${e}):`,t,n),h.error=!0,o&&this.card.Ui!==o)return void a('INIT',`Discarding error card ${i} from stale build`);const d=await s.createErrorCardElement({type:'error',error:`Failed to create card: ${n.message}`,origConfig:t},this.card.Ni);h.element=d,r.appendChild(d)}o&&this.card.Ui!==o?a('INIT',`Discarding card ${i} from stale build (final check)`):this.card.cards.push(h)}qi(t,i){a('VISIBILITY',`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.Zi()}Ki(){if(!this.card.sliderElement)return;a('MUSHROOM','Checking for mushroom-select elements...');const t=this.card.sliderElement.querySelectorAll('mushroom-select-card'),i=this.card.sliderElement.querySelectorAll('mushroom-select');a('MUSHROOM',`Found ${t.length} mushroom-select-card(s) and ${i.length} standalone mushroom-select element(s)`);const e=[];t.forEach(t=>{const i=t.shadowRoot?.querySelector('mushroom-card');if(i){a('MUSHROOM','Found mushroom-card inside mushroom-select-card');const s=i.querySelector('mushroom-select-option-control');if(s){a('MUSHROOM','Found mushroom-select-option-control in mushroom-card\'s light DOM');const i=s.shadowRoot?.querySelector('mushroom-select');i?(e.push({select:i,rootElement:t}),a('MUSHROOM','Found mushroom-select inside mushroom-select-option-control\'s shadow root')):a('MUSHROOM','mushroom-select-option-control found but no mushroom-select in its shadow root')}else a('MUSHROOM','mushroom-card found but no mushroom-select-option-control in its light DOM')}else a('MUSHROOM','mushroom-select-card found but no mushroom-card inside shadow root')}),i.forEach(t=>{e.push({select:t,rootElement:t})}),e.length>0?(a('MUSHROOM',`Total ${e.length} mushroom-select element(s) found, setting up dropdown positioning fix...`),e.forEach((t,i)=>{const{select:e,rootElement:s}=t;try{if(!1!==e.fixedMenuPosition&&(e.fixedMenuPosition=!1,a('MUSHROOM',`mushroom-select #${i+1} - disabled fixedMenuPosition`)),!0!==e.naturalMenuWidth&&(e.naturalMenuWidth=!0,a('MUSHROOM',`mushroom-select #${i+1} - enabled naturalMenuWidth`)),!s.closest('.slide'))return void a('MUSHROOM',`mushroom-select #${i+1} - no parent slide found`);a('MUSHROOM',`mushroom-select #${i+1} - found parent slide`);let t=!1;const n=e=>{t||(t=!0,e.addEventListener('opened',()=>{a('MUSHROOM',`mushroom-select #${i+1} - menu opened, adjusting position...`);const t=e.shadowRoot?.querySelector('.mdc-menu-surface');if(!t)return void a('MUSHROOM',`mushroom-select #${i+1} - menu surface not found`);const s=window.getComputedStyle(this.card.sliderElement).transform;a('MUSHROOM',`Slider transform: ${s}`);let n=0,o=0;if(s&&'none'!==s){const t=s.match(/matrix\(([^)]+)\)/);if(t){const i=t[1].split(',').map(t=>parseFloat(t.trim()));i.length>=6&&(n=i[4]||0,o=i[5]||0)}}a('MUSHROOM',`Detected transform offset: translateX=${n}, translateY=${o}`);const r=parseFloat(t.style.left)||0,d=parseFloat(t.style.top)||0,h=r-n,l=d-o;a('MUSHROOM',`Adjusting menu position: (${r}, ${d}) -> (${h}, ${l})`),t.style.left=`${h}px`,t.style.top=`${l}px`,a('MUSHROOM',`mushroom-select #${i+1} - position adjusted successfully`)}),a('MUSHROOM',`mushroom-select #${i+1} - menu fix listener attached`))};let o=0;const r=10,d=()=>{const t=e.shadowRoot?.querySelector('mwc-menu');if(t)n(t);else if(o++,o<r)a('MUSHROOM',`mushroom-select #${i+1} - menu not found yet, will retry (${o}/${r})`),setTimeout(d,100);else{if(a('MUSHROOM',`mushroom-select #${i+1} - menu not found after ${r} retries, setting up MutationObserver`),!e.shadowRoot)return void a('MUSHROOM',`mushroom-select #${i+1} - no shadow root, cannot observe`);const t=new MutationObserver(e=>{for(const s of e)if('childList'===s.type)for(const e of s.addedNodes)if('MWC-MENU'===e.nodeName)return a('MUSHROOM',`mushroom-select #${i+1} - menu detected via MutationObserver!`),n(e),void t.disconnect()});t.observe(e.shadowRoot,{childList:!0,subtree:!0}),a('MUSHROOM',`mushroom-select #${i+1} - MutationObserver setup complete`)}};d()}catch(t){console.warn(`Error fixing mushroom-select #${i+1}:`,t)}}),a('MUSHROOM','Mushroom-select positioning fix setup completed')):a('MUSHROOM','No mushroom-select elements found'),this.Qi()}Qi(){this.card.te&&(this.card.te.disconnect(),this.card.te=null),this.card.sliderElement&&(a('MUSHROOM','Setting up persistent observer for new mushroom-select elements...'),this.card.te=new MutationObserver(t=>{for(const i of t)if('childList'===i.type)for(const t of i.addedNodes)if('MUSHROOM-SELECT-CARD'===t.nodeName&&(a('MUSHROOM','Detected new mushroom-select-card being added to DOM'),setTimeout(()=>{this.ie(t)},100)),t.querySelectorAll){const i=t.querySelectorAll('mushroom-select-card');i.length>0&&(a('MUSHROOM',`Detected ${i.length} nested mushroom-select-card(s) in added node`),setTimeout(()=>{i.forEach(t=>this.ie(t))},100))}}),this.card.te.observe(this.card.sliderElement,{childList:!0,subtree:!0}),a('MUSHROOM','Persistent mushroom-select observer active'))}ie(t){try{const i=t.shadowRoot?.querySelector('mushroom-card');if(!i)return void a('MUSHROOM','New card: no mushroom-card found in shadow root');const e=i.querySelector('mushroom-select-option-control');if(!e)return void a('MUSHROOM','New card: no mushroom-select-option-control found');const s=e.shadowRoot?.querySelector('mushroom-select');if(!s)return void a('MUSHROOM','New card: no mushroom-select found');if(a('MUSHROOM','New card: found mushroom-select, setting up positioning fix'),s.fixedMenuPosition=!1,s.naturalMenuWidth=!0,!t.closest('.slide'))return void a('MUSHROOM','New card: no parent slide found');let n=!1;const o=t=>{n||(n=!0,t.addEventListener('opened',()=>{a('MUSHROOM','New card menu opened, adjusting position...');const i=t.shadowRoot?.querySelector('.mdc-menu-surface');if(!i)return;const e=window.getComputedStyle(this.card.sliderElement).transform;let s=0,n=0;if(e&&'none'!==e){const t=e.match(/matrix\(([^)]+)\)/);if(t){const i=t[1].split(',').map(t=>parseFloat(t.trim()));i.length>=6&&(s=i[4]||0,n=i[5]||0)}}const o=parseFloat(i.style.left)||0,r=(parseFloat(i.style.top)||0)-n;i.style.left=o-s+'px',i.style.top=`${r}px`,a('MUSHROOM','New card menu position adjusted')}))},r=s.shadowRoot?.querySelector('mwc-menu');if(r)o(r),a('MUSHROOM','New card: menu found immediately');else{a('MUSHROOM','New card: menu not found, setting up observer');const t=new MutationObserver(i=>{for(const e of i)if('childList'===e.type)for(const i of e.addedNodes)if('MWC-MENU'===i.nodeName)return a('MUSHROOM','New card: menu detected via observer'),o(i),void t.disconnect()});t.observe(s.shadowRoot,{childList:!0,subtree:!0})}}catch(t){console.warn('Error fixing new mushroom-select-card:',t)}}async finishBuildLayout(t=null){if(t&&this.card.Ui&&t!==this.card.Ui)return void a('INIT','finishBuildLayout skipped - stale build detected',{thisBuild:t,currentBuild:this.card.Ui});if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void a('INIT','finishBuildLayout skipped',{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});a('INIT','Finishing build layout...');const i=await this.ee();i?(this.card.slideWidth=i.width,this.card.slideHeight=i.height,a('INIT','Stable dimensions confirmed:',i)):(console.warn('SimpleSwipeCard: Could not obtain stable dimensions after 3 seconds. Using fallback dimensions. The card may resize when content loads.'),this.card.slideWidth=300,this.card.slideHeight=100);const e=this.card.ii.view_mode||'single';'carousel'===e&&(this.se(this.card.slideWidth)||console.warn('SimpleSwipeCard: Carousel layout calculation produced invalid dimensions'));const s=this.card.visibleCardIndices.length;if(this.card.ii.enable_reset_after&&this.card.ii.reset_target_card){const t=this.card.getEvaluatedConfigValue('reset_target_card',1),i=Math.max(0,parseInt(t)-1||0),e=this.card.visibleCardIndices.indexOf(i);if(-1!==e)this.card.currentIndex=e,a('INIT',`Reset target card ${t} is visible at position ${e}`);else{let e=0;for(let t=0;t<this.card.visibleCardIndices.length;t++)if(this.card.visibleCardIndices[t]>=i){e=t;break}this.card.currentIndex=e,a('INIT',`Reset target card ${t} not visible, using closest at position ${e}`)}}this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),this.card.cardContainer&&this.card.cardContainer.isConnected?function(t,i){if(!(i&&i instanceof Element))return void a('INIT','applyBorderRadiusToSlides skipped: invalid cardContainer',{isNull:!i,type:i?.constructor?.name});if(!i.isConnected)return void a('INIT','applyBorderRadiusToSlides skipped: cardContainer not connected to DOM');const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer):a('INIT','Skipping border radius application - container no longer valid'),this.card.updateSlider(!1),this.card.ne(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),a('INIT','Layout finished, slideWidth:',this.card.slideWidth,'slideHeight:',this.card.slideHeight,'currentIndex:',this.card.currentIndex,'visible cards:',s,'view mode:',e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage(),this.card.oe(),this.Ki(),a('PAGINATION','Updating pagination after layout finalization'),requestAnimationFrame(()=>{this.card.isConnected&&this.card.pagination&&(this.card.pagination.update(!1),a('PAGINATION','Pagination active state updated'))}),this.card.Mi&&(a('CARD_MOD','Applying card-mod styles in finishBuildLayout'),this.card.Ri(),this.card.ae(),'carousel'===e&&this.re().then(()=>{this.card.isConnected&&this.recalculateCarouselLayout()})),a('INIT','Creating/updating pagination before fade-in'),this.card.pagination.updateLayout(),await new Promise(t=>requestAnimationFrame(t)),this.card.de(),await this.he()}async re(){const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(a('CARD_MOD','Waiting for carousel CSS variable application:',{initialWidth:t,maxWaitTime:500}),t&&''!==t&&'auto'!==t)return a('CARD_MOD','CSS variable already applied:',t),Promise.resolve();const i=Date.now();return new Promise(t=>{const e=setInterval(()=>{const s=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim(),n=Date.now()-i;if(s&&''!==s&&'auto'!==s)return clearInterval(e),a('CARD_MOD','CSS variable detected after',n,'ms:',s),void t();n>=500&&(clearInterval(e),a('CARD_MOD','CSS variable watch timed out after',500,'ms - using fallback'),t())},20)})}async ee(){let t=0,i=0,e=0,s=0,n=!0;for(a('INIT','Starting dimension stability check (optimized)...');s<30;){if(!this.card.isConnected||!this.card.cardContainer)return a('INIT','Card disconnected during dimension check'),null;if(null===this.card.offsetParent)return a('INIT','Element is hidden, skipping dimension check'),null;const o=this.card.cardContainer.offsetWidth,r=this.card.cardContainer.offsetHeight;if(a('INIT',`Dimension check ${s+1}/30:`,{width:o,height:r,previousWidth:t,previousHeight:i,stableCount:e}),o>0&&r>0){const n=Math.abs(o-t),d=Math.abs(r-i);if(n<=2&&d<=2){if(e++,a('INIT',`Dimensions stable (${e}/2)`),e>=2)return a('INIT','Dimensions confirmed stable:',{width:o,height:r,attempts:s+1,timeElapsed:50*s+'ms'}),{width:o,height:r}}else a('INIT',`Dimensions changed: width${n}px, height ${d}px (resetting stability counter)`),e=0;t=o,i=r}else a('INIT',`Waiting for non-zero dimensions (${o}x${r})`),e=0;s++,n&&s<3?await new Promise(t=>requestAnimationFrame(t)):(n=!1,await new Promise(t=>setTimeout(t,50)))}return a('INIT','Failed to get stable dimensions after 1500ms'),null}async he(){if(await new Promise(t=>setTimeout(t,50)),!this.card.isConnected||!this.card.cardContainer||!this.card.sliderElement)return void a('INIT','Card disconnected before fade-in');const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;a('INIT','Final pre-fade dimension check:',{currentStored:{width:this.card.slideWidth,height:this.card.slideHeight},actualMeasured:{width:t,height:i}}),(Math.abs(t-this.card.slideWidth)>2||Math.abs(i-this.card.slideHeight)>2)&&(a('INIT','Final dimensions differ from stored - updating before fade-in'),this.card.slideWidth=t,this.card.slideHeight=i,this.card.updateSlider(!1),'carousel'===(this.card.ii.view_mode||'single')&&this.se(t)),a('INIT','Fading in slider'),this.card.sliderElement.style.transition='opacity 0.15s ease-in',this.card.sliderElement.style.opacity='1',setTimeout(()=>{this.card.sliderElement&&(this.card.sliderElement.style.transition='',a('INIT','Fade-in complete, card fully initialized'))},150)}Ji(){if(!this.card.ii.state_entity||!this.card.Ni)return this.card.currentIndex;const t=this.card.ii.state_entity,i=this.card.Ni.states[t];if(!i)return a('STATE','State entity not found during build:',t),this.card.currentIndex;const e=i.state;let s=null;if(t.startsWith('input_select.')){if(!i.attributes.options||!Array.isArray(i.attributes.options))return this.card.currentIndex;const t=i.attributes.options.indexOf(e);-1!==t&&t<this.card.visibleCardIndices.length&&(s=t)}else if(t.startsWith('input_number.')){const t=parseInt(e);if(!isNaN(t)){const i=t-1;i>=0&&i<this.card.visibleCardIndices.length&&(s=i)}}return null!==s?(a('STATE',`State sync initial index determined during build: ${s} from entity state: ${e}`),s):this.card.currentIndex}le(t,i){const e=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(a('INIT','Checking for CSS override:',{computedWidth:e,hasValue:!!e,isEmpty:''===e,isAuto:'auto'===e}),e&&''!==e&&'auto'!==e){const s=parseFloat(e),n=(t+i)/(s+i);return a('INIT','Using CSS-overridden card width:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2),source:'card-mod or CSS'}),{cardWidth:s,cardsVisible:Math.max(1.1,n)}}let s;if(a('INIT','No CSS override found, calculating from config'),void 0!==this.card.ii.cards_visible)s=this.card.ii.cards_visible,a('INIT','Using legacy cards_visible approach:',s);else{const e=this.card.ii.card_min_width||200,n=(t+i)/(e+i);s=Math.max(1.1,Math.round(10*n)/10),a('INIT','Using responsive approach:',{minWidth:e,containerWidth:t,cardSpacing:i,rawCardsVisible:n.toFixed(2),finalCardsVisible:s})}return{cardWidth:(t-(s-1)*i)/s,cardsVisible:s}}recalculateCarouselLayout(){if('carousel'!==(this.card.ii.view_mode||'single'))return;const t=this.card.cardContainer?.offsetWidth;t&&(a('INIT','Recalculating carousel layout after card-mod'),this.ce(t),this.card.updateSlider(!1))}se(t){const i=Math.max(0,parseInt(this.card.ii.card_spacing))||0,{cardWidth:e,cardsVisible:s}=this.le(t,i);if(!this.ue(e,s,t))return a('INIT','Carousel dimensions failed validation:',{cardWidth:e,cardsVisible:s,containerWidth:t}),!1;a('INIT','Carousel layout setup (validated):',{containerWidth:t,cardsVisible:s.toFixed(2),cardSpacing:i,cardWidth:e.toFixed(2)});const n=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();return n&&''!==n&&'auto'!==n?a('INIT','Skipping CSS variable set - already overridden:',n):(this.card.style.setProperty('--carousel-card-width',`${e}px`),a('INIT','Set --carousel-card-width to calculated value:',`${e}px`)),this.card.Hi=e,this.card.Vi=s,this.card.sliderElement.setAttribute('data-view-mode','carousel'),this.card.cardContainer.setAttribute('data-view-mode','carousel'),this.card.cards.forEach(t=>{t.slide&&t.slide.classList.add('carousel-mode')}),!0}ue(t,i,e){return isFinite(t)&&isFinite(i)&&isFinite(e)?t<=0||i<=0||e<=0?(a('INIT','Validation failed: Zero or negative values'),!1):t>1.5*e?(a('INIT','Validation failed: Card width exceeds container significantly'),!1):t<50?(a('INIT','Validation failed: Card width too small (< 50px)'),!1):!(i>20&&(a('INIT','Validation failed: Too many visible cards (> 20)'),1)):(a('INIT','Validation failed: Non-finite numbers detected'),!1)}Gi(t){const i=this.card.currentIndex||0,e=this.card.ii.view_mode||'single',s=this.card.loopMode.isInfiniteMode;a('INIT','Determining visible cards for stagger loading:',{currentIndex:i,viewMode:e,isInfiniteMode:s,totalCardsToLoad:t.length});let n=[];if(s)n=this.pe(i,t,e);else{const t=this.card.visibleCardIndices.length;if('single'===e)n=[i-1,i,i+1].filter(i=>i>=0&&i<t);else if('carousel'===e){const e=this.me(i,t);n=[];for(let t=e.startIndex;t<=e.endIndex;t++)n.push(t)}else n=[i]}const o=[],r=[];t.forEach(t=>{n.includes(t.visibleIndex)?(o.push(t),a('INIT',`Priority card: visibleIndex ${t.visibleIndex}, originalIndex ${t.originalIndex}, isDuplicate: ${t.isDuplicate}`)):r.push(t)}),o.sort((t,e)=>Math.abs(t.visibleIndex-i)-Math.abs(e.visibleIndex-i));const d=[];if('carousel'===e&&o.length>0)d.push(o),a('INIT',`Carousel mode: All ${o.length} priority cards in first batch`);else for(let t=0;t<o.length;t+=3)d.push(o.slice(t,t+3));for(let t=0;t<r.length;t+=3)d.push(r.slice(t,t+3));return a('INIT','Batch creation completed:',{visibleIndices:n,priorityCards:o.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),regularCards:r.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),totalBatches:d.length,firstBatchSize:d[0]?.length||0}),d}pe(t,i,e){const s=this.card.visibleCardIndices.length,n=this.card.loopMode.getDuplicateCount(),o=n+t;a('INIT','Infinite mode position mapping:',{virtualCurrentIndex:t,realDOMPosition:o,duplicateCount:n,totalRealCards:s,totalCardsInDOM:i.length});let r=[];if('single'===e)r=[o-1,o,o+1].filter(t=>t>=0&&t<i.length);else if('carousel'===e){const t=this.ge();let e=o,s=Math.min(i.length-1,e+Math.ceil(t)-1);s>=i.length&&(s=i.length-1,e=Math.max(0,s-Math.ceil(t)+1));for(let t=e;t<=s;t++)r.push(t);a('INIT','Infinite carousel visible range calculation:',{cardsVisible:t,realDOMPosition:o,startDOM:e,endDOM:s,visibleDOMPositions:r,calculation:`Start from DOM ${o}, show ${Math.ceil(t)} cards: ${e} to ${s}`})}else r=[o];const d=[];return r.forEach(t=>{if(t>=0&&t<i.length){const e=i[t];e&&d.push(e.visibleIndex)}}),d}ge(){if(void 0!==this.card.ii.cards_visible)return this.card.ii.cards_visible;const t=this.card.cardContainer?.offsetWidth||300,i=this.card.ii.card_min_width||200,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0,s=Math.max(1,(t+e)/(i+e));return Math.max(1.1,Math.round(10*s)/10)}me(t,i){const e=this.ge();if(i<=Math.floor(e))return{startIndex:0,endIndex:i-1,cardsVisible:e};let s=t-Math.floor(e/2);s<0&&(s=0);let n=s+Math.ceil(e)-1;return n>=i&&(n=i-1,s=Math.max(0,n-Math.ceil(e)+1)),{startIndex:Math.max(0,Math.floor(s)),endIndex:Math.min(n,i-1),cardsVisible:e}}async ji(t,i,e,s=null){a('INIT',`Loading carousel ${e} content:`,t.length);const n=t.map(async t=>{try{const e=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(!e||e.contentLoaded)return null;const n=await i.createCardElement(t.config);return s&&this.card.Ui!==s?(a('INIT',`Discarding carousel card ${t.visibleIndex} from stale build`),null):(this.card.Ni&&(n.hass=this.card.Ni),'picture-elements'===t.config.type&&(n.setAttribute('data-swipe-card-picture-elements','true'),e.slide.setAttribute('data-has-picture-elements','true')),requestAnimationFrame(()=>{try{if('todo-list'===t.config.type){const t=n.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}}),e.slide.appendChild(n),e.element=n,e.contentLoaded=!0,n)}catch(e){a('ERROR',`Error loading carousel card ${t.visibleIndex}:`,e);const s=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(s){s.error=!0,s.contentLoaded=!0;try{const n=await i.createErrorCardElement({type:'error',error:`Failed to create card: ${e.message}`,origConfig:t.config},this.card.Ni);s.slide.appendChild(n),s.element=n}catch(t){console.error('Failed to create error card:',t)}}return null}});await Promise.allSettled(n),a('INIT',`Carousel ${e} content loading completed`)}Yi(){if(!this.card.isConnected||!this.card.sliderElement)return void a('ERROR','_insertLoadedCardsIntoDom: Card disconnected or sliderElement is null, skipping',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement});const t=this.card.cards.filter(t=>t&&t.slide&&!t.slide.parentElement).sort((t,i)=>t.visibleIndex-i.visibleIndex);t.forEach(t=>{if(!this.card.sliderElement)return void a('ERROR','Slider element disappeared during insertion loop');t.slide.setAttribute('data-index',t.originalIndex),t.slide.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&t.slide.setAttribute('data-duplicate','true'),t.config?.type&&t.slide.setAttribute('data-card-type',t.config.type);const i=Array.from(this.card.sliderElement.children);let e=i.length;for(let s=0;s<i.length;s++)if(parseInt(i[s].getAttribute('data-visible-index')||'0')>t.visibleIndex){e=s;break}e===i.length?this.card.sliderElement.appendChild(t.slide):this.card.sliderElement.insertBefore(t.slide,i[e]),this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(t.slide,t.visibleIndex)})}Wi(){let t=this.card,i=10;for(;t&&i>0&&(t=t.parentElement||t.parentNode?.host,t);){const e=t.tagName?.toLowerCase();if('layout-card'===e||'masonry-layout'===e||'horizontal-layout'===e||'vertical-layout'===e||'grid-layout'===e||'hui-masonry-view'===e)return a('INIT',`âœ… DETECTED PARENT LAYOUT CONTAINER: ${e}`),this.card.setAttribute('data-in-layout-container',e),!0;i--}return this.card.removeAttribute('data-in-layout-container'),!1}}class Ct{constructor(t){this.card=t,this.fe=null,this.ve=null,this.we=null,this.be=!1,this.Ie=null,this.ye=this.Ee.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.state_entity&&this.card.Ni?(this.fe=this.card.ii.state_entity,this.Se()?(a('STATE','State synchronization enabled for entity:',this.fe),this.xe()):(a('STATE','Invalid or missing entity:',this.fe),this.fe=null)):a('STATE','State synchronization disabled',{hasEntity:!!this.card.ii.state_entity,hasHass:!!this.card.Ni}))}stop(){this.Ie&&(clearTimeout(this.Ie),this.Ie=null),this.fe=null,this.ve=null,this.we=null,this.be=!1}onCardNavigate(t){if(!this.fe||!this.card.Ni||this.be)return;const i=this.Te(t);if(null===i)return;const e=this.card.Ni.states[this.fe];if(e&&e.state===i)a('STATE','Entity already at correct state:',i);else{a('STATE',`Updating entity ${this.fe} to:`,i),this.be=!0;try{'input_select'===this.ve?this.card.Ni.callService('input_select','select_option',{entity_id:this.fe,option:i}):'input_number'===this.ve&&this.card.Ni.callService('input_number','set_value',{entity_id:this.fe,value:i}),this.we=i,setTimeout(()=>{this.be=!1},500)}catch(t){a('ERROR','Failed to update entity:',t),this.be=!1}}}Se(){if(!this.card.Ni||!this.fe)return!1;const t=this.card.Ni.states[this.fe];if(!t)return a('STATE','Entity not found:',this.fe),!1;if(this.fe.startsWith('input_select.')){if(this.ve='input_select',!t.attributes.options||!Array.isArray(t.attributes.options))return a('STATE','input_select entity has no options:',this.fe),!1}else{if(!this.fe.startsWith('input_number.'))return a('STATE','Entity is not input_select or input_number:',this.fe),!1;this.ve='input_number'}return!0}xe(){if(!this.card.Ni||!this.fe)return;const t=this.card.Ni.states[this.fe];if(!t)return;this.we=t.state;const i=this.Ce(t.state);null===i||i!==this.card.currentIndex?null!==i&&i!==this.card.currentIndex&&(a('STATE',`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i,1,!1)):a('STATE',`Initial sync: card already at correct position ${i}, skipping initial positioning`)}Ee(){if(!this.card.Ni||!this.fe||this.be)return;const t=this.card.Ni.states[this.fe];if(!t)return;const i=t.state;if(i===this.we)return;a('STATE',`Entity ${this.fe} changed from "${this.we}" to "${i}"`),this.we=i;const e=this.Ce(i);null!==e&&e!==this.card.currentIndex&&(a('STATE',`Navigating to card index ${e} from entity change`),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}Ce(t){if('input_select'===this.ve){const i=this.card.Ni.states[this.fe];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(a('STATE',`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(a('STATE',`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if('input_number'===this.ve){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(a('STATE',`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}Te(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if('input_select'===this.ve){const i=this.card.Ni.states[this.fe];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(a('STATE',`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return'input_number'===this.ve?t+1:null}onHassChange(t,i){if(!this.fe||!i)return;const e=t?.states[this.fe],s=i.states[this.fe];if(!s)return a('STATE','Configured entity no longer exists:',this.fe),void this.stop();e&&e.state===s.state||(this.Ie&&clearTimeout(this.Ie),this.Ie=setTimeout(()=>{this.Ee(),this.Ie=null},100))}}class $t{constructor(t){this.card=t,this.slideObservers=new Map,this.cardHeights={},this.enabled=!1}initialize(){this.enabled=!0===this.card.ii.auto_height&&'single'===this.card.ii.view_mode&&'horizontal'===this.card.ii.swipe_direction&&'infinite'!==this.card.ii.loop_mode,this.enabled?(this.card.setAttribute('data-auto-height',''),a('AUTO_HEIGHT','Auto height enabled')):(this.card.removeAttribute('data-auto-height'),this.cleanup())}observeSlide(t,i){if(!this.enabled||!t)return;if(this.slideObservers.has(i))return;const e=new ResizeObserver(t=>{for(const e of t){const t=e.contentRect.height;if(t<10)return void a('AUTO_HEIGHT',`Card ${i} height too small (${t}px), waiting for content to load`);this.cardHeights[i]!==t&&(a('AUTO_HEIGHT',`Card ${i} height changed to ${t}px`),this.cardHeights[i]=t,i===this.card.currentIndex&&this.updateContainerHeight(t))}});e.observe(t),this.slideObservers.set(i,e),a('AUTO_HEIGHT',`Now observing slide ${i}`),this.$e(t,i)}async $e(t,i){const e=t.querySelector('*');if(!e)return;const s=e.tagName.toLowerCase();if(s.includes('-'))try{await customElements.whenDefined(s),a('AUTO_HEIGHT',`Custom element ${s} is now defined for card ${i}`)}catch(t){a('AUTO_HEIGHT',`Could not wait for custom element ${s}:`,t)}await new Promise(t=>setTimeout(t,100));const n=t.offsetHeight;n>=10&&this.cardHeights[i]!==n?(a('AUTO_HEIGHT',`Post-render height check for card ${i}: ${n}px`),this.cardHeights[i]=n,i===this.card.currentIndex&&this.updateContainerHeight(n)):n<10&&(a('AUTO_HEIGHT',`Card ${i} still not rendered, will retry after 200ms`),setTimeout(()=>{const e=t.offsetHeight;e>=10&&this.cardHeights[i]!==e&&(a('AUTO_HEIGHT',`Retry height check for card ${i}: ${e}px`),this.cardHeights[i]=e,i===this.card.currentIndex&&this.updateContainerHeight(e))},200))}updateContainerHeight(t){if(this.enabled&&this.card.cardContainer){if(!t||0===t){if(this.card.cardContainer.offsetHeight>0)return void a('AUTO_HEIGHT','Invalid height, keeping current height');t=250,a('AUTO_HEIGHT','Using fallback height: 250px')}this.card.cardContainer.style.height=`${t}px`,a('AUTO_HEIGHT',`Container height set to ${t}px`)}}updateForCurrentCard(){if(!this.enabled)return;const t=this.cardHeights[this.card.currentIndex];t&&t>0?this.updateContainerHeight(t):a('AUTO_HEIGHT',`No height cached for card ${this.card.currentIndex}, waiting for ResizeObserver`)}cleanup(){this.slideObservers.forEach((t,i)=>{t.disconnect(),a('AUTO_HEIGHT',`Stopped observing slide ${i}`)}),this.slideObservers.clear(),this.cardHeights={},this.card.cardContainer&&(this.card.cardContainer.style.height='')}}class Ot{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;const i=this.card.cardContainer.offsetWidth,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0;let s,n;if(this.card.Hi&&this.card.Vi)s=this.card.Hi,n=this.card.Vi,a('SWIPE','Using stored carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)});else{const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();t&&''!==t&&'auto'!==t?(s=parseFloat(t),n=(i+e)/(s+e)):(n=void 0!==this.card.ii.cards_visible?this.card.ii.cards_visible:Math.max(1.1,Math.round((i+e)/((this.card.ii.card_min_width||200)+e)*10)/10),s=(i-(n-1)*e)/n),a('SWIPE','Recalculated carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)})}const o=this.card.visibleCardIndices.length,r=this.card.ii.loop_mode||'none';if(o<=Math.floor(n)&&'infinite'!==this.card.ii.loop_mode)return a('SWIPE','Insufficient cards for carousel transform, staying at position 0'),0;let d;if('infinite'===r&&o>1){const i=this.card.loopMode.getDuplicateCount();d=t+i,a('SWIPE','Carousel infinite mode: logical index',t,'-> DOM position',d,'duplicateCount:',i)}else d=Math.min(t,Math.max(0,o-1));const h=s+e,l=d*h;return a('SWIPE','Carousel transform calculation:',{targetIndex:t,domPosition:d,totalCards:o,cardsVisible:n.toFixed(2),cardWidth:s.toFixed(2),cardSpacing:e,moveDistance:h.toFixed(2),transform:l.toFixed(2),loopMode:r}),l}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);if(i&&'free'===this.card.ii.swipe_behavior&&this.card.Oe>1){const t=this.card.swipeBehavior.calculateAnimationDuration(this.card.Oe),i=this.card.swipeBehavior.getEasingFunction(this.card.Oe);this.card.sliderElement.style.transition=`transform ${t}ms ${i}`,a('SWIPE',`Carousel multi-card animation: ${this.card.Oe} cards, ${t}ms duration, easing: ${i}`)}else this.card.sliderElement.style.transition=this.card.ti(i);this.card.sliderElement.style.transform=`translateX(-${e}px)`,a('SWIPE',`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}Ne(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class Nt{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this._e=null,this.Me=null}getMode(){return this.card.ii.loop_mode||'none'}isInfinite(){return'infinite'===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode?a('LOOP','Infinite loop mode initialized for',this.card.visibleCardIndices.length,'visible cards'):(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,'infinite'===this.getMode()&&a('LOOP','Infinite loop mode disabled - only',this.card.visibleCardIndices.length,'visible card(s)'))}getDuplicateCount(){if(!this.isInfiniteMode)return 0;if(this.card.visibleCardIndices.length<=1)return 0;const t=this.card.ii.swipe_behavior||'single';if('single'===(this.card.ii.view_mode||'single'))return'free'===t?4:1;{const i=this.card.ii.cards_visible||this.card.ai(),e=Math.max(5,Math.ceil(2*i));return'free'===t?e+Math.min(5,Math.ceil(i)):e}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const a=o-s;let r;r=a<0?(a%n+n)%n:a%n;const d=t[r];e.push({config:i[d],visibleIndex:o-s,originalIndex:d,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o%n];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return 0===i?0:this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){return this.isInfiniteMode?0===this.card.visibleCardIndices.length?0:t-this.getDuplicateCount():t}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e?e+i-(e-t):e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;if('carousel'===(this.card.ii.view_mode||'single')){if('free'===(this.card.ii.swipe_behavior||'single')){const e=this.getDuplicateCount(),s=Math.floor(.3*e);return t-0<s||i-1-t<s}return t>=i||t<0}return t<0||t>=i}scheduleSeamlessJump(t,i=null){if(this.Re(),!this.shouldPerformSeamlessJump(t))return void a('LOOP',`Seamless jump not needed for target index ${t}`);let e;if(null!==i)e=i;else try{const t=this.card.ti(!0);a('LOOP','DEBUG: transitionStyle =',t);const i=t.match(/transform\s+([\d.]+)([a-z]*)\s/);if(a('LOOP','DEBUG: regex match =',i),i){const t=parseFloat(i[1]),s=i[2]||'s';a('LOOP','DEBUG: parsed duration =',t,'unit =',s),e='s'===s?1e3*t:'ms'===s?t:400,a('LOOP','DEBUG: final transitionDuration =',e)}else a('LOOP','DEBUG: regex match failed, using fallback'),e=400}catch(t){a('LOOP','Error reading CSS transition duration:',t),e=400}a('LOOP',`Scheduling seamless jump for target index ${t} after ${e}ms animation`);let s=!1;const n=()=>{if(!s){if(s=!0,this._e&&(clearTimeout(this._e),this._e=null),!this.card.isConnected||this.card.building)return a('LOOP','Seamless jump cancelled - card disconnected or building'),void(this.card.si=!1);requestAnimationFrame(()=>{try{const i=this.card.currentIndex;if(a('LOOP',`Seamless jump executing: target was ${t}, actual current is ${i}`),!this.shouldPerformSeamlessJump(i))return a('LOOP',`Seamless jump cancelled - conditions changed (target: ${t}, actual: ${i})`),void(this.card.si=!1);const e=this.card.visibleCardIndices.length;let s;if(i<0)s=e+i%e,s>=e&&(s=e-1);else{if(!(i>=e))return a('LOOP',`Seamless jump not needed - already in valid position (${i})`),void(this.card.si=!1);s=i%e}a('LOOP',`Performing seamless jump: virtual ${i} → real ${s}`),this.card.si=!0,this.card.sliderElement&&(this.card.sliderElement.style.transition='none'),this.card.currentIndex=s,this.card.updateSlider(!1),requestAnimationFrame(()=>{try{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.ti(!0)),a('LOOP',`Seamless jump completed - now at real position ${s}, ready for continued scrolling`)}catch(t){a('ERROR','Error in seamless jump transition restoration:',t)}finally{this.card.si=!1}})}catch(t){a('ERROR','Error during seamless jump execution:',t),this.card.si=!1}})}},o=t=>{t.target!==this.card.sliderElement||'transform'!==t.propertyName||s||(a('LOOP','Transform transition ended, executing seamless jump'),this.card.sliderElement.removeEventListener('transitionend',o),this.Me=null,setTimeout(n,10))};this.card.sliderElement&&e>0&&(this.Me=o,this.card.sliderElement.addEventListener('transitionend',o));const r=Math.min(100,.1*e);this._e=setTimeout(()=>{this.Me&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.Me),this.Me=null),s||(a('LOOP','Executing seamless jump via timeout fallback'),n())},e+r)}Re(){this._e&&(clearTimeout(this._e),this._e=null,this.card.si&&(a('LOOP','Clearing seamless jump flag during cancellation'),this.card.si=!1),this.Me&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.Me),this.Me=null),a('LOOP','Cancelled pending seamless jump and cleaned up event listeners'))}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return t;if(!('loopback'===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return{nextIndex:t+1,shouldChangeDirection:!1};if('loopback'===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?(n=t-Math.abs(i),n<0&&('none'!==e&&s>1?'infinite'===e||(n=s+n,n<0&&(n=s-1)):n=0)):i<0&&(n=t+Math.abs(i),n>=s&&('none'!==e&&s>1?'infinite'===e||(n-=s,n>=s&&(n=0)):n=s-1)),a('LOOP','Swipe navigation:',{currentIndex:t,skipCount:i,mode:e,totalVisibleCards:s,nextIndex:n}),n}}class _t{constructor(t){this.card=t}getBehavior(){return this.card.ii.swipe_behavior||'single'}calculateSkipCount(t,i,e,s){if('single'===s)return 1;let n;if('carousel'===(this.card.ii.view_mode||'single')){const t=this.card.ii.cards_visible||this.card.ai(),i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;n=(this.card.slideWidth-(t-1)*i)/t}else n='horizontal'===this.card.Qt?this.card.slideWidth:this.card.slideHeight;const o=Math.max(1,Math.round(i/n));if(t>.8){let s=1;t>.8&&(s=2),t>1.5&&(s=3),t>2.5&&(s=4);const r=Math.max(s,o);return a('SWIPE','Quick swipe detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),velocityBasedSkip:s,distanceBasedSkip:o,result:r}),Math.min(r,Math.min(4,e-1))}return a('SWIPE','Controlled drag detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),distanceBasedSkip:o}),Math.min(o,e-1)}calculateAnimationDuration(t){const i=this.card.visibleCardIndices.length;if(i<=3){const i=Math.min(800+500*(t-1),2400);return a('SWIPE','Animation duration (few cards):',t,'cards,',i+'ms'),i}const e=200*(t-1),s=Math.min(1200+50*i,2e3),n=Math.min(600+e,s);return a('SWIPE','Animation duration (many cards):',{skipCount:t,totalCards:i,baseDuration:600,extraDuration:e,maxDuration:s,finalDuration:n+'ms'}),n}getEasingFunction(t){return 1===t?'ease-out':'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}}class Mt{constructor(t){this.card=t,this.De=new Set,this.Ae={},this.ke=['reset_target_card','auto_swipe_interval','reset_after_timeout']}async initialize(){return a('TEMPLATE','Template evaluator initialized (built-in)'),!0}isTemplate(t){return'string'==typeof t&&(t.includes('{{')&&t.includes('}}')||t.includes('{%')&&t.includes('%}'))}get isAvailable(){return!0}scanConfig(t){this.De.clear(),this.Ae={};for(const i of this.ke){const e=t[i];this.isTemplate(e)&&(this.De.add(i),this.Ae[i]=e,a('TEMPLATE',`Found template in ${i}:`,e))}this.De.size>0&&a('TEMPLATE',`Config contains ${this.De.size} template option(s)`)}hasTemplates(){return this.De.size>0}getTemplateOptions(){return Array.from(this.De)}evaluateTemplate(t,i){if(!i)return a('TEMPLATE','Cannot evaluate template - no hass object'),t;if(!this.isTemplate(t))return t;try{const e=t.match(/\{\{\s*(.+?)\s*\}\}/);if(!e)return t;const s=e[1].trim(),n=this.Le(s,i);return a('TEMPLATE',`Evaluated "${t}" => "${n}"`),n}catch(i){return a('TEMPLATE',`Error evaluating template "${t}":`,i.message),t}}Le(t,i){const e=t.split('|').map(t=>t.trim());let s=this.Pe(e[0],i);for(let t=1;t<e.length;t++)s=this.ze(s,e[t],i);return s}Pe(t,i){if(t.includes('now()'))return this.Ue(t);const e=t.match(/states\s*\(\s*['"]([^'"]+)['"]\s*\)/);if(e){const t=e[1],s=i.states[t];return s?s.state:(a('TEMPLATE',`Entity not found: ${t}`),'unknown')}const s=t.match(/state_attr\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);if(s){const t=i.states[s[1]];return t&&t.attributes?t.attributes[s[2]]:void 0}const n=t.match(/is_state\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);if(n){const t=i.states[n[1]];return t&&t.state===n[2]}if(/^[\d\s+\-*/().]+$/.test(t))try{return this.He(t)}catch{return t}return/^\d+$/.test(t)?parseInt(t,10):t}Ue(t){const i=new Date;if(t.includes('.weekday()')){const e=i.getDay(),s=0===e?6:e-1,n=t.match(/\.weekday\(\)\s*([+\-*/])\s*(\d+)/);if(n){const t=n[1],i=parseInt(n[2],10);return this.Ve(s,t,i)}return s}if(t.includes('.isoweekday()')){const e=i.getDay(),s=0===e?7:e,n=t.match(/\.isoweekday\(\)\s*([+\-*/])\s*(\d+)/);if(n){const t=n[1],i=parseInt(n[2],10);return this.Ve(s,t,i)}return s}return t.includes('.day')?i.getDate():t.includes('.month')?i.getMonth()+1:t.includes('.year')?i.getFullYear():t.includes('.hour')?i.getHours():t.includes('.minute')?i.getMinutes():i.getTime()}Ve(t,i,e){switch(i){case'+':return t+e;case'-':return t-e;case'*':return t*e;case'/':return 0!==e?t/e:t;default:return t}}He(t){const i=t.replace(/[^0-9+\-*/().]/g,'');if(i!==t.replace(/\s/g,''))throw new Error('Invalid characters in expression');return Function(`"use strict"; return (${i})`)()}ze(t,i,e){if('int'===i||i.startsWith('int(')){const e=parseInt(t,10);if(isNaN(e)){const t=i.match(/int\s*\(\s*(\d+)\s*\)/);return t?parseInt(t[1],10):0}return e}if('float'===i||i.startsWith('float(')){const e=parseFloat(t);if(isNaN(e)){const t=i.match(/float\s*\(\s*([\d.]+)\s*\)/);return t?parseFloat(t[1]):0}return e}const s=i.match(/round\s*\(\s*(\d+)\s*\)/);if(s||'round'===i){const i=s?parseInt(s[1],10):0,e=parseFloat(t);return isNaN(e)?t:Number(e.toFixed(i))}if('abs'===i){const i=parseFloat(t);return isNaN(i)?t:Math.abs(i)}const n=i.match(/default\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/);return n?null==t||''===t?n[1]:t:'string'===i||'str'===i?String(t):(a('TEMPLATE',`Unknown filter: ${i}`),t)}getEvaluatedValue(t,i){if(!this.De.has(t))return;const e=this.Ae[t];if(!e)return;const s=this.evaluateTemplate(e,i);return this.Fe(t,s)}Fe(t,i){if(['reset_target_card','auto_swipe_interval','reset_after_timeout'].includes(t)){const e=parseInt(i,10);if(isNaN(e))return a('TEMPLATE',`Warning: ${t} template evaluated to non-numeric value: ${i}`),null;switch(t){case'reset_target_card':return Math.max(1,e);case'auto_swipe_interval':return Math.max(500,e);case'reset_after_timeout':return Math.max(5e3,e);default:return e}}return i}isTemplateOption(t){return this.De.has(t)}getReferencedEntities(){const t=new Set,i=/(?:states|is_state|state_attr|has_value)\s*\(\s*['"]([\w.]+)['"]/g;for(const e of Object.values(this.Ae)){if('string'!=typeof e)continue;let s;for(;null!==(s=i.exec(e));)t.add(s[1])}return t.size>0&&a('TEMPLATE','Found referenced entities in templates:',Array.from(t)),t}clearCache(){}}class SimpleSwipeCard extends ut{constructor(){super(),a('INIT','SimpleSwipeCard Constructor invoked.'),this.ii={},this.Ni=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.Qt='horizontal',this.ni=void 0,this.Be=void 0,this.Mi=null,this.We=null,this.Ye=null,this.Ge=null,this.swipeGestures=new vt(this),this.autoSwipe=new wt(this),this.resetAfter=new bt(this),this.pagination=new It(this),this.cardBuilder=new Tt(this),this.stateSynchronization=new Ct(this),this.carouselView=new Ot(this),this.loopMode=new Nt(this),this.swipeBehavior=new _t(this),this.autoHeight=new $t(this),this.templateEvaluator=new Mt(this),this.je=null,this.Je=null,this.Xe=null,this.qe=null,window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[]),this.Ze=this.Ze.bind(this),this.Ke=this.Ke.bind(this),this.Qe=this.Qe.bind(this),a('INIT','SimpleSwipeCard Constructor completed successfully.')}async firstUpdated(){if(a('LIFECYCLE','firstUpdated called for wrapper card'),await this.templateEvaluator.initialize(),!this.ts&&this.ii?.cards){this.ts=!0,a('INIT','firstUpdated: Initializing build.');try{if(!1===await this.cardBuilder.build())return void a('LIFECYCLE','Build was skipped in firstUpdated (likely disconnected) - will retry on connect');this.isConnected&&this.cardContainer&&a('LIFECYCLE','Build finished in firstUpdated, setting up features')}catch(t){console.error('SimpleSwipeCard: Build failed in firstUpdated:',t),a('ERROR','Build failed, card may not function properly')}}}static async getConfigElement(){return a('SYSTEM','SimpleSwipeCard.getConfigElement called'),await customElements.whenDefined('simple-swipe-card-editor'),document.createElement('simple-swipe-card-editor')}static getStubConfig(){return a('SYSTEM','SimpleSwipeCard.getStubConfig called'),{type:'custom:simple-swipe-card',cards:[]}}setConfig(t){if(!t)throw new Error('Invalid configuration');if(a('EDITOR','Editor setConfig received:',JSON.stringify(t)),this.ii=JSON.parse(JSON.stringify(t)),this.es(),Array.isArray(this.ii.cards)||(this.ii.cards=[]),void 0===this.ii.show_pagination&&(this.ii.show_pagination=!0),void 0===this.ii.auto_hide_pagination)this.ii.auto_hide_pagination=0;else{const t=parseInt(this.ii.auto_hide_pagination);this.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.ii.card_spacing)this.ii.card_spacing=15;else{const t=parseInt(this.ii.card_spacing);this.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.ii.enable_loopback&&void 0===this.ii.loop_mode&&(this.ii.loop_mode=this.ii.enable_loopback?'loopback':'none',delete this.ii.enable_loopback,a('CONFIG','Migrated enable_loopback to loop_mode:',this.ii.loop_mode)),void 0===this.ii.loop_mode&&(this.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.ii.loop_mode)||(a('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.ii.loop_mode),this.ii.loop_mode='none'),this.loopMode?.initialize(),void 0!==this.ii.swipe_direction&&['horizontal','vertical'].includes(this.ii.swipe_direction)||(this.ii.swipe_direction='horizontal'),'vertical'!==this.ii.swipe_direction||t.grid_options?this.removeAttribute('data-vertical-no-grid'):this.setAttribute('data-vertical-no-grid',''),this.closest('hui-card-preview')||this.closest('hui-card-element-editor')?this.setAttribute('data-editor-mode',''):this.removeAttribute('data-editor-mode'),!0===this.ii.enable_backdrop_filter?this.setAttribute('data-enable-backdrop-filter',''):this.removeAttribute('data-enable-backdrop-filter'),void 0===this.ii.swipe_behavior&&(this.ii.swipe_behavior='single'),['single','free'].includes(this.ii.swipe_behavior)?'free'===this.ii.swipe_behavior&&'infinite'!==this.ii.loop_mode&&(this.ii.swipe_behavior='single',a('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.ii.swipe_behavior='single',void 0===this.ii.auto_height&&(this.ii.auto_height=!1),!0===this.ii.auto_height&&('carousel'===this.ii.view_mode||'vertical'===this.ii.swipe_direction||'infinite'===this.ii.loop_mode)&&(delete this.ii.auto_height,a('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)')),void 0===this.ii.enable_auto_swipe&&(this.ii.enable_auto_swipe=!1),void 0===this.ii.auto_swipe_interval?this.ii.auto_swipe_interval=2e3:(this.ii.auto_swipe_interval=parseInt(this.ii.auto_swipe_interval),(isNaN(this.ii.auto_swipe_interval)||this.ii.auto_swipe_interval<500)&&(this.ii.auto_swipe_interval=2e3)),void 0===this.ii.enable_reset_after&&(this.ii.enable_reset_after=!1),void 0===this.ii.reset_after_timeout?this.ii.reset_after_timeout=3e4:this.templateEvaluator.isTemplate(this.ii.reset_after_timeout)||(this.ii.reset_after_timeout=parseInt(this.ii.reset_after_timeout),(isNaN(this.ii.reset_after_timeout)||this.ii.reset_after_timeout<5e3)&&(this.ii.reset_after_timeout=3e4)),void 0===this.ii.reset_target_card?this.ii.reset_target_card=1:this.templateEvaluator.isTemplate(this.ii.reset_target_card)||(this.ii.reset_target_card=Math.max(1,parseInt(this.ii.reset_target_card)||1)),void 0===this.ii.view_mode&&(this.ii.view_mode='single'),['single','carousel'].includes(this.ii.view_mode)||(this.ii.view_mode='single'),'carousel'===this.ii.view_mode){if(void 0===this.ii.card_min_width)this.ii.card_min_width=200;else{const t=parseInt(this.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.ii.card_min_width=200)}if(void 0!==this.ii.cards_visible){const t=parseFloat(this.ii.cards_visible);this.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}}t.card_mod?(a('CARD_MOD','Card-mod configuration detected',t.card_mod),this.Mi=JSON.parse(JSON.stringify(t.card_mod))):this.Mi=null,this.Qt=this.ii.swipe_direction,this.ss=this.ii.view_mode||'single',delete this.ii.title,this.autoHeight?.initialize(),this.templateEvaluator.scanConfig(this.ii),this.requestUpdate()}ai(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth;if(t<=0)return a('LOOP','Container width not available, using default cards_visible: 2.5'),2.5;const i=this.ii.card_min_width||200,e=Math.max(0,parseInt(this.ii.card_spacing))||0;return Math.max(1.1,Math.round((t+e)/(i+e)*10)/10)}Zi(){a('VISIBILITY','Handling conditional card visibility change'),this.ns&&clearTimeout(this.ns),this.ns=setTimeout(()=>{this.rs(),this.ns=null},150)}rs(){if(!this.ii?.cards||!this.Ni){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||a('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=gt(t.visibility,this.Ni);let s=!0;if('conditional'===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(a('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.ds(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Bi(){if(!this.ii?.cards||!this.Ni){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||a('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];if(this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=gt(t.visibility,this.Ni);let s=!0;'conditional'===t.type&&t.conditions&&(s=this.hs(t.conditions));let n=!0;if(this.cards&&this.cards[i]?.element){const t=this.cards[i].element;t.classList?.contains('hidden')&&(n=!1,a('VISIBILITY',`Card ${i} has 'hidden' class from child card's own visibility logic`))}e&&s&&n&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)){if(a('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.ds(t),this.building||!this.initialized)return void a('VISIBILITY','Skipping visibility rebuild during initial setup to prevent flicker');this.ls()}}hs(t){return!t||!Array.isArray(t)||0===t.length||!this.Ni||t.every(t=>{try{return this.cs(t)}catch(i){return a('VISIBILITY','Error evaluating conditional card condition:',t,i),!0}})}cs(t){if(!t||'object'!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:r}=t,d=i||(!e||void 0===s&&void 0===n?null:'state')||(!e||void 0===o&&void 0===r?null:'numeric_state');switch(d){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','Conditional card AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','Conditional card AND condition has empty \'conditions\' array'),!0;const i=t.conditions.every(t=>{try{return this.cs(t)}catch(i){return a('VISIBILITY','Error evaluating nested conditional card AND condition:',t,i),!1}});return a('VISIBILITY',`Conditional card AND condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','Conditional card OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','Conditional card OR condition has empty \'conditions\' array'),!1;const i=t.conditions.some(t=>{try{return this.cs(t)}catch(i){return a('VISIBILITY','Error evaluating nested conditional card OR condition:',t,i),!1}});return a('VISIBILITY',`Conditional card OR condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'not':if(!t.condition)return a('VISIBILITY','Conditional card NOT condition missing \'condition\' property'),!1;try{const i=this.cs(t.condition),e=!i;return a('VISIBILITY',`Conditional card NOT condition result: ${e} (nested was ${i})`),e}catch(i){return a('VISIBILITY','Error evaluating nested conditional card NOT condition:',t.condition,i),!1}case'state':{if(!e||!this.Ni.states[e])return a('VISIBILITY',`Entity ${e} not found for conditional card state condition`),!1;const t=this.Ni.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return a('VISIBILITY',`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return a('VISIBILITY',`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case'numeric_state':{if(!e||!this.Ni.states[e])return a('VISIBILITY',`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.Ni.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==r&&(i=i&&t<parseFloat(r)),a('VISIBILITY',`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return a('VISIBILITY',`Conditional card screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const i=this.Ni.user;if(i&&i.id){const e=t.users.includes(i.id);return a('VISIBILITY',`Conditional card user condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(a('VISIBILITY','Unknown or invalid conditional card condition:',t),!1):(a('VISIBILITY',`Unknown conditional card condition type: ${d}`),!0)}}ls(){this.us&&clearTimeout(this.us),this.us=setTimeout(()=>{this.initialized&&this.isConnected&&!this.building&&(a('VISIBILITY','Performing debounced rebuild due to visibility changes'),this.cardBuilder.build()),this.us=null},300)}ds(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=this.visibleCardIndices.indexOf(t[this.currentIndex]);if(-1!==i)this.currentIndex=i,a('VISIBILITY',`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,a('VISIBILITY',`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),a('VISIBILITY',`Adjusted to maintain relative position: ${this.currentIndex}`))}}ps(){this.gs&&clearTimeout(this.gs),this.gs=setTimeout(()=>{this.Bi(),this.gs=null},200)}fs(t){a('ERROR',`${t}`),this.ii={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}vs(){a('CONFIG','Updating child card configs'),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.ii.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){a('CONFIG','Updating config for visible card',i,'original index',t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}ws(){if(a('CONFIG','Updating layout options (pagination, spacing, direction)'),this.Qt!==this.ii.swipe_direction)return this.Qt=this.ii.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.Mi&&this.Ri()}set hass(t){if(!t)return;const i=this.Ni;if(i===t)return;this.Ni=t;const e=!i||i.states!==t.states,s=!i||i.localize!==t.localize||i.themes!==t.themes||i.language!==t.language,n=e&&this.bs(i,t);return this.si?(a('LOOP','Skipping hass-triggered visibility update during seamless jump'),void((e||s)&&this.Is(t))):this.building?(a('VISIBILITY','Skipping visibility update during build to prevent rebuild flicker'),void((e||s)&&this.Is(t))):(n&&(a('HASS','Our relevant entities changed - updating visibility'),this.gs&&(clearTimeout(this.gs),this.gs=null),this.Bi()),e&&this.stateSynchronization.onHassChange(i,t),void((e||s)&&this.Is(t)))}bs(t,i){if(!t||!t.states||!i.states)return!0;const e=this.ys();if(0===e.length)return!1;for(const s of e){const e=t.states[s],n=i.states[s];if(!e!=!n)return a('HASS',`Our entity ${s} added/removed`),!0;if(e&&n&&(e.state!==n.state||e.last_changed!==n.last_changed))return a('HASS',`Our entity ${s} state changed: ${e.state} -> ${n.state}`),!0}return!1}ys(){if(this.Ye&&this.Ge===this.Es())return this.Ye;const t=new Set;return this.ii.state_entity&&t.add(this.ii.state_entity),this.ii.cards&&Array.isArray(this.ii.cards)&&this.ii.cards.forEach(i=>{i.visibility&&Array.isArray(i.visibility)&&i.visibility.forEach(i=>{i.entity&&t.add(i.entity)})}),this.templateEvaluator?.hasTemplates()&&this.templateEvaluator.getReferencedEntities().forEach(i=>t.add(i)),this.Ye=Array.from(t),this.Ge=this.Es(),this.Ye.length>0&&a('HASS',`Tracking ${this.Ye.length} entities for visibility/state sync:`,this.Ye),this.Ye}Es(){if(!this.ii||!this.ii.cards)return'';const t=[this.ii.cards.length,this.ii.state_entity||'',this.ii.cards.filter(t=>t.visibility?.length>0).length,this.templateEvaluator?.getTemplateOptions().join(',')||''];return t.join('|')}es(){this.Ye=null,this.Ge=null,a('HASS','Cleared our relevant entities cache')}getEvaluatedConfigValue(t,i){const e=this.ii[t];if(null==e)return i;if(this.templateEvaluator?.isTemplate(e)&&this.templateEvaluator.isAvailable&&this.Ni){const e=this.templateEvaluator.getEvaluatedValue(t,this.Ni);return null!=e?e:(a('TEMPLATE',`Template evaluation failed for ${t}, using default: ${i}`),i)}return e}Is(t){this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error('Error setting hass on child card:',t)}})}connectedCallback(){if(super.connectedCallback(),a('LIFECYCLE','connectedCallback - simplified for wrapper card'),this.si&&(a('INIT','Clearing stuck seamless jump flag on connect'),this.si=!1),this.addEventListener('config-changed',this.Ze.bind(this)),this.ii&&this.ii.cards&&this.ii.cards.length>0&&!this.cardContainer)return a('LIFECYCLE','Card needs build (firstUpdated may have run while disconnected) - triggering build'),requestAnimationFrame(()=>{this.isConnected&&(a('LIFECYCLE','Executing deferred build after reconnection'),this.cardBuilder.build().then(()=>{this.isConnected&&(a('LIFECYCLE','Deferred build completed successfully'),this.Mi&&(a('CARD_MOD','Reapplying card-mod styles after deferred build'),this.Ri(),this.ae()))}).catch(t=>{console.error('SimpleSwipeCard: Deferred build failed:',t)}))}),void a('LIFECYCLE','connectedCallback finished (deferred build scheduled)');this.cards&&this.cards.length>0&&!this.cardContainer&&this.ii?(a('LIFECYCLE','Detected reconnection scenario - rebuilding card'),this.cardBuilder.build().then(()=>{this.isConnected&&(a('LIFECYCLE','Reconnection build completed'),this.Mi&&(a('CARD_MOD','Reapplying card-mod styles after reconnection build'),this.Ri(),this.ae()),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()}))}).catch(t=>{console.error('SimpleSwipeCard: Reconnection build failed:',t),a('ERROR','Reconnection build failed, swipe may not work')})):this.initialized&&this.cardContainer&&(a('LIFECYCLE','connectedCallback: Handling reconnection with intact DOM'),this.ne(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.Mi&&(this.Ri(),this.ae()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage(),a('LIFECYCLE','Re-creating pagination after reconnection'),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()})),a('LIFECYCLE','connectedCallback finished')}disconnectedCallback(){super.disconnectedCallback(),a('INIT','disconnectedCallback - Enhanced cleanup starting'),this.building&&(a('INIT','Disconnecting during active build - aborting build'),this.building=!1),this.si&&(a('INIT','Clearing stuck seamless jump flag on disconnect'),this.si=!1),this.removeEventListener('config-changed',this.Ze.bind(this));try{this.Ss(),this.xs(),this.Ts(),this.Cs(),this.$s(),this.Os()}catch(t){console.warn('Error during cleanup:',t)}this.initialized=!1,a('INIT','disconnectedCallback - Enhanced cleanup completed')}Ss(){['_visibilityRebuildTimeout','_conditionalVisibilityTimeout','_visibilityUpdateTimeout','_layoutRetryCount'].forEach(t=>{this[t]&&(clearTimeout(this[t]),this[t]=null,a('INIT',`Cleared timeout: ${t}`))})}xs(){try{this.resizeObserver&&(this.resizeObserver.cleanup(),this.resizeObserver=null),this.swipeGestures&&(this.swipeGestures.removeGestures(),this.swipeGestures.bt=!1,this.swipeGestures.Ct=!1),this.autoSwipe&&(this.autoSwipe.stop(),this.autoSwipe.ci=null,this.autoSwipe.pi=null),this.resetAfter&&(this.resetAfter.stopTimer(),this.resetAfter.bi=null),this.stateSynchronization&&this.stateSynchronization.stop(),this.autoHeight&&this.autoHeight.cleanup(),a('INIT','Feature managers cleaned up (state preserved)')}catch(t){console.warn('Error cleaning up feature managers:',t)}}Ts(){this.cardContainer=null,this.sliderElement=null,this.Fi(),this.te&&(this.te.disconnect(),this.te=null,a('MUSHROOM','Mushroom-select observer cleaned up')),this.pagination&&this.pagination.paginationElement&&(this.pagination.paginationElement=null),a('INIT','DOM references and observers cleaned up (cards preserved)')}Cs(){if(this.We)try{this.We.disconnect(),this.We=null,a('CARD_MOD','Card-mod observer cleaned up')}catch(t){console.warn('Error cleaning up card-mod observer:',t)}}Os(){this.swipeGestures&&this.swipeGestures.Rt&&(clearTimeout(this.swipeGestures.Rt),this.swipeGestures.Rt=null,this.swipeGestures.Dt=!1),this.loopMode&&this.loopMode._e&&(clearTimeout(this.loopMode._e),this.loopMode._e=null,this.si=!1),this.Ns(),a('INIT','Remaining event listeners cleared')}Ze(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this._s||(a('EVENT','Root element received config-changed event:',t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&a('ELEMENT','Caught element editor event, allowing normal propagation'))}Ke(t){if(!this.ii.enable_auto_swipe)return;const i=t.composedPath();if(!i.includes(this))return;const e=i[0];a('INPUT',`Focus event detected - e.target: ${t.target.tagName}, actualTarget: ${e.tagName}, isContentEditable: ${e.isContentEditable}`),('INPUT'===e.tagName||'TEXTAREA'===e.tagName||'SELECT'===e.tagName||e.isContentEditable)&&(a('INPUT',`Text input focused (${e.tagName||'contenteditable'}) - pausing auto-swipe indefinitely`),this.autoSwipe.pause(36e5))}Qe(t){if(!this.ii.enable_auto_swipe)return;const i=t.composedPath();if(!i.includes(this))return;const e=i[0];a('INPUT',`Blur event detected - e.target: ${t.target.tagName}, actualTarget: ${e.tagName}, isContentEditable: ${e.isContentEditable}`),('INPUT'===e.tagName||'TEXTAREA'===e.tagName||'SELECT'===e.tagName||e.isContentEditable)&&(a('INPUT',`Text input blurred (${e.tagName||'contenteditable'}) - resuming auto-swipe`),this.autoSwipe.pi&&(clearTimeout(this.autoSwipe.pi),this.autoSwipe.pi=null),this.autoSwipe.ui=!1,this.autoSwipe.start())}Xi(){this.Xe?a('INPUT','Input listeners already set up, skipping'):(a('INPUT','Setting up input focus/blur listeners for auto-swipe pause on document'),this.Xe=this.Ke,this.qe=this.Qe,document.addEventListener('focusin',this.Xe,!0),document.addEventListener('focusout',this.qe,!0),a('INPUT','Input listeners successfully attached to document'))}Ns(){this.Xe&&(document.removeEventListener('focusin',this.Xe,!0),this.Xe=null),this.qe&&(document.removeEventListener('focusout',this.qe,!0),this.qe=null),a('INPUT','Cleaned up input focus/blur listeners from document')}ne(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;a('INIT','Setting up resize observer.');let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(a('INIT','Resize detected, recalculating layout.',{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i())},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{a('INIT','Removing resize observer.'),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,()=>this.recalculateLayout()))}recalculateLayout(){if(!this.cardContainer||!this.isConnected)return;const t=this.cardContainer.offsetWidth,i=this.cardContainer.offsetHeight;(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(a('SYSTEM','Recalculating layout due to resize.',{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.slideWidth=t,this.slideHeight=i,this.updateSlider(!1))}ti(t){return function(t,i=null){if(!t)return'none';if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return'none';let e='0.3s',s='ease-out';if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue('--simple-swipe-card-transition-speed').trim(),o=t.getPropertyValue('--simple-swipe-card-transition-easing').trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}Ri(){!function(t,i,e,s,n){if(t&&i){if(t.style){a('CARD_MOD','Applying card-mod styles');const o=document.createElement('style');let r;if(o.setAttribute('id','card-mod-styles'),'string'==typeof t.style)r=t.style,a('CARD_MOD','Using direct string format');else{if('object'!=typeof t.style||!t.style['.'])return void a('CARD_MOD','Unknown card-mod style format, skipping');r=t.style['.'],a('CARD_MOD','Using object format with \'.\' key')}o.textContent=r;const d=i.querySelector('#card-mod-styles');if(d)try{i.removeChild(d)}catch(t){a('CARD_MOD','Error removing existing style:',t)}try{if(!i||!i.appendChild)return void a('ERROR','shadowRoot is invalid for appendChild operation');i.appendChild(o)}catch(t){return void a('ERROR','Failed to append card-mod styles:',t)}if(e){a('CARD_MOD','Forwarding CSS variables from host to shadow DOM');try{const t=window.getComputedStyle(e),o=[i.querySelector('.card-container'),s,n].filter(Boolean),r=['--simple-swipe-card-pagination-dot-inactive-color','--simple-swipe-card-pagination-dot-active-color','--simple-swipe-card-pagination-dot-inactive-opacity','--simple-swipe-card-pagination-dot-active-opacity','--simple-swipe-card-pagination-dot-size','--simple-swipe-card-pagination-dot-active-size','--simple-swipe-card-pagination-border-radius','--simple-swipe-card-pagination-dot-spacing','--simple-swipe-card-pagination-background','--simple-swipe-card-pagination-padding','--simple-swipe-card-pagination-bottom','--simple-swipe-card-pagination-right','--simple-swipe-card-transition-speed','--simple-swipe-card-transition-easing','--simple-swipe-card-pagination-fade-duration','--simple-swipe-card-pagination-animation-type','--simple-swipe-card-pagination-animation-delay','--simple-swipe-card-pagination-animation-easing'];o.forEach(i=>{i&&r.forEach(e=>{try{const s=t.getPropertyValue(e);s&&(a('CARD_MOD',`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))}catch(t){a('CARD_MOD',`Error forwarding ${e}:`,t)}})})}catch(t){a('ERROR','Error forwarding CSS variables:',t)}}}}else a('CARD_MOD','No card-mod config or shadow root, skipping style application')}(this.Mi,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}ae(){this.We&&(this.We.disconnect(),this.We=null),this.We=function(t,i){const e=new MutationObserver(t=>{t.some(t=>'attributes'===t.type&&('style'===t.attributeName||t.attributeName.includes('style')))&&(a('CARD_MOD','Host style attribute changed, reapplying card-mod styles'),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:['style']}),a('CARD_MOD','Set up mutation observer for style changes')),e}(this.shadowRoot,()=>{this.Ri()})}oe(){this.je&&(this.je.disconnect(),this.je=null),this.sliderElement&&this.cards&&0!==this.cards.length&&(a('VISIBILITY','Setting up child visibility observer for cards with self-managed visibility'),this.je=new MutationObserver(t=>{let i=!1;for(const e of t)if('attributes'===e.type&&'class'===e.attributeName){const t=e.target,s=t.classList?.contains('hidden'),n=e.oldValue?.includes('hidden');if(s!==n){i=!0,a('VISIBILITY','Child card visibility changed via \'hidden\' class:',t.tagName);break}}i&&(this.Je&&clearTimeout(this.Je),this.Je=setTimeout(()=>{this.isConnected&&!this.building&&(a('VISIBILITY','Triggering visibility update after child card visibility change'),this.Bi()),this.Je=null},150))}),this.cards.forEach(t=>{t.element&&this.je.observe(t.element,{attributes:!0,attributeFilter:['class'],attributeOldValue:!0})}))}Fi(){this.je&&(this.je.disconnect(),this.je=null),this.Je&&(clearTimeout(this.Je),this.Je=null)}goToSlide(t,i=1,e=!0){this.Oe=i;const s=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===s||!this.initialized||this.building)return void a('SWIPE','goToSlide skipped',{totalVisible:s,initialized:this.initialized,building:this.building});const n=this.ii.view_mode||'single',o=this.ii.loop_mode||'none';t=this.loopMode.handleNavigation(t,'carousel'===n),this.currentIndex=t,a('SWIPE',`Going to visible slide ${this.currentIndex} (${n} mode)`);const r='infinite'===o?(this.currentIndex%s+s)%s:this.currentIndex;this.stateSynchronization?.onCardNavigate(r),this.updateSlider(e),this.autoHeight?.updateForCurrentCard(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.ii.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){if(this.cardContainer){const t=0===this.slideWidth||0===this.slideHeight;if(t||300===this.slideWidth&&100===this.slideHeight){const i=this.cardContainer.offsetWidth,e=this.cardContainer.offsetHeight;i>0&&e>0&&(this.slideWidth=i,this.slideHeight=e,a('SWIPE','Recalculated dimensions in updateSlider:',{width:this.slideWidth,height:this.slideHeight,reason:t?'uninitialized':'fallback'}))}}const i=this.visibleCardIndices.length;if(a('SWIPE',`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.ii.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void a('SWIPE','updateSlider skipped',{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.ii.card_spacing))||0,s=this.ii.loop_mode||'none';if('carousel'===(this.ii.view_mode||'single')&&this.carouselView){this.sliderElement.style.gap=`${e}px`;let i=t?null:0;if(t&&'free'===this.ii.swipe_behavior&&this.Oe>1){i=this.swipeBehavior.calculateAnimationDuration(this.Oe);const t=this.swipeBehavior.getEasingFunction(this.Oe);this.sliderElement.style.transition=`transform ${i}ms ${t}`,a('SWIPE',`Carousel multi-card animation: ${this.Oe} cards, ${i}ms duration, easing: ${t}`)}return this.carouselView.updateSliderPosition(this.currentIndex,t),this.pagination.update(t),this.Oe=1,void(t&&(i>0||null===i)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,i))}const n='horizontal'===this.Qt;let o=this.currentIndex;if('infinite'===s&&i>1){const t=this.loopMode.getDuplicateCount();o=this.currentIndex+t,a('SWIPE',`Infinite mode: logical index ${this.currentIndex} -> DOM position ${o}`)}else'none'!==s&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),o=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let r=0;r=n?o*(this.slideWidth+e):o*(this.slideHeight+e);let d=null;if(t&&'free'===this.ii.swipe_behavior&&this.Oe>1){d=this.swipeBehavior.calculateAnimationDuration(this.Oe);const t=this.swipeBehavior.getEasingFunction(this.Oe);this.sliderElement.style.transition=`transform ${d}ms ${t}`,a('SWIPE',`Multi-card animation: ${this.Oe} cards, ${d}ms duration, easing: ${t}`)}else this.sliderElement.style.transition=this.ti(t);if(this.sliderElement.style.transform=n?`translateX(-${r}px)`:`translateY(-${r}px)`,!n)if(t){this.Ms&&clearTimeout(this.Ms);let t=300;if(d&&d>0)t=d;else if(this.sliderElement.isConnected){const i=getComputedStyle(this.sliderElement).getPropertyValue('--simple-swipe-card-transition-speed').trim();i&&i.endsWith('s')?t=1e3*parseFloat(i):i&&i.endsWith('ms')&&(t=parseFloat(i))}this.sliderElement.classList.add('animating'),this.Ms=setTimeout(()=>{this.sliderElement.classList.remove('animating'),this.Rs(o),this.Ms=null},t)}else this.sliderElement.classList.remove('animating'),this.Rs(o);this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight='0px',t.slide.style.marginLeft='0px',t.slide.style.marginTop='0px',t.slide.style.marginBottom='0px')}),this.pagination.update(t),this.Oe=1,a('SWIPE',`Slider updated, DOM position: ${o}, transform: -${r}px along ${n?'X':'Y'} axis`),t&&(d>0||null===d)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,d)}Ds(t){this.pagination.paginationElement&&this.pagination.paginationElement.querySelectorAll('.pagination-dot').forEach((i,e)=>{i.classList.toggle('active',e===t)})}Rs(t){if(!this.sliderElement)return;const i=this.sliderElement.querySelectorAll('.slide');0!==i.length&&(i.forEach((i,e)=>{e===t?i.classList.add('active-slide'):i.classList.remove('active-slide')}),a('SWIPE',`Active slide updated: position ${t}`))}de(){this.shadowRoot&&(a('DROPDOWN','Setting up dropdown detection'),this.As=0,this.ks=t=>{const i=t.target;t.composedPath().includes(this)&&(a('DROPDOWN',`Dropdown opened: ${i.tagName}`,i),this.Ls())},this.Ps=t=>{const i=t.target;t.composedPath().includes(this)&&(a('DROPDOWN',`Dropdown closed: ${i.tagName}`,i),this.zs())},document.addEventListener('opened',this.ks,!0),document.addEventListener('closed',this.Ps,!0),document.addEventListener('MDCMenuSurface:opened',this.ks,!0),document.addEventListener('MDCMenuSurface:closed',this.Ps,!0),this.Us=new MutationObserver(t=>{t.forEach(t=>{t.addedNodes.forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&('MWC-MENU'===t.tagName||'HA-SELECT'===t.tagName||'MUSHROOM-SELECT'===t.tagName||t.classList?.contains('mdc-menu-surface')||t.classList?.contains('mdc-select__menu'))&&t.open&&(a('DROPDOWN','Dropdown element added to DOM and opened',t),this.Ls())}),t.removedNodes.forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&('MWC-MENU'===t.tagName||'HA-SELECT'===t.tagName||'MUSHROOM-SELECT'===t.tagName||t.classList?.contains('mdc-menu-surface')||t.classList?.contains('mdc-select__menu'))&&(a('DROPDOWN','Dropdown element removed from DOM',t),this.zs())})})}),this.Us.observe(this.shadowRoot,{childList:!0,subtree:!0}),a('DROPDOWN','Dropdown detection setup complete'))}$s(){a('DROPDOWN','Cleaning up dropdown detection'),this.ks&&(document.removeEventListener('opened',this.ks,!0),document.removeEventListener('closed',this.Ps,!0),document.removeEventListener('MDCMenuSurface:opened',this.ks,!0),document.removeEventListener('MDCMenuSurface:closed',this.Ps,!0),this.ks=null,this.Ps=null),this.Us&&(this.Us.disconnect(),this.Us=null),this.As=0,this.classList.remove('dropdown-open'),a('DROPDOWN','Dropdown detection cleanup complete')}Ls(){this.As++,1===this.As&&(this.classList.add('dropdown-open'),a('DROPDOWN','Elevated z-index - dropdown opened'))}zs(){this.As=Math.max(0,this.As-1),0===this.As&&(this.classList.remove('dropdown-open'),a('DROPDOWN','Restored z-index - all dropdowns closed'))}getCardSize(){if(0===this.visibleCardIndices.length)return 3;if(this.building){if(this.ii.min_height){const t=Math.ceil(parseInt(this.ii.min_height)/50);return a('CONFIG','Building - estimated card size from min_height:',t),t}return a('CONFIG','Building - using default estimated size: 5'),5}let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&'function'==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn('Error getting card size from current element:',i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return a('CONFIG','Calculated card size:',t),Math.max(3,t)}}class Rt{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0},this.Hs=null,this.Vs=null}cleanup(){this.Hs&&(clearTimeout(this.Hs),this.Hs=null),this.Vs&&(clearTimeout(this.Vs),this.Vs=null),a('EDITOR','EditorUIManager cleanup completed')}async initializeEditor(){this.editor._s=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.Fs=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.Bs=this.editor.eventHandling.Ws.bind(this.editor.eventHandling),this.editor.Ys=new Set,this.editor.Gs=null,this.editor.js=!1,this.editor.Js={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},xt(e).set(this.editor._s,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;if(!customElements.get('hui-card-picker'))for(;!customElements.get('hui-card-picker')&&t<10;){try{if(await this.loadCustomElements(),customElements.get('hui-card-picker'))return}catch(t){}await new Promise(t=>setTimeout(t,100)),t++}}async loadCustomElements(){if(!customElements.get('hui-card-picker'))try{const t=[()=>customElements.get('hui-entities-card')?.getConfigElement?.(),()=>customElements.get('hui-conditional-card')?.getConfigElement?.(),()=>customElements.get('hui-vertical-stack-card')?.getConfigElement?.(),()=>customElements.get('hui-horizontal-stack-card')?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get('hui-card-picker'))break}catch(t){}}catch(t){}}ensureCardPickerLoaded(){this.editor.shadowRoot&&(this.Hs&&clearTimeout(this.Hs),this.Hs=setTimeout(()=>{this.Xs(),this.Hs=null},100))}Xs(){if(a('EDITOR','_ensureCardPickerLoaded called'),!this.editor.shadowRoot)return void a('EDITOR','shadowRoot not ready, skipping card picker load');const t=this.editor.shadowRoot.querySelector('#card-picker-container');if(!t)return void a('EDITOR','Card picker container not found, skipping');t.style.display='block',t.hasAttribute('event-barrier-applied')||(t.setAttribute('event-barrier-applied','true'),t.addEventListener('config-changed',t=>{this.qs(t)},{capture:!0,passive:!1}));const i=t.querySelector('hui-card-picker');i?(i.style.display='block',i.requestUpdate&&!i.Zs&&(i.requestUpdate(),i.Zs=!0)):a('EDITOR','hui-card-picker element not found in container'),this.Ks()}qs(t){if(a('EDITOR','Intercepted config-changed at container level:',t.detail?.config?.type),t.target&&t.target.tagName&&'hui-card-picker'===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(a('EDITOR','Processing card selection:',i.type),this.editor.ii){const t=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[];t.push(i),this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.Ks()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1}Ks(){this.Vs||(this.Vs=setTimeout(()=>{this.editor.requestUpdate(),this.Vs=null},50))}}class Dt{constructor(t){this.editor=t,this.Vs=null}setConfig(t){if(!t)throw new Error('Invalid configuration');if(a('EDITOR','Editor setConfig received:',JSON.stringify(t)),this.editor.ii=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.ii.cards)||(this.editor.ii.cards=[]),void 0===this.editor.ii.show_pagination&&(this.editor.ii.show_pagination=!0),void 0===this.editor.ii.auto_hide_pagination)this.editor.ii.auto_hide_pagination=0;else{const t=parseInt(this.editor.ii.auto_hide_pagination);this.editor.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.editor.ii.card_spacing)this.editor.ii.card_spacing=15;else{const t=parseInt(this.editor.ii.card_spacing);this.editor.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.ii.enable_loopback&&void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode=this.editor.ii.enable_loopback?'loopback':'none',delete this.editor.ii.enable_loopback,a('CONFIG','Migrated enable_loopback to loop_mode:',this.editor.ii.loop_mode)),void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.editor.ii.loop_mode)||(a('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.editor.ii.loop_mode),this.editor.ii.loop_mode='none'),void 0!==this.editor.ii.swipe_direction&&['horizontal','vertical'].includes(this.editor.ii.swipe_direction)||(this.editor.ii.swipe_direction='horizontal'),void 0===this.editor.ii.swipe_behavior&&(this.editor.ii.swipe_behavior='single'),['single','free'].includes(this.editor.ii.swipe_behavior)?'free'===this.editor.ii.swipe_behavior&&'infinite'!==this.editor.ii.loop_mode&&(this.editor.ii.swipe_behavior='single',a('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.editor.ii.swipe_behavior='single',void 0===this.editor.ii.auto_height&&(this.editor.ii.auto_height=!1),!0===this.editor.ii.auto_height&&('carousel'===this.editor.ii.view_mode||'vertical'===this.editor.ii.swipe_direction||'infinite'===this.editor.ii.loop_mode)&&(delete this.editor.ii.auto_height,a('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)')),void 0===this.editor.ii.enable_auto_swipe&&(this.editor.ii.enable_auto_swipe=!1),void 0===this.editor.ii.auto_swipe_interval?this.editor.ii.auto_swipe_interval=2e3:(this.editor.ii.auto_swipe_interval=parseInt(this.editor.ii.auto_swipe_interval),(isNaN(this.editor.ii.auto_swipe_interval)||this.editor.ii.auto_swipe_interval<500)&&(this.editor.ii.auto_swipe_interval=2e3)),void 0===this.editor.ii.enable_reset_after&&(this.editor.ii.enable_reset_after=!1),void 0===this.editor.ii.reset_after_timeout?this.editor.ii.reset_after_timeout=3e4:(this.editor.ii.reset_after_timeout=parseInt(this.editor.ii.reset_after_timeout),(isNaN(this.editor.ii.reset_after_timeout)||this.editor.ii.reset_after_timeout<5e3)&&(this.editor.ii.reset_after_timeout=3e4)),void 0===this.editor.ii.reset_target_card)this.editor.ii.reset_target_card=1;else{const t=this.editor.ii.reset_target_card;'string'==typeof t&&(t.includes('{{')||t.includes('{%'))||(this.editor.ii.reset_target_card=Math.max(1,parseInt(t)||1))}if(void 0===this.editor.ii.view_mode&&(this.editor.ii.view_mode='single'),['single','carousel'].includes(this.editor.ii.view_mode)||(this.editor.ii.view_mode='single'),'carousel'===this.editor.ii.view_mode){if(void 0===this.editor.ii.card_min_width)this.editor.ii.card_min_width=200;else{const t=parseInt(this.editor.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.ii.card_min_width=200)}if(void 0!==this.editor.ii.cards_visible){const t=parseFloat(this.editor.ii.cards_visible);this.editor.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}}delete this.editor.ii.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.ii||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute('data-option'),s=i.parentElement?.configValue||i.parentElement?.getAttribute('data-option'),n=e||s;if(!n)return;let o;if('ha-entity-picker'===i.localName&&'value-changed'===t.type?o=t.detail.value||null:'ha-switch'===i.localName?o=i.checked:'ha-slider'===i.localName?(o=i.value,null==o&&(o=t.detail?.value||0)):'ha-textfield'===i.localName&&'number'===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o='card_spacing'===n?15:'auto_swipe_interval'===n?2e3:'reset_after_timeout'===n?3e4:'cards_visible'===n?2.5:0)):o=i.value,'auto_hide_pagination'===n&&(o=1e3*parseFloat(o),isNaN(o)||o<0?o=0:o>3e4&&(o=3e4),a('EDITOR',`Auto-hide pagination: ${o/1e3}s = ${o}ms`)),this.editor.ii[n]!==o){if('view_mode'===n){a('EDITOR',`View mode changing from ${this.editor.ii[n]} to ${o}`);const t={...this.editor.ii,[n]:o};return'carousel'===o?(delete t.swipe_direction,t.auto_height&&(delete t.auto_height,a('EDITOR','Removed auto_height (incompatible with carousel mode)')),t.cards_visible||t.card_min_width||(t.card_min_width=200),a('EDITOR','Cleaned config for carousel mode:',Object.keys(t))):'single'===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction='horizontal'),a('EDITOR','Cleaned config for single mode:',Object.keys(t))),this.editor.ii=t,this.fireConfigChanged(),void this.Ks()}if('card_min_width'===n){if(a('EDITOR',`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.ii.cards_visible){const t={...this.editor.ii};delete t.cards_visible,t.card_min_width=o,this.editor.ii=t,a('EDITOR','Migrated from cards_visible to card_min_width')}else this.editor.ii={...this.editor.ii,[n]:o};return this.fireConfigChanged(),void this.Ks()}if('view_mode'===n&&'carousel'===o||'swipe_direction'===n&&'vertical'===o||'loop_mode'===n&&'infinite'===o){a('EDITOR',`Mode change detected that affects auto_height: ${n} = ${o}`);const t={...this.editor.ii,[n]:o};return t.auto_height&&(delete t.auto_height,a('EDITOR',`Removed auto_height due to incompatible mode: ${n} = ${o}`)),this.editor.ii=t,this.fireConfigChanged(),void this.Ks()}a('EDITOR',`Value changed for ${n}:`,o),this.editor.ii={...this.editor.ii,[n]:o},this.fireConfigChanged(),this.Ks()}}Ks(){this.Vs||(this.Vs=setTimeout(()=>{this.editor.requestUpdate(),this.Vs=null},50))}handleTimeoutChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=5&&(this.editor.ii={...this.editor.ii,reset_after_timeout:1e3*i},this.fireConfigChanged())}handleTargetChange(t){const i=t.target.value;if('string'==typeof i&&(i.includes('{{')||i.includes('{%')))this.editor.ii={...this.editor.ii,reset_target_card:i},this.fireConfigChanged();else{const t=parseInt(i);!isNaN(t)&&t>=1&&(this.editor.ii={...this.editor.ii,reset_target_card:t},this.fireConfigChanged())}}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&'single'!==t.view_mode&&(i.view_mode=t.view_mode),'carousel'===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,enable_backdrop_filter:!1};return['card_spacing','swipe_direction','swipe_behavior','show_pagination','auto_hide_pagination','auto_height'].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),['loop_mode','enable_auto_swipe','auto_swipe_interval','enable_reset_after','reset_after_timeout','reset_target_card','state_entity','enable_backdrop_filter'].forEach(s=>{'state_entity'===s?t.state_entity&&null!==t.state_entity&&''!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards),['grid_options','layout_options','view_layout'].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.ii);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent('config-changed',{detail:{config:i,...e},bubbles:s,composed:!0});a('EVENT','Firing config-changed event',{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor._s,fromSwipeCardEditor:!0,...t})}cleanup(){this.Vs&&(clearTimeout(this.Vs),this.Vs=null),a('EDITOR','EditorConfigManager cleanup completed')}}class At{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:'Unknown',name:'',isPictureElements:!1};const i=t.type.startsWith('custom:')?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(' ');return{typeName:e,name:t.title||t.name||'',isPictureElements:'picture-elements'===i}}hasNestedCards(t){return!('custom:actions-card'!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&'picture-elements'===t.type}moveCard(t,i){if(!this.editor.ii?.cards)return;const e=[...this.editor.ii.cards],s=t+i;s<0||s>=e.length||(a('EDITOR',`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.ii?.cards||t<0||t>=this.editor.ii.cards.length)return;a('EDITOR',`Removing card at index ${t}`);const i=this.editor.ii.cards.filter((i,e)=>e!==t);this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const s=this.editor.ii.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;a('EDITOR',`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const r=[...this.editor.ii.cards];r[t]={...s,card:n},this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const e=this.editor.ii.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;a('EDITOR',`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.ii.cards];n[t]={...e,card:s},this.editor.ii={...this.editor.ii,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(a('EDITOR',`_editCard called for index ${t}`),!this.editor.ii||!this.editor.ii.cards||t<0||t>=this.editor.ii.cards.length)return void a('ERROR','SimpleSwipeCardEditor: Invalid index for card editing:',t);const i=this.editor.ii.cards[t],e=this.editor.hass,s=document.querySelector('home-assistant');if(e&&s)try{await customElements.whenDefined('hui-dialog-edit-card');const n=document.createElement('hui-dialog-edit-card');n.hass=e,document.body.appendChild(n),this.editor.Ys.add(n),n.Qs=this.editor._s,this.isPictureElementsCard(i)&&(n.setAttribute('data-editing-picture-elements','true'),n.tn=!0),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),r=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener('config-changed',o,{capture:!0}),n.addEventListener('show-dialog',r,{capture:!0}),n.addEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener('element-updated',t=>{a('ELEMENT','Element updated event on dialog',t.detail),n.en=!0,this.editor.eventHandling.Js.active=!0,this.editor.eventHandling.Js.timestamp=Date.now()},{capture:!0}),n.addEventListener('show-edit-element',t=>{a('ELEMENT','Show edit element event on dialog',t.detail),n.en=!0,this.editor.eventHandling.Js.active=!0,this.editor.eventHandling.Js.timestamp=Date.now()},{capture:!0})),'custom:actions-card'===i.type&&(n.sn=!0);const d=()=>{if(a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener('dialog-closed',d),n.removeEventListener('config-changed',o,{capture:!0}),n.removeEventListener('show-dialog',r,{capture:!0}),n.removeEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener('element-updated',h,{capture:!0}),n.removeEventListener('show-edit-element',l,{capture:!0})),this.editor.Ys.delete(n),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.Ys.size}`),n.en&&(a('ELEMENT','Element edit session reset due to dialog close'),setTimeout(()=>{this.editor.eventHandling.Js.active&&Date.now()-this.editor.eventHandling.Js.timestamp>500&&(this.editor.eventHandling.Js.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener('dialog-closed',d);const h=t=>{a('ELEMENT','Element updated event on dialog',t.detail),n.en=!0,this.editor.eventHandling.Js.active=!0,this.editor.eventHandling.Js.timestamp=Date.now()},l=t=>{a('ELEMENT','Show edit element event on dialog',t.detail),n.en=!0,this.editor.eventHandling.Js.active=!0,this.editor.eventHandling.Js.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener('element-updated',h,{capture:!0}),n.addEventListener('show-edit-element',l,{capture:!0}));const c={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(a('EDITOR',`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n.nn||n.en){if(a('ELEMENT',`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n.nn=!1,this.editor.eventHandling.Js.timestamp=Date.now(),i){a('ELEMENT','Silently updating config with element changes');const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.an&&!i)return a('ELEMENT',`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.an=null);if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};a('EDITOR',`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(c),a('EDITOR',`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){a('ERROR','SimpleSwipeCardEditor: Error opening edit dialog:',e),St(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved_fallback'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else a('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}async editNestedCard(t,i){if(a('EDITOR',`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.ii?.cards||!this.editor.ii.cards[t]||!this.hasNestedCards(this.editor.ii.cards[t]))return void a('ERROR','SimpleSwipeCardEditor: Invalid indices for nested card editing:',t,i);const e=this.editor.ii.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,r=document.querySelector('home-assistant');if(o&&r)try{await customElements.whenDefined('hui-dialog-edit-card');const d=document.createElement('hui-dialog-edit-card');d.hass=o,document.body.appendChild(d),this.editor.Ys.add(d),d.Qs=this.editor._s,this.isPictureElementsCard(n)&&(d.setAttribute('data-editing-picture-elements','true'),d.tn=!0),d.addEventListener('config-changed',t=>{if(this.editor.eventHandling.rn(t))return a('ELEMENT','Nested card: Detected element editor event, allowing natural propagation'),d.en=!0,this.editor.eventHandling.Js.active=!0,this.editor.eventHandling.Js.timestamp=Date.now(),void(t.detail&&t.detail.config&&(d.an=JSON.parse(JSON.stringify(t.detail.config)),d.nn=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(a('EDITOR','Marking nested event as already handled in _editNestedCard\'s dialog'),t.dn=!0)},!0);const h=()=>{if(d.removeEventListener('dialog-closed',h),d.en&&(a('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this.editor.eventHandling.Js.active=!1),this.editor.Ys.delete(d),d.parentNode===document.body)try{document.body.removeChild(d)}catch(t){console.warn('Error removing nested card dialog:',t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};d.addEventListener('dialog-closed',h);const l={cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(d.nn||d.en){if(a('ELEMENT','Nested card: Save detected from element editor, preserving dialog state'),d.nn=!1,this.editor.eventHandling.Js.timestamp=Date.now(),n){a('ELEMENT','Silently updating nested card config with element changes');const o=[...s];o[i]=n;const r={...e,card:o},d=[...this.editor.ii.cards];d[t]=r,this.editor.ii={...this.editor.ii,cards:d},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(d.an&&!n)return a('ELEMENT','Nested card: Element editor cancel detected, restoring previous config'),void(d.an=null);if(!n)return;a('EDITOR',`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const r={...e,card:o},h=[...this.editor.ii.cards];h[t]=r,this.editor.ii={...this.editor.ii,cards:h},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await d.showDialog(l)}catch(o){a('ERROR','SimpleSwipeCardEditor: Error opening edit dialog for nested card:',o),St(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else a('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}safelyAddCard(t){if(t&&this.editor.ii)try{const i=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],e={...this.editor.ii,cards:[...i,t]};this.editor.ii=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),a('EDITOR','Safely added card:',t.type)}catch(t){a('ERROR','Failed to safely add card:',t)}}handleCardPicked(t){if(a('EDITOR','Fallback _handleCardPicked called:',t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;a('EDITOR','Adding card in fallback handler:',i.type);const e=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],s={...this.editor.ii,cards:[...e,i]};this.editor.ii=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class kt{constructor(t){this.editor=t,this.Bs=this.Ws.bind(this),this.Js={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},this.hn=0,this.ln=1e3}setupEventListeners(){document.addEventListener('config-changed',this.Bs,{capture:!0}),this.cn=t=>{if(this.rn(t)){if(a('ELEMENT','Config-changed event from element editor, allowing propagation'),t.target&&t.target.closest('hui-dialog-edit-card')){const i=t.target.closest('hui-dialog-edit-card');i&&(i.en=!0,this.Js.active=!0,this.Js.parentDialogId=i.Qs||null,this.Js.timestamp=Date.now())}}else if('config-changed'===t.type&&t.detail?.config){const i='custom:actions-card'===t.detail?.config?.type;if('hui-card-picker'===t.target?.tagName?.toLowerCase()&&(t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(a('EDITOR','Card picker selection captured by global handler:',t.detail.config.type),i&&!this.editor.js))return this.editor.Gs={time:Date.now(),config:t.detail.config},this.editor.js=!0,this.editor.un(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}},document.addEventListener('config-changed',this.cn,{capture:!0}),this.pn=t=>{if(t.mn)return a('EVENT','Intercepted iron-select event already processed by actions card editor'),void t.stopPropagation()},document.addEventListener('iron-select',this.pn,{capture:!0}),this.gn=t=>{if(t.target&&'HUI-DIALOG-EDIT-CARD'===t.target.tagName){const i=t.target;a('EDITOR','A HUI-DIALOG-EDIT-CARD closed',{tracked:this.editor.Ys?.has(i)||!1,isActions:this.fn(i),handlingElementEdit:i.en}),i.en&&(a('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this.Js.active=!1,i.an&&(a('ELEMENT','Preserving element config on dialog close'),this.Js.savedState=i.an,i.an=null)),this.editor.Ys?.has(i)&&(this.editor.Ys.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&('HUI-DIALOG-EDIT-ELEMENT'===t.target.tagName||'HUI-DIALOG'===t.target.tagName&&this.rn(t))&&(a('ELEMENT','Element editor dialog closed'),setTimeout(()=>{this.Js.active&&Date.now()-this.Js.timestamp>500&&(a('ELEMENT','Resetting element edit session after timeout'),this.Js.active=!1)},500))},document.addEventListener('dialog-closed',this.gn,{capture:!0}),this.vn=t=>{'element-updated'!==t.type&&'show-edit-element'!==t.type||this.Js.active||(a('ELEMENT',`Capturing ${t.type} event, starting element edit session`),this.Js.active=!0,this.Js.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.Js.elementId=t.detail.elementId))},document.addEventListener('element-updated',this.vn,{capture:!0}),document.addEventListener('show-edit-element',this.vn,{capture:!0})}removeEventListeners(){document.removeEventListener('config-changed',this.cn,{capture:!0}),document.removeEventListener('iron-select',this.pn,{capture:!0}),document.removeEventListener('config-changed',this.Bs,{capture:!0}),document.removeEventListener('dialog-closed',this.gn,{capture:!0}),document.removeEventListener('element-updated',this.vn,{capture:!0}),document.removeEventListener('show-edit-element',this.vn,{capture:!0})}rn(t){if(!t)return!1;const i=Date.now(),e=i-this.hn>this.ln;if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return e&&(a('ELEMENT','Element editor detected through event detail'),this.hn=i),!0;const s=t.composedPath?t.composedPath():[];for(const t of s)if(t&&t.localName){if('hui-element-editor'===t.localName||'hui-dialog-edit-element'===t.localName||'hui-card-element-editor'===t.localName||t.localName.includes('element-editor'))return e&&(a('ELEMENT','Element editor detected through path node localName:',t.localName),this.hn=i),!0;if(t.wn||t.bn||t.getAttribute&&(t.getAttribute('element-id')||t.getAttribute('data-element-id'))||t.classList&&t.classList.contains('element-editor'))return a('ELEMENT','Element editor detected through specialized attributes'),!0;if('HUI-DIALOG'===t.tagName&&(t.querySelector('.element-editor')||t.In&&'string'==typeof t.In&&t.In.toLowerCase().includes('element')))return a('ELEMENT','Element editor detected through hui-dialog with element editor content'),!0}return'element-updated'===t.type||'config-changed'===t.type&&t.target&&('hui-element-editor'===t.target.localName||t.target.closest('hui-element-editor'))?(a('ELEMENT','Element editor detected through event characteristics'),!0):!!(this.Js.active&&Date.now()-this.Js.timestamp<5e3)&&(a('ELEMENT','Element editor event detected through active editing session'),!0)}fn(t){if(!t)return!1;if(t.sn)return!0;try{const i=t.cardConfig;return i&&'custom:actions-card'===i.type}catch(t){return!1}}Ws(t,i){let e,s;if(t&&'function'==typeof t.preventDefault?(e=t,s=null):(s=t,e=i),!e)return;if(s&&'auto_hide_pagination'===s.option)return;if(e.detail&&(e.detail.fromSwipeCardEditor||e.detail.fromElementEditor||e.detail.elementEditorEvent||e.detail.maintainEditorState))return void a('ELEMENT','Skipping our own generated event to prevent loop');if(this.rn(e)&&(a('ELEMENT','Detected element editor event in _handleNestedCardEvents'),e.composedPath&&this.editor.Ys&&e.composedPath().some(t=>this.editor.Ys.has(t)||t.Qs&&t.Qs===this.editor._s)))return void a('ELEMENT','Element editor event is related to our dialog stack, handling specially');if(e.yn||!e.detail?.fromActionCardEditor)return;const n=e.target.closest('[data-index]');if(!n||!this.editor.ii?.cards)return;const o=parseInt(n.getAttribute('data-index'));if(!(isNaN(o)||o<0||o>=this.editor.ii.cards.length)){if(a('EVENT',`Handling nested card event from actions card at index ${o}`,e.detail),e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.detail.maintainEditorState){a('EVENT','Event marked to maintain editor state, preventing propagation');const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type,maintainEditorState:!0})}else{const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type})}e.yn=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(' > '):'No path',i=e.detail?JSON.stringify(e.detail,null,2):'{}';a('EVENT','Config change event details:',{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.rn(e)){if(a('ELEMENT',`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.en=!0,this.Js.active=!0,this.Js.timestamp=Date.now(),e.detail&&e.detail.config&&(i.an=JSON.parse(JSON.stringify(e.detail.config)),i.nn=!0,i.tn))try{a('ELEMENT','Silently updating picture-elements config');const i=[...this.editor.ii.cards];i[t]=e.detail.config,this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){a('ERROR','Error silently updating config:',t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;a('EDITOR',`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.ii.cards];s[t]=i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:'child_dialog_update_'+(e.detail.fromActionCardEditor?'action_card':'generic')}),this.editor.requestUpdate(),a('EDITOR',`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else a('EDITOR',`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&('hui-dialog-edit-element'===i.detail.dialogTag||i.detail.dialogTag.includes('element-editor'))||i.detail.elementToEdit)){a('ELEMENT',`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.en=!0),this.Js.active=!0,this.Js.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.Js.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):'{}';a('EDITOR',`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),a('EDITOR',`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),St(this.editor,i.type,i.detail)}}class SimpleSwipeCardEditor extends ut{static get properties(){return{hass:{type:Object},ii:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return Et()}constructor(){super(),a('EDITOR','SimpleSwipeCardEditor Constructor invoked.'),a('EDITOR','Editor styles method available:',!!this.constructor.styles),this.uiManager=new Rt(this),this.configManager=new Dt(this),this.cardManagement=new At(this),this.eventHandling=new kt(this),this.uiManager.initializeEditor()}rn(t){return this.eventHandling.rn(t)}fn(t){return this.eventHandling.fn(t)}En(t){return this.cardManagement.isPictureElementsCard(t)}Sn(t){return this.cardManagement.hasVisibilityConditions(t)}xn(t){this.uiManager.toggleSection(t)}Tn(t){return this.cardManagement.hasNestedCards(t)}Cn(t){return this.cardManagement.getNestedCards(t)}$n(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}On(t,i){this.cardManagement.removeNestedCard(t,i)}async Nn(t,i){await this.cardManagement.editNestedCard(t,i)}async _n(t){await this.cardManagement.editCard(t)}Mn(t){this.cardManagement.handleCardPicked(t)}Rn(t){return this.cardManagement.getCardDescriptor(t)}Dn(t,i){this.cardManagement.moveCard(t,i)}An(t){this.cardManagement.removeCard(t)}un(t){this.cardManagement.safelyAddCard(t)}kn(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager||(a('EDITOR','Reinitializing managers in setConfig'),this.uiManager=new Rt(this),this.configManager=new Dt(this),this.cardManagement=new At(this),this.eventHandling=new kt(this),this.uiManager.initializeEditor()),this.configManager.setConfig(t)}Ln(t){this.configManager.handleValueChanged(t)}Pn(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.ii)return J`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;if(!this.uiManager||!this.configManager||!this.cardManagement)return J`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.ii.cards||[];try{return J`
        <div class="card-config">
          ${J`
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
          ${function(t,i){const e=t.view_mode||'single';return J`
    <div class="section">
      <div
        class="section-header-with-controls ${'single'===e?'single-mode':'carousel-mode'}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${'single'===e}
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
              .checked=${'carousel'===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${'carousel'===e?J`
            ${void 0!==t.cards_visible?J`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${t.cards_visible}</span
                    >
                  </div>
                `:''}

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
              @keydown=${t=>{'Enter'===t.key&&(t.preventDefault(),t.stopPropagation(),t.target.blur())}}
              @input=${t=>{const i=parseFloat(t.target.value);t.target.style.borderColor=i<50||i>500||isNaN(i)?'var(--error-color, #f44336)':''}}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${void 0!==t.cards_visible?'Changing this value will switch to responsive mode and remove the cards_visible setting':'Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size.'}
            </div>
          `:''}
    </div>
  `}(this.ii,this.Ln.bind(this))}
          ${function(t,i){const e=!1!==t.show_pagination,s=t.swipe_direction||'horizontal',n=t.swipe_behavior||'single',o=t.view_mode||'single',a=!0===t.auto_height;return J`
    <div class="section">
      <div class="section-header">Display Options</div>

      <ha-textfield
        label="Card Spacing (px)"
        .value=${(t.card_spacing??15).toString()}
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

      ${'single'===o?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${s}
                  data-option="swipe_direction"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${'horizontal'}>
                    Horizontal
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-horizontal"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${'vertical'}>
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
          `:J`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${'single'!==o||'vertical'!==s||t.grid_options?'':J`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Vertical swiping without grid_options configured will use a
                default height of 250px. For better control, configure
                grid_options in the Layout tab or add it to your YAML.
              </span>
            </div>
          `}

      <!-- AUTO HEIGHT TOGGLE - Always visible with smart disabling -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Auto Height</div>
          <div class="option-help">
            ${'single'===o&&'horizontal'===s&&'infinite'!==t.loop_mode?'Automatically adjust card height to match each card\'s content':'Not available in current mode'}
          </div>
        </div>
        <div class="option-control">
          <ha-switch
            .checked=${a}
            data-option="auto_height"
            @change=${i}
            .disabled=${'single'!==o||'horizontal'!==s||'infinite'===t.loop_mode}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${a&&'carousel'===o?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with carousel mode and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'vertical'===s?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with vertical swiping and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'infinite'===t.loop_mode?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `:''}
      ${a&&void 0!==t.grid_options?.rows?J`
            <div class="option-info warning" style="display: block;">
              <div
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"
              >
                <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                <strong>Auto Height is blocked</strong>
              </div>
              <div style="font-size: 12px; line-height: 1.5;">
                Your configuration has
                <code>grid_options: rows: ${t.grid_options.rows}</code>
                which prevents auto height from working. <br /><br />
                Go to the Layout tab and remove
                <strong><code>rows: ${t.grid_options.rows}</code></strong>
                (or remove it from YAML). Keep only <code>columns</code> in
                grid_options.
              </div>
            </div>
          `:''}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${'infinite'===t.loop_mode?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${n}
                  data-option="swipe_behavior"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${'single'}>
                    Single card
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:numeric-1-circle"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${'free'}>
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
          `:J`
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

      ${e?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-help">
                  Hide pagination dots after inactivity
                </div>
              </div>
              <div class="option-control">
                <div class="auto-hide-control">
                  <div class="auto-hide-value">
                    ${0===(t.auto_hide_pagination||0)?'Off':`${(t.auto_hide_pagination/1e3).toFixed(1)}s`}
                  </div>
                  <ha-slider
                    min="0"
                    max="30"
                    step="0.5"
                    .value=${(t.auto_hide_pagination||0)/1e3}
                    data-option="auto_hide_pagination"
                    @change=${i}
                  ></ha-slider>
                </div>
              </div>
            </div>
            <div class="info-text">
              Pagination dots will automatically hide after the specified time
              of inactivity. Set to 0 to disable auto-hide.
            </div>
          `:''}
    </div>
  `}(this.ii,this.Ln.bind(this))}
          ${function(t,i,e,s,n,o,a,r){const d=t.loop_mode||'none',h=!0===t.enable_auto_swipe,l=t.auto_swipe_interval??2e3,c=!0===t.enable_reset_after,u=t.reset_after_timeout??3e4,p=t.reset_target_card??1,m=t.state_entity||'',g=!0===t.enable_backdrop_filter;let f=0,v=0;'none'!==d&&f++,h&&f++,c&&!h&&f++,c&&h&&v++,m&&f++,g&&f++;let w='',b='';return f>0&&(w=`${f} active`),v>0&&(b=`${v} blocked`),J`
    <div class="collapsible-section">
      <div
        class="section-toggle ${i.advanced?'expanded':''}"
        @click=${()=>s('advanced')}
      >
        <ha-icon
          class="section-toggle-icon ${i.advanced?'expanded':''}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${w?J`<div class="section-toggle-badge">${w}</div>`:''}
        ${b?J`<div class="section-toggle-badge blocked-only">
              ${b}
            </div>`:''}
      </div>

      <div
        class="section-content compact-options ${i.advanced?'expanded':'collapsed'}"
      >
        ${function(t,i){return J`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${'none'===t?'Stop at first/last card (no looping)':'loopback'===t?'Jump back to first/last card':'Continuous loop navigation'}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t}
          data-option="loop_mode"
          @change=${i}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${'none'}> No looping </ha-list-item>
          <ha-list-item .value=${'loopback'}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${'infinite'}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
    </div>
  `}(d,e)}
        ${function(t,i,e){return J`
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

    ${t?J`
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
        `:''}
  `}(h,l,e)}
        ${function(t,i,e,s,n,o,a,r){const d='string'==typeof s&&(s.includes('{{')||s.includes('{%'));return J`
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
      ${i?'Disabled when auto-swipe is on':'Auto-return after inactivity'}
    </div>

    ${t&&!i?J`
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
            label="Target card"
            .value=${s.toString()}
            type=${d?'text':'number'}
            min=${d?void 0:'1'}
            max=${d?void 0:(Math.max(0,n.length-1)+1).toString()}
            @change=${r}
            ?disabled=${0===n.length}
            autoValidate
            ?required=${!d}
          ></ha-textfield>
          <div class="help-text">
            ${d?J`Template: <code>${s}</code>`:0===n.length?'Add cards first to set a target.':`Card number (1-${n.length}) or template like {{ states('sensor.day') }}`}
          </div>
        `:''}
  `}(c,h,u,p,n,e,o,a)}
        ${function(t,i,e){const s=Object.keys(i.states||{}).filter(t=>t.startsWith('input_select.')||t.startsWith('input_number.')).sort().map(t=>({entityId:t,friendlyName:i.states[t].attributes.friendly_name||t.replace(/^(input_select\.|input_number\.)/,'').replace(/_/g,' ')}));return J`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t||''}
          data-option="state_entity"
          @change=${e}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${''}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${s.map(t=>J`
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
  `}(m,r,e)}
        ${function(t,i){return J`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Enable Backdrop Filter (Advanced)</div>
        <div class="option-help">
          For card-mod users: Allow CSS backdrop-filter blur effects
        </div>
      </div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_backdrop_filter"
          @change=${i}
        ></ha-switch>
      </div>
    </div>

    <!-- Info/Warning when backdrop filter is enabled/disabled -->
    ${t?J`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Trade-off: Disables clip-path, which may prevent dropdown menus
              from overflowing card boundaries. Only enable if you're using
              <code>backdrop-filter: blur()</code> in card-mod CSS.
            </span>
          </div>
        `:J`
          <div
            class="option-help"
            style="margin-top: -4px; margin-bottom: 12px;"
          >
            When to enable: Only if you're using card-mod with
            <code>backdrop-filter: blur()</code> CSS
          </div>
        `}
  `}(g,e)}
      </div>
    </div>
  `}(this.ii,this.uiManager.getCollapsibleState(),this.Ln.bind(this),this.xn.bind(this),i,this.zn.bind(this),this.Un.bind(this),this.hass)}
          ${function(t,i,e,s,n,o,a,r,d,h,l,c){return J`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?J`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((u,p)=>function(t,i,e,s,n,o,a,r,d,h,l,c,u,p){const m=r(t),g=d(t),f=g?h(t):[],v=l(t),w=!s||gt(t.visibility,s);return J`
    <div
      class="card-row ${w?'':'hidden-card'}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${m.typeName}</span>
        ${m.isPictureElements?J`<span class="picture-elements-badge">Elements</span>`:''}
        ${v&&w?J`<span class="visibility-badge">Conditional</span>`:''}
        ${m.name?J`<span class="card-name">(${m.name})</span>`:''}
      </div>
      <div class="card-actions">
        ${v&&!w?J`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:''}
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
    ${g?function(t,i,e,s,n,o){return J`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const d=e(a);return J`
          <div
            class="nested-card-row"
            data-parent-index=${i}
            data-nested-index=${r}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${i+1}.${r+1}</span
              >
              <span class="nested-card-type">${d.typeName}</span>
              ${d.isPictureElements?J`<span class="picture-elements-badge">Elements</span>`:''}
              ${d.name?J`<span class="nested-card-name"
                    >(${d.name})</span
                  >`:''}
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
  `}(f,i,r,c,u,p):''}
  `}(u,p,t.length,i,e,s,n,o,a,r,d,h,l,c))}
      </div>
    </div>
  `}(i,this.hass,this.Dn.bind(this),this._n.bind(this),this.An.bind(this),this.Rn.bind(this),this.Tn.bind(this),this.Cn.bind(this),this.Sn.bind(this),this.$n.bind(this),this.Nn.bind(this),this.On.bind(this))}
          ${e=this.hass,s=this.lovelace,n=this.Fs,J`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
          ${function(){const i=document.createElement('div');i.className='version-display';const e=document.createElement('div');e.className='version-text',e.textContent='Simple Swipe Card';const s=document.createElement('div');s.className='version-badges';const n=document.createElement('div');n.className='version-badge',n.textContent=`v${t}`;const o=document.createElement('a');o.href='https://github.com/nutteloost/simple-swipe-card',o.target='_blank',o.rel='noopener noreferrer',o.className='github-badge';const a=document.createElement('ha-icon');a.icon='mdi:github';const r=document.createElement('span');return r.textContent='GitHub',o.appendChild(a),o.appendChild(r),s.appendChild(n),s.appendChild(o),i.appendChild(e),i.appendChild(s),i}()}
        </div>
      `}catch(t){return console.error('Simple Swipe Card Editor render error:',t),J`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${t.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`}var e,s,n}zn(t){this.configManager.handleTimeoutChange(t)}Un(t){this.configManager.handleTargetChange(t)}Hn(t){const i=1e3*parseFloat(t.target.value);this.ii={...this.ii,auto_hide_pagination:i},this.Vn()}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),a('EDITOR','SimpleSwipeCardEditor connectedCallback');try{this.uiManager||(a('EDITOR','Reinitializing managers after reconnection'),this.uiManager=new Rt(this),this.configManager=new Dt(this),this.cardManagement=new At(this),this.eventHandling=new kt(this),this.uiManager.initializeEditor()),xt(s,'Set').add(this);try{await this.uiManager.ensureComponentsLoaded()}catch(t){a('EDITOR','Warning: Could not load all components')}this.eventHandling?.setupEventListeners&&this.eventHandling.setupEventListeners(),setTimeout(()=>{this.uiManager?.ensureCardPickerLoaded&&this.uiManager.ensureCardPickerLoaded()},50),this.requestUpdate()}catch(t){console.error('Error during editor setup:',t),this.requestUpdate()}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),a('EDITOR','SimpleSwipeCardEditor disconnectedCallback');try{this.uiManager&&(this.uiManager.cleanup(),this.uiManager=null),this.configManager&&(this.configManager.cleanup(),this.configManager=null),this.cardManagement=null,this.eventHandling=null,this.eventHandling?.removeEventListeners(),this.Ys&&this.Ys.clear(),this._s=null}catch(t){console.warn('Error during editor cleanup:',t)}try{xt(s,'Set').delete(this);const t=xt(e);this._s&&t.delete(this._s)}catch(t){console.warn('Error unregistering editor:',t)}a('EDITOR','SimpleSwipeCardEditor cleanup completed')}}async function Lt(){try{await async function(){return a('SYSTEM','Using bundled LitElement dependencies'),!0}(),a('SYSTEM','Dependencies loaded, registering components'),customElements.get('simple-swipe-card')||(customElements.define('simple-swipe-card',SimpleSwipeCard),a('SYSTEM','SimpleSwipeCard component registered')),customElements.get('simple-swipe-card-editor')||(customElements.define('simple-swipe-card-editor',SimpleSwipeCardEditor),a('SYSTEM','SimpleSwipeCardEditor component registered')),Pt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,'color: white; background: #4caf50; font-weight: 700;','color: #4caf50; background: white; font-weight: 700;')}catch(t){console.error('SimpleSwipeCard: Failed to initialize:',t)}}function Pt(){window.customCards&&!window.customCards.some(t=>'simple-swipe-card'===t.type)&&(window.customCards.push({type:'simple-swipe-card',name:'Simple Swipe Card',preview:!0,description:'A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.'}),a('SYSTEM','Card registered with Home Assistant customCards registry'))}mt()?mt().then(()=>{Pt(),Lt()}).catch(t=>{console.error('SimpleSwipeCard: Error waiting for Card Helpers:',t),Lt()}):window.customCards?(Pt(),Lt()):'loading'===document.readyState?window.addEventListener('load',()=>{Pt(),Lt()},{once:!0}):setTimeout(()=>{Pt(),Lt()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};
