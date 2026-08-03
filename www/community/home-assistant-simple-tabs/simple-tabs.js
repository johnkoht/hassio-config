function t(t,e,i,n){var r,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(s=(o<3?r(s):o>3?r(e,i,s):r(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new o(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,b=f?f.emptyScript:"",_=g.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let C=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&c(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const o=r.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const n=this.constructor,r=this[t];if(i??=n.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[m("elementProperties")]=new Map,C[m("finalized")]=new Map,_?.({ReactiveElement:C}),(g.reactiveElementVersions??=[]).push("2.1.1");const x=globalThis,$=x.trustedTypes,k=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+T,I=`<${S}>`,E=document,P=()=>E.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,B="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,j=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,D=/"/g,H=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),z=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,Y=E.createTreeWalker(E,129);function X(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,n=[];let r,o=2===e?"<svg>":3===e?"<math>":"",s=L;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(s.lastIndex=d,l=s.exec(i),null!==l);)d=s.lastIndex,s===L?"!--"===l[1]?s=N:void 0!==l[1]?s=R:void 0!==l[2]?(H.test(l[2])&&(r=RegExp("</"+l[2],"g")),s=j):void 0!==l[3]&&(s=j):s===j?">"===l[0]?(s=r??L,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,a=l[1],s=void 0===l[3]?j:'"'===l[3]?D:U):s===D||s===U?s=j:s===N||s===R?s=L:(s=j,r=void 0);const h=s===j&&t[e+1].startsWith("/>")?" ":"";o+=s===L?i+I:c>=0?(n.push(a),i.slice(0,c)+A+i.slice(c)+T+h):i+T+(-2===c?e:h)}return[X(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class W{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let r=0,o=0;const s=t.length-1,a=this.parts,[l,c]=G(t,e);if(this.el=W.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=Y.nextNode())&&a.length<s;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(A)){const e=c[o++],i=n.getAttribute(t).split(T),s=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:s[2],strings:i,ctor:"."===s[1]?tt:"?"===s[1]?et:"@"===s[1]?it:Q}),n.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:r}),n.removeAttribute(t));if(H.test(n.tagName)){const t=n.textContent.split(T),e=t.length-1;if(e>0){n.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],P()),Y.nextNode(),a.push({type:2,index:++r});n.append(t[e],P())}}}else if(8===n.nodeType)if(n.data===S)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=n.data.indexOf(T,t+1));)a.push({type:7,index:r}),t+=T.length-1}r++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,n){if(e===z)return e;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const o=M(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,n)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??E).importNode(e,!0);Y.currentNode=n;let r=Y.nextNode(),o=0,s=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new J(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=i[++s]}o!==a?.index&&(r=Y.nextNode(),o++)}return Y.currentNode=E,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),M(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=W.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new Z(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new W(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const r of t)n===e.length?e.push(i=new J(this.O(P()),this.O(P()),this,this.options)):i=e[n],i._$AI(r),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,n){const r=this.strings;let o=!1;if(void 0===r)t=K(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const n=t;let s,a;for(t=r[0],s=0;s<r.length-1;s++)a=K(this,n[i+s],e,s),a===z&&(a=this._$AH[s]),o||=!M(a)||a!==this._$AH[s],a===V?t=V:t!==V&&(t+=(a??"")+r[s+1]),this._$AH[s]=a}o&&!n&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends Q{constructor(t,e,i,n,r){super(t,e,i,n,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??V)===z)return;const i=this._$AH,n=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(W,J),(x.litHtmlVersions??=[]).push("3.3.1");const ot=globalThis;let st=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let r=n._$litPart$;if(void 0===r){const t=i?.renderBefore??null;n._$litPart$=r=new J(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};st._$litElement$=!0,st.finalized=!0,ot.litElementHydrateSupport?.({LitElement:st});const at=ot.litElementPolyfillSupport;at?.({LitElement:st}),(ot.litElementVersions??=[]).push("4.2.1");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},dt=(t=ct,e,i)=>{const{kind:n,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,r,t)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];e.call(this,i),this.requestUpdate(n,r,t)}}throw Error("Unsupported decorator location: "+n)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i);function gt(t,e){return(i,n,r)=>{const o=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof n?i:r??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return ut(i,n,{get(){let i=t.call(this);return void 0===i&&(i=o(this),(null!==i||this.hasUpdated)&&e.call(this,i)),i}})}return ut(i,n,{get(){return o(this)}})}}var ft,bt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ft||(ft={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(bt||(bt={}));var _t=function(t,e,i,n){n=n||{},i=null==i?{}:i;var r=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return r.detail=i,t.dispatchEvent(r),r};function mt(t){return null==t}var vt={isNothing:mt,isObject:function(t){return"object"==typeof t&&null!==t},toArray:function(t){return Array.isArray(t)?t:mt(t)?[]:[t]},repeat:function(t,e){var i,n="";for(i=0;i<e;i+=1)n+=t;return n},isNegativeZero:function(t){return 0===t&&Number.NEGATIVE_INFINITY===1/t},extend:function(t,e){var i,n,r,o;if(e)for(i=0,n=(o=Object.keys(e)).length;i<n;i+=1)t[r=o[i]]=e[r];return t}};function yt(t,e){var i="",n=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(i+='in "'+t.mark.name+'" '),i+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!e&&t.mark.snippet&&(i+="\n\n"+t.mark.snippet),n+" "+i):n}function wt(t,e){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=e,this.message=yt(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}wt.prototype=Object.create(Error.prototype),wt.prototype.constructor=wt,wt.prototype.toString=function(t){return this.name+": "+yt(this,t)};var Ct=wt;function xt(t,e,i,n,r){var o="",s="",a=Math.floor(r/2)-1;return n-e>a&&(e=n-a+(o=" ... ").length),i-n>a&&(i=n+a-(s=" ...").length),{str:o+t.slice(e,i).replace(/\t/g,"→")+s,pos:n-e+o.length}}function $t(t,e){return vt.repeat(" ",e-t.length)+t}var kt=function(t,e){if(e=Object.create(e||null),!t.buffer)return null;e.maxLength||(e.maxLength=79),"number"!=typeof e.indent&&(e.indent=1),"number"!=typeof e.linesBefore&&(e.linesBefore=3),"number"!=typeof e.linesAfter&&(e.linesAfter=2);for(var i,n=/\r?\n|\r|\0/g,r=[0],o=[],s=-1;i=n.exec(t.buffer);)o.push(i.index),r.push(i.index+i[0].length),t.position<=i.index&&s<0&&(s=r.length-2);s<0&&(s=r.length-1);var a,l,c="",d=Math.min(t.line+e.linesAfter,o.length).toString().length,h=e.maxLength-(e.indent+d+3);for(a=1;a<=e.linesBefore&&!(s-a<0);a++)l=xt(t.buffer,r[s-a],o[s-a],t.position-(r[s]-r[s-a]),h),c=vt.repeat(" ",e.indent)+$t((t.line-a+1).toString(),d)+" | "+l.str+"\n"+c;for(l=xt(t.buffer,r[s],o[s],t.position,h),c+=vt.repeat(" ",e.indent)+$t((t.line+1).toString(),d)+" | "+l.str+"\n",c+=vt.repeat("-",e.indent+d+3+l.pos)+"^\n",a=1;a<=e.linesAfter&&!(s+a>=o.length);a++)l=xt(t.buffer,r[s+a],o[s+a],t.position-(r[s]-r[s+a]),h),c+=vt.repeat(" ",e.indent)+$t((t.line+a+1).toString(),d)+" | "+l.str+"\n";return c.replace(/\n$/,"")},At=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Tt=["scalar","sequence","mapping"];var St=function(t,e){if(e=e||{},Object.keys(e).forEach(function(e){if(-1===At.indexOf(e))throw new Ct('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=e,this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=function(t){var e={};return null!==t&&Object.keys(t).forEach(function(i){t[i].forEach(function(t){e[String(t)]=i})}),e}(e.styleAliases||null),-1===Tt.indexOf(this.kind))throw new Ct('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')};function It(t,e){var i=[];return t[e].forEach(function(t){var e=i.length;i.forEach(function(i,n){i.tag===t.tag&&i.kind===t.kind&&i.multi===t.multi&&(e=n)}),i[e]=t}),i}function Et(t){return this.extend(t)}Et.prototype.extend=function(t){var e=[],i=[];if(t instanceof St)i.push(t);else if(Array.isArray(t))i=i.concat(t);else{if(!t||!Array.isArray(t.implicit)&&!Array.isArray(t.explicit))throw new Ct("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.implicit&&(e=e.concat(t.implicit)),t.explicit&&(i=i.concat(t.explicit))}e.forEach(function(t){if(!(t instanceof St))throw new Ct("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(t.loadKind&&"scalar"!==t.loadKind)throw new Ct("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(t.multi)throw new Ct("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(t){if(!(t instanceof St))throw new Ct("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(Et.prototype);return n.implicit=(this.implicit||[]).concat(e),n.explicit=(this.explicit||[]).concat(i),n.compiledImplicit=It(n,"implicit"),n.compiledExplicit=It(n,"explicit"),n.compiledTypeMap=function(){var t,e,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(t){t.multi?(i.multi[t.kind].push(t),i.multi.fallback.push(t)):i[t.kind][t.tag]=i.fallback[t.tag]=t}for(t=0,e=arguments.length;t<e;t+=1)arguments[t].forEach(n);return i}(n.compiledImplicit,n.compiledExplicit),n};var Pt=new Et({explicit:[new St("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return null!==t?t:""}}),new St("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return null!==t?t:[]}}),new St("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return null!==t?t:{}}})]});var Mt=new St("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(t){if(null===t)return!0;var e=t.length;return 1===e&&"~"===t||4===e&&("null"===t||"Null"===t||"NULL"===t)},construct:function(){return null},predicate:function(t){return null===t},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var Ot=new St("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e=t.length;return 4===e&&("true"===t||"True"===t||"TRUE"===t)||5===e&&("false"===t||"False"===t||"FALSE"===t)},construct:function(t){return"true"===t||"True"===t||"TRUE"===t},predicate:function(t){return"[object Boolean]"===Object.prototype.toString.call(t)},represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Bt(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Lt(t){return 48<=t&&t<=55}function Nt(t){return 48<=t&&t<=57}var Rt=new St("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e,i=t.length,n=0,r=!1;if(!i)return!1;if("-"!==(e=t[n])&&"+"!==e||(e=t[++n]),"0"===e){if(n+1===i)return!0;if("b"===(e=t[++n])){for(n++;n<i;n++)if("_"!==(e=t[n])){if("0"!==e&&"1"!==e)return!1;r=!0}return r&&"_"!==e}if("x"===e){for(n++;n<i;n++)if("_"!==(e=t[n])){if(!Bt(t.charCodeAt(n)))return!1;r=!0}return r&&"_"!==e}if("o"===e){for(n++;n<i;n++)if("_"!==(e=t[n])){if(!Lt(t.charCodeAt(n)))return!1;r=!0}return r&&"_"!==e}}if("_"===e)return!1;for(;n<i;n++)if("_"!==(e=t[n])){if(!Nt(t.charCodeAt(n)))return!1;r=!0}return!(!r||"_"===e)},construct:function(t){var e,i=t,n=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(e=i[0])&&"+"!==e||("-"===e&&(n=-1),e=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===e){if("b"===i[1])return n*parseInt(i.slice(2),2);if("x"===i[1])return n*parseInt(i.slice(2),16);if("o"===i[1])return n*parseInt(i.slice(2),8)}return n*parseInt(i,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&t%1==0&&!vt.isNegativeZero(t)},represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),jt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Ut=/^[-+]?[0-9]+e/;var Dt=new St("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(t){return null!==t&&!(!jt.test(t)||"_"===t[t.length-1])},construct:function(t){var e,i;return i="-"===(e=t.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),".inf"===e?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===e?NaN:i*parseFloat(e,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&(t%1!=0||vt.isNegativeZero(t))},represent:function(t,e){var i;if(isNaN(t))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(vt.isNegativeZero(t))return"-0.0";return i=t.toString(10),Ut.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),Ht=Pt.extend({implicit:[Mt,Ot,Rt,Dt]}),Ft=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),zt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var Vt=new St("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(t){return null!==t&&(null!==Ft.exec(t)||null!==zt.exec(t))},construct:function(t){var e,i,n,r,o,s,a,l,c=0,d=null;if(null===(e=Ft.exec(t))&&(e=zt.exec(t)),null===e)throw new Error("Date resolve error");if(i=+e[1],n=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(i,n,r));if(o=+e[4],s=+e[5],a=+e[6],e[7]){for(c=e[7].slice(0,3);c.length<3;)c+="0";c=+c}return e[9]&&(d=6e4*(60*+e[10]+ +(e[11]||0)),"-"===e[9]&&(d=-d)),l=new Date(Date.UTC(i,n,r,o,s,a,c)),d&&l.setTime(l.getTime()-d),l},instanceOf:Date,represent:function(t){return t.toISOString()}});var qt=new St("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(t){return"<<"===t||null===t}}),Yt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var Xt=new St("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e,i,n=0,r=t.length,o=Yt;for(i=0;i<r;i++)if(!((e=o.indexOf(t.charAt(i)))>64)){if(e<0)return!1;n+=6}return n%8==0},construct:function(t){var e,i,n=t.replace(/[\r\n=]/g,""),r=n.length,o=Yt,s=0,a=[];for(e=0;e<r;e++)e%4==0&&e&&(a.push(s>>16&255),a.push(s>>8&255),a.push(255&s)),s=s<<6|o.indexOf(n.charAt(e));return 0===(i=r%4*6)?(a.push(s>>16&255),a.push(s>>8&255),a.push(255&s)):18===i?(a.push(s>>10&255),a.push(s>>2&255)):12===i&&a.push(s>>4&255),new Uint8Array(a)},predicate:function(t){return"[object Uint8Array]"===Object.prototype.toString.call(t)},represent:function(t){var e,i,n="",r=0,o=t.length,s=Yt;for(e=0;e<o;e++)e%3==0&&e&&(n+=s[r>>18&63],n+=s[r>>12&63],n+=s[r>>6&63],n+=s[63&r]),r=(r<<8)+t[e];return 0===(i=o%3)?(n+=s[r>>18&63],n+=s[r>>12&63],n+=s[r>>6&63],n+=s[63&r]):2===i?(n+=s[r>>10&63],n+=s[r>>4&63],n+=s[r<<2&63],n+=s[64]):1===i&&(n+=s[r>>2&63],n+=s[r<<4&63],n+=s[64],n+=s[64]),n}}),Gt=Object.prototype.hasOwnProperty,Wt=Object.prototype.toString;var Kt=new St("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(t){if(null===t)return!0;var e,i,n,r,o,s=[],a=t;for(e=0,i=a.length;e<i;e+=1){if(n=a[e],o=!1,"[object Object]"!==Wt.call(n))return!1;for(r in n)if(Gt.call(n,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==s.indexOf(r))return!1;s.push(r)}return!0},construct:function(t){return null!==t?t:[]}}),Zt=Object.prototype.toString;var Jt=new St("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(t){if(null===t)return!0;var e,i,n,r,o,s=t;for(o=new Array(s.length),e=0,i=s.length;e<i;e+=1){if(n=s[e],"[object Object]"!==Zt.call(n))return!1;if(1!==(r=Object.keys(n)).length)return!1;o[e]=[r[0],n[r[0]]]}return!0},construct:function(t){if(null===t)return[];var e,i,n,r,o,s=t;for(o=new Array(s.length),e=0,i=s.length;e<i;e+=1)n=s[e],r=Object.keys(n),o[e]=[r[0],n[r[0]]];return o}}),Qt=Object.prototype.hasOwnProperty;var te=new St("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(t){if(null===t)return!0;var e,i=t;for(e in i)if(Qt.call(i,e)&&null!==i[e])return!1;return!0},construct:function(t){return null!==t?t:{}}}),ee=Ht.extend({implicit:[Vt,qt],explicit:[Xt,Kt,Jt,te]}),ie=Object.prototype.hasOwnProperty,ne=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,re=/[\x85\u2028\u2029]/,oe=/[,\[\]\{\}]/,se=/^(?:!|!!|![a-z\-]+!)$/i,ae=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function le(t){return Object.prototype.toString.call(t)}function ce(t){return 10===t||13===t}function de(t){return 9===t||32===t}function he(t){return 9===t||32===t||10===t||13===t}function pe(t){return 44===t||91===t||93===t||123===t||125===t}function ue(t){var e;return 48<=t&&t<=57?t-48:97<=(e=32|t)&&e<=102?e-97+10:-1}function ge(t){return 120===t?2:117===t?4:85===t?8:0}function fe(t){return 48<=t&&t<=57?t-48:-1}function be(t){return 48===t?"\0":97===t?"":98===t?"\b":116===t||9===t?"\t":110===t?"\n":118===t?"\v":102===t?"\f":114===t?"\r":101===t?"":32===t?" ":34===t?'"':47===t?"/":92===t?"\\":78===t?"":95===t?" ":76===t?"\u2028":80===t?"\u2029":""}function _e(t){return t<=65535?String.fromCharCode(t):String.fromCharCode(55296+(t-65536>>10),56320+(t-65536&1023))}for(var me=new Array(256),ve=new Array(256),ye=0;ye<256;ye++)me[ye]=be(ye)?1:0,ve[ye]=be(ye);function we(t,e){this.input=t,this.filename=e.filename||null,this.schema=e.schema||ee,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Ce(t,e){var i={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return i.snippet=kt(i),new Ct(e,i)}function xe(t,e){throw Ce(t,e)}function $e(t,e){t.onWarning&&t.onWarning.call(null,Ce(t,e))}var ke={YAML:function(t,e,i){var n,r,o;null!==t.version&&xe(t,"duplication of %YAML directive"),1!==i.length&&xe(t,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&xe(t,"ill-formed argument of the YAML directive"),r=parseInt(n[1],10),o=parseInt(n[2],10),1!==r&&xe(t,"unacceptable YAML version of the document"),t.version=i[0],t.checkLineBreaks=o<2,1!==o&&2!==o&&$e(t,"unsupported YAML version of the document")},TAG:function(t,e,i){var n,r;2!==i.length&&xe(t,"TAG directive accepts exactly two arguments"),n=i[0],r=i[1],se.test(n)||xe(t,"ill-formed tag handle (first argument) of the TAG directive"),ie.call(t.tagMap,n)&&xe(t,'there is a previously declared suffix for "'+n+'" tag handle'),ae.test(r)||xe(t,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(e){xe(t,"tag prefix is malformed: "+r)}t.tagMap[n]=r}};function Ae(t,e,i,n){var r,o,s,a;if(e<i){if(a=t.input.slice(e,i),n)for(r=0,o=a.length;r<o;r+=1)9===(s=a.charCodeAt(r))||32<=s&&s<=1114111||xe(t,"expected valid JSON character");else ne.test(a)&&xe(t,"the stream contains non-printable characters");t.result+=a}}function Te(t,e,i,n){var r,o,s,a;for(vt.isObject(i)||xe(t,"cannot merge mappings; the provided source object is unacceptable"),s=0,a=(r=Object.keys(i)).length;s<a;s+=1)o=r[s],ie.call(e,o)||(e[o]=i[o],n[o]=!0)}function Se(t,e,i,n,r,o,s,a,l){var c,d;if(Array.isArray(r))for(c=0,d=(r=Array.prototype.slice.call(r)).length;c<d;c+=1)Array.isArray(r[c])&&xe(t,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===le(r[c])&&(r[c]="[object Object]");if("object"==typeof r&&"[object Object]"===le(r)&&(r="[object Object]"),r=String(r),null===e&&(e={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(c=0,d=o.length;c<d;c+=1)Te(t,e,o[c],i);else Te(t,e,o,i);else t.json||ie.call(i,r)||!ie.call(e,r)||(t.line=s||t.line,t.lineStart=a||t.lineStart,t.position=l||t.position,xe(t,"duplicated mapping key")),"__proto__"===r?Object.defineProperty(e,r,{configurable:!0,enumerable:!0,writable:!0,value:o}):e[r]=o,delete i[r];return e}function Ie(t){var e;10===(e=t.input.charCodeAt(t.position))?t.position++:13===e?(t.position++,10===t.input.charCodeAt(t.position)&&t.position++):xe(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function Ee(t,e,i){for(var n=0,r=t.input.charCodeAt(t.position);0!==r;){for(;de(r);)9===r&&-1===t.firstTabInLine&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(e&&35===r)do{r=t.input.charCodeAt(++t.position)}while(10!==r&&13!==r&&0!==r);if(!ce(r))break;for(Ie(t),r=t.input.charCodeAt(t.position),n++,t.lineIndent=0;32===r;)t.lineIndent++,r=t.input.charCodeAt(++t.position)}return-1!==i&&0!==n&&t.lineIndent<i&&$e(t,"deficient indentation"),n}function Pe(t){var e,i=t.position;return!(45!==(e=t.input.charCodeAt(i))&&46!==e||e!==t.input.charCodeAt(i+1)||e!==t.input.charCodeAt(i+2)||(i+=3,0!==(e=t.input.charCodeAt(i))&&!he(e)))}function Me(t,e){1===e?t.result+=" ":e>1&&(t.result+=vt.repeat("\n",e-1))}function Oe(t,e){var i,n,r=t.tag,o=t.anchor,s=[],a=!1;if(-1!==t.firstTabInLine)return!1;for(null!==t.anchor&&(t.anchorMap[t.anchor]=s),n=t.input.charCodeAt(t.position);0!==n&&(-1!==t.firstTabInLine&&(t.position=t.firstTabInLine,xe(t,"tab characters must not be used in indentation")),45===n)&&he(t.input.charCodeAt(t.position+1));)if(a=!0,t.position++,Ee(t,!0,-1)&&t.lineIndent<=e)s.push(null),n=t.input.charCodeAt(t.position);else if(i=t.line,Ne(t,e,3,!1,!0),s.push(t.result),Ee(t,!0,-1),n=t.input.charCodeAt(t.position),(t.line===i||t.lineIndent>e)&&0!==n)xe(t,"bad indentation of a sequence entry");else if(t.lineIndent<e)break;return!!a&&(t.tag=r,t.anchor=o,t.kind="sequence",t.result=s,!0)}function Be(t){var e,i,n,r,o=!1,s=!1;if(33!==(r=t.input.charCodeAt(t.position)))return!1;if(null!==t.tag&&xe(t,"duplication of a tag property"),60===(r=t.input.charCodeAt(++t.position))?(o=!0,r=t.input.charCodeAt(++t.position)):33===r?(s=!0,i="!!",r=t.input.charCodeAt(++t.position)):i="!",e=t.position,o){do{r=t.input.charCodeAt(++t.position)}while(0!==r&&62!==r);t.position<t.length?(n=t.input.slice(e,t.position),r=t.input.charCodeAt(++t.position)):xe(t,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!he(r);)33===r&&(s?xe(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(e-1,t.position+1),se.test(i)||xe(t,"named tag handle cannot contain such characters"),s=!0,e=t.position+1)),r=t.input.charCodeAt(++t.position);n=t.input.slice(e,t.position),oe.test(n)&&xe(t,"tag suffix cannot contain flow indicator characters")}n&&!ae.test(n)&&xe(t,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(e){xe(t,"tag name is malformed: "+n)}return o?t.tag=n:ie.call(t.tagMap,i)?t.tag=t.tagMap[i]+n:"!"===i?t.tag="!"+n:"!!"===i?t.tag="tag:yaml.org,2002:"+n:xe(t,'undeclared tag handle "'+i+'"'),!0}function Le(t){var e,i;if(38!==(i=t.input.charCodeAt(t.position)))return!1;for(null!==t.anchor&&xe(t,"duplication of an anchor property"),i=t.input.charCodeAt(++t.position),e=t.position;0!==i&&!he(i)&&!pe(i);)i=t.input.charCodeAt(++t.position);return t.position===e&&xe(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(e,t.position),!0}function Ne(t,e,i,n,r){var o,s,a,l,c,d,h,p,u,g=1,f=!1,b=!1;if(null!==t.listener&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,o=s=a=4===i||3===i,n&&Ee(t,!0,-1)&&(f=!0,t.lineIndent>e?g=1:t.lineIndent===e?g=0:t.lineIndent<e&&(g=-1)),1===g)for(;Be(t)||Le(t);)Ee(t,!0,-1)?(f=!0,a=o,t.lineIndent>e?g=1:t.lineIndent===e?g=0:t.lineIndent<e&&(g=-1)):a=!1;if(a&&(a=f||r),1!==g&&4!==i||(p=1===i||2===i?e:e+1,u=t.position-t.lineStart,1===g?a&&(Oe(t,u)||function(t,e,i){var n,r,o,s,a,l,c,d=t.tag,h=t.anchor,p={},u=Object.create(null),g=null,f=null,b=null,_=!1,m=!1;if(-1!==t.firstTabInLine)return!1;for(null!==t.anchor&&(t.anchorMap[t.anchor]=p),c=t.input.charCodeAt(t.position);0!==c;){if(_||-1===t.firstTabInLine||(t.position=t.firstTabInLine,xe(t,"tab characters must not be used in indentation")),n=t.input.charCodeAt(t.position+1),o=t.line,63!==c&&58!==c||!he(n)){if(s=t.line,a=t.lineStart,l=t.position,!Ne(t,i,2,!1,!0))break;if(t.line===o){for(c=t.input.charCodeAt(t.position);de(c);)c=t.input.charCodeAt(++t.position);if(58===c)he(c=t.input.charCodeAt(++t.position))||xe(t,"a whitespace character is expected after the key-value separator within a block mapping"),_&&(Se(t,p,u,g,f,null,s,a,l),g=f=b=null),m=!0,_=!1,r=!1,g=t.tag,f=t.result;else{if(!m)return t.tag=d,t.anchor=h,!0;xe(t,"can not read an implicit mapping pair; a colon is missed")}}else{if(!m)return t.tag=d,t.anchor=h,!0;xe(t,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(_&&(Se(t,p,u,g,f,null,s,a,l),g=f=b=null),m=!0,_=!0,r=!0):_?(_=!1,r=!0):xe(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,c=n;if((t.line===o||t.lineIndent>e)&&(_&&(s=t.line,a=t.lineStart,l=t.position),Ne(t,e,4,!0,r)&&(_?f=t.result:b=t.result),_||(Se(t,p,u,g,f,b,s,a,l),g=f=b=null),Ee(t,!0,-1),c=t.input.charCodeAt(t.position)),(t.line===o||t.lineIndent>e)&&0!==c)xe(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return _&&Se(t,p,u,g,f,null,s,a,l),m&&(t.tag=d,t.anchor=h,t.kind="mapping",t.result=p),m}(t,u,p))||function(t,e){var i,n,r,o,s,a,l,c,d,h,p,u,g=!0,f=t.tag,b=t.anchor,_=Object.create(null);if(91===(u=t.input.charCodeAt(t.position)))s=93,c=!1,o=[];else{if(123!==u)return!1;s=125,c=!0,o={}}for(null!==t.anchor&&(t.anchorMap[t.anchor]=o),u=t.input.charCodeAt(++t.position);0!==u;){if(Ee(t,!0,e),(u=t.input.charCodeAt(t.position))===s)return t.position++,t.tag=f,t.anchor=b,t.kind=c?"mapping":"sequence",t.result=o,!0;g?44===u&&xe(t,"expected the node content, but found ','"):xe(t,"missed comma between flow collection entries"),p=null,a=l=!1,63===u&&he(t.input.charCodeAt(t.position+1))&&(a=l=!0,t.position++,Ee(t,!0,e)),i=t.line,n=t.lineStart,r=t.position,Ne(t,e,1,!1,!0),h=t.tag,d=t.result,Ee(t,!0,e),u=t.input.charCodeAt(t.position),!l&&t.line!==i||58!==u||(a=!0,u=t.input.charCodeAt(++t.position),Ee(t,!0,e),Ne(t,e,1,!1,!0),p=t.result),c?Se(t,o,_,h,d,p,i,n,r):a?o.push(Se(t,null,_,h,d,p,i,n,r)):o.push(d),Ee(t,!0,e),44===(u=t.input.charCodeAt(t.position))?(g=!0,u=t.input.charCodeAt(++t.position)):g=!1}xe(t,"unexpected end of the stream within a flow collection")}(t,p)?b=!0:(s&&function(t,e){var i,n,r,o,s=1,a=!1,l=!1,c=e,d=0,h=!1;if(124===(o=t.input.charCodeAt(t.position)))n=!1;else{if(62!==o)return!1;n=!0}for(t.kind="scalar",t.result="";0!==o;)if(43===(o=t.input.charCodeAt(++t.position))||45===o)1===s?s=43===o?3:2:xe(t,"repeat of a chomping mode identifier");else{if(!((r=fe(o))>=0))break;0===r?xe(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?xe(t,"repeat of an indentation width identifier"):(c=e+r-1,l=!0)}if(de(o)){do{o=t.input.charCodeAt(++t.position)}while(de(o));if(35===o)do{o=t.input.charCodeAt(++t.position)}while(!ce(o)&&0!==o)}for(;0!==o;){for(Ie(t),t.lineIndent=0,o=t.input.charCodeAt(t.position);(!l||t.lineIndent<c)&&32===o;)t.lineIndent++,o=t.input.charCodeAt(++t.position);if(!l&&t.lineIndent>c&&(c=t.lineIndent),ce(o))d++;else{if(t.lineIndent<c){3===s?t.result+=vt.repeat("\n",a?1+d:d):1===s&&a&&(t.result+="\n");break}for(n?de(o)?(h=!0,t.result+=vt.repeat("\n",a?1+d:d)):h?(h=!1,t.result+=vt.repeat("\n",d+1)):0===d?a&&(t.result+=" "):t.result+=vt.repeat("\n",d):t.result+=vt.repeat("\n",a?1+d:d),a=!0,l=!0,d=0,i=t.position;!ce(o)&&0!==o;)o=t.input.charCodeAt(++t.position);Ae(t,i,t.position,!1)}}return!0}(t,p)||function(t,e){var i,n,r;if(39!==(i=t.input.charCodeAt(t.position)))return!1;for(t.kind="scalar",t.result="",t.position++,n=r=t.position;0!==(i=t.input.charCodeAt(t.position));)if(39===i){if(Ae(t,n,t.position,!0),39!==(i=t.input.charCodeAt(++t.position)))return!0;n=t.position,t.position++,r=t.position}else ce(i)?(Ae(t,n,r,!0),Me(t,Ee(t,!1,e)),n=r=t.position):t.position===t.lineStart&&Pe(t)?xe(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);xe(t,"unexpected end of the stream within a single quoted scalar")}(t,p)||function(t,e){var i,n,r,o,s,a;if(34!==(a=t.input.charCodeAt(t.position)))return!1;for(t.kind="scalar",t.result="",t.position++,i=n=t.position;0!==(a=t.input.charCodeAt(t.position));){if(34===a)return Ae(t,i,t.position,!0),t.position++,!0;if(92===a){if(Ae(t,i,t.position,!0),ce(a=t.input.charCodeAt(++t.position)))Ee(t,!1,e);else if(a<256&&me[a])t.result+=ve[a],t.position++;else if((s=ge(a))>0){for(r=s,o=0;r>0;r--)(s=ue(a=t.input.charCodeAt(++t.position)))>=0?o=(o<<4)+s:xe(t,"expected hexadecimal character");t.result+=_e(o),t.position++}else xe(t,"unknown escape sequence");i=n=t.position}else ce(a)?(Ae(t,i,n,!0),Me(t,Ee(t,!1,e)),i=n=t.position):t.position===t.lineStart&&Pe(t)?xe(t,"unexpected end of the document within a double quoted scalar"):(t.position++,n=t.position)}xe(t,"unexpected end of the stream within a double quoted scalar")}(t,p)?b=!0:!function(t){var e,i,n;if(42!==(n=t.input.charCodeAt(t.position)))return!1;for(n=t.input.charCodeAt(++t.position),e=t.position;0!==n&&!he(n)&&!pe(n);)n=t.input.charCodeAt(++t.position);return t.position===e&&xe(t,"name of an alias node must contain at least one character"),i=t.input.slice(e,t.position),ie.call(t.anchorMap,i)||xe(t,'unidentified alias "'+i+'"'),t.result=t.anchorMap[i],Ee(t,!0,-1),!0}(t)?function(t,e,i){var n,r,o,s,a,l,c,d,h=t.kind,p=t.result;if(he(d=t.input.charCodeAt(t.position))||pe(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(he(n=t.input.charCodeAt(t.position+1))||i&&pe(n)))return!1;for(t.kind="scalar",t.result="",r=o=t.position,s=!1;0!==d;){if(58===d){if(he(n=t.input.charCodeAt(t.position+1))||i&&pe(n))break}else if(35===d){if(he(t.input.charCodeAt(t.position-1)))break}else{if(t.position===t.lineStart&&Pe(t)||i&&pe(d))break;if(ce(d)){if(a=t.line,l=t.lineStart,c=t.lineIndent,Ee(t,!1,-1),t.lineIndent>=e){s=!0,d=t.input.charCodeAt(t.position);continue}t.position=o,t.line=a,t.lineStart=l,t.lineIndent=c;break}}s&&(Ae(t,r,o,!1),Me(t,t.line-a),r=o=t.position,s=!1),de(d)||(o=t.position+1),d=t.input.charCodeAt(++t.position)}return Ae(t,r,o,!1),!!t.result||(t.kind=h,t.result=p,!1)}(t,p,1===i)&&(b=!0,null===t.tag&&(t.tag="?")):(b=!0,null===t.tag&&null===t.anchor||xe(t,"alias node should not have any properties")),null!==t.anchor&&(t.anchorMap[t.anchor]=t.result)):0===g&&(b=a&&Oe(t,u))),null===t.tag)null!==t.anchor&&(t.anchorMap[t.anchor]=t.result);else if("?"===t.tag){for(null!==t.result&&"scalar"!==t.kind&&xe(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),l=0,c=t.implicitTypes.length;l<c;l+=1)if((h=t.implicitTypes[l]).resolve(t.result)){t.result=h.construct(t.result),t.tag=h.tag,null!==t.anchor&&(t.anchorMap[t.anchor]=t.result);break}}else if("!"!==t.tag){if(ie.call(t.typeMap[t.kind||"fallback"],t.tag))h=t.typeMap[t.kind||"fallback"][t.tag];else for(h=null,l=0,c=(d=t.typeMap.multi[t.kind||"fallback"]).length;l<c;l+=1)if(t.tag.slice(0,d[l].tag.length)===d[l].tag){h=d[l];break}h||xe(t,"unknown tag !<"+t.tag+">"),null!==t.result&&h.kind!==t.kind&&xe(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+h.kind+'", not "'+t.kind+'"'),h.resolve(t.result,t.tag)?(t.result=h.construct(t.result,t.tag),null!==t.anchor&&(t.anchorMap[t.anchor]=t.result)):xe(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return null!==t.listener&&t.listener("close",t),null!==t.tag||null!==t.anchor||b}function Re(t){var e,i,n,r,o=t.position,s=!1;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);0!==(r=t.input.charCodeAt(t.position))&&(Ee(t,!0,-1),r=t.input.charCodeAt(t.position),!(t.lineIndent>0||37!==r));){for(s=!0,r=t.input.charCodeAt(++t.position),e=t.position;0!==r&&!he(r);)r=t.input.charCodeAt(++t.position);for(n=[],(i=t.input.slice(e,t.position)).length<1&&xe(t,"directive name must not be less than one character in length");0!==r;){for(;de(r);)r=t.input.charCodeAt(++t.position);if(35===r){do{r=t.input.charCodeAt(++t.position)}while(0!==r&&!ce(r));break}if(ce(r))break;for(e=t.position;0!==r&&!he(r);)r=t.input.charCodeAt(++t.position);n.push(t.input.slice(e,t.position))}0!==r&&Ie(t),ie.call(ke,i)?ke[i](t,i,n):$e(t,'unknown document directive "'+i+'"')}Ee(t,!0,-1),0===t.lineIndent&&45===t.input.charCodeAt(t.position)&&45===t.input.charCodeAt(t.position+1)&&45===t.input.charCodeAt(t.position+2)?(t.position+=3,Ee(t,!0,-1)):s&&xe(t,"directives end mark is expected"),Ne(t,t.lineIndent-1,4,!1,!0),Ee(t,!0,-1),t.checkLineBreaks&&re.test(t.input.slice(o,t.position))&&$e(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&Pe(t)?46===t.input.charCodeAt(t.position)&&(t.position+=3,Ee(t,!0,-1)):t.position<t.length-1&&xe(t,"end of the stream or a document separator is expected")}function je(t,e){e=e||{},0!==(t=String(t)).length&&(10!==t.charCodeAt(t.length-1)&&13!==t.charCodeAt(t.length-1)&&(t+="\n"),65279===t.charCodeAt(0)&&(t=t.slice(1)));var i=new we(t,e),n=t.indexOf("\0");for(-1!==n&&(i.position=n,xe(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)Re(i);return i.documents}var Ue={loadAll:function(t,e,i){null!==e&&"object"==typeof e&&void 0===i&&(i=e,e=null);var n=je(t,i);if("function"!=typeof e)return n;for(var r=0,o=n.length;r<o;r+=1)e(n[r])},load:function(t,e){var i=je(t,e);if(0!==i.length){if(1===i.length)return i[0];throw new Ct("expected a single document in the stream, but found more")}}}.load;const De=[{type:"tile",name:"Tile",description:"Show an entity as a compact tile.",config:{type:"tile",entity:""}},{type:"entities",name:"Entities",description:"Show a list of entities.",config:{type:"entities",entities:[]}},{type:"markdown",name:"Markdown",description:"Render Markdown text.",config:{type:"markdown",content:"## New card"}},{type:"button",name:"Button",description:"Show a tappable entity button.",config:{type:"button",entity:""}},{type:"entity",name:"Entity",description:"Show the state of one entity.",config:{type:"entity",entity:""}},{type:"gauge",name:"Gauge",description:"Show a numeric entity as a gauge.",config:{type:"gauge",entity:""}},{type:"history-graph",name:"History Graph",description:"Show entity history over time.",config:{type:"history-graph",entities:[]}},{type:"statistics-graph",name:"Statistics Graph",description:"Show long-term statistics.",config:{type:"statistics-graph",entities:[]}},{type:"media-control",name:"Media Control",description:"Control a media player.",config:{type:"media-control",entity:""}},{type:"picture",name:"Picture",description:"Show an image.",config:{type:"picture",image:""}},{type:"picture-entity",name:"Picture Entity",description:"Show an entity with an image.",config:{type:"picture-entity",entity:""}},{type:"picture-elements",name:"Picture Elements",description:"Place elements over an image.",config:{type:"picture-elements",image:"",elements:[]}},{type:"horizontal-stack",name:"Horizontal Stack",description:"Stack cards side by side.",config:{type:"horizontal-stack",cards:[]}},{type:"vertical-stack",name:"Vertical Stack",description:"Stack cards vertically.",config:{type:"vertical-stack",cards:[]}},{type:"grid",name:"Grid",description:"Arrange cards in a grid.",config:{type:"grid",columns:2,square:!1,cards:[]}},{type:"conditional",name:"Conditional",description:"Show a card only when conditions match.",config:{type:"conditional",conditions:[],card:{type:"markdown",content:"Conditional card"}}},{type:"custom",name:"Manual / Custom YAML",description:"Start with a YAML-friendly custom card placeholder.",config:{type:"custom:"}}];let He=class extends st{constructor(){super(...arguments),this._openCardPickers=[],this._openCardEditors=[],this._cardPickerFilter="",this._initialized=!1}setConfig(t){this._config=t,this._initialized=!0}_valueChanged(t){this._config=t,_t(this,"config-changed",{config:t},{bubbles:!0,composed:!0})}_toggleHideInactive(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,hide_inactive_tab_titles:e.checked})}_toggleEnableSwipe(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,enable_swipe:e.checked})}_toggleSwipeAnimation(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,swipe_animation:e.checked})}_toggleTabClickAnimation(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,tab_click_animation:e.checked})}_toggleHaptic(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,haptic_feedback:e.checked})}_handleSelectChange(t,e){if(!this._config)return;const i=t.target;this._valueChanged({...this._config,[e]:i.value})}_handleConfigInput(t,e){if(!this._config)return;const i=t.target;this._valueChanged({...this._config,[e]:i.value})}_renderConfigInput(t,e,i=""){return F`
      <ha-input
        .label=${e}
        .value=${String(this._config?.[t]??"")}
        .name=${String(t)}
        .placeholder=${i}
        @input=${e=>this._handleConfigInput(e,t)}
      ></ha-input>
    `}_isMultiCardTab(t){return"cards"in t&&Array.isArray(t.cards)}_getTabCard(t){return"cards"in t&&Array.isArray(t.cards)?{type:"grid",columns:1,square:!1,cards:t.cards}:t.card}_handleTabChange(t,e){if(!this._config)return;const i=t.target,n=[...this._config.tabs];let r;const o=t.detail?.value??i.value,s=i.name;if("card"===s)try{const t=o.split("\n").map(t=>`  ${t}`).join("\n");r=Ue(t),null!==r&&"object"==typeof r||(r={type:""})}catch(t){r=o}else r=o;n[e]={...n[e],[s]:r},this._valueChanged({...this._config,tabs:n})}_addTab(){if(!this._config)return;const t=[...this._config.tabs||[],{title:"New Tab",icon:"mdi:new-box",card:{type:"markdown",content:"## New Tab Content"}}];this._valueChanged({...this._config,tabs:t})}_removeTab(t){if(!this._config)return;const e=this._config.tabs.filter((e,i)=>i!==t);this._valueChanged({...this._config,tabs:e})}_getTabCards(t){return"cards"in t&&Array.isArray(t.cards)?[...t.cards]:t.card?[t.card]:[]}_getBadgeTemplates(t){return Array.isArray(t.badge_templates)&&t.badge_templates.length>0?t.badge_templates:t.badge?[t.badge]:[]}_setBadgeConfig(t,e){if(!this._config)return;const i=[...this._config.tabs],n=this._getBadgeTemplates(i[t]),r={...i[t],badge_templates:e.badge_templates??n,badge_display:e.badge_display??i[t].badge_display,badge:void 0};delete r.badge,r.badge_templates?.length||delete r.badge_templates,r.badge_display||delete r.badge_display,i[t]=r,this._valueChanged({...this._config,tabs:i})}_handleBadgeTemplateChange(t,e,i){const n=t.target,r=[...this._getBadgeTemplates(this._config.tabs[e])];r[i]=n.value,this._setBadgeConfig(e,{badge_templates:r})}_addBadgeTemplate(t){const e=[...this._getBadgeTemplates(this._config.tabs[t]),""];this._setBadgeConfig(t,{badge_templates:e})}_removeBadgeTemplate(t,e){const i=this._getBadgeTemplates(this._config.tabs[t]).filter((t,i)=>i!==e);this._setBadgeConfig(t,{badge_templates:i})}_handleBadgeDisplayChange(t,e){const i=t.target;this._setBadgeConfig(e,{badge_display:i.value})}_setTabCards(t,e){if(!this._config)return;const i=[...this._config.tabs],n=i[t];if(e.length<=1){const r={...n,card:e[0]??{type:"markdown",content:"New card content"},cards:void 0};delete r.cards,i[t]=r}else{const r={...n,cards:e,card:void 0};delete r.card,i[t]=r}this._valueChanged({...this._config,tabs:i})}_cardEditorKey(t,e){return`${t}:${e}`}_removeCard(t,e){if(!this._config)return;const i=this._config.tabs[t],n=this._getTabCards(i);n.length<=1||(n.splice(e,1),this._setTabCards(t,n))}_moveCard(t,e,i){if(!this._config)return;const n=this._config.tabs[t],r=this._getTabCards(n),o="up"===i?e-1:e+1;o>=0&&o<r.length&&([r[e],r[o]]=[r[o],r[e]],this._setTabCards(t,r))}_toggleCardEditor(t,e){const i=this._cardEditorKey(t,e);this._openCardEditors=this._openCardEditors.includes(i)?this._openCardEditors.filter(t=>t!==i):[i]}_handleInlineCardChanged(t,e,i){if(!this._config)return;t.stopPropagation();const n=t.detail?.config;if(!n||"object"!=typeof n)return;const r=this._getTabCards(this._config.tabs[e]);r[i]=n,this._setTabCards(e,r)}_cardPickerOptions(){const t=(window.customCards||[]).filter(t=>t.type&&"simple-tabs"!==t.type).map(t=>({type:`custom:${t.type}`,name:t.name||t.type,description:t.description||`Custom card: ${t.type}`,config:{type:`custom:${t.type}`},custom:!0}));return[...De,...t].sort((t,e)=>t.name.localeCompare(e.name))}_filteredCardPickerOptions(){const t=this._cardPickerFilter.trim().toLowerCase(),e=this._cardPickerOptions();return t?e.filter(e=>e.name.toLowerCase().includes(t)||e.type.toLowerCase().includes(t)||e.description.toLowerCase().includes(t)):e}_handleCardPickerFilter(t){this._cardPickerFilter=t.target.value}_addPickedCard(t,e){if(!this._config)return;const i=this._getTabCards(this._config.tabs[t]);i.push(JSON.parse(JSON.stringify(e))),this._setTabCards(t,i),this._openCardPickers=this._openCardPickers.filter(e=>e!==t),this._openCardEditors=[this._cardEditorKey(t,i.length-1)],this._cardPickerFilter=""}_cardTypeLabel(t){const e=(t.type||"Unknown").replace(/^custom:/,"").replace(/-/g," ");return e.charAt(0).toUpperCase()+e.slice(1)}_toggleCardPicker(t){const e=this._openCardPickers.includes(t);this._openCardPickers=e?this._openCardPickers.filter(e=>e!==t):[t],e&&(this._cardPickerFilter="")}_moveTab(t,e){if(!this._config)return;const i=[...this._config.tabs],[n]=i.splice(t,1),r="up"===e?t-1:t+1;i.splice(r,0,n),this._valueChanged({...this._config,tabs:i})}render(){return this.hass&&this._config?F`
      <div class="card-config">
        <div class="global-options">
          <ha-expansion-panel .expanded=${!0}>
            <div slot="header" class="panel-header">General</div>
            <div class="panel-body">
              <div class="setting-row">
                <span>Hide titles on inactive tabs</span>
                <ha-switch
                  .checked=${this._config.hide_inactive_tab_titles||!1}
                  @change=${this._toggleHideInactive}
                ></ha-switch>
              </div>
              <div class="two-column-grid">
                <div class="select-group compact-group">
                  <label class="select-label">Tab Position</label>
                  <select
                    class="ha-like-select"
                    .value=${this._config.tab_position||"top"}
                    @change=${t=>this._handleSelectChange(t,"tab_position")}
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div class="select-group compact-group">
                  <label class="select-label">Tab Alignment</label>
                  <select
                    class="ha-like-select"
                    .value=${(this._config.tabs_alignment??this._config.alignment)||"center"}
                    @change=${t=>this._handleSelectChange(t,"tabs_alignment")}
                  >
                    <option value="start">Start (Left)</option>
                    <option value="center">Center</option>
                    <option value="end">End (Right)</option>
                  </select>
                </div>
              </div>
              <div class="select-group compact-group">
                <label class="select-label">Remember last tab</label>
                <select
                  class="ha-like-select"
                  .value=${String(this._config.remember_tab||"false")}
                  @change=${t=>this._handleSelectChange(t,"remember_tab")}
                >
                  <option value="false">Off</option>
                  <option value="true">On</option>
                  <option value="per_device">Per Device</option>
                </select>
              </div>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel>
            <div slot="header" class="panel-header">Interactions</div>
            <div class="panel-body">
              <div class="setting-row">
                <span>Enable swipe gestures</span>
                <ha-switch
                  .checked=${this._config.enable_swipe??!0}
                  @change=${this._toggleEnableSwipe}
                ></ha-switch>
              </div>
              <div class="setting-row">
                <span>Animate swipe gestures</span>
                <ha-switch
                  .checked=${this._config.swipe_animation??!0}
                  @change=${this._toggleSwipeAnimation}
                ></ha-switch>
              </div>
              <div class="setting-row">
                <span>Animate tab clicks</span>
                <ha-switch
                  .checked=${this._config.tab_click_animation??this._config.swipe_animation??!0}
                  @change=${this._toggleTabClickAnimation}
                ></ha-switch>
              </div>
              <div class="setting-row">
                <span>Haptic feedback</span>
                <ha-switch
                  .checked=${this._config.haptic_feedback||!1}
                  @change=${this._toggleHaptic}
                ></ha-switch>
              </div>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel>
            <div slot="header" class="panel-header">Card Shell</div>
            <div class="panel-body">
              <div class="config-grid">
                ${this._renderConfigInput("card_background","Card Background","transparent")}
                ${this._renderConfigInput("card_border_radius","Card Border Radius","32px")}
                ${this._renderConfigInput("card_padding","Card Padding","12px 0 12px 0")}
                ${this._renderConfigInput("margin","Card Margin","0")}
                ${this._renderConfigInput("margin-bottom","Card Margin Bottom","0")}
              </div>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel>
            <div slot="header" class="panel-header">Tab Bar</div>
            <div class="panel-body">
              <div class="config-grid">
                ${this._renderConfigInput("bar_background","Bar Background","transparent")}
                ${this._renderConfigInput("bar_border","Bar Border","1px solid rgba(255,255,255,0.12)")}
                ${this._renderConfigInput("bar_padding","Bar Padding","4px")}
                ${this._renderConfigInput("bar_border_radius","Bar Border Radius","999px")}
                ${this._renderConfigInput("tabs_gap","Gap Between Buttons","6px")}
              </div>
            </div>
          </ha-expansion-panel>

          <ha-expansion-panel>
            <div slot="header" class="panel-header">Buttons</div>
            <div class="panel-body">
              <div class="config-grid">
                ${this._renderConfigInput("button_background","Button Background","transparent")}
                ${this._renderConfigInput("button_border_color","Button Border Color","transparent")}
                ${this._renderConfigInput("button_text_color","Button Text Color","var(--secondary-text-color)")}
                ${this._renderConfigInput("button_hover_color","Button Hover Text Color","var(--primary-text-color)")}
                ${this._renderConfigInput("button_hover_border_color","Button Hover Border Color","var(--primary-text-color)")}
                ${this._renderConfigInput("button_active_background","Active Button Background","var(--primary-color)")}
                ${this._renderConfigInput("button_active_text_color","Active Button Text Color","var(--text-primary-color)")}
                ${this._renderConfigInput("button_padding","Button Padding","8px 16px")}
              </div>
            </div>
          </ha-expansion-panel>
        </div>

        <div class="tabs-list">
        ${this._config.tabs.map((t,e)=>F`
            <ha-expansion-panel>
                <div slot="header" class="summary-header">
                    <div class="reorder-controls">
                        <ha-icon
                            class="reorder-btn"
                            icon="mdi:arrow-up"
                            title="Move Up"
                            .disabled=${0===e}
                            @click=${t=>{t.stopPropagation(),this._moveTab(e,"up")}}
                        ></ha-icon>
                        <ha-icon
                            class="reorder-btn"
                            icon="mdi:arrow-down"
                            title="Move Down"
                            .disabled=${e===(this._config?.tabs.length||0)-1}
                            @click=${t=>{t.stopPropagation(),this._moveTab(e,"down")}}
                        ></ha-icon>
                    </div>
                    <ha-input
                        class="summary-title"
                        .name=${"title"}
                        .value=${t.title||""}
                        placeholder="Tab Title"
                        @input=${t=>this._handleTabChange(t,e)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${t=>t.stopPropagation()}
                    ></ha-input>
                    <ha-icon
                        class="remove-icon"
                        icon="mdi:delete"
                        title="Remove Tab"
                        @click=${t=>{t.stopPropagation(),this._removeTab(e)}}
                    ></ha-icon>
                </div>

                <div class="card-content">
                    <div class="tab-settings-row">
                        <ha-icon-picker
                            .label=${"Icon"}
                            .value=${t.icon||""}
                            .name=${"icon"}
                            @value-changed=${t=>this._handleTabChange(t,e)}
                        ></ha-icon-picker>
                        <ha-input
                            .label=${"Tab ID (for deep linking)"}
                            .value=${t.id||""}
                            .name=${"id"}
                            @input=${t=>this._handleTabChange(t,e)}
                        ></ha-input>
                    </div>
                    <div class="badge-settings">
                      <div class="badge-settings-header">
                        <h3>Badge</h3>
                        <button
                          class="secondary-btn"
                          type="button"
                          @click=${()=>this._addBadgeTemplate(e)}
                        >Add Badge Rule</button>
                      </div>
                      <div class="select-group badge-display-group">
                        <label class="select-label">Badge Display</label>
                        <select
                          class="ha-like-select"
                          .value=${t.badge_display||"dot"}
                          @change=${t=>this._handleBadgeDisplayChange(t,e)}
                        >
                          <option value="dot">Dot</option>
                          <option value="count">Count True Rules</option>
                          <option value="exclamation">Exclamation Mark</option>
                        </select>
                      </div>
                      ${this._getBadgeTemplates(t).length>0?this._getBadgeTemplates(t).map((t,i)=>F`
                        <div class="badge-rule-row">
                          <ha-input
                            .label=${`Badge Rule ${i+1} (Jinja)`}
                            .value=${t}
                            placeholder="{{ is_state('light.kitchen', 'on') }}"
                            @input=${t=>this._handleBadgeTemplateChange(t,e,i)}
                          ></ha-input>
                          <button
                            class="icon-btn danger-btn"
                            type="button"
                            title="Remove Badge Rule"
                            @click=${()=>this._removeBadgeTemplate(e,i)}
                          >
                            <ha-icon icon="mdi:delete"></ha-icon>
                          </button>
                        </div>
                      `):F`<p class="badge-empty-state">No badge rules yet. Add one to control the badge.</p>`}
                    </div>

                    <div style="margin-top: 16px;">
                      <h3 style="margin: 0 0 12px 0;">Cards</h3>
                      ${this._getTabCards(t).map((t,i,n)=>F`
                        <div class="card-list-row">
                          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                            <span style="opacity: 0.7;">${i+1}</span>
                            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this._cardTypeLabel(t)}</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 0;">
                            <ha-icon-button
                              .label=${"Move Up"}
                              .path=${"M7,15L12,10L17,15H7Z"}
                              ?disabled=${0===i}
                              @click=${()=>this._moveCard(e,i,"up")}
                            ></ha-icon-button>
                            <ha-icon-button
                              .label=${"Move Down"}
                              .path=${"M7,9L12,14L17,9H7Z"}
                              ?disabled=${i===n.length-1}
                              @click=${()=>this._moveCard(e,i,"down")}
                            ></ha-icon-button>
                            <ha-icon-button
                              .label=${"Edit Card"}
                              .path=${"M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"}
                              @click=${()=>this._toggleCardEditor(e,i)}
                            ></ha-icon-button>
                            <ha-icon-button
                              .label=${"Delete Card"}
                              .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                              ?disabled=${n.length<=1}
                              style="color: var(--error-color);"
                              @click=${()=>this._removeCard(e,i)}
                            ></ha-icon-button>
                          </div>
                        </div>
                        ${this._openCardEditors.includes(this._cardEditorKey(e,i))?F`
                          <div class="inline-card-editor">
                            <hui-card-element-editor
                              .hass=${this.hass}
                              .lovelace=${this.lovelace}
                              .value=${t}
                              @config-changed=${t=>this._handleInlineCardChanged(t,e,i)}
                            ></hui-card-element-editor>
                          </div>
                        `:""}
                      `)}
                      <button
                        class="picker-toggle-btn"
                        @click=${()=>this._toggleCardPicker(e)}
                      >
                        ${this._openCardPickers.includes(e)?"Close Card Picker":"Add Card"}
                      </button>
                      ${this._openCardPickers.includes(e)?F`
                        <div class="card-picker-shell">
                          <input
                            class="card-picker-search"
                            type="search"
                            placeholder="Search cards"
                            .value=${this._cardPickerFilter}
                            @input=${this._handleCardPickerFilter}
                          />
                          <div class="card-picker-grid">
                            ${this._filteredCardPickerOptions().map(t=>F`
                              <button
                                class="card-picker-option"
                                type="button"
                                @click=${()=>this._addPickedCard(e,t.config)}
                              >
                                <span class="card-picker-option-name">${t.name}</span>
                                <span class="card-picker-option-type">${t.type}</span>
                                <span class="card-picker-option-description">${t.description}</span>
                              </button>
                            `)}
                          </div>
                        </div>
                      `:""}
                    </div>
                </div>
            </ha-expansion-panel>
        `)}
        </div>
        <mwc-button @click=${this._addTab} raised class="add-btn">
          <ha-icon icon="mdi:plus" style="margin-right: 8px;"></ha-icon>
          Add Tab
        </mwc-button>
      </div>
    `:F``}};He.styles=s`
    .card-config {
      padding: 16px;
    }
    .global-options {
      display: grid;
      gap: 8px;
      margin-bottom: 24px;
    }
    .panel-header {
      font-weight: 500;
    }
    .panel-body {
      display: grid;
      gap: 14px;
      padding: 16px;
    }
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 44px;
      padding: 0 2px;
      border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent 30%);
    }
    .setting-row:last-of-type {
      border-bottom: none;
    }
    .select-group {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }
    .compact-group {
      margin-top: 0;
    }
    .two-column-grid,
    .config-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px 16px;
    }
    .select-label {
      font-size: 0.95rem;
      color: var(--secondary-text-color);
    }
    .ha-like-select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--card-background-color, var(--ha-card-background, #1f1f1f)) 88%, black 12%);
      font: inherit;
    }
    .tabs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    ha-expansion-panel {
      border-radius: 6px;
      --expansion-panel-content-padding: 0;
      background: var(--sidebar-background-color);
    }
    p {margin: 12px 0 0 0;}
    .summary-header {
      display: flex;
      align-items: center;
      width: 100%;
    }
    .summary-title {
      flex: 1;
      --mdc-text-field-fill-color: transparent; 
      --text-field-border-width: 0px;
    }
    .remove-icon {
      color: var(--secondary-text-color);
      padding: 0 8px;
    }
    .add-btn {
        background: var(--accent-color);
        padding: 8px 16px 8px 8px;
        border-radius: 20px;
        cursor: pointer;
        color: var(--mdc-theme-on-secondary);
    }
    .card-content {
      display: grid;
      gap: 16px;
      overflow: auto;
      margin: 16px;
    }
    .badge-settings {
      display: grid;
      gap: 12px;
      padding: 14px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, rgba(0,0,0,0.12));
    }
    .badge-settings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .badge-settings-header h3 {
      margin: 0;
      font-size: 1rem;
    }
    .badge-display-group {
      margin-top: 0;
    }
    .badge-rule-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: end;
    }
    .badge-empty-state {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: 0.95rem;
    }
    .secondary-btn,
    .icon-btn {
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, rgba(0, 0, 0, 0.16));
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .secondary-btn {
      padding: 8px 12px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .danger-btn {
      color: var(--error-color);
    }
    .card-list-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 20px;
      background: var(--ha-card-background, rgba(0,0,0,0.16));
      border: 1px solid var(--divider-color);
    }
    .card-picker-shell {
      display: grid;
      gap: 12px;
      margin-top: 12px;
      padding: 12px;
      border-radius: 16px;
      background: color-mix(in srgb, var(--card-background-color, var(--ha-card-background, #1f1f1f)) 84%, black 16%);
      border: 1px solid var(--divider-color);
    }
    .picker-toggle-btn {
      width: 100%;
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, rgba(0, 0, 0, 0.16));
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
      text-align: center;
    }
    .card-picker-search {
      box-sizing: border-box;
      width: 100%;
      min-height: 42px;
      padding: 8px 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background, #1f1f1f));
      color: var(--primary-text-color);
      font: inherit;
    }
    .card-picker-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px;
      max-height: 420px;
      overflow: auto;
      padding-right: 2px;
    }
    .card-picker-option {
      display: grid;
      gap: 4px;
      min-height: 96px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, rgba(0, 0, 0, 0.14));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .card-picker-option:hover,
    .card-picker-option:focus-visible {
      border-color: var(--accent-color);
      outline: none;
    }
    .card-picker-option-name {
      font-weight: 500;
    }
    .card-picker-option-type,
    .card-picker-option-description {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      line-height: 1.25;
    }
    .inline-card-editor {
      display: block;
      margin: -2px 0 12px 0;
      padding: 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color, var(--ha-card-background, #1f1f1f)) 88%, black 12%);
      border: 1px solid var(--divider-color);
    }
    .inline-card-editor hui-card-element-editor {
      display: block;
    }
    .tab-settings-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .reorder-controls {
        display: flex;
        align-items: center;
        padding-left: 8px;
    }
    .reorder-btn {
        cursor: pointer;
        color: var(--secondary-text-color);
    }
    .reorder-btn[disabled] {
        opacity: 0.3;
        pointer-events: none;
    }

    @media (max-width: 720px) {
      .two-column-grid,
      .config-grid,
      .tab-settings-row {
        grid-template-columns: 1fr;
      }
    }
  `,t([ht({attribute:!1})],He.prototype,"hass",void 0),t([ht({attribute:!1})],He.prototype,"lovelace",void 0),t([pt()],He.prototype,"_config",void 0),t([pt()],He.prototype,"_helpers",void 0),t([pt()],He.prototype,"_openCardPickers",void 0),t([pt()],He.prototype,"_openCardEditors",void 0),t([pt()],He.prototype,"_cardPickerFilter",void 0),He=t([lt("simple-tabs-editor")],He);const Fe=1;let ze=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const Ve="important",qe=" !"+Ve,Ye=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ze{constructor(t){if(super(t),t.type!==Fe||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const n=e[t];if(null!=n){this.ft.add(t);const e="string"==typeof n&&n.endsWith(qe);t.includes("-")||e?i.setProperty(t,e?n.slice(0,-11):n,e?Ve:""):i[t]=n}}return z}});let Xe=class extends st{constructor(){super(...arguments),this._cards=[],this._selectedTabIndex=0,this._prevSelectedTabIndex=0,this._transitionDirection="none",this._tabTemplateConditionResults=[],this._visibleIndices=[],this._renderedTitles=[],this._renderedIcons=[],this._renderedBadges=[],this._renderedBadgeContents=[],this._templateUnsubscribers=[],this._hassSet=!1,this._initialized=!1,this._lastCheckedUrl="",this._badgeRuleResults=[],this._defaultTabTemplateResults=[],this._touchStartX=null,this._touchStartY=null,this._touchStartTime=0,this._isSwiping=!1,this._blockSwipeForGesture=!1,this._handleDeepLink=()=>{requestAnimationFrame(()=>this._checkDeepLink())},this._handleTouchStart=t=>{if(!this._config?.enable_swipe)return;const e=t.touches[0];this._touchStartX=e.clientX,this._touchStartY=e.clientY,this._touchStartTime=Date.now(),this._isSwiping=!1,this._blockSwipeForGesture=this._shouldAlwaysBlockSwipe(t)},this._handleTouchMove=t=>{if(!this._config?.enable_swipe||null===this._touchStartX||null===this._touchStartY)return;if(this._blockSwipeForGesture)return;const e=t.touches[0],i=e.clientX-this._touchStartX,n=e.clientY-this._touchStartY;if(Math.abs(i)>2*Math.abs(n)&&Math.abs(i)>10){if(this._shouldYieldToNestedHorizontalScroll(t,i))return;this._isSwiping=!0,t.preventDefault()}},this._handleTouchEnd=t=>{if(!this._config?.enable_swipe||null===this._touchStartX||null===this._touchStartY||!this._isSwiping)return this._touchStartX=null,this._touchStartY=null,this._isSwiping=!1,void(this._blockSwipeForGesture=!1);const e=t.changedTouches[0],i=e.clientX-this._touchStartX,n=e.clientY-this._touchStartY,r=Date.now()-this._touchStartTime,o=this._config.swipe_threshold??50;if(this._touchStartX=null,this._touchStartY=null,this._isSwiping=!1,this._blockSwipeForGesture=!1,Math.abs(i)<o||r>500)return;if(Math.abs(n)>Math.abs(i)/2)return;const s=this._visibleIndices.indexOf(this._selectedTabIndex);if(-1===s)return;let a=s;i<0&&s<this._visibleIndices.length-1?a=s+1:i>0&&s>0&&(a=s-1),a!==s&&this._selectTab(this._visibleIndices[a],!0,"swipe")}}static async getConfigElement(){return document.createElement("simple-tabs-editor")}static getStubConfig(){return{type:"custom:simple-tabs",tabs:[{title:"Tab 1",icon:"mdi:home",id:"tab1",card:{type:"markdown",content:"Content 1"}},{title:"Tab 2",icon:"mdi:cog",id:"tab2",card:{type:"markdown",content:"Content 2"}}]}}_loadHelpers(){return this._helpers?Promise.resolve():(this._helpersPromise||(this._helpersPromise=new Promise(async(t,e)=>{try{this._helpers=await(window.loadCardHelpers?.()),t()}catch(t){console.error("[Simple Tabs] Helpers error:",t),e(t)}})),this._helpersPromise)}connectedCallback(){super.connectedCallback(),this._disconnectCleanupTimeout&&(clearTimeout(this._disconnectCleanupTimeout),this._disconnectCleanupTimeout=void 0),window.addEventListener("hashchange",this._handleDeepLink,{passive:!0}),window.addEventListener("popstate",this._handleDeepLink,{passive:!0}),window.addEventListener("location-changed",this._handleDeepLink,{passive:!0}),this._handleDeepLink()}async disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("hashchange",this._handleDeepLink),window.removeEventListener("popstate",this._handleDeepLink),window.removeEventListener("location-changed",this._handleDeepLink),this._disconnectCleanupTimeout=window.setTimeout(()=>{this.isConnected||this._unsubscribeTemplates()},0)}_triggerHaptic(){this._config?.haptic_feedback&&(!function(t){_t(window,"haptic",t)}("selection"),"vibrate"in navigator&&navigator.vibrate(10))}_getConfigFingerprint(){if(!this._config?.tabs?.length)return"default";const t=JSON.stringify(this._config.tabs.map((t,e)=>({index:e,id:t.id??"",title:t.title??"",icon:t.icon??""})));let e=0;for(let i=0;i<t.length;i+=1)e=(e<<5)-e+t.charCodeAt(i)|0;return Math.abs(e).toString(36)}_getStorageKey(){const t=`simple-tabs-${this._getConfigFingerprint()}-last-tab`;if("per_device"===this._config?.remember_tab){return`${t}-${btoa(navigator.userAgent).substring(0,10)}`}return t}_saveTabToMemory(t){if(this._config?.remember_tab)try{localStorage.setItem(this._getStorageKey(),String(t))}catch(t){console.error("[Simple Tabs] Failed to save tab memory:",t)}}_loadTabFromMemory(){if(!this._config?.remember_tab)return null;try{const t=localStorage.getItem(this._getStorageKey());if(null!==t){const e=parseInt(t,10);if(!isNaN(e)&&e>=0&&e<this._config.tabs.length)return e}}catch(t){console.error("[Simple Tabs] Failed to load tab memory:",t)}return null}_isFormControl(t){const e=t.tagName.toLowerCase();return"input"===e||"textarea"===e||"select"===e||t.isContentEditable}_hasHorizontalScroll(t){const e=window.getComputedStyle(t).overflowX;return("auto"===e||"scroll"===e||"overlay"===e||"hidden"===e&&t.scrollWidth>t.clientWidth+1)&&t.scrollWidth>t.clientWidth+1}_canTargetConsumeHorizontalSwipe(t,e){if(!this._hasHorizontalScroll(t))return!1;const i=t.scrollWidth-t.clientWidth;if(i<=0)return!1;return e<0?t.scrollLeft<i-1:e>0&&t.scrollLeft>1}_shouldAlwaysBlockSwipe(t){const e=t.composedPath();for(const t of e){if(!(t instanceof HTMLElement))continue;if(t===this._contentEl)break;const e=t.tagName.toLowerCase(),i=t.classList;if(this._isFormControl(t)||"ha-slider"===e||"mwc-slider"===e||i.contains("slider")||i.contains("swiper")||t.hasAttribute("data-no-swipe"))return!0}return!1}_shouldYieldToNestedHorizontalScroll(t,e){const i=t.composedPath();for(const t of i)if(t instanceof HTMLElement){if(t===this._contentEl)break;if(this._canTargetConsumeHorizontalSwipe(t,e))return!0}return!1}_unsubscribeTemplates(){this._templateUnsubscribers.forEach(t=>t?.()),this._templateUnsubscribers=[]}async setConfig(t){if(!t||!t.tabs)throw new Error("Invalid configuration");if(e=this._config,i=t,e&&JSON.stringify(e)===JSON.stringify(i))return;var e,i;this._loadHelpers(),this._unsubscribeTemplates(),this._config={tabs_alignment:t.tabs_alignment??t.alignment??"center",button_background:t.button_background??t["background-color"],button_border_color:t.button_border_color??t["border-color"],button_text_color:t.button_text_color??t["text-color"],button_hover_color:t.button_hover_color??t["hover-color"],button_hover_border_color:t.button_hover_border_color??t["hover-border-color"]??t.button_hover_color??t["hover-color"],button_active_text_color:t.button_active_text_color??t["active-text-color"],button_active_background:t.button_active_background??t["active-background"],card_background:t.card_background??t.container_background,card_padding:t.card_padding??t.container_padding,card_border_radius:t.card_border_radius??t.container_rounding,bar_background:t.bar_background??t.tab_buttons_background,bar_border:t.bar_border??t.tab_buttons_border,bar_padding:t.bar_padding??t.tab_buttons_padding,bar_border_radius:t.bar_border_radius??t.tab_buttons_rounding,"pre-load":!1,tab_position:"top",enable_swipe:!0,swipe_animation:!0,tab_click_animation:t.tab_click_animation??t.swipe_animation??!0,swipe_threshold:50,remember_tab:!1,haptic_feedback:!1,...t};const n=t.tabs.length;this._cards=new Array(n).fill(null),this._tabTemplateConditionResults=t.tabs.map(t=>(t.conditions??[]).map(t=>!("template"in t))),this._renderedTitles=t.tabs.map(t=>t.title),this._renderedIcons=t.tabs.map(t=>t.icon),this._renderedBadges=new Array(n).fill(!1),this._renderedBadgeContents=new Array(n).fill(""),this._badgeRuleResults=t.tabs.map(t=>new Array(this._getBadgeTemplates(t).length).fill(!1)),this._defaultTabTemplateResults=Array.isArray(t.default_tab)?t.default_tab.map(t=>(t.conditions??[]).map(t=>!("template"in t))):[],this._visibleIndices=t.tabs.map((t,e)=>e),this._initialized=!1,this._hassSet&&this._subscribeToTemplates(this._config.tabs),this._config["pre-load"]&&this._createCards(this._config.tabs).then(t=>{this._cards=t})}_isTemplate(t){return"string"==typeof t&&(t.includes("{{")||t.includes("{%"))}_getConfigValue(...t){return t.find(t=>void 0!==t)}_getBadgeTemplates(t){return Array.isArray(t.badge_templates)&&t.badge_templates.length>0?t.badge_templates.filter(t=>"string"==typeof t):t.badge?[t.badge]:[]}_getBadgeDisplay(t){return t.badge_display??"dot"}_shouldAnimateTransitions(t){return"swipe"===t?!!this._config?.enable_swipe&&!!this._config?.swipe_animation:!!this._config?.tab_click_animation}_hasAnimatedTransitionsEnabled(){return!!this._config?.tab_click_animation||!!this._config?.enable_swipe&&!!this._config?.swipe_animation}_isTruthyTemplateResult(t){if(!0===t)return!0;if("number"==typeof t)return t>0;if("string"==typeof t){const e=t.trim().toLowerCase();return"true"===e||"on"===e||""!==e&&"false"!==e&&"off"!==e&&"0"!==e}return!1}_getBadgeContent(t,e){switch(this._getBadgeDisplay(t)){case"count":return String(e);case"exclamation":return"!";default:return""}}_setBadgeRuleResult(t,e,i,n){const r=this._badgeRuleResults[t]??[];if(r[e]===i)return;const o=[...r];o[e]=i,this._badgeRuleResults[t]=o,this._updateBadgeState(t,n)}_updateBadgeState(t,e){const i=(this._badgeRuleResults[t]??[]).filter(Boolean).length,n=i>0,r=n?this._getBadgeContent(e,i):"";if(this._renderedBadges[t]!==n){const e=[...this._renderedBadges];e[t]=n,this._renderedBadges=e}if(this._renderedBadgeContents[t]!==r){const e=[...this._renderedBadgeContents];e[t]=r,this._renderedBadgeContents=e}}_setTabTemplateConditionResult(t,e,i){const n=this._tabTemplateConditionResults[t]??[];if(n[e]===i)return;const r=[...n];r[e]=i;const o=[...this._tabTemplateConditionResults];o[t]=r,this._tabTemplateConditionResults=o}_setDefaultTabTemplateResult(t,e,i){const n=this._defaultTabTemplateResults[t]??[];if(n[e]===i)return;const r=[...n];if(r[e]=i,this._defaultTabTemplateResults[t]=r,!this._initialized){const t=this._calculateDefaultTab();null!==t&&(this._selectedTabIndex=t)}}_areConditionsMet(t,e=[]){return!t?.length||t.every((t,i)=>"template"in t?e[i]??!1:this._checkCondition(t))}async _subscribeToTemplates(t){const e=async(t,e)=>{try{const i=await this.hass.connection.subscribeMessage(e,{type:"render_template",template:t});this._templateUnsubscribers.push(i)}catch(t){console.error("[Simple Tabs] Template error:",t)}},i=[];t.forEach((t,n)=>{const r=(t,e)=>{if(this[t][n]!==e){const i=[...this[t]];i[n]=e,this[t]=i}};this._isTemplate(t.title)&&i.push(e(t.title,t=>r("_renderedTitles",t.result))),this._isTemplate(t.icon)&&i.push(e(t.icon,t=>r("_renderedIcons",t.result)));const o=this._getBadgeTemplates(t);o.length>0?(this._badgeRuleResults[n]=new Array(o.length).fill(!1),o.forEach((r,o)=>{this._isTemplate(r)?i.push(e(r,e=>{this._setBadgeRuleResult(n,o,this._isTruthyTemplateResult(e.result),t)})):this._setBadgeRuleResult(n,o,this._isTruthyTemplateResult(r),t)})):this._updateBadgeState(n,t),t.conditions?.forEach((t,r)=>{"template"in t&&i.push(e(t.template,t=>{this._setTabTemplateConditionResult(n,r,this._isTruthyTemplateResult(t.result))}))})}),Array.isArray(this._config.default_tab)&&this._config.default_tab.forEach((t,n)=>{t.conditions?.forEach((t,r)=>{"template"in t&&i.push(e(t.template,t=>{this._setDefaultTabTemplateResult(n,r,this._isTruthyTemplateResult(t.result))}))})}),await Promise.all(i)}willUpdate(t){(t.has("_tabTemplateConditionResults")||t.has("hass")||t.has("_config"))&&this._calculateVisibleIndices(),this._visibleIndices.length>0&&(this._visibleIndices.includes(this._selectedTabIndex)||(this._selectedTabIndex=this._visibleIndices[0]))}_calculateVisibleIndices(){if(!this._config)return;const t=this._config.tabs.map((t,e)=>e).filter(t=>{const e=this._config.tabs[t];return this._areConditionsMet(e.conditions,this._tabTemplateConditionResults[t])});t.length===this._visibleIndices.length&&t.every((t,e)=>t===this._visibleIndices[e])||(this._visibleIndices=t)}shouldUpdate(t){if(t.has("_config")||t.has("_selectedTabIndex")||t.has("_visibleIndices")||t.has("_tabTemplateConditionResults")||t.has("_renderedTitles")||t.has("_renderedIcons")||t.has("_renderedBadges")||t.has("_renderedBadgeContents"))return!0;const e=t.get("hass");return!e||!this.hass||(e.states!==this.hass.states||e.localize!==this.hass.localize||e.user!==this.hass.user)}_parseNumericComparison(t){const e=t.match(/^\s*(>=|<=|>|<|==|=)\s*(-?\d+(?:\.\d+)?)\s*$/);return e?{operator:e[1],value:Number(e[2])}:null}_checkCondition(t){if("entity"in t){const e=this.hass.states[t.entity]?.state;if(void 0===e)return!1;const i=this._parseNumericComparison(t.state);if(i){const t=Number(e);if(Number.isNaN(t))return!1;switch(i.operator){case">":return t>i.value;case">=":return t>=i.value;case"<":return t<i.value;case"<=":return t<=i.value;case"=":case"==":return t===i.value}}return e===t.state}if("user"in t){if(!this.hass.user)return!1;const e=Array.isArray(t.user)?t.user:[t.user];return e.includes(this.hass.user.id)||e.includes(this.hass.user.name)}return!1}_calculateDefaultTab(){if(void 0===this._config.default_tab)return null;if("number"==typeof this._config.default_tab){const t=this._config.default_tab-1;return t>=0&&t<this._config.tabs.length?t:null}if(Array.isArray(this._config.default_tab))for(const[t,e]of this._config.default_tab.entries()){const i=e.tab-1;if(!(i<0||i>=this._config.tabs.length)){if(!e.conditions||0===e.conditions.length)return i;if(this._areConditionsMet(e.conditions,this._defaultTabTemplateResults[t]))return i}}return null}_checkDeepLink(){if(!this._config||!this._config.tabs)return!1;this._lastCheckedUrl=window.location.href;let t=null,e=!1;const i=new URL(window.location.href);if(i.searchParams.has("tab"))t=i.searchParams.get("tab"),e=!0;else{const e=window.location.hash.substring(1);e&&(t=e)}if(!t)return!1;const n=this._config.tabs.findIndex(e=>{if(e.id===t)return!0;if(!e.id&&e.title&&!this._isTemplate(e.title)){if(e.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")===t)return!0}return!1});return!!(n>=0&&n!==this._selectedTabIndex&&(this._calculateVisibleIndices(),this._visibleIndices.includes(n)))&&(this._selectedTabIndex=n,e&&(i.searchParams.delete("tab"),window.history.replaceState(null,"",i.toString()),this._lastCheckedUrl=i.toString()),!0)}_normalizeTabCard(t){if("cards"in t&&Array.isArray(t.cards))return{type:"grid",columns:1,square:!1,cards:t.cards};if("card"in t&&void 0!==t.card)return t.card;throw new Error('[Simple Tabs] Invalid tab configuration: must have either "card" or "cards" property')}async _createCard(t){try{await this._loadHelpers();const e=this._normalizeTabCard(t),i=this._helpers.createCardElement(e);return i.hass=this.hass,i}catch(t){return console.error("[Simple Tabs] Create card error:",t),null}}async _ensureCard(t){if(this._cards[t]||!this._config.tabs[t])return;const e=await this._createCard(this._config.tabs[t]);this._cards=[...this._cards.slice(0,t),e,...this._cards.slice(t+1)]}_scrollToActiveTab(t=!0){const e=this._tabsEl,i=this.shadowRoot?.querySelector(".tab-button.active");if(e&&i){const n=e.getBoundingClientRect(),r=i.getBoundingClientRect(),o=r.left-n.left+e.scrollLeft-n.width/2+r.width/2;e.scrollTo({left:o,behavior:t?"smooth":"auto"})}}async _createCards(t){return await this._loadHelpers(),Promise.all(t.map(t=>this._createCard(t)))}updated(t){if(super.updated(t),t.has("_config")){const t=this._config["margin-bottom"]??"0px";this.style.setProperty("--simple-tabs-margin-bottom",t)}if(this.hass&&this._config&&!this._hassSet&&(this._hassSet=!0,this._subscribeToTemplates(this._config.tabs)),window.location.href!==this._lastCheckedUrl){const t=this._checkDeepLink();if(!this._initialized&&!t){const t=this._calculateDefaultTab(),e=this._loadTabFromMemory();this._selectedTabIndex=null!==t?t:null!==e?e:0}this._initialized=!0}else if(!this._initialized){const t=this._calculateDefaultTab(),e=this._loadTabFromMemory();this._selectedTabIndex=null!==t?t:null!==e?e:0,this._initialized=!0}if(t.has("hass")){const t=this._cards.length;for(let e=0;e<t;e++){const t=this._cards[e];t&&(t.hass=this.hass)}}t.has("_selectedTabIndex")&&!this._config["pre-load"]&&this._ensureCard(this._selectedTabIndex),t.has("_selectedTabIndex")&&this._scrollToActiveTab()}firstUpdated(){requestAnimationFrame(()=>this._scrollToActiveTab(!1)),this._config["pre-load"]||setTimeout(()=>this._startBackgroundCardLoading(),200)}_startBackgroundCardLoading(){if(!this._config)return;const t=this._config.tabs.map((t,e)=>e).filter(t=>t!==this._selectedTabIndex&&!this._cards[t]),e=()=>{if(0===t.length)return;const i=t.shift();"requestIdleCallback"in window?window.requestIdleCallback(()=>{this._ensureCard(i).then(()=>e())}):setTimeout(()=>{this._ensureCard(i).then(()=>e())},50)};e()}_handleDragStart(t){const e=this._tabsEl;if(!e||0!==t.button)return;let i=!1;const n=t.pageX,r=e.scrollLeft,o=t=>{const o=t.pageX-n;!i&&Math.abs(o)>3&&(i=!0,e.classList.add("dragging")),i&&(e.scrollLeft=r-o)},s=()=>{e.classList.remove("dragging"),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",s)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",s)}_selectTab(t,e=!1,i="programmatic"){if(t!==this._selectedTabIndex){if("programmatic"!==i&&this._shouldAnimateTransitions(i)){const e=t>this._selectedTabIndex?"right":"left";this._prevSelectedTabIndex=this._selectedTabIndex,this._selectedTabIndex=t,this._transitionDirection=e,setTimeout(()=>{this._transitionDirection="none",this._prevSelectedTabIndex=t},350)}else this._selectedTabIndex=t,this._prevSelectedTabIndex=t,this._transitionDirection="none";this._saveTabToMemory(t),e&&this._triggerHaptic()}}render(){if(!this._config||!this.hass)return F``;const t={"--simple-tabs-bg-color":this._getConfigValue(this._config.button_background,this._config["background-color"]),"--simple-tabs-border-color":this._getConfigValue(this._config.button_border_color,this._config["border-color"]),"--simple-tabs-text-color":this._getConfigValue(this._config.button_text_color,this._config["text-color"]),"--simple-tabs-hover-color":this._getConfigValue(this._config.button_hover_color,this._config["hover-color"]),"--simple-tabs-hover-border-color":this._getConfigValue(this._config.button_hover_border_color,this._config["hover-border-color"],this._config.button_hover_color,this._config["hover-color"]),"--simple-tabs-active-text-color":this._getConfigValue(this._config.button_active_text_color,this._config["active-text-color"]),"--simple-tabs-active-bg":this._getConfigValue(this._config.button_active_background,this._config["active-background"]),"--simple-tabs-container-bg":this._getConfigValue(this._config.card_background,this._config.container_background),"--simple-tabs-container-padding":this._getConfigValue(this._config.card_padding,this._config.container_padding),"--simple-tabs-container-rounding":this._getConfigValue(this._config.card_border_radius,this._config.container_rounding),"--simple-tabs-buttons-bg":this._getConfigValue(this._config.bar_background,this._config.tab_buttons_background),"--simple-tabs-buttons-border":this._getConfigValue(this._config.bar_border,this._config.tab_buttons_border),"--simple-tabs-buttons-padding":this._getConfigValue(this._config.bar_padding,this._config.tab_buttons_padding),"--simple-tabs-buttons-rounding":this._getConfigValue(this._config.bar_border_radius,this._config.tab_buttons_rounding),"--simple-tabs-inactive-title-display":this._config.hide_inactive_tab_titles?"none":"inline","--simple-tabs-gap":this._config.tabs_gap,"--simple-tabs-button-padding":this._config.button_padding};this._config.margin&&(t.margin=this._config.margin);const e=`align-${this._getConfigValue(this._config.tabs_alignment,this._config.alignment)||"center"}`,i="bottom"===this._config.tab_position?"position-bottom":"position-top",n=F`
      <div class="tabs-row ${e}">
        <div class="tabs-viewport">
          <div class="tabs-scroll" @mousedown=${this._handleDragStart}>
            <div class="tabs-container">
              <div class="tabs" role="tablist">
              ${this._visibleIndices.map(t=>F`
                <button
                  class="tab-button ${t===this._selectedTabIndex?"active":""}"
                  @click=${()=>this._selectTab(t,!0,"click")}
                >
                  ${this._renderedIcons[t]?F`<ha-icon .icon=${this._renderedIcons[t]}></ha-icon>`:""}
                  ${this._renderedTitles[t]?F`<span>${this._renderedTitles[t]}</span>`:""}
                  ${this._renderedBadges[t]?F`
                    <span class="badge ${this._renderedBadgeContents[t]?"badge--with-content":"badge--dot"}">
                      ${this._renderedBadgeContents[t]}
                    </span>
                  `:""}
                </button>`)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `,r=this._hasAnimatedTransitionsEnabled(),o=r?"animate":"",s=r&&"none"!==this._transitionDirection?"is-transitioning":"",a=F`
      <div 
        class="content-container ${o} ${s}" 
        @touchstart=${this._handleTouchStart}
        @touchmove=${this._handleTouchMove}
        @touchend=${this._handleTouchEnd}
      >
         ${this._cards.map((t,e)=>{const i=e===this._selectedTabIndex,n=e===this._prevSelectedTabIndex&&"none"!==this._transitionDirection,r=!i&&!n;let o="tab-panel";return i&&(o+=" active"),n&&(o+=" previous"),"none"!==this._transitionDirection&&(o+=` slide-${this._transitionDirection}`),F`
               <div class="${o}" ?hidden=${r}>
                  ${i||n?t:""}
               </div>
             `})}
      </div>
    `;return F`
      <div class="card-container ${i}" style=${Ye(t)}>
        ${"bottom"===this._config.tab_position?F`${a}${n}`:F`${n}${a}`}
      </div>
    `}};Xe.styles=s`
    :host { 
      display: block; 
      /* Use 'style' containment only - 'content' or 'layout' containment breaks
         nested cards (e.g. simple-swipe-card) that rely on ResizeObserver/auto-height */
      contain: style; 
      margin-bottom: var(--simple-tabs-margin-bottom);
    }
    .card-container {
      position: relative;
      isolation: isolate;
      background: var(--simple-tabs-container-bg, none);
      padding: var(--simple-tabs-container-padding, 0 0 12px 0);
      border-radius: var(--simple-tabs-container-rounding, 0);
      min-height: 50px; 
      overflow: visible;
    }


    .tabs-row {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      overflow: visible;
    }

    .tabs-row.align-start {
      justify-content: flex-start;
    }

    .tabs-row.align-center {
      justify-content: center;
    }

    .tabs-row.align-end {
      justify-content: flex-end;
    }

    .tabs-viewport {
      box-sizing: border-box;
      width: fit-content;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      background: var(--simple-tabs-buttons-bg, transparent);
      border: var(--simple-tabs-buttons-border, none);
      border-radius: var(--simple-tabs-buttons-rounding, 0);
      padding: var(--simple-tabs-buttons-padding, 1px 2px);
      transform: translate3d(0,0,0);
    }

    .tabs-scroll {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
    }

    .tabs-container {
      box-sizing: border-box;
      width: max-content;
      min-width: max-content;
      overflow: visible;
    }

    .tabs {
      box-sizing: border-box;
      display: inline-flex;
      flex-wrap: nowrap;
      gap: var(--simple-tabs-gap, 6px);
      width: max-content;
      min-width: 0;
      padding: 2px;
    }

    .tabs-scroll.dragging { cursor: grabbing; }
    .tabs-scroll.dragging .tab-button { pointer-events: none; }
    .tabs-scroll::-webkit-scrollbar { display: none; }
    .tab-button { 
      box-sizing: border-box; 
      background: var(--simple-tabs-bg-color, none); 
      outline: 1px solid var(--simple-tabs-border-color, var(--divider-color)); 
      border: none; 
      cursor: pointer; 
      padding: var(--simple-tabs-button-padding, 8px 16px);
      font-size: var(--ha-font-size-m); 
      color: var(--simple-tabs-text-color, var(--secondary-text-color)); 
      position: relative; 
      z-index: 1;
      border-radius: 24px; 
      transition: all 0.3s; 
      display: inline-flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px; 
      font-family: var(--primary-font-family);
      text-wrap: nowrap;
    }

    .tab-button:not(.active) span:not(.badge) {
        display: var(--simple-tabs-inactive-title-display, inline);
    }
    
    .badge {
        position: absolute;
        top: 0px;
        right: 0px;
        min-width: 18px;
        height: 18px;
        padding: 0;
        border-radius: 999px;
        background-color: var(--error-color, #db4437);
        color: var(--text-primary-color, #fff);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        pointer-events: none;
    }

    .badge--with-content {
        min-width: 18px;
        height: 18px;
        padding: 0;
    }

    .badge--dot {
      min-width: 12px !important;
      height: 12px;
    }

    .tab-button:hover { 
      color: var(--simple-tabs-hover-color, var(--primary-text-color));
      outline-color: var(--simple-tabs-hover-border-color, var(--simple-tabs-hover-color, var(--primary-text-color)));
    }
    .tab-button.active { 
      color: var(--simple-tabs-active-text-color, var(--text-primary-color)); 
      background: var(--simple-tabs-active-bg, var(--primary-color)); 
      outline-color: transparent; 
    }
    
    /* Content Container Styles */
    .content-container { 
      padding-top: 12px;
      position: relative;
      /* overflow: visible allows nested cards (e.g. simple-swipe-card) to 
         expand to their natural height without being clipped */
      overflow: visible;
      min-width: 0;
      touch-action: pan-y; /* Allow vertical scrolling, we handle horizontal */
    }
    
    .position-bottom .content-container {
      padding-top: 0;
      padding-bottom: 12px;
    }
    
    .tab-panel { 
      position: relative;
    }
    
    .tab-panel[hidden] { 
      display: none; 
    }

    /* ANIMATIONS */
    .content-container.animate {
        display: grid;
        grid-template-areas: "content";
        /* Keep overflow visible in resting state to avoid clipping wide nested cards
           (e.g. map-card/simple-swipe-card in Sections one-column layouts). */
        overflow: visible;
    }

    .content-container.animate.is-transitioning {
        /* Only clip horizontal overflow while tab panels actively slide. */
        overflow-x: hidden;
        overflow-y: visible;
    }

    .content-container.animate .tab-panel {
        grid-area: content;
        width: 100%;
        min-width: 0;
        display: block; /* Override hidden behavior for transition */
    }
    
    .content-container.animate .tab-panel[hidden] {
        display: none;
    }
    
    /* Ensure previous tabs allow display during animation even if hidden attr isn't removed yet (though logic handles it) */
    .content-container.animate .tab-panel.previous {
        display: block;
        visibility: visible;
        pointer-events: none; /* Prevent clicks on outgoing tab */
    }

    /* SLIDE ANIMATIONS */
    /* Moving to a tab on the RIGHT (Index increases): content slides LEFT */
    .tab-panel.active.slide-right {
        animation: slide-in-from-right 0.3s ease-in-out forwards;
    }
    .tab-panel.previous.slide-right {
        animation: slide-out-to-left 0.3s ease-in-out forwards;
    }

    /* Moving to a tab on the LEFT (Index decreases): content slides RIGHT */
    .tab-panel.active.slide-left {
        animation: slide-in-from-left 0.3s ease-in-out forwards;
    }
    .tab-panel.previous.slide-left {
        animation: slide-out-to-right 0.3s ease-in-out forwards;
    }
    
    @keyframes slide-in-from-right {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slide-out-to-left {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(-100%); opacity: 0; }
    }
    
    @keyframes slide-in-from-left {
        0% { transform: translateX(-100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slide-out-to-right {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @media (prefers-reduced-motion) {
        .tab-panel.active.slide-right,
        .tab-panel.previous.slide-right,
        .tab-panel.active.slide-left,
        .tab-panel.previous.slide-left {
            animation: none;
            transform: none;
            opacity: 1;
        }
    }
  `,t([ht({attribute:!1})],Xe.prototype,"hass",void 0),t([pt()],Xe.prototype,"_config",void 0),t([pt()],Xe.prototype,"_cards",void 0),t([pt()],Xe.prototype,"_selectedTabIndex",void 0),t([pt()],Xe.prototype,"_prevSelectedTabIndex",void 0),t([pt()],Xe.prototype,"_transitionDirection",void 0),t([pt()],Xe.prototype,"_tabTemplateConditionResults",void 0),t([pt()],Xe.prototype,"_visibleIndices",void 0),t([pt()],Xe.prototype,"_renderedTitles",void 0),t([pt()],Xe.prototype,"_renderedIcons",void 0),t([pt()],Xe.prototype,"_renderedBadges",void 0),t([pt()],Xe.prototype,"_renderedBadgeContents",void 0),t([gt(".tabs-scroll")],Xe.prototype,"_tabsEl",void 0),t([gt(".content-container")],Xe.prototype,"_contentEl",void 0),Xe=t([lt("simple-tabs")],Xe),window.customCards=window.customCards||[],window.customCards.push({type:"simple-tabs",name:"Simple Tabs",preview:!0,description:"A card to display multiple cards in a tabbed interface."});export{Xe as SimpleTabs};
