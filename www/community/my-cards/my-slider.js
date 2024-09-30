/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,e,n,r){var i,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(s=(o<3?i(s):o>3?i(e,n,s):i(e,n))||s);return o>3&&s&&Object.defineProperty(e,n,s),s
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */}const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,n=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n}},r=`{{lit-${String(Math.random()).slice(2)}}}`,i=`\x3c!--${r}--\x3e`,o=new RegExp(`${r}|${i}`);class s{constructor(t,e){this.parts=[],this.element=e;const n=[],i=[],s=document.createTreeWalker(e.content,133,null,!1);let l=0,u=-1,h=0;const{strings:p,values:{length:m}}=t;for(;h<m;){const t=s.nextNode();if(null!==t){if(u++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let r=0;for(let t=0;t<n;t++)a(e[t].name,"$lit$")&&r++;for(;r-- >0;){const e=p[h],n=c.exec(e)[2],r=n.toLowerCase()+"$lit$",i=t.getAttribute(r);t.removeAttribute(r);const s=i.split(o);this.parts.push({type:"attribute",index:u,name:n,strings:s}),h+=s.length-1}}"TEMPLATE"===t.tagName&&(i.push(t),s.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(r)>=0){const r=t.parentNode,i=e.split(o),s=i.length-1;for(let e=0;e<s;e++){let n,o=i[e];if(""===o)n=d();else{const t=c.exec(o);null!==t&&a(t[2],"$lit$")&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),n=document.createTextNode(o)}r.insertBefore(n,t),this.parts.push({type:"node",index:++u})}""===i[s]?(r.insertBefore(d(),t),n.push(t)):t.data=i[s],h+=s}}else if(8===t.nodeType)if(t.data===r){const e=t.parentNode;null!==t.previousSibling&&u!==l||(u++,e.insertBefore(d(),t)),l=u,this.parts.push({type:"node",index:u}),null===t.nextSibling?t.data="":(n.push(t),u--),h++}else{let e=-1;for(;-1!==(e=t.data.indexOf(r,e+1));)this.parts.push({type:"node",index:-1}),h++}}else s.currentNode=i.pop()}for(const t of n)t.parentNode.removeChild(t)}}const a=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},l=t=>-1!==t.index,d=()=>document.createComment(""),c=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function u(t,e){const{element:{content:n},parts:r}=t,i=document.createTreeWalker(n,133,null,!1);let o=p(r),s=r[o],a=-1,l=0;const d=[];let c=null;for(;i.nextNode();){a++;const t=i.currentNode;for(t.previousSibling===c&&(c=null),e.has(t)&&(d.push(t),null===c&&(c=t)),null!==c&&l++;void 0!==s&&s.index===a;)s.index=null!==c?-1:s.index-l,o=p(r,o),s=r[o]}d.forEach(t=>t.parentNode.removeChild(t))}const h=t=>{let e=11===t.nodeType?0:1;const n=document.createTreeWalker(t,133,null,!1);for(;n.nextNode();)e++;return e},p=(t,e=-1)=>{for(let n=e+1;n<t.length;n++){const e=t[n];if(l(e))return n}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const m=new WeakMap,g=t=>"function"==typeof t&&m.has(t),f={},v={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class y{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),n=[],r=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let o,s=0,a=0,d=i.nextNode();for(;s<r.length;)if(o=r[s],l(o)){for(;a<o.index;)a++,"TEMPLATE"===d.nodeName&&(n.push(d),i.currentNode=d.content),null===(d=i.nextNode())&&(i.currentNode=n.pop(),d=i.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(d.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(d,o.name,o.strings,this.options));s++}else this.__parts.push(void 0),s++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const _=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),b=` ${r} `;class S{constructor(t,e,n,r){this.strings=t,this.values=e,this.type=n,this.processor=r}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let o=0;o<t;o++){const t=this.strings[o],s=t.lastIndexOf("\x3c!--");n=(s>-1||n)&&-1===t.indexOf("--\x3e",s+1);const a=c.exec(t);e+=null===a?t+(n?b:i):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+r}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==_&&(e=_.createHTML(e)),t.innerHTML=e,t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const w=t=>null===t||!("object"==typeof t||"function"==typeof t),x=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class ${constructor(t,e,n){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new P(this)}_getValue(){const t=this.strings,e=t.length-1,n=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=n[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!x(t))return t}let r="";for(let i=0;i<e;i++){r+=t[i];const e=n[i];if(void 0!==e){const t=e.value;if(w(t)||!x(t))r+="string"==typeof t?t:String(t);else for(const e of t)r+="string"==typeof e?e:String(e)}}return r+=t[e],r}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class P{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===f||w(t)&&t===this.value||(this.value=t,g(t)||(this.committer.dirty=!0))}commit(){for(;g(this.value);){const t=this.value;this.value=f,t(this)}this.value!==f&&this.committer.commit()}}class C{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(d()),this.endNode=t.appendChild(d())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=d()),t.__insert(this.endNode=d())}insertAfterPart(t){t.__insert(this.startNode=d()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}const t=this.__pendingValue;t!==f&&(w(t)?t!==this.value&&this.__commitText(t):t instanceof S?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):x(t)?this.__commitIterable(t):t===v?(this.value=v,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,n="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=n:this.__commitNode(document.createTextNode(n)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const n=new y(e,t.processor,this.options),r=n._clone();n.update(t.values),this.__commitNode(r),this.value=n}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,r=0;for(const i of t)n=e[r],void 0===n&&(n=new C(this.options),e.push(n),0===r?n.appendIntoPart(this):n.insertAfterPart(e[r-1])),n.setValue(i),n.commit(),r++;r<e.length&&(e.length=r,this.clear(n&&n.endNode))}clear(t=this.startNode){n(this.startNode.parentNode,t.nextSibling,this.endNode)}}class N{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n}setValue(t){this.__pendingValue=t}commit(){for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}if(this.__pendingValue===f)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=f}}class M extends ${constructor(t,e,n){super(t,e,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new T(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class T extends P{}let E=!1;(()=>{try{const t={get capture(){return E=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class k{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}if(this.__pendingValue===f)return;const t=this.__pendingValue,e=this.value,n=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),r=null!=t&&(null==e||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),r&&(this.__options=A(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=f}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const A=t=>t&&(E?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function O(t){let e=V.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},V.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const i=t.strings.join(r);return n=e.keyString.get(i),void 0===n&&(n=new s(t,t.getTemplateElement()),e.keyString.set(i,n)),e.stringsArray.set(t.strings,n),n}const V=new Map,D=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const R=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,n,r){const i=e[0];if("."===i){return new M(t,e.slice(1),n).parts}if("@"===i)return[new k(t,e.slice(1),r.eventContext)];if("?"===i)return[new N(t,e.slice(1),n)];return new $(t,e,n).parts}handleTextExpression(t){return new C(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const Y=(t,...e)=>new S(t,e,"html",R)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,H=(t,e)=>`${t}--${e}`;let U=!0;void 0===window.ShadyCSS?U=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),U=!1);const B=t=>e=>{const n=H(e.type,t);let i=V.get(n);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},V.set(n,i));let o=i.stringsArray.get(e.strings);if(void 0!==o)return o;const a=e.strings.join(r);if(o=i.keyString.get(a),void 0===o){const n=e.getTemplateElement();U&&window.ShadyCSS.prepareTemplateDom(n,t),o=new s(e,n),i.keyString.set(a,o)}return i.stringsArray.set(e.strings,o),o},I=["html","svg"],L=new Set,z=(t,e,n)=>{L.add(t);const r=n?n.element:document.createElement("template"),i=e.querySelectorAll("style"),{length:o}=i;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(r,t);const s=document.createElement("style");for(let t=0;t<o;t++){const e=i[t];e.parentNode.removeChild(e),s.textContent+=e.textContent}(t=>{I.forEach(e=>{const n=V.get(H(e,t));void 0!==n&&n.keyString.forEach(t=>{const{element:{content:e}}=t,n=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{n.add(t)}),u(t,n)})})})(t);const a=r.content;n?function(t,e,n=null){const{element:{content:r},parts:i}=t;if(null==n)return void r.appendChild(e);const o=document.createTreeWalker(r,133,null,!1);let s=p(i),a=0,l=-1;for(;o.nextNode();){l++;for(o.currentNode===n&&(a=h(e),n.parentNode.insertBefore(e,n));-1!==s&&i[s].index===l;){if(a>0){for(;-1!==s;)i[s].index+=a,s=p(i,s);return}s=p(i,s)}}}(n,s,a.firstChild):a.insertBefore(s,a.firstChild),window.ShadyCSS.prepareTemplateStyles(r,t);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)e.insertBefore(l.cloneNode(!0),e.firstChild);else if(n){a.insertBefore(s,a.firstChild);const t=new Set;t.add(s),u(n,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const F={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},j=(t,e)=>e!==t&&(e==e||t==t),W={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:j};class q extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,n)=>{const r=this._attributeNameForProperty(n,e);void 0!==r&&(this._attributeToPropertyMap.set(r,n),t.push(r))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=W){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const n="symbol"==typeof t?Symbol():"__"+t,r=this.getPropertyDescriptor(t,n,e);void 0!==r&&Object.defineProperty(this.prototype,t,r)}static getPropertyDescriptor(t,e,n){return{get(){return this[e]},set(r){const i=this[t];this[e]=r,this.requestUpdateInternal(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||W}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const n of e)this.createProperty(n,t[n])}}static _attributeNameForProperty(t,e){const n=e.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,n=j){return n(t,e)}static _propertyValueFromAttribute(t,e){const n=e.type,r=e.converter||F,i="function"==typeof r?r:r.fromAttribute;return i?i(t,n):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const n=e.type,r=e.converter;return(r&&r.toAttribute||F.toAttribute)(t,n)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,n){e!==n&&this._attributeToProperty(t,n)}_propertyToAttribute(t,e,n=W){const r=this.constructor,i=r._attributeNameForProperty(t,n);if(void 0!==i){const t=r._propertyValueToAttribute(e,n);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(i):this.setAttribute(i,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const n=this.constructor,r=n._attributeToPropertyMap.get(t);if(void 0!==r){const t=n.getPropertyOptions(r);this._updateState=16|this._updateState,this[r]=n._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,n){let r=!0;if(void 0!==t){const i=this.constructor;n=n||i.getPropertyOptions(t),i._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==n.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):r=!1}!this._hasRequestedUpdate&&r&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}q.finalized=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const J=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?Object.assign(Object.assign({},e),{finisher(n){n.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(n){n.createProperty(e.key,t)}};function Z(t){return(e,n)=>void 0!==n?((t,e,n)=>{e.constructor.createProperty(n,t)})(t,e,n):J(t,e)}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const G=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol();class K{constructor(t,e){if(e!==X)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(G?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const Q=(t,...e)=>{const n=e.reduce((e,n,r)=>e+(t=>{if(t instanceof K)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+t[r+1],t[0]);return new K(n,X)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const tt={};class et extends q{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,n)=>t.reduceRight((t,n)=>Array.isArray(n)?e(n,t):(t.add(n),t),n),n=e(t,new Set),r=[];n.forEach(t=>r.unshift(t)),this._styles=r}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map(t=>{if(t instanceof CSSStyleSheet&&!G){const e=Array.prototype.slice.call(t.cssRules).reduce((t,e)=>t+e.cssText,"");return new K(String(e),X)}return t})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?G?this.renderRoot.adoptedStyleSheets=t.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==tt&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){return tt}}et.finalized=!0,et.render=(t,e,r)=>{if(!r||"object"!=typeof r||!r.scopeName)throw new Error("The `scopeName` option is required.");const i=r.scopeName,o=D.has(e),s=U&&11===e.nodeType&&!!e.host,a=s&&!L.has(i),l=a?document.createDocumentFragment():e;if(((t,e,r)=>{let i=D.get(e);void 0===i&&(n(e,e.firstChild),D.set(e,i=new C(Object.assign({templateFactory:O},r))),i.appendInto(e)),i.setValue(t),i.commit()})(t,l,Object.assign({templateFactory:B(i)},r)),a){const t=D.get(l);D.delete(l);const r=t.value instanceof y?t.value.template:void 0;z(i,l,r),n(e,e.firstChild),e.appendChild(l),D.set(e,t)}!o&&s&&window.ShadyCSS.styleElement(e.host)},et.shadowRootOptions={mode:"open"};var nt=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,rt="[^\\s]+",it=/\[([^]*?)\]/gm;function ot(t,e){for(var n=[],r=0,i=t.length;r<i;r++)n.push(t[r].substr(0,e));return n}var st=function(t){return function(e,n){var r=n[t].map((function(t){return t.toLowerCase()})).indexOf(e.toLowerCase());return r>-1?r:null}};function at(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var r=0,i=e;r<i.length;r++){var o=i[r];for(var s in o)t[s]=o[s]}return t}var lt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dt=["January","February","March","April","May","June","July","August","September","October","November","December"],ct=ot(dt,3),ut={dayNamesShort:ot(lt,3),dayNames:lt,monthNamesShort:ct,monthNames:dt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},ht=at({},ut),pt=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},mt={D:function(t){return String(t.getDate())},DD:function(t){return pt(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return pt(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return pt(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return pt(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return pt(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return pt(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return pt(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return pt(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return pt(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return pt(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return pt(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+pt(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+pt(Math.floor(Math.abs(e)/60),2)+":"+pt(Math.abs(e)%60,2)}},gt=function(t){return+t-1},ft=[null,"[1-9]\\d?"],vt=[null,rt],yt=["isPm",rt,function(t,e){var n=t.toLowerCase();return n===e.amPm[0]?0:n===e.amPm[1]?1:null}],_t=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var n=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?n:-n}return 0}],bt=(st("monthNamesShort"),st("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var St,wt,xt=function(t,e,n){if(void 0===e&&(e=bt.default),void 0===n&&(n={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var r=[];e=(e=bt[e]||e).replace(it,(function(t,e){return r.push(e),"@@@"}));var i=at(at({},ht),n);return(e=e.replace(nt,(function(e){return mt[e](t,i)}))).replace(/@@@/g,(function(){return r.shift()}))};(function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}})(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}();(wt=St||(St={})).language="language",wt.system="system",wt.comma_decimal="comma_decimal",wt.decimal_comma="decimal_comma",wt.space_comma="space_comma",wt.none="none";var $t=!1;if("undefined"!=typeof window){var Pt={get passive(){$t=!0}};window.addEventListener("testPassive",null,Pt),window.removeEventListener("testPassive",null,Pt)}var Ct="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1),Nt=[],Mt=!1,Tt=-1,Et=void 0,kt=void 0,At=void 0,Ot=function(t){return Nt.some((function(e){return!(!e.options.allowTouchMove||!e.options.allowTouchMove(t))}))},Vt=function(t){var e=t||window.event;return!!Ot(e.target)||(e.touches.length>1||(e.preventDefault&&e.preventDefault(),!1))},Dt=function(t,e){if(t){if(!Nt.some((function(e){return e.targetElement===t}))){var n={targetElement:t,options:e||{}};Nt=[].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}(Nt),[n]),Ct?window.requestAnimationFrame((function(){if(void 0===kt){kt={position:document.body.style.position,top:document.body.style.top,left:document.body.style.left};var t=window,e=t.scrollY,n=t.scrollX,r=t.innerHeight;document.body.style.position="fixed",document.body.style.top=-e,document.body.style.left=-n,setTimeout((function(){return window.requestAnimationFrame((function(){var t=r-window.innerHeight;t&&e>=r&&(document.body.style.top=-(e+t))}))}),300)}})):function(t){if(void 0===At){var e=!!t&&!0===t.reserveScrollBarGap,n=window.innerWidth-document.documentElement.clientWidth;if(e&&n>0){var r=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"),10);At=document.body.style.paddingRight,document.body.style.paddingRight=r+n+"px"}}void 0===Et&&(Et=document.body.style.overflow,document.body.style.overflow="hidden")}(e),Ct&&(t.ontouchstart=function(t){1===t.targetTouches.length&&(Tt=t.targetTouches[0].clientY)},t.ontouchmove=function(e){1===e.targetTouches.length&&function(t,e){var n=t.targetTouches[0].clientY-Tt;!Ot(t.target)&&(e&&0===e.scrollTop&&n>0||function(t){return!!t&&t.scrollHeight-t.scrollTop<=t.clientHeight}(e)&&n<0?Vt(t):t.stopPropagation())}(e,t)},Mt||(document.addEventListener("touchmove",Vt,$t?{passive:!1}:void 0),Mt=!0))}}else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")},Rt=function(t){t?(Nt=Nt.filter((function(e){return e.targetElement!==t})),Ct&&(t.ontouchstart=null,t.ontouchmove=null,Mt&&0===Nt.length&&(document.removeEventListener("touchmove",Vt,$t?{passive:!1}:void 0),Mt=!1)),Ct?function(){if(void 0!==kt){var t=-parseInt(document.body.style.top,10),e=-parseInt(document.body.style.left,10);document.body.style.position=kt.position,document.body.style.top=kt.top,document.body.style.left=kt.left,window.scrollTo(e,t),kt=void 0}}():(void 0!==At&&(document.body.style.paddingRight=At,At=void 0),void 0!==Et&&(document.body.style.overflow=Et,Et=void 0))):console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")};var Yt={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},Ht={common:Yt},Ut={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"},Bt={common:Ut};const It={en:Object.freeze({__proto__:null,common:Yt,default:Ht}),nb:Object.freeze({__proto__:null,common:Ut,default:Bt})};console.info(`%c  ---- MY-SLIDER ---- \n%c  ${function(t,e="",n=""){const r=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let i;try{i=t.split(".").reduce((t,e)=>t[e],It[r])}catch(e){i=t.split(".").reduce((t,e)=>t[e],It.en)}return void 0===i&&(i=t.split(".").reduce((t,e)=>t[e],It.en)),""!==e&&""!==n&&(i=i.replace(e,n)),i}("common.version")} 3.0.6    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: green"),window.customCards=window.customCards||[],window.customCards.push({type:"my-slider",name:"Slider Card",description:"Custom Slider Card for Lovelace."});let Lt=class extends et{static getStubConfig(){return{}}static get properties(){return{hass:{},config:{},active:{}}}setConfig(t){const e=["input_number","number","light","media_player","cover","fan","switch","lock"];if(!t.entity)throw new Error("You need to define entity");if(!e.includes(t.entity.split(".")[0]))throw new Error("Entity has to be one of the following: "+e.map(t=>" "+t));this.config=Object.assign({name:"MySlider",disabled_scroll:!1},t)}shouldUpdate(t){return!!this.config&&function(t,e,n){if(e.has("config")||n)return!0;if(t.config.entity){var r=e.get("hass");return!r||r.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}(this,t,!1)}render(){var t,e=JSON.parse(JSON.stringify(this.config));const n=this.config.entity?this.config.entity:"ERROR: NO ENTITY ID",r=(null===(t=this.config.entity)||void 0===t||t.split(".")[1],this.hass.states[""+n]);var i=e.step?e.step:"1",o=e.minBar?e.minBar:0,s=e.maxBar?e.maxBar:100,a=e.minSet?e.minSet:0,l=e.maxSet?e.maxSet:100;(n.includes("input_number.")||n.includes("number."))&&(i=e.step?e.step:r.attributes.step,a=e.minSet?e.minSet:r.attributes.min,l=e.maxSet?e.maxSet:r.attributes.max);var d=e.width?e.width:"100%",c=e.height?e.height:"50px",u=e.radius?e.radius:"4px",h=e.top?e.top:"0px",p=e.bottom?e.bottom:"0px",m=e.right?e.right:"0px",g=e.left?e.left:"0px",f=e.rotate?e.rotate:"0",v=e.containerHeight?e.containerHeight:c;"0"!=f&&(f+="deg");var y=e.mainSliderColor?e.mainSliderColor:"var(--accent-color)",_=e.secondarySliderColor?e.secondarySliderColor:"#4d4d4d",b=e.mainSliderColorOff?e.mainSliderColorOff:"#636363",S=e.secondarySliderColorOff?e.secondarySliderColorOff:"#4d4d4d",w=e.border?e.border:"0",x=e.thumbWidth?e.thumbWidth:"25px",$=e.thumbHeight?e.thumbHeight:"80px",P=e.thumbColor?e.thumbColor:"#FFFFFF",C=e.thumbColorOff?e.thumbColorOff:"#969696",N=e.thumbHorizontalPadding?e.thumbHorizontalPadding:"10px",M=e.thumbVerticalPadding?e.thumbVerticalPadding:"20px",T=e.thumpTop?e.thumpTop:"calc((var(--slider-width) - var(--thumb-height)) / 2)",E=e.thumbBorderRight?e.thumbBorderRight:"var(--thumb-horizontal-padding) solid var(--slider-main-color)",k=e.thumbBorderLeft?e.thumbBorderLeft:"var(--thumb-horizontal-padding) solid var(--slider-main-color)",A=e.thumbBorderTop?e.thumbBorderTop:"var(--thumb-vertical-padding) solid var(--slider-main-color)",O=e.thumbBorderBotton?e.thumbBorderBotton:"var(--thumb-vertical-padding) solid var(--slider-main-color)",V=!!e.lockTrack&&e.lockTrack,D=`\n\t\t\t--slider-width: ${d};\n\t\t\t--slider-width-inverse: -${d};\n\t\t\t--slider-height: ${c};\n\t\t\t--slider-main-color: ${"off"===r.state||"locked"===r.state||null==r.state?"var(--slider-main-color-off)":"var(--slider-main-color-on)"};\n\t\t\t--slider-main-color-on: ${y};\n\t\t\t--slider-main-color-off: ${b};\n\t\t\t--slider-secondary-color: ${"off"===r.state||"locked"===r.state||null==r.state?"var(--slider-secondary-color-off)":"var(--slider-secondary-color-on)"};\n\t\t\t--slider-secondary-color-on: ${_};\n\t\t\t--slider-secondary-color-off: ${S};\n\t\t\t--slider-radius: ${u};\n\t\t\t--border: ${w};\n\n\t\t\t--thumb-width: ${x};\n\t\t\t--thumb-height: ${$};\n\t\t\t--thumb-color: ${"off"===r.state||null==r.state?"var(--thumb-color-off)":"var(--thumb-color-on)"};\n\t\t\t--thumb-color-on: ${P};\n\t\t\t--thumb-color-off: ${C};\n\t\t\t--thumb-horizontal-padding: ${N};\n\t\t\t--thumb-vertical-padding: ${M};\n\n\t\t\t--rotate: ${f};\n\t\t\t--top: ${h};\n\t\t\t--bottom: ${p};\n\t\t\t--right: ${m};\n\t\t\t--left: ${g};\n\t\t\t--container-height: ${v};\n\t\t\t--thumb-top: ${T};\n\t\t\t--thumb-border-right: ${E};\n\t\t\t--thumb-border-left: ${k};\n\t\t\t--thumb-border-top: ${A};\n\t\t\t--thumb-border-bottom: ${O};\n\t\t\t\n\t\t\t--lock-track-container: ${V?"none":"auto"};\n\t\t`;const R=t=>{n.includes("light.")?"Warmth"==e.function?this._setWarmth(r,t.target,a,l):this._setBrightness(r,t.target,a,l):n.includes("input_number.")||n.includes("number.")?this._setInputNumber(r,t.target,a,l):n.includes("media_player.")?this._setMediaVolume(r,t.target,a,l):n.includes("cover.")?this._setCover(r,t.target,a,l):n.includes("fan.")?this._setFan(r,t.target,a,l):n.includes("switch.")?this._setSwitch(r,t.target,a,l,o,s):n.includes("lock.")&&this._setLock(r,t.target,a,l,o,s)},H=t=>{e.intermediate&&R(t)},U=t=>{e.intermediate||R(t)},B=()=>{this.config.disabled_scroll=!this.config.disabled_scroll,this.config.disabled_scroll?Dt(window):Rt(window)};if(n.includes("light."))return"Warmth"==e.function?Y`
					<ha-card>
						<div class="slider-container" style="${D}">
							<input name="foo" type="range" class="${r.state}" style="${D}"
								min="${r.attributes.min_mireds}" max="${r.attributes.max_mireds}"
								step="${i}" .value="${"off"===r.state?0:r.attributes.color_temp}"
								@input=${H} @change=${U}
								@touchstart=${e.toggle_scroll?B:null}
								@touchend=${e.toggle_scroll?B:null} >
						</div>
					</ha-card>
				`:Y`
					<ha-card>
						<div class="slider-container" style="${D}">
							<input name="foo" type="range" class="${r.state}" style="${D}"
								step="${i}" .value="${"off"===r.state?0:Math.round(r.attributes.brightness/2.56)}"
								@input=${H} @change=${U}
								@touchstart=${e.toggle_scroll?B:null}
								@touchend=${e.toggle_scroll?B:null} >
						</div>
					</ha-card>
				`;if(n.includes("input_number.")||n.includes("number."))return Y`
				<ha-card>
					<div class="slider-container" style="${D}">
						<input name="foo" type="range" class="${r.state}" style="${D}"
							min="${a}" max="${l}"
							step="${i}" .value="${r.state}"
							@input=${H} @change=${U}
							@touchstart=${e.toggle_scroll?B:null}
							@touchend=${e.toggle_scroll?B:null} >
					</div>
				</ha-card>
			`;if(n.includes("media_player.")){var I=0;if(null!=r.attributes.volume_level)I=Number(100*r.attributes.volume_level);return Y`
				<ha-card>
					<div class="slider-container" style="${D}">
						<input name="foo" type="range" class="${r.state}" style="${D}"
							min="${o}" max="${s}" step="${i}" .value="${I}"
							@input=${H} @change=${U}
							@touchstart=${e.toggle_scroll?B:null}
							@touchend=${e.toggle_scroll?B:null} >
					</div>
				</ha-card>
			`}return n.includes("cover.")?Y`
				<ha-card>
					<div class="slider-container" style="${D}">
						<input name="foo" type="range" class="${r.state}" style="${D}"
							min="${o}" max="${s}" step="${i}"
							.value="${r.attributes.current_position}"
							@input=${H} @change=${U}
							@touchstart=${e.toggle_scroll?B:null}
							@touchend=${e.toggle_scroll?B:null} >
					</div>
				</ha-card>
			`:n.includes("fan.")?Y`
				<ha-card>
					<div class="slider-container" style="${D}">
						<input name="foo" type="range" class="${r.state}" style="${D}"
							min="${o}" max="${s}" step="${i}"
							.value="${r.attributes.percentage}"
							@input=${H} @change=${U}
							@touchstart=${e.toggle_scroll?B:null}
							@touchend=${e.toggle_scroll?B:null} >
					</div>
				</ha-card>
			`:n.includes("switch.")||n.includes("lock.")?Y`
				<ha-card>
					<div class="slider-container" style="${D}">
						<input name="foo" type="range" class="${r.state}" style="${D}"
							min="${o}" max="${s}" step="${i}" .value="${o}"
							@input=${H} @change=${U}
							@touchstart=${e.toggle_scroll?B:null}
							@touchend=${e.toggle_scroll?B:null} >
					</div>
				</ha-card>
			`:void 0}_setBrightness(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),this.hass.callService("homeassistant","turn_on",{entity_id:t.entity_id,brightness:2.56*i}),e.value=i}_setWarmth(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),this.hass.callService("homeassistant","turn_on",{entity_id:t.entity_id,color_temp:i}),e.value=i}_setInputNumber(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),t.entity_id.includes("input_number.")?this.hass.callService("input_number","set_value",{entity_id:t.entity_id,value:i}):t.entity_id.includes("number.")&&this.hass.callService("number","set_value",{entity_id:t.entity_id,value:i}),e.value=i}_setFan(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),this.hass.callService("fan","set_percentage",{entity_id:t.entity_id,percentage:i}),e.value=i}_setCover(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),this.hass.callService("cover","set_cover_position",{entity_id:t.entity_id,position:i}),e.value=i}_setMediaVolume(t,e,n,r){var i=e.value;i>r?i=r:i<n&&(i=n),this.hass.callService("media_player","volume_set",{entity_id:t.entity_id,volume_level:i/100}),e.value=i}_setSwitch(t,e,n,r,i,o){var s=e.value,a=Math.min(r,o);Number(a)<=s&&this.hass.callService("homeassistant","toggle",{entity_id:t.entity_id}),e.value=Number(Math.max(n,i))}_setLock(t,e,n,r,i,o){var s=e.value,a=Math.min(r,o);if(Number(a)<=s){var l="locked"===t.state?"unlock":"lock";this.hass.callService("lock",l,{entity_id:t.entity_id})}e.value=Number(Math.max(n,i))}static get styles(){return Q`
			.slider-container {
				height: var(--container-height);
				position: relative;
				overflow: hidden;
				border-radius: var(--slider-radius);
			}

			.slider-container input[type="range"] {
				outline: 0;
				border: var(--border);
				width: var(--slider-width);
				height: var(--slider-height);
				border-radius: var(--slider-radius);
				background-color: var(--slider-secondary-color); /*Remaining Slider color*/
				margin: 0;
				transition: box-shadow 0.2s ease-in-out;
				overflow: hidden;
				-webkit-appearance: none;
				position: absolute;
				top: var(--top);
				bottom: var(--bottom);
				right: var(--right);
				left: var(--left);
				-webkit-transform: rotate(var(--rotate));
				-moz-transform: rotate(var(--rotate));
				-o-transform: rotate(var(--rotate));
				-ms-transform: rotate(var(--rotate));
				transform: rotate(var(--rotate));
				pointer-events: var(--lock-track-container);
			}

			.slider-container input[type="range"]::-webkit-slider-runnable-track {
				height: var(--slider-height);
				-webkit-appearance: none;
				color: var(--slider-main-color);
				transition: box-shadow 0.2s ease-in-out;
			}

			.slider-container input[type="range"]::-webkit-slider-thumb {
				width: var(--thumb-width);
				height: var(--thumb-height);
				-webkit-appearance: none;
				cursor: ew-resize;
				border-radius: 0;
				transition: box-shadow 0.2s ease-in-out;
				position: relative;

				box-shadow: -3500px 0 0 3500px var(--slider-main-color), inset 0 0 0 25px var(--thumb-color);

				top: var(--thumb-top);
				border-right: var(--thumb-border-right);
				border-left: var(--thumb-border-left);
				border-top: var(--thumb-border-top);
				border-bottom: var(--thumb-border-bottom);
				pointer-events: auto;
			}

			.slider-container input[type=range]::-moz-range-thumb {
			  width: calc(var(--thumb-width) / 4);
			  height: calc(var(--thumb-height) / 2);
			  box-shadow: -3500px 10px 0 3500px var(--slider-main-color), inset 0 0 0 25px var(--thumb-color);
			  top: var(--thumb-top);
			  cursor: ew-resize;
			  border-radius: 0;
			  transition: box-shadow 0.2s ease-in-out;
			  position: relative;
			  border-radius: 0;
			  border-right: var(--thumb-border-right);
			  border-left: var(--thumb-border-left);
			  border-top: var(--thumb-border-top);
			  border-bottom: var(--thumb-border-bottom);
			  pointer-events: auto;
			}

			.slider-container input[type="range"]::-webkit-slider-thumb:hover {
				cursor: default;
			}

			.slider-container input[type="range"]:hover {
			  cursor: default;
			}
		`}};var zt,Ft;t([Z({attribute:!1})],Lt.prototype,"hass",void 0),t([Z({attribute:!1,hasChanged:null==zt?void 0:zt.hasChanged})],Lt.prototype,"config",void 0),Lt=t([(Ft="my-slider",t=>"function"==typeof t?((t,e)=>(window.customElements.define(t,e),e))(Ft,t):((t,e)=>{const{kind:n,elements:r}=e;return{kind:n,elements:r,finisher(e){window.customElements.define(t,e)}}})(Ft,t))],Lt);export{Lt as MySlider};
