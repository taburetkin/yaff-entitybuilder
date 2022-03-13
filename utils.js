import { isKnownCtor } from "./knownCtors.js";
import { invokeValue } from './invokeValue';
// comented because of babel transpile
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

export function isClassFunction(arg, functionToo) {
    // this function was made to test is provided argument is a function AND can be used with `new` keyword
    // but because of babel transpile downgraded to only function check
    // basicaly this should exclude arrow function by default and usual function with `functionToo` true
    return typeof arg === 'function';
}

function isBuildOptions(arg) {
    return arg && isClassFunction(arg.class, true);
}


// trying to convert given arg to { class: ..., ... }
// can handle arg: Class, () => Class, 
export function normalizeBuildOptions(arg, invokeArgs, invokeContext) {

    if (arg == null) {
        return;
    } else if (isBuildOptions(arg)) {
        return arg;
    }

    arg = invokeValue(arg, invokeArgs, invokeContext);

    if (arg == null) {

        return;

    } else if (isKnownCtor(arg)) {

        return { class: arg };

    } else if (typeof arg === 'object') {

        return arg;

    }

}

// build options must have `class` property with constructor in it
export function ensureBuildOptions(options, shouldThrow)
{
    if (!isBuildOptions(options)) {
        if (shouldThrow)
            throw new Error('provided buildOptions is not an object or does not have `entityClass` property');
        else
            return false;
    }
    return true;
}

// clone object and omit rest properties
// cloneObject(obj, 'property1', 'property2', ...) - will omit property1 and property2 in new object
export function cloneObject(obj) {
    if (obj == null) return;
    if (typeof obj !== 'object') return obj;

    let cloned = Object.assign({}, obj);

    for(let x = 1; x < arguments.length; x++)
        delete cloned[arguments[x]];

    return cloned;
}
