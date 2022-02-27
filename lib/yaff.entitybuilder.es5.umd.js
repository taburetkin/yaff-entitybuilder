(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.routing = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
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

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var knownCtors = [String, Number, Date, Boolean];

  function _remove(ctor, index) {
    //console.log('-rem-', index);
    if (index == null) index = knownCtors.indexOf(ctor);

    if (index > -1) {
      var res = knownCtors.splice(index, 1);
      return res[0];
    }
  }

  function _isEqualOrInheritedOrBase(arg, ctor, isBase) {
    return arg === ctor || (isBase ? ctor.prototype instanceof arg : arg.prototype instanceof ctor);
  }

  function _iterate(action, args) {
    var len = knownCtors.length;

    for (var x = 0; x < len; x++) {
      var ctor = knownCtors[x];
      var result = action.apply(void 0, [ctor, x].concat(_toConsumableArray(args)));
      if (result !== undefined) return result;
    }
  }

  function _indexOfCtor(ctor, index, arg, isBase) {
    if (_isEqualOrInheritedOrBase(arg, ctor, isBase)) return index;
  }

  function _indexOf(arg, isBase) {
    var res = _iterate(_indexOfCtor, [arg, isBase]);

    return res == null ? -1 : res;
  }

  function _isKnownCtor(arg) {
    return _indexOf(arg) > -1;
  }

  function _instanceOfCtor(ctor, index, arg, isBase) {
    if (arg instanceof ctor) return true;
  }
  /**
   * 
   * @param {func} ctor - Class to remove
   * @param {boolean} inherited - false: will remove exactly provided class, true: will remove any one inherited or exactly provided
   * @returns undefined if Class was not found, Class if Class was removed
   */


  function removeKnownCtor(ctor, inherited) {
    if (!inherited) {
      return _remove(ctor);
    } else {
      return _remove(ctor, _indexOf(ctor, inherited));
    }
  }
  /**
   * 
   * @param {any} arg 
   * @returns true if given argument is known ctor otherwise false
   */

  function isKnownCtor(arg) {
    if (typeof arg !== 'function') return false;
    return _isKnownCtor(arg);
  }
  /**
   * 
   * @param {any} arg 
   * @returns true if given argument is instance of known ctor otherwise false
   */

  function isKnownCtorInstance(arg) {
    if (arg == null) return false;
    return !!_iterate(_instanceOfCtor, [arg]);
  }

  /**
   * Builder configuration.
   * 
   * @namespace {Configuration} configuration
   */
  var builderConfig = {
    /** defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error */
    shouldThrow: false
  };

  function normalizeBuildOptions(arg) {
    var invokeArgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var invokeContext = arguments.length > 2 ? arguments[2] : undefined;
    if (arg == null) return;

    var type = _typeof(arg);

    if (type === 'function') {
      if (isKnownCtor(arg)) {
        return {
          "class": arg
        };
      } else {
        return normalizeBuildOptions(arg.apply(invokeContext, invokeArgs), invokeArgs, invokeContext);
      }
    }

    if (type === 'object' && typeof arg["class"] === 'function') return arg;
  }
  function ensureBuildOptions(options, shouldThrow) {
    if (!options || typeof options["class"] !== 'function') {
      if (shouldThrow) throw new Error('provided buildOptions is not an object or does not have `entityClass` property');else return false;
    }

    return true;
  }
  function cloneObject(obj) {
    if (obj == null) return;
    if (_typeof(obj) !== 'object') return obj;
    var cloned = Object.assign({}, obj);

    for (var x = 1; x < arguments.length; x++) {
      delete cloned[arguments[x]];
    }

    return cloned;
  }

  /**
   * 
   * @param {object|func} arg  - BuildOptions obj or function returned BuildOptions or Class definition
   * @param {array} invokeArgs - optional, arguments for invoke function arg
   * @param {obj} invokeContext - optional, context for invoke function arg
   * @returns 
   */

  function build(arg, invokeArgs, invokeContext) {
    if (isKnownCtorInstance(arg)) return arg;
    var options = normalizeBuildOptions(arg, invokeArgs, invokeContext);
    if (!ensureBuildOptions(options, builderConfig.shouldThrow)) return;
    var EntityClass = options["class"];
    var ctorArgs = [];

    if (options.ctorArguments && Array.isArray(options.ctorArguments)) {
      ctorArgs = options.ctorArguments;
    } else {
      var entityOptions = cloneObject(options, 'class');
      ctorArgs.push(entityOptions);
    }

    return _construct(EntityClass, _toConsumableArray(ctorArgs));
  }

  exports.build = build;
  exports.builderConfig = builderConfig;
  exports.isKnownCtor = isKnownCtor;
  exports.knownCtors = knownCtors;
  exports.removeKnownCtor = removeKnownCtor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
