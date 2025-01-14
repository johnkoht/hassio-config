/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$4 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s = Symbol(), o$2 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$4 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$2.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$2.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s), i$2 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s);
}, S$1 = (s2, o2) => {
  if (e$4) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$4 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$1, defineProperty: e$3, getOwnPropertyDescriptor: r$3, getOwnPropertyNames: h$2, getOwnPropertySymbols: o$1, getPrototypeOf: n$2 } = Object, a = globalThis, c$1 = a.trustedTypes, l = c$1 ? c$1.emptyScript : "", p = a.reactiveElementPolyfillSupport, d = (t2, s2) => t2, u = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$2 = (t2, s2) => !i$1(t2, s2), y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f$2 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class b extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = y) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), r2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== r2 && e$3(this.prototype, t2, r2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: h2 } = r$3(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get() {
      return e2 == null ? void 0 : e2.call(this);
    }, set(s3) {
      const r2 = e2 == null ? void 0 : e2.call(this);
      h2.call(this, s3), this.requestUpdate(t2, r2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t3 = this.properties, s2 = [...h$2(t3), ...o$1(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$EC(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const r2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u).toAttribute(s2, i2.type);
      this._$Em = t2, null == r2 ? this.removeAttribute(e2) : this.setAttribute(e2, r2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), r2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u;
      this._$Em = e2, this[e2] = r2.fromAttribute(s2, t3.type), this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    if (void 0 !== t2) {
      if (i2 ?? (i2 = this.constructor.getPropertyOptions(t2)), !(i2.hasChanged ?? f$2)(this[t2], s2)) return;
      this.P(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t2, s2, i2) {
    this._$AL.has(t2) || this._$AL.set(t2, s2), true === i2.reflect && this._$Em !== t2 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t2);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) true !== i2.wrapped || this._$AL.has(s3) || void 0 === this[s3] || this.P(s3, this[s3], i2);
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EU();
    } catch (s3) {
      throw t2 = false, this._$EU(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t3) => this._$EC(t3, this[t3]))), this._$EU();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p == null ? void 0 : p({ ReactiveElement: b }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n$1 = globalThis, c = n$1.trustedTypes, h$1 = c ? c.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, f$1 = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, m = "?" + v, _ = `<${m}>`, w = document, lt = () => w.createComment(""), st$1 = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, g = Array.isArray, $ = (t2) => g(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), x = "[ 	\n\f\r]", T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, E = /-->/g, k = />/g, O = RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), S = /'/g, j = /"/g, M = /^(?:script|style|textarea|title)$/i, P = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), ke = P(1), R = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), V = /* @__PURE__ */ new WeakMap(), I = w.createTreeWalker(w, 129);
function N(t2, i2) {
  if (!g(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== h$1 ? h$1.createHTML(i2) : i2;
}
const U = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let h2, o2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", n3 = T;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let r2, l2, c2 = -1, a2 = 0;
    for (; a2 < s3.length && (n3.lastIndex = a2, l2 = n3.exec(s3), null !== l2); ) a2 = n3.lastIndex, n3 === T ? "!--" === l2[1] ? n3 = E : void 0 !== l2[1] ? n3 = k : void 0 !== l2[2] ? (M.test(l2[2]) && (h2 = RegExp("</" + l2[2], "g")), n3 = O) : void 0 !== l2[3] && (n3 = O) : n3 === O ? ">" === l2[0] ? (n3 = h2 ?? T, c2 = -1) : void 0 === l2[1] ? c2 = -2 : (c2 = n3.lastIndex - l2[2].length, r2 = l2[1], n3 = void 0 === l2[3] ? O : '"' === l2[3] ? j : S) : n3 === j || n3 === S ? n3 = O : n3 === E || n3 === k ? n3 = T : (n3 = O, h2 = void 0);
    const u2 = n3 === O && t2[i3 + 1].startsWith("/>") ? " " : "";
    o2 += n3 === T ? s3 + _ : c2 >= 0 ? (e2.push(r2), s3.slice(0, c2) + f$1 + s3.slice(c2) + v + u2) : s3 + v + (-2 === c2 ? i3 : u2);
  }
  return [N(t2, o2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class B {
  constructor({ strings: t2, _$litType$: i2 }, s2) {
    let e2;
    this.parts = [];
    let h2 = 0, o2 = 0;
    const n3 = t2.length - 1, r2 = this.parts, [l2, a2] = U(t2, i2);
    if (this.el = B.createElement(l2, s2), I.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (e2 = I.nextNode()) && r2.length < n3; ) {
      if (1 === e2.nodeType) {
        if (e2.hasAttributes()) for (const t3 of e2.getAttributeNames()) if (t3.endsWith(f$1)) {
          const i3 = a2[o2++], s3 = e2.getAttribute(t3).split(v), n4 = /([.?@])?(.*)/.exec(i3);
          r2.push({ type: 1, index: h2, name: n4[2], strings: s3, ctor: "." === n4[1] ? Y : "?" === n4[1] ? Z : "@" === n4[1] ? q : G }), e2.removeAttribute(t3);
        } else t3.startsWith(v) && (r2.push({ type: 6, index: h2 }), e2.removeAttribute(t3));
        if (M.test(e2.tagName)) {
          const t3 = e2.textContent.split(v), i3 = t3.length - 1;
          if (i3 > 0) {
            e2.textContent = c ? c.emptyScript : "";
            for (let s3 = 0; s3 < i3; s3++) e2.append(t3[s3], lt()), I.nextNode(), r2.push({ type: 2, index: ++h2 });
            e2.append(t3[i3], lt());
          }
        }
      } else if (8 === e2.nodeType) if (e2.data === m) r2.push({ type: 2, index: h2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = e2.data.indexOf(v, t3 + 1)); ) r2.push({ type: 7, index: h2 }), t3 += v.length - 1;
      }
      h2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = w.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function z(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === R) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2.o) == null ? void 0 : _a2[e2] : s2.l;
  const o2 = st$1(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2.o ?? (s2.o = []))[e2] = h2 : s2.l = h2), void 0 !== h2 && (i2 = z(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class F {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? w).importNode(i2, true);
    I.currentNode = e2;
    let h2 = I.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new et(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new K(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = I.nextNode(), o2++);
    }
    return I.currentNode = w, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class et {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this.v;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this.v = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = z(this, t2, i2), st$1(t2) ? t2 === D || null == t2 || "" === t2 ? (this._$AH !== D && this._$AR(), this._$AH = D) : t2 !== this._$AH && t2 !== R && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : $(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== D && st$1(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(w.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = B.createElement(N(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new F(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = V.get(t2.strings);
    return void 0 === i2 && V.set(t2.strings, i2 = new B(t2)), i2;
  }
  k(t2) {
    g(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new et(this.O(lt()), this.O(lt()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this.v = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = D, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = D;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = z(this, t2, i2, 0), o2 = !st$1(t2) || t2 !== this._$AH && t2 !== R, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = z(this, e3[s2 + n3], i2, n3), r2 === R && (r2 = this._$AH[n3]), o2 || (o2 = !st$1(r2) || r2 !== this._$AH[n3]), r2 === D ? t2 = D : t2 !== D && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class Y extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === D ? void 0 : t2;
  }
}
class Z extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== D);
  }
}
class q extends G {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = z(this, t2, i2, 0) ?? D) === R) return;
    const s2 = this._$AH, e2 = t2 === D && s2 !== D || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== D && (s2 === D || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class K {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    z(this, t2);
  }
}
const Re = n$1.litHtmlPolyfillSupport;
Re == null ? void 0 : Re(B, et), (n$1.litHtmlVersions ?? (n$1.litHtmlVersions = [])).push("3.2.0");
const Q = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new et(i2.insertBefore(lt(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class h extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.o = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const e2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this.o = Q(e2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this.o) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this.o) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return R;
  }
}
h._$litElement$ = true, h["finalized"] = true, (_a = globalThis.litElementHydrateSupport) == null ? void 0 : _a.call(globalThis, { LitElement: h });
const f = globalThis.litElementPolyfillSupport;
f == null ? void 0 : f({ LitElement: h });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f$2 }, r$2 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.P(o2, void 0, t2), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$2(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, r2 ? { ...t3, wrapped: true } : t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r$1(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$2 = (e2, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c2), c2);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e$1(e2, r2) {
  return (n3, s2, i2) => {
    const o2 = (t2) => {
      var _a2;
      return ((_a2 = t2.renderRoot) == null ? void 0 : _a2.querySelector(e2)) ?? null;
    };
    return e$2(n3, s2, { get() {
      return o2(this);
    } });
  };
}
var Section = /* @__PURE__ */ ((Section2) => {
  Section2["MEDIA_BROWSER"] = "media browser";
  Section2["GROUPS"] = "groups";
  Section2["PLAYER"] = "player";
  Section2["GROUPING"] = "grouping";
  Section2["VOLUMES"] = "volumes";
  Section2["QUEUE"] = "queue";
  return Section2;
})(Section || {});
var MediaPlayerEntityFeature = /* @__PURE__ */ ((MediaPlayerEntityFeature2) => {
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["PAUSE"] = 1] = "PAUSE";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["SEEK"] = 2] = "SEEK";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["VOLUME_SET"] = 4] = "VOLUME_SET";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["VOLUME_MUTE"] = 8] = "VOLUME_MUTE";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["PREVIOUS_TRACK"] = 16] = "PREVIOUS_TRACK";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["NEXT_TRACK"] = 32] = "NEXT_TRACK";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["TURN_ON"] = 128] = "TURN_ON";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["TURN_OFF"] = 256] = "TURN_OFF";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["PLAY_MEDIA"] = 512] = "PLAY_MEDIA";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["VOLUME_BUTTONS"] = 1024] = "VOLUME_BUTTONS";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["SELECT_SOURCE"] = 2048] = "SELECT_SOURCE";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["STOP"] = 4096] = "STOP";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["CLEAR_PLAYLIST"] = 8192] = "CLEAR_PLAYLIST";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["PLAY"] = 16384] = "PLAY";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["SHUFFLE_SET"] = 32768] = "SHUFFLE_SET";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["SELECT_SOUND_MODE"] = 65536] = "SELECT_SOUND_MODE";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["BROWSE_MEDIA"] = 131072] = "BROWSE_MEDIA";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["REPEAT_SET"] = 262144] = "REPEAT_SET";
  MediaPlayerEntityFeature2[MediaPlayerEntityFeature2["GROUPING"] = 524288] = "GROUPING";
  return MediaPlayerEntityFeature2;
})(MediaPlayerEntityFeature || {});
var mdiAlarm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z";
var mdiCheck = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";
var mdiCheckCircle = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";
var mdiCloseCircle = "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z";
var mdiCog = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";
var mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
var mdiFastForward = "M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z";
var mdiPen = "M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z";
var mdiPlaylistEdit = "M3 6V8H14V6H3M3 10V12H14V10H3M20 10.1C19.9 10.1 19.7 10.2 19.6 10.3L18.6 11.3L20.7 13.4L21.7 12.4C21.9 12.2 21.9 11.8 21.7 11.6L20.4 10.3C20.3 10.2 20.2 10.1 20 10.1M18.1 11.9L12 17.9V20H14.1L20.2 13.9L18.1 11.9M3 14V16H10V14H3Z";
var mdiPlaylistRemove = "M14 10H3V12H14V10M14 6H3V8H14V6M3 16H10V14H3V16M14.4 22L17 19.4L19.6 22L21 20.6L18.4 18L21 15.4L19.6 14L17 16.6L14.4 14L13 15.4L15.6 18L13 20.6L14.4 22Z";
var mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
var mdiRewind = "M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z";
var mdiTrashCanOutline = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z";
var mdiVolumeHigh = "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z";
var mdiVolumeMinus = "M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z";
var mdiVolumeMute = "M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z";
var mdiVolumePlus = "M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = (o2) => null === o2 || "object" != typeof o2 && "function" != typeof o2, rt = (o2) => void 0 === o2.strings;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, e = (t2) => (...e2) => ({ _$litDirective$: t2, values: e2 });
class i {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e2, i2) {
    this.t = t2, this._$AM = e2, this.i = i2;
  }
  _$AS(t2, e2) {
    return this.update(t2, e2);
  }
  update(t2, e2) {
    return this.render(...e2);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = (i2, t2) => {
  var _a2;
  const e2 = i2._$AN;
  if (void 0 === e2) return false;
  for (const i3 of e2) (_a2 = i3._$AO) == null ? void 0 : _a2.call(i3, t2, false), mt(i3, t2);
  return true;
}, _t = (i2) => {
  let t2, e2;
  do {
    if (void 0 === (t2 = i2._$AM)) break;
    e2 = t2._$AN, e2.delete(i2), i2 = t2;
  } while (0 === (e2 == null ? void 0 : e2.size));
}, wt = (i2) => {
  for (let t2; t2 = i2._$AM; i2 = t2) {
    let e2 = t2._$AN;
    if (void 0 === e2) t2._$AN = e2 = /* @__PURE__ */ new Set();
    else if (e2.has(i2)) break;
    e2.add(i2), gt(t2);
  }
};
function bt(i2) {
  void 0 !== this._$AN ? (_t(this), this._$AM = i2, wt(this)) : this._$AM = i2;
}
function yt(i2, t2 = false, e2 = 0) {
  const s2 = this._$AH, o2 = this._$AN;
  if (void 0 !== o2 && 0 !== o2.size) if (t2) if (Array.isArray(s2)) for (let i3 = e2; i3 < s2.length; i3++) mt(s2[i3], false), _t(s2[i3]);
  else null != s2 && (mt(s2, false), _t(s2));
  else mt(this, i2);
}
const gt = (i2) => {
  i2.type == t$1.CHILD && (i2._$AP ?? (i2._$AP = yt), i2._$AQ ?? (i2._$AQ = bt));
};
class $t extends i {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i2, t2, e2) {
    super._$AT(i2, t2, e2), wt(this), this.isConnected = i2._$AU;
  }
  _$AO(i2, t2 = true) {
    var _a2, _b;
    i2 !== this.isConnected && (this.isConnected = i2, i2 ? (_a2 = this.reconnected) == null ? void 0 : _a2.call(this) : (_b = this.disconnected) == null ? void 0 : _b.call(this)), t2 && (mt(this, i2), _t(this));
  }
  setValue(i2) {
    if (rt(this.t)) this.t._$AI(i2, this);
    else {
      const t2 = [...this.t._$AH];
      t2[this.i] = i2, this.t._$AI(t2, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Tt {
  constructor(t2) {
    this.Y = t2;
  }
  disconnect() {
    this.Y = void 0;
  }
  reconnect(t2) {
    this.Y = t2;
  }
  deref() {
    return this.Y;
  }
}
class Et {
  constructor() {
    this.Z = void 0, this.q = void 0;
  }
  get() {
    return this.Z;
  }
  pause() {
    this.Z ?? (this.Z = new Promise((t2) => this.q = t2));
  }
  resume() {
    var _a2;
    (_a2 = this.q) == null ? void 0 : _a2.call(this), this.Z = this.q = void 0;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = (t2) => !st(t2) && "function" == typeof t2.then, _e = 1073741823;
class we extends $t {
  constructor() {
    super(...arguments), this.wt = _e, this.bt = [], this.K = new Tt(this), this.X = new Et();
  }
  render(...t2) {
    return t2.find((t3) => !me(t3)) ?? R;
  }
  update(t2, s2) {
    const i2 = this.bt;
    let e2 = i2.length;
    this.bt = s2;
    const r2 = this.K, o2 = this.X;
    this.isConnected || this.disconnected();
    for (let t3 = 0; t3 < s2.length && !(t3 > this.wt); t3++) {
      const n3 = s2[t3];
      if (!me(n3)) return this.wt = t3, n3;
      t3 < e2 && n3 === i2[t3] || (this.wt = _e, e2 = 0, Promise.resolve(n3).then(async (t4) => {
        for (; o2.get(); ) await o2.get();
        const s3 = r2.deref();
        if (void 0 !== s3) {
          const i3 = s3.bt.indexOf(n3);
          i3 > -1 && i3 < s3.wt && (s3.wt = i3, s3.setValue(t4));
        }
      }));
    }
    return R;
  }
  disconnected() {
    this.K.disconnect(), this.X.pause();
  }
  reconnected() {
    this.K.reconnect(this), this.X.resume();
  }
}
const be = e(we);
const dispatchPrefix = "sonos-card-dispatch-event-";
const ACTIVE_PLAYER_EVENT_INTERNAL = "active-player";
const ACTIVE_PLAYER_EVENT = dispatchPrefix + ACTIVE_PLAYER_EVENT_INTERNAL;
const SHOW_SECTION = "show-section";
const CALL_MEDIA_STARTED = `${dispatchPrefix}call-media-started`;
const CALL_MEDIA_DONE = `${dispatchPrefix}call-media-done`;
const MEDIA_ITEM_SELECTED = "item-selected";
const TV_BASE64_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAJZlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAARAAAAWodpAAQAAAABAAAAbAAAAAAAAABiAAAAAQAAAGIAAAABd3d3Lmlua3NjYXBlLm9yZwAAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAgCgAwAEAAAAAQAAAgAAAAAA+uiskAAAAAlwSFlzAAAPEgAADxIBIZvyMwAAAi1pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+d3d3Lmlua3NjYXBlLm9yZzwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45ODwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+OTg8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrH52sKAAA/4klEQVR4Ae3dCZAc13nY8dfHzOwNYAHiJAACIMAD4iFRlE3JsSSrSrLiWLEdQ7FNy5KllBLHRcV27NiupFKoVBLfsUNVJVVWJNqMFCuCY7ssu2jZkgWVbFG2RJGmSIgkTuIGcew1uztHH/m+Hiw0A+wxs9Mz093zb2mJObpfv/frmXlfv379njEsCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgggkAgBKxG5IBMI9JnA29520L3zzbn1VjW3xbeDET8IQjNgT7rF0oWP//bBCeEIM0ZifehnD67zRga22BWzRn54bCewi2GueuHYV6pXDx8+6GWsvBQHgcQLEAAk/hCRwawJ/MQv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AQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBGIQ+P9v6JX0ZgeS/gAAAABJRU5ErkJggg==";
const MUSIC_NOTES_BASE64_IMAGE = "data:image/png;base64,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AQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAIEGFvj/AdpNbG+v3HHWAAAAAElFTkSuQmCC";
const listStyle = i$2`
  .list {
    --mdc-theme-primary: var(--accent-color);
    --mdc-list-vertical-padding: 0px;
    overflow: hidden;
  }
`;
const mediaItemTitleStyle = i$2`
  .title {
    color: var(--secondary-text-color);
    font-weight: bold;
    padding: 0 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
const { TURN_ON: TURN_ON$1 } = MediaPlayerEntityFeature;
function getSpeakerList(mainPlayer, predefinedGroups = []) {
  const playerIds = mainPlayer.members.map((member) => member.id).sort();
  if (predefinedGroups == null ? void 0 : predefinedGroups.length) {
    const found = predefinedGroups.find(
      (pg) => pg.entities.map((p2) => p2.player.id).sort().toString() === playerIds.toString()
    );
    if (found) {
      return found.name;
    }
  }
  return mainPlayer.members.map((member) => member.name).join(" + ");
}
function dispatchActivePlayerId(playerId, config, element) {
  if (cardDoesNotContainAllSections(config)) {
    dispatch(ACTIVE_PLAYER_EVENT, { entityId: playerId });
  } else {
    element.dispatchEvent(customEvent(ACTIVE_PLAYER_EVENT_INTERNAL, { entityId: playerId }));
  }
}
function cardDoesNotContainAllSections(config) {
  return config.sections && config.sections.length < Object.keys(Section).length;
}
function customEvent(type, detail) {
  return new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail
  });
}
function dispatch(type, detail) {
  const event = customEvent(type, detail);
  window.dispatchEvent(event);
}
const HEIGHT_AND_WIDTH = 40;
function getWidthOrHeight(confValue) {
  if (confValue) {
    return confValue / 100 * HEIGHT_AND_WIDTH;
  }
  return HEIGHT_AND_WIDTH;
}
function getHeight(config) {
  return getWidthOrHeight(config.heightPercentage);
}
function getWidth(config) {
  return getWidthOrHeight(config.widthPercentage);
}
function getGroupPlayerIds(hassEntity) {
  let groupMembers = hassEntity.attributes.group_members;
  groupMembers = groupMembers == null ? void 0 : groupMembers.filter((id) => id !== null && id !== void 0);
  return (groupMembers == null ? void 0 : groupMembers.length) ? groupMembers : [hassEntity.entity_id];
}
function supportsTurnOn(player) {
  return ((player.attributes.supported_features || 0) & TURN_ON$1) == TURN_ON$1;
}
function getGroupingChanges(groupingItems, joinedPlayers, activePlayerId) {
  const isSelected = groupingItems.filter((item) => item.isSelected);
  const unJoin = groupingItems.filter((item) => !item.isSelected && joinedPlayers.includes(item.player.id)).map((item) => item.player.id);
  const join = groupingItems.filter((item) => item.isSelected && !joinedPlayers.includes(item.player.id)).map((item) => item.player.id);
  let newMainPlayer = activePlayerId;
  if (unJoin.includes(activePlayerId)) {
    newMainPlayer = isSelected[0].player.id;
  }
  return { unJoin, join, newMainPlayer };
}
function entityMatchSonos(config, entity, hassWithEntities) {
  var _a2, _b;
  const entityId = entity.entity_id;
  const configEntities = [...new Set(config.entities)];
  let includeEntity = true;
  if (configEntities.length) {
    const includesEntity = configEntities.includes(entityId);
    includeEntity = !!config.excludeItemsInEntitiesList !== includesEntity;
  }
  let matchesPlatform = true;
  entity.attributes.platform = (_b = (_a2 = hassWithEntities.entities) == null ? void 0 : _a2[entityId]) == null ? void 0 : _b.platform;
  if (config.entityPlatform) {
    matchesPlatform = entity.attributes.platform === config.entityPlatform;
  }
  return includeEntity && matchesPlatform;
}
function entityMatchMxmp(config, entity, hassWithEntities) {
  var _a2, _b;
  const entityId = entity.entity_id;
  const configEntities = [...new Set(config.entities)];
  let matchesPlatform = false;
  entity.attributes.platform = (_b = (_a2 = hassWithEntities.entities) == null ? void 0 : _a2[entityId]) == null ? void 0 : _b.platform;
  if (config.entityPlatform) {
    matchesPlatform = entity.attributes.platform === config.entityPlatform;
  }
  let includeEntity = false;
  if (configEntities.length) {
    const includesEntity = configEntities.includes(entityId);
    includeEntity = !!config.excludeItemsInEntitiesList !== includesEntity;
  }
  if (config.entityPlatform && configEntities.length) {
    return matchesPlatform && includeEntity;
  }
  return matchesPlatform || includeEntity;
}
function isSonosCard(config) {
  return config.type.indexOf("sonos") > -1;
}
function sortEntities(config, filtered) {
  if (config.entities) {
    return filtered.sort((a2, b2) => {
      var _a2, _b;
      const aIndex = ((_a2 = config.entities) == null ? void 0 : _a2.indexOf(a2.entity_id)) ?? -1;
      const bIndex = ((_b = config.entities) == null ? void 0 : _b.indexOf(b2.entity_id)) ?? -1;
      return aIndex - bIndex;
    });
  } else {
    return filtered.sort((a2, b2) => a2.entity_id.localeCompare(b2.entity_id));
  }
}
function findPlayer(mediaPlayers, playerId) {
  return mediaPlayers.find((member) => member.id === playerId);
}
var __defProp$r = Object.defineProperty;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$r(target, key, result);
  return result;
};
const { SHUFFLE_SET: SHUFFLE_SET$1, REPEAT_SET: REPEAT_SET$1, PLAY, PAUSE, NEXT_TRACK, PREVIOUS_TRACK, BROWSE_MEDIA, STOP } = MediaPlayerEntityFeature;
class PlayerControls extends h {
  constructor() {
    super(...arguments);
    this.volDown = async () => await this.mediaControlService.volumeDown(this.volumePlayer, this.updateMemberVolumes);
    this.volUp = async () => await this.mediaControlService.volumeUp(this.volumePlayer, this.updateMemberVolumes);
    this.rewind = async () => await this.mediaControlService.seek(
      this.activePlayer,
      this.activePlayer.attributes.media_position - (this.config.fastForwardAndRewindStepSizeSeconds || 15)
    );
    this.fastForward = async () => await this.mediaControlService.seek(
      this.activePlayer,
      this.activePlayer.attributes.media_position + (this.config.fastForwardAndRewindStepSizeSeconds || 15)
    );
  }
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    this.mediaControlService = this.store.mediaControlService;
    const noUpDown = !!this.config.showVolumeUpAndDownButtons && D;
    const noFastForwardAndRewind = !!this.config.showFastForwardAndRewindButtons && D;
    this.volumePlayer = this.getVolumePlayer();
    this.updateMemberVolumes = !this.config.playerVolumeEntityId;
    const pauseOrStop = this.config.stopInsteadOfPause ? STOP : PAUSE;
    return ke`
      <div class="main" id="mediaControls">
          <div class="icons">
              <div class="flex-1"></div>
              <ha-icon-button hide=${noUpDown} @click=${this.volDown} .path=${mdiVolumeMinus}></ha-icon-button>
              <sonos-ha-player .store=${this.store} .features=${this.showShuffle()}></sonos-ha-player>
              <sonos-ha-player .store=${this.store} .features=${this.showPrev()}></sonos-ha-player>
              <ha-icon-button hide=${noFastForwardAndRewind} @click=${this.rewind} .path=${mdiRewind}></ha-icon-button>
              <sonos-ha-player .store=${this.store} .features=${[PLAY, pauseOrStop]} class="big-icon"></sonos-ha-player>
              <ha-icon-button hide=${noFastForwardAndRewind} @click=${this.fastForward} .path=${mdiFastForward}></ha-icon-button>
              <sonos-ha-player .store=${this.store} .features=${this.showNext()}></sonos-ha-player>
              <sonos-ha-player .store=${this.store} .features=${this.showRepeat()}></sonos-ha-player>
              <ha-icon-button hide=${noUpDown} @click=${this.volUp} .path=${mdiVolumePlus}></ha-icon-button>
              <div class="audio-input-format">
                ${this.config.showAudioInputFormat && be(this.getAudioInputFormat())}
              </div>
              <sonos-ha-player .store=${this.store} .features=${this.showBrowseMedia()}></sonos-ha-player>
          </div>
          <sonos-volume .store=${this.store} .player=${this.volumePlayer}
                       .updateMembers=${this.updateMemberVolumes}></sonos-volume>
          <div class="icons">
              <sonos-ha-player .store=${this.store} .features=${this.store.showPower(true)}></sonos-ha-player>
          </div">
      </div>
  `;
  }
  getVolumePlayer() {
    let result;
    if (this.config.playerVolumeEntityId) {
      if (this.config.allowPlayerVolumeEntityOutsideOfGroup) {
        result = findPlayer(this.store.allMediaPlayers, this.config.playerVolumeEntityId);
      } else {
        result = this.activePlayer.getMember(this.config.playerVolumeEntityId);
      }
    }
    return result ?? this.activePlayer;
  }
  async getAudioInputFormat() {
    const sensors = await this.store.hassService.getRelatedEntities(this.activePlayer, "sensor");
    const audioInputFormat = sensors.find((sensor) => sensor.entity_id.includes("audio_input_format"));
    return audioInputFormat && audioInputFormat.state && audioInputFormat.state !== "No audio" ? ke`<div>${audioInputFormat.state}</div>` : "";
  }
  showShuffle() {
    return this.config.hidePlayerControlShuffleButton ? [] : [SHUFFLE_SET$1];
  }
  showPrev() {
    return this.config.hidePlayerControlPrevTrackButton ? [] : [PREVIOUS_TRACK];
  }
  showNext() {
    return this.config.hidePlayerControlNextTrackButton ? [] : [NEXT_TRACK];
  }
  showRepeat() {
    return this.config.hidePlayerControlRepeatButton ? [] : [REPEAT_SET$1];
  }
  showBrowseMedia() {
    return this.config.showBrowseMediaInPlayerSection ? [BROWSE_MEDIA] : [];
  }
  static get styles() {
    return i$2`
      .main {
        overflow: hidden auto;
      }
      .icons {
        justify-content: center;
        display: flex;
        align-items: center;
      }
      *[hide] {
        display: none;
      }
      .big-icon {
        --mdc-icon-button-size: 5rem;
        --mdc-icon-size: 5rem;
      }
      .audio-input-format {
        flex: 1 0 0;
        margin-bottom: 10px;
        text-align: center;
        align-self: stretch;
        position: relative;
      }
      .audio-input-format > div {
        color: var(--card-background-color);
        background: var(--disabled-text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        bottom: 0;
        right: 0;
        max-width: 100%;
        font-size: smaller;
        line-height: normal;
        padding: 3px;
      }
      .flex-1 {
        flex: 1;
      }
    `;
  }
}
__decorateClass$r([
  n2({ attribute: false })
], PlayerControls.prototype, "store");
customElements.define("sonos-player-controls", PlayerControls);
var __defProp$q = Object.defineProperty;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$q(target, key, result);
  return result;
};
class PlayerHeader extends h {
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    return ke` <div class="info">
      <div class="entity">${getSpeakerList(this.activePlayer, this.store.predefinedGroups)}</div>
      <div class="song">${this.getSong()}</div>
      <div class="artist-album">${this.getAlbum()}</div>
      <sonos-progress .store=${this.store}></sonos-progress>
    </div>`;
  }
  getSong() {
    let song = this.activePlayer.getCurrentTrack();
    song = song || this.config.labelWhenNoMediaIsSelected || "No media selected";
    if (this.config.showSourceInPlayer && this.activePlayer.attributes.source) {
      song = `${song} (${this.activePlayer.attributes.source})`;
    }
    return song;
  }
  getAlbum() {
    let album = this.activePlayer.attributes.media_album_name;
    if (this.config.showChannelInPlayer && this.activePlayer.attributes.media_channel) {
      album = this.activePlayer.attributes.media_channel;
    } else if (!this.config.hidePlaylistInPlayer && this.activePlayer.attributes.media_playlist) {
      album = `${this.activePlayer.attributes.media_playlist} - ${album}`;
    }
    return album;
  }
  static get styles() {
    return i$2`
      .info {
        text-align: center;
      }

      .entity {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .song {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.15rem;
        font-weight: 400;
        color: var(--accent-color);
      }

      .artist-album {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 300;
        color: var(--secondary-text-color);
      }
    `;
  }
}
__decorateClass$q([
  n2({ attribute: false })
], PlayerHeader.prototype, "store");
customElements.define("sonos-player-header", PlayerHeader);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = "important", ie = " !" + ee, se = e(class extends i {
  constructor(e2) {
    var _a2;
    if (super(e2), e2.type !== t$1.ATTRIBUTE || "style" !== e2.name || ((_a2 = e2.strings) == null ? void 0 : _a2.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).reduce((e2, r2) => {
      const s2 = t2[r2];
      return null == s2 ? e2 : e2 + `${r2 = r2.includes("-") ? r2 : r2.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s2};`;
    }, "");
  }
  update(t2, [e2]) {
    const { style: r2 } = t2.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(e2)), this.render(e2);
    for (const t3 of this.ft) null == e2[t3] && (this.ft.delete(t3), t3.includes("-") ? r2.removeProperty(t3) : r2[t3] = null);
    for (const t3 in e2) {
      const s2 = e2[t3];
      if (null != s2) {
        this.ft.add(t3);
        const e3 = "string" == typeof s2 && s2.endsWith(ie);
        t3.includes("-") || e3 ? r2.setProperty(t3, e3 ? s2.slice(0, -11) : s2, e3 ? ee : "") : r2[t3] = s2;
      }
    }
    return R;
  }
});
var __defProp$p = Object.defineProperty;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$p(target, key, result);
  return result;
};
class Progress extends h {
  constructor() {
    super(...arguments);
    this.mediaDuration = 0;
  }
  disconnectedCallback() {
    if (this.tracker) {
      clearInterval(this.tracker);
      this.tracker = void 0;
    }
    super.disconnectedCallback();
  }
  render() {
    var _a2;
    this.activePlayer = this.store.activePlayer;
    this.mediaDuration = ((_a2 = this.activePlayer) == null ? void 0 : _a2.attributes.media_duration) || 0;
    const showProgress = this.mediaDuration > 0;
    if (showProgress) {
      this.trackProgress();
      return ke`
        <div class="progress">
          <span>${convertProgress(this.playingProgress)}</span>
          <div class="bar" @click=${this.handleSeek}>
            <div class="progress-bar" style=${this.progressBarStyle(this.mediaDuration)}></div>
          </div>
          <span> -${convertProgress(this.mediaDuration - this.playingProgress)}</span>
        </div>
      `;
    }
    return ke``;
  }
  async handleSeek(e2) {
    const progressWidth = this.progressBar.offsetWidth;
    const percent = e2.offsetX / progressWidth;
    const position = this.mediaDuration * percent;
    await this.store.mediaControlService.seek(this.activePlayer, position);
  }
  progressBarStyle(mediaDuration) {
    return se({ width: `${this.playingProgress / mediaDuration * 100}%` });
  }
  trackProgress() {
    var _a2, _b, _c;
    const position = ((_a2 = this.activePlayer) == null ? void 0 : _a2.attributes.media_position) || 0;
    const playing = (_b = this.activePlayer) == null ? void 0 : _b.isPlaying();
    const updatedAt = ((_c = this.activePlayer) == null ? void 0 : _c.attributes.media_position_updated_at) || 0;
    if (playing) {
      this.playingProgress = position + (Date.now() - new Date(updatedAt).getTime()) / 1e3;
    } else {
      this.playingProgress = position;
    }
    if (!this.tracker) {
      this.tracker = setInterval(() => this.trackProgress(), 1e3);
    }
    if (!playing) {
      clearInterval(this.tracker);
      this.tracker = void 0;
    }
  }
  static get styles() {
    return i$2`
      .progress {
        width: 100%;
        font-size: x-small;
        display: flex;
        --paper-progress-active-color: lightgray;
      }

      .bar {
        display: flex;
        flex-grow: 1;
        align-items: center;
        padding: 5px;
        cursor: pointer;
      }

      .progress-bar {
        background-color: var(--accent-color);
        height: 50%;
        transition: width 0.1s linear;
      }
    `;
  }
}
__decorateClass$p([
  n2({ attribute: false })
], Progress.prototype, "store");
__decorateClass$p([
  r$1()
], Progress.prototype, "playingProgress");
__decorateClass$p([
  e$1(".bar")
], Progress.prototype, "progressBar");
const convertProgress = (duration) => {
  const date = new Date(duration * 1e3).toISOString().substring(11, 19);
  return date.startsWith("00:") ? date.substring(3) : date;
};
customElements.define("sonos-progress", Progress);
var __defProp$o = Object.defineProperty;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$o(target, key, result);
  return result;
};
class Volume extends h {
  constructor() {
    super(...arguments);
    this.updateMembers = true;
    this.slim = false;
  }
  render() {
    this.config = this.store.config;
    this.mediaControlService = this.store.mediaControlService;
    const volume = this.player.getVolume();
    const max = this.getMax(volume);
    const isMuted = this.updateMembers ? this.player.isGroupMuted() : this.player.isMemberMuted();
    const muteIcon = isMuted ? mdiVolumeMute : mdiVolumeHigh;
    const disabled = this.player.ignoreVolume;
    return ke`
      <div class="volume" slim=${this.slim || D}>
        <ha-icon-button .disabled=${disabled} @click=${this.mute} .path=${muteIcon}> </ha-icon-button>
        <div class="volume-slider">
          <ha-control-slider
            .value=${volume}
            max=${max}
            @value-changed=${this.volumeChanged}
            .disabled=${disabled}
            class=${this.config.dynamicVolumeSlider && max === 100 ? "over-threshold" : ""}
          ></ha-control-slider>
          <div class="volume-level">
            <div style="flex: ${volume}">0%</div>
            <div class="percentage">${volume}%</div>
            <div style="flex: ${max - volume};text-align: right">${max}%</div>
          </div>
        </div>
        <div class="percentage-slim" hide=${this.slim && D}>${volume}%</div>
        <sonos-ha-player .store=${this.store} .features=${this.store.showPower()}></sonos-ha-player>
      </div>
    `;
  }
  getMax(volume) {
    const dynamicThreshold = Math.max(0, Math.min(this.config.dynamicVolumeSliderThreshold ?? 20, 100));
    const dynamicMax = Math.max(0, Math.min(this.config.dynamicVolumeSliderMax ?? 30, 100));
    return volume < dynamicThreshold && this.config.dynamicVolumeSlider ? dynamicMax : 100;
  }
  async volumeChanged(e2) {
    const newVolume = numberFromEvent(e2);
    return await this.mediaControlService.volumeSet(this.player, newVolume, this.updateMembers);
  }
  async mute() {
    return await this.mediaControlService.toggleMute(this.player, this.updateMembers);
  }
  static get styles() {
    return i$2`
      ha-control-slider {
        --control-slider-color: var(--accent-color);
      }

      ha-control-slider.over-threshold {
        --control-slider-color: var(--primary-text-color);
      }

      ha-control-slider[disabled] {
        --control-slider-color: var(--disabled-text-color);
      }

      *[slim] * {
        --control-slider-thickness: 10px;
        --mdc-icon-button-size: 30px;
        --mdc-icon-size: 20px;
      }

      *[slim] .volume-level {
        display: none;
      }

      .volume {
        display: flex;
        flex: 1;
      }

      .volume-slider {
        flex: 1;
        padding-right: 0.6rem;
      }

      *[slim] .volume-slider {
        display: flex;
        align-items: center;
      }

      .volume-level {
        font-size: x-small;
        display: flex;
      }

      .percentage {
        flex: 2;
      }

      .percentage,
      .percentage-slim {
        font-weight: bold;
        font-size: 12px;
        align-self: center;
      }

      *[hide] {
        display: none;
      }
    `;
  }
}
__decorateClass$o([
  n2({ attribute: false })
], Volume.prototype, "store");
__decorateClass$o([
  n2({ attribute: false })
], Volume.prototype, "player");
__decorateClass$o([
  n2({ type: Boolean })
], Volume.prototype, "updateMembers");
__decorateClass$o([
  n2()
], Volume.prototype, "volumeClicked");
__decorateClass$o([
  n2()
], Volume.prototype, "slim");
function numberFromEvent(e2) {
  var _a2;
  return Number.parseInt((_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.value);
}
customElements.define("sonos-volume", Volume);
var __defProp$n = Object.defineProperty;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$n(target, key, result);
  return result;
};
class Player extends h {
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    const artworkAsBackground = this.config.artworkAsBackground;
    return ke`
      <div class="container" style=${artworkAsBackground && this.getBackgroundImage()}>
        <sonos-player-header
          class="header"
          background=${artworkAsBackground || D}
          .store=${this.store}
        ></sonos-player-header>
        <div class="artwork" hide=${artworkAsBackground || D} style=${this.artworkStyle()}></div>
        <sonos-player-controls
          class="controls"
          background=${artworkAsBackground || D}
          .store=${this.store}
        ></sonos-player-controls>
      </div>
    `;
  }
  artworkStyle() {
    const minHeight = this.config.artworkMinHeight ?? 5;
    return `${this.getBackgroundImage()}; min-height: ${minHeight}rem`;
  }
  getBackgroundImage() {
    const fallbackImage = this.config.fallbackArtwork ?? (this.activePlayer.attributes.media_title === "TV" ? TV_BASE64_IMAGE : MUSIC_NOTES_BASE64_IMAGE);
    const fallbackBackgroundUrl = `url(${fallbackImage})`;
    const image = this.getArtworkImage();
    if (image) {
      return `background-image: url(${image.entityImage}), ${fallbackBackgroundUrl}${image.sizePercentage ? `; background-size: ${image.sizePercentage}%` : ""}`;
    } else {
      return `background-image: ${fallbackBackgroundUrl}`;
    }
  }
  getArtworkImage() {
    const prefix = this.config.artworkHostname || "";
    const { media_title, media_artist, media_album_name, media_content_id, media_channel, entity_picture } = this.activePlayer.attributes;
    let entityImage = entity_picture ? prefix + entity_picture : entity_picture;
    let sizePercentage = void 0;
    const overrides = this.config.mediaArtworkOverrides;
    if (overrides) {
      let override = overrides.find(
        (value) => media_title && media_title === value.mediaTitleEquals || media_artist && media_artist === value.mediaArtistEquals || media_album_name && media_album_name === value.mediaAlbumNameEquals || media_channel && media_channel === value.mediaChannelEquals || media_content_id && media_content_id === value.mediaContentIdEquals
      );
      if (!override) {
        override = overrides.find((value) => !entityImage && value.ifMissing);
      }
      if (override == null ? void 0 : override.imageUrl) {
        entityImage = override.imageUrl;
        sizePercentage = (override == null ? void 0 : override.sizePercentage) ?? sizePercentage;
      }
    }
    return { entityImage, sizePercentage };
  }
  static get styles() {
    return i$2`
      .hoverable:focus,
      .hoverable:hover {
        color: var(--accent-color);
      }

      .hoverable:active {
        color: var(--primary-color);
      }

      .container {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: min-content auto min-content;
        grid-template-areas:
          'header'
          'artwork'
          'controls';
        min-height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .header {
        grid-area: header;
        margin: 0.75rem 3.25rem;
        padding: 0.5rem;
      }

      .controls {
        grid-area: controls;
        overflow-y: auto;
        margin: 0.25rem;
        padding: 0.5rem;
      }

      .artwork {
        grid-area: artwork;
        align-self: center;
        flex-grow: 1;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        min-height: 5rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }

      *[hide] {
        display: none;
      }

      *[background] {
        background-color: rgba(var(--rgb-card-background-color), 0.9);
        border-radius: 10px;
      }
    `;
  }
}
__decorateClass$n([
  n2({ attribute: false })
], Player.prototype, "store");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rr = (r2, o2, t2) => {
  for (const t3 of o2) if (t3[0] === r2) return (0, t3[1])();
  return t2 == null ? void 0 : t2();
};
class HassService {
  constructor(hass, section, card, config) {
    this.hass = hass;
    this.currentSection = section;
    this.card = card;
    this.config = config;
  }
  async callMediaService(service, inOptions) {
    this.card.dispatchEvent(customEvent(CALL_MEDIA_STARTED, { section: this.currentSection }));
    try {
      await this.hass.callService("media_player", service, inOptions);
    } finally {
      this.card.dispatchEvent(customEvent(CALL_MEDIA_DONE));
    }
  }
  async browseMedia(mediaPlayer, media_content_type, media_content_id) {
    var _a2;
    const mediaPlayerItem = await this.hass.callWS({
      type: "media_player/browse_media",
      entity_id: mediaPlayer.id,
      media_content_id,
      media_content_type
    });
    if (this.config.replaceHttpWithHttpsForThumbnails) {
      mediaPlayerItem.children = (_a2 = mediaPlayerItem.children) == null ? void 0 : _a2.map((child) => {
        var _a3;
        return {
          ...child,
          thumbnail: (_a3 = child.thumbnail) == null ? void 0 : _a3.replace("http://", "https://")
        };
      });
    }
    return mediaPlayerItem;
  }
  async getRelatedEntities(player, ...entityTypes) {
    return new Promise((resolve) => {
      const subscribeMessage = {
        type: "render_template",
        template: `{{ device_entities(device_id('${player.id}')) }}`
      };
      try {
        this.hass.connection.subscribeMessage((response) => {
          try {
            resolve(
              response.result.filter((item) => entityTypes.some((type) => item.includes(type))).map((item) => this.hass.states[item])
            );
          } catch {
            resolve([]);
          }
        }, subscribeMessage).then((unsub) => unsub);
      } catch {
        resolve([]);
      }
    });
  }
  async getQueue(mediaPlayer) {
    try {
      const ret = await this.hass.callWS({
        type: "call_service",
        domain: "sonos",
        service: "get_queue",
        target: {
          entity_id: mediaPlayer.id
        },
        return_response: true
      });
      const queueItems = ret.response[mediaPlayer.id];
      return queueItems.map((item) => {
        return {
          title: `${item.media_artist} - ${item.media_title}`
        };
      });
    } catch (e2) {
      console.error("Error getting queue", e2);
      return [];
    }
  }
  async playQueue(mediaPlayer, queuePosition) {
    this.card.dispatchEvent(customEvent(CALL_MEDIA_STARTED, { section: this.currentSection }));
    try {
      await this.hass.callService("sonos", "play_queue", {
        entity_id: mediaPlayer.id,
        queue_position: queuePosition
      });
    } finally {
      this.card.dispatchEvent(customEvent(CALL_MEDIA_DONE));
    }
  }
  async removeFromQueue(mediaPlayer, queuePosition) {
    await this.hass.callService("sonos", "remove_from_queue", {
      entity_id: mediaPlayer.id,
      queue_position: queuePosition
    });
  }
  async clearQueue(mediaPlayer) {
    await this.hass.callService("media_player", "clear_playlist", { entity_id: mediaPlayer.id });
  }
  async setSleepTimer(mediaPlayer, sleepTimer) {
    await this.hass.callService("sonos", "set_sleep_timer", {
      entity_id: mediaPlayer.id,
      sleep_time: sleepTimer
    });
  }
  async cancelSleepTimer(player) {
    await this.hass.callService("sonos", "clear_sleep_timer", {
      entity_id: player.id
    });
  }
}
const DEFAULT_MEDIA_THUMBNAIL = "data:image/png;base64,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";
function hasItemsWithImage(items) {
  return items.some((item) => item.thumbnail);
}
function getValueFromKeyIgnoreSpecialChars(customFavoriteThumbnails, currentTitle) {
  for (const title in customFavoriteThumbnails) {
    if (removeSpecialChars(title) === removeSpecialChars(currentTitle)) {
      return customFavoriteThumbnails[title];
    }
  }
  return void 0;
}
function getThumbnail(mediaItem, config, itemsWithImage) {
  var _a2;
  let thumbnail = getValueFromKeyIgnoreSpecialChars(config.customFavoriteThumbnails, mediaItem.title) ?? mediaItem.thumbnail;
  if (!thumbnail) {
    thumbnail = getValueFromKeyIgnoreSpecialChars(config.customFavoriteThumbnailsIfMissing, mediaItem.title);
    if (itemsWithImage && !thumbnail) {
      thumbnail = ((_a2 = config.customFavoriteThumbnailsIfMissing) == null ? void 0 : _a2["default"]) || DEFAULT_MEDIA_THUMBNAIL;
    }
  } else if (thumbnail == null ? void 0 : thumbnail.match(/https:\/\/brands\.home-assistant\.io\/.+\/logo.png/)) {
    thumbnail = thumbnail == null ? void 0 : thumbnail.replace("logo.png", "icon.png");
  }
  return thumbnail || "";
}
function removeSpecialChars(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}
function indexOfWithoutSpecialChars(array, str) {
  let result = -1;
  array.forEach((value, index) => {
    if (removeSpecialChars(value) === removeSpecialChars(str)) {
      result = index;
    }
  });
  return result;
}
function stringContainsAnyItemInArray(array, str) {
  return !!array.find((value) => str.includes(value));
}
function itemsWithFallbacks(mediaPlayerItems, config) {
  const itemsWithImage = hasItemsWithImage(mediaPlayerItems);
  return mediaPlayerItems.map((item) => {
    const thumbnail = getThumbnail(item, config, itemsWithImage);
    return {
      ...item,
      thumbnail
    };
  });
}
function renderMediaBrowserItem(item, showTitle = true) {
  return ke`
    <div class="thumbnail" ?hidden=${!item.thumbnail} style="background-image: url(${item.thumbnail})"></div>
    <div class="title" ?hidden=${!showTitle}>${item.title}</div>
  `;
}
class MediaBrowseService {
  constructor(hassService, config) {
    this.hassService = hassService;
    this.config = config;
  }
  async getFavorites(player) {
    if (!player) {
      return [];
    }
    let favorites = await this.getFavoritesForPlayer(player);
    favorites = favorites.flatMap((f2) => f2);
    favorites = this.removeDuplicates(favorites);
    favorites = favorites.length ? favorites : this.getFavoritesFromStates(player);
    const favoritesToIgnore = this.config.favoritesToIgnore ?? [];
    return favorites.filter((item) => {
      const titleNotIgnored = !stringContainsAnyItemInArray(favoritesToIgnore, item.title);
      const contentIdNotIgnored = !stringContainsAnyItemInArray(favoritesToIgnore, item.media_content_id ?? "");
      return titleNotIgnored && contentIdNotIgnored;
    });
  }
  removeDuplicates(items) {
    return items.filter((item, index, all) => {
      return index === all.findIndex((current) => current.title === item.title);
    });
  }
  async getFavoritesForPlayer(player) {
    var _a2;
    const mediaRoot = await this.hassService.browseMedia(player);
    const favoritesStr = "favorites";
    const favoritesDir = (_a2 = mediaRoot.children) == null ? void 0 : _a2.find(
      (child) => {
        var _a3, _b;
        return ((_a3 = child.media_content_type) == null ? void 0 : _a3.toLowerCase()) === favoritesStr || ((_b = child.media_content_id) == null ? void 0 : _b.toLowerCase()) === favoritesStr || child.title.toLowerCase() === favoritesStr;
      }
    );
    if (!favoritesDir) {
      return [];
    }
    const favorites = [];
    await this.browseDir(player, favoritesDir, favorites);
    return favorites;
  }
  async browseDir(player, favoritesDir, favorites) {
    const dir = await this.hassService.browseMedia(
      player,
      favoritesDir.media_content_type,
      favoritesDir.media_content_id
    );
    for (const child of dir.children ?? []) {
      if (child.can_play) {
        favorites.push({ ...child, favoriteType: dir.title });
      } else if (child.can_expand) {
        await this.browseDir(player, child, favorites);
      }
    }
  }
  getFavoritesFromStates(mediaPlayer) {
    const titles = mediaPlayer.attributes.source_list ?? [];
    return titles.map((title) => ({ title }));
  }
}
class MediaControlService {
  constructor(hassService, config) {
    this.hassService = hassService;
    this.config = config;
  }
  async join(main, memberIds) {
    await this.hassService.callMediaService("join", {
      entity_id: main,
      group_members: memberIds
    });
  }
  async unJoin(playerIds) {
    await this.hassService.callMediaService("unjoin", {
      entity_id: playerIds
    });
  }
  async setVolumeAndMediaForPredefinedGroup(pg) {
    for (const pgp of pg.entities) {
      const volume = pgp.volume ?? pg.volume;
      if (volume) {
        await this.volumeSetSinglePlayer(pgp.player, volume);
      }
      if (pg.unmuteWhenGrouped) {
        await this.setVolumeMute(pgp.player, false, false);
      }
    }
    if (pg.media) {
      await this.setSource(pg.entities[0].player, pg.media);
    }
  }
  async volumeDown(mainPlayer, updateMembers = true) {
    await this.volumeStep(mainPlayer, updateMembers, this.getStepDownVolume, "volume_down");
  }
  async volumeUp(mainPlayer, updateMembers = true) {
    await this.volumeStep(mainPlayer, updateMembers, this.getStepUpVolume, "volume_up");
  }
  async volumeStep(mainPlayer, updateMembers, calculateVolume, stepDirection) {
    if (this.config.volumeStepSize) {
      await this.volumeWithStepSize(mainPlayer, updateMembers, this.config.volumeStepSize, calculateVolume);
    } else {
      await this.volumeDefaultStep(mainPlayer, updateMembers, stepDirection);
    }
  }
  async volumeWithStepSize(mainPlayer, updateMembers, volumeStepSize, calculateVolume) {
    for (const member of mainPlayer.members) {
      if (mainPlayer.id === member.id || updateMembers) {
        const newVolume = calculateVolume(member, volumeStepSize);
        await this.volumeSetSinglePlayer(member, newVolume);
      }
    }
  }
  getStepDownVolume(member, volumeStepSize) {
    return Math.max(0, member.getVolume() - volumeStepSize);
  }
  getStepUpVolume(member, stepSize) {
    return Math.min(100, member.getVolume() + stepSize);
  }
  async volumeDefaultStep(mainPlayer, updateMembers, stepDirection) {
    for (const member of mainPlayer.members) {
      if (mainPlayer.id === member.id || updateMembers) {
        if (!member.ignoreVolume) {
          await this.hassService.callMediaService(stepDirection, { entity_id: member.id });
        }
      }
    }
  }
  async volumeSet(player, volume, updateMembers) {
    if (updateMembers) {
      return await this.volumeSetGroup(player, volume);
    } else {
      return await this.volumeSetSinglePlayer(player, volume);
    }
  }
  async volumeSetGroup(player, volumePercent) {
    let relativeVolumeChange;
    if (this.config.adjustVolumeRelativeToMainPlayer) {
      relativeVolumeChange = volumePercent / player.getVolume();
    }
    await Promise.all(
      player.members.map((member) => {
        let memberVolume = volumePercent;
        if (relativeVolumeChange !== void 0) {
          if (this.config.adjustVolumeRelativeToMainPlayer) {
            memberVolume = member.getVolume() * relativeVolumeChange;
            memberVolume = Math.min(100, Math.max(0, memberVolume));
          }
        }
        return this.volumeSetSinglePlayer(member, memberVolume);
      })
    );
  }
  async volumeSetSinglePlayer(player, volumePercent) {
    if (!player.ignoreVolume) {
      const volume = volumePercent / 100;
      await this.hassService.callMediaService("volume_set", { entity_id: player.id, volume_level: volume });
    }
  }
  async toggleMute(mediaPlayer, updateMembers = true) {
    const isMuted = updateMembers ? mediaPlayer.isGroupMuted() : mediaPlayer.isMemberMuted();
    const muteVolume = !isMuted;
    await this.setVolumeMute(mediaPlayer, muteVolume, updateMembers);
  }
  async setVolumeMute(mediaPlayer, muteVolume, updateMembers = true) {
    for (const member of mediaPlayer.members) {
      if (mediaPlayer.id === member.id || updateMembers) {
        await this.hassService.callMediaService("volume_mute", { entity_id: member.id, is_volume_muted: muteVolume });
      }
    }
  }
  async setSource(mediaPlayer, source) {
    await this.hassService.callMediaService("select_source", { source, entity_id: mediaPlayer.id });
  }
  async playMedia(mediaPlayer, item) {
    await this.hassService.callMediaService("play_media", {
      entity_id: mediaPlayer.id,
      media_content_id: item.media_content_id,
      media_content_type: item.media_content_type
    });
  }
  async seek(mediaPlayer, position) {
    await this.hassService.callMediaService("media_seek", {
      entity_id: mediaPlayer.id,
      seek_position: position
    });
  }
}
class MediaPlayer {
  constructor(hassEntity, config, mediaPlayerHassEntities) {
    var _a2;
    this.id = hassEntity.entity_id;
    this.config = config;
    this.name = this.getEntityName(hassEntity);
    this.state = hassEntity.state;
    this.attributes = hassEntity.attributes;
    this.members = mediaPlayerHassEntities ? this.createGroupMembers(hassEntity, mediaPlayerHassEntities) : [this];
    this.volumePlayer = this.determineVolumePlayer();
    this.ignoreVolume = !!((_a2 = this.config.entitiesToIgnoreVolumeLevelFor) == null ? void 0 : _a2.includes(this.volumePlayer.id));
  }
  getMember(playerId) {
    return findPlayer(this.members, playerId);
  }
  hasMember(playerId) {
    return this.getMember(playerId) !== void 0;
  }
  isPlaying() {
    return this.state === "playing";
  }
  isMemberMuted() {
    return this.attributes.is_volume_muted;
  }
  isGroupMuted() {
    if (this.config.inverseGroupMuteState) {
      return this.members.some((member) => member.isMemberMuted());
    }
    return this.members.every((member) => member.isMemberMuted());
  }
  getCurrentTrack() {
    var _a2;
    let track = `${this.attributes.media_artist || ""} - ${this.attributes.media_title || ""}`;
    track = track.replace(/^ - | - $/g, "");
    if (!track) {
      track = ((_a2 = this.attributes.media_content_id) == null ? void 0 : _a2.replace(/.*:\/\//g, "")) ?? "";
    }
    if (this.config.mediaTitleRegexToReplace) {
      track = track.replace(
        new RegExp(this.config.mediaTitleRegexToReplace, "g"),
        this.config.mediaTitleReplacement || ""
      );
    }
    return track;
  }
  getEntityName(hassEntity) {
    const name = hassEntity.attributes.friendly_name || "";
    if (this.config.entityNameRegexToReplace) {
      return name.replace(
        new RegExp(this.config.entityNameRegexToReplace, "g"),
        this.config.entityNameReplacement || ""
      );
    }
    return name;
  }
  createGroupMembers(mainHassEntity, mediaPlayerHassEntities) {
    return getGroupPlayerIds(mainHassEntity).reduce((players, id) => {
      const hassEntity = mediaPlayerHassEntities.find((hassEntity2) => hassEntity2.entity_id === id);
      return hassEntity ? [...players, new MediaPlayer(hassEntity, this.config)] : players;
    }, []);
  }
  determineVolumePlayer() {
    let find;
    if (this.members.length > 1 && this.config.entitiesToIgnoreVolumeLevelFor) {
      find = this.members.find((p2) => {
        var _a2;
        return !((_a2 = this.config.entitiesToIgnoreVolumeLevelFor) == null ? void 0 : _a2.includes(p2.id));
      });
    }
    return find ?? this;
  }
  getVolume() {
    let volume;
    if (this.members.length > 1 && this.config.adjustVolumeRelativeToMainPlayer) {
      volume = this.getAverageVolume();
    } else {
      volume = 100 * (this.volumePlayer.attributes.volume_level || 0);
    }
    return Math.round(volume);
  }
  getAverageVolume() {
    const volumes = this.members.filter((m2) => {
      var _a2;
      return !((_a2 = this.config.entitiesToIgnoreVolumeLevelFor) == null ? void 0 : _a2.includes(m2.id));
    }).map((m2) => m2.attributes.volume_level || 0);
    return 100 * volumes.reduce((a2, b2) => a2 + b2, 0) / volumes.length;
  }
}
const { TURN_OFF, TURN_ON } = MediaPlayerEntityFeature;
class Store {
  constructor(hass, config, currentSection, card, activePlayerId) {
    this.hass = hass;
    this.config = config;
    const mediaPlayerHassEntities = this.getMediaPlayerHassEntities(this.hass);
    this.allGroups = this.createPlayerGroups(mediaPlayerHassEntities);
    this.allMediaPlayers = this.allGroups.reduce((previousValue, currentValue) => [...previousValue, ...currentValue.members], []).sort((a2, b2) => a2.name.localeCompare(b2.name));
    this.activePlayer = this.determineActivePlayer(activePlayerId);
    this.hassService = new HassService(this.hass, currentSection, card, config);
    this.mediaControlService = new MediaControlService(this.hassService, config);
    this.mediaBrowseService = new MediaBrowseService(this.hassService, config);
    this.predefinedGroups = this.createPredefinedGroups();
  }
  createPredefinedGroups() {
    const result = [];
    if (this.config.predefinedGroups) {
      for (const cpg of this.config.predefinedGroups) {
        const pg = this.createPredefinedGroup(cpg);
        if (pg) {
          result.push(pg);
        }
      }
    }
    return result;
  }
  createPredefinedGroup(configItem) {
    let result = void 0;
    const entities = [];
    let configEntities = configItem.entities;
    if (configItem.excludeItemsInEntitiesList) {
      configEntities = this.convertExclusionsInPredefinedGroupsToInclusions(configEntities);
    }
    for (const item of configEntities) {
      const predefinedGroupPlayer = this.createPredefinedGroupPlayer(item);
      if (predefinedGroupPlayer) {
        entities.push(predefinedGroupPlayer);
      }
    }
    if (entities.length) {
      result = {
        ...configItem,
        entities
      };
    }
    return result;
  }
  convertExclusionsInPredefinedGroupsToInclusions(configEntities) {
    return this.allMediaPlayers.filter(
      (mp) => !configEntities.find((player) => {
        return (typeof player === "string" ? player : player.player) === mp.id;
      })
    ).map((mp) => mp.id);
  }
  createPredefinedGroupPlayer(configItem) {
    var _a2;
    let pgEntityId;
    let volume;
    if (typeof configItem === "string") {
      pgEntityId = configItem;
    } else {
      volume = configItem.volume;
      pgEntityId = configItem.player;
    }
    let result = void 0;
    if (((_a2 = this.hass.states[pgEntityId]) == null ? void 0 : _a2.state) !== "unavailable") {
      const player = this.allMediaPlayers.find((p2) => p2.id === pgEntityId);
      if (player) {
        result = { player, volume };
      }
    } else {
      console.warn(`Player ${pgEntityId} is unavailable`);
    }
    return result;
  }
  getMediaPlayerHassEntities(hass) {
    const hassWithEntities = hass;
    const filtered = Object.values(hass.states).filter((hassEntity) => {
      if (hassEntity.entity_id.includes("media_player")) {
        if (isSonosCard(this.config)) {
          return entityMatchSonos(this.config, hassEntity, hassWithEntities);
        } else {
          return entityMatchMxmp(this.config, hassEntity, hassWithEntities);
        }
      }
      return false;
    });
    return sortEntities(this.config, filtered);
  }
  createPlayerGroups(mediaPlayerHassEntities) {
    return mediaPlayerHassEntities.filter((hassEntity) => this.isMainPlayer(hassEntity, mediaPlayerHassEntities)).map((hassEntity) => this.createPlayerGroup(hassEntity, mediaPlayerHassEntities)).filter((grp) => grp !== void 0);
  }
  isMainPlayer(hassEntity, mediaPlayerHassEntities) {
    var _a2;
    try {
      const groupIds = getGroupPlayerIds(hassEntity).filter(
        (playerId) => mediaPlayerHassEntities.some((value) => value.entity_id === playerId)
      );
      const isGrouped = (groupIds == null ? void 0 : groupIds.length) > 1;
      const isMainInGroup = isGrouped && groupIds && groupIds[0] === hassEntity.entity_id;
      const available = ((_a2 = this.hass.states[hassEntity.entity_id]) == null ? void 0 : _a2.state) !== "unavailable";
      if (!available) {
        console.warn(`Player ${hassEntity.entity_id} is unavailable`);
      }
      return (!isGrouped || isMainInGroup) && available;
    } catch (e2) {
      console.error("Failed to determine main player", JSON.stringify(hassEntity), e2);
      return false;
    }
  }
  createPlayerGroup(hassEntity, mediaPlayerHassEntities) {
    try {
      return new MediaPlayer(hassEntity, this.config, mediaPlayerHassEntities);
    } catch (e2) {
      console.error("Failed to create group", JSON.stringify(hassEntity), e2);
      return void 0;
    }
  }
  determineActivePlayer(activePlayerId) {
    const playerId = activePlayerId || this.config.entityId || this.getActivePlayerFromUrl();
    return this.allGroups.find((group) => group.getMember(playerId) !== void 0) || this.allGroups.find((group) => group.isPlaying()) || this.allGroups[0];
  }
  getActivePlayerFromUrl() {
    return window.location.href.includes("#") ? window.location.href.replace(/.*#/g, "") : "";
  }
  showPower(hideIfOn = false) {
    if (this.config.hidePlayerControlPowerButton) {
      return [];
    } else if (!supportsTurnOn(this.activePlayer)) {
      return [];
    } else if (hideIfOn && "off" !== this.activePlayer.state) {
      return [];
    } else {
      return [TURN_ON, TURN_OFF];
    }
  }
}
var __defProp$m = Object.defineProperty;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$m(target, key, result);
  return result;
};
class SectionButton extends h {
  render() {
    return ke`<ha-icon-button
      @click=${() => this.dispatchSection()}
      selected=${this.selectedSection === this.section || D}
    >
      <ha-icon .icon=${this.icon}></ha-icon>
    </ha-icon-button>`;
  }
  dispatchSection() {
    this.dispatchEvent(customEvent(SHOW_SECTION, this.section));
  }
  static get styles() {
    return i$2`
      :host > *[selected] {
        color: var(--accent-color);
      }
    `;
  }
}
__decorateClass$m([
  n2({ attribute: false })
], SectionButton.prototype, "config");
__decorateClass$m([
  n2()
], SectionButton.prototype, "icon");
__decorateClass$m([
  n2()
], SectionButton.prototype, "section");
__decorateClass$m([
  n2()
], SectionButton.prototype, "selectedSection");
customElements.define("sonos-section-button", SectionButton);
var __defProp$l = Object.defineProperty;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$l(target, key, result);
  return result;
};
const { GROUPING: GROUPING$1, GROUPS: GROUPS$1, MEDIA_BROWSER: MEDIA_BROWSER$1, PLAYER: PLAYER$1, VOLUMES: VOLUMES$1, QUEUE: QUEUE$1 } = Section;
class Footer extends h {
  render() {
    const icons = this.config.sectionButtonIcons;
    let sections = [
      [PLAYER$1, (icons == null ? void 0 : icons.player) ?? "mdi:home"],
      [MEDIA_BROWSER$1, (icons == null ? void 0 : icons.mediaBrowser) ?? "mdi:star-outline"],
      [GROUPS$1, (icons == null ? void 0 : icons.groups) ?? "mdi:speaker-multiple"],
      [GROUPING$1, (icons == null ? void 0 : icons.grouping) ?? "mdi:checkbox-multiple-marked-circle-outline"],
      [QUEUE$1, (icons == null ? void 0 : icons.queue) ?? "mdi:queue-first-in-last-out"],
      [VOLUMES$1, (icons == null ? void 0 : icons.volumes) ?? "mdi:tune"]
    ];
    if (!isSonosCard(this.config)) {
      sections = sections.filter(([section]) => section !== QUEUE$1);
    }
    sections = sections.filter(([section]) => {
      var _a2;
      return !this.config.sections || ((_a2 = this.config.sections) == null ? void 0 : _a2.includes(section));
    });
    return ke`
      ${sections.map(
      ([section, icon]) => ke`
          <sonos-section-button
            .config=${this.config}
            .icon=${icon}
            .selectedSection=${this.section}
            .section=${section}
          ></sonos-section-button>
        `
    )}
    `;
  }
  static get styles() {
    return i$2`
      :host {
        display: flex;
        justify-content: space-between;
      }
      :host > * {
        align-content: center;
      }
    `;
  }
}
__decorateClass$l([
  n2({ attribute: false })
], Footer.prototype, "config");
__decorateClass$l([
  n2()
], Footer.prototype, "section");
customElements.define("sonos-footer", Footer);
var t, r;
!function(e2) {
  e2.language = "language", e2.system = "system", e2.comma_decimal = "comma_decimal", e2.decimal_comma = "decimal_comma", e2.space_comma = "space_comma", e2.none = "none";
}(t || (t = {})), function(e2) {
  e2.language = "language", e2.system = "system", e2.am_pm = "12", e2.twenty_four = "24";
}(r || (r = {}));
var ne = function(e2, t2, r2, n3) {
  n3 = n3 || {}, r2 = null == r2 ? {} : r2;
  var i2 = new Event(t2, { bubbles: void 0 === n3.bubbles || n3.bubbles, cancelable: Boolean(n3.cancelable), composed: void 0 === n3.composed || n3.composed });
  return i2.detail = r2, e2.dispatchEvent(i2), i2;
};
var __defProp$k = Object.defineProperty;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$k(target, key, result);
  return result;
};
class BaseEditor extends h {
  setConfig(config) {
    this.config = JSON.parse(JSON.stringify(config));
  }
  static get styles() {
    return i$2`
      ha-svg-icon {
        margin: 5px;
      }
      ha-control-button {
        white-space: nowrap;
      }
      ha-control-button-group {
        margin: 5px;
      }
      div {
        margin-top: 20px;
      }
    `;
  }
  configChanged() {
    ne(this, "config-changed", { config: this.config });
    this.requestUpdate();
  }
  dispatchClose() {
    return this.dispatchEvent(new CustomEvent("closed"));
  }
}
__decorateClass$k([
  n2({ attribute: false })
], BaseEditor.prototype, "config");
__decorateClass$k([
  n2({ attribute: false })
], BaseEditor.prototype, "hass");
var ConfigArea = /* @__PURE__ */ ((ConfigArea2) => {
  ConfigArea2["GENERAL"] = "General";
  ConfigArea2["ENTITIES"] = "Entities";
  ConfigArea2["ADVANCED"] = "Advanced";
  ConfigArea2["ARTWORK"] = "Artwork";
  return ConfigArea2;
})(ConfigArea || {});
const ADVANCED_SCHEMA = [
  {
    name: "hideGroupCurrentTrack",
    selector: { boolean: {} }
  },
  {
    name: "dynamicVolumeSlider",
    selector: { boolean: {} }
  },
  {
    name: "dynamicVolumeSliderThreshold",
    type: "integer",
    default: 20,
    required: true,
    valueMin: 1,
    valueMax: 100
  },
  {
    name: "dynamicVolumeSliderMax",
    type: "integer",
    default: 30,
    required: true,
    valueMin: 1,
    valueMax: 100
  },
  {
    name: "artworkMinHeight",
    type: "integer",
    help: "Minimum height of the artwork in rem",
    default: 5,
    required: true,
    valueMin: 0
  },
  {
    name: "hideBrowseMediaButton",
    selector: { boolean: {} }
  },
  {
    name: "labelWhenNoMediaIsSelected",
    type: "string"
  },
  {
    name: "labelForTheAllVolumesSlider",
    type: "string"
  },
  {
    name: "mediaBrowserTitle",
    type: "string"
  },
  {
    name: "queueTitle",
    type: "string",
    cardType: "sonos"
  },
  {
    name: "artworkHostname",
    type: "string"
  },
  {
    name: "favoritesHideTitleForThumbnailIcons",
    selector: { boolean: {} }
  },
  {
    name: "topFavorites",
    type: "string"
  },
  {
    name: "numberOfFavoritesToShow",
    type: "integer",
    valueMin: 1
  },
  {
    name: "showAudioInputFormat",
    selector: { boolean: {} }
  },
  {
    name: "adjustVolumeRelativeToMainPlayer",
    selector: { boolean: {} }
  },
  {
    name: "skipApplyButtonWhenGrouping",
    selector: { boolean: {} }
  },
  {
    name: "hideVolumeCogwheel",
    selector: { boolean: {} }
  },
  {
    name: "artworkAsBackground",
    selector: { boolean: {} }
  },
  {
    name: "playerVolumeEntityId",
    selector: { entity: { multiple: false, filter: { domain: "media_player" } } }
  },
  {
    name: "allowPlayerVolumeEntityOutsideOfGroup",
    selector: { boolean: {} }
  },
  {
    name: "dontSwitchPlayerWhenGrouping",
    selector: { boolean: {} }
  },
  {
    name: "showSourceInPlayer",
    selector: { boolean: {} }
  },
  {
    name: "showChannelInPlayer",
    selector: { boolean: {} }
  },
  {
    name: "hidePlaylistInPlayer",
    selector: { boolean: {} }
  },
  {
    name: "fallbackArtwork",
    type: "string",
    help: "Override default fallback artwork image if artwork is missing for the currently selected media"
  },
  {
    name: "entitiesToIgnoreVolumeLevelFor",
    help: "If you want to ignore volume level for certain players in the player section",
    selector: { entity: { multiple: true, filter: { domain: "media_player" } } }
  },
  {
    name: "replaceHttpWithHttpsForThumbnails",
    selector: { boolean: {} }
  },
  {
    name: "volumeStepSize",
    type: "integer",
    valueMin: 1
  },
  {
    name: "showBrowseMediaInPlayerSection",
    selector: { boolean: {} }
  },
  {
    type: "string",
    name: "mediaTitleRegexToReplace"
  },
  {
    type: "string",
    name: "mediaTitleReplacement"
  },
  {
    name: "footerHeight",
    type: "integer",
    valueMin: 0
  },
  {
    name: "stopInsteadOfPause",
    selector: { boolean: {} }
  },
  {
    name: "inverseGroupMuteState",
    selector: { boolean: {} }
  },
  {
    name: "sortFavoritesByType",
    selector: { boolean: {} }
  }
];
class AdvancedEditor extends BaseEditor {
  render() {
    const topFavorites = this.config.topFavorites ?? [];
    const data = { ...this.config, topFavorites: topFavorites.join(", ") };
    return ke`
      <sonos-card-editor-form
        .schema=${ADVANCED_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${data}
        .changed=${this.changed}
      ></sonos-card-editor-form>
      <div>
        The following needs to be configured using code (YAML):
        <ul>
          <li>customFavorites</li>
          <li>customFavoriteThumbnails</li>
          <li>customFavoriteThumbnailsIfMissing</li>
          <li>favoritesToIgnore</li>
          <li>groupingButtonIcons</li>
          <li>sectionButtonIcons</li>
        </ul>
      </div>
    `;
  }
  changed(ev) {
    const changed = ev.detail.value;
    this.config = {
      ...this.config,
      ...changed,
      topFavorites: changed.topFavorites.split(/ *, */)
    };
    this.configChanged();
  }
}
customElements.define("sonos-card-advanced-editor", AdvancedEditor);
const options = {
  player: "Player",
  "media browser": "Media Browser",
  groups: "Groups",
  grouping: "Grouping",
  volumes: "Volumes",
  queue: "Queue"
};
const GENERAL_SCHEMA = [
  {
    type: "multi_select",
    options,
    name: "sections"
  },
  {
    type: "select",
    options: Object.entries(options).map((entry) => entry),
    name: "startSection"
  },
  {
    type: "integer",
    name: "favoritesItemsPerRow",
    default: 4,
    required: true,
    valueMin: 1,
    valueMax: 30
  },
  {
    type: "string",
    name: "title"
  },
  {
    name: "showVolumeUpAndDownButtons",
    selector: { boolean: {} }
  },
  {
    name: "showFastForwardAndRewindButtons",
    selector: { boolean: {} }
  },
  {
    name: "fastForwardAndRewindStepSizeSeconds",
    type: "integer",
    default: 15,
    required: true
  },
  {
    name: "hidePlayerControlPowerButton",
    selector: { boolean: {} }
  },
  {
    name: "hidePlayerControlShuffleButton",
    selector: { boolean: {} }
  },
  {
    name: "hidePlayerControlPrevTrackButton",
    selector: { boolean: {} }
  },
  {
    name: "hidePlayerControlNextTrackButton",
    selector: { boolean: {} }
  },
  {
    name: "hidePlayerControlRepeatButton",
    selector: { boolean: {} }
  },
  {
    type: "integer",
    name: "widthPercentage",
    default: 100,
    required: true
  },
  {
    type: "integer",
    name: "heightPercentage",
    default: 100,
    required: true
  }
];
class GeneralEditor extends BaseEditor {
  render() {
    return ke`
      <sonos-card-editor-form
        .schema=${GENERAL_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
      ></sonos-card-editor-form>
    `;
  }
}
customElements.define("sonos-card-general-editor", GeneralEditor);
var __defProp$j = Object.defineProperty;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$j(target, key, result);
  return result;
};
const ENTITIES_RENAME_SCHEMA = [
  {
    type: "string",
    name: "entityNameRegexToReplace"
  },
  {
    type: "string",
    name: "entityNameReplacement"
  },
  {
    type: "boolean",
    name: "excludeItemsInEntitiesList"
  }
];
const ENTITIES_SCHEMA = [
  {
    name: "entityId",
    help: "Not needed, but forces this player to be the selected one on loading the card (overrides url param etc)",
    selector: { entity: { multiple: false, filter: { domain: "media_player" } } }
  },
  {
    name: "entities",
    help: "Required, unless you have specified entity platform",
    cardType: "maxi",
    selector: { entity: { multiple: true, filter: { domain: "media_player" } } }
  },
  {
    name: "entities",
    help: "Not needed, unless you don't want to include all of them",
    cardType: "sonos",
    selector: { entity: { multiple: true, filter: { domain: "media_player" } } }
  },
  {
    name: "showNonSonosPlayers",
    help: "Show all media players, including those that are not on the Sonos platform",
    cardType: "sonos",
    selector: { boolean: {} }
  },
  {
    name: "entityPlatform",
    help: "Show all media players for the selected platform",
    type: "string"
  }
];
class EntitiesEditor extends BaseEditor {
  constructor() {
    super(...arguments);
    this.entitiesSchema = ENTITIES_SCHEMA;
  }
  render() {
    const predefinedGroups = this.config.predefinedGroups;
    this.entitiesSchema = ENTITIES_SCHEMA.filter(
      (schema) => schema.cardType === void 0 || this.config.type.indexOf(schema.cardType) > -1
    );
    return this.editGroup > -1 ? ke`<sonos-card-predefined-group-editor
          .index=${this.editGroup}
          .config=${this.config}
          .hass=${this.hass}
          @closed=${() => this.editGroup = -1}
        ></sonos-card-predefined-group-editor>` : ke`
          <sonos-card-editor-form
            .schema=${this.entitiesSchema}
            .config=${this.config}
            .hass=${this.hass}
          ></sonos-card-editor-form>
          <div>
            Predefined Groups
            <ha-control-button-group>
              ${predefinedGroups == null ? void 0 : predefinedGroups.map(
      (pg, index) => ke`
                  <ha-control-button @click=${() => this.editGroup = index}>
                    ${pg.name}<ha-svg-icon .path=${mdiPen} label="Edit Group"></ha-svg-icon>
                  </ha-control-button>
                `
    )}
              <ha-control-button @click=${() => this.editGroup = predefinedGroups ? predefinedGroups.length : 0}>
                Add group<ha-svg-icon .path=${mdiPlus} label="Add Group"></ha-svg-icon>
              </ha-control-button>
            </ha-control-button-group>
          </div>

          <div>
            Entity Renaming
            <sonos-card-editor-form
              .schema=${ENTITIES_RENAME_SCHEMA}
              .config=${this.config}
              .hass=${this.hass}
            ></sonos-card-editor-form>
          </div>
        `;
  }
}
__decorateClass$j([
  r$1()
], EntitiesEditor.prototype, "editGroup");
customElements.define("sonos-card-entities-editor", EntitiesEditor);
var __defProp$i = Object.defineProperty;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$i(target, key, result);
  return result;
};
class PredefinedGroupEditor extends BaseEditor {
  constructor() {
    super(...arguments);
    this.schema = [
      { type: "string", name: "name", required: true },
      { type: "string", name: "media" },
      { type: "boolean", name: "excludeItemsInEntitiesList" },
      {
        name: "entities",
        selector: { entity: { multiple: true, filter: { domain: "media_player" } } }
      }
    ];
  }
  render() {
    if (!this.predefinedGroup) {
      this.initPredefinedGroup();
    }
    return ke`
      <h2>Add/Edit Predefined Group</h2>
      <sonos-card-editor-form
        .data=${this.getPredefinedGroupWithoutVolumes()}
        .schema=${this.schema}
        .config=${this.config}
        .hass=${this.hass}
        .changed=${(ev) => this.groupChanged(ev)}
      ></sonos-card-editor-form>
      <div>
        <h3>Volumes - will be set when players are grouped</h3>
        ${this.predefinedGroup.entities.map(({ player, volume }) => {
      var _a2;
      const schema = [
        {
          type: "integer",
          name: "volume",
          label: `${((_a2 = this.hass.states[player]) == null ? void 0 : _a2.attributes.friendly_name) ?? ""}${volume !== void 0 ? `: ${volume}` : ""}`,
          valueMin: 0,
          valueMax: 100
        }
      ];
      return ke`
            <sonos-card-editor-form
              .data=${{ volume }}
              .schema=${schema}
              .config=${this.config}
              .hass=${this.hass}
              .changed=${(ev) => this.volumeChanged(ev, player)}
            ></sonos-card-editor-form>
          `;
    })}
      </div>
      <ha-control-button-group>
        <ha-control-button @click=${this.savePredefinedGroup}>
          OK<ha-svg-icon .path=${mdiCheck} label="OK"></ha-svg-icon>
        </ha-control-button>
        <ha-control-button @click=${this.deletePredefinedGroup}>
          Delete<ha-svg-icon .path=${mdiDelete} label="Delete"></ha-svg-icon>
        </ha-control-button>
      </ha-control-button-group>
    `;
  }
  initPredefinedGroup() {
    var _a2;
    const configPg = (_a2 = this.config.predefinedGroups) == null ? void 0 : _a2[this.index || 0];
    if (configPg) {
      const entities = configPg.entities.map((entity) => {
        return typeof entity === "string" ? { player: entity } : entity;
      });
      this.predefinedGroup = { ...configPg, entities };
    } else {
      this.predefinedGroup = { name: "", media: "", entities: [] };
    }
  }
  getPredefinedGroupWithoutVolumes() {
    return {
      ...this.predefinedGroup,
      entities: this.predefinedGroup.entities.map((pgItem) => pgItem.player)
    };
  }
  groupChanged(ev) {
    const changed = ev.detail.value;
    const entities = changed.entities.map((changedPlayerId) => {
      const existing = this.predefinedGroup.entities.find(({ player }) => {
        return player === changedPlayerId;
      });
      return existing ?? { player: changedPlayerId };
    });
    this.predefinedGroup = {
      ...changed,
      entities
    };
  }
  volumeChanged(ev, playerId) {
    const volume = ev.detail.value.volume;
    const entities = this.predefinedGroup.entities.map(
      (entity) => entity.player === playerId ? { ...entity, volume } : entity
    );
    this.predefinedGroup = { ...this.predefinedGroup, entities };
  }
  savePredefinedGroup() {
    let groups = this.config.predefinedGroups;
    if (!Array.isArray(groups)) {
      groups = [];
    }
    if (groups[this.index]) {
      groups[this.index] = this.predefinedGroup;
    } else {
      groups = [...groups, this.predefinedGroup];
    }
    this.config.predefinedGroups = groups;
    this.configChanged();
    this.dispatchClose();
  }
  deletePredefinedGroup() {
    var _a2;
    this.config.predefinedGroups = (_a2 = this.config.predefinedGroups) == null ? void 0 : _a2.filter((_2, index) => index !== this.index);
    this.index = -1;
    this.configChanged();
    this.dispatchClose();
  }
}
__decorateClass$i([
  n2({ type: Number })
], PredefinedGroupEditor.prototype, "index");
__decorateClass$i([
  r$1()
], PredefinedGroupEditor.prototype, "predefinedGroup");
customElements.define("sonos-card-predefined-group-editor", PredefinedGroupEditor);
var __defProp$h = Object.defineProperty;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$h(target, key, result);
  return result;
};
class ArtworkOverridesEditor extends BaseEditor {
  render() {
    const items = this.config.mediaArtworkOverrides;
    return this.editItem > -1 ? ke`<sonos-card-artwork-override-editor
          .index=${this.editItem}
          .config=${this.config}
          .hass=${this.hass}
          @closed=${() => this.editItem = -1}
        ></sonos-card-artwork-override-editor>` : ke`
          <div>
            Artwork Overrides
            <ha-control-button-group>
              ${items == null ? void 0 : items.map((pg, index) => {
      const itemName = pg.mediaTitleEquals || pg.mediaArtistEquals || pg.mediaAlbumNameEquals || pg.mediaContentIdEquals || pg.mediaChannelEquals || pg.ifMissing && "if missing" || index;
      return ke`
                  <ha-control-button @click=${() => this.editItem = index}>
                    ${itemName}<ha-svg-icon .path=${mdiPen} label="Edit"></ha-svg-icon>
                  </ha-control-button>
                `;
    })}
              <ha-control-button @click=${() => this.editItem = items ? items.length : 0}>
                Add<ha-svg-icon .path=${mdiPlus} label="Add"></ha-svg-icon>
              </ha-control-button>
            </ha-control-button-group>
          </div>
        `;
  }
}
__decorateClass$h([
  r$1()
], ArtworkOverridesEditor.prototype, "editItem");
customElements.define("sonos-card-artwork-overrides-editor", ArtworkOverridesEditor);
var __defProp$g = Object.defineProperty;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$g(target, key, result);
  return result;
};
const newOverride = { ifMissing: false };
class ArtworkOverrideEditor extends BaseEditor {
  render() {
    var _a2;
    const artworkOverride = (_a2 = this.config.mediaArtworkOverrides) == null ? void 0 : _a2[this.index || 0];
    const schema = [
      { name: "ifMissing", selector: { boolean: {} } },
      {
        name: "mediaTitleEquals",
        type: "string"
      },
      {
        name: "mediaArtistEquals",
        type: "string"
      },
      {
        name: "mediaAlbumNameEquals",
        type: "string"
      },
      {
        name: "mediaContentIdEquals",
        type: "string"
      },
      {
        name: "mediaChannelEquals",
        type: "string"
      },
      {
        name: "imageUrl",
        type: "string"
      },
      {
        type: "integer",
        name: "sizePercentage",
        default: 100,
        required: true,
        valueMin: 1,
        valueMax: 100
      }
    ];
    return ke`
      Add/Edit Artwork Override
      <sonos-card-editor-form
        .data=${artworkOverride || newOverride}
        .schema=${schema}
        .config=${this.config}
        .hass=${this.hass}
        .changed=${(ev) => this.changed(ev, this.index)}
      ></sonos-card-editor-form>
      <ha-control-button-group>
        <ha-control-button @click=${this.dispatchClose}>
          OK<ha-svg-icon .path=${mdiCheck} label="OK"></ha-svg-icon>
        </ha-control-button>
        ${artworkOverride ? ke`<ha-control-button
              @click="${() => {
      var _a3;
      this.config.mediaArtworkOverrides = (_a3 = this.config.mediaArtworkOverrides) == null ? void 0 : _a3.filter(
        (_2, index) => index !== this.index
      );
      this.index = -1;
      this.configChanged();
      this.dispatchClose();
    }}"
            >
              Delete<ha-svg-icon .path=${mdiDelete} label="Delete"></ha-svg-icon>
            </ha-control-button>` : ""}
      </ha-control-button-group>
    `;
  }
  changed(ev, index) {
    const changed = ev.detail.value;
    let overrides = this.config.mediaArtworkOverrides;
    if (!Array.isArray(overrides)) {
      overrides = [];
    }
    if (overrides[index]) {
      overrides[index] = changed;
    } else {
      overrides = [...overrides, changed];
    }
    this.config.mediaArtworkOverrides = overrides;
    this.configChanged();
  }
}
__decorateClass$g([
  n2({ type: Number })
], ArtworkOverrideEditor.prototype, "index");
customElements.define("sonos-card-artwork-override-editor", ArtworkOverrideEditor);
var __defProp$f = Object.defineProperty;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$f(target, key, result);
  return result;
};
class Form extends BaseEditor {
  render() {
    const schema = filterEditorSchemaOnCardType(this.schema, this.config.type);
    return ke`
      <ha-form
        .data=${this.data || this.config}
        .schema=${schema}
        .computeLabel=${computeLabel}
        .hass=${this.hass}
        @value-changed=${this.changed || this.valueChanged}
      ></ha-form>
    `;
  }
  valueChanged(ev) {
    const changed = ev.detail.value;
    this.config = {
      ...this.config,
      ...changed
    };
    this.configChanged();
  }
}
__decorateClass$f([
  n2({ attribute: false })
], Form.prototype, "schema");
__decorateClass$f([
  n2({ attribute: false })
], Form.prototype, "data");
__decorateClass$f([
  n2()
], Form.prototype, "changed");
function computeLabel({ help, label, name }) {
  if (label) {
    return label;
  }
  let unCamelCased = name.replace(/([A-Z])/g, " $1");
  unCamelCased = unCamelCased.charAt(0).toUpperCase() + unCamelCased.slice(1);
  return unCamelCased + (help ? ` (${help})` : "");
}
function filterEditorSchemaOnCardType(schema, cardType) {
  return schema.filter((schema2) => schema2.cardType === void 0 || cardType.indexOf(schema2.cardType) > -1);
}
customElements.define("sonos-card-editor-form", Form);
var __defProp$e = Object.defineProperty;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$e(target, key, result);
  return result;
};
const { GENERAL, ENTITIES, ADVANCED, ARTWORK } = ConfigArea;
class CardEditor extends BaseEditor {
  constructor() {
    super(...arguments);
    this.configArea = GENERAL;
  }
  render() {
    if (!this.config.sections || this.config.sections.length === 0) {
      this.config.sections = [Section.PLAYER, Section.VOLUMES, Section.GROUPS, Section.GROUPING, Section.MEDIA_BROWSER];
      if (isSonosCard(this.config)) {
        this.config.sections.push(Section.QUEUE);
      }
    }
    return ke`
      <ha-control-button-group>
        ${[GENERAL, ENTITIES, ARTWORK, ADVANCED].map(
      (configArea) => ke`
            <ha-control-button
              selected=${this.configArea === configArea || D}
              @click=${() => this.configArea = configArea}
            >
              ${configArea}
            </ha-control-button>
          `
    )}
      </ha-control-button-group>

      ${this.subEditor()}
    `;
  }
  subEditor() {
    return rr(this.configArea, [
      [
        GENERAL,
        () => ke`<sonos-card-general-editor .config=${this.config} .hass=${this.hass}></sonos-card-general-editor>`
      ],
      [
        ENTITIES,
        () => ke`<sonos-card-entities-editor .config=${this.config} .hass=${this.hass}></sonos-card-entities-editor>`
      ],
      [
        ADVANCED,
        () => ke`<sonos-card-advanced-editor .config=${this.config} .hass=${this.hass}></sonos-card-advanced-editor>`
      ],
      [
        ARTWORK,
        () => ke`<sonos-card-artwork-overrides-editor
            .config=${this.config}
            .hass=${this.hass}
          ></sonos-card-artwork-overrides-editor>`
      ]
    ]);
  }
  static get styles() {
    return i$2`
      ha-control-button[selected] {
        --control-button-background-color: var(--primary-color);
      }
    `;
  }
}
__decorateClass$e([
  r$1()
], CardEditor.prototype, "configArea");
customElements.define("sonos-card-editor", CardEditor);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function nn(n3, r2, t2) {
  return n3 ? r2(n3) : t2 == null ? void 0 : t2(n3);
}
var __defProp$d = Object.defineProperty;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$d(target, key, result);
  return result;
};
const { GROUPING, GROUPS, MEDIA_BROWSER, PLAYER, VOLUMES, QUEUE } = Section;
const TITLE_HEIGHT = 2;
const FOOTER_HEIGHT = 5;
class Card extends h {
  constructor() {
    super(...arguments);
    this.showSectionListener = (event) => {
      const section = event.detail;
      if (!this.config.sections || this.config.sections.indexOf(section) > -1) {
        this.section = section;
      }
    };
    this.callMediaStartedListener = (event) => {
      if (!this.showLoader && (!this.config.sections || event.detail.section === this.section)) {
        this.cancelLoader = false;
        setTimeout(() => {
          if (!this.cancelLoader) {
            this.showLoader = true;
            this.loaderTimestamp = Date.now();
          }
        }, 300);
      }
    };
    this.callMediaDoneListener = () => {
      this.cancelLoader = true;
      const duration = Date.now() - this.loaderTimestamp;
      if (this.showLoader) {
        if (duration < 1e3) {
          setTimeout(() => this.showLoader = false, 1e3 - duration);
        } else {
          this.showLoader = false;
        }
      }
    };
    this.activePlayerListener = (event) => {
      var _a2;
      const newEntityId = event.detail.entityId;
      if (newEntityId !== this.activePlayerId) {
        this.activePlayerId = newEntityId;
        if ((_a2 = this.config.sections) == null ? void 0 : _a2.includes(PLAYER)) {
          this.section = PLAYER;
        }
        this.requestUpdate();
      }
    };
    this.onMediaItemSelected = () => {
      var _a2;
      if ((_a2 = this.config.sections) == null ? void 0 : _a2.includes(PLAYER)) {
        setTimeout(() => this.section = PLAYER, 1e3);
      }
    };
  }
  render() {
    this.createStore();
    let height = getHeight(this.config);
    const sections = this.config.sections;
    const showFooter = !sections || sections.length > 1;
    const footerHeight = this.config.footerHeight || FOOTER_HEIGHT;
    const contentHeight = showFooter ? height - footerHeight : height;
    const title = this.config.title;
    height = title ? height + TITLE_HEIGHT : height;
    const noPlayersText = isSonosCard(this.config) ? "No supported players found" : "No players found. Make sure you have configured entities in the card's configuration, or configured `entityPlatform`.";
    return ke`
      <ha-card style=${this.haCardStyle(height)}>
        <div class="loader" ?hidden=${!this.showLoader}>
          <ha-circular-progress indeterminate></ha-circular-progress></div
        >
        </div>
        ${title ? ke`<div class="title">${title}</div>` : ke``}
        <div class="content" style=${this.contentStyle(contentHeight)}>
          ${this.activePlayerId ? rr(this.section, [
      [PLAYER, () => ke` <sonos-player .store=${this.store}></sonos-player>`],
      [
        GROUPS,
        () => ke` <sonos-groups
                        .store=${this.store}
                        @active-player=${this.activePlayerListener}
                      ></sonos-groups>`
      ],
      [
        GROUPING,
        () => ke`<sonos-grouping
                        .store=${this.store}
                        @active-player=${this.activePlayerListener}
                      ></sonos-grouping>`
      ],
      [
        MEDIA_BROWSER,
        () => ke`
                      <sonos-media-browser
                        .store=${this.store}
                        @item-selected=${this.onMediaItemSelected}
                      ></sonos-media-browser>
                    `
      ],
      [VOLUMES, () => ke` <sonos-volumes .store=${this.store}></sonos-volumes>`],
      [
        QUEUE,
        () => ke`<sonos-queue .store=${this.store} @item-selected=${this.onMediaItemSelected}></sonos-queue>`
      ]
    ]) : ke`<div class="no-players">${noPlayersText}</div>`}
        </div>
        ${nn(
      showFooter,
      () => ke`<sonos-footer
              style=${this.footerStyle(footerHeight)}
              .config=${this.config}
              .section=${this.section}
              @show-section=${this.showSectionListener}
            >
            </sonos-footer>`
    )}
      </ha-card>
    `;
  }
  createStore() {
    var _a2;
    if (this.activePlayerId) {
      this.store = new Store(this.hass, this.config, this.section, this, this.activePlayerId);
    } else {
      this.store = new Store(this.hass, this.config, this.section, this);
      this.activePlayerId = (_a2 = this.store.activePlayer) == null ? void 0 : _a2.id;
    }
  }
  getCardSize() {
    return 3;
  }
  static getConfigElement() {
    return document.createElement("sonos-card-editor");
  }
  connectedCallback() {
    super.connectedCallback();
    if (cardDoesNotContainAllSections(this.config)) {
      window.addEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
    }
    window.addEventListener(CALL_MEDIA_STARTED, this.callMediaStartedListener);
    window.addEventListener(CALL_MEDIA_DONE, this.callMediaDoneListener);
    window.addEventListener("hashchange", () => {
      this.activePlayerId = void 0;
      this.createStore();
    });
  }
  disconnectedCallback() {
    window.removeEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
    super.disconnectedCallback();
  }
  haCardStyle(height) {
    const width = getWidth(this.config);
    return se({
      color: "var(--secondary-text-color)",
      height: `${height}rem`,
      minWidth: `20rem`,
      maxWidth: `${width}rem`,
      overflow: "hidden"
    });
  }
  footerStyle(height) {
    return se({
      height: `${height}rem`,
      padding: "0 1rem"
    });
  }
  contentStyle(height) {
    return se({
      overflowY: "auto",
      height: `${height}rem`
    });
  }
  setConfig(config) {
    var _a2;
    const newConfig = JSON.parse(JSON.stringify(config));
    for (const [key, value] of Object.entries(newConfig)) {
      if (Array.isArray(value) && value.length === 0) {
        delete newConfig[key];
      }
    }
    const sections = newConfig.sections || Object.values(Section).filter((section) => isSonosCard(newConfig) || section !== QUEUE);
    if (newConfig.startSection && sections.includes(newConfig.startSection)) {
      this.section = newConfig.startSection;
    } else if (sections) {
      this.section = sections.includes(PLAYER) ? PLAYER : sections.includes(MEDIA_BROWSER) ? MEDIA_BROWSER : sections.includes(GROUPS) ? GROUPS : sections.includes(GROUPING) ? GROUPING : sections.includes(QUEUE) && isSonosCard(newConfig) ? QUEUE : VOLUMES;
    } else {
      this.section = PLAYER;
    }
    newConfig.favoritesItemsPerRow = newConfig.favoritesItemsPerRow || 4;
    if (((_a2 = newConfig.entities) == null ? void 0 : _a2.length) && newConfig.entities[0].entity) {
      newConfig.entities = newConfig.entities.map((entity) => entity.entity);
    }
    if (isSonosCard(newConfig)) {
      newConfig.entityPlatform = "sonos";
      if (newConfig.showNonSonosPlayers) {
        newConfig.entityPlatform = void 0;
      }
    }
    if (newConfig.customSources) {
      newConfig.customFavorites = newConfig.customSources;
    }
    if (newConfig.customThumbnail) {
      newConfig.customFavoriteThumbnails = newConfig.customThumbnail;
    }
    if (newConfig.customThumbnailIfMissing) {
      newConfig.customFavoriteThumbnailsIfMissing = newConfig.customThumbnailIfMissing;
    }
    if (newConfig.mediaBrowserItemsPerRow) {
      newConfig.favoritesItemsPerRow = newConfig.mediaBrowserItemsPerRow;
    }
    this.config = newConfig;
  }
  static get styles() {
    return i$2`
      :host {
        --mdc-icon-button-size: 3rem;
        --mdc-icon-size: 2rem;
      }
      ha-circular-progress {
        --md-sys-color-primary: var(--accent-color);
      }
      .loader {
        position: absolute;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-theme-primary: var(--accent-color);
      }
      .title {
        margin: 0.4rem 0;
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--secondary-text-color);
      }
      .no-players {
        text-align: center;
        margin-top: 50%;
      }
    `;
  }
}
__decorateClass$d([
  n2({ attribute: false })
], Card.prototype, "hass");
__decorateClass$d([
  n2({ attribute: false })
], Card.prototype, "config");
__decorateClass$d([
  r$1()
], Card.prototype, "section");
__decorateClass$d([
  r$1()
], Card.prototype, "store");
__decorateClass$d([
  r$1()
], Card.prototype, "showLoader");
__decorateClass$d([
  r$1()
], Card.prototype, "loaderTimestamp");
__decorateClass$d([
  r$1()
], Card.prototype, "cancelLoader");
__decorateClass$d([
  r$1()
], Card.prototype, "activePlayerId");
var __defProp$c = Object.defineProperty;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$c(target, key, result);
  return result;
};
class GroupingButton extends h {
  render() {
    const iconAndName = !!this.icon && !!this.name || D;
    return ke`
      <ha-control-button selected=${this.selected || D}>
        <div>
          ${this.icon ? ke` <ha-icon icon-and-name=${iconAndName} .icon=${this.icon}></ha-icon>` : ""}
          ${this.name ? ke`<span>${this.name}</span>` : ""}
        </div>
      </ha-control-button>
    `;
  }
  static get styles() {
    return i$2`
      ha-control-button {
        width: fit-content;
        --control-button-background-color: var(--secondary-text-color);
        --control-button-icon-color: var(--secondary-text-color);
      }
      ha-control-button[selected] {
        --control-button-icon-color: var(--accent-color);
      }

      span {
        font-weight: bold;
      }
    `;
  }
}
__decorateClass$c([
  n2()
], GroupingButton.prototype, "icon");
__decorateClass$c([
  n2()
], GroupingButton.prototype, "name");
__decorateClass$c([
  n2()
], GroupingButton.prototype, "selected");
customElements.define("sonos-grouping-button", GroupingButton);
class GroupingItem {
  constructor(player, activePlayer, isModified) {
    this.isDisabled = false;
    this.isMain = player.id === activePlayer.id;
    this.isModified = isModified;
    const currentlyJoined = this.isMain || activePlayer.hasMember(player.id);
    this.isSelected = isModified ? !currentlyJoined : currentlyJoined;
    this.player = player;
    this.name = player.name;
    this.icon = this.isSelected ? "check-circle" : "checkbox-blank-circle-outline";
  }
}
var __defProp$b = Object.defineProperty;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$b(target, key, result);
  return result;
};
class Grouping extends h {
  constructor() {
    super(...arguments);
    this.modifiedItems = [];
  }
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    this.mediaControlService = this.store.mediaControlService;
    this.mediaPlayerIds = this.store.allMediaPlayers.map((player) => player.id);
    this.groupingItems = this.getGroupingItems();
    this.notJoinedPlayers = this.getNotJoinedPlayers();
    this.joinedPlayers = this.getJoinedPlayers();
    if (this.config.skipApplyButtonWhenGrouping && (this.modifiedItems.length > 0 || this.selectedPredefinedGroup)) {
      this.applyGrouping();
    }
    return ke`
      <div class="wrapper">
        <div class="predefined-groups">
          ${this.renderJoinAllButton()} ${this.renderUnJoinAllButton()}
          ${nn(this.store.predefinedGroups, () => this.renderPredefinedGroups())}
        </div>
        <div class="list">
          ${this.groupingItems.map((item) => {
      return ke`
              <div class="item" modified=${item.isModified || D} disabled=${item.isDisabled || D}>
                <ha-icon
                  class="icon"
                  selected=${item.isSelected || D}
                  .icon="mdi:${item.icon}"
                  @click=${() => this.toggleItem(item)}
                ></ha-icon>
                <div class="name-and-volume">
                  <span class="name">${item.name}</span>
                  <sonos-volume
                    class="volume"
                    .store=${this.store}
                    .player=${item.player}
                    .updateMembers=${false}
                    .slim=${true}
                  ></sonos-volume>
                </div>
              </div>
            `;
    })}
        </div>
        <ha-control-button-group
          class="buttons"
          hide=${this.modifiedItems.length === 0 && !this.selectedPredefinedGroup || this.config.skipApplyButtonWhenGrouping || D}
        >
          <ha-control-button class="apply" @click=${this.applyGrouping}> Apply</ha-control-button>
          <ha-control-button @click=${this.cancelGrouping}> Cancel</ha-control-button>
        </ha-control-button-group>
      </div>
    `;
  }
  static get styles() {
    return [
      listStyle,
      i$2`
        :host {
          --mdc-icon-size: 24px;
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .predefined-groups {
          margin: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          flex-shrink: 0;
        }

        .item {
          color: var(--secondary-text-color);
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }

        .icon {
          padding-right: 0.5rem;
          flex-shrink: 0;
        }

        .icon[selected] {
          color: var(--accent-color);
        }

        .item[modified] .name {
          font-weight: bold;
          font-style: italic;
        }

        .item[disabled] .icon {
          color: var(--disabled-text-color);
        }

        .list {
          flex: 1;
          overflow: auto;
        }

        .buttons {
          flex-shrink: 0;
          margin: 0 1rem;
          padding-top: 0.5rem;
        }

        .apply {
          --control-button-background-color: var(--accent-color);
        }

        *[hide] {
          display: none;
        }

        .name-and-volume {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .volume {
          --accent-color: var(--secondary-text-color);
        }
      `
    ];
  }
  toggleItem(item) {
    if (item.isDisabled) {
      return;
    }
    this.toggleItemWithoutDisabledCheck(item);
  }
  toggleItemWithoutDisabledCheck(item) {
    if (this.modifiedItems.includes(item.player.id)) {
      this.modifiedItems = this.modifiedItems.filter((id) => id !== item.player.id);
    } else {
      this.modifiedItems = [...this.modifiedItems, item.player.id];
    }
    this.selectedPredefinedGroup = void 0;
  }
  async applyGrouping() {
    const groupingItems = this.groupingItems;
    const joinedPlayers = this.joinedPlayers;
    const activePlayerId = this.activePlayer.id;
    const { unJoin, join, newMainPlayer } = getGroupingChanges(groupingItems, joinedPlayers, activePlayerId);
    this.modifiedItems = [];
    const selectedPredefinedGroup = this.selectedPredefinedGroup;
    this.selectedPredefinedGroup = void 0;
    if (join.length > 0) {
      await this.mediaControlService.join(newMainPlayer, join);
    }
    if (unJoin.length > 0) {
      await this.mediaControlService.unJoin(unJoin);
    }
    if (selectedPredefinedGroup) {
      await this.mediaControlService.setVolumeAndMediaForPredefinedGroup(selectedPredefinedGroup);
    }
    if (newMainPlayer !== activePlayerId && !this.config.dontSwitchPlayerWhenGrouping) {
      dispatchActivePlayerId(newMainPlayer, this.config, this);
    }
    if (this.config.entityId && unJoin.includes(this.config.entityId) && this.config.dontSwitchPlayerWhenGrouping) {
      dispatchActivePlayerId(this.config.entityId, this.config, this);
    }
  }
  cancelGrouping() {
    this.modifiedItems = [];
  }
  getGroupingItems() {
    const groupingItems = this.store.allMediaPlayers.map(
      (player) => new GroupingItem(player, this.activePlayer, this.modifiedItems.includes(player.id))
    );
    const selectedItems = groupingItems.filter((item) => item.isSelected);
    if (selectedItems.length === 1) {
      selectedItems[0].isDisabled = true;
    }
    groupingItems.sort((a2, b2) => {
      if (a2.isMain && !b2.isMain || a2.isSelected && !b2.isSelected) {
        return -1;
      }
      return a2.name.localeCompare(b2.name);
    });
    return groupingItems;
  }
  renderJoinAllButton() {
    var _a2;
    const icon = ((_a2 = this.config.groupingButtonIcons) == null ? void 0 : _a2.joinAll) ?? "mdi:checkbox-multiple-marked-outline";
    return nn(this.notJoinedPlayers.length, () => this.groupingButton(icon, this.selectAll));
  }
  groupingButton(icon, click) {
    return ke` <sonos-grouping-button @click=${click} .icon=${icon}></sonos-grouping-button> `;
  }
  getNotJoinedPlayers() {
    return this.mediaPlayerIds.filter(
      (playerId) => playerId !== this.activePlayer.id && !this.activePlayer.hasMember(playerId)
    );
  }
  renderUnJoinAllButton() {
    var _a2;
    const icon = ((_a2 = this.config.groupingButtonIcons) == null ? void 0 : _a2.unJoinAll) ?? "mdi:minus-box-multiple-outline";
    return nn(this.joinedPlayers.length, () => this.groupingButton(icon, this.deSelectAll));
  }
  getJoinedPlayers() {
    return this.mediaPlayerIds.filter(
      (playerId) => playerId === this.activePlayer.id || this.activePlayer.hasMember(playerId)
    );
  }
  renderPredefinedGroups() {
    return this.store.predefinedGroups.map((predefinedGroup) => {
      var _a2, _b;
      return ke`
        <sonos-grouping-button
          @click=${async () => this.selectPredefinedGroup(predefinedGroup)}
          .icon=${((_a2 = this.config.groupingButtonIcons) == null ? void 0 : _a2.predefinedGroup) ?? "mdi:speaker-multiple"}
          .name=${predefinedGroup.name}
          .selected=${((_b = this.selectedPredefinedGroup) == null ? void 0 : _b.name) === predefinedGroup.name}
        ></sonos-grouping-button>
      `;
    });
  }
  selectPredefinedGroup(predefinedGroup) {
    this.groupingItems.forEach(async (item) => {
      const inPG = predefinedGroup.entities.some((pgp) => pgp.player.id === item.player.id);
      if (inPG && !item.isSelected || !inPG && item.isSelected) {
        this.toggleItemWithoutDisabledCheck(item);
      }
    });
    this.selectedPredefinedGroup = predefinedGroup;
  }
  selectAll() {
    this.groupingItems.forEach((item) => {
      if (!item.isSelected) {
        this.toggleItem(item);
      }
    });
  }
  deSelectAll() {
    this.groupingItems.forEach((item) => {
      if (!item.isMain && item.isSelected || item.isMain && !item.isSelected) {
        this.toggleItem(item);
      }
    });
  }
}
__decorateClass$b([
  n2({ attribute: false })
], Grouping.prototype, "store");
__decorateClass$b([
  r$1()
], Grouping.prototype, "modifiedItems");
__decorateClass$b([
  r$1()
], Grouping.prototype, "selectedPredefinedGroup");
var __defProp$a = Object.defineProperty;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$a(target, key, result);
  return result;
};
class Group extends h {
  constructor() {
    super(...arguments);
    this.selected = false;
    this.dispatchEntityIdEvent = () => {
      if (this.selected) {
        const entityId = this.player.id;
        dispatchActivePlayerId(entityId, this.store.config, this);
      }
    };
  }
  render() {
    const currentTrack = this.store.config.hideGroupCurrentTrack ? "" : this.player.getCurrentTrack();
    const speakerList = getSpeakerList(this.player, this.store.predefinedGroups);
    const icons = this.player.members.map((member) => member.attributes.icon).filter((icon) => icon);
    return ke`
      <mwc-list-item
        hasMeta
        ?selected=${this.selected}
        ?activated=${this.selected}
        @click=${() => this.handleGroupClicked()}
      >
        <div class="row">
          ${this.renderIcons(icons)}
          <div class="text">
            <span class="speakers">${speakerList}</span>
            <span class="song-title">${currentTrack}</span>
          </div>
        </div>

        ${nn(
      this.player.isPlaying(),
      () => ke`
            <div class="bars" slot="meta">
              <div></div>
              <div></div>
              <div></div>
            </div>
          `
    )}
      </mwc-list-item>
    `;
  }
  renderIcons(icons) {
    const length = icons.length;
    const iconsToShow = icons.slice(0, 4);
    const iconClass = length > 1 ? "small" : "";
    const iconsHtml = iconsToShow.map((icon) => ke` <ha-icon class=${iconClass} .icon=${icon}></ha-icon>`);
    if (length > 4) {
      iconsHtml.splice(3, 1, ke`<span>+${length - 3}</span>`);
    }
    if (length > 2) {
      iconsHtml.splice(2, 0, ke`<br />`);
    }
    return ke` <div class="icons" ?empty=${length === 0}>${iconsHtml}</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEntityIdEvent();
  }
  handleGroupClicked() {
    if (!this.selected) {
      this.selected = true;
      const newUrl = window.location.href.replace(/#.*/g, "");
      window.location.replace(`${newUrl}#${this.player.id}`);
      this.dispatchEntityIdEvent();
    }
  }
  static get styles() {
    return i$2`
      @keyframes sound {
        0% {
          opacity: 0.35;
          height: 0.15rem;
        }
        100% {
          opacity: 1;
          height: 1rem;
        }
      }

      mwc-list-item {
        height: fit-content;
        margin: 1rem;
        border-radius: 1rem;
        background: var(--secondary-background-color);
        padding-left: 0;
      }

      .row {
        display: flex;
        margin: 1rem 0;
        align-items: center;
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .speakers {
        white-space: initial;
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--secondary-text-color);
      }

      .song-title {
        font-size: 0.9rem;
        font-weight: bold;
      }

      .icons {
        text-align: center;
        margin: 0;
        min-width: 5rem;
        max-width: 5rem;
      }

      .icons[empty] {
        min-width: 1rem;
        max-width: 1rem;
      }

      ha-icon {
        --mdc-icon-size: 3rem;
        margin: 1rem;
      }

      ha-icon.small {
        --mdc-icon-size: 2rem;
        margin: 0;
      }

      .bars {
        width: 0.55rem;
        position: relative;
        margin-left: 1rem;
      }

      .bars > div {
        background: var(--secondary-text-color);
        bottom: 0.05rem;
        height: 0.15rem;
        position: absolute;
        width: 0.15rem;
        animation: sound 0ms -800ms linear infinite alternate;
        display: block;
      }

      .bars > div:first-child {
        left: 0.05rem;
        animation-duration: 474ms;
      }

      .bars > div:nth-child(2) {
        left: 0.25rem;
        animation-duration: 433ms;
      }

      .bars > div:last-child {
        left: 0.45rem;
        animation-duration: 407ms;
      }
    `;
  }
}
__decorateClass$a([
  n2({ attribute: false })
], Group.prototype, "store");
__decorateClass$a([
  n2({ attribute: false })
], Group.prototype, "player");
__decorateClass$a([
  n2({ type: Boolean })
], Group.prototype, "selected");
customElements.define("sonos-group", Group);
var __defProp$9 = Object.defineProperty;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$9(target, key, result);
  return result;
};
class Groups extends h {
  render() {
    this.activePlayer = this.store.activePlayer;
    this.groups = this.store.allGroups;
    return ke`
      <mwc-list activatable class="list">
        ${this.groups.map((group) => {
      const selected = this.activePlayer.id === group.id;
      return ke` <sonos-group .store=${this.store} .player=${group} .selected=${selected}></sonos-group> `;
    })}
      </mwc-list>
    `;
  }
  static get styles() {
    return listStyle;
  }
}
__decorateClass$9([
  n2({ attribute: false })
], Groups.prototype, "store");
var __defProp$8 = Object.defineProperty;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$8(target, key, result);
  return result;
};
class MediaBrowserList extends h {
  render() {
    this.config = this.store.config;
    return ke`
      <mwc-list multi class="list">
        ${itemsWithFallbacks(this.items, this.config).map((item) => {
      return ke`
            <sonos-media-row
              @click=${() => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item))}
              .item=${item}
            ></sonos-media-row>
          `;
    })}
      </mwc-list>
    `;
  }
  static get styles() {
    return listStyle;
  }
}
__decorateClass$8([
  n2({ attribute: false })
], MediaBrowserList.prototype, "store");
__decorateClass$8([
  n2({ type: Array })
], MediaBrowserList.prototype, "items");
customElements.define("sonos-media-browser-list", MediaBrowserList);
var __defProp$7 = Object.defineProperty;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$7(target, key, result);
  return result;
};
class MediaBrowserIcons extends h {
  render() {
    this.config = this.store.config;
    const items = itemsWithFallbacks(this.items, this.config);
    let prevType = "";
    this.sortItemsByFavoriteTypeIfConfigured(items);
    return ke`
      <div class="icons">
        ${items.map((item) => {
      const showFavoriteType = this.config.sortFavoritesByType && item.favoriteType !== prevType || D;
      const toRender = ke`
            <div class="favorite-type" show=${showFavoriteType}>${item.favoriteType}</div>
            <ha-control-button
              style=${this.buttonStyle(this.config.favoritesItemsPerRow || 4)}
              @click=${() => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item))}
            >
              ${renderMediaBrowserItem(item, !item.thumbnail || !this.config.favoritesHideTitleForThumbnailIcons)}
            </ha-control-button>
          `;
      prevType = item.favoriteType;
      return toRender;
    })}
      </div>
    `;
  }
  sortItemsByFavoriteTypeIfConfigured(items) {
    if (this.config.sortFavoritesByType) {
      items.sort((a2, b2) => {
        var _a2;
        return ((_a2 = a2.favoriteType) == null ? void 0 : _a2.localeCompare(b2.favoriteType ?? "")) || a2.title.localeCompare(b2.title);
      });
    }
  }
  buttonStyle(favoritesItemsPerRow) {
    const margin = "1%";
    const size = `calc(100% / ${favoritesItemsPerRow} - ${margin} * 2)`;
    return se({
      width: size,
      height: size,
      margin
    });
  }
  static get styles() {
    return [
      mediaItemTitleStyle,
      i$2`
        .icons {
          display: flex;
          flex-wrap: wrap;
        }

        .thumbnail {
          width: 100%;
          padding-bottom: 100%;
          margin: 0 6%;
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
        }

        .title {
          font-size: 0.8rem;
          position: absolute;
          width: 100%;
          line-height: 160%;
          bottom: 0;
          background-color: rgba(var(--rgb-card-background-color), 0.733);
        }

        .favorite-type {
          width: 100%;
          border-bottom: 1px solid var(--secondary-background-color);
          display: none;
          margin-top: 0.2rem;
          font-weight: bold;
        }

        .favorite-type[show] {
          display: block;
        }
      `
    ];
  }
}
__decorateClass$7([
  n2({ attribute: false })
], MediaBrowserIcons.prototype, "store");
__decorateClass$7([
  n2({ attribute: false })
], MediaBrowserIcons.prototype, "items");
customElements.define("sonos-media-browser-icons", MediaBrowserIcons);
var __defProp$6 = Object.defineProperty;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$6(target, key, result);
  return result;
};
class MediaBrowserHeader extends h {
  render() {
    return ke`
      <div class="title">${this.store.config.mediaBrowserTitle ?? "All Favorites"}</div>
      <sonos-ha-player
        hide=${this.store.config.hideBrowseMediaButton || D}
        .store=${this.store}
        .features=${[MediaPlayerEntityFeature.BROWSE_MEDIA]}
      ></sonos-ha-player>
    `;
  }
  static get styles() {
    return i$2`
      :host {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
      }
      .title {
        flex: 1;
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
      }
      *[hide] {
        display: none;
      }
    `;
  }
}
__decorateClass$6([
  n2({ attribute: false })
], MediaBrowserHeader.prototype, "store");
customElements.define("sonos-media-browser-header", MediaBrowserHeader);
var __defProp$5 = Object.defineProperty;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$5(target, key, result);
  return result;
};
const _MediaBrowser = class _MediaBrowser2 extends h {
  constructor() {
    super(...arguments);
    this.onMediaItemSelected = (event) => {
      const mediaItem = event.detail;
      this.playItem(mediaItem);
      this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, mediaItem));
    };
  }
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    this.mediaBrowseService = this.store.mediaBrowseService;
    this.mediaControlService = this.store.mediaControlService;
    return ke`
      <sonos-media-browser-header .store=${this.store}></sonos-media-browser-header>

      ${this.activePlayer && be(
      this.getFavorites(this.activePlayer).then((items) => {
        if (items == null ? void 0 : items.length) {
          const itemsPerRow = this.config.favoritesItemsPerRow || 4;
          if (itemsPerRow > 1) {
            return ke`
                  <sonos-media-browser-icons
                    .items=${items}
                    .store=${this.store}
                    @item-selected=${this.onMediaItemSelected}
                  ></sonos-media-browser-icons>
                `;
          } else {
            return ke`
                  <sonos-media-browser-list
                    .items=${items}
                    .store=${this.store}
                    @item-selected=${this.onMediaItemSelected}
                  ></sonos-media-browser-list>
                `;
          }
        } else {
          return ke`<div class="no-items">No favorites found</div>`;
        }
      }).catch(
        (e2) => ke`<div class="no-items">Failed to fetch list of favorites. ${e2.message ?? JSON.stringify(e2)}</div>`
      )
    )}
    `;
  }
  async playItem(mediaItem) {
    if (mediaItem.media_content_type || mediaItem.media_content_id) {
      await this.mediaControlService.playMedia(this.activePlayer, mediaItem);
    } else {
      await this.mediaControlService.setSource(this.activePlayer, mediaItem.title);
    }
  }
  async getFavorites(player) {
    var _a2, _b, _c, _d;
    let favorites = await this.mediaBrowseService.getFavorites(player);
    favorites.sort((a2, b2) => this.sortOnTopFavoritesThenAlphabetically(a2.title, b2.title));
    favorites = [
      ...((_b = (_a2 = this.config.customFavorites) == null ? void 0 : _a2[this.activePlayer.id]) == null ? void 0 : _b.map(_MediaBrowser2.createFavorite)) || [],
      ...((_d = (_c = this.config.customFavorites) == null ? void 0 : _c.all) == null ? void 0 : _d.map(_MediaBrowser2.createFavorite)) || [],
      ...favorites
    ];
    return this.config.numberOfFavoritesToShow ? favorites.slice(0, this.config.numberOfFavoritesToShow) : favorites;
  }
  sortOnTopFavoritesThenAlphabetically(a2, b2) {
    const topFavorites = this.config.topFavorites ?? [];
    const aIndex = indexOfWithoutSpecialChars(topFavorites, a2);
    const bIndex = indexOfWithoutSpecialChars(topFavorites, b2);
    if (aIndex > -1 && bIndex > -1) {
      return aIndex - bIndex;
    } else {
      let result = bIndex - aIndex;
      if (result === 0) {
        result = a2.localeCompare(b2, "en", { sensitivity: "base" });
      }
      return result;
    }
  }
  static createFavorite(source) {
    return { ...source, can_play: true };
  }
  static get styles() {
    return i$2`
      .no-items {
        text-align: center;
        margin-top: 50%;
      }
    `;
  }
};
__decorateClass$5([
  n2({ attribute: false })
], _MediaBrowser.prototype, "store");
let MediaBrowser = _MediaBrowser;
var __defProp$4 = Object.defineProperty;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
class SleepTimer extends h {
  render() {
    const hassService = this.store.hassService;
    if (this.player.attributes.platform !== "sonos") {
      return ke``;
    }
    return ke`
      <div id="sleepTimer">
        <ha-icon-button id="sleepTimerAlarm" .path=${mdiAlarm}></ha-icon-button>
        <label for="sleepTimer">Sleep Timer (s)</label>
        <input type="number" id="sleepTimerInput" min="0" max="7200" value="300" />
        <ha-icon-button
          id="sleepTimerSubmit"
          .path=${mdiCheckCircle}
          @click=${() => hassService.setSleepTimer(this.player, this.sleepTimer.valueAsNumber)}
        ></ha-icon-button>
        <ha-icon-button
          id="sleepTimerCancel"
          .path=${mdiCloseCircle}
          @click=${() => hassService.cancelSleepTimer(this.player)}
        ></ha-icon-button>
      </div>
    `;
  }
  static get styles() {
    return i$2`
      #sleepTimer {
        display: flex;
        color: var(--primary-text-color);
        gap: 7px;
      }

      #sleepTimerAlarm {
        color: var(--paper-item-icon-color);
      }

      #sleepTimerSubmit {
        color: var(--accent-color);
      }

      #sleepTimer > label {
        align-content: center;
        flex: 2;
      }
    `;
  }
}
__decorateClass$4([
  n2({ attribute: false })
], SleepTimer.prototype, "store");
__decorateClass$4([
  n2({ attribute: false })
], SleepTimer.prototype, "player");
__decorateClass$4([
  e$1("#sleepTimerInput")
], SleepTimer.prototype, "sleepTimer");
customElements.define("sonos-sleep-timer", SleepTimer);
var __defProp$3 = Object.defineProperty;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$3(target, key, result);
  return result;
};
const { SELECT_SOURCE } = MediaPlayerEntityFeature;
class Volumes extends h {
  constructor() {
    super(...arguments);
    this.showSwitches = {};
  }
  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    this.hassService = this.store.hassService;
    this.mediaControlService = this.store.mediaControlService;
    const members = this.activePlayer.members;
    return ke`
      ${nn(members.length > 1, () => this.volumeWithName(this.activePlayer))}
      ${members.map((member) => this.volumeWithName(member, false))}
    `;
  }
  volumeWithName(player, updateMembers = true) {
    const name = updateMembers ? this.config.labelForTheAllVolumesSlider ?? "All" : player.name;
    const volDown = async () => await this.mediaControlService.volumeDown(player, updateMembers);
    const volUp = async () => await this.mediaControlService.volumeUp(player, updateMembers);
    const noUpDown = !!this.config.showVolumeUpAndDownButtons && D;
    const hideSwitches = updateMembers || !this.showSwitches[player.id];
    return ke` <div class="row">
      <div class="volume-name">
        <div class="volume-name-text">${name}</div>
      </div>
      <div class="slider-row">
        <ha-icon-button
          .disabled=${player.ignoreVolume}
          hide=${noUpDown}
          @click=${volDown}
          .path=${mdiVolumeMinus}
        ></ha-icon-button>
        <sonos-volume .store=${this.store} .player=${player} .updateMembers=${updateMembers}></sonos-volume>
        <ha-icon-button
          .disabled=${player.ignoreVolume}
          hide=${noUpDown}
          @click=${volUp}
          .path=${mdiVolumePlus}
        ></ha-icon-button>
        <ha-icon-button
          hide=${updateMembers || this.config.hideVolumeCogwheel || D}
          @click=${() => this.toggleShowSwitches(player)}
          .path=${mdiCog}
          show-switches=${this.showSwitches[player.id] || D}
        ></ha-icon-button>
      </div>
      <div class="switches" hide=${hideSwitches || D}>
        <sonos-ha-player .store=${this.store} .features=${[SELECT_SOURCE]}> </sonos-ha-player>
        ${be(this.getAdditionalControls(hideSwitches, player))}
        <sonos-sleep-timer .store=${this.store} .player=${player}></sonos-sleep-timer>
      </div>
    </div>`;
  }
  toggleShowSwitches(player) {
    this.showSwitches[player.id] = !this.showSwitches[player.id];
    this.requestUpdate();
  }
  async getAdditionalControls(hide, player) {
    if (hide) {
      return;
    }
    const relatedEntities = await this.hassService.getRelatedEntities(player, "switch", "number", "sensor");
    return relatedEntities.map((relatedEntity) => {
      var _a2, _b;
      relatedEntity.attributes.friendly_name = ((_b = (_a2 = relatedEntity.attributes.friendly_name) == null ? void 0 : _a2.replaceAll(player.name, "")) == null ? void 0 : _b.trim()) ?? "";
      return ke`
        <div>
          <state-card-content .stateObj=${relatedEntity} .hass=${this.store.hass}></state-card-content>
        </div>
      `;
    });
  }
  static get styles() {
    return i$2`
      .row {
        display: flex;
        flex-direction: column;
        padding-top: 0.3rem;
        padding-right: 1rem;
        padding-bottom: 0.2rem;
      }

      .row:not(:first-child) {
        border-top: solid var(--secondary-background-color);
      }

      .row:first-child {
        padding-top: 1rem;
      }

      .switches {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
      }

      .volume-name {
        flex: 1;
        overflow: hidden;
        flex-direction: column;
        text-align: center;
      }

      .volume-name-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 1.1rem;
        font-weight: bold;
        min-height: 1rem;
      }

      .slider-row {
        display: flex;
      }

      sonos-volume {
        flex: 4;
      }

      *[show-switches] {
        color: var(--accent-color);
      }

      *[hide] {
        display: none;
      }
    `;
  }
}
__decorateClass$3([
  n2({ attribute: false })
], Volumes.prototype, "store");
__decorateClass$3([
  r$1()
], Volumes.prototype, "showSwitches");
var __defProp$2 = Object.defineProperty;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$2(target, key, result);
  return result;
};
class HaPlayer extends h {
  render() {
    const state = this.store.hass.states[this.store.activePlayer.id];
    let supportedFeatures = 0;
    this.features.forEach((feature) => supportedFeatures += feature);
    const playerState = {
      ...state,
      attributes: { ...state.attributes, supported_features: supportedFeatures }
    };
    return ke` <more-info-content .stateObj=${playerState} .hass=${this.store.hass}></more-info-content> `;
  }
}
__decorateClass$2([
  n2({ attribute: false })
], HaPlayer.prototype, "store");
__decorateClass$2([
  n2({ attribute: false })
], HaPlayer.prototype, "features");
customElements.define("sonos-ha-player", HaPlayer);
var __defProp$1 = Object.defineProperty;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$1(target, key, result);
  return result;
};
class MediaRow extends h {
  constructor() {
    super(...arguments);
    this.selected = false;
  }
  render() {
    return ke`
      <mwc-list-item hasMeta ?selected=${this.selected} ?activated=${this.selected} class="button">
        <div class="row">${renderMediaBrowserItem(this.item)}</div>
        <slot slot="meta"></slot>
      </mwc-list-item>
    `;
  }
  async firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    await this.scrollToSelected(_changedProperties);
  }
  async updated(_changedProperties) {
    super.updated(_changedProperties);
    await this.scrollToSelected(_changedProperties);
  }
  async scrollToSelected(_changedProperties) {
    await new Promise((r2) => setTimeout(r2, 0));
    if (this.selected && _changedProperties.has("selected")) {
      this.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  static get styles() {
    return [
      i$2`
        .mdc-deprecated-list-item__text {
          width: 100%;
        }
        .button {
          margin: 0.3rem;
          border-radius: 0.3rem;
          background: var(--secondary-background-color);
          --icon-width: 35px;
          height: 40px;
        }

        .row {
          display: flex;
        }

        .thumbnail {
          width: var(--icon-width);
          height: var(--icon-width);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }

        .title {
          font-size: 1.1rem;
          align-self: center;
          flex: 1;
        }
      `,
      mediaItemTitleStyle
    ];
  }
}
__decorateClass$1([
  n2({ attribute: false })
], MediaRow.prototype, "store");
__decorateClass$1([
  n2({ attribute: false })
], MediaRow.prototype, "item");
__decorateClass$1([
  n2({ type: Boolean })
], MediaRow.prototype, "selected");
customElements.define("sonos-media-row", MediaRow);
var __defProp = Object.defineProperty;
var __decorateClass = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp(target, key, result);
  return result;
};
const { SHUFFLE_SET, REPEAT_SET, CLEAR_PLAYLIST } = MediaPlayerEntityFeature;
class Queue extends h {
  constructor() {
    super(...arguments);
    this.editMode = false;
    this.firstRender = true;
    this.onMediaItemSelected = async (index) => {
      if (!this.editMode) {
        await this.store.hassService.playQueue(this.activePlayer, index);
        this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
      }
    };
  }
  render() {
    this.activePlayer = this.store.activePlayer;
    const selected = this.activePlayer.attributes.queue_position - 1;
    return ke`${this.renderQueue(selected)}`;
  }
  renderQueue(selected) {
    this.firstRender = false;
    return ke`
      <div class="header">
        <div class="title">
          ${this.store.config.queueTitle ?? (this.activePlayer.attributes.media_playlist ?? `Play Queue`) + (this.activePlayer.attributes.media_channel ? " (not active)" : "")}
        </div>
        <div class="header-icons">
          <sonos-ha-player
            .store=${this.store}
            .features=${[SHUFFLE_SET, REPEAT_SET, CLEAR_PLAYLIST]}
          ></sonos-ha-player>
          <ha-icon-button .path=${mdiPlaylistRemove} @click=${this.clearQueue}></ha-icon-button>
          <ha-icon-button
            .path=${mdiPlaylistEdit}
            @click=${this.toggleEditMode}
            selected=${this.editMode || D}
          ></ha-icon-button>
        </div>
      </div>
      <div class="list">
        <mwc-list multi>
          ${be(
      this.store.hassService.getQueue(this.store.activePlayer).then(
        (queue) => queue.map((item, index) => {
          return ke`
                  <sonos-media-row
                    @click=${() => this.onMediaItemSelected(index)}
                    .item=${item}
                    .selected=${selected !== void 0 && selected === index}
                    ><ha-icon-button
                      hide=${this.editMode && D}
                      @click=${(event) => {
            event.stopPropagation();
            return this.removeFromQueue(index);
          }}
                      .path=${mdiTrashCanOutline}
                    ></ha-icon-button
                  ></sonos-media-row>
                `;
        })
      )
    )}
        </mwc-list>
      </div>
    `;
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  async clearQueue() {
    await this.store.hassService.clearQueue(this.activePlayer);
    this.requestUpdate();
  }
  async removeFromQueue(index) {
    await this.store.hassService.removeFromQueue(this.activePlayer, index);
    this.requestUpdate();
  }
  static get styles() {
    return [
      listStyle,
      i$2`
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
        }
        .header-icons {
          white-space: nowrap;
        }
        .header-icons > * {
          display: inline-block;
        }
        .title {
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }
        .list {
          overflow: auto;
          --mdc-icon-button-size: 1.5rem;
          --mdc-icon-size: 1rem;
        }
        *[selected] {
          color: var(--accent-color);
        }
        *[hide] {
          display: none;
        }
      `
    ];
  }
}
__decorateClass([
  n2()
], Queue.prototype, "store");
__decorateClass([
  r$1()
], Queue.prototype, "activePlayer");
__decorateClass([
  r$1()
], Queue.prototype, "editMode");
__decorateClass([
  r$1()
], Queue.prototype, "firstRender");
window.customCards.push({
  type: "sonos-card",
  name: "Sonos",
  description: "Media player for your Sonos speakers",
  preview: true
});
customElements.define("sonos-card", Card);
customElements.define("sonos-grouping", Grouping);
customElements.define("sonos-groups", Groups);
customElements.define("sonos-media-browser", MediaBrowser);
customElements.define("sonos-player", Player);
customElements.define("sonos-volumes", Volumes);
customElements.define("sonos-queue", Queue);
