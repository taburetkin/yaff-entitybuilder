import { isKnownCtor } from './knownCtors.js';

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
 export function invokeValue(value, invokeArgs, invokeContext)
 {
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