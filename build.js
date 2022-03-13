
import { builderConfig } from './builderConfig.js';
import { isKnownCtorInstance } from './knownCtors';
import { normalizeBuildOptions, ensureBuildOptions, cloneObject } from './utils.js';


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