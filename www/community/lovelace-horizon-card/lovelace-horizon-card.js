'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();
  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }
  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}
function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };
  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;
          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;
      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }
      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);
      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }
      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];
      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }
      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];
      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);
        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }
        var newExtras = elementFinisherExtras.extras;
        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }
          extras.push.apply(extras, newExtras);
        }
      }
      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];
      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);
        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }
        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;
          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }
      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);
      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }
      var key = _toPropertyKey(elementObject.key);
      var placement = String(elementObject.placement);
      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }
      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };
      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }
      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);
      var finisher = _optionalCallableProperty(elementObject, "finisher");
      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);
      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }
      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");
      var finisher = _optionalCallableProperty(obj, "finisher");
      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);
        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }
          constructor = newConstructor;
        }
      }
      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}
function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);
  var descriptor;
  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }
  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}
function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}
function _coalesceClassElements(elements) {
  var newElements = [];
  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;
    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }
        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }
          other.decorators = element.decorators;
        }
        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }
  return newElements;
}
function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}
function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}
function _optionalCallableProperty(obj, name) {
  var value = obj[name];
  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }
  return value;
}

var t$3,r$3;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none";}(t$3||(t$3={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24";}(r$3||(r$3={}));function O(){return (O=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);}return e}).apply(this,arguments)}var U=function(e){switch(e.number_format){case t$3.comma_decimal:return ["en-US","en"];case t$3.decimal_comma:return ["de","es","it"];case t$3.space_comma:return ["fr","sv","cs"];case t$3.system:return;default:return e.language}},B$1=function(e,t){return void 0===t&&(t=2),Math.round(e*Math.pow(10,t))/Math.pow(10,t)},H$1=function(e,r,n){var i=r?U(r):void 0;if(Number.isNaN=Number.isNaN||function e(t){return "number"==typeof t&&e(t)},(null==r?void 0:r.number_format)!==t$3.none&&!Number.isNaN(Number(e))&&Intl)try{return new Intl.NumberFormat(i,V$1(e,n)).format(Number(e))}catch(t){return console.error(t),new Intl.NumberFormat(void 0,V$1(e,n)).format(Number(e))}return "string"==typeof e?e:B$1(e,null==n?void 0:n.maximumFractionDigits).toString()+("currency"===(null==n?void 0:n.style)?" "+n.currency:"")},V$1=function(e,t){var r=O({maximumFractionDigits:2},t);if("string"!=typeof e)return r;if(!t||!t.minimumFractionDigits&&!t.maximumFractionDigits){var n=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=n,r.maximumFractionDigits=n;}return r};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=window,e$4=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$4=new WeakMap;let o$3 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$4.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$2=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$4?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$2.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$3=window,r$1=e$3.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$3.reactiveElementPolyfillSupport,n$3={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$3,reflect:!1,hasChanged:a$1};let d$1 = class d extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$3).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$3;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:d$1}),(null!==(s$2=e$3.reactiveElementVersions)&&void 0!==s$2?s$2:e$3.reactiveElementVersions=[]).push("1.6.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i$1=window,s$1=i$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$2=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$2,h=`<${l$1}>`,r=document,d=()=>r.createComment(""),u=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),b=w(2),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1),P=(t,i)=>{const s=t.length-1,l=[];let r,d=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let e,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(r=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=r?r:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,e=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,r=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";d+=u===f?s+h:v>=0?(l.push(e),s.slice(0,v)+o$1+s.slice(v)+n$2+w):s+n$2+(-2===v?(l.push(void 0),i):w);}const c=d+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e$2?e$2.createHTML(c):c,l]};class V{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,u=0;const c=t.length-1,v=this.parts,[a,f]=P(t,i);if(this.el=V.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$2)){const s=f[u++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$2),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?k:"?"===i[1]?I:"@"===i[1]?L:R});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$2),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],d()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],d());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$2,t+1));)v.push({type:7,index:r}),t+=n$2.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function N(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const d=u(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==d&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===d?r=void 0:(r=new d(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=N(t,r._$AS(t,i.values),r,e)),i}class S{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new M(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new z(n,this,t)),this._$AV.push(i),d=e[++h];}l!==(null==d?void 0:d.index)&&(n=C.nextNode(),l++);}return o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class M{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=N(this,t,i),u(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&u(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=V.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new S(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new V(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new M(this.k(d()),this.k(d()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class R{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=N(this,t,i,0),n=!u(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=N(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!u(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class k extends R{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const H=s$1?s$1.emptyScript:"";class I extends R{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name);}}class L extends R{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=N(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t);}}const j=i$1.litHtmlPolyfillSupport;null==j||j(V,M),(null!==(t$1=i$1.litHtmlVersions)&&void 0!==t$1?t$1:i$1.litHtmlVersions=[]).push("2.7.2");const B=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new M(i.insertBefore(d(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$1=globalThis.litElementPolyfillSupport;null==n$1||n$1({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i(e,n)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t(t){return e({...t,state:!0})}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

var suncalcExports = {};
var suncalc = {
  get exports(){ return suncalcExports; },
  set exports(v){ suncalcExports = v; },
};

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

var SunCalc = suncalcExports;

var _templateObject$7;
var cardStyles = i$2(_templateObject$7 || (_templateObject$7 = _taggedTemplateLiteral(["\n  :host {\n    --hc-primary: var(--primary-text-color);\n    --hc-secondary: var(--secondary-text-color);\n\n    --hc-field-name-color: var(--hc-secondary);\n    --hc-field-value-color: var(--hc-primary);\n\n    --hc-day-color: #8ebeeb;\n    --hc-night-color: #393b78;\n\n    --hc-accent: #d7d7d7;\n    --hc-lines: var(--hc-accent);\n\n    --hc-sun-hue: 44;\n    --hc-sun-saturation: 93%;\n    --hc-sun-lightness: 67%;\n    --hc-sun-hue-reduce: 0;\n    --hc-sun-saturation-reduce: 0%;\n    --hc-sun-lightness-reduce: 0%;\n    --hc-sun-color: hsl(\n      calc(var(--hc-sun-hue) - var(--hc-sun-hue-reduce)),\n      calc(var(--hc-sun-saturation) - var(--hc-sun-saturation-reduce)),\n      calc(var(--hc-sun-lightness) - var(--hc-sun-lightness-reduce))\n    );\n\n    --hc-moon-hue: 52;\n    --hc-moon-saturation: 77%;\n    --hc-moon-lightness: 57%;\n    --hc-moon-saturation-reduce: 0%;\n    --hc-moon-lightness-reduce: 0%;\n    --hc-moon-color: hsl(\n      var(--hc-moon-hue),\n      calc(var(--hc-moon-saturation) - var(--hc-moon-saturation-reduce)),\n      calc(var(--hc-moon-lightness) - var(--hc-moon-lightness-reduce))\n    );\n    --hc-moon-shadow-color: #eeeeee;\n    --hc-moon-spot-color: rgba(170, 170, 170, 0.1);\n  }\n\n  :host(.horizon-card-dark) {\n    --hc-accent: #464646;\n    --hc-moon-saturation: 80%;\n    --hc-moon-lightness: 74%;\n    --hc-moon-shadow-color: #272727;\n  }\n\n  .horizon-card {\n    padding: 0.5em;\n    font-family: var(--primary-font-family);\n  }\n\n  .horizon-card-field-row {\n    display: flex;\n    justify-content: space-around;\n    margin-top: 1em;\n    margin-bottom: -0.3em;\n  }\n\n  .horizon-card-text-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  .horizon-card-field-name {\n    color: var(--hc-field-name-color);\n  }\n\n  .horizon-card-field-value {\n    color: var(--hc-field-value-color);\n    font-size: 1.2em;\n    line-height: 1.1em;\n    text-align: center;\n  }\n\n  .horizon-card-field-value-moon-phase {\n    font-size: inherit;\n  }\n\n  .horizon-card-field-moon-phase {\n    --mdc-icon-size: 2em;\n    color: var(--primary-color);\n  }\n\n  .horizon-card-field-value-secondary {\n    font-size: 0.7em;\n  }\n\n  .horizon-card-sun-value:before {\n    content: \"\u2609\";\n    padding-right: 0.5em;\n  }\n\n  .horizon-card-moon-value:before {\n    content: \"\u263D\";\n    padding-right: 0.5em;\n  }\n\n  .horizon-card-header {\n    display: flex;\n    justify-content: space-around;\n    margin-top: 1em;\n    margin-bottom: -0.3em;\n  }\n\n  .horizon-card-header .horizon-card-text-container {\n    font-size: 1.2em;\n  }\n\n  .horizon-card-footer {\n    margin-bottom: 1em;\n  }\n\n  .horizon-card-title {\n    margin: 1em 1em 1em 1em;\n    font-size: 1.5em;\n    color: var(--hc-primary);\n  }\n\n  .horizon-card-graph {\n    margin: 1em 0.5em 1em 0.5em;\n  }\n\n  .horizon-card-graph .dawn {\n    fill: var(--hc-night-color);\n    stroke: var(--hc-night-color);\n  }\n\n  .horizon-card-graph .day {\n    fill: var(--hc-day-color);\n    stroke: var(--hc-day-color);\n  }\n"])));

var azimuth$A = "Азимут";
var dawn$A = "Зора";
var dusk$A = "Здрач";
var elevation$A = "Височина";
var moonrise$A = "Лунен изгрев";
var moonset$A = "Лунен залез";
var noon$A = "Пладне";
var sunrise$A = "Изгрев";
var sunset$A = "Залез";
var bg = {
	azimuth: azimuth$A,
	dawn: dawn$A,
	dusk: dusk$A,
	elevation: elevation$A,
	moonrise: moonrise$A,
	moonset: moonset$A,
	noon: noon$A,
	sunrise: sunrise$A,
	sunset: sunset$A
};

var azimuth$z = "Azimut";
var dawn$z = "Alba";
var dusk$z = "Capvespre";
var elevation$z = "Elevació";
var moonrise$z = "Sortida de la lluna";
var moonset$z = "Posta de lluna";
var noon$z = "Migdia solar";
var sunrise$z = "Sortida del sol";
var sunset$z = "Posta del sol";
var ca = {
	azimuth: azimuth$z,
	dawn: dawn$z,
	dusk: dusk$z,
	elevation: elevation$z,
	moonrise: moonrise$z,
	moonset: moonset$z,
	noon: noon$z,
	sunrise: sunrise$z,
	sunset: sunset$z
};

var azimuth$y = "Azimut";
var dawn$y = "Svítání";
var dusk$y = "Soumrak";
var elevation$y = "Výška";
var moonrise$y = "Východ měsíce";
var moonset$y = "Západ měsíce";
var noon$y = "Sluneční poledne";
var sunrise$y = "Východ slunce";
var sunset$y = "Západ slunce";
var cs = {
	azimuth: azimuth$y,
	dawn: dawn$y,
	dusk: dusk$y,
	elevation: elevation$y,
	moonrise: moonrise$y,
	moonset: moonset$y,
	noon: noon$y,
	sunrise: sunrise$y,
	sunset: sunset$y
};

var azimuth$x = "Azimut";
var dawn$x = "Daggry";
var dusk$x = "Skumring";
var elevation$x = "Højde";
var moonrise$x = "Måneopgang";
var moonset$x = "Månenedgang";
var noon$x = "Middag";
var sunrise$x = "Solopgang";
var sunset$x = "Solnedgang";
var da = {
	azimuth: azimuth$x,
	dawn: dawn$x,
	dusk: dusk$x,
	elevation: elevation$x,
	moonrise: moonrise$x,
	moonset: moonset$x,
	noon: noon$x,
	sunrise: sunrise$x,
	sunset: sunset$x
};

var azimuth$w = "Azimut";
var dawn$w = "Morgendämmerung";
var dusk$w = "Abenddämmerung";
var elevation$w = "Höhenwinkel";
var moonrise$w = "Mondaufgang";
var moonset$w = "Monduntergang";
var noon$w = "Mittag";
var sunrise$w = "Sonnenaufgang";
var sunset$w = "Sonnenuntergang";
var de = {
	azimuth: azimuth$w,
	dawn: dawn$w,
	dusk: dusk$w,
	elevation: elevation$w,
	moonrise: moonrise$w,
	moonset: moonset$w,
	noon: noon$w,
	sunrise: sunrise$w,
	sunset: sunset$w
};

var azimuth$v = "Αζιμούθιο";
var dawn$v = "Αυγή";
var dusk$v = "Σούρουπο";
var elevation$v = "Υψόμετρο";
var moonrise$v = "Aνατολή σελήνης";
var moonset$v = "Δύση σελήνης";
var noon$v = "Μεσημέρι";
var sunrise$v = "Ανατολή";
var sunset$v = "Δύση";
var el = {
	azimuth: azimuth$v,
	dawn: dawn$v,
	dusk: dusk$v,
	elevation: elevation$v,
	moonrise: moonrise$v,
	moonset: moonset$v,
	noon: noon$v,
	sunrise: sunrise$v,
	sunset: sunset$v
};

var azimuth$u = "Azimuth";
var dawn$u = "Dawn";
var dusk$u = "Dusk";
var elevation$u = "Elevation";
var moonrise$u = "Moonrise";
var moonset$u = "Moonset";
var noon$u = "Solar noon";
var sunrise$u = "Sunrise";
var sunset$u = "Sunset";
var en = {
	azimuth: azimuth$u,
	dawn: dawn$u,
	dusk: dusk$u,
	elevation: elevation$u,
	moonrise: moonrise$u,
	moonset: moonset$u,
	noon: noon$u,
	sunrise: sunrise$u,
	sunset: sunset$u
};

var azimuth$t = "Azimut";
var dawn$t = "Amanecer";
var dusk$t = "Anochecer";
var elevation$t = "Elevación";
var moonrise$t = "Salida de la luna";
var moonset$t = "Puesta de la luna";
var noon$t = "Mediodía solar";
var sunrise$t = "Salida del sol";
var sunset$t = "Atardecer";
var es = {
	azimuth: azimuth$t,
	dawn: dawn$t,
	dusk: dusk$t,
	elevation: elevation$t,
	moonrise: moonrise$t,
	moonset: moonset$t,
	noon: noon$t,
	sunrise: sunrise$t,
	sunset: sunset$t
};

var azimuth$s = "Asimuut";
var dawn$s = "Koidik";
var dusk$s = "Hämarik";
var elevation$s = "Kõrgus";
var moonrise$s = "Kuutõus";
var moonset$s = "Kuuloojang";
var noon$s = "Keskpäev";
var sunrise$s = "Päikesetõus";
var sunset$s = "Päikeseloojang";
var et = {
	azimuth: azimuth$s,
	dawn: dawn$s,
	dusk: dusk$s,
	elevation: elevation$s,
	moonrise: moonrise$s,
	moonset: moonset$s,
	noon: noon$s,
	sunrise: sunrise$s,
	sunset: sunset$s
};

var azimuth$r = "Atsimuutti";
var dawn$r = "Sarastus";
var dusk$r = "Hämärä";
var elevation$r = "Korkeus";
var moonrise$r = "Kuunnousu";
var moonset$r = "Kuunlasku";
var noon$r = "Keskipäivä";
var sunrise$r = "Auringonnousu";
var sunset$r = "Auringonlasku";
var fi = {
	azimuth: azimuth$r,
	dawn: dawn$r,
	dusk: dusk$r,
	elevation: elevation$r,
	moonrise: moonrise$r,
	moonset: moonset$r,
	noon: noon$r,
	sunrise: sunrise$r,
	sunset: sunset$r
};

var azimuth$q = "Azimut";
var dawn$q = "Aube";
var dusk$q = "Crépuscule";
var elevation$q = "Élévation";
var moonrise$q = "Lever de lune";
var moonset$q = "Coucher de lune";
var noon$q = "Midi solaire";
var sunrise$q = "Lever du soleil";
var sunset$q = "Coucher du soleil";
var fr = {
	azimuth: azimuth$q,
	dawn: dawn$q,
	dusk: dusk$q,
	elevation: elevation$q,
	moonrise: moonrise$q,
	moonset: moonset$q,
	noon: noon$q,
	sunrise: sunrise$q,
	sunset: sunset$q
};

var azimuth$p = "Acimut";
var dawn$p = "Amencer";
var dusk$p = "Luscofusco";
var elevation$p = "Elevación";
var moonrise$p = "Saída da lúa";
var moonset$p = "Posta da lúa";
var noon$p = "Mediodía solar";
var sunrise$p = "Saída do sol";
var sunset$p = "Atardecer";
var gl = {
	azimuth: azimuth$p,
	dawn: dawn$p,
	dusk: dusk$p,
	elevation: elevation$p,
	moonrise: moonrise$p,
	moonset: moonset$p,
	noon: noon$p,
	sunrise: sunrise$p,
	sunset: sunset$p
};

var azimuth$o = "אזימוט";
var dawn$o = "עלות השחר";
var dusk$o = "בין הערבים";
var elevation$o = "גובה";
var moonrise$o = "זריחה ירח";
var moonset$o = "שקיעה ירח";
var noon$o = "אמצע היום";
var sunrise$o = "זריחה";
var sunset$o = "שקיעה";
var he = {
	azimuth: azimuth$o,
	dawn: dawn$o,
	dusk: dusk$o,
	elevation: elevation$o,
	moonrise: moonrise$o,
	moonset: moonset$o,
	noon: noon$o,
	sunrise: sunrise$o,
	sunset: sunset$o
};

var azimuth$n = "Azimut";
var dawn$n = "Zora";
var dusk$n = "Sumrak";
var elevation$n = "Visina";
var moonrise$n = "Izlazak mjeseca";
var moonset$n = "Zalazak mjeseca";
var noon$n = "Sunčano podne";
var sunrise$n = "Izlazak sunca";
var sunset$n = "Zalazak sunca";
var hr = {
	azimuth: azimuth$n,
	dawn: dawn$n,
	dusk: dusk$n,
	elevation: elevation$n,
	moonrise: moonrise$n,
	moonset: moonset$n,
	noon: noon$n,
	sunrise: sunrise$n,
	sunset: sunset$n
};

var azimuth$m = "Azimut";
var dawn$m = "Hajnal";
var dusk$m = "Szürkület";
var elevation$m = "Magasság";
var moonrise$m = "Holdkelte";
var moonset$m = "Holdnyugta";
var noon$m = "Dél";
var sunrise$m = "Napkelte";
var sunset$m = "Napnyugta";
var hu = {
	azimuth: azimuth$m,
	dawn: dawn$m,
	dusk: dusk$m,
	elevation: elevation$m,
	moonrise: moonrise$m,
	moonset: moonset$m,
	noon: noon$m,
	sunrise: sunrise$m,
	sunset: sunset$m
};

var azimuth$l = "Áttarhorn";
var dawn$l = "Dögun";
var dusk$l = "Rökkur";
var elevation$l = "Hækkun";
var moonrise$l = "Tunglupprás";
var moonset$l = "Tunglsetur";
var noon$l = "Sólarhádegi";
var sunrise$l = "Sólarupprás";
var sunset$l = "Sólsetur";
var is = {
	azimuth: azimuth$l,
	dawn: dawn$l,
	dusk: dusk$l,
	elevation: elevation$l,
	moonrise: moonrise$l,
	moonset: moonset$l,
	noon: noon$l,
	sunrise: sunrise$l,
	sunset: sunset$l
};

var azimuth$k = "Azimut";
var dawn$k = "Aurora";
var dusk$k = "Crepuscolo";
var elevation$k = "Elevazione";
var moonrise$k = "Levata";
var moonset$k = "Calata";
var noon$k = "Mezzogiorno";
var sunrise$k = "Alba";
var sunset$k = "Tramonto";
var it = {
	azimuth: azimuth$k,
	dawn: dawn$k,
	dusk: dusk$k,
	elevation: elevation$k,
	moonrise: moonrise$k,
	moonset: moonset$k,
	noon: noon$k,
	sunrise: sunrise$k,
	sunset: sunset$k
};

var azimuth$j = "方位角";
var dawn$j = "明け方";
var dusk$j = "夕方";
var elevation$j = "高度";
var moonrise$j = "月の出";
var moonset$j = "月の入り";
var noon$j = "南中";
var sunrise$j = "日の出";
var sunset$j = "日没";
var ja = {
	azimuth: azimuth$j,
	dawn: dawn$j,
	dusk: dusk$j,
	elevation: elevation$j,
	moonrise: moonrise$j,
	moonset: moonset$j,
	noon: noon$j,
	sunrise: sunrise$j,
	sunset: sunset$j
};

var azimuth$i = "방위각";
var dawn$i = "새벽";
var dusk$i = "저녁";
var elevation$i = "태양 고도";
var moonrise$i = "월출";
var moonset$i = "월몰";
var noon$i = "태양 정오";
var sunrise$i = "해돋이";
var sunset$i = "해넘이";
var ko = {
	azimuth: azimuth$i,
	dawn: dawn$i,
	dusk: dusk$i,
	elevation: elevation$i,
	moonrise: moonrise$i,
	moonset: moonset$i,
	noon: noon$i,
	sunrise: sunrise$i,
	sunset: sunset$i
};

var azimuth$h = "Azimutas";
var dawn$h = "Aušra";
var dusk$h = "Prieblanda";
var elevation$h = "Pakilimas";
var moonrise$h = "Mėnulio kilimas";
var moonset$h = "Mėnulio leidimasis";
var noon$h = "Vidurdienis";
var sunrise$h = "Saulėtekis";
var sunset$h = "Saulėlydis";
var lt = {
	azimuth: azimuth$h,
	dawn: dawn$h,
	dusk: dusk$h,
	elevation: elevation$h,
	moonrise: moonrise$h,
	moonset: moonset$h,
	noon: noon$h,
	sunrise: sunrise$h,
	sunset: sunset$h
};

var azimuth$g = "Azimut";
var dawn$g = "Fajar";
var dusk$g = "Senja";
var elevation$g = "Ketinggian";
var moonrise$g = "Bulan terbit";
var moonset$g = "Bulan terbenam";
var noon$g = "Tengahari";
var sunrise$g = "Matahari terbit";
var sunset$g = "Matahari terbenam";
var ms = {
	azimuth: azimuth$g,
	dawn: dawn$g,
	dusk: dusk$g,
	elevation: elevation$g,
	moonrise: moonrise$g,
	moonset: moonset$g,
	noon: noon$g,
	sunrise: sunrise$g,
	sunset: sunset$g
};

var azimuth$f = "Azimut";
var dawn$f = "Daggry";
var dusk$f = "Skumring";
var elevation$f = "Elevasjon";
var moonrise$f = "Måneoppgang";
var moonset$f = "Månenedgang";
var noon$f = "Middag";
var sunrise$f = "Soloppgang";
var sunset$f = "Solnedgang";
var nb = {
	azimuth: azimuth$f,
	dawn: dawn$f,
	dusk: dusk$f,
	elevation: elevation$f,
	moonrise: moonrise$f,
	moonset: moonset$f,
	noon: noon$f,
	sunrise: sunrise$f,
	sunset: sunset$f
};

var azimuth$e = "Azimut";
var dawn$e = "Dageraad";
var dusk$e = "Schemer";
var elevation$e = "Hoogte";
var moonrise$e = "Maanopkomst";
var moonset$e = "Maanondergang";
var noon$e = "Middaguur";
var sunrise$e = "Zonsopkomst";
var sunset$e = "Zonsondergang";
var nl = {
	azimuth: azimuth$e,
	dawn: dawn$e,
	dusk: dusk$e,
	elevation: elevation$e,
	moonrise: moonrise$e,
	moonset: moonset$e,
	noon: noon$e,
	sunrise: sunrise$e,
	sunset: sunset$e
};

var azimuth$d = "Asimut";
var dawn$d = "Daggry";
var dusk$d = "Skumring";
var elevation$d = "Høgde";
var moonrise$d = "Måneoppgang";
var moonset$d = "Månenedgang";
var noon$d = "Middag";
var sunrise$d = "Soloppgang";
var sunset$d = "Solnedgang";
var nn = {
	azimuth: azimuth$d,
	dawn: dawn$d,
	dusk: dusk$d,
	elevation: elevation$d,
	moonrise: moonrise$d,
	moonset: moonset$d,
	noon: noon$d,
	sunrise: sunrise$d,
	sunset: sunset$d
};

var azimuth$c = "Azymut";
var dawn$c = "Świt";
var dusk$c = "Zmierzch";
var elevation$c = "Wysokość";
var moonrise$c = "Wschód księżyca";
var moonset$c = "Zachód księżyca";
var noon$c = "Górowanie";
var sunrise$c = "Wschód";
var sunset$c = "Zachód";
var pl = {
	azimuth: azimuth$c,
	dawn: dawn$c,
	dusk: dusk$c,
	elevation: elevation$c,
	moonrise: moonrise$c,
	moonset: moonset$c,
	noon: noon$c,
	sunrise: sunrise$c,
	sunset: sunset$c
};

var azimuth$b = "Azimute";
var dawn$b = "Amanhecer";
var dusk$b = "Anoitecer";
var elevation$b = "Elevação";
var moonrise$b = "Anoitecer";
var moonset$b = "Amanhecer";
var noon$b = "Meio dia";
var sunrise$b = "Nascer do sol";
var sunset$b = "Pôr do sol";
var pt = {
	azimuth: azimuth$b,
	dawn: dawn$b,
	dusk: dusk$b,
	elevation: elevation$b,
	moonrise: moonrise$b,
	moonset: moonset$b,
	noon: noon$b,
	sunrise: sunrise$b,
	sunset: sunset$b
};

var azimuth$a = "Azimute";
var dawn$a = "Amanhecer";
var dusk$a = "Anoitecer";
var elevation$a = "Elevação";
var moonrise$a = "Nascer da lua";
var moonset$a = "Pôr da lua";
var noon$a = "Meio dia solar";
var sunrise$a = "Nascer do sol";
var sunset$a = "Pôr do sol";
var ptBR = {
	azimuth: azimuth$a,
	dawn: dawn$a,
	dusk: dusk$a,
	elevation: elevation$a,
	moonrise: moonrise$a,
	moonset: moonset$a,
	noon: noon$a,
	sunrise: sunrise$a,
	sunset: sunset$a
};

var azimuth$9 = "Azimut";
var dawn$9 = "Zori";
var dusk$9 = "Amurg";
var elevation$9 = "Elevație";
var moonrise$9 = "Răsărit lunii";
var moonset$9 = "Apus lunii";
var noon$9 = "Zenit";
var sunrise$9 = "Răsărit";
var sunset$9 = "Apus";
var ro = {
	azimuth: azimuth$9,
	dawn: dawn$9,
	dusk: dusk$9,
	elevation: elevation$9,
	moonrise: moonrise$9,
	moonset: moonset$9,
	noon: noon$9,
	sunrise: sunrise$9,
	sunset: sunset$9
};

var azimuth$8 = "Азимут";
var dawn$8 = "Рассвет";
var dusk$8 = "Сумерки";
var elevation$8 = "Высота";
var moonrise$8 = "Восход луны";
var moonset$8 = "Закат луны";
var noon$8 = "Зенит";
var sunrise$8 = "Восход";
var sunset$8 = "Закат";
var ru = {
	azimuth: azimuth$8,
	dawn: dawn$8,
	dusk: dusk$8,
	elevation: elevation$8,
	moonrise: moonrise$8,
	moonset: moonset$8,
	noon: noon$8,
	sunrise: sunrise$8,
	sunset: sunset$8
};

var azimuth$7 = "Azimut";
var dawn$7 = "Úsvit";
var dusk$7 = "Súmrak";
var elevation$7 = "Výška";
var moonrise$7 = "Východ mesiaca";
var moonset$7 = "Západ mesiaca";
var noon$7 = "Slnečné poludnie";
var sunrise$7 = "Východ slnka";
var sunset$7 = "Západ slnka";
var sk = {
	azimuth: azimuth$7,
	dawn: dawn$7,
	dusk: dusk$7,
	elevation: elevation$7,
	moonrise: moonrise$7,
	moonset: moonset$7,
	noon: noon$7,
	sunrise: sunrise$7,
	sunset: sunset$7
};

var azimuth$6 = "Azimut";
var dawn$6 = "Zora";
var dusk$6 = "Mrak";
var elevation$6 = "Višina";
var moonrise$6 = "Lunin vzhod";
var moonset$6 = "Lunin zahod";
var noon$6 = "Sončno poldne";
var sunrise$6 = "Sončni vzhod";
var sunset$6 = "Sončni zahod";
var sl = {
	azimuth: azimuth$6,
	dawn: dawn$6,
	dusk: dusk$6,
	elevation: elevation$6,
	moonrise: moonrise$6,
	moonset: moonset$6,
	noon: noon$6,
	sunrise: sunrise$6,
	sunset: sunset$6
};

var azimuth$5 = "Azimut";
var dawn$5 = "Gryning";
var dusk$5 = "Skymning";
var elevation$5 = "Elevation";
var moonrise$5 = "Månuppgång";
var moonset$5 = "Månnedgång";
var noon$5 = "Middag";
var sunrise$5 = "Soluppgång";
var sunset$5 = "Solnedgång";
var sv = {
	azimuth: azimuth$5,
	dawn: dawn$5,
	dusk: dusk$5,
	elevation: elevation$5,
	moonrise: moonrise$5,
	moonset: moonset$5,
	noon: noon$5,
	sunrise: sunrise$5,
	sunset: sunset$5
};

var azimuth$4 = "Güney Açısı";
var dawn$4 = "Şafak";
var dusk$4 = "Alacakaranlık";
var elevation$4 = "Yükseklik";
var moonrise$4 = "Ayın doğuşu";
var moonset$4 = "Ayın batışı";
var noon$4 = "Öğle";
var sunrise$4 = "Gündoğumu";
var sunset$4 = "Günbatımı";
var tr = {
	azimuth: azimuth$4,
	dawn: dawn$4,
	dusk: dusk$4,
	elevation: elevation$4,
	moonrise: moonrise$4,
	moonset: moonset$4,
	noon: noon$4,
	sunrise: sunrise$4,
	sunset: sunset$4
};

var azimuth$3 = "Азимут";
var dawn$3 = "Світанок";
var dusk$3 = "Сутінки";
var elevation$3 = "Висота";
var moonrise$3 = "Схід місяця";
var moonset$3 = "Захід місяця";
var noon$3 = "Зеніт";
var sunrise$3 = "Схід";
var sunset$3 = "Захід";
var uk = {
	azimuth: azimuth$3,
	dawn: dawn$3,
	dusk: dusk$3,
	elevation: elevation$3,
	moonrise: moonrise$3,
	moonset: moonset$3,
	noon: noon$3,
	sunrise: sunrise$3,
	sunset: sunset$3
};

var azimuth$2 = "سمت الراسی";
var dawn$2 = "سویرا";
var dusk$2 = "شام";
var elevation$2 = "بلندی";
var moonrise$2 = "طلوع قمر";
var moonset$2 = "غروب قمر";
var noon$2 = "دوپہر";
var sunrise$2 = "طلوع آفتاب";
var sunset$2 = "غروب آفتاب";
var ur = {
	azimuth: azimuth$2,
	dawn: dawn$2,
	dusk: dusk$2,
	elevation: elevation$2,
	moonrise: moonrise$2,
	moonset: moonset$2,
	noon: noon$2,
	sunrise: sunrise$2,
	sunset: sunset$2
};

var azimuth$1 = "方位角";
var dawn$1 = "拂晓";
var dusk$1 = "傍晚";
var elevation$1 = "仰角";
var moonrise$1 = "月出";
var moonset$1 = "月落";
var noon$1 = "日中";
var sunrise$1 = "日出";
var sunset$1 = "日落";
var zh_Hans = {
	azimuth: azimuth$1,
	dawn: dawn$1,
	dusk: dusk$1,
	elevation: elevation$1,
	moonrise: moonrise$1,
	moonset: moonset$1,
	noon: noon$1,
	sunrise: sunrise$1,
	sunset: sunset$1
};

var azimuth = "方位";
var dawn = "黎明";
var dusk = "黃昏";
var elevation = "仰角";
var moonrise = "月出";
var moonset = "月落";
var noon = "日正當中";
var sunrise = "日昇";
var sunset = "日落";
var zh_Hant = {
	azimuth: azimuth,
	dawn: dawn,
	dusk: dusk,
	elevation: elevation,
	moonrise: moonrise,
	moonset: moonset,
	noon: noon,
	sunrise: sunrise,
	sunset: sunset
};

var Constants = /*#__PURE__*/_createClass(function Constants() {
  _classCallCheck(this, Constants);
});
_defineProperty(Constants, "FALLBACK_LOCALIZATION", en);
_defineProperty(Constants, "DEFAULT_REFRESH_PERIOD", 20 * 1000);
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
  debug_level: 0,
  refresh_period: Constants.DEFAULT_REFRESH_PERIOD,
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
    phase: Constants.MOON_PHASES.fullMoon,
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
_defineProperty(Constants, "LOCALIZATION_LANGUAGES", {
  bg: bg,
  ca: ca,
  cs: cs,
  da: da,
  de: de,
  el: el,
  en: en,
  es: es,
  et: et,
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
  ms: ms,
  nb: nb,
  nl: nl,
  nn: nn,
  pl: pl,
  pt: pt,
  'pt-BR': ptBR,
  ro: ro,
  ru: ru,
  sk: sk,
  sl: sl,
  sv: sv,
  tr: tr,
  uk: uk,
  ur: ur,
  'zh-Hans': zh_Hans,
  'zh-Hant': zh_Hant
});

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

var _templateObject$6, _templateObject2$3, _templateObject3$2, _templateObject4$1, _templateObject5$1, _templateObject6$1, _templateObject7$1;
var HelperFunctions = /*#__PURE__*/function () {
  function HelperFunctions() {
    _classCallCheck(this, HelperFunctions);
  }
  _createClass(HelperFunctions, null, [{
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
      return x(_templateObject$6 || (_templateObject$6 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-text-container\">\n        <div class=\"horizon-card-field-name\">", "</div>\n        ", "\n      </div>\n    "])), i18n.tr(translationKey), value instanceof Array ? value : this.valueToHtml(i18n, translationKey, value));
    }
  }, {
    key: "renderMoonElement",
    value: function renderMoonElement(i18n, phase, phaseRotation) {
      if (phase === undefined) {
        return A;
      }
      var moon_phase_localized = i18n.localize("component.moon.entity.sensor.phase.state.".concat(phase.state));
      if (!moon_phase_localized) {
        moon_phase_localized = x(_templateObject2$3 || (_templateObject2$3 = _taggedTemplateLiteral(["<span title=\"Install Moon integration to get localized Moon phase name\">", " (!)</span>"])), phase.state);
      }
      return x(_templateObject3$2 || (_templateObject3$2 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-text-container\">\n        <div class=\"horizon-card-field-moon-phase\" style=\"transform: rotate(", "deg)\">\n          <ha-icon icon=\"mdi:", "\"></ha-icon>\n        </div>\n        <div class=\"horizon-card-field-value horizon-card-field-value-moon-phase\">", "</div>\n      </div>\n    "])), phaseRotation, phase.icon, moon_phase_localized);
    }
  }, {
    key: "valueToHtml",
    value: function valueToHtml(i18n, translationKey, value) {
      var klass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var mappedValue = this.fieldValueToString(i18n, translationKey, value);
      return x(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteral(["<div class=\"horizon-card-field-value ", "\">", "</div>"])), klass, mappedValue);
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
      var preHtml = pre ? x(_templateObject5$1 || (_templateObject5$1 = _taggedTemplateLiteral(["<span class=\"horizon-card-field-value-secondary\">", "</span>"])), pre) : A;
      var postHtml = post ? x(_templateObject6$1 || (_templateObject6$1 = _taggedTemplateLiteral(["<span class=\"horizon-card-field-value-secondary\">", "</span>"])), post) : A;
      return x(_templateObject7$1 || (_templateObject7$1 = _taggedTemplateLiteral(["", "", "", ""])), preHtml, value, postHtml);
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
  return HelperFunctions;
}();

var I18N = /*#__PURE__*/function () {
  function I18N(language, timeZone, timeFormat, numberFormat, localizeFunc) {
    _classCallCheck(this, I18N);
    _defineProperty(this, "localization", void 0);
    _defineProperty(this, "dateFormatter", void 0);
    _defineProperty(this, "locale", void 0);
    _defineProperty(this, "localizeFunc", void 0);
    this.localization = I18N.matchLanguageToLocalization(language);
    this.dateFormatter = I18N.createDateFormatter(language, timeZone, timeFormat);
    this.locale = {
      language: language,
      time_format: timeFormat,
      number_format: numberFormat
    };
    this.localizeFunc = localizeFunc;
  }
  _createClass(I18N, [{
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
      return H$1(decimal, this.locale);
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
  }, {
    key: "localize",
    value: function localize(key) {
      return this.localizeFunc(key);
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
  return I18N;
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
  _createClass(HorizonErrorContent, [{
    key: "render",
    value: function render() {
      var errorMessage = this.i18n.tr("errors.".concat(this.error));
      // eslint-disable-next-line no-console
      console.error(errorMessage);
      return x(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-error\">\n        ", "\n      </div>\n    "])), errorMessage);
    }
  }]);
  return HorizonErrorContent;
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  _createClass(HorizonCardFooter, [{
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
      return x(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-footer\">\n        ", "\n        ", "\n        ", "\n      </div>\n    "])), this.renderRow(sunLeft, this.fields.noon ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Noon, this.sunTimes.noon) : A, sunRight), this.renderRow(this.fields.sun_azimuth || this.fields.moon_azimuth ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Azimuth, this.azimuths, this.azimuthExtraClasses) : A, this.fields.sun_elevation || this.fields.moon_elevation ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Elevation, this.elevations, this.elevationExtraClasses) : A), this.renderRow(moonLeft, this.fields.moon_phase ? HelperFunctions.renderMoonElement(this.i18n, this.data.moonData.phase, this.data.moonData.phaseRotation) : A, moonRight));
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
      return nonEmpty.length > 0 ? x(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(["\n        <div class=\"horizon-card-field-row\">\n          ", "\n        </div>"])), nonEmpty) : A;
    }
  }]);
  return HorizonCardFooter;
}();

var _templateObject$3, _templateObject2$1, _templateObject3$1, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
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
  _createClass(HorizonCardGraph, [{
    key: "render",
    value: function render() {
      return x(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["\n      <div class=\"horizon-card-graph\">\n        <svg viewBox=\"0 0 550 150\" xmlns=\"http://www.w3.org/2000/svg\">\n          ", "\n        </svg>\n      </div>\n    "])), this.renderSvg());
    }
  }, {
    key: "renderSvg",
    value: function renderSvg() {
      var curve = this.sunCurve(this.sunPosition.scaleY);
      return b(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["\n      <defs>\n        <!-- Sun defs -->\n        <path id=\"sun-path-unscaled\" d=\"", "\"/>\n        <path id=\"sun-path\" d=\"", "\"/>\n\n        <clipPath id=\"upper-path-mask\">\n          <use href=\"#sun-path\">\n        </clipPath>\n\n        <clipPath id=\"lower-path-mask\">\n          <path d=\"", " V0 H0\"/>\n        </clipPath>\n\n        <!-- Moon defs -->\n        <filter id=\"moon-blur\">\n          <feGaussianBlur in=\"SourceGraphic\"\n                          stdDeviation=\"", "\"/>\n        </filter>\n\n        <circle id=\"moon\"\n                cx=\"", "\" cy=\"", "\"\n                r=\"", "\" stroke=\"none\"/>\n\n        <path id=\"shade\"\n              d=\"M", ",", "\n                a ", ",", "\n                0\n                1,1\n                ", ",0\n                a ", ",", "\n                0\n                1,", "\n                ", ",0\n                Z\"\n              stroke-width=\"0\"/>\n\n        <mask id=\"moon-shadow-mask\">\n          <use href=\"#shade\"\n               stroke=\"white\" fill=\"white\"\n               filter=\"url(#moon-blur)\" stroke-width=\"0\"/>\n        </mask>\n\n        <mask id=\"moon-shadow-mask-inverted\">\n          <circle cx=\"", "\" cy=\"", "\"\n                  r=\"", "\"\n                  fill=\"white\" stroke=\"white\" stroke-width=\"0\"/>\n\n          <use href=\"#shade\"\n               stroke=\"black\" fill=\"black\"\n               filter=\"url(#moon-blur)\" stroke-width=\"0\"/>\n        </mask>\n      </defs>\n\n      ", "\n\n      <!-- Draw the sunrise and sunset markers (the gray vertical lines) -->\n      <g transform=\"scale(", " 1)\" transform-origin=\"center\">\n        <line x1=\"", "\" y1=\"3\"\n              x2=\"", "\" y2=\"72\"\n              stroke=\"var(--hc-lines)\"/>\n        <line x1=\"", "\"\n              y1=\"3\" x2=\"", "\" y2=\"72\"\n              stroke=\"var(--hc-lines)\"/>\n      </g>\n\n      <!-- Main group that shifts up or down to center the horizon vertically -->\n      <g transform=\"translate(0 ", ") scale(", " 1)\" transform-origin=\"center\">\n        <!-- Draw path of the sun across the sky -->\n        <use href=\"#sun-path\"\n             fill=\"none\"\n             stroke=\"var(--hc-lines)\"/>\n\n        <!-- Draw the below horizon passed area, i.e., the dark blue/night part on either side -->\n        <path\n          d=\"M5,", " H", " V150 H5\"\n          clip-path=\"url(#lower-path-mask)\"\n          class=\"dawn\"/>\n\n        <!-- Draw the above horizon passed area, i.e., the light blue/day part in the middle -->\n        <path\n          d=\"M", ",0 H", "\n            V", " H", "\"\n          clip-path=\"url(#upper-path-mask)\"\n          class=\"day\"/>\n\n        <!-- Draw the horizon (the gray horizontal lines) -->\n        <line x1=\"5\" y1=\"", "\"\n              x2=\"545\" y2=\"", "\"\n              stroke=\"var(--hc-lines)\"/>\n\n        <!-- Arrow showing direction of travel -->\n        <path d=\"M535 ", " L545 ", " L535 ", "\"\n              stroke=\"var(--hc-lines)\" fill=\"none\"/>\n\n        <!-- Draw the sun -->\n        <circle\n          cx=\"", "\"\n          cy=\"", "\"\n          r=\"", "\"\n          stroke=\"none\"\n          fill=\"var(--hc-sun-color)\"/>\n\n        ", "\n      </g>\n\n      ", "\n\n      ", "\n\n      ", "\n    "])), this.sunCurve(1), curve, curve, 0.5 - Math.abs(0.5 - this.moonData.fraction), this.moonPosition.x, this.moonPosition.y, Constants.MOON_RADIUS, this.moonPosition.x - Constants.MOON_RADIUS, this.moonPosition.y, Constants.MOON_RADIUS, Constants.MOON_RADIUS, Constants.MOON_RADIUS * 2, Constants.MOON_RADIUS, Math.abs(0.5 - this.moonData.fraction) * 2 * Constants.MOON_RADIUS, this.moonData.fraction > 0.5 ? 1 : 0, -Constants.MOON_RADIUS * 2, this.moonPosition.x, this.moonPosition.y, Constants.MOON_RADIUS, this.debugRect(), this.southernFlip ? -1 : 1, this.sunPosition.sunriseX, this.sunPosition.sunriseX, this.sunPosition.sunsetX, this.sunPosition.sunsetX, this.sunPosition.offsetY, this.southernFlip ? -1 : 1, this.sunPosition.horizonY, this.sunPosition.x, this.sunPosition.sunriseX, this.sunPosition.x, this.sunPosition.horizonY, this.sunPosition.sunriseX, this.sunPosition.horizonY, this.sunPosition.horizonY, this.sunPosition.horizonY - 5, this.sunPosition.horizonY, this.sunPosition.horizonY + 5, this.sunPosition.x, this.sunPosition.y, Constants.SUN_RADIUS, this.debugSun(), this.moon(), this.debugHorizon(), this.debugCurve());
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
      return this.config.moon ? b(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["<!-- Moon -->\n          <g transform=\"rotate(", " ", " ", ")\">\n            <!-- Moon shadow -->\n            <use href=\"#moon\" fill=\"var(--hc-moon-shadow-color)\"/>\n            <!-- Moon proper -->\n            <use href=\"#moon\" fill=\"var(--hc-moon-color)\" mask=\"url(#moon-shadow-mask)\"/>\n          </g>\n          <!-- Moon spots to approximate the darker parts -->\n          <g transform=\"rotate(", " ", " ", ")\">\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n            <circle cx=\"", "\" cy=\"", "\" r=\"", "\"\n                    stroke=\"none\" fill=\"", "\"/>\n          </g>\n        "])), this.moonData.zenithAngle, this.moonPosition.x, this.moonPosition.y, this.moonData.parallacticAngle, this.moonPosition.x, this.moonPosition.y, this.moonPosition.x - bigSpotR, this.moonPosition.y - 1.5 * bigSpotR, hugeSpotR, spotFill, this.moonPosition.x + 1.5 * bigSpotR, this.moonPosition.y - 2 * bigSpotR, bigSpotR, spotFill, this.moonPosition.x - bigSpotR, this.moonPosition.y + bigSpotR, bigSpotR, spotFill, this.moonPosition.x + bigSpotR * 2, this.moonPosition.y, smallSpotR, spotFill) : A;
    }
  }, {
    key: "debugCurve",
    value: function debugCurve() {
      return this.debugLevel >= 1 ? b(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<use href=\"#sun-path-unscaled\" stroke=\"red\" fill=\"none\" transform=\"translate(0, 0)\">"]))) : A;
    }
  }, {
    key: "debugRect",
    value: function debugRect() {
      return this.debugLevel >= 1 ? b(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<rect x=\"0\" y=\"0\" width=\"550\" height=\"150\" fill=\"none\" stroke=\"red\"/>"]))) : A;
    }
  }, {
    key: "debugHorizon",
    value: function debugHorizon() {
      return this.debugLevel >= 1 ? b(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<line x1=\"5\" y1=\"84\" x2=\"545\" y2=\"84\" stroke=\"red\" stroke-dasharray=\"4 4\"/>"]))) : A;
    }
  }, {
    key: "debugSun",
    value: function debugSun() {
      return this.debugLevel >= 1 ? b(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["<path d=\"M", " ", "\n                h", "\" stroke=\"red\"/>\n          <path d=\"M", " ", "\n                v", "\" stroke=\"red\"/>\n          <circle cx=\"", "\" cy=\"", "\"\n                  r=\"", "\" stroke=\"red\" fill=\"none\"/>\n        "])), this.sunPosition.x - Constants.SUN_RADIUS, this.sunPosition.y, Constants.SUN_RADIUS * 2, this.sunPosition.x, this.sunPosition.y - Constants.SUN_RADIUS, Constants.SUN_RADIUS * 2, this.sunPosition.x, this.sunPosition.y, Constants.SUN_RADIUS) : A;
    }
  }]);
  return HorizonCardGraph;
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.fields = config.fields;
    this.times = data.sunData.times;
    this.i18n = i18n;
    this.southern_flip = config.southern_flip;
  }
  _createClass(HorizonCardHeader, [{
    key: "render",
    value: function render() {
      return x(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n      ", "\n      ", "\n    "])), this.showTitle() ? this.renderTitle() : A, this.renderHeader());
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return x(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"horizon-card-title\">", "</div>"])), this.title);
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var sunrise = this.fields.sunrise ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunrise, this.times.sunrise) : A;
      var sunset = this.fields.sunset ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunset, this.times.sunset) : A;
      var left = this.southern_flip ? sunset : sunrise;
      var right = this.southern_flip ? sunrise : sunset;
      return x(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<div class=\"horizon-card-header\">", "", "</div>"])), left, right);
    }
  }, {
    key: "showTitle",
    value: function showTitle() {
      return this.title !== undefined;
    }
  }]);
  return HorizonCardHeader;
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
  _createClass(HorizonCardContent, [{
    key: "render",
    value: function render() {
      return x(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n      <ha-card>\n        <div class=\"horizon-card\">\n          ", "\n          ", "\n          ", "\n        </div>\n      </ha-card>\n    "])), this.renderHeader(), this.renderGraph(), this.renderFooter());
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
  return HorizonCardContent;
}();

var _templateObject;
var HorizonCard = _decorate([e$1('horizon-card')], function (_initialize, _LitElement) {
  var HorizonCard = /*#__PURE__*/function (_LitElement2) {
    _inherits(HorizonCard, _LitElement2);
    var _super = _createSuper(HorizonCard);
    function HorizonCard() {
      var _this;
      _classCallCheck(this, HorizonCard);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _super.call.apply(_super, [this].concat(args));
      _initialize(_assertThisInitialized(_this));
      return _this;
    }
    return _createClass(HorizonCard);
  }(_LitElement);
  return {
    F: HorizonCard,
    d: [{
      kind: "field",
      "static": true,
      key: "cardType",
      value: function value() {
        return 'horizon-card';
      }
    }, {
      kind: "field",
      "static": true,
      key: "cardName",
      value: function value() {
        return 'Horizon Card';
      }
    }, {
      kind: "field",
      "static": true,
      key: "cardDescription",
      value: function value() {
        return 'Custom card that display a graph to track the sun position and related events';
      }
    }, {
      kind: "field",
      decorators: [t()],
      key: "config",
      value: void 0
    }, {
      kind: "field",
      decorators: [t()],
      key: "data",
      value: function value() {
        return Constants.DEFAULT_CARD_DATA;
      }
    }, {
      kind: "field",
      decorators: [t()],
      key: "error",
      value: void 0
    }, {
      kind: "field",
      key: "lastHass",
      value: void 0
    }, {
      kind: "field",
      key: "hasCalculated",
      value: function value() {
        return false;
      }
    }, {
      kind: "field",
      key: "wasDisconnected",
      value: function value() {
        return false;
      }
    }, {
      kind: "get",
      "static": true,
      key: "styles",
      value: function styles() {
        return cardStyles;
      }
    }, {
      kind: "set",
      key: "hass",
      value: function hass(_hass) {
        this.debug(function () {
          return "set hass :: ".concat(_hass.locale.language, " :: ").concat(_hass.locale.time_format);
        }, 2);
        this.lastHass = _hass;
      }

      /**
       * called by HASS to properly distribute card in lovelace view. It should return height
       * of the card as a number where 1 is equivalent of 50 pixels.
       * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#api
       */
    }, {
      kind: "method",
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

      // called by HASS whenever config changes
    }, {
      kind: "method",
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
      kind: "method",
      key: "render",
      value: function render() {
        if (!this.lastHass) {
          this.debug('render() [no hass]', 2);
          return x(_templateObject || (_templateObject = _taggedTemplateLiteral([""])));
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
      kind: "method",
      key: "updated",
      value: function updated(changedProperties) {
        var _this2 = this;
        _get(_getPrototypeOf(HorizonCard.prototype), "updated", this).call(this, changedProperties);
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
          var refreshPeriod = this.refreshPeriod();
          if (refreshPeriod > 0) {
            window.setTimeout(function () {
              if (!_this2.wasDisconnected) {
                _this2.debug('refresh via setTimeout()', 2);
                if (_this2.hasCalculated) {
                  _this2.calculateStatePartial();
                }
              }
            }, refreshPeriod);
          }
        }
      }
    }, {
      kind: "method",
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.wasDisconnected = true;
        this.debug('disconnectedCallback()', 2);
      }
    }, {
      kind: "method",
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
      kind: "method",
      key: "calculateStatePartial",
      value: function calculateStatePartial() {
        var _this3 = this;
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
        var moonPosition = this.computeMoonPosition(moonData);
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
      kind: "method",
      key: "readSunTimes",
      value: function readSunTimes(now, latitude, longitude, elevation) {
        var nowDayBefore = new Date(now.getTime() - Constants.MS_24_HOURS);
        var sunTimesNow = SunCalc.getSunTimes(HelperFunctions.noonAtTimeZone(now, this.timeZone()), latitude, longitude, elevation, false, false, true);
        var sunTimesDayBefore = SunCalc.getSunTimes(HelperFunctions.noonAtTimeZone(nowDayBefore, this.timeZone()), latitude, longitude, elevation, false, false, true);
        var noonDelta = now.getTime() - sunTimesDayBefore.solarNoon.value.getTime();
        if (noonDelta < Constants.MS_12_HOURS) {
          // We are past local standard midnight but previous solar noon was sooner than 12 hours, use previous day's data
          return this.convertSunCalcTimes(sunTimesDayBefore);
        }
        return this.convertSunCalcTimes(sunTimesNow);
      }
    }, {
      kind: "method",
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
      kind: "method",
      key: "validOrUndefined",
      value: function validOrUndefined(event) {
        return event.valid ? event.value : undefined;
      }
    }, {
      kind: "method",
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
      kind: "method",
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
      kind: "method",
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
      kind: "method",
      key: "sunriseForComputation",
      value: function sunriseForComputation(sunrise, noon, canBeWinterDarkness) {
        return sunrise !== null && sunrise !== void 0 ? sunrise : canBeWinterDarkness ? noon : new Date(noon.getTime() - Constants.MS_12_HOURS);
      }
    }, {
      kind: "method",
      key: "computeSunPosition",
      value: function computeSunPosition(times, canBeWinterDarkness, previousScaleY) {
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
      kind: "method",
      key: "computeMoonData",
      value: function computeMoonData(now, lat, lon) {
        var _this$config$moon_pha;
        var moonRawData = SunCalc.getMoonData(now, lat, lon);
        var azimuth = this.roundDegree(moonRawData.azimuthDegrees);
        var elevation = this.roundDegree(moonRawData.altitudeDegrees);
        var moonRawTimes = SunCalc.getMoonTimes(HelperFunctions.midnightAtTimeZone(now, this.timeZone()), lat, lon, false, true);
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
      kind: "method",
      key: "computeMoonPosition",
      value: function computeMoonPosition(moonData) {
        // East to West goes left to right (or right to left, if southern-flipped!), like the Sun.
        // The canvas is 550 units wide, minus 5 units (padding)
        // and minus Constants.MOON_RADIUS on either side to keep the moon inside.
        // Left is 0 degrees, 180 degrees is in the middle.
        var availableSpanX = 550 - 2 * (Constants.MOON_RADIUS + 5);
        var calcAzimuth = this.southernFlip() ? (moonData.azimuth + 180) % 360 : moonData.azimuth;
        var x = 5 + Constants.MOON_RADIUS + availableSpanX * calcAzimuth / 360;
        var yLimit = Constants.HORIZON_Y - Constants.MOON_RADIUS;
        var calcElevation = Math.abs(moonData.elevation) / 2 + 1;
        var maxLog = 90 / 2 + 1;

        // The Moon's elevation scaled logarithmically to appear higher/lower from the drawn horizon
        var offset = yLimit * Math.log(calcElevation) / Math.log(maxLog) * Math.sign(moonData.elevation);
        var y = Constants.HORIZON_Y - offset;
        return {
          x: x,
          y: y
        };
      }
    }, {
      kind: "method",
      key: "latitude",
      value: function latitude() {
        var _this$config$latitude;
        return (_this$config$latitude = this.config.latitude) !== null && _this$config$latitude !== void 0 ? _this$config$latitude : this.lastHass.config.latitude;
      }
    }, {
      kind: "method",
      key: "longitude",
      value: function longitude() {
        var _this$config$longitud;
        return (_this$config$longitud = this.config.longitude) !== null && _this$config$longitud !== void 0 ? _this$config$longitud : this.lastHass.config.longitude;
      }
    }, {
      kind: "method",
      key: "elevation",
      value: function elevation() {
        var _this$config$elevatio;
        return (_this$config$elevatio = this.config.elevation) !== null && _this$config$elevatio !== void 0 ? _this$config$elevatio : this.lastHass.config.elevation;
      }
    }, {
      kind: "method",
      key: "southernFlip",
      value: function southernFlip() {
        var _this$config$southern;
        return (_this$config$southern = this.config.southern_flip) !== null && _this$config$southern !== void 0 ? _this$config$southern : this.latitude() < 0;
      }
    }, {
      kind: "method",
      key: "timeZone",
      value: function timeZone() {
        var _this$config$time_zon;
        return (_this$config$time_zon = this.config.time_zone) !== null && _this$config$time_zon !== void 0 ? _this$config$time_zon : this.lastHass.config.time_zone;
      }
    }, {
      kind: "method",
      key: "now",
      value: function now() {
        return this.config.now !== undefined ? new Date(this.config.now) : new Date();
      }
    }, {
      kind: "method",
      key: "refreshPeriod",
      value: function refreshPeriod() {
        var _this$config$refresh_;
        return (_this$config$refresh_ = this.config.refresh_period) !== null && _this$config$refresh_ !== void 0 ? _this$config$refresh_ : Constants.DEFAULT_REFRESH_PERIOD;
      }
    }, {
      kind: "method",
      key: "debugLevel",
      value: function debugLevel() {
        var _this$config$debug_le, _this$config;
        return (_this$config$debug_le = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.debug_level) !== null && _this$config$debug_le !== void 0 ? _this$config$debug_le : 0;
      }
    }, {
      kind: "method",
      key: "expandedFieldConfig",
      value: function expandedFieldConfig() {
        var _fieldConfig$sun_elev, _fieldConfig$moon_ele, _fieldConfig$sun_azim, _fieldConfig$moon_azi;
        var fieldConfig = _objectSpread2(_objectSpread2({}, Constants.DEFAULT_CONFIG.fields), this.config.fields);

        // Elevation and azimuth have a shared property and a per sun/moon dedicated property too
        fieldConfig.sun_elevation = (_fieldConfig$sun_elev = fieldConfig.sun_elevation) !== null && _fieldConfig$sun_elev !== void 0 ? _fieldConfig$sun_elev : fieldConfig.elevation;
        fieldConfig.moon_elevation = (_fieldConfig$moon_ele = fieldConfig.moon_elevation) !== null && _fieldConfig$moon_ele !== void 0 ? _fieldConfig$moon_ele : fieldConfig.elevation;
        fieldConfig.sun_azimuth = (_fieldConfig$sun_azim = fieldConfig.sun_azimuth) !== null && _fieldConfig$sun_azim !== void 0 ? _fieldConfig$sun_azim : fieldConfig.azimuth;
        fieldConfig.moon_azimuth = (_fieldConfig$moon_azi = fieldConfig.moon_azimuth) !== null && _fieldConfig$moon_azi !== void 0 ? _fieldConfig$moon_azi : fieldConfig.azimuth;
        return fieldConfig;
      }
    }, {
      kind: "method",
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
      kind: "method",
      key: "i18n",
      value: function i18n(config) {
        var display_time_zone;

        // Since 2023.7, HA can show times in the local (for the browser) TZ or the server TZ.
        if (this.lastHass.locale['time_zone'] === 'local') {
          display_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } else {
          // 'server' or missing value (older HA version)
          display_time_zone = config.time_zone;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return new I18N(config.language, display_time_zone, config.time_format, config.number_format, this.lastHass.localize);
      }
    }, {
      kind: "method",
      key: "roundDegree",
      value: function roundDegree(value) {
        return B$1(value, 1);
      }
    }, {
      kind: "method",
      key: "debug",
      value: function debug(message) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        if (this.debugLevel() >= level) {
          if (typeof message === 'function') {
            message = message();
          }
          // eslint-disable-next-line no-console
          console.debug("custom:".concat(HorizonCard.cardType, " :: ").concat(message));
        }
      }
    }]
  };
}, s);
window.customCards = window.customCards || [];
window.customCards.push({
  type: HorizonCard.cardType,
  name: HorizonCard.cardName,
  preview: true,
  description: HorizonCard.cardDescription
});
