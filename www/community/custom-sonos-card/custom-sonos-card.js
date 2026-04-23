//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@lit/reactive-element/css-tag.js
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$5 = globalThis, e$7 = t$5.ShadowRoot && (void 0 === t$5.ShadyCSS || t$5.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$5 = Symbol(), o$6 = /* @__PURE__ */ new WeakMap();
var n$8 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$5) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$7 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$6.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$6.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
var r$7 = (t) => new n$8("string" == typeof t ? t : t + "", void 0, s$5), i$8 = (t, ...e) => {
	return new n$8(1 === t.length ? t[0] : e.reduce(((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1]), t[0]), t, s$5);
}, S$1 = (s, o) => {
	if (e$7) s.adoptedStyleSheets = o.map(((t) => t instanceof CSSStyleSheet ? t : t.styleSheet));
	else for (const e of o) {
		const o = document.createElement("style"), n = t$5.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
}, c$6 = e$7 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$7(e);
})(t) : t;
//#endregion
//#region node_modules/@lit/reactive-element/reactive-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var { is: i$7, defineProperty: e$6, getOwnPropertyDescriptor: h$4, getOwnPropertyNames: r$6, getOwnPropertySymbols: o$5, getPrototypeOf: n$7 } = Object, a$1 = globalThis, c$5 = a$1.trustedTypes, l$2 = c$5 ? c$5.emptyScript : "", p$2 = a$1.reactiveElementPolyfillSupport, d$2 = (t, s) => t, u$3 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$2 : null;
				break;
			case Object:
			case Array: t = null == t ? t : JSON.stringify(t);
		}
		return t;
	},
	fromAttribute(t, s) {
		let i = t;
		switch (s) {
			case Boolean:
				i = null !== t;
				break;
			case Number:
				i = null === t ? null : Number(t);
				break;
			case Object:
			case Array: try {
				i = JSON.parse(t);
			} catch (t) {
				i = null;
			}
		}
		return i;
	}
}, f$3 = (t, s) => !i$7(t, s), b$1 = {
	attribute: !0,
	type: String,
	converter: u$3,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$3
};
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y$1 = class extends HTMLElement {
	static addInitializer(t) {
		this._$Ei(), (this.l ??= []).push(t);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(t, s = b$1) {
		if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
			const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
			void 0 !== h && e$6(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		const { get: e, set: r } = h$4(this.prototype, t) ?? {
			get() {
				return this[s];
			},
			set(t) {
				this[s] = t;
			}
		};
		return {
			get: e,
			set(s) {
				const h = e?.call(this);
				r?.call(this, s), this.requestUpdate(t, h, i);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(t) {
		return this.elementProperties.get(t) ?? b$1;
	}
	static _$Ei() {
		if (this.hasOwnProperty(d$2("elementProperties"))) return;
		const t = n$7(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$2("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$2("properties"))) {
			const t = this.properties, s = [...r$6(t), ...o$5(t)];
			for (const i of s) this.createProperty(i, t[i]);
		}
		const t = this[Symbol.metadata];
		if (null !== t) {
			const s = litPropertyMetadata.get(t);
			if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (const [t, s] of this.elementProperties) {
			const i = this._$Eu(t, s);
			void 0 !== i && this._$Eh.set(i, t);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(s) {
		const i = [];
		if (Array.isArray(s)) {
			const e = new Set(s.flat(Infinity).reverse());
			for (const s of e) i.unshift(c$6(s));
		} else void 0 !== s && i.push(c$6(s));
		return i;
	}
	static _$Eu(t, s) {
		const i = s.attribute;
		return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise(((t) => this.enableUpdating = t)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t) => t(this)));
	}
	addController(t) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
	}
	removeController(t) {
		this._$EO?.delete(t);
	}
	_$E_() {
		const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
		for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
		t.size > 0 && (this._$Ep = t);
	}
	createRenderRoot() {
		const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return S$1(t, this.constructor.elementStyles), t;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(((t) => t.hostConnected?.()));
	}
	enableUpdating(t) {}
	disconnectedCallback() {
		this._$EO?.forEach(((t) => t.hostDisconnected?.()));
	}
	attributeChangedCallback(t, s, i) {
		this._$AK(t, i);
	}
	_$ET(t, s) {
		const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
		if (void 0 !== e && !0 === i.reflect) {
			const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$3).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$3;
			this._$Em = e, this[e] = h.fromAttribute(s, t.type) ?? this._$Ej?.get(e) ?? null, this._$Em = null;
		}
	}
	requestUpdate(t, s, i) {
		if (void 0 !== t) {
			const e = this.constructor, h = this[t];
			if (i ??= e.getPropertyOptions(t), !((i.hasChanged ?? f$3)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(e._$Eu(t, i)))) return;
			this.C(t, s, i);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
		i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (t) {
			Promise.reject(t);
		}
		const t = this.scheduleUpdate();
		return null != t && await t, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (const [t, s] of this._$Ep) this[t] = s;
				this._$Ep = void 0;
			}
			const t = this.constructor.elementProperties;
			if (t.size > 0) for (const [s, i] of t) {
				const { wrapped: t } = i, e = this[s];
				!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
			}
		}
		let t = !1;
		const s = this._$AL;
		try {
			t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach(((t) => t.hostUpdate?.())), this.update(s)) : this._$EM();
		} catch (s) {
			throw t = !1, this._$EM(), s;
		}
		t && this._$AE(s);
	}
	willUpdate(t) {}
	_$AE(t) {
		this._$EO?.forEach(((t) => t.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(t) {
		return !0;
	}
	update(t) {
		this._$Eq &&= this._$Eq.forEach(((t) => this._$ET(t, this[t]))), this._$EM();
	}
	updated(t) {}
	firstUpdated(t) {}
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$2("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$2("finalized")] = /* @__PURE__ */ new Map(), p$2?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.0");
//#endregion
//#region node_modules/lit-html/lit-html.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$4 = globalThis, i$6 = t$4.trustedTypes, s$4 = i$6 ? i$6.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, e$5 = "$lit$", h$3 = `lit$${Math.random().toFixed(9).slice(2)}$`, o$4 = "?" + h$3, n$6 = `<${o$4}>`, r$5 = document, l$1 = () => r$5.createComment(""), c$4 = (t) => null === t || "object" != typeof t && "function" != typeof t, a = Array.isArray, u$2 = (t) => a(t) || "function" == typeof t?.[Symbol.iterator], d$1 = "[ 	\n\f\r]", f$2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v$1 = /-->/g, _ = />/g, m$2 = RegExp(`>|${d$1}(?:([^\\s"'>=/]+)(${d$1}*=${d$1}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), p$1 = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t) => (i, ...s) => ({
	_$litType$: t,
	strings: i,
	values: s
}), x = y(1);
y(2);
y(3);
var T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$5.createTreeWalker(r$5, 129);
function P(t, i) {
	if (!a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== s$4 ? s$4.createHTML(i) : i;
}
var V = (t, i) => {
	const s = t.length - 1, o = [];
	let r, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = f$2;
	for (let i = 0; i < s; i++) {
		const s = t[i];
		let a, u, d = -1, y = 0;
		for (; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);) y = c.lastIndex, c === f$2 ? "!--" === u[1] ? c = v$1 : void 0 !== u[1] ? c = _ : void 0 !== u[2] ? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = m$2) : void 0 !== u[3] && (c = m$2) : c === m$2 ? ">" === u[0] ? (c = r ?? f$2, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? m$2 : "\"" === u[3] ? g : p$1) : c === g || c === p$1 ? c = m$2 : c === v$1 || c === _ ? c = f$2 : (c = m$2, r = void 0);
		const x = c === m$2 && t[i + 1].startsWith("/>") ? " " : "";
		l += c === f$2 ? s + n$6 : d >= 0 ? (o.push(a), s.slice(0, d) + e$5 + s.slice(d) + h$3 + x) : s + h$3 + (-2 === d ? i : x);
	}
	return [P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), o];
};
var N = class N {
	constructor({ strings: t, _$litType$: s }, n) {
		let r;
		this.parts = [];
		let c = 0, a = 0;
		const u = t.length - 1, d = this.parts, [f, v] = V(t, s);
		if (this.el = N.createElement(f, n), C.currentNode = this.el.content, 2 === s || 3 === s) {
			const t = this.el.content.firstChild;
			t.replaceWith(...t.childNodes);
		}
		for (; null !== (r = C.nextNode()) && d.length < u;) {
			if (1 === r.nodeType) {
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(e$5)) {
					const i = v[a++], s = r.getAttribute(t).split(h$3), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: c,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? H : "?" === e[1] ? I : "@" === e[1] ? L : k
					}), r.removeAttribute(t);
				} else t.startsWith(h$3) && (d.push({
					type: 6,
					index: c
				}), r.removeAttribute(t));
				if ($.test(r.tagName)) {
					const t = r.textContent.split(h$3), s = t.length - 1;
					if (s > 0) {
						r.textContent = i$6 ? i$6.emptyScript : "";
						for (let i = 0; i < s; i++) r.append(t[i], l$1()), C.nextNode(), d.push({
							type: 2,
							index: ++c
						});
						r.append(t[s], l$1());
					}
				}
			} else if (8 === r.nodeType) if (r.data === o$4) d.push({
				type: 2,
				index: c
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(h$3, t + 1));) d.push({
					type: 7,
					index: c
				}), t += h$3.length - 1;
			}
			c++;
		}
	}
	static createElement(t, i) {
		const s = r$5.createElement("template");
		return s.innerHTML = t, s;
	}
};
function S(t, i, s = t, e) {
	if (i === T) return i;
	let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
	const o = c$4(i) ? void 0 : i._$litDirective$;
	return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = S(t, h._$AS(t, i.values), h, e)), i;
}
var M$1 = class {
	constructor(t, i) {
		this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(t) {
		const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? r$5).importNode(i, !0);
		C.currentNode = e;
		let h = C.nextNode(), o = 0, n = 0, l = s[0];
		for (; void 0 !== l;) {
			if (o === l.index) {
				let i;
				2 === l.type ? i = new R(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new z(h, this, t)), this._$AV.push(i), l = s[++n];
			}
			o !== l?.index && (h = C.nextNode(), o++);
		}
		return C.currentNode = r$5, e;
	}
	p(t) {
		let i = 0;
		for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
	}
};
var R = class R {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(t, i, s, e) {
		this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
	}
	get parentNode() {
		let t = this._$AA.parentNode;
		const i = this._$AM;
		return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(t, i = this) {
		t = S(this, t, i), c$4(t) ? t === E || null == t || "" === t ? (this._$AH !== E && this._$AR(), this._$AH = E) : t !== this._$AH && t !== T && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : u$2(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== E && c$4(this._$AH) ? this._$AA.nextSibling.data = t : this.T(r$5.createTextNode(t)), this._$AH = t;
	}
	$(t) {
		const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)), s);
		if (this._$AH?._$AD === e) this._$AH.p(i);
		else {
			const t = new M$1(e, this), s = t.u(this.options);
			t.p(i), this.T(s), this._$AH = t;
		}
	}
	_$AC(t) {
		let i = A.get(t.strings);
		return void 0 === i && A.set(t.strings, i = new N(t)), i;
	}
	k(t) {
		a(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new R(this.O(l$1()), this.O(l$1()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, i) {
		for (this._$AP?.(!1, !0, i); t && t !== this._$AB;) {
			const i = t.nextSibling;
			t.remove(), t = i;
		}
	}
	setConnected(t) {
		void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
	}
};
var k = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(t, i, s, e, h) {
		this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = E;
	}
	_$AI(t, i = this, s, e) {
		const h = this.strings;
		let o = !1;
		if (void 0 === h) t = S(this, t, i, 0), o = !c$4(t) || t !== this._$AH && t !== T, o && (this._$AH = t);
		else {
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = S(this, e[s + n], i, n), r === T && (r = this._$AH[n]), o ||= !c$4(r) || r !== this._$AH[n], r === E ? t = E : t !== E && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
		}
		o && !e && this.j(t);
	}
	j(t) {
		t === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
	}
};
var H = class extends k {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(t) {
		this.element[this.name] = t === E ? void 0 : t;
	}
};
var I = class extends k {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(t) {
		this.element.toggleAttribute(this.name, !!t && t !== E);
	}
};
var L = class extends k {
	constructor(t, i, s, e, h) {
		super(t, i, s, e, h), this.type = 5;
	}
	_$AI(t, i = this) {
		if ((t = S(this, t, i, 0) ?? E) === T) return;
		const s = this._$AH, e = t === E && s !== E || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== E && (s === E || e);
		e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
	}
	handleEvent(t) {
		"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
	}
};
var z = class {
	constructor(t, i, s) {
		this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(t) {
		S(this, t);
	}
};
var Z = {
	M: e$5,
	P: h$3,
	A: o$4,
	C: 1,
	L: V,
	R: M$1,
	D: u$2,
	V: S,
	I: R,
	H: k,
	N: I,
	U: L,
	B: H,
	F: z
}, j = t$4.litHtmlPolyfillSupport;
j?.(N, R), (t$4.litHtmlVersions ??= []).push("3.3.0");
var B = (t, i, s) => {
	const e = s?.renderBefore ?? i;
	let h = e._$litPart$;
	if (void 0 === h) {
		const t = s?.renderBefore ?? null;
		e._$litPart$ = h = new R(i.insertBefore(l$1(), t), t, void 0, s ?? {});
	}
	return h._$AI(t), h;
};
//#endregion
//#region node_modules/lit-element/lit-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s$3 = globalThis;
var i$5 = class extends y$1 {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		const t = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= t.firstChild, t;
	}
	update(t) {
		const r = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = B(r, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return T;
	}
};
i$5._$litElement$ = !0, i$5["finalized"] = !0, s$3.litElementHydrateSupport?.({ LitElement: i$5 });
var o$3 = s$3.litElementPolyfillSupport;
o$3?.({ LitElement: i$5 });
(s$3.litElementVersions ??= []).push("4.2.0");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$3 = (t) => (e, o) => {
	void 0 !== o ? o.addInitializer((() => {
		customElements.define(t, e);
	})) : customElements.define(t, e);
};
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var o$2 = {
	attribute: !0,
	type: String,
	converter: u$3,
	reflect: !1,
	hasChanged: f$3
}, r$4 = (t = o$2, e, r) => {
	const { kind: n, metadata: i } = r;
	let s = globalThis.litPropertyMetadata.get(i);
	if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
		const { name: o } = r;
		return {
			set(r) {
				const n = e.get.call(this);
				e.set.call(this, r), this.requestUpdate(o, n, t);
			},
			init(e) {
				return void 0 !== e && this.C(o, void 0, t, e), e;
			}
		};
	}
	if ("setter" === n) {
		const { name: o } = r;
		return function(r) {
			const n = this[o];
			e.call(this, r), this.requestUpdate(o, n, t);
		};
	}
	throw Error("Unsupported decorator location: " + n);
};
function n$5(t) {
	return (e, o) => "object" == typeof o ? r$4(t, e, o) : ((t, e, o) => {
		const r = e.hasOwnProperty(o);
		return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
	})(t, e, o);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function r$3(r) {
	return n$5({
		...r,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/event-options.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function t$2(t) {
	return (n, o) => {
		const c = "function" == typeof n ? n : n[o];
		Object.assign(c, t);
	};
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var e$4 = (e, t, c) => (c.configurable = !0, c.enumerable = !0, Reflect.decorate && "object" != typeof t && Object.defineProperty(e, t, c), c);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function e$3(e, r) {
	return (n, s, i) => {
		const o = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (r) {
			const { get: e, set: r } = "object" == typeof s ? n : i ?? (() => {
				const t = Symbol();
				return {
					get() {
						return this[t];
					},
					set(e) {
						this[t] = e;
					}
				};
			})();
			return e$4(n, s, { get() {
				let t = e.call(this);
				return void 0 === t && (t = o(this), (null !== t || this.hasUpdated) && r.call(this, t)), t;
			} });
		}
		return e$4(n, s, { get() {
			return o(this);
		} });
	};
}
//#endregion
//#region src/sections/player/player-section.styles.ts
var playerSectionStyles = i$8`
  .container {
    position: relative;
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

  .container.blurred-background {
    background: none;
    isolation: isolate;
    overflow: hidden;
  }

  .container.blurred-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--blur-background-image);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(var(--blur-amount));
    transform: scale(1.1);
    z-index: -1;
  }

  .header {
    grid-area: header;
    margin: 0.75rem 1.25rem;
    padding: 0.5rem;
    position: relative;
  }

  .controls {
    grid-area: controls;
    overflow-y: auto;
    margin: 0.25rem;
    padding: 0.5rem;
    position: relative;
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
    position: relative;
  }

  [hidden] {
    display: none !important;
  }

  *[background] {
    background-color: var(--background-overlay-color, rgba(var(--rgb-card-background-color), var(--background-opacity, 0.9)));
    border-radius: 10px;
  }
`;
//#endregion
//#region src/constants.ts
var dispatchPrefix = "sonos-card-dispatch-event-";
var ACTIVE_PLAYER_EVENT_INTERNAL = "active-player";
var ACTIVE_PLAYER_EVENT = dispatchPrefix + ACTIVE_PLAYER_EVENT_INTERNAL;
var SHOW_SECTION = "show-section";
var CALL_MEDIA_STARTED = `${dispatchPrefix}call-media-started`;
var CALL_MEDIA_DONE = `${dispatchPrefix}call-media-done`;
var MEDIA_ITEM_SELECTED = "item-selected";
var SESSION_STORAGE_PLAYER_ID = "sonos-card-player-id";
var HASS_MORE_INFO = "hass-more-info";
var listStyle = i$8`
  .list {
    --mdc-theme-primary: var(--accent-color);
    --mdc-list-vertical-padding: 0px;
    overflow: hidden;
  }
`;
var mediaItemTitleStyle = i$8`
  .title {
    color: var(--secondary-text-color);
    font-weight: bold;
    padding: 0 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
//#endregion
//#region node_modules/lit-html/directive.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$1 = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, e$2 = (t) => (...e) => ({
	_$litDirective$: t,
	values: e
});
var i$4 = class {
	constructor(t) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(t, e, i) {
		this._$Ct = t, this._$AM = e, this._$Ci = i;
	}
	_$AS(t, e) {
		return this.update(t, e);
	}
	update(t, e) {
		return this.render(...e);
	}
};
//#endregion
//#region node_modules/lit-html/directives/style-map.js
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var n$4 = "important", i$3 = " !" + n$4, o$1 = e$2(class extends i$4 {
	constructor(t) {
		if (super(t), t.type !== t$1.ATTRIBUTE || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return Object.keys(t).reduce(((e, r) => {
			const s = t[r];
			return null == s ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
		}), "");
	}
	update(e, [r]) {
		const { style: s } = e.element;
		if (void 0 === this.ft) return this.ft = new Set(Object.keys(r)), this.render(r);
		for (const t of this.ft) r[t] ?? (this.ft.delete(t), t.includes("-") ? s.removeProperty(t) : s[t] = null);
		for (const t in r) {
			const e = r[t];
			if (null != e) {
				this.ft.add(t);
				const r = "string" == typeof e && e.endsWith(i$3);
				t.includes("-") || r ? s.setProperty(t, r ? e.slice(0, -11) : e, r ? n$4 : "") : s[t] = e;
			}
		}
		return T;
	}
});
//#endregion
//#region src/utils/media-browse-utils.ts
function findMatchingCustomFavorite(customFavorites, mediaContentId, playerId) {
	if (!customFavorites || !mediaContentId) return;
	const keys = playerId ? [playerId, "all"] : Object.keys(customFavorites);
	for (const key of keys) for (const favorite of customFavorites[key] ?? []) {
		if (favorite.media_content_id === mediaContentId) return favorite;
		if (favorite.contentIdRegexpForUseAs) try {
			if (new RegExp(favorite.contentIdRegexpForUseAs).test(mediaContentId)) return favorite;
		} catch {
			continue;
		}
	}
}
var DEFAULT_MEDIA_THUMBNAIL = "data:image/png;base64,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";
function hasItemsWithImage(items) {
	return items.some((item) => item.thumbnail);
}
function getValueFromKeyIgnoreSpecialChars(customFavoriteThumbnails, currentTitle) {
	for (const title in customFavoriteThumbnails) if (removeSpecialChars(title) === removeSpecialChars(currentTitle)) return customFavoriteThumbnails[title];
}
function getThumbnail(mediaItem, config, itemsWithImage) {
	const favoritesConfig = config.mediaBrowser?.favorites ?? {};
	const overrides = config.player?.mediaArtworkOverrides;
	let thumbnail = (overrides ? findMatchingOverride(overrides, {
		media_title: mediaItem.title,
		media_content_id: mediaItem.media_content_id
	}, mediaItem.thumbnail) : void 0)?.imageUrl ?? getValueFromKeyIgnoreSpecialChars(favoritesConfig.customThumbnails, mediaItem.title) ?? mediaItem.thumbnail;
	if (!thumbnail) {
		thumbnail = getValueFromKeyIgnoreSpecialChars(favoritesConfig.customThumbnailsIfMissing, mediaItem.title);
		if (itemsWithImage && !thumbnail) thumbnail = favoritesConfig.customThumbnailsIfMissing?.["default"] || DEFAULT_MEDIA_THUMBNAIL;
	} else if (thumbnail?.match(/https:\/\/brands\.home-assistant\.io\/.+\/logo.png/)) thumbnail = thumbnail?.replace("logo.png", "icon.png");
	return thumbnail || "";
}
function removeSpecialChars(str) {
	return str.replace(/[^a-zA-Z0-9 ]/g, "");
}
function indexOfWithoutSpecialChars(array, str) {
	let result = -1;
	array.forEach((value, index) => {
		if (removeSpecialChars(value) === removeSpecialChars(str)) result = index;
	});
	return result;
}
function stringContainsAnyItemInArray(array, str) {
	return !!array.find((value) => str.includes(value));
}
var IGNORED_MEDIA_SOURCES = [
	"media-source://tts",
	"media-source://camera",
	"media-source://image",
	"media-source://image_upload"
];
function filterOutIgnoredMediaSources(items) {
	return items.filter((item) => !IGNORED_MEDIA_SOURCES.some((src) => item.media_content_id?.startsWith(src)));
}
function getGridItemSize(_itemsPerRow, isPortrait) {
	return {
		width: "100px",
		height: isPortrait ? "180px" : "150px"
	};
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
function renderFavoritesItem(item, showTitle = true, titleColor, titleBgColor) {
	const titleStyle = o$1({
		color: titleColor ?? "",
		backgroundColor: titleBgColor ?? ""
	});
	const thumbnailStyle = item.thumbnail ? `background-image: url("${item.thumbnail}")` : "";
	return x`
    <div class="thumbnail" ?hidden=${!item.thumbnail} style=${thumbnailStyle}></div>
    <div class="title" ?hidden=${!showTitle} style=${titleStyle}>${item.title}</div>
  `;
}
//#endregion
//#region src/sections/player/player-artwork-utils.ts
function matchesString(value, expected) {
	return !!value && value === expected;
}
function matchesRegexp(value, pattern) {
	if (!value || !pattern) return false;
	try {
		return new RegExp(pattern).test(value);
	} catch {
		return false;
	}
}
function findMatchingOverride(overrides, attrs, entityImage) {
	let override = overrides.find((value) => matchesString(attrs.media_title, value.mediaTitleEquals) || matchesString(attrs.media_artist, value.mediaArtistEquals) || matchesString(attrs.media_album_name, value.mediaAlbumNameEquals) || matchesString(attrs.media_channel, value.mediaChannelEquals) || matchesString(attrs.media_content_id, value.mediaContentIdEquals) || matchesString(attrs.app_name, value.appNameEquals) || matchesString(attrs.source, value.sourceEquals) || matchesString(attrs.app_id, value.appIdEquals) || matchesRegexp(attrs.media_title, value.mediaTitleRegexp) || matchesRegexp(attrs.media_artist, value.mediaArtistRegexp) || matchesRegexp(attrs.media_album_name, value.mediaAlbumNameRegexp) || matchesRegexp(attrs.media_channel, value.mediaChannelRegexp) || matchesRegexp(attrs.media_content_id, value.mediaContentIdRegexp) || matchesRegexp(attrs.app_name, value.appNameRegexp) || matchesRegexp(attrs.source, value.sourceRegexp) || matchesRegexp(attrs.app_id, value.appIdRegexp));
	if (!override) override = overrides.find((value) => !entityImage && value.ifMissing);
	return override;
}
function findArtworkOverride(store, entityImage) {
	const overrides = store.config.player?.mediaArtworkOverrides;
	if (!overrides) return;
	const { media_title, media_artist, media_album_name, media_content_id, media_channel, app_name, source, app_id } = store.activePlayer.attributes;
	return findMatchingOverride(overrides, {
		media_title,
		media_artist,
		media_album_name,
		media_content_id,
		media_channel,
		app_name,
		source,
		app_id
	}, entityImage);
}
function getArtworkImage(store, resolvedImageUrl) {
	const prefix = store.config.player?.artworkHostname || "";
	const { entity_picture, entity_picture_local, app_id } = store.activePlayer.attributes;
	let entityImage = entity_picture ? prefix + entity_picture : entity_picture;
	if (app_id === "music_assistant") entityImage = entity_picture_local ? prefix + entity_picture_local : entity_picture;
	let sizePercentage = void 0;
	const override = findArtworkOverride(store, entityImage);
	if (override?.imageUrl) {
		if (override.imageUrl.includes("{{")) entityImage = resolvedImageUrl ?? "";
		else entityImage = override.imageUrl;
		sizePercentage = override?.sizePercentage ?? sizePercentage;
	}
	if (!override) {
		const matchingFavorite = findMatchingCustomFavorite(store.config.mediaBrowser?.favorites?.customFavorites, store.activePlayer.attributes.media_content_id, store.activePlayer.id);
		if (matchingFavorite?.useThumbnailAsArtwork && matchingFavorite.thumbnail) entityImage = matchingFavorite.thumbnail;
	}
	return {
		entityImage,
		sizePercentage
	};
}
function getFallbackImage(store) {
	return store.config.player?.fallbackArtwork ?? (store.activePlayer.attributes.media_title === "TV" ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAJZlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAARAAAAWodpAAQAAAABAAAAbAAAAAAAAABiAAAAAQAAAGIAAAABd3d3Lmlua3NjYXBlLm9yZwAAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAgCgAwAEAAAAAQAAAgAAAAAA+uiskAAAAAlwSFlzAAAPEgAADxIBIZvyMwAAAi1pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+d3d3Lmlua3NjYXBlLm9yZzwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45ODwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+OTg8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrH52sKAAA/4klEQVR4Ae3dCZAc13nY8dfHzOwNYAHiJAACIMAD4iFRlE3JsSSrSrLiWLEdQ7FNy5KllBLHRcV27NiupFKoVBLfsUNVJVVWJNqMFCuCY7ssu2jZkgWVbFG2RJGmSIgkTuIGcew1uztHH/m+Hiw0A+wxs9Mz093zb2mJObpfv/frmXlfv379njEsCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgggkAgBKxG5IBMI9JnA29520L3zzbn1VjW3xbeDET8IQjNgT7rF0oWP//bBCeEIM0ZifehnD67zRga22BWzRn54bCewi2GueuHYV6pXDx8+6GWsvBQHgcQLEAAk/hCRwawJ/MQv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AQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBGIQ+P9v6JX0ZgeS/gAAAABJRU5ErkJggg==" : "data:image/png;base64,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AQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAIEGFvj/AdpNbG+v3HHWAAAAAElFTkSuQmCC");
}
function getBackgroundImage(store, imageLoaded, resolvedImageUrl) {
	const image = getArtworkImage(store, resolvedImageUrl);
	if (image?.entityImage && imageLoaded) {
		const sizeStyle = image.sizePercentage ? `; background-size: ${image.sizePercentage}%` : "";
		return `background-image: url("${image.entityImage}")${sizeStyle}`;
	}
	return `background-image: url("${getFallbackImage(store)}")`;
}
function getBackgroundImageUrl(store, imageLoaded, resolvedImageUrl) {
	const image = getArtworkImage(store, resolvedImageUrl);
	if (image?.entityImage && imageLoaded) return `url("${image.entityImage}")`;
	return `url("${getFallbackImage(store)}")`;
}
function getArtworkStyle(store, imageLoaded, resolvedImageUrl) {
	const { artworkMinHeight: minHeight = 5, artworkBorderRadius: borderRadius = 0 } = store.config.player ?? {};
	const bg = getBackgroundImage(store, imageLoaded, resolvedImageUrl);
	if (borderRadius > 0) return `${bg}; border-radius: ${borderRadius}px; background-size: cover; aspect-ratio: 1; height: 100%; max-height: 50vh; width: auto; margin: 0 auto;`;
	return `${bg}; min-height: ${minHeight}rem`;
}
//#endregion
//#region node_modules/@mdi/js/mdi.js
var mdiAccessPoint = "M4.93,4.93C3.12,6.74 2,9.24 2,12C2,14.76 3.12,17.26 4.93,19.07L6.34,17.66C4.89,16.22 4,14.22 4,12C4,9.79 4.89,7.78 6.34,6.34L4.93,4.93M19.07,4.93L17.66,6.34C19.11,7.78 20,9.79 20,12C20,14.22 19.11,16.22 17.66,17.66L19.07,19.07C20.88,17.26 22,14.76 22,12C22,9.24 20.88,6.74 19.07,4.93M7.76,7.76C6.67,8.85 6,10.35 6,12C6,13.65 6.67,15.15 7.76,16.24L9.17,14.83C8.45,14.11 8,13.11 8,12C8,10.89 8.45,9.89 9.17,9.17L7.76,7.76M16.24,7.76L14.83,9.17C15.55,9.89 16,10.89 16,12C16,13.11 15.55,14.11 14.83,14.83L16.24,16.24C17.33,15.15 18,13.65 18,12C18,10.35 17.33,8.85 16.24,7.76M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z";
var mdiAccount = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z";
var mdiAccountMusic = "M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z";
var mdiAccountMusicOutline = "M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4M11,6A2,2 0 0,0 9,8A2,2 0 0,0 11,10A2,2 0 0,0 13,8A2,2 0 0,0 11,6M11,13C12.1,13 13.66,13.23 15.11,13.69C14.5,14.07 14,14.6 13.61,15.23C12.79,15.03 11.89,14.9 11,14.9C8.03,14.9 4.9,16.36 4.9,17V18.1H13.04C13.13,18.8 13.38,19.44 13.76,20H3V17C3,14.34 8.33,13 11,13M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z";
var mdiAlarm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z";
var mdiAlbum = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiAlphaABoxOutline = "M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M5,5V19H19V5H5M11,7H13A2,2 0 0,1 15,9V17H13V13H11V17H9V9A2,2 0 0,1 11,7M11,9V11H13V9H11Z";
var mdiApplication = "M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2M21 7H3V4H21V7Z";
var mdiArrowLeft = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
var mdiArrowUpRight = "M21.5 9.5L20.09 10.92L17 7.83V13.5C17 17.09 14.09 20 10.5 20H4V18H10.5C13 18 15 16 15 13.5V7.83L11.91 10.91L10.5 9.5L16 4L21.5 9.5Z";
var mdiBookshelf = "M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z";
var mdiCheck = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";
var mdiCheckAll = "M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z";
var mdiCheckCircle = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";
var mdiCheckboxMultipleMarkedOutline = "M20,16V10H22V16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H16V4H8V16H20M10.91,7.08L14,10.17L20.59,3.58L22,5L14,13L9.5,8.5L10.91,7.08M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z";
var mdiChevronDown = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
var mdiChevronLeft = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z";
var mdiChevronRight = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z";
var mdiChevronUp = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
var mdiClose = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
var mdiCloseBoxMultipleOutline = "M20 2H8C6.9 2 6 2.9 6 4V16C6 17.11 6.9 18 8 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M20 16H8V4H20V16M4 6V20H18V22H4C2.9 22 2 21.11 2 20V6H4M9.77 12.84L12.6 10L9.77 7.15L11.17 5.75L14 8.6L16.84 5.77L18.24 7.17L15.4 10L18.23 12.84L16.83 14.24L14 11.4L11.17 14.24L9.77 12.84Z";
var mdiCloseCircle = "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z";
var mdiCog = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";
var mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
var mdiDotsVertical = "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";
var mdiDramaMasks = "M8.11,19.45C5.94,18.65 4.22,16.78 3.71,14.35L2.05,6.54C1.81,5.46 2.5,4.4 3.58,4.17L13.35,2.1L13.38,2.09C14.45,1.88 15.5,2.57 15.72,3.63L16.07,5.3L20.42,6.23H20.45C21.5,6.47 22.18,7.53 21.96,8.59L20.3,16.41C19.5,20.18 15.78,22.6 12,21.79C10.42,21.46 9.08,20.61 8.11,19.45V19.45M20,8.18L10.23,6.1L8.57,13.92V13.95C8,16.63 9.73,19.27 12.42,19.84C15.11,20.41 17.77,18.69 18.34,16L20,8.18M16,16.5C15.37,17.57 14.11,18.16 12.83,17.89C11.56,17.62 10.65,16.57 10.5,15.34L16,16.5M8.47,5.17L4,6.13L5.66,13.94L5.67,13.97C5.82,14.68 6.12,15.32 6.53,15.87C6.43,15.1 6.45,14.3 6.62,13.5L7.05,11.5C6.6,11.42 6.21,11.17 6,10.81C6.06,10.2 6.56,9.66 7.25,9.5C7.33,9.5 7.4,9.5 7.5,9.5L8.28,5.69C8.32,5.5 8.38,5.33 8.47,5.17M15.03,12.23C15.35,11.7 16.03,11.42 16.72,11.57C17.41,11.71 17.91,12.24 18,12.86C17.67,13.38 17,13.66 16.3,13.5C15.61,13.37 15.11,12.84 15.03,12.23M10.15,11.19C10.47,10.66 11.14,10.38 11.83,10.53C12.5,10.67 13.03,11.21 13.11,11.82C12.78,12.34 12.11,12.63 11.42,12.5C10.73,12.33 10.23,11.8 10.15,11.19M11.97,4.43L13.93,4.85L13.77,4.05L11.97,4.43Z";
var mdiEyeCheck = "M23.5,17L18.5,22L15,18.5L16.5,17L18.5,19L22,15.5L23.5,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,17C12.5,17 12.97,16.93 13.42,16.79C13.15,17.5 13,18.22 13,19V19.45L12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5C17,4.5 21.27,7.61 23,12C22.75,12.64 22.44,13.26 22.08,13.85C21.18,13.31 20.12,13 19,13C18.22,13 17.5,13.15 16.79,13.42C16.93,12.97 17,12.5 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17Z";
var mdiFastForward = "M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z";
var mdiFileMusic = "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,13H11V18A2,2 0 0,1 9,20A2,2 0 0,1 7,18A2,2 0 0,1 9,16C9.4,16 9.7,16.1 10,16.3V11H13V13M13,9V3.5L18.5,9H13Z";
var mdiFolder = "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z";
var mdiFolderStar = "M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M17.94,17L15,15.28L12.06,17L12.84,13.67L10.25,11.43L13.66,11.14L15,8L16.34,11.14L19.75,11.43L17.16,13.67L17.94,17Z";
var mdiFolderStarOutline = "M10.78 12.05L13.81 11.79L15 9L16.19 11.79L19.22 12.05L16.92 14.04L17.61 17L15 15.47L12.39 17L13.08 14.04L10.78 12.05M22 8V18C22 19.11 21.11 20 20 20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.9 4 4 4H10L12 6H20C21.11 6 22 6.9 22 8M20 8H4V18H20V8Z";
var mdiGamepadVariant = "M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z";
var mdiGrid = "M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z";
var mdiHeart = "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z";
var mdiHeartOutline = "M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z";
var mdiImage = "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z";
var mdiKeyboard = "M19,10H17V8H19M19,13H17V11H19M16,10H14V8H16M16,13H14V11H16M16,17H8V15H16M7,10H5V8H7M7,13H5V11H7M8,11H10V13H8M8,8H10V10H8M11,11H13V13H11M11,8H13V10H11M20,5H4C2.89,5 2,5.89 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7C22,5.89 21.1,5 20,5Z";
var mdiListBoxOutline = "M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z";
var mdiMagnify = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
var mdiMovie = "M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18Z";
var mdiMusic = "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z";
var mdiPauseCircle = "M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiPen = "M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z";
var mdiPlay = "M8,5.14V19.14L19,12.14L8,5.14Z";
var mdiPlayBoxMultiple = "M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M12,14.5V5.5L18,10L12,14.5Z";
var mdiPlayCircle = "M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiPlaylistMusic = "M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z";
var mdiPlaylistPlus = "M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z";
var mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
var mdiPodcast = "M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z";
var mdiPower = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13";
var mdiRadio = "M20,6A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8C2,7.15 2.53,6.42 3.28,6.13L15.71,1L16.47,2.83L8.83,6H20M20,8H4V12H16V10H18V12H20V8M7,14A3,3 0 0,0 4,17A3,3 0 0,0 7,20A3,3 0 0,0 10,17A3,3 0 0,0 7,14Z";
var mdiRepeat = "M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z";
var mdiRepeatOff = "M2,5.27L3.28,4L20,20.72L18.73,22L15.73,19H7V22L3,18L7,14V17H13.73L7,10.27V11H5V8.27L2,5.27M17,13H19V17.18L17,15.18V13M17,5V2L21,6L17,10V7H8.82L6.82,5H17Z";
var mdiRepeatOnce = "M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z";
var mdiRewind = "M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z";
var mdiSelectInverse = "M5,3H7V5H9V3H11V5H13V3H15V5H17V3H19V5H21V7H19V9H21V11H19V13H21V15H19V17H21V19H19V21H17V19H15V21H13V19H11V21H9V19H7V21H5V19H3V17H5V15H3V13H5V11H3V9H5V7H3V5H5V3Z";
var mdiShuffle = "M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z";
var mdiShuffleDisabled = "M16,4.5V7H5V9H16V11.5L19.5,8M16,12.5V15H5V17H16V19.5L19.5,16";
var mdiSkipNext = "M16,18H18V6H16M6,18L14.5,12L6,6V18Z";
var mdiSkipNextCircle = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M8,8L13,12L8,16M14,8H16V16H14";
var mdiSkipPrevious = "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z";
var mdiStar = "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";
var mdiStopCircle = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9";
var mdiTelevisionClassic = "M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3M4,9H17V19H4V9M19.5,9A1,1 0 0,1 20.5,10A1,1 0 0,1 19.5,11A1,1 0 0,1 18.5,10A1,1 0 0,1 19.5,9M19.5,12A1,1 0 0,1 20.5,13A1,1 0 0,1 19.5,14A1,1 0 0,1 18.5,13A1,1 0 0,1 19.5,12Z";
var mdiTrashCanOutline = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z";
var mdiVideo = "M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z";
var mdiViewGrid = "M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3";
var mdiViewList = "M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z";
var mdiVolumeHigh = "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z";
var mdiVolumeMinus = "M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z";
var mdiVolumeMute = "M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z";
var mdiVolumePlus = "M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z";
var mdiWeb = "M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
//#endregion
//#region src/types.ts
var Section = /* @__PURE__ */ function(Section) {
	Section["GROUPS"] = "groups";
	Section["MEDIA_BROWSER"] = "media browser";
	Section["PLAYER"] = "player";
	Section["GROUPING"] = "grouping";
	Section["VOLUMES"] = "volumes";
	Section["QUEUE"] = "queue";
	Section["SEARCH"] = "search";
	return Section;
}({});
var MASS_QUEUE_NOT_INSTALLED = "MASS_QUEUE_NOT_INSTALLED";
//#endregion
//#region src/upstream/data/entity.ts
var isUnavailableState = (state) => {
	return state === "unavailable" || state === "unknown" || !state;
};
//#endregion
//#region src/upstream/data/tts.ts
var isTTSMediaSource = (mediaContentId) => {
	return mediaContentId?.startsWith("media-source://tts/") ?? false;
};
//#endregion
//#region src/upstream/data/media-player.ts
var MediaPlayerEntityFeature = /* @__PURE__ */ function(MediaPlayerEntityFeature) {
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["PAUSE"] = 1] = "PAUSE";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["SEEK"] = 2] = "SEEK";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["VOLUME_SET"] = 4] = "VOLUME_SET";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["VOLUME_MUTE"] = 8] = "VOLUME_MUTE";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["PREVIOUS_TRACK"] = 16] = "PREVIOUS_TRACK";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["NEXT_TRACK"] = 32] = "NEXT_TRACK";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["TURN_ON"] = 128] = "TURN_ON";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["TURN_OFF"] = 256] = "TURN_OFF";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["PLAY_MEDIA"] = 512] = "PLAY_MEDIA";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["VOLUME_STEP"] = 1024] = "VOLUME_STEP";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["SELECT_SOURCE"] = 2048] = "SELECT_SOURCE";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["STOP"] = 4096] = "STOP";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["CLEAR_PLAYLIST"] = 8192] = "CLEAR_PLAYLIST";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["PLAY"] = 16384] = "PLAY";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["SHUFFLE_SET"] = 32768] = "SHUFFLE_SET";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["SELECT_SOUND_MODE"] = 65536] = "SELECT_SOUND_MODE";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["BROWSE_MEDIA"] = 131072] = "BROWSE_MEDIA";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["REPEAT_SET"] = 262144] = "REPEAT_SET";
	MediaPlayerEntityFeature[MediaPlayerEntityFeature["GROUPING"] = 524288] = "GROUPING";
	return MediaPlayerEntityFeature;
}({});
var MediaClassBrowserSettings = {
	album: {
		icon: mdiAlbum,
		layout: "grid"
	},
	app: {
		icon: mdiApplication,
		layout: "grid",
		show_list_images: true
	},
	artist: {
		icon: mdiAccountMusic,
		layout: "grid",
		show_list_images: true
	},
	channel: {
		icon: mdiTelevisionClassic,
		thumbnail_ratio: "portrait",
		layout: "grid",
		show_list_images: true
	},
	composer: {
		icon: mdiAccountMusicOutline,
		layout: "grid",
		show_list_images: true
	},
	contributing_artist: {
		icon: mdiAccountMusic,
		layout: "grid",
		show_list_images: true
	},
	directory: {
		icon: mdiFolder,
		layout: "grid",
		show_list_images: true
	},
	episode: {
		icon: mdiTelevisionClassic,
		layout: "grid",
		thumbnail_ratio: "portrait",
		show_list_images: true
	},
	game: {
		icon: mdiGamepadVariant,
		layout: "grid",
		thumbnail_ratio: "portrait"
	},
	genre: {
		icon: mdiDramaMasks,
		layout: "grid",
		show_list_images: true
	},
	image: {
		icon: mdiImage,
		layout: "grid",
		show_list_images: true
	},
	movie: {
		icon: mdiMovie,
		thumbnail_ratio: "portrait",
		layout: "grid",
		show_list_images: true
	},
	music: {
		icon: mdiMusic,
		show_list_images: true
	},
	playlist: {
		icon: mdiPlaylistMusic,
		layout: "grid",
		show_list_images: true
	},
	podcast: {
		icon: mdiPodcast,
		layout: "grid"
	},
	season: {
		icon: mdiTelevisionClassic,
		layout: "grid",
		thumbnail_ratio: "portrait",
		show_list_images: true
	},
	track: { icon: mdiFileMusic },
	tv_show: {
		icon: mdiTelevisionClassic,
		layout: "grid",
		thumbnail_ratio: "portrait"
	},
	url: { icon: mdiWeb },
	video: {
		icon: mdiVideo,
		layout: "grid",
		show_list_images: true
	}
};
var browseMediaPlayer = (hass, entityId, mediaContentId, mediaContentType) => hass.callWS({
	type: "media_player/browse_media",
	entity_id: entityId,
	media_content_id: mediaContentId,
	media_content_type: mediaContentType
});
//#endregion
//#region src/utils/utils.ts
function getSpeakerList(mainPlayer, predefinedGroups = []) {
	const playerIds = mainPlayer.members.map((member) => member.id).sort();
	if (predefinedGroups?.length) {
		const found = predefinedGroups.find((pg) => pg.entities.map((p) => p.player.id).sort().toString() === playerIds.toString());
		if (found) return found.name;
	}
	const otherMembers = mainPlayer.members.filter((member) => member.id !== mainPlayer.id);
	return [mainPlayer.name, ...otherMembers.map((member) => member.name)].join(" + ");
}
function dispatchActivePlayerId(playerId, config, element) {
	if (cardDoesNotContainAllSections(config)) dispatch(ACTIVE_PLAYER_EVENT, { entityId: playerId });
	else element.dispatchEvent(customEvent(ACTIVE_PLAYER_EVENT_INTERNAL, { entityId: playerId }));
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
var HEIGHT_AND_WIDTH = 40;
function getWidthOrHeight(confValue) {
	if (confValue) return confValue / 100 * HEIGHT_AND_WIDTH;
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
	groupMembers = groupMembers?.filter((id) => id !== null && id !== void 0);
	return groupMembers?.length ? groupMembers : [hassEntity.entity_id];
}
function supportsTurnOn(player) {
	return ((player.attributes.supported_features || 0) & MediaPlayerEntityFeature.TURN_ON) === MediaPlayerEntityFeature.TURN_ON;
}
function getGroupingChanges(groupingItems, joinedPlayers, activePlayerId) {
	const isSelected = groupingItems.filter((item) => item.isSelected);
	const unJoin = groupingItems.filter((item) => !item.isSelected && joinedPlayers.includes(item.player.id)).map((item) => item.player.id);
	const join = groupingItems.filter((item) => item.isSelected && !joinedPlayers.includes(item.player.id)).map((item) => item.player.id);
	let newMainPlayer = activePlayerId;
	if (unJoin.includes(activePlayerId)) newMainPlayer = isSelected[0].player.id;
	return {
		unJoin,
		join,
		newMainPlayer
	};
}
function entityMatchSonos(config, entity, hassWithEntities) {
	const entityId = entity.entity_id;
	const configEntities = [...new Set(config.entities)];
	let includeEntity = true;
	if (configEntities.length) {
		const includesEntity = configEntities.includes(entityId);
		includeEntity = !!config.excludeItemsInEntitiesList !== includesEntity;
	}
	let matchesPlatform = true;
	entity.attributes.platform = hassWithEntities.entities?.[entityId]?.platform;
	if (config.entityPlatform) matchesPlatform = entity.attributes.platform === config.entityPlatform;
	return includeEntity && matchesPlatform;
}
function entityMatchMxmp(config, entity, hassWithEntities) {
	const entityId = entity.entity_id;
	const configEntities = [...new Set(config.entities)];
	let matchesPlatform = false;
	entity.attributes.platform = hassWithEntities.entities?.[entityId]?.platform;
	if (config.entityPlatform) matchesPlatform = entity.attributes.platform === config.entityPlatform;
	let includeEntity = false;
	if (configEntities.length) {
		const includesEntity = configEntities.includes(entityId);
		includeEntity = !!config.excludeItemsInEntitiesList !== includesEntity;
	}
	if (config.entityPlatform && configEntities.length) return matchesPlatform && includeEntity;
	return matchesPlatform || includeEntity;
}
function isSonosCard(config) {
	return config.type.indexOf("sonos") > -1;
}
function isQueueSupported(config) {
	const effectivePlatform = config.entityPlatform ?? (isSonosCard(config) ? "sonos" : void 0);
	return effectivePlatform === "sonos" || effectivePlatform === "music_assistant";
}
function sortEntities(config, filtered) {
	if (config.entities) return filtered.sort((a, b) => {
		return (config.entities?.indexOf(a.entity_id) ?? -1) - (config.entities?.indexOf(b.entity_id) ?? -1);
	});
	else return filtered.sort((a, b) => a.entity_id.localeCompare(b.entity_id));
}
function findPlayer(mediaPlayers, playerId) {
	return mediaPlayers.find((member) => member.id === playerId);
}
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion
//#region \0@oxc-project+runtime@0.126.0/helpers/decorate.js
function __decorate$1(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region src/components/icon-button.ts
var IconButton = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.disabled = false;
		this.title = "";
	}
	render() {
		return x`
      <button ?disabled=${this.disabled} title=${this.title || E} aria-label=${this.title || E}>
        ${this.path ? x`<ha-svg-icon .path=${this.path}></ha-svg-icon>` : x`<slot></slot>`}
      </button>
    `;
	}
	static get styles() {
		return i$8`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        --sc-icon-button-size: var(--icon-button-size, 3rem);
        --sc-icon-size: var(--icon-size, 2rem);
      }
      :host([hide]),
      :host([hidden]) {
        display: none !important;
      }
      button {
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        color: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--sc-icon-button-size);
        height: var(--sc-icon-button-size);
        border-radius: 50%;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        position: relative;
        overflow: hidden;
      }
      button::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        opacity: 0;
        background: currentColor;
        transition: opacity 0.12s;
      }
      button:hover::before {
        opacity: 0.08;
      }
      button:active::before {
        opacity: 0.12;
      }
      button:disabled {
        cursor: default;
        opacity: 0.38;
      }
      button:disabled::before {
        display: none;
      }
      ha-svg-icon {
        display: flex;
        --mdc-icon-size: var(--sc-icon-size);
        width: var(--sc-icon-size);
        height: var(--sc-icon-size);
      }
      ::slotted(ha-icon) {
        --mdc-icon-size: var(--sc-icon-size);
      }
    `;
	}
};
__decorate$1([n$5()], IconButton.prototype, "path", void 0);
__decorate$1([n$5({
	type: Boolean,
	reflect: true
})], IconButton.prototype, "disabled", void 0);
__decorate$1([n$5({ reflect: true })], IconButton.prototype, "selected", void 0);
__decorate$1([n$5()], IconButton.prototype, "title", void 0);
customElements.define("sonos-icon-button", IconButton);
//#endregion
//#region src/sections/player/player-favorite-button.ts
var PlayerFavoriteButton = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.isFavorite = null;
		this.favoriteLoading = false;
		this.toggleFavorite = async () => {
			if (this.favoriteLoading) return;
			const songIdAtStart = this.store.activePlayer.attributes.media_content_id;
			this.favoriteLoading = true;
			try {
				if (this.isFavorite) {
					if (await this.store.hassService.musicAssistantService.unfavoriteCurrentSong(this.store.activePlayer) && this.store.activePlayer.attributes.media_content_id === songIdAtStart) this.isFavorite = false;
				} else if (await this.store.hassService.musicAssistantService.favoriteCurrentSong(this.store.activePlayer) && this.store.activePlayer.attributes.media_content_id === songIdAtStart) this.isFavorite = true;
			} finally {
				this.favoriteLoading = false;
			}
		};
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("store")) {
			const isMusicAssistant = this.store.hassService.musicAssistantService.isMusicAssistantPlayer(this.store.activePlayer);
			const currentMediaContentId = this.store.activePlayer.attributes.media_content_id;
			if (isMusicAssistant && currentMediaContentId !== this.lastMediaContentId) {
				this.lastMediaContentId = currentMediaContentId;
				this.isFavorite = null;
				this.favoriteLoading = false;
				this.refreshFavoriteStatus();
			}
		}
	}
	render() {
		const isMusicAssistant = this.store.hassService.musicAssistantService.isMusicAssistantPlayer(this.store.activePlayer);
		const favoriteClass = `favorite-button ${this.isFavorite ? "is-favorite" : ""} ${this.favoriteLoading ? "loading" : ""}`;
		const favoriteTitle = this.isFavorite ? "Remove from favorites" : "Add to favorites";
		return x`
      <sonos-icon-button
        class=${favoriteClass}
        ?hidden=${!isMusicAssistant}
        @click=${this.toggleFavorite}
        .path=${this.isFavorite ? mdiHeart : mdiHeartOutline}
        title=${favoriteTitle}
        ?disabled=${this.favoriteLoading}
      ></sonos-icon-button>
    `;
	}
	async refreshFavoriteStatus() {
		const songIdAtStart = this.store.activePlayer.attributes.media_content_id;
		const favorite = await this.store.hassService.musicAssistantService.getCurrentSongFavorite(this.store.activePlayer);
		if (this.store.activePlayer.attributes.media_content_id === songIdAtStart) this.isFavorite = favorite;
	}
	static get styles() {
		return i$8`
      [hidden] {
        display: none !important;
      }
      .favorite-button.is-favorite {
        color: var(--accent-color);
      }
      .favorite-button.loading {
        opacity: 0.5;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], PlayerFavoriteButton.prototype, "store", void 0);
__decorate$1([r$3()], PlayerFavoriteButton.prototype, "isFavorite", void 0);
__decorate$1([r$3()], PlayerFavoriteButton.prototype, "favoriteLoading", void 0);
customElements.define("sonos-player-favorite-button", PlayerFavoriteButton);
//#endregion
//#region src/sections/player/player-controls.ts
var PlayerControls = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.prev = async () => await this.store.mediaControlService.prev(this.store.activePlayer);
		this.play = async () => await this.store.mediaControlService.play(this.store.activePlayer);
		this.pauseOrStop = async () => {
			return this.store.config.player?.stopInsteadOfPause ? await this.store.mediaControlService.stop(this.store.activePlayer) : await this.store.mediaControlService.pause(this.store.activePlayer);
		};
		this.next = async () => await this.store.mediaControlService.next(this.store.activePlayer);
		this.browseMedia = async () => this.store.mediaBrowseService.showBrowseMedia(this.store.activePlayer, this);
		this.togglePower = async () => await this.store.mediaControlService.togglePower(this.store.activePlayer);
		this.volDown = async () => {
			await this.store.mediaControlService.volumeDown(this.getVolumePlayer(), !this.store.config.player?.volumeEntityId);
		};
		this.volUp = async () => {
			await this.store.mediaControlService.volumeUp(this.getVolumePlayer(), !this.store.config.player?.volumeEntityId);
		};
		this.rewind = async () => {
			const stepSize = this.store.config.player?.fastForwardAndRewindStepSizeSeconds || 15;
			await this.store.mediaControlService.seek(this.store.activePlayer, this.store.activePlayer.attributes.media_position - stepSize);
		};
		this.fastForward = async () => {
			const stepSize = this.store.config.player?.fastForwardAndRewindStepSizeSeconds || 15;
			await this.store.mediaControlService.seek(this.store.activePlayer, this.store.activePlayer.attributes.media_position + stepSize);
		};
	}
	render() {
		const { stopInsteadOfPause, volumeEntityId, controlsColor, controlsLargeIcons, showVolumeUpAndDownButtons, hideControlShuffleButton, hideControlPrevTrackButton, showFastForwardAndRewindButtons, hideControlNextTrackButton, hideControlRepeatButton, showBrowseMediaButton, hideVolume } = this.store.config.player ?? {};
		const playing = this.store.activePlayer.isPlaying();
		const playPauseIcon = playing ? stopInsteadOfPause ? mdiStopCircle : mdiPauseCircle : mdiPlayCircle;
		const playPauseHandler = playing ? this.pauseOrStop : this.play;
		const volumePlayer = this.getVolumePlayer();
		const updateMemberVolumes = !volumeEntityId;
		const hidePower = this.store.hidePower(true) === true;
		return x`
      <div class="main" id="mediaControls" style=${(controlsColor ? `--controls-color: ${controlsColor}` : "") || E}>
        <div class="icons ${controlsLargeIcons ? "large-icons" : ""}">
          <div class="flex-1">
            <sonos-player-favorite-button .store=${this.store}></sonos-player-favorite-button>
          </div>
          <sonos-icon-button ?hidden=${!showVolumeUpAndDownButtons} @click=${this.volDown} .path=${mdiVolumeMinus}></sonos-icon-button>
          <sonos-shuffle ?hidden=${!!hideControlShuffleButton} .store=${this.store}></sonos-shuffle>
          <sonos-icon-button ?hidden=${!!hideControlPrevTrackButton} @click=${this.prev} .path=${mdiSkipPrevious}></sonos-icon-button>
          <sonos-icon-button ?hidden=${!showFastForwardAndRewindButtons} @click=${this.rewind} .path=${mdiRewind}></sonos-icon-button>
          <sonos-icon-button @click=${playPauseHandler} .path=${playPauseIcon} class="big-icon"></sonos-icon-button>
          <sonos-icon-button ?hidden=${!showFastForwardAndRewindButtons} @click=${this.fastForward} .path=${mdiFastForward}></sonos-icon-button>
          <sonos-icon-button ?hidden=${!!hideControlNextTrackButton} @click=${this.next} .path=${mdiSkipNext}></sonos-icon-button>
          <sonos-repeat ?hidden=${!!hideControlRepeatButton} .store=${this.store}></sonos-repeat>
          <sonos-icon-button ?hidden=${!showVolumeUpAndDownButtons} @click=${this.volUp} .path=${mdiVolumePlus}></sonos-icon-button>
          <div class="flex-1">
            <sonos-icon-button
              class="browse-button"
              ?hidden=${!showBrowseMediaButton}
              @click=${this.browseMedia}
              .path=${mdiPlayBoxMultiple}
            ></sonos-icon-button>
          </div>
        </div>
        <sonos-volume
          .store=${this.store}
          .player=${volumePlayer}
          .updateMembers=${updateMemberVolumes}
          .isPlayer=${true}
          ?hidden=${!!hideVolume}
        ></sonos-volume>
        <div class="icons">
          <sonos-icon-button ?hidden=${hidePower} @click=${this.togglePower}></sonos-icon-button>
        </div>
      </div>
    `;
	}
	getVolumePlayer() {
		const volumeEntityId = this.store.config.player?.volumeEntityId;
		if (volumeEntityId) {
			if (this.store.config.allowPlayerVolumeEntityOutsideOfGroup) return findPlayer(this.store.allMediaPlayers, volumeEntityId) ?? this.store.activePlayer;
			return this.store.activePlayer.getMember(volumeEntityId) ?? this.store.activePlayer;
		}
		return this.store.activePlayer;
	}
	static get styles() {
		return i$8`
      .main {
        overflow: hidden auto;
      }
      .icons {
        justify-content: center;
        display: flex;
        align-items: center;
      }
      .icons * {
        color: var(--controls-color, inherit);
      }
      [hidden] {
        display: none !important;
      }
      .big-icon {
        --icon-button-size: 5rem;
        --icon-size: 5rem;
      }
      .large-icons sonos-icon-button {
        --icon-size: 3rem;
        --icon-button-size: 4rem;
      }
      .large-icons .big-icon {
        --icon-size: 5rem;
        --icon-button-size: 5rem;
      }
      .flex-1 {
        flex: 1;
      }
      .browse-button {
        float: right;
      }
      .large-icons {
        margin-bottom: 2rem;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], PlayerControls.prototype, "store", void 0);
customElements.define("sonos-player-controls", PlayerControls);
//#endregion
//#region node_modules/lit-html/directive-helpers.js
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var { I: t } = Z, i$2 = (o) => null === o || "object" != typeof o && "function" != typeof o, f$1 = (o) => void 0 === o.strings, s$2 = () => document.createComment(""), r$2 = (o, i, n) => {
	const e = o._$AA.parentNode, l = void 0 === i ? o._$AB : i._$AA;
	if (void 0 === n) n = new t(e.insertBefore(s$2(), l), e.insertBefore(s$2(), l), o, o.options);
	else {
		const t = n._$AB.nextSibling, i = n._$AM, c = i !== o;
		if (c) {
			let t;
			n._$AQ?.(o), n._$AM = o, void 0 !== n._$AP && (t = o._$AU) !== i._$AU && n._$AP(t);
		}
		if (t !== l || c) {
			let o = n._$AA;
			for (; o !== t;) {
				const t = o.nextSibling;
				e.insertBefore(o, l), o = t;
			}
		}
	}
	return n;
}, v = (o, t, i = o) => (o._$AI(t, i), o), u$1 = {}, m$1 = (o, t = u$1) => o._$AH = t, p = (o) => o._$AH, M = (o) => {
	o._$AP?.(!1, !0);
	let t = o._$AA;
	const i = o._$AB.nextSibling;
	for (; t !== i;) {
		const o = t.nextSibling;
		t.remove(), t = o;
	}
};
//#endregion
//#region node_modules/lit-html/async-directive.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s$1 = (i, t) => {
	const e = i._$AN;
	if (void 0 === e) return !1;
	for (const i of e) i._$AO?.(t, !1), s$1(i, t);
	return !0;
}, o = (i) => {
	let t, e;
	do {
		if (void 0 === (t = i._$AM)) break;
		e = t._$AN, e.delete(i), i = t;
	} while (0 === e?.size);
}, r$1 = (i) => {
	for (let t; t = i._$AM; i = t) {
		let e = t._$AN;
		if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
		else if (e.has(i)) break;
		e.add(i), c$2(t);
	}
};
function h$1(i) {
	void 0 !== this._$AN ? (o(this), this._$AM = i, r$1(this)) : this._$AM = i;
}
function n$2(i, t = !1, e = 0) {
	const r = this._$AH, h = this._$AN;
	if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s$1(r[i], !1), o(r[i]);
	else null != r && (s$1(r, !1), o(r));
	else s$1(this, i);
}
var c$2 = (i) => {
	i.type == t$1.CHILD && (i._$AP ??= n$2, i._$AQ ??= h$1);
};
var f = class extends i$4 {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(i, t, e) {
		super._$AT(i, t, e), r$1(this), this.isConnected = i._$AU;
	}
	_$AO(i, t = !0) {
		i !== this.isConnected && (this.isConnected = i, i ? this.reconnected?.() : this.disconnected?.()), t && (s$1(this, i), o(this));
	}
	setValue(t) {
		if (f$1(this._$Ct)) this._$Ct._$AI(t, this);
		else {
			const i = [...this._$Ct._$AH];
			i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
//#endregion
//#region node_modules/lit-html/directives/private-async-helpers.js
var s = class {
	constructor(t) {
		this.G = t;
	}
	disconnect() {
		this.G = void 0;
	}
	reconnect(t) {
		this.G = t;
	}
	deref() {
		return this.G;
	}
};
var i$1 = class {
	constructor() {
		this.Y = void 0, this.Z = void 0;
	}
	get() {
		return this.Y;
	}
	pause() {
		this.Y ??= new Promise(((t) => this.Z = t));
	}
	resume() {
		this.Z?.(), this.Y = this.Z = void 0;
	}
};
//#endregion
//#region node_modules/lit-html/directives/until.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var n$1 = (t) => !i$2(t) && "function" == typeof t.then, h = 1073741823;
var c$1 = class extends f {
	constructor() {
		super(...arguments), this._$Cwt = h, this._$Cbt = [], this._$CK = new s(this), this._$CX = new i$1();
	}
	render(...s) {
		return s.find(((t) => !n$1(t))) ?? T;
	}
	update(s, i) {
		const e = this._$Cbt;
		let r = e.length;
		this._$Cbt = i;
		const o = this._$CK, c = this._$CX;
		this.isConnected || this.disconnected();
		for (let t = 0; t < i.length && !(t > this._$Cwt); t++) {
			const s = i[t];
			if (!n$1(s)) return this._$Cwt = t, s;
			t < r && s === e[t] || (this._$Cwt = h, r = 0, Promise.resolve(s).then((async (t) => {
				for (; c.get();) await c.get();
				const i = o.deref();
				if (void 0 !== i) {
					const e = i._$Cbt.indexOf(s);
					e > -1 && e < i._$Cwt && (i._$Cwt = e, i.setValue(t));
				}
			})));
		}
		return T;
	}
	disconnected() {
		this._$CK.disconnect(), this._$CX.pause();
	}
	reconnected() {
		this._$CK.reconnect(this), this._$CX.resume();
	}
};
var m = e$2(c$1);
//#endregion
//#region node_modules/lit-html/directives/when.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function n(n, r, t) {
	return n ? r(n) : t?.(n);
}
//#endregion
//#region src/sections/player/player-header.ts
var PlayerHeader = class extends i$5 {
	render() {
		const { headerEntityFontSize, headerSongFontSize, hideEntityName, hideArtistAlbum, showAudioInputFormat } = this.store.config.player ?? {};
		const entityStyle = headerEntityFontSize ? { fontSize: `${headerEntityFontSize}rem` } : {};
		const songStyle = headerSongFontSize ? { fontSize: `${headerSongFontSize}rem` } : {};
		return x` <div class="info">
      <div class="entity" style=${o$1(entityStyle)} ?hidden=${!!hideEntityName}>
        ${getSpeakerList(this.store.activePlayer, this.store.predefinedGroups)}
      </div>
      <div class="song" style=${o$1(songStyle)}>${this.getSong()}</div>
      <div class="artist-album" ?hidden=${!!hideArtistAlbum}>${this.getAlbum()} ${n(showAudioInputFormat, () => m(this.getAudioInputFormat()))}</div>
      <sonos-progress .store=${this.store}></sonos-progress>
    </div>`;
	}
	getSong() {
		const { labelWhenNoMediaIsSelected, showSource } = this.store.config.player ?? {};
		let song = this.store.activePlayer.getCurrentTrack();
		song = song || labelWhenNoMediaIsSelected || "No media selected";
		if (showSource && this.store.activePlayer.attributes.source) song = `${song} (${this.store.activePlayer.attributes.source})`;
		return song;
	}
	getAlbum() {
		const { showChannel, hidePlaylist } = this.store.config.player ?? {};
		let album = this.store.activePlayer.attributes.media_album_name;
		if (showChannel && this.store.activePlayer.attributes.media_channel) album = this.store.activePlayer.attributes.media_channel;
		else if (!hidePlaylist && this.store.activePlayer.attributes.media_playlist) album = `${this.store.activePlayer.attributes.media_playlist} - ${album}`;
		return album;
	}
	async getAudioInputFormat() {
		const audioInputFormat = (await this.store.hassService.getRelatedEntities(this.store.activePlayer, "sensor")).find((sensor) => sensor.entity_id.includes("audio_input_format"));
		return audioInputFormat && audioInputFormat.state && audioInputFormat.state !== "No audio" ? x`<span class="audio-input-format">${audioInputFormat.state}</span>` : "";
	}
	static get styles() {
		return i$8`
      .info {
        text-align: center;
      }

      .entity {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: var(--sonos-font-size, 1rem);
        font-weight: 500;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .song {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: calc(var(--sonos-font-size, 1rem) * 1.15);
        font-weight: 400;
        color: var(--accent-color);
      }

      .artist-album {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: var(--sonos-font-size, 1rem);
        font-weight: 300;
        color: var(--secondary-text-color);
      }

      .audio-input-format {
        color: var(--card-background-color);
        background: var(--disabled-text-color);
        white-space: nowrap;
        font-size: smaller;
        line-height: normal;
        padding: 3px;
        margin-left: 8px;
      }

      [hidden] {
        display: none !important;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], PlayerHeader.prototype, "store", void 0);
customElements.define("sonos-player-header", PlayerHeader);
//#endregion
//#region src/sections/player/player-progress.ts
var PlayerProgress = class extends i$5 {
	constructor(..._args) {
		super(..._args);
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
		this.mediaDuration = this.store.activePlayer?.attributes.media_duration || 0;
		const showProgress = this.mediaDuration > 0;
		if (showProgress) this.trackProgress();
		return x`
      <div class="progress" ?hidden=${!showProgress}>
        <span>${convertProgress(this.playingProgress)}</span>
        <div class="bar" @click=${this.handleSeek}>
          <div class="progress-bar" style=${this.progressBarStyle(this.mediaDuration)}></div>
        </div>
        <span> -${convertProgress(this.mediaDuration - this.playingProgress)}</span>
      </div>
    `;
	}
	async handleSeek(e) {
		const progressWidth = this.progressBar.offsetWidth;
		const percent = e.offsetX / progressWidth;
		const position = this.mediaDuration * percent;
		await this.store.mediaControlService.seek(this.store.activePlayer, position);
	}
	progressBarStyle(mediaDuration) {
		return o$1({ width: `${this.playingProgress / mediaDuration * 100}%` });
	}
	trackProgress() {
		const position = this.store.activePlayer?.attributes.media_position || 0;
		const playing = this.store.activePlayer?.isPlaying();
		const updatedAt = this.store.activePlayer?.attributes.media_position_updated_at || 0;
		if (playing) this.playingProgress = position + (Date.now() - new Date(updatedAt).getTime()) / 1e3;
		else this.playingProgress = position;
		if (!this.tracker) this.tracker = setInterval(() => this.trackProgress(), 1e3);
		if (!playing) {
			clearInterval(this.tracker);
			this.tracker = void 0;
		}
	}
	static get styles() {
		return i$8`
      .progress {
        width: 100%;
        font-size: x-small;
        display: flex;
        --paper-progress-active-color: lightgray;
      }

      [hidden] {
        display: none !important;
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
};
__decorate$1([n$5({ attribute: false })], PlayerProgress.prototype, "store", void 0);
__decorate$1([r$3()], PlayerProgress.prototype, "playingProgress", void 0);
__decorate$1([e$3(".bar")], PlayerProgress.prototype, "progressBar", void 0);
var convertProgress = (duration) => {
	if (duration == null || !isFinite(duration)) return "";
	const date = (/* @__PURE__ */ new Date(duration * 1e3)).toISOString().substring(11, 19);
	return (date.startsWith("00:") ? date.substring(3) : date).replace(/^0(\d)/, "$1");
};
customElements.define("sonos-progress", PlayerProgress);
//#endregion
//#region src/components/volume.ts
var Volume = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.updateMembers = true;
		this.slim = false;
		this.isPlayer = false;
		this.sliderMoving = false;
		this.startVolumeSliderMoving = 0;
		this.togglePower = async () => await this.mediaControlService.togglePower(this.player);
	}
	render() {
		this.config = this.store.config;
		this.playerConfig = this.config.player ?? {};
		this.mediaControlService = this.store.mediaControlService;
		const volume = this.player.getVolume();
		const max = this.getMax();
		const muteIcon = (this.updateMembers ? this.player.isGroupMuted() : this.player.isMemberMuted()) ? mdiVolumeMute : mdiVolumeHigh;
		const disabled = this.player.ignoreVolume;
		const globalSliderHeight = this.config.volumeSliderHeight;
		const sliderHeight = this.isPlayer ? this.playerConfig.volumeSliderHeight ?? globalSliderHeight : globalSliderHeight;
		const iconButtonSize = (this.isPlayer ? this.playerConfig.volumeMuteButtonSize : void 0) ?? sliderHeight;
		const buttonStyle = [sliderHeight ? `height: ${sliderHeight}rem;` : "", iconButtonSize ? `--icon-button-size: ${iconButtonSize}rem;--icon-size: ${iconButtonSize * .75}rem;` : ""].join("");
		const sliderStyle = sliderHeight ? `--control-slider-thickness: ${sliderHeight}rem;` : "";
		return x`
      <div class="volume" slim=${this.slim || E}>
        <sonos-icon-button
          .disabled=${disabled}
          @click=${this.mute}
          .path=${muteIcon}
          hide=${this.isPlayer && this.playerConfig.hideVolumeMuteButton || E}
          style=${buttonStyle}
        >
        </sonos-icon-button>
        <div class="volume-slider">
          <ha-control-slider
            .value=${volume}
            max=${max}
            @value-changed=${this.volumeChanged}
            @slider-moved=${this.sliderMoved}
            .disabled=${disabled}
            class=${this.config.dynamicVolumeSlider && max === 100 ? "over-threshold" : ""}
            style=${sliderStyle}
          ></ha-control-slider>
          <div class="volume-level" hide=${this.isPlayer && this.playerConfig.hideVolumePercentage || E}>
            <div style="flex: ${volume}">${volume > 0 ? "0%" : ""}</div>
            <div class="percentage">${volume}%</div>
            <div style="flex: ${max - volume};text-align: right">${volume < max ? `${max}%` : ""}</div>
          </div>
        </div>
        <div class="percentage-slim" hide=${this.slim && E}>${volume}%</div>
        <sonos-icon-button hide=${this.store.hidePower()} @click=${this.togglePower} .path=${mdiPower} style=${buttonStyle}></sonos-icon-button>
      </div>
    `;
	}
	getMax() {
		const volume = this.sliderMoving ? this.startVolumeSliderMoving : this.player.getVolume();
		const dynamicThreshold = Math.max(0, Math.min(this.config.dynamicVolumeSliderThreshold ?? 20, 100));
		const dynamicMax = Math.max(0, Math.min(this.config.dynamicVolumeSliderMax ?? 30, 100));
		return volume < dynamicThreshold && this.config.dynamicVolumeSlider ? dynamicMax : 100;
	}
	async sliderMoved(e) {
		if (this.config.changeVolumeOnSlide) {
			console.log("slider moved", this.config.changeVolumeOnSlide);
			if (!this.sliderMoving) this.startVolumeSliderMoving = this.player.getVolume();
			this.sliderMoving = true;
			return await this.setVolume(e);
		}
	}
	async volumeChanged(e) {
		this.sliderMoving = false;
		return await this.setVolume(e);
	}
	async setVolume(e) {
		const newVolume = numberFromEvent(e);
		return await this.mediaControlService.volumeSet(this.player, newVolume, this.updateMembers);
	}
	async mute() {
		return await this.mediaControlService.toggleMute(this.player, this.updateMembers);
	}
	static get styles() {
		return i$8`
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
        --icon-button-size: 30px;
        --icon-size: 20px;
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
        font-size: calc(var(--sonos-font-size, 1rem) * 0.75);
        display: flex;
      }

      .percentage {
        flex: 2;
      }

      .percentage,
      .percentage-slim {
        font-weight: bold;
        align-self: center;
      }

      *[hide] {
        display: none;
      }

      sonos-icon-button {
        height: 40px;
        align-self: start;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Volume.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], Volume.prototype, "player", void 0);
__decorate$1([n$5({ type: Boolean })], Volume.prototype, "updateMembers", void 0);
__decorate$1([n$5()], Volume.prototype, "volumeClicked", void 0);
__decorate$1([n$5()], Volume.prototype, "slim", void 0);
__decorate$1([n$5()], Volume.prototype, "isPlayer", void 0);
__decorate$1([r$3()], Volume.prototype, "sliderMoving", void 0);
__decorate$1([r$3()], Volume.prototype, "startVolumeSliderMoving", void 0);
function numberFromEvent(e) {
	return Number.parseInt((e?.target)?.value);
}
customElements.define("sonos-volume", Volume);
//#endregion
//#region src/sections/player/player-section.ts
var Player = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.imageLoaded = false;
	}
	render() {
		this.resolveTemplateImageUrlIfNeeded();
		this.preloadImageIfNeeded();
		const { artworkAsBackgroundBlur: blurAmount = 0, artworkAsBackground: artworkAsBackgroundConfig, controlsAndHeaderBackgroundOpacity: backgroundOpacity = .9, backgroundOverlayColor: overlayColor, hideArtwork: hideArtworkConfig, controlsMargin, hideHeader, hideControls } = this.store.config.player ?? {};
		const hasRealArtwork = getArtworkImage(this.store, this.resolvedImageUrl).entityImage && this.imageLoaded;
		const artworkAsBackground = (!!artworkAsBackgroundConfig || blurAmount > 0) && hasRealArtwork;
		const opacityStyle = `--background-opacity: ${backgroundOpacity}${overlayColor ? `; --background-overlay-color: ${overlayColor}` : ""}`;
		const containerStyle = artworkAsBackground ? blurAmount > 0 ? `--blur-background-image: ${getBackgroundImageUrl(this.store, this.imageLoaded, this.resolvedImageUrl)}; --blur-amount: ${blurAmount}px; ${opacityStyle}` : `${getBackgroundImage(this.store, this.imageLoaded, this.resolvedImageUrl)}; ${opacityStyle}` : "";
		const hideArtwork = artworkAsBackground && !blurAmount || !!hideArtworkConfig;
		const controlsMarginStyle = controlsMargin ? `margin: ${controlsMargin}` : "";
		return x`
      <div class="container ${blurAmount > 0 ? "blurred-background" : ""}" style=${containerStyle || E}>
        <sonos-player-header class="header" background=${artworkAsBackground || E} .store=${this.store} ?hidden=${!!hideHeader}></sonos-player-header>
        <div class="artwork" ?hidden=${hideArtwork} style=${getArtworkStyle(this.store, this.imageLoaded, this.resolvedImageUrl)}></div>
        <sonos-player-controls
          class="controls"
          background=${artworkAsBackground || E}
          .store=${this.store}
          ?hidden=${!!hideControls}
          style=${controlsMarginStyle || E}
        ></sonos-player-controls>
      </div>
    `;
	}
	static get styles() {
		return playerSectionStyles;
	}
	preloadImageIfNeeded() {
		const imageUrl = getArtworkImage(this.store, this.resolvedImageUrl)?.entityImage;
		if (imageUrl === this.lastCheckedImageUrl) return;
		this.lastCheckedImageUrl = imageUrl;
		if (!imageUrl) {
			this.imageLoaded = false;
			return;
		}
		const img = new Image();
		img.onload = () => {
			if (this.lastCheckedImageUrl === imageUrl) this.imageLoaded = true;
		};
		img.onerror = () => {
			if (this.lastCheckedImageUrl === imageUrl) this.imageLoaded = false;
		};
		img.src = imageUrl;
	}
	resolveTemplateImageUrlIfNeeded() {
		const override = findArtworkOverride(this.store, this.store.activePlayer.attributes.entity_picture);
		const templateUrl = override?.imageUrl?.includes("{{") ? override.imageUrl : void 0;
		if (templateUrl && this.lastTemplateUrl !== templateUrl) {
			this.lastTemplateUrl = templateUrl;
			this.store.hassService.renderTemplate(templateUrl, "").then((result) => {
				this.resolvedImageUrl = result;
			});
		} else if (!templateUrl) {
			this.lastTemplateUrl = void 0;
			this.resolvedImageUrl = void 0;
		}
	}
};
__decorate$1([n$5({ attribute: false })], Player.prototype, "store", void 0);
__decorate$1([r$3()], Player.prototype, "resolvedImageUrl", void 0);
__decorate$1([r$3()], Player.prototype, "imageLoaded", void 0);
//#endregion
//#region node_modules/lit-html/directives/choose.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var r = (r, o, t) => {
	for (const t of o) if (t[0] === r) return (0, t[1])();
	return t?.();
};
//#endregion
//#region src/services/music-assistant-service.ts
var LIBRARY_URI_PREFIX = "library://";
var MusicAssistantService = class {
	constructor(hass) {
		this.hass = hass;
	}
	/**
	* Discover the Music Assistant config entry ID
	* Returns the first found Music Assistant integration ID, or null if not found
	*/
	async discoverConfigEntryId() {
		const musicAssistant = (await this.hass.callWS({ type: "config_entries/get" })).find((entry) => entry.domain === "music_assistant" && entry.state === "loaded");
		if (!musicAssistant) throw new Error("Music Assistant integration not found or not loaded");
		return musicAssistant.entry_id;
	}
	/**
	* Discover the mass_queue config entry ID (needed for send_command)
	* Returns the first found mass_queue integration ID, or null if not found
	*/
	async discoverMassQueueConfigEntryId() {
		const massQueue = (await this.hass.callWS({ type: "config_entries/get" })).find((entry) => entry.domain === "mass_queue" && entry.state === "loaded");
		if (!massQueue?.entry_id) throw new Error(MASS_QUEUE_NOT_INSTALLED);
		return massQueue.entry_id;
	}
	/**
	* Get favorites from Music Assistant library
	*/
	async getFavorites(configEntryId, mediaTypes = [
		"track",
		"album",
		"artist",
		"playlist",
		"radio"
	]) {
		const allFavorites = [];
		for (const mediaType of mediaTypes) try {
			const items = (await this.hass.callWS({
				type: "call_service",
				domain: "music_assistant",
				service: "get_library",
				service_data: {
					config_entry_id: configEntryId,
					favorite: true,
					media_type: mediaType,
					limit: 0
				},
				return_response: true
			})).response?.items ?? [];
			allFavorites.push(...items.map((item) => this.transformFavoriteItem(item, mediaType)));
		} catch (e) {
			console.warn(`Failed to get ${mediaType} favorites from Music Assistant:`, e);
		}
		return allFavorites;
	}
	transformFavoriteItem(item, mediaType) {
		let title = item.name;
		if (mediaType === "track" && item.artists?.length) title = `${item.artists.map((a) => a.name).join(", ")} - ${item.name}`;
		const thumbnail = typeof item.image === "string" ? item.image : item.image?.path;
		return {
			title,
			media_content_id: item.uri,
			media_content_type: mediaType,
			thumbnail,
			can_play: true,
			favoriteType: this.getFavoriteTypeLabel(mediaType)
		};
	}
	getFavoriteTypeLabel(mediaType) {
		switch (mediaType) {
			case "track": return "Tracks";
			case "album": return "Albums";
			case "artist": return "Artists";
			case "playlist": return "Playlists";
			case "radio": return "Radio";
			default: return mediaType;
		}
	}
	/**
	* Search Music Assistant for media
	*/
	async search(configEntryId, name, mediaType, limit = 50) {
		try {
			const response = await this.hass.callWS({
				type: "call_service",
				domain: "music_assistant",
				service: "search",
				service_data: {
					config_entry_id: configEntryId,
					name,
					media_type: [mediaType],
					limit
				},
				return_response: true
			});
			return this.transformResults(response.response, mediaType);
		} catch (e) {
			console.error("Music Assistant search failed:", e);
			throw e;
		}
	}
	/**
	* Search multiple media types with library filter
	* @param libraryFilter - 'all' (no filter), 'library' (only library), 'non-library' (exclude library)
	*/
	async searchMultipleTypes(configEntryId, name, mediaTypes, limit = 50, libraryFilter = "all") {
		const searchPromises = mediaTypes.map((type) => this.search(configEntryId, name, type, limit));
		let allResults = (await Promise.all(searchPromises)).flat();
		if (libraryFilter === "library") allResults = allResults.filter((item) => item.uri.startsWith(LIBRARY_URI_PREFIX));
		else if (libraryFilter === "non-library") allResults = this.filterLibraryItems(allResults);
		return allResults;
	}
	/**
	* Filter out items with library:// URIs
	*/
	filterLibraryItems(results) {
		return results.filter((item) => !item.uri.startsWith(LIBRARY_URI_PREFIX));
	}
	/**
	* Transform Music Assistant response to our internal format
	*/
	transformResults(response, mediaType) {
		return this.getResultsForType(response, mediaType).map((item) => this.transformResultItem(item, mediaType));
	}
	getResultsForType(response, mediaType) {
		switch (mediaType) {
			case "artist": return response.artists ?? [];
			case "album": return response.albums ?? [];
			case "track": return response.tracks ?? [];
			case "playlist": return response.playlists ?? [];
			case "radio": return response.radio ?? [];
			default: return [];
		}
	}
	transformResultItem(item, mediaType) {
		let title = item.name;
		let subtitle;
		if (mediaType === "track") {
			const artistNames = item.artists?.map((a) => a.name).join(", ");
			if (artistNames) title = `${artistNames} - ${item.name}`;
			if (item.album?.name) subtitle = `(${item.album.name})`;
		} else if (mediaType === "album") subtitle = item.artists?.map((a) => a.name).join(", ");
		const imageUrl = typeof item.image === "string" ? item.image : item.image?.path;
		return {
			title,
			subtitle,
			uri: item.uri,
			mediaType,
			imageUrl,
			favorite: item.favorite,
			inLibrary: item.in_library ?? item.uri.startsWith(LIBRARY_URI_PREFIX),
			itemId: item.item_id,
			provider: item.provider
		};
	}
	isMusicAssistantPlayer(mediaPlayer) {
		return mediaPlayer.attributes.platform === "music_assistant";
	}
	async getCurrentSongFavorite(mediaPlayer) {
		try {
			return (await this.hass.callWS({
				type: "call_service",
				domain: "music_assistant",
				service: "get_queue",
				target: { entity_id: mediaPlayer.id },
				return_response: true
			})).response[mediaPlayer.id]?.current_item?.media_item?.favorite ?? null;
		} catch (e) {
			console.warn("Error getting favorite status", e);
			return null;
		}
	}
	async favoriteCurrentSong(mediaPlayer) {
		try {
			const buttonEntity = await this.findRelatedEntityId(mediaPlayer, "button", "favorite_current_song");
			if (buttonEntity) {
				await this.hass.callService("button", "press", { entity_id: buttonEntity });
				return true;
			}
			return false;
		} catch (e) {
			console.warn("Error favoriting current song", e);
			return false;
		}
	}
	async unfavoriteCurrentSong(mediaPlayer) {
		try {
			await this.hass.callService("mass_queue", "unfavorite_current_item", { entity: mediaPlayer.id });
			return true;
		} catch (e) {
			console.warn("Error unfavoriting current song", e);
			return false;
		}
	}
	async getCurrentQueueItemId(mediaPlayer) {
		if (!this.isMusicAssistantPlayer(mediaPlayer)) return null;
		try {
			return (await this.hass.callWS({
				type: "call_service",
				domain: "music_assistant",
				service: "get_queue",
				target: { entity_id: mediaPlayer.id },
				return_response: true
			})).response[mediaPlayer.id]?.current_item?.queue_item_id ?? null;
		} catch (e) {
			console.warn("Error getting current queue item id", e);
			return null;
		}
	}
	async getQueue(mediaPlayer) {
		try {
			const queueItems = (await this.hass.callWS({
				type: "call_service",
				domain: "mass_queue",
				service: "get_queue_items",
				service_data: {
					entity: mediaPlayer.id,
					limit_before: 5
				},
				return_response: true
			})).response[mediaPlayer.id];
			if (!Array.isArray(queueItems)) return [];
			return queueItems.map((item) => this.mapQueueItem(item));
		} catch (e) {
			const error = e;
			if (error.message?.includes("mass_queue") || error.message?.includes("Service not found")) throw new Error(MASS_QUEUE_NOT_INSTALLED);
			throw e;
		}
	}
	mapQueueItem(item) {
		const artist = item.media_artist || "";
		const title = item.media_title || "";
		return {
			title: artist ? `${artist} - ${title}` : title,
			media_content_id: item.media_content_id,
			media_content_type: "track",
			thumbnail: item.media_image || void 0,
			queueItemId: item.queue_item_id
		};
	}
	async playQueueItem(mediaPlayer, queueItemId) {
		await this.hass.callService("mass_queue", "play_queue_item", {
			entity: mediaPlayer.id,
			queue_item_id: queueItemId
		});
	}
	async removeQueueItem(mediaPlayer, queueItemId) {
		await this.hass.callService("mass_queue", "remove_queue_item", {
			entity: mediaPlayer.id,
			queue_item_id: queueItemId
		});
	}
	async moveQueueItemNext(mediaPlayer, queueItemId) {
		await this.hass.callService("mass_queue", "move_queue_item_next", {
			entity: mediaPlayer.id,
			queue_item_id: queueItemId
		});
	}
	async playMedia(mediaPlayer, mediaId, enqueue, radioMode) {
		await this.hass.callService("music_assistant", "play_media", {
			entity_id: mediaPlayer.id,
			media_id: [mediaId],
			...enqueue && { enqueue },
			...radioMode && { radio_mode: true }
		});
	}
	/**
	* Get collection items based on media type
	*/
	async getCollectionItems(uri, mediaType, massConfigEntryId) {
		return this.getCollectionTracks(`get_${mediaType}_tracks`, uri, massConfigEntryId);
	}
	async getCollectionTracks(service, uri, massQueueConfigEntryId) {
		try {
			const items = (await this.hass.callWS({
				type: "call_service",
				domain: "mass_queue",
				service,
				service_data: {
					uri,
					config_entry_id: massQueueConfigEntryId
				},
				return_response: true
			})).response?.tracks;
			if (!Array.isArray(items)) return [];
			return items.map((item) => this.mapCollectionTrack(item));
		} catch (e) {
			console.error(`Failed to get collection tracks (${service}):`, e);
			throw e;
		}
	}
	mapCollectionTrack(item) {
		const artist = item.media_artist || "";
		const title = item.media_title || "";
		return {
			title: artist ? `${artist} - ${title}` : title,
			subtitle: item.media_album_name || void 0,
			uri: item.media_content_id,
			mediaType: "track",
			imageUrl: item.media_image || void 0,
			favorite: item.favorite
		};
	}
	async findRelatedEntityId(mediaPlayer, entityType, namePart) {
		const template = `{{ device_entities(device_id('${mediaPlayer.id}')) }}`;
		return (await this.renderTemplate(template, [])).filter((id) => id.includes(entityType)).map((id) => this.hass.states[id]).filter(Boolean).find((e) => e?.entity_id?.toLowerCase().includes(namePart.toLowerCase()))?.entity_id;
	}
	renderTemplate(template, defaultValue) {
		return new Promise((resolve) => {
			try {
				this.hass.connection.subscribeMessage((response) => {
					try {
						resolve(response.result);
					} catch {
						resolve(defaultValue);
					}
				}, {
					type: "render_template",
					template
				}).then((unsub) => unsub());
			} catch {
				resolve(defaultValue);
			}
		});
	}
	/**
	* Send a command to Music Assistant via mass_queue.send_command
	*/
	async sendMassCommand(massQueueConfigEntryId, command, data = {}, returnResponse = false) {
		if (returnResponse) return (await this.hass.callWS({
			type: "call_service",
			domain: "mass_queue",
			service: "send_command",
			service_data: {
				command,
				data,
				config_entry_id: massQueueConfigEntryId
			},
			return_response: true
		})).response.response;
		await this.hass.callService("mass_queue", "send_command", {
			command,
			data,
			config_entry_id: massQueueConfigEntryId
		});
	}
	/**
	* Add an item to favorites via Music Assistant API
	* Uses music/favorites/add_item which accepts a URI and handles
	* adding to library + setting favorite automatically
	*/
	async addToFavorites(massQueueConfigEntryId, uri) {
		try {
			await this.sendMassCommand(massQueueConfigEntryId, "music/favorites/add_item", { item: uri });
			return true;
		} catch (e) {
			console.error("Failed to add to favorites:", e);
			return false;
		}
	}
	/**
	* Remove an item from favorites via Music Assistant API
	* Uses music/favorites/remove_item which requires media_type and library_item_id
	*/
	async removeFromFavorites(massQueueConfigEntryId, uri, mediaType, itemId, provider) {
		try {
			const libraryItemId = await this.resolveLibraryItemId(massQueueConfigEntryId, uri, mediaType, itemId, provider);
			if (!libraryItemId) {
				console.error("Could not determine library item ID for unfavoriting");
				return false;
			}
			await this.sendMassCommand(massQueueConfigEntryId, "music/favorites/remove_item", {
				media_type: mediaType,
				library_item_id: libraryItemId
			});
			return true;
		} catch (e) {
			console.error("Failed to remove from favorites:", e);
			return false;
		}
	}
	/**
	* Add an item to the library via Music Assistant API
	*/
	async addToLibrary(massQueueConfigEntryId, uri) {
		try {
			await this.sendMassCommand(massQueueConfigEntryId, "music/library/add_item", { item: uri });
			return true;
		} catch (e) {
			console.error("Failed to add to library:", e);
			return false;
		}
	}
	/**
	* Remove an item from the library via Music Assistant API
	*/
	async removeFromLibrary(massQueueConfigEntryId, uri, mediaType, itemId, provider) {
		try {
			const libraryItemId = await this.resolveLibraryItemId(massQueueConfigEntryId, uri, mediaType, itemId, provider);
			if (!libraryItemId) {
				console.error("Could not determine library item ID for removal");
				return false;
			}
			await this.sendMassCommand(massQueueConfigEntryId, "music/library/remove_item", {
				media_type: mediaType,
				library_item_id: libraryItemId
			});
			return true;
		} catch (e) {
			console.error("Failed to remove from library:", e);
			return false;
		}
	}
	/**
	* Resolve the library item ID from various sources
	*/
	async resolveLibraryItemId(massQueueConfigEntryId, uri, mediaType, itemId, provider) {
		if (provider === "library" && itemId) return itemId;
		if (uri.startsWith(LIBRARY_URI_PREFIX)) return uri.split("/").pop();
		if (itemId && provider) {
			const libraryItem = await this.sendMassCommand(massQueueConfigEntryId, "music/get_library_item", {
				media_type: mediaType,
				item_id: itemId,
				provider_instance_id_or_domain: provider
			}, true);
			return libraryItem?.item_id ? String(libraryItem.item_id) : void 0;
		}
	}
};
//#endregion
//#region src/services/hass-service.ts
var HassService = class {
	constructor(hass, section, card) {
		this.hass = hass;
		this.currentSection = section;
		this.card = card;
		this.musicAssistantService = new MusicAssistantService(hass);
	}
	async callWithLoader(action) {
		this.card.dispatchEvent(customEvent(CALL_MEDIA_STARTED, { section: this.currentSection }));
		try {
			return await action();
		} finally {
			this.card.dispatchEvent(customEvent(CALL_MEDIA_DONE));
		}
	}
	async callMediaService(service, inOptions) {
		await this.callWithLoader(() => this.hass.callService("media_player", service, inOptions));
	}
	async callService(domain, service, serviceData) {
		await this.hass.callService(domain, service, serviceData);
	}
	async renderTemplate(template, defaultValue) {
		return new Promise((resolve) => {
			const subscribeMessage = {
				type: "render_template",
				template
			};
			try {
				this.hass.connection.subscribeMessage((response) => {
					try {
						resolve(response.result);
					} catch {
						resolve(defaultValue);
					}
				}, subscribeMessage).then((unsub) => unsub());
			} catch {
				resolve(defaultValue);
			}
		});
	}
	async getRelatedEntities(player, ...entityTypes) {
		const template = `{{ device_entities(device_id('${player.id}')) }}`;
		return (await this.renderTemplate(template, [])).filter((item) => entityTypes.some((type) => item.includes(type))).map((item) => this.hass.states[item]);
	}
	isMusicAssistant(mediaPlayer) {
		return this.musicAssistantService.isMusicAssistantPlayer(mediaPlayer);
	}
	async getQueue(mediaPlayer) {
		if (this.isMusicAssistant(mediaPlayer)) return await this.musicAssistantService.getQueue(mediaPlayer);
		return await this.getSonosQueue(mediaPlayer);
	}
	async getSonosQueue(mediaPlayer) {
		return (await this.hass.callWS({
			type: "call_service",
			domain: "sonos",
			service: "get_queue",
			target: { entity_id: mediaPlayer.id },
			return_response: true
		})).response[mediaPlayer.id].map((item) => {
			return {
				title: `${item.media_artist} - ${item.media_title}`,
				media_content_id: item.media_content_id,
				media_content_type: item.media_content_type
			};
		});
	}
	async removeFromQueue(mediaPlayer, queuePosition, queueItemId) {
		if (this.isMusicAssistant(mediaPlayer) && queueItemId) await this.musicAssistantService.removeQueueItem(mediaPlayer, queueItemId);
		else await this.hass.callService("sonos", "remove_from_queue", {
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
		await this.hass.callService("sonos", "clear_sleep_timer", { entity_id: player.id });
	}
	async setSwitch(entityId, state) {
		await this.hass.callService("switch", state ? "turn_on" : "turn_off", { entity_id: entityId });
	}
	async setNumber(entityId, value) {
		await this.hass.callService("number", "set_value", {
			entity_id: entityId,
			value
		});
	}
	async setRelatedEntityValue(player, name, value) {
		if (value === void 0) return;
		const type = typeof value === "number" ? "number" : "switch";
		const entityId = await this.getRelatedEntityId(player, type, name);
		if (!entityId) return;
		if (typeof value === "number") await this.setNumber(entityId, value);
		else await this.setSwitch(entityId, value);
	}
	async getRelatedEntityId(player, entityType, namePart) {
		return (await this.getRelatedEntities(player, entityType)).find((e) => e?.entity_id?.toLowerCase().includes(namePart.toLowerCase()))?.entity_id;
	}
};
//#endregion
//#region src/services/media-browse-service.ts
var MediaBrowseService = class {
	constructor(hass, config) {
		this.massConfigEntryId = null;
		this.massConfigDiscoveryDone = false;
		this.hass = hass;
		this.config = config;
		this.musicAssistantService = new MusicAssistantService(hass);
	}
	isMusicAssistant(player) {
		return player.attributes.platform === "music_assistant";
	}
	async getMassConfigEntryId() {
		if (!this.massConfigDiscoveryDone) {
			this.massConfigEntryId = await this.musicAssistantService.discoverConfigEntryId();
			this.massConfigDiscoveryDone = true;
		}
		return this.massConfigEntryId;
	}
	async getFavorites(player) {
		if (!player) return [];
		let favorites;
		if (this.isMusicAssistant(player)) favorites = await this.getMusicAssistantFavorites();
		else {
			favorites = await this.getFavoritesForPlayer(player);
			favorites = favorites.flatMap((f) => f);
			favorites = this.removeDuplicates(favorites);
			favorites = favorites.length ? favorites : this.getFavoritesFromStates(player);
		}
		const exclude = this.config.mediaBrowser?.favorites?.exclude ?? [];
		return favorites.filter((item) => {
			const titleNotIgnored = !stringContainsAnyItemInArray(exclude, item.title);
			const contentIdNotIgnored = !stringContainsAnyItemInArray(exclude, item.media_content_id ?? "");
			return titleNotIgnored && contentIdNotIgnored;
		});
	}
	async getMusicAssistantFavorites() {
		const configEntryId = await this.getMassConfigEntryId();
		if (!configEntryId) {
			console.warn("Music Assistant config entry not found");
			return [];
		}
		return this.musicAssistantService.getFavorites(configEntryId);
	}
	removeDuplicates(items) {
		const seen = /* @__PURE__ */ new Set();
		return items.filter((item) => {
			const key = item.media_content_id || item.title;
			if (!key || seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
	async getFavoritesForPlayer(player) {
		const mediaRoot = await browseMediaPlayer(this.hass, player.id);
		const favoritesStr = "favorites";
		const favoritesDir = mediaRoot.children?.find((child) => child.media_content_type?.toLowerCase() === favoritesStr || child.media_content_id?.toLowerCase() === favoritesStr || child.title.toLowerCase() === favoritesStr);
		if (!favoritesDir) return [];
		const favorites = [];
		await this.browseDir(player, favoritesDir, favorites);
		return favorites;
	}
	async browseDir(player, favoritesDir, favorites) {
		const dir = await browseMediaPlayer(this.hass, player.id, favoritesDir.media_content_id, favoritesDir.media_content_type);
		for (const child of dir.children ?? []) if (child.can_play) favorites.push({
			...child,
			favoriteType: dir.title
		});
		else if (child.can_expand) await this.browseDir(player, child, favorites);
	}
	getFavoritesFromStates(mediaPlayer) {
		return (mediaPlayer.attributes.source_list ?? []).map((title) => ({ title }));
	}
	showBrowseMedia(activePlayer, element) {
		const detail = {
			entityId: activePlayer.id,
			view: "info"
		};
		element.dispatchEvent(customEvent(HASS_MORE_INFO, detail));
	}
};
//#endregion
//#region src/services/media-control-service.ts
var MediaControlService = class {
	constructor(hassService, config) {
		this.hassService = hassService;
		this.config = config;
	}
	isMusicAssistant(mediaPlayer) {
		return mediaPlayer.attributes.platform === "music_assistant";
	}
	async join(main, memberIds) {
		await this.hassService.callMediaService("join", {
			entity_id: main,
			group_members: memberIds
		});
	}
	async unJoin(playerIds) {
		await this.hassService.callMediaService("unjoin", { entity_id: playerIds });
	}
	async activatePredefinedGroup(pg) {
		for (const pgp of pg.entities) {
			const volume = pgp.volume ?? pg.volume;
			if (volume) await this.volumeSetSinglePlayer(pgp.player, volume);
			if (pg.unmuteWhenGrouped) await this.setVolumeMute(pgp.player, false, false);
			await this.applyPredefinedGroupSettings(pgp.player, pg);
		}
		if (pg.media) await this.setSource(pg.entities[0].player, pg.media);
	}
	async applyPredefinedGroupSettings(player, pg) {
		await this.hassService.setRelatedEntityValue(player, "bass", pg.bass);
		await this.hassService.setRelatedEntityValue(player, "treble", pg.treble);
		await this.hassService.setRelatedEntityValue(player, "loudness", pg.loudness);
		await this.hassService.setRelatedEntityValue(player, "night_sound", pg.nightSound);
		await this.hassService.setRelatedEntityValue(player, "speech_enhancement", pg.speechEnhancement);
		await this.hassService.setRelatedEntityValue(player, "crossfade", pg.crossfade);
		await this.hassService.setRelatedEntityValue(player, "touch_controls", pg.touchControls);
		await this.hassService.setRelatedEntityValue(player, "status_light", pg.statusLight);
	}
	async stop(mediaPlayer) {
		await this.hassService.callMediaService("media_stop", { entity_id: mediaPlayer.id });
	}
	async pause(mediaPlayer) {
		await this.hassService.callMediaService("media_pause", { entity_id: mediaPlayer.id });
	}
	async prev(mediaPlayer) {
		await this.hassService.callMediaService("media_previous_track", { entity_id: mediaPlayer.id });
	}
	async next(mediaPlayer) {
		await this.hassService.callMediaService("media_next_track", { entity_id: mediaPlayer.id });
	}
	async play(mediaPlayer) {
		await this.hassService.callMediaService("media_play", { entity_id: mediaPlayer.id });
	}
	async shuffle(mediaPlayer) {
		await this.hassService.callMediaService("shuffle_set", {
			entity_id: mediaPlayer.id,
			shuffle: !mediaPlayer.attributes.shuffle
		});
	}
	async repeat(mediaPlayer) {
		const currentState = mediaPlayer.attributes.repeat;
		const repeat = currentState === "all" ? "one" : currentState === "one" ? "off" : "all";
		await this.hassService.callMediaService("repeat_set", {
			entity_id: mediaPlayer.id,
			repeat
		});
	}
	async volumeDown(mainPlayer, updateMembers = true) {
		await this.volumeStep(mainPlayer, updateMembers, this.getStepDownVolume, "volume_down");
	}
	async volumeUp(mainPlayer, updateMembers = true) {
		await this.volumeStep(mainPlayer, updateMembers, this.getStepUpVolume, "volume_up");
	}
	async volumeStep(mainPlayer, updateMembers, calculateVolume, stepDirection) {
		if (this.config.volumeStepSize) await this.volumeWithStepSize(mainPlayer, updateMembers, this.config.volumeStepSize, calculateVolume);
		else await this.volumeDefaultStep(mainPlayer, updateMembers, stepDirection);
	}
	async volumeWithStepSize(mainPlayer, updateMembers, volumeStepSize, calculateVolume) {
		for (const member of mainPlayer.members) if (mainPlayer.id === member.id || updateMembers) {
			const newVolume = calculateVolume(member, volumeStepSize);
			await this.volumeSetSinglePlayer(member, newVolume);
		}
	}
	getStepDownVolume(member, volumeStepSize) {
		return Math.max(0, member.getVolume() - volumeStepSize);
	}
	getStepUpVolume(member, stepSize) {
		return Math.min(100, member.getVolume() + stepSize);
	}
	async volumeDefaultStep(mainPlayer, updateMembers, stepDirection) {
		for (const member of mainPlayer.members) if (mainPlayer.id === member.id || updateMembers) {
			if (!member.ignoreVolume) await this.hassService.callMediaService(stepDirection, { entity_id: member.id });
		}
	}
	async volumeSet(player, volume, updateMembers) {
		if (updateMembers) return await this.volumeSetGroup(player, volume);
		else return await this.volumeSetSinglePlayer(player, volume);
	}
	async volumeSetGroup(player, volumePercent) {
		if (player.members.every((member) => member.getVolume() === 0)) await Promise.all(player.members.map((member) => {
			return this.volumeSetSinglePlayer(member, volumePercent);
		}));
		else {
			let relativeVolumeChange;
			if (this.config.adjustVolumeRelativeToMainPlayer) relativeVolumeChange = player.getVolume() < 1 ? 1 : volumePercent / player.getVolume();
			await Promise.all(player.members.map((member) => {
				let memberVolume = volumePercent;
				if (relativeVolumeChange !== void 0) {
					if (this.config.adjustVolumeRelativeToMainPlayer) {
						memberVolume = member.getVolume() * relativeVolumeChange;
						memberVolume = Math.min(100, Math.max(0, memberVolume));
					}
				}
				return this.volumeSetSinglePlayer(member, memberVolume);
			}));
		}
	}
	async volumeSetSinglePlayer(player, volumePercent) {
		if (!player.ignoreVolume) {
			const volume = volumePercent / 100;
			await this.hassService.callMediaService("volume_set", {
				entity_id: player.id,
				volume_level: volume
			});
		}
	}
	async toggleMute(mediaPlayer, updateMembers = true) {
		const muteVolume = !(updateMembers ? mediaPlayer.isGroupMuted() : mediaPlayer.isMemberMuted());
		await this.setVolumeMute(mediaPlayer, muteVolume, updateMembers);
	}
	async setVolumeMute(mediaPlayer, muteVolume, updateMembers = true) {
		for (const member of mediaPlayer.members) if (mediaPlayer.id === member.id || updateMembers) await this.hassService.callMediaService("volume_mute", {
			entity_id: member.id,
			is_volume_muted: muteVolume
		});
	}
	async setSource(mediaPlayer, source) {
		await this.hassService.callMediaService("select_source", {
			source,
			entity_id: mediaPlayer.id
		});
	}
	async playMedia(mediaPlayer, item, enqueue) {
		const mediaContentId = enqueue ? this.transformMediaContentId(item.media_content_id ?? "") : item.media_content_id ?? "";
		if (this.config.entityPlatform === "music_assistant") await this.hassService.callWithLoader(() => this.hassService.musicAssistantService.playMedia(mediaPlayer, mediaContentId, enqueue));
		else await this.hassService.callMediaService("play_media", {
			entity_id: mediaPlayer.id,
			media_content_id: mediaContentId,
			media_content_type: item.media_content_type ?? "music",
			...enqueue && { enqueue }
		});
	}
	async playQueue(mediaPlayer, queuePosition, queueItemId) {
		if (this.isMusicAssistant(mediaPlayer) && queueItemId) await this.hassService.callWithLoader(() => this.hassService.musicAssistantService.playQueueItem(mediaPlayer, queueItemId));
		else await this.hassService.callWithLoader(() => this.hassService.callService("sonos", "play_queue", {
			entity_id: mediaPlayer.id,
			queue_position: queuePosition
		}));
	}
	async moveQueueItemAfterCurrent(mediaPlayer, item, index, currentIndex) {
		if (this.isMusicAssistant(mediaPlayer)) {
			if (index === currentIndex || index === currentIndex + 1) return;
			if (item.queueItemId) await this.hassService.musicAssistantService.moveQueueItemNext(mediaPlayer, item.queueItemId);
		} else {
			await this.playMedia(mediaPlayer, item, "next");
			const removeIndex = index > currentIndex ? index + 1 : index;
			await this.hassService.removeFromQueue(mediaPlayer, removeIndex, item.queueItemId);
		}
	}
	async moveQueueItemsAfterCurrent(mediaPlayer, items, indices, currentIndex, onProgress, shouldCancel) {
		if (this.isMusicAssistant(mediaPlayer)) {
			const reversedForInsert = [...indices.filter((i) => i !== currentIndex && i !== currentIndex + 1)].reverse();
			let completed = 0;
			for (const index of reversedForInsert) {
				if (shouldCancel?.()) return;
				const item = items[index];
				if (item?.queueItemId) await this.hassService.musicAssistantService.moveQueueItemNext(mediaPlayer, item.queueItemId);
				completed++;
				onProgress?.(completed);
			}
			return;
		}
		const reversedForInsert = [...indices].reverse();
		let completed = 0;
		for (const index of reversedForInsert) {
			if (shouldCancel?.()) return;
			const item = items[index];
			if (item?.media_content_id) await this.playMedia(mediaPlayer, item, "next");
			completed++;
			onProgress?.(completed);
		}
		const numInserted = indices.length;
		const reversedIndices = [...indices].reverse();
		for (const originalIndex of reversedIndices) {
			if (shouldCancel?.()) return;
			const item = items[originalIndex];
			const removeIndex = originalIndex > currentIndex ? originalIndex + numInserted : originalIndex;
			await this.hassService.removeFromQueue(mediaPlayer, removeIndex, item?.queueItemId);
		}
	}
	async moveQueueItemsToEnd(mediaPlayer, items, indices, onProgress, shouldCancel) {
		let completed = 0;
		for (const index of indices) {
			if (shouldCancel?.()) return;
			const item = items[index];
			if (item?.media_content_id) await this.playMedia(mediaPlayer, item, "add");
			completed++;
			onProgress?.(completed);
		}
		const reversedIndices = [...indices].reverse();
		for (const originalIndex of reversedIndices) {
			if (shouldCancel?.()) return;
			const item = items[originalIndex];
			await this.hassService.removeFromQueue(mediaPlayer, originalIndex, item?.queueItemId);
		}
	}
	async queueAndPlay(mediaPlayer, items, enqueueMode, onProgress, shouldCancel) {
		if (items.length === 0) return;
		const [firstItem, ...restItems] = items;
		await this.playMedia(mediaPlayer, firstItem, enqueueMode);
		onProgress?.(1);
		for (let i = restItems.length - 1; i >= 0; i--) {
			if (shouldCancel?.()) return;
			await this.playMedia(mediaPlayer, restItems[i], "next");
			onProgress?.(restItems.length - i + 1);
		}
	}
	transformMediaContentId(id) {
		if (!id) return "";
		try {
			const withoutQuery = id.split("?")[0];
			const decoded = decodeURIComponent(withoutQuery);
			const colonMatches = decoded.match(/:/g);
			if (colonMatches && colonMatches.length >= 2) {
				const firstColonIndex = decoded.indexOf(":");
				return decoded.substring(firstColonIndex + 1);
			}
			return decoded;
		} catch {
			return id;
		}
	}
	async seek(mediaPlayer, position) {
		await this.hassService.callMediaService("media_seek", {
			entity_id: mediaPlayer.id,
			seek_position: position
		});
	}
	async togglePower(mediaPlayer) {
		const service = mediaPlayer.isOn() ? "turn_off" : "turn_on";
		await this.hassService.callMediaService(service, { entity_id: mediaPlayer.id });
	}
};
//#endregion
//#region src/model/media-player.ts
var MediaPlayer = class MediaPlayer {
	constructor(hassEntity, config, mediaPlayerHassEntities) {
		this.id = hassEntity.entity_id;
		this.config = config;
		this.name = this.getEntityName(hassEntity);
		this.state = hassEntity.state;
		this.attributes = hassEntity.attributes;
		this.members = mediaPlayerHassEntities ? this.createGroupMembers(hassEntity, mediaPlayerHassEntities) : [this];
		this.volumePlayer = this.determineVolumePlayer();
		this.ignoreVolume = !!this.config.entitiesToIgnoreVolumeLevelFor?.includes(this.volumePlayer.id);
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
		if (this.config.inverseGroupMuteState) return this.members.some((member) => member.isMemberMuted());
		return this.members.every((member) => member.isMemberMuted());
	}
	getCurrentTrack() {
		const matchingFavorite = findMatchingCustomFavorite(this.config.mediaBrowser?.favorites?.customFavorites, this.attributes.media_content_id, this.id);
		if (matchingFavorite?.useTitleAsMediaTitle) return matchingFavorite.title;
		let track = `${this.attributes.media_artist || ""} - ${this.attributes.media_title || ""}`;
		track = track.replace(/^ - | - $/g, "");
		if (!track) track = this.attributes.media_content_id?.replace(/.*:\/\//g, "") ?? "";
		if (this.config.mediaTitleRegexToReplace) track = track.replace(new RegExp(this.config.mediaTitleRegexToReplace, "g"), this.config.mediaTitleReplacement || "");
		return track;
	}
	getEntityName(hassEntity) {
		const name = hassEntity.attributes.friendly_name || "";
		if (this.config.entityNameRegexToReplace) return name.replace(new RegExp(this.config.entityNameRegexToReplace, "g"), this.config.entityNameReplacement || "");
		return name;
	}
	createGroupMembers(mainHassEntity, mediaPlayerHassEntities) {
		const groupPlayerIds = getGroupPlayerIds(mainHassEntity);
		return mediaPlayerHassEntities.reduce((players, hassEntity) => {
			if (groupPlayerIds.includes(hassEntity.entity_id)) return [...players, new MediaPlayer(hassEntity, this.config)];
			return players;
		}, []);
	}
	determineVolumePlayer() {
		let find;
		if (this.members.length > 1 && this.config.entitiesToIgnoreVolumeLevelFor) find = this.members.find((p) => {
			return !this.config.entitiesToIgnoreVolumeLevelFor?.includes(p.id);
		});
		return find ?? this;
	}
	getVolume() {
		let volume;
		if (this.members.length > 1 && this.config.adjustVolumeRelativeToMainPlayer) volume = this.getAverageVolume();
		else volume = 100 * (this.volumePlayer.attributes.volume_level || 0);
		return Math.round(volume);
	}
	getAverageVolume() {
		const volumes = this.members.filter((m) => !this.config.entitiesToIgnoreVolumeLevelFor?.includes(m.id)).map((m) => m.attributes.volume_level || 0);
		return 100 * volumes.reduce((a, b) => a + b, 0) / volumes.length;
	}
	isOn() {
		return this.state !== "off" && this.state !== "unavailable";
	}
};
//#endregion
//#region src/model/store.ts
var Store = class {
	getJoinedPlayerIds() {
		return this.allMediaPlayers.map((p) => p.id).filter((id) => id === this.activePlayer.id || this.activePlayer.hasMember(id));
	}
	getJoinedAndNotJoinedCounts() {
		const joinedCount = this.getJoinedPlayerIds().length;
		return {
			joinedCount,
			notJoinedCount: this.allMediaPlayers.length - joinedCount
		};
	}
	constructor(hass, config, currentSection, card, activePlayerId) {
		this.hass = hass;
		this.config = config;
		const mediaPlayerHassEntities = this.getMediaPlayerHassEntities(this.hass);
		this.allGroups = this.createPlayerGroups(mediaPlayerHassEntities);
		this.allMediaPlayers = this.allGroups.reduce((previousValue, currentValue) => [...previousValue, ...currentValue.members], []);
		this.activePlayer = this.determineActivePlayer(activePlayerId);
		this.hassService = new HassService(this.hass, currentSection, card);
		this.mediaControlService = new MediaControlService(this.hassService, config);
		this.mediaBrowseService = new MediaBrowseService(this.hass, config);
		this.predefinedGroups = this.createPredefinedGroups();
	}
	createPredefinedGroups() {
		const result = [];
		if (this.config.predefinedGroups) for (const cpg of this.config.predefinedGroups) {
			const pg = this.createPredefinedGroup(cpg);
			if (pg) result.push(pg);
		}
		return result;
	}
	createPredefinedGroup(configItem) {
		let result = void 0;
		const entities = [];
		let configEntities = configItem.entities;
		if (configItem.excludeItemsInEntitiesList) configEntities = this.convertExclusionsInPredefinedGroupsToInclusions(configEntities);
		for (const item of configEntities) {
			const predefinedGroupPlayer = this.createPredefinedGroupPlayer(item);
			if (predefinedGroupPlayer) entities.push(predefinedGroupPlayer);
		}
		if (entities.length) result = {
			...configItem,
			entities
		};
		return result;
	}
	convertExclusionsInPredefinedGroupsToInclusions(configEntities) {
		return this.allMediaPlayers.filter((mp) => !configEntities.find((player) => {
			return (typeof player === "string" ? player : player.player) === mp.id;
		})).map((mp) => mp.id);
	}
	createPredefinedGroupPlayer(configItem) {
		let pgEntityId;
		let volume;
		if (typeof configItem === "string") pgEntityId = configItem;
		else {
			volume = configItem.volume;
			pgEntityId = configItem.player;
		}
		let result = void 0;
		if (this.hass.states[pgEntityId]?.state !== "unavailable") {
			const player = this.allMediaPlayers.find((p) => p.id === pgEntityId);
			if (player) result = {
				player,
				volume
			};
		} else console.warn(`Player ${pgEntityId} is unavailable`);
		return result;
	}
	getMediaPlayerHassEntities(hass) {
		const hassWithEntities = hass;
		const filtered = Object.values(hass.states).filter((hassEntity) => {
			if (hassEntity.entity_id.includes("media_player")) {
				if (this.config.allowPlayerVolumeEntityOutsideOfGroup && hassEntity.entity_id === this.config.player?.volumeEntityId) return true;
				if (isSonosCard(this.config)) return entityMatchSonos(this.config, hassEntity, hassWithEntities);
				else return entityMatchMxmp(this.config, hassEntity, hassWithEntities);
			}
			return false;
		});
		return sortEntities(this.config, filtered);
	}
	createPlayerGroups(mediaPlayerHassEntities) {
		return mediaPlayerHassEntities.filter((hassEntity) => this.isMainPlayer(hassEntity, mediaPlayerHassEntities)).map((hassEntity) => this.createPlayerGroup(hassEntity, mediaPlayerHassEntities)).filter((grp) => grp !== void 0);
	}
	isMainPlayer(hassEntity, mediaPlayerHassEntities) {
		try {
			const groupIds = getGroupPlayerIds(hassEntity).filter((playerId) => mediaPlayerHassEntities.some((value) => value.entity_id === playerId));
			const isGrouped = groupIds?.length > 1;
			const isMainInGroup = isGrouped && groupIds && groupIds[0] === hassEntity.entity_id;
			const available = this.hass.states[hassEntity.entity_id]?.state !== "unavailable";
			return (!isGrouped || isMainInGroup) && available;
		} catch (e) {
			console.error("Failed to determine main player", JSON.stringify(hassEntity), e);
			return false;
		}
	}
	createPlayerGroup(hassEntity, mediaPlayerHassEntities) {
		try {
			return new MediaPlayer(hassEntity, this.config, mediaPlayerHassEntities);
		} catch (e) {
			console.error("Failed to create group", JSON.stringify(hassEntity), e);
			return;
		}
	}
	determineActivePlayer(activePlayerId) {
		const playerId = activePlayerId || this.getActivePlayer() || this.config.entityId;
		return this.allGroups.find((group) => group.id === playerId) || this.allGroups.find((group) => group.getMember(playerId) !== void 0) || this.allGroups.find((group) => group.isPlaying()) || this.allGroups[0];
	}
	getActivePlayer() {
		if (this.config.doNotRememberSelectedPlayer) return "";
		if (this.config.storePlayerInSessionStorage) return this.getActivePlayerFromStorage();
		return this.getActivePlayerFromUrl();
	}
	getActivePlayerFromUrl() {
		return window.location.href.includes("#") ? window.location.href.replace(/.*#/g, "") : "";
	}
	getActivePlayerFromStorage() {
		return window.sessionStorage.getItem("sonos-card-player-id") || "";
	}
	hidePower(hideIfOn = false) {
		if (this.config.player?.hideControlPowerButton) return true;
		else if (!supportsTurnOn(this.activePlayer)) return true;
		else if (hideIfOn && this.activePlayer.isOn()) return true;
		else return E;
	}
};
//#endregion
//#region src/components/section-button.ts
var SectionButton = class extends i$5 {
	render() {
		const size = this.config.sectionButtonIconSize;
		const styles = size ? {
			"--icon-button-size": `${size}rem`,
			"--icon-size": `${size * .6}rem`
		} : {};
		return x`<sonos-icon-button
      @click=${() => this.dispatchSection()}
      selected=${this.selectedSection === this.section || E}
      style=${o$1(styles)}
    >
      <ha-icon .icon=${this.icon}></ha-icon>
    </sonos-icon-button>`;
	}
	dispatchSection() {
		this.dispatchEvent(customEvent(SHOW_SECTION, this.section));
	}
	static get styles() {
		return i$8`
      :host > *[selected] {
        color: var(--accent-color);
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], SectionButton.prototype, "config", void 0);
__decorate$1([n$5()], SectionButton.prototype, "icon", void 0);
__decorate$1([n$5()], SectionButton.prototype, "section", void 0);
__decorate$1([n$5()], SectionButton.prototype, "selectedSection", void 0);
customElements.define("sonos-section-button", SectionButton);
//#endregion
//#region src/components/footer.ts
var { GROUPING: GROUPING$1, GROUPS: GROUPS$1, MEDIA_BROWSER: MEDIA_BROWSER$1, PLAYER: PLAYER$1, VOLUMES: VOLUMES$1, QUEUE: QUEUE$1, SEARCH: SEARCH$1 } = Section;
var Footer = class extends i$5 {
	render() {
		const icons = this.config.sectionButtonIcons;
		let sections = [
			[PLAYER$1, icons?.player ?? "mdi:home"],
			[MEDIA_BROWSER$1, icons?.mediaBrowser ?? "mdi:star-outline"],
			[GROUPS$1, icons?.groups ?? "mdi:speaker-multiple"],
			[GROUPING$1, icons?.grouping ?? "mdi:checkbox-multiple-marked-circle-outline"],
			[QUEUE$1, icons?.queue ?? "mdi:queue-first-in-last-out"],
			[SEARCH$1, icons?.search ?? "mdi:magnify"],
			[VOLUMES$1, icons?.volumes ?? "mdi:tune"]
		];
		if (!isQueueSupported(this.config)) sections = sections.filter(([section]) => section !== QUEUE$1);
		sections = sections.filter(([section]) => !this.config.sections || this.config.sections?.includes(section));
		return x`
      ${sections.map(([section, icon]) => x`
          <sonos-section-button .config=${this.config} .icon=${icon} .selectedSection=${this.section} .section=${section}></sonos-section-button>
        `)}
    `;
	}
	static get styles() {
		return i$8`
      :host {
        display: flex;
        justify-content: space-between;
      }
      :host > * {
        align-content: center;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Footer.prototype, "config", void 0);
__decorate$1([n$5()], Footer.prototype, "section", void 0);
customElements.define("sonos-footer", Footer);
//#endregion
//#region node_modules/custom-card-helpers/dist/index.m.js
var NumberFormat;
(function(NumberFormat) {
	NumberFormat["language"] = "language";
	NumberFormat["system"] = "system";
	NumberFormat["comma_decimal"] = "comma_decimal";
	NumberFormat["decimal_comma"] = "decimal_comma";
	NumberFormat["space_comma"] = "space_comma";
	NumberFormat["none"] = "none";
})(NumberFormat || (NumberFormat = {}));
var TimeFormat;
(function(TimeFormat) {
	TimeFormat["language"] = "language";
	TimeFormat["system"] = "system";
	TimeFormat["am_pm"] = "12";
	TimeFormat["twenty_four"] = "24";
})(TimeFormat || (TimeFormat = {}));
/**
* Dispatches a custom event with an optional detail value.
*
* @param {string} type Name of event type.
* @param {*=} detail Detail value containing event-specific
*   payload.
* @param {{ bubbles: (boolean|undefined),
*           cancelable: (boolean|undefined),
*           composed: (boolean|undefined) }=}
*  options Object specifying options.  These may include:
*  `bubbles` (boolean, defaults to `true`),
*  `cancelable` (boolean, defaults to false), and
*  `node` on which to fire the event (HTMLElement, defaults to `this`).
* @return {Event} The new event that was fired.
*/
var fireEvent = (node, type, detail, options) => {
	options = options || {};
	detail = detail === null || detail === void 0 ? {} : detail;
	const event = new Event(type, {
		bubbles: options.bubbles === void 0 ? true : options.bubbles,
		cancelable: Boolean(options.cancelable),
		composed: options.composed === void 0 ? true : options.composed
	});
	event.detail = detail;
	node.dispatchEvent(event);
	return event;
};
/**
* Returns a function, that, as long as it continues to be invoked, will not be triggered. It will be called after it stops being called for `wait` ms.
* This can be usefull for ResizeObservers for example.
* @param func The function you want to debounce
* @param wait Period to wait in ms
* @param immediate Triggering on the leading edge instead of the trailing
* @returns Debounced Function
*/
var debounce = (func, wait, immediate = false) => {
	let timeout;
	return function(...args) {
		const context = this;
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
//#endregion
//#region src/editor/base-editor.ts
var BaseEditor = class extends i$5 {
	setConfig(config) {
		this.config = JSON.parse(JSON.stringify(config));
	}
	static get styles() {
		return i$8`
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
		fireEvent(this, "config-changed", { config: this.config });
		this.requestUpdate();
	}
	dispatchClose() {
		return this.dispatchEvent(new CustomEvent("closed"));
	}
};
__decorate$1([n$5({ attribute: false })], BaseEditor.prototype, "config", void 0);
__decorate$1([n$5({ attribute: false })], BaseEditor.prototype, "hass", void 0);
//#endregion
//#region src/editor/schema/groups-schema.ts
var GROUPS_SCHEMA = [
	{
		name: "title",
		type: "string"
	},
	{
		name: "backgroundColor",
		type: "string",
		help: "Background color for group buttons"
	},
	{
		name: "buttonWidth",
		type: "integer",
		help: "Width of group buttons (rem)",
		valueMin: 1
	},
	{
		name: "compact",
		selector: { boolean: {} }
	},
	{
		name: "hideCurrentTrack",
		selector: { boolean: {} }
	},
	{
		name: "itemMargin",
		type: "string",
		help: "Margin around groups list items (e.g., 5px, 0.5rem)"
	},
	{
		name: "speakersFontSize",
		type: "float",
		help: "Font size for speakers name (rem)",
		valueMin: .1
	},
	{
		name: "titleFontSize",
		type: "float",
		help: "Font size for track title (rem)",
		valueMin: .1
	}
];
//#endregion
//#region src/editor/schema/grouping-schema.ts
var GROUPING_SCHEMA = [
	{
		name: "title",
		type: "string"
	},
	{
		name: "buttonColor",
		type: "string",
		help: "Background color for grouping buttons"
	},
	{
		name: "buttonFontSize",
		type: "float",
		help: "Font size for grouping buttons (rem)",
		valueMin: .1
	},
	{
		name: "compact",
		selector: { boolean: {} }
	},
	{
		name: "disableMainSpeakers",
		selector: { boolean: {} }
	},
	{
		name: "dontSortMembersOnTop",
		selector: { boolean: {} }
	},
	{
		name: "dontSwitchPlayer",
		selector: { boolean: {} }
	},
	{
		name: "hideUngroupAllButtons",
		selector: { boolean: {} }
	},
	{
		name: "hideVolumes",
		selector: { boolean: {} }
	},
	{
		name: "skipApplyButton",
		selector: { boolean: {} }
	}
];
//#endregion
//#region src/editor/schema/volumes-schema.ts
var VOLUMES_SCHEMA = [
	{
		name: "title",
		type: "string"
	},
	{
		name: "additionalControlsFontSize",
		selector: { number: {} }
	},
	{
		name: "hideCogwheel",
		selector: { boolean: {} }
	},
	{
		name: "hideActivePlayerName",
		selector: { boolean: {} }
	},
	{
		name: "labelForAllSlider",
		type: "string"
	}
];
//#endregion
//#region src/editor/schema/queue-schema.ts
var QUEUE_SCHEMA = [
	{
		name: "title",
		type: "string"
	},
	{
		name: "hideActivePlayerName",
		selector: { boolean: {} }
	},
	{
		name: "itemBackgroundColor",
		type: "string"
	},
	{
		name: "itemTextColor",
		type: "string"
	},
	{
		name: "selectedItemBackgroundColor",
		type: "string"
	},
	{
		name: "selectedItemTextColor",
		type: "string"
	}
];
var SEARCH_SCHEMA = [
	{
		name: "title",
		type: "string",
		help: "Custom title for the search section"
	},
	{
		name: "hideActivePlayerName",
		selector: { boolean: {} },
		help: "Hide active player/group name in the search header"
	},
	{
		name: "massConfigEntryId",
		type: "string",
		help: "Leave empty to auto-discover"
	},
	{
		type: "select",
		options: Object.entries({
			none: "None",
			track: "Track",
			artist: "Artist",
			album: "Album",
			playlist: "Playlist",
			radio: "Radio"
		}).map((entry) => entry),
		name: "defaultMediaType"
	},
	{
		type: "select",
		options: Object.entries({
			list: "List",
			grid: "Grid"
		}).map((entry) => entry),
		name: "defaultViewMode",
		help: "Default view mode (default: list)"
	},
	{
		name: "gridColumns",
		type: "integer",
		help: "Number of columns in grid view (default: 4)"
	},
	{
		name: "searchLimit",
		type: "integer",
		help: "Max results per search (default: 50)"
	},
	{
		name: "autoSearchMinChars",
		type: "integer",
		help: "Min characters to trigger auto-search (default: 2)"
	},
	{
		name: "autoSearchDebounceMs",
		type: "integer",
		help: "Debounce delay in ms (default: 1000)"
	}
];
//#endregion
//#region src/editor/schema/common-schema.ts
var options = {
	player: "Player",
	"media browser": "Media Browser",
	groups: "Groups",
	grouping: "Grouping",
	volumes: "Volumes",
	queue: "Queue",
	search: "Search"
};
var COMMON_SCHEMA = [
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
		type: "string",
		name: "title"
	},
	{
		name: "adjustVolumeRelativeToMainPlayer",
		selector: { boolean: {} }
	},
	{
		name: "allowPlayerVolumeEntityOutsideOfGroup",
		selector: { boolean: {} }
	},
	{
		name: "baseFontSize",
		type: "float",
		help: "Base font size for the entire card (rem)",
		valueMin: .1
	},
	{
		name: "changeVolumeOnSlide",
		selector: { boolean: {} }
	},
	{
		name: "doNotRememberSelectedPlayer",
		selector: { boolean: {} }
	},
	{
		name: "dynamicVolumeSlider",
		selector: { boolean: {} }
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
		name: "dynamicVolumeSliderThreshold",
		type: "integer",
		default: 20,
		required: true,
		valueMin: 1,
		valueMax: 100
	},
	{
		name: "entitiesToIgnoreVolumeLevelFor",
		help: "If you want to ignore volume level for certain players in the player section",
		selector: { entity: {
			multiple: true,
			filter: { domain: "media_player" }
		} }
	},
	{
		name: "fontFamily",
		type: "string",
		help: "Font family for the entire card (e.g., Arial, Roboto)"
	},
	{
		name: "footerHeight",
		type: "integer",
		valueMin: 0
	},
	{
		name: "heightPercentage",
		type: "integer",
		default: 100,
		required: true
	},
	{
		name: "inverseGroupMuteState",
		selector: { boolean: {} }
	},
	{
		name: "listItemHeight",
		type: "float",
		help: "Height of list items in rem (e.g., media browser rows, queue rows)",
		valueMin: .1
	},
	{
		name: "mediaTitleRegexToReplace",
		type: "string"
	},
	{
		name: "mediaTitleReplacement",
		type: "string"
	},
	{
		name: "minWidth",
		type: "integer",
		help: "Minimum width of the card (rem)",
		valueMin: 1
	},
	{
		name: "sectionButtonIconSize",
		type: "float",
		help: "Size of section button icons (rem)",
		valueMin: .1
	},
	{
		name: "storePlayerInSessionStorage",
		selector: { boolean: {} }
	},
	{
		name: "volumeSliderHeight",
		type: "float",
		help: "Global height of volume sliders (rem)",
		valueMin: .1
	},
	{
		name: "volumeStepSize",
		type: "integer",
		valueMin: 1
	},
	{
		name: "widthPercentage",
		type: "integer",
		default: 100,
		required: true
	}
];
var ENTITIES_SCHEMA = [
	{
		name: "entityId",
		help: "Not needed, but forces this player to be the selected one on loading the card (overrides url param etc)",
		selector: { entity: {
			multiple: false,
			filter: { domain: "media_player" }
		} }
	},
	{
		name: "entities",
		help: "Required, unless you have specified entity platform",
		cardType: "maxi",
		selector: { entity: {
			multiple: true,
			filter: { domain: "media_player" }
		} }
	},
	{
		name: "entities",
		help: "Not needed, unless you don't want to include all of them",
		cardType: "sonos",
		selector: { entity: {
			multiple: true,
			filter: { domain: "media_player" }
		} }
	},
	{
		name: "useMusicAssistant",
		selector: { boolean: {} }
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
		selector: { text: {} }
	},
	{
		name: "entityNameRegexToReplace",
		type: "string"
	},
	{
		name: "entityNameReplacement",
		type: "string"
	},
	{
		name: "excludeItemsInEntitiesList",
		selector: { boolean: {} }
	}
];
var PREDEFINED_GROUP_SCHEMA = [
	{
		type: "string",
		name: "name",
		required: true
	},
	{
		type: "string",
		name: "media"
	},
	{
		type: "boolean",
		name: "excludeItemsInEntitiesList"
	},
	{
		name: "entities",
		selector: { entity: {
			multiple: true,
			filter: { domain: "media_player" }
		} }
	}
];
//#endregion
//#region src/editor/tabs/predefined-group-editor.ts
var PredefinedGroupEditor = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.groupChanged = (ev) => {
			const changed = ev.detail.value;
			const entities = changed.entities.map((id) => {
				return this.predefinedGroup?.entities.find(({ player }) => player === id) ?? { player: id };
			});
			this.predefinedGroup = {
				...changed,
				entities
			};
		};
		this.volumeChanged = (ev, playerId) => {
			if (!this.predefinedGroup) return;
			const volume = ev.detail.value.volume;
			const entities = this.predefinedGroup.entities.map((e) => e.player === playerId ? {
				...e,
				volume
			} : e);
			this.predefinedGroup = {
				...this.predefinedGroup,
				entities
			};
		};
		this.save = () => {
			let groups = this.config.predefinedGroups ?? [];
			if (groups[this.index]) groups[this.index] = this.predefinedGroup;
			else groups = [...groups, this.predefinedGroup];
			this.config = {
				...this.config,
				predefinedGroups: groups
			};
			this.configChanged();
			this.dispatchClose();
		};
		this.delete = () => {
			const groups = this.config.predefinedGroups?.filter((_, i) => i !== this.index);
			this.config = {
				...this.config,
				predefinedGroups: groups
			};
			this.configChanged();
			this.dispatchClose();
		};
	}
	render() {
		if (!this.predefinedGroup) this.initPredefinedGroup();
		if (!this.predefinedGroup) return x``;
		return x`
      <h3>Add/Edit Predefined Group</h3>
      <sonos-card-editor-form
        .data=${{
			...this.predefinedGroup,
			entities: this.predefinedGroup.entities.map((e) => e.player)
		}}
        .schema=${PREDEFINED_GROUP_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .changed=${this.groupChanged}
      ></sonos-card-editor-form>
      <h4>Volumes - will be set when players are grouped</h4>
      ${this.predefinedGroup.entities.map(({ player, volume }) => this.renderVolumeField(player, volume))}
      <ha-control-button-group>
        <ha-control-button @click=${this.save}>OK<ha-svg-icon .path=${mdiCheck}></ha-svg-icon></ha-control-button>
        <ha-control-button @click=${this.delete}>Delete<ha-svg-icon .path=${mdiDelete}></ha-svg-icon></ha-control-button>
      </ha-control-button-group>
    `;
	}
	initPredefinedGroup() {
		const configPg = this.config.predefinedGroups?.[this.index];
		if (configPg) {
			const entities = configPg.entities.map((e) => typeof e === "string" ? { player: e } : e);
			this.predefinedGroup = {
				...configPg,
				entities
			};
		} else this.predefinedGroup = {
			name: "",
			media: "",
			entities: []
		};
	}
	renderVolumeField(player, volume) {
		const schema = [{
			type: "integer",
			name: "volume",
			label: `${this.hass.states[player]?.attributes.friendly_name ?? player}${volume !== void 0 ? `: ${volume}` : ""}`,
			valueMin: 0,
			valueMax: 100
		}];
		return x`
      <sonos-card-editor-form
        .data=${{ volume }}
        .schema=${schema}
        .config=${this.config}
        .hass=${this.hass}
        .changed=${(ev) => this.volumeChanged(ev, player)}
      ></sonos-card-editor-form>
    `;
	}
};
__decorate$1([n$5({ type: Number })], PredefinedGroupEditor.prototype, "index", void 0);
__decorate$1([r$3()], PredefinedGroupEditor.prototype, "predefinedGroup", void 0);
customElements.define("sonos-card-predefined-group-editor", PredefinedGroupEditor);
//#endregion
//#region src/editor/tabs/common-tab.ts
var CommonTab = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.editPredefinedGroup = -1;
		this.entitiesChanged = (ev) => {
			const { useMusicAssistant, ...formData } = ev.detail.value;
			const prevUseMusicAssistant = this.config.entityPlatform === "music_assistant";
			const newUseMusicAssistant = !!useMusicAssistant;
			if (newUseMusicAssistant !== prevUseMusicAssistant) if (newUseMusicAssistant) this.config = {
				...this.config,
				entityPlatform: "music_assistant"
			};
			else this.config = {
				...this.config,
				entityPlatform: void 0
			};
			else this.config = {
				...this.config,
				...formData
			};
			this.configChanged();
		};
		this.simpleChanged = (ev) => {
			this.config = {
				...this.config,
				...ev.detail.value
			};
			this.configChanged();
		};
	}
	render() {
		if (this.editPredefinedGroup > -1) return x`
        <sonos-card-predefined-group-editor
          .index=${this.editPredefinedGroup}
          .config=${this.config}
          .hass=${this.hass}
          @closed=${() => this.editPredefinedGroup = -1}
        ></sonos-card-predefined-group-editor>
      `;
		return x`
      <h3>Entities</h3>
      ${this.renderEntitiesForm()}
      <h3>Predefined Groups</h3>
      ${this.renderPredefinedGroupsList()}
      <h3>Other</h3>
      ${this.renderForm(COMMON_SCHEMA)}
    `;
	}
	renderEntitiesForm() {
		const useMusicAssistant = this.config.entityPlatform === "music_assistant";
		const data = {
			...this.config,
			useMusicAssistant
		};
		return x`
      <sonos-card-editor-form
        .schema=${ENTITIES_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${data}
        .changed=${this.entitiesChanged}
      ></sonos-card-editor-form>
    `;
	}
	renderForm(schema) {
		return x`
      <sonos-card-editor-form
        .schema=${schema}
        .config=${this.config}
        .hass=${this.hass}
        .data=${this.config}
        .changed=${this.simpleChanged}
      ></sonos-card-editor-form>
    `;
	}
	renderPredefinedGroupsList() {
		const groups = this.config.predefinedGroups;
		return x`
      <ha-control-button-group>
        ${groups?.map((pg, index) => x`
            <ha-control-button @click=${() => this.editPredefinedGroup = index}>
              ${pg.name}<ha-svg-icon .path=${mdiPen} label="Edit"></ha-svg-icon>
            </ha-control-button>
          `)}
        <ha-control-button @click=${() => this.editPredefinedGroup = groups?.length ?? 0}>
          Add<ha-svg-icon .path=${mdiPlus} label="Add"></ha-svg-icon>
        </ha-control-button>
      </ha-control-button-group>
    `;
	}
};
__decorate$1([r$3()], CommonTab.prototype, "editPredefinedGroup", void 0);
customElements.define("sonos-card-common-tab", CommonTab);
//#endregion
//#region src/editor/schema/player-schema.ts
var PLAYER_SCHEMA = [
	{
		name: "artworkAsBackground",
		selector: { boolean: {} }
	},
	{
		name: "artworkAsBackgroundBlur",
		selector: { number: {
			min: 0,
			max: 100,
			step: 1
		} }
	},
	{
		name: "artworkBorderRadius",
		selector: { number: {
			min: 0,
			max: 100,
			step: 1
		} },
		help: "Border radius in pixels for player artwork"
	},
	{
		name: "artworkHostname",
		type: "string"
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
		name: "backgroundOverlayColor",
		type: "string",
		help: "Background overlay color when artworkAsBackground is true (e.g., rgba(0,0,0, 0.3))"
	},
	{
		name: "controlsAndHeaderBackgroundOpacity",
		selector: { number: {
			min: 0,
			max: 1,
			step: .1
		} }
	},
	{
		name: "controlsColor",
		type: "string",
		help: "Color for player control icons (e.g., pink, #ff69b4)"
	},
	{
		name: "controlsLargeIcons",
		selector: { boolean: {} }
	},
	{
		name: "controlsMargin",
		type: "string",
		help: "Margin around player controls (e.g., 0 3rem)"
	},
	{
		name: "fallbackArtwork",
		type: "string",
		help: "Override default fallback artwork image if artwork is missing for the currently selected media"
	},
	{
		name: "fastForwardAndRewindStepSizeSeconds",
		type: "integer",
		default: 15,
		valueMin: 1
	},
	{
		name: "headerEntityFontSize",
		type: "float",
		help: "Font size for entity name in player header (rem)",
		valueMin: .1
	},
	{
		name: "headerSongFontSize",
		type: "float",
		help: "Font size for song title in player header (rem)",
		valueMin: .1
	},
	{
		name: "hideArtistAlbum",
		selector: { boolean: {} }
	},
	{
		name: "hideArtwork",
		selector: { boolean: {} }
	},
	{
		name: "hideControls",
		selector: { boolean: {} }
	},
	{
		name: "hideControlNextTrackButton",
		selector: { boolean: {} }
	},
	{
		name: "hideControlPowerButton",
		selector: { boolean: {} }
	},
	{
		name: "hideControlPrevTrackButton",
		selector: { boolean: {} }
	},
	{
		name: "hideControlRepeatButton",
		selector: { boolean: {} }
	},
	{
		name: "hideControlShuffleButton",
		selector: { boolean: {} }
	},
	{
		name: "hideEntityName",
		selector: { boolean: {} }
	},
	{
		name: "hideHeader",
		selector: { boolean: {} }
	},
	{
		name: "hidePlaylist",
		selector: { boolean: {} }
	},
	{
		name: "hideVolume",
		selector: { boolean: {} }
	},
	{
		name: "hideVolumeMuteButton",
		selector: { boolean: {} }
	},
	{
		name: "hideVolumePercentage",
		selector: { boolean: {} }
	},
	{
		name: "labelWhenNoMediaIsSelected",
		type: "string"
	},
	{
		name: "showAudioInputFormat",
		selector: { boolean: {} }
	},
	{
		name: "showBrowseMediaButton",
		selector: { boolean: {} }
	},
	{
		name: "showChannel",
		selector: { boolean: {} }
	},
	{
		name: "showFastForwardAndRewindButtons",
		selector: { boolean: {} }
	},
	{
		name: "showSource",
		selector: { boolean: {} }
	},
	{
		name: "showVolumeUpAndDownButtons",
		selector: { boolean: {} }
	},
	{
		name: "stopInsteadOfPause",
		selector: { boolean: {} }
	},
	{
		name: "volumeEntityId",
		selector: { entity: {
			multiple: false,
			filter: { domain: "media_player" }
		} }
	},
	{
		name: "volumeMuteButtonSize",
		type: "float",
		help: "Size of mute button in player (rem)",
		valueMin: .1
	},
	{
		name: "volumeSliderHeight",
		type: "float",
		help: "Height of volume slider in player (rem)",
		valueMin: .1
	}
];
//#endregion
//#region src/editor/tabs/artwork-override-editor.ts
var ARTWORK_OVERRIDE_SCHEMA = [
	{
		name: "ifMissing",
		selector: { boolean: {} }
	},
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
		name: "appNameEquals",
		type: "string"
	},
	{
		name: "sourceEquals",
		type: "string"
	},
	{
		name: "appIdEquals",
		type: "string"
	},
	{
		name: "mediaTitleRegexp",
		type: "string"
	},
	{
		name: "mediaArtistRegexp",
		type: "string"
	},
	{
		name: "mediaAlbumNameRegexp",
		type: "string"
	},
	{
		name: "mediaContentIdRegexp",
		type: "string"
	},
	{
		name: "mediaChannelRegexp",
		type: "string"
	},
	{
		name: "appNameRegexp",
		type: "string"
	},
	{
		name: "sourceRegexp",
		type: "string"
	},
	{
		name: "appIdRegexp",
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
var ArtworkOverrideEditor = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.changed = (ev) => {
			const changed = ev.detail.value;
			const player = this.config.player ?? {};
			let overrides = player.mediaArtworkOverrides ?? [];
			if (overrides[this.index]) overrides[this.index] = changed;
			else overrides = [...overrides, changed];
			this.config = {
				...this.config,
				player: {
					...player,
					mediaArtworkOverrides: overrides
				}
			};
			this.configChanged();
		};
		this.delete = () => {
			const player = this.config.player ?? {};
			const overrides = player.mediaArtworkOverrides?.filter((_, i) => i !== this.index);
			this.config = {
				...this.config,
				player: {
					...player,
					mediaArtworkOverrides: overrides
				}
			};
			this.configChanged();
			this.dispatchClose();
		};
	}
	render() {
		const playerConfig = this.config.player ?? {};
		const override = playerConfig.mediaArtworkOverrides?.[this.index] ?? { ifMissing: false };
		const isExisting = !!playerConfig.mediaArtworkOverrides?.[this.index];
		return x`
      <h3>Add/Edit Artwork Override</h3>
      <sonos-card-editor-form
        .data=${override}
        .schema=${ARTWORK_OVERRIDE_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .changed=${this.changed}
      ></sonos-card-editor-form>
      <ha-control-button-group>
        <ha-control-button @click=${this.dispatchClose}>OK<ha-svg-icon .path=${mdiCheck}></ha-svg-icon></ha-control-button>
        ${isExisting ? x`<ha-control-button @click=${this.delete}>Delete<ha-svg-icon .path=${mdiDelete}></ha-svg-icon></ha-control-button>` : E}
      </ha-control-button-group>
    `;
	}
};
__decorate$1([n$5({ type: Number })], ArtworkOverrideEditor.prototype, "index", void 0);
customElements.define("sonos-card-artwork-override-editor", ArtworkOverrideEditor);
//#endregion
//#region src/editor/tabs/player-tab.ts
var PlayerTab = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.editArtworkOverride = -1;
		this.sectionChanged = (ev) => {
			const changed = ev.detail.value;
			this.config = {
				...this.config,
				player: {
					...this.config.player ?? {},
					...changed
				}
			};
			this.configChanged();
		};
	}
	render() {
		if (this.editArtworkOverride > -1) return x`
        <sonos-card-artwork-override-editor
          .index=${this.editArtworkOverride}
          .config=${this.config}
          .hass=${this.hass}
          @closed=${() => this.editArtworkOverride = -1}
        ></sonos-card-artwork-override-editor>
      `;
		return x`
      <sonos-card-editor-form
        .schema=${PLAYER_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .section=${"player"}
        .changed=${this.sectionChanged}
      ></sonos-card-editor-form>
      <h3>Artwork Overrides</h3>
      ${this.renderArtworkOverridesList()}
    `;
	}
	renderArtworkOverridesList() {
		const items = this.config.player?.mediaArtworkOverrides;
		return x`
      <ha-control-button-group>
        ${items?.map((item, index) => x`
            <ha-control-button @click=${() => this.editArtworkOverride = index}>
              ${this.getOverrideName(item, index)}<ha-svg-icon .path=${mdiPen} label="Edit"></ha-svg-icon>
            </ha-control-button>
          `)}
        <ha-control-button @click=${() => this.editArtworkOverride = items?.length ?? 0}>
          Add<ha-svg-icon .path=${mdiPlus} label="Add"></ha-svg-icon>
        </ha-control-button>
      </ha-control-button-group>
    `;
	}
	getOverrideName(item, index) {
		return item.mediaTitleEquals || item.mediaArtistEquals || item.mediaAlbumNameEquals || item.mediaContentIdEquals || item.mediaChannelEquals || item.appNameEquals || item.sourceEquals || item.appIdEquals || item.ifMissing && "if missing" || index;
	}
};
__decorate$1([r$3()], PlayerTab.prototype, "editArtworkOverride", void 0);
customElements.define("sonos-card-player-tab", PlayerTab);
//#endregion
//#region src/editor/schema/media-browser-schema.ts
var MEDIA_BROWSER_SCHEMA = [
	{
		name: "hideHeader",
		selector: { boolean: {} }
	},
	{
		name: "hideActivePlayerName",
		selector: { boolean: {} }
	},
	{
		name: "itemsPerRow",
		type: "integer",
		valueMin: 1
	},
	{
		name: "onlyFavorites",
		selector: { boolean: {} }
	}
];
var SHORTCUT_SUB_SCHEMA = [
	{
		name: "media_content_id",
		type: "string",
		help: "The content ID of the folder (use browser DevTools to find this)"
	},
	{
		name: "media_content_type",
		type: "string",
		help: "The content type (e.g., spotify://library)"
	},
	{
		name: "icon",
		type: "string",
		help: "Icon for the button (e.g., mdi:spotify). Default is bookmark icon."
	},
	{
		name: "name",
		type: "string",
		help: "Tooltip/name for the shortcut button"
	}
];
var FAVORITES_SUB_SCHEMA = [
	{
		name: "title",
		type: "string"
	},
	{
		name: "exclude",
		type: "string"
	},
	{
		name: "hideTitleForThumbnailIcons",
		selector: { boolean: {} }
	},
	{
		name: "iconBorder",
		type: "string",
		help: "Border for favorites icons (e.g., 1px solid white)"
	},
	{
		name: "iconMarginPercentage",
		type: "integer",
		help: "Margin around favorites icon artwork in percentage (e.g., 10 for 10%)"
	},
	{
		name: "iconPadding",
		type: "float",
		help: "Padding around favorites icon artwork (rem)",
		valueMin: 0
	},
	{
		name: "iconTitleBackgroundColor",
		type: "string",
		help: "Background color for favorites icon titles"
	},
	{
		name: "iconTitleColor",
		type: "string",
		help: "Color for favorites icon titles (e.g., red, #ff0000)"
	},
	{
		name: "numberToShow",
		type: "integer",
		valueMin: 1
	},
	{
		name: "sortByType",
		selector: { boolean: {} }
	},
	{
		name: "typeColor",
		type: "string",
		help: "Color for type headers when sortByType is enabled"
	},
	{
		name: "typeFontSize",
		type: "string",
		help: "Font size for type headers (e.g., 18px)"
	},
	{
		name: "typeFontWeight",
		type: "string",
		help: "Font weight for type headers (e.g., normal, bold)"
	},
	{
		name: "typeMarginBottom",
		type: "string",
		help: "Bottom margin for type headers (e.g., 6px)"
	},
	{
		name: "topItems",
		type: "string"
	}
];
//#endregion
//#region src/editor/tabs/media-browser-tab.ts
var MediaBrowserTab = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.mediaBrowserChanged = (ev) => {
			const changed = ev.detail.value;
			this.config = {
				...this.config,
				mediaBrowser: {
					...this.config.mediaBrowser ?? {},
					...changed
				}
			};
			this.configChanged();
		};
		this.shortcutChanged = (ev) => {
			const changed = ev.detail.value;
			const mediaBrowser = this.config.mediaBrowser ?? {};
			const shortcut = Object.fromEntries(Object.entries({
				...mediaBrowser.shortcut ?? {},
				...changed
			}).filter(([, v]) => v !== "" && v !== void 0));
			this.config = {
				...this.config,
				mediaBrowser: {
					...mediaBrowser,
					shortcut: Object.keys(shortcut).length > 0 ? shortcut : void 0
				}
			};
			this.configChanged();
		};
		this.favoritesChanged = (ev) => {
			const changed = ev.detail.value;
			const mediaBrowser = this.config.mediaBrowser ?? {};
			this.config = {
				...this.config,
				mediaBrowser: {
					...mediaBrowser,
					favorites: {
						...mediaBrowser.favorites ?? {},
						...changed,
						exclude: changed.exclude?.split(/ *, */).filter(Boolean) ?? [],
						topItems: changed.topItems?.split(/ *, */).filter(Boolean) ?? []
					}
				}
			};
			this.configChanged();
		};
	}
	render() {
		const mediaBrowserConfig = this.config.mediaBrowser ?? {};
		const favoritesConfig = mediaBrowserConfig.favorites ?? {};
		const shortcutConfig = mediaBrowserConfig.shortcut ?? {};
		const exclude = favoritesConfig.exclude ?? [];
		const topItems = favoritesConfig.topItems ?? [];
		const mediaBrowserData = { ...mediaBrowserConfig };
		const favoritesData = {
			...favoritesConfig,
			exclude: exclude.join(", "),
			topItems: topItems.join(", ")
		};
		const shortcutData = { ...shortcutConfig };
		return x`
      <sonos-card-editor-form
        .schema=${MEDIA_BROWSER_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${mediaBrowserData}
        .changed=${this.mediaBrowserChanged}
      ></sonos-card-editor-form>

      <h3>Shortcut</h3>
      <sonos-card-editor-form
        .schema=${SHORTCUT_SUB_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${shortcutData}
        .changed=${this.shortcutChanged}
      ></sonos-card-editor-form>

      <h3>Favorites</h3>
      <sonos-card-editor-form
        .schema=${FAVORITES_SUB_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${favoritesData}
        .changed=${this.favoritesChanged}
      ></sonos-card-editor-form>

      <div class="yaml-note">
        The following needs to be configured using code (YAML):
        <ul>
          <li>customFavorites</li>
          <li>customThumbnails</li>
          <li>customThumbnailsIfMissing</li>
        </ul>
      </div>
    `;
	}
	static get styles() {
		return i$8`
      h3 {
        margin: 20px 0 10px;
        font-size: 1.1em;
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 5px;
      }
      h3:first-child {
        margin-top: 0;
      }
      .yaml-note {
        margin-top: 20px;
      }
    `;
	}
};
customElements.define("sonos-card-media-browser-tab", MediaBrowserTab);
//#endregion
//#region src/editor/tabs/section-tab.ts
var SectionTab = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.sectionChanged = (ev) => {
			const changed = ev.detail.value;
			this.config = {
				...this.config,
				[this.section]: {
					...this.config[this.section] ?? {},
					...changed
				}
			};
			this.configChanged();
		};
	}
	render() {
		return x`
      <sonos-card-editor-form
        .schema=${this.schema}
        .config=${this.config}
        .hass=${this.hass}
        .section=${this.section}
        .changed=${this.sectionChanged}
      ></sonos-card-editor-form>
    `;
	}
};
__decorate$1([n$5({ attribute: false })], SectionTab.prototype, "schema", void 0);
__decorate$1([n$5()], SectionTab.prototype, "section", void 0);
customElements.define("sonos-card-section-tab", SectionTab);
//#endregion
//#region src/editor/form.ts
var Form = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.handleValueChanged = (ev) => {
			const changed = ev.detail.value;
			if (this.section) this.config = {
				...this.config,
				[this.section]: {
					...this.config[this.section] ?? {},
					...changed
				}
			};
			else this.config = {
				...this.config,
				...changed
			};
			this.configChanged();
		};
	}
	render() {
		const schema = filterEditorSchemaOnCardType(this.schema, this.config.type);
		return x`
      <ha-form
        .data=${this.section ? this.config[this.section] ?? {} : this.data || this.config}
        .schema=${schema}
        .computeLabel=${createComputeLabel()}
        .hass=${this.hass}
        @value-changed=${this.changed || this.handleValueChanged}
      ></ha-form>
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Form.prototype, "schema", void 0);
__decorate$1([n$5({ attribute: false })], Form.prototype, "data", void 0);
__decorate$1([n$5()], Form.prototype, "changed", void 0);
__decorate$1([n$5()], Form.prototype, "section", void 0);
function createComputeLabel() {
	return ({ help, label, name }) => {
		if (label) return label;
		const unCamelCased = name.replace(/([A-Z])/g, " $1");
		return unCamelCased.charAt(0).toUpperCase() + unCamelCased.slice(1) + (help ? ` (${help})` : "");
	};
}
function filterEditorSchemaOnCardType(schema, cardType) {
	return schema.filter((schema) => schema.cardType === void 0 || cardType.indexOf(schema.cardType) > -1);
}
customElements.define("sonos-card-editor-form", Form);
//#endregion
//#region src/editor/editor.ts
var Tab = /* @__PURE__ */ function(Tab) {
	Tab["COMMON"] = "Common";
	Tab["PLAYER"] = "Player";
	Tab["MEDIA_BROWSER"] = "Media Browser";
	Tab["GROUPS"] = "Groups";
	Tab["GROUPING"] = "Grouping";
	Tab["VOLUMES"] = "Volumes";
	Tab["QUEUE"] = "Queue";
	Tab["SEARCH"] = "Search";
	return Tab;
}(Tab || {});
var CardEditor = class extends BaseEditor {
	constructor(..._args) {
		super(..._args);
		this.activeTab = Tab.COMMON;
		this.navigatePrev = () => {
			const idx = this.activeTabIndex;
			if (idx > 0) {
				this.activeTab = this.tabs[idx - 1];
				this.scrollToActiveTab();
			}
		};
		this.navigateNext = () => {
			const idx = this.activeTabIndex;
			if (idx < this.tabs.length - 1) {
				this.activeTab = this.tabs[idx + 1];
				this.scrollToActiveTab();
			}
		};
	}
	get tabs() {
		return Object.values(Tab).filter((tab) => tab !== Tab.QUEUE || isQueueSupported(this.config));
	}
	get activeTabIndex() {
		return this.tabs.indexOf(this.activeTab);
	}
	scrollToActiveTab() {
		requestAnimationFrame(() => {
			const container = this.shadowRoot?.querySelector(".tabs-list");
			const activeButton = this.shadowRoot?.querySelector(".tab-button.active");
			if (container && activeButton) activeButton.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center"
			});
		});
	}
	render() {
		if (!this.config) return x``;
		const tabs = this.tabs;
		const activeIndex = this.activeTabIndex;
		const showLeftArrow = activeIndex > 0;
		const showRightArrow = activeIndex < tabs.length - 1;
		return x`
      <div class="tabs-container">
        <sonos-icon-button class="nav-arrow ${showLeftArrow ? "" : "hidden"}" .path=${mdiChevronLeft} @click=${this.navigatePrev}></sonos-icon-button>
        <div class="tabs-list">
          ${tabs.map((tab) => x` <button class="tab-button ${this.activeTab === tab ? "active" : ""}" @click=${() => this.activeTab = tab}>${tab}</button> `)}
        </div>
        <sonos-icon-button class="nav-arrow ${showRightArrow ? "" : "hidden"}" .path=${mdiChevronRight} @click=${this.navigateNext}></sonos-icon-button>
      </div>
      ${this.renderTabContent()}
    `;
	}
	renderTabContent() {
		const c = this.config, h = this.hass;
		const t = (s, sec) => x`<sonos-card-section-tab .schema=${s} .section=${sec} .config=${c} .hass=${h}></sonos-card-section-tab>`;
		return r(this.activeTab, [
			[Tab.COMMON, () => x`<sonos-card-common-tab .config=${c} .hass=${h}></sonos-card-common-tab>`],
			[Tab.PLAYER, () => x`<sonos-card-player-tab .config=${c} .hass=${h}></sonos-card-player-tab>`],
			[Tab.MEDIA_BROWSER, () => x`<sonos-card-media-browser-tab .config=${c} .hass=${h}></sonos-card-media-browser-tab>`],
			[Tab.GROUPS, () => t(GROUPS_SCHEMA, "groups")],
			[Tab.GROUPING, () => t(GROUPING_SCHEMA, "grouping")],
			[Tab.VOLUMES, () => t(VOLUMES_SCHEMA, "volumes")],
			[Tab.QUEUE, () => t(QUEUE_SCHEMA, "queue")],
			[Tab.SEARCH, () => t(SEARCH_SCHEMA, "search")]
		]);
	}
	static get styles() {
		return i$8`
      :host {
        display: block;
      }
      .tabs-container {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 0 10px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }
      .tabs-list {
        display: flex;
        gap: 4px;
        overflow-x: auto;
        flex: 1;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .tabs-list::-webkit-scrollbar {
        display: none;
      }
      .tab-button {
        height: 32px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        position: relative;
        padding: 0 8px;
        white-space: nowrap;
      }
      .tab-button:hover {
        background: var(--secondary-background-color);
      }
      .tab-button.active {
        color: var(--primary-color);
      }
      .tab-button.active::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
      }
      .nav-arrow {
        --icon-button-size: 32px;
        --icon-size: 20px;
        color: var(--primary-color);
        flex-shrink: 0;
      }
      .nav-arrow.hidden {
        visibility: hidden;
      }
    `;
	}
};
__decorate$1([r$3()], CardEditor.prototype, "activeTab", void 0);
customElements.define("sonos-card-editor", CardEditor);
//#endregion
//#region src/components/shuffle.ts
var Shuffle = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.shuffle = async () => await this.mediaControlService.shuffle(this.activePlayer);
	}
	render() {
		this.activePlayer = this.store.activePlayer;
		this.mediaControlService = this.store.mediaControlService;
		return x`<sonos-icon-button @click=${this.shuffle} .path=${this.shuffleIcon()}></sonos-icon-button> `;
	}
	shuffleIcon() {
		return this.activePlayer?.attributes.shuffle ? mdiShuffle : mdiShuffleDisabled;
	}
};
__decorate$1([n$5({ attribute: false })], Shuffle.prototype, "store", void 0);
customElements.define("sonos-shuffle", Shuffle);
//#endregion
//#region src/components/repeat.ts
var Repeat = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.repeat = async () => await this.mediaControlService.repeat(this.activePlayer);
	}
	render() {
		this.activePlayer = this.store.activePlayer;
		this.mediaControlService = this.store.mediaControlService;
		return x`<sonos-icon-button @click=${this.repeat} .path=${this.repeatIcon()}></sonos-icon-button> `;
	}
	repeatIcon() {
		const repeatState = this.activePlayer?.attributes.repeat;
		return repeatState === "all" ? mdiRepeat : repeatState === "one" ? mdiRepeatOnce : mdiRepeatOff;
	}
};
__decorate$1([n$5({ attribute: false })], Repeat.prototype, "store", void 0);
customElements.define("sonos-repeat", Repeat);
//#endregion
//#region src/components/source.ts
var Source = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.setSource = async (event) => {
			const source = event.detail.value;
			if (!source || source === this.activePlayer.attributes.source) return;
			const previousSource = this.selectedSource;
			this.selectedSource = source;
			try {
				await this.mediaControlService.setSource(this.activePlayer, source);
			} catch (error) {
				this.selectedSource = previousSource;
				throw error;
			}
		};
	}
	render() {
		this.activePlayer = this.player ?? this.store.activePlayer;
		this.mediaControlService = this.store.mediaControlService;
		if (this.selectedSourcePlayerId !== this.activePlayer.id) {
			this.selectedSource = void 0;
			this.selectedSourcePlayerId = this.activePlayer.id;
		}
		const sourceLabel = this.store.hass.localize("ui.card.media_player.source") || "Source";
		return x`
      <div>
        <span>${sourceLabel}</span>
        <ha-select .label=${sourceLabel} .value=${this.selectedSource ?? this.activePlayer.attributes.source ?? ""} .options=${this.activePlayer.attributes.source_list?.map((source) => ({
			value: source,
			label: source
		})) ?? []} @selected=${this.setSource} naturalMenuWidth></ha-select>
      </div>
    `;
	}
	static get styles() {
		return i$8`
      div {
        display: flex;
        color: var(--primary-text-color);
        justify-content: center;
        gap: 10px;
      }
      span {
        align-content: center;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Source.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], Source.prototype, "player", void 0);
__decorate$1([r$3()], Source.prototype, "selectedSource", void 0);
__decorate$1([r$3()], Source.prototype, "selectedSourcePlayerId", void 0);
customElements.define("sonos-source", Source);
//#endregion
//#region src/card.ts
var { GROUPING, GROUPS, MEDIA_BROWSER, PLAYER, VOLUMES, QUEUE, SEARCH } = Section;
var TITLE_HEIGHT = 2;
var FOOTER_HEIGHT = 5;
var Card = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.configError = null;
		this.hashChangeListener = () => {
			this.activePlayerId = void 0;
			this.createStore();
		};
		this.showSectionListener = (event) => {
			const section = event.detail;
			if (!this.config.sections || this.config.sections.indexOf(section) > -1) this.section = section;
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
			if (this.showLoader) if (duration < 1e3) setTimeout(() => this.showLoader = false, 1e3 - duration);
			else this.showLoader = false;
		};
		this.activePlayerListener = (event) => {
			const newEntityId = event.detail.entityId;
			if (newEntityId !== this.activePlayerId) {
				this.activePlayerId = newEntityId;
				if (this.config.sections?.includes(PLAYER)) this.section = PLAYER;
				this.requestUpdate();
			}
		};
		this.onMediaItemSelected = () => {
			if (this.config.sections?.includes(PLAYER)) setTimeout(() => this.section = PLAYER, 1e3);
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
		return x`
      <ha-card style=${this.haCardStyle(height)}>
        <div class="loader" ?hidden=${!this.showLoader}>
          <ha-circular-progress indeterminate></ha-circular-progress></div
        >
        </div>
        ${title ? x`<div class="title">${title}</div>` : x``}
        ${this.configError ? x`<div class="no-players">${this.configError}</div>` : x``}
        <div class="content" style=${this.contentStyle(contentHeight)}>
          ${this.activePlayerId ? r(this.section, [
			[PLAYER, () => x` <sonos-player .store=${this.store}></sonos-player>`],
			[GROUPS, () => x` <sonos-groups .store=${this.store} @active-player=${this.activePlayerListener}></sonos-groups>`],
			[GROUPING, () => x`<sonos-grouping .store=${this.store} @active-player=${this.activePlayerListener}></sonos-grouping>`],
			[VOLUMES, () => x` <sonos-volumes .store=${this.store}></sonos-volumes>`],
			[MEDIA_BROWSER, () => x`<sonos-media-browser .store=${this.store} @item-selected=${this.onMediaItemSelected}></sonos-media-browser>`],
			[QUEUE, () => x`<sonos-queue .store=${this.store} @item-selected=${this.onMediaItemSelected}></sonos-queue>`],
			[SEARCH, () => x`<sonos-search .store=${this.store} @item-selected=${this.onMediaItemSelected}></sonos-search>`]
		]) : x`<div class="no-players">${noPlayersText}</div>`}
        </div>
        ${n(showFooter, () => x`<sonos-footer
              style=${this.footerStyle(footerHeight)}
              .config=${this.config}
              .section=${this.section}
              @show-section=${this.showSectionListener}
            >
            </sonos-footer>`)}
      </ha-card>
    `;
	}
	createStore() {
		if (this.activePlayerId) this.store = new Store(this.hass, this.config, this.section, this, this.activePlayerId);
		else {
			this.store = new Store(this.hass, this.config, this.section, this);
			this.activePlayerId = this.store.activePlayer?.id;
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
		if (cardDoesNotContainAllSections(this.config)) window.addEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
		window.addEventListener(CALL_MEDIA_STARTED, this.callMediaStartedListener);
		window.addEventListener(CALL_MEDIA_DONE, this.callMediaDoneListener);
		if (!this.config.storePlayerInSessionStorage && !this.config.doNotRememberSelectedPlayer) window.addEventListener("hashchange", this.hashChangeListener);
	}
	disconnectedCallback() {
		window.removeEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
		window.removeEventListener(CALL_MEDIA_STARTED, this.callMediaStartedListener);
		window.removeEventListener(CALL_MEDIA_DONE, this.callMediaDoneListener);
		window.removeEventListener("hashchange", this.hashChangeListener);
		super.disconnectedCallback();
	}
	haCardStyle(height) {
		const width = getWidth(this.config);
		const minWidth = this.config.minWidth ?? 20;
		return o$1({
			color: "var(--secondary-text-color)",
			height: `${height}rem`,
			minWidth: `${minWidth}rem`,
			maxWidth: `${width}rem`,
			overflow: "hidden",
			...this.config.style?.borderRadius ? { borderRadius: this.config.style.borderRadius } : {},
			...this.config.baseFontSize ? {
				fontSize: `${this.config.baseFontSize}rem`,
				"--sonos-font-size": `${this.config.baseFontSize}rem`,
				"--ha-font-size-s": "0.75em",
				"--ha-font-size-m": "0.875em",
				"--ha-font-size-l": "1em",
				"--ha-font-size-xl": "1.125em",
				"--ha-font-size-2xl": "1.25em",
				"--ha-font-size-4xl": "1.5em"
			} : {},
			...this.config.fontFamily ? {
				fontFamily: this.config.fontFamily,
				"--mdc-typography-font-family": this.config.fontFamily,
				"--ha-font-family-body": this.config.fontFamily
			} : {}
		});
	}
	footerStyle(height) {
		return o$1({
			height: `${height}rem`,
			padding: "0 1rem"
		});
	}
	contentStyle(height) {
		return o$1({
			overflowY: "auto",
			height: `${height}rem`
		});
	}
	setConfig(config) {
		const newConfig = JSON.parse(JSON.stringify(config));
		for (const [key, value] of Object.entries(newConfig)) if (Array.isArray(value) && value.length === 0) delete newConfig[key];
		const showQueue = isQueueSupported(newConfig);
		const sections = newConfig.sections || Object.values(Section).filter((section) => showQueue || section !== QUEUE);
		if (newConfig.startSection && sections.includes(newConfig.startSection)) this.section = newConfig.startSection;
		else if (sections) this.section = sections.includes(PLAYER) ? PLAYER : sections.includes(MEDIA_BROWSER) ? MEDIA_BROWSER : sections.includes(GROUPS) ? GROUPS : sections.includes(GROUPING) ? GROUPING : sections.includes(SEARCH) ? SEARCH : sections.includes(QUEUE) && showQueue ? QUEUE : VOLUMES;
		else this.section = PLAYER;
		newConfig.mediaBrowser = newConfig.mediaBrowser ?? {};
		newConfig.mediaBrowser.favorites = newConfig.mediaBrowser.favorites ?? {};
		newConfig.mediaBrowser.itemsPerRow = newConfig.mediaBrowser.itemsPerRow || 4;
		if (newConfig.entities?.length && newConfig.entities[0].entity) newConfig.entities = newConfig.entities.map((entity) => entity.entity);
		if (isSonosCard(newConfig) && newConfig.entityPlatform === void 0) {
			newConfig.entityPlatform = "sonos";
			if (newConfig.showNonSonosPlayers) newConfig.entityPlatform = void 0;
		}
		this.configError = this.getConfigError(newConfig);
		this.config = newConfig;
	}
	getConfigError(config) {
		if ([
			config.entityPlatform === "music_assistant",
			!!config.showNonSonosPlayers,
			!!config.entityPlatform && config.entityPlatform !== "music_assistant" && config.entityPlatform !== "sonos"
		].filter(Boolean).length > 1) return "Conflicting configuration: only one of useMusicAssistant, showNonSonosPlayers, or entityPlatform can be set at a time. Please fix your configuration.";
		return null;
	}
	static get styles() {
		return i$8`
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
        font-size: calc(var(--sonos-font-size, 1rem) * 1.2);
        color: var(--secondary-text-color);
      }
      .no-players {
        text-align: center;
        margin-top: 50%;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Card.prototype, "hass", void 0);
__decorate$1([n$5({ attribute: false })], Card.prototype, "config", void 0);
__decorate$1([r$3()], Card.prototype, "section", void 0);
__decorate$1([r$3()], Card.prototype, "store", void 0);
__decorate$1([r$3()], Card.prototype, "showLoader", void 0);
__decorate$1([r$3()], Card.prototype, "loaderTimestamp", void 0);
__decorate$1([r$3()], Card.prototype, "cancelLoader", void 0);
__decorate$1([r$3()], Card.prototype, "activePlayerId", void 0);
__decorate$1([r$3()], Card.prototype, "configError", void 0);
//#endregion
//#region src/model/grouping-item.ts
var GroupingItem = class {
	constructor(player, activePlayer, isModified) {
		this.isDisabled = false;
		this.isMain = player.id === activePlayer.id;
		this.isModified = isModified;
		this.currentlyJoined = this.isMain || activePlayer.hasMember(player.id);
		this.isSelected = isModified ? !this.currentlyJoined : this.currentlyJoined;
		this.player = player;
		this.name = player.name;
		this.icon = this.isSelected ? "check-circle" : "checkbox-blank-circle-outline";
	}
};
//#endregion
//#region src/sections/grouping/grouping-section.styles.ts
var groupingSectionStyles = [listStyle, i$8`
    :host {
      --mdc-icon-size: 24px;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
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
    [hidden] {
      display: none !important;
    }
    .applying {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      z-index: 10;
      pointer-events: none;
    }
  `];
//#endregion
//#region src/sections/grouping/grouping-utils.ts
var SYNC_POLL_INTERVAL = 500;
var SYNC_TIMEOUT = 3e4;
function buildGroupingItems(store, modifiedItems) {
	const items = store.allMediaPlayers.map((player) => new GroupingItem(player, store.activePlayer, modifiedItems.includes(player.id)));
	const selected = items.filter((item) => item.isSelected);
	if (selected.length === 1) selected[0].isDisabled = true;
	if (store.config.grouping?.disableMainSpeakers) {
		const mainIds = store.allGroups.filter((p) => p.members.length > 1).map((p) => p.id);
		items.forEach((item) => {
			if (mainIds.includes(item.player.id)) item.isDisabled = true;
		});
	}
	if (!store.config.grouping?.dontSortMembersOnTop) items.sort((a, b) => {
		if (a.isMain) return -1;
		if (b.isMain) return 1;
		if (a.currentlyJoined !== b.currentlyJoined) return a.currentlyJoined ? -1 : 1;
		return 0;
	});
	return items;
}
function waitForGroupSync(getStore, mainPlayerId, expectedIds) {
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			clearInterval(poll);
			resolve();
		}, SYNC_TIMEOUT);
		const poll = setInterval(() => {
			const mainEntity = getStore().hass.states[mainPlayerId];
			if (mainEntity) {
				const actualIds = getGroupPlayerIds(mainEntity).sort();
				if (actualIds.length === expectedIds.length && actualIds.every((id, i) => id === expectedIds[i])) {
					clearInterval(poll);
					clearTimeout(timeout);
					resolve();
				}
			}
		}, SYNC_POLL_INTERVAL);
	});
}
//#endregion
//#region src/sections/grouping/grouping-button.ts
var GroupingButton = class extends i$5 {
	render() {
		const iconAndName = !!this.icon && !!this.name || E;
		const buttonStyle = o$1({
			...this.buttonColor ? { "--control-button-background-color": this.buttonColor } : {},
			...this.fontSize ? { fontSize: `${this.fontSize}rem` } : {}
		});
		return x`
      <ha-control-button selected=${this.selected || E} style=${buttonStyle}>
        <div>
          ${this.icon ? x` <ha-icon icon-and-name=${iconAndName} .icon=${this.icon}></ha-icon>` : ""} ${this.name ? x`<span>${this.name}</span>` : ""}
        </div>
      </ha-control-button>
    `;
	}
	static get styles() {
		return i$8`
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
};
__decorate$1([n$5()], GroupingButton.prototype, "icon", void 0);
__decorate$1([n$5()], GroupingButton.prototype, "name", void 0);
__decorate$1([n$5()], GroupingButton.prototype, "selected", void 0);
__decorate$1([n$5()], GroupingButton.prototype, "buttonColor", void 0);
__decorate$1([n$5()], GroupingButton.prototype, "fontSize", void 0);
customElements.define("sonos-grouping-button", GroupingButton);
//#endregion
//#region src/sections/grouping/grouping-actions.ts
var GroupingActions = class extends i$5 {
	render() {
		const { store, selectedPredefinedGroup } = this;
		const { joinedCount, notJoinedCount } = store.getJoinedAndNotJoinedCounts();
		const joinAllIcon = store.config.grouping?.buttonIcons?.joinAll ?? "mdi:checkbox-multiple-marked-outline";
		const unJoinAllIcon = store.config.grouping?.buttonIcons?.unJoinAll ?? "mdi:minus-box-multiple-outline";
		const pgIcon = store.config.grouping?.buttonIcons?.predefinedGroup ?? "mdi:speaker-multiple";
		const fontSize = store.config.grouping?.buttonFontSize;
		const isCompact = store.config.grouping?.compact || E;
		const hideUngroupButtons = !!store.config.grouping?.hideUngroupAllButtons;
		return x`
      <div class="predefined-groups" compact=${isCompact}>
        <sonos-grouping-button
          ?hidden=${hideUngroupButtons || !notJoinedCount}
          @click=${() => this.dispatch({ type: "select-all" })}
          .icon=${joinAllIcon}
          .buttonColor=${store.config.grouping?.buttonColor}
          .fontSize=${fontSize}
        ></sonos-grouping-button>
        <sonos-grouping-button
          ?hidden=${hideUngroupButtons || !joinedCount}
          @click=${() => this.dispatch({ type: "deselect-all" })}
          .icon=${unJoinAllIcon}
          .buttonColor=${store.config.grouping?.buttonColor}
          .fontSize=${fontSize}
        ></sonos-grouping-button>
        ${store.predefinedGroups.map((pg) => {
			const isSelected = selectedPredefinedGroup?.name === pg.name;
			return x` <sonos-grouping-button
            @click=${() => this.dispatch({
				type: "select-predefined-group",
				predefinedGroup: pg
			})}
            .icon=${pgIcon}
            .name=${pg.name}
            .selected=${isSelected}
            .buttonColor=${store.config.grouping?.buttonColor}
            .fontSize=${fontSize}
          ></sonos-grouping-button>`;
		})}
      </div>
    `;
	}
	dispatch(detail) {
		this.dispatchEvent(new CustomEvent("grouping-action", {
			detail,
			bubbles: true,
			composed: true
		}));
	}
	static get styles() {
		return i$8`
      .predefined-groups {
        margin: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        flex-shrink: 0;
      }
      .predefined-groups[compact] {
        margin: 0.3rem !important;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], GroupingActions.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], GroupingActions.prototype, "selectedPredefinedGroup", void 0);
customElements.define("sonos-grouping-actions", GroupingActions);
//#endregion
//#region src/sections/grouping/grouping-item-row.ts
var GroupingItemRow = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.applying = false;
	}
	render() {
		const { item, applying, store } = this;
		return x`
      <div class="item" modified=${item.isModified || E} disabled=${item.isDisabled || applying || E} compact=${store.config.grouping?.compact || E}>
        <ha-icon class="icon" selected=${item.isSelected || E} .icon="mdi:${item.icon}" @click=${this.handleToggle}></ha-icon>
        <div class="name-and-volume">
          <span class="name">${item.name}</span>
          <sonos-volume
            class="volume"
            ?hidden=${!!store.config.grouping?.hideVolumes}
            .store=${store}
            .player=${item.player}
            .updateMembers=${false}
            .slim=${true}
          ></sonos-volume>
        </div>
      </div>
    `;
	}
	handleToggle() {
		this.dispatchEvent(new CustomEvent("toggle-item", {
			detail: this.item,
			bubbles: true,
			composed: true
		}));
	}
	static get styles() {
		return i$8`
      .item {
        color: var(--secondary-text-color);
        padding: 0.5rem;
        display: flex;
        align-items: center;
      }
      .item[compact] {
        padding-top: 0;
        padding-bottom: 0;
        border-bottom: 1px solid #333;
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
      .name-and-volume {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .volume {
        --accent-color: var(--secondary-text-color);
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], GroupingItemRow.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], GroupingItemRow.prototype, "item", void 0);
__decorate$1([n$5({ type: Boolean })], GroupingItemRow.prototype, "applying", void 0);
customElements.define("sonos-grouping-item-row", GroupingItemRow);
//#endregion
//#region src/sections/grouping/grouping-section.ts
var POST_SYNC_DELAY = 1e3;
var Grouping = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.modifiedItems = [];
		this.applying = false;
	}
	render() {
		if (!this.applying) this.refreshFromStore();
		const items = this.frozenGroupingItems ?? this.groupingItems;
		const { applying, selectedPredefinedGroup, modifiedItems, store } = this;
		const hasChanges = modifiedItems.length > 0 || !!selectedPredefinedGroup;
		const hideButtons = applying || !hasChanges || !!store.config.grouping?.skipApplyButton;
		return x`
      <div class="wrapper">
        <sonos-grouping-actions
          .store=${store}
          .selectedPredefinedGroup=${selectedPredefinedGroup}
          @grouping-action=${this.handleGroupingAction}
        ></sonos-grouping-actions>
        <div class="list">
          ${items.map((item) => x`
              <sonos-grouping-item-row .store=${store} .item=${item} .applying=${applying} @toggle-item=${this.handleToggleItem}></sonos-grouping-item-row>
            `)}
        </div>
        <div class="applying" ?hidden=${!applying}><ha-spinner></ha-spinner></div>
        <ha-control-button-group class="buttons" ?hidden=${hideButtons}>
          <ha-control-button class="apply" @click=${this.applyGrouping}> ${store.hass.localize("ui.common.apply") || "Apply"} </ha-control-button>
          <ha-control-button @click=${this.cancelGrouping}> ${store.hass.localize("ui.common.cancel") || "Cancel"} </ha-control-button>
        </ha-control-button-group>
      </div>
    `;
	}
	static get styles() {
		return groupingSectionStyles;
	}
	handleGroupingAction(e) {
		const { type, predefinedGroup } = e.detail;
		if (type === "select-all") this.selectAll();
		else if (type === "deselect-all") this.deSelectAll();
		else if (type === "select-predefined-group") this.selectPredefinedGroup(predefinedGroup);
	}
	handleToggleItem(e) {
		this.toggleItem(e.detail);
	}
	toggleItem(item) {
		if (item.isDisabled || this.applying) return;
		this.toggleModifiedItem(item);
	}
	toggleModifiedItem(item) {
		this.modifiedItems = this.modifiedItems.includes(item.player.id) ? this.modifiedItems.filter((id) => id !== item.player.id) : [...this.modifiedItems, item.player.id];
		this.selectedPredefinedGroup = void 0;
	}
	async applyGrouping() {
		if (this.applying) return;
		const activePlayer = this.store.activePlayer;
		const joinedPlayers = this.store.getJoinedPlayerIds();
		const { unJoin, join, newMainPlayer } = getGroupingChanges(this.groupingItems, joinedPlayers, activePlayer.id);
		const selectedPG = this.selectedPredefinedGroup;
		const expectedIds = this.groupingItems.filter((i) => i.isSelected).map((i) => i.player.id).sort();
		this.frozenGroupingItems = this.groupingItems.map((item) => Object.assign(new GroupingItem(item.player, activePlayer, item.isModified), { isSelected: item.isSelected }));
		this.applying = true;
		this.modifiedItems = [];
		this.selectedPredefinedGroup = void 0;
		try {
			await this.executeChanges(join, unJoin, newMainPlayer, selectedPG);
			this.switchActivePlayerIfNeeded(activePlayer, newMainPlayer, unJoin);
			await waitForGroupSync(() => this.store, newMainPlayer, expectedIds);
			await new Promise((resolve) => setTimeout(resolve, POST_SYNC_DELAY));
		} finally {
			this.applying = false;
			this.frozenGroupingItems = void 0;
		}
	}
	refreshFromStore() {
		this.groupingItems = buildGroupingItems(this.store, this.modifiedItems);
		const hasChanges = this.modifiedItems.length > 0 || !!this.selectedPredefinedGroup;
		if (this.store.config.grouping?.skipApplyButton && hasChanges) this.applyGrouping();
	}
	async executeChanges(join, unJoin, mainPlayer, pg) {
		if (join.length) await this.store.mediaControlService.join(mainPlayer, join);
		if (unJoin.length) await this.store.mediaControlService.unJoin(unJoin);
		if (pg) await this.store.mediaControlService.activatePredefinedGroup(pg);
	}
	switchActivePlayerIfNeeded(activePlayer, newMainPlayer, unJoin) {
		if (newMainPlayer !== activePlayer.id && !this.store.config.grouping?.dontSwitchPlayer) dispatchActivePlayerId(newMainPlayer, this.store.config, this);
		if (this.store.config.entityId && unJoin.includes(this.store.config.entityId) && this.store.config.grouping?.dontSwitchPlayer) dispatchActivePlayerId(this.store.config.entityId, this.store.config, this);
	}
	cancelGrouping() {
		if (this.applying) return;
		this.modifiedItems = [];
		this.selectedPredefinedGroup = void 0;
	}
	async selectPredefinedGroup(pg) {
		let hasChanges = false;
		for (const item of this.groupingItems) if (pg.entities.some((e) => e.player.id === item.player.id) !== item.isSelected) {
			this.toggleModifiedItem(item);
			hasChanges = true;
		}
		this.selectedPredefinedGroup = pg;
		if (!hasChanges && this.store.config.grouping?.skipApplyButton) {
			await this.store.mediaControlService.activatePredefinedGroup(pg);
			this.selectedPredefinedGroup = void 0;
		}
	}
	selectAll() {
		this.groupingItems.filter((item) => !item.isSelected).forEach((item) => this.toggleItem(item));
	}
	deSelectAll() {
		this.groupingItems.filter((item) => !item.isMain && item.isSelected || item.isMain && !item.isSelected).forEach((item) => this.toggleItem(item));
	}
};
__decorate$1([n$5({ attribute: false })], Grouping.prototype, "store", void 0);
__decorate$1([r$3()], Grouping.prototype, "modifiedItems", void 0);
__decorate$1([r$3()], Grouping.prototype, "selectedPredefinedGroup", void 0);
__decorate$1([r$3()], Grouping.prototype, "applying", void 0);
//#endregion
//#region src/components/playing-bars.ts
var PlayingBars = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.show = false;
	}
	render() {
		if (!this.show) return E;
		return x`
      <div class="bars">
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
	}
	static get styles() {
		return i$8`
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

      :host {
        display: flex;
        align-items: center;
      }

      .bars {
        width: 0.55rem;
        height: 1rem;
        position: relative;
      }

      .bars > div {
        background: var(--secondary-text-color);
        bottom: 0;
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
};
__decorate$1([n$5({ type: Boolean })], PlayingBars.prototype, "show", void 0);
customElements.define("sonos-playing-bars", PlayingBars);
//#endregion
//#region src/sections/groups/group-icons.ts
var GroupIcons = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.icons = [];
	}
	render() {
		const length = this.icons.length;
		const iconsToShow = this.icons.slice(0, 4);
		const iconClass = length > 1 ? "small" : "";
		const iconsHtml = iconsToShow.map((icon) => x` <ha-icon class=${iconClass} .icon=${icon}></ha-icon>`);
		if (length > 4) iconsHtml.splice(3, 1, x`<span>+${length - 3}</span>`);
		if (length > 2) iconsHtml.splice(2, 0, x`<br />`);
		return x` <div class="icons" ?empty=${length === 0}>${iconsHtml}</div>`;
	}
	static get styles() {
		return i$8`
      .icons {
        text-align: center;
        margin: 0;
        min-width: 5em;
        max-width: 5em;
      }

      .icons[empty] {
        min-width: 1em;
        max-width: 1em;
      }

      ha-icon {
        --mdc-icon-size: 3em;
        margin: 1em;
      }

      ha-icon.small {
        --mdc-icon-size: 2em;
        margin: 0;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], GroupIcons.prototype, "icons", void 0);
customElements.define("sonos-group-icons", GroupIcons);
//#endregion
//#region src/sections/groups/group.ts
var Group = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.selected = false;
		this.dispatchEntityIdEvent = () => {
			if (this.selected) dispatchActivePlayerId(this.player.id, this.store.config, this);
		};
	}
	render() {
		const { hideCurrentTrack, itemMargin, backgroundColor, speakersFontSize, titleFontSize, compact } = this.store.config.groups ?? {};
		const currentTrack = hideCurrentTrack ? "" : this.player.getCurrentTrack();
		const speakerList = getSpeakerList(this.player, this.store.predefinedGroups);
		const icons = this.player.members.map((member) => member.attributes.icon).filter((icon) => icon);
		const listItemStyle = o$1({
			...itemMargin ? { margin: itemMargin } : {},
			...backgroundColor ? { background: backgroundColor } : {}
		});
		const speakersStyle = o$1(speakersFontSize ? { fontSize: `${speakersFontSize}rem` } : {});
		const titleStyle = o$1(titleFontSize ? { fontSize: `${titleFontSize}rem` } : {});
		return x`
      <mwc-list-item
        hasMeta
        class=${compact ? "compact" : ""}
        ?selected=${this.selected}
        ?activated=${this.selected}
        @click=${() => this.handleGroupClicked()}
        style=${listItemStyle}
      >
        <div class="row">
          <sonos-group-icons .icons=${icons}></sonos-group-icons>
          <div class="text">
            <span class="speakers" style=${speakersStyle}>${speakerList}</span>
            <span class="song-title" style=${titleStyle}>${currentTrack}</span>
          </div>
        </div>

        <sonos-playing-bars slot="meta" .show=${this.player.isPlaying()}></sonos-playing-bars>
      </mwc-list-item>
    `;
	}
	connectedCallback() {
		super.connectedCallback();
		this.dispatchEntityIdEvent();
	}
	handleGroupClicked() {
		if (!this.selected) {
			this.selected = true;
			if (!this.store.config.doNotRememberSelectedPlayer) if (this.store.config.storePlayerInSessionStorage) window.sessionStorage.setItem(SESSION_STORAGE_PLAYER_ID, this.player.id);
			else {
				const newUrl = window.location.href.replace(/#.*/g, "");
				window.location.replace(`${newUrl}#${this.player.id}`);
			}
			this.dispatchEntityIdEvent();
		}
	}
	static get styles() {
		return i$8`
      mwc-list-item {
        height: fit-content;
        margin: 1rem;
        border-radius: 1rem;
        background: var(--secondary-background-color);
        padding-left: 0;
      }

      mwc-list-item.compact {
        margin: 0.3rem;
      }

      .row {
        display: flex;
        margin: 1em 0;
        align-items: center;
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .speakers {
        white-space: initial;
        font-size: calc(var(--sonos-font-size, 1rem) * 1.1);
        font-weight: bold;
        color: var(--secondary-text-color);
      }

      .song-title {
        font-size: calc(var(--sonos-font-size, 1rem) * 0.9);
        font-weight: bold;
      }

      .compact ha-icon {
        --mdc-icon-size: 2em;
      }
      .compact div {
        margin: 0.1em;
      }
      sonos-playing-bars {
        margin-left: 0.5rem;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Group.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], Group.prototype, "player", void 0);
__decorate$1([n$5({ type: Boolean })], Group.prototype, "selected", void 0);
customElements.define("sonos-group", Group);
//#endregion
//#region src/sections/groups/groups-section.ts
var Groups = class extends i$5 {
	render() {
		const { buttonWidth } = this.store.config.groups ?? {};
		return x`
      <mwc-list activatable class="list" style=${buttonWidth ? o$1({ width: `${buttonWidth}rem` }) : ""}>
        ${this.store.allGroups.map((group) => {
			const selected = this.store.activePlayer.id === group.id;
			return x` <sonos-group .store=${this.store} .player=${group} .selected=${selected}></sonos-group> `;
		})}
      </mwc-list>
    `;
	}
	static get styles() {
		return listStyle;
	}
};
__decorate$1([n$5({ attribute: false })], Groups.prototype, "store", void 0);
//#endregion
//#region src/sections/media-browser/favorites/favorites-list.ts
var FavoritesList = class extends i$5 {
	render() {
		this.config = this.store.config;
		return x`
      <mwc-list multi class="list">
        ${itemsWithFallbacks(this.items, this.config).map((item) => {
			return x`
            <sonos-media-row @click=${() => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item))} .item=${item} .store=${this.store}></sonos-media-row>
          `;
		})}
      </mwc-list>
    `;
	}
	static get styles() {
		return listStyle;
	}
};
__decorate$1([n$5({ attribute: false })], FavoritesList.prototype, "store", void 0);
__decorate$1([n$5({ type: Array })], FavoritesList.prototype, "items", void 0);
customElements.define("sonos-favorites-list", FavoritesList);
//#endregion
//#region src/sections/media-browser/utils.ts
var mediaGridCardStyles = i$8`
  .child {
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  ha-card {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .child ha-card {
    overflow: hidden;
  }

  .child ha-card .thumbnail {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    transition: padding-bottom 0.1s ease-out;
    padding-bottom: 100%;
  }

  ha-card .image {
    border-radius: var(--ha-border-radius-sm) var(--ha-border-radius-sm) var(--ha-border-radius-square) var(--ha-border-radius-square);
  }

  .image {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .centered-image {
    margin: 0 8px;
    background-size: contain;
  }

  .brand-image {
    background-size: 40%;
  }

  .child .title {
    color: var(--secondary-text-color);
    font-size: calc(var(--sonos-font-size, 1rem) * 0.8);
    font-weight: normal;
    padding-top: 7px;
    padding-inline: 8px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .child ha-card .title {
    margin-bottom: 6px;
    padding-left: 8px;
    padding-right: 8px;
  }

  ha-card:hover .image {
    filter: brightness(70%);
    transition: filter 0.5s;
  }
`;
function renderMediaGridCard(params) {
	const { item, onClick, thumbnailContent, actionContent = E, titleContent, cardStyle } = params;
	return x`
    <div class="child" .item=${item} @click=${onClick}>
      <ha-card outlined style=${cardStyle ?? ""}>
        <div class="thumbnail">${thumbnailContent} ${actionContent}</div>
        ${titleContent !== void 0 ? titleContent : x`<div class="title">${item.title}</div>`}
      </ha-card>
    </div>
  `;
}
async function playAll(store, children) {
	if (!children.length) return null;
	await store.mediaControlService.queueAndPlay(store.activePlayer, children, "replace");
	return children[0];
}
function renderShortcutButton(shortcut, onClick, isActive = false) {
	if (!shortcut?.media_content_id || !shortcut?.media_content_type || !shortcut?.name) return E;
	const icon = shortcut.icon ?? "M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z";
	return x`
    <sonos-icon-button class=${isActive ? "shortcut-active" : ""} @click=${onClick} title=${shortcut.name} .path=${icon.startsWith("mdi:") ? void 0 : icon}>
      ${icon.startsWith("mdi:") ? x`<ha-icon .icon=${icon}></ha-icon>` : E}
    </sonos-icon-button>
  `;
}
//#endregion
//#region src/sections/media-browser/favorites/favorites-icons.ts
var FavoritesIcons = class extends i$5 {
	render() {
		const mediaBrowserConfig = this.store.config.mediaBrowser ?? {};
		const favoritesConfig = this.store.config.mediaBrowser?.favorites ?? {};
		const items = itemsWithFallbacks(this.items, this.store.config);
		let prevType = "";
		this.sortItemsByFavoriteTypeIfConfigured(items, favoritesConfig);
		const typeColor = favoritesConfig.typeColor;
		const typeFontSize = favoritesConfig.typeFontSize;
		const typeFontWeight = favoritesConfig.typeFontWeight;
		const typeMarginBottom = favoritesConfig.typeMarginBottom;
		return x`
      <style>
        .favorite-type {
          ${typeColor ? `color: ${typeColor};` : ""}
          ${typeFontSize ? `font-size: ${typeFontSize};` : ""}
          ${typeFontWeight ? `font-weight: ${typeFontWeight};` : ""}
          ${typeMarginBottom ? `margin-bottom: ${typeMarginBottom};` : ""}
        }
      </style>
      <div class="icons">
        ${items.map((item) => {
			const showFavoriteType = favoritesConfig.sortByType && item.favoriteType !== prevType || E;
			const showTitle = !item.thumbnail || !favoritesConfig.hideTitleForThumbnailIcons;
			const thumbnailInset = favoritesConfig.iconPadding !== void 0 ? `${favoritesConfig.iconPadding}rem` : void 0;
			const imageStyle = [thumbnailInset ? `top:${thumbnailInset};right:${thumbnailInset};bottom:${thumbnailInset};left:${thumbnailInset};` : "", item.thumbnail ? `background-image:url("${item.thumbnail}")` : ""].join(" ");
			const titleStyle = o$1({
				color: favoritesConfig.iconTitleColor ?? "",
				backgroundColor: favoritesConfig.iconTitleBackgroundColor ?? ""
			});
			const toRender = x`
            <div class="favorite-type" show=${showFavoriteType}>${item.favoriteType}</div>
            <div style=${this.buttonStyle(mediaBrowserConfig.itemsPerRow || 4)}>
              ${renderMediaGridCard({
				item,
				onClick: () => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item)),
				thumbnailContent: item.thumbnail ? x`<div class="image" style=${imageStyle}></div>` : x`<div class="image image-placeholder" style=${thumbnailInset ? imageStyle : ""}></div>`,
				titleContent: showTitle ? x`<div class="title" style=${titleStyle}>${item.title}</div>` : E,
				cardStyle: favoritesConfig.iconBorder ? `border:${favoritesConfig.iconBorder};` : ""
			})}
            </div>
          `;
			prevType = item.favoriteType;
			return toRender;
		})}
      </div>
    `;
	}
	sortItemsByFavoriteTypeIfConfigured(items, config) {
		if (config.sortByType) items.sort((a, b) => {
			return a.favoriteType?.localeCompare(b.favoriteType ?? "") || a.title.localeCompare(b.title);
		});
	}
	buttonStyle(favoritesItemsPerRow) {
		const margin = `${this.store.config.mediaBrowser?.favorites?.iconMarginPercentage ?? 1}%`;
		return o$1({
			width: `calc(100% / ${favoritesItemsPerRow} - ${margin} * 2)`,
			margin
		});
	}
	static get styles() {
		return [
			mediaItemTitleStyle,
			mediaGridCardStyles,
			i$8`
        .icons {
          display: flex;
          flex-wrap: wrap;
        }

        .image-placeholder {
          background: var(--secondary-background-color);
        }

        .favorite-type {
          width: 100%;
          display: none;
          margin-top: 0.2rem;
          margin-left: 15px;
          font-weight: bold;
        }

        .favorite-type[show] {
          display: block;
        }
      `
		];
	}
};
__decorate$1([n$5({ attribute: false })], FavoritesIcons.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], FavoritesIcons.prototype, "items", void 0);
customElements.define("sonos-favorites-icons", FavoritesIcons);
//#endregion
//#region src/sections/media-browser/favorites/favorites.ts
var Favorites = class Favorites extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.layout = "auto";
		this.cachedFavorites = null;
		this.cachedFavoritesPlayerId = null;
		this.onFavoriteSelected = async (event) => {
			const mediaItem = event.detail;
			await this.playFavorite(mediaItem);
			this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, mediaItem));
		};
	}
	connectedCallback() {
		super.connectedCallback();
		this.loadFavorites();
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("store")) {
			const playerId = this.store?.activePlayer?.id;
			if (playerId && playerId !== this.cachedFavoritesPlayerId) this.loadFavorites();
		}
	}
	async loadFavorites() {
		const playerId = this.store?.activePlayer?.id;
		if (!playerId) return;
		this.cachedFavoritesPlayerId = playerId;
		this.cachedFavorites = await this.getFavorites();
	}
	async getFavorites() {
		const favoritesConfig = this.store.config.mediaBrowser?.favorites ?? {};
		const player = this.store.activePlayer;
		let favorites = await this.store.mediaBrowseService.getFavorites(player);
		const topItems = favoritesConfig.topItems ?? [];
		favorites.sort((a, b) => this.sortFavorites(a.title, b.title, topItems));
		favorites = [
			...favoritesConfig.customFavorites?.[player.id]?.map(Favorites.createFavorite) || [],
			...favoritesConfig.customFavorites?.all?.map(Favorites.createFavorite) || [],
			...favorites
		];
		return favoritesConfig.numberToShow ? favorites.slice(0, favoritesConfig.numberToShow) : favorites;
	}
	sortFavorites(a, b, topItems) {
		const aIndex = indexOfWithoutSpecialChars(topItems, a);
		const bIndex = indexOfWithoutSpecialChars(topItems, b);
		if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
		let result = bIndex - aIndex;
		if (result === 0) result = a.localeCompare(b, "en", { sensitivity: "base" });
		return result;
	}
	static createFavorite(source) {
		return {
			...source,
			can_play: true
		};
	}
	async playFavorite(mediaItem) {
		const player = this.store.activePlayer;
		if (mediaItem.media_content_type || mediaItem.media_content_id) await this.store.mediaControlService.playMedia(player, mediaItem);
		else await this.store.mediaControlService.setSource(player, mediaItem.title);
	}
	render() {
		if (!this.cachedFavorites) return E;
		if (!this.cachedFavorites.length) return x`<div class="no-items">No favorites found</div>`;
		if (this.layout !== "list") return x`
        <sonos-favorites-icons .items=${this.cachedFavorites} .store=${this.store} @item-selected=${this.onFavoriteSelected}></sonos-favorites-icons>
      `;
		else return x`
        <sonos-favorites-list .items=${this.cachedFavorites} .store=${this.store} @item-selected=${this.onFavoriteSelected}></sonos-favorites-list>
      `;
	}
	static get styles() {
		return i$8`
      :host {
        display: block;
        flex: 1;
        min-height: 0;
        overflow: auto;
      }
      .no-items {
        text-align: center;
        margin-top: 50%;
      }
      sonos-favorites-icons,
      sonos-favorites-list {
        --mdc-icon-size: 24px;
        --media-browse-item-size: 100px;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Favorites.prototype, "store", void 0);
__decorate$1([n$5({ type: String })], Favorites.prototype, "layout", void 0);
__decorate$1([r$3()], Favorites.prototype, "cachedFavorites", void 0);
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/shared/BaseLayout.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function dim1(direction) {
	return direction === "horizontal" ? "width" : "height";
}
function dim2(direction) {
	return direction === "horizontal" ? "height" : "width";
}
var BaseLayout;
var init_BaseLayout = __esmMin((() => {
	BaseLayout = class {
		_getDefaultConfig() {
			return { direction: "vertical" };
		}
		constructor(hostSink, config) {
			/**
			* The last set viewport scroll position.
			*/
			this._latestCoords = {
				left: 0,
				top: 0
			};
			/**
			* Scrolling direction.
			*/
			this._direction = null;
			/**
			* Dimensions of the viewport.
			*/
			this._viewportSize = {
				width: 0,
				height: 0
			};
			this.totalScrollSize = {
				width: 0,
				height: 0
			};
			this.offsetWithinScroller = {
				left: 0,
				top: 0
			};
			/**
			* Flag for debouncing asynchronous reflow requests.
			*/
			this._pendingReflow = false;
			this._pendingLayoutUpdate = false;
			this._pin = null;
			/**
			* The index of the first item intersecting the viewport.
			*/
			this._firstVisible = 0;
			/**
			* The index of the last item intersecting the viewport.
			*/
			this._lastVisible = 0;
			/**
			* Pixel offset in the scroll direction of the first child.
			*/
			this._physicalMin = 0;
			/**
			* Pixel offset in the scroll direction of the last child.
			*/
			this._physicalMax = 0;
			/**
			* Index of the first child.
			*/
			this._first = -1;
			/**
			* Index of the last child.
			*/
			this._last = -1;
			/**
			* Length in the scrolling direction.
			*/
			this._sizeDim = "height";
			/**
			* Length in the non-scrolling direction.
			*/
			this._secondarySizeDim = "width";
			/**
			* Position in the scrolling direction.
			*/
			this._positionDim = "top";
			/**
			* Position in the non-scrolling direction.
			*/
			this._secondaryPositionDim = "left";
			/**
			* Current scroll offset in pixels.
			*/
			this._scrollPosition = 0;
			/**
			* Difference between current scroll offset and scroll offset calculated due
			* to a reflow.
			*/
			this._scrollError = 0;
			/**
			* Total number of items that could possibly be displayed. Used to help
			* calculate the scroll size.
			*/
			this._items = [];
			/**
			* The total (estimated) length of all items in the scrolling direction.
			*/
			this._scrollSize = 1;
			/**
			* Number of pixels beyond the viewport to still include
			* in the active range of items.
			*/
			this._overhang = 1e3;
			this._hostSink = hostSink;
			Promise.resolve().then(() => this.config = config || this._getDefaultConfig());
		}
		set config(config) {
			Object.assign(this, Object.assign({}, this._getDefaultConfig(), config));
		}
		get config() {
			return { direction: this.direction };
		}
		/**
		* Maximum index of children + 1, to help estimate total height of the scroll
		* space.
		*/
		get items() {
			return this._items;
		}
		set items(items) {
			this._setItems(items);
		}
		_setItems(items) {
			if (items !== this._items) {
				this._items = items;
				this._scheduleReflow();
			}
		}
		/**
		* Primary scrolling direction.
		*/
		get direction() {
			return this._direction;
		}
		set direction(dir) {
			dir = dir === "horizontal" ? dir : "vertical";
			if (dir !== this._direction) {
				this._direction = dir;
				this._sizeDim = dir === "horizontal" ? "width" : "height";
				this._secondarySizeDim = dir === "horizontal" ? "height" : "width";
				this._positionDim = dir === "horizontal" ? "left" : "top";
				this._secondaryPositionDim = dir === "horizontal" ? "top" : "left";
				this._triggerReflow();
			}
		}
		/**
		* Height and width of the viewport.
		*/
		get viewportSize() {
			return this._viewportSize;
		}
		set viewportSize(dims) {
			const { _viewDim1, _viewDim2 } = this;
			Object.assign(this._viewportSize, dims);
			if (_viewDim2 !== this._viewDim2) this._scheduleLayoutUpdate();
			else if (_viewDim1 !== this._viewDim1) this._checkThresholds();
		}
		/**
		* Scroll offset of the viewport.
		*/
		get viewportScroll() {
			return this._latestCoords;
		}
		set viewportScroll(coords) {
			Object.assign(this._latestCoords, coords);
			const oldPos = this._scrollPosition;
			this._scrollPosition = this._latestCoords[this._positionDim];
			if (Math.abs(oldPos - this._scrollPosition) >= 1) this._checkThresholds();
		}
		/**
		* Perform a reflow if one has been scheduled.
		*/
		reflowIfNeeded(force = false) {
			if (force || this._pendingReflow) {
				this._pendingReflow = false;
				this._reflow();
			}
		}
		set pin(options) {
			this._pin = options;
			this._triggerReflow();
		}
		get pin() {
			if (this._pin !== null) {
				const { index, block } = this._pin;
				return {
					index: Math.max(0, Math.min(index, this.items.length - 1)),
					block
				};
			}
			return null;
		}
		_clampScrollPosition(val) {
			return Math.max(-this.offsetWithinScroller[this._positionDim], Math.min(val, this.totalScrollSize[dim1(this.direction)] - this._viewDim1));
		}
		unpin() {
			if (this._pin !== null) {
				this._sendUnpinnedMessage();
				this._pin = null;
			}
		}
		_updateLayout() {}
		/**
		* The height or width of the viewport, whichever corresponds to the scrolling direction.
		*/
		get _viewDim1() {
			return this._viewportSize[this._sizeDim];
		}
		/**
		* The height or width of the viewport, whichever does NOT correspond to the scrolling direction.
		*/
		get _viewDim2() {
			return this._viewportSize[this._secondarySizeDim];
		}
		_scheduleReflow() {
			this._pendingReflow = true;
		}
		_scheduleLayoutUpdate() {
			this._pendingLayoutUpdate = true;
			this._scheduleReflow();
		}
		_triggerReflow() {
			this._scheduleLayoutUpdate();
			Promise.resolve().then(() => this.reflowIfNeeded());
		}
		_reflow() {
			if (this._pendingLayoutUpdate) {
				this._updateLayout();
				this._pendingLayoutUpdate = false;
			}
			this._updateScrollSize();
			this._setPositionFromPin();
			this._getActiveItems();
			this._updateVisibleIndices();
			this._sendStateChangedMessage();
		}
		/**
		* If we are supposed to be pinned to a particular
		* item or set of coordinates, we set `_scrollPosition`
		* accordingly and adjust `_scrollError` as needed
		* so that the virtualizer can keep the scroll
		* position in the DOM in sync
		*/
		_setPositionFromPin() {
			if (this.pin !== null) {
				const lastScrollPosition = this._scrollPosition;
				const { index, block } = this.pin;
				this._scrollPosition = this._calculateScrollIntoViewPosition({
					index,
					block: block || "start"
				}) - this.offsetWithinScroller[this._positionDim];
				this._scrollError = lastScrollPosition - this._scrollPosition;
			}
		}
		/**
		* Calculate the coordinates to scroll to, given
		* a request to scroll to the element at a specific
		* index.
		*
		* Supports the same positioning options (`start`,
		* `center`, `end`, `nearest`) as the standard
		* `Element.scrollIntoView()` method, but currently
		* only considers the provided value in the `block`
		* dimension, since we don't yet have any layouts
		* that support virtualization in two dimensions.
		*/
		_calculateScrollIntoViewPosition(options) {
			const { block } = options;
			const index = Math.min(this.items.length, Math.max(0, options.index));
			const itemStartPosition = this._getItemPosition(index)[this._positionDim];
			let scrollPosition = itemStartPosition;
			if (block !== "start") {
				const itemSize = this._getItemSize(index)[this._sizeDim];
				if (block === "center") scrollPosition = itemStartPosition - .5 * this._viewDim1 + .5 * itemSize;
				else {
					const itemEndPosition = itemStartPosition - this._viewDim1 + itemSize;
					if (block === "end") scrollPosition = itemEndPosition;
					else {
						const currentScrollPosition = this._scrollPosition;
						scrollPosition = Math.abs(currentScrollPosition - itemStartPosition) < Math.abs(currentScrollPosition - itemEndPosition) ? itemStartPosition : itemEndPosition;
					}
				}
			}
			scrollPosition += this.offsetWithinScroller[this._positionDim];
			return this._clampScrollPosition(scrollPosition);
		}
		getScrollIntoViewCoordinates(options) {
			return { [this._positionDim]: this._calculateScrollIntoViewPosition(options) };
		}
		_sendUnpinnedMessage() {
			this._hostSink({ type: "unpinned" });
		}
		_sendVisibilityChangedMessage() {
			this._hostSink({
				type: "visibilityChanged",
				firstVisible: this._firstVisible,
				lastVisible: this._lastVisible
			});
		}
		_sendStateChangedMessage() {
			const childPositions = /* @__PURE__ */ new Map();
			if (this._first !== -1 && this._last !== -1) for (let idx = this._first; idx <= this._last; idx++) childPositions.set(idx, this._getItemPosition(idx));
			const message = {
				type: "stateChanged",
				scrollSize: {
					[this._sizeDim]: this._scrollSize,
					[this._secondarySizeDim]: null
				},
				range: {
					first: this._first,
					last: this._last,
					firstVisible: this._firstVisible,
					lastVisible: this._lastVisible
				},
				childPositions
			};
			if (this._scrollError) {
				message.scrollError = {
					[this._positionDim]: this._scrollError,
					[this._secondaryPositionDim]: 0
				};
				this._scrollError = 0;
			}
			this._hostSink(message);
		}
		/**
		* Number of items to display.
		*/
		get _num() {
			if (this._first === -1 || this._last === -1) return 0;
			return this._last - this._first + 1;
		}
		_checkThresholds() {
			if (this._viewDim1 === 0 && this._num > 0 || this._pin !== null) this._scheduleReflow();
			else {
				const min = Math.max(0, this._scrollPosition - this._overhang);
				const max = Math.min(this._scrollSize, this._scrollPosition + this._viewDim1 + this._overhang);
				if (this._physicalMin > min || this._physicalMax < max) this._scheduleReflow();
				else this._updateVisibleIndices({ emit: true });
			}
		}
		/**
		* Find the indices of the first and last items to intersect the viewport.
		* Emit a visibleindiceschange event when either index changes.
		*/
		_updateVisibleIndices(options) {
			if (this._first === -1 || this._last === -1) return;
			let firstVisible = this._first;
			while (firstVisible < this._last && Math.round(this._getItemPosition(firstVisible)[this._positionDim] + this._getItemSize(firstVisible)[this._sizeDim]) <= Math.round(this._scrollPosition)) firstVisible++;
			let lastVisible = this._last;
			while (lastVisible > this._first && Math.round(this._getItemPosition(lastVisible)[this._positionDim]) >= Math.round(this._scrollPosition + this._viewDim1)) lastVisible--;
			if (firstVisible !== this._firstVisible || lastVisible !== this._lastVisible) {
				this._firstVisible = firstVisible;
				this._lastVisible = lastVisible;
				if (options && options.emit) this._sendVisibilityChangedMessage();
			}
		}
	};
}));
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/shared/SizeGapPaddingBaseLayout.js
init_BaseLayout();
function paddingValueToNumber(v) {
	if (v === "match-gap") return Infinity;
	return parseInt(v);
}
function gapValueToNumber(v) {
	if (v === "auto") return Infinity;
	return parseInt(v);
}
function gap1(direction) {
	return direction === "horizontal" ? "column" : "row";
}
function gap2(direction) {
	return direction === "horizontal" ? "row" : "column";
}
function padding1(direction) {
	return direction === "horizontal" ? ["left", "right"] : ["top", "bottom"];
}
function padding2(direction) {
	return direction === "horizontal" ? ["top", "bottom"] : ["left", "right"];
}
var SizeGapPaddingBaseLayout = class extends BaseLayout {
	constructor() {
		super(...arguments);
		this._itemSize = {};
		this._gaps = {};
		this._padding = {};
	}
	_getDefaultConfig() {
		return Object.assign({}, super._getDefaultConfig(), {
			itemSize: {
				width: "300px",
				height: "300px"
			},
			gap: "8px",
			padding: "match-gap"
		});
	}
	get _gap() {
		return this._gaps.row;
	}
	get _idealSize() {
		return this._itemSize[dim1(this.direction)];
	}
	get _idealSize1() {
		return this._itemSize[dim1(this.direction)];
	}
	get _idealSize2() {
		return this._itemSize[dim2(this.direction)];
	}
	get _gap1() {
		return this._gaps[gap1(this.direction)];
	}
	get _gap2() {
		return this._gaps[gap2(this.direction)];
	}
	get _padding1() {
		const padding = this._padding;
		const [start, end] = padding1(this.direction);
		return [padding[start], padding[end]];
	}
	get _padding2() {
		const padding = this._padding;
		const [start, end] = padding2(this.direction);
		return [padding[start], padding[end]];
	}
	set itemSize(dims) {
		const size = this._itemSize;
		if (typeof dims === "string") dims = {
			width: dims,
			height: dims
		};
		const width = parseInt(dims.width);
		const height = parseInt(dims.height);
		if (width !== size.width) {
			size.width = width;
			this._triggerReflow();
		}
		if (height !== size.height) {
			size.height = height;
			this._triggerReflow();
		}
	}
	set gap(spec) {
		this._setGap(spec);
	}
	_setGap(spec) {
		const values = spec.split(" ").map((v) => gapValueToNumber(v));
		const gaps = this._gaps;
		if (values[0] !== gaps.row) {
			gaps.row = values[0];
			this._triggerReflow();
		}
		if (values[1] === void 0) {
			if (values[0] !== gaps.column) {
				gaps.column = values[0];
				this._triggerReflow();
			}
		} else if (values[1] !== gaps.column) {
			gaps.column = values[1];
			this._triggerReflow();
		}
	}
	set padding(spec) {
		const padding = this._padding;
		const values = spec.split(" ").map((v) => paddingValueToNumber(v));
		if (values.length === 1) {
			padding.top = padding.right = padding.bottom = padding.left = values[0];
			this._triggerReflow();
		} else if (values.length === 2) {
			padding.top = padding.bottom = values[0];
			padding.right = padding.left = values[1];
			this._triggerReflow();
		} else if (values.length === 3) {
			padding.top = values[0];
			padding.right = padding.left = values[1];
			padding.bottom = values[2];
			this._triggerReflow();
		} else if (values.length === 4) {
			[
				"top",
				"right",
				"bottom",
				"left"
			].forEach((side, idx) => padding[side] = values[idx]);
			this._triggerReflow();
		}
	}
};
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/shared/GridBaseLayout.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
init_BaseLayout();
var GridBaseLayout = class extends SizeGapPaddingBaseLayout {
	constructor() {
		super(...arguments);
		this._metrics = null;
		this.flex = null;
		this.justify = null;
	}
	_getDefaultConfig() {
		return Object.assign({}, super._getDefaultConfig(), {
			flex: false,
			justify: "start"
		});
	}
	set gap(spec) {
		super._setGap(spec);
	}
	_updateLayout() {
		const justify = this.justify;
		const [padding1Start, padding1End] = this._padding1;
		const [padding2Start, padding2End] = this._padding2;
		["_gap1", "_gap2"].forEach((gap) => {
			const gapValue = this[gap];
			if (gapValue === Infinity && ![
				"space-between",
				"space-around",
				"space-evenly"
			].includes(justify)) throw new Error(`grid layout: gap can only be set to 'auto' when justify is set to 'space-between', 'space-around' or 'space-evenly'`);
			if (gapValue === Infinity && gap === "_gap2") throw new Error(`grid layout: ${gap2(this.direction)}-gap cannot be set to 'auto' when direction is set to ${this.direction}`);
		});
		const usePaddingAndGap2 = this.flex || [
			"start",
			"center",
			"end"
		].includes(justify);
		const metrics = {
			rolumns: -1,
			itemSize1: -1,
			itemSize2: -1,
			gap1: this._gap1 === Infinity ? -1 : this._gap1,
			gap2: usePaddingAndGap2 ? this._gap2 : 0,
			padding1: {
				start: padding1Start === Infinity ? this._gap1 : padding1Start,
				end: padding1End === Infinity ? this._gap1 : padding1End
			},
			padding2: usePaddingAndGap2 ? {
				start: padding2Start === Infinity ? this._gap2 : padding2Start,
				end: padding2End === Infinity ? this._gap2 : padding2End
			} : {
				start: 0,
				end: 0
			},
			positions: []
		};
		const availableSpace = this._viewDim2 - metrics.padding2.start - metrics.padding2.end;
		if (availableSpace <= 0) metrics.rolumns = 0;
		else {
			const gapSize = usePaddingAndGap2 ? metrics.gap2 : 0;
			let rolumns = 0;
			let spaceTaken = 0;
			if (availableSpace >= this._idealSize2) {
				rolumns = Math.floor((availableSpace - this._idealSize2) / (this._idealSize2 + gapSize)) + 1;
				spaceTaken = rolumns * this._idealSize2 + (rolumns - 1) * gapSize;
			}
			if (this.flex) {
				if ((availableSpace - spaceTaken) / (this._idealSize2 + gapSize) >= .5) rolumns = rolumns + 1;
				metrics.rolumns = rolumns;
				metrics.itemSize2 = Math.round((availableSpace - gapSize * (rolumns - 1)) / rolumns);
				switch (this.flex === true ? "area" : this.flex.preserve) {
					case "aspect-ratio":
						metrics.itemSize1 = Math.round(this._idealSize1 / this._idealSize2 * metrics.itemSize2);
						break;
					case dim1(this.direction):
						metrics.itemSize1 = Math.round(this._idealSize1);
						break;
					default: metrics.itemSize1 = Math.round(this._idealSize1 * this._idealSize2 / metrics.itemSize2);
				}
			} else {
				metrics.itemSize1 = this._idealSize1;
				metrics.itemSize2 = this._idealSize2;
				metrics.rolumns = rolumns;
			}
			let pos;
			if (usePaddingAndGap2) {
				const spaceTaken = metrics.rolumns * metrics.itemSize2 + (metrics.rolumns - 1) * metrics.gap2;
				pos = this.flex || justify === "start" ? metrics.padding2.start : justify === "end" ? this._viewDim2 - metrics.padding2.end - spaceTaken : Math.round(this._viewDim2 / 2 - spaceTaken / 2);
			} else {
				const spaceToDivide = availableSpace - metrics.rolumns * metrics.itemSize2;
				if (justify === "space-between") {
					metrics.gap2 = Math.round(spaceToDivide / (metrics.rolumns - 1));
					pos = 0;
				} else if (justify === "space-around") {
					metrics.gap2 = Math.round(spaceToDivide / metrics.rolumns);
					pos = Math.round(metrics.gap2 / 2);
				} else {
					metrics.gap2 = Math.round(spaceToDivide / (metrics.rolumns + 1));
					pos = metrics.gap2;
				}
				if (this._gap1 === Infinity) {
					metrics.gap1 = metrics.gap2;
					if (padding1Start === Infinity) metrics.padding1.start = pos;
					if (padding1End === Infinity) metrics.padding1.end = pos;
				}
			}
			for (let i = 0; i < metrics.rolumns; i++) {
				metrics.positions.push(pos);
				pos += metrics.itemSize2 + metrics.gap2;
			}
		}
		this._metrics = metrics;
	}
};
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/grid.js
init_BaseLayout();
var grid = (config) => Object.assign({ type: GridLayout }, config);
var GridLayout = class extends GridBaseLayout {
	/**
	* Returns the average size (precise or estimated) of an item in the scrolling direction,
	* including any surrounding space.
	*/
	get _delta() {
		return this._metrics.itemSize1 + this._metrics.gap1;
	}
	_getItemSize(_idx) {
		return {
			[this._sizeDim]: this._metrics.itemSize1,
			[this._secondarySizeDim]: this._metrics.itemSize2
		};
	}
	_getActiveItems() {
		const metrics = this._metrics;
		const { rolumns } = metrics;
		if (rolumns === 0) {
			this._first = -1;
			this._last = -1;
			this._physicalMin = 0;
			this._physicalMax = 0;
		} else {
			const { padding1 } = metrics;
			const min = Math.max(0, this._scrollPosition - this._overhang);
			const max = Math.min(this._scrollSize, this._scrollPosition + this._viewDim1 + this._overhang);
			const firstCow = Math.max(0, Math.floor((min - padding1.start) / this._delta));
			const lastCow = Math.max(0, Math.ceil((max - padding1.start) / this._delta));
			this._first = firstCow * rolumns;
			this._last = Math.min(lastCow * rolumns - 1, this.items.length - 1);
			this._physicalMin = padding1.start + this._delta * firstCow;
			this._physicalMax = padding1.start + this._delta * lastCow;
		}
	}
	_getItemPosition(idx) {
		const { rolumns, padding1, positions, itemSize1, itemSize2 } = this._metrics;
		return {
			[this._positionDim]: padding1.start + Math.floor(idx / rolumns) * this._delta,
			[this._secondaryPositionDim]: positions[idx % rolumns],
			[dim1(this.direction)]: itemSize1,
			[dim2(this.direction)]: itemSize2
		};
	}
	_updateScrollSize() {
		const { rolumns, gap1, padding1, itemSize1 } = this._metrics;
		let size = 1;
		if (rolumns > 0) {
			const cows = Math.ceil(this.items.length / rolumns);
			size = padding1.start + cows * itemSize1 + (cows - 1) * gap1 + padding1.end;
		}
		this._scrollSize = size;
	}
};
//#endregion
//#region node_modules/lit-html/directives/class-map.js
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var e = e$2(class extends i$4 {
	constructor(t) {
		if (super(t), t.type !== t$1.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return " " + Object.keys(t).filter(((s) => t[s])).join(" ") + " ";
	}
	update(s, [i]) {
		if (void 0 === this.st) {
			this.st = /* @__PURE__ */ new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter(((t) => "" !== t))));
			for (const t in i) i[t] && !this.nt?.has(t) && this.st.add(t);
			return this.render(i);
		}
		const r = s.element.classList;
		for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
		for (const t in i) {
			const s = !!i[t];
			s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
		}
		return T;
	}
});
//#endregion
//#region src/upstream/common/slugify.ts
var slugify = (value, delimiter = "_") => {
	const a = "àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·";
	const b = `aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${delimiter}`;
	const p = new RegExp(a.split("").join("|"), "g");
	const complex_cyrillic = {
		ж: "zh",
		х: "kh",
		ц: "ts",
		ч: "ch",
		ш: "sh",
		щ: "shch",
		ю: "iu",
		я: "ia"
	};
	let slugified;
	if (value === "") slugified = "";
	else {
		slugified = value.toString().toLowerCase().replace(p, (c) => b.charAt(a.indexOf(c))).replace(/[а-я]/g, (c) => complex_cyrillic[c] || "").replace(/(\d),(?=\d)/g, "$1").replace(/[^a-z0-9]+/g, delimiter).replace(new RegExp(`(${delimiter})\\1+`, "g"), "$1").replace(new RegExp(`^${delimiter}+`), "").replace(new RegExp(`${delimiter}+$`), "");
		if (slugified === "") slugified = "unknown";
	}
	return slugified;
};
//#endregion
//#region src/upstream/data/media_source.ts
var browseLocalMediaPlayer = (hass, mediaContentId) => hass.callWS({
	type: "media_source/browse_media",
	media_content_id: mediaContentId
});
var MANUAL_MEDIA_SOURCE_PREFIX = "__MANUAL_ENTRY__";
var isManualMediaSourceContentId = (mediaContentId) => mediaContentId.startsWith(MANUAL_MEDIA_SOURCE_PREFIX);
//#endregion
//#region src/upstream/resources/styles.ts
var haStyle = i$8`
  .mdc-deprecated-list-item__graphic {
    margin-inline-end: 16px;
    margin-inline-start: 0;
  }
`;
//#endregion
//#region node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region node_modules/lit-html/directives/repeat.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var u = (e, s, t) => {
	const r = /* @__PURE__ */ new Map();
	for (let l = s; l <= t; l++) r.set(e[l], l);
	return r;
}, c = e$2(class extends i$4 {
	constructor(e) {
		if (super(e), e.type !== t$1.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, s, t) {
		let r;
		void 0 === t ? t = s : void 0 !== s && (r = s);
		const l = [], o = [];
		let i = 0;
		for (const s of e) l[i] = r ? r(s, i) : i, o[i] = t(s, i), i++;
		return {
			values: o,
			keys: l
		};
	}
	render(e, s, t) {
		return this.dt(e, s, t).values;
	}
	update(s, [t, r, c]) {
		const d = p(s), { values: p$3, keys: a } = this.dt(t, r, c);
		if (!Array.isArray(d)) return this.ut = a, p$3;
		const h = this.ut ??= [], v$2 = [];
		let m, y, x = 0, j = d.length - 1, k = 0, w = p$3.length - 1;
		for (; x <= j && k <= w;) if (null === d[x]) x++;
		else if (null === d[j]) j--;
		else if (h[x] === a[k]) v$2[k] = v(d[x], p$3[k]), x++, k++;
		else if (h[j] === a[w]) v$2[w] = v(d[j], p$3[w]), j--, w--;
		else if (h[x] === a[w]) v$2[w] = v(d[x], p$3[w]), r$2(s, v$2[w + 1], d[x]), x++, w--;
		else if (h[j] === a[k]) v$2[k] = v(d[j], p$3[k]), r$2(s, d[x], d[j]), j--, k++;
		else if (void 0 === m && (m = u(a, k, w), y = u(h, x, j)), m.has(h[x])) if (m.has(h[j])) {
			const e = y.get(a[k]), t = void 0 !== e ? d[e] : null;
			if (null === t) {
				const e = r$2(s, d[x]);
				v(e, p$3[k]), v$2[k] = e;
			} else v$2[k] = v(t, p$3[k]), r$2(s, d[x], t), d[e] = null;
			k++;
		} else M(d[j]), j--;
		else M(d[x]), x++;
		for (; k <= w;) {
			const e = r$2(s, v$2[w + 1]);
			v(e, p$3[k]), v$2[k++] = e;
		}
		for (; x <= j;) {
			const e = d[x++];
			null !== e && M(e);
		}
		return this.ut = a, m$1(s, v$2), T;
	}
});
//#endregion
//#region node_modules/@lit-labs/virtualizer/events.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var RangeChangedEvent = class RangeChangedEvent extends Event {
	constructor(range) {
		super(RangeChangedEvent.eventName, { bubbles: false });
		this.first = range.first;
		this.last = range.last;
	}
};
RangeChangedEvent.eventName = "rangeChanged";
var VisibilityChangedEvent = class VisibilityChangedEvent extends Event {
	constructor(range) {
		super(VisibilityChangedEvent.eventName, { bubbles: false });
		this.first = range.first;
		this.last = range.last;
	}
};
VisibilityChangedEvent.eventName = "visibilityChanged";
var UnpinnedEvent = class UnpinnedEvent extends Event {
	constructor() {
		super(UnpinnedEvent.eventName, { bubbles: false });
	}
};
UnpinnedEvent.eventName = "unpinned";
//#endregion
//#region node_modules/@lit-labs/virtualizer/ScrollerController.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var ScrollerShim = class {
	constructor(element) {
		this._element = null;
		const node = element ?? window;
		this._node = node;
		if (element) this._element = element;
	}
	get element() {
		return this._element || document.scrollingElement || document.documentElement;
	}
	get scrollTop() {
		return this.element.scrollTop || window.scrollY;
	}
	get scrollLeft() {
		return this.element.scrollLeft || window.scrollX;
	}
	get scrollHeight() {
		return this.element.scrollHeight;
	}
	get scrollWidth() {
		return this.element.scrollWidth;
	}
	get viewportHeight() {
		return this._element ? this._element.getBoundingClientRect().height : window.innerHeight;
	}
	get viewportWidth() {
		return this._element ? this._element.getBoundingClientRect().width : window.innerWidth;
	}
	get maxScrollTop() {
		return this.scrollHeight - this.viewportHeight;
	}
	get maxScrollLeft() {
		return this.scrollWidth - this.viewportWidth;
	}
};
var ScrollerController = class extends ScrollerShim {
	constructor(client, element) {
		super(element);
		this._clients = /* @__PURE__ */ new Set();
		this._retarget = null;
		this._end = null;
		this.__destination = null;
		this.correctingScrollError = false;
		this._checkForArrival = this._checkForArrival.bind(this);
		this._updateManagedScrollTo = this._updateManagedScrollTo.bind(this);
		this.scrollTo = this.scrollTo.bind(this);
		this.scrollBy = this.scrollBy.bind(this);
		const node = this._node;
		this._originalScrollTo = node.scrollTo;
		this._originalScrollBy = node.scrollBy;
		this._originalScroll = node.scroll;
		this._attach(client);
	}
	get _destination() {
		return this.__destination;
	}
	get scrolling() {
		return this._destination !== null;
	}
	scrollTo(p1, p2) {
		const options = typeof p1 === "number" && typeof p2 === "number" ? {
			left: p1,
			top: p2
		} : p1;
		this._scrollTo(options);
	}
	scrollBy(p1, p2) {
		const options = typeof p1 === "number" && typeof p2 === "number" ? {
			left: p1,
			top: p2
		} : p1;
		if (options.top !== void 0) options.top += this.scrollTop;
		if (options.left !== void 0) options.left += this.scrollLeft;
		this._scrollTo(options);
	}
	_nativeScrollTo(options) {
		this._originalScrollTo.bind(this._element || window)(options);
	}
	_scrollTo(options, retarget = null, end = null) {
		if (this._end !== null) this._end();
		if (options.behavior === "smooth") {
			this._setDestination(options);
			this._retarget = retarget;
			this._end = end;
		} else this._resetScrollState();
		this._nativeScrollTo(options);
	}
	_setDestination(options) {
		let { top, left } = options;
		top = top === void 0 ? void 0 : Math.max(0, Math.min(top, this.maxScrollTop));
		left = left === void 0 ? void 0 : Math.max(0, Math.min(left, this.maxScrollLeft));
		if (this._destination !== null && left === this._destination.left && top === this._destination.top) return false;
		this.__destination = {
			top,
			left,
			behavior: "smooth"
		};
		return true;
	}
	_resetScrollState() {
		this.__destination = null;
		this._retarget = null;
		this._end = null;
	}
	_updateManagedScrollTo(coordinates) {
		if (this._destination) {
			if (this._setDestination(coordinates)) this._nativeScrollTo(this._destination);
		}
	}
	managedScrollTo(options, retarget, end) {
		this._scrollTo(options, retarget, end);
		return this._updateManagedScrollTo;
	}
	correctScrollError(coordinates) {
		this.correctingScrollError = true;
		requestAnimationFrame(() => requestAnimationFrame(() => this.correctingScrollError = false));
		this._nativeScrollTo(coordinates);
		if (this._retarget) this._setDestination(this._retarget());
		if (this._destination) this._nativeScrollTo(this._destination);
	}
	_checkForArrival() {
		if (this._destination !== null) {
			const { scrollTop, scrollLeft } = this;
			let { top, left } = this._destination;
			top = Math.min(top || 0, this.maxScrollTop);
			left = Math.min(left || 0, this.maxScrollLeft);
			const topDiff = Math.abs(top - scrollTop);
			const leftDiff = Math.abs(left - scrollLeft);
			if (topDiff < 1 && leftDiff < 1) {
				if (this._end) this._end();
				this._resetScrollState();
			}
		}
	}
	detach(client) {
		this._clients.delete(client);
		/**
		* If there aren't any more clients, then return the node's default
		* scrolling methods
		*/
		if (this._clients.size === 0) {
			this._node.scrollTo = this._originalScrollTo;
			this._node.scrollBy = this._originalScrollBy;
			this._node.scroll = this._originalScroll;
			this._node.removeEventListener("scroll", this._checkForArrival);
		}
		return null;
	}
	_attach(client) {
		this._clients.add(client);
		/**
		* The node should only have the methods shimmed when adding the first
		* client – otherwise it's redundant
		*/
		if (this._clients.size === 1) {
			this._node.scrollTo = this.scrollTo;
			this._node.scrollBy = this.scrollBy;
			this._node.scroll = this.scrollTo;
			this._node.addEventListener("scroll", this._checkForArrival);
		}
	}
};
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (!!importerUrl) for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/shared/SizeCache.js
var SizeCache;
var init_SizeCache = __esmMin((() => {
	SizeCache = class {
		constructor(config) {
			this._map = /* @__PURE__ */ new Map();
			this._roundAverageSize = false;
			this.totalSize = 0;
			if (config?.roundAverageSize === true) this._roundAverageSize = true;
		}
		set(index, value) {
			const prev = this._map.get(index) || 0;
			this._map.set(index, value);
			this.totalSize += value - prev;
		}
		get averageSize() {
			if (this._map.size > 0) {
				const average = this.totalSize / this._map.size;
				return this._roundAverageSize ? Math.round(average) : average;
			}
			return 0;
		}
		getSize(index) {
			return this._map.get(index);
		}
		clear() {
			this._map.clear();
			this.totalSize = 0;
		}
	};
}));
//#endregion
//#region node_modules/@lit-labs/virtualizer/layouts/flow.js
var flow_exports = /* @__PURE__ */ __exportAll({
	FlowLayout: () => FlowLayout,
	flow: () => flow
});
function leadingMargin(direction) {
	return direction === "horizontal" ? "marginLeft" : "marginTop";
}
function trailingMargin(direction) {
	return direction === "horizontal" ? "marginRight" : "marginBottom";
}
function offset(direction) {
	return direction === "horizontal" ? "xOffset" : "yOffset";
}
function collapseMargins(a, b) {
	const m = [a, b].sort();
	return m[1] <= 0 ? Math.min(...m) : m[0] >= 0 ? Math.max(...m) : m[0] + m[1];
}
var flow, MetricsCache, FlowLayout;
var init_flow = __esmMin((() => {
	init_SizeCache();
	init_BaseLayout();
	flow = (config) => Object.assign({ type: FlowLayout }, config);
	MetricsCache = class {
		constructor() {
			this._childSizeCache = new SizeCache();
			this._marginSizeCache = new SizeCache();
			this._metricsCache = /* @__PURE__ */ new Map();
		}
		update(metrics, direction) {
			const marginsToUpdate = /* @__PURE__ */ new Set();
			Object.keys(metrics).forEach((key) => {
				const k = Number(key);
				this._metricsCache.set(k, metrics[k]);
				this._childSizeCache.set(k, metrics[k][dim1(direction)]);
				marginsToUpdate.add(k);
				marginsToUpdate.add(k + 1);
			});
			for (const k of marginsToUpdate) {
				const a = this._metricsCache.get(k)?.[leadingMargin(direction)] || 0;
				const b = this._metricsCache.get(k - 1)?.[trailingMargin(direction)] || 0;
				this._marginSizeCache.set(k, collapseMargins(a, b));
			}
		}
		get averageChildSize() {
			return this._childSizeCache.averageSize;
		}
		get totalChildSize() {
			return this._childSizeCache.totalSize;
		}
		get averageMarginSize() {
			return this._marginSizeCache.averageSize;
		}
		get totalMarginSize() {
			return this._marginSizeCache.totalSize;
		}
		getLeadingMarginValue(index, direction) {
			return this._metricsCache.get(index)?.[leadingMargin(direction)] || 0;
		}
		getChildSize(index) {
			return this._childSizeCache.getSize(index);
		}
		getMarginSize(index) {
			return this._marginSizeCache.getSize(index);
		}
		clear() {
			this._childSizeCache.clear();
			this._marginSizeCache.clear();
			this._metricsCache.clear();
		}
	};
	FlowLayout = class extends BaseLayout {
		constructor() {
			super(...arguments);
			/**
			* Initial estimate of item size
			*/
			this._itemSize = {
				width: 100,
				height: 100
			};
			/**
			* Indices of children mapped to their (position and length) in the scrolling
			* direction. Used to keep track of children that are in range.
			*/
			this._physicalItems = /* @__PURE__ */ new Map();
			/**
			* Used in tandem with _physicalItems to track children in range across
			* reflows.
			*/
			this._newPhysicalItems = /* @__PURE__ */ new Map();
			/**
			* Width and height of children by their index.
			*/
			this._metricsCache = new MetricsCache();
			/**
			* anchorIdx is the anchor around which we reflow. It is designed to allow
			* jumping to any point of the scroll size. We choose it once and stick with
			* it until stable. _first and _last are deduced around it.
			*/
			this._anchorIdx = null;
			/**
			* Position in the scrolling direction of the anchor child.
			*/
			this._anchorPos = null;
			/**
			* Whether all children in range were in range during the previous reflow.
			*/
			this._stable = true;
			this._measureChildren = true;
			this._estimate = true;
		}
		get measureChildren() {
			return this._measureChildren;
		}
		/**
		* Determine the average size of all children represented in the sizes
		* argument.
		*/
		updateItemSizes(sizes) {
			this._metricsCache.update(sizes, this.direction);
			this._scheduleReflow();
		}
		/**
		* Set the average item size based on the total length and number of children
		* in range.
		*/
		_getPhysicalItem(idx) {
			return this._newPhysicalItems.get(idx) ?? this._physicalItems.get(idx);
		}
		_getSize(idx) {
			return this._getPhysicalItem(idx) && this._metricsCache.getChildSize(idx);
		}
		_getAverageSize() {
			return this._metricsCache.averageChildSize || this._itemSize[this._sizeDim];
		}
		_estimatePosition(idx) {
			const c = this._metricsCache;
			if (this._first === -1 || this._last === -1) return c.averageMarginSize + idx * (c.averageMarginSize + this._getAverageSize());
			else if (idx < this._first) {
				const delta = this._first - idx;
				return this._getPhysicalItem(this._first).pos - (c.getMarginSize(this._first - 1) || c.averageMarginSize) - (delta * c.averageChildSize + (delta - 1) * c.averageMarginSize);
			} else {
				const delta = idx - this._last;
				return this._getPhysicalItem(this._last).pos + (c.getChildSize(this._last) || c.averageChildSize) + (c.getMarginSize(this._last) || c.averageMarginSize) + delta * (c.averageChildSize + c.averageMarginSize);
			}
		}
		/**
		* Returns the position in the scrolling direction of the item at idx.
		* Estimates it if the item at idx is not in the DOM.
		*/
		_getPosition(idx) {
			const item = this._getPhysicalItem(idx);
			const { averageMarginSize } = this._metricsCache;
			return idx === 0 ? this._metricsCache.getMarginSize(0) ?? averageMarginSize : item ? item.pos : this._estimatePosition(idx);
		}
		_calculateAnchor(lower, upper) {
			if (lower <= 0) return 0;
			if (upper > this._scrollSize - this._viewDim1) return this.items.length - 1;
			return Math.max(0, Math.min(this.items.length - 1, Math.floor((lower + upper) / 2 / this._delta)));
		}
		_getAnchor(lower, upper) {
			if (this._physicalItems.size === 0) return this._calculateAnchor(lower, upper);
			if (this._first < 0) return this._calculateAnchor(lower, upper);
			if (this._last < 0) return this._calculateAnchor(lower, upper);
			const firstItem = this._getPhysicalItem(this._first), lastItem = this._getPhysicalItem(this._last), firstMin = firstItem.pos;
			if (lastItem.pos + this._metricsCache.getChildSize(this._last) < lower) return this._calculateAnchor(lower, upper);
			if (firstMin > upper) return this._calculateAnchor(lower, upper);
			let candidateIdx = this._firstVisible - 1;
			let cMax = -Infinity;
			while (cMax < lower) cMax = this._getPhysicalItem(++candidateIdx).pos + this._metricsCache.getChildSize(candidateIdx);
			return candidateIdx;
		}
		/**
		* Updates _first and _last based on items that should be in the current
		* viewed range.
		*/
		_getActiveItems() {
			if (this._viewDim1 === 0 || this.items.length === 0) this._clearItems();
			else this._getItems();
		}
		/**
		* Sets the range to empty.
		*/
		_clearItems() {
			this._first = -1;
			this._last = -1;
			this._physicalMin = 0;
			this._physicalMax = 0;
			const items = this._newPhysicalItems;
			this._newPhysicalItems = this._physicalItems;
			this._newPhysicalItems.clear();
			this._physicalItems = items;
			this._stable = true;
		}
		_getItems() {
			const items = this._newPhysicalItems;
			this._stable = true;
			let lower, upper;
			if (this.pin !== null) {
				const { index } = this.pin;
				this._anchorIdx = index;
				this._anchorPos = this._getPosition(index);
			}
			lower = this._scrollPosition - this._overhang;
			upper = this._scrollPosition + this._viewDim1 + this._overhang;
			if (upper < 0 || lower > this._scrollSize) {
				this._clearItems();
				return;
			}
			if (this._anchorIdx === null || this._anchorPos === null) {
				this._anchorIdx = this._getAnchor(lower, upper);
				this._anchorPos = this._getPosition(this._anchorIdx);
			}
			let anchorSize = this._getSize(this._anchorIdx);
			if (anchorSize === void 0) {
				this._stable = false;
				anchorSize = this._getAverageSize();
			}
			const anchorLeadingMargin = this._metricsCache.getMarginSize(this._anchorIdx) ?? this._metricsCache.averageMarginSize;
			const anchorTrailingMargin = this._metricsCache.getMarginSize(this._anchorIdx + 1) ?? this._metricsCache.averageMarginSize;
			if (this._anchorIdx === 0) this._anchorPos = anchorLeadingMargin;
			if (this._anchorIdx === this.items.length - 1) this._anchorPos = this._scrollSize - anchorTrailingMargin - anchorSize;
			let anchorErr = 0;
			if (this._anchorPos + anchorSize + anchorTrailingMargin < lower) anchorErr = lower - (this._anchorPos + anchorSize + anchorTrailingMargin);
			if (this._anchorPos - anchorLeadingMargin > upper) anchorErr = upper - (this._anchorPos - anchorLeadingMargin);
			if (anchorErr) {
				this._scrollPosition -= anchorErr;
				lower -= anchorErr;
				upper -= anchorErr;
				this._scrollError += anchorErr;
			}
			items.set(this._anchorIdx, {
				pos: this._anchorPos,
				size: anchorSize
			});
			this._first = this._last = this._anchorIdx;
			this._physicalMin = this._anchorPos - anchorLeadingMargin;
			this._physicalMax = this._anchorPos + anchorSize + anchorTrailingMargin;
			while (this._physicalMin > lower && this._first > 0) {
				let size = this._getSize(--this._first);
				if (size === void 0) {
					this._stable = false;
					size = this._getAverageSize();
				}
				let margin = this._metricsCache.getMarginSize(this._first);
				if (margin === void 0) {
					this._stable = false;
					margin = this._metricsCache.averageMarginSize;
				}
				this._physicalMin -= size;
				const pos = this._physicalMin;
				items.set(this._first, {
					pos,
					size
				});
				this._physicalMin -= margin;
				if (this._stable === false && this._estimate === false) break;
			}
			while (this._physicalMax < upper && this._last < this.items.length - 1) {
				let size = this._getSize(++this._last);
				if (size === void 0) {
					this._stable = false;
					size = this._getAverageSize();
				}
				let margin = this._metricsCache.getMarginSize(this._last);
				if (margin === void 0) {
					this._stable = false;
					margin = this._metricsCache.averageMarginSize;
				}
				const pos = this._physicalMax;
				items.set(this._last, {
					pos,
					size
				});
				this._physicalMax += size + margin;
				if (!this._stable && !this._estimate) break;
			}
			const extentErr = this._calculateError();
			if (extentErr) {
				this._physicalMin -= extentErr;
				this._physicalMax -= extentErr;
				this._anchorPos -= extentErr;
				this._scrollPosition -= extentErr;
				items.forEach((item) => item.pos -= extentErr);
				this._scrollError += extentErr;
			}
			if (this._stable) {
				this._newPhysicalItems = this._physicalItems;
				this._newPhysicalItems.clear();
				this._physicalItems = items;
			}
		}
		_calculateError() {
			if (this._first === 0) return this._physicalMin;
			else if (this._physicalMin <= 0) return this._physicalMin - this._first * this._delta;
			else if (this._last === this.items.length - 1) return this._physicalMax - this._scrollSize;
			else if (this._physicalMax >= this._scrollSize) return this._physicalMax - this._scrollSize + (this.items.length - 1 - this._last) * this._delta;
			return 0;
		}
		_reflow() {
			const { _first, _last } = this;
			super._reflow();
			if (this._first === -1 && this._last == -1 || this._first === _first && this._last === _last) this._resetReflowState();
		}
		_resetReflowState() {
			this._anchorIdx = null;
			this._anchorPos = null;
			this._stable = true;
		}
		_updateScrollSize() {
			const { averageMarginSize } = this._metricsCache;
			this._scrollSize = Math.max(1, this.items.length * (averageMarginSize + this._getAverageSize()) + averageMarginSize);
		}
		/**
		* Returns the average size (precise or estimated) of an item in the scrolling direction,
		* including any surrounding space.
		*/
		get _delta() {
			const { averageMarginSize } = this._metricsCache;
			return this._getAverageSize() + averageMarginSize;
		}
		/**
		* Returns the top and left positioning of the item at idx.
		*/
		_getItemPosition(idx) {
			return {
				[this._positionDim]: this._getPosition(idx),
				[this._secondaryPositionDim]: 0,
				[offset(this.direction)]: -(this._metricsCache.getLeadingMarginValue(idx, this.direction) ?? this._metricsCache.averageMarginSize)
			};
		}
		/**
		* Returns the height and width of the item at idx.
		*/
		_getItemSize(idx) {
			return {
				[this._sizeDim]: this._getSize(idx) || this._getAverageSize(),
				[this._secondarySizeDim]: this._itemSize[this._secondarySizeDim]
			};
		}
		_viewDim2Changed() {
			this._metricsCache.clear();
			this._scheduleReflow();
		}
	};
}));
//#endregion
//#region node_modules/@lit-labs/virtualizer/Virtualizer.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var _ResizeObserver = typeof window !== "undefined" ? window.ResizeObserver : void 0;
var virtualizerRef = Symbol("virtualizerRef");
var SIZER_ATTRIBUTE = "virtualizer-sizer";
var DefaultLayoutConstructor;
/**
* Provides virtual scrolling boilerplate.
*
* Extensions of this class must set hostElement and layout.
*
* Extensions of this class must also override VirtualRepeater's DOM
* manipulation methods.
*/
var Virtualizer = class {
	constructor(config) {
		this._benchmarkStart = null;
		this._layout = null;
		this._clippingAncestors = [];
		/**
		* Layout provides these values, we set them on _render().
		* TODO @straversi: Can we find an XOR type, usable for the key here?
		*/
		this._scrollSize = null;
		/**
		* Difference between scroll target's current and required scroll offsets.
		* Provided by layout.
		*/
		this._scrollError = null;
		/**
		* A list of the positions (top, left) of the children in the current range.
		*/
		this._childrenPos = null;
		this._childMeasurements = null;
		this._toBeMeasured = /* @__PURE__ */ new Map();
		this._rangeChanged = true;
		this._itemsChanged = true;
		this._visibilityChanged = true;
		this._scrollerController = null;
		this._isScroller = false;
		this._sizer = null;
		/**
		* Resize observer attached to hostElement.
		*/
		this._hostElementRO = null;
		/**
		* Resize observer attached to children.
		*/
		this._childrenRO = null;
		this._mutationObserver = null;
		this._scrollEventListeners = [];
		this._scrollEventListenerOptions = { passive: true };
		this._loadListener = this._childLoaded.bind(this);
		/**
		* Index of element to scroll into view, plus scroll
		* behavior options, as imperatively specified via
		* `element(index).scrollIntoView()`
		*/
		this._scrollIntoViewTarget = null;
		this._updateScrollIntoViewCoordinates = null;
		/**
		* Items to render. Set by items.
		*/
		this._items = [];
		/**
		* Index of the first child in the range, not necessarily the first visible child.
		* TODO @straversi: Consider renaming these.
		*/
		this._first = -1;
		/**
		* Index of the last child in the range.
		*/
		this._last = -1;
		/**
		* Index of the first item intersecting the viewport.
		*/
		this._firstVisible = -1;
		/**
		* Index of the last item intersecting the viewport.
		*/
		this._lastVisible = -1;
		this._scheduled = /* @__PURE__ */ new WeakSet();
		/**
		* Invoked at the end of each render cycle: children in the range are
		* measured, and their dimensions passed to this callback. Use it to layout
		* children as needed.
		*/
		this._measureCallback = null;
		this._measureChildOverride = null;
		/**
		* State for `layoutComplete` promise
		*/
		this._layoutCompletePromise = null;
		this._layoutCompleteResolver = null;
		this._layoutCompleteRejecter = null;
		this._pendingLayoutComplete = null;
		/**
		* Layout initialization is async because we dynamically load
		* the default layout if none is specified. This state is to track
		* whether init is complete.
		*/
		this._layoutInitialized = null;
		/**
		* Track connection state to guard against errors / unnecessary work
		*/
		this._connected = false;
		if (!config) throw new Error("Virtualizer constructor requires a configuration object");
		if (config.hostElement) this._init(config);
		else throw new Error("Virtualizer configuration requires the \"hostElement\" property");
	}
	set items(items) {
		if (Array.isArray(items) && items !== this._items) {
			this._itemsChanged = true;
			this._items = items;
			this._schedule(this._updateLayout);
		}
	}
	_init(config) {
		this._isScroller = !!config.scroller;
		this._initHostElement(config);
		const layoutConfig = config.layout || {};
		this._layoutInitialized = this._initLayout(layoutConfig);
	}
	_initObservers() {
		this._mutationObserver = new MutationObserver(this._finishDOMUpdate.bind(this));
		this._hostElementRO = new _ResizeObserver(() => this._hostElementSizeChanged());
		this._childrenRO = new _ResizeObserver(this._childrenSizeChanged.bind(this));
	}
	_initHostElement(config) {
		const hostElement = this._hostElement = config.hostElement;
		this._applyVirtualizerStyles();
		hostElement[virtualizerRef] = this;
	}
	connected() {
		this._initObservers();
		const includeSelf = this._isScroller;
		this._clippingAncestors = getClippingAncestors(this._hostElement, includeSelf);
		this._scrollerController = new ScrollerController(this, this._clippingAncestors[0]);
		this._schedule(this._updateLayout);
		this._observeAndListen();
		this._connected = true;
	}
	_observeAndListen() {
		this._mutationObserver.observe(this._hostElement, { childList: true });
		this._hostElementRO.observe(this._hostElement);
		this._scrollEventListeners.push(window);
		window.addEventListener("scroll", this, this._scrollEventListenerOptions);
		this._clippingAncestors.forEach((ancestor) => {
			ancestor.addEventListener("scroll", this, this._scrollEventListenerOptions);
			this._scrollEventListeners.push(ancestor);
			this._hostElementRO.observe(ancestor);
		});
		this._hostElementRO.observe(this._scrollerController.element);
		this._children.forEach((child) => this._childrenRO.observe(child));
		this._scrollEventListeners.forEach((target) => target.addEventListener("scroll", this, this._scrollEventListenerOptions));
	}
	disconnected() {
		this._scrollEventListeners.forEach((target) => target.removeEventListener("scroll", this, this._scrollEventListenerOptions));
		this._scrollEventListeners = [];
		this._clippingAncestors = [];
		this._scrollerController?.detach(this);
		this._scrollerController = null;
		this._mutationObserver?.disconnect();
		this._mutationObserver = null;
		this._hostElementRO?.disconnect();
		this._hostElementRO = null;
		this._childrenRO?.disconnect();
		this._childrenRO = null;
		this._rejectLayoutCompletePromise("disconnected");
		this._connected = false;
	}
	_applyVirtualizerStyles() {
		const style = this._hostElement.style;
		style.display = style.display || "block";
		style.position = style.position || "relative";
		style.contain = style.contain || "size layout";
		if (this._isScroller) {
			style.overflow = style.overflow || "auto";
			style.minHeight = style.minHeight || "150px";
		}
	}
	_getSizer() {
		const hostElement = this._hostElement;
		if (!this._sizer) {
			let sizer = hostElement.querySelector(`[${SIZER_ATTRIBUTE}]`);
			if (!sizer) {
				sizer = document.createElement("div");
				sizer.setAttribute(SIZER_ATTRIBUTE, "");
				hostElement.appendChild(sizer);
			}
			Object.assign(sizer.style, {
				position: "absolute",
				margin: "-2px 0 0 0",
				padding: 0,
				visibility: "hidden",
				fontSize: "2px"
			});
			sizer.textContent = "&nbsp;";
			sizer.setAttribute(SIZER_ATTRIBUTE, "");
			this._sizer = sizer;
		}
		return this._sizer;
	}
	async updateLayoutConfig(layoutConfig) {
		await this._layoutInitialized;
		const Ctor = layoutConfig.type || DefaultLayoutConstructor;
		if (typeof Ctor === "function" && this._layout instanceof Ctor) {
			const config = { ...layoutConfig };
			delete config.type;
			this._layout.config = config;
			return true;
		}
		return false;
	}
	async _initLayout(layoutConfig) {
		let config;
		let Ctor;
		if (typeof layoutConfig.type === "function") {
			Ctor = layoutConfig.type;
			const copy = { ...layoutConfig };
			delete copy.type;
			config = copy;
		} else config = layoutConfig;
		if (Ctor === void 0) DefaultLayoutConstructor = Ctor = (await __vitePreload(async () => {
			const { FlowLayout } = await Promise.resolve().then(() => (init_flow(), flow_exports));
			return { FlowLayout };
		}, void 0)).FlowLayout;
		this._layout = new Ctor((message) => this._handleLayoutMessage(message), config);
		if (this._layout.measureChildren && typeof this._layout.updateItemSizes === "function") {
			if (typeof this._layout.measureChildren === "function") this._measureChildOverride = this._layout.measureChildren;
			this._measureCallback = this._layout.updateItemSizes.bind(this._layout);
		}
		if (this._layout.listenForChildLoadEvents) this._hostElement.addEventListener("load", this._loadListener, true);
		this._schedule(this._updateLayout);
	}
	startBenchmarking() {
		if (this._benchmarkStart === null) this._benchmarkStart = window.performance.now();
	}
	stopBenchmarking() {
		if (this._benchmarkStart !== null) {
			const now = window.performance.now();
			const timeElapsed = now - this._benchmarkStart;
			const virtualizationTime = performance.getEntriesByName("uv-virtualizing", "measure").filter((e) => e.startTime >= this._benchmarkStart && e.startTime < now).reduce((t, m) => t + m.duration, 0);
			this._benchmarkStart = null;
			return {
				timeElapsed,
				virtualizationTime
			};
		}
		return null;
	}
	_measureChildren() {
		const mm = {};
		const children = this._children;
		const fn = this._measureChildOverride || this._measureChild;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const idx = this._first + i;
			if (this._itemsChanged || this._toBeMeasured.has(child)) mm[idx] = fn.call(this, child, this._items[idx]);
		}
		this._childMeasurements = mm;
		this._schedule(this._updateLayout);
		this._toBeMeasured.clear();
	}
	/**
	* Returns the width, height, and margins of the given child.
	*/
	_measureChild(element) {
		const { width, height } = element.getBoundingClientRect();
		return Object.assign({
			width,
			height
		}, getMargins(element));
	}
	async _schedule(method) {
		if (!this._scheduled.has(method)) {
			this._scheduled.add(method);
			await Promise.resolve();
			this._scheduled.delete(method);
			method.call(this);
		}
	}
	async _updateDOM(state) {
		this._scrollSize = state.scrollSize;
		this._adjustRange(state.range);
		this._childrenPos = state.childPositions;
		this._scrollError = state.scrollError || null;
		const { _rangeChanged, _itemsChanged } = this;
		if (this._visibilityChanged) {
			this._notifyVisibility();
			this._visibilityChanged = false;
		}
		if (_rangeChanged || _itemsChanged) {
			this._notifyRange();
			this._rangeChanged = false;
		}
		this._finishDOMUpdate();
	}
	_finishDOMUpdate() {
		if (this._connected) {
			this._children.forEach((child) => this._childrenRO.observe(child));
			this._checkScrollIntoViewTarget(this._childrenPos);
			this._positionChildren(this._childrenPos);
			this._sizeHostElement(this._scrollSize);
			this._correctScrollError();
			if (this._benchmarkStart && "mark" in window.performance) window.performance.mark("uv-end");
		}
	}
	_updateLayout() {
		if (this._layout && this._connected) {
			this._layout.items = this._items;
			this._updateView();
			if (this._childMeasurements !== null) {
				if (this._measureCallback) this._measureCallback(this._childMeasurements);
				this._childMeasurements = null;
			}
			this._layout.reflowIfNeeded();
			if (this._benchmarkStart && "mark" in window.performance) window.performance.mark("uv-end");
		}
	}
	_handleScrollEvent() {
		if (this._benchmarkStart && "mark" in window.performance) {
			try {
				window.performance.measure("uv-virtualizing", "uv-start", "uv-end");
			} catch (e) {
				console.warn("Error measuring performance data: ", e);
			}
			window.performance.mark("uv-start");
		}
		if (this._scrollerController.correctingScrollError === false) this._layout?.unpin();
		this._schedule(this._updateLayout);
	}
	handleEvent(event) {
		switch (event.type) {
			case "scroll":
				if (event.currentTarget === window || this._clippingAncestors.includes(event.currentTarget)) this._handleScrollEvent();
				break;
			default: console.warn("event not handled", event);
		}
	}
	_handleLayoutMessage(message) {
		if (message.type === "stateChanged") this._updateDOM(message);
		else if (message.type === "visibilityChanged") {
			this._firstVisible = message.firstVisible;
			this._lastVisible = message.lastVisible;
			this._notifyVisibility();
		} else if (message.type === "unpinned") this._hostElement.dispatchEvent(new UnpinnedEvent());
	}
	get _children() {
		const arr = [];
		let next = this._hostElement.firstElementChild;
		while (next) {
			if (!next.hasAttribute(SIZER_ATTRIBUTE)) arr.push(next);
			next = next.nextElementSibling;
		}
		return arr;
	}
	_updateView() {
		const hostElement = this._hostElement;
		const scrollingElement = this._scrollerController?.element;
		const layout = this._layout;
		if (hostElement && scrollingElement && layout) {
			let top, left, bottom, right;
			const hostElementBounds = hostElement.getBoundingClientRect();
			top = 0;
			left = 0;
			bottom = window.innerHeight;
			right = window.innerWidth;
			const ancestorBounds = this._clippingAncestors.map((ancestor) => ancestor.getBoundingClientRect());
			ancestorBounds.unshift(hostElementBounds);
			for (const bounds of ancestorBounds) {
				top = Math.max(top, bounds.top);
				left = Math.max(left, bounds.left);
				bottom = Math.min(bottom, bounds.bottom);
				right = Math.min(right, bounds.right);
			}
			const scrollingElementBounds = scrollingElement.getBoundingClientRect();
			const offsetWithinScroller = {
				left: hostElementBounds.left - scrollingElementBounds.left,
				top: hostElementBounds.top - scrollingElementBounds.top
			};
			const totalScrollSize = {
				width: scrollingElement.scrollWidth,
				height: scrollingElement.scrollHeight
			};
			const scrollTop = top - hostElementBounds.top + hostElement.scrollTop;
			const scrollLeft = left - hostElementBounds.left + hostElement.scrollLeft;
			const height = Math.max(0, bottom - top);
			layout.viewportSize = {
				width: Math.max(0, right - left),
				height
			};
			layout.viewportScroll = {
				top: scrollTop,
				left: scrollLeft
			};
			layout.totalScrollSize = totalScrollSize;
			layout.offsetWithinScroller = offsetWithinScroller;
		}
	}
	/**
	* Styles the host element so that its size reflects the
	* total size of all items.
	*/
	_sizeHostElement(size) {
		const max = 82e5;
		const h = size && size.width !== null ? Math.min(max, size.width) : 0;
		const v = size && size.height !== null ? Math.min(max, size.height) : 0;
		if (this._isScroller) this._getSizer().style.transform = `translate(${h}px, ${v}px)`;
		else {
			const style = this._hostElement.style;
			style.minWidth = h ? `${h}px` : "100%";
			style.minHeight = v ? `${v}px` : "100%";
		}
	}
	/**
	* Sets the top and left transform style of the children from the values in
	* pos.
	*/
	_positionChildren(pos) {
		if (pos) pos.forEach(({ top, left, width, height, xOffset, yOffset }, index) => {
			const child = this._children[index - this._first];
			if (child) {
				child.style.position = "absolute";
				child.style.boxSizing = "border-box";
				child.style.transform = `translate(${left}px, ${top}px)`;
				if (width !== void 0) child.style.width = width + "px";
				if (height !== void 0) child.style.height = height + "px";
				child.style.left = xOffset === void 0 ? null : xOffset + "px";
				child.style.top = yOffset === void 0 ? null : yOffset + "px";
			}
		});
	}
	async _adjustRange(range) {
		const { _first, _last, _firstVisible, _lastVisible } = this;
		this._first = range.first;
		this._last = range.last;
		this._firstVisible = range.firstVisible;
		this._lastVisible = range.lastVisible;
		this._rangeChanged = this._rangeChanged || this._first !== _first || this._last !== _last;
		this._visibilityChanged = this._visibilityChanged || this._firstVisible !== _firstVisible || this._lastVisible !== _lastVisible;
	}
	_correctScrollError() {
		if (this._scrollError) {
			const { scrollTop, scrollLeft } = this._scrollerController;
			const { top, left } = this._scrollError;
			this._scrollError = null;
			this._scrollerController.correctScrollError({
				top: scrollTop - top,
				left: scrollLeft - left
			});
		}
	}
	element(index) {
		if (index === Infinity) index = this._items.length - 1;
		return this._items?.[index] === void 0 ? void 0 : { scrollIntoView: (options = {}) => this._scrollElementIntoView({
			...options,
			index
		}) };
	}
	_scrollElementIntoView(options) {
		if (options.index >= this._first && options.index <= this._last) this._children[options.index - this._first].scrollIntoView(options);
		else {
			options.index = Math.min(options.index, this._items.length - 1);
			if (options.behavior === "smooth") {
				const coordinates = this._layout.getScrollIntoViewCoordinates(options);
				const { behavior } = options;
				this._updateScrollIntoViewCoordinates = this._scrollerController.managedScrollTo(Object.assign(coordinates, { behavior }), () => this._layout.getScrollIntoViewCoordinates(options), () => this._scrollIntoViewTarget = null);
				this._scrollIntoViewTarget = options;
			} else this._layout.pin = options;
		}
	}
	/**
	* If we are smoothly scrolling to an element and the target element
	* is in the DOM, we update our target coordinates as needed
	*/
	_checkScrollIntoViewTarget(pos) {
		const { index } = this._scrollIntoViewTarget || {};
		if (index && pos?.has(index)) this._updateScrollIntoViewCoordinates(this._layout.getScrollIntoViewCoordinates(this._scrollIntoViewTarget));
	}
	/**
	* Emits a rangechange event with the current first, last, firstVisible, and
	* lastVisible.
	*/
	_notifyRange() {
		this._hostElement.dispatchEvent(new RangeChangedEvent({
			first: this._first,
			last: this._last
		}));
	}
	_notifyVisibility() {
		this._hostElement.dispatchEvent(new VisibilityChangedEvent({
			first: this._firstVisible,
			last: this._lastVisible
		}));
	}
	get layoutComplete() {
		if (!this._layoutCompletePromise) this._layoutCompletePromise = new Promise((resolve, reject) => {
			this._layoutCompleteResolver = resolve;
			this._layoutCompleteRejecter = reject;
		});
		return this._layoutCompletePromise;
	}
	_rejectLayoutCompletePromise(reason) {
		if (this._layoutCompleteRejecter !== null) this._layoutCompleteRejecter(reason);
		this._resetLayoutCompleteState();
	}
	_scheduleLayoutComplete() {
		if (this._layoutCompletePromise && this._pendingLayoutComplete === null) this._pendingLayoutComplete = requestAnimationFrame(() => requestAnimationFrame(() => this._resolveLayoutCompletePromise()));
	}
	_resolveLayoutCompletePromise() {
		if (this._layoutCompleteResolver !== null) this._layoutCompleteResolver();
		this._resetLayoutCompleteState();
	}
	_resetLayoutCompleteState() {
		this._layoutCompletePromise = null;
		this._layoutCompleteResolver = null;
		this._layoutCompleteRejecter = null;
		this._pendingLayoutComplete = null;
	}
	/**
	* Render and update the view at the next opportunity with the given
	* hostElement size.
	*/
	_hostElementSizeChanged() {
		this._schedule(this._updateLayout);
	}
	_childLoaded() {}
	_childrenSizeChanged(changes) {
		if (this._layout?.measureChildren) {
			for (const change of changes) this._toBeMeasured.set(change.target, change.contentRect);
			this._measureChildren();
		}
		this._scheduleLayoutComplete();
		this._itemsChanged = false;
		this._rangeChanged = false;
	}
};
function getMargins(el) {
	const style = window.getComputedStyle(el);
	return {
		marginTop: getMarginValue(style.marginTop),
		marginRight: getMarginValue(style.marginRight),
		marginBottom: getMarginValue(style.marginBottom),
		marginLeft: getMarginValue(style.marginLeft)
	};
}
function getMarginValue(value) {
	const float = value ? parseFloat(value) : NaN;
	return Number.isNaN(float) ? 0 : float;
}
function getParentElement(el) {
	if (el.assignedSlot !== null) return el.assignedSlot;
	if (el.parentElement !== null) return el.parentElement;
	const parentNode = el.parentNode;
	if (parentNode && parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return parentNode.host || null;
	return null;
}
function getElementAncestors(el, includeSelf = false) {
	const ancestors = [];
	let parent = includeSelf ? el : getParentElement(el);
	while (parent !== null) {
		ancestors.push(parent);
		parent = getParentElement(parent);
	}
	return ancestors;
}
function getClippingAncestors(el, includeSelf = false) {
	let foundFixed = false;
	return getElementAncestors(el, includeSelf).filter((a) => {
		if (foundFixed) return false;
		const style = getComputedStyle(a);
		foundFixed = style.position === "fixed";
		return style.overflow !== "visible";
	});
}
//#endregion
//#region node_modules/@lit-labs/virtualizer/virtualize.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var defaultKeyFunction = (item) => item;
var defaultRenderItem = (item, idx) => x`${idx}: ${JSON.stringify(item, null, 2)}`;
var VirtualizeDirective = class extends f {
	constructor(part) {
		super(part);
		this._virtualizer = null;
		this._first = 0;
		this._last = -1;
		this._renderItem = (item, idx) => defaultRenderItem(item, idx + this._first);
		this._keyFunction = (item, idx) => defaultKeyFunction(item, idx + this._first);
		this._items = [];
		if (part.type !== t$1.CHILD) throw new Error("The virtualize directive can only be used in child expressions");
	}
	render(config) {
		if (config) this._setFunctions(config);
		const itemsToRender = [];
		if (this._first >= 0 && this._last >= this._first) for (let i = this._first; i <= this._last; i++) itemsToRender.push(this._items[i]);
		return c(itemsToRender, this._keyFunction, this._renderItem);
	}
	update(part, [config]) {
		this._setFunctions(config);
		const itemsChanged = this._items !== config.items;
		this._items = config.items || [];
		if (this._virtualizer) this._updateVirtualizerConfig(part, config);
		else this._initialize(part, config);
		return itemsChanged ? T : this.render();
	}
	async _updateVirtualizerConfig(part, config) {
		if (!await this._virtualizer.updateLayoutConfig(config.layout || {})) {
			const hostElement = part.parentNode;
			this._makeVirtualizer(hostElement, config);
		}
		this._virtualizer.items = this._items;
	}
	_setFunctions(config) {
		const { renderItem, keyFunction } = config;
		if (renderItem) this._renderItem = (item, idx) => renderItem(item, idx + this._first);
		if (keyFunction) this._keyFunction = (item, idx) => keyFunction(item, idx + this._first);
	}
	_makeVirtualizer(hostElement, config) {
		if (this._virtualizer) this._virtualizer.disconnected();
		const { layout, scroller, items } = config;
		this._virtualizer = new Virtualizer({
			hostElement,
			layout,
			scroller
		});
		this._virtualizer.items = items;
		this._virtualizer.connected();
	}
	_initialize(part, config) {
		const hostElement = part.parentNode;
		if (hostElement && hostElement.nodeType === 1) {
			hostElement.addEventListener("rangeChanged", (e) => {
				this._first = e.first;
				this._last = e.last;
				this.setValue(this.render());
			});
			this._makeVirtualizer(hostElement, config);
		}
	}
	disconnected() {
		this._virtualizer?.disconnected();
	}
	reconnected() {
		this._virtualizer?.connected();
	}
};
var virtualize = e$2(VirtualizeDirective);
//#endregion
//#region node_modules/@lit-labs/virtualizer/LitVirtualizer.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var LitVirtualizer = class extends i$5 {
	constructor() {
		super(...arguments);
		this.items = [];
		this.renderItem = defaultRenderItem;
		this.keyFunction = defaultKeyFunction;
		this.layout = {};
		this.scroller = false;
	}
	createRenderRoot() {
		return this;
	}
	render() {
		const { items, renderItem, keyFunction, layout, scroller } = this;
		return x`${virtualize({
			items,
			renderItem,
			keyFunction,
			layout,
			scroller
		})}`;
	}
	element(index) {
		return this[virtualizerRef]?.element(index);
	}
	get layoutComplete() {
		return this[virtualizerRef]?.layoutComplete;
	}
	/**
	* This scrollToIndex() shim is here to provide backwards compatibility with other 0.x versions of
	* lit-virtualizer. It is deprecated and will likely be removed in the 1.0.0 release.
	*/
	scrollToIndex(index, position = "start") {
		this.element(index)?.scrollIntoView({ block: position });
	}
};
__decorate([n$5({ attribute: false })], LitVirtualizer.prototype, "items", void 0);
__decorate([n$5()], LitVirtualizer.prototype, "renderItem", void 0);
__decorate([n$5()], LitVirtualizer.prototype, "keyFunction", void 0);
__decorate([n$5({ attribute: false })], LitVirtualizer.prototype, "layout", void 0);
__decorate([n$5({
	reflect: true,
	type: Boolean
})], LitVirtualizer.prototype, "scroller", void 0);
//#endregion
//#region src/upstream/resources/virtualizer.ts
if (!customElements.get("lit-virtualizer")) customElements.define("lit-virtualizer", LitVirtualizer);
//#endregion
//#region src/upstream/util/brands-url.ts
var brandsUrl = (options) => `https://brands.home-assistant.io/_/${options.domain}/${options.darkOptimized ? "dark_" : ""}${options.type}.png`;
var isBrandUrl = (url) => {
	return url?.startsWith("https://brands.home-assistant.io/") ?? false;
};
var extractDomainFromBrandUrl = (url) => {
	return url.match(/brands\.home-assistant\.io\/[^/]+\/([^/]+)\//)?.[1] ?? "";
};
//#endregion
//#region src/upstream/util/documentation-url.ts
var documentationUrl = (_hass, path) => {
	return `https://www.home-assistant.io${path}`;
};
//#endregion
//#region src/upstream/ha-media-player-browse.ts
var MANUAL_ITEM = {
	can_expand: true,
	can_play: false,
	can_search: false,
	children_media_class: "",
	media_class: "app",
	media_content_id: MANUAL_MEDIA_SOURCE_PREFIX,
	media_content_type: "",
	iconPath: mdiKeyboard,
	title: "Manual entry"
};
var HaMediaPlayerBrowse = class HaMediaPlayerBrowse extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.action = "play";
		this.preferredLayout = "auto";
		this.dialog = false;
		this.navigateIds = [];
		this.hideContentType = false;
		this.narrow = false;
		this.scrolled = false;
		this._observed = false;
		this._headerOffsetHeight = 0;
		this._renderGridItem = (child) => {
			const backgroundImage = child.thumbnail ? this._getThumbnailURLorBase64(child.thumbnail).then((value) => `url(${value})`) : "none";
			return renderMediaGridCard({
				item: child,
				onClick: this._childClicked,
				thumbnailContent: child.thumbnail ? x`
            <div
              class="${e({
					"centered-image": ["app", "directory"].includes(child.media_class),
					"brand-image": isBrandUrl(child.thumbnail)
				})} image"
              style="background-image: ${m(backgroundImage, "")}"
            ></div>
          ` : x`
            <div class="icon-holder image">
              <ha-svg-icon
                class=${child.iconPath ? "icon" : "folder"}
                .path=${child.iconPath || MediaClassBrowserSettings[child.media_class === "directory" ? child.children_media_class || child.media_class : child.media_class].icon}
              ></ha-svg-icon>
            </div>
          `,
				actionContent: child.can_play ? x`
            <ha-icon-button
              class="play ${e({ can_expand: child.can_expand })}"
              .item=${child}
              .label=${this.hass.localize(`ui.components.media-browser.${this.action}-media`)}
              .path=${this.action === "play" ? mdiPlay : mdiPlus}
              @click=${this._actionClicked}
            ></ha-icon-button>
          ` : E,
				titleContent: x`
        <ha-tooltip .for="grid-${slugify(child.title)}" distance="-4"> ${child.title} </ha-tooltip>
        <div .id="grid-${slugify(child.title)}" class="title">${child.title}</div>
      `
			});
		};
		this._renderListItem = (child) => {
			const mediaClass = MediaClassBrowserSettings[this._currentItem.media_class];
			const backgroundImage = mediaClass.show_list_images && child.thumbnail ? this._getThumbnailURLorBase64(child.thumbnail).then((value) => `url(${value})`) : "none";
			return x`
      <ha-list-item @click=${this._childClicked} .item=${child} .graphic=${mediaClass.show_list_images ? "medium" : "avatar"}>
        ${backgroundImage === "none" && !child.can_play ? x`<ha-svg-icon
              .path=${MediaClassBrowserSettings[child.media_class === "directory" ? child.children_media_class || child.media_class : child.media_class].icon}
              slot="graphic"
            ></ha-svg-icon>` : x`<div
              class=${e({
				graphic: true,
				thumbnail: mediaClass.show_list_images === true
			})}
              style="background-image: ${m(backgroundImage, "")}"
              slot="graphic"
            >
              ${child.can_play ? x`<ha-icon-button
                    class="play ${e({ show: !mediaClass.show_list_images || !child.thumbnail })}"
                    .item=${child}
                    .label=${this.hass.localize(`ui.components.media-browser.${this.action}-media`)}
                    .path=${this.action === "play" ? mdiPlay : mdiPlus}
                    @click=${this._actionClicked}
                  ></ha-icon-button>` : E}
            </div>`}
        <span class="title">${child.title}</span>
      </ha-list-item>
    `;
		};
		this._actionClicked = (ev) => {
			ev.stopPropagation();
			const item = ev.currentTarget.item;
			this._runAction(item);
		};
		this._childClicked = async (ev) => {
			const item = ev.currentTarget.item;
			if (!item) return;
			if (!item.can_expand) {
				this._runAction(item);
				return;
			}
			fireEvent(this, "media-browsed", { ids: [...this.navigateIds, item] });
		};
	}
	connectedCallback() {
		super.connectedCallback();
		this.updateComplete.then(() => this._attachResizeObserver());
	}
	getPlayableChildren() {
		if (!this._currentItem?.children) return [];
		return this._currentItem.children.filter((child) => child.can_play);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}
	async refresh() {
		const currentId = this.navigateIds[this.navigateIds.length - 1];
		try {
			this._currentItem = await this._fetchData(this.entityId, currentId.media_content_id, currentId.media_content_type);
			fireEvent(this, "media-browsed", {
				ids: this.navigateIds,
				current: this._currentItem
			});
		} catch (err) {
			this._setError(err);
		}
	}
	play() {
		if (this._currentItem?.can_play) this._runAction(this._currentItem);
	}
	willUpdate(changedProps) {
		super.willUpdate(changedProps);
		if (!this.hasUpdated);
		if (changedProps.has("entityId")) this._setError(void 0);
		else if (!changedProps.has("navigateIds")) return;
		this._setError(void 0);
		const oldNavigateIds = changedProps.get("navigateIds");
		const navigateIds = this.navigateIds;
		this._content?.scrollTo(0, 0);
		this.scrolled = false;
		const oldCurrentItem = this._currentItem;
		const oldParentItem = this._parentItem;
		this._currentItem = void 0;
		this._parentItem = void 0;
		const currentId = navigateIds[navigateIds.length - 1];
		const parentId = navigateIds.length > 1 ? navigateIds[navigateIds.length - 2] : void 0;
		let currentProm;
		let parentProm;
		if (!changedProps.has("entityId")) {
			if (oldNavigateIds && navigateIds.length === oldNavigateIds.length + 1 && oldNavigateIds.every((oldVal, idx) => {
				const curVal = navigateIds[idx];
				return curVal.media_content_id === oldVal.media_content_id && curVal.media_content_type === oldVal.media_content_type;
			})) parentProm = Promise.resolve(oldCurrentItem);
			else if (oldNavigateIds && navigateIds.length === oldNavigateIds.length - 1 && navigateIds.every((curVal, idx) => {
				const oldVal = oldNavigateIds[idx];
				return curVal.media_content_id === oldVal.media_content_id && curVal.media_content_type === oldVal.media_content_type;
			})) currentProm = Promise.resolve(oldParentItem);
		}
		if (currentId.media_content_id && isManualMediaSourceContentId(currentId.media_content_id)) {
			this._currentItem = MANUAL_ITEM;
			fireEvent(this, "media-browsed", {
				ids: navigateIds,
				current: this._currentItem
			});
		} else {
			if (!currentProm) currentProm = this._fetchData(this.entityId, currentId.media_content_id, currentId.media_content_type);
			currentProm.then((item) => {
				this._currentItem = item;
				fireEvent(this, "media-browsed", {
					ids: navigateIds,
					current: item
				});
			}, (err) => {
				if (oldNavigateIds && changedProps.has("entityId") && navigateIds.length === oldNavigateIds.length && oldNavigateIds.every((oldItem, idx) => navigateIds[idx].media_content_id === oldItem.media_content_id && navigateIds[idx].media_content_type === oldItem.media_content_type)) fireEvent(this, "media-browsed", {
					ids: [{
						media_content_id: void 0,
						media_content_type: void 0
					}],
					replace: true
				});
				else if (err.code === "entity_not_found" && this.entityId && isUnavailableState(this.hass.states[this.entityId]?.state)) this._setError({
					message: this.hass.localize(`ui.components.media-browser.media_player_unavailable`),
					code: "entity_not_found"
				});
				else this._setError(err);
			});
		}
		if (!parentProm && parentId !== void 0) parentProm = this._fetchData(this.entityId, parentId.media_content_id, parentId.media_content_type);
		if (parentProm) parentProm.then((parent) => {
			this._parentItem = parent;
		});
	}
	shouldUpdate(changedProps) {
		if (changedProps.size > 1 || !changedProps.has("hass")) return true;
		const oldHass = changedProps.get("hass");
		return oldHass === void 0 || oldHass.localize !== this.hass.localize;
	}
	firstUpdated() {
		this._measureCard();
		this._attachResizeObserver();
	}
	updated(changedProps) {
		super.updated(changedProps);
		if (changedProps.has("_scrolled")) this._animateHeaderHeight();
		else if (changedProps.has("_currentItem")) {
			this._setHeaderHeight();
			if (this._observed) return;
			const virtualizer = this._virtualizer?._virtualizer;
			if (virtualizer) {
				this._observed = true;
				setTimeout(() => virtualizer._observeMutations(), 0);
			}
		}
	}
	render() {
		if (this._error) return x`
        <div class="container">
          <ha-alert alert-type="error"> ${this._renderError(this._error)} </ha-alert>
        </div>
      `;
		if (!this._currentItem) return x`<ha-spinner></ha-spinner>`;
		const currentItem = this._currentItem;
		const subtitle = this.hass.localize(`ui.components.media-browser.class.${currentItem.media_class}`);
		let children = filterOutIgnoredMediaSources(currentItem.children || []);
		const canPlayChildren = /* @__PURE__ */ new Set();
		if (this.accept && children.length > 0) {
			let checks = [];
			for (const type of this.accept) if (type.endsWith("/*")) {
				const baseType = type.slice(0, -1);
				checks.push((t) => t.startsWith(baseType));
			} else if (type === "*") {
				checks = [() => true];
				break;
			} else checks.push((t) => t === type);
			children = children.filter((child) => {
				const contentType = child.media_content_type.toLowerCase();
				const canPlay = child.media_content_type && checks.some((check) => check(contentType));
				if (canPlay) canPlayChildren.add(child.media_content_id);
				return !child.media_content_type || child.can_expand || canPlay;
			});
		}
		const mediaClass = MediaClassBrowserSettings[currentItem.media_class];
		const childrenMediaClass = currentItem.children_media_class ? MediaClassBrowserSettings[currentItem.children_media_class] : MediaClassBrowserSettings.directory;
		const backgroundImage = currentItem.thumbnail ? this._getThumbnailURLorBase64(currentItem.thumbnail).then((value) => `url(${value})`) : "none";
		return x`
              ${currentItem.can_play ? x`
                      <div
                        class="header ${e({
			"no-img": !currentItem.thumbnail,
			"no-dialog": !this.dialog
		})}"
                        @transitionend=${this._setHeaderHeight}
                      >
                        <div class="header-content">
                          ${currentItem.thumbnail ? x`
                                <div class="img" style="background-image: ${m(backgroundImage, "")}">
                                  ${this.narrow && currentItem?.can_play && (!this.accept || canPlayChildren.has(currentItem.media_content_id)) ? x`
                                        <ha-fab mini .item=${currentItem} @click=${this._actionClicked}>
                                          <ha-svg-icon
                                            slot="icon"
                                            .label=${this.hass.localize(`ui.components.media-browser.${this.action}-media`)}
                                            .path=${this.action === "play" ? mdiPlay : mdiPlus}
                                          ></ha-svg-icon>
                                          ${this.hass.localize(`ui.components.media-browser.${this.action}`)}
                                        </ha-fab>
                                      ` : ""}
                                </div>
                              ` : E}
                          <div class="header-info">
                            <div class="breadcrumb">
                              <h1 class="title">${currentItem.title}</h1>
                              ${subtitle ? x` <h2 class="subtitle">${subtitle}</h2> ` : ""}
                            </div>
                            ${currentItem.can_play && (!currentItem.thumbnail || !this.narrow) ? x`
                                  <ha-button .item=${currentItem} @click=${this._actionClicked}>
                                    <ha-svg-icon
                                      .label=${this.hass.localize(`ui.components.media-browser.${this.action}-media`)}
                                      .path=${this.action === "play" ? mdiPlay : mdiPlus}
                                      slot="start"
                                    ></ha-svg-icon>
                                    ${this.hass.localize(`ui.components.media-browser.${this.action}`)}
                                  </ha-button>
                                ` : ""}
                          </div>
                        </div>
                      </div>
                    ` : ""}
          <div
            class="content"
            @scroll=${this._scroll}
            @touchmove=${this._scroll}
          >
            ${this._error ? x`
                    <div class="container">
                      <ha-alert alert-type="error"> ${this._renderError(this._error)} </ha-alert>
                    </div>
                  ` : isManualMediaSourceContentId(currentItem.media_content_id) ? x`<ha-browse-media-manual
                      .item=${{
			media_content_id: this.defaultId || "",
			media_content_type: this.defaultType || ""
		}}
                      .hass=${this.hass}
                      .hideContentType=${this.hideContentType}
                      .contentIdHelper=${this.contentIdHelper}
                      @manual-media-picked=${this._manualPicked}
                    ></ha-browse-media-manual>` : isTTSMediaSource(currentItem.media_content_id) ? x`
                        <ha-browse-media-tts
                          .item=${currentItem}
                          .hass=${this.hass}
                          .action=${this.action}
                          @tts-picked=${this._ttsPicked}
                        ></ha-browse-media-tts>
                      ` : !children.length && !currentItem.not_shown ? x`
                          <div class="container no-items">
                            ${currentItem.media_content_id === "media-source://media_source/local/." ? x`
                                  <div class="highlight-add-button">
                                    <span>
                                      <ha-svg-icon .path=${mdiArrowUpRight}></ha-svg-icon>
                                    </span>
                                    <span> ${this.hass.localize("ui.components.media-browser.file_management.highlight_button")} </span>
                                  </div>
                                ` : this.hass.localize("ui.components.media-browser.no_items")}
                          </div>
                        ` : this.preferredLayout === "list" ? x`
                            <ha-list>
                              <lit-virtualizer
                                scroller
                                .items=${children}
                                style=${o$1({ height: `${children.length * 72 + 26}px` })}
                                .renderItem=${this._renderListItem}
                              ></lit-virtualizer>
                              ${currentItem.not_shown ? x`
                                    <ha-list-item noninteractive class="not-shown" .graphic=${mediaClass.show_list_images ? "medium" : "avatar"}>
                                      <span class="title">
                                        ${this.hass.localize("ui.components.media-browser.not_shown", { count: currentItem.not_shown })}
                                      </span>
                                    </ha-list-item>
                                  ` : ""}
                            </ha-list>
                          ` : this.itemsPerRow ? x`
                              <div class="children flex-grid" style="--items-per-row: ${this.itemsPerRow}">
                                ${children.map((child) => this._renderGridItem(child))}
                              </div>
                              ${currentItem.not_shown ? x`
                                    <div class="grid not-shown">
                                      <div class="title">
                                        ${this.hass.localize("ui.components.media-browser.not_shown", { count: currentItem.not_shown })}
                                      </div>
                                    </div>
                                  ` : ""}
                            ` : this.preferredLayout === "grid" || this.preferredLayout === "auto" && childrenMediaClass.layout === "grid" ? x`
                                <lit-virtualizer
                                  scroller
                                  .layout=${grid({
			itemSize: getGridItemSize(this.itemsPerRow, childrenMediaClass.thumbnail_ratio === "portrait"),
			gap: "8px",
			flex: { preserve: "aspect-ratio" },
			justify: "space-evenly",
			direction: "vertical"
		})}
                                  .items=${children}
                                  .renderItem=${this._renderGridItem}
                                  class="children ${e({
			portrait: childrenMediaClass.thumbnail_ratio === "portrait",
			not_shown: !!currentItem.not_shown
		})}"
                                ></lit-virtualizer>
                                ${currentItem.not_shown ? x`
                                      <div class="grid not-shown">
                                        <div class="title">
                                          ${this.hass.localize("ui.components.media-browser.not_shown", { count: currentItem.not_shown })}
                                        </div>
                                      </div>
                                    ` : ""}
                              ` : x`
                                <ha-list>
                                  <lit-virtualizer
                                    scroller
                                    .items=${children}
                                    style=${o$1({ height: `${children.length * 72 + 26}px` })}
                                    .renderItem=${this._renderListItem}
                                  ></lit-virtualizer>
                                  ${currentItem.not_shown ? x`
                                        <ha-list-item noninteractive class="not-shown" .graphic=${mediaClass.show_list_images ? "medium" : "avatar"}>
                                          <span class="title">
                                            ${this.hass.localize("ui.components.media-browser.not_shown", { count: currentItem.not_shown })}
                                          </span>
                                        </ha-list-item>
                                      ` : ""}
                                </ha-list>
                              `}
          </div>
        </div>
      </div>
    `;
	}
	async _getThumbnailURLorBase64(thumbnailUrl) {
		if (!thumbnailUrl) return "";
		if (thumbnailUrl.startsWith("/")) return new Promise((resolve, reject) => {
			this.hass.fetchWithAuth(thumbnailUrl).then((response) => response.blob()).then((blob) => {
				const reader = new FileReader();
				reader.onload = () => {
					const result = reader.result;
					resolve(typeof result === "string" ? result : "");
				};
				reader.onerror = (e) => reject(e);
				reader.readAsDataURL(blob);
			});
		});
		if (isBrandUrl(thumbnailUrl)) thumbnailUrl = brandsUrl({
			domain: extractDomainFromBrandUrl(thumbnailUrl),
			type: "icon",
			darkOptimized: this.hass.themes?.darkMode
		});
		return thumbnailUrl;
	}
	_runAction(item) {
		fireEvent(this, "media-picked", {
			item,
			navigateIds: this.navigateIds
		});
	}
	_ttsPicked(ev) {
		ev.stopPropagation();
		const navigateIds = this.navigateIds.slice(0, -1);
		navigateIds.push(ev.detail.item);
		fireEvent(this, "media-picked", {
			...ev.detail,
			navigateIds
		});
	}
	_manualPicked(ev) {
		ev.stopPropagation();
		fireEvent(this, "media-picked", {
			item: ev.detail.item,
			navigateIds: this.navigateIds
		});
	}
	async _fetchData(entityId, mediaContentId, mediaContentType) {
		return (entityId && entityId !== "browser" ? browseMediaPlayer(this.hass, entityId, mediaContentId, mediaContentType) : browseLocalMediaPlayer(this.hass, mediaContentId)).then((item) => {
			if (!mediaContentId && this.action === "pick") {
				item.children = item.children || [];
				item.children.push(MANUAL_ITEM);
			}
			return item;
		});
	}
	_measureCard() {
		this.narrow = (this.dialog ? window.innerWidth : this.offsetWidth) < 450;
	}
	async _attachResizeObserver() {
		if (!this._resizeObserver) this._resizeObserver = new ResizeObserver(debounce(() => this._measureCard(), 250, false));
		this._resizeObserver.observe(this);
	}
	_closeDialogAction() {
		fireEvent(this, "close-dialog");
	}
	_setError(error) {
		if (!this.dialog) {
			this._error = error;
			return;
		}
		if (!error) return;
		this._closeDialogAction();
		this, this.hass.localize("ui.components.media-browser.media_browsing_error"), this._renderError(error);
	}
	_renderError(err) {
		if (err.message === "Media directory does not exist.") return x`
        <h2>${this.hass.localize("ui.components.media-browser.no_local_media_found")}</h2>
        <p>
          ${this.hass.localize("ui.components.media-browser.no_media_folder")}
          <br />
          ${this.hass.localize("ui.components.media-browser.setup_local_help", { documentation: x`<a href=${documentationUrl(this.hass, "/more-info/local-media/setup-media")} target="_blank" rel="noreferrer"
              >${this.hass.localize("ui.components.media-browser.documentation")}</a
            >` })}
          <br />
          ${this.hass.localize("ui.components.media-browser.local_media_files")}
        </p>
      `;
		return x`<span class="error">${err.message}</span>`;
	}
	async _setHeaderHeight() {
		await this.updateComplete;
		const header = this._header;
		const content = this._content;
		if (!header || !content) return;
		this._headerOffsetHeight = header.offsetHeight;
		content.style.marginTop = `${this._headerOffsetHeight}px`;
		content.style.maxHeight = `calc(var(--media-browser-max-height, 100%) - ${this._headerOffsetHeight}px)`;
	}
	_animateHeaderHeight() {
		let start;
		const animate = (time) => {
			if (start === void 0) start = time;
			const elapsed = time - start;
			this._setHeaderHeight();
			if (elapsed < 400) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	}
	_scroll(ev) {
		const content = ev.currentTarget;
		if (!this.scrolled && content.scrollTop > this._headerOffsetHeight) this.scrolled = true;
		else if (this.scrolled && content.scrollTop < this._headerOffsetHeight) this.scrolled = false;
	}
	static get styles() {
		return [
			haStyle,
			mediaGridCardStyles,
			i$8`
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          direction: ltr;
          height: 100%;
        }

        ha-spinner {
          margin: 40px auto;
        }

        .container {
          padding: 16px;
        }

        .no-items {
          padding-left: 32px;
        }

        .highlight-add-button {
          display: flex;
          flex-direction: row-reverse;
          margin-right: 48px;
          margin-inline-end: 48px;
          margin-inline-start: initial;
          direction: var(--direction);
        }

        .highlight-add-button ha-svg-icon {
          position: relative;
          top: -0.5em;
          margin-left: 8px;
          margin-inline-start: 8px;
          margin-inline-end: initial;
          transform: scaleX(var(--scale-direction));
        }

        .content {
          overflow-y: auto;
          box-sizing: border-box;
          height: 100%;
          flex: 1;
        }

        /* HEADER */

        .header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--divider-color);
          background-color: var(--card-background-color);
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          z-index: 3;
          padding: 16px;
        }
        .header_button {
          position: relative;
          right: -8px;
        }
        .header-content {
          display: flex;
          flex-wrap: wrap;
          flex-grow: 1;
          align-items: flex-start;
        }
        .header-content .img {
          height: 175px;
          width: 175px;
          margin-right: 16px;
          background-size: cover;
          border-radius: 2px;
          transition:
            width 0.4s,
            height 0.4s;
        }
        .header-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-self: stretch;
          min-width: 0;
          flex: 1;
        }
        .header-info ha-button {
          display: block;
          padding-bottom: 16px;
        }
        .breadcrumb {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-grow: 1;
          padding-top: 16px;
        }
        .breadcrumb .title {
          font-size: var(--ha-font-size-4xl);
          line-height: var(--ha-line-height-condensed);
          font-weight: var(--ha-font-weight-bold);
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding-right: 8px;
        }
        .breadcrumb .previous-title {
          font-size: var(--ha-font-size-m);
          padding-bottom: 8px;
          color: var(--secondary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          --mdc-icon-size: 14px;
        }
        .breadcrumb .subtitle {
          font-size: var(--ha-font-size-l);
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0;
          transition:
            height 0.5s,
            margin 0.5s;
        }

        .not-shown {
          font-style: italic;
          color: var(--secondary-text-color);
          padding: 8px 16px 8px;
        }

        .grid.not-shown {
          display: flex;
          align-items: center;
          text-align: center;
        }

        /* ============= CHILDREN ============= */

        ha-list {
          --mdc-list-vertical-padding: 0;
          --mdc-list-item-graphic-margin: 0;
          --mdc-theme-text-icon-on-background: var(--secondary-text-color);
          margin-top: 10px;
        }

        ha-list li:last-child {
          display: none;
        }

        ha-list li[divider] {
          border-bottom-color: var(--divider-color);
        }

        ha-list-item {
          width: 100%;
        }

        div.children {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--media-browse-item-size, 175px), 0.1fr));
          grid-gap: var(--ha-space-4);
          padding: 16px;
        }

        div.children.flex-grid {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
          gap: 0;
        }

        .flex-grid .child {
          width: calc(100% / var(--items-per-row) - 2%);
          margin: 1%;
        }

        :host([dialog]) .children {
          grid-template-columns: repeat(auto-fit, minmax(var(--media-browse-item-size, 175px), 0.33fr));
        }

        .child {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        ha-card {
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .children ha-card .thumbnail {
          width: 100%;
          position: relative;
          box-sizing: border-box;
          transition: padding-bottom 0.1s ease-out;
          padding-bottom: 100%;
        }

        .portrait ha-card .thumbnail {
          padding-bottom: 150%;
        }

        ha-card .image {
          border-radius: var(--ha-border-radius-sm) var(--ha-border-radius-sm) var(--ha-border-radius-square) var(--ha-border-radius-square);
        }

        .image {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        .centered-image {
          margin: 0 8px;
          background-size: contain;
        }

        .brand-image {
          background-size: 40%;
        }

        .children ha-card .icon-holder {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .child .folder {
          color: var(--secondary-text-color);
          --mdc-icon-size: calc(var(--media-browse-item-size, 175px) * 0.4);
        }

        .child .icon {
          color: #00a9f7; /* Match the png color from brands repo */
          --mdc-icon-size: calc(var(--media-browse-item-size, 175px) * 0.4);
        }

        .child .play {
          position: absolute;
          transition: color 0.5s;
          border-radius: var(--ha-border-radius-circle);
          top: calc(50% - 20px);
          right: calc(50% - 20px);
          opacity: 0;
          transition: opacity 0.1s ease-out;
        }

        .child .play:not(.can_expand) {
          --mdc-icon-button-size: 40px;
          --mdc-icon-size: 24px;
          background-color: var(--primary-color);
          color: var(--text-primary-color);
        }

        ha-card:hover .image {
          filter: brightness(70%);
          transition: filter 0.5s;
        }

        ha-card:hover .play {
          opacity: 1;
        }

        ha-card:hover .play.can_expand {
          bottom: 8px;
        }

        .child .play.can_expand {
          background-color: rgba(var(--rgb-card-background-color), 0.5);
          top: auto;
          bottom: 0px;
          right: 8px;
          transition:
            bottom 0.1s ease-out,
            opacity 0.1s ease-out;
        }

        ha-list-item .graphic {
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: var(--ha-border-radius-sm);
          display: flex;
          align-content: center;
          align-items: center;
          line-height: initial;
        }

        ha-list-item .graphic .play {
          opacity: 0;
          transition: all 0.5s;
          background-color: rgba(var(--rgb-card-background-color), 0.5);
          border-radius: var(--ha-border-radius-circle);
          --mdc-icon-button-size: 40px;
        }

        ha-list-item:hover .graphic .play {
          opacity: 1;
          color: var(--primary-text-color);
        }

        ha-list-item .graphic .play.show {
          opacity: 1;
          background-color: transparent;
        }

        ha-list-item .title {
          margin-left: 16px;
          margin-inline-start: 16px;
          margin-inline-end: initial;
        }

        /* ============= Narrow ============= */

        :host([narrow]) {
          padding: 0;
        }

        :host([narrow]) .media-source {
          padding: 0 24px;
        }

        :host([narrow]) div.children {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        }

        :host([narrow]) .breadcrumb .title {
          font-size: var(--ha-font-size-2xl);
        }
        :host([narrow]) .header {
          padding: 0;
        }
        :host([narrow]) .header.no-dialog {
          display: block;
        }
        :host([narrow]) .header_button {
          position: absolute;
          top: 14px;
          right: 8px;
        }
        :host([narrow]) .header-content {
          flex-direction: column;
          flex-wrap: nowrap;
        }
        :host([narrow]) .header-content .img {
          height: auto;
          width: 100%;
          margin-right: 0;
          padding-bottom: 50%;
          margin-bottom: 8px;
          position: relative;
          background-position: center;
          border-radius: var(--ha-border-radius-square);
          transition:
            width 0.4s,
            height 0.4s,
            padding-bottom 0.4s;
        }
        ha-fab {
          position: absolute;
          --mdc-theme-secondary: var(--primary-color);
          bottom: -20px;
          right: 20px;
        }
        :host([narrow]) .header-info ha-button {
          margin-top: 16px;
          margin-bottom: 8px;
        }
        :host([narrow]) .header-info {
          padding: 0 16px 8px;
        }

        /* ============= Scroll ============= */
        :host([scrolled]) .breadcrumb .subtitle {
          height: 0;
          margin: 0;
        }
        :host([scrolled]) .breadcrumb .title {
          -webkit-line-clamp: 1;
        }
        :host(:not([narrow])[scrolled]) .header:not(.no-img) ha-icon-button {
          align-self: center;
        }
        :host([scrolled]) .header-info ha-button,
        .no-img .header-info ha-button {
          padding-right: 4px;
        }
        :host([scrolled][narrow]) .no-img .header-info ha-button {
          padding-right: 16px;
        }
        :host([scrolled]) .header-info {
          flex-direction: row;
        }
        :host([scrolled]) .header-info ha-button {
          align-self: center;
          margin-top: 0;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        :host([scrolled][narrow]) .no-img .header-info {
          flex-direction: row-reverse;
        }
        :host([scrolled][narrow]) .header-info {
          padding: 20px 24px 10px 24px;
          align-items: center;
        }
        :host([scrolled]) .header-content {
          align-items: flex-end;
          flex-direction: row;
        }
        :host([scrolled]) .header-content .img {
          height: 75px;
          width: 75px;
        }
        :host([scrolled]) .breadcrumb {
          padding-top: 0;
          align-self: center;
        }
        :host([scrolled][narrow]) .header-content .img {
          height: 100px;
          width: 100px;
          padding-bottom: initial;
          margin-bottom: 0;
        }
        :host([scrolled]) ha-fab {
          bottom: 0px;
          right: -24px;
          --mdc-fab-box-shadow: none;
          --mdc-theme-secondary: rgba(var(--rgb-primary-color), 0.5);
        }

        lit-virtualizer {
          display: block;
          height: 100%;
          overflow: auto !important;
        }

        lit-virtualizer.not_shown {
          height: calc(100% - 36px);
        }

        ha-browse-media-tts {
          direction: var(--direction);
        }
      `
		];
	}
};
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "hass", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "entityId", void 0);
__decorate$1([n$5()], HaMediaPlayerBrowse.prototype, "action", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "preferredLayout", void 0);
__decorate$1([n$5({ type: Number })], HaMediaPlayerBrowse.prototype, "itemsPerRow", void 0);
__decorate$1([n$5({ type: Boolean })], HaMediaPlayerBrowse.prototype, "dialog", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "navigateIds", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "accept", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "defaultId", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "defaultType", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "hideContentType", void 0);
__decorate$1([n$5({ attribute: false })], HaMediaPlayerBrowse.prototype, "contentIdHelper", void 0);
__decorate$1([n$5({
	type: Boolean,
	reflect: true
})], HaMediaPlayerBrowse.prototype, "narrow", void 0);
__decorate$1([n$5({
	type: Boolean,
	reflect: true
})], HaMediaPlayerBrowse.prototype, "scrolled", void 0);
__decorate$1([r$3()], HaMediaPlayerBrowse.prototype, "_error", void 0);
__decorate$1([r$3()], HaMediaPlayerBrowse.prototype, "_parentItem", void 0);
__decorate$1([r$3()], HaMediaPlayerBrowse.prototype, "_currentItem", void 0);
__decorate$1([e$3(".header")], HaMediaPlayerBrowse.prototype, "_header", void 0);
__decorate$1([e$3(".content")], HaMediaPlayerBrowse.prototype, "_content", void 0);
__decorate$1([e$3("lit-virtualizer")], HaMediaPlayerBrowse.prototype, "_virtualizer", void 0);
__decorate$1([t$2({ passive: true })], HaMediaPlayerBrowse.prototype, "_scroll", null);
HaMediaPlayerBrowse = __decorate$1([t$3("sonos-ha-media-player-browse")], HaMediaPlayerBrowse);
//#endregion
//#region node_modules/lit-html/directives/keyed.js
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var i = e$2(class extends i$4 {
	constructor() {
		super(...arguments), this.key = E;
	}
	render(r, t) {
		return this.key = r, t;
	}
	update(r, [t, e]) {
		return t !== this.key && (m$1(r), this.key = t), e;
	}
});
//#endregion
//#region src/sections/media-browser/styles.ts
var mediaBrowserStyles = i$8`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-bottom: 1px solid var(--divider-color);
    background: var(--card-background-color);
  }
  .title {
    flex: 1;
    font-weight: 500;
    font-size: calc(var(--sonos-font-size, 1rem) * 1.1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .title-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
    max-width: 100%;
  }
  .title-section .title {
    flex: 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .player-name {
    font-size: calc(var(--sonos-font-size, 1rem) * 0.8);
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    max-width: 100%;
  }
  .spacer {
    width: 48px;
  }
  .no-items {
    text-align: center;
    margin-top: 50%;
  }
  sonos-icon-button.startpath-active {
    color: var(--accent-color);
  }
  sonos-icon-button.shortcut-active {
    color: var(--accent-color);
  }
  .play-all-warning {
    padding: 8px 12px;
    background: var(--warning-color, #ffa726);
    color: var(--primary-text-color);
    font-size: 0.85rem;
    text-align: center;
  }
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--secondary-text-color);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  sonos-ha-media-player-browse,
  sonos-favorites {
    --mdc-icon-size: 24px;
    --media-browse-item-size: 100px;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
//#endregion
//#region src/sections/media-browser/layout-menu.ts
var selectedStyle = { color: "var(--accent-color)" };
function renderLayoutMenu(layout, onSelect) {
	return x`
    <ha-dropdown @wa-select=${onSelect}>
      <sonos-icon-button slot="trigger" .path=${mdiDotsVertical}></sonos-icon-button>
      <ha-dropdown-item value="auto" .selected=${layout === "auto"} style=${o$1(layout === "auto" ? selectedStyle : {})}>
        <ha-svg-icon slot="icon" .path=${mdiAlphaABoxOutline}></ha-svg-icon>
        Auto
      </ha-dropdown-item>
      <ha-dropdown-item value="grid" .selected=${layout === "grid"} style=${o$1(layout === "grid" ? selectedStyle : {})}>
        <ha-svg-icon slot="icon" .path=${mdiGrid}></ha-svg-icon>
        Grid
      </ha-dropdown-item>
      <ha-dropdown-item value="list" .selected=${layout === "list"} style=${o$1(layout === "list" ? selectedStyle : {})}>
        <ha-svg-icon slot="icon" .path=${mdiListBoxOutline}></ha-svg-icon>
        List
      </ha-dropdown-item>
    </ha-dropdown>
  `;
}
//#endregion
//#region src/sections/media-browser/browser.ts
var currentPath = null;
var currentPathTitle = "";
var ROOT_NAV = {
	media_content_id: void 0,
	media_content_type: void 0
};
var START_PATH_KEY$1 = "sonos-card-media-browser-start";
var MediaBrowserBrowser = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.layout = "auto";
		this.navigateIds = [];
		this.currentTitle = "";
		this.isCurrentPathStart = false;
		this.playAllLoading = false;
		this.playAllWarning = "";
		this.mediaLoaded = false;
		this.toggleStartPath = () => {
			if (this.isCurrentPathStart) localStorage.removeItem(START_PATH_KEY$1);
			else localStorage.setItem(START_PATH_KEY$1, JSON.stringify(this.navigateIds));
			this.isCurrentPathStart = !this.isCurrentPathStart;
		};
		this.goToFavorites = () => {
			this.dispatchEvent(new CustomEvent("go-to-favorites"));
		};
		this.goBack = () => {
			if (this.navigateIds.length <= 1) return;
			this.navigateIds = this.navigateIds.slice(0, -1);
			this.currentTitle = this.navigateIds[this.navigateIds.length - 1]?.title || "";
			this.saveCurrentState();
			this.updateIsCurrentPathStart();
		};
		this.handleLayoutChange = (ev) => {
			this.dispatchEvent(new CustomEvent("layout-change", { detail: ev.detail.item.value }));
		};
		this.onMediaPicked = async (event) => {
			const mediaItem = event.detail.item;
			await this.store.mediaControlService.playMedia(this.store.activePlayer, mediaItem);
			this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, mediaItem));
		};
		this.onMediaBrowsed = (event) => {
			this.navigateIds = event.detail.ids;
			const isRoot = this.navigateIds.length === 1 && !this.navigateIds[0].media_content_id;
			const lastItem = this.navigateIds[this.navigateIds.length - 1];
			this.currentTitle = isRoot ? "" : lastItem?.title || event.detail.current?.title || "";
			this.mediaLoaded = !this.mediaLoaded;
			this.saveCurrentState();
			this.updateIsCurrentPathStart();
		};
	}
	connectedCallback() {
		super.connectedCallback();
		if (currentPath) {
			this.navigateIds = currentPath;
			this.currentTitle = currentPathTitle;
		} else this.restoreFromStartPath();
		this.updateIsCurrentPathStart();
	}
	restoreFromStartPath() {
		const startPath = localStorage.getItem(START_PATH_KEY$1);
		if (!startPath) {
			this.navigateIds = [ROOT_NAV];
			return;
		}
		try {
			this.navigateIds = JSON.parse(startPath);
			this.currentTitle = this.navigateIds[this.navigateIds.length - 1]?.title || "";
		} catch {
			this.navigateIds = [ROOT_NAV];
		}
	}
	navigateToShortcut(shortcut) {
		this.navigateIds = [ROOT_NAV, {
			media_content_id: shortcut.media_content_id,
			media_content_type: shortcut.media_content_type,
			title: shortcut.name
		}];
		this.currentTitle = shortcut.name || "";
		this.saveCurrentState();
		this.updateIsCurrentPathStart();
	}
	saveCurrentState() {
		currentPath = this.navigateIds;
		currentPathTitle = this.currentTitle;
	}
	updateIsCurrentPathStart() {
		const startPath = localStorage.getItem(START_PATH_KEY$1);
		this.isCurrentPathStart = startPath === JSON.stringify(this.navigateIds);
	}
	render() {
		const config = this.store.config.mediaBrowser ?? {};
		const shortcut = config.shortcut;
		const playerName = getSpeakerList(this.store.activePlayer, this.store.predefinedGroups);
		const hideActivePlayerName = config.hideActivePlayerName ?? false;
		return x`
      ${this.playAllLoading ? x`<div class="loading-overlay"><div class="loading-spinner"></div></div>` : E}
      ${this.playAllWarning ? x`<div class="play-all-warning">${this.playAllWarning}</div>` : E}
      ${config.hideHeader ? "" : x`<div class="header">
            ${this.navigateIds.length > 1 ? x`<sonos-icon-button .path=${mdiArrowLeft} @click=${this.goBack}></sonos-icon-button>` : x`<div class="spacer"></div>`}
            <div class="title-section">
              <span class="title">${this.currentTitle || "Media Browser"}</span>
              <span class="player-name" ?hidden=${hideActivePlayerName}>${playerName}</span>
            </div>
            ${this.renderPlayAllButton()} ${renderShortcutButton(shortcut, () => this.navigateToShortcut(shortcut), this.isShortcutActive(shortcut))}
            <sonos-icon-button .path=${mdiStar} @click=${this.goToFavorites} title="Favorites"></sonos-icon-button>
            <sonos-icon-button
              class=${this.isCurrentPathStart ? "startpath-active" : ""}
              .path=${this.isCurrentPathStart ? mdiFolderStar : mdiFolderStarOutline}
              @click=${this.toggleStartPath}
              title=${this.isCurrentPathStart ? "Unset start page" : "Set as start page"}
            ></sonos-icon-button>
            ${renderLayoutMenu(this.layout, this.handleLayoutChange)}
          </div>`}
      ${i(this.layout, x`<sonos-ha-media-player-browse
          .hass=${this.store.hass}
          .entityId=${this.store.activePlayer.id}
          .navigateIds=${this.navigateIds}
          .preferredLayout=${this.layout}
          .itemsPerRow=${config.itemsPerRow}
          .action=${"play"}
          @media-picked=${this.onMediaPicked}
          @media-browsed=${this.onMediaBrowsed}
        ></sonos-ha-media-player-browse>`)}
    `;
	}
	isShortcutActive(shortcut) {
		return !!shortcut && this.navigateIds.some((nav) => nav.media_content_id === shortcut.media_content_id);
	}
	renderPlayAllButton() {
		const playableCount = this.mediaBrowser?.getPlayableChildren().length ?? 0;
		if (playableCount === 0 || this.playAllLoading) return E;
		return x`<sonos-icon-button .path=${mdiPlay} @click=${this.handlePlayAll} title="Play all (${playableCount} tracks)"></sonos-icon-button>`;
	}
	async handlePlayAll() {
		const children = this.mediaBrowser?.getPlayableChildren() || [];
		if (!children.length) return;
		this.playAllWarning = "";
		this.playAllLoading = true;
		try {
			const firstItem = await playAll(this.store, children);
			if (firstItem) this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, firstItem));
			if (children.length > 1) {
				let lastCount = 0;
				for (let attempt = 0; attempt < 4; attempt++) {
					await new Promise((resolve) => setTimeout(resolve, 1500));
					const queue = await this.store.hassService.getQueue(this.store.activePlayer);
					if (queue.length >= children.length) break;
					if (queue.length <= lastCount) {
						this.playAllWarning = `Only ${queue.length} of ${children.length} items were added to the queue. Some media types do not support queueing.`;
						setTimeout(() => this.playAllWarning = "", 8e3);
						break;
					}
					lastCount = queue.length;
				}
			}
		} catch (e) {
			console.error("Failed to play all:", e);
		} finally {
			this.playAllLoading = false;
		}
	}
	static get styles() {
		return mediaBrowserStyles;
	}
};
__decorate$1([n$5({ attribute: false })], MediaBrowserBrowser.prototype, "store", void 0);
__decorate$1([n$5({ type: String })], MediaBrowserBrowser.prototype, "layout", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "navigateIds", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "currentTitle", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "isCurrentPathStart", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "playAllLoading", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "playAllWarning", void 0);
__decorate$1([r$3()], MediaBrowserBrowser.prototype, "mediaLoaded", void 0);
__decorate$1([e$3("sonos-ha-media-player-browse")], MediaBrowserBrowser.prototype, "mediaBrowser", void 0);
//#endregion
//#region src/sections/media-browser/media-browser-section.ts
var START_PATH_KEY = "sonos-card-media-browser-start";
var LAYOUT_KEY = "sonos-card-media-browser-layout";
var FAVORITES_VIEW = "favorites";
var currentView = null;
var MediaBrowser = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.isCurrentPathStart = false;
		this.layout = "auto";
		this.view = "favorites";
		this.handleMenuAction = (ev) => {
			this.setLayout(ev.detail.item.value);
		};
		this.toggleStartPath = () => {
			if (this.isCurrentPathStart) localStorage.removeItem(START_PATH_KEY);
			else localStorage.setItem(START_PATH_KEY, FAVORITES_VIEW);
			this.isCurrentPathStart = !this.isCurrentPathStart;
		};
		this.goToFavorites = () => {
			this.view = "favorites";
			currentView = "favorites";
			this.updateIsCurrentPathStart();
		};
		this.goToBrowser = () => {
			this.view = "browser";
			currentView = "browser";
			this.updateIsCurrentPathStart();
		};
		this.onShortcutClick = () => {
			const shortcut = this.store.config.mediaBrowser?.shortcut;
			if (!shortcut) return;
			this.view = "browser";
			currentView = "browser";
			this.updateComplete.then(() => this.browserComponent?.navigateToShortcut(shortcut));
		};
		this.onMediaItemSelected = (event) => {
			this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, event.detail));
		};
		this.onBrowserLayoutChange = (event) => {
			this.setLayout(event.detail);
		};
	}
	connectedCallback() {
		super.connectedCallback();
		this.initializeView();
		this.loadLayout();
	}
	loadLayout() {
		const savedLayout = localStorage.getItem(LAYOUT_KEY);
		if (savedLayout && [
			"auto",
			"grid",
			"list"
		].includes(savedLayout)) this.layout = savedLayout;
	}
	setLayout(layout) {
		this.layout = layout;
		localStorage.setItem(LAYOUT_KEY, layout);
	}
	initializeView() {
		if (this.store.config.mediaBrowser?.onlyFavorites ?? false) {
			this.view = "favorites";
			this.updateIsCurrentPathStart();
			return;
		}
		if (currentView !== null) {
			this.view = currentView;
			this.updateIsCurrentPathStart();
			return;
		}
		const startPath = localStorage.getItem(START_PATH_KEY);
		if (startPath && startPath !== FAVORITES_VIEW) this.view = "browser";
		else this.view = "favorites";
		this.updateIsCurrentPathStart();
	}
	updateIsCurrentPathStart() {
		const startPath = localStorage.getItem(START_PATH_KEY);
		if (this.view === "favorites") this.isCurrentPathStart = startPath === FAVORITES_VIEW || startPath === null;
		else this.isCurrentPathStart = false;
	}
	render() {
		return this.view === "favorites" ? this.renderFavorites() : this.renderBrowser();
	}
	renderFavorites() {
		const config = this.store.config.mediaBrowser ?? {};
		const title = config.favorites?.title ?? "Favorites";
		const playerName = getSpeakerList(this.store.activePlayer, this.store.predefinedGroups);
		const onlyFavorites = config.onlyFavorites ?? false;
		const hideActivePlayerName = config.hideActivePlayerName ?? false;
		return x`
      ${config.hideHeader ? "" : x`<div class="header">
            <div class="title-section">
              <span class="title">${title}</span>
              <span class="player-name" ?hidden=${hideActivePlayerName}>${playerName}</span>
            </div>
            ${onlyFavorites ? "" : renderShortcutButton(config.shortcut, this.onShortcutClick)}
            ${onlyFavorites ? "" : x`<sonos-icon-button .path=${mdiPlayBoxMultiple} @click=${this.goToBrowser} title="Browse Media"></sonos-icon-button>
                  <sonos-icon-button
                    class=${this.isCurrentPathStart ? "startpath-active" : ""}
                    .path=${this.isCurrentPathStart ? mdiFolderStar : mdiFolderStarOutline}
                    @click=${this.toggleStartPath}
                    title=${this.isCurrentPathStart ? "Unset start page" : "Set as start page"}
                  ></sonos-icon-button>`}
            ${renderLayoutMenu(this.layout, this.handleMenuAction)}
          </div>`}
      <sonos-favorites .store=${this.store} .layout=${this.layout} @item-selected=${this.onMediaItemSelected}></sonos-favorites>
    `;
	}
	renderBrowser() {
		return x`
      <sonos-media-browser-browser
        .store=${this.store}
        .layout=${this.layout}
        @item-selected=${this.onMediaItemSelected}
        @go-to-favorites=${this.goToFavorites}
        @layout-change=${this.onBrowserLayoutChange}
      ></sonos-media-browser-browser>
    `;
	}
	static get styles() {
		return mediaBrowserStyles;
	}
};
__decorate$1([n$5({ attribute: false })], MediaBrowser.prototype, "store", void 0);
__decorate$1([r$3()], MediaBrowser.prototype, "isCurrentPathStart", void 0);
__decorate$1([r$3()], MediaBrowser.prototype, "layout", void 0);
__decorate$1([r$3()], MediaBrowser.prototype, "view", void 0);
__decorate$1([e$3("sonos-media-browser-browser")], MediaBrowser.prototype, "browserComponent", void 0);
//#endregion
//#region src/components/operation-overlay.ts
var OperationOverlay = class extends i$5 {
	render() {
		if (!this.progress) return E;
		return x`
      <div class="operation-overlay">
        <div class="operation-overlay-content">
          <ha-spinner></ha-spinner>
          <div class="operation-progress-text">${this.progress.total > 1 ? `${this.progress.label} ${this.progress.current} of ${this.progress.total}` : `${this.progress.label}...`}</div>
          <ha-control-button-group>
            <ha-control-button class="accent" @click=${this.onCancel}> ${this.hass?.localize("ui.common.cancel") || "Cancel"} </ha-control-button>
          </ha-control-button-group>
        </div>
      </div>
    `;
	}
	onCancel() {
		this.dispatchEvent(customEvent("cancel-operation"));
	}
	static get styles() {
		return i$8`
      .operation-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
      }
      .operation-overlay-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
      }
      .operation-progress-text {
        font-size: 1.2rem;
        color: var(--primary-text-color, #fff);
      }
      .accent {
        --control-button-background-color: var(--accent-color);
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], OperationOverlay.prototype, "progress", void 0);
__decorate$1([n$5({ attribute: false })], OperationOverlay.prototype, "hass", void 0);
customElements.define("sonos-operation-overlay", OperationOverlay);
//#endregion
//#region src/components/play-menu.ts
var _PlayMenu;
var PLAY_MENU_ACTIONS = [
	{ enqueue: "replace" },
	{
		enqueue: "play",
		radioMode: true
	},
	{ enqueue: "play" },
	{ enqueue: "next" },
	{ enqueue: "add" },
	{ enqueue: "replace_next" }
];
var PlayMenu = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.disabled = false;
		this.hasSelection = false;
		this.inline = false;
	}
	render() {
		if (!this.hasSelection) return E;
		if (this.inline) return this.renderInlineMenu();
		return this.renderButtonMenu();
	}
	renderButtonMenu() {
		return x`
      <ha-dropdown @wa-select=${this.handleAction}>
        <sonos-icon-button slot="trigger" .path=${mdiPlay} title="Play options" ?disabled=${this.disabled}></sonos-icon-button>
        ${this.renderMenuItems()}
      </ha-dropdown>
    `;
	}
	renderInlineMenu() {
		return x`
      <div class="inline-menu" @click=${(e) => e.stopPropagation()}>
        <sonos-icon-button class="close-btn" .path=${mdiClose} @click=${this.closeMenu} title="Close"></sonos-icon-button>
        ${PLAY_MENU_ACTIONS.map((_action, index) => x`
            <div class="inline-menu-item" @click=${() => this.selectAction(index)}>
              <ha-svg-icon .path=${this.getActionIcon(index)}></ha-svg-icon>
              <span>${this.getActionLabel(index)}</span>
            </div>
          `)}
      </div>
    `;
	}
	renderMenuItems() {
		return x`
      <ha-dropdown-item value="0">
        <ha-svg-icon slot="icon" .path=${mdiPlayBoxMultiple}></ha-svg-icon>
        Play Now (clear queue)
      </ha-dropdown-item>
      <ha-dropdown-item value="1">
        <ha-svg-icon slot="icon" .path=${mdiAccessPoint}></ha-svg-icon>
        Start Radio
      </ha-dropdown-item>
      <ha-dropdown-item value="2">
        <ha-svg-icon slot="icon" .path=${mdiPlay}></ha-svg-icon>
        Play Now
      </ha-dropdown-item>
      <ha-dropdown-item value="3">
        <ha-svg-icon slot="icon" .path=${mdiSkipNext}></ha-svg-icon>
        Play Next
      </ha-dropdown-item>
      <ha-dropdown-item value="4">
        <ha-svg-icon slot="icon" .path=${mdiPlaylistPlus}></ha-svg-icon>
        Add to Queue
      </ha-dropdown-item>
      <ha-dropdown-item value="5">
        <ha-svg-icon slot="icon" .path=${mdiSkipNextCircle}></ha-svg-icon>
        Play Next (clear queue)
      </ha-dropdown-item>
    `;
	}
	getActionIcon(index) {
		return [
			mdiPlayBoxMultiple,
			mdiAccessPoint,
			mdiPlay,
			mdiSkipNext,
			mdiPlaylistPlus,
			mdiSkipNextCircle
		][index];
	}
	getActionLabel(index) {
		return [
			"Play Now (clear queue)",
			"Start Radio",
			"Play Now",
			"Play Next",
			"Add to Queue",
			"Play Next (clear queue)"
		][index];
	}
	handleAction(e) {
		const action = PLAY_MENU_ACTIONS[parseInt(e.detail.item.value)];
		if (action) this.dispatchEvent(customEvent("play-menu-action", action));
	}
	selectAction(index) {
		const action = PLAY_MENU_ACTIONS[index];
		if (action) this.dispatchEvent(customEvent("play-menu-action", action));
	}
	closeMenu() {
		this.dispatchEvent(customEvent("play-menu-close"));
	}
};
_PlayMenu = PlayMenu;
_PlayMenu.styles = i$8`
    :host {
      display: contents;
    }
    .inline-menu {
      position: relative;
      background: var(--card-background-color, var(--primary-background-color));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 200px;
      padding: 17px 17px;
      z-index: 10;
    }
    .close-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      --mdc-icon-button-size: 28px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .inline-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }
    .inline-menu-item:hover {
      background: var(--secondary-background-color);
    }
    .inline-menu-item ha-svg-icon {
      --mdc-icon-size: 20px;
      flex-shrink: 0;
    }
  `;
__decorate$1([n$5({ type: Boolean })], PlayMenu.prototype, "disabled", void 0);
__decorate$1([n$5({ type: Boolean })], PlayMenu.prototype, "hasSelection", void 0);
__decorate$1([n$5({ type: Boolean })], PlayMenu.prototype, "inline", void 0);
customElements.define("sonos-play-menu", PlayMenu);
//#endregion
//#region src/sections/queue/queue-search-utils.ts
var QUEUE_SEARCH_STORAGE_KEY = "sonos-queue-search-state";
function restoreQueueSearchState() {
	const saved = localStorage.getItem(QUEUE_SEARCH_STORAGE_KEY);
	if (!saved) return null;
	try {
		const state = JSON.parse(saved);
		return {
			expanded: !!state.expanded,
			searchText: state.searchText || "",
			showOnlyMatches: !!state.showOnlyMatches
		};
	} catch {
		return null;
	}
}
function saveQueueSearchState(state) {
	localStorage.setItem(QUEUE_SEARCH_STORAGE_KEY, JSON.stringify(state));
}
function findMatchIndices(items, searchText) {
	const searchLower = searchText.toLowerCase();
	return items.map((item, i) => item.title?.toLowerCase().includes(searchLower) ? i : -1).filter((i) => i !== -1);
}
function getCurrentMatchIndex(matchIndices, continueFromCurrent, lastHighlightedIndex) {
	if (!continueFromCurrent || lastHighlightedIndex < 0) return 0;
	const nextMatchAfterLast = matchIndices.find((i) => i >= lastHighlightedIndex);
	return nextMatchAfterLast !== void 0 ? matchIndices.indexOf(nextMatchAfterLast) : 0;
}
function createQueueSearchMatch(index, currentMatchIndex, matchIndices) {
	return {
		index,
		currentMatch: currentMatchIndex + 1,
		totalMatches: matchIndices.length,
		matchIndices
	};
}
//#endregion
//#region src/sections/queue/queue-search.styles.ts
var queueSearchStyles = i$8`
  :host {
    display: contents;
  }
  :host > sonos-icon-button[selected] {
    color: var(--accent-color);
  }
  .search-row {
    display: flex;
    align-items: center;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: var(--card-background-color, #1c1c1c);
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
    z-index: 10;
  }
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 4px;
    font-size: var(--sonos-font-size, 1rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #000);
  }
  input:focus {
    outline: none;
    border-color: var(--accent-color, #03a9f4);
  }
  input.no-match {
    border-color: var(--error-color, red);
  }
  .match-info {
    padding: 0 0.5rem;
    font-size: calc(var(--sonos-font-size, 1rem) * 0.9);
    color: var(--secondary-text-color, #666);
    white-space: nowrap;
  }
  .search-row sonos-icon-button {
    --icon-button-size: 2rem;
    --icon-size: 1.2rem;
  }
  .search-row sonos-icon-button[selected] {
    color: var(--accent-color);
  }
`;
//#endregion
//#region src/sections/queue/queue-search-panel.ts
var _QueueSearchPanel;
var QueueSearchPanel = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.searchText = "";
		this.selectMode = false;
		this.matchCount = 0;
		this.currentMatchIndex = 0;
		this.hasNoMatch = false;
		this.showOnlyMatches = false;
	}
	render() {
		const hasText = this.searchText.length > 0;
		const hasMatches = this.matchCount > 0;
		return x`
      <div class="search-row">
        <input
          type="text"
          placeholder="Search queue..."
          class=${this.hasNoMatch ? "no-match" : ""}
          .value=${this.searchText}
          @input=${this.onInput}
          @keydown=${this.onKeyDown}
        />
        <span class="match-info" ?hidden=${!hasMatches}>${this.currentMatchIndex + 1}/${this.matchCount}</span>
        <sonos-icon-button .path=${mdiChevronUp} @click=${() => this.dispatchAction({ type: "prev" })} ?hidden=${!hasMatches}></sonos-icon-button>
        <sonos-icon-button .path=${mdiChevronDown} @click=${() => this.dispatchAction({ type: "next" })} ?hidden=${!hasMatches}></sonos-icon-button>
        <sonos-icon-button
          .path=${mdiCheckAll}
          @click=${() => this.dispatchAction({ type: "select-all" })}
          title="Select all matches"
          ?hidden=${!hasMatches || !this.selectMode}
        ></sonos-icon-button>
        <sonos-icon-button
          .path=${mdiEyeCheck}
          @click=${() => this.dispatchAction({ type: "toggle-show-only" })}
          ?selected=${this.showOnlyMatches}
          title="Show only matches"
          ?hidden=${!hasText}
        ></sonos-icon-button>
        <sonos-icon-button
          .path=${mdiClose}
          @click=${() => this.dispatchAction({ type: "clear" })}
          title="Clear search"
          ?hidden=${!hasText}
        ></sonos-icon-button>
      </div>
    `;
	}
	focusInput() {
		this.shadowRoot?.querySelector("input")?.focus();
	}
	onInput(e) {
		const value = e.target.value;
		this.dispatchAction({
			type: "input",
			payload: { value }
		});
	}
	onKeyDown(e) {
		this.dispatchAction({
			type: "keydown",
			payload: { key: e.key }
		});
	}
	dispatchAction(action) {
		this.dispatchEvent(customEvent("queue-search-ui-action", action));
	}
};
_QueueSearchPanel = QueueSearchPanel;
_QueueSearchPanel.styles = i$8`
    :host {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
    }
    :host([hidden]) {
      display: none !important;
    }
    [hidden] {
      display: none !important;
    }
    .search-row {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      background: var(--card-background-color, #1c1c1c);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      font-size: var(--sonos-font-size, 1rem);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
    input:focus {
      outline: none;
      border-color: var(--accent-color, #03a9f4);
    }
    input.no-match {
      border-color: var(--error-color, red);
    }
    .match-info {
      padding: 0 0.5rem;
      font-size: calc(var(--sonos-font-size, 1rem) * 0.9);
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
    }
    .search-row sonos-icon-button {
      --icon-button-size: 2rem;
      --icon-size: 1.2rem;
    }
    .search-row sonos-icon-button[selected] {
      color: var(--accent-color);
    }
  `;
__decorate$1([n$5()], QueueSearchPanel.prototype, "searchText", void 0);
__decorate$1([n$5({ type: Boolean })], QueueSearchPanel.prototype, "selectMode", void 0);
__decorate$1([n$5({ type: Number })], QueueSearchPanel.prototype, "matchCount", void 0);
__decorate$1([n$5({ type: Number })], QueueSearchPanel.prototype, "currentMatchIndex", void 0);
__decorate$1([n$5({ type: Boolean })], QueueSearchPanel.prototype, "hasNoMatch", void 0);
__decorate$1([n$5({ type: Boolean })], QueueSearchPanel.prototype, "showOnlyMatches", void 0);
customElements.define("sonos-queue-search-panel", QueueSearchPanel);
//#endregion
//#region src/sections/queue/queue-search.ts
var _QueueSearch;
var QueueSearch = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.items = [];
		this.selectMode = false;
		this.expanded = false;
		this.searchText = "";
		this.matchIndices = [];
		this.currentMatchIndex = 0;
		this.showOnlyMatches = false;
		this.toggleExpanded = () => {
			this.expanded = !this.expanded;
			this.dispatch({
				type: "expanded",
				payload: { expanded: this.expanded }
			});
			this.persistState();
		};
		this.onUiAction = (e) => {
			const action = e.detail;
			if (action.type === "input") {
				this.searchText = action.payload.value;
				this.runSearch(false);
				this.persistState();
				return;
			}
			if (action.type === "keydown") {
				if (action.payload.key === "Enter") this.moveMatch(false);
				if (action.payload.key === "Escape") this.clearSearch();
				return;
			}
			if (action.type === "next") {
				this.moveMatch(false);
				return;
			}
			if (action.type === "prev") {
				this.moveMatch(true);
				return;
			}
			if (action.type === "select-all") {
				this.dispatch({
					type: "select-all",
					payload: { indices: this.matchIndices }
				});
				return;
			}
			if (action.type === "toggle-show-only") {
				this.showOnlyMatches = !this.showOnlyMatches;
				this.dispatch({
					type: "show-only",
					payload: {
						showOnlyMatches: this.showOnlyMatches,
						shownIndices: this.showOnlyMatches ? this.matchIndices : []
					}
				});
				this.persistState();
				return;
			}
			if (action.type === "clear") this.clearSearch();
		};
	}
	connectedCallback() {
		super.connectedCallback();
		const saved = restoreQueueSearchState();
		if (!saved) return;
		this.searchText = saved.searchText.trim();
		this.expanded = this.searchText.length > 0 && saved.expanded;
		this.showOnlyMatches = saved.showOnlyMatches;
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("items") && this.searchText) this.runSearch(false);
	}
	updated(changedProperties) {
		if (changedProperties.has("expanded") && this.expanded) this.panel?.focusInput();
	}
	render() {
		const hasNoMatch = this.searchText.length > 0 && this.matchIndices.length === 0;
		return x`
      <sonos-icon-button
        .path=${mdiMagnify}
        @click=${this.toggleExpanded}
        ?selected=${this.expanded || this.searchText.length > 0}
        title="Search queue"
      ></sonos-icon-button>
      <sonos-queue-search-panel
        ?hidden=${!this.expanded}
        .searchText=${this.searchText}
        .selectMode=${this.selectMode}
        .matchCount=${this.matchIndices.length}
        .currentMatchIndex=${this.currentMatchIndex}
        .hasNoMatch=${hasNoMatch}
        .showOnlyMatches=${this.showOnlyMatches}
        @queue-search-ui-action=${this.onUiAction}
      ></sonos-queue-search-panel>
    `;
	}
	runSearch(continueFromCurrent) {
		if (!this.searchText.trim()) {
			this.matchIndices = [];
			this.currentMatchIndex = 0;
			this.showOnlyMatches = false;
			this.dispatch({
				type: "match",
				payload: {
					index: -1,
					currentMatch: 0,
					totalMatches: 0,
					matchIndices: []
				}
			});
			this.dispatch({
				type: "show-only",
				payload: {
					showOnlyMatches: false,
					shownIndices: []
				}
			});
			return;
		}
		const matchIndices = findMatchIndices(this.items, this.searchText);
		this.matchIndices = matchIndices;
		if (matchIndices.length === 0) {
			this.currentMatchIndex = 0;
			this.dispatch({
				type: "match",
				payload: {
					index: -1,
					currentMatch: 0,
					totalMatches: 0,
					matchIndices: []
				}
			});
			this.dispatch({
				type: "show-only",
				payload: {
					showOnlyMatches: false,
					shownIndices: []
				}
			});
			this.showOnlyMatches = false;
			return;
		}
		const lastHighlighted = this.matchIndices[this.currentMatchIndex] ?? -1;
		this.currentMatchIndex = getCurrentMatchIndex(matchIndices, continueFromCurrent, lastHighlighted);
		const match = createQueueSearchMatch(matchIndices[this.currentMatchIndex], this.currentMatchIndex, matchIndices);
		this.dispatch({
			type: "match",
			payload: match
		});
		this.dispatch({
			type: "show-only",
			payload: {
				showOnlyMatches: this.showOnlyMatches,
				shownIndices: this.showOnlyMatches ? this.matchIndices : []
			}
		});
	}
	moveMatch(reverse) {
		if (this.matchIndices.length === 0) return;
		const delta = reverse ? -1 : 1;
		this.currentMatchIndex = (this.currentMatchIndex + delta + this.matchIndices.length) % this.matchIndices.length;
		const match = createQueueSearchMatch(this.matchIndices[this.currentMatchIndex], this.currentMatchIndex, this.matchIndices);
		this.dispatch({
			type: "match",
			payload: match
		});
	}
	clearSearch() {
		this.searchText = "";
		this.matchIndices = [];
		this.currentMatchIndex = 0;
		this.showOnlyMatches = false;
		this.dispatch({
			type: "match",
			payload: {
				index: -1,
				currentMatch: 0,
				totalMatches: 0,
				matchIndices: []
			}
		});
		this.dispatch({
			type: "show-only",
			payload: {
				showOnlyMatches: false,
				shownIndices: []
			}
		});
		this.persistState();
	}
	persistState() {
		saveQueueSearchState({
			expanded: this.expanded,
			searchText: this.searchText,
			showOnlyMatches: this.showOnlyMatches
		});
	}
	dispatch(action) {
		this.dispatchEvent(customEvent("queue-search-action", action));
	}
};
_QueueSearch = QueueSearch;
_QueueSearch.styles = queueSearchStyles;
__decorate$1([n$5({ attribute: false })], QueueSearch.prototype, "items", void 0);
__decorate$1([n$5({ type: Boolean })], QueueSearch.prototype, "selectMode", void 0);
__decorate$1([r$3()], QueueSearch.prototype, "expanded", void 0);
__decorate$1([r$3()], QueueSearch.prototype, "searchText", void 0);
__decorate$1([r$3()], QueueSearch.prototype, "matchIndices", void 0);
__decorate$1([r$3()], QueueSearch.prototype, "currentMatchIndex", void 0);
__decorate$1([r$3()], QueueSearch.prototype, "showOnlyMatches", void 0);
__decorate$1([e$3("sonos-queue-search-panel")], QueueSearch.prototype, "panel", void 0);
customElements.define("sonos-queue-search", QueueSearch);
//#endregion
//#region src/components/selection-actions.ts
var _SelectionActions;
var SelectionActions = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.hasSelection = false;
		this.disabled = false;
		this.showInvert = true;
	}
	render() {
		return x`
      ${this.showInvert ? x`<sonos-icon-button .path=${mdiSelectInverse} @click=${this.invertSelection} title="Invert selection"></sonos-icon-button>` : E}
      <sonos-play-menu .hasSelection=${this.hasSelection} .disabled=${this.disabled} @play-menu-action=${this.onPlayMenuAction}></sonos-play-menu>
    `;
	}
	invertSelection() {
		this.dispatchEvent(customEvent("invert-selection"));
	}
	onPlayMenuAction(e) {
		const action = e.detail;
		switch (action.enqueue) {
			case "replace":
				this.dispatchEvent(customEvent("play-selected", { enqueue: "replace" }));
				break;
			case "play":
				if (action.radioMode) this.dispatchEvent(customEvent("play-selected", {
					enqueue: "play",
					radioMode: true
				}));
				else this.dispatchEvent(customEvent("play-selected", { enqueue: "play" }));
				break;
			case "next":
				this.dispatchEvent(customEvent("queue-selected", { enqueue: "next" }));
				break;
			case "add":
				this.dispatchEvent(customEvent("queue-selected-at-end", { enqueue: "add" }));
				break;
			case "replace_next":
				this.dispatchEvent(customEvent("queue-selected", { enqueue: "replace_next" }));
				break;
		}
	}
};
_SelectionActions = SelectionActions;
_SelectionActions.styles = i$8`
    :host {
      display: contents;
    }
  `;
__decorate$1([n$5({ type: Boolean })], SelectionActions.prototype, "hasSelection", void 0);
__decorate$1([n$5({ type: Boolean })], SelectionActions.prototype, "disabled", void 0);
__decorate$1([n$5({ type: Boolean })], SelectionActions.prototype, "showInvert", void 0);
customElements.define("sonos-selection-actions", SelectionActions);
//#endregion
//#region src/sections/queue/queue-header.ts
var _QueueHeader;
var QueueHeader = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.queueTitle = "";
		this.itemCount = 0;
		this.items = [];
		this.selectMode = false;
		this.hasSelection = false;
		this.operationRunning = false;
	}
	render() {
		const playerName = getSpeakerList(this.store.activePlayer, this.store.predefinedGroups);
		const hideActivePlayerName = this.store.config.queue?.hideActivePlayerName ?? false;
		return x`
      <div class="header">
        <div class="title-section">
          <div class="title-row">
            <span class="title">${this.queueTitle}</span>
            <span class="item-count" ?hidden=${this.itemCount === 0}>(${this.itemCount} items)</span>
          </div>
          <span class="player-name" ?hidden=${hideActivePlayerName}>${playerName}</span>
        </div>
        <div class="header-icons">
          <sonos-queue-search .items=${this.items} .selectMode=${this.selectMode} @queue-search-action=${this.onSearchAction}></sonos-queue-search>
          <div ?hidden=${!this.selectMode}>
            <sonos-selection-actions
              .hasSelection=${this.hasSelection}
              .disabled=${this.operationRunning}
              @invert-selection=${() => this.dispatchAction({ type: "invert-selection" })}
              @play-selected=${() => this.dispatchAction({ type: "play-selected" })}
              @queue-selected=${() => this.dispatchAction({ type: "queue-selected-after-current" })}
              @queue-selected-at-end=${() => this.dispatchAction({ type: "queue-selected-at-end" })}
            ></sonos-selection-actions>
            <sonos-icon-button
              .path=${mdiCloseBoxMultipleOutline}
              @click=${() => this.dispatchAction({ type: "delete-selected" })}
              title="Delete selected"
              ?hidden=${!this.hasSelection}
            ></sonos-icon-button>
            <div class="delete-all-btn" @click=${() => this.dispatchAction({ type: "clear-queue" })} title="Delete all">
              <sonos-icon-button .path=${mdiTrashCanOutline}></sonos-icon-button>
              <span class="all-label">*</span>
            </div>
          </div>
          <div ?hidden=${this.selectMode}>
            <sonos-shuffle .store=${this.store}></sonos-shuffle>
            <sonos-repeat .store=${this.store}></sonos-repeat>
          </div>
          <sonos-icon-button
            .path=${mdiCheckboxMultipleMarkedOutline}
            @click=${() => this.dispatchAction({ type: "toggle-select-mode" })}
            ?selected=${this.selectMode}
            title="Select mode"
            ?disabled=${this.operationRunning}
          ></sonos-icon-button>
        </div>
      </div>
    `;
	}
	onSearchAction(e) {
		const { detail } = e;
		this.dispatchEvent(new CustomEvent("queue-search-action", {
			detail,
			bubbles: true,
			composed: true
		}));
	}
	dispatchAction(action) {
		this.dispatchEvent(customEvent("queue-header-action", action));
	}
};
_QueueHeader = QueueHeader;
_QueueHeader.styles = i$8`
    :host {
      display: block;
      flex-shrink: 0;
    }
    [hidden] {
      display: none !important;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      position: relative;
    }
    .header-icons {
      white-space: nowrap;
      display: flex;
      align-items: center;
    }
    .header-icons > * {
      display: inline-block;
    }
    .title-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
      padding: 0.5rem;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 0;
    }
    .title {
      font-size: calc(var(--sonos-font-size, 1rem) * 1.2);
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .player-name {
      font-size: calc(var(--sonos-font-size, 1rem) * 0.85);
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-count {
      font-size: calc(var(--sonos-font-size, 1rem) * 0.9);
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    .delete-all-btn {
      display: inline-flex;
      position: relative;
      cursor: pointer;
    }
    .delete-all-btn .all-label {
      position: absolute;
      bottom: -16px;
      left: 63%;
      font-size: 2em;
      font-weight: bold;
      color: var(--secondary-text-color);
      pointer-events: none;
      -webkit-text-stroke: 0.5px black;
      text-shadow: 0 0 2px black;
    }
  `;
__decorate$1([n$5()], QueueHeader.prototype, "queueTitle", void 0);
__decorate$1([n$5({ type: Number })], QueueHeader.prototype, "itemCount", void 0);
__decorate$1([n$5({ attribute: false })], QueueHeader.prototype, "items", void 0);
__decorate$1([n$5({ type: Boolean })], QueueHeader.prototype, "selectMode", void 0);
__decorate$1([n$5({ type: Boolean })], QueueHeader.prototype, "hasSelection", void 0);
__decorate$1([n$5({ type: Boolean })], QueueHeader.prototype, "operationRunning", void 0);
__decorate$1([n$5({ attribute: false })], QueueHeader.prototype, "store", void 0);
customElements.define("sonos-queue-header", QueueHeader);
//#endregion
//#region src/components/media-row.ts
var MediaRow = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.selected = false;
		this.playing = false;
		this.searchHighlight = false;
		this.showCheckbox = false;
		this.checked = false;
		this.showQueueButton = false;
		this.queueButtonDisabled = false;
		this.showFavoriteBadge = false;
		this.showLibraryBadge = false;
		this.isFavorite = null;
		this.favoriteLoading = false;
		this.isInLibrary = null;
		this.libraryLoading = false;
	}
	render() {
		const { itemBackgroundColor, itemTextColor, selectedItemBackgroundColor, selectedItemTextColor } = this.store?.config?.queue ?? {};
		const bgColor = this.selected ? selectedItemBackgroundColor : itemBackgroundColor;
		const textColor = this.selected ? selectedItemTextColor : itemTextColor;
		const listItemHeight = this.store.config.listItemHeight;
		const cssVars = (bgColor ? `--secondary-background-color: ${bgColor};` : "") + (textColor ? `--secondary-text-color: ${textColor};` : "") + (listItemHeight ? `height: ${listItemHeight}rem;` : "");
		const hasBadges = this.showFavoriteBadge || this.showLibraryBadge || this.isFavorite !== null || this.isInLibrary !== null;
		const showClickableHeart = this.isFavorite !== null;
		const showClickableLibrary = this.isInLibrary !== null;
		return x`
      <mwc-list-item
        ?hasMeta=${this.playing || hasBadges}
        ?selected=${this.selected}
        ?activated=${this.selected}
        class="button ${this.searchHighlight ? "search-highlight" : ""}"
        style="${cssVars}"
      >
        <div class="row">
          ${this.showCheckbox ? x`<div class="icon-slot">
                <ha-checkbox .checked=${this.checked} @change=${this.onCheckboxChange} @click=${(e) => e.stopPropagation()}></ha-checkbox>
              </div>` : this.showQueueButton ? x`<div class="icon-slot">
                  <sonos-icon-button
                    class=${e({
			"queue-btn": true,
			disabled: this.queueButtonDisabled
		})}
                    .path=${mdiSkipNext}
                    ?disabled=${this.queueButtonDisabled}
                    @click=${this.onQueueClick}
                  ></sonos-icon-button>
                </div>` : E}
          ${renderFavoritesItem(this.item)}
        </div>
        <div class="meta-content" slot="meta">
          <sonos-playing-bars .show=${this.playing}></sonos-playing-bars>
          ${hasBadges ? x`<div class="badges">
                ${showClickableHeart ? x`<div class="badge-toggle ${this.favoriteLoading ? "loading" : ""}" @click=${this.onFavoriteClick}>
                      ${this.favoriteLoading ? x`<ha-circular-progress indeterminate size="tiny"></ha-circular-progress>` : x`<ha-svg-icon class=${this.isFavorite ? "accent" : ""} .path=${this.isFavorite ? mdiHeart : mdiHeartOutline}></ha-svg-icon>`}
                    </div>` : this.showFavoriteBadge ? x`<ha-svg-icon class="accent" .path=${mdiHeart}></ha-svg-icon>` : E}
                ${showClickableLibrary ? x`<div class="badge-toggle ${this.libraryLoading ? "loading" : ""}" @click=${this.onLibraryClick}>
                      ${this.libraryLoading ? x`<ha-circular-progress indeterminate size="tiny"></ha-circular-progress>` : x`<ha-svg-icon class=${this.isInLibrary ? "accent" : ""} .path=${mdiBookshelf}></ha-svg-icon>`}
                    </div>` : this.showLibraryBadge ? x`<ha-svg-icon class="accent" .path=${mdiBookshelf}></ha-svg-icon>` : E}
              </div>` : E}
          <slot></slot>
        </div>
      </mwc-list-item>
    `;
	}
	onCheckboxChange(e) {
		const checkbox = e.target;
		this.dispatchEvent(customEvent("checkbox-change", { checked: checkbox.checked }));
	}
	onQueueClick(e) {
		e.stopPropagation();
		this.dispatchEvent(customEvent("queue-item"));
	}
	onFavoriteClick(e) {
		e.stopPropagation();
		if (!this.favoriteLoading) this.dispatchEvent(customEvent("favorite-toggle", { isFavorite: this.isFavorite }));
	}
	onLibraryClick(e) {
		e.stopPropagation();
		if (!this.libraryLoading) this.dispatchEvent(customEvent("library-toggle", { isInLibrary: this.isInLibrary }));
	}
	async firstUpdated(_changedProperties) {
		super.firstUpdated(_changedProperties);
		await this.scrollToSelected(_changedProperties);
	}
	async updated(_changedProperties) {
		super.updated(_changedProperties);
		await this.scrollToSelected(_changedProperties);
	}
	async scrollToSelected(changedProperties) {
		await new Promise((r) => setTimeout(r, 0));
		const selectedChanged = changedProperties.has("selected") && this.selected;
		const highlightChanged = changedProperties.has("searchHighlight") && this.searchHighlight;
		if (selectedChanged || highlightChanged) this.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}
	static get styles() {
		return [i$8`
        :host {
          display: block;
          min-width: 0;
        }
        .mdc-deprecated-list-item__text {
          width: 100%;
        }
        .button {
          margin: 0.3rem;
          border-radius: 0.3rem;
          height: 1.8rem;
          padding-inline: 0.1rem;
        }

        .button.search-highlight {
          outline: 2px solid var(--accent-color, #03a9f4);
          outline-offset: -2px;
        }

        .row {
          display: flex;
          flex: 1;
          align-items: center;
          min-width: 0;
        }

        .icon-slot {
          width: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        ha-checkbox {
          --mdc-checkbox-unchecked-color: var(--secondary-text-color);
          flex-shrink: 0;
        }

        .queue-btn {
          flex-shrink: 0;
          --mdc-icon-button-size: 36px;
          --mdc-icon-size: 20px;
        }

        .queue-btn.disabled {
          color: var(--disabled-text-color);
          cursor: default;
        }

        .thumbnail {
          width: var(--icon-width, 20px);
          height: var(--icon-width, 20px);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }

        .title {
          font-size: calc(var(--sonos-font-size, 1rem) * 1.1);
          align-self: center;
          flex: 1;
        }

        .meta-content {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-inline: 4px;
        }

        .badges {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .badges > *:not(.badge-toggle) {
          --mdc-icon-size: 16px;
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }

        .badges ha-svg-icon.accent {
          color: var(--accent-color, #03a9f4);
          opacity: 1;
        }

        .badge-toggle {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .badge-toggle ha-svg-icon {
          --mdc-icon-size: 16px;
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }

        .badge-toggle:hover ha-svg-icon {
          opacity: 1;
        }

        .badge-toggle.loading {
          pointer-events: none;
        }

        .badge-toggle ha-circular-progress {
          --md-circular-progress-size: 14px;
        }

        mwc-list-item {
          --mdc-list-item-meta-size: auto;
          overflow: visible;
        }

        .mdc-deprecated-list-item__meta {
          margin-right: 4px;
        }
      `, mediaItemTitleStyle];
	}
};
__decorate$1([n$5({ attribute: false })], MediaRow.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], MediaRow.prototype, "item", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "selected", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "playing", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "searchHighlight", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "showCheckbox", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "checked", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "showQueueButton", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "queueButtonDisabled", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "showFavoriteBadge", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "showLibraryBadge", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "isFavorite", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "favoriteLoading", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "isInLibrary", void 0);
__decorate$1([n$5({ type: Boolean })], MediaRow.prototype, "libraryLoading", void 0);
customElements.define("sonos-media-row", MediaRow);
//#endregion
//#region src/sections/queue/queue-list.ts
var _QueueList;
var QueueList = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.loading = false;
		this.searchExpanded = false;
		this.selectedIndex = -1;
		this.searchHighlightIndex = -1;
		this.selectMode = false;
		this.showQueueButton = false;
		this.displayItems = [];
		this.shownIndices = [];
		this.selectedIndices = /* @__PURE__ */ new Set();
	}
	scrollToItem(index) {
		this.shadowRoot?.querySelectorAll("sonos-media-row")?.[index]?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}
	render() {
		return x`
      <div class="list ${this.searchExpanded ? "search-active" : ""}">
        <div class="loading" ?hidden=${!this.loading}><ha-spinner></ha-spinner></div>
        <mwc-list multi ?hidden=${this.loading}>
          ${this.displayItems.map((item, index) => {
			const realIndex = this.shownIndices.length > 0 ? this.shownIndices[index] : index;
			const isSelected = this.selectedIndex >= 0 && realIndex === this.selectedIndex;
			const isPlaying = isSelected && this.store.activePlayer.isPlaying();
			const isSearchHighlight = this.searchHighlightIndex === realIndex;
			const isChecked = this.selectedIndices.has(realIndex);
			const queueButtonDisabled = isSelected || this.selectedIndex >= 0 && realIndex === this.selectedIndex + 1;
			return x`
              <sonos-media-row
                @click=${() => this.dispatchAction({
				type: "item-click",
				payload: { displayIndex: index }
			})}
                .item=${item}
                .selected=${isSelected}
                .playing=${isPlaying}
                .searchHighlight=${isSearchHighlight}
                .showCheckbox=${this.selectMode}
                .showQueueButton=${this.showQueueButton}
                .queueButtonDisabled=${queueButtonDisabled}
                .checked=${isChecked}
                @checkbox-change=${(e) => this.dispatchAction({
				type: "checkbox-change",
				payload: {
					realIndex,
					checked: e.detail.checked
				}
			})}
                @queue-item=${() => this.dispatchAction({
				type: "queue-item",
				payload: { realIndex }
			})}
                .store=${this.store}
              ></sonos-media-row>
            `;
		})}
        </mwc-list>
      </div>
    `;
	}
	dispatchAction(action) {
		this.dispatchEvent(customEvent("queue-list-action", action));
	}
};
_QueueList = QueueList;
_QueueList.styles = i$8`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    [hidden] {
      display: none !important;
    }
    .list {
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      flex: 1;
      --mdc-icon-button-size: 1.5em;
      --mdc-icon-size: 1em;
    }
    .list.search-active {
      padding-top: 3rem;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `;
__decorate$1([n$5({ type: Boolean })], QueueList.prototype, "loading", void 0);
__decorate$1([n$5({ type: Boolean })], QueueList.prototype, "searchExpanded", void 0);
__decorate$1([n$5({ type: Number })], QueueList.prototype, "selectedIndex", void 0);
__decorate$1([n$5({ type: Number })], QueueList.prototype, "searchHighlightIndex", void 0);
__decorate$1([n$5({ type: Boolean })], QueueList.prototype, "selectMode", void 0);
__decorate$1([n$5({ type: Boolean })], QueueList.prototype, "showQueueButton", void 0);
__decorate$1([n$5({ attribute: false })], QueueList.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], QueueList.prototype, "displayItems", void 0);
__decorate$1([n$5({ attribute: false })], QueueList.prototype, "shownIndices", void 0);
__decorate$1([n$5({ attribute: false })], QueueList.prototype, "selectedIndices", void 0);
customElements.define("sonos-queue-list", QueueList);
//#endregion
//#region src/sections/section-common.styles.ts
/**
* Common styles shared between Queue and Search sections
*/
var sectionCommonStyles = i$8`
  [hidden] {
    display: none !important;
  }
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .section-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    outline: none;
    position: relative;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    position: relative;
  }
  .header-icons {
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  .header-icons > * {
    display: inline-block;
  }
  .title-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.5rem;
  }
  .title {
    font-size: calc(var(--sonos-font-size, 1rem) * 1.2);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-count {
    font-size: calc(var(--sonos-font-size, 1rem) * 0.9);
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .list {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    flex: 1;
    --icon-button-size: 1.5em;
    --icon-size: 1em;
  }
  sonos-icon-button[selected] {
    color: var(--accent-color);
  }
  .loading {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
  .no-results {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-text-color);
  }
  .error-message {
    text-align: center;
    padding: 2rem;
    color: var(--error-color, #db4437);
  }
  .play-menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }
`;
//#endregion
//#region src/sections/queue/styles.ts
var queueStyles = [sectionCommonStyles, i$8`
    /* Queue uses section-container class name */
    .queue-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      outline: none;
      position: relative;
      overflow: hidden;
    }
    .queue-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .list.search-active {
      padding-top: 3rem;
    }
    .delete-all-btn {
      display: inline-flex;
      position: relative;
      cursor: pointer;
    }
    .delete-all-btn .all-label {
      position: absolute;
      bottom: -16px;
      left: 63%;
      font-size: 2em;
      font-weight: bold;
      color: var(--secondary-text-color);
      pointer-events: none;
      -webkit-text-stroke: 0.5px black;
      text-shadow: 0 0 2px black;
    }
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 1rem;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error-message p {
      margin: 0;
      line-height: 1.5;
    }
  `];
//#endregion
//#region src/sections/queue/queue-section-utils.ts
var MASS_CONFIG_MESSAGE = "To see the Music Assistant queue, enable useMusicAssistant (or set entityPlatform: music_assistant) in the card configuration.";
var MASS_QUEUE_MESSAGE = "The current queue is not managed by Music Assistant.";
var MASS_QUEUE_INSTALL_MESSAGE = "To show the queue for Music Assistant, install the mass_queue integration from HACS: github.com/droans/mass_queue";
function getQueueTitle(store, activePlayer) {
	if (store.config.queue?.title) return store.config.queue.title;
	const playlist = activePlayer.attributes.media_playlist ?? "Play Queue";
	return activePlayer.attributes.media_channel ? `${playlist} (not active)` : playlist;
}
function getSelectedQueueIndex(activePlayer, currentQueueItemId, queueItems) {
	if (activePlayer.attributes.queue_position) return activePlayer.attributes.queue_position - 1;
	if (!currentQueueItemId) return -1;
	return queueItems.findIndex((item) => item.queueItemId === currentQueueItemId);
}
function getDisplayItems(showOnlyMatches, shownIndices, queueItems) {
	return showOnlyMatches ? shownIndices.map((index) => queueItems[index]) : queueItems;
}
function shouldShowConfigMessage(store, activePlayer) {
	return store.config.entityPlatform !== "music_assistant" && activePlayer.attributes.media_playlist === "Music Assistant";
}
function queueNotManagedByMusicAssistant(store, activePlayer) {
	return store.config.entityPlatform === "music_assistant" && activePlayer.attributes.active_queue == null;
}
function resolveQueueItemIndex(displayIndex, showOnlyMatches, shownIndices) {
	if (!showOnlyMatches || shownIndices.length === 0) return displayIndex;
	return shownIndices[displayIndex];
}
function shouldSwitchToPlayerSection(action) {
	return action.enqueue === "replace" || action.enqueue === "play" && !action.radioMode;
}
async function fetchQueueData(store, activePlayer, forceRefresh, lastQueueHash) {
	const [queueItems, currentQueueItemId] = await Promise.all([store.hassService.getQueue(activePlayer), store.hassService.musicAssistantService.getCurrentQueueItemId(activePlayer)]);
	const queueHash = queueItems.map((item) => item.title).join("|");
	return {
		queueItems: forceRefresh || queueHash !== lastQueueHash ? queueItems : void 0,
		queueHash,
		currentQueueItemId,
		clearError: true
	};
}
function applyQueueSearchAction(action, searchMatchIndices, selectedIndices) {
	if (action.type === "match") return {
		searchHighlightIndex: action.payload.index,
		searchMatchIndices: action.payload.matchIndices ?? []
	};
	if (action.type === "show-only") return {
		showOnlyMatches: action.payload.showOnlyMatches,
		shownIndices: action.payload.shownIndices
	};
	if (action.type === "expanded") return { searchExpanded: action.payload.expanded };
	if (action.type === "select-all") return { selectedIndices: new Set([...selectedIndices, ...searchMatchIndices]) };
	return {};
}
//#endregion
//#region src/utils/selection-utils.ts
/**
* Utility functions for managing selection state in lists
*/
/**
* Handle checkbox change - add or remove index from selection set
* Returns a new Set to trigger reactivity
*/
function updateSelection(selectedIndices, index, checked) {
	const newSet = new Set(selectedIndices);
	if (checked) newSet.add(index);
	else newSet.delete(index);
	return newSet;
}
/**
* Invert selection - select all unselected items and deselect selected items
* Returns a new Set with inverted selection
*/
function invertSelection(selectedIndices, totalItems) {
	const newSelection = /* @__PURE__ */ new Set();
	for (let i = 0; i < totalItems; i++) if (!selectedIndices.has(i)) newSelection.add(i);
	return newSelection;
}
function clearSelection() {
	return /* @__PURE__ */ new Set();
}
//#endregion
//#region src/sections/queue/queue-controller.ts
var QueueController = class {
	constructor(host, getStore) {
		this.host = host;
		this.getStore = getStore;
		this.selectMode = false;
		this.searchExpanded = false;
		this.searchHighlightIndex = -1;
		this.searchMatchIndices = [];
		this.showOnlyMatches = false;
		this.shownIndices = [];
		this.selectedIndices = /* @__PURE__ */ new Set();
		this.queueItems = [];
		this.loading = true;
		this.operationProgress = null;
		this.cancelOperation = false;
		this.errorMessage = null;
		this.currentQueueItemId = null;
		this.playMenuItemIndex = null;
		this.lastQueueHash = "";
		this.fetchDebounceTimer = null;
		this.lastActivePlayerId = null;
		this.lastStoreRef = null;
		host.addController(this);
	}
	get store() {
		return this.getStore();
	}
	requestUpdate() {
		this.host.requestUpdate();
	}
	dispatchEvent(event) {
		return this.host.dispatchEvent(event);
	}
	async scrollToCurrentlyPlaying() {
		await this.host.updateComplete;
		await new Promise((resolve) => requestAnimationFrame(resolve));
		(this.host.shadowRoot?.querySelectorAll("sonos-media-row")[this.selectedQueueIndex])?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}
	async fetchQueue(forceRefresh = false) {
		try {
			this.applyFetchResult(await fetchQueueData(this.store, this.store.activePlayer, forceRefresh, this.lastQueueHash));
		} catch (error) {
			this.handleFetchError(error);
		}
		if (this.loading) this.loading = false;
		this.host.requestUpdate();
	}
	exitSelectMode() {
		this.selectMode = false;
		this.selectedIndices = clearSelection();
		this.playMenuItemIndex = null;
		this.host.requestUpdate();
	}
	get queueTitle() {
		return getQueueTitle(this.store, this.activePlayer);
	}
	get selectedQueueIndex() {
		return getSelectedQueueIndex(this.activePlayer, this.currentQueueItemId, this.queueItems);
	}
	get displayItems() {
		return getDisplayItems(this.showOnlyMatches, this.shownIndices, this.queueItems);
	}
	get showConfigMessage() {
		return shouldShowConfigMessage(this.store, this.activePlayer);
	}
	get showQueueMessage() {
		return queueNotManagedByMusicAssistant(this.store, this.activePlayer);
	}
	get hasError() {
		return this.showConfigMessage || this.showQueueMessage || !!this.errorMessage;
	}
	hostUpdate() {
		const store = this.getStore();
		if (!store || store === this.lastStoreRef) return;
		this.lastStoreRef = store;
		this.activePlayer = store.activePlayer;
		if (store.activePlayer.id !== this.lastActivePlayerId) {
			this.lastActivePlayerId = store.activePlayer.id;
			this.lastQueueHash = "";
			this.loading = true;
			this.fetchQueue();
			return;
		}
		if (this.fetchDebounceTimer) clearTimeout(this.fetchDebounceTimer);
		this.fetchDebounceTimer = setTimeout(() => void this.fetchQueue(), 500);
	}
	hostDisconnected() {
		if (this.fetchDebounceTimer) clearTimeout(this.fetchDebounceTimer);
	}
	applyFetchResult(result) {
		if (result.queueHash !== void 0) this.lastQueueHash = result.queueHash;
		if (result.queueItems !== void 0) this.queueItems = result.queueItems;
		if (result.currentQueueItemId !== void 0) this.currentQueueItemId = result.currentQueueItemId;
		if (result.clearError && this.errorMessage !== null) this.errorMessage = null;
	}
	handleFetchError(error) {
		if (error.message === "MASS_QUEUE_NOT_INSTALLED") {
			this.errorMessage = MASS_QUEUE_INSTALL_MESSAGE;
			this.queueItems = [];
		} else console.warn("Error getting queue", error);
	}
};
//#endregion
//#region src/utils/batch-operation-utils.ts
/**
* Queue items after the currently playing track.
* Items are added in reverse order so they appear in the correct sequence.
*/
async function queueItemsAfterCurrent(items, playMedia, onProgress, shouldCancel) {
	const total = items.length;
	for (let i = items.length - 1; i >= 0; i--) {
		if (shouldCancel()) return;
		await playMedia(items[i], "next");
		onProgress(total - i);
	}
}
/**
* Get a batch of contiguous indices for parallel processing.
* Returns the first half of the first contiguous chunk (for safe parallel deletion).
*/
function getParallelBatch$1(sortedIndices, maxParallel = 50) {
	if (sortedIndices.length === 0) return [];
	const chunk = [sortedIndices[0]];
	for (let i = 1; i < sortedIndices.length; i++) if (sortedIndices[i] === sortedIndices[i - 1] + 1) chunk.push(sortedIndices[i]);
	else break;
	const halfSize = Math.min(maxParallel, Math.max(1, Math.floor(chunk.length / 2)));
	return chunk.slice(0, halfSize);
}
/**
* Recalculate remaining indices after some have been deleted.
* Adjusts indices that were after the deleted items.
*/
function recalculateIndicesAfterDeletion(remaining, deleted) {
	if (deleted.length === 0) return remaining;
	const deletedSet = new Set(deleted);
	const maxDeleted = Math.max(...deleted);
	const deleteCount = deleted.length;
	return remaining.filter((i) => !deletedSet.has(i)).map((i) => i > maxDeleted ? i - deleteCount : i);
}
//#endregion
//#region src/sections/queue/queue-operations-utils.ts
var QUEUE_REFRESH_DELAY_MS = 500;
function resetOperationState(ctrl) {
	ctrl.operationProgress = null;
	ctrl.cancelOperation = false;
	ctrl.requestUpdate();
}
async function refreshAfterOperation(ctrl, scrollToPlaying = false) {
	ctrl.exitSelectMode();
	await delay(QUEUE_REFRESH_DELAY_MS);
	await ctrl.fetchQueue(true);
	if (scrollToPlaying) await ctrl.scrollToCurrentlyPlaying();
}
async function runBatchOperation(ctrl, operation, options = {}) {
	ctrl.cancelOperation = false;
	try {
		await operation((completed) => {
			ctrl.operationProgress = {
				...ctrl.operationProgress,
				current: completed
			};
			ctrl.requestUpdate();
		}, () => ctrl.cancelOperation);
		if (!ctrl.cancelOperation) await refreshAfterOperation(ctrl, options.scrollToPlaying);
	} finally {
		resetOperationState(ctrl);
	}
}
function getSelectedIndicesExcludingCurrent(ctrl) {
	const currentIndex = ctrl.selectedQueueIndex;
	return Array.from(ctrl.selectedIndices).filter((index) => index !== currentIndex).sort((a, b) => a - b);
}
async function queueSelectedAfterCurrent$1(ctrl) {
	const selectedIndices = getSelectedIndicesExcludingCurrent(ctrl);
	if (selectedIndices.length === 0) return;
	ctrl.operationProgress = {
		current: 0,
		total: selectedIndices.length,
		label: "Moving"
	};
	ctrl.requestUpdate();
	await runBatchOperation(ctrl, (onProgress, shouldCancel) => ctrl.store.mediaControlService.moveQueueItemsAfterCurrent(ctrl.activePlayer, ctrl.queueItems, selectedIndices, ctrl.selectedQueueIndex, onProgress, shouldCancel), { scrollToPlaying: true });
}
async function queueSelectedAtEnd(ctrl) {
	const selectedIndices = getSelectedIndicesExcludingCurrent(ctrl);
	if (selectedIndices.length === 0) return;
	ctrl.operationProgress = {
		current: 0,
		total: selectedIndices.length,
		label: "Moving"
	};
	ctrl.requestUpdate();
	await runBatchOperation(ctrl, (onProgress, shouldCancel) => ctrl.store.mediaControlService.moveQueueItemsToEnd(ctrl.activePlayer, ctrl.queueItems, selectedIndices, onProgress, shouldCancel));
}
async function playSelected$1(ctrl) {
	const selectedIndices = Array.from(ctrl.selectedIndices).sort((a, b) => a - b);
	if (selectedIndices.length === 0) return;
	const items = selectedIndices.map((index) => ctrl.queueItems[index]).filter((item) => item?.media_content_id);
	if (items.length === 0) return;
	ctrl.operationProgress = {
		current: 0,
		total: items.length,
		label: "Loading"
	};
	ctrl.requestUpdate();
	await runBatchOperation(ctrl, (onProgress, shouldCancel) => ctrl.store.mediaControlService.queueAndPlay(ctrl.activePlayer, items, "replace", onProgress, shouldCancel), { scrollToPlaying: true });
}
async function handleItemPlayAction(ctrl, itemIndex, action) {
	const item = ctrl.queueItems[itemIndex];
	if (!item?.media_content_id) return;
	if (action.enqueue === "replace_next" || action.radioMode) {
		await ctrl.store.hassService.musicAssistantService.playMedia(ctrl.activePlayer, item.media_content_id, action.enqueue, action.radioMode);
		return;
	}
	if (action.enqueue === "play") {
		await ctrl.store.mediaControlService.playQueue(ctrl.activePlayer, itemIndex, item.queueItemId);
		return;
	}
	await ctrl.store.mediaControlService.playMedia(ctrl.activePlayer, item, action.enqueue);
}
async function clearQueue(ctrl) {
	await ctrl.store.hassService.clearQueue(ctrl.activePlayer);
	ctrl.exitSelectMode();
	await delay(QUEUE_REFRESH_DELAY_MS);
	await ctrl.fetchQueue(true);
}
async function deleteSelected$1(ctrl) {
	if (ctrl.selectedIndices.size === ctrl.queueItems.length) {
		await clearQueue(ctrl);
		return;
	}
	const remaining = [...ctrl.selectedIndices].sort((a, b) => a - b);
	ctrl.operationProgress = {
		current: 0,
		total: remaining.length,
		label: "Deleting"
	};
	ctrl.cancelOperation = false;
	ctrl.requestUpdate();
	try {
		await deleteBatch(ctrl, remaining);
	} finally {
		resetOperationState(ctrl);
		await refreshAfterOperation(ctrl);
	}
}
async function deleteBatch(ctrl, remaining) {
	const total = remaining.length;
	let deleted = 0;
	let indices = remaining;
	while (indices.length > 0 && !ctrl.cancelOperation) {
		const batch = getParallelBatch$1(indices);
		const results = await Promise.allSettled(batch.map((index) => {
			const queueItemId = ctrl.queueItems[index]?.queueItemId;
			return ctrl.store.hassService.removeFromQueue(ctrl.activePlayer, index, queueItemId);
		}));
		const succeededIndices = batch.filter((_, i) => results[i].status === "fulfilled");
		deleted += succeededIndices.length;
		ctrl.operationProgress = {
			current: deleted,
			total,
			label: "Deleting"
		};
		ctrl.requestUpdate();
		if (succeededIndices.length === 0) break;
		indices = recalculateIndicesAfterDeletion(indices, succeededIndices);
	}
}
//#endregion
//#region src/sections/queue/queue-controller-utils.ts
function handleSearchAction(ctrl, action) {
	Object.assign(ctrl, applyQueueSearchAction(action, ctrl.searchMatchIndices, ctrl.selectedIndices));
	ctrl.requestUpdate();
}
var headerActions = {
	"toggle-select-mode": toggleSelectMode,
	"invert-selection": (ctrl) => {
		ctrl.selectedIndices = invertSelection(ctrl.selectedIndices, ctrl.queueItems.length);
		ctrl.requestUpdate();
	},
	"play-selected": (ctrl) => void playSelected$1(ctrl),
	"queue-selected-after-current": (ctrl) => void queueSelectedAfterCurrent$1(ctrl),
	"queue-selected-at-end": (ctrl) => void queueSelectedAtEnd(ctrl),
	"delete-selected": (ctrl) => void deleteSelected$1(ctrl),
	"clear-queue": (ctrl) => void clearQueue(ctrl)
};
function handleHeaderAction(ctrl, action) {
	headerActions[action.type](ctrl);
}
function handleListAction(ctrl, action) {
	if (action.type === "checkbox-change") {
		ctrl.selectedIndices = updateSelection(ctrl.selectedIndices, action.payload.realIndex, action.payload.checked);
		ctrl.requestUpdate();
		return;
	}
	if (action.type === "queue-item") return;
	const realIndex = resolveQueueItemIndex(action.payload.displayIndex, ctrl.showOnlyMatches, ctrl.shownIndices);
	if (ctrl.selectMode) {
		ctrl.selectedIndices = updateSelection(ctrl.selectedIndices, realIndex, !ctrl.selectedIndices.has(realIndex));
		ctrl.requestUpdate();
		return;
	}
	ctrl.playMenuItemIndex = ctrl.playMenuItemIndex === realIndex ? null : realIndex;
	ctrl.requestUpdate();
}
async function handlePlayMenuAction(ctrl, action) {
	if (ctrl.playMenuItemIndex === null) return;
	const itemIndex = ctrl.playMenuItemIndex;
	ctrl.playMenuItemIndex = null;
	await handleItemPlayAction(ctrl, itemIndex, action);
	if (shouldSwitchToPlayerSection(action)) ctrl.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
	ctrl.requestUpdate();
}
function handleKeyDown(ctrl, key) {
	if (key !== "Escape") return;
	if (ctrl.playMenuItemIndex !== null) {
		ctrl.playMenuItemIndex = null;
		ctrl.requestUpdate();
	} else if (ctrl.selectMode) ctrl.exitSelectMode();
}
function cancelCurrentOperation(ctrl) {
	ctrl.cancelOperation = true;
	ctrl.requestUpdate();
}
function dismissPlayMenu(ctrl) {
	ctrl.playMenuItemIndex = null;
	ctrl.requestUpdate();
}
function toggleSelectMode(ctrl) {
	if (ctrl.selectMode) ctrl.exitSelectMode();
	else {
		ctrl.selectMode = true;
		ctrl.selectedIndices = clearSelection();
		ctrl.playMenuItemIndex = null;
		ctrl.requestUpdate();
	}
}
//#endregion
//#region src/sections/queue/queue-mass.ts
var QueueMass = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.ctrl = new QueueController(this, () => this.store);
	}
	render() {
		const { ctrl } = this;
		const hasSelection = ctrl.selectedIndices.size > 0;
		const operationRunning = ctrl.operationProgress !== null;
		const shownIndices = ctrl.showOnlyMatches ? ctrl.shownIndices : [];
		return x`
      <div class="queue-container" @keydown=${(e) => handleKeyDown(ctrl, e.key)} tabindex="-1">
        <sonos-operation-overlay
          .progress=${ctrl.operationProgress}
          .hass=${this.store.hass}
          @cancel-operation=${() => cancelCurrentOperation(ctrl)}
        ></sonos-operation-overlay>
        <div class="error-message" ?hidden=${!ctrl.showConfigMessage}><p>${MASS_CONFIG_MESSAGE}</p></div>
        <div class="error-message" ?hidden=${!ctrl.showQueueMessage}><p>${MASS_QUEUE_MESSAGE}</p></div>
        <div class="error-message" ?hidden=${!ctrl.errorMessage}><p>${ctrl.errorMessage}</p></div>
        <div class="queue-content" ?hidden=${ctrl.hasError}>
          <sonos-queue-header
            .queueTitle=${ctrl.queueTitle}
            .itemCount=${ctrl.queueItems.length}
            .items=${ctrl.queueItems}
            .selectMode=${ctrl.selectMode}
            .hasSelection=${hasSelection}
            .operationRunning=${operationRunning}
            .store=${this.store}
            @queue-search-action=${(e) => handleSearchAction(ctrl, e.detail)}
            @queue-header-action=${(e) => handleHeaderAction(ctrl, e.detail)}
          ></sonos-queue-header>
          <sonos-queue-list
            .loading=${ctrl.loading}
            .searchExpanded=${ctrl.searchExpanded}
            .selectedIndex=${ctrl.selectedQueueIndex}
            .searchHighlightIndex=${ctrl.searchHighlightIndex}
            .selectMode=${ctrl.selectMode}
            .store=${this.store}
            .displayItems=${ctrl.displayItems}
            .shownIndices=${shownIndices}
            .selectedIndices=${ctrl.selectedIndices}
            @queue-list-action=${(e) => handleListAction(ctrl, e.detail)}
          ></sonos-queue-list>
        </div>
        <div
          class="play-menu-overlay"
          ?hidden=${ctrl.playMenuItemIndex === null}
          @click=${() => dismissPlayMenu(ctrl)}
          @wheel=${(e) => e.preventDefault()}
          @touchmove=${(e) => e.preventDefault()}
        >
          <sonos-play-menu
            .hasSelection=${true}
            .inline=${true}
            @play-menu-action=${(e) => handlePlayMenuAction(ctrl, e.detail)}
            @play-menu-close=${() => dismissPlayMenu(ctrl)}
          ></sonos-play-menu>
        </div>
      </div>
    `;
	}
	static get styles() {
		return [listStyle, ...queueStyles];
	}
};
__decorate$1([n$5()], QueueMass.prototype, "store", void 0);
//#endregion
//#region src/sections/queue/queue-sonos-utils.ts
async function queueAfterCurrent(store, activePlayer, queueItems, index, setProgress, shouldCancel, onDone) {
	const item = queueItems[index];
	if (!item?.media_content_id) return;
	const queuePosition = activePlayer.attributes.queue_position;
	const currentIndex = queuePosition ? queuePosition - 1 : -1;
	setProgress({
		current: 0,
		total: 1,
		label: "Moving"
	});
	try {
		await store.mediaControlService.moveQueueItemAfterCurrent(activePlayer, item, index, currentIndex);
		if (!shouldCancel()) await onDone();
	} finally {
		setProgress(null);
	}
}
async function queueSelectedAfterCurrent(store, activePlayer, queueItems, selectedIndices, setProgress, shouldCancel, onDone) {
	const queuePosition = activePlayer.attributes.queue_position;
	const currentIndex = queuePosition ? queuePosition - 1 : -1;
	const indices = Array.from(selectedIndices).filter((i) => i !== currentIndex).sort((a, b) => a - b);
	if (indices.length === 0) return;
	const total = indices.length;
	setProgress({
		current: 0,
		total,
		label: "Moving"
	});
	try {
		await store.mediaControlService.moveQueueItemsAfterCurrent(activePlayer, queueItems, indices, currentIndex, (completed) => setProgress({
			current: completed,
			total,
			label: "Moving"
		}), shouldCancel);
		if (!shouldCancel()) await onDone();
	} finally {
		setProgress(null);
	}
}
async function playSelected(store, activePlayer, queueItems, selectedIndices, setProgress, shouldCancel, onDone) {
	const indices = Array.from(selectedIndices).sort((a, b) => a - b);
	if (indices.length === 0) return;
	const items = indices.map((i) => queueItems[i]).filter((item) => item?.media_content_id);
	if (items.length === 0) return;
	const total = items.length;
	setProgress({
		current: 0,
		total,
		label: "Loading"
	});
	try {
		await store.mediaControlService.queueAndPlay(activePlayer, items, "replace", (completed) => setProgress({
			current: completed,
			total,
			label: "Loading"
		}), shouldCancel);
		if (!shouldCancel()) await onDone();
	} finally {
		setProgress(null);
	}
}
async function deleteSelected(store, activePlayer, queueItems, selectedIndices, setProgress, shouldCancel, onDone) {
	if (selectedIndices.size === queueItems.length) {
		await store.hassService.clearQueue(activePlayer);
		await onDone();
		return;
	}
	const indices = [...selectedIndices].sort((a, b) => a - b);
	const total = indices.length;
	setProgress({
		current: 0,
		total,
		label: "Deleting"
	});
	try {
		let deleted = 0;
		let remaining = [...indices];
		while (remaining.length > 0 && !shouldCancel()) {
			const batch = getParallelBatch(remaining);
			const results = await Promise.allSettled(batch.map((index) => store.hassService.removeFromQueue(activePlayer, index)));
			const succeededIndices = batch.filter((_, i) => results[i].status === "fulfilled");
			deleted += succeededIndices.length;
			setProgress({
				current: deleted,
				total,
				label: "Deleting"
			});
			if (succeededIndices.length === 0) {
				console.error("All deletions in batch failed, aborting");
				break;
			}
			remaining = recalculateIndices(remaining, succeededIndices);
		}
	} finally {
		setProgress(null);
		await onDone();
	}
}
function getParallelBatch(sortedIndices) {
	const MAX_PARALLEL = 50;
	const chunk = [sortedIndices[0]];
	for (let i = 1; i < sortedIndices.length; i++) if (sortedIndices[i] === sortedIndices[i - 1] + 1) chunk.push(sortedIndices[i]);
	else break;
	const halfSize = Math.min(MAX_PARALLEL, Math.max(1, Math.floor(chunk.length / 2)));
	return chunk.slice(0, halfSize);
}
function recalculateIndices(remaining, deleted) {
	const deletedSet = new Set(deleted);
	const maxDeleted = Math.max(...deleted);
	const deleteCount = deleted.length;
	return remaining.filter((i) => !deletedSet.has(i)).map((i) => i > maxDeleted ? i - deleteCount : i);
}
//#endregion
//#region src/sections/queue/queue-sonos.ts
var QueueSonos = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.selectMode = false;
		this.searchExpanded = false;
		this.searchHighlightIndex = -1;
		this.showOnlyMatches = false;
		this.shownIndices = [];
		this.selectedIndices = /* @__PURE__ */ new Set();
		this.queueItems = [];
		this.loading = true;
		this.operationProgress = null;
		this.cancelOperation = false;
		this.lastQueueHash = "";
		this.onSearchAction = (e) => {
			const a = e.detail;
			if (a.type === "match") this.searchHighlightIndex = a.payload.index;
			else if (a.type === "select-all") this.selectedIndices = new Set([...this.selectedIndices, ...a.payload.indices]);
			else if (a.type === "expanded") this.searchExpanded = a.payload.expanded;
			else if (a.type === "show-only") {
				this.showOnlyMatches = a.payload.showOnlyMatches;
				this.shownIndices = a.payload.shownIndices;
			}
		};
		this.onHeaderAction = (e) => {
			({
				"toggle-select-mode": this.toggleSelectMode,
				"invert-selection": this.invertSelection,
				"play-selected": this.handlePlaySelected,
				"queue-selected-after-current": this.handleQueueAfterCurrent,
				"delete-selected": this.handleDeleteSelected,
				"clear-queue": this.clearQueue
			})[e.detail.type]?.();
		};
		this.onListAction = (e) => {
			const a = e.detail;
			if (a.type === "item-click") this.onItemClick(a.payload.displayIndex);
			else if (a.type === "checkbox-change") this.selectedIndices = updateSelection(this.selectedIndices, a.payload.realIndex, a.payload.checked);
			else if (a.type === "queue-item") this.handleQueueItem(a.payload.realIndex);
		};
		this.progressSetter = (p) => this.operationProgress = p;
		this.cancelChecker = () => this.cancelOperation;
		this.handleQueueAfterCurrent = () => this.runBatchOp(queueSelectedAfterCurrent, () => this.exitAndRefetch());
		this.handlePlaySelected = () => this.runBatchOp(playSelected, () => this.exitAndRefetch());
		this.handleDeleteSelected = () => this.runBatchOp(deleteSelected, () => this.exitAndRefetch());
		this.onKeyDown = (e) => {
			if (e.key === "Escape" && this.selectMode) this.exitSelectMode();
		};
		this.toggleSelectMode = () => {
			this.selectMode = !this.selectMode;
			this.selectedIndices = clearSelection();
		};
		this.invertSelection = () => {
			this.selectedIndices = invertSelection(this.selectedIndices, this.queueItems.length);
		};
		this.clearQueue = async () => {
			await this.store.hassService.clearQueue(this.store.activePlayer);
			this.exitSelectMode();
			await this.fetchQueue();
		};
	}
	get queueTitle() {
		if (this.store.config.queue?.title) return this.store.config.queue.title;
		const playlist = this.store.activePlayer.attributes.media_playlist ?? "Play Queue";
		return this.store.activePlayer.attributes.media_channel ? `${playlist} (not active)` : playlist;
	}
	get selectedQueueIndex() {
		const pos = this.store.activePlayer.attributes.queue_position;
		return pos ? pos - 1 : -1;
	}
	get displayItems() {
		return this.showOnlyMatches ? this.shownIndices.map((i) => this.queueItems[i]) : this.queueItems;
	}
	willUpdate(changed) {
		if (changed.has("store")) this.fetchQueue();
	}
	async fetchQueue() {
		try {
			const queue = await this.store.hassService.getQueue(this.store.activePlayer);
			const hash = queue.map((item) => item.title).join("|");
			if (hash !== this.lastQueueHash) {
				this.lastQueueHash = hash;
				this.queueItems = queue;
			}
		} catch (e) {
			console.warn("Error getting queue", e);
		}
		this.loading = false;
	}
	render() {
		const hasSelection = this.selectedIndices.size > 0;
		const operationRunning = this.operationProgress !== null;
		const shownIndices = this.showOnlyMatches ? this.shownIndices : [];
		return x`
      <div class="queue-container" @keydown=${this.onKeyDown} tabindex="-1">
        <sonos-operation-overlay
          .progress=${this.operationProgress}
          .hass=${this.store.hass}
          @cancel-operation=${() => this.cancelOperation = true}
        ></sonos-operation-overlay>
        <sonos-queue-header
          .queueTitle=${this.queueTitle}
          .itemCount=${this.queueItems.length}
          .items=${this.queueItems}
          .selectMode=${this.selectMode}
          .hasSelection=${hasSelection}
          .operationRunning=${operationRunning}
          .store=${this.store}
          @queue-search-action=${this.onSearchAction}
          @queue-header-action=${this.onHeaderAction}
        ></sonos-queue-header>
        <sonos-queue-list
          .loading=${this.loading}
          .searchExpanded=${this.searchExpanded}
          .selectedIndex=${this.selectedQueueIndex}
          .searchHighlightIndex=${this.searchHighlightIndex}
          .selectMode=${this.selectMode}
          .showQueueButton=${!this.selectMode}
          .store=${this.store}
          .displayItems=${this.displayItems}
          .shownIndices=${shownIndices}
          .selectedIndices=${this.selectedIndices}
          @queue-list-action=${this.onListAction}
        ></sonos-queue-list>
      </div>
    `;
	}
	async handleQueueItem(index) {
		this.cancelOperation = false;
		await queueAfterCurrent(this.store, this.store.activePlayer, this.queueItems, index, this.progressSetter, this.cancelChecker, () => this.refetchAndScroll());
	}
	async runBatchOp(fn, onDone) {
		this.cancelOperation = false;
		await fn(this.store, this.store.activePlayer, this.queueItems, this.selectedIndices, this.progressSetter, this.cancelChecker, onDone);
	}
	async refetchAndScroll() {
		await this.fetchQueue();
		await this.updateComplete;
		await new Promise((r) => requestAnimationFrame(r));
		const pos = this.store.activePlayer.attributes.queue_position;
		if (pos) this.shadowRoot?.querySelector("sonos-queue-list")?.scrollToItem(pos - 1);
	}
	async exitAndRefetch() {
		this.exitSelectMode();
		await this.refetchAndScroll();
	}
	async onItemClick(displayIndex) {
		if (this.selectMode) return;
		const realIndex = this.showOnlyMatches && this.shownIndices.length > 0 ? this.shownIndices[displayIndex] : displayIndex;
		await this.store.mediaControlService.playQueue(this.store.activePlayer, realIndex);
		this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
	}
	exitSelectMode() {
		this.selectMode = false;
		this.selectedIndices = clearSelection();
	}
	static get styles() {
		return [listStyle, ...queueStyles];
	}
};
__decorate$1([n$5()], QueueSonos.prototype, "store", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "selectMode", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "searchExpanded", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "searchHighlightIndex", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "showOnlyMatches", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "shownIndices", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "selectedIndices", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "queueItems", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "loading", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "operationProgress", void 0);
__decorate$1([r$3()], QueueSonos.prototype, "cancelOperation", void 0);
//#endregion
//#region src/sections/queue/queue-section.ts
var _Queue;
var Queue = class extends i$5 {
	render() {
		return this.store.config.entityPlatform === "music_assistant" ? x`<sonos-queue-mass .store=${this.store}></sonos-queue-mass>` : x`<sonos-queue-sonos .store=${this.store}></sonos-queue-sonos>`;
	}
};
_Queue = Queue;
_Queue.styles = i$8`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
  `;
__decorate$1([n$5()], Queue.prototype, "store", void 0);
//#endregion
//#region src/sections/search/search-utils.ts
var LOCAL_STORAGE_KEY = "sonos-search-state";
var MEDIA_TYPE_ICONS = {
	album: mdiAlbum,
	artist: mdiAccount,
	playlist: mdiPlaylistMusic,
	radio: mdiRadio,
	track: mdiMusic
};
function getMediaTypeIcon(mediaType) {
	return MEDIA_TYPE_ICONS[mediaType] ?? "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z";
}
function toMediaPlayerItem(item) {
	return {
		title: item.subtitle ? `${item.title} ${item.subtitle}` : item.title,
		media_content_id: item.uri,
		media_content_type: item.mediaType,
		thumbnail: item.imageUrl
	};
}
function getSearchTypeLabels(mediaTypes) {
	if (mediaTypes.size === 0) return "all";
	const labelMap = {
		track: "tracks",
		artist: "artists",
		album: "albums",
		playlist: "playlists",
		radio: "radio"
	};
	return Array.from(mediaTypes).map((t) => labelMap[t]).filter(Boolean).join(", ");
}
function saveSearchState(mediaTypes, searchText, libraryFilter, viewMode) {
	const state = {
		mediaTypes: Array.from(mediaTypes),
		searchText,
		libraryFilter,
		viewMode
	};
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}
function restoreSearchState() {
	try {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (saved) {
			const state = JSON.parse(saved);
			return {
				mediaTypes: state.mediaTypes ? new Set(state.mediaTypes) : /* @__PURE__ */ new Set(),
				searchText: state.searchText ?? "",
				libraryFilter: state.libraryFilter ?? "all",
				viewMode: state.viewMode
			};
		}
	} catch {}
	return {
		mediaTypes: new Set(["track"]),
		searchText: "",
		libraryFilter: "all"
	};
}
function cycleLibraryFilter(current) {
	if (current === "all") return "library";
	return current === "library" ? "non-library" : "all";
}
async function toggleMassItemProperty(svc, configEntryId, item, kind) {
	if (kind === "favorite" ? item.favorite : item.inLibrary) return kind === "favorite" ? svc.removeFromFavorites(configEntryId, item.uri, item.mediaType, item.itemId, item.provider) : svc.removeFromLibrary(configEntryId, item.uri, item.mediaType, item.itemId, item.provider);
	return kind === "favorite" ? svc.addToFavorites(configEntryId, item.uri) : svc.addToLibrary(configEntryId, item.uri);
}
var ALL_SEARCH_TYPES = [
	"track",
	"artist",
	"album",
	"playlist",
	"radio"
];
async function performMassSearch(svc, configEntryId, searchText, mediaTypes, libraryFilter, searchLimit) {
	const typesToSearch = mediaTypes.size > 0 ? Array.from(mediaTypes) : ALL_SEARCH_TYPES;
	return svc.searchMultipleTypes(configEntryId, searchText.trim(), typesToSearch, searchLimit, libraryFilter);
}
//#endregion
//#region src/sections/search/search-service.ts
var SearchService = class {
	constructor(host) {
		this.host = host;
	}
	updateHost(state) {
		Object.assign(this.host, state);
	}
	dispose() {
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
	}
	scheduleSearch(searchText, mediaTypes, libraryFilter, config) {
		saveSearchState(mediaTypes, searchText, libraryFilter);
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		const { autoSearchMinChars = 2, autoSearchDebounceMs = 1e3 } = config;
		if (searchText.trim().length < autoSearchMinChars) {
			this.updateHost({
				results: [],
				loading: false
			});
			return;
		}
		this.updateHost({
			loading: true,
			results: []
		});
		this.debounceTimer = setTimeout(() => this.execute(searchText, mediaTypes, libraryFilter, config), autoSearchDebounceMs);
	}
	async execute(searchText, mediaTypes, libraryFilter, config) {
		if (!searchText.trim() || !this.host.massConfigEntryId) return;
		this.updateHost({
			loading: true,
			error: null
		});
		const { searchLimit = 50 } = config;
		try {
			const results = await performMassSearch(this.host.musicAssistantService, this.host.massConfigEntryId, searchText, mediaTypes, libraryFilter, searchLimit);
			this.updateHost({ results });
		} catch (e) {
			this.updateHost({
				error: `Search failed: ${e instanceof Error ? e.message : "Unknown error"}`,
				results: []
			});
		} finally {
			this.updateHost({ loading: false });
		}
	}
	clear(mediaTypes, libraryFilter) {
		this.dispose();
		this.debounceTimer = void 0;
		this.updateHost({
			results: [],
			loading: false,
			error: null
		});
		saveSearchState(mediaTypes, "", libraryFilter);
	}
};
//#endregion
//#region src/sections/search/styles.ts
var searchStyles = [sectionCommonStyles, i$8`
    /* Search uses section-container class name */
    .search-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      outline: none;
      position: relative;
      overflow: hidden;
    }
    .search-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .media-type-icons {
      display: flex;
      gap: 0;
      align-items: center;
    }
    .media-type-icons sonos-icon-button[selected] {
      color: var(--accent-color);
    }
    .separator {
      width: 1px;
      height: 24px;
      background: var(--divider-color, rgba(255, 255, 255, 0.12));
      margin: 0 4px;
    }
    .library-filter-btn {
      display: inline-flex;
      position: relative;
      cursor: pointer;
    }
    .library-filter-btn sonos-icon-button[selected] {
      color: var(--accent-color);
    }
    .library-filter-btn .overlay-icon {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      fill: var(--accent-color);
      pointer-events: none;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--secondary-background-color);
      margin: 0 0.5rem;
      border-radius: 0.5rem;
    }
    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 1rem;
      outline: none;
      padding: 0.5rem;
    }
    .search-bar input::placeholder {
      color: var(--secondary-text-color);
    }
    .config-required {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 2rem;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .config-required ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    .config-required .title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--primary-text-color);
    }
    .browse-header {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 0.25rem;
    }
    .browse-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 1rem;
      font-weight: 500;
    }
    .type-indicator {
      opacity: 0.4;
      pointer-events: none;
    }
    .filter-menu-anchor {
      position: relative;
      display: inline-flex;
    }
    .filter-menu-anchor sonos-icon-button[selected] {
      color: var(--accent-color);
    }
    .filter-menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 10;
      background: var(--card-background-color, var(--primary-background-color));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 180px;
      padding: 4px 0;
    }
    .filter-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }
    .filter-menu-item:hover {
      background: var(--secondary-background-color);
    }
    .filter-menu-item ha-svg-icon {
      --mdc-icon-size: 20px;
      flex-shrink: 0;
    }
    .filter-menu-item span {
      flex: 1;
    }
    .filter-menu-item .check {
      --mdc-icon-size: 18px;
      color: var(--accent-color);
    }
    .filter-menu-divider {
      height: 1px;
      background: var(--divider-color, rgba(255, 255, 255, 0.12));
      margin: 4px 0;
    }
    .filter-menu-done {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      cursor: pointer;
      color: var(--accent-color);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .filter-menu-done:hover {
      background: var(--secondary-background-color);
    }
  `];
var searchResultsStyles = [sectionCommonStyles];
//#endregion
//#region src/sections/search/search-filter-menu.ts
var LIBRARY_LABELS$1 = {
	all: "All",
	library: "Library only",
	"non-library": "Non-library only"
};
var SearchFilterMenu = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.overflowIcons = [];
		this.libraryFilter = "all";
	}
	render() {
		const mediaTypeOverflows = this.overflowIcons.filter((i) => i.type !== "library-filter");
		const hasLibraryFilter = this.overflowIcons.some((i) => i.type === "library-filter");
		return x`
      <div class="filter-menu" @click=${(e) => e.stopPropagation()}>
        ${mediaTypeOverflows.map((icon) => x`
            <div class="filter-menu-item" @click=${() => this.dispatch({
			type: "toggle-media-type",
			mediaType: icon.type
		})}>
              <ha-svg-icon .path=${icon.icon}></ha-svg-icon>
              <span>${icon.title}</span>
              <ha-svg-icon class="check" .path=${mdiCheck} ?hidden=${!this.mediaTypes.has(icon.type)}></ha-svg-icon>
            </div>
          `)}
        ${hasLibraryFilter ? x`
              ${mediaTypeOverflows.length > 0 ? x`<div class="filter-menu-divider"></div>` : E}
              <div class="filter-menu-item" @click=${() => this.dispatch({ type: "toggle-library-filter" })}>
                <ha-svg-icon .path=${mdiBookshelf}></ha-svg-icon>
                <span>${LIBRARY_LABELS$1[this.libraryFilter]}</span>
                <ha-svg-icon class="check" .path=${mdiCheck} ?hidden=${this.libraryFilter === "all"}></ha-svg-icon>
              </div>
            ` : E}
        <div class="filter-menu-divider"></div>
        <div class="filter-menu-done" @click=${() => this.dispatch({ type: "close" })}>Done</div>
      </div>
    `;
	}
	dispatch(action) {
		this.dispatchEvent(customEvent("filter-action", action));
	}
	static get styles() {
		return i$8`
      [hidden] {
        display: none !important;
      }
      .filter-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        background: var(--card-background-color, var(--primary-background-color));
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        min-width: 180px;
        padding: 4px 0;
      }
      .filter-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        cursor: pointer;
        color: var(--primary-text-color);
        font-size: 0.9rem;
      }
      .filter-menu-item:hover {
        background: var(--secondary-background-color);
      }
      .filter-menu-item ha-svg-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }
      .filter-menu-item span {
        flex: 1;
      }
      .filter-menu-item .check {
        --mdc-icon-size: 18px;
        color: var(--accent-color);
      }
      .filter-menu-divider {
        height: 1px;
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        margin: 4px 0;
      }
      .filter-menu-done {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        cursor: pointer;
        color: var(--accent-color);
        font-size: 0.9rem;
        font-weight: 500;
      }
      .filter-menu-done:hover {
        background: var(--secondary-background-color);
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], SearchFilterMenu.prototype, "overflowIcons", void 0);
__decorate$1([n$5({ attribute: false })], SearchFilterMenu.prototype, "mediaTypes", void 0);
__decorate$1([n$5()], SearchFilterMenu.prototype, "libraryFilter", void 0);
customElements.define("sonos-search-filter-menu", SearchFilterMenu);
//#endregion
//#region src/sections/search/search-header.ts
var ALL_HEADER_ICONS = [
	{
		type: "track",
		icon: mdiMusic,
		title: "Tracks"
	},
	{
		type: "artist",
		icon: mdiAccount,
		title: "Artists"
	},
	{
		type: "playlist",
		icon: mdiPlaylistMusic,
		title: "Playlists"
	},
	{
		type: "album",
		icon: mdiAlbum,
		title: "Albums"
	},
	{
		type: "radio",
		icon: mdiRadio,
		title: "Radio"
	},
	{
		type: "library-filter",
		icon: mdiBookshelf,
		title: "Library filter"
	}
];
var ICON_BUTTON_WIDTH = 48;
var LIBRARY_LABELS = {
	all: "All sources",
	library: "Library only",
	"non-library": "Non-library only"
};
var SearchHeader = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.title = "Search";
		this.selectMode = false;
		this.hasSelection = false;
		this.operationProgress = null;
		this.libraryFilter = "all";
		this.viewMode = "list";
		this.filterMenuOpen = false;
		this.visibleCount = ALL_HEADER_ICONS.length;
	}
	firstUpdated() {
		this.resizeObserver = new ResizeObserver(() => this.calculateVisibleCount());
		this.resizeObserver.observe(this);
		requestAnimationFrame(() => this.calculateVisibleCount());
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this.resizeObserver?.disconnect();
	}
	calculateVisibleCount() {
		const hostWidth = this.clientWidth;
		if (!hostWidth) return;
		const headerPadding = 16;
		const titleMinWidth = 60;
		const fixedButtonsWidth = ICON_BUTTON_WIDTH * 2;
		const total = ALL_HEADER_ICONS.length;
		if (hostWidth - headerPadding - titleMinWidth - fixedButtonsWidth >= total * ICON_BUTTON_WIDTH) {
			if (this.visibleCount !== total) this.visibleCount = total;
			return;
		}
		const dotsAndSep = ICON_BUTTON_WIDTH + 9;
		const available = hostWidth - headerPadding - titleMinWidth - fixedButtonsWidth - dotsAndSep;
		const count = Math.max(0, Math.min(total, Math.floor(available / ICON_BUTTON_WIDTH)));
		if (this.visibleCount !== count) this.visibleCount = count;
	}
	get visibleIcons() {
		return ALL_HEADER_ICONS.slice(0, this.visibleCount);
	}
	get overflowIcons() {
		return ALL_HEADER_ICONS.slice(this.visibleCount);
	}
	isIconActive(icon) {
		if (icon.type === "library-filter") return this.libraryFilter !== "all";
		return this.mediaTypes.has(icon.type);
	}
	onIconClick(icon) {
		if (icon.type === "library-filter") this.dispatch({ type: "toggle-library-filter" });
		else this.dispatch({
			type: "toggle-media-type",
			mediaType: icon.type
		});
	}
	getIconTitle(icon) {
		if (icon.type === "library-filter") return LIBRARY_LABELS[this.libraryFilter];
		return `Search ${icon.title}`;
	}
	render() {
		const hasOverflow = this.overflowIcons.length > 0;
		const playerName = getSpeakerList(this.store.activePlayer, this.store.predefinedGroups);
		const hideActivePlayerName = this.store.config.search?.hideActivePlayerName ?? false;
		return x`
      <div class="header">
        <div class="title-container">
          <div class="title-text">
            <span class="title">${this.title}</span>
            <span class="player-name" ?hidden=${hideActivePlayerName}>${playerName}</span>
          </div>
        </div>
        <div class="header-icons">
          <div class="media-type-icons" ?hidden=${this.selectMode}>
            ${this.visibleIcons.map((icon) => x`
                <sonos-icon-button
                  .path=${icon.icon}
                  @click=${() => this.onIconClick(icon)}
                  ?selected=${this.isIconActive(icon)}
                  title=${this.getIconTitle(icon)}
                ></sonos-icon-button>
              `)}
            ${hasOverflow ? x`
                  <div class="separator" ?hidden=${this.visibleCount === 0}></div>
                  <div class="filter-menu-anchor">
                    <sonos-icon-button
                      .path=${mdiDotsVertical}
                      @click=${() => this.filterMenuOpen = !this.filterMenuOpen}
                      title="More filters"
                      ?selected=${this.overflowIcons.some((i) => this.isIconActive(i))}
                    ></sonos-icon-button>
                    <sonos-search-filter-menu
                      ?hidden=${!this.filterMenuOpen}
                      .overflowIcons=${this.overflowIcons}
                      .mediaTypes=${this.mediaTypes}
                      .libraryFilter=${this.libraryFilter}
                      @filter-action=${this.handleFilterAction}
                    ></sonos-search-filter-menu>
                  </div>
                ` : E}
          </div>
          <sonos-selection-actions
            ?hidden=${!this.selectMode}
            .hasSelection=${this.hasSelection}
            .disabled=${this.operationProgress !== null}
            .showInvert=${this.hasSelection}
            @invert-selection=${() => this.dispatch({ type: "invert-selection" })}
            @play-selected=${(e) => this.dispatch({
			type: "selection-action",
			action: e.detail
		})}
            @queue-selected=${(e) => this.dispatch({
			type: "selection-action",
			action: e.detail
		})}
            @queue-selected-at-end=${(e) => this.dispatch({
			type: "selection-action",
			action: e.detail
		})}
          ></sonos-selection-actions>
          <sonos-icon-button
            .path=${this.viewMode === "list" ? mdiViewGrid : mdiViewList}
            @click=${() => this.dispatch({ type: "toggle-view-mode" })}
            title=${this.viewMode === "list" ? "Grid view" : "List view"}
          ></sonos-icon-button>
          <sonos-icon-button
            .path=${mdiCheckboxMultipleMarkedOutline}
            @click=${() => this.dispatch({ type: "toggle-select-mode" })}
            ?selected=${this.selectMode}
            title="Select mode"
          ></sonos-icon-button>
        </div>
      </div>
    `;
	}
	handleFilterAction(e) {
		const action = e.detail;
		if (action.type === "close") {
			this.filterMenuOpen = false;
			return;
		}
		this.dispatch(action);
	}
	dispatch(action) {
		this.dispatchEvent(customEvent("header-action", action));
	}
	static get styles() {
		return i$8`
      :host {
        display: block;
        flex-shrink: 0;
      }
      [hidden] {
        display: none !important;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
      }
      .title-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
        padding: 0.5rem;
      }
      .title-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 0;
      }
      .title {
        font-size: calc(var(--sonos-font-size, 1rem) * 1.2);
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .player-name {
        font-size: calc(var(--sonos-font-size, 1rem) * 0.85);
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .header-icons {
        display: flex;
        align-items: center;
      }
      .media-type-icons {
        display: flex;
        gap: 0;
        align-items: center;
      }
      .media-type-icons sonos-icon-button[selected] {
        color: var(--accent-color);
      }
      .separator {
        width: 1px;
        height: 24px;
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        margin: 0 4px;
      }
      .filter-menu-anchor {
        position: relative;
        display: inline-flex;
      }
      .filter-menu-anchor sonos-icon-button[selected] {
        color: var(--accent-color);
      }
    `;
	}
};
__decorate$1([n$5()], SearchHeader.prototype, "title", void 0);
__decorate$1([n$5({ attribute: false })], SearchHeader.prototype, "mediaTypes", void 0);
__decorate$1([n$5({ type: Boolean })], SearchHeader.prototype, "selectMode", void 0);
__decorate$1([n$5({ type: Boolean })], SearchHeader.prototype, "hasSelection", void 0);
__decorate$1([n$5({ attribute: false })], SearchHeader.prototype, "operationProgress", void 0);
__decorate$1([n$5()], SearchHeader.prototype, "libraryFilter", void 0);
__decorate$1([n$5()], SearchHeader.prototype, "viewMode", void 0);
__decorate$1([n$5({ attribute: false })], SearchHeader.prototype, "store", void 0);
__decorate$1([r$3()], SearchHeader.prototype, "filterMenuOpen", void 0);
__decorate$1([r$3()], SearchHeader.prototype, "visibleCount", void 0);
customElements.define("sonos-search-header", SearchHeader);
//#endregion
//#region src/sections/search/search-bar.ts
var SearchBar = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.searchText = "";
	}
	render() {
		return x`
      <div class="search-bar">
        <sonos-icon-button .path=${mdiMagnify} @click=${() => this.dispatchEvent(customEvent("search-submit"))}></sonos-icon-button>
        <input type="text" placeholder="Search ${getSearchTypeLabels(this.mediaTypes)}..." .value=${this.searchText} @input=${this.onInput} @keydown=${this.onKeyDown} />
        <sonos-icon-button
          .path=${mdiClose}
          @click=${() => this.dispatchEvent(customEvent("clear-search"))}
          title="Clear"
          ?hidden=${!this.searchText}
        ></sonos-icon-button>
      </div>
    `;
	}
	focusInput() {
		this.updateComplete.then(() => this.input?.focus());
	}
	onInput(e) {
		const input = e.target;
		this.dispatchEvent(customEvent("search-input", input.value));
	}
	onKeyDown(e) {
		if (e.key === "Enter") this.dispatchEvent(customEvent("search-submit"));
	}
	static get styles() {
		return i$8`
      :host {
        display: block;
        flex-shrink: 0;
      }
      [hidden] {
        display: none !important;
      }
      .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--secondary-background-color);
        margin: 0 0.5rem;
        border-radius: 0.5rem;
      }
      .search-bar input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 1rem;
        outline: none;
        padding: 0.5rem;
      }
      .search-bar input::placeholder {
        color: var(--secondary-text-color);
      }
    `;
	}
};
__decorate$1([n$5()], SearchBar.prototype, "searchText", void 0);
__decorate$1([n$5({ attribute: false })], SearchBar.prototype, "mediaTypes", void 0);
__decorate$1([e$3("input")], SearchBar.prototype, "input", void 0);
customElements.define("sonos-search-bar", SearchBar);
//#endregion
//#region src/sections/search/search-batch-utils.ts
function getSelectedItems(results, selectedIndices) {
	return Array.from(selectedIndices).sort((a, b) => a - b).map((i) => toMediaPlayerItem(results[i]));
}
async function executeBatchPlay(store, musicAssistantService, items, firstSelectedItem, enqueue, radioMode, callbacks) {
	if (radioMode) {
		await musicAssistantService.playMedia(store.activePlayer, firstSelectedItem.uri, enqueue, true);
		callbacks.onComplete();
		return;
	}
	await runBatch((onProgress, shouldCancel) => store.mediaControlService.queueAndPlay(store.activePlayer, items, enqueue === "replace" ? "replace" : "play", onProgress, shouldCancel), {
		current: 0,
		total: items.length,
		label: "Loading"
	}, callbacks);
}
async function executeBatchQueue(store, items, playMode, callbacks) {
	await runBatch((onProgress, shouldCancel) => queueItemsAfterCurrent(items, (item) => store.mediaControlService.playMedia(store.activePlayer, item, playMode), onProgress, shouldCancel), {
		current: 0,
		total: items.length,
		label: "Queueing"
	}, callbacks);
}
async function runBatch(operation, initialProgress, callbacks) {
	callbacks.setProgress(initialProgress);
	try {
		await operation((completed) => callbacks.setProgress({
			...initialProgress,
			current: completed
		}), callbacks.shouldCancel);
		if (!callbacks.shouldCancel()) callbacks.onComplete();
	} finally {
		callbacks.setProgress(null);
	}
}
//#endregion
//#region src/sections/search/search-results.ts
var SearchResults = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.results = [];
		this.loading = false;
		this.error = null;
		this.selectMode = false;
		this.searchText = "";
		this.viewMode = "list";
		this.massQueueConfigEntryId = "";
		this.selectedIndices = /* @__PURE__ */ new Set();
		this.favoriteLoadingIndices = /* @__PURE__ */ new Set();
		this.libraryLoadingIndices = /* @__PURE__ */ new Set();
		this.playMenuItemIndex = null;
		this.operationProgress = null;
		this.cancelOperation = false;
	}
	render() {
		const hasContent = !this.loading && !this.error && this.results.length > 0;
		const autoSearchMinChars = this.store.config.search?.autoSearchMinChars ?? 2;
		const tooShort = this.searchText && this.searchText.trim().length < autoSearchMinChars;
		const noResults = !this.loading && this.results.length === 0 && this.searchText && !tooShort;
		const emptyPrompt = !this.loading && this.results.length === 0 && !this.searchText;
		return x`
      <sonos-operation-overlay
        .progress=${this.operationProgress}
        .hass=${this.store.hass}
        @cancel-operation=${() => this.cancelOperation = true}
      ></sonos-operation-overlay>
      <div class="loading" ?hidden=${!this.loading}><ha-spinner></ha-spinner></div>
      <div class="error-message" ?hidden=${!this.error}>${this.error}</div>
      <div class="no-results" ?hidden=${!tooShort}>Type at least ${autoSearchMinChars} characters to search</div>
      <div class="no-results" ?hidden=${!noResults}>No results found</div>
      <div class="no-results" ?hidden=${!emptyPrompt}>Enter a search term</div>
      ${this.viewMode === "grid" ? this.renderGrid(hasContent) : this.renderList(hasContent)}
      <div
        class="play-menu-overlay"
        ?hidden=${this.playMenuItemIndex === null}
        @click=${() => this.playMenuItemIndex = null}
        @wheel=${(e) => e.preventDefault()}
        @touchmove=${(e) => e.preventDefault()}
      >
        <sonos-play-menu
          .hasSelection=${true}
          .inline=${true}
          @play-menu-action=${(e) => this.handleItemPlayAction(e)}
          @play-menu-close=${() => this.playMenuItemIndex = null}
        ></sonos-play-menu>
      </div>
    `;
	}
	renderList(hasContent) {
		return x`
      <div class="list" ?hidden=${!hasContent}>
        <mwc-list multi>
          ${this.results.map((item, index) => {
			return x`
              <sonos-media-row
                @click=${() => this.onItemClick(index)}
                .item=${toMediaPlayerItem(item)}
                .showCheckbox=${this.selectMode}
                .checked=${this.selectedIndices.has(index)}
                .isFavorite=${item.favorite ?? null}
                .favoriteLoading=${this.favoriteLoadingIndices.has(index)}
                .isInLibrary=${item.inLibrary ?? null}
                .libraryLoading=${this.libraryLoadingIndices.has(index)}
                @checkbox-change=${(e) => this.onCheckboxChange(index, e.detail.checked)}
                @favorite-toggle=${() => this.toggleItemState(index, "favorite")}
                @library-toggle=${() => this.toggleItemState(index, "library")}
                .store=${this.store}
              ></sonos-media-row>
            `;
		})}
        </mwc-list>
      </div>
    `;
	}
	renderGrid(hasContent) {
		const columns = this.store.config.search?.gridColumns ?? 4;
		return x`
      <div class="grid-scroll" ?hidden=${!hasContent}>
        <div class="grid" style="grid-template-columns: repeat(${columns}, minmax(0, 1fr))">
          ${this.results.map((item, index) => {
			const selected = this.selectedIndices.has(index);
			return x`
              <div class="grid-tile ${selected ? "selected" : ""}" @click=${() => this.onItemClick(index)}>
                ${this.selectMode ? x`<ha-checkbox
                      class="grid-checkbox"
                      .checked=${selected}
                      @change=${(e) => this.onCheckboxChange(index, e.target.checked)}
                      @click=${(e) => e.stopPropagation()}
                    ></ha-checkbox>` : ""}
                ${item.imageUrl ? x`<img class="grid-img" src="${item.imageUrl}" alt="${item.title}" loading="lazy" />` : x`<div class="grid-placeholder"><ha-svg-icon .path=${getMediaTypeIcon(item.mediaType)}></ha-svg-icon></div>`}
                <div class="grid-info">
                  <div class="grid-title">${item.title}</div>
                  ${item.subtitle ? x`<div class="grid-subtitle">${item.subtitle}</div>` : ""}
                </div>
              </div>
            `;
		})}
        </div>
      </div>
    `;
	}
	get hasSelection() {
		return this.selectedIndices.size > 0;
	}
	handleInvertSelection() {
		this.selectedIndices = invertSelection(this.selectedIndices, this.results.length);
	}
	clearSelectionState() {
		this.selectedIndices = clearSelection();
		this.playMenuItemIndex = null;
	}
	async executeSelectionAction(detail) {
		const enqueue = detail.enqueue ?? "play";
		const radioMode = detail.radioMode ?? false;
		const items = getSelectedItems(this.results, this.selectedIndices);
		if (items.length === 0) return;
		this.cancelOperation = false;
		const callbacks = {
			setProgress: (p) => this.operationProgress = p,
			shouldCancel: () => this.cancelOperation,
			onComplete: () => {
				this.selectedIndices = clearSelection();
				this.dispatchEvent(customEvent("has-selection-change", false));
				this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
			}
		};
		if (enqueue === "next" || enqueue === "replace_next" || enqueue === "add") await executeBatchQueue(this.store, items, enqueue === "add" ? "add" : "next", callbacks);
		else {
			const firstIndex = Array.from(this.selectedIndices).sort((a, b) => a - b)[0];
			await executeBatchPlay(this.store, this.musicAssistantService, items, this.results[firstIndex], enqueue, radioMode, callbacks);
		}
	}
	onItemClick(index) {
		const item = this.results[index];
		if (!item) return;
		if (this.selectMode) {
			this.selectedIndices = updateSelection(this.selectedIndices, index, !this.selectedIndices.has(index));
			this.dispatchEvent(customEvent("has-selection-change", this.selectedIndices.size > 0));
			return;
		}
		if (item.mediaType === "album" || item.mediaType === "playlist" || item.mediaType === "artist") {
			this.dispatchEvent(customEvent("browse-collection", item));
			return;
		}
		this.playMenuItemIndex = this.playMenuItemIndex === index ? null : index;
	}
	async handleItemPlayAction(e) {
		const item = this.results[this.playMenuItemIndex];
		if (!item) return;
		this.playMenuItemIndex = null;
		await this.musicAssistantService.playMedia(this.store.activePlayer, item.uri, e.detail.enqueue, e.detail.radioMode);
		this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
	}
	onCheckboxChange(index, checked) {
		this.selectedIndices = updateSelection(this.selectedIndices, index, checked);
		this.dispatchEvent(customEvent("has-selection-change", this.selectedIndices.size > 0));
	}
	async toggleItemState(index, kind) {
		if (!this.massQueueConfigEntryId || !this.results[index]) return;
		const item = this.results[index];
		this.setItemLoading(index, kind, true);
		try {
			if (await toggleMassItemProperty(this.musicAssistantService, this.massQueueConfigEntryId, item, kind)) {
				const currentValue = kind === "favorite" ? item.favorite : item.inLibrary;
				const newResults = [...this.results];
				newResults[index] = {
					...item,
					[kind === "favorite" ? "favorite" : "inLibrary"]: !currentValue
				};
				this.dispatchEvent(customEvent("results-updated", newResults));
			}
		} finally {
			this.setItemLoading(index, kind, false);
		}
	}
	setItemLoading(index, kind, loading) {
		const prop = kind === "favorite" ? "favoriteLoadingIndices" : "libraryLoadingIndices";
		const next = new Set(this[prop]);
		if (loading) next.add(index);
		else next.delete(index);
		this[prop] = next;
	}
	static get styles() {
		return [...searchResultsStyles, i$8`
        :host {
          flex: 1;
          min-height: 0;
          position: relative;
          overflow: hidden;
        }
        .grid-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }
        .grid {
          display: grid;
          gap: 0.75rem;
          padding: 0.75rem;
        }
        .grid-tile {
          cursor: pointer;
          border-radius: 8px;
          background: var(--secondary-background-color);
          position: relative;
          transition: outline 0.15s;
          overflow: hidden;
          min-width: 0;
        }
        .grid-tile:hover {
          outline: 2px solid var(--divider-color, rgba(255, 255, 255, 0.2));
        }
        .grid-tile.selected {
          outline: 2px solid var(--accent-color);
        }
        .grid-checkbox {
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: 1;
          --mdc-checkbox-unchecked-color: var(--secondary-text-color);
        }
        .grid-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: block;
          object-fit: cover;
          background-color: var(--primary-background-color);
          border-radius: 8px 8px 0 0;
        }
        .grid-placeholder {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-background-color);
          border-radius: 8px 8px 0 0;
        }
        .grid-placeholder ha-svg-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          --mdc-icon-size: 40px;
          color: var(--secondary-text-color);
          opacity: 0.4;
        }
        .grid-info {
          padding: 8px;
        }
        .grid-title {
          font-size: calc(var(--sonos-font-size, 1rem) * 0.85);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--primary-text-color);
        }
        .grid-subtitle {
          font-size: calc(var(--sonos-font-size, 1rem) * 0.75);
          color: var(--secondary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 2px;
        }
      `];
	}
};
__decorate$1([n$5({ attribute: false })], SearchResults.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], SearchResults.prototype, "results", void 0);
__decorate$1([n$5({ type: Boolean })], SearchResults.prototype, "loading", void 0);
__decorate$1([n$5()], SearchResults.prototype, "error", void 0);
__decorate$1([n$5({ type: Boolean })], SearchResults.prototype, "selectMode", void 0);
__decorate$1([n$5()], SearchResults.prototype, "searchText", void 0);
__decorate$1([n$5()], SearchResults.prototype, "viewMode", void 0);
__decorate$1([n$5({ attribute: false })], SearchResults.prototype, "musicAssistantService", void 0);
__decorate$1([n$5()], SearchResults.prototype, "massQueueConfigEntryId", void 0);
__decorate$1([r$3()], SearchResults.prototype, "selectedIndices", void 0);
__decorate$1([r$3()], SearchResults.prototype, "favoriteLoadingIndices", void 0);
__decorate$1([r$3()], SearchResults.prototype, "libraryLoadingIndices", void 0);
__decorate$1([r$3()], SearchResults.prototype, "playMenuItemIndex", void 0);
__decorate$1([r$3()], SearchResults.prototype, "operationProgress", void 0);
__decorate$1([r$3()], SearchResults.prototype, "cancelOperation", void 0);
customElements.define("sonos-search-results", SearchResults);
//#endregion
//#region src/sections/search/search-browse-view.ts
var SearchBrowseView = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.item = null;
		this.massQueueConfigEntryId = "";
		this.browseResults = [];
		this.browseLoading = false;
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("item") && this.item) this.loadCollection();
	}
	render() {
		if (!this.item) return x``;
		const typeIcon = getMediaTypeIcon(this.item.mediaType);
		return x`
      <div class="header browse-header">
        <sonos-icon-button .path=${mdiArrowLeft} @click=${this.goBack} title="Back to results"></sonos-icon-button>
        <ha-dropdown @wa-select=${this.handlePlayMenuAction}>
          <sonos-icon-button slot="trigger" .path=${mdiPlay} title="Play options"></sonos-icon-button>
          <ha-dropdown-item value="0">
            <ha-svg-icon slot="icon" .path=${mdiPlayBoxMultiple}></ha-svg-icon>
            Play Now (clear queue)
          </ha-dropdown-item>
          <ha-dropdown-item value="1">
            <ha-svg-icon slot="icon" .path=${mdiAccessPoint}></ha-svg-icon>
            Start Radio
          </ha-dropdown-item>
          <ha-dropdown-item value="2">
            <ha-svg-icon slot="icon" .path=${mdiPlay}></ha-svg-icon>
            Play Now
          </ha-dropdown-item>
          <ha-dropdown-item value="3">
            <ha-svg-icon slot="icon" .path=${mdiSkipNext}></ha-svg-icon>
            Play Next
          </ha-dropdown-item>
          <ha-dropdown-item value="4">
            <ha-svg-icon slot="icon" .path=${mdiPlaylistPlus}></ha-svg-icon>
            Add to Queue
          </ha-dropdown-item>
          <ha-dropdown-item value="5">
            <ha-svg-icon slot="icon" .path=${mdiSkipNextCircle}></ha-svg-icon>
            Play Next (clear queue)
          </ha-dropdown-item>
        </ha-dropdown>
        <span class="browse-title" title=${this.item.title}>${this.item.title}</span>
        <sonos-icon-button .path=${typeIcon} disabled class="type-indicator"></sonos-icon-button>
      </div>
      <div class="loading" ?hidden=${!this.browseLoading}><ha-spinner></ha-spinner></div>
      <div class="no-results" ?hidden=${this.browseLoading || this.browseResults.length > 0}>No items found</div>
      <div class="list" ?hidden=${this.browseLoading || this.browseResults.length === 0}>
        <mwc-list multi>
          ${this.browseResults.map((browseItem, index) => {
			return x` <sonos-media-row @click=${() => this.onBrowseItemClick(index)} .item=${toMediaPlayerItem(browseItem)} .store=${this.store}></sonos-media-row> `;
		})}
        </mwc-list>
      </div>
    `;
	}
	async loadCollection() {
		this.browseLoading = true;
		this.browseResults = [];
		try {
			this.browseResults = await this.musicAssistantService.getCollectionItems(this.item.uri, this.item.mediaType, this.massQueueConfigEntryId);
		} catch (e) {
			console.error("Failed to browse collection:", e);
		} finally {
			this.browseLoading = false;
		}
	}
	goBack() {
		this.browseResults = [];
		this.browseLoading = false;
		this.dispatchEvent(customEvent("go-back"));
	}
	async onBrowseItemClick(index) {
		const browseItem = this.browseResults[index];
		if (!browseItem) return;
		await this.store.mediaControlService.playMedia(this.store.activePlayer, toMediaPlayerItem(browseItem), "play");
		this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
	}
	handlePlayMenuAction(e) {
		const action = [
			{ enqueue: "replace" },
			{
				enqueue: "play",
				radioMode: true
			},
			{ enqueue: "play" },
			{ enqueue: "next" },
			{ enqueue: "add" },
			{ enqueue: "replace_next" }
		][parseInt(e.detail.item.value)];
		if (action && this.item) {
			this.musicAssistantService.playMedia(this.store.activePlayer, this.item.uri, action.enqueue, action.radioMode);
			this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED));
		}
	}
	static get styles() {
		return [listStyle, i$8`
        :host {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        [hidden] {
          display: none !important;
        }
        .browse-header {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 0.25rem;
        }
        .browse-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 1rem;
          font-weight: 500;
        }
        .type-indicator {
          opacity: 0.4;
          pointer-events: none;
        }
        .loading {
          display: flex;
          justify-content: center;
          padding: 2rem;
        }
        .no-results {
          text-align: center;
          padding: 2rem;
          color: var(--secondary-text-color);
        }
        .list {
          overflow-y: auto;
          overflow-x: hidden;
          flex: 1;
          min-height: 0;
        }
      `];
	}
};
__decorate$1([n$5({ attribute: false })], SearchBrowseView.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], SearchBrowseView.prototype, "item", void 0);
__decorate$1([n$5({ attribute: false })], SearchBrowseView.prototype, "musicAssistantService", void 0);
__decorate$1([n$5()], SearchBrowseView.prototype, "massQueueConfigEntryId", void 0);
__decorate$1([r$3()], SearchBrowseView.prototype, "browseResults", void 0);
__decorate$1([r$3()], SearchBrowseView.prototype, "browseLoading", void 0);
customElements.define("sonos-search-browse-view", SearchBrowseView);
//#endregion
//#region src/sections/search/search-section.ts
var Search = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.mediaTypes = /* @__PURE__ */ new Set();
		this.searchText = "";
		this.libraryFilter = "all";
		this.results = [];
		this.loading = false;
		this.error = null;
		this.discoveryComplete = false;
		this.browsingItem = null;
		this.selectMode = false;
		this.hasSelection = false;
		this.viewMode = "list";
	}
	connectedCallback() {
		super.connectedCallback();
		const restored = restoreSearchState();
		Object.assign(this, restored);
		if (!restored.viewMode) this.viewMode = this.store?.config?.search?.defaultViewMode ?? "list";
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this.searchService?.dispose();
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("store") && !this.searchService) {
			this.musicAssistantService = new MusicAssistantService(this.store.hass);
			this.searchService = new SearchService(this);
			this.discoverConfigEntry();
			const { defaultMediaType } = this.searchConfig;
			if (this.mediaTypes.size === 0 && defaultMediaType && defaultMediaType !== "none") this.mediaTypes = new Set([defaultMediaType]);
		}
	}
	async discoverConfigEntry() {
		const { massConfigEntryId: configuredId } = this.searchConfig;
		this.massConfigEntryId = configuredId ?? await this.musicAssistantService.discoverConfigEntryId();
		this.massQueueConfigEntryId = await this.musicAssistantService.discoverMassQueueConfigEntryId();
		this.discoveryComplete = true;
		if (this.searchText && this.massConfigEntryId) this.searchService.execute(this.searchText, this.mediaTypes, this.libraryFilter, this.searchConfig);
	}
	render() {
		if (this.store.config.entityPlatform !== "music_assistant") return x`<div class="search-container">
        <div class="config-required">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="title">Music Assistant Required</div>
          <div>Search requires <code>entityPlatform: music_assistant</code> in the card configuration.</div>
        </div>
      </div>`;
		if (!this.discoveryComplete) return x`<div class="search-container">
        <div class="loading"><ha-spinner></ha-spinner></div>
      </div>`;
		if (!this.massConfigEntryId) return x`<div class="search-container">
        <div class="config-required">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="title">Music Assistant Not Found</div>
          <div>Could not discover Music Assistant. Configure <code>massConfigEntryId</code> in search settings.</div>
        </div>
      </div>`;
		const { title } = this.searchConfig;
		return x`
      <div class="search-container" @keydown=${this.onKeyDown} tabindex="-1">
        <sonos-search-browse-view
          ?hidden=${!this.browsingItem}
          .store=${this.store}
          .item=${this.browsingItem}
          .musicAssistantService=${this.musicAssistantService}
          .massQueueConfigEntryId=${this.massQueueConfigEntryId}
          @go-back=${() => this.browsingItem = null}
        ></sonos-search-browse-view>
        <div class="search-content" ?hidden=${!!this.browsingItem}>
          <sonos-search-header
            .title=${title ?? "Search"}
            .mediaTypes=${this.mediaTypes}
            .selectMode=${this.selectMode}
            .hasSelection=${this.hasSelection}
            .libraryFilter=${this.libraryFilter}
            .viewMode=${this.viewMode}
            .store=${this.store}
            @header-action=${this.handleHeaderAction}
          ></sonos-search-header>
          <sonos-search-bar
            .searchText=${this.searchText}
            .mediaTypes=${this.mediaTypes}
            @search-input=${(e) => this.onSearchInput(e.detail)}
            @search-submit=${() => this.searchService.execute(this.searchText, this.mediaTypes, this.libraryFilter, this.searchConfig)}
            @clear-search=${this.clearSearch}
          ></sonos-search-bar>
          <sonos-search-results
            .store=${this.store}
            .results=${this.results}
            .loading=${this.loading}
            .error=${this.error}
            .selectMode=${this.selectMode}
            .searchText=${this.searchText}
            .viewMode=${this.viewMode}
            .musicAssistantService=${this.musicAssistantService}
            .massQueueConfigEntryId=${this.massQueueConfigEntryId}
            @browse-collection=${(e) => this.browsingItem = e.detail}
            @has-selection-change=${(e) => this.hasSelection = e.detail}
            @results-updated=${(e) => this.results = e.detail}
          ></sonos-search-results>
        </div>
      </div>
    `;
	}
	get searchConfig() {
		return this.store.config.search ?? {};
	}
	handleHeaderAction({ detail }) {
		if (detail.type === "toggle-media-type") this.toggleMediaType(detail.mediaType);
		else if (detail.type === "toggle-select-mode") this.toggleSelectMode();
		else if (detail.type === "toggle-library-filter") this.handleToggleLibraryFilter();
		else if (detail.type === "toggle-view-mode") this.toggleViewMode();
		else if (detail.type === "invert-selection") this.searchResults?.handleInvertSelection();
		else if (detail.type === "selection-action") this.searchResults?.executeSelectionAction(detail.action);
	}
	toggleMediaType(type) {
		const newTypes = new Set(this.mediaTypes);
		if (newTypes.has(type)) newTypes.delete(type);
		else newTypes.add(type);
		this.mediaTypes = newTypes;
		this.searchService.scheduleSearch(this.searchText, this.mediaTypes, this.libraryFilter, this.searchConfig);
		this.searchBar?.focusInput();
	}
	handleToggleLibraryFilter() {
		this.libraryFilter = cycleLibraryFilter(this.libraryFilter);
		this.searchService.scheduleSearch(this.searchText, this.mediaTypes, this.libraryFilter, this.searchConfig);
	}
	toggleSelectMode() {
		this.selectMode = !this.selectMode;
		this.searchResults?.clearSelectionState();
		this.hasSelection = false;
	}
	toggleViewMode() {
		this.viewMode = this.viewMode === "list" ? "grid" : "list";
		saveSearchState(this.mediaTypes, this.searchText, this.libraryFilter, this.viewMode);
	}
	onSearchInput(value) {
		this.searchText = value;
		this.searchService.scheduleSearch(this.searchText, this.mediaTypes, this.libraryFilter, this.searchConfig);
	}
	clearSearch() {
		this.searchService.clear(this.mediaTypes, this.libraryFilter);
		this.searchText = "";
		this.searchBar?.focusInput();
	}
	onKeyDown(e) {
		if (e.key === "Escape" && this.selectMode) this.toggleSelectMode();
	}
	static get styles() {
		return searchStyles;
	}
};
__decorate$1([n$5()], Search.prototype, "store", void 0);
__decorate$1([r$3()], Search.prototype, "mediaTypes", void 0);
__decorate$1([r$3()], Search.prototype, "searchText", void 0);
__decorate$1([r$3()], Search.prototype, "libraryFilter", void 0);
__decorate$1([r$3()], Search.prototype, "results", void 0);
__decorate$1([r$3()], Search.prototype, "loading", void 0);
__decorate$1([r$3()], Search.prototype, "error", void 0);
__decorate$1([r$3()], Search.prototype, "massConfigEntryId", void 0);
__decorate$1([r$3()], Search.prototype, "massQueueConfigEntryId", void 0);
__decorate$1([r$3()], Search.prototype, "discoveryComplete", void 0);
__decorate$1([r$3()], Search.prototype, "browsingItem", void 0);
__decorate$1([r$3()], Search.prototype, "selectMode", void 0);
__decorate$1([r$3()], Search.prototype, "hasSelection", void 0);
__decorate$1([r$3()], Search.prototype, "viewMode", void 0);
__decorate$1([e$3("sonos-search-results")], Search.prototype, "searchResults", void 0);
__decorate$1([e$3("sonos-search-bar")], Search.prototype, "searchBar", void 0);
//#endregion
//#region src/sections/volumes/sleep-timer.ts
var SleepTimer = class extends i$5 {
	render() {
		const hassService = this.store.hassService;
		if (this.player.attributes.platform !== "sonos") return x``;
		return x`
      <div id="sleepTimer">
        <sonos-icon-button id="sleepTimerAlarm" .path=${mdiAlarm}></sonos-icon-button>
        <label for="sleepTimer">Sleep Timer (s)</label>
        <input type="number" id="sleepTimerInput" min="0" max="7200" value="300" />
        <sonos-icon-button
          id="sleepTimerSubmit"
          .path=${mdiCheckCircle}
          @click=${() => hassService.setSleepTimer(this.player, this.sleepTimer.valueAsNumber)}
        ></sonos-icon-button>
        <sonos-icon-button id="sleepTimerCancel" .path=${mdiCloseCircle} @click=${() => hassService.cancelSleepTimer(this.player)}></sonos-icon-button>
      </div>
    `;
	}
	static get styles() {
		return i$8`
      #sleepTimer {
        display: flex;
        color: var(--primary-text-color);
        gap: 0.5em;
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
};
__decorate$1([n$5({ attribute: false })], SleepTimer.prototype, "store", void 0);
__decorate$1([n$5({ attribute: false })], SleepTimer.prototype, "player", void 0);
__decorate$1([e$3("#sleepTimerInput")], SleepTimer.prototype, "sleepTimer", void 0);
customElements.define("sonos-sleep-timer", SleepTimer);
//#endregion
//#region src/sections/volumes/volumes-section.ts
var Volumes = class extends i$5 {
	constructor(..._args) {
		super(..._args);
		this.showSwitches = {};
	}
	render() {
		const members = this.store.activePlayer.members;
		const showAll = members.length > 1;
		const hideActivePlayerName = this.store.config.volumes?.hideActivePlayerName ?? false;
		const playerName = showAll && !hideActivePlayerName ? getSpeakerList(this.store.activePlayer, this.store.predefinedGroups) : "";
		return x`
      <div ?hidden=${!showAll}>${showAll ? this.volumeWithName(this.store.activePlayer, true, playerName) : E}</div>
      ${members.map((member) => this.volumeWithName(member, false))}
    `;
	}
	volumeWithName(player, updateMembers = true, groupName = "") {
		const { labelForAllSlider, hideCogwheel } = this.store.config.volumes ?? {};
		const { showVolumeUpAndDownButtons } = this.store.config.player ?? {};
		const name = updateMembers ? labelForAllSlider ?? "All" : player.name;
		const volDown = async () => await this.store.mediaControlService.volumeDown(player, updateMembers);
		const volUp = async () => await this.store.mediaControlService.volumeUp(player, updateMembers);
		const hideSwitches = updateMembers || !this.showSwitches[player.id];
		const sliderHeight = this.store.config.volumeSliderHeight;
		const buttonStyle = sliderHeight ? `height: ${sliderHeight}rem;--icon-button-size: ${sliderHeight}rem;--icon-size: ${sliderHeight * .75}rem;` : "";
		return x` <div class="row">
      <div class="volume-name">
        ${updateMembers && groupName ? x`
              <div class="volume-name-text grouped-name">
                <span class="grouped-name-prefix">${name} (</span>
                <span class="grouped-name-main">${groupName}</span>
                <span class="grouped-name-suffix">)</span>
              </div>
            ` : x`<div class="volume-name-text">${name}</div>`}
      </div>
      <div class="slider-row">
        <sonos-icon-button
          .disabled=${player.ignoreVolume}
          ?hidden=${!showVolumeUpAndDownButtons}
          @click=${volDown}
          .path=${mdiVolumeMinus}
          style=${buttonStyle}
        ></sonos-icon-button>
        <sonos-volume .store=${this.store} .player=${player} .updateMembers=${updateMembers}></sonos-volume>
        <sonos-icon-button
          .disabled=${player.ignoreVolume}
          ?hidden=${!showVolumeUpAndDownButtons}
          @click=${volUp}
          .path=${mdiVolumePlus}
          style=${buttonStyle}
        ></sonos-icon-button>
        <sonos-icon-button
          ?hidden=${updateMembers || !!hideCogwheel}
          @click=${() => this.toggleShowSwitches(player)}
          .path=${mdiCog}
          show-switches=${this.showSwitches[player.id] || E}
          style=${buttonStyle}
        ></sonos-icon-button>
      </div>
      <div class="switches" ?hidden=${hideSwitches}>
        <sonos-source .store=${this.store} .player=${player}> </sonos-source>
        ${m(this.getAdditionalControls(hideSwitches, player))}
        <sonos-sleep-timer .store=${this.store} .player=${player}></sonos-sleep-timer>
      </div>
    </div>`;
	}
	toggleShowSwitches(player) {
		this.showSwitches[player.id] = !this.showSwitches[player.id];
		this.requestUpdate();
	}
	async getAdditionalControls(hide, player) {
		if (hide) return [];
		const relatedEntities = await this.store.hassService.getRelatedEntities(player, "switch", "number", "sensor");
		const { additionalControlsFontSize: fontSize = .75 } = this.store.config.volumes ?? {};
		return relatedEntities.map((relatedEntity) => {
			relatedEntity.attributes.friendly_name = relatedEntity.attributes.friendly_name?.replaceAll(player.name, "")?.trim() ?? "";
			return x`
        <div style="--ha-font-size-m: ${fontSize}rem">
          <state-card-content .stateObj=${relatedEntity} .hass=${this.store.hass}></state-card-content>
        </div>
      `;
		});
	}
	static get styles() {
		return i$8`
      .row {
        display: flex;
        flex-direction: column;
        padding-top: 0.3rem;
        padding-inline: 0.5rem;
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
        max-width: 90%;
        align-self: center;
      }

      .volume-name-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: calc(var(--sonos-font-size, 1rem) * 1.1);
        font-weight: bold;
        min-height: 1rem;
      }

      .grouped-name {
        display: flex;
        align-items: center;
      }

      .grouped-name-main {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .grouped-name-prefix,
      .grouped-name-suffix {
        flex-shrink: 0;
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

      [hidden] {
        display: none !important;
      }

      sonos-icon-button {
        height: 40px;
        align-self: start;
      }
    `;
	}
};
__decorate$1([n$5({ attribute: false })], Volumes.prototype, "store", void 0);
__decorate$1([r$3()], Volumes.prototype, "showSwitches", void 0);
//#endregion
//#region src/main.ts
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
customElements.define("sonos-media-browser-browser", MediaBrowserBrowser);
customElements.define("sonos-favorites", Favorites);
customElements.define("sonos-player", Player);
customElements.define("sonos-volumes", Volumes);
customElements.define("sonos-queue", Queue);
customElements.define("sonos-queue-mass", QueueMass);
customElements.define("sonos-queue-sonos", QueueSonos);
customElements.define("sonos-search", Search);
//#endregion
