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
    if (typeof arg !== 'function')
        return false;    
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
const builderConfig = {
    /** defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error */
    shouldThrow: false
};

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

    if (type === 'object' && typeof arg.class === 'function')
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
 * 
 * @param {object|func} arg  - BuildOptions obj or function returned BuildOptions or Class definition
 * @param {array} invokeArgs - optional, arguments for invoke function arg
 * @param {obj} invokeContext - optional, context for invoke function arg
 * @returns 
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

export { build, builderConfig, isKnownCtor, knownCtors, removeKnownCtor };
