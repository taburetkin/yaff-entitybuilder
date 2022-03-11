/**
 * Known Ctors array
 * holds class definitions for determine should builder invoke provided function to extract result or not in case its a registered class definition
 * @example
 * let test1 = String;
 * let test2 = () => {};
 * isKnownCtor(test1) // true
 * isKnownCtor(test2) // false
 * 
 * //example invoke function:
 * function invoke(arg, invokeArgs = [], invokeContext) {
 *   if (typeof arg === 'function' && !isKnownCtor(arg)) {
 *     arg = arg.apply(invokeContext, invokeArgs);
 *   }
 *   return arg;
 * }
 */
const knownCtors = [
    String,
    Number,
    Date,
    Boolean
];

function _remove(ctor, index) {
    //console.log('-rem-', index);
    if (index == null)
        index = knownCtors.indexOf(ctor);
    if (index > -1) {
        let res = knownCtors.splice(index, 1);
        return res[0];
    }
}

function _isEqualOrInheritedOrBase(arg, ctor, isBase) {
    return arg === ctor 
        || (
            isBase 
                ? ctor.prototype instanceof arg
                : arg.prototype instanceof ctor
            );
}

function _iterate(action, args) {
    let len = knownCtors.length;
    for (let x = 0; x < len; x++) {
        let ctor = knownCtors[x];
        let result = action(ctor, x, ...args);
        if (result !== undefined)
            return result;
    }
}
function _indexOfCtor(ctor, index, arg, isBase) {
    if (_isEqualOrInheritedOrBase(arg, ctor, isBase))
        return index;
}
function _indexOf(arg, isBase) {
    let res = _iterate(_indexOfCtor, [arg, isBase]);
    return res == null ? -1 : res;
}

function _isKnownCtor(arg) {
    return _indexOf(arg) > -1;
}

function _instanceOfCtor(ctor, index, arg, isBase) {
    if (arg instanceof ctor)
        return true;
}

/**
 * Removes provided class definition from `known ctors` array
 * @param {func} ctor - Class to remove
 * @param {boolean} inherited - false: will remove exactly provided class, true: will remove any one inherited or exactly provided
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
 * @param {func} arg 
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
 * @param {any} arg 
 * @returns true if given argument is known ctor otherwise false
 */
function isKnownCtor(arg) {
    if (typeof arg !== 'function')
        return false;    
    return _isKnownCtor(arg);
}

/**
 * Checks if a given argument is an instance of any `known ctor`
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
 * @property {boolean} shouldThrow - defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error
 */
const builderConfig = {
    /** defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error */
    shouldThrow: false
};

// export function isClassFunction(arg, functionToo) {
//     console.log('-isclass-', arg, arg.toString(), functionToo);
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
    //console.log('-isclass-', arg && arg.toString());
    // this function was made to test is provided argument is a function AND can be used with `new` keyword
    // but because of babel transpile downgraded to only function check
    // basicaly this should exclude arrow function by default and usual function with `functionToo` true
    return typeof arg === 'function';
}

function normalizeBuildOptions(arg, invokeArgs = [], invokeContext) {
    if (arg == null) return;

    let type = typeof arg;

    if (type === 'function') {
        if (isKnownCtor(arg)) {            
            return { class: arg };
        }
        else {
            return normalizeBuildOptions(
                arg.apply(invokeContext, invokeArgs),
                invokeArgs,
                invokeContext
            );
        }
    }

    if (type === 'object' && isClassFunction(arg.class))
        return arg;
}

function ensureBuildOptions(options, shouldThrow)
{
    if (!options || typeof options.class !== 'function') {
        if (shouldThrow)
            throw new Error('provided buildOptions is not an object or does not have `entityClass` property');
        else
            return false;
    }
    return true;
}

function cloneObject(obj) {
    if (obj == null) return;
    if (typeof obj !== 'object') return obj;

    let cloned = Object.assign({}, obj);

    for(let x = 1; x < arguments.length; x++)
        delete cloned[arguments[x]];

    return cloned;
}

/**
 * Builds an entity from provided buildOptions
 * @param {object|func} arg  - buildOptions obj (@see buildOptions.js) or function returned BuildOptions or Class definition
 * @param {array} invokeArgs - optional, arguments for invoke function arg
 * @param {obj} invokeContext - optional, context for invoke function arg
 * @returns entity instance or undefined
 */
function build(arg, invokeArgs, invokeContext) {

    if (isKnownCtorInstance(arg))
        return arg;

    let options = normalizeBuildOptions(arg, invokeArgs, invokeContext);
    
    if (!ensureBuildOptions(options, builderConfig.shouldThrow))
        return;

    let EntityClass = options.class;
    let ctorArgs = [];

    if (options.ctorArguments && Array.isArray(options.ctorArguments)) {
        ctorArgs = options.ctorArguments;
    } else {
        let entityOptions = cloneObject(options, 'class');
        ctorArgs.push(entityOptions);
    }

    return new EntityClass(...ctorArgs);

}

export { addKnownCtor, build, builderConfig, isKnownCtor, isKnownCtorInstance, knownCtors, removeKnownCtor };
