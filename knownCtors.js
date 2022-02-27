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
export const knownCtors = [
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
export function removeKnownCtor(ctor, inherited) {
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
export function addKnownCtor(arg) {
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
export function isKnownCtor(arg) {
    if (typeof arg !== 'function')
        return false;    
    return _isKnownCtor(arg);
}

/**
 * Checks if a given argument is an instance of any `known ctor`
 * @param {any} arg 
 * @returns true if given argument is instance of known ctor otherwise false
 */
export function isKnownCtorInstance(arg) {
    if (arg == null) return false;
    return !!_iterate(_instanceOfCtor, [arg]);
}