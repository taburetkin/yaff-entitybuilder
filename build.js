
import { builderConfig } from './builderConfig.js';
import { isKnownCtorInstance } from './knownCtors';
import { normalizeBuildOptions, ensureBuildOptions, cloneObject } from './utils.js';

/**
 * Builds an entity from provided buildOptions, if given value is a function it will be invoked with provided invokeArgs and invokeContext, see: `invokeValue`
 * @param {object|func} arg  - buildOptions obj (@see buildOptions.js) or function returned BuildOptions or Class definition
 * @param {any} invokeArgs - optional, arguments for invoke function arg, see `invokeValue`
 * @param {obj} invokeContext - optional, context for invoke function arg, see `invokeValue`
 * @returns entity instance or undefined
 */
export function build(arg, invokeArgs, invokeContext) {

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