function t(t,e,i,n){var r,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,b=g?g.emptyScript:"",m=f.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&c(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=n?.call(this);r?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const s=r.fromAttribute(e,t.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const n=this.constructor,r=this[t];if(i??=n.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:r},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==r||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[_("elementProperties")]=new Map,A[_("finalized")]=new Map,m?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.1.1");const $=globalThis,x=$.trustedTypes,k=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+S,E=`<${T}>`,I=document,O=()=>I.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,N="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,U=/>/g,D=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,F=/"/g,R=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Y=new WeakMap,V=I.createTreeWalker(I,129);function X(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,n=[];let r,s=2===e?"<svg>":3===e?"<math>":"",o=P;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===P?"!--"===l[1]?o=j:void 0!==l[1]?o=U:void 0!==l[2]?(R.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=r??P,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?D:'"'===l[3]?F:H):o===F||o===H?o=D:o===j||o===U?o=P:(o=D,r=void 0);const h=o===D&&t[e+1].startsWith("/>")?" ":"";s+=o===P?i+E:c>=0?(n.push(a),i.slice(0,c)+C+i.slice(c)+S+h):i+S+(-2===c?e:h)}return[X(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class G{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let r=0,s=0;const o=t.length-1,a=this.parts,[l,c]=W(t,e);if(this.el=G.createElement(l,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=V.nextNode())&&a.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(C)){const e=c[s++],i=n.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),n.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),n.removeAttribute(t));if(R.test(n.tagName)){const t=n.textContent.split(S),e=t.length-1;if(e>0){n.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],O()),V.nextNode(),a.push({type:2,index:++r});n.append(t[e],O())}}}else if(8===n.nodeType)if(n.data===T)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=n.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,n){if(e===B)return e;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const s=L(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(t),r._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,n)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??I).importNode(e,!0);V.currentNode=n;let r=V.nextNode(),s=0,o=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new K(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=i[++o]}s!==a?.index&&(r=V.nextNode(),s++)}return V.currentNode=I,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),L(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new J(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const r of t)n===e.length?e.push(i=new K(this.O(O()),this.O(O()),this,this.options)):i=e[n],i._$AI(r),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,n){const r=this.strings;let s=!1;if(void 0===r)t=Z(this,t,e,0),s=!L(t)||t!==this._$AH&&t!==B,s&&(this._$AH=t);else{const n=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Z(this,n[i+o],e,o),a===B&&(a=this._$AH[o]),s||=!L(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}s&&!n&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends Q{constructor(t,e,i,n,r){super(t,e,i,n,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===B)return;const i=this._$AH,n=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=$.litHtmlPolyfillSupport;rt?.(G,K),($.litHtmlVersions??=[]).push("3.3.1");const st=globalThis;let ot=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let r=n._$litPart$;if(void 0===r){const t=i?.renderBefore??null;n._$litPart$=r=new K(e.insertBefore(O(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};ot._$litElement$=!0,ot.finalized=!0,st.litElementHydrateSupport?.({LitElement:ot});const at=st.litElementPolyfillSupport;at?.({LitElement:ot}),(st.litElementVersions??=[]).push("4.2.1");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},dt=(t=ct,e,i)=>{const{kind:n,metadata:r}=i;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,r,t)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];e.call(this,i),this.requestUpdate(n,r,t)}}throw Error("Unsupported decorator location: "+n)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i);function ft(t,e){return(i,n,r)=>{const s=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof n?i:r??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return ut(i,n,{get(){let i=t.call(this);return void 0===i&&(i=s(this),(null!==i||this.hasUpdated)&&e.call(this,i)),i}})}return ut(i,n,{get(){return s(this)}})}}var gt,bt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(gt||(gt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(bt||(bt={}));var mt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var r=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return r.detail=i,t.dispatchEvent(r),r};function _t(t){return null==t}var vt={isNothing:_t,isObject:function(t){return"object"==typeof t&&null!==t},toArray:function(t){return Array.isArray(t)?t:_t(t)?[]:[t]},repeat:function(t,e){var i,n="";for(i=0;i<e;i+=1)n+=t;return n},isNegativeZero:function(t){return 0===t&&Number.NEGATIVE_INFINITY===1/t},extend:function(t,e){var i,n,r,s;if(e)for(i=0,n=(s=Object.keys(e)).length;i<n;i+=1)t[r=s[i]]=e[r];return t}};function yt(t,e){var i="",n=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(i+='in "'+t.mark.name+'" '),i+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!e&&t.mark.snippet&&(i+="\n\n"+t.mark.snippet),n+" "+i):n}function wt(t,e){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=e,this.message=yt(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}wt.prototype=Object.create(Error.prototype),wt.prototype.constructor=wt,wt.prototype.toString=function(t){return this.name+": "+yt(this,t)};var At=wt;function $t(t,e,i,n,r){var s="",o="",a=Math.floor(r/2)-1;return n-e>a&&(e=n-a+(s=" ... ").length),i-n>a&&(i=n+a-(o=" ...").length),{str:s+t.slice(e,i).replace(/\t/g,"→")+o,pos:n-e+s.length}}function xt(t,e){return vt.repeat(" ",e-t.length)+t}var kt=function(t,e){if(e=Object.create(e||null),!t.buffer)return null;e.maxLength||(e.maxLength=79),"number"!=typeof e.indent&&(e.indent=1),"number"!=typeof e.linesBefore&&(e.linesBefore=3),"number"!=typeof e.linesAfter&&(e.linesAfter=2);for(var i,n=/\r?\n|\r|\0/g,r=[0],s=[],o=-1;i=n.exec(t.buffer);)s.push(i.index),r.push(i.index+i[0].length),t.position<=i.index&&o<0&&(o=r.length-2);o<0&&(o=r.length-1);var a,l,c="",d=Math.min(t.line+e.linesAfter,s.length).toString().length,h=e.maxLength-(e.indent+d+3);for(a=1;a<=e.linesBefore&&!(o-a<0);a++)l=$t(t.buffer,r[o-a],s[o-a],t.position-(r[o]-r[o-a]),h),c=vt.repeat(" ",e.indent)+xt((t.line-a+1).toString(),d)+" | "+l.str+"\n"+c;for(l=$t(t.buffer,r[o],s[o],t.position,h),c+=vt.repeat(" ",e.indent)+xt((t.line+1).toString(),d)+" | "+l.str+"\n",c+=vt.repeat("-",e.indent+d+3+l.pos)+"^\n",a=1;a<=e.linesAfter&&!(o+a>=s.length);a++)l=$t(t.buffer,r[o+a],s[o+a],t.position-(r[o]-r[o+a]),h),c+=vt.repeat(" ",e.indent)+xt((t.line+a+1).toString(),d)+" | "+l.str+"\n";return c.replace(/\n$/,"")},Ct=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],St=["scalar","sequence","mapping"];var Tt=function(t,e){if(e=e||{},Object.keys(e).forEach(function(e){if(-1===Ct.indexOf(e))throw new At('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=e,this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=function(t){var e={};return null!==t&&Object.keys(t).forEach(function(i){t[i].forEach(function(t){e[String(t)]=i})}),e}(e.styleAliases||null),-1===St.indexOf(this.kind))throw new At('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')};function Et(t,e){var i=[];return t[e].forEach(function(t){var e=i.length;i.forEach(function(i,n){i.tag===t.tag&&i.kind===t.kind&&i.multi===t.multi&&(e=n)}),i[e]=t}),i}function It(t){return this.extend(t)}It.prototype.extend=function(t){var e=[],i=[];if(t instanceof Tt)i.push(t);else if(Array.isArray(t))i=i.concat(t);else{if(!t||!Array.isArray(t.implicit)&&!Array.isArray(t.explicit))throw new At("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.implicit&&(e=e.concat(t.implicit)),t.explicit&&(i=i.concat(t.explicit))}e.forEach(function(t){if(!(t instanceof Tt))throw new At("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(t.loadKind&&"scalar"!==t.loadKind)throw new At("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(t.multi)throw new At("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(t){if(!(t instanceof Tt))throw new At("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(It.prototype);return n.implicit=(this.implicit||[]).concat(e),n.explicit=(this.explicit||[]).concat(i),n.compiledImplicit=Et(n,"implicit"),n.compiledExplicit=Et(n,"explicit"),n.compiledTypeMap=function(){var t,e,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(t){t.multi?(i.multi[t.kind].push(t),i.multi.fallback.push(t)):i[t.kind][t.tag]=i.fallback[t.tag]=t}for(t=0,e=arguments.length;t<e;t+=1)arguments[t].forEach(n);return i}(n.compiledImplicit,n.compiledExplicit),n};var Ot=new It({explicit:[new Tt("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return null!==t?t:""}}),new Tt("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return null!==t?t:[]}}),new Tt("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return null!==t?t:{}}})]});var Lt=new Tt("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(t){if(null===t)return!0;var e=t.length;return 1===e&&"~"===t||4===e&&("null"===t||"Null"===t||"NULL"===t)},construct:function(){return null},predicate:function(t){return null===t},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var Mt=new Tt("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e=t.length;return 4===e&&("true"===t||"True"===t||"TRUE"===t)||5===e&&("false"===t||"False"===t||"FALSE"===t)},construct:function(t){return"true"===t||"True"===t||"TRUE"===t},predicate:function(t){return"[object Boolean]"===Object.prototype.toString.call(t)},represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Nt(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Pt(t){return 48<=t&&t<=55}function jt(t){return 48<=t&&t<=57}var Ut=new Tt("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e,i=t.length,n=0,r=!1;if(!i)return!1;if("-"!==(e=t[n])&&"+"!==e||(e=t[++n]),"0"===e){if(n+1===i)return!0;if("b"===(e=t[++n])){for(n++;n<i;n++)if("_"!==(e=t[n])){if("0"!==e&&"1"!==e)return!1;r=!0}return r&&"_"!==e}if("x"===e){for(n++;n<i;n++)if("_"!==(e=t[n])){if(!Nt(t.charCodeAt(n)))return!1;r=!0}return r&&"_"!==e}if("o"===e){for(n++;n<i;n++)if("_"!==(e=t[n])){if(!Pt(t.charCodeAt(n)))return!1;r=!0}return r&&"_"!==e}}if("_"===e)return!1;for(;n<i;n++)if("_"!==(e=t[n])){if(!jt(t.charCodeAt(n)))return!1;r=!0}return!(!r||"_"===e)},construct:function(t){var e,i=t,n=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(e=i[0])&&"+"!==e||("-"===e&&(n=-1),e=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===e){if("b"===i[1])return n*parseInt(i.slice(2),2);if("x"===i[1])return n*parseInt(i.slice(2),16);if("o"===i[1])return n*parseInt(i.slice(2),8)}return n*parseInt(i,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&t%1==0&&!vt.isNegativeZero(t)},represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Dt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Ht=/^[-+]?[0-9]+e/;var Ft=new Tt("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(t){return null!==t&&!(!Dt.test(t)||"_"===t[t.length-1])},construct:function(t){var e,i;return i="-"===(e=t.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),".inf"===e?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===e?NaN:i*parseFloat(e,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&(t%1!=0||vt.isNegativeZero(t))},represent:function(t,e){var i;if(isNaN(t))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(vt.isNegativeZero(t))return"-0.0";return i=t.toString(10),Ht.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),Rt=Ot.extend({implicit:[Lt,Mt,Ut,Ft]}),zt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Bt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var qt=new Tt("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(t){return null!==t&&(null!==zt.exec(t)||null!==Bt.exec(t))},construct:function(t){var e,i,n,r,s,o,a,l,c=0,d=null;if(null===(e=zt.exec(t))&&(e=Bt.exec(t)),null===e)throw new Error("Date resolve error");if(i=+e[1],n=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(i,n,r));if(s=+e[4],o=+e[5],a=+e[6],e[7]){for(c=e[7].slice(0,3);c.length<3;)c+="0";c=+c}return e[9]&&(d=6e4*(60*+e[10]+ +(e[11]||0)),"-"===e[9]&&(d=-d)),l=new Date(Date.UTC(i,n,r,s,o,a,c)),d&&l.setTime(l.getTime()-d),l},instanceOf:Date,represent:function(t){return t.toISOString()}});var Yt=new Tt("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(t){return"<<"===t||null===t}}),Vt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var Xt=new Tt("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(t){if(null===t)return!1;var e,i,n=0,r=t.length,s=Vt;for(i=0;i<r;i++)if(!((e=s.indexOf(t.charAt(i)))>64)){if(e<0)return!1;n+=6}return n%8==0},construct:function(t){var e,i,n=t.replace(/[\r\n=]/g,""),r=n.length,s=Vt,o=0,a=[];for(e=0;e<r;e++)e%4==0&&e&&(a.push(o>>16&255),a.push(o>>8&255),a.push(255&o)),o=o<<6|s.indexOf(n.charAt(e));return 0===(i=r%4*6)?(a.push(o>>16&255),a.push(o>>8&255),a.push(255&o)):18===i?(a.push(o>>10&255),a.push(o>>2&255)):12===i&&a.push(o>>4&255),new Uint8Array(a)},predicate:function(t){return"[object Uint8Array]"===Object.prototype.toString.call(t)},represent:function(t){var e,i,n="",r=0,s=t.length,o=Vt;for(e=0;e<s;e++)e%3==0&&e&&(n+=o[r>>18&63],n+=o[r>>12&63],n+=o[r>>6&63],n+=o[63&r]),r=(r<<8)+t[e];return 0===(i=s%3)?(n+=o[r>>18&63],n+=o[r>>12&63],n+=o[r>>6&63],n+=o[63&r]):2===i?(n+=o[r>>10&63],n+=o[r>>4&63],n+=o[r<<2&63],n+=o[64]):1===i&&(n+=o[r>>2&63],n+=o[r<<4&63],n+=o[64],n+=o[64]),n}}),Wt=Object.prototype.hasOwnProperty,Gt=Object.prototype.toString;var Zt=new Tt("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(t){if(null===t)return!0;var e,i,n,r,s,o=[],a=t;for(e=0,i=a.length;e<i;e+=1){if(n=a[e],s=!1,"[object Object]"!==Gt.call(n))return!1;for(r in n)if(Wt.call(n,r)){if(s)return!1;s=!0}if(!s)return!1;if(-1!==o.indexOf(r))return!1;o.push(r)}return!0},construct:function(t){return null!==t?t:[]}}),Jt=Object.prototype.toString;var Kt=new Tt("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(t){if(null===t)return!0;var e,i,n,r,s,o=t;for(s=new Array(o.length),e=0,i=o.length;e<i;e+=1){if(n=o[e],"[object Object]"!==Jt.call(n))return!1;if(1!==(r=Object.keys(n)).length)return!1;s[e]=[r[0],n[r[0]]]}return!0},construct:function(t){if(null===t)return[];var e,i,n,r,s,o=t;for(s=new Array(o.length),e=0,i=o.length;e<i;e+=1)n=o[e],r=Object.keys(n),s[e]=[r[0],n[r[0]]];return s}}),Qt=Object.prototype.hasOwnProperty;var te=new Tt("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(t){if(null===t)return!0;var e,i=t;for(e in i)if(Qt.call(i,e)&&null!==i[e])return!1;return!0},construct:function(t){return null!==t?t:{}}}),ee=Rt.extend({implicit:[qt,Yt],explicit:[Xt,Zt,Kt,te]}),ie=Object.prototype.hasOwnProperty,ne=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,re=/[\x85\u2028\u2029]/,se=/[,\[\]\{\}]/,oe=/^(?:!|!!|![a-z\-]+!)$/i,ae=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function le(t){return Object.prototype.toString.call(t)}function ce(t){return 10===t||13===t}function de(t){return 9===t||32===t}function he(t){return 9===t||32===t||10===t||13===t}function pe(t){return 44===t||91===t||93===t||123===t||125===t}function ue(t){var e;return 48<=t&&t<=57?t-48:97<=(e=32|t)&&e<=102?e-97+10:-1}function fe(t){return 120===t?2:117===t?4:85===t?8:0}function ge(t){return 48<=t&&t<=57?t-48:-1}function be(t){return 48===t?"\0":97===t?"":98===t?"\b":116===t||9===t?"\t":110===t?"\n":118===t?"\v":102===t?"\f":114===t?"\r":101===t?"":32===t?" ":34===t?'"':47===t?"/":92===t?"\\":78===t?"":95===t?" ":76===t?"\u2028":80===t?"\u2029":""}function me(t){return t<=65535?String.fromCharCode(t):String.fromCharCode(55296+(t-65536>>10),56320+(t-65536&1023))}for(var _e=new Array(256),ve=new Array(256),ye=0;ye<256;ye++)_e[ye]=be(ye)?1:0,ve[ye]=be(ye);function we(t,e){this.input=t,this.filename=e.filename||null,this.schema=e.schema||ee,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Ae(t,e){var i={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return i.snippet=kt(i),new At(e,i)}function $e(t,e){throw Ae(t,e)}function xe(t,e){t.onWarning&&t.onWarning.call(null,Ae(t,e))}var ke={YAML:function(t,e,i){var n,r,s;null!==t.version&&$e(t,"duplication of %YAML directive"),1!==i.length&&$e(t,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&$e(t,"ill-formed argument of the YAML directive"),r=parseInt(n[1],10),s=parseInt(n[2],10),1!==r&&$e(t,"unacceptable YAML version of the document"),t.version=i[0],t.checkLineBreaks=s<2,1!==s&&2!==s&&xe(t,"unsupported YAML version of the document")},TAG:function(t,e,i){var n,r;2!==i.length&&$e(t,"TAG directive accepts exactly two arguments"),n=i[0],r=i[1],oe.test(n)||$e(t,"ill-formed tag handle (first argument) of the TAG directive"),ie.call(t.tagMap,n)&&$e(t,'there is a previously declared suffix for "'+n+'" tag handle'),ae.test(r)||$e(t,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(e){$e(t,"tag prefix is malformed: "+r)}t.tagMap[n]=r}};function Ce(t,e,i,n){var r,s,o,a;if(e<i){if(a=t.input.slice(e,i),n)for(r=0,s=a.length;r<s;r+=1)9===(o=a.charCodeAt(r))||32<=o&&o<=1114111||$e(t,"expected valid JSON character");else ne.test(a)&&$e(t,"the stream contains non-printable characters");t.result+=a}}function Se(t,e,i,n){var r,s,o,a;for(vt.isObject(i)||$e(t,"cannot merge mappings; the provided source object is unacceptable"),o=0,a=(r=Object.keys(i)).length;o<a;o+=1)s=r[o],ie.call(e,s)||(e[s]=i[s],n[s]=!0)}function Te(t,e,i,n,r,s,o,a,l){var c,d;if(Array.isArray(r))for(c=0,d=(r=Array.prototype.slice.call(r)).length;c<d;c+=1)Array.isArray(r[c])&&$e(t,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===le(r[c])&&(r[c]="[object Object]");if("object"==typeof r&&"[object Object]"===le(r)&&(r="[object Object]"),r=String(r),null===e&&(e={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(s))for(c=0,d=s.length;c<d;c+=1)Se(t,e,s[c],i);else Se(t,e,s,i);else t.json||ie.call(i,r)||!ie.call(e,r)||(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=l||t.position,$e(t,"duplicated mapping key")),"__proto__"===r?Object.defineProperty(e,r,{configurable:!0,enumerable:!0,writable:!0,value:s}):e[r]=s,delete i[r];return e}function Ee(t){var e;10===(e=t.input.charCodeAt(t.position))?t.position++:13===e?(t.position++,10===t.input.charCodeAt(t.position)&&t.position++):$e(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function Ie(t,e,i){for(var n=0,r=t.input.charCodeAt(t.position);0!==r;){for(;de(r);)9===r&&-1===t.firstTabInLine&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(e&&35===r)do{r=t.input.charCodeAt(++t.position)}while(10!==r&&13!==r&&0!==r);if(!ce(r))break;for(Ee(t),r=t.input.charCodeAt(t.position),n++,t.lineIndent=0;32===r;)t.lineIndent++,r=t.input.charCodeAt(++t.position)}return-1!==i&&0!==n&&t.lineIndent<i&&xe(t,"deficient indentation"),n}function Oe(t){var e,i=t.position;return!(45!==(e=t.input.charCodeAt(i))&&46!==e||e!==t.input.charCodeAt(i+1)||e!==t.input.charCodeAt(i+2)||(i+=3,0!==(e=t.input.charCodeAt(i))&&!he(e)))}function Le(t,e){1===e?t.result+=" ":e>1&&(t.result+=vt.repeat("\n",e-1))}function Me(t,e){var i,n,r=t.tag,s=t.anchor,o=[],a=!1;if(-1!==t.firstTabInLine)return!1;for(null!==t.anchor&&(t.anchorMap[t.anchor]=o),n=t.input.charCodeAt(t.position);0!==n&&(-1!==t.firstTabInLine&&(t.position=t.firstTabInLine,$e(t,"tab characters must not be used in indentation")),45===n)&&he(t.input.charCodeAt(t.position+1));)if(a=!0,t.position++,Ie(t,!0,-1)&&t.lineIndent<=e)o.push(null),n=t.input.charCodeAt(t.position);else if(i=t.line,je(t,e,3,!1,!0),o.push(t.result),Ie(t,!0,-1),n=t.input.charCodeAt(t.position),(t.line===i||t.lineIndent>e)&&0!==n)$e(t,"bad indentation of a sequence entry");else if(t.lineIndent<e)break;return!!a&&(t.tag=r,t.anchor=s,t.kind="sequence",t.result=o,!0)}function Ne(t){var e,i,n,r,s=!1,o=!1;if(33!==(r=t.input.charCodeAt(t.position)))return!1;if(null!==t.tag&&$e(t,"duplication of a tag property"),60===(r=t.input.charCodeAt(++t.position))?(s=!0,r=t.input.charCodeAt(++t.position)):33===r?(o=!0,i="!!",r=t.input.charCodeAt(++t.position)):i="!",e=t.position,s){do{r=t.input.charCodeAt(++t.position)}while(0!==r&&62!==r);t.position<t.length?(n=t.input.slice(e,t.position),r=t.input.charCodeAt(++t.position)):$e(t,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!he(r);)33===r&&(o?$e(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(e-1,t.position+1),oe.test(i)||$e(t,"named tag handle cannot contain such characters"),o=!0,e=t.position+1)),r=t.input.charCodeAt(++t.position);n=t.input.slice(e,t.position),se.test(n)&&$e(t,"tag suffix cannot contain flow indicator characters")}n&&!ae.test(n)&&$e(t,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(e){$e(t,"tag name is malformed: "+n)}return s?t.tag=n:ie.call(t.tagMap,i)?t.tag=t.tagMap[i]+n:"!"===i?t.tag="!"+n:"!!"===i?t.tag="tag:yaml.org,2002:"+n:$e(t,'undeclared tag handle "'+i+'"'),!0}function Pe(t){var e,i;if(38!==(i=t.input.charCodeAt(t.position)))return!1;for(null!==t.anchor&&$e(t,"duplication of an anchor property"),i=t.input.charCodeAt(++t.position),e=t.position;0!==i&&!he(i)&&!pe(i);)i=t.input.charCodeAt(++t.position);return t.position===e&&$e(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(e,t.position),!0}function je(t,e,i,n,r){var s,o,a,l,c,d,h,p,u,f=1,g=!1,b=!1;if(null!==t.listener&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=a=4===i||3===i,n&&Ie(t,!0,-1)&&(g=!0,t.lineIndent>e?f=1:t.lineIndent===e?f=0:t.lineIndent<e&&(f=-1)),1===f)for(;Ne(t)||Pe(t);)Ie(t,!0,-1)?(g=!0,a=s,t.lineIndent>e?f=1:t.lineIndent===e?f=0:t.lineIndent<e&&(f=-1)):a=!1;if(a&&(a=g||r),1!==f&&4!==i||(p=1===i||2===i?e:e+1,u=t.position-t.lineStart,1===f?a&&(Me(t,u)||function(t,e,i){var n,r,s,o,a,l,c,d=t.tag,h=t.anchor,p={},u=Object.create(null),f=null,g=null,b=null,m=!1,_=!1;if(-1!==t.firstTabInLine)return!1;for(null!==t.anchor&&(t.anchorMap[t.anchor]=p),c=t.input.charCodeAt(t.position);0!==c;){if(m||-1===t.firstTabInLine||(t.position=t.firstTabInLine,$e(t,"tab characters must not be used in indentation")),n=t.input.charCodeAt(t.position+1),s=t.line,63!==c&&58!==c||!he(n)){if(o=t.line,a=t.lineStart,l=t.position,!je(t,i,2,!1,!0))break;if(t.line===s){for(c=t.input.charCodeAt(t.position);de(c);)c=t.input.charCodeAt(++t.position);if(58===c)he(c=t.input.charCodeAt(++t.position))||$e(t,"a whitespace character is expected after the key-value separator within a block mapping"),m&&(Te(t,p,u,f,g,null,o,a,l),f=g=b=null),_=!0,m=!1,r=!1,f=t.tag,g=t.result;else{if(!_)return t.tag=d,t.anchor=h,!0;$e(t,"can not read an implicit mapping pair; a colon is missed")}}else{if(!_)return t.tag=d,t.anchor=h,!0;$e(t,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(m&&(Te(t,p,u,f,g,null,o,a,l),f=g=b=null),_=!0,m=!0,r=!0):m?(m=!1,r=!0):$e(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,c=n;if((t.line===s||t.lineIndent>e)&&(m&&(o=t.line,a=t.lineStart,l=t.position),je(t,e,4,!0,r)&&(m?g=t.result:b=t.result),m||(Te(t,p,u,f,g,b,o,a,l),f=g=b=null),Ie(t,!0,-1),c=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>e)&&0!==c)$e(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return m&&Te(t,p,u,f,g,null,o,a,l),_&&(t.tag=d,t.anchor=h,t.kind="mapping",t.result=p),_}(t,u,p))||function(t,e){var i,n,r,s,o,a,l,c,d,h,p,u,f=!0,g=t.tag,b=t.anchor,m=Object.create(null);if(91===(u=t.input.charCodeAt(t.position)))o=93,c=!1,s=[];else{if(123!==u)return!1;o=125,c=!0,s={}}for(null!==t.anchor&&(t.anchorMap[t.anchor]=s),u=t.input.charCodeAt(++t.position);0!==u;){if(Ie(t,!0,e),(u=t.input.charCodeAt(t.position))===o)return t.position++,t.tag=g,t.anchor=b,t.kind=c?"mapping":"sequence",t.result=s,!0;f?44===u&&$e(t,"expected the node content, but found ','"):$e(t,"missed comma between flow collection entries"),p=null,a=l=!1,63===u&&he(t.input.charCodeAt(t.position+1))&&(a=l=!0,t.position++,Ie(t,!0,e)),i=t.line,n=t.lineStart,r=t.position,je(t,e,1,!1,!0),h=t.tag,d=t.result,Ie(t,!0,e),u=t.input.charCodeAt(t.position),!l&&t.line!==i||58!==u||(a=!0,u=t.input.charCodeAt(++t.position),Ie(t,!0,e),je(t,e,1,!1,!0),p=t.result),c?Te(t,s,m,h,d,p,i,n,r):a?s.push(Te(t,null,m,h,d,p,i,n,r)):s.push(d),Ie(t,!0,e),44===(u=t.input.charCodeAt(t.position))?(f=!0,u=t.input.charCodeAt(++t.position)):f=!1}$e(t,"unexpected end of the stream within a flow collection")}(t,p)?b=!0:(o&&function(t,e){var i,n,r,s,o=1,a=!1,l=!1,c=e,d=0,h=!1;if(124===(s=t.input.charCodeAt(t.position)))n=!1;else{if(62!==s)return!1;n=!0}for(t.kind="scalar",t.result="";0!==s;)if(43===(s=t.input.charCodeAt(++t.position))||45===s)1===o?o=43===s?3:2:$e(t,"repeat of a chomping mode identifier");else{if(!((r=ge(s))>=0))break;0===r?$e(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?$e(t,"repeat of an indentation width identifier"):(c=e+r-1,l=!0)}if(de(s)){do{s=t.input.charCodeAt(++t.position)}while(de(s));if(35===s)do{s=t.input.charCodeAt(++t.position)}while(!ce(s)&&0!==s)}for(;0!==s;){for(Ee(t),t.lineIndent=0,s=t.input.charCodeAt(t.position);(!l||t.lineIndent<c)&&32===s;)t.lineIndent++,s=t.input.charCodeAt(++t.position);if(!l&&t.lineIndent>c&&(c=t.lineIndent),ce(s))d++;else{if(t.lineIndent<c){3===o?t.result+=vt.repeat("\n",a?1+d:d):1===o&&a&&(t.result+="\n");break}for(n?de(s)?(h=!0,t.result+=vt.repeat("\n",a?1+d:d)):h?(h=!1,t.result+=vt.repeat("\n",d+1)):0===d?a&&(t.result+=" "):t.result+=vt.repeat("\n",d):t.result+=vt.repeat("\n",a?1+d:d),a=!0,l=!0,d=0,i=t.position;!ce(s)&&0!==s;)s=t.input.charCodeAt(++t.position);Ce(t,i,t.position,!1)}}return!0}(t,p)||function(t,e){var i,n,r;if(39!==(i=t.input.charCodeAt(t.position)))return!1;for(t.kind="scalar",t.result="",t.position++,n=r=t.position;0!==(i=t.input.charCodeAt(t.position));)if(39===i){if(Ce(t,n,t.position,!0),39!==(i=t.input.charCodeAt(++t.position)))return!0;n=t.position,t.position++,r=t.position}else ce(i)?(Ce(t,n,r,!0),Le(t,Ie(t,!1,e)),n=r=t.position):t.position===t.lineStart&&Oe(t)?$e(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);$e(t,"unexpected end of the stream within a single quoted scalar")}(t,p)||function(t,e){var i,n,r,s,o,a;if(34!==(a=t.input.charCodeAt(t.position)))return!1;for(t.kind="scalar",t.result="",t.position++,i=n=t.position;0!==(a=t.input.charCodeAt(t.position));){if(34===a)return Ce(t,i,t.position,!0),t.position++,!0;if(92===a){if(Ce(t,i,t.position,!0),ce(a=t.input.charCodeAt(++t.position)))Ie(t,!1,e);else if(a<256&&_e[a])t.result+=ve[a],t.position++;else if((o=fe(a))>0){for(r=o,s=0;r>0;r--)(o=ue(a=t.input.charCodeAt(++t.position)))>=0?s=(s<<4)+o:$e(t,"expected hexadecimal character");t.result+=me(s),t.position++}else $e(t,"unknown escape sequence");i=n=t.position}else ce(a)?(Ce(t,i,n,!0),Le(t,Ie(t,!1,e)),i=n=t.position):t.position===t.lineStart&&Oe(t)?$e(t,"unexpected end of the document within a double quoted scalar"):(t.position++,n=t.position)}$e(t,"unexpected end of the stream within a double quoted scalar")}(t,p)?b=!0:!function(t){var e,i,n;if(42!==(n=t.input.charCodeAt(t.position)))return!1;for(n=t.input.charCodeAt(++t.position),e=t.position;0!==n&&!he(n)&&!pe(n);)n=t.input.charCodeAt(++t.position);return t.position===e&&$e(t,"name of an alias node must contain at least one character"),i=t.input.slice(e,t.position),ie.call(t.anchorMap,i)||$e(t,'unidentified alias "'+i+'"'),t.result=t.anchorMap[i],Ie(t,!0,-1),!0}(t)?function(t,e,i){var n,r,s,o,a,l,c,d,h=t.kind,p=t.result;if(he(d=t.input.charCodeAt(t.position))||pe(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(he(n=t.input.charCodeAt(t.position+1))||i&&pe(n)))return!1;for(t.kind="scalar",t.result="",r=s=t.position,o=!1;0!==d;){if(58===d){if(he(n=t.input.charCodeAt(t.position+1))||i&&pe(n))break}else if(35===d){if(he(t.input.charCodeAt(t.position-1)))break}else{if(t.position===t.lineStart&&Oe(t)||i&&pe(d))break;if(ce(d)){if(a=t.line,l=t.lineStart,c=t.lineIndent,Ie(t,!1,-1),t.lineIndent>=e){o=!0,d=t.input.charCodeAt(t.position);continue}t.position=s,t.line=a,t.lineStart=l,t.lineIndent=c;break}}o&&(Ce(t,r,s,!1),Le(t,t.line-a),r=s=t.position,o=!1),de(d)||(s=t.position+1),d=t.input.charCodeAt(++t.position)}return Ce(t,r,s,!1),!!t.result||(t.kind=h,t.result=p,!1)}(t,p,1===i)&&(b=!0,null===t.tag&&(t.tag="?")):(b=!0,null===t.tag&&null===t.anchor||$e(t,"alias node should not have any properties")),null!==t.anchor&&(t.anchorMap[t.anchor]=t.result)):0===f&&(b=a&&Me(t,u))),null===t.tag)null!==t.anchor&&(t.anchorMap[t.anchor]=t.result);else if("?"===t.tag){for(null!==t.result&&"scalar"!==t.kind&&$e(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),l=0,c=t.implicitTypes.length;l<c;l+=1)if((h=t.implicitTypes[l]).resolve(t.result)){t.result=h.construct(t.result),t.tag=h.tag,null!==t.anchor&&(t.anchorMap[t.anchor]=t.result);break}}else if("!"!==t.tag){if(ie.call(t.typeMap[t.kind||"fallback"],t.tag))h=t.typeMap[t.kind||"fallback"][t.tag];else for(h=null,l=0,c=(d=t.typeMap.multi[t.kind||"fallback"]).length;l<c;l+=1)if(t.tag.slice(0,d[l].tag.length)===d[l].tag){h=d[l];break}h||$e(t,"unknown tag !<"+t.tag+">"),null!==t.result&&h.kind!==t.kind&&$e(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+h.kind+'", not "'+t.kind+'"'),h.resolve(t.result,t.tag)?(t.result=h.construct(t.result,t.tag),null!==t.anchor&&(t.anchorMap[t.anchor]=t.result)):$e(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return null!==t.listener&&t.listener("close",t),null!==t.tag||null!==t.anchor||b}function Ue(t){var e,i,n,r,s=t.position,o=!1;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);0!==(r=t.input.charCodeAt(t.position))&&(Ie(t,!0,-1),r=t.input.charCodeAt(t.position),!(t.lineIndent>0||37!==r));){for(o=!0,r=t.input.charCodeAt(++t.position),e=t.position;0!==r&&!he(r);)r=t.input.charCodeAt(++t.position);for(n=[],(i=t.input.slice(e,t.position)).length<1&&$e(t,"directive name must not be less than one character in length");0!==r;){for(;de(r);)r=t.input.charCodeAt(++t.position);if(35===r){do{r=t.input.charCodeAt(++t.position)}while(0!==r&&!ce(r));break}if(ce(r))break;for(e=t.position;0!==r&&!he(r);)r=t.input.charCodeAt(++t.position);n.push(t.input.slice(e,t.position))}0!==r&&Ee(t),ie.call(ke,i)?ke[i](t,i,n):xe(t,'unknown document directive "'+i+'"')}Ie(t,!0,-1),0===t.lineIndent&&45===t.input.charCodeAt(t.position)&&45===t.input.charCodeAt(t.position+1)&&45===t.input.charCodeAt(t.position+2)?(t.position+=3,Ie(t,!0,-1)):o&&$e(t,"directives end mark is expected"),je(t,t.lineIndent-1,4,!1,!0),Ie(t,!0,-1),t.checkLineBreaks&&re.test(t.input.slice(s,t.position))&&xe(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&Oe(t)?46===t.input.charCodeAt(t.position)&&(t.position+=3,Ie(t,!0,-1)):t.position<t.length-1&&$e(t,"end of the stream or a document separator is expected")}function De(t,e){e=e||{},0!==(t=String(t)).length&&(10!==t.charCodeAt(t.length-1)&&13!==t.charCodeAt(t.length-1)&&(t+="\n"),65279===t.charCodeAt(0)&&(t=t.slice(1)));var i=new we(t,e),n=t.indexOf("\0");for(-1!==n&&(i.position=n,$e(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)Ue(i);return i.documents}var He={loadAll:function(t,e,i){null!==e&&"object"==typeof e&&void 0===i&&(i=e,e=null);var n=De(t,i);if("function"!=typeof e)return n;for(var r=0,s=n.length;r<s;r+=1)e(n[r])},load:function(t,e){var i=De(t,e);if(0!==i.length){if(1===i.length)return i[0];throw new At("expected a single document in the stream, but found more")}}}.load;let Fe=class extends ot{constructor(){super(...arguments),this._openCardPickers=[],this._initialized=!1}setConfig(t){this._config=t,this._initialized=!0}_valueChanged(t){mt(this,"config-changed",{config:t})}_toggleHideInactive(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,hide_inactive_tab_titles:e.checked})}_toggleShowFade(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,show_fade:e.checked})}_toggleEnableSwipe(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,enable_swipe:e.checked})}_toggleHaptic(t){if(!this._config)return;const e=t.target;this._valueChanged({...this._config,haptic_feedback:e.checked})}_handleSelectChange(t,e){if(!this._config)return;const i=t.target;this._valueChanged({...this._config,[e]:i.value})}_isMultiCardTab(t){return"cards"in t&&Array.isArray(t.cards)}_getTabCard(t){return"cards"in t&&Array.isArray(t.cards)?{type:"vertical-stack",cards:t.cards}:t.card}_handleTabChange(t,e){if(!this._config)return;const i=t.target,n=[...this._config.tabs];let r;const s=t.detail?.value??i.value,o=i.name;if("card"===o)try{const t=s.split("\n").map(t=>`  ${t}`).join("\n");r=He(t),null!==r&&"object"==typeof r||(r={type:""})}catch(t){r=s}else r=s;n[e]={...n[e],[o]:r},this._valueChanged({...this._config,tabs:n})}_addTab(){if(!this._config)return;const t=[...this._config.tabs||[],{title:"New Tab",icon:"mdi:new-box",card:{type:"markdown",content:"## New Tab Content"}}];this._valueChanged({...this._config,tabs:t})}_removeTab(t){if(!this._config)return;const e=this._config.tabs.filter((e,i)=>i!==t);this._valueChanged({...this._config,tabs:e})}_getTabCards(t){return"cards"in t&&Array.isArray(t.cards)?[...t.cards]:t.card?[t.card]:[]}_setTabCards(t,e){if(!this._config)return;const i=[...this._config.tabs],n=i[t];if(e.length<=1){const r={...n,card:e[0]??{type:"markdown",content:"New card content"},cards:void 0};delete r.cards,i[t]=r}else{const r={...n,cards:e,card:void 0};delete r.card,i[t]=r}this._valueChanged({...this._config,tabs:i})}_removeCard(t,e){if(!this._config)return;const i=this._config.tabs[t],n=this._getTabCards(i);n.length<=1||(n.splice(e,1),this._setTabCards(t,n))}_moveCard(t,e,i){if(!this._config)return;const n=this._config.tabs[t],r=this._getTabCards(n),s="up"===i?e-1:e+1;s>=0&&s<r.length&&([r[e],r[s]]=[r[s],r[e]],this._setTabCards(t,r))}async _openCardEditor(t,e){if(!this._config||!this.hass)return;const i=this._config.tabs[t];let n;if("number"==typeof e&&"cards"in i&&Array.isArray(i.cards)?n=i.cards[e]:"card"in i&&i.card&&(n=i.card),n)try{await customElements.whenDefined("hui-dialog-edit-card");const i=document.createElement("hui-dialog-edit-card");i.hass=this.hass,document.body.appendChild(i);const r=()=>{i.removeEventListener("dialog-closed",r),i.parentNode===document.body&&document.body.removeChild(i)};i.addEventListener("dialog-closed",r,{once:!0}),await i.showDialog({cardConfig:n,lovelaceConfig:this.lovelace,saveCardConfig:i=>{if(!this._config)return;if(!i)return;const n=[...this._config.tabs],r=n[t];if("number"==typeof e&&"cards"in r&&Array.isArray(r.cards)){const s=[...r.cards];s[e]=i;const o={...r,cards:s,card:void 0};delete o.card,n[t]=o}else{const e={...r,card:i,cards:void 0};delete e.cards,n[t]=e}this._valueChanged({...this._config,tabs:n})}})}catch(t){console.error("[Simple Tabs Editor] Failed to open visual card editor:",t)}}_handleCardPicked(t,e){if(!this._config)return;t.stopPropagation();const i=t.detail,n=i?.config;if(!n||"object"!=typeof n)return;const r=this._getTabCards(this._config.tabs[e]);r.push(n),this._setTabCards(e,r),this._openCardPickers=this._openCardPickers.filter(t=>t!==e)}_cardTypeLabel(t){const e=(t.type||"Unknown").replace(/^custom:/,"").replace(/-/g," ");return e.charAt(0).toUpperCase()+e.slice(1)}_toggleCardPicker(t){this._openCardPickers=this._openCardPickers.includes(t)?this._openCardPickers.filter(e=>e!==t):[t]}_moveTab(t,e){if(!this._config)return;const i=[...this._config.tabs],[n]=i.splice(t,1),r="up"===e?t-1:t+1;i.splice(r,0,n),this._valueChanged({...this._config,tabs:i})}render(){return this.hass&&this._config?z`
      <div class="card-config">
        <div class="global-options">
            <h3 class="settings-title">Display Settings</h3>
            <div class="setting-row">
              <span>Hide titles on inactive tabs</span>
              <ha-switch 
                  .checked=${this._config.hide_inactive_tab_titles||!1}
                  @change=${this._toggleHideInactive}
              ></ha-switch>
            </div>
            <div class="setting-row">
              <span>Show scroll fade</span>
              <ha-switch 
                  .checked=${this._config.show_fade??!0}
                  @change=${this._toggleShowFade}
              ></ha-switch>
            </div>
            <div class="select-group">
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
            <div class="select-group">
              <label class="select-label">Tab Alignment</label>
              <select 
                  class="ha-like-select"
                  .value=${this._config.alignment||"center"}
                  @change=${t=>this._handleSelectChange(t,"alignment")}
              >
                  <option value="start">Start (Left)</option>
                  <option value="center">Center</option>
                  <option value="end">End (Right)</option>
              </select>
            </div>

            <h3 class="settings-title behavior-title">Behavior Settings</h3>
            <div class="setting-row">
              <span>Enable swipe gestures</span>
              <ha-switch 
                  .checked=${this._config.enable_swipe??!0}
                  @change=${this._toggleEnableSwipe}
              ></ha-switch>
            </div>
            <div class="setting-row">
              <span>Haptic feedback</span>
              <ha-switch 
                  .checked=${this._config.haptic_feedback||!1}
                  @change=${this._toggleHaptic}
              ></ha-switch>
            </div>
            <div class="select-group">
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

        <div class="tabs-list">
        ${this._config.tabs.map((t,e)=>z`
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
                    <ha-textfield
                        class="summary-title"
                        .name=${"title"}
                        .value=${t.title||""}
                        placeholder="Tab Title"
                        @input=${t=>this._handleTabChange(t,e)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${t=>t.stopPropagation()}
                    ></ha-textfield>
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
                        <ha-textfield
                            .label=${"Tab ID (for deep linking)"}
                            .value=${t.id||""}
                            .name=${"id"}
                            @input=${t=>this._handleTabChange(t,e)}
                        ></ha-textfield>
                    </div>
                    <ha-textfield
                        .label=${"Badge Template (Jinja)"}
                        .value=${t.badge||""}
                        .name=${"badge"}
                        placeholder="{{ is_state('light.kitchen', 'on') }}"
                        @input=${t=>this._handleTabChange(t,e)}
                    ></ha-textfield>

                    <div style="margin-top: 16px;">
                      <h3 style="margin: 0 0 12px 0;">Cards</h3>
                      ${this._getTabCards(t).map((t,i,n)=>z`
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
                              @click=${()=>this._openCardEditor(e,i)}
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
                      `)}
                      <button
                        class="picker-toggle-btn"
                        @click=${()=>this._toggleCardPicker(e)}
                      >
                        ${this._openCardPickers.includes(e)?"Close Card Picker":"Add Card"}
                      </button>
                      ${this._openCardPickers.includes(e)?z`
                        <div class="card-picker-shell">
                          <hui-card-picker
                            .hass=${this.hass}
                            .lovelace=${this.lovelace}
                            label="Search cards"
                            @config-changed=${t=>this._handleCardPicked(t,e)}
                          ></hui-card-picker>
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
        
        <p class="help-text">
            <strong>Note:</strong> Advanced styling and logic features must be configured via the YAML code editor.
        </p>
      </div>
    `:z``}};Fe.styles=o`
    .card-config {
      padding: 16px;
    }
    .global-options {
        margin-bottom: 24px;
        padding: 14px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--ha-card-background, rgba(0,0,0,0.12));
    }
    .settings-title {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .behavior-title {
      margin-top: 18px;
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
    .help-text { font-size: 0.9em; color: var(--secondary-text-color); margin-top: 24px; }
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
    .card-picker-shell hui-card-picker {
      --ha-card-border-radius: 16px;
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
  `,t([ht({attribute:!1})],Fe.prototype,"hass",void 0),t([ht({attribute:!1})],Fe.prototype,"lovelace",void 0),t([pt()],Fe.prototype,"_config",void 0),t([pt()],Fe.prototype,"_helpers",void 0),t([pt()],Fe.prototype,"_openCardPickers",void 0),Fe=t([lt("simple-tabs-editor")],Fe);const Re=1;let ze=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const Be="important",qe=" !"+Be,Ye=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ze{constructor(t){if(super(t),t.type!==Re||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const n=e[t];if(null!=n){this.ft.add(t);const e="string"==typeof n&&n.endsWith(qe);t.includes("-")||e?i.setProperty(t,e?n.slice(0,-11):n,e?Be:""):i[t]=n}}return B}});let Ve=class extends ot{constructor(){super(...arguments),this._cards=[],this._selectedTabIndex=0,this._prevSelectedTabIndex=0,this._transitionDirection="none",this._tabVisibility=[],this._visibleIndices=[],this._renderedTitles=[],this._renderedIcons=[],this._renderedBadges=[],this._templateUnsubscribers=[],this._hassSet=!1,this._initialized=!1,this._lastCheckedUrl="",this._touchStartX=0,this._touchStartY=0,this._touchStartTime=0,this._isSwiping=!1,this._blockSwipeForGesture=!1,this._handleResize=()=>{requestAnimationFrame(()=>this._updateOverflowState())},this._handleDeepLink=()=>{requestAnimationFrame(()=>this._checkDeepLink())},this._handleTouchStart=t=>{if(!this._config?.enable_swipe)return;const e=t.touches[0];this._touchStartX=e.clientX,this._touchStartY=e.clientY,this._touchStartTime=Date.now(),this._isSwiping=!1,this._blockSwipeForGesture=this._shouldAlwaysBlockSwipe(t)},this._handleTouchMove=t=>{if(!this._config?.enable_swipe||!this._touchStartX)return;if(this._blockSwipeForGesture)return;const e=t.touches[0],i=e.clientX-this._touchStartX,n=e.clientY-this._touchStartY;if(Math.abs(i)>2*Math.abs(n)&&Math.abs(i)>10){if(this._shouldYieldToNestedHorizontalScroll(t,i))return;this._isSwiping=!0,t.preventDefault()}},this._handleTouchEnd=t=>{if(!this._config?.enable_swipe||!this._touchStartX||!this._isSwiping)return this._touchStartX=0,this._touchStartY=0,this._isSwiping=!1,void(this._blockSwipeForGesture=!1);const e=t.changedTouches[0],i=e.clientX-this._touchStartX,n=e.clientY-this._touchStartY,r=Date.now()-this._touchStartTime,s=this._config.swipe_threshold??50;if(this._touchStartX=0,this._touchStartY=0,this._isSwiping=!1,this._blockSwipeForGesture=!1,Math.abs(i)<s||r>500)return;if(Math.abs(n)>Math.abs(i)/2)return;const o=this._visibleIndices.indexOf(this._selectedTabIndex);if(-1===o)return;let a=o;i<0&&o<this._visibleIndices.length-1?a=o+1:i>0&&o>0&&(a=o-1),a!==o&&this._selectTab(this._visibleIndices[a],!0)}}static async getConfigElement(){return document.createElement("simple-tabs-editor")}static getStubConfig(){return{type:"custom:simple-tabs",tabs:[{title:"Tab 1",icon:"mdi:home",id:"tab1",card:{type:"markdown",content:"Content 1"}},{title:"Tab 2",icon:"mdi:cog",id:"tab2",card:{type:"markdown",content:"Content 2"}}]}}_loadHelpers(){return this._helpers?Promise.resolve():(this._helpersPromise||(this._helpersPromise=new Promise(async(t,e)=>{try{this._helpers=await(window.loadCardHelpers?.()),t()}catch(t){console.error("[Simple Tabs] Helpers error:",t),e(t)}})),this._helpersPromise)}connectedCallback(){super.connectedCallback(),this._disconnectCleanupTimeout&&(clearTimeout(this._disconnectCleanupTimeout),this._disconnectCleanupTimeout=void 0),window.addEventListener("resize",this._handleResize,{passive:!0}),window.addEventListener("hashchange",this._handleDeepLink,{passive:!0}),window.addEventListener("popstate",this._handleDeepLink,{passive:!0}),window.addEventListener("location-changed",this._handleDeepLink,{passive:!0}),this._handleDeepLink()}async disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._handleResize),window.removeEventListener("hashchange",this._handleDeepLink),window.removeEventListener("popstate",this._handleDeepLink),window.removeEventListener("location-changed",this._handleDeepLink),this._disconnectCleanupTimeout=window.setTimeout(()=>{this.isConnected||this._unsubscribeTemplates()},0)}_triggerHaptic(){this._config?.haptic_feedback&&(!function(t){mt(window,"haptic",t)}("selection"),"vibrate"in navigator&&navigator.vibrate(10))}_getConfigFingerprint(){if(!this._config?.tabs?.length)return"default";const t=JSON.stringify(this._config.tabs.map((t,e)=>({index:e,id:t.id??"",title:t.title??"",icon:t.icon??""})));let e=0;for(let i=0;i<t.length;i+=1)e=(e<<5)-e+t.charCodeAt(i)|0;return Math.abs(e).toString(36)}_getStorageKey(){const t=`simple-tabs-${this._getConfigFingerprint()}-last-tab`;if("per_device"===this._config?.remember_tab){return`${t}-${btoa(navigator.userAgent).substring(0,10)}`}return t}_saveTabToMemory(t){if(this._config?.remember_tab)try{localStorage.setItem(this._getStorageKey(),String(t))}catch(t){console.error("[Simple Tabs] Failed to save tab memory:",t)}}_loadTabFromMemory(){if(!this._config?.remember_tab)return null;try{const t=localStorage.getItem(this._getStorageKey());if(null!==t){const e=parseInt(t,10);if(!isNaN(e)&&e>=0&&e<this._config.tabs.length)return e}}catch(t){console.error("[Simple Tabs] Failed to load tab memory:",t)}return null}_isFormControl(t){const e=t.tagName.toLowerCase();return"input"===e||"textarea"===e||"select"===e||t.isContentEditable}_hasHorizontalScroll(t){const e=window.getComputedStyle(t).overflowX;return("auto"===e||"scroll"===e||"overlay"===e||"hidden"===e&&t.scrollWidth>t.clientWidth+1)&&t.scrollWidth>t.clientWidth+1}_canTargetConsumeHorizontalSwipe(t,e){if(!this._hasHorizontalScroll(t))return!1;const i=t.scrollWidth-t.clientWidth;if(i<=0)return!1;return e<0?t.scrollLeft<i-1:e>0&&t.scrollLeft>1}_shouldAlwaysBlockSwipe(t){const e=t.composedPath();for(const t of e){if(!(t instanceof HTMLElement))continue;if(t===this._contentEl)break;const e=t.tagName.toLowerCase(),i=t.classList;if(this._isFormControl(t)||"ha-slider"===e||"mwc-slider"===e||i.contains("slider")||i.contains("swiper")||t.hasAttribute("data-no-swipe"))return!0}return!1}_shouldYieldToNestedHorizontalScroll(t,e){const i=t.composedPath();for(const t of i)if(t instanceof HTMLElement){if(t===this._contentEl)break;if(this._canTargetConsumeHorizontalSwipe(t,e))return!0}return!1}_unsubscribeTemplates(){this._templateUnsubscribers.forEach(t=>t?.()),this._templateUnsubscribers=[]}async setConfig(t){if(!t||!t.tabs)throw new Error("Invalid configuration");if(e=this._config,i=t,e&&e.tabs.length===i.tabs.length&&e.hide_inactive_tab_titles===i.hide_inactive_tab_titles&&e.show_fade===i.show_fade&&JSON.stringify(e.default_tab)===JSON.stringify(i.default_tab)&&!e.tabs.some((t,e)=>{const n=i.tabs[e];return!n||t.title!==n.title||t.icon!==n.icon||t.id!==n.id||t.badge!==n.badge||JSON.stringify(t.card)!=JSON.stringify(t.card)||JSON.stringify(t.conditions)!=JSON.stringify(t.conditions)}))return;var e,i;this._loadHelpers(),this._unsubscribeTemplates(),this._config={alignment:"center","pre-load":!1,tab_position:"top",enable_swipe:!0,swipe_animation:!0,swipe_threshold:50,remember_tab:!1,haptic_feedback:!1,...t};const n=t.tabs.length;this._cards=new Array(n).fill(null),this._tabVisibility=new Array(n).fill(!0),this._renderedTitles=t.tabs.map(t=>t.title),this._renderedIcons=t.tabs.map(t=>t.icon),this._renderedBadges=new Array(n).fill(!1),this._visibleIndices=t.tabs.map((t,e)=>e),this._initialized=!1,this._hassSet&&this._subscribeToTemplates(this._config.tabs),this._config["pre-load"]&&this._createCards(this._config.tabs).then(t=>{this._cards=t})}_isTemplate(t){return"string"==typeof t&&(t.includes("{{")||t.includes("{%"))}async _subscribeToTemplates(t){const e=async(t,e)=>{try{const i=await this.hass.connection.subscribeMessage(e,{type:"render_template",template:t});this._templateUnsubscribers.push(i)}catch(t){console.error("[Simple Tabs] Template error:",t)}},i=[];t.forEach((t,n)=>{const r=(t,e)=>{if(this[t][n]!==e){const i=[...this[t]];i[n]=e,this[t]=i}};if(this._isTemplate(t.title)&&i.push(e(t.title,t=>r("_renderedTitles",t.result))),this._isTemplate(t.icon)&&i.push(e(t.icon,t=>r("_renderedIcons",t.result))),t.badge)if(this._isTemplate(t.badge))i.push(e(t.badge,t=>{const e=t.result;r("_renderedBadges",!0===e||"on"===e||"true"===e||"number"==typeof e&&e>0)}));else{const e=t.badge,i="true"===e||"on"===e;if(this._renderedBadges[n]!==i){const t=[...this._renderedBadges];t[n]=i,this._renderedBadges=t}}t.conditions?.forEach(t=>{"template"in t&&i.push(e(t.template,t=>{let e=!!t.result;if("string"==typeof t.result){const i=t.result.toLowerCase().trim();e="false"!==i&&""!==i}if(this._tabVisibility[n]!==e){const t=[...this._tabVisibility];t[n]=e,this._tabVisibility=t}}))})}),await Promise.all(i)}willUpdate(t){(t.has("_tabVisibility")||t.has("hass")||t.has("_config"))&&this._calculateVisibleIndices(),this._visibleIndices.length>0&&(this._visibleIndices.includes(this._selectedTabIndex)||(this._selectedTabIndex=this._visibleIndices[0]))}_calculateVisibleIndices(){if(!this._config)return;const t=this._config.tabs.map((t,e)=>e).filter(t=>{const e=this._config.tabs[t];return!e.conditions||e.conditions.every(e=>"template"in e?this._tabVisibility[t]:this._checkCondition(e))});t.length===this._visibleIndices.length&&t.every((t,e)=>t===this._visibleIndices[e])||(this._visibleIndices=t)}shouldUpdate(t){if(t.has("_config")||t.has("_selectedTabIndex")||t.has("_visibleIndices")||t.has("_renderedTitles")||t.has("_renderedIcons")||t.has("_renderedBadges"))return!0;const e=t.get("hass");return!e||!this.hass||(e.states!==this.hass.states||e.localize!==this.hass.localize||e.user!==this.hass.user)}_checkCondition(t){if("entity"in t)return this.hass.states[t.entity]?.state===t.state;if("user"in t){if(!this.hass.user)return!1;const e=Array.isArray(t.user)?t.user:[t.user];return e.includes(this.hass.user.id)||e.includes(this.hass.user.name)}return!1}_calculateDefaultTab(){if(void 0===this._config.default_tab)return 0;if("number"==typeof this._config.default_tab){const t=this._config.default_tab-1;return t>=0&&t<this._config.tabs.length?t:0}if(Array.isArray(this._config.default_tab))for(const t of this._config.default_tab){const e=t.tab-1;if(e<0||e>=this._config.tabs.length)continue;if(!t.conditions||0===t.conditions.length)return e;const i=t.conditions.every(t=>this._checkCondition(t));if(i)return e}return 0}_checkDeepLink(){if(!this._config||!this._config.tabs)return!1;this._lastCheckedUrl=window.location.href;let t=null,e=!1;const i=new URL(window.location.href);if(i.searchParams.has("tab"))t=i.searchParams.get("tab"),e=!0;else{const e=window.location.hash.substring(1);e&&(t=e)}if(!t)return!1;const n=this._config.tabs.findIndex(e=>{if(e.id===t)return!0;if(!e.id&&e.title&&!this._isTemplate(e.title)){if(e.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")===t)return!0}return!1});return!!(n>=0&&n!==this._selectedTabIndex&&(this._calculateVisibleIndices(),this._visibleIndices.includes(n)))&&(this._selectedTabIndex=n,e&&(i.searchParams.delete("tab"),window.history.replaceState(null,"",i.toString()),this._lastCheckedUrl=i.toString()),!0)}_normalizeTabCard(t){if("cards"in t&&Array.isArray(t.cards))return{type:"grid",columns:1,square:!1,cards:t.cards};if("card"in t&&void 0!==t.card)return t.card;throw new Error('[Simple Tabs] Invalid tab configuration: must have either "card" or "cards" property')}async _createCard(t){try{await this._loadHelpers();const e=this._normalizeTabCard(t),i=this._helpers.createCardElement(e);return i.hass=this.hass,i}catch(t){return console.error("[Simple Tabs] Create card error:",t),null}}async _ensureCard(t){if(this._cards[t]||!this._config.tabs[t])return;const e=await this._createCard(this._config.tabs[t]);this._cards=[...this._cards.slice(0,t),e,...this._cards.slice(t+1)]}_scrollToActiveTab(t=!0){const e=this._tabsEl,i=this.shadowRoot?.querySelector(".tab-button.active");if(e&&i){const n=e.getBoundingClientRect(),r=i.getBoundingClientRect(),s=r.left-n.left+e.scrollLeft-n.width/2+r.width/2;e.scrollTo({left:s,behavior:t?"smooth":"auto"})}}_updateOverflowState(){const t=this._tabsEl,e=this.shadowRoot?.querySelector(".tabs-container");if(t&&e){const i=1,n=t.scrollLeft>i,r=t.scrollWidth>t.clientWidth+t.scrollLeft+i;e.classList.contains("can-scroll-left")!==n&&e.classList.toggle("can-scroll-left",n),e.classList.contains("can-scroll-right")!==r&&e.classList.toggle("can-scroll-right",r)}}async _createCards(t){return await this._loadHelpers(),Promise.all(t.map(t=>this._createCard(t)))}updated(t){if(super.updated(t),t.has("_config")){const t=this._config["margin-bottom"]??"0px";this.style.setProperty("--simple-tabs-margin-bottom",t)}if(this.hass&&this._config&&!this._hassSet&&(this._hassSet=!0,this._subscribeToTemplates(this._config.tabs)),window.location.href!==this._lastCheckedUrl){const t=this._checkDeepLink();if(!this._initialized&&!t){const t=this._calculateDefaultTab(),e=this._loadTabFromMemory();this._selectedTabIndex=0!==t?t:null!==e?e:0}this._initialized=!0}else if(!this._initialized){const t=this._calculateDefaultTab(),e=this._loadTabFromMemory();this._selectedTabIndex=0!==t?t:null!==e?e:0,this._initialized=!0}if(t.has("hass")){const t=this._cards.length;for(let e=0;e<t;e++){const t=this._cards[e];t&&(t.hass=this.hass)}}t.has("_selectedTabIndex")&&!this._config["pre-load"]&&this._ensureCard(this._selectedTabIndex),t.has("_selectedTabIndex")&&this._scrollToActiveTab(),(t.has("_config")||t.has("_visibleIndices"))&&requestAnimationFrame(()=>this._updateOverflowState())}firstUpdated(){requestAnimationFrame(()=>this._scrollToActiveTab(!1)),this._config["pre-load"]||setTimeout(()=>this._startBackgroundCardLoading(),200)}_startBackgroundCardLoading(){if(!this._config)return;const t=this._config.tabs.map((t,e)=>e).filter(t=>t!==this._selectedTabIndex&&!this._cards[t]),e=()=>{if(0===t.length)return;const i=t.shift();"requestIdleCallback"in window?window.requestIdleCallback(()=>{this._ensureCard(i).then(()=>e())}):setTimeout(()=>{this._ensureCard(i).then(()=>e())},50)};e()}_handleDragStart(t){const e=this._tabsEl;if(!e||0!==t.button)return;let i=!1;const n=t.pageX,r=e.scrollLeft,s=t=>{const s=t.pageX-n;!i&&Math.abs(s)>3&&(i=!0,e.classList.add("dragging")),i&&(e.scrollLeft=r-s,this._updateOverflowState())},o=()=>{e.classList.remove("dragging"),document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",o)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",o)}_selectTab(t,e=!1){if(t===this._selectedTabIndex)return;const i=t>this._selectedTabIndex?"right":"left";this._prevSelectedTabIndex=this._selectedTabIndex,this._selectedTabIndex=t,this._transitionDirection=i,setTimeout(()=>{this._transitionDirection="none",this._prevSelectedTabIndex=t},350),this._saveTabToMemory(t),e&&this._triggerHaptic()}render(){if(!this._config||!this.hass)return z``;const t={"--simple-tabs-bg-color":this._config["background-color"],"--simple-tabs-border-color":this._config["border-color"],"--simple-tabs-text-color":this._config["text-color"],"--simple-tabs-hover-color":this._config["hover-color"],"--simple-tabs-active-text-color":this._config["active-text-color"],"--simple-tabs-active-bg":this._config["active-background"],"--simple-tabs-container-bg":this._config.container_background,"--simple-tabs-container-padding":this._config.container_padding,"--simple-tabs-container-rounding":this._config.container_rounding,"--simple-tabs-inactive-title-display":this._config.hide_inactive_tab_titles?"none":"inline","--simple-tabs-gap":this._config.tabs_gap,"--simple-tabs-button-padding":this._config.button_padding};this._config.margin&&(t.margin=this._config.margin);const e=`align-${this._config.alignment||"center"}`,i=this._config.show_fade??!0?"enable-fade":"",n="bottom"===this._config.tab_position?"position-bottom":"position-top",r=z`
      <div class="tabs-container ${e} ${i}">
        <div class="tabs" role="tablist" @scroll=${this._updateOverflowState} @mousedown=${this._handleDragStart}>
          ${this._visibleIndices.map(t=>z`
            <button
              class="tab-button ${t===this._selectedTabIndex?"active":""}"
              @click=${()=>this._selectTab(t,!0)}
            >
              ${this._renderedIcons[t]?z`<ha-icon .icon=${this._renderedIcons[t]}></ha-icon>`:""}
              ${this._renderedTitles[t]?z`<span>${this._renderedTitles[t]}</span>`:""}
              ${this._renderedBadges[t]?z`<span class="badge"></span>`:""}
            </button>`)}
        </div>
      </div>
    `,s=this._config.swipe_animation?"animate":"",o=this._config.swipe_animation&&"none"!==this._transitionDirection?"is-transitioning":"",a=z`
      <div 
        class="content-container ${s} ${o}" 
        @touchstart=${this._handleTouchStart}
        @touchmove=${this._handleTouchMove}
        @touchend=${this._handleTouchEnd}
      >
         ${this._cards.map((t,e)=>{const i=e===this._selectedTabIndex,n=e===this._prevSelectedTabIndex&&"none"!==this._transitionDirection,r=!i&&!n;let s="tab-panel";return i&&(s+=" active"),n&&(s+=" previous"),"none"!==this._transitionDirection&&(s+=` slide-${this._transitionDirection}`),z`
               <div class="${s}" ?hidden=${r}>
                  ${i||n?t:""}
               </div>
             `})}
      </div>
    `;return z`
      <div class="card-container ${n}" style=${Ye(t)}>
        ${"bottom"===this._config.tab_position?z`${a}${r}`:z`${r}${a}`}
      </div>
    `}};Ve.styles=o`
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
      /* overflow: visible allows nested cards (e.g. simple-swipe-card) to
         expand to their natural height without being clipped */
      overflow: visible;
    }


    .tabs-container {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      padding: 0px 2px;
      transform: translate3d(0,0,0);
      
      /* MASKING LOGIC FOR FADE EFFECT */
      /* Default: No mask (fully visible) */
      -webkit-mask-image: none;
      mask-image: none;
      transition: -webkit-mask-image 0.3s ease, mask-image 0.3s ease;
    }

    /* Only apply masks if fade is enabled and scroll is needed */
    .tabs-container.enable-fade.can-scroll-left {
      -webkit-mask-image: linear-gradient(to right, transparent, black 100px);
      mask-image: linear-gradient(to right, transparent, black 100px);
    }

    .tabs-container.enable-fade.can-scroll-right {
      -webkit-mask-image: linear-gradient(to left, transparent, black 100px);
      mask-image: linear-gradient(to left, transparent, black 100px);
    }

    .tabs-container.enable-fade.can-scroll-left.can-scroll-right {
      -webkit-mask-image: linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent);
      mask-image: linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent);
    }    
    
    .tabs { 
      display: flex; 
      flex-wrap: nowrap; 
      gap: var(--simple-tabs-gap, 6px); 
      overflow-x: auto;
      overflow-y: hidden;
      padding: 1px;
      background: transparent;
      border-radius: 0;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
      width: fit-content; 
      max-width: 100%;
    }
    
    .tabs.dragging { cursor: grabbing; }
    .tabs.dragging .tab-button { pointer-events: none; }
    .tabs::-webkit-scrollbar { display: none; }
    
    /* Alignment for tabs within the wide container */
    .tabs-container.align-start .tabs { 
      justify-content: flex-start; 
    }
    .tabs-container.align-center .tabs { 
      margin: 0 auto; 
    }
    .tabs-container.align-end {
      display: flex;
      justify-content: flex-end;
    }
    .tabs-container.align-end .tabs { 
      justify-content: flex-end;
    }
    
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
        top: -1px;
        right: 0px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--error-color, #db4437);
        pointer-events: none;
    }

    .tab-button:hover { 
      color: var(--simple-tabs-hover-color, var(--primary-text-color));
      outline-color: var(--simple-tabs-hover-color, var(--primary-text-color));
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
  `,t([ht({attribute:!1})],Ve.prototype,"hass",void 0),t([pt()],Ve.prototype,"_config",void 0),t([pt()],Ve.prototype,"_cards",void 0),t([pt()],Ve.prototype,"_selectedTabIndex",void 0),t([pt()],Ve.prototype,"_prevSelectedTabIndex",void 0),t([pt()],Ve.prototype,"_transitionDirection",void 0),t([pt()],Ve.prototype,"_tabVisibility",void 0),t([pt()],Ve.prototype,"_visibleIndices",void 0),t([pt()],Ve.prototype,"_renderedTitles",void 0),t([pt()],Ve.prototype,"_renderedIcons",void 0),t([pt()],Ve.prototype,"_renderedBadges",void 0),t([ft(".tabs")],Ve.prototype,"_tabsEl",void 0),t([ft(".content-container")],Ve.prototype,"_contentEl",void 0),Ve=t([lt("simple-tabs")],Ve),window.customCards=window.customCards||[],window.customCards.push({type:"simple-tabs",name:"Simple Tabs",preview:!0,description:"A card to display multiple cards in a tabbed interface."});export{Ve as SimpleTabs};
