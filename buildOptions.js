/**
 * Build options.
 * 
 * @namespace {buildOptions} buildOptions
 * @property {func} class - required. Class to build
 * @property {array} ctorArguments - optional. for multiple arguments constructor
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
 

