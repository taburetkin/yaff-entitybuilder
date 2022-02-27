import { isKnownCtor } from "./knownCtors.js";

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

export function isClassFunction(arg, functionToo) {
    //console.log('-isclass-', arg && arg.toString());
    // this function was made to test is provided argument is a function AND can be used with `new` keyword
    // but because of babel transpile downgraded to only function check
    // basicaly this should exclude arrow function by default and usual function with `functionToo` true
    return typeof arg === 'function';
}

export function normalizeBuildOptions(arg, invokeArgs = [], invokeContext) {
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

    if (type === 'object' && isClassFunction(arg.class, true))
        return arg;
}

export function ensureBuildOptions(options, shouldThrow)
{
    if (!options || typeof options.class !== 'function') {
        if (shouldThrow)
            throw new Error('provided buildOptions is not an object or does not have `entityClass` property');
        else
            return false;
    }
    return true;
}

export function cloneObject(obj) {
    if (obj == null) return;
    if (typeof obj !== 'object') return obj;

    let cloned = Object.assign({}, obj);

    for(let x = 1; x < arguments.length; x++)
        delete cloned[arguments[x]];

    return cloned;
}
