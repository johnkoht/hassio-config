var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (t.ShadyCSS === undefined || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = new WeakMap;

class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e && t2 === undefined) {
      const e2 = s2 !== undefined && s2.length === 1;
      e2 && (t2 = o.get(s2)), t2 === undefined && ((this.o = t2 = new CSSStyleSheet).replaceSync(this.cssText), e2 && o.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
}
var r = (t2) => new n(typeof t2 == "string" ? t2 : t2 + "", undefined, s);
var i = (t2, ...e2) => {
  const o2 = t2.length === 1 ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (t3._$cssResult$ === true)
      return t3.cssText;
    if (typeof t3 == "number")
      return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n(o2, t2, s);
};
var S = (s2, o2) => {
  if (e)
    s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else
    for (const e2 of o2) {
      const o3 = document.createElement("style"), n2 = t.litNonce;
      n2 !== undefined && o3.setAttribute("nonce", n2), o3.textContent = e2.cssText, s2.appendChild(o3);
    }
};
var c = e ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules)
    e2 += s2.cssText;
  return r(e2);
})(t2) : t2;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t2, s2) => t2;
var u = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l : null;
      break;
    case Object:
    case Array:
      t2 = t2 == null ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i3 = t2;
  switch (s2) {
    case Boolean:
      i3 = t2 !== null;
      break;
    case Number:
      i3 = t2 === null ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i3 = JSON.parse(t2);
      } catch (t3) {
        i3 = null;
      }
  }
  return i3;
} };
var f = (t2, s2) => !i2(t2, s2);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= new WeakMap;

class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ??= []).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i3 = Symbol(), h2 = this.getPropertyDescriptor(t2, i3, s2);
      h2 !== undefined && e2(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i3) {
    const { get: e3, set: r3 } = h(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e3, set(s3) {
      const h2 = e3?.call(this);
      r3?.call(this, s3), this.requestUpdate(t2, h2, i3);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t2 = n2(this);
    t2.finalize(), t2.l !== undefined && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t3 = this.properties, s2 = [...r2(t3), ...o2(t3)];
      for (const i3 of s2)
        this.createProperty(i3, t3[i3]);
    }
    const t2 = this[Symbol.metadata];
    if (t2 !== null) {
      const s2 = litPropertyMetadata.get(t2);
      if (s2 !== undefined)
        for (const [t3, i3] of s2)
          this.elementProperties.set(t3, i3);
    }
    this._$Eh = new Map;
    for (const [t3, s2] of this.elementProperties) {
      const i3 = this._$Eu(t3, s2);
      i3 !== undefined && this._$Eh.set(i3, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i3 = [];
    if (Array.isArray(s2)) {
      const e3 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e3)
        i3.unshift(c(s3));
    } else
      s2 !== undefined && i3.push(c(s2));
    return i3;
  }
  static _$Eu(t2, s2) {
    const i3 = s2.attribute;
    return i3 === false ? undefined : typeof i3 == "string" ? i3 : typeof t2 == "string" ? t2.toLowerCase() : undefined;
  }
  constructor() {
    super(), this._$Ep = undefined, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t2) => t2(this));
  }
  addController(t2) {
    (this._$EO ??= new Set).add(t2), this.renderRoot !== undefined && this.isConnected && t2.hostConnected?.();
  }
  removeController(t2) {
    this._$EO?.delete(t2);
  }
  _$E_() {
    const t2 = new Map, s2 = this.constructor.elementProperties;
    for (const i3 of s2.keys())
      this.hasOwnProperty(i3) && (t2.set(i3, this[i3]), delete this[i3]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t2) => t2.hostConnected?.());
  }
  enableUpdating(t2) {}
  disconnectedCallback() {
    this._$EO?.forEach((t2) => t2.hostDisconnected?.());
  }
  attributeChangedCallback(t2, s2, i3) {
    this._$AK(t2, i3);
  }
  _$ET(t2, s2) {
    const i3 = this.constructor.elementProperties.get(t2), e3 = this.constructor._$Eu(t2, i3);
    if (e3 !== undefined && i3.reflect === true) {
      const h2 = (i3.converter?.toAttribute !== undefined ? i3.converter : u).toAttribute(s2, i3.type);
      this._$Em = t2, h2 == null ? this.removeAttribute(e3) : this.setAttribute(e3, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    const i3 = this.constructor, e3 = i3._$Eh.get(t2);
    if (e3 !== undefined && this._$Em !== e3) {
      const t3 = i3.getPropertyOptions(e3), h2 = typeof t3.converter == "function" ? { fromAttribute: t3.converter } : t3.converter?.fromAttribute !== undefined ? t3.converter : u;
      this._$Em = e3, this[e3] = h2.fromAttribute(s2, t3.type) ?? this._$Ej?.get(e3) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i3) {
    if (t2 !== undefined) {
      const e3 = this.constructor, h2 = this[t2];
      if (i3 ??= e3.getPropertyOptions(t2), !((i3.hasChanged ?? f)(h2, s2) || i3.useDefault && i3.reflect && h2 === this._$Ej?.get(t2) && !this.hasAttribute(e3._$Eu(t2, i3))))
        return;
      this.C(t2, s2, i3);
    }
    this.isUpdatePending === false && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i3, reflect: e3, wrapped: h2 }, r3) {
    i3 && !(this._$Ej ??= new Map).has(t2) && (this._$Ej.set(t2, r3 ?? s2 ?? this[t2]), h2 !== true || r3 !== undefined) || (this._$AL.has(t2) || (this.hasUpdated || i3 || (s2 = undefined), this._$AL.set(t2, s2)), e3 === true && this._$Em !== t2 && (this._$Eq ??= new Set).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return t2 != null && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t4, s3] of this._$Ep)
          this[t4] = s3;
        this._$Ep = undefined;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0)
        for (const [s3, i3] of t3) {
          const { wrapped: t4 } = i3, e3 = this[s3];
          t4 !== true || this._$AL.has(s3) || e3 === undefined || this.C(s3, undefined, i3, e3);
        }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), this._$EO?.forEach((t3) => t3.hostUpdate?.()), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {}
  _$AE(t2) {
    this._$EO?.forEach((t3) => t3.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = new Map, this.isUpdatePending = false;
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
    this._$Eq &&= this._$Eq.forEach((t3) => this._$ET(t3, this[t3])), this._$EM();
  }
  updated(t2) {}
  firstUpdated(t2) {}
}
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = new Map, y[d("finalized")] = new Map, p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.0");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : undefined;
var e3 = "$lit$";
var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t3) => t3 === null || typeof t3 != "object" && typeof t3 != "function";
var a2 = Array.isArray;
var u2 = (t3) => a2(t3) || typeof t3?.[Symbol.iterator] == "function";
var d2 = `[ 	
\f\r]`;
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t3) => (i4, ...s3) => ({ _$litType$: t3, strings: i4, values: s3 });
var x = y2(1);
var b2 = y2(2);
var w = y2(3);
var T = Symbol.for("lit-noChange");
var E = Symbol.for("lit-nothing");
var A = new WeakMap;
var C = r3.createTreeWalker(r3, 129);
function P(t3, i4) {
  if (!a2(t3) || !t3.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return s2 !== undefined ? s2.createHTML(i4) : i4;
}
var V = (t3, i4) => {
  const s3 = t3.length - 1, o4 = [];
  let r4, l3 = i4 === 2 ? "<svg>" : i4 === 3 ? "<math>" : "", c4 = f2;
  for (let i5 = 0;i5 < s3; i5++) {
    const s4 = t3[i5];
    let a3, u3, d3 = -1, y3 = 0;
    for (;y3 < s4.length && (c4.lastIndex = y3, u3 = c4.exec(s4), u3 !== null); )
      y3 = c4.lastIndex, c4 === f2 ? u3[1] === "!--" ? c4 = v : u3[1] !== undefined ? c4 = _ : u3[2] !== undefined ? ($.test(u3[2]) && (r4 = RegExp("</" + u3[2], "g")), c4 = m) : u3[3] !== undefined && (c4 = m) : c4 === m ? u3[0] === ">" ? (c4 = r4 ?? f2, d3 = -1) : u3[1] === undefined ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = u3[3] === undefined ? m : u3[3] === '"' ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r4 = undefined);
    const x2 = c4 === m && t3[i5 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === f2 ? s4 + n3 : d3 >= 0 ? (o4.push(a3), s4.slice(0, d3) + e3 + s4.slice(d3) + h2 + x2) : s4 + h2 + (d3 === -2 ? i5 : x2);
  }
  return [P(t3, l3 + (t3[s3] || "<?>") + (i4 === 2 ? "</svg>" : i4 === 3 ? "</math>" : "")), o4];
};

class N {
  constructor({ strings: t3, _$litType$: s3 }, n4) {
    let r4;
    this.parts = [];
    let c4 = 0, a3 = 0;
    const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = V(t3, s3);
    if (this.el = N.createElement(f3, n4), C.currentNode = this.el.content, s3 === 2 || s3 === 3) {
      const t4 = this.el.content.firstChild;
      t4.replaceWith(...t4.childNodes);
    }
    for (;(r4 = C.nextNode()) !== null && d3.length < u3; ) {
      if (r4.nodeType === 1) {
        if (r4.hasAttributes())
          for (const t4 of r4.getAttributeNames())
            if (t4.endsWith(e3)) {
              const i4 = v2[a3++], s4 = r4.getAttribute(t4).split(h2), e4 = /([.?@])?(.*)/.exec(i4);
              d3.push({ type: 1, index: c4, name: e4[2], strings: s4, ctor: e4[1] === "." ? H : e4[1] === "?" ? I : e4[1] === "@" ? L : k }), r4.removeAttribute(t4);
            } else
              t4.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r4.removeAttribute(t4));
        if ($.test(r4.tagName)) {
          const t4 = r4.textContent.split(h2), s4 = t4.length - 1;
          if (s4 > 0) {
            r4.textContent = i3 ? i3.emptyScript : "";
            for (let i4 = 0;i4 < s4; i4++)
              r4.append(t4[i4], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
            r4.append(t4[s4], l2());
          }
        }
      } else if (r4.nodeType === 8)
        if (r4.data === o3)
          d3.push({ type: 2, index: c4 });
        else {
          let t4 = -1;
          for (;(t4 = r4.data.indexOf(h2, t4 + 1)) !== -1; )
            d3.push({ type: 7, index: c4 }), t4 += h2.length - 1;
        }
      c4++;
    }
  }
  static createElement(t3, i4) {
    const s3 = r3.createElement("template");
    return s3.innerHTML = t3, s3;
  }
}
function S2(t3, i4, s3 = t3, e4) {
  if (i4 === T)
    return i4;
  let h3 = e4 !== undefined ? s3._$Co?.[e4] : s3._$Cl;
  const o4 = c3(i4) ? undefined : i4._$litDirective$;
  return h3?.constructor !== o4 && (h3?._$AO?.(false), o4 === undefined ? h3 = undefined : (h3 = new o4(t3), h3._$AT(t3, s3, e4)), e4 !== undefined ? (s3._$Co ??= [])[e4] = h3 : s3._$Cl = h3), h3 !== undefined && (i4 = S2(t3, h3._$AS(t3, i4.values), h3, e4)), i4;
}

class M {
  constructor(t3, i4) {
    this._$AV = [], this._$AN = undefined, this._$AD = t3, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t3) {
    const { el: { content: i4 }, parts: s3 } = this._$AD, e4 = (t3?.creationScope ?? r3).importNode(i4, true);
    C.currentNode = e4;
    let h3 = C.nextNode(), o4 = 0, n4 = 0, l3 = s3[0];
    for (;l3 !== undefined; ) {
      if (o4 === l3.index) {
        let i5;
        l3.type === 2 ? i5 = new R(h3, h3.nextSibling, this, t3) : l3.type === 1 ? i5 = new l3.ctor(h3, l3.name, l3.strings, this, t3) : l3.type === 6 && (i5 = new z(h3, this, t3)), this._$AV.push(i5), l3 = s3[++n4];
      }
      o4 !== l3?.index && (h3 = C.nextNode(), o4++);
    }
    return C.currentNode = r3, e4;
  }
  p(t3) {
    let i4 = 0;
    for (const s3 of this._$AV)
      s3 !== undefined && (s3.strings !== undefined ? (s3._$AI(t3, s3, i4), i4 += s3.strings.length - 2) : s3._$AI(t3[i4])), i4++;
  }
}

class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t3, i4, s3, e4) {
    this.type = 2, this._$AH = E, this._$AN = undefined, this._$AA = t3, this._$AB = i4, this._$AM = s3, this.options = e4, this._$Cv = e4?.isConnected ?? true;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i4 = this._$AM;
    return i4 !== undefined && t3?.nodeType === 11 && (t3 = i4.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i4 = this) {
    t3 = S2(this, t3, i4), c3(t3) ? t3 === E || t3 == null || t3 === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : t3 !== this._$AH && t3 !== T && this._(t3) : t3._$litType$ !== undefined ? this.$(t3) : t3.nodeType !== undefined ? this.T(t3) : u2(t3) ? this.k(t3) : this._(t3);
  }
  O(t3) {
    return this._$AA.parentNode.insertBefore(t3, this._$AB);
  }
  T(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
  }
  _(t3) {
    this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(r3.createTextNode(t3)), this._$AH = t3;
  }
  $(t3) {
    const { values: i4, _$litType$: s3 } = t3, e4 = typeof s3 == "number" ? this._$AC(t3) : (s3.el === undefined && (s3.el = N.createElement(P(s3.h, s3.h[0]), this.options)), s3);
    if (this._$AH?._$AD === e4)
      this._$AH.p(i4);
    else {
      const t4 = new M(e4, this), s4 = t4.u(this.options);
      t4.p(i4), this.T(s4), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i4 = A.get(t3.strings);
    return i4 === undefined && A.set(t3.strings, i4 = new N(t3)), i4;
  }
  k(t3) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s3, e4 = 0;
    for (const h3 of t3)
      e4 === i4.length ? i4.push(s3 = new R(this.O(l2()), this.O(l2()), this, this.options)) : s3 = i4[e4], s3._$AI(h3), e4++;
    e4 < i4.length && (this._$AR(s3 && s3._$AB.nextSibling, e4), i4.length = e4);
  }
  _$AR(t3 = this._$AA.nextSibling, i4) {
    for (this._$AP?.(false, true, i4);t3 && t3 !== this._$AB; ) {
      const i5 = t3.nextSibling;
      t3.remove(), t3 = i5;
    }
  }
  setConnected(t3) {
    this._$AM === undefined && (this._$Cv = t3, this._$AP?.(t3));
  }
}

class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t3, i4, s3, e4, h3) {
    this.type = 1, this._$AH = E, this._$AN = undefined, this.element = t3, this.name = i4, this._$AM = e4, this.options = h3, s3.length > 2 || s3[0] !== "" || s3[1] !== "" ? (this._$AH = Array(s3.length - 1).fill(new String), this.strings = s3) : this._$AH = E;
  }
  _$AI(t3, i4 = this, s3, e4) {
    const h3 = this.strings;
    let o4 = false;
    if (h3 === undefined)
      t3 = S2(this, t3, i4, 0), o4 = !c3(t3) || t3 !== this._$AH && t3 !== T, o4 && (this._$AH = t3);
    else {
      const e5 = t3;
      let n4, r4;
      for (t3 = h3[0], n4 = 0;n4 < h3.length - 1; n4++)
        r4 = S2(this, e5[s3 + n4], i4, n4), r4 === T && (r4 = this._$AH[n4]), o4 ||= !c3(r4) || r4 !== this._$AH[n4], r4 === E ? t3 = E : t3 !== E && (t3 += (r4 ?? "") + h3[n4 + 1]), this._$AH[n4] = r4;
    }
    o4 && !e4 && this.j(t3);
  }
  j(t3) {
    t3 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
  }
}

class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === E ? undefined : t3;
  }
}

class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    this.element.toggleAttribute(this.name, !!t3 && t3 !== E);
  }
}

class L extends k {
  constructor(t3, i4, s3, e4, h3) {
    super(t3, i4, s3, e4, h3), this.type = 5;
  }
  _$AI(t3, i4 = this) {
    if ((t3 = S2(this, t3, i4, 0) ?? E) === T)
      return;
    const s3 = this._$AH, e4 = t3 === E && s3 !== E || t3.capture !== s3.capture || t3.once !== s3.once || t3.passive !== s3.passive, h3 = t3 !== E && (s3 === E || e4);
    e4 && this.element.removeEventListener(this.name, this, s3), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
  }
}

class z {
  constructor(t3, i4, s3) {
    this.element = t3, this.type = 6, this._$AN = undefined, this._$AM = i4, this.options = s3;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    S2(this, t3);
  }
}
var j = t2.litHtmlPolyfillSupport;
j?.(N, R), (t2.litHtmlVersions ??= []).push("3.3.0");
var B = (t3, i4, s3) => {
  const e4 = s3?.renderBefore ?? i4;
  let h3 = e4._$litPart$;
  if (h3 === undefined) {
    const t4 = s3?.renderBefore ?? null;
    e4._$litPart$ = h3 = new R(i4.insertBefore(l2(), t4), t4, undefined, s3 ?? {});
  }
  return h3._$AI(t3), h3;
};
// node_modules/lit-element/lit-element.js
var s3 = globalThis;

class i4 extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = undefined;
  }
  createRenderRoot() {
    const t3 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t3.firstChild, t3;
  }
  update(t3) {
    const r4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = B(r4, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return T;
  }
}
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.0");
// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t4) => (e4, o5) => {
  o5 !== undefined ? o5.addInitializer(() => {
    customElements.define(t4, e4);
  }) : customElements.define(t4, e4);
};
// node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t4 = o5, e4, r5) => {
  const { kind: n4, metadata: i5 } = r5;
  let s4 = globalThis.litPropertyMetadata.get(i5);
  if (s4 === undefined && globalThis.litPropertyMetadata.set(i5, s4 = new Map), n4 === "setter" && ((t4 = Object.create(t4)).wrapped = true), s4.set(r5.name, t4), n4 === "accessor") {
    const { name: o6 } = r5;
    return { set(r6) {
      const n5 = e4.get.call(this);
      e4.set.call(this, r6), this.requestUpdate(o6, n5, t4);
    }, init(e5) {
      return e5 !== undefined && this.C(o6, undefined, t4, e5), e5;
    } };
  }
  if (n4 === "setter") {
    const { name: o6 } = r5;
    return function(r6) {
      const n5 = this[o6];
      e4.call(this, r6), this.requestUpdate(o6, n5, t4);
    };
  }
  throw Error("Unsupported decorator location: " + n4);
};
function n4(t4) {
  return (e4, o6) => typeof o6 == "object" ? r4(t4, e4, o6) : ((t5, e5, o7) => {
    const r5 = e5.hasOwnProperty(o7);
    return e5.constructor.createProperty(o7, t5), r5 ? Object.getOwnPropertyDescriptor(e5, o7) : undefined;
  })(t4, e4, o6);
}
// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}
// package.json
var version = "0.18.1";

// node_modules/custom-card-helpers/dist/index.m.js
var t4;
var r6;
(function(e5) {
  e5.language = "language", e5.system = "system", e5.comma_decimal = "comma_decimal", e5.decimal_comma = "decimal_comma", e5.space_comma = "space_comma", e5.none = "none";
})(t4 || (t4 = {})), function(e5) {
  e5.language = "language", e5.system = "system", e5.am_pm = "12", e5.twenty_four = "24";
}(r6 || (r6 = {}));
var $2 = new Set(["fan", "input_boolean", "light", "switch", "group", "automation"]);
var ne = function(e5, t5, r7, n5) {
  n5 = n5 || {}, r7 = r7 == null ? {} : r7;
  var i5 = new Event(t5, { bubbles: n5.bubbles === undefined || n5.bubbles, cancelable: Boolean(n5.cancelable), composed: n5.composed === undefined || n5.composed });
  return i5.detail = r7, e5.dispatchEvent(i5), i5;
};
var ie = new Set(["call-service", "divider", "section", "weblink", "cast", "select"]);
var de = function(e5, t5, r7) {
  r7 === undefined && (r7 = false), r7 ? history.replaceState(null, "", t5) : history.pushState(null, "", t5), ne(window, "location-changed", { replace: r7 });
};

// src/config.ts
var DesktopPosition;
((DesktopPosition2) => {
  DesktopPosition2["top"] = "top";
  DesktopPosition2["left"] = "left";
  DesktopPosition2["bottom"] = "bottom";
  DesktopPosition2["right"] = "right";
})(DesktopPosition ||= {});
var DEFAULT_NAVBAR_CONFIG = {
  routes: [],
  template: undefined,
  layout: {
    auto_padding: {
      enabled: true,
      desktop_px: 100,
      mobile_px: 80,
      media_player_px: 100
    }
  },
  desktop: {
    show_labels: false,
    show_popup_label_backgrounds: false,
    min_width: 768,
    position: "bottom" /* bottom */
  },
  mobile: {
    show_labels: false,
    show_popup_label_backgrounds: false,
    mode: "docked"
  }
};
var STUB_CONFIG = {
  routes: [
    { url: window.location.pathname, icon: "mdi:home", label: "Home" },
    {
      url: `${window.location.pathname}/devices`,
      icon: "mdi:devices",
      label: "Devices",
      hold_action: {
        action: "navigate",
        navigation_path: "/config/devices/dashboard"
      }
    },
    {
      url: "/config/automation/dashboard",
      icon: "mdi:creation",
      label: "Automations"
    },
    { url: "/config/dashboard", icon: "mdi:cog", label: "Settings" },
    {
      icon: "mdi:dots-horizontal",
      label: "More",
      tap_action: {
        action: "open-popup"
      },
      popup: [
        { icon: "mdi:cog", url: "/config/dashboard" },
        {
          icon: "mdi:hammer",
          url: "/developer-tools/yaml"
        },
        {
          icon: "mdi:power",
          tap_action: {
            action: "call-service",
            service: "homeassistant.restart",
            service_data: {},
            confirmation: {
              text: "Are you sure you want to restart Home Assistant?"
            }
          }
        }
      ]
    }
  ]
};

// src/dom-utils.ts
var DASHBOARD_PADDING_STYLE_ID = "navbar-card-forced-padding-styles";
var DEFAULT_STYLES_ID = "navbar-card-default-styles";
var USER_STYLES_ID = "navbar-card-user-styles";
var getNavbarTemplates = () => {
  const lovelacePanel = document?.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer partial-panel-resolver ha-panel-lovelace");
  if (lovelacePanel) {
    return lovelacePanel.lovelace.config["navbar-templates"];
  }
  return null;
};
var forceResetRipple = (target) => {
  const rippleElements = target?.querySelectorAll("ha-ripple");
  rippleElements.forEach((ripple) => {
    setTimeout(() => {
      ripple.hovered = false;
      ripple.pressed = false;
    }, 10);
  });
};
var findHuiRoot = () => {
  return window.document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-panel-lovelace")?.shadowRoot?.querySelector("hui-root");
};
var forceOpenEditMode = () => {
  const huiRoot = findHuiRoot();
  if (!huiRoot?.shadowRoot)
    return;
  huiRoot.lovelace.setEditMode(true);
};
var removeDashboardPadding = () => {
  const huiRoot = findHuiRoot();
  if (!huiRoot?.shadowRoot)
    return;
  const styleEl = huiRoot.shadowRoot.querySelector(`#${DASHBOARD_PADDING_STYLE_ID}`);
  if (styleEl) {
    styleEl.remove();
  }
};
var forceDashboardPadding = (options) => {
  const autoPaddingEnabled = options?.auto_padding?.enabled ?? DEFAULT_NAVBAR_CONFIG.layout?.auto_padding?.enabled;
  const huiRoot = findHuiRoot();
  if (!huiRoot?.shadowRoot) {
    console.warn("[navbar-card] Could not find hui-root. Custom padding styles will not be applied.");
    return;
  }
  let styleEl = huiRoot.shadowRoot.querySelector(`#${DASHBOARD_PADDING_STYLE_ID}`);
  if (!autoPaddingEnabled) {
    if (styleEl) {
      styleEl.remove();
    }
    return;
  }
  const desktopMinWidth = options?.desktop?.min_width ?? 768;
  const mobileMaxWidth = desktopMinWidth - 1;
  let cssText = "";
  const desktopPaddingPx = options?.auto_padding?.desktop_px ?? DEFAULT_NAVBAR_CONFIG.layout?.auto_padding?.desktop_px ?? 0;
  if (["left", "right"].includes(options?.desktop?.position ?? "") && desktopPaddingPx > 0) {
    cssText += `
      @media (min-width: ${desktopMinWidth}px) {
       :not(.edit-mode) > #view {
            padding-${options?.desktop?.position}: ${desktopPaddingPx}px !important;
          }
      }
    `;
  } else if ((options?.desktop?.position === "bottom" || options?.desktop?.position === "top") && desktopPaddingPx > 0) {
    cssText += `
      @media (min-width: ${desktopMinWidth}px) {
        :not(.edit-mode) > hui-view:${options?.desktop?.position === "top" ? "before" : "after"} {
          content: "";
          display: block;
          height: ${desktopPaddingPx}px;  
          width: 100%;
          background-color: transparent; 
        }
      }
    `;
  }
  let mobilePaddingPx = options?.auto_padding?.mobile_px ?? DEFAULT_NAVBAR_CONFIG.layout?.auto_padding?.mobile_px ?? 0;
  if (options?.show_media_player) {
    mobilePaddingPx += options?.auto_padding?.media_player_px ?? DEFAULT_NAVBAR_CONFIG.layout?.auto_padding?.media_player_px ?? 0;
  }
  if (mobilePaddingPx > 0) {
    cssText += `
      @media (max-width: ${mobileMaxWidth}px) {
        :not(.edit-mode) > hui-view:after {
          content: "";
          display: block;
          height: ${mobilePaddingPx}px;
          width: 100%;
          background-color: transparent; 
          }
        }
      `;
  }
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = DASHBOARD_PADDING_STYLE_ID;
    styleEl.textContent = cssText;
    huiRoot.shadowRoot.appendChild(styleEl);
  } else {
    styleEl.textContent = cssText;
  }
};
function fireDOMEvent(node, type, options, detailOverride, EventConstructor) {
  const constructor = EventConstructor || Event;
  const event = new constructor(type, options);
  if (detailOverride !== undefined) {
    event.detail = detailOverride;
  }
  node.dispatchEvent(event);
  return event;
}
var createStyleElement = (root, id, styles) => {
  const rootEl = root.shadowRoot;
  let styleEl = rootEl?.querySelector(`#${id}`);
  if (styleEl) {
    styleEl.remove();
  }
  styleEl = document.createElement("style");
  styleEl.id = id;
  styleEl.textContent = styles.cssText;
  rootEl?.appendChild(styleEl);
};
var injectStyles = (root, defaultStyles, userStyles) => {
  console.log("••••• injectStyles");
  createStyleElement(root, DEFAULT_STYLES_ID, defaultStyles);
  createStyleElement(root, USER_STYLES_ID, userStyles);
};

// src/utils.ts
var mapStringToEnum = (enumType, value) => {
  if (Object.values(enumType).includes(value)) {
    return value;
  }
  return;
};
var processBadgeTemplate = (hass, template) => {
  if (!template || !hass)
    return false;
  try {
    const func = new Function("states", `return ${template}`);
    return func(hass.states);
  } catch (e5) {
    console.error(`NavbarCard: Error evaluating badge template: ${e5}`);
    return false;
  }
};
var generateHash = (str) => {
  let hash = 0;
  for (let i5 = 0;i5 < str.length; i5++) {
    hash = (hash << 5) - hash + str.charCodeAt(i5);
  }
  return hash.toString();
};
var templateFunctionCache = new Map;
var extractAccessibleStateVariables = (navbar) => {
  return {
    isDesktop: navbar.isDesktop ?? false
  };
};
var processTemplate = (hass, navbar, template) => {
  if (!template)
    return template;
  if (typeof template !== "string")
    return template;
  if (!(template.trim().startsWith("[[[") && template.trim().endsWith("]]]"))) {
    return template;
  }
  try {
    const cleanTemplate = template.replace(/\[\[\[|\]\]\]/g, "");
    const hashedTemplate = generateHash(cleanTemplate);
    let func = templateFunctionCache.get(hashedTemplate);
    if (!func) {
      func = new Function("states", "user", "hass", "navbar", cleanTemplate);
      templateFunctionCache.set(hashedTemplate, func);
    }
    return func(hass.states, hass.user, hass, extractAccessibleStateVariables(navbar));
  } catch (e5) {
    console.error(`NavbarCard: Error evaluating template: ${e5}`);
    return template;
  }
};
var hapticFeedback = (hapticType = "selection") => {
  return fireDOMEvent(window, "haptic", undefined, hapticType);
};

// src/styles.ts
var HOST_STYLES = i`
  :host {
    --navbar-border-radius: var(--ha-card-border-radius, 12px);
    --navbar-background-color: var(--card-background-color);
    --navbar-route-icon-size: 24px;
    --navbar-route-image-size: 32px;
    --navbar-primary-color: var(--primary-color);
    --navbar-box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.14);
    --navbar-box-shadow-desktop: var(--material-shadow-elevation-2dp);
    --navbar-box-shadow-mobile-floating: var(--material-shadow-elevation-2dp);

    --navbar-z-index: 3;
    --navbar-popup-backdrop-z-index: 900;
    --navbar-popup-z-index: 901;
  }
`;
var NAVBAR_CONTAINER_STYLES = i`
  .navbar {
    display: flex;
    flex-direction: column;
    width: 100vw;
    position: fixed;
    gap: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    top: unset;
    z-index: var(--navbar-z-index);
  }

  ha-card {
    background: var(--navbar-background-color);
    border-radius: 0px;
    box-shadow: var(--navbar-box-shadow);
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px;
    gap: 10px;
  }

  .navbar-card {
    justify-content: space-between;
    width: 100%;
  }

  /* Edit mode styles */
  .navbar.edit-mode {
    position: relative !important;
    flex-direction: column !important;
    left: unset !important;
    right: unset !important;
    bottom: unset !important;
    width: auto !important;
    top: unset !important;
    transform: none !important;
  }

  .navbar.edit-mode ha-card {
    width: 100% !important;
    flex-direction: row !important;
  }

  /* Mobile floating style */
  .navbar-card.mobile.floating {
    border: none !important;
    box-shadow: var(--navbar-box-shadow-mobile-floating) !important;
    border-radius: var(--navbar-border-radius) !important;
    margin-bottom: 10px;
    width: 90%;
  }

  /* Desktop mode styles */
  .navbar.desktop {
    width: auto;
    justify-content: space-evenly;
    --navbar-route-icon-size: 28px;
  }

  .navbar-card.desktop {
    border-radius: var(--navbar-border-radius);
    box-shadow: var(--navbar-box-shadow-desktop);
  }

  .navbar.desktop.bottom {
    flex-direction: column;
    top: unset;
    right: unset;
    bottom: 16px;
    left: calc(50% + var(--mdc-drawer-width, 0px) / 2);
    transform: translate(-50%, 0);
  }

  .navbar-card.desktop.bottom {
    flex-direction: row;
  }

  .navbar.desktop.top {
    flex-direction: column;
    bottom: unset;
    right: unset;
    top: 16px;
    left: calc(50% + var(--mdc-drawer-width, 0px) / 2);
    transform: translate(-50%, 0);
  }

  .navbar-card.desktop.top {
    flex-direction: row;
  }

  .navbar.desktop.left {
    flex-direction: row-reverse;
    left: calc(var(--mdc-drawer-width, 0px) + 16px);
    right: unset;
    bottom: unset;
    top: 50%;
    transform: translate(0, -50%);
  }

  .navbar-card.desktop.left {
    flex-direction: column;
  }

  .navbar.desktop.right {
    flex-direction: row;
    right: 16px;
    left: unset;
    bottom: unset;
    top: 50%;
    transform: translate(0, -50%);
  }

  .navbar-card.desktop.right {
    flex-direction: column;
  }
`;
var MEDIA_PLAYER_STYLES = i`
  .media-player.error {
    padding: 0px !important;
  }

  .media-player.error ha-alert {
    width: 100%;
  }

  .media-player {
    cursor: pointer;
    width: 90%;
    overflow: hidden;
    position: relative;
    border: none;
    box-shadow: var(--navbar-box-shadow-mobile-floating);
    border-radius: var(--navbar-border-radius);
    display: flex;
    flex-direction: row;
  }

  .media-player .media-player-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    opacity: 0.03;
    z-index: 0;
  }

  .media-player .media-player-image {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    object-fit: cover;
    margin-right: 6px;
  }

  .media-player .media-player-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .media-player .media-player-title {
    font-size: 14px;
    font-weight: 500;
  }

  .media-player .media-player-artist {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .media-player .media-player-button {
    width: 38px;
    --ha-button-height: 38px;
    --ha-button-border-radius: 999px;
  }

  .media-player .media-player-button.media-player-button-play-pause {
  }

  .media-player .media-player-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  .media-player .media-player-progress-bar-fill {
    background-color: var(--navbar-primary-color);
    height: 100%;
  }
`;
var ROUTE_STYLES = i`
  .route {
    cursor: pointer;
    max-width: 60px;
    width: 100%;
    position: relative;
    text-decoration: none;
    color: var(--primary-text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    --icon-primary-color: var(--state-inactive-color);
  }

  /* Button styling */
  .button {
    position: relative;
    height: 36px;
    width: 100%;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .button.active {
    background: color-mix(
      in srgb,
      var(--navbar-primary-color) 30%,
      transparent
    );
    --icon-primary-color: var(--navbar-primary-color);
  }

  /* Icon and Image styling */
  .icon {
    --mdc-icon-size: var(--navbar-route-icon-size);
  }

  .image {
    width: var(--navbar-route-image-size);
    height: var(--navbar-route-image-size);
    object-fit: contain;
  }

  .image.active {
  }

  /* Label styling */
  .label {
    flex: 1;
    width: 100%;
    /* TODO fix ellipsis*/
    text-align: center;
    font-size: var(--paper-font-caption_-_font-size, 12px);
    font-weight: 500;
  }

  /* Badge styling */
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 999px;
    width: 12px;
    height: 12px;
  }
  .badge.with-counter {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;
    width: auto !important;
    min-width: 16px;
    padding: 0px 2px;
    font-weight: bold;
    font-size: 11px;
    line-height: 11px;
  }

  /* Desktop mode styles */
  .desktop .route {
    height: 60px;
    width: 60px;
  }
  .desktop .button {
    flex: unset;
    height: 100%;
  }
`;
var POPUP_STYLES = i`
  /****************************************/
  /* Backdrop */
  /****************************************/
  .navbar-popup-backdrop {
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: var(--navbar-popup-backdrop-z-index);
    transition: opacity 0.2s ease;
  }

  .navbar-popup-backdrop.visible {
    opacity: 1;
  }

  /****************************************/
  /* Main popup container */
  /****************************************/
  .navbar-popup {
    pointer-events: none;
    position: fixed;
    opacity: 0;
    padding: 6px;
    gap: 10px;
    z-index: var(--navbar-popup-z-index);

    display: flex;
    justify-content: center;

    transition: all 0.2s ease;
    transform-origin: bottom left;
  }

  .navbar-popup.open-up {
    flex-direction: column-reverse;
    margin-bottom: 32px;
    transform: translate(0, -100%);
  }

  .navbar-popup.open-bottom {
    flex-direction: column;
    margin-top: 32px;
  }

  .navbar-popup.open-right {
    flex-direction: row;
    margin-left: 32px;
  }

  .navbar-popup.open-right.popuplabelbackground {
    gap: 24px;
  }

  .navbar-popup.open-left {
    flex-direction: row-reverse;
    margin-right: 32px;
  }

  .navbar-popup.open-left.popuplabelbackground {
    gap: 24px;
  }

  .navbar-popup.label-right {
    align-items: flex-start;
  }

  .navbar-popup.label-left {
    align-items: flex-end;
  }

  .navbar-popup.visible {
    opacity: 1;
  }

  .navbar-popup.popuplabelbackground {
    padding-left: 0px;
  }

  /****************************************/
  /* Popup item styles */
  /****************************************/

  .popup-item {
    pointer-events: auto;
    cursor: pointer;
    color: var(--primary-text-color);
    display: flex;
    flex-direction: column;
    --icon-primary-color: var(--primary-text-color);
    display: flex;
    flex-direction: row-reverse;
    width: fit-content;
    height: fit-content;
    gap: 6px;
    align-items: center;

    opacity: 0;
    transform: translateY(10px);
    transition: filter 0.2s ease;
    transition: all 0.2s ease;
  }

  .navbar-popup.visible .popup-item {
    opacity: 1;
    transform: translateY(0);
    transition-delay: calc(var(--index) * 0.05s);
  }

  .popup-item.label-bottom {
    flex-direction: column;
    max-width: 80px;
  }

  .popup-item.label-left {
    flex-direction: row-reverse;
  }

  .popup-item.label-right {
    flex-direction: row;
  }

  .popup-item.label-left .label {
    text-align: end;
  }

  .popup-item.label-right .label {
    text-align: start;
  }

  .popup-item .button {
    width: 50px;
    height: 50px;
    background: var(--navbar-background-color);
    box-shadow: var(--navbar-box-shadow-desktop);
  }

  .popup-item .button.popuplabelbackground {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
    flex-direction: row;
    gap: 4px;
  }

  .popup-item.active {
    --icon-primary-color: var(--navbar-primary-color);
  }

  .popup-item.active .button {
    color: var(--navbar-primary-color);
    background: color-mix(in srgb, var(--navbar-primary-color) 30%, white);
  }
`;
var getDefaultStyles = () => {
  return i`
    ${HOST_STYLES}
    ${NAVBAR_CONTAINER_STYLES}
    ${MEDIA_PLAYER_STYLES}
    ${ROUTE_STYLES}
    ${POPUP_STYLES}
  `;
};

// src/color.ts
var hexToDecimal = (hex) => parseInt(hex, 16);
var decimalToHex = (decimal) => decimal.toString(16).padStart(2, "0");
var isValidInt = (value) => {
  try {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue))
      return false;
  } catch {
    return false;
  }
  return true;
};
var hue2rgb = (p3, q, t5) => {
  if (t5 < 0)
    t5 += 1;
  if (t5 > 1)
    t5 -= 1;
  if (t5 < 1 / 6)
    return p3 + (q - p3) * 6 * t5;
  if (t5 < 1 / 2)
    return q;
  if (t5 < 2 / 3)
    return p3 + (q - p3) * (2 / 3 - t5) * 6;
  return p3;
};
var complementaryRGBColor = (r7, g2, b3) => {
  if (Math.max(r7, g2, b3) == Math.min(r7, g2, b3)) {
    return { r: 255 - r7, g: 255 - g2, b: 255 - b3 };
  } else {
    r7 /= 255, g2 /= 255, b3 /= 255;
    const max = Math.max(r7, g2, b3), min = Math.min(r7, g2, b3);
    let h3 = 0;
    const l3 = (max + min) / 2;
    const d3 = max - min;
    const s4 = l3 > 0.5 ? d3 / (2 - max - min) : d3 / (max + min);
    switch (max) {
      case r7:
        h3 = (g2 - b3) / d3 + (g2 < b3 ? 6 : 0);
        break;
      case g2:
        h3 = (b3 - r7) / d3 + 2;
        break;
      case b3:
        h3 = (r7 - g2) / d3 + 4;
        break;
    }
    h3 = Math.round(h3 * 60 + 180) % 360;
    h3 /= 360;
    const q = l3 < 0.5 ? l3 * (1 + s4) : l3 + s4 - l3 * s4;
    const p3 = 2 * l3 - q;
    r7 = hue2rgb(p3, q, h3 + 1 / 3);
    g2 = hue2rgb(p3, q, h3);
    b3 = hue2rgb(p3, q, h3 - 1 / 3);
    return {
      r: Math.round(r7 * 255),
      g: Math.round(g2 * 255),
      b: Math.round(b3 * 255)
    };
  }
};

class Color {
  static colorCache = new Map;
  r = 0;
  g = 0;
  b = 0;
  a = 255;
  constructor(data) {
    if (data instanceof Color) {
      this.r = data.r;
      this.g = data.g;
      this.b = data.b;
      this.a = data.a;
    } else if (typeof data == "string") {
      if (data.startsWith("#")) {
        this._parseHexString(data);
      } else if (data.startsWith("rgb(")) {
        this._parseRGBString(data);
      } else if (data.startsWith("rgba(")) {
        this._parseRGBAString(data);
      } else if (isValidInt(data)) {
        this._parseHexString(`#${data}`);
      } else {
        try {
          this._readColorFromDOM(data);
        } catch {
          throw Error(`Format not supported for color string: "${data}"`);
        }
      }
    } else if (Array.isArray(data)) {
      this._parseColorArray(data);
    } else {
      throw Error(`Format not supported for color: "${typeof data}"`);
    }
  }
  static from(color) {
    const normalizedColor = color.toLowerCase().trim();
    if (!this.colorCache.has(normalizedColor)) {
      this.colorCache.set(normalizedColor, new Color(normalizedColor));
    }
    return this.colorCache.get(normalizedColor);
  }
  _readColorFromDOM(color) {
    const d3 = document.createElement("div");
    d3.style.color = color;
    document.body.appendChild(d3);
    const parsedColor = window.getComputedStyle(d3).color;
    this._parseRGBString(parsedColor);
  }
  _parseColorArray(data) {
    const colorArray = data.map((x2) => parseInt(x2));
    if (colorArray.length < 3) {
      throw Error(`Invalid array format color string: "${data}"
Supported formats: [r,g,b] | [r,g,b,a]`);
    }
    this.r = colorArray[0];
    this.g = colorArray[1];
    this.b = colorArray[2];
    this.a = colorArray.at(3) ?? this.a;
  }
  _parseRGBString(data) {
    const colorString = data.replace("rgb(", "").replace(")", "");
    const colorComponents = colorString.split(",");
    if (data.indexOf("rgb(") == -1 || colorComponents.length != 3) {
      throw Error(`Invalid 'rgb(r,g,b)' format for color string: "${data}"`);
    }
    this.r = parseInt(colorComponents[0]);
    this.g = parseInt(colorComponents[1]);
    this.b = parseInt(colorComponents[2]);
  }
  _parseRGBAString(data) {
    const colorString = data.replace("rgba(", "").replace(")", "");
    const colorComponents = colorString.split(",");
    if (data.indexOf("rgba(") == -1 || colorComponents.length != 4) {
      throw Error(`Invalid 'rgba(r,g,b,a)' format for color string: "${data}"`);
    }
    this.r = parseInt(colorComponents[0]);
    this.g = parseInt(colorComponents[1]);
    this.b = parseInt(colorComponents[2]);
    this.a = parseInt(colorComponents[3]);
  }
  _parseHexString(data) {
    const colorString = data.replace("#", "");
    switch (colorString.length) {
      case 3:
        this.r = hexToDecimal(colorString.slice(0, 1) + colorString.slice(0, 1));
        this.g = hexToDecimal(colorString.slice(1, 2) + colorString.slice(1, 2));
        this.b = hexToDecimal(colorString.slice(2, 3) + colorString.slice(2, 3));
        break;
      case 6:
        this.r = hexToDecimal(colorString.slice(0, 2));
        this.g = hexToDecimal(colorString.slice(2, 4));
        this.b = hexToDecimal(colorString.slice(4, 6));
        break;
      case 8:
        this.r = hexToDecimal(colorString.slice(0, 2));
        this.g = hexToDecimal(colorString.slice(2, 4));
        this.b = hexToDecimal(colorString.slice(4, 6));
        this.a = hexToDecimal(colorString.slice(6, 8));
        break;
      default:
        throw Error(`Invalid hex format for color string: "${data}"`);
    }
  }
  opacity(opacity) {
    this.a = Math.max(0, Math.min(opacity * 255, 255));
    return this;
  }
  complementary() {
    const { r: r7, g: g2, b: b3 } = complementaryRGBColor(this.r, this.g, this.b);
    return new Color([r7, g2, b3, this.a]);
  }
  shade(percent) {
    let R2 = this.r * (100 + percent) / 100;
    let G = this.g * (100 + percent) / 100;
    let B2 = this.b * (100 + percent) / 100;
    R2 = R2 < 255 ? R2 : 255;
    G = G < 255 ? G : 255;
    B2 = B2 < 255 ? B2 : 255;
    R2 = Math.round(R2);
    G = Math.round(G);
    B2 = Math.round(B2);
    const brightness = Math.round((R2 * 299 + G * 587 + B2 * 114) / 1000);
    if (brightness == 0)
      return this.complementary();
    if (brightness < 80 && percent < 100)
      return this.shade(percent + 50);
    return new Color([R2, G, B2]);
  }
  contrastingColor() {
    return new Color(this.luma() >= 165 ? "#000" : "#fff");
  }
  luma() {
    return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b;
  }
  rgb() {
    return { r: this.r, g: this.g, b: this.b };
  }
  rgba() {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
  hex() {
    return `#${decimalToHex(this.r)}${decimalToHex(this.g)}${decimalToHex(this.b)}`;
  }
  hexa() {
    return `#${decimalToHex(this.a)}${decimalToHex(this.r)}${decimalToHex(this.g)}${decimalToHex(this.b)}`;
  }
  array() {
    return [this.r, this.g, this.b, this.a];
  }
}

// src/navbar-card.ts
window.customCards = window.customCards || [];
window.customCards.push({
  type: "navbar-card",
  name: "Navbar card",
  preview: true,
  description: "Card with a full-width bottom nav on mobile and a flexible nav on desktop that can be placed on any side of the screen."
});
var DEFAULT_DESKTOP_POSITION = "bottom" /* bottom */;
var DOUBLE_TAP_DELAY = 250;
var HOLD_ACTION_DELAY = 500;

class NavbarCard extends i4 {
  holdTimeoutId = null;
  holdTriggered = false;
  pointerStartX = 0;
  pointerStartY = 0;
  lastTapTime = 0;
  lastTapTarget = null;
  tapTimeoutId = null;
  connectedCallback() {
    super.connectedCallback();
    forceResetRipple(this);
    window.addEventListener("resize", this._checkDesktop);
    this._checkDesktop();
    const homeAssistantRoot = document.querySelector("body > home-assistant");
    this._inEditDashboardMode = this.parentElement?.closest("hui-card-edit-mode") != null;
    this._inEditCardMode = homeAssistantRoot?.shadowRoot?.querySelector("hui-dialog-edit-card")?.shadowRoot?.querySelector("ha-dialog") != null;
    this._inPreviewMode = this.parentElement?.closest(".card > .preview") != null;
    injectStyles(this, getDefaultStyles(), this._config?.styles ? r(this._config.styles) : i``);
    forceDashboardPadding({
      desktop: this._config?.desktop ?? DEFAULT_NAVBAR_CONFIG.desktop,
      mobile: this._config?.mobile ?? DEFAULT_NAVBAR_CONFIG.mobile,
      auto_padding: this._config?.layout?.auto_padding,
      show_media_player: this._showMediaPlayer ?? false
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._checkDesktop);
    removeDashboardPadding();
    this._popup = null;
  }
  set hass(hass) {
    this._hass = hass;
    const { visible } = this._shouldShowMediaPlayer();
    if (this._showMediaPlayer !== visible) {
      this._showMediaPlayer = visible;
    }
  }
  setConfig(config) {
    if (config?.template) {
      const templates = getNavbarTemplates();
      if (!templates) {
        console.warn('[navbar-card] No templates configured in this dashboard. Please refer to "templates" documentation for more information.' + `

` + `https://github.com/joseluis9595/lovelace-navbar-card?tab=readme-ov-file#templates
`);
      } else {
        const templateConfig = templates[config.template];
        if (templateConfig) {
          config = {
            ...templateConfig,
            ...config
          };
        }
      }
    }
    if (!config.routes) {
      throw new Error('"routes" param is required for navbar card');
    }
    config.routes.forEach((route) => {
      if (route.icon == null && route.image == null) {
        throw new Error('Each route must have either an "icon" or "image" property configured');
      }
      if (route.popup == null && route.submenu == null && route.tap_action == null && route.hold_action == null && route.url == null && route.double_tap_action == null) {
        throw new Error('Each route must have either "url", "popup", "tap_action", "hold_action" or "double_tap_action" property configured');
      }
      if (route.tap_action && route.tap_action.action == null) {
        throw new Error('"tap_action" must have an "action" property');
      }
      if (route.hold_action && route.hold_action.action == null) {
        throw new Error('"hold_action" must have an "action" property');
      }
      if (route.double_tap_action && route.double_tap_action.action == null) {
        throw new Error('"double_tap_action" must have an "action" property');
      }
    });
    this._config = config;
  }
  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (_changedProperties.has("_showMediaPlayer")) {
      forceDashboardPadding({
        desktop: this._config?.desktop ?? DEFAULT_NAVBAR_CONFIG.desktop,
        mobile: this._config?.mobile ?? DEFAULT_NAVBAR_CONFIG.mobile,
        auto_padding: this._config?.layout?.auto_padding,
        show_media_player: this._showMediaPlayer ?? false
      });
    }
  }
  static getStubConfig() {
    return STUB_CONFIG;
  }
  _getRouteIcon(route, isActive) {
    const icon = processTemplate(this._hass, this, route.icon);
    const image = processTemplate(this._hass, this, route.image);
    const iconSelected = processTemplate(this._hass, this, route.icon_selected);
    const imageSelected = processTemplate(this._hass, this, route.image_selected);
    return image ? x`<img
          class="image ${isActive ? "active" : ""}"
          src="${isActive && imageSelected ? imageSelected : image}"
          alt="${route.label || ""}" />` : x`<ha-icon
          class="icon ${isActive ? "active" : ""}"
          icon="${isActive && iconSelected ? iconSelected : icon}"></ha-icon>`;
  }
  _shouldShowLabelBackground = () => {
    const enabled = this.isDesktop ? this._config?.desktop?.show_popup_label_backgrounds : this._config?.mobile?.show_popup_label_backgrounds;
    return !!enabled;
  };
  _renderBadge(route, isRouteActive) {
    if (!route.badge) {
      return x``;
    }
    let showBadge = false;
    if (route.badge.show !== undefined) {
      showBadge = processTemplate(this._hass, this, route.badge.show);
    } else if (route.badge.template) {
      showBadge = processBadgeTemplate(this._hass, route.badge.template);
    }
    if (!showBadge) {
      return x``;
    }
    const count = processTemplate(this._hass, this, route.badge.count) ?? null;
    const hasCount = count != null;
    const backgroundColor = processTemplate(this._hass, this, route.badge.color) ?? "red";
    const textColor = processTemplate(this._hass, this, route.badge.textColor);
    const contrastingColor = textColor ?? Color.from(backgroundColor).contrastingColor().hex();
    return x`<div
      class="badge ${isRouteActive ? "active" : ""} ${hasCount ? "with-counter" : ""}"
      style="background-color: ${backgroundColor}; color: ${contrastingColor}">
      ${count}
    </div>`;
  }
  _shouldTriggerHaptic(actionType, isNavigation = false) {
    const hapticConfig = this._config?.haptic;
    if (typeof hapticConfig === "boolean") {
      return hapticConfig;
    }
    if (!hapticConfig) {
      return !isNavigation;
    }
    if (isNavigation) {
      return hapticConfig.url ?? false;
    }
    switch (actionType) {
      case "tap":
        return hapticConfig.tap_action ?? false;
      case "hold":
        return hapticConfig.hold_action ?? false;
      case "double_tap":
        return hapticConfig.double_tap_action ?? false;
      default:
        return false;
    }
  }
  _shouldShowLabels = (isSubmenu) => {
    const config = this.isDesktop ? this._config?.desktop?.show_labels : this._config?.mobile?.show_labels;
    if (typeof config === "boolean")
      return config;
    return config === "popup_only" && isSubmenu || config === "routes_only" && !isSubmenu;
  };
  _checkDesktop = () => {
    this.isDesktop = (window.innerWidth ?? 0) >= (this._config?.desktop?.min_width ?? 768);
  };
  _renderRoute = (route) => {
    const isActive = route.selected != null ? processTemplate(this._hass, this, route.selected) : window.location.pathname == route.url;
    const isHidden = processTemplate(this._hass, this, route.hidden);
    if (isHidden) {
      return null;
    }
    const label = this._shouldShowLabels(false) ? processTemplate(this._hass, this, route.label) ?? " " : null;
    return x`
      <div
        class="route ${isActive ? "active" : ""}"
        @mouseenter=${(e5) => this._handleMouseEnter(e5, route)}
        @mousemove=${(e5) => this._handleMouseMove(e5, route)}
        @mouseleave=${(e5) => this._handleMouseLeave(e5, route)}
        @pointerdown=${(e5) => this._handlePointerDown(e5, route)}
        @pointermove=${(e5) => this._handlePointerMove(e5, route)}
        @pointerup=${(e5) => this._handlePointerUp(e5, route)}
        @pointercancel=${(e5) => this._handlePointerMove(e5, route)}>
        <div class="button ${isActive ? "active" : ""}">
          ${this._getRouteIcon(route, isActive)}
          <ha-ripple></ha-ripple>
        </div>

        ${label ? x`<div class="label ${isActive ? "active" : ""}">${label}</div>` : x``}
        ${this._renderBadge(route, isActive)}
      </div>
    `;
  };
  _closePopup = () => {
    const popup = this.shadowRoot?.querySelector(".navbar-popup");
    const backdrop = this.shadowRoot?.querySelector(".navbar-popup-backdrop");
    if (popup && backdrop) {
      popup.classList.remove("visible");
      backdrop.classList.remove("visible");
      setTimeout(() => {
        this._popup = null;
      }, 200);
    } else {
      this._popup = null;
    }
    window.removeEventListener("keydown", this._onPopupKeyDownListener);
  };
  _getPopupStyles(anchorRect, position) {
    const windowWidth = window.innerWidth;
    switch (position) {
      case "top":
        return {
          style: i`
            top: ${anchorRect.top + anchorRect.height}px;
            left: ${anchorRect.x}px;
          `,
          labelPositionClassName: "label-right",
          popupDirectionClassName: "open-bottom"
        };
      case "left":
        return {
          style: i`
            top: ${anchorRect.top}px;
            left: ${anchorRect.x + anchorRect.width}px;
          `,
          labelPositionClassName: "label-bottom",
          popupDirectionClassName: "open-right"
        };
      case "right":
        return {
          style: i`
            top: ${anchorRect.top}px;
            right: ${windowWidth - anchorRect.x}px;
          `,
          labelPositionClassName: "label-bottom",
          popupDirectionClassName: "open-left"
        };
      case "bottom":
      case "mobile":
      default:
        if (anchorRect.x > windowWidth / 2) {
          return {
            style: i`
              top: ${anchorRect.top}px;
              right: ${windowWidth - anchorRect.x - anchorRect.width}px;
            `,
            labelPositionClassName: "label-left",
            popupDirectionClassName: "open-up"
          };
        } else {
          return {
            style: i`
              top: ${anchorRect.top}px;
              left: ${anchorRect.left}px;
            `,
            labelPositionClassName: "label-right",
            popupDirectionClassName: "open-up"
          };
        }
    }
  }
  _openPopup = (route, target) => {
    const popupItems = route.popup ?? route.submenu;
    if (!popupItems || popupItems.length === 0) {
      console.warn(`[navbar-card] No popup items provided for route: ${route.label}`);
      return;
    }
    const anchorRect = target.getBoundingClientRect();
    const { style, labelPositionClassName, popupDirectionClassName } = this._getPopupStyles(anchorRect, !this.isDesktop ? "mobile" : this._config?.desktop?.position ?? DEFAULT_DESKTOP_POSITION);
    this._popup = x`
      <div class="navbar-popup-backdrop"></div>
      <div
        class="
          navbar-popup
          ${popupDirectionClassName}
          ${labelPositionClassName}
          ${this.isDesktop ? "desktop" : "mobile"}
          ${this._shouldShowLabelBackground() ? "popuplabelbackground" : ""}
        "
        style="${style}">
        ${popupItems.map((popupItem, index) => {
      const isActive = popupItem.selected != null ? processTemplate(this._hass, this, popupItem.selected) : window.location.pathname == popupItem.url;
      const isHidden = processTemplate(this._hass, this, popupItem.hidden);
      if (isHidden) {
        return null;
      }
      const label = this._shouldShowLabels(true) ? processTemplate(this._hass, this, popupItem.label) ?? " " : null;
      const showLabelBackground = this._shouldShowLabelBackground();
      return x`<div
              class="
              popup-item 
              ${popupDirectionClassName}
              ${labelPositionClassName}
              ${isActive ? "active" : ""}
              "
              style="--index: ${index}"
              @click=${(e5) => this._handlePointerUp(e5, popupItem, true)}>
              <div
                class="button ${showLabelBackground ? "popuplabelbackground" : ""}">
                ${this._getRouteIcon(popupItem, isActive)}
                <md-ripple></md-ripple>
                ${this._renderBadge(popupItem, false)}
                ${showLabelBackground && label ? x`<div class="label">${label}</div>` : x``}
              </div>
              ${!showLabelBackground && label ? x`<div class="label">${label}</div>` : x``}
            </div>`;
    }).filter((x2) => x2 != null)}
      </div>
    `;
    requestAnimationFrame(() => {
      const popup = this.shadowRoot?.querySelector(".navbar-popup");
      const backdrop = this.shadowRoot?.querySelector(".navbar-popup-backdrop");
      if (popup && backdrop) {
        popup.classList.add("visible");
        backdrop.classList.add("visible");
      }
    });
    window.addEventListener("keydown", this._onPopupKeyDownListener);
    setTimeout(() => {
      const backdrop = this.shadowRoot?.querySelector(".navbar-popup-backdrop");
      if (backdrop) {
        backdrop.addEventListener("click", (e5) => {
          e5.preventDefault();
          e5.stopPropagation();
          this._closePopup();
        });
      }
    }, 400);
  };
  _onPopupKeyDownListener = (e5) => {
    if (e5.key === "Escape" && this._popup) {
      e5.preventDefault();
      this._closePopup();
    }
  };
  _handleMouseEnter = (e5, _route) => {
    const ripple = e5.currentTarget.querySelector("ha-ripple");
    if (ripple)
      ripple.hovered = true;
  };
  _handleMouseMove = (e5, _route) => {
    const ripple = e5.currentTarget.querySelector("ha-ripple");
    if (ripple)
      ripple.hovered = true;
  };
  _handleMouseLeave = (e5, _route) => {
    const ripple = e5.currentTarget.querySelector("ha-ripple");
    if (ripple)
      ripple.hovered = false;
  };
  _handlePointerDown = (e5, route) => {
    this.pointerStartX = e5.clientX;
    this.pointerStartY = e5.clientY;
    if (route.hold_action) {
      this.holdTriggered = false;
      this.holdTimeoutId = window.setTimeout(() => {
        if (this._shouldTriggerHaptic("hold")) {
          hapticFeedback();
        }
        this.holdTriggered = true;
      }, HOLD_ACTION_DELAY);
    }
  };
  _handlePointerMove = (e5, _route) => {
    if (!this.holdTimeoutId) {
      return;
    }
    const moveX = Math.abs(e5.clientX - this.pointerStartX);
    const moveY = Math.abs(e5.clientY - this.pointerStartY);
    if (moveX > 10 || moveY > 10) {
      if (this.holdTimeoutId !== null) {
        clearTimeout(this.holdTimeoutId);
        this.holdTimeoutId = null;
      }
    }
  };
  _handlePointerUp = (e5, route, isPopup = false) => {
    if (this.holdTimeoutId !== null) {
      clearTimeout(this.holdTimeoutId);
      this.holdTimeoutId = null;
    }
    const currentTarget = e5.currentTarget;
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastTapTime;
    const isDoubleTap = timeDiff < DOUBLE_TAP_DELAY && e5.target === this.lastTapTarget;
    if (isDoubleTap && route.double_tap_action) {
      if (this.tapTimeoutId !== null) {
        clearTimeout(this.tapTimeoutId);
        this.tapTimeoutId = null;
      }
      this._handleDoubleTapAction(currentTarget, route, isPopup);
      this.lastTapTime = 0;
      this.lastTapTarget = null;
    } else if (this.holdTriggered && route.hold_action) {
      this._handleHoldAction(currentTarget, route, isPopup);
      this.lastTapTime = 0;
      this.lastTapTarget = null;
    } else {
      this.lastTapTime = currentTime;
      this.lastTapTarget = e5.target;
      this._handleTapAction(currentTarget, route, isPopup);
    }
    this.holdTriggered = false;
  };
  _handleHoldAction = (target, route, isPopupItem = false) => {
    this._executeAction(target, route, route.hold_action, "hold", isPopupItem);
  };
  _handleDoubleTapAction = (target, route, isPopupItem = false) => {
    this._executeAction(target, route, route.double_tap_action, "double_tap", isPopupItem);
  };
  _handleTapAction = (target, route, isPopupItem = false) => {
    if (route.double_tap_action) {
      this.tapTimeoutId = window.setTimeout(() => {
        this._executeAction(target, route, route.tap_action, "tap", isPopupItem);
      }, DOUBLE_TAP_DELAY);
    } else {
      this._executeAction(target, route, route.tap_action, "tap", isPopupItem);
    }
  };
  _chooseKeyForQuickbar = (action) => {
    switch (action.mode) {
      case "devices":
        return "d";
      case "entities":
        return "e";
      case "commands":
      default:
        return "c";
    }
  };
  _executeAction = (target, route, action, actionType, isPopupItem = false) => {
    forceResetRipple(target);
    if (action?.action !== "open-popup" && isPopupItem) {
      this._closePopup();
    }
    switch (action?.action) {
      case "open-popup":
        if (!isPopupItem) {
          const popupItems = route.popup ?? route.submenu;
          if (!popupItems) {
            console.error(`[navbar-card] No popup items found for route: ${route.label}`);
          } else {
            if (this._shouldTriggerHaptic(actionType)) {
              hapticFeedback();
            }
            this._openPopup(route, target);
          }
        }
        break;
      case "toggle-menu":
        if (this._shouldTriggerHaptic(actionType)) {
          hapticFeedback();
        }
        fireDOMEvent(this, "hass-toggle-menu", {
          bubbles: true,
          composed: true
        });
        break;
      case "quickbar":
        if (this._shouldTriggerHaptic(actionType)) {
          hapticFeedback();
        }
        fireDOMEvent(this, "keydown", {
          bubbles: true,
          composed: true,
          key: this._chooseKeyForQuickbar(action)
        }, undefined, KeyboardEvent);
        break;
      case "show-notifications":
        if (this._shouldTriggerHaptic(actionType)) {
          hapticFeedback();
        }
        fireDOMEvent(this, "hass-show-notifications", {
          bubbles: true,
          composed: true
        });
        break;
      case "navigate-back":
        if (this._shouldTriggerHaptic(actionType, true)) {
          hapticFeedback();
        }
        window.history.back();
        break;
      case "open-edit-mode":
        if (this._shouldTriggerHaptic(actionType)) {
          hapticFeedback();
        }
        forceOpenEditMode();
        break;
      default:
        if (action != null) {
          if (this._shouldTriggerHaptic(actionType)) {
            hapticFeedback();
          }
          setTimeout(() => {
            fireDOMEvent(this, "hass-action", { bubbles: true, composed: true }, {
              action: actionType,
              config: {
                [`${actionType}_action`]: action
              }
            });
          }, 10);
        } else if (actionType === "tap" && route.url) {
          if (this._shouldTriggerHaptic(actionType, true)) {
            hapticFeedback();
          }
          de(this, route.url);
        }
        break;
    }
  };
  _shouldShowMediaPlayer = () => {
    if (!this._config || !this._config.media_player || !this._config.media_player.entity) {
      return { visible: false };
    }
    if (this.isDesktop)
      return { visible: false };
    const entity = processTemplate(this._hass, this, this._config.media_player.entity);
    const mediaPlayerState = this._hass.states[entity];
    if (!mediaPlayerState)
      return {
        visible: true,
        error: `Entity not found "${entity}"`
      };
    if (this._config.media_player.show != null) {
      const show = processTemplate(this._hass, this, this._config.media_player.show);
      return { visible: show };
    }
    return {
      visible: ["playing", "paused"].includes(mediaPlayerState?.state)
    };
  };
  _handleMediaPlayerClick = (e5) => {
    e5.preventDefault();
    e5.stopPropagation();
    const entity = processTemplate(this._hass, this, this._config?.media_player?.entity);
    if (!entity)
      return;
    fireDOMEvent(this, "hass-more-info", {
      bubbles: true,
      composed: true
    }, {
      entityId: entity
    });
  };
  _handleMediaPlayerSkipNextClick = (e5) => {
    e5.preventDefault();
    e5.stopPropagation();
    const entity = processTemplate(this._hass, this, this._config?.media_player?.entity);
    if (!entity)
      return;
    this._hass.callService("media_player", "media_next_track", {
      entity_id: entity
    });
  };
  _handleMediaPlayerPlayPauseClick = (e5) => {
    e5.preventDefault();
    e5.stopPropagation();
    const entity = processTemplate(this._hass, this, this._config?.media_player?.entity);
    if (!entity)
      return;
    const mediaPlayerState = this._hass.states[entity];
    if (!mediaPlayerState)
      return;
    if (mediaPlayerState.state === "playing") {
      this._hass.callService("media_player", "media_pause", {
        entity_id: entity
      });
    } else {
      this._hass.callService("media_player", "media_play", {
        entity_id: entity
      });
    }
  };
  _renderMediaPlayer = () => {
    const { visible, error } = this._shouldShowMediaPlayer();
    if (!visible)
      return x``;
    const entity = processTemplate(this._hass, this, this._config.media_player.entity);
    if (error) {
      return x`<ha-card class="media-player error">
        <ha-alert alert-type="error"> ${error} </ha-alert>
      </ha-card>`;
    }
    const mediaPlayerState = this._hass.states[entity];
    const progress = mediaPlayerState.attributes.media_position != null ? mediaPlayerState.attributes.media_position / mediaPlayerState.attributes.media_duration : null;
    return x`
      <ha-card class="media-player" @click=${this._handleMediaPlayerClick}>
        <div
          class="media-player-bg"
          style="background-image: url(${mediaPlayerState.attributes.entity_picture});"></div>
        ${progress != null ? x` <div class="media-player-progress-bar">
              <div
                class="media-player-progress-bar-fill"
                style="width: ${progress * 100}%"></div>
            </div>` : x``}
        <img
          class="media-player-image"
          src=${mediaPlayerState.attributes.entity_picture}
          alt=${mediaPlayerState.attributes.media_title} />
        <div class="media-player-info">
          <span class="media-player-title"
            >${mediaPlayerState.attributes.media_title}</span
          >
          <span class="media-player-artist"
            >${mediaPlayerState.attributes.media_artist}</span
          >
        </div>
        <ha-button
          class="media-player-button media-player-button-play-pause"
          appearance="accent"
          variant="brand"
          @click=${this._handleMediaPlayerPlayPauseClick}>
          <ha-icon
            icon=${mediaPlayerState.state === "playing" ? "mdi:pause" : "mdi:play"}></ha-icon>
        </ha-button>
        <ha-button
          class="media-player-button media-player-button-skip"
          appearance="plain"
          variant="neutral"
          @click=${this._handleMediaPlayerSkipNextClick}>
          <ha-icon icon="mdi:skip-next"></ha-icon>
        </ha-button>
      </ha-card>
    `;
  };
  render() {
    if (!this._config) {
      return x``;
    }
    const { routes, desktop, mobile } = this._config;
    const { position: desktopPosition, hidden: desktopHidden } = desktop ?? {};
    const { hidden: mobileHidden } = mobile ?? {};
    const isEditMode = this._inEditDashboardMode || this._inPreviewMode || this._inEditCardMode;
    const desktopPositionClassname = mapStringToEnum(DesktopPosition, desktopPosition) ?? DEFAULT_DESKTOP_POSITION;
    const deviceModeClassName = this.isDesktop ? "desktop" : "mobile";
    const editModeClassname = isEditMode ? "edit-mode" : "";
    const mobileModeClassname = mobile?.mode === "floating" ? "floating" : "";
    const isDesktopHidden = processTemplate(this._hass, this, desktopHidden);
    const isMobileHidden = processTemplate(this._hass, this, mobileHidden);
    if (!isEditMode && (this.isDesktop && !!isDesktopHidden || !this.isDesktop && !!isMobileHidden)) {
      return x``;
    }
    return x`
      <div
        class="navbar ${editModeClassname} ${deviceModeClassName} ${desktopPositionClassname} ${mobileModeClassname}">
        ${this._renderMediaPlayer()}
        <ha-card
          class="navbar-card ${deviceModeClassName} ${desktopPositionClassname} ${mobileModeClassname}">
          ${routes?.map(this._renderRoute).filter((x2) => x2 != null)}
        </ha-card>
      </div>
      ${this._popup}
    `;
  }
}
__legacyDecorateClassTS([
  n4({ attribute: false })
], NavbarCard.prototype, "_hass", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_config", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "isDesktop", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_inEditDashboardMode", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_inEditCardMode", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_inPreviewMode", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_popup", undefined);
__legacyDecorateClassTS([
  r5()
], NavbarCard.prototype, "_showMediaPlayer", undefined);
NavbarCard = __legacyDecorateClassTS([
  t3("navbar-card")
], NavbarCard);
console.info(`%c navbar-card%cv${version} `, `background-color: #555;
      padding: 6px 8px;
      padding-right: 6px;
      color: #fff;
      font-weight: 800;
      font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
      text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3); 
      border-radius: 16px 0 0 16px;`, `background-color:rgb(0, 135, 197);
      padding: 6px 8px;
      padding-left: 6px;
      color: #fff;
      font-weight: 800;
      font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
      text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3); 
      border-radius: 0 16px 16px 0;`);
export {
  NavbarCard
};
