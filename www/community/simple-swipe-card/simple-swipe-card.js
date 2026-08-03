const t='3.1.0',i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',swipe_effect:'slide',scroll_strategy:'js',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:'single',carousel_alignment:'start',cards_visible:2.5,card_min_width:200,auto_height:!1,enable_backdrop_filter:!1},e=['ha-switch','wa-switch','mwc-switch','ha-checkbox','wa-checkbox','mwc-checkbox','ha-radio','wa-radio','mwc-radio','ha-radio-group','ha-radio-option','wa-radio-group','ha-select','wa-select','mwc-select','ha-combo-box','wa-combobox','ha-entity-picker','ha-textfield','wa-textfield','mwc-textfield','ha-textarea','wa-textarea','mwc-textarea','ha-entity-toggle'],s=['button','ha-button','wa-button','mwc-button','paper-button','ha-icon-button','wa-icon-button','mwc-icon-button'],n=['ha-slider','wa-slider','md-slider','mwc-slider','paper-slider'],o='_simpleSwipeEditorRegistry',a='_simpleSwipeCardEditors',r={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!1,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0,AUTO_HEIGHT:!0,UIX:!0},d=new Map,l=(t,...i)=>{if(!1===r[t])return;const e=`${t}:${i[0]}`,s=Date.now();d.has(e)&&s-d.get(e)<5e3||(['AUTO','SWIPE','VISIBILITY'].includes(t)||['Setting hass','Visible cards updated','Auto-swipe','Updating slider'].some(t=>i[0]&&i[0].toString().includes(t)))&&d.set(e,s)},h=globalThis,c=h.ShadowRoot&&(void 0===h.ShadyCSS||h.ShadyCSS.nativeShadow)&&'adoptedStyleSheets'in Document.prototype&&'replace'in CSSStyleSheet.prototype,p=Symbol(),u=new WeakMap;let g=class t{constructor(t,i,e){if(this.i=!0,e!==p)throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(c&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=u.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&u.set(i,t))}return t}toString(){return this.cssText}};const f=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if('number'==typeof t)return t;throw Error('Value passed to \'css\' function must be a \'css\' function result: '+t+'. Use \'unsafeCSS\' to pass non-literal values, but take care to ensure page security.')})(e)+t[s+1],t[0]);return new g(e,t,p)},m=c?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i='';for(const e of t.cssRules)i+=e.cssText;return(t=>new g('string'==typeof t?t:t+'',void 0,p))(i)})(t):t,{is:v,defineProperty:w,getOwnPropertyDescriptor:b,getOwnPropertyNames:I,getOwnPropertySymbols:y,getPrototypeOf:S}=Object,E=globalThis,x=E.trustedTypes,T=x?x.emptyScript:'',C=E.reactiveElementPolyfillSupport,$=(t,i)=>t,M={toAttribute(t,i){switch(i){case Boolean:t=t?T:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},O=(t,i)=>!v(t,i),A={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:O};Symbol.metadata??=Symbol('metadata'),E.litPropertyMetadata??=new WeakMap;let _=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=A){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&w(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=b(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static m(){if(this.hasOwnProperty($('elementProperties')))return;const t=S(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($('finalized')))return;if(this.finalized=!0,this.m(),this.hasOwnProperty($('properties'))){const t=this.properties,i=[...I(t),...y(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(m(t))}else void 0!==t&&i.push(m(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:'string'==typeof e?e:'string'==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.M=null,this.A()}A(){this._=new Promise(t=>this.enableUpdating=t),this.N=new Map,this.D(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.R??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.R?.delete(t)}D(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(c)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement('style'),s=h.litNonce;void 0!==s&&i.setAttribute('nonce',s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.R?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.R?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:M).toAttribute(i,e.type);this.M=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this.M=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this.M!==s){const t=e.getPropertyOptions(s),n='function'==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:M;this.M=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.H?.get(s)??o,this.M=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??O)(n,i)||e.useDefault&&e.reflect&&n===this.H?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this._=this.V())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.H??=new Map).has(t)&&(this.H.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.N.has(t)||(this.hasUpdated||e||(i=void 0),this.N.set(t,i)),!0===s&&this.M!==t&&(this.F??=new Set).add(t))}async V(){this.isUpdatePending=!0;try{await this._}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.N.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.N;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.R?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.U()}catch(i){throw t=!1,this.U(),i}t&&this.B(i)}willUpdate(t){}B(t){this.R?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this.N=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._}shouldUpdate(t){return!0}update(t){this.F&&=this.F.forEach(t=>this.P(t,this[t])),this.U()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:'open'},_[$('elementProperties')]=new Map,_[$('finalized')]=new Map,C?.({ReactiveElement:_}),(E.reactiveElementVersions??=[]).push('2.1.1');const N=globalThis,k=N.trustedTypes,D=k?k.createPolicy('lit-html',{createHTML:t=>t}):void 0,R='$lit$',L=`lit$${Math.random().toFixed(9).slice(2)}$`,P='?'+L,H=`<${P}>`,V=document,z=()=>V.createComment(''),F=t=>null===t||'object'!=typeof t&&'function'!=typeof t,U=Array.isArray,B='[ \t\n\f\r]',W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,j=/>/g,G=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,'g'),J=/'/g,q=/"/g,X=/^(?:script|style|textarea|title)$/i,Z=(t,...i)=>({W:1,strings:t,values:i}),K=Symbol.for('lit-noChange'),Q=Symbol.for('lit-nothing'),tt=new WeakMap,it=V.createTreeWalker(V,129);function et(t,i){if(!U(t)||!t.hasOwnProperty('raw'))throw Error('invalid template strings array');return void 0!==D?D.createHTML(i):i}const st=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?'<svg>':3===i?'<math>':'',a=W;for(let i=0;i<e;i++){const e=t[i];let r,d,l=-1,h=0;for(;h<e.length&&(a.lastIndex=h,d=a.exec(e),null!==d);)h=a.lastIndex,a===W?'!--'===d[1]?a=Y:void 0!==d[1]?a=j:void 0!==d[2]?(X.test(d[2])&&(n=RegExp('</'+d[2],'g')),a=G):void 0!==d[3]&&(a=G):a===G?'>'===d[0]?(a=n??W,l=-1):void 0===d[1]?l=-2:(l=a.lastIndex-d[2].length,r=d[1],a=void 0===d[3]?G:'"'===d[3]?q:J):a===q||a===J?a=G:a===Y||a===j?a=W:(a=G,n=void 0);const c=a===G&&t[i+1].startsWith('/>')?' ':'';o+=a===W?e+H:l>=0?(s.push(r),e.slice(0,l)+R+e.slice(l)+L+c):e+L+(-2===l?i:c)}return[et(t,o+(t[e]||'<?>')+(2===i?'</svg>':3===i?'</math>':'')),s]};class nt{constructor({strings:t,W:i},e){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[d,l]=st(t,i);if(this.el=nt.createElement(d,e),it.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=it.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(R)){const i=l[o++],e=s.getAttribute(t).split(L),a=/([.?@])?(.*)/.exec(i);r.push({type:1,index:n,name:a[2],strings:e,ctor:'.'===a[1]?lt:'?'===a[1]?ht:'@'===a[1]?ct:dt}),s.removeAttribute(t)}else t.startsWith(L)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(X.test(s.tagName)){const t=s.textContent.split(L),i=t.length-1;if(i>0){s.textContent=k?k.emptyScript:'';for(let e=0;e<i;e++)s.append(t[e],z()),it.nextNode(),r.push({type:2,index:++n});s.append(t[i],z())}}}else if(8===s.nodeType)if(s.data===P)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(L,t+1));)r.push({type:7,index:n}),t+=L.length-1}n++}}static createElement(t,i){const e=V.createElement('template');return e.innerHTML=t,e}}function ot(t,i,e=t,s){if(i===K)return i;let n=void 0!==s?e.Y?.[s]:e.G;const o=F(i)?void 0:i.J;return n?.constructor!==o&&(n?.q?.(!1),void 0===o?n=void 0:(n=new o(t),n.X(t,e,s)),void 0!==s?(e.Y??=[])[s]=n:e.G=n),void 0!==n&&(i=ot(t,n.Z(t,i.values),n,s)),i}class at{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??V).importNode(i,!0);it.currentNode=s;let n=it.nextNode(),o=0,a=0,r=e[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new rt(n,n.nextSibling,this,t):1===r.type?i=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(i=new pt(n,this,t)),this.K.push(i),r=e[++a]}o!==r?.index&&(n=it.nextNode(),o++)}return it.currentNode=V,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class rt{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=Q,this.tt=void 0,this.dt=t,this.lt=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.dt.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.dt}get endNode(){return this.lt}nt(t,i=this){t=ot(this,t,i),F(t)?t===Q||null==t||''===t?(this.rt!==Q&&this.ht(),this.rt=Q):t!==this.rt&&t!==K&&this.ct(t):void 0!==t.W?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||'function'==typeof t?.[Symbol.iterator])(t)?this.k(t):this.ct(t)}O(t){return this.dt.parentNode.insertBefore(t,this.lt)}T(t){this.rt!==t&&(this.ht(),this.rt=this.O(t))}ct(t){this.rt!==Q&&F(this.rt)?this.dt.nextSibling.data=t:this.T(V.createTextNode(t)),this.rt=t}$(t){const{values:i,W:e}=t,s='number'==typeof e?this.ut(t):(void 0===e.el&&(e.el=nt.createElement(et(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new at(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=tt.get(t.strings);return void 0===i&&tt.set(t.strings,i=new nt(t)),i}k(t){U(this.rt)||(this.rt=[],this.ht());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new rt(this.O(z()),this.O(z()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.ht(e&&e.lt.nextSibling,s),i.length=s)}ht(t=this.dt.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.lt;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class dt{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=Q,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||''!==e[0]||''!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=Q}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=ot(this,t,i,0),o=!F(t)||t!==this.rt&&t!==K,o&&(this.rt=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=ot(this,s[e+a],i,a),r===K&&(r=this.rt[a]),o||=!F(r)||r!==this.rt[a],r===Q?t=Q:t!==Q&&(t+=(r??'')+n[a+1]),this.rt[a]=r}o&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??'')}}class lt extends dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class ht extends dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class ct extends dt{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=ot(this,t,i,0)??Q)===K)return;const e=this.rt,s=t===Q&&e!==Q||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==Q&&(e===Q||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){'function'==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class pt{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){ot(this,t)}}const ut=N.litHtmlPolyfillSupport;ut?.(nt,rt),(N.litHtmlVersions??=[]).push('3.3.1');const gt=globalThis;class ft extends _{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.vt;if(void 0===n){const t=e?.renderBefore??null;s.vt=n=new rt(i.insertBefore(z(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return K}}ft.wt=!0,ft.finalized=!0,gt.litElementHydrateSupport?.({LitElement:ft});const mt=gt.litElementPolyfillSupport;mt?.({LitElement:ft}),(gt.litElementVersions??=[]).push('4.2.1');const vt=t=>t??Q;let wt=null;function bt(){return wt||(window.loadCardHelpers&&'function'==typeof window.loadCardHelpers?(wt=window.loadCardHelpers(),wt.catch(()=>{wt=null}),wt):Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith('custom:')){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement('div');return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement('div');return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement('div');return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}}))}function It(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return yt(t,i)}catch(i){return l('VISIBILITY','Error evaluating condition:',t,i),!0}}):(l('VISIBILITY','No hass object available for condition evaluation'),!0))}function yt(t,i){if(!t||'object'!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return l('VISIBILITY','AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return l('VISIBILITY','AND condition has empty \'conditions\' array'),!0;const e=t.conditions.every(t=>{try{return yt(t,i)}catch(i){return l('VISIBILITY','Error evaluating nested AND condition:',t,i),!1}});return l('VISIBILITY',`AND condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return l('VISIBILITY','OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return l('VISIBILITY','OR condition has empty \'conditions\' array'),!1;const e=t.conditions.some(t=>{try{return yt(t,i)}catch(i){return l('VISIBILITY','Error evaluating nested OR condition:',t,i),!1}});return l('VISIBILITY',`OR condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'not':if(!t.condition)return l('VISIBILITY','NOT condition missing \'condition\' property'),!1;try{const e=yt(t.condition,i),s=!e;return l('VISIBILITY',`NOT condition result: ${s} (nested was ${e})`),s}catch(i){return l('VISIBILITY','Error evaluating nested NOT condition:',t.condition,i),!1}case'state':{if(!s||!i.states[s])return l('VISIBILITY',`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return l('VISIBILITY',`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return l('VISIBILITY',`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case'numeric_state':{if(!s||!i.states[s])return l('VISIBILITY',`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),l('VISIBILITY',`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return l('VISIBILITY',`Screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return l('VISIBILITY',`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;case'time':{const i=new Date,e=60*i.getHours()+i.getMinutes();if(t.weekdays&&Array.isArray(t.weekdays)&&t.weekdays.length>0){const e=['sun','mon','tue','wed','thu','fri','sat'][i.getDay()];if(!t.weekdays.includes(e))return l('VISIBILITY',`Time condition: weekday ${e} not in ${t.weekdays}, result: false`),!1}const s=t=>{if(!t)return null;const i=t.split(':');if(i.length<2)return null;const e=parseInt(i[0],10),s=parseInt(i[1],10);return isNaN(e)||isNaN(s)?null:60*e+s},n=s(t.after),o=s(t.before);if(null===n&&null===o)return l('VISIBILITY','Time condition: no after or before specified'),!0;let a=!0;return null!==n&&null!==o?a=n<o?e>=n&&e<o:e>=n||e<o:null!==n?a=e>=n:null!==o&&(a=e<o),l('VISIBILITY',`Time condition: current=${Math.floor(e/60)}:${e%60}, after=${t.after}, before=${t.before}, result: ${a}`),a}default:return l('VISIBILITY',`Unknown condition type: ${e}`),!0}}class St{constructor(t){this.card=t,this.bt=!1,this.It=0,this.yt=0,this.St=0,this.Et=0,this.xt=0,this.Tt=0,this.Ct=!1,this.$t=!1,this.Mt=0,this.Ot=0,this.At=!1,this._t=8,this.Nt=null,this.kt=!1,this.Dt=300,this.Rt=0,this.Lt=.3,this.Pt=this.Ht.bind(this),this.Vt=this.zt.bind(this),this.Ft=this.Ut.bind(this),this.Bt=this.zt.bind(this),this.Wt=this.Ut.bind(this),this.Yt=this.jt.bind(this),this.Gt=this.Jt.bind(this)}removeGestures(){l('SWIPE','Removing swipe gesture listeners'),this.card.cardContainer&&(this.card.cardContainer.removeEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.removeEventListener('touchmove',this.Vt,{passive:!1}),this.card.cardContainer.removeEventListener('touchend',this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener('touchcancel',this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.removeEventListener('click',this.Yt,{capture:!0}),this.card.cardContainer.removeEventListener('pointerdown',this.Gt,{capture:!0}),this.card.cardContainer.removeEventListener('pointerup',this.Gt,{capture:!0}),l('SWIPE','Removed swipe listeners from cardContainer.')),window.removeEventListener('mousemove',this.Bt,{passive:!1}),window.removeEventListener('mouseup',this.Wt,{passive:!0}),l('SWIPE','Removed potential swipe listeners from window.'),this.bt=!1,this.Ct=!1,this.card.sliderElement?.classList.remove('dragging'),this.Nt&&(clearTimeout(this.Nt),this.Nt=null,this.kt=!1)}addGestures(){if(this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized)l('SWIPE','Skipping addSwiperGesture',{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized});else{if(this.card.scrollStrategy?.isNative())return l('SWIPE','Native scroll strategy active - skipping JS swipe gestures'),void this.qt();l('SWIPE','Adding swipe listeners with click prevention.'),this.card.cardContainer.addEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.addEventListener('touchmove',this.Vt,{passive:!1}),this.card.cardContainer.addEventListener('touchend',this.Ft,{passive:!0}),this.card.cardContainer.addEventListener('touchcancel',this.Ft,{passive:!0}),this.card.cardContainer.addEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.addEventListener('click',this.Yt,{capture:!0}),this.card.cardContainer.addEventListener('pointerdown',this.Gt,{capture:!0}),this.card.cardContainer.addEventListener('pointerup',this.Gt,{capture:!0}),this.qt()}}jt(t){if(this.kt||this.bt&&this.At)return l('SWIPE','Click prevented during/after swipe gesture'),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1;if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),n=[...s,'a','input','select','textarea',...e],o=['button','switch','checkbox','radio'];for(let t=0;t<Math.min(10,i.length);t++){const e=i[t];if(e===this.card.cardContainer||e===this.card.sliderElement)break;if(e.nodeType===Node.ELEMENT_NODE){const t=e.localName?.toLowerCase(),i=e.getAttribute?.('role');if(n.includes(t)||o.includes(i))return void l('SWIPE','Allowing click - interactive control found in path:',t||i)}}}}Jt(t){if(this.bt&&this.At)return t.preventDefault(),t.stopPropagation(),!1;if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),n=[...s,'a','input','select','textarea',...e],o=['button','switch','checkbox','radio'];for(let t=0;t<Math.min(10,i.length);t++){const e=i[t];if(e===this.card.cardContainer||e===this.card.sliderElement)break;if(e.nodeType===Node.ELEMENT_NODE){const t=e.localName?.toLowerCase(),i=e.getAttribute?.('role');if(n.includes(t)||o.includes(i))return void l('SWIPE','Allowing pointer event - interactive control found in path:',t||i)}}}}Xt(t=this.Dt){this.kt=!0,this.Rt=Date.now(),this.Nt&&clearTimeout(this.Nt),this.Nt=setTimeout(()=>{this.kt=!1,this.Nt=null,l('SWIPE','Click blocking period ended')},t),l('SWIPE',`Blocking clicks for ${t}ms`)}Ht(t){if(l('SWIPE','Swipe Start:',t.type),this.card.pagination?.showPagination(),'mousedown'===t.type&&0!==t.button)return void l('SWIPE','Swipe Start ignored (wrong button)');if(this.bt){if('touchstart'!==t.type||1!==t.touches.length)return void l('SWIPE','Swipe Start ignored (already dragging)');l('SWIPE','Stale drag state on touchstart - recovering'),this.bt=!1,this.Ct=!1,this.At=!1,this.card.sliderElement?.classList.remove('dragging'),this.card.updateSlider()}if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();for(let t=0;t<Math.min(15,i.length);t++){const e=i[t];if(e===this.card.cardContainer||e===this.card.sliderElement)break;if(e.nodeType===Node.ELEMENT_NODE&&this.Zt(e))return void l('SWIPE','Swipe Start ignored - found interactive element in path:',e.localName)}}else{const i=this.Kt(t);if(this.Zt(i))return void l('SWIPE','Swipe Start ignored (interactive element):',i)}this.bt=!0,this.Ct=!1,this.At=!1,this.Ot=0,this.Mt=Date.now(),this.$t=!0;const i='touchstart'===t.type?t.touches[0]:t;if(this.It=i.clientX,this.yt=i.clientY,this.St=this.It,this.Et=this.yt,this.Tt=this.Mt,this.card.cardContainer){const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;t>0&&(this.card.slideWidth=t),i>0&&(this.card.slideHeight=i)}if(this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.xt=i.m41,'vertical'===this.card.Qt&&(this.xt=i.m42),this.card.sliderElement.style.transition=this.card.ti(!1),this.card.sliderElement.style.cursor='grabbing'}'mousedown'===t.type&&(l('SWIPE','Attaching mousemove/mouseup listeners to window'),t.preventDefault(),window.addEventListener('mousemove',this.Bt,{passive:!1}),window.addEventListener('mouseup',this.Wt,{passive:!0})),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}zt(t){if(!this.bt)return;const i='touchmove'===t.type,e=i?t.touches[0]:t,s=e.clientX,n=e.clientY,o=s-this.It,a=n-this.yt,r=Date.now(),d=Math.sqrt(o*o+a*a);this.Ot=Math.max(this.Ot,d);const h='horizontal'===this.card.Qt,c=h?o:a,p=h?a:o;if(!this.Ct&&Math.abs(p)>Math.abs(c)&&Math.abs(p)>10&&(l('SWIPE',`${h?'Vertical':'Horizontal'} scroll detected, cancelling ${h?'horizontal':'vertical'} drag.`),this.Ct=!0,this.$t=!1),d>this._t&&(this.At=!0),!this.Ct&&Math.abs(c)>this._t){l('SWIPE',(h?'Horizontal':'Vertical')+' move detected'),i?Math.abs(c)>Math.abs(p)&&t.preventDefault():t.preventDefault(),h?this.St=s:this.Et=n;let e=c;!0!==this.card.ii.enable_loopback&&(0===this.card.currentIndex&&e>0||this.card.currentIndex===this.card.visibleCardIndices.length-1&&e<0)&&(e*=.5*(.3+.7/(1+Math.abs(e)/(h?this.card.slideWidth:this.card.slideHeight)*.5)));const o=this.xt+e;if(this.card.sliderElement){h||this.card.sliderElement.classList.add('dragging');const t=this.card.swipeEffects?.usesStackedMode();t||(this.card.sliderElement.style.transform=h?`translateX(${o}px)`:`translateY(${o}px)`),this.ei(o);const i=h?this.card.slideWidth:this.card.slideHeight;if(i>0){const t=c/i;this.card.swipeEffects?.applySwipeProgress(t,this.card.currentIndex)}}this.Tt=r}}Ut(t){if(l('SWIPE','Swipe End:',t.type),!this.bt)return void l('SWIPE','Swipe End ignored (not dragging)');this.card.si&&l('SWIPE','WARNING: Swipe end during seamless jump - this might indicate a stuck flag'),'mouseup'===t.type&&(l('SWIPE','Removing mousemove/mouseup listeners from window'),window.removeEventListener('mousemove',this.Bt),window.removeEventListener('mouseup',this.Wt));const i=this.At&&this.Ot>this._t,e=Date.now()-this.Mt,s=e<200,n='horizontal'===this.card.Qt,o=n?this.St-this.It:this.Et-this.yt,a=Date.now()-this.Tt,r=a>10?Math.abs(o)/a:0,d=r>this.Lt;(i||s&&d)&&(this.Xt(d?400:300),l('SWIPE','Prevented clicks after swipe gesture',{movement:this.Ot,velocity:r,gestureTime:e,eventType:t.type})),this.$t=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const t=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.ti(!0),this.card.sliderElement.style.cursor='',this.card.sliderElement.classList.remove('dragging'),!t)return void l('SWIPE','Swipe End: Not dragging or already processed.');if(this.Ct)return l('SWIPE','Swipe End: Scrolling - Snapping back.'),this.card.updateSlider(),void(this.Ct=!1);const i=Math.max(1,Date.now()-this.Mt),e=Math.abs(o)/i,s=n?this.card.slideWidth:this.card.slideHeight,a=this.card.ii.view_mode||'single';let r;if('carousel'===a){const t=this.card.ii.cards_visible||2.5,i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;r=(this.card.slideWidth-(t-1)*i)/t*.2}else r=.2*s;let d=this.card.currentIndex;const h=this.card.ii.loop_mode||'none',c=this.card.visibleCardIndices.length,p=this.card.ii.swipe_behavior||'single';let u=1;Math.abs(o)>r||Math.abs(e)>this.Lt?(l('SWIPE','Swipe threshold crossed:',{totalMove:o,threshold:r,velocity:e,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:c,loopMode:h,swipeBehavior:p}),u=this.card.swipeBehavior.calculateSkipCount(e,Math.abs(o),c,p),d=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,o>0?u:-u),l('SWIPE',`Swipe resulted in navigation: ${this.card.currentIndex} ${d} (${h} mode, ${p} behavior, skip: ${u})`)):l('SWIPE','Swipe threshold NOT crossed:',{totalMove:o,threshold:r,velocity:e,velocityThreshold:this.Lt,viewMode:a,swipeBehavior:p}),d!==this.card.currentIndex?(l('SWIPE',`Swipe resulted in index change to ${d}`),this.card.ni='infinite'===this.card.ii.loop_mode?this.card.loopMode.getWrappedIndexForPagination(this.card.currentIndex):this.card.currentIndex,this.card.goToSlide(d,u),setTimeout(()=>{this.card.isConnected&&!this.card.oi&&this.card.resetAfter?.startTimer()},100)):(l('SWIPE','Swipe did not cross threshold or velocity, snapping back.'),this.card.updateSlider())}),setTimeout(()=>{this.card.pagination?.showAndStartTimer()},100)}ei(t){if(!this.card.pagination?.paginationElement||this.card.visibleCardIndices.length<=1)return;const i='horizontal'===this.card.Qt,e=this.card.ii.view_mode||'single',s=Math.max(0,parseInt(this.card.ii.card_spacing))||0,n=t-this.xt;let o;if('carousel'===e){const t=this.card.ii.cards_visible||this.card.ai();o=Math.round(-n/((this.card.slideWidth-(t-1)*s)/t+s))}else o=Math.round(-n/((i?this.card.slideWidth:this.card.slideHeight)+s));this.card.pagination.updateDuringSwipe(this.card.currentIndex+o)}ri(t){let i=t,e=0;for(;i&&e<20;){if(i===this.card||i===this.card.cardContainer||i===this.card.sliderElement)return!1;if('simple-swipe-card'===i.localName?.toLowerCase())return!0;i=i.assignedSlot||i.parentNode||(i.getRootNode()instanceof ShadowRoot?i.getRootNode().host:null),e++}return!1}Zt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;if(this.ri(t))return!1;const i=t.localName?.toLowerCase(),s=t.getAttribute('role');if('svg'===i||'canvas'===i)return l('SWIPE','Allowing swipe on chart element:',i),!1;if(['ha-cover-controls',...e].includes(i))return l('SWIPE','Blocking swipe on interactive control:',i),!0;const o=t.className&&'string'==typeof t.className?t.className:t.className?.toString()||'',a=t.id||'';if(n.includes(i)||o.includes('slider')||a.includes('slider')||'slider'===s||'range'===s)return l('SWIPE','_isInteractiveOrScrollable: Found slider element:',t),!0;try{const i=window.getComputedStyle(t).touchAction,e='horizontal'===this.card.Qt;if(i){if(e&&i.includes('pan-x'))return l('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-x for horizontal swipe:',t),!0;if(!e&&i.includes('pan-y'))return l('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-y for vertical swipe:',t),!0}}catch(t){}if(['input','textarea','select','audio'].includes(i))return l('SWIPE','_isInteractiveOrScrollable: Found basic interactive element:',i),!0;if(s&&['checkbox','switch','slider','menuitem','textbox','combobox','option','range'].includes(s))return l('SWIPE','_isInteractiveOrScrollable: Found interactive role:',s),!0;let r=t,d=0;for(;r&&r!==this.card.sliderElement&&r!==this.card.cardContainer&&d<10;){if(r.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(r);if(('auto'===t.overflowY||'scroll'===t.overflowY)&&r.scrollHeight>r.clientHeight+1||('auto'===t.overflowX||'scroll'===t.overflowX)&&r.scrollWidth>r.clientWidth+1)return l('SWIPE','_isInteractiveOrScrollable: Found scrollable ancestor:',r),!0;const i=r.className&&'string'==typeof r.className?r.className:r.className?.toString()||'',e=r.id||'';if(i.includes('slider')||e.includes('slider'))return l('SWIPE','_isInteractiveOrScrollable: Found slider-like ancestor:',r),!0}catch(t){l('ERROR','Error accessing style/scroll properties:',r,t)}r=r.assignedSlot||r.parentNode||(r.getRootNode()instanceof ShadowRoot?r.getRootNode().host:null),d++}return!1}Kt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();if(i&&i.length>0){const t=i[0];if(t&&t.nodeType===Node.ELEMENT_NODE)return t}}return t.target}qt(){if(!this.card.ii.show_pagination||!this.card.ii.auto_hide_pagination)return;const t=this.card.cardContainer;t&&(t.addEventListener('mouseenter',this.di.bind(this),{passive:!0}),t.addEventListener('mouseleave',this.li.bind(this),{passive:!0}),t.addEventListener('touchstart',this.hi.bind(this),{passive:!0}),t.addEventListener('touchend',this.ci.bind(this),{passive:!0}))}di(){this.card.pagination?.showPagination()}li(){this.bt||this.card.pagination?.showAndStartTimer()}hi(){this.card.pagination?.showPagination()}ci(){setTimeout(()=>{this.bt||this.card.pagination?.showAndStartTimer()},50)}}class Et{constructor(t){this.card=t,this.pi=null,this.ui=!1,this.gi=null,this.oi=!1,this.fi=1,this.mi=0,this.wi=this.bi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(l('AUTO','Starting auto-swipe with interval:',this.card.ii.auto_swipe_interval),this.start()))}start(){this.pi&&this.stop(),this.fi=1,this.ui=!1,this.pi=setInterval(this.wi,this.card.ii.auto_swipe_interval),l('AUTO','Auto-swipe timer started with interval:',this.card.ii.auto_swipe_interval)}stop(){this.pi&&(clearInterval(this.pi),this.pi=null,l('AUTO','Auto-swipe timer stopped')),this.gi&&(clearTimeout(this.gi),this.gi=null)}pause(t=5e3){this.card.ii.enable_auto_swipe&&(l('AUTO',`Auto-swipe paused for ${t}ms`),this.ui=!0,this.gi&&clearTimeout(this.gi),this.gi=setTimeout(()=>{this.ui=!1,l('AUTO','Auto-swipe pause ended'),this.card.isConnected&&this.card.ii.enable_auto_swipe&&this.start()},t))}bi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.pi&&(l('AUTO','Stopping auto-swipe, conditions not met or insufficient visible cards.'),this.stop()));if(this.ui){const t=Date.now();return void(t-this.mi>5e3&&(l('AUTO','Skipping auto-swipe: currently paused'),this.mi=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.mi>5e3&&(l('AUTO','Skipping auto-swipe: currently dragging'),this.mi=t))}if(this.card.si)return void l('AUTO','Skipping auto-swipe: seamless jump in progress');const i=Date.now();let e=i-this.mi>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.fi),n=s.nextIndex;s.shouldChangeDirection&&(this.fi=-this.fi,e=!0);const o=this.card.loopMode.getMode();('infinite'===o&&n>=t||'loopback'===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(l('AUTO',`Auto-swipe: ${this.card.currentIndex} → ${n} (${'none'===o?this.fi>0?'forward':'backward':o} mode)`),this.mi=i),this.oi=!0,this.card.goToSlide(n),this.oi=!1}get isInProgress(){return this.oi}}class xt{constructor(t){this.card=t,this.Ii=null,this.yi=0,this.Si=!1,this.Ei=null,this.xi=this.Ti.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1?l('RESET','Reset-after feature enabled with timeout:',this.card.ii.reset_after_timeout):l('RESET','Reset-after feature disabled',{enabled:this.card.ii.enable_reset_after,autoSwipeDisabled:!this.card.ii.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.ii.enable_reset_after||this.card.ii.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.yi=Date.now(),l('RESET',`Starting reset-after timer: ${this.card.ii.reset_after_timeout}ms`),this.Ii=setTimeout(this.xi,this.card.ii.reset_after_timeout))}stopTimer(){this.Ii&&(clearTimeout(this.Ii),this.Ii=null,l('RESET','Reset-after timer stopped'))}preserveState(){if(this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe)if(this.Ii){const t=this.card.ii.reset_after_timeout-(Date.now()-this.yi);t>1e3?(this.Ei={remainingTime:Math.max(1e3,t),targetCard:this.card.ii.reset_target_card,wasActive:!0},l('RESET','Preserved reset-after state:',this.Ei)):this.Ei=null}else this.Ei=null;else this.Ei=null}restoreState(){this.Ei&&this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe?(this.Ei.wasActive&&this.card.visibleCardIndices.length>1&&(l('RESET','Restoring reset-after timer with remaining time:',this.Ei.remainingTime),this.yi=Date.now()-(this.card.ii.reset_after_timeout-this.Ei.remainingTime),this.Ii=setTimeout(this.xi,this.Ei.remainingTime)),this.Ei=null):this.Ei=null}Ti(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void l('RESET','Reset-after skipped: conditions not met');const i=this.card.getEvaluatedConfigValue('reset_target_card',1);let e=(parseInt(i)||1)-1;l('RESET',`Reset target card: configured=${this.card.ii.reset_target_card}, evaluated=${i}, index=${e}`);const s=e,n=this.card.visibleCardIndices.indexOf(s);if(-1!==n)e=n,l('RESET',`Target card ${i} is visible at position ${e}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=s){t=i;break}e=t,l('RESET',`Target card ${i} not visible, using closest visible card at position ${e}`)}e>=t&&(e=0,l('RESET','Target index out of range, using first visible card')),this.card.currentIndex!==e?(l('RESET',`Performing reset: current=${this.card.currentIndex}, target=${e}, timeout=${this.card.ii.reset_after_timeout}ms`),this.Si=!0,this.card.goToSlide(e),this.Si=!1):l('RESET','Reset-after skipped: already at target card')}get isInProgress(){return this.Si}}class Tt{constructor(t){this.card=t,this.paginationElement=null,this.Ci=null,this.$i=!1,this.Mi=!0}create(){if(this.paginationElement&&this.remove(),!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1){if(l('INIT','Creating pagination for',this.card.visibleCardIndices.length,'visible cards'),!this.card.shadowRoot)return void l('ERROR','Cannot create pagination without shadowRoot');if(!this.card.shadowRoot.host||!this.card.shadowRoot.host.isConnected)return l('PAGINATION','shadowRoot host is not connected, deferring pagination creation'),void requestAnimationFrame(()=>{this.card.isConnected&&this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected&&(l('PAGINATION','Retrying pagination creation after deferral'),this.create())});this.paginationElement=document.createElement('div'),this.paginationElement.className=`pagination ${this.card.Qt}`,this.Oi();const t=this.card.ii.state_entity&&this.card.Ai;for(let i=0;i<this.card.visibleCardIndices.length;i++){const e=document.createElement('div');e.className='pagination-dot';const s=this.card.ii.cards?.[this.card.visibleCardIndices[i]]?.pagination_icon;if(s){e.classList.add('has-icon');const t=document.createElement('ha-icon');t.icon=s,e.appendChild(t)}t||i!==this._i()||e.classList.add('active'),e.addEventListener('click',t=>{t.stopPropagation(),this.card.goToSlide(i),this.showPagination(),this.startAutoHideTimer()}),this.paginationElement.appendChild(e)}if(!(this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected))return l('ERROR','shadowRoot became null or disconnected while creating pagination'),void(this.paginationElement=null);this.card.shadowRoot.appendChild(this.paginationElement),l('PAGINATION','Successfully appended pagination to shadowRoot',{dotCount:this.card.visibleCardIndices.length,direction:this.card.Qt}),this.card.Ni&&this.card.ki()}this.Di()}Oi(){this.paginationElement&&requestAnimationFrame(()=>{if(!this.paginationElement||!this.paginationElement.isConnected)return void l('PAGINATION','Pagination element no longer exists, skipping dimension setup');const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||''===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,''));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n('--simple-swipe-card-pagination-dot-active-size')||n('--simple-swipe-card-pagination-dot-size')||8,a=n('--simple-swipe-card-pagination-dot-size')||8;let r=Math.max(o,a);if(this.card.visibleCardIndices.some(t=>this.card.ii.cards?.[t]?.pagination_icon)){const t=n('--simple-swipe-card-pagination-icon-size')||18,i=n('--simple-swipe-card-pagination-icon-active-size')||t;r=Math.max(r,t,i)}const d=i.getPropertyValue('--simple-swipe-card-pagination-padding').trim()||'4px 8px',h=d.split(' '),c=2*(s(h[0])||4),p=r+c;if('horizontal'===this.card.Qt)this.paginationElement.style.height=`${p}px`,this.paginationElement.style.minHeight='unset';else{const t=s(h[1]||h[0])||8;this.paginationElement.style.width=`${r+2*t}px`,this.paginationElement.style.minWidth='unset'}l('INIT','Set FIXED pagination dimensions:',{activeDotSize:o,inactiveDotSize:a,maxDotSize:r,totalVerticalPadding:c,fixedDimension:`${p}px`,direction:this.card.Qt,paddingValue:d})})}_i(){const t=this.card.visibleCardIndices.length;return 0===t?0:'infinite'===this.card.ii.loop_mode?(this.card.currentIndex%t+t)%t:Math.max(0,Math.min(this.card.currentIndex,t-1))}update(t=!0){if(!this.paginationElement)return;const i=this._i(),e=this.paginationElement.querySelectorAll('.pagination-dot');t||e.forEach(t=>{t.style.transition='none'}),e.forEach((t,e)=>{t.classList.toggle('active',e===i)}),t||requestAnimationFrame(()=>{e.forEach(t=>{t.style.transition=''})}),l('PAGINATION',`Updated dots: active dot ${i}${t?' (animated)':' (instant)'}`)}updateDuringSwipe(t){if(!this.paginationElement)return;const i=this.card.visibleCardIndices.length;if(0===i)return;let e;e='infinite'===this.card.ii.loop_mode?(t%i+i)%i:Math.max(0,Math.min(t,i-1)),this.paginationElement.querySelectorAll('.pagination-dot').forEach((t,i)=>{t.classList.toggle('active',i===e)})}updateLayout(){!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display='flex':this.create():this.paginationElement&&(this.paginationElement.style.display='none')}remove(){this.cleanupAutoHide(),this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}Di(){this.$i=this.card.ii.show_pagination&&this.card.ii.auto_hide_pagination>0,this.$i&&(l('PAGINATION','Auto-hide enabled with timeout:',this.card.ii.auto_hide_pagination),this.Mi=!0,this.Ri(),this.startAutoHideTimer())}Ri(){if(this.paginationElement&&this.paginationElement.isConnected){if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return this.paginationElement.style.transition='none',this.paginationElement.style.opacity='1',void this.paginationElement.querySelectorAll('.pagination-dot').forEach(t=>{t.style.transition='none',t.style.opacity='1'});if('fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade'))this.paginationElement.style.transition='opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)',this.paginationElement.style.opacity='1';else{const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-fade-duration').trim()||'600ms',e=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-easing').trim()||'ease-out';t.forEach(t=>{t.style.transition=`opacity ${i} ${e}`,t.style.opacity='1'}),this.paginationElement.style.transition='none',this.paginationElement.style.opacity='1'}}}startAutoHideTimer(){if(!this.$i||!this.paginationElement)return;this.stopAutoHideTimer();const t=this.card.ii.auto_hide_pagination;l('PAGINATION','Starting auto-hide timer:',t+'ms'),this.Ci=setTimeout(()=>{this.hidePagination(),this.Ci=null},t)}stopAutoHideTimer(){this.Ci&&(clearTimeout(this.Ci),this.Ci=null,l('PAGINATION','Auto-hide timer stopped'))}hidePagination(){this.$i&&this.paginationElement&&this.paginationElement.isConnected&&this.Mi&&(l('PAGINATION','Hiding pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='0':this.Li(),this.Mi=!1)}showPagination(){this.$i&&this.paginationElement&&this.paginationElement.isConnected&&(this.Mi||(l('PAGINATION','Showing pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='1':this.Pi(),this.Mi=!0),this.stopAutoHideTimer())}Li(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.Hi(t.length,i,e);t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='0'},s[i])})}Pi(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.Vi(i),n=this.Hi(t.length,s,e);t.forEach(t=>{t.style.opacity='0'}),t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='1'},n[i])})}Hi(t,i,e){const s=[];switch(i){case'left-to-right':for(let i=0;i<t;i++)s[i]=i*e;break;case'right-to-left':for(let i=0;i<t;i++)s[i]=(t-1-i)*e;break;case'center-out':{const i=Math.floor(t/2);for(let n=0;n<t;n++){const t=Math.abs(n-i);s[n]=t*e}break}case'edges-in':for(let i=0;i<t;i++){const n=Math.min(i,t-1-i);s[i]=n*e}break;case'random':{const i=Array.from({length:t},(t,i)=>i).sort(()=>Math.random()-.5);i.forEach((t,i)=>{s[t]=i*e});break}default:for(let i=0;i<t;i++)s[i]=0}return s}Vi(t){return{'left-to-right':'right-to-left','right-to-left':'left-to-right','center-out':'edges-in','edges-in':'center-out',random:'random',fade:'fade'}[t]||'fade'}showAndStartTimer(){this.$i&&(this.showPagination(),this.startAutoHideTimer())}cleanupAutoHide(){this.stopAutoHideTimer()}}function Ct(){const t=document.createElement('div');return t.className='slide',t}function $t(t){t.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight='0px',t.slide.style.marginLeft='0px',t.slide.style.marginTop='0px',t.slide.style.marginBottom='0px')})}const Mt=()=>f`
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
    /* Overflow is governed by the .collapsed / .expanded modifiers below so that
       collapsed content stays clipped and non-interactive, while expanded
       dropdowns can still overflow the container. */
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
    /* No own background: the rounded container paints the background (clipped to
       its border-radius). A background here would be a square rectangle and, with
       the container's overflow:visible, would fill the rounded corners flat. */
    background-color: transparent;
  }

  /* Hover cue that doesn't paint a square over the container's rounded corners
     (a background tint here would clip flat against the radius). */
  .collapsible-section .section-toggle:hover .section-toggle-title,
  .collapsible-section .section-toggle:hover .section-toggle-icon {
    color: var(--primary-color);
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
    /* Transparent so the container's rounded background shows through the bottom
       corners; an inherited (square) background would square them off. */
    background-color: transparent;
  }

  /* Header acts as a plain section header (like .section-header) inside the
     rounded container. No background tint or border-radius of its own, and no
     border-bottom, so the container keeps clean rounded corners that match the
     other .section blocks; the expanded divider is drawn by
     .section-content.expanded::before and the chevron rotates to signal state. */
  .section-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    user-select: none;
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
    /* Fully hide collapsed content: clip it and block interaction so its
       dropdowns can't be opened over the Cards section below. */
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
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

  /* Per-slide icon control (trigger button in the row + inline picker panel) */
  .card-actions .slide-icon-trigger.has-icon {
    color: var(--primary-color);
  }

  .card-actions .slide-icon-trigger:not(.has-icon) {
    opacity: 0.55;
  }

  .slide-icon-panel {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: -2px 0 8px 24px;
    padding: 8px 12px;
    border-left: 2px solid var(--divider-color);
  }

  .slide-icon-panel ha-icon-picker {
    flex-grow: 1;
  }

  .slide-icon-panel ha-icon-button {
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .slide-icon-panel ha-icon-button:hover {
    color: var(--error-color);
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
  ha-textfield,
  ha-input {
    width: 100%;
  }

  /* Native <input> fallback for text/number fields (used only when HA ships
     neither ha-input nor ha-textfield). Themed to read like the HA controls. */
  .native-textfield {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .native-textfield-label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .native-textfield-row {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 0 10px;
    background-color: var(--mdc-text-field-fill-color, rgba(0, 0, 0, 0.05));
  }

  .native-textfield-row:focus-within {
    border-color: var(--primary-color);
  }

  .native-textfield.disabled {
    opacity: 0.5;
  }

  .native-textfield-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--primary-text-color);
    font-size: 14px;
    font-family: inherit;
    padding: 10px 0;
  }

  .native-textfield-suffix {
    color: var(--secondary-text-color);
    font-size: 14px;
    flex-shrink: 0;
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
`;function Ot(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){l('ERROR','Failed to fire HA event:',i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function At(t,i='Map'){return window[t]||(window[t]='Set'===i?new Set:new Map),window[t]}let _t=null;function Nt(t,i,e,s='card'){i&&t&&(_t||(_t=customElements.whenDefined('uix-node').catch(()=>null),_t)).then(n=>{if(n&&'function'==typeof n.applyToElement)try{n.applyToElement(t,s,i,{config:e},!0,void 0),l('UIX','Applied UIX to element',{type:s})}catch(t){console.warn('SimpleSwipeCard: UIX applyToElement failed:',t)}})}function kt(t){if(!t||void 0===t.pagination_icon)return t;const i={...t};return delete i.pagination_icon,i}class Dt{constructor(t){this.card=t}zi(){const t=['hui-card-preview','hui-card-editor','hui-dialog-edit-card','hui-card-picker'];let i=this.card.parentElement;for(;i;){const e=i.tagName?.toLowerCase();if(t.includes(e))return!0;if(i.getRootNode()?.host){const e=i.getRootNode().host.tagName?.toLowerCase();if(t.includes(e))return!0}i=i.parentElement}return!1}async build(){if(this.card.building)return l('INIT','Build already in progress - queueing follow-up build.'),this.card.Fi=!0,!1;if(!this.card.ii||!this.card.ii.cards||!this.card.isConnected)return l('INIT','Build skipped (no config/cards or not connected).'),!1;this.card.building=!0,l('INIT','Starting build...');const t=Date.now();this.card.Ui=t,l('INIT',`Build timestamp set: ${t}`);const i=JSON.stringify(this.card.ii);let e=!1;try{const i=await this.Bi(t);return i&&(e=!0,this.card.Wi=0,this.card.sliderElement?.isConnected&&this.Yi(t)),i}catch(i){return console.error('SimpleSwipeCard: Build failed:',i),this.card.initialized=!1,this.card.Wi=(this.card.Wi||0)+1,this.card.Wi<=2&&this.card.Ui===t&&(this.card.Fi=!0),!1}finally{this.card.Ui===t&&(this.card.building=!1,this.card.Fi?(this.card.Fi=!1,this.card.ji=!1,setTimeout(()=>{this.card.isConnected&&!this.card.building&&(e&&JSON.stringify(this.card.ii)===i?(l('INIT','Queued rebuild skipped (config unchanged) - re-checking visibility instead'),this.card.Gi()):(l('INIT','Running queued rebuild'),this.build()))},50)):this.card.ji&&(this.card.ji=!1,setTimeout(()=>{this.card.isConnected&&!this.card.building&&this.card.Gi()},50)))}}async Bi(t){if(this.card.Ji=null,this.card.qi=null,l('INIT','Cleared cached carousel dimensions'),this.card.resetAfter?.preserveState(),this.card.Xi(),this.card.cards=[],!this.card.ii.state_entity||!this.card.Ai){const t=this.card.getEvaluatedConfigValue('reset_target_card',1);this.card.currentIndex=Math.max(0,parseInt(t)-1||0),0!==this.card.currentIndex&&l('INIT',`Setting initial index to ${this.card.currentIndex} (target card ${t})`)}if(this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),this.card.swipeEffects?.resetEffects(),!this.card.shadowRoot)return l('INIT','Waiting for LitElement to create shadowRoot...'),setTimeout(()=>{this.card.isConnected&&this.build()},10),!1;const i=this.card.cardContainer?.style.height;this.card.autoHeight?.reset(),this.card.shadowRoot&&(this.card.shadowRoot.innerHTML='');const e=this.card.shadowRoot;l('INIT','Building with shadowRoot:',!!e);const s=await bt();if(!this.card.isConnected)return l('INIT','Card disconnected while waiting for helpers, aborting build'),this.card.initialized=!1,!1;if(!s)return console.error('SimpleSwipeCard: Card helpers not loaded.'),e.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.initialized=!1,!1;const n=document.createElement('style');n.textContent=function(){let t='';for(let i=1;i<=15;i++)t+=`\n    .pagination-dot:nth-child(${i}) {\n        --ssc-pagination-dot-inactive-resolved: var(--simple-swipe-card-pagination-dot-slide${i}-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        --ssc-pagination-dot-active-resolved: var(--simple-swipe-card-pagination-dot-slide${i}-active-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n    }`;return`\n     :host {\n        display: block;\n        /* Default: overflow hidden prevents scrollbars and works with expander-card */\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n        /* Prevent horizontal scrolling on touch devices while allowing vertical scrolling */\n        touch-action: pan-y pinch-zoom;\n        /* Ensure dropdowns appear above cards positioned below this one */\n        z-index: 1;\n     }\n\n     /* When dropdown is open: switch to visible overflow with clip-path\n        to allow vertical dropdown overflow while still clipping horizontally */\n     :host(.dropdown-open) {\n        overflow: visible;\n        z-index: 100;\n     }\n\n     :host(.dropdown-open:not([data-enable-backdrop-filter])) {\n        clip-path: polygon(\n          0 -100vh,\n          100% -100vh,\n          100% calc(100% + 100vh),\n          0 calc(100% + 100vh)\n        );\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) {\n       height: 250px; /* Set a reasonable default height for the whole card */\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {\n       height: 100%;\n       min-height: 100%;\n       max-height: 100%;\n       flex: 0 0 100%;\n     } \n\n     /* Auto Height Mode */\n     :host([data-auto-height]:not([data-editor-mode])) .card-container {\n       height: auto;\n       transition: height 0.2s ease-out;\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] {\n       height: auto;\n       align-items: flex-start; /* prevents flex from stretching children */\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] .slide {\n       height: auto;\n       min-height: 0;\n       max-height: none;\n       flex-basis: auto;\n     }\n\n     /* Override child card heights */\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > ha-card,\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > .card-content {\n       height: auto;\n     } \n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border-radius: inherit;\n        background: transparent;\n        will-change: contents; /* Hint browser for optimization */\n        isolation: isolate; /* Create stacking context for proper z-index behavior */\n        /* Horizontal swipe (default): let the browser handle vertical page scroll,\n           the card captures horizontal drags. */\n        touch-action: pan-y pinch-zoom;\n     }\n\n     /* Vertical swipe: the card captures vertical drags, so the browser must NOT\n        own vertical panning (otherwise the page scrolls instead of the slides,\n        and nested vertical+horizontal cards fight each other). pan-x keeps any\n        horizontal page panning available. This also fixes vertical cards placed\n        on scrollable dashboards (e.g. Sections view). #101 */\n     .card-container:has(.slider[data-swipe-direction="vertical"]) {\n        touch-action: pan-x pinch-zoom;\n     }\n\n     /* Horizontal swipe: Clip horizontally but allow vertical overflow for dropdowns */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="horizontal"]) {\n        clip-path: polygon(\n          0 -100vh,                    /* top-left, extended upward */\n          100% -100vh,                 /* top-right, extended upward */\n          100% calc(100% + 100vh),     /* bottom-right, extended downward */\n          0 calc(100% + 100vh)         /* bottom-left, extended downward */\n        );\n     }\n\n     /* Vertical swipe: No container clipping by default - we apply selective clipping to inactive slides */\n     /* But during animations (.animating) and in-progress drags (.dragging), we temporarily enable container clipping */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"]) {\n        clip-path: none;\n     }\n\n     /* Vertical swipe DURING ANIMATION OR DRAG: Use container clipping to show only viewport */\n     /* This keeps the slides bounded at the card's top/bottom edges during the transition/drag */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"].animating),\n     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"].dragging) {\n        clip-path: polygon(\n          -100vw 0,                    /* top-left, extended leftward for dropdown overflow */\n          calc(100% + 100vw) 0,        /* top-right, extended rightward */\n          calc(100% + 100vw) 100%,     /* bottom-right, clip at container bottom */\n          -100vw 100%                  /* bottom-left, clip at container bottom */\n        );\n     }\n\n    /* Carousel mode: clip horizontally at container boundaries, allow vertical overflow */\n    /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n    :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-view-mode="carousel"]) {\n      clip-path: polygon(\n        0 -100vh,                    /* top-left, clip at edge but extend upward */\n        100% -100vh,                 /* top-right, clip at edge but extend upward */\n        100% calc(100% + 100vh),     /* bottom-right, clip at edge but extend downward */\n        0 calc(100% + 100vh)         /* bottom-left, clip at edge but extend downward */\n      );\n    }\n\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n        backface-visibility: hidden; /* Reduce repaints */\n        z-index: 2; /* Above pagination - transform creates stacking context */\n        pointer-events: none;\n     }\n\n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n        height: 100%;\n        max-height: 100%;\n        overflow: visible; /* Allow transforms to move content outside */\n        flex-wrap: nowrap;\n     }\n     \n     .slide {\n        flex: 0 0 var(--single-slide-width, 100%);\n        width: var(--single-slide-width, 100%);\n        min-width: var(--single-slide-width, 100%);\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: visible;\n        background: transparent;\n        z-index: 2; /* Above pagination (z-index: 1) */\n        transform: translateZ(0); /* Force GPU acceleration for better iOS/Safari rendering */\n        -webkit-transform: translateZ(0);\n        pointer-events: none; /* Allow clicks to pass through to elements below/behind */\n        /* Fix iPad Safari: ensure font-size inheritance through transform boundary */\n        font-size: inherit;\n        -webkit-text-size-adjust: 100%;\n     }\n\n     /* Vertical mode: Clip inactive slides to hide adjacent cards */\n     /* BUT: During animation (.animating) or an in-progress drag (.dragging), disable per-slide clipping */\n     /* so the neighbouring slide is visible while it moves into view */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating):not(.dragging) .slide:not(.active-slide) {\n        /* Clip to zero height - makes slide invisible while keeping it in DOM */\n        clip-path: inset(0 0 100% 0);\n     }\n\n     /* Vertical mode DURING ANIMATION OR DRAG: All slides visible (no per-slide clipping) */\n     /* Container clipping handles viewport boundaries */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"].animating .slide,\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"].dragging .slide {\n        clip-path: none;\n     }\n\n     /* Vertical mode AFTER ANIMATION: Active slide has no clipping, allowing dropdowns to overflow */\n     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */\n     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide.active-slide {\n        clip-path: none;\n     }\n\n     /* ========== BACKDROP FILTER MODE ========== */\n     /* When backdrop-filter is enabled, use overflow: hidden to clip adjacent cards */\n     /* Note: overflow: hidden may conflict with backdrop-filter in some browsers, */\n     /* but it's the only option that doesn't completely break the functionality */\n\n     :host([data-enable-backdrop-filter]) .card-container {\n        overflow: hidden;\n     }\n\n     /* ========== END BACKDROP FILTER MODE ========== */\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don't grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Fix iPad Safari: prevent flex stretching from overriding aspect-ratio in carousel mode */\n    .slide.carousel-mode > *:first-child {\n      flex-grow: 0;\n      align-self: flex-start;\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: visible;\n      position: relative;\n    }\n\n    /* ========== NATIVE CSS SCROLL-SNAP STRATEGY (scroll_strategy: css) ========== */\n    /* The slider becomes an overflow scroll container so the browser drives\n       scrolling on the compositor thread — no JS transform per touchmove, far\n       smoother on low-power devices (#102). Placed after the direction/view-mode\n       rules above so these win on equal specificity. The one-axis scroll snap\n       container clips the cross axis, so absolutely-positioned in-card overlays\n       may be clipped; HA's fixed-position dropdowns (mwc/wa menus) escape. */\n    .slider[data-scroll-strategy="css"] {\n      transform: none !important;\n      transition: none !important;\n      will-change: auto;\n      pointer-events: auto; /* the scroll container must receive the gesture */\n      overscroll-behavior: contain;\n      scrollbar-width: none; /* Firefox */\n      -ms-overflow-style: none; /* legacy Edge */\n    }\n    /* Hide the scrollbar (WebKit/Blink) — snapping is the affordance */\n    .slider[data-scroll-strategy="css"]::-webkit-scrollbar {\n      display: none;\n    }\n    .slider[data-scroll-strategy="css"][data-swipe-direction="horizontal"] {\n      overflow-x: auto;\n      overflow-y: hidden;\n      scroll-snap-type: x mandatory;\n    }\n    .slider[data-scroll-strategy="css"][data-swipe-direction="vertical"] {\n      overflow-x: hidden;\n      overflow-y: auto;\n      scroll-snap-type: y mandatory;\n    }\n    .slider[data-scroll-strategy="css"] .slide {\n      scroll-snap-align: var(--ssc-scroll-snap-align, start);\n    }\n    /* Single mode: never skip past a slide. Carousel may fling across several. */\n    .slider[data-scroll-strategy="css"]:not([data-view-mode="carousel"]) .slide {\n      scroll-snap-stop: always;\n    }\n    /* Native vertical scroll must show every slide, so disable the inactive-slide\n       clip-path that the JS vertical mode uses to hide neighbours. */\n    :host(:not([data-enable-backdrop-filter]))\n      .slider[data-scroll-strategy="css"][data-swipe-direction="vertical"]\n      .slide {\n      clip-path: none !important;\n    }\n    /* Let the browser own the gesture in both axes while scrolling natively. */\n    .card-container:has(.slider[data-scroll-strategy="css"]) {\n      touch-action: auto;\n    }\n    /* ========== END NATIVE CSS SCROLL-SNAP STRATEGY ========== */\n\n    /* Z-INDEX HIERARCHY (within .card-container stacking context):\n    * 1. pagination (z-index: 1) - Bottom layer, behind all slide content\n    * 2. .slider (z-index: 2) - Above pagination (transform creates stacking context)\n    *    -> .slide (z-index: 2) - Within slider's stacking context\n    *       -> .slide > *:first-child (z-index: 3) - Ensures dropdowns appear above everything\n    *\n    * This hierarchy fixes:\n    * - Android: Dropdowns now appear above pagination dots and other cards\n    * - iOS: Hardware acceleration (translateZ) improves rendering\n    */\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1; /* Lowest layer - behind slides and dropdowns */\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        /* Resolved per-slide colors. The base values fall back to the global\n           inactive/active colors; per-slide :nth-child rules below override these\n           two variables so the state rules (base/hover/active/active-hover) inherit\n           the right color without any specificity/ordering changes. */\n        --ssc-pagination-dot-inactive-resolved: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        --ssc-pagination-dot-active-resolved: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--ssc-pagination-dot-inactive-resolved);\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--ssc-pagination-dot-inactive-resolved));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--ssc-pagination-dot-active-resolved));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--ssc-pagination-dot-active-resolved);\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n    /* Per-slide icon indicators. The <ha-icon> lives inside the .pagination-dot\n       wrapper, so opacity, dot-spacing and all container styling carry over from\n       the dot rules above, and colour reuses the same resolved variables so the\n       inactive/active and per-slide colour theming applies to icons too. Dot\n       geometry (size/border/radius/shadow) does NOT apply to a glyph; the four\n       icon-specific vars below cover size (inactive/active), hover colour and a\n       drop-shadow. These .has-icon rules come after .pagination-dot.active so\n       (at equal specificity) they win for shared properties on the active slide,\n       keeping the active icon background-free while still recolouring it. */\n    .pagination-dot.has-icon {\n        background-color: transparent;\n        width: auto;\n        height: auto;\n        border: none;\n        border-radius: 0;\n        box-shadow: none;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        outline: none;\n        -webkit-tap-highlight-color: transparent;\n    }\n\n    /* Keep icon slides background/border/shadow-free in the hover + active states\n       too. The dot state rules (.pagination-dot.active:hover is specificity 0,3,0)\n       would otherwise paint a square behind the glyph - matching that specificity\n       here and coming later in source order wins. Without this, clicking an icon\n       (which makes it active) showed a box on hover / sticky tap-hover on mobile. */\n    .pagination-dot.has-icon:hover,\n    .pagination-dot.has-icon.active,\n    .pagination-dot.has-icon.active:hover {\n        background-color: transparent;\n        border-color: transparent;\n        box-shadow: none;\n    }\n\n    .pagination-dot.has-icon ha-icon {\n        --mdc-icon-size: var(--simple-swipe-card-pagination-icon-size, 18px);\n        color: var(--ssc-pagination-dot-inactive-resolved);\n        filter: var(--simple-swipe-card-pagination-icon-shadow, none);\n        transition: color 0.2s ease, --mdc-icon-size 0.2s ease, filter 0.2s ease;\n    }\n\n    .pagination-dot.has-icon:hover ha-icon {\n        color: var(--simple-swipe-card-pagination-icon-hover-color, var(--ssc-pagination-dot-inactive-resolved));\n    }\n\n    .pagination-dot.has-icon.active ha-icon {\n        color: var(--ssc-pagination-dot-active-resolved);\n        --mdc-icon-size: var(--simple-swipe-card-pagination-icon-active-size, var(--simple-swipe-card-pagination-icon-size, 18px));\n    }\n\n    .pagination-dot.has-icon.active:hover ha-icon {\n        color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--ssc-pagination-dot-active-resolved));\n    }\n${t}\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n        overflow: visible !important;\n        position: relative;\n        z-index: 3; /* Above slides and pagination - ensures dropdowns are on top */\n        pointer-events: auto; /* Re-enable pointer events for card content */\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n        overflow: visible !important;\n        position: relative;\n        z-index: 3; /* Same as parent - maintains stacking for dropdowns */\n     }\n\n     /* Mushroom-select dropdown positioning fix */\n     /* Note: The fixedMenuPosition property is disabled via JavaScript in CardBuilder.js */\n     /* This ensures dropdowns work correctly with CSS transforms applied to slides */\n     /* For vertical mode: Active slide has no clip-path, allowing dropdown overflow */\n     /* Inactive slides are clipped to hide adjacent cards */\n\n     /* Reduced Motion Support - Automatically disable animations when user prefers reduced motion */\n     @media (prefers-reduced-motion: reduce) {\n        /* Disable slide transitions */\n        .slider {\n           transition: none !important;\n        }\n\n        /* Disable auto-height transitions */\n        :host([data-auto-height]:not([data-editor-mode])) .card-container {\n           transition: none !important;\n        }\n\n        /* Disable pagination transitions */\n        .pagination {\n           transition: none !important;\n        }\n\n        .pagination-dot {\n           transition: none !important;\n        }\n     }\n   `}(),e.appendChild(n),this.card.cardContainer=document.createElement('div'),this.card.cardContainer.className='card-container',this.card.autoHeight?.enabled&&i&&(this.card.cardContainer.style.height=i),this.card.sliderElement=document.createElement('div'),this.card.sliderElement.className='slider',this.card.sliderElement.setAttribute('data-swipe-direction',this.card.Qt);const o=this.card.ii.scroll_strategy||'js';if(this.card.sliderElement.setAttribute('data-scroll-strategy',o),'css'===o&&this.card.sliderElement.style.setProperty('--ssc-scroll-snap-align','carousel'===this.card.ii.view_mode&&'center'===this.card.ii.carousel_alignment?'center':'start'),this.card.sliderElement.style.opacity='0',l('INIT','Slider hidden during build to prevent layout flash'),this.card.cardContainer.appendChild(this.card.sliderElement),e.appendChild(this.card.cardContainer),this.card.Gi(),0===this.card.ii.cards.length){const t=this.zi()||!0===this.card.preview;if(l('INIT',`No cards configured, show preview: ${t}`),t){l('INIT','Building preview state for editor.');const t=function(t,i){const e=document.createElement('div');e.className='preview-container';const s=document.createElement('div');s.className='preview-icon-container';const n=document.createElement('ha-icon');n.icon='horizontal'===t?'mdi:gesture-swipe-horizontal':'mdi:gesture-swipe-vertical',s.appendChild(n);const o=document.createElement('div');o.className='preview-text-container';const a=document.createElement('div');a.className='preview-title',a.textContent='Simple Swipe Card';const r=document.createElement('div');r.className='preview-description',r.textContent=`Create a swipeable container with multiple cards. Swipe ${'horizontal'===t?'horizontally':'vertically'} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const d=document.createElement('div');d.className='preview-actions';const l=document.createElement('ha-button');return l.raised=!0,l.textContent='EDIT CARD',l.setAttribute('aria-label','Edit Card'),l.addEventListener('click',i),d.appendChild(l),e.appendChild(s),e.appendChild(o),e.appendChild(d),e}(this.card.Qt,t=>function(t,i){t.stopPropagation(),l('EDITOR','Edit button clicked, firing show-edit-card event'),Ot(i,'show-edit-card',{element:i})}(t,this.card));e.innerHTML='',e.appendChild(n),e.appendChild(t)}else l('INIT','No cards and not in editor - showing empty state.'),e.innerHTML='',e.appendChild(n);return this.card.initialized=!0,!0}if(0===this.card.visibleCardIndices.length)return l('INIT','No visible cards, hiding entire card.'),this.card.style.display='none',e.innerHTML='',this.card.initialized=!0,!0;this.card.style.display='block',this.card.loopMode.initialize();const a=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.ii.cards);l('INIT','Building cards:',{totalVisible:this.card.visibleCardIndices.length,totalToLoad:a.length,infiniteMode:this.card.loopMode.isInfiniteMode});const r=this.card.ii.view_mode||'single';if(this.Zi()){const i=this.card.getAttribute('data-in-layout-container')||'unknown';l('INIT',`${i} detected - using synchronous loading for compatibility`);const e=a.map(i=>this.createCard(i.config,i.visibleIndex,i.originalIndex,s,i.isDuplicate,t).catch(t=>(console.warn(`Card ${i.visibleIndex} failed to load:`,t),null)));return await Promise.allSettled(e),this.card.Ui!==t?(l('INIT','Build superseded by newer build, aborting this one',{thisBuild:t,currentBuild:this.card.Ui}),!1):this.card.isConnected&&this.card.sliderElement?(this.Ki(),l('INIT','All cards loaded synchronously for layout-card'),this.card.initialized||(this.card.initialized=!0),requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer&&this.finishBuildLayout(t)}),l('INIT','Build completed successfully (layout-card mode)'),!0):(l('INIT','Card disconnected during build, aborting and cleaning up',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement}),this.card.cards=[],this.card.initialized=!1,!1)}if('carousel'===r){l('INIT','Carousel mode detected - creating DOM structure for layout, loading content progressively'),a.forEach(t=>{const i=Ct();i.setAttribute('data-index',t.originalIndex),i.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&i.setAttribute('data-duplicate','true'),t.config?.type&&i.setAttribute('data-card-type',t.config.type),this.card.cards.push({visibleIndex:t.visibleIndex,originalIndex:t.originalIndex,slide:i,config:JSON.parse(JSON.stringify(t.config)),error:!1,isDuplicate:t.isDuplicate,element:null,contentLoaded:!1}),this.card.sliderElement.appendChild(i),this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(i,t.visibleIndex)}),this.card.cards.sort((t,i)=>t.visibleIndex-i.visibleIndex),l('INIT','Carousel DOM structure created, now loading content progressively');const i=this.Qi(a),e=i[0]||[];e.length>0&&await this.te(e,s,'priority',t);for(let e=1;e<i.length;e++){const n=i[e];setTimeout(async()=>{this.card.isConnected&&await this.te(n,s,`batch-${e+1}`,t)},150*e)}}else{const i=this.Qi(a);l('INIT','Single mode stagger loading strategy:',{totalBatches:i.length,batchSizes:i.map(t=>t.length),firstBatchCards:i[0]?.map(t=>`${t.visibleIndex}(${t.originalIndex})`)||[]});const e=i[0]||[];if(e.length>0){l('INIT','Loading priority batch immediately:',e.length);const i=e.map(i=>this.createCard(i.config,i.visibleIndex,i.originalIndex,s,i.isDuplicate,t).catch(t=>(console.warn(`Priority card ${i.visibleIndex} failed to load:`,t),null)));await Promise.allSettled(i),this.Ki(),l('INIT','Priority batch loaded and displayed')}for(let e=1;e<i.length;e++){const n=i[e],o=200*e;setTimeout(async()=>{if(!this.card.isConnected)return;l('INIT',`Loading batch ${e+1}/${i.length} after ${o}ms`);const a=n.map(i=>this.createCard(i.config,i.visibleIndex,i.originalIndex,s,i.isDuplicate,t).catch(t=>(console.warn(`Background card ${i.visibleIndex} failed to load:`,t),null)));await Promise.allSettled(a),this.Ki(),l('INIT',`Batch ${e+1} completed`)},o)}if(!this.card.isConnected||!this.card.sliderElement)return l('INIT','Card disconnected before inserting priority cards'),this.card.cards=[],this.card.initialized=!1,!1;this.Ki()}if(this.card.ii.state_entity&&this.card.Ai){const t=this.ie();t!==this.card.currentIndex&&(l('STATE','Setting initial index from state sync:',t),this.card.currentIndex=t)}return this.card.pagination.create(),l('INIT','All cards initialized.'),this.card.initialized?requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout(t):l('INIT','Card disconnected before finishBuildLayout (rebuild)')}):(this.card.initialized=!0,requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout(t):l('INIT','Card disconnected before finishBuildLayout')})),l('INIT','Build completed successfully'),this.card.ee(),!0}async createCard(t,i,e,s,n=!1,o=null){const a=Ct();let r;const d={visibleIndex:i,originalIndex:e,slide:a,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{if(r=await s.createCardElement(kt(t)),o&&this.card.Ui!==o)return void l('INIT',`Discarding card ${i} from stale build`,{cardBuild:o,currentBuild:this.card.Ui});this.card.Ai&&(r.hass=this.card.Ai,l('INIT',`Set hass immediately after creation for card ${i} (type: ${t.type})`)),d.element=r,'picture-elements'===t.type&&(r.setAttribute('data-swipe-card-picture-elements','true'),a.setAttribute('data-has-picture-elements','true')),a.appendChild(r);const e=!!customElements.get('card-mod');if(await new Promise(t=>{requestAnimationFrame(()=>{e?setTimeout(t,30):t()})}),o&&this.card.Ui!==o)return void l('INIT',`Discarding card ${i} from stale build (after card-mod wait)`,{cardBuild:o,currentBuild:this.card.Ui});Nt(r,t?.uix,t,'card'),requestAnimationFrame(()=>{try{if('todo-list'===t.type){const t=r.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}})}catch(n){if(l('ERROR',`Error creating card ${i} (original ${e}):`,t,n),d.error=!0,o&&this.card.Ui!==o)return void l('INIT',`Discarding error card ${i} from stale build`);const r=await s.createErrorCardElement({type:'error',error:`Failed to create card: ${n.message}`,origConfig:t},this.card.Ai);d.element=r,a.appendChild(r)}o&&this.card.Ui!==o?l('INIT',`Discarding card ${i} from stale build (final check)`):this.card.cards.push(d)}se(t,i){l('VISIBILITY',`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.ne()}oe(){if(!this.card.sliderElement)return;l('MUSHROOM','Checking for mushroom-select elements...');const t=this.card.sliderElement.querySelectorAll('mushroom-select-card'),i=this.card.sliderElement.querySelectorAll('mushroom-select');l('MUSHROOM',`Found ${t.length} mushroom-select-card(s) and ${i.length} standalone mushroom-select element(s)`);const e=[];t.forEach(t=>{const i=t.shadowRoot?.querySelector('mushroom-card');if(i){l('MUSHROOM','Found mushroom-card inside mushroom-select-card');const s=i.querySelector('mushroom-select-option-control');if(s){l('MUSHROOM','Found mushroom-select-option-control in mushroom-card\'s light DOM');const i=s.shadowRoot?.querySelector('mushroom-select');i?(e.push({select:i,rootElement:t}),l('MUSHROOM','Found mushroom-select inside mushroom-select-option-control\'s shadow root')):l('MUSHROOM','mushroom-select-option-control found but no mushroom-select in its shadow root')}else l('MUSHROOM','mushroom-card found but no mushroom-select-option-control in its light DOM')}else l('MUSHROOM','mushroom-select-card found but no mushroom-card inside shadow root')}),i.forEach(t=>{e.push({select:t,rootElement:t})}),e.length>0?(l('MUSHROOM',`Total ${e.length} mushroom-select element(s) found, setting up dropdown positioning fix...`),e.forEach((t,i)=>{const{select:e,rootElement:s}=t;try{if(!1!==e.fixedMenuPosition&&(e.fixedMenuPosition=!1,l('MUSHROOM',`mushroom-select #${i+1} - disabled fixedMenuPosition`)),!0!==e.naturalMenuWidth&&(e.naturalMenuWidth=!0,l('MUSHROOM',`mushroom-select #${i+1} - enabled naturalMenuWidth`)),!s.closest('.slide'))return void l('MUSHROOM',`mushroom-select #${i+1} - no parent slide found`);l('MUSHROOM',`mushroom-select #${i+1} - found parent slide`);let t=!1;const n=e=>{t||(t=!0,e.addEventListener('opened',()=>{l('MUSHROOM',`mushroom-select #${i+1} - menu opened, adjusting position...`);const t=e.shadowRoot?.querySelector('.mdc-menu-surface');if(!t)return void l('MUSHROOM',`mushroom-select #${i+1} - menu surface not found`);const s=window.getComputedStyle(this.card.sliderElement).transform;l('MUSHROOM',`Slider transform: ${s}`);let n=0,o=0;if(s&&'none'!==s){const t=s.match(/matrix\(([^)]+)\)/);if(t){const i=t[1].split(',').map(t=>parseFloat(t.trim()));i.length>=6&&(n=i[4]||0,o=i[5]||0)}}l('MUSHROOM',`Detected transform offset: translateX=${n}, translateY=${o}`);const a=parseFloat(t.style.left)||0,r=parseFloat(t.style.top)||0,d=a-n,h=r-o;l('MUSHROOM',`Adjusting menu position: (${a}, ${r}) -> (${d}, ${h})`),t.style.left=`${d}px`,t.style.top=`${h}px`,l('MUSHROOM',`mushroom-select #${i+1} - position adjusted successfully`)}),l('MUSHROOM',`mushroom-select #${i+1} - menu fix listener attached`))};let o=0;const a=10,r=()=>{const t=e.shadowRoot?.querySelector('mwc-menu');if(t)n(t);else if(o++,o<a)l('MUSHROOM',`mushroom-select #${i+1} - menu not found yet, will retry (${o}/${a})`),setTimeout(r,100);else{if(l('MUSHROOM',`mushroom-select #${i+1} - menu not found after ${a} retries, setting up MutationObserver`),!e.shadowRoot)return void l('MUSHROOM',`mushroom-select #${i+1} - no shadow root, cannot observe`);const t=new MutationObserver(e=>{for(const s of e)if('childList'===s.type)for(const e of s.addedNodes)if('MWC-MENU'===e.nodeName)return l('MUSHROOM',`mushroom-select #${i+1} - menu detected via MutationObserver!`),n(e),void t.disconnect()});t.observe(e.shadowRoot,{childList:!0,subtree:!0}),l('MUSHROOM',`mushroom-select #${i+1} - MutationObserver setup complete`)}};r()}catch(t){console.warn(`Error fixing mushroom-select #${i+1}:`,t)}}),l('MUSHROOM','Mushroom-select positioning fix setup completed')):l('MUSHROOM','No mushroom-select elements found'),this.ae()}ae(){this.card.re&&(this.card.re.disconnect(),this.card.re=null),this.card.sliderElement&&(l('MUSHROOM','Setting up persistent observer for new mushroom-select elements...'),this.card.re=new MutationObserver(t=>{for(const i of t)if('childList'===i.type)for(const t of i.addedNodes)if('MUSHROOM-SELECT-CARD'===t.nodeName&&(l('MUSHROOM','Detected new mushroom-select-card being added to DOM'),setTimeout(()=>{this.de(t)},100)),t.querySelectorAll){const i=t.querySelectorAll('mushroom-select-card');i.length>0&&(l('MUSHROOM',`Detected ${i.length} nested mushroom-select-card(s) in added node`),setTimeout(()=>{i.forEach(t=>this.de(t))},100))}}),this.card.re.observe(this.card.sliderElement,{childList:!0,subtree:!0}),l('MUSHROOM','Persistent mushroom-select observer active'))}de(t){try{const i=t.shadowRoot?.querySelector('mushroom-card');if(!i)return void l('MUSHROOM','New card: no mushroom-card found in shadow root');const e=i.querySelector('mushroom-select-option-control');if(!e)return void l('MUSHROOM','New card: no mushroom-select-option-control found');const s=e.shadowRoot?.querySelector('mushroom-select');if(!s)return void l('MUSHROOM','New card: no mushroom-select found');if(l('MUSHROOM','New card: found mushroom-select, setting up positioning fix'),s.fixedMenuPosition=!1,s.naturalMenuWidth=!0,!t.closest('.slide'))return void l('MUSHROOM','New card: no parent slide found');let n=!1;const o=t=>{n||(n=!0,t.addEventListener('opened',()=>{l('MUSHROOM','New card menu opened, adjusting position...');const i=t.shadowRoot?.querySelector('.mdc-menu-surface');if(!i)return;const e=window.getComputedStyle(this.card.sliderElement).transform;let s=0,n=0;if(e&&'none'!==e){const t=e.match(/matrix\(([^)]+)\)/);if(t){const i=t[1].split(',').map(t=>parseFloat(t.trim()));i.length>=6&&(s=i[4]||0,n=i[5]||0)}}const o=parseFloat(i.style.left)||0,a=(parseFloat(i.style.top)||0)-n;i.style.left=o-s+'px',i.style.top=`${a}px`,l('MUSHROOM','New card menu position adjusted')}))},a=s.shadowRoot?.querySelector('mwc-menu');if(a)o(a),l('MUSHROOM','New card: menu found immediately');else{l('MUSHROOM','New card: menu not found, setting up observer');const t=new MutationObserver(i=>{for(const e of i)if('childList'===e.type)for(const i of e.addedNodes)if('MWC-MENU'===i.nodeName)return l('MUSHROOM','New card: menu detected via observer'),o(i),void t.disconnect()});t.observe(s.shadowRoot,{childList:!0,subtree:!0})}}catch(t){console.warn('Error fixing new mushroom-select-card:',t)}}le(){if(!this.card.sliderElement)return;Array.isArray(this.card.he)&&this.card.he.forEach(t=>t.disconnect()),this.card.he=[],this.card.ce=new WeakSet,l('DROPDOWN','Checking for mini-media-player elements...');const t=this.card.sliderElement.querySelectorAll('mini-media-player');l('DROPDOWN',`Found ${t.length} mini-media-player element(s)`),t.forEach(t=>this.pe(t)),this.ue()}pe(t){if(!t)return;let i=0;const e=()=>{const s=this.ge(t,'MMP-DROPDOWN');if(s.length>0)s.forEach(t=>this.fe(t));else if(i++,i<10)setTimeout(e,100);else if(t.shadowRoot){l('DROPDOWN','mini-media-player dropdown not found, observing for creation');const i=new MutationObserver(()=>{const e=this.ge(t,'MMP-DROPDOWN');e.length>0&&(e.forEach(t=>this.fe(t)),i.disconnect())});i.observe(t.shadowRoot,{childList:!0,subtree:!0}),this.card.he.push(i)}};e()}fe(t){if(!t||!t.shadowRoot)return;if(this.card.ce.has(t))return;this.card.ce.add(t);let i=!1;const e=new MutationObserver(t=>{for(const e of t){const t=e.target;if(!t.classList||!t.classList.contains('mmp-dropdown__menu'))continue;const s=t.hasAttribute('open');s!==i&&(i=s,s?(l('DROPDOWN','mini-media-player dropdown opened'),this.card.me()):(l('DROPDOWN','mini-media-player dropdown closed'),this.card.ve()))}});e.observe(t.shadowRoot,{attributes:!0,attributeFilter:['open'],subtree:!0}),this.card.he.push(e),l('DROPDOWN','mini-media-player dropdown observer attached')}ue(){this.card.we&&(this.card.we.disconnect(),this.card.we=null),this.card.sliderElement&&(this.card.we=new MutationObserver(t=>{for(const i of t)if('childList'===i.type)for(const t of i.addedNodes)if(t.nodeType===Node.ELEMENT_NODE)if('MINI-MEDIA-PLAYER'===t.nodeName)setTimeout(()=>this.pe(t),100);else if(t.querySelectorAll){const i=t.querySelectorAll('mini-media-player');i.length>0&&setTimeout(()=>{i.forEach(t=>this.pe(t))},100)}}),this.card.we.observe(this.card.sliderElement,{childList:!0,subtree:!0}))}ge(t,i){const e=[],s=t=>{const n=t.children?Array.from(t.children):[];for(const t of n)t.tagName===i&&e.push(t),t.shadowRoot&&s(t.shadowRoot),s(t)};return s(t.shadowRoot||t),e}async finishBuildLayout(t=null){if(t&&this.card.Ui&&t!==this.card.Ui)return void l('INIT','finishBuildLayout skipped - stale build detected',{thisBuild:t,currentBuild:this.card.Ui});if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void l('INIT','finishBuildLayout skipped',{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});l('INIT','Finishing build layout...');const i=await this.be();if(t&&this.card.Ui&&t!==this.card.Ui)return void l('INIT','finishBuildLayout aborted - superseded during width wait');i?(this.card.slideWidth=i.width,this.card.slideHeight=i.height,l('INIT','Initial dimensions:',i)):(l('INIT','Initial width unavailable - using fallback dimensions (will recalc on resize)'),this.card.slideWidth=300,this.card.slideHeight=100);const e=this.card.ii.view_mode||'single';'carousel'===e?this.Ie(this.card.slideWidth)||console.warn('SimpleSwipeCard: Carousel layout calculation produced invalid dimensions'):this.card.style.setProperty('--single-slide-width',this.card.ye?'100%':`${this.card.slideWidth}px`);const s=this.card.visibleCardIndices.length,n=this.card.getEvaluatedConfigValue('reset_target_card',1),o=Math.max(0,parseInt(n)-1||0);if(0!==o){const t=this.card.visibleCardIndices.indexOf(o);if(-1!==t)this.card.currentIndex=t,l('INIT',`Target card ${n} is visible at position ${t}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=o){t=i;break}this.card.currentIndex=t,l('INIT',`Target card ${n} not visible, using closest at position ${t}`)}}if(this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),this.card.cardContainer&&this.card.cardContainer.isConnected?function(t,i){if(!(i&&i instanceof Element))return void l('INIT','applyBorderRadiusToSlides skipped: invalid cardContainer',{isNull:!i,type:i?.constructor?.name});if(!i.isConnected)return void l('INIT','applyBorderRadiusToSlides skipped: cardContainer not connected to DOM');const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer):l('INIT','Skipping border radius application - container no longer valid'),'carousel'!==e&&!this.card.ye&&this.card.sliderElement){const t=this.card.slideWidth;this.card.sliderElement.querySelectorAll('.slide:not(.carousel-mode)').forEach(i=>{i.style.width=`${t}px`,i.style.minWidth=`${t}px`,i.style.flexBasis=`${t}px`}),l('INIT','Set single mode slide widths:',t)}this.card.updateSlider(!1),this.card.Se(),s>1?(this.card.swipeGestures?.addGestures(),this.card.scrollStrategy?.attach()):(this.card.swipeGestures?.removeGestures(),this.card.scrollStrategy?.detach()),l('INIT','Layout finished, slideWidth:',this.card.slideWidth,'slideHeight:',this.card.slideHeight,'currentIndex:',this.card.currentIndex,'visible cards:',s,'view mode:',e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage(),this.card.Ee(),this.oe(),this.le(),l('PAGINATION','Updating pagination after layout finalization'),requestAnimationFrame(()=>{this.card.isConnected&&this.card.pagination&&(this.card.pagination.update(!1),l('PAGINATION','Pagination active state updated'))}),this.card.Ni&&(l('CARD_MOD','Applying card-mod styles in finishBuildLayout'),this.card.ki(),this.card.xe(),'carousel'===e&&this.Te().then(()=>{this.card.isConnected&&this.recalculateCarouselLayout()})),l('INIT','Creating/updating pagination before fade-in'),this.card.pagination.updateLayout(),await new Promise(t=>requestAnimationFrame(t)),this.card.Ce(),Nt(this.card,this.card.ii?.uix,this.card.ii,'card'),t&&this.card.Ui&&t!==this.card.Ui?l('INIT','finishBuildLayout aborted before reveal - superseded'):await this.$e()}async Te(){const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(l('CARD_MOD','Waiting for carousel CSS variable application:',{initialWidth:t,maxWaitTime:500}),t&&''!==t&&'auto'!==t)return l('CARD_MOD','CSS variable already applied:',t),Promise.resolve();const i=Date.now();return new Promise(t=>{const e=setInterval(()=>{const s=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim(),n=Date.now()-i;if(s&&''!==s&&'auto'!==s)return clearInterval(e),l('CARD_MOD','CSS variable detected after',n,'ms:',s),void t();n>=500&&(clearInterval(e),l('CARD_MOD','CSS variable watch timed out after',500,'ms - using fallback'),t())},20)})}async be(){for(let t=0;t<5;t++){if(await new Promise(t=>requestAnimationFrame(t)),!this.card.isConnected||!this.card.cardContainer)return l('INIT','Card disconnected during initial width read'),null;const i=this.card.cardContainer.offsetWidth;if(i>0){const e=this.card.cardContainer.offsetHeight;return l('INIT','Initial width acquired:',{width:i,height:e,frames:t+1}),{width:i,height:e}}if(null===this.card.offsetParent)return l('INIT','Element hidden during build - deferring to ResizeObserver'),null}return l('INIT','Initial width still 0 after MAX_FRAMES - using fallback'),null}async $e(){if(!this.card.isConnected||!this.card.cardContainer||!this.card.sliderElement)return void l('INIT','Card disconnected before fade-in');const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;l('INIT','Final pre-fade dimension check:',{currentStored:{width:this.card.slideWidth,height:this.card.slideHeight},actualMeasured:{width:t,height:i}}),t<=0?l('INIT','Final dimensions unavailable (hidden) - keeping stored dimensions'):(Math.abs(t-this.card.slideWidth)>2||Math.abs(i-this.card.slideHeight)>2)&&(l('INIT','Final dimensions differ from stored - updating before fade-in'),this.card.slideWidth=t,this.card.slideHeight=i>0?i:this.card.slideHeight,this.card.updateSlider(!1),'carousel'===(this.card.ii.view_mode||'single')?this.Ie(t):!this.card.ye&&(this.card.style.setProperty('--single-slide-width',`${t}px`),this.card.sliderElement)&&this.card.sliderElement.querySelectorAll('.slide:not(.carousel-mode)').forEach(i=>{i.style.width=`${t}px`,i.style.minWidth=`${t}px`,i.style.flexBasis=`${t}px`}));const e=this.card.sliderElement;this.card.swipeEffects?.initialize(),e.style.transition='',e.style.opacity='1',this.card.Me&&(clearTimeout(this.card.Me),this.card.Me=null),l('INIT','Slider revealed (instant), card fully initialized')}Yi(t){this.card.Me&&clearTimeout(this.card.Me),this.card.Me=setTimeout(()=>{this.card.Me=null;const i=this.card.sliderElement;this.card.isConnected&&i?.isConnected&&'0'===i.style.opacity&&!this.card.building&&this.card.Ui===t&&(l('INIT','Reveal watchdog fired - slider still hidden, finishing layout'),this.finishBuildLayout(t))},1e3)}ie(){if(!this.card.ii.state_entity||!this.card.Ai)return this.card.currentIndex;const t=this.card.ii.state_entity,i=this.card.Ai.states[t];if(!i)return l('STATE','State entity not found during build:',t),this.card.currentIndex;const e=i.state;let s=null;if(t.startsWith('input_select.')){if(!i.attributes.options||!Array.isArray(i.attributes.options))return this.card.currentIndex;const t=i.attributes.options.indexOf(e);-1!==t&&t<this.card.visibleCardIndices.length&&(s=t)}else if(t.startsWith('input_number.')){const t=parseInt(e);if(!isNaN(t)){const i=t-1;i>=0&&i<this.card.visibleCardIndices.length&&(s=i)}}return null!==s?(l('STATE',`State sync initial index determined during build: ${s} from entity state: ${e}`),s):this.card.currentIndex}Oe(t,i){const e=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(l('INIT','Checking for CSS override:',{computedWidth:e,hasValue:!!e,isEmpty:''===e,isAuto:'auto'===e}),e&&''!==e&&'auto'!==e){const s=parseFloat(e),n=(t+i)/(s+i);return l('INIT','Using CSS-overridden card width:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2),source:'card-mod or CSS'}),{cardWidth:s,cardsVisible:Math.max(1.1,n)}}let s;if(l('INIT','No CSS override found, calculating from config'),void 0!==this.card.ii.cards_visible)s=this.card.ii.cards_visible,l('INIT','Using legacy cards_visible approach:',s);else{const e=this.card.ii.card_min_width||200,n=(t+i)/(e+i);s=Math.max(1.1,Math.round(10*n)/10),l('INIT','Using responsive approach:',{minWidth:e,containerWidth:t,cardSpacing:i,rawCardsVisible:n.toFixed(2),finalCardsVisible:s})}return{cardWidth:(t-(s-1)*i)/s,cardsVisible:s}}recalculateCarouselLayout(){if('carousel'!==(this.card.ii.view_mode||'single'))return;const t=this.card.cardContainer?.offsetWidth;t&&(l('INIT','Recalculating carousel layout (resize or card-mod)'),this.Ie(t),this.card.updateSlider(!1))}Ie(t){const i=Math.max(0,parseInt(this.card.ii.card_spacing))||0,{cardWidth:e,cardsVisible:s}=this.Oe(t,i);if(!this.Ae(e,s,t))return l('INIT','Carousel dimensions failed validation:',{cardWidth:e,cardsVisible:s,containerWidth:t}),!1;l('INIT','Carousel layout setup (validated):',{containerWidth:t,cardsVisible:s.toFixed(2),cardSpacing:i,cardWidth:e.toFixed(2)});const n=this.card.style.getPropertyValue('--carousel-card-width').trim(),o=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();return!n&&o&&''!==o&&'auto'!==o?l('INIT','Skipping CSS variable set - overridden by card-mod:',o):(this.card.style.setProperty('--carousel-card-width',`${e}px`),l('INIT','Set --carousel-card-width to calculated value:',`${e}px`)),this.card.Ji=e,this.card.qi=s,this.card.sliderElement.setAttribute('data-view-mode','carousel'),this.card.cardContainer.setAttribute('data-view-mode','carousel'),this.card.cards.forEach(t=>{t.slide&&t.slide.classList.add('carousel-mode')}),!0}Ae(t,i,e){return isFinite(t)&&isFinite(i)&&isFinite(e)?t<=0||i<=0||e<=0?(l('INIT','Validation failed: Zero or negative values'),!1):t>1.5*e?(l('INIT','Validation failed: Card width exceeds container significantly'),!1):t<50?(l('INIT','Validation failed: Card width too small (< 50px)'),!1):!(i>20&&(l('INIT','Validation failed: Too many visible cards (> 20)'),1)):(l('INIT','Validation failed: Non-finite numbers detected'),!1)}Qi(t){const i=this.card.currentIndex||0,e=this.card.ii.view_mode||'single',s=this.card.loopMode.isInfiniteMode;l('INIT','Determining visible cards for stagger loading:',{currentIndex:i,viewMode:e,isInfiniteMode:s,totalCardsToLoad:t.length});let n=[];if(s)n=this._e(i,t,e);else{const t=this.card.visibleCardIndices.length;if('single'===e)n=[i-1,i,i+1].filter(i=>i>=0&&i<t);else if('carousel'===e){const e=this.Ne(i,t);n=[];for(let t=e.startIndex;t<=e.endIndex;t++)n.push(t)}else n=[i]}const o=[],a=[];t.forEach(t=>{n.includes(t.visibleIndex)?(o.push(t),l('INIT',`Priority card: visibleIndex ${t.visibleIndex}, originalIndex ${t.originalIndex}, isDuplicate: ${t.isDuplicate}`)):a.push(t)}),o.sort((t,e)=>Math.abs(t.visibleIndex-i)-Math.abs(e.visibleIndex-i));const r=[];if('carousel'===e&&o.length>0)r.push(o),l('INIT',`Carousel mode: All ${o.length} priority cards in first batch`);else for(let t=0;t<o.length;t+=3)r.push(o.slice(t,t+3));for(let t=0;t<a.length;t+=3)r.push(a.slice(t,t+3));return l('INIT','Batch creation completed:',{visibleIndices:n,priorityCards:o.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),regularCards:a.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),totalBatches:r.length,firstBatchSize:r[0]?.length||0}),r}_e(t,i,e){const s=this.card.visibleCardIndices.length,n=this.card.loopMode.getDuplicateCount(),o=n+t;l('INIT','Infinite mode position mapping:',{virtualCurrentIndex:t,realDOMPosition:o,duplicateCount:n,totalRealCards:s,totalCardsInDOM:i.length});let a=[];if('single'===e)a=[o-1,o,o+1].filter(t=>t>=0&&t<i.length);else if('carousel'===e){const t=this.ke();let e=o,s=Math.min(i.length-1,e+Math.ceil(t)-1);s>=i.length&&(s=i.length-1,e=Math.max(0,s-Math.ceil(t)+1));for(let t=e;t<=s;t++)a.push(t);l('INIT','Infinite carousel visible range calculation:',{cardsVisible:t,realDOMPosition:o,startDOM:e,endDOM:s,visibleDOMPositions:a,calculation:`Start from DOM ${o}, show ${Math.ceil(t)} cards: ${e} to ${s}`})}else a=[o];const r=[];return a.forEach(t=>{if(t>=0&&t<i.length){const e=i[t];e&&r.push(e.visibleIndex)}}),r}ke(){if(void 0!==this.card.ii.cards_visible)return this.card.ii.cards_visible;const t=this.card.cardContainer?.offsetWidth||300,i=this.card.ii.card_min_width||200,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0,s=Math.max(1,(t+e)/(i+e));return Math.max(1.1,Math.round(10*s)/10)}Ne(t,i){const e=this.ke();if(i<=Math.floor(e))return{startIndex:0,endIndex:i-1,cardsVisible:e};let s=t-Math.floor(e/2);s<0&&(s=0);let n=s+Math.ceil(e)-1;return n>=i&&(n=i-1,s=Math.max(0,n-Math.ceil(e)+1)),{startIndex:Math.max(0,Math.floor(s)),endIndex:Math.min(n,i-1),cardsVisible:e}}async te(t,i,e,s=null){l('INIT',`Loading carousel ${e} content:`,t.length);const n=t.map(async t=>{try{const e=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(!e||e.contentLoaded)return null;const n=await i.createCardElement(kt(t.config));return s&&this.card.Ui!==s?(l('INIT',`Discarding carousel card ${t.visibleIndex} from stale build`),null):(this.card.Ai&&(n.hass=this.card.Ai),'picture-elements'===t.config.type&&(n.setAttribute('data-swipe-card-picture-elements','true'),e.slide.setAttribute('data-has-picture-elements','true')),requestAnimationFrame(()=>{try{if('todo-list'===t.config.type){const t=n.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}}),e.slide.appendChild(n),e.element=n,e.contentLoaded=!0,Nt(n,t.config?.uix,t.config,'card'),n)}catch(e){l('ERROR',`Error loading carousel card ${t.visibleIndex}:`,e);const s=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(s){s.error=!0,s.contentLoaded=!0;try{const n=await i.createErrorCardElement({type:'error',error:`Failed to create card: ${e.message}`,origConfig:t.config},this.card.Ai);s.slide.appendChild(n),s.element=n}catch(t){console.error('Failed to create error card:',t)}}return null}});await Promise.allSettled(n),l('INIT',`Carousel ${e} content loading completed`)}Ki(){if(!this.card.isConnected||!this.card.sliderElement)return void l('ERROR','_insertLoadedCardsIntoDom: Card disconnected or sliderElement is null, skipping',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement});const t=this.card.cards.filter(t=>t&&t.slide&&!t.slide.parentElement).sort((t,i)=>t.visibleIndex-i.visibleIndex);t.forEach(t=>{if(!this.card.sliderElement)return void l('ERROR','Slider element disappeared during insertion loop');t.slide.setAttribute('data-index',t.originalIndex),t.slide.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&t.slide.setAttribute('data-duplicate','true'),t.config?.type&&t.slide.setAttribute('data-card-type',t.config.type),this.card.swipeEffects?.usesStackedMode()&&(t.slide.style.gridColumn='1',t.slide.style.gridRow='1',t.slide.style.opacity='0',t.slide.style.zIndex='0');const i=Array.from(this.card.sliderElement.children);let e=i.length;for(let s=0;s<i.length;s++)if(parseInt(i[s].getAttribute('data-visible-index')||'0')>t.visibleIndex){e=s;break}if(e===i.length?this.card.sliderElement.appendChild(t.slide):this.card.sliderElement.insertBefore(t.slide,i[e]),this.card.swipeEffects?.usesStackedMode()){const i=Array.from(this.card.sliderElement.children).indexOf(t.slide);this.card.swipeEffects.applyStackedTransformToNewSlide(t.slide,i)}this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(t.slide,t.visibleIndex)})}Zi(){let t=this.card,i=10;for(;t&&i>0&&(t=t.parentElement||t.parentNode?.host,t);){const e=t.tagName?.toLowerCase();if('layout-card'===e||'masonry-layout'===e||'horizontal-layout'===e||'vertical-layout'===e||'grid-layout'===e||'hui-masonry-view'===e)return l('INIT',`Ã¢Å“â€¦ DETECTED PARENT LAYOUT CONTAINER: ${e}`),this.card.setAttribute('data-in-layout-container',e),!0;i--}return this.card.removeAttribute('data-in-layout-container'),!1}}class Rt{constructor(t){this.card=t,this.De=null,this.Re=null,this.Le=null,this.Pe=!1,this.He=null,this.Ve=this.ze.bind(this)}manage(){if(this.card.initialized&&this.card.isConnected)if(this.stop(),this.card.ii.state_entity&&this.card.Ai){const t=this.card.ii.state_entity;this.card.templateEvaluator?.isTemplate(t)?(this.De=this.card.templateEvaluator.getEvaluatedValue('state_entity',this.card.Ai),l('STATE',`Evaluated state_entity template: "${t}" => "${this.De}"`)):this.De=t,this.De&&this.Fe()?(l('STATE','State synchronization enabled for entity:',this.De),this.Ue()):(l('STATE','Invalid or missing entity:',this.De),this.De=null)}else l('STATE','State synchronization disabled',{hasEntity:!!this.card.ii.state_entity,hasHass:!!this.card.Ai})}stop(){this.He&&(clearTimeout(this.He),this.He=null),this.De=null,this.Re=null,this.Le=null,this.Pe=!1}onCardNavigate(t){if(!this.De||!this.card.Ai||this.Pe)return;const i=this.Be(t);if(null===i)return;const e=this.card.Ai.states[this.De];if(e&&e.state===i)l('STATE','Entity already at correct state:',i);else{l('STATE',`Updating entity ${this.De} to:`,i),this.Pe=!0;try{'input_select'===this.Re?this.card.Ai.callService('input_select','select_option',{entity_id:this.De,option:i}):'input_number'===this.Re&&this.card.Ai.callService('input_number','set_value',{entity_id:this.De,value:i}),this.Le=i,setTimeout(()=>{this.Pe=!1},500)}catch(t){l('ERROR','Failed to update entity:',t),this.Pe=!1}}}Fe(){if(!this.card.Ai||!this.De)return!1;const t=this.card.Ai.states[this.De];if(!t)return l('STATE','Entity not found:',this.De),!1;if(this.De.startsWith('input_select.')){if(this.Re='input_select',!t.attributes.options||!Array.isArray(t.attributes.options))return l('STATE','input_select entity has no options:',this.De),!1}else{if(!this.De.startsWith('input_number.'))return l('STATE','Entity is not input_select or input_number:',this.De),!1;this.Re='input_number'}return!0}Ue(){if(!this.card.Ai||!this.De)return;const t=this.card.Ai.states[this.De];if(!t)return;this.Le=t.state;const i=this.We(t.state);null===i||i!==this.card.currentIndex?null!==i&&i!==this.card.currentIndex&&(l('STATE',`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i,1,!1)):l('STATE',`Initial sync: card already at correct position ${i}, skipping initial positioning`)}ze(){if(!this.card.Ai||!this.De||this.Pe)return;const t=this.card.Ai.states[this.De];if(!t)return;const i=t.state;if(i===this.Le)return;l('STATE',`Entity ${this.De} changed from "${this.Le}" to "${i}"`),this.Le=i;const e=this.We(i);null!==e&&e!==this.card.currentIndex&&(l('STATE',`Navigating to card index ${e} from entity change`),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}We(t){if('input_select'===this.Re){const i=this.card.Ai.states[this.De];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(l('STATE',`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(l('STATE',`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if('input_number'===this.Re){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(l('STATE',`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}Be(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if('input_select'===this.Re){const i=this.card.Ai.states[this.De];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(l('STATE',`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return'input_number'===this.Re?t+1:null}onHassChange(t,i){if(!this.De||!i)return;const e=t?.states[this.De],s=i.states[this.De];if(!s)return l('STATE','Configured entity no longer exists:',this.De),void this.stop();e&&e.state===s.state||(this.He&&clearTimeout(this.He),this.He=setTimeout(()=>{this.ze(),this.He=null},100))}}class Lt{constructor(t){this.card=t,this.slideObservers=new Map,this.cardHeights={},this.enabled=!1}initialize(){this.enabled=!0===this.card.ii.auto_height&&'single'===this.card.ii.view_mode&&'horizontal'===this.card.ii.swipe_direction&&'infinite'!==this.card.ii.loop_mode,this.enabled?(this.card.setAttribute('data-auto-height',''),l('AUTO_HEIGHT','Auto height enabled')):(this.card.removeAttribute('data-auto-height'),this.cleanup())}observeSlide(t,i){if(!this.enabled||!t)return;if(this.slideObservers.has(i))return;const e=new ResizeObserver(t=>{for(const e of t){const t=e.contentRect.height;if(t<10)return void l('AUTO_HEIGHT',`Card ${i} height too small (${t}px), waiting for content to load`);this.cardHeights[i]!==t&&(l('AUTO_HEIGHT',`Card ${i} height changed to ${t}px`),this.cardHeights[i]=t,i===this.card.currentIndex&&this.updateContainerHeight(t))}});e.observe(t),this.slideObservers.set(i,e),l('AUTO_HEIGHT',`Now observing slide ${i}`),this.Ye(t,i)}async Ye(t,i){const e=t.querySelector('*');if(!e)return;const s=e.tagName.toLowerCase();if(s.includes('-'))try{await customElements.whenDefined(s),l('AUTO_HEIGHT',`Custom element ${s} is now defined for card ${i}`)}catch(t){l('AUTO_HEIGHT',`Could not wait for custom element ${s}:`,t)}await new Promise(t=>requestAnimationFrame(t));const n=t.offsetHeight;n>=10&&this.cardHeights[i]!==n&&(l('AUTO_HEIGHT',`Initial height for card ${i}: ${n}px`),this.cardHeights[i]=n,i===this.card.currentIndex&&this.updateContainerHeight(n))}updateContainerHeight(t){if(this.enabled&&this.card.cardContainer){if(!t||0===t){if(this.card.cardContainer.offsetHeight>0)return void l('AUTO_HEIGHT','Invalid height, keeping current height');t=250,l('AUTO_HEIGHT','Using fallback height: 250px')}this.card.cardContainer.style.height=`${t}px`,l('AUTO_HEIGHT',`Container height set to ${t}px`)}}updateForCurrentCard(){if(!this.enabled)return;const t=this.cardHeights[this.card.currentIndex];t&&t>0?this.updateContainerHeight(t):l('AUTO_HEIGHT',`No height cached for card ${this.card.currentIndex}, waiting for ResizeObserver`)}reset(){this.slideObservers.forEach((t,i)=>{t.disconnect(),l('AUTO_HEIGHT',`Stopped observing slide ${i}`)}),this.slideObservers.clear(),this.cardHeights={}}cleanup(){this.reset(),this.card.cardContainer&&(this.card.cardContainer.style.height='')}}class Pt{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;const i=this.card.cardContainer.offsetWidth,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0;let s,n;if(this.card.Ji&&this.card.qi)s=this.card.Ji,n=this.card.qi,l('SWIPE','Using stored carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)});else{const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();t&&''!==t&&'auto'!==t?(s=parseFloat(t),n=(i+e)/(s+e)):(n=void 0!==this.card.ii.cards_visible?this.card.ii.cards_visible:Math.max(1.1,Math.round((i+e)/((this.card.ii.card_min_width||200)+e)*10)/10),s=(i-(n-1)*e)/n),l('SWIPE','Recalculated carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)})}const o=this.card.visibleCardIndices.length,a=this.card.ii.loop_mode||'none',r='center'===this.card.ii.carousel_alignment;if(!r&&o<=Math.floor(n)&&'infinite'!==this.card.ii.loop_mode)return l('SWIPE','Insufficient cards for carousel transform, staying at position 0'),0;let d;if('infinite'===a&&o>1){const i=this.card.loopMode.getDuplicateCount();d=t+i,l('SWIPE','Carousel infinite mode: logical index',t,'-> DOM position',d,'duplicateCount:',i)}else d=Math.min(t,Math.max(0,o-1));const h=s+e;let c=d*h;return r&&(c-=(i-s)/2),l('SWIPE','Carousel transform calculation:',{targetIndex:t,domPosition:d,totalCards:o,cardsVisible:n.toFixed(2),cardWidth:s.toFixed(2),cardSpacing:e,moveDistance:h.toFixed(2),transform:c.toFixed(2),loopMode:a,centered:r}),c}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);if(i&&'free'===this.card.ii.swipe_behavior&&this.card.je>1){const t=this.card.swipeBehavior.calculateAnimationDuration(this.card.je),i=this.card.swipeBehavior.getEasingFunction(this.card.je);this.card.sliderElement.style.transition=`transform ${t}ms ${i}`,l('SWIPE',`Carousel multi-card animation: ${this.card.je} cards, ${t}ms duration, easing: ${i}`)}else this.card.sliderElement.style.transition=this.card.ti(i);this.card.sliderElement.style.transform=`translateX(${-e}px)`,l('SWIPE',`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}Ge(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class Ht{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this.domDuplicateCount=null,this.Je=null,this.qe=null}getMode(){return this.card.ii.loop_mode||'none'}isInfinite(){return'infinite'===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode?l('LOOP','Infinite loop mode initialized for',this.card.visibleCardIndices.length,'visible cards'):(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this.domDuplicateCount=0,'infinite'===this.getMode()&&l('LOOP','Infinite loop mode disabled - only',this.card.visibleCardIndices.length,'visible card(s)'))}getDuplicateCount(){return null!==this.domDuplicateCount?this.domDuplicateCount:this.calculateIdealDuplicateCount()}calculateIdealDuplicateCount(){if('infinite'!==this.getMode()||this.card.visibleCardIndices.length<=1)return 0;const t=this.card.ii.swipe_behavior||'single';if('single'===(this.card.ii.view_mode||'single'))return'free'===t?4:1;{const i=this.card.ii.cards_visible||this.card.ai(),e=Math.max(5,Math.ceil(2*i));return'free'===t?e+Math.min(5,Math.ceil(i)):e}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return this.domDuplicateCount=0,t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.calculateIdealDuplicateCount();this.domDuplicateCount=s;const n=t.length;for(let o=0;o<s;o++){const a=o-s;let r;r=a<0?(a%n+n)%n:a%n;const d=t[r];e.push({config:i[d],visibleIndex:o-s,originalIndex:d,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o%n];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return 0===i?0:this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){return this.isInfiniteMode?0===this.card.visibleCardIndices.length?0:t-this.getDuplicateCount():t}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e?e+i-(e-t):e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;if('carousel'===(this.card.ii.view_mode||'single')){if('free'===(this.card.ii.swipe_behavior||'single')){const e=this.getDuplicateCount(),s=Math.floor(.3*e);return t-0<s||i-1-t<s}return t>=i||t<0}return t<0||t>=i}scheduleSeamlessJump(t,i=null){if(this.Xe(),!this.shouldPerformSeamlessJump(t))return void l('LOOP',`Seamless jump not needed for target index ${t}`);let e;if(null!==i)e=i;else try{const t=this.card.ti(!0);l('LOOP','DEBUG: transitionStyle =',t);const i=t.match(/transform\s+([\d.]+)([a-z]*)\s/);if(l('LOOP','DEBUG: regex match =',i),i){const t=parseFloat(i[1]),s=i[2]||'s';l('LOOP','DEBUG: parsed duration =',t,'unit =',s),e='s'===s?1e3*t:'ms'===s?t:400,l('LOOP','DEBUG: final transitionDuration =',e)}else l('LOOP','DEBUG: regex match failed, using fallback'),e=400}catch(t){l('LOOP','Error reading CSS transition duration:',t),e=400}l('LOOP',`Scheduling seamless jump for target index ${t} after ${e}ms animation`);let s=!1;const n=()=>{if(!s){if(s=!0,this.Je&&(clearTimeout(this.Je),this.Je=null),!this.card.isConnected||this.card.building)return l('LOOP','Seamless jump cancelled - card disconnected or building'),void(this.card.si=!1);requestAnimationFrame(()=>{try{const i=this.card.currentIndex;if(l('LOOP',`Seamless jump executing: target was ${t}, actual current is ${i}`),!this.shouldPerformSeamlessJump(i))return l('LOOP',`Seamless jump cancelled - conditions changed (target: ${t}, actual: ${i})`),void(this.card.si=!1);const e=this.card.visibleCardIndices.length;let s;if(i<0)s=e+i%e,s>=e&&(s=e-1);else{if(!(i>=e))return l('LOOP',`Seamless jump not needed - already in valid position (${i})`),void(this.card.si=!1);s=i%e}l('LOOP',`Performing seamless jump: virtual ${i} â†’ real ${s}`),this.card.si=!0,this.card.sliderElement&&(this.card.sliderElement.style.transition='none'),this.card.currentIndex=s,this.card.updateSlider(!1),requestAnimationFrame(()=>{try{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.ti(!0)),l('LOOP',`Seamless jump completed - now at real position ${s}, ready for continued scrolling`)}catch(t){l('ERROR','Error in seamless jump transition restoration:',t)}finally{this.card.si=!1}})}catch(t){l('ERROR','Error during seamless jump execution:',t),this.card.si=!1}})}},o=t=>{t.target!==this.card.sliderElement||'transform'!==t.propertyName||s||(l('LOOP','Transform transition ended, executing seamless jump'),this.card.sliderElement.removeEventListener('transitionend',o),this.qe=null,setTimeout(n,10))};this.card.sliderElement&&e>0&&(this.qe=o,this.card.sliderElement.addEventListener('transitionend',o));const a=Math.max(100,.2*e);this.Je=setTimeout(()=>{this.qe&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.qe),this.qe=null),s||(l('LOOP','Executing seamless jump via timeout fallback'),n())},e+a)}Xe(){this.Je&&(clearTimeout(this.Je),this.Je=null,this.card.si&&(l('LOOP','Clearing seamless jump flag during cancellation'),this.card.si=!1),this.qe&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.qe),this.qe=null),l('LOOP','Cancelled pending seamless jump and cleaned up event listeners'))}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return t;if(!('loopback'===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return{nextIndex:t+1,shouldChangeDirection:!1};if('loopback'===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?(n=t-Math.abs(i),n<0&&('none'!==e&&s>1?'infinite'===e||(n=s+n,n<0&&(n=s-1)):n=0)):i<0&&(n=t+Math.abs(i),n>=s&&('none'!==e&&s>1?'infinite'===e||(n-=s,n>=s&&(n=0)):n=s-1)),l('LOOP','Swipe navigation:',{currentIndex:t,skipCount:i,mode:e,totalVisibleCards:s,nextIndex:n}),n}}class Vt{constructor(t){this.card=t}getBehavior(){return this.card.ii.swipe_behavior||'single'}calculateSkipCount(t,i,e,s){if('single'===s)return 1;let n;if('carousel'===(this.card.ii.view_mode||'single')){const t=this.card.ii.cards_visible||this.card.ai(),i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;n=(this.card.slideWidth-(t-1)*i)/t}else n='horizontal'===this.card.Qt?this.card.slideWidth:this.card.slideHeight;const o=Math.max(1,Math.round(i/n));if(t>.8){let s=1;t>.8&&(s=2),t>1.5&&(s=3),t>2.5&&(s=4);const a=Math.max(s,o);return l('SWIPE','Quick swipe detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),velocityBasedSkip:s,distanceBasedSkip:o,result:a}),Math.min(a,Math.min(4,e-1))}return l('SWIPE','Controlled drag detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),distanceBasedSkip:o}),Math.min(o,e-1)}calculateAnimationDuration(t){const i=this.card.visibleCardIndices.length;if(i<=3){const i=Math.min(800+500*(t-1),2400);return l('SWIPE','Animation duration (few cards):',t,'cards,',i+'ms'),i}const e=200*(t-1),s=Math.min(1200+50*i,2e3),n=Math.min(600+e,s);return l('SWIPE','Animation duration (many cards):',{skipCount:t,totalCards:i,baseDuration:600,extraDuration:e,maxDuration:s,finalDuration:n+'ms'}),n}getEasingFunction(t){return 1===t?'ease-out':'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}}const zt={slide:{name:'Slide',easing:'ease-out',description:'Default smooth slide transition'},bounce:{name:'Bounce',easing:'cubic-bezier(0.68, -0.55, 0.265, 1.55)',description:'Elastic bounce with overshoot'},spring:{name:'Spring',easing:'cubic-bezier(0.175, 0.885, 0.32, 1.275)',description:'Gentle spring effect'},instant:{name:'Instant',easing:'linear',duration:0,description:'No animation, instant switch'},fade:{name:'Fade',easing:'ease-in-out',description:'Crossfade between cards',stackedMode:!0},flip:{name:'Flip',easing:'ease-in-out',description:'3D card flip',stackedMode:!0,use3D:!0},coverflow:{name:'Coverflow',easing:'ease-out',description:'3D coverflow effect',stackedMode:!0,use3D:!0},creative:{name:'Creative',easing:'cubic-bezier(0.25, 1, 0.5, 1)',description:'Slide with rotation and scale',stackedMode:!0},cards:{name:'Cards',easing:'ease-out',description:'Stacked cards effect',stackedMode:!0},reveal:{name:'Reveal',easing:'ease-out',description:'Wipe reveal transition',stackedMode:!0,usesClipPath:!0},zoom:{name:'Zoom',easing:'ease-out',description:'Zoom in/out transition',stackedMode:!0},swing:{name:'Swing',easing:'ease-in-out',description:'Swing door effect',stackedMode:!0,use3D:!0}};class Ft{constructor(t){this.card=t,this.Ze=!1,this.Ke=null}getEffect(){const t=this.card.ii.swipe_effect||'slide',i=zt[t]||zt.slide;return this.Qe(t,i)?i:zt.slide}getEffectName(){const t=this.card.ii.swipe_effect||'slide';return this.Qe(t,zt[t]||zt.slide)?t:'slide'}Qe(t,i){return'slide'===t||'carousel'!==(this.card.ii.view_mode||'single')&&(!i.stackedMode||'free'!==(this.card.ii.swipe_behavior||'single')&&'vertical'!==(this.card.ii.swipe_direction||'horizontal'))}getEasing(){if(this.card.isConnected){const t=getComputedStyle(this.card).getPropertyValue('--simple-swipe-card-transition-easing').trim();if(t)return t}return this.getEffect().easing}getCustomDuration(){const t=this.getEffect();return void 0!==t.duration?t.duration:null}isEffectAvailable(){const t=this.getEffect(),i=this.getEffectName();if('slide'===i)return!0;if('carousel'===(this.card.ii.view_mode||'single'))return this.ts&&this.ts===i||(l('EFFECTS',`Effect "${i}" is not available in carousel mode. Using "slide" effect instead.`),this.ts=i),!1;if(!t.stackedMode)return!0;const e=this.card.ii.swipe_direction||'horizontal';return'free'===(this.card.ii.swipe_behavior||'single')?(this.es&&this.es===i||(l('EFFECTS',`Effect "${i}" is not available with free swipe behavior. Using "slide" effect instead.`),this.es=i),!1):'vertical'!==e||(this.ss&&this.ss===i||(l('EFFECTS',`Effect "${i}" is not available in vertical swipe mode. Using "slide" effect instead.`),this.ss=i),!1)}usesStackedMode(){const t=this.getEffect();return!!this.isEffectAvailable()&&!0===t.stackedMode}uses3D(){const t=this.getEffect();return!!this.isEffectAvailable()&&!0===t.use3D}needsSlideTransforms(){return this.usesStackedMode()}initialize(){const t=this.getEffectName();this.Ke&&this.Ke!==t&&(this.resetEffects(),this.Ze=!1),this.Ke=t,this.usesStackedMode()?(this.ns(),this.uses3D()&&this.rs(),this.card.isConnected&&(this.ds(this.card.currentIndex),this.Ze=!0,l('EFFECTS',`Swipe effects initialized for ${t} mode`))):this.Ze=!0}applyStackedTransformToNewSlide(t,i){if(!this.usesStackedMode()||!this.Ze)return;t.style.gridColumn='1',t.style.gridRow='1';const e='infinite'===(this.card.ii.loop_mode||'none')&&this.card.visibleCardIndices.length>1?this.card.loopMode.getDuplicateCount():0,s=i-(this.card.currentIndex+e),n=this.getEffectName();t.style.transition='none',this.ls(t,s,n)}ns(){const t=this.card.sliderElement?.querySelectorAll('.slide');t&&(t.forEach(t=>{t.style.gridColumn='1',t.style.gridRow='1',t.style.opacity||(t.style.opacity='0'),t.style.zIndex||(t.style.zIndex='0')}),this.card.sliderElement&&(this.card.sliderElement.style.position='relative',this.card.sliderElement.style.overflow='hidden',this.card.sliderElement.style.display='grid',this.card.sliderElement.style.gridTemplateColumns='1fr',this.card.sliderElement.style.gridTemplateRows='1fr'),l('EFFECTS','Stacked layout setup complete'))}rs(){if(!this.card.cardContainer)return;this.card.cardContainer.style.perspective='1200px',this.card.cardContainer.style.perspectiveOrigin='center center',this.card.sliderElement&&(this.card.sliderElement.style.transformStyle='preserve-3d');const t=this.card.sliderElement?.querySelectorAll('.slide'),i=this.getEffectName();t?.forEach(t=>{t.style.transformStyle='preserve-3d',t.style.backfaceVisibility='flip'===i?'hidden':'visible'}),l('EFFECTS','3D container setup complete')}ds(t){const i=this.card.sliderElement?.querySelectorAll('.slide');if(!i||0===i.length)return;const e=this.getEffectName(),s=t+('infinite'===(this.card.ii.loop_mode||'none')&&this.card.visibleCardIndices.length>1?this.card.loopMode.getDuplicateCount():0);i.forEach((t,i)=>{const n=i-s;t.style.transition='none',this.ls(t,n,e)}),l('EFFECTS',`Applied immediate transforms, active index: ${t}`)}ls(t,i,e,s=null){const n=Math.abs(i),o=null!==s?s:i;switch(e){case'fade':this.hs(t,i,n);break;case'flip':this.cs(t,i,n,o);break;case'coverflow':this.ps(t,i,n,o);break;case'creative':this.us(t,i,n);break;case'cards':this.gs(t,i,n);break;case'reveal':this.fs(t,i,n,o);break;case'zoom':this.vs(t,i,n);break;case'swing':this.ws(t,i,n,o);break;default:t.style.opacity='',t.style.transform='',t.style.zIndex='',t.style.clipPath=''}}hs(t,i,e){e>1?(t.style.opacity='0',t.style.zIndex='0'):0===e?(t.style.opacity='1',t.style.zIndex='2'):(t.style.opacity=String(Math.max(0,1-e)),t.style.zIndex='1'),t.style.transform=''}cs(t,i,e,s=null){const n=-180*i;e>1?(t.style.opacity='0',t.style.transform='rotateY(0deg)',t.style.zIndex='0'):(t.style.opacity=e<.5?'1':'0',t.style.transform=`rotateY(${n}deg)`,t.style.zIndex=e<.5?'2':'1')}ps(t,i,e,s=null){if(e>2)return t.style.opacity='0',t.style.transform='',void(t.style.zIndex='0');const n=-45*i,o=40*i,a=100*-e,r=1-.15*e;t.style.opacity=String(Math.max(0,1-.3*e)),t.style.transform=`translateX(${o}%) translateZ(${a}px) rotateY(${n}deg) scale(${r})`,t.style.zIndex=String(10-Math.round(e))}us(t,i,e){if(e>2)return t.style.opacity='0',t.style.transform='',void(t.style.zIndex='0');const s=100*i,n=-15*i,o=1-.2*e;t.style.opacity=String(Math.max(0,1-.5*e)),t.style.transform=`translateX(${s}%) rotate(${n}deg) scale(${o})`,t.style.zIndex=String(10-Math.round(e))}gs(t,i,e){if(e>3)return t.style.opacity='0',t.style.transform='',void(t.style.zIndex='0');const s=i>0?100:10*i,n=i<=0?8*e:0,o=i<=0?1-.05*e:1,a=i<=0?2*i:0;t.style.opacity=String(Math.max(0,i<=0?1-.2*e:1)),t.style.transform=`translateX(${s}%) translateY(${n}px) scale(${o}) rotate(${a}deg)`,t.style.zIndex=String(10-Math.round(e))}fs(t,i,e,s=null){if(e>1)return t.style.opacity='0',t.style.transform='',t.style.clipPath='',void(t.style.zIndex='0');if(0===e)return t.style.opacity='1',t.style.clipPath='inset(0 0 0 0)',t.style.zIndex='2',void(t.style.transform='');const n=null!==s?s:i;if(n<=0&&i<0){const i=100*e;t.style.opacity='1',t.style.clipPath=`inset(0 ${i}% 0 0)`,t.style.zIndex='2'}else if(n>=0&&i>0){const i=100*e;t.style.opacity='1',t.style.clipPath=`inset(0 0 0 ${i}%)`,t.style.zIndex='2'}else t.style.opacity='1',t.style.clipPath='inset(0 0 0 0)',t.style.zIndex='1';t.style.transform=''}vs(t,i,e){if(e>1)return t.style.opacity='0',t.style.transform='scale(1)',void(t.style.zIndex='0');if(0===e)return t.style.opacity='1',t.style.transform='scale(1)',void(t.style.zIndex='2');if(i<0){const i=1-.3*e;t.style.opacity=String(Math.max(0,1-e)),t.style.transform=`scale(${Math.max(.7,i)})`,t.style.zIndex='1'}else{const i=.7+.3*(1-e);t.style.opacity=String(Math.max(0,1-e)),t.style.transform=`scale(${i})`,t.style.zIndex='2'}}ws(t,i,e,s=null){if(e>1)return t.style.opacity='0',t.style.transform='rotateY(0deg)',void(t.style.zIndex='0');if(0===e)return t.style.opacity='1',t.style.transform='rotateY(0deg)',t.style.transformOrigin='center center',void(t.style.zIndex='2');const n=null!==s?s:i;if(Math.abs(n)<.1){const s=90*i,n=i<0?'100%':'0%';t.style.opacity=String(Math.max(0,1-.5*e)),t.style.transform=`rotateY(${s}deg)`,t.style.transformOrigin=`${n} center`,t.style.zIndex='2'}else{const i=(n>0?-90:90)*e,s=n>0?'0%':'100%';t.style.opacity=String(Math.max(.5,1-.3*e)),t.style.transform=`rotateY(${i}deg)`,t.style.transformOrigin=`${s} center`,t.style.zIndex='1'}}applyEffect(t,i){if(!this.needsSlideTransforms())return;if(this.usesStackedMode()&&(this.ns(),this.uses3D()&&this.rs()),!i)return void this.ds(t);const e=this.card.sliderElement?.querySelectorAll('.slide');if(!e||0===e.length)return;const s=this.getEffectName(),n=t+('infinite'===(this.card.ii.loop_mode||'none')&&this.card.visibleCardIndices.length>1?this.card.loopMode.getDuplicateCount():0),o=this.bs(),a=this.getEasing(),r='reveal'===s?`transform ${o}ms ${a}, opacity ${o}ms ${a}, clip-path ${o}ms ${a}`:`transform ${o}ms ${a}, opacity ${o}ms ${a}`;e.forEach((t,e)=>{const o=e-n;t.style.transition=i?r:'none',this.ls(t,o,s)}),l('EFFECTS',`Applied ${s} effect, active index: ${t}, animate: ${i}`)}applySwipeProgress(t,i){if(!this.needsSlideTransforms())return;const e=this.card.sliderElement?.querySelectorAll('.slide');if(!e||0===e.length)return;const s=this.getEffectName(),n=i+('infinite'===(this.card.ii.loop_mode||'none')?this.card.loopMode.getDuplicateCount():0);e.forEach((i,e)=>{i.style.transition='none';const o=e-n;this.ls(i,o+t,s,o)})}getSliderTransform(t){return this.usesStackedMode()?'translate3d(0, 0, 0)':null}resetEffects(){const t=this.card.sliderElement?.querySelectorAll('.slide');t&&t.forEach(t=>{t.style.opacity='',t.style.transform='',t.style.transition='',t.style.transformOrigin='',t.style.transformStyle='',t.style.backfaceVisibility='',t.style.zIndex='',t.style.position='',t.style.top='',t.style.left='',t.style.width='',t.style.height='',t.style.gridColumn='',t.style.gridRow='',t.style.clipPath=''}),this.card.cardContainer&&(this.card.cardContainer.style.perspective='',this.card.cardContainer.style.perspectiveOrigin=''),this.card.sliderElement&&(this.card.sliderElement.style.transformStyle='',this.card.sliderElement.style.position='',this.card.sliderElement.style.overflow='',this.card.sliderElement.style.display='',this.card.sliderElement.style.gridTemplateColumns='',this.card.sliderElement.style.gridTemplateRows=''),this.Ze=!1,l('EFFECTS','Reset all slide effects')}resetOpacity(){this.resetEffects()}bs(){const t=this.getCustomDuration();if(null!==t)return t;if(!this.card.isConnected)return 300;const i=getComputedStyle(this.card).getPropertyValue('--simple-swipe-card-transition-speed').trim();return i&&i.endsWith('s')?1e3*parseFloat(i):i&&i.endsWith('ms')?parseFloat(i):300}}class Ut{constructor(t){this.card=t,this.Is=null,this.ys=null,this.Ss=0,this.Es=null,this.xs=null,this.Ts=null,this.Cs=null,this.$s=null,this.Ms=0}getStrategy(){return this.card.ii?.scroll_strategy||'js'}isNative(){return'css'===this.getStrategy()}Os(){return'carousel'===this.card.ii?.view_mode&&'center'===this.card.ii?.carousel_alignment}scrollToIndex(t,i=!0){const e=this.card.sliderElement;if(!e)return;const s=e.querySelectorAll('.slide')[t];if(!s)return;const n='horizontal'===this.card.Qt,o=i?'smooth':'auto',a=this.Os();if(i&&(this.Ss=Date.now()+600),n){let t=s.offsetLeft;a&&(t-=(e.clientWidth-s.offsetWidth)/2),e.scrollTo({left:Math.max(0,t),behavior:o})}else{let t=s.offsetTop;a&&(t-=(e.clientHeight-s.offsetHeight)/2),e.scrollTo({top:Math.max(0,t),behavior:o})}}indexFromScroll(){const t=this.card.sliderElement;if(!t)return this.card.currentIndex||0;const i=t.querySelectorAll('.slide');if(!i.length)return 0;const e='horizontal'===this.card.Qt,s=this.Os(),n=e?t.scrollLeft:t.scrollTop,o=e?t.clientWidth:t.clientHeight;let a=0,r=1/0;return i.forEach((t,i)=>{let d=e?t.offsetLeft:t.offsetTop;s&&(d-=(o-(e?t.offsetWidth:t.offsetHeight))/2);const l=Math.abs(d-n);l<r&&(r=l,a=i)}),a}attach(){if(!this.isNative())return;const t=this.card.sliderElement;t&&(this.detach(),this.Is=()=>{this.ys||(this.ys=requestAnimationFrame(()=>{this.ys=null,this.As()}))},t.addEventListener('scroll',this.Is,{passive:!0}),this._s(t),l('SWIPE','ScrollStrategy: native scroll listener attached'))}detach(){const t=this.card.sliderElement;t&&this.Is&&t.removeEventListener('scroll',this.Is),this.Is=null,this.ys&&(cancelAnimationFrame(this.ys),this.ys=null),this.Ns(t)}_s(t){t&&!this.Es&&(this.Es=t=>this.ks(t),this.xs=t=>this.Ds(t),this.Ts=()=>this.Rs(),this.Cs=t=>{Date.now()<this.Ms&&(t.stopPropagation(),t.preventDefault(),this.Ms=0)},t.addEventListener('pointerdown',this.Es),t.addEventListener('click',this.Cs,{capture:!0}))}Ns(t){t&&this.Es&&(t.removeEventListener('pointerdown',this.Es),t.removeEventListener('click',this.Cs,{capture:!0})),window.removeEventListener('pointermove',this.xs),window.removeEventListener('pointerup',this.Ts),window.removeEventListener('pointercancel',this.Ts),this.Es=null,this.xs=null,this.Ts=null,this.Cs=null,this.$s=null}ks(t){if('mouse'!==t.pointerType||0!==t.button)return;if(this.Ls(t))return;const i=this.card.sliderElement;if(!i)return;const e='horizontal'===this.card.Qt;this.$s={startX:t.clientX,startY:t.clientY,startScroll:e?i.scrollLeft:i.scrollTop,horizontal:e,moved:0,active:!1},window.addEventListener('pointermove',this.xs),window.addEventListener('pointerup',this.Ts),window.addEventListener('pointercancel',this.Ts)}Ds(t){const i=this.$s;if(!i)return;const e=t.clientX-i.startX,s=t.clientY-i.startY;if(i.moved=Math.max(i.moved,Math.abs(e),Math.abs(s)),!i.active){if(i.moved<8)return;i.active=!0;const t=this.card.sliderElement;t.style.scrollSnapType='none',t.style.cursor='grabbing',t.style.userSelect='none'}t.preventDefault();const n=this.card.sliderElement,o=i.horizontal?e:s;i.horizontal?n.scrollLeft=i.startScroll-o:n.scrollTop=i.startScroll-o}Rs(){const t=this.$s;if(this.$s=null,window.removeEventListener('pointermove',this.xs),window.removeEventListener('pointerup',this.Ts),window.removeEventListener('pointercancel',this.Ts),!t)return;const i=this.card.sliderElement;if(!t.active||!i)return;i.style.cursor='',i.style.userSelect='',i.style.scrollSnapType='',this.Ms=Date.now()+300;const e=this.indexFromScroll();this.card.currentIndex=e,this.scrollToIndex(e,!0),this.card.pagination?.update(!1),this.card.stateSynchronization?.onCardNavigate(e)}Ls(t){const i=t.composedPath?.()||[];for(const t of i){if(t===this.card.sliderElement)break;const i=t.tagName?.toLowerCase();if(i&&(e.includes(i)||n.includes(i)||['input','textarea','select','option','a'].includes(i)))return!0}return!1}As(){if(!this.card.initialized||this.card.building)return;const t=this.indexFromScroll();t!==this.card.currentIndex&&(this.card.currentIndex=t,this.card.pagination?.update(!1),this.card.stateSynchronization?.onCardNavigate(t)),Date.now()<this.Ss||!this.card.ii.enable_reset_after||this.card.autoSwipe?.isInProgress||this.card.resetAfter?.isInProgress||(this.card.resetAfter?.startTimer(),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3))}}class Bt{constructor(t){this.card=t,this.Ps=new Set,this.Hs={},this.Vs=['reset_target_card','auto_swipe_interval','reset_after_timeout','state_entity']}async initialize(){return l('TEMPLATE','Template evaluator initialized (built-in)'),!0}isJinjaTemplate(t){return'string'==typeof t&&(t.includes('{{')&&t.includes('}}')||t.includes('{%')&&t.includes('%}'))}isJsTemplate(t){return'string'==typeof t&&/\[{3}[\s\S]*\]{3}/.test(t)}isTemplate(t){return'string'==typeof t&&(this.isJinjaTemplate(t)||this.isJsTemplate(t))}get isAvailable(){return!0}evalJsTemplate(t,i){if(!this.isJsTemplate(t))return t;const e=t.trim().match(/^\[{3}([\s\S]*)\]{3}$/);if(!e)return t;const s=e[1];try{const e=new Function('states','user','hass',`'use strict'; ${s}`)(i.states,i.user,i);return l('TEMPLATE','JS Template evaluated:',t.substring(0,50)+'...','->',e),e}catch(i){const e=t.length<=100?t.trim():`${t.trim().substring(0,98)}...`;return l('ERROR',`JS Template error in '${e}':`,i.message),console.error('SimpleSwipeCard JS Template Error:',i),t}}scanConfig(t){this.Ps.clear(),this.Hs={};for(const i of this.Vs){const e=t[i];this.isTemplate(e)&&(this.Ps.add(i),this.Hs[i]=e,l('TEMPLATE',`Found template in ${i}:`,e))}this.Ps.size>0&&l('TEMPLATE',`Config contains ${this.Ps.size} template option(s)`)}hasTemplates(){return this.Ps.size>0}getTemplateOptions(){return Array.from(this.Ps)}evaluateTemplate(t,i){if(!i)return l('TEMPLATE','Cannot evaluate template - no hass object'),t;if(!this.isTemplate(t))return t;if(this.isJsTemplate(t))return this.evalJsTemplate(t,i);try{const e=t.match(/\{\{\s*(.+?)\s*\}\}/);if(!e)return t;const s=e[1].trim(),n=this.zs(s,i);return l('TEMPLATE',`Evaluated "${t}" => "${n}"`),n}catch(i){return l('TEMPLATE',`Error evaluating template "${t}":`,i.message),t}}zs(t,i){if(this.Fs(t))return this.Us(t,i);const e=t.split('|').map(t=>t.trim());let s=this.Bs(e[0],i);for(let t=1;t<e.length;t++)s=this.Ws(s,e[t],i);return s}Fs(t){return/\sif\s/.test(t)&&/\selse\s/.test(t)}Us(t,i){const e=t.match(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/);if(!e)return l('TEMPLATE','Failed to parse conditional expression:',t),t;const s=e[1].trim(),n=e[2].trim(),o=e[3].trim();l('TEMPLATE','Conditional parsed:',{trueValue:s,condition:n,falseValue:o});const a=this.Ys(n,i);return l('TEMPLATE','Condition evaluated to:',a),this.zs(a?s:o,i)}Ys(t,i){const e=['>=','<=','==','!=','>','<'];for(const s of e){const e=t.indexOf(s);if(-1!==e){const n=t.substring(0,e).trim(),o=t.substring(e+s.length).trim(),a=this.zs(n,i),r=this.zs(o,i),d=parseFloat(a),h=parseFloat(r),c=!isNaN(d)&&!isNaN(h);switch(l('TEMPLATE',`Comparing: ${a} ${s} ${r} (numeric: ${c})`),s){case'>=':return c?d>=h:a>=r;case'<=':return c?d<=h:a<=r;case'==':return c?d==h:a==r;case'!=':return c?d!=h:a!=r;case'>':return c?d>h:a>r;case'<':return c?d<h:a<r}}}const s=this.zs(t,i);return'off'!==s&&'unavailable'!==s&&'unknown'!==s&&('on'===s||Boolean(s))}Bs(t,i){if(t.includes('now()'))return this.js(t);const e=t.match(/states\s*\(\s*['"]([^'"]+)['"]\s*\)/);if(e){const t=e[1],s=i.states[t];return s?s.state:(l('TEMPLATE',`Entity not found: ${t}`),'unknown')}const s=t.match(/state_attr\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);if(s){const t=i.states[s[1]];return t&&t.attributes?t.attributes[s[2]]:void 0}const n=t.match(/is_state\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);if(n){const t=i.states[n[1]];return t&&t.state===n[2]}if(/^[\d\s+\-*/().]+$/.test(t))try{return this.Gs(t)}catch{return t}if(/^\d+$/.test(t))return parseInt(t,10);const o=t.match(/^(['"])(.*)(\1)$/);return o?o[2]:t}js(t){const i=new Date;if(t.includes('.weekday()')){const e=i.getDay(),s=0===e?6:e-1,n=t.match(/\.weekday\(\)\s*([+\-*/])\s*(\d+)/);if(n){const t=n[1],i=parseInt(n[2],10);return this.Js(s,t,i)}return s}if(t.includes('.isoweekday()')){const e=i.getDay(),s=0===e?7:e,n=t.match(/\.isoweekday\(\)\s*([+\-*/])\s*(\d+)/);if(n){const t=n[1],i=parseInt(n[2],10);return this.Js(s,t,i)}return s}return t.includes('.day')?i.getDate():t.includes('.month')?i.getMonth()+1:t.includes('.year')?i.getFullYear():t.includes('.hour')?i.getHours():t.includes('.minute')?i.getMinutes():i.getTime()}Js(t,i,e){switch(i){case'+':return t+e;case'-':return t-e;case'*':return t*e;case'/':return 0!==e?t/e:t;default:return t}}Gs(t){const i=t.replace(/[^0-9+\-*/().]/g,'');if(i!==t.replace(/\s/g,''))throw new Error('Invalid characters in expression');return Function(`"use strict"; return (${i})`)()}Ws(t,i,e){if('int'===i||i.startsWith('int(')){const e=parseInt(t,10);if(isNaN(e)){const t=i.match(/int\s*\(\s*(\d+)\s*\)/);return t?parseInt(t[1],10):0}return e}if('float'===i||i.startsWith('float(')){const e=parseFloat(t);if(isNaN(e)){const t=i.match(/float\s*\(\s*([\d.]+)\s*\)/);return t?parseFloat(t[1]):0}return e}const s=i.match(/round\s*\(\s*(\d+)\s*\)/);if(s||'round'===i){const i=s?parseInt(s[1],10):0,e=parseFloat(t);return isNaN(e)?t:Number(e.toFixed(i))}if('abs'===i){const i=parseFloat(t);return isNaN(i)?t:Math.abs(i)}const n=i.match(/default\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/);return n?null==t||''===t?n[1]:t:'string'===i||'str'===i?String(t):(l('TEMPLATE',`Unknown filter: ${i}`),t)}getEvaluatedValue(t,i){if(!this.Ps.has(t))return;const e=this.Hs[t];if(!e)return;const s=this.evaluateTemplate(e,i);return this.qs(t,s)}qs(t,i){if(['reset_target_card','auto_swipe_interval','reset_after_timeout'].includes(t)){const e=parseInt(i,10);if(isNaN(e))return l('TEMPLATE',`Warning: ${t} template evaluated to non-numeric value: ${i}`),null;switch(t){case'reset_target_card':return Math.max(1,e);case'auto_swipe_interval':return Math.max(500,e);case'reset_after_timeout':return Math.max(5e3,e);default:return e}}return i}isTemplateOption(t){return this.Ps.has(t)}getReferencedEntities(){const t=new Set,i=/(?:states|is_state|state_attr|has_value)\s*\(\s*['"]([\w.]+)['"]/g;for(const e of Object.values(this.Hs)){if('string'!=typeof e)continue;let s;for(;null!==(s=i.exec(e));)t.add(s[1])}return t.size>0&&l('TEMPLATE','Found referenced entities in templates:',Array.from(t)),t}clearCache(){}}class SimpleSwipeCard extends ft{constructor(){l('INIT','SimpleSwipeCard Constructor starting...');try{super(),l('INIT','SimpleSwipeCard Constructor invoked.'),this.ii={},this.Ai=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.ye=!0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.Fi=!1,this.ji=!1,this.Me=null,this.Wi=0,this.resizeObserver=null,this.Qt='horizontal',this.ni=void 0,this.Xs=void 0,this.Ni=null,this.Zs=null,this.Ks=null,this.Qs=null,this.swipeGestures=new St(this),this.autoSwipe=new Et(this),this.resetAfter=new xt(this),this.pagination=new Tt(this),this.cardBuilder=new Dt(this),this.stateSynchronization=new Rt(this),this.carouselView=new Pt(this),this.loopMode=new Ht(this),this.swipeBehavior=new Vt(this),this.swipeEffects=new Ft(this),this.scrollStrategy=new Ut(this),this.autoHeight=new Lt(this),this.templateEvaluator=new Bt(this),this.tn=null,this.en=null,this.sn=null,this.nn=null,window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[]),this.an=this.an.bind(this),this.rn=this.rn.bind(this),this.dn=this.dn.bind(this),l('INIT','SimpleSwipeCard Constructor completed successfully.')}catch(t){throw console.error('SimpleSwipeCard: Constructor failed with error:',t),t}}async firstUpdated(){if(l('LIFECYCLE','firstUpdated called for wrapper card'),await this.templateEvaluator.initialize(),!this.ln&&void 0!==this.ii?.cards){this.ln=!0,l('INIT','firstUpdated: Initializing build.');try{if(this.ii.cards&&0!==this.ii.cards.length?(await Promise.resolve(),await new Promise(t=>requestAnimationFrame(t))):await new Promise(t=>{requestAnimationFrame(()=>{requestAnimationFrame(t)})}),!this.isConnected)return l('LIFECYCLE','Card disconnected during deferred build wait - will retry on connect'),void(this.ln=!1);if(this.initialized)return void l('LIFECYCLE','Card already initialized during deferred build wait - skipping');if(l('INIT',`Deferred build starting with ${this.ii.cards.length} cards`),!1===await this.cardBuilder.build())return void l('LIFECYCLE','Build was skipped in firstUpdated (likely disconnected) - will retry on connect');this.isConnected&&this.cardContainer&&(l('LIFECYCLE','Build finished in firstUpdated, setting up features'),this.hn())}catch(t){console.error('SimpleSwipeCard: Build failed in firstUpdated:',t),l('ERROR','Build failed, card may not function properly')}}}static async getConfigElement(){return l('SYSTEM','SimpleSwipeCard.getConfigElement called'),await customElements.whenDefined('simple-swipe-card-editor'),document.createElement('simple-swipe-card-editor')}static getStubConfig(){return l('SYSTEM','SimpleSwipeCard.getStubConfig called'),{type:'custom:simple-swipe-card',cards:[]}}setConfig(t){try{if(!t)throw new Error('Invalid configuration');l('EDITOR','Editor setConfig received:',JSON.stringify(t));const i=this.ii?.cards?.length||0,e=this.ii?.scroll_strategy;if(this.ii=JSON.parse(JSON.stringify(t)),this.cn(),Array.isArray(this.ii.cards)||(this.ii.cards=[]),void 0===this.ii.show_pagination&&(this.ii.show_pagination=!0),void 0===this.ii.auto_hide_pagination)this.ii.auto_hide_pagination=0;else{const t=parseInt(this.ii.auto_hide_pagination);this.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.ii.card_spacing)this.ii.card_spacing=15;else{const t=parseInt(this.ii.card_spacing);this.ii.card_spacing=isNaN(t)||t<0?15:t}void 0!==this.ii.scroll_strategy&&['js','css'].includes(this.ii.scroll_strategy)||(this.ii.scroll_strategy='js');const s='css'===this.ii.scroll_strategy;if(void 0!==this.ii.enable_loopback&&void 0===this.ii.loop_mode&&(this.ii.loop_mode=this.ii.enable_loopback?'loopback':'none',delete this.ii.enable_loopback,l('CONFIG','Migrated enable_loopback to loop_mode:',this.ii.loop_mode)),void 0===this.ii.loop_mode&&(this.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.ii.loop_mode)||(l('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.ii.loop_mode),this.ii.loop_mode='none'),s&&'none'!==this.ii.loop_mode&&(this.ii.loop_mode='none',l('CONFIG','loop_mode forced to \'none\' for css scroll strategy')),this.loopMode?.initialize(),void 0!==this.ii.swipe_direction&&['horizontal','vertical'].includes(this.ii.swipe_direction)||(this.ii.swipe_direction='horizontal'),void 0!==this.ii.swipe_effect&&['slide','bounce','spring','instant','fade','flip','coverflow','creative','cards','reveal','zoom','swing'].includes(this.ii.swipe_effect)||(this.ii.swipe_effect='slide'),s&&'slide'!==this.ii.swipe_effect&&(this.ii.swipe_effect='slide',l('CONFIG','swipe_effect forced to \'slide\' for css scroll strategy')),'vertical'!==this.ii.swipe_direction||t.grid_options?this.removeAttribute('data-vertical-no-grid'):this.setAttribute('data-vertical-no-grid',''),this.closest('hui-card-preview')||this.closest('hui-card-element-editor')?this.setAttribute('data-editor-mode',''):this.removeAttribute('data-editor-mode'),!0===this.ii.enable_backdrop_filter?this.setAttribute('data-enable-backdrop-filter',''):this.removeAttribute('data-enable-backdrop-filter'),void 0===this.ii.swipe_behavior&&(this.ii.swipe_behavior='single'),['single','free'].includes(this.ii.swipe_behavior)?'free'===this.ii.swipe_behavior&&'infinite'!==this.ii.loop_mode&&(this.ii.swipe_behavior='single',l('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.ii.swipe_behavior='single',void 0===this.ii.auto_height&&(this.ii.auto_height=!1),!0===this.ii.auto_height&&('carousel'===this.ii.view_mode||'vertical'===this.ii.swipe_direction||'infinite'===this.ii.loop_mode||s)&&(delete this.ii.auto_height,l('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, infinite loop, or css scroll strategy)')),void 0===this.ii.enable_auto_swipe&&(this.ii.enable_auto_swipe=!1),void 0===this.ii.auto_swipe_interval?this.ii.auto_swipe_interval=2e3:(this.ii.auto_swipe_interval=parseInt(this.ii.auto_swipe_interval),(isNaN(this.ii.auto_swipe_interval)||this.ii.auto_swipe_interval<500)&&(this.ii.auto_swipe_interval=2e3)),void 0===this.ii.enable_reset_after&&(this.ii.enable_reset_after=!1),void 0===this.ii.reset_after_timeout?this.ii.reset_after_timeout=3e4:this.templateEvaluator.isTemplate(this.ii.reset_after_timeout)||(this.ii.reset_after_timeout=parseInt(this.ii.reset_after_timeout),(isNaN(this.ii.reset_after_timeout)||this.ii.reset_after_timeout<5e3)&&(this.ii.reset_after_timeout=3e4)),void 0===this.ii.reset_target_card?this.ii.reset_target_card=1:this.templateEvaluator.isTemplate(this.ii.reset_target_card)||(this.ii.reset_target_card=Math.max(1,parseInt(this.ii.reset_target_card)||1)),void 0===this.ii.view_mode&&(this.ii.view_mode='single'),['single','carousel'].includes(this.ii.view_mode)||(this.ii.view_mode='single'),'carousel'===this.ii.view_mode){if(void 0===this.ii.card_min_width)this.ii.card_min_width=200;else{const t=parseInt(this.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.ii.card_min_width=200)}if(void 0!==this.ii.cards_visible){const t=parseFloat(this.ii.cards_visible);this.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}['start','center'].includes(this.ii.carousel_alignment)||(this.ii.carousel_alignment='start')}t.card_mod?(l('CARD_MOD','Card-mod configuration detected',t.card_mod),this.Ni=JSON.parse(JSON.stringify(t.card_mod))):this.Ni=null,this.Qt=this.ii.swipe_direction,this.pn=this.ii.view_mode||'single',delete this.ii.title,this.autoHeight?.initialize(),this.templateEvaluator.scanConfig(this.ii);const n=this.ii.cards.length;this.initialized&&this.isConnected&&0===i&&n>0&&(l('CONFIG',`Cards added after initial build (0 -> ${n}) - triggering rebuild`),requestAnimationFrame(()=>{this.isConnected&&this.initialized&&this.cardBuilder.build()})),this.initialized&&this.isConnected&&void 0!==e&&e!==this.ii.scroll_strategy&&(l('CONFIG',`scroll_strategy changed (${e} -> ${this.ii.scroll_strategy}) - triggering rebuild`),requestAnimationFrame(()=>{this.isConnected&&this.initialized&&this.cardBuilder.build()})),this.requestUpdate(),l('CONFIG','setConfig completed successfully')}catch(t){throw l('ERROR','setConfig failed with error:',t),t}}ai(){let t=this.cardContainer?.offsetWidth||0;if(t<=0&&this.slideWidth>0&&(t=this.slideWidth,l('LOOP','Container width not available, using last known width:',t)),t<=0)return l('LOOP','Container width not available, using default cards_visible: 2.5'),2.5;const i=this.ii.card_min_width||200,e=Math.max(0,parseInt(this.ii.card_spacing))||0;return Math.max(1.1,Math.round((t+e)/(i+e)*10)/10)}ne(){l('VISIBILITY','Handling conditional card visibility change'),this.un&&clearTimeout(this.un),this.un=setTimeout(()=>{this.gn(),this.un=null},150)}gn(){if(!this.ii?.cards||!this.Ai){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||l('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=It(t.visibility,this.Ai);let s=!0;if('conditional'===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(l('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.fn(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Gi(){if(!this.ii?.cards||!this.Ai){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||l('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];if(this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=It(t.visibility,this.Ai);let s=!0;'conditional'===t.type&&t.conditions&&(s=this.mn(t.conditions));let n=!0;if(this.cards&&this.cards[i]?.element){const t=this.cards[i].element;t.classList?.contains('hidden')&&(n=!1,l('VISIBILITY',`Card ${i} has 'hidden' class from child card's own visibility logic`))}e&&s&&n&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)){if(l('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.fn(t),this.building||!this.initialized)return void l('VISIBILITY','Skipping visibility rebuild during initial setup to prevent flicker');this.vn()}}mn(t){return!t||!Array.isArray(t)||0===t.length||!this.Ai||t.every(t=>{try{return this.wn(t)}catch(i){return l('VISIBILITY','Error evaluating conditional card condition:',t,i),!0}})}wn(t){if(!t||'object'!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:a}=t,r=i||(!e||void 0===s&&void 0===n?null:'state')||(!e||void 0===o&&void 0===a?null:'numeric_state');switch(r){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return l('VISIBILITY','Conditional card AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return l('VISIBILITY','Conditional card AND condition has empty \'conditions\' array'),!0;const i=t.conditions.every(t=>{try{return this.wn(t)}catch(i){return l('VISIBILITY','Error evaluating nested conditional card AND condition:',t,i),!1}});return l('VISIBILITY',`Conditional card AND condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return l('VISIBILITY','Conditional card OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return l('VISIBILITY','Conditional card OR condition has empty \'conditions\' array'),!1;const i=t.conditions.some(t=>{try{return this.wn(t)}catch(i){return l('VISIBILITY','Error evaluating nested conditional card OR condition:',t,i),!1}});return l('VISIBILITY',`Conditional card OR condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'not':if(!t.condition)return l('VISIBILITY','Conditional card NOT condition missing \'condition\' property'),!1;try{const i=this.wn(t.condition),e=!i;return l('VISIBILITY',`Conditional card NOT condition result: ${e} (nested was ${i})`),e}catch(i){return l('VISIBILITY','Error evaluating nested conditional card NOT condition:',t.condition,i),!1}case'state':{if(!e||!this.Ai.states[e])return l('VISIBILITY',`Entity ${e} not found for conditional card state condition`),!1;const t=this.Ai.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return l('VISIBILITY',`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return l('VISIBILITY',`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case'numeric_state':{if(!e||!this.Ai.states[e])return l('VISIBILITY',`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.Ai.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==a&&(i=i&&t<parseFloat(a)),l('VISIBILITY',`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return l('VISIBILITY',`Conditional card screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const i=this.Ai.user;if(i&&i.id){const e=t.users.includes(i.id);return l('VISIBILITY',`Conditional card user condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(l('VISIBILITY','Unknown or invalid conditional card condition:',t),!1):(l('VISIBILITY',`Unknown conditional card condition type: ${r}`),!0)}}vn(){this.bn&&clearTimeout(this.bn),this.bn=setTimeout(()=>{this.initialized&&this.isConnected&&!this.building?(l('VISIBILITY','Performing debounced rebuild due to visibility changes'),this.cardBuilder.build()):this.building&&(l('VISIBILITY','Build in progress - queueing rebuild'),this.Fi=!0),this.bn=null},300)}fn(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=this.visibleCardIndices.indexOf(t[this.currentIndex]);if(-1!==i)this.currentIndex=i,l('VISIBILITY',`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,l('VISIBILITY',`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),l('VISIBILITY',`Adjusted to maintain relative position: ${this.currentIndex}`))}}In(){this.yn&&clearTimeout(this.yn),this.yn=setTimeout(()=>{this.Gi(),this.yn=null},200)}Sn(){if(!this.ii?.cards)return!1;const t=i=>!!Array.isArray(i)&&i.some(i=>'time'===i.condition||!(!i.conditions||!Array.isArray(i.conditions))&&t(i.conditions));return this.ii.cards.some(i=>i.visibility&&t(i.visibility))}hn(){this.En||(this.Sn()?(l('VISIBILITY','Starting time visibility timer (5s interval)'),this.En=setInterval(()=>{this.isConnected&&this.Ai&&(l('VISIBILITY','Time visibility timer tick - checking conditions'),this.Gi())},5e3)):l('VISIBILITY','No time conditions found, skipping timer'))}xn(){this.En&&(l('VISIBILITY','Stopping time visibility timer'),clearInterval(this.En),this.En=null)}Tn(t){l('ERROR',`${t}`),this.ii={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}Cn(){l('CONFIG','Updating child card configs'),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.ii.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){l('CONFIG','Updating config for visible card',i,'original index',t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}$n(){if(l('CONFIG','Updating layout options (pagination, spacing, direction)'),this.Qt!==this.ii.swipe_direction)return this.Qt=this.ii.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.Ni&&this.ki()}set hass(t){if(!t)return;const i=this.Ai;if(i===t)return;this.Ai=t;const e=!i||i.states!==t.states,s=!i||i.localize!==t.localize||i.themes!==t.themes||i.language!==t.language,n=e&&this.Mn(i,t);return this.si?(l('LOOP','Skipping hass-triggered visibility update during seamless jump'),void((e||s)&&this.On(t))):this.building?(l('VISIBILITY','Skipping visibility update during build to prevent rebuild flicker'),n&&(this.ji=!0),void((e||s)&&this.On(t))):(n&&(l('HASS','Our relevant entities changed - updating visibility'),this.yn&&(clearTimeout(this.yn),this.yn=null),this.Gi()),e&&this.stateSynchronization.onHassChange(i,t),void((e||s)&&this.On(t)))}Mn(t,i){if(!t||!t.states||!i.states)return!0;const e=this.An();if(0===e.length)return!1;for(const s of e){const e=t.states[s],n=i.states[s];if(!e!=!n)return l('HASS',`Our entity ${s} added/removed`),!0;if(e&&n&&(e.state!==n.state||e.last_changed!==n.last_changed))return l('HASS',`Our entity ${s} state changed: ${e.state} -> ${n.state}`),!0}return!1}An(){if(this.Ks&&this.Qs===this._n())return this.Ks;const t=new Set;if(this.ii.state_entity){const i=this.ii.state_entity;if(this.templateEvaluator?.isTemplate(i)){const i=this.templateEvaluator.getEvaluatedValue('state_entity',this.Ai);i&&'string'==typeof i&&t.add(i)}else t.add(i)}return this.ii.cards&&Array.isArray(this.ii.cards)&&this.ii.cards.forEach(i=>{i.visibility&&Array.isArray(i.visibility)&&i.visibility.forEach(i=>{i.entity&&t.add(i.entity)}),'conditional'===i.type&&i.conditions&&Array.isArray(i.conditions)&&i.conditions.forEach(i=>{i.entity&&t.add(i.entity)})}),this.templateEvaluator?.hasTemplates()&&this.templateEvaluator.getReferencedEntities().forEach(i=>t.add(i)),this.Ks=Array.from(t),this.Qs=this._n(),this.Ks.length>0&&l('HASS',`Tracking ${this.Ks.length} entities for visibility/state sync:`,this.Ks),this.Ks}_n(){if(!this.ii||!this.ii.cards)return'';const t=[this.ii.cards.length,this.ii.state_entity||'',this.ii.cards.filter(t=>t.visibility?.length>0).length,this.ii.cards.filter(t=>'conditional'===t.type&&t.conditions?.length>0).length,this.templateEvaluator?.getTemplateOptions().join(',')||''];return t.join('|')}cn(){this.Ks=null,this.Qs=null,l('HASS','Cleared our relevant entities cache')}getEvaluatedConfigValue(t,i){const e=this.ii[t];if(null==e)return i;if(this.templateEvaluator?.isTemplate(e)&&this.templateEvaluator.isAvailable&&this.Ai){const e=this.templateEvaluator.getEvaluatedValue(t,this.Ai);return null!=e?e:(l('TEMPLATE',`Template evaluation failed for ${t}, using default: ${i}`),i)}return e}On(t){this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error('Error setting hass on child card:',t)}})}connectedCallback(){if(super.connectedCallback(),l('LIFECYCLE','connectedCallback - simplified for wrapper card'),this.si&&(l('INIT','Clearing stuck seamless jump flag on connect'),this.si=!1),this.addEventListener('config-changed',this.an.bind(this)),this.ii&&this.ii.cards&&this.ii.cards.length>0&&(!this.cardContainer||!this.initialized))return l('LIFECYCLE',`Card needs build (cardContainer: ${!!this.cardContainer}, initialized: ${this.initialized}) - triggering build`),requestAnimationFrame(()=>{this.isConnected&&(l('LIFECYCLE','Executing deferred build after reconnection'),this.cardBuilder.build().then(()=>{this.isConnected&&(l('LIFECYCLE','Deferred build completed successfully'),this.Ni&&(l('CARD_MOD','Reapplying card-mod styles after deferred build'),this.ki(),this.xe()),this.hn())}).catch(t=>{console.error('SimpleSwipeCard: Deferred build failed:',t)}))}),void l('LIFECYCLE','connectedCallback finished (deferred build scheduled)');this.cards&&this.cards.length>0&&!this.cardContainer&&this.ii?(l('LIFECYCLE','Detected reconnection scenario - rebuilding card'),this.cardBuilder.build().then(()=>{this.isConnected&&(l('LIFECYCLE','Reconnection build completed'),this.Ni&&(l('CARD_MOD','Reapplying card-mod styles after reconnection build'),this.ki(),this.xe()),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()}),this.hn())}).catch(t=>{console.error('SimpleSwipeCard: Reconnection build failed:',t),l('ERROR','Reconnection build failed, swipe may not work')})):this.initialized&&this.cardContainer&&(l('LIFECYCLE','connectedCallback: Handling reconnection with intact DOM'),this.sliderElement?.isConnected&&'0'===this.sliderElement.style.opacity&&!this.building&&(l('LIFECYCLE','Slider still hidden on reconnect - finishing layout'),this.cardBuilder.finishBuildLayout(this.Ui)),this.Se(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.Ni&&(this.ki(),this.xe()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage(),l('LIFECYCLE','Re-creating pagination after reconnection'),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()}),this.hn()),l('LIFECYCLE','connectedCallback finished')}disconnectedCallback(){super.disconnectedCallback(),l('INIT','disconnectedCallback - Enhanced cleanup starting'),this.building&&(l('INIT','Disconnecting during active build - aborting build'),this.building=!1),this.si&&(l('INIT','Clearing stuck seamless jump flag on disconnect'),this.si=!1),this.removeEventListener('config-changed',this.an.bind(this));try{this.Nn(),this.kn(),this.Dn(),this.Rn(),this.Ln(),this.Pn()}catch(t){console.warn('Error during cleanup:',t)}this.initialized=!1,l('INIT','disconnectedCallback - Enhanced cleanup completed')}Nn(){['_visibilityRebuildTimeout','_conditionalVisibilityTimeout','_visibilityUpdateTimeout','_revealWatchdogTimeout','_layoutRetryCount'].forEach(t=>{this[t]&&(clearTimeout(this[t]),this[t]=null,l('INIT',`Cleared timeout: ${t}`))}),this.xn()}kn(){try{this.Hn(),this.swipeGestures&&(this.swipeGestures.removeGestures(),this.swipeGestures.bt=!1,this.swipeGestures.Ct=!1),this.scrollStrategy?.detach(),this.autoSwipe&&(this.autoSwipe.stop(),this.autoSwipe.pi=null,this.autoSwipe.gi=null),this.resetAfter&&(this.resetAfter.stopTimer(),this.resetAfter.Ii=null),this.stateSynchronization&&this.stateSynchronization.stop(),this.autoHeight&&this.autoHeight.cleanup(),l('INIT','Feature managers cleaned up (state preserved)')}catch(t){console.warn('Error cleaning up feature managers:',t)}}Dn(){this.cardContainer=null,this.sliderElement=null,this.Xi(),this.re&&(this.re.disconnect(),this.re=null,l('MUSHROOM','Mushroom-select observer cleaned up')),this.we&&(this.we.disconnect(),this.we=null),Array.isArray(this.he)&&(this.he.forEach(t=>t.disconnect()),this.he=[],l('DROPDOWN','Mini-media-player dropdown observers cleaned up')),this.ce=null,this.pagination&&this.pagination.paginationElement&&(this.pagination.paginationElement=null),l('INIT','DOM references and observers cleaned up (cards preserved)')}Rn(){if(this.Zs)try{this.Zs.disconnect(),this.Zs=null,l('CARD_MOD','Card-mod observer cleaned up')}catch(t){console.warn('Error cleaning up card-mod observer:',t)}}Pn(){this.swipeGestures&&this.swipeGestures.Nt&&(clearTimeout(this.swipeGestures.Nt),this.swipeGestures.Nt=null,this.swipeGestures.kt=!1),this.loopMode&&this.loopMode.Je&&(clearTimeout(this.loopMode.Je),this.loopMode.Je=null,this.si=!1),this.Vn(),l('INIT','Remaining event listeners cleared')}an(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.zn||(l('EVENT','Root element received config-changed event:',t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&l('ELEMENT','Caught element editor event, allowing normal propagation'))}rn(t){if(!this.ii.enable_auto_swipe)return;const i=t.composedPath();if(!i.includes(this))return;const e=i[0];l('INPUT',`Focus event detected - e.target: ${t.target.tagName}, actualTarget: ${e.tagName}, isContentEditable: ${e.isContentEditable}`),('INPUT'===e.tagName||'TEXTAREA'===e.tagName||'SELECT'===e.tagName||e.isContentEditable)&&(l('INPUT',`Text input focused (${e.tagName||'contenteditable'}) - pausing auto-swipe indefinitely`),this.autoSwipe.pause(36e5))}dn(t){if(!this.ii.enable_auto_swipe)return;const i=t.composedPath();if(!i.includes(this))return;const e=i[0];l('INPUT',`Blur event detected - e.target: ${t.target.tagName}, actualTarget: ${e.tagName}, isContentEditable: ${e.isContentEditable}`),('INPUT'===e.tagName||'TEXTAREA'===e.tagName||'SELECT'===e.tagName||e.isContentEditable)&&(l('INPUT',`Text input blurred (${e.tagName||'contenteditable'}) - resuming auto-swipe`),this.autoSwipe.gi&&(clearTimeout(this.autoSwipe.gi),this.autoSwipe.gi=null),this.autoSwipe.ui=!1,this.autoSwipe.start())}ee(){this.sn?l('INPUT','Input listeners already set up, skipping'):(l('INPUT','Setting up input focus/blur listeners for auto-swipe pause on document'),this.sn=this.rn,this.nn=this.dn,document.addEventListener('focusin',this.sn,!0),document.addEventListener('focusout',this.nn,!0),l('INPUT','Input listeners successfully attached to document'))}Vn(){this.sn&&(document.removeEventListener('focusin',this.sn,!0),this.sn=null),this.nn&&(document.removeEventListener('focusout',this.nn,!0),this.nn=null),l('INPUT','Cleaned up input focus/blur listeners from document')}Se(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;l('INIT','Setting up resize observer.');let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(l('INIT','Resize detected, recalculating layout.',{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i())},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{l('INIT','Removing resize observer.'),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,()=>this.recalculateLayout()),this.Fn=()=>{setTimeout(()=>this.recalculateLayout(),100)},this.Un=()=>{this.recalculateLayout()},window.addEventListener('orientationchange',this.Fn),window.addEventListener('resize',this.Un))}Hn(){this.resizeObserver?.cleanup&&(this.resizeObserver.cleanup(),this.resizeObserver=null),this.Fn&&(window.removeEventListener('orientationchange',this.Fn),this.Fn=null),this.Un&&(window.removeEventListener('resize',this.Un),this.Un=null)}recalculateLayout(){if(!this.cardContainer||!this.isConnected)return;const t=this.cardContainer.offsetWidth,i=this.cardContainer.offsetHeight;(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(l('SYSTEM','Recalculating layout due to resize.',{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.slideWidth=t,this.slideHeight=i,'carousel'===this.ii?.view_mode&&this.cardBuilder?this.cardBuilder.recalculateCarouselLayout():(this.ye||(this.style.setProperty('--single-slide-width',`${t}px`),this.sliderElement&&this.sliderElement.querySelectorAll('.slide:not(.carousel-mode)').forEach(i=>{i.style.width=`${t}px`,i.style.minWidth=`${t}px`,i.style.flexBasis=`${t}px`})),this.updateSlider(!1)))}ti(t){const i=this.swipeEffects?.getCustomDuration();if(0===i)return'none';const e=this.swipeEffects?.getEasing();return function(t,i=null,e=null){if(!t)return'none';if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return'none';let s='0.3s',n=e||'ease-out';if(i&&i.isConnected){const t=getComputedStyle(i),o=t.getPropertyValue('--simple-swipe-card-transition-speed').trim(),a=t.getPropertyValue('--simple-swipe-card-transition-easing').trim();o&&(s=o),!e&&a&&(n=a)}return`transform ${s} ${n}`}(t,this,e)}ki(){!function(t,i,e,s,n){if(t&&i){if(t.style){l('CARD_MOD','Applying card-mod styles');const o=document.createElement('style');let a;if(o.setAttribute('id','card-mod-styles'),'string'==typeof t.style)a=t.style,l('CARD_MOD','Using direct string format');else{if('object'!=typeof t.style||!t.style['.'])return void l('CARD_MOD','Unknown card-mod style format, skipping');a=t.style['.'],l('CARD_MOD','Using object format with \'.\' key')}o.textContent=a;const r=i.querySelector('#card-mod-styles');if(r)try{i.removeChild(r)}catch(t){l('CARD_MOD','Error removing existing style:',t)}try{if(!i||!i.appendChild)return void l('ERROR','shadowRoot is invalid for appendChild operation');i.appendChild(o)}catch(t){return void l('ERROR','Failed to append card-mod styles:',t)}if(e){l('CARD_MOD','Forwarding CSS variables from host to shadow DOM');try{const t=window.getComputedStyle(e),o=[i.querySelector('.card-container'),s,n].filter(Boolean),a=['--simple-swipe-card-pagination-dot-inactive-color','--simple-swipe-card-pagination-dot-active-color','--simple-swipe-card-pagination-dot-inactive-opacity','--simple-swipe-card-pagination-dot-active-opacity','--simple-swipe-card-pagination-dot-size','--simple-swipe-card-pagination-dot-active-size','--simple-swipe-card-pagination-border-radius','--simple-swipe-card-pagination-dot-spacing','--simple-swipe-card-pagination-background','--simple-swipe-card-pagination-padding','--simple-swipe-card-pagination-bottom','--simple-swipe-card-pagination-right','--simple-swipe-card-transition-speed','--simple-swipe-card-transition-easing','--simple-swipe-card-pagination-fade-duration','--simple-swipe-card-pagination-animation-type','--simple-swipe-card-pagination-animation-delay','--simple-swipe-card-pagination-animation-easing'];for(let t=1;t<=15;t++)a.push(`--simple-swipe-card-pagination-dot-slide${t}-color`,`--simple-swipe-card-pagination-dot-slide${t}-active-color`);o.forEach(i=>{i&&a.forEach(e=>{try{const s=t.getPropertyValue(e);s&&(l('CARD_MOD',`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))}catch(t){l('CARD_MOD',`Error forwarding ${e}:`,t)}})})}catch(t){l('ERROR','Error forwarding CSS variables:',t)}}}}else l('CARD_MOD','No card-mod config or shadow root, skipping style application')}(this.Ni,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}xe(){this.Zs&&(this.Zs.disconnect(),this.Zs=null),this.Zs=function(t,i){const e=new MutationObserver(t=>{t.some(t=>'attributes'===t.type&&('style'===t.attributeName||t.attributeName.includes('style')))&&(l('CARD_MOD','Host style attribute changed, reapplying card-mod styles'),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:['style']}),l('CARD_MOD','Set up mutation observer for style changes')),e}(this.shadowRoot,()=>{this.ki()})}Ee(){this.tn&&(this.tn.disconnect(),this.tn=null),this.sliderElement&&this.cards&&0!==this.cards.length&&(l('VISIBILITY','Setting up child visibility observer for cards with self-managed visibility'),this.tn=new MutationObserver(t=>{let i=!1;for(const e of t)if('attributes'===e.type&&'class'===e.attributeName){const t=e.target,s=t.classList?.contains('hidden'),n=e.oldValue?.includes('hidden');if(s!==n){i=!0,l('VISIBILITY','Child card visibility changed via \'hidden\' class:',t.tagName);break}}i&&(this.en&&clearTimeout(this.en),this.en=setTimeout(()=>{this.isConnected&&!this.building?(l('VISIBILITY','Triggering visibility update after child card visibility change'),this.Gi()):this.building&&(this.ji=!0),this.en=null},150))}),this.cards.forEach(t=>{t.element&&this.tn.observe(t.element,{attributes:!0,attributeFilter:['class'],attributeOldValue:!0})}))}Xi(){this.tn&&(this.tn.disconnect(),this.tn=null),this.en&&(clearTimeout(this.en),this.en=null)}goToSlide(t,i=1,e=!0){this.je=i;const s=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===s||!this.initialized||this.building)return void l('SWIPE','goToSlide skipped',{totalVisible:s,initialized:this.initialized,building:this.building});const n=this.ii.view_mode||'single',o=this.ii.loop_mode||'none';t=this.loopMode.handleNavigation(t,'carousel'===n),this.currentIndex=t,l('SWIPE',`Going to visible slide ${this.currentIndex} (${n} mode)`);const a='infinite'===o?(this.currentIndex%s+s)%s:this.currentIndex;this.stateSynchronization?.onCardNavigate(a),this.updateSlider(e),this.autoHeight?.updateForCurrentCard(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.ii.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){if(this.cardContainer){const t=0===this.slideWidth||0===this.slideHeight;if(t||300===this.slideWidth&&100===this.slideHeight){const i=this.cardContainer.offsetWidth,e=this.cardContainer.offsetHeight;i>0&&e>0&&(this.slideWidth=i,this.slideHeight=e,l('SWIPE','Recalculated dimensions in updateSlider:',{width:this.slideWidth,height:this.slideHeight,reason:t?'uninitialized':'fallback'}))}}const i=this.visibleCardIndices.length;if(l('SWIPE',`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.ii.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void l('SWIPE','updateSlider skipped',{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});if(this.scrollStrategy?.isNative()){const i=Math.max(0,parseInt(this.ii.card_spacing))||0;return this.sliderElement.style.gap=`${i}px`,$t(this.cards),this.scrollStrategy.scrollToIndex(this.currentIndex,t),this.pagination.update(t),void(this.je=1)}const e=Math.max(0,parseInt(this.ii.card_spacing))||0,s=this.ii.loop_mode||'none';if('carousel'===(this.ii.view_mode||'single')&&this.carouselView){this.sliderElement.style.gap=`${e}px`;let i=t?null:0;if(t&&'free'===this.ii.swipe_behavior&&this.je>1){i=this.swipeBehavior.calculateAnimationDuration(this.je);const t=this.swipeBehavior.getEasingFunction(this.je);this.sliderElement.style.transition=`transform ${i}ms ${t}`,l('SWIPE',`Carousel multi-card animation: ${this.je} cards, ${i}ms duration, easing: ${t}`)}return this.carouselView.updateSliderPosition(this.currentIndex,t),this.swipeEffects?.applyEffect(this.currentIndex,t),this.pagination.update(t),this.je=1,void(t&&(i>0||null===i)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,i))}const n='horizontal'===this.Qt;let o=this.currentIndex;if('infinite'===s&&i>1){const t=this.loopMode.getDuplicateCount();o=this.currentIndex+t,l('SWIPE',`Infinite mode: logical index ${this.currentIndex} -> DOM position ${o}`)}else'none'!==s&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),o=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let a=0;a=n?o*(this.slideWidth+e):o*(this.slideHeight+e);let r=null;if(t&&'free'===this.ii.swipe_behavior&&this.je>1){r=this.swipeBehavior.calculateAnimationDuration(this.je);const t=this.swipeBehavior.getEasingFunction(this.je);this.sliderElement.style.transition=`transform ${r}ms ${t}`,l('SWIPE',`Multi-card animation: ${this.je} cards, ${r}ms duration, easing: ${t}`)}else this.sliderElement.style.transition=this.ti(t);const d=this.swipeEffects?.getSliderTransform(t);if(this.sliderElement.style.transform=d||(this.ye?`translate${n?'X':'Y'}(calc(${-o} * (100% + ${e}px)))`:n?`translateX(-${a}px)`:`translateY(-${a}px)`),!n)if(t){this.Bn&&clearTimeout(this.Bn);let t=300;if(r&&r>0)t=r;else if(this.sliderElement.isConnected){const i=getComputedStyle(this.sliderElement).getPropertyValue('--simple-swipe-card-transition-speed').trim();i&&i.endsWith('s')?t=1e3*parseFloat(i):i&&i.endsWith('ms')&&(t=parseFloat(i))}this.sliderElement.classList.add('animating'),this.Bn=setTimeout(()=>{this.sliderElement.classList.remove('animating'),this.Wn(o),this.Bn=null},t)}else this.sliderElement.classList.remove('animating'),this.Wn(o);$t(this.cards),this.pagination.update(t),this.je=1,l('SWIPE',`Slider updated, DOM position: ${o}, transform: -${a}px along ${n?'X':'Y'} axis`),this.swipeEffects?.applyEffect(this.currentIndex,t),t&&(r>0||null===r)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,r)}Yn(t){this.pagination.paginationElement&&this.pagination.paginationElement.querySelectorAll('.pagination-dot').forEach((i,e)=>{i.classList.toggle('active',e===t)})}Wn(t){if(!this.sliderElement)return;const i=this.sliderElement.querySelectorAll('.slide');0!==i.length&&(i.forEach((i,e)=>{e===t?i.classList.add('active-slide'):i.classList.remove('active-slide')}),l('SWIPE',`Active slide updated: position ${t}`))}Ce(){this.shadowRoot&&(l('DROPDOWN','Setting up dropdown detection'),this.jn=0,this.Gn=t=>{const i=t.target;t.composedPath().includes(this)&&(l('DROPDOWN',`Dropdown opened: ${i.tagName}`,i),this.me())},this.Jn=t=>{const i=t.target;t.composedPath().includes(this)&&(l('DROPDOWN',`Dropdown closed: ${i.tagName}`,i),this.ve())},document.addEventListener('opened',this.Gn,!0),document.addEventListener('closed',this.Jn,!0),document.addEventListener('MDCMenuSurface:opened',this.Gn,!0),document.addEventListener('MDCMenuSurface:closed',this.Jn,!0),this.qn=new MutationObserver(t=>{t.forEach(t=>{t.addedNodes.forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&('MWC-MENU'===t.tagName||'HA-SELECT'===t.tagName||'MUSHROOM-SELECT'===t.tagName||t.classList?.contains('mdc-menu-surface')||t.classList?.contains('mdc-select__menu'))&&t.open&&(l('DROPDOWN','Dropdown element added to DOM and opened',t),this.me())}),t.removedNodes.forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&('MWC-MENU'===t.tagName||'HA-SELECT'===t.tagName||'MUSHROOM-SELECT'===t.tagName||t.classList?.contains('mdc-menu-surface')||t.classList?.contains('mdc-select__menu'))&&(l('DROPDOWN','Dropdown element removed from DOM',t),this.ve())})})}),this.qn.observe(this.shadowRoot,{childList:!0,subtree:!0}),l('DROPDOWN','Dropdown detection setup complete'))}Ln(){l('DROPDOWN','Cleaning up dropdown detection'),this.Gn&&(document.removeEventListener('opened',this.Gn,!0),document.removeEventListener('closed',this.Jn,!0),document.removeEventListener('MDCMenuSurface:opened',this.Gn,!0),document.removeEventListener('MDCMenuSurface:closed',this.Jn,!0),this.Gn=null,this.Jn=null),this.qn&&(this.qn.disconnect(),this.qn=null),this.jn=0,this.classList.remove('dropdown-open'),l('DROPDOWN','Dropdown detection cleanup complete')}me(){this.jn++,1===this.jn&&(this.classList.add('dropdown-open'),l('DROPDOWN','Elevated z-index - dropdown opened'))}ve(){this.jn=Math.max(0,this.jn-1),0===this.jn&&(this.classList.remove('dropdown-open'),l('DROPDOWN','Restored z-index - all dropdowns closed'))}getCardSize(){if(0===this.visibleCardIndices.length)return 3;if(this.building){if(this.ii.min_height){const t=Math.ceil(parseInt(this.ii.min_height)/50);return l('CONFIG','Building - estimated card size from min_height:',t),t}return l('CONFIG','Building - using default estimated size: 5'),5}let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&'function'==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn('Error getting card size from current element:',i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return l('CONFIG','Calculated card size:',t),Math.max(3,t)}getGridOptions(){const t={columns:12};return'vertical'!==this.ii?.swipe_direction||this.ii?.grid_options||(t.rows=4),t}}class Wt{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0},this.openIconPickers=new Set,this.Xn=null,this.Zn=null}cleanup(){this.Xn&&(clearTimeout(this.Xn),this.Xn=null),this.Zn&&(clearTimeout(this.Zn),this.Zn=null),l('EDITOR','EditorUIManager cleanup completed')}async initializeEditor(){this.editor.zn=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.Kn=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.Qn=this.editor.eventHandling.io.bind(this.editor.eventHandling),this.editor.eo=new Set,this.editor.so=null,this.editor.no=!1,this.editor.oo={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},At(o).set(this.editor.zn,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}toggleIconPicker(t){this.openIconPickers.has(t)?this.openIconPickers.delete(t):this.openIconPickers.add(t),this.editor.requestUpdate()}isIconPickerOpen(t){return this.openIconPickers.has(t)}async ensureComponentsLoaded(){let t=0;if(!customElements.get('hui-card-picker'))for(;!customElements.get('hui-card-picker')&&t<10;){try{if(await this.loadCustomElements(),customElements.get('hui-card-picker'))return}catch(t){}await new Promise(t=>setTimeout(t,100)),t++}}async loadCustomElements(){if(!customElements.get('hui-card-picker'))try{const t=[()=>customElements.get('hui-entities-card')?.getConfigElement?.(),()=>customElements.get('hui-conditional-card')?.getConfigElement?.(),()=>customElements.get('hui-vertical-stack-card')?.getConfigElement?.(),()=>customElements.get('hui-horizontal-stack-card')?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get('hui-card-picker'))break}catch(t){}}catch(t){}}ensureCardPickerLoaded(){this.editor.shadowRoot&&(this.Xn&&clearTimeout(this.Xn),this.Xn=setTimeout(()=>{this.ao(),this.Xn=null},100))}ao(){if(l('EDITOR','_ensureCardPickerLoaded called'),!this.editor.shadowRoot)return void l('EDITOR','shadowRoot not ready, skipping card picker load');const t=this.editor.shadowRoot.querySelector('#card-picker-container');if(!t)return void l('EDITOR','Card picker container not found, skipping');t.style.display='block',t.hasAttribute('event-barrier-applied')||(t.setAttribute('event-barrier-applied','true'),t.addEventListener('config-changed',t=>{this.ro(t)},{capture:!0,passive:!1}));const i=t.querySelector('hui-card-picker');i?(i.style.display='block',i.requestUpdate&&!i.do&&(i.requestUpdate(),i.do=!0)):l('EDITOR','hui-card-picker element not found in container'),this.lo()}ro(t){if(l('EDITOR','Intercepted config-changed at container level:',t.detail?.config?.type),t.target&&t.target.tagName&&'hui-card-picker'===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(l('EDITOR','Processing card selection:',i.type),this.editor.ii){const t=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[];t.push(i),this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.lo()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1}lo(){this.Zn||(this.Zn=setTimeout(()=>{this.editor.requestUpdate(),this.Zn=null},50))}}class Yt{constructor(t){this.editor=t,this.Zn=null}setConfig(t){if(!t)throw new Error('Invalid configuration');if(l('EDITOR','Editor setConfig received:',JSON.stringify(t)),this.editor.ii=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.ii.cards)||(this.editor.ii.cards=[]),void 0===this.editor.ii.show_pagination&&(this.editor.ii.show_pagination=!0),void 0===this.editor.ii.auto_hide_pagination)this.editor.ii.auto_hide_pagination=0;else{const t=parseInt(this.editor.ii.auto_hide_pagination);this.editor.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.editor.ii.card_spacing)this.editor.ii.card_spacing=15;else{const t=parseInt(this.editor.ii.card_spacing);this.editor.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.ii.enable_loopback&&void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode=this.editor.ii.enable_loopback?'loopback':'none',delete this.editor.ii.enable_loopback,l('CONFIG','Migrated enable_loopback to loop_mode:',this.editor.ii.loop_mode)),void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.editor.ii.loop_mode)||(l('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.editor.ii.loop_mode),this.editor.ii.loop_mode='none'),void 0!==this.editor.ii.swipe_direction&&['horizontal','vertical'].includes(this.editor.ii.swipe_direction)||(this.editor.ii.swipe_direction='horizontal'),void 0!==this.editor.ii.swipe_effect&&['slide','bounce','spring','instant','fade','flip','coverflow','creative','cards','reveal','zoom','swing'].includes(this.editor.ii.swipe_effect)||(this.editor.ii.swipe_effect='slide'),void 0!==this.editor.ii.scroll_strategy&&['js','css'].includes(this.editor.ii.scroll_strategy)||(this.editor.ii.scroll_strategy='js'),void 0===this.editor.ii.swipe_behavior&&(this.editor.ii.swipe_behavior='single'),['single','free'].includes(this.editor.ii.swipe_behavior)?'free'===this.editor.ii.swipe_behavior&&'infinite'!==this.editor.ii.loop_mode&&(this.editor.ii.swipe_behavior='single',l('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.editor.ii.swipe_behavior='single',void 0===this.editor.ii.auto_height&&(this.editor.ii.auto_height=!1),!0===this.editor.ii.auto_height&&('carousel'===this.editor.ii.view_mode||'vertical'===this.editor.ii.swipe_direction||'infinite'===this.editor.ii.loop_mode)&&(delete this.editor.ii.auto_height,l('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)')),void 0===this.editor.ii.enable_auto_swipe&&(this.editor.ii.enable_auto_swipe=!1),void 0===this.editor.ii.auto_swipe_interval?this.editor.ii.auto_swipe_interval=2e3:(this.editor.ii.auto_swipe_interval=parseInt(this.editor.ii.auto_swipe_interval),(isNaN(this.editor.ii.auto_swipe_interval)||this.editor.ii.auto_swipe_interval<500)&&(this.editor.ii.auto_swipe_interval=2e3)),void 0===this.editor.ii.enable_reset_after&&(this.editor.ii.enable_reset_after=!1),void 0===this.editor.ii.reset_after_timeout?this.editor.ii.reset_after_timeout=3e4:(this.editor.ii.reset_after_timeout=parseInt(this.editor.ii.reset_after_timeout),(isNaN(this.editor.ii.reset_after_timeout)||this.editor.ii.reset_after_timeout<5e3)&&(this.editor.ii.reset_after_timeout=3e4)),void 0===this.editor.ii.reset_target_card)this.editor.ii.reset_target_card=1;else{const t=this.editor.ii.reset_target_card;'string'==typeof t&&(t.includes('{{')||t.includes('{%')||t.includes('[[['))||(this.editor.ii.reset_target_card=Math.max(1,parseInt(t)||1))}if(void 0===this.editor.ii.view_mode&&(this.editor.ii.view_mode='single'),['single','carousel'].includes(this.editor.ii.view_mode)||(this.editor.ii.view_mode='single'),'carousel'===this.editor.ii.view_mode){if(void 0===this.editor.ii.card_min_width)this.editor.ii.card_min_width=200;else{const t=parseInt(this.editor.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.ii.card_min_width=200)}if(void 0!==this.editor.ii.cards_visible){const t=parseFloat(this.editor.ii.cards_visible);this.editor.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}['start','center'].includes(this.editor.ii.carousel_alignment)||(this.editor.ii.carousel_alignment='start')}delete this.editor.ii.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.ii||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute('data-option'),s=i.parentElement?.configValue||i.parentElement?.getAttribute('data-option'),n=e||s;if(!n)return;let o;if('ha-entity-picker'===i.localName&&'value-changed'===t.type?o=t.detail.value||null:'ha-switch'===i.localName?o=i.checked:'ha-slider'===i.localName?(o=i.value,null==o&&(o=t.detail?.value||0)):['ha-textfield','ha-input','input'].includes(i.localName)&&('number'===i.type||['card_spacing','auto_swipe_interval','card_min_width','cards_visible'].includes(n))?(o=parseFloat(t.detail&&'value'in t.detail?t.detail.value:i.value),(isNaN(o)||o<0)&&(o='card_spacing'===n?15:'auto_swipe_interval'===n?2e3:'reset_after_timeout'===n?3e4:'card_min_width'===n?200:'cards_visible'===n?2.5:0)):o=t.detail&&'value'in t.detail?t.detail.value:i.value,'auto_hide_pagination'===n&&(o=1e3*parseFloat(o),isNaN(o)||o<0?o=0:o>3e4&&(o=3e4),l('EDITOR',`Auto-hide pagination: ${o/1e3}s = ${o}ms`)),this.editor.ii[n]!==o){if('view_mode'===n){l('EDITOR',`View mode changing from ${this.editor.ii[n]} to ${o}`);const t={...this.editor.ii,[n]:o};return'carousel'===o?(delete t.swipe_direction,t.auto_height&&(delete t.auto_height,l('EDITOR','Removed auto_height (incompatible with carousel mode)')),t.cards_visible||t.card_min_width||(t.card_min_width=200),l('EDITOR','Cleaned config for carousel mode:',Object.keys(t))):'single'===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction='horizontal'),l('EDITOR','Cleaned config for single mode:',Object.keys(t))),this.editor.ii=t,this.fireConfigChanged(),void this.lo()}if('card_min_width'===n){if(l('EDITOR',`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.ii.cards_visible){const t={...this.editor.ii};delete t.cards_visible,t.card_min_width=o,this.editor.ii=t,l('EDITOR','Migrated from cards_visible to card_min_width')}else this.editor.ii={...this.editor.ii,[n]:o};return this.fireConfigChanged(),void this.lo()}if('view_mode'===n&&'carousel'===o||'swipe_direction'===n&&'vertical'===o||'loop_mode'===n&&'infinite'===o){l('EDITOR',`Mode change detected that affects auto_height: ${n} = ${o}`);const t={...this.editor.ii,[n]:o};return t.auto_height&&(delete t.auto_height,l('EDITOR',`Removed auto_height due to incompatible mode: ${n} = ${o}`)),this.editor.ii=t,this.fireConfigChanged(),void this.lo()}l('EDITOR',`Value changed for ${n}:`,o),this.editor.ii={...this.editor.ii,[n]:o},this.fireConfigChanged(),this.lo()}}lo(){this.Zn||(this.Zn=setTimeout(()=>{this.editor.requestUpdate(),this.Zn=null},50))}handleTimeoutChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=5&&(this.editor.ii={...this.editor.ii,reset_after_timeout:1e3*i},this.fireConfigChanged())}handleTargetChange(t){const i=t.target.value;if('string'==typeof i&&(i.includes('{{')||i.includes('{%')||i.includes('[[[')))this.editor.ii={...this.editor.ii,reset_target_card:i},this.fireConfigChanged();else{const t=parseInt(i);!isNaN(t)&&t>=1&&(this.editor.ii={...this.editor.ii,reset_target_card:t},this.fireConfigChanged())}}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&'single'!==t.view_mode&&(i.view_mode=t.view_mode),'carousel'===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width),'center'===t.carousel_alignment&&(i.carousel_alignment=t.carousel_alignment));const e={show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',swipe_effect:'slide',scroll_strategy:'js',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,enable_backdrop_filter:!1};return['card_spacing','scroll_strategy','swipe_direction','swipe_behavior','swipe_effect','show_pagination','auto_hide_pagination','auto_height'].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),['loop_mode','enable_auto_swipe','auto_swipe_interval','enable_reset_after','reset_after_timeout','reset_target_card','state_entity','enable_backdrop_filter'].forEach(s=>{'state_entity'===s?t.state_entity&&null!==t.state_entity&&''!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards),['grid_options','layout_options','view_layout'].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.ii);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent('config-changed',{detail:{config:i,...e},bubbles:s,composed:!0});l('EVENT','Firing config-changed event',{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.zn,fromSwipeCardEditor:!0,...t})}cleanup(){this.Zn&&(clearTimeout(this.Zn),this.Zn=null),l('EDITOR','EditorConfigManager cleanup completed')}}class jt{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:'Unknown',name:'',isPictureElements:!1};const i=t.type.startsWith('custom:')?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(' ');return{typeName:e,name:t.title||t.name||'',isPictureElements:'picture-elements'===i}}hasNestedCards(t){return!('custom:actions-card'!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&'picture-elements'===t.type}moveCard(t,i){if(!this.editor.ii?.cards)return;const e=[...this.editor.ii.cards],s=t+i;s<0||s>=e.length||(l('EDITOR',`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.ii?.cards||t<0||t>=this.editor.ii.cards.length)return;l('EDITOR',`Removing card at index ${t}`);const i=this.editor.ii.cards.filter((i,e)=>e!==t);this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const s=this.editor.ii.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;l('EDITOR',`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const a=[...this.editor.ii.cards];a[t]={...s,card:n},this.editor.ii={...this.editor.ii,cards:a},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const e=this.editor.ii.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;l('EDITOR',`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.ii.cards];n[t]={...e,card:s},this.editor.ii={...this.editor.ii,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(l('EDITOR',`_editCard called for index ${t}`),!this.editor.ii||!this.editor.ii.cards||t<0||t>=this.editor.ii.cards.length)return void l('ERROR','SimpleSwipeCardEditor: Invalid index for card editing:',t);const i=this.editor.ii.cards[t],e=i?.pagination_icon,s=this.editor.hass,n=document.querySelector('home-assistant');if(s&&n)try{await customElements.whenDefined('hui-dialog-edit-card');const o=document.createElement('hui-dialog-edit-card');o.hass=s,document.body.appendChild(o),this.editor.eo.add(o),o.ho=this.editor.zn,this.isPictureElementsCard(i)&&(o.setAttribute('data-editing-picture-elements','true'),o.co=!0),l('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const a=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,o),r=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);o.addEventListener('config-changed',a,{capture:!0}),o.addEventListener('show-dialog',r,{capture:!0}),o.addEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(o.addEventListener('element-updated',t=>{l('ELEMENT','Element updated event on dialog',t.detail),o.po=!0,this.editor.eventHandling.oo.active=!0,this.editor.eventHandling.oo.timestamp=Date.now()},{capture:!0}),o.addEventListener('show-edit-element',t=>{l('ELEMENT','Show edit element event on dialog',t.detail),o.po=!0,this.editor.eventHandling.oo.active=!0,this.editor.eventHandling.oo.timestamp=Date.now()},{capture:!0})),'custom:actions-card'===i.type&&(o.uo=!0);const d=()=>{if(l('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),o.removeEventListener('dialog-closed',d),o.removeEventListener('config-changed',a,{capture:!0}),o.removeEventListener('show-dialog',r,{capture:!0}),o.removeEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(o.removeEventListener('element-updated',h,{capture:!0}),o.removeEventListener('show-edit-element',c,{capture:!0})),this.editor.eo.delete(o),l('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.eo.size}`),o.po&&(l('ELEMENT','Element edit session reset due to dialog close'),setTimeout(()=>{this.editor.eventHandling.oo.active&&Date.now()-this.editor.eventHandling.oo.timestamp>500&&(this.editor.eventHandling.oo.active=!1)},500)),o.parentNode===document.body)try{document.body.removeChild(o),l('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};o.addEventListener('dialog-closed',d);const h=t=>{l('ELEMENT','Element updated event on dialog',t.detail),o.po=!0,this.editor.eventHandling.oo.active=!0,this.editor.eventHandling.oo.timestamp=Date.now()},c=t=>{l('ELEMENT','Show edit element event on dialog',t.detail),o.po=!0,this.editor.eventHandling.oo.active=!0,this.editor.eventHandling.oo.timestamp=Date.now()};this.isPictureElementsCard(i)&&(o.addEventListener('element-updated',h,{capture:!0}),o.addEventListener('show-edit-element',c,{capture:!0}));const p={cardConfig:i,lovelaceConfig:this.editor.lovelace||n.lovelace,saveCardConfig:async i=>{if(l('EDITOR',`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),o.fo||o.po){if(l('ELEMENT',`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),o.fo=!1,this.editor.eventHandling.oo.timestamp=Date.now(),i){l('ELEMENT','Silently updating config with element changes');const s=[...this.editor.ii.cards];s[t]=e?{...i,pagination_icon:e}:i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(o.mo&&!i)return l('ELEMENT',`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(o.mo=null);if(!i)return;const s=[...this.editor.ii.cards];s[t]=e?{...i,pagination_icon:e}:i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};l('EDITOR',`[CARD INDEX ${t}] About to call dialog.showDialog()`),await o.showDialog(p),l('EDITOR',`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(s){l('ERROR','SimpleSwipeCardEditor: Error opening edit dialog:',s),Ot(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||n.lovelace,saveCardConfig:async i=>{if(!i)return;const s=[...this.editor.ii.cards];s[t]=e?{...i,pagination_icon:e}:i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved_fallback'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else l('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}async editNestedCard(t,i){if(l('EDITOR',`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.ii?.cards||!this.editor.ii.cards[t]||!this.hasNestedCards(this.editor.ii.cards[t]))return void l('ERROR','SimpleSwipeCardEditor: Invalid indices for nested card editing:',t,i);const e=this.editor.ii.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,a=document.querySelector('home-assistant');if(o&&a)try{await customElements.whenDefined('hui-dialog-edit-card');const r=document.createElement('hui-dialog-edit-card');r.hass=o,document.body.appendChild(r),this.editor.eo.add(r),r.ho=this.editor.zn,this.isPictureElementsCard(n)&&(r.setAttribute('data-editing-picture-elements','true'),r.co=!0),r.addEventListener('config-changed',t=>{if(this.editor.eventHandling.vo(t))return l('ELEMENT','Nested card: Detected element editor event, allowing natural propagation'),r.po=!0,this.editor.eventHandling.oo.active=!0,this.editor.eventHandling.oo.timestamp=Date.now(),void(t.detail&&t.detail.config&&(r.mo=JSON.parse(JSON.stringify(t.detail.config)),r.fo=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(l('EDITOR','Marking nested event as already handled in _editNestedCard\'s dialog'),t.wo=!0)},!0);const d=()=>{if(r.removeEventListener('dialog-closed',d),r.po&&(l('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this.editor.eventHandling.oo.active=!1),this.editor.eo.delete(r),r.parentNode===document.body)try{document.body.removeChild(r)}catch(t){console.warn('Error removing nested card dialog:',t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};r.addEventListener('dialog-closed',d);const h={cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(r.fo||r.po){if(l('ELEMENT','Nested card: Save detected from element editor, preserving dialog state'),r.fo=!1,this.editor.eventHandling.oo.timestamp=Date.now(),n){l('ELEMENT','Silently updating nested card config with element changes');const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(r.mo&&!n)return l('ELEMENT','Nested card: Element editor cancel detected, restoring previous config'),void(r.mo=null);if(!n)return;l('EDITOR',`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const a={...e,card:o},d=[...this.editor.ii.cards];d[t]=a,this.editor.ii={...this.editor.ii,cards:d},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await r.showDialog(h)}catch(o){l('ERROR','SimpleSwipeCardEditor: Error opening edit dialog for nested card:',o),Ot(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else l('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}safelyAddCard(t){if(t&&this.editor.ii)try{const i=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],e={...this.editor.ii,cards:[...i,t]};this.editor.ii=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),l('EDITOR','Safely added card:',t.type)}catch(t){l('ERROR','Failed to safely add card:',t)}}handleCardPicked(t){if(l('EDITOR','Fallback _handleCardPicked called:',t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;l('EDITOR','Adding card in fallback handler:',i.type);const e=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],s={...this.editor.ii,cards:[...e,i]};this.editor.ii=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class Gt{constructor(t){this.editor=t,this.Qn=this.io.bind(this),this.oo={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},this.bo=0,this.Io=1e3}setupEventListeners(){document.addEventListener('config-changed',this.Qn,{capture:!0}),this.yo=t=>{if(this.vo(t)){if(l('ELEMENT','Config-changed event from element editor, allowing propagation'),t.target&&t.target.closest('hui-dialog-edit-card')){const i=t.target.closest('hui-dialog-edit-card');i&&(i.po=!0,this.oo.active=!0,this.oo.parentDialogId=i.ho||null,this.oo.timestamp=Date.now())}}else if('config-changed'===t.type&&t.detail?.config){const i='custom:actions-card'===t.detail?.config?.type;if('hui-card-picker'===t.target?.tagName?.toLowerCase()&&(t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(l('EDITOR','Card picker selection captured by global handler:',t.detail.config.type),i&&!this.editor.no))return this.editor.so={time:Date.now(),config:t.detail.config},this.editor.no=!0,this.editor.So(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}},document.addEventListener('config-changed',this.yo,{capture:!0}),this.Eo=t=>{if(t.xo)return l('EVENT','Intercepted iron-select event already processed by actions card editor'),void t.stopPropagation()},document.addEventListener('iron-select',this.Eo,{capture:!0}),this.To=t=>{if(t.target&&'HUI-DIALOG-EDIT-CARD'===t.target.tagName){const i=t.target;l('EDITOR','A HUI-DIALOG-EDIT-CARD closed',{tracked:this.editor.eo?.has(i)||!1,isActions:this.Co(i),handlingElementEdit:i.po}),i.po&&(l('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this.oo.active=!1,i.mo&&(l('ELEMENT','Preserving element config on dialog close'),this.oo.savedState=i.mo,i.mo=null)),this.editor.eo?.has(i)&&(this.editor.eo.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&('HUI-DIALOG-EDIT-ELEMENT'===t.target.tagName||'HUI-DIALOG'===t.target.tagName&&this.vo(t))&&(l('ELEMENT','Element editor dialog closed'),setTimeout(()=>{this.oo.active&&Date.now()-this.oo.timestamp>500&&(l('ELEMENT','Resetting element edit session after timeout'),this.oo.active=!1)},500))},document.addEventListener('dialog-closed',this.To,{capture:!0}),this.$o=t=>{'element-updated'!==t.type&&'show-edit-element'!==t.type||this.oo.active||(l('ELEMENT',`Capturing ${t.type} event, starting element edit session`),this.oo.active=!0,this.oo.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.oo.elementId=t.detail.elementId))},document.addEventListener('element-updated',this.$o,{capture:!0}),document.addEventListener('show-edit-element',this.$o,{capture:!0})}removeEventListeners(){document.removeEventListener('config-changed',this.yo,{capture:!0}),document.removeEventListener('iron-select',this.Eo,{capture:!0}),document.removeEventListener('config-changed',this.Qn,{capture:!0}),document.removeEventListener('dialog-closed',this.To,{capture:!0}),document.removeEventListener('element-updated',this.$o,{capture:!0}),document.removeEventListener('show-edit-element',this.$o,{capture:!0})}vo(t){if(!t)return!1;const i=Date.now(),e=i-this.bo>this.Io;if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return e&&(l('ELEMENT','Element editor detected through event detail'),this.bo=i),!0;const s=t.composedPath?t.composedPath():[];for(const t of s)if(t&&t.localName){if('hui-element-editor'===t.localName||'hui-dialog-edit-element'===t.localName||'hui-card-element-editor'===t.localName||t.localName.includes('element-editor'))return e&&(l('ELEMENT','Element editor detected through path node localName:',t.localName),this.bo=i),!0;if(t.Mo||t.Oo||t.getAttribute&&(t.getAttribute('element-id')||t.getAttribute('data-element-id'))||t.classList&&t.classList.contains('element-editor'))return l('ELEMENT','Element editor detected through specialized attributes'),!0;if('HUI-DIALOG'===t.tagName&&(t.querySelector('.element-editor')||t.Ao&&'string'==typeof t.Ao&&t.Ao.toLowerCase().includes('element')))return l('ELEMENT','Element editor detected through hui-dialog with element editor content'),!0}return'element-updated'===t.type||'config-changed'===t.type&&t.target&&('hui-element-editor'===t.target.localName||t.target.closest('hui-element-editor'))?(l('ELEMENT','Element editor detected through event characteristics'),!0):!!(this.oo.active&&Date.now()-this.oo.timestamp<5e3)&&(l('ELEMENT','Element editor event detected through active editing session'),!0)}Co(t){if(!t)return!1;if(t.uo)return!0;try{const i=t.cardConfig;return i&&'custom:actions-card'===i.type}catch(t){return!1}}io(t,i){let e,s;if(t&&'function'==typeof t.preventDefault?(e=t,s=null):(s=t,e=i),!e)return;if(s&&'auto_hide_pagination'===s.option)return;if(e.detail&&(e.detail.fromSwipeCardEditor||e.detail.fromElementEditor||e.detail.elementEditorEvent||e.detail.maintainEditorState))return void l('ELEMENT','Skipping our own generated event to prevent loop');if(this.vo(e)&&(l('ELEMENT','Detected element editor event in _handleNestedCardEvents'),e.composedPath&&this.editor.eo&&e.composedPath().some(t=>this.editor.eo.has(t)||t.ho&&t.ho===this.editor.zn)))return void l('ELEMENT','Element editor event is related to our dialog stack, handling specially');if(e._o||!e.detail?.fromActionCardEditor)return;const n=e.target.closest('[data-index]');if(!n||!this.editor.ii?.cards)return;const o=parseInt(n.getAttribute('data-index'));if(!(isNaN(o)||o<0||o>=this.editor.ii.cards.length)){if(l('EVENT',`Handling nested card event from actions card at index ${o}`,e.detail),e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.detail.maintainEditorState){l('EVENT','Event marked to maintain editor state, preventing propagation');const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type,maintainEditorState:!0})}else{const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type})}e._o=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(' > '):'No path',i=e.detail?JSON.stringify(e.detail,null,2):'{}';l('EVENT','Config change event details:',{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.vo(e)){if(l('ELEMENT',`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.po=!0,this.oo.active=!0,this.oo.timestamp=Date.now(),e.detail&&e.detail.config&&(i.mo=JSON.parse(JSON.stringify(e.detail.config)),i.fo=!0,i.co))try{l('ELEMENT','Silently updating picture-elements config');const i=[...this.editor.ii.cards];i[t]=e.detail.config,this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){l('ERROR','Error silently updating config:',t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;l('EDITOR',`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.ii.cards];s[t]=i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:'child_dialog_update_'+(e.detail.fromActionCardEditor?'action_card':'generic')}),this.editor.requestUpdate(),l('EDITOR',`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else l('EDITOR',`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&('hui-dialog-edit-element'===i.detail.dialogTag||i.detail.dialogTag.includes('element-editor'))||i.detail.elementToEdit)){l('ELEMENT',`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.po=!0),this.oo.active=!0,this.oo.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.oo.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):'{}';l('EDITOR',`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),l('EDITOR',`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),Ot(this.editor,i.type,i.detail)}}var Jt='M20.11,3.89L22,2V7H17L19.08,4.92C18.55,4.23 17.64,3.66 16.36,3.19C15.08,2.72 13.63,2.5 12,2.5C10.38,2.5 8.92,2.72 7.64,3.19C6.36,3.66 5.45,4.23 4.92,4.92L7,7H2V2L3.89,3.89C4.64,3 5.74,2.31 7.2,1.78C8.65,1.25 10.25,1 12,1C13.75,1 15.35,1.25 16.8,1.78C18.26,2.31 19.36,3 20.11,3.89M19.73,16.27V16.45L19,21.7C18.92,22.08 18.76,22.39 18.5,22.64C18.23,22.89 17.91,23 17.53,23H10.73C10.36,23 10,22.86 9.7,22.55L4.73,17.63L5.53,16.83C5.75,16.61 6,16.5 6.33,16.5H6.56L10,17.25V6.5C10,6.11 10.13,5.76 10.43,5.46C10.73,5.16 11.08,5 11.5,5C11.89,5 12.24,5.16 12.54,5.46C12.84,5.76 13,6.11 13,6.5V12.5H13.78C13.88,12.5 14.05,12.55 14.3,12.61L18.84,14.86C19.44,15.14 19.73,15.61 19.73,16.27Z';function qt({value:t,dataOption:i,options:e,valueChanged:s,disabled:n=!1}){return customElements.get('ha-dropdown-item')?Z`
      <ha-select
        .value=${t??''}
        data-option=${i}
        .options=${e}
        .disabled=${n}
        @selected=${s}
        @closed=${t=>t.stopPropagation()}
      ></ha-select>
    `:Z`
    <ha-select
      .value=${t??''}
      data-option=${i}
      .disabled=${n}
      @selected=${s}
      @change=${s}
      @closed=${t=>t.stopPropagation()}
    >
      ${e.map(t=>Z`
          <ha-list-item .value=${t.value}>
            ${t.label}
            ${t.iconPath?Z`<ha-svg-icon
                  slot="graphic"
                  class="direction-icon"
                  .path=${t.iconPath}
                ></ha-svg-icon>`:''}
          </ha-list-item>
        `)}
    </ha-select>
  `}function Xt({label:t,value:i,dataOption:e,type:s='text',min:n,max:o,step:a,suffix:r,required:d=!1,disabled:l=!1,pattern:h,autoValidate:c=!1,changeHandler:p,inputHandler:u,keydownHandler:g}){const f=!!customElements.get('ha-input'),m=!f&&!!customElements.get('ha-textfield');return f?Z`
      <ha-input
        label=${t}
        .value=${i??''}
        data-option=${vt(e)}
        type=${s}
        min=${vt(n)}
        max=${vt(o)}
        step=${vt(a)}
        suffix=${vt(r)}
        ?required=${d}
        ?disabled=${l}
        @value-changed=${p}
        @change=${p}
        @input=${u}
        @keydown=${g}
      ></ha-input>
    `:m?Z`
      <ha-textfield
        label=${t}
        .value=${i??''}
        data-option=${vt(e)}
        type=${s}
        min=${vt(n)}
        max=${vt(o)}
        step=${vt(a)}
        suffix=${vt(r)}
        pattern=${vt(h)}
        ?required=${d}
        ?disabled=${l}
        ?autoValidate=${c}
        @change=${p}
        @input=${u}
        @keydown=${g}
      ></ha-textfield>
    `:Z`
    <div class="native-textfield ${l?'disabled':''}">
      ${t?Z`<label class="native-textfield-label">${t}</label>`:''}
      <div class="native-textfield-row">
        <input
          class="native-textfield-input"
          .value=${i??''}
          data-option=${vt(e)}
          type=${s}
          min=${vt(n)}
          max=${vt(o)}
          step=${vt(a)}
          pattern=${vt(h)}
          ?required=${d}
          ?disabled=${l}
          @change=${p}
          @input=${u}
          @keydown=${g}
        />
        ${r?Z`<span class="native-textfield-suffix">${r}</span>`:''}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends ft{static get properties(){return{hass:{type:Object},ii:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return Mt()}constructor(){super(),l('EDITOR','SimpleSwipeCardEditor Constructor invoked.'),l('EDITOR','Editor styles method available:',!!this.constructor.styles),this.uiManager=new Wt(this),this.configManager=new Yt(this),this.cardManagement=new jt(this),this.eventHandling=new Gt(this),this.uiManager.initializeEditor()}vo(t){return this.eventHandling.vo(t)}Co(t){return this.eventHandling.Co(t)}No(t){return this.cardManagement.isPictureElementsCard(t)}ko(t){return this.cardManagement.hasVisibilityConditions(t)}Do(t){this.uiManager.toggleSection(t)}Ro(t){return this.cardManagement.hasNestedCards(t)}Lo(t){return this.cardManagement.getNestedCards(t)}Po(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}Ho(t,i){this.cardManagement.removeNestedCard(t,i)}async Vo(t,i){await this.cardManagement.editNestedCard(t,i)}async zo(t){await this.cardManagement.editCard(t)}Fo(t){this.cardManagement.handleCardPicked(t)}Uo(t){return this.cardManagement.getCardDescriptor(t)}Bo(t,i){this.cardManagement.moveCard(t,i)}Wo(t){this.cardManagement.removeCard(t)}Yo(t,i){if(!this.ii?.cards||t<0||t>=this.ii.cards.length)return;const e=[...this.ii.cards],s={...e[t]};i?s.pagination_icon=i:delete s.pagination_icon,e[t]=s,this.ii={...this.ii,cards:e},this.configManager.fireConfigChanged(),this.requestUpdate()}jo(t){this.uiManager.toggleIconPicker(t)}So(t){this.cardManagement.safelyAddCard(t)}Go(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager||(l('EDITOR','Reinitializing managers in setConfig'),this.uiManager=new Wt(this),this.configManager=new Yt(this),this.cardManagement=new jt(this),this.eventHandling=new Gt(this),this.uiManager.initializeEditor()),this.configManager.setConfig(t)}Jo(t){this.configManager.handleValueChanged(t)}qo(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.ii)return Z`<ha-spinner aria-label="Loading editor"></ha-spinner>`;if(!this.uiManager||!this.configManager||!this.cardManagement)return Z`<ha-spinner aria-label="Loading editor"></ha-spinner>`;const i=this.ii.cards||[];try{return Z`
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
          ${function(t,i){const e=t.view_mode||'single';return Z`
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

      ${'carousel'===e?Z`
            ${void 0!==t.cards_visible?Z`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${t.cards_visible}</span
                    >
                  </div>
                `:''}
            ${Xt({label:'Minimum Card Width (px)',value:(t.card_min_width||200).toString(),dataOption:'card_min_width',type:'number',min:'50',max:'500',step:'10',suffix:'px',required:!0,autoValidate:!0,changeHandler:i,keydownHandler:t=>{'Enter'===t.key&&(t.preventDefault(),t.stopPropagation(),t.target.blur())},inputHandler:t=>{const i=parseFloat(t.target.value);t.target.style.borderColor=i<50||i>500||isNaN(i)?'var(--error-color, #f44336)':''}})}
            <div class="help-text">
              ${void 0!==t.cards_visible?'Changing this value will switch to responsive mode and remove the cards_visible setting':'Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size.'}
            </div>

            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Alignment</div>
                <div class="option-help">
                  ${'center'===(t.carousel_alignment||'start')?'Active card centered, previous/next cards peek on both sides (enable a loop mode for peeks at the ends)':'Active card aligned to the left edge'}
                </div>
              </div>
              <div class="option-control">
                ${qt({value:t.carousel_alignment||'start',dataOption:'carousel_alignment',options:[{value:'start',label:'Start (left-aligned)'},{value:'center',label:'Centered (peek)'}],valueChanged:i})}
              </div>
            </div>
          `:''}
    </div>
  `}(this.ii,this.Jo.bind(this))}
          ${function(t,i){const e=!1!==t.show_pagination,s=t.swipe_direction||'horizontal',n=t.swipe_behavior||'single',o=t.view_mode||'single',a=!0===t.auto_height,r=t.scroll_strategy||'js',d='css'===r;return Z`
    <div class="section">
      <div class="section-header">Display Options</div>

      ${Xt({label:'Card Spacing (px)',value:(t.card_spacing??15).toString(),dataOption:'card_spacing',type:'number',min:'0',max:'100',suffix:'px',pattern:'[0-9]+',required:!0,autoValidate:!0,changeHandler:i})}
      <div class="help-text">Visual gap between cards</div>

      <!-- Scroll strategy: JS gestures (default) vs native CSS scroll-snap -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Scroll strategy</div>
          <div class="option-help">How swiping is powered</div>
        </div>
        <div class="option-control">
          ${qt({value:r,dataOption:'scroll_strategy',options:[{value:'js',label:'JavaScript (default)',iconPath:Jt},{value:'css',label:'Native CSS scroll-snap',iconPath:'M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z'}],valueChanged:i})}
        </div>
      </div>
      ${d?Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Native scroll-snap uses the browser's built-in scrolling for
                smoother performance on low-powered devices (e.g. wall panels).
                Swipe effects, loop modes, free swipe and auto height are not
                available in this mode and have been disabled.
              </span>
            </div>
          `:''}
      ${'single'===o?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                ${qt({value:s,dataOption:'swipe_direction',options:[{value:'horizontal',label:'Horizontal',iconPath:'M6,1L3,4L6,7V5H9V7L12,4L9,1V3H6V1M11,8A1,1 0 0,0 10,9V19L6.8,17.28H6.58C6.3,17.28 6.03,17.39 5.84,17.6L5.1,18.37L10,22.57C10.26,22.85 10.62,23 11,23H17.5A1.5,1.5 0 0,0 19,21.5V17.14C19,16.56 18.68,16.03 18.15,15.79L13.21,13.6L12,13.47V9A1,1 0 0,0 11,8Z'},{value:'vertical',label:'Vertical',iconPath:'M4,3L1,6H3V9H1L4,12L7,9H5V6H7L4,3M11,8A1,1 0 0,0 10,9V19L6.8,17.28H6.58C6.3,17.28 6.03,17.39 5.84,17.6L5.1,18.37L10,22.57C10.26,22.85 10.62,23 11,23H17.5A1.5,1.5 0 0,0 19,21.5V17.14C19,16.56 18.68,16.03 18.15,15.79L13.21,13.6L12,13.47V9A1,1 0 0,0 11,8Z'}],valueChanged:i})}
              </div>
            </div>
          `:Z`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${'single'!==o||'vertical'!==s||t.grid_options?'':Z`
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
            ${'single'!==o||'horizontal'!==s||'infinite'===t.loop_mode||d?'Not available in current mode':'Automatically adjust card height to match each card\'s content'}
          </div>
        </div>
        <div class="option-control">
          <ha-switch
            .checked=${a}
            data-option="auto_height"
            @change=${i}
            .disabled=${'single'!==o||'horizontal'!==s||'infinite'===t.loop_mode||d}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${a&&'carousel'===o?Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with carousel mode and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'vertical'===s?Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with vertical swiping and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'infinite'===t.loop_mode?Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `:''}
      ${a&&d?Z`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not available with Native scroll-snap and has
                been disabled.
              </span>
            </div>
          `:''}
      ${a&&void 0!==t.grid_options?.rows?Z`
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
      ${'infinite'===t.loop_mode?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                ${qt({value:n,dataOption:'swipe_behavior',options:[{value:'single',label:'Single card',iconPath:'M10,7V9H12V17H14V7H10M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z'},{value:'free',label:'Free swipe',iconPath:Jt}],valueChanged:i})}
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

      <!-- Swipe Effect selector - only available in single view + single swipe + horizontal -->
      ${'single'===o&&'single'===n&&'horizontal'===s?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe effect</div>
                <div class="option-help">Visual transition between cards</div>
              </div>
              <div class="option-control">
                ${qt({value:t.swipe_effect||'slide',dataOption:'swipe_effect',disabled:d,options:[{value:'slide',label:'Slide',iconPath:'M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z'},{value:'bounce',label:'Bounce',iconPath:'M6 14H9L5 18L1 14H4C4 11.3 5.7 6.6 11 6.1V8.1C7.6 8.6 6 11.9 6 14M20 14C20 11.3 18.3 6.6 13 6.1V8.1C16.4 8.7 18 11.9 18 14H15L19 18L23 14H20Z'},{value:'spring',label:'Spring',iconPath:'M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z'},{value:'instant',label:'Instant',iconPath:'M7,2V13H10V22L17,10H13L17,2H7Z'},{value:'fade',label:'Fade',iconPath:'M14,8.5A1.5,1.5 0 0,0 12.5,10A1.5,1.5 0 0,0 14,11.5A1.5,1.5 0 0,0 15.5,10A1.5,1.5 0 0,0 14,8.5M14,12.5A1.5,1.5 0 0,0 12.5,14A1.5,1.5 0 0,0 14,15.5A1.5,1.5 0 0,0 15.5,14A1.5,1.5 0 0,0 14,12.5M10,17A1,1 0 0,0 9,18A1,1 0 0,0 10,19A1,1 0 0,0 11,18A1,1 0 0,0 10,17M10,8.5A1.5,1.5 0 0,0 8.5,10A1.5,1.5 0 0,0 10,11.5A1.5,1.5 0 0,0 11.5,10A1.5,1.5 0 0,0 10,8.5M14,20.5A0.5,0.5 0 0,0 13.5,21A0.5,0.5 0 0,0 14,21.5A0.5,0.5 0 0,0 14.5,21A0.5,0.5 0 0,0 14,20.5M14,17A1,1 0 0,0 13,18A1,1 0 0,0 14,19A1,1 0 0,0 15,18A1,1 0 0,0 14,17M21,13.5A0.5,0.5 0 0,0 20.5,14A0.5,0.5 0 0,0 21,14.5A0.5,0.5 0 0,0 21.5,14A0.5,0.5 0 0,0 21,13.5M18,5A1,1 0 0,0 17,6A1,1 0 0,0 18,7A1,1 0 0,0 19,6A1,1 0 0,0 18,5M18,9A1,1 0 0,0 17,10A1,1 0 0,0 18,11A1,1 0 0,0 19,10A1,1 0 0,0 18,9M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17M18,13A1,1 0 0,0 17,14A1,1 0 0,0 18,15A1,1 0 0,0 19,14A1,1 0 0,0 18,13M10,12.5A1.5,1.5 0 0,0 8.5,14A1.5,1.5 0 0,0 10,15.5A1.5,1.5 0 0,0 11.5,14A1.5,1.5 0 0,0 10,12.5M10,7A1,1 0 0,0 11,6A1,1 0 0,0 10,5A1,1 0 0,0 9,6A1,1 0 0,0 10,7M10,3.5A0.5,0.5 0 0,0 10.5,3A0.5,0.5 0 0,0 10,2.5A0.5,0.5 0 0,0 9.5,3A0.5,0.5 0 0,0 10,3.5M10,20.5A0.5,0.5 0 0,0 9.5,21A0.5,0.5 0 0,0 10,21.5A0.5,0.5 0 0,0 10.5,21A0.5,0.5 0 0,0 10,20.5M3,13.5A0.5,0.5 0 0,0 2.5,14A0.5,0.5 0 0,0 3,14.5A0.5,0.5 0 0,0 3.5,14A0.5,0.5 0 0,0 3,13.5M14,3.5A0.5,0.5 0 0,0 14.5,3A0.5,0.5 0 0,0 14,2.5A0.5,0.5 0 0,0 13.5,3A0.5,0.5 0 0,0 14,3.5M14,7A1,1 0 0,0 15,6A1,1 0 0,0 14,5A1,1 0 0,0 13,6A1,1 0 0,0 14,7M21,10.5A0.5,0.5 0 0,0 21.5,10A0.5,0.5 0 0,0 21,9.5A0.5,0.5 0 0,0 20.5,10A0.5,0.5 0 0,0 21,10.5M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M3,9.5A0.5,0.5 0 0,0 2.5,10A0.5,0.5 0 0,0 3,10.5A0.5,0.5 0 0,0 3.5,10A0.5,0.5 0 0,0 3,9.5M6,9A1,1 0 0,0 5,10A1,1 0 0,0 6,11A1,1 0 0,0 7,10A1,1 0 0,0 6,9M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M6,13A1,1 0 0,0 5,14A1,1 0 0,0 6,15A1,1 0 0,0 7,14A1,1 0 0,0 6,13Z'},{value:'flip',label:'Flip',iconPath:'M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z'},{value:'coverflow',label:'Coverflow',iconPath:'M18,6V17H22V6M2,17H6V6H2M7,19H17V4H7V19Z'},{value:'creative',label:'Creative',iconPath:'M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z'},{value:'cards',label:'Cards',iconPath:'M21.47,4.35L20.13,3.79V12.82L22.56,6.96C22.97,5.94 22.5,4.77 21.47,4.35M1.97,8.05L6.93,20C7.24,20.77 7.97,21.24 8.74,21.26C9,21.26 9.27,21.21 9.53,21.1L16.9,18.05C17.65,17.74 18.11,17 18.13,16.26C18.14,16 18.09,15.71 18,15.45L13,3.5C12.71,2.73 11.97,2.26 11.19,2.25C10.93,2.25 10.67,2.31 10.42,2.4L3.06,5.45C2.04,5.87 1.55,7.04 1.97,8.05M18.12,4.25A2,2 0 0,0 16.12,2.25H14.67L18.12,10.59'},{value:'reveal',label:'Reveal',iconPath:'M19,3H14V5H19V18L14,12V21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,18H5L10,12M10,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H10V23H12V1H10V3Z'},{value:'zoom',label:'Zoom',iconPath:'M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z'},{value:'swing',label:'Swing',iconPath:'M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z'}],valueChanged:i})}
              </div>
            </div>
            ${d?Z`
                  <div class="option-info warning">
                    <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                    <span>
                      Swipe effects are disabled because Native scroll-snap is
                      active.
                    </span>
                  </div>
                `:''}
          `:Z`
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Swipe effects are only available in single view mode with single
                swipe behavior and horizontal direction.
              </span>
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
  `}(this.ii,this.Jo.bind(this))}
          ${function(t,i,e,s,n,o,a,r){const d=t.loop_mode||'none',l=!0===t.enable_auto_swipe,h=t.auto_swipe_interval??2e3,c=!0===t.enable_reset_after,p=t.reset_after_timeout??3e4,u=t.reset_target_card??1,g=t.state_entity||'',f=!0===t.enable_backdrop_filter;let m=0,v=0;'none'!==d&&m++,l&&m++,c&&!l&&m++,c&&l&&v++,g&&m++,f&&m++;let w='',b='';return m>0&&(w=`${m} active`),v>0&&(b=`${v} blocked`),Z`
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
        ${w?Z`<div class="section-toggle-badge">${w}</div>`:''}
        ${b?Z`<div class="section-toggle-badge blocked-only">
              ${b}
            </div>`:''}
      </div>

      <div
        class="section-content compact-options ${i.advanced?'expanded':'collapsed'}"
      >
        ${function(t,i,e=!1){return Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${e?'Not available in current mode':'none'===t?'Stop at first/last card (no looping)':'loopback'===t?'Jump back to first/last card':'Continuous loop navigation'}
        </div>
      </div>
      <div class="option-control">
        ${qt({value:t,dataOption:'loop_mode',disabled:e,options:[{value:'none',label:'No looping'},{value:'loopback',label:'Jump to start/end'},{value:'infinite',label:'Continuous loop'}],valueChanged:i})}
      </div>
    </div>
    ${e?Z`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Loop modes are not available with Native scroll-snap and have been
              disabled.
            </span>
          </div>
        `:''}
  `}(d,e,'css'===(t.scroll_strategy||'js'))}
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
          ${Xt({label:'Auto-swipe interval (ms)',value:i.toString(),dataOption:'auto_swipe_interval',type:'number',min:'500',suffix:'ms',pattern:'[0-9]+',required:!0,autoValidate:!0,changeHandler:e})}
          <div class="help-text">Time between swipes (min. 500ms).</div>
        `:''}
  `}(l,h,e)}
        ${function(t,i,e,s,n,o,a,r){const d='string'==typeof s&&(s.includes('{{')||s.includes('{%')||s.includes('[[['));return Z`
    <!-- Start card option - always available -->
    ${Xt({label:'Start card',value:s.toString(),type:d?'text':'number',min:d?void 0:'1',max:d?void 0:Math.max(1,n.length).toString(),disabled:0===n.length,required:!d,autoValidate:!0,changeHandler:r})}
    <div class="help-text">
      ${d?Z`Template: <code>${s}</code>`:0===n.length?'Add cards first to set a start card.':`Card to show on load (1-${n.length})`}
    </div>

    <!-- Reset after timeout option -->
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
      ${i?'Disabled when auto-swipe is on':'Auto-return to start card after inactivity'}
    </div>

    ${t&&!i?Z`
          ${Xt({label:'Reset timeout (seconds)',value:Math.round(e/1e3).toString(),type:'number',min:'5',max:'3600',suffix:'sec',pattern:'[0-9]+',required:!0,autoValidate:!0,changeHandler:a})}
          <div class="help-text">
            Time of inactivity before resetting (5s to 1h)
          </div>
        `:''}
  `}(c,l,p,u,n,e,o,a)}
        ${function(t,i,e){return'string'==typeof t&&(t.includes('{{')||t.includes('{%')||t.includes('[[['))?Z`
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">State synchronization entity</div>
          <div class="option-help">
            Template: dynamic entity based on user/state
          </div>
        </div>
        <div class="option-control" style="flex: 1;">
          ${Xt({value:t,dataOption:'state_entity',changeHandler:e})}
        </div>
      </div>
      <div class="help-text">
        Template:
        <code
          >${t.length>60?t.substring(0,60)+'...':t}</code
        >
      </div>
    `:Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control" style="flex: 1;">
        <ha-entity-picker
          .hass=${i}
          .value=${t||''}
          data-option="state_entity"
          .includeDomains=${['input_select','input_number']}
          allow-custom-entity
          @value-changed=${e}
          style="width: 100%;"
        ></ha-entity-picker>
      </div>
    </div>
  `}(g,r,e)}
        ${function(t,i){return Z`
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
    ${t?Z`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Trade-off: Disables clip-path, which may prevent dropdown menus
              from overflowing card boundaries. Only enable if you're using
              <code>backdrop-filter: blur()</code> in card-mod CSS.
            </span>
          </div>
        `:Z`
          <div
            class="option-help"
            style="margin-top: -4px; margin-bottom: 12px;"
          >
            When to enable: Only if you're using card-mod with
            <code>backdrop-filter: blur()</code> CSS
          </div>
        `}
  `}(f,e)}
      </div>
    </div>
  `}(this.ii,this.uiManager.getCollapsibleState(),this.Jo.bind(this),this.Do.bind(this),i,this.Xo.bind(this),this.Zo.bind(this),this.hass)}
          ${function(t,i,e,s,n,o,a,r,d,l,h,c,p,u,g){return Z`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?Z`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((f,m)=>function(t,i,e,s,n,o,a,r,d,l,h,c,p,u,g,f,m){const v=r(t),w=d(t),b=w?l(t):[],I=h(t),y=!s||It(t.visibility,s),S=!!t.pagination_icon,E=!!g&&g(i);return Z`
    <div
      class="card-row ${y?'':'hidden-card'}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${v.typeName}</span>
        ${v.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:''}
        ${I&&y?Z`<span class="visibility-badge">Conditional</span>`:''}
        ${v.name?Z`<span class="card-name">(${v.name})</span>`:''}
      </div>
      <div class="card-actions">
        ${I&&!y?Z`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:''}
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
          class="slide-icon-trigger ${S?'has-icon':''}"
          label="Slide icon"
          title="Set a pagination icon for this slide"
          @click=${()=>f(i)}
        >
          <ha-icon icon=${t.pagination_icon||'mdi:image-plus'}></ha-icon>
        </ha-icon-button>
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
    ${E?Z`
          <div class="slide-icon-panel">
            <ha-icon-picker
              .hass=${s}
              .value=${t.pagination_icon||''}
              label="Slide icon"
              @value-changed=${t=>m(i,t.detail.value)}
            ></ha-icon-picker>
            <ha-icon-button
              label="Clear icon"
              title="Clear icon (use a dot for this slide)"
              .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
              ?disabled=${!S}
              @click=${()=>m(i,'')}
            ></ha-icon-button>
          </div>
        `:''}
    ${w?function(t,i,e,s,n,o){return Z`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const d=e(a);return Z`
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
              ${d.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:''}
              ${d.name?Z`<span class="nested-card-name"
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
  `}(b,i,r,c,p,u):''}
  `}(f,m,t.length,i,e,s,n,o,a,r,d,l,h,c,p,u,g))}
      </div>
    </div>
  `}(i,this.hass,this.Bo.bind(this),this.zo.bind(this),this.Wo.bind(this),this.Uo.bind(this),this.Ro.bind(this),this.Lo.bind(this),this.ko.bind(this),this.Po.bind(this),this.Vo.bind(this),this.Ho.bind(this),this.uiManager.isIconPickerOpen.bind(this.uiManager),this.jo.bind(this),this.Yo.bind(this))}
          ${e=this.hass,s=this.lovelace,n=this.Kn,Z`
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
      `}catch(t){return console.error('Simple Swipe Card Editor render error:',t),Z`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${t.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`}var e,s,n}Xo(t){this.configManager.handleTimeoutChange(t)}Zo(t){this.configManager.handleTargetChange(t)}Ko(t){const i=1e3*parseFloat(t.target.value);this.ii={...this.ii,auto_hide_pagination:i},this.Qo()}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),l('EDITOR','SimpleSwipeCardEditor connectedCallback');try{this.uiManager||(l('EDITOR','Reinitializing managers after reconnection'),this.uiManager=new Wt(this),this.configManager=new Yt(this),this.cardManagement=new jt(this),this.eventHandling=new Gt(this),this.uiManager.initializeEditor()),At(a,'Set').add(this);try{await this.uiManager.ensureComponentsLoaded()}catch(t){l('EDITOR','Warning: Could not load all components')}this.eventHandling?.setupEventListeners&&this.eventHandling.setupEventListeners(),setTimeout(()=>{this.uiManager?.ensureCardPickerLoaded&&this.uiManager.ensureCardPickerLoaded()},50),this.requestUpdate()}catch(t){console.error('Error during editor setup:',t),this.requestUpdate()}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),l('EDITOR','SimpleSwipeCardEditor disconnectedCallback');try{this.uiManager&&(this.uiManager.cleanup(),this.uiManager=null),this.configManager&&(this.configManager.cleanup(),this.configManager=null),this.cardManagement=null,this.eventHandling=null,this.eventHandling?.removeEventListeners(),this.eo&&this.eo.clear(),this.zn=null}catch(t){console.warn('Error during editor cleanup:',t)}try{At(a,'Set').delete(this);const t=At(o);this.zn&&t.delete(this.zn)}catch(t){console.warn('Error unregistering editor:',t)}l('EDITOR','SimpleSwipeCardEditor cleanup completed')}}try{customElements.get('simple-swipe-card')||(customElements.define('simple-swipe-card',SimpleSwipeCard),l('SYSTEM','SimpleSwipeCard component registered (synchronous)')),customElements.get('simple-swipe-card-editor')||(customElements.define('simple-swipe-card-editor',SimpleSwipeCardEditor),l('SYSTEM','SimpleSwipeCardEditor component registered (synchronous)'))}catch(t){console.error('SimpleSwipeCard: Failed to register custom elements:',t)}function Zt(){window.customCards||(window.customCards=[]),window.customCards.some(t=>'simple-swipe-card'===t.type)||(window.customCards.push({type:'simple-swipe-card',name:'Simple Swipe Card',preview:!0,description:'A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.'}),l('SYSTEM','Card registered with Home Assistant customCards registry'))}function Kt(){Zt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,'color: white; background: #4caf50; font-weight: 700;','color: #4caf50; background: white; font-weight: 700;');const i=bt();i&&'function'==typeof i.then&&i.then(()=>{l('SYSTEM','Card helpers pre-loaded successfully')}).catch(()=>{})}'loading'===document.readyState?document.addEventListener('DOMContentLoaded',Kt,{once:!0}):Kt(),window.addEventListener('load',()=>{window.customCards?.some(t=>'simple-swipe-card'===t.type)||Zt()},{once:!0});export{SimpleSwipeCard,SimpleSwipeCardEditor};
