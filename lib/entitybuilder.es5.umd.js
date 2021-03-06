(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.YaffEb = {}));
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

  // /**
  //  * Known Ctors array
  //  * holds class definitions for determine should builder invoke provided function to extract result or not in case its a registered class definition
  //  * @example
  //  * let test1 = String;
  //  * let test2 = () => {};
  //  * isKnownCtor(test1) // true
  //  * isKnownCtor(test2) // false
  //  * 
  //  * //example invoke function:
  //  * function invoke(arg, invokeArgs = [], invokeContext) {
  //  *   if (typeof arg === 'function' && !isKnownCtor(arg)) {
  //  *     arg = arg.apply(invokeContext, invokeArgs);
  //  *   }
  //  *   return arg;
  //  * }
  //  */
  var knownCtors = [String, Number, Date, Boolean];

  function _remove(ctor, index) {
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
   * Removes provided class definition from `known ctors` array
   * @param {func} ctor - Class to remove
   * @param {boolean} [inherited] - false: will remove exactly provided class, true: will remove any one inherited or exactly provided
   * @returns undefined if Class was not found, Class if Class was removed
   * @example 
   * 
   * class MyClass {}
   * // add class definition to known ctors
   * addKnownCtor(MyClass);
   * 
   * isKnwonCtor(MyClass); // true;
   * 
   * // remove class definition from known ctors
   * removeKnowCtor(MyClass);
   * 
   * isKnwonCtor(MyClass); // false;
   */


  function removeKnownCtor(ctor, inherited) {
    if (!inherited) {
      return _remove(ctor);
    } else {
      return _remove(ctor, _indexOf(ctor, inherited));
    }
  }
  /**
   * Adds provided class definition to `known ctors` array
   * @param {function} arg 
   * @returns arg on success, undefined on fail
   */

  function addKnownCtor(arg) {
    if (typeof arg !== 'function' || _isKnownCtor(arg)) {
      return;
    }

    knownCtors.push(arg);
    return arg;
  }
  /**
   * Checks if a given arguments is any of `known ctor`
   * @param {*} arg 
   * @returns true if given argument is known ctor otherwise false
   */

  function isKnownCtor(arg) {
    if (typeof arg !== 'function') return false;
    return _isKnownCtor(arg);
  }
  /**
   * Checks if a given argument is an instance of any `known ctor`
   * @param {*} arg 
   * @returns true if given argument is instance of known ctor otherwise false
   */

  function isKnownCtorInstance(arg) {
    if (arg == null) return false;
    return !!_iterate(_instanceOfCtor, [arg]);
  }

  /**
   * Invokes value and return invoked value if value is a function and not one of known ctors.
   * @param {any} value
   * @param {*} invokeArgs - will be used as invoke argument / arguments
   * @param {*} invokeContext  - will be used as invoke context
   * @example 
   * invokeValue(value); -> value.call();
   * invokeValue(value, undefined, context); -> value.call(context);
   * invokeValue(value, [], context); -> value.apply(context, []);
   * invokeValue(value, null, context); -> value.call(context, null);
   * invokeValue(value, [null], context); -> value.apply(context, [null]);
   * invokeValue(value, someArg, context); -> value.call(context, someArg);
   * invokeValue(value, someArg); -> value.call(undefined, someArg);
   * @returns value if its not a function or invoked value
   */

  function invokeValue(value, invokeArgs, invokeContext) {
    if (typeof value !== 'function' || isKnownCtor(value)) {
      return value;
    }

    if (invokeArgs === void 0) {
      return value.call(invokeContext);
    } else if (Array.isArray(invokeArgs)) {
      return value.apply(invokeContext, invokeArgs);
    } else {
      return value.call(invokeContext, invokeArgs);
    }
  }

  // export function isClassFunction(arg, functionToo) {
  //     if (arg != null && typeof arg === 'function') {
  //         let text = arg.toString();
  //         if (text.startsWith('class')) {
  //             return true;
  //         }
  //         if (functionToo && text.startsWith('function')) {
  //             return true;
  //         }
  //     }
  // }

  function isClassFunction(arg, functionToo) {
    // this function was made to test is provided argument is a function AND can be used with `new` keyword
    // but because of babel transpile downgraded to only function check
    // basicaly this should exclude arrow function by default and usual function with `functionToo` true
    return typeof arg === 'function';
  }

  function isBuildOptions(arg) {
    return arg && isClassFunction(arg["class"]);
  } // trying to convert given arg to { class: ..., ... }
  // can handle arg: Class, () => Class, 


  function normalizeBuildOptions(arg, invokeArgs, invokeContext) {
    if (arg == null) {
      return;
    } else if (isBuildOptions(arg)) {
      return arg;
    }

    arg = invokeValue(arg, invokeArgs, invokeContext);

    if (arg == null) {
      return;
    } else if (isKnownCtor(arg)) {
      return {
        "class": arg
      };
    } else if (_typeof(arg) === 'object') {
      return arg;
    }
  } // build options must have `class` property with constructor in it

  function ensureBuildOptions(options, shouldThrow) {
    if (!isBuildOptions(options)) {
      if (shouldThrow) throw new Error('provided buildOptions is not an object or does not have `entityClass` property');else return false;
    }

    return true;
  } // clone object and omit rest properties
  // cloneObject(obj, 'property1', 'property2', ...) - will omit property1 and property2 in new object

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
   * @typedef configuration
   * @type {object}
   * @property {boolean} shouldThrow - defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error
   * @example
   * import { builderConfig } from 'yaff-entitybuilder'
   * builderConfig.shouldThrow = true;
   */
  var builderConfig = {
    shouldThrow: false
  };

  /**
   * @typedef buildOptions
   * @type {object}
   * @property {func} class - required. Class to build
   * @property {array} [ctorArguments] - optional. for multiple arguments constructor
   * @example <caption>Single consructor argument</caption>
   * {
   *   class: MyClass,
   *   option1: 'foo',
   *   option2: 'bar'
   * }
   * => new MyClass({ option1: 'foo', option: 'bar' })
   * @example <caption>Multiple constructor arguments</caption>
   * {
   *   class: MyClass,
   *   ctorArguments: ['abc','qwe']
   *   option1: 'foo',
   *   option2: 'bar'
   * }
   * => new MyClass('abc', 'qwe')
   * note: in multi argument behavior any properties except `class` and `ctorArguments` will be ignnored
   */

  /**
   * Builds an entity from provided buildOptions, if given value is a function it will be invoked with provided invokeArgs and invokeContext, see: `invokeValue`
   * @param {buildOptions|func<buildOptions>} arg  - buildOptions obj or function returned BuildOptions or Class definition
   * @param {any} [invokeArgs] - optional, arguments for invoke function arg, see `invokeValue`
   * @param {any} [invokeContext] - optional, context for invoke function arg, see `invokeValue`
   * @returns entity instance or undefined
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

  exports.addKnownCtor = addKnownCtor;
  exports.build = build;
  exports.builderConfig = builderConfig;
  exports.invokeValue = invokeValue;
  exports.isKnownCtor = isKnownCtor;
  exports.isKnownCtorInstance = isKnownCtorInstance;
  exports.knownCtors = knownCtors;
  exports.normalizeBuildOptions = normalizeBuildOptions;
  exports.removeKnownCtor = removeKnownCtor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
