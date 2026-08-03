'use strict';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _checkInRHS(e) {
  if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
  return e;
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _identity(t) {
  return t;
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setFunctionName(e, t, n) {
  "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : "");
  try {
    Object.defineProperty(e, "name", {
      configurable: !0,
      value: n ? n + " " + t : t
    });
  } catch (e) {}
  return e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(t.prototype ), o, e);
  return "function" == typeof p ? function (t) {
    return p.apply(e, t);
  } : p;
}
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _applyDecs2305(e, t, r, n, o, a) {
  function i(e, t, r) {
    return function (n, o) {
      return r && r(n), e[t].call(n, o);
    };
  }
  function c(e, t) {
    for (var r = 0; r < e.length; r++) e[r].call(t);
    return t;
  }
  function s(e, t, r, n) {
    if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined"));
    return e;
  }
  function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) {
    function m(e) {
      if (!h(e)) throw new TypeError("Attempted to access private element on non-instance");
    }
    var y,
      v = t[0],
      g = t[3],
      b = !u;
    if (!b) {
      r || Array.isArray(v) || (v = [v]);
      var w = {},
        S = [],
        A = 3 === o ? "get" : 4 === o || d ? "set" : "value";
      f ? (p || d ? w = {
        get: _setFunctionName(function () {
          return g(this);
        }, n, "get"),
        set: function (e) {
          t[4](this, e);
        }
      } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n));
    }
    for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) {
      var D = v[j],
        E = r ? v[j - 1] : void 0,
        I = {},
        O = {
          kind: ["field", "accessor", "method", "getter", "setter", "class"][o],
          name: n,
          metadata: a,
          addInitializer: function (e, t) {
            if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
            s(t, "An initializer", "be", true), c.push(t);
          }.bind(null, I)
        };
      try {
        if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else {
          var k, F;
          O.static = l, O.private = f, f ? 2 === o ? k = function (e) {
            return m(e), w.value;
          } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) {
            return e[n];
          }, (o < 2 || 4 === o) && (F = function (e, t) {
            e[n] = t;
          }));
          var N = O.access = {
            has: f ? h.bind() : function (e) {
              return n in e;
            }
          };
          if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? {
            get: w.get,
            set: w.set
          } : w[A], O), d) {
            if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
          } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P);
        }
      } finally {
        I.v = true;
      }
    }
    return (p || d) && u.push(function (e, t) {
      for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t);
      return t;
    }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P;
  }
  function u(e, t) {
    return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
      configurable: true,
      enumerable: true,
      value: t
    });
  }
  if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")];
  var f = Object.create(null == l ? null : l),
    p = function (e, t, r, n) {
      var o,
        a,
        i = [],
        s = function (t) {
          return _checkInRHS(t) === e;
        },
        u = new Map();
      function l(e) {
        e && i.push(c.bind(null, e));
      }
      for (var f = 0; f < t.length; f++) {
        var p = t[f];
        if (Array.isArray(p)) {
          var d = p[1],
            h = p[2],
            m = p.length > 3,
            y = 16 & d,
            v = !!(8 & d),
            g = 0 == (d &= 7),
            b = h + "/" + v;
          if (!g && !m) {
            var w = u.get(b);
            if (true === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
            u.set(b, !(d > 2) || d);
          }
          applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r);
        }
      }
      return l(o), l(a), i;
    }(e, t, o, f);
  return r.length || u(e, f), {
    e: p,
    get c() {
      var t = [];
      return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)];
    }
  };
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var intlUtils = {};

var hasRequiredIntlUtils;

function requireIntlUtils () {
	if (hasRequiredIntlUtils) return intlUtils;
	hasRequiredIntlUtils = 1;
	intlUtils.printMsg = function() {
	    console.log("This is a message from the demo package");
	  };
	return intlUtils;
}

requireIntlUtils();

var NumberFormat;
(function (NumberFormat) {
    NumberFormat["language"] = "language";
    NumberFormat["system"] = "system";
    NumberFormat["comma_decimal"] = "comma_decimal";
    NumberFormat["decimal_comma"] = "decimal_comma";
    NumberFormat["space_comma"] = "space_comma";
    NumberFormat["none"] = "none";
})(NumberFormat || (NumberFormat = {}));
var TimeFormat;
(function (TimeFormat) {
    TimeFormat["language"] = "language";
    TimeFormat["system"] = "system";
    TimeFormat["am_pm"] = "12";
    TimeFormat["twenty_four"] = "24";
})(TimeFormat || (TimeFormat = {}));
const numberFormatToLocale = (localeOptions) => {
    switch (localeOptions.number_format) {
        case NumberFormat.comma_decimal:
            return ["en-US", "en"]; // Use United States with fallback to English formatting 1,234,567.89
        case NumberFormat.decimal_comma:
            return ["de", "es", "it"]; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
        case NumberFormat.space_comma:
            return ["fr", "sv", "cs"]; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
        case NumberFormat.system:
            return undefined;
        default:
            return localeOptions.language;
    }
};
const round = (value, precision = 2) => Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
/**
 * Formats a number based on the specified language with thousands separator(s) and decimal character for better legibility.
 * @param num The number to format
 * @param locale The user-selected language and number format, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
const formatNumber = (num, localeOptions, options) => {
    const locale = localeOptions
        ? numberFormatToLocale(localeOptions)
        : undefined;
    // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
    Number.isNaN =
        Number.isNaN ||
            function isNaN(input) {
                return typeof input === "number" && isNaN(input);
            };
    if ((localeOptions === null || localeOptions === void 0 ? void 0 : localeOptions.number_format) !== NumberFormat.none &&
        !Number.isNaN(Number(num)) &&
        Intl) {
        try {
            return new Intl.NumberFormat(locale, getDefaultFormatOptions(num, options)).format(Number(num));
        }
        catch (err) {
            // Don't fail when using "TEST" language
            // eslint-disable-next-line no-console
            console.error(err);
            return new Intl.NumberFormat(undefined, getDefaultFormatOptions(num, options)).format(Number(num));
        }
    }
    if (typeof num === "string") {
        return num;
    }
    return `${round(num, void 0 ).toString()}${""}`;
};
/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
const getDefaultFormatOptions = (num, options) => {
    const defaultOptions = Object.assign({ maximumFractionDigits: 2 }, options);
    if (typeof num !== "string") {
        return defaultOptions;
    }
    // Keep decimal trailing zeros if they are present in a string numeric value
    {
        const digits = num.indexOf(".") > -1 ? num.split(".")[1].length : 0;
        defaultOptions.minimumFractionDigits = digits;
        defaultOptions.maximumFractionDigits = digits;
    }
    return defaultOptions;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

var suncalc = {exports: {}};

var hasRequiredSuncalc;

function requireSuncalc () {
	if (hasRequiredSuncalc) return suncalc.exports;
	hasRequiredSuncalc = 1;
	(function (module, exports) {
		// @ts-check
		/*
		 (c) 2011-2015, Vladimir Agafonkin
		 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
		 https://github.com/mourner/suncalc

		 Reworked and enhanced by Robert Gester
		 Additional Copyright (c) 2022 Robert Gester
		 https://github.com/hypnos3/suncalc3
		*/

		/**
		* @typedef {Object} ISunTimeDef
		* @property {string} name - The Name of the time
		* @property {Date} value - Date object with the calculated sun-time
		* @property {number} ts - The time as timestamp
		* @property {number} pos - The position of the sun on the time
		* @property {number} [elevation] - Angle of the sun on the time (except for solarNoon / nadir)
		* @property {number} julian - The time as Julian calendar
		* @property {boolean} valid - indicates if the time is valid or not
		* @property {boolean} [deprecated] - indicates if the time is a deprecated time name
		* @property {string} [nameOrg] - if it is a deprecated name, the original property name
		* @property {number} [posOrg] - if it is a deprecated name, the original position
		*/

		/**
		* @typedef {Object} ISunTimeSingle
		* @property {ISunTimeDef} rise - sun-time for sun rise
		* @property {ISunTimeDef} set - sun-time for sun set
		* @property {string} [error] - string of an error message if an error occurs
		*/

		/**
		* @typedef {Object} ISunTimeList
		* @property {ISunTimeDef} solarNoon - The sun-time for the solar noon (sun is in the highest position)
		* @property {ISunTimeDef} nadir - The sun-time for nadir (darkest moment of the night, sun is in the lowest position)
		* @property {ISunTimeDef} goldenHourDawnStart - The sun-time for morning golden hour (soft light, best time for photography)
		* @property {ISunTimeDef} goldenHourDawnEnd - The sun-time for morning golden hour (soft light, best time for photography)
		* @property {ISunTimeDef} goldenHourDuskStart - The sun-time for evening golden hour starts
		* @property {ISunTimeDef} goldenHourDuskEnd - The sun-time for evening golden hour starts
		* @property {ISunTimeDef} sunriseStart - The sun-time for sunrise starts (top edge of the sun appears on the horizon)
		* @property {ISunTimeDef} sunriseEnd - The sun-time for sunrise ends (bottom edge of the sun touches the horizon)
		* @property {ISunTimeDef} sunsetStart - The sun-time for sunset starts (bottom edge of the sun touches the horizon)
		* @property {ISunTimeDef} sunsetEnd - The sun-time for sunset ends (sun disappears below the horizon, evening civil twilight starts)
		* @property {ISunTimeDef} blueHourDawnStart - The sun-time for blue Hour start (time for special photography photos starts)
		* @property {ISunTimeDef} blueHourDawnEnd - The sun-time for blue Hour end (time for special photography photos end)
		* @property {ISunTimeDef} blueHourDuskStart - The sun-time for blue Hour start (time for special photography photos starts)
		* @property {ISunTimeDef} blueHourDuskEnd - The sun-time for blue Hour end (time for special photography photos end)
		* @property {ISunTimeDef} civilDawn - The sun-time for dawn (morning nautical twilight ends, morning civil twilight starts)
		* @property {ISunTimeDef} civilDusk - The sun-time for dusk (evening nautical twilight starts)
		* @property {ISunTimeDef} nauticalDawn - The sun-time for nautical dawn (morning nautical twilight starts)
		* @property {ISunTimeDef} nauticalDusk - The sun-time for nautical dusk end (evening astronomical twilight starts)
		* @property {ISunTimeDef} amateurDawn - The sun-time for amateur astronomical dawn (sun at 12° before sunrise)
		* @property {ISunTimeDef} amateurDusk - The sun-time for amateur astronomical dusk (sun at 12° after sunrise)
		* @property {ISunTimeDef} astronomicalDawn - The sun-time for night ends (morning astronomical twilight starts)
		* @property {ISunTimeDef} astronomicalDusk - The sun-time for night starts (dark enough for astronomical observations)
		* @property {ISunTimeDef} [dawn] - Deprecated: alternate for civilDawn
		* @property {ISunTimeDef} [dusk] - Deprecated: alternate for civilDusk
		* @property {ISunTimeDef} [nightEnd] - Deprecated: alternate for astronomicalDawn
		* @property {ISunTimeDef} [night] - Deprecated: alternate for astronomicalDusk
		* @property {ISunTimeDef} [nightStart] - Deprecated: alternate for astronomicalDusk
		* @property {ISunTimeDef} [goldenHour] - Deprecated: alternate for goldenHourDuskStart
		* @property {ISunTimeDef} [sunset] - Deprecated: alternate for sunsetEnd
		* @property {ISunTimeDef} [sunrise] - Deprecated: alternate for sunriseStart
		* @property {ISunTimeDef} [goldenHourEnd] - Deprecated: alternate for goldenHourDawnEnd
		* @property {ISunTimeDef} [goldenHourStart] - Deprecated: alternate for goldenHourDuskStart
		*/

		/**
		 * @typedef ISunTimeNames
		 * @type {Object}
		 * @property {number} angle     -   angle of the sun position in degrees
		 * @property {string} riseName  -   name of sun rise (morning name)
		 * @property {string} setName   -   name of sun set (evening name)
		 * @property {number} [risePos] -   (optional) position at rise
		 * @property {number} [setPos]  -   (optional) position at set
		 */


		/**
		 * @typedef {Object} ISunCoordinates
		 * @property {number} dec - The declination of the sun
		 * @property {number} ra - The right ascension of the sun
		 */

		/**
		 * @typedef {Object} ISunPosition
		 * @property {number} azimuth - The azimuth above the horizon of the sun in radians
		 * @property {number} altitude - The altitude of the sun in radians
		 * @property {number} zenith - The zenith of the sun in radians
		 * @property {number} azimuthDegrees - The azimuth of the sun in decimal degree
		 * @property {number} altitudeDegrees - The altitude of the sun in decimal degree
		 * @property {number} zenithDegrees - The zenith of the sun in decimal degree
		 * @property {number} declination - The declination of the sun
		 */

		/**
		 * @typedef {Object} IMoonPosition
		 * @property {number} azimuth - The moon azimuth in radians
		 * @property {number} altitude - The moon altitude above the horizon in radians
		 * @property {number} azimuthDegrees - The moon azimuth in degree
		 * @property {number} altitudeDegrees - The moon altitude above the horizon in degree
		 * @property {number} distance - The distance of the moon to the earth in kilometers
		 * @property {number} parallacticAngle - The parallactic angle of the moon
		 * @property {number} parallacticAngleDegrees - The parallactic angle of the moon in degree
		 */


		/**
		 * @typedef {Object} IDateObj
		 * @property {string} date - The Date as a ISO String YYYY-MM-TTTHH:MM:SS.mmmmZ
		 * @property {number} value - The Date as the milliseconds since 1.1.1970 0:00 UTC
		 */

		/**
		 * @typedef {Object} IPhaseObj
		 * @property {number} from - The phase start
		 * @property {number} to - The phase end
		 * @property {('newMoon'|'waxingCrescentMoon'|'firstQuarterMoon'|'waxingGibbousMoon'|'fullMoon'|'waningGibbousMoon'|'thirdQuarterMoon'|'waningCrescentMoon')} id - id of the phase
		 * @property {string} emoji - unicode symbol of the phase
		 * @property {string} name - name of the phase
		 * @property {string} id - phase name
		 * @property {number} weight - weight of the phase
		 * @property {string} css - a css value of the phase
		 * @property {string} [nameAlt] - an alernate name (not used by this library)
		 * @property {string} [tag] - additional tag (not used by this library)
		 */

		/**
		 * @typedef {Object} IMoonIlluminationNext
		 * @property {string} date - The Date as a ISO String YYYY-MM-TTTHH:MM:SS.mmmmZ of the next phase
		 * @property {number} value - The Date as the milliseconds since 1.1.1970 0:00 UTC of the next phase
		 * @property {string} type - The name of the next phase [newMoon, fullMoon, firstQuarter, thirdQuarter]
		 * @property {IDateObj} newMoon - Date of the next new moon
		 * @property {IDateObj} fullMoon - Date of the next full moon
		 * @property {IDateObj} firstQuarter - Date of the next first quater of the moon
		 * @property {IDateObj} thirdQuarter - Date of the next third/last quater of the moon
		 */

		/**
		 * @typedef {Object} IMoonIllumination
		 * @property {number} fraction - illuminated fraction of the moon; varies from `0.0` (new moon) to `1.0` (full moon)
		 * @property {IPhaseObj} phase - moon phase as object
		 * @property {number} phaseValue - The phase of the moon in the current cycle; varies from `0.0` to `1.0`
		 * @property {number} angle - The midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk;
		 * @property {IMoonIlluminationNext} next - object containing information about the next phases of the moon
		 * @remarks the moon is waxing if the angle is negative, and waning if positive
		 */

		/**
		 * @typedef {Object} IMoonDataInst
		 * @property {number} zenithAngle - The zenith angle of the moon
		 * @property {IMoonIllumination} illumination - object containing information about the next phases of the moon
		 *
		 * @typedef {IMoonPosition & IMoonDataInst} IMoonData
		 */

		/**
		 * @typedef {Object} IMoonTimes
		 * @property {Date|NaN} rise - a Date object if the moon is rising on the given Date, otherwise NaN
		 * @property {Date|NaN} set - a Date object if the moon is setting on the given Date, otherwise NaN
		 * @property {boolean} alwaysUp - is true if the moon never rises/sets and is always _above_ the horizon during the day
		 * @property {boolean} alwaysDown - is true if the moon is always _below_ the horizon
		 * @property {Date} [highest] - Date of the highest position, only avalílable if set and rise is not NaN
		 */

		(function () {
		    // sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

		    // shortcuts for easier to read formulas
		    const sin = Math.sin;
		    const cos = Math.cos;
		    const tan = Math.tan;
		    const asin = Math.asin;
		    const atan = Math.atan2;
		    const acos = Math.acos;
		    const rad = Math.PI / 180;
		    const degr = 180 / Math.PI;

		    // date/time constants and conversions
		    const dayMs = 86400000; // 1000 * 60 * 60 * 24;
		    const J1970 = 2440587.5;
		    const J2000 = 2451545;

		    const lunarDaysMs = 2551442778; // The duration in days of a lunar cycle is 29.53058770576
		    const firstNewMoon2000 = 947178840000; // first newMoon in the year 2000 2000-01-06 18:14

		    /**
		     * convert date from Julian calendar
		     * @param {number} j    -    day number in Julian calendar to convert
		     * @return {number} result date as timestamp
		     */
		    function fromJulianDay(j) {
		        return (j - J1970) * dayMs;
		    }

		    /**
		     * get number of days for a dateValue since 2000
		     * @param {number} dateValue date as timestamp to get days
		     * @return {number} count of days
		     */
		    function toDays(dateValue) {
		        return ((dateValue / dayMs) + J1970) - J2000;
		    }

		    // general calculations for position

		    const e = rad * 23.4397; // obliquity of the Earth

		    /**
		     * get right ascension
		     * @param {number} l
		     * @param {number} b
		     * @returns {number}
		     */
		    function rightAscension(l, b) {
		        return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
		    }

		    /**
		     * get declination
		     * @param {number} l
		     * @param {number} b
		     * @returns {number}
		     */
		    function declination(l, b) {
		        return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
		    }

		    /**
		    * get azimuth
		    * @param {number} H - siderealTime
		    * @param {number} phi - PI constant
		    * @param {number} dec - The declination of the sun
		    * @returns {number} azimuth in rad
		    */
		    function azimuthCalc(H, phi, dec) {
		        return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)) + Math.PI;
		    }

		    /**
		    * get altitude
		    * @param {number} H - siderealTime
		    * @param {number} phi - PI constant
		    * @param {number} dec - The declination of the sun
		    * @returns {number}
		    */
		    function altitudeCalc(H, phi, dec) {
		        return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
		    }

		    /**
		     * side real time
		     * @param {number} d
		     * @param {number} lw
		     * @returns {number}
		     */
		    function siderealTime(d, lw) {
		        return rad * (280.16 + 360.9856235 * d) - lw;
		    }

		    /**
		     * get astro refraction
		     * @param {number} h
		     * @returns {number}
		     */
		    function astroRefraction(h) {
		        if (h < 0) { // the following formula works for positive altitudes only.
		            h = 0;
		        } // if h = -0.08901179 a div/0 would occur.

		        // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
		        // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
		        return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
		    }
		    // general sun calculations
		    /**
		     * get solar mean anomaly
		     * @param {number} d
		     * @returns {number}
		     */
		    function solarMeanAnomaly(d) {
		        return rad * (357.5291 + 0.98560028 * d);
		    }

		    /**
		     * ecliptic longitude
		     * @param {number} M
		     * @returns {number}
		     */
		    function eclipticLongitude(M) {
		        const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
		        // equation of center
		        const P = rad * 102.9372; // perihelion of the Earth
		        return M + C + P + Math.PI;
		    }

		    /**
		     * sun coordinates
		     * @param {number} d days in Julian calendar
		     * @returns {ISunCoordinates}
		     */
		    function sunCoords(d) {
		        const M = solarMeanAnomaly(d);
		        const L = eclipticLongitude(M);

		        return {
		            dec: declination(L, 0),
		            ra: rightAscension(L, 0)
		        };
		    }

		    const SunCalc = {};

		    /**
		     * calculates sun position for a given date and latitude/longitude
		     * @param {number|Date} dateValue Date object or timestamp for calculating sun-position
		     * @param {number} lat latitude for calculating sun-position
		     * @param {number} lng longitude for calculating sun-position
		     * @return {ISunPosition} result object of sun-position
		    */
		    SunCalc.getPosition = function (dateValue, lat, lng) {
		        // console.log(`getPosition dateValue=${dateValue}  lat=${lat}, lng=${lng}`);
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        if (dateValue instanceof Date) {
		            dateValue = dateValue.valueOf();
		        }
		        const lw = rad * -lng;
		        const phi = rad * lat;
		        const d = toDays(dateValue);
		        const c = sunCoords(d);
		        const H = siderealTime(d, lw) - c.ra;
		        const azimuth = azimuthCalc(H, phi, c.dec);
		        const altitude = altitudeCalc(H, phi, c.dec);
		        // console.log(`getPosition date=${date}, M=${H}, L=${H}, c=${JSON.stringify(c)}, d=${d}, lw=${lw}, phi=${phi}`);

		        return {
		            azimuth,
		            altitude,
		            zenith: (90*Math.PI/180) - altitude,
		            azimuthDegrees: degr * azimuth,
		            altitudeDegrees: degr * altitude,
		            zenithDegrees: 90 - (degr * altitude),
		            declination: c.dec
		        };
		    };

		    /** sun times configuration
		     * @type {Array.<ISunTimeNames>}
		     */
		    const sunTimes = SunCalc.times = [
		        { angle: 6, riseName: 'goldenHourDawnEnd', setName: 'goldenHourDuskStart'}, // GOLDEN_HOUR_2
		        { angle: -0.3, riseName: 'sunriseEnd', setName: 'sunsetStart'}, // SUNRISE_END
		        { angle: -0.833, riseName: 'sunriseStart', setName: 'sunsetEnd'}, // SUNRISE
		        { angle: -1, riseName: 'goldenHourDawnStart', setName: 'goldenHourDuskEnd'}, // GOLDEN_HOUR_1
		        { angle: -4, riseName: 'blueHourDawnEnd', setName: 'blueHourDuskStart'}, // BLUE_HOUR
		        { angle: -6, riseName: 'civilDawn', setName: 'civilDusk'}, // DAWN
		        { angle: -8, riseName: 'blueHourDawnStart', setName: 'blueHourDuskEnd'}, // BLUE_HOUR
		        { angle: -12, riseName: 'nauticalDawn', setName: 'nauticalDusk'}, // NAUTIC_DAWN
		        { angle: -15, riseName: 'amateurDawn', setName: 'amateurDusk'},
		        { angle: -18, riseName: 'astronomicalDawn', setName: 'astronomicalDusk'} // ASTRO_DAWN
		    ];

		    /** alternate time names for backward compatibility
		     * @type {Array.<[string, string]>}
		    */
		    const suntimesDeprecated = SunCalc.timesDeprecated = [
		        ['dawn', 'civilDawn'],
		        ['dusk', 'civilDusk'],
		        ['nightEnd', 'astronomicalDawn'],
		        ['night', 'astronomicalDusk'],
		        ['nightStart', 'astronomicalDusk'],
		        ['goldenHour', 'goldenHourDuskStart'],
		        ['sunrise', 'sunriseStart'],
		        ['sunset', 'sunsetEnd'],
		        ['goldenHourEnd', 'goldenHourDawnEnd'],
		        ['goldenHourStart', 'goldenHourDuskStart']
		    ];

		    /** adds a custom time to the times config
		     * @param {number} angleAltitude - angle of Altitude/elevation above the horizont of the sun in degrees
		     * @param {string} riseName - name of sun rise (morning name)
		     * @param {string} setName  - name of sun set (evening name)
		     * @param {number} [risePos]  - (optional) position at rise (morning)
		     * @param {number} [setPos]  - (optional) position at set (evening)
		     * @param {boolean} [degree=true] defines if the elevationAngle is in degree not in radians
		     * @return {Boolean} true if new time could be added, false if not (parameter missing; riseName or setName already existing)
		     */
		    SunCalc.addTime = function (angleAltitude, riseName, setName, risePos, setPos, degree) {
		        let isValid = (typeof riseName === 'string') && (riseName.length > 0) &&
		                      (typeof setName === 'string') && (setName.length > 0) &&
		                      (typeof angleAltitude === 'number');
		        if (isValid) {
		            const EXP = /^(?![0-9])[a-zA-Z0-9$_]+$/;
		            // check for invalid names
		            for (let i=0; i<sunTimes.length; ++i) {
		                if (!EXP.test(riseName) ||
		                    riseName === sunTimes[i].riseName ||
		                    riseName === sunTimes[i].setName) {
		                    isValid = false;
		                    break;
		                }
		                if (!EXP.test(setName) ||
		                    setName === sunTimes[i].riseName ||
		                    setName === sunTimes[i].setName) {
		                    isValid = false;
		                    break;
		                }
		            }
		            if (isValid) {
		                const angleDeg = (degree === false ?  (angleAltitude  * ( 180 / Math.PI )) : angleAltitude);
		                sunTimes.push({angle: angleDeg, riseName, setName, risePos, setPos});
		                for (let i = suntimesDeprecated.length -1; i >= 0; i--) {
		                    if (suntimesDeprecated[i][0] === riseName || suntimesDeprecated[i][0] === setName) {
		                        suntimesDeprecated.splice(i, 1);
		                    }
		                }
		                return true;
		            }
		        }
		        return false;
		    };

		    /**
		     * add an alternate name for a sun time
		     * @param {string} alternameName    - alternate or deprecated time name
		     * @param {string} originalName     - original time name from SunCalc.times array
		     * @return {Boolean} true if could be added, false if not (parameter missing; originalName does not exists; alternameName already existis)
		     */
		    SunCalc.addDeprecatedTimeName = function (alternameName, originalName) {
		        let isValid = (typeof alternameName === 'string') && (alternameName.length > 0) &&
		                      (typeof originalName === 'string') && (originalName.length > 0);
		        if (isValid) {
		            let hasOrg = false;
		            const EXP = /^(?![0-9])[a-zA-Z0-9$_]+$/;
		            // check for invalid names
		            for (let i=0; i<sunTimes.length; ++i) {
		                if (!EXP.test(alternameName) ||
		                    alternameName === sunTimes[i].riseName ||
		                    alternameName === sunTimes[i].setName) {
		                    isValid = false;
		                    break;
		                }
		                if (originalName === sunTimes[i].riseName ||
		                    originalName === sunTimes[i].setName) {
		                    hasOrg = true;
		                }
		            }
		            if (isValid && hasOrg) {
		                suntimesDeprecated.push([alternameName, originalName]);
		                return true;
		            }
		        }
		        return false;
		    };
		    // calculations for sun times

		    const J0 = 0.0009;

		    /**
		     * Julian cycle
		     * @param {number} d - number of days
		     * @param {number} lw - rad * -lng;
		     * @returns {number}
		     */
		    function julianCycle(d, lw) {
		        return Math.round(d - J0 - lw / (2 * Math.PI));
		    }

		    /**
		     * approx transit
		     * @param {number} Ht - hourAngle
		     * @param {number} lw - rad * -lng
		     * @param {number} n - Julian cycle
		     * @returns {number} approx transit
		     */
		    function approxTransit(Ht, lw, n) {
		        return J0 + (Ht + lw) / (2 * Math.PI) + n;
		    }

		    /**
		     * solar transit in Julian
		     * @param {number} ds - approxTransit
		     * @param {number} M - solar mean anomal
		     * @param {number} L - ecliptic longitude
		     * @returns {number} solar transit in Julian
		     */
		    function solarTransitJ(ds, M, L) {
		        return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
		    }

		    /**
		     * hour angle
		     * @param {number} h - heigh at 0
		     * @param {number} phi -  rad * lat;
		     * @param {number} dec - declination
		     * @returns {number} hour angle
		     */
		    function hourAngle(h, phi, dec) {
		        return acos((sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec)));
		    }

		    /**
		     * calculates the obderver angle
		     * @param {number} height  the observer height (in meters) relative to the horizon
		     * @returns {number} height for further calculations
		     */
		    function observerAngle(height) {
		        return -2.076 * Math.sqrt(height) / 60;
		    }

		    /**
		     * returns set time for the given sun altitude
		     * @param {number} h - heigh at 0
		     * @param {number} lw - rad * -lng
		     * @param {number} phi -  rad * lat;
		     * @param {number} dec - declination
		     * @param {number} n - Julian cycle
		     * @param {number} M - solar mean anomal
		     * @param {number} L - ecliptic longitude
		     * @returns
		     */
		    function getSetJ(h, lw, phi, dec, n, M, L) {
		        const w = hourAngle(h, phi, dec);
		        const a = approxTransit(w, lw, n);
		        // console.log(`h=${h} lw=${lw} phi=${phi} dec=${dec} n=${n} M=${M} L=${L} w=${w} a=${a}`);
		        return solarTransitJ(a, M, L);
		    }

		    /**
		     * calculates sun times for a given date and latitude/longitude
		     * @param {number|Date} dateValue Date object or timestamp for calculating sun-times
		     * @param {number} lat latitude for calculating sun-times
		     * @param {number} lng longitude for calculating sun-times
		     * @param {number} [height=0]  the observer height (in meters) relative to the horizon
		     * @param {boolean} [addDeprecated=false] if true to times from timesDeprecated array will be added to the object
		     * @param {boolean} [inUTC=false] defines if the calculation should be in utc or local time (default is local)
		     * @return {ISunTimeList} result object of sunTime
		     */
		    SunCalc.getSunTimes = function (dateValue, lat, lng, height, addDeprecated, inUTC, dateAsIs) {
		        // console.log(`getSunTimes dateValue=${dateValue}  lat=${lat}, lng=${lng}, height={height}, noDeprecated=${noDeprecated}`);
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        // @ts-ignore
		        let t;
		        if (dateAsIs) {
		            t = dateValue;
		        } else {
		            t = new Date(dateValue);
		            if (inUTC) {
		                t.setUTCHours(12, 0, 0, 0);
		            } else {
		                t.setHours(12, 0, 0, 0);
		            }
		        }

		        const lw = rad * -lng;
		        const phi = rad * lat;
		        const dh = observerAngle(height || 0);
		        const d = toDays(t.valueOf());
		        const n = julianCycle(d, lw);
		        const ds = approxTransit(0, lw, n);
		        const M = solarMeanAnomaly(ds);
		        const L = eclipticLongitude(M);
		        const dec = declination(L, 0);

		        const Jnoon = solarTransitJ(ds, M, L);
		        const noonVal = fromJulianDay(Jnoon);
		        const nadirVal = fromJulianDay(Jnoon + 0.5);

		        const result = {
		            solarNoon: {
		                value: new Date(noonVal),
		                ts: noonVal,
		                name: 'solarNoon',
		                // elevation: 90,
		                julian: Jnoon,
		                valid: !isNaN(Jnoon),
		                pos: sunTimes.length
		            },
		            nadir: {
		                value: new Date(nadirVal),
		                ts: nadirVal,
		                name: 'nadir',
		                // elevation: 270,
		                julian: Jnoon + 0.5,
		                valid: !isNaN(Jnoon),
		                pos: (sunTimes.length * 2) + 1
		            }
		        };
		        for (let i = 0, len = sunTimes.length; i < len; i += 1) {
		            const time = sunTimes[i];
		            const sa = time.angle;
		            const h0 = (sa + dh) * rad;
		            let valid = true;

		            let Jset = getSetJ(h0, lw, phi, dec, n, M, L);
		            if (isNaN(Jset)) {
		                Jset = (Jnoon + 0.5);
		                valid = false;
		                /* Näherung an Wert
		                const b = Math.abs(time[0]);
		                while (isNaN(Jset) && ((Math.abs(sa) - b) < 2)) {
		                    sa += 0.005;
		                    Jset = getSetJ(sa * rad, lw, phi, dec, n, M, L);
		                } /* */
		            }

		            const Jrise = Jnoon - (Jset - Jnoon);
		            const v1 = fromJulianDay(Jset);
		            const v2 = fromJulianDay(Jrise);

		            result[time.setName] = {
		                value: new Date(v1),
		                ts: v1,
		                name: time.setName,
		                elevation: sa,
		                julian: Jset,
		                valid,
		                pos: len + i + 1
		            };
		            result[time.riseName] = {
		                value: new Date(v2),
		                ts: v2,
		                name: time.riseName,
		                elevation: sa, // (180 + (sa * -1)),
		                julian: Jrise,
		                valid,
		                pos: len - i - 1
		            };
		        }

		        if (addDeprecated) {
		            // for backward compatibility
		            for (let i = 0, len = suntimesDeprecated.length; i < len; i += 1) {
		                const time = suntimesDeprecated[i];
		                result[time[0]] = Object.assign({}, result[time[1]]);
		                result[time[0]].deprecated = true;
		                result[time[0]].nameOrg = result[time[1]].pos;
		                result[time[0]].posOrg = result[time[0]].pos;
		                result[time[0]].pos = -2;
		            }
		        }
		        // @ts-ignore
		        return result;
		    };

		    /**
		     * calculates the time at which the sun will have a given elevation angle when rising and when setting for a given date and latitude/longitude.
		     * @param {number|Date} dateValue Date object or timestamp for calculating sun-times
		     * @param {number} lat latitude for calculating sun-times
		     * @param {number} lng longitude for calculating sun-times
		     * @param {number} elevationAngle sun angle for calculating sun-time
		     * @param {number} [height=0]  the observer height (in meters) relative to the horizon
		     * @param {boolean} [degree] defines if the elevationAngle is in degree not in radians
		     * @param {boolean} [inUTC] defines if the calculation should be in utc or local time (default is local)
		     * @return {ISunTimeSingle} result object of single sunTime
		     */
		    SunCalc.getSunTime = function (dateValue, lat, lng, elevationAngle, height, degree, inUTC) {
		        // console.log(`getSunTime dateValue=${dateValue}  lat=${lat}, lng=${lng}, elevationAngle=${elevationAngle}`);
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        if (isNaN(elevationAngle)) {
		            throw new Error('elevationAngle missing');
		        }
		        if (degree) {
		            elevationAngle = elevationAngle * rad;
		        }
		        const t = new Date(dateValue);
		        if (inUTC) {
		            t.setUTCHours(12, 0, 0, 0);
		        } else {
		            t.setHours(12, 0, 0, 0);
		        }
		        const lw = rad * -lng;
		        const phi = rad * lat;
		        const dh = observerAngle(height || 0);
		        const d = toDays(t.valueOf());
		        const n = julianCycle(d, lw);
		        const ds = approxTransit(0, lw, n);
		        const M = solarMeanAnomaly(ds);
		        const L = eclipticLongitude(M);
		        const dec = declination(L, 0);
		        const Jnoon = solarTransitJ(ds, M, L);

		        const h0 = (elevationAngle - 0.833 + dh) * rad;

		        const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
		        const Jrise = Jnoon - (Jset - Jnoon);
		        const v1 = fromJulianDay(Jset);
		        const v2 = fromJulianDay(Jrise);

		        return {
		            set: {
		                name: 'set',
		                value: new Date(v1),
		                ts: v1,
		                elevation: elevationAngle,
		                julian: Jset,
		                valid: !isNaN(Jset),
		                pos: 0
		            },
		            rise: {
		                name: 'rise',
		                value: new Date(v2),
		                ts: v2,
		                elevation: elevationAngle, // (180 + (elevationAngle * -1)),
		                julian: Jrise,
		                valid: !isNaN(Jrise),
		                pos: 1
		            }
		        };
		    };

		    /**
		     * calculates time for a given azimuth angle for a given date and latitude/longitude
		     * @param {number|Date} dateValue Date object or timestamp for calculating sun-time
		     * @param {number} nazimuth azimuth for calculating sun-time
		     * @param {number} lat latitude for calculating sun-time
		     * @param {number} lng longitude for calculating sun-time
		     * @param {boolean} [degree] true if the angle is in degree and not in rad
		     * @return {Date} result time of sun-time
		    */
		    SunCalc.getSunTimeByAzimuth = function (dateValue, lat, lng, nazimuth, degree) {
		        if (isNaN(nazimuth)) {
		            throw new Error('azimuth missing');
		        }
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        if (degree) {
		            nazimuth = nazimuth * rad;
		        }
		        const date = new Date(dateValue);
		        const lw = rad * -lng;
		        const phi = rad * lat;

		        let dateVal = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).valueOf();
		        let addval = dayMs; // / 2);
		        dateVal += addval;

		        while (addval > 200) {
		        // let nazi = this.getPosition(dateVal, lat, lng).azimuth;
		            const d = toDays(dateVal);
		            const c = sunCoords(d);
		            const H = siderealTime(d, lw) - c.ra;
		            const nazim = azimuthCalc(H, phi, c.dec);

		            addval /= 2;
		            if (nazim < nazimuth) {
		                dateVal += addval;
		            } else {
		                dateVal -= addval;
		            }
		        }
		        return new Date(Math.floor(dateVal));
		    };

		    // calculation for solar time based on https://www.pveducation.org/pvcdrom/properties-of-sunlight/solar-time

		    /**
		     * Calculaes the solar time of the given date in the given latitude and UTC offset.
		     * @param {number|Date} dateValue Date object or timestamp for calculating solar time
		     * @param {number} lng longitude for calculating sun-time
		     * @param {number} utcOffset offset to the utc time
		     * @returns {Date} Returns the solar time of the given date in the given latitude and UTC offset.
		     */
		    SunCalc.getSolarTime = function (dateValue, lng, utcOffset) {
		        // @ts-ignore
		        const date = new Date(dateValue);
		        // calculate the day of year
		        const start = new Date(date.getFullYear(), 0, 0);
		        const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
		        const dayOfYear = Math.floor(diff / dayMs);

		        const b = 360 / 365 * (dayOfYear - 81) * rad;
		        const equationOfTime = 9.87 * sin(2 * b) - 7.53 * cos(b) - 1.5 * sin(b);
		        const localSolarTimeMeridian = 15 * utcOffset;
		        const timeCorrection = equationOfTime + 4 * (lng - localSolarTimeMeridian);
		        const localSolarTime = date.getHours() + timeCorrection / 60 + date.getMinutes() / 60;

		        const solarDate = new Date(0, 0);
		        solarDate.setMinutes(+localSolarTime * 60);
		        return solarDate;
		    };

		    // moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

		    /**
		     * calculate the geocentric ecliptic coordinates of the moon
		     * @param {number} d number of days
		     */
		    function moonCoords(d) {
		        const L = rad * (218.316 + 13.176396 * d); // ecliptic longitude
		        const M = rad * (134.963 + 13.064993 * d); // mean anomaly
		        const F = rad * (93.272 + 13.229350 * d); // mean distance
		        const l = L + rad * 6.289 * sin(M); // longitude
		        const b = rad * 5.128 * sin(F); // latitude
		        const dt = 385001 - 20905 * cos(M); // distance to the moon in km

		        return {
		            ra: rightAscension(l, b),
		            dec: declination(l, b),
		            dist: dt
		        };
		    }

		    /**
		     * calculates moon position for a given date and latitude/longitude
		     * @param {number|Date} dateValue Date object or timestamp for calculating moon-position
		     * @param {number} lat latitude for calculating moon-position
		     * @param {number} lng longitude for calculating moon-position
		     * @return {IMoonPosition} result object of moon-position
		     */
		    SunCalc.getMoonPosition = function (dateValue, lat, lng) {
		        // console.log(`getMoonPosition dateValue=${dateValue}  lat=${lat}, lng=${lng}`);
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        if (dateValue instanceof Date) {
		            dateValue = dateValue.valueOf();
		        }
		        const lw = rad * -lng;
		        const phi = rad * lat;
		        const d = toDays(dateValue);
		        const c = moonCoords(d);
		        const H = siderealTime(d, lw) - c.ra;
		        let altitude = altitudeCalc(H, phi, c.dec);
		        altitude += astroRefraction(altitude); // altitude correction for refraction

		        // formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
		        const pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

		        const azimuth = azimuthCalc(H, phi, c.dec);

		        return {
		            azimuth,
		            altitude,
		            azimuthDegrees: degr * azimuth,
		            altitudeDegrees: degr * altitude,
		            distance: c.dist,
		            parallacticAngle: pa,
		            parallacticAngleDegrees: degr * pa
		        };
		    };

		    const fractionOfTheMoonCycle = SunCalc.moonCycles = [{
		        from: 0,
		        to: 0.033863193308711,
		        id: 'newMoon',
		        emoji: '🌚',
		        code: ':new_moon_with_face:',
		        name: 'New Moon',
		        weight: 1,
		        css: 'wi-moon-new'
		    },
		    {
		        from: 0.033863193308711,
		        to: 0.216136806691289,
		        id: 'waxingCrescentMoon',
		        emoji: '🌒',
		        code: ':waxing_crescent_moon:',
		        name: 'Waxing Crescent',
		        weight: 6.3825,
		        css: 'wi-moon-wax-cres'
		    },
		    {
		        from: 0.216136806691289,
		        to: 0.283863193308711,
		        id: 'firstQuarterMoon',
		        emoji: '🌓',
		        code: ':first_quarter_moon:',
		        name: 'First Quarter',
		        weight: 1,
		        css: 'wi-moon-first-quart'
		    },
		    {
		        from: 0.283863193308711,
		        to: 0.466136806691289,
		        id: 'waxingGibbousMoon',
		        emoji: '🌔',
		        code: ':waxing_gibbous_moon:',
		        name: 'Waxing Gibbous',
		        weight: 6.3825,
		        css: 'wi-moon-wax-gibb'
		    },
		    {
		        from: 0.466136806691289,
		        to: 0.533863193308711,
		        id: 'fullMoon',
		        emoji: '🌝',
		        code: ':full_moon_with_face:',
		        name: 'Full Moon',
		        weight: 1,
		        css: 'wi-moon-full'
		    },
		    {
		        from: 0.533863193308711,
		        to: 0.716136806691289,
		        id: 'waningGibbousMoon',
		        emoji: '🌖',
		        code: ':waning_gibbous_moon:',
		        name: 'Waning Gibbous',
		        weight: 6.3825,
		        css: 'wi-moon-wan-gibb'
		    },
		    {
		        from: 0.716136806691289,
		        to: 0.783863193308711,
		        id: 'thirdQuarterMoon',
		        emoji: '🌗',
		        code: ':last_quarter_moon:',
		        name: 'third Quarter',
		        weight: 1,
		        css: 'wi-moon-third-quart'
		    },
		    {
		        from: 0.783863193308711,
		        to: 0.966136806691289,
		        id: 'waningCrescentMoon',
		        emoji: '🌘',
		        code: ':waning_crescent_moon:',
		        name: 'Waning Crescent',
		        weight: 6.3825,
		        css: 'wi-moon-wan-cres'
		    },
		    {
		        from: 0.966136806691289,
		        to: 1,
		        id: 'newMoon',
		        emoji: '🌚',
		        code: ':new_moon_with_face:',
		        name: 'New Moon',
		        weight: 1,
		        css: 'wi-moon-new'
		    }];

		    /**
		     * calculations for illumination parameters of the moon,
		     * based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
		     * Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
		     * @param {number|Date} dateValue Date object or timestamp for calculating moon-illumination
		     * @return {IMoonIllumination} result object of moon-illumination
		     */
		    SunCalc.getMoonIllumination = function (dateValue) {
		        // console.log(`getMoonIllumination dateValue=${dateValue}`);
		        if (dateValue instanceof Date) {
		            dateValue = dateValue.valueOf();
		        }
		        const d = toDays(dateValue);
		        const s = sunCoords(d);
		        const m = moonCoords(d);
		        const sdist = 149598000;  // distance from Earth to Sun in km
		        const phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
		        const inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
		        const angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
		            cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
		        const phaseValue = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI;

		        // calculates the difference in ms between the sirst fullMoon 2000 and given Date
		        const diffBase = dateValue - firstNewMoon2000;
		        // Calculate modulus to drop completed cycles
		        let cycleModMs = diffBase % lunarDaysMs;
		        // If negative number (date before new moon 2000) add lunarDaysMs
		        if ( cycleModMs < 0 ) { cycleModMs += lunarDaysMs; }
		        const nextNewMoon = (lunarDaysMs - cycleModMs) + dateValue;
		        let nextFullMoon = ((lunarDaysMs/2) - cycleModMs) + dateValue;
		        if (nextFullMoon < dateValue) { nextFullMoon += lunarDaysMs; }
		        const quater = (lunarDaysMs/4);
		        let nextFirstQuarter = (quater - cycleModMs) + dateValue;
		        if (nextFirstQuarter < dateValue) { nextFirstQuarter += lunarDaysMs; }
		        let nextThirdQuarter = (lunarDaysMs - quater - cycleModMs) + dateValue;
		        if (nextThirdQuarter < dateValue) { nextThirdQuarter += lunarDaysMs; }
		        // Calculate the fraction of the moon cycle
		        // const currentfrac = cycleModMs / lunarDaysMs;
		        const next = Math.min(nextNewMoon, nextFirstQuarter, nextFullMoon, nextThirdQuarter);
		        let phase;

		        for (let index = 0; index < fractionOfTheMoonCycle.length; index++) {
		            const element = fractionOfTheMoonCycle[index];
		            if ( (phaseValue >= element.from) && (phaseValue <= element.to) ) {
		                phase = element;
		                break;
		            }
		        }

		        return {
		            fraction: (1 + cos(inc)) / 2,
		            // fraction2: cycleModMs / lunarDaysMs,
		            // @ts-ignore
		            phase,
		            phaseValue,
		            angle,
		            next : {
		                value: next,
		                date: (new Date(next)).toISOString(),
		                type: (next === nextNewMoon) ? 'newMoon' : ((next === nextFirstQuarter) ? 'firstQuarter' : ((next === nextFullMoon) ? 'fullMoon' : 'thirdQuarter')),
		                newMoon: {
		                    value: nextNewMoon,
		                    date: (new Date(nextNewMoon)).toISOString()
		                },
		                fullMoon: {
		                    value: nextFullMoon,
		                    date: (new Date(nextFullMoon)).toISOString()
		                },
		                firstQuarter: {
		                    value: nextFirstQuarter,
		                    date: (new Date(nextFirstQuarter)).toISOString()
		                },
		                thirdQuarter: {
		                    value: nextThirdQuarter,
		                    date: (new Date(nextThirdQuarter)).toISOString()
		                }
		            }
		        };
		    };

		    /**
		     * calculations moon position and illumination for a given date and latitude/longitude of the moon,
		     * @param {number|Date} dateValue Date object or timestamp for calculating moon-illumination
		     * @param {number} lat latitude for calculating moon-position
		     * @param {number} lng longitude for calculating moon-position
		     * @return {IMoonData} result object of moon-illumination
		     */
		    SunCalc.getMoonData = function (dateValue, lat, lng) {
		        const pos = SunCalc.getMoonPosition(dateValue, lat, lng);
		        const illum = SunCalc.getMoonIllumination(dateValue);
		        return Object.assign({
		            illumination : illum,
		            zenithAngle : illum.angle - pos.parallacticAngle
		        }, pos);
		    };

		    /**
		     * add hours to a date
		     * @param {number} dateValue timestamp to add hours
		     * @param {number} h - hours to add
		     * @returns {number} new timestamp with added hours
		     */
		    function hoursLater(dateValue, h) {
		        return dateValue + h * dayMs / 24;
		    }

		    /**
		     * calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
		     * @param {number|Date} dateValue Date object or timestamp for calculating moon-times
		     * @param {number} lat latitude for calculating moon-times
		     * @param {number} lng longitude for calculating moon-times
		     * @param {boolean} [inUTC] defines if the calculation should be in utc or local time (default is local)
		     * @return {IMoonTimes} result object of sunTime
		     */
		    SunCalc.getMoonTimes = function (dateValue, lat, lng, inUTC, dateAsIs) {
		        if (isNaN(lat)) {
		            throw new Error('latitude missing');
		        }
		        if (isNaN(lng)) {
		            throw new Error('longitude missing');
		        }
		        let t;
		        if (dateAsIs) {
		            t = dateValue;
		        } else {
		            t = new Date(dateValue);
		            if (inUTC) {
		                t.setUTCHours(0, 0, 0, 0);
		            } else {
		                t.setHours(0, 0, 0, 0);
		            }
		        }
		        dateValue = t.valueOf();
		        // console.log(`getMoonTimes lat=${lat} lng=${lng} dateValue=${dateValue} t=${t}`);

		        const hc = 0.133 * rad;
		        let h0 = SunCalc.getMoonPosition(dateValue, lat, lng).altitude - hc;
		        let rise; let set; let ye; let d; let roots; let x1; let x2; let dx;

		        // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
		        for (let i = 1; i <= 26; i += 2) {
		            const h1 = SunCalc.getMoonPosition(hoursLater(dateValue, i), lat, lng).altitude - hc;
		            const h2 = SunCalc.getMoonPosition(hoursLater(dateValue, i + 1), lat, lng).altitude - hc;

		            const a = (h0 + h2) / 2 - h1;
		            const b = (h2 - h0) / 2;
		            const xe = -b / (2 * a);
		            ye = (a * xe + b) * xe + h1;
		            d = b * b - 4 * a * h1;
		            roots = 0;

		            if (d >= 0) {
		                dx = Math.sqrt(d) / (Math.abs(a) * 2);
		                x1 = xe - dx;
		                x2 = xe + dx;
		                if (Math.abs(x1) <= 1) {
		                    roots++;
		                }

		                if (Math.abs(x2) <= 1) {
		                    roots++;
		                }

		                if (x1 < -1) {
		                    x1 = x2;
		                }
		            }

		            if (roots === 1) {
		                if (h0 < 0) {
		                    rise = i + x1;
		                } else {
		                    set = i + x1;
		                }
		            } else if (roots === 2) {
		                rise = i + (ye < 0 ? x2 : x1);
		                set = i + (ye < 0 ? x1 : x2);
		            }

		            if (rise && set) {
		                break;
		            }

		            h0 = h2;
		        }

		        const result = {};
		        if (rise) {
		            result.rise = new Date(hoursLater(dateValue, rise));
		        } else {
		            result.rise = NaN;
		        }

		        if (set) {
		            result.set = new Date(hoursLater(dateValue, set));
		        } else {
		            result.set = NaN;
		        }

		        if (!rise && !set) {
		            if (ye > 0) {
		                result.alwaysUp = true;
		                result.alwaysDown = false;
		            } else {
		                result.alwaysUp = false;
		                result.alwaysDown = true;
		            }
		        } else if (rise && set) {
		            result.alwaysUp = false;
		            result.alwaysDown = false;
		            result.highest = new Date(hoursLater(dateValue, Math.min(rise, set) + (Math.abs(set - rise) / 2)));
		        } else {
		            result.alwaysUp = false;
		            result.alwaysDown = false;
		        }
		        return result;
		    };

		    /**
		     * calc moon transit
		     * @param {number} rize timestamp for rise
		     * @param {number} set timestamp for set time
		     * @returns {Date} new moon transit
		     */
		    function calcMoonTransit(rize, set) {
		        if (rize > set) {
		            return new Date(set + (rize - set) / 2);
		        }
		        return new Date(rize + (set - rize) / 2);
		    }

		    /**
		     * calculated the moon transit
		     * @param {number|Date} rise rise time as Date object or timestamp for calculating moon-transit
		     * @param {number|Date} set set time as Date object or timestamp for calculating moon-transit
		     * @param {number} lat latitude for calculating moon-times
		     * @param {number} lng longitude for calculating moon-times
		     * @returns {{main: (Date|null), invert: (Date|null)}}
		     */
		    SunCalc.moonTransit = function (rise, set, lat, lng) {
		        /** @type {Date|null} */ let main = null;
		        /** @type {Date|null} */ let invert = null;
		        const riseDate = new Date(rise);
		        const setDate = new Date(set);
		        const riseValue = riseDate.getTime();
		        const setValue = setDate.getTime();
		        const day = setDate.getDate();
		        let tempTransitBefore;
		        let tempTransitAfter;

		        if (rise && set) {
		            if  (rise < set) {
		                main = calcMoonTransit(riseValue, setValue);
		            } else {
		                invert = calcMoonTransit(riseValue, setValue);
		            }
		        }

		        if (rise) {
		            tempTransitAfter = calcMoonTransit(riseValue, SunCalc.getMoonTimes(new Date(riseDate).setDate(day + 1), lat, lng).set.valueOf());
		            if (tempTransitAfter.getDate() === day) {
		                if (main) {
		                    invert = tempTransitAfter;
		                } else {
		                    main = tempTransitAfter;
		                }
		            }
		        }

		        if (set) {
		            tempTransitBefore = calcMoonTransit(setValue, SunCalc.getMoonTimes(new Date(setDate).setDate(day - 1), lat, lng).rise.valueOf());
		            if (tempTransitBefore.getDate() === day) {
		                main = tempTransitBefore;
		            }
		        }
		        return {
		            main,
		            invert
		        };
		    };

		    // export as Node module / AMD module / browser variable
		    {
		        module.exports = SunCalc;
		        // @ts-ignore
		    }

		})(); 
	} (suncalc));
	return suncalc.exports;
}

var suncalcExports = requireSuncalc();
var SunCalc = /*@__PURE__*/getDefaultExportFromCjs(suncalcExports);

var _templateObject$7;
var cardStyles = i$3(_templateObject$7 || (_templateObject$7 = _taggedTemplateLiteral(["\n  :host {\n    --hc-primary: var(--primary-text-color);\n    --hc-secondary: var(--secondary-text-color);\n\n    --hc-field-name-color: var(--hc-secondary);\n    --hc-field-value-color: var(--hc-primary);\n\n    --hc-day-color: #8ebeeb;\n    --hc-night-color: #393b78;\n\n    --hc-accent: #d7d7d7;\n    --hc-lines: var(--hc-accent);\n\n    --hc-sun-hue: 44;\n    --hc-sun-saturation: 93%;\n    --hc-sun-lightness: 67%;\n    --hc-sun-hue-reduce: 0;\n    --hc-sun-saturation-reduce: 0%;\n    --hc-sun-lightness-reduce: 0%;\n    --hc-sun-color: hsl(\n      calc(var(--hc-sun-hue) - var(--hc-sun-hue-reduce)),\n      calc(var(--hc-sun-saturation) - var(--hc-sun-saturation-reduce)),\n      calc(var(--hc-sun-lightness) - var(--hc-sun-lightness-reduce))\n    );\n\n    --hc-moon-hue: 52;\n    --hc-moon-saturation: 77%;\n    --hc-moon-lightness: 57%;\n    --hc-moon-saturation-reduce: 0%;\n    --hc-moon-lightness-reduce: 0%;\n    --hc-moon-color: hsl(\n      var(--hc-moon-hue),\n      calc(var(--hc-moon-saturation) - var(--hc-moon-saturation-reduce)),\n      calc(var(--hc-moon-lightness) - var(--hc-moon-lightness-reduce))\n    );\n    --hc-moon-shadow-color: #eeeeee;\n    --hc-moon-spot-color: rgba(170, 170, 170, 0.1);\n  }\n\n  :host(.horizon-card-dark) {\n    --hc-accent: #464646;\n    --hc-moon-saturation: 80%;\n    --hc-moon-lightness: 74%;\n    --hc-moon-shadow-color: #272727;\n  }\n\n  .horizon-card {\n    padding: var(--hc-card-padding, 0.5em);\n    font-family: var(--primary-font-family);\n  }\n\n  .horizon-card-field-row {\n    display: flex;\n    justify-content: space-around;\n    margin-top: 1em;\n    margin-bottom: -0.3em;\n  }\n\n  .horizon-card-text-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  .horizon-card-field-name {\n    color: var(--hc-field-name-color);\n  }\n\n  .horizon-card-field-value {\n    color: var(--hc-field-value-color);\n    font-size: 1.2em;\n    line-height: 1.1em;\n    text-align: center;\n  }\n\n  .horizon-card-field-value-moon-phase {\n    font-size: inherit;\n  }\n\n  .horizon-card-field-moon-phase {\n    --mdc-icon-size: 2em;\n    color: var(--primary-color);\n  }\n\n  .horizon-card-field-value-secondary {\n    font-size: 0.7em;\n  }\n\n  .horizon-card-sun-value:before {\n    content: \"\u2609\";\n    padding-right: 0.5em;\n  }\n\n  .horizon-card-moon-value:before {\n    content: \"\u263D\";\n    padding-right: 0.5em;\n  }\n\n  .horizon-card-header {\n    display: flex;\n    justify-content: space-around;\n    margin-top: 1em;\n    margin-bottom: -0.3em;\n  }\n\n  .horizon-card-header .horizon-card-text-container {\n    font-size: 1.2em;\n  }\n\n  .horizon-card-footer {\n    margin-bottom: var(--hc-footer-margin, 1em);\n  }\n\n  .horizon-card-title {\n    margin: 1em 1em 1em 1em;\n    font-size: 1.5em;\n    color: var(--hc-primary);\n  }\n\n  .horizon-card-graph {\n    margin: var(--hc-graph-margin, 1em 0);\n  }\n\n  .horizon-card-graph .dawn {\n    fill: var(--hc-night-color);\n    stroke: var(--hc-night-color);\n  }\n\n  .horizon-card-graph .day {\n    fill: var(--hc-day-color);\n    stroke: var(--hc-day-color);\n  }\n"])));

var languageName$D = "Bulgarian";
var azimuth$D = "Азимут";
var dawn$D = "Зора";
var dusk$D = "Здрач";
var elevation$D = "Височина";
var moonrise$D = "Лунен изгрев";
var moonset$D = "Лунен залез";
var noon$D = "Пладне";
var sunrise$D = "Изгрев";
var sunset$D = "Залез";
var new_moon$D = "Новолуние";
var waxing_crescent$D = "Изгряващ полумесец";
var first_quarter$D = "Първа четвърт";
var waxing_gibbous$D = "Растяща луна";
var full_moon$D = "Пълнолуние";
var waning_gibbous$D = "Намаляваща луна";
var last_quarter$D = "Последна четвърт";
var waning_crescent$D = "Залязващ полумесец";
var bg = {
	languageName: languageName$D,
	azimuth: azimuth$D,
	dawn: dawn$D,
	dusk: dusk$D,
	elevation: elevation$D,
	moonrise: moonrise$D,
	moonset: moonset$D,
	noon: noon$D,
	sunrise: sunrise$D,
	sunset: sunset$D,
	new_moon: new_moon$D,
	waxing_crescent: waxing_crescent$D,
	first_quarter: first_quarter$D,
	waxing_gibbous: waxing_gibbous$D,
	full_moon: full_moon$D,
	waning_gibbous: waning_gibbous$D,
	last_quarter: last_quarter$D,
	waning_crescent: waning_crescent$D
};

var languageName$C = "Catalan";
var azimuth$C = "Azimut";
var dawn$C = "Alba";
var dusk$C = "Capvespre";
var elevation$C = "Elevació";
var moonrise$C = "Sortida de la lluna";
var moonset$C = "Posta de lluna";
var noon$C = "Migdia solar";
var sunrise$C = "Sortida del sol";
var sunset$C = "Posta del sol";
var new_moon$C = "Lluna nova";
var waxing_crescent$C = "Lluna creixent";
var first_quarter$C = "Quart creixent";
var waxing_gibbous$C = "Lluna creixent gibosa";
var full_moon$C = "Lluna plena";
var waning_gibbous$C = "Lluna minvant gibosa";
var last_quarter$C = "Quart minvant";
var waning_crescent$C = "Lluna minvant";
var ca = {
	languageName: languageName$C,
	azimuth: azimuth$C,
	dawn: dawn$C,
	dusk: dusk$C,
	elevation: elevation$C,
	moonrise: moonrise$C,
	moonset: moonset$C,
	noon: noon$C,
	sunrise: sunrise$C,
	sunset: sunset$C,
	new_moon: new_moon$C,
	waxing_crescent: waxing_crescent$C,
	first_quarter: first_quarter$C,
	waxing_gibbous: waxing_gibbous$C,
	full_moon: full_moon$C,
	waning_gibbous: waning_gibbous$C,
	last_quarter: last_quarter$C,
	waning_crescent: waning_crescent$C
};

var languageName$B = "Czech";
var azimuth$B = "Azimut";
var dawn$B = "Svítání";
var dusk$B = "Soumrak";
var elevation$B = "Výška";
var moonrise$B = "Východ měsíce";
var moonset$B = "Západ měsíce";
var noon$B = "Sluneční poledne";
var sunrise$B = "Východ slunce";
var sunset$B = "Západ slunce";
var new_moon$B = "Nov";
var waxing_crescent$B = "Dorůstající srpek";
var first_quarter$B = "První čtvrt";
var waxing_gibbous$B = "Dorůstající Měsíc";
var full_moon$B = "Úplněk";
var waning_gibbous$B = "Couvající Měsíc";
var last_quarter$B = "Poslední čtvrt";
var waning_crescent$B = "Ubývající srpek";
var cs = {
	languageName: languageName$B,
	azimuth: azimuth$B,
	dawn: dawn$B,
	dusk: dusk$B,
	elevation: elevation$B,
	moonrise: moonrise$B,
	moonset: moonset$B,
	noon: noon$B,
	sunrise: sunrise$B,
	sunset: sunset$B,
	new_moon: new_moon$B,
	waxing_crescent: waxing_crescent$B,
	first_quarter: first_quarter$B,
	waxing_gibbous: waxing_gibbous$B,
	full_moon: full_moon$B,
	waning_gibbous: waning_gibbous$B,
	last_quarter: last_quarter$B,
	waning_crescent: waning_crescent$B
};

var languageName$A = "Danish";
var azimuth$A = "Azimut";
var dawn$A = "Daggry";
var dusk$A = "Skumring";
var elevation$A = "Højde";
var moonrise$A = "Måneopgang";
var moonset$A = "Månenedgang";
var noon$A = "Middag";
var sunrise$A = "Solopgang";
var sunset$A = "Solnedgang";
var new_moon$A = "Nymåne";
var waxing_crescent$A = "Tiltagende halvmåne";
var first_quarter$A = "Første kvarter";
var waxing_gibbous$A = "Tiltagende måne";
var full_moon$A = "Fuldmåne";
var waning_gibbous$A = "Aftagende måne";
var last_quarter$A = "Sidste kvarter";
var waning_crescent$A = "Aftagende halvmåne";
var da = {
	languageName: languageName$A,
	azimuth: azimuth$A,
	dawn: dawn$A,
	dusk: dusk$A,
	elevation: elevation$A,
	moonrise: moonrise$A,
	moonset: moonset$A,
	noon: noon$A,
	sunrise: sunrise$A,
	sunset: sunset$A,
	new_moon: new_moon$A,
	waxing_crescent: waxing_crescent$A,
	first_quarter: first_quarter$A,
	waxing_gibbous: waxing_gibbous$A,
	full_moon: full_moon$A,
	waning_gibbous: waning_gibbous$A,
	last_quarter: last_quarter$A,
	waning_crescent: waning_crescent$A
};

var languageName$z = "German";
var azimuth$z = "Azimut";
var dawn$z = "Morgendämmerung";
var dusk$z = "Abenddämmerung";
var elevation$z = "Höhenwinkel";
var moonrise$z = "Mondaufgang";
var moonset$z = "Monduntergang";
var noon$z = "Mittag";
var sunrise$z = "Sonnenaufgang";
var sunset$z = "Sonnenuntergang";
var new_moon$z = "Neumond";
var waxing_crescent$z = "Zunehmende Sichel";
var first_quarter$z = "Erstes Viertel";
var waxing_gibbous$z = "Zunehmender Dreiviertelmond";
var full_moon$z = "Vollmond";
var waning_gibbous$z = "Abnehmender Dreiviertelmond";
var last_quarter$z = "Letztes Viertel";
var waning_crescent$z = "Abnehmende Sichel";
var de = {
	languageName: languageName$z,
	azimuth: azimuth$z,
	dawn: dawn$z,
	dusk: dusk$z,
	elevation: elevation$z,
	moonrise: moonrise$z,
	moonset: moonset$z,
	noon: noon$z,
	sunrise: sunrise$z,
	sunset: sunset$z,
	new_moon: new_moon$z,
	waxing_crescent: waxing_crescent$z,
	first_quarter: first_quarter$z,
	waxing_gibbous: waxing_gibbous$z,
	full_moon: full_moon$z,
	waning_gibbous: waning_gibbous$z,
	last_quarter: last_quarter$z,
	waning_crescent: waning_crescent$z
};

var languageName$y = "Greek";
var azimuth$y = "Αζιμούθιο";
var dawn$y = "Αυγή";
var dusk$y = "Σούρουπο";
var elevation$y = "Υψόμετρο";
var moonrise$y = "Aνατολή σελήνης";
var moonset$y = "Δύση σελήνης";
var noon$y = "Μεσημέρι";
var sunrise$y = "Ανατολή";
var sunset$y = "Δύση";
var new_moon$y = "Νέα Σελήνη";
var waxing_crescent$y = "Αύξων Μηνίσκος";
var first_quarter$y = "Πρώτο Τέταρτο";
var waxing_gibbous$y = "Αύξων Αμφίκυρτος";
var full_moon$y = "Πανσέληνος";
var waning_gibbous$y = "Φθίνων Αμφίκυρτος";
var last_quarter$y = "Τελευταίο Τέταρτο";
var waning_crescent$y = "Φθίνων Μηνίσκος";
var el = {
	languageName: languageName$y,
	azimuth: azimuth$y,
	dawn: dawn$y,
	dusk: dusk$y,
	elevation: elevation$y,
	moonrise: moonrise$y,
	moonset: moonset$y,
	noon: noon$y,
	sunrise: sunrise$y,
	sunset: sunset$y,
	new_moon: new_moon$y,
	waxing_crescent: waxing_crescent$y,
	first_quarter: first_quarter$y,
	waxing_gibbous: waxing_gibbous$y,
	full_moon: full_moon$y,
	waning_gibbous: waning_gibbous$y,
	last_quarter: last_quarter$y,
	waning_crescent: waning_crescent$y
};

var languageName$x = "English";
var azimuth$x = "Azimuth";
var dawn$x = "Dawn";
var dusk$x = "Dusk";
var elevation$x = "Elevation";
var moonrise$x = "Moonrise";
var moonset$x = "Moonset";
var noon$x = "Solar noon";
var sunrise$x = "Sunrise";
var sunset$x = "Sunset";
var new_moon$x = "New moon";
var waxing_crescent$x = "Waxing crescent";
var first_quarter$x = "First quarter";
var waxing_gibbous$x = "Waxing gibbous";
var full_moon$x = "Full moon";
var waning_gibbous$x = "Waning gibbous";
var last_quarter$x = "Last quarter";
var waning_crescent$x = "Waning crescent";
var en = {
	languageName: languageName$x,
	azimuth: azimuth$x,
	dawn: dawn$x,
	dusk: dusk$x,
	elevation: elevation$x,
	moonrise: moonrise$x,
	moonset: moonset$x,
	noon: noon$x,
	sunrise: sunrise$x,
	sunset: sunset$x,
	new_moon: new_moon$x,
	waxing_crescent: waxing_crescent$x,
	first_quarter: first_quarter$x,
	waxing_gibbous: waxing_gibbous$x,
	full_moon: full_moon$x,
	waning_gibbous: waning_gibbous$x,
	last_quarter: last_quarter$x,
	waning_crescent: waning_crescent$x
};

var languageName$w = "Spanish";
var azimuth$w = "Azimut";
var dawn$w = "Amanecer";
var dusk$w = "Anochecer";
var elevation$w = "Elevación";
var moonrise$w = "Salida de la luna";
var moonset$w = "Puesta de la luna";
var noon$w = "Mediodía solar";
var sunrise$w = "Salida del sol";
var sunset$w = "Puesta del sol";
var new_moon$w = "Luna nueva";
var waxing_crescent$w = "Luna creciente";
var first_quarter$w = "Cuarto creciente";
var waxing_gibbous$w = "Luna gibosa creciente";
var full_moon$w = "Luna llena";
var waning_gibbous$w = "Luna gibosa menguante";
var last_quarter$w = "Cuarto menguante";
var waning_crescent$w = "Luna menguante";
var es = {
	languageName: languageName$w,
	azimuth: azimuth$w,
	dawn: dawn$w,
	dusk: dusk$w,
	elevation: elevation$w,
	moonrise: moonrise$w,
	moonset: moonset$w,
	noon: noon$w,
	sunrise: sunrise$w,
	sunset: sunset$w,
	new_moon: new_moon$w,
	waxing_crescent: waxing_crescent$w,
	first_quarter: first_quarter$w,
	waxing_gibbous: waxing_gibbous$w,
	full_moon: full_moon$w,
	waning_gibbous: waning_gibbous$w,
	last_quarter: last_quarter$w,
	waning_crescent: waning_crescent$w
};

var languageName$v = "Estonian";
var azimuth$v = "Asimuut";
var dawn$v = "Koidik";
var dusk$v = "Hämarik";
var elevation$v = "Kõrgus";
var moonrise$v = "Kuutõus";
var moonset$v = "Kuuloojang";
var noon$v = "Keskpäev";
var sunrise$v = "Päikesetõus";
var sunset$v = "Päikeseloojang";
var new_moon$v = "Kuu loomine";
var waxing_crescent$v = "Noorkuu";
var first_quarter$v = "Esimene veerand";
var waxing_gibbous$v = "Kasvav kuu";
var full_moon$v = "Täiskuu";
var waning_gibbous$v = "Kahanev kuu";
var last_quarter$v = "Viimane veerand";
var waning_crescent$v = "Vanakuu";
var et = {
	languageName: languageName$v,
	azimuth: azimuth$v,
	dawn: dawn$v,
	dusk: dusk$v,
	elevation: elevation$v,
	moonrise: moonrise$v,
	moonset: moonset$v,
	noon: noon$v,
	sunrise: sunrise$v,
	sunset: sunset$v,
	new_moon: new_moon$v,
	waxing_crescent: waxing_crescent$v,
	first_quarter: first_quarter$v,
	waxing_gibbous: waxing_gibbous$v,
	full_moon: full_moon$v,
	waning_gibbous: waning_gibbous$v,
	last_quarter: last_quarter$v,
	waning_crescent: waning_crescent$v
};

var languageName$u = "Persian";
var azimuth$u = "جهت";
var dawn$u = "سحرگاه";
var dusk$u = "شامگاه";
var elevation$u = "ارتفاع";
var moonrise$u = "طلوع ماه";
var moonset$u = "غروب ماه";
var noon$u = "ظهر";
var sunrise$u = "طلوع آفتاب";
var sunset$u = "غروب آفتاب";
var new_moon$u = "ماه نو";
var waxing_crescent$u = "هلال افزاینده";
var first_quarter$u = "تربیع اول";
var waxing_gibbous$u = "محدب افزاینده";
var full_moon$u = "ماه کامل";
var waning_gibbous$u = "محدب کاهنده";
var last_quarter$u = "تربیع سوم";
var waning_crescent$u = "هلال کاهنده";
var fa = {
	languageName: languageName$u,
	azimuth: azimuth$u,
	dawn: dawn$u,
	dusk: dusk$u,
	elevation: elevation$u,
	moonrise: moonrise$u,
	moonset: moonset$u,
	noon: noon$u,
	sunrise: sunrise$u,
	sunset: sunset$u,
	new_moon: new_moon$u,
	waxing_crescent: waxing_crescent$u,
	first_quarter: first_quarter$u,
	waxing_gibbous: waxing_gibbous$u,
	full_moon: full_moon$u,
	waning_gibbous: waning_gibbous$u,
	last_quarter: last_quarter$u,
	waning_crescent: waning_crescent$u
};

var languageName$t = "Finnish";
var azimuth$t = "Atsimuutti";
var dawn$t = "Sarastus";
var dusk$t = "Hämärä";
var elevation$t = "Korkeus";
var moonrise$t = "Kuunnousu";
var moonset$t = "Kuunlasku";
var noon$t = "Keskipäivä";
var sunrise$t = "Auringonnousu";
var sunset$t = "Auringonlasku";
var new_moon$t = "Uusikuu";
var waxing_crescent$t = "Kasvava sirppi";
var first_quarter$t = "Ensimmäinen neljännes";
var waxing_gibbous$t = "Kasvava kupera";
var full_moon$t = "Täysikuu";
var waning_gibbous$t = "Vähenevä kupera";
var last_quarter$t = "Viimeinen neljännes";
var waning_crescent$t = "Vähenevä sirppi";
var fi = {
	languageName: languageName$t,
	azimuth: azimuth$t,
	dawn: dawn$t,
	dusk: dusk$t,
	elevation: elevation$t,
	moonrise: moonrise$t,
	moonset: moonset$t,
	noon: noon$t,
	sunrise: sunrise$t,
	sunset: sunset$t,
	new_moon: new_moon$t,
	waxing_crescent: waxing_crescent$t,
	first_quarter: first_quarter$t,
	waxing_gibbous: waxing_gibbous$t,
	full_moon: full_moon$t,
	waning_gibbous: waning_gibbous$t,
	last_quarter: last_quarter$t,
	waning_crescent: waning_crescent$t
};

var languageName$s = "French";
var azimuth$s = "Azimut";
var dawn$s = "Aube";
var dusk$s = "Crépuscule";
var elevation$s = "Élévation";
var moonrise$s = "Lever de lune";
var moonset$s = "Coucher de lune";
var noon$s = "Midi solaire";
var sunrise$s = "Lever du soleil";
var sunset$s = "Coucher du soleil";
var new_moon$s = "Nouvelle lune";
var waxing_crescent$s = "Premier croissant";
var first_quarter$s = "Premier quartier";
var waxing_gibbous$s = "Lune gibbeuse croissante";
var full_moon$s = "Pleine lune";
var waning_gibbous$s = "Lune gibbeuse décroissante";
var last_quarter$s = "Dernier quartier";
var waning_crescent$s = "Dernier croissant";
var fr = {
	languageName: languageName$s,
	azimuth: azimuth$s,
	dawn: dawn$s,
	dusk: dusk$s,
	elevation: elevation$s,
	moonrise: moonrise$s,
	moonset: moonset$s,
	noon: noon$s,
	sunrise: sunrise$s,
	sunset: sunset$s,
	new_moon: new_moon$s,
	waxing_crescent: waxing_crescent$s,
	first_quarter: first_quarter$s,
	waxing_gibbous: waxing_gibbous$s,
	full_moon: full_moon$s,
	waning_gibbous: waning_gibbous$s,
	last_quarter: last_quarter$s,
	waning_crescent: waning_crescent$s
};

var languageName$r = "Galician";
var azimuth$r = "Acimut";
var dawn$r = "Amencer";
var dusk$r = "Luscofusco";
var elevation$r = "Elevación";
var moonrise$r = "Saída da lúa";
var moonset$r = "Posta da lúa";
var noon$r = "Mediodía solar";
var sunrise$r = "Saída do sol";
var sunset$r = "Atardecer";
var new_moon$r = "Lúa nova";
var waxing_crescent$r = "Lúa crecente";
var first_quarter$r = "Cuarto crecente";
var waxing_gibbous$r = "Lúa xibosa crecente";
var full_moon$r = "Lúa chea";
var waning_gibbous$r = "Lúa xibosa minguante";
var last_quarter$r = "Cuarto minguante";
var waning_crescent$r = "Lúa minguante";
var gl = {
	languageName: languageName$r,
	azimuth: azimuth$r,
	dawn: dawn$r,
	dusk: dusk$r,
	elevation: elevation$r,
	moonrise: moonrise$r,
	moonset: moonset$r,
	noon: noon$r,
	sunrise: sunrise$r,
	sunset: sunset$r,
	new_moon: new_moon$r,
	waxing_crescent: waxing_crescent$r,
	first_quarter: first_quarter$r,
	waxing_gibbous: waxing_gibbous$r,
	full_moon: full_moon$r,
	waning_gibbous: waning_gibbous$r,
	last_quarter: last_quarter$r,
	waning_crescent: waning_crescent$r
};

var languageName$q = "Hebrew";
var azimuth$q = "אזימוט";
var dawn$q = "עלות השחר";
var dusk$q = "בין הערבים";
var elevation$q = "גובה";
var moonrise$q = "זריחה ירח";
var moonset$q = "שקיעה ירח";
var noon$q = "אמצע היום";
var sunrise$q = "זריחה";
var sunset$q = "שקיעה";
var new_moon$q = "מולד הירח";
var waxing_crescent$q = "סהר מתמלא";
var first_quarter$q = "רבע ראשון";
var waxing_gibbous$q = "לקראת מילוא";
var full_moon$q = "ירח מלא";
var waning_gibbous$q = "אחרי מילוא";
var last_quarter$q = "רבע אחרון";
var waning_crescent$q = "סהר מחסיר";
var he = {
	languageName: languageName$q,
	azimuth: azimuth$q,
	dawn: dawn$q,
	dusk: dusk$q,
	elevation: elevation$q,
	moonrise: moonrise$q,
	moonset: moonset$q,
	noon: noon$q,
	sunrise: sunrise$q,
	sunset: sunset$q,
	new_moon: new_moon$q,
	waxing_crescent: waxing_crescent$q,
	first_quarter: first_quarter$q,
	waxing_gibbous: waxing_gibbous$q,
	full_moon: full_moon$q,
	waning_gibbous: waning_gibbous$q,
	last_quarter: last_quarter$q,
	waning_crescent: waning_crescent$q
};

var languageName$p = "Croatian";
var azimuth$p = "Azimut";
var dawn$p = "Zora";
var dusk$p = "Sumrak";
var elevation$p = "Visina";
var moonrise$p = "Izlazak mjeseca";
var moonset$p = "Zalazak mjeseca";
var noon$p = "Sunčano podne";
var sunrise$p = "Izlazak sunca";
var sunset$p = "Zalazak sunca";
var new_moon$p = "Mladi Mjesec";
var waxing_crescent$p = "Rastući polumjesec";
var first_quarter$p = "Prva četvrt";
var waxing_gibbous$p = "Rastući ispupčeni Mjesec";
var full_moon$p = "Pun Mjesec";
var waning_gibbous$p = "Opadajući ispupčeni Mjesec";
var last_quarter$p = "Posljednja četvrt";
var waning_crescent$p = "Opadajući polumjesec";
var hr = {
	languageName: languageName$p,
	azimuth: azimuth$p,
	dawn: dawn$p,
	dusk: dusk$p,
	elevation: elevation$p,
	moonrise: moonrise$p,
	moonset: moonset$p,
	noon: noon$p,
	sunrise: sunrise$p,
	sunset: sunset$p,
	new_moon: new_moon$p,
	waxing_crescent: waxing_crescent$p,
	first_quarter: first_quarter$p,
	waxing_gibbous: waxing_gibbous$p,
	full_moon: full_moon$p,
	waning_gibbous: waning_gibbous$p,
	last_quarter: last_quarter$p,
	waning_crescent: waning_crescent$p
};

var languageName$o = "Hungarian";
var azimuth$o = "Azimut";
var dawn$o = "Hajnal";
var dusk$o = "Szürkület";
var elevation$o = "Magasság";
var moonrise$o = "Holdkelte";
var moonset$o = "Holdnyugta";
var noon$o = "Dél";
var sunrise$o = "Napkelte";
var sunset$o = "Napnyugta";
var new_moon$o = "Újhold";
var waxing_crescent$o = "Növekvő sarló";
var first_quarter$o = "Első negyed";
var waxing_gibbous$o = "Növekvő hold";
var full_moon$o = "Telihold";
var waning_gibbous$o = "Fogyó hold";
var last_quarter$o = "Utolsó negyed";
var waning_crescent$o = "Fogyó sarló";
var hu = {
	languageName: languageName$o,
	azimuth: azimuth$o,
	dawn: dawn$o,
	dusk: dusk$o,
	elevation: elevation$o,
	moonrise: moonrise$o,
	moonset: moonset$o,
	noon: noon$o,
	sunrise: sunrise$o,
	sunset: sunset$o,
	new_moon: new_moon$o,
	waxing_crescent: waxing_crescent$o,
	first_quarter: first_quarter$o,
	waxing_gibbous: waxing_gibbous$o,
	full_moon: full_moon$o,
	waning_gibbous: waning_gibbous$o,
	last_quarter: last_quarter$o,
	waning_crescent: waning_crescent$o
};

var languageName$n = "Icelandic";
var azimuth$n = "Áttarhorn";
var dawn$n = "Dögun";
var dusk$n = "Rökkur";
var elevation$n = "Hækkun";
var moonrise$n = "Tunglupprás";
var moonset$n = "Tunglsetur";
var noon$n = "Sólarhádegi";
var sunrise$n = "Sólarupprás";
var sunset$n = "Sólsetur";
var new_moon$n = "Nýtt tungl";
var waxing_crescent$n = "Sigðmána";
var first_quarter$n = "Fyrsta kvartil";
var waxing_gibbous$n = "Vaxandi gleiðmána";
var full_moon$n = "Fullt tungl";
var waning_gibbous$n = "Minnkandi gleiðmána";
var last_quarter$n = "Síðasta kvartil";
var waning_crescent$n = "Minnkandi sigðmána";
var is = {
	languageName: languageName$n,
	azimuth: azimuth$n,
	dawn: dawn$n,
	dusk: dusk$n,
	elevation: elevation$n,
	moonrise: moonrise$n,
	moonset: moonset$n,
	noon: noon$n,
	sunrise: sunrise$n,
	sunset: sunset$n,
	new_moon: new_moon$n,
	waxing_crescent: waxing_crescent$n,
	first_quarter: first_quarter$n,
	waxing_gibbous: waxing_gibbous$n,
	full_moon: full_moon$n,
	waning_gibbous: waning_gibbous$n,
	last_quarter: last_quarter$n,
	waning_crescent: waning_crescent$n
};

var languageName$m = "Italian";
var azimuth$m = "Azimut";
var dawn$m = "Aurora";
var dusk$m = "Crepuscolo";
var elevation$m = "Elevazione";
var moonrise$m = "Levata";
var moonset$m = "Calata";
var noon$m = "Mezzogiorno";
var sunrise$m = "Alba";
var sunset$m = "Tramonto";
var new_moon$m = "Luna nuova";
var waxing_crescent$m = "Luna crescente";
var first_quarter$m = "Primo quarto";
var waxing_gibbous$m = "Luna gibbosa crescente";
var full_moon$m = "Luna piena";
var waning_gibbous$m = "Luna gibbosa calante";
var last_quarter$m = "Ultimo quarto";
var waning_crescent$m = "Luna calante";
var it = {
	languageName: languageName$m,
	azimuth: azimuth$m,
	dawn: dawn$m,
	dusk: dusk$m,
	elevation: elevation$m,
	moonrise: moonrise$m,
	moonset: moonset$m,
	noon: noon$m,
	sunrise: sunrise$m,
	sunset: sunset$m,
	new_moon: new_moon$m,
	waxing_crescent: waxing_crescent$m,
	first_quarter: first_quarter$m,
	waxing_gibbous: waxing_gibbous$m,
	full_moon: full_moon$m,
	waning_gibbous: waning_gibbous$m,
	last_quarter: last_quarter$m,
	waning_crescent: waning_crescent$m
};

var languageName$l = "Japanese";
var azimuth$l = "方位角";
var dawn$l = "明け方";
var dusk$l = "夕方";
var elevation$l = "高度";
var moonrise$l = "月の出";
var moonset$l = "月の入り";
var noon$l = "南中";
var sunrise$l = "日の出";
var sunset$l = "日没";
var new_moon$l = "新月";
var waxing_crescent$l = "三日月";
var first_quarter$l = "上弦の月";
var waxing_gibbous$l = "十三夜の月";
var full_moon$l = "満月";
var waning_gibbous$l = "十六夜の月";
var last_quarter$l = "下弦の月";
var waning_crescent$l = "有明の月";
var ja = {
	languageName: languageName$l,
	azimuth: azimuth$l,
	dawn: dawn$l,
	dusk: dusk$l,
	elevation: elevation$l,
	moonrise: moonrise$l,
	moonset: moonset$l,
	noon: noon$l,
	sunrise: sunrise$l,
	sunset: sunset$l,
	new_moon: new_moon$l,
	waxing_crescent: waxing_crescent$l,
	first_quarter: first_quarter$l,
	waxing_gibbous: waxing_gibbous$l,
	full_moon: full_moon$l,
	waning_gibbous: waning_gibbous$l,
	last_quarter: last_quarter$l,
	waning_crescent: waning_crescent$l
};

var languageName$k = "Korean";
var azimuth$k = "방위각";
var dawn$k = "새벽녘";
var dusk$k = "해질녘";
var elevation$k = "고도";
var moonrise$k = "달돋이";
var moonset$k = "달넘이";
var noon$k = "태양 남중";
var sunrise$k = "해돋이";
var sunset$k = "해넘이";
var new_moon$k = "신월";
var waxing_crescent$k = "초승달";
var first_quarter$k = "상현달";
var waxing_gibbous$k = "차오르는 볼록달";
var full_moon$k = "보름달";
var waning_gibbous$k = "기우는 볼록달";
var last_quarter$k = "하현달";
var waning_crescent$k = "그믐달";
var ko = {
	languageName: languageName$k,
	azimuth: azimuth$k,
	dawn: dawn$k,
	dusk: dusk$k,
	elevation: elevation$k,
	moonrise: moonrise$k,
	moonset: moonset$k,
	noon: noon$k,
	sunrise: sunrise$k,
	sunset: sunset$k,
	new_moon: new_moon$k,
	waxing_crescent: waxing_crescent$k,
	first_quarter: first_quarter$k,
	waxing_gibbous: waxing_gibbous$k,
	full_moon: full_moon$k,
	waning_gibbous: waning_gibbous$k,
	last_quarter: last_quarter$k,
	waning_crescent: waning_crescent$k
};

var languageName$j = "Lithuanian";
var azimuth$j = "Azimutas";
var dawn$j = "Aušra";
var dusk$j = "Prieblanda";
var elevation$j = "Pakilimas";
var moonrise$j = "Mėnulio kilimas";
var moonset$j = "Mėnulio leidimasis";
var noon$j = "Vidurdienis";
var sunrise$j = "Saulėtekis";
var sunset$j = "Saulėlydis";
var new_moon$j = "Jaunatis";
var waxing_crescent$j = "Jaunas mėnulis";
var first_quarter$j = "Priešpilnis";
var waxing_gibbous$j = "Pilnėjantis mėnulis";
var full_moon$j = "Pilnatis";
var waning_gibbous$j = "Dylantis mėnulis";
var last_quarter$j = "Delčia";
var waning_crescent$j = "Senas mėnulis";
var lt = {
	languageName: languageName$j,
	azimuth: azimuth$j,
	dawn: dawn$j,
	dusk: dusk$j,
	elevation: elevation$j,
	moonrise: moonrise$j,
	moonset: moonset$j,
	noon: noon$j,
	sunrise: sunrise$j,
	sunset: sunset$j,
	new_moon: new_moon$j,
	waxing_crescent: waxing_crescent$j,
	first_quarter: first_quarter$j,
	waxing_gibbous: waxing_gibbous$j,
	full_moon: full_moon$j,
	waning_gibbous: waning_gibbous$j,
	last_quarter: last_quarter$j,
	waning_crescent: waning_crescent$j
};

var languageName$i = "Latvian";
var azimuth$i = "Azimuts";
var dawn$i = "Rītausma";
var dusk$i = "Krēsla";
var elevation$i = "Augstums";
var moonrise$i = "Mēness lēkts";
var moonset$i = "Mēness riets";
var noon$i = "Saules kulminācija";
var sunrise$i = "Saullēkts";
var sunset$i = "Saulriets";
var new_moon$i = "Jauns mēness";
var waxing_crescent$i = "Augošais sirpis";
var first_quarter$i = "Pirmais ceturksnis";
var waxing_gibbous$i = "Augošais mēness";
var full_moon$i = "Pilnmēness";
var waning_gibbous$i = "Dilstošais mēness";
var last_quarter$i = "Pēdējais ceturksnis";
var waning_crescent$i = "Dilstošais sirpis";
var lv = {
	languageName: languageName$i,
	azimuth: azimuth$i,
	dawn: dawn$i,
	dusk: dusk$i,
	elevation: elevation$i,
	moonrise: moonrise$i,
	moonset: moonset$i,
	noon: noon$i,
	sunrise: sunrise$i,
	sunset: sunset$i,
	new_moon: new_moon$i,
	waxing_crescent: waxing_crescent$i,
	first_quarter: first_quarter$i,
	waxing_gibbous: waxing_gibbous$i,
	full_moon: full_moon$i,
	waning_gibbous: waning_gibbous$i,
	last_quarter: last_quarter$i,
	waning_crescent: waning_crescent$i
};

var languageName$h = "Malay";
var azimuth$h = "Azimut";
var dawn$h = "Fajar";
var dusk$h = "Senja";
var elevation$h = "Ketinggian";
var moonrise$h = "Bulan terbit";
var moonset$h = "Bulan terbenam";
var noon$h = "Tengahari";
var sunrise$h = "Matahari terbit";
var sunset$h = "Matahari terbenam";
var new_moon$h = "Anak bulan";
var waxing_crescent$h = "Bulan sabit";
var first_quarter$h = "Perbani awal";
var waxing_gibbous$h = "Bulan bunting pelanduk";
var full_moon$h = "Bulan purnama";
var waning_gibbous$h = "Bulan bincul akhir";
var last_quarter$h = "Perbani akhir";
var waning_crescent$h = "Hilal akhir";
var ms = {
	languageName: languageName$h,
	azimuth: azimuth$h,
	dawn: dawn$h,
	dusk: dusk$h,
	elevation: elevation$h,
	moonrise: moonrise$h,
	moonset: moonset$h,
	noon: noon$h,
	sunrise: sunrise$h,
	sunset: sunset$h,
	new_moon: new_moon$h,
	waxing_crescent: waxing_crescent$h,
	first_quarter: first_quarter$h,
	waxing_gibbous: waxing_gibbous$h,
	full_moon: full_moon$h,
	waning_gibbous: waning_gibbous$h,
	last_quarter: last_quarter$h,
	waning_crescent: waning_crescent$h
};

var languageName$g = "Norwegian (Bokmål)";
var azimuth$g = "Azimut";
var dawn$g = "Daggry";
var dusk$g = "Skumring";
var elevation$g = "Elevasjon";
var moonrise$g = "Måneoppgang";
var moonset$g = "Månenedgang";
var noon$g = "Middag";
var sunrise$g = "Soloppgang";
var sunset$g = "Solnedgang";
var new_moon$g = "Nymåne";
var waxing_crescent$g = "Voksende månesigd";
var first_quarter$g = "Første kvarter";
var waxing_gibbous$g = "Voksende måne";
var full_moon$g = "Fullmåne";
var waning_gibbous$g = "Minkende måne";
var last_quarter$g = "Siste kvarter";
var waning_crescent$g = "Minkende månesigd";
var nb = {
	languageName: languageName$g,
	azimuth: azimuth$g,
	dawn: dawn$g,
	dusk: dusk$g,
	elevation: elevation$g,
	moonrise: moonrise$g,
	moonset: moonset$g,
	noon: noon$g,
	sunrise: sunrise$g,
	sunset: sunset$g,
	new_moon: new_moon$g,
	waxing_crescent: waxing_crescent$g,
	first_quarter: first_quarter$g,
	waxing_gibbous: waxing_gibbous$g,
	full_moon: full_moon$g,
	waning_gibbous: waning_gibbous$g,
	last_quarter: last_quarter$g,
	waning_crescent: waning_crescent$g
};

var languageName$f = "Dutch";
var azimuth$f = "Azimut";
var dawn$f = "Dageraad";
var dusk$f = "Schemer";
var elevation$f = "Hoogte";
var moonrise$f = "Maanopkomst";
var moonset$f = "Maanondergang";
var noon$f = "Middaguur";
var sunrise$f = "Zonsopkomst";
var sunset$f = "Zonsondergang";
var new_moon$f = "Nieuwe maan";
var waxing_crescent$f = "Wassende maansikkel";
var first_quarter$f = "Eerste kwartier";
var waxing_gibbous$f = "Wassende maan";
var full_moon$f = "Volle maan";
var waning_gibbous$f = "Afnemende maan";
var last_quarter$f = "Laatste kwartier";
var waning_crescent$f = "Afnemende maansikkel";
var nl = {
	languageName: languageName$f,
	azimuth: azimuth$f,
	dawn: dawn$f,
	dusk: dusk$f,
	elevation: elevation$f,
	moonrise: moonrise$f,
	moonset: moonset$f,
	noon: noon$f,
	sunrise: sunrise$f,
	sunset: sunset$f,
	new_moon: new_moon$f,
	waxing_crescent: waxing_crescent$f,
	first_quarter: first_quarter$f,
	waxing_gibbous: waxing_gibbous$f,
	full_moon: full_moon$f,
	waning_gibbous: waning_gibbous$f,
	last_quarter: last_quarter$f,
	waning_crescent: waning_crescent$f
};

var languageName$e = "Norwegian (Nynorsk)";
var azimuth$e = "Asimut";
var dawn$e = "Daggry";
var dusk$e = "Skumring";
var elevation$e = "Høgde";
var moonrise$e = "Måneoppgang";
var moonset$e = "Månenedgang";
var noon$e = "Middag";
var sunrise$e = "Soloppgang";
var sunset$e = "Solnedgang";
var new_moon$e = "Nymåne";
var waxing_crescent$e = "Veksande månesigd";
var first_quarter$e = "Første kvarter";
var waxing_gibbous$e = "Veksande måne";
var full_moon$e = "Fullmåne";
var waning_gibbous$e = "Minkande måne";
var last_quarter$e = "Siste kvarter";
var waning_crescent$e = "Minkande månesigd";
var nn = {
	languageName: languageName$e,
	azimuth: azimuth$e,
	dawn: dawn$e,
	dusk: dusk$e,
	elevation: elevation$e,
	moonrise: moonrise$e,
	moonset: moonset$e,
	noon: noon$e,
	sunrise: sunrise$e,
	sunset: sunset$e,
	new_moon: new_moon$e,
	waxing_crescent: waxing_crescent$e,
	first_quarter: first_quarter$e,
	waxing_gibbous: waxing_gibbous$e,
	full_moon: full_moon$e,
	waning_gibbous: waning_gibbous$e,
	last_quarter: last_quarter$e,
	waning_crescent: waning_crescent$e
};

var languageName$d = "Polish";
var azimuth$d = "Azymut";
var dawn$d = "Świt";
var dusk$d = "Zmierzch";
var elevation$d = "Wysokość";
var moonrise$d = "Wschód księżyca";
var moonset$d = "Zachód księżyca";
var noon$d = "Górowanie";
var sunrise$d = "Wschód";
var sunset$d = "Zachód";
var new_moon$d = "Nów";
var waxing_crescent$d = "Sierp przybywający";
var first_quarter$d = "Pierwsza kwadra";
var waxing_gibbous$d = "Garb przybywający";
var full_moon$d = "Pełnia";
var waning_gibbous$d = "Garb ubywający";
var last_quarter$d = "Ostatnia kwadra";
var waning_crescent$d = "Sierp ubywający";
var pl = {
	languageName: languageName$d,
	azimuth: azimuth$d,
	dawn: dawn$d,
	dusk: dusk$d,
	elevation: elevation$d,
	moonrise: moonrise$d,
	moonset: moonset$d,
	noon: noon$d,
	sunrise: sunrise$d,
	sunset: sunset$d,
	new_moon: new_moon$d,
	waxing_crescent: waxing_crescent$d,
	first_quarter: first_quarter$d,
	waxing_gibbous: waxing_gibbous$d,
	full_moon: full_moon$d,
	waning_gibbous: waning_gibbous$d,
	last_quarter: last_quarter$d,
	waning_crescent: waning_crescent$d
};

var languageName$c = "Portuguese (Portugal)";
var azimuth$c = "Azimute";
var dawn$c = "Amanhecer";
var dusk$c = "Anoitecer";
var elevation$c = "Elevação";
var moonrise$c = "Nascer da lua";
var moonset$c = "Pôr da lua";
var noon$c = "Meio dia";
var sunrise$c = "Nascer do sol";
var sunset$c = "Pôr do sol";
var new_moon$c = "Lua nova";
var waxing_crescent$c = "Lua crescente";
var first_quarter$c = "Quarto crescente";
var waxing_gibbous$c = "Lua crescente gibosa";
var full_moon$c = "Lua cheia";
var waning_gibbous$c = "Lua minguante gibosa";
var last_quarter$c = "Quarto minguante";
var waning_crescent$c = "Lua minguante";
var pt = {
	languageName: languageName$c,
	azimuth: azimuth$c,
	dawn: dawn$c,
	dusk: dusk$c,
	elevation: elevation$c,
	moonrise: moonrise$c,
	moonset: moonset$c,
	noon: noon$c,
	sunrise: sunrise$c,
	sunset: sunset$c,
	new_moon: new_moon$c,
	waxing_crescent: waxing_crescent$c,
	first_quarter: first_quarter$c,
	waxing_gibbous: waxing_gibbous$c,
	full_moon: full_moon$c,
	waning_gibbous: waning_gibbous$c,
	last_quarter: last_quarter$c,
	waning_crescent: waning_crescent$c
};

var languageName$b = "Portuguese (Brazil)";
var azimuth$b = "Azimute";
var dawn$b = "Amanhecer";
var dusk$b = "Anoitecer";
var elevation$b = "Elevação";
var moonrise$b = "Nascer da lua";
var moonset$b = "Pôr da lua";
var noon$b = "Meio dia solar";
var sunrise$b = "Nascer do sol";
var sunset$b = "Pôr do sol";
var new_moon$b = "Lua nova";
var waxing_crescent$b = "Lua crescente";
var first_quarter$b = "Quarto crescente";
var waxing_gibbous$b = "Lua crescente gibosa";
var full_moon$b = "Lua cheia";
var waning_gibbous$b = "Lua minguante gibosa";
var last_quarter$b = "Quarto minguante";
var waning_crescent$b = "Lua minguante";
var pt_BR = {
	languageName: languageName$b,
	azimuth: azimuth$b,
	dawn: dawn$b,
	dusk: dusk$b,
	elevation: elevation$b,
	moonrise: moonrise$b,
	moonset: moonset$b,
	noon: noon$b,
	sunrise: sunrise$b,
	sunset: sunset$b,
	new_moon: new_moon$b,
	waxing_crescent: waxing_crescent$b,
	first_quarter: first_quarter$b,
	waxing_gibbous: waxing_gibbous$b,
	full_moon: full_moon$b,
	waning_gibbous: waning_gibbous$b,
	last_quarter: last_quarter$b,
	waning_crescent: waning_crescent$b
};

var languageName$a = "Romanian";
var azimuth$a = "Azimut";
var dawn$a = "Zori";
var dusk$a = "Amurg";
var elevation$a = "Elevație";
var moonrise$a = "Răsărit lunii";
var moonset$a = "Apus lunii";
var noon$a = "Zenit";
var sunrise$a = "Răsărit";
var sunset$a = "Apus";
var new_moon$a = "Lună nouă";
var waxing_crescent$a = "Lună crescătoare";
var first_quarter$a = "Primul pătrar";
var waxing_gibbous$a = "Lună gibboasă crescătoare";
var full_moon$a = "Lună plină";
var waning_gibbous$a = "Lună gibboasă descrescătoare";
var last_quarter$a = "Ultimul pătrar";
var waning_crescent$a = "Lună descrescătoare";
var ro = {
	languageName: languageName$a,
	azimuth: azimuth$a,
	dawn: dawn$a,
	dusk: dusk$a,
	elevation: elevation$a,
	moonrise: moonrise$a,
	moonset: moonset$a,
	noon: noon$a,
	sunrise: sunrise$a,
	sunset: sunset$a,
	new_moon: new_moon$a,
	waxing_crescent: waxing_crescent$a,
	first_quarter: first_quarter$a,
	waxing_gibbous: waxing_gibbous$a,
	full_moon: full_moon$a,
	waning_gibbous: waning_gibbous$a,
	last_quarter: last_quarter$a,
	waning_crescent: waning_crescent$a
};

var languageName$9 = "Serbian";
var azimuth$9 = "Azimut";
var dawn$9 = "Zora";
var dusk$9 = "Sumrak";
var elevation$9 = "Visina";
var moonrise$9 = "Izlazak meseca";
var moonset$9 = "Zalazak meseca";
var noon$9 = "Sunčano podne";
var sunrise$9 = "Izlazak sunca";
var sunset$9 = "Zalazak sunca";
var new_moon$9 = "Mlad mesec";
var waxing_crescent$9 = "Rastući polumesec";
var first_quarter$9 = "Prva četvrt";
var waxing_gibbous$9 = "Rastući ispupčeni Mesec";
var full_moon$9 = "Pun mesec";
var waning_gibbous$9 = "Opadajući ispupčeni Mesec";
var last_quarter$9 = "Poslednja četvrt";
var waning_crescent$9 = "Opadajući polumesec";
var rs = {
	languageName: languageName$9,
	azimuth: azimuth$9,
	dawn: dawn$9,
	dusk: dusk$9,
	elevation: elevation$9,
	moonrise: moonrise$9,
	moonset: moonset$9,
	noon: noon$9,
	sunrise: sunrise$9,
	sunset: sunset$9,
	new_moon: new_moon$9,
	waxing_crescent: waxing_crescent$9,
	first_quarter: first_quarter$9,
	waxing_gibbous: waxing_gibbous$9,
	full_moon: full_moon$9,
	waning_gibbous: waning_gibbous$9,
	last_quarter: last_quarter$9,
	waning_crescent: waning_crescent$9
};

var languageName$8 = "Russian";
var azimuth$8 = "Азимут";
var dawn$8 = "Рассвет";
var dusk$8 = "Сумерки";
var elevation$8 = "Высота";
var moonrise$8 = "Восход луны";
var moonset$8 = "Закат луны";
var noon$8 = "Зенит";
var sunrise$8 = "Восход";
var sunset$8 = "Закат";
var new_moon$8 = "Новолуние";
var waxing_crescent$8 = "Растущий серп";
var first_quarter$8 = "Первая четверть";
var waxing_gibbous$8 = "Растущая Луна";
var full_moon$8 = "Полнолуние";
var waning_gibbous$8 = "Убывающая Луна";
var last_quarter$8 = "Последняя четверть";
var waning_crescent$8 = "Убывающий серп";
var ru = {
	languageName: languageName$8,
	azimuth: azimuth$8,
	dawn: dawn$8,
	dusk: dusk$8,
	elevation: elevation$8,
	moonrise: moonrise$8,
	moonset: moonset$8,
	noon: noon$8,
	sunrise: sunrise$8,
	sunset: sunset$8,
	new_moon: new_moon$8,
	waxing_crescent: waxing_crescent$8,
	first_quarter: first_quarter$8,
	waxing_gibbous: waxing_gibbous$8,
	full_moon: full_moon$8,
	waning_gibbous: waning_gibbous$8,
	last_quarter: last_quarter$8,
	waning_crescent: waning_crescent$8
};

var languageName$7 = "Slovak";
var azimuth$7 = "Azimut";
var dawn$7 = "Úsvit";
var dusk$7 = "Súmrak";
var elevation$7 = "Výška";
var moonrise$7 = "Východ mesiaca";
var moonset$7 = "Západ mesiaca";
var noon$7 = "Slnečné poludnie";
var sunrise$7 = "Východ slnka";
var sunset$7 = "Západ slnka";
var new_moon$7 = "Nov";
var waxing_crescent$7 = "Dorastajúci kosáčik";
var first_quarter$7 = "Prvá štvrť";
var waxing_gibbous$7 = "Dorastajúci Mesiac";
var full_moon$7 = "Spln";
var waning_gibbous$7 = "Cúvajúci Mesiac";
var last_quarter$7 = "Posledná štvrť";
var waning_crescent$7 = "Cúvajúci kosáčik";
var sk = {
	languageName: languageName$7,
	azimuth: azimuth$7,
	dawn: dawn$7,
	dusk: dusk$7,
	elevation: elevation$7,
	moonrise: moonrise$7,
	moonset: moonset$7,
	noon: noon$7,
	sunrise: sunrise$7,
	sunset: sunset$7,
	new_moon: new_moon$7,
	waxing_crescent: waxing_crescent$7,
	first_quarter: first_quarter$7,
	waxing_gibbous: waxing_gibbous$7,
	full_moon: full_moon$7,
	waning_gibbous: waning_gibbous$7,
	last_quarter: last_quarter$7,
	waning_crescent: waning_crescent$7
};

var languageName$6 = "Slovenian";
var azimuth$6 = "Azimut";
var dawn$6 = "Zora";
var dusk$6 = "Mrak";
var elevation$6 = "Višina";
var moonrise$6 = "Lunin vzhod";
var moonset$6 = "Lunin zahod";
var noon$6 = "Sončno poldne";
var sunrise$6 = "Sončni vzhod";
var sunset$6 = "Sončni zahod";
var new_moon$6 = "Mlaj";
var waxing_crescent$6 = "Rastoči srp";
var first_quarter$6 = "Prvi krajec";
var waxing_gibbous$6 = "Rastoča luna";
var full_moon$6 = "Ščip";
var waning_gibbous$6 = "Upadajoča luna";
var last_quarter$6 = "Zadnji krajec";
var waning_crescent$6 = "Upadajoči srp";
var sl = {
	languageName: languageName$6,
	azimuth: azimuth$6,
	dawn: dawn$6,
	dusk: dusk$6,
	elevation: elevation$6,
	moonrise: moonrise$6,
	moonset: moonset$6,
	noon: noon$6,
	sunrise: sunrise$6,
	sunset: sunset$6,
	new_moon: new_moon$6,
	waxing_crescent: waxing_crescent$6,
	first_quarter: first_quarter$6,
	waxing_gibbous: waxing_gibbous$6,
	full_moon: full_moon$6,
	waning_gibbous: waning_gibbous$6,
	last_quarter: last_quarter$6,
	waning_crescent: waning_crescent$6
};

var languageName$5 = "Swedish";
var azimuth$5 = "Azimut";
var dawn$5 = "Gryning";
var dusk$5 = "Skymning";
var elevation$5 = "Elevation";
var moonrise$5 = "Månuppgång";
var moonset$5 = "Månnedgång";
var noon$5 = "Middag";
var sunrise$5 = "Soluppgång";
var sunset$5 = "Solnedgång";
var new_moon$5 = "Nymåne";
var waxing_crescent$5 = "Tilltagande månskära";
var first_quarter$5 = "Första kvarteret";
var waxing_gibbous$5 = "Tilltagande måne";
var full_moon$5 = "Fullmåne";
var waning_gibbous$5 = "Avtagande måne";
var last_quarter$5 = "Sista kvarteret";
var waning_crescent$5 = "Avtagande månskära";
var sv = {
	languageName: languageName$5,
	azimuth: azimuth$5,
	dawn: dawn$5,
	dusk: dusk$5,
	elevation: elevation$5,
	moonrise: moonrise$5,
	moonset: moonset$5,
	noon: noon$5,
	sunrise: sunrise$5,
	sunset: sunset$5,
	new_moon: new_moon$5,
	waxing_crescent: waxing_crescent$5,
	first_quarter: first_quarter$5,
	waxing_gibbous: waxing_gibbous$5,
	full_moon: full_moon$5,
	waning_gibbous: waning_gibbous$5,
	last_quarter: last_quarter$5,
	waning_crescent: waning_crescent$5
};

var languageName$4 = "Turkish";
var azimuth$4 = "Güney Açısı";
var dawn$4 = "Şafak";
var dusk$4 = "Alacakaranlık";
var elevation$4 = "Yükseklik";
var moonrise$4 = "Ayın doğuşu";
var moonset$4 = "Ayın batışı";
var noon$4 = "Öğle";
var sunrise$4 = "Gündoğumu";
var sunset$4 = "Günbatımı";
var new_moon$4 = "Yeni ay";
var waxing_crescent$4 = "Büyüyen hilal";
var first_quarter$4 = "İlk dördün";
var waxing_gibbous$4 = "Büyüyen şişkin ay";
var full_moon$4 = "Dolunay";
var waning_gibbous$4 = "Küçülen şişkin ay";
var last_quarter$4 = "Son dördün";
var waning_crescent$4 = "Küçülen hilal";
var tr = {
	languageName: languageName$4,
	azimuth: azimuth$4,
	dawn: dawn$4,
	dusk: dusk$4,
	elevation: elevation$4,
	moonrise: moonrise$4,
	moonset: moonset$4,
	noon: noon$4,
	sunrise: sunrise$4,
	sunset: sunset$4,
	new_moon: new_moon$4,
	waxing_crescent: waxing_crescent$4,
	first_quarter: first_quarter$4,
	waxing_gibbous: waxing_gibbous$4,
	full_moon: full_moon$4,
	waning_gibbous: waning_gibbous$4,
	last_quarter: last_quarter$4,
	waning_crescent: waning_crescent$4
};

var languageName$3 = "Ukrainian";
var azimuth$3 = "Азимут";
var dawn$3 = "Світанок";
var dusk$3 = "Сутінки";
var elevation$3 = "Висота";
var moonrise$3 = "Схід місяця";
var moonset$3 = "Захід місяця";
var noon$3 = "Зеніт";
var sunrise$3 = "Схід";
var sunset$3 = "Захід";
var new_moon$3 = "Молодик";
var waxing_crescent$3 = "Зростаючий серп";
var first_quarter$3 = "Перша чверть";
var waxing_gibbous$3 = "Зростаючий Місяць";
var full_moon$3 = "Повний Місяць";
var waning_gibbous$3 = "Спадаючий Місяць";
var last_quarter$3 = "Остання чверть";
var waning_crescent$3 = "Старий Місяць";
var uk = {
	languageName: languageName$3,
	azimuth: azimuth$3,
	dawn: dawn$3,
	dusk: dusk$3,
	elevation: elevation$3,
	moonrise: moonrise$3,
	moonset: moonset$3,
	noon: noon$3,
	sunrise: sunrise$3,
	sunset: sunset$3,
	new_moon: new_moon$3,
	waxing_crescent: waxing_crescent$3,
	first_quarter: first_quarter$3,
	waxing_gibbous: waxing_gibbous$3,
	full_moon: full_moon$3,
	waning_gibbous: waning_gibbous$3,
	last_quarter: last_quarter$3,
	waning_crescent: waning_crescent$3
};

var languageName$2 = "Urdu";
var azimuth$2 = "سمت الراسی";
var dawn$2 = "سویرا";
var dusk$2 = "شام";
var elevation$2 = "بلندی";
var moonrise$2 = "طلوع قمر";
var moonset$2 = "غروب قمر";
var noon$2 = "دوپہر";
var sunrise$2 = "طلوع آفتاب";
var sunset$2 = "غروب آفتاب";
var new_moon$2 = "نیا چاند";
var waxing_crescent$2 = "بڑھتا ہوا ہلال";
var first_quarter$2 = "پہلا چوتھائی";
var waxing_gibbous$2 = "بڑھتا ہوا محدب";
var full_moon$2 = "بدر";
var waning_gibbous$2 = "گھٹتا ہوا محدب";
var last_quarter$2 = "تیسرا چوتھائی";
var waning_crescent$2 = "گھٹتا ہوا ہلال";
var ur = {
	languageName: languageName$2,
	azimuth: azimuth$2,
	dawn: dawn$2,
	dusk: dusk$2,
	elevation: elevation$2,
	moonrise: moonrise$2,
	moonset: moonset$2,
	noon: noon$2,
	sunrise: sunrise$2,
	sunset: sunset$2,
	new_moon: new_moon$2,
	waxing_crescent: waxing_crescent$2,
	first_quarter: first_quarter$2,
	waxing_gibbous: waxing_gibbous$2,
	full_moon: full_moon$2,
	waning_gibbous: waning_gibbous$2,
	last_quarter: last_quarter$2,
	waning_crescent: waning_crescent$2
};

var languageName$1 = "Chinese, simplified";
var azimuth$1 = "方位角";
var dawn$1 = "拂晓";
var dusk$1 = "傍晚";
var elevation$1 = "仰角";
var moonrise$1 = "月出";
var moonset$1 = "月落";
var noon$1 = "日中";
var sunrise$1 = "日出";
var sunset$1 = "日落";
var new_moon$1 = "新月";
var waxing_crescent$1 = "蛾眉月";
var first_quarter$1 = "上弦月";
var waxing_gibbous$1 = "盈凸月";
var full_moon$1 = "满月";
var waning_gibbous$1 = "亏凸月";
var last_quarter$1 = "下弦月";
var waning_crescent$1 = "残月";
var zh_Hans = {
	languageName: languageName$1,
	azimuth: azimuth$1,
	dawn: dawn$1,
	dusk: dusk$1,
	elevation: elevation$1,
	moonrise: moonrise$1,
	moonset: moonset$1,
	noon: noon$1,
	sunrise: sunrise$1,
	sunset: sunset$1,
	new_moon: new_moon$1,
	waxing_crescent: waxing_crescent$1,
	first_quarter: first_quarter$1,
	waxing_gibbous: waxing_gibbous$1,
	full_moon: full_moon$1,
	waning_gibbous: waning_gibbous$1,
	last_quarter: last_quarter$1,
	waning_crescent: waning_crescent$1
};

var languageName = "Chinese, traditional";
var azimuth = "方位";
var dawn = "黎明";
var dusk = "黃昏";
var elevation = "仰角";
var moonrise = "月出";
var moonset = "月落";
var noon = "日正當中";
var sunrise = "日昇";
var sunset = "日落";
var new_moon = "新月";
var waxing_crescent = "蛾眉月";
var first_quarter = "上弦月";
var waxing_gibbous = "盈凸月";
var full_moon = "滿月";
var waning_gibbous = "虧凸月";
var last_quarter = "下弦月";
var waning_crescent = "殘月";
var zh_Hant = {
	languageName: languageName,
	azimuth: azimuth,
	dawn: dawn,
	dusk: dusk,
	elevation: elevation,
	moonrise: moonrise,
	moonset: moonset,
	noon: noon,
	sunrise: sunrise,
	sunset: sunset,
	new_moon: new_moon,
	waxing_crescent: waxing_crescent,
	first_quarter: first_quarter,
	waxing_gibbous: waxing_gibbous,
	full_moon: full_moon,
	waning_gibbous: waning_gibbous,
	last_quarter: last_quarter,
	waning_crescent: waning_crescent
};

/* eslint-disable */
// AUTO-GENERATED by scripts/generate-i18n-index.mjs — do not edit by hand.
// Run `yarn i18n:generate` after adding or removing a language JSON file.

var localizationLanguages = {
  bg: bg,
  ca: ca,
  cs: cs,
  da: da,
  de: de,
  el: el,
  en: en,
  es: es,
  et: et,
  fa: fa,
  fi: fi,
  fr: fr,
  gl: gl,
  he: he,
  hr: hr,
  hu: hu,
  is: is,
  it: it,
  ja: ja,
  ko: ko,
  lt: lt,
  lv: lv,
  ms: ms,
  nb: nb,
  nl: nl,
  nn: nn,
  pl: pl,
  pt: pt,
  'pt-BR': pt_BR,
  ro: ro,
  rs: rs,
  ru: ru,
  sk: sk,
  sl: sl,
  sv: sv,
  tr: tr,
  uk: uk,
  ur: ur,
  'zh-Hans': zh_Hans,
  'zh-Hant': zh_Hant
};

var _Constants;
var Constants = /*#__PURE__*/_createClass(function Constants() {
  _classCallCheck(this, Constants);
});
_Constants = Constants;
_defineProperty(Constants, "FALLBACK_LOCALIZATION", en);
// Refresh period in seconds
_defineProperty(Constants, "DEFAULT_REFRESH_PERIOD", 20);
// 24 hours in milliseconds
_defineProperty(Constants, "MS_24_HOURS", 24 * 60 * 60 * 1000);
// 12 hours in milliseconds
_defineProperty(Constants, "MS_12_HOURS", 12 * 60 * 60 * 1000);
// Mapping of SunCalc moon phases to Home Assistant moon phase state and icon
_defineProperty(Constants, "MOON_PHASES", {
  newMoon: {
    state: 'new_moon',
    icon: 'moon-new'
  },
  waxingCrescentMoon: {
    state: 'waxing_crescent',
    icon: 'moon-waxing-crescent'
  },
  firstQuarterMoon: {
    state: 'first_quarter',
    icon: 'moon-first-quarter'
  },
  waxingGibbousMoon: {
    state: 'waxing_gibbous',
    icon: 'moon-waxing-gibbous'
  },
  fullMoon: {
    state: 'full_moon',
    icon: 'moon-full'
  },
  waningGibbousMoon: {
    state: 'waning_gibbous',
    icon: 'moon-waning-gibbous'
  },
  thirdQuarterMoon: {
    state: 'last_quarter',
    icon: 'moon-last-quarter'
  },
  waningCrescentMoon: {
    state: 'waning_crescent',
    icon: 'moon-waning-crescent'
  }
});
// Default config values, they will be used if the user hasn't provided a value in the card config
_defineProperty(Constants, "DEFAULT_CONFIG", {
  type: 'horizon-card',
  moon: true,
  sun: true,
  graph: true,
  debug_level: 0,
  refresh_period: _Constants.DEFAULT_REFRESH_PERIOD,
  fields: {
    sunrise: true,
    sunset: true,
    dawn: true,
    noon: true,
    dusk: true,
    azimuth: false,
    elevation: false,
    moonrise: false,
    moonset: false,
    moon_phase: false
  }
  // These keys must not be in the default config as they are provided by Home Assistant:
  // language, dark_mode, latitude, longitude, elevation, time_zone.
  // The default for 'now' is the current time and must not be specified here either.
});
_defineProperty(Constants, "DEFAULT_CARD_DATA", {
  partial: false,
  latitude: 0,
  longitude: 0,
  sunData: {
    azimuth: 0,
    elevation: 0,
    times: {
      now: new Date(),
      dawn: new Date(),
      dusk: new Date(),
      midnight: new Date(),
      noon: new Date(),
      sunrise: new Date(),
      sunset: new Date()
    },
    hueReduce: 0,
    saturationReduce: 0,
    lightnessReduce: 0
  },
  sunPosition: {
    x: 0,
    y: 0,
    scaleY: 1,
    offsetY: 0,
    horizonY: 0,
    sunriseX: 0,
    sunsetX: 0
  },
  moonData: {
    azimuth: 0,
    elevation: 0,
    fraction: 0,
    phase: _Constants.MOON_PHASES.fullMoon,
    phaseRotation: 0,
    zenithAngle: 0,
    parallacticAngle: 0,
    times: {
      now: new Date(),
      moonrise: new Date(),
      moonset: new Date()
    },
    saturationReduce: 0,
    lightnessReduce: 0
  },
  moonPosition: {
    x: 0,
    y: 0
  }
});
_defineProperty(Constants, "HORIZON_Y", 84);
_defineProperty(Constants, "SUN_RADIUS", 17);
_defineProperty(Constants, "MOON_RADIUS", 14);
// Generated from the JSON files in assets/localization/languages (see languages.generated.ts
// and scripts/generate-i18n-index.mjs). To add a language, just add a <code>.json (with a
// "languageName") to that folder — the index and README are regenerated automatically as
// part of the pull request, so there is nothing to run and no manual edit here.
_defineProperty(Constants, "LOCALIZATION_LANGUAGES", localizationLanguages);

var EHorizonCardI18NKeys = /*#__PURE__*/function (EHorizonCardI18NKeys) {
  EHorizonCardI18NKeys["Azimuth"] = "azimuth";
  EHorizonCardI18NKeys["Dawn"] = "dawn";
  EHorizonCardI18NKeys["Dusk"] = "dusk";
  EHorizonCardI18NKeys["Elevation"] = "elevation";
  EHorizonCardI18NKeys["Noon"] = "noon";
  EHorizonCardI18NKeys["Sunrise"] = "sunrise";
  EHorizonCardI18NKeys["Sunset"] = "sunset";
  EHorizonCardI18NKeys["Moonrise"] = "moonrise";
  EHorizonCardI18NKeys["Moonset"] = "moonset";
  return EHorizonCardI18NKeys;
}({});

var _templateObject$6, _templateObject2$3, _templateObject3$2, _templateObject4$1, _templateObject5$1, _templateObject6$1;
var HelperFunctions = /*#__PURE__*/function () {
  function HelperFunctions() {
    _classCallCheck(this, HelperFunctions);
  }
  return _createClass(HelperFunctions, null, [{
    key: "renderFieldElements",
    value: function renderFieldElements(i18n, translationKey, values) {
      var _this = this;
      var extraClasses = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var mappedValues = values.map(function (value, index) {
        return _this.valueToHtml(i18n, translationKey, value, extraClasses[index]);
      });
      return this.renderFieldElement(i18n, translationKey, mappedValues);
    }
  }, {
    key: "renderFieldElement",
    value: function renderFieldElement(i18n, translationKey, value) {
      return b(_templateObject$6 || (_templateObject$6 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-text-container\">\n        <div class=\"horizon-card-field-name\">", "</div>\n        ", "\n      </div>\n    "])), i18n.tr(translationKey), value instanceof Array ? value : this.valueToHtml(i18n, translationKey, value));
    }
  }, {
    key: "renderMoonElement",
    value: function renderMoonElement(i18n, phase, phaseRotation) {
      if (phase === undefined) {
        return A;
      }

      // The Moon phase name is a card label like any other: the card computes the phase itself and
      // renders the name from its own translations in the card's `language` (English fallback for
      // phrases not yet translated).
      var moon_phase_localized = i18n.tr(phase.state);
      return b(_templateObject2$3 || (_templateObject2$3 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-text-container\">\n        <div class=\"horizon-card-field-moon-phase\" style=\"transform: rotate(", "deg)\">\n          <ha-icon icon=\"mdi:", "\"></ha-icon>\n        </div>\n        <div class=\"horizon-card-field-value horizon-card-field-value-moon-phase\">", "</div>\n      </div>\n    "])), phaseRotation, phase.icon, moon_phase_localized);
    }
  }, {
    key: "valueToHtml",
    value: function valueToHtml(i18n, translationKey, value) {
      var klass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var mappedValue = this.fieldValueToString(i18n, translationKey, value);
      return b(_templateObject3$2 || (_templateObject3$2 = _taggedTemplateLiteral(["<div class=\"horizon-card-field-value ", "\">", "</div>"])), klass, mappedValue);
    }
  }, {
    key: "fieldValueToString",
    value: function fieldValueToString(i18n, translationKey, value) {
      var pre = '';
      var post = '';
      if (value === undefined) {
        value = '-';
      } else if (value instanceof Date) {
        value = i18n.formatDateAsTime(value);
        var parts = value.match(/(.*?)(\d{1,2}[:.]\d{2})(.*)/);
        if (parts != null) {
          pre = parts[1];
          value = parts[2];
          post = parts[3];
        }
      } else if (typeof value === 'number') {
        value = i18n.formatDecimal(value);
        if (translationKey === EHorizonCardI18NKeys.Azimuth || translationKey === EHorizonCardI18NKeys.Elevation) {
          value += '°';
        }
      }
      var preHtml = pre ? b(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteral(["<span class=\"horizon-card-field-value-secondary\">", "</span>"])), pre) : A;
      var postHtml = post ? b(_templateObject5$1 || (_templateObject5$1 = _taggedTemplateLiteral(["<span class=\"horizon-card-field-value-secondary\">", "</span>"])), post) : A;
      return b(_templateObject6$1 || (_templateObject6$1 = _taggedTemplateLiteral(["", "", "", ""])), preHtml, value, postHtml);
    }
  }, {
    key: "isValidLanguage",
    value: function isValidLanguage(language) {
      return Object.keys(Constants.LOCALIZATION_LANGUAGES).includes(language);
    }
  }, {
    key: "clamp",
    value: function clamp(min, max, value) {
      if (min === max) {
        return min;
      }
      if (min > max) {
        throw new RangeError('Min value can not be bigger than the max value');
      }
      return Math.min(Math.max(value, min), max);
    }
  }, {
    key: "rangeScale",
    value: function rangeScale(minRange, maxRange, range, value) {
      var clamped = HelperFunctions.clamp(minRange, maxRange, range) - minRange;
      var rangeSize = maxRange - minRange;
      return (1 - clamped / rangeSize) * value;
    }
  }, {
    key: "noonAtTimeZone",
    value: function noonAtTimeZone(date, timeZone) {
      var tzDate;
      try {
        tzDate = this.getTimeInTimeZone(date, '12:00:00', timeZone);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        tzDate = new Date(date);
        tzDate.setHours(12);
        tzDate.setMinutes(0);
        tzDate.setSeconds(0);
        tzDate.setMilliseconds(0);
      }
      return tzDate;
    }
  }, {
    key: "midnightAtTimeZone",
    value: function midnightAtTimeZone(date, timeZone) {
      var tzDate;
      try {
        tzDate = this.getTimeInTimeZone(date, '00:00:00', timeZone);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        tzDate = new Date(date);
        tzDate.setHours(0);
        tzDate.setMinutes(0);
        tzDate.setSeconds(0);
        tzDate.setMilliseconds(0);
      }
      return tzDate;
    }
  }, {
    key: "noonAtLongitude",
    value: function noonAtLongitude(date, longitude) {
      return HelperFunctions.solarTimeAtLongitude(date, 12, longitude);
    }
  }, {
    key: "midnightAtLongitude",
    value: function midnightAtLongitude(date, longitude) {
      return HelperFunctions.solarTimeAtLongitude(date, 0, longitude);
    }

    // Mean-solar-time reference (DST-free; 15°/h, east positive). Returns "hour:00 mean-solar-time
    // of the local solar day that `date` falls on", mirroring noonAtTimeZone's semantics so the
    // day-selection logic in readSunTimes keeps working. Only the solar day matters, so no rounding.
  }, {
    key: "solarTimeAtLongitude",
    value: function solarTimeAtLongitude(date, hour, longitude) {
      var offsetMs = longitude / 15 * 3600000;
      var local = new Date(date.getTime() + offsetMs);
      return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hour) - offsetMs);
    }
  }, {
    key: "getTimeInTimeZone",
    value: function getTimeInTimeZone(date, time, timeZone) {
      var formatter = new Intl.DateTimeFormat('fr-CA', {
        timeZone: timeZone,
        timeZoneName: 'longOffset'
      });
      // 'fr-CA' locale formats like '2023-04-11 UTC+03:00' or '2023-04-11 UTC-10:00' or '2023-04-11 UTC'
      var formatted = formatter.format(date);
      var parts = formatted.replace("\u2212", '-') // minuses might be U+2212 instead of plain old ASCII hyphen-minus
      .split(' ');
      var tz = parts[1].replace('UTC', '');
      if (tz === '') {
        tz = 'Z';
      }
      var dateToParse = "".concat(parts[0], "T").concat(time).concat(tz);
      var result = new Date(dateToParse);
      if (isNaN(result.getTime())) {
        // Something went fishy with using the above method - generally should not happen
        throw new Error("Could not convert time to time zone: ".concat(formatted, " -> ").concat(dateToParse));
      }
      return result;
    }
  }]);
}();

var I18N = /*#__PURE__*/function () {
  function I18N(language, timeZone, timeFormat, numberFormat) {
    _classCallCheck(this, I18N);
    _defineProperty(this, "localization", void 0);
    _defineProperty(this, "dateFormatter", void 0);
    _defineProperty(this, "locale", void 0);
    this.localization = I18N.matchLanguageToLocalization(language);
    this.dateFormatter = I18N.createDateFormatter(language, timeZone, timeFormat);
    this.locale = {
      language: language,
      time_format: timeFormat,
      number_format: numberFormat
    };
  }
  return _createClass(I18N, [{
    key: "formatDateAsTime",
    value: function formatDateAsTime(date) {
      var time = this.dateFormatter.format(date);
      if (this.locale.language === 'bg') {
        // Strips " ч." from times in Bulgarian - some major browsers insist on putting it there:
        // https://unicode-org.atlassian.net/browse/CLDR-11545
        // https://unicode-org.atlassian.net/browse/CLDR-15802
        time = time.replace(' ч.', '');
      }
      return time;
    }
  }, {
    key: "formatDecimal",
    value: function formatDecimal(decimal) {
      return formatNumber(decimal, this.locale);
    }

    /**
     * TR -> TRanslation
     * @param translationKey The key to lookup a translation for
     * @returns The string specified in the translation files
     */
  }, {
    key: "tr",
    value: function tr(translationKey) {
      var _ref, _this$localization$tr;
      // if the translation isn't completed in the target language, fall back to english
      // give ugly string for developers who misstype
      return (_ref = (_this$localization$tr = this.localization[translationKey]) !== null && _this$localization$tr !== void 0 ? _this$localization$tr : Constants.FALLBACK_LOCALIZATION[translationKey]) !== null && _ref !== void 0 ? _ref : "Translation key '".concat(translationKey, "' doesn't have a valid translation");
    }
  }], [{
    key: "matchLanguageToLocalization",
    value: function matchLanguageToLocalization(language) {
      var data = Constants.LOCALIZATION_LANGUAGES[language];
      if (data === undefined) {
        // Matches things like en-GB to en, es-419 to es, etc.
        data = Constants.LOCALIZATION_LANGUAGES[language.split('-', 2)[0]];
      }
      if (data === undefined) {
        data = Constants.FALLBACK_LOCALIZATION;
      }
      return data;
    }
  }, {
    key: "createDateFormatter",
    value: function createDateFormatter(language, timeZone, timeFormat) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
      var dateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: timeZone
      };

      // mimics home assistant's logic
      if (timeFormat === 'language' || timeFormat === 'system') {
        var testLanguage = timeFormat === 'language' ? language : undefined;
        var test = new Date().toLocaleString(testLanguage);
        dateTimeFormatOptions.hour12 = test.includes('AM') || test.includes('PM');
      } else {
        // Casting to string allows both "time_format: 12" and "time_format: '12'" in YAML
        dateTimeFormatOptions.hour12 = String(timeFormat) === '12';
      }
      var timeLocale = language;
      if (!dateTimeFormatOptions.hour12) {
        // Prevents times like 24:00, 24:15, etc. with the 24h clock in some locales.
        // Home Assistant does this only for 'en' but zh-Hant for example suffers from the same problem.
        timeLocale += '-u-hc-h23';
      }
      return new Intl.DateTimeFormat(timeLocale, dateTimeFormatOptions);
    }
  }]);
}();

var _templateObject$5;
var HorizonErrorContent = /*#__PURE__*/function () {
  function HorizonErrorContent(error, i18n) {
    _classCallCheck(this, HorizonErrorContent);
    _defineProperty(this, "i18n", void 0);
    _defineProperty(this, "error", void 0);
    this.error = error;
    this.i18n = i18n;
  }
  return _createClass(HorizonErrorContent, [{
    key: "render",
    value: function render() {
      var errorMessage = this.i18n.tr("errors.".concat(this.error));
      // eslint-disable-next-line no-console
      console.error(errorMessage);
      return b(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-error\">\n        ", "\n      </div>\n    "])), errorMessage);
    }
  }]);
}();

var _templateObject$4, _templateObject2$2;
var HorizonCardFooter = /*#__PURE__*/function () {
  function HorizonCardFooter(config, data, i18n) {
    _classCallCheck(this, HorizonCardFooter);
    _defineProperty(this, "data", void 0);
    _defineProperty(this, "i18n", void 0);
    _defineProperty(this, "sunTimes", void 0);
    _defineProperty(this, "moonTimes", void 0);
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "azimuths", void 0);
    _defineProperty(this, "azimuthExtraClasses", void 0);
    _defineProperty(this, "elevations", void 0);
    _defineProperty(this, "elevationExtraClasses", void 0);
    _defineProperty(this, "southern_flip", void 0);
    this.data = data;
    this.i18n = i18n;
    this.sunTimes = data.sunData.times;
    this.moonTimes = data.moonData.times;
    this.fields = config.fields;
    this.azimuths = [];
    if (this.fields.sun_azimuth) {
      this.azimuths.push(this.data.sunData.azimuth);
    }
    if (this.fields.moon_azimuth) {
      this.azimuths.push(this.data.moonData.azimuth);
    }
    if (this.fields.sun_azimuth && this.fields.moon_azimuth) {
      this.azimuthExtraClasses = ['horizon-card-sun-value', 'horizon-card-moon-value'];
    } else {
      this.azimuthExtraClasses = [];
    }
    this.elevations = [];
    if (this.fields.sun_elevation) {
      this.elevations.push(this.data.sunData.elevation);
    }
    if (this.fields.moon_elevation) {
      this.elevations.push(this.data.moonData.elevation);
    }
    if (this.fields.sun_elevation && this.fields.moon_elevation) {
      this.elevationExtraClasses = ['horizon-card-sun-value', 'horizon-card-moon-value'];
    } else {
      this.elevationExtraClasses = [];
    }
    this.southern_flip = config.southern_flip;
  }
  return _createClass(HorizonCardFooter, [{
    key: "render",
    value: function render() {
      var dawn = this.fields.dawn ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dawn, this.sunTimes.dawn) : A;
      var dusk = this.fields.dusk ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dusk, this.sunTimes.dusk) : A;
      var sunLeft = this.southern_flip ? dusk : dawn;
      var sunRight = this.southern_flip ? dawn : dusk;
      var moonrise = this.fields.moonrise ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Moonrise, this.moonTimes.moonrise) : A;
      var moonset = this.fields.moonset ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Moonset, this.moonTimes.moonset) : A;
      var moonLeft = this.southern_flip ? moonset : moonrise;
      var moonRight = this.southern_flip ? moonrise : moonset;
      var sunRow = this.renderRow(sunLeft, this.fields.noon ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Noon, this.sunTimes.noon) : A, sunRight);
      var azimuthElevationRow = this.renderRow(this.fields.sun_azimuth || this.fields.moon_azimuth ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Azimuth, this.azimuths, this.azimuthExtraClasses) : A, this.fields.sun_elevation || this.fields.moon_elevation ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Elevation, this.elevations, this.elevationExtraClasses) : A);
      var moonRow = this.renderRow(moonLeft, this.fields.moon_phase ? HelperFunctions.renderMoonElement(this.i18n, this.data.moonData.phase, this.data.moonData.phaseRotation) : A, moonRight);
      if (sunRow === A && azimuthElevationRow === A && moonRow === A) {
        return A;
      }
      return b(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-footer\">\n        ", "\n        ", "\n        ", "\n      </div>\n    "])), sunRow, azimuthElevationRow, moonRow);
    }
  }, {
    key: "renderRow",
    value: function renderRow() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var nonEmpty = args.filter(function (tr) {
        return tr !== A;
      });
      return nonEmpty.length > 0 ? b(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(["\n        <div class=\"horizon-card-field-row\">\n          ", "\n        </div>"])), nonEmpty) : A;
    }
  }]);
}();

var _templateObject$3, _templateObject2$1, _templateObject3$1, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0;
var HorizonCardGraph = /*#__PURE__*/function () {
  function HorizonCardGraph(config, data) {
    _classCallCheck(this, HorizonCardGraph);
    _defineProperty(this, "config", void 0);
    _defineProperty(this, "sunData", void 0);
    _defineProperty(this, "sunPosition", void 0);
    _defineProperty(this, "moonData", void 0);
    _defineProperty(this, "moonPosition", void 0);
    _defineProperty(this, "southernFlip", void 0);
    _defineProperty(this, "debugLevel", void 0);
    this.config = config;
    this.sunData = data.sunData;
    this.sunPosition = data.sunPosition;
    this.moonData = data.moonData;
    this.moonPosition = data.moonPosition;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.southernFlip = this.config.southern_flip;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.debugLevel = this.config.debug_level;
  }
  return _createClass(HorizonCardGraph, [{
    key: "render",
    value: function render() {
      return b(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-graph\">\n        <svg viewBox=\"0 0 550 150\" xmlns=\"http://www.w3.org/2000/svg\">\n          ", "\n        </svg>\n      </div>\n    "])), this.renderSvg());
    }
  }, {
    key: "renderSvg",
    value: function renderSvg() {
      var curve = this.sunCurve(this.sunPosition.scaleY);
      var showSun = this.config.sun !== false;
      return w(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["\n      <defs>\n        <!-- Sun defs -->\n        <path id=\"sun-path-unscaled\" d=\"", "\"/>\n        <path id=\"sun-path\" d=\"", "\"/>\n\n        <clipPath id=\"upper-path-mask\">\n          <use href=\"#sun-path\">\n        </clipPath>\n\n        <clipPath id=\"lower-path-mask\">\n          <path d=\"", " V0 H0\"/>\n        </clipPath>\n\n        <!-- Moon defs -->\n        <filter id=\"moon-blur\">\n          <feGaussianBlur in=\"SourceGraphic\"\n                          stdDeviation=\"", "\"/>\n        </filter>\n\n        <circle id=\"moon\"\n                cx=\"", "\" cy=\"", "\"\n                r=\"", "\" stroke=\"none\"/>\n\n        <path id=\"shade\"\n              d=\"M", ",", "\n                a ", ",", "\n                0\n                1,1\n                ", ",0\n                a ", ",", "\n                0\n                1,", "\n                ", ",0\n                Z\"\n              stroke-width=\"0\"/>\n\n        <mask id=\"moon-shadow-mask\">\n          <use href=\"#shade\"\n               stroke=\"white\" fill=\"white\"\n               filter=\"url(#moon-blur)\" stroke-width=\"0\"/>\n        </mask>\n\n        <mask id=\"moon-shadow-mask-inverted\">\n          <circle cx=\"", "\" cy=\"", "\"\n                  r=\"", "\"\n                  fill=\"white\" stroke=\"white\" stroke-width=\"0\"/>\n\n          <use href=\"#shade\"\n               stroke=\"black\" fill=\"black\"\n               filter=\"url(#moon-blur)\" stroke-width=\"0\"/>\n        </mask>\n      </defs>\n\n      ", "\n\n      ", "\n\n      <!-- Main group that shifts up or down to center the horizon vertically -->\n      <g transform=\"translate(0 ", ") scale(", " 1)\" transform-origin=\"center\">\n        ", "\n\n        <!-- Draw the horizon (the gray horizontal lines) -->\n        <line x1=\"5\" y1=\"", "\"\n              x2=\"545\" y2=\"", "\"\n              stroke=\"var(--hc-lines)\"/>\n\n        <!-- Arrow showing direction of travel -->\n        <path d=\"M535 ", " L545 ", " L535 ", "\"\n              stroke=\"var(--hc-lines)\" fill=\"none\"/>\n\n        ", "\n\n        ", "\n      </g>\n\n      ", "\n\n      ", "\n\n      ", "\n    "])), this.sunCurve(1), curve, curve, 0.5 - Math.abs(0.5 - this.moonData.fraction), this.moonPosition.x, this.moonPosition.y, Constants.MOON_RADIUS, this.moonPosition.x - Constants.MOON_RADIUS, this.moonPosition.y, Constants.MOON_RADIUS, Constants.MOON_RADIUS, Constants.MOON_RADIUS * 2, Constants.MOON_RADIUS, Math.abs(0.5 - this.moonData.fraction) * 2 * Constants.MOON_RADIUS, this.moonData.fraction > 0.5 ? 1 : 0, -Constants.MOON_RADIUS * 2, this.moonPosition.x, this.moonPosition.y, Constants.MOON_RADIUS, this.debugRect(), showSun ? w(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["\n      <!-- Draw the sunrise and sunset markers (the gray vertical lines) -->\n      <g transform=\"scale(", " 1)\" transform-origin=\"center\">\n        <line x1=\"", "\" y1=\"3\"\n              x2=\"", "\" y2=\"72\"\n              stroke=\"var(--hc-lines)\"/>\n        <line x1=\"", "\"\n              y1=\"3\" x2=\"", "\" y2=\"72\"\n              stroke=\"var(--hc-lines)\"/>\n      </g>"])), this.southernFlip ? -1 : 1, this.sunPosition.sunriseX, this.sunPosition.sunriseX, this.sunPosition.sunsetX, this.sunPosition.sunsetX) : A, this.sunPosition.offsetY, this.southernFlip ? -1 : 1, showSun ? w(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n        <!-- Draw path of the sun across the sky -->\n        <use href=\"#sun-path\"\n             fill=\"none\"\n             stroke=\"var(--hc-lines)\"/>\n\n        <!-- Draw the below horizon passed area, i.e., the dark blue/night part on either side -->\n        <path\n          d=\"M5,", " H", " V150 H5\"\n          clip-path=\"url(#lower-path-mask)\"\n          class=\"dawn\"/>\n\n        <!-- Draw the above horizon passed area, i.e., the light blue/day part in the middle -->\n        <path\n          d=\"M", ",0 H", "\n            V", " H", "\"\n          clip-path=\"url(#upper-path-mask)\"\n          class=\"day\"/>"])), this.sunPosition.horizonY, this.sunPosition.x, this.sunPosition.sunriseX, this.sunPosition.x, this.sunPosition.horizonY, this.sunPosition.sunriseX) : A, this.sunPosition.horizonY, this.sunPosition.horizonY, this.sunPosition.horizonY - 5, this.sunPosition.horizonY, this.sunPosition.horizonY + 5, showSun ? w(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n        <!-- Draw the sun -->\n        <circle\n          cx=\"", "\"\n          cy=\"", "\"\n          r=\"", "\"\n          stroke=\"none\"\n          fill=\"var(--hc-sun-color)\"/>"])), this.sunPosition.x, this.sunPosition.y, Constants.SUN_RADIUS) : A, this.debugSun(), this.moon(), this.debugHorizon(), this.debugCurve());
    }
  }, {
    key: "sunCurve",
    value: function sunCurve(scale) {
      // M5,146 C103.334,146 176.666,20 275,20 S446.666,146 545,146
      var sy = function sy(y) {
        return y * scale;
      };
      return "M 5,".concat(sy(146), "\n            C 103.334,").concat(sy(146), " 176.666,").concat(sy(20), " 275,").concat(sy(20), "\n            S 446.666,").concat(sy(146), " 545,").concat(sy(146));
    }
  }, {
    key: "moon",
    value: function moon() {
      var smallSpotR = Constants.MOON_RADIUS / 5;
      var bigSpotR = Constants.MOON_RADIUS / 4;
      var hugeSpotR = Constants.MOON_RADIUS / 3;
      var spotFill = 'var(--hc-moon-spot-color)';
      return this.config.moon ? w(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<!-- Moon -->\n          <g transform=\"rotate(", " ", " ", ")\">\n            <!-- Moon shadow -->\n            <use href=\"#moon\" fill=\"var(--hc-moon-shadow-color)\"/>\n            <!-- Moon proper -->\n            <use href=\"#moon\" fill=\"var(--hc-moon-color)\" mask=\"url(#moon-shadow-mask)\"/>\n          </g>\n          <!-- Moon spots to approximate the darker parts -->\n          <g transform=\"rotate(", " ", " ", ")\">\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n          </g>\n        "])), this.moonData.zenithAngle, this.moonPosition.x, this.moonPosition.y, this.moonData.parallacticAngle, this.moonPosition.x, this.moonPosition.y, this.moonPosition.x - bigSpotR, this.moonPosition.y - 1.5 * bigSpotR, hugeSpotR, spotFill, this.moonPosition.x + 1.5 * bigSpotR, this.moonPosition.y - 2 * bigSpotR, bigSpotR, spotFill, this.moonPosition.x - bigSpotR, this.moonPosition.y + bigSpotR, bigSpotR, spotFill, this.moonPosition.x + bigSpotR * 2, this.moonPosition.y, smallSpotR, spotFill) : A;
    }
  }, {
    key: "debugCurve",
    value: function debugCurve() {
      return this.debugLevel >= 1 ? w(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["<use href=\"#sun-path-unscaled\" stroke=\"red\" fill=\"none\" transform=\"translate(0, 0)\">"]))) : A;
    }
  }, {
    key: "debugRect",
    value: function debugRect() {
      return this.debugLevel >= 1 ? w(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["<rect x=\"0\" y=\"0\" width=\"550\" height=\"150\" fill=\"none\" stroke=\"red\"/>"]))) : A;
    }
  }, {
    key: "debugHorizon",
    value: function debugHorizon() {
      return this.debugLevel >= 1 ? w(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["<line x1=\"5\" y1=\"84\" x2=\"545\" y2=\"84\" stroke=\"red\" stroke-dasharray=\"4 4\"/>"]))) : A;
    }
  }, {
    key: "debugSun",
    value: function debugSun() {
      return this.debugLevel >= 1 ? w(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["<path d=\"M", " ", "\n                h", "\" stroke=\"red\"/>\n          <path d=\"M", " ", "\n                v", "\" stroke=\"red\"/>\n          <circle cx=\"", "\" cy=\"", "\"\n                  r=\"", "\" stroke=\"red\" fill=\"none\"/>\n        "])), this.sunPosition.x - Constants.SUN_RADIUS, this.sunPosition.y, Constants.SUN_RADIUS * 2, this.sunPosition.x, this.sunPosition.y - Constants.SUN_RADIUS, Constants.SUN_RADIUS * 2, this.sunPosition.x, this.sunPosition.y, Constants.SUN_RADIUS) : A;
    }
  }]);
}();

var _templateObject$2, _templateObject2, _templateObject3;
var HorizonCardHeader = /*#__PURE__*/function () {
  function HorizonCardHeader(config, data, i18n) {
    _classCallCheck(this, HorizonCardHeader);
    _defineProperty(this, "title", void 0);
    _defineProperty(this, "times", void 0);
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "i18n", void 0);
    _defineProperty(this, "southern_flip", void 0);
    this.title = config.title;
    this.fields = config.fields;
    this.times = data.sunData.times;
    this.i18n = i18n;
    this.southern_flip = config.southern_flip;
  }
  return _createClass(HorizonCardHeader, [{
    key: "render",
    value: function render() {
      return b(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n      ", "\n      ", "\n    "])), this.showTitle() ? this.renderTitle() : A, this.renderHeader());
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return b(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"horizon-card-title\">", "</div>"])), this.title);
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var sunrise = this.fields.sunrise ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunrise, this.times.sunrise) : A;
      var sunset = this.fields.sunset ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunset, this.times.sunset) : A;
      if (sunrise === A && sunset === A) {
        return A;
      }
      var left = this.southern_flip ? sunset : sunrise;
      var right = this.southern_flip ? sunrise : sunset;
      return b(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<div class=\"horizon-card-header\">", "", "</div>"])), left, right);
    }
  }, {
    key: "showTitle",
    value: function showTitle() {
      return this.title !== undefined;
    }
  }]);
}();

var _templateObject$1;
var HorizonCardContent = /*#__PURE__*/function () {
  function HorizonCardContent(config, data, i18n) {
    _classCallCheck(this, HorizonCardContent);
    _defineProperty(this, "config", void 0);
    _defineProperty(this, "data", void 0);
    _defineProperty(this, "i18n", void 0);
    this.config = config;
    this.data = data;
    this.i18n = i18n;
  }
  return _createClass(HorizonCardContent, [{
    key: "render",
    value: function render() {
      return b(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n      <ha-card>\n        <div class=\"horizon-card\">\n          ", "\n          ", "\n          ", "\n        </div>\n      </ha-card>\n    "])), this.renderHeader(), this.config.graph !== false ? this.renderGraph() : A, this.renderFooter());
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return new HorizonCardHeader(this.config, this.data, this.i18n).render();
    }
  }, {
    key: "renderGraph",
    value: function renderGraph() {
      return new HorizonCardGraph(this.config, this.data).render();
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      return new HorizonCardFooter(this.config, this.data, this.i18n).render();
    }
  }]);
}();

var _Class, _HorizonCard3, _A, _B, _C, _templateObject, _applyDecs2, _applyDecs2$e, _applyDecs2$c;
var _initProto, _initClass, _classDecs, _configDecs, _init_config, _dataDecs, _init_data, _errorDecs, _init_error, _HorizonCard2, _ref;
_classDecs = [t('horizon-card')];
var _HorizonCard;
new (_HorizonCard2 = (_A = /*#__PURE__*/new WeakMap(), _B = /*#__PURE__*/new WeakMap(), _C = /*#__PURE__*/new WeakMap(), _ref = (_configDecs = r(), _dataDecs = r(), _errorDecs = r(), "config"), _HorizonCard3 = /*#__PURE__*/function (_LitElement) {
  function HorizonCard() {
    var _this;
    _classCallCheck(this, HorizonCard);
    _this = _callSuper(this, HorizonCard);
    _classPrivateFieldInitSpec(_this, _A, (_initProto(_this), _init_config(_this)));
    _classPrivateFieldInitSpec(_this, _B, _init_data(_this));
    _classPrivateFieldInitSpec(_this, _C, _init_error(_this));
    _defineProperty(_this, "lastHass", void 0);
    _defineProperty(_this, "hasCalculated", false);
    _defineProperty(_this, "refreshTimer", void 0);
    _defineProperty(_this, "lastComputeTimestamp", 0);
    _defineProperty(_this, "onVisibilityChange", function () {
      if (!_this.config) {
        return;
      }
      if (document.visibilityState !== 'visible') {
        return;
      }
      var p = _this.refreshPeriodMs();
      if (p > 0 && Date.now() - _this.lastComputeTimestamp >= p) {
        _this.hasCalculated = false;
        _this.requestUpdate();
      }
    });
    _this.data = Constants.DEFAULT_CARD_DATA;
    return _this;
  }
  _inherits(HorizonCard, _LitElement);
  return _createClass(HorizonCard, [{
    key: _ref,
    get: function get() {
      return _classPrivateFieldGet2(_A, this);
    }
  }, {
    key: "config",
    set: function set(v) {
      _classPrivateFieldSet2(_A, this, v);
    }
  }, {
    key: "data",
    get: function get() {
      return _classPrivateFieldGet2(_B, this);
    },
    set: function set(v) {
      _classPrivateFieldSet2(_B, this, v);
    }
  }, {
    key: "error",
    get: function get() {
      return _classPrivateFieldGet2(_C, this);
    },
    set: function set(v) {
      _classPrivateFieldSet2(_C, this, v);
    }
  }, {
    key: "hass",
    set: function set(hass) {
      this.debug(function () {
        return "set hass :: ".concat(hass.locale.language, " :: ").concat(hass.locale.time_format);
      }, 2);
      this.lastHass = hass;
      if (!this.config) {
        return;
      }
      var p = this.refreshPeriodMs();
      if (p > 0 && Date.now() - this.lastComputeTimestamp >= p) {
        this.hasCalculated = false;
        this.requestUpdate();
      }
    }

    /**
     * called by HASS to properly distribute card in lovelace view. It should return height
     * of the card as a number where 1 is equivalent of 50 pixels.
     * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#api
     */
  }, {
    key: "getCardSize",
    value: function getCardSize() {
      var height = 4; // Smallest possible card (only graph) is roughly 200px

      var fieldConfig = this.expandedFieldConfig();

      // Each element of card (title, header, content, footer) adds roughly 50px to the height
      if (this.config.title && this.config.title.length > 0) {
        height += 1;
      }
      if (fieldConfig.sunrise || fieldConfig.sunset) {
        height += 1;
      }
      if (fieldConfig.dawn || fieldConfig.noon || fieldConfig.dusk) {
        height += 1;
      }
      if (fieldConfig.sun_azimuth || fieldConfig.moon_azimuth || fieldConfig.sun_elevation || fieldConfig.moon_elevation) {
        height += 1;
      }
      if (fieldConfig.moonrise || fieldConfig.moon_phase || fieldConfig.moonset) {
        height += 1;
      }
      this.debug(function () {
        return "getCardSize() => ".concat(height);
      }, 2);
      return height;
    }

    /**
     * Called by HASS to size the card in the Sections view grid. We intentionally do NOT
     * report a fixed `rows` value: the grid quantizes height to whole rows (56px cell + 8px
     * gap), so any fixed count rounds up and leaves an empty gap below the card (issue #192).
     * Omitting `rows` lets the card size to its actually-rendered content instead, so it is
     * correct at whatever height the card renders — unlike the removed pixel model, which was
     * calibrated for a single card width. We still declare the 12-column default and allow the
     * card to be narrowed to half width.
     * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
     */
  }, {
    key: "getGridOptions",
    value: function getGridOptions() {
      return {
        columns: 12,
        min_columns: 6
      };
    }

    // called by HASS whenever config changes
  }, {
    key: "setConfig",
    value: function setConfig(config) {
      if (config.language && !HelperFunctions.isValidLanguage(config.language)) {
        throw Error("".concat(config.language, " is not a supported language. Supported languages: ").concat(Object.keys(Constants.LOCALIZATION_LANGUAGES)));
      }
      if (config.latitude === undefined && config.longitude !== undefined || config.latitude !== undefined && config.longitude == undefined) {
        throw Error('Latitude and longitude must be both set or unset');
      }
      this.config = config;
      this.hasCalculated = false;
      this.debug('setConfig()', 2);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.lastHass) {
        this.debug('render() [no hass]', 2);
        return b(_templateObject || (_templateObject = _taggedTemplateLiteral([""])));
      }
      this.debug('render()', 2);
      var expandedConfig = this.expandedConfig();
      this.classList.toggle('horizon-card-dark', expandedConfig.dark_mode);
      if (this.error) {
        return new HorizonErrorContent(this.error, this.i18n(expandedConfig)).render();
      }
      var moonLightnessReduceSign = expandedConfig.dark_mode ? 1 : -1;
      this.style.setProperty('--hc-sun-hue-reduce', "".concat(this.data.sunData.hueReduce));
      this.style.setProperty('--hc-sun-saturation-reduce', "".concat(this.data.sunData.saturationReduce, "%"));
      this.style.setProperty('--hc-sun-lightness-reduce', "".concat(this.data.sunData.lightnessReduce, "%"));
      this.style.setProperty('--hc-moon-saturation-reduce', "".concat(this.data.moonData.saturationReduce, "%"));
      this.style.setProperty('--hc-moon-lightness-reduce', "".concat(this.data.moonData.lightnessReduce * moonLightnessReduceSign, "%"));

      // render components
      return new HorizonCardContent(expandedConfig, this.data, this.i18n(expandedConfig)).render();
    }
  }, {
    key: "updated",
    value: function updated(changedProperties) {
      _superPropGet(HorizonCard, "updated", this)([changedProperties]);
      this.debug(function () {
        return "updated() - ".concat(JSON.stringify(Array.from(changedProperties.keys())));
      }, 2);
      if (!this.config) {
        // This happens only in dev mode, hass will call setConfig() before first update
        return;
      }
      if (!this.hasCalculated) {
        this.hasCalculated = true;
        this.calculateStatePartial();
      } else if (this.data.partial) {
        this.calculateStateFinal();
        this.scheduleRefresh();
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      _superPropGet(HorizonCard, "connectedCallback", this)([]);
      // Lit does not re-render on reconnect, so re-arm the calculation loop
      // unconditionally to immediately refresh when the view is shown again.
      this.hasCalculated = false;
      this.requestUpdate();
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      this.debug('connectedCallback()', 2);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _superPropGet(HorizonCard, "disconnectedCallback", this)([]);
      window.clearTimeout(this.refreshTimer);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
      this.debug('disconnectedCallback()', 2);
    }
  }, {
    key: "scheduleRefresh",
    value: function scheduleRefresh() {
      var _this2 = this;
      window.clearTimeout(this.refreshTimer);
      if (this.refreshPeriodMs() > 0) {
        this.refreshTimer = window.setTimeout(function () {
          _this2.debug('refresh via setTimeout()', 2);
          if (_this2.hasCalculated) {
            _this2.calculateStatePartial();
          }
        }, this.refreshPeriodMs());
      }
    }
  }, {
    key: "calculateStateFinal",
    value: function calculateStateFinal() {
      this.debug('calculateStateFinal()');
      var sunInfo = this.computeSunPosition(this.data.sunData.times, this.isWinterDarkness(this.data.latitude, this.data.sunData.times.now), this.data.sunPosition.scaleY);
      this.data = _objectSpread2(_objectSpread2({}, this.data), {}, {
        partial: false,
        sunPosition: sunInfo
      });
    }
  }, {
    key: "calculateStatePartial",
    value: function calculateStatePartial() {
      var _this3 = this;
      this.lastComputeTimestamp = Date.now();
      var now = this.now();
      var latitude = this.latitude();
      var longitude = this.longitude();
      this.debug(function () {
        return "calculateStatePartial() :: ".concat(now === null || now === void 0 ? void 0 : now.toISOString(), " ").concat(_this3.timeZone(), " :: ").concat(latitude, ", ").concat(longitude);
      });
      var times = this.readSunTimes(now, latitude, longitude, this.elevation());
      var sunCalcPosition = SunCalc.getPosition(times.now, latitude, longitude);
      var azimuth = this.roundDegree(sunCalcPosition['azimuthDegrees']);
      var elevation = this.roundDegree(sunCalcPosition['altitudeDegrees']);
      var sunPosition = this.computeSunPosition(times, this.isWinterDarkness(latitude, times.now));
      var moonData = this.computeMoonData(times.now, latitude, longitude);
      var moonPosition = this.computeMoonPosition(moonData, sunPosition.scaleY);
      var hueReduce = HelperFunctions.rangeScale(-10, 10, elevation, 15);
      var saturationReduce = HelperFunctions.rangeScale(-23, 10, elevation, 50);
      var lightnessReduce = HelperFunctions.rangeScale(-10, 10, elevation, 12);
      this.data = {
        partial: true,
        latitude: latitude,
        longitude: longitude,
        sunPosition: sunPosition,
        sunData: {
          azimuth: azimuth,
          elevation: elevation,
          times: times,
          hueReduce: hueReduce,
          saturationReduce: saturationReduce,
          lightnessReduce: lightnessReduce
        },
        moonPosition: moonPosition,
        moonData: moonData
      };
    }
  }, {
    key: "readSunTimes",
    value: function readSunTimes(now, latitude, longitude, elevation) {
      var nowDayBefore = new Date(now.getTime() - Constants.MS_24_HOURS);
      var sunTimesNow = SunCalc.getSunTimes(this.useLongitudeForComputation() ? HelperFunctions.noonAtLongitude(now, longitude) : HelperFunctions.noonAtTimeZone(now, this.timeZone()), latitude, longitude, elevation, false, false, true);
      var sunTimesDayBefore = SunCalc.getSunTimes(this.useLongitudeForComputation() ? HelperFunctions.noonAtLongitude(nowDayBefore, longitude) : HelperFunctions.noonAtTimeZone(nowDayBefore, this.timeZone()), latitude, longitude, elevation, false, false, true);
      var noonDelta = now.getTime() - sunTimesDayBefore.solarNoon.value.getTime();
      if (noonDelta < Constants.MS_12_HOURS) {
        // We are past local standard midnight but previous solar noon was sooner than 12 hours, use previous day's data
        return this.convertSunCalcTimes(sunTimesDayBefore);
      }
      return this.convertSunCalcTimes(sunTimesNow);
    }
  }, {
    key: "convertSunCalcTimes",
    value: function convertSunCalcTimes(data) {
      return {
        now: this.now(),
        dawn: this.validOrUndefined(data['civilDawn']),
        dusk: this.validOrUndefined(data['civilDusk']),
        midnight: this.validOrUndefined(data['nadir']),
        noon: this.validOrUndefined(data['solarNoon']),
        sunrise: this.validOrUndefined(data['sunriseStart']),
        sunset: this.validOrUndefined(data['sunsetEnd'])
      };
    }
  }, {
    key: "validOrUndefined",
    value: function validOrUndefined(event) {
      return event.valid ? event.value : undefined;
    }
  }, {
    key: "findPointOnCurve",
    value: function findPointOnCurve(time, noon, useUnscaledPath) {
      var _this$shadowRoot;
      var sunPath = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector('#sun-path' + (useUnscaledPath ? '-unscaled' : ''));
      var delta = noon.getTime() - time.getTime();
      var len = sunPath.getTotalLength();
      var position = len / 2 - len * (delta / Constants.MS_24_HOURS);
      return sunPath.getPointAtLength(position);
    }
  }, {
    key: "isWinterDarkness",
    value: function isWinterDarkness(latitude, now) {
      var month = now.getMonth(); // months are zero-based, UTC or local TZ doesn't matter here
      var northernWinter = month < 2 || month > 8;
      // winter darkness when winter in the northern hemisphere and north of the equator
      //   or
      // winter darkness when summer in the northern hemisphere and south of the equator
      return northernWinter && latitude > 0 || !northernWinter && latitude < 0;
    }
  }, {
    key: "computeScale",
    value: function computeScale(sunrise, noon, canBeWinterDarkness) {
      var sunrisePoint = this.findPointOnCurve(this.sunriseForComputation(sunrise, noon, canBeWinterDarkness), noon, true);
      // Sun path curve top is at 20
      var horizonPosInCurve = sunrisePoint.y - 20;
      // Sun path curve midpoint, from 20 (top) to 146 (bottom), halved
      var curveHalfSpan = 63;
      var diff = Math.abs(horizonPosInCurve - curveHalfSpan);
      var scaleY = curveHalfSpan / (diff + curveHalfSpan);
      this.debug(function () {
        return "scale factor ".concat(scaleY);
      });
      return scaleY;
    }
  }, {
    key: "sunriseForComputation",
    value: function sunriseForComputation(sunrise, noon, canBeWinterDarkness) {
      return sunrise !== null && sunrise !== void 0 ? sunrise : canBeWinterDarkness ? noon : new Date(noon.getTime() - Constants.MS_12_HOURS);
    }
  }, {
    key: "computeSunPosition",
    value: function computeSunPosition(times, canBeWinterDarkness, previousScaleY) {
      var _this$config;
      if (((_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.graph) === false) {
        // The graph is not rendered, so its geometry is never drawn and the #sun-path
        // SVG element does not exist. Skip the path-based position calculation, which
        // would otherwise read getTotalLength() off a null element.
        return Constants.DEFAULT_CARD_DATA.sunPosition;
      }

      // Sun position along the curve
      var sunPosition = this.findPointOnCurve(times.now, times.noon);
      var sunsetX = -10;
      var sunriseX = -10;
      var sunriseForComputation = this.sunriseForComputation(times.sunrise, times.noon, canBeWinterDarkness);
      var sunrisePosition = this.findPointOnCurve(sunriseForComputation, times.noon);
      if (times.sunrise !== undefined && times.sunset !== undefined) {
        // Sunset and sunrise both occur and will be drawn as vertical bars
        sunriseX = sunrisePosition.x;
        var sunsetPosition = this.findPointOnCurve(times.sunset, times.noon);
        sunsetX = sunsetPosition.x;
      }
      var horizonY = sunrisePosition.y;
      var offsetY;
      var scaleY;
      if (previousScaleY === undefined) {
        // First (partial) run: computes the scale factor
        offsetY = 0;
        scaleY = this.computeScale(times.sunrise, times.noon, canBeWinterDarkness);
      } else {
        // Second (final) run: uses the scaled curve (from the partial run) to offset the horizon
        offsetY = Constants.HORIZON_Y - horizonY;
        this.debug(function () {
          return "scaled horizonY = ".concat(horizonY, ", offset ").concat(offsetY);
        });
        scaleY = previousScaleY;
      }
      return {
        scaleY: scaleY,
        offsetY: offsetY,
        horizonY: horizonY,
        sunsetX: sunsetX,
        sunriseX: sunriseX,
        x: sunPosition.x,
        y: sunPosition.y
      };
    }
  }, {
    key: "computeMoonData",
    value: function computeMoonData(now, lat, lon) {
      var _this$config$moon_pha;
      var moonRawData = SunCalc.getMoonData(now, lat, lon);
      var azimuth = this.roundDegree(moonRawData.azimuthDegrees);
      var elevation = this.roundDegree(moonRawData.altitudeDegrees);
      var moonRawTimes = SunCalc.getMoonTimes(this.useLongitudeForComputation() ? HelperFunctions.midnightAtLongitude(now, lon) : HelperFunctions.midnightAtTimeZone(now, this.timeZone()), lat, lon, false, true);
      var moonPhase = Constants.MOON_PHASES[moonRawData.illumination.phase.id];
      var clampedLat = HelperFunctions.clamp(-66, 66, lat);
      var phaseRotation = (_this$config$moon_pha = this.config.moon_phase_rotation) !== null && _this$config$moon_pha !== void 0 ? _this$config$moon_pha : 90 * clampedLat / 66 - 90;
      var saturationReduce = HelperFunctions.rangeScale(-33, 10, elevation, 60);
      var lightnessReduce = HelperFunctions.rangeScale(-10, 0, elevation, 15);
      return {
        azimuth: azimuth,
        elevation: elevation,
        fraction: moonRawData.illumination.fraction,
        phase: moonPhase,
        phaseRotation: phaseRotation,
        zenithAngle: -moonRawData.zenithAngle * 180 / Math.PI,
        parallacticAngle: moonRawData.parallacticAngleDegrees,
        times: {
          now: now,
          moonrise: isNaN(moonRawTimes.rise) ? undefined : moonRawTimes.rise,
          moonset: isNaN(moonRawTimes.set) ? undefined : moonRawTimes.set
        },
        saturationReduce: saturationReduce,
        lightnessReduce: lightnessReduce
      };
    }
  }, {
    key: "computeMoonPosition",
    value: function computeMoonPosition(moonData) {
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // East to West goes left to right (or right to left, if southern-flipped!), like the Sun.
      // The canvas is 550 units wide, minus 5 units (padding)
      // and minus Constants.MOON_RADIUS on either side to keep the moon inside.
      // Left is 0 degrees, 180 degrees is in the middle.
      // The southern flip is the same geometric mirror (about the 550-wide viewBox) the Sun uses.
      var availableSpanX = 550 - 2 * (Constants.MOON_RADIUS + 5);
      var x0 = 5 + Constants.MOON_RADIUS + availableSpanX * moonData.azimuth / 360;
      var x = this.southernFlip() ? 550 - x0 : x0;
      var yLimit = Constants.HORIZON_Y - Constants.MOON_RADIUS;
      var calcElevation = Math.abs(moonData.elevation) / 2 + 1;
      var maxLog = 90 / 2 + 1;

      // The Moon's elevation scaled logarithmically to appear higher/lower from the drawn horizon,
      // compressed by the sun curve's scaleY so it stays inside the frame in deep winter.
      var offset = yLimit * Math.log(calcElevation) / Math.log(maxLog) * Math.sign(moonData.elevation) * scaleY;
      var y = Constants.HORIZON_Y - offset;
      return {
        x: x,
        y: y
      };
    }
  }, {
    key: "latitude",
    value: function latitude() {
      var _this$config$latitude;
      return (_this$config$latitude = this.config.latitude) !== null && _this$config$latitude !== void 0 ? _this$config$latitude : this.lastHass.config.latitude;
    }
  }, {
    key: "longitude",
    value: function longitude() {
      var _this$config$longitud;
      return (_this$config$longitud = this.config.longitude) !== null && _this$config$longitud !== void 0 ? _this$config$longitud : this.lastHass.config.longitude;
    }
  }, {
    key: "elevation",
    value: function elevation() {
      var _this$config$elevatio;
      // suncalc3 computes the horizon dip as -2.076 * sqrt(elevation) / 60, which is NaN for a
      // negative elevation. Clamp to sea level so below-sea-level locations (e.g. the Netherlands)
      // still get valid sun times instead of a blank card. See #101.
      return Math.max(0, (_this$config$elevatio = this.config.elevation) !== null && _this$config$elevatio !== void 0 ? _this$config$elevatio : this.lastHass.config.elevation);
    }
  }, {
    key: "southernFlip",
    value: function southernFlip() {
      var _this$config$southern;
      return (_this$config$southern = this.config.southern_flip) !== null && _this$config$southern !== void 0 ? _this$config$southern : this.latitude() < 0;
    }
  }, {
    key: "timeZone",
    value: function timeZone() {
      var _this$config$time_zon;
      return (_this$config$time_zon = this.config.time_zone) !== null && _this$config$time_zon !== void 0 ? _this$config$time_zon : this.lastHass.config.time_zone;
    }

    // Two independent axes: longitude drives the computation reference, time_zone drives display.
    // Anchor the computation day to the location's solar day only when the user set an explicit
    // longitude without a time_zone. Reads raw config (not the accessors, which always fall back
    // to HA values) so every other setup stays byte-identical to before.
  }, {
    key: "useLongitudeForComputation",
    value: function useLongitudeForComputation() {
      return this.config.longitude !== undefined && this.config.time_zone === undefined;
    }
  }, {
    key: "now",
    value: function now() {
      return this.config.now !== undefined ? new Date(this.config.now) : new Date();
    }
  }, {
    key: "refreshPeriodMs",
    value: function refreshPeriodMs() {
      var _this$config$refresh_, _this$config2;
      return ((_this$config$refresh_ = (_this$config2 = this.config) === null || _this$config2 === void 0 ? void 0 : _this$config2.refresh_period) !== null && _this$config$refresh_ !== void 0 ? _this$config$refresh_ : Constants.DEFAULT_REFRESH_PERIOD) * 1000;
    }
  }, {
    key: "debugLevel",
    value: function debugLevel() {
      var _this$config$debug_le, _this$config3;
      return (_this$config$debug_le = (_this$config3 = this.config) === null || _this$config3 === void 0 ? void 0 : _this$config3.debug_level) !== null && _this$config$debug_le !== void 0 ? _this$config$debug_le : 0;
    }
  }, {
    key: "expandedFieldConfig",
    value: function expandedFieldConfig() {
      var _fieldConfig$sun_elev, _fieldConfig$moon_ele, _fieldConfig$sun_azim, _fieldConfig$moon_azi;
      if (this.config.fields === false) {
        // `fields: false` hides every field at once.
        return {
          sunrise: false,
          sunset: false,
          dawn: false,
          noon: false,
          dusk: false,
          azimuth: false,
          sun_azimuth: false,
          moon_azimuth: false,
          elevation: false,
          sun_elevation: false,
          moon_elevation: false,
          moonrise: false,
          moonset: false,
          moon_phase: false
        };
      }
      var fieldConfig = _objectSpread2(_objectSpread2({}, Constants.DEFAULT_CONFIG.fields), this.config.fields);

      // Elevation and azimuth have a shared property and a per sun/moon dedicated property too
      fieldConfig.sun_elevation = (_fieldConfig$sun_elev = fieldConfig.sun_elevation) !== null && _fieldConfig$sun_elev !== void 0 ? _fieldConfig$sun_elev : fieldConfig.elevation;
      fieldConfig.moon_elevation = (_fieldConfig$moon_ele = fieldConfig.moon_elevation) !== null && _fieldConfig$moon_ele !== void 0 ? _fieldConfig$moon_ele : fieldConfig.elevation;
      fieldConfig.sun_azimuth = (_fieldConfig$sun_azim = fieldConfig.sun_azimuth) !== null && _fieldConfig$sun_azim !== void 0 ? _fieldConfig$sun_azim : fieldConfig.azimuth;
      fieldConfig.moon_azimuth = (_fieldConfig$moon_azi = fieldConfig.moon_azimuth) !== null && _fieldConfig$moon_azi !== void 0 ? _fieldConfig$moon_azi : fieldConfig.azimuth;
      return fieldConfig;
    }
  }, {
    key: "expandedConfig",
    value: function expandedConfig() {
      var _this$config$language, _this$config$time_for, _this$config$number_f, _this$config$dark_mod, _this$lastHass$themes;
      var config = _objectSpread2(_objectSpread2(_objectSpread2({}, Constants.DEFAULT_CONFIG), this.config), {}, {
        fields: this.expandedFieldConfig()
      });

      // Default values for these come from Home Assistant
      config.language = (_this$config$language = this.config.language) !== null && _this$config$language !== void 0 ? _this$config$language : this.lastHass.locale.language;
      config.time_format = (_this$config$time_for = this.config.time_format) !== null && _this$config$time_for !== void 0 ? _this$config$time_for : this.lastHass.locale.time_format;
      config.number_format = (_this$config$number_f = this.config.number_format) !== null && _this$config$number_f !== void 0 ? _this$config$number_f : this.lastHass.locale.number_format;
      config.dark_mode = (_this$config$dark_mod = this.config.dark_mode) !== null && _this$config$dark_mod !== void 0 ? _this$config$dark_mod : (_this$lastHass$themes = this.lastHass.themes) === null || _this$lastHass$themes === void 0 ? void 0 : _this$lastHass$themes.darkMode;
      config.latitude = this.latitude();
      config.longitude = this.longitude();
      config.elevation = this.elevation();
      config.southern_flip = this.southernFlip(); // default is via latitude
      config.time_zone = this.timeZone();

      // The default value is the current time
      config.now = this.now();
      return config;
    }
  }, {
    key: "i18n",
    value: function i18n(config) {
      var display_time_zone;

      // An explicit card `time_zone` always wins, for both computation and display.
      if (this.config.time_zone !== undefined) {
        display_time_zone = this.config.time_zone;
      } else if (this.lastHass.locale['time_zone'] === 'local') {
        // Since 2023.7, HA can show times in the local (for the browser) TZ or the server TZ.
        display_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else {
        // 'server' or missing value (older HA version)
        display_time_zone = config.time_zone;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return new I18N(config.language, display_time_zone, config.time_format, config.number_format);
    }
  }, {
    key: "roundDegree",
    value: function roundDegree(value) {
      return round(value, 1);
    }
  }, {
    key: "debug",
    value: function debug(message) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (this.debugLevel() >= level) {
        if (typeof message === 'function') {
          message = message();
        }
        // eslint-disable-next-line no-console
        console.debug("custom:".concat(_HorizonCard.cardType, " :: ").concat(message));
      }
    }
  }], [{
    key: "styles",
    get: function get() {
      return cardStyles;
    }
  }]);
}(i), _applyDecs2 = _applyDecs2305(_HorizonCard3, [[_configDecs, 1, "config"], [_dataDecs, 1, "data"], [_errorDecs, 1, "error"]], _classDecs, 0, void 0, i), _applyDecs2$e = _slicedToArray(_applyDecs2.e, 4), _init_config = _applyDecs2$e[0], _init_data = _applyDecs2$e[1], _init_error = _applyDecs2$e[2], _initProto = _applyDecs2$e[3], _applyDecs2$c = _slicedToArray(_applyDecs2.c, 2), _HorizonCard = _applyDecs2$c[0], _initClass = _applyDecs2$c[1], _HorizonCard3), _Class = /*#__PURE__*/function (_identity2) {
  function _Class() {
    var _this4;
    _classCallCheck(this, _Class);
    _this4 = _callSuper(this, _Class, [_HorizonCard]), _defineProperty(_assertThisInitialized(_this4), "cardType", 'horizon-card'), _defineProperty(_assertThisInitialized(_this4), "cardName", 'Horizon Card'), _defineProperty(_assertThisInitialized(_this4), "cardDescription", 'Custom card that display a graph to track the sun position and related events'), _initClass();
    return _this4;
  }
  _inherits(_Class, _identity2);
  return _createClass(_Class);
}(_identity), _defineProperty(_Class, _HorizonCard2, void 0), _Class)();
window.customCards = window.customCards || [];
window.customCards.push({
  type: _HorizonCard.cardType,
  name: _HorizonCard.cardName,
  preview: true,
  description: _HorizonCard.cardDescription
});
