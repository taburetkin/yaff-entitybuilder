/**
 * @typedef configuration
 * @type {object}
 * @property {boolean} shouldThrow - defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error
 * @example
 * import { builderConfig } from 'yaff-entitybuilder'
 * builderConfig.shouldThrow = true;
 */
export const builderConfig = {
    shouldThrow: false
}