function e(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),n=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const a=e=>new o("string"==typeof e?e:e+"",void 0,r),l=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new o(i,e,r)},h=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return a(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:c,defineProperty:d,getOwnPropertyDescriptor:u,getOwnPropertyNames:g,getOwnPropertySymbols:p,getPrototypeOf:f}=Object,m=globalThis,v=m.trustedTypes,_=v?v.emptyScript:"",y=m.reactiveElementPolyfillSupport,w=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},C=(e,t)=>!c(e,t),k={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:C};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=u(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return s?.call(this)},set(t){const n=s?.call(this);r.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...g(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(h(e))}else void 0!==e&&t.push(h(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const s of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EC(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s,this[s]=r.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){if(i??=this.constructor.getPropertyOptions(e),!(i.hasChanged??C)(this[e],t))return;this.P(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(e,t,i){this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e)!0!==i.wrapped||this._$AL.has(t)||void 0===this[t]||this.P(t,this[t],i)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EC(e,this[e]))),this._$EU()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[w("elementProperties")]=new Map,S[w("finalized")]=new Map,y?.({ReactiveElement:S}),(m.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,x=E.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,L="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+T,$=`<${M}>`,O=document,D=()=>O.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,H=e=>I(e)||"function"==typeof e?.[Symbol.iterator],B="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,V=/>/g,N=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,F=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Y=new WeakMap,K=O.createTreeWalker(O,129);function X(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Q=(e,t)=>{const i=e.length-1,s=[];let r,n=2===t?"<svg>":"",o=z;for(let t=0;t<i;t++){const i=e[t];let a,l,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===z?"!--"===l[1]?o=R:void 0!==l[1]?o=V:void 0!==l[2]?(q.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=N):void 0!==l[3]&&(o=N):o===N?">"===l[0]?(o=r??z,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?N:'"'===l[3]?F:U):o===F||o===U?o=N:o===R||o===V?o=z:(o=N,r=void 0);const d=o===N&&e[t+1].startsWith("/>")?" ":"";n+=o===z?i+$:h>=0?(s.push(a),i.slice(0,h)+L+i.slice(h)+T+d):i+T+(-2===h?t:d)}return[X(e,n+(e[i]||"<?>")+(2===t?"</svg>":"")),s]};let Z=class e{constructor({strings:t,_$litType$:i},s){let r;this.parts=[];let n=0,o=0;const a=t.length-1,l=this.parts,[h,c]=Q(t,i);if(this.el=e.createElement(h,s),K.currentNode=this.el.content,2===i){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=K.nextNode())&&l.length<a;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(L)){const t=c[o++],i=r.getAttribute(e).split(T),s=/([.?@])?(.*)/.exec(t);l.push({type:1,index:n,name:s[2],strings:i,ctor:"."===s[1]?se:"?"===s[1]?re:"@"===s[1]?ne:ie}),r.removeAttribute(e)}else e.startsWith(T)&&(l.push({type:6,index:n}),r.removeAttribute(e));if(q.test(r.tagName)){const e=r.textContent.split(T),t=e.length-1;if(t>0){r.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],D()),K.nextNode(),l.push({type:2,index:++n});r.append(e[t],D())}}}else if(8===r.nodeType)if(r.data===M)l.push({type:2,index:n});else{let e=-1;for(;-1!==(e=r.data.indexOf(T,e+1));)l.push({type:7,index:n}),e+=T.length-1}n++}}static createElement(e,t){const i=O.createElement("template");return i.innerHTML=e,i}};function J(e,t,i=e,s){if(t===j)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=P(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=J(e,r._$AS(e,t.values),r,s)),t}let ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??O).importNode(t,!0);K.currentNode=s;let r=K.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new oe(r,this,e)),this._$AV.push(t),a=i[++o]}n!==a?.index&&(r=K.nextNode(),n++)}return K.currentNode=O,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}};class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),P(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):H(e)?this.k(e):this._(e)}S(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}_(e){this._$AH!==G&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new Z(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new te(this.S(D()),this.S(D()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,s){const r=this.strings;let n=!1;if(void 0===r)e=J(this,e,t,0),n=!P(e)||e!==this._$AH&&e!==j,n&&(this._$AH=e);else{const s=e;let o,a;for(e=r[0],o=0;o<r.length-1;o++)a=J(this,s[i+o],t,o),a===j&&(a=this._$AH[o]),n||=!P(a)||a!==this._$AH[o],a===G?e=G:e!==G&&(e+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}let re=class extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}};class ne extends ie{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??G)===j)return;const i=this._$AH,s=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}let oe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}};const ae={P:L,A:T,C:M,M:1,L:Q,R:ee,D:H,V:J,I:te,H:ie,N:re,U:ne,B:se,F:oe},le=E.litHtmlPolyfillSupport;le?.(Z,te),(E.litHtmlVersions??=[]).push("3.1.3");const he=(e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new te(t.insertBefore(D(),e),e,void 0,i??{})}return r._$AI(e),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};let ce=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=he(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};ce._$litElement$=!0,ce.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ce});const de=globalThis.litElementPolyfillSupport;de?.({LitElement:ce}),(globalThis.litElementVersions??=[]).push("4.0.5");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue=1,ge=e=>(...t)=>({_$litDirective$:e,values:t});let pe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe=ge(class extends pe{constructor(e){if(super(e),e.type!==ue||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return j}}),me=e=>(t,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ve={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:C},_e=(e=ve,t,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e)},init(t){return void 0!==t&&this.P(s,void 0,e),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ye(e){return(t,i)=>"object"==typeof i?_e(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,s?{...e,wrapped:!0}:e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we=(e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function be(e,t){return(i,s,r)=>{const n=t=>t.renderRoot?.querySelector(e)??null;if(t){const{get:e,set:t}="object"==typeof s?i:r??(()=>{const e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return we(i,s,{get(){let i=e.call(this);return void 0===i&&(i=n(this),(null!==i||this.hasUpdated)&&t.call(this,i)),i}})}return we(i,s,{get(){return n(this)}})}}var Ce,ke,Se=function(e,t){return Ee(t).format(e)},Ee=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric"})};!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ce||(Ce={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ke||(ke={}));var xe=function(e){if(e.time_format===ke.language||e.time_format===ke.system){var t=e.time_format===ke.language?e.language:void 0,i=(new Date).toLocaleString(t);return i.includes("AM")||i.includes("PM")}return e.time_format===ke.am_pm},Ae=function(e,t){return Le(t).format(e)},Le=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:xe(e)?"numeric":"2-digit",minute:"2-digit",hour12:xe(e)})},Te=function(e,t){return Me(t).format(e)},Me=function(e){return new Intl.DateTimeFormat(e.language,{hour:"numeric",minute:"2-digit",hour12:xe(e)})};function $e(){return($e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e}).apply(this,arguments)}var Oe=function(e,t,i){var s=t?function(e){switch(e.number_format){case Ce.comma_decimal:return["en-US","en"];case Ce.decimal_comma:return["de","es","it"];case Ce.space_comma:return["fr","sv","cs"];case Ce.system:return;default:return e.language}}(t):void 0;if(Number.isNaN=Number.isNaN||function e(t){return"number"==typeof t&&e(t)},(null==t?void 0:t.number_format)!==Ce.none&&!Number.isNaN(Number(e))&&Intl)try{return new Intl.NumberFormat(s,De(e,i)).format(Number(e))}catch(t){return console.error(t),new Intl.NumberFormat(void 0,De(e,i)).format(Number(e))}return"string"==typeof e?e:function(e,t){return void 0===t&&(t=2),Math.round(e*Math.pow(10,t))/Math.pow(10,t)}(e,null==i?void 0:i.maximumFractionDigits).toString()+("currency"===(null==i?void 0:i.style)?" "+i.currency:"")},De=function(e,t){var i=$e({maximumFractionDigits:2},t);if("string"!=typeof e)return i;if(!t||!t.minimumFractionDigits&&!t.maximumFractionDigits){var s=e.indexOf(".")>-1?e.split(".")[1].length:0;i.minimumFractionDigits=s,i.maximumFractionDigits=s}return i},Pe=function(e,t,i,s){s=s||{},i=null==i?{}:i;var r=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return r.detail=i,e.dispatchEvent(r),r},Ie=function(e){Pe(window,"haptic",e)};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He=Symbol.for(""),Be=e=>{if(e?.r===He)return e?._$litStatic$},ze=e=>({_$litStatic$:e,r:He}),Re=new Map,Ve=(e=>(t,...i)=>{const s=i.length;let r,n;const o=[],a=[];let l,h=0,c=!1;for(;h<s;){for(l=t[h];h<s&&void 0!==(n=i[h],r=Be(n));)l+=r+t[++h],c=!0;h!==s&&a.push(n),o.push(l),h++}if(h===s&&o.push(t[s]),c){const e=o.join("$$lit$$");void 0===(t=Re.get(e))&&(o.raw=o,Re.set(e,t=o)),i=a}return e(t,...i)})(W);class Ne{constructor(e,t,i,s=1,r="rgb"){this._opacity=1,"string"==typeof e?(this.parse(e),this.setOpacity(null!=t?t:this._opacity)):"rgb"==r?(this.setRgb(e,null!=t?t:0,null!=i?i:0),this.setOpacity(s)):"hsv"==r&&this.setHsv(e,null!=t?t:0,null!=i?i:0),this._originalMode=r}setRgb(e,t,i){if(e<0||e>255)throw new Error("Red value must be in range [0, 255].");if(t<0||t>255)throw new Error("Green value must be in range [0, 255].");if(i<0||i>255)throw new Error("Blue value must be in range [0, 255].");this._red=e,this._green=t,this._blue=i}setHsv(e,t,i){if(e<0||e>360)throw new Error("Hue value must be in range [0, 360].");if(t<0||t>1)throw new Error("Saturation value must be in range [0, 1].");if(i<0||i>1)throw new Error("HSV Value must be in range [0, 1].");this._hsv=[e,t,i];const[s,r,n]=Ne.hsv2rgb(e,t,i);this.setRgb(s,r,n)}setOpacity(e){if(e<0)throw new Error("Minimal value for opacity is 0.");if(e>1)throw new Error("Maximal value for opacity is 1.");this._opacity=Math.round(100*e)/100}getOriginalMode(){return this._originalMode}getRed(){return this._red}getGreen(){return this._green}getBlue(){return this._blue}ensureHSV(){return this._hsv||(this._hsv=Ne.rgb2hsv(this.getRed(),this.getGreen(),this.getBlue())),this._hsv}getHue(){return this.ensureHSV()[0]}getSaturation(){return this.ensureHSV()[1]}getValue(){return this.ensureHSV()[2]}getOpacity(){return this._opacity}getLuminance(){return.299*this._red+.587*this._green+.114*this._blue}getForeground(e,t,i){return this.getLuminance()+i<Ne.LuminanceBreakingPoint?e:t}parse(e,t=!0){var i;if(e.startsWith("#")){const t=3==(e=e.substring(1)).length,i=4==e.length,s=6==e.length,r=8==e.length;if(!(t||s||i||r))throw new Error("Hex color format should have 3/6 letters or 4/8 letters for transparency.");const n=[];for(let t=0;t<e.length;t++){const i=parseInt(e[t],16);if(isNaN(i))throw new Error(`Hex color format contains non hex characters - '${e[t]}'.`);n.push(i)}t||i?(this.setRgb(16*n[0]+n[0],16*n[1]+n[1],16*n[2]+n[2]),i&&this.setOpacity((16*n[3]+n[3])/255)):(s||r)&&(this.setRgb(16*n[0]+n[1],16*n[2]+n[3],16*n[4]+n[5]),r&&this.setOpacity((16*n[6]+n[7])/255))}else{if(!e.startsWith("rgb")){if(t){const t=document.createElement("canvas").getContext("2d");if(null!=t)return t.fillStyle=e,void this.parse(t.fillStyle,!1)}throw new Error("Unrecognized color format: "+e)}{const t=e.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d*(?:\.\d+\s*)?)\)$/);if(!t)throw new Error("Unrecognized color format rgb[a](...): "+e);this.setRgb(parseInt(t[1]),parseInt(t[2]),parseInt(t[3])),(null===(i=t[4])||void 0===i?void 0:i.length)>0&&this.setOpacity(parseFloat(t[4]))}}}toString(){return this._opacity<1?`rgba(${this._red},${this._green},${this._blue},${this._opacity})`:`rgb(${this._red},${this._green},${this._blue})`}static hsv2rgb(e,t,i){const s=i*t,r=e/60,n=s*(1-Math.abs(r%2-1));let o=0,a=0,l=0;r>=0&&r<=1?[o,a,l]=[s,n,0]:r>=1&&r<=2?[o,a,l]=[n,s,0]:r>=2&&r<=3?[o,a,l]=[0,s,n]:r>=3&&r<=4?[o,a,l]=[0,n,s]:r>=4&&r<=5?[o,a,l]=[n,0,s]:r>=5&&r<=6&&([o,a,l]=[s,0,n]);const h=i-s,[c,d,u]=[o+h,a+h,l+h];return[Math.round(255*c),Math.round(255*d),Math.round(255*u)]}static rgb2hsv(e,t,i){const s=e/255,r=t/255,n=i/255,o=Math.max(s,r,n),a=o-Math.min(s,r,n),l=e=>(o-e)/6/a+.5,h=e=>Math.round(100*e)/100;let c,d=0;if(0==a)d=c=0;else{c=a/o;const e=l(s),t=l(r),i=l(n);s===o?d=i-t:r===o?d=1/3+e-i:n===o&&(d=2/3+t-e),d<0?d+=1:d>1&&(d-=1)}return[Math.round(360*d),h(c),h(o)]}static hueTempToRgb(e){const t=2e3,i=4200,s=6500,r=[255,180,55],n=[255,255,255],o=[190,228,243],a=function(e,t,i){return(i-t)*e+t};if(e<t&&(e=t),e>s&&(e=s),e<i){const i=(e-t)/2200,s=a(i,r[0],n[0]),o=a(i,r[1],n[1]),l=a(i,r[2],n[2]);return[Math.round(s),Math.round(o),Math.round(l)]}{const t=(e-i)/2300,s=a(t,n[0],o[0]),r=a(t,n[1],o[1]),l=a(t,n[2],o[2]);return[Math.round(s),Math.round(r),Math.round(l)]}}}Ne.LuminanceBreakingPoint=192;class Ue{}Ue.Version="v1.7.1",Ue.Dev=!1,Ue.ElementPostfix=Ue.Dev?"-test":"",Ue.CardElementName="hue-like-light-card"+Ue.ElementPostfix,Ue.ApiProviderName=Ue.Dev?"hue_card_test":"hue_card",Ue.CardName="Hue-Like Light Card"+(Ue.Dev?" [TEST]":""),Ue.CardDescription="Hue-like way to control your lights"+(Ue.Dev?" [TEST]":""),Ue.HueBorderRadius=10,Ue.HueShadow="0px 2px 3px rgba(0,0,0,0.4)",Ue.LightColor=new Ne("#fff"),Ue.LightOffColor=new Ne("#fff",.85),Ue.DarkColor=new Ne(0,0,0,.7),Ue.DarkOffColor=new Ne(0,0,0,.5),Ue.WarmColor="#ffda95",Ue.ColdColor="#f5f5ff",Ue.DefaultColor="warm",Ue.OffColor="#666",Ue.TileOffColor="rgba(102, 102, 102, 0.6)",Ue.DialogBgColor="#171717",Ue.DialogFgLightColor=new Ne("#aaa"),Ue.DialogOffColor="#363636",Ue.GradientOffset=7,Ue.TransitionDefault="all 0.3s ease-out 0s",Ue.ThemeDefault="default",Ue.ThemeCardBackground="--hue-detected-card-bg",Ue.ThemeCardBackgroundVar=`var(${Ue.ThemeCardBackground})`,Ue.ThemeCardPossibleBackgrounds=["--ha-card-background","--card-background-color","--paper-card-background-color","--primary-background-color"],Ue.ThemeDialogHeadingColorVar="var(--mdc-dialog-heading-ink-color)",Ue.ThemeSecondaryTextColorVar="var(--secondary-text-color)",Ue.IconSize={big:2,original:1.41666667,small:1};class Fe extends Ne{constructor(e){e==Fe.themeColor?(super(0,0,0),this._isThemeColor=!0):(super(e),this._isThemeColor=!1)}getBaseColor(){if(this._isThemeColor)throw new Error("Cannot getBaseColor on "+Fe.themeColor);return new Ne(this.getRed(),this.getGreen(),this.getBlue(),this.getOpacity())}isThemeColor(){return this._isThemeColor}getLuminance(){if(this._isThemeColor)throw new Error("Cannot getLuminance on "+Fe.themeColor);return super.getLuminance()}getForeground(e,t,i){if(this._isThemeColor)throw new Error("Cannot getForeground on "+Fe.themeColor);return super.getForeground(e,t,i)}toString(){return this._isThemeColor?"var(--"+Fe.themeColor+")":super.toString()}}Fe.themeColor="theme-color";class qe{constructor(e){if(!((null==e?void 0:e.length)>0))throw new Error("At least one background or color is needed for new Background(...).");this._colors=e.flatMap((e=>{if(e instanceof Fe)throw new Error("ColorExtended cannot be used in Background. Resolve it first.");if(e instanceof Ne)return[e];if(e instanceof qe)return e._colors;throw new Error("Only array of Colors or Backgrounds is supported for new Background(...).")}));const t=e=>{let t=e.getHue()-195;return t<0&&(t+=360),t};this._colors.sort(((e,i)=>t(e)-t(i)))}getForeground(e,t,i){if(this._colors.length<3)return this._colors[0].getForeground(e,t,i);let s=0;for(let e=0;e<this._colors.length/2;e++)this._colors[e].getForeground(!0,!1,i)&&s++;return s>this._colors.length/4?e:t}toString(){if(1==this._colors.length)return this._colors[0].toString();const e=100/(this._colors.length-1),t=Ue.GradientOffset;let i=`${this._colors[0]} 0%, ${this._colors[0]} ${t}%`,s=0;for(let r=1;r<this._colors.length;r++)s+=e,r+1==this._colors.length&&(i+=`, ${this._colors[r]} ${100-t}%`),i+=`, ${this._colors[r]} ${Math.round(s)}%`;return`linear-gradient(100deg, ${i})`}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const We="important",je=" !"+We,Ge=ge(class extends pe{constructor(e){if(super(e),e.type!==ue||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,i)=>{const s=e[i];return null==s?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const s=t[e];if(null!=s){this.ft.add(e);const t="string"==typeof s&&s.endsWith(je);e.includes("-")||t?i.setProperty(e,t?s.slice(0,-11):s,t?We:""):i[e]=s}}return j}});class Ye{static getSwitchThemeStyle(){return{"--switch-checked-button-color":`var(${Ye.switchCheckedButtonColorVar})`,"--switch-checked-track-color":`var(${Ye.switchCheckedTrackColorVar})`}}static detectSwitchColors(e,t=!1){Ye.detectThemeVariable(e,Ye.switchCheckedButtonColorVar,Ye.possibleSwitchCheckedButtonColors,"switchBtnDetected",t),Ye.detectThemeVariable(e,Ye.switchCheckedTrackColorVar,Ye.possibleSwitchCheckedTrackColors,"switchTrckDetected",t)}static setDialogThemeStyles(e,t,i){i&&Ye.detectThemeCardBackground(e,!0,1),e.style.setProperty("--mdc-theme-surface",`var(${t}, ${Ue.ThemeCardBackgroundVar})`)}static applyTheme(e,t,i){return e.dataset.themeLocal!=i&&(function(e,t,i,s){void 0===s&&(s=!1),e._themes||(e._themes={});var r=t.default_theme;("default"===i||i&&t.themes[i])&&(r=i);var n=$e({},e._themes);if("default"!==r){var o=t.themes[r];Object.keys(o).forEach((function(t){var i="--"+t;e._themes[i]="",n[i]=o[t]}))}if(e.updateStyles?e.updateStyles(n):window.ShadyCSS&&window.ShadyCSS.styleSubtree(e,n),s){var a=document.querySelector("meta[name=theme-color]");if(a){a.hasAttribute("default-content")||a.setAttribute("default-content",a.getAttribute("content"));var l=n["--primary-color"]||a.getAttribute("default-content");a.setAttribute("content",l)}}}(e,t,i),i!=Ue.ThemeDefault?e.dataset.themeLocal=i:delete e.dataset.themeLocal,Ye.detectSwitchColors(e,!0),!0)}static detectThemeCardBackground(e,t=!1,i=0){Ye.detectThemeVariable(e,Ue.ThemeCardBackground,Ue.ThemeCardPossibleBackgrounds,"hueBgDetected",t,i)}static detectThemeVariable(e,t,i,s,r=!1,n=0){if(e.dataset[s]&&!r)return;const o=!!e.dataset.themeLocal;let a;for(a of i)if(n>0)n--;else if(o){let i=!1,s=0;for(;e.style[s];){if(e.style[s]==a){i=!0;break}s++}if(i){e.style.setProperty(t,`var(${a})`);break}}else{e.style.setProperty(t,`var(${a})`);if(getComputedStyle(e).getPropertyValue(t))break}let l=a||"none";o&&(l+=";local"),e.dataset[s]=l}}Ye.switchCheckedButtonColorVar="--detected-switch-checked-button-color",Ye.switchCheckedTrackColorVar="--detected-switch-checked-track-color",Ye.possibleSwitchCheckedButtonColors=["--switch-checked-button-color","--primary-color"],Ye.possibleSwitchCheckedTrackColors=["--switch-checked-track-color","--switch-checked-color","--dark-primary-color"];class Ke{static getColor(e){switch(e){case"warm":return new Ne(Ue.WarmColor);case"cold":return new Ne(Ue.ColdColor);default:return new Ne(e)}}}function Xe(e,t){return null!=t?t:e}function Qe(e,t,...i){i.unshift(t);const s=e.split(".")[0];if(i.indexOf(s)<0)throw new Error(`Unsupported entity type: ${s} (in '${e}'). Supported type(s): '${i.join("', '")}'.`)}function Ze(e){return e.filter((function(e,t,i){return t===i.indexOf(e)}))}if(!Je)var Je={map:function(e,t){var i={};return t?e.map((function(e,s){return i.index=s,t.call(i,e)})):e.slice()},naturalOrder:function(e,t){return e<t?-1:e>t?1:0},sum:function(e,t){var i={};return e.reduce(t?function(e,s,r){return i.index=r,e+t.call(i,s)}:function(e,t){return e+t},0)},max:function(e,t){return Math.max.apply(null,t?Je.map(e,t):e)}};var et=function(){function e(e,t,i){return(e<<10)+(t<<5)+i}function t(e){var t=[],i=!1;function s(){t.sort(e),i=!0}return{push:function(e){t.push(e),i=!1},peek:function(e){return i||s(),void 0===e&&(e=t.length-1),t[e]},pop:function(){return i||s(),t.pop()},size:function(){return t.length},map:function(e){return t.map(e)},debug:function(){return i||s(),t}}}function i(e,t,i,s,r,n,o){var a=this;a.r1=e,a.r2=t,a.g1=i,a.g2=s,a.b1=r,a.b2=n,a.histo=o}function s(){this.vboxes=new t((function(e,t){return Je.naturalOrder(e.vbox.count()*e.vbox.volume(),t.vbox.count()*t.vbox.volume())}))}function r(t,i){if(i.count()){var s=i.r2-i.r1+1,r=i.g2-i.g1+1,n=Je.max([s,r,i.b2-i.b1+1]);if(1==i.count())return[i.copy()];var o,a,l,h,c=0,d=[],u=[];if(n==s)for(o=i.r1;o<=i.r2;o++){for(h=0,a=i.g1;a<=i.g2;a++)for(l=i.b1;l<=i.b2;l++)h+=t[e(o,a,l)]||0;d[o]=c+=h}else if(n==r)for(o=i.g1;o<=i.g2;o++){for(h=0,a=i.r1;a<=i.r2;a++)for(l=i.b1;l<=i.b2;l++)h+=t[e(a,o,l)]||0;d[o]=c+=h}else for(o=i.b1;o<=i.b2;o++){for(h=0,a=i.r1;a<=i.r2;a++)for(l=i.g1;l<=i.g2;l++)h+=t[e(a,l,o)]||0;d[o]=c+=h}return d.forEach((function(e,t){u[t]=c-e})),function(e){var t,s,r,n,a,l=e+"1",h=e+"2",g=0;for(o=i[l];o<=i[h];o++)if(d[o]>c/2){for(r=i.copy(),n=i.copy(),a=(t=o-i[l])<=(s=i[h]-o)?Math.min(i[h]-1,~~(o+s/2)):Math.max(i[l],~~(o-1-t/2));!d[a];)a++;for(g=u[a];!g&&d[a-1];)g=u[--a];return r[h]=a,n[l]=r[h]+1,[r,n]}}(n==s?"r":n==r?"g":"b")}}return i.prototype={volume:function(e){var t=this;return t._volume&&!e||(t._volume=(t.r2-t.r1+1)*(t.g2-t.g1+1)*(t.b2-t.b1+1)),t._volume},count:function(t){var i=this,s=i.histo;if(!i._count_set||t){var r,n,o,a=0;for(r=i.r1;r<=i.r2;r++)for(n=i.g1;n<=i.g2;n++)for(o=i.b1;o<=i.b2;o++)a+=s[e(r,n,o)]||0;i._count=a,i._count_set=!0}return i._count},copy:function(){var e=this;return new i(e.r1,e.r2,e.g1,e.g2,e.b1,e.b2,e.histo)},avg:function(t){var i=this,s=i.histo;if(!i._avg||t){var r,n,o,a,l=0,h=0,c=0,d=0;for(n=i.r1;n<=i.r2;n++)for(o=i.g1;o<=i.g2;o++)for(a=i.b1;a<=i.b2;a++)l+=r=s[e(n,o,a)]||0,h+=r*(n+.5)*8,c+=r*(o+.5)*8,d+=r*(a+.5)*8;i._avg=l?[~~(h/l),~~(c/l),~~(d/l)]:[~~(8*(i.r1+i.r2+1)/2),~~(8*(i.g1+i.g2+1)/2),~~(8*(i.b1+i.b2+1)/2)]}return i._avg},contains:function(e){var t=this,i=e[0]>>3;return gval=e[1]>>3,bval=e[2]>>3,i>=t.r1&&i<=t.r2&&gval>=t.g1&&gval<=t.g2&&bval>=t.b1&&bval<=t.b2}},s.prototype={push:function(e){this.vboxes.push({vbox:e,color:e.avg()})},palette:function(){return this.vboxes.map((function(e){return e.color}))},size:function(){return this.vboxes.size()},map:function(e){for(var t=this.vboxes,i=0;i<t.size();i++)if(t.peek(i).vbox.contains(e))return t.peek(i).color;return this.nearest(e)},nearest:function(e){for(var t,i,s,r=this.vboxes,n=0;n<r.size();n++)((i=Math.sqrt(Math.pow(e[0]-r.peek(n).color[0],2)+Math.pow(e[1]-r.peek(n).color[1],2)+Math.pow(e[2]-r.peek(n).color[2],2)))<t||void 0===t)&&(t=i,s=r.peek(n).color);return s},forcebw:function(){var e=this.vboxes;e.sort((function(e,t){return Je.naturalOrder(Je.sum(e.color),Je.sum(t.color))}));var t=e[0].color;t[0]<5&&t[1]<5&&t[2]<5&&(e[0].color=[0,0,0]);var i=e.length-1,s=e[i].color;s[0]>251&&s[1]>251&&s[2]>251&&(e[i].color=[255,255,255])}},{quantize:function(n,o){if(!n.length||o<2||o>256)return!1;var a=function(t){var i,s=new Array(32768);return t.forEach((function(t){i=e(t[0]>>3,t[1]>>3,t[2]>>3),s[i]=(s[i]||0)+1})),s}(n);a.forEach((function(){}));var l=function(e,t){var s,r,n,o=1e6,a=0,l=1e6,h=0,c=1e6,d=0;return e.forEach((function(e){(s=e[0]>>3)<o?o=s:s>a&&(a=s),(r=e[1]>>3)<l?l=r:r>h&&(h=r),(n=e[2]>>3)<c?c=n:n>d&&(d=n)})),new i(o,a,l,h,c,d,t)}(n,a),h=new t((function(e,t){return Je.naturalOrder(e.count(),t.count())}));function c(e,t){for(var i,s=e.size(),n=0;n<1e3;){if(s>=t)return;if(n++>1e3)return;if((i=e.pop()).count()){var o=r(a,i),l=o[0],h=o[1];if(!l)return;e.push(l),h&&(e.push(h),s++)}else e.push(i),n++}}h.push(l),c(h,.75*o);for(var d=new t((function(e,t){return Je.naturalOrder(e.count()*e.volume(),t.count()*t.volume())}));h.size();)d.push(h.pop());c(d,o);for(var u=new s;d.size();)u.push(d.pop());return u}}}().quantize,tt=function(e){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.width=this.canvas.width=e.naturalWidth,this.height=this.canvas.height=e.naturalHeight,this.context.drawImage(e,0,0,this.width,this.height)};tt.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)};var it,st,rt,nt,ot,at=function(){};at.prototype.getColor=function(e,t){return void 0===t&&(t=10),this.getPalette(e,5,t)[0]},at.prototype.getPalette=function(e,t,i){var s=function(e){var t=e.colorCount,i=e.quality;if(void 0!==t&&Number.isInteger(t)){if(1===t)throw new Error("colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()");t=Math.max(t,2),t=Math.min(t,20)}else t=10;return(void 0===i||!Number.isInteger(i)||i<1)&&(i=10),{colorCount:t,quality:i}}({colorCount:t,quality:i}),r=new tt(e),n=function(e,t,i){for(var s,r,n,o,a,l=e,h=[],c=0;c<t;c+=i)r=l[0+(s=4*c)],n=l[s+1],o=l[s+2],(void 0===(a=l[s+3])||a>=125)&&(r>250&&n>250&&o>250||h.push([r,n,o]));return h}(r.getImageData().data,r.width*r.height,s.quality),o=et(n,s.colorCount);return o?o.palette():null},at.prototype.getColorFromUrl=function(e,t,i){var s=this,r=document.createElement("img");r.addEventListener("load",(function(){var n=s.getPalette(r,5,i);t(n[0],e)})),r.src=e},at.prototype.getImageData=function(e,t){var s=new XMLHttpRequest;s.open("GET",e,!0),s.responseType="arraybuffer",s.onload=function(){if(200==this.status){var e=new Uint8Array(this.response);i=e.length;for(var s=new Array(i),r=0;r<e.length;r++)s[r]=String.fromCharCode(e[r]);var n=s.join(""),o=window.btoa(n);t("data:image/png;base64,"+o)}},s.send()},at.prototype.getColorAsync=function(e,t,i){var s=this;this.getImageData(e,(function(e){var r=document.createElement("img");r.addEventListener("load",(function(){var e=s.getPalette(r,5,i);t(e[0],this)})),r.src=e}))},function(e){e.Big="big",e.Original="original",e.Small="small"}(it||(it={})),function(e){e.Default="default",e.None="none",e.Mushroom="mushroom"}(st||(st={})),function(e){e.Default="default",e.NoAction="none",e.TurnOn="turn-on",e.TurnOff="turn-off",e.MoreInfo="more-info",e.Scene="scene",e.HueScreen="hue-screen"}(rt||(rt={})),function(e){e.Default="default",e.NameAsc="name-asc",e.NameDesc="name-desc"}(nt||(nt={}));class lt{constructor(e){"string"==typeof e?this._onlyValue=e:e instanceof lt?(this._onlyValue=e._onlyValue,this._valueStore=e._valueStore):this._valueStore=e||{}}getData(e){return this._onlyValue?this._onlyValue:this._valueStore[e]}}class ht{constructor(e){Qe(e,"scene"),this.entity=e}getActivationService(){const e="scene.turn_on",t=this.activation||e,i=t.split(".");if(2!=i.length)throw new Error(`Unrecognized service '${t}'. The service should have 2 parts separated by '.' (dot). E.g.: '${e}'`);return i}getActivationData(){const e={entity_id:this.entity};if(this.activationData)for(const t in this.activationData)Object.prototype.hasOwnProperty.call(this.activationData,t)&&(e[t]=this.activationData[t]);return e}}class ct{constructor(e){this._config="string"==typeof e?new ht(e):e}set hass(e){this._hass=e,this._entity=this._hass.states[this._config.entity]}activate(){this.ensureHass();const e=this._config.getActivationService(),t=this._config.getActivationData();this._hass.callService(e[0],e[1],t)}getTitle(e){if(this.ensureHass(),this._config.title)return this._config.title;let t=this._entity.attributes.friendly_name;return e&&0==(null==t?void 0:t.toLowerCase().indexOf(e.toLowerCase()))&&(t=t.substring(e.length).trimStart()),t}getPicture(){return this.ensureHass(),this._entity.attributes.entity_picture}getIcon(e=null){return this.ensureHass(),null!=this._config.icon?this._config.icon:this._entity.attributes.icon||e}getAccentColor(){return this.ensureHass(),new Promise((e=>{if(this._config.color)return e(Ke.getColor(this._config.color));if(this._pictureColor)return e(this._pictureColor);const t=this.getPicture();if(!t)return e(void 0);{const i=new Image;i.crossOrigin="",i.src=t,i.onload=()=>{const t=(new at).getColor(i);this._pictureColor=new Ne(t[0],t[1],t[2]),e(this._pictureColor)}}}))}getBrightnessValue(){this.ensureHass();const e=this._entity.attributes.brightness;return"number"==typeof e?e:null}ensureHass(){if(!this._hass)throw new Error("Scene data not initialized - call setHass first!")}}let dt=ot=class extends ce{constructor(){super(...arguments),this.disabled=!1,this.step=1,this.min=0,this.max=100}onChange(e){this.value=e.detail.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value}}))}onCurrentChange(e){const t=e.detail.value;this.dispatchEvent(new CustomEvent("current-change",{detail:{value:t}}))}render(){return W`
            <mushroom-slider
                .disabled=${this.disabled}
                .value=${this.value}
                .step=${this.step}
                .min=${this.min}
                .max=${this.max}
                .showActive=${!0}
                @change=${this.onChange}
                @current-change=${this.onCurrentChange}
            />
        `}static get styles(){return l`
            :host {
                display: inline;

                /* colors */
                --slider-color: var(--dark-primary-color, var(--primary-color));
                --slider-outline-color: transparent;
                --slider-bg-color: rgba(0,0,0,0.3);
            }
            mushroom-slider {
                display: inline-block;
                width: calc(100% - ${2*ot.Margin}px);
                margin-top: ${ot.MarginTop}px;
                margin-left: ${ot.Margin}px;
                margin-right: ${ot.Margin}px;

                /* colors */
                --main-color: var(--slider-color);
                --bg-color: var(--slider-bg-color);
                --bg-color-inactive: var(--slider-bg-color);
                --main-outline-color: var(--slider-outline-color);

                /* base styles: */
                --control-height: var(--mush-control-height, ${ot.Height}px);
                --control-border-radius: var(--mush-control-border-radius, 12px);
            }
        `}};dt.ElementName="hue-mushroom-slider-container"+Ue.ElementPostfix,dt.MarginTop=8,dt.Margin=14,dt.Height=28,e([ye({type:Boolean})],dt.prototype,"disabled",void 0),e([ye({attribute:!1,type:Number,reflect:!0})],dt.prototype,"value",void 0),e([ye({type:Number})],dt.prototype,"step",void 0),e([ye({type:Number})],dt.prototype,"min",void 0),e([ye({type:Number})],dt.prototype,"max",void 0),dt=ot=e([me(dt.ElementName)],dt);class ut{static createSwitch(e,t,i){const s=Ye.getSwitchThemeStyle();return Ve`
        <ha-switch
            .checked=${e.isOn()}
            .disabled=${e.isUnavailable()}
            .haptic=true
            style=${Ge(s)}
            @change=${s=>ut.changed(s,!1,e,t,i)}
        ></ha-switch>`}static createSlider(e,t,i){if(!e.features.brightness||t.slider==st.None)return G;const s=t.allowZero?0:1;return t.slider==st.Mushroom?Ve`
                <${ze(dt.ElementName)}
                    class="brightness-slider"
                    .min=${s}
                    .max=${100}
                    .step=${1}
                    .disabled=${t.allowZero?e.isUnavailable():e.isOff()}
                    .value=${e.brightnessValue}
                    .showActive=${!0}
                    @change=${t=>ut.changed(t,!0,e,i)}
                />`:Ve`
        <ha-slider pin ignore-bar-touch
            class="brightness-slider"
            .min=${s}
            .max=${100}
            .step=${1}
            .disabled=${t.allowZero?e.isUnavailable():e.isOff()}
            .value=${e.brightnessValue}
            @change=${t=>ut.changed(t,!0,e,i)}
        ></ha-slider>`}static changed(e,t,i,s,r){const n=e.target;if(n){if(t){const e=n.value;null!=e&&(i.brightnessValue=parseInt(e))}else{n.checked?i.turnOn(r):i.turnOff()}s()}}static calculateBackAndForeground(e,t,i=!0,s=t){const r=e.isOff()?t:e.getBackground()||s||t;let n;if(null==r)n=null;else{n=ut.calculateForeground(e,r,i).foreground}return{background:r,foreground:n}}static calculateForeground(e,t,i=!0){let s=e.brightnessValue;i||(s=100);const r=e.isOn()&&s>50?-(10-(s-50)/5):0;let n=e.isOn()&&s<=50?Ue.LightColor:t.getForeground(Ue.LightColor,Ue.DarkColor,r);return e.isOff()&&(n=n==Ue.DarkColor?Ue.DarkOffColor:Ue.LightOffColor),{foreground:n,opacity:1}}static calculateDefaultShadow(e,t,i){if(t.isOff())return i?"inset 0px 0px 10px rgba(0,0,0,0.2)":"0px 0px 0px white";const s=e;if(!s||!s.clientHeight)return"";const r=100-t.brightnessValue,n=20+.95*r*(s.clientHeight/100);let o=s.clientHeight/2;r>70&&(o-=(o-20)*(r-70)/30);let a=.65;return r>60&&(a-=(a-.5)*(r-60)/40),`inset 0px -${n}px ${o}px -20px rgba(0,0,0,${a})`}static hasHueIcons(){const e=window;return!!e.customIcons&&"object"==typeof e.customIcons.hue}static setIconSize(e,t){t=Math.round(t),(null==e?void 0:e.updateComplete)&&e.updateComplete.then((()=>{e.renderRoot.children[0].style.setProperty("--mdc-icon-size",t+"px")}))}}class gt{constructor(e,t){this._waitAfter=t,this._action=e}get action(){return this._action}get waitAfter(){return this._waitAfter}}class pt{constructor(){this._queue=new Array,this._currentEffectId=null}get currentEffectId(){return this._currentEffectId}addEffect(e,t){const i=new gt(t,e);this._queue.push(i)}start(){let e=0;const t=()=>{this.planEffect(++e,t)};this.planEffect(e,t)}stop(){this._currentEffectId&&(clearTimeout(this._currentEffectId),this._currentEffectId=null)}stopAndClear(){this.stop(),this._queue.length=0}planEffect(e,t=null){if(e>=this._queue.length)return void(this._currentEffectId=null);const i=this._queue[e];this._currentEffectId=setTimeout((()=>{i.action(),t&&t()}),i.waitAfter)}}class ft extends ce{constructor(e){super(),this._elementId=e+"_"+ft.maxId++}}
/*! Hammer.JS - v2.0.17-rc - 2019-12-16
 * http://naver.github.io/egjs
 *
 * Forked By Naver egjs
 * Copyright (c) hammerjs
 * Licensed under the MIT license */
function mt(){return mt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e},mt.apply(this,arguments)}function vt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function _t(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}ft.maxId=1;var yt,wt="function"!=typeof Object.assign?function(e){if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),i=1;i<arguments.length;i++){var s=arguments[i];if(null!=s)for(var r in s)s.hasOwnProperty(r)&&(t[r]=s[r])}return t}:Object.assign,bt=["","webkit","Moz","MS","ms","o"],Ct="undefined"==typeof document?{style:{}}:document.createElement("div"),kt=Math.round,St=Math.abs,Et=Date.now;function xt(e,t){for(var i,s,r=t[0].toUpperCase()+t.slice(1),n=0;n<bt.length;){if((s=(i=bt[n])?i+r:t)in e)return s;n++}}yt="undefined"==typeof window?{}:window;var At=xt(Ct.style,"touchAction"),Lt=void 0!==At;var Tt="compute",Mt="auto",$t="manipulation",Ot="none",Dt="pan-x",Pt="pan-y",It=function(){if(!Lt)return!1;var e={},t=yt.CSS&&yt.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach((function(i){return e[i]=!t||yt.CSS.supports("touch-action",i)})),e}(),Ht="ontouchstart"in yt,Bt=void 0!==xt(yt,"PointerEvent"),zt=Ht&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),Rt="touch",Vt="mouse",Nt=25,Ut=1,Ft=4,qt=8,Wt=1,jt=2,Gt=4,Yt=8,Kt=16,Xt=jt|Gt,Qt=Yt|Kt,Zt=Xt|Qt,Jt=["x","y"],ei=["clientX","clientY"];function ti(e,t,i){var s;if(e)if(e.forEach)e.forEach(t,i);else if(void 0!==e.length)for(s=0;s<e.length;)t.call(i,e[s],s,e),s++;else for(s in e)e.hasOwnProperty(s)&&t.call(i,e[s],s,e)}function ii(e,t){return"function"==typeof e?e.apply(t&&t[0]||void 0,t):e}function si(e,t){return e.indexOf(t)>-1}var ri=function(){function e(e,t){this.manager=e,this.set(t)}var t=e.prototype;return t.set=function(e){e===Tt&&(e=this.compute()),Lt&&this.manager.element.style&&It[e]&&(this.manager.element.style[At]=e),this.actions=e.toLowerCase().trim()},t.update=function(){this.set(this.manager.options.touchAction)},t.compute=function(){var e=[];return ti(this.manager.recognizers,(function(t){ii(t.options.enable,[t])&&(e=e.concat(t.getTouchAction()))})),function(e){if(si(e,Ot))return Ot;var t=si(e,Dt),i=si(e,Pt);return t&&i?Ot:t||i?t?Dt:Pt:si(e,$t)?$t:Mt}(e.join(" "))},t.preventDefaults=function(e){var t=e.srcEvent,i=e.offsetDirection;if(this.manager.session.prevented)t.preventDefault();else{var s=this.actions,r=si(s,Ot)&&!It[Ot],n=si(s,Pt)&&!It[Pt],o=si(s,Dt)&&!It[Dt];if(r){var a=1===e.pointers.length,l=e.distance<2,h=e.deltaTime<250;if(a&&l&&h)return}if(!o||!n)return r||n&&i&Xt||o&&i&Qt?this.preventSrc(t):void 0}},t.preventSrc=function(e){this.manager.session.prevented=!0,e.preventDefault()},e}();function ni(e,t){for(;e;){if(e===t)return!0;e=e.parentNode}return!1}function oi(e){var t=e.length;if(1===t)return{x:kt(e[0].clientX),y:kt(e[0].clientY)};for(var i=0,s=0,r=0;r<t;)i+=e[r].clientX,s+=e[r].clientY,r++;return{x:kt(i/t),y:kt(s/t)}}function ai(e){for(var t=[],i=0;i<e.pointers.length;)t[i]={clientX:kt(e.pointers[i].clientX),clientY:kt(e.pointers[i].clientY)},i++;return{timeStamp:Et(),pointers:t,center:oi(t),deltaX:e.deltaX,deltaY:e.deltaY}}function li(e,t,i){i||(i=Jt);var s=t[i[0]]-e[i[0]],r=t[i[1]]-e[i[1]];return Math.sqrt(s*s+r*r)}function hi(e,t,i){i||(i=Jt);var s=t[i[0]]-e[i[0]],r=t[i[1]]-e[i[1]];return 180*Math.atan2(r,s)/Math.PI}function ci(e,t){return e===t?Wt:St(e)>=St(t)?e<0?jt:Gt:t<0?Yt:Kt}function di(e,t,i){return{x:t/e||0,y:i/e||0}}function ui(e,t){var i=e.session,s=t.pointers,r=s.length;i.firstInput||(i.firstInput=ai(t)),r>1&&!i.firstMultiple?i.firstMultiple=ai(t):1===r&&(i.firstMultiple=!1);var n=i.firstInput,o=i.firstMultiple,a=o?o.center:n.center,l=t.center=oi(s);t.timeStamp=Et(),t.deltaTime=t.timeStamp-n.timeStamp,t.angle=hi(a,l),t.distance=li(a,l),function(e,t){var i=t.center,s=e.offsetDelta||{},r=e.prevDelta||{},n=e.prevInput||{};t.eventType!==Ut&&n.eventType!==Ft||(r=e.prevDelta={x:n.deltaX||0,y:n.deltaY||0},s=e.offsetDelta={x:i.x,y:i.y}),t.deltaX=r.x+(i.x-s.x),t.deltaY=r.y+(i.y-s.y)}(i,t),t.offsetDirection=ci(t.deltaX,t.deltaY);var h,c,d=di(t.deltaTime,t.deltaX,t.deltaY);t.overallVelocityX=d.x,t.overallVelocityY=d.y,t.overallVelocity=St(d.x)>St(d.y)?d.x:d.y,t.scale=o?(h=o.pointers,li((c=s)[0],c[1],ei)/li(h[0],h[1],ei)):1,t.rotation=o?function(e,t){return hi(t[1],t[0],ei)+hi(e[1],e[0],ei)}(o.pointers,s):0,t.maxPointers=i.prevInput?t.pointers.length>i.prevInput.maxPointers?t.pointers.length:i.prevInput.maxPointers:t.pointers.length,function(e,t){var i,s,r,n,o=e.lastInterval||t,a=t.timeStamp-o.timeStamp;if(t.eventType!==qt&&(a>Nt||void 0===o.velocity)){var l=t.deltaX-o.deltaX,h=t.deltaY-o.deltaY,c=di(a,l,h);s=c.x,r=c.y,i=St(c.x)>St(c.y)?c.x:c.y,n=ci(l,h),e.lastInterval=t}else i=o.velocity,s=o.velocityX,r=o.velocityY,n=o.direction;t.velocity=i,t.velocityX=s,t.velocityY=r,t.direction=n}(i,t);var u,g=e.element,p=t.srcEvent;ni(u=p.composedPath?p.composedPath()[0]:p.path?p.path[0]:p.target,g)&&(g=u),t.target=g}function gi(e,t,i){var s=i.pointers.length,r=i.changedPointers.length,n=t&Ut&&s-r==0,o=t&(Ft|qt)&&s-r==0;i.isFirst=!!n,i.isFinal=!!o,n&&(e.session={}),i.eventType=t,ui(e,i),e.emit("hammer.input",i),e.recognize(i),e.session.prevInput=i}function pi(e){return e.trim().split(/\s+/g)}function fi(e,t,i){ti(pi(t),(function(t){e.addEventListener(t,i,!1)}))}function mi(e,t,i){ti(pi(t),(function(t){e.removeEventListener(t,i,!1)}))}function vi(e){var t=e.ownerDocument||e;return t.defaultView||t.parentWindow||window}var _i=function(){function e(e,t){var i=this;this.manager=e,this.callback=t,this.element=e.element,this.target=e.options.inputTarget,this.domHandler=function(t){ii(e.options.enable,[e])&&i.handler(t)},this.init()}var t=e.prototype;return t.handler=function(){},t.init=function(){this.evEl&&fi(this.element,this.evEl,this.domHandler),this.evTarget&&fi(this.target,this.evTarget,this.domHandler),this.evWin&&fi(vi(this.element),this.evWin,this.domHandler)},t.destroy=function(){this.evEl&&mi(this.element,this.evEl,this.domHandler),this.evTarget&&mi(this.target,this.evTarget,this.domHandler),this.evWin&&mi(vi(this.element),this.evWin,this.domHandler)},e}();function yi(e,t,i){if(e.indexOf&&!i)return e.indexOf(t);for(var s=0;s<e.length;){if(i&&e[s][i]==t||!i&&e[s]===t)return s;s++}return-1}var wi={pointerdown:Ut,pointermove:2,pointerup:Ft,pointercancel:qt,pointerout:qt},bi={2:Rt,3:"pen",4:Vt,5:"kinect"},Ci="pointerdown",ki="pointermove pointerup pointercancel";yt.MSPointerEvent&&!yt.PointerEvent&&(Ci="MSPointerDown",ki="MSPointerMove MSPointerUp MSPointerCancel");var Si=function(e){function t(){var i,s=t.prototype;return s.evEl=Ci,s.evWin=ki,(i=e.apply(this,arguments)||this).store=i.manager.session.pointerEvents=[],i}return vt(t,e),t.prototype.handler=function(e){var t=this.store,i=!1,s=e.type.toLowerCase().replace("ms",""),r=wi[s],n=bi[e.pointerType]||e.pointerType,o=n===Rt,a=yi(t,e.pointerId,"pointerId");r&Ut&&(0===e.button||o)?a<0&&(t.push(e),a=t.length-1):r&(Ft|qt)&&(i=!0),a<0||(t[a]=e,this.callback(this.manager,r,{pointers:t,changedPointers:[e],pointerType:n,srcEvent:e}),i&&t.splice(a,1))},t}(_i);function Ei(e){return Array.prototype.slice.call(e,0)}function xi(e,t,i){for(var s=[],r=[],n=0;n<e.length;){var o=t?e[n][t]:e[n];yi(r,o)<0&&s.push(e[n]),r[n]=o,n++}return i&&(s=t?s.sort((function(e,i){return e[t]>i[t]})):s.sort()),s}var Ai={touchstart:Ut,touchmove:2,touchend:Ft,touchcancel:qt},Li=function(e){function t(){var i;return t.prototype.evTarget="touchstart touchmove touchend touchcancel",(i=e.apply(this,arguments)||this).targetIds={},i}return vt(t,e),t.prototype.handler=function(e){var t=Ai[e.type],i=Ti.call(this,e,t);i&&this.callback(this.manager,t,{pointers:i[0],changedPointers:i[1],pointerType:Rt,srcEvent:e})},t}(_i);function Ti(e,t){var i,s,r=Ei(e.touches),n=this.targetIds;if(t&(2|Ut)&&1===r.length)return n[r[0].identifier]=!0,[r,r];var o=Ei(e.changedTouches),a=[],l=this.target;if(s=r.filter((function(e){return ni(e.target,l)})),t===Ut)for(i=0;i<s.length;)n[s[i].identifier]=!0,i++;for(i=0;i<o.length;)n[o[i].identifier]&&a.push(o[i]),t&(Ft|qt)&&delete n[o[i].identifier],i++;return a.length?[xi(s.concat(a),"identifier",!0),a]:void 0}var Mi={mousedown:Ut,mousemove:2,mouseup:Ft},$i=function(e){function t(){var i,s=t.prototype;return s.evEl="mousedown",s.evWin="mousemove mouseup",(i=e.apply(this,arguments)||this).pressed=!1,i}return vt(t,e),t.prototype.handler=function(e){var t=Mi[e.type];t&Ut&&0===e.button&&(this.pressed=!0),2&t&&1!==e.which&&(t=Ft),this.pressed&&(t&Ft&&(this.pressed=!1),this.callback(this.manager,t,{pointers:[e],changedPointers:[e],pointerType:Vt,srcEvent:e}))},t}(_i),Oi=2500;function Di(e){var t=e.changedPointers[0];if(t.identifier===this.primaryTouch){var i={x:t.clientX,y:t.clientY},s=this.lastTouches;this.lastTouches.push(i);setTimeout((function(){var e=s.indexOf(i);e>-1&&s.splice(e,1)}),Oi)}}function Pi(e,t){e&Ut?(this.primaryTouch=t.changedPointers[0].identifier,Di.call(this,t)):e&(Ft|qt)&&Di.call(this,t)}function Ii(e){for(var t=e.srcEvent.clientX,i=e.srcEvent.clientY,s=0;s<this.lastTouches.length;s++){var r=this.lastTouches[s],n=Math.abs(t-r.x),o=Math.abs(i-r.y);if(n<=25&&o<=25)return!0}return!1}var Hi=function(){return function(e){function t(t,i){var s;return(s=e.call(this,t,i)||this).handler=function(e,t,i){var r=i.pointerType===Rt,n=i.pointerType===Vt;if(!(n&&i.sourceCapabilities&&i.sourceCapabilities.firesTouchEvents)){if(r)Pi.call(_t(_t(s)),t,i);else if(n&&Ii.call(_t(_t(s)),i))return;s.callback(e,t,i)}},s.touch=new Li(s.manager,s.handler),s.mouse=new $i(s.manager,s.handler),s.primaryTouch=null,s.lastTouches=[],s}return vt(t,e),t.prototype.destroy=function(){this.touch.destroy(),this.mouse.destroy()},t}(_i)}();function Bi(e,t,i){return!!Array.isArray(e)&&(ti(e,i[t],i),!0)}var zi=32,Ri=1;function Vi(e,t){var i=t.manager;return i?i.get(e):e}function Ni(e){return 16&e?"cancel":8&e?"end":4&e?"move":2&e?"start":""}var Ui=function(){function e(e){void 0===e&&(e={}),this.options=mt({enable:!0},e),this.id=Ri++,this.manager=null,this.state=1,this.simultaneous={},this.requireFail=[]}var t=e.prototype;return t.set=function(e){return wt(this.options,e),this.manager&&this.manager.touchAction.update(),this},t.recognizeWith=function(e){if(Bi(e,"recognizeWith",this))return this;var t=this.simultaneous;return t[(e=Vi(e,this)).id]||(t[e.id]=e,e.recognizeWith(this)),this},t.dropRecognizeWith=function(e){return Bi(e,"dropRecognizeWith",this)||(e=Vi(e,this),delete this.simultaneous[e.id]),this},t.requireFailure=function(e){if(Bi(e,"requireFailure",this))return this;var t=this.requireFail;return-1===yi(t,e=Vi(e,this))&&(t.push(e),e.requireFailure(this)),this},t.dropRequireFailure=function(e){if(Bi(e,"dropRequireFailure",this))return this;e=Vi(e,this);var t=yi(this.requireFail,e);return t>-1&&this.requireFail.splice(t,1),this},t.hasRequireFailures=function(){return this.requireFail.length>0},t.canRecognizeWith=function(e){return!!this.simultaneous[e.id]},t.emit=function(e){var t=this,i=this.state;function s(i){t.manager.emit(i,e)}i<8&&s(t.options.event+Ni(i)),s(t.options.event),e.additionalEvent&&s(e.additionalEvent),i>=8&&s(t.options.event+Ni(i))},t.tryEmit=function(e){if(this.canEmit())return this.emit(e);this.state=zi},t.canEmit=function(){for(var e=0;e<this.requireFail.length;){if(!(33&this.requireFail[e].state))return!1;e++}return!0},t.recognize=function(e){var t=wt({},e);if(!ii(this.options.enable,[this,t]))return this.reset(),void(this.state=zi);56&this.state&&(this.state=1),this.state=this.process(t),30&this.state&&this.tryEmit(t)},t.process=function(e){},t.getTouchAction=function(){},t.reset=function(){},e}(),Fi=function(e){function t(t){var i;return void 0===t&&(t={}),(i=e.call(this,mt({event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},t))||this).pTime=!1,i.pCenter=!1,i._timer=null,i._input=null,i.count=0,i}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){return[$t]},i.process=function(e){var t=this,i=this.options,s=e.pointers.length===i.pointers,r=e.distance<i.threshold,n=e.deltaTime<i.time;if(this.reset(),e.eventType&Ut&&0===this.count)return this.failTimeout();if(r&&n&&s){if(e.eventType!==Ft)return this.failTimeout();var o=!this.pTime||e.timeStamp-this.pTime<i.interval,a=!this.pCenter||li(this.pCenter,e.center)<i.posThreshold;if(this.pTime=e.timeStamp,this.pCenter=e.center,a&&o?this.count+=1:this.count=1,this._input=e,0===this.count%i.taps)return this.hasRequireFailures()?(this._timer=setTimeout((function(){t.state=8,t.tryEmit()}),i.interval),2):8}return zi},i.failTimeout=function(){var e=this;return this._timer=setTimeout((function(){e.state=zi}),this.options.interval),zi},i.reset=function(){clearTimeout(this._timer)},i.emit=function(){8===this.state&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))},t}(Ui),qi=function(e){function t(t){return void 0===t&&(t={}),e.call(this,mt({pointers:1},t))||this}vt(t,e);var i=t.prototype;return i.attrTest=function(e){var t=this.options.pointers;return 0===t||e.pointers.length===t},i.process=function(e){var t=this.state,i=e.eventType,s=6&t,r=this.attrTest(e);return s&&(i&qt||!r)?16|t:s||r?i&Ft?8|t:2&t?4|t:2:zi},t}(Ui);function Wi(e){return e===Kt?"down":e===Yt?"up":e===jt?"left":e===Gt?"right":""}var ji=function(e){function t(t){var i;return void 0===t&&(t={}),(i=e.call(this,mt({event:"pan",threshold:10,pointers:1,direction:Zt},t))||this).pX=null,i.pY=null,i}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){var e=this.options.direction,t=[];return e&Xt&&t.push(Pt),e&Qt&&t.push(Dt),t},i.directionTest=function(e){var t=this.options,i=!0,s=e.distance,r=e.direction,n=e.deltaX,o=e.deltaY;return r&t.direction||(t.direction&Xt?(r=0===n?Wt:n<0?jt:Gt,i=n!==this.pX,s=Math.abs(e.deltaX)):(r=0===o?Wt:o<0?Yt:Kt,i=o!==this.pY,s=Math.abs(e.deltaY))),e.direction=r,i&&s>t.threshold&&r&t.direction},i.attrTest=function(e){return qi.prototype.attrTest.call(this,e)&&(2&this.state||!(2&this.state)&&this.directionTest(e))},i.emit=function(t){this.pX=t.deltaX,this.pY=t.deltaY;var i=Wi(t.direction);i&&(t.additionalEvent=this.options.event+i),e.prototype.emit.call(this,t)},t}(qi),Gi=function(e){function t(t){return void 0===t&&(t={}),e.call(this,mt({event:"swipe",threshold:10,velocity:.3,direction:Xt|Qt,pointers:1},t))||this}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){return ji.prototype.getTouchAction.call(this)},i.attrTest=function(t){var i,s=this.options.direction;return s&(Xt|Qt)?i=t.overallVelocity:s&Xt?i=t.overallVelocityX:s&Qt&&(i=t.overallVelocityY),e.prototype.attrTest.call(this,t)&&s&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers===this.options.pointers&&St(i)>this.options.velocity&&t.eventType&Ft},i.emit=function(e){var t=Wi(e.offsetDirection);t&&this.manager.emit(this.options.event+t,e),this.manager.emit(this.options.event,e)},t}(qi),Yi=function(e){function t(t){return void 0===t&&(t={}),e.call(this,mt({event:"pinch",threshold:0,pointers:2},t))||this}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){return[Ot]},i.attrTest=function(t){return e.prototype.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||2&this.state)},i.emit=function(t){if(1!==t.scale){var i=t.scale<1?"in":"out";t.additionalEvent=this.options.event+i}e.prototype.emit.call(this,t)},t}(qi),Ki=function(e){function t(t){return void 0===t&&(t={}),e.call(this,mt({event:"rotate",threshold:0,pointers:2},t))||this}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){return[Ot]},i.attrTest=function(t){return e.prototype.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||2&this.state)},t}(qi),Xi=function(e){function t(t){var i;return void 0===t&&(t={}),(i=e.call(this,mt({event:"press",pointers:1,time:251,threshold:9},t))||this)._timer=null,i._input=null,i}vt(t,e);var i=t.prototype;return i.getTouchAction=function(){return[Mt]},i.process=function(e){var t=this,i=this.options,s=e.pointers.length===i.pointers,r=e.distance<i.threshold,n=e.deltaTime>i.time;if(this._input=e,!r||!s||e.eventType&(Ft|qt)&&!n)this.reset();else if(e.eventType&Ut)this.reset(),this._timer=setTimeout((function(){t.state=8,t.tryEmit()}),i.time);else if(e.eventType&Ft)return 8;return zi},i.reset=function(){clearTimeout(this._timer)},i.emit=function(e){8===this.state&&(e&&e.eventType&Ft?this.manager.emit(this.options.event+"up",e):(this._input.timeStamp=Et(),this.manager.emit(this.options.event,this._input)))},t}(Ui),Qi={domEvents:!1,touchAction:Tt,enable:!0,inputTarget:null,inputClass:null,cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},Zi=[[Ki,{enable:!1}],[Yi,{enable:!1},["rotate"]],[Gi,{direction:Xt}],[ji,{direction:Xt},["swipe"]],[Fi],[Fi,{event:"doubletap",taps:2},["tap"]],[Xi]];function Ji(e,t){var i,s=e.element;s.style&&(ti(e.options.cssProps,(function(r,n){i=xt(s.style,n),t?(e.oldCssProps[i]=s.style[i],s.style[i]=r):s.style[i]=e.oldCssProps[i]||""})),t||(e.oldCssProps={}))}var es=function(){function e(e,t){var i,s=this;this.options=wt({},Qi,t||{}),this.options.inputTarget=this.options.inputTarget||e,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=e,this.input=new((i=this).options.inputClass||(Bt?Si:zt?Li:Ht?Hi:$i))(i,gi),this.touchAction=new ri(this,this.options.touchAction),Ji(this,!0),ti(this.options.recognizers,(function(e){var t=s.add(new e[0](e[1]));e[2]&&t.recognizeWith(e[2]),e[3]&&t.requireFailure(e[3])}),this)}var t=e.prototype;return t.set=function(e){return wt(this.options,e),e.touchAction&&this.touchAction.update(),e.inputTarget&&(this.input.destroy(),this.input.target=e.inputTarget,this.input.init()),this},t.stop=function(e){this.session.stopped=e?2:1},t.recognize=function(e){var t=this.session;if(!t.stopped){var i;this.touchAction.preventDefaults(e);var s=this.recognizers,r=t.curRecognizer;(!r||r&&8&r.state)&&(t.curRecognizer=null,r=null);for(var n=0;n<s.length;)i=s[n],2===t.stopped||r&&i!==r&&!i.canRecognizeWith(r)?i.reset():i.recognize(e),!r&&14&i.state&&(t.curRecognizer=i,r=i),n++}},t.get=function(e){if(e instanceof Ui)return e;for(var t=this.recognizers,i=0;i<t.length;i++)if(t[i].options.event===e)return t[i];return null},t.add=function(e){if(Bi(e,"add",this))return this;var t=this.get(e.options.event);return t&&this.remove(t),this.recognizers.push(e),e.manager=this,this.touchAction.update(),e},t.remove=function(e){if(Bi(e,"remove",this))return this;var t=this.get(e);if(e){var i=this.recognizers,s=yi(i,t);-1!==s&&(i.splice(s,1),this.touchAction.update())}return this},t.on=function(e,t){if(void 0===e||void 0===t)return this;var i=this.handlers;return ti(pi(e),(function(e){i[e]=i[e]||[],i[e].push(t)})),this},t.off=function(e,t){if(void 0===e)return this;var i=this.handlers;return ti(pi(e),(function(e){t?i[e]&&i[e].splice(yi(i[e],t),1):delete i[e]})),this},t.emit=function(e,t){this.options.domEvents&&function(e,t){var i=document.createEvent("Event");i.initEvent(e,!0,!0),i.gesture=t,t.target.dispatchEvent(i)}(e,t);var i=this.handlers[e]&&this.handlers[e].slice();if(i&&i.length){t.type=e,t.preventDefault=function(){t.srcEvent.preventDefault()};for(var s=0;s<i.length;)i[s](t),s++}},t.destroy=function(){this.element&&Ji(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null},e}(),ts={touchstart:Ut,touchmove:2,touchend:Ft,touchcancel:qt},is=function(e){function t(){var i,s=t.prototype;return s.evTarget="touchstart",s.evWin="touchstart touchmove touchend touchcancel",(i=e.apply(this,arguments)||this).started=!1,i}return vt(t,e),t.prototype.handler=function(e){var t=ts[e.type];if(t===Ut&&(this.started=!0),this.started){var i=ss.call(this,e,t);t&(Ft|qt)&&i[0].length-i[1].length==0&&(this.started=!1),this.callback(this.manager,t,{pointers:i[0],changedPointers:i[1],pointerType:Rt,srcEvent:e})}},t}(_i);function ss(e,t){var i=Ei(e.touches),s=Ei(e.changedTouches);return t&(Ft|qt)&&(i=xi(i.concat(s),"identifier",!0)),[i,s]}function rs(e,t,i){var s="DEPRECATED METHOD: "+t+"\n"+i+" AT \n";return function(){var t=new Error("get-stack-trace"),i=t&&t.stack?t.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",r=window.console&&(window.console.warn||window.console.log);return r&&r.call(window.console,s,i),e.apply(this,arguments)}}var ns=rs((function(e,t,i){for(var s=Object.keys(t),r=0;r<s.length;)(!i||i&&void 0===e[s[r]])&&(e[s[r]]=t[s[r]]),r++;return e}),"extend","Use `assign`."),os=rs((function(e,t){return ns(e,t,!0)}),"merge","Use `assign`.");function as(e,t,i){var s,r=t.prototype;(s=e.prototype=Object.create(r)).constructor=e,s._super=r,i&&wt(s,i)}function ls(e,t){return function(){return e.apply(t,arguments)}}function hs(...e){}(function(){var e=function(e,t){return void 0===t&&(t={}),new es(e,mt({recognizers:Zi.concat()},t))};return e.VERSION="2.0.17-rc",e.DIRECTION_ALL=Zt,e.DIRECTION_DOWN=Kt,e.DIRECTION_LEFT=jt,e.DIRECTION_RIGHT=Gt,e.DIRECTION_UP=Yt,e.DIRECTION_HORIZONTAL=Xt,e.DIRECTION_VERTICAL=Qt,e.DIRECTION_NONE=Wt,e.DIRECTION_DOWN=Kt,e.INPUT_START=Ut,e.INPUT_MOVE=2,e.INPUT_END=Ft,e.INPUT_CANCEL=qt,e.STATE_POSSIBLE=1,e.STATE_BEGAN=2,e.STATE_CHANGED=4,e.STATE_ENDED=8,e.STATE_RECOGNIZED=8,e.STATE_CANCELLED=16,e.STATE_FAILED=zi,e.Manager=es,e.Input=_i,e.TouchAction=ri,e.TouchInput=Li,e.MouseInput=$i,e.PointerEventInput=Si,e.TouchMouseInput=Hi,e.SingleTouchInput=is,e.Recognizer=Ui,e.AttrRecognizer=qi,e.Tap=Fi,e.Pan=ji,e.Swipe=Gi,e.Pinch=Yi,e.Rotate=Ki,e.Press=Xi,e.on=fi,e.off=mi,e.each=ti,e.merge=os,e.extend=ns,e.bindFn=ls,e.assign=wt,e.inherit=as,e.bindFn=ls,e.prefixed=xt,e.toArray=Ei,e.inArray=yi,e.uniqueArray=xi,e.splitStr=pi,e.boolOrFn=ii,e.hasParent=ni,e.addEventListeners=fi,e.removeEventListeners=mi,e.defaults=wt({},Qi,{preset:Zi}),e})().defaults;const cs=e=>{Ue.Dev&&console.log("[HueHistory] "+e)};class ds{constructor(e,t,i,s=!0){this._type=i,this._id=i+(s?"-"+ ++ds.lastGeneratedId:""),this._onEnter=e,this._onExit=t}get id(){return this._id}get type(){return this._type}get isEntered(){return this._isEntered}enter(){this._isEntered||(cs("Entering "+this._id),this._onEnter(),this._isEntered=!0)}exit(){this._isEntered&&(cs("Exiting "+this._id),this._onExit(),this._isEntered=!1)}getHistoryState(){return{isHue:!0,hueId:this.id}}}ds.lastGeneratedId=0;class us extends ds{constructor(e){super(hs,hs,us.tryGetExternalId(e),!1)}static tryGetExternalId(e){return e.dialog||JSON.stringify(e)}}class gs{constructor(){this._pointer=-1,this._stack=[]}logState(e){cs(e),cs("Stack: "+this._stack.length),this._pointer<0&&cs("[x]");for(let e=0;e<this._stack.length;e++){const t=(e==this._pointer?"[x] ":"[ ] ")+this._stack[e].id;cs(t)}}resetBeforeStart(){const e=[];for(let t=this._pointer;t>=0;t--)e.push(this._stack[this._pointer]);return this._pointer=-1,{toExit:e,toEnter:[],found:!0}}push(e){for(;this._stack.length>this._pointer+1;)this._stack.pop();this._stack.push(e),this._pointer=this._stack.length-1,this.logState("Pushed "+e.id)}replaceIfPossible(e){if(e.type&&this._pointer>=0){const t=this._stack[this._pointer];if(t.type==e.type)return this._stack[this._pointer]=e,this.logState("Replaced "+t.id+" with "+e.id),{replaced:!0,oldItem:t}}return cs("Replace not possible for "+e.id),{replaced:!1,oldItem:void 0}}moveToExternal(e){const t=us.tryGetExternalId(e),i=this.moveTo(t);if(i.found&&0==e.open&&this._pointer>0){this._pointer--;const i=this._stack[this._pointer],s=i.getHistoryState(),r=Object.assign(Object.assign({},e),s);history.replaceState(r,""),this.logState(`Merged step ${i.id} into ${t} dialog close.`)}return i}moveTo(e){let t=!1;const i=[],s=[];for(let s=this._pointer;s>=0;s--){const r=this._stack[s];if(r.id==e){this._pointer=s,t=!0;break}i.push(r)}if(t)return this.logState("Moved to "+e),{found:t,toExit:i,toEnter:s};i.length=0;for(let i=this._pointer+1;i<this._stack.length;i++){const r=this._stack[i];if(r.id==e&&(this._pointer=i,t=!0),s.push(r),t)break}return t?this.logState("Moved to "+e):(s.length=0,cs("NOT moved to "+e)),{found:t,toExit:i,toEnter:s}}stepsBackBefore(e){for(let t=this._pointer;t>=0;t--){if(this._stack[t].id==e){const i=this._pointer-t+1;return this.logState(i+" steps back needed to go before "+e),i}}return null}isEmpty(){return 0==this._stack.length}}class ps{static get instance(){return ps._instance||(ps._instance=new ps)}constructor(){this._states=new gs,window.addEventListener("popstate",(e=>this.resolvePopstate(e)))}resolvePopstate(e){const t=e.state;let i;1==(null==t?void 0:t.isHue)?(window.history.replaceState(t,""),i=this._states.moveTo(t.hueId)):null!=t?(i=this._states.moveToExternal(t),i.found?i.found=!1:i=this._states.resetBeforeStart()):i=this._states.resetBeforeStart(),i.found&&(i.toExit.forEach((e=>e.exit())),i.toEnter.forEach((e=>e.enter())))}tryAddExternalStep(){if(this._states.isEmpty())return;const e=history.state;if(1==(null==e?void 0:e.isHue))return;const t=new us(e);this._states.push(t)}addStep(e){var t;if(this._states.isEmpty()){const e=new ds(hs,hs,"startStep");this._states.push(e),window.history.replaceState(e.getHistoryState(),"")}const i=e.getHistoryState(),s=this._states.replaceIfPossible(e);s.replaced?(window.history.replaceState(i,""),e.position=null===(t=s.oldItem)||void 0===t?void 0:t.position):(this._states.push(e),window.history.pushState(i,""),e.position=window.history.length),e.enter()}goBefore(e){const t=this._states.stepsBackBefore(e.id);t&&window.history.go(-t)}}class fs{constructor(e){this._el=e,fs.IsEnabled&&(this._el.addEventListener("touchstart",fs.resetCoordinates,!0),this._el.addEventListener("touchend",fs.registerCoordinates,!0))}destroy(){this._el.addEventListener("touchstart",fs.resetCoordinates,!0),this._el.addEventListener("touchend",fs.registerCoordinates,!0)}static preventGhostClick(e){for(let t=0;t<fs.coordinates.length;t++){const i=fs.coordinates[t][0],s=fs.coordinates[t][1];if(Math.abs(e.clientX-i)<fs.Threshold&&Math.abs(e.clientY-s)<fs.Threshold){e.stopImmediatePropagation(),e.preventDefault();break}}}static resetCoordinates(){fs.coordinates=[]}static popCoordinates(){fs.coordinates.splice(0,1)}static registerCoordinates(e){if("touches"in e&&e.touches.length-e.changedTouches.length<=0){const t=e.changedTouches[0];fs.coordinates.push([t.clientX,t.clientY]),setTimeout(fs.popCoordinates,fs.Timeout)}}}fs.Threshold=25,fs.Timeout=2500,fs.IsEnabled=!!("ontouchstart"in window),fs.coordinates=new Array,fs.IsEnabled&&document.addEventListener("click",(e=>fs.preventGhostClick(e)),!0);class ms extends ft{set hass(e){const t=this._hass;this._hass=e,this.updateHassDependentProps(),this.requestUpdate(Xe(this,"hass"),t)}constructor(){super("HueDialogTile")}updateHassDependentProps(){}setupListeners(){this.clickTarget&&!this._mc&&(this._mc=new es(this.clickTarget),this._mc.add(new Xi),this._mc.on("press",(()=>{const e=this.getEntityId();if(e){if(!this.actionHandler)throw new Error("Cannot open more-info - ActionHandler not set in "+this._elementId);this.actionHandler.showMoreInfo(e),ps.instance.tryAddExternalStep()}})),this._mc.add(new Fi({event:"singletap"})),this._mc.on("singletap",(e=>{this.tileClicked(e)})),this._gc=new fs(this.clickTarget))}destroyListeners(){this._mc&&(this._mc.destroy(),this._mc=void 0),this._gc&&(this._gc.destroy(),this._gc=void 0)}firstUpdated(e){super.firstUpdated(e),this.setupListeners()}connectedCallback(){super.connectedCallback(),this.setupListeners()}disconnectedCallback(){super.disconnectedCallback(),this.destroyListeners()}}var vs;ms.ElementName="hue-dialog-tile"+Ue.ElementPostfix,ms.padding=5,ms.height=90,ms.width=85,ms.titleHeight=35,ms.clickTransition="transform .15s",ms.hueDialogStyle=l`
    :host{
        -webkit-tap-highlight-color: transparent;
    }
    .hue-tile{
        background: ${a(Ue.TileOffColor)};
        width: ${ms.width}px;
        height: ${ms.height}px;
        padding: ${ms.padding}px;
        border-radius: ${Ue.HueBorderRadius}px;
        box-shadow: ${a(Ue.HueShadow)};
        overflow:hidden;
        user-select: none;
        transition: ${a(ms.clickTransition)};
    }
    .hue-tile:not(.no-click):active:hover{
        transform: scale(0.95);
    }
    .title {
        color:${a(Ue.LightColor)};
        font-size: 12px;
        line-height: 15px;
        font-weight:400;
        height:${ms.titleHeight}px;
        text-align: center;
        display: flex;
        flex-flow: column;
        justify-content: center;
        transition: ${a(Ue.TransitionDefault)};
    }
    .title span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    `,e([ye()],ms.prototype,"cardTitle",void 0),e([ye()],ms.prototype,"actionHandler",void 0),e([be(".hue-tile")],ms.prototype,"clickTarget",void 0);let _s=vs=class extends ms{constructor(){super(...arguments),this._effectQueue=new pt,this._sceneConfig=null,this._scene=null}set sceneConfig(e){const t=this._sceneConfig;this._sceneConfig=e,this._scene=new ct(e),this.updateHassDependentProps(),this.requestUpdate(Xe(this,"sceneConfig"),t)}updateHassDependentProps(){this._hass&&this._scene&&(this._scene.hass=this._hass)}tileClicked(){if(!this._scene)return;Ie("light"),this._scene.activate(),this._effectQueue.stopAndClear();const e=this.renderRoot.querySelector(".scene");if(e){e.classList.remove("clicked","unclicked");const t=1e3*vs.animationSeconds;this._effectQueue.addEffect(0,(()=>e.classList.add("clicked"))),this._effectQueue.addEffect(3e3,(()=>e.classList.add("unclicked"))),this._effectQueue.addEffect(t,(()=>{e.classList.add("stop-color-animate"),e.classList.remove("clicked")})),this._effectQueue.addEffect(50,(()=>{e.classList.remove("stop-color-animate","unclicked")})),this._effectQueue.start()}this.dispatchEvent(new CustomEvent("activated",{detail:{tileElement:this}}))}static get styles(){return[ms.hueDialogStyle,l`
    .scene {
        cursor: pointer;
    }
    .scene .icon-background {
        height: calc(100% - ${ms.titleHeight}px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scene .icon-background .color,
    .scene .icon-background .picture-color {
        height: ${vs.pictureDimensions}px;
        width: ${vs.pictureDimensions}px;
        border-radius: ${vs.pictureDimensions/2}px;
        box-shadow: ${a(Ue.HueShadow)}, inset rgba(0,0,0,0.1) -8px -8px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all ${vs.animationSeconds}s linear;
    }
    .scene .icon-background .color {
        background: var(--hue-tile-accent-color, darkgoldenrod);
    }
    .scene .icon-background .color ha-icon {
        color: var(--hue-tile-fg-color, ${a(Ue.LightColor)});
        transform: scale(${vs.iconScale});
    }
    .scene .icon-background .picture-color .picture {
        display: inline-block;
        height: ${vs.pictureDimensions}px;
        width: ${vs.pictureDimensions}px;
        border-radius: ${vs.pictureDimensions/2}px;
        background-position: center;
        background-size: cover;
    }

    .scene.clicked .icon-background .picture-color {
        background: var(--hue-tile-accent-color, darkgoldenrod);
    }
    .scene.clicked .icon-background .color,
    .scene.clicked .icon-background .picture-color {
        height: ${2*ms.height}px;
        width: ${2*ms.width}px;
        border-radius: ${ms.height}px;
        margin-left: -${2*ms.padding}px;
        margin-right: -${2*ms.padding}px;
    }
    .scene.clicked .icon-background .color ha-icon {
        animation: pop-icon 0.5s linear 1;
    }
    .scene.clicked .icon-background .picture {
        animation: pop-picture 0.5s linear 1;
    }

    .scene.unclicked .icon-background .color,
    .scene.unclicked .icon-background .picture-color {
        background: transparent;
    }
    .scene.stop-color-animate .icon-background .color,
    .scene.stop-color-animate .icon-background .picture-color {
        transition: none;
    }

    .scene .title {
        transition: all ${vs.animationSeconds/2}s linear;
    }
    .scene.clicked .title {
        color:var(--hue-tile-fg-text-color, ${a(Ue.LightColor)});
    }

    @keyframes pop-icon {
        50% { transform: scale(${2*vs.iconScale}); }
    }
    @keyframes pop-picture {
        50% { transform: scale(1.5); }
    }
    `]}getEntityId(){var e;return null===(e=this._sceneConfig)||void 0===e?void 0:e.entity}updated(e){this._scene&&e.has("sceneConfig")&&this._scene.getAccentColor().then((e=>{if(e){const t=e.getForeground(Ue.LightColor,Ue.DarkColor,20),i=e.getForeground(Ue.LightColor,new Ne("black"),20);this.style.setProperty("--hue-tile-accent-color",e.toString()),this.style.setProperty("--hue-tile-fg-color",t.toString()),this.style.setProperty("--hue-tile-fg-text-color",i.toString())}}))}render(){if(!this._scene)return G;const e=this._scene.getTitle(this.cardTitle),t=this._scene.getPicture();return W`
        <div class='hue-tile scene' title='${e}'>
            <div class='icon-background'>
                ${t?W`
                    <div class='picture-color'>
                        <div class='picture' style='background-image:url("${t}")'></div>
                    </div>`:W`
                    <div class='color'>
                        <ha-icon icon="${this._scene.getIcon("mdi:palette")}"></ha-icon>
                    </div>`}
            </div>
            <div class='title'>
                <span>${e}</span>
            </div>
        </div>
        `}};_s.ElementName=ms.ElementName+"-scene",_s.pictureDimensions=ms.height/2,_s.iconScale=.75*vs.pictureDimensions/24,_s.animationSeconds=1,e([function(e){return ye({...e,state:!0,attribute:!1})}()],_s.prototype,"_scene",void 0),_s=vs=e([me(_s.ElementName)],_s);class ys{static getIcon(e){const t=ut.hasHueIcons();let i;return i=e<=1?t?ys.HueOneIcon:ys.DefaultOneIcon:e<=2?t?ys.HueTwoIcon:ys.DefaultTwoIcon:e<=3?t?ys.HueThreeIcon:ys.DefaultMoreIcon:t?ys.HueMoreIcon:ys.DefaultMoreIcon,i}}var ws;ys.DefaultOneIcon="mdi:lightbulb",ys.DefaultTwoIcon="mdi:lightbulb-multiple",ys.DefaultMoreIcon="mdi:lightbulb-group",ys.HueOneIcon="hue:bulb-classic",ys.HueTwoIcon="hue:bulb-group-classic",ys.HueThreeIcon="hue:bulb-group-classic-3",ys.HueMoreIcon="hue:bulb-group-classic-4";let bs=ws=class extends ms{constructor(){super(...arguments),this.lightContainer=null,this.defaultColor=null,this.isSelected=!1,this.isUnselected=!1}static get styles(){return[ms.hueDialogStyle,l`
    .hue-tile.light{
        height: ${ms.height+ws.switchHeight}px;
        background:var(--hue-light-background, ${a(Ue.TileOffColor)});
        box-shadow:var(--hue-light-box-shadow), ${a(Ue.HueShadow)};
        transition: ${a(Ue.TransitionDefault)}, ${a(ms.clickTransition)};
    }

    .hue-tile.light.unselected{
        opacity: 0.7;
    }

    .selector.active{
        border: ${ws.selectorWidth}px solid var(--hue-light-background, ${a(Ue.WarmColor)});
        padding: ${ws.selectorSpacing}px;
        border-radius: ${Ue.HueBorderRadius+ws.selectorWidth+ws.selectorSpacing}px;
        margin: -${ws.selectorWidth+ws.selectorSpacing}px
    }

    .hue-tile.light .tap-area{
        display: flex;
        flex-flow: column;
        height: ${ms.height}px;

        cursor: pointer;
    }

    .title{
        color: var(--hue-light-text-color, ${a(Ue.LightColor)});
        padding-bottom: ${ws.titlePadding}px;
        font-weight: 500;
    }

    .icon-slot{
        display: flex;
        flex-flow: column;
        text-align: center;
        height: ${ms.height-ws.titleHeight-ws.titlePadding}px;
        /*height: calc(100% - ${ws.titleHeight}px - ${ws.titlePadding}px - ${ws.switchHeight}px);*/
        justify-content: center;
    }
    .icon-slot ha-icon {
        color: var(--hue-light-text-color, ${a(Ue.LightColor)});
        transform: scale(${_s.iconScale});
    }

    .switch{
        display:flex;
        flex-flow:column;

        height: ${ws.switchHeight+ms.padding}px;
        justify-content: center;
        background: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
        border-top: 1px solid rgba(80, 80, 80, 0.1);
        box-sizing: content-box;
        margin: 0 -${ms.padding}px;
    }
    .switch ha-switch{
        justify-content:center;
    }

    `]}updated(e){if(e.has("lightContainer")){const t=e.get("lightContainer");t&&t.unregisterOnPropertyChanged(this._elementId),this.lightContainer&&this.lightContainer.registerOnPropertyChanged(this._elementId,(()=>this.lightUpdated()))}if(this.lightContainer){if(this.lightContainer.isOn()){const e=this.defaultColor?new qe([this.defaultColor]):null,t=ut.calculateBackAndForeground(this.lightContainer,null,!0,e);t.background&&this.style.setProperty("--hue-light-background",t.background.toString()),t.foreground&&this.style.setProperty("--hue-light-text-color",t.foreground.toString())}else this.style.removeProperty("--hue-light-background"),this.style.removeProperty("--hue-light-text-color");const e=ut.calculateDefaultShadow(this,this.lightContainer,!1);this.style.setProperty("--hue-light-box-shadow",e)}if(e.has("isSelected")){this.renderRoot.querySelector(".selector").classList.toggle("active",!!this.isSelected)}if(e.has("isUnselected")){this.renderRoot.querySelector(".hue-tile").classList.toggle("unselected",!!this.isUnselected)}}lightUpdated(){this.requestUpdate()}tileClicked(){this.isSelected=!this.isSelected,this.dispatchEvent(new CustomEvent("selected-change",{detail:{isSelected:this.isSelected,lightContainer:this.lightContainer,tileElement:this}}))}getEntityId(){var e;return null===(e=this.lightContainer)||void 0===e?void 0:e.getEntityId()}render(){var e;if(!this.lightContainer)return G;const t=this.lightContainer.getTitle().resolveToString(null),i=null!==(e=this.lightContainer.getIcon())&&void 0!==e?e:ys.getIcon(1);return W`
        <div class='selector'>
            <div class='hue-tile light' title='${t}'>
                <div class='tap-area'>
                    <div class='icon-slot'>
                        <ha-icon icon="${i}"></ha-icon>
                    </div>
                    <div class='title'>
                        <span>${t}</span>
                    </div>
                </div>
                <div class='switch'>
                    ${ut.createSwitch(this.lightContainer,hs)}
                </div>
            </div>
        </div>
        `}connectedCallback(){super.connectedCallback(),this.lightContainer&&this.lightContainer.registerOnPropertyChanged(this._elementId,(()=>this.lightUpdated()))}disconnectedCallback(){super.disconnectedCallback(),this.lightContainer&&this.lightContainer.unregisterOnPropertyChanged(this._elementId)}};bs.ElementName=ms.ElementName+"-light",bs.titlePadding=10,bs.switchHeight=45,bs.selectorWidth=2,bs.selectorSpacing=2,e([ye()],bs.prototype,"lightContainer",void 0),e([ye()],bs.prototype,"defaultColor",void 0),e([ye()],bs.prototype,"isSelected",void 0),e([ye()],bs.prototype,"isUnselected",void 0),e([be(".hue-tile .tap-area")],bs.prototype,"clickTarget",void 0),bs=ws=e([me(bs.ElementName)],bs);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{I:Cs}=ae,ks=(e,t)=>void 0===t?void 0!==e?._$litType$:e?._$litType$===t,Ss=()=>document.createComment(""),Es=(e,t,i)=>{const s=e._$AA.parentNode,r=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(Ss(),r),n=s.insertBefore(Ss(),r);i=new Cs(t,n,e,e.options)}else{const t=i._$AB.nextSibling,n=i._$AM,o=n!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==n._$AU&&i._$AP(t)}if(t!==r||o){let e=i._$AA;for(;e!==t;){const t=e.nextSibling;s.insertBefore(e,r),e=t}}}return i},xs={},As=(e,t=xs)=>e._$AH=t,Ls=e=>e._$AH,Ts=e=>(e=>null!=e?._$litType$?.h)(e)?e._$litType$.h:e.strings,Ms=ge(class extends pe{constructor(e){super(e),this.et=new WeakMap}render(e){return[e]}update(e,[t]){const i=ks(this.it)?Ts(this.it):null,s=ks(t)?Ts(t):null;if(null!==i&&(null===s||i!==s)){const t=Ls(e).pop();let s=this.et.get(i);if(void 0===s){const e=document.createDocumentFragment();s=he(G,e),s.setConnected(!1),this.et.set(i,s)}As(s,[t]),Es(s,void 0,t)}if(null!==s){if(null===i||i!==s){const t=this.et.get(s);if(void 0!==t){const i=Ls(t).pop();(e=>{e._$AR()})(e),Es(e,void 0,i),As(e,[i])}}this.it=t}else this.it=void 0;return this.render(t)}});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class $s{constructor(e,t){isNaN(e)&&(e=0),isNaN(t)&&(t=0),this.X=e,this.Y=t}getYDiff(e){return this.Y-e.Y}getXDiff(e){return this.X-e.X}getDiff(e){return new $s(this.getXDiff(e),this.getYDiff(e))}getDistance(e){const t=this.getXDiff(e),i=this.getYDiff(e);return Math.abs(Math.sqrt(t*t+i*i))}toString(){return`[${this.X},${this.Y}]`}}class Os extends $s{constructor(e){super(e.clientX,e.clientY)}}class Ds extends $s{constructor(e){super(e.clientX,e.clientY)}}class Ps{constructor(e,t,i,s){this._currentMode=null,this._isMoving=!1,this._isConnected=!1,this._element=e,this._onDragStart=this.createDragStartDelegate(t),this._onDragMove=this.createDragMoveDelegate(i),this._onDragEnd=this.createDragEndDelegate(s),this.connectListeners()}get isMoving(){return this._isMoving}createDragStartDelegate(e){return t=>{if(this._currentMode)return;const i=Ps.isTouchEvent(t);e(t,i),this._currentMode=i?"touch":"mouse",i?(document.addEventListener("touchmove",this._onDragMove),document.addEventListener("touchend",this._onDragEnd),t.preventDefault()):(document.addEventListener("mousemove",this._onDragMove),document.addEventListener("mouseup",this._onDragEnd))}}createDragMoveDelegate(e){return t=>{this._isMoving=!0,e(t,Ps.isTouchEvent(t))}}createDragEndDelegate(e){return t=>{this._isMoving=!1,e&&e(t,Ps.isTouchEvent(t)),this.removeDocumentListeners(),this._currentMode=null}}connectListeners(){this._isConnected||(this._isConnected=!0,this._element.addEventListener("mousedown",this._onDragStart),this._element.addEventListener("touchstart",this._onDragStart))}removeDocumentListeners(){document.removeEventListener("touchmove",this._onDragMove),document.removeEventListener("touchend",this._onDragEnd),document.removeEventListener("mousemove",this._onDragMove),document.removeEventListener("mouseup",this._onDragEnd)}removeAllListeners(){this.removeDocumentListeners(),this._element.removeEventListener("mousedown",this._onDragStart),this._element.removeEventListener("touchstart",this._onDragStart),this._isConnected=!1}static isTouchEvent(e){return"touches"in e}}var Is;let Hs=Is=class extends ce{constructor(){super(),this._deadZone=5,this._wheelChange=3,this._wheelDebounceInterval=800,this._wheelCloseInterval=800,this._value=100,this._immediateValue=this._value,this.enabled=!0,this.width=100,this.height=60,this.heightOpened=200,this.iconSize=24,this._isOpened=!1,this._clickPosition=null,this._hasMouseMoved=!1,this._onDocumentMouseUpDelegate=()=>this.onDocumentMouseUp(),this._onDocumentMouseMoveDelegate=(e,t)=>this.onDocumentMouseMove(e,t),this._onDocumentWheelDelegate=e=>this.onDocumentWheel(e)}get value(){return this._value}set value(e){this.setValue(e,!1)}setValue(e,t){if((e=Is.cleanValue(e))!=this._value){const i=this._value;if(this._value=e,this.requestUpdate(Xe(this,"value"),i),t){const t=new CustomEvent("change",{detail:{oldValue:i,newValue:e}});this.dispatchEvent(t)}this.immediateValue=e}}get immediateValue(){return this._immediateValue}set immediateValue(e){if((e=Is.cleanValue(e))!=this.immediateValue){const t=this.immediateValue;this._immediateValue=e,this.requestUpdate(Xe(this,"immediateValue"),t);const i=new CustomEvent("immediate-value-change",{detail:{oldValue:t,newValue:e}});this.dispatchEvent(i)}}static cleanValue(e){return(e=Math.round(e))<1?e=1:e>100&&(e=100),e}changeImmediateValue(e,t){const i=(t?this.value:this.immediateValue)+e;this.immediateValue=i}applyImmediateValue(){this.setValue(this.immediateValue,!0)}toggleBar(e,t){this._isOpened=e,this._wrapperElement.classList.toggle("fast",t),this._wrapperElement.classList.toggle("open",this._isOpened),e||this.removeDocumentListeners();const i=this._isOpened?"open":"close",s=new CustomEvent(i,{detail:{isOpen:this._isOpened}});this.dispatchEvent(s)}get _isMouseDown(){return null!=this._clickPosition}onBarMouseDown(e,t){this._clickPosition=t?new Ds(e.changedTouches[0]):new Os(e),t||document.addEventListener("wheel",this._onDocumentWheelDelegate)}removeDocumentListeners(){this._dragHelper&&this._dragHelper.removeDocumentListeners(),document.removeEventListener("wheel",this._onDocumentWheelDelegate)}onDocumentMouseUp(){this._isMouseDown&&(this._hasMouseMoved?this.toggleBar(!1,!0):this.toggleBar(!this._isOpened,!1)),this._clickPosition=null,this._hasMouseMoved&&(this._hasMouseMoved=!1,this._isOpened||this.applyImmediateValue())}onDocumentMouseMove(e,t){if(this._isMouseDown){let i;i=t?new Ds(e.changedTouches[0]):new Os(e);let s=i.getYDiff(this._clickPosition);if(!this._hasMouseMoved&&Math.abs(s)>this._deadZone&&(this._isOpened||this.toggleBar(!0,!0),this._hasMouseMoved=!0,this._clickPosition=i,s=i.getYDiff(this._clickPosition)),this._hasMouseMoved&&this._isOpened){this.clearWheelTimeouts(!0);const e=-s/this.heightOpened*100;this.changeImmediateValue(e,!0)}}}onDocumentWheel(e){if(this._isOpened){const t=e.deltaY>0?-this._wheelChange:this._wheelChange;this.changeImmediateValue(t,!1),this.clearWheelTimeouts(),this._wheelSubmitTimeoutId=setTimeout((()=>{this.applyImmediateValue()}),this._wheelDebounceInterval),this._wheelCloseTimeoutId=setTimeout((()=>{this.toggleBar(!1,!1)}),this._wheelCloseInterval)}}clearWheelTimeouts(e=!1){this._wheelSubmitTimeoutId&&(clearTimeout(this._wheelSubmitTimeoutId),this._wheelSubmitTimeoutId=null,e&&this.applyImmediateValue()),this._wheelCloseTimeoutId&&(clearTimeout(this._wheelCloseTimeoutId),this._wheelCloseTimeoutId=null)}updated(e,t=!1){var i;super.updated(e);const s=e=>{this._wrapperElement.classList.add("instant"),e(),this._wrapperElement.offsetHeight,this._wrapperElement.classList.remove("instant")};if(e.has("width")&&s((()=>{this.style.setProperty("--rollup-width",this.width+"px")})),e.has("height")&&s((()=>{this.style.setProperty("--rollup-height",this.height+"px")})),e.has("heightOpened")&&s((()=>{this.style.setProperty("--rollup-height-opened",this.heightOpened+"px")})),e.has("iconSize")){const e=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector("ha-icon");ut.setIconSize(e,this.iconSize),this.style.setProperty("--rollup-icon-size",this.iconSize+"px")}e.has("enabled")&&(this._wrapperElement.classList.toggle("disabled",!this.enabled),this.enabled?this.connectListeners():(this.clearWheelTimeouts(!1),this.disconnectListeners(),this.toggleBar(!1,!0))),(e.has("immediateValue")||t)&&(this._valueElement.style.height=this.immediateValue+"%")}render(){const e=ut.hasHueIcons()?"hue:scene-bright":"mdi:brightness-7";return W`
        <div id='wrapper'>
            <div id='desc'>
                <span>
                ${this.enabled?W`${this.immediateValue} %`:G}
                </span>
            </div>
            <div id='bar'>
                <div id='value'></div>
                <div id='icon'>
                    <ha-icon icon="${e}"></ha-icon>
                </div>
            </div>
        </div>`}firstUpdated(e){super.firstUpdated(e),this._wrapperElement=this.renderRoot.querySelector("#wrapper");const t=this._wrapperElement.querySelector("#bar");this._dragHelper=new Ps(t,((e,t)=>this.onBarMouseDown(e,t)),this._onDocumentMouseMoveDelegate,this._onDocumentMouseUpDelegate),this._valueElement=t.querySelector("#value"),this.updated(e,!0)}connectedCallback(){super.connectedCallback(),this.connectListeners()}connectListeners(){var e;null===(e=this._dragHelper)||void 0===e||e.connectListeners()}disconnectedCallback(){super.disconnectedCallback(),this.disconnectListeners()}disconnectListeners(){var e;this.removeDocumentListeners(),null===(e=this._dragHelper)||void 0===e||e.removeAllListeners()}};Hs.ElementName="hue-brightness-rollup"+Ue.ElementPostfix,Hs.styles=l`
    :host {
        user-select: none;
        -webkit-user-select: none;
    }

    #wrapper{
        color: white;
    }
    #bar{
        position: relative;
        transition: all 0.25s linear;

        width: var(--rollup-width);
        height: var(--rollup-height);

        cursor: pointer;
    }
    #bar, #desc span{
        transition: all 0.25s linear;
    }
    .fast #bar,
    .fast #desc span{
        transition: all 0.15s linear;
    }
    .instant #bar{
        transition: none;
    }
    .open #bar{
        height: var(--rollup-height-opened);
        /*
        margin-top: calc(var(--rollup-height) - var(--rollup-height-opened));
        */
    }
    #desc{
        text-align: center;
        margin: 4px;
    }
    #value{
        position:absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
    }
    #icon{
        text-align: center;
        position: absolute;
        bottom: calc((var(--rollup-height) - var(--rollup-icon-size, 24px)) / 2);
        width: 100%;
    }

    /* Disabled */
    #wrapper.disabled{
        opacity: 0.6;
    }
    .disabled #bar{
        cursor: default;
    }
    .disabled #bar #value{
        height: 2px !important;
    }

    /* Hue styling: */
    #bar{
        box-shadow: ${a(Ue.HueShadow)};
        background: ${a(Ue.TileOffColor)};
        border-radius: calc(var(--rollup-height) / 2);
        overflow: hidden;
    }
    #value{
        background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%);
    }
    #desc span{
        border-radius: 10px;
        padding: 0 4px;
    }
    .open #desc span{
        box-shadow: ${a(Ue.HueShadow)};
        background: ${a(Ue.TileOffColor)};
    }
    `,e([ye({reflect:!0})],Hs.prototype,"enabled",void 0),e([ye({reflect:!0})],Hs.prototype,"width",void 0),e([ye({reflect:!0})],Hs.prototype,"height",void 0),e([ye()],Hs.prototype,"heightOpened",void 0),e([ye()],Hs.prototype,"iconSize",void 0),e([ye()],Hs.prototype,"value",null),e([ye()],Hs.prototype,"immediateValue",null),Hs=Is=e([me(Hs.ElementName)],Hs);class Bs{constructor(e,t){this._color=new Ne(0,0,0),this._offColor=new Ne(0,0,0),this._temp=3008,this._mode="color",this._icon=Bs.defaultIconName,this._isOff=!1,this._isPreview=!1,this.name=null!=t?t:"m"+Bs.counter++,this._parent=e,[this._markerG,this._markerPath,this._iconElement]=this.drawMarker(),this.position=new $s(this.getRadius(),this.getRadius()),this.makeDraggable()}getRadius(){return this._parent.getRadius()}dispatchChangeEvent(e){const t=e?"immediate-value-change":"change";this._parent.dispatchEvent(new CustomEvent(t,{detail:{marker:this,mode:this.mode,newColor:this._color,newTemp:"temp"==this.mode?this.temp:null}}))}boing(){this._markerG.classList.add(this.isDrag||this.isPreview?"big-boing":"boing"),setTimeout((()=>{this._markerG.classList.remove("big-boing","boing")}),200)}get position(){return this._position}set position(e){var t;(null===(t=this._dragHelper)||void 0===t?void 0:t.isMoving)&&(this._isOff=!1);const i=this.getRadius();this._position=Bs.limitCoordinates(e,i),this.renderPosition();const s=this.getPositionFromCenter(i);this.fixedMode&&this.fixedMode!=this._parent.mode&&(this._parent.mode=this.fixedMode);const r=this._parent.getColorAndValue(s.X,s.Y,i);if(r){if("hsv"in r){const[e,t,i]=r.hsv;this._color=new Ne(e,t,i,1,"hsv")}else{const[e,t,i]=r.color;this._color=new Ne(e,t,i)}this.renderColor(),this.mode=this._parent.mode,"kelvin"in r&&(this._temp=r.kelvin),this.dispatchChangeEvent(!0)}}setPositionFromCenter(e,t){const i=new $s(e.X+t,e.Y+t);this._position=Bs.limitCoordinates(i,t),this.renderPosition()}getPositionFromCenter(e=null){return e=null!=e?e:this.getRadius(),new $s(this._position.X-e,this._position.Y-e)}get isActive(){return this._parent.activeMarker===this}setActive(e=!0){this._parent.activateMarker(this,e)}get isDrag(){return this._markerG.classList.contains("drag")}set isDrag(e){e?this._markerG.classList.add("drag"):this._markerG.classList.remove("drag")}get isPreview(){return this._isPreview}set isPreview(e){this._isPreview!=e&&(e&&Ie("light"),this._isPreview=e,this.render(),this.boing())}get fixedMode(){return this._fixedMode}set fixedMode(e){this._fixedMode=e,e&&this.mode!=e&&(this.mode=e,this.refresh())}get mode(){return this._mode}set mode(e){this.fixedMode&&this.fixedMode!=e||(this._mode=e,this.renderMode())}refresh(){"temp"==this.mode?this.temp=this.temp:this.color=this.color}get isOff(){return this._isOff}set isOff(e){this._isOff=e,this.renderColor()}get offColor(){return this._offColor}set offColor(e){this._offColor=e,this.isOff&&this.renderColor()}get color(){return this._color}set color(e){if(this.fixedMode&&"color"!=this.fixedMode)return;"string"==typeof e&&(e=new Ne(e)),this._color=e,this.renderColor(),this.mode="color";const t=this.getRadius(),i=this._parent.getCoordinatesAndColor(e.getHue(),e.getSaturation(),t);this.setPositionFromCenter(i.position,t)}get temp(){return this._temp}set temp(e){if(this.fixedMode&&"temp"!=this.fixedMode)return;this._temp=e;const t="color"==this.mode;this.mode="temp";const i=this.getRadius(),s=this.getPositionFromCenter(i),r=this._parent.getCoordinatesAndTemp(this._temp,i,t?void 0:s);this.setPositionFromCenter(r.position,i);const[n,o,a]=r.color;this._color=new Ne(n,o,a)}get icon(){return this._icon}set icon(e){this._icon=e,this.getIcon(e).then((e=>{e||(this._icon=Bs.defaultIconName,e=Bs.defaultIcon),this._iconElement.setAttribute("d",e)}))}async getIcon(e){if(!e)return null;const t=customElements.get("ha-icon");if(!t)return null;const i=new t;return i.icon=e,await i._loadIcon(),i._path}getMarkerOffset(){let e=this._markerPath.getBBox();if(0==e.width&&(e=this.isActive||this.isPreview?Bs.markerActivePathSize:Bs.markerNonActivePathSize),this.isActive||this.isPreview){const t=e.width/2,i=e.height;return new $s(t,i)}{const t=e.width/2,i=e.height/2;return new $s(t,i)}}renderColor(){if(this._isOff)this._markerG.style.color=this._offColor.toString(),this._iconElement.style.fill=Ue.LightColor.toString();else{this._markerG.style.color=this._color.toString();const e="temp"==this.mode?-25:0,t=this._color.getForeground(Ue.LightColor,Ue.DarkColor,e);this._iconElement.style.fill=t.toString()}}renderPreviewActive(){this.isActive||this.isPreview?(this._markerG.classList.add(this.isActive?"active":"preview"),this._markerPath.setAttribute("d",Bs.markerActivePath)):(this._markerG.classList.remove("active","preview"),this._markerPath.setAttribute("d",Bs.markerNonActivePath))}renderMode(){this.mode==this._parent.mode?this._markerG.classList.remove("off-mode"):this._markerG.classList.add("off-mode")}renderPosition(){const e=this.getMarkerOffset(),t=this.position.X-e.X,i=this.position.Y-e.Y;this._markerG.style.transform=`translate(${t}px,${i}px)`,this._markerG.style.transformOrigin=`${this.position.X}px ${this.position.Y}px`}render(){return this.renderColor(),this.renderPreviewActive(),this.renderPosition(),this.renderMode(),this._markerG}makeDraggable(){this._dragHelper=new Ps(this._markerG,(e=>this.onDragStart(e)),(e=>this.onDrag(e)),(()=>this.onDragEnd()))}onDragStart(e){const t=this._parent.getCanvasMousePoint(e);this._dragOffset=t.getDiff(this.position),this.isDrag=!0,this.setActive(!this.isActive)}onDrag(e){this.position=this._parent.getCanvasMousePoint(e,this._dragOffset);const t=this._parent.searchMergeMarkerTarget(this);this._mergeTarget&&this._mergeTarget!=t&&(this._mergeTarget.isPreview=!1),t&&(t.isPreview=!0),this._mergeTarget=t}onDragEnd(){if(this.isDrag=!1,this._mergeTarget){const e=this._mergeTarget;this._mergeTarget.isPreview=!1,this._mergeTarget=void 0;this._parent.mergeMarkers(e,this).boing()}this.dispatchChangeEvent(!1)}connectAllListeners(){var e;null===(e=this._dragHelper)||void 0===e||e.connectListeners()}removeAllListeners(){var e;null===(e=this._dragHelper)||void 0===e||e.removeAllListeners()}drawMarker(){const e=document.createElementNS("http://www.w3.org/2000/svg","g");e.setAttribute("class","gm");const t=document.createElementNS("http://www.w3.org/2000/svg","path");t.setAttribute("class","marker-outline"),t.setAttribute("d",Bs.markerNonActiveOutlinePath);const i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("class","marker"),i.setAttribute("d",Bs.markerActivePath);const s=this.drawMarkerIcon();return e.appendChild(t),e.appendChild(i),e.appendChild(s),[e,i,s]}drawMarkerIcon(){const e=document.createElementNS("http://www.w3.org/2000/svg","path");return e.setAttribute("class","icon"),e.setAttribute("d",Bs.defaultIcon),e}static limitCoordinates(e,t){if(t<=0)return e;const i=e.X-t,s=e.Y-t,r=Math.abs(Math.sqrt(i*i+s*s));if(r>t){const e=t/r;return new $s(i*e+t,s*e+t)}return e}}Bs.counter=1,Bs.defaultIconName="default",Bs.defaultIcon="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",Bs.markerActivePath="M 24,0 C 10.745166,0 0,10.575951 0,23.622046 0,39.566928 21,57.578739 22.05,58.346457 L 24,60 25.95,58.346457 C 27,57.578739 48,39.566928 48,23.622046 48,10.575951 37.254834,0 24,0 Z",Bs.markerActivePathSize={width:48,height:60},Bs.markerNonActivePath="M6 0A6 6 0 006 12 6 6 0 006 0Z",Bs.markerNonActivePathSize={width:12,height:12},Bs.markerNonActiveOutlinePath="M8 0A8 8 0 008 16 8 8 0 008 0Z",Bs.styles=l`
        .marker-outline {
            fill: white;
            filter: url(#dot-shadow);
            transform: translate(-2px, -2px);
        }
        .marker {
            fill: currentColor;
        }
        .icon {
            transform: scale(1.2) translate(8px, 8px);
            transition: ${a(Ue.TransitionDefault)};
            fill: white;
            display: none;
        }
        .icon.text {
            transform: none;
            /*font-family: Roboto, Noto, sans-serif;*/
            font-size: 20px;
            font-weight: bold;
        }

        .gm.off-mode {
            opacity: 0.7;
        }
        .gm.off-mode .marker-outline {
            display: none;
        }
        .gm.off-mode .marker {
            filter: url(#dot-shadow);
        }

        .gm.active,
        .gm.preview {
            transition: scale 0.1s ease-in-out;
        }
        .gm.active  .marker-outline,
        .gm.preview .marker-outline {
            display: none;
        }
        .gm.active  .marker,
        .gm.preview .marker {
            filter: url(#active-shadow);
        }
        .gm.active  .icon,
        .gm.preview .icon {
            display: inline;
        }

        .gm.active.drag {
            scale:1.1;
        }
        .gm.preview {
            scale:1.25;
            opacity:0.7;
        }

        .gm.boing {
            animation: boing 150ms ease-in-out;
        }
        .gm.big-boing {
            animation: big-boing 150ms ease-in-out;
        }

        .marker-outline, .marker, .icon{
            cursor: pointer;
        }

        @keyframes boing {
            0% {
                scale:0.7;
            }
            50% {
                scale:1.05;
                translate: 0 -5px;
            }
            100% {
                /*scale:1;*/
            }
        }

        @keyframes big-boing {
            0% {
                scale:0.7;
            }
            50% {
                scale:1.15;
                translate: 0 -5px;
            }
            100% {
                /*scale:1;*/
            }
        }
    `;class zs extends Bs{constructor(e,t,...i){if(super(e,"mm"+zs.mm_counter++),this.markers=new Array,null==t||i.length<1)throw new Error("At least two markers needs to be passed to create HueColorTempPickerMultiMarker");zs.applyState(t,this),t instanceof zs?t.markers.forEach((e=>this.markers.push(e))):this.markers.push(t),i.forEach((e=>{e instanceof zs?e.markers.forEach((e=>{this.markers.push(e),zs.applyState(t,e)})):(this.markers.push(e),zs.applyState(t,e))})),this.renderIcon()}get position(){return super.position}set position(e){var t;super.position=e,null===(t=this.markers)||void 0===t||t.forEach((e=>zs.applyState(this,e)))}get isDrag(){return super.isDrag}set isDrag(e){var t;super.isDrag=e,null===(t=this.markers)||void 0===t||t.forEach((t=>t.isDrag=e))}dispatchChangeEvent(e){var t;e||null===(t=this.markers)||void 0===t||t.forEach((t=>t.dispatchChangeEvent(e)))}static applyState(e,t){t.mode!=e.mode&&(t.mode=e.mode),t.position=e.position}renderIcon(){this._iconElement.innerHTML=this.icon}get icon(){var e,t;return null!==(t=null===(e=this.markers)||void 0===e?void 0:e.length.toString())&&void 0!==t?t:""}set icon(e){}render(){const e=super.render();return this.renderIcon(),e}drawMarkerIcon(){const e=document.createElementNS("http://www.w3.org/2000/svg","text");return e.setAttribute("class","icon text"),e.setAttribute("x","24"),e.setAttribute("y","24"),e.setAttribute("text-anchor","middle"),e.setAttribute("dominant-baseline","middle"),e.innerHTML=this.icon,e}}var Rs;zs.mm_counter=1;class Vs{static saveWheel(e,t,i,s,r){const n=Vs.createKey(e,t,i,s),o=r.toDataURL();try{localStorage.setItem(n,o)}catch(e){console.error(e)}}static tryGetWheel(e,t,i,s){const r=Vs.createKey(e,t,i,s);try{const e=localStorage.getItem(r)||null;if(e)return{success:!0,dataUrl:e}}catch(e){console.error(e)}return{success:!1,dataUrl:null}}static createKey(e,t,i,s){let r=e;return"temp"==e&&(r+=`(${i}-${s})`),`HueColorWheelCache_${r}${t}x${t}v${Vs.version}`}}Vs.version=2;let Ns=Rs=class extends ce{constructor(){super(),this.mode="color",this._tempMin=2e3,this._tempMax=6535,this._isRendered=!1,this._markers=new Array,"undefined"==typeof ResizeObserver?this._ro=null:this._ro=new ResizeObserver((()=>this.onResize()))}setTempRange(e,t){let i=!1;e!=this._tempMin&&(this._tempMin=e,i=!0),t!=this._tempMax&&(this._tempMax=t,i=!0),i&&this._isRendered&&"temp"==this.mode&&this.drawWheel()}onResize(){this._markers.forEach((e=>e.refresh()))}firstUpdated(e){super.firstUpdated(e),this.setupLayers(),this.drawWheel(),this._isRendered=!0}updated(e){e.has("mode")&&e.get("mode")&&(this.drawWheel(),this.dispatchEvent(new Event("mode-change")))}setupLayers(){this._canvas=this.renderRoot.querySelector("#canvas"),this._backgroundLayer=this.renderRoot.querySelector("#backgroundLayer"),this._interactionLayer=this.renderRoot.querySelector("#interactionLayer"),this._backgroundLayer.width=Rs.renderWidthHeight,this._backgroundLayer.height=Rs.renderWidthHeight}get activeMarker(){return this._activeMarker}getActiveMarkers(){return this._activeMarker instanceof zs?this._activeMarker.markers:[this._activeMarker]}addMarker(e,t=!0){const i=new Bs(this,e);return this._markers.push(i),t&&this.activateMarker(i,!1),this.requestUpdate("_markers"),i}clearMarkers(){this._markers.length=0,this.requestUpdate("_markers")}activateMarker(e,t=!0){if(this._activeMarker==e)return;this._activeMarker=e;const i=this._markers.indexOf(this._activeMarker);i<0?this.unmergeMarker(e,!0):i+1<this._markers.length&&this._markers.push(this._markers.splice(i,1)[0]),this.requestUpdate("_markers"),t&&e.boing(),this.dispatchEvent(new Event("activemarkers-change"))}tryMergeMarkers(e){if(e){const{mm:t}=this.findMultiMarker(e);t&&(e=t);const i=this.searchMergeMarkerTarget(e);i&&this.mergeMarkers(i,e)}else for(let e=0;e<this._markers.length;e++){const t=this._markers[e];let i=!1;for(let s=e+1;s<this._markers.length;s++){const e=this._markers[s];if(this.canBeMarkerMerged(t,e)){this.mergeMarkers(e,t),i=!0;break}}i&&e--}}searchMergeMarkerTarget(e){return this._markers.find((t=>this.canBeMarkerMerged(e,t)))}canBeMarkerMerged(e,t){if(e.isOff)return!1;const i=.1*this.getRadius();if(t==e)return!1;if(t.mode!=e.mode)return!1;if(t.isOff)return!1;return t.position.getDistance(e.position)<=i}mergeMarkers(e,...t){const i=new zs(this,e,...t);!function(e,...t){t.forEach((t=>{const i=e.indexOf(t);i>=0&&e.splice(i,1)}))}(this._markers,...t);const s=this._markers.indexOf(e);return this._markers.splice(s,1,i),(e.isActive||t.some((e=>e.isActive)))&&this.activateMarker(i,!1),this.requestUpdate("_markers"),i}shouldUnmergeMarker(e){let t=!1;const{mm:i}=this.findMultiMarker(e);return i&&(t=!this.canBeMarkerMerged(e,i)),t}unmergeMarker(e,t=!1){const{mm:i,mmIndex:s,innerIndex:r}=this.findMultiMarker(e);return!!i&&(i.markers.splice(r,1),1==i.markers.length?(this._markers[s]=i.markers[0],!t&&i.isActive&&this.activateMarker(i.markers[0],!1)):0==i.markers.length&&this._markers.splice(s,1),t?this._markers.push(e):this._markers.splice(s,0,e),this.requestUpdate("_markers"),!0)}findMultiMarker(e){let t={mm:void 0,mmIndex:-1,innerIndex:-1};return this._markers.forEach(((i,s)=>{if(!(i instanceof zs))return!0;const r=i.markers.indexOf(e);return r<0||(t={mm:i,mmIndex:s,innerIndex:r},!1)})),t}drawWheel(){const e=this._backgroundLayer.getContext("2d");if(null==e)throw Error("Cannot create convas context!");const t=Rs.renderWidthHeight/2,i=Vs.tryGetWheel(this.mode,t,this._tempMin,this._tempMax);if(i.success){const t=new Image;t.onload=()=>{e.drawImage(t,0,0)},t.src=i.dataUrl}else{const i=e.createImageData(2*t,2*t),s=i.data;for(let e=-t;e<t;e++)for(let i=-t;i<t;i++){const r=this.getColorAndValue(e,i,t);if(!r)continue;const[n,o,a]=r.color,l=255;s[r.index]=n,s[r.index+1]=o,s[r.index+2]=a,s[r.index+3]=l}e.putImageData(i,0,0),Vs.saveWheel(this.mode,t,this._tempMin,this._tempMax,this._backgroundLayer)}}getRadius(){var e;let t=null===(e=this._canvas)||void 0===e?void 0:e.clientWidth;return t||(t=Math.min(Rs.maxWidth,Rs.renderWidthHeight)),t/2}getCanvasMousePoint(e,t){let i;i="changedTouches"in e?new Ds(e.changedTouches[0]):new Os(e);let s=i.X-this._canvas.offsetLeft,r=i.Y-this._canvas.offsetTop;return t&&(s-=t.X,r-=t.Y),new $s(s,r)}getColorAndValue(e,t,i){return"color"==this.mode?this.getColorAndHSV(e,t,i):"temp"==this.mode?this.getTempAndKelvin(e,t,i):null}getColorAndHSV(e,t,i){const[s,r]=Rs.utils.xy2polar(e,t);if(s-Rs.overRender>i)return null;const n=Rs.computeIndex(e,t,i)[0],o=Rs.utils.rad2deg(r),a=Rs.utils.getHue(o),l=Rs.utils.getSaturation(s,i),h=Rs.utils.getHSvalue(a,s,i);return{index:n,color:Ne.hsv2rgb(a,l,h),hsv:[a,l,h]}}getTempAndKelvin(e,t,i){const[s]=Rs.utils.xy2polar(e,t);if(s-Rs.overRender>i)return null;const[r,,n,o]=Rs.computeIndex(e,t,i),a=n/o,l=Math.round(Rs.utils.hueCurveScale(a,this._tempMin,this._tempMax));return{index:r,color:Ne.hueTempToRgb(l),kelvin:l}}static computeIndex(e,t,i){const s=2*i,r=e+i,n=t+i;return[4*(r+n*s),r,n,s]}getCoordinatesAndTemp(e,t,i){e<this._tempMin?e=this._tempMin:e>this._tempMax&&(e=this._tempMax);const s=2*t;let r=Rs.utils.inverseHueCurveScale(e,this._tempMin,this._tempMax)*s-t;r=Math.round(r);let n=0;if(i){const e=Math.ceil(Math.sqrt(t*t-r*r)),s=-e;n=i.X,n<s?n=s:n>e&&(n=e)}const o=Ne.hueTempToRgb(e);return{position:new $s(n,r),color:o}}getCoordinatesAndColor(e,t,i){const s=Rs.utils.getDeg(e),r=Rs.utils.deg2rad(s),n=Rs.utils.getR(t,i);let[o,a]=Rs.utils.polar2xy(n,r);a=Math.round(a),o=Math.round(o);const l=Rs.utils.getHSvalue(e,n,i),h=Ne.hsv2rgb(e,t,l);return{position:new $s(o,a),color:h}}render(){return W`
        <div id="canvas">
            <svg id="interactionLayer">
                <defs>
                    <filter id="dot-shadow">
                        <feDropShadow dx="0" dy="0.5" stdDeviation="1" flood-opacity="1"></feDropShadow>
                    </filter>
                    <filter id="active-shadow">
                        <!-- Shadow offset -->
                        <feOffset dx="0" dy="-10" />

                        <!-- Shadow blur -->
                        <feGaussianBlur stdDeviation="7" result="offset-blur"/>

                        <!-- Invert drop shadow to make an inset shadow -->
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                        
                        <!-- Cut color inside shadow -->
                        <feFlood flood-color="#0005" flood-opacity=".95" result="color"/>
                        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>

                        <!-- Placing shadow over element -->
                        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>

                        <!-- Classic drop shadow -->
                        <feDropShadow dx="0" dy="1.0" stdDeviation="2.0" flood-opacity="1"></feDropShadow>
                    </filter>
                </defs>
                ${this._markers.map((e=>e.render()))}
            </svg>
            <canvas id="backgroundLayer"></canvas>
        </div>`}connectedCallback(){var e;super.connectedCallback(),null===(e=this._ro)||void 0===e||e.observe(this),this.onResize(),this._markers.forEach((e=>e.connectAllListeners()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._ro)||void 0===e||e.unobserve(this),this._markers.forEach((e=>e.removeAllListeners()))}};Ns.ElementName="hue-color-temp-picker"+Ue.ElementPostfix,Ns.overRender=2,Ns.maxWidth=400,Ns.renderWidthHeight=600,Ns.utils={hueCurveScale:function(e,t,i){let s=0;const r=i/t/65;return s=e<=.1?this.linearScale(10*e,0,r):e<=.97?r-this.linearScale((e-.1)/.9,0,2*r):-r+this.linearScale((e-.97)/.03,0,r),(Math.pow(i/t,Math.pow(e,1.55))+s)*t},inverseHueCurveScale:function(e,t,i){let s=0,r=1,n=.5;for(;r-s>1e-4;){this.hueCurveScale(n,t,i)<e?s=n:r=n,n=(s+r)/2}return n},linearScale:function(e,t,i){return(i-t)*e+t},xy2polar:function(e,t){return[Math.sqrt(e*e+t*t),Math.atan2(t,e)]},polar2xy:function(e,t){return[e*Math.cos(t),e*Math.sin(t)]},rad2deg:function(e){return(e+Math.PI)/(2*Math.PI)*360},deg2rad:function(e){return e/360*2*Math.PI-Math.PI},getHue:function(e){return(e-=70)<0&&(e+=360),e},getDeg:function(e){return(e+=70)>360&&(e-=360),e},getSaturation:function(e,t){const i=Math.pow(e,1.9)/Math.pow(t,1.9);return i>1?1:i},getR:function(e,t){return Math.pow(e*Math.pow(t,1.9),1/1.9)},getHSvalue:function(e,t,i){let s=.95;return s=Rs.utils.fixHSValue(s,t,i,e,60,!0),s=Rs.utils.fixHSValue(s,t,i,e,180,!0),s=Rs.utils.fixHSValue(s,t,i,e,240,!1),s=Rs.utils.fixHSValue(s,t,i,e,300,!0),s>1?1:s},fixHSValue:function(e,t,i,s,r,n,o=5){if((n?t>i/2:t<3*i/4&&t>i/4)&&s>=r-o&&s<=r+o){let t=r-s;t<0&&(t=-t),t=o-t,n?e-=t/360:e+=t/360}return e}},Ns.styles=l`
    :host {
        user-select: none;
        -webkit-user-select: none;
    }

    #canvas {
        position: relative;
        width: 100%;
        max-width: ${Rs.maxWidth}px;
        margin: auto;
    }
    #canvas > * {
        display: block;
    }
    #interactionLayer {
        color: white;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    #backgroundLayer {
        width: 100%;

        border-radius: 50%;
        box-shadow: ${a(Ue.HueShadow)}
    }
    ${Bs.styles}
    `,e([ye()],Ns.prototype,"mode",void 0),Ns=Rs=e([me(Ns.ElementName)],Ns);class Us{}var Fs;Us.ModeColorIcon64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAECxJREFUeJzFW3usbUdZ/9as136cs27Va9BgUoSb8tDQq9SqtJreWKCINVCEmPoAQ1P+aEUSa4KaGq8hxBcaMQhCeBgKKSpFbZvekggEbVGk9JVoq1cvUbFGEulZ5+zX2mut8ZuZb2a+mb32uVd6ru7k1++bWXuvPb/f95vH2j1XwEV61RVk9XG4rH52cn39PPFr9Xemd9ffnf19fVU+q3+okPUPl7K+YSTrGxFvxPxm7PvZfFHflj1Z/1J6pj4t3lH/evLa+p3Ji+rfh+JijVMc9Q1rSI/XeXI9SHEfpPnfQVb8BRTj26Gc/giMd14Io90JjCuA8a7BiKD6RrsjKHcug2L6CvzML0JW/ilk2RcgE39ZfzD58foO+JajHu+RCVDDN52oRfW7kJdfhHz0SRhNrkXCFUyQ3GQHdLSkxzsReUS549sKJfWVO1MU5Gq858cgy79Yf0L8YX03vPioxv2MBKjhBWmdnLiqTi89gxV7Akm+FXYvuRR2j6UwPQawg5gSJljhqYVqU5/CmNraGcoJFsc8yipBUZ6NTroZivLR+tPpA/VfJy+v/wby/xcBanjJcRDlB5H4p7DCr9Ckd3Ggu5b4rqk6x3gLgsoT+XJ3EwXH9KU4ve6GQtxZPw7P+T8VoE6ufhmkxX1Qjn8aJtMJTHeMzV1UxKZIZIIRMZqGKCfmWjlVREy74Dlr5xPClEDtTMcCstENkGdn6rO4YH4ZkosqQA3Xj2tx3W/iAO9FklfALlZK41iI6hAXTHa91Z0Lqk0nuHWgOsQFlYn59Pm49nxcFuL9X/sqHLsoAtTw+hMginuxcr+Alc5hB79YYUqw7R2a5yoqN4yHYN2wY6CcoIF5wcDbOYHnzhU7IPNpKrPRm2SafvarX4OTRypADW94Flr+/VCOTmlLKwJjsvdkSqB+lY+nfgpojA1KRDE2NtdWp3Zhbc9ybfUxgeUZz01bpmOHPilPdkn6oX/fS779SASo4RYkP/ocErrGVXxnx1d8SnNeVXxnN8R0d9gFowGUDAW5oogcoR0wZQ5AZFOQhF7sQJsoTE6uk/SBJ3GLekYC1HDbCUjLO7HSl/lKR9AC2DZbDO2C6OzOQQ5w1mdt5wCyd7wQZlMWsfqZQS+mijh0CBVbGH/rGtI/ebhOXvJ1CVDD7WOc8++DYnSNs7u2/BiC9iD4NGD2t1AESzYl8tjy48jmhKBv5K0vlPXHSJ4AYyUAojzZgvjA52u45H/vADE6jZU6Zea2JW/n+cRjYy2w19l64NYCqvRoHM15thbkk2gdYGBiSJr7fWqqroj3uvITIm8xuryB9F2fqoe3yEEB6uR3XoZHz7e6QVuSOh+HhLY5YMScUMYOsHlMnvKg4qPQBQq68iOq/MhVnwhz8hpryH+yheTGCxKghveoE947cMXPYTTyFtZ53B4zi0ft8WTzemFhrU9tS1STHYV5yiJBpiWSL3HeW/IjtL1CSTFGmeB68KufqOGyQwWo4SMpkn8nDu6KYPAx2cOEiGGFKEbDyFnMI/LZyM13C0VeEZeJrb4haSvv8xjFCRTh9/6oRpW2OiDJvg+//MccqZIIloysq/SItVnO4e4x9n3FFsIBaY5yo/IysdXfqLQmy93ARcCpcC1OhVduF0CMbsfqT8z8HCA0BEeci8Lmu9sBeLVLgiVeErjdSwMnQmGIq6o78uVWGNK8rVBkDYjTgwLUcEbt+dfio6YfnMoVShULn5eUFyy6Prquwd8zMnleMAEwzwomQOGRGtK4FWv0CCmMCAodYB+Y6HPftmjxabl1uW6/+LdruGrTAaK8BQeZ6oHyCm/MWyKjhaB2ycRyZPl72fW88MhIiIA0EU+LIJcJkReGaO9IloEQmyiJuBMAp4K49TRti8JU//PH8cteE85PGlxAbKDyW2MRfdYKwCsfVTzbJG5cUEKit71CE7cwlc81qc6hiCvunGD7cDF8eQvmNwTjgKT8fvzSb3ODyQtvV96nkW/GLO6P85zdK2fEMU9zIkq5ILBcJjkSzYi4yTsdcxatKFaIjOUGLWEN2TeuILleC1DDExkK8BZcbNKN1dg5IZq72ZAY+QD5IkRhBWNI85A8F8GRzxl5n3eBAJuEbV+LsXUxs9Pgpltr2EEHFM/FVfdKvypbkpZo1M64M8pNkgEGRND3YpXPiq0iKPISbPUzV/mOOaAPKuyvt67invzaOwDwePyCBpLvEPglz8dVtgrmXJpvWjMdqFiWYcx8dEgJ6hrlQ+8RBJsnGUWTS0gD8gqqT+o83YougBIgJXFSyjXyNcDlKEDxPT1WQaqVFklJK4JbnGybiZBlw+SzAQz1W3EUBEfqckteOtIhcekcEaIl0h2RZoTV4kfIdFyBuFL0SfFdiniPJHsSweQohrJhaqD348AZrO3m80CVA9LMGelA5RX5hJO3VbUOSF001RUDFedVFppoGxFXaLQAyUnRJsnzWiGgQ/RovV4YSByIiQY9Xre5tqirVhoiZVHngpCGpDVx6lfXE2rjoE21RYB+C7oLQMuwDpCcEE2SXNqIBNYKqYr4RswVOi0MiZJYCAepCcQWjkg6CI+UiaLuYRGRtkL0LlrSqYtDZLuIcEg81RGPxMoBx8QqSSZKgBXCCaFESJUQHl1KwEF3JEhnReCOSA4hnojQEYeS94QlHtrCyidEmMdEVZTIJrzKmqwhnWisnAACUADABKBJPNYsrnFsrUKCX4LohYfUDlH9gIIAiqGA/wnASIr4moI+iWnILegZugG0BJ63kSANtY0I4MQwAljyQFDEgQQAg5YEaSlXUMQ7CGNPeQ9WEMfP/CdxDUYeNFEvArjYRwJsigCMOI1PkwVygufQOAESXXQFsaTExhgNAxelZTduI3QMPYMWxHNmLysCOPL8c/Ze/P42X0f5OhrzECcO0eA3rhAqug9Kupn0N12zvlb6L9aDkTRIaeAGLz0ktaUFkQ2Jh/AiSLy/R+siJy5ZtWUQvSBSY6VBAqykJx0IIT3WEVoibdGxyIVwgij0nrwVAuQQcW996wS/DnA3SIeQsHRELVlPWqLTLXnTFkvsW+Kdl0qAPoQWoCco8r0RQLXXHEqAnkToTd4ReurrZNjnAEPgIggmhmDrgAjmviGuiPVEuEeyMYwAC8wtlAP+VQtAWMkBEbgQEfn2EGgxOk/cCdAz8tKT7tnc74KKJ9T22+Hm4cifDcwZwK764CrPxViYvn0lwDlOLiYZt9vDiHdh9QN0m9XfWDMGnBCKsw1Dp8Q0OjEmbnew6wFOhXNqCnxpgYNTWCq0FAkrhZYioWFRozVxrdBGoP5OYlVwj4wdYkWIV/fOxSRwQUd7e+umwRD8k2BHvwGED0z2oSn/knLAQzFxTtaSbxjidkPEnQgRuh5tiSwVAtJ8IQVwhxlbLS9IuMeH70kiMVI6CqfuWOwfkrwYrX7YKlAAgH9AQrPzkY7JuuqyKg9Vv+uFJr4m8s4BclOITQfY6nMHxGKJSIQ4hsKwiF+ZP6zOAWfR/g8v8Fs5ljhZFmvKqW2x4n1KLNbPsW7xsROPjKtWGoHYGmLbbmuV9uRmYff08DRnr8fH3dZ9zj4Axb8B8N8F9C9H/4wOeFy8DaoGp8G7kah0JNth4pokizEanuMDhF4bkGXTSecSN02ibdSdN4JjbJwPYei6YELxJ0MvRA/5HVB9ZU//KowL4WeR7H8sqOox4RWr7mHk7WcMedyCsKyNnvsR4SFIdtzeIAdbsCmCd0P87O8fjVGAWkL5ccVdC/AbUP0nToN75yTAHEeysFizHLFkkUML1ygh8DFzbWy/avvhRXNg23UYeGILcSHvsU9/gkX/OwDa/zMA2b84AdQLDz3vVsQteRdXoQDbsFyp6gtEQi6RhnhrEG+h7rDFDl7u0KWf1jhJjiTKzwdBz/8mb/S5IHsPVI90gQDvheoxnAYPDongMCQG9WniDZHHyisHNHw3oW1SE42dIONnEU9+dQi5VeCCWDifr4G7Ij0nqwfut7yD/zuMR+HTWPFmhqRmVP2ZxdK0h7BYJRgFrR9SI94R7FnD5fFhi1ygjuNz3C/Vs8mSSBgAi/YaRNcSds3/+sN+AcI757/COQcCoPqfwXXgHktYY8UiE8Nibsk3lnxvdo8I9mzBD1pOhD6EcsKCCbB0AJdb0rwvFEy1RfB5rP6DuPfftVWAu6Ba4wB+Hqv/pCJ3sApFOFBY+Hy2TPCaMG5B8guNTfLupEkIjt4ReV15mWgsFAIBYsAh12LB0qfwBHgbVJ+cbxVAve6H6stYnV9G0p0j7QiHDjjA0R7gqJeNdNZ3B6MBF8TPGZb0IhJiJc3gV3KIIGwh7qfGkCvw5Pd2qD76hZjv4F+JIY+7sKof3l/4qluovv2lieraHMnPcCVbYHTb5pqdJNmJMgCSnrcGCz3vyRm9wRIfnOaQ6KmgXLAJCPLlwHusADj/75GQvm+I66AAD0Il1VTAKfDIPhqmJuI2qj4VZ3ZXUGcHQpwvWk/UEWYicMx7glQwU0BFJcTcERM6zjHOmRD+PRCLcA73/Zuhem97wQKo1+NQ7eFU+Bkk+YitvHYBJx9XOYImPFB9Ve05J07kFwxLSUIExAUjBhtkN10hzuK8vwmq33pqG89D/1b4LJ4W0Ak3IOGnaiS+R9hfmjOCwqzxua38jBC3Z62BdYJuWwF4jpj1VH3EjFwwizA/BCjWHh55Xy+r058+jON5/1r8K7I6hwP6wb0FPPL0zAigdgcLJYDOm6jPYk3tdYTWC6Lyg46hVwIYHCD5AyngAEkdOPKqLVwMr2kBzuIT3ymo3vbw+fhd0L8X2JPVWZwON6HtH91q99j2lLvIF79ueCq4dcBNCb8VmiiC9WAOgwsfzvn0zVDdel7yFyyAejWyeghPt9fgVvYRFELyiqt8xuLssMrTdDhoI1D1Zx1VXld/0wW++qbavPoo0D34tHeVrN50qO2/LgH0q6ue7jJ4A+7PP4VEz+4j2Rh1Y2DzfYv1FiD5/c7HujXQfV0C++iCfRRA/VXbPopQ45D3IaFochTgKVzwbsHV/jVQ/cTWBe+ZC6BeT1dS/lf1URzjq3BanEG7t6rSbuFr/MI3tCDaxW7WssWPL4C9nwZ6HZAGc+ALn7DtDi3/V1j1V8vqlX8A1Y8ObnVHK4B9/Vv1j52AV+MDzOuQ4GMH1gUNi6z6NUFXvaGKWwcMQTmgN/GgM9V3MNPgHD7cvBG3ueugOrVxwrv4AqjXE9VKPlr9Wfe31eW4XV6NQtxZr+C/95T9ESruNSavaUro9trEPRVbg7r1+V5noKcDkt9DIWqcBmj3GteAP0fi13XVC58rq5N3QHXl/PwDvVgC8Nfnqgf6FG7Eh8ErUIyfQ1s/jgve+mDL/D9ovQsOWOX5dqgd0OMU65MnF11yeyOTKzqZvlZWz7n//AO6sNfR/uvx+yoJd1fn5B9X78LxvxTF+AF86HkzbnkfQEEeQkH2AtvHU0AvfLCP5B/DNeDDuMa8Be9xCh/iv1d+8yVvh284/k9wybO6oxzy/wBj4DViryyfzgAAAABJRU5ErkJggg==",Us.ModeTempIcon64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAFa0lEQVR4nO2bW2xUVRSGv7XPmZnSRtpU64XgFUNUiilKJZJi5VYMQgjRGhNDDPFRgwkajS8kPphAiNZn1MQYIzEYUaOAChTkGtDYWLXEBAwKCXJRILbQ6cz5fSjVaTsz7dxLx+9pZp+91/n3Ouvs+zEKiL68t4rYhNkE1oipAVk9plvBKpMXUC9wHKwLpw6MQ4Ri+2zhdxcKpdHybVCbm2sIRZcCrZgtACbkaDGKbA8Em3D+x7Z475l86Bwgbw7QlqZ7EKtBT2JWlS+7g2+iXmAznmuzR/YcyofJnB2grx66mz6tw2wJlv+ISn1jduH0cq6OyFqwNjfXEHGvYnoWw8tFRNYECMf7xPSSLdl9KhsTWTlAXy1YhIK3kN2cTfkCcBZnq6xl+8ZMC2bkALU3+/RFXkN6EcxlerOCY7xDbXiVzfy8Z/RFRon2t9Tyt20Ea8lOXZGQviVuy23xthOjyT4qB2j70htQbBvQkJO44vErTgtt/rajI2Uc0QH9lQ8OYNyeH21F4wwKmmzh1l/SZUrrAO1vraXn8g6unic/BPuVSPCwzfn8t5Q5Ul1Qe7NPvOYLjLH9zo/M91THm1I1jH7KYkHta7gx3uCNjhlc8DYIVhho6MWkEaCdTyyC+BZsDHZ1WWMrbe6md4elDk1Q+7IaiPyAMVYGOXnCLmBMt+YPf09MHf4KuMpXYbxVHoBqpDbg8cTEQRGgXSvuxqkTSjS2LwbOzbOm99oH/g6OAGfrMDd+Kw8g1gsaBxrEfyNAB1feQx8/FnVKWyqkFpvz7teQGAExtxpn47/y/awGvoYrEaD252uIXD4BBVrJGXMoINBUa9pwtD8CJvQtRX6ZVB4Ah2etwNorr4Dfyjga8oySVmCtqeOFKqI6Q86rt1cZkvDit/n0ebMxlVflAQwj7s3zMa+xDDq+5DgafTyvAZWpB4wGH/x6XJk6QNT7uNCtpdZRMoyJPs5PvlFZJvhY6kWhcsDHhUqtoaT874D/HVD2DjC/F7NIqYWUCh8XOo7Z1FILKQmi28cLd0GZOgC6fCzUgdmyUispER0+XsWhJDtGZYIO+1QE+4iGo2DhUsspOhbf2b8oevrgdoz5pdZTVEQXdbOm9U8ELLQJ58rLAQQfmVn/Sogu/lJHPPZ72YwHJBFoul077af/doYuHtuI2ZOl1FU0Au216jvmQOLOkDehDaM8HOCCNwZ+Dt4d7v2zHezhogsqLkcI19SbWRyGOkDdDxBzB7FxvEcolluo4pOBv8NPiEjvCVYUV1VxMNgBLDQzJaQNRtKNsSDoBLuuqOoKjl3yHfeZ2ZHE1GELgmZ2qjemVUIfFE9cUVgTGlJ5SHNOsLsv/jbwTEElFQuxtTLkHk0M/QFSH5SUKi9G47uBmQUVV3iOEfYeqDY7l+xi2tb+bHf3ZOdFvoGr7pwwAJLOhsxvnlhhP6fKM2J3d/6SpkQVOwDU5VVdwVG3ibl1VeHD6XKNqr8/fVlTY7G+bXaVnBiXOIuxeNIIlYcMPpg42aNb4rG+TzBm5Cav4BzzQ6Glk9KEfSIZjfhOSpW9F3s3gD2VnbYCY2wNK7xicnXyBi95kQyRZEfPR58OTG8C1ZmWLxCXTKy5sybyerKuLh1Zj/k7z/Xc7Jm1AY9layMvSDtc4J67q65i2CBnNOQ86en869JcxbVecH+utjLkiEmvTL+u8tNMn3oieZn1SbLvz11eEATBakRLob4zkCQz9nnOe6Ph2shnA1PaXMj7tHfvH+enhAi3SmqVNCMfU2uDLsRHRvDhrJuu+SkfOhNsF449J3tuCRTMcx6NEg2S6s1sYroykroNusxcB8QPe15o54PXVxzNJczT8Q+nqrqMIUr4CAAAAABJRU5ErkJggg==";let qs=Fs=class extends ce{constructor(){super(),this.mode="color",this.showColor=!0,this.showTemp=!0,this.colorPicker=null,this.onColorPickerModeChange=()=>{this.colorPicker&&(this.mode=this.colorPicker.mode)}}selectPossibleMode(){this.showColor?this.mode="color":this.showTemp&&(this.mode="temp")}updated(e){if(super.updated(e),e.has("colorPicker")&&(this.unregisterColorPickerEvent(e.get("colorPicker")),this.colorPicker&&(this.onColorPickerModeChange(),this.registerColorPickerEvent())),e.has("mode")&&this.colorPicker&&("color"!=this.mode&&"temp"!=this.mode||(this.colorPicker.mode=this.mode)),e.has("mode")&&"brightness"==this.mode){const e=this.renderRoot.querySelector(".wheel.brightness ha-icon");ut.setIconSize(e,Fs.wheelHeight)}}render(){return this.showColor||this.showTemp||"brightness"==this.mode?W`
        <div class='controls'>
        ${Ms("brightness"==this.mode?this.createBrightnessWheel():W`
                ${this.createWheel("color")}
                ${this.createWheel("temp")}
            `)}
        </div>`:G}createBrightnessWheel(){if("brightness"!=this.mode)return G;const e=ut.hasHueIcons()?"hue:scene-bright":"mdi:brightness-7";return W`
        <div class='wheel-wrapper active' @click=${()=>this.mode="brightness"}>
            <span class='wheel brightness'>
                <ha-icon icon="${e}"></ha-icon>
            </span>
        </div>`}createWheel(e){if("temp"==e&&!this.showTemp)return G;if("color"==e&&!this.showColor)return G;const t={"wheel-wrapper":!0,active:this.mode==e};return W`
        <div class='${fe(t)}' @click=${()=>this.mode=e}>
            <span class='wheel ${e}'></span>
        </div>`}registerColorPickerEvent(){this.colorPicker&&this.colorPicker.addEventListener("mode-change",this.onColorPickerModeChange)}unregisterColorPickerEvent(e){e&&e.addEventListener("mode-change",this.onColorPickerModeChange)}connectedCallback(){super.connectedCallback(),this.registerColorPickerEvent()}disconnectedCallback(){super.disconnectedCallback(),this.unregisterColorPickerEvent(this.colorPicker)}};qs.ElementName="hue-color-temp-mode-selector"+Ue.ElementPostfix,qs.wheelHeight=24,qs.wheelSpace=2,qs.wheelBorderWidth=2,qs.wrapperHeight=Fs.wheelHeight+2*(Fs.wheelSpace+Fs.wheelBorderWidth),qs.totalPadding=8,qs.wrapperGap=Fs.totalPadding,qs.totalHeight=Fs.wrapperHeight+2*Fs.totalPadding,qs.styles=l`
    :host{
        user-select: none;
        -webkit-user-select: none;
        display:inline-block;
    }
    .controls{
        box-sizing: border-box;
        display: flex;
        height: ${Fs.totalHeight}px;
        padding: ${Fs.totalPadding}px;
        gap: ${Fs.wrapperGap}px;
        border-radius: ${Fs.totalHeight/2}px;
        box-shadow: ${a(Ue.HueShadow)};
        background: ${a(Ue.TileOffColor)};
    }
    .controls .wheel-wrapper{
        box-sizing: border-box;
        width: ${Fs.wrapperHeight}px;
        height: ${Fs.wrapperHeight}px;
        padding: ${Fs.wheelSpace}px;
        border-radius: ${Fs.wrapperHeight/2}px;
        border: ${Fs.wheelBorderWidth}px solid transparent;
        cursor: pointer;
    }
    .controls .wheel-wrapper:hover,
    .controls .wheel-wrapper:active{
        background-color: ${a(Ue.TileOffColor)};
    }
    .controls .wheel-wrapper.active{
        border-color: white;
    }
    .controls .wheel-wrapper .wheel{
        display:inline-block;
        width: ${Fs.wheelHeight}px;
        height: ${Fs.wheelHeight}px;
        border-radius: ${Fs.wheelHeight/2}px;
        background-size: cover;
    }
    .wheel.color{
        background-image: url(${a(Us.ModeColorIcon64)});
    }
    .wheel.temp{
        background-image: url(${a(Us.ModeTempIcon64)});
    }
    .wheel.brightness{
        color: white;
    }
    `,e([ye()],qs.prototype,"mode",void 0),e([ye()],qs.prototype,"showColor",void 0),e([ye()],qs.prototype,"showTemp",void 0),e([ye()],qs.prototype,"colorPicker",void 0),qs=Fs=e([me(qs.ElementName)],qs);let Ws=class extends ce{constructor(){super(...arguments),this.disabled=!1,this.vertical=!1,this.reversed=!1}firstUpdated(e){super.firstUpdated(e),this.setupListeners(),this.setAttribute("role","switch"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0")}updated(e){super.updated(e),e.has("checked")&&this.setAttribute("aria-checked",this.checked?"true":"false")}toggle(){this.disabled||(this.checked=!this.checked,Pe(this,"change"))}connectedCallback(){super.connectedCallback(),this.setupListeners()}disconnectedCallback(){super.disconnectedCallback(),this.destroyListeners()}setupListeners(){this.switch&&!this._mc&&(this._mc=new es(this.switch,{touchAction:this.vertical?"pan-x":"pan-y"}),this._mc.add(new Gi({direction:this.vertical?Qt:Xt})),this._mc.add(new Fi({event:"singletap"})),this.vertical?(this._mc.on("swipeup",(()=>{this.disabled||(this.checked=!!this.reversed,Pe(this,"change"))})),this._mc.on("swipedown",(()=>{this.disabled||(this.checked=!this.reversed,Pe(this,"change"))}))):(this._mc.on("swiperight",(()=>{this.disabled||(this.checked=!this.reversed,Pe(this,"change"))})),this._mc.on("swipeleft",(()=>{this.disabled||(this.checked=!!this.reversed,Pe(this,"change"))}))),this._mc.on("singletap",(()=>{this.disabled||this.toggle()})),this.addEventListener("keydown",this.onKeydown))}destroyListeners(){this._mc&&(this._mc.destroy(),this._mc=void 0),this.removeEventListener("keydown",this.onKeydown)}onKeydown(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.toggle())}render(){return W`
        <div id="switch" class="switch">
          <div class="background"></div>
          <div class="button" aria-hidden="true">
            ${this.checked?W`<slot name="icon-on"></slot>`:W`<slot name="icon-off"></slot>`}
          </div>
        </div>
      `}static get styles(){return l`
        :host {
          display: block;
          --control-switch-on-color: var(--primary-color);
          --control-switch-off-color: var(--disabled-color);
          --control-switch-background-opacity: 0.2;
          --control-switch-thickness: 40px;
          --control-switch-border-radius: 12px;
          --control-switch-padding: 4px;
          --mdc-icon-size: 20px;
          height: var(--control-switch-thickness);
          width: 100%;
          box-sizing: border-box;
          user-select: none;
          cursor: pointer;
          border-radius: var(--control-switch-border-radius);
          outline: none;
          transition: box-shadow 180ms ease-in-out;
          -webkit-tap-highlight-color: transparent;
        }
        :host(:focus-visible) {
          box-shadow: 0 0 0 2px var(--control-switch-off-color);
        }
        :host([checked]:focus-visible) {
          box-shadow: 0 0 0 2px var(--control-switch-on-color);
        }
        .switch {
          box-sizing: border-box;
          position: relative;
          height: 100%;
          width: 100%;
          border-radius: var(--control-switch-border-radius);
          overflow: hidden;
          padding: var(--control-switch-padding);
          display: flex;
        }
        .switch .background {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: var(--control-switch-off-color);
          transition: background-color 180ms ease-in-out;
          opacity: var(--control-switch-background-opacity);
        }
        .switch .button {
          width: 50%;
          height: 100%;
          background: lightgrey;
          border-radius: calc(
            var(--control-switch-border-radius) - var(--control-switch-padding)
          );
          transition: transform 180ms ease-in-out,
            background-color 180ms ease-in-out;
          background-color: var(--control-switch-off-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :host([checked]) .switch .background {
          background-color: var(--control-switch-on-color);
        }
        :host([checked]) .switch .button {
          transform: translateX(100%);
          background-color: var(--control-switch-on-color);
        }
        :host([reversed]) .switch {
          flex-direction: row-reverse;
        }
        :host([reversed][checked]) .switch .button {
          transform: translateX(-100%);
        }
        :host([vertical]) {
          width: var(--control-switch-thickness);
          height: 100%;
        }
        :host([vertical][checked]) .switch .button {
          transform: translateY(100%);
        }
        :host([vertical]) .switch .button {
          width: 100%;
          height: 50%;
        }
        :host([vertical][reversed]) .switch {
          flex-direction: column-reverse;
        }
        :host([vertical][reversed][checked]) .switch .button {
          transform: translateY(-100%);
        }
        :host([disabled]) {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}};var js;Ws.ElementName="hue-big-switch"+Ue.ElementPostfix,e([ye({type:Boolean,reflect:!0})],Ws.prototype,"disabled",void 0),e([ye({type:Boolean})],Ws.prototype,"vertical",void 0),e([ye({type:Boolean})],Ws.prototype,"reversed",void 0),e([ye({type:Boolean,reflect:!0})],Ws.prototype,"checked",void 0),e([be("#switch")],Ws.prototype,"switch",void 0),Ws=e([me(Ws.ElementName)],Ws),function(e){e.unknown="unknown",e.onoff="onoff",e.brightness="brightness",e.color_temp="color_temp",e.hs="hs",e.xy="xy",e.rgb="rgb",e.rgbw="rgbw",e.rgbww="rgbww",e.white="white"}(js||(js={}));class Gs{constructor(e){this._attribute=null;const t=(e=e.trim()).indexOf("."),i=e.lastIndexOf(".");t!=i?(this._textOrEntity=e.substring(0,i),this._attribute=e.substring(i+1)):this._textOrEntity=e}resolveToString(e){if(e){const t=e.states[this._textOrEntity];if(!t)return"MISS["+this._textOrEntity+"]";const i=e;if(this._attribute&&t.attributes){const e=t.attributes[this._attribute];if(e)return i.formatEntityAttributeValue?i.formatEntityAttributeValue(t,this._attribute):e.toString()}return i.formatEntityState?i.formatEntityState(t):null!=e.localize?function(e,t,i,s){var r=void 0!==s?s:t.state;if("unknown"===r||"unavailable"===r)return e("state.default."+r);if(function(e){return!!e.attributes.unit_of_measurement||!!e.attributes.state_class}(t)){if("monetary"===t.attributes.device_class)try{return Oe(r,i,{style:"currency",currency:t.attributes.unit_of_measurement})}catch(e){}return Oe(r,i)+(t.attributes.unit_of_measurement?" "+t.attributes.unit_of_measurement:"")}var n=function(e){return function(e){return e.substr(0,e.indexOf("."))}(e.entity_id)}(t);if("input_datetime"===n){var o;if(void 0===s)return t.attributes.has_date&&t.attributes.has_time?(o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),Ae(o,i)):t.attributes.has_date?(o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),Se(o,i)):t.attributes.has_time?((o=new Date).setHours(t.attributes.hour,t.attributes.minute),Te(o,i)):t.state;try{var a=s.split(" ");if(2===a.length)return Ae(new Date(a.join("T")),i);if(1===a.length){if(s.includes("-"))return Se(new Date(s+"T00:00"),i);if(s.includes(":")){var l=new Date;return Te(new Date(l.toISOString().split("T")[0]+"T"+s),i)}}return s}catch(e){return s}}return"humidifier"===n&&"on"===r&&t.attributes.humidity?t.attributes.humidity+" %":"counter"===n||"number"===n||"input_number"===n?Oe(r,i):t.attributes.device_class&&e("component."+n+".state."+t.attributes.device_class+"."+r)||e("component."+n+".state._."+r)||r}(e.localize,t,e.locale):t.state}return""}}class Ys{constructor(e){this._text=e}resolveToString(){return this._text}toString(){return this.resolveToString()}}class Ks{constructor(e){this._templateParts=Ks.parseTemplate(e)}resolveToString(e){if(1==this._templateParts.length)return this._templateParts[0].resolveToString(e);let t="";return this._templateParts.forEach((i=>{t+=i.resolveToString(e)})),t}static parseTemplate(e){const t=new Array;let i=0,s=!1;for(;i<e.length;){let r;if(s){if(r=e.indexOf("}}",i),r<0)break;const n=e.substring(i,r);t.push(new Gs(n)),s=!1}else{if(r=e.indexOf("{{",i),r<0)break;const n=e.substring(i,r);t.push(new Ys(n)),s=!0}i=r+2}if(s&&(i-=2),i<e.length){const s=e.substring(i);t.push(new Ys(s))}return t}}class Xs{constructor(e){if(this.brightness=!1,this.colorTemp=!1,this.colorTempMinKelvin=null,this.colorTempMaxKelvin=null,this.color=!1,null!=e.attributes&&null!=e.attributes.supported_color_modes&&0!=e.attributes.supported_color_modes.length){for(const t of e.attributes.supported_color_modes)switch(t){case js.onoff:break;case js.brightness:this.brightness=!0;break;case js.color_temp:this.brightness=!0,this.colorTemp=!0;break;case js.hs:case js.xy:case js.rgb:case js.rgbw:case js.rgbww:this.brightness=!0,this.color=!0}this.colorTemp&&(this.colorTempMinKelvin=e.attributes.min_color_temp_kelvin||null,this.colorTempMaxKelvin=e.attributes.max_color_temp_kelvin||null)}}isEmpty(){return!this.color&&!this.colorTemp&&!this.brightness}isOnlyBrightness(){return!this.color&&!this.colorTemp&&this.brightness}}class Qs{constructor(e){this._features=e}isEmpty(){return this._features().every((e=>e.isEmpty()))}isOnlyBrightness(){let e=!1;const t=this._features();for(let i=0;i<t.length;i++){const s=t[i];if(s.isOnlyBrightness())e=!0;else if(!s.isEmpty())return!1}return e}get brightness(){return this._features().some((e=>e.brightness))}get colorTemp(){return this._features().some((e=>e.colorTemp))}get colorTempMinKelvin(){let e=null;return this._features().forEach((t=>{t.colorTempMinKelvin&&(null==e||e>t.colorTempMinKelvin)&&(e=t.colorTempMinKelvin)})),e}get colorTempMaxKelvin(){let e=null;return this._features().forEach((t=>{t.colorTempMaxKelvin&&(null==e||e<t.colorTempMaxKelvin)&&(e=t.colorTempMaxKelvin)})),e}get color(){return this._features().some((e=>e.color))}}class Zs{constructor(){this._propertyChangedCallbacks={}}raisePropertyChanged(...e){const t=1==e.length&&"hass"==e[0];this.log(`${this.constructor.name} changed [${e.join(", ")}] (onlyHass:${t})`);for(const i in this._propertyChangedCallbacks){const s=this._propertyChangedCallbacks[i];!s.includeHass&&t||(this.log(`${this.constructor.name} changed [${e.join(", ")}] for ${i}`),s.invoke(e,this))}}registerOnPropertyChanged(e,t,i=!1){this._propertyChangedCallbacks[e]={invoke:t,includeHass:i},this.log(`Registered change of ${this.constructor.name} by control: '${e}' (includeHass:${i})`)}unregisterOnPropertyChanged(e){delete this._propertyChangedCallbacks[e],this.log(`Unregistered change of ${this.constructor.name} for control: '${e}'`)}log(e){Ue.Dev&&console.log("[HueNotify] "+e)}}class Js{constructor(e){this.refresh(e)}refresh(e){this._entity=e}isUnavailable(){return!this._entity||"unavailable"==this._entity.state}isOn(){return"on"==this.state}isColorModeColor(){return[js.hs,js.xy,js.rgb,js.rgbw,js.rgbww].includes(this.colorMode)}isColorModeTemp(){return this.colorMode==js.color_temp}get state(){return this._entity.state}set state(e){this._entity.state=e}get lastOnBrightnessValue(){return this._lastOnBrightnessValue}get brightnessValue(){var e;if(!this.isOn())return 0;const t=this._entity.attributes,i=null!==(e=null==t?void 0:t.brightness)&&void 0!==e?e:255;return 0==i?0:(this._lastOnBrightnessValue=Math.round(i/255*100),this._lastOnBrightnessValue)}set brightnessValue(e){var t;e<0?e=0:e>100&&(e=100);const i=Math.round(e/100*255);(null!==(t=this._entity.attributes)&&void 0!==t?t:{}).brightness=i}get colorMode(){var e;let t=js.unknown;if(this.isOn()){const i=null===(e=this._entity.attributes)||void 0===e?void 0:e.color_mode;if(i&&(t=i,this._lastColorTemp&&t==js.xy&&this._entity.attributes.xy_color)){const[e,i]=this._entity.attributes.xy_color;0===e&&0===i&&(t=js.color_temp)}}return t}set colorMode(e){var t;if(e==js.unknown)return;(null!==(t=this._entity.attributes)&&void 0!==t?t:{}).color_mode=e}get colorTemp(){if(!this.isOn()||!this.isColorModeTemp())return null;const e=this._entity.attributes;return(null==e?void 0:e.color_temp_kelvin)&&(this._lastColorTemp=null==e?void 0:e.color_temp_kelvin),this._lastColorTemp}set colorTemp(e){var t;(null!==(t=this._entity.attributes)&&void 0!==t?t:{}).color_temp_kelvin=null!=e?e:void 0,this._lastColorTemp=e}get color(){if(!this.isOn()||!this.isColorModeColor())return null;const e=this._entity.attributes;let t=null;if(e.hs_color){const[i,s]=e.hs_color;t=new Ne(i,s/100,1,1,"hsv")}else if(e.rgb_color){const[i,s,r]=e.rgb_color;t=new Ne(i,s,r)}return t}set color(e){var t;const i=null!==(t=this._entity.attributes)&&void 0!==t?t:{};if(null==e)i.hs_color=void 0,i.rgb_color=void 0;else if("hsv"==e.getOriginalMode())i.hs_color=[e.getHue(),100*e.getSaturation()];else{if("rgb"!=e.getOriginalMode())throw new Error("Unknown color original mode");i.rgb_color=[e.getRed(),e.getGreen(),e.getBlue()]}}}class er extends Zs{constructor(e){super(),Qe(e,"light"),this._entity_id=e,this._lightState=new Js({state:"unavailable"})}set hass(e){if(this._hass=e,!this._hass.states)throw new Error("No 'states' available on passed hass instance.");if(this._entity=this._hass.states[this._entity_id],!this._entity)throw new Error(`Entity '${this._entity_id}' not found in states.`);this._lightState.refresh(this._entity),this._entityFeatures=new Xs(this._entity),this.raisePropertyChanged("hass")}getLights(){return[this]}getIcon(){return this._entity&&this._entity.attributes.icon}getTitle(){var e;return new Ys(null!==(e=this._entity.attributes.friendly_name)&&void 0!==e?e:this._entity_id)}getEntityId(){return this._entity_id}get features(){return this._entityFeatures}notifyTurnOn(e){this._lightState.state="on";const t=null==e?void 0:e.getBrightnessValue();t&&(this._lightState.brightnessValue=t),this.raisePropertyChanged("isOn","isOff","brightnessValue")}notifyTurnOff(){this._lightState.state="off",this._lightState.brightnessValue=0,this.raisePropertyChanged("isOn","isOff","brightnessValue")}notifyBrightnessValueChanged(e){this._lightState.brightnessValue=e,this._lightState.state=e>0?"on":"off",this.raisePropertyChanged("isOn","isOff","brightnessValue")}notifyColorTempChanged(e){this._lightState.colorTemp=e,this._lightState.colorMode=js.color_temp,this.raisePropertyChanged("colorTemp","colorMode")}notifyColorChanged(e,t){this._lightState.colorTemp=null,this._lightState.colorMode=t,this._lightState.color=e,this.raisePropertyChanged("colorTemp","colorMode","color")}isUnavailable(){return this._lightState.isUnavailable()}isOn(){return this._lightState.isOn()}isOff(){return!this.isOn()}turnOn(e){this.toggle(!0,e)}turnOff(){this.toggle(!1)}toggle(e,t){if(!this.isUnavailable()){if(e){let e=!1;if("string"==typeof t&&(e=!0,(t=new ct(t)).hass=this._hass),this.notifyTurnOn(t),t)return void(e&&(t.hass=this._hass,t.activate()))}else this.notifyTurnOff();this._hass.callService("light",e?"turn_on":"turn_off",{entity_id:this._entity_id})}}get brightnessValue(){return this._lightState.brightnessValue}set brightnessValue(e){e<0?e=0:e>100&&(e=100),this.notifyBrightnessValueChanged(e);const t=Math.round(e/100*255);this._hass.callService("light","turn_on",{entity_id:this._entity_id,brightness:t})}get colorMode(){return this._lightState.colorMode}isColorModeColor(){return this._lightState.isColorModeColor()}isColorModeTemp(){return this._lightState.isColorModeTemp()}get colorTemp(){return this._lightState.colorTemp}set colorTemp(e){var t,i,s,r,n,o;if(!e)return;const a=null!==(s=null===(i=null===(t=this._entity)||void 0===t?void 0:t.attributes)||void 0===i?void 0:i.min_color_temp_kelvin)&&void 0!==s?s:2e3,l=null!==(o=null===(n=null===(r=this._entity)||void 0===r?void 0:r.attributes)||void 0===n?void 0:n.max_color_temp_kelvin)&&void 0!==o?o:6500;e<a?e=a:e>l&&(e=l),this.notifyColorTempChanged(e),this._hass.callService("light","turn_on",{entity_id:this._entity_id,kelvin:e})}get color(){return this._lightState.color}set color(e){if(!e)return;let t;const i={entity_id:this._entity_id};"hsv"==e.getOriginalMode()?(t=js.hs,i.hs_color=[e.getHue(),100*e.getSaturation()]):(t=js.rgb,i.rgb_color=[e.getRed(),e.getGreen(),e.getBlue()]),this.notifyColorChanged(e,t),this._hass.callService("light","turn_on",i)}getBackground(){let e,t,i=null;if(this.isColorModeTemp()&&(e=this.colorTemp)){const[t,s,r]=Ne.hueTempToRgb(e);i=new Ne(t,s,r)}else this.isColorModeColor()&&(t=this.color)&&(i=t);return i?(this._lastBackground=new qe([i]),this._lastBackground):this._lastBackground?this._lastBackground:null}}class tr{static getLightContainer(e){let t=tr._containers[e];return t||(t=new er(e),tr._containers[e]=t),t}}tr._containers={};const ir={cs:{"card.description.allLightsOn":"Všechna světla jsou zapnutá","card.description.noLightsOn":"Všechna světla jsou vypnutá","card.description.oneLightOn":"1 světlo je zapnuté","card.description.someLightsAreOn":"Počet zapnutých světel: %s","dialog.lights":"Světla","dialog.scenes":"Moje scény","effects.candle":"Svíčka","effects.fireplace":"Ohniště","scenes.preset.bright":"Světlé","scenes.preset.concentrate":"Soustředění","scenes.preset.coolBright":"Jasné chladné","scenes.preset.dimmed":"Ztlumené","scenes.preset.doze":"Odpočívejte","scenes.preset.energize":"Povzbuzující","scenes.preset.naturalLight":"Přirozené světlo","scenes.preset.nightLight":"Noční světlo","scenes.preset.read":"Čtení","scenes.preset.relax":"Relaxační"},da:{"card.description.allLightsOn":"Alle lyskilder er tændt","card.description.noLightsOn":"Alle lyskilder er slukkede","card.description.oneLightOn":"1 lyskilde er tændt","card.description.someLightsAreOn":"%s lyskilder er tændt","dialog.lights":"Lyskilder","dialog.scenes":"Mine scener","effects.candle":"Stearinlys","effects.fireplace":"Pejs","scenes.preset.bright":"Klar","scenes.preset.concentrate":"Koncentrer dig","scenes.preset.coolBright":"Kølig klar","scenes.preset.dimmed":"Dæmpet","scenes.preset.doze":"Slap af","scenes.preset.energize":"Få ny energi","scenes.preset.naturalLight":"Naturligt lys","scenes.preset.nightLight":"Natlys","scenes.preset.read":"Læs","scenes.preset.relax":"Slap af"},de:{"card.description.allLightsOn":"Alle Lampen sind eingeschaltet","card.description.noLightsOn":"Alle Lampen sind ausgeschaltet","card.description.oneLightOn":"1 Licht ist eingeschaltet","card.description.someLightsAreOn":"%s Lampen sind eingeschaltet","dialog.lights":"Lampen","dialog.scenes":"Meine Szenen","effects.candle":"Kerze","effects.fireplace":"Kaminfeuer","scenes.preset.bright":"Hell","scenes.preset.concentrate":"Konzentrieren","scenes.preset.coolBright":"Kühles, helles Licht","scenes.preset.dimmed":"Gedimmt","scenes.preset.doze":"Ruhephase","scenes.preset.energize":"Energie tanken","scenes.preset.naturalLight":"Natürliches Licht","scenes.preset.nightLight":"Nachtlicht","scenes.preset.read":"Lesen","scenes.preset.relax":"Entspannen"},en:{"card.description.allLightsOn":"All lights are on","card.description.noLightsOn":"All lights are off","card.description.oneLightOn":"1 light is on","card.description.someLightsAreOn":"%s lights are on","dialog.lights":"Lights","dialog.scenes":"My scenes","effects.candle":"Candle","effects.fireplace":"Fireplace","scenes.preset.bright":"Bright","scenes.preset.concentrate":"Concentrate","scenes.preset.coolBright":"Cool bright","scenes.preset.dimmed":"Dimmed","scenes.preset.doze":"Rest","scenes.preset.energize":"Energize","scenes.preset.naturalLight":"Natural light","scenes.preset.nightLight":"Nightlight","scenes.preset.read":"Read","scenes.preset.relax":"Relax"},en_gb:{"card.description.allLightsOn":"All lights are on","card.description.noLightsOn":"All lights are off","card.description.oneLightOn":"1 light is on","card.description.someLightsAreOn":"%s lights are on","dialog.lights":"Lights","dialog.scenes":"My scenes","effects.candle":"Candle","effects.fireplace":"Fireplace","scenes.preset.bright":"Bright","scenes.preset.concentrate":"Concentrate","scenes.preset.coolBright":"Cool bright","scenes.preset.dimmed":"Dimmed","scenes.preset.doze":"Rest","scenes.preset.energize":"Energise","scenes.preset.naturalLight":"Natural light","scenes.preset.nightLight":"Nightlight","scenes.preset.read":"Read","scenes.preset.relax":"Relax"},es:{"card.description.allLightsOn":"Todas las luces encendidas","card.description.noLightsOn":"Todas las luces apagadas","card.description.oneLightOn":"1 luz encendida","card.description.someLightsAreOn":"Hay %s luces encendidas","dialog.lights":"Luces","dialog.scenes":"Mis escenas","effects.candle":"Vela","effects.fireplace":"Chimenea","scenes.preset.bright":"Brillante","scenes.preset.concentrate":"Concentración","scenes.preset.coolBright":"Brillante fría","scenes.preset.dimmed":"Atenuado","scenes.preset.doze":"Descanso","scenes.preset.energize":"Energía","scenes.preset.naturalLight":"Luz natural","scenes.preset.nightLight":"Luz nocturna","scenes.preset.read":"Lectura","scenes.preset.relax":"Relax"},fi:{"card.description.allLightsOn":"Kaikki valot ovat päällä","card.description.noLightsOn":"Kaikki valot ovat poissa päältä","card.description.oneLightOn":"1 valo on päällä","card.description.someLightsAreOn":"%s valot palavat","dialog.lights":"Valot","dialog.scenes":"Valaistusasetukseni","effects.candle":"Kynttilä","effects.fireplace":"Takka","scenes.preset.bright":"Bright","scenes.preset.concentrate":"Concentrate","scenes.preset.coolBright":"Viileä kirkas","scenes.preset.dimmed":"Dimmed","scenes.preset.doze":"Lepohetki","scenes.preset.energize":"Energize","scenes.preset.naturalLight":"Luonnonvalo","scenes.preset.nightLight":"Yövalaistus","scenes.preset.read":"Read","scenes.preset.relax":"Relax"},fr:{"card.description.allLightsOn":"Toutes les lumières sont allumées","card.description.noLightsOn":"Toutes les lumières sont éteintes","card.description.oneLightOn":"1 lumière est allumée","card.description.someLightsAreOn":"%s lampes sont allumées","dialog.lights":"Lumières","dialog.scenes":"Mes scénarios","effects.candle":"Bougie","effects.fireplace":"Feu de cheminée","scenes.preset.bright":"Lumineux","scenes.preset.concentrate":"Concentration","scenes.preset.coolBright":"Lumière vive froide","scenes.preset.dimmed":"Atténué","scenes.preset.doze":"Repos","scenes.preset.energize":"Stimulation","scenes.preset.naturalLight":"Lumière naturelle","scenes.preset.nightLight":"Veilleuse","scenes.preset.read":"Lecture","scenes.preset.relax":"Détente"},it:{"card.description.allLightsOn":"Tutte le luci sono accese","card.description.noLightsOn":"Tutte le luci sono spente","card.description.oneLightOn":"1 luce è accesa","card.description.someLightsAreOn":"%s luci sono accese","dialog.lights":"Luci","dialog.scenes":"Le mie scene","effects.candle":"Candela","effects.fireplace":"Caminetto","scenes.preset.bright":"Luce brillante","scenes.preset.concentrate":"Concentrazione","scenes.preset.coolBright":"Fredda brillante","scenes.preset.dimmed":"Luce soffusa","scenes.preset.doze":"Riposo","scenes.preset.energize":"Energia","scenes.preset.naturalLight":"Luce naturale","scenes.preset.nightLight":"Luce notturna","scenes.preset.read":"Lettura","scenes.preset.relax":"Relax"},ja:{"card.description.allLightsOn":"すべてのライトがオンです","card.description.noLightsOn":"すべてのライトがオフです","card.description.oneLightOn":"1 個のライトがオンです","card.description.someLightsAreOn":"%s照明がオンです","dialog.lights":"ライト","dialog.scenes":"マイ シーン","effects.candle":"キャンドル","effects.fireplace":"暖炉","scenes.preset.bright":"明るめ","scenes.preset.concentrate":"集中する","scenes.preset.coolBright":"昼白色","scenes.preset.dimmed":"暗め","scenes.preset.doze":"残り","scenes.preset.energize":"やる気を出す","scenes.preset.naturalLight":"自然光","scenes.preset.nightLight":"夜間照明","scenes.preset.read":"読書をする","scenes.preset.relax":"くつろぐ"},ko:{"card.description.allLightsOn":"모든 조명 켜짐","card.description.noLightsOn":"모든 조명 꺼짐","card.description.oneLightOn":"1개 조명 켜짐","card.description.someLightsAreOn":"%s개의 조명이 켜져 있습니다","dialog.lights":"조명","dialog.scenes":"내 장면","effects.candle":"캔들","effects.fireplace":"벽난로","scenes.preset.bright":"밝게","scenes.preset.concentrate":"집중","scenes.preset.coolBright":"시원하고 밝은 느낌","scenes.preset.dimmed":"어둡게","scenes.preset.doze":"휴지","scenes.preset.energize":"활력","scenes.preset.naturalLight":"자연광","scenes.preset.nightLight":"야간 조명","scenes.preset.read":"독서","scenes.preset.relax":"휴식"},nb:{"card.description.allLightsOn":"Alle lysene er nå slått på","card.description.noLightsOn":"Alle lysene er nå slått av","card.description.oneLightOn":"1 lys er slått på","card.description.someLightsAreOn":"%s lysene er på","dialog.lights":"Lys","dialog.scenes":"Mine scener","effects.candle":"Vokslys","effects.fireplace":"Bål","scenes.preset.bright":"Lyst","scenes.preset.concentrate":"Konsentrer deg","scenes.preset.coolBright":"Kjølig lysstyrke","scenes.preset.dimmed":"Dimmet","scenes.preset.doze":"Hvile","scenes.preset.energize":"Lad batteriene","scenes.preset.naturalLight":"Naturlig lys","scenes.preset.nightLight":"Nattlys","scenes.preset.read":"Les","scenes.preset.relax":"Slapp av"},nl:{"card.description.allLightsOn":"Alle lampen staan aan","card.description.noLightsOn":"Alle lampen staan uit","card.description.oneLightOn":"1 lamp staat aan","card.description.someLightsAreOn":"%s lampen staan aan","dialog.lights":"Lampen","dialog.scenes":"Mijn scènes","effects.candle":"Kaars","effects.fireplace":"Open haard","scenes.preset.bright":"Helder","scenes.preset.concentrate":"Concentreren","scenes.preset.coolBright":"Koel helder","scenes.preset.dimmed":"Gedimd","scenes.preset.doze":"Rusten","scenes.preset.energize":"Energie","scenes.preset.naturalLight":"Natuurlijk licht","scenes.preset.nightLight":"Nachtlampje","scenes.preset.read":"Lezen","scenes.preset.relax":"Ontspannen"},pl:{"card.description.allLightsOn":"Wszystkie światła są włączone","card.description.noLightsOn":"Wszystkie światła są wyłączone","card.description.oneLightOn":"1 światło jest włączone","card.description.someLightsAreOn":"Zapalone światła %s","dialog.lights":"Światła","dialog.scenes":"Moje sceny","effects.candle":"Świeca","effects.fireplace":"Kominek","scenes.preset.bright":"Jasne","scenes.preset.concentrate":"Koncentracja","scenes.preset.coolBright":"Zimne światło","scenes.preset.dimmed":"Przyćmione","scenes.preset.doze":"Odpoczynek","scenes.preset.energize":"Energia","scenes.preset.naturalLight":"Światło naturalne","scenes.preset.nightLight":"Lampka nocna","scenes.preset.read":"Czytanie","scenes.preset.relax":"Relaks"},pt_br:{"card.description.allLightsOn":"Todas as luzes estão acesas","card.description.noLightsOn":"Todas as luzes estão apagadas","card.description.oneLightOn":"1 luz acesa","card.description.someLightsAreOn":"%s luzes estão acesas","dialog.lights":"Luzes","dialog.scenes":"Minhas cenas","effects.candle":"Vela","effects.fireplace":"Lareira","scenes.preset.bright":"Luz","scenes.preset.concentrate":"Concentrar","scenes.preset.coolBright":"Frio claro","scenes.preset.dimmed":"Esmaecido","scenes.preset.doze":"Repousar","scenes.preset.energize":"Energizar","scenes.preset.naturalLight":"Luz natural","scenes.preset.nightLight":"Luz noturna","scenes.preset.read":"Leitura","scenes.preset.relax":"Relaxar"},ru:{"card.description.allLightsOn":"Все лампы включены","card.description.noLightsOn":"Все лампы выключены","card.description.oneLightOn":"Включено ламп: 1","card.description.someLightsAreOn":"Включено ламп: %s","dialog.lights":"Лампы","dialog.scenes":"Мои варианты освещения","effects.candle":"Свеча","effects.fireplace":"Камин","scenes.preset.bright":"Яркий свет","scenes.preset.concentrate":"Концентрация","scenes.preset.coolBright":"Яркий холодный","scenes.preset.dimmed":"Приглушенный свет","scenes.preset.doze":"Отдых","scenes.preset.energize":"Заряд энергии","scenes.preset.naturalLight":"Дневной свет","scenes.preset.nightLight":"Ночное освещение","scenes.preset.read":"Чтение","scenes.preset.relax":"Отдых"},sk:{"card.description.allLightsOn":"Všetky svetlá zapnuté","card.description.noLightsOn":"Všetky svetlá vypnuté","card.description.oneLightOn":"1 svetlo je zapnuté","card.description.someLightsAreOn":"Počet zapnutých svetiel: %s","dialog.lights":"Svetlá","dialog.scenes":"Moje scény","effects.candle":"Sviečka","effects.fireplace":"Ohnisko","scenes.preset.bright":"Svetlé","scenes.preset.concentrate":"Sústredenie","scenes.preset.coolBright":"Jasné chladné","scenes.preset.dimmed":"Tlmené","scenes.preset.doze":"Odpočinok","scenes.preset.energize":"Povzbudzujúce","scenes.preset.naturalLight":"Prírodné svetlo","scenes.preset.nightLight":"Nočné svetlo","scenes.preset.read":"Čítanie","scenes.preset.relax":"Relaxačné"},sv:{"card.description.allLightsOn":"Alla lampor är tända","card.description.noLightsOn":"Alla lampor är släckta","card.description.oneLightOn":"En lampa är tänd","card.description.someLightsAreOn":"%s-lamporna är tända","dialog.lights":"Belysning","dialog.scenes":"Mina scener","effects.candle":"Kronljus","effects.fireplace":"Eldstad","scenes.preset.bright":"Klart ljus","scenes.preset.concentrate":"Concentrate","scenes.preset.coolBright":"Svalt ljus","scenes.preset.dimmed":"Dimrad","scenes.preset.doze":"Vila","scenes.preset.energize":"Få ny energi","scenes.preset.naturalLight":"Naturligt ljus","scenes.preset.nightLight":"Nattlampa","scenes.preset.read":"Läs","scenes.preset.relax":"Koppla av"},tr:{"card.description.allLightsOn":"Tüm ışıklar açık","card.description.noLightsOn":"Tüm ışıklar kapalı","card.description.oneLightOn":"1 ışık açık","card.description.someLightsAreOn":"%s ışıklar açık","dialog.lights":"Işıklar","dialog.scenes":"Görünümlerim","effects.candle":"Mum","effects.fireplace":"Şömine","scenes.preset.bright":"Parlak","scenes.preset.concentrate":"Odaklanın","scenes.preset.coolBright":"Soğuk parlak","scenes.preset.dimmed":"Karartılmış","scenes.preset.doze":"Dinlenme","scenes.preset.energize":"Canlanın","scenes.preset.naturalLight":"Doğal ışık","scenes.preset.nightLight":"Gece Işığı","scenes.preset.read":"Okuyun","scenes.preset.relax":"Dinlenin"},zh_hans:{"card.description.allLightsOn":"所有灯具均已亮起","card.description.noLightsOn":"所有灯具均已关闭","card.description.oneLightOn":"1 盏灯亮起","card.description.someLightsAreOn":"%s 盏灯亮起","dialog.lights":"灯","dialog.scenes":"我的场景","effects.candle":"烛光灯","effects.fireplace":"壁炉灯","scenes.preset.bright":"明亮","scenes.preset.concentrate":"集中精神","scenes.preset.coolBright":"明亮的冷光","scenes.preset.dimmed":"渐暗","scenes.preset.doze":"重置","scenes.preset.energize":"注入能量","scenes.preset.naturalLight":"自然光","scenes.preset.nightLight":"夜灯","scenes.preset.read":"静心阅读","scenes.preset.relax":"放松休息"},zh_hant:{"card.description.allLightsOn":"所有燈光已開啟","card.description.noLightsOn":"所有燈光已關閉","card.description.oneLightOn":"已開啟 1 盞燈","card.description.someLightsAreOn":"%s 燈光已就緒","dialog.lights":"燈光","dialog.scenes":"我的場景","effects.candle":"蠟燭","effects.fireplace":"壁爐","scenes.preset.bright":"明亮","scenes.preset.concentrate":"專注精神","scenes.preset.coolBright":"冷白光","scenes.preset.dimmed":"黯淡","scenes.preset.doze":"待用","scenes.preset.energize":"活力充沛","scenes.preset.naturalLight":"自然光","scenes.preset.nightLight":"夜燈","scenes.preset.read":"閱讀","scenes.preset.relax":"放鬆休息"}};function sr(e,t,i="",s=""){var r,n,o;let a;a="string"==typeof e?e:e.language||"en",a=a.replace("-","_").toLowerCase();const l=a.split("_")[0];let h=(null!==(r=ir[a])&&void 0!==r?r:{})[t]||(null!==(n=ir[l])&&void 0!==n?n:{})[t]||(null!==(o=ir.en)&&void 0!==o?o:{})[t]||t;return""!==i&&""!==s&&(h=h.replace(i,s)),h}class rr{constructor(e,t,i){if(!e.length)throw new Error("No entity specified.");this._defaultColor=t,this._lights=e.map((e=>tr.getLightContainer(e))),this._lightsFeatures=new Qs((()=>this._lights.map((e=>e.features)))),i&&(this._lightGroup=tr.getLightContainer(i))}get defaultColor(){return this._defaultColor}get count(){return this._lights.length}getLitLights(){return this._lights.filter((e=>e.isOn()))}getLights(){return this._lights.map((e=>e))}registerOnPropertyChanged(e,t,i=!1){this._lights.forEach((s=>s.registerOnPropertyChanged(e,t,i)))}unregisterOnPropertyChanged(e){this._lights.forEach((t=>t.unregisterOnPropertyChanged(e)))}set hass(e){this._hass=e,this._lights.forEach((t=>t.hass=e)),this._lightGroup&&(this._lightGroup.hass=e)}get hass(){return this._hass}isOn(){return this._lightGroup?this._lightGroup.isOn():this._lights.some((e=>e.isOn()))}isOff(){return this._lightGroup?this._lightGroup.isOff():this._lights.every((e=>e.isOff()))}isUnavailable(){return this._lightGroup?this._lightGroup.isUnavailable():this._lights.every((e=>e.isUnavailable()))}turnOn(e){if(this._lightGroup)return this._lightGroup.turnOn(e);let t;e&&(t=new ct(e),t.hass=this._hass,t.activate()),this._lights.filter((e=>e.isOff())).forEach((e=>e.turnOn(t)))}turnOff(){if(this._lightGroup)return this._lightGroup.turnOff();this._lights.filter((e=>e.isOn())).forEach((e=>e.turnOff()))}get brightnessValue(){return this.valueGetFactory()}set brightnessValue(e){const t=this._lights.filter((e=>e.isOn()));if(1==t.length)return void(t[0].brightnessValue=e);if(0==t.length)return void this._lights.forEach((t=>t.brightnessValue=e));const i=this.brightnessValue,s=e-i,r=s>0?100-this.brightnessValue:this.brightnessValue,n=s/r;this._lights.filter((e=>e.isOn())).forEach((t=>{if(t.brightnessValue==i)return void(t.brightnessValue=e);const r=s>0?100-t.brightnessValue:t.brightnessValue,o=Math.round(r*n);let a=t.brightnessValue+o;a<1&&e>0&&(a=1),t.brightnessValue=a}))}valueGetFactory(){let e=0,t=0;if(this._lights.forEach((i=>{i.isOn()&&(t++,e+=i.brightnessValue)})),0==t)return 0;return e/t*1}getIcon(){return 1==this._lights.length?this._lights[0].getIcon()||ys.getIcon(1):ys.getIcon(this._lights.length)}getTitle(){if(this._lightGroup)return this._lightGroup.getTitle();let e="";for(let t=0;t<this._lights.length&&t<3;t++)t>0&&(e+=", "),e+=this._lights[t].getTitle();return this._lights.length>3&&(e+=", ..."),new Ys(e)}getDescription(e){const t=this._lights.length;let i,s=0;if(this._lights.forEach((e=>{e.isOn()&&s++})),null!=e){if(e)return i=e.replace("%s",s.toString()),new Ks(i);i=""}else i=0==s?sr(this.hass,"card.description.noLightsOn"):s==t?sr(this.hass,"card.description.allLightsOn"):1==s?sr(this.hass,"card.description.oneLightOn"):sr(this.hass,"card.description.someLightsAreOn","%s",s.toString());return new Ys(i)}getBackground(){const e=this._lights.filter((e=>e.isOn())).map((e=>e.getBackground()||this._defaultColor));return 0==e.length?null:new qe(e)}getEntityId(){throw Error("Cannot get entity id from LightController")}get features(){return this._lightsFeatures}}var nr;let or=nr=class extends ft{constructor(){super("HueLightDetail"),this.lightContainer=null,this.hide(!0)}onLightContainerChanged(){if(!this.lightContainer)return;if(this.lightContainer.features.isEmpty())return void this.updateBigSwitchSize();const e=this.lightContainer.features;this._modeSelector.showColor=e.color,this._modeSelector.showTemp=e.colorTemp,e.colorTemp&&e.colorTempMinKelvin&&e.colorTempMaxKelvin&&this._colorPicker.setTempRange(e.colorTempMinKelvin,e.colorTempMaxKelvin),e.isOnlyBrightness()?(this._modeSelector.mode="brightness",this.toggleFullSizedBrightness(!0)):(this._modeSelector.selectPossibleMode(),this.toggleFullSizedBrightness(!1)),this.onLightContainerState(this.lightContainer,!0)}createAreaControllerMarkers(){this.areaController&&this._lightMarkerManager&&(this._lightMarkerManager.clear(),this._lightMarkerManager.add(...this.areaController.getLights()))}setLightContainerFromPicker(e){if(1==e.length)this.lightContainer=e[0];else{const t=e.map((e=>e.getEntityId())),i=new rr(t,this.areaController.defaultColor);this.lightContainer=i}this.dispatchEvent(new Event("lightcontainer-change"))}toggleFullSizedBrightness(e){e&&(this._colorPicker.style.display="none"),this.updateBrightnessRollupSize(e),e||(this._colorPicker.style.display="")}onLightContainerState(e,t=!1){const i=e.getLights();let s=null;if(1==i.length&&(s=i[0]),s&&this._lightMarkerManager.applyState(s,!t),this.lightContainer==e&&(this._brightnessRollup.enabled=e.isOn()),t&&s){s.isColorModeColor()?this._modeSelector.mode="color":s.isColorModeTemp()&&(this._modeSelector.mode="temp");const e=this._lightMarkerManager.getMarker(s);null==e||e.setActive()}}onColorChanged(e){const t=e.detail.marker,i=this._lightMarkerManager.getLight(t);this._lightMarkerManager.suspendStateUpdate((()=>{"temp"==e.detail.mode?i.colorTemp=e.detail.newTemp:"color"==e.detail.mode&&(i.color=e.detail.newColor)}))}activate(e){const t=this._lightMarkerManager.getMarker(e);t&&t.setActive()}show(){this._hideTimeout&&(clearTimeout(this._hideTimeout),this._hideTimeout=null),this.style.removeProperty("display"),setTimeout((()=>this.classList.add("visible"))),this.updateColorPickerSize(),this.parentElement&&(this.parentElement.style.overflow="visible"),this.dispatchEvent(new CustomEvent("show"))}hide(e=!1){const t=this.classList.contains("visible");this.classList.remove("visible"),e?this.style.display="none":this._hideTimeout=setTimeout((()=>{this._hideTimeout=null,this.style.display="none"}),300),this.parentElement&&(this.parentElement.style.overflow=""),t&&this.dispatchEvent(new CustomEvent("hide"))}brightnessValueChanged(e){this.lightContainer&&(this.lightContainer.brightnessValue=e.detail.newValue)}registerLightsPropertyChanged(e){e.getLights().forEach((e=>{e.registerOnPropertyChanged(this._elementId,(()=>{this.onLightContainerState(e),this.requestUpdate()}),!0)}))}unregisterLightsPropertyChanged(e){e.getLights().forEach((e=>e.unregisterOnPropertyChanged(this._elementId)))}updated(e){if(e.has("areaController")){const t=e.get("areaController");t&&this.unregisterLightsPropertyChanged(t),this.areaController&&(this.registerLightsPropertyChanged(this.areaController),this.createAreaControllerMarkers())}e.has("lightContainer")&&this.areaController&&this.onLightContainerChanged()}render(){var e;this._lastRenderedContainer=this.lightContainer||this._lastRenderedContainer;const t=1==(null===(e=this._lastRenderedContainer)||void 0===e?void 0:e.features.isEmpty());return Ve`
        <div>
            <ha-icon-button-prev class='back-button' @click=${()=>this.hide()}></ha-icon-button-prev>
            ${Ms(t?this.createSwitchDetail():this.createFullDetail())}
        </div>`}onSwitch(e,t){const i=t.target;if(!i)return;i.checked?e.turnOn():e.turnOff()}createSwitchDetail(){const e=this._lastRenderedContainer,t={"--control-switch-on-color":Ue.WarmColor,"--control-switch-off-color":Ue.OffColor};return Ve`
            <${ze(Ws.ElementName)} class='light-switch'
                vertical
                reversed
                .checked=${e.isOn()}
                .showHandle=${!e.isUnavailable()}
                @change=${t=>this.onSwitch(e,t)}
                style=${Ge(t)}
                .disabled=${e.isUnavailable()}
            >
                <ha-icon icon="mdi:power-on" slot="icon-on"></ha-icon>
                <ha-icon icon="mdi:power-off" slot="icon-off"></ha-icon>
            </${ze(Ws.ElementName)}>
        `}createFullDetail(){var e,t;const i=null!==(t=null===(e=this._lastRenderedContainer)||void 0===e?void 0:e.brightnessValue)&&void 0!==t?t:100;return Ve`
            <${ze(Ns.ElementName)} class='color-picker'
                mode='color'
                @change=${e=>this.onColorChanged(e)}
            >
            </${ze(Ns.ElementName)}>
            <${ze(qs.ElementName)} class='mode-selector'>
            </${ze(qs.ElementName)}>
            <${ze(Hs.ElementName)} class='brightness-rollup'
                width='${nr.rollupWidth}'
                height='${nr.rollupHeight}'
                heightOpened='${nr.rollupHeightOpen}'
                iconSize='${nr.rollupIconSize}'
                .value=${i}
                @change=${e=>this.brightnessValueChanged(e)}
            >
            </${ze(Hs.ElementName)}>
        `}connectedCallback(){super.connectedCallback(),this.areaController&&this.registerLightsPropertyChanged(this.areaController),this.updateComplete.then((()=>{this._colorPicker||(this._colorPicker=this.renderRoot.querySelector(".color-picker"),this._lightMarkerManager=new ar(this._colorPicker,(e=>this.setLightContainerFromPicker(e))),this.createAreaControllerMarkers()),this._modeSelector||(this._modeSelector=this.renderRoot.querySelector(".mode-selector"),this._modeSelector.colorPicker=this._colorPicker),this._brightnessRollup||(this._brightnessRollup=this.renderRoot.querySelector(".brightness-rollup"))}))}disconnectedCallback(){super.disconnectedCallback(),this.areaController&&this.unregisterLightsPropertyChanged(this.areaController)}updateColorPickerSize(){const e=this.renderRoot.querySelector(".color-picker");if(!e)return;const t=this.getPickerSize();if(!t)return;e.style.width=t+"px",e.style.height=t+"px";const i=this.clientHeight-t-(nr.colorPickerMarginTop+nr.colorPickerMarginBottom);if(i>0){const t=i/2;e.style.marginTop=nr.colorPickerMarginTop+t+"px",e.style.marginBottom=nr.colorPickerMarginBottom+t+"px"}else e.style.marginTop="",e.style.marginBottom=""}updateBrightnessRollupSize(e){const t=this.renderRoot.querySelector(".brightness-rollup");if(!t)return;const i=this.getPickerSize();if(i)if(t.classList.toggle("full-size",e),e){let e=i/3;e<56&&(e=56),t.style.width=e+"px",t.width=e,t.height=t.heightOpened=i,t.iconSize=nr.rollupBigIconSize}else t.style.width="",t.width=nr.rollupWidth,t.height=nr.rollupHeight,t.heightOpened=nr.rollupHeightOpen,t.iconSize=nr.rollupIconSize}updateBigSwitchSize(){const e=this.renderRoot.querySelector(".light-switch");if(!e)return;const t=this.getPickerSize();if(!t)return;let i=t/3;i<60&&(i=60);const s=i+"px";e.style.width=s,e.style.setProperty("--control-switch-thickness",s),e.style.height=t+"px"}getPickerSize(){const e=Math.min(this.clientHeight,this.clientWidth);if(0==e)return null;return e-(nr.colorPickerMarginTop+nr.colorPickerMarginBottom)}};or.ElementName="hue-light-detail"+Ue.ElementPostfix,or.colorPickerMarginTop=40,or.colorPickerMarginBottom=20,or.rollupHeight=qs.totalHeight,or.rollupWidth=qs.totalHeight/2*3,or.rollupHeightOpen=200,or.rollupIconSize=24,or.rollupBigIconSize=30,or.selectorPadding=24,or.selectorBottom=0,or.styles=l`
    :host {
        margin-top: -30px;
        opacity: 0;
        transition:${a(Ue.TransitionDefault)};
    }
    :host(.visible) {
        margin-top: 0;
        opacity: 1;
    }

    .back-button {
        color: white;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .color-picker {
        display: block;
        margin: ${nr.colorPickerMarginTop}px auto ${nr.colorPickerMarginBottom}px auto;
    }
    .mode-selector {
        position: absolute;
        bottom: ${nr.selectorBottom}px;
        left: ${nr.selectorPadding}px;
    }
    .brightness-rollup {
        position: absolute;
        bottom: ${nr.selectorBottom}px;
        right: ${nr.selectorPadding}px;
    }
    .brightness-rollup.full-size {
        position:static;
        display:block;
        margin: ${nr.colorPickerMarginTop-25}px auto ${nr.colorPickerMarginBottom}px auto;
    }
    .light-switch {
        margin: ${nr.colorPickerMarginTop}px auto ${nr.colorPickerMarginBottom}px auto;
    }
    `,e([ye()],or.prototype,"areaController",void 0),e([ye()],or.prototype,"lightContainer",void 0),or=nr=e([me(or.ElementName)],or);class ar{constructor(e,t){this._stateUpdateSuspended=!1,this._picker=e,this._onMarkerActivation=t,this._picker.addEventListener("activemarkers-change",(e=>{const t=this._picker.getActiveMarkers().map((e=>this.getLight(e))).filter((e=>!!e));t.length&&this._onMarkerActivation(t)})),this.clear()}add(...e){e.forEach((e=>{if(e.features.isEmpty()||e.features.isOnlyBrightness())return;const t=this._picker.addMarker(e.getEntityId());t.icon=e.getIcon()||ys.getIcon(1),!e.features.color&&e.features.colorTemp?t.fixedMode="temp":e.features.color&&!e.features.colorTemp&&(t.fixedMode="color"),this._markerToLight[t.name]=e,this._lightToMarker[e.getEntityId()]=t,this.applyState(e)})),this._picker.tryMergeMarkers()}suspendStateUpdate(e){this._stateUpdateSuspended=!0;try{e()}finally{this._stateUpdateSuspended=!1}}applyState(e,t=!1){if(this._stateUpdateSuspended)return;const i=this.getMarker(e);i&&!i.isDrag&&(e.isColorModeColor()?e.color&&(i.color=e.color):e.isColorModeTemp()&&e.colorTemp&&(i.temp=e.colorTemp),i.isOff=!e.isOn(),i.offColor=e.isUnavailable()?ar.MarkerUnavailableColor:ar.MarkerOffColor,t&&!i.isActive&&(this._picker.shouldUnmergeMarker(i)&&this._picker.unmergeMarker(i),this._picker.tryMergeMarkers(i)))}getLight(e){return this._markerToLight[e.name]}getMarker(e){return this._lightToMarker[e.getEntityId()]}clear(){this._markerToLight={},this._lightToMarker={},this._picker.clearMarkers()}}var lr;ar.MarkerOffColor=new Ne(0,0,0),ar.MarkerUnavailableColor=new Ne(102,102,102);let hr=lr=class extends ft{isOnlySelectedLight(e){return 1==this._selectedLights.length&&this._selectedLights[0]==e}setSelectedLights(...e){this._selectedLights.length=0,e.forEach((e=>this._selectedLights.push(e))),this.requestUpdate("_selectedLights")}clearSelectedLights(){this._selectedLights.length=0,this.requestUpdate("_selectedLights")}loadSelectedLights(e){var t;const i=null===(t=e.lightContainer)||void 0===t?void 0:t.getLights();i&&this.setSelectedLights(...i)}constructor(e,t,i){super("HueDialog"),this._isRendered=!1,this._selectedLights=new Array,this._backdropSet=!1,this._lightDetailElement=null,this.onChangeHandler=()=>this.onChangeCallback(),this._config=e,this._ctrl=t,this._actionHandler=i}onLightSelected(e){const t=()=>{var e;this.clearSelectedLights(),null===(e=this._lightDetailElement)||void 0===e||e.hide()};if(e.detail.isSelected||!this.isOnlySelectedLight(e.detail.lightContainer)){const i=()=>{this.setSelectedLights(e.detail.lightContainer),lr.tileScrollTo(e.detail.tileElement),this._lightDetailElement&&(this._lightDetailElement.lightContainer=e.detail.lightContainer,this._lightDetailElement.show())};e.detail.tileElement.isSelected=!0,this._lightDetailHistoryStep=new ds(i,t,or.ElementName),ps.instance.addStep(this._lightDetailHistoryStep)}else t()}hideLightDetail(){this.clearSelectedLights(),this._lightDetailHistoryStep&&ps.instance.goBefore(this._lightDetailHistoryStep)}toggleUnderDetailControls(e){var t,i;this.renderRoot.querySelectorAll(".detail-hide").forEach((t=>{t.classList.toggle("hue-hidden",e)}));const s=null===(i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-dialog"))||void 0===i?void 0:i.shadowRoot;if(s){const t=s.getElementById("content");t&&(e?(t.style.overflowY="hidden",t.scrollBy({top:t.scrollHeight,behavior:"smooth"})):t.style.overflowY="")}}afterSceneActivated(e){lr.tileScrollTo(e.detail.tileElement)}static tileScrollTo(e){if(!e)return;const t=e.closest(".tile-scroller");if(null==t)throw Error("Parent tile-scroller not found.");const i=t.offsetLeft+t.scrollLeft,s=t.clientWidth+i,r=e.offsetLeft-10,n=e.offsetLeft+e.clientWidth+10,o=r<i;o!=n>s&&(o?t.scrollBy({left:r-i,behavior:"smooth"}):t.scrollBy({left:n-s,behavior:"smooth"}))}show(){if(this._isRendered)throw new Error("Already rendered!");this._historyStep=new ds((()=>this.showInternal()),(()=>this.close()),lr.ElementName),ps.instance.addStep(this._historyStep)}showInternal(){this._isRendered=!0;const e=this.getDialogElement();e&&(e.open=!0);const t=document.getElementsByTagName("home-assistant"),i=t.length?t[0].shadowRoot:null;i?i.appendChild(this):document.body.appendChild(this),this._ctrl.registerOnPropertyChanged(this._elementId,this.onChangeHandler,!0)}close(){if(!this._isRendered)return;const e=this.getDialogElement();e?e.close():this.onDialogClose()}getDialogElement(){return this._isRendered&&this.renderRoot?this.renderRoot.querySelector("ha-dialog"):null}onDialogClose(){this._isRendered&&(this.remove(),this._ctrl.unregisterOnPropertyChanged(this._elementId),this._isRendered=!1),this._historyStep&&ps.instance.goBefore(this._historyStep)}static get styles(){return[lr.haStyleDialog,l`
    /* hiding controls when light detail is open */
    .detail-hide {
        transition:${a(Ue.TransitionDefault)};
    }

    .hue-hidden {
        opacity: 0;
        pointer-events: none;
    }

    /* icon centering */
    .mdc-icon-button i,
    .mdc-icon-button svg,
    .mdc-icon-button img,
    .mdc-icon-button ::slotted(*){
        height:auto;
    }

    /* same color header */
    .hue-heading {
        --hue-heading-text-color: var(--hue-text-color, ${a(Ue.ThemeDialogHeadingColorVar)});
        color:var(--hue-heading-text-color);
        background:var(--hue-background, ${a(Ue.ThemeCardBackgroundVar)} );
        box-shadow:var(--hue-box-shadow), 0px 5px 10px rgba(0,0,0,0.5);
        transition:${a(Ue.TransitionDefault)};

        border-bottom-left-radius: var(--ha-dialog-border-radius, 28px);
        border-bottom-right-radius: var(--ha-dialog-border-radius, 28px);
        padding-bottom: calc(var(--ha-dialog-border-radius, 28px) / 2);

        /* HA will show bottom border when scrolled down */
        border-bottom-width: 0;

        overflow:hidden;

        /* is above the backdrop */
        z-index:1;
    }
    ha-dialog-header {
        --mdc-theme-on-primary: var(--hue-heading-text-color);
        --mdc-theme-primary: transparent;
        flex-shrink: 0;
        display: block;
    }
    .hue-heading ha-switch {
        padding: 12px;
        margin: 4px 0;
    }
    .hue-heading .brightness-slider {
        width: 100%;
    }
    /* Disable the bottom border radius */
    /* in default styles: --ha-border-radius=0 in this case */
    /*
    @media all and (max-width: 450px), all and (max-height: 500px) {
        border-bottom-left-radius: none;
        border-bottom-right-radius: none;
        padding-bottom: none;
    }
    */

    /* titles */
    .header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
    }
    .header .title{
        color: ${a(Ue.ThemeSecondaryTextColorVar)};
        font-family: var(--paper-font-title_-_font-family);
        -webkit-font-smoothing: var( --paper-font-title_-_-webkit-font-smoothing );
        font-size: var(--paper-font-subhead_-_font-size);
        font-weight: var(--paper-font-title_-_font-weight);
        letter-spacing: var(--paper-font-title_-_letter-spacing);
        line-height: var(--paper-font-title_-_line-height);
    }

    .content {
        outline: none;
    }

    /* tiles - scenes, lights */
    .tile-scroller {
        display: flex;
        flex-flow: column;
        /*gap: ${lr.tileGap}px;*/
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 ${lr.haPadding}px;
        margin: 0 -${lr.haPadding}px;
    }
    /* width */
    ::-webkit-scrollbar {
        height: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
        /*background: #f1f1f1;*/
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #888; 
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

    @media screen and (max-width: 768px){
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            height: 0px;
            background: transparent;
        }
    }

    .tiles {
        display: flex;
        flex-flow: row;
        gap: ${lr.tileGap}px;
        margin-bottom: ${lr.tileGap}px;
    }
    .tile-scroller .tiles:first-child{
        margin-top: ${lr.headerMargin}px;
    }
    .tiles::after {
        /* Flex loosing right padding, when overflowing */
        content: '';
        min-width: ${lr.haPadding-lr.tileGap}px;
    }

    /* Scene tiles */
    .tile-scroller.scene-tiles{
        min-height: 100px;
    }

    /* Light tiles */
    .tile-scroller.light-tiles{
        transition: ${a(Ue.TransitionDefault)};
        bottom: 100px;
    }

    @media all and (max-width: 450px), all and (max-height: 500px){
        .detail-active .tile-scroller.light-tiles{
            position: absolute;
            bottom: 30px;
            width: calc(100% - ${2*lr.haPadding}px);
        }
    }
    `]}tryCreateBackdropAndLightDetail(e=!1){var t,i;if(!this._backdropSet||!this._lightDetailElement){const s=null===(i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-dialog"))||void 0===i?void 0:i.shadowRoot,r=s&&s.querySelector(".mdc-dialog__surface");if(r){if(!this._backdropSet){const e=document.createElement("div");e.id="hue-backdrop",e.style.position="absolute",e.style.width="100%",e.style.height="100%",e.style.borderRadius="var(--ha-dialog-border-radius, 28px)",e.style.background="var(--hue-background)",e.style.transition=Ue.TransitionDefault;const t="linear-gradient(rgba(255, 255, 255, .25) 0%, transparent 70%)";e.style.mask=t,e.style.webkitMask=t,(e.style.mask||e.style.webkitMask)&&r.prepend(e),this._backdropSet=!0}if(!this._lightDetailElement){const e=new or;e.style.position="absolute",e.style.width="100%",e.style.height="calc(100% - 200px)",e.style.zIndex="2",e.areaController=this._ctrl,e.addEventListener("show",(()=>{this.toggleUnderDetailControls(!0)})),e.addEventListener("hide",(()=>{this.toggleUnderDetailControls(!1),this.hideLightDetail()})),e.addEventListener("lightcontainer-change",(()=>{this.loadSelectedLights(e)})),r.prepend(e),this._lightDetailElement=e}}else if(e)throw new Error("Cannot create backdrop and lightDetail. Surface not found.")}}updateStylesInner(e){var t,i;const s=this._config.getHueScreenBgColor();if(e){Ye.applyTheme(this,this._ctrl.hass.themes,this._config.theme),Ye.setDialogThemeStyles(this,"--hue-screen-background",s.isThemeColor()||this._config.getOffColor().isThemeColor());let e=null,t=null;s.isThemeColor()||(e=s,t=e.getForeground(Ue.DialogFgLightColor,Ue.DarkColor,120),this.style.setProperty("--hue-screen-background",e.toString()),this.style.setProperty("--primary-text-color",t.toString()))}const r=this.renderRoot.querySelector(".hue-heading");if(!r)throw new Error("Hue heading not found!");let n;if(this._config.wasOffColorSet){const e=this._config.getOffColor();n=e.isThemeColor()?null:new qe([e.getBaseColor()])}else n=new qe([new Ne(Ue.DialogOffColor)]);const o=ut.calculateBackAndForeground(this._ctrl,n,!0),a=ut.calculateDefaultShadow(r,this._ctrl,this._config.offShadow);this._config.hueBorders&&this.style.setProperty("--ha-dialog-border-radius",Ue.HueBorderRadius+"px"),this.style.setProperty("--hue-background",null!==(i=null===(t=o.background)||void 0===t?void 0:t.toString())&&void 0!==i?i:Ue.ThemeCardBackgroundVar),this.style.setProperty("--hue-box-shadow",a),null!=o.foreground?this.style.setProperty("--hue-text-color",o.foreground.toString()):this.style.removeProperty("--hue-text-color")}onChangeCallback(){this.requestUpdate(),this.updateStylesInner(!1)}render(){this._isRendered=!0;const e=this._config.getTitle(this._ctrl).resolveToString(this._ctrl.hass);return Ve`
        <ha-dialog
          open
          @closed=${()=>this.onDialogClose()}
          .heading=${e}
          hideActions
        >
          <ha-dialog-header slot="heading" class="hue-heading detail-hide">
            <ha-icon-button
              slot="navigationIcon"
              dialogAction="cancel"
            >
              <ha-icon
                icon=${"mdi:close"}
                style="height:auto"
              >
              </ha-icon>
            </ha-icon-button>
            <div
              slot="title"
              class="main-title"
              .title=${e}
            >
              ${e}
            </div>
            <div slot="actionItems">
              ${ut.createSwitch(this._ctrl,this.onChangeHandler,this._config.switchOnScene)}
            </div>
            ${ut.createSlider(this._ctrl,this._config,this.onChangeHandler)}
          </ha-dialog-header>
          <div class="${fe({content:!0,"detail-active":!!this._selectedLights.length})}" tabindex="-1" dialogInitialFocus>
            <div class='header detail-hide'>
                <div class='title'>${this._config.scenes.length?sr(this._ctrl.hass,"dialog.scenes"):G}</div>
            </div>
            <div class='tile-scroller scene-tiles detail-hide'>
                <div class='tiles'>
                    ${this._config.scenes.map(((t,i)=>i%2==1?G:Ve`<${ze(_s.ElementName)}
                            .cardTitle=${e}
                            .sceneConfig=${t}
                            @activated=${e=>this.afterSceneActivated(e)}
                            .hass=${this._ctrl.hass}
                            .actionHandler=${this._actionHandler}>
                        </${ze(_s.ElementName)}>`))}
                </div>
                <div class='tiles'>
                    ${this._config.scenes.map(((t,i)=>i%2==0?G:Ve`<${ze(_s.ElementName)}
                            .cardTitle=${e}
                            .sceneConfig=${t}
                            @activated=${e=>this.afterSceneActivated(e)}
                            .hass=${this._ctrl.hass}
                            .actionHandler=${this._actionHandler}>
                        </${ze(_s.ElementName)}>`))}
                </div>
            </div>

            <div class='header detail-hide'>
                <div class='title'>${sr(this._ctrl.hass,"dialog.lights")}</div>
            </div>
            <div class='tile-scroller light-tiles'>
                <div class='tiles'>
                    ${this._ctrl.getLights().map((t=>Ve`<${ze(bs.ElementName)}
                            .cardTitle=${e}
                            .lightContainer=${t}
                            .isSelected=${this._selectedLights.indexOf(t)>=0}
                            .isUnselected=${this._selectedLights.length&&-1==this._selectedLights.indexOf(t)}
                            @selected-change=${e=>this.onLightSelected(e)}
                            .defaultColor=${this._config.getDefaultColor()}
                            .hass=${this._ctrl.hass}
                            .actionHandler=${this._actionHandler}>
                        </${ze(bs.ElementName)}>`))}
                </div>
            </div>
          </div>
        </ha-dialog>
        `}updated(e){super.updated(e),this.updateStylesInner(!1)}connectedCallback(){super.connectedCallback(),this.updateComplete.then((()=>{this.tryCreateBackdropAndLightDetail(!0),this.updateStylesInner(!0)}))}};hr.ElementName="hue-dialog"+Ue.ElementPostfix,hr.haStyleDialog=l`
    /* mwc-dialog (ha-dialog) styles */
    ha-dialog {
      --mdc-dialog-min-width: 400px;
      --mdc-dialog-max-width: 600px;
      --mdc-dialog-heading-ink-color: var(--primary-text-color);
      --mdc-dialog-content-ink-color: var(--primary-text-color);
      --justify-action-buttons: space-between;
    }
    ha-dialog .form {
      color: var(--primary-text-color);
    }
    a {
      color: var(--primary-color);
    }
    /* make dialog fullscreen on small screens */
    @media all and (max-width: 450px), all and (max-height: 500px) {
      ha-dialog {
        --mdc-dialog-min-width: calc(
          100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
        );
        --mdc-dialog-max-width: calc(
          100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
        );
        --mdc-dialog-min-height: 100%;
        --mdc-dialog-max-height: 100%;
        --vertical-align-dialog: flex-end;
        --ha-dialog-border-radius: 0px;
      }
    }
    mwc-button.warning {
      --mdc-theme-primary: var(--error-color);
    }
    .error {
      color: var(--error-color);
    }
  `,hr.headerMargin=8,hr.tileGap=10,hr.haPadding=24,hr=lr=e([me(hr.ElementName)],hr);class cr{constructor(e,t,i){this._config=e,this._ctrl=t,this._owner=i}showMoreInfo(e){Pe(this._owner,"hass-more-info",{entityId:e})}openHueScreen(){new hr(this._config,this._ctrl,this).show()}handleCardClick(){const e=this._ctrl.isOn();let t=e?this._config.onClickAction:this._config.offClickAction;const i=e?this._config.onClickData:this._config.offClickData;t==rt.Default&&(t=rt.HueScreen),this.executeClickAction(t,i)}handleCardHold(){const e=this._ctrl.isOn();let t=e?this._config.onHoldAction:this._config.offHoldAction;const i=e?this._config.onHoldData:this._config.offHoldData;t==rt.Default&&(t=rt.MoreInfo),this.executeClickAction(t,i)}executeClickAction(e,t){switch(e){case rt.NoAction:break;case rt.TurnOn:this._ctrl.turnOn();break;case rt.TurnOff:this._ctrl.turnOff();break;case rt.MoreInfo:let i=t.getData("entity");i||(i=this._ctrl.isOn()?this._ctrl.getLitLights()[0].getEntityId():this._config.getEntities()[0]),this.showMoreInfo(i);break;case rt.Scene:const s=t.getData("scene");if(!s)throw new Error("No scene for click defined.");const r=new ct(s);r.hass=this._ctrl.hass,r.activate();break;case rt.HueScreen:this.openHueScreen();break;case rt.Default:throw new Error("Cannot execute Default action");default:throw new Error(`Cannot executed unwknow action ${e}.`)}}}class dr{constructor(e){if(!e)throw new Error("Hass instance must be passed!");this._hass=e}async getLightEntitiesFromArea(e){var t;const i=this.slugify(e),s=await this._hass.connection.sendMessagePromise({type:"search/related",item_type:"area",item_id:i});if(!s||0===Object.keys(s).length)return null;const r=(null===(t=this._hass.areas[i])||void 0===t?void 0:t.name)||e;return s.entity&&s.entity.length?{groupName:r,lights:s.entity.filter((e=>e.startsWith("light."))),dataResult:s}:{groupName:r,lights:[],dataResult:s}}async getLightEntitiesFromLabel(e){const t=this.slugify(e),i=(await this._hass.connection.sendMessagePromise({type:"config/label_registry/list"})).find((e=>e.label_id==t));if(!i)return null;const s=await this._hass.connection.sendMessagePromise({type:"search/related",item_type:"label",item_id:t});if(!s||0===Object.keys(s).length)return null;const r=i.name||e;return s.entity&&s.entity.length?{groupName:r,lights:s.entity.filter((e=>e.startsWith("light."))),dataResult:s,labelInfo:i}:{groupName:r,lights:[],dataResult:s,labelInfo:i}}async getArea(e){const t=await this._hass.connection.sendMessagePromise({type:"search/related",item_type:"entity",item_id:e});return t&&t.area&&t.area.length?t.area[0]:null}async getScenes(e){const t=await this._hass.connection.sendMessagePromise({type:"search/related",item_type:"area",item_id:e});return this.getScenesFromResult(t)}getScenesFromResult(e){return e&&e.scene&&e.scene.length?e.scene:[]}slugify(e){var t;return(t=e,t.normalize("NFD").replace(/[\u0300-\u036f]/g,"")).toLowerCase().replaceAll(/[ _-]+/g,"_")}}class ur{constructor(e){if(this._isInitialized=!1,this._areaEntitiesLoaded=!1,this._labelEntitiesLoaded=!1,this._scenesLoaded=!1,!(e.entity||e.entities&&e.entities.length||e.area||e.label))throw new Error('At least one of "entity", "entities", "area" or "label" needs to be set.');this.entity=e.entity,this.entities=e.entities,this.area=e.area,this.label=e.label,this.groupEntity=e.groupEntity,this._title=e.title,this.description=e.description,this._icon=e.icon,this.iconSize=ur.getIconSize(e.iconSize),this.showSwitch=ur.getBoolean(e.showSwitch,!0),this.switchOnScene=e.switchOnScene,this.slider=ur.getSliderType(e.slider),this._scenes=ur.getScenesArray(e.scenes),this.sceneOrder=ur.getSceneOrder(e.sceneOrder),this.offClickAction=ur.getClickAction(e.offClickAction),this.offClickData=new lt(e.offClickData),this.onClickAction=ur.getClickAction(e.onClickAction),this.onClickData=new lt(e.onClickData),this.offHoldAction=ur.getClickAction(e.offHoldAction),this.offHoldData=new lt(e.offHoldData),this.onHoldAction=ur.getClickAction(e.onHoldAction),this.onHoldData=new lt(e.onHoldData),this.allowZero=ur.getBoolean(e.allowZero,!1),this.theme=e.theme||Ue.ThemeDefault,this.defaultColor=e.defaultColor||Ue.DefaultColor,this.offColor=e.offColor||Ue.OffColor,this.wasOffColorSet=!!e.offColor,this.hueScreenBgColor=e.hueScreenBgColor||Ue.DialogBgColor,this.offShadow=ur.getBoolean(e.offShadow,!0),this.hueBorders=ur.getBoolean(e.hueBorders,!0),this.apiId=e.apiId,this.isVisible=ur.getBoolean(e.isVisible,!0),this.style=e.style,this.card_mod=e.card_mod,null==this._scenes||this.area||this.label?this._isInitialized=!1:this._isInitialized=!0}static getBoolean(e,t){return null==e?t:!!e}static getSliderType(e){return e?ur.tryParseEnum(st,e,"Slider type"):st.Default}static getClickAction(e){return e?ur.tryParseEnum(rt,e,"Click action"):rt.Default}static getIconSize(e){if(!e)return Ue.IconSize[it.Original];if("number"==typeof e)return e;e=e.toString().toLowerCase();const t=ur.tryParseEnum(it,e,"Icon size");return Ue.IconSize[t]}static getSceneOrder(e){return e?ur.tryParseEnum(nt,e,"Scene order"):nt.Default}static tryParseEnum(e,t,i){let s="";for(const i in e){const r=e[i];if(t==r)return t;s+=`'${r}', `}throw new Error(`${i} '${t}' was not recognized. Allowed values are: ${s}`)}static getScenesArray(e){if(!e)return null;if(e.length>0){const t=new Array;for(let i=0;i<e.length;i++){const s=e[i],r=ur.getScene(s,i);r&&t.push(r)}return t}return[]}static getScene(e,t){if("string"==typeof e)return new ht(e);if(!e.entity)throw new Error(`Scene on index ${t} is missing 'entity' attribute, which is required.`);const i=new ht(e.entity);return i.title=e.title,i.icon=e.icon,i.color=e.color,i.activation=e.activation,i.activationData=e.activationData,i}get title(){return this._title}get icon(){return this._icon}get scenes(){return this._scenes||[]}getTitle(e){return this.title?new Ks(this.title):e.getTitle()}getEntities(){const e=[];return this.entity&&e.push(this.entity),this.entities&&this.entities.forEach((t=>{"string"==typeof t?e.push(t):t.entity&&e.push(t.entity)})),this._areaEntities&&this._areaEntities.forEach((t=>{e.push(t)})),this._labelEntities&&this._labelEntities.forEach((t=>{e.push(t)})),Ze(e)}getDefaultColor(){return Ke.getColor(this.defaultColor)}getOffColor(){return new Fe(this.offColor)}getHueScreenBgColor(){return new Fe(this.hueScreenBgColor)}get isInitialized(){return this._isInitialized}async init(e){if(!e)throw new Error("Hass instance must be passed!");this._isInitialized||(this._isInitialized=!0,await this.tryLoadAreaInfo(e),await this.tryLoadLabelInfo(e),this.tryLoadScenes(e))}async tryLoadAreaInfo(e){if(this._areaEntitiesLoaded||!this.area||null!=this._areaEntities)return;this._areaEntitiesLoaded=!0;const t=new dr(e);let i;try{i=await t.getLightEntitiesFromArea(this.area)}catch(e){throw console.error("Cannot load light entities from HA."),console.error(e),new Error(`Cannot load entities from area '${this.area}'. See console for more info.`)}if(null==i)throw new Error(`Area '${this.area}' does not exist.`);if(0==i.lights.length)throw new Error(`Area '${this.area}' has no light entities.`);if(this._areaEntities=i.lights,null==this._title&&(this._title=i.groupName),null==this._scenes&&this.getEntities().length==this._areaEntities.length){const e=t.getScenesFromResult(i.dataResult);this.setLoadedScenes(e)}}async tryLoadLabelInfo(e){var t;if(this._labelEntitiesLoaded||!this.label||null!=this._labelEntities)return;this._labelEntitiesLoaded=!0;const i=new dr(e);let s;try{s=await i.getLightEntitiesFromLabel(this.label)}catch(e){throw console.error("Cannot load light entities from HA."),console.error(e),new Error(`Cannot load entities from label '${this.label}'. See console for more info.`)}if(null==s)throw new Error(`Label '${this.label}' does not exist.`);if(0==s.lights.length)throw new Error(`Label '${this.label}' has no light entities.`);this._labelEntities=s.lights,null==this._title&&(this._title=s.groupName),null==this._icon&&(null===(t=s.labelInfo)||void 0===t?void 0:t.icon)&&(this._icon=s.labelInfo.icon)}async tryLoadScenes(e){if(this._scenesLoaded||null!=this._scenes)return;this._scenesLoaded=!0;const t=new dr(e);try{const e=this.getEntities().map((e=>({entityId:e})));await Promise.all(e.map((async e=>{e.area=await t.getArea(e.entityId)}))),await Promise.all(e.map((async e=>{e.area&&(e.areaScenes=await t.getScenes(e.area))})));let i=e.filter((e=>!!e.areaScenes)).flatMap((e=>e.areaScenes));i=Ze(i),this.setLoadedScenes(i)}catch(e){console.error("Cannot load scenes from HA."),console.error(e)}}setLoadedScenes(e){switch(this.sceneOrder){case nt.NameAsc:e.sort(((e,t)=>e.localeCompare(t)));break;case nt.NameDesc:e.sort(((e,t)=>t.localeCompare(e)))}this._scenes=ur.getScenesArray(e)}}class gr{constructor(e){"string"==typeof e?this._message=e:e instanceof Error?(this._message=e.message,this._stack=e.stack):this._message=(null==e?void 0:e.toString())||"UNKNOWN ERROR"}get message(){return this._message}get stack(){return this._stack||""}}class pr{static toConsole(){const e=[new Ne("#0046FF"),new Ne("#9E00FF"),new Ne("#FF00F3"),new Ne("#FF0032"),new Ne("#FF8B00")],t=pr.getText(),i=new Array,s=Math.floor(t.colorCount/(e.length-1));for(let t=0;t<e.length-1;t++){const r=e[t],n=e[t+1],o=pr.generateGradientArray(r,n,s);i.push(...o)}for(;i.length<t.colorCount;)i.push(e[e.length-1]);console.info(t.result,...i.map((e=>"font-weight:bold;color:white;background:"+e.toString())))}static getText(){const e=Ue.CardElementName.toUpperCase()+" "+Ue.Version;let t="%c",i=1;for(let s=0;s<e.length;s++)t+=e.charAt(s)+"%c",i++;return{result:t,colorCount:i}}static generateGradientArray(e,t,i){const s=[];for(let r=0;r<i;r++){const n=r/i;s.push(pr.interpolateColor(e,t,n))}return s}static interpolateColor(e,t,i){const s=Math.round(e.getRed()+i*(t.getRed()-e.getRed())),r=Math.round(e.getGreen()+i*(t.getGreen()-e.getGreen())),n=Math.round(e.getBlue()+i*(t.getBlue()-e.getBlue()));return new Ne(s,r,n)}}const fr=(e,t)=>e+t;class mr{static overrideHistory(){if(mr._isHistoryOverriden)return;const{pushState:e,replaceState:t}=window.history;window.history.pushState=function(...t){e.apply(window.history,t),window.dispatchEvent(new Event("pushstate"))},window.history.replaceState=function(...e){t.apply(window.history,e),window.dispatchEvent(new Event("replacestate"))},Ue.Dev&&console.log("[LocationStateTracker] History overriden")}}mr._isHistoryOverriden=!1;const vr=e=>{Ue.Dev&&console.log("[HueApiProvider] "+e)};class _r{static registerCard(e,t){const i=_r._registeredCards[e];if(i&&i.isConnected)throw new Error(`Card with ID '${e}' already registered!`);return _r._registeredCards[e]=t,_r.registerRouterMethods(e),vr(`Registered '${e}'`),_r.publishWrapper(),()=>_r.unregisterCard(e)}static unregisterCard(e){delete _r._registeredCards[e],_r.unregisterRouterMethods(e),vr(`Unregistered '${e}'`)}static onLocationChanged(){location.hash!=_r._lastHash&&(_r._lastHash=location.hash,_r.onHashChanged(location.hash))}static onHashChanged(e,t=0){if(0!=e.indexOf("#"+Ue.ApiProviderName+":"))return;const i=e.substring(Ue.ApiProviderName.length+2),s=_r._wrapper[i];"function"==typeof s?(vr("Hash - Calling API function "+i),setTimeout((()=>{s()}),10),location.hash==e&&history.replaceState(history.state,"",location.pathname+location.search)):t<5?setTimeout((()=>_r.onHashChanged(e,t+1)),50):console.error(`[HueApiProvider] API function named ${i} was NOT found on API object window.${Ue.ApiProviderName}`)}static publishWrapper(){const e=window;e[Ue.ApiProviderName]||(e[Ue.ApiProviderName]=_r._wrapper,vr("Wrapper published to window."+Ue.ApiProviderName),mr.overrideHistory(),window.addEventListener("navigate",_r.onLocationChanged),window.addEventListener("load",_r.onLocationChanged),window.addEventListener("hashchange",_r.onLocationChanged),window.addEventListener("popstate",_r.onLocationChanged),window.addEventListener("pushstate",_r.onLocationChanged),window.addEventListener("replacestate",_r.onLocationChanged),vr("Registered for hash changes"),_r.onLocationChanged())}static registerRouterMethods(e){_r._wrapper[fr(e,"_openHueScreen")]=()=>_r.openHueScreen(e)}static unregisterRouterMethods(e){delete _r._wrapper[fr(e,"_openHueScreen")]}static openHueScreen(e){const t=_r._registeredCards[e];if(!t)throw new Error(`[HueApiProvider] Card with API ID ${e} not found`);t.api().openHueScreen()}}_r._registeredCards={},_r._wrapper={version:Ue.Version+(Ue.Dev?" TEST":"")},_r._lastHash="",pr.toConsole(),window.customCards=window.customCards||[],window.customCards.push({type:Ue.CardElementName,name:Ue.CardName,description:Ue.CardDescription});let yr=class extends ft{constructor(){super("HueLikeLightCard"),this._ctrlListenerRegistered=!1,this._configInitPending=!1,this._switchColorDetected=!1,this.onChangeHandler=()=>this.onChangeCallback()}set hass(e){if(!e)return;const t=this._hass;this._hass=e,this.trySetHassWhereNeeded(),this.requestUpdate(Xe(this,"hass"),t)}get hass(){return this._hass}catchErrors(e){const t=e=>{throw this._error=new gr(e),this.requestUpdate(),e};try{this._error=void 0,"AsyncFunction"===e.constructor.name?e().catch(t):e()}catch(e){t(e)}}setConfig(e){this.catchErrors((()=>{const t=this._config;this._config=new ur(e),this._config.isInitialized?this.useInitializedConfig(t):(this._oldConfig=t,this._configInitPending=!0,this.tryInitializeConfig(this.hass))}))}tryInitializeConfig(e){if(!e||!this._configInitPending)return;const t=this._oldConfig;this._configInitPending=!1,this._oldConfig=void 0,this.catchErrors((async()=>{await this._config.init(e),this.useInitializedConfig(t)}))}useInitializedConfig(e){var t;if(1!=(null===(t=this._config)||void 0===t?void 0:t.isInitialized))throw new Error("Config is not initialized.");this._ctrl=new rr(this._config.getEntities(),this._config.getDefaultColor(),this._config.groupEntity),this._actionHandler=new cr(this._config,this._ctrl,this);const i=this._config.getOffColor();i.isThemeColor()?this._offBackground=null:this._offBackground=new qe([i.getBaseColor()]),this._error=void 0,this.trySetHassWhereNeeded(),this.requestUpdate("_config",e)}trySetHassWhereNeeded(){this.hass&&(this.tryInitializeConfig(this.hass),this._ctrl&&(this._ctrl.hass=this.hass))}getEditMode(){var e;return this.editMode?"hui-card-preview"==(null===(e=this.parentElement)||void 0===e?void 0:e.tagName.toLowerCase())?"editor":"inplace":null}getCardSize(){return 3}cardClicked(){this._actionHandler&&this._actionHandler.handleCardClick(),this.updateStylesInner()}cardHolded(){this._actionHandler&&this._actionHandler.handleCardHold(),this.updateStylesInner()}updated(e){if(super.updated(e),this.setupListeners(),this.updateStylesInner(),!this._config||!this.hass)return;const t=e.get("hass"),i=e.get("_config");t&&i&&t.themes===this.hass.themes&&i.theme===this._config.theme||Ye.applyTheme(this,this.hass.themes,this._config.theme)&&this.updateStylesInner(!0)}updateStylesInner(e=!1){var t,i,s,r;if(!this._config||!this._ctrl)return;this._switchColorDetected||(this._config.showSwitch&&Ye.detectSwitchColors(this),this._switchColorDetected=!0);const n=this.renderRoot.querySelector("ha-card");if(!this._config.hueBorders&&(null==this._haShadow||e)){const e=document.createElement("ha-card");document.body.appendChild(e);const t=getComputedStyle(e);this._haShadow=t.boxShadow,e.remove(),"none"==this._haShadow&&(null==n?this._haShadow=null:n.classList.add("new-borders")),this.style.setProperty("--ha-default-shadow",this._haShadow)}this.style.setProperty("--hue-icon-size",this._config.iconSize.toString()),null==this._offBackground&&Ye.detectThemeCardBackground(this,e);const o=ut.calculateBackAndForeground(this._ctrl,this._offBackground),a=ut.calculateDefaultShadow(n,this._ctrl,this._config.offShadow);this.style.setProperty("--hue-background",null!==(i=null===(t=o.background)||void 0===t?void 0:t.toString())&&void 0!==i?i:Ue.ThemeCardBackgroundVar),this.style.setProperty("--hue-text-color",null!==(r=null===(s=o.foreground)||void 0===s?void 0:s.toString())&&void 0!==r?r:Ue.ThemeSecondaryTextColorVar),this.style.setProperty("--ha-card-box-shadow",a),this.style.setProperty("--hue-box-shadow",a)}onChangeCallback(){this.requestUpdate(),this.updateStylesInner()}render(){if(this._error)return W`<ha-alert alert-type="error" .title=${this._error.message}>
                ${this._error.stack?W`<pre>${this._error.stack}</pre>`:G}
            </ha-alert>`;if(!(this._config&&this._ctrl&&this._hass&&this._config.isVisible))return G;const e=this._config.getTitle(this._ctrl),t=this._ctrl.getDescription(this._config.description),i=e.resolveToString(this._hass),s=t.resolveToString(this._hass),r=this._config.showSwitch,n={"text-area":!0,"no-switch":!r},o={"state-on":this._ctrl.isOn(),"state-off":this._ctrl.isOff(),"state-unavailable":this._ctrl.isUnavailable(),"hue-borders":this._config.hueBorders};return W`<ha-card class="${fe(o)}">
            <div class="tap-area">
                <ha-icon icon="${this._config.icon||this._ctrl.getIcon()}"></ha-icon>
                <div class="${fe(n)}">
                    <h2>${i}</h2>
                    <div class="desc">${s}</div>
                </div>
            </div>
            ${r?ut.createSwitch(this._ctrl,this.onChangeHandler,this._config.switchOnScene):G}

            ${ut.createSlider(this._ctrl,this._config,this.onChangeHandler)}
        </ha-card>`}connectedCallback(){super.connectedCallback(),this.updateStylesInner(),this.setupListeners()}disconnectedCallback(){super.disconnectedCallback(),this.destroyListeners()}setupListeners(){var e;!this._ctrlListenerRegistered&&this._ctrl&&(this._ctrlListenerRegistered=!0,this._ctrl.registerOnPropertyChanged(this._elementId,this.onChangeHandler));const t=this.renderRoot.querySelector(".tap-area");t&&!this._mc&&(this._mc=new es(t),this._mc.add(new Xi),this._mc.on("press",(()=>{this.cardHolded()})),this._mc.add(new Fi({event:"singletap"})),this._mc.on("singletap",(()=>{this.cardClicked()})),this._gc=new fs(t)),(null===(e=this._config)||void 0===e?void 0:e.apiId)&&!this._apiUnregister&&"editor"!=this.getEditMode()&&(this._apiUnregister=_r.registerCard(this._config.apiId,this))}destroyListeners(){this._ctrl&&(this._ctrl.unregisterOnPropertyChanged(this._elementId),this._ctrlListenerRegistered=!1),this._mc&&(this._mc.destroy(),this._mc=void 0),this._gc&&(this._gc.destroy(),this._gc=void 0),this._apiUnregister&&(this._apiUnregister(),this._apiUnregister=void 0)}api(){return{openHueScreen:()=>{var e;return null===(e=this._actionHandler)||void 0===e?void 0:e.openHueScreen()}}}};yr.styles=l`
    ha-card
    {
        min-height:80px;
        background:var(--hue-background);
        position:relative;
        box-shadow:var(--hue-box-shadow), var(--ha-default-shadow);
        background-origin: border-box;
    }
    ha-card.new-borders
    {
        /* since HA 2022.11 */
        box-shadow:var(--hue-box-shadow);
    }
    ha-card.hue-borders
    {
        border-radius:${Ue.HueBorderRadius}px;
        box-shadow:var(--hue-box-shadow), ${a(Ue.HueShadow)};
        border:none;
    }
    ha-card div.tap-area
    {
        height:46px; /* card(80) - slider(32) - border(2) */
        cursor: pointer;
    }
    ha-icon
    {
        position:absolute;
        left:22px;
        top:17px;
        transform:scale(var(--hue-icon-size, ${Ue.IconSize[it.Original]}));
        color:var(--hue-text-color);
        transition:${a(Ue.TransitionDefault)};
    }
    .text-area{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 50px;
        margin:0px 60px 0px 70px;
        line-height:normal;
        color:var(--hue-text-color);
        transition:${a(Ue.TransitionDefault)};
    }
    .text-area.no-switch{
        margin-right:10px;
    }
    .text-area h2
    {
        font-size:18px;
        font-weight:500;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        margin:4px 0 2px 0;
    }
    .text-area .desc
    {
        font-size:13px;
        margin-top:-2px;
    }
    ha-switch
    {
        position:absolute;
        right:14px;
        top:22px;
    }
    .brightness-slider
    {
        width:100%;
    }
    ha-alert{
        display:flex;
        overflow:auto;
    }
    `,yr=e([me(Ue.CardElementName)],yr);export{yr as HueLikeLightCard};
